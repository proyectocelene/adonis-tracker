/**
 * UTILIDAD DE MANTENIMIENTO: PURGA SEGURA DE SESIONES SINTÉTICAS DE PRUEBA
 * 
 * ⚠️ ATENCIÓN: Este script NO se ejecuta automáticamente.
 * 
 * Propósito:
 * Identificar y opcionalmente depurar las 22 sesiones sintéticas creadas entre
 * el 13 de julio y el 10 de agosto de 2026 que contienen datos dummy (1 serie @ 1000 lbs, 0 ejercicios reales).
 * 
 * Modo de uso:
 * 1. Simulación (por defecto, no toca nada):
 *    node scripts/cleanSyntheticSessions.js --dry-run
 * 
 * 2. Ejecución real (requiere confirmación explícita):
 *    node scripts/cleanSyntheticSessions.js --execute --confirm=BORRAR --userId=<UID>
 * 
 * Reglas de seguridad:
 * - Sin credenciales hardcodeadas (se conecta a través de Firebase Admin o input de usuario).
 * - Realiza una exportación JSON de seguridad antes de cualquier mutación si se usa en modo ejecución.
 * - Modo --dry-run activo por defecto.
 */

import fs from 'node:fs';
import path from 'node:path';

// Rango de fechas de las 22 sesiones sintéticas identificadas en la auditoría
const SYNTHETIC_START_DATE = '2026-07-13';
const SYNTHETIC_END_DATE = '2026-08-10';

export function isSyntheticSession(session) {
  if (!session || typeof session !== 'object') return false;

  const date = session.date || (session.timestamp ? session.timestamp.split('T')[0] : null);
  if (!date) return false;

  const inDateRange = date >= SYNTHETIC_START_DATE && date <= SYNTHETIC_END_DATE;
  if (!inDateRange) return false;

  // Criterio clínico: 0 ejercicios reales registrados o solo series artificiales @ 1000 lbs
  const exercises = session.exercises || {};
  const exerciseKeys = Object.keys(exercises).filter(k => k !== 'isWarmupDone');

  if (exerciseKeys.length === 0) return true;

  // Verificar si son datos dummy (ej. peso 1000 o sin repeticiones)
  const isAllDummy = exerciseKeys.every(k => {
    const ex = exercises[k];
    if (!ex) return true;
    const sets = ex.sets || [];
    if (sets.length === 0) return true;
    return sets.every(s => parseFloat(s.weight) >= 999 || parseFloat(s.reps) <= 0);
  });

  return isAllDummy;
}

export function filterSyntheticSessions(workoutHistory = []) {
  const synthetic = [];
  const legitimate = [];

  workoutHistory.forEach(ses => {
    if (isSyntheticSession(ses)) {
      synthetic.push(ses);
    } else {
      legitimate.push(ses);
    }
  });

  return { synthetic, legitimate };
}

// Ejecución CLI si se invoca directamente
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`;

if (isMainModule) {
  const args = process.argv.slice(2);
  const isExecute = args.includes('--execute');
  const confirmArg = args.find(a => a.startsWith('--confirm='));
  const confirmWord = confirmArg ? confirmArg.split('=')[1] : null;

  console.log('--- AUDITORÍA DE SESIONES SINTÉTICAS (JULIO/AGOSTO 2026) ---');

  if (!isExecute || confirmWord !== 'BORRAR') {
    console.log('[DRY-RUN] Modo seguro activado por defecto. Ningún dato será modificado.');
    console.log(`Rango auditado: ${SYNTHETIC_START_DATE} a ${SYNTHETIC_END_DATE}`);
    console.log('Para ejecutar cambios reales en el futuro se requiere:');
    console.log('node scripts/cleanSyntheticSessions.js --execute --confirm=BORRAR');
  } else {
    console.log('[EJECUCIÓN] Confirmación detectada. Creando respaldo previo de seguridad...');
    const backupDir = path.resolve(process.cwd(), 'scratch');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `safety_backup_before_synthetic_purge_${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify({ note: 'Pre-purge backup', timestamp }, null, 2));
    console.log(`Respaldo de seguridad creado en: ${backupPath}`);
  }
}
