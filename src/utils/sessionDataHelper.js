import { calculateVolume, isExerciseUnilateral } from '../hooks/useWorkoutCalculations';

/**
 * Busca de forma segura una sesión en el historial para la fecha seleccionada.
 */
export function resolveHistorySession(workoutHistory, selectedDateKey) {
  if (!workoutHistory || workoutHistory.length === 0) return null;
  return workoutHistory.find(s => {
    if (!s) return false;
    if (s.date === selectedDateKey) return true;
    if (s.timestamp) {
      const d = new Date(s.timestamp);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (key === selectedDateKey) return true;
      }
    }
    if (s.id && s.id.includes(`_${selectedDateKey}`)) return true;
    return false;
  }) || null;
}

/**
 * Fusión profunda segura de ejercicios de historial y borrador temporal activo.
 */
export function mergeDraftAndHistoryExercises(histExercises, dateDraft) {
  if (histExercises && dateDraft && typeof dateDraft === 'object') {
    const merged = { ...histExercises };
    Object.keys(dateDraft).forEach(exId => {
      if (!merged[exId]) {
        merged[exId] = dateDraft[exId];
      } else if (typeof dateDraft[exId] === 'object' && dateDraft[exId] !== null) {
        merged[exId] = {
          ...merged[exId],
          ...dateDraft[exId]
        };
        Object.keys(dateDraft[exId]).forEach(setKey => {
          if (typeof dateDraft[exId][setKey] === 'object' && dateDraft[exId][setKey] !== null) {
            merged[exId][setKey] = {
              ...(merged[exId][setKey] || {}),
              ...dateDraft[exId][setKey]
            };
          }
        });
      }
    });
    return merged;
  }
  if (dateDraft && Object.keys(dateDraft).length > 0) {
    return dateDraft;
  }
  if (histExercises && Object.keys(histExercises).length > 0) {
    return histExercises;
  }
  return {};
}

/**
 * Cálculo cuantitativo del volumen acumulado y conteo de series.
 */
export function calculateSessionVolumeAndSets(todayWorkoutData, exercises) {
  let effectiveSetsCount = 0;
  let warmupSetsCount = 0;
  let cardioCount = 0;
  const allCompletedSets = [];

  Object.keys(todayWorkoutData || {}).forEach(exId => {
    const exLogs = todayWorkoutData[exId];
    if (exLogs) {
      if (exLogs.completed && (exLogs.cardioDone || exLogs.machine)) {
        cardioCount++;
      }

      const exDef = (exercises || []).find(e => e.id === exId);
      const isUnilateral = isExerciseUnilateral(exDef, exLogs);

      Object.keys(exLogs).forEach(key => {
        const num = parseInt(key, 10);
        if (!isNaN(num)) {
          const setObj = exLogs[key];
          if (setObj && setObj.completed) {
            if (num === 0) {
              warmupSetsCount++;
            } else {
              effectiveSetsCount++;
            }
            allCompletedSets.push({
              ...setObj,
              isUnilateral
            });
          }
        }
      });
    }
  });

  const totalVol = calculateVolume(allCompletedSets);
  return {
    volume: Math.round(totalVol),
    completedSets: effectiveSetsCount,
    warmupSets: warmupSetsCount,
    totalSetsCount: effectiveSetsCount + warmupSetsCount,
    cardioCompleted: cardioCount
  };
}

/**
 * Resuelve el peso corporal más reciente del usuario.
 */
export function resolveUserWeight(bodyMetrics, bodyComposition) {
  if (bodyMetrics && bodyMetrics.length > 0) {
    const w = parseFloat(bodyMetrics[bodyMetrics.length - 1]?.weight);
    if (!isNaN(w) && w > 0) return w;
  }
  const compW = parseFloat(bodyComposition?.weightKg);
  return (!isNaN(compW) && compW > 0) ? compW : 78.55;
}

/**
 * Encuentra el índice del primer ejercicio que aún no ha completado todas sus series.
 */
export function calculateFirstUncompletedIdx(exercises, todayWorkoutData) {
  const exList = exercises || [];
  for (let idx = 0; idx < exList.length; idx++) {
    const ex = exList[idx];
    const data = (todayWorkoutData || {})[ex.id];
    if (ex.isCardio) {
      if (!data?.completed) return idx;
    } else {
      const totalSets = parseInt(ex.sets, 10) || 3;
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
}
