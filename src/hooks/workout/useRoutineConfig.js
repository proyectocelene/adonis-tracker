import { useState, useEffect, useMemo } from 'react';
import { useSyncedStore } from '../useSyncedStore';
import { scientificProtocol } from '../../data/scientificProtocol';
import { isSplitOverrideActive, distributePendingExercisesAcrossDays } from '../../utils/adaptiveRoutineEngine';
import { detectUnfinishedExercisesFromPreviousSession } from '../../utils/pendingExercisesDetector';
import { executeCleanSlate } from '../../services/cleanSlateService';

export function useRoutineConfig({
  workoutHistory,
  isHistoryLoading,
  selectedDateKey,
  isViewingHistory,
  historySession,
  currentDayIndex,
  currentUser,
  modal
}) {
  // 1. Stores sincronizados en Firestore
  const [customRoutine, setCustomRoutine] = useSyncedStore('coachv2_custom_routine', null);
  const [mesocycleStartDate, setMesocycleStartDate] = useSyncedStore('coachv2_mesocycle_start', null);
  const [customExercisesMap, setCustomExercisesMap] = useSyncedStore('coachv2_custom_day_exercises', {});
  const [swappedExercisesMap, setSwappedExercisesMap] = useSyncedStore('coachv2_swapped_exercises', {});
  const [skippedExercisesMap, setSkippedExercisesMap] = useSyncedStore('coachv2_skipped_exercises', {});
  const [exerciseOrderMap, setExerciseOrderMap] = useSyncedStore('coachv2_exercise_orders', {});
  const [weekSplitOverride, setWeekSplitOverride] = useSyncedStore('coachv2_week_split_override', null);
  const [dismissedPendingAlerts, setDismissedPendingAlerts] = useSyncedStore('coachv2_dismissed_pending_alerts', {});

  // 2. Estado local de diferimiento temporal en la sesión
  const [deferredExIds, setDeferredExIds] = useState([]);

  // 3. Expiración de split override semanal (domingo 23:59)
  const isOverrideActive = useMemo(() => isSplitOverrideActive(weekSplitOverride), [weekSplitOverride]);
  useEffect(() => {
    if (weekSplitOverride && !isOverrideActive) {
      setWeekSplitOverride(null);
    }
  }, [weekSplitOverride, isOverrideActive, setWeekSplitOverride]);

  // 4. Rutina activa y selección de día base
  const baseActiveDays = (customRoutine && Array.isArray(customRoutine) && customRoutine.length > 0) ? customRoutine : scientificProtocol;
  const activeDays = (isOverrideActive && weekSplitOverride?.routine && Array.isArray(weekSplitOverride.routine))
    ? weekSplitOverride.routine
    : baseActiveDays;

  let effectiveDayIndex = currentDayIndex;
  if (historySession && historySession.dayId) {
    const histIndex = activeDays.findIndex(d => d.id === historySession.dayId);
    if (histIndex !== -1) {
      effectiveDayIndex = histIndex;
    }
  }

  const baseDay = activeDays[effectiveDayIndex] || activeDays[0] || scientificProtocol[0];

  // 5. Cálculo de semana automática del mesociclo
  let currentWeek = 1;
  if (mesocycleStartDate) {
    const startDate = new Date(mesocycleStartDate);
    startDate.setHours(0, 0, 0, 0);
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

  // 6. Detección de ejercicios pendientes de sesiones anteriores
  const pendingPreviousData = useMemo(() => {
    if (isViewingHistory) return null;
    return detectUnfinishedExercisesFromPreviousSession({
      selectedDateKey,
      activeDays,
      workoutHistory,
      dismissedAlerts: dismissedPendingAlerts,
      customExercisesMap
    });
  }, [selectedDateKey, activeDays, workoutHistory, dismissedPendingAlerts, isViewingHistory, customExercisesMap]);

  // 7. Handlers de reordenamiento, defer y swaps
  const handleDeferExercise = (exerciseId) => {
    setDeferredExIds(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      }
      return [...prev, exerciseId];
    });
  };

  const handleMoveExercise = (exerciseId, direction, currentDayExercises) => {
    const dayId = baseDay.id;
    const currentOrderList = (currentDayExercises || []).map(x => x.id);
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
    if (newExerciseData && modal?.showAlert) {
      modal.showAlert({
        title: "🔄 Ejercicio Sustituido",
        message: `El ejercicio fue actualizado por "${newExerciseData.name}".`,
        variant: "success"
      });
    }
  };

  const handleSkipExercise = (exerciseId, reason = '') => {
    setSkippedExercisesMap(prev => {
      const daySkips = { ...(prev[baseDay.id] || {}) };
      if (reason === null || reason === false) {
        delete daySkips[exerciseId];
      } else {
        daySkips[exerciseId] = {
          skippedAt: new Date().toISOString(),
          reason: reason || 'Omitido voluntariamente'
        };
      }
      return {
        ...prev,
        [baseDay.id]: daySkips
      };
    });
  };

  const handleMoveExerciseBetweenDays = (sourceDayId, targetDayId, exerciseId) => {
    const srcDay = activeDays.find(d => d.id === sourceDayId);
    const targetDay = activeDays.find(d => d.id === targetDayId);
    if (!srcDay || !targetDay) return;

    const exToMove = (srcDay.exercises || []).find(e => e.id === exerciseId);
    if (!exToMove) return;

    const currentTargetCustoms = customExercisesMap[targetDayId] || [];
    const newTargetItem = {
      id: `moved_${Date.now()}_${exToMove.id}`,
      name: exToMove.name,
      muscleGroup: exToMove.muscleGroup || 'General',
      sets: exToMove.sets || 3,
      reps: exToMove.reps || '10-12',
      restTime: exToMove.restTime || '90 s',
      biomechanics: exToMove.biomechanics || 'Ejercicio redistribuido para balance de volumen semanal.',
      unifiedCode: exToMove.unifiedCode,
      isCustom: true
    };

    setCustomExercisesMap(prev => ({
      ...prev,
      [targetDayId]: [...currentTargetCustoms, newTargetItem]
    }));

    if (modal?.showAlert) {
      modal.showAlert({
        title: "⚖️ Volumen Redistribuido",
        message: `${exToMove.name} fue transferido a ${targetDay.name.split(':')[0]} para equilibrar tus series semanales.`,
        variant: "success"
      });
    }
  };

  const handleImportPendingToToday = (exercisesToImport) => {
    if (!exercisesToImport || exercisesToImport.length === 0) return;
    const dayKey = baseDay.id;
    const existingCustoms = customExercisesMap[dayKey] || [];
    const newAdds = exercisesToImport.map(ex => ({
      id: `pending_${Date.now()}_${ex.id || Math.random().toString(36).substr(2, 6)}`,
      name: ex.name,
      muscleGroup: ex.muscleGroup || 'General',
      sets: ex.sets || 3,
      reps: ex.reps || '10-12',
      restTime: ex.restTime || '90 s',
      biomechanics: ex.biomechanics || 'Trabajo recuperado de sesión pendiente para balance de volumen semanal.',
      unifiedCode: ex.unifiedCode,
      isCustom: true
    }));

    setCustomExercisesMap(prev => ({
      ...prev,
      [dayKey]: [...existingCustoms, ...newAdds]
    }));

    setDismissedPendingAlerts(prev => ({
      ...prev,
      [selectedDateKey]: true
    }));

    if (modal?.showAlert) {
      modal.showAlert({
        title: "✅ Ejercicios Incorporados",
        message: `Se agregaron ${newAdds.length} ejercicio(s) al final de tu rutina de hoy (${baseDay.name}) como remate para completar tu volumen semanal.`,
        variant: "success"
      });
    }
  };

  const handleDistributePendingAcrossWeek = (exercisesToDistribute) => {
    if (!exercisesToDistribute || exercisesToDistribute.length === 0) return;

    const currentDayPos = effectiveDayIndex;
    const remainingDays = activeDays.filter((d, idx) => {
      if (!d || d.type === 'rest' || d.id === 'd7') return false;
      return idx >= currentDayPos;
    });

    const candidateDays = remainingDays.length > 0
      ? remainingDays
      : activeDays.filter(d => d && d.type !== 'rest' && d.id !== 'd7');

    const { distributionMap, summaryItems } = distributePendingExercisesAcrossDays({
      pendingExercises: exercisesToDistribute,
      remainingDays: candidateDays,
      existingCustomsMap: customExercisesMap
    });

    if (summaryItems.length === 0) {
      if (modal?.showAlert) {
        modal.showAlert({
          title: "⚠️ Sin días disponibles",
          message: "No se encontraron días de entrenamiento restantes para redistribuir en esta semana. Puedes sumarlos a la sesión de hoy.",
          variant: "warning"
        });
      }
      return;
    }

    setCustomExercisesMap(prev => {
      const nextMap = { ...(prev || {}) };
      Object.entries(distributionMap).forEach(([dayId, items]) => {
        if (items && items.length > 0) {
          nextMap[dayId] = [...(nextMap[dayId] || []), ...items];
        }
      });
      return nextMap;
    });

    setDismissedPendingAlerts(prev => ({
      ...prev,
      [selectedDateKey]: true
    }));

    const groupedSummary = {};
    summaryItems.forEach(item => {
      if (!groupedSummary[item.targetDayName]) groupedSummary[item.targetDayName] = [];
      groupedSummary[item.targetDayName].push(item.exerciseName);
    });

    const summaryList = Object.entries(groupedSummary)
      .map(([dayName, exNames]) => `• ${dayName}: ${exNames.join(', ')}`)
      .join('\n');

    if (modal?.showAlert) {
      modal.showAlert({
        title: "⚡ Distribución Inteligente Completada",
        message: `Se distribuyeron ${summaryItems.length} ejercicio(s) pendiente(s) respetando sinergia muscular y un límite seguro de 1-2 ejercicios por sesión:\n\n${summaryList}\n\n✅ Tu volumen semanal queda totalmente salvaguardado sin sobrecargar ninguna sesión.`,
        variant: "success"
      });
    }
  };

  // 8. Resets seguros con BORRAR y auto-backup
  const handleExecuteCleanSlate = () => {
    modal.showConfirm({
      title: "🧹 Clean Slate: Purgar Caché y Órdenes Viejos",
      message: "Esta acción descargará una copia de seguridad automática y eliminará en tu dispositivo y en Firestore Cloud cualquier orden residual o rutina desfasada.\n\n✅ Tu historial completo de entrenamientos, pesos levantados y marcas de 1RM quedará 100% a salvo e intacto.\n\n¿Proceder con la purga limpia?",
      confirmText: "🧹 Sí, Purgar y Limpiar Todo",
      cancelText: "Cancelar",
      variant: "danger",
      requireWord: "BORRAR",
      onConfirm: async () => {
        const nowIso = new Date().toISOString();
        const clearPayload = { __cleared: true, clearedAt: nowIso, __approvedDrop: true };
        await executeCleanSlate(currentUser);
        setCustomExercisesMap(clearPayload);
        setSwappedExercisesMap(clearPayload);
        setExerciseOrderMap(clearPayload);
        setCustomRoutine(null);
        modal.showAlert({
          title: "🎉 Clean Slate Aplicado con Éxito",
          message: "Se generó un respaldo previo y se purgaron los órdenes desfasados. La app ahora está sincronizada al 100% con el Protocolo Oficial limpio.",
          variant: "success"
        });
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
      message: "Se generará un respaldo automático previo y se limpiarán todas las sustituciones y órdenes alterados para activar la lista oficial limpia del Protocolo Adonis Definitivo.\n\n✅ Tu historial de marcas y bitácoras anteriores permanecerá 100% a salvo e intacto.",
      confirmText: "✨ Sí, Activar en Todos los Días",
      cancelText: "Cancelar",
      variant: "warning",
      requireWord: "BORRAR",
      onConfirm: async () => {
        const nowIso = new Date().toISOString();
        const clearPayload = { __cleared: true, clearedAt: nowIso, __approvedDrop: true };
        await executeCleanSlate(currentUser);
        setCustomExercisesMap(clearPayload);
        setSwappedExercisesMap(clearPayload);
        setExerciseOrderMap(clearPayload);
        setCustomRoutine(null);
        modal.showAlert({
          title: "🎉 Protocolo Adonis Definitivo Activado",
          message: "Todos los días de la semana ahora muestran la plantilla oficial limpia sin residuos de órdenes antiguos.",
          variant: "success"
        });
      }
    });
  };

  return {
    customRoutine,
    setCustomRoutine,
    mesocycleStartDate,
    setMesocycleStartDate,
    customExercisesMap,
    setCustomExercisesMap,
    swappedExercisesMap,
    setSwappedExercisesMap,
    skippedExercisesMap,
    setSkippedExercisesMap,
    exerciseOrderMap,
    setExerciseOrderMap,
    weekSplitOverride,
    setWeekSplitOverride,
    dismissedPendingAlerts,
    setDismissedPendingAlerts,
    deferredExIds,
    setDeferredExIds,
    isOverrideActive,
    baseActiveDays,
    activeDays,
    effectiveDayIndex,
    baseDay,
    currentWeek,
    pendingPreviousData,
    handleDeferExercise,
    handleMoveExercise,
    handleSwapExercise,
    handleSkipExercise,
    handleMoveExerciseBetweenDays,
    handleImportPendingToToday,
    handleDistributePendingAcrossWeek,
    handleExecuteCleanSlate,
    handleResetToOfficialRoutine,
    handleResetAllDaysToOfficial
  };
}
