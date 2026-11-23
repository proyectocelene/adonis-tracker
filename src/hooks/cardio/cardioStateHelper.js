export const EMPTY_EXERCISE_DATA = {};

export const cleanInputVal = (val, fallback = '') => {
  if (val === null || val === undefined || val === 'null' || val === 'undefined') return fallback;
  return String(val);
};

export function resolveInitialMachineType(exercise, exerciseData = EMPTY_EXERCISE_DATA) {
  if (exerciseData.machineType) return exerciseData.machineType;
  const unifiedCode = exercise?.unifiedCode;
  const exName = exercise?.name?.toLowerCase() || '';
  const mName = exerciseData.machine?.toLowerCase() || '';
  if (unifiedCode === '[CARD-ROW_HIIT_NEAT_01]' || exName.includes('remo') || mName.includes('remo')) {
    return 'rower';
  }
  if (mName.includes('caminadora')) {
    return 'treadmill';
  }
  if (mName.includes('elíptica') || mName.includes('eliptica')) {
    return 'elliptical';
  }
  return 'bike';
}

export function resolveMachineLabel(machineType, rowOption, isDualPhase) {
  if (machineType === 'rower') {
    return rowOption === 'A' 
      ? '🚣‍♂️ Máquina de Remo (Opción A Híbrida 35-40 min)' 
      : '🚣‍♂️ Máquina de Remo (Opción B NEAT LISS 35 min)';
  }
  if (machineType === 'treadmill') {
    return isDualPhase ? '🏃‍♀️ Caminadora Inclinada (Bifásico 60m)' : '🏃‍♀️ Caminadora Inclinada';
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
  return (parseFloat(duration) || 0);
}
