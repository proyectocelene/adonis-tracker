import React from 'react';
import { Clock, Play, Square, Plus } from 'lucide-react';
import { useGlobalTimer, parseRestSecondsFromPrescribed, formatTimerMMSS } from '../../contexts/GlobalTimerContext';

export default function RestTimer({
  exercise,
  effectiveRestSeconds
}) {
  const timer = useGlobalTimer();
  const restTimeDisplay = exercise?.restTime || (effectiveRestSeconds ? `${effectiveRestSeconds} s` : '90-120 s');
  const defaultSeconds = parseRestSecondsFromPrescribed(exercise?.restTime || effectiveRestSeconds, 90);
  const isActive = Boolean(timer?.isTimerActive);
  const remaining = timer?.restTimerSeconds || 0;

  return (
    <div style={{
      background: isActive ? 'var(--accent-cyan-subtle)' : 'var(--bg-surface-secondary)',
      color: 'var(--text-secondary)',
      padding: '6px 10px',
      borderRadius: '8px',
      marginBottom: '8px',
      border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '6px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
        <Clock size={13} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Descanso: <strong className="font-mono-tech" style={{ color: 'var(--accent-cyan)', fontWeight: '900' }}>{restTimeDisplay}</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {isActive ? (
          <>
            <span
              className="font-mono-tech"
              style={{
                fontSize: '12px',
                fontWeight: '900',
                color: 'var(--accent-cyan)',
                padding: '1px 6px',
                borderRadius: '6px',
                background: 'var(--bg-surface)'
              }}
            >
              {formatTimerMMSS(remaining)}
            </span>
            <button
              type="button"
              onClick={() => timer?.addSeconds?.(30)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                padding: '3px 6px',
                borderRadius: '6px',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '9.5px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
              title="Sumar 30 segundos"
            >
              <Plus size={10} />30s
            </button>
            <button
              type="button"
              onClick={() => timer?.stopTimer?.()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                padding: '3px 6px',
                borderRadius: '6px',
                border: '1px solid var(--accent-red)',
                background: 'var(--accent-red-subtle)',
                color: 'var(--accent-red)',
                fontSize: '9.5px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
              title="Detener temporizador"
            >
              <Square size={9} />Detener
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => timer?.startTimer?.(defaultSeconds, exercise?.name)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid var(--accent-cyan)',
              background: 'var(--bg-surface)',
              color: 'var(--accent-cyan)',
              fontSize: '9.5px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
            title={`Iniciar descanso (${defaultSeconds}s)`}
          >
            <Play size={9} />Iniciar
          </button>
        )}
      </div>
    </div>
  );
}
