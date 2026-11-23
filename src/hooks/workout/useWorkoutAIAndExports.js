import { useState } from 'react';
import { calculate1RM, isExerciseUnilateral, getMachineStorageKey } from '../useWorkoutCalculations';
import { shareOrExportWorkout, downloadWorkoutJSON } from '../../services/workoutExportService';
import { generateAISessionPrompt } from '../../utils/aiPromptGenerator';
import { getPreviousDataForExercise } from '../../utils/exerciseMatcher';

export function useWorkoutAIAndExports({
  currentDay,
  baseDay,
  todayWorkoutData,
  previousExercisesData,
  workoutHistory,
  currentWeek,
  selectedDateKey,
  completedSets,
  warmupSets,
  volume,
  cardioCompleted,
  userWeightKg,
  bodyMetrics,
  bodyComposition,
  globalMachineConfigs,
  globalMachineProfiles,
  skippedExercisesMap,
  isWarmupDone,
  isDeloadMode,
  deloadCycleConfig,
  fatigueStatus,
  sessionStartTime,
  liveElapsedMinutes,
  todayCalories,
  modal
}) {
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const buildCurrentSessionExportData = () => {
    const exercisesDetailed = [];
    const exercisesSummary = [];
    let cardioDetailed = null;

    (currentDay.exercises || []).forEach(ex => {
      const logs = todayWorkoutData[ex.id] || {};
      if (ex.isCardio) {
        if (logs.completed) {
          cardioDetailed = {
            name: ex.name,
            machine: logs.machine || ex.name,
            duration: logs.duration || logs.timeMinutes || 0,
            distanceKm: logs.distanceKm || logs.distance || 0,
            speedKmh: logs.speedKmh || logs.speed || 0,
            inclinePct: logs.inclinePct || logs.incline || 0,
            resistanceLevel: logs.resistanceLevel || logs.resistance || null,
            machineKcal: logs.machineKcal || logs.calories || 0,
            watchKcal: logs.watchKcal || null,
            watchHrAvg: logs.watchHrAvg || null,
            watchHrMax: logs.watchHrMax || null,
            rpe: logs.rpe || null
          };
        }
        return;
      }

      const sets = [];
      const isUni = isExerciseUnilateral(ex, logs);
      Object.keys(logs).forEach(k => {
        const num = parseInt(k, 10);
        if (!isNaN(num) && logs[k]?.completed) {
          const s = logs[k];
          const w = parseFloat(s.weight) || 0;
          const r = parseFloat(s.reps) || Math.max(parseFloat(s.repsR) || 0, parseFloat(s.repsL) || 0) || 0;
          sets.push({
            setNum: num,
            weight: w,
            reps: r,
            repsL: isUni && s.repsL !== undefined && s.repsL !== '' && s.repsL !== null && s.repsL !== 'null' ? s.repsL : null,
            repsR: isUni && s.repsR !== undefined && s.repsR !== '' && s.repsR !== null && s.repsR !== 'null' ? s.repsR : null,
            isUnilateral: isUni,
            rpe: s.rpe || null,
            unit: s.unit || ex.defaultUnit || 'lbs',
            isWarmup: num === 0,
            completed: true,
            estimated1RM: calculate1RM(w, r)
          });
        }
      });

      if (sets.length > 0) {
        sets.sort((a, b) => a.setNum - b.setNum);
        const slug = getMachineStorageKey(ex);
        const mConfig = logs.machineConfig ||
          globalMachineConfigs?.[ex.id] ||
          globalMachineConfigs?.[slug] ||
          (() => {
            const profs = globalMachineProfiles?.[slug] || globalMachineProfiles?.[ex.id];
            if (Array.isArray(profs) && profs.length > 0) {
              return profs.find(p => p.isDefault) || profs[0];
            }
            try {
              return JSON.parse(localStorage.getItem(slug) || localStorage.getItem(`adonis_machine_${ex.id}`) || localStorage.getItem(`coachv2_machine_${ex.id}`) || 'null');
            } catch {
              return null;
            }
          })();

        exercisesDetailed.push({
          id: ex.id,
          name: ex.name,
          muscleGroup: ex.muscleGroup || 'General',
          machineConfig: mConfig,
          sets
        });

        const bestSet = sets.reduce((max, s) => (s.weight > max.weight ? s : max), sets[0]);
        exercisesSummary.push(`${ex.name}: ${sets.length} series (Máx ${bestSet.weight} lbs × ${bestSet.reps})`);
      }
    });

    return {
      dayName: currentDay.name,
      focus: currentDay.focus,
      date: selectedDateKey,
      week: currentWeek,
      completedSets,
      warmupSets,
      volume,
      cardioCompleted,
      userWeightKg,
      startTime: sessionStartTime || new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: liveElapsedMinutes,
      timestamp: new Date(`${selectedDateKey}T12:00:00`).toISOString(),
      exercisesDetailed,
      exercisesSummary: exercisesSummary.join(' | '),
      cardioDetailed,
      rawWorkoutData: todayWorkoutData
    };
  };

  const handleExportTCX = async () => {
    const currentSessionLog = buildCurrentSessionExportData();
    const res = await shareOrExportWorkout(currentSessionLog, todayCalories);
    if (res.success && res.method === 'download') {
      modal.showAlert({
        title: "📥 Archivo TCX Generado",
        message: `Se descargó el archivo "entrenamiento_adonis_${selectedDateKey}.tcx".\n\n⏱️ Duración registrada: ${liveElapsedMinutes > 0 ? `${liveElapsedMinutes} min` : 'Estimada'}\n🔥 Gasto: ${todayCalories?.totalKcal || 0} kcal\n⚖️ Peso atleta: ${userWeightKg} kg\nCompatible con Google Fit, Health Connect, Garmin y Strava.`,
        variant: "success"
      });
    }
  };

  const handleExportJSON = () => {
    const currentSessionLog = buildCurrentSessionExportData();
    const success = downloadWorkoutJSON(currentSessionLog, todayCalories, bodyMetrics, bodyComposition);
    if (success) {
      modal.showAlert({
        title: "💾 Bitácora Completa Exportada",
        message: `Se ha descargado el archivo JSON con todos los datos cuantitativos:\n• Series, repeticiones, RPEs y 1RMs\n• Medidas corporales (% Grasa, Músculo, Cintura, Hombros)\n• Gasto energético y datos de smartwatch\n• Configuración exacta de máquinas y poleas`,
        variant: "success"
      });
    }
  };

  const handleOptimizeWithMath = () => {
    setIsAnalyzingAI(true);

    setTimeout(() => {
      let analysisText = `Análisis Biomecánico - ${currentDay.name}\n\n`;
      let improvements = 0;
      let totalExercises = 0;

      (currentDay.exercises || []).forEach(ex => {
        const todayLogs = todayWorkoutData[ex.id] || {};
        const prevLogs = getPreviousDataForExercise(ex, currentDay.id, currentWeek, workoutHistory) || {};

        let todayMaxWeight = 0;
        let todayMaxReps = 0;
        let todayEpley = 0;

        Object.keys(todayLogs).forEach(set => {
          if (!isNaN(parseInt(set, 10)) && todayLogs[set].completed) {
            const w = parseFloat(todayLogs[set].weight) || 0;
            const r = parseInt(todayLogs[set].reps, 10) || 0;
            const epley = calculate1RM(w, r);
            if (w > todayMaxWeight) { todayMaxWeight = w; todayMaxReps = r; }
            if (epley > todayEpley) todayEpley = epley;
          }
        });

        if (todayMaxWeight > 0) {
          totalExercises++;
          let prevMaxWeight = 0;
          let prevMaxReps = 0;
          let prevEpley = 0;

          Object.keys(prevLogs).forEach(set => {
            if (!isNaN(parseInt(set, 10)) && prevLogs[set].completed) {
              const w = parseFloat(prevLogs[set].weight) || 0;
              const r = parseFloat(prevLogs[set].reps) || 0;
              const epley = calculate1RM(w, r);
              if (w > prevMaxWeight) { prevMaxWeight = w; prevMaxReps = r; }
              if (epley > prevEpley) prevEpley = epley;
            }
          });

          if (prevMaxWeight > 0) {
            if (todayEpley > prevEpley) {
              improvements++;
              if (todayMaxWeight > prevMaxWeight) {
                analysisText += `✅ ${ex.name}: +${todayMaxWeight - prevMaxWeight} lbs. ¡Sobrecarga por tensión mecánica lograda!\n`;
              } else if (todayMaxReps > prevMaxReps) {
                analysisText += `✅ ${ex.name}: +${todayMaxReps - prevMaxReps} reps. ¡Progresión en volumen y resistencia muscular!\n`;
              }
            } else if (todayEpley === prevEpley) {
              analysisText += `⚖️ ${ex.name}: Carga mantenida. Intenta empujar al fallo la próxima sesión o aplicar parciales elongadas.\n`;
            } else {
              analysisText += `⚠️ ${ex.name}: Ligero descenso de fuerza. Asegúrate de descansar bien el SNC y comer carbohidratos previos.\n`;
            }
          } else {
            analysisText += `📌 ${ex.name}: Línea base establecida (${todayMaxWeight} lbs). Progreso rastreable a partir de la próxima semana.\n`;
          }
        }
      });

      if (totalExercises === 0) {
        analysisText = "No hay series completadas hoy para realizar análisis matemático.";
      } else if (isDeloadMode) {
        analysisText += `\n🧘 EVALUACIÓN CLÍNICA DE DESCARGA (DELOAD):\n`;
        analysisText += `• Volumen controlado: Has completado tus series con rango submáximo de recuperación.\n`;
        analysisText += `• El objetivo clínico no es batir récords hoy, sino disipar la fatiga de tendones y del SNC.\n`;
        analysisText += `• Mantén este estímulo controlado hasta el final de tu microciclo de 7 días para detonar la supercompensación de fuerza en el siguiente bloque.`;
      } else {
        analysisText += `\n🎯 Resumen: Lograste sobrecarga progresiva real en ${improvements} de ${totalExercises} ejercicios evaluados.`;
        if (fatigueStatus?.shouldHighlightDeload) {
          analysisText += `\n\n💡 DIAGNÓSTICO DEL COACH INTELIGENTE:`;
          analysisText += `\n⚠️ Alerta de fatiga o avance de mesociclo: ${fatigueStatus.reason}`;
          analysisText += `\n👉 Recomendación: Puedes activar el [🧘 Modo Descarga] para resetear la fatiga articular y volver a romper marcas la próxima semana.`;
        }
      }

      setAiAnalysisResult({ resumenSobrecarga: analysisText, isDeloadMode });
      setIsAnalyzingAI(false);
    }, 600);
  };

  const handleCopyRoutineForCoach = () => {
    let summaryText = `💪 PROTOCOLO ADONIS - RUTINA DE HOY\n`;
    summaryText += `🗓️ Semana ${currentWeek} • Día ${currentDay.dayNumber}: ${currentDay.name}\n`;
    summaryText += `🎯 Enfoque: ${currentDay.focus}\n\n`;

    (currentDay.exercises || []).forEach((ex, idx) => {
      summaryText += `${idx + 1}. ${ex.name} [${ex.sets || 3} series x ${ex.reps || '10-12'}]\n`;
      const logs = todayWorkoutData[ex.id];
      if (logs && !ex.isCardio) {
        const loggedInfo = [];
        Object.keys(logs).forEach(setNum => {
          if (!isNaN(parseInt(setNum, 10)) && logs[setNum].weight) {
            loggedInfo.push(`S${setNum}: ${logs[setNum].weight} ${logs[setNum].unit || 'lbs'} x ${logs[setNum].reps || 0}`);
          }
        });
        if (loggedInfo.length > 0) {
          summaryText += `   📊 Registrado: ${loggedInfo.join(" | ")}\n`;
        }
      }
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        modal.showAlert({ title: "📋 Copiado al Portapapeles", message: "Resumen de rutina copiado.", variant: "success" });
      });
    }
  };

  const handleCopyWorkoutCard = () => {
    let card = `🏆 COACH V2 — WORKOUT CARD\n`;
    card += `📅 Fecha: ${selectedDateKey} | Semana ${currentWeek}\n`;
    card += `⚡ Rutina: ${currentDay.name || 'Entrenamiento'}\n`;
    card += `📊 Volumen: ${volume.toLocaleString()} lbs | ${completedSets} Series Efectivas${warmupSets > 0 ? ` (+${warmupSets} calentamiento)` : ''}\n`;
    card += `────────────────────────────\n`;

    let count = 0;
    (currentDay.exercises || []).forEach(ex => {
      const logs = todayWorkoutData[ex.id] || {};
      const setsArr = [];
      Object.keys(logs).forEach(k => {
        const num = parseInt(k, 10);
        if (!isNaN(num) && num > 0 && logs[k] && logs[k].completed) {
          setsArr.push({ num, ...logs[k] });
        }
      });

      if (setsArr.length > 0) {
        count++;
        card += `\n• ${ex.name}:\n`;
        const isUnilateralEx = isExerciseUnilateral(ex, logs);

        setsArr.sort((a, b) => a.num - b.num).forEach(s => {
          let r = 0;
          if (isUnilateralEx) {
            const rL = parseFloat(s.repsL) || 0;
            const rR = parseFloat(s.repsR) || 0;
            r = (rL > 0 && rR > 0) ? Math.min(rL, rR) : (rL > 0 ? rL : rR);
          } else {
            r = parseFloat(s.reps) || Math.max(parseFloat(s.repsR) || 0, parseFloat(s.repsL) || 0) || 0;
          }

          const epley = calculate1RM(s.weight, r);
          const epleyStr = epley > 0 ? ` (1RM est: ${epley} lbs)` : '';
          const rpeStr = s.rpe ? ` @ RPE ${s.rpe}` : '';
          if (isUnilateralEx && ((s.repsL && s.repsL !== 'null') || (s.repsR && s.repsR !== 'null'))) {
            card += `  - S${s.num}: ${s.weight || 0} lbs × I:${s.repsL || s.reps} D:${s.repsR || s.reps}${rpeStr}${epleyStr}\n`;
          } else {
            card += `  - S${s.num}: ${s.weight || 0} lbs × ${r} reps${rpeStr}${epleyStr}\n`;
          }
        });
      }
    });

    if (count === 0) {
      modal.showAlert({
        title: "Sin series completadas",
        message: "Marca al menos una serie completada (✓) para generar tu Workout Card.",
        variant: "warning"
      });
      return;
    }

    card += `\n────────────────────────────\n`;
    card += `🔥 Adonis Tracker • Hipertrofia & Sobrecarga Progresiva`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(card).then(() => {
        modal.showAlert({
          title: "📋 ¡Workout Card Copiada!",
          message: "El resumen compacto de tu entrenamiento se ha copiado al portapapeles listo para compartir.",
          variant: "success"
        });
      }).catch(() => {
        modal.showAlert({ title: "Workout Card", message: card, variant: "info" });
      });
    } else {
      modal.showAlert({ title: "Workout Card", message: card, variant: "info" });
    }
  };

  const handleCopySessionForAI = () => {
    const prompt = generateAISessionPrompt({
      currentDay,
      todayWorkoutData,
      previousExercisesData,
      workoutHistory,
      currentWeek,
      selectedDateKey,
      completedSets,
      warmupSets,
      volume,
      calories: todayCalories,
      elapsedMinutes: liveElapsedMinutes,
      isWarmupDone,
      skippedExercises: skippedExercisesMap?.[baseDay.id] || {},
      machineConfigs: globalMachineConfigs || {},
      bodyMetrics,
      bodyComposition,
      userWeightKg,
      isDeloadMode,
      deloadCycleConfig,
      fatigueStatus
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prompt).then(() => {
        modal.showAlert({
          title: "🤖 ¡Prompt para IA Copiado!",
          message: "Se ha copiado a tu portapapeles un informe integral y estructurado con todos los datos cuantitativos de tu sesión.\n\nPégalo directamente en ChatGPT, Claude o Gemini para una auditoría de sobrecarga y prescripción de cargas.",
          variant: "success"
        });
      }).catch(() => {
        modal.showAlert({ title: "Prompt para IA", message: prompt, variant: "info" });
      });
    } else {
      modal.showAlert({ title: "Prompt para IA", message: prompt, variant: "info" });
    }
  };

  return {
    isAnalyzingAI,
    aiAnalysisResult,
    setAiAnalysisResult,
    handleExportTCX,
    handleExportJSON,
    handleOptimizeWithMath,
    handleCopyRoutineForCoach,
    handleCopyWorkoutCard,
    handleCopySessionForAI
  };
}
