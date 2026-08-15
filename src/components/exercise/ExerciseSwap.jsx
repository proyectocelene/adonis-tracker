import React from 'react';
import { UNIFIED_EXERCISE_LIBRARY } from '../../data/unifiedExerciseLibrary';

export default function ExerciseSwap({
  exercise,
  onSwapExercise,
  handleExecuteSwap,
  modal
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {exercise.originalName && (
        <div style={{ background: '#fef3c7', border: '1.5px solid #f59e0b', borderRadius: '12px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#92400e', fontWeight: '800', display: 'block' }}>🔄 Ejercicio Sustituido</span>
            <strong style={{ fontSize: '12px', color: '#78350f' }}>Original: {exercise.originalName}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onSwapExercise) onSwapExercise(exercise.id, null);
              modal.showAlert({ title: "↺ Ejercicio Restaurado", message: `Se restableció a "${exercise.originalName}".`, variant: "info" });
            }}
            style={{ background: '#d97706', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
          >
            ↺ Restaurar
          </button>
        </div>
      )}

      <span style={{ fontSize: '11px', color: '#334155', fontWeight: '800' }}>
        Sustitutos equivalentes de la base de datos oficial:
      </span>

      {exercise.equivalents && exercise.equivalents.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          {exercise.equivalents.map(eq => (
            <button
              key={eq.id}
              type="button"
              onClick={() => handleExecuteSwap(eq.name)}
              style={{
                background: '#ffffff',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '8px 10px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '12px', color: '#065f46', fontWeight: '900' }}>{eq.name}</strong>
                <span style={{ fontSize: '10px', color: '#475569' }}>{eq.desc}</span>
              </div>
              <span className="badge badge-green" style={{ fontSize: '10px', flexShrink: 0, fontWeight: '900' }}>Sustituir</span>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '4px 0' }}>
          No hay sustitutos automáticos preconfigurados para este ejercicio. Puedes elegir una máquina del catálogo a continuación:
        </div>
      )}

      <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '14px', border: '1.5px solid #e2e8f0', width: '100%' }}>
        <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#0f172a', fontWeight: '900' }}>
          O elige cualquier máquina del catálogo unificado:
        </label>
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              const item = UNIFIED_EXERCISE_LIBRARY.find(x => x.id === e.target.value);
              if (item) handleExecuteSwap(item.name);
            }
          }}
          style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '12px', fontWeight: '800', background: '#ffffff' }}
        >
          <option value="">👆 Seleccionar máquina oficial...</option>
          {UNIFIED_EXERCISE_LIBRARY.map(item => (
            <option key={item.id} value={item.id}>
              [{item.muscleGroup}] • {item.name} ({item.equipment})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
