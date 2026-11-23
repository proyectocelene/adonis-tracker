import React from 'react';
import { cleanInputVal } from '../../hooks/cardio/cardioStateHelper';
import TreadmillDualPhase from './TreadmillDualPhase';

export default function TreadmillSection({
  isDualPhase,
  setIsDualPhase,
  phaseMinutesA,
  setPhaseMinutesA,
  phaseInclineA,
  setPhaseInclineA,
  phaseSpeedA,
  setPhaseSpeedA,
  phaseMinutesB,
  setPhaseMinutesB,
  phaseInclineB,
  setPhaseInclineB,
  phaseSpeedB,
  setPhaseSpeedB,
  duration,
  setDuration,
  treadmillIncline,
  setTreadmillIncline,
  treadmillSpeed,
  setTreadmillSpeed,
  treadmillDistance,
  setTreadmillDistance,
  metrics,
  notifyChange
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Selector de Modo: Bifásico (Oficial Adonis) vs Simple */}
      <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', padding: '3px', borderRadius: '12px' }}>
        <button
          type="button"
          onClick={() => {
            setIsDualPhase(true);
            notifyChange({ 
              isDualPhase: true,
              duration: (parseFloat(phaseMinutesA) || 30) + (parseFloat(phaseMinutesB) || 30)
            });
          }}
          style={{
            flex: 1,
            padding: '7px 10px',
            borderRadius: '10px',
            border: 'none',
            background: isDualPhase ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            color: isDualPhase ? '#ffffff' : '#475569',
            fontWeight: '900',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            boxShadow: isDualPhase ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
          }}
        >
          ⚡ Protocolo Bifásico Oficial (60 min)
        </button>
        <button
          type="button"
          onClick={() => {
            setIsDualPhase(false);
            notifyChange({ 
              isDualPhase: false,
              duration: parseFloat(duration) || 35
            });
          }}
          style={{
            flex: 1,
            padding: '7px 10px',
            borderRadius: '10px',
            border: 'none',
            background: !isDualPhase ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            color: !isDualPhase ? '#ffffff' : '#475569',
            fontWeight: '900',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            boxShadow: !isDualPhase ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
          }}
        >
          ⏱️ Modo Simple (1 Inclinación)
        </button>
      </div>

      {/* MODO BIFÁSICO: FASE A + FASE B */}
      {isDualPhase ? (
        <TreadmillDualPhase
          phaseMinutesA={phaseMinutesA}
          setPhaseMinutesA={setPhaseMinutesA}
          phaseInclineA={phaseInclineA}
          setPhaseInclineA={setPhaseInclineA}
          phaseSpeedA={phaseSpeedA}
          setPhaseSpeedA={setPhaseSpeedA}
          phaseMinutesB={phaseMinutesB}
          setPhaseMinutesB={setPhaseMinutesB}
          phaseInclineB={phaseInclineB}
          setPhaseInclineB={setPhaseInclineB}
          phaseSpeedB={phaseSpeedB}
          setPhaseSpeedB={setPhaseSpeedB}
          treadmillDistance={treadmillDistance}
          setTreadmillDistance={setTreadmillDistance}
          metrics={metrics}
          notifyChange={notifyChange}
        />
      ) : (
        /* MODO SIMPLE: 1 INCLINACIÓN CONTINUA */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                📐 Inclinación %:
              </label>
              <input
                type="number"
                value={cleanInputVal(treadmillIncline, '11.5')}
                onChange={e => {
                  setTreadmillIncline(e.target.value);
                  notifyChange({ inclinePct: parseFloat(e.target.value) || 0 });
                }}
                placeholder="11.5"
                style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
                ⚡ Velocidad km/h:
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
                style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
                📍 Distancia (km):
              </label>
              <input
                type="number"
                step="0.01"
                value={cleanInputVal(treadmillDistance, '')}
                placeholder={metrics.distanceKm ? String(metrics.distanceKm) : '2.25'}
                onChange={e => {
                  setTreadmillDistance(e.target.value);
                  notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
                }}
                style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Accesos rápidos de inclinación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>Inclinación:</span>
            {[0, 5, 8, 10, 11.5, 12, 15].map(inc => (
              <button
                key={inc}
                type="button"
                onClick={() => {
                  setTreadmillIncline(String(inc));
                  notifyChange({ inclinePct: inc });
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '8px',
                  border: treadmillIncline === String(inc) ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                  background: treadmillIncline === String(inc) ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                  color: treadmillIncline === String(inc) ? 'var(--accent-blue)' : 'var(--text-muted)',
                  fontSize: '10.5px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {inc}%
              </button>
            ))}
            {metrics.elevationMeters > 0 && (
              <span style={{ fontSize: '10.5px', color: 'var(--accent-emerald)', fontWeight: '800', marginLeft: 'auto' }}>
                ⛰️ +{metrics.elevationMeters}m elevación ganada
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
