import {
  getPreviousDataForExercise
} from '../exerciseMatcher.js';
import {
  getActiveMachineConfig
} from '../machineManager.js';
import {
  calculate1RM,
  isEpleyReliable,
  extractCleanWorkingSets,
  getUnifiedExerciseTarget,
  roundToAttainableWeight
} from '../../hooks/useWorkoutCalculations.js';

function round1(val) {
  return Math.round((Number(val) || 0) * 10) / 10;
}

function getCleanSetsFromPoint(point) {
  if (!point) return [];
  const raw = Array.isArray(point.detailedSets) && point.detailedSets.length > 0
    ? point.detailedSets
    : (Array.isArray(point.workingSets) ? point.workingSets : []);

  const clean = raw
    .filter(s => !s.isWarmup && (s.setNum === undefined || Number(s.setNum) > 0) && (parseFloat(s.weight) || 0) > 0 && (parseFloat(s.reps) || 0) > 0)
    .map(s => ({
      weight: parseFloat(s.weight),
      reps: parseFloat(s.reps)
    }));

  if (clean.length > 0) return clean;

  const fallbackW = parseFloat(point.weight) || 0;
  const fallbackR = parseFloat(point.reps) || 0;
  if (fallbackW > 0 && fallbackR > 0) {
    return [{ weight: fallbackW, reps: fallbackR }];
  }
  return [];
}

/**
 * Calcula estadísticas claras del periodo visible sobre puntos reales de la gráfica.
 */
export function computeExercisePeriodStats(realPoints = []) {
  const validPoints = (Array.isArray(realPoints) ? realPoints : [])
    .filter(p => p && !p.isProjected && (parseFloat(p.weight) || 0) > 0);

  if (validPoints.length === 0) {
    return {
      sessionsCount: 0,
      weight: { max: 0, avg: 0, min: 0 },
      reps: { max: 0, avg: 0, min: 0 },
      bestE1RM: null,
      trend: { status: 'consolidating', weightDelta: 0, e1rmDelta: 0 }
    };
  }

  const allWeights = [];
  const allReps = [];
  let bestE1RM = null;

  const sessionSummaries = validPoints.map(p => {
    const sets = getCleanSetsFromPoint(p);
    let topW = parseFloat(p.weight) || 0;
    let totalReps = 0;
    let sessionBest1RM = null;

    if (sets.length > 0) {
      topW = Math.max(...sets.map(s => s.weight));
      for (const s of sets) {
        allWeights.push(s.weight);
        allReps.push(s.reps);
        totalReps += s.reps;
        if (isEpleyReliable(s.reps)) {
          const e1rm = calculate1RM(s.weight, s.reps);
          if (e1rm > 0) {
            if (sessionBest1RM === null || e1rm > sessionBest1RM) sessionBest1RM = e1rm;
            if (bestE1RM === null || e1rm > bestE1RM) bestE1RM = e1rm;
          }
        }
      }
    } else {
      allWeights.push(topW);
      const r = parseFloat(p.reps) || 0;
      if (r > 0) {
        allReps.push(r);
        totalReps = r;
        if (isEpleyReliable(r)) {
          const e1rm = calculate1RM(topW, r);
          if (e1rm > 0) {
            sessionBest1RM = e1rm;
            if (bestE1RM === null || e1rm > bestE1RM) bestE1RM = e1rm;
          }
        }
      }
    }

    return { topW, totalReps, sessionBest1RM };
  });

  const weightMax = allWeights.length > 0 ? Math.max(...allWeights) : 0;
  const weightMin = allWeights.length > 0 ? Math.min(...allWeights) : 0;
  const weightAvg = allWeights.length > 0
    ? round1(allWeights.reduce((acc, v) => acc + v, 0) / allWeights.length)
    : 0;

  const repsMax = allReps.length > 0 ? Math.max(...allReps) : 0;
  const repsMin = allReps.length > 0 ? Math.min(...allReps) : 0;
  const repsAvg = allReps.length > 0
    ? round1(allReps.reduce((acc, v) => acc + v, 0) / allReps.length)
    : 0;

  const first = sessionSummaries[0];
  const last = sessionSummaries[sessionSummaries.length - 1];
  const weightDelta = round1(last.topW - first.topW);
  const e1rmDelta = (last.sessionBest1RM !== null && first.sessionBest1RM !== null)
    ? round1(last.sessionBest1RM - first.sessionBest1RM)
    : 0;

  let stagnantStreak = 0;
  for (let i = sessionSummaries.length - 1; i >= 1; i--) {
    const curr = sessionSummaries[i];
    const prev = sessionSummaries[i - 1];
    if (curr.topW <= prev.topW && curr.totalReps <= prev.totalReps) {
      stagnantStreak++;
    } else {
      break;
    }
  }

  let status = 'consolidating';
  if (sessionSummaries.length >= 3 && stagnantStreak >= 2) {
    status = 'stagnant';
  } else if (e1rmDelta > 0 || weightDelta > 0) {
    status = 'progressing';
  }

  return {
    sessionsCount: validPoints.length,
    weight: { max: weightMax, avg: weightAvg, min: weightMin },
    reps: { max: repsMax, avg: repsAvg, min: repsMin },
    bestE1RM,
    trend: { status, weightDelta, e1rmDelta }
  };
}

function formatWorkingSetsSummary(sets = []) {
  if (!Array.isArray(sets) || sets.length === 0) return '';
  const allSameWeight = sets.every(s => s.weight === sets[0].weight);
  if (allSameWeight) {
    return `${sets[0].weight}×${sets.map(s => s.reps).join(', ')}`;
  }
  return sets.map(s => `${s.weight}×${s.reps}`).join(', ');
}

function normalizePerSetCount(perSetTargets = [], desiredCount = 3) {
  if (!Array.isArray(perSetTargets) || perSetTargets.length === 0) return [];
  const count = Math.max(1, desiredCount);
  if (perSetTargets.length === count) return perSetTargets;
  if (perSetTargets.length > count) return perSetTargets.slice(0, count);
  const out = [...perSetTargets];
  const last = perSetTargets[perSetTargets.length - 1];
  while (out.length < count) {
    out.push({ setNum: out.length + 1, weight: last.weight, reps: last.reps });
  }
  return out;
}

/**
 * Construye los datos de la tarjeta protagonista "Próxima Sesión" usando la misma fuente de verdad que SetLogger.
 */
export function buildNextSessionCardData({
  exercise,
  workoutHistory = [],
  machineConfig = null,
  isDeloadMode = false,
  referenceDate
} = {}) {
  if (!exercise) {
    return {
      hasData: false,
      lastSessionDate: null,
      lastWorkingSetsSummary: '',
      perSetTargets: [],
      strategyType: 'initial',
      badgeText: '🎯 Inicial',
      headline: 'Calibración Inicial',
      formulaLabel: 'Calibración Inicial',
      reason: 'Registra tu primera sesión en rango objetivo (RPE 8).',
      machineConfig: null
    };
  }

  const previousData = getPreviousDataForExercise(exercise, null, null, workoutHistory);
  const resolvedConfig = machineConfig || getActiveMachineConfig([], {}, previousData, exercise);
  const targetRepsStr = exercise?.reps || exercise?.targetReps || '10-12';
  const targetSetsCount = Math.max(1, parseInt(exercise?.sets, 10) || 3);

  const target = getUnifiedExerciseTarget(previousData, targetRepsStr, resolvedConfig, {
    referenceDate,
    exercise
  });

  const cleanSets = extractCleanWorkingSets(previousData);
  const lastWorkingSetsSummary = formatWorkingSetsSummary(cleanSets);
  const lastSessionDate = previousData?.date || null;

  let perSetTargets = normalizePerSetCount(target.perSetTargets || [], targetSetsCount);
  let strategyType = target.strategyType || 'initial';
  let badgeText = target.badgeText || '🎯 Inicial';
  let headline = target.headline || `Sesión Inicial (${targetRepsStr})`;
  let reason = target.note || '';
  let formulaLabel = 'Calibración Inicial';

  if (isDeloadMode && target.hasData) {
    formulaLabel = 'Modo Deload (80%)';
    strategyType = 'deload';
    badgeText = '🧘 Deload';
    perSetTargets = perSetTargets.map(s => ({
      ...s,
      weight: roundToAttainableWeight(s.weight * 0.8, resolvedConfig)
    }));
    const deloadW = perSetTargets[0]?.weight || roundToAttainableWeight((target.targetWeight || 0) * 0.8, resolvedConfig);
    headline = `Deload: ${deloadW} lbs × ${target.minReps}-${target.maxReps} reps`;
    reason = 'Semana de descarga al 80% de carga para disipar fatiga sistémica.';
  } else if (!target.hasData) {
    formulaLabel = 'Calibración Inicial';
    badgeText = '🎯 Inicial';
    headline = `Calibración inicial · ${targetRepsStr} reps`;
    reason = `Sin sesiones previas en esta máquina. Busca peso para ${targetRepsStr} reps a RPE 8.`;
  } else if (target.strategyType === 'reactivation') {
    formulaLabel = 'Reactivación (>21 días sin registro)';
    badgeText = '🔄 Reactivación';
  } else if (target.progressionMode === 'dynamic') {
    const step = target.increment || resolvedConfig?.plateStep || resolvedConfig?.dumbbellStep || 5;
    formulaLabel = `Doble Progresión Dinámica por serie · paso ±${step} lbs (≥8%)`;
  } else {
    const step = target.increment || resolvedConfig?.plateStep || resolvedConfig?.dumbbellStep || 5;
    formulaLabel = `Doble Progresión Clásica · paso ±${step} lbs (<8%)`;
  }

  return {
    hasData: Boolean(target.hasData),
    lastSessionDate,
    lastWorkingSetsSummary,
    perSetTargets,
    strategyType,
    badgeText,
    headline,
    formulaLabel,
    reason,
    machineConfig: resolvedConfig
  };
}
