import React, { useState, useMemo } from 'react';
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
import { TrendingUp, Sparkles, Filter, Info } from 'lucide-react';
import { getHistoricalRecordsForExercise } from '../../utils/exerciseMatcher.js';
import { calculate1RM } from '../../hooks/useWorkoutCalculations.js';

export default function ExerciseProgressionChart({
  exercise,
  workoutHistory = [],
  todayWorkoutData = {},
  height = 270,
  compact = false
}) {
  // 🎛️ Filtro Rápido: Estados para apagar o encender curvas al instante
  const [showWeight, setShowWeight] = useState(true);
  const [showReps, setShowReps] = useState(true);
  const [show1RM, setShow1RM] = useState(false);
  const [showProjections, setShowProjections] = useState(true);
  // Modalidad de repeticiones: 'topSet' (Reps en la Serie Pico) o 'avg' (Promedio de la sesión)
  const [repsMode, setRepsMode] = useState('topSet');

  // Procesar puntos reales + proyecciones matemáticas
  const { chartData, transitionDate, lastProjectedDate, hasHistory, peakWeight, currentWeight } = useMemo(() => {
    if (!exercise) return { chartData: [], transitionDate: null, lastProjectedDate: null, hasHistory: false, peakWeight: 0, currentWeight: 0 };

    // 1. Extraer historial real usando el motor de matching tolerante a alias y familias
    const records = getHistoricalRecordsForExercise(exercise, workoutHistory);
    const rawOccurrences = records.sessionOccurrences || [];

    const realPoints = rawOccurrences.map((occ, idx) => {
      let shortLabel = occ.dateStr || `S${idx + 1}`;
      if (occ.dateStr && occ.dateStr.includes('-')) {
        const parts = occ.dateStr.split('-');
        if (parts.length === 3) {
          shortLabel = `${parts[2]}/${parts[1]}`;
        }
      }

      return {
        date: shortLabel,
        dateFull: occ.dateStr || `Sesión ${idx + 1}`,
        weight: Math.round(occ.maxWeight),
        minWeight: Math.round(occ.minWeight || occ.maxWeight),
        reps: occ.bestReps || 0, // Repeticiones en la serie pico (Top Set)
        avgReps: occ.avgReps || occ.bestReps || 0, // Promedio matemático de reps de toda la sesión
        minReps: occ.minRepsSession || occ.bestReps || 0, // Mínimo de reps en la sesión
        maxReps: occ.maxRepsSession || occ.bestReps || 0, // Máximo de reps en la sesión
        setsCount: occ.setsCount || (occ.detailedSets ? occ.detailedSets.length : 1),
        detailedSets: occ.detailedSets || [],
        topSet: occ.topSet,
        est1RM: Math.round(occ.est1RM || calculate1RM(occ.maxWeight, occ.bestReps)),
        volume: Math.round(occ.totalVolume || (occ.maxWeight * (occ.bestReps || 0))),
        isProjected: false,
        projectedWeight: null,
        projectedReps: null,
        projected1RM: null
      };
    });

    // 2. Extraer datos de la sesión de hoy si tiene series marcadas
    const exId = exercise.id;
    const todayLogs = todayWorkoutData?.[exId] || {};
    let todayMaxW = 0;
    let todayMinW = Infinity;
    let todayMaxR = 0;
    let todayMinR = Infinity;
    let todayRepsSum = 0;
    let todayVol = 0;
    const todaySets = [];

    Object.keys(todayLogs).forEach(k => {
      const num = parseInt(k, 10);
      if (!isNaN(num) && todayLogs[k]?.completed) {
        const w = parseFloat(todayLogs[k].weight) || 0;
        const r = parseInt(todayLogs[k].reps, 10) || 0;
        if (w > 0 && r > 0) {
          todaySets.push({ setNum: num, weight: w, reps: r });
          todayVol += (w * r);
          todayRepsSum += r;
          if (w > todayMaxW) todayMaxW = w;
          if (w < todayMinW) todayMinW = w;
          if (r > todayMaxR) todayMaxR = r;
          if (r < todayMinR) todayMinR = r;
        }
      }
    });

    if (todayMaxW > 0) {
      const peakSetsToday = todaySets.filter(s => s.weight === todayMaxW);
      const bestRepsAtPeakToday = peakSetsToday.length > 0 ? Math.max(...peakSetsToday.map(s => s.reps)) : 0;
      const avgRepsToday = todaySets.length > 0 ? Math.round((todayRepsSum / todaySets.length) * 10) / 10 : bestRepsAtPeakToday;

      realPoints.push({
        date: 'Hoy',
        dateFull: 'Sesión de Hoy (En curso)',
        weight: Math.round(todayMaxW),
        minWeight: Math.round(todayMinW !== Infinity ? todayMinW : todayMaxW),
        reps: bestRepsAtPeakToday,
        avgReps: avgRepsToday,
        minReps: todayMinR !== Infinity ? todayMinR : bestRepsAtPeakToday,
        maxReps: todayMaxR,
        setsCount: todaySets.length,
        detailedSets: todaySets,
        est1RM: Math.round(calculate1RM(todayMaxW, bestRepsAtPeakToday)),
        volume: Math.round(todayVol),
        isProjected: false,
        projectedWeight: null,
        projectedReps: null,
        projected1RM: null
      });
    }

    if (realPoints.length === 0) {
      return { chartData: [], transitionDate: null, lastProjectedDate: null, hasHistory: false, peakWeight: 0, currentWeight: 0 };
    }

    // Identificar carga pico y carga actual
    const maxHistorical = Math.max(...realPoints.map(p => p.weight));
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
    const baseline1RM = Math.max(...realPoints.map(p => p.est1RM));

    // Conectar el último punto real con la curva proyectada para que sea continua
    lastRealPoint.projectedWeight = lastRealPoint.weight;
    lastRealPoint.projectedReps = lastRealPoint.reps;
    lastRealPoint.projected1RM = lastRealPoint.est1RM;

    // 🔮 3. Generar proyecciones científicas a 1 mes, 2 meses, 3 meses y 6 meses
    const projections = [
      {
        label: '+1m',
        weeks: 4,
        note: 'Adaptación neural & reclutamiento'
      },
      {
        label: '+2m',
        weeks: 8,
        note: 'Hipertrofia miofibrilar consolidada'
      },
      {
        label: '+3m',
        weeks: 12,
        note: 'Fin de bloque de sobrecarga'
      },
      {
        label: '+6m',
        weeks: 24,
        note: 'Potencial estético a mediano plazo'
      }
    ];

    const projectedPoints = projections.map(proj => {
      const projW = Math.round(baselineWeight + (weeklyRate * proj.weeks));
      const proj1RM = Math.round(baseline1RM + (weeklyRate * proj.weeks * 1.1));
      return {
        date: proj.label,
        dateFull: `Meta a ${proj.weeks} semanas (${proj.label})`,
        weight: null,
        reps: null,
        est1RM: null,
        projectedWeight: projW,
        projectedReps: 10, // Meta estándar hipertrofia
        projected1RM: proj1RM,
        volume: projW * 10,
        isProjected: true,
        projectionNote: proj.note
      };
    });

    const lastProjDate = projectedPoints[projectedPoints.length - 1]?.date;

    return {
      chartData: [...realPoints, ...projectedPoints],
      transitionDate: transDate,
      lastProjectedDate: lastProjDate,
      hasHistory: true,
      peakWeight: maxHistorical,
      currentWeight: lastRealPoint.weight
    };
  }, [exercise, workoutHistory, todayWorkoutData]);

  // 🖱️ Tooltip flotante interactivo y enriquecido
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0]?.payload;
    if (!data) return null;

    const isProj = data.isProjected;

    return (
      <div style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '10px 14px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        border: isProj ? '1.5px solid #8b5cf6' : '1.5px solid #334155',
        fontSize: '11px',
        minWidth: '170px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
          <strong style={{ color: isProj ? '#c084fc' : '#38bdf8', fontSize: '11.5px' }}>
            {data.dateFull}
          </strong>
          <span style={{
            fontSize: '9px',
            fontWeight: '900',
            padding: '1px 5px',
            borderRadius: '5px',
            background: isProj ? 'rgba(139, 92, 246, 0.25)' : 'rgba(16, 185, 129, 0.2)',
            color: isProj ? '#d8b4fe' : '#4ade80'
          }}>
            {isProj ? '🔮 META' : '✓ REGISTRO'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {/* Carga */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: '#94a3b8' }}>🏋️ Carga Pico (Top Set):</span>
            <strong style={{ color: isProj ? '#c084fc' : '#60a5fa' }}>
              {(isProj ? data.projectedWeight : data.weight) || '--'} lbs
              {!isProj && data.minWeight && data.minWeight < data.weight ? (
                <span style={{ fontSize: '9px', color: '#94a3b8', marginLeft: '4px' }}>(mín {data.minWeight}#)</span>
              ) : null}
            </strong>
          </div>

          {/* Repeticiones */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: '#94a3b8' }}>⚡ Reps ({repsMode === 'avg' ? 'Promedio' : 'Top Set'}):</span>
            <strong style={{ color: '#4ade80' }}>
              {(isProj ? data.projectedReps : (repsMode === 'avg' ? data.avgReps : data.reps)) || '--'} reps
              {(data.reps >= 8 && data.reps <= 12) && (
                <span style={{ fontSize: '9px', color: '#86efac', marginLeft: '3px' }}>(Hipertrofia)</span>
              )}
            </strong>
          </div>

          {/* Rango y Promedio de la Sesión */}
          {!isProj && data.setsCount > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '9.5px', color: '#cbd5e1' }}>
              <span style={{ color: '#94a3b8' }}>📊 Rango en Sesión:</span>
              <span>
                Mín <strong>{data.minReps}</strong> — Máx <strong>{data.maxReps}</strong> (Prom: <strong style={{ color: '#a7f3d0' }}>{data.avgReps}</strong>)
              </span>
            </div>
          )}

          {/* 1RM */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: '#94a3b8' }}>🏆 1RM Estimado (Epley):</span>
            <strong style={{ color: '#38bdf8' }}>
              {(isProj ? data.projected1RM : data.est1RM) || '--'} lbs
            </strong>
          </div>

          {/* Volumen y Conteo de Series */}
          {!isProj && data.setsCount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '9.5px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '3px' }}>
              <span>📦 Volumen ({data.setsCount} series):</span>
              <span style={{ color: '#f1f5f9', fontWeight: '700' }}>{data.volume ? data.volume.toLocaleString() : '--'} lbs</span>
            </div>
          )}

          {/* Desglose de cada serie registrada en esa sesión */}
          {!isProj && Array.isArray(data.detailedSets) && data.detailedSets.length > 0 && (
            <div style={{ marginTop: '3px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '4px' }}>
              <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginBottom: '2px', fontWeight: '800' }}>
                📋 Desglose de Series:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {data.detailedSets.map((s, sIdx) => {
                  const isTop = s.weight === data.weight && s.reps === data.reps;
                  return (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '9px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: isTop ? 'rgba(0, 102, 255, 0.35)' : 'rgba(255,255,255,0.08)',
                        color: isTop ? '#93c5fd' : '#cbd5e1',
                        border: isTop ? '1px solid #3b82f6' : '1px solid transparent',
                        fontWeight: isTop ? '900' : '600'
                      }}
                    >
                      S{s.setNum || sIdx + 1}: {s.weight}#×{s.reps}{isTop ? ' 🔥' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {isProj && data.projectionNote && (
            <div style={{ marginTop: '4px', fontSize: '9.5px', color: '#a78bfa', fontStyle: 'italic', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '3px' }}>
              💡 {data.projectionNote}
            </div>
          )}
        </div>
      </div>
    );
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
        <TrendingUp size={28} color="#94a3b8" style={{ margin: '0 auto 8px auto', display: 'block' }} />
        <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
          Sin historial suficiente aún
        </strong>
        <span style={{ fontSize: '11px' }}>
          Registra tus series hoy para generar automáticamente la curva de sobrecarga y las proyecciones a 1, 2, 3 y 6 meses.
        </span>
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '1.5px solid #e2e8f0',
      padding: compact ? '12px' : '16px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* 🎛️ FILTRO RÁPIDO & LEYENDA INTERACTIVA */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={16} color="#0066ff" />
          <strong style={{ fontSize: '12px', color: '#0f172a' }}>
            Curva de Sobrecarga & Proyección
          </strong>
        </div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {/* Toggle Carga */}
          <button
            type="button"
            onClick={() => setShowWeight(prev => !prev)}
            style={{
              padding: '3px 8px',
              borderRadius: '8px',
              border: showWeight ? '1.5px solid #0066ff' : '1px solid #cbd5e1',
              background: showWeight ? '#eff6ff' : '#f8fafc',
              color: showWeight ? '#0066ff' : '#94a3b8',
              fontSize: '10px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: showWeight ? '#0066ff' : '#94a3b8' }} />
            Carga (lbs)
          </button>

          {/* Toggle Reps con selector Top Set vs Promedio */}
          <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '8px', border: showReps ? '1.5px solid #10b981' : '1px solid #cbd5e1', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setShowReps(prev => !prev)}
              style={{
                padding: '3px 7px',
                border: 'none',
                background: showReps ? '#ecfdf5' : '#f8fafc',
                color: showReps ? '#059669' : '#94a3b8',
                fontSize: '10px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: showReps ? '#10b981' : '#94a3b8' }} />
              Reps {repsMode === 'avg' ? '(Promedio)' : '(Top Set)'}
            </button>
            {showReps && (
              <button
                type="button"
                title="Cambiar entre Reps de la Mejor Serie (Top Set) y Reps Promedio de la sesión"
                onClick={() => setRepsMode(prev => prev === 'topSet' ? 'avg' : 'topSet')}
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
              >
                🔄 {repsMode === 'topSet' ? 'Top' : 'Prom'}
              </button>
            )}
          </div>

          {/* Toggle 1RM */}
          <button
            type="button"
            onClick={() => setShow1RM(prev => !prev)}
            style={{
              padding: '3px 8px',
              borderRadius: '8px',
              border: show1RM ? '1.5px solid #06b6d4' : '1px solid #cbd5e1',
              background: show1RM ? '#ecfeff' : '#f8fafc',
              color: show1RM ? '#0891b2' : '#94a3b8',
              fontSize: '10px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: show1RM ? '#06b6d4' : '#94a3b8' }} />
            1RM
          </button>

          {/* Toggle Proyecciones */}
          <button
            type="button"
            onClick={() => setShowProjections(prev => !prev)}
            style={{
              padding: '3px 8px',
              borderRadius: '8px',
              border: showProjections ? '1.5px solid #8b5cf6' : '1px solid #cbd5e1',
              background: showProjections ? '#f5f3ff' : '#f8fafc',
              color: showProjections ? '#7c3aed' : '#94a3b8',
              fontSize: '10px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <Sparkles size={11} color={showProjections ? '#7c3aed' : '#94a3b8'} />
            Metas (+1 a +6m)
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
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px dashed #10b981', borderRadius: '3px' }} />
          🟩 Rango Óptimo Hipertrofia (8–12 reps)
        </span>

        {showProjections && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7c3aed' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(139, 92, 246, 0.15)', border: '1px dashed #8b5cf6', borderRadius: '3px' }} />
            🔮 Proyecciones Futuras (1m, 2m, 3m, 6m)
          </span>
        )}
      </div>

      {/* GRÁFICA RECHARTS CON ÁREAS SOMBREADAS TRANSLÚCIDAS Y DOBLE EJE Y */}
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            {/* GRADIENTES TRANSLÚCIDOS */}
            <defs>
              <linearGradient id="gradientWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066ff" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0066ff" stopOpacity={0.02} />
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
              minTickGap={12}
              tick={{ fontSize: 10, fontWeight: '700', fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />

            {/* Eje Y Izquierdo: Carga en lbs */}
            <YAxis
              yAxisId="weight"
              domain={['auto', 'auto']}
              tick={{ fontSize: 10, fontWeight: '700', fill: '#0066ff' }}
              axisLine={{ stroke: '#93c5fd' }}
              tickLine={false}
            />

            {/* Eje Y Derecho: Repeticiones (escala fija para banda de hipertrofia) */}
            <YAxis
              yAxisId="reps"
              orientation="right"
              domain={[0, 20]}
              tick={{ fontSize: 10, fontWeight: '700', fill: '#10b981' }}
              axisLine={{ stroke: '#86efac' }}
              tickLine={false}
            />

            {/* 🟩 BANDA VERDE SOMBREADA DE HIPERTROFIA (8 a 12 reps) */}
            {showReps && (
              <ReferenceArea
                yAxisId="reps"
                y1={8}
                y2={12}
                fill="#10b981"
                fillOpacity={0.12}
                stroke="#10b981"
                strokeDasharray="3 3"
              />
            )}

            {/* 🔮 ZONA SOMBREADA DE PROYECCIONES FUTURAS */}
            {showProjections && transitionDate && lastProjectedDate && (
              <ReferenceArea
                yAxisId="weight"
                x1={transitionDate}
                x2={lastProjectedDate}
                fill="#8b5cf6"
                fillOpacity={0.07}
                stroke="#8b5cf6"
                strokeDasharray="4 4"
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {/* 🌊 CURVA DE CARGA (AZUL CON SOMBREADO) */}
            {showWeight && (
              <Area
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                name="Carga"
                stroke="#0066ff"
                strokeWidth={2.5}
                fill="url(#gradientWeight)"
                dot={{ r: 3.5, fill: '#0066ff', stroke: '#ffffff', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#0066ff' }}
                connectNulls={false}
              />
            )}

            {/* 🌊 CURVA DE REPETICIONES (VERDE CON SOMBREADO) */}
            {showReps && (
              <Area
                yAxisId="reps"
                type="monotone"
                dataKey={repsMode === 'avg' ? 'avgReps' : 'reps'}
                name={repsMode === 'avg' ? 'Reps (Promedio)' : 'Reps (Top Set)'}
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradientReps)"
                dot={{ r: 3, fill: '#10b981', stroke: '#ffffff', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#10b981' }}
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

            {/* 🔮 CURVA DE PROYECCIÓN FUTURA (PÚRPURA DISCONTINUA CON SOMBREADO) */}
            {showProjections && (
              <Area
                yAxisId="weight"
                type="monotone"
                dataKey="projectedWeight"
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
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER INFORMATIVO CON RÉCORD ACTUAL */}
      <div style={{
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '10px',
        color: '#64748b'
      }}>
        <span>
          Carga Actual: <strong style={{ color: '#0066ff' }}>{currentWeight} lbs</strong> • Récord: <strong style={{ color: '#15803d' }}>{peakWeight} lbs</strong>
        </span>
        <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>
          Toca o pasa el cursor para auditar cada punto
        </span>
      </div>
    </div>
  );
}
