import { useMemo } from 'react';
import { getHistoricalRecordsForExercise, parseUnifiedCode } from '../../utils/exerciseMatcher.js';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/charts/chartConstants.js';
import {
  parseTargetRepsRange,
  processHistoricalOccurrences,
  extractTodayWorkoutPoint,
  filterPointsByTimeframe,
  calculateDeloadWindows,
  getDynamicXInterval
} from '../../utils/charts/progressionDataHelper.js';
import { calculateScientificProjections } from '../../utils/charts/progressionProjections.js';

/**
 * Hook que procesa el pipeline de datos históricos, series en curso de hoy y proyecciones matemáticas.
 */
export function useProgressionChartData({
  exercise,
  workoutHistory = EMPTY_ARRAY,
  todayWorkoutData = EMPTY_OBJECT,
  scopeMode = 'family',
  machineConfig = null,
  isDeloadMode = false,
  timeframe = '10ses',
  showProjections = true
}) {
  // Rango de repeticiones dinámico e individual para este ejercicio específico
  const targetRange = useMemo(() => {
    return parseTargetRepsRange(exercise?.reps || exercise?.targetReps);
  }, [exercise?.reps, exercise?.targetReps]);

  // Información del código unificado y familia biomecánica inteligente
  const parsedCode = useMemo(() => parseUnifiedCode(exercise?.unifiedCode), [exercise?.unifiedCode]);
  const machineKey = parsedCode?.machineKey || '';

  // Determinar si la estación exacta tiene datos o si se está usando fallback de familia
  const stationStats = useMemo(() => {
    if (!exercise || !workoutHistory || workoutHistory.length === 0) return { count: 0 };
    const res = getHistoricalRecordsForExercise(exercise, workoutHistory, { autoFallback: false });
    return { count: res.sessionOccurrences.length };
  }, [exercise, workoutHistory]);

  const isAutoFamily = stationStats.count === 0 && scopeMode === 'station';

  // Procesar puntos reales + proyecciones matemáticas
  const dataBundle = useMemo(() => {
    if (!exercise) {
      return {
        chartData: [],
        transitionDate: null,
        lastProjectedDate: null,
        hasHistory: false,
        totalRealPointsCount: 0,
        visibleRealPointsCount: 0,
        peakWeight: 0,
        currentWeight: 0,
        currentAvgWeight: 0,
        lastRealPoint: null,
        isFamilyView: false,
        deloadWindows: [],
        isDense: false
      };
    }

    // 1. Extraer historial real usando el motor de matching tolerante a alias y familias
    const records = getHistoricalRecordsForExercise(exercise, workoutHistory, {
      matchFamily: scopeMode === 'family',
      autoFallback: true
    });
    const rawOccurrences = records.sessionOccurrences || [];
    const isFamilyView = scopeMode === 'family' || Boolean(records.isFamilyFallback);

    const dateCounts = {};
    const realPoints = processHistoricalOccurrences(rawOccurrences, dateCounts);

    // 2. Extraer datos de la sesión de hoy si tiene series marcadas
    const todayPoint = extractTodayWorkoutPoint(
      todayWorkoutData,
      exercise,
      rawOccurrences,
      dateCounts,
      isDeloadMode,
      realPoints.length
    );

    if (todayPoint) {
      realPoints.push(todayPoint);
    }

    if (realPoints.length === 0) {
      return {
        chartData: [],
        transitionDate: null,
        lastProjectedDate: null,
        hasHistory: false,
        totalRealPointsCount: 0,
        visibleRealPointsCount: 0,
        peakWeight: 0,
        currentWeight: 0,
        currentAvgWeight: 0,
        lastRealPoint: null,
        isFamilyView: false,
        deloadWindows: [],
        isDense: false
      };
    }

    // 3. Proyecciones científicas
    const {
      projectedPoints,
      maxHistorical,
      lastRealPoint
    } = calculateScientificProjections(realPoints, machineConfig, targetRange.max);

    const transDate = lastRealPoint.date;

    // 4. Filtrado temporal
    const visibleRealPoints = filterPointsByTimeframe(realPoints, timeframe);
    const combinedData = showProjections ? [...visibleRealPoints, ...projectedPoints] : [...visibleRealPoints];
    const lastProj = showProjections && projectedPoints.length > 0 ? projectedPoints[projectedPoints.length - 1]?.date : null;

    // 5. Ventanas continuas de Deload
    const deloadWindows = calculateDeloadWindows(visibleRealPoints);
    const isDense = combinedData.length > 18;

    return {
      chartData: combinedData,
      transitionDate: transDate,
      lastProjectedDate: lastProj,
      hasHistory: realPoints.length > 0,
      totalRealPointsCount: realPoints.length,
      visibleRealPointsCount: visibleRealPoints.length,
      peakWeight: maxHistorical,
      currentWeight: lastRealPoint.weight,
      currentAvgWeight: lastRealPoint.avgWeight,
      lastRealPoint,
      isFamilyView,
      deloadWindows,
      isDense
    };
  }, [exercise, workoutHistory, todayWorkoutData, scopeMode, machineConfig, targetRange.max, isDeloadMode, timeframe, showProjections]);

  const dynamicXInterval = useMemo(() => {
    return getDynamicXInterval(dataBundle.chartData.length);
  }, [dataBundle.chartData]);

  return {
    ...dataBundle,
    dynamicXInterval,
    targetRange,
    parsedCode,
    machineKey,
    stationStats,
    isAutoFamily
  };
}
