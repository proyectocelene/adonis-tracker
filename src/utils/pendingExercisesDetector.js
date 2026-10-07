// DETECTOR Y RECUPERADOR DE EJERCICIOS PENDIENTES / INCOMPLETOS
// Adonis Tracker / Coach V2 (Clinical Hypertrophy & Volume Balance)
// Detecta si en la sesión anterior (ayer o última completada) quedaron ejercicios sin realizar
// y ofrece incorporarlos a la sesión de hoy o transferirlos para no perder volumen semanal.

/**
 * Busca ejercicios que no fueron completados en la sesión anterior más reciente.
 * @param {Object} params
 * @param {string} params.selectedDateKey - Fecha activa actual (YYYY-MM-DD).
 * @param {Array} params.activeDays - Días de la rutina activa.
 * @param {Array} params.workoutHistory - Historial de sesiones archivadas.
 * @param {Object} params.dismissedAlerts - Mapa de alertas descartadas { [dateKey]: true }.
 * @returns {Object|null}
 */
export function detectUnfinishedExercisesFromPreviousSession({
  selectedDateKey,
  activeDays = [],
  workoutHistory = [],
  dismissedAlerts = {}
}) {
  if (dismissedAlerts[selectedDateKey]) return null;
  if (!workoutHistory || workoutHistory.length === 0) return null;

  // 1. Encontrar la sesión completada más reciente anterior a selectedDateKey
  const sortedHistory = [...workoutHistory]
    .filter(s => s && s.date && s.date < selectedDateKey && !s.isRestDay && !s.isMissedDay && (s.completedSets > 0 || s.volume > 0 || s.isCompleted))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (sortedHistory.length === 0) return null;

  const previousSession = sortedHistory[0];
  const sourceDayId = previousSession.dayId;
  if (!sourceDayId) return null;

  // 2. Encontrar la plantilla de ese día en activeDays
  const sourceDay = activeDays.find(d => d.id === sourceDayId);
  if (!sourceDay || !Array.isArray(sourceDay.exercises) || sourceDay.exercises.length === 0) return null;

  // 3. Revisar cada ejercicio del día anterior
  const sessionExercisesData = previousSession.exercises || {};
  const pendingExercises = [];

  sourceDay.exercises.forEach(ex => {
    // Ignorar cardio de calentamiento/NEAT o abs recreativos
    if (ex.isCardio) return;

    const exLogs = sessionExercisesData[ex.id] || sessionExercisesData[ex.unifiedCode] || {};
    
    // Verificar si tuvo alguna serie completada
    let hasCompletedSet = false;
    if (typeof exLogs === 'object') {
      Object.entries(exLogs).forEach(([key, val]) => {
        if (key !== 'machineConfig' && key !== 'feedback' && val && val.completed) {
          hasCompletedSet = true;
        }
      });
    }

    if (!hasCompletedSet) {
      pendingExercises.push({
        ...ex,
        sourceDayId: sourceDay.id,
        sourceDayName: sourceDay.name,
        sourceSessionDate: previousSession.date
      });
    }
  });

  if (pendingExercises.length === 0) return null;

  return {
    hasUnfinished: true,
    sourceDate: previousSession.date,
    sourceDayName: sourceDay.name,
    sourceDayId: sourceDay.id,
    pendingExercises
  };
}
