import React from 'react';
import { cleanInputVal } from '../../hooks/cardio/cardioStateHelper';

export default function TreadmillSection({
  duration,
  setDuration,
  treadmillIncline,
  setTreadmillIncline,
  treadmillSpeed,
  setTreadmillSpeed,
  treadmillDistance,
  setTreadmillDistance,
  machineKcal,
  setMachineKcal,
  metrics = {},
  notifyChange
}) {
  const autoDistPlaceholder = metrics.autoDistanceKm
    ? String(metrics.autoDistanceKm)
    : (metrics.distanceKm ? String(metrics.distanceKm) : '2.67');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* 4 inputs claros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⏱️ Minutos
          </label>
          <input
            type="number"
            value={cleanInputVal(duration, '40')}
            onChange={e => {
              setDuration(e.target.value);
              notifyChange({ duration: parseFloat(e.target.value) || 0 });
            }}
            style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--accent-blue)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
            {[35, 40, 45].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setDuration(String(m));
                  notifyChange({ duration: m });
                }}
                style={{
                  flex: 1,
                  padding: '3px 0',
                  borderRadius: '7px',
                  border: String(duration) === String(m) ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                  background: String(duration) === String(m) ? 'var(--accent-blue-light)' : 'var(--bg-card)',
                  color: String(duration) === String(m) ? 'var(--accent-blue)' : 'var(--text-muted)',
                  fontSize: '10.5px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            📐 Inclinación %
          </label>
          <input
            type="number"
            step="0.5"
            value={cleanInputVal(treadmillIncline, '10')}
            onChange={e => {
              setTreadmillIncline(e.target.value);
              notifyChange({ inclinePct: parseFloat(e.target.value) || 0 });
            }}
            placeholder="10"
            style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
            {[8, 10, 11, 12].map(inc => (
              <button
                key={inc}
                type="button"
                onClick={() => {
                  setTreadmillIncline(String(inc));
                  notifyChange({ inclinePct: inc });
                }}
                style={{
                  flex: 1,
                  padding: '3px 0',
                  borderRadius: '7px',
                  border: String(treadmillIncline) === String(inc) ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                  background: String(treadmillIncline) === String(inc) ? 'var(--accent-blue-light)' : 'var(--bg-card)',
                  color: String(treadmillIncline) === String(inc) ? 'var(--accent-blue)' : 'var(--text-muted)',
                  fontSize: '10.5px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {inc}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⚡ Velocidad km/h
          </label>
          <input
            type="number"
            step="0.1"
            value={cleanInputVal(treadmillSpeed, '4.0')}
            onChange={e => {
              setTreadmillSpeed(e.target.value);
              notifyChange({ speedKmh: parseFloat(e.target.value) || 0 });
            }}
            placeholder="4.0"
            style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            📍 Distancia km
          </label>
          <input
            type="number"
            step="0.01"
            value={cleanInputVal(treadmillDistance, '')}
            placeholder={autoDistPlaceholder}
            onChange={e => {
              setTreadmillDistance(e.target.value);
              notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
            }}
            style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Campo opcional discreto: Kcal consola */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
          Kcal consola (opcional):
        </label>
        <input
          type="number"
          value={cleanInputVal(machineKcal, '')}
          placeholder="Ej. 320"
          onChange={e => {
            setMachineKcal(e.target.value);
            const val = parseFloat(e.target.value);
            notifyChange({ machineCalories: val > 0 ? Math.round(val) : null });
          }}
          style={{ width: '110px', padding: '5px 8px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '800', fontSize: '12px' }}
        />
      </div>

      {/* Barra de resultados en vivo */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '9px 12px',
        borderRadius: '12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        fontSize: '12px',
        fontWeight: '800',
        color: 'var(--text-main)'
      }}>
        <span>🔥 {metrics.acsmNetKcal ?? metrics.cardioKcal ?? 0} kcal netas (ACSM)</span>
        <span>
          👟 {(metrics.effectiveSteps || 0).toLocaleString()} pasos ({metrics.stepsSource === 'watch' ? 'reloj' : 'est.'})
        </span>
        <span style={{ color: 'var(--accent-emerald)' }}>⛰️ +{metrics.elevationMeters || 0} m</span>
      </div>
    </div>
  );
}
