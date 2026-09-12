// MOTOR DE MATCHING INTELIGENTE Y FAMILIAS DE CARGA
// Permite vincular el historial de pesos anterior con la nueva rutina sin fragmentación.

import { LOAD_FAMILIES } from '../data/scientificProtocol.js';

/**
 * Normaliza nombres de ejercicios eliminando acentos, paréntesis, números y palabras de relleno.
 */
export function normalizeExerciseName(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/\(.*?\)/g, '') // Quitar contenido entre paréntesis
    .replace(/[^a-z0-9\s]/g, ' ') // Quitar signos
    .replace(/\b(en|con|de|la|el|para|un|una|a|al|y|o|por|sobre|exactos|grados|maquina|banco)\b/g, ' ') // Quitar conectores
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Diccionario de palabras clave por Familia de Carga para matching inteligente.
 */
const LOAD_FAMILY_KEYWORDS = {
  [LOAD_FAMILIES.INCLINE_PRESS]: [
    'press inclinado', 'nitro incline', 'incline press', 'inclinada smith', 'smith inclinado', 'hammer incline', 'pecho superior'
  ],
  [LOAD_FAMILIES.CHEST_PRESS]: [
    'chest press', 'prensa de pecho', 'press plano', 'machine chest press', 'press de pecho'
  ],
  [LOAD_FAMILIES.OVERHEAD_PRESS]: [
    'press militar', 'shoulder press', 'dual axis', 'overhead press', 'militar mancuerna', 'militar smith', 'press hombro'
  ],
  [LOAD_FAMILIES.VERTICAL_PULL]: [
    'jalon al pecho', 'lat pulldown', 'dominadas', 'jalon estrecho', 'jalon neutro', 'jalon pronado', 'jalon prono', 'amplitud dorsal', 'v grip'
  ],
  [LOAD_FAMILIES.HORIZONTAL_ROW]: [
    'remo compuesto', 'remo maquina', 'chest supported row', 'remo t bar', 'remo barra t', 'remo gironda', 'remo mancuerna'
  ],
  [LOAD_FAMILIES.HACK_SQUAT]: [
    'sentadilla hack', 'hack squat', 'v squat'
  ],
  [LOAD_FAMILIES.LEG_PRESS]: [
    'prensa piernas', 'prensa 90', 'leg press 45', 'prensa central', 'prensa horizontal', 'prensa pies altos', 'high stance leg press'
  ],
  [LOAD_FAMILIES.ROMANIAN_DEADLIFT]: [
    'peso muerto rumano', 'rdl', 'romanian deadlift', 'peso muerto', 'bisagra cadera'
  ],
  [LOAD_FAMILIES.HAMSTRING_CURL]: [
    'leg curl sentado', 'flexion femorales', 'seated leg curl', 'lying leg curl', 'leg curl'
  ],
  [LOAD_FAMILIES.GLUTE_EXTENSION]: [
    'extensiones gluteo', 'banco romano', 'butt blaster', 'glute extension', 'patada gluteo'
  ]
};

/**
 * Comprueba si dos nombres de ejercicios son mutuamente excluyentes (para evitar falsos positivos por substrings o familias)
 */
function areIncompatibleExercises(nameA, nameB) {
  if (!nameA || !nameB) return false;
  if (nameA.trim().toLowerCase() === nameB.trim().toLowerCase()) return false;

  const a = nameA.toLowerCase();
  const b = nameB.toLowerCase();

  // Sentadilla Hack vs Prensa de Piernas NUNCA deben mezclarse
  const isHackA = a.includes('hack') || a.includes('v-squat') || a.includes('v squat');
  const isHackB = b.includes('hack') || b.includes('v-squat') || b.includes('v squat');
  const isPressA = (a.includes('prensa') && !a.includes('pecho') && !a.includes('chest press') && !a.includes('pallof')) || a.includes('leg press');
  const isPressB = (b.includes('prensa') && !b.includes('pecho') && !b.includes('chest press') && !b.includes('pallof')) || b.includes('leg press');

  if ((isHackA && isPressB) || (isPressA && isHackB)) {
    return true;
  }

  // Prensa de Piernas vs Curl de Femorales NUNCA deben mezclarse
  const isCurlA = a.includes('curl') || a.includes('flexion');
  const isCurlB = b.includes('curl') || b.includes('flexion');
  if ((isPressA && isCurlB) || (isCurlA && isPressB)) {
    return true;
  }

  // Peso Muerto / RDL vs Prensa o Sentadilla Hack NUNCA deben mezclarse
  const isRdlA = a.includes('muerto') || a.includes('rdl') || a.includes('deadlift');
  const isRdlB = b.includes('muerto') || b.includes('rdl') || b.includes('deadlift');
  if ((isRdlA && (isPressB || isHackB)) || (isRdlB && (isPressA || isHackA))) {
    return true;
  }

  // Pecho / Hombro vs Pierna NUNCA deben mezclarse
  const isUpperChestA = a.includes('inclinado') || a.includes('chest') || a.includes('pecho') || a.includes('pec deck') || a.includes('cristos');
  const isUpperChestB = b.includes('inclinado') || b.includes('chest') || b.includes('pecho') || b.includes('pec deck') || b.includes('cristos');
  const isLegA = isHackA || isPressA || isRdlA || isCurlA || a.includes('pierna') || a.includes('cuadriceps') || a.includes('pantorrilla');
  const isLegB = isHackB || isPressB || isRdlB || isCurlB || b.includes('pierna') || b.includes('cuadriceps') || b.includes('pantorrilla');
  if ((isUpperChestA && isLegB) || (isLegA && isUpperChestB)) {
    return true;
  }

  // Mancuerna vs Máquina / Smith / Barra: Biomecánicamente incompatibles en pesos SOLO si son de aparatos estrictamente distintos
  const isStrictDumbbellA = (a.includes('mancuerna') || a.includes('dumbbell')) && !a.includes('maquina') && !a.includes('máquina') && !a.includes('smith');
  const isStrictDumbbellB = (b.includes('mancuerna') || b.includes('dumbbell')) && !b.includes('maquina') && !b.includes('máquina') && !b.includes('smith');

  const isStrictMachineA = (a.includes('maquina') || a.includes('máquina') || a.includes('machine') || a.includes('smith') || a.includes('multipower') || a.includes('nitro') || a.includes('hammer')) && !a.includes('mancuerna');
  const isStrictMachineB = (b.includes('maquina') || b.includes('máquina') || b.includes('machine') || b.includes('smith') || b.includes('multipower') || b.includes('nitro') || b.includes('hammer')) && !a.includes('mancuerna');

  const isStrictBarbellA = ((a.includes('barra') || a.includes('barbell')) && !a.includes('mancuerna') && !a.includes('polea') && !a.includes('cable') && !a.includes('smith') && !a.includes('maquina'));
  const isStrictBarbellB = ((b.includes('barra') || b.includes('barbell')) && !b.includes('mancuerna') && !b.includes('polea') && !b.includes('cable') && !b.includes('smith') && !b.includes('maquina'));

  const isStrictCableA = (a.includes('polea') || a.includes('cable')) && !a.includes('mancuerna') && !a.includes('barra');
  const isStrictCableB = (b.includes('polea') || b.includes('cable')) && !b.includes('mancuerna') && !b.includes('barra');

  if ((isStrictDumbbellA && isStrictMachineB) || (isStrictMachineA && isStrictDumbbellB)) return true;
  if ((isStrictDumbbellA && isStrictBarbellB) || (isStrictBarbellA && isStrictDumbbellB)) return true;
  if ((isStrictMachineA && isStrictBarbellB) || (isStrictBarbellA && isStrictMachineB)) return true;
  if ((isStrictCableA && isStrictDumbbellB) || (isStrictDumbbellA && isStrictCableB)) return true;

  return false;
}

/**
 * Comprueba si un ejercicio histórico corresponde al ejercicio actual.
 */
export function matchExercise(currentEx, historicalKey, historicalData) {
  if (!currentEx || !historicalData) return { isMatch: false };

  const currentId = currentEx.id;
  const currentName = currentEx.name || '';
  const histName = historicalData.name || historicalData.originalName || historicalKey || '';
  const isSwapped = Boolean(currentEx.originalName && currentEx.originalName !== currentEx.name);

  // 1. Si son ejercicios biomecánicamente incompatibles, bloquear INCLUSO si coinciden por ID
  // (Previene que si d5_e1 antes era Prensa y ahora es RDL se mezclen pesos)
  if (areIncompatibleExercises(currentName, histName)) {
    return { isMatch: false };
  }

  // 2. Coincidencia exacta por nombre (Máxima fidelidad de progresión)
  if (currentName.trim().toLowerCase() === histName.trim().toLowerCase()) {
    return { isMatch: true, matchType: 'exact_name', matchedName: histName };
  }

  // 3. Coincidencia normalizada por nombre
  const normCurrent = normalizeExerciseName(currentName);
  const normHist = normalizeExerciseName(histName);

  if (normCurrent && normHist) {
    if (normCurrent === normHist || normCurrent.includes(normHist) || normHist.includes(normCurrent)) {
      return { isMatch: true, matchType: 'normalized_name', matchedName: histName };
    }
  }

  // 4. Coincidencia directa por ID (solo si no fueron incompatibles y no es un slot sustituido con otro ejercicio)
  if (currentId === historicalKey || historicalData.id === currentId) {
    // Si el ejercicio actual está sustituido, NO asociar registros antiguos que tenían el nombre original
    if (isSwapped && currentEx.originalName) {
      const normOrig = normalizeExerciseName(currentEx.originalName);
      if (normHist && (normHist === normOrig || normHist.includes(normOrig) || normOrig.includes(normHist))) {
        return { isMatch: false }; // Evita contaminar el sustituto con los pesos del ejercicio original
      }
    }
    // Si el historial tiene un nombre explícito distinto y no compatible, rechazar match ciego de ID
    if (normHist && normCurrent && normHist !== normCurrent && areIncompatibleExercises(currentName, histName)) {
      return { isMatch: false };
    }
    return { isMatch: true, matchType: 'exact_id', matchedName: histName };
  }

  // 5. Coincidencia por Equivalencias Directas
  if (currentEx.equivalents && Array.isArray(currentEx.equivalents)) {
    for (const eq of currentEx.equivalents) {
      if (areIncompatibleExercises(eq.name, histName)) continue;
      const normEq = normalizeExerciseName(eq.name);
      if (normEq && (normEq === normHist || normHist.includes(normEq) || normEq.includes(normHist))) {
        return { isMatch: true, matchType: 'equivalent', matchedName: histName, equivalentName: eq.name };
      }
    }
  }

  // 6. Coincidencia por Familia de Carga
  if (currentEx.loadFamily && LOAD_FAMILY_KEYWORDS[currentEx.loadFamily]) {
    const familyKeywords = LOAD_FAMILY_KEYWORDS[currentEx.loadFamily];
    const isHistInFamily = familyKeywords.some(kw => normHist.includes(normalizeExerciseName(kw)));
    const isCurrentInFamily = familyKeywords.some(kw => normCurrent.includes(normalizeExerciseName(kw)));

    if (isHistInFamily && isCurrentInFamily) {
      return { isMatch: true, matchType: 'load_family', matchedName: histName, family: currentEx.loadFamily };
    }
  }

  return { isMatch: false };
}

/**
/**
 * Extrae la lista de ejercicios de una sesión de forma uniforme, soportando:
 * - ses.exercises como mapa { exId: data }
 * - ses.exercises como array [ data ]
 * - ses.exercisesDetailed como array [ data ]
 * - ses.rawWorkoutData como mapa { exId: data }
 */
export function getExercisesFromSession(ses) {
  if (!ses) return [];

  // 1. Si exercises es un objeto mapa { [exId]: data }
  if (ses.exercises && typeof ses.exercises === 'object' && !Array.isArray(ses.exercises)) {
    return Object.entries(ses.exercises).map(([key, data]) => ({ key, data }));
  }

  // 2. Si exercises es un array
  if (Array.isArray(ses.exercises) && ses.exercises.length > 0) {
    return ses.exercises.map((data, idx) => ({ key: data?.id || String(idx), data }));
  }

  // 3. Si exercisesDetailed es un array (respaldos / exportaciones completas)
  if (Array.isArray(ses.exercisesDetailed) && ses.exercisesDetailed.length > 0) {
    return ses.exercisesDetailed.map((data, idx) => ({ key: data?.id || String(idx), data }));
  }

  // 4. Si rawWorkoutData existe
  if (ses.rawWorkoutData && typeof ses.rawWorkoutData === 'object' && !Array.isArray(ses.rawWorkoutData)) {
    return Object.entries(ses.rawWorkoutData).map(([key, data]) => ({ key, data }));
  }

  return [];
}

/**
 * Extrae las series completadas de un ejercicio de forma uniforme,
 * tanto si están en array `exData.sets` como si son claves numéricas '0', '1', '2'.
 */
export function extractExerciseSets(exData) {
  if (!exData) return [];
  const sets = [];

  // Formato A: array de sets
  if (Array.isArray(exData.sets)) {
    exData.sets.forEach((s, idx) => {
      if (!s) return;
      const w = parseFloat(s.weight) || 0;
      const r = parseInt(s.reps, 10) || Math.max(parseInt(s.repsR, 10) || 0, parseInt(s.repsL, 10) || 0) || 0;
      const isDone = s.completed !== false; // no completado únicamente si completed es explícitamente false
      if (w > 0 && isDone) {
        sets.push({
          setNum: s.setNum !== undefined ? s.setNum : idx + 1,
          weight: w,
          reps: r,
          repsL: s.repsL,
          repsR: s.repsR,
          rpe: s.rpe || '8',
          unit: s.unit || exData.unit || 'lbs'
        });
      }
    });
    return sets;
  }

  // Formato B: claves numéricas directas ('0', '1', '2', etc.)
  Object.keys(exData).forEach(k => {
    const num = parseInt(k, 10);
    if (!isNaN(num)) {
      const s = exData[k];
      if (s) {
        const w = parseFloat(s.weight) || 0;
        const r = parseInt(s.reps, 10) || Math.max(parseInt(s.repsR, 10) || 0, parseInt(s.repsL, 10) || 0) || 0;
        const isDone = s.completed !== false;
        if (w > 0 && isDone) {
          sets.push({
            setNum: num,
            weight: w,
            reps: r,
            repsL: s.repsL,
            repsR: s.repsR,
            rpe: s.rpe || '8',
            unit: s.unit || exData.unit || 'lbs'
          });
        }
      }
    }
  });

  return sets;
}

/**
 * Extrae todo el historial de sobrecarga acumulado para un ejercicio específico
 * buscando en todas las sesiones archivadas sin importar si el nombre varió ligeramente
 * o si la sesión fue guardada con diferente estructura.
 */
export function getHistoricalRecordsForExercise(currentEx, workoutHistory = []) {
  if (!currentEx || !workoutHistory || workoutHistory.length === 0) {
    return {
      sessionOccurrences: [],
      startWeight: null,
      currentWeight: null,
      prWeight: null,
      delta: 0,
      deltaPercent: 0,
      unit: currentEx.defaultUnit || 'lbs',
      matchedSources: [],
      hasHistory: false
    };
  }

  const occurrences = [];
  const matchedNamesSet = new Set();

  // Recorrer historial en orden cronológico
  const sortedHistory = [...workoutHistory].sort((a, b) => {
    const timeA = new Date(a.timestamp || a.date || a.startTime || a.id || 0).getTime() || 0;
    const timeB = new Date(b.timestamp || b.date || b.startTime || b.id || 0).getTime() || 0;
    return timeA - timeB;
  });

  sortedHistory.forEach(ses => {
    if (ses.isRestDay || ses.isMissedDay) return;

    // Obtener los ejercicios de esta sesión de cualquier formato
    const sessionExercisesList = getExercisesFromSession(ses);
    if (sessionExercisesList.length === 0) return;

    let matchedExData = null;
    let matchedName = '';

    for (const item of sessionExercisesList) {
      const key = item.key;
      const exData = item.data;
      if (!exData || exData.machine) continue; // Saltar cardio

      const matchRes = matchExercise(currentEx, key, exData);
      if (matchRes.isMatch) {
        matchedExData = exData;
        matchedName = matchRes.matchedName || exData.name || key;
        matchedNamesSet.add(matchedName);
        break;
      }
    }

    if (matchedExData) {
      const detailedSets = extractExerciseSets(matchedExData);

      if (detailedSets.length > 0) {
        let maxW = 0;
        let minW = Infinity;
        let maxR = 0;
        let minR = Infinity;
        let repsSum = 0;
        let best1RM = 0;
        let topSet = null;
        let unit = 'lbs';
        let totalVol = 0;

        detailedSets.forEach((s, idx) => {
          const w = parseFloat(s.weight) || 0;
          const r = parseInt(s.reps, 10) || 0;
          const epley = (w > 0 && r > 0) ? (r === 1 ? Math.round(w) : Math.round(w * (1 + r / 30))) : 0;
          totalVol += (w * r);
          repsSum += r;

          if (w > maxW) maxW = w;
          if (w < minW && w > 0) minW = w;
          if (r > maxR) maxR = r;
          if (r < minR && r > 0) minR = r;

          // Mejor serie (Top Set): la que genera el mayor 1RM estimado
          if (epley > best1RM || (!topSet && w > 0)) {
            best1RM = epley;
            topSet = { ...s, setNum: s.setNum !== undefined ? s.setNum : idx + 1, est1RM: epley };
          }
          if (s.unit) unit = s.unit;
        });

        const avgReps = detailedSets.length > 0 ? Math.round((repsSum / detailedSets.length) * 10) / 10 : 0;
        // Reps logradas en la carga máxima (si hay varias series con el peso pico, tomar el máximo)
        const peakWeightSets = detailedSets.filter(s => s.weight === maxW);
        const bestRepsAtPeakWeight = peakWeightSets.length > 0 ? Math.max(...peakWeightSets.map(s => s.reps)) : 0;

        if (maxW > 0) {
          const dateLabel = ses.dateString
            ? ses.dateString.split(',')[0]
            : (ses.date || (ses.timestamp ? ses.timestamp.split('T')[0] : 'Sesión'));

          occurrences.push({
            sessionId: ses.id,
            dateStr: dateLabel,
            weekNumber: ses.weekNumber || 1,
            maxWeight: maxW,
            minWeight: minW !== Infinity ? minW : maxW,
            bestReps: bestRepsAtPeakWeight, // Reps en la serie pico
            maxRepsSession: maxR, // Máximo de repeticiones en cualquier serie de la sesión
            minRepsSession: minR !== Infinity ? minR : maxR, // Mínimo de repeticiones de la sesión
            avgReps: avgReps, // Promedio matemático de repeticiones de toda la sesión
            est1RM: best1RM,
            totalVolume: totalVol,
            unit,
            setsCount: detailedSets.length,
            detailedSets,
            topSet: topSet || { weight: maxW, reps: bestRepsAtPeakWeight, est1RM: best1RM },
            sourceName: matchedName
          });
        }
      }
    }
  });

  const startWeight = occurrences.length > 0 ? occurrences[0].maxWeight : null;
  const currentWeight = occurrences.length > 0 ? occurrences[occurrences.length - 1].maxWeight : null;
  const prWeight = occurrences.length > 0 ? Math.max(...occurrences.map(s => s.maxWeight)) : null;
  const unit = occurrences.length > 0 ? occurrences[occurrences.length - 1].unit : (currentEx.defaultUnit || 'lbs');

  let best1RM = 0;
  occurrences.forEach(occ => {
    (occ.detailedSets || []).forEach(s => {
      const w = parseFloat(s.weight) || 0;
      const r = parseFloat(s.reps) || 0;
      const epley = (w > 0 && r > 0) ? (r === 1 ? Math.round(w) : Math.round(w * (1 + r / 30))) : 0;
      if (epley > best1RM) best1RM = epley;
    });
  });

  const delta = (startWeight !== null && currentWeight !== null) ? (currentWeight - startWeight) : 0;
  const deltaPercent = (startWeight && startWeight > 0) ? ((delta / startWeight) * 100).toFixed(1) : 0;

  const matchedSources = Array.from(matchedNamesSet);

  return {
    sessionOccurrences: occurrences,
    startWeight,
    currentWeight,
    prWeight,
    best1RM,
    delta,
    deltaPercent,
    unit,
    matchedSources,
    hasHistory: occurrences.length > 0
  };
}


/**
 * Encuentra la coincidencia más precisa para un ejercicio dentro del mapa de ejercicios de una sesión.
 * Prioriza coincidencia exacta por ID y Nombre para que ejercicios del mismo día (ej. Press Mancuernas vs Press Máquina)
 * no se roben mutuamente los datos históricos.
 */
/**
 * Encuentra la coincidencia más precisa para un ejercicio dentro de los ejercicios de una sesión.
 * Prioriza coincidencia exacta por ID y Nombre para que ejercicios del mismo día (ej. Press Mancuernas vs Press Máquina)
 * no se roben mutuamente los datos históricos.
 */
function findBestMatchInSession(currentEx, sessionOrExercises) {
  if (!sessionOrExercises) return null;

  // Normalizar a lista de { key, data }
  let entries = [];
  if (Array.isArray(sessionOrExercises)) {
    entries = sessionOrExercises.map((item, idx) => {
      if (item && item.key && item.data) return item;
      return { key: item?.id || String(idx), data: item };
    });
  } else if (sessionOrExercises.exercises || sessionOrExercises.exercisesDetailed || sessionOrExercises.rawWorkoutData) {
    entries = getExercisesFromSession(sessionOrExercises);
  } else {
    entries = Object.entries(sessionOrExercises).map(([key, data]) => ({ key, data }));
  }

  if (entries.length === 0) return null;

  const isSwapped = Boolean(currentEx.originalName && currentEx.originalName !== currentEx.name);

  // Prioridad 1: Coincidencia exacta por Nombre (ignorando mayúsculas y espacios extremos)
  for (const { key, data: exData } of entries) {
    if (!exData) continue;
    const histName = exData.name || exData.originalName || key;
    if (currentEx.name && histName && currentEx.name.trim().toLowerCase() === histName.trim().toLowerCase()) {
      return exData;
    }
  }

  // Prioridad 2: Coincidencia por nombre normalizado (siempre que los aparatos sean compatibles)
  const normCurrent = normalizeExerciseName(currentEx.name);
  for (const { key, data: exData } of entries) {
    if (!exData) continue;
    const histName = exData.name || exData.originalName || key;
    if (areIncompatibleExercises(currentEx.name, histName)) continue;
    const normHist = normalizeExerciseName(histName);
    if (normCurrent && normHist && normCurrent === normHist) {
      return exData;
    }
  }

  // Prioridad 3: Coincidencia exacta por ID (clave o propiedad id) solo si no hay contradicción de ejercicio
  for (const { key, data: exData } of entries) {
    if (!exData) continue;
    if (key === currentEx.id || exData.id === currentEx.id) {
      const histName = exData.name || exData.originalName || key;
      if (areIncompatibleExercises(currentEx.name, histName)) continue;
      // Si el ejercicio actual está sustituido, NO asociar datos del ejercicio original
      if (isSwapped && currentEx.originalName) {
        const normOrig = normalizeExerciseName(currentEx.originalName);
        const normHist = normalizeExerciseName(histName);
        if (normHist && (normHist === normOrig || normHist.includes(normOrig) || normOrig.includes(normHist))) {
          continue;
        }
      }
      return exData;
    }
  }

  // Prioridad 4: Coincidencia por Equivalentes directos configurados
  if (currentEx.equivalents && Array.isArray(currentEx.equivalents)) {
    for (const eq of currentEx.equivalents) {
      const normEq = normalizeExerciseName(eq.name);
      for (const { key, data: exData } of entries) {
        if (!exData) continue;
        const histName = exData.name || exData.originalName || key;
        if (areIncompatibleExercises(currentEx.name, histName)) continue;
        const normHist = normalizeExerciseName(histName);
        if (normEq && normHist && (normEq === normHist || normHist.includes(normEq) || normEq.includes(normHist))) {
          return exData;
        }
      }
    }
  }

  // Prioridad 5: Coincidencia por Familia de Carga (solo si no compite con otro ejercicio más afín)
  for (const { key, data: exData } of entries) {
    if (!exData) continue;
    const match = matchExercise(currentEx, key, exData);
    if (match.isMatch) {
      return exData;
    }
  }

  return null;
}

/**
 * Busca los datos de la sesión anterior para un ejercicio en WorkoutDay
 * utilizando el motor de matching para no perder datos si el nombre cambió.
 */
export function getPreviousDataForExercise(currentEx, dayId, currentWeek, workoutHistory = [], currentSessions = {}) {
  if (!currentEx) return {};

  const hasValidLoggedSets = (exData) => {
    if (!exData || typeof exData !== 'object') return false;
    const sets = extractExerciseSets(exData);
    return sets.length > 0;
  };

  const normalizeResult = (matched) => {
    if (!matched) return {};
    const result = { ...matched };
    // Asegurar que si los sets vienen como array, estén también disponibles como claves '1', '2', etc.
    if (Array.isArray(matched.sets)) {
      matched.sets.forEach((s, idx) => {
        const sNum = s.setNum !== undefined ? s.setNum : idx + 1;
        if (!result[sNum]) {
          result[sNum] = {
            weight: s.weight,
            reps: s.reps,
            repsL: s.repsL,
            repsR: s.repsR,
            rpe: s.rpe || '8',
            unit: s.unit || matched.unit || 'lbs',
            completed: true
          };
        }
      });
    }
    return result;
  };

  const historyRev = [...workoutHistory].reverse();

  // 1. Si semana > 1, buscar en la sesión archivada de la semana anterior del MISMO día si tiene series válidas
  if (currentWeek > 1) {
    const prevWeekLog = historyRev.find(s => s.dayId === dayId && s.weekNumber === (currentWeek - 1));
    if (prevWeekLog) {
      const matched = findBestMatchInSession(currentEx, prevWeekLog);
      if (matched && hasValidLoggedSets(matched)) return normalizeResult(matched);
    }
  }

  // 2. Buscar en la última sesión del MISMO DÍA en el historial con series válidas
  for (const s of historyRev) {
    if (s.dayId === dayId) {
      const matched = findBestMatchInSession(currentEx, s);
      if (matched && hasValidLoggedSets(matched)) return normalizeResult(matched);
    }
  }

  // 3. Buscar en CUALQUIER sesión previa donde se haya realizado este ejercicio con series válidas
  for (const s of historyRev) {
    const matched = findBestMatchInSession(currentEx, s);
    if (matched && hasValidLoggedSets(matched)) return normalizeResult(matched);
  }

  // 4. Fallback final (incluso si no tiene sets marcados) para no perder metadata o configuraciones
  for (const s of historyRev) {
    const matched = findBestMatchInSession(currentEx, s);
    if (matched) return normalizeResult(matched);
  }

  return {};
}
