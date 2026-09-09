import { calculate1RM } from '../hooks/useWorkoutCalculations';

export function generateAISessionPrompt({
  currentDay = {},
  todayWorkoutData = {},
  previousExercisesData = {},
  currentWeek = 1,
  selectedDateKey = '',
  completedSets = 0,
  volume = 0,
  calories = null,
  elapsedMinutes = 0,
  isWarmupDone = false,
  skippedExercises = {},
  machineConfigs = {}
}) {
  const dateStr = selectedDateKey || new Date().toISOString().split('T')[0];
  const dayName = currentDay.name || 'Entrenamiento';
  const focus = currentDay.focus || 'Hipertrofia & Fuerza';
  const totalDuration = elapsedMinutes > 0 ? `${elapsedMinutes} minutos` : 'No cronometrada (est. 45-60 min)';
  const totalKcal = calories?.displayKcal || calories?.totalKcal || 0;

  let prompt = `Actúa como un entrenador de fuerza de élite, biomecánico aplicado y científico deportivo con PhD en fisiología del ejercicio e hipertrofia (estilo Dr. Brad Schoenfeld / Dr. Mike Israetel / Chris Beardsley).

He completado mi sesión de entrenamiento con el Protocolo Adonis y aquí tienes mi bitácora cuantitativa completa. Necesito que la analices a fondo, evalúes mi sobrecarga progresiva y me des feedback accionable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESUMEN GENERAL DE LA SESIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Fecha: ${dateStr}
• Semana del Mesociclo: Semana ${currentWeek}
• Rutina / Día: ${dayName}
• Enfoque Biomecánico: ${focus}
• Duración Real: ${totalDuration}
• Volumen Total Levantado: ${volume.toLocaleString()} lbs-reps
• Gasto Calórico Total: ${totalKcal} kcal (Fuerza/Trabajo Mecánico: ${calories?.strengthKcal || 0} kcal, EPOC: ${calories?.epocKcal || 0} kcal${calories?.cardioKcal ? `, Cardio: ${calories.cardioKcal} kcal` : ''}${calories?.isHeartRateCalibrated ? ` [Calibrado por FC: Promedio ${calories.watchHrAvg} BPM, Máx ${calories.watchHrMax || '--'} BPM, Karvonen %HRR: ${calories.hrrPct || '--'}%]` : (calories?.isBlended ? ' [Ajustado con Smartwatch]' : '')})
• Calentamiento & Movilidad: ${isWarmupDone ? '✅ Completado (5-10 min previos)' : '⚠️ No registrado / Omitido'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏋️ REGISTRO DETALLADO EJERCICIO POR EJERCICIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  const exercises = currentDay.exercises || [];

  if (exercises.length === 0) {
    prompt += `(No hay ejercicios registrados en esta sesión)\n`;
  }

  exercises.forEach((ex, idx) => {
    const isSkipped = !!skippedExercises[ex.id];
    const skipReason = skippedExercises[ex.id]?.reason || 'Omitido voluntariamente';
    const logs = todayWorkoutData[ex.id] || {};
    const prevLogs = previousExercisesData[ex.id] || {};
    const mConfig = machineConfigs[ex.id] || logs.machineConfig || (() => {
      try {
        return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`coachv2_machine_${ex.id}`) || 'null') : null;
      } catch (e) {
        return null;
      }
    })();

    prompt += `\n${idx + 1}. ${ex.name} [Grupo: ${ex.muscleGroup || 'General'}]`;
    prompt += `\n   • Objetivo de serie/rep: ${ex.sets || 3} series × ${ex.reps || '10-12'} reps | Descanso: ${ex.rest || '90 s'}`;

    if (mConfig) {
      prompt += `\n   • Configuración de Máquina: ${mConfig.stackPreset === 'two_tens_then_twenty' ? 'Torre (2 primeras placas de 10 lb, luego de 20 en 20 lb)' : `Incrementos de ${mConfig.increment || 10} lbs`}`;
    }

    if (isSkipped) {
      prompt += `\n   • ⚠️ ESTADO: EJERCICIO OMITIDO`;
      prompt += `\n   • Razón: ${skipReason}\n`;
      return;
    }

    if (ex.isCardio) {
      const cardio = logs;
      prompt += `\n   • 🚴 CARDIO: ${cardio.duration || 0} min | Nivel/Intensidad: ${cardio.level || 'Z2'} | Calorías: ${cardio.calories || 0} kcal\n`;
      return;
    }

    const setsArr = [];
    Object.keys(logs).forEach(k => {
      const num = parseInt(k, 10);
      if (!isNaN(num) && num > 0 && logs[k]) {
        setsArr.push({ num, ...logs[k] });
      }
    });

    setsArr.sort((a, b) => a.num - b.num);

    if (setsArr.length === 0) {
      prompt += `\n   • Estado: Sin series marcadas hoy\n`;
      return;
    }

    let todayMaxWeight = 0;
    let todayMaxReps = 0;
    let todayMax1RM = 0;

    prompt += `\n   • Series Realizadas:`;
    setsArr.forEach(s => {
      const w = parseFloat(s.weight) || 0;
      const r = parseInt(s.reps, 10) || 0;
      const epley = calculate1RM(w, r);
      if (w > todayMaxWeight) { todayMaxWeight = w; todayMaxReps = r; }
      if (epley > todayMax1RM) todayMax1RM = epley;

      const rpeStr = s.rpe ? ` | RPE: ${s.rpe}` : '';
      const unilateralStr = (s.repsL !== undefined || s.repsR !== undefined)
        ? ` (Izq: ${s.repsL ?? s.reps} reps, Der: ${s.repsR ?? s.reps} reps)`
        : ` x ${r} reps`;
      const epleyStr = epley > 0 ? ` | 1RM est: ${epley} lbs` : '';
      const checkStr = s.completed ? '✓' : '✗';

      prompt += `\n     [${checkStr}] Serie ${s.num}: ${w} lbs${unilateralStr}${rpeStr}${epleyStr}`;
    });

    // Comparativa previa
    let prevMaxWeight = 0;
    let prevMaxReps = 0;
    let prevMax1RM = 0;
    Object.keys(prevLogs).forEach(k => {
      if (!isNaN(parseInt(k, 10)) && prevLogs[k]?.completed) {
        const pw = parseFloat(prevLogs[k].weight) || 0;
        const pr = parseInt(prevLogs[k].reps, 10) || 0;
        const p1rm = calculate1RM(pw, pr);
        if (pw > prevMaxWeight) { prevMaxWeight = pw; prevMaxReps = pr; }
        if (p1rm > prevMax1RM) prevMax1RM = p1rm;
      }
    });

    if (prevMaxWeight > 0) {
      prompt += `\n   • Comparativa Sesión Anterior:`;
      prompt += `\n     - Marca previa: ${prevMaxWeight} lbs × ${prevMaxReps} reps (1RM est: ${prevMax1RM} lbs)`;
      if (todayMax1RM > prevMax1RM) {
        if (todayMaxWeight > prevMaxWeight) {
          prompt += `\n     - Evolución: 🚀 SOBRECARGA POSITIVA (+${(todayMaxWeight - prevMaxWeight).toFixed(1)} lbs en carga máxima)`;
        } else {
          prompt += `\n     - Evolución: 🚀 SOBRECARGA EN REPETICIONES (+${todayMaxReps - prevMaxReps} reps con misma carga o mejor 1RM)`;
        }
      } else if (todayMax1RM === prevMax1RM) {
        prompt += `\n     - Evolución: ⚖️ Carga y repeticiones consolidadas (Mantenimiento idéntico)`;
      } else {
        prompt += `\n     - Evolución: ⚠️ Descenso relativo de rendimiento (-${(prevMax1RM - todayMax1RM).toFixed(1)} lbs de 1RM estimado)`;
      }
    } else {
      prompt += `\n   • Comparativa: Primera sesión registrada para este ejercicio (Línea base establecida)`;
    }
  });

  prompt += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TUS TAREAS DE ANÁLISIS COMO MI ENTRENADOR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. **Auditoría de Sobrecarga Progresiva:** ¿Hubo una tensión mecánica efectiva o me estanqué en algún movimiento? ¿Qué ejercicio mostró el mejor estímulo miofibrilar hoy?
2. **Análisis de Esfuerzo & RPE:** Con base en los RPEs reportados, ¿estuve en la zona efectiva de hipertrofia (RIR 1-3)? ¿Debo ajustar la intensidad en alguna serie específica?
3. **Recomendaciones de Carga Exacta para la Próxima Sesión:** Dime con qué peso y rango de repeticiones debo empezar la Serie 1 y subsiguientes la próxima vez que toque este día, teniendo en cuenta las limitaciones reales de placas de las máquinas.
4. **Fatiga, Asimetrías y Ejercicios Omitidos:** Si omití algún ejercicio o hubo asimetrías en unilaterales, recomiéndame cómo compensarlo en el resto de la semana.
5. **Recuperación & Nutrición Post-Entreno:** 2 recomendaciones inmediatas de nutrición y descanso específicas para el volumen de los grupos musculares trabajados hoy.
`;

  return prompt;
}
