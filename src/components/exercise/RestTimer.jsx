import React from 'react';
import { Clock } from 'lucide-react';

export default function RestTimer({
  exercise,
  effectiveRestSeconds
}) {
  const restTimeDisplay = exercise?.restTime || (effectiveRestSeconds ? `${effectiveRestSeconds} s` : '90-120 s');

  return (
    <div style={{
      background: '#f8fafc',
      color: '#334155',
      padding: '7px 12px',
      borderRadius: '12px',
      marginBottom: '10px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Clock size={15} color="#0284c7" />
      <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
        Descanso recomendado: <strong style={{ color: '#0369a1', fontWeight: '800' }}>{restTimeDisplay}</strong>
      </span>
    </div>
  );
}
