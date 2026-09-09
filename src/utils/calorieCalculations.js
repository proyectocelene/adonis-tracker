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
 */
export function calculateCardioCalories(cardioData = {}, userWeightKg = 78.55) {
  if (!cardioData || (!cardioData.completed && !cardioData.duration && !cardioData.machine)) {
    return { cardioKcal: 0, durationMinutes: 0 };
  }

  const durationMinutes = parseFloat(cardioData.duration !== undefined ? cardioData.duration : 35) || 0;
  if (durationMinutes <= 0) {
    return { cardioKcal: 0, durationMinutes: 0 };
  }

  const machineName = (cardioData.machine || '').toLowerCase();

  // Determinación de METs según máquina y configuración
  let met = 6.5; // Bicicleta estática moderada por defecto (Zona 2)
  if (machineName.includes('caminadora')) {
    // Caminadora inclinada (10-12% incl / 4.5 km/h) eleva significativamente el costo metabólico
    met = 7.5;
  } else if (machineName.includes('elíptica') || machineName.includes('eliptica')) {
    met = 6.5;
  } else if (machineName.includes('bicicleta') || machineName.includes('ergómetro')) {
    met = 6.5;
  }

  // Ajuste por frecuencia cardíaca si está registrada
  const hr = parseInt(cardioData.heartRate, 10);
  if (!isNaN(hr) && hr >= 115 && hr <= 140) {
    // Zona 2 óptima confirmada
    met = Math.min(8.0, met * 1.05);
  }

  const cardioKcal = Math.round(((met * 3.5 * userWeightKg) / 200) * durationMinutes);

  return {
    cardioKcal,
    durationMinutes,
    met
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

  const strengthSubtotal = Math.round(strengthMechanicalKcal + strengthActiveKcal + strengthRestKcal);

  // EPOC (Excess Post-Exercise Oxygen Consumption): ~12% en entrenamiento de hipertrofia
  const epocKcal = strengthSubtotal > 0 ? Math.round(strengthSubtotal * 0.12) : 0;

  const totalKcal = strengthSubtotal + cardioKcal + epocKcal;

  // Integración opcional con datos del reloj inteligente (Apple Watch, Garmin, Galaxy Watch)
  const parsedWatch = parseFloat(smartwatchKcal);
  const validWatchKcal = !isNaN(parsedWatch) && parsedWatch > 0 ? Math.round(parsedWatch) : null;
  const blendedKcal = validWatchKcal ? Math.round((totalKcal + validWatchKcal) / 2) : totalKcal;

  return {
    strengthKcal: strengthSubtotal,
    cardioKcal,
    epocKcal,
    totalKcal,
    smartwatchKcal: validWatchKcal,
    blendedKcal,
    displayKcal: validWatchKcal ? blendedKcal : totalKcal,
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
