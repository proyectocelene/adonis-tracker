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
import { calculate1RM } from '../../hooks/useWorkoutCalculations.js';

export default function ExerciseProgressionChart({
  exercise,
  workoutHistory = [],
  todayWorkoutData = {},
  compact = false,
  height = 220
}) {
  // Modo de Alcance: 'station' (Solo esta máquina exacta) o 'family' (Toda la familia biomecánica)
  const [scopeMode, setScopeMode] = useState('station');
  // Modo de Carga: 'peak' (Carga Máxima / Top Set), 'avg' (Carga Promedio Efectiva), 'both' (Ambas curvas)
  const [weightMode, setWeightMode] = useState('both');
  const [showWeight, setShowWeight] = useState(true);
  const [showReps, setShowReps] = useState(true);
  const [show1RM, setShow1RM] = useState(false);
  const [showProjections, setShowProjections] = useState(true);
  // Modalidad de repeticiones: 'both' (Ambas al mismo tiempo), 'topSet' (Top Set) o 'avg' (Promedio)
  const [repsMode, setRepsMode] = useState('both');
  // Modo métrica: 'weights' (Cargas y Repeticiones) o 'tonnage' (Tonelaje de Volumen en lbs)
  const [metricMode, setMetricMode] = useState('weights');

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

  // Procesar puntos reales + proyecciones matemáticas
  const { chartData, transitionDate, lastProjectedDate, hasHistory, peakWeight, avgPeakWeight, currentWeight, currentAvgWeight, lastRealPoint } = useMemo(() => {
    if (!exercise) return { chartData: [], transitionDate: null, lastProjectedDate: null, hasHistory: false, peakWeight: 0, avgPeakWeight: 0, currentWeight: 0, currentAvgWeight: 0, lastRealPoint: null };

    // 1. Extraer historial real usando el motor de matching tolerante a alias y familias
    const records = getHistoricalRecordsForExercise(exercise, workoutHistory, { matchFamily: scopeMode === 'family' });
    const rawOccurrences = records.sessionOccurrences || [];

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
      const avgW = Math.round((occ.avgWeight || occ.maxWeight || 0) * 10) / 10;
      const effectiveTonnage = Math.round(occ.tonnage || occ.totalVolume || (peakW * (occ.bestReps || 0)));

      return {
        date: uniqueKey,
        displayDate: baseLabel,
        sessionIndex: idx + 1,
        dateFull: occ.dateFull || occ.dateStr || `Sesión ${idx + 1}`,
        weight: peakW, // Carga Pico
        avgWeight: avgW, // Carga Promedio Efectiva (sin calentamientos)
        minWeight: Math.round(occ.minWeight || peakW),
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

      realPoints.push({
        date: todayKey,
        displayDate: 'Hoy',
        sessionIndex: realPoints.length + 1,
        dateFull: 'Sesión de Hoy (En curso)',
        weight: Math.round(todayMaxW),
        avgWeight: avgWeightToday,
        minWeight: Math.round(todayMinW !== Infinity ? todayMinW : todayMaxW),
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
      const projectedW = Math.round(baselineWeight + factor);
      const projectedAvgW = Math.round((baselineAvgWeight + factor * 0.95) * 10) / 10;
      const projectedRM = Math.round(baseline1RM + (factor * 1.15));
      const projectedTon = Math.round(baselineTonnage * (1 + (factor / baselineWeight) * 0.8));

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

    return {
      chartData: combinedData,
      transitionDate: transDate,
      lastProjectedDate: lastProj,
      hasHistory: realPoints.length > 0,
      peakWeight: maxHistorical,
      avgPeakWeight: maxAvgHistorical,
      currentWeight: lastRealPoint.weight,
      currentAvgWeight: lastRealPoint.avgWeight,
      lastRealPoint: lastRealPoint || null
    };
  }, [exercise, workoutHistory, todayWorkoutData, scopeMode]);

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
          {/* Selector de Alcance: Esta Máquina vs Toda la Familia */}
          {machineKey && (
            <div style={{ display: 'inline-flex', background: '#e0e7ff', borderRadius: '8px', padding: '2px', border: '1px solid #c7d2fe' }}>
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
                🎯 Esta Máquina
              </button>
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
              {/* Selector de Modo de Carga: Máx | Prom | Ambas */}
              <div style={{ display: 'inline-flex', background: '#eff6ff', borderRadius: '8px', padding: '2px', border: '1px solid #bfdbfe' }}>
                {[
                  { id: 'peak', label: 'Pico', title: 'Ver solo la Carga Máxima (Top Set)' },
                  { id: 'avg', label: 'Prom', title: 'Ver la Carga Promedio de series efectivas' },
                  { id: 'both', label: 'Ambas', title: 'Ver Carga Pico y Promedio a la vez' }
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
                      background: weightMode === wm.id ? '#0066ff' : 'transparent',
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
              <div style={{ display: 'inline-flex', borderRadius: '8px', overflow: 'hidden', border: showReps ? '1.5px solid #10b981' : '1px solid #cbd5e1' }}>
                <button
                  type="button"
                  onClick={() => setShowReps(prev => !prev)}
                  style={{
                    padding: '3px 6px',
                    border: 'none',
                    background: showReps ? '#ecfdf5' : '#f8fafc',
                    color: showReps ? '#059669' : '#94a3b8',
                    fontSize: '9.5px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                  title="Activar/Desactivar curva de repeticiones"
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: showReps ? '#10b981' : '#94a3b8' }} />
                  Reps
                </button>
                {showReps && (
                  <button
                    type="button"
                    onClick={() => setRepsMode(prev => prev === 'both' ? 'topSet' : prev === 'topSet' ? 'avg' : 'both')}
                    style={{
                      padding: '3px 6px',
                      border: 'none',
                      borderLeft: '1px solid #a7f3d0',
                      background: '#d1fae5',
                      color: '#047857',
                      fontSize: '9px',
                      fontWeight: '900',
                      cursor: 'pointer'
                    }}
                    title="Alternar: Ambas curvas simultáneas, solo Top Set, o solo Promedio"
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
                  border: show1RM ? '1.5px solid #06b6d4' : '1px solid #cbd5e1',
                  background: show1RM ? '#ecfeff' : '#f8fafc',
                  color: show1RM ? '#0891b2' : '#94a3b8',
                  fontSize: '9.5px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                title="Curva de 1RM Estimado por fórmula de Epley"
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: show1RM ? '#06b6d4' : '#94a3b8' }} />
                1RM
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
              border: showProjections ? '1.5px solid #8b5cf6' : '1px solid #cbd5e1',
              background: showProjections ? '#f5f3ff' : '#f8fafc',
              color: showProjections ? '#7c3aed' : '#94a3b8',
              fontSize: '9.5px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="Mostrar u ocultar proyecciones científicas (próxima sesión, 2 sesiones, 1m, 3m y 6 meses)"
          >
            <Sparkles size={11} color={showProjections ? '#7c3aed' : '#94a3b8'} />
            Metas
          </button>
        </div>
      </div>

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

            {weightMode === 'both' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1e40af' }}>
                <span style={{ width: '12px', height: '2px', background: '#0066ff' }} /> Pico
                <span style={{ width: '12px', height: '2px', background: '#38bdf8', borderTop: '1px dashed #0284c7' }} /> Prom
              </span>
            )}

            {showReps && repsMode === 'both' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#047857' }}>
                <span style={{ width: '12px', height: '2.5px', background: '#10b981' }} /> Reps Top
                <span style={{ width: '12px', height: '2px', background: '#059669', borderTop: '1px dashed #059669' }} /> Prom
              </span>
            )}
          </div>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b45309' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(245, 158, 11, 0.25)', border: '1px solid #f59e0b', borderRadius: '3px' }} />
            Tonelaje de Sesión = suma de (peso × reps) de series efectivas
          </span>
        )}

        {showProjections && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7c3aed' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(139, 92, 246, 0.15)', border: '1px dashed #8b5cf6', borderRadius: '3px' }} />
            🔮 Proyecciones (+1m a +6m)
          </span>
        )}
      </div>

      {/* GRÁFICA RECHARTS CON ÁREAS SOMBREADAS TRANSLÚCIDAS Y DOBLE EJE Y */}
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
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
                <stop offset="5%" stopColor="#0066ff" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0066ff" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradientAvgWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradientTonnage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradientReps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.30} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradient1RM" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.30} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="gradientProj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.30} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
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
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10, fontWeight: '700', fill: '#0066ff' }}
                  axisLine={{ stroke: '#93c5fd' }}
                  tickLine={false}
                />

                {/* Eje Y Derecho: Repeticiones (escalado al rango individual de este ejercicio) */}
                <YAxis
                  yAxisId="reps"
                  orientation="right"
                  domain={[0, Math.max(20, targetRange.max + 4)]}
                  tick={{ fontSize: 10, fontWeight: '700', fill: '#10b981' }}
                  axisLine={{ stroke: '#86efac' }}
                  tickLine={false}
                />

                {/* 🟩 BANDA VERDE SOMBREADA DE HIPERTROFIA DINÁMICA POR EJERCICIO */}
                {showReps && (
                  <ReferenceArea
                    yAxisId="reps"
                    y1={targetRange.min}
                    y2={targetRange.max}
                    fill="#10b981"
                    fillOpacity={0.14}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                  />
                )}
              </>
            ) : (
              /* Eje Y para Tonelaje */
              <YAxis
                yAxisId="tonnage"
                domain={['auto', 'auto']}
                tick={{ fontSize: 10, fontWeight: '700', fill: '#f59e0b' }}
                axisLine={{ stroke: '#fcd34d' }}
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
                fill="#8b5cf6"
                fillOpacity={0.07}
                stroke="#8b5cf6"
                strokeDasharray="4 4"
              />
            )}

            {/* Guía vertical de cursor sin popup flotante molesto que tape la gráfica */}
            <Tooltip
              cursor={{ stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '3 3' }}
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
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#gradientTonnage)"
                  dot={{ r: 3.5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#f59e0b' }}
                  connectNulls={false}
                />
                {showProjections && (
                  <Area
                    yAxisId="tonnage"
                    type="monotone"
                    dataKey="projectedTonnage"
                    name="Meta de Tonelaje"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#gradientProj)"
                    dot={{ r: 3.5, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#8b5cf6' }}
                    connectNulls
                  />
                )}
              </>
            ) : (
              /* 🏋️ CURVAS DE PESO Y REPETICIONES */
              <>
                {/* 🌊 CURVA DE CARGA PICO (TOP SET) */}
                {showWeight && (weightMode === 'peak' || weightMode === 'both') && (
                  <Area
                    yAxisId="weight"
                    type="monotone"
                    dataKey="weight"
                    name="Carga Pico (Top Set)"
                    stroke="#0066ff"
                    strokeWidth={weightMode === 'both' ? 2.5 : 2.5}
                    fill={weightMode === 'both' ? 'url(#gradientWeight)' : 'url(#gradientWeight)'}
                    dot={{ r: 3.5, fill: '#0066ff', stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#0066ff' }}
                    connectNulls={false}
                  />
                )}

                {/* 🌊 CURVA DE CARGA PROMEDIO EFECTIVA */}
                {showWeight && (weightMode === 'avg' || weightMode === 'both') && (
                  <Line
                    yAxisId="weight"
                    type="monotone"
                    dataKey="avgWeight"
                    name="Carga Promedio Efectiva"
                    stroke="#0284c7"
                    strokeWidth={2}
                    strokeDasharray={weightMode === 'both' ? '4 3' : 'none'}
                    dot={{ r: 3, fill: '#38bdf8', stroke: '#0284c7', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#0284c7' }}
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
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#gradientReps)"
                    dot={{ r: 3.5, fill: '#10b981', stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#10b981' }}
                    connectNulls={false}
                  />
                )}

                {showReps && (repsMode === 'avg' || repsMode === 'both') && (
                  <Line
                    yAxisId="reps"
                    type="monotone"
                    dataKey="avgReps"
                    name="Reps (Promedio)"
                    stroke="#059669"
                    strokeWidth={2}
                    strokeDasharray={repsMode === 'both' ? '4 3' : 'none'}
                    dot={{ r: 3, fill: '#34d399', stroke: '#059669', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#059669' }}
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
                    stroke="#06b6d4"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 2.5, fill: '#06b6d4' }}
                    activeDot={{ r: 4 }}
                    connectNulls={false}
                  />
                )}

                {/* 🔮 CURVA DE PROYECCIÓN FUTURA (PÚRPURA DISCONTINUA) */}
                {showProjections && (
                  <Area
                    yAxisId="weight"
                    type="monotone"
                    dataKey={weightMode === 'avg' ? 'projectedAvgWeight' : 'projectedWeight'}
                    name="Meta Proyectada"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#gradientProj)"
                    dot={{ r: 3.5, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#8b5cf6' }}
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
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
              <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>🔵 Carga Pico (Top Set)</span>
              <strong style={{ fontSize: '15px', color: isProj ? '#c084fc' : '#60a5fa' }}>
                {(isProj ? activeData.projectedWeight : activeData.weight) || '--'} <span style={{ fontSize: '10px', color: '#94a3b8' }}>lbs</span>
              </strong>
            </div>

            {/* 2. Carga Promedio Efectiva */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>⚖️ Carga Promedio</span>
              <strong style={{ fontSize: '15px', color: isProj ? '#a855f7' : '#38bdf8' }}>
                {(isProj ? activeData.projectedAvgWeight : activeData.avgWeight) || '--'} <span style={{ fontSize: '10px', color: '#94a3b8' }}>lbs</span>
              </strong>
            </div>

            {/* 3. Repeticiones (Top Set y Promedio simultáneas) */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>⚡ Reps (Top • Prom)</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <strong style={{ fontSize: '15px', color: '#4ade80' }}>
                  {(isProj ? activeData.projectedReps : activeData.reps) || '--'}
                </strong>
                {!isProj && activeData.avgReps > 0 && activeData.avgReps !== activeData.reps && (
                  <span style={{ fontSize: '11px', color: '#a7f3d0' }}>
                    • Prom: {activeData.avgReps}
                  </span>
                )}
                {activeData.reps >= targetRange.min && activeData.reps <= targetRange.max && (
                  <span style={{ fontSize: '8.5px', color: '#86efac', background: 'rgba(16,185,129,0.2)', padding: '1px 4px', borderRadius: '4px', marginLeft: 'auto' }}>
                    ✓ {targetRange.label}
                  </span>
                )}
              </div>
            </div>

            {/* 4. Tonelaje Efectivo & 1RM */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>📦 Tonelaje</span>
                  <strong style={{ fontSize: '12px', color: '#fbbf24' }}>
                    {(isProj ? activeData.projectedTonnage : activeData.tonnage)?.toLocaleString() || '--'}#
                  </strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>🏆 1RM Teórico</span>
                  <strong style={{ fontSize: '12px', color: '#06b6d4' }}>
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
                  return (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '5px',
                        background: isTop
                          ? 'rgba(0, 102, 255, 0.35)'
                          : (isWarm ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.08)'),
                        color: isTop ? '#93c5fd' : (isWarm ? '#fcd34d' : '#cbd5e1'),
                        border: isTop
                          ? '1.5px solid #3b82f6'
                          : (isWarm ? '1px dashed #f59e0b' : '1px solid transparent'),
                        fontWeight: isTop ? '900' : '600'
                      }}
                      title={isWarm ? 'Serie de aproximación/calentamiento' : 'Serie efectiva'}
                    >
                      {s.label || (s.setNum <= 0 ? 'C1' : `S${s.setNum || sIdx + 1}`)}: {s.weight}#×{s.reps}{isTop ? ' 🔥' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {isProj && activeData.projectionNote && (
            <div style={{ fontSize: '10px', color: '#c084fc', fontStyle: 'italic', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '4px' }}>
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
            Último Pico: <strong style={{ color: '#0066ff' }}>{currentWeight} lbs</strong> (Récord: <strong style={{ color: '#15803d' }}>{peakWeight}#</strong>)
          </span>
          {currentAvgWeight > 0 && (
            <span style={{ marginLeft: '6px', borderLeft: '1px solid #cbd5e1', paddingLeft: '6px' }}>
              Último Prom: <strong style={{ color: '#0284c7' }}>{currentAvgWeight} lbs</strong>
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
