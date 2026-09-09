/**
 * Motor Fisiológico Científico de Gasto Energético (Kcal) para Entrenamiento de Fuerza y Cardio
 * Basado en:
 * 1. Trabajo Mecánico Externo (W = F * d) y Eficiencia Muscular Humana (~22%).
 * 2. Costo Metabólico Activo por Tipo de Ejercicio (METs específicos por masa muscular).
 * 3. Resíntesis Fosfágena (ATP-PCr) durante los descansos intra-serie (VO2 de recuperación).
 * 4. Cardio Zona 2 Específico (Bicicleta Ergómetro, Caminadora Inclinada, Elíptica).
 * 5. Consumo de Oxígeno Post-Ejercicio (EPOC) para hipertrofia con sobrecarga.
 */

// Categorización biomecánica y metabólica por patrones de movimiento y masa muscular reclutada
const MOVEMENT_METRICS = {
  heavy_lower_compound: {
    name: 'Compuesto Tren Inferior (Sentadilla, Prensa, Hack, RDL, Hip Thrust)',
    met: 8.5,
    displacementMeters: 0.65, // Recorrido medio en sentadilla, prensa, hack
    restSeconds: 120
  },
  upper_compound: {
    name: 'Compuesto Torso (Press Banca, Remo, Jalón, Dominadas, Militar, Fondos)',
    met: 6.5,
    displacementMeters: 0.48, // Recorrido medio en press banca, jalón, remo
    restSeconds: 90
  },
  heavy_lower_isolation: {
    name: 'Aislamiento Tren Inferior (Extensión Cuádriceps, Curl Femoral, Pantorrilla)',
    met: 5.2,
    displacementMeters: 0.38,
    restSeconds: 80
  },
  upper_isolation: {
    name: 'Aislamiento Monoarticular Torso/Brazo (Bíceps, Tríceps, Elevaciones Laterales)',
    met: 4.0,
    displacementMeters: 0.32,
    restSeconds: 70
  }
};

/**
 * Determina el patrón de movimiento de un ejercicio según su nombre y grupo muscular
 */
export function classifyExercisePattern(exerciseName = '', muscleGroup = '') {
  const name = exerciseName.toLowerCase();
  const muscle = muscleGroup.toLowerCase();

  // 1. Compuestos pesados de tren inferior (máxima demanda metabólica sistémica)
  if (
    name.includes('prensa') ||
    name.includes('hack') ||
    name.includes('sentadilla') ||
    name.includes('squat') ||
    name.includes('peso muerto') ||
    name.includes('rdl') ||
    name.includes('zancada') ||
    name.includes('búlgara') ||
    name.includes('hip thrust') ||
    (muscle.includes('cuádriceps') && (name.includes('press') || name.includes('prensa'))) ||
    (muscle.includes('glúteo') && name.includes('thrust'))
  ) {
    return 'heavy_lower_compound';
  }

  // 2. Compuestos de torso
  if (
    name.includes('press banca') ||
    name.includes('press pecho') ||
    name.includes('press militar') ||
    name.includes('press hombro') ||
    name.includes('jalón') ||
    name.includes('lat pulldown') ||
    name.includes('remo') ||
    name.includes('dominada') ||
    name.includes('fondos') ||
    name.includes('dips') ||
    (muscle.includes('pecho') && !name.includes('aperturas') && !name.includes('cruce')) ||
    (muscle.includes('espalda') && !name.includes('pullover'))
  ) {
    return 'upper_compound';
  }

  // 3. Aislamiento tren inferior (demanda metabólica mayor que brazos por tamaño de fémur/cuádriceps)
  if (
    name.includes('extension') ||
    name.includes('extensión') ||
    name.includes('curl femoral') ||
    name.includes('flexión femorales') ||
    name.includes('pantorrilla') ||
    name.includes('soleo') ||
    name.includes('abduccion') ||
    name.includes('abducción') ||
    muscle.includes('cuádriceps') ||
    muscle.includes('isquiotibiales') ||
    muscle.includes('gemelos')
  ) {
    return 'heavy_lower_isolation';
  }

  // 4. Aislamiento de torso / brazo por defecto
  return 'upper_isolation';
}

/**
 * Calcula las calorías gastadas en una serie individual de pesas
 */
export function calculateSetCalories(weightLbs, reps, patternKey, userWeightKg = 78.55) {
  const pattern = MOVEMENT_METRICS[patternKey] || MOVEMENT_METRICS.upper_isolation;
  const numReps = Math.max(1, parseInt(reps, 10) || 8);
  const numWeightLbs = Math.max(0, parseFloat(weightLbs) || 0);

  // Conversión de lbs a kg
  const massKg = numWeightLbs * 0.45359237;

  // 1. Trabajo Mecánico Externo (W = m * g * d * reps) en Julios
  const mechanicalWorkJoules = massKg * 9.80665 * pattern.displacementMeters * numReps;

  // 2. Gasto Metabólico Mecánico (~22% de eficiencia muscular humana)
  const mechanicalKcal = mechanicalWorkJoules / (4184 * 0.22);

  // 3. Gasto Metabólico Activo durante la ejecución de la serie (3.0s por rep controlada)
  const setDurationMinutes = (numReps * 3.0) / 60;
  const activeMetabolicKcal = ((pattern.met * 3.5 * userWeightKg) / 200) * setDurationMinutes;

  // 4. Gasto en Pausa Intra-Serie (Resíntesis ATP-PCr y aclaramiento a 2.5 METs)
  const restMinutes = pattern.restSeconds / 60;
  const restRecoveryKcal = ((2.5 * 3.5 * userWeightKg) / 200) * restMinutes;

  const totalSetKcal = mechanicalKcal + activeMetabolicKcal + restRecoveryKcal;

  return {
    mechanicalKcal: Math.round(mechanicalKcal * 100) / 100,
    activeMetabolicKcal: Math.round(activeMetabolicKcal * 100) / 100,
    restRecoveryKcal: Math.round(restRecoveryKcal * 100) / 100,
    totalSetKcal: Math.round(totalSetKcal * 100) / 100
  };
}

/**
 * Calcula las calorías gastadas en la sesión de cardio Zona 2
 * Implementa las Ecuaciones Metabólicas del American College of Sports Medicine (ACSM):
 * 1. Caminadora con inclinación: VO2 = 3.5 + 0.1*S + 1.8*S*Grade
 * 2. Cicloergómetro: VO2 = 7.0 + (11.012 * Watts) / peso
 * 3. Elíptica de tren inferior (sólo piernas, sin brazos)
 * 4. Calibración y Consenso con la sesión de cardio del reloj inteligente
 */
export function calculateCardioCalories(cardioData = {}, userWeightKg = 78.55) {
  if (!cardioData || (!cardioData.completed && !cardioData.duration && !cardioData.machine)) {
    return { cardioKcal: 0, durationMinutes: 0 };
  }

  const durationMinutes = parseFloat(cardioData.duration !== undefined ? cardioData.duration : 30) || 0;
  if (durationMinutes <= 0) {
    return { cardioKcal: 0, durationMinutes: 0 };
  }

  const rawMachine = (cardioData.machine || '').toLowerCase();
  const machineType = cardioData.machineType || 
    (rawMachine.includes('caminadora') ? 'treadmill' :
     rawMachine.includes('elíptica') || rawMachine.includes('eliptica') ? 'elliptical' : 'bike');

  let acsmKcal = 0;
  let met = 6.5;
  let distanceKm = parseFloat(cardioData.distanceKm || cardioData.distance) || 0;
  let elevationMeters = 0;

  if (machineType === 'treadmill') {
    const speedKmh = parseFloat(cardioData.speedKmh || cardioData.speed || 4.5) || 4.5;
    const inclinePct = parseFloat(cardioData.inclinePct !== undefined ? cardioData.inclinePct : (cardioData.incline || 10)) || 10;
    const speedMPerMin = (speedKmh * 1000) / 60;
    const gradeDecimal = Math.max(0, inclinePct / 100);
    
    // ACSM Walking Equation (Incline Treadmill)
    // VO2 = 3.5 + (0.1 * S) + (1.8 * S * G)
    const vo2 = 3.5 + (0.1 * speedMPerMin) + (1.8 * speedMPerMin * gradeDecimal);
    met = vo2 / 3.5;
    // Gasto por minuto: (VO2 * kg / 1000) * 4.95 kcal (RER 0.82-0.85 Zona 2)
    acsmKcal = ((vo2 * userWeightKg) / 1000) * 4.95 * durationMinutes;
    
    if (distanceKm <= 0) {
      distanceKm = Math.round((speedKmh * (durationMinutes / 60)) * 100) / 100;
    }
    elevationMeters = Math.round(distanceKm * 1000 * gradeDecimal);
  } else if (machineType === 'bike') {
    const resistance = parseFloat(cardioData.resistanceLevel || 6) || 6;
    const rpm = parseFloat(cardioData.cadenceRpm || 72) || 72;
    const avgSpeedKmh = parseFloat(cardioData.avgSpeedKmh || cardioData.speed || 22) || 22;
    
    // Potencia mecánica en Watts estimada o directa
    const watts = parseFloat(cardioData.watts) || Math.max(50, Math.min(260, (resistance * 14) + ((rpm - 50) * 1.5)));
    // ACSM Leg Ergometry: VO2 = 7.0 + (11.012 * Watts) / weightKg
    const vo2 = 7.0 + ((11.012 * watts) / userWeightKg);
    met = vo2 / 3.5;
    acsmKcal = ((met * 3.5 * userWeightKg) / 200) * durationMinutes;
    
    if (distanceKm <= 0) {
      distanceKm = Math.round((avgSpeedKmh * (durationMinutes / 60)) * 100) / 100;
    }
  } else if (machineType === 'elliptical') {
    const resistance = parseFloat(cardioData.resistanceLevel || 5) || 5;
    const spm = parseFloat(cardioData.stridesPerMin || 60) || 60;
    // Elíptica de tren inferior (manos fijas / sin balanceo de brazos, descuento del 16%)
    const baseMet = 5.2 + (resistance * 0.22) + ((spm - 50) * 0.03);
    met = Math.max(4.5, Math.min(8.5, baseMet));
    acsmKcal = ((met * 3.5 * userWeightKg) / 200) * durationMinutes;
    
    if (distanceKm <= 0) {
      distanceKm = Math.round(((spm * 2 * 0.5 * durationMinutes) / 1000) * 100) / 100;
    }
  }

  // Sesión específica de cardio del Smartwatch
  const watchKcalRaw = parseFloat(cardioData.watchCalories || cardioData.watch?.watchCalories);
  const hrAvg = parseInt(cardioData.heartRate || cardioData.watch?.avgHeartRate, 10);
  let watchKcal = !isNaN(watchKcalRaw) && watchKcalRaw > 0 ? watchKcalRaw : null;
  
  if (!watchKcal && !isNaN(hrAvg) && hrAvg > 80) {
    // Ecuación de Keytel aeróbica continua
    const age = 28;
    const keytelMin = ((-55.0969 + (0.6309 * hrAvg) + (0.1988 * userWeightKg) + (0.2017 * age)) / 4.184);
    watchKcal = Math.max(0, keytelMin * durationMinutes);
  }

  // Calorías reportadas por la consola de la máquina
  const machineKcal = parseFloat(cardioData.machineCalories || cardioData.machineKcal) || null;

  // Consenso Científico (50% Física ACSM + 50% Pulso Cardíaco del Reloj)
  let consensusKcal = acsmKcal;
  if (watchKcal && acsmKcal) {
    consensusKcal = (acsmKcal * 0.50) + (watchKcal * 0.50);
  } else if (watchKcal) {
    consensusKcal = watchKcal;
  }

  // Modo de calibración elegido por el usuario
  const mode = cardioData.calibrationMode || 'consensus';
  let finalKcal = consensusKcal;
  if (mode === 'acsm') finalKcal = acsmKcal;
  else if (mode === 'watch' && watchKcal) finalKcal = watchKcal;
  else if (mode === 'machine' && machineKcal) finalKcal = machineKcal;

  // Diagnóstico de Zona 2 (FATmax)
  let zone2Status = 'unknown';
  if (!isNaN(hrAvg) && hrAvg > 0) {
    if (hrAvg >= 118 && hrAvg <= 138) zone2Status = 'optimal';
    else if (hrAvg > 138) zone2Status = 'high';
    else zone2Status = 'low';
  }

  return {
    cardioKcal: Math.round(finalKcal),
    durationMinutes,
    acsmKcal: Math.round(acsmKcal),
    watchKcal: watchKcal ? Math.round(watchKcal) : null,
    machineKcal: machineKcal ? Math.round(machineKcal) : null,
    consensusKcal: Math.round(consensusKcal),
    met: Math.round(met * 10) / 10,
    distanceKm: Math.round(distanceKm * 100) / 100,
    elevationMeters,
    zone2Status,
    machineType
  };
}

/**
 * Función principal que calcula el gasto energético total de una sesión de entrenamiento
 * Incorpora la duración real transcurrida si está disponible para calibrar pausas prolongadas.
 */
export function calculateWorkoutCalories(
  workoutExercises = {}, 
  userWeightKg = 78.55, 
  definitionsMap = {}, 
  actualDurationMinutes = null,
  smartwatchKcal = null
) {
  let strengthMechanicalKcal = 0;
  let strengthActiveKcal = 0;
  let strengthRestKcal = 0;
  let completedSetsCount = 0;
  let cardioKcal = 0;
  let cardioMinutes = 0;
  let cardioDataFound = null;

  if (!workoutExercises || typeof workoutExercises !== 'object') {
    return {
      strengthKcal: 0,
      cardioKcal: 0,
      epocKcal: 0,
      totalKcal: 0,
      completedSetsCount: 0,
      durationMinutes: 0,
      smartwatchKcal: null,
      blendedKcal: 0,
      displayKcal: 0
    };
  }

  Object.keys(workoutExercises).forEach(exId => {
    const exData = workoutExercises[exId];
    if (!exData) return;

    // Detectar si es un bloque de cardio
    if (exData.isCardio || exData.machine || exData.cardioDone || exId.includes('cardio')) {
      cardioDataFound = exData;
      return;
    }

    const def = definitionsMap[exId] || {};
    const exName = exData.name || def.name || exId;
    const muscleGroup = exData.muscleGroup || def.muscleGroup || '';
    const patternKey = classifyExercisePattern(exName, muscleGroup);

    // Recorrer todas las series del ejercicio
    Object.keys(exData).forEach(key => {
      if (!isNaN(parseInt(key, 10))) {
        const setObj = exData[key];
        if (setObj && setObj.completed) {
          completedSetsCount++;
          const setCalc = calculateSetCalories(setObj.weight, setObj.reps, patternKey, userWeightKg);
          strengthMechanicalKcal += setCalc.mechanicalKcal;
          strengthActiveKcal += setCalc.activeMetabolicKcal;
          strengthRestKcal += setCalc.restRecoveryKcal;
        }
      }
    });
  });

  // Calcular cardio si se realizó
  if (cardioDataFound) {
    const cardioRes = calculateCardioCalories(cardioDataFound, userWeightKg);
    cardioKcal = cardioRes.cardioKcal;
    cardioMinutes = cardioRes.durationMinutes;
  }

  // Ajuste fisiológico por duración real del entrenamiento:
  // En el gimnasio, el atleta está de pie, cambiando discos, caminando entre estaciones (~2.8 METs)
  const nominalMinutes = Math.max(10, Math.round((completedSetsCount * 2.5) + cardioMinutes));
  let extraRestKcal = 0;
  let finalDurationMinutes = nominalMinutes;

  if (actualDurationMinutes && actualDurationMinutes > 0) {
    finalDurationMinutes = Math.round(actualDurationMinutes);
    if (finalDurationMinutes > nominalMinutes) {
      const extraMinutes = finalDurationMinutes - nominalMinutes;
      extraRestKcal = ((2.8 * 3.5 * userWeightKg) / 200) * extraMinutes;
      strengthRestKcal += extraRestKcal;
    }
  }

  // EPOC base (Excess Post-Exercise Oxygen Consumption)
  let epocFactor = 0.12;
  let cardiacKcal = 0;
  let isHeartRateCalibrated = false;
  let hrrPct = null;

  // Integración avanzada con Sensores Cardíacos de Smartwatch (Apple Watch, Garmin, Polar)
  let validWatchKcal = null;
  let watchHrAvg = null;
  let watchHrMax = null;
  let watchHrRest = null;

  if (smartwatchKcal) {
    if (typeof smartwatchKcal === 'object') {
      validWatchKcal = parseFloat(smartwatchKcal.watchKcal) || null;
      watchHrAvg = parseFloat(smartwatchKcal.hrAvg) || null;
      watchHrMax = parseFloat(smartwatchKcal.hrMax) || null;
      watchHrRest = parseFloat(smartwatchKcal.hrRest) || null;
    } else {
      const parsed = parseFloat(smartwatchKcal);
      if (!isNaN(parsed) && parsed > 0) validWatchKcal = Math.round(parsed);
    }
  }

  // Si hay FC Promedio registrada, aplicar el Modelo Fisiológico Keytel Modificado para Fuerza
  if (watchHrAvg && watchHrAvg >= 60 && watchHrAvg <= 220) {
    isHeartRateCalibrated = true;
    const effectiveAge = 26;
    const durMins = finalDurationMinutes || 45;

    // Ecuación de Keytel et al. (2005) para gasto bruto por FC
    const hrGrossPerMin = (-55.0969 + (0.6309 * watchHrAvg) + (0.1988 * userWeightKg) + (0.2017 * effectiveAge)) / 4.184;
    const grossCardiac = Math.max(0, hrGrossPerMin * durMins);

    // Factor de atenuación por resistencia (0.82) para descontar la taquicardia por reflejo presor/Valsalva
    cardiacKcal = Math.round(grossCardiac * 0.82);

    // Modulación de EPOC por FC Máxima
    if (watchHrMax) {
      if (watchHrMax >= 165) epocFactor = 0.16;
      else if (watchHrMax >= 150) epocFactor = 0.13;
      else epocFactor = 0.10;
    }

    // Cálculo de %HRR (Karvonen)
    if (watchHrRest && watchHrMax && watchHrMax > watchHrRest) {
      hrrPct = Math.round(((watchHrAvg - watchHrRest) / (watchHrMax - watchHrRest)) * 100);
    }
  }

  let strengthSubtotal = Math.round(strengthMechanicalKcal + strengthActiveKcal + strengthRestKcal);

  // Si tenemos calibración por FC, triangulamos el gasto mecánico con la respuesta hemodinámica
  if (isHeartRateCalibrated && cardiacKcal > 0) {
    // 55% costo hemodinámico/cardíaco corregido + 45% trabajo mecánico y recuperación neuromuscular
    strengthSubtotal = Math.round((cardiacKcal * 0.55) + (strengthSubtotal * 0.45));
  }

  const epocKcal = strengthSubtotal > 0 ? Math.round(strengthSubtotal * epocFactor) : 0;
  const totalKcal = strengthSubtotal + cardioKcal + epocKcal;

  // Si el usuario además ingresó las calorías nativas de su reloj, calculamos el promedio ponderado
  const blendedKcal = validWatchKcal ? Math.round((totalKcal * 0.6) + (validWatchKcal * 0.4)) : totalKcal;

  return {
    strengthKcal: strengthSubtotal,
    cardioKcal,
    epocKcal,
    totalKcal,
    cardiacKcal,
    isHeartRateCalibrated,
    hrrPct,
    watchHrAvg,
    watchHrMax,
    watchHrRest,
    smartwatchKcal: validWatchKcal,
    blendedKcal,
    displayKcal: validWatchKcal ? blendedKcal : totalKcal,
    isBlended: !!validWatchKcal || isHeartRateCalibrated,
    completedSetsCount,
    durationMinutes: finalDurationMinutes,
    breakdown: {
      mechanicalKcal: Math.round(strengthMechanicalKcal),
      activeKcal: Math.round(strengthActiveKcal),
      restRecoveryKcal: Math.round(strengthRestKcal),
      extraRestKcal: Math.round(extraRestKcal),
      cardioMinutes,
      durationMinutes: finalDurationMinutes
    }
  };
}
