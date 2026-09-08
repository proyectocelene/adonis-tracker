import { db } from './firebase';
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
  if (!currentUser) {
    throw new Error("Usuario no autenticado para exportar desde la nube.");
  }

  // 1. Obtener todas las sesiones de la subcolección 'history'
  const historyRef = collection(db, 'users', currentUser.uid, 'history');
  const historySnapshot = await getDocs(historyRef);
  const workoutHistory = historySnapshot.docs.map(doc => doc.data());

  // 2. Obtener todos los documentos de la subcolección 'store'
  const storeRef = collection(db, 'users', currentUser.uid, 'store');
  const storeSnapshot = await getDocs(storeRef);
  const storeData = {};
  storeSnapshot.docs.forEach(doc => {
    storeData[doc.id] = doc.data().value !== undefined ? doc.data().value : doc.data();
  });

  // 3. Obtener volcado de IndexedDB local como respaldo de seguridad adicional
  let localDbDump = {};
  try {
    const idbEntries = await entries();
    idbEntries.forEach(([key, val]) => {
      localDbDump[key] = val;
    });
  } catch (e) {
    console.warn("No se pudo leer idb-keyval local:", e);
  }

  // Extraer datos clave para acceso directo y compatibilidad
  const currentActiveSessions = storeData['coachv2_active_workouts'] || localDbDump['coachv2_active_workouts'] || {};
  const customExercises = storeData['coachv2_custom_day_exercises'] || localDbDump['coachv2_custom_day_exercises'] || {};
  const swappedExercises = storeData['coachv2_swapped_exercises'] || localDbDump['coachv2_swapped_exercises'] || {};
  const exerciseOrders = storeData['coachv2_exercise_orders'] || localDbDump['coachv2_exercise_orders'] || {};
  const bodyWeightHistory = storeData['coachv2_body_metrics_history'] || localDbDump['coachv2_body_metrics_history'] || [];
  const customRoutine = storeData['coachv2_custom_routine'] || localDbDump['coachv2_custom_routine'] || null;

  const fullMasterBackup = {
    appVersion: "COACH V2 - Protocolo Adonis Científico (Backup Maestro 100% Firebase)",
    exportTimestamp: new Date().toISOString(),
    atleta: currentUser.displayName || "Carlos Donato",
    userId: currentUser.uid,
    userEmail: currentUser.email || "",
    
    // Colecciones Principales
    workoutHistory,
    bodyWeightHistory,
    currentActiveSessions,
    customExercises,
    swappedExercises,
    exerciseOrders,
    customRoutine,

    // Estructuras de Referencia
    scientificProtocol,
    unifiedExerciseLibrary: UNIFIED_EXERCISE_LIBRARY,

    // Volcado Completo Firestore & Local
    firestoreStoreDump: storeData,
    rawIndexedDBDump: localDbDump
  };

  const filename = `COACH_V2_Backup_Total_Firebase_${new Date().toISOString().split('T')[0]}.json`;
  downloadJsonFile(fullMasterBackup, filename);
  return { success: true, countSessions: workoutHistory.length, filename };
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

/**
 * 4. EXPORTAR HISTORIAL COMPLETO DE ENTRENAMIENTOS (JSON)
 */
export async function exportWorkoutHistory(currentUser) {
  if (!currentUser) throw new Error("Usuario no autenticado.");
  const historyRef = collection(db, 'users', currentUser.uid, 'history');
  const snapshot = await getDocs(historyRef);
  const workoutHistory = snapshot.docs.map(doc => doc.data());

  const historyExport = {
    exportDate: new Date().toISOString(),
    atleta: currentUser.displayName || "Carlos Donato",
    totalSessions: workoutHistory.length,
    history: workoutHistory
  };

  downloadJsonFile(historyExport, `Historial_Entrenamientos_${new Date().toISOString().split('T')[0]}.json`);
  return { success: true, count: workoutHistory.length };
}

/**
 * 5. EXPORTAR HISTORIAL DE PESO CORPORAL (JSON)
 */
export async function exportBodyMetrics(currentUser) {
  if (!currentUser) throw new Error("Usuario no autenticado.");
  const docRef = doc(db, 'users', currentUser.uid, 'store', 'coachv2_body_metrics_history');
  const snap = await getDoc(docRef);
  const bodyMetrics = snap.exists() ? (snap.data().value || []) : [];

  const metricsExport = {
    exportDate: new Date().toISOString(),
    atleta: currentUser.displayName || "Carlos Donato",
    totalRecords: bodyMetrics.length,
    records: bodyMetrics
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
      await setDoc(doc(db, 'users', currentUser.uid, 'history', docId), updatedSession, { merge: true });
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
      await setDoc(sessionRef, session, { merge: true });
      totalSessionsRestored++;
    }
  }

  // 2. Restaurar Documentos de la Subcolección 'store'
  const storeEntries = {};

  // Extraer llaves directas del JSON si existen
  if (jsonData.currentActiveSessions) storeEntries['coachv2_active_workouts'] = jsonData.currentActiveSessions;
  if (jsonData.customExercises) storeEntries['coachv2_custom_day_exercises'] = jsonData.customExercises;
  if (jsonData.swappedExercises) storeEntries['coachv2_swapped_exercises'] = jsonData.swappedExercises;
  if (jsonData.exerciseOrders) storeEntries['coachv2_exercise_orders'] = jsonData.exerciseOrders;
  if (jsonData.bodyWeightHistory) storeEntries['coachv2_body_metrics_history'] = jsonData.bodyWeightHistory;
  if (jsonData.customRoutine) storeEntries['coachv2_custom_routine'] = jsonData.customRoutine;

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
      await setDoc(docRef, { value }, { merge: true });
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
