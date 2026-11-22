# AGENTS.md — GUÍA DE PROYECTO PARA AGENTES AUTÓNOMOS

> Lectura obligatoria al iniciar CUALQUIER chat/sesión, en este orden:
> 1. Este archivo (`AGENTS.md`)
> 2. [`docs/ROADMAP.md`](./docs/ROADMAP.md) — fase actual, qué está hecho y qué falta
> 3. [`AI_INSTRUCTIONS_PROJECT_CONTEXT.md`](./AI_INSTRUCTIONS_PROJECT_CONTEXT.md) — contexto técnico y clínico profundo

## Resumen Operativo
- **Proyecto**: Adonis Tracker / Coach V2 (Clinical Hypertrophy & Progressive Overload Tracker).
- **Stack**: React 19, Vite 8, Firebase Firestore, IndexedDB (`idb-keyval`), Recharts, Tailwind 4, PWA (`vite-plugin-pwa`). Deploy: GitHub Pages vía `.github/workflows/deploy.yml` (push a `main` = producción).
- **Core de Matching**: [`src/utils/exerciseMatcher.js`](./src/utils/exerciseMatcher.js).
- **Biblioteca de Ejercicios**: [`src/data/unifiedExerciseLibrary.js`](./src/data/unifiedExerciseLibrary.js).
- **Protocolo de Entrenamiento**: [`src/data/scientificProtocol.js`](./src/data/scientificProtocol.js).
- **Capa de datos**: `src/hooks/useIndexedDB.js` (importado como alias `useLocalStorage` en 8 archivos), `src/hooks/useWorkoutHistory.js`, `src/services/syncService.js`, `src/services/storeSyncHelper.js`, `src/services/backupService.js`, `src/services/cleanSlateService.js`, purgas de arranque en `src/App.jsx`.
- **Norma de Códigos**: `[GRUPO-MÁQUINA-ESPEC]` de 3 segmentos con aislamiento por estación.

## 🛡️ Reglas de Seguridad de Datos (NO NEGOCIABLES)
El usuario ha sufrido pérdidas de datos reales. Cualquier cambio debe respetar:
1. **Nunca** escribir en Firestore con `setDoc` **sin** `{ merge: true }` salvo en una función de borrado explícito aprobada por el usuario.
2. **Nunca** ejecutar código en el arranque de la app (`App.jsx`, `useEffect` globales) que escriba `{}`, `[]` o `null` sobre datos del usuario.
3. **Un valor vacío nunca gana** en una fusión local ↔ nube. Un borrado solo es válido si es explícito (marca `__cleared` / `deletedAt`).
4. **Nunca** persistir el `initialValue` de un hook antes de que termine la carga (`isLoading === true`).
5. Toda acción destructiva (reset, restore, clean slate) debe: (a) generar un backup JSON automático antes, (b) pedir confirmación fuerte.
6. Las banderas de migración/purga **no** deben vivir en `localStorage` con prefijo `coachv2_` (la migración de `App.jsx` las borra).
7. **Nunca** commitear datos reales: `base de datos pruebas/`, `*Backup*.json` están en `.gitignore` y deben seguir ahí. Tampoco API keys.

## 🔁 Flujo de Trabajo por Chat
- **Un chat = una fase/tarea del ROADMAP = una rama git** (`fix/...`, `refactor/...`, `chore/...`, `ui/...`). Nunca trabajar directo en `main`.
- Antes de editar: presentar un **PLAN** y esperar aprobación.
- Cambios mínimos y enfocados; no mezclar datos + UI en el mismo chat.
- **Nunca** pegar/leer completo el JSON de backup en el contexto; referenciar su ruta y analizarlo con scripts.
- Al terminar: `npm run build` limpio → pruebas manuales descritas → actualizar `docs/ROADMAP.md` (hecho / pendiente / decisiones) → commit.

## Validación
- Ejecutar `npm run build` para asegurar compilación limpia en cada modificación.
- Nota: el script `npm run lint` apunta a `eslint` pero el linter instalado es `oxlint` (pendiente de corregir en Fase 3).
