// MOTOR DE MATCHING INTELIGENTE Y FAMILIAS DE CARGA
// Permite vincular el historial de pesos anterior con la nueva rutina sin fragmentación.

import { LOAD_FAMILIES } from '../data/scientificProtocol';

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
  [LOAD_FAMILIES.OVERHEAD_PRESS]: [
    'press militar', 'shoulder press', 'dual axis', 'overhead press', 'militar mancuerna', 'militar smith', 'press hombro'
  ],
  [LOAD_FAMILIES.VERTICAL_PULL]: [
    'jalon al pecho', 'lat pulldown', 'dominadas', 'jalon estrecho', 'jalon neutro', 'jalon pronado', 'jalon prono', 'amplitud dorsal'
  ],
  [LOAD_FAMILIES.HORIZONTAL_ROW]: [
    'remo compuesto', 'remo maquina', 'chest supported row', 'remo t bar', 'remo barra t', 'remo gironda', 'remo mancuerna'
  ],
  [LOAD_FAMILIES.QUAD_DOMINANT]: [
    'sentadilla hack', 'hack squat', 'v squat', 'prensa piernas', 'prensa 90', 'leg press 45', 'prensa central', 'prensa horizontal'
  ],
  [LOAD_FAMILIES.HAMSTRING_GLUTE]: [
    'leg curl sentado', 'flexion femorales', 'seated leg curl', 'lying leg curl', 'prensa pies altos', 'peso muerto rumano', 'glute extension'
  ]
};

/**
 * Comprueba si un ejercicio histórico corresponde al ejercicio actual.
 */
export function matchExercise(currentEx, historicalKey, historicalData) {
  if (!currentEx || !historicalData) return { isMatch: false };

  const currentId = currentEx.id;
  const currentName = currentEx.name || '';
  const histName = historicalData.name || historicalData.originalName || historicalKey || '';

  // 1. Coincidencia directa por ID
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

  const delta = (startWeight !== null && currentWeight !== null) ? (currentWeight - startWeight) : 0;
  const deltaPercent = (startWeight && startWeight > 0) ? ((delta / startWeight) * 100).toFixed(1) : 0;

  const matchedSources = Array.from(matchedNamesSet);

  return {
    sessionOccurrences: occurrences,
    startWeight,
    currentWeight,
    prWeight,
    delta,
    deltaPercent,
    unit,
    matchedSources,
    hasHistory: occurrences.length > 0
  };
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
      for (const [key, exData] of Object.entries(prevWeekLog.exercises)) {
        if (matchExercise(currentEx, key, exData).isMatch) {
          return exData;
        }
      }
    }

    // Buscar en borrador activo de la semana anterior
    const weekKey = `week_${currentWeek - 1}`;
    const prevWeekActive = currentSessions[weekKey] ? (currentSessions[weekKey][dayId] || {}) : {};
    for (const [key, exData] of Object.entries(prevWeekActive)) {
      if (matchExercise(currentEx, key, exData).isMatch) {
        return exData;
      }
    }
  }

  // 2. Buscar en la última sesión registrada en el historial
  const lastLog = [...workoutHistory].reverse().find(s => {
    if (!s.exercises) return false;
    return Object.entries(s.exercises).some(([key, exData]) => matchExercise(currentEx, key, exData).isMatch);
  });

  if (lastLog && lastLog.exercises) {
    for (const [key, exData] of Object.entries(lastLog.exercises)) {
      if (matchExercise(currentEx, key, exData).isMatch) {
        return exData;
      }
    }
  }

  return {};
}
