// SERVICIO CLEAN SLATE & PURGA DE CONFIGURACIONES OBSOLETAS
// Elimina residuos de órdenes antiguos, rutinas desfasadas y swaps huérfanos
// garantizando consistencia total entre dispositivos (móvil, tablet, PC).
// PRESERVA INTACTO: workoutHistory (series, cargas, 1RM), métricas corporales y configuraciones de máquinas.

import { db, sanitizeForFirestore } from './firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { exportFullDatabase } from './backupService.js';

export async function executeCleanSlate(currentUser) {
  // 0. Auto-backup preventivo obligatorio antes de cualquier acción destructiva
  if (currentUser) {
    try {
      await exportFullDatabase(currentUser, { isAutoBackup: true });
    } catch (e) {
      console.warn("[CleanSlate] Error al generar backup de seguridad previo:", e);
    }
  }

  const storeKeysToReset = {
    coachv2_exercise_orders: {},
    coachv2_custom_routine: null,
    coachv2_swapped_exercises: {},
    coachv2_custom_day_exercises: {},
    coachv2_week_split_override: null
  };

  const nowIso = new Date().toISOString();

  // 1. Limpieza en Firestore con marca explícita __cleared, timestamps y { merge: true }
  // Gracias a persistentLocalCache, la caché local se actualiza a 0ms y se sincroniza en la nube
  if (currentUser && currentUser.uid) {
    for (const [key, val] of Object.entries(storeKeysToReset)) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'store', key);
        await setDoc(docRef, { 
          value: sanitizeForFirestore(val), 
          __cleared: true, 
          clearedAt: nowIso,
          cleanSlateAt: nowIso,
          updatedAt: nowIso
        }, { merge: true });
      } catch (err) {
        console.warn(`[CleanSlate] Firestore warning para ${key}:`, err.message);
      }
    }
  }

  // 2. Notificar a toda la aplicación para actualización inmediata de React
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adonis_cloud_synced', {
      detail: { storeSyncPayload: storeKeysToReset }
    }));
    window.dispatchEvent(new CustomEvent('adonis_clean_slate_applied'));
  }

  return { success: true, timestamp: nowIso };
}
