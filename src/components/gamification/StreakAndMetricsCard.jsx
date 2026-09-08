import React from 'react';
import { Flame, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';

export default function StreakAndMetricsCard({
  completedSessionsCount,
  currentStreakDays,
  adherencePercent,
  totalVolumeAccumulated
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      marginBottom: '14px'
    }}>
      {/* TARJETA 1: DÍAS TOTALES ENTRENADOS */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0066ff',
          flexShrink: 0
        }}>
          <Calendar size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            Días Llevo
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong style={{ fontSize: '20px', color: '#0f172a', fontWeight: '900', lineHeight: 1.1 }}>
              {completedSessionsCount}
            </strong>
            <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>sesiones</span>
          </div>
        </div>
      </div>

      {/* TARJETA 2: RACHA ACTIVA */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #fed7aa',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: '#fff7ed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ea580c',
          flexShrink: 0
        }}>
          <Flame size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10.5px', color: '#9a3412', fontWeight: '700', textTransform: 'uppercase' }}>
            Racha Activa
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong style={{ fontSize: '20px', color: '#ea580c', fontWeight: '900', lineHeight: 1.1 }}>
              {currentStreakDays}
            </strong>
            <span style={{ fontSize: '10.5px', color: '#c2410c', fontWeight: '700' }}>días</span>
          </div>
        </div>
      </div>

      {/* TARJETA 3: ADHERENCIA MENSUAL */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #bbf7d0',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: '#f0fdf4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#16a34a',
          flexShrink: 0
        }}>
          <CheckCircle2 size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10.5px', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>
            Adherencia Mes
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong style={{ fontSize: '20px', color: '#15803d', fontWeight: '900', lineHeight: 1.1 }}>
              {adherencePercent}%
            </strong>
            <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700' }}>cumplido</span>
          </div>
        </div>
      </div>

      {/* TARJETA 4: TONELAJE / VOLUMEN ACUMULADO */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#475569',
          flexShrink: 0
        }}>
          <TrendingUp size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            Carga Total
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong style={{ fontSize: '18px', color: '#0f172a', fontWeight: '900', lineHeight: 1.1 }}>
              {totalVolumeAccumulated >= 1000 ? `${Math.round(totalVolumeAccumulated / 1000)}k` : Math.round(totalVolumeAccumulated)}
            </strong>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>lbs movidas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
