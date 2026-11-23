import React from 'react';
import { Info } from 'lucide-react';
import { cleanInputVal } from '../../hooks/cardio/useCardioState';

export default function EllipticalSection({
  duration,
  setDuration,
  ellipticalResistance,
  setEllipticalResistance,
  ellipticalSpm,
  setEllipticalSpm,
  ellipticalDistance,
  setEllipticalDistance,
  metrics,
  notifyChange
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        background: 'var(--accent-blue-light)',
        border: '1px solid var(--accent-blue)',
        borderRadius: '10px',
        padding: '6px 10px',
        fontSize: '11px',
        color: 'var(--accent-blue)',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Info size={14} color="var(--accent-blue)" />
        Modalidad Sólo Piernas: Brazos fijos en manillar. Aislamiento articular inferior puro (sin impulso de tren superior).
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⏱️ Minutos:
          </label>
          <input
            type="number"
            value={cleanInputVal(duration, '35')}
            onChange={e => {
              setDuration(e.target.value);
              notifyChange({ duration: parseFloat(e.target.value) || 0 });
            }}
            style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--accent-blue)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⚙️ Nivel Res.:
          </label>
          <input
            type="number"
            value={cleanInputVal(ellipticalResistance, '5')}
            onChange={e => {
              setEllipticalResistance(e.target.value);
              notifyChange({ resistanceLevel: parseFloat(e.target.value) || 0 });
            }}
            placeholder="5"
            style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            🚶 Zancadas (SPM):
          </label>
          <input
            type="number"
            value={cleanInputVal(ellipticalSpm, '60')}
            onChange={e => {
              setEllipticalSpm(e.target.value);
              notifyChange({ stridesPerMin: parseFloat(e.target.value) || 0 });
            }}
            placeholder="60"
            style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            📍 Distancia (km):
          </label>
          <input
            type="number"
            step="0.1"
            value={cleanInputVal(ellipticalDistance, '')}
            placeholder={metrics.distanceKm ? String(metrics.distanceKm) : '2.0'}
            onChange={e => {
              setEllipticalDistance(e.target.value);
              notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
            }}
            style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
          />
        </div>
      </div>
    </div>
  );
}
