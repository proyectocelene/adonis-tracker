/**
 * GESTOR MAESTRO DE MÁQUINAS Y CALIBRACIONES (Planta Alta / Planta Baja / Multi-Perfiles)
 * 
 * Garantiza:
 * 1. Persistencia infalible: las especificaciones (asiento, respaldo, muesca, piso) nunca se borran ni se pierden al cambiar o agregar ejercicios.
 * 2. Multi-estación independiente: Planta Alta y Planta Baja se guardan como perfiles separados sin sobreescribirse.
 * 3. Resolución canónica: si cambias de día, sustituyes un ejercicio o agregas uno personalizado, se heredan automáticamente las calibraciones existentes.
 * 4. Auto-recuperación: si las claves locales se limpian, rescata las calibraciones de sesiones previas en Firestore/IndexedDB.
 */

import { normalizeExerciseName, parseUnifiedCode } from './exerciseMatcher.js';

/**
 * Perfiles base de maquinaria real en ULTRAGYM (100% en lbs), indexados por unifiedCode.
 * Se usan exclusivamente como fallback cuando el usuario no tiene un perfil personalizado guardado.
 */
export const DEFAULT_ULTRAGYM_MACHINES = Object.freeze({
  '[PECH-CHEST_PRESS-CONV_01]': { type: 'stack', firstPlate: 20, plateStep: 5, unit: 'lbs' },
  '[PECH-INC_PRESS-NITRO_01]': { type: 'stack', firstPlate: 20, plateStep: 15, unit: 'lbs' },
  '[PECH-INC_PRESS-MANC_30]': { type: 'dumbbells', dumbbellStep: 10, unit: 'lbs' },
  '[PECH-PEC_DECK-STACK_01]': { type: 'stack', firstPlate: 20, plateStep: 10, unit: 'lbs' },
  '[HOMB-LAT_RAISE-MAQ_01]': { type: 'stack', firstPlate: 15, plateStep: 15, microWeight: 5, unit: 'lbs' },
  '[HOMB-LAT_RAISE-BEHIND_CABLE_01]': { type: 'stack', firstPlate: 5, plateStep: 5, unit: 'lbs' },
  '[HOMB-LAT_RAISE-CABLE_01]': { type: 'stack', firstPlate: 5, plateStep: 5, unit: 'lbs' },
  '[TRIC-OVERHEAD_EXT-CABLE_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[TRIC-PUSHDOWN-CABLE_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[CUAD-HACK_SQUAT-DISC_01]': { type: 'plates', baseWeight: 0, availablePlates: [5, 10, 25, 45], unit: 'lbs' },
  '[CUAD-LEG_PRESS-DISC_45_PB]': { type: 'plates', baseWeight: 0, availablePlates: [10, 25, 45], unit: 'lbs' },
  '[GLUT-LEG_PRESS-HIGH_FEET_45]': { type: 'plates', baseWeight: 0, availablePlates: [10, 25, 45], unit: 'lbs' },
  '[CUAD-LEG_EXT-STACK_01]': { type: 'stack', firstPlate: 20, plateStep: 15, microWeight: 5, unit: 'lbs' },
  '[ISQU-LEG_CURL-SEATED_01]': { type: 'stack', firstPlate: 20, plateStep: 10, unit: 'lbs' },
  '[ISQU-RDL-MANC_01]': { type: 'dumbbells', dumbbellStep: 10, unit: 'lbs' },
  '[ISQU-RDL-SMITH_01]': { type: 'dumbbells', dumbbellStep: 10, unit: 'lbs' },
  '[GLUT-BUTT_BLASTER-MAQ_01]': { type: 'stack', firstPlate: 25, plateStep: 12.5, unit: 'lbs' },
  '[ABDU-ABDUCTOR-STACK_01]': { type: 'stack', firstPlate: 20, plateStep: 15, unit: 'lbs' },
  '[PANT-CALF_RAISE-MAQ_01]': { type: 'stack', firstPlate: 30, plateStep: 20, unit: 'lbs' },
  '[ESPA-PULLDOWN-WIDE_01]': { type: 'stack', firstPlate: 30, plateStep: 10, unit: 'lbs' },
  '[ESPA-PULLDOWN-V_GRIP_01]': { type: 'stack', firstPlate: 30, plateStep: 10, unit: 'lbs' },
  '[ESPA-MACHINE_ROW-CHEST_SUPP_01]': { type: 'stack', firstPlate: 30, plateStep: 10, unit: 'lbs' },
  '[ESPA-SEATED_ROW-GIRONDA_01]': { type: 'stack', firstPlate: 30, plateStep: 10, unit: 'lbs' },
  '[ESPA-PULLOVER-HIGH_CABLE_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[HOMB-FACE_PULL-HIGH_CABLE_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[BICEP-CABLE_CURL-BAYESIAN_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[ABDO-CRUNCH-CABLE_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[ABDO-DECLINE_CRUNCH-DISC_01]': { type: 'stack', firstPlate: 10, plateStep: 5, unit: 'lbs' },
  '[BICEP-HAMMER_CURL-MANC_01]': { type: 'dumbbells', dumbbellStep: 10, unit: 'lbs' },
  '[BICEP-INCLINE_CURL-MANC_01]': { type: 'dumbbells', dumbbellStep: 10, unit: 'lbs' }
});

/**
 * Genera la clave base de almacenamiento de una máquina a partir de un ejercicio o nombre.
 */
export function getMachineStorageKey(exerciseOrName) {
  if (!exerciseOrName) return 'adonis_machine_default';
  const raw = typeof exerciseOrName === 'string'
    ? exerciseOrName
    : (exerciseOrName.name || exerciseOrName.exerciseName || exerciseOrName.canonicalName || exerciseOrName.id || 'default');
  const cleanName = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remover acentos
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return `adonis_machine_${cleanName || 'default'}`;
}

/**
 * Obtiene todas las claves posibles (IDs, slugs, códigos unificados, nombres canónicos)
 * para encontrar o guardar configuraciones de máquina sin perder el vínculo.
 */
const POSITIONAL_SLOT_REGEX = /^d\d+_(e\d+|cardio)/i;

export function getExerciseMachineKeys(exercise) {
  if (!exercise) return ['adonis_machine_default'];

  const keys = new Set();
  const id = exercise.id || exercise.exerciseId;
  const name = exercise.name || exercise.exerciseName || exercise.canonicalName || '';
  const originalName = exercise.originalName || '';
  const originalId = exercise.originalId || '';
  const uCode = exercise.unifiedCode || '';

  // NUNCA usar slots posicionales de rutina (ej. d1_e2, d4_e2, d6_e3) para evitar cruzar máquinas al reordenar el protocolo
  if (id && !POSITIONAL_SLOT_REGEX.test(String(id))) {
    keys.add(id);
    keys.add(`adonis_machine_${id}`);
    keys.add(`coachv2_machine_${id}`);
  }

  if (uCode) {
    keys.add(uCode);
    keys.add(getMachineStorageKey(uCode));
    // Extraer prefijo canónico de 2 segmentos: ej. [PECH-CHEST_PRESS]
    const match = uCode.match(/\[([A-Z]{4})-([A-Z0-9_]+)-/);
    if (match) {
      keys.add(`[${match[1]}-${match[2]}]`);
      keys.add(`adonis_machine_${match[1].toLowerCase()}_${match[2].toLowerCase()}`);
    }
  }

  if (name) {
    const slug = getMachineStorageKey(name);
    keys.add(slug);
    keys.add(`coachv2_profiles_${slug}`);
    const norm = normalizeExerciseName(name);
    if (norm) keys.add(getMachineStorageKey(norm));
  }

  if (originalId && !POSITIONAL_SLOT_REGEX.test(String(originalId))) keys.add(originalId);
  if (originalName) keys.add(getMachineStorageKey(originalName));

  return Array.from(keys).filter(Boolean);
}

/**
 * Sanea y asegura que un objeto de configuración de máquina sea un perfil válido
 */
export function sanitizeMachineProfile(raw, defaultName = 'Máquina', index = 1) {
  if (!raw || typeof raw !== 'object') return null;

  const floor = (raw.floor || '').trim() || (raw.name?.toLowerCase().includes('alta') ? 'Planta Alta' : (raw.name?.toLowerCase().includes('baja') ? 'Planta Baja' : 'Planta Baja'));
  const station = (raw.station || '').trim() || `Máquina #${index}`;
  const seat = raw.seat !== undefined && raw.seat !== null ? String(raw.seat).trim() : '';
  const backrest = raw.backrest !== undefined && raw.backrest !== null ? String(raw.backrest).trim() : '';
  const notch = raw.notch !== undefined && raw.notch !== null ? String(raw.notch).trim() : '';
  const pad = raw.pad !== undefined && raw.pad !== null ? String(raw.pad).trim() : '';
  const notes = (raw.notes || '').trim();
  const type = raw.type || 'stack';

  return {
    id: raw.id || `prof_${floor.toLowerCase().replace(/\s+/g, '_')}_${index}_${Date.now()}`,
    name: raw.name || `${station} (${floor})`,
    floor,
    station,
    seat,
    backrest,
    notch,
    pad,
    notes,
    isDefault: !!raw.isDefault,
    type,
    stackPreset: raw.stackPreset || 'linear',
    plateStep: raw.plateStep !== undefined ? parseFloat(raw.plateStep) || 10 : 10,
    firstPlate: raw.firstPlate !== undefined ? parseFloat(raw.firstPlate) || 10 : 10,
    microWeight: parseFloat(raw.microWeight) || 0,
    availableWeights: Array.isArray(raw.availableWeights) ? raw.availableWeights : [],
    baseWeight: raw.baseWeight !== undefined ? parseFloat(raw.baseWeight) || 0 : 0,
    availablePlates: Array.isArray(raw.availablePlates) ? raw.availablePlates : [45, 35, 25, 10, 5, 2.5],
    smallestPlate: raw.smallestPlate || 2.5,
    dumbbellStep: parseFloat(raw.dumbbellStep) || 5,
    minIncrement: raw.minIncrement || 5,
    v44Verified: Boolean(raw.v44Verified),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
}

function getEffectiveMachineStep(cfg) {
  if (!cfg) return null;
  if (cfg.type === 'plates') {
    const plates = Array.isArray(cfg.availablePlates) && cfg.availablePlates.length > 0 ? cfg.availablePlates : [cfg.smallestPlate || 2.5];
    return Math.min(...plates) * 2;
  }
  if (cfg.type === 'dumbbells') {
    return parseFloat(cfg.dumbbellStep) || parseFloat(cfg.minIncrement) || 5;
  }
  return parseFloat(cfg.plateStep) || parseFloat(cfg.step) || parseFloat(cfg.minIncrement) || 10;
}

/**
 * Sanitiza perfiles heredados (sin `v44Verified: true`) cuyos parámetros de carga contradicen
 * a `DEFAULT_ULTRAGYM_MACHINES[unifiedCode]` o no contienen `anchorWeight`, preservando
 * intactos los campos de estación del usuario (`name`, `floor`, `station`, `seat`, `pad`, `notch`, `notes`).
 */
export function resolveEffectiveMachineConfig(machineConfig, exercise = null, anchorWeight = 0) {
  const uCode = exercise?.unifiedCode;
  const preset = uCode ? DEFAULT_ULTRAGYM_MACHINES[uCode] : null;
  if (!machineConfig) {
    return preset ? { ...preset, isDefault: true, source: 'ultragym_default' } : null;
  }
  if (machineConfig.v44Verified === true || !preset) {
    return machineConfig;
  }

  const expectedStep = getEffectiveMachineStep(preset);
  const actualStep = getEffectiveMachineStep(machineConfig);
  const stepMismatch = actualStep !== expectedStep || machineConfig.type !== preset.type || (parseFloat(machineConfig.microWeight) || 0) !== (parseFloat(preset.microWeight) || 0);

  let anchorMismatch = false;
  if (anchorWeight > 0) {
    if (Array.isArray(machineConfig.availableWeights) && machineConfig.availableWeights.length > 0) {
      const micro = parseFloat(machineConfig.microWeight) || 0;
      const allPossible = new Set(machineConfig.availableWeights.map(Number));
      if (micro > 0) {
        machineConfig.availableWeights.forEach(w => allPossible.add(Number(w) + micro));
      }
      if (!allPossible.has(Number(anchorWeight))) {
        anchorMismatch = true;
      }
    } else if (machineConfig.type === 'stack') {
      const fp = parseFloat(machineConfig.firstPlate) || 10;
      const st = parseFloat(machineConfig.plateStep) || parseFloat(machineConfig.step) || 10;
      if (anchorWeight < fp || Math.abs(((anchorWeight - fp) % st)) > 0.01) {
        anchorMismatch = true;
      }
    }
  }

  if (!stepMismatch && !anchorMismatch) {
    return machineConfig;
  }

  return {
    id: machineConfig.id,
    name: machineConfig.name,
    floor: machineConfig.floor,
    station: machineConfig.station,
    seat: machineConfig.seat || '',
    backrest: machineConfig.backrest || '',
    notch: machineConfig.notch || '',
    pad: machineConfig.pad || '',
    notes: machineConfig.notes || '',
    isDefault: Boolean(machineConfig.isDefault),
    type: preset.type,
    firstPlate: preset.firstPlate,
    plateStep: preset.plateStep,
    microWeight: preset.microWeight || 0,
    availablePlates: preset.availablePlates,
    baseWeight: preset.baseWeight,
    dumbbellStep: preset.dumbbellStep,
    unit: preset.unit || 'lbs',
    source: 'ultragym_sanitized'
  };
}

/**
 * Carga de forma exhaustiva y resiliente todos los perfiles de máquina guardados para un ejercicio.
 * Busca en:
 * 1. Almacén de perfiles (globalMachineProfiles)
 * 2. Almacén tradicional (globalMachineConfigs)
 * 3. Datos de la sesión de hoy (exerciseData)
 * 4. Datos de la sesión previa (previousData)
 * 5. Historial reciente de sesiones (workoutHistory)
 * 6. LocalStorage legacy
 */
export function loadMachineProfilesForExercise(exercise, {
  globalMachineProfiles = {},
  globalMachineConfigs = {},
  previousData = {},
  exerciseData = {},
  workoutHistory = []
} = {}) {
  if (!exercise) return [];

  const keys = getExerciseMachineKeys(exercise);
  const foundProfiles = [];
  const seenIds = new Set();
  const seenFloorStation = new Set();

  const exName = (exercise.name || '').toLowerCase();
  const exEq = (exercise.equipment || '').toLowerCase();
  const parsed = parseUnifiedCode(exercise.unifiedCode);
  const isDumbbell = Boolean(
    parsed?.isDumbbell ||
    exEq.includes('mancuerna') ||
    exName.includes('mancuerna') ||
    exName.includes('dumbbell')
  );

  const addProfile = (raw, srcLabel = '') => {
    if (!raw || typeof raw !== 'object') return;
    const sanitized = sanitizeMachineProfile(raw, exercise.name, foundProfiles.length + 1);
    if (!sanitized) return;

    // Validación de compatibilidad biomecánica:
    // Si el ejercicio es de mancuernas, NO adoptar perfiles de torre de placas ni máquinas convergentes
    if (isDumbbell) {
      const isMachineProfile = sanitized.type === 'stack' || sanitized.type === 'plates' || 
        (sanitized.name && (
          sanitized.name.toLowerCase().includes('máquina') ||
          sanitized.name.toLowerCase().includes('maquina') ||
          sanitized.name.toLowerCase().includes('nitro') ||
          sanitized.name.toLowerCase().includes('hammer') ||
          sanitized.name.toLowerCase().includes('smith') ||
          sanitized.name.toLowerCase().includes('placas')
        ));
      if (isMachineProfile) return;
    }

    // Deduplicación inteligente por ID o por coincidencia de Piso + Estación/Nombre
    const floorKey = `${sanitized.floor}_${sanitized.station || sanitized.name}`.toLowerCase();
    if (seenIds.has(sanitized.id) || seenFloorStation.has(floorKey)) return;

    seenIds.add(sanitized.id);
    seenFloorStation.add(floorKey);
    foundProfiles.push(sanitized);
  };

  // 1. Buscar en globalMachineProfiles en todas las claves posibles
  for (const k of keys) {
    const list = globalMachineProfiles?.[k];
    if (Array.isArray(list) && list.length > 0) {
      list.forEach(p => addProfile(p, 'globalMachineProfiles'));
    }
  }

  // 2. Buscar en globalMachineConfigs (migrar configuraciones previas a perfiles si faltan)
  for (const k of keys) {
    const conf = globalMachineConfigs?.[k];
    if (conf && typeof conf === 'object' && (conf.name || conf.floor || conf.station || conf.seat || conf.type)) {
      addProfile(conf, 'globalMachineConfigs');
    }
  }

  // 3. Buscar en exerciseData de la sesión actual
  if (exerciseData?.machineConfig && typeof exerciseData.machineConfig === 'object') {
    addProfile(exerciseData.machineConfig, 'exerciseData');
  }

  // 4. Buscar en previousData (sesión previa directa del ejercicio)
  if (previousData?.machineConfig && typeof previousData.machineConfig === 'object') {
    addProfile(previousData.machineConfig, 'previousData');
  }

  // 5. Si aún no hay perfiles o solo hay 1, escanear el historial archivado para recuperar calibraciones previas
  if (foundProfiles.length < 2 && Array.isArray(workoutHistory) && workoutHistory.length > 0) {
    const histRev = [...workoutHistory].reverse();
    for (const session of histRev) {
      const detailed = session.exercisesDetailed || [];
      for (const exDet of detailed) {
        const isMatch = (exercise.unifiedCode && exDet.unifiedCode === exercise.unifiedCode) ||
          (exercise.name && exDet.name && exDet.name.toLowerCase() === exercise.name.toLowerCase()) ||
          (exercise.id && !POSITIONAL_SLOT_REGEX.test(String(exercise.id)) && exDet.id === exercise.id);
        if (isMatch && exDet.machineConfig && typeof exDet.machineConfig === 'object') {
          addProfile(exDet.machineConfig, 'workoutHistory');
          if (foundProfiles.length >= 2) break;
        }
      }
      if (foundProfiles.length >= 2) break;
    }
  }

  // 6. Respaldo de compatibilidad desde localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const slugKey = getMachineStorageKey(exercise);
      const rawStored = localStorage.getItem(`coachv2_profiles_${slugKey}`) || localStorage.getItem(slugKey);
      if (rawStored) {
        const parsed = JSON.parse(rawStored);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => addProfile(p, 'localStorageList'));
        } else if (parsed && typeof parsed === 'object') {
          addProfile(parsed, 'localStorageObj');
        }
      }
    } catch (e) {}
  }

  // Si es ejercicio de mancuernas y no tiene perfiles compatibles, generar perfil de rack de mancuernas
  if (isDumbbell && foundProfiles.length === 0) {
    const ultragymPreset = exercise?.unifiedCode ? DEFAULT_ULTRAGYM_MACHINES[exercise.unifiedCode] : null;
    const step = ultragymPreset?.dumbbellStep || 5;
    foundProfiles.push({
      id: 'prof_mancuernas_default',
      name: `Mancuernas (Incrementos de ${step} lbs)`,
      floor: 'Planta Baja',
      station: 'Mancuernas',
      seat: '',
      pad: '',
      notch: '',
      notes: 'Mancuernas de peso libre en rack',
      type: 'dumbbells',
      dumbbellStep: step,
      minIncrement: step,
      isDefault: true,
      availableWeights: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120]
    });
  }

  // Si se encontraron perfiles pero ninguno tiene isDefault, marcar el primero
  if (foundProfiles.length > 0 && !foundProfiles.some(p => p.isDefault)) {
    foundProfiles[0].isDefault = true;
  }

  return foundProfiles;
}

/**
 * Resuelve la configuración de máquina activa para la sesión actual.
 * Prioriza:
 * 1. Selección explícita en exerciseData de hoy
 * 2. Perfil marcado como default
 * 3. Continuidad con la máquina de la sesión previa
 * 4. Primer perfil disponible
 * 5. Perfil base ULTRAGYM por unifiedCode (solo si no existe perfil personalizado guardado)
 */
export function getActiveMachineConfig(profiles = [], exerciseData = {}, previousData = {}, exercise = null) {
  const ultragymDefault = exercise?.unifiedCode && DEFAULT_ULTRAGYM_MACHINES[exercise.unifiedCode]
    ? { ...DEFAULT_ULTRAGYM_MACHINES[exercise.unifiedCode], isDefault: true, source: 'ultragym_default' }
    : null;

  if (!Array.isArray(profiles) || profiles.length === 0) {
    // Si no hay perfiles registrados pero previousData o exerciseData tienen un objeto de máquina
    if (exerciseData?.machineConfig && typeof exerciseData.machineConfig === 'object') {
      return resolveEffectiveMachineConfig(sanitizeMachineProfile(exerciseData.machineConfig), exercise);
    }
    if (previousData?.machineConfig && typeof previousData.machineConfig === 'object') {
      return resolveEffectiveMachineConfig(sanitizeMachineProfile(previousData.machineConfig), exercise);
    }
    return ultragymDefault;
  }

  // 1. Selección de hoy
  if (exerciseData?.machineConfig?.id) {
    const matchToday = profiles.find(p => p.id === exerciseData.machineConfig.id);
    if (matchToday) return resolveEffectiveMachineConfig(matchToday, exercise);
  }

  // Si solo existe el perfil sintético genérico de mancuernas y hay preset ULTRAGYM específico, usar el preset
  if (profiles.length === 1 && profiles[0]?.id === 'prof_mancuernas_default' && ultragymDefault) {
    return ultragymDefault;
  }

  // 2. Perfil predeterminado
  const defaultProf = profiles.find(p => p.isDefault);
  if (defaultProf) return resolveEffectiveMachineConfig(defaultProf, exercise);

  // 3. Continuidad con la sesión previa (ej. si la sesión pasada fue en Planta Alta, usar Planta Alta)
  if (previousData?.machineConfig?.floor) {
    const matchPrevFloor = profiles.find(p => p.floor?.toLowerCase() === previousData.machineConfig.floor.toLowerCase());
    if (matchPrevFloor) return resolveEffectiveMachineConfig(matchPrevFloor, exercise);
  }

  return resolveEffectiveMachineConfig(profiles[0], exercise);
}

/**
 * Guarda una configuración de máquina y su lista de perfiles sincronizando
 * a través de todas las claves canónicas en Firestore, IndexedDB y localStorage.
 */
export function saveMachineConfigAndProfiles({
  exercise,
  configData,
  updatedProfiles,
  setGlobalMachineProfiles,
  setGlobalMachineConfigs,
  onUpdateExerciseMeta
}) {
  if (!exercise) return;

  const keys = getExerciseMachineKeys(exercise);
  const slugKey = getMachineStorageKey(exercise);

  const verifiedConfig = configData ? { ...configData, v44Verified: true } : configData;
  const verifiedProfiles = Array.isArray(updatedProfiles)
    ? updatedProfiles.map(p => (p && typeof p === 'object' ? { ...p, v44Verified: true } : p))
    : updatedProfiles;

  // 1. Notificar al estado de la sesión actual para que todayWorkoutData lo tenga de inmediato
  if (onUpdateExerciseMeta) {
    onUpdateExerciseMeta({ machineConfig: verifiedConfig });
  }

  // 2. Persistir lista de perfiles en coachv2_machine_profiles (Firestore + IndexedDB)
  if (setGlobalMachineProfiles && Array.isArray(verifiedProfiles)) {
    setGlobalMachineProfiles(prev => {
      const next = { ...(prev || {}) };
      keys.forEach(k => {
        next[k] = verifiedProfiles;
      });
      return next;
    });
  }

  // 3. Persistir configuración activa en coachv2_machine_configs (Firestore + IndexedDB)
  if (setGlobalMachineConfigs) {
    setGlobalMachineConfigs(prev => {
      const next = { ...(prev || {}) };
      if (verifiedConfig) {
        keys.forEach(k => {
          next[k] = verifiedConfig;
        });
      } else {
        keys.forEach(k => {
          delete next[k];
        });
      }
      return next;
    });
  }

  // 4. Caché de compatibilidad offline en localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (Array.isArray(verifiedProfiles) && verifiedProfiles.length > 0) {
        const serializedList = JSON.stringify(verifiedProfiles);
        localStorage.setItem(`coachv2_profiles_${slugKey}`, serializedList);
      }
      if (verifiedConfig) {
        const serializedConfig = JSON.stringify(verifiedConfig);
        localStorage.setItem(slugKey, serializedConfig);
        if (exercise.id) {
          localStorage.setItem(`adonis_machine_${exercise.id}`, serializedConfig);
          localStorage.setItem(`coachv2_machine_${exercise.id}`, serializedConfig);
        }
      }
    } catch (e) {}
  }
}
