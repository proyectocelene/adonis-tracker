# REGLAS Y CONTEXTO PERMANENTE DEL PROYECTO (ADONIS TRACKER / COACH V2)

Este archivo es cargado automáticamente por Google Antigravity en cada inicio de sesión.
Para la documentación clínica y técnica completa, consulta [AI_INSTRUCTIONS_PROJECT_CONTEXT.md](file:///c:/Users/Dr.%20Donato/Downloads/ProyectosPersonales/adonis-tracker/AI_INSTRUCTIONS_PROJECT_CONTEXT.md).

## 1. Naturaleza del Proyecto
- **Nombre**: Adonis Tracker (Coach V2).
- **Enfoque**: Aplicación de hipertrofia clínica, seguimiento de sobrecarga progresiva y gestión biomecánica de maquinaria.
- **Stack**: React 18, Vite, Firebase Cloud Firestore, IndexedDB (`idb-keyval`), Recharts, PWA.

## 2. Regla Fundamental: Aislamiento Biomecánico Estricto
- Cada ejercicio físico o estación debe tener su propio código unificado de 3 segmentos: `[GRUPO-MÁQUINA-ESPEC_UBIC]`.
- NUNCA mezclar ejercicios biomecánicamente dispares en una misma gráfica (ej. mancuerna vs. máquina convergente, prensa 45° cuádriceps vs. prensa pies altos glúteo).
- Si un ejercicio nuevo o variante aparece en el historial o rutina, registrarlo de inmediato en:
  1. `src/data/unifiedExerciseLibrary.js`
  2. `REAL_DATABASE_ALIASES` en `src/utils/exerciseMatcher.js`
  3. `LEGACY_CODE_TO_CANONICAL_MAP` en `src/utils/exerciseMatcher.js`

## 3. Manejo de Historial y Base de Datos
- Las exportaciones completas se almacenan como `COACH_V2_Backup_Total_Firebase_YYYY-MM-DD.json`.
- La función `getHistoricalRecordsForExercise` en `src/utils/exerciseMatcher.js` es la única fuente de verdad para poblar gráficas de progresión y 1RM.
- Al mostrar selectores de ejercicios en `HistoryView.jsx`, deben incluirse tanto los ejercicios de la rutina activa como los ejercicios con datos archivados en el historial (`📜 Histórico`).

## 4. Estándar de Ejecución y Pruebas
- Preservar todos los comentarios técnicos y biomecánicos existentes.
- Cada cambio de código debe verificarse ejecutando `npm run build` en la terminal.
