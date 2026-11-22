/**
 * SERVICIO DATA GUARDIAN — PROTECCIÓN ACTIVA CONTRA PÉRDIDA MASIVA DE DATOS
 * Intercepta y bloquea cualquier intento anómalo de reducir datasets críticos en >50%,
 * protegiendo el historial de entrenamientos, configuraciones de máquinas y personalizaciones.
 */

const PROTECTED_DATASETS = new Set([
  'coachv2_history',
  'coachv2_machine_configs',
  'coachv2_machine_profiles',
  'coachv2_custom_day_exercises',
  'coachv2_swapped_exercises',
  'coachv2_exercise_orders',
  'coachv2_body_metrics_history',
  'coachv2_body_composition_data'
]);

/**
 * Obtiene el conteo efectivo de elementos de un dataset (array u objeto)
 */
export function getDatasetCount(val) {
  if (val === null || val === undefined) return 0;
  if (Array.isArray(val)) return val.length;
  if (typeof val === 'object') {
    // Excluir claves de metadatos internos al contar
    const keys = Object.keys(val).filter(k => 
      k !== '__cleared' && k !== 'clearedAt' && k !== '_updatedAt' && k !== '__approvedDrop'
    );
    return keys.length;
  }
  return 1;
}

/**
 * Valida si un cambio en un dataset es seguro o si representa una pérdida anómala de datos (>50%).
 * 
 * @param {string} datasetKey Clave del dataset (ej: 'coachv2_history')
 * @param {*} prevValue Valor anterior en memoria/disco
 * @param {*} newValue Nuevo valor propuesto
 * @returns {{ allowed: boolean, reason?: string, prevCount: number, newCount: number }}
 */
export function validateDatasetChange(datasetKey, prevValue, newValue) {
  // Solo aplicar a claves protegidas o claves que contengan 'history'
  const isProtected = PROTECTED_DATASETS.has(datasetKey) || 
    (typeof datasetKey === 'string' && (datasetKey.includes('history') || datasetKey.includes('machine')));

  if (!isProtected) {
    return { allowed: true, prevCount: 0, newCount: 0 };
  }

  const prevCount = getDatasetCount(prevValue);
  const newCount = getDatasetCount(newValue);

  // Si el dataset previo estaba vacío o casi vacío (menos de 2 elementos), permitir la mutación
  if (prevCount < 2) {
    return { allowed: true, prevCount, newCount };
  }

  // Comprobar si el nuevo valor tiene bypass explícito autorizado por el usuario
  const isExplicitlyApproved = Boolean(
    (newValue && typeof newValue === 'object' && newValue.__approvedDrop) ||
    (newValue && typeof newValue === 'object' && newValue.__cleared)
  );

  if (isExplicitlyApproved) {
    return { allowed: true, prevCount, newCount };
  }

  // Regla 1: Vaciado total de un dataset con 2 o más elementos
  if (newCount === 0 && prevCount >= 2) {
    const errorMsg = `[DataGuardian] 🛑 BLOQUEO PREVENTIVO: Intento de vaciar completamente el dataset "${datasetKey}" (${prevCount} ➔ 0 elementos).`;
    console.error(errorMsg);
    notifyGuardianAlert(datasetKey, prevCount, newCount, 'Vaciado total no autorizado');
    return {
      allowed: false,
      reason: 'Vaciado total de dataset no autorizado',
      prevCount,
      newCount
    };
  }

  // Regla 2: Caída mayor al 50% en datasets con 4 o más elementos
  if (prevCount >= 4 && newCount < prevCount * 0.5) {
    const errorMsg = `[DataGuardian] 🛑 BLOQUEO PREVENTIVO: Intento de reducción >50% en "${datasetKey}" (${prevCount} ➔ ${newCount} elementos).`;
    console.error(errorMsg);
    notifyGuardianAlert(datasetKey, prevCount, newCount, 'Reducción >50% no autorizada');
    return {
      allowed: false,
      reason: 'Reducción mayor al 50% no autorizada',
      prevCount,
      newCount
    };
  }

  return { allowed: true, prevCount, newCount };
}

/**
 * Emite un evento en window para que la UI pueda notificar de forma no intrusiva al atleta
 */
function notifyGuardianAlert(datasetKey, prevCount, newCount, reason) {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new CustomEvent('adonis_guardian_blocked', {
        detail: { datasetKey, prevCount, newCount, reason, timestamp: new Date().toISOString() }
      }));
    } catch (e) {
      console.warn('[DataGuardian] Error emitiendo alerta:', e);
    }
  }
}
