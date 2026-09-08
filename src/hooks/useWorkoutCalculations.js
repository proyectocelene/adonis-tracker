/**
 * Hook utilitario con funciones matemáticas y algoritmos científicos para COACH V2.
 * Desacopla la lógica de cálculo y recomendaciones biomecánicas de los componentes visuales.
 */

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
 * Calcula el volumen total acumulado en una sesión o ejercicio con soporte para conversión de unidades
 * @param {Array<{weight: number|string, reps: number|string, completed?: boolean, unit?: string}>} sets
 * @returns {number} Volumen total en lbs-reps
 */
export function calculateVolume(sets = []) {
  if (!Array.isArray(sets)) return 0;
  return sets.reduce((acc, set) => {
    if (!set || (set.completed === false)) return acc;
    
    // Soporte para ejercicios unilaterales (Lado Izq y Der desglosados)
    if (set.repsL !== undefined || set.repsR !== undefined) {
      const rL = parseFloat(set.repsL) || 0;
      const rR = parseFloat(set.repsR) || 0;
      let wL = parseFloat(set.weightL || set.weight) || 0;
      let wR = parseFloat(set.weightR || set.weight) || 0;
      if (set.unit === 'kg') {
        wL *= 2.20462;
        wR *= 2.20462;
      }
      return acc + (wL * rL) + (wR * rR);
    }

    let w = parseFloat(set.weight) || 0;
    if (set.unit === 'kg') w *= 2.20462;
    const r = parseFloat(set.reps) || 0;
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
export function calculateSmartWarmup(previousData = {}, currentData = {}, fallbackWeight = 60) {
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
  return Math.max(5, Math.round(warmupRaw / 5) * 5);
}

/**
 * Motor Científico Holístico de Sobrecarga Progresiva y Estabilidad de Cargas.
 * Evalúa todas las series de la sesión previa, la dispersión de peso entre series (pirámide caótica),
 * la caída por fatiga (drop-off) y el RPE para orientar al atleta con precisión.
 * @param {string} targetRepsStr - Rango prescrito ej. "10-12" o "8-10"
 * @param {Object} previousData - Sets de la sesión anterior
 * @returns {Object} { status, suggestionText, badgeBg, badgeColor, icon }
 */
export function getLoadRecommendation(targetRepsStr = '10-12', previousData = {}) {
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
  const repsArray = prevSets.map(s => s.reps);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const spread = maxW - minW;
  const avgW = Math.round(weights.reduce((a, b) => a + b, 0) / weights.length);
  const avgRpe = parseFloat((prevSets.reduce((acc, s) => acc + s.rpe, 0) / prevSets.length).toFixed(1));
  const unit = prevSets[0]?.unit || 'lbs';

  // 1. ANÁLISIS DE DISPERSIÓN DE CARGA (Variaciones bruscas intra-sesión)
  // Si la diferencia entre la serie más pesada y la más ligera supera 10 lbs (o >12% de cambio)
  if (spread >= 10 && prevSets.length >= 3) {
    const anchorWeight = Math.round(avgW / 5) * 5;
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
      suggestionText: `Caída por fatiga acumulada: Tus repeticiones cayeron de ${firstSetReps} a ${lastSetReps} (RPE ${avgRpe}). Mantén los ${avgW} ${unit} pero añade +30s de descanso o reduce 5 ${unit} en la última serie para preservar el volumen efectivo.`,
      badgeBg: '#fef2f2',
      badgeColor: '#b91c1c',
      icon: '⚠️'
    };
  }

  // 3. ANÁLISIS DE SOBRECARGA PROGRESIVA COMPLETA (Dominio consistente del rango alto)
  const allSetsReachedMax = prevSets.every(s => s.reps >= maxReps);
  const majorityReachedMax = prevSets.filter(s => s.reps >= maxReps).length >= Math.ceil(prevSets.length * 0.7);

  if ((allSetsReachedMax || majorityReachedMax) && avgRpe <= 8.5) {
    return {
      status: 'increase',
      suggestionText: `¡Sobrecarga Lista! Dominaste consistentemente ${maxReps}+ reps en tus series a ${avgW} ${unit} con RPE ${avgRpe}. Sube +2.5 a 5 ${unit} en tu primera serie de hoy.`,
      badgeBg: '#ecfdf5',
      badgeColor: '#047857',
      icon: '🚀'
    };
  }

  // 4. CONSOLIDACIÓN EN ZONA DE HIPERTROFIA
  return {
    status: 'consolidate',
    suggestionText: `Consolidación: Mantén la carga ancla en ${avgW} ${unit}. Tu objetivo hoy es sumar +1 o +2 repeticiones en tus dos primeras series dentro del rango ${targetRepsStr}.`,
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
 * Motor de Diagnóstico Integral del Ejercicio.
 * Analiza TODAS las series previas juntas (no en aislamiento) para detectar:
 * - Desvíos/calentamientos en S1 (ej. 230# vs 320#).
 * - Peso ancla real de trabajo.
 * - Caídas de repeticiones por fatiga en la serie final.
 * - Progresión segura acorde a la máquina real.
 */
export function analyzeExercisePerformance(previousData = {}, targetRepsStr = "10-12", machineConfig = null) {
  const sets = [];
  Object.keys(previousData || {}).forEach(k => {
    const num = parseInt(k, 10);
    if (!isNaN(num) && num > 0) {
      const s = previousData[k];
      if (s && (s.completed || s.weight)) {
        sets.push({
          setNum: num,
          weight: parseFloat(s.weight) || 0,
          reps: parseFloat(s.reps) || 0,
          repsL: s.repsL ? parseFloat(s.repsL) : undefined,
          repsR: s.repsR ? parseFloat(s.repsR) : undefined,
          rpe: parseFloat(s.rpe) || 8,
          unit: s.unit || 'lbs'
        });
      }
    }
  });

  sets.sort((a, b) => a.setNum - b.setNum);

  if (sets.length === 0) {
    return {
      hasData: false,
      anchorWeight: 0,
      isSpreadHigh: false,
      isS1RampUp: false,
      isFatigueDrop: false,
      strategySummary: 'Sesión inicial: busca un peso estable que te sitúe en RPE 8 (2 reps en reserva).',
      setRecommendations: {}
    };
  }

  // Parse rep range
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

  // Determine realistic increment
  let increment = 2.5;
  if (machineConfig) {
    if (machineConfig.type === 'plates' && machineConfig.availablePlates && machineConfig.availablePlates.length > 0) {
      const smallest = Math.min(...machineConfig.availablePlates);
      increment = smallest * 2;
    } else if (machineConfig.plateStep) {
      increment = parseFloat(machineConfig.plateStep) || 5;
    } else if (machineConfig.step) {
      increment = parseFloat(machineConfig.step) || 5;
    } else if (machineConfig.minIncrement) {
      increment = parseFloat(machineConfig.minIncrement) || 2.5;
    }
  } else {
    const maxVal = Math.max(...sets.map(s => s.weight));
    increment = maxVal >= 150 ? 5 : 2.5;
  }

  const weights = sets.map(s => s.weight).filter(w => w > 0);
  const maxW = weights.length > 0 ? Math.max(...weights) : 0;
  const minW = weights.length > 0 ? Math.min(...weights) : 0;
  const spread = maxW - minW;

  // PESO ANCLA REAL: moda o promedio de las series pesadas reales (no calentamientos)
  const heavySets = sets.filter(s => s.weight >= maxW * 0.85 && s.weight > 0);
  const anchorWeight = heavySets.length > 0
    ? Math.round(heavySets.reduce((a, b) => a + b.weight, 0) / heavySets.length)
    : maxW;

  const validSets = sets.filter(s => s.weight > 0 && s.reps > 0);
  const avgReps = validSets.length > 0 
    ? (validSets.reduce((sum, s) => sum + s.reps, 0) / validSets.length)
    : 0;

  // 1. Detectar si la carga fue EXCESIVA para hipertrofia (sub-rango severo):
  // Si en un rango de 8-10 reps el atleta cae a 4 o 3 reps, no es hipertrofia óptima sino fatiga excesiva.
  const severelyLowRepsThreshold = Math.max(3, minReps - 2);
  const severelyLowSets = validSets.filter(s => s.reps <= severelyLowRepsThreshold);
  const isExcessiveLoad = validSets.length >= 2 && (
    avgReps < (minReps - 1) ||
    (severelyLowSets.length >= Math.min(2, Math.ceil(validSets.length * 0.5)))
  );

  // Cálculo de peso ajustado para hipertrofia si la carga fue excesiva:
  // Reducir un 12-15% el peso ancla para devolver al atleta al rango objetivo (ej. de 125# a 105#)
  let adjustedLoad = anchorWeight;
  if (isExcessiveLoad && anchorWeight > 0) {
    const step = increment >= 2.5 ? increment : 5;
    const rawTarget = anchorWeight * 0.85; // 15% de reducción
    adjustedLoad = Math.max(step, Math.round(rawTarget / step) * step);
  }

  // Detectar si S1 fue un calentamiento/rampa accidentalmente registrado como serie 1
  const isS1RampUp = !isExcessiveLoad && sets.length >= 2 && sets[0].weight > 0 && sets[0].weight <= anchorWeight * 0.80;
  const isSpreadHigh = spread >= 15 && (spread / (anchorWeight || 1)) > 0.15;

  // Detectar si la última serie tuvo una caída fuerte por fatiga
  const lastSet = sets[sets.length - 1];
  const isFatigueDrop = !isExcessiveLoad && sets.length >= 3 && lastSet.reps > 0 && lastSet.reps <= minReps * 0.75;

  // Evaluar si las series de trabajo dominaron el rango para sobrecarga
  const passedCount = heavySets.filter(s => s.reps >= maxReps && s.rpe <= 8.5).length;
  const canProgressWeight = !isExcessiveLoad && passedCount >= Math.ceil(heavySets.length * 0.6) && heavySets.length > 0;

  // Planificar serie por serie con rigor científico de hipertrofia
  const setRecommendations = {};
  sets.forEach(s => {
    const isThisS1 = s.setNum === 1;

    // Caso 0: Carga excesiva previa (caída a 3-4 reps en rango 8-10) -> Reducción estratégica a todas las series
    if (isExcessiveLoad) {
      setRecommendations[s.setNum] = {
        suggestedWeight: adjustedLoad,
        suggestedReps: minReps,
        targetText: `Meta: ${adjustedLoad} lbs × ${minReps}-${maxReps} reps`,
        shortText: `Meta: ${adjustedLoad} lbs × ${minReps}-${maxReps} reps`,
        note: `Tu carga previa (${s.weight} lbs) provocó fallo a ${s.reps} reps. Ajustamos a ${adjustedLoad} lbs con 2-3 min de descanso.`,
        isLoadAdjustment: true
      };
      return;
    }

    // Caso 1: S1 fue mucho más ligera que el resto (ej. 230 lbs vs 320 lbs)
    if (isThisS1 && isS1RampUp) {
      setRecommendations[s.setNum] = {
        suggestedWeight: anchorWeight,
        suggestedReps: minReps,
        targetText: `Meta: ${anchorWeight} lbs × ${minReps}-${maxReps} reps`,
        shortText: `Meta: ${anchorWeight} lbs × ${minReps}-${maxReps} reps`,
        note: `En la sesión anterior S1 fue ligera (${s.weight} lbs). Tu peso real de trabajo es ${anchorWeight} lbs.`,
        isAnchorFix: true
      };
      return;
    }

    // Caso 2: Serie final con caída de fatiga
    if (s.setNum === sets.length && isFatigueDrop) {
      setRecommendations[s.setNum] = {
        suggestedWeight: anchorWeight,
        suggestedReps: minReps,
        targetText: `Meta: ${anchorWeight} lbs × ${minReps} reps`,
        shortText: `Meta: ${anchorWeight} lbs × ${minReps} reps`,
        note: `En la serie anterior caíste a ${s.reps} reps por fatiga. Mantén ${anchorWeight} lbs y añade 30 a 45s de descanso.`,
        isFatigueRest: true
      };
      return;
    }

    // Caso 3: Sobrecarga Progresiva (superó el tope del rango en la sesión anterior)
    if (canProgressWeight) {
      const nextW = Math.round((anchorWeight + increment) * 10) / 10;
      setRecommendations[s.setNum] = {
        suggestedWeight: nextW,
        suggestedReps: minReps,
        targetText: `Meta: ${nextW} lbs × ${minReps} reps`,
        shortText: `Meta: ${nextW} lbs × ${minReps} reps`,
        note: `¡Sobrecarga! Superaste ${maxReps} reps a ${anchorWeight} lbs. Sube a ${nextW} lbs hoy.`,
        isProgression: true
      };
      return;
    }

    // Caso 4: Progresión en repeticiones dentro del rango de hipertrofia
    if (s.reps < maxReps) {
      const nextReps = Math.min(maxReps, (s.reps || minReps) + 1);
      setRecommendations[s.setNum] = {
        suggestedWeight: anchorWeight,
        suggestedReps: nextReps,
        targetText: `Meta: ${anchorWeight} lbs × ${nextReps} reps`,
        shortText: `Meta: ${anchorWeight} lbs × ${nextReps} reps`,
        note: `Consolidación: busca ${nextReps} repeticiones con ${anchorWeight} lbs controlando la bajada en 2-3s.`,
        isRepIncrease: true
      };
      return;
    }

    // Caso 5: Consolidación
    setRecommendations[s.setNum] = {
      suggestedWeight: anchorWeight,
      suggestedReps: maxReps,
      targetText: `Meta: ${anchorWeight} lbs × ${maxReps} reps`,
      shortText: `Meta: ${anchorWeight} lbs × ${maxReps} reps`,
      note: `Consolida el control neuromuscular en ${anchorWeight} lbs antes de subir peso.`,
      isMaintain: true
    };
  });

  let strategySummary = `Consolidar ${anchorWeight} lbs en rango de hipertrofia (${minReps}-${maxReps} reps).`;
  if (isExcessiveLoad) {
    strategySummary = `Carga previa excesiva (${maxW}#). Reducir a ${adjustedLoad} lbs para trabajar con calidad en rango ${minReps}-${maxReps} reps.`;
  } else if (canProgressWeight) {
    strategySummary = `¡Sobrecarga lista! Subir a ${Math.round((anchorWeight + increment) * 10) / 10} lbs × ${minReps} reps.`;
  } else if (isS1RampUp) {
    strategySummary = `Unificar todas las series al peso ancla de ${anchorWeight} lbs.`;
  }

  return {
    hasData: true,
    sets,
    anchorWeight,
    adjustedLoad,
    isExcessiveLoad,
    avgReps: Math.round(avgReps * 10) / 10,
    maxWeight: maxW,
    minWeight: minW,
    spread,
    isSpreadHigh,
    isS1RampUp,
    isFatigueDrop,
    canProgressWeight,
    increment,
    minReps,
    maxReps,
    targetRepsStr,
    strategySummary,
    setRecommendations
  };
}

/**
 * Genera el objetivo de sobrecarga inteligente por serie, considerando todo el contexto del ejercicio.
 */
export function getOverloadTarget(setNum, previousData = {}, targetRepsStr = "10-12", machineConfig = null, fallbackWeight = null, fallbackReps = null) {
  // Si se le pasa el análisis global
  const analysis = analyzeExercisePerformance(previousData, targetRepsStr, machineConfig);

  if (analysis.hasData && analysis.setRecommendations[setNum]) {
    return analysis.setRecommendations[setNum];
  }

  // Fallback para series nuevas o añadidas
  const w = parseFloat(fallbackWeight || analysis.anchorWeight || 0);
  const r = parseFloat(fallbackReps || 10);
  if (w <= 0 && r <= 0) return null;

  const inc = analysis.increment || 2.5;
  const targetW = analysis.isExcessiveLoad
    ? (analysis.adjustedLoad || analysis.anchorWeight || w)
    : (analysis.anchorWeight > 0 ? analysis.anchorWeight : w);

  return {
    suggestedWeight: targetW,
    suggestedReps: r,
    targetText: `Meta: ${targetW} lbs × ${r} reps`,
    shortText: `Meta: ${targetW}# × ${r}r`,
    note: analysis.isExcessiveLoad ? 'Carga ajustada para el rango de hipertrofia.' : 'Sigue la carga ancla establecida para el ejercicio.',
    type: 'maintain'
  };
}

export function calculateRelativeStrength(estimated1RM, bodyWeight) {
  const rm = parseFloat(estimated1RM) || 0;
  const bw = parseFloat(bodyWeight) || 0;
  if (rm <= 0 || bw <= 0) return 0;
  return parseFloat((rm / bw).toFixed(2));
}

