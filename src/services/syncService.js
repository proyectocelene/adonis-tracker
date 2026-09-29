// SERVICIO DE SINCRONIZACIÓN MAESTRA: FIRESTORE (NUBE) ➔ INDEXEDDB (LOCAL)
// Garantiza que el 100% del historial y las configuraciones residan localmente para análisis sin fallos offline.

import { db, sanitizeForFirestore } from './firebase.js';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { get, set, keys } from 'idb-keyval';
import { mergeStoreValues, flushStoreOutbox } from './storeSyncHelper.js';

/**
 * Descarga y consolida TODO el historial de sesiones y TODAS las configuraciones
 * entre Firestore y la base de datos local IndexedDB (Sincronización Bidireccional).
 */
export async function syncAllCloudDataToIndexedDB(currentUser) {
  if (!currentUser || !currentUser.uid) {
    return { success: false, reason: 'No user authenticated' };
  }

  const cacheKey = `coachv2_history_cache_${currentUser.uid}`;

  try {
    // Procesar cualquier cambio pendiente en la cola offline antes de iniciar
    await flushStoreOutbox(currentUser);

    // =========================================================================
    // 1. DESCARGA Y CONSOLIDACIÓN DEL 100% DEL HISTORIAL DE SESIONES
    // =========================================================================
    const historyColRef = collection(db, 'users', currentUser.uid, 'history');
    const historySnapshot = await getDocs(historyColRef);
    const firestoreSessions = historySnapshot.docs.map(docSnap => docSnap.data());

    // Leer historial actualmente guardado en IndexedDB local
    let localCache = (await get(cacheKey)) || (await get('coachv2_history')) || [];
    if (!Array.isArray(localCache)) localCache = [];

    // Fusión estricta sin pérdida de datos
    const sessionMap = new Map();
    const firestoreKeys = new Set();

    // Primero agregar sesiones de Firestore
    firestoreSessions.forEach(s => {
      const key = s.id || s.timestamp || s.date;
      if (key) {
        sessionMap.set(key, s);
        firestoreKeys.add(key);
      }
    });

    // Luego incorporar sesiones locales que aún no estén en Firestore
    const localOnlySessions = [];
    localCache.forEach(s => {
      const key = s.id || s.timestamp || s.date;
      if (key) {
        if (!sessionMap.has(key)) {
          sessionMap.set(key, s);
        }
        if (!firestoreKeys.has(key)) {
          localOnlySessions.push(s);
        }
      }
    });

    // Sincronizar hacia la nube (Local ➔ Firestore) las sesiones que faltaban en Firebase
    if (localOnlySessions.length > 0) {
      console.log(`[Adonis Sync] 💾 ➔ ☁️ Subiendo ${localOnlySessions.length} sesiones locales a Firestore...`);
      for (const s of localOnlySessions) {
        const id = s.id || `ses_${s.timestamp || s.date || Date.now()}`;
        try {
          const docRef = doc(db, 'users', currentUser.uid, 'history', id);
          await setDoc(docRef, sanitizeForFirestore(s), { merge: true });
        } catch (uploadErr) {
          console.warn(`[Adonis Sync] Error subiendo sesión local ${id}:`, uploadErr);
        }
      }
    }

    // Ordenar cronológicamente ascendente
    const allSessions = Array.from(sessionMap.values()).sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date || a.startTime || a.id || 0).getTime() || 0;
      const timeB = new Date(b.timestamp || b.date || b.startTime || b.id || 0).getTime() || 0;
      return timeA - timeB;
    });

    // Persistir en las dos claves locales maestras de IndexedDB
    await set(cacheKey, allSessions);
    await set('coachv2_history', allSessions);

    // =========================================================================
    // 2. CONSOLIDACIÓN BIDIRECCIONAL DE CONFIGURACIONES (STORE)
    // =========================================================================
    const storeColRef = collection(db, 'users', currentUser.uid, 'store');
    const storeSnapshot = await getDocs(storeColRef);
    const cloudStoreMap = new Map();

    for (const docSnap of storeSnapshot.docs) {
      const data = docSnap.data();
      const val = data.value !== undefined ? data.value : data;
      cloudStoreMap.set(docSnap.id, val);
    }

    const KNOWN_STORE_KEYS = [
      'coachv2_custom_day_exercises',
      'coachv2_active_workouts',
      'coachv2_swapped_exercises',
      'coachv2_skipped_exercises',
      'coachv2_smartwatch_kcal',
      'coachv2_exercise_orders',
      'coachv2_global_warmup',
      'coachv2_body_metrics_history',
      'coachv2_body_composition_data',
      'coachv2_machine_configs',
      'coachv2_machine_profiles',
      'coachv2_custom_routine',
      'coachv2_mesocycle_start'
    ];

    let localIdbKeys = [];
    try {
      const allIdbKeys = await keys();
      localIdbKeys = allIdbKeys.filter(k => typeof k === 'string' && k.startsWith('coachv2_') && !k.includes('history') && !k.includes('outbox') && !k.includes('migrated'));
    } catch (e) {}

    const allStoreKeys = new Set([...KNOWN_STORE_KEYS, ...cloudStoreMap.keys(), ...localIdbKeys]);
    let storeCount = 0;
    const storeSyncPayload = {};

    for (const docId of allStoreKeys) {
      try {
        const localVal = await get(docId);
        const cloudVal = cloudStoreMap.get(docId);
        const mergedVal = mergeStoreValues(docId, localVal, cloudVal);

        if (mergedVal !== undefined) {
          await set(docId, mergedVal);
          storeSyncPayload[docId] = mergedVal;
          storeCount++;

          const cloudStr = JSON.stringify(cloudVal ?? null);
          const mergedStr = JSON.stringify(mergedVal ?? null);

          // Si el valor local tenía contenido que la nube no tenía, subirlo a Firestore
          if (!cloudStoreMap.has(docId) || cloudStr !== mergedStr) {
            console.log(`[Adonis Sync] 💾 ➔ ☁️ Sincronizando clave ${docId} a Firestore...`);
            const docRef = doc(db, 'users', currentUser.uid, 'store', docId);
            await setDoc(docRef, { value: sanitizeForFirestore(mergedVal) }, { merge: true });
          }
        }
      } catch (err) {
        console.warn(`[Adonis Sync] Error sincronizando store ${docId}:`, err);
      }
    }

    console.log(
      `[Adonis Sync] 👤 Usuario: ${currentUser.email || currentUser.uid}\n` +
      `[Adonis Sync] ☁️ Firestore: ${firestoreSessions.length} sesiones, ${storeCount} configuraciones sincronizadas bidireccionalmente\n` +
      `[Adonis Sync] 💾 IndexedDB Local: ${localCache.length} sesiones previas ➔ Total consolidado: ${allSessions.length} sesiones.`
    );

    // Notificar a la app de la sincronización completada
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adonis_cloud_synced', {
        detail: {
          sessionsCount: allSessions.length,
          storeCount,
          allSessions,
          storeSyncPayload
        }
      }));
    }

    return {
      success: true,
      sessionsCount: allSessions.length,
      storeCount,
      allSessions
    };
  } catch (error) {
    console.warn("[Adonis Sync] Conexión lenta u offline al sincronizar Firestore con IndexedDB:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
