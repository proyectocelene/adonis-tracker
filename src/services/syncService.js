// SERVICIO DE SINCRONIZACIÓN MAESTRA (FASE 2: FUENTE ÚNICA DE VERDAD)
// En Fase 2, la persistencia offline (a 0ms) y la cola nativa de escrituras son
// gestionadas transparentemente por persistentLocalCache de Firestore.
// Este método delega en migrationService para asegurar que cualquier dato remanente
// sea consolidado en Firestore sin colisiones ni duplicaciones.

import { runV2FirestoreMigration } from './migrationService.js';

export async function syncAllCloudDataToIndexedDB(currentUser) {
  if (!currentUser || !currentUser.uid) {
    return { success: false, reason: 'No user authenticated' };
  }
  return await runV2FirestoreMigration(currentUser);
}
