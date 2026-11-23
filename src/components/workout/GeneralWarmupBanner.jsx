import React from 'react';
import { Check, Flame } from 'lucide-react';

export default function GeneralWarmupBanner({ isVisible, isWarmupDone, onToggleWarmup }) {
  if (!isVisible) return null;

  return (
    <div
      onClick={onToggleWarmup}
      style={{
        background: isWarmupDone ? 'var(--accent-emerald-subtle)' : 'var(--bg-surface)',
        border: isWarmupDone ? '1px solid var(--accent-emerald)' : '1px dashed var(--accent-amber)',
        borderRadius: '12px',
        padding: '8px 12px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          background: isWarmupDone ? 'var(--accent-emerald)' : 'var(--accent-amber-subtle)',
          color: isWarmupDone ? '#000000' : 'var(--accent-amber)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isWarmupDone ? <Check size={15} strokeWidth={3} /> : <Flame size={15} />}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '12.5px', fontWeight: '800', color: isWarmupDone ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
            Calentamiento & Movilidad (5-10 min)
          </h4>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Caminata/bici suave + movilidad articular
          </span>
        </div>
      </div>
      <span
        className="font-mono-tech"
        style={{
          fontWeight: '800',
          fontSize: '10.5px',
          background: isWarmupDone ? 'var(--accent-emerald-subtle)' : 'var(--accent-amber-subtle)',
          color: isWarmupDone ? 'var(--accent-emerald)' : 'var(--accent-amber)',
          border: `1px solid ${isWarmupDone ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`,
          padding: '2px 7px',
          borderRadius: '6px'
        }}
      >
        {isWarmupDone ? '✓ LISTO' : 'MARCAR'}
      </span>
    </div>
  );
}
