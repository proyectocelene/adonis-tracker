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
        <div style={{ background: 'var(--accent-amber-subtle)', border: '1.5px solid var(--accent-amber)', borderRadius: '12px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: '800', display: 'block' }}>🔄 Ejercicio Sustituido</span>
            <strong style={{ fontSize: '12px', color: 'var(--text-main)' }}>Original: {exercise.originalName}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onSwapExercise) onSwapExercise(exercise.id, null);
              modal.showAlert({ title: "↺ Ejercicio Restaurado", message: `Se restableció a "${exercise.originalName}".`, variant: "info" });
            }}
            style={{ background: 'var(--accent-amber)', color: '#000000', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
          >
            ↺ Restaurar
          </button>
        </div>
      )}

      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800' }}>
        Sustitutos equivalentes de la base de datos oficial:
      </span>

      {exercise.equivalents && exercise.equivalents.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          {exercise.equivalents.map(eq => (
            <button
              key={eq.id}
              type="button"
              onClick={() => handleExecuteSwap(eq)}
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--accent-emerald)',
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
                <strong style={{ display: 'block', fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: '900' }}>{eq.name}</strong>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{eq.desc}</span>
              </div>
              <span className="badge badge-green" style={{ fontSize: '10px', flexShrink: 0, fontWeight: '900' }}>Sustituir</span>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
          No hay sustitutos automáticos preconfigurados para este ejercicio. Puedes elegir una máquina del catálogo a continuación:
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '14px', border: '1px solid var(--border-subtle)', width: '100%' }}>
        <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: 'var(--text-main)', fontWeight: '900' }}>
          O elige cualquier máquina del catálogo unificado:
        </label>
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              const item = UNIFIED_EXERCISE_LIBRARY.find(x => x.id === e.target.value);
              if (item) handleExecuteSwap(item);
            }
          }}
          style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: '800', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
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
