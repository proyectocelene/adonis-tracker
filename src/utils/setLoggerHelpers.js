import { roundToAttainableWeight } from '../hooks/useWorkoutCalculations';

export const EMPTY_OBJECT = Object.freeze({});
export const EMPTY_ARRAY = Object.freeze([]);

/**
 * Disparo seguro de vibración háptica con captura de excepciones limpia.
 * @param {number|number[]} pattern Duración en ms o patrón de pulsos
 */
export function safeVibrate(pattern) {
  if (typeof navigator !== 'undefined' && navigator?.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignorar silenciosamente si la plataforma no soporta o bloquea la vibración
    }
  }
}

/**
 * Determina si el ejercicio es estrictamente bilateral por diseño físico (barra, smith, prensa, etc.)
 * @param {object} exercise 
 * @returns {boolean}
 */
export function isStrictlyBilateralExercise(exercise) {
  const name = (exercise?.name || '').toLowerCase();
  return /barra|smith|prensa|leg press|squat con barra|bench press con barra|press militar con barra/i.test(name);
}

/**
 * Resuelve la tipología mecánica del aparato para la calculadora de discos/placas.
 * @param {string} name 
 * @param {object} machineConfig 
 * @returns {'prensa'|'hack'|'smith'|'mancuerna'|'polea'|'barra'}
 */
export function getApparatusType(name = '', machineConfig = null) {
  if (machineConfig?.type) {
    if (machineConfig.type === 'plates') return 'prensa';
    if (machineConfig.type === 'stack') return 'polea';
    if (machineConfig.type === 'dumbbells') return 'mancuerna';
  }
  const n = (name || '').toLowerCase();
  if (n.includes('prensa') || n.includes('leg press')) return 'prensa';
  if (n.includes('hack')) return 'hack';
  if (n.includes('smith')) return 'smith';
  if (n.includes('mancuerna') || n.includes('dumbbell')) return 'mancuerna';
  if (n.includes('polea') || n.includes('cable') || n.includes('jalon') || n.includes('jalón') || n.includes('extension') || n.includes('curl')) return 'polea';
  return 'barra';
}

/**
 * Analizador fisiológico de calentamiento según prescripción oficial
 * @param {object} exercise
 * @param {object} previousData
 * @param {object} exerciseData
 * @param {object} machineConfig
 * @param {object} coachAnalysis
 * @returns {{ requiresWarmup: boolean, workingWeightUsed?: number, series: Array<{ id: number, label: string, pct: string, defaultWeight: number, defaultReps: number, desc: string }> }}
 */
export function getWarmupPlan(exercise, previousData, exerciseData, machineConfig, coachAnalysis) {
  const warmupStr = (exercise?.warmup || '').toLowerCase();

  // 1. Determinar la carga de trabajo real (priorizando peso ingresado hoy, carga ancla o carga ajustada del coach)
  let workingWeight = parseFloat(exerciseData?.[1]?.weight || 0);

  if (!workingWeight || workingWeight <= 0) {
    if (coachAnalysis) {
      if (coachAnalysis.isExcessiveLoad && coachAnalysis.adjustedLoad > 0) {
        workingWeight = coachAnalysis.adjustedLoad;
      } else if (coachAnalysis.isS1RampUp && coachAnalysis.anchorWeight > 0) {
        workingWeight = coachAnalysis.anchorWeight;
      } else if (coachAnalysis.anchorWeight > 0) {
        workingWeight = coachAnalysis.anchorWeight;
      } else if (coachAnalysis.maxWeight > 0) {
        workingWeight = coachAnalysis.maxWeight;
      }
    }
  }

  // 2. Fallback a series previas si hoy está vacío
  if (!workingWeight || workingWeight <= 0) {
    const prevSets = Object.keys(previousData || {})
      .map(k => parseInt(k, 10))
      .filter(n => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);
    if (prevSets.length > 0) {
      workingWeight = parseFloat(previousData[prevSets[0]]?.weight || 0);
    }
  }

  if (warmupStr.includes('no ocupa')) {
    return { requiresWarmup: false, series: [] };
  }

  if (!workingWeight || workingWeight <= 0) {
    return { requiresWarmup: false, series: [] };
  }

  const hasSerie2 = warmupStr.includes('serie 2');
  if (hasSerie2) {
    const p1 = warmupStr.includes('40%') ? 0.40 : 0.50;
    const p2 = warmupStr.includes('70%') ? 0.70 : 0.75;
    const r1 = 10;
    const r2 = warmupStr.includes('3 reps') ? 3 : 4;

    const w1 = workingWeight > 0 ? roundToAttainableWeight(workingWeight * p1, machineConfig) : 0;
    const w2 = workingWeight > 0 ? roundToAttainableWeight(workingWeight * p2, machineConfig) : 0;

    return {
      requiresWarmup: true,
      workingWeightUsed: workingWeight,
      series: [
        { id: 0, label: 'C1', pct: `${Math.round(p1 * 100)}%`, defaultWeight: w1, defaultReps: r1, desc: 'Control articular y calibración' },
        { id: -1, label: 'C2', pct: `${Math.round(p2 * 100)}%`, defaultWeight: w2, defaultReps: r2, desc: 'Activación neural' }
      ]
    };
  }

  const p = warmupStr.includes('60%') ? 0.60 : 0.70;
  const r = warmupStr.includes('5 reps') ? 5 : (warmupStr.includes('6 reps') ? 6 : 4);
  const w = workingWeight > 0 ? roundToAttainableWeight(workingWeight * p, machineConfig) : 0;

  return {
    requiresWarmup: true,
    workingWeightUsed: workingWeight,
    series: [
      { id: 0, label: 'C1', pct: `${Math.round(p * 100)}%`, defaultWeight: w, defaultReps: r, desc: 'Aproximación' }
    ]
  };
}

/**
 * Calcula la insignia visual delta-aware al completar una serie.
 */
export function getSetCompletedBadge({
  isDone,
  isExtraSet,
  deltaWeight,
  deltaReps,
  isPr,
  weightNum,
  repsNum,
  prevRepsNum,
  rpeNum,
  current1RM
}) {
  if (!isDone) return null;

  if (isExtraSet) {
    return {
      text: '➕ Extra (+Vol)',
      color: 'var(--accent-blue)',
      border: 'var(--accent-blue)'
    };
  }
  if (deltaWeight > 0) {
    return {
      text: `${isPr ? '🏆 PR! ' : ''}🚀 +${deltaWeight}#`,
      color: 'var(--accent-emerald)',
      border: 'var(--accent-emerald)'
    };
  }
  if (deltaWeight === 0 && deltaReps > 0) {
    return {
      text: `${isPr ? '🏆 PR! ' : ''}⚡ +${deltaReps}r`,
      color: 'var(--accent-cyan)',
      border: 'var(--accent-cyan)'
    };
  }
  if (deltaWeight === 0 && deltaReps === 0) {
    return {
      text: `✓ ${weightNum}# Consolidado`,
      color: 'var(--accent-emerald)',
      border: 'var(--accent-emerald)'
    };
  }
  if (deltaWeight < 0) {
    return {
      text: `⚖️ Back-off (${deltaWeight}#)`,
      color: 'var(--accent-amber)',
      border: 'var(--accent-amber)'
    };
  }
  if (deltaReps < 0) {
    return {
      text: rpeNum >= 9.5 ? `⚠️ Fatiga (${repsNum} vs ${prevRepsNum}r)` : `✓ ${weightNum}# × ${repsNum}r`,
      color: 'var(--text-muted)',
      border: 'var(--border-strong)'
    };
  }
  return {
    text: current1RM > 0 ? `1RM: ${current1RM}#` : '✓ Listo',
    color: 'var(--accent-emerald)',
    border: 'var(--accent-emerald)'
  };
}

/**
 * Resuelve estilos semánticos de borde, color y fondo para el selector de RPE/RIR.
 * @param {string|number} rpeInput 
 * @returns {{ rpeBorder: string, rpeColor: string, rpeBg: string }}
 */
export function getRpeColorStyle(rpeInput) {
  const rpeVal = parseFloat(rpeInput || '8');
  if (rpeVal <= 8) {
    // RIR 2-4: Esmeralda
    return {
      rpeBorder: 'var(--accent-emerald)',
      rpeColor: 'var(--accent-emerald)',
      rpeBg: 'var(--accent-emerald-subtle)'
    };
  }
  if (rpeVal <= 9) {
    // RIR 1-1.5: Ámbar
    return {
      rpeBorder: 'var(--accent-amber)',
      rpeColor: 'var(--accent-amber)',
      rpeBg: 'var(--accent-amber-subtle)'
    };
  }
  // RIR 0 / Fallo: Rojo
  return {
    rpeBorder: 'var(--accent-red)',
    rpeColor: 'var(--accent-red)',
    rpeBg: 'var(--accent-red-subtle)'
  };
}
