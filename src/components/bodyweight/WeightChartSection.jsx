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
  setSelectedTimeframe,
  targetWeight,
  preferredUnit = 'kg'
}) {
  // Tooltip personalizado para Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const momentObj = MOMENTS.find(m => m.id === data.moment) || MOMENTS[4];
      return (
        <div style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', padding: '12px 14px', borderRadius: '14px', boxShadow: 'var(--shadow-ios-lg)', border: '1px solid var(--border-subtle)', minWidth: '190px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>📅 {data.date}</span>
            <span>⏰ {data.time}</span>
          </div>
          <div className="font-mono-tech" style={{ fontSize: '22px', fontWeight: '900', color: 'var(--accent-blue)', margin: '4px 0' }}>
            {data.peso} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{data.unit}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', background: data.isFasting ? 'var(--accent-amber-subtle)' : 'var(--bg-surface-secondary)', color: data.isFasting ? 'var(--accent-amber)' : 'var(--text-secondary)', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
              {momentObj.label}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: '700' }}>
            Tendencia (Media Móvil): <strong className="font-mono-tech">{data.promedioMovil} {data.unit}</strong>
          </div>
          {data.comment && (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '6px', fontStyle: 'italic' }}>
              💬 "{data.comment}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const isDense = chartData.length > 20;
  const dynamicXInterval = chartData.length <= 8 ? 0 : (chartData.length <= 15 ? 1 : (chartData.length <= 25 ? 2 : Math.ceil(chartData.length / 6)));

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
                padding: '6px 12px',
                borderRadius: '10px',
                border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--accent-blue)' : 'var(--bg-surface-secondary)',
                color: isSelected ? '#ffffff' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 8px rgba(0,102,255,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tf.label}
            </button>
          );
        })}
      </div>

      {/* GRÁFICA CIENTÍFICA RECHARTS CON TENDENCIA Y PUNTOS DE AYUNAS */}
      <div className="card" style={{ padding: '16px', borderRadius: '22px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', marginBottom: '20px', boxShadow: 'var(--shadow-ios)' }}>
        <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={18} color="var(--accent-blue)" />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: 'var(--text-main)' }}>
              Curva de Peso & Tendencia ({chartData.length} registros)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: '800', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-blue)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }}></span> Peso Real
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span> Tendencia (Media Móvil)
            </span>
            {targetWeight > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)' }}>
                <span style={{ width: '8px', height: '2px', background: 'var(--accent-emerald)' }}></span> Meta Adonis ({targetWeight} {preferredUnit})
              </span>
            )}
          </div>
        </div>

        {chartData.length > 0 ? (
          <ErrorBoundary inline>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" opacity={0.6} />
                  <XAxis 
                    dataKey="label" 
                    interval={dynamicXInterval}
                    tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600 }} 
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[
                      dataMin => {
                        if (targetWeight > 0 && targetWeight < dataMin && (dataMin - targetWeight) <= 15) {
                          return Math.floor(targetWeight - 1);
                        }
                        return Math.floor(dataMin - 1);
                      },
                      'dataMax + 1'
                    ]} 
                    tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {targetWeight > 0 && (
                    <ReferenceLine 
                      y={targetWeight} 
                      stroke="#10b981" 
                      strokeDasharray="4 4" 
                      strokeWidth={2}
                      label={{
                        value: `🎯 Meta: ${targetWeight} ${preferredUnit}`,
                        position: 'insideBottomRight',
                        fill: '#059669',
                        fontSize: 10,
                        fontWeight: 800
                      }}
                    />
                  )}
                  {stats?.average > 0 && (
                    <ReferenceLine y={stats.average} stroke="var(--border-subtle)" strokeDasharray="3 3" />
                  )}
                  {/* Línea de Peso Real */}
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="var(--accent-blue)" 
                    strokeWidth={2.5} 
                    dot={({ cx, cy, payload }) => {
                      const isFasting = payload.isFasting;
                      return (
                        <circle
                          key={payload.id}
                          cx={cx}
                          cy={cy}
                          r={isDense ? (isFasting ? 2.5 : 1.5) : (isFasting ? 5 : 3.5)}
                          fill={isFasting ? 'var(--accent-amber)' : 'var(--accent-blue)'}
                          stroke="var(--bg-surface)"
                          strokeWidth={isDense ? 1 : 2}
                        />
                      );
                    }}
                    activeDot={{ r: isDense ? 5 : 7 }} 
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
