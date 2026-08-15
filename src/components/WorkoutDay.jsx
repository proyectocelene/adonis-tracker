import React, { useState, useEffect } from 'react';
import { scientificProtocol } from '../data/scientificProtocol';
import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary';
import ExerciseRow from './ExerciseRow';
import CardioLogger from './CardioLogger';
import TimelineSelector from './workout/TimelineSelector';
import MonthlyCalendar from './workout/MonthlyCalendar';
import GlosarioModal from './common/GlosarioModal';
import RoutineManagerModal from './workout/RoutineManagerModal';
import GymMembershipReminder from './common/GymMembershipReminder';
import WorkoutHeader from './workout/WorkoutHeader';
import WorkoutLiveStats from './workout/WorkoutLiveStats';
import WorkoutExerciseList from './workout/WorkoutExerciseList';
import AddCustomExerciseModal from './workout/AddCustomExerciseModal';
import WorkoutFooterControls from './workout/WorkoutFooterControls';
import { getPreviousDataForExercise } from '../utils/exerciseMatcher';
import { calculateVolume, calculate1RM, calculateAverageRPE } from '../hooks/useWorkoutCalculations';
import { useIndexedDB as useLocalStorage } from '../hooks/useIndexedDB';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { Target, Calendar as CalendarIcon, Clock, ArrowRight, Loader2, Dumbbell, Save, Activity, Trash2, Cpu, FileText, CheckCircle, RotateCcw, ChevronDown, ChevronUp, RefreshCw, RefreshCcw, Plus, X, Layers, Settings2, Cloud, FileSpreadsheet, Lock, Sparkles, BookOpen, Copy, HelpCircle, Check, Flame, ShieldCheck, Zap, Database, History } from 'lucide-react';
import { useModal } from './common/UIComponents';

export default function WorkoutDay() {
  const modal = useModal();
  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  
  // 1. Estados y Hooks de Base de Datos / LocalStorage al inicio
  const [customRoutine, setCustomRoutine] = useLocalStorage('coachv2_custom_routine', null);
  const [mesocycleStartDate, setMesocycleStartDate] = useLocalStorage('coachv2_mesocycle_start', null);
  const [customExercisesMap, setCustomExercisesMap] = useLocalStorage('coachv2_custom_day_exercises', {});
  const [swappedExercisesMap, setSwappedExercisesMap] = useLocalStorage('coachv2_swapped_exercises', {});
  const [exerciseOrderMap, setExerciseOrderMap] = useLocalStorage('coachv2_exercise_orders', {});
  const [globalWarmupDone, setGlobalWarmupDone] = useLocalStorage('coachv2_global_warmup', {});
  const [currentSessions, setCurrentSessions, isSessionsLoading] = useLocalStorage('coachv2_active_workouts', {});
  const [bodyMetrics, , isMetricsLoading] = useLocalStorage('coachv2_body_metrics_history', []);
  const [workoutHistory, setWorkoutHistory, isHistoryLoading, saveSession, deleteSession] = useWorkoutHistory();
  const [apiKey] = useLocalStorage('coachv2_deepseek_apikey', '');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useLocalStorage('coachv2_google_sheets_url', 'https://script.google.com/macros/s/AKfycbxA-KbUcEgWUq4jvjdSBxLw3tGsgPxXsF2Y7mX5JsNIpE2qslN1v7xW3NqdJ3-4b-RCwg/exec');

  const isLoadingDb = isHistoryLoading || isSessionsLoading || isMetricsLoading;

  // 2. Estados locales de navegación y vistas
  const [selectedDateKey, setSelectedDateKey] = useState(todayStr);
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    let day = new Date().getDay();
    if (day === 0) day = 7; 
    return day - 1;
  });

  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(true);
  const [showGlosarioModal, setShowGlosarioModal] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExScope, setNewExScope] = useState('today'); // 'today' | 'permanent'
  const [showRoutineBuilder, setShowRoutineBuilder] = useState(false);
  const [showSecondaryTools, setShowSecondaryTools] = useState(false);

  // Formulario nuevo ejercicio
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('3');
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExRest, setNewExRest] = useState('90 s');
  const [newExBiomech, setNewExBiomech] = useState('');
  const [newExMuscleGroup, setNewExMuscleGroup] = useState('General');

  // Acordeón Exclusivo de Ejercicio
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

  // Estados AI
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const isViewingHistory = selectedDateKey !== todayStr;
  let historySession = null;
  if (workoutHistory && workoutHistory.length > 0) {
    historySession = workoutHistory.find(s => {
      if (!s) return false;
      
      // 1. Prioridad: Matching exacto por la fecha guardada (s.date suele ser YYYY-MM-DD en Local Time)
      if (s.date === selectedDateKey) return true;
      
      // 2. Fallback: Parsear el timestamp a Local Time (ignorando startsWith que falla por diferencias UTC)
      if (s.timestamp) {
        const d = new Date(s.timestamp);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (key === selectedDateKey) return true;
        }
      }
      
      // 3. Fallback final: id que contenga _YYYY-MM-DD
      if (s.id && s.id.includes(`_${selectedDateKey}`)) return true;
      
      return false;
    });
  }

  // 3. Variables derivadas en orden estricto de dependencias
  const activeDays = (customRoutine && Array.isArray(customRoutine) && customRoutine.length > 0) ? customRoutine : scientificProtocol;
  
  // Si existe una sesión guardada para esta fecha, usar su dayId correspondiente (ej. d3 Jalón)
  let effectiveDayIndex = currentDayIndex;
  if (historySession && historySession.dayId) {
    const histIndex = activeDays.findIndex(d => d.id === historySession.dayId);
    if (histIndex !== -1) {
      effectiveDayIndex = histIndex;
    }
  }

  const baseDay = activeDays[effectiveDayIndex] || activeDays[0] || scientificProtocol[0];
  const [newExTargetDay, setNewExTargetDay] = useState(baseDay.id);

  // === CÁLCULO DE SEMANA AUTOMÁTICO ===
  let currentWeek = 1;
  if (mesocycleStartDate) {
    const startDate = new Date(mesocycleStartDate);
    startDate.setHours(0,0,0,0);
    const startDay = startDate.getDay() || 7;
    startDate.setDate(startDate.getDate() - startDay + 1); // Lunes de esa semana

    const selectedDateObj = new Date(selectedDateKey + 'T12:00:00');
    const diffTime = selectedDateObj.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const calculatedWeek = Math.floor(diffDays / 7) + 1;
    currentWeek = calculatedWeek > 0 ? calculatedWeek : 1;
  } else if (!isHistoryLoading && workoutHistory && workoutHistory.length > 0) {
    const earliest = workoutHistory.reduce((min, s) => {
      const d = new Date(s.timestamp || s.date).getTime();
      return d < min ? d : min;
    }, Infinity);
    if (earliest !== Infinity) {
      setMesocycleStartDate(new Date(earliest).toISOString());
    }
  } else if (!isHistoryLoading && workoutHistory && workoutHistory.length === 0 && !mesocycleStartDate) {
    setMesocycleStartDate(new Date().toISOString());
  }

  // === SINCRONIZAR currentDayIndex CON FECHA O HISTORIAL ===
  useEffect(() => {
    if (historySession && historySession.dayId) {
      const histIndex = activeDays.findIndex(d => d.id === historySession.dayId);
      if (histIndex !== -1) {
        setCurrentDayIndex(histIndex);
        return;
      }
    }
    const d = new Date(selectedDateKey + 'T12:00:00');
    if (!isNaN(d.getTime())) {
      let day = d.getDay();
      if (day === 0) day = 7;
      setCurrentDayIndex(day - 1);
    }
  }, [selectedDateKey, historySession?.dayId]);

  const getDayDataForWeek = (sessions, week, dayId) => {
    if (!sessions) return {};
    const weekKey = `week_${week}`;
    if (!sessions[weekKey] && week === 1 && sessions[dayId]) {
      return sessions[dayId] || {};
    }
    return sessions[weekKey] ? (sessions[weekKey][dayId] || {}) : {};
  };

  const userCustomForDay = customExercisesMap[baseDay.id] || [];
  const baseDayExercises = baseDay.exercises || [];
  
  // Extraer cualquier ejercicio temporal agregado exclusivamente para la sesión de hoy
  const temporaryTodayExercises = [];
  const activeSessionWeek = currentSessions ? (currentSessions[`week_${currentWeek}`] || (currentWeek === 1 ? currentSessions : {})) : {};
  const rawDayData = isViewingHistory ? (historySession?.exercises || {}) : (activeSessionWeek[baseDay.id] || {});
  
  Object.keys(rawDayData).forEach(exId => {
    const d = rawDayData[exId];
    if (d && (d.isTemporaryToday || exId.startsWith('temp_today_')) && !baseDayExercises.some(e => e.id === exId) && !userCustomForDay.some(e => e.id === exId)) {
      temporaryTodayExercises.push({
        id: exId,
        name: d.name || 'Ejercicio Hoy',
        muscleGroup: d.muscleGroup || 'General',
        sets: d.customSetsCount || 3,
        reps: d.reps || '10-12',
        restTime: d.restTime || '90 s',
        biomechanics: d.biomechanics || 'Control de técnica e IAP.',
        isTemporaryToday: true,
        isCustom: true
      });
    }
  });

  const rawExercises = [...baseDayExercises, ...userCustomForDay, ...temporaryTodayExercises];

  // Reordenamiento dinámico por día (para máquinas ocupadas)
  const customOrder = exerciseOrderMap[baseDay.id];
  let orderedExercises = rawExercises.map(ex => {
    const swapped = (swappedExercisesMap[baseDay.id] || {})[ex.id];
    if (swapped) {
      return { ...ex, ...swapped, originalName: ex.name };
    }
    return ex;
  });

  if (customOrder && Array.isArray(customOrder)) {
    orderedExercises.sort((a, b) => {
      const idxA = customOrder.indexOf(a.id);
      const idxB = customOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }

  const currentDay = {
    ...baseDay,
    exercises: orderedExercises
  };

  const handleMoveExercise = (exerciseId, direction) => {
    const dayId = baseDay.id;
    const currentOrderList = currentDay.exercises.map(x => x.id);
    const index = currentOrderList.indexOf(exerciseId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrderList.length) return;

    const newOrderList = [...currentOrderList];
    const temp = newOrderList[index];
    newOrderList[index] = newOrderList[targetIndex];
    newOrderList[targetIndex] = temp;

    setExerciseOrderMap(prev => ({
      ...prev,
      [dayId]: newOrderList
    }));
  };

  let todayWorkoutData = {};
  if (historySession && historySession.exercises && Object.keys(historySession.exercises).length > 0) {
    todayWorkoutData = historySession.exercises;
  } else {
    todayWorkoutData = getDayDataForWeek(currentSessions, currentWeek, currentDay.id);
  }

  const getPreviousDataForDay = () => {
    if (currentWeek > 1) {
      const prevWeekLog = [...workoutHistory].reverse().find(s => s.dayId === currentDay.id && s.weekNumber === (currentWeek - 1));
      if (prevWeekLog && prevWeekLog.exercises) return prevWeekLog.exercises;

      const prevWeekActive = getDayDataForWeek(currentSessions, currentWeek - 1, currentDay.id);
      if (Object.keys(prevWeekActive).length > 0) return prevWeekActive;
    }
    const lastLog = [...workoutHistory].reverse().find(s => s.dayId === currentDay.id && (s.weekNumber || 1) < currentWeek);
    return lastLog ? (lastLog.exercises || {}) : {};
  };

  const previousExercisesData = getPreviousDataForDay();
  const previousSession = [...workoutHistory].reverse().find(s => s.dayId === currentDay.id);

  const updateSessionDataForCurrentDay = (updater) => {
    // Si estamos modificando una sesión que ya existe en el historial oficial para esta fecha:
    if (historySession) {
      const currentExercises = historySession.exercises || {};
      const newExercises = updater(currentExercises);

      let recalculatedVol = 0;
      let recSets = 0;
      Object.values(newExercises).forEach(exLogs => {
        if (exLogs && typeof exLogs === 'object') {
          Object.keys(exLogs).forEach(k => {
            if (!isNaN(parseInt(k))) {
              const s = exLogs[k];
              if (s && s.completed) {
                recSets++;
                let w = parseFloat(s.weight) || 0;
                if (s.unit === 'kg') w *= 2.20462;
                const r = parseFloat(s.reps) || 0;
                recalculatedVol += (w * r);
              }
            }
          });
        }
      });

      const updated = {
        ...historySession,
        exercises: newExercises,
        volume: Math.round(recalculatedVol),
        completedSets: recSets,
        isCompleted: recSets > 0 || recalculatedVol > 0
      };

      saveSession(updated);
      return;
    }

    setCurrentSessions(prev => {
      const weekKey = `week_${currentWeek}`;
      let existingWeekData = prev[weekKey] || {};
      if (currentWeek === 1 && !prev[weekKey] && (prev.day_1 || prev.day_2 || prev.day_3 || prev.day_4 || prev.day_5 || prev.day_6)) {
        existingWeekData = { ...prev };
      }
      const dayData = existingWeekData[currentDay.id] || {};
      const newDayData = updater(dayData);

      return {
        ...prev,
        [weekKey]: {
          ...existingWeekData,
          [currentDay.id]: newDayData
        }
      };
    });
  };

  const handleUpdateSet = (exerciseId, setNumber, setData) => {
    updateSessionDataForCurrentDay(dayData => {
      const exData = dayData[exerciseId] || {};
      return {
        ...dayData,
        [exerciseId]: {
          ...exData,
          [setNumber]: setData
        }
      };
    });
  };

  const handleUpdateExerciseMeta = (exerciseId, metaData) => {
    updateSessionDataForCurrentDay(dayData => {
      const exData = dayData[exerciseId] || {};
      return {
        ...dayData,
        [exerciseId]: {
          ...exData,
          ...metaData
        }
      };
    });
  };

  const handleUpdateCardio = (exerciseId, cardioData) => {
    updateSessionDataForCurrentDay(dayData => {
      return {
        ...dayData,
        [exerciseId]: cardioData
      };
    });
  };

  const handleClonePreviousWeek = () => {
    if (currentWeek <= 1) return;
    const prevData = getPreviousDataForDay();
    if (!prevData || Object.keys(prevData).length === 0) {
      modal.showAlert({
        title: "⚠️ Sin registros previos en S" + (currentWeek - 1),
        message: `No se encontraron datos registrados en la Semana ${currentWeek - 1} para el día: "${currentDay.name}".`,
        variant: "warning"
      });
      return;
    }

    const clonedDayData = {};
    Object.keys(prevData).forEach(exId => {
      const exVal = prevData[exId];
      if (exVal && exVal.machine) {
        clonedDayData[exId] = { ...exVal, completed: false };
      } else if (exVal) {
        clonedDayData[exId] = { ...exVal };
        Object.keys(exVal).forEach(k => {
          if (!isNaN(parseInt(k))) {
            clonedDayData[exId][k] = { ...exVal[k], completed: false };
          }
        });
      }
    });

    updateSessionDataForCurrentDay(() => clonedDayData);
    modal.showAlert({
      title: "⚡️ ¡Pesos Clonados Exitosamente!",
      message: `Se copiaron las cargas y repeticiones de la Semana ${currentWeek - 1} como guía base.`,
      variant: "success"
    });
  };

  const handleSwapExercise = (exerciseId, newExerciseData) => {
    setSwappedExercisesMap(prev => {
      const daySwaps = { ...(prev[baseDay.id] || {}) };
      if (!newExerciseData) {
        delete daySwaps[exerciseId];
      } else {
        daySwaps[exerciseId] = newExerciseData;
      }
      return {
        ...prev,
        [baseDay.id]: daySwaps
      };
    });
    if (newExerciseData) {
      modal.showAlert({
        title: "🔄 Ejercicio Sustituido",
        message: `El ejercicio fue actualizado por "${newExerciseData.name}".`,
        variant: "success"
      });
    }
  };

  const handlePickFromLibrary = (libId) => {
    if (!libId) return;
    const item = UNIFIED_EXERCISE_LIBRARY.find(x => x.id === libId);
    if (item) {
      setNewExName(item.name);
      setNewExMuscleGroup(item.muscleGroup || 'General');
      setNewExSets(item.defaultSets || 4);
      setNewExReps(item.defaultReps || '10-12');
      setNewExRest(item.defaultRest || '90 s');
      setNewExBiomech(item.biomechanics || '');
    }
  };

  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    if (newExScope === 'today') {
      const newExId = `temp_today_${Date.now()}`;
      const setsCount = parseInt(newExSets) || 3;
      updateSessionDataForCurrentDay(dayData => {
        const initialSets = {};
        for (let s = 1; s <= setsCount; s++) {
          initialSets[s] = { weight: '', reps: newExReps.split('-')[0] || '10', rpe: '8', completed: false, unit: 'lbs' };
        }
        return {
          ...dayData,
          [newExId]: {
            name: newExName.trim(),
            muscleGroup: newExMuscleGroup,
            customSetsCount: setsCount,
            reps: newExReps.trim() || '10-12',
            restTime: newExRest.trim() || '90 s',
            biomechanics: newExBiomech.trim() || 'Control de técnica e IAP.',
            isTemporaryToday: true,
            isCustom: true,
            ...initialSets
          }
        };
      });
      setNewExName('');
      setIsAddingExercise(false);
      modal.showAlert({
        title: "📌 Ejercicio Añadido a Hoy",
        message: `"${newExName.trim()}" fue agregado exclusivamente a la sesión de hoy.`,
        variant: "success"
      });
    } else {
      const targetDayId = newExTargetDay || baseDay.id;
      const newEx = {
        id: `custom_${Date.now()}`,
        name: newExName.trim(),
        muscleGroup: newExMuscleGroup,
        sets: parseInt(newExSets) || 3,
        reps: newExReps.trim() || '10-12',
        restTime: newExRest.trim() || '90 s',
        biomechanics: newExBiomech.trim() || 'Control de técnica e IAP.',
        isCustom: true
      };

      setCustomExercisesMap(prev => {
        const dayCustoms = prev[targetDayId] || [];
        return {
          ...prev,
          [targetDayId]: [...dayCustoms, newEx]
        };
      });

      setNewExName('');
      setIsAddingExercise(false);
      modal.showAlert({
        title: "🔄 Ejercicio Guardado en Rutina",
        message: `"${newEx.name}" fue agregado a la rutina fija de ${baseDay.name}.`,
        variant: "success"
      });
    }
  };

  const calculateVolumeAndSets = () => {
    let completedSetsCount = 0;
    let cardioCount = 0;
    const allCompletedSets = [];

    Object.keys(todayWorkoutData).forEach(exId => {
      const exLogs = todayWorkoutData[exId];
      if (exLogs) {
        if (exLogs.completed && (exLogs.cardioDone || exLogs.machine)) {
          cardioCount++;
        }
        Object.keys(exLogs).forEach(key => {
          if (!isNaN(parseInt(key))) {
            const setObj = exLogs[key];
            if (setObj && setObj.completed) {
              completedSetsCount++;
              allCompletedSets.push(setObj);
            }
          }
        });
      }
    });

    const totalVolume = calculateVolume(allCompletedSets);
    return { volume: Math.round(totalVolume), completedSets: completedSetsCount, cardioCompleted: cardioCount };
  };

  const { volume, completedSets, cardioCompleted } = calculateVolumeAndSets();

  // Función para reiniciar o limpiar el borrador del día actual
  const handleClearCurrentDraft = () => {
    modal.showConfirm({
      title: "🗑️ ¿Limpiar Registro de este Día?",
      message: "¿Deseas borrar las casillas marcadas de esta fecha y empezar en limpio? (Tu historial pasado seguirá intacto).",
      confirmText: "Sí, Limpiar a 0",
      cancelText: "Cancelar",
      variant: "warning",
      onConfirm: async () => {
        const sessionKey = `${selectedDateKey}_${currentDay.id}`;
        setCurrentSessions(prev => {
          const next = { ...(prev || {}) };
          delete next[sessionKey];
          return next;
        });

        // Si había una sesión archivada en Firebase para esta fecha exacta, eliminarla también
        const sessionId = `ses_${selectedDateKey}_${currentDay.id}`;
        if (deleteSession) await deleteSession(sessionId);

        modal.showAlert({
          title: "🧹 Día Limpiado",
          message: "Los registros de este día han sido reiniciados a 0.",
          variant: "info"
        });
      }
    });
  };

  const handleFinishWorkout = () => {
    modal.showConfirm({
      title: `🏁 ¿Archivar Sesión en Bitácora?`,
      message: `Resumen de tu entrenamiento del ${selectedDateKey}:\n\n💪 Series completadas: ${completedSets}\n🔥 Volumen Total Levantado: ${volume.toLocaleString()} lbs-reps\n\n¿Archivar datos oficiales?`,
      confirmText: "💾 Sí, Archivar Ahora",
      cancelText: "Continuar Entrenando",
      variant: "success",
      onConfirm: async () => {
        const sessionId = historySession?.id || `ses_${selectedDateKey}_${currentDay.id}`;
        const sessionDate = new Date(`${selectedDateKey}T12:00:00`);
        const sessionLog = {
          id: sessionId,
          weekNumber: currentWeek,
          weekName: `Semana ${currentWeek}`,
          date: selectedDateKey,
          timestamp: sessionDate.toISOString(),
          dateString: sessionDate.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
          dayId: currentDay.id,
          dayName: currentDay.name,
          focus: currentDay.focus,
          volume,
          completedSets,
          cardioCompleted,
          exercises: todayWorkoutData,
          isCompleted: true,
          isRestDay: false,
          isMissedDay: false
        };

        // Guardar en Firebase Collection y sincronizar
        await saveSession(sessionLog);

        modal.showAlert({
          title: "🎉 ¡Entrenamiento Archivado!",
          message: `Sesión de ${selectedDateKey} (${currentDay.name}) guardada con éxito (${volume.toLocaleString()} lbs-reps).`,
          variant: "success"
        });
      }
    });
  };

  const handleSaveSpecialDay = (type) => {
    const isRest = type === 'rest';
    const title = isRest ? "💤 ¿Marcar como Día de Descanso?" : "❌ ¿Registrar Falta / No Entrené?";
    const msg = isRest
      ? `Se guardará el ${selectedDateKey} como día de descanso muscular programado en tu bitácora.`
      : `Se registrará una inasistencia para el ${selectedDateKey} en tu calendario.`;

    modal.showConfirm({
      title,
      message: msg,
      confirmText: isRest ? "Guardar Descanso" : "Registrar Falta",
      cancelText: "Cancelar",
      variant: isRest ? "info" : "danger",
      onConfirm: async () => {
        const sessionId = historySession?.id || `ses_${selectedDateKey}_${currentDay.id}`;
        const sessionDate = new Date(`${selectedDateKey}T12:00:00`);
        const sessionLog = {
          id: sessionId,
          weekNumber: currentWeek,
          weekName: `Semana ${currentWeek}`,
          date: selectedDateKey,
          timestamp: sessionDate.toISOString(),
          dateString: sessionDate.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
          dayId: currentDay.id,
          dayName: currentDay.name,
          focus: isRest ? 'Día de Descanso Programado' : 'Falta / Inasistencia al Gym',
          volume: 0,
          completedSets: 0,
          cardioCompleted: 0,
          exercises: {},
          isCompleted: false,
          isRestDay: isRest,
          isMissedDay: !isRest
        };

        await saveSession(sessionLog);

        modal.showAlert({
          title: isRest ? "💤 Descanso Registrado" : "❌ Falta Registrada",
          message: `El registro para ${selectedDateKey} se guardó exitosamente en tu bitácora.`,
          variant: "info"
        });
      }
    });
  };

  const handleResetCurrent = () => {
    modal.showConfirm({
      title: "🔄 ¿Reiniciar casillas de hoy?",
      message: "Se limpiarán los checks y pesos ingresados para este día en la pantalla actual.",
      confirmText: "Reiniciar",
      cancelText: "Cancelar",
      variant: "warning",
      onConfirm: () => {
        updateSessionDataForCurrentDay(() => ({}));
      }
    });
  };

  const handleResetToOfficialRoutine = () => {
    modal.showConfirm({
      title: "↺ Restablecer a Rutina Oficial",
      message: `¿Deseas restablecer ${baseDay.name} a la plantilla oficial limpia del Protocolo Adonis?\n\nSe eliminarán los swaps y ejercicios personalizados añadidos a este día. Tu historial previo de entrenamientos no se borrará.`,
      confirmText: "Restablecer a Oficial",
      cancelText: "Cancelar",
      variant: "warning",
      onConfirm: () => {
        setCustomExercisesMap(prev => ({ ...prev, [baseDay.id]: [] }));
        setSwappedExercisesMap(prev => ({ ...prev, [baseDay.id]: {} }));
        setExerciseOrderMap(prev => ({ ...prev, [baseDay.id]: [] }));
        setCustomRoutine(null);
        modal.showAlert({
          title: "✅ Rutina Restablecida",
          message: `${baseDay.name} ahora muestra exactamente los ejercicios del Protocolo Adonis Definitivo.`,
          variant: "success"
        });
      }
    });
  };

  const handleResetAllDaysToOfficial = () => {
    modal.showConfirm({
      title: "✨ Activar Protocolo Adonis Oficial en Toda la Semana",
      message: "Se limpiarán todas las sustituciones y ejercicios añadidos en los 7 días para activar la lista oficial limpia del Protocolo Adonis Definitivo.\n\nTu historial de marcas y bitácoras anteriores permanecerá 100% a salvo e intacto.",
      confirmText: "✨ Sí, Activar en Todos los Días",
      cancelText: "Cancelar",
      variant: "warning",
      onConfirm: () => {
        setCustomExercisesMap({});
        setSwappedExercisesMap({});
        setExerciseOrderMap({});
        setCustomRoutine(null);
        modal.showAlert({
          title: "🎉 Protocolo Adonis Definitivo Activado",
          message: "Todos los días de la semana ahora muestran la plantilla oficial limpia.",
          variant: "success"
        });
      }
    });
  };

  const handleOptimizeWithMath = () => {
    setIsAnalyzingAI(true);
    
    // Simulate slight processing time for UI effect
    setTimeout(() => {
      let analysisText = `Análisis Biomecánico - ${currentDay.name}\n\n`;
      let improvements = 0;
      let totalExercises = 0;

      currentDay.exercises.forEach(ex => {
        const todayLogs = todayWorkoutData[ex.id] || {};
        const prevLogs = previousExercisesData[ex.id] || {};
        
        let todayMaxWeight = 0;
        let todayMaxReps = 0;
        let todayEpley = 0;

        Object.keys(todayLogs).forEach(set => {
          if (!isNaN(parseInt(set)) && todayLogs[set].completed) {
            const w = parseFloat(todayLogs[set].weight) || 0;
            const r = parseInt(todayLogs[set].reps) || 0;
            const epley = calculate1RM(w, r);
            if (w > todayMaxWeight) { todayMaxWeight = w; todayMaxReps = r; }
            if (epley > todayEpley) todayEpley = epley;
          }
        });

        if (todayMaxWeight > 0) {
          totalExercises++;
          let prevMaxWeight = 0;
          let prevMaxReps = 0;
          let prevEpley = 0;

          Object.keys(prevLogs).forEach(set => {
             if (!isNaN(parseInt(set)) && prevLogs[set].completed) {
                const w = parseFloat(prevLogs[set].weight) || 0;
                const r = parseFloat(prevLogs[set].reps) || 0;
                const epley = calculate1RM(w, r);
                if (w > prevMaxWeight) { prevMaxWeight = w; prevMaxReps = r; }
                if (epley > prevEpley) prevEpley = epley;
             }
          });

          if (prevMaxWeight > 0) {
            if (todayEpley > prevEpley) {
              improvements++;
              if (todayMaxWeight > prevMaxWeight) {
                analysisText += `✅ ${ex.name}: +${todayMaxWeight - prevMaxWeight} lbs. ¡Sobrecarga por tensión mecánica lograda!\n`;
              } else if (todayMaxReps > prevMaxReps) {
                analysisText += `✅ ${ex.name}: +${todayMaxReps - prevMaxReps} reps. ¡Progresión en volumen y resistencia muscular!\n`;
              }
            } else if (todayEpley === prevEpley) {
               analysisText += `⚖️ ${ex.name}: Carga mantenida. Intenta empujar al fallo la próxima sesión o aplicar parciales elongadas.\n`;
            } else {
               analysisText += `⚠️ ${ex.name}: Ligero descenso de fuerza. Asegúrate de descansar bien el SNC y comer carbohidratos previos.\n`;
            }
          } else {
            analysisText += `📌 ${ex.name}: Línea base establecida (${todayMaxWeight} lbs). Progreso rastreable a partir de la próxima semana.\n`;
          }
        }
      });

      if (totalExercises === 0) {
        analysisText = "No hay series completadas hoy para realizar análisis matemático.";
      } else {
        analysisText += `\n🎯 Resumen: Lograste sobrecarga progresiva real en ${improvements} de ${totalExercises} ejercicios evaluados.`;
      }

      setAiAnalysisResult({ resumenSobrecarga: analysisText });
      setIsAnalyzingAI(false);
    }, 600);
  };



  const handleCopyRoutineForCoach = () => {
    let summaryText = `💪 PROTOCOLO ADONIS - RUTINA DE HOY\n`;
    summaryText += `🗓️ Semana ${currentWeek} • Día ${currentDay.dayNumber}: ${currentDay.name}\n`;
    summaryText += `🎯 Enfoque: ${currentDay.focus}\n\n`;
    
    currentDay.exercises.forEach((ex, idx) => {
      summaryText += `${idx + 1}. ${ex.name} [${ex.sets || 3} series x ${ex.reps || '10-12'}]\n`;
      const logs = todayWorkoutData[ex.id];
      if (logs && !ex.isCardio) {
        let loggedInfo = [];
        Object.keys(logs).forEach(setNum => {
          if (!isNaN(parseInt(setNum)) && logs[setNum].weight) {
            loggedInfo.push(`S${setNum}: ${logs[setNum].weight} ${logs[setNum].unit || 'lbs'} x ${logs[setNum].reps || 0}`);
          }
        });
        if (loggedInfo.length > 0) {
          summaryText += `   📊 Registrado: ${loggedInfo.join(" | ")}\n`;
        }
      }
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        modal.showAlert({ title: "📋 Copiado al Portapapeles", message: "Resumen de rutina copiado.", variant: "success" });
      });
    }
  };

  const getFirstUncompletedIdx = () => {
    for (let idx = 0; idx < currentDay.exercises.length; idx++) {
      const ex = currentDay.exercises[idx];
      const data = todayWorkoutData[ex.id];
      if (ex.isCardio) {
        if (!data?.completed) return idx;
      } else {
        const totalSets = parseInt(ex.sets) || 3;
        let completed = 0;
        if (data) {
          for (let s = 1; s <= totalSets; s++) {
            if (data[s]?.completed) completed++;
          }
        }
        if (completed < totalSets) return idx;
      }
    }
    return 0;
  };

  const firstUncompletedIdx = getFirstUncompletedIdx();
  const warmupKey = `${currentWeek}_${currentDay.id}`;
  const isWarmupDone = !!(globalWarmupDone[warmupKey] || (currentWeek === 1 && globalWarmupDone[currentDay.id]));

  if (isLoadingDb) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#0066ff' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Leyendo Base de Datos...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '90px' }}>
      {/* BARRA SUPERIOR DE SELECTOR DE MODO (MUTUAMENTE EXCLUSIVO) */}
      <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '18px', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => setShowMonthlyCalendar(true)}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '14px',
            background: showMonthlyCalendar ? '#ffffff' : 'transparent',
            color: showMonthlyCalendar ? '#0066ff' : '#64748b',
            fontWeight: '900',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: showMonthlyCalendar ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <CalendarIcon size={16} /> Calendario Mensual
        </button>
        <button
          type="button"
          onClick={() => setShowMonthlyCalendar(false)}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '14px',
            background: !showMonthlyCalendar ? '#0066ff' : 'transparent',
            color: !showMonthlyCalendar ? '#ffffff' : '#64748b',
            fontWeight: '900',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: !showMonthlyCalendar ? '0 4px 12px rgba(0, 102, 255, 0.3)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Dumbbell size={16} /> Rutina del Día
        </button>
      </div>

      {/* MODO 1: VISTA DE CALENDARIO MENSUAL EXCLUSIVA (SIN REPETIR LA RUTINA DEBAJO) */}
      {showMonthlyCalendar ? (
        <div>
          <MonthlyCalendar
            workoutHistory={workoutHistory}
            onSelectDate={(dateKey) => {
              setSelectedDateKey(dateKey);
              setShowMonthlyCalendar(false);
            }}
            onSelectDayId={(dayId) => {
              const idx = scientificProtocol.findIndex(d => d.id === dayId);
              if (idx >= 0) {
                setCurrentDayIndex(idx);
                setShowMonthlyCalendar(false);
              }
            }}
            onSaveSession={saveSession}
            onDeleteSession={deleteSession}
            currentSessions={currentSessions}
            setCurrentSessions={setCurrentSessions}
          />

          <button
            type="button"
            onClick={() => setShowGlosarioModal(true)}
            style={{
              width: '100%',
              background: '#eff6ff',
              color: '#0066ff',
              border: '1.5px solid #bfdbfe',
              padding: '14px',
              borderRadius: '18px',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <BookOpen size={18} /> Ver Glosario & Guía Explicativa
          </button>
        </div>
      ) : (
        /* MODO 2: VISTA DE RUTINA DEL DÍA DE ENTRENAMIENTO (ENFOQUE TOTAL) */
        <div>
          <WorkoutHeader
            isViewingHistory={isViewingHistory}
            historySession={historySession}
            selectedDateKey={selectedDateKey}
            setSelectedDateKey={setSelectedDateKey}
            currentWeek={currentWeek}
            todayStr={todayStr}
            currentDay={currentDay}
            currentDayIndex={currentDayIndex}
            baseDay={baseDay}
            previousSession={previousSession}
            modal={modal}
            setMesocycleStartDate={setMesocycleStartDate}
            handleClonePreviousWeek={handleClonePreviousWeek}
            handleResetToOfficialRoutine={handleResetToOfficialRoutine}
            handleSaveSpecialDay={handleSaveSpecialDay}
            isHistoryLoading={isHistoryLoading}
            completedSets={completedSets}
            volume={volume}
            workoutHistory={workoutHistory}
          />

          {/* BARRITAS KPI EN VIVO */}
          <WorkoutLiveStats
            currentDay={currentDay}
            volume={volume}
            completedSets={completedSets}
            handleResetCurrent={handleResetCurrent}
          />

          {/* DÍA DE DESCANSO O RUTINA DE ENTRENAMIENTO */}
          {currentDay.type === 'rest' && currentDay.exercises.length === 0 ? (
            <div className="card card-success" style={{ padding: '32px 20px', textAlign: 'center', margin: '16px 0' }}>
              <CheckCircle size={48} color="#00b464" style={{ margin: '0 auto 12px auto' }} />
              <h2 style={{ color: '#0f172a', fontSize: '19px', fontWeight: '800' }}>Día de Síntesis Muscular & Descanso</h2>
              <p style={{ marginTop: '8px', color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>
                Descanso absoluto programado. La reparación de fibras musculares ocurre fuera del gimnasio.
              </p>
            </div>
          ) : (
            <div>
              {/* PASO 0: CALENTAMIENTO GENERAL */}
              {currentDay.type === 'workout' && (
                <div 
                  onClick={() => {
                    const newVal = !isWarmupDone;
                    setGlobalWarmupDone(prev => ({
                      ...prev,
                      [warmupKey]: newVal,
                      ...(currentWeek === 1 ? { [currentDay.id]: newVal } : {})
                    }));
                  }}
                  style={{
                    background: isWarmupDone ? '#ecfdf5' : '#fffbeb',
                    border: isWarmupDone ? '1.5px solid #34d399' : '1.5px solid #f59e0b',
                    borderRadius: '20px',
                    padding: '14px 16px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '19px', background: isWarmupDone ? '#10b981' : '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isWarmupDone ? <Check size={20} /> : <Flame size={20} />}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: isWarmupDone ? '#065f46' : '#78350f' }}>
                        Paso 0: Calentamiento & Movilidad (5-10 min)
                      </h4>
                      <span style={{ fontSize: '11px', color: isWarmupDone ? '#047857' : '#92400e', fontWeight: '600' }}>
                        Caminata/bici suave + movimientos articulares
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${isWarmupDone ? 'badge-green' : 'badge-warning'}`} style={{ fontWeight: '800', fontSize: '11px' }}>
                    {isWarmupDone ? '✅ LISTO' : 'MARCAR'}
                  </span>
                </div>
              )}

              {/* LISTA DE EJERCICIOS CON REORDENAMIENTO SEPARADO TOP/BOTTOM & TÉCNICA */}
              <WorkoutExerciseList
                exercises={currentDay.exercises}
                currentDayId={currentDay.id}
                currentWeek={currentWeek}
                workoutHistory={workoutHistory}
                currentSessions={currentSessions}
                todayWorkoutData={todayWorkoutData}
                expandedExerciseId={expandedExerciseId}
                setExpandedExerciseId={setExpandedExerciseId}
                firstUncompletedIdx={firstUncompletedIdx}
                handleUpdateCardio={handleUpdateCardio}
                handleUpdateSet={handleUpdateSet}
                handleUpdateExerciseMeta={handleUpdateExerciseMeta}
                handleSwapExercise={handleSwapExercise}
                handleMoveExercise={handleMoveExercise}
              />

              <AddCustomExerciseModal
                isAddingExercise={isAddingExercise}
                setIsAddingExercise={setIsAddingExercise}
                newExScope={newExScope}
                setNewExScope={setNewExScope}
                newExName={newExName}
                setNewExName={setNewExName}
                newExSets={newExSets}
                setNewExSets={setNewExSets}
                newExReps={newExReps}
                setNewExReps={setNewExReps}
                handleAddCustomExercise={handleAddCustomExercise}
                handlePickFromLibrary={handlePickFromLibrary}
              />

              <WorkoutFooterControls
                handleFinishWorkout={handleFinishWorkout}
                completedSets={completedSets}
                isViewingHistory={isViewingHistory}
                handleClearCurrentDraft={handleClearCurrentDraft}
                showSecondaryTools={showSecondaryTools}
                setShowSecondaryTools={setShowSecondaryTools}
                handleOptimizeWithMath={handleOptimizeWithMath}
                isAnalyzingAI={isAnalyzingAI}
                setShowGlosarioModal={setShowGlosarioModal}
                handleCopyRoutineForCoach={handleCopyRoutineForCoach}
                setShowRoutineBuilder={setShowRoutineBuilder}
                handleResetToOfficialRoutine={handleResetToOfficialRoutine}
                handleResetAllDaysToOfficial={handleResetAllDaysToOfficial}
                baseDay={baseDay}
              />
            </div>
          )}
        </div>
      )}

      {/* MODAL GLOSARIO */}
      <GlosarioModal
        isOpen={showGlosarioModal}
        onClose={() => setShowGlosarioModal(false)}
      />

      {/* REPORTES Y MODALES SECUNDARIOS */}
      {aiAnalysisResult && (
        <div className="card animate-fade" style={{ padding: '16px', marginBottom: '16px', background: '#f3e8ff', border: '1.5px solid #d8b4fe', borderRadius: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#7c3aed" />
              <strong style={{ fontSize: '15px', color: '#4c1d95', fontWeight: '900' }}>Reporte de Sobrecarga AI</strong>
            </div>
            <button type="button" onClick={() => setAiAnalysisResult(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={18} color="#64748b" />
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#581c87', margin: 0, lineHeight: '1.5', fontWeight: '600' }}>
            {aiAnalysisResult.resumenSobrecarga}
          </p>
        </div>
      )}

      {/* MODAL GESTOR DE RUTINA */}
      <RoutineManagerModal
        isOpen={showRoutineBuilder}
        onClose={() => setShowRoutineBuilder(false)}
        activeRoutine={activeDays}
        customExercisesMap={customExercisesMap}
        onSaveRoutine={async (newRoutine) => {
          setCustomRoutine(newRoutine);
        }}
        onResetToBaseProtocol={async () => {
          setCustomRoutine(null);
        }}
      />
    </div>
  );
}
