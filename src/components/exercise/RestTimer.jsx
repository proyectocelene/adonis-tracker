import React from 'react';
import { Clock } from 'lucide-react';

export default function RestTimer({
  exercise,
  effectiveRestSeconds
}) {
  const restTimeDisplay = exercise?.restTime || (effectiveRestSeconds ? `${effectiveRestSeconds} s` : '90-120 s');

  return (
    <div style={{
      background: 'var(--bg-surface-secondary)',
      color: 'var(--text-secondary)',
      padding: '6px 10px',
      borderRadius: '8px',
      marginBottom: '8px',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Clock size={13} color="var(--accent-cyan)" />
      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
        Descanso recomendado: <strong className="font-mono-tech" style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>{restTimeDisplay}</strong>
      </span>
    </div>
  );
}
