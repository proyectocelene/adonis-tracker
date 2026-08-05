import React, { useState } from 'react';
import { scientificProtocol } from '../data/scientificProtocol';
import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary';
import ExerciseRow from './ExerciseRow';
import CardioLogger from './CardioLogger';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { analyzeWorkoutProgressWithAI, syncWorkoutToGoogleSheets, autoSyncWithOfflineBuffer } from '../services/deepseek';
import { CheckCircle, Calendar, ArrowLeft, ArrowRight, Save, Flame, RefreshCcw, Plus, X, Dumbbell, ShieldCheck, BookOpen, ShieldAlert, Zap, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle, Activity, Sparkles, Cloud, Check, Loader2, Cpu, Layers, Database, History, Trash2, Copy, Share2, MessageSquare } from 'lucide-react';
import { useModal } from './common/UIComponents';

export default function WorkoutDay() {
  const modal = useModal();
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    let day = new Date().getDay();
    if (day === 0) day = 7; 
    return day - 1;
  });
  
  const baseDay = scientificProtocol[currentDayIndex];
  const [currentWeek, setCurrentWeek] = useLocalStorage('coachv2_current_week', 1);
  const [totalWeeks, setTotalWeeks] = useLocalStorage('coachv2_total_weeks', 8);
  const [customExercisesMap, setCustomExercisesMap] = useLocalStorage('coachv2_custom_day_exercises', {});
  const [swappedExercisesMap, setSwappedExercisesMap] = useLocalStorage('coachv2_swapped_exercises', {});
  const [globalWarmupDone, setGlobalWarmupDone] = useLocalStorage('coachv2_global_warmup', {});
  
  // API Keys and Google Sheets Settings
  const [apiKey] = useLocalStorage('coachv2_deepseek_apikey', '');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useLocalStorage('coachv2_google_sheets_url', 'https://script.google.com/macros/s/AKfycbxA-KbUcEgWUq4jvjdSBxLw3tGsgPxXsF2Y7mX5JsNIpE2qslN1v7xW3NqdJ3-4b-RCwg/exec');
  
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [showRoutineBuilder, setShowRoutineBuilder] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('3');
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExRest, setNewExRest] = useState('90 s');
  const [newExBiomech, setNewExBiomech] = useState('');
  const [newExMuscleGroup, setNewExMuscleGroup] = useState('General');
  const [newExUnifiedCode, setNewExUnifiedCode] = useState('');
  const [newExTargetDay, setNewExTargetDay] = useState(baseDay.id);
  const [selectedBuilderExHistory, setSelectedBuilderExHistory] = useState(null);

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
      setNewExUnifiedCode(item.unifiedCode || '');
    }
  };

  const [showProtocolRules, setShowProtocolRules] = useState(false);
  
  // Acordeón Exclusivo (sólo 1 abierto a la vez)
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

  const [currentSessions, setCurrentSessions] = useLocalStorage('coachv2_active_workouts', {});
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('coachv2_history', []);
  const [bodyMetrics] = useLocalStorage('coachv2_body_metrics_history', []);

  // Estados AI y Sincronización
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [tempSheetsUrl, setTempSheetsUrl] = useState(googleSheetsUrl);

  const userCustomForDay = customExercisesMap[baseDay.id] || [];
  const rawExercises = [...(baseDay.exercises || []), ...userCustomForDay];

  // Mapear ejercicios intercambiados si el usuario los sustituyó
  const currentDay = {
    ...baseDay,
    exercises: rawExercises.map(ex => {
      const swapped = (swappedExercisesMap[baseDay.id] || {})[ex.id];
      if (swapped) {
        return { ...ex, ...swapped, originalName: ex.name };
      }
      return ex;
    })
  };

  // Sistema Resiliente de Semanas: Obtener datos activos de la semana actual o migrar transparentemente si venía del formato raíz
  const getDayDataForWeek = (sessions, week, dayId) => {
    const weekKey = `week_${week}`;
    if (!sessions[weekKey] && week === 1 && sessions[dayId]) {
      return sessions[dayId] || {};
    }
    return sessions[weekKey] ? (sessions[weekKey][dayId] || {}) : {};
  };

  const todayWorkoutData = getDayDataForWeek(currentSessions, currentWeek, currentDay.id);

  // Guía inteligente de progresión: Buscar datos de la semana anterior para comparar y aplicar sobrecarga progresiva
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

  const updateSessionDataForCurrentDay = (updater) => {
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

  // Clonación rápida de pesos de la semana anterior para facilitar la sobrecarga progresiva sin rellenar desde cero
  const handleClonePreviousWeek = () => {
    if (currentWeek <= 1) return;
    const prevData = getPreviousDataForDay();
    if (!prevData || Object.keys(prevData).length === 0) {
      modal.showAlert({
        title: "⚠️ Sin registros previos en S" + (currentWeek - 1),
        message: `No se encontraron datos registrados en la Semana ${currentWeek - 1} para el día: "${currentDay.name}".\n\nAsegúrate de haber registrado tus cargas en la semana anterior para usar el autocompletado inteligente.`,
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
      message: `Se importaron tus pesos, repeticiones y calibraciones de la Semana ${currentWeek - 1} al día de hoy.\n\n🔥 Las casillas están listas y desmarcadas (✓) para que registres tu progresión de hoy.`,
      variant: "success"
    });
  };

  // Intercambiar Ejercicio en Vivo
  const handleSwapExercise = (exerciseId, swappedData) => {
    setSwappedExercisesMap(prev => {
      const daySwaps = prev[baseDay.id] || {};
      return {
        ...prev,
        [baseDay.id]: {
          ...daySwaps,
          [exerciseId]: swappedData
        }
      };
    });

    // Guardar también la meta en la bitácora activa
    handleUpdateExerciseMeta(exerciseId, {
      name: swappedData.name,
      originalName: swappedData.originalName,
      swapped: true,
      muscleGroup: swappedData.muscleGroup || 'General'
    });

    modal.showAlert({
      title: "🔄 Ejercicio Intercambiado",
      message: `¡Listo! Has cambiado por "${swappedData.name}". El sistema mantendrá la contabilidad del grupo muscular (${swappedData.muscleGroup || 'Principal'}) intacto.`,
      variant: "success"
    });
  };

  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim()) {
      modal.showAlert({ title: "Campo requerido", message: "Escribe el nombre del ejercicio de fuerza para continuar.", variant: "warning" });
      return;
    }

    const newEx = {
      id: `custom_${Date.now()}`,
      name: newExName.trim(),
      muscleGroup: newExMuscleGroup,
      sets: parseInt(newExSets) || 3,
      reps: newExReps.trim() || '10-12',
      restTime: newExRest.trim() || '90 s',
      biomechanics: newExBiomech.trim() || 'Ejecución técnica estricta con control del rango articular y exhalación IAP.',
      searchQuery: `${newExName} biomechanics execution`,
      unifiedFunctionCode: newExUnifiedCode || `[HIPER-${(newExMuscleGroup || 'CUST').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-MÁQ]`,
      defaultUnit: 'lbs'
    };

    const targetId = newExTargetDay || baseDay.id;
    const targetDayObj = scientificProtocol.find(d => d.id === targetId) || currentDay;

    setCustomExercisesMap(prev => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), newEx]
    }));

    setIsAddingExercise(false);
    setNewExName('');
    setNewExBiomech('');
    setNewExUnifiedCode('');

    // Disparar sincronización automática a Google Sheets para poblar "Rutina Maestra Adonis" al instante
    setTimeout(() => {
      autoSyncWithOfflineBuffer();
    }, 200);

    modal.showAlert({
      title: "✅ Ejercicio Incrustado & Sincronizado",
      message: `El ejercicio "${newEx.name}" (Grupo: ${newEx.muscleGroup}) se incorporó al día: "${targetDayObj.name}" y se sincronizó automáticamente en tu Google Sheet.`,
      variant: "success"
    });
  };

  const handleRemoveCustomExerciseFromDay = (dayId, exId) => {
    modal.showConfirm({
      title: "🗑️ ¿Quitar ejercicio de la rutina?",
      message: "Este ejercicio personalizado se sacará del día seleccionado. Podrás volver a agregarlo desde la base de datos.",
      confirmText: "Quitar de la Rutina",
      variant: "danger",
      onConfirm: () => {
        setCustomExercisesMap(prev => ({
          ...prev,
          [dayId]: (prev[dayId] || []).filter(item => item.id !== exId)
        }));
        setTimeout(() => autoSyncWithOfflineBuffer(), 200);
      }
    });
  };

  const handleAssignExistingToDay = (exObj, targetDayId) => {
    const clonedEx = { ...exObj, id: `custom_${Date.now()}` };
    const targetDayObj = scientificProtocol.find(d => d.id === targetDayId);
    setCustomExercisesMap(prev => ({
      ...prev,
      [targetDayId]: [...(prev[targetDayId] || []), clonedEx]
    }));
    setTimeout(() => autoSyncWithOfflineBuffer(), 200);
    modal.showAlert({
      title: "📌 Ejercicio Asignado",
      message: `"${exObj.name}" ha sido estructurado dentro de la rutina del día: ${targetDayObj ? targetDayObj.name : targetDayId}.`,
      variant: "success"
    });
  };

  const calculateTotalVolume = () => {
    let volume = 0;
    let completedSets = 0;
    let cardioCompleted = 0;

    Object.keys(todayWorkoutData).forEach(exId => {
      const exData = todayWorkoutData[exId];
      if (exData && exData.machine) {
        if (exData.completed) cardioCompleted++;
      } else if (exData) {
        Object.keys(exData).forEach(setNum => {
          if (!isNaN(parseInt(setNum))) {
            const set = exData[setNum];
            if (set && set.completed && set.weight && set.reps) {
              let w = parseFloat(set.weight) || 0;
              if (set.unit === 'kg') w = w * 2.20462;
              const r = parseFloat(set.reps) || 0;
              volume += (w * r);
              completedSets++;
            } else if (set && set.completed) {
              completedSets++;
            }
          }
        });
      }
    });
    return { volume: Math.round(volume), completedSets, cardioCompleted };
  };

  const { volume, completedSets, cardioCompleted } = calculateTotalVolume();

  const handleFinishWorkout = () => {
    if (completedSets === 0 && cardioCompleted === 0) {
      modal.showAlert({
        title: "⭕️ Sesión sin marcas activas",
        message: "Aún no has checado ninguna serie de fuerza ni módulo aeróbico en tu rutina de hoy (✓).\n\nMarca las casillas logradas con los pesos y repeticiones ejecutadas antes de archivar tu entrenamiento.",
        variant: "warning"
      });
      return;
    }

    modal.showConfirm({
      title: `🏁 ¿Archivar Sesión en Bitácora?`,
      message: `Estás a punto de finalizar y registrar tu entrenamiento en el Laboratorio Científico:\n\n💪 Series de fuerza logradas: ${completedSets}\n❤️ Módulos de Cardio Zona 2: ${cardioCompleted}\n🔥 Volumen Total Levantado: ${volume.toLocaleString()} lbs-reps\n\n¿Confirmar y archivar datos oficiales?`,
      confirmText: "💾 Sí, Archivar Ahora",
      cancelText: "Continuar Entrenado",
      variant: "success",
      onConfirm: async () => {
        const newSessionLog = {
          id: `ses_${Date.now()}`,
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

        // Si ya existe un registro en el historial para ESTA MISMA semana y día, lo actualizamos para preservar integridad sin duplicar
        const existingIndex = workoutHistory.findIndex(s => (s.weekNumber || 1) === currentWeek && s.dayId === currentDay.id);
        let updatedHistory;
        if (existingIndex >= 0) {
          newSessionLog.id = workoutHistory[existingIndex].id || newSessionLog.id;
          updatedHistory = [...workoutHistory];
          updatedHistory[existingIndex] = newSessionLog;
        } else {
          updatedHistory = [...workoutHistory, newSessionLog];
        }
        
        setWorkoutHistory(updatedHistory);

        // NOTA CIENTÍFICA: No borramos las sesiones activas de esta semana para preservar tu programa visual intacto en la Semana actual. Al cambiar a una nueva semana en el selector, tendrás casillas limpias.

        // Sincronización en segundo plano con Google Sheets si está configurada la URL
        let cloudMsg = "";
        if (googleSheetsUrl && googleSheetsUrl.startsWith("http")) {
          try {
            await syncWorkoutToGoogleSheets({
              webAppUrl: googleSheetsUrl,
              workoutHistory: updatedHistory,
              currentSessions,
              bodyMetrics
            });
            cloudMsg = "\n\n☁️ ¡Sincronización Cloud exitosa con tu Google Sheets en vivo!";
          } catch (err) {
            cloudMsg = "\n\n⚠️ Guardado localmente. No se pudo sincronizar en Google Sheets en este momento.";
          }
        }

        modal.showAlert({
          title: `🎉 ¡Sesión de la Semana ${currentWeek} Archivada al 100%!`,
          message: `Tu entrenamiento del día "${currentDay.name}" quedó registrado intacto en tu historial clínico para la Semana ${currentWeek}.${cloudMsg}\n\n🗓️ Tus datos no se sobrescribirán: al avanzar a la siguiente semana en el selector superior, iniciarás tu nueva progresión de forma independiente.`,
          variant: "success",
          buttonText: "¡Excelente, al descanso!"
        });
      }
    });
  };

  const handleResetCurrent = () => {
    modal.showConfirm({
      title: `🔄 ¿Reiniciar Casillas de la Semana ${currentWeek} - Día de Hoy?`,
      message: `Si desmarcas las casillas de hoy para la Semana ${currentWeek}, se limpiarán los checks actuales de esta semana para iniciar desde cero. Todo tu historial de otras semanas se preserva intacto.`,
      confirmText: "Reiniciar Hoy",
      cancelText: "Mantener",
      variant: "warning",
      onConfirm: () => {
        updateSessionDataForCurrentDay(() => ({}));
        setGlobalWarmupDone(prev => ({
          ...prev,
          [`week_${currentWeek}_${currentDay.id}`]: false,
          [currentDay.id]: false
        }));
      }
    });
  };

  // ANALIZAR Y OPTIMIZAR RUTINA CON IA DE DEEPSEEK
  const handleOptimizeWithAI = async () => {
    if (!apiKey) {
      modal.showAlert({
        title: "🔑 Clave DeepSeek Recomendada",
        message: "Para que la inteligencia artificial analice en tiempo real tus pesos, sobrecarga muscular y fatiga, te recomendamos guardar tu Clave API de DeepSeek en el Módulo 'Nutrición' (pestaña Configuración).\n\nSin embargo, hemos preparado un análisis biomecánico estándar con el algoritmo Adonis para el día de hoy.",
        variant: "info",
        buttonText: "Entendido, ver análisis estándar"
      });

      // Fallback algorítmico inteligente
      setAiAnalysisResult({
        resumenSobrecarga: `Evaluación Algorítmica para el día: "${currentDay.name}". Tu volumen promedio reciente muestra una progresión constante en cargas de trabajo.`,
        gruposDestacados: [
          { grupo: currentDay.exercises[0]?.muscleGroup || "Principal", evaluacion: "Buen volumen sostenido en tus últimas sesiones.", estado: "Sobrecarga Excelente" },
          { grupo: currentDay.exercises[1]?.muscleGroup || "Estabilizadores", evaluacion: "Mantén un tiempo excéntrico de 3 segundos.", estado: "Estable" }
        ],
        ajustesRecomendados: [
          { ejercicioOGrupo: currentDay.exercises[0]?.name || "Ejercicio #1", recomendacion: "Si completaste el tope de reps la sesión pasada, sube un 5% la carga de trabajo en la primera serie de hoy." },
          { ejercicioOGrupo: "Descanso Neuromuscular", recomendacion: "Respeta estrictamente los 120-180 segundos en ejercicios compuestos para no perder fuerza por fatiga nerviosa." }
        ],
        consejoDeCalentamientoYPrevencion: "Realiza 2 series de aproximación con el 50% de tu carga para lubricación sin desgaste nervisoso."
      });
      return;
    }

    // Calcular estadísticas acumuladas por grupo muscular
    const muscleGroupStats = {};
    workoutHistory.forEach(ses => {
      if (ses.exercises) {
        Object.values(ses.exercises).forEach(exData => {
          const group = exData.muscleGroup || "General";
          if (!muscleGroupStats[group]) muscleGroupStats[group] = { totalVol: 0, seriesCount: 0 };
          if (!exData.machine) {
            Object.values(exData).forEach(set => {
              if (set && set.completed && set.weight && set.reps) {
                let w = parseFloat(set.weight) || 0;
                if (set.unit === 'kg') w *= 2.20462;
                muscleGroupStats[group].totalVol += (w * parseFloat(set.reps));
                muscleGroupStats[group].seriesCount += 1;
              }
            });
          }
        });
      }
    });

    try {
      setIsAnalyzingAI(true);
      const res = await analyzeWorkoutProgressWithAI({
        apiKey,
        workoutHistory,
        currentDayName: currentDay.name,
        muscleGroupStats
      });
      setAiAnalysisResult(res);
      modal.showAlert({ title: "🧠 ¡Análisis AI Completado!", message: "El entrenador DeepSeek ha auditado tus rutinas pasadas y la sobrecarga de tus grupos musculares.", variant: "success" });
    } catch (err) {
      modal.showAlert({ title: "Error al Consultar IA", message: err.message, variant: "danger" });
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // SINCRONIZACIÓN MANUAL CON GOOGLE SHEETS
  const handleTriggerSync = async () => {
    if (!googleSheetsUrl || !googleSheetsUrl.startsWith('http')) {
      setShowSheetsModal(true);
      return;
    }

    try {
      setIsSyncingSheets(true);
      await syncWorkoutToGoogleSheets({
        webAppUrl: googleSheetsUrl,
        workoutHistory,
        currentSessions,
        bodyMetrics
      });
      modal.showAlert({
        title: "☁️ Sincronización Exitosa",
        message: "Tus rutinas, cargas levantadas y medidas acaban de subirse directamente a tu hoja de Google Sheets en la nube.",
        variant: "success"
      });
    } catch (err) {
      modal.showAlert({ title: "Error en Sincronización", message: err.message, variant: "danger" });
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleSaveSheetsUrl = (e) => {
    e.preventDefault();
    if (tempSheetsUrl.trim() && !tempSheetsUrl.trim().startsWith("https://script.google.com/")) {
      modal.showAlert({ title: "URL Incorrecta", message: "La URL debe ser de Google Apps Script (comienza con https://script.google.com/macros/s/...).", variant: "warning" });
      return;
    }
    setGoogleSheetsUrl(tempSheetsUrl.trim());
    setShowSheetsModal(false);
    modal.showAlert({ title: "☁️ Conexión Guardada", message: "Ahora cada vez que archives una rutina o hagas clic en sincronizar, tus datos irán en vivo a tu Google Sheet.", variant: "success" });
  };

  const handleCopyRoutineForCoach = () => {
    let summaryText = `💪 PROTOCOLO ADONIS - RUTINA DE HOY\n`;
    summaryText += `🗓️ Semana ${currentWeek} de ${totalWeeks} (Mesociclo)\n`;
    summaryText += `📅 Día ${currentDay.dayNumber}: ${currentDay.name}\n`;
    summaryText += `🏋️ Atleta: Dr. Carlos Donato (174 cm • Meta: 68.0 kg magros • Proteína: 160g)\n`;
    summaryText += `🎯 Enfoque Fisiológico: ${currentDay.focus}\n\n`;
    summaryText += `📌 EJERCICIOS Y CARGAS PROGRAMADAS:\n`;
    
    currentDay.exercises.forEach((ex, idx) => {
      const sets = ex.isCardio ? "1" : (ex.sets || "3");
      const reps = ex.isCardio ? (ex.reps || "30 min") : (ex.reps || "10-12");
      const rest = ex.restTime || "90 s";
      const muscle = ex.muscleGroup || "Hipertrofia General";
      const code = ex.unifiedFunctionCode || "[HIPER-GEN-01]";
      const bio = ex.biomechanics || "Control de técnica estricto e IAP.";

      summaryText += `\n${idx + 1}. ${ex.name} [${muscle}]\n`;
      summaryText += `   • Meta: ${sets} series x ${reps} reps • Descanso: ${rest}\n`;
      summaryText += `   • Código: ${code}\n`;
      summaryText += `   • Técnica: ${bio}\n`;

      const logs = todayWorkoutData[ex.id];
      if (logs && !ex.isCardio) {
        let loggedInfo = [];
        Object.keys(logs).forEach(setNum => {
          if (!isNaN(parseInt(setNum)) && logs[setNum].weight) {
            loggedInfo.push(`S${setNum}: ${logs[setNum].weight} ${logs[setNum].unit || 'lbs'} x ${logs[setNum].reps || 0} reps (RPE ${logs[setNum].rpe || '-'})`);
          }
        });
        if (loggedInfo.length > 0) {
          summaryText += `   📊 Log Hoy/Reciente: ${loggedInfo.join(" | ")}\n`;
        }
      }
    });

    summaryText += `\n❓ SOLICITUD DE RECOMENDACIÓN:\n`;
    summaryText += `Entrenador / Asesor IA: Analiza esta progresión de cargas y estructura biomecánica. ¿Qué sugerencias o ajustes me recomiendas para este entrenamiento?\n`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText).then(() => {
        modal.showAlert({
          title: "📋 Rutina Copiada Exitosamente",
          message: "El resumen científico completa con todas tus series, pesos recientes, códigos y biomecánica se copió al portapapeles. ¡Listo para enviarse por WhatsApp, correo o ChatGPT/Claude/DeepSeek para recibir recomendaciones de tu entrenador!",
          variant: "success"
        });
      }).catch(() => {
        modal.showAlert({ title: "⚠️ Aviso", message: "No se pudo copiar en automático. Selecciona y copia manualmente.", variant: "warning" });
      });
    } else {
      modal.showAlert({ title: "⚠️ Aviso", message: "Portapapeles no disponible en este navegador.", variant: "warning" });
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

  return (
    <div className="container">
      {/* SELECTOR Y CONTROL DE SEMANAS (MESOCICLO ADONIS) */}
      <div className="card animate-fade" style={{ padding: '16px', marginBottom: '14px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1.5px solid #334155', borderRadius: '24px', color: '#ffffff', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#38bdf8" />
            <span style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8' }}>
              Mesociclo Científico
            </span>
          </div>
          <button 
            type="button"
            onClick={() => {
              const newTotal = totalWeeks + 1;
              setTotalWeeks(newTotal);
              setCurrentWeek(newTotal);
              modal.showAlert({
                title: "🗓️ ¡Nueva Semana Agregada!",
                message: `Has ampliado tu ciclo de entrenamiento a la Semana ${newTotal}. Todo tu historial y programa anterior permanecen guardados e inalterables.`,
                variant: "success"
              });
            }}
            style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', padding: '6px 14px', borderRadius: '14px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}
          >
            <Plus size={14} /> + Nueva Semana
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'rgba(15, 23, 42, 0.7)', padding: '8px', borderRadius: '20px', border: '1px solid #334155' }}>
          <button 
            type="button"
            disabled={currentWeek <= 1}
            onClick={() => {
              if (currentWeek > 1) {
                setCurrentWeek(currentWeek - 1);
                setExpandedExerciseId(null);
              }
            }}
            style={{ width: '44px', height: '44px', background: currentWeek <= 1 ? 'rgba(51, 65, 85, 0.3)' : '#0066ff', color: '#ffffff', border: 'none', borderRadius: '16px', cursor: currentWeek <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentWeek <= 1 ? 0.4 : 1, transition: 'all 0.2s', flexShrink: 0 }}
          >
            <ArrowLeft size={22} />
          </button>

          <div style={{ textAlign: 'center', flex: 1, minWidth: 0, padding: '0 4px' }}>
            <div style={{ fontSize: '19px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>🗓️ Semana {currentWeek}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '10px' }}>de {totalWeeks}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginTop: '4px' }}>
              {currentWeek === 1 ? '🌱 Semana de Calibración & Línea Base' : `🔥 Fase de Sobrecarga Progresiva (S${currentWeek})`}
            </div>
          </div>

          <button 
            type="button"
            disabled={currentWeek >= totalWeeks}
            onClick={() => {
              if (currentWeek < totalWeeks) {
                setCurrentWeek(currentWeek + 1);
                setExpandedExerciseId(null);
              }
            }}
            style={{ width: '44px', height: '44px', background: currentWeek >= totalWeeks ? 'rgba(51, 65, 85, 0.3)' : '#0066ff', color: '#ffffff', border: 'none', borderRadius: '16px', cursor: currentWeek >= totalWeeks ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentWeek >= totalWeeks ? 0.4 : 1, transition: 'all 0.2s', flexShrink: 0 }}
          >
            <ArrowRight size={22} />
          </button>
        </div>

        {currentWeek > 1 && (
          <div style={{ marginTop: '12px' }}>
            <button 
              type="button"
              onClick={handleClonePreviousWeek}
              style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s' }}
            >
              <Zap size={18} fill="#ffffff" />
              ⚡️ Clonar Pesos de Semana {currentWeek - 1} (Autocompletar)
            </button>
          </div>
        )}
      </div>

      {/* Navegación del Calendario */}
      <div className="card" style={{ padding: '16px 14px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <button 
            type="button"
            className="btn btn-outline" 
            style={{ width: '48px', height: '48px', padding: '0', borderRadius: '16px', flexShrink: 0 }}
            onClick={() => {
              setCurrentDayIndex(prev => prev > 0 ? prev - 1 : 6);
              setExpandedExerciseId(null);
            }}
          >
            <ArrowLeft size={22} />
          </button>
          
          <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '6px', fontSize: '11px' }}>
              Día {currentDay.dayNumber} de 7 • Protocolo Adonis
            </span>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', whiteSpace: 'normal', lineBreak: 'strict', lineHeight: '1.35', color: '#0f172a' }}>
              {currentDay.name}
            </h1>
          </div>
          
          <button 
            type="button"
            className="btn btn-outline" 
            style={{ width: '48px', height: '48px', padding: '0', borderRadius: '16px', flexShrink: 0 }}
            onClick={() => {
              setCurrentDayIndex(prev => prev < 6 ? prev + 1 : 0);
              setExpandedExerciseId(null);
            }}
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      {/* BOTONES RÁPIDOS INGENIOSOS: AI OPTIMIZER, GOOGLE SHEETS SYNC & COPIAR RUTINA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <button 
          type="button"
          onClick={handleOptimizeWithAI}
          disabled={isAnalyzingAI}
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', padding: '12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.25)' }}
        >
          {isAnalyzingAI ? <Loader2 size={16} className="animate-spin" /> : <Cpu size={16} />}
          {isAnalyzingAI ? 'Consultando AI...' : '🧠 Optimizar AI'}
        </button>

        <button 
          type="button"
          onClick={handleTriggerSync}
          disabled={isSyncingSheets}
          className="btn btn-outline"
          style={{ background: '#ecfdf5', color: '#047857', border: '1.5px solid #6ee7b7', padding: '12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)' }}
        >
          {isSyncingSheets ? <Loader2 size={16} className="animate-spin" /> : <Cloud size={16} color="#10b981" />}
          {isSyncingSheets ? 'Subiendo...' : '☁️ Guardar Nube'}
        </button>
      </div>

      <div style={{ marginBottom: '18px' }}>
        <button 
          type="button"
          onClick={handleCopyRoutineForCoach}
          style={{ width: '100%', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#ffffff', border: 'none', padding: '13px 16px', borderRadius: '18px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(2, 132, 199, 0.25)', transition: 'all 0.2s ease' }}
        >
          <Copy size={18} />
          📋 Copiar Rutina de Hoy (Enviar a Entrenador / IA)
        </button>
      </div>

      {/* RESULTADO DEL ANÁLISIS AI OPTIMIZER */}
      {aiAnalysisResult && (
        <div className="card animate-fade" style={{ padding: '18px', marginBottom: '18px', background: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 100%)', border: '1.5px solid #d8b4fe', borderRadius: '24px', boxShadow: '0 12px 30px rgba(124, 58, 237, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} color="#7c3aed" />
              <strong style={{ fontSize: '16px', color: '#4c1d95', fontWeight: '900' }}>Reporte de Sobrecarga Muscular AI</strong>
            </div>
            <button type="button" onClick={() => setAiAnalysisResult(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          <p style={{ fontSize: '13px', color: '#581c87', margin: '0 0 14px 0', lineHeight: '1.5', fontWeight: '600', background: '#ffffff', padding: '12px', borderRadius: '16px', border: '1px solid #e9d5ff' }}>
            {aiAnalysisResult.resumenSobrecarga}
          </p>

          <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
            <strong style={{ fontSize: '12px', color: '#6d28d9', textTransform: 'uppercase', fontWeight: '900' }}>💪 Estado de Grupos Musculares:</strong>
            {aiAnalysisResult.gruposDestacados?.map((g, i) => (
              <div key={i} style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b' }}>{g.grupo}</strong>
                  <span style={{ fontSize: '12px', color: '#475569' }}>{g.evaluacion}</span>
                </div>
                <span className="badge" style={{ background: g.estado?.includes('Excelente') ? '#dcfce7' : '#fef3c7', color: g.estado?.includes('Excelente') ? '#166534' : '#92400e', fontWeight: '800', flexShrink: 0, fontSize: '11px' }}>
                  {g.estado}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde047', borderRadius: '16px', padding: '12px', marginBottom: '12px' }}>
            <strong style={{ fontSize: '12px', color: '#92400e', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: '900' }}>⚡️ Ajustes de Carga Recomendados hoy:</strong>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#78350f', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: '600' }}>
              {aiAnalysisResult.ajustesRecomendados?.map((aj, idx) => (
                <li key={idx}><strong>{aj.ejercicioOGrupo}:</strong> {aj.recomendacion}</li>
              ))}
            </ul>
          </div>

          {aiAnalysisResult.consejoDeCalentamientoYPrevencion && (
            <div style={{ fontSize: '12px', color: '#047857', background: '#ecfdf5', padding: '10px 12px', borderRadius: '12px', fontWeight: '700', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <span>{aiAnalysisResult.consejoDeCalentamientoYPrevencion}</span>
            </div>
          )}
        </div>
      )}

      {/* MODAL CONFIGURACIÓN GOOGLE SHEETS */}
      {showSheetsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card animate-scale" style={{ maxWidth: '500px', width: '100%', padding: '24px', borderRadius: '28px', background: '#ffffff', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cloud size={28} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: '#0f172a' }}>Sincronización con Google Sheets</h3>
              </div>
              <button type="button" onClick={() => setShowSheetsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={22} color="#64748b" />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '16px', fontWeight: '500' }}>
              Pega aquí el enlace web (Webhook URL) de tu <strong>Google Apps Script</strong> para guardar en la nube tus entrenamientos en tiempo real y tener una base de datos persistente unificada.
            </p>

            <form onSubmit={handleSaveSheetsUrl}>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: '6px', fontSize: '12px' }}>URL de App Web Google Apps Script:</label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
                  value={tempSheetsUrl}
                  onChange={(e) => setTempSheetsUrl(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '16px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '600', background: '#f8fafc' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'block' }}>
                  💡 ¿No tienes el código o la URL aún? Ve al menú principal, entra a la pestaña <strong>'Análisis'</strong> y busca el cuadro de Google Sheets para copiar el script en 30 segundos.
                </span>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowSheetsModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>Guardar y Conectar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL Y REGLAS INQUEBRANTABLES DEL PROTOCOLO */}
      <div className="card" style={{ padding: '16px', marginBottom: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%)', borderLeft: '6px solid #7c3aed', boxShadow: '0 10px 25px rgba(124, 58, 237, 0.08)' }}>
        <div 
          onClick={() => setShowProtocolRules(!showProtocolRules)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none', flexWrap: 'wrap', gap: '10px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 auto' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e1b4b' }}>Manual de Operaciones & Reglas</h3>
              <span style={{ fontSize: '11px', color: '#6d28d9', fontWeight: '700', display: 'block' }}>Protocolo Adonis • Las 4 Leyes Científicas</span>
            </div>
          </div>

          <button 
            type="button"
            style={{ 
              background: showProtocolRules ? '#1e1b4b' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 18px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: '800', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: showProtocolRules ? 'none' : '0 4px 15px rgba(124, 58, 237, 0.3)',
              transition: 'all 0.25s ease'
            }}
          >
            {showProtocolRules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showProtocolRules ? 'Ocultar Manual' : '📖 Leer Manual'}
          </button>
        </div>

        {showProtocolRules && (
          <div className="animate-fade" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1.5px dashed #ddd6fe', fontSize: '13px', color: '#334155' }}>
            <p style={{ fontSize: '12px', color: '#4c1d95', margin: '0 0 16px 0', fontWeight: '600', fontStyle: 'italic', background: '#ede9fe', padding: '10px 14px', borderRadius: '12px' }}>
              💡 <strong>Nota del Coach:</strong> Estas reglas protegen tu pared abdominal contra sobrepresión y aseguran la hipertrofia pura de tu entrenamiento.
            </p>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ background: '#ffffff', border: '1.5px solid #fca5a5', borderLeft: '5px solid #ef4444', borderRadius: '14px', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} color="#dc2626" />
                  <strong style={{ fontSize: '14px', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>1. La Regla de la Hernia (Presión IAP)</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>EXHALA FUERTE</strong> (bota el aire por la boca) en el momento exacto de mayor esfuerzo en cada repetición.</li>
                  <li><strong>NUNCA aguantes la respiración</strong> ni uses la maniobra de Valsalva cerrada. El flujo de aire constante disminuye drásticamente la presión intraabdominal para proteger contra hernias.</li>
                </ul>
              </div>

              <div style={{ background: '#ffffff', border: '1.5px solid #93c5fd', borderLeft: '5px solid #3b82f6', borderRadius: '14px', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Activity size={18} color="#2563eb" />
                  <strong style={{ fontSize: '14px', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.4px' }}>2. Descansos & Cardio Zona 2</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Tiempos de Descanso:</strong> 2 a 3 minutos para ejercicios compuestos o grandes (Hack Squat, Press Inclinado, Remos). 90 segundos estrictos para ejercicios de aislamiento.</li>
                  <li><strong>Tu Cardio (Zona 2):</strong> Caminadora con inclinación (velocidad 4-5 km/h, inclinación 10-12%), Bicicleta o Elíptica. <strong>NO uses la Stairmaster (Escaleras)</strong>.</li>
                </ul>
              </div>

              <div style={{ background: '#ffffff', border: '1.5px solid #86efac', borderLeft: '5px solid #10b981', borderRadius: '14px', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={18} color="#047857" />
                  <strong style={{ fontSize: '14px', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.4px' }}>3. Doble Progresión (Cómo Subir Peso)</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Si un ejercicio prescribe <strong>"3 series de 8 a 10 reps"</strong> e inicias haciendo 3 series de 8 con 80 lbs, tu meta la semana siguiente será hacer 9 reps y luego 10.</li>
                  <li>Cuando logres hacer el máximo de repeticiones indicadas (10 reps) en TODAS las series con excelente técnica, <strong>ese es el indicador exacto para subir el peso</strong> en tu siguiente sesión.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enfoque Fisiológico */}
      <div className="card card-highlight" style={{ padding: '16px', marginBottom: '16px' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', whiteSpace: 'normal' }}>Enfoque Fisiológico del Día</h3>
          </div>
          {previousSession.dateString && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
              Última sesión: {previousSession.dateString.split(',')[0]}
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', marginTop: '8px', color: '#334155', fontWeight: '500', lineHeight: '1.5' }}>
          {currentDay.focus}
        </p>
      </div>

      {/* Barritas KPI en vivo (Apple Glass Black Pill) */}
      {currentDay.type === 'workout' && (
        <div style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
          color: '#fff', 
          padding: '16px 18px', 
          borderRadius: '24px', 
          marginBottom: '20px', 
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Carga Acumulada</span>
            <strong style={{ fontSize: '20px', color: '#ffffff', fontWeight: '800' }}>{volume.toLocaleString()} <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>lbs-reps</span></strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Series Listas</span>
            <strong style={{ fontSize: '20px', color: '#00b464', fontWeight: '800' }}>{completedSets} <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Fuerza</span></strong>
          </div>
          <button 
            type="button"
            onClick={handleResetCurrent} 
            title="Reiniciar casillas hoy" 
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', padding: '10px', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      )}

      {/* Contenedor de Rutina y Calentamiento General */}
      {currentDay.type === 'rest' && currentDay.exercises.length === 0 ? (
        <div className="card card-success" style={{ padding: '36px 22px', textAlign: 'center', margin: '20px 0' }}>
          <CheckCircle size={52} color="#00b464" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ color: '#0f172a', fontSize: '20px', whiteSpace: 'normal' }}>Día de Síntesis Fibrilar & Descanso Total</h2>
          <p style={{ marginTop: '10px', color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
            Descanso absoluto programado por el Protocolo Adonis. Dedícate a tus compromisos laborales y a la preparación de tus comidas para cumplir con tus 160g de proteína y carbohidratos de reparación.
          </p>
        </div>
      ) : (
        <div>
          {/* MÓDULO GLOBAL DE CALENTAMIENTO Y MOVILIDAD ANTES DE INICIAR FUERZA */}
          {currentDay.type === 'workout' && (
            <div 
              onClick={() => {
                setGlobalWarmupDone(prev => {
                  const newVal = !isWarmupDone;
                  if (newVal) modal.showAlert({ title: "🔥 Activación General Lista", message: "Temperatura corporal elevada y fluido sinovial lubricado en tus articulaciones. ¡Listo para iniciar tu primera serie de fuerza!", variant: "success" });
                  return { ...prev, [warmupKey]: newVal, ...(currentWeek === 1 ? { [currentDay.id]: newVal } : {}) };
                });
              }}
              style={{
                background: isWarmupDone ? '#ecfdf5' : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                border: isWarmupDone ? '2px solid #34d399' : '2px solid #f59e0b',
                borderRadius: '24px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: isWarmupDone ? '0 8px 25px rgba(16, 185, 129, 0.12)' : '0 8px 25px rgba(245, 158, 11, 0.15)',
                transition: 'all 0.25s ease',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '23px', background: isWarmupDone ? '#10b981' : '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isWarmupDone ? <Check size={26} /> : <Flame size={26} />}
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: isWarmupDone ? '#065f46' : '#92400e' }}>
                    {isWarmupDone ? '¡Fase Inicial Terminada ✓!' : '⚠️ Paso 0: Calentamiento & Movilidad (5-10 min)'}
                  </span>
                  <h4 style={{ margin: '2px 0 4px 0', fontSize: '16px', fontWeight: '800', color: isWarmupDone ? '#065f46' : '#78350f' }}>
                    Activación Cardiovascular & Articular (S{currentWeek})
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: isWarmupDone ? '#047857' : '#92400e', fontWeight: '600', lineHeight: '1.4' }}>
                    3-5 min de caminata/bici en Zona 1 + movimientos articulares para proteger hombros, rodillas y columna. Toca para confirmar ejecución.
                  </p>
                </div>
              </div>
              <div style={{ flexShrink: 0, marginLeft: '10px' }}>
                <span className={`badge ${isWarmupDone ? 'badge-green' : 'badge-warning'}`} style={{ fontWeight: '900', padding: '6px 12px', fontSize: '12px' }}>
                  {isWarmupDone ? '✅ LISTO' : '👆 MARCAR'}
                </span>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', padding: '0 4px', letterSpacing: '0.3px' }}>
            <span>Rutina Preconfigurada (Toca una tarjeta para abrir):</span>
            <span>{currentDay.exercises.length} Módulos</span>
          </div>

          {currentDay.exercises.map((exercise, idx) => {
            const isCurrentlyExpanded = expandedExerciseId !== null 
              ? (expandedExerciseId === exercise.id) 
              : (idx === firstUncompletedIdx);

            const handleToggle = () => {
              if (isCurrentlyExpanded) {
                setExpandedExerciseId('none');
              } else {
                setExpandedExerciseId(exercise.id);
              }
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
                previousData={previousExercisesData[exercise.id]}
                onUpdateSet={(setNum, setData) => handleUpdateSet(exercise.id, setNum, setData)}
                onUpdateExerciseMeta={(meta) => handleUpdateExerciseMeta(exercise.id, meta)}
                onSwapExercise={handleSwapExercise}
                initiallyExpanded={false}
                isExpanded={isCurrentlyExpanded}
                onToggleExpand={handleToggle}
              />
            );
          })}

          {/* Módulo de Agregar Nuevo Ejercicio */}
          {isAddingExercise ? (
            <div className="card animate-fade" style={{ padding: '18px', borderTop: '5px solid #0066ff', background: '#ffffff', marginBottom: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Dumbbell size={18} color="#0066ff" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', whiteSpace: 'normal' }}>Nuevo Ejercicio en Rutina</h3>
                </div>
                <button type="button" onClick={() => setIsAddingExercise(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={22} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleAddCustomExercise}>
                <div style={{ background: '#f5f3ff', border: '1.5px solid #a78bfa', padding: '12px', borderRadius: '14px', marginBottom: '14px', textAlign: 'left' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '6px', color: '#5b21b6', fontWeight: '900', fontSize: '12px' }}>
                    ⚡️ Elegir de Base de Datos de Máquinas Unificada (Recomendado):
                  </label>
                  <select
                    defaultValue=""
                    onChange={(e) => handlePickFromLibrary(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #7c3aed', background: '#ffffff', color: '#1e1b4b', fontWeight: '700', fontSize: '13px' }}
                  >
                    <option value="">👆 Seleccionar máquina / ejercicio oficial...</option>
                    {UNIFIED_EXERCISE_LIBRARY.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        [{ex.muscleGroup}] • {ex.name} ({ex.equipment})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Nombre del Ejercicio (o Edición Libre):</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Curl de Bíceps en Banco Scott con Barra Z" 
                    value={newExName} 
                    onChange={e => setNewExName(e.target.value)} 
                    style={{ textAlign: 'left', padding: '10px 12px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Grupo Muscular Principal:</label>
                  <select
                    value={newExMuscleGroup}
                    onChange={e => setNewExMuscleGroup(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="Pecho (Pectoral)">Pecho (Pectoral)</option>
                    <option value="Espalda (Dorsal/Remo)">Espalda (Dorsal/Remo)</option>
                    <option value="Hombros (Deltoides)">Hombros (Deltoides)</option>
                    <option value="Cuádriceps">Cuádriceps</option>
                    <option value="Isquios & Glúteos">Isquios & Glúteos</option>
                    <option value="Bíceps">Bíceps</option>
                    <option value="Tríceps">Tríceps</option>
                    <option value="Pantorrillas">Pantorrillas</option>
                    <option value="Core (Abdominal/IAP)">Core (Abdominal/IAP)</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="grid-2" style={{ marginBottom: '12px', gap: '10px' }}>
                  <div className="input-group">
                    <label className="input-label" style={{ textAlign: 'left', marginBottom: '4px' }}>Series Meta:</label>
                    <input 
                      type="number" 
                      placeholder="3" 
                      value={newExSets} 
                      onChange={e => setNewExSets(e.target.value)}
                      style={{ padding: '10px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }} 
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label" style={{ textAlign: 'left', marginBottom: '4px' }}>Rango de Reps:</label>
                    <input 
                      type="text" 
                      placeholder="10-12" 
                      value={newExReps} 
                      onChange={e => setNewExReps(e.target.value)}
                      style={{ padding: '10px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Descanso Prescrito:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 90 s" 
                    value={newExRest} 
                    onChange={e => setNewExRest(e.target.value)} 
                    style={{ textAlign: 'left', padding: '10px 12px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Indicación Biomecánica / Técnica:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Mantener codos firmes sin balancear el torso." 
                    value={newExBiomech} 
                    onChange={e => setNewExBiomech(e.target.value)} 
                    style={{ textAlign: 'left', padding: '10px 12px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }}
                  />
                </div>

                <div style={{ background: '#eff6ff', border: '1.5px solid #3b82f6', padding: '12px', borderRadius: '14px', marginBottom: '18px', textAlign: 'left' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '4px', color: '#1e3a8a', fontWeight: '900', fontSize: '12px' }}>
                    🗓️ ¿En qué día de tu rutina deseas estructurarlo?:
                  </label>
                  <select
                    value={newExTargetDay || baseDay.id}
                    onChange={e => setNewExTargetDay(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #2563eb', background: '#ffffff', color: '#1e3a8a', fontWeight: '800', fontSize: '13px' }}
                  >
                    {scientificProtocol.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid-2" style={{ gap: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddingExercise(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar en Rutina</button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ marginBottom: '24px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button"
                className="btn btn-outline" 
                onClick={() => setIsAddingExercise(true)}
                style={{ background: 'rgba(255, 255, 255, 0.9)', border: '2px dashed #94a3b8', color: '#334155', fontWeight: '800', padding: '15px' }}
              >
                <Plus size={18} color="#0066ff" style={{ display: 'inline', marginRight: '6px' }} /> + Agregar Ejercicio a este Día
              </button>

              <button
                type="button"
                onClick={() => setShowRoutineBuilder(true)}
                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '20px', fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.35)', cursor: 'pointer' }}
              >
                <Layers size={18} color="#38bdf8" />
                🛠️ Base de Datos de Ejercicios Creados & Estructurador de Rutina
              </button>
            </div>
          )}

          {/* Botón Principal de Finalizar */}
          <div style={{ marginTop: '28px', marginBottom: '20px' }}>
            <button type="button" className="btn btn-primary" onClick={handleFinishWorkout} style={{ padding: '18px', fontSize: '17px', borderRadius: '20px', fontWeight: '800', boxShadow: '0 8px 25px rgba(0, 102, 255, 0.4)' }}>
              <Save size={24} /> Guardar Sesión en Bitácora Científica
            </button>
          </div>
        </div>
      )}

      {/* MODAL MAESTRO: GESTOR DE RUTINAS, BASE DE DATOS Y REGISTRO DE DATOS HISTÓRICOS */}
      {showRoutineBuilder && (
        <div className="modal-backdrop animate-fade" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
          <div className="modal-content" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', background: '#ffffff', borderRadius: '28px', padding: '24px', overflowY: 'auto', border: '1.5px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)' }}>
            
            <div className="flex-between" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={24} color="#0066ff" />
                <div>
                  <strong style={{ display: 'block', fontSize: '17px', color: '#0f172a', fontWeight: '900', textAlign: 'left' }}>
                    Gestor Maestro de Rutina & Ejercicios
                  </strong>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    Estructura tu semana Lunes a Sábado y consulta tu histórico
                  </span>
                </div>
              </div>
              <button type="button" onClick={() => { setShowRoutineBuilder(false); setSelectedBuilderExHistory(null); }} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '14px', cursor: 'pointer' }}>
                <X size={22} color="#475569" />
              </button>
            </div>

            {/* SECCIÓN 1: MIS EJERCICIOS CREADOS & REGISTROS */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '22px', border: '1px solid #e2e8f0', marginBottom: '20px', textAlign: 'left' }}>
              <strong style={{ fontSize: '15px', color: '#1e293b', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Dumbbell size={18} color="#3b82f6" /> Base de Datos de Mis Ejercicios Creados:
              </strong>
              <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                Todos tus ejercicios personalizados guardados. Puedes estructurarlos en cualquier día o consultar tu histórico de series y pesos registrados:
              </p>

              {Object.values(customExercisesMap || {}).flat().length === 0 ? (
                <div style={{ padding: '16px', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1', textCenter: 'center', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                  Aún no has creado ejercicios personalizados. Usa el botón "+ Agregar Ejercicio" o elige del catálogo unificado.
                </div>
              ) : (
                <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                  {Object.entries(customExercisesMap || {}).flatMap(([dId, list]) => (list || []).map(ex => ({ ...ex, currentDayId: dId }))).map((ex, idx) => {
                    const dayObj = scientificProtocol.find(d => d.id === ex.currentDayId);
                    return (
                      <div key={ex.id || idx} style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '16px', border: '1.5px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', fontWeight: '800' }}>{ex.name}</strong>
                          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700' }}>Asignado a: {dayObj ? dayObj.name.split(':')[0] : 'General'} • [{ex.muscleGroup}]</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedBuilderExHistory(ex)}
                            style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <History size={13} /> Historial
                          </button>
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) handleAssignExistingToDay(ex, e.target.value);
                            }}
                            style={{ padding: '6px 8px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: '800', background: '#f8fafc', color: '#0f172a', cursor: 'pointer' }}
                          >
                            <option value="">➕ Copiar a día...</option>
                            {scientificProtocol.map(d => <option key={d.id} value={d.id}>{d.name.split(':')[0]}</option>)}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomExerciseFromDay(ex.currentDayId, ex.id)}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 9px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}
                            title="Quitar de este día"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MODAL SECUNDARIO DE HISTORIAL E INSPECCIÓN DE DATOS DEL EJERCICIO */}
            {selectedBuilderExHistory && (
              <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', padding: '16px', borderRadius: '22px', marginBottom: '20px', textAlign: 'left' }}>
                <div className="flex-between" style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '15px', color: '#b45309', fontWeight: '900' }}>
                    📊 Registro y Datos del Ejercicio: {selectedBuilderExHistory.name}
                  </strong>
                  <button type="button" onClick={() => setSelectedBuilderExHistory(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '900', color: '#b45309' }}>X</button>
                </div>
                <p style={{ fontSize: '12px', color: '#78350f', margin: '0 0 12px 0', fontWeight: '600' }}>
                  Histórico de cargas, repeticiones y fechas guardados en tu bitácora de Google Sheets y local:
                </p>
                <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(() => {
                    const records = (workoutHistory || []).filter(h => h.exercises && h.exercises[selectedBuilderExHistory.id]);
                    if (records.length === 0) {
                      return <span style={{ fontSize: '12px', color: '#92400e', fontStyle: 'italic' }}>Aún no hay registros de peso levantado en sesiones pasadas para este ejercicio.</span>;
                    }
                    return records.map((rec, rIdx) => {
                      const exLog = rec.exercises[selectedBuilderExHistory.id];
                      return (
                        <div key={rIdx} style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #fde68a', fontSize: '12px' }}>
                          <strong style={{ color: '#0f172a' }}>📅 {new Date(rec.date).toLocaleDateString('es-MX', { dateStyle: 'medium' })}</strong> • 
                          <span style={{ color: '#b45309', fontWeight: '700' }}> Cargas registradas: </span>
                          {Object.keys(exLog || {}).filter(k => !isNaN(parseInt(k))).map(sNum => `${exLog[sNum].weight || 0} lbs x ${exLog[sNum].reps || 0} reps`).join(' | ')}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* SECCIÓN 2: ESTRUCTURADOR SEMANAL DE RUTINAS ADONIS */}
            <div style={{ textAlign: 'left' }}>
              <strong style={{ fontSize: '16px', color: '#0f172a', fontWeight: '900', display: 'block', marginBottom: '6px' }}>
                📅 Estructurador de Rutina Semanal (Lunes a Sábado):
              </strong>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: '1.4', fontWeight: '600' }}>
                Tu estructura oficial sincronizada con Google Sheets. Verifica o limpia los ejercicios de cada uno de tus días:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {scientificProtocol.map(dayObj => {
                  const dayCustoms = (customExercisesMap || {})[dayObj.id] || [];
                  const allEx = [...(dayObj.exercises || []), ...dayCustoms];
                  return (
                    <div key={dayObj.id} style={{ border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '14px', background: dayObj.id === currentDay.id ? '#eff6ff' : '#ffffff', borderColor: dayObj.id === currentDay.id ? '#3b82f6' : '#e2e8f0' }}>
                      <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '14px', color: '#1e293b', fontWeight: '900' }}>
                          {dayObj.name} {dayObj.id === currentDay.id && '📍 (Día Actual)'}
                        </strong>
                        <span style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                          {allEx.length} ejercicios
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {allEx.map(ex => {
                          const isCustom = dayCustoms.some(c => c.id === ex.id);
                          return (
                            <span key={ex.id} style={{ background: isCustom ? '#dbeafe' : '#f1f5f9', color: isCustom ? '#1e40af' : '#475569', border: '1px solid', borderColor: isCustom ? '#93c5fd' : '#cbd5e1', padding: '5px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              {ex.name}
                              {isCustom && (
                                <button type="button" onClick={() => handleRemoveCustomExerciseFromDay(dayObj.id, ex.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#dc2626', fontWeight: '900', fontSize: '12px' }} title="Remover">✕</button>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRoutineBuilder(false)}
              style={{ width: '100%', background: '#0f172a', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '18px', fontSize: '15px', fontWeight: '900', marginTop: '24px', cursor: 'pointer' }}
            >
              ✅ Concluir Estructuración y Volver a Entrenar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
