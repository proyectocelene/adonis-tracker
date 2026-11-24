import React from 'react';

function formatLastRealSummary(coachAnalysis, previousData) {
  const sets = coachAnalysis?.sets || [];
  if (!sets.length) return 'Sesión inicial';

  const weights = sets.map(s => s.weight);
  const allSameWeight = weights.every(w => w === weights[0]);
  const setsText = allSameWeight
    ? `${weights[0]}×${sets.map(s => s.reps).join(', ')}`
    : sets.map(s => `${s.weight}×${s.reps}`).join(' · ');

  const dateLabel = previousData?.dateStr || previousData?.date || '';
  return dateLabel ? `${setsText} · ${dateLabel}` : setsText;
}

function formatTodayTargetSummary(unifiedTarget) {
  if (!unifiedTarget) return 'Sesión inicial';
  const perSet = unifiedTarget.perSetTargets || [];
  if (perSet.length > 0) {
    return perSet.map(t => `S${t.setNum}: ${t.weight}×${t.reps}`).join(' · ');
  }
  return unifiedTarget.headline || `Rango ${unifiedTarget.targetReps || '8-12'} reps`;
}

function resolveStrategyBadge(unifiedTarget) {
  if (!unifiedTarget || unifiedTarget.strategyType === 'initial') {
    return { label: '🎯 Inicial', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-subtle)' };
  }
  if (unifiedTarget.strategyType === 'reactivation') {
    return { label: '🔄 Reactivación', color: 'var(--accent-amber)', bg: 'var(--accent-amber-subtle)' };
  }
  if (unifiedTarget.canProgressWeight) {
    return { label: '⚡ Subir', color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-subtle)' };
  }
  if (unifiedTarget.isExcessiveLoad) {
    return { label: '🔬 Ajuste', color: 'var(--accent-amber)', bg: 'var(--accent-amber-subtle)' };
  }
  return { label: '📈 +Reps', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-subtle)' };
}

export default function SetLoggerTargetBanners({
  coachAnalysis,
  previousData,
  setIsScienceModalOpen,
  isDeloadMode
}) {
  const unifiedTarget = coachAnalysis?.unifiedTarget;
  const lastRealText = formatLastRealSummary(coachAnalysis, previousData);
  const metaHoyText = formatTodayTargetSummary(unifiedTarget);
  const badge = resolveStrategyBadge(unifiedTarget);

  return (
    <>
      {unifiedTarget && (
        <div
          onClick={() => setIsScienceModalOpen(true)}
          style={{
            background: 'var(--bg-surface-secondary)',
            border: `1px solid ${badge.color}`,
            borderRadius: '10px',
            padding: '7px 10px',
            marginBottom: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
          title="Toca para ver detalle de progresión"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span style={{ opacity: 0.85 }}>Último real:</span>{' '}
              <strong className="font-mono-tech" style={{ color: 'var(--text-main)' }}>{lastRealText}</strong>
            </div>
            <div style={{ fontSize: '11px', color: badge.color, fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span style={{ opacity: 0.9 }}>Meta hoy:</span>{' '}
              <span className="font-mono-tech">{metaHoyText}</span>
            </div>
          </div>

          <span style={{
            fontSize: '9.5px',
            color: badge.color,
            background: badge.bg,
            border: `1px solid ${badge.color}`,
            fontWeight: '900',
            flexShrink: 0,
            padding: '2px 7px',
            borderRadius: '999px',
            whiteSpace: 'nowrap'
          }}>
            {badge.label}
          </span>
        </div>
      )}

      {isDeloadMode === true && (
        <div style={{
          background: 'var(--accent-emerald-subtle)',
          border: '1px solid var(--accent-emerald)',
          borderRadius: '10px',
          padding: '6px 10px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '14px' }}>🧘</span>
          <div style={{ fontSize: '10.5px', color: 'var(--accent-emerald)', fontWeight: '800', lineHeight: '1.3' }}>
            <strong>Modo Deload Activo:</strong> Cargas al 80%, 2 series y RIR 3-4 (sin fallo).
          </div>
        </div>
      )}
    </>
  );
}
