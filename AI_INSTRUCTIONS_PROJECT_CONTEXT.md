# 🧬 ADONIS TRACKER / COACH V2 — MANUAL DE CONOCIMIENTO TÉCNICO Y CLÍNICO PARA IA

> **DOCUMENTO MAESTRO DE ARQUITECTURA, DATOS Y PROTOCOLO CLÍNICO**  
> *Este documento es de lectura prioritaria para cualquier modelo de Inteligencia Artificial que abra o mantenga este proyecto.*

---

## 1. PROPÓSITO DEL PROYECTO
**Adonis Tracker** (denominado internamente también como *Coach V2*) es una Progressive Web App (PWA) de nivel clínico deportivo orientada a la hipertrofia muscular avanzada, progresión de sobrecarga basada en evidencia científica, gestión biomecánica de maquinaria y control milimétrico de volumen, fatiga (RPE/RIR) y composición corporal.

El atleta principal entrena bajo una periodización de alta intensidad (6 días de entrenamiento, 1 de descanso) con registros diarios de cargas efectivas, configuraciones mecánicas de cada máquina (asiento, muescas, pines, torres de placas vs. discos libres) y auditorías de progresión estricta.

---

## 2. STACK TECNOLÓGICO Y ARQUITECTURA
- **Frontend**: React 18, Vite 8, Rolldown / Rollup bundler.
- **Gráficas y Visualización**: Recharts (1RM estimado, tonelaje, curvas evolutivas de sobrecarga).
- **Iconografía**: `lucide-react`.
- **Persistencia Dual (Zero-Latency + Nube)**:
  - **Local First**: `IndexedDB` a través de `idb-keyval` (almacena el estado completo de la app para carga instantánea a 0 ms offline).
  - **Nube**: Google Firebase Cloud Firestore (`users/{uid}/history`, `machine_configs`, `machine_profiles`, etc.).
  - **Outbox Pattern**: Sincronización diferida que encola cambios locales y los transmite a Firestore cuando recupera conexión (`useWorkoutHistory.js`, `syncService.js`).
- **PWA**: `vite-plugin-pwa` con Service Worker para funcionamiento 100% offline en el gimnasio.

---

## 3. SISTEMA DE CÓDIGO UNIFICADO DE 3 SEGMENTOS (`[GRUPO-MÁQUINA-ESPEC]`)

### ⚠️ Regla de Oro: Aislamiento Biomecánico Estricto
En este proyecto **NUNCA** se deben mezclar datos de estaciones con curvas de resistencia dispares bajo el mismo historial de carga.
Por ejemplo:
- Un press inclinado con mancuernas (`[PECH-INC_PRESS-MANC_30]`) **no puede** compartir gráfica ni pesos con una máquina convergente de placas o discos (`[PECH-INC_PRESS-NITRO_01]`).
- Una prensa inclinada a 45° para cuádriceps (`[CUAD-LEG_PRESS-DISC_45_PB]`) **no puede** mezclarse con prensa unilateral (`[CUAD-LEG_PRESS-UNI_01]`) ni con prensa para glúteos (`[GLUT-LEG_PRESS-HIGH_FEET_45]`).

### Formato de los Códigos Canónicos
Todos los ejercicios canónicos se componen de 3 segmentos entre corchetes:
`[GRUPO_MUSCULAR - NOMBRE_MÁQUINA - ESPECIFICACIÓN_UBICACIÓN]`

Ejemplos:
- `[PECH-INC_PRESS-NITRO_01]`: Press inclinado en máquina Nitro convergente.
- `[PECH-INC_PRESS-MANC_30]`: Press inclinado con mancuernas en banco a 30°.
- `[ESPA-PULLDOWN-WIDE_01]`: Jalón al pecho con agarre ancho pronado.
- `[ESPA-TBAR_ROW-CHEST_01]`: Remo con barra T con apoyo torácico.
- `[CUAD-HACK_SQUAT-DISC_01]`: Sentadilla en máquina Hack con discos.
- `[CUAD-LEG_PRESS-DISC_45_PB]`: Prensa inclinada 45° (cuádriceps).
- `[GLUT-LEG_PRESS-HIGH_FEET_45]`: Prensa con pies altos y abiertos para glúteo.
- `[ABDU-ABDUCTOR-STACK_01]`: Máquina de abductores en torre de placas.
- `[ADUC-ADUCTOR-STACK_01]`: Máquina de aductores en torre de placas.
- `[BICEP-CABLE_CURL-LOW_STRAIGHT_01]`: Curl de bíceps en polea baja con barra recta.
- `[BICEP-CABLE_CURL-BAYESIAN_01]`: Bayesian cable curl en polea unilateral.
- `[TRIC-PUSHDOWN-CABLE_01]`: Triceps pushdown en polea alta.
- `[TRIC-OVERHEAD_EXT-CABLE_01]`: Tríceps copa en polea sobre la cabeza.
- `[PANT-CALF_RAISE-MAQ_01]`: Elevación de pantorrillas en máquina (Rotary o de pie).
- `[ABDO-CRUNCH-BODY_01]`: Abdominales / Crunches en suelo.
- `[ABDO-LEG_RAISE-BODY_01]`: Elevaciones de piernas (Leg raises).

---

## 4. MOTOR DE MATCHING HISTÓRICO (`src/utils/exerciseMatcher.js`)

El archivo `src/utils/exerciseMatcher.js` es el núcleo inteligente que conecta los ejercicios de las rutinas actuales con las sesiones históricas registradas desde hace meses.

### Componentes Clave:
1. **`CANONICAL_ALIAS_MAP`**: Cache en memoria con resolución de más de 120 variantes de nombres comerciales y de usuario.
2. **`LEGACY_CODE_TO_CANONICAL_MAP`**: Diccionario de retrocompatibilidad que convierte códigos antiguos (como `[PECH-MAQ-01]`, `[CUAD-PRENS-01]`, `[HIPER-PECH-...]`) a sus códigos canónicos de 3 segmentos.
3. **`HISTORICAL_ID_TO_CANONICAL_MAP`**: Mapea identificadores de rutinas (`d1_e1`, `d3_e2`, `d6_e4`, etc.) y de biblioteca antigua (`lib_pecho_1`, etc.) al código canónico exacto.
4. **`REAL_DATABASE_ALIASES`**: Contiene los nombres textuales reales exportados de la base de datos de Firebase.
5. **`getUnifiedCodeForExercise(ex)`**:
   - Inspecciona `ex.unifiedCode`.
   - Busca por nombre normalizado estricto en `CANONICAL_ALIAS_MAP`.
   - Si no lo tiene, busca por su `ex.id` o clave en `HISTORICAL_ID_TO_CANONICAL_MAP`.
   - Busca en `UNIFIED_EXERCISE_LIBRARY` y en `scientificProtocol`.
6. **`getHistoricalRecordsForExercise(currentEx, workoutHistory, options)`**:
   - Recorre el historial ordenado cronológicamente.
   - Extrae solo series efectivas completadas (`completed !== false`, peso > 0, reps > 0).
   - Calcula métricas: 1RM con fórmula Epley `(peso * (1 + reps/30))`, tonelaje, volumen, fatiga RPE.
   - Maneja selección de la mejor entrada si una misma sesión contiene dos registros del mismo ejercicio (p. ej. si el usuario registró una serie temporal y la rutina base).

---

## 5. ESTRUCTURA DE LA BASE DE DATOS Y EXPORTACIONES JSON
Las exportaciones completas se nombran típicamente `COACH_V2_Backup_Total_Firebase_YYYY-MM-DD.json`.
Contienen las siguientes claves principales:
- `workoutHistory`: Array de objetos de sesión con fecha (`date`, `timestamp`, `dateString`), ID (`ses_...`), rutina y ejercicios.
- `scientificProtocol`: Definición oficial de los 7 días del mesociclo con biomecánica, alternativas equivalentes y ratios de carga.
- `unifiedExerciseLibrary`: Catálogo maestro de 90+ ejercicios estructurados.
- `machineConfigs` y `machineProfiles`: Ajustes de maquinaria del usuario (ej. "Planta Alta", altura de sillín, torre de placas, escalón de mancuernas).
- `customExercises`: Ejercicios añadidos manualmente por día.
- `swappedExercises`: Sustituciones activas entre ejercicios equivalentes.
- `skippedExercises`: Ejercicios omitidos con motivo (ej. "Máquina ocupada").
- `bodyWeightHistory` y `bodyComposition`: Registro de peso corporal y composición antropométrica.

### Formato de una Sesión en `workoutHistory`
Un objeto de sesión contiene:
```json
{
  "id": "ses_2026-10-01_d4",
  "date": "2026-10-01",
  "dateString": "jue, 1 oct 2026",
  "dayId": "d4",
  "routineName": "Jueves: Empuje 2 (Pectoral Esternal & Deltoides en Polea)",
  "volume": 24500,
  "completedSets": 28,
  "exercises": {
    "d4_e1": {
      "name": "Press de Pecho en Máquina Convergente (Chest Press)",
      "0": { "weight": "110", "reps": "12", "rpe": "8", "unit": "lbs", "completed": true },
      "1": { "weight": "155", "reps": "8", "rpe": "9", "unit": "lbs", "completed": true }
    }
  }
}
```
*Nota*: Las series dentro de un ejercicio pueden guardarse con claves numéricas (`"0"`, `"1"`, `"2"`) o como un array `sets: [...]`. Ambas estructuras son normalizadas transparentemente por `extractExerciseSets(exData)`.

---

## 6. PAUTAS PARA CUALQUIER IA QUE MODIFIQUE ESTE REPOSITORIO
1. **No romper la unicidad de los códigos**: Siempre que crees o añadas un ejercicio, asigna un código canónico de 3 segmentos `[GRUPO-MÁQUINA-ESPEC_UBIC]` y regístralo tanto en `unifiedExerciseLibrary.js` como en `REAL_DATABASE_ALIASES` de `exerciseMatcher.js`.
2. **Respetar el aislamiento de estaciones**: No uses un mismo código para mancuernas y máquinas asistidas.
3. **Preservar la retrocompatibilidad**: Si el usuario cambia el nombre de un ejercicio en su rutina, añade el nombre anterior a los alias de la biblioteca para que el historial continúe sin fragmentarse.
4. **Verificación de Build**: Antes de concluir cualquier cambio de código, corre `npm run build` para garantizar que la compilación de Vite y Rollup esté al 100% limpia.
