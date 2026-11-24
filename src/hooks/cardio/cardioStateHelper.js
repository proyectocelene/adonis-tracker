export const EMPTY_EXERCISE_DATA = {};
export const DEFAULT_USER_WEIGHT_KG = 75.55;

export const cleanInputVal = (val, fallback = '') => {
  if (val === null || val === undefined || val === 'null' || val === 'undefined') return fallback;
  return String(val);
};

export function resolveInitialMachineType(exercise, exerciseData = EMPTY_EXERCISE_DATA) {
  if (exerciseData?.machineType) return exerciseData.machineType;
  const unifiedCode = exercise?.unifiedCode;
  const exName = exercise?.name?.toLowerCase() || '';
  const mName = exerciseData?.machine?.toLowerCase() || '';
  if (unifiedCode === '[CARD-ROW_HIIT_NEAT_01]' || exName.includes('remo') || mName.includes('remo')) {
    return 'rower';
  }
  if (mName.includes('bicicleta') || mName.includes('bike')) {
    return 'bike';
  }
  if (mName.includes('elíptica') || mName.includes('eliptica')) {
    return 'elliptical';
  }
  return 'treadmill';
}

export function resolveMachineLabel(machineType, rowOption, isDualPhase) {
  if (machineType === 'rower') {
    return rowOption === 'A'
      ? '🚣‍♂️ Máquina de Remo (Opción A Híbrida 35-40 min)'
      : '🚣‍♂️ Máquina de Remo (Opción B NEAT LISS 35 min)';
  }
  if (machineType === 'treadmill') {
    return isDualPhase ? '🏃‍♀️ Caminadora Inclinada (Bifásico 60m)' : '🏃‍♀️ Caminadora Inclinada (Zona 2)';
  }
  if (machineType === 'bike') {
    return '🚴‍♂️ Bicicleta Estática Ergómetro';
  }
  return '🚶‍♀️ Elíptica de Bajo Impacto (Solo Piernas)';
}

export function calculateEffectiveDuration({
  machineType,
  rowOption,
  rowPhase1Mins,
  rowPhase2Mins,
  rowLissMins,
  isDualPhase,
  phaseMinutesA,
  phaseMinutesB,
  duration
}) {
  if (machineType === 'rower') {
    return rowOption === 'A'
      ? (parseFloat(rowPhase1Mins) || 15) + (parseFloat(rowPhase2Mins) || 20)
      : (parseFloat(rowLissMins) || 35);
  }
  if (machineType === 'treadmill' && isDualPhase) {
    return (parseFloat(phaseMinutesA) || 0) + (parseFloat(phaseMinutesB) || 0);
  }
  return parseFloat(duration) || 0;
}

/**
 * Clasificador automático de Zona 2 basado en frecuencia cardíaca promedio del reloj.
 */
export function classifyHeartRateZone(watchHrAvg) {
  const hr = parseFloat(watchHrAvg);
  if (!hr || Number.isNaN(hr) || hr <= 0) return null;
  if (hr < 120) {
    return {
      zone: 'Z1',
      label: 'Zona 1 (Ligero)',
      advice: 'Puedes subir +1% inclinación o +0.2 km/h'
    };
  }
  if (hr <= 135) {
    return {
      zone: 'Z2',
      label: 'Zona 2 Óptima',
      advice: 'Rango lipolítico objetivo'
    };
  }
  return {
    zone: 'Z3+',
    label: 'Zona 3+ (Alta)',
    advice: 'Baja 1-2% inclinación o velocidad para cuidar recuperación'
  };
}

function parsePositiveInt(val) {
  if (val === null || val === undefined || val === '' || val === 'null' || val === 'undefined') return null;
  const n = Number(val);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

/**
 * Cálculo puro de caminadora inclinada Zona 2 (ACSM netas/brutas, pasos, elevación y modo reloj).
 */
export function calculateTreadmillMetrics({
  duration = 0,
  speedKmh = 4.0,
  inclinePct = 10,
  distanceKm = 0,
  userWeightKg = DEFAULT_USER_WEIGHT_KG,
  watchHrAvg = null,
  watchHrMax = null,
  watchSteps = null,
  watchKcal = null,
  machineCalories = null
} = {}) {
  const dur = Math.max(0, parseFloat(duration) || 0);
  const spd = Math.max(0, parseFloat(speedKmh) || 0);
  const inc = Math.max(0, parseFloat(inclinePct) || 0);
  const wt = Math.max(30, parseFloat(userWeightKg) || DEFAULT_USER_WEIGHT_KG);

  const v = (spd * 1000) / 60;
  const g = inc / 100;
  const vo2 = 3.5 + (0.1 * v) + (1.8 * v * g);

  const acsmGrossKcal = dur > 0 ? Math.round((vo2 * wt / 200) * dur) : 0;
  const acsmNetKcal = dur > 0 ? Math.max(0, Math.round(((vo2 - 3.5) * wt / 200) * dur)) : 0;

  const autoDistanceKm = Math.round((spd * (dur / 60)) * 100) / 100;
  const manualDist = parseFloat(distanceKm);
  const effectiveDistanceKm = manualDist > 0 ? Math.round(manualDist * 100) / 100 : autoDistanceKm;
  const elevationMeters = Math.round(effectiveDistanceKm * 1000 * g);

  const cadence = Math.max(80, Math.min(125, 92 + (spd - 3.5) * 18));
  const estimatedSteps = dur > 0 ? Math.round(dur * cadence) : 0;

  const parsedWatchSteps = parsePositiveInt(watchSteps);
  const parsedHrAvg = parsePositiveInt(watchHrAvg);
  const parsedHrMax = parsePositiveInt(watchHrMax);
  const parsedWatchKcal = parsePositiveInt(watchKcal);
  const parsedMachineKcal = parsePositiveInt(machineCalories);

  const effectiveSteps = parsedWatchSteps || estimatedSteps;
  const stepsSource = parsedWatchSteps ? 'watch' : 'estimated';

  const hasWatchData = Boolean(parsedHrAvg || parsedHrMax || parsedWatchSteps || parsedWatchKcal);
  const dataSource = hasWatchData ? 'treadmill_and_watch' : 'treadmill_only';
  const zoneInfo = classifyHeartRateZone(parsedHrAvg);

  return {
    cardioKcal: acsmNetKcal,
    calculatedKcal: acsmNetKcal,
    acsmKcal: acsmNetKcal,
    acsmNetKcal,
    acsmGrossKcal,
    durationMinutes: dur,
    distanceKm: effectiveDistanceKm,
    autoDistanceKm,
    elevationMeters,
    cadence: Math.round(cadence * 10) / 10,
    estimatedSteps,
    watchSteps: parsedWatchSteps,
    effectiveSteps,
    stepsSource,
    watchHrAvg: parsedHrAvg,
    watchHrMax: parsedHrMax,
    watchKcal: parsedWatchKcal,
    machineKcal: parsedMachineKcal,
    hasWatchData,
    dataSource,
    zoneInfo,
    met: Math.round((vo2 / 3.5) * 10) / 10,
    machineType: 'treadmill'
  };
}
