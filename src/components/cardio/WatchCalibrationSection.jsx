import React, { useState, useEffect } from 'react';
import { Watch, ChevronDown, ChevronUp } from 'lucide-react';
import { cleanInputVal } from '../../hooks/cardio/cardioStateHelper';

export default function WatchCalibrationSection({
  watchHrAvg,
  setWatchHrAvg,
  watchHrMax,
  setWatchHrMax,
  watchSteps,
  setWatchSteps,
  watchKcal,
  setWatchKcal,
  cardioNotesInput,
  setCardioNotesInput,
  metrics = {},
  notifyChange
}) {
  const hasWatchData = Boolean(metrics.hasWatchData);
  const [isOpen, setIsOpen] = useState(hasWatchData);

  useEffect(() => {
    if (hasWatchData) {
      setIsOpen(true);
    }
  }, [hasWatchData]);

  const zoneInfo = metrics.zoneInfo;
  const acsmNetKcal = metrics.acsmNetKcal ?? metrics.cardioKcal ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ background: 'var(--bg-surface-secondary)', borderRadius: '14px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            color: 'var(--text-main)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Watch size={15} color={hasWatchData ? '#059669' : 'var(--text-muted)'} />
            <span style={{ fontSize: '12px', fontWeight: '900' }}>⌚ Datos del reloj (opcional)</span>
            <span style={{
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 7px',
              borderRadius: '8px',
              background: hasWatchData ? 'rgba(16, 185, 129, 0.16)' : 'var(--bg-card)',
              color: hasWatchData ? '#059669' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)'
            }}>
              {hasWatchData ? `Reloj activo${zoneInfo ? ` · ${zoneInfo.zone}` : ''}` : 'Solo caminadora'}
            </span>
          </div>
          {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </button>

        {isOpen && (
          <div style={{ padding: '0 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  FC Prom (lpm)
                </label>
                <input
                  type="number"
                  value={cleanInputVal(watchHrAvg, '')}
                  placeholder="Ej. 128"
                  onChange={e => {
                    setWatchHrAvg(e.target.value);
                    const val = parseFloat(e.target.value);
                    notifyChange({ watchHrAvg: val > 0 ? Math.round(val) : null });
                  }}
                  style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '9px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  FC Máx (lpm)
                </label>
                <input
                  type="number"
                  value={cleanInputVal(watchHrMax, '')}
                  placeholder="Ej. 138"
                  onChange={e => {
                    setWatchHrMax(e.target.value);
                    const val = parseFloat(e.target.value);
                    notifyChange({ watchHrMax: val > 0 ? Math.round(val) : null });
                  }}
                  style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '9px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Pasos reloj
                </label>
                <input
                  type="number"
                  value={cleanInputVal(watchSteps, '')}
                  placeholder="Ej. 4120"
                  onChange={e => {
                    setWatchSteps(e.target.value);
                    const val = parseFloat(e.target.value);
                    notifyChange({ watchSteps: val > 0 ? Math.round(val) : null });
                  }}
                  style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '9px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Kcal reloj (informativo)
                </label>
                <input
                  type="number"
                  value={cleanInputVal(watchKcal, '')}
                  placeholder="Ej. 290"
                  onChange={e => {
                    setWatchKcal(e.target.value);
                    const val = parseFloat(e.target.value);
                    notifyChange({ watchKcal: val > 0 ? Math.round(val) : null });
                  }}
                  style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '9px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {zoneInfo && (
              <div style={{
                padding: '7px 10px',
                borderRadius: '10px',
                fontSize: '11.5px',
                fontWeight: '800',
                background: zoneInfo.zone === 'Z2' ? 'rgba(16, 185, 129, 0.14)' : zoneInfo.zone === 'Z1' ? 'rgba(59, 130, 246, 0.14)' : 'rgba(245, 158, 11, 0.16)',
                color: zoneInfo.zone === 'Z2' ? '#059669' : zoneInfo.zone === 'Z1' ? '#2563eb' : '#d97706'
              }}>
                {zoneInfo.zone === 'Z2' ? '✅ Z2 Óptima' : zoneInfo.zone === 'Z1' ? '🔵 Z1' : '⚠️ Z3+'} — {zoneInfo.label}: {zoneInfo.advice}
              </div>
            )}

            {metrics.watchKcal > 0 && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                Comparativa: ACSM netas {acsmNetKcal} kcal vs Reloj {metrics.watchKcal} kcal (la app contabiliza ACSM netas).
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="text"
        value={cleanInputVal(cardioNotesInput, '')}
        placeholder="Notas opcionales de la sesión de cardio..."
        onChange={e => {
          setCardioNotesInput(e.target.value);
          notifyChange({ notes: e.target.value });
        }}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-secondary)',
          color: 'var(--text-main)',
          fontSize: '12px',
          fontWeight: '600',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}
