import React from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function RoutineActiveView({
  currentDays = [],
  customExercisesMap = {},
  copied,
  handleCopyText,
  handleResetToDefault
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={handleCopyText}
          style={{
            flex: 1,
            background: 'var(--bg-surface-secondary)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-subtle)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} color="var(--accent-blue)" />}
          {copied ? '¡Copiado al Portapapeles!' : '📋 Copiar Formato de Texto'}
        </button>

        <button
          type="button"
          onClick={handleResetToDefault}
          style={{
            background: 'var(--accent-red-subtle)',
            color: 'var(--accent-red)',
            border: '1px solid var(--accent-red)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Restaurar Protocolo Científico Original"
        >
          <RefreshCw size={14} /> Restaurar Base
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
        {currentDays.map((day, dIdx) => {
          const customs = customExercisesMap[day.id] || [];
          const allEx = [...(day.exercises || []), ...customs];

          return (
            <div key={day.id || dIdx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '14px' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '900' }}>
                  {day.name}
                </strong>
                <span className="badge badge-blue" style={{ fontSize: '10px', fontWeight: '800' }}>
                  {allEx.length} {allEx.length === 1 ? 'ejercicio' : 'ejercicios'}
                </span>
              </div>

              {allEx.length === 0 ? (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Día de descanso muscular programado.
                </span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {allEx.map((ex, eIdx) => (
                    <div key={ex.id || eIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-secondary)', padding: '6px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '11px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        {eIdx + 1}. {ex.name}
                      </span>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: '800' }}>
                        {ex.sets}x{ex.reps} ({ex.restTime || '90s'})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
