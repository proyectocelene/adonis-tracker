import { calculate1RM, isExerciseUnilateral } from '../hooks/useWorkoutCalculations.js';
import { getPreviousDataForExercise, getUnifiedCodeForExercise } from './exerciseMatcher.js';

export function generateAISessionPrompt({
  currentDay = {},
  todayWorkoutData = {},
  previousExercisesData = {},
  workoutHistory = [],
  currentWeek = 1,
  selectedDateKey = '',
  completedSets = 0,
  warmupSets = 0,
  volume = 0,
  calories = null,
  elapsedMinutes = 0,
  isWarmupDone = false,
  skippedExercises = {},
  machineConfigs = {},
  bodyMetrics = [],
  bodyComposition = {},
  userWeightKg = null
}) {
  const dateStr = selectedDateKey || new Date().toISOString().split('T')[0];
  const dayName = currentDay.name || 'Entrenamiento';
  const focus = currentDay.focus || 'Hipertrofia & Fuerza';
  const totalDuration = elapsedMinutes > 0 ? `${elapsedMinutes} minutos` : 'No cronometrada (est. 45-60 min)';
  const totalKcal = calories?.displayKcal || calories?.totalKcal || 0;

  // Extracción de datos antropométricos y bioimpedancia del atleta
  const latestMetric = Array.isArray(bodyMetrics) && bodyMetrics.length > 0 ? bodyMetrics[bodyMetrics.length - 1] : null;
  const currentWeightKg = userWeightKg || latestMetric?.weightKg || parseFloat(bodyComposition?.weightKg) || 78.55;
  const currentWeightLbs = (currentWeightKg * 2.20462).toFixed(1);
  const bodyFatPct = latestMetric?.bodyFatPct || bodyComposition?.bodyFatPct || null;
  const skeletalMusclePct = latestMetric?.skeletalMusclePct || bodyComposition?.skeletalMusclePct || null;
  const skeletalMuscleKg = bodyComposition?.skeletalMuscleKg || null;
  const fatFreeMassKg = bodyComposition?.fatFreeMassKg || null;
  const fatMassKg = bodyComposition?.fatMassKg || (bodyFatPct && currentWeightKg ? ((bodyFatPct / 100) * currentWeightKg).toFixed(1) : null);
  const waistCm = latestMetric?.waistCm || bodyComposition?.waistCm || null;
  const shouldersCm = latestMetric?.shouldersCm || bodyComposition?.shouldersCm || null;
  const chestCm = latestMetric?.chestCm || bodyComposition?.chestCm || null;
  const armsCm = latestMetric?.armsCm || bodyComposition?.armsCm || null;
  
  let adonisRatio = null;
  if (shouldersCm && waistCm) {
    adonisRatio = (parseFloat(shouldersCm) / parseFloat(waistCm)).toFixed(3);
  }

  let prompt = `Actúa como un entrenador de fuerza de élite, biomecánico aplicado y científico deportivo con PhD en fisiología del ejercicio e hipertrofia (estilo Dr. Brad Schoenfeld / Dr. Mike Israetel / Chris Beardsley).

He completado mi sesión de entrenamiento con el Protocolo Adonis y aquí tienes mi bitácora cuantitativa completa, incluyendo mis métricas corporales actualizadas y la configuración mecánica exacta de cada estación. Necesito que la analices a fondo, evalúes mi sobrecarga progresiva y me des feedback accionable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 COMPOSICIÓN CORPORAL & MEDIDAS DEL ATLETA (LÍNEA BASE ACTUAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Peso Corporal: ${currentWeightKg} kg (${currentWeightLbs} lbs)${latestMetric?.date ? ` [Último pesaje: ${latestMetric.date}]` : ''}
${bodyFatPct ? `• % Grasa Corporal: ${bodyFatPct}%${fatMassKg ? ` (Masa grasa estimada: ${fatMassKg} kg)` : ''}` : ''}
${skeletalMusclePct ? `• % Músculo Esquelético: ${skeletalMusclePct}%${skeletalMuscleKg ? ` (${skeletalMuscleKg} kg masa muscular)` : ''}${fatFreeMassKg ? ` | Masa Magra Total: ${fatFreeMassKg} kg` : ''}` : ''}
${(waistCm || shouldersCm || chestCm || armsCm) ? `• Perímetros Corporales: ${[
  waistCm ? `Cintura: ${waistCm} cm` : '',
  shouldersCm ? `Hombros: ${shouldersCm} cm` : '',
  chestCm ? `Pecho: ${chestCm} cm` : '',
  armsCm ? `Brazos: ${armsCm} cm` : ''
].filter(Boolean).join(' | ')}` : '• Perímetros Corporales: No registrados recientemente'}
${adonisRatio ? `• Proporción Áurea Adonis (Hombro / Cintura): ${adonisRatio} (Meta estética áurea clásica: 1.618 | Delta: ${(1.618 - parseFloat(adonisRatio)).toFixed(3)})` : ''}
${bodyComposition?.bmr ? `• Tasa Metabólica Basal (BMR): ${bodyComposition.bmr} kcal | Grasa Visceral: Nivel ${bodyComposition.visceralFat || '--'} | Agua Corporal: ${bodyComposition.waterPct || '--'}%` : ''}
${bodyComposition?.metabolicAge ? `• Edad Metabólica: ${bodyComposition.metabolicAge} años (Edad cronológica: ${bodyComposition.realAge || 26} años)` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESUMEN GENERAL DE LA SESIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Fecha: ${dateStr}
• Semana del Mesociclo: Semana ${currentWeek}
• Rutina / Día: ${dayName}
• Enfoque Biomecánico: ${focus}
• Duración Real: ${totalDuration}
• Series Efectivas de Hipertrofia: ${completedSets} series de trabajo directo
• Series de Calentamiento / Aproximación (S0): ${warmupSets} series preparatorias
• Total de Series Completadas: ${completedSets + warmupSets} series
• Volumen Total Levantado (Carga acumulada): ${volume.toLocaleString()} lbs-reps
• Gasto Calórico Fisiológico: ${totalKcal} kcal (Fuerza/Trabajo Mecánico: ${calories?.strengthKcal || 0} kcal, EPOC: ${calories?.epocKcal || 0} kcal${calories?.cardioKcal ? `, Cardio: ${calories.cardioKcal} kcal` : ''}${calories?.isHeartRateCalibrated ? ` [Calibrado por Smartwatch FC: Promedio ${calories.watchHrAvg} BPM, Máx ${calories.watchHrMax || '--'} BPM, Karvonen %HRR: ${calories.hrrPct || '--'}%]` : (calories?.isBlended ? ' [Ajustado con Smartwatch]' : '')})
• Calentamiento & Movilidad Articular: ${isWarmupDone ? '✅ Completado (5-10 min previos)' : '⚠️ No registrado / Omitido'}

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
    const uCode = getUnifiedCodeForExercise(ex);
    const prevLogs = (workoutHistory && workoutHistory.length > 0) 
      ? getPreviousDataForExercise(ex, currentDay.id, currentWeek, workoutHistory) 
      : (previousExercisesData[ex.id] || {});
    const mConfig = machineConfigs[ex.id] || logs.machineConfig || (() => {
      try {
        return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`coachv2_machine_${ex.id}`) || 'null') : null;
      } catch (e) {
        return null;
      }
    })();

    const isUnilateralEx = isExerciseUnilateral(ex, logs);

    prompt += `\n${idx + 1}. ${ex.name} ${uCode ? `${uCode.canonical} ` : ''}[Grupo: ${ex.muscleGroup || 'General'}]`;
    prompt += `\n   • Meta programada: ${ex.sets || 3} series × ${ex.reps || '10-12'} reps | Descanso: ${ex.rest || '90 s'}`;

    if (mConfig) {
      const parts = [];
      if (mConfig.firstPlate) parts.push(`Placa Inicial: ${mConfig.firstPlate} lbs`);
      if (mConfig.plateStep || mConfig.increment) parts.push(`Saltos: ${mConfig.plateStep || mConfig.increment} lbs`);
      if (mConfig.pulleyRatio) parts.push(`Relación Polea: ${mConfig.pulleyRatio}`);
      if (mConfig.pinHeight) parts.push(`Altura Pin/Polea: ${mConfig.pinHeight}`);
      if (mConfig.seatPosition) parts.push(`Posición Asiento: ${mConfig.seatPosition}`);
      if (mConfig.attachment) parts.push(`Accesorio: ${mConfig.attachment}`);
      if (parts.length > 0) {
        prompt += `\n   • Configuración de Máquina: ${parts.join(' | ')}`;
      }
    }

    if (isSkipped) {
      prompt += `\n   • ⚠️ ESTADO: EJERCICIO OMITIDO`;
      prompt += `\n   • Razón: ${skipReason}\n`;
      return;
    }

    if (ex.isCardio) {
      const cardio = logs;
      prompt += `\n   • 🚴 SESIÓN DE CARDIO:`;
      prompt += `\n     - Modalidad/Máquina: ${cardio.machine || ex.name || 'Cardio Z2'}`;
      prompt += `\n     - Duración: ${cardio.duration || cardio.timeMinutes || 0} min`;
      if (cardio.distanceKm || cardio.distance) prompt += ` | Distancia: ${cardio.distanceKm || cardio.distance} km`;
      if (cardio.speedKmh || cardio.speed) prompt += ` | Velocidad: ${cardio.speedKmh || cardio.speed} km/h`;
      if (cardio.inclinePct || cardio.incline) prompt += ` | Inclinación: ${cardio.inclinePct || cardio.incline}°`;
      if (cardio.resistanceLevel || cardio.resistance) prompt += ` | Resistencia: Nivel ${cardio.resistanceLevel || cardio.resistance}`;
      prompt += `\n     - Calorías Cardio: Máquina: ${cardio.machineKcal || cardio.calories || 0} kcal${cardio.watchKcal ? ` | Reloj: ${cardio.watchKcal} kcal` : ''}`;
      if (cardio.watchHrAvg) prompt += ` | FC Reloj: ${cardio.watchHrAvg} BPM prom (Máx: ${cardio.watchHrMax || '--'} BPM)`;
      if (cardio.rpe) prompt += ` | RPE Borg: ${cardio.rpe}/10`;
      prompt += `\n`;
      return;
    }

    const setsArr = [];
    Object.keys(logs).forEach(k => {
      const num = parseInt(k, 10);
      if (!isNaN(num) && logs[k]) {
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
      const hasValidSideReps = isUnilateralEx && ((s.repsL && s.repsL !== 'null') || (s.repsR && s.repsR !== 'null'));
      
      let r = 0;
      if (hasValidSideReps) {
        const rL = parseFloat(s.repsL) || 0;
        const rR = parseFloat(s.repsR) || 0;
        r = (rL > 0 && rR > 0) ? Math.min(rL, rR) : (rL > 0 ? rL : rR);
      } else {
        r = parseFloat(s.reps) || Math.max(parseFloat(s.repsR) || 0, parseFloat(s.repsL) || 0) || 0;
      }

      const epley = calculate1RM(w, r);
      if (s.num > 0) {
        if (w > todayMaxWeight) { todayMaxWeight = w; todayMaxReps = r; }
        if (epley > todayMax1RM) todayMax1RM = epley;
      }

      const rpeStr = s.rpe ? ` | RPE: ${s.rpe}` : '';
      const unilateralStr = hasValidSideReps
        ? ` (Izq: ${s.repsL ?? s.reps} reps, Der: ${s.repsR ?? s.reps} reps)`
        : ` x ${r} reps`;
      const epleyStr = epley > 0 ? ` | 1RM est: ${epley} lbs` : '';
      const checkStr = s.completed ? '✓' : '✗';
      const typeLabel = s.num === 0 ? 'S0 (Aproximación)' : `Serie ${s.num}`;

      prompt += `\n     [${checkStr}] ${typeLabel}: ${w} lbs${unilateralStr}${rpeStr}${epleyStr}`;
    });

    // Comparativa con la sesión previa (solo series de trabajo efectivo num > 0)
    let prevMaxWeight = 0;
    let prevMaxReps = 0;
    let prevMax1RM = 0;
    Object.keys(prevLogs).forEach(k => {
      const setIdx = parseInt(k, 10);
      if (!isNaN(setIdx) && setIdx > 0 && prevLogs[k]?.completed) {
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
1. **Auditoría de Sobrecarga Progresiva & Tensión Mecánica:** ¿Hubo una tensión mecánica efectiva o me estanqué en algún movimiento? ¿Qué ejercicio mostró el mejor estímulo miofibrilar hoy?
2. **Análisis de Esfuerzo, RPE & Fatiga Acumulada:** Con base en los RPEs reportados, ¿estuve en la zona óptima de hipertrofia (RIR 1-3)? ¿Hay signos de fatiga central o sobre-entrenamiento en esta etapa del mesociclo?
3. **Recomendaciones de Carga Exacta para la Próxima Sesión:** Dime con qué peso y rango de repeticiones debo empezar la Serie 1 y subsiguientes la próxima vez que toque este día, teniendo en cuenta las limitaciones reales de placas de las máquinas.
4. **Relación Fisiológica con Mis Medidas Corporales:** Considerando mi peso actual, % de grasa, perímetro de cintura y ratio Adonis actual, ¿el volumen de hoy apoya mi objetivo estético y de recomposición?
5. **Recuperación & Nutrición Post-Entreno Inmediata:** 2 recomendaciones específicas de nutrición (proteína, carbohidratos, hidratación) y descanso calculadas para el gasto energético y grupos musculares trabajados.
`;

  return prompt;
}
