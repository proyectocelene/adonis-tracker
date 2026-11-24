import { resolveEffectiveMachineConfig } from '../utils/machineManager.js';

/**
 * Garantiza invariante estricto en perSetTargets:
 * 1) S1.weight >= S2.weight >= ...
 * 2) Si target[i].weight === target[i-1].weight, entonces target[i].reps <= target[i-1].reps.
 */
function enforceMonotonicPerSetTargets(targets = []) {
  for (let i = 1; i < targets.length; i++) {
    if (targets[i].weight > targets[i - 1].weight) {
      targets[i].weight = targets[i - 1].weight;
    }
    if (targets[i].weight === targets[i - 1].weight && targets[i].reps > targets[i - 1].reps) {
      targets[i].reps = targets[i - 1].reps;
    }
  }
  return targets;
}

/**
 * Calcula el 1RM estimado usando la fórmula de Epley: W * (1 + r / 30)
 * @param {number} weight - Peso levantado
 * @param {number} reps - Repeticiones realizadas
 * @returns {number} 1RM estimado redondeado
 */
export function calculate1RM(weight, reps) {
  const w = parseFloat(weight) || 0;
  const r = parseFloat(reps) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return Math.round(w);
  return Math.round(w * (1 + r / 30));
}

/**
 * Indica si el rango de repeticiones es confiable para la ecuación de Epley (reps <= 15).
 * @param {number|string} reps
 * @returns {boolean}
 */
export function isEpleyReliable(reps) {
  const r = parseFloat(reps) || 0;
  return r > 0 && r <= 15;
}

/**
 * Calcula el 1RM estimado junto con la bandera de confiabilidad de Epley (reps <= 15).
 * @param {number|string} weight
 * @param {number|string} reps
 * @returns {{ est1RM: number, isEpleyReliable: boolean }}
 */
export function calculate1RMWithMeta(weight, reps) {
  return {
    est1RM: calculate1RM(weight, reps),
    isEpleyReliable: isEpleyReliable(reps)
  };
}

/**
 * Motor Biomecánico Inteligente para Clasificación de Unilateral vs Bilateral.
 * Analiza la naturaleza del ejercicio para evitar que ejercicios bilaterales
 * (como Lateral Raises en máquina, press banca, jalón, poleas simultáneas, etc.)
 * se muestren erróneamente con formato de extremidades independientes ("I:15 D:15").
 *
 * @param {Object} exercise - Definición del ejercicio
 * @param {Object} exerciseLogs - Registro actual de la sesión (para respetar toggles del usuario)
 * @returns {boolean} true si es estrictamente unilateral por lado, false si es bilateral
 */
export function isExerciseUnilateral(exercise, exerciseLogs = {}) {
  if (!exercise) return false;

  // 1. Decisión explícita del usuario en el toggle de la tarjeta actual
  if (exerciseLogs && typeof exerciseLogs.isUnilateral === 'boolean') {
    return exerciseLogs.isUnilateral;
  }

  // 2. Definición explícita en la biblioteca o protocolo
  if (exercise.isUnilateral !== undefined) {
    return !!exercise.isUnilateral;
  }

  const name = (exercise.name || exercise.exerciseName || exercise.canonicalName || '').toLowerCase();
  const notes = (exercise.biomechanics || exercise.notes || '').toLowerCase();

  // 3. Patrones semánticos que SIEMPRE denotan ejecución UNILATERAL por extremidad:
  const unilateralRegex = /\b(unilateral|unilaterales)\b|a un brazo|a una pierna|a una mano|un solo brazo|una sola pierna|single[ -]arm|single[ -]leg|one[ -]arm|one[ -]leg|tras espalda|bayesian|b[uú]lgara|bulgarian|step[ -]?up|patada de gl[uú]teo|kickback en polea|curl concentrado/i;
  
  if (unilateralRegex.test(name) || unilateralRegex.test(notes)) {
    return true;
  }

  // 4. Ejercicios estrictamente bilaterales de musculación (prensas, presses de pecho, barras, sentadillas)
  const strictlyBilateralRegex = /\b(chest press|press de pecho|press banca|bench press|incline press|press inclinado|press militar|militar|overhead press|squat|sentadilla|prensa|leg press|hack|pulldown|jal[oó]n|chin[ -]?up|pull[ -]?up|remo con barra|tbar|t-bar|peso muerto|deadlift)\b/i;
  if (strictlyBilateralRegex.test(name)) {
    return false;
  }

  // 5. Por defecto en musculación/hipertrofia, todo ejercicio (barras, máquinas, mancuernas simultáneas, poleas dobles) es BILATERAL
  return false;
}

/**
 * Calcula el volumen total acumulado en una sesión o ejercicio con soporte para conversión de unidades
 * @param {Array<{weight: number|string, reps: number|string, completed?: boolean, unit?: string}>} sets
 * @returns {number} Volumen total en lbs-reps
 */
export function calculateVolume(sets = []) {
  if (!Array.isArray(sets)) return 0;
  return sets.reduce((acc, set) => {
    if (!set || (set.completed === false)) return acc;
    
    let w = parseFloat(set.weight) || 0;
    if (set.unit === 'kg') w *= 2.20462;

    const hasRepsL = set.repsL !== undefined && set.repsL !== '' && !isNaN(parseFloat(set.repsL));
    const hasRepsR = set.repsR !== undefined && set.repsR !== '' && !isNaN(parseFloat(set.repsR));

    // Solo tratar como unilateral si la bandera isUnilateral es explícitamente verdadera Y tiene datos por lado
    if (set.isUnilateral && (hasRepsL || hasRepsR)) {
      const rL = hasRepsL ? parseFloat(set.repsL) : 0;
      const rR = hasRepsR ? parseFloat(set.repsR) : 0;
      let wL = parseFloat(set.weightL || set.weight) || 0;
      let wR = parseFloat(set.weightR || set.weight) || 0;
      if (set.unit === 'kg') {
        wL *= 2.20462;
        wR *= 2.20462;
      }
      return acc + (wL * rL) + (wR * rR);
    }

    // Bilateral o repeticiones unificadas
    let r = parseFloat(set.reps);
    if (isNaN(r) || r <= 0) {
      if (hasRepsR || hasRepsL) {
        r = Math.max(hasRepsL ? parseFloat(set.repsL) : 0, hasRepsR ? parseFloat(set.repsR) : 0);
      } else {
        r = 0;
      }
    }
    return acc + (w * r);
  }, 0);
}

/**
 * Calcula el RPE promedio de una colección de series
 * @param {Array<{rpe: number|string}>} sets
 * @returns {string} Promedio formateado con un decimal (ej. "8.5")
 */
export function calculateAverageRPE(sets = []) {
  if (!Array.isArray(sets) || sets.length === 0) return '0.0';
  let sum = 0;
  let count = 0;
  sets.forEach(s => {
    if (s && s.rpe && !isNaN(parseFloat(s.rpe))) {
      sum += parseFloat(s.rpe);
      count++;
    }
  });
  return count > 0 ? (sum / count).toFixed(1) : '0.0';
}

/**
 * Calcula el peso dinámico e inteligente para la serie de calentamiento / aproximación (S0).
 * Basado en la fisiología del SNC y el líquido sinovial (50% a 55% del peso de trabajo real).
 * @param {Object} previousData - Datos de la sesión previa
 * @param {Object} currentData - Datos de la sesión actual
 * @param {number} fallbackWeight - Peso por defecto
 * @returns {number} Peso de calentamiento redondeado a múltiplos de 5 lbs
 */
export function calculateSmartWarmup(previousData = {}, currentData = {}, fallbackWeight = 60, machineConfig = null) {
  let workingWeight = 0;

  // 1. Buscar en la primera serie de trabajo de la sesión actual si ya se introdujo
  if (currentData[1]?.weight && !isNaN(parseFloat(currentData[1].weight))) {
    workingWeight = parseFloat(currentData[1].weight);
  } else {
    // 2. Extraer series válidas de la sesión previa
    const validWeights = Object.keys(previousData || {})
      .filter(k => !isNaN(parseInt(k, 10)) && parseInt(k, 10) > 0)
      .map(k => parseFloat(previousData[k]?.weight))
      .filter(w => !isNaN(w) && w > 0);

    if (validWeights.length > 0) {
      // Usar la carga de trabajo real (máxima efectiva o ancla), no un calentamiento de S1
      const maxW = Math.max(...validWeights);
      const heavySets = validWeights.filter(w => w >= maxW * 0.85);
      workingWeight = heavySets.length > 0 ? Math.max(...heavySets) : maxW;
    }
  }

  if (!workingWeight || workingWeight <= 0) workingWeight = fallbackWeight;

  // 50% del peso de trabajo para bombeo sin fatiga metabólica
  const warmupRaw = workingWeight * 0.50;
  return roundToAttainableWeight(warmupRaw, machineConfig);
}

/**
 * Motor Científico Holístico de Sobrecarga Progresiva y Estabilidad de Cargas.
 * Evalúa todas las series de la sesión previa, la dispersión de peso entre series (pirámide caótica),
 * la caída por fatiga (drop-off) y el RPE para orientar al atleta con precisión.
 * @param {string} targetRepsStr - Rango prescrito ej. "10-12" o "8-10"
 * @param {Object} previousData - Sets de la sesión anterior
 * @param {Object} machineConfig - Configuración de la máquina
 * @returns {Object} { status, suggestionText, badgeBg, badgeColor, icon }
 */
export function getLoadRecommendation(targetRepsStr = '10-12', previousData = {}, machineConfig = null) {
  let minReps = 8;
  let maxReps = 12;

  if (targetRepsStr && typeof targetRepsStr === 'string') {
    const parts = targetRepsStr.split('-');
    if (parts.length === 2) {
      minReps = parseInt(parts[0], 10) || 8;
      maxReps = parseInt(parts[1], 10) || 12;
    } else {
      const single = parseInt(targetRepsStr, 10);
      if (!isNaN(single)) { minReps = single; maxReps = single; }
    }
  }

  // Extraer series efectivas previas (S1..Sn)
  const prevSets = [];
  Object.keys(previousData).forEach(k => {
    const setNum = parseInt(k, 10);
    if (!isNaN(setNum) && setNum > 0) {
      const s = previousData[k];
      if (s && s.completed && s.weight && s.reps) {
        prevSets.push({
          setNum,
          weight: parseFloat(s.weight) || 0,
          reps: parseInt(s.reps, 10) || 0,
          rpe: parseFloat(s.rpe) || 8,
          unit: s.unit || 'lbs'
        });
      }
    }
  });

  if (prevSets.length === 0) {
    return {
      status: 'baseline',
      suggestionText: 'Sesión inicial: busca un peso estable que te sitúe en RPE 8 (2 reps en reserva).',
      badgeBg: '#eff6ff',
      badgeColor: '#1d4ed8',
      icon: '🌱'
    };
  }

  const weights = prevSets.map(s => s.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const spread = maxW - minW;
  const avgW = Math.round(weights.reduce((a, b) => a + b, 0) / weights.length);
  const roundedAvgW = roundToAttainableWeight(avgW, machineConfig);
  const avgRpe = parseFloat((prevSets.reduce((acc, s) => acc + s.rpe, 0) / prevSets.length).toFixed(1));
  const unit = prevSets[0]?.unit || 'lbs';

  // 1. ANÁLISIS DE DISPERSIÓN DE CARGA (Variaciones bruscas intra-sesión)
  // Si la diferencia entre la serie más pesada y la más ligera supera 10 lbs (o >12% de cambio)
  if (spread >= 10 && prevSets.length >= 3) {
    const anchorWeight = roundToAttainableWeight(avgW, machineConfig);
    return {
      status: 'stabilize',
      suggestionText: `Estabilización de Carga: Variaste entre ${minW} y ${maxW} ${unit}. Para hipertrofia óptima sin fatiga errática, fija un peso ancla de ~${anchorWeight} ${unit} en todas tus series efectivas hasta dominar ${targetRepsStr} reps consistentes.`,
      badgeBg: '#fffbeb',
      badgeColor: '#b45309',
      icon: '🎯'
    };
  }

  // 2. ANÁLISIS DE CAÍDA POR FATIGA EXCESIVA (Drop-off > 30% en repeticiones con RPE alto)
  const firstSetReps = prevSets[0].reps;
  const lastSetReps = prevSets[prevSets.length - 1].reps;
  if (firstSetReps - lastSetReps >= 4 && avgRpe >= 9) {
    return {
      status: 'fatigue',
      suggestionText: `Caída por fatiga acumulada: Tus repeticiones cayeron de ${firstSetReps} a ${lastSetReps} (RPE ${avgRpe}). Mantén los ${roundedAvgW} ${unit} pero añade +30s de descanso para preservar el volumen efectivo.`,
      badgeBg: '#fef2f2',
      badgeColor: '#b91c1c',
      icon: '⚠️'
    };
  }

  // 3. ANÁLISIS DE SOBRECARGA PROGRESIVA COMPLETA (Dominio consistente del rango alto)
  const allSetsReachedMax = prevSets.every(s => s.reps >= maxReps);
  const majorityReachedMax = prevSets.filter(s => s.reps >= maxReps).length >= Math.ceil(prevSets.length * 0.7);

  if ((allSetsReachedMax || majorityReachedMax) && avgRpe <= 8.5) {
    const nextW = getNextAttainableWeight(roundedAvgW, machineConfig, 'up');
    const diff = Math.round((nextW - roundedAvgW) * 10) / 10;
    return {
      status: 'increase',
      suggestionText: `¡Sobrecarga Lista! Dominaste consistentemente ${maxReps}+ reps en tus series a ${roundedAvgW} ${unit} con RPE ${avgRpe}. Sube a ${nextW} ${unit} (+${diff} ${unit}) en tu primera serie de hoy.`,
      badgeBg: '#ecfdf5',
      badgeColor: '#047857',
      icon: '🚀'
    };
  }

  // 4. CONSOLIDACIÓN EN ZONA DE HIPERTROFIA
  return {
    status: 'consolidate',
    suggestionText: `Consolidación: Mantén la carga ancla en ${roundedAvgW} ${unit}. Tu objetivo hoy es sumar +1 o +2 repeticiones en tus dos primeras series dentro del rango ${targetRepsStr}.`,
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
    icon: '💪'
  };
}

/**
 * Genera un objetivo de micro-sobrecarga proactivo para la serie actual
 * @param {number|string} prevWeight - Peso de la serie de referencia
 * @param {number|string} prevReps - Repeticiones logradas
 * @param {number|string} prevRpe - RPE percibido (opcional)
 * @param {string} targetRepsStr - Rango meta (ej. "8-10")
 * @returns {{ targetText: string, suggestedWeight: number, suggestedReps: number, type: string } | null}
 */
/**
 * Genera la Meta Global y Unificada del Ejercicio para la sesión de hoy.
 * Consolida todas las series previas en un objetivo central y no fragmentado:
 * - Si dominó el rango a RPE 8: Sobrecarga Progresiva (+incremento).
 * - Si cayó en fatiga prematura / carga excesiva: Ajuste para Hipertrofia.
 * - Si consolidó: Mantener peso ancla en el rango objetivo.
 */
/**
 * Limpia y ordena series efectivas previas:
 * - Ignora series con weight <= 0, reps <= 0, setNum <= 0, isWarmup o completed === false.
 * - Filtra series de aproximación/feeder registradas erróneamente como S1
 *   (setNum === 1 cuando weight < maxW y (weight < maxW * 0.85 || reps <= 6)).
 * - Ordena descendentemente por (weight, reps) para que S1 >= S2 >= S3 siempre.
 */
export function extractCleanWorkingSets(previousData = {}) {
  const rawSets = [];
  if (!previousData || typeof previousData !== 'object') return rawSets;

  Object.keys(previousData).forEach(k => {
    const num = parseInt(k, 10);
    if (!isNaN(num) && num > 0) {
      const s = previousData[k];
      if (!s || s.completed === false || s.isWarmup === true) return;
      const w = parseFloat(s.weight) || 0;
      const r = parseFloat(s.reps) || (
        (s.repsL !== undefined || s.repsR !== undefined)
          ? Math.max(parseFloat(s.repsL) || 0, parseFloat(s.repsR) || 0)
          : 0
      );
      if (w > 0 && r > 0) {
        rawSets.push({
          setNum: num,
          weight: w,
          reps: r,
          repsL: s.repsL !== undefined ? parseFloat(s.repsL) : undefined,
          repsR: s.repsR !== undefined ? parseFloat(s.repsR) : undefined,
          rpe: parseFloat(s.rpe) || 8,
          unit: s.unit || 'lbs'
        });
      }
    }
  });

  if (rawSets.length === 0) return rawSets;

  const maxW = Math.max(...rawSets.map(s => s.weight));
  const filtered = rawSets.filter(s => {
    const isErroneousFeederS1 = s.setNum === 1 && s.weight < maxW && (s.weight < maxW * 0.85 || s.reps <= 6);
    return !isErroneousFeederS1;
  });

  const workingSets = filtered.length > 0 ? filtered : rawSets;
  workingSets.sort((a, b) => (b.weight - a.weight) || (b.reps - a.reps) || (a.setNum - b.setNum));
  return workingSets;
}

export function getUnifiedExerciseTarget(previousData = {}, targetRepsStr = "10-12", machineConfig = null, options = {}) {
  let minReps = 8;
  let maxReps = 12;
  if (typeof targetRepsStr === 'string' && targetRepsStr.includes('-')) {
    const parts = targetRepsStr.split('-').map(p => parseInt(p.trim(), 10));
    if (!isNaN(parts[0])) minReps = parts[0];
    if (!isNaN(parts[1])) maxReps = parts[1];
  } else if (!isNaN(parseInt(targetRepsStr, 10))) {
    minReps = parseInt(targetRepsStr, 10);
    maxReps = minReps;
  }

  const sets = extractCleanWorkingSets(previousData);
  const rawMaxW = sets.length > 0 ? Math.max(...sets.map(s => s.weight)) : 0;
  const effectiveMachineConfig = options?.exercise
    ? resolveEffectiveMachineConfig(machineConfig, options.exercise, rawMaxW)
    : machineConfig;

  // Determinar incremento alcanzable según la máquina real
  let increment = 2.5;
  if (effectiveMachineConfig) {
    if (effectiveMachineConfig.type === 'plates' && effectiveMachineConfig.availablePlates && effectiveMachineConfig.availablePlates.length > 0) {
      const smallest = Math.min(...effectiveMachineConfig.availablePlates);
      increment = smallest * 2;
    } else if (effectiveMachineConfig.plateStep) {
      increment = parseFloat(effectiveMachineConfig.plateStep) || 5;
    } else if (effectiveMachineConfig.step) {
      increment = parseFloat(effectiveMachineConfig.step) || 5;
    } else if (effectiveMachineConfig.minIncrement) {
      increment = parseFloat(effectiveMachineConfig.minIncrement) || 2.5;
    } else if (effectiveMachineConfig.dumbbellStep) {
      increment = parseFloat(effectiveMachineConfig.dumbbellStep) || 5;
    }
  } else {
    const maxVal = sets.length > 0 ? Math.max(...sets.map(s => s.weight)) : 0;
    increment = maxVal >= 150 ? 5 : 2.5;
  }

  if (sets.length === 0) {
    return {
      hasData: false,
      targetWeight: 0,
      targetReps: `${minReps}-${maxReps}`,
      minReps,
      maxReps,
      strategyType: 'initial',
      headline: `Sesión Inicial (Rango ${minReps}-${maxReps} reps)`,
      badgeText: '🎯 Inicial',
      note: 'Busca un peso de trabajo que te sitúe en RPE 8 (2 repeticiones en reserva).',
      anchorWeight: 0,
      perSetTargets: [],
      increment
    };
  }

  const weights = sets.map(s => s.weight).filter(w => w > 0);
  const maxW = weights.length > 0 ? Math.max(...weights) : 0;
  const minW = weights.length > 0 ? Math.min(...weights) : 0;
  const spread = maxW - minW;

  const validSets = sets.filter(s => s.weight > 0 && s.reps > 0);
  const avgReps = validSets.length > 0 
    ? (validSets.reduce((sum, s) => sum + s.reps, 0) / validSets.length)
    : 0;

  // El peso ancla real debe ser un peso real ejecutado por el usuario en sus series de trabajo
  const topWeightSets = sets.filter(s => s.weight === maxW && s.weight > 0);
  let effectiveAnchor = maxW;

  // Si maxW solo fue 1 serie y cayó muy por debajo del rango mínimo (< minReps * 0.6),
  // buscar el peso de trabajo anterior más consistente:
  if (topWeightSets.length === 1 && topWeightSets[0].reps < Math.max(3, Math.round(minReps * 0.6))) {
    const subTopSets = sets.filter(s => s.weight < maxW && s.weight > 0);
    if (subTopSets.length > 0) {
      effectiveAnchor = Math.max(...subTopSets.map(s => s.weight));
    }
  }

  const anchorWeight = effectiveAnchor;

  // 0. Regla de Inactividad (>21 días sin entrenar este ejercicio)
  const prevDateRaw = previousData?.date || previousData?.dateRaw || previousData?.timestamp;
  if (prevDateRaw && anchorWeight > 0) {
    const refMs = options?.referenceDate ? new Date(options.referenceDate).getTime() : Date.now();
    const prevMs = new Date(prevDateRaw).getTime();
    const daysSinceLast = (!isNaN(refMs) && !isNaN(prevMs)) ? (refMs - prevMs) / (1000 * 60 * 60 * 24) : 0;
    if (daysSinceLast > 21) {
      const perSetTargets = sets.map((_, idx) => ({
        setNum: idx + 1,
        weight: anchorWeight,
        reps: minReps
      }));
      return {
        hasData: true,
        targetWeight: anchorWeight,
        targetReps: `${minReps}-${maxReps}`,
        minReps,
        maxReps,
        strategyType: 'reactivation',
        headline: `Reactivación (${Math.floor(daysSinceLast)}d): Mantén ${anchorWeight} lbs × ${minReps}-${maxReps} reps`,
        badgeText: '🔄 Reactivación',
        note: `Han pasado ${Math.floor(daysSinceLast)} días desde tu última sesión. Mantén ${anchorWeight} lbs para readaptar el tejido antes de subir carga.`,
        anchorWeight,
        canProgressWeight: false,
        isExcessiveLoad: false,
        spread,
        isSpreadHigh: spread >= 15 && (spread / (anchorWeight || 1)) > 0.15,
        daysSinceLast: Math.floor(daysSinceLast),
        perSetTargets,
        increment
      };
    }
  }

  // 1. Detectar si la carga fue EXCESIVA para hipertrofia en la sesión previa
  const severelyLowRepsThreshold = Math.max(3, minReps - 3);
  const severelyLowSets = validSets.filter(s => s.reps <= severelyLowRepsThreshold);
  const isExcessiveLoad = validSets.length >= 2 && (
    avgReps < (minReps - 1.5) ||
    (severelyLowSets.length >= Math.min(2, Math.ceil(validSets.length * 0.5)))
  );

  if (isExcessiveLoad && anchorWeight > 0) {
    const adjustedLoad = getNextAttainableWeight(anchorWeight, machineConfig, 'down');
    const perSetTargets = sets.map((_, idx) => ({
      setNum: idx + 1,
      weight: adjustedLoad,
      reps: minReps
    }));
    return {
      hasData: true,
      targetWeight: adjustedLoad,
      targetReps: `${minReps}-${maxReps}`,
      minReps,
      maxReps,
      strategyType: 'hypertrophy_adjustment',
      headline: `Ajuste para Hipertrofia: ${adjustedLoad} lbs × ${minReps}-${maxReps} reps`,
      badgeText: '🔬 Ajuste Hipertrofia',
      note: `La carga anterior (${maxW} lbs) causó fallo temprano en ${Math.round(avgReps)} reps. Ajustamos a ${adjustedLoad} lbs para trabajar en rango óptimo de hipertrofia.`,
      anchorWeight,
      adjustedLoad,
      isExcessiveLoad: true,
      canProgressWeight: false,
      spread,
      isSpreadHigh: spread >= 15 && (spread / (anchorWeight || 1)) > 0.15,
      perSetTargets,
      increment
    };
  }

  // 2. Doble Progresión diferenciada por tamaño de salto (jumpPct = deltaW / anchorWeight)
  const nextUp = getNextAttainableWeight(anchorWeight, effectiveMachineConfig, 'up');
  const jumpPct = anchorWeight > 0 ? (nextUp - anchorWeight) / anchorWeight : 0;
  const hasMixedWeights = maxW > minW && minW > 0;

  if (jumpPct >= 0.08) {
    // DOBLE PROGRESIÓN DINÁMICA POR SERIE (saltos grandes >= 8%)
    const perSetTargets = enforceMonotonicPerSetTargets(sets.map((s, idx) => {
      const realSetW = s.weight;
      if (s.reps >= maxReps && s.rpe < 9.5) {
        const setNextUp = getNextAttainableWeight(realSetW, effectiveMachineConfig, 'up');
        return { setNum: idx + 1, weight: setNextUp, reps: minReps };
      }
      return {
        setNum: idx + 1,
        weight: realSetW,
        reps: Math.min(maxReps, Math.round(s.reps) + 1)
      };
    }));

    const topTargetWeight = perSetTargets[0]?.weight || anchorWeight;
    const anyProgressed = perSetTargets.some(t => t.weight > anchorWeight);
    const realIncrement = Math.round((topTargetWeight - anchorWeight) * 10) / 10;

    if (anyProgressed) {
      return {
        hasData: true,
        targetWeight: topTargetWeight,
        targetReps: `${minReps}-${maxReps}`,
        minReps,
        maxReps,
        strategyType: 'progression',
        progressionMode: 'dynamic',
        jumpPct,
        headline: `¡Progresión Dinámica!: S1 a ${topTargetWeight} lbs × ${minReps} reps`,
        badgeText: realIncrement > 0 ? `⚡ +${realIncrement} lbs` : '⚡ Subir',
        note: `Salto grande (${Math.round(jumpPct * 100)}%). Las series que alcanzaron ${maxReps} reps suben a ${topTargetWeight} lbs × ${minReps} reps; el resto consolida +1 rep.`,
        anchorWeight,
        canProgressWeight: true,
        isExcessiveLoad: false,
        spread,
        isSpreadHigh: spread >= 15 && (spread / (anchorWeight || 1)) > 0.15,
        perSetTargets,
        increment: realIncrement || Math.round((nextUp - anchorWeight) * 10) / 10
      };
    }

    return {
      hasData: true,
      targetWeight: anchorWeight,
      targetReps: `${minReps}-${maxReps}`,
      minReps,
      maxReps,
      strategyType: 'consolidation',
      progressionMode: 'dynamic',
      jumpPct,
      headline: `Meta Hoy: ${anchorWeight} lbs × ${minReps}-${maxReps} reps`,
      badgeText: '🎯 Consolidar',
      note: `Salto grande (${Math.round(jumpPct * 100)}%). Consolida ${anchorWeight} lbs buscando +1 rep por serie hasta alcanzar ${maxReps} reps.`,
      anchorWeight,
      canProgressWeight: false,
      isExcessiveLoad: false,
      spread,
      isSpreadHigh: spread >= 15 && (spread / (anchorWeight || 1)) > 0.15,
      perSetTargets,
      increment: Math.round((nextUp - anchorWeight) * 10) / 10
    };
  }

  // DOBLE PROGRESIÓN CLÁSICA (saltos pequeños < 8%)
  const anchorSets = sets.filter(s => s.weight === anchorWeight && s.reps > 0);
  const passedAnchorSets = anchorSets.filter(s => s.reps >= maxReps && s.rpe < 9.5);
  const canProgressWeight = anchorSets.length > 0 && passedAnchorSets.length >= Math.ceil(anchorSets.length * 0.6);

  if (canProgressWeight) {
    const realIncrement = Math.round((nextUp - anchorWeight) * 10) / 10;
    const perSetTargets = sets.map((_, idx) => ({
      setNum: idx + 1,
      weight: nextUp,
      reps: minReps
    }));
    return {
      hasData: true,
      targetWeight: nextUp,
      targetReps: `${minReps}-${maxReps}`,
      minReps,
      maxReps,
      strategyType: 'progression',
      progressionMode: 'classic',
      jumpPct,
      headline: `¡Sobrecarga Progresiva!: Sube a ${nextUp} lbs × ${minReps}-${maxReps} reps`,
      badgeText: realIncrement > 0 ? `⚡ +${realIncrement} lbs` : '⚡ Subir',
      note: `¡Dominaste ${maxReps} reps a ${anchorWeight} lbs en la sesión anterior! Sube a ${nextUp} lbs hoy para mantener la tensión mecánica óptima.`,
      anchorWeight,
      canProgressWeight: true,
      isExcessiveLoad: false,
      spread,
      isSpreadHigh: spread >= 15 && (spread / (anchorWeight || 1)) > 0.15,
      perSetTargets,
      increment: realIncrement
    };
  }

  // 3. Detectar si hubo caída por fatiga
  const isS1RampUp = false;
  const lastSet = sets[sets.length - 1];
  const isFatigueDrop = sets.length >= 3 && lastSet && lastSet.reps > 0 && lastSet.reps <= minReps * 0.75;

  // 4. Consolidación de peso ancla (si hay pesos mixtos maxW > minW, mantener cada serie en su peso real)
  const targetRepsDisplay = `${minReps}-${maxReps}`;
  let noteText = `Consolida ${anchorWeight} lbs en rango de hipertrofia (${minReps}-${maxReps} reps) buscando RPE 8.`;
  let strategyType = 'consolidation';
  let badgeText = '🎯 Consolidar';

  if (isFatigueDrop) {
    strategyType = 'fatigue_management';
    badgeText = '⏱️ +Descanso';
    noteText = `Mantén ${anchorWeight} lbs. En la serie final previa caíste a ${lastSet.reps} reps; añade 45-60s de descanso para mantener repeticiones en ${minReps}-${maxReps}.`;
  }

  const perSetTargets = enforceMonotonicPerSetTargets(sets.map((s, idx) => ({
    setNum: idx + 1,
    weight: hasMixedWeights ? s.weight : anchorWeight,
    reps: Math.min(maxReps, Math.round(s.reps) + 1)
  })));

  return {
    hasData: true,
    targetWeight: anchorWeight,
    targetReps: targetRepsDisplay,
    minReps,
    maxReps,
    strategyType,
    progressionMode: hasMixedWeights ? 'dynamic' : 'classic',
    jumpPct,
    headline: `Meta Hoy: ${anchorWeight} lbs × ${targetRepsDisplay} reps`,
    badgeText,
    note: noteText,
    anchorWeight,
    canProgressWeight: false,
    isExcessiveLoad: false,
    isS1RampUp,
    isFatigueDrop,
    spread,
    isSpreadHigh: spread >= 15 && (spread / (anchorWeight || 1)) > 0.15,
    perSetTargets,
    increment
  };
}

/**
 * Motor de Diagnóstico Integral del Ejercicio.
 * Analiza TODAS las series previas juntas para generar la meta unificada y recomendaciones consistentes.
 */
export function analyzeExercisePerformance(previousData = {}, targetRepsStr = "10-12", machineConfig = null, options = {}) {
  const unifiedTarget = getUnifiedExerciseTarget(previousData, targetRepsStr, machineConfig, options);
  const sets = extractCleanWorkingSets(previousData);

  if (!unifiedTarget.hasData) {
    return {
      hasData: false,
      unifiedTarget,
      anchorWeight: 0,
      isSpreadHigh: false,
      isS1RampUp: false,
      isFatigueDrop: false,
      strategySummary: unifiedTarget.headline,
      setRecommendations: {}
    };
  }

  const weights = sets.map(s => s.weight).filter(w => w > 0);
  const maxW = weights.length > 0 ? Math.max(...weights) : 0;
  const minW = weights.length > 0 ? Math.min(...weights) : 0;
  const spread = maxW - minW;
  const validSets = sets.filter(s => s.weight > 0 && s.reps > 0);
  const avgReps = validSets.length > 0 
    ? (validSets.reduce((sum, s) => sum + s.reps, 0) / validSets.length)
    : 0;

  const lastSet = sets[sets.length - 1];
  const isFatigueDrop = sets.length >= 3 && lastSet.reps > 0 && lastSet.reps <= unifiedTarget.minReps * 0.75;

  // Asignar a CADA serie la meta real por serie (perSetTargets) para que todo el sistema coincida 1:1
  const setRecommendations = {};
  const maxSetCount = Math.max(sets.length, unifiedTarget.perSetTargets?.length || 0, 6);
  for (let sNum = 1; sNum <= maxSetCount; sNum++) {
    const isThisS1 = sNum === 1;
    const perSet = Array.isArray(unifiedTarget.perSetTargets)
      ? unifiedTarget.perSetTargets.find(t => t.setNum === sNum)
      : null;
    const sWeight = perSet?.weight > 0 ? perSet.weight : unifiedTarget.targetWeight;
    const sReps = perSet?.reps > 0 ? perSet.reps : unifiedTarget.minReps;

    let setNote = unifiedTarget.note;
    if (isThisS1 && unifiedTarget.isS1RampUp) {
      setNote = `En la sesión anterior S1 fue ligera (${sets[0]?.weight || 0} lbs). Tu peso real de trabajo es ${sWeight} lbs.`;
    } else if (sNum === sets.length && isFatigueDrop) {
      setNote = `En la serie final previa caíste a ${lastSet.reps} reps por fatiga. Mantén ${sWeight} lbs y añade 30-45s de descanso.`;
    }

    setRecommendations[sNum] = {
      suggestedWeight: sWeight,
      suggestedReps: sReps,
      targetText: perSet ? `Meta: ${sWeight} lbs × ${sReps} reps` : `Meta: ${sWeight} lbs × ${unifiedTarget.targetReps} reps`,
      shortText: perSet ? `Meta: ${sWeight}# × ${sReps}r` : `Meta: ${sWeight}# × ${unifiedTarget.targetReps}r`,
      note: setNote,
      isProgression: unifiedTarget.canProgressWeight,
      isLoadAdjustment: unifiedTarget.isExcessiveLoad,
      isAnchorFix: isThisS1 && unifiedTarget.isS1RampUp
    };
  }

  return {
    hasData: true,
    unifiedTarget,
    sets,
    anchorWeight: unifiedTarget.anchorWeight,
    adjustedLoad: unifiedTarget.adjustedLoad || unifiedTarget.targetWeight,
    isExcessiveLoad: unifiedTarget.isExcessiveLoad,
    avgReps: Math.round(avgReps * 10) / 10,
    maxWeight: maxW,
    minWeight: minW,
    spread,
    isSpreadHigh: unifiedTarget.isSpreadHigh,
    isS1RampUp: unifiedTarget.isS1RampUp,
    isFatigueDrop,
    canProgressWeight: unifiedTarget.canProgressWeight,
    increment: unifiedTarget.increment,
    minReps: unifiedTarget.minReps,
    maxReps: unifiedTarget.maxReps,
    targetRepsStr,
    strategySummary: unifiedTarget.headline,
    setRecommendations
  };
}

/**
 * Obtiene el siguiente peso físicamente alcanzable en la máquina (hacia arriba o hacia abajo).
 * Garantiza que las sugerencias del coach respeten al 100% las placas reales de la máquina.
 */
export function getNextAttainableWeight(currentWeight, machineConfig = null, direction = 'up') {
  const w = parseFloat(currentWeight) || 0;
  if (w <= 0) {
    if (machineConfig?.firstPlate) return parseFloat(machineConfig.firstPlate);
    if (machineConfig?.availableWeights && machineConfig.availableWeights.length > 0) {
      return Math.min(...machineConfig.availableWeights.map(Number));
    }
    return 10;
  }

  if (machineConfig) {
    // 1. Pesos exactos disponibles en la máquina o torre de placas
    if (machineConfig.availableWeights && Array.isArray(machineConfig.availableWeights) && machineConfig.availableWeights.length > 0) {
      const weights = Array.from(new Set(machineConfig.availableWeights.map(Number).filter(x => !isNaN(x) && x > 0))).sort((a, b) => a - b);
      const micro = parseFloat(machineConfig.microWeight) || 0;
      let allPossible = [...weights];
      if (micro > 0) {
        weights.forEach(pw => allPossible.push(pw + micro));
      }
      allPossible = Array.from(new Set(allPossible)).sort((a, b) => a - b);

      if (direction === 'up') {
        const configuredStep = parseFloat(machineConfig.plateStep) || parseFloat(machineConfig.step) || parseFloat(machineConfig.dumbbellStep) || parseFloat(machineConfig.minIncrement) || 0;
        const next = allPossible.find(pw => pw > w + 0.1);
        if (next !== undefined) {
          const producesOddHalf = Number.isInteger(w) && configuredStep > 0 && Number.isInteger(configuredStep) && !Number.isInteger(next);
          if (!producesOddHalf && next > w) {
            return next;
          }
          if (configuredStep > 0) {
            return w + configuredStep;
          }
        }
        const lastStep = configuredStep > 0
          ? configuredStep
          : (allPossible.length >= 2 ? (allPossible[allPossible.length - 1] - allPossible[allPossible.length - 2]) : 10);
        return w + lastStep;
      } else {
        const lower = allPossible.filter(pw => pw < w - 0.1);
        if (lower.length > 0) {
          const target = lower.slice().reverse().find(pw => pw <= w * 0.85);
          return target !== undefined ? target : lower[lower.length - 1];
        }
        return allPossible[0] || w;
      }
    }

    // 2. Preset especial two_tens_then_twenty
    if (machineConfig.stackPreset === 'two_tens_then_twenty') {
      const weights = [10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
      if (direction === 'up') {
        const next = weights.find(pw => pw > w + 0.1);
        return next !== undefined ? next : w + 20;
      } else {
        const lower = weights.filter(pw => pw < w - 0.1);
        return lower.length > 0 ? (lower.slice().reverse().find(pw => pw <= w * 0.85) || lower[lower.length - 1]) : 10;
      }
    }

    // 3. Torre de placas estándar
    if (machineConfig.type === 'stack') {
      const firstP = parseFloat(machineConfig.firstPlate) || 10;
      const step = parseFloat(machineConfig.plateStep) || parseFloat(machineConfig.minIncrement) || parseFloat(machineConfig.step) || 10;
      if (direction === 'up') {
        if (w < firstP) return firstP;
        return w + step;
      } else {
        const rawTarget = w * 0.85;
        const reduced = Math.max(firstP, firstP + Math.round((rawTarget - firstP) / step) * step);
        return reduced < w ? reduced : Math.max(firstP, w - step);
      }
    }

    // 4. Discos / Prensa de piernas
    if (machineConfig.type === 'plates') {
      const base = parseFloat(machineConfig.baseWeight) || 0;
      const smallest = (machineConfig.availablePlates && machineConfig.availablePlates.length > 0)
        ? Math.min(...machineConfig.availablePlates)
        : (parseFloat(machineConfig.smallestPlate) || 2.5);
      const step = smallest * 2;
      if (direction === 'up') {
        return Math.max(base + step, w + step);
      } else {
        const rawTarget = Math.max(0, (w * 0.85) - base);
        const reduced = base + Math.round(rawTarget / step) * step;
        return reduced < w ? reduced : Math.max(base, w - step);
      }
    }

    // 5. Mancuernas
    if (machineConfig.type === 'dumbbells') {
      const step = parseFloat(machineConfig.dumbbellStep) || parseFloat(machineConfig.minIncrement) || 5;
      if (direction === 'up') {
        return w + step;
      } else {
        const reduced = Math.max(step, Math.round((w * 0.85) / step) * step);
        return reduced < w ? reduced : Math.max(step, w - step);
      }
    }
  }

  // Estándar de gimnasio
  const step = w >= 150 ? 5 : (w >= 40 ? 5 : 2.5);
  if (direction === 'up') {
    return w + step;
  } else {
    const rawTarget = w * 0.85;
    const reduced = Math.round(rawTarget / step) * step;
    return reduced < w ? reduced : Math.max(step, w - step);
  }
}

/**
 * Redondea estrictamente a los pesos reales y físicamente alcanzables en la máquina o mancuernas.
 * Previene números imposibles como 151 lbs cuando las placas son de 10 o 20 lbs.
 */
export function roundToAttainableWeight(rawWeight, machineConfig = null) {
  const w = parseFloat(rawWeight) || 0;
  if (w <= 0) return 0;

  if (machineConfig) {
    // 1. Pesos discretos exactos configurados en la máquina
    if (machineConfig.availableWeights && Array.isArray(machineConfig.availableWeights) && machineConfig.availableWeights.length > 0) {
      const weights = machineConfig.availableWeights.map(x => parseFloat(x)).filter(x => !isNaN(x) && x > 0);
      const micro = parseFloat(machineConfig.microWeight) || 0;
      let allPossible = [...weights];
      if (micro > 0) {
        weights.forEach(pw => allPossible.push(pw + micro));
      }
      allPossible = Array.from(new Set(allPossible)).sort((a, b) => a - b);
      return allPossible.reduce((prev, curr) => Math.abs(curr - w) < Math.abs(prev - w) ? curr : prev);
    }

    // 2. Preset especial de extensión / máquina con 2 iniciales de 10 lbs y luego de 20 en 20 lbs
    if (machineConfig.stackPreset === 'two_tens_then_twenty') {
      const weights = [10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
      const micro = parseFloat(machineConfig.microWeight) || 0;
      let allPossible = [...weights];
      if (micro > 0) {
        weights.forEach(pw => allPossible.push(pw + micro));
      }
      allPossible = Array.from(new Set(allPossible)).sort((a, b) => a - b);
      return allPossible.reduce((prev, curr) => Math.abs(curr - w) < Math.abs(prev - w) ? curr : prev);
    }

    // 3. Torre de placas estándar (firstPlate + n * plateStep)
    if (machineConfig.type === 'stack') {
      const firstP = parseFloat(machineConfig.firstPlate) || 10;
      const step = parseFloat(machineConfig.plateStep) || parseFloat(machineConfig.minIncrement) || parseFloat(machineConfig.step) || 10;
      const micro = parseFloat(machineConfig.microWeight) || 0;
      if (w <= firstP) return firstP;
      const roundedBase = firstP + (Math.round((w - firstP) / step) * step);
      if (micro > 0 && Math.abs((roundedBase + micro) - w) < Math.abs(roundedBase - w)) {
        return roundedBase + micro;
      }
      return roundedBase;
    }

    // 4. Máquina con discos o prensa
    if (machineConfig.type === 'plates') {
      const base = parseFloat(machineConfig.baseWeight) || 0;
      const smallest = (machineConfig.availablePlates && machineConfig.availablePlates.length > 0)
        ? Math.min(...machineConfig.availablePlates)
        : (parseFloat(machineConfig.smallestPlate) || 2.5);
      const step = smallest * 2; // discos de ambos lados
      const net = Math.max(0, w - base);
      return base + (Math.round(net / step) * step);
    }

    // 5. Mancuernas
    if (machineConfig.type === 'dumbbells') {
      const step = parseFloat(machineConfig.dumbbellStep) || parseFloat(machineConfig.minIncrement) || 5;
      return Math.max(step, Math.round(w / step) * step);
    }
  }

  // Redondeo estándar de gimnasio: 5 lbs si >= 40 lbs, o 2.5 lbs si es más ligero
  const step = w >= 40 ? 5 : 2.5;
  return Math.max(step, Math.round(w / step) * step);
}

/**
 * Genera el objetivo de sobrecarga inteligente por serie.
 * Proporciona metas ESTABLES alineadas con la Meta Unificada del Ejercicio para hoy.
 * No desplaza las metas de las series siguientes si el usuario registra su peso planificado.
 */
export function getOverloadTarget(
  setNum, 
  previousData = {}, 
  targetRepsStr = "10-12", 
  machineConfig = null, 
  fallbackWeight = null, 
  fallbackReps = null,
  currentExerciseData = null,
  isDeloadMode = false,
  options = {}
) {
  const analysis = analyzeExercisePerformance(previousData, targetRepsStr, machineConfig, options);
  const unified = analysis.unifiedTarget || getUnifiedExerciseTarget(previousData, targetRepsStr, machineConfig, options);

  const minReps = unified.minReps || 8;
  const maxReps = unified.maxReps || 12;
  const setTarget = Array.isArray(unified.perSetTargets)
    ? unified.perSetTargets.find(t => t.setNum === setNum)
    : null;
  const plannedReps = setTarget?.reps || minReps;
  const rawPlannedWeight = setTarget?.weight > 0
    ? setTarget.weight
    : (unified.hasData && unified.targetWeight > 0
      ? unified.targetWeight
      : roundToAttainableWeight(fallbackWeight || 0, machineConfig));

  // Ajuste por Deload (80% de carga habitual para disipar fatiga articular y neural)
  const plannedWeight = isDeloadMode && rawPlannedWeight > 0
    ? roundToAttainableWeight(rawPlannedWeight * 0.8, machineConfig)
    : rawPlannedWeight;

  // Retroalimentación inteligente intra-entreno (SIN mutar ni desplazar la meta planificada)
  let coachFeedback = null;
  let isIntraSessionEasy = false;
  let isIntraSessionHard = false;

  if (setNum > 1 && currentExerciseData) {
    const prevDoneSet = currentExerciseData[setNum - 1];
    if (prevDoneSet && prevDoneSet.completed && parseFloat(prevDoneSet.weight) > 0) {
      const actualWeight = parseFloat(prevDoneSet.weight);
      const actualReps = parseFloat(prevDoneSet.reps) || minReps;
      const actualRpe = parseFloat(prevDoneSet.rpe) || 8;

      if (isDeloadMode) {
        coachFeedback = `🧘 Deload S${setNum - 1}: Carga reducida (${actualWeight}# × ${actualReps}r, RPE ${actualRpe}). Mantén RIR 3-4 sin aproximarte al fallo.`;
      } else if (actualRpe <= 7 || actualReps >= maxReps + 2) {
        isIntraSessionEasy = true;
        coachFeedback = `S${setNum - 1} completada con solvencia (${actualWeight}# × ${actualReps}r, RPE ${actualRpe}). Mantén ${plannedWeight || actualWeight} lbs para acumular volumen efectivo de hipertrofia.`;
      } else if (actualRpe >= 9.5 || actualReps < Math.max(3, minReps - 2)) {
        isIntraSessionHard = true;
        coachFeedback = `S${setNum - 1} al límite muscular (${actualWeight}# × ${actualReps}r, RPE ${actualRpe}). Si es necesario, descansa 3 min o reduce 1 placa para no comprometer la técnica.`;
      } else {
        coachFeedback = `S${setNum - 1} en el blanco (${actualWeight}# × ${actualReps}r, RPE ${actualRpe}). Continúa a ${plannedWeight || actualWeight} lbs.`;
      }
    }
  }

  if (plannedWeight > 0) {
    let setNote = coachFeedback || unified.note || `Trabajar a ${plannedWeight} lbs buscando ${minReps}-${maxReps} reps con RPE 8.`;
    if (isDeloadMode) {
      setNote = coachFeedback || `🧘 Semana de Descarga: ${plannedWeight} lbs (~80% de tu carga normal). Busca ${minReps} reps con RIR 3-4 (cero fallo) para recuperación celular.`;
    } else if (!coachFeedback && setNum === 1 && unified.isS1RampUp) {
      setNote = `En la sesión anterior S1 fue ligera (${analysis.sets[0]?.weight || 0} lbs). Tu peso real de trabajo es ${plannedWeight} lbs.`;
    }

    return {
      suggestedWeight: plannedWeight,
      suggestedReps: plannedReps,
      perSetTargets: unified.perSetTargets || [],
      strategyType: unified.strategyType,
      targetText: isDeloadMode 
        ? `Deload 80%: ${plannedWeight} lbs × ${minReps} reps (RIR 3-4)` 
        : `Meta: ${plannedWeight} lbs × ${setTarget ? `${plannedReps}` : (unified.targetReps || `${minReps}-${maxReps}`)} reps`,
      shortText: isDeloadMode
        ? `Deload: ${plannedWeight}# (80%)`
        : `Meta: ${plannedWeight}# × ${setTarget ? `${plannedReps}` : (unified.targetReps || `${minReps}-${maxReps}`)}r`,
      note: setNote,
      isProgression: !isDeloadMode && unified.canProgressWeight,
      isLoadAdjustment: unified.isExcessiveLoad,
      isAnchorFix: !isDeloadMode && setNum === 1 && unified.isS1RampUp,
      isDeload: isDeloadMode,
      targetRpe: isDeloadMode ? '7 (RIR 3-4)' : '8 (RIR 1-2)',
      coachFeedback,
      isIntraSessionEasy,
      isIntraSessionHard,
      type: isDeloadMode ? 'deload' : (unified.canProgressWeight ? 'increase' : (unified.isExcessiveLoad ? 'decrease' : 'maintain'))
    };
  }

  // Fallback si no hay peso previo
  const fallbackW = roundToAttainableWeight(fallbackWeight || 0, machineConfig);
  const fallbackEffectiveW = isDeloadMode && fallbackW > 0 
    ? roundToAttainableWeight(fallbackW * 0.8, machineConfig) 
    : fallbackW;
  const fallbackR = parseFloat(fallbackReps || minReps);
  if (fallbackEffectiveW <= 0 && fallbackR <= 0) return null;

  return {
    suggestedWeight: fallbackEffectiveW,
    suggestedReps: fallbackR,
    targetText: isDeloadMode 
      ? `Deload 80%: ${fallbackEffectiveW} lbs × ${fallbackR} reps (RIR 3-4)` 
      : `Meta: ${fallbackEffectiveW} lbs × ${fallbackR} reps`,
    shortText: isDeloadMode ? `Deload: ${fallbackEffectiveW}#` : `Meta: ${fallbackEffectiveW}# × ${fallbackR}r`,
    note: isDeloadMode 
      ? `🧘 Modo Deload: Carga al 80% y RIR 3-4 para recuperación articular y neural.`
      : (coachFeedback || 'Encuentra tu carga de trabajo objetivo a RPE 8.'),
    coachFeedback,
    isDeload: isDeloadMode,
    type: isDeloadMode ? 'deload' : 'maintain'
  };
}

export function calculateRelativeStrength(estimated1RM, bodyWeight) {
  const rm = parseFloat(estimated1RM) || 0;
  const bw = parseFloat(bodyWeight) || 0;
  if (rm <= 0 || bw <= 0) return 0;
  return parseFloat((rm / bw).toFixed(2));
}

/**
 * Calcula estadísticas avanzadas de carga y variabilidad de esfuerzo para una sesión.
 * @param {Array<{weight: number, reps: number, rpe?: string|number, isWarmup?: boolean}>} sets
 * @returns {Object}
 */
export function calculateSessionLoadStats(sets = []) {
  if (!Array.isArray(sets) || sets.length === 0) {
    return {
      peakWeight: 0,
      minWeight: 0,
      avgWeight: 0,
      weightedAvgWeight: 0,
      weightSpread: 0,
      bestReps: 0,
      avgReps: 0,
      minReps: 0,
      maxReps: 0,
      tonnage: 0,
      totalReps: 0,
      rpeStart: null,
      rpeEnd: null,
      deltaRPE: 0,
      repDropOffPct: 0,
      effectiveSetsCount: 0
    };
  }

  const workingSets = sets.filter(s => !s.isWarmup && (s.setNum === undefined || s.setNum > 0));
  const activeSets = workingSets.length > 0 ? workingSets : sets;

  let maxW = 0;
  let minW = Infinity;
  let maxR = 0;
  let minR = Infinity;
  let tonnage = 0;
  let totalReps = 0;
  let weightSum = 0;

  activeSets.forEach(s => {
    const w = parseFloat(s.weight) || 0;
    const r = parseFloat(s.reps) || 0;
    if (w > maxW) maxW = w;
    if (w < minW && w > 0) minW = w;
    if (r > maxR) maxR = r;
    if (r < minR && r > 0) minR = r;
    tonnage += (w * r);
    totalReps += r;
    weightSum += w;
  });

  const avgWeight = activeSets.length > 0 ? Math.round((weightSum / activeSets.length) * 10) / 10 : maxW;
  const weightedAvgWeight = totalReps > 0 ? Math.round((tonnage / totalReps) * 10) / 10 : avgWeight;
  const minWeight = minW !== Infinity ? minW : maxW;
  const weightSpread = Math.max(0, maxW - minWeight);

  // Esfuerzo (RPE/RIR)
  const validRPEs = activeSets.map(s => parseFloat(s.rpe)).filter(v => !isNaN(v) && v > 0);
  const rpeStart = validRPEs.length > 0 ? validRPEs[0] : null;
  const rpeEnd = validRPEs.length > 0 ? validRPEs[validRPEs.length - 1] : null;
  const deltaRPE = (rpeStart !== null && rpeEnd !== null) ? Math.round((rpeEnd - rpeStart) * 10) / 10 : 0;

  // Caída de repeticiones (fatiga muscular)
  let repDropOffPct = 0;
  if (activeSets.length >= 2 && activeSets[0].reps > 0) {
    const rFirst = activeSets[0].reps;
    const rLast = activeSets[activeSets.length - 1].reps;
    if (activeSets[0].weight === activeSets[activeSets.length - 1].weight) {
      repDropOffPct = Math.max(0, Math.round(((rFirst - rLast) / rFirst) * 100));
    }
  }

  return {
    peakWeight: maxW,
    minWeight,
    avgWeight,
    weightedAvgWeight,
    weightSpread,
    bestReps: maxR,
    minReps: minR !== Infinity ? minR : maxR,
    maxReps: maxR,
    avgReps: activeSets.length > 0 ? Math.round((totalReps / activeSets.length) * 10) / 10 : 0,
    tonnage,
    totalReps,
    rpeStart,
    rpeEnd,
    deltaRPE,
    repDropOffPct,
    effectiveSetsCount: activeSets.length
  };
}

// Re-exportar gestor maestro de máquinas y calibraciones (Planta Alta / Planta Baja / Multi-Perfiles)
export {
  DEFAULT_ULTRAGYM_MACHINES,
  resolveEffectiveMachineConfig,
  getMachineStorageKey,
  getExerciseMachineKeys,
  sanitizeMachineProfile,
  loadMachineProfilesForExercise,
  getActiveMachineConfig,
  saveMachineConfigAndProfiles
} from '../utils/machineManager.js';

