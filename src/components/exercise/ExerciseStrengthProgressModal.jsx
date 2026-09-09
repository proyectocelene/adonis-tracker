import React, { useMemo } from 'react';
import { 
  X, TrendingUp, TrendingDown, Minus, Target, Sparkles, 
  Calendar, Award, Brain, Dumbbell, ShieldCheck, Clock, Zap
} from 'lucide-react';
import { calculate1RM } from '../../hooks/useWorkoutCalculations';

export default function ExerciseStrengthProgressModal({
  isOpen,
  onClose,
  exercise,
  workoutHistory = [],
  todayWorkoutData = {},
  machineConfig = null
}) {
  if (!isOpen || !exercise) return null;

  const exId = exercise.id;
  const exName = exercise.name;

  // Extraer todas las sesiones donde se realizó este ejercicio
  const sessionHistory = useMemo(() => {
    const list = [];

    (workoutHistory || []).forEach(session => {
      if (session.isRestDay || session.isMissedDay || !session.exercises) return;

      const exLog = session.exercises[exId];
      if (!exLog) return;

      const completedSets = [];
      let maxW = 0;
      let maxR = 0;
      let max1RM = 0;
      let sessionVol = 0;

      Object.keys(exLog).forEach(k => {
        const num = parseInt(k, 10);
        if (!isNaN(num) && exLog[k] && exLog[k].completed) {
          const w = parseFloat(exLog[k].weight) || 0;
          const r = parseInt(exLog[k].reps, 10) || 0;
          const epley = calculate1RM(w, r);
          sessionVol += (w * r);

          if (w > maxW) { maxW = w; maxR = r; }
          if (epley > max1RM) max1RM = epley;

          completedSets.push({
            setNum: num,
            weight: w,
            reps: r,
            repsL: exLog[k].repsL,
            repsR: exLog[k].repsR,
            rpe: exLog[k].rpe,
            est1RM: epley
          });
        }
      });

      if (completedSets.length > 0) {
        list.push({
          sessionId: session.id,
          date: session.date || (session.timestamp ? session.timestamp.split('T')[0] : ''),
          dateFormatted: session.dateString || session.date,
          maxWeight: maxW,
          maxReps: maxR,
          est1RM: max1RM,
          volume: sessionVol,
          sets: completedSets.sort((a, b) => a.setNum - b.setNum)
        });
      }
    });

    // Ordenar cronológicamente ascendente
    list.sort((a, b) => new Date(a.date) - new Date(b.date));

    return list;
  }, [workoutHistory, exId]);

  // Sesión actual en progreso si tiene series marcadas hoy
  const todaySets = useMemo(() => {
    const exLog = todayWorkoutData[exId];
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
        const epley = calculate1RM(w, r);
        if (w > maxW) { maxW = w; maxR = r; }
        if (epley > max1RM) max1RM = epley;
        sets.push({ num, weight: w, reps: r, epley });
      }
    });

    if (sets.length === 0) return null;
    return { maxWeight: maxW, maxReps: maxR, est1RM: max1RM, count: sets.length };
  }, [todayWorkoutData, exId]);

  // Métricas estadísticas y tendencias
  const stats = useMemo(() => {
    if (sessionHistory.length === 0 && !todaySets) {
      return null;
    }

    const first = sessionHistory.length > 0 ? sessionHistory[0] : todaySets;
    const latest = todaySets || sessionHistory[sessionHistory.length - 1];

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
      weeklyRateLbs = Math.round(currentWeight * 0.015 * 10) / 10; // Tasa esperada ~1.5% semanal
    }

    // Diagnóstico del estado de sobrecarga
    let status = { label: 'Línea Base Inicial', color: '#0066ff', bg: '#eff6ff', tip: 'Continúa registrando series para mapear tu curva de fuerza.' };
    if (delta1RM > 5) {
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
        label: '⚖️ Consolidación / Fatiga', 
        color: '#b45309', 
        bg: '#fef3c7', 
        tip: 'Pequeña fluctuación de fuerza. Cuida el sueño y los carbohidratos previos.' 
      };
    }

    // Proyecciones a 4 y 8 semanas basadas en tasa fisiológica
    const baselineWeight = currentWeight || 100;
    const safeWeeklyGain = Math.max(1.5, Math.min(5.0, weeklyRateLbs > 0 ? weeklyRateLbs : baselineWeight * 0.01));

    const proj4WeeksWeight = Math.round(baselineWeight + (safeWeeklyGain * 4));
    const proj8WeeksWeight = Math.round(baselineWeight + (safeWeeklyGain * 8));

    const proj4Weeks1RM = Math.round(current1RM + (safeWeeklyGain * 4 * 1.1));
    const proj8Weeks1RM = Math.round(current1RM + (safeWeeklyGain * 8 * 1.1));

    return {
      totalSessions: sessionHistory.length + (todaySets ? 1 : 0),
      currentWeight,
      current1RM,
      initialWeight,
      initial1RM,
      deltaWeight,
      delta1RM,
      weeklyRateLbs,
      status,
      proj4WeeksWeight,
      proj8WeeksWeight,
      proj4Weeks1RM,
      proj8Weeks1RM
    };
  }, [sessionHistory, todaySets]);

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
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
                {exName}
              </h3>
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
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block' }}>Carga Pico Lograda</span>
                  <strong style={{ fontSize: '22px', color: '#ffffff', fontWeight: '900' }}>
                    {stats.currentWeight} <span style={{ fontSize: '12px', color: '#94a3b8' }}>lbs</span>
                  </strong>
                  {stats.deltaWeight !== 0 && (
                    <span style={{ fontSize: '11px', color: stats.deltaWeight > 0 ? '#4ade80' : '#f87171', display: 'block', fontWeight: '800' }}>
                      {stats.deltaWeight > 0 ? `+${stats.deltaWeight}` : stats.deltaWeight} lbs ({stats.initialWeight} ➔ {stats.currentWeight})
                    </span>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block' }}>1RM Estimado (Epley)</span>
                  <strong style={{ fontSize: '22px', color: '#38bdf8', fontWeight: '900' }}>
                    {stats.current1RM} <span style={{ fontSize: '12px', color: '#94a3b8' }}>lbs</span>
                  </strong>
                  <span style={{ fontSize: '10.5px', color: '#cbd5e1', display: 'block' }}>
                    Tasa: ~+{stats.weeklyRateLbs} lbs/sem
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Brain size={16} color="#7c3aed" />
                <strong style={{ fontSize: '13px', color: '#5b21b6', fontWeight: '900' }}>
                  Previsiones Científicas de Fuerza Adonis
                </strong>
              </div>
              <p style={{ fontSize: '11px', color: '#6d28d9', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                Basadas en tu tasa actual de adaptación miofibrilar y sobrecarga progresiva sin fallar la técnica:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
                  <div style={{ fontSize: '10px', color: '#7c3aed', fontWeight: '800', textTransform: 'uppercase' }}>
                    🎯 Meta a 4 Semanas
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#4c1d95', margin: '2px 0' }}>
                    ~{stats.proj4WeeksWeight} lbs
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    1RM Est: ~{stats.proj4Weeks1RM} lbs
                  </span>
                </div>

                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
                  <div style={{ fontSize: '10px', color: '#7c3aed', fontWeight: '800', textTransform: 'uppercase' }}>
                    🚀 Meta a 8 Semanas
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#4c1d95', margin: '2px 0' }}>
                    ~{stats.proj8WeeksWeight} lbs
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    1RM Est: ~{stats.proj8Weeks1RM} lbs
                  </span>
                </div>
              </div>
            </div>

            {/* HISTORIAL SESIÓN POR SESIÓN */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12.5px', fontWeight: '900', color: '#1e293b' }}>
                📅 Historial de Sesiones Registradas ({sessionHistory.length})
              </h4>

              {sessionHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
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
