import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary';

/**
 * Parser inteligente de texto libre o JSON para rutinas de entrenamiento.
 */
export function parseRoutineInput(inputText) {
  if (!inputText || !inputText.trim()) {
    throw new Error("El texto ingresado está vacío.");
  }

  const trimmed = inputText.trim();

  // 1. Intento de parseo como JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return normalizeParsedDays(parsed);
      }
      if (parsed.days && Array.isArray(parsed.days)) {
        return normalizeParsedDays(parsed.days);
      }
    } catch (e) {
      // Continuar al parser de texto si falla JSON
    }
  }

  // 2. Parser de Texto Libre Inteligente
  const lines = trimmed.split('\n');
  const days = [];
  let currentDay = null;

  const dayNameMapping = {
    lunes: 'd1', martes: 'd2', miercoles: 'd3', miércoles: 'd3',
    jueves: 'd4', viernes: 'd5', sabado: 'd6', sábado: 'd6', domingo: 'd7'
  };

  lines.forEach((line) => {
    const rawLine = line.trim();
    if (!rawLine || rawLine.startsWith('===') || rawLine.startsWith('---')) return;

    // Detectar encabezado de día
    const lowerLine = rawLine.toLowerCase();
    const isDayHeader = (
      rawLine.startsWith('#') ||
      rawLine.startsWith('📌') ||
      rawLine.startsWith('Día') ||
      rawLine.startsWith('Dia') ||
      rawLine.startsWith('DAY') ||
      lowerLine.startsWith('lunes') ||
      lowerLine.startsWith('martes') ||
      lowerLine.startsWith('miércoles') ||
      lowerLine.startsWith('miercoles') ||
      lowerLine.startsWith('jueves') ||
      lowerLine.startsWith('viernes') ||
      lowerLine.startsWith('sábado') ||
      lowerLine.startsWith('sabado') ||
      lowerLine.startsWith('domingo')
    );

    if (isDayHeader && (rawLine.includes(':') || rawLine.length < 60)) {
      const dayIndex = days.length + 1;
      let matchedDayId = `d${dayIndex}`;
      for (const [key, id] of Object.entries(dayNameMapping)) {
        if (lowerLine.includes(key)) {
          matchedDayId = id;
          break;
        }
      }

      let cleanDayName = rawLine.replace(/^[#📌\-\*\s\d\.\:\)]+/, '').trim();
      if (!cleanDayName) cleanDayName = `Día ${dayIndex}`;

      const isRest = lowerLine.includes('descanso') || lowerLine.includes('rest');

      currentDay = {
        id: matchedDayId,
        dayNumber: dayIndex,
        name: cleanDayName,
        type: isRest ? 'rest' : 'workout',
        focus: '',
        exercises: []
      };
      days.push(currentDay);
      return;
    }

    // Si aún no hay día creado, crear el primero
    if (!currentDay) {
      currentDay = {
        id: 'd1',
        dayNumber: 1,
        name: 'Día 1: Rutina Principal',
        type: 'workout',
        focus: '',
        exercises: []
      };
      days.push(currentDay);
    }

    // Si el día es de descanso, ignorar líneas subsiguientes como ejercicios
    if (currentDay.type === 'rest') return;

    // Parsear ejercicio individual
    const exParsed = parseExerciseLine(rawLine, currentDay.exercises.length + 1, currentDay.id);
    if (exParsed) {
      currentDay.exercises.push(exParsed);
    }
  });

  if (days.length === 0) {
    throw new Error("No se detectaron días válidos en el texto. Asegúrate de incluir encabezados como 'Día 1: Pecho' o 'Lunes: Torso'.");
  }

  return normalizeParsedDays(days);
}

/**
 * Parsea una línea de ejercicio extrayendo Nombre, Series, Repeticiones, RIR/RPE y Descanso.
 */
export function parseExerciseLine(line, index, dayId) {
  let clean = line.replace(/^[\*\-\•\d\.\)\s]+/, '').trim();
  if (!clean || clean.length < 3) return null;

  let sets = 3;
  let reps = '8-12';
  let restTime = '90s';
  let rir = 'RIR 1-2';

  // Buscar patrón de series x reps: ej. 3x8-12 o 4 x 10 o 3 x 6-8 reps
  const setsRepsRegex = /(\d+)\s*[xX*]\s*(\d+(?:-\d+)?|\d+\+?)(?:\s*reps?)?/i;
  const setsRepsMatch = clean.match(setsRepsRegex);
  if (setsRepsMatch) {
    sets = parseInt(setsRepsMatch[1], 10);
    reps = setsRepsMatch[2];
    clean = clean.replace(setsRepsMatch[0], '');
  }

  // Buscar descanso: ej. (90s) o 2 min o 120s
  const restRegex = /(?:descanso|rest)?\s*\(?(\d+)\s*(s|seg|min|m)\)?/i;
  const restMatch = clean.match(restRegex);
  if (restMatch) {
    const val = parseInt(restMatch[1], 10);
    const unit = restMatch[2].toLowerCase();
    restTime = unit.startsWith('m') ? `${val * 60}s` : `${val}s`;
    clean = clean.replace(restMatch[0], '');
  }

  // Buscar RIR o RPE
  const rirRegex = /\(?\b(RIR\s*\d+(?:-\d+)?|RPE\s*\d+(?:\.\d+)?)\b\)?/i;
  const rirMatch = clean.match(rirRegex);
  if (rirMatch) {
    rir = rirMatch[1].toUpperCase();
    clean = clean.replace(rirMatch[0], '');
  }

  // Limpiar caracteres sobrantes del nombre
  let exName = clean.replace(/[|\(\)\[\],;]+$/, '').replace(/^[|\(\)\[\],;]+/, '').trim();
  if (!exName) exName = `Ejercicio ${index}`;

  // Vincular con la librería científica
  const matched = findBestMatchingExercise(exName);

  return {
    id: `${dayId}_custom_e${index}_${Date.now() % 10000}`,
    name: exName,
    muscleGroup: matched ? matched.muscleGroup : 'General',
    loadFamily: matched ? matched.loadFamily : null,
    biomechanics: matched ? matched.biomechanics : null,
    sets,
    reps,
    rir,
    restTime,
    notes: matched?.prescription ? `Prescripción: ${matched.prescription}` : ''
  };
}

/**
 * Normaliza los días parseados garantizando claves y estructuras completas.
 */
export function normalizeParsedDays(days) {
  return days.map((day, idx) => ({
    id: day.id || `d${idx + 1}`,
    dayNumber: idx + 1,
    name: day.name || `Día ${idx + 1}`,
    type: day.type || (day.exercises && day.exercises.length > 0 ? 'workout' : 'rest'),
    focus: day.focus || (day.exercises && day.exercises.length > 0 ? `${day.exercises.length} Ejercicios Programados` : 'Descanso y Recuperación'),
    exercises: (day.exercises || []).map((ex, eIdx) => ({
      id: ex.id || `d${idx + 1}_e${eIdx + 1}_${Date.now() % 10000}`,
      name: ex.name || `Ejercicio ${eIdx + 1}`,
      muscleGroup: ex.muscleGroup || 'General',
      loadFamily: ex.loadFamily || null,
      biomechanics: ex.biomechanics || null,
      sets: parseInt(ex.sets, 10) || 3,
      reps: String(ex.reps || '8-12'),
      rir: ex.rir || 'RIR 1-2',
      restTime: ex.restTime || '90s',
      notes: ex.notes || ''
    }))
  }));
}

/**
 * Coincidencia difusa con la librería científica unificada.
 */
export function findBestMatchingExercise(name) {
  if (!name) return null;
  const cleanQuery = name.toLowerCase().replace(/[^a-z0-9áéíóúñ]/g, '');

  for (const ex of UNIFIED_EXERCISE_LIBRARY) {
    const cleanLib = ex.name.toLowerCase().replace(/[^a-z0-9áéíóúñ]/g, '');
    if (cleanLib === cleanQuery || cleanLib.includes(cleanQuery) || cleanQuery.includes(cleanLib)) {
      return ex;
    }
  }
  return null;
}
