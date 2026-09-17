/**
 * GESTOR MAESTRO DE MÁQUINAS Y CALIBRACIONES (Planta Alta / Planta Baja / Multi-Perfiles)
 * 
 * Garantiza:
 * 1. Persistencia infalible: las especificaciones (asiento, respaldo, muesca, piso) nunca se borran ni se pierden al cambiar o agregar ejercicios.
 * 2. Multi-estación independiente: Planta Alta y Planta Baja se guardan como perfiles separados sin sobreescribirse.
 * 3. Resolución canónica: si cambias de día, sustituyes un ejercicio o agregas uno personalizado, se heredan automáticamente las calibraciones existentes.
 * 4. Auto-recuperación: si las claves locales se limpian, rescata las calibraciones de sesiones previas en Firestore/IndexedDB.
 */

import { normalizeExerciseName } from './exerciseMatcher.js';

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
export function getExerciseMachineKeys(exercise) {
  if (!exercise) return ['adonis_machine_default'];

  const keys = new Set();
  const id = exercise.id || exercise.exerciseId;
  const name = exercise.name || exercise.exerciseName || exercise.canonicalName || '';
  const originalName = exercise.originalName || '';
  const originalId = exercise.originalId || '';
  const uCode = exercise.unifiedCode || '';

  if (id) {
    keys.add(id);
    keys.add(`adonis_machine_${id}`);
    keys.add(`coachv2_machine_${id}`);
  }

  if (name) {
    const slug = getMachineStorageKey(name);
    keys.add(slug);
    keys.add(`coachv2_profiles_${slug}`);
    const norm = normalizeExerciseName(name);
    if (norm) keys.add(getMachineStorageKey(norm));
  }

  if (originalId) keys.add(originalId);
  if (originalName) keys.add(getMachineStorageKey(originalName));

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
    updatedAt: raw.updatedAt || new Date().toISOString()
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

  const addProfile = (raw, srcLabel = '') => {
    if (!raw || typeof raw !== 'object') return;
    const sanitized = sanitizeMachineProfile(raw, exercise.name, foundProfiles.length + 1);
    if (!sanitized) return;

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
        const isMatch = (exDet.id === exercise.id) || 
          (exercise.name && exDet.name && exDet.name.toLowerCase() === exercise.name.toLowerCase()) ||
          (exercise.unifiedCode && exDet.unifiedCode === exercise.unifiedCode);
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
 */
export function getActiveMachineConfig(profiles = [], exerciseData = {}, previousData = {}) {
  if (!Array.isArray(profiles) || profiles.length === 0) {
    // Si no hay perfiles registrados pero previousData o exerciseData tienen un objeto de máquina
    if (exerciseData?.machineConfig && typeof exerciseData.machineConfig === 'object') {
      return sanitizeMachineProfile(exerciseData.machineConfig);
    }
    if (previousData?.machineConfig && typeof previousData.machineConfig === 'object') {
      return sanitizeMachineProfile(previousData.machineConfig);
    }
    return null;
  }

  // 1. Selección de hoy
  if (exerciseData?.machineConfig?.id) {
    const matchToday = profiles.find(p => p.id === exerciseData.machineConfig.id);
    if (matchToday) return matchToday;
  }

  // 2. Perfil predeterminado
  const defaultProf = profiles.find(p => p.isDefault);
  if (defaultProf) return defaultProf;

  // 3. Continuidad con la sesión previa (ej. si la sesión pasada fue en Planta Alta, usar Planta Alta)
  if (previousData?.machineConfig?.floor) {
    const matchPrevFloor = profiles.find(p => p.floor?.toLowerCase() === previousData.machineConfig.floor.toLowerCase());
    if (matchPrevFloor) return matchPrevFloor;
  }

  return profiles[0];
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

  // 1. Notificar al estado de la sesión actual para que todayWorkoutData lo tenga de inmediato
  if (onUpdateExerciseMeta) {
    onUpdateExerciseMeta({ machineConfig: configData });
  }

  // 2. Persistir lista de perfiles en coachv2_machine_profiles (Firestore + IndexedDB)
  if (setGlobalMachineProfiles && Array.isArray(updatedProfiles)) {
    setGlobalMachineProfiles(prev => {
      const next = { ...(prev || {}) };
      keys.forEach(k => {
        next[k] = updatedProfiles;
      });
      return next;
    });
  }

  // 3. Persistir configuración activa en coachv2_machine_configs (Firestore + IndexedDB)
  if (setGlobalMachineConfigs) {
    setGlobalMachineConfigs(prev => {
      const next = { ...(prev || {}) };
      if (configData) {
        keys.forEach(k => {
          next[k] = configData;
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
      if (Array.isArray(updatedProfiles) && updatedProfiles.length > 0) {
        const serializedList = JSON.stringify(updatedProfiles);
        localStorage.setItem(`coachv2_profiles_${slugKey}`, serializedList);
      }
      if (configData) {
        const serializedConfig = JSON.stringify(configData);
        localStorage.setItem(slugKey, serializedConfig);
        if (exercise.id) {
          localStorage.setItem(`adonis_machine_${exercise.id}`, serializedConfig);
          localStorage.setItem(`coachv2_machine_${exercise.id}`, serializedConfig);
        }
      }
    } catch (e) {}
  }
}
