import React from 'react';
import { X, Brain, Target, AlertTriangle, Clock, Layers, Sparkles } from 'lucide-react';
import { analyzeExercisePerformance, roundToAttainableWeight } from '../../hooks/useWorkoutCalculations';

export default function OverloadScienceModal({
  isOpen,
  onClose,
  exercise = null,
  exerciseName = '',
  totalSets = 3,
  isDeloadMode = false,
  targetReps = '10-12',
  previousData = {},
  todayWorkoutData = {},
  machineConfig = null
}) {
  if (!isOpen) return null;

  const analysis = analyzeExercisePerformance(previousData, targetReps, machineConfig, { exercise });
  const unified = analysis.unifiedTarget;

  const prevSetKeys = Object.keys(previousData || {}).map(k => parseInt(k, 10)).filter(n => !isNaN(n) && n > 0);
  const todaySetKeys = Object.keys(todayWorkoutData || {}).map(k => parseInt(k, 10)).filter(n => !isNaN(n) && n > 0);
  const prescribedSetsCount = Math.max(1, parseInt(totalSets || exercise?.sets, 10) || 3);
  const maxSetNum = Math.max(prescribedSetsCount, ...prevSetKeys, ...todaySetKeys);
  const setNumbers = Array.from({ length: maxSetNum }, (_, i) => i + 1);

  const machineTypeLabel = machineConfig?.type === 'plates'
    ? 'Prensa / Discos por Lado'
    : (machineConfig?.type === 'stack' ? 'Torre de Placas' : (machineConfig?.type === 'dumbbells' ? 'Mancuernas' : 'Máquina Guiada'));
  const machineLocation = machineConfig?.station || machineConfig?.floor || '';
  const minIncrement = unified?.increment || analysis.increment || 5;
  const maxRepsVal = unified?.maxReps || 12;

  const formulaLabel = isDeloadMode
    ? 'Modo Deload (80%)'
    : !unified?.hasData
    ? 'Calibración Inicial'
    : unified.strategyType === 'reactivation'
    ? 'Reactivación (>21 días sin registro)'
    : unified.progressionMode === 'dynamic'
    ? `Doble Progresión Dinámica por serie · paso ±${minIncrement} lbs (≥8%)`
    : `Doble Progresión Clásica · paso ±${minIncrement} lbs (<8%)`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '16px',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          maxWidth: '460px',
          width: '100%',
          margin: 'auto 0',
          boxShadow: 'var(--shadow-ios)',
          padding: '18px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA CON BOTÓN X */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-blue) 0%, #0284c7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
              flexShrink: 0
            }}>
              <Brain size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.2' }}>
                Entrenador Inteligente
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>
                  {exerciseName || exercise?.name}
                </span>
                {machineLocation && (
                  <span style={{ fontSize: '9.5px', background: 'var(--bg-surface-secondary)', color: 'var(--accent-cyan)', border: '1px solid var(--border-subtle)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                    🏢 {machineLocation}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. FICHA TÉCNICA DEL APARATO Y FÓRMULA ACTIVA */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              <Layers size={14} color="var(--accent-blue)" />
              <span>{machineTypeLabel}</span>
            </div>
            <div className="font-mono-tech" style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>
              Paso real: ±{minIncrement} lbs
            </div>
          </div>
          <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#a5b4fc' }}>
            {formulaLabel}
          </div>
        </div>

        {/* 2. DIAGNÓSTICO CIENTÍFICO GLOBAL DEL EJERCICIO */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {(analysis.isExcessiveLoad || analysis.isSpreadHigh) ? (
              <AlertTriangle size={16} color="var(--accent-amber)" />
            ) : (
              <Target size={16} color="var(--accent-cyan)" />
            )}
            <strong style={{ fontSize: '12.5px', color: (analysis.isExcessiveLoad || analysis.isSpreadHigh) ? 'var(--accent-amber)' : 'var(--accent-cyan)', fontWeight: '900' }}>
              {isDeloadMode
                ? '🧘 Semana de Descarga (Deload 80%)'
                : analysis.isExcessiveLoad
                ? '⚠️ Diagnóstico: Carga Excesiva'
                : (analysis.canProgressWeight ? '🚀 ¡Sobrecarga Progresiva Alcanzada!' : 'Diagnóstico y Meta de Hipertrofia')}
            </strong>
          </div>

          <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.45', fontWeight: '600' }}>
            {unified?.note || `Trabaja en rango de ${targetReps} reps buscando RPE 8.`}
          </p>

          {analysis.isFatigueDrop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: 'var(--accent-amber)', fontWeight: '700', marginTop: '2px' }}>
              <Clock size={12} />
              <span>Fatiga detectada en series finales previas. Añade +30 a 45s de descanso entre series.</span>
            </div>
          )}
        </div>

        {/* 3. DESGLOSE SERIE POR SERIE EN VIVO (ANTERIOR VS HOY) */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            🎯 Comparativa Serie por Serie ({prescribedSetsCount} prescritas hoy):
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {setNumbers.map(sNum => {
              const prev = previousData?.[sNum];
              const today = todayWorkoutData?.[sNum];
              const rec = analysis.setRecommendations?.[sNum];
              const isExtraPrevOnly = sNum > prescribedSetsCount && !today?.completed;

              const prevWeight = prev ? parseFloat(prev.weight) || 0 : 0;
              const prevReps = prev ? parseFloat(prev.reps) || 0 : 0;

              const todayWeight = today ? parseFloat(today.weight) || 0 : 0;
              const todayReps = today ? parseFloat(today.reps) || 0 : 0;
              const todayRpe = today ? parseFloat(today.rpe) || 8 : null;
              const isTodayDone = Boolean(today && today.completed);

              const rawMetaW = rec?.suggestedWeight || unified?.targetWeight || 0;
              const metaW = isDeloadMode && rawMetaW > 0
                ? roundToAttainableWeight(rawMetaW * 0.8, machineConfig)
                : rawMetaW;
              const metaR = rec?.suggestedReps || unified?.minReps;

              const deltaW = prevWeight > 0 ? (todayWeight - prevWeight) : 0;
              const deltaR = prevReps > 0 ? (todayReps - prevReps) : 0;
              const isExtraSet = !prevWeight && !prevReps;

              let statusBadge = null;
              if (isTodayDone) {
                if (deltaW > 0) {
                  statusBadge = { text: `🚀 +${deltaW} lbs!`, color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-subtle)' };
                } else if (deltaW === 0 && deltaR > 0) {
                  statusBadge = { text: `⚡ +${deltaR} reps!`, color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-subtle)' };
                } else if (deltaW === 0 && deltaR === 0) {
                  statusBadge = { text: '✓ Consolidado', color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-subtle)' };
                } else if (isExtraSet) {
                  statusBadge = { text: '➕ Extra', color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.15)' };
                } else {
                  statusBadge = { text: '⚖️ Fatiga', color: 'var(--accent-amber)', bg: 'var(--accent-warning-light)' };
                }
              }

              return (
                <div
                  key={sNum}
                  style={{
                    background: isTodayDone ? 'var(--accent-emerald-subtle)' : 'var(--bg-card)',
                    border: `1px solid ${isTodayDone ? 'var(--accent-emerald-border)' : 'var(--border-subtle)'}`,
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    opacity: isExtraPrevOnly ? 0.65 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono-tech" style={{
                      background: isTodayDone ? 'var(--accent-emerald)' : 'var(--bg-surface-secondary)',
                      color: isTodayDone ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '10px',
                      fontWeight: '900',
                      padding: '2px 6px',
                      borderRadius: '6px'
                    }}>
                      S{sNum}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="font-mono-tech" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Previo: {prevWeight > 0 ? <strong>{prevWeight}# × {prevReps}r</strong> : '— (Primera vez)'}
                      </span>
                      {isTodayDone ? (
                        <span className="font-mono-tech" style={{ fontSize: '11.5px', color: 'var(--text-main)', fontWeight: '800' }}>
                          Hoy: {todayWeight}# × {todayReps}r {todayRpe ? `(RPE ${todayRpe})` : ''}
                        </span>
                      ) : isExtraPrevOnly ? (
                        <span className="font-mono-tech" style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>
                          Serie extra histórica (hoy tocan {prescribedSetsCount} series)
                        </span>
                      ) : (
                        <span className="font-mono-tech" style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800' }}>
                          {metaW > 0
                            ? `Meta hoy: ${metaW}# × ${metaR}r`
                            : `Meta hoy: ${unified?.targetReps || targetReps} reps (RPE 8)`}
                        </span>
                      )}
                    </div>
                  </div>

                  {statusBadge && (
                    <span className="font-mono-tech" style={{
                      fontSize: '10px',
                      fontWeight: '900',
                      color: statusBadge.color,
                      background: statusBadge.bg,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      whiteSpace: 'nowrap'
                    }}>
                      {statusBadge.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. REGLAS DE AUTORREGULACIÓN INTRA-ENTRENO */}
        <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '10px 12px' }}>
          <strong style={{ fontSize: '11.5px', color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            <Sparkles size={14} color="#a78bfa" /> Pautas de Acción Inmediata en el Gym:
          </strong>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
            <li><strong>Si superas el rango máximo ({maxRepsVal + 1}+ reps con RPE ≤ 8):</strong> Tienes dominio neuromuscular pleno. Sube en la siguiente serie <strong className="font-mono-tech">+{minIncrement} lbs</strong> (el siguiente salto físico de esta máquina).</li>
            <li><strong>Si sientes fatiga prematura en las últimas series:</strong> No sacrifiques el peso ancla de golpe. Añade <strong>60 segundos adicionales de descanso</strong> antes de comenzar para resintetizar fosfocreatina.</li>
          </ul>
        </div>

        {/* BOTÓN ENTENDIDO */}
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, var(--accent-blue) 0%, #0052cc 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '11px',
            fontSize: '13px',
            fontWeight: '900',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
            marginTop: '2px'
          }}
        >
          ¡Entendido, a romper marcas!
        </button>
      </div>
    </div>
  );
}
