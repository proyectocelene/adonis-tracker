import React from 'react';
import { Activity } from 'lucide-react';

export default function WeightMetricsSummary({
  stats,
  preferredUnit,
  selectedTimeframe
}) {
  return (
    <>
      {/* TARJETA DE DIAGNÓSTICO CIENTÍFICO DE TASA DE CAMBIO */}
      {stats.count > 1 && (
        <div 
          style={{
            background: 'var(--accent-blue-light)',
            border: '1px solid var(--accent-blue)',
            padding: '12px 14px',
            borderRadius: '18px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--accent-blue)" />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--accent-blue)', fontWeight: '900', textTransform: 'uppercase', display: 'block' }}>
                Velocidad de Progreso Semanal
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '900' }}>
                {stats.weeklyRate > 0 ? `+${stats.weeklyRate}` : stats.weeklyRate} {preferredUnit}/sem ({stats.weeklyRatePercent > 0 ? `+${stats.weeklyRatePercent}` : stats.weeklyRatePercent}%)
              </strong>
              <span style={{ fontSize: '11px', color: stats.diagColor || 'var(--accent-emerald)', fontWeight: '800', display: 'block', marginTop: '2px' }}>
                {stats.diagnostic}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TARJETAS KPI DE ANÁLISIS EN EL PERIODO SELECCIONADO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div className="card" style={{ padding: '14px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Actual</span>
          <div style={{ fontSize: '20px', fontWeight: '900', marginTop: '2px', color: 'var(--accent-cyan)' }}>
            {stats.current} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{preferredUnit}</span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Cambio ({selectedTimeframe})</span>
          <div style={{ fontSize: '18px', fontWeight: '900', marginTop: '2px', color: stats.diff < 0 ? 'var(--accent-emerald)' : (stats.diff > 0 ? 'var(--accent-amber)' : 'var(--text-muted)') }}>
            {stats.diff > 0 ? '+' : ''}{stats.diff} <span style={{ fontSize: '10px', fontWeight: '700' }}>{preferredUnit}</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '800', color: stats.diff < 0 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
            ({stats.diffPercent}%)
          </span>
        </div>

        <div className="card" style={{ padding: '14px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Rango (Min - Max)</span>
          <div style={{ fontSize: '14px', fontWeight: '900', marginTop: '4px', color: 'var(--text-main)' }}>
            {stats.min} - {stats.max}
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            Prom: {stats.average}
          </span>
        </div>
      </div>
    </>
  );
}
