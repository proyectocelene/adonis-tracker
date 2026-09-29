import { get, set } from 'idb-keyval';
import { db, sanitizeForFirestore } from './firebase.js';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Fusión inteligente y no destructiva entre valores locales de IndexedDB y valores de Firestore.
 * Garantiza que configuraciones, ejercicios personalizados y borradores agregados offline o localmente
 * NUNCA sean sobrescritos por documentos vacíos o antiguos en la nube.
 */
export function mergeStoreValues(key, localVal, cloudVal) {
  if (localVal === undefined || localVal === null) return cloudVal;
  if (cloudVal === undefined || cloudVal === null) return localVal;

  // 1. Ejercicios personalizados por día
  if (key === 'coachv2_custom_day_exercises') {
    const merged = { ...(typeof cloudVal === 'object' && cloudVal ? cloudVal : {}) };
    const localObj = (typeof localVal === 'object' && localVal) ? localVal : {};

    Object.keys(localObj).forEach(dayId => {
      const localList = Array.isArray(localObj[dayId]) ? localObj[dayId] : [];
      const cloudList = Array.isArray(merged[dayId]) ? merged[dayId] : [];

      const itemMap = new Map();
      cloudList.forEach(item => {
        if (item && item.id) itemMap.set(item.id, item);
      });
      localList.forEach(item => {
        if (item && item.id) {
          const existing = itemMap.get(item.id) || {};
          itemMap.set(item.id, { ...existing, ...item });
        }
      });
      merged[dayId] = Array.from(itemMap.values());
    });
    return merged;
  }

  // 2. Borradores activos de entrenamientos
  if (key === 'coachv2_active_workouts') {
    const merged = { ...(typeof cloudVal === 'object' && cloudVal ? cloudVal : {}) };
    const localObj = (typeof localVal === 'object' && localVal) ? localVal : {};

    Object.keys(localObj).forEach(k => {
      if (!merged[k]) {
        merged[k] = localObj[k];
      } else if (typeof localObj[k] === 'object' && localObj[k] !== null && typeof merged[k] === 'object' && merged[k] !== null) {
        merged[k] = { ...merged[k], ...localObj[k] };
      }
    });
    return merged;
  }

  // 3. Órdenes personalizados de ejercicios por día
  if (key === 'coachv2_exercise_orders') {
    const merged = { ...(typeof cloudVal === 'object' && cloudVal ? cloudVal : {}) };
    const localObj = (typeof localVal === 'object' && localVal) ? localVal : {};

    Object.keys(localObj).forEach(dayId => {
      const localOrder = Array.isArray(localObj[dayId]) ? localObj[dayId] : [];
      const cloudOrder = Array.isArray(merged[dayId]) ? merged[dayId] : [];

      if (localOrder.length === 0) return;
      if (cloudOrder.length === 0) {
        merged[dayId] = localOrder;
        return;
      }
      const combined = [...localOrder];
      cloudOrder.forEach(id => {
        if (!combined.includes(id)) combined.push(id);
      });
      merged[dayId] = combined;
    });
    return merged;
  }

  // 4. Historial de métricas corporales
  if (key === 'coachv2_body_metrics_history') {
    if (Array.isArray(localVal) && Array.isArray(cloudVal)) {
      const metricMap = new Map();
      cloudVal.forEach(m => {
        const id = m?.date || m?.id || m?.timestamp;
        if (id) metricMap.set(id, m);
      });
      localVal.forEach(m => {
        const id = m?.date || m?.id || m?.timestamp;
        if (id) {
          const existing = metricMap.get(id) || {};
          metricMap.set(id, { ...existing, ...m });
        }
      });
      return Array.from(metricMap.values()).sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    }
    return Array.isArray(localVal) && localVal.length > 0 ? localVal : (Array.isArray(cloudVal) ? cloudVal : []);
  }

  // 5. Diccionarios de configuraciones de máquinas, swaps, skipped, etc.
  if (
    key === 'coachv2_machine_configs' ||
    key === 'coachv2_machine_profiles' ||
    key === 'coachv2_swapped_exercises' ||
    key === 'coachv2_skipped_exercises' ||
    key === 'coachv2_smartwatch_kcal' ||
    key === 'coachv2_global_warmup' ||
    key === 'coachv2_body_composition_data'
  ) {
    if (
      typeof localVal === 'object' && localVal !== null &&
      typeof cloudVal === 'object' && cloudVal !== null &&
      !Array.isArray(localVal) && !Array.isArray(cloudVal)
    ) {
      return { ...cloudVal, ...localVal };
    }
  }

  // 6. Rutina personalizada completa o fecha de inicio de mesociclo
  if (cloudVal && (!localVal || (Array.isArray(localVal) && localVal.length === 0))) return cloudVal;
  if (localVal && (!cloudVal || (Array.isArray(cloudVal) && cloudVal.length === 0))) return localVal;

  return cloudVal !== undefined ? cloudVal : localVal;
}

/**
 * Encola un cambio de configuración en Outbox si la conexión a Firestore falló
 */
export async function enqueueStoreOutbox(uid, key, value) {
  if (!uid || !key) return;
  const outboxKey = `coachv2_store_outbox_${uid}`;
  try {
    const outbox = (await get(outboxKey)) || [];
    const filtered = outbox.filter(item => item.key !== key);
    filtered.push({ key, value, timestamp: Date.now() });
    await set(outboxKey, filtered);
  } catch (e) {
    console.warn(`[StoreOutbox] Error encolando ${key}:`, e);
  }
}

/**
 * Procesa y sube todos los elementos pendientes en la cola Outbox a Firestore
 */
export async function flushStoreOutbox(currentUser) {
  if (!currentUser || !currentUser.uid || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
  const outboxKey = `coachv2_store_outbox_${currentUser.uid}`;
  try {
    const outbox = (await get(outboxKey)) || [];
    if (!Array.isArray(outbox) || outbox.length === 0) return;

    const remaining = [];
    for (const item of outbox) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'store', item.key);
        await setDoc(docRef, { value: sanitizeForFirestore(item.value) }, { merge: true });
        console.log(`[StoreOutbox] ☁️ Sincronizado ${item.key} pendiente con Firestore.`);
      } catch (err) {
        console.warn(`[StoreOutbox] Error subiendo ${item.key}, se mantendrá en cola:`, err);
        remaining.push(item);
      }
    }
    await set(outboxKey, remaining);
  } catch (e) {
    console.warn("[StoreOutbox] Error procesando cola de configuraciones:", e);
  }
}
