import React, { useMemo } from 'react';
import { 
  X, TrendingUp, TrendingDown, Minus, Target, Sparkles, 
  Calendar, Award, Brain, Dumbbell, ShieldCheck, Clock, Zap
} from 'lucide-react';
import { calculate1RM, roundToAttainableWeight } from '../../hooks/useWorkoutCalculations';
import { matchExercise, getHistoricalRecordsForExercise, getUnifiedCodeForExercise } from '../../utils/exerciseMatcher';
import ExerciseProgressionChart from './ExerciseProgressionChart';

export default function ExerciseStrengthProgressModal({
  isOpen,
  onClose,
  exercise,
  workoutHistory = [],
  todayWorkoutData = {},
  machineConfig = null
}) {
  const exId = exercise?.id;
  const exName = exercise?.name || '';

  // Extraer todas las sesiones donde se realizó este ejercicio usando el motor universal unificado con fallback inteligente
  const { sessionHistory, isFamilyFallback } = useMemo(() => {
    if (!isOpen || !exercise || !exId) return { sessionHistory: [], isFamilyFallback: false };
    const records = getHistoricalRecordsForExercise(exercise, workoutHistory, { matchFamily: true, autoFallback: true });
    const rawOccurrences = records.sessionOccurrences || [];

    const history = rawOccurrences.map(occ => {
      let max1RM = 0;
      let sessionVol = 0;

      (occ.detailedSets || []).forEach(s => {
        const w = s.weight || 0;
        const r = s.reps || 0;
        const epley = calculate1RM(w, r);
        sessionVol += (w * r);
        if (epley > max1RM) max1RM = epley;
      });

      return {
        sessionId: occ.sessionId,
        date: occ.dateStr,
        dateFormatted: occ.dateStr,
        maxWeight: occ.maxWeight,
        maxReps: occ.bestReps,
        est1RM: max1RM,
        volume: sessionVol,
        matchedName: occ.sourceName,
        sets: occ.detailedSets || []
      };
    });

    return {
      sessionHistory: history,
      isFamilyFallback: Boolean(records.isFamilyFallback)
    };
  }, [workoutHistory, exId, exercise, isOpen]);

  // Sesión actual en progreso si tiene series marcadas hoy
  const todaySets = useMemo(() => {
    let exLog = todayWorkoutData[exId];
    if (!exLog) {
      for (const [candKey, candData] of Object.entries(todayWorkoutData || {})) {
        if (!candData || candData.machine) continue;
        const matchRes = matchExercise(exercise, candKey, candData);
        if (matchRes.isMatch) {
          exLog = candData;
          break;
        }
      }
    }
    if (!exLog) return null;

    let maxW = 0;
    let maxR = 0;
    let max1RM = 0;
    const sets = [];

    Object.keys(exLog).forEach(k => {
      const num = parseInt(k, 10);
      if (!isNaN(num) && exLog[k] && exLog[k].completed) {
        const w = parseFloat(exLog[k].weight) || 0;
        const r = parseInt(exLog[k].reps, 10) || 0;
        const label = (exLog[k].label || '').toLowerCase();
        const isWarmup = exLog[k].isWarmup === true || num <= 0 || label.startsWith('c') || label.includes('calentamiento') || label.includes('aprox');
        if (!isWarmup && w > 0 && r > 0) {
          const epley = calculate1RM(w, r);
          if (w > maxW) { maxW = w; maxR = r; }
          if (epley > max1RM) max1RM = epley;
          sets.push({ num, weight: w, reps: r, epley });
        }
      }
    });

    if (sets.length === 0 || maxW <= 0) return null;
    return { maxWeight: maxW, maxReps: maxR, est1RM: max1RM, count: sets.length };
  }, [todayWorkoutData, exId, exercise]);

  // Métricas estadísticas y tendencias
  const stats = useMemo(() => {
    if (sessionHistory.length === 0 && !todaySets) {
      return null;
    }

    const first = sessionHistory.length > 0 ? sessionHistory[0] : todaySets;
    const latest = todaySets || sessionHistory[sessionHistory.length - 1];

    // Carga pico histórica real (Récord absoluto de la serie histórica y de hoy)
    let peakWeight = 0;
    let peak1RM = 0;
    sessionHistory.forEach(s => {
      if (s.maxWeight > peakWeight) peakWeight = s.maxWeight;
      if (s.est1RM > peak1RM) peak1RM = s.est1RM;
    });
    if (todaySets) {
      if (todaySets.maxWeight > peakWeight) peakWeight = todaySets.maxWeight;
      if (todaySets.est1RM > peak1RM) peak1RM = todaySets.est1RM;
    }

    const initial1RM = first.est1RM || first.maxWeight || 0;
    const current1RM = latest.est1RM || latest.maxWeight || 0;
    const delta1RM = current1RM - initial1RM;

    const initialWeight = first.maxWeight || 0;
    const currentWeight = latest.maxWeight || 0;
    const deltaWeight = currentWeight - initialWeight;

    // Calcular velocidad semanal si hay al menos 2 sesiones con diferencia de fecha
    let weeklyRateLbs = 0;
    if (sessionHistory.length >= 2) {
      const d1 = new Date(sessionHistory[0].date);
      const d2 = new Date(sessionHistory[sessionHistory.length - 1].date);
      const diffWeeks = Math.max(1, (d2 - d1) / (1000 * 60 * 60 * 24 * 7));
      weeklyRateLbs = Math.round((delta1RM / diffWeeks) * 10) / 10;
    } else {
      weeklyRateLbs = Math.round((peakWeight || currentWeight) * 0.015 * 10) / 10; // Tasa esperada ~1.5% semanal
    }

    // Diagnóstico del estado de sobrecarga
    let status = { label: 'Línea Base Inicial', color: 'var(--accent-blue)', bg: 'var(--accent-blue-light)', tip: 'Continúa registrando series para mapear tu curva de fuerza.' };
    if (delta1RM > 5 || peakWeight > initialWeight) {
      status = { 
        label: '🚀 Sobrecarga Acelerada', 
        color: 'var(--accent-emerald)', 
        bg: 'var(--accent-emerald-subtle)', 
        tip: 'Tu sistema neuromuscular está respondiendo óptimamente a la tensión mecánica.' 
      };
    } else if (delta1RM >= 0) {
      status = { 
        label: '📈 Progresión Sólida', 
        color: 'var(--accent-blue)', 
        bg: 'var(--accent-blue-light)', 
        tip: 'Mantienes la carga incrementando control excéntrico o repeticiones.' 
      };
    } else {
      status = { 
        label: '⚖️ Consolidación / Back-off', 
        color: 'var(--accent-amber)', 
        bg: 'var(--accent-amber-subtle)', 
        tip: 'Sesión de descarga o back-off controlada. Tu récord histórico se mantiene protegido.' 
      };
    }

    // Proyecciones científicas: Siguiente sesión, 2 sesiones, 1 mes, 3 meses y 6 meses
    const baselineWeight = Math.max(peakWeight, currentWeight) || 100;
    const baseline1RM = Math.max(peak1RM, current1RM) || 100;
    const safeWeeklyGain = Math.max(1.5, Math.min(5.0, weeklyRateLbs > 0 ? weeklyRateLbs : baselineWeight * 0.015));

    const rawNextW = baselineWeight + Math.max(1, safeWeeklyGain * 0.65);
    const projNextSessionWeight = roundToAttainableWeight(rawNextW, machineConfig);
    const projNextSession1RM = Math.round(baseline1RM + Math.max(1, safeWeeklyGain * 0.65 * 1.1));

    const raw2SesW = baselineWeight + Math.max(2, safeWeeklyGain * 1.3);
    const proj2SessionsWeight = roundToAttainableWeight(raw2SesW, machineConfig);
    const proj2Sessions1RM = Math.round(baseline1RM + Math.max(2, safeWeeklyGain * 1.3 * 1.1));

    const raw1MW = baselineWeight + (safeWeeklyGain * 4);
    const proj1MonthWeight = roundToAttainableWeight(raw1MW, machineConfig);
    const proj1Month1RM = Math.round(baseline1RM + (safeWeeklyGain * 4 * 1.1));

    const raw3MW = baselineWeight + (safeWeeklyGain * 12 * 0.85);
    const proj3MonthsWeight = roundToAttainableWeight(raw3MW, machineConfig);
    const proj3Months1RM = Math.round(baseline1RM + (safeWeeklyGain * 12 * 0.85 * 1.1));

    const raw6MW = baselineWeight + (safeWeeklyGain * 24 * 0.7);
    const proj6MonthsWeight = roundToAttainableWeight(raw6MW, machineConfig);
    const proj6Months1RM = Math.round(baseline1RM + (safeWeeklyGain * 24 * 0.7 * 1.1));

    return {
      totalSessions: sessionHistory.length + (todaySets ? 1 : 0),
      currentWeight,
      current1RM,
      peakWeight,
      peak1RM,
      initialWeight,
      initial1RM,
      deltaWeight,
      delta1RM,
      weeklyRateLbs,
      status,
      projNextSessionWeight,
      projNextSession1RM,
      proj2SessionsWeight,
      proj2Sessions1RM,
      proj1MonthWeight,
      proj1Month1RM,
      proj3MonthsWeight,
      proj3Months1RM,
      proj6MonthsWeight,
      proj6Months1RM
    };
  }, [sessionHistory, todaySets, machineConfig]);

  if (!isOpen || !exercise) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px'
    }}>
      <div className="card animate-fade" style={{
        maxWidth: '460px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '20px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-ios)',
        boxSizing: 'border-box'
      }}>
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
            }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-main)' }}>
                  {exName}
                </h3>
                {getUnifiedCodeForExercise(exercise) && (
                  <span className="font-mono-tech" style={{ fontSize: '9.5px', background: 'var(--bg-surface-secondary)', color: 'var(--accent-cyan)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800', border: '1px solid var(--border-subtle)' }}>
                    {getUnifiedCodeForExercise(exercise).canonical}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                {exercise.muscleGroup || 'General'} • Analítica & Proyección de Fuerza
              </span>
              {getUnifiedCodeForExercise(exercise)?.machineKey && (
                <div style={{
                  marginTop: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  fontSize: '9.5px',
                  color: '#c4b5fd',
                  fontWeight: '800'
                }}>
                  <Sparkles size={11} color="#a78bfa" />
                  Motor inteligente: Familia {getUnifiedCodeForExercise(exercise)?.machineKey}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={16} />
          </button>
        </div>

        {stats ? (
          <div>
            {/* KPI DE FUERZA ACTUAL & ESTADO */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '18px',
              padding: '16px',
              color: 'var(--text-main)',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-ios-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>
                  Fuerza Máxima Actual
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '900',
                  background: stats.status.bg,
                  color: stats.status.color,
                  padding: '2px 8px',
                  borderRadius: '8px'
                }}>
                  {stats.status.label}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>
                    {stats.peakWeight > stats.currentWeight ? 'Carga Pico (Récord)' : 'Carga Pico Lograda'}
                  </span>
                  <strong className="font-mono-tech" style={{ fontSize: '22px', color: 'var(--text-main)', fontWeight: '900' }}>
                    {stats.peakWeight > stats.currentWeight ? stats.peakWeight : stats.currentWeight} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>lbs</span>
                  </strong>
                  {stats.peakWeight > stats.currentWeight ? (
                    <span className="font-mono-tech" style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'block', fontWeight: '700' }}>
                      Última sesión: {stats.currentWeight} lbs
                    </span>
                  ) : (
                    stats.deltaWeight !== 0 && (
                      <span className="font-mono-tech" style={{ fontSize: '11px', color: stats.deltaWeight > 0 ? 'var(--accent-emerald)' : 'var(--accent-red)', display: 'block', fontWeight: '800' }}>
                        {stats.deltaWeight > 0 ? `+${stats.deltaWeight}` : stats.deltaWeight} lbs ({stats.initialWeight} ➔ {stats.currentWeight})
                      </span>
                    )
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>
                    {stats.peak1RM > stats.current1RM ? '1RM Máx (Récord)' : '1RM Estimado (Epley)'}
                  </span>
                  <strong className="font-mono-tech" style={{ fontSize: '22px', color: 'var(--accent-cyan)', fontWeight: '900' }}>
                    {stats.peak1RM > stats.current1RM ? stats.peak1RM : stats.current1RM} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>lbs</span>
                  </strong>
                  <span className="font-mono-tech" style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'block' }}>
                    {stats.peak1RM > stats.current1RM ? `Última: ${stats.current1RM} lbs | ` : ''}Tasa: ~+{stats.weeklyRateLbs} lbs/sem
                  </span>
                </div>
              </div>

              <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                💡 <strong>Diagnóstico:</strong> {stats.status.tip}
              </p>
            </div>

            {/* SECCIÓN DE PREVISIONES Y PROYECCIONES CIENTÍFICAS */}
            <div style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '18px',
              padding: '14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Brain size={18} color="#a78bfa" />
                <strong style={{ fontSize: '12.5px', color: '#c4b5fd' }}>
                  Previsiones Científicas de Fuerza Adonis
                </strong>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.35' }}>
                Basadas en tu tasa actual de adaptación miofibrilar y sobrecarga progresiva sin fallar la técnica:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {/* 1. Siguiente Sesión */}
                <div style={{ background: 'var(--bg-card)', padding: '9px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '9.5px', color: 'var(--accent-emerald)', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                    ⚡ Próxima Sesión
                  </span>
                  <div className="font-mono-tech" style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', margin: '2px 0' }}>
                    ~{stats.projNextSessionWeight} lbs
                  </div>
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    1RM Est: ~{stats.projNextSession1RM} lbs
                  </span>
                </div>

                {/* 2. Siguientes 2 Sesiones */}
                <div style={{ background: 'var(--bg-card)', padding: '9px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '9.5px', color: 'var(--accent-cyan)', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                    🎯 Siguientes 2 Ses
                  </span>
                  <div className="font-mono-tech" style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', margin: '2px 0' }}>
                    ~{stats.proj2SessionsWeight} lbs
                  </div>
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    1RM Est: ~{stats.proj2Sessions1RM} lbs
                  </span>
                </div>

                {/* 3. 1 Mes */}
                <div style={{ background: 'var(--bg-card)', padding: '9px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '9.5px', color: '#a78bfa', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                    🚀 Meta a 1 Mes
                  </span>
                  <div className="font-mono-tech" style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', margin: '2px 0' }}>
                    ~{stats.proj1MonthWeight} lbs
                  </div>
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    1RM Est: ~{stats.proj1Month1RM} lbs
                  </span>
                </div>

                {/* 4. 3 Meses */}
                <div style={{ background: 'var(--bg-card)', padding: '9px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '9.5px', color: 'var(--accent-amber)', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                    🏔️ Meta a 3 Meses
                  </span>
                  <div className="font-mono-tech" style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', margin: '2px 0' }}>
                    ~{stats.proj3MonthsWeight} lbs
                  </div>
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    1RM Est: ~{stats.proj3Months1RM} lbs
                  </span>
                </div>

                {/* 5. 6 Meses */}
                <div style={{ background: 'var(--bg-card)', padding: '9px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)', gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '9.5px', color: '#fb923c', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                        🏆 Techo Mesociclo a 6 Meses (24 sem)
                      </span>
                      <div className="font-mono-tech" style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-main)', margin: '2px 0' }}>
                        ~{stats.proj6MonthsWeight} lbs
                      </div>
                    </div>
                    <span className="font-mono-tech" style={{ fontSize: '10px', color: '#fb923c', fontWeight: '800', background: 'rgba(251, 146, 60, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                      1RM Est: ~{stats.proj6Months1RM} lbs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICA INTERACTIVA DE SOBRECARGA, HIPERTROFIA Y PROYECCIONES */}
            <div style={{ marginBottom: '16px' }}>
              <ExerciseProgressionChart
                exercise={exercise}
                workoutHistory={workoutHistory}
                todayWorkoutData={todayWorkoutData}
                machineConfig={machineConfig}
                height={240}
                compact
              />
            </div>

            {/* HISTORIAL SESIÓN POR SESIÓN */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12.5px', fontWeight: '900', color: 'var(--text-main)' }}>
                📅 Historial de Sesiones Registradas ({sessionHistory.length})
              </h4>

              {sessionHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                  {sessionHistory.slice().reverse().map((item, idx) => (
                    <div
                      key={item.sessionId || idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        borderRadius: '12px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '11px'
                      }}
                    >
                      <div>
                        <strong className="font-mono-tech" style={{ color: 'var(--text-main)', display: 'block' }}>
                          {item.dateFormatted || item.date}
                        </strong>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {item.sets.length} series • Vol: <span className="font-mono-tech">{item.volume.toLocaleString()}</span> lbs
                          {item.matchedName && item.matchedName.toLowerCase() !== exName.toLowerCase() && (
                            <span style={{ display: 'block', color: '#c4b5fd', fontSize: '9.5px', fontWeight: '700' }}>
                              ⚡ Vinculado con: {item.matchedName}
                            </span>
                          )}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <strong className="font-mono-tech" style={{ color: 'var(--accent-blue)', fontSize: '13px' }}>
                          {item.maxWeight} lbs × {item.maxReps}
                        </strong>
                        <span className="font-mono-tech" style={{ display: 'block', fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '800' }}>
                          1RM: {item.est1RM} lbs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Aún no hay sesiones archivadas con este ejercicio. ¡Guarda tu primera sesión hoy!
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
            <Dumbbell size={36} color="var(--border-strong)" style={{ margin: '0 auto 10px auto' }} />
            <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-main)' }}>Sin datos de fuerza registrados</h4>
            <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-secondary)' }}>
              Completa al menos una serie en este ejercicio para calcular tu 1RM y desbloquear las previsiones de sobrecarga.
            </p>
          </div>
        )}

        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              background: 'var(--bg-surface-secondary)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              fontWeight: '900',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Cerrar Analítica
          </button>
        </div>
      </div>
    </div>
  );
}
