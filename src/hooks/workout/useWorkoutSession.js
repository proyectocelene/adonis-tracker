import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSyncedStore } from '../useSyncedStore';
import { calculateWorkoutCalories } from '../../utils/calorieCalculations';
import {
  mergeDraftAndHistoryExercises,
  calculateSessionVolumeAndSets,
  resolveUserWeight,
  calculateFirstUncompletedIdx
} from '../../utils/sessionDataHelper';
import { useSessionUpdater } from './useSessionUpdater';
import { useSessionArchiver } from './useSessionArchiver';

export function useWorkoutSession({
  selectedDateKey,
  isViewingHistory,
  baseDay,
  currentWeek,
  customExercisesMap,
  swappedExercisesMap,
  skippedExercisesMap,
  exerciseOrderMap,
  deferredExIds,
  isDeloadMode,
  workoutHistory,
  isHistoryLoading,
  saveSession,
  deleteSession,
  historySession,
  modal
}) {
  // 1. Stores y Base de Datos (Únicos dueños de estas claves de sesión)
  const [currentSessions, setCurrentSessions, isSessionsLoading] = useSyncedStore('coachv2_active_workouts', {});
  const [bodyMetrics, , isMetricsLoading] = useSyncedStore('coachv2_body_metrics_history', []);
  const [bodyComposition] = useSyncedStore('coachv2_body_composition_data', {});
  const [globalMachineConfigs] = useSyncedStore('coachv2_machine_configs', {});
  const [globalMachineProfiles] = useSyncedStore('coachv2_machine_profiles', {});
  const [globalWarmupDone, setGlobalWarmupDone] = useSyncedStore('coachv2_global_warmup', {});
  const [smartwatchKcalMap, setSmartwatchKcalMap] = useSyncedStore('coachv2_smartwatch_kcal', {});

  const isLoadingDb = isHistoryLoading || isSessionsLoading || isMetricsLoading;

  // 2. Fusión profunda segura de los datos de la sesión (MEMOIZADO para estabilidad)
  const todayWorkoutData = useMemo(() => {
    return mergeDraftAndHistoryExercises(
      historySession?.exercises,
      currentSessions?.[`draft_${selectedDateKey}`]
    );
  }, [historySession?.exercises, currentSessions, selectedDateKey]);

  // 3. Composición de currentDay
  const temporaryTodayExercises = useMemo(() => {
    const userCustomForDay = customExercisesMap?.[baseDay.id] || [];
    const baseDayExercises = baseDay.exercises || [];
    const temps = [];
    const rawDayData = isViewingHistory
      ? (historySession?.exercises || {})
      : (currentSessions?.[`draft_${selectedDateKey}`] || {});

    Object.keys(rawDayData).forEach(exId => {
      const d = rawDayData[exId];
      if (d && (d.isTemporaryToday || exId.startsWith('temp_today_')) &&
          !baseDayExercises.some(e => e.id === exId) &&
          !userCustomForDay.some(e => e.id === exId)) {
        temps.push({
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
    return temps;
  }, [isViewingHistory, historySession?.exercises, currentSessions, selectedDateKey, baseDay.exercises, baseDay.id, customExercisesMap]);

  const currentDay = useMemo(() => {
    const userCustomForDay = customExercisesMap?.[baseDay.id] || [];
    const baseDayExercises = baseDay.exercises || [];
    const rawExercises = [...baseDayExercises, ...userCustomForDay, ...temporaryTodayExercises];
    const customOrder = exerciseOrderMap?.[baseDay.id];
    let ordered = rawExercises.map(ex => {
      const swapped = (swappedExercisesMap?.[baseDay.id] || {})[ex.id];
      if (swapped) {
        return { ...ex, ...swapped, originalName: ex.name };
      }
      return ex;
    });

    if (customOrder && Array.isArray(customOrder)) {
      ordered.sort((a, b) => {
        const idxA = customOrder.indexOf(a.id);
        const idxB = customOrder.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });
    }

    if (deferredExIds && deferredExIds.length > 0) {
      ordered.sort((a, b) => {
        const aDef = deferredExIds.includes(a.id);
        const bDef = deferredExIds.includes(b.id);
        if (aDef && !bDef) return 1;
        if (!aDef && bDef) return -1;
        return 0;
      });
    }

    return {
      ...baseDay,
      exercises: ordered
    };
  }, [baseDay, customExercisesMap, temporaryTodayExercises, exerciseOrderMap, swappedExercisesMap, deferredExIds]);

  // 4. Métricas cuantitativas
  const { volume, completedSets, warmupSets, cardioCompleted } = useMemo(() => {
    return calculateSessionVolumeAndSets(todayWorkoutData, currentDay.exercises);
  }, [todayWorkoutData, currentDay.exercises]);

  const latestWeight = useMemo(() => {
    return resolveUserWeight(bodyMetrics, bodyComposition);
  }, [bodyMetrics, bodyComposition]);

  const userWeightKg = latestWeight;

  // 5. Reloj interno y temporizador de sesión
  const sessionStartTime = historySession?.startTime || currentSessions?.[`startTime_${selectedDateKey}`] || null;

  const [liveElapsedMinutes, setLiveElapsedMinutes] = useState(() => {
    if (historySession && historySession.durationMinutes) return historySession.durationMinutes;
    if (sessionStartTime) {
      const diffMs = Date.now() - new Date(sessionStartTime).getTime();
      return Math.max(1, Math.round(diffMs / 60000));
    }
    return 0;
  });

  useEffect(() => {
    if (isViewingHistory || !sessionStartTime) {
      if (historySession?.durationMinutes) {
        setLiveElapsedMinutes(historySession.durationMinutes);
      }
      return;
    }

    const updateTimer = () => {
      const diffMs = Date.now() - new Date(sessionStartTime).getTime();
      setLiveElapsedMinutes(Math.max(1, Math.round(diffMs / 60000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 10000);
    return () => clearInterval(interval);
  }, [sessionStartTime, isViewingHistory, historySession]);

  // 6. Gasto calórico
  const todayCalories = useMemo(() => {
    const defs = {};
    (currentDay.exercises || []).forEach(e => {
      defs[e.id] = { name: e.name, muscleGroup: e.muscleGroup };
    });
    const watchKcal = smartwatchKcalMap?.[selectedDateKey] || null;
    return calculateWorkoutCalories(todayWorkoutData, userWeightKg, defs, liveElapsedMinutes, watchKcal);
  }, [todayWorkoutData, currentDay.exercises, userWeightKg, liveElapsedMinutes, smartwatchKcalMap, selectedDateKey]);

  // 7. Actualizador y mutaciones de series
  const {
    updateSessionDataForCurrentDay,
    handleUpdateSet,
    handleUpdateExerciseMeta,
    handleUpdateCardio
  } = useSessionUpdater({
    historySession,
    currentSessions,
    selectedDateKey,
    saveSession,
    setCurrentSessions
  });

  // 8. Datos de sesiones anteriores
  const getPreviousDataForDay = useCallback(() => {
    const prevLog = [...workoutHistory].reverse().find(s => s.dayId === currentDay.id && (!s.date || s.date < selectedDateKey) && !s.isRestDay && !s.isMissedDay && (s.volume > 0 || s.completedSets > 0 || s.isCompleted));
    if (prevLog && prevLog.exercises) return prevLog.exercises;

    const fallbackLog = [...workoutHistory].reverse().find(s => s.dayId === currentDay.id && (!s.date || s.date < selectedDateKey));
    return fallbackLog ? (fallbackLog.exercises || {}) : {};
  }, [workoutHistory, currentDay.id, selectedDateKey]);

  const previousExercisesData = useMemo(() => getPreviousDataForDay(), [getPreviousDataForDay]);
  const previousSession = useMemo(() => {
    return [...workoutHistory].reverse().find(s => s.dayId === currentDay.id && (!s.date || s.date < selectedDateKey)) || null;
  }, [workoutHistory, currentDay.id, selectedDateKey]);

  const handleClonePreviousWeek = () => {
    if (currentWeek <= 1) return;
    const prevData = getPreviousDataForDay();
    if (!prevData || Object.keys(prevData).length === 0) {
      if (modal?.showAlert) {
        modal.showAlert({
          title: `⚠️ Sin registros previos en S${currentWeek - 1}`,
          message: `No se encontraron datos registrados en la Semana ${currentWeek - 1} para el día: "${currentDay.name}".`,
          variant: "warning"
        });
      }
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
          if (!isNaN(parseInt(k, 10))) {
            clonedDayData[exId][k] = { ...exVal[k], completed: false };
          }
        });
      }
    });

    updateSessionDataForCurrentDay(() => clonedDayData);
    if (modal?.showAlert) {
      modal.showAlert({
        title: "⚡️ ¡Pesos Clonados Exitosamente!",
        message: `Se copiaron las cargas y repeticiones de la Semana ${currentWeek - 1} como guía base.`,
        variant: "success"
      });
    }
  };

  // 9. Smartwatch kcal
  const handleSetSmartwatchKcal = (data) => {
    setSmartwatchKcalMap(prev => {
      const next = { ...(prev || {}) };
      if (!data) {
        delete next[selectedDateKey];
      } else if (typeof data === 'object') {
        next[selectedDateKey] = data;
      } else if (!isNaN(data) && Number(data) > 0) {
        next[selectedDateKey] = Math.round(Number(data));
      } else {
        delete next[selectedDateKey];
      }
      return next;
    });
  };

  // 10. Calentamiento
  const warmupKey = `warmup_${selectedDateKey}`;
  const isWarmupDone = historySession
    ? !!historySession.isWarmupDone
    : !!(currentSessions?.[`draft_${selectedDateKey}`]?.isWarmupDone || globalWarmupDone[warmupKey]);

  const handleToggleWarmup = () => {
    const newVal = !isWarmupDone;
    setGlobalWarmupDone(prev => ({
      ...prev,
      [warmupKey]: newVal
    }));
    if (historySession) {
      saveSession({
        ...historySession,
        isWarmupDone: newVal
      });
    } else {
      updateSessionDataForCurrentDay(dayData => ({
        ...dayData,
        isWarmupDone: newVal
      }));
    }
  };

  // 11. Delegación de archivado a useSessionArchiver
  const {
    handleClearCurrentDraft,
    handleResetCurrent,
    handleSaveSpecialDay,
    handleRollingShift,
    handleSaveSundayLog,
    handleFinishWorkout
  } = useSessionArchiver({
    historySession,
    setCurrentSessions,
    selectedDateKey,
    currentDay,
    baseDay,
    currentWeek,
    liveElapsedMinutes,
    completedSets,
    volume,
    cardioCompleted,
    todayCalories,
    todayWorkoutData,
    globalMachineConfigs,
    skippedExercisesMap,
    userWeightKg,
    bodyMetrics,
    bodyComposition,
    isDeloadMode,
    sessionStartTime,
    saveSession,
    deleteSession,
    updateSessionDataForCurrentDay,
    modal
  });

  const firstUncompletedIdx = useMemo(() => {
    return calculateFirstUncompletedIdx(currentDay.exercises, todayWorkoutData);
  }, [currentDay.exercises, todayWorkoutData]);

  return {
    isLoadingDb,
    currentSessions,
    setCurrentSessions,
    currentDay,
    todayWorkoutData,
    volume,
    completedSets,
    warmupSets,
    cardioCompleted,
    latestWeight,
    userWeightKg,
    bodyMetrics,
    bodyComposition,
    globalMachineConfigs,
    globalMachineProfiles,
    smartwatchKcalMap,
    sessionStartTime,
    liveElapsedMinutes,
    todayCalories,
    isWarmupDone,
    firstUncompletedIdx,
    previousExercisesData,
    previousSession,

    updateSessionDataForCurrentDay,
    handleUpdateSet,
    handleUpdateExerciseMeta,
    handleUpdateCardio,
    handleClonePreviousWeek,
    handleSetSmartwatchKcal,
    handleToggleWarmup,
    handleClearCurrentDraft,
    handleResetCurrent,
    handleSaveSpecialDay,
    handleRollingShift,
    handleSaveSundayLog,
    handleFinishWorkout
  };
}
