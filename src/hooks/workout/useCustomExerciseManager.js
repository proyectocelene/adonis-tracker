import { useState, useEffect } from 'react';
import { UNIFIED_EXERCISE_LIBRARY } from '../../data/unifiedExerciseLibrary';

export function useCustomExerciseManager({
  baseDay,
  activeDays,
  currentDayExercises,
  updateSessionDataForCurrentDay,
  setCustomExercisesMap,
  setExerciseOrderMap,
  modal
}) {
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExScope, setNewExScope] = useState('today'); // 'today' | 'permanent'
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('3');
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExRest, setNewExRest] = useState('90 s');
  const [newExBiomech, setNewExBiomech] = useState('');
  const [newExMuscleGroup, setNewExMuscleGroup] = useState('General');
  const [newExTargetDay, setNewExTargetDay] = useState(baseDay?.id);

  useEffect(() => {
    if (baseDay?.id) {
      setNewExTargetDay(baseDay.id);
    }
  }, [baseDay?.id]);

  const handlePickFromLibrary = (libId) => {
    if (!libId) return;
    const item = UNIFIED_EXERCISE_LIBRARY.find(x => x.id === libId);
    if (item) {
      setNewExName(item.name);
      setNewExMuscleGroup(item.muscleGroup || 'General');
      setNewExSets(String(item.defaultSets || 4));
      setNewExReps(item.defaultReps || '10-12');
      setNewExRest(item.defaultRest || '90 s');
      setNewExBiomech(item.biomechanics || '');
    }
  };

  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const setsCount = parseInt(newExSets, 10) || 3;
    const repsStr = newExReps.trim() || '10-12';
    const restStr = newExRest.trim() || '90 s';
    const biomechStr = newExBiomech.trim() || 'Control de técnica e IAP.';
    const muscleGroupStr = newExMuscleGroup || 'General';
    const cleanName = newExName.trim();

    if (newExScope === 'today') {
      const newExId = `temp_today_${Date.now()}`;
      updateSessionDataForCurrentDay(dayData => {
        const initialSets = {};
        for (let s = 1; s <= setsCount; s++) {
          initialSets[s] = { weight: '', reps: repsStr.split('-')[0] || '10', rpe: '8', completed: false, unit: 'lbs' };
        }
        return {
          ...dayData,
          [newExId]: {
            name: cleanName,
            muscleGroup: muscleGroupStr,
            customSetsCount: setsCount,
            reps: repsStr,
            restTime: restStr,
            biomechanics: biomechStr,
            isTemporaryToday: true,
            isCustom: true,
            ...initialSets
          }
        };
      });

      // Asegurar que el ejercicio temporal quede en el orden del día
      setExerciseOrderMap(prev => {
        const curOrder = prev?.[baseDay.id] || (currentDayExercises || []).map(x => x.id);
        if (!curOrder.includes(newExId)) {
          return { ...prev, [baseDay.id]: [...curOrder, newExId] };
        }
        return prev;
      });

      setNewExName('');
      setIsAddingExercise(false);
      if (modal?.showAlert) {
        modal.showAlert({
          title: "📌 Ejercicio Añadido a Hoy",
          message: `"${cleanName}" fue agregado exclusivamente a la sesión de hoy.`,
          variant: "success"
        });
      }
    } else {
      const targetDayId = newExTargetDay || baseDay.id;
      const targetDayObj = (activeDays || []).find(d => d.id === targetDayId) || baseDay;
      const newExId = `custom_${Date.now()}`;
      const newEx = {
        id: newExId,
        name: cleanName,
        muscleGroup: muscleGroupStr,
        sets: setsCount,
        reps: repsStr,
        restTime: restStr,
        biomechanics: biomechStr,
        isCustom: true
      };

      setCustomExercisesMap(prev => {
        const dayCustoms = (prev && prev[targetDayId]) ? prev[targetDayId] : [];
        return {
          ...prev,
          [targetDayId]: [...dayCustoms, newEx]
        };
      });

      // Si el día objetivo es el día que estamos viendo actualmente, inicializar sets en el borrador de hoy
      if (targetDayId === baseDay.id) {
        updateSessionDataForCurrentDay(dayData => {
          const initialSets = {};
          for (let s = 1; s <= setsCount; s++) {
            initialSets[s] = { weight: '', reps: repsStr.split('-')[0] || '10', rpe: '8', completed: false, unit: 'lbs' };
          }
          return {
            ...dayData,
            [newExId]: {
              name: cleanName,
              muscleGroup: muscleGroupStr,
              customSetsCount: setsCount,
              reps: repsStr,
              restTime: restStr,
              biomechanics: biomechStr,
              isCustom: true,
              ...initialSets
            }
          };
        });
      }

      // Asegurar orden persistente
      setExerciseOrderMap(prev => {
        const curOrder = prev?.[targetDayId] || (targetDayObj.exercises || []).map(x => x.id);
        if (!curOrder.includes(newExId)) {
          return { ...prev, [targetDayId]: [...curOrder, newExId] };
        }
        return prev;
      });

      setNewExName('');
      setIsAddingExercise(false);
      if (modal?.showAlert) {
        modal.showAlert({
          title: "🔄 Ejercicio Guardado en Rutina",
          message: `"${newEx.name}" fue agregado a la rutina fija de ${targetDayObj.name}.`,
          variant: "success"
        });
      }
    }
  };

  const handleDeleteCustomExercise = (exerciseId) => {
    modal.showConfirm({
      title: "🗑️ ¿Eliminar Ejercicio?",
      message: "¿Deseas eliminar este ejercicio de tu rutina / sesión?",
      confirmText: "Sí, Eliminar",
      cancelText: "Cancelar",
      variant: "danger",
      onConfirm: () => {
        // 1. Eliminar de customExercisesMap
        setCustomExercisesMap(prev => {
          if (!prev) return prev;
          const next = { ...prev };
          Object.keys(next).forEach(dId => {
            if (Array.isArray(next[dId])) {
              next[dId] = next[dId].filter(e => e.id !== exerciseId);
            }
          });
          return next;
        });

        // 2. Eliminar del borrador actual
        updateSessionDataForCurrentDay(dayData => {
          const next = { ...dayData };
          delete next[exerciseId];
          return next;
        });

        // 3. Eliminar de exerciseOrderMap
        setExerciseOrderMap(prev => {
          if (!prev) return prev;
          const next = { ...prev };
          Object.keys(next).forEach(dId => {
            if (Array.isArray(next[dId])) {
              next[dId] = next[dId].filter(id => id !== exerciseId);
            }
          });
          return next;
        });

        modal.showAlert({
          title: "🗑️ Ejercicio Eliminado",
          message: "El ejercicio ha sido retirado.",
          variant: "success"
        });
      }
    });
  };

  return {
    isAddingExercise,
    setIsAddingExercise,
    newExScope,
    setNewExScope,
    newExName,
    setNewExName,
    newExSets,
    setNewExSets,
    newExReps,
    setNewExReps,
    newExRest,
    setNewExRest,
    newExBiomech,
    setNewExBiomech,
    newExMuscleGroup,
    setNewExMuscleGroup,
    newExTargetDay,
    setNewExTargetDay,
    handlePickFromLibrary,
    handleAddCustomExercise,
    handleDeleteCustomExercise
  };
}
