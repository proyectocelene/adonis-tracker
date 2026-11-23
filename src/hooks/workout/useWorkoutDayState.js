import { useMemo } from 'react';
import { useWorkoutHistory } from '../useWorkoutHistory';
import { resolveHistorySession } from '../../utils/sessionDataHelper';
import { useRoutineConfig } from './useRoutineConfig';
import { useDeloadManager } from './useDeloadManager';
import { useWorkoutSession } from './useWorkoutSession';
import { useCustomExerciseManager } from './useCustomExerciseManager';
import { useWorkoutAIAndExports } from './useWorkoutAIAndExports';

export function useWorkoutDayState({
  currentUser,
  modal,
  selectedDateKey,
  currentDayIndex,
  isViewingHistory
}) {
  // 1. Único listener de historial en Firestore
  const [workoutHistory, setWorkoutHistory, isHistoryLoading, saveSession, deleteSession] = useWorkoutHistory();

  // 2. Sesión archivada para la fecha seleccionada
  const historySession = useMemo(() => {
    return resolveHistorySession(workoutHistory, selectedDateKey);
  }, [workoutHistory, selectedDateKey]);

  // 3. Configuración y estructura de la rutina
  const routineConfig = useRoutineConfig({
    workoutHistory,
    isHistoryLoading,
    selectedDateKey,
    isViewingHistory,
    historySession,
    currentDayIndex,
    currentUser,
    modal
  });

  // 4. Gestión clínica de descarga y fatiga
  const deloadManager = useDeloadManager({
    workoutHistory,
    currentWeek: routineConfig.currentWeek,
    modal
  });

  // 5. Sesión activa, series, temporizador y cálculo metabólico
  const workoutSession = useWorkoutSession({
    selectedDateKey,
    isViewingHistory,
    baseDay: routineConfig.baseDay,
    currentWeek: routineConfig.currentWeek,
    customExercisesMap: routineConfig.customExercisesMap,
    swappedExercisesMap: routineConfig.swappedExercisesMap,
    skippedExercisesMap: routineConfig.skippedExercisesMap,
    exerciseOrderMap: routineConfig.exerciseOrderMap,
    deferredExIds: routineConfig.deferredExIds,
    isDeloadMode: deloadManager.isDeloadMode,
    workoutHistory,
    isHistoryLoading,
    saveSession,
    deleteSession,
    historySession,
    modal
  });

  // 6. Ejercicios personalizados
  const customExManager = useCustomExerciseManager({
    baseDay: routineConfig.baseDay,
    activeDays: routineConfig.activeDays,
    currentDayExercises: workoutSession.currentDay.exercises,
    updateSessionDataForCurrentDay: workoutSession.updateSessionDataForCurrentDay,
    setCustomExercisesMap: routineConfig.setCustomExercisesMap,
    setExerciseOrderMap: routineConfig.setExerciseOrderMap,
    modal
  });

  // 7. Auditoría AI y herramientas de exportación
  const aiAndExports = useWorkoutAIAndExports({
    currentDay: workoutSession.currentDay,
    baseDay: routineConfig.baseDay,
    todayWorkoutData: workoutSession.todayWorkoutData,
    previousExercisesData: workoutSession.previousExercisesData,
    workoutHistory,
    currentWeek: routineConfig.currentWeek,
    selectedDateKey,
    completedSets: workoutSession.completedSets,
    warmupSets: workoutSession.warmupSets,
    volume: workoutSession.volume,
    cardioCompleted: workoutSession.cardioCompleted,
    userWeightKg: workoutSession.userWeightKg,
    bodyMetrics: workoutSession.bodyMetrics,
    bodyComposition: workoutSession.bodyComposition,
    globalMachineConfigs: workoutSession.globalMachineConfigs,
    globalMachineProfiles: workoutSession.globalMachineProfiles,
    skippedExercisesMap: routineConfig.skippedExercisesMap,
    isWarmupDone: workoutSession.isWarmupDone,
    isDeloadMode: deloadManager.isDeloadMode,
    deloadCycleConfig: deloadManager.deloadCycleConfig,
    fatigueStatus: deloadManager.fatigueStatus,
    sessionStartTime: workoutSession.sessionStartTime,
    liveElapsedMinutes: workoutSession.liveElapsedMinutes,
    todayCalories: workoutSession.todayCalories,
    modal
  });

  return {
    // Historial y persistencia
    workoutHistory,
    setWorkoutHistory,
    isHistoryLoading,
    saveSession,
    deleteSession,
    historySession,

    // Sub-estados combinados
    ...routineConfig,
    ...deloadManager,
    ...workoutSession,
    ...customExManager,
    ...aiAndExports
  };
}
