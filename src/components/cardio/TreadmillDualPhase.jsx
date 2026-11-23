import React from 'react';
import { cleanInputVal } from '../../hooks/cardio/cardioStateHelper';

export default function TreadmillDualPhase({
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
  treadmillDistance,
  setTreadmillDistance,
  metrics,
  notifyChange
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* FASE A: 30 MIN INCLINADA */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-blue)', borderRadius: '14px', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px' }}>🟢</span>
            <strong style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent-blue)' }}>
              Fase A: Rampa Inclinada ({phaseMinutesA} min)
            </strong>
          </div>
          <span style={{ fontSize: '10px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
            Zona 2 Lipolítica & Cero Impacto
          </span>
        </div>
        <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', margin: '0 0 8px 0', lineHeight: '1.3' }}>
          A 120-135 BPM, las mitocondrias oxidan ácidos grasos libres sin vaciar reservas glucolíticas requeridas para el estudio. La pendiente reduce drásticamente el impacto articular.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
              ⏱️ Minutos:
            </label>
            <input
              type="number"
              value={cleanInputVal(phaseMinutesA, '30')}
              onChange={e => {
                setPhaseMinutesA(e.target.value);
                const totalM = (parseFloat(e.target.value) || 0) + (parseFloat(phaseMinutesB) || 0);
                notifyChange({ 
                  phaseMinutesA: parseFloat(e.target.value) || 0,
                  duration: totalM
                });
              }}
              style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--accent-blue)', fontWeight: '900', fontSize: '12px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
              📐 Inclinación %:
            </label>
            <input
              type="number"
              step="0.5"
              value={cleanInputVal(phaseInclineA, '11.5')}
              onChange={e => {
                setPhaseInclineA(e.target.value);
                notifyChange({ phaseInclineA: parseFloat(e.target.value) || 0 });
              }}
              style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--accent-blue)', fontWeight: '900', fontSize: '12px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
              ⚡ Vel km/h:
            </label>
            <input
              type="number"
              step="0.1"
              value={cleanInputVal(phaseSpeedA, '4.0')}
              onChange={e => {
                setPhaseSpeedA(e.target.value);
                notifyChange({ phaseSpeedA: parseFloat(e.target.value) || 0 });
              }}
              style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--accent-blue)', fontWeight: '900', fontSize: '12px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '800' }}>Inclinación Rápida:</span>
          {['10', '11', '11.5', '12'].map(inc => (
            <button
              key={inc}
              type="button"
              onClick={() => {
                setPhaseInclineA(inc);
                notifyChange({ phaseInclineA: parseFloat(inc) });
              }}
              style={{
                padding: '2px 7px',
                borderRadius: '6px',
                border: phaseInclineA === inc ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                background: phaseInclineA === inc ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                color: phaseInclineA === inc ? 'var(--accent-blue)' : 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {inc}%
            </button>
          ))}
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '800', marginLeft: '6px' }}>Vel:</span>
          {['3.8', '4.0', '4.2'].map(spd => (
            <button
              key={spd}
              type="button"
              onClick={() => {
                setPhaseSpeedA(spd);
                notifyChange({ phaseSpeedA: parseFloat(spd) });
              }}
              style={{
                padding: '2px 7px',
                borderRadius: '6px',
                border: phaseSpeedA === spd ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                background: phaseSpeedA === spd ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                color: phaseSpeedA === spd ? 'var(--accent-blue)' : 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {spd}
            </button>
          ))}
        </div>
      </div>

      {/* FASE B: 30 MIN PLANOS */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-emerald)', borderRadius: '14px', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px' }}>🔵</span>
            <strong style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent-emerald)' }}>
              Fase B: Terreno Plano ({phaseMinutesB} min)
            </strong>
          </div>
          <span style={{ fontSize: '10px', background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
            Descarga Aquiles & Sóleo
          </span>
        </div>
        <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', margin: '0 0 8px 0', lineHeight: '1.3' }}>
          Evita sobrecarga excéntrica en tendón de Aquiles tras 30 min continuos en pendiente, normaliza el ángulo tibio-tarsiano y promueve el retorno venoso y aclaramiento de lactato.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
              ⏱️ Minutos:
            </label>
            <input
              type="number"
              value={cleanInputVal(phaseMinutesB, '30')}
              onChange={e => {
                setPhaseMinutesB(e.target.value);
                const totalM = (parseFloat(phaseMinutesA) || 0) + (parseFloat(e.target.value) || 0);
                notifyChange({ 
                  phaseMinutesB: parseFloat(e.target.value) || 0,
                  duration: totalM
                });
              }}
              style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--accent-emerald)', fontWeight: '900', fontSize: '12px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
              📐 Inclinación %:
            </label>
            <input
              type="number"
              step="0.5"
              value={cleanInputVal(phaseInclineB, '0')}
              onChange={e => {
                setPhaseInclineB(e.target.value);
                notifyChange({ phaseInclineB: parseFloat(e.target.value) || 0 });
              }}
              style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--accent-emerald)', fontWeight: '900', fontSize: '12px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
              ⚡ Vel km/h:
            </label>
            <input
              type="number"
              step="0.1"
              value={cleanInputVal(phaseSpeedB, '4.8')}
              onChange={e => {
                setPhaseSpeedB(e.target.value);
                notifyChange({ phaseSpeedB: parseFloat(e.target.value) || 0 });
              }}
              style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--accent-emerald)', fontWeight: '900', fontSize: '12px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '800' }}>Inclinación:</span>
          <button
            type="button"
            onClick={() => {
              setPhaseInclineB('0');
              notifyChange({ phaseInclineB: 0 });
            }}
            style={{
              padding: '2px 7px',
              borderRadius: '6px',
              border: phaseInclineB === '0' ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
              background: phaseInclineB === '0' ? 'var(--accent-emerald-subtle)' : 'var(--bg-surface-secondary)',
              color: phaseInclineB === '0' ? 'var(--accent-emerald)' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            0% Plano (Oficial)
          </button>
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '800', marginLeft: '6px' }}>Vel:</span>
          {['4.5', '4.8', '5.0', '5.2'].map(spd => (
            <button
              key={spd}
              type="button"
              onClick={() => {
                setPhaseSpeedB(spd);
                notifyChange({ phaseSpeedB: parseFloat(spd) });
              }}
              style={{
                padding: '2px 7px',
                borderRadius: '6px',
                border: phaseSpeedB === spd ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                background: phaseSpeedB === spd ? 'var(--accent-emerald-subtle)' : 'var(--bg-surface-secondary)',
                color: phaseSpeedB === spd ? 'var(--accent-emerald)' : 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {spd}
            </button>
          ))}
        </div>
      </div>

      {/* RESUMEN CONSOLIDADO BIFÁSICO */}
      <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-main)' }}>
              ⏱️ Total: {(parseFloat(phaseMinutesA) || 0) + (parseFloat(phaseMinutesB) || 0)} min
            </span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#0369a1' }}>
              📍 ~{metrics.distanceKm} km
            </span>
            {metrics.elevationMeters > 0 && (
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669' }}>
                ⛰️ +{metrics.elevationMeters}m desnivel
              </span>
            )}
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#b45309' }}>
              🔥 {metrics.acsmKcal} kcal ACSM
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '800', whiteSpace: 'nowrap' }}>
            📍 Distancia Pantalla Gym:
          </label>
          <input
            type="number"
            step="0.01"
            placeholder={metrics.distanceKm ? String(metrics.distanceKm) : '3.8'}
            value={cleanInputVal(treadmillDistance, '')}
            onChange={e => {
              setTreadmillDistance(e.target.value);
              notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
            }}
            style={{ width: '100px', padding: '5px 8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontSize: '11px', fontWeight: '800', textAlign: 'center' }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>(Opcional, si difiere de la estimación)</span>
        </div>
      </div>
    </div>
  );
}
