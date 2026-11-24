import React, { useMemo } from 'react';
import { useProgressionChartState } from '../../hooks/charts/useProgressionChartState.js';
import { useProgressionChartData } from '../../hooks/charts/useProgressionChartData.js';
import { getWeightYDomain, getTonnageYDomain } from '../../utils/charts/progressionScales.js';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/charts/chartConstants.js';
import { getPreviousDataForExercise } from '../../utils/exerciseMatcher.js';
import { getActiveMachineConfig } from '../../utils/machineManager.js';
import { computeExercisePeriodStats, buildNextSessionCardData } from '../../utils/charts/progressionStatsHelper.js';

import ChartEmptyState from './progression/ChartEmptyState.jsx';
import ChartHeaderControls from './progression/ChartHeaderControls.jsx';
import TimeframeSelector from './progression/TimeframeSelector.jsx';
import ChartLegendAndBanners from './progression/ChartLegendAndBanners.jsx';
import ProgressionChartGraph from './progression/ProgressionChartGraph.jsx';
import SessionAuditCard from './progression/SessionAuditCard.jsx';
import NextSessionHighlightCard from './progression/NextSessionHighlightCard.jsx';
import PeriodStatsSummary from './progression/PeriodStatsSummary.jsx';

/**
 * Orquestador principal de la gráfica de sobrecarga progresiva, próxima sesión y estadísticas claras.
 */
export default function ExerciseProgressionChart({
  exercise,
  workoutHistory = EMPTY_ARRAY,
  todayWorkoutData = EMPTY_OBJECT,
  compact = false,
  height = 220,
  defaultScope = 'family',
  machineConfig = null,
  isDeloadMode = false
}) {
  const state = useProgressionChartState(defaultScope);

  const previousData = useMemo(() => {
    if (!exercise) return EMPTY_OBJECT;
    return getPreviousDataForExercise(exercise, null, null, workoutHistory);
  }, [exercise, workoutHistory]);

  const resolvedMachineConfig = useMemo(() => {
    return machineConfig || getActiveMachineConfig([], {}, previousData, exercise);
  }, [machineConfig, previousData, exercise]);

  const nextSessionData = useMemo(() => {
    return buildNextSessionCardData({
      exercise,
      workoutHistory,
      machineConfig: resolvedMachineConfig,
      isDeloadMode
    });
  }, [exercise, workoutHistory, resolvedMachineConfig, isDeloadMode]);

  const data = useProgressionChartData({
    exercise,
    workoutHistory,
    todayWorkoutData,
    scopeMode: state.scopeMode,
    machineConfig: resolvedMachineConfig,
    isDeloadMode,
    timeframe: state.timeframe,
    showProjections: state.showProjections
  });

  const periodStats = useMemo(() => {
    return computeExercisePeriodStats(data.chartData);
  }, [data.chartData]);

  const weightYDomain = useMemo(() => getWeightYDomain(state.yAxisScale), [state.yAxisScale]);
  const tonnageYDomain = useMemo(() => getTonnageYDomain(state.yAxisScale), [state.yAxisScale]);

  const activeData = state.pinnedPoint || state.hoveredPoint || data.lastRealPoint;

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '18px',
      border: '1px solid var(--border-subtle)',
      padding: compact ? '10px' : '14px',
      boxShadow: 'var(--shadow-ios-sm)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* 1. Tarjeta protagonista de Próxima Sesión (siempre visible arriba) */}
      <NextSessionHighlightCard nextSession={nextSessionData} />

      {!data.hasHistory || data.chartData.length === 0 ? (
        <ChartEmptyState exerciseName={exercise?.name} />
      ) : (
        <>
          {/* 2. Resumen estadístico claro (Peso Máx/Prom/Mín · Reps Máx/Prom/Mín · 1RM · Tendencia) */}
          <PeriodStatsSummary stats={periodStats} />

          {/* 3. Controles + Selector temporal + Gráfica */}
          <ChartHeaderControls
            metricMode={state.metricMode}
            setMetricMode={state.setMetricMode}
            targetRange={data.targetRange}
            machineKey={data.machineKey}
            scopeMode={state.scopeMode}
            setScopeMode={state.setScopeMode}
            stationStatsCount={data.stationStats?.count || 0}
            weightMode={state.weightMode}
            setWeightMode={state.setWeightMode}
            setShowWeight={state.setShowWeight}
            showReps={state.showReps}
            setShowReps={state.setShowReps}
            repsMode={state.repsMode}
            setRepsMode={state.setRepsMode}
            show1RM={state.show1RM}
            setShow1RM={state.setShow1RM}
            showRPE={state.showRPE}
            setShowRPE={state.setShowRPE}
            showProjections={state.showProjections}
            setShowProjections={state.setShowProjections}
            yAxisScale={state.yAxisScale}
            setYAxisScale={state.setYAxisScale}
          />

          <TimeframeSelector
            timeframe={state.timeframe}
            setTimeframe={state.setTimeframe}
            visibleRealPointsCount={data.visibleRealPointsCount || data.chartData.length}
            totalRealPointsCount={data.totalRealPointsCount || data.chartData.length}
          />

          <ChartLegendAndBanners
            isFamilyView={data.isFamilyView}
            isAutoFamily={data.isAutoFamily}
            machineKey={data.machineKey}
            totalRealPointsCount={data.totalRealPointsCount}
            metricMode={state.metricMode}
            targetRange={data.targetRange}
            weightMode={state.weightMode}
            showReps={state.showReps}
            repsMode={state.repsMode}
            show1RM={state.show1RM}
            showRPE={state.showRPE}
            deloadWindows={data.deloadWindows}
            showProjections={state.showProjections}
          />

          <ProgressionChartGraph
            height={height}
            chartData={data.chartData}
            dynamicXInterval={data.dynamicXInterval}
            metricMode={state.metricMode}
            showWeight={state.showWeight}
            weightMode={state.weightMode}
            showReps={state.showReps}
            repsMode={state.repsMode}
            show1RM={state.show1RM}
            showRPE={state.showRPE}
            showProjections={state.showProjections}
            weightYDomain={weightYDomain}
            tonnageYDomain={tonnageYDomain}
            targetRange={data.targetRange}
            transitionDate={data.transitionDate}
            lastProjectedDate={data.lastProjectedDate}
            deloadWindows={data.deloadWindows}
            isFamilyView={data.isFamilyView}
            isDense={data.isDense}
            setHoveredPoint={state.setHoveredPoint}
            setPinnedPoint={state.setPinnedPoint}
          />

          {/* 4. Tarjeta simplificada de auditoría al tocar/inspeccionar un punto */}
          {activeData && (
            <SessionAuditCard
              activeData={activeData}
              pinnedPoint={state.pinnedPoint}
              setPinnedPoint={state.setPinnedPoint}
              hoveredPoint={state.hoveredPoint}
            />
          )}
        </>
      )}
    </div>
  );
}
