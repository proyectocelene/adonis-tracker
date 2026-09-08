import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine 
} from 'recharts';
import { Activity } from 'lucide-react';
import { TIME_FRAMES, MOMENTS } from './constants';
import { ErrorBoundary } from '../common/ErrorBoundary';

export default function WeightChartSection({
  chartData = [],
  stats,
  selectedTimeframe,
  setSelectedTimeframe
}) {
  // Tooltip personalizado para Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const momentObj = MOMENTS.find(m => m.id === data.moment) || MOMENTS[4];
      return (
        <div style={{ background: '#0f172a', color: '#fff', padding: '12px 14px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '1.5px solid rgba(56,189,248,0.3)', minWidth: '190px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>📅 {data.date}</span>
            <span>⏰ {data.time}</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', margin: '4px 0' }}>
            {data.peso} <span style={{ fontSize: '13px', color: '#94a3b8' }}>{data.unit}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', background: data.isFasting ? '#f59e0b' : 'rgba(255,255,255,0.15)', color: data.isFasting ? '#000' : '#fff', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
              {momentObj.label}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#a78bfa', fontWeight: '700' }}>
            Tendencia (Media Móvil): <strong>{data.promedioMovil} {data.unit}</strong>
          </div>
          {data.comment && (
            <div style={{ fontSize: '11px', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px', marginTop: '6px', fontStyle: 'italic' }}>
              💬 "{data.comment}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* SELECTOR DE RANGO TEMPORAL */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px', scrollbarWidth: 'none' }}>
        {TIME_FRAMES.map(tf => {
          const isSelected = selectedTimeframe === tf.id;
          return (
            <button
              key={tf.id}
              type="button"
              onClick={() => setSelectedTimeframe(tf.id)}
              style={{
                flex: '0 0 auto',
                padding: '8px 14px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #0066ff' : '1px solid #cbd5e1',
                background: isSelected ? '#0066ff' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 4px 10px rgba(0,102,255,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tf.label}
            </button>
          );
        })}
      </div>

      {/* GRÁFICA CIENTÍFICA RECHARTS CON TENDENCIA Y PUNTOS DE AYUNAS */}
      <div className="card" style={{ padding: '16px', borderRadius: '22px', background: '#ffffff', border: '1.5px solid #e2e8f0', marginBottom: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
        <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={18} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>
              Curva de Peso & Tendencia ({chartData.length} registros)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: '800', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0066ff' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0066ff' }}></span> Peso Real
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9333ea' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9333ea' }}></span> Tendencia (Media Móvil)
            </span>
          </div>
        </div>

        {chartData.length > 0 ? (
          <ErrorBoundary inline>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']} 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {stats?.average > 0 && (
                    <ReferenceLine y={stats.average} stroke="#cbd5e1" strokeDasharray="3 3" />
                  )}
                  {/* Línea de Peso Real */}
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="#0066ff" 
                    strokeWidth={2.5} 
                    dot={({ cx, cy, payload }) => {
                      const isFasting = payload.isFasting;
                      return (
                        <circle
                          key={payload.id}
                          cx={cx}
                          cy={cy}
                          r={isFasting ? 5 : 3.5}
                          fill={isFasting ? '#f59e0b' : '#0066ff'}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      );
                    }}
                    activeDot={{ r: 7 }} 
                  />
                  {/* Línea de Tendencia / Media Móvil Suavizada */}
                  <Line 
                    type="monotone" 
                    dataKey="promedioMovil" 
                    stroke="#9333ea" 
                    strokeWidth={2.5} 
                    strokeDasharray="4 4" 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ErrorBoundary>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8', fontSize: '13px' }}>
            No hay registros de peso en el periodo seleccionado ({selectedTimeframe}).
          </div>
        )}
      </div>
    </>
  );
}
