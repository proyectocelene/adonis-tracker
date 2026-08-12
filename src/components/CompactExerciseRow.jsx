import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown, Check, Clock, Info, MessageSquare } from 'lucide-react';

export default function CompactExerciseRow({
  exercise,
  exerciseData = {},
  previousData = {},
  onUpdateSet,
  onUpdateExerciseMeta,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isExpanded,
  onToggleExpand
}) {
  const totalSets = parseInt(exercise.sets) || 3;
  const targetReps = exercise.reps || '10-12';
  const restPrescribed = exercise.restTime || '90 s';

  // Temporizador de descanso local robusto (inmune al bloqueo de pantalla)
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [targetTime, setTargetTime] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && targetTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((targetTime - now) / 1000));
        
        setRestTimerSeconds(remaining);

        if (remaining <= 0) {
          setIsTimerActive(false);
          setTargetTime(null);
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
      }, 500); // Check twice a second for better visual accuracy when unlocking
    }
    return () => clearInterval(interval);
  }, [isTimerActive, targetTime]);

  const startRestTimer = (seconds = 90) => {
    setTargetTime(Date.now() + seconds * 1000);
    setRestTimerSeconds(seconds);
    setIsTimerActive(true);
  };

  const completedSetsCount = (() => {
    let c = 0;
    for (let s = 1; s <= totalSets; s++) {
      if (exerciseData[s]?.completed) c++;
    }
    return c;
  })();

  const isFullyCompleted = completedSetsCount === totalSets && totalSets > 0;

  const exerciseNote = exerciseData.note || '';

  return (
    <div 
      className="card animate-fade"
      style={{
        padding: '12px 14px',
        marginBottom: '10px',
        borderRadius: '18px',
        background: isFullyCompleted ? '#f0fdf4' : '#ffffff',
        border: isFullyCompleted ? '1.5px solid #86efac' : '1.5px solid #e2e8f0',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* CABECERA ULTRA COMPACTA CON REORDENAMIENTO */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        {/* BOTONES DE REORDENAR (GIMNASIO FLEXIBLE: MÁQUINA OCUPADA) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            title="Mover arriba en la rutina"
            style={{
              width: '24px',
              height: '22px',
              borderRadius: '6px',
              border: 'none',
              background: isFirst ? '#f1f5f9' : '#eff6ff',
              color: isFirst ? '#cbd5e1' : '#0066ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isFirst ? 'not-allowed' : 'pointer'
            }}
          >
            <ArrowUp size={13} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            title="Mover abajo (si la máquina está ocupada)"
            style={{
              width: '24px',
              height: '22px',
              borderRadius: '6px',
              border: 'none',
              background: isLast ? '#f1f5f9' : '#eff6ff',
              color: isLast ? '#cbd5e1' : '#0066ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLast ? 'not-allowed' : 'pointer'
            }}
          >
            <ArrowDown size={13} />
          </button>
        </div>

        {/* NOMBRE Y GRUPO MUSCULAR */}
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={onToggleExpand}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '800', lineHeight: '1.3' }}>
              {exercise.name}
            </strong>
            {isFullyCompleted && (
              <span className="badge badge-green" style={{ fontSize: '10px', padding: '2px 6px' }}>✓ Listo</span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginTop: '2px', display: 'flex', gap: '8px' }}>
            <span>{exercise.muscleGroup}</span>
            <span>• {completedSetsCount}/{totalSets} series ({targetReps} reps)</span>
          </div>
        </div>

        {/* CONTROLES RÁPIDOS Y EXPANDIR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {isTimerActive ? (
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#dc2626', background: '#fee2e2', padding: '4px 8px', borderRadius: '10px' }}>
              ⏱️ {restTimerSeconds}s
            </span>
          ) : (
            <button
              type="button"
              onClick={() => startRestTimer(parseInt(restPrescribed) || 90)}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '6px 8px', color: '#475569', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Clock size={13} /> {restPrescribed}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleExpand}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* DETALLE DE SERIES EN FILAS ALINEADAS */}
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {Array.from({ length: totalSets }).map((_, sIdx) => {
          const setNum = sIdx + 1;
          const setVal = exerciseData[setNum] || {};
          const prevVal = previousData[setNum] || {};
          const isDone = !!setVal.completed;

          return (
            <div
              key={setNum}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                background: isDone ? '#dcfce7' : '#f8fafc',
                padding: '6px 10px',
                borderRadius: '12px',
                border: isDone ? '1px solid #86efac' : '1px solid #e2e8f0'
              }}
            >
              {/* No. Serie */}
              <span style={{ fontSize: '12px', fontWeight: '800', color: isDone ? '#166534' : '#475569', width: '24px' }}>
                S{setNum}
              </span>

              {/* Referencia previa */}
              <span style={{ fontSize: '11px', color: '#94a3b8', width: '75px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {prevVal.weight ? `${prevVal.weight}${prevVal.unit || 'lbs'}` : `—`}
              </span>

              {/* Peso Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="number"
                  placeholder="Peso"
                  value={setVal.weight ?? ''}
                  onChange={(e) => {
                    onUpdateSet(setNum, { ...setVal, weight: e.target.value });
                  }}
                  style={{
                    width: '60px',
                    padding: '5px 6px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '800',
                    textAlign: 'center',
                    background: '#ffffff'
                  }}
                />
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>lbs</span>
              </div>

              {/* Reps Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="number"
                  placeholder="Reps"
                  value={setVal.reps ?? ''}
                  onChange={(e) => {
                    onUpdateSet(setNum, { ...setVal, reps: e.target.value });
                  }}
                  style={{
                    width: '52px',
                    padding: '5px 6px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '800',
                    textAlign: 'center',
                    background: '#ffffff'
                  }}
                />
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>reps</span>
              </div>

              {/* Checkbox de serie lista */}
              <button
                type="button"
                onClick={() => {
                  const newCompleted = !isDone;
                  onUpdateSet(setNum, {
                    ...setVal,
                    completed: newCompleted,
                    weight: setVal.weight || prevVal.weight || '',
                    reps: setVal.reps || prevVal.reps || parseInt(targetReps) || 10
                  });
                  if (newCompleted && !isTimerActive) {
                    startRestTimer(parseInt(restPrescribed) || 90);
                  }
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isDone ? '#10b981' : '#cbd5e1',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isDone ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
          );
        })}
      </div>

      {/* NOTA BIOMECÁNICA EXPANDIBLE (SOLO SI SE EXPANDE) */}
      {isExpanded && exercise.biomechanics && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0', fontSize: '12px', color: '#334155', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Info size={14} color="#0066ff" />
            <strong style={{ color: '#0f172a', fontWeight: '800' }}>Técnica & Biomecánica:</strong>
          </div>
          <p style={{ margin: 0, lineHeight: '1.4', color: '#475569', fontWeight: '500' }}>
            {exercise.biomechanics}
          </p>
        </div>
      )}

      {/* SECCIÓN MULTIMEDIA & NOTAS (SOLO SI SE EXPANDE) */}
      {isExpanded && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Notas */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <MessageSquare size={16} color="#64748b" style={{ marginTop: '6px' }} />
            <textarea
              placeholder="Notas de la sesión (ej. dolor en hombro izquierdo, subir peso la próxima)"
              value={exerciseNote}
              onChange={(e) => onUpdateExerciseMeta(exercise.id, { note: e.target.value })}
              style={{ flex: 1, padding: '8px 10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px', minHeight: '40px', resize: 'vertical', background: '#f8fafc' }}
            />
        </div>
      )}
    </div>
  );
}
