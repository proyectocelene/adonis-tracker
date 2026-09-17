import React, { useMemo } from 'react';
import { 
  X, TrendingUp, TrendingDown, Minus, Target, Sparkles, 
  Calendar, Award, Brain, Dumbbell, ShieldCheck, Clock, Zap
} from 'lucide-react';
import { calculate1RM } from '../../hooks/useWorkoutCalculations';
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

  // Extraer todas las sesiones donde se realizó este ejercicio usando el motor universal unificado
  const sessionHistory = useMemo(() => {
    if (!isOpen || !exercise || !exId) return [];
    const records = getHistoricalRecordsForExercise(exercise, workoutHistory);
    const rawOccurrences = records.sessionOccurrences || [];

    return rawOccurrences.map(occ => {
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
    let status = { label: 'Línea Base Inicial', color: '#0066ff', bg: '#eff6ff', tip: 'Continúa registrando series para mapear tu curva de fuerza.' };
    if (delta1RM > 5 || peakWeight > initialWeight) {
      status = { 
        label: '🚀 Sobrecarga Acelerada', 
        color: '#15803d', 
        bg: '#dcfce7', 
        tip: 'Tu sistema neuromuscular está respondiendo óptimamente a la tensión mecánica.' 
      };
    } else if (delta1RM >= 0) {
      status = { 
        label: '📈 Progresión Sólida', 
        color: '#0369a1', 
        bg: '#e0f2fe', 
        tip: 'Mantienes la carga incrementando control excéntrico o repeticiones.' 
      };
    } else {
      status = { 
        label: '⚖️ Consolidación / Back-off', 
        color: '#b45309', 
        bg: '#fef3c7', 
        tip: 'Sesión de descarga o back-off controlada. Tu récord histórico se mantiene protegido.' 
      };
    }

    // Proyecciones científicas: Siguiente sesión, 2 sesiones, 1 mes, 3 meses y 6 meses
    const baselineWeight = Math.max(peakWeight, currentWeight) || 100;
    const baseline1RM = Math.max(peak1RM, current1RM) || 100;
    const safeWeeklyGain = Math.max(1.5, Math.min(5.0, weeklyRateLbs > 0 ? weeklyRateLbs : baselineWeight * 0.015));

    const projNextSessionWeight = Math.round(baselineWeight + Math.max(1, safeWeeklyGain * 0.65));
    const projNextSession1RM = Math.round(baseline1RM + Math.max(1, safeWeeklyGain * 0.65 * 1.1));

    const proj2SessionsWeight = Math.round(baselineWeight + Math.max(2, safeWeeklyGain * 1.3));
    const proj2Sessions1RM = Math.round(baseline1RM + Math.max(2, safeWeeklyGain * 1.3 * 1.1));

    const proj1MonthWeight = Math.round(baselineWeight + (safeWeeklyGain * 4));
    const proj1Month1RM = Math.round(baseline1RM + (safeWeeklyGain * 4 * 1.1));

    const proj3MonthsWeight = Math.round(baselineWeight + (safeWeeklyGain * 12 * 0.85));
    const proj3Months1RM = Math.round(baseline1RM + (safeWeeklyGain * 12 * 0.85 * 1.1));

    const proj6MonthsWeight = Math.round(baselineWeight + (safeWeeklyGain * 24 * 0.7));
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
  }, [sessionHistory, todaySets]);

  if (!isOpen || !exercise) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
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
        background: '#ffffff',
        borderRadius: '26px',
        padding: '22px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
        boxSizing: 'border-box'
      }}>
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}>
              <TrendingUp size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
                  {exName}
                </h3>
                {getUnifiedCodeForExercise(exercise) && (
                  <span style={{ fontSize: '9.5px', background: '#f5f3ff', color: '#7c3aed', padding: '1px 6px', borderRadius: '6px', fontWeight: '800', border: '1px solid #ddd6fe' }}>
                    {getUnifiedCodeForExercise(exercise).canonical}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
                {exercise.muscleGroup || 'General'} • Analítica & Proyección de Fuerza
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {stats ? (
          <div>
            {/* KPI DE FUERZA ACTUAL & ESTADO */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '18px',
              padding: '16px',
              color: '#ffffff',
              marginBottom: '16px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>
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
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block' }}>
                    {stats.peakWeight > stats.currentWeight ? 'Carga Pico (Récord)' : 'Carga Pico Lograda'}
                  </span>
                  <strong style={{ fontSize: '22px', color: '#ffffff', fontWeight: '900' }}>
                    {stats.peakWeight > stats.currentWeight ? stats.peakWeight : stats.currentWeight} <span style={{ fontSize: '12px', color: '#94a3b8' }}>lbs</span>
                  </strong>
                  {stats.peakWeight > stats.currentWeight ? (
                    <span style={{ fontSize: '10.5px', color: '#cbd5e1', display: 'block', fontWeight: '700' }}>
                      Última sesión: {stats.currentWeight} lbs
                    </span>
                  ) : (
                    stats.deltaWeight !== 0 && (
                      <span style={{ fontSize: '11px', color: stats.deltaWeight > 0 ? '#4ade80' : '#f87171', display: 'block', fontWeight: '800' }}>
                        {stats.deltaWeight > 0 ? `+${stats.deltaWeight}` : stats.deltaWeight} lbs ({stats.initialWeight} ➔ {stats.currentWeight})
                      </span>
                    )
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block' }}>
                    {stats.peak1RM > stats.current1RM ? '1RM Máx (Récord)' : '1RM Estimado (Epley)'}
                  </span>
                  <strong style={{ fontSize: '22px', color: '#38bdf8', fontWeight: '900' }}>
                    {stats.peak1RM > stats.current1RM ? stats.peak1RM : stats.current1RM} <span style={{ fontSize: '12px', color: '#94a3b8' }}>lbs</span>
                  </strong>
                  <span style={{ fontSize: '10.5px', color: '#cbd5e1', display: 'block' }}>
                    {stats.peak1RM > stats.current1RM ? `Última: ${stats.current1RM} lbs | ` : ''}Tasa: ~+{stats.weeklyRateLbs} lbs/sem
                  </span>
                </div>
              </div>

              <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                💡 <strong>Diagnóstico:</strong> {stats.status.tip}
              </p>
            </div>

            {/* SECCIÓN DE PREVISIONES Y PROYECCIONES CIENTÍFICAS */}
            <div style={{
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
              border: '1.5px solid #c4b5fd',
              borderRadius: '18px',
              padding: '14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Brain size={18} color="#7c3aed" />
                <strong style={{ fontSize: '12.5px', color: '#5b21b6' }}>
                  Previsiones Científicas de Fuerza Adonis
                </strong>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#6d28d9', lineHeight: '1.35' }}>
                Basadas en tu tasa actual de adaptación miofibrilar y sobrecarga progresiva sin fallar la técnica:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {/* 1. Siguiente Sesión */}
                <div style={{ background: '#ffffff', padding: '9px 10px', borderRadius: '12px', border: '1.5px solid #a7f3d0' }}>
                  <span style={{ fontSize: '9.5px', color: '#059669', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                    ⚡ Próxima Sesión
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#064e3b', margin: '2px 0' }}>
                    ~{stats.projNextSessionWeight} lbs
                  </div>
                  <span style={{ fontSize: '9px', color: '#64748b' }}>
                    1RM Est: ~{stats.projNextSession1RM} lbs
                  </span>
                </div>

                {/* 2. Siguientes 2 Sesiones */}
                <div style={{ background: '#ffffff', padding: '9px 10px', borderRadius: '12px', border: '1.5px solid #bae6fd' }}>
                  <span style={{ fontSize: '9.5px', color: '#0284c7', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                    🎯 Siguientes 2 Ses
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#0c4a6e', margin: '2px 0' }}>
                    ~{stats.proj2SessionsWeight} lbs
                  </div>
                  <span style={{ fontSize: '9px', color: '#64748b' }}>
                    1RM Est: ~{stats.proj2Sessions1RM} lbs
                  </span>
                </div>

                {/* 3. 1 Mes */}
                <div style={{ background: '#ffffff', padding: '9px 10px', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
                  <span style={{ fontSize: '9.5px', color: '#7c3aed', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                    🚀 Meta a 1 Mes
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#1e1b4b', margin: '2px 0' }}>
                    ~{stats.proj1MonthWeight} lbs
                  </div>
                  <span style={{ fontSize: '9px', color: '#64748b' }}>
                    1RM Est: ~{stats.proj1Month1RM} lbs
                  </span>
                </div>

                {/* 4. 3 Meses */}
                <div style={{ background: '#ffffff', padding: '9px 10px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                  <span style={{ fontSize: '9.5px', color: '#d97706', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                    🏔️ Meta a 3 Meses
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#78350f', margin: '2px 0' }}>
                    ~{stats.proj3MonthsWeight} lbs
                  </div>
                  <span style={{ fontSize: '9px', color: '#64748b' }}>
                    1RM Est: ~{stats.proj3Months1RM} lbs
                  </span>
                </div>

                {/* 5. 6 Meses */}
                <div style={{ background: '#ffffff', padding: '9px 10px', borderRadius: '12px', border: '1.5px solid #fed7aa', gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '9.5px', color: '#ea580c', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                        🏆 Techo Mesociclo a 6 Meses (24 sem)
                      </span>
                      <div style={{ fontSize: '17px', fontWeight: '900', color: '#7c2d12', margin: '2px 0' }}>
                        ~{stats.proj6MonthsWeight} lbs
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', color: '#9a3412', fontWeight: '800', background: '#ffedd5', padding: '2px 8px', borderRadius: '6px' }}>
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
                height={240}
                compact
              />
            </div>

            {/* HISTORIAL SESIÓN POR SESIÓN */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12.5px', fontWeight: '900', color: '#1e293b' }}>
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
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        fontSize: '11px'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#0f172a', display: 'block' }}>
                          {item.dateFormatted || item.date}
                        </strong>
                        <span style={{ color: '#64748b' }}>
                          {item.sets.length} series • Vol: {item.volume.toLocaleString()} lbs
                          {item.matchedName && item.matchedName.toLowerCase() !== exName.toLowerCase() && (
                            <span style={{ display: 'block', color: '#7c3aed', fontSize: '9.5px', fontWeight: '700' }}>
                              ⚡ Vinculado con: {item.matchedName}
                            </span>
                          )}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0066ff', fontSize: '13px' }}>
                          {item.maxWeight} lbs × {item.maxReps}
                        </strong>
                        <span style={{ display: 'block', fontSize: '10px', color: '#10b981', fontWeight: '800' }}>
                          1RM: {item.est1RM} lbs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                  Aún no hay sesiones archivadas con este ejercicio. ¡Guarda tu primera sesión hoy!
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b' }}>
            <Dumbbell size={36} color="#cbd5e1" style={{ margin: '0 auto 10px auto' }} />
            <h4 style={{ margin: '0 0 6px 0', color: '#1e293b' }}>Sin datos de fuerza registrados</h4>
            <p style={{ fontSize: '12px', margin: 0 }}>
              Completa al menos una serie en este ejercicio para calcular tu 1RM y desbloquear las previsiones de sobrecarga.
            </p>
          </div>
        )}

        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
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
