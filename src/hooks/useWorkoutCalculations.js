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

  // 1. Buscar en la primera serie de trabajo de la sesión actual
  if (currentData[1]?.weight && !isNaN(parseFloat(currentData[1].weight))) {
    workingWeight = parseFloat(currentData[1].weight);
  }
  // 2. Si no, buscar en la sesión anterior
  else if (previousData[1]?.weight && !isNaN(parseFloat(previousData[1].weight))) {
    workingWeight = parseFloat(previousData[1].weight);
  }
  // 3. Si no, buscar el peso promedio de las series previas
  else {
    const prevWeights = Object.values(previousData)
      .map(s => parseFloat(s?.weight))
      .filter(w => !isNaN(w) && w > 0);
    if (prevWeights.length > 0) {
      workingWeight = Math.round(prevWeights.reduce((a, b) => a + b, 0) / prevWeights.length);
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
