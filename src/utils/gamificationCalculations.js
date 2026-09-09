/**
 * MOTOR CIENTÍFICO DE GAMIFICACIÓN, COMPOSICIÓN CORPORAL Y PREDICTOR ADONIS
 * Integra datos reales de báscula de bioimpedancia (peso, grasa %, grasa kg, músculo esquelético %,
 * músculo kg, masa magra, agua, grasa visceral, BMR, proteína, edad metabólica) y medidas corporales.
 */

export const ADONIS_RANKS = [
  { minLevel: 1, title: 'Iniciado del V-Taper', color: '#64748b', badge: '🥉', bg: '#f1f5f9' },
  { minLevel: 5, title: 'Guerrero de Hipertrofia', color: '#0284c7', badge: '🥈', bg: '#e0f2fe' },
  { minLevel: 10, title: 'Escultor de Adonis', color: '#059669', badge: '🥇', bg: '#dcfce7' },
  { minLevel: 18, title: 'Titán Mecánico', color: '#7c3aed', badge: '💎', bg: '#f3e8ff' },
  { minLevel: 28, title: 'Maestro de la Tensión', color: '#d97706', badge: '👑', bg: '#fef3c7' },
  { minLevel: 40, title: 'Semidiós del Protocolo', color: '#e11d48', badge: '🔥', bg: '#ffe4e6' }
];

export function getRankForLevel(level) {
  for (let i = ADONIS_RANKS.length - 1; i >= 0; i--) {
    if (level >= ADONIS_RANKS[i].minLevel) {
      return ADONIS_RANKS[i];
    }
  }
  return ADONIS_RANKS[0];
}

export function getXpForLevel(level) {
  if (level <= 1) return 0;
  return Math.round(120 * Math.pow(level - 1, 1.7));
}

export function getLevelFromXp(xp) {
  if (!xp || xp <= 0) return 1;
  let lvl = 1;
  while (getXpForLevel(lvl + 1) <= xp) {
    lvl++;
  }
  return lvl;
}

/**
 * Normaliza y deduce automáticamente las métricas de la báscula de bioimpedancia
 * Autocompleta campos faltantes usando relaciones fisiológicas estrictas
 */
export function normalizeBodyComposition(raw = {}) {
  const weightKg = parseFloat(raw.weightKg || raw.weight || 75);
  const heightCm = parseFloat(raw.heightCm || raw.height || 175);
  
  // BMI: Peso / (Altura en m)^2
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? Math.round((weightKg / (heightM * heightM)) * 10) / 10 : 24.5;

  // Porcentaje y peso de grasa
  let bodyFatPct = parseFloat(raw.bodyFatPct);
  let fatMassKg = parseFloat(raw.fatMassKg);

  if (!isNaN(bodyFatPct) && isNaN(fatMassKg)) {
    fatMassKg = Math.round((weightKg * (bodyFatPct / 100)) * 10) / 10;
  } else if (!isNaN(fatMassKg) && isNaN(bodyFatPct) && weightKg > 0) {
    bodyFatPct = Math.round(((fatMassKg / weightKg) * 100) * 10) / 10;
  } else if (isNaN(bodyFatPct) && isNaN(fatMassKg)) {
    bodyFatPct = 18.0; // Valor por defecto
    fatMassKg = Math.round((weightKg * 0.18) * 10) / 10;
  }

  // Masa libre de grasa (FFM / LBM)
  let fatFreeMassKg = parseFloat(raw.fatFreeMassKg);
  if (isNaN(fatFreeMassKg) || fatFreeMassKg <= 0) {
    fatFreeMassKg = Math.round((weightKg - fatMassKg) * 10) / 10;
  }

  // Masa muscular esquelética (SMM)
  let skeletalMuscleKg = parseFloat(raw.skeletalMuscleKg);
  let skeletalMusclePct = parseFloat(raw.skeletalMusclePct);

  if (!isNaN(skeletalMusclePct) && isNaN(skeletalMuscleKg)) {
    skeletalMuscleKg = Math.round((weightKg * (skeletalMusclePct / 100)) * 10) / 10;
  } else if (!isNaN(skeletalMuscleKg) && isNaN(skeletalMusclePct) && weightKg > 0) {
    skeletalMusclePct = Math.round(((skeletalMuscleKg / weightKg) * 100) * 10) / 10;
  } else if (isNaN(skeletalMuscleKg) && isNaN(skeletalMusclePct)) {
    // Típicamente el músculo esquelético representa ~54-58% de la masa magra en hombres
    skeletalMuscleKg = Math.round((fatFreeMassKg * 0.55) * 10) / 10;
    skeletalMusclePct = Math.round(((skeletalMuscleKg / weightKg) * 100) * 10) / 10;
  }

  // Agua corporal
  let waterPct = parseFloat(raw.waterPct);
  let waterKg = parseFloat(raw.waterKg);
  if (!isNaN(waterPct) && isNaN(waterKg)) {
    waterKg = Math.round((weightKg * (waterPct / 100)) * 10) / 10;
  } else if (!isNaN(waterKg) && isNaN(waterPct) && weightKg > 0) {
    waterPct = Math.round(((waterKg / weightKg) * 100) * 10) / 10;
  } else if (isNaN(waterPct) && isNaN(waterKg)) {
    waterPct = 56.0;
    waterKg = Math.round((weightKg * 0.56) * 10) / 10;
  }

  // Tasa metabólica basal (BMR) - Katch-McArdle si no se provee
  let bmr = parseFloat(raw.bmr);
  if (isNaN(bmr) || bmr <= 0) {
    bmr = Math.round(370 + (21.6 * fatFreeMassKg));
  }

  // Otras métricas
  const visceralFat = parseFloat(raw.visceralFat) || 6;
  const boneMassKg = parseFloat(raw.boneMassKg) || Math.round((fatFreeMassKg * 0.065) * 10) / 10;
  const proteinPct = parseFloat(raw.proteinPct) || 17.5;
  const obesityDegreePct = parseFloat(raw.obesityDegreePct) || Math.round(((weightKg / (22 * heightM * heightM) - 1) * 100) * 10) / 10;
  const metabolicAge = parseInt(raw.metabolicAge, 10) || parseInt(raw.realAge, 10) || 26;
  const realAge = parseInt(raw.realAge, 10) || 28;

  // Medidas corporales (Cinta métrica) - NO inventar datos si el usuario no los midió
  const waistCm = !isNaN(parseFloat(raw.waistCm)) && parseFloat(raw.waistCm) > 0 ? parseFloat(raw.waistCm) : null;
  const shouldersCm = !isNaN(parseFloat(raw.shouldersCm)) && parseFloat(raw.shouldersCm) > 0 ? parseFloat(raw.shouldersCm) : null;
  const chestCm = !isNaN(parseFloat(raw.chestCm)) && parseFloat(raw.chestCm) > 0 ? parseFloat(raw.chestCm) : null;
  const armsCm = !isNaN(parseFloat(raw.armsCm)) && parseFloat(raw.armsCm) > 0 ? parseFloat(raw.armsCm) : null;

  // Ratio Adonis (Hombros / Cintura) - Solo calcular si existen medidas reales con cinta
  const hasTapeMeasurements = Boolean(waistCm && shouldersCm);
  const adonisRatio = hasTapeMeasurements ? Math.round((shouldersCm / waistCm) * 1000) / 1000 : null;
  const adonisTargetRatio = 1.618;
  const adonisScorePercent = adonisRatio ? Math.min(100, Math.round((adonisRatio / adonisTargetRatio) * 100)) : null;

  return {
    weightKg,
    heightCm,
    bmi,
    bodyFatPct,
    fatMassKg,
    fatFreeMassKg,
    skeletalMuscleKg,
    skeletalMusclePct,
    waterPct,
    waterKg,
    bmr,
    visceralFat,
    boneMassKg,
    proteinPct,
    obesityDegreePct,
    metabolicAge,
    realAge,
    waistCm,
    shouldersCm,
    chestCm,
    armsCm,
    hasTapeMeasurements,
    adonisRatio,
    adonisTargetRatio,
    adonisScorePercent
  };
}

/**
 * Predictor Científico Integral de Tiempo hacia el Cuerpo Ideal Adonis
 * Periodización en 2 Fases Fisiológicas:
 * Fase 1: Reducción Visceral & Definición Prioritaria (bajar grasa a ritmo seguro ~0.5kg/sem para desinflamar y recuperar edad metabólica).
 * Fase 2: Consolidación y Ganancia Muscular Limpia hacia el V-Taper Adonis.
 */
export function calculateTruePhysiqueProjection(compData = {}, goalSettings = {}, weeklyWorkouts = 4, overloadCount = 0) {
  const current = normalizeBodyComposition(compData);

  // Peso ideal recomendado según estatura si el usuario no ha especificado uno
  // Para hombres atléticos al 12% de grasa: (Estatura en cm - 102) ej. 174cm -> 72.0 kg
  const defaultIdealWeight = Math.max(60, Math.round((current.heightCm - 102) * 10) / 10);
  
  let targetWeightKg = defaultIdealWeight;
  const rawTargetWeight = parseFloat(goalSettings.targetWeightKg || goalSettings.idealWeightKg);
  if (!isNaN(rawTargetWeight) && rawTargetWeight > 0) {
    targetWeightKg = rawTargetWeight;
  }

  const targetFatPct = (!isNaN(parseFloat(goalSettings.targetFatPct))) ? parseFloat(goalSettings.targetFatPct) : 12.0;
  const goalType = goalSettings.goalType || 'recomposition';

  // Grasa meta en kg según el peso deseado
  const targetFatMassKg = Math.round((targetWeightKg * (targetFatPct / 100)) * 10) / 10;

  // Masa libre de grasa meta necesaria para pesar targetWeightKg al targetFatPct%
  const targetFatFreeMassKg = Math.round((targetWeightKg - targetFatMassKg) * 10) / 10;

  // Grasa a oxidar
  const fatToLoseKg = Math.max(0, Math.round((current.fatMassKg - targetFatMassKg) * 10) / 10);

  // Músculo a ganar a largo plazo
  let muscleToGainKg = Math.max(0, Math.round((targetFatFreeMassKg - current.fatFreeMassKg) * 10) / 10);
  if (!isNaN(parseFloat(goalSettings.muscleGainTargetKg))) {
    muscleToGainKg = Math.max(muscleToGainKg, parseFloat(goalSettings.muscleGainTargetKg));
  }

  // Factor de adherencia semanal al gimnasio (3 a 5 días, base 4 días de split Adonis)
  const adherenceFactor = Math.max(0.7, Math.min(1.2, (weeklyWorkouts || 4) / 4.5));

  // 1. Fase 1: Pérdida de grasa a ritmo seguro y clínicamente sostenible (0.50 kg/semana = ~500 kcal déficit/día)
  const weeklyFatLossRateKg = Math.round((0.50 * adherenceFactor) * 100) / 100;
  const phase1Weeks = fatToLoseKg > 0 ? Math.max(4, Math.round(fatToLoseKg / weeklyFatLossRateKg)) : 0;
  const weeksForFatLoss = phase1Weeks;

  // 2. Hipertrofia Magra a largo plazo (Modelo Casey Butt / Alan Aragon: ~0.08 kg/semana)
  const overloadFactor = Math.min(1.2, 1.0 + (overloadCount * 0.01));
  const weeklyMuscleGainRateKg = Math.round((0.075 * adherenceFactor * overloadFactor) * 1000) / 1000;
  const weeksForMuscleGain = muscleToGainKg > 0 ? Math.round(muscleToGainKg / weeklyMuscleGainRateKg) : 0;

  // Semanas proyectadas para la FASE ACTUAL
  // Si la grasa está por encima del 16% y la grasa visceral está elevada, la FASE 1 es el hito primordial
  let totalEstimatedWeeks = phase1Weeks;
  if (goalType === 'bulk') {
    totalEstimatedWeeks = Math.max(8, weeksForMuscleGain);
  } else if (goalType === 'recomposition') {
    // Recomposición: hito principal de definición de Fase 1
    totalEstimatedWeeks = phase1Weeks > 0 ? phase1Weeks : Math.max(8, weeksForMuscleGain);
  } else {
    // cut
    totalEstimatedWeeks = phase1Weeks;
  }

  // Semanas óptimas si entrena 5 días consistentes
  const optimalWeeks = Math.max(4, Math.round(totalEstimatedWeeks * 0.8));
  const savedWeeks = Math.max(0, totalEstimatedWeeks - optimalWeeks);

  // Porcentaje de avance hacia la meta compuesta
  const totalGoalDelta = fatToLoseKg + muscleToGainKg;
  const progressPercent = totalGoalDelta > 0 
    ? Math.max(20, Math.min(95, Math.round((1 - (fatToLoseKg + (muscleToGainKg * 0.5)) / (fatToLoseKg + muscleToGainKg + 6)) * 100)))
    : 95;

  return {
    current,
    targetFatPct,
    muscleGainTargetKg: muscleToGainKg,
    muscleToGainKg,
    goalType,
    idealWeightKg: targetWeightKg,
    targetWeightKg,
    targetFatMassKg,
    targetFatFreeMassKg,
    fatToLoseKg,
    muscleToGainKg,
    phase1Weeks,
    weeksForFatLoss,
    weeksForMuscleGain,
    totalEstimatedWeeks,
    estimatedWeeks: totalEstimatedWeeks,
    projectedWeeks: totalEstimatedWeeks,
    optimalWeeks,
    savedWeeks,
    progressPercent,
    weeklyFatLossRateKg,
    weeklyMuscleGainRateKg,
    weeklyWorkouts: weeklyWorkouts || 3
  };
}

export function calculatePhysiqueProjection(arg1, arg2, arg3, arg4) {
  if (typeof arg1 === 'number') {
    const currentWeightKg = arg1;
    const targetWeightKg = typeof arg2 === 'number' ? arg2 : 75;
    const goalType = typeof arg3 === 'string' ? arg3 : 'recomposition';
    const weeklyWorkouts = typeof arg4 === 'number' ? arg4 : 4;
    return calculateTruePhysiqueProjection(
      { weightKg: currentWeightKg },
      { targetWeightKg, goalType },
      weeklyWorkouts
    );
  }
  return calculateTruePhysiqueProjection(arg1, arg2, arg3, arg4);
}


