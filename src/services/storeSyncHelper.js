import { db, sanitizeForFirestore } from './firebase.js';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Limpia cualquier metadato interno (__cleared, clearedAt, _updatedAt, etc.)
 * para que NUNCA contamine el estado de React ni altere Object.keys()
 */
export function stripInternalMetadata(data) {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(stripInternalMetadata);
  }
  const clean = {};
  for (const [k, v] of Object.entries(data)) {
    if (
      k === '__cleared' ||
      k === 'clearedAt' ||
      k === 'cleanSlateAt' ||
      k === '_updatedAt' ||
      k === '__approvedDrop'
    ) {
      continue;
    }
    clean[k] = (v && typeof v === 'object') ? stripInternalMetadata(v) : v;
  }
  return clean;
}

/**
 * Extrae metadatos de borrado o actualización de un valor o documento Firestore
 */
export function extractMetadataFromDoc(rawDoc) {
  if (!rawDoc || typeof rawDoc !== 'object') {
    return { isCleared: false, clearedAt: 0, updatedAt: 0 };
  }
  const isCleared = Boolean(rawDoc.__cleared || (rawDoc.value && rawDoc.value.__cleared));
  const clearedAt = rawDoc.clearedAt ? new Date(rawDoc.clearedAt).getTime() : 
    (rawDoc.cleanSlateAt ? new Date(rawDoc.cleanSlateAt).getTime() : 
    (rawDoc.value?.clearedAt ? new Date(rawDoc.value.clearedAt).getTime() : 
    (rawDoc.value?.cleanSlateAt ? new Date(rawDoc.value.cleanSlateAt).getTime() : 0)));
  const updatedAt = rawDoc.updatedAt ? new Date(rawDoc.updatedAt).getTime() :
    (rawDoc._updatedAt ? new Date(rawDoc._updatedAt).getTime() :
    (rawDoc.timestamp ? new Date(rawDoc.timestamp).getTime() :
    (rawDoc.value?._updatedAt ? new Date(rawDoc.value._updatedAt).getTime() : 
    (rawDoc.value?.updatedAt ? new Date(rawDoc.value.updatedAt).getTime() : 0))));

  return { isCleared, clearedAt, updatedAt };
}

function extractMetadata(val) {
  return extractMetadataFromDoc(val);
}

/**
 * Comprueba si un valor representa una estructura "vacía"
 */
function isEffectivelyEmpty(val) {
  if (val === null || val === undefined) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'object') {
    const cleanKeys = Object.keys(val).filter(k => 
      k !== '__cleared' && k !== 'clearedAt' && k !== 'cleanSlateAt' && k !== '_updatedAt' && k !== '__approvedDrop'
    );
    return cleanKeys.length === 0;
  }
  return false;
}

/**
 * Fusión inteligente, resiliente y NO destructiva entre IndexedDB local y Firestore.
 * 
 * Reglas de Seguridad Absolutas:
 * 1. Un valor vacío NUNCA borra datos existentes.
 * 2. Un borrado SOLO es válido si fue explícitamente marcado con { __cleared: true, clearedAt }.
 * 3. Los metadatos internos jamás se filtran al valor devuelto para React.
 */
export function mergeStoreValues(key, localVal, cloudVal, cloudMetaParam = null, localMetaParam = null) {
  const localMeta = localMetaParam || extractMetadata(localVal);
  const cloudMeta = cloudMetaParam || extractMetadata(cloudVal);

  // Manejo de Borrado Explícito (__cleared: true)
  if (localMeta.isCleared) {
    if (localMeta.clearedAt >= cloudMeta.updatedAt) {
      // El borrado local explícito es posterior a la última actualización de la nube
      return Array.isArray(cloudVal) ? [] : (key === 'coachv2_custom_routine' ? null : {});
    }
    // Si la nube tiene datos posteriores al borrado, la nube gana
    return stripInternalMetadata(cloudVal);
  }

  if (cloudMeta.isCleared) {
    if (cloudMeta.clearedAt >= localMeta.updatedAt) {
      // El borrado en la nube es posterior a la última actualización local
      return Array.isArray(localVal) ? [] : (key === 'coachv2_custom_routine' ? null : {});
    }
    // Si el local tiene datos posteriores al borrado de la nube, el local gana
    return stripInternalMetadata(localVal);
  }

  // Si uno de los dos es undefined o null (y no fue un borrado explícito)
  if (localVal === undefined || localVal === null) {
    return stripInternalMetadata(cloudVal);
  }
  if (cloudVal === undefined || cloudVal === null) {
    return stripInternalMetadata(localVal);
  }

  // Regla Fundamental: Si un lado está vacío y el otro poblado, GANA EL POBLADO
  const localEmpty = isEffectivelyEmpty(localVal);
  const cloudEmpty = isEffectivelyEmpty(cloudVal);

  if (localEmpty && !cloudEmpty) return stripInternalMetadata(cloudVal);
  if (cloudEmpty && !localEmpty) return stripInternalMetadata(localVal);
  if (localEmpty && cloudEmpty) {
    return Array.isArray(localVal) || Array.isArray(cloudVal) ? [] : 
      (typeof localVal === 'object' || typeof cloudVal === 'object' ? {} : localVal);
  }

  // 1. Ejercicios personalizados por día
  if (key === 'coachv2_custom_day_exercises') {
    const rawCloud = typeof cloudVal === 'object' && cloudVal ? cloudVal : {};
    const rawLocal = typeof localVal === 'object' && localVal ? localVal : {};
    const merged = {};

    const allDays = new Set([...Object.keys(rawCloud), ...Object.keys(rawLocal)]);
    allDays.forEach(dayId => {
      const localList = Array.isArray(rawLocal[dayId]) ? rawLocal[dayId] : [];
      const cloudList = Array.isArray(rawCloud[dayId]) ? rawCloud[dayId] : [];

      if (localList.length === 0 && cloudList.length > 0) {
        merged[dayId] = cloudList.map(stripInternalMetadata);
        return;
      }
      if (cloudList.length === 0 && localList.length > 0) {
        merged[dayId] = localList.map(stripInternalMetadata);
        return;
      }

      const itemMap = new Map();
      cloudList.forEach(item => {
        if (item && item.id) itemMap.set(item.id, stripInternalMetadata(item));
      });
      localList.forEach(item => {
        if (item && item.id) {
          const existing = itemMap.get(item.id) || {};
          itemMap.set(item.id, { ...existing, ...stripInternalMetadata(item) });
        }
      });
      merged[dayId] = Array.from(itemMap.values());
    });
    return stripInternalMetadata(merged);
  }

  // 2. Borradores activos de entrenamientos (Fusión profunda nivel ejercicio y serie)
  if (key === 'coachv2_active_workouts') {
    const rawCloud = typeof cloudVal === 'object' && cloudVal ? cloudVal : {};
    const rawLocal = typeof localVal === 'object' && localVal ? localVal : {};
    const merged = {};

    const allDraftKeys = new Set([...Object.keys(rawCloud), ...Object.keys(rawLocal)]);
    allDraftKeys.forEach(draftKey => {
      const cloudDraft = rawCloud[draftKey];
      const localDraft = rawLocal[draftKey];

      if (!cloudDraft && localDraft) {
        merged[draftKey] = stripInternalMetadata(localDraft);
      } else if (cloudDraft && !localDraft) {
        merged[draftKey] = stripInternalMetadata(cloudDraft);
      } else if (typeof localDraft === 'object' && typeof cloudDraft === 'object') {
        const mergedDraft = { ...stripInternalMetadata(cloudDraft) };
        Object.keys(localDraft).forEach(exId => {
          if (!mergedDraft[exId]) {
            mergedDraft[exId] = stripInternalMetadata(localDraft[exId]);
          } else if (typeof localDraft[exId] === 'object' && localDraft[exId] !== null) {
            const cloudEx = mergedDraft[exId] || {};
            mergedDraft[exId] = {
              ...stripInternalMetadata(cloudEx),
              ...stripInternalMetadata(localDraft[exId])
            };
          }
        });
        merged[draftKey] = mergedDraft;
      }
    });
    return stripInternalMetadata(merged);
  }

  // 3. Órdenes personalizados de ejercicios por día
  if (key === 'coachv2_exercise_orders') {
    const rawCloud = typeof cloudVal === 'object' && cloudVal ? cloudVal : {};
    const rawLocal = typeof localVal === 'object' && localVal ? localVal : {};
    const merged = {};

    const allDays = new Set([...Object.keys(rawCloud), ...Object.keys(rawLocal)]);
    allDays.forEach(dayId => {
      const localOrder = Array.isArray(rawLocal[dayId]) ? rawLocal[dayId] : [];
      const cloudOrder = Array.isArray(rawCloud[dayId]) ? rawCloud[dayId] : [];

      // Un array vacío nunca sobrescribe una lista ordenada existente
      if (localOrder.length === 0 && cloudOrder.length > 0) {
        merged[dayId] = cloudOrder;
      } else if (cloudOrder.length === 0 && localOrder.length > 0) {
        merged[dayId] = localOrder;
      } else if (localOrder.length > 0) {
        // Si ambos tienen orden, preferir el orden local más reciente
        merged[dayId] = localOrder;
      } else {
        merged[dayId] = [];
      }
    });
    return stripInternalMetadata(merged);
  }

  // 4. Historial de métricas corporales
  if (key === 'coachv2_body_metrics_history') {
    if (Array.isArray(localVal) && Array.isArray(cloudVal)) {
      const metricMap = new Map();
      cloudVal.forEach(m => {
        const id = m?.date || m?.id || m?.timestamp;
        if (id) metricMap.set(id, stripInternalMetadata(m));
      });
      localVal.forEach(m => {
        const id = m?.date || m?.id || m?.timestamp;
        if (id) {
          const existing = metricMap.get(id) || {};
          metricMap.set(id, { ...existing, ...stripInternalMetadata(m) });
        }
      });
      return Array.from(metricMap.values()).sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    }
    return Array.isArray(localVal) && localVal.length > 0 ? 
      localVal.map(stripInternalMetadata) : 
      (Array.isArray(cloudVal) ? cloudVal.map(stripInternalMetadata) : []);
  }

  // 5. Diccionarios de configuraciones de máquinas, swaps, skipped, etc.
  if (
    key === 'coachv2_machine_configs' ||
    key === 'coachv2_machine_profiles' ||
    key === 'coachv2_swapped_exercises' ||
    key === 'coachv2_skipped_exercises' ||
    key === 'coachv2_smartwatch_kcal' ||
    key === 'coachv2_global_warmup' ||
    key === 'coachv2_body_composition_data' ||
    key === 'coachv2_physique_goal' ||
    key === 'coachv2_dismissed_pending_alerts'
  ) {
    const cleanCloud = stripInternalMetadata(cloudVal) || {};
    const cleanLocal = stripInternalMetadata(localVal) || {};

    const mergedDict = { ...cleanCloud };

    Object.keys(cleanLocal).forEach(itemKey => {
      const localItem = cleanLocal[itemKey];
      const cloudItem = cleanCloud[itemKey];

      if (!cloudItem) {
        mergedDict[itemKey] = localItem;
      } else if (localItem && typeof localItem === 'object' && cloudItem && typeof cloudItem === 'object') {
        const localTime = new Date(localItem._updatedAt || localItem.updatedAt || localItem.timestamp || 0).getTime();
        const cloudTime = new Date(cloudItem._updatedAt || cloudItem.updatedAt || cloudItem.timestamp || 0).getTime();

        if (localTime >= cloudTime) {
          mergedDict[itemKey] = { ...cloudItem, ...localItem };
        } else {
          mergedDict[itemKey] = { ...localItem, ...cloudItem };
        }
      } else {
        // Primitivo: local prevalece
        mergedDict[itemKey] = localItem;
      }
    });

    return stripInternalMetadata(mergedDict);
  }

  // 6. Rutina personalizada completa
  if (key === 'coachv2_custom_routine') {
    // Si uno es null y el otro tiene una rutina definida, PRESERVAR la rutina
    // (a menos que haya sido un borrado explícito con __cleared ya evaluado arriba)
    if (localVal && !cloudVal) return stripInternalMetadata(localVal);
    if (!localVal && cloudVal) return stripInternalMetadata(cloudVal);
    return stripInternalMetadata(localVal || cloudVal || null);
  }

  // 7. Estado y ciclo de descarga (Deload)
  if (key === 'coachv2_deload_active') {
    if (typeof localVal === 'boolean') return localVal;
    if (typeof cloudVal === 'boolean') return cloudVal;
    return Boolean(localVal ?? cloudVal);
  }

  if (key === 'coachv2_deload_cycle_config') {
    if (!localVal && !cloudVal) return null;
    if (!localVal) return stripInternalMetadata(cloudVal);
    if (!cloudVal) return stripInternalMetadata(localVal);
    if (localVal.isActive === false || localVal.manuallyExited) return stripInternalMetadata(localVal);
    if (cloudVal.isActive === false || cloudVal.manuallyExited) return stripInternalMetadata(cloudVal);
    return stripInternalMetadata({ ...cloudVal, ...localVal });
  }

  // 8. Split override semanal
  if (key === 'coachv2_week_split_override') {
    if (!localVal && cloudVal) return stripInternalMetadata(cloudVal);
    if (localVal && !cloudVal) return stripInternalMetadata(localVal);
    return stripInternalMetadata(localVal || cloudVal || null);
  }

  // Tratamiento estricto de booleanos
  if (typeof localVal === 'boolean') return localVal;
  if (typeof cloudVal === 'boolean') return cloudVal;

  return stripInternalMetadata(localVal !== undefined ? localVal : cloudVal);
}

/**
 * @deprecated En Fase 2 Firestore persistentLocalCache gestiona la cola nativa offline.
 */
export async function enqueueStoreOutbox() {}

/**
 * @deprecated En Fase 2 Firestore persistentLocalCache gestiona la sincronización offline.
 */
export async function flushStoreOutbox() {}
