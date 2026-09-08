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
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
            border: '1.5px solid #bfdbfe',
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
            <Activity size={20} color="#0066ff" />
            <div>
              <span style={{ fontSize: '10px', color: '#1e40af', fontWeight: '900', textTransform: 'uppercase', display: 'block' }}>
                Velocidad de Progreso Semanal
              </span>
              <strong style={{ fontSize: '13px', color: '#0f172a', fontWeight: '900' }}>
                {stats.weeklyRate > 0 ? `+${stats.weeklyRate}` : stats.weeklyRate} {preferredUnit}/sem ({stats.weeklyRatePercent > 0 ? `+${stats.weeklyRatePercent}` : stats.weeklyRatePercent}%)
              </strong>
              <span style={{ fontSize: '11px', color: stats.diagColor, fontWeight: '800', display: 'block', marginTop: '2px' }}>
                {stats.diagnostic}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TARJETAS KPI DE ANÁLISIS EN EL PERIODO SELECCIONADO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div className="card" style={{ padding: '14px 12px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Actual</span>
          <div style={{ fontSize: '20px', fontWeight: '900', marginTop: '2px', color: '#38bdf8' }}>
            {stats.current} <span style={{ fontSize: '11px', color: '#94a3b8' }}>{preferredUnit}</span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Cambio ({selectedTimeframe})</span>
          <div style={{ fontSize: '18px', fontWeight: '900', marginTop: '2px', color: stats.diff < 0 ? '#059669' : (stats.diff > 0 ? '#d97706' : '#64748b') }}>
            {stats.diff > 0 ? '+' : ''}{stats.diff} <span style={{ fontSize: '10px', fontWeight: '700' }}>{preferredUnit}</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '800', color: stats.diff < 0 ? '#059669' : '#d97706' }}>
            ({stats.diffPercent}%)
          </span>
        </div>

        <div className="card" style={{ padding: '14px 12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Rango (Min - Max)</span>
          <div style={{ fontSize: '14px', fontWeight: '900', marginTop: '4px', color: '#334155' }}>
            {stats.min} - {stats.max}
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>
            Prom: {stats.average}
          </span>
        </div>
      </div>
    </>
  );
}
