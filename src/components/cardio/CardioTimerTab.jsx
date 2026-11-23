import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function CardioTimerTab({
  timerRunning,
  timerSeconds,
  onToggleTimer,
  onResetTimer,
  onApplyTimer,
  formatTimer
}) {
  return (
    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1.5px solid #cbd5e1', textAlign: 'center' }}>
      <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
        Cronómetro de Sesión de Cardio
      </div>
      <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', fontFamily: 'monospace', marginBottom: '16px' }}>
        {formatTimer(timerSeconds)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={onToggleTimer}
          style={{
            padding: '10px 24px',
            borderRadius: '14px',
            background: timerRunning ? '#dc2626' : '#059669',
            color: '#ffffff',
            border: 'none',
            fontWeight: '900',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {timerRunning ? <Pause size={18} /> : <Play size={18} />}
          {timerRunning ? 'Pausar Cardio' : 'Iniciar Cardio'}
        </button>

        <button
          type="button"
          onClick={onResetTimer}
          style={{
            padding: '10px 16px',
            borderRadius: '14px',
            background: '#f1f5f9',
            color: '#475569',
            border: '1.5px solid #cbd5e1',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RotateCcw size={16} /> Reiniciar
        </button>
      </div>

      {timerSeconds > 0 && (
        <button
          type="button"
          onClick={onApplyTimer}
          style={{
            padding: '10px 20px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            border: 'none',
            fontWeight: '900',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
          }}
        >
          ✓ Aplicar {Math.round((timerSeconds / 60) * 10) / 10} min al Registro Oficial
        </button>
      )}
    </div>
  );
}
