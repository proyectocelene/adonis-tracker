// DETECTOR Y RECUPERADOR DE EJERCICIOS PENDIENTES / INCOMPLETOS
// Adonis Tracker / Coach V2 (Clinical Hypertrophy & Volume Balance)
// Detecta si en la semana actual o sesión previa quedaron ejercicios sin realizar o días perdidos
// y ofrece incorporarlos hoy o distribuirlos inteligentemente en el resto de la semana.

/**
 * Busca ejercicios que no fueron completados o sesiones que se faltaron en la semana activa.
 * @param {Object} params
 * @param {string} params.selectedDateKey - Fecha activa actual (YYYY-MM-DD).
 * @param {Array} params.activeDays - Días de la rutina activa.
 * @param {Array} params.workoutHistory - Historial de sesiones archivadas.
 * @param {Object} params.dismissedAlerts - Mapa de alertas descartadas { [dateKey]: true }.
 * @param {Object} params.customExercisesMap - Mapa de ejercicios personalizados/redistribuidos existentes.
 * @returns {Object|null}
 */
export function detectUnfinishedExercisesFromPreviousSession({
  selectedDateKey,
  activeDays = [],
  workoutHistory = [],
  dismissedAlerts = {},
  customExercisesMap = {}
}) {
  if (!selectedDateKey || dismissedAlerts[selectedDateKey]) return null;
  if (!workoutHistory || !Array.isArray(workoutHistory) || activeDays.length === 0) return null;

  const currDate = new Date(`${selectedDateKey}T12:00:00`);
  if (isNaN(currDate.getTime())) return null;

  // 1. Calcular Lunes de la semana de la fecha activa
  const dayOfWeek = currDate.getDay(); // 0 = Domingo, 1 = Lunes...
  const daysSinceMonday = (dayOfWeek + 6) % 7; // Lunes=0, Mar=1, Mié=2, Jue=3, Vie=4, Sáb=5, Dom=6
  const mondayDate = new Date(currDate);
  mondayDate.setDate(currDate.getDate() - daysSinceMonday);
  const mondayStr = `${mondayDate.getFullYear()}-${String(mondayDate.getMonth() + 1).padStart(2, '0')}-${String(mondayDate.getDate()).padStart(2, '0')}`;

  // 2. Revisar ejercicios ya programados o incorporados en customExercisesMap para no duplicar
  const alreadyScheduledCodes = new Set();
  const alreadyScheduledNames = new Set();
  if (customExercisesMap && typeof customExercisesMap === 'object') {
    Object.values(customExercisesMap).forEach(list => {
      if (Array.isArray(list)) {
        list.forEach(item => {
          if (item?.unifiedCode) alreadyScheduledCodes.add(item.unifiedCode);
          if (item?.name) alreadyScheduledNames.add(item.name.toLowerCase().trim());
        });
      }
    });
  }

  // Helper para saber si un ejercicio ya se completó en alguna sesión válida de esta semana
  const isCompletedThisWeek = (ex) => {
    return workoutHistory.some(s => {
      if (!s || !s.date || s.date < mondayStr || s.isRestDay || s.isMissedDay) return false;
      const exLogs = s.exercises?.[ex.id] || (ex.unifiedCode ? s.exercises?.[ex.unifiedCode] : null);
      if (!exLogs || typeof exLogs !== 'object') return false;
      return Object.entries(exLogs).some(([k, v]) => k !== 'machineConfig' && k !== 'feedback' && v?.completed);
    });
  };

  const pendingExercises = [];
  const missedDayNames = [];
  let primarySourceDate = '';
  let primarySourceDayName = '';
  let primarySourceDayId = '';
  let hasFullMissedDay = false;

  // 3. Revisar los días de la semana actual anteriores a la fecha seleccionada
  for (let i = 0; i < daysSinceMonday; i++) {
    const loopDate = new Date(mondayDate);
    loopDate.setDate(mondayDate.getDate() + i);
    const loopDateKey = `${loopDate.getFullYear()}-${String(loopDate.getMonth() + 1).padStart(2, '0')}-${String(loopDate.getDate()).padStart(2, '0')}`;
    const plannedDayId = `d${i + 1}`;
    const plannedDay = activeDays.find(d => d.id === plannedDayId) || activeDays[i];

    // Buscar sesión registrada en esa fecha
    const session = workoutHistory.find(s => s && (s.date === loopDateKey || (s.timestamp && s.timestamp.startsWith(loopDateKey))));

    const isExplicitMissed = Boolean(session && (session.isMissedDay || session.isMissed));
    const isZeroSetsMissed = Boolean(session && !session.isRestDay && (!session.completedSets || session.completedSets === 0) && (!session.volume || session.volume === 0) && !session.isCompleted);

    // CASO A: Día explícitamente faltado o marcado con 0 series
    if (isExplicitMissed || isZeroSetsMissed) {
      if (!plannedDay || !Array.isArray(plannedDay.exercises) || plannedDay.type === 'rest') continue;

      hasFullMissedDay = true;
      if (!primarySourceDate) primarySourceDate = loopDateKey;
      if (!primarySourceDayName) primarySourceDayName = plannedDay.name;
      if (!primarySourceDayId) primarySourceDayId = plannedDay.id;
      if (!missedDayNames.includes(plannedDay.name.split(':')[0])) {
        missedDayNames.push(plannedDay.name.split(':')[0]);
      }

      plannedDay.exercises.forEach(ex => {
        if (ex.isCardio || ex.machineType === 'rower') return;
        if (alreadyScheduledCodes.has(ex.unifiedCode) || alreadyScheduledNames.has(ex.name?.toLowerCase().trim())) return;
        if (isCompletedThisWeek(ex)) return;

        // Evitar duplicados en el acumulador de pendientes
        if (!pendingExercises.some(p => (p.unifiedCode && p.unifiedCode === ex.unifiedCode) || p.name === ex.name)) {
          pendingExercises.push({
            ...ex,
            sourceDayId: plannedDay.id,
            sourceDayName: plannedDay.name,
            sourceSessionDate: loopDateKey,
            fromMissedDay: true
          });
        }
      });
      continue;
    }

    // CASO B: Sesión parcialmente entrenada pero con ejercicios omitidos
    if (session && !session.isRestDay && !session.isMissedDay && (session.completedSets > 0 || session.volume > 0)) {
      const sourceDay = activeDays.find(d => d.id === (session.dayId || plannedDayId)) || plannedDay;
      if (!sourceDay || !Array.isArray(sourceDay.exercises)) continue;

      const sessionExercisesData = session.exercises || {};

      sourceDay.exercises.forEach(ex => {
        if (ex.isCardio || ex.machineType === 'rower') return;
        if (alreadyScheduledCodes.has(ex.unifiedCode) || alreadyScheduledNames.has(ex.name?.toLowerCase().trim())) return;
        if (isCompletedThisWeek(ex)) return;

        const exLogs = sessionExercisesData[ex.id] || (ex.unifiedCode ? sessionExercisesData[ex.unifiedCode] : null) || {};
        let hasCompletedSet = false;
        if (typeof exLogs === 'object') {
          Object.entries(exLogs).forEach(([key, val]) => {
            if (key !== 'machineConfig' && key !== 'feedback' && val?.completed) {
              hasCompletedSet = true;
            }
          });
        }

        if (!hasCompletedSet && !pendingExercises.some(p => (p.unifiedCode && p.unifiedCode === ex.unifiedCode) || p.name === ex.name)) {
          if (!primarySourceDate) primarySourceDate = session.date || loopDateKey;
          if (!primarySourceDayName) primarySourceDayName = sourceDay.name;
          if (!primarySourceDayId) primarySourceDayId = sourceDay.id;

          pendingExercises.push({
            ...ex,
            sourceDayId: sourceDay.id,
            sourceDayName: sourceDay.name,
            sourceSessionDate: session.date || loopDateKey,
            fromMissedDay: false
          });
        }
      });
    }
  }

  // 4. Fallback: si no hubo faltas en la semana actual pero venimos de la última sesión completada con pendientes
  if (pendingExercises.length === 0) {
    const sortedHistory = [...workoutHistory]
      .filter(s => s && s.date && s.date < selectedDateKey && !s.isRestDay && (s.completedSets > 0 || s.volume > 0 || s.isCompleted || s.isMissedDay))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    if (sortedHistory.length > 0) {
      const prevSession = sortedHistory[0];
      const prevDate = new Date(`${prevSession.date}T12:00:00`);
      const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

      // Solo si ocurrió en los últimos 7 días
      if (daysDiff <= 7 && prevSession.dayId) {
        const sourceDay = activeDays.find(d => d.id === prevSession.dayId);
        if (sourceDay && Array.isArray(sourceDay.exercises)) {
          const sessionExercisesData = prevSession.exercises || {};
          sourceDay.exercises.forEach(ex => {
            if (ex.isCardio || ex.machineType === 'rower') return;
            if (alreadyScheduledCodes.has(ex.unifiedCode) || alreadyScheduledNames.has(ex.name?.toLowerCase().trim())) return;
            if (isCompletedThisWeek(ex)) return;

            const exLogs = sessionExercisesData[ex.id] || (ex.unifiedCode ? sessionExercisesData[ex.unifiedCode] : null) || {};
            let hasCompletedSet = false;
            if (typeof exLogs === 'object') {
              Object.entries(exLogs).forEach(([key, val]) => {
                if (key !== 'machineConfig' && key !== 'feedback' && val?.completed) {
                  hasCompletedSet = true;
                }
              });
            }

            if (!hasCompletedSet && !pendingExercises.some(p => (p.unifiedCode && p.unifiedCode === ex.unifiedCode) || p.name === ex.name)) {
              if (!primarySourceDate) primarySourceDate = prevSession.date;
              if (!primarySourceDayName) primarySourceDayName = sourceDay.name;
              if (!primarySourceDayId) primarySourceDayId = sourceDay.id;

              pendingExercises.push({
                ...ex,
                sourceDayId: sourceDay.id,
                sourceDayName: sourceDay.name,
                sourceSessionDate: prevSession.date,
                fromMissedDay: Boolean(prevSession.isMissedDay)
              });
            }
          });
        }
      }
    }
  }

  if (pendingExercises.length === 0) return null;

  return {
    hasUnfinished: true,
    isFullDayMissed: hasFullMissedDay,
    sourceDate: primarySourceDate,
    sourceDayName: primarySourceDayName || 'Sesión Previa',
    sourceDayId: primarySourceDayId,
    missedDayNames,
    pendingExercises
  };
}
