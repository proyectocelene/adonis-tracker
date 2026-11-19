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
            borderRadius: '16px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--accent-blue)" />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '600', display: 'block' }}>
                Ritmo de progreso semanal
              </span>
              <strong className="font-mono-tech" style={{ fontSize: '13.5px', color: 'var(--text-main)', fontWeight: '700' }}>
                {stats.weeklyRate > 0 ? `+${stats.weeklyRate}` : stats.weeklyRate} {preferredUnit}/sem ({stats.weeklyRatePercent > 0 ? `+${stats.weeklyRatePercent}` : stats.weeklyRatePercent}%)
              </strong>
              <span style={{ fontSize: '11px', color: stats.diagColor || 'var(--accent-emerald)', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                {stats.diagnostic}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TARJETAS KPI DE ANÁLISIS EN EL PERIODO SELECCIONADO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div className="card" style={{ padding: '12px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Actual</span>
          <div className="font-mono-tech" style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px', color: 'var(--accent-cyan)' }}>
            {stats.current} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>{preferredUnit}</span>
          </div>
        </div>

        <div className="card" style={{ padding: '12px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Cambio ({selectedTimeframe})</span>
          <div className="font-mono-tech" style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px', color: stats.diff < 0 ? 'var(--accent-emerald)' : (stats.diff > 0 ? 'var(--accent-amber)' : 'var(--text-muted)') }}>
            {stats.diff > 0 ? '+' : ''}{stats.diff} <span style={{ fontSize: '10px', fontWeight: '500' }}>{preferredUnit}</span>
          </div>
          <span className="font-mono-tech" style={{ fontSize: '10px', fontWeight: '600', color: stats.diff < 0 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
            ({stats.diffPercent}%)
          </span>
        </div>

        <div className="card" style={{ padding: '12px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Rango (Mín - Máx)</span>
          <div className="font-mono-tech" style={{ fontSize: '13px', fontWeight: '700', marginTop: '4px', color: 'var(--text-main)' }}>
            {stats.min} - {stats.max}
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            Prom: {stats.average}
          </span>
        </div>
      </div>
    </>
  );
}
