# 🗺️ ROADMAP — Optimización Adonis Tracker / Coach V2

> Documento vivo. **Cada chat de IA lo lee al iniciar y lo actualiza al terminar.**
> Regla: 1 chat = 1 fase = 1 rama git. Nunca pegar el JSON de backup en el chat.

| Fase | Objetivo | Herramienta | Modo | Rama | Estado |
|---|---|---|---|---|---|
| 0 | Auditoría, backup, docs para IA | Quick | Smart | — | ✅ Hecha (2026-11-22) · ⏳ falta backup fresco + commit del usuario |
| 1 | Detener pérdida de datos | Antigravity | Planning + modelo más potente, razonamiento alto | `fix/perdida-datos` | ✅ Hecha (2026-11-22) |
| 2 | Fuente única de verdad de datos | Antigravity | Planning + alto | `refactor/fuente-unica-datos` | ✅ Hecha (2026-11-22) |
| 3 | Tests, CI, Firestore rules | Antigravity | Planning + medio | `chore/estabilidad` | ✅ Hecha (2026-11-22) |
| 4 | Dividir archivos gigantes (1 archivo por chat) | Antigravity | Planning + alto | `refactor/<archivo>` | ⬜ |
| 5 | UI para uso en el gym | Quick (mockup) → Antigravity (implementación) | Balanced / Fast | `ui/<pantalla>` | ⬜ |
| ✔ | Revisión al cierre de cada fase | Quick, chat "Revisor Adonis" | Smart | — | — |

---

## FASE 0 — Resultados de la auditoría (2026-11-22)

### Estado del repositorio
- Rama `main`. Último commit: 2026-11-18 20:41 — *"feat(ui/pwa): optimizaciones mobile-native en Android…"*.
- ~39,000 líneas de código propio. Archivos más grandes: `unifiedExerciseLibrary.js` (2,724), `WorkoutDay.jsx` (2,306), `scientificProtocol.js` (2,143), `CardioLogger.jsx` (2,110), `ExerciseProgressionChart.jsx` (1,885), `exerciseMatcher.js` (1,723), `SetLogger.jsx` (1,463).
- `.gitignore` ✅ ya excluye `base de datos pruebas/` y `*Backup*.json`.
- Docs para IA corregidos: `AGENTS.md` (rutas rotas `Dr. Donato/...` → relativas, + reglas de seguridad de datos + flujo por chat), `GEMINI.md` (rutas, React 19, orden de lectura), `AI_INSTRUCTIONS_PROJECT_CONTEXT.md` (React 19).

### Auditoría del único backup encontrado
Archivo: `base de datos pruebas/COACH_V2_Backup_Total_Firebase_2026-09-17.json` (1.1 MB)

| Métrica | Valor |
|---|---|
| Fecha de exportación | **2026-09-17** → ⚠️ **más de 2 meses de antigüedad** |
| Cuenta | `donato.mp3@gmail.com` (uid `6TZZ3E…`) |
| Sesiones totales | 60 (IDs únicos, sin duplicados fecha+día ✅) |
| Sesiones reales con ejercicios | **32** (2026-08-12 → 2026-09-15), 743 series, 668,390 de volumen |
| Sesiones sintéticas de prueba | **22** (jul-13 → ago-10, 1 serie @ 1000, sin ejercicios) — basura de pruebas |
| Días descanso / perdidos | 3 / 3 |
| Peso corporal | 10 registros · composición corporal 25 campos · machineConfigs 30 |

### 🔴 Hallazgos nuevos de la Fase 0
1. **Prueba directa del bug de purga:** el backup contiene en IndexedDB las banderas `coachv2_protocol_adonis_2026_09_07_clean_guest` y `coachv2_purge_active_v7_guest`. Las banderas se calculan con `currentUser?.uid || 'guest'` → la bandera de *guest* no protege al usuario logueado (y viceversa), así que las purgas de `App.jsx` **se ejecutan de nuevo** al cambiar de estado de sesión, en cada dispositivo/navegador nuevo y tras cualquier limpieza de localStorage. `PURGE_ACTIVE_V7` escribe `{}` en Firestore **sin merge** sobre `coachv2_active_workouts` → **borra el entrenamiento en curso en la nube**.
2. **El backup está incompleto:** el backup de septiembre no trae `coachv2_machine_profiles` (el exportador actual ya lo incluye, `backupService.js:177`), y el exportador actual **sigue sin incluir** `coachv2_deload_active`, `coachv2_deload_cycle_config`, `coachv2_week_split_override` ni `coachv2_dismissed_pending_alerts`. Un "restore" (que borra todo primero) **pierde esos datos para siempre**.
3. **API key expuesta:** `coachv2_deepseek_api_key` se guarda en Firestore y viaja dentro de los backups JSON. Debe excluirse del backup y, idealmente, rotarse.
4. Hay dos nombres de clave para la API key: los datos guardados usan `coachv2_deepseek_api_key`, pero el código actual (`WorkoutDay.jsx:56`) lee `coachv2_deepseek_apikey` → la key guardada antes quedó huérfana (la app no la encuentra).

### ⏳ Pendiente del usuario para cerrar la Fase 0
- [ ] Abrir la app (con la cuenta correcta) → Historial → Exportar **backup total nuevo** → guardarlo en `base de datos pruebas/`.
- [ ] Commit de seguridad: `git add . && git commit -m "docs: fase 0 - auditoria, reglas de seguridad y roadmap"`.
- [ ] (Opcional) Pedir a Quick que audite el backup nuevo y lo compare con el de septiembre para medir cuántos datos se han perdido.
- [ ] Rotar la API key de DeepSeek.

---

## FASE 1 — Detener la pérdida de datos (✅ Hecha 2026-11-22)
**Dónde:** Antigravity · chat `01-perdida-datos` · Planning · Rama: `fix/perdida-datos`.

### Resultados y Cambios Implementados:
- [x] **Tarea A:** Purgas de arranque eliminadas de `App.jsx` (`PROTOCOL_V3_FLAG` y `PURGE_ACTIVE_V7` removidos al 100%). Ningún código de arranque escribe en Firestore sin `{ merge: true }`.
- [x] **Tarea B:** `mergeStoreValues` en `storeSyncHelper.js` reescrito. Un valor vacío (`{}`, `[]`, `null`) NUNCA borra datos poblados. Borrado explícito controlado con marca `{ __cleared: true, clearedAt }` comparado contra timestamps. Los metadatos internos son purgados con `stripInternalMetadata` para que jamás contaminen `Object.keys()` en el estado de React. Soporta metadatos de documentos de Firestore (`extractMetadataFromDoc`) para propagación segura de Clean Slate entre dispositivos.
- [x] **Tarea C:** `useIndexedDB.js` implementa `isLoadedRef` y cola `pendingQueueRef`. `setValue` se encola mientras `isLoading === true`; `initialValue` nunca se persiste automáticamente ni en IndexedDB ni en Firestore. `initialValueRef` utilizado para desacoplar el hook y evitar ciclos infinitos de renderizado en React 19. Las escrituras normales registran explícitamente `__cleared: false` con `{ merge: true }`.
- [x] **Tarea D:** `backupService.js` exporta todas las claves `coachv2_*` (`deload_*`, `machine_profiles`, `week_split_override`, `dismissed_pending_alerts`, etc.) y purga credenciales de API (`stripSensitiveBackupKeys`). `restoreFullDatabase` centraliza la creación de un auto-backup de seguridad previo (sin contaminar IndexedDB), valida que el archivo no esté vacío antes de tocar Firestore, realiza upsert por lotes con `writeBatch` (lotes de 400 con `{ merge: true, __cleared: false }`) SIN borrar previamente la base de datos, y solo depura huérfanos si se restauraron registros y tras verificar que las escrituras fueron exitosas (excluyendo estrictamente claves sensibles/locales).
- [x] **Tarea E:** `ModalProvider` en `UIComponents.jsx` soporta `requireWord: 'BORRAR'`. Acciones destructivas ("Reset Total" en `HistoryView.jsx`, "Clean Slate" y "Restablecer a Oficial" en `cleanSlateService.js` / `WorkoutDay.jsx`, "Restaurar Backup") descargan backup previo y bloquean el botón de confirmación hasta escribir exactamente `BORRAR`.
- [x] **Tarea F:** `navigator.storage.persist()` activado en `App.jsx` para solicitar persistencia de almacenamiento al navegador y prevenir desalojo de IndexedDB.
- [x] **Tarea G:** `dataGuardian.js` creado e integrado en `useIndexedDB.js` y `useWorkoutHistory.js`. Intercepta y bloquea de forma segura cualquier reducción anómala >50% o vaciado total de datasets críticos (`coachv2_history`, configuraciones, métricas), sin lanzar excepciones no capturadas que congelen React. Escucha activa de `adonis_guardian_blocked` en `App.jsx` para alertar al usuario de forma no intrusiva.
- [x] **Tarea H:** API key de DeepSeek unificada a `coachv2_deepseek_api_key`. Migración automática en `App.jsx`, clave local exclusiva en IndexedDB (excluida de la sincronización de Firestore en `syncService.js` y de los backups en `backupService.js`).

---

## FASE 2 — Fuente única de verdad (✅ Hecha 2026-11-22)
**Dónde:** Antigravity · chat `02-arquitectura-datos` · Planning + alto · Rama: `refactor/fuente-unica-datos`.

### Resultados y Cambios Implementados:
- [x] **Capa offline/online consolidada:** Firestore configurado con `persistentLocalCache({ tabManager: persistentMultipleTabManager() })` como ÚNICA fuente de verdad. Se eliminaron el espejo paralelo en `idb-keyval` y las colas outbox manuales (`coachv2_outbox_${uid}`, `coachv2_store_outbox_${uid}`).
- [x] **Soft-delete universal en `history`:** Borrado de sesiones implementado mediante marca `{ deletedAt: nowIso, updatedAt: nowIso }` con `{ merge: true }`. Las sesiones eliminadas en un dispositivo jamás resucitan en otro que sincronice offline posteriormente.
- [x] **Aislamiento estricto de credenciales:** API key de DeepSeek aislada exclusivamente en `idb-keyval` local con namespace por usuario (`coachv2_${uid}_deepseek_api_key`), excluida 100% de Firestore y de los backups. `coachv2_theme` preservado en `localStorage` para prevenir FOUC.
- [x] **Registro de migraciones en Firestore (`users/{uid}/meta/migrations`):** Se eliminaron las banderas volátiles en `localStorage`. La migración `v2_single_source_of_truth` se registra en la nube y se ejecuta solo con conexión verificada en el servidor sin sobreescribir datos más nuevos (`mergeStoreValues`).
- [x] **Drenado multi-dispositivo y limpieza de espejos:** `migrationService.js` drena colas outbox remanentes en cada dispositivo antes de purgar claves espejo obsoletas en `idb-keyval`.
- [x] **Hook unificado `useSyncedStore(key, initialValue)`:** Creado en `src/hooks/useSyncedStore.js` con suscripción directa `onSnapshot` a `users/{uid}/store/{key}`. Mantiene `initialValueRef`, cola de carga `isLoadedRef`, y `dataGuardian`. Maneja transparentemente Clean Slate persistiendo `__cleared: true` y `clearedAt` mientras entrega el valor limpio a React.
- [x] **Retrocompatibilidad total:** `useIndexedDB.js` y `useLocalStorage.js` re-exportan `useSyncedStore`. Los 8 componentes consumidores (`BodyWeightView`, `ExerciseRow`, `HistoryView`, `WorkoutDay`, `GymMembershipReminder`, `SetLogger`, `MonthlyCalendar`, `useGamification`) fueron migrados directamente a `useSyncedStore`.
- [x] **Logout limpio:** En `useWorkoutHistory.js`, cuando `currentUser` pasa a `null`, el estado en memoria se reinicia a `[]` sin disparar falsas alertas de DataGuardian.
- [x] **`backupService.js` como fuente única:** `exportFullDatabase` y `exportWorkoutHistory` leen directamente de Firestore (filtrando `!s.deletedAt`) sin mezclar volcados locales antiguos. `restoreFullDatabase` aplica upsert con `deletedAt: null`, soft-delete a sesiones huérfanas y elimina escrituras espejo a `idb-keyval`.
- [x] **Validación y compilación:** Script temporal de verificación ejecutado con éxito total contra el backup maestro del 2026-11-22 (113 sesiones, 171 machineConfigs, 146 profiles, 9 pesos, 25 bioimpedancia, soft-delete, DataGuardian y exclusión de API keys). `npm run build` limpio y optimizado con PWA.

## FASE 3 — Estabilidad (✅ Hecha 2026-11-22)
**Dónde:** Antigravity · chat `03-estabilidad` · Planning + medio · Rama: `chore/estabilidad`.

### Resultados y Cambios Implementados:
- [x] **Linting Funcional (`package.json`):** Script corregido a `"lint": "oxlint"` aprovechando la configuración de `.oxlintrc.json`. Ejecución limpia sobre 99 archivos en ~40ms con 0 errores.
- [x] **Vitest y Suite de Pruebas Unitarias (57 tests en 6 suites):**
  - `vitest.config.js` y `tests/setup.js` configurados con aislamiento 100% de Node.js mockeando `firebase.js` y `idb-keyval` (sin dependencias de red ni fugas de disco).
  - `storeSyncHelper.test.js`: Validación de `mergeStoreValues` (el vacío nunca sobreescribe datos poblados), borrado explícito con `__cleared: true` y timestamps, y purga de metadatos con `stripInternalMetadata` y `extractMetadataFromDoc`.
  - `dataGuardian.test.js`: Bloqueo preventivo de reducciones anómalas >50%, bloqueo de vaciado total, bypass controlado con `__approvedDrop` / `__cleared`, conteo seguro y emisión de alertas de evento.
  - `backupService.test.js`: Purga recursiva de credenciales y API keys (`stripSensitiveBackupKeys`) y saneamiento cronológico/fechas de sesiones (`sanitizeWorkoutHistory`).
  - `exerciseMatcher.test.js`: Resolución de códigos canónicos de 3 segmentos (`[GRUPO-MÁQUINA-ESPEC]`), mapeo de retrocompatibilidad desde códigos legados, aislamiento biomecánico estricto (no mezcla de variantes de máquinas vs libres) y extracción de récords históricos (`getHistoricalRecordsForExercise`).
  - `workoutCalculations.test.js`: Fórmula de Epley de 1RM, tonelaje acumulado de volumen (bilateral y unilateral por extremidad con conversión de kg a lbs), clasificación unilateral y cálculo de RPE promedio.
  - `cleanSyntheticSessions.test.js`: Detección clínica de sesiones sintéticas de prueba de julio/agosto sin ejercicios reales.
- [x] **CI/CD Blindado en GitHub Actions (`.github/workflows/deploy.yml`):**
  - Pipeline en 2 etapas: Job `build` obligatorio que ejecuta secuencialmente `npm ci`, `npm run lint`, `npm test` y `npm run build`.
  - Si cualquiera de los 3 pasos falla, el job falla y el despliegue queda completamente cancelado.
  - Soporte para `pull_request` hacia `main` ejecutando validaciones de CI; despliegue a GitHub Pages restringido exclusivamente a eventos que no sean PR (`push` a `main` o `workflow_dispatch`).
- [x] **Reglas de Seguridad de Cloud Firestore (`firestore.rules` y `firebase.json`):**
  - Autoradas mediante el subagente mandatorio `firestore-rules-author`.
  - Default deny absoluto en la raíz (`match /{document=**} { allow read, write: if false; }`).
  - Aislamiento multi-tenant estricto: cada usuario autenticado SOLO puede leer/escribir sus propios documentos y subcolecciones bajo `users/{userId}/**` validando `request.auth != null && request.auth.uid == userId`.
- [x] **Preservación Segura de Sesiones Sintéticas (`scripts/cleanSyntheticSessions.js`):**
  - Utilidad opcional aislada sin credenciales hardcodeadas, limpia ante `oxlint` y configurada en modo `--dry-run` por defecto. No se ejecutó ningún borrado automático en la base de datos de producción.
- [x] **Validación 100% en verde:**
  - `npm run lint`: 0 errores.
  - `npm test`: 57 tests superados (6 archivos, ~0.5s).
  - `npm run build`: Compilación limpia de producción en 1.1s con Service Worker PWA generado.

## FASE 4 — Dividir archivos gigantes (un chat por archivo)
**Dónde:** Antigravity · `04a-workoutday`, `04b-cardiologger`, `04c-progressionchart`, `04d-setlogger` · Planning + alto.

```
Lee AGENTS.md y docs/ROADMAP.md. Rama: refactor/workoutday.
Divide src/components/WorkoutDay.jsx (2,306 líneas) SIN cambiar comportamiento:
- Extraer estado/sync a hooks (useWorkoutSession, useRoutineConfig, useDeload).
- Extraer modales y handlers a componentes/archivos propios.
- Meta: ningún archivo >400 líneas.
- Tests de Fase 3 deben pasar; npm run build limpio.
Plan con mapa de archivos nuevos ANTES de mover código.
```

## FASE 5 — UI para el gym
- **Quick (Balanced):** "Hazme un mockup HTML de la pantalla de registro de series para usar con una mano en el gym: registrar una serie en ≤2 toques, indicador de Guardado ✓ / Pendiente ⟳, modo oscuro."
- **Antigravity (Fast), un chat por pantalla:** "Implementa este mockup [adjunto] en SetLogger.jsx sin tocar la lógica de datos."

## ✔ Revisión al cierre de cada fase (Quick, chat "Revisor Adonis", Smart)
```
Revisa la fase X del proyecto adonis-tracker-main. Lee docs/ROADMAP.md y los
archivos modificados (git diff main...<rama>). Busca: riesgos de pérdida de datos,
regresiones, setDoc sin merge, código muerto. Veredicto: aprobar / corregir.
```

---

## 📒 Bitácora de decisiones
- 2026-11-22 · Fase 0 · Se adoptan las Reglas de Seguridad de Datos en `AGENTS.md`. Se decide implementar en Antigravity (puede ejecutar build/dev server) y revisar en Quick.
- 2026-11-22 · Fase 1 · Se completan las tareas A-H para eliminar todas las causas de pérdida de datos. Se blindan `mergeStoreValues`, `useIndexedDB`, `useWorkoutHistory`, `syncService` y `backupService` (upsert sin wipe previo). Las acciones destructivas ahora requieren confirmación escribiendo `BORRAR` y generan backup previo automático. Se crea `dataGuardian.js` para bloquear caídas anómalas >50%. Build y pruebas de integridad 100% exitosas.
