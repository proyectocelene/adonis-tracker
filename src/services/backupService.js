import { db, sanitizeForFirestore } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { scientificProtocol } from '../data/scientificProtocol.js';
import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary.js';
import { stripInternalMetadata } from './storeSyncHelper.js';

/**
 * Filtra y elimina cualquier clave que contenga credenciales de API (DeepSeek, etc.)
 */
export function stripSensitiveBackupKeys(data) {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(stripSensitiveBackupKeys);
  const clean = {};
  for (const [k, v] of Object.entries(data)) {
    if (/api_?key/i.test(k) || /deepseek/i.test(k)) {
      continue;
    }
    clean[k] = (v && typeof v === 'object') ? stripSensitiveBackupKeys(v) : v;
  }
  return clean;
}

/**
 * Función auxiliar para descargar un objeto como archivo JSON
 */
export function downloadJsonFile(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.setAttribute('href', url);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Función auxiliar para descargar un archivo de texto plano (.txt)
 */
export function downloadTextFile(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.setAttribute('href', url);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Sanea y repara el historial de entrenamientos sin alterar datos del atleta:
 * 1. Recupera la fecha ISO (YYYY-MM-DD) para sesiones huérfanas a partir de dateString o timestamp.
 * 2. Limpia banderas internas como isWarmupDone dentro del mapa de ejercicios.
 * 3. Descarta nodos corruptos que solo contengan machineConfig sin series.
 * 4. Sintetiza nombres de cardio a partir del campo machine si no tienen name.
 * 5. Ordena cronológicamente en orden ascendente estricto.
 */
export function sanitizeWorkoutHistory(rawHistory = []) {
  if (!Array.isArray(rawHistory)) return [];

  const spanishMonths = {
    'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
    'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
  };

  return rawHistory.map(ses => {
    if (!ses || typeof ses !== 'object') return null;
    const cleanSes = { ...ses };

    // 1. Reparar campo date si falta
    if (!cleanSes.date && cleanSes.dateString) {
      const match = cleanSes.dateString.match(/(\d{1,2})\s+(?:de\s+)?([a-zA-ZáéíóúÁÉÍÓÚ]+)(?:\s+(?:de\s+)?(\d{4}))?/i);
      if (match) {
        const day = match[1].padStart(2, '0');
        const mStr = match[2].slice(0, 3).toLowerCase();
        const year = match[3] || '2026';
        const monthNum = spanishMonths[mStr];
        if (monthNum) {
          cleanSes.date = `${year}-${monthNum}-${day}`;
        }
      }
    }
    if (!cleanSes.date && cleanSes.timestamp) {
      cleanSes.date = cleanSes.timestamp.split('T')[0];
    }

    // 2. Limpiar nodo exercises
    if (cleanSes.exercises && typeof cleanSes.exercises === 'object' && !Array.isArray(cleanSes.exercises)) {
      const sanitizedExs = {};
      Object.entries(cleanSes.exercises).forEach(([k, v]) => {
        if (!v || typeof v !== 'object' || k === 'isWarmupDone') return;

        // Descartar si solo tiene machineConfig y nada más
        const keys = Object.keys(v);
        const hasSets = Array.isArray(v.sets) && v.sets.length > 0;
        const hasNumericKeys = keys.some(key => !isNaN(parseInt(key, 10)));
        const hasName = Boolean(v.name || v.exerciseName || v.machine);

        if (!hasSets && !hasNumericKeys && !hasName) return;

        const cleanEx = { ...v };
        if (!cleanEx.name && cleanEx.machine) {
          cleanEx.name = cleanEx.machine;
        }
        sanitizedExs[k] = cleanEx;
      });
      cleanSes.exercises = sanitizedExs;
    }

    return cleanSes;
  }).filter(Boolean).sort((a, b) => {
    const timeA = new Date(a.date ? `${a.date}T12:00:00` : (a.timestamp || 0)).getTime();
    const timeB = new Date(b.date ? `${b.date}T12:00:00` : (b.timestamp || 0)).getTime();
    return timeA - timeB;
  });
}

/**
 * 1. EXPORTACIÓN MAESTRA TOTAL DE FIREBASE
 * Descarga el 100% de la base de datos de Firebase Firestore del usuario autenticado:
 * - Historial completo de entrenamientos (subcolección history)
 * - Todos los estados y configuraciones (subcolección store: active workouts, body metrics, custom exercises, swapped, routine overrides, etc.)
 * - Estructura base del protocolo científico y catálogo de ejercicios
 */
export async function exportFullDatabase(currentUser, options = {}) {
  let workoutHistory = [];
  const storeData = {};

  // 1. Obtener datos directamente de Firebase Firestore (fuente única de verdad)
  if (currentUser && currentUser.uid) {
    try {
      // 1.1 Obtener sesiones activas de la subcolección 'history' (excluyendo soft-deleted)
      const historyRef = collection(db, 'users', currentUser.uid, 'history');
      const historySnapshot = await getDocs(historyRef);
      workoutHistory = historySnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(s => !s.deletedAt);

      // 1.2 Obtener todos los documentos de la subcolección 'store'
      const storeRef = collection(db, 'users', currentUser.uid, 'store');
      const storeSnapshot = await getDocs(storeRef);
      storeSnapshot.docs.forEach(doc => {
        storeData[doc.id] = doc.data().value !== undefined ? doc.data().value : doc.data();
      });
    } catch (err) {
      console.warn("[Backup] Aviso leyendo Firestore durante exportación:", err);
    }
  }

  // 2. Sanitizar historial sin mezclar con volcados locales obsoletos
  const mergedWorkoutHistory = sanitizeWorkoutHistory(workoutHistory);

  // Extraer datos clave para acceso directo y compatibilidad
  const currentActiveSessions = storeData['coachv2_active_workouts'] || {};
  const customExercises = storeData['coachv2_custom_day_exercises'] || {};
  const swappedExercises = storeData['coachv2_swapped_exercises'] || {};
  const skippedExercises = storeData['coachv2_skipped_exercises'] || {};
  const exerciseOrders = storeData['coachv2_exercise_orders'] || {};
  const bodyWeightHistory = storeData['coachv2_body_metrics_history'] || [];
  const bodyComposition = storeData['coachv2_body_composition_data'] || {};
  const physiqueGoal = storeData['coachv2_physique_goal'] || {};
  const machineConfigs = storeData['coachv2_machine_configs'] || {};
  const machineProfiles = storeData['coachv2_machine_profiles'] || {};
  const smartwatchKcal = storeData['coachv2_smartwatch_kcal'] || {};
  const customRoutine = storeData['coachv2_custom_routine'] || null;
  const mesocycleStartDate = storeData['coachv2_mesocycle_start'] || null;
  const weightPreferredUnit = storeData['coachv2_weight_preferred_unit'] || 'kg';
  const googleSheetsUrl = storeData['coachv2_google_sheets_url'] || '';
  const deloadActive = storeData['coachv2_deload_active'] !== undefined ? storeData['coachv2_deload_active'] : false;
  const deloadCycleConfig = storeData['coachv2_deload_cycle_config'] || null;
  const weekSplitOverride = storeData['coachv2_week_split_override'] || null;
  const dismissedPendingAlerts = storeData['coachv2_dismissed_pending_alerts'] || {};

  // Sanitizar volcados de claves sensibles (API Keys)
  const safeStoreDump = stripSensitiveBackupKeys(storeData);

  const fullMasterBackup = {
    appVersion: "COACH V2 - Protocolo Adonis Científico (Backup Maestro 100% Firebase & Local)",
    exportTimestamp: new Date().toISOString(),
    atleta: currentUser?.displayName || "Carlos Donato",
    userId: currentUser?.uid || "local_user",
    userEmail: currentUser?.email || "",
    
    // Colecciones y Métricas Principales
    workoutHistory: mergedWorkoutHistory,
    bodyWeightHistory,
    bodyComposition,
    physiqueGoal,
    machineConfigs,
    machineProfiles,
    currentActiveSessions,
    customExercises,
    swappedExercises,
    skippedExercises,
    exerciseOrders,
    smartwatchKcal,
    customRoutine,
    mesocycleStartDate,
    weightPreferredUnit,
    googleSheetsUrl,
    deloadActive,
    deloadCycleConfig,
    weekSplitOverride,
    dismissedPendingAlerts,

    // Estructuras de Referencia
    scientificProtocol,
    unifiedExerciseLibrary: UNIFIED_EXERCISE_LIBRARY,

    // Volcado Completo Firestore (sanitizado sin credenciales)
    firestoreStoreDump: safeStoreDump,
    rawIndexedDBDump: {}
  };

  const filename = options.isAutoBackup
    ? `COACH_V2_PreRestore_AutoBackup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    : `COACH_V2_Backup_Total_Firebase_${new Date().toISOString().split('T')[0]}.json`;

  downloadJsonFile(fullMasterBackup, filename);
  return { success: true, countSessions: mergedWorkoutHistory.length, filename };
}

/**
 * 2. EXPORTAR ESTRUCTURA DE RUTINA (JSON & TXT)
 */
export function exportRoutineStructure(activeRoutine, customExercisesMap = {}) {
  const routineToExport = activeRoutine || scientificProtocol;

  // 1. Versión JSON Estructurada
  const routineJson = {
    exportDate: new Date().toISOString(),
    title: "Estructura Oficial de Rutinas - Protocolo Adonis",
    days: routineToExport.map(day => {
      const customs = customExercisesMap[day.id] || [];
      const exercises = [...(day.exercises || []), ...customs];
      return {
        id: day.id,
        name: day.name,
        focus: day.focus || "",
        type: day.type || "workout",
        exerciseCount: exercises.length,
        exercises: exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          muscleGroup: ex.muscleGroup || "General",
          sets: ex.sets || 3,
          reps: ex.reps || "10-12",
          restTime: ex.restTime || "90 s",
          biomechanics: ex.biomechanics || "",
          equivalents: ex.equivalents || []
        }))
      };
    })
  };

  downloadJsonFile(routineJson, `Rutina_Adonis_Estructura_${new Date().toISOString().split('T')[0]}.json`);

  // 2. Versión Texto Formateado Legible
  let textContent = `=====================================================\n`;
  textContent += ` PROTOCOLO ADONIS - ESTRUCTURA OFICIAL DE RUTINAS\n`;
  textContent += ` Generado: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
  textContent += `=====================================================\n\n`;

  routineJson.days.forEach((day, index) => {
    textContent += `-----------------------------------------------------\n`;
    textContent += `📌 DÍA ${index + 1}: ${day.name.toUpperCase()}\n`;
    if (day.focus) textContent += `🎯 Enfoque: ${day.focus}\n`;
    textContent += `-----------------------------------------------------\n`;
    
    if (!day.exercises || day.exercises.length === 0) {
      textContent += `(Día de descanso programado)\n\n`;
      return;
    }

    day.exercises.forEach((ex, exIdx) => {
      textContent += `${exIdx + 1}. ${ex.name}\n`;
      textContent += `   • Músculo: ${ex.muscleGroup}\n`;
      textContent += `   • Prescripción: ${ex.sets} series x ${ex.reps} reps | Descanso: ${ex.restTime}\n`;
      if (ex.biomechanics) textContent += `   • Clave Técnica: ${ex.biomechanics}\n`;
      if (ex.equivalents && ex.equivalents.length > 0) {
        textContent += `   • Alternativos: ${ex.equivalents.map(eq => eq.name).join(' | ')}\n`;
      }
      textContent += `\n`;
    });
    textContent += `\n`;
  });

  downloadTextFile(textContent, `Rutina_Adonis_Texto_Legible_${new Date().toISOString().split('T')[0]}.txt`);
  return { success: true };
}

/**
 * 3. EXPORTAR CATÁLOGO DE EJERCICIOS Y MÁQUINAS (JSON)
 */
export function exportExerciseLibrary() {
  const libraryExport = {
    exportDate: new Date().toISOString(),
    title: "Catálogo Unificado de Ejercicios y Máquinas Adonis",
    totalExercises: UNIFIED_EXERCISE_LIBRARY.length,
    exercises: UNIFIED_EXERCISE_LIBRARY
  };
  downloadJsonFile(libraryExport, `Catalogo_Ejercicios_Adonis_${new Date().toISOString().split('T')[0]}.json`);
  return { success: true, count: UNIFIED_EXERCISE_LIBRARY.length };
}

export async function exportWorkoutHistory(currentUser) {
  let workoutHistory = [];
  if (currentUser && currentUser.uid) {
    try {
      const historyRef = collection(db, 'users', currentUser.uid, 'history');
      const snapshot = await getDocs(historyRef);
      workoutHistory = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(s => !s.deletedAt);
    } catch (e) {
      console.warn("Error leyendo Firestore en exportWorkoutHistory:", e);
    }
  }

  const cleanHistory = sanitizeWorkoutHistory(workoutHistory);

  const historyExport = {
    exportDate: new Date().toISOString(),
    atleta: currentUser?.displayName || "Carlos Donato",
    totalSessions: cleanHistory.length,
    history: cleanHistory
  };

  downloadJsonFile(historyExport, `Historial_Entrenamientos_${new Date().toISOString().split('T')[0]}.json`);
  return { success: true, count: cleanHistory.length };
}

/**
 * 5. EXPORTAR HISTORIAL DE PESO CORPORAL Y MEDIDAS (JSON)
 */
export async function exportBodyMetrics(currentUser) {
  let bodyMetrics = [];
  let bodyComposition = {};
  let physiqueGoal = {};

  if (currentUser) {
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'store', 'coachv2_body_metrics_history');
      const snap = await getDoc(docRef);
      if (snap.exists()) bodyMetrics = snap.data().value || [];

      const compRef = doc(db, 'users', currentUser.uid, 'store', 'coachv2_body_composition_data');
      const compSnap = await getDoc(compRef);
      if (compSnap.exists()) bodyComposition = compSnap.data().value || {};

      const goalRef = doc(db, 'users', currentUser.uid, 'store', 'coachv2_physique_goal');
      const goalSnap = await getDoc(goalRef);
      if (goalSnap.exists()) physiqueGoal = goalSnap.data().value || {};
    } catch (e) {
      console.warn("Error leyendo Firestore en exportBodyMetrics:", e);
    }
  }

  const metricsExport = {
    exportDate: new Date().toISOString(),
    atleta: currentUser?.displayName || "Carlos Donato",
    totalRecords: bodyMetrics.length,
    records: bodyMetrics,
    latestBodyComposition: bodyComposition,
    physiqueGoal
  };

  downloadJsonFile(metricsExport, `Historial_Peso_Corporal_${new Date().toISOString().split('T')[0]}.json`);
  return { success: true, count: bodyMetrics.length };
}

/**
 * 5.1 SANITIZAR Y CORREGIR REGISTROS ATÍPICOS EN LA NUBE (FIREBASE FIRESTORE + INDEXEDDB)
 * Corrige inconsistencias históricas identificadas en auditoría:
 * - 12 sesiones de prueba sintéticas de julio (1 set @ 1,000 lbs)
 * - Inversión de peso/reps en Seated Leg Curl (d5_e2) del 7 de agosto (90 reps @ 10 lbs -> 10 reps @ 90 lbs)
 * - Error tipográfico en Press Militar (d1_e3) del 31 de agosto (115 reps -> 15 reps)
 */
export async function sanitizeCloudHistory(currentUser, onProgress) {
  if (!currentUser) throw new Error("Usuario no autenticado.");

  const historyRef = collection(db, 'users', currentUser.uid, 'history');
  const snapshot = await getDocs(historyRef);
  
  let deletedSyntheticCount = 0;
  let fixedSessionsCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const docId = docSnap.id;

    // A. Detectar y eliminar sesiones sintéticas de prueba de julio de 1000 lbs y 1 set
    const isSyntheticTest = (
      data.completedSets === 1 &&
      data.volume === 1000 &&
      (data.date?.startsWith('2026-07-') || data.timestamp?.startsWith('2026-07-')) &&
      (!data.exercises || Object.keys(data.exercises).length === 0)
    );

    if (isSyntheticTest) {
      if (onProgress) onProgress(`Eliminando sesión sintética de prueba: ${data.date || docId}...`);
      await deleteDoc(doc(db, 'users', currentUser.uid, 'history', docId));
      deletedSyntheticCount++;
      continue;
    }

    // B. Detectar y corregir errores tipográficos conocidos
    let needsUpdate = false;
    const updatedExercises = { ...(data.exercises || {}) };

    // B.1. Corregir inversión en d5_e2 (Seated Leg Curl) del 7 de agosto
    if (updatedExercises.d5_e2) {
      const legCurl = { ...updatedExercises.d5_e2 };
      let curlFixed = false;
      for (const setKey of ['1', '2', '3', '4']) {
        if (legCurl[setKey] && legCurl[setKey].reps === '90' && legCurl[setKey].weight === '10') {
          legCurl[setKey] = {
            ...legCurl[setKey],
            reps: '10',
            weight: '90'
          };
          curlFixed = true;
        }
      }
      if (curlFixed) {
        updatedExercises.d5_e2 = legCurl;
        needsUpdate = true;
      }
    }

    // B.2. Corregir 115 reps en d1_e3 (Press Militar) del 31 de agosto
    if (updatedExercises.d1_e3) {
      const pressMilitar = { ...updatedExercises.d1_e3 };
      if (pressMilitar['1'] && pressMilitar['1'].reps === '115') {
        pressMilitar['1'] = {
          ...pressMilitar['1'],
          reps: '15'
        };
        updatedExercises.d1_e3 = pressMilitar;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      // Recalcular volumen total de la sesión corregida
      let newVolume = 0;
      Object.values(updatedExercises).forEach(exLogs => {
        if (exLogs && typeof exLogs === 'object') {
          Object.keys(exLogs).forEach(k => {
            if (!isNaN(parseInt(k))) {
              const s = exLogs[k];
              if (s && s.completed) {
                let w = parseFloat(s.weight) || 0;
                if (s.unit === 'kg') w *= 2.20462;
                const r = parseFloat(s.reps) || 0;
                newVolume += (w * r);
              }
            }
          });
        }
      });

      const updatedSession = {
        ...data,
        exercises: updatedExercises,
        volume: Math.round(newVolume)
      };

      if (onProgress) onProgress(`Corrigiendo errores de captura en sesión: ${data.date || docId}...`);
      await setDoc(doc(db, 'users', currentUser.uid, 'history', docId), sanitizeForFirestore(updatedSession), { merge: true });
      fixedSessionsCount++;
    }
  }

  // (En Fase 2, persistentLocalCache de Firestore actualiza la caché automáticamente)

  return {
    success: true,
    deletedSyntheticCount,
    fixedSessionsCount
  };
}

/**
 * 6. RESTAURACIÓN MAESTRA EN LA NUBE (FIREBASE FIRESTORE + INDEXEDDB)
 * Lee un archivo de respaldo JSON y escribe directamente en Firestore en lote:
 * - Inserta cada sesión en users/{uid}/history/{sessionId}
 * - Inserta cada llave en users/{uid}/store/{key}
 * - Sincroniza el caché local de IndexedDB
 */
export async function restoreFullDatabase(currentUser, jsonData, onProgress) {
  if (!currentUser) {
    throw new Error("Debes iniciar sesión con Google para restaurar datos en la nube.");
  }
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error("El archivo no contiene una estructura JSON válida.");
  }

  // 1. Extraer y preparar sesiones históricas
  const sessionsToRestore = [];
  if (Array.isArray(jsonData.workoutHistory)) {
    sessionsToRestore.push(...jsonData.workoutHistory);
  } else if (Array.isArray(jsonData.history)) {
    sessionsToRestore.push(...jsonData.history);
  }

  // 2. Extraer y preparar configuraciones de la subcolección 'store'
  const storeEntries = {};

  // Extraer llaves directas del JSON si existen
  if (jsonData.currentActiveSessions) storeEntries['coachv2_active_workouts'] = jsonData.currentActiveSessions;
  if (jsonData.customExercises) storeEntries['coachv2_custom_day_exercises'] = jsonData.customExercises;
  if (jsonData.swappedExercises) storeEntries['coachv2_swapped_exercises'] = jsonData.swappedExercises;
  if (jsonData.skippedExercises) storeEntries['coachv2_skipped_exercises'] = jsonData.skippedExercises;
  if (jsonData.exerciseOrders) storeEntries['coachv2_exercise_orders'] = jsonData.exerciseOrders;
  if (jsonData.bodyWeightHistory) storeEntries['coachv2_body_metrics_history'] = jsonData.bodyWeightHistory;
  if (jsonData.bodyComposition) storeEntries['coachv2_body_composition_data'] = jsonData.bodyComposition;
  if (jsonData.physiqueGoal) storeEntries['coachv2_physique_goal'] = jsonData.physiqueGoal;
  if (jsonData.machineConfigs) storeEntries['coachv2_machine_configs'] = jsonData.machineConfigs;
  if (jsonData.machineProfiles) storeEntries['coachv2_machine_profiles'] = jsonData.machineProfiles;
  if (jsonData.smartwatchKcal) storeEntries['coachv2_smartwatch_kcal'] = jsonData.smartwatchKcal;
  if (jsonData.customRoutine) storeEntries['coachv2_custom_routine'] = jsonData.customRoutine;
  if (jsonData.mesocycleStartDate) storeEntries['coachv2_mesocycle_start'] = jsonData.mesocycleStartDate;
  if (jsonData.weightPreferredUnit) storeEntries['coachv2_weight_preferred_unit'] = jsonData.weightPreferredUnit;
  if (jsonData.googleSheetsUrl) storeEntries['coachv2_google_sheets_url'] = jsonData.googleSheetsUrl;
  if (jsonData.deloadActive !== undefined) storeEntries['coachv2_deload_active'] = jsonData.deloadActive;
  if (jsonData.deloadCycleConfig) storeEntries['coachv2_deload_cycle_config'] = jsonData.deloadCycleConfig;
  if (jsonData.weekSplitOverride) storeEntries['coachv2_week_split_override'] = jsonData.weekSplitOverride;
  if (jsonData.dismissedPendingAlerts) storeEntries['coachv2_dismissed_pending_alerts'] = jsonData.dismissedPendingAlerts;

  // Extraer del volcado FirestoreDump o rawIndexedDBDump (verificando que contengan claves antes de preferir)
  const dumpSource = (jsonData.firestoreStoreDump && Object.keys(jsonData.firestoreStoreDump).length > 0)
    ? jsonData.firestoreStoreDump
    : ((jsonData.rawIndexedDBDump && Object.keys(jsonData.rawIndexedDBDump).length > 0)
      ? jsonData.rawIndexedDBDump
      : (jsonData.rawLocalStorageDump || {}));

  Object.entries(dumpSource).forEach(([key, val]) => {
    if (key.startsWith('coachv2_')) {
      // NUNCA sobreescribir o restaurar credenciales de API
      if (/api_?key/i.test(key) || /deepseek/i.test(key)) {
        return;
      }
      storeEntries[key] = val;
    }
  });

  // VALIDACIÓN CRÍTICA: Si el archivo no contiene ni sesiones ni configuraciones, abortar
  if (sessionsToRestore.length === 0 && Object.keys(storeEntries).length === 0) {
    throw new Error("El archivo de respaldo está vacío o no contiene sesiones ni configuraciones válidas.");
  }

  let totalSessionsRestored = 0;
  let totalKeysRestored = 0;

  // 0. RESPALDO AUTOMÁTICO DE SEGURIDAD PREVIO (Centralizado aquí para no duplicar descargas)
  if (onProgress) onProgress("Generando respaldo de seguridad automático antes de restaurar...");
  try {
    await exportFullDatabase(currentUser, { isAutoBackup: true });
  } catch (backupErr) {
    console.warn("[Restore] Aviso: No se pudo generar auto-backup previo:", backupErr);
  }

  // 1. Restaurar Historial de Entrenamientos en Firebase Firestore con writeBatch (Modo Upsert)
  const restoredSessionIds = new Set();

  if (sessionsToRestore.length > 0) {
    if (onProgress) onProgress("Restaurando sesiones históricas en Firebase con upsert seguro...");
    for (let i = 0; i < sessionsToRestore.length; i += 400) {
      const chunk = sessionsToRestore.slice(i, i + 400);
      const batch = writeBatch(db);

      for (let j = 0; j < chunk.length; j++) {
        const session = chunk[j];
        const sessionId = session.id || `ses_${session.timestamp ? session.timestamp.split('T')[0] : Date.now()}_${session.dayId || 'd' + (i + j)}`;
        session.id = sessionId;
        restoredSessionIds.add(sessionId);

        const sessionRef = doc(db, 'users', currentUser.uid, 'history', sessionId);
        const enrichedSession = {
          ...session,
          updatedAt: new Date().toISOString(),
          deletedAt: null
        };
        batch.set(sessionRef, sanitizeForFirestore(enrichedSession), { merge: true });
        totalSessionsRestored++;
      }

      await batch.commit();
      if (onProgress) onProgress(`Restauradas ${totalSessionsRestored}/${sessionsToRestore.length} sesiones...`);
    }
  }

  // 2. Restaurar Documentos de la Subcolección 'store' con writeBatch (Modo Upsert)
  const restoredStoreKeys = new Set();
  const storeEntriesList = Object.entries(storeEntries);

  if (storeEntriesList.length > 0) {
    if (onProgress) onProgress("Sincronizando configuraciones en Firestore con upsert seguro...");
    for (let i = 0; i < storeEntriesList.length; i += 400) {
      const chunk = storeEntriesList.slice(i, i + 400);
      const batch = writeBatch(db);

      for (const [key, value] of chunk) {
        if (value !== undefined) {
          restoredStoreKeys.add(key);
          const docRef = doc(db, 'users', currentUser.uid, 'store', key);
          const cleanVal = sanitizeForFirestore(stripInternalMetadata(value));
          batch.set(docRef, { value: cleanVal, restoredAt: new Date().toISOString(), __cleared: false }, { merge: true });
          totalKeysRestored++;
        }
      }

      await batch.commit();
      if (onProgress) onProgress(`Sincronizadas ${totalKeysRestored}/${storeEntriesList.length} configuraciones...`);
    }
  }

  // 3. LIMPIEZA DE HUÉRFANOS SOBRANTES SOLO AL FINAL (Tras éxito total de escritura)
  try {
    if (onProgress) onProgress("Comprobando coherencia y depurando registros huérfanos...");

    // 3.1 Purgar sesiones que ya no existen en el backup (SOLO si se restauraron sesiones)
    if (restoredSessionIds.size > 0) {
      const historyColRef = collection(db, 'users', currentUser.uid, 'history');
      const historySnap = await getDocs(historyColRef);
      const orphanHistoryDocs = historySnap.docs.filter(docSnap => !restoredSessionIds.has(docSnap.id));

      if (orphanHistoryDocs.length > 0) {
        if (onProgress) onProgress(`Depurando ${orphanHistoryDocs.length} sesiones obsoletas no presentes en el backup...`);
        const nowIso = new Date().toISOString();
        for (let i = 0; i < orphanHistoryDocs.length; i += 400) {
          const delBatch = writeBatch(db);
          orphanHistoryDocs.slice(i, i + 400).forEach(d => {
            delBatch.set(d.ref, { deletedAt: nowIso, updatedAt: nowIso }, { merge: true });
          });
          await delBatch.commit();
        }
      }
    }

    // 3.2 Purgar configuraciones obsoletas (SOLO si se restauraron claves de store y EXCLUYENDO claves sensibles/sistema)
    if (restoredStoreKeys.size > 0) {
      const storeColRef = collection(db, 'users', currentUser.uid, 'store');
      const storeSnap = await getDocs(storeColRef);
      const orphanStoreDocs = storeSnap.docs.filter(docSnap => {
        const k = docSnap.id;
        // NUNCA borrar claves de API, autenticación, migración, outbox o caché
        if (/api_?key/i.test(k) || /deepseek/i.test(k) || k.includes('migrated') || k.includes('last_cloud_sync') || k.includes('outbox') || k.includes('cache')) {
          return false;
        }
        return !restoredStoreKeys.has(k);
      });

      if (orphanStoreDocs.length > 0) {
        if (onProgress) onProgress(`Depurando ${orphanStoreDocs.length} configuraciones obsoletas...`);
        for (let i = 0; i < orphanStoreDocs.length; i += 400) {
          const delBatch = writeBatch(db);
          orphanStoreDocs.slice(i, i + 400).forEach(d => delBatch.delete(d.ref));
          await delBatch.commit();
        }
      }
    }
  } catch (cleanErr) {
    console.warn("[Restore] Aviso al depurar huérfanos posteriores:", cleanErr);
  }

  // (En Fase 2, persistentLocalCache de Firestore sincroniza la caché local automáticamente sin espejos idb)

  return {
    success: true,
    sessionsRestored: totalSessionsRestored,
    keysRestored: totalKeysRestored
  };
}
