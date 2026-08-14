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

  const inputFixedStyle = {
    height: '32px',
    maxHeight: '32px',
    borderRadius: '6px',
    padding: '0 4px',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    width: '100%',
    boxSizing: 'border-box'
  };

  const selectFixedStyle = {
    height: '32px',
    maxHeight: '32px',
    borderRadius: '6px',
    padding: '0 2px',
    fontSize: '11px',
    fontWeight: '600',
    textAlign: 'center',
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div className="mb-3 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* CABECERA ULTRA COMPACTA CON REORDENAMIENTO */}
      <div className="p-3 flex items-center justify-between gap-2.5 bg-white border-b border-slate-100">
        {/* BOTONES DE REORDENAR (GIMNASIO FLEXIBLE: MÁQUINA OCUPADA) */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            title="Mover arriba en la rutina"
            className={`w-6 h-5 rounded border-none flex items-center justify-center cursor-pointer transition-colors ${
              isFirst ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            title="Mover abajo (si la máquina está ocupada)"
            className={`w-6 h-5 rounded border-none flex items-center justify-center cursor-pointer transition-colors ${
              isLast ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <ArrowDown size={12} />
          </button>
        </div>

        {/* NOMBRE Y GRUPO MUSCULAR */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-1.5 flex-wrap">
            <strong className="text-sm text-slate-800 font-bold leading-tight">
              {exercise.name}
            </strong>
            {isFullyCompleted && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 py-0.5 px-1.5 rounded-md font-semibold">✓ Listo</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex gap-2 flex-wrap">
            <span>{exercise.muscleGroup}</span>
            <span>• {completedSetsCount}/{totalSets} series ({targetReps} reps)</span>
          </div>
        </div>

        {/* CONTROLES RÁPIDOS Y EXPANDIR */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isTimerActive ? (
            <span className="text-xs font-bold text-red-600 bg-red-50 py-1 px-2 rounded-lg">
              ⏱️ {restTimerSeconds}s
            </span>
          ) : (
            <button
              type="button"
              onClick={() => startRestTimer(parseInt(restPrescribed) || 90)}
              className="bg-slate-100 border-none rounded-lg py-1 px-2 text-slate-600 text-[11px] font-semibold cursor-pointer flex items-center gap-1 hover:bg-slate-200 transition-colors"
            >
              <Clock size={12} /> {restPrescribed}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleExpand}
            className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 p-1"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
      <div className="mt-3 flex flex-col w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Encabezados */}
        <div className="grid grid-cols-[2.2rem_3.8rem_1fr_1fr_4.8rem_2.2rem] gap-2 items-center px-3 py-1.5 bg-slate-50 border-b border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">SET</div>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">PREV</div>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">LBS</div>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">REPS</div>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">RPE</div>
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
              className={`grid grid-cols-[2.2rem_3.8rem_1fr_1fr_4.8rem_2.2rem] gap-2 items-center px-3 py-1.5 border-b border-slate-100 last:border-0 transition-colors ${
                isDone ? 'bg-emerald-50/40' : 'bg-white'
              }`}
            >
              {/* No. Serie */}
              <div className="flex justify-center items-center">
                <span className={`text-sm font-bold ${isDone ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {setNum}
                </span>
              </div>

              {/* Referencia previa */}
              <div className="flex flex-col items-center justify-center text-center">
                {prevVal.weight ? (
                  <>
                    <span className="text-[11px] font-semibold text-slate-600 leading-none">{prevVal.weight}</span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-0.5 leading-none">x {prevVal.reps || '?'}</span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-300">—</span>
                )}
              </div>

              {/* Peso Input */}
              <div>
                <input
                  type="number"
                  placeholder="-"
                  value={setVal.weight ?? ''}
                  onChange={(e) => {
                    onUpdateSet(setNum, { ...setVal, weight: e.target.value });
                  }}
                  style={{
                    ...inputFixedStyle,
                    ...(isDone ? { background: '#ecfdf5', borderColor: '#86efac', color: '#064e3b' } : {})
                  }}
                />
              </div>

              {/* Reps Input */}
              <div>
                <input
                  type="number"
                  placeholder="-"
                  value={setVal.reps ?? ''}
                  onChange={(e) => {
                    onUpdateSet(setNum, { ...setVal, reps: e.target.value });
                  }}
                  style={{
                    ...inputFixedStyle,
                    ...(isDone ? { background: '#ecfdf5', borderColor: '#86efac', color: '#064e3b' } : {})
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
                  style={{
                    ...selectFixedStyle,
                    ...(isDone
                      ? { background: '#ecfdf5', borderColor: '#86efac', color: '#065f46' }
                      : setVal.rpe === '8'
                        ? { background: '#eff6ff', borderColor: '#93c5fd', color: '#2563eb' }
                        : {})
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
              <div className="flex justify-center items-center">
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isDone 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <Check size={14} strokeWidth={3.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* NOTA BIOMECÁNICA EXPANDIBLE (SOLO SI SE EXPANDE) */}
      {exercise.biomechanics && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
          <div className="flex items-center gap-1.5 mb-1 text-blue-600 font-bold">
            <Info size={14} />
            <span>Técnica & Biomecánica:</span>
          </div>
          <p className="m-0 leading-relaxed text-slate-600">
            {exercise.biomechanics}
          </p>
        </div>
      )}

      {/* SECCIÓN MULTIMEDIA & NOTAS (SOLO SI SE EXPANDE) */}
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 mb-2 text-slate-700 text-xs font-semibold">
            <MessageSquare size={14} className="text-slate-500" />
            <span>Notas del Ejercicio</span>
          </div>
          <textarea
            rows={2}
            placeholder="Añade observaciones sobre técnica, peso..."
            value={exerciseNote}
            onChange={(e) => onUpdateExerciseMeta(exercise.id, { note: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 resize-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => {
                if (onUpdateExerciseMeta) {
                  onUpdateExerciseMeta(exercise.id, { note: exerciseNote });
                }
              }}
              className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
