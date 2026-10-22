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
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: 'var(--shadow-ios)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'var(--accent-blue-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-blue)',
          flexShrink: 0
        }}>
          <Calendar size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Días Llevo
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong className="font-mono-tech" style={{ fontSize: '20px', color: 'var(--text-main)', fontWeight: '900', lineHeight: 1.1 }}>
              {completedSessionsCount}
            </strong>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>sesiones</span>
          </div>
        </div>
      </div>

      {/* TARJETA 2: RACHA ACTIVA */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: 'var(--shadow-ios)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'var(--accent-amber-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-amber)',
          flexShrink: 0
        }}>
          <Flame size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10.5px', color: 'var(--accent-amber)', fontWeight: '700', textTransform: 'uppercase' }}>
            Racha Activa
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong className="font-mono-tech" style={{ fontSize: '20px', color: 'var(--accent-amber)', fontWeight: '900', lineHeight: 1.1 }}>
              {currentStreakDays}
            </strong>
            <span style={{ fontSize: '10.5px', color: 'var(--accent-amber)', fontWeight: '700' }}>días</span>
          </div>
        </div>
      </div>

      {/* TARJETA 3: ADHERENCIA MENSUAL */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: 'var(--shadow-ios)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'var(--accent-emerald-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-emerald)',
          flexShrink: 0
        }}>
          <CheckCircle2 size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10.5px', color: 'var(--accent-emerald)', fontWeight: '700', textTransform: 'uppercase' }}>
            Adherencia Mes
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong className="font-mono-tech" style={{ fontSize: '20px', color: 'var(--accent-emerald)', fontWeight: '900', lineHeight: 1.1 }}>
              {adherencePercent}%
            </strong>
            <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '700' }}>cumplido</span>
          </div>
        </div>
      </div>

      {/* TARJETA 4: TONELAJE / VOLUMEN ACUMULADO */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: 'var(--shadow-ios)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'rgba(168, 85, 247, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#c084fc',
          flexShrink: 0
        }}>
          <TrendingUp size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Carga Total
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong className="font-mono-tech" style={{ fontSize: '18px', color: 'var(--text-main)', fontWeight: '900', lineHeight: 1.1 }}>
              {totalVolumeAccumulated >= 1000 ? `${Math.round(totalVolumeAccumulated / 1000)}k` : Math.round(totalVolumeAccumulated)}
            </strong>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>lbs movidas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
