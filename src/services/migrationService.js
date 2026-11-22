// SERVICIO DE MIGRACIÓN CENTRALIZADA (FASE 2: FUENTE ÚNICA DE VERDAD)
// Registra el estado de migraciones en Firestore (users/{uid}/meta/migrations),
// drena outboxes pendientes en cada dispositivo y purga espejos obsoletos de idb-keyval.

import { db, sanitizeForFirestore } from './firebase.js';
import { doc, getDoc, getDocFromServer, setDoc, collection, getDocs } from 'firebase/firestore';
import { get, set, del, keys } from 'idb-keyval';
import { mergeStoreValues, stripInternalMetadata, extractMetadataFromDoc } from './storeSyncHelper.js';

const MIRROR_STORE_KEYS_TO_CLEAN = [
  'coachv2_history',
  'coachv2_active_workouts',
  'coachv2_custom_day_exercises',
  'coachv2_swapped_exercises',
  'coachv2_skipped_exercises',
  'coachv2_exercise_orders',
  'coachv2_global_warmup',
  'coachv2_body_metrics_history',
  'coachv2_body_composition_data',
  'coachv2_machine_configs',
  'coachv2_machine_profiles',
  'coachv2_custom_routine',
  'coachv2_mesocycle_start',
  'coachv2_smartwatch_kcal',
  'coachv2_weight_preferred_unit',
  'coachv2_google_sheets_url',
  'coachv2_deload_active',
  'coachv2_deload_cycle_config',
  'coachv2_week_split_override',
  'coachv2_dismissed_pending_alerts',
  'coachv2_physique_goal',
  'coachv2_gym_membership_settings'
];

/**
 * Migra de forma segura la API key de DeepSeek para que resida estrictamente
 * en idb-keyval local con namespace por usuario: coachv2_${uid}_deepseek_api_key.
 */
export async function migrateLocalApiKey(uid) {
  if (!uid) return;
  const namespacedKey = `coachv2_${uid}_deepseek_api_key`;

  try {
    let existingNamespaced = await get(namespacedKey);
    if (!existingNamespaced) {
      // Buscar en claves legacy no-namespaced en idb-keyval o localStorage
      const legacyIdb = (await get('coachv2_deepseek_api_key')) || (await get('coachv2_deepseek_apikey'));
      let legacyStorage = null;
      if (typeof localStorage !== 'undefined') {
        legacyStorage = localStorage.getItem('coachv2_deepseek_api_key') || localStorage.getItem('coachv2_deepseek_apikey');
      }

      const candidateKey = legacyIdb || legacyStorage;
      if (candidateKey && typeof candidateKey === 'string' && candidateKey.trim()) {
        await set(namespacedKey, candidateKey.trim());
        existingNamespaced = candidateKey.trim();
        console.log(`[Migration] 🔑 Clave DeepSeek migrada a namespace seguro: ${namespacedKey}`);
      }
    }

    // Purgar residuos de claves legacy sin namespace
    await del('coachv2_deepseek_api_key').catch(() => {});
    await del('coachv2_deepseek_apikey').catch(() => {});
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('coachv2_deepseek_api_key');
      localStorage.removeItem('coachv2_deepseek_apikey');
    }
  } catch (err) {
    console.warn("[Migration] Error migrando API key local:", err);
  }
}

/**
 * Drena cualquier elemento remanente en las outbox manuales de este dispositivo.
 * Se ejecuta SIEMPRE que haya conexión, incluso si la migración ya se completó en otro dispositivo.
 */
export async function drainDeviceOutboxes(currentUser) {
  if (!currentUser || !currentUser.uid) return;
  const uid = currentUser.uid;
  const historyOutboxKey = `coachv2_outbox_${uid}`;
  const storeOutboxKey = `coachv2_store_outbox_${uid}`;

  try {
    // 1. Drenar outbox de historial
    const historyOutbox = await get(historyOutboxKey);
    if (Array.isArray(historyOutbox) && historyOutbox.length > 0) {
      console.log(`[Migration] 📤 Drenando ${historyOutbox.length} elementos de history outbox local...`);
      for (const item of historyOutbox) {
        try {
          if (item.action === 'delete' && item.sessionId) {
            const docRef = doc(db, 'users', uid, 'history', item.sessionId);
            await setDoc(docRef, {
              deletedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } else if (item.session && item.session.id) {
            const docRef = doc(db, 'users', uid, 'history', item.session.id);
            const enriched = {
              ...item.session,
              updatedAt: new Date().toISOString(),
              deletedAt: null
            };
            await setDoc(docRef, sanitizeForFirestore(enriched), { merge: true });
          }
        } catch (e) {
          console.warn(`[Migration] Error drenando elemento history ${item.sessionId || item.session?.id}:`, e);
        }
      }
      await del(historyOutboxKey).catch(() => {});
    }

    // 2. Drenar outbox de configuraciones (store)
    const storeOutbox = await get(storeOutboxKey);
    if (Array.isArray(storeOutbox) && storeOutbox.length > 0) {
      console.log(`[Migration] 📤 Drenando ${storeOutbox.length} elementos de store outbox local...`);
      for (const item of storeOutbox) {
        try {
          if (item.key && !item.key.includes('deepseek') && !item.key.includes('api_key')) {
            const docRef = doc(db, 'users', uid, 'store', item.key);
            const cleanVal = sanitizeForFirestore(stripInternalMetadata(item.value));
            await setDoc(docRef, {
              value: cleanVal,
              updatedAt: new Date().toISOString(),
              __cleared: false
            }, { merge: true });
          }
        } catch (e) {
          console.warn(`[Migration] Error drenando elemento store ${item.key}:`, e);
        }
      }
      await del(storeOutboxKey).catch(() => {});
    }
  } catch (err) {
    console.warn("[Migration] Error durante drenado de outboxes locales:", err);
  }
}

/**
 * Limpia los espejos obsoletos en idb-keyval y localStorage en este dispositivo,
 * asegurando NUNCA tocar la clave con namespace coachv2_${uid}_deepseek_api_key.
 */
export async function cleanLegacyDeviceMirrors(uid) {
  if (!uid) return;
  const safeNamespacedKey = `coachv2_${uid}_deepseek_api_key`;

  try {
    const allIdbKeys = await keys();
    for (const k of allIdbKeys) {
      if (typeof k !== 'string') continue;
      // Proteger estrictamente la API key con namespace
      if (k === safeNamespacedKey) continue;

      if (
        MIRROR_STORE_KEYS_TO_CLEAN.includes(k) ||
        k.startsWith(`coachv2_history_cache_`) ||
        k.startsWith(`coachv2_outbox_`) ||
        k.startsWith(`coachv2_store_outbox_`) ||
        k.startsWith(`coachv2_purge_`) ||
        k.startsWith(`coachv2_protocol_`)
      ) {
        await del(k).catch(() => {});
      }
    }

    // Limpiar localStorage (manteniendo coachv2_theme para UI)
    if (typeof localStorage !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('coachv2_') && k !== 'coachv2_theme') {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
    console.log("[Migration] 🧹 Espejos locales y colas obsoletas depuradas de idb-keyval.");
  } catch (e) {
    console.warn("[Migration] Aviso depurando espejos viejos:", e);
  }
}

/**
 * Ejecutor principal de la migración Fase 2 (Fuente Única de Verdad).
 * - Se ejecuta solo cuando hay conexión a internet (navigator.onLine).
 * - Comprueba el registro versionado en users/{uid}/meta/migrations en Firestore.
 * - Sube datos locales que no existan en la nube usando mergeStoreValues.
 * - Drena outboxes locales y purga residuos de idb-keyval.
 */
export async function runV2FirestoreMigration(currentUser) {
  if (!currentUser || !currentUser.uid) {
    return { success: false, reason: 'no_user' };
  }

  const uid = currentUser.uid;

  // 1. Migrar la clave local de DeepSeek al namespace de este usuario de inmediato
  await migrateLocalApiKey(uid);

  // 2. Si no hay conexión a internet, esperar; Firestore persistentLocalCache atenderá la app
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.log("[Migration] 📡 Modo offline: posponiendo verificación de migración a Firestore.");
    return { success: false, reason: 'offline' };
  }

  // 3. Drenar outboxes pendientes en este dispositivo
  await drainDeviceOutboxes(currentUser);

  // 4. Verificar en Firestore si la migración ya fue completada
  const migrationsDocRef = doc(db, 'users', uid, 'meta', 'migrations');

  // 4.1 Primero leer de caché local rápida (0 ms, sin gastar lecturas al servidor)
  try {
    const cacheSnap = await getDoc(migrationsDocRef);
    if (cacheSnap.exists()) {
      const cacheData = cacheSnap.data();
      if (cacheData?.migrations?.v2_single_source_of_truth?.completedAt) {
        // Ya completada en caché: limpiar espejos residuales si queda alguno y retornar en 0 ms
        await cleanLegacyDeviceMirrors(uid);
        return { success: true, alreadyCompleted: true };
      }
    }
  } catch (cacheErr) {
    console.warn("[Migration] Aviso leyendo caché de meta/migrations:", cacheErr.message);
  }

  // 4.2 Si la caché local no tiene completedAt, consultar al servidor
  let migrationMeta = null;
  try {
    const serverSnap = await getDocFromServer(migrationsDocRef);
    if (serverSnap.exists()) {
      migrationMeta = serverSnap.data();
      if (migrationMeta?.migrations?.v2_single_source_of_truth?.completedAt) {
        await cleanLegacyDeviceMirrors(uid);
        return { success: true, alreadyCompleted: true };
      }
    }
  } catch (serverErr) {
    // Si getDocFromServer falla (red inestable / servidor inalcanzable), ABORTAR de forma segura
    console.warn("[Migration] Servidor inalcanzable al verificar meta/migrations. Abortando sin tocar espejos locales:", serverErr.message);
    return { success: false, reason: 'server_unreachable' };
  }

  // 5. EJECUTAR MIGRACIÓN ÚNICA SIN PÉRDIDA DE DATOS (Local ➔ Firestore)
  console.log("[Migration] 🚀 Iniciando migración v2_single_source_of_truth hacia Firestore...");

  try {
    let migratedSessions = 0;
    let migratedStoreKeys = 0;

    // A. Migrar sesiones históricas desde idb-keyval local si no están en Firestore
    const localHistory = (await get(`coachv2_history_cache_${uid}`)) || (await get('coachv2_history')) || [];
    if (Array.isArray(localHistory) && localHistory.length > 0) {
      for (const session of localHistory) {
        if (!session || !session.id) continue;
        try {
          const sessionDocRef = doc(db, 'users', uid, 'history', session.id);
          const cloudSnap = await getDoc(sessionDocRef);

          if (!cloudSnap.exists()) {
            // No existe en la nube: subirla
            const enriched = {
              ...session,
              updatedAt: new Date().toISOString(),
              deletedAt: session.deletedAt || null
            };
            await setDoc(sessionDocRef, sanitizeForFirestore(enriched), { merge: true });
            migratedSessions++;
          } else {
            // Existe en la nube: fusionar conservando mayor número de series/volumen
            const cloudS = cloudSnap.data();
            const localSets = session.completedSets || 0;
            const cloudSets = cloudS.completedSets || 0;
            const localVol = session.volume || 0;
            const cloudVol = cloudS.volume || 0;

            if (localSets > cloudSets || (localSets === cloudSets && localVol > cloudVol)) {
              const enriched = {
                ...cloudS,
                ...session,
                updatedAt: new Date().toISOString(),
                deletedAt: cloudS.deletedAt || null
              };
              await setDoc(sessionDocRef, sanitizeForFirestore(enriched), { merge: true });
              migratedSessions++;
            }
          }
        } catch (sesErr) {
          console.warn(`[Migration] Error migrando sesión ${session.id}:`, sesErr);
        }
      }
    }

    // B. Migrar configuraciones (store) desde idb-keyval local usando mergeStoreValues
    for (const storeKey of MIRROR_STORE_KEYS_TO_CLEAN) {
      if (storeKey === 'coachv2_history') continue;
      try {
        const localVal = await get(storeKey);
        if (localVal === undefined || localVal === null) continue;

        const storeDocRef = doc(db, 'users', uid, 'store', storeKey);
        const cloudSnap = await getDoc(storeDocRef);
        const cloudDocData = cloudSnap.exists() ? cloudSnap.data() : null;
        const cloudVal = cloudDocData?.value !== undefined ? cloudDocData.value : cloudDocData;
        const cloudMeta = extractMetadataFromDoc(cloudDocData);

        const mergedVal = mergeStoreValues(storeKey, localVal, cloudVal, cloudMeta);

        if (mergedVal !== undefined && mergedVal !== null) {
          const cleanMerged = sanitizeForFirestore(stripInternalMetadata(mergedVal));
          const cleanCloud = stripInternalMetadata(cloudVal);

          // Solo escribir a Firestore si el valor fusionado difiere del existente en la nube
          if (JSON.stringify(cleanMerged) !== JSON.stringify(cleanCloud ?? null)) {
            // Si la nube ya estaba explícitamente borrada y el local no aportó datos más nuevos
            const isCleared = Boolean(cloudMeta.isCleared && (cleanMerged === null || (typeof cleanMerged === 'object' && Object.keys(cleanMerged).length === 0)));
            await setDoc(storeDocRef, {
              value: cleanMerged,
              updatedAt: new Date().toISOString(),
              __cleared: isCleared,
              clearedAt: isCleared ? (cloudDocData?.clearedAt || new Date().toISOString()) : null
            }, { merge: true });
            migratedStoreKeys++;
          }
        }
      } catch (storeErr) {
        console.warn(`[Migration] Error migrando store key ${storeKey}:`, storeErr);
      }
    }

    // C. Registrar finalización de migración en Firestore users/{uid}/meta/migrations
    const nowIso = new Date().toISOString();
    await setDoc(migrationsDocRef, {
      schemaVersion: 2,
      migrations: {
        v2_single_source_of_truth: {
          completedAt: nowIso,
          version: 2,
          migratedSessionsCount: migratedSessions,
          migratedStoreKeysCount: migratedStoreKeys
        }
      },
      updatedAt: nowIso
    }, { merge: true });

    // D. Limpiar espejos en este dispositivo
    await cleanLegacyDeviceMirrors(uid);

    console.log(`[Migration] ✅ Migración v2 completada: ${migratedSessions} sesiones y ${migratedStoreKeys} configuraciones consolidadas en Firestore.`);
    return {
      success: true,
      migrated: true,
      migratedSessions,
      migratedStoreKeys
    };
  } catch (error) {
    console.error("[Migration] Error crítico durante migración a Firestore:", error);
    return { success: false, error: error.message };
  }
}
