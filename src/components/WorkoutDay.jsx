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
import { getPreviousDataForExercise } from '../utils/exerciseMatcher';
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
  const [workoutHistory, setWorkoutHistory, isHistoryLoading, saveSession] = useWorkoutHistory();
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

  // 3. Variables derivadas en orden estricto de dependencias
  const activeDays = (customRoutine && Array.isArray(customRoutine) && customRoutine.length > 0) ? customRoutine : scientificProtocol;
  const baseDay = activeDays[currentDayIndex] || activeDays[0] || scientificProtocol[0];
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

  // === SINCRONIZAR currentDayIndex CON FECHA ===
  useEffect(() => {
    const d = new Date(selectedDateKey + 'T12:00:00');
    if (!isNaN(d.getTime())) {
      let day = d.getDay();
      if (day === 0) day = 7;
      setCurrentDayIndex(day - 1);
    }
  }, [selectedDateKey]);

  const isViewingHistory = selectedDateKey !== todayStr;
  let historySession = null;
  if (isViewingHistory && workoutHistory) {
    historySession = workoutHistory.find(s => {
      if (!s.timestamp && !s.date) return false;
      const d = new Date(s.timestamp || s.date);
      if (isNaN(d.getTime())) return false;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return key === selectedDateKey;
    });
  }

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
  if (historySession) {
    todayWorkoutData = historySession.exercises || {};
  } else if (!isViewingHistory) {
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
    if (historySession) return; // Read only
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
    let totalVolume = 0;
    let completedSetsCount = 0;
    let cardioCount = 0;

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
              let w = parseFloat(setObj.weight) || 0;
              if (setObj.unit === 'kg') w *= 2.20462;
              const r = parseFloat(setObj.reps) || 0;
              totalVolume += (w * r);
            }
          }
        });
      }
    });

    return { volume: Math.round(totalVolume), completedSets: completedSetsCount, cardioCompleted: cardioCount };
  };

  const { volume, completedSets, cardioCompleted } = calculateVolumeAndSets();

  // Guardado Automático en Segundo Plano
  useEffect(() => {
    if (historySession || completedSets === 0 || isViewingHistory) return;

    const autoSaveTimer = setTimeout(async () => {
      // Create predictable ID based on date
      const sessionId = `ses_${todayStr}_${currentDay.id}`;
      
      const sessionLog = {
        id: sessionId,
        weekNumber: currentWeek,
        weekName: `Semana ${currentWeek}`,
        timestamp: new Date().toISOString(),
        dateString: new Date().toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
        dayId: currentDay.id,
        dayName: currentDay.name,
        focus: currentDay.focus,
        volume,
        completedSets,
        cardioCompleted,
        exercises: todayWorkoutData
      };

      await saveSession(sessionLog);
      console.log('✅ Auto-guardado en la nube:', sessionLog.id);
    }, 2000); // Debounce de 2 segundos para evitar spam a Firebase

    return () => clearTimeout(autoSaveTimer);
  }, [todayWorkoutData, volume, completedSets, cardioCompleted, historySession, isViewingHistory, currentWeek, currentDay, todayStr, saveSession]);

  const handleFinishWorkout = () => {
    modal.showConfirm({
      title: `🏁 ¿Archivar Sesión en Bitácora?`,
      message: `Resumen de tu entrenamiento de hoy:\n\n💪 Series completadas: ${completedSets}\n🔥 Volumen Total Levantado: ${volume.toLocaleString()} lbs-reps\n\n¿Archivar datos oficiales?`,
      confirmText: "💾 Sí, Archivar Ahora",
      cancelText: "Continuar Entrenando",
      variant: "success",
      onConfirm: async () => {
        const sessionId = `ses_${todayStr}_${currentDay.id}`;
        const newSessionLog = {
          id: sessionId,
          weekNumber: currentWeek,
          weekName: `Semana ${currentWeek}`,
          timestamp: new Date().toISOString(),
          dateString: new Date().toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
          dayId: currentDay.id,
          dayName: currentDay.name,
          focus: currentDay.focus,
          volume,
          completedSets,
          cardioCompleted,
          exercises: todayWorkoutData
        };

        // Update local state immediately for fast feedback
        const existingIndex = workoutHistory.findIndex(s => (s.weekNumber || 1) === currentWeek && s.dayId === currentDay.id);
        let updatedHistory;
        if (existingIndex >= 0) {
          newSessionLog.id = workoutHistory[existingIndex].id || newSessionLog.id;
          updatedHistory = [...workoutHistory];
          updatedHistory[existingIndex] = newSessionLog;
        } else {
          updatedHistory = [...workoutHistory, newSessionLog];
        }
        
        // Save to Firebase Collection directly using the new method
        await saveSession(newSessionLog);

        modal.showAlert({
          title: "🎉 ¡Entrenamiento Archivado!",
          message: `Sesión de la Semana ${currentWeek} registrada correctamente.`,
          variant: "success"
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
            const epley = w * (1 + (r / 30));
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
                const epley = w * (1 + (r / 30));
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
            onSelectDate={(dateKey) => setSelectedDateKey(dateKey)}
            onSelectDayId={(dayId) => {
              const idx = scientificProtocol.findIndex(d => d.id === dayId);
              if (idx >= 0) {
                setCurrentDayIndex(idx);
                setShowMonthlyCalendar(false); // Cambia limpiamente a la rutina del día seleccionado
              }
            }}
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
          {!isViewingHistory && <GymMembershipReminder compact={true} />}

          <TimelineSelector
            selectedDateKey={selectedDateKey}
            setSelectedDateKey={setSelectedDateKey}
            currentWeek={isViewingHistory && historySession ? historySession.weekNumber : currentWeek}
            onResetMesocycle={() => {
              modal.showConfirm({
                title: "⚠️ ¿Reiniciar Mesociclo?",
                message: "Esto establecerá HOY como el inicio de la Semana 1. Todo tu historial pasado seguirá guardado, pero el conteo de semanas se reiniciará.",
                confirmText: "Sí, Reiniciar",
                variant: "danger",
                onConfirm: () => {
                  setMesocycleStartDate(new Date().toISOString());
                  setSelectedDateKey(todayStr);
                }
              });
            }}
            onClonePreviousWeek={
              (!isViewingHistory && currentWeek > 1) ? handleClonePreviousWeek : null
            }
            isHistoryLoading={isHistoryLoading}
          />

          {/* ENFOQUE FISIOLÓGICO */}
          <div className="card card-highlight" style={{ padding: '16px', marginBottom: '14px' }}>
            <div className="flex-between">
              <div>
                <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Día {currentDay.dayNumber} de 7 • {(historySession ? historySession.dayName : currentDay.name).split(':')[0]}
                </span>
                <h2 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
                  {(historySession ? historySession.dayName : currentDay.name).includes(':') ? (historySession ? historySession.dayName : currentDay.name).split(':')[1] : (historySession ? historySession.dayName : currentDay.name)}
                </h2>
              </div>
              {previousSession?.dateString && !isViewingHistory && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', background: '#f1f5f9', padding: '4px 8px', borderRadius: '10px' }}>
                  Último: {previousSession.dateString.split(',')[0]}
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', marginTop: '8px', color: '#475569', fontWeight: '500', lineHeight: '1.5', margin: '8px 0 0 0' }}>
              {historySession ? historySession.focus : currentDay.focus}
            </p>
            {!isViewingHistory && (
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleResetToOfficialRoutine}
                  style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                    padding: '5px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={12} /> ↺ Restablecer Día a Oficial
                </button>
              </div>
            )}
          </div>

          {historySession && (
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', padding: '12px', borderRadius: '16px', marginBottom: '16px', color: '#b45309' }}>
              <strong style={{ display: 'block', fontSize: '13px' }}>Modo Historial - Solo Lectura</strong>
              <span style={{ fontSize: '12px' }}>Viendo la rutina guardada del {selectedDateKey}. Las ediciones están deshabilitadas.</span>
            </div>
          )}
          
          {isViewingHistory && !historySession && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', padding: '12px', borderRadius: '16px', marginBottom: '16px', color: '#b91c1c' }}>
              <strong style={{ display: 'block', fontSize: '13px' }}>Fecha sin registro</strong>
              <span style={{ fontSize: '12px' }}>No hay entrenamiento guardado para el {selectedDateKey}.</span>
            </div>
          )}

          {!isViewingHistory && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button onClick={() => handleSaveSpecialDay('rest')} style={{ flex: 1, padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#475569', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                💤 Día de Descanso
              </button>
              <button onClick={() => handleSaveSpecialDay('miss')} style={{ flex: 1, padding: '10px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#dc2626', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                ❌ Falta / Ausencia
              </button>
            </div>
          )}

          {/* BARRITAS KPI EN VIVO */}
          {currentDay.type === 'workout' && (
            <div style={{ 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
              color: '#fff', 
              padding: '14px 18px', 
              borderRadius: '20px', 
              marginBottom: '16px', 
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Carga Levantada</span>
                <strong style={{ fontSize: '18px', color: '#ffffff', fontWeight: '800' }}>{volume.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8' }}>lbs-reps</span></strong>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Series Listas</span>
                <strong style={{ fontSize: '18px', color: '#00b464', fontWeight: '800' }}>{completedSets} <span style={{ fontSize: '11px', color: '#94a3b8' }}>Fuerza</span></strong>
              </div>
              <button 
                type="button"
                onClick={handleResetCurrent} 
                title="Reiniciar casillas hoy" 
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', padding: '8px', color: '#ffffff', cursor: 'pointer' }}
              >
                <RefreshCcw size={16} />
              </button>
            </div>
          )}

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
                    setGlobalWarmupDone(prev => {
                      const newVal = !isWarmupDone;
                      if (newVal) modal.showAlert({ title: "🔥 Calentamiento Listo", message: "Articulaciones lubricadas. ¡Inicia tu primera serie!", variant: "success" });
                      return { ...prev, [warmupKey]: newVal, ...(currentWeek === 1 ? { [currentDay.id]: newVal } : {}) };
                    });
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
              {currentDay.exercises.map((exercise, idx) => {
                const isCurrentlyExpanded = expandedExerciseId !== null 
                  ? (expandedExerciseId === exercise.id) 
                  : (idx === firstUncompletedIdx);

                const handleToggle = () => {
                  setExpandedExerciseId(isCurrentlyExpanded ? 'none' : exercise.id);
                };

                if (exercise.isCardio) {
                  return (
                    <CardioLogger
                      key={exercise.id}
                      exercise={exercise}
                      exerciseData={todayWorkoutData[exercise.id]}
                      onUpdateCardio={(data) => handleUpdateCardio(exercise.id, data)}
                      initiallyExpanded={false}
                      isExpanded={isCurrentlyExpanded}
                      onToggleExpand={handleToggle}
                    />
                  );
                }

                return (
                  <ExerciseRow 
                    key={exercise.id} 
                    exercise={exercise} 
                    exerciseData={todayWorkoutData[exercise.id]}
                    previousData={getPreviousDataForExercise(exercise, currentDay.id, currentWeek, workoutHistory, currentSessions)}
                    onUpdateSet={(setNum, setData) => handleUpdateSet(exercise.id, setNum, setData)}
                    onUpdateExerciseMeta={(meta) => handleUpdateExerciseMeta(exercise.id, meta)}
                    onSwapExercise={handleSwapExercise}
                    onMoveUp={() => handleMoveExercise(exercise.id, 'up')}
                    onMoveDown={() => handleMoveExercise(exercise.id, 'down')}
                    isFirst={idx === 0}
                    isLast={idx === currentDay.exercises.length - 1}
                    isExpanded={isCurrentlyExpanded}
                    onToggleExpand={handleToggle}
                  />
                );
              })}

              {/* AGREGAR EJERCICIO */}
              {isAddingExercise ? (
                <div className="card animate-fade" style={{ padding: '18px', borderTop: '4px solid #0066ff', background: '#ffffff', marginBottom: '20px' }}>
                  <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Dumbbell size={18} color="#0066ff" />
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Nuevo Ejercicio</h3>
                    </div>
                    <button type="button" onClick={() => setIsAddingExercise(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <X size={20} color="#64748b" />
                    </button>
                  </div>

                  <form onSubmit={handleAddCustomExercise}>
                    {/* SELECTOR DE ÁMBITO (HOY VS PERMANENTE) */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                      <button
                        type="button"
                        onClick={() => setNewExScope('today')}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: 'none',
                          background: newExScope === 'today' ? '#0066ff' : 'transparent',
                          color: newExScope === 'today' ? '#ffffff' : '#64748b',
                          fontSize: '11px',
                          fontWeight: '900',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        📌 Solo para HOY
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewExScope('permanent')}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: 'none',
                          background: newExScope === 'permanent' ? '#7c3aed' : 'transparent',
                          color: newExScope === 'permanent' ? '#ffffff' : '#64748b',
                          fontSize: '11px',
                          fontWeight: '900',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        🔄 Permanente en Rutina
                      </button>
                    </div>

                    <div style={{ background: '#f5f3ff', border: '1px solid #a78bfa', padding: '10px', borderRadius: '12px', marginBottom: '12px' }}>
                      <label className="input-label" style={{ display: 'block', marginBottom: '4px', color: '#5b21b6', fontWeight: '800', fontSize: '11px' }}>
                        ⚡️ Elegir de Catálogo de Máquinas Unificado:
                      </label>
                      <select
                        defaultValue=""
                        onChange={(e) => handlePickFromLibrary(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #7c3aed', background: '#ffffff', color: '#1e1b4b', fontWeight: '700', fontSize: '12px' }}
                      >
                        <option value="">👆 Seleccionar de la biblioteca...</option>
                        {UNIFIED_EXERCISE_LIBRARY.map(ex => (
                          <option key={ex.id} value={ex.id}>
                            [{ex.muscleGroup}] • {ex.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <input 
                        type="text" 
                        required 
                        placeholder="Nombre del Ejercicio" 
                        value={newExName} 
                        onChange={e => setNewExName(e.target.value)} 
                        style={{ padding: '10px 12px', width: '100%', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px' }}
                      />
                    </div>

                    <div className="grid-2" style={{ marginBottom: '10px', gap: '8px' }}>
                      <input 
                        type="number" 
                        placeholder="Series (ej. 3)" 
                        value={newExSets} 
                        onChange={e => setNewExSets(e.target.value)} 
                        style={{ padding: '10px', width: '100%', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px' }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Reps (ej. 10-12)" 
                        value={newExReps} 
                        onChange={e => setNewExReps(e.target.value)} 
                        style={{ padding: '10px', width: '100%', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px' }} 
                      />
                    </div>

                    <div className="grid-2" style={{ gap: '10px' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setIsAddingExercise(false)}>Cancelar</button>
                      <button type="submit" className="btn btn-primary">
                        {newExScope === 'today' ? '📌 Añadir a Hoy' : '🔄 Guardar en Rutina'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button 
                  type="button"
                  className="btn btn-outline" 
                  onClick={() => setIsAddingExercise(true)}
                  style={{ width: '100%', background: '#ffffff', border: '2px dashed #cbd5e1', color: '#475569', fontWeight: '800', padding: '14px', marginBottom: '16px', borderRadius: '18px' }}
                >
                  <Plus size={18} color="#0066ff" style={{ display: 'inline', marginRight: '6px' }} /> + Agregar Ejercicio a este Día
                </button>
              )}

              {/* BOTÓN PRINCIPAL DE GUARDAR ENTRENAMIENTO */}
              <div style={{ marginTop: '12px', marginBottom: '20px' }}>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleFinishWorkout} 
                  style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '20px', fontWeight: '900', boxShadow: '0 8px 24px rgba(0, 102, 255, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Save size={22} /> Guardar Sesión en Bitácora
                </button>
              </div>

              {/* MENÚ SECUNDARIO DE HERRAMIENTAS */}
              <div className="card" style={{ padding: '14px', marginBottom: '20px', background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setShowSecondaryTools(!showSecondaryTools)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    padding: '4px 0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings2 size={18} color="#64748b" />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#334155' }}>🛠️ Herramientas Secundarias & Ajustes</span>
                  </div>
                  {showSecondaryTools ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                </button>

                    {showSecondaryTools && (
                  <div className="animate-fade" style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button 
                        type="button"
                        onClick={handleOptimizeWithMath}
                        disabled={isAnalyzingAI}
                        className="btn btn-primary"
                        style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        {isAnalyzingAI ? <Loader2 size={16} className="animate-spin" /> : <Cpu size={16} />}
                        {isAnalyzingAI ? 'Calculando...' : '🧠 Optimizar (Epley Math)'}
                      </button>

                    <button
                      type="button"
                      onClick={() => setShowGlosarioModal(true)}
                      style={{ width: '100%', background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <BookOpen size={16} /> 📖 Ver Glosario & Guía Técnica
                    </button>

                    <button 
                      type="button"
                      onClick={handleCopyRoutineForCoach}
                      style={{ width: '100%', background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <Copy size={16} /> 📋 Copiar Rutina en Texto
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowRoutineBuilder(true)}
                      style={{ width: '100%', background: '#1e293b', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <Layers size={16} color="#38bdf8" /> 🛠️ Gestor Maestro de Rutinas (Actualizar / Pegar)
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToOfficialRoutine}
                      style={{ width: '100%', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <RefreshCw size={16} /> ↺ Restablecer {baseDay.name.split(':')[0]} a Rutina Oficial
                    </button>

                    <button
                      type="button"
                      onClick={handleResetAllDaysToOfficial}
                      style={{ width: '100%', background: '#ecfdf5', color: '#047857', border: '1.5px solid #6ee7b7', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <Sparkles size={16} color="#059669" /> ✨ Activar Protocolo Adonis Oficial en Toda la Semana
                    </button>
                  </div>
                )}
              </div>
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
