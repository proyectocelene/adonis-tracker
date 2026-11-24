import { roundToAttainableWeight, getNextAttainableWeight } from '../../hooks/useWorkoutCalculations.js';

/**
 * Calcula la tasa de adaptación miofibrilar y genera proyecciones científicas
 * a +1 ses, +2 ses, +1m, +3m y +6m a partir de los puntos reales.
 *
 * @param {Array<object>} realPoints
 * @param {object|null} machineConfig
 * @param {number} targetMaxReps
 * @returns {{
 *   projectedPoints: Array<object>,
 *   weeklyRate: number,
 *   maxHistorical: number,
 *   maxAvgHistorical: number,
 *   lastRealPoint: object
 * }}
 */
export function calculateScientificProjections(realPoints, machineConfig, targetMaxReps = 12, nextSessionTarget = null) {
  if (!realPoints || realPoints.length === 0) {
    return {
      projectedPoints: [],
      weeklyRate: 1.5,
      maxHistorical: 0,
      maxAvgHistorical: 0,
      lastRealPoint: null
    };
  }

  const maxHistorical = Math.max(...realPoints.map(p => p.weight || 0));
  const maxAvgHistorical = Math.max(...realPoints.map(p => p.avgWeight || 0));
  const lastRealPoint = realPoints[realPoints.length - 1];

  // Calcular tasa segura de adaptación miofibrilar (lbs por semana)
  let weeklyRate = 1.5;
  if (realPoints.length >= 2) {
    const firstW = realPoints[0].est1RM || realPoints[0].weight;
    const lastW = lastRealPoint.est1RM || lastRealPoint.weight;
    const delta = lastW - firstW;
    weeklyRate = Math.max(1.0, Math.min(3.5, delta > 0 ? delta / Math.max(2, realPoints.length) : lastRealPoint.weight * 0.015));
  } else {
    weeklyRate = Math.max(1.0, Math.min(3.0, (lastRealPoint.weight || 100) * 0.015));
  }

  const baselineWeight = Math.max(maxHistorical, lastRealPoint.weight || 0);
  const baselineAvgWeight = Math.max(maxAvgHistorical, lastRealPoint.avgWeight || 0);
  const valid1RMs = realPoints.map(p => p.est1RM).filter(v => Number.isFinite(v) && v > 0);
  const baseline1RM = valid1RMs.length > 0 ? Math.max(...valid1RMs) : baselineWeight;
  const baselineTonnage = Math.max(...realPoints.map(p => p.tonnage || 0));

  // Conectar el último punto real con la curva proyectada para que sea continua
  lastRealPoint.projectedWeight = lastRealPoint.weight;
  lastRealPoint.projectedAvgWeight = lastRealPoint.avgWeight;
  lastRealPoint.projectedReps = lastRealPoint.reps;
  lastRealPoint.projected1RM = lastRealPoint.est1RM;
  lastRealPoint.projectedTonnage = lastRealPoint.tonnage;

  // 🔮 Generar proyecciones científicas: Siguiente sesión, 2 sesiones, 1 mes, 3 meses y 6 meses
  const factor1Ses = Math.max(1, Math.round(weeklyRate * 0.65));
  const factor2Ses = Math.max(factor1Ses + 1, Math.round(weeklyRate * 1.3));
  const factor1M = Math.max(factor2Ses + 1, Math.round(Math.log1p(4 * 0.35) * weeklyRate * 2.2));
  const factor3M = Math.max(factor1M + 2, Math.round(Math.log1p(12 * 0.35) * weeklyRate * 2.2));
  const factor6M = Math.max(factor3M + 3, Math.round(Math.log1p(24 * 0.35) * weeklyRate * 2.2));

  const projections = [
    {
      label: '+1 ses',
      dateFull: 'Siguiente Sesión (+1 ses)',
      factor: factor1Ses,
      note: 'Sobrecarga inmediata / microcarga'
    },
    {
      label: '+2 ses',
      dateFull: 'Siguientes 2 Sesiones (+2 ses)',
      factor: factor2Ses,
      note: 'Consolidación de repeticiones'
    },
    {
      label: '+1m',
      dateFull: 'Proyección a 1 Mes (4 sem)',
      factor: factor1M,
      note: 'Adaptación neural & reclutamiento'
    },
    {
      label: '+3m',
      dateFull: 'Proyección a 3 Meses (12 sem)',
      factor: factor3M,
      note: 'Fin de bloque de sobrecarga'
    },
    {
      label: '+6m',
      dateFull: 'Proyección a 6 Meses (24 sem)',
      factor: factor6M,
      note: 'Techo biomecánico del meso-ciclo'
    }
  ];

  const projectedPoints = projections.map(proj => {
    const factor = proj.factor;
    let projectedW;
    let projectedReps = lastRealPoint.reps;
    let projectionNote = proj.note;

    if (proj.label === '+1 ses') {
      const firstSetTarget = nextSessionTarget?.perSetTargets?.[0];
      if (nextSessionTarget?.hasData && firstSetTarget?.weight > 0) {
        projectedW = firstSetTarget.weight;
        projectedReps = firstSetTarget.reps || lastRealPoint.reps;
        projectionNote = nextSessionTarget.headline || proj.note;
      } else {
        const hasDominatedReps = (lastRealPoint.reps >= targetMaxReps);
        projectedW = hasDominatedReps
          ? getNextAttainableWeight(baselineWeight, machineConfig, 'up')
          : baselineWeight;
      }
    } else {
      projectedW = roundToAttainableWeight(baselineWeight + factor, machineConfig);
      if (projectedW < baselineWeight) projectedW = baselineWeight;
    }

    const projectedAvgW = roundToAttainableWeight(baselineAvgWeight + factor * 0.95, machineConfig);
    const projectedRM = Math.round(baseline1RM + (factor * 1.15));
    const projectedTon = Math.round(baselineTonnage * (1 + (factor / (baselineWeight || 1)) * 0.8));

    return {
      date: proj.label,
      dateFull: proj.dateFull,
      weight: null,
      avgWeight: null,
      minWeight: null,
      tonnage: null,
      reps: null,
      avgReps: null,
      minReps: null,
      maxReps: null,
      setsCount: null,
      est1RM: null,
      volume: null,
      isProjected: true,
      projectedWeight: projectedW,
      projectedAvgWeight: projectedAvgW,
      projectedReps,
      projected1RM: projectedRM,
      projectedTonnage: projectedTon,
      projectionNote
    };
  });

  return {
    projectedPoints,
    weeklyRate,
    maxHistorical,
    maxAvgHistorical,
    lastRealPoint
  };
}
