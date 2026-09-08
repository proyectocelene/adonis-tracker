import { useMemo } from 'react';
import { useIndexedDB as useLocalStorage } from './useIndexedDB.js';
import {
  ADONIS_RANKS,
  getRankForLevel,
  getXpForLevel,
  getLevelFromXp,
  calculatePhysiqueProjection,
  normalizeBodyComposition,
  calculateTruePhysiqueProjection
} from '../utils/gamificationCalculations.js';

export {
  ADONIS_RANKS,
  getRankForLevel,
  getXpForLevel,
  getLevelFromXp,
  calculatePhysiqueProjection,
  normalizeBodyComposition,
  calculateTruePhysiqueProjection
};

/**
 * Hook de Gamificación, Puntos XP, Racha, Composición Corporal y Predictor Adonis
 */
export function useGamification(workoutHistory = [], bodyMetrics = []) {
  // 1. Configuración de objetivos fisiológicos
  const [physiqueGoal, setPhysiqueGoal] = useLocalStorage('coachv2_physique_goal', {
    targetWeightKg: 72.0,
    targetFatPct: 12.0,
    muscleGainTargetKg: 2.0,
    goalType: 'recomposition' // 'recomposition' | 'cut' | 'bulk'
  });

  // 2. Datos detallados de báscula de bioimpedancia y medidas corporales
  const [bodyComposition, setBodyComposition] = useLocalStorage('coachv2_body_composition_data', {
    weightKg: 78.55,
    heightCm: 174,
    bodyFatPct: 24.5,
    fatMassKg: 19.3,
    skeletalMusclePct: 38.3,
    skeletalMuscleKg: 30.1,
    fatFreeMassKg: 56.2,
    waterPct: 53.1,
    waterKg: 41.7,
    visceralFat: 11.5,
    boneMassKg: 2.99,
    bmr: 1705,
    proteinPct: 18.5,
    obesityDegreePct: 18.0,
    metabolicAge: 36,
    realAge: 26,
    // Medidas con cinta (nulas si no se han medido)
    waistCm: null,
    shouldersCm: null,
    chestCm: null,
    armsCm: null
  });

  const stats = useMemo(() => {
    let totalXp = 0;
    let completedSessionsCount = 0;
    let totalVolumeAccumulated = 0;
    let overloadCount = 0;
    let feedbackCount = 0;

    // Análisis del historial de entrenamientos
    const sortedHistory = [...(workoutHistory || [])].sort((a, b) => {
      const tA = new Date(a.timestamp || a.date || 0).getTime();
      const tB = new Date(b.timestamp || b.date || 0).getTime();
      return tA - tB;
    });

    const sessionDates = new Set();

    sortedHistory.forEach(ses => {
      if (!ses) return;
      // Los días de descanso o faltas NO son sesiones de entrenamiento
      if (ses.isRestDay || ses.isMissedDay) return;
      const vol = parseFloat(ses.volume) || 0;
      const setsCount = parseInt(ses.completedSets, 10) || 0;
      if (!ses.isCompleted && vol <= 0 && setsCount <= 0 && !ses.exercises) return;

      completedSessionsCount++;
      totalXp += 100;
      totalVolumeAccumulated += vol;

      const dKey = ses.timestamp ? new Date(ses.timestamp).toISOString().split('T')[0] : (ses.dateString ? ses.dateString.split(',')[0] : null);
      if (dKey) sessionDates.add(dKey);

      if (ses.exercises && typeof ses.exercises === 'object') {
        Object.values(ses.exercises).forEach(ex => {
          if (!ex) return;
          if (ex.feedback) feedbackCount++;
          const sets = Object.keys(ex).filter(k => !isNaN(parseInt(k, 10)) && ex[k]?.completed);
          if (sets.length >= 2) overloadCount++;
        });
      }
    });

    totalXp += overloadCount * 25;
    totalXp += feedbackCount * 15;

    const validMetrics = Array.isArray(bodyMetrics) ? bodyMetrics.filter(m => m && (m.weight || m.peso)) : [];
    totalXp += validMetrics.length * 15;

    const today = new Date();
    const currentWeekWorkouts = sortedHistory.filter(ses => {
      if (!ses.timestamp || ses.isRestDay || ses.isMissedDay) return false;
      const vol = parseFloat(ses.volume) || 0;
      const setsCount = parseInt(ses.completedSets, 10) || 0;
      if (!ses.isCompleted && vol <= 0 && setsCount <= 0 && !ses.exercises) return false;
      const d = new Date(ses.timestamp);
      const diffDays = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).length;

    // Racha en días
    let currentStreakDays = 0;
    let checkDate = new Date(today);
    let gracePeriod = 2;
    for (let i = 0; i < 90; i++) {
      const checkKey = checkDate.toISOString().split('T')[0];
      if (sessionDates.has(checkKey)) {
        currentStreakDays++;
        gracePeriod = 2;
      } else {
        gracePeriod--;
        if (gracePeriod < 0) break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const streakMultiplier = currentWeekWorkouts >= 5 ? 1.3 : (currentWeekWorkouts >= 3 ? 1.15 : 1.0);
    totalXp = Math.round(totalXp * streakMultiplier);

    const level = getLevelFromXp(totalXp);
    const xpCurrentLevelStart = getXpForLevel(level);
    const xpNextLevel = getXpForLevel(level + 1);
    const xpInCurrentLevel = totalXp - xpCurrentLevelStart;
    const xpNeededForLevel = xpNextLevel - xpCurrentLevelStart;
    const levelProgressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / (xpNeededForLevel || 1)) * 100)));
    const rank = getRankForLevel(level);

    // Adherencia del Mes
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const workoutsThisMonth = sortedHistory.filter(s => {
      if (!s.timestamp || s.isRestDay || s.isMissedDay) return false;
      const vol = parseFloat(s.volume) || 0;
      const setsCount = parseInt(s.completedSets, 10) || 0;
      if (!s.isCompleted && vol <= 0 && setsCount <= 0 && !s.exercises) return false;
      const d = new Date(s.timestamp);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    const adherencePercent = Math.min(100, Math.round((workoutsThisMonth / 20) * 100));

    // Sincronizar el peso más reciente de la bitácora en la composición si es más actual
    let activeComp = { ...bodyComposition };
    if (validMetrics.length > 0) {
      const lastMetric = [...validMetrics].reverse()[0];
      const rawW = parseFloat(lastMetric.weight || lastMetric.peso);
      if (!isNaN(rawW) && rawW > 0) {
        const unit = (lastMetric.unit || 'kg').toLowerCase();
        const metricKg = unit === 'lbs' ? rawW * 0.453592 : rawW;
        activeComp.weightKg = Math.round(metricKg * 10) / 10;
      }
    }

    // 5. CÁLCULO CIENTÍFICO VERDADERO DEL PREDICTOR
    const trueProjection = calculateTruePhysiqueProjection(
      activeComp,
      physiqueGoal,
      currentWeekWorkouts,
      overloadCount
    );

    return {
      totalXp,
      level,
      rank,
      xpInCurrentLevel,
      xpNeededForLevel,
      levelProgressPercent,
      completedSessionsCount,
      totalVolumeAccumulated,
      overloadCount,
      feedbackCount,
      currentStreakDays,
      currentWeekWorkouts,
      streakMultiplier,
      workoutsThisMonth,
      adherencePercent,
      sessionDates,
      // Predictor Fisiológico Integral
      trueProjection,
      bodyComposition: trueProjection.current,
      physiqueGoal
    };
  }, [workoutHistory, bodyMetrics, physiqueGoal, bodyComposition]);

  return {
    ...stats,
    physiqueGoal,
    setPhysiqueGoal,
    bodyComposition: stats.bodyComposition,
    setBodyComposition
  };
}
