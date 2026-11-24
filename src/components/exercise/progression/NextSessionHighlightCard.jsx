import React from 'react';

export default function NextSessionHighlightCard({ nextSession }) {
  if (!nextSession) return null;

  const {
    hasData,
    lastSessionDate,
    lastWorkingSetsSummary,
    perSetTargets = [],
    strategyType,
    badgeText,
    headline,
    formulaLabel,
    reason
  } = nextSession;

  const badgeColors = strategyType === 'progression'
    ? { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }
    : strategyType === 'reactivation'
    ? { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }
    : strategyType === 'deload'
    ? { bg: 'rgba(20, 184, 166, 0.2)', color: '#5eead4', border: '1px solid rgba(20, 184, 166, 0.4)' }
    : { bg: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.4)' };

  return (
    <div style={{
      marginBottom: '10px',
      padding: '10px 12px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      border: '1px solid rgba(96, 165, 250, 0.35)',
      color: '#ffffff'
    }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '0.4px', color: '#93c5fd' }}>
          🎯 PRÓXIMA SESIÓN
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: '900',
          padding: '2px 8px',
          borderRadius: '8px',
          background: badgeColors.bg,
          color: badgeColors.color,
          border: badgeColors.border
        }}>
          {badgeText}
        </span>
      </div>

      {/* Fila principal: pastillas S1..Sn o Calibración inicial */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '7px' }}>
        {hasData && perSetTargets.length > 0 ? (
          perSetTargets.map(s => (
            <span
              key={s.setNum}
              style={{
                fontSize: '12px',
                fontWeight: '900',
                padding: '4px 9px',
                borderRadius: '9px',
                background: 'rgba(59, 130, 246, 0.22)',
                border: '1px solid rgba(147, 197, 253, 0.45)',
                color: '#ffffff'
              }}
            >
              S{s.setNum}: {s.weight}×{s.reps}
            </span>
          ))
        ) : (
          <span style={{
            fontSize: '12px',
            fontWeight: '900',
            padding: '4px 10px',
            borderRadius: '9px',
            background: 'rgba(59, 130, 246, 0.22)',
            border: '1px solid rgba(147, 197, 253, 0.4)',
            color: '#e2e8f0'
          }}>
            {headline}
          </span>
        )}
      </div>

      {/* Subtítulo: fórmula, razón y última sesión */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10.5px', color: '#cbd5e1' }}>
        <span style={{ fontWeight: '800', color: '#a5b4fc' }}>{formulaLabel}</span>
        {reason && <span style={{ color: '#e2e8f0' }}>{reason}</span>}
        {hasData && lastWorkingSetsSummary && (
          <span style={{ color: '#94a3b8', fontWeight: '700' }}>
            Última: {lastWorkingSetsSummary}{lastSessionDate ? ` · ${lastSessionDate}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
