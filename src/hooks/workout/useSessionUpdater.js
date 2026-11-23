import { useCallback } from 'react';

export function useSessionUpdater({
  historySession,
  currentSessions,
  selectedDateKey,
  saveSession,
  setCurrentSessions
}) {
  const updateSessionDataForCurrentDay = useCallback((updater) => {
    if (historySession) {
      const dateDraft = currentSessions?.[`draft_${selectedDateKey}`];
      const baseExercises = {
        ...(historySession.exercises || {}),
        ...(dateDraft || {})
      };
      if (dateDraft && historySession.exercises) {
        Object.keys(dateDraft).forEach(exId => {
          if (historySession.exercises[exId] && typeof dateDraft[exId] === 'object') {
            baseExercises[exId] = {
              ...historySession.exercises[exId],
              ...dateDraft[exId]
            };
          }
        });
      }

      const newExercises = updater(baseExercises);

      let recalculatedVol = 0;
      let recSets = 0;
      Object.values(newExercises).forEach(exLogs => {
        if (exLogs && typeof exLogs === 'object') {
          Object.keys(exLogs).forEach(k => {
            if (!isNaN(parseInt(k, 10))) {
              const s = exLogs[k];
              if (s && s.completed) {
                recSets++;
                if (s.repsL !== undefined || s.repsR !== undefined) {
                  const rL = parseFloat(s.repsL) || 0;
                  const rR = parseFloat(s.repsR) || 0;
                  let wL = parseFloat(s.weightL || s.weight) || 0;
                  let wR = parseFloat(s.weightR || s.weight) || 0;
                  if (s.unit === 'kg') {
                    wL *= 2.20462;
                    wR *= 2.20462;
                  }
                  recalculatedVol += (wL * rL) + (wR * rR);
                } else {
                  let w = parseFloat(s.weight) || 0;
                  if (s.unit === 'kg') w *= 2.20462;
                  const r = parseFloat(s.reps) || 0;
                  recalculatedVol += (w * r);
                }
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
        isCompleted: recSets > 0 || recalculatedVol > 0,
        lastModified: Date.now()
      };

      setCurrentSessions(prev => ({
        ...prev,
        [`draft_${selectedDateKey}`]: newExercises,
        [`lastModified_${selectedDateKey}`]: Date.now()
      }));

      saveSession(updated);
      return;
    }

    setCurrentSessions(prev => {
      const dayData = prev?.[`draft_${selectedDateKey}`] || {};
      const newDayData = updater(dayData);

      let startTime = prev?.[`startTime_${selectedDateKey}`];
      if (!startTime) {
        const hasCompletedSetOrCardio = Object.values(newDayData).some(ex => {
          if (!ex) return false;
          if (ex.completed && (ex.cardioDone || ex.machine)) return true;
          return Object.keys(ex).some(k => !isNaN(parseInt(k, 10)) && ex[k]?.completed);
        });
        if (hasCompletedSetOrCardio) {
          startTime = new Date().toISOString();
        }
      }

      return {
        ...prev,
        [`draft_${selectedDateKey}`]: newDayData,
        [`lastModified_${selectedDateKey}`]: Date.now(),
        ...(startTime ? { [`startTime_${selectedDateKey}`]: startTime } : {})
      };
    });
  }, [historySession, currentSessions, selectedDateKey, saveSession, setCurrentSessions]);

  const handleUpdateSet = (exerciseId, setNumber, setData) => {
    updateSessionDataForCurrentDay(dayData => {
      const exData = dayData[exerciseId] || {};
      const currentSet = exData[setNumber] || {};
      return {
        ...dayData,
        [exerciseId]: {
          ...exData,
          [setNumber]: {
            ...currentSet,
            ...setData
          }
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
    updateSessionDataForCurrentDay(dayData => ({
      ...dayData,
      [exerciseId]: cardioData
    }));
  };

  return {
    updateSessionDataForCurrentDay,
    handleUpdateSet,
    handleUpdateExerciseMeta,
    handleUpdateCardio
  };
}
