import React from 'react';

export default function ExerciseRow({ exercise, history, onUpdate }) {
  const isCompleted = history && history.completed;
  const currentWeight = history?.weight || '';
  
  return (
    <div className="glass-panel" style={{ padding: '16px', marginBottom: '16px' }}>
      <div className="flex-between" style={{ marginBottom: '12px' }}>
        <h3 style={{ color: 'var(--accent-cyan)', flex: 1 }}>{exercise.name}</h3>
        <label className="custom-checkbox">
          <input 
            type="checkbox" 
            checked={isCompleted} 
            onChange={(e) => onUpdate({ completed: e.target.checked })} 
            style={{ opacity: 0, position: 'absolute' }} 
          />
        </label>
      </div>
      
      <p style={{ marginBottom: '12px', fontSize: '13px' }}>
        <strong style={{ color: 'var(--text-main)' }}>{exercise.sets} series x {exercise.reps} reps</strong>
      </p>
      
      {exercise.notes && (
        <p style={{ marginBottom: '16px', fontStyle: 'italic', fontSize: '12px' }}>
          Coach: {exercise.notes}
        </p>
      )}
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Peso (lbs):</span>
        <input 
          type="number" 
          value={currentWeight}
          placeholder="Ej. 80"
          onChange={(e) => onUpdate({ weight: e.target.value })}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}
