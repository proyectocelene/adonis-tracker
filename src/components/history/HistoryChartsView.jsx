import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Dumbbell, Info, Flame, Calendar } from 'lucide-react';
import ConsistencyHeatmap from '../ConsistencyHeatmap';
import ExerciseConsistencyAudit from './ExerciseConsistencyAudit';
import { LiquidDropdown } from '../common/UIComponents';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { calculateWorkoutCalories } from '../../utils/calorieCalculations';
import ExerciseProgressionChart from '../exercise/ExerciseProgressionChart';

export default function HistoryChartsView({
  totalSessions = 0,
  totalVolumeLifted = 0,
  globalAverageRPE = '0.0',
  workoutHistory = [],
  analysisMode,
  setAnalysisMode,
  selectedExId,
  setSelectedExId,
  selectedMuscleGroup,
  setSelectedMuscleGroup,
  exerciseOptions = [],
  muscleGroupOptions = [],
  progData = [],
  allAvailableExercises = []
}) {
  const totalCaloriesBurned = useMemo(() => {
    return (workoutHistory || []).reduce((acc, ses) => {
      if (ses.isRestDay || ses.isMissedDay) return acc;
      if (ses.calories?.totalKcal) return acc + ses.calories.totalKcal;
      if (ses.exercises) {
        const calc = calculateWorkoutCalories(ses.exercises);
        return acc + calc.totalKcal;
      }
      return acc;
    }, 0);
  }, [workoutHistory]);

  const selectedExObj = useMemo(() => {
    if (!selectedExId) return null;
    return (allAvailableExercises || []).find(e => e.id === selectedExId) || { id: selectedExId, name: selectedExId };
  }, [selectedExId, allAvailableExercises]);

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

  const [muscleTimeframe, setMuscleTimeframe] = useState(() => {
    try {
      return localStorage.getItem('coachv2_muscle_chart_timeframe') || '10ses';
    } catch (e) {
      return '10ses';
    }
  });

  const handleSetMuscleTimeframe = (tf) => {
    setMuscleTimeframe(tf);
    try {
      localStorage.setItem('coachv2_muscle_chart_timeframe', tf);
    } catch (e) {}
  };

  const filteredProgData = useMemo(() => {
    if (!progData || progData.length === 0) return [];
    if (muscleTimeframe === 'all') return progData;
    if (muscleTimeframe === '5ses') return progData.slice(-5);
    if (muscleTimeframe === '10ses') return progData.slice(-10);

    let count = 10;
    if (muscleTimeframe === '1m') count = 4;
    if (muscleTimeframe === '3m') count = 12;
    if (muscleTimeframe === '6m') count = 24;

    return progData.slice(-Math.min(progData.length, count));
  }, [progData, muscleTimeframe]);

  const dynamicMuscleXInterval = useMemo(() => {
    if (!filteredProgData || filteredProgData.length <= 8) return 0;
    if (filteredProgData.length <= 15) return 1;
    if (filteredProgData.length <= 25) return 2;
    return Math.ceil(filteredProgData.length / 6);
  }, [filteredProgData?.length]);

  const muscleYDomain = useMemo(() => {
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
        return Math.max(0, Math.floor((dataMin * 0.85) / 5) * 5);
      },
      (dataMax) => {
        if (!isFinite(dataMax) || dataMax <= 0) return 50;
        return Math.ceil((dataMax * 1.08) / 5) * 5;
      }
    ];
  }, [yAxisScale]);

  return (
    <div className="animate-fade">
      {/* KPIs Clínicos con Gasto Calórico Acumulado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
        <div className="card" style={{ padding: '12px 4px', textAlign: 'center', margin: 0 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Sesiones</span>
          <strong className="font-mono-tech" style={{ fontSize: '19px', color: 'var(--text-main)', display: 'block', margin: '2px 0', fontWeight: '800' }}>{totalSessions}</strong>
          <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '800' }}>Archivadas</span>
        </div>
        
        <div className="card" style={{ padding: '12px 4px', textAlign: 'center', margin: 0, borderTop: '3px solid var(--accent-blue)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Volumen</span>
          <strong className="font-mono-tech" style={{ fontSize: '16px', color: 'var(--accent-blue)', display: 'block', margin: '2px 0', fontWeight: '800' }}>{totalVolumeLifted.toLocaleString()}</strong>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>Lbs-Reps</span>
        </div>

        <div className="card" style={{ padding: '12px 4px', textAlign: 'center', margin: 0, borderTop: '3px solid var(--accent-amber)' }}>
          <span style={{ fontSize: '10px', color: 'var(--accent-amber)', fontWeight: '800', textTransform: 'uppercase' }}>Gasto Kcal</span>
          <strong className="font-mono-tech" style={{ fontSize: '16px', color: 'var(--accent-amber)', display: 'block', margin: '2px 0', fontWeight: '800' }}>{totalCaloriesBurned.toLocaleString()}</strong>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>Kcal Total</span>
        </div>
        
        <div className="card" style={{ padding: '12px 4px', textAlign: 'center', margin: 0 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Intensidad</span>
          <strong className="font-mono-tech" style={{ fontSize: '19px', color: 'var(--accent-amber)', display: 'block', margin: '2px 0', fontWeight: '800' }}>RPE {globalAverageRPE}</strong>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>Medio</span>
        </div>
      </div>

      {/* Heatmap de Consistencia */}
      <ConsistencyHeatmap workoutHistory={workoutHistory} />

      {/* Auditoría de Consistencia & Adherencia por Ejercicio */}
      <ExerciseConsistencyAudit workoutHistory={workoutHistory} />

      {/* Curva Evolutiva por Ejercicio o Grupo Muscular */}
      <div className="card card-highlight" style={{ padding: '18px', marginBottom: '22px', borderRadius: '26px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Dumbbell size={20} color="#0066ff" />
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '900' }}>Analítica de Sobrecarga Progresiva</h2>
            </div>
            <span className="badge badge-blue">1RM & Volumen</span>
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', padding: '4px', borderRadius: '16px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setAnalysisMode('exercise')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px', background: analysisMode === 'exercise' ? 'var(--accent-blue)' : 'transparent', color: analysisMode === 'exercise' ? '#ffffff' : 'var(--text-muted)', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}
            >
              Por Ejercicio Individual
            </button>
            <button
              type="button"
              onClick={() => setAnalysisMode('muscleGroup')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px', background: analysisMode === 'muscleGroup' ? 'var(--accent-blue)' : 'transparent', color: analysisMode === 'muscleGroup' ? '#ffffff' : 'var(--text-muted)', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}
            >
              Por Grupo Muscular
            </button>
          </div>

          {analysisMode === 'exercise' ? (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>
                Selecciona Ejercicio para Auditar Sobrecarga:
              </label>
              <LiquidDropdown
                options={exerciseOptions}
                value={selectedExId}
                onChange={val => setSelectedExId(val)}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>
                  Selecciona Grupo Muscular Objetivo:
                </label>
                {/* Selector de Escala Vertical Eje Y */}
                <div style={{ display: 'inline-flex', background: 'var(--bg-surface-secondary)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => handleSetYAxisScale('dynamic')}
                    style={{
                      padding: '3px 7px',
                      borderRadius: '6px',
                      border: 'none',
                      background: yAxisScale === 'dynamic' ? 'var(--accent-blue)' : 'transparent',
                      color: yAxisScale === 'dynamic' ? '#ffffff' : 'var(--text-muted)',
                      fontWeight: '900',
                      fontSize: '9.5px',
                      cursor: 'pointer',
                      boxShadow: yAxisScale === 'dynamic' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                    }}
                    title="Escala Rango: Enfoca la gráfica en tus cargas reales con holgura fisiológica"
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
                      background: yAxisScale === 'zero' ? 'var(--accent-blue)' : 'transparent',
                      color: yAxisScale === 'zero' ? '#ffffff' : 'var(--text-muted)',
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
              <LiquidDropdown
                options={muscleGroupOptions}
                value={selectedMuscleGroup}
                onChange={val => setSelectedMuscleGroup(val)}
              />
            </div>
          )}

          {/* Gráfica de Progreso */}
          {analysisMode === 'exercise' ? (
            <div style={{ marginTop: '14px' }}>
              <ExerciseProgressionChart
                exercise={selectedExObj}
                workoutHistory={workoutHistory}
                height={280}
              />
            </div>
          ) : (
            progData.length > 0 ? (
              <ErrorBoundary inline>
                {/* 📅 FOCALIZADOR DEL EJE TEMPORAL (GRUPO MUSCULAR) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  marginTop: '10px',
                  marginBottom: '10px',
                  background: '#0a0d14',
                  padding: '5px 8px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="var(--accent-blue)" />
                    <span style={{ fontSize: '10px', fontWeight: '900', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
                      Eje Temporal:
                    </span>
                    <span style={{ fontSize: '9px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
                      {filteredProgData.length} de {progData.length} ses
                    </span>
                  </div>

                  <div style={{ display: 'inline-flex', gap: '2px', background: '#000000', padding: '2px', borderRadius: '8px', border: '1px solid #1e293b', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: '🌐 Desde Siempre', title: 'Ver historial completo desde la primera sesión registrada' },
                      { id: '6m', label: '6M', title: 'Últimos 6 meses' },
                      { id: '3m', label: '3M', title: 'Últimos 3 meses' },
                      { id: '1m', label: '1M', title: 'Último mes' },
                      { id: '10ses', label: '⚡ 10 Ses', title: 'Últimas 10 sesiones' },
                      { id: '5ses', label: '🎯 5 Ses', title: 'Últimas 5 sesiones' }
                    ].map(tf => {
                      const isSel = muscleTimeframe === tf.id;
                      return (
                        <button
                          key={tf.id}
                          type="button"
                          onClick={() => handleSetMuscleTimeframe(tf.id)}
                          style={{
                            padding: '3px 7px',
                            borderRadius: '6px',
                            border: 'none',
                            background: isSel ? 'var(--accent-blue)' : 'transparent',
                            color: isSel ? '#000000' : '#94a3b8',
                            fontWeight: isSel ? '900' : '700',
                            fontSize: '9.5px',
                            cursor: 'pointer',
                            boxShadow: isSel ? '0 1px 6px rgba(56, 189, 248, 0.35)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          title={tf.title}
                        >
                          {tf.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ height: '260px', width: '100%', marginTop: '6px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredProgData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
                      <XAxis dataKey="date" interval={dynamicMuscleXInterval} tick={{ fontSize: 10, fontWeight: '700', fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                      <YAxis domain={muscleYDomain} tick={{ fontSize: 10, fontWeight: '700', fill: 'var(--text-muted)' }} axisLine={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length > 0) {
                            const data = payload[0].payload;
                            return (
                              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '10px 12px', borderRadius: '12px', color: 'var(--text-main)', boxShadow: 'var(--shadow-ios-lg)', fontSize: '11px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                                  <span style={{ fontWeight: '800', color: 'var(--accent-blue)' }}>📅 {data.date}</span>
                                  {data.isDeloadSession && (
                                    <span style={{ background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '900' }}>
                                      🧘 DELOAD
                                    </span>
                                  )}
                                </div>
                                <div style={{ color: 'var(--accent-blue)', fontWeight: '700' }}>Carga Máxima: {data.maxWeight} lbs</div>
                                <div style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>Volumen Grupo: {data.est1RM?.toLocaleString()} lbs-reps</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="maxWeight"
                        name="Carga Máxima"
                        stroke="#1d4ed8"
                        strokeWidth={2.5}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          if (!cx || !cy) return null;
                          const isDense = filteredProgData.length > 18;
                          if (payload?.isDeloadSession) {
                            return (
                              <g key={`dot-deload-${cx}-${cy}`}>
                                <circle cx={cx} cy={cy} r={isDense ? 4.5 : 6} fill="#ecfdf5" stroke="#059669" strokeWidth={isDense ? 1.5 : 2} />
                                <circle cx={cx} cy={cy} r={isDense ? 2 : 2.5} fill="#10b981" />
                              </g>
                            );
                          }
                          return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={isDense ? 2 : 3.5} fill="#1d4ed8" stroke="#ffffff" strokeWidth={isDense ? 1 : 1.5} />;
                        }}
                        activeDot={{ r: 5, fill: '#1d4ed8' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="est1RM"
                        name="Volumen Grupo"
                        stroke="#0891b2"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={filteredProgData.length > 18 ? { r: 1.8, fill: '#0891b2' } : { r: 3, fill: '#0891b2' }}
                        activeDot={{ r: 4.5, fill: '#0891b2' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ErrorBoundary>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                Sin registros suficientes para este grupo muscular en el historial.
              </div>
            )
          )}

          {/* GUÍA CIENTÍFICA: CÓMO INTERPRETAR LA GRÁFICA DE SOBRECARGA */}
          <div style={{
            marginTop: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={15} color="var(--accent-blue)" />
              <strong style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '900' }}>
                Guía Científica: ¿Cómo interpretar tu curva de sobrecarga?
              </strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'var(--accent-blue-light)', padding: '8px 10px', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--accent-blue)' }}>🔵 Línea Azul (Carga Máxima):</strong> Peso pico absoluto utilizado en la sesión. Refleja la tensión mecánica sobre las fibras musculares.
              </div>
              <div style={{ background: 'var(--accent-emerald-subtle)', padding: '8px 10px', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--accent-emerald)' }}>🟢 Línea Punteada Verde (1RM Estimado - Epley):</strong> Tu potencial de fuerza máxima normalizado a 1 repetición (W × [1 + Reps/30]). Permite saber si una sesión de 100 lbs × 12 reps fue fisiológicamente superior a 110 lbs × 8 reps.
              </div>
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-main)' }}>🧠 Lectura de Rendimiento:</strong> Si la línea punteada verde asciende sesión tras sesión, existe <strong>sobrecarga progresiva real</strong> e hipertrofia miofibrilar, incluso si el peso absoluto se mantuvo igual y solo sumaste repeticiones.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
