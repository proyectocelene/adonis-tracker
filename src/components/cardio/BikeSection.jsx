import React from 'react';
import { cleanInputVal } from '../../hooks/cardio/useCardioState';

export default function BikeSection({
  duration,
  setDuration,
  bikeResistance,
  setBikeResistance,
  bikeSpeed,
  setBikeSpeed,
  bikeDistance,
  setBikeDistance,
  bikeCadence,
  setBikeCadence,
  metrics,
  notifyChange
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '6px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⏱️ Minutos:
          </label>
          <input
            type="number"
            value={cleanInputVal(duration, '35')}
            onChange={e => {
              setDuration(e.target.value);
              notifyChange({ duration: parseFloat(e.target.value) || 0 });
            }}
            style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--accent-blue)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '12.5px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⚙️ Nivel Res.:
          </label>
          <input
            type="number"
            value={cleanInputVal(bikeResistance, '6')}
            onChange={e => {
              setBikeResistance(e.target.value);
              notifyChange({ resistanceLevel: parseFloat(e.target.value) || 0 });
            }}
            placeholder="6"
            style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '12.5px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⚡ Vel km/h:
          </label>
          <input
            type="number"
            step="0.5"
            value={cleanInputVal(bikeSpeed, '22')}
            onChange={e => {
              setBikeSpeed(e.target.value);
              notifyChange({ avgSpeedKmh: parseFloat(e.target.value) || 0 });
            }}
            placeholder="22"
            style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '12.5px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            📍 Dist (km):
          </label>
          <input
            type="number"
            step="0.1"
            value={cleanInputVal(bikeDistance, '')}
            placeholder={metrics.distanceKm ? String(metrics.distanceKm) : '12.5'}
            onChange={e => {
              setBikeDistance(e.target.value);
              notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
            }}
            style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '12.5px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            🔄 RPM:
          </label>
          <input
            type="number"
            value={cleanInputVal(bikeCadence, '75')}
            onChange={e => {
              setBikeCadence(e.target.value);
              notifyChange({ cadenceRpm: parseFloat(e.target.value) || 0 });
            }}
            placeholder="75"
            style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '12.5px' }}
          />
        </div>
      </div>

      {/* Presets de resistencia */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>Resistencia:</span>
        {[3, 4, 5, 6, 7, 8, 10].map(lvl => (
          <button
            key={lvl}
            type="button"
            onClick={() => {
              setBikeResistance(String(lvl));
              notifyChange({ resistanceLevel: lvl });
            }}
            style={{
              padding: '3px 8px',
              borderRadius: '8px',
              border: bikeResistance === String(lvl) ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
              background: bikeResistance === String(lvl) ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
              color: bikeResistance === String(lvl) ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontSize: '10.5px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Niv {lvl}
          </button>
        ))}
        <span style={{ fontSize: '10.5px', color: 'var(--accent-amber)', fontWeight: '800', marginLeft: 'auto' }}>
          ⚡ ~{Math.round((parseFloat(bikeResistance || 6) * 14) + ((parseFloat(bikeCadence || 75) - 50) * 1.5))} Watts estimados
        </span>
      </div>
    </div>
  );
}
