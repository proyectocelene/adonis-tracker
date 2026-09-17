import { db, sanitizeForFirestore } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { entries, setMany } from 'idb-keyval';
import { scientificProtocol } from '../data/scientificProtocol';
import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary';

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
 * 1. EXPORTACIÓN MAESTRA TOTAL DE FIREBASE
 * Descarga el 100% de la base de datos de Firebase Firestore del usuario autenticado:
 * - Historial completo de entrenamientos (subcolección history)
 * - Todos los estados y configuraciones (subcolección store: active workouts, body metrics, custom exercises, swapped, routine overrides, etc.)
 * - Estructura base del protocolo científico y catálogo de ejercicios
 */
export async function exportFullDatabase(currentUser) {
  let workoutHistory = [];
  const storeData = {};
  let localDbDump = {};

  // 1. Obtener volcado de IndexedDB local como respaldo de seguridad prioritario
  try {
    const idbEntries = await entries();
    idbEntries.forEach(([key, val]) => {
      localDbDump[key] = val;
    });
  } catch (e) {
    console.warn("No se pudo leer idb-keyval local:", e);
  }

  // 2. Si hay usuario autenticado, obtener datos de Firebase Firestore
  if (currentUser) {
    try {
      // 2.1 Obtener todas las sesiones de la subcolección 'history'
      const historyRef = collection(db, 'users', currentUser.uid, 'history');
      const historySnapshot = await getDocs(historyRef);
      workoutHistory = historySnapshot.docs.map(doc => doc.data());

      // 2.2 Obtener todos los documentos de la subcolección 'store'
      const storeRef = collection(db, 'users', currentUser.uid, 'store');
      const storeSnapshot = await getDocs(storeRef);
      storeSnapshot.docs.forEach(doc => {
        storeData[doc.id] = doc.data().value !== undefined ? doc.data().value : doc.data();
      });
    } catch (err) {
      console.warn("Aviso: Conexión Firestore lenta u offline durante exportación. Usando copia local:", err);
    }
  }

  // 3. Fusionar inteligentemente historial de Firestore y caché local (0% pérdida de datos)
  const localHistory = (currentUser && localDbDump[`coachv2_history_cache_${currentUser.uid}`])
    || localDbDump['coachv2_history_cache_anon']
    || localDbDump['coachv2_history']
    || [];

  const sessionMap = new Map();
  workoutHistory.forEach(s => {
    const key = s.id || s.timestamp;
    if (key) sessionMap.set(key, s);
  });
  if (Array.isArray(localHistory)) {
    localHistory.forEach(s => {
      const key = s.id || s.timestamp;
      if (key && !sessionMap.has(key)) {
        sessionMap.set(key, s);
      }
    });
  }
  const mergedWorkoutHistory = Array.from(sessionMap.values()).sort((a, b) => {
    const timeA = new Date(a.timestamp || a.date || 0).getTime();
    const timeB = new Date(b.timestamp || b.date || 0).getTime();
    return timeA - timeB;
  });

  // Extraer datos clave para acceso directo y compatibilidad
  const currentActiveSessions = storeData['coachv2_active_workouts'] || localDbDump['coachv2_active_workouts'] || {};
  const customExercises = storeData['coachv2_custom_day_exercises'] || localDbDump['coachv2_custom_day_exercises'] || {};
  const swappedExercises = storeData['coachv2_swapped_exercises'] || localDbDump['coachv2_swapped_exercises'] || {};
  const skippedExercises = storeData['coachv2_skipped_exercises'] || localDbDump['coachv2_skipped_exercises'] || {};
  const exerciseOrders = storeData['coachv2_exercise_orders'] || localDbDump['coachv2_exercise_orders'] || {};
  const bodyWeightHistory = storeData['coachv2_body_metrics_history'] || localDbDump['coachv2_body_metrics_history'] || [];
  const bodyComposition = storeData['coachv2_body_composition_data'] || localDbDump['coachv2_body_composition_data'] || {};
  const physiqueGoal = storeData['coachv2_physique_goal'] || localDbDump['coachv2_physique_goal'] || {};
  const machineConfigs = storeData['coachv2_machine_configs'] || localDbDump['coachv2_machine_configs'] || {};
  const machineProfiles = storeData['coachv2_machine_profiles'] || localDbDump['coachv2_machine_profiles'] || {};
  const smartwatchKcal = storeData['coachv2_smartwatch_kcal'] || localDbDump['coachv2_smartwatch_kcal'] || {};
  const customRoutine = storeData['coachv2_custom_routine'] || localDbDump['coachv2_custom_routine'] || null;
  const mesocycleStartDate = storeData['coachv2_mesocycle_start'] || localDbDump['coachv2_mesocycle_start'] || null;
  const weightPreferredUnit = storeData['coachv2_weight_preferred_unit'] || localDbDump['coachv2_weight_preferred_unit'] || 'kg';
  const googleSheetsUrl = storeData['coachv2_google_sheets_url'] || localDbDump['coachv2_google_sheets_url'] || '';

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

    // Estructuras de Referencia
    scientificProtocol,
    unifiedExerciseLibrary: UNIFIED_EXERCISE_LIBRARY,

    // Volcado Completo Firestore & Local
    firestoreStoreDump: storeData,
    rawIndexedDBDump: localDbDump
  };

  const filename = `COACH_V2_Backup_Total_Firebase_${new Date().toISOString().split('T')[0]}.json`;
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
  if (currentUser) {
    try {
      const historyRef = collection(db, 'users', currentUser.uid, 'history');
      const snapshot = await getDocs(historyRef);
      workoutHistory = snapshot.docs.map(doc => doc.data());
    } catch (e) {
      console.warn("Error leyendo Firestore en exportWorkoutHistory:", e);
    }
  }

  if (workoutHistory.length === 0) {
    try {
      const cached = (currentUser && await get(`coachv2_history_cache_${currentUser.uid}`))
        || await get('coachv2_history_cache_anon')
        || await get('coachv2_history')
        || [];
      if (Array.isArray(cached) && cached.length > 0) {
        workoutHistory = cached;
      }
    } catch (e) {
      console.warn("Error leyendo IndexedDB local:", e);
    }
  }

  const historyExport = {
    exportDate: new Date().toISOString(),
    atleta: currentUser?.displayName || "Carlos Donato",
    totalSessions: workoutHistory.length,
    history: workoutHistory
  };

  downloadJsonFile(historyExport, `Historial_Entrenamientos_${new Date().toISOString().split('T')[0]}.json`);
  return { success: true, count: workoutHistory.length };
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

  if (bodyMetrics.length === 0) {
    try {
      const localMetrics = await get('coachv2_body_metrics_history');
      if (Array.isArray(localMetrics)) bodyMetrics = localMetrics;
      const localComp = await get('coachv2_body_composition_data');
      if (localComp) bodyComposition = localComp;
      const localGoal = await get('coachv2_physique_goal');
      if (localGoal) physiqueGoal = localGoal;
    } catch (e) {
      console.warn("Error leyendo IndexedDB local en exportBodyMetrics:", e);
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

  // Sincronizar en caché local idb
  try {
    const updatedHistorySnap = await getDocs(historyRef);
    const refreshedHistory = updatedHistorySnap.docs.map(d => d.data()).sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date || 0).getTime();
      const timeB = new Date(b.timestamp || b.date || 0).getTime();
      return timeA - timeB;
    });
    const cacheKey = `coachv2_history_cache_${currentUser.uid}`;
    await set(cacheKey, refreshedHistory);
  } catch (e) {
    console.warn("No se pudo refrescar caché idb:", e);
  }

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

  let totalSessionsRestored = 0;
  let totalKeysRestored = 0;

  // 0. LIMPIAR BASE DE DATOS ACTUAL (WIPE)
  if (onProgress) onProgress("Borrando base de datos actual para un inicio limpio...");
  const historyColRef = collection(db, 'users', currentUser.uid, 'history');
  const historySnap = await getDocs(historyColRef);
  for (const document of historySnap.docs) {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'history', document.id));
  }
  
  const storeColRef = collection(db, 'users', currentUser.uid, 'store');
  const storeSnap = await getDocs(storeColRef);
  for (const document of storeSnap.docs) {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'store', document.id));
  }

  // 1. Restaurar Historial de Entrenamientos en Firebase Firestore
  const sessionsToRestore = [];
  if (Array.isArray(jsonData.workoutHistory)) {
    sessionsToRestore.push(...jsonData.workoutHistory);
  } else if (Array.isArray(jsonData.history)) {
    sessionsToRestore.push(...jsonData.history);
  }

  if (sessionsToRestore.length > 0) {
    if (onProgress) onProgress("Restaurando sesiones históricas en Firebase...");
    for (let i = 0; i < sessionsToRestore.length; i++) {
      const session = sessionsToRestore[i];
      const sessionId = session.id || `ses_${session.timestamp ? session.timestamp.split('T')[0] : Date.now()}_${session.dayId || 'd' + i}`;
      session.id = sessionId;
      
      const sessionRef = doc(db, 'users', currentUser.uid, 'history', sessionId);
      await setDoc(sessionRef, sanitizeForFirestore(session), { merge: true });
      totalSessionsRestored++;
    }
  }

  // 2. Restaurar Documentos de la Subcolección 'store'
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

  // Extraer del volcado FirestoreDump o rawIndexedDBDump
  const dumpSource = jsonData.firestoreStoreDump || jsonData.rawIndexedDBDump || jsonData.rawLocalStorageDump || {};
  Object.entries(dumpSource).forEach(([key, val]) => {
    if (key.startsWith('coachv2_')) {
      storeEntries[key] = val;
    }
  });

  if (onProgress) onProgress("Sincronizando configuraciones y estado en Firestore...");
  for (const [key, value] of Object.entries(storeEntries)) {
    if (value !== undefined) {
      const docRef = doc(db, 'users', currentUser.uid, 'store', key);
      await setDoc(docRef, { value: sanitizeForFirestore(value) }, { merge: true });
      totalKeysRestored++;
    }
  }

  // 3. Sincronizar también en IndexedDB local
  try {
    const idbEntries = Object.entries(storeEntries);
    if (idbEntries.length > 0) {
      await setMany(idbEntries);
    }
  } catch (e) {
    console.warn("No se pudo escribir en idb-keyval local:", e);
  }

  return {
    success: true,
    sessionsRestored: totalSessionsRestored,
    keysRestored: totalKeysRestored
  };
}
