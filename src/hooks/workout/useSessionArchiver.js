export function useSessionArchiver({
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
}) {
  const handleClearCurrentDraft = () => {
    modal.showConfirm({
      title: "🗑️ ¿Limpiar Registro de este Día?",
      message: "¿Deseas borrar las casillas marcadas de esta fecha y empezar en limpio? (Tu historial pasado seguirá intacto).",
      confirmText: "Sí, Limpiar a 0",
      cancelText: "Cancelar",
      variant: "warning",
      onConfirm: async () => {
        const weekKey = `week_${currentWeek}`;
        setCurrentSessions(prev => {
          const next = { ...(prev || {}) };
          delete next[`draft_${selectedDateKey}`];
          delete next[`startTime_${selectedDateKey}`];
          delete next[`${selectedDateKey}_${currentDay.id}`];
          delete next[currentDay.id];
          if (next[weekKey]) {
            const nextWeek = { ...next[weekKey] };
            delete nextWeek[currentDay.id];
            next[weekKey] = nextWeek;
          }
          return next;
        });

        const sessionId = historySession?.id || `ses_${selectedDateKey}_${currentDay.id}`;
        if (deleteSession) await deleteSession(sessionId);

        modal.showAlert({
          title: "🧹 Día Limpiado",
          message: "Los registros de este día han sido reiniciados a 0.",
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
        const weekKey = `week_${currentWeek}`;
        setCurrentSessions(prev => {
          const next = { ...(prev || {}) };
          delete next[`draft_${selectedDateKey}`];
          delete next[`${selectedDateKey}_${currentDay.id}`];
          if (next[weekKey]) {
            const nextWeek = { ...next[weekKey] };
            delete nextWeek[currentDay.id];
            next[weekKey] = nextWeek;
          }
          return next;
        });
        if (updateSessionDataForCurrentDay) {
          updateSessionDataForCurrentDay(() => ({}));
        }
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

        const weekKey = `week_${currentWeek}`;
        setCurrentSessions(prev => {
          const next = { ...(prev || {}) };
          delete next[`draft_${selectedDateKey}`];
          delete next[`${selectedDateKey}_${currentDay.id}`];
          if (next[weekKey]) {
            const nextWeek = { ...next[weekKey] };
            delete nextWeek[currentDay.id];
            next[weekKey] = nextWeek;
          }
          return next;
        });

        modal.showAlert({
          title: isRest ? "💤 Descanso Registrado" : "❌ Falta Registrada",
          message: `El registro para ${selectedDateKey} se guardó exitosamente en tu bitácora.`,
          variant: "info"
        });
      }
    });
  };

  const handleRollingShift = () => {
    modal.showConfirm({
      title: "🔄 Desplazar Sesión a Mañana",
      message: `Hoy se marcará como descanso regenerador. Tu entrenamiento (${baseDay.name}) se reprogramará como la prioridad para mañana.`,
      confirmText: "Confirmar Desplazamiento",
      variant: "info",
      onConfirm: async () => {
        await handleSaveSpecialDay('rest');
        modal.showAlert({
          title: "🔄 Sesión Desplazada",
          message: "El descanso de hoy ha sido registrado. Mañana retomas tu entrenamiento exactamente donde lo dejaste.",
          variant: "success"
        });
      }
    });
  };

  const handleSaveSundayLog = async (recoveryData) => {
    const sessionId = historySession?.id || `ses_${selectedDateKey}_d7`;
    const sessionDate = new Date(`${selectedDateKey}T12:00:00`);
    const sessionLog = {
      id: sessionId,
      weekNumber: currentWeek,
      weekName: `Semana ${currentWeek}`,
      date: selectedDateKey,
      timestamp: sessionDate.toISOString(),
      dateString: sessionDate.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      dayId: 'd7',
      dayName: 'Domingo: Descanso Activo / NEAT',
      focus: 'Descanso total del SNC & Termogénesis NEAT',
      volume: 0,
      completedSets: 0,
      cardioCompleted: 0,
      exercises: {},
      isCompleted: true,
      isRestDay: true,
      isMissedDay: false,
      neatSteps: recoveryData.neatSteps,
      sleepHours: recoveryData.sleepHours,
      energyLevel: recoveryData.energyLevel,
      recoveryNotes: recoveryData.recoveryNotes
    };
    await saveSession(sessionLog);
    modal.showAlert({
      title: "✅ Descanso Activo Guardado",
      message: `Registro de recuperación del Domingo archivado con éxito (${recoveryData.neatSteps.toLocaleString()} pasos NEAT • ${recoveryData.sleepHours} hrs de sueño).`,
      variant: "success"
    });
  };

  const handleFinishWorkout = () => {
    modal.showConfirm({
      title: `🏁 ¿Archivar Sesión en Bitácora?`,
      message: `Resumen de tu entrenamiento del ${selectedDateKey}:\n\n⏱️ Duración Real: ${liveElapsedMinutes > 0 ? `${liveElapsedMinutes} min` : 'Automática'}\n💪 Series completadas: ${completedSets}\n🔥 Volumen Total Levantado: ${volume.toLocaleString()} lbs-reps\n⚡ Gasto Calórico Estimado: ${todayCalories.totalKcal} kcal\n   (🏋️ ${todayCalories.strengthKcal} kcal fuerza + 🚴 ${todayCalories.cardioKcal} kcal cardio + ⚡ ${todayCalories.epocKcal} kcal EPOC)\n\n¿Archivar datos oficiales?`,
      confirmText: "💾 Sí, Archivar Ahora",
      cancelText: "Continuar Entrenando",
      variant: "success",
      onConfirm: async () => {
        const sessionId = historySession?.id || `ses_${selectedDateKey}_${currentDay.id}`;
        const sessionDate = new Date(`${selectedDateKey}T12:00:00`);
        const endTimeIso = new Date().toISOString();
        const startIso = sessionStartTime || new Date(Date.now() - Math.max(15, liveElapsedMinutes || 45) * 60000).toISOString();
        const finalDuration = liveElapsedMinutes > 0 ? liveElapsedMinutes : Math.max(15, Math.round((completedSets * 2.2) + (cardioCompleted * 35)));

        const exercisesWithConfigs = { ...todayWorkoutData };
        Object.keys(exercisesWithConfigs).forEach(exKey => {
          if (exercisesWithConfigs[exKey] && typeof exercisesWithConfigs[exKey] === 'object') {
            if (!exercisesWithConfigs[exKey].machineConfig) {
              const matchedConfig = globalMachineConfigs?.[exKey] || globalMachineConfigs?.[exercisesWithConfigs[exKey]?.name];
              if (matchedConfig) {
                exercisesWithConfigs[exKey] = {
                  ...exercisesWithConfigs[exKey],
                  machineConfig: matchedConfig
                };
              }
            }
          }
        });

        const sessionLog = {
          id: sessionId,
          weekNumber: currentWeek,
          weekName: `Semana ${currentWeek}`,
          date: selectedDateKey,
          timestamp: sessionDate.toISOString(),
          startTime: startIso,
          endTime: endTimeIso,
          durationMinutes: finalDuration,
          dateString: sessionDate.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
          dayId: currentDay.id,
          dayName: currentDay.name,
          focus: currentDay.focus,
          volume,
          completedSets,
          cardioCompleted,
          calories: todayCalories,
          exercises: exercisesWithConfigs,
          skippedExercises: skippedExercisesMap?.[baseDay.id] || {},
          userWeightKg: userWeightKg || (bodyMetrics?.length > 0 ? bodyMetrics[bodyMetrics.length - 1]?.weightKg : null),
          bodyComposition: bodyComposition || null,
          isCompleted: true,
          isRestDay: false,
          isMissedDay: false,
          isDeloadSession: Boolean(isDeloadMode)
        };

        await saveSession(sessionLog);

        const weekKey = `week_${currentWeek}`;
        setCurrentSessions(prev => {
          const next = { ...(prev || {}) };
          delete next[`draft_${selectedDateKey}`];
          delete next[`startTime_${selectedDateKey}`];
          delete next[`${selectedDateKey}_${currentDay.id}`];
          if (next[weekKey]) {
            const nextWeek = { ...next[weekKey] };
            delete nextWeek[currentDay.id];
            next[weekKey] = nextWeek;
          }
          return next;
        });

        modal.showAlert({
          title: "🎉 ¡Entrenamiento Archivado!",
          message: `Sesión de ${selectedDateKey} (${currentDay.name}) guardada con éxito (${volume.toLocaleString()} lbs-reps • ${finalDuration} min • ${todayCalories.totalKcal} kcal quemadas).`,
          variant: "success"
        });
      }
    });
  };

  return {
    handleClearCurrentDraft,
    handleResetCurrent,
    handleSaveSpecialDay,
    handleRollingShift,
    handleSaveSundayLog,
    handleFinishWorkout
  };
}
