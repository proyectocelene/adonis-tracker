# ⚡️ Adonis Tracker — Coach V2 (Clinical Hypertrophy & Progressive Overload Tracker)

PWA de alto rendimiento diseñada para la periodización de sobrecarga progresiva, control biomecánico de maquinaria e hipertrofia clínica avanzada.

## 🚀 Características Principales
- **Sistema Canónico de 3 Segmentos (`[GRUPO-MÁQUINA-ESPEC]`)**: Aislamiento total de estaciones mecánicas para evitar contaminación cruzada de pesos y datos entre máquinas de palanca, cables y peso libre.
- **Motor Inteligente de Historial**: Unificación transparente de más de 120 variantes de nombres comerciales y de usuario a través de [`src/utils/exerciseMatcher.js`](./src/utils/exerciseMatcher.js).
- **Persistencia de Latencia Cero**: Arquitectura offline-first mediante IndexedDB (`idb-keyval`) con sincronización en tiempo real hacia Google Firebase Firestore.
- **Analítica de Carga y Fatiga**: Estimación de 1RM por fórmula Epley, tonelaje acumulado, control de RPE/RIR y gasto metabólico.

## 🧠 Documentación para Inteligencias Artificiales y Desarrolladores
- [Manual Maestro de Contexto para IA (`AI_INSTRUCTIONS_PROJECT_CONTEXT.md`)](./AI_INSTRUCTIONS_PROJECT_CONTEXT.md)
- [Reglas Permanentes Antigravity (`GEMINI.md`)](./GEMINI.md)
- [Instrucciones de Agentes (`AGENTS.md`)](./AGENTS.md)

## 🛠️ Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Iniciar servidor local de desarrollo
npm run dev

# Compilar para producción (PWA con Service Worker)
npm run build

# Previsualizar compilación de producción
npm run preview
```
