import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea
} from 'recharts';
import { TrendingUp, Sparkles, Filter, Info, Scale, Dumbbell } from 'lucide-react';
import { getHistoricalRecordsForExercise, matchExercise, parseUnifiedCode } from '../../utils/exerciseMatcher.js';
import { calculate1RM, roundToAttainableWeight, getNextAttainableWeight } from '../../hooks/useWorkoutCalculations.js';

// PALETA DE ALTO CONTRASTE CON TONOS TOTALMENTE DIFERENCIADOS (SIN VARIANTES CLARAS/OSCURAS CONFUSAS)
export const PROGRESSION_COLORS = {
  peakWeight: '#1d4ed8',     // Azul Real Intenso (Carga Pico / Top Set)
  avgWeight: '#9333ea',      // Púrpura / Violeta Eléctrico (Promedio Ponderado)
  minWeight: '#64748b',      // Gris Pizarra / Slate (Carga Base / Back-off)
  rangeFillStart: '#2563eb', // Azul medio
  rangeFillEnd: '#9333ea',   // Púrpura medio
  
  repsTop: '#059669',        // Verde Esmeralda Vivo (Reps Top Set)
  repsAvg: '#d97706',        // Ámbar Dorado Oscuro (Reps Promedio) - ¡Diferente al verde!
  repsBand: '#10b981',       // Verde hipertrofia prescrito

  rpe: '#dc2626',            // Rojo Carmesí Fuego (Esfuerzo Percibido RPE / Fatiga)
  est1RM: '#0891b2',         // Cian / Turquesa Profundo (1RM Estimado)
  projection: '#db2777',     // Rosa Fucsia Magenta Neón (Metas Futuras)
  tonnage: '#ea580c',        // Naranja Óxido / Fuego (Tonelaje de Volumen)
  deload: '#10b981',         // Verde Menta Clínico (Semana de Descarga / Deload)
  deloadBorder: '#059669'    // Borde esmeralda para Deload
};

function StationDot(props) {
  const { cx, cy, payload, baseColor = PROGRESSION_COLORS.peakWeight, isFamilyView = false } = props;
  if (!cx || !cy || !payload || payload.isProjected) return null;
  const sType = payload.stationType || 'machine';
  const isDeload = Boolean(payload.isDeloadSession);

  // Si es sesión de Deload, dibujar un indicador visual prominente de recuperación activa
  if (isDeload) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={6.5} fill="#ecfdf5" stroke={PROGRESSION_COLORS.deloadBorder} strokeWidth={2.2} />
        <circle cx={cx} cy={cy} r={3} fill={PROGRESSION_COLORS.deload} />
      </g>
    );
  }

  if (!isFamilyView) {
    return <circle cx={cx} cy={cy} r={3.5} fill={baseColor} stroke="#ffffff" strokeWidth={1.5} />;
  }

  // En vista de familia, distinguir estaciones por forma geométrica
  if (sType === 'dumbbell') {
    return (
      <rect
        x={cx - 3.5}
        y={cy - 3.5}
        width={7}
        height={7}
        fill={baseColor}
        stroke="#ffffff"
        strokeWidth={1.5}
        rx={1}
      />
    );
  }
  if (sType === 'cable') {
    return (
      <polygon
        points={`${cx},${cy - 4.5} ${cx + 4.5},${cy} ${cx},${cy + 4.5} ${cx - 4.5},${cy}`}
        fill={baseColor}
        stroke="#ffffff"
        strokeWidth={1.5}
      />
    );
  }
  if (sType === 'smith') {
    return (
      <polygon
        points={`${cx},${cy - 4.5} ${cx + 4.5},${cy + 3.5} ${cx - 4.5},${cy + 3.5}`}
        fill={baseColor}
        stroke="#ffffff"
        strokeWidth={1.5}
      />
    );
  }

  if (sType === 'plate') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={baseColor} stroke="#ffffff" strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={1.5} fill="#ffffff" />
      </g>
    );
  }

  return <circle cx={cx} cy={cy} r={3.5} fill={baseColor} stroke="#ffffff" strokeWidth={1.5} />;
}

export default function ExerciseProgressionChart({
  exercise,
  workoutHistory = [],
  todayWorkoutData = {},
  compact = false,
  height = 220,
  defaultScope = 'family',
  machineConfig = null,
  isDeloadMode = false
}) {
  // Modo de Alcance: 'family' (Toda la familia biomecánica, predeterminada) o 'station' (Solo esta máquina exacta)
  const [scopeMode, setScopeMode] = useState(defaultScope);
  // Modo de Carga: 'band' (Banda Min-Max con Promedio Ponderado en medio), 'peak' (Carga Máxima), 'avg' (Promedio), 'both' (Líneas)
  const [weightMode, setWeightMode] = useState('band');
  const [showWeight, setShowWeight] = useState(true);
  const [showReps, setShowReps] = useState(true);
  const [show1RM, setShow1RM] = useState(false);
  const [showRPE, setShowRPE] = useState(false);
  const [showProjections, setShowProjections] = useState(true);
  // Modalidad de repeticiones: 'both' (Ambas al mismo tiempo), 'topSet' (Top Set) o 'avg' (Promedio)
  const [repsMode, setRepsMode] = useState('both');
  // Modo métrica: 'weights' (Cargas y Repeticiones) o 'tonnage' (Tonelaje de Volumen en lbs)
  const [metricMode, setMetricMode] = useState('weights');
  // Modo de escala del Eje Y: 'dynamic' (Rango de trabajo enfocado) o 'zero' (Desde 0 / Escala real completa)
  const [yAxisScale, setYAxisScale] = useState(() => {
    try {
      return localStorage.getItem('coachv2_chart_yaxis_scale') || 'dynamic';
    } catch (e) {
      return 'dynamic';
    }
  });

  const handleSetYAxisScale = (scale) => {
    setYAxisScale(scale);
    try {
      localStorage.setItem('coachv2_chart_yaxis_scale', scale);
    } catch (e) {}
  };

  // Dominios dinámicos según la escala vertical seleccionada
  const weightYDomain = useMemo(() => {
    if (yAxisScale === 'zero') {
      return [
        0,
        (dataMax) => {
          const maxVal = isFinite(dataMax) && dataMax > 0 ? dataMax : 100;
          return Math.ceil((maxVal * 1.08) / 5) * 5;
        }
      ];
    }
    return [
      (dataMin) => {
        if (!isFinite(dataMin) || dataMin <= 0) return 0;
        // Dar un 15% de holgura inferior para evitar que pequeñas variaciones se vean hiper-drásticas
        const pad = Math.floor((dataMin * 0.85) / 5) * 5;
        return Math.max(0, pad);
      },
      (dataMax) => {
        if (!isFinite(dataMax) || dataMax <= 0) return 50;
        return Math.ceil((dataMax * 1.08) / 5) * 5;
      }
    ];
  }, [yAxisScale]);

  const tonnageYDomain = useMemo(() => {
    if (yAxisScale === 'zero') {
      return [
        0,
        (dataMax) => {
          const maxVal = isFinite(dataMax) && dataMax > 0 ? dataMax : 1000;
          return Math.ceil((maxVal * 1.1) / 100) * 100;
        }
      ];
    }
    return [
      (dataMin) => {
        if (!isFinite(dataMin) || dataMin <= 0) return 0;
        const pad = Math.floor((dataMin * 0.80) / 100) * 100;
        return Math.max(0, pad);
      },
      (dataMax) => {
        if (!isFinite(dataMax) || dataMax <= 0) return 1000;
        return Math.ceil((dataMax * 1.1) / 100) * 100;
      }
    ];
  }, [yAxisScale]);

  // Estado para la Caja de Inspección Inferior (evita que popups flotantes tapen la gráfica)
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [pinnedPoint, setPinnedPoint] = useState(null);

  // Rango de repeticiones dinámico e individual para este ejercicio específico
  const targetRange = useMemo(() => {
    const raw = (exercise?.reps || exercise?.targetReps || '10-12').toString().trim();
    const clean = raw.replace(/[^\d\-]/g, '');
    const parts = clean.split('-');
    let min = 8;
    let max = 12;
    if (parts.length === 2) {
      min = parseInt(parts[0], 10) || 8;
      max = parseInt(parts[1], 10) || 12;
    } else {
      const s = parseInt(clean, 10);
      if (!isNaN(s) && s > 0) {
        min = s;
        max = s;
      }
    }
    return { min, max, label: raw };
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
  const { chartData, transitionDate, lastProjectedDate, hasHistory, realPointsCount, peakWeight, avgPeakWeight, currentWeight, currentAvgWeight, lastRealPoint, isFamilyView, deloadWindows } = useMemo(() => {
    if (!exercise) return { chartData: [], transitionDate: null, lastProjectedDate: null, hasHistory: false, realPointsCount: 0, peakWeight: 0, avgPeakWeight: 0, currentWeight: 0, currentAvgWeight: 0, lastRealPoint: null, isFamilyView: false, deloadWindows: [] };

    // 1. Extraer historial real usando el motor de matching tolerante a alias y familias
    const records = getHistoricalRecordsForExercise(exercise, workoutHistory, { 
      matchFamily: scopeMode === 'family',
      autoFallback: true 
    });
    const rawOccurrences = records.sessionOccurrences || [];
    const isFamilyView = scopeMode === 'family' || Boolean(records.isFamilyFallback);

    const dateCounts = {};
    const realPoints = rawOccurrences.map((occ, idx) => {
      let baseLabel = occ.dateStr || `S${idx + 1}`;
      if (occ.dateRaw && /^\d{4}-\d{2}-\d{2}$/.test(occ.dateRaw)) {
        const [y, m, d] = occ.dateRaw.split('-');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const mIdx = parseInt(m, 10) - 1;
        if (mIdx >= 0 && mIdx < 12) {
          baseLabel = `${parseInt(d, 10)} ${months[mIdx]}`;
        }
      }

      // Garantizar que la clave de fecha sea única para Recharts (evita colisiones de Tooltip entre sesiones del mismo día o nombre)
      let uniqueKey = baseLabel;
      if (!dateCounts[baseLabel]) {
        dateCounts[baseLabel] = 1;
      } else {
        dateCounts[baseLabel]++;
        uniqueKey = `${baseLabel} (#${dateCounts[baseLabel]})`;
      }

      const peakW = Math.round(occ.maxWeight || 0);
      const minW = Math.round(occ.minWeight !== undefined && occ.minWeight !== null && occ.minWeight !== Infinity ? occ.minWeight : peakW);
      const avgW = Math.round((occ.avgWeight || occ.maxWeight || 0) * 10) / 10;
      const weightedAvgW = occ.weightedAvgWeight ? Math.round(occ.weightedAvgWeight * 10) / 10 : avgW;
      const effectiveTonnage = Math.round(occ.tonnage || occ.totalVolume || (peakW * (occ.bestReps || 0)));
      const weightSpread = Math.max(0, peakW - minW);

      const validRPEs = (occ.workingSets || occ.detailedSets || [])
        .map(s => parseFloat(s.rpe))
        .filter(r => !isNaN(r) && r > 0);
      const avgRPE = validRPEs.length > 0 
        ? Math.round((validRPEs.reduce((a, b) => a + b, 0) / validRPEs.length) * 10) / 10 
        : (occ.rpeStart ? parseFloat(occ.rpeStart) : null);

      const srcName = (occ.sourceName || occ.matchedName || '').toLowerCase();
      let stationType = 'machine';
      let stationIcon = '⚙️';
      let stationLabel = 'Máquina';

      if (srcName.includes('mancuerna') || srcName.includes('dumbbell')) {
        stationType = 'dumbbell';
        stationIcon = '🏋️';
        stationLabel = 'Mancuerna';
      } else if (srcName.includes('polea') || srcName.includes('cable')) {
        stationType = 'cable';
        stationIcon = '⛓️';
        stationLabel = 'Polea';
      } else if (srcName.includes('smith') || srcName.includes('multipower')) {
        stationType = 'smith';
        stationIcon = '🏛️';
        stationLabel = 'Smith';
      } else if (srcName.includes('disco') || srcName.includes('prensa 45') || srcName.includes('hack')) {
        stationType = 'plate';
        stationIcon = '💿';
        stationLabel = 'Discos';
      }

      return {
        date: uniqueKey,
        displayDate: baseLabel,
        sessionIndex: idx + 1,
        dateFull: occ.dateFull || occ.dateStr || `Sesión ${idx + 1}`,
        sourceName: occ.sourceName || occ.matchedName || '',
        stationType,
        stationIcon,
        stationLabel,
        weight: peakW, // Carga Pico (Top Set)
        avgWeight: avgW, // Carga Promedio Efectiva
        weightedAvgWeight: weightedAvgW, // Carga Promedio Ponderada por Reps
        minWeight: minW, // Carga Mínima de Trabajo
        weightRange: [minW, peakW], // Rango Min-Max para Banda Sombreada
        weightSpread,
        rpe: avgRPE,
        rpeStart: occ.rpeStart,
        rpeEnd: occ.rpeEnd,
        deltaRPE: occ.deltaRPE || 0,
        repDropOffPct: occ.repDropOffPct || 0,
        tonnage: effectiveTonnage, // Tonelaje de volumen efectivo
        reps: occ.bestReps || 0, // Repeticiones en la serie pico (Top Set)
        avgReps: occ.avgReps || occ.bestReps || 0, // Promedio de reps en series de trabajo
        minReps: occ.minRepsSession || occ.bestReps || 0, // Mínimo de reps en series de trabajo
        maxReps: occ.maxRepsSession || occ.bestReps || 0, // Máximo de reps en series de trabajo
        setsCount: occ.effectiveSetsCount || occ.setsCount || (occ.detailedSets ? occ.detailedSets.length : 1),
        warmupCount: occ.warmupSetsCount || 0,
        detailedSets: occ.detailedSets || [],
        workingSets: occ.workingSets || occ.detailedSets || [],
        topSet: occ.topSet,
        est1RM: Math.round(occ.est1RM || calculate1RM(peakW, occ.bestReps)),
        volume: effectiveTonnage,
        isDeloadSession: Boolean(occ.isDeloadSession),
        isProjected: false,
        projectedWeight: null,
        projectedAvgWeight: null,
        projectedReps: null,
        projected1RM: null,
        projectedTonnage: null
      };
    });

    // 2. Extraer datos de la sesión de hoy si tiene series marcadas (excluyendo calentamientos para métricas efectivas)
    const exId = exercise.id;
    let todayLogs = todayWorkoutData?.[exId];
    if (!todayLogs && todayWorkoutData) {
      for (const [candKey, candData] of Object.entries(todayWorkoutData)) {
        if (!candData || candData.machine) continue;
        const matchRes = matchExercise(exercise, candKey, candData);
        if (matchRes.isMatch) {
          todayLogs = candData;
          break;
        }
      }
    }
    todayLogs = todayLogs || {};

    const allTodaySets = [];
    Object.keys(todayLogs).forEach(k => {
      const num = parseInt(k, 10);
      if (!isNaN(num) && todayLogs[k]?.completed) {
        const w = parseFloat(todayLogs[k].weight) || 0;
        const r = parseInt(todayLogs[k].reps, 10) || 0;
        const label = (todayLogs[k].label || '').toLowerCase();
        const isWarmup = todayLogs[k].isWarmup === true || num <= 0 || label.startsWith('c') || label.includes('calentamiento') || label.includes('aprox');
        if (w > 0 && r > 0) {
          allTodaySets.push({
            setNum: num,
            weight: w,
            reps: r,
            isWarmup,
            label: todayLogs[k].label || (num <= 0 ? 'C1' : `S${num}`)
          });
        }
      }
    });

    const effectiveTodaySets = allTodaySets.filter(s => !s.isWarmup && s.setNum > 0);
    const workingTodaySets = effectiveTodaySets.length > 0 ? effectiveTodaySets : allTodaySets;

    let todayMaxW = 0;
    let todayMinW = Infinity;
    let todayMaxR = 0;
    let todayMinR = Infinity;
    let todayWSum = 0;
    let todayRSum = 0;
    let todayTonnage = 0;

    workingTodaySets.forEach(s => {
      todayTonnage += (s.weight * s.reps);
      todayWSum += s.weight;
      todayRSum += s.reps;
      if (s.weight > todayMaxW) todayMaxW = s.weight;
      if (s.weight < todayMinW) todayMinW = s.weight;
      if (s.reps > todayMaxR) todayMaxR = s.reps;
      if (s.reps < todayMinR) todayMinR = s.reps;
    });

    const todayIsoDate = new Date().toISOString().split('T')[0];
    const isTodayAlreadyLogged = rawOccurrences.some(occ => {
      const d = occ.dateRaw || '';
      return d.startsWith(todayIsoDate) || occ.sessionId === `session_${todayIsoDate}`;
    });

    if (todayMaxW > 0 && !isTodayAlreadyLogged) {
      const peakSetsToday = workingTodaySets.filter(s => s.weight === todayMaxW);
      const bestRepsAtPeakToday = peakSetsToday.length > 0 ? Math.max(...peakSetsToday.map(s => s.reps)) : 0;
      const avgRepsToday = workingTodaySets.length > 0 ? Math.round((todayRSum / workingTodaySets.length) * 10) / 10 : bestRepsAtPeakToday;
      const avgWeightToday = workingTodaySets.length > 0 ? Math.round((todayWSum / workingTodaySets.length) * 10) / 10 : todayMaxW;

      let todayKey = 'Hoy';
      if (!dateCounts['Hoy']) {
        dateCounts['Hoy'] = 1;
      } else {
        dateCounts['Hoy']++;
        todayKey = `Hoy (#${dateCounts['Hoy']})`;
      }

      const finalTodayPeak = Math.round(todayMaxW);
      const finalTodayMin = Math.round(todayMinW !== Infinity ? todayMinW : todayMaxW);
      const todayWeightedAvgW = todayRSum > 0 ? Math.round((todayTonnage / todayRSum) * 10) / 10 : avgWeightToday;

      // Métricas de Esfuerzo de Hoy
      const todayValidRPEs = workingTodaySets.map(s => parseFloat(s.rpe)).filter(v => !isNaN(v) && v > 0);
      const todayRpeStart = todayValidRPEs.length > 0 ? todayValidRPEs[0] : null;
      const todayRpeEnd = todayValidRPEs.length > 0 ? todayValidRPEs[todayValidRPEs.length - 1] : null;
      const todayDeltaRPE = (todayRpeStart !== null && todayRpeEnd !== null) ? Math.round((todayRpeEnd - todayRpeStart) * 10) / 10 : 0;
      const todayAvgRPE = todayValidRPEs.length > 0 
        ? Math.round((todayValidRPEs.reduce((a, b) => a + b, 0) / todayValidRPEs.length) * 10) / 10 
        : (todayRpeStart !== null ? todayRpeStart : null);

      const exName = (exercise?.name || '').toLowerCase();
      let todayStationType = 'machine';
      let todayStationIcon = '⚙️';
      let todayStationLabel = 'Máquina';
      if (exName.includes('mancuerna') || exName.includes('dumbbell')) {
        todayStationType = 'dumbbell';
        todayStationIcon = '🏋️';
        todayStationLabel = 'Mancuerna';
      } else if (exName.includes('polea') || exName.includes('cable')) {
        todayStationType = 'cable';
        todayStationIcon = '⛓️';
        todayStationLabel = 'Polea';
      } else if (exName.includes('smith') || exName.includes('multipower')) {
        todayStationType = 'smith';
        todayStationIcon = '🏛️';
        todayStationLabel = 'Smith';
      } else if (exName.includes('disco') || exName.includes('prensa 45') || exName.includes('hack')) {
        todayStationType = 'plate';
        todayStationIcon = '💿';
        todayStationLabel = 'Discos';
      }

      let todayDropOff = 0;
      if (workingTodaySets.length >= 2 && workingTodaySets[0].reps > 0) {
        const r1 = workingTodaySets[0].reps;
        const rL = workingTodaySets[workingTodaySets.length - 1].reps;
        if (workingTodaySets[0].weight === workingTodaySets[workingTodaySets.length - 1].weight) {
          todayDropOff = Math.max(0, Math.round(((r1 - rL) / r1) * 100));
        }
      }

      realPoints.push({
        date: todayKey,
        displayDate: 'Hoy',
        sessionIndex: realPoints.length + 1,
        dateFull: 'Sesión de Hoy (En curso)',
        sourceName: exercise?.name || '',
        stationType: todayStationType,
        stationIcon: todayStationIcon,
        stationLabel: todayStationLabel,
        weight: finalTodayPeak,
        avgWeight: avgWeightToday,
        weightedAvgWeight: todayWeightedAvgW,
        minWeight: finalTodayMin,
        weightRange: [finalTodayMin, finalTodayPeak],
        weightSpread: Math.max(0, finalTodayPeak - finalTodayMin),
        rpe: todayAvgRPE,
        rpeStart: todayRpeStart,
        rpeEnd: todayRpeEnd,
        deltaRPE: todayDeltaRPE,
        repDropOffPct: todayDropOff,
        tonnage: Math.round(todayTonnage),
        reps: bestRepsAtPeakToday,
        avgReps: avgRepsToday,
        minReps: todayMinR !== Infinity ? todayMinR : bestRepsAtPeakToday,
        maxReps: todayMaxR,
        setsCount: workingTodaySets.length,
        warmupCount: allTodaySets.length - workingTodaySets.length,
        detailedSets: allTodaySets,
        workingSets: workingTodaySets,
        est1RM: Math.round(calculate1RM(todayMaxW, bestRepsAtPeakToday)),
        volume: Math.round(todayTonnage),
        isDeloadSession: Boolean(isDeloadMode),
        isProjected: false,
        projectedWeight: null,
        projectedAvgWeight: null,
        projectedReps: null,
        projected1RM: null,
        projectedTonnage: null
      });
    }

    if (realPoints.length === 0) {
      return {
        chartData: [],
        transitionDate: null,
        lastProjectedDate: null,
        hasHistory: false,
        peakWeight: 0,
        avgPeakWeight: 0,
        currentWeight: 0,
        currentAvgWeight: 0,
        lastRealPoint: null
      };
    }

    // Identificar carga pico y carga actual
    const maxHistorical = Math.max(...realPoints.map(p => p.weight));
    const maxAvgHistorical = Math.max(...realPoints.map(p => p.avgWeight));
    const lastRealPoint = realPoints[realPoints.length - 1];
    const transDate = lastRealPoint.date;

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

    const baselineWeight = Math.max(maxHistorical, lastRealPoint.weight);
    const baselineAvgWeight = Math.max(maxAvgHistorical, lastRealPoint.avgWeight);
    const baseline1RM = Math.max(...realPoints.map(p => p.est1RM));
    const baselineTonnage = Math.max(...realPoints.map(p => p.tonnage));

    // Conectar el último punto real con la curva proyectada para que sea continua
    lastRealPoint.projectedWeight = lastRealPoint.weight;
    lastRealPoint.projectedAvgWeight = lastRealPoint.avgWeight;
    lastRealPoint.projectedReps = lastRealPoint.reps;
    lastRealPoint.projected1RM = lastRealPoint.est1RM;
    lastRealPoint.projectedTonnage = lastRealPoint.tonnage;

    // 🔮 3. Generar proyecciones científicas: Siguiente sesión, 2 sesiones, 1 mes, 3 meses y 6 meses
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
      if (proj.label === '+1 ses') {
        const hasDominatedReps = (lastRealPoint.reps >= targetRange.max);
        if (hasDominatedReps) {
          projectedW = getNextAttainableWeight(baselineWeight, machineConfig, 'up');
        } else {
          projectedW = baselineWeight;
        }
      } else {
        projectedW = roundToAttainableWeight(baselineWeight + factor, machineConfig);
      }

      if (projectedW < baselineWeight) projectedW = baselineWeight;

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
        projectedReps: lastRealPoint.reps,
        projected1RM: projectedRM,
        projectedTonnage: projectedTon,
        projectionNote: proj.note
      };
    });

    const combinedData = [...realPoints, ...projectedPoints];
    const lastProj = projectedPoints[projectedPoints.length - 1]?.date || null;

    // Calcular intervalos continuos de sesiones marcadas como Deload para sombrear en la gráfica
    const deloadWindows = [];
    let currentWindow = null;
    realPoints.forEach(p => {
      if (p.isDeloadSession) {
        if (!currentWindow) {
          currentWindow = { start: p.date, end: p.date, count: 1 };
        } else {
          currentWindow.end = p.date;
          currentWindow.count++;
        }
      } else {
        if (currentWindow) {
          deloadWindows.push(currentWindow);
          currentWindow = null;
        }
      }
    });
    if (currentWindow) {
      deloadWindows.push(currentWindow);
    }

    return {
      chartData: combinedData,
      transitionDate: transDate,
      lastProjectedDate: lastProj,
      hasHistory: realPoints.length > 0,
      realPointsCount: realPoints.length,
      peakWeight: maxHistorical,
      avgPeakWeight: maxAvgHistorical,
      currentWeight: lastRealPoint.weight,
      currentAvgWeight: lastRealPoint.avgWeight,
      lastRealPoint: lastRealPoint || null,
      isFamilyView,
      deloadWindows
    };
  }, [exercise, workoutHistory, todayWorkoutData, scopeMode, machineConfig, targetRange.max, isDeloadMode]);

  // Sincronizador de punto activo para la Caja de Auditoría inferior (elimina tooltips flotantes que tapen la curva)
  const CustomTooltipReceiver = ({ active, payload }) => {
    useEffect(() => {
      if (active && payload && payload.length > 0) {
        setHoveredPoint(payload[0].payload);
      }
    }, [active, payload]);

    return null;
  };

  if (!hasHistory || chartData.length === 0) {
    return (
      <div style={{
        padding: '24px 14px',
        textAlign: 'center',
        background: '#f8fafc',
        borderRadius: '16px',
        border: '1.5px dashed #cbd5e1',
        color: '#64748b'
      }}>
        <TrendingUp size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto', display: 'block' }} />
        <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '900', color: '#1e293b' }}>
          Sin Historial de Sobrecarga Aún
        </h4>
        <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.4' }}>
          Registra tus series en <strong>{exercise.name}</strong> para desbloquear la gráfica de carga pico, carga promedio, tonelaje y proyección progresiva (próxima sesión, 2 sesiones, 1m, 3m y 6 meses).
        </p>
      </div>
    );
  }

  const activeData = pinnedPoint || hoveredPoint || lastRealPoint;
  const isPinned = !!pinnedPoint;
  const isHovered = !pinnedPoint && !!hoveredPoint;
  const isProj = activeData?.isProjected;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '18px',
      border: '1px solid #e2e8f0',
      padding: compact ? '10px' : '14px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* BARRA DE CONTROLES Y FILTROS RÁPIDOS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '10px',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <TrendingUp size={14} />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', fontWeight: '900', color: '#0f172a', display: 'block', lineHeight: '1.1' }}>
              {metricMode === 'tonnage' ? 'Tonelaje Acumulado' : 'Sobrecarga Progresiva'}
            </span>
            <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '700' }}>
              Meta: {targetRange.label} reps • Calentamientos aislados
            </span>
          </div>
        </div>

        {/* BOTONERA DE FILTROS Y MODOS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {/* Selector de Alcance: Toda la Familia vs Esta Máquina */}
          {machineKey && (
            <div style={{ display: 'inline-flex', background: '#e0e7ff', borderRadius: '8px', padding: '2px', border: '1px solid #c7d2fe' }}>
              <button
                type="button"
                onClick={() => setScopeMode('family')}
                style={{
                  padding: '3px 7px',
                  borderRadius: '6px',
                  border: 'none',
                  background: scopeMode === 'family' ? '#4f46e5' : 'transparent',
                  color: scopeMode === 'family' ? '#ffffff' : '#4338ca',
                  fontWeight: '900',
                  fontSize: '9.5px',
                  cursor: 'pointer',
                  boxShadow: scopeMode === 'family' ? '0 1px 3px rgba(79,70,229,0.3)' : 'none'
                }}
                title={`Ver progreso agrupado de toda la estación biomecánica (${machineKey})`}
              >
                🌐 Toda la Familia ({machineKey})
              </button>
              <button
                type="button"
                onClick={() => setScopeMode('station')}
                style={{
                  padding: '3px 7px',
                  borderRadius: '6px',
                  border: 'none',
                  background: scopeMode === 'station' ? '#4f46e5' : 'transparent',
                  color: scopeMode === 'station' ? '#ffffff' : '#4338ca',
                  fontWeight: '900',
                  fontSize: '9.5px',
                  cursor: 'pointer',
                  boxShadow: scopeMode === 'station' ? '0 1px 3px rgba(79,70,229,0.3)' : 'none'
                }}
                title="Filtrar datos exclusivamente para esta máquina física específica"
              >
                🎯 Esta Máquina {stationStats.count > 0 ? `(${stationStats.count})` : ''}
              </button>
            </div>
          )}

          {/* Toggle Métrica: Cargas vs Tonelaje */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
            <button
              type="button"
              onClick={() => setMetricMode('weights')}
              style={{
                padding: '3px 7px',
                borderRadius: '6px',
                border: 'none',
                background: metricMode === 'weights' ? '#ffffff' : 'transparent',
                color: metricMode === 'weights' ? '#0066ff' : '#64748b',
                fontWeight: '900',
                fontSize: '9.5px',
                cursor: 'pointer',
                boxShadow: metricMode === 'weights' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
              title="Ver curvas de peso (Pico / Promedio) y repeticiones"
            >
              🏋️ Carga & Reps
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('tonnage')}
              style={{
                padding: '3px 7px',
                borderRadius: '6px',
                border: 'none',
                background: metricMode === 'tonnage' ? '#f59e0b' : 'transparent',
                color: metricMode === 'tonnage' ? '#ffffff' : '#64748b',
                fontWeight: '900',
                fontSize: '9.5px',
                cursor: 'pointer',
                boxShadow: metricMode === 'tonnage' ? '0 1px 3px rgba(245,158,11,0.3)' : 'none'
              }}
              title="Ver volumen total de trabajo (peso × reps) de series efectivas"
            >
              📦 Tonelaje
            </button>
          </div>

          {metricMode === 'weights' && (
            <>
              {/* Selector de Modo de Carga: Banda | Pico | Prom | Líneas */}
              <div style={{ display: 'inline-flex', background: '#eff6ff', borderRadius: '8px', padding: '2px', border: '1px solid #bfdbfe' }}>
                {[
                  { id: 'band', label: 'Banda', bg: PROGRESSION_COLORS.peakWeight, title: 'Ver área sombreada entre Carga Mínima y Pico con Promedio Ponderado en medio' },
                  { id: 'peak', label: 'Pico', bg: PROGRESSION_COLORS.peakWeight, title: 'Ver solo la Carga Máxima (Top Set)' },
                  { id: 'avg', label: 'Prom', bg: PROGRESSION_COLORS.avgWeight, title: 'Ver la Carga Promedio Efectiva' },
                  { id: 'both', label: 'Líneas', bg: '#0f172a', title: 'Ver curvas de Pico y Promedio' }
                ].map(wm => (
                  <button
                    key={wm.id}
                    type="button"
                    onClick={() => {
                      setWeightMode(wm.id);
                      setShowWeight(true);
                    }}
                    style={{
                      padding: '3px 6px',
                      borderRadius: '6px',
                      border: 'none',
                      background: weightMode === wm.id ? wm.bg : 'transparent',
                      color: weightMode === wm.id ? '#ffffff' : '#1e40af',
                      fontWeight: '900',
                      fontSize: '9px',
                      cursor: 'pointer'
                    }}
                    title={wm.title}
                  >
                    {wm.label}
                  </button>
                ))}
              </div>

              {/* Toggle Reps */}
              <div style={{ display: 'inline-flex', borderRadius: '8px', overflow: 'hidden', border: showReps ? `1.5px solid ${PROGRESSION_COLORS.repsTop}` : '1px solid #cbd5e1' }}>
                <button
                  type="button"
                  onClick={() => setShowReps(prev => !prev)}
                  style={{
                    padding: '3px 6px',
                    border: 'none',
                    background: showReps ? '#ecfdf5' : '#f8fafc',
                    color: showReps ? PROGRESSION_COLORS.repsTop : '#94a3b8',
                    fontSize: '9.5px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                  title="Activar/Desactivar curva de repeticiones"
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: showReps ? PROGRESSION_COLORS.repsTop : '#94a3b8' }} />
                  Reps
                </button>
                {showReps && (
                  <button
                    type="button"
                    onClick={() => setRepsMode(prev => prev === 'both' ? 'topSet' : prev === 'topSet' ? 'avg' : 'both')}
                    style={{
                      padding: '3px 6px',
                      border: 'none',
                      borderLeft: '1px solid #fed7aa',
                      background: repsMode === 'avg' ? '#fef3c7' : '#ecfdf5',
                      color: repsMode === 'avg' ? PROGRESSION_COLORS.repsAvg : PROGRESSION_COLORS.repsTop,
                      fontSize: '9px',
                      fontWeight: '900',
                      cursor: 'pointer'
                    }}
                    title="Alternar: Ambas curvas simultáneas (Verde=Top, Dorado=Promedio), solo Top Set, o solo Promedio"
                  >
                    {repsMode === 'both' ? 'Ambas' : repsMode === 'topSet' ? 'Top' : 'Prom'}
                  </button>
                )}
              </div>

              {/* Toggle 1RM */}
              <button
                type="button"
                onClick={() => setShow1RM(prev => !prev)}
                style={{
                  padding: '3px 7px',
                  borderRadius: '8px',
                  border: show1RM ? `1.5px solid ${PROGRESSION_COLORS.est1RM}` : '1px solid #cbd5e1',
                  background: show1RM ? '#ecfeff' : '#f8fafc',
                  color: show1RM ? PROGRESSION_COLORS.est1RM : '#94a3b8',
                  fontSize: '9.5px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                title="Curva de 1RM Estimado por fórmula de Epley"
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: show1RM ? PROGRESSION_COLORS.est1RM : '#94a3b8' }} />
                1RM
              </button>

              {/* Toggle RPE */}
              <button
                type="button"
                onClick={() => setShowRPE(prev => !prev)}
                style={{
                  padding: '3px 7px',
                  borderRadius: '8px',
                  border: showRPE ? `1.5px solid ${PROGRESSION_COLORS.rpe}` : '1px solid #cbd5e1',
                  background: showRPE ? '#fef2f2' : '#f8fafc',
                  color: showRPE ? PROGRESSION_COLORS.rpe : '#94a3b8',
                  fontSize: '9.5px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                title="Curva de Esfuerzo Percibido (RPE 6-10 / RIR)"
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: showRPE ? PROGRESSION_COLORS.rpe : '#94a3b8' }} />
                🔥 RPE
              </button>
            </>
          )}

          {/* Toggle Proyecciones */}
          <button
            type="button"
            onClick={() => setShowProjections(prev => !prev)}
            style={{
              padding: '3px 7px',
              borderRadius: '8px',
              border: showProjections ? `1.5px solid ${PROGRESSION_COLORS.projection}` : '1px solid #cbd5e1',
              background: showProjections ? '#fdf2f8' : '#f8fafc',
              color: showProjections ? PROGRESSION_COLORS.projection : '#94a3b8',
              fontSize: '9.5px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="Mostrar u ocultar proyecciones científicas (próxima sesión, 2 sesiones, 1m, 3m y 6 meses)"
          >
            <Sparkles size={11} color={showProjections ? PROGRESSION_COLORS.projection : '#94a3b8'} />
            Metas
          </button>

          {/* Selector de Escala Vertical Eje Y: Rango de trabajo vs Desde 0 */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', border: '1px solid #cbd5e1' }}>
            <button
              type="button"
              onClick={() => handleSetYAxisScale('dynamic')}
              style={{
                padding: '3px 7px',
                borderRadius: '6px',
                border: 'none',
                background: yAxisScale === 'dynamic' ? '#ffffff' : 'transparent',
                color: yAxisScale === 'dynamic' ? '#0f172a' : '#64748b',
                fontWeight: '900',
                fontSize: '9.5px',
                cursor: 'pointer',
                boxShadow: yAxisScale === 'dynamic' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
              title="Escala Rango: Enfoca la gráfica en tus pesos de trabajo reales con holgura fisiológica"
            >
              🎯 Rango
            </button>
            <button
              type="button"
              onClick={() => handleSetYAxisScale('zero')}
              style={{
                padding: '3px 7px',
                borderRadius: '6px',
                border: 'none',
                background: yAxisScale === 'zero' ? '#0f172a' : 'transparent',
                color: yAxisScale === 'zero' ? '#ffffff' : '#64748b',
                fontWeight: '900',
                fontSize: '9.5px',
                cursor: 'pointer',
                boxShadow: yAxisScale === 'zero' ? '0 1px 3px rgba(15,23,42,0.2)' : 'none'
              }}
              title="Escala Completa: Inicia el eje vertical desde 0 para ver la proporción real de los cambios sin dramatismo visual"
            >
              0️⃣ Desde 0
            </button>
          </div>
        </div>
      </div>

      {/* AVISO INTELIGENTE DE MOTOR CANÓNICO / FAMILIA BIOMECÁNICA */}
      {isFamilyView && (
        <div style={{
          background: '#f5f3ff',
          border: '1px solid #ddd6fe',
          borderRadius: '10px',
          padding: '5px 10px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#6d28d9',
          fontWeight: '700'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={12} color="#7c3aed" />
            {isAutoFamily 
              ? `Motor Inteligente: Sin registros en esta estación física. Graficando historial de la familia ${machineKey || 'biomecánica'}`
              : `Modo Familia Activo: Historial consolidado de la estación ${machineKey || ''}`}
          </span>
          <span style={{ fontSize: '9px', background: '#ede9fe', padding: '1px 6px', borderRadius: '5px', color: '#5b21b6', fontWeight: '800' }}>
            {realPointsCount} sesiones
          </span>
        </div>
      )}

      {/* GUÍAS VISUALES: BANDA VERDE HIPERTROFIA Y ZONA PROYECTADA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '8px',
        fontSize: '9.5px',
        color: '#64748b',
        fontWeight: '700'
      }}>
        {metricMode === 'weights' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px dashed #10b981', borderRadius: '3px' }} />
              🟩 Rango Hipertrofia Prescrito: <strong style={{ color: '#047857' }}>{targetRange.label} reps</strong>
            </span>

            {(weightMode === 'band' || weightMode === 'both') && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '8px', background: 'rgba(29, 78, 216, 0.2)', border: `1.5px solid ${PROGRESSION_COLORS.peakWeight}`, borderRadius: '2px' }} />
                <span style={{ color: PROGRESSION_COLORS.peakWeight, fontWeight: '800' }}>Banda Min-Max</span>
                <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.avgWeight, borderRadius: '2px' }} />
                <span style={{ color: PROGRESSION_COLORS.avgWeight, fontWeight: '800' }}>Prom Ponderado</span>
              </span>
            )}
            {weightMode === 'peak' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.peakWeight, fontWeight: '800' }}>
                <span style={{ width: '12px', height: '2.5px', background: PROGRESSION_COLORS.peakWeight, borderRadius: '2px' }} /> Carga Pico
              </span>
            )}
            {weightMode === 'avg' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.avgWeight, fontWeight: '800' }}>
                <span style={{ width: '12px', height: '2.5px', background: PROGRESSION_COLORS.avgWeight, borderRadius: '2px' }} /> Promedio Ponderado
              </span>
            )}

            {showReps && repsMode === 'both' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: PROGRESSION_COLORS.repsTop, fontWeight: '800' }}>
                  <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.repsTop, borderRadius: '2px' }} /> Reps Top
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: PROGRESSION_COLORS.repsAvg, fontWeight: '800' }}>
                  <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.repsAvg, borderRadius: '2px' }} /> Reps Prom
                </span>
              </span>
            )}
            {showReps && repsMode === 'topSet' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: PROGRESSION_COLORS.repsTop, fontWeight: '800' }}>
                <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.repsTop, borderRadius: '2px' }} /> Reps Top
              </span>
            )}
            {showReps && repsMode === 'avg' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: PROGRESSION_COLORS.repsAvg, fontWeight: '800' }}>
                <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.repsAvg, borderRadius: '2px' }} /> Reps Prom
              </span>
            )}

            {show1RM && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.est1RM, fontWeight: '800' }}>
                <span style={{ width: '12px', height: '2px', background: PROGRESSION_COLORS.est1RM, borderTop: `1px dashed ${PROGRESSION_COLORS.est1RM}` }} /> 1RM
              </span>
            )}

            {showRPE && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.rpe, fontWeight: '800' }}>
                <span style={{ width: '12px', height: '2.5px', background: PROGRESSION_COLORS.rpe, borderRadius: '2px' }} /> 🔥 RPE (6-10)
              </span>
            )}

            {isFamilyView && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '9px', background: '#f8fafc', padding: '1px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '800' }}>Estación:</span>
                <span>■ Mancuerna</span>
                <span>◆ Polea</span>
                <span>▲ Smith</span>
                <span>● Máquina</span>
              </span>
            )}

            {deloadWindows && deloadWindows.length > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.deloadBorder, fontWeight: '800', background: '#ecfdf5', padding: '1px 6px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PROGRESSION_COLORS.deload, border: '1.5px solid #059669' }} /> 🧘 Deload (80% / RIR 3-4)
              </span>
            )}
          </div>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.tonnage, fontWeight: '800' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(234, 88, 12, 0.25)', border: `1px solid ${PROGRESSION_COLORS.tonnage}`, borderRadius: '3px' }} />
            Tonelaje de Sesión = suma de (peso × reps) de series efectivas
          </span>
        )}

        {showProjections && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.projection, fontWeight: '800' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(219, 39, 119, 0.15)', border: `1px dashed ${PROGRESSION_COLORS.projection}`, borderRadius: '3px' }} />
            🔮 Proyecciones (+1m a +6m)
          </span>
        )}
      </div>

      {/* GRÁFICA RECHARTS CON ÁREAS SOMBREADAS TRANSLÚCIDAS Y DOBLE EJE Y */}
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: showRPE ? 36 : 8, left: -16, bottom: 0 }}
            onMouseMove={(e) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                setHoveredPoint(e.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={(e) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                const p = e.activePayload[0].payload;
                setPinnedPoint(prev => (prev?.date === p.date ? null : p));
              }
            }}
          >
            {/* GRADIENTES TRANSLÚCIDOS */}
            <defs>
              <linearGradient id="gradientWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROGRESSION_COLORS.peakWeight} stopOpacity={0.35} />
                <stop offset="95%" stopColor={PROGRESSION_COLORS.peakWeight} stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradientWeightRange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROGRESSION_COLORS.rangeFillStart} stopOpacity={0.25} />
                <stop offset="95%" stopColor={PROGRESSION_COLORS.rangeFillEnd} stopOpacity={0.08} />
              </linearGradient>

              <linearGradient id="gradientAvgWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROGRESSION_COLORS.avgWeight} stopOpacity={0.25} />
                <stop offset="95%" stopColor={PROGRESSION_COLORS.avgWeight} stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradientTonnage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROGRESSION_COLORS.tonnage} stopOpacity={0.35} />
                <stop offset="95%" stopColor={PROGRESSION_COLORS.tonnage} stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradientReps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROGRESSION_COLORS.repsTop} stopOpacity={0.30} />
                <stop offset="95%" stopColor={PROGRESSION_COLORS.repsTop} stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradient1RM" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROGRESSION_COLORS.est1RM} stopOpacity={0.30} />
                <stop offset="95%" stopColor={PROGRESSION_COLORS.est1RM} stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradientProj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROGRESSION_COLORS.projection} stopOpacity={0.30} />
                <stop offset="95%" stopColor={PROGRESSION_COLORS.projection} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
              tick={{ fontSize: 9.5, fontWeight: '700', fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              tickFormatter={(val) => (typeof val === 'string' ? val.replace(/\s*\(\s*#?\d+\s*\)$/, '') : val)}
            />

            {metricMode === 'weights' ? (
              <>
                {/* Eje Y Izquierdo: Carga en lbs */}
                <YAxis
                  yAxisId="weight"
                  domain={weightYDomain}
                  tick={{ fontSize: 10, fontWeight: '800', fill: PROGRESSION_COLORS.peakWeight }}
                  axisLine={{ stroke: PROGRESSION_COLORS.peakWeight }}
                  tickLine={false}
                />

                {/* Eje Y Derecho: Repeticiones (escalado al rango individual de este ejercicio) */}
                <YAxis
                  yAxisId="reps"
                  orientation="right"
                  domain={[0, Math.max(20, targetRange.max + 4)]}
                  tick={{ fontSize: 10, fontWeight: '800', fill: PROGRESSION_COLORS.repsTop }}
                  axisLine={{ stroke: PROGRESSION_COLORS.repsTop }}
                  tickLine={false}
                />

                {/* Eje Y Derecho Secundario: RPE (escala 5 a 10) */}
                {showRPE && (
                  <YAxis
                    yAxisId="rpe"
                    orientation="right"
                    domain={[5, 10]}
                    ticks={[6, 7, 8, 9, 10]}
                    tick={{ fontSize: 9.5, fontWeight: '800', fill: PROGRESSION_COLORS.rpe }}
                    axisLine={{ stroke: PROGRESSION_COLORS.rpe }}
                    tickLine={false}
                    tickFormatter={(v) => `R${v}`}
                  />
                )}

                {/* 🟩 BANDA VERDE SOMBREADA DE HIPERTROFIA DINÁMICA POR EJERCICIO */}
                {showReps && (
                  <ReferenceArea
                    yAxisId="reps"
                    y1={targetRange.min}
                    y2={targetRange.max}
                    fill={PROGRESSION_COLORS.repsBand}
                    fillOpacity={0.12}
                    stroke={PROGRESSION_COLORS.repsBand}
                    strokeDasharray="3 3"
                  />
                )}
              </>
            ) : (
              /* Eje Y para Tonelaje */
              <YAxis
                yAxisId="tonnage"
                domain={tonnageYDomain}
                tick={{ fontSize: 10, fontWeight: '800', fill: PROGRESSION_COLORS.tonnage }}
                axisLine={{ stroke: PROGRESSION_COLORS.tonnage }}
                tickLine={false}
                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              />
            )}

            {/* 🔮 ZONA SOMBREADA DE PROYECCIONES FUTURAS */}
            {showProjections && transitionDate && lastProjectedDate && (
              <ReferenceArea
                yAxisId={metricMode === 'weights' ? 'weight' : 'tonnage'}
                x1={transitionDate}
                x2={lastProjectedDate}
                fill={PROGRESSION_COLORS.projection}
                fillOpacity={0.07}
                stroke={PROGRESSION_COLORS.projection}
                strokeDasharray="4 4"
              />
            )}

            {/* 🧘 FRANJAS CLÍNICAS SOMBREADAS DE SEMANA DE DESCARGA (DELOAD) */}
            {deloadWindows && deloadWindows.map((win, wIdx) => (
              <ReferenceArea
                key={`deload-win-${wIdx}`}
                yAxisId={metricMode === 'weights' ? 'weight' : 'tonnage'}
                x1={win.start}
                x2={win.end}
                fill={PROGRESSION_COLORS.deload}
                fillOpacity={0.16}
                stroke={PROGRESSION_COLORS.deloadBorder}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            ))}

            {/* Guía vertical de cursor sin popup flotante molesto que tape la gráfica */}
            <Tooltip
              cursor={{ stroke: PROGRESSION_COLORS.peakWeight, strokeWidth: 1.5, strokeDasharray: '3 3' }}
              content={<CustomTooltipReceiver />}
            />

            {/* CURVAS SEGÚN EL MODO SELECCIONADO */}
            {metricMode === 'tonnage' ? (
              /* 📦 CURVA DE TONELAJE */
              <>
                <Area
                  yAxisId="tonnage"
                  type="monotone"
                  dataKey="tonnage"
                  name="Tonelaje Efectivo"
                  stroke={PROGRESSION_COLORS.tonnage}
                  strokeWidth={2.5}
                  fill="url(#gradientTonnage)"
                  dot={{ r: 3.5, fill: PROGRESSION_COLORS.tonnage, stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: PROGRESSION_COLORS.tonnage }}
                  connectNulls={false}
                />
                {showProjections && (
                  <Area
                    yAxisId="tonnage"
                    type="monotone"
                    dataKey="projectedTonnage"
                    name="Meta de Tonelaje"
                    stroke={PROGRESSION_COLORS.projection}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#gradientProj)"
                    dot={{ r: 3.5, fill: PROGRESSION_COLORS.projection, stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: PROGRESSION_COLORS.projection }}
                    connectNulls
                  />
                )}
              </>
            ) : (
              /* 🏋️ CURVAS DE PESO Y REPETICIONES */
              <>
                {/* 🌊 BANDA SOMBREADA MIN-MAX (RANGE RIBBON) */}
                {showWeight && (weightMode === 'band' || weightMode === 'both') && (
                  <Area
                    yAxisId="weight"
                    type="monotone"
                    dataKey="weightRange"
                    name="Rango Min-Max (Dispersión)"
                    fill="url(#gradientWeightRange)"
                    stroke="none"
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                  />
                )}

                {/* 🌊 CURVA DE CARGA PICO (TOP SET) */}
                {showWeight && (weightMode === 'band' || weightMode === 'peak' || weightMode === 'both') && (
                  <Area
                    yAxisId="weight"
                    type="monotone"
                    dataKey="weight"
                    name="Carga Pico (Top Set)"
                    stroke={PROGRESSION_COLORS.peakWeight}
                    strokeWidth={2.5}
                    fill={weightMode === 'peak' ? 'url(#gradientWeight)' : 'none'}
                    dot={(dotProps) => <StationDot {...dotProps} baseColor={PROGRESSION_COLORS.peakWeight} isFamilyView={isFamilyView} />}
                    activeDot={{ r: 5, fill: PROGRESSION_COLORS.peakWeight }}
                    connectNulls={false}
                  />
                )}

                {/* 🌊 LÍNEA CENTRAL: CARGA PROMEDIO PONDERADA EFECTIVA */}
                {showWeight && (weightMode === 'band' || weightMode === 'avg' || weightMode === 'both') && (
                  <Line
                    yAxisId="weight"
                    type="monotone"
                    dataKey="weightedAvgWeight"
                    name="Promedio Ponderado Efectivo"
                    stroke={PROGRESSION_COLORS.avgWeight}
                    strokeWidth={2.5}
                    strokeDasharray={weightMode === 'band' ? 'none' : '4 3'}
                    dot={(dotProps) => <StationDot {...dotProps} baseColor={PROGRESSION_COLORS.avgWeight} isFamilyView={isFamilyView} />}
                    activeDot={{ r: 5, fill: PROGRESSION_COLORS.avgWeight }}
                    connectNulls={false}
                  />
                )}

                {/* 🌊 LÍNEA SUTIL: CARGA MÍNIMA DE TRABAJO (BASE / BACK-OFF) */}
                {showWeight && (weightMode === 'band' || weightMode === 'both') && (
                  <Line
                    yAxisId="weight"
                    type="monotone"
                    dataKey="minWeight"
                    name="Carga Base / Back-off"
                    stroke={PROGRESSION_COLORS.minWeight}
                    strokeWidth={1.8}
                    strokeDasharray="3 3"
                    dot={(dotProps) => <StationDot {...dotProps} baseColor={PROGRESSION_COLORS.minWeight} isFamilyView={isFamilyView} />}
                    activeDot={{ r: 4, fill: PROGRESSION_COLORS.minWeight }}
                    connectNulls={false}
                  />
                )}

                {/* 🌊 CURVAS DE REPETICIONES: TOP SET Y PROMEDIO SIMULTÁNEAS */}
                {showReps && (repsMode === 'topSet' || repsMode === 'both') && (
                  <Area
                    yAxisId="reps"
                    type="monotone"
                    dataKey="reps"
                    name="Reps (Top Set)"
                    stroke={PROGRESSION_COLORS.repsTop}
                    strokeWidth={2.5}
                    fill="url(#gradientReps)"
                    dot={{ r: 3.5, fill: PROGRESSION_COLORS.repsTop, stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: PROGRESSION_COLORS.repsTop }}
                    connectNulls={false}
                  />
                )}

                {showReps && (repsMode === 'avg' || repsMode === 'both') && (
                  <Line
                    yAxisId="reps"
                    type="monotone"
                    dataKey="avgReps"
                    name="Reps (Promedio)"
                    stroke={PROGRESSION_COLORS.repsAvg}
                    strokeWidth={2.2}
                    strokeDasharray={repsMode === 'both' ? '4 3' : 'none'}
                    dot={{ r: 3.5, fill: PROGRESSION_COLORS.repsAvg, stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: PROGRESSION_COLORS.repsAvg }}
                    connectNulls={false}
                  />
                )}

                {/* 🌊 CURVA DE 1RM ESTIMADO (CYAN OPCIONAL) */}
                {show1RM && (
                  <Line
                    yAxisId="weight"
                    type="monotone"
                    dataKey="est1RM"
                    name="1RM Estimado"
                    stroke={PROGRESSION_COLORS.est1RM}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 2.5, fill: PROGRESSION_COLORS.est1RM }}
                    activeDot={{ r: 4 }}
                    connectNulls={false}
                  />
                )}

                {/* 🔥 CURVA DE RPE (ESFUERZO PERCIBIDO / RIR) */}
                {showRPE && (
                  <Line
                    yAxisId="rpe"
                    type="monotone"
                    dataKey="rpe"
                    name="RPE Promedio"
                    stroke={PROGRESSION_COLORS.rpe}
                    strokeWidth={2.5}
                    dot={(dotProps) => <StationDot {...dotProps} baseColor={PROGRESSION_COLORS.rpe} isFamilyView={isFamilyView} />}
                    activeDot={{ r: 5, fill: PROGRESSION_COLORS.rpe }}
                    connectNulls
                  />
                )}

                {/* 🔮 CURVA DE PROYECCIÓN FUTURA (PÚRPURA DISCONTINUA) */}
                {showProjections && (
                  <Area
                    yAxisId="weight"
                    type="monotone"
                    dataKey={weightMode === 'avg' ? 'projectedAvgWeight' : 'projectedWeight'}
                    name="Meta Proyectada"
                    stroke={PROGRESSION_COLORS.projection}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#gradientProj)"
                    dot={{ r: 3.5, fill: PROGRESSION_COLORS.projection, stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: PROGRESSION_COLORS.projection }}
                    connectNulls
                  />
                )}
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 📦 CAJA DE AUDITORÍA Y DETALLE DE SESIÓN (DEBAJO DE LA GRÁFICA PARA NO OBSTRUIR) */}
      {activeData && (
        <div style={{
          marginTop: '10px',
          background: isProj ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)' : '#0f172a',
          borderRadius: '14px',
          padding: '12px 14px',
          color: '#ffffff',
          border: isPinned ? '1.5px solid #f59e0b' : (isProj ? '1.5px solid #8b5cf6' : (isHovered ? '1.5px solid #3b82f6' : '1px solid #1e293b')),
          boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
          transition: 'all 0.15s ease'
        }}>
          {/* Cabecera con fecha, estado y botón de desfijar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '900', color: isProj ? '#c084fc' : '#93c5fd' }}>
                📅 {activeData.dateFull || activeData.displayDate || activeData.date}
              </span>
              {!isProj && activeData.sessionIndex && (
                <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: '700' }}>
                  • Sesión #{activeData.sessionIndex}
                </span>
              )}
              {!isProj && activeData.sourceName && (
                <span style={{
                  fontSize: '9.5px',
                  color: '#c084fc',
                  fontWeight: '800',
                  background: 'rgba(192, 132, 252, 0.15)',
                  border: '1px solid rgba(192, 132, 252, 0.3)',
                  padding: '1px 6px',
                  borderRadius: '6px'
                }}>
                  🏷️ {activeData.sourceName}
                </span>
              )}
              {!isProj && activeData.stationLabel && (
                <span style={{
                  fontSize: '9.5px',
                  color: '#67e8f9',
                  fontWeight: '800',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '1px 6px',
                  borderRadius: '6px'
                }}>
                  {activeData.stationIcon} {activeData.stationLabel}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {!isProj && activeData.isDeloadSession && (
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: '900',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.25)',
                  color: '#34d399',
                  border: '1px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🧘 SEMANA DE DESCARGA (DELOAD)
                </span>
              )}
              <span style={{
                fontSize: '9.5px',
                fontWeight: '900',
                padding: '2px 7px',
                borderRadius: '6px',
                background: isPinned ? 'rgba(245, 158, 11, 0.25)' : (isProj ? 'rgba(139, 92, 246, 0.25)' : (isHovered ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.2)')),
                color: isPinned ? '#fcd34d' : (isProj ? '#d8b4fe' : (isHovered ? '#93c5fd' : '#4ade80')),
                border: isPinned ? '1px solid #f59e0b' : 'none'
              }}>
                {isPinned ? '📌 FIJADO' : (isProj ? '🔮 PROYECCIÓN' : (isHovered ? '🔍 INSPECCIONANDO' : '✓ ÚLTIMA SESIÓN'))}
              </span>
              {isPinned && (
                <button
                  type="button"
                  onClick={() => setPinnedPoint(null)}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: 'none',
                    borderRadius: '50%',
                    color: '#ffffff',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    padding: 0
                  }}
                  title="Desfijar y volver a la última sesión"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Grid de Métricas Clave */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '8px' }}>
            {/* 1. Carga Pico */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '9px', color: '#93c5fd', display: 'block', fontWeight: '800' }}>🔵 Carga Pico (Top Set)</span>
              <strong style={{ fontSize: '15px', color: isProj ? '#f472b6' : '#60a5fa' }}>
                {(isProj ? activeData.projectedWeight : activeData.weight) || '--'} <span style={{ fontSize: '10px', color: '#94a3b8' }}>lbs</span>
              </strong>
              {!isProj && activeData.weightSpread > 0 && (
                <span style={{ fontSize: '8.5px', color: '#93c5fd', display: 'block', marginTop: '2px' }}>
                  Rango: {activeData.minWeight} - {activeData.weight}# (Δ {activeData.weightSpread}#)
                </span>
              )}
            </div>

            {/* 2. Carga Promedio Ponderada Efectiva */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '9px', color: '#d8b4fe', display: 'block', fontWeight: '800' }}>🟣 Promedio Ponderado</span>
              <strong style={{ fontSize: '15px', color: isProj ? '#f472b6' : '#c084fc' }}>
                {(isProj ? activeData.projectedAvgWeight : (activeData.weightedAvgWeight || activeData.avgWeight)) || '--'} <span style={{ fontSize: '10px', color: '#94a3b8' }}>lbs</span>
              </strong>
              {!isProj && (activeData.rpe || activeData.rpeStart) && (
                <span style={{ fontSize: '8.5px', color: '#f87171', display: 'block', marginTop: '2px', fontWeight: '800' }}>
                  🔥 RPE {activeData.rpe || activeData.rpeStart} {activeData.rpe ? `• RIR ${Math.max(0, Math.round(10 - activeData.rpe))}` : ''}{activeData.rpeEnd && activeData.rpeEnd !== activeData.rpeStart ? ` (➔ ${activeData.rpeEnd})` : ''} {activeData.deltaRPE ? `(Δ ${activeData.deltaRPE > 0 ? `+${activeData.deltaRPE}` : activeData.deltaRPE})` : ''}
                </span>
              )}
            </div>

            {/* 3. Repeticiones (Top Set y Promedio simultáneas con colores diferenciados) */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '9px', color: '#86efac', display: 'block', fontWeight: '800' }}>⚡ Reps (Top • Prom)</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <strong style={{ fontSize: '15px', color: '#4ade80' }}>
                  {(isProj ? activeData.projectedReps : activeData.reps) || '--'}
                </strong>
                {!isProj && activeData.avgReps > 0 && activeData.avgReps !== activeData.reps && (
                  <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '800' }}>
                    • Prom: {activeData.avgReps}
                  </span>
                )}
                {activeData.reps >= targetRange.min && activeData.reps <= targetRange.max && (
                  <span style={{ fontSize: '8.5px', color: '#86efac', background: 'rgba(16,185,129,0.2)', padding: '1px 4px', borderRadius: '4px', marginLeft: 'auto' }}>
                    ✓ {targetRange.label}
                  </span>
                )}
              </div>
              {!isProj && activeData.repDropOffPct > 0 && (
                <span style={{ fontSize: '8.5px', color: '#fca5a5', display: 'block', marginTop: '2px' }}>
                  Fatiga: {activeData.repDropOffPct}% caída reps
                </span>
              )}
            </div>

            {/* 4. Tonelaje Efectivo & 1RM */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>📦 Tonelaje</span>
                  <strong style={{ fontSize: '12px', color: '#fb923c' }}>
                    {(isProj ? activeData.projectedTonnage : activeData.tonnage)?.toLocaleString() || '--'}#
                  </strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>🏆 1RM Teórico</span>
                  <strong style={{ fontSize: '12px', color: '#22d3ee' }}>
                    {(isProj ? activeData.projected1RM : activeData.est1RM) || '--'}#
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Desglose de series efectivas */}
          {!isProj && Array.isArray(activeData.detailedSets) && activeData.detailedSets.length > 0 && (
            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: '800' }}>
                  📋 Series ({activeData.setsCount} efectivas{activeData.warmupCount > 0 ? ` + ${activeData.warmupCount} aprox` : ''}):
                </span>
                {activeData.setsCount > 1 && (
                  <span style={{ fontSize: '9px', color: '#cbd5e1' }}>
                    Mín {activeData.minReps} — Máx {activeData.maxReps} reps
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {activeData.detailedSets.map((s, sIdx) => {
                  const isTop = s.weight === activeData.weight && s.reps === activeData.reps;
                  const isWarm = s.isWarmup;
                  const isDeload = Boolean(activeData.isDeloadSession);
                  return (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '5px',
                        background: isDeload
                          ? (isTop ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.15)')
                          : (isTop
                            ? 'rgba(29, 78, 216, 0.4)'
                            : (isWarm ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.08)')),
                        color: isDeload ? '#a7f3d0' : (isTop ? '#93c5fd' : (isWarm ? '#fcd34d' : '#cbd5e1')),
                        border: isDeload
                          ? (isTop ? '1.5px solid #10b981' : '1px solid rgba(16, 185, 129, 0.4)')
                          : (isTop
                            ? `1.5px solid ${PROGRESSION_COLORS.peakWeight}`
                            : (isWarm ? '1px dashed #f59e0b' : '1px solid transparent')),
                        fontWeight: isTop ? '900' : '600'
                      }}
                      title={isDeload ? 'Serie en semana de descarga (volumen 50% / RIR 3-4)' : (isWarm ? 'Serie de aproximación/calentamiento' : 'Serie efectiva')}
                    >
                      {s.label || (s.setNum <= 0 ? 'C1' : `S${s.setNum || sIdx + 1}`)}: {s.weight}#×{s.reps}{isDeload ? ' 🧘' : (isTop ? ' 🔥' : '')}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {isProj && activeData.projectionNote && (
            <div style={{ fontSize: '10px', color: '#f472b6', fontStyle: 'italic', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '4px' }}>
              💡 Meta: {activeData.projectionNote}
            </div>
          )}

          {/* Hint sutil */}
          <div style={{ marginTop: '6px', fontSize: '8.5px', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
            👆 Toca o pasa el cursor por cualquier punto de la curva para auditar esa sesión aquí sin tapar la gráfica.
          </div>
        </div>
      )}

      {/* FOOTER INFORMATIVO CON RÉCORD ACTUAL Y CARGA PROMEDIO */}
      <div style={{
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        fontSize: '10px',
        color: '#64748b'
      }}>
        <div>
          <span>
            Último Pico: <strong style={{ color: PROGRESSION_COLORS.peakWeight }}>{currentWeight} lbs</strong> (Récord: <strong style={{ color: '#15803d' }}>{peakWeight}#</strong>)
          </span>
          {currentAvgWeight > 0 && (
            <span style={{ marginLeft: '6px', borderLeft: '1px solid #cbd5e1', paddingLeft: '6px' }}>
              Último Prom: <strong style={{ color: PROGRESSION_COLORS.avgWeight }}>{currentAvgWeight} lbs</strong>
            </span>
          )}
        </div>
        <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>
          Toca o pasa el cursor para auditar cada punto
        </span>
      </div>
    </div>
  );
}
