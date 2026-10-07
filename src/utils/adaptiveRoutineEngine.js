// MOTOR DE RUTINAS ADAPTATIVAS Y DELOAD CLÍNICO
// Adonis Tracker / Coach V2 (Schoenfeld, Israetel, Helms)
// Proporciona:
// 1. Detección proactiva y reactiva de fatiga del SNC (Deload detection)
// 2. Reestructuración de microciclos de 6 días a 5, 4 y 3 días con preservación estricta de códigos canónicos
// 3. Control de expiración automática de overrides semanales (vencimiento los domingos a las 23:59)

import { scientificProtocol } from '../data/scientificProtocol.js';

/**
 * Evalúa el estado de fatiga acumulada para recomendar Deload (reactivo o proactivo).
 * @param {Array} workoutHistory - Historial de entrenamientos del usuario.
 * @param {number} currentWeek - Número de semana del mesociclo actual.
 * @returns {Object} { shouldDeloadProactive, shouldDeloadReactive, reason, averageRpe }
 */
export function detectFatigueStatus(workoutHistory = [], currentWeek = 1) {
  const isProactive = currentWeek >= 5 || (currentWeek > 0 && currentWeek % 5 === 0);

  // Filtrar las últimas sesiones completadas (no descanso ni faltas)
  const validSessions = (workoutHistory || [])
    .filter(s => s && !s.isRestDay && !s.isMissedDay && (s.completedSets > 0 || s.volume > 0 || s.isCompleted))
    .slice(-4)
    .reverse();

  let totalRpe = 0;
  let countRpe = 0;
  let highRpeDaysCount = 0;

  validSessions.forEach(session => {
    let sessionRpeSum = 0;
    let sessionRpeCount = 0;

    if (session.exercises && typeof session.exercises === 'object') {
      Object.values(session.exercises).forEach(ex => {
        if (ex && typeof ex === 'object') {
          Object.entries(ex).forEach(([key, set]) => {
            if (key !== 'machineConfig' && key !== 'feedback' && set && set.rpe) {
              const rpeVal = parseFloat(set.rpe);
              if (!isNaN(rpeVal) && rpeVal > 0) {
                sessionRpeSum += rpeVal;
                sessionRpeCount++;
              }
            }
          });
        }
      });
    }

    if (sessionRpeCount > 0) {
      const avgSessionRpe = sessionRpeSum / sessionRpeCount;
      totalRpe += avgSessionRpe;
      countRpe++;
      if (avgSessionRpe >= 9.2) {
        highRpeDaysCount++;
      }
    }
  });

  const averageRpe = countRpe > 0 ? parseFloat((totalRpe / countRpe).toFixed(1)) : 8.0;
  const isReactive = highRpeDaysCount >= 2 || (countRpe >= 2 && averageRpe >= 9.4);

  let reason = '';
  if (isReactive) {
    reason = `Fatiga acumulada alta detectada (RPE medio de ${averageRpe} en últimas sesiones). Tu SNC y articulaciones requieren una descarga para evitar estancamiento y sobreentrenamiento.`;
  } else if (isProactive) {
    reason = `Semana ${currentWeek} del mesociclo alcanzada. La periodización clínica recomienda programar una semana de descarga cada 4-6 semanas de sobrecarga intensa.`;
  }

  return {
    shouldDeloadProactive: isProactive,
    shouldDeloadReactive: isReactive,
    shouldHighlightDeload: isProactive || isReactive,
    reason,
    averageRpe
  };
}

/**
 * Genera la fecha de fin de la semana actual (Domingo 23:59:59.999 local).
 */
export function getEndOfWeekExpirationDate() {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1 = Lunes...
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntilSunday);
  sunday.setHours(23, 59, 59, 999);
  return sunday.toISOString();
}

/**
 * Crea un ciclo de descarga (Deload) que dura exactamente 7 días naturales (1 microciclo completo).
 * @param {number} currentWeek
 * @param {string} reason
 * @returns {Object}
 */
export function createDeloadCycle(currentWeek = 1, reason = '') {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7); // 7 días completos
  endDate.setHours(23, 59, 59, 999);

  return {
    isActive: true,
    weekNumber: currentWeek,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    durationDays: 7,
    reason: reason || 'Recuperación profunda del SNC y resensibilización muscular.',
    createdAt: new Date().toISOString()
  };
}

/**
 * Calcula el progreso exacto del Deload (días completados, sesiones, si finalizó).
 * @param {Object} deloadCycle
 * @param {Array} workoutHistory
 * @returns {Object}
 */
export function calculateDeloadProgress(deloadCycle, workoutHistory = []) {
  if (!deloadCycle || !deloadCycle.isActive) {
    return { isActive: false };
  }

  const now = new Date();
  const start = new Date(deloadCycle.startDate);
  const end = new Date(deloadCycle.endDate);

  const isExpired = now.getTime() > end.getTime();

  // Contar sesiones registradas durante la ventana del Deload
  const deloadSessions = (workoutHistory || []).filter(s => {
    if (!s || !s.date) return false;
    const sessionTime = new Date(`${s.date}T12:00:00`).getTime();
    return sessionTime >= start.getTime() && sessionTime <= end.getTime();
  });

  const completedDeloadWorkouts = deloadSessions.filter(s => !s.isRestDay && !s.isMissedDay && (s.completedSets > 0 || s.isDeloadSession)).length;

  const diffTime = Math.max(0, now.getTime() - start.getTime());
  const elapsedDays = Math.min(7, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
  const remainingDays = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.round((elapsedDays / 7) * 100));

  return {
    isActive: !isExpired,
    isCompleted: isExpired,
    elapsedDays,
    totalDays: 7,
    remainingDays,
    progressPercent,
    completedDeloadWorkouts,
    startDate: deloadCycle.startDate,
    endDate: deloadCycle.endDate,
    reason: deloadCycle.reason
  };
}

/**
 * Comprueba si un split override semanal sigue vigente o si ya expiró el domingo anterior.
 */
export function isSplitOverrideActive(overrideObj) {
  if (!overrideObj || !overrideObj.expiresAt) return false;
  const now = new Date().getTime();
  const expiresAt = new Date(overrideObj.expiresAt).getTime();
  return now <= expiresAt;
}

/**
 * Busca un ejercicio en la rutina base por su código unificado o ID.
 */
function findExerciseByCode(baseRoutine, unifiedCode, fallbackName) {
  for (const day of baseRoutine) {
    for (const ex of (day.exercises || [])) {
      if (ex.unifiedCode === unifiedCode) return JSON.parse(JSON.stringify(ex));
    }
  }
  return null;
}

/**
 * Construye dinámicamente un split adaptativo (5, 4 o 3 días) usando los ejercicios biomecánicos oficiales.
 * @param {'5_days'|'4_days'|'3_days'} targetSplit - Cantidad de días deseada.
 * @param {Array} baseRoutine - Rutina base activa o scientificProtocol.
 * @returns {Array} Nueva rutina con los 7 días de la semana reestructurados.
 */
export function generateAdaptiveSplit(targetSplit, baseRoutine = scientificProtocol) {
  const getEx = (code, fallback) => findExerciseByCode(baseRoutine, code) || fallback;

  // Ejercicios clave canónicos
  const chestPress = getEx('[PECH-CHEST_PRESS-CONV_01]', {
    id: 'ad_chest',
    unifiedCode: '[PECH-CHEST_PRESS-CONV_01]',
    name: 'Press de Pecho en Máquina Convergente (Chest Press)',
    sets: 3,
    reps: '8-10',
    restTime: '180 s'
  });

  const inclinePress = getEx('[PECH-INC_PRESS-NITRO_01]', {
    id: 'ad_inc',
    unifiedCode: '[PECH-INC_PRESS-NITRO_01]',
    name: 'Press Inclinado en Máquina (Nitro Incline)',
    sets: 3,
    reps: '8-10',
    restTime: '180 s'
  });

  const pecDeck = getEx('[PECH-PEC_DECK-STACK_01]', {
    id: 'ad_pecdeck',
    unifiedCode: '[PECH-PEC_DECK-STACK_01]',
    name: 'Aperturas en Máquina Pec Deck (Pec Deck / Flyes)',
    sets: 3,
    reps: '10-12',
    restTime: '120 s'
  });

  const overheadTri = getEx('[TRIC-OVERHEAD_EXT-CABLE_01]', {
    id: 'ad_tri_overhead',
    unifiedCode: '[TRIC-OVERHEAD_EXT-CABLE_01]',
    name: 'Extensión de Tríceps Copa en Polea (Overhead Triceps Extension)',
    sets: 3,
    reps: '10-12',
    restTime: '90 s'
  });

  const lateralRaise = getEx('[HOMB-LAT_RAISE-MAQ_01]', {
    id: 'ad_lat_raise',
    unifiedCode: '[HOMB-LAT_RAISE-MAQ_01]',
    name: 'Elevaciones Laterales en Máquina o Polea',
    sets: 3,
    reps: '12-15',
    restTime: '90 s'
  });

  const hackSquat = getEx('[CUAD-HACK_SQUAT-DISC_01]', {
    id: 'ad_hack',
    unifiedCode: '[CUAD-HACK_SQUAT-DISC_01]',
    name: 'Sentadilla en Máquina Hack (Hack Squat)',
    sets: 3,
    reps: '8-10',
    restTime: '180-240 s'
  });

  const legPress = getEx('[CUAD-LEG_PRESS-DISC_45_PB]', {
    id: 'ad_leg_press',
    unifiedCode: '[CUAD-LEG_PRESS-DISC_45_PB]',
    name: 'Prensa de Piernas 45° (Posición Central)',
    sets: 3,
    reps: '10-12',
    restTime: '180 s'
  });

  const legExt = getEx('[CUAD-LEG_EXT-STACK_01]', {
    id: 'ad_leg_ext',
    unifiedCode: '[CUAD-LEG_EXT-STACK_01]',
    name: 'Extensión de Cuádriceps en Máquina (Leg Extension)',
    sets: 3,
    reps: '10-12',
    restTime: '120 s'
  });

  const seatedLegCurl = getEx('[ISQU-LEG_CURL-SEATED_01]', {
    id: 'ad_leg_curl',
    unifiedCode: '[ISQU-LEG_CURL-SEATED_01]',
    name: 'Flexión de Femorales Sentado (Seated Leg Curl)',
    sets: 3,
    reps: '10-12',
    restTime: '120 s'
  });

  const rdlSmith = getEx('[ISQU-RDL-SMITH_01]', {
    id: 'ad_rdl',
    unifiedCode: '[ISQU-RDL-SMITH_01]',
    name: 'Peso Muerto Rumano (RDL) en Máquina Smith o Barra',
    sets: 3,
    reps: '8-10',
    restTime: '180-240 s'
  });

  const glutePress = getEx('[GLUT-LEG_PRESS-HIGH_FEET_45]', {
    id: 'ad_glute_press',
    unifiedCode: '[GLUT-LEG_PRESS-HIGH_FEET_45]',
    name: 'Prensa 45° (Pies Altos y Abiertos para Glúteo)',
    sets: 3,
    reps: '10-12',
    restTime: '180 s'
  });

  const calfRaise = getEx('[PANT-CALF_RAISE-MAQ_01]', {
    id: 'ad_calf',
    unifiedCode: '[PANT-CALF_RAISE-MAQ_01]',
    name: 'Elevación de Pantorrillas en Máquina (Pausa 2s Estiramiento)',
    sets: 3,
    reps: '12-15',
    restTime: '90 s'
  });

  const pulldownWide = getEx('[ESPA-PULLDOWN-WIDE_01]', {
    id: 'ad_pulldown',
    unifiedCode: '[ESPA-PULLDOWN-WIDE_01]',
    name: 'Jalón al Pecho en Polea (Agarre Ancho Pronado)',
    sets: 3,
    reps: '8-10',
    restTime: '180 s'
  });

  const machineRow = getEx('[ESPA-MACHINE_ROW-CHEST_SUPP_01]', {
    id: 'ad_row',
    unifiedCode: '[ESPA-MACHINE_ROW-CHEST_SUPP_01]',
    name: 'Remo Compuesto en Máquina (Apoyo al Pecho)',
    sets: 3,
    reps: '8-10',
    restTime: '180 s'
  });

  const pulloverCable = getEx('[ESPA-PULLOVER-HIGH_CABLE_01]', {
    id: 'ad_pullover',
    unifiedCode: '[ESPA-PULLOVER-HIGH_CABLE_01]',
    name: 'Pull-Over en Polea Alta con Cuerda',
    sets: 3,
    reps: '10-12',
    restTime: '120 s'
  });

  const bayesianCurl = getEx('[BICEP-CABLE_CURL-BAYESIAN_01]', {
    id: 'ad_bayesian',
    unifiedCode: '[BICEP-CABLE_CURL-BAYESIAN_01]',
    name: 'Bayesian Cable Curl (Estiramiento Humeral en Polea)',
    sets: 3,
    reps: '10-12',
    restTime: '90 s'
  });

  const facePull = getEx('[HOMB-FACE_PULL-HIGH_CABLE_01]', {
    id: 'ad_facepull',
    unifiedCode: '[HOMB-FACE_PULL-HIGH_CABLE_01]',
    name: 'Face Pulls en Polea Alta con Cuerda',
    sets: 3,
    reps: '12-15',
    restTime: '90 s'
  });

  const absCrunch = getEx('[ABDO-DECLINE_CRUNCH-DISC_01]', {
    id: 'ad_abs',
    unifiedCode: '[ABDO-DECLINE_CRUNCH-DISC_01]',
    name: 'Crunch Declinado con Disco (Decline Plate-Weighted Crunch)',
    sets: 3,
    reps: '12-15',
    restTime: '60 s'
  });

  const plank = getEx('[ABDO-PLANK-ISOM_01]', {
    id: 'ad_plank',
    unifiedCode: '[ABDO-PLANK-ISOM_01]',
    name: 'Plancha (Plank)',
    sets: 3,
    reps: '45-60 s',
    restTime: '60 s'
  });

  // ==========================================
  // SPLIT 5 DÍAS: PPL + UPPER / LOWER HÍBRIDO
  // ==========================================
  if (targetSplit === '5_days') {
    return [
      {
        id: 'd1',
        dayNumber: 1,
        name: 'Lunes: Empuje (Pecho, Hombro Lateral y Tríceps)',
        type: 'workout',
        focus: 'Frecuencia 1 de empuje con máxima tensión mecánica en pectoral, cabeza larga de tríceps y deltoides lateral.',
        exercises: [chestPress, overheadTri, inclinePress, lateralRaise, pecDeck, plank]
      },
      {
        id: 'd2',
        dayNumber: 2,
        name: 'Martes: Piernas Cuádriceps (Hack & Prensa 45°)',
        type: 'workout',
        focus: 'Énfasis en cuádriceps, vasto medial y pantorrillas sin fatiga previa.',
        exercises: [hackSquat, legPress, legExt, calfRaise, absCrunch]
      },
      {
        id: 'd3',
        dayNumber: 3,
        name: 'Miércoles: Jalón (Dorsales, Remo & Bíceps)',
        type: 'workout',
        focus: 'Amplitud de espalda V-Taper, remo pesado y estiramiento del bíceps en polea.',
        exercises: [pulldownWide, machineRow, pulloverCable, bayesianCurl, facePull]
      },
      {
        id: 'd4',
        dayNumber: 4,
        name: 'Jueves: Torso Híbrido (Compensación Pecho, Espalda y Brazos)',
        type: 'workout',
        focus: 'Garantiza Frecuencia 2x en todo el tren superior combinando los mejores ejercicios de empuje y tirón.',
        exercises: [inclinePress, pulldownWide, chestPress, machineRow, lateralRaise, bayesianCurl, overheadTri]
      },
      {
        id: 'd5',
        dayNumber: 5,
        name: 'Viernes: Piernas Cadena Posterior & Glúteo',
        type: 'workout',
        focus: 'Bisagra de cadera pesada con RDL, flexión de femorales sentado y prensa de glúteo.',
        exercises: [seatedLegCurl, rdlSmith, glutePress, calfRaise, absCrunch]
      },
      {
        id: 'd6',
        dayNumber: 6,
        name: 'Sábado: Descanso Activo / Recuperación',
        type: 'rest',
        focus: 'Día de descanso recuperativo ganado por redistribución del split a 5 días.',
        exercises: []
      },
      {
        id: 'd7',
        dayNumber: 7,
        name: 'Domingo: Descanso Activo / NEAT',
        type: 'rest',
        focus: 'Descanso total del SNC y caminata ligera NEAT.',
        exercises: []
      }
    ];
  }

  // ==========================================
  // SPLIT 4 DÍAS: UPPER / LOWER x 2 (TORSO / PIERNA)
  // ==========================================
  if (targetSplit === '4_days') {
    return [
      {
        id: 'd1',
        dayNumber: 1,
        name: 'Lunes: Torso A (Pecho, Espalda, Hombros & Brazos)',
        type: 'workout',
        focus: 'Frecuencia 2x: Press de pecho pesado, jalón dorsal, elevaciones laterales y brazos.',
        exercises: [chestPress, pulldownWide, inclinePress, lateralRaise, bayesianCurl, overheadTri]
      },
      {
        id: 'd2',
        dayNumber: 2,
        name: 'Martes: Pierna A (Enfoque Cuádriceps & Vasto Medial)',
        type: 'workout',
        focus: 'Sentadilla Hack pesada #1, prensa 45°, extensiones y pantorrillas.',
        exercises: [hackSquat, legPress, legExt, calfRaise, absCrunch]
      },
      {
        id: 'd3',
        dayNumber: 3,
        name: 'Miércoles: Descanso Activo',
        type: 'rest',
        focus: 'Recuperación articular y del SNC entre bloques de fuerza.',
        exercises: []
      },
      {
        id: 'd4',
        dayNumber: 4,
        name: 'Jueves: Torso B (Espalda, Pecho Inclinado & Brazos)',
        type: 'workout',
        focus: 'Remo con apoyo, press inclinado, pullover, face pulls y remate de brazos.',
        exercises: [machineRow, inclinePress, pulloverCable, pecDeck, facePull, overheadTri, bayesianCurl]
      },
      {
        id: 'd5',
        dayNumber: 5,
        name: 'Viernes: Pierna B (Cadena Posterior & Glúteos)',
        type: 'workout',
        focus: 'RDL Smith para isquios, flexión de femorales y prensa enfocado a glúteo.',
        exercises: [seatedLegCurl, rdlSmith, glutePress, calfRaise, absCrunch]
      },
      {
        id: 'd6',
        dayNumber: 6,
        name: 'Sábado: Descanso Activo',
        type: 'rest',
        focus: 'Descanso del fin de semana.',
        exercises: []
      },
      {
        id: 'd7',
        dayNumber: 7,
        name: 'Domingo: Descanso Activo / NEAT',
        type: 'rest',
        focus: 'Descanso total del SNC y caminata ligera NEAT.',
        exercises: []
      }
    ];
  }

  // ==========================================
  // SPLIT 3 DÍAS: FULL BODY x 3 (MÁXIMA EFICIENCIA)
  // ==========================================
  if (targetSplit === '3_days') {
    return [
      {
        id: 'd1',
        dayNumber: 1,
        name: 'Lunes: Full Body A (Hack Squat + Pecho Plano + Jalón)',
        type: 'workout',
        focus: 'Estímulo completo cuerpo entero con los movimientos compuestos de mayor rendimiento neuromuscular.',
        exercises: [hackSquat, chestPress, pulldownWide, lateralRaise, overheadTri, absCrunch]
      },
      {
        id: 'd2',
        dayNumber: 2,
        name: 'Martes: Descanso Activo',
        type: 'rest',
        focus: 'Recuperación neural de 48h para síntesis proteica profunda.',
        exercises: []
      },
      {
        id: 'd3',
        dayNumber: 3,
        name: 'Miércoles: Full Body B (RDL Smith + Press Inclinado + Remo)',
        type: 'workout',
        focus: 'Cadena posterior y tren superior en ángulo inclinado y tracción horizontal.',
        exercises: [rdlSmith, inclinePress, machineRow, seatedLegCurl, bayesianCurl, calfRaise]
      },
      {
        id: 'd4',
        dayNumber: 4,
        name: 'Jueves: Descanso Activo',
        type: 'rest',
        focus: 'Recuperación activa.',
        exercises: []
      },
      {
        id: 'd5',
        dayNumber: 5,
        name: 'Viernes: Full Body C (Prensa 45° + Aperturas + Pullover)',
        type: 'workout',
        focus: 'Volumen hipertrófico de remate y trabajo metabólico con mínima fatiga axial.',
        exercises: [legPress, pecDeck, pulloverCable, facePull, calfRaise, plank]
      },
      {
        id: 'd6',
        dayNumber: 6,
        name: 'Sábado: Descanso Activo',
        type: 'rest',
        focus: 'Recuperación de fin de semana.',
        exercises: []
      },
      {
        id: 'd7',
        dayNumber: 7,
        name: 'Domingo: Descanso Activo / NEAT',
        type: 'rest',
        focus: 'Descanso total del SNC y caminata ligera NEAT.',
        exercises: []
      }
    ];
  }

  // Fallback: rutina base original
  return baseRoutine;
}
