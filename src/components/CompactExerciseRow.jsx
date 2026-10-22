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
  const targetReps = exercise.reps || exercise.targetReps || '10-12';
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
      }, 500);
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

  const inputFixedStyle = {
    height: '32px',
    minHeight: '32px',
    maxHeight: '32px',
    lineHeight: '32px',
    borderRadius: '6px',
    padding: '0 4px',
    fontSize: '13px',
    fontWeight: '700',
    textAlign: 'center',
    border: '1px solid var(--border-strong)',
    background: 'var(--bg-surface-secondary)',
    color: 'var(--text-main)',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const selectFixedStyle = {
    height: '32px',
    minHeight: '32px',
    maxHeight: '32px',
    lineHeight: '32px',
    borderRadius: '6px',
    padding: '0 4px',
    fontSize: '11px',
    fontWeight: '700',
    textAlign: 'center',
    border: '1px solid var(--border-strong)',
    background: 'var(--bg-surface-secondary)',
    color: 'var(--text-main)',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none'
  };

  return (
    <div 
      className="card" 
      style={{ 
        marginBottom: '10px', 
        borderRadius: 'var(--radius-md)', 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border-subtle)', 
        overflow: 'hidden' 
      }}
    >
      {/* CABECERA ULTRA COMPACTA CON REORDENAMIENTO */}
      <div 
        style={{ 
          padding: '8px 10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '8px', 
          background: 'var(--bg-surface)', 
          borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none' 
        }}
      >
        {/* BOTONES DE REORDENAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            title="Mover arriba"
            style={{
              width: '24px',
              height: '18px',
              borderRadius: '4px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isFirst ? 'not-allowed' : 'pointer',
              background: isFirst ? 'var(--bg-surface-secondary)' : 'var(--accent-blue-light)',
              color: isFirst ? 'var(--text-muted)' : 'var(--accent-blue)'
            }}
          >
            <ArrowUp size={11} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            title="Mover abajo"
            style={{
              width: '24px',
              height: '18px',
              borderRadius: '4px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLast ? 'not-allowed' : 'pointer',
              background: isLast ? 'var(--bg-surface-secondary)' : 'var(--accent-blue-light)',
              color: isLast ? 'var(--text-muted)' : 'var(--accent-blue)'
            }}
          >
            <ArrowDown size={11} />
          </button>
        </div>

        {/* NOMBRE Y GRUPO MUSCULAR */}
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={onToggleExpand}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '800', lineHeight: '1.25' }}>
              {exercise.name}
            </strong>
            {isFullyCompleted && (
              <span className="font-mono-tech" style={{ fontSize: '9px', background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                ✓ Listo
              </span>
            )}
          </div>
          <div className="font-mono-tech" style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '1px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span>{exercise.muscleGroup}</span>
            <span>• {completedSetsCount}/{totalSets} series ({targetReps} reps)</span>
          </div>
        </div>

        {/* CONTROLES RÁPIDOS Y EXPANDIR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          {isTimerActive ? (
            <span className="font-mono-tech" style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-red)', background: 'var(--accent-red-subtle)', padding: '3px 6px', borderRadius: '6px' }}>
              ⏱️ {restTimerSeconds}s
            </span>
          ) : (
            <button
              type="button"
              onClick={() => startRestTimer(parseInt(restPrescribed) || 90)}
              className="font-mono-tech"
              style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '3px 6px',
                color: 'var(--accent-cyan)',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Clock size={11} /> {restPrescribed}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleExpand}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '2px'
            }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            {/* Encabezados */}
            <div style={{ display: 'grid', gridTemplateColumns: '2rem 3.5rem 1fr 1fr 4.2rem 2.2rem', gap: '6px', alignItems: 'center', padding: '4px 8px', background: 'var(--bg-surface-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="font-mono-tech" style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center' }}>SET</div>
              <div className="font-mono-tech" style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center' }}>PREV</div>
              <div className="font-mono-tech" style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center' }}>LBS</div>
              <div className="font-mono-tech" style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center' }}>REPS</div>
              <div className="font-mono-tech" style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center' }}>RPE</div>
              <div></div>
            </div>

            {Array.from({ length: totalSets }).map((_, sIdx) => {
              const setNum = sIdx + 1;
              const setVal = exerciseData[setNum] || {};
              const prevVal = previousData[setNum] || {};
              const isDone = !!setVal.completed;

              return (
                <div
                  key={setNum}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2rem 3.5rem 1fr 1fr 4.2rem 2.2rem',
                    gap: '6px',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isDone ? 'var(--accent-emerald-subtle)' : 'var(--bg-surface)'
                  }}
                >
                  {/* No. Serie */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span className="font-mono-tech" style={{ fontSize: '12px', fontWeight: '900', color: isDone ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
                      {setNum}
                    </span>
                  </div>

                  {/* Referencia previa */}
                  <div className="font-mono-tech" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    {prevVal.weight ? (
                      <>
                        <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1 }}>{prevVal.weight}</span>
                        <span style={{ fontSize: '8.5px', fontWeight: '700', color: 'var(--text-muted)', marginTop: '1px', lineHeight: 1 }}>×{prevVal.reps || '?'}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </div>

                  {/* Peso Input */}
                  <div>
                    <input
                      type="number"
                      placeholder="-"
                      value={setVal.weight === null || setVal.weight === undefined || setVal.weight === 'null' ? '' : setVal.weight}
                      onChange={(e) => {
                        onUpdateSet(setNum, { ...setVal, weight: e.target.value });
                      }}
                      className="font-mono-tech"
                      style={{
                        ...inputFixedStyle,
                        ...(isDone ? { borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' } : {})
                      }}
                    />
                  </div>

                  {/* Reps Input */}
                  <div>
                    <input
                      type="number"
                      placeholder="-"
                      value={setVal.reps === null || setVal.reps === undefined || setVal.reps === 'null' ? '' : setVal.reps}
                      onChange={(e) => {
                        onUpdateSet(setNum, { ...setVal, reps: e.target.value });
                      }}
                      className="font-mono-tech"
                      style={{
                        ...inputFixedStyle,
                        ...(isDone ? { borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' } : {})
                      }}
                    />
                  </div>

                  {/* RPE Selector */}
                  <div>
                    <select
                      value={setVal.rpe || '8'}
                      onChange={(e) => {
                        onUpdateSet(setNum, { ...setVal, rpe: e.target.value });
                      }}
                      className="font-mono-tech"
                      style={{
                        ...selectFixedStyle,
                        ...(isDone ? { borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' } : {})
                      }}
                    >
                      <option value="6">RPE 6</option>
                      <option value="7">RPE 7</option>
                      <option value="8">RPE 8</option>
                      <option value="8.5">RPE 8.5</option>
                      <option value="9">RPE 9</option>
                      <option value="9.5">RPE 9.5</option>
                      <option value="10">RPE 10</option>
                    </select>
                  </div>

                  {/* Checkbox de serie lista */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: isDone ? 'var(--accent-emerald)' : 'var(--bg-surface-secondary)',
                        color: isDone ? '#000000' : 'var(--text-muted)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Check size={14} strokeWidth={3.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* NOTA BIOMECÁNICA EXPANDIBLE */}
          {exercise.biomechanics && (
            <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px', color: 'var(--accent-blue)', fontWeight: '800' }}>
                <Info size={13} />
                <span>Técnica & Biomecánica:</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.4, color: 'var(--text-muted)', fontSize: '11px' }}>
                {exercise.biomechanics}
              </p>
            </div>
          )}

          {/* SECCIÓN NOTAS */}
          <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700' }}>
              <MessageSquare size={13} color="var(--text-muted)" />
              <span>Notas del Ejercicio</span>
            </div>
            <textarea
              rows={2}
              placeholder="Observaciones de técnica, sensaciones..."
              value={exerciseNote}
              onChange={(e) => onUpdateExerciseMeta(exercise.id, { note: e.target.value })}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-strong)',
                fontSize: '12px',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                resize: 'none',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
              <button
                type="button"
                onClick={() => {
                  if (onUpdateExerciseMeta) {
                    onUpdateExerciseMeta(exercise.id, { note: exerciseNote });
                  }
                }}
                style={{
                  background: 'var(--accent-blue)',
                  color: '#000000',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
