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
            background: '#f8fafc',
            color: '#0f172a',
            border: '1.5px solid #cbd5e1',
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
          {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} color="#0066ff" />}
          {copied ? '¡Copiado al Portapapeles!' : '📋 Copiar Formato de Texto'}
        </button>

        <button
          type="button"
          onClick={handleResetToDefault}
          style={{
            background: '#fff1f2',
            color: '#e11d48',
            border: '1.5px solid #fecdd3',
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
            <div key={day.id || dIdx} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '14px' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '13px', color: '#0f172a', fontWeight: '900' }}>
                  {day.name}
                </strong>
                <span className="badge badge-blue" style={{ fontSize: '10px', fontWeight: '800' }}>
                  {allEx.length} {allEx.length === 1 ? 'ejercicio' : 'ejercicios'}
                </span>
              </div>

              {allEx.length === 0 ? (
                <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                  Día de descanso muscular programado.
                </span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {allEx.map((ex, eIdx) => (
                    <div key={ex.id || eIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px' }}>
                      <span style={{ fontWeight: '700', color: '#1e293b' }}>
                        {eIdx + 1}. {ex.name}
                      </span>
                      <span style={{ color: '#0066ff', fontWeight: '800' }}>
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
