import { useState } from 'react';

/**
 * Hook que gestiona los filtros visuales, modos métricos y persistencia local de la gráfica de progresión.
 * @param {'family' | 'station'} defaultScope
 */
export function useProgressionChartState(defaultScope = 'family') {
  // Modo de Alcance: 'family' (Toda la familia biomecánica) o 'station' (Solo esta máquina exacta)
  const [scopeMode, setScopeMode] = useState(defaultScope);

  // Modo de Alcance Temporal Eje X: 'all', '6m', '3m', '1m', '10ses', '5ses'
  const [timeframe, setTimeframe] = useState(() => {
    try {
      return localStorage.getItem('coachv2_chart_timeframe') || '10ses';
    } catch {
      return '10ses';
    }
  });

  const handleSetTimeframe = (tf) => {
    setTimeframe(tf);
    try {
      localStorage.setItem('coachv2_chart_timeframe', tf);
    } catch {}
  };

  // Modo de Carga: 'band', 'peak', 'avg', 'both'
  const [weightMode, setWeightMode] = useState('band');
  const [showWeight, setShowWeight] = useState(true);
  const [showReps, setShowReps] = useState(true);
  const [show1RM, setShow1RM] = useState(false);
  const [showRPE, setShowRPE] = useState(false);
  const [showProjections, setShowProjections] = useState(true);

  // Modalidad de repeticiones: 'both', 'topSet', 'avg'
  const [repsMode, setRepsMode] = useState('both');

  // Modo métrica: 'weights' (Cargas y Reps) o 'tonnage' (Tonelaje)
  const [metricMode, setMetricMode] = useState('weights');

  // Modo de escala del Eje Y: 'dynamic' (Rango) o 'zero' (Desde 0)
  const [yAxisScale, setYAxisScale] = useState(() => {
    try {
      return localStorage.getItem('coachv2_chart_yaxis_scale') || 'dynamic';
    } catch {
      return 'dynamic';
    }
  });

  const handleSetYAxisScale = (scale) => {
    setYAxisScale(scale);
    try {
      localStorage.setItem('coachv2_chart_yaxis_scale', scale);
    } catch {}
  };

  // Estado para la Caja de Inspección Inferior
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [pinnedPoint, setPinnedPoint] = useState(null);

  return {
    scopeMode,
    setScopeMode,
    timeframe,
    setTimeframe: handleSetTimeframe,
    weightMode,
    setWeightMode,
    showWeight,
    setShowWeight,
    showReps,
    setShowReps,
    show1RM,
    setShow1RM,
    showRPE,
    setShowRPE,
    showProjections,
    setShowProjections,
    repsMode,
    setRepsMode,
    metricMode,
    setMetricMode,
    yAxisScale,
    setYAxisScale: handleSetYAxisScale,
    hoveredPoint,
    setHoveredPoint,
    pinnedPoint,
    setPinnedPoint
  };
}
