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
  const a = nameA.toLowerCase();
  const b = nameB.toLowerCase();

  // Sentadilla Hack vs Prensa de Piernas NUNCA deben mezclarse
  const isHackA = a.includes('hack') || a.includes('v-squat') || a.includes('v squat');
  const isHackB = b.includes('hack') || b.includes('v-squat') || b.includes('v squat');
  const isPressA = a.includes('prensa') || a.includes('leg press');
  const isPressB = b.includes('prensa') || b.includes('leg press');

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

  // Mancuerna vs Máquina / Smith / Barra: Biomecánicamente incompatibles en pesos
  const isDumbbellA = a.includes('mancuerna') || a.includes('dumbbell');
  const isDumbbellB = b.includes('mancuerna') || b.includes('dumbbell');
  const isMachineA = a.includes('maquina') || a.includes('máquina') || a.includes('machine') || a.includes('smith') || a.includes('multipower') || a.includes('nitro') || a.includes('hammer');
  const isMachineB = b.includes('maquina') || b.includes('máquina') || b.includes('machine') || b.includes('smith') || b.includes('multipower') || b.includes('nitro') || b.includes('hammer');
  const isBarbellA = (a.includes('barra') && !a.includes('mancuerna')) || a.includes('barbell');
  const isBarbellB = (b.includes('barra') && !b.includes('mancuerna')) || b.includes('barbell');

  if ((isDumbbellA && isMachineB) || (isMachineA && isDumbbellB)) return true;
  if ((isDumbbellA && isBarbellB) || (isBarbellA && isDumbbellB)) return true;
  if ((isMachineA && isBarbellB) || (isBarbellA && isMachineB)) return true;

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

  // 1. Si son ejercicios biomecánicamente incompatibles, bloquear INCLUSO si coinciden por ID
  // (Previene que si d5_e1 antes era Prensa y ahora es RDL se mezclen pesos)
  if (areIncompatibleExercises(currentName, histName)) {
    return { isMatch: false };
  }

  // 2. Coincidencia directa por ID (solo si no fueron incompatibles arriba)
  if (currentId === historicalKey || historicalData.id === currentId) {
    return { isMatch: true, matchType: 'exact_id', matchedName: histName };
  }

  // 2. Coincidencia exacta por nombre
  if (currentName.trim().toLowerCase() === histName.trim().toLowerCase()) {
    return { isMatch: true, matchType: 'exact_name', matchedName: histName };
  }

  // 3. Coincidencia normalizada
  const normCurrent = normalizeExerciseName(currentName);
  const normHist = normalizeExerciseName(histName);

  if (normCurrent && normHist) {
    if (normCurrent === normHist || normCurrent.includes(normHist) || normHist.includes(normCurrent)) {
      return { isMatch: true, matchType: 'normalized_name', matchedName: histName };
    }
  }

  // 4. Coincidencia por Equivalencias Directas
  if (currentEx.equivalents && Array.isArray(currentEx.equivalents)) {
    for (const eq of currentEx.equivalents) {
      if (areIncompatibleExercises(eq.name, histName)) continue;
      const normEq = normalizeExerciseName(eq.name);
      if (normEq && (normEq === normHist || normHist.includes(normEq) || normEq.includes(normHist))) {
        return { isMatch: true, matchType: 'equivalent', matchedName: histName, equivalentName: eq.name };
      }
    }
  }

  // 5. Coincidencia por Familia de Carga
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
 * Extrae todo el historial de sobrecarga acumulado para un ejercicio específico
 * buscando en todas las sesiones archivadas sin importar si el nombre varió ligeramente.
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
    const timeA = new Date(a.timestamp || a.date || 0).getTime();
    const timeB = new Date(b.timestamp || b.date || 0).getTime();
    return timeA - timeB;
  });

  sortedHistory.forEach(ses => {
    if (!ses.exercises) return;

    // Buscar en los ejercicios de esta sesión
    let matchedExData = null;
    let matchedName = '';

    for (const [key, exData] of Object.entries(ses.exercises)) {
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
      const validSetNums = Object.keys(matchedExData)
        .filter(k => !isNaN(parseInt(k)) && matchedExData[k] && matchedExData[k].completed && matchedExData[k].weight);

      if (validSetNums.length > 0) {
        let maxW = 0;
        let bestR = 0;
        let unit = 'lbs';
        const detailedSets = [];

        validSetNums.forEach(sNum => {
          const sObj = matchedExData[sNum];
          const w = parseFloat(sObj.weight) || 0;
          const r = parseInt(sObj.reps) || 0;
          if (w >= maxW) {
            maxW = w;
            bestR = r;
          }
          unit = sObj.unit || 'lbs';
          detailedSets.push({
            setNum: sNum,
            weight: w,
            reps: r,
            rpe: sObj.rpe || '8',
            unit: sObj.unit || 'lbs'
          });
        });

        if (maxW > 0) {
          occurrences.push({
            sessionId: ses.id,
            dateStr: ses.dateString ? ses.dateString.split(',')[0] : (ses.timestamp ? ses.timestamp.split('T')[0] : 'Fecha'),
            weekNumber: ses.weekNumber || 1,
            maxWeight: maxW,
            bestReps: bestR,
            unit,
            setsCount: detailedSets.length,
            detailedSets,
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
function findBestMatchInSession(currentEx, sessionExercises) {
  if (!sessionExercises) return null;
  const entries = Object.entries(sessionExercises);
  if (entries.length === 0) return null;

  // Prioridad 1: Coincidencia exacta por ID (clave o propiedad id)
  for (const [key, exData] of entries) {
    if ((key === currentEx.id || exData.id === currentEx.id) && !areIncompatibleExercises(currentEx.name, exData.name || key)) {
      return exData;
    }
  }

  // Prioridad 2: Coincidencia exacta por Nombre (ignorando mayúsculas y espacios extremos)
  for (const [key, exData] of entries) {
    const histName = exData.name || exData.originalName || key;
    if (currentEx.name && histName && currentEx.name.trim().toLowerCase() === histName.trim().toLowerCase()) {
      return exData;
    }
  }

  // Prioridad 3: Coincidencia por nombre normalizado (siempre que los aparatos sean compatibles)
  const normCurrent = normalizeExerciseName(currentEx.name);
  for (const [key, exData] of entries) {
    const histName = exData.name || exData.originalName || key;
    if (areIncompatibleExercises(currentEx.name, histName)) continue;
    const normHist = normalizeExerciseName(histName);
    if (normCurrent && normHist && normCurrent === normHist) {
      return exData;
    }
  }

  // Prioridad 4: Coincidencia por Equivalentes directos configurados
  if (currentEx.equivalents && Array.isArray(currentEx.equivalents)) {
    for (const eq of currentEx.equivalents) {
      const normEq = normalizeExerciseName(eq.name);
      for (const [key, exData] of entries) {
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
  for (const [key, exData] of entries) {
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

  // 1. Si semana > 1, buscar en la sesión archivada de la semana anterior
  if (currentWeek > 1) {
    const prevWeekLog = [...workoutHistory].reverse().find(s => s.dayId === dayId && s.weekNumber === (currentWeek - 1));
    if (prevWeekLog && prevWeekLog.exercises) {
      const matched = findBestMatchInSession(currentEx, prevWeekLog.exercises);
      if (matched) return matched;
    }
  }

  // 2. Buscar en la última sesión registrada en el historial
  const lastLogs = [...workoutHistory].reverse();
  for (const s of lastLogs) {
    if (!s.exercises) continue;
    const matched = findBestMatchInSession(currentEx, s.exercises);
    if (matched) return matched;
  }

  return {};
}
