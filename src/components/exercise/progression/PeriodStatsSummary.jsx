import React from 'react';

export default function PeriodStatsSummary({ stats, timeframeLabel = 'periodo visible' }) {
  if (!stats || stats.sessionsCount === 0) return null;

  const { weight, reps, bestE1RM, sessionsCount, trend } = stats;

  const trendBadge = trend?.status === 'stagnant'
    ? { label: '⚠️ Estancado ≥2 ses', bg: 'rgba(245, 158, 11, 0.14)', color: '#d97706' }
    : trend?.status === 'progressing'
    ? { label: `📈 ${trend.weightDelta > 0 ? `+${trend.weightDelta} lbs` : `+${trend.e1rmDelta} 1RM`}`, bg: 'rgba(16, 185, 129, 0.14)', color: '#059669' }
    : { label: '🎯 Consolidando', bg: 'rgba(59, 130, 246, 0.14)', color: '#2563eb' };

  return (
    <div style={{
      marginBottom: '10px',
      padding: '10px 12px',
      borderRadius: '14px',
      background: 'var(--bg-surface-secondary)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>
        <span>📊 Resumen del periodo · {sessionsCount} ses. ({timeframeLabel})</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {/* Bloque 1: Peso */}
        <div style={{ background: 'var(--bg-card)', padding: '7px 9px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
            Peso (lbs)
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '4px', fontSize: '11.5px' }}>
            <span>Máx: <strong style={{ color: '#15803d' }}>{weight.max}</strong></span>
            <span>Prom: <strong>{weight.avg}</strong></span>
            <span>Mín: <strong style={{ color: 'var(--text-muted)' }}>{weight.min}</strong></span>
          </div>
        </div>

        {/* Bloque 2: Reps */}
        <div style={{ background: 'var(--bg-card)', padding: '7px 9px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
            Reps
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '4px', fontSize: '11.5px' }}>
            <span>Máx: <strong style={{ color: '#0284c7' }}>{reps.max}</strong></span>
            <span>Prom: <strong>{reps.avg}</strong></span>
            <span>Mín: <strong style={{ color: 'var(--text-muted)' }}>{reps.min}</strong></span>
          </div>
        </div>
      </div>

      {/* Pie compacto de 1 línea */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>
        <span>
          Mejor 1RM (≤15r): <strong style={{ color: 'var(--text-main)' }}>{bestE1RM ? `${bestE1RM} lbs` : '--'}</strong>
          {' · '}
          Sesiones: <strong style={{ color: 'var(--text-main)' }}>{sessionsCount}</strong>
        </span>
        <span style={{
          padding: '2px 8px',
          borderRadius: '8px',
          fontSize: '10.5px',
          fontWeight: '900',
          background: trendBadge.bg,
          color: trendBadge.color
        }}>
          {trendBadge.label}
        </span>
      </div>
    </div>
  );
}
