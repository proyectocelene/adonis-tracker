import React, { useMemo } from 'react';
import { useProgressionChartState } from '../../hooks/charts/useProgressionChartState.js';
import { useProgressionChartData } from '../../hooks/charts/useProgressionChartData.js';
import { getWeightYDomain, getTonnageYDomain } from '../../utils/charts/progressionScales.js';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/charts/chartConstants.js';

import ChartEmptyState from './progression/ChartEmptyState.jsx';
import ChartHeaderControls from './progression/ChartHeaderControls.jsx';
import TimeframeSelector from './progression/TimeframeSelector.jsx';
import ChartLegendAndBanners from './progression/ChartLegendAndBanners.jsx';
import ProgressionChartGraph from './progression/ProgressionChartGraph.jsx';
import SessionAuditCard from './progression/SessionAuditCard.jsx';
import ChartFooter from './progression/ChartFooter.jsx';

/**
 * Orquestador principal de la gráfica de sobrecarga progresiva y proyecciones miofibrilares.
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
  const data = useProgressionChartData({
    exercise,
    workoutHistory,
    todayWorkoutData,
    scopeMode: state.scopeMode,
    machineConfig,
    isDeloadMode,
    timeframe: state.timeframe,
    showProjections: state.showProjections
  });

  const weightYDomain = useMemo(() => getWeightYDomain(state.yAxisScale), [state.yAxisScale]);
  const tonnageYDomain = useMemo(() => getTonnageYDomain(state.yAxisScale), [state.yAxisScale]);

  if (!data.hasHistory || data.chartData.length === 0) {
    return <ChartEmptyState exerciseName={exercise?.name} />;
  }

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

      {activeData && (
        <SessionAuditCard
          activeData={activeData}
          pinnedPoint={state.pinnedPoint}
          setPinnedPoint={state.setPinnedPoint}
          hoveredPoint={state.hoveredPoint}
          targetRange={data.targetRange}
        />
      )}

      <ChartFooter
        currentWeight={data.currentWeight}
        peakWeight={data.peakWeight}
        currentAvgWeight={data.currentAvgWeight}
      />
    </div>
  );
}
