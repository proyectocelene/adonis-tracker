import React from 'react';
import { Flame, Check, Plus, Minus } from 'lucide-react';
import { ErrorBoundary } from '../common/ErrorBoundary';

function SetLoggerContent({
  exerciseData,
  previousData,
  totalSets,
  targetReps,
  suggestedWarmupWeight,
  warmupSetVal,
  isWarmupSetDone,
  handleSetChange,
  toggleSetComplete,
  handleAddSet,
  handleRemoveSet
}) {
  const gridRowClass = "grid grid-cols-[2.2rem_3.8rem_1fr_1fr_4.8rem_2.2rem] gap-2 items-center px-3 py-1.5";

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
    <div className="flex flex-col w-full mb-4">
      {/* Contenedor Principal (Tabla) */}
      <div className="flex flex-col w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Encabezados */}
        <div className={`${gridRowClass} bg-slate-50 border-b border-slate-200`}>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">SET</div>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">PREV</div>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">LBS</div>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">REPS</div>
          <div className="text-[10px] font-bold text-slate-500 text-center tracking-wide">RPE</div>
          <div></div>
        </div>

        {/* Fila S0 (Calentamiento) */}
        <div className={`${gridRowClass} border-b border-slate-100 transition-colors ${
          isWarmupSetDone ? 'bg-amber-50/50' : 'bg-white'
        }`}>
          {/* Label */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-amber-500">S0</span>
            <Flame size={12} className="text-amber-400 mt-0.5" />
          </div>
          
          {/* Previo/Objetivo */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-slate-400 leading-none">OBJ</span>
            <span className="text-[11px] font-bold text-amber-600 mt-0.5 leading-none">~{suggestedWarmupWeight}</span>
          </div>

          {/* Input LBS */}
          <div>
            <input
              type="number"
              value={warmupSetVal.weight ?? ''}
              onChange={(e) => handleSetChange(0, 'weight', e.target.value)}
              style={inputFixedStyle}
              placeholder="-"
            />
          </div>

          {/* Input REPS */}
          <div>
            <input
              type="number"
              value={warmupSetVal.reps ?? ''}
              onChange={(e) => handleSetChange(0, 'reps', e.target.value)}
              style={inputFixedStyle}
              placeholder="-"
            />
          </div>

          {/* RPE Vacío / Badge tenue */}
          <div className="w-full flex justify-center items-center">
            <span className="text-[10px] text-center text-slate-400">—</span>
          </div>

          {/* Botón Check */}
          <div className="flex justify-center items-center">
            <button
              type="button"
              onClick={() => toggleSetComplete(0)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isWarmupSetDone ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Check size={14} strokeWidth={3.5} />
            </button>
          </div>
        </div>

        {/* Series Efectivas */}
        {Array.from({ length: totalSets }).map((_, sIdx) => {
          const setNum = sIdx + 1;
          const setVal = exerciseData[setNum] || {};
          const prevVal = previousData[setNum] || {};
          const isDone = !!setVal.completed;

          return (
            <div 
              key={setNum}
              className={`${gridRowClass} border-b border-slate-100 last:border-0 transition-colors ${
                isDone ? 'bg-emerald-50/40' : 'bg-white'
              }`}
            >
              {/* Label */}
              <div className="flex justify-center items-center">
                <span className={`text-sm font-bold ${isDone ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {setNum}
                </span>
              </div>

              {/* Previo */}
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

              {/* Input LBS */}
              <div>
                <input
                  type="number"
                  value={setVal.weight ?? ''}
                  onChange={(e) => handleSetChange(setNum, 'weight', e.target.value)}
                  style={{
                    ...inputFixedStyle,
                    ...(isDone ? { background: '#ecfdf5', borderColor: '#86efac', color: '#064e3b' } : {})
                  }}
                  placeholder="-"
                />
              </div>

              {/* Input REPS */}
              <div>
                <input
                  type="number"
                  value={setVal.reps ?? ''}
                  onChange={(e) => handleSetChange(setNum, 'reps', e.target.value)}
                  style={{
                    ...inputFixedStyle,
                    ...(isDone ? { background: '#ecfdf5', borderColor: '#86efac', color: '#064e3b' } : {})
                  }}
                  placeholder="-"
                />
              </div>

              {/* Select RPE */}
              <div>
                <select
                  value={setVal.rpe || '8'}
                  onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
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

              {/* Botón Check */}
              <div className="flex justify-center items-center">
                <button
                  type="button"
                  onClick={() => toggleSetComplete(setNum)}
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

      {/* Botones de Control (Añadir/Quitar) */}
      <div className="flex gap-2 mt-3 w-full">
        <button
          type="button"
          onClick={handleAddSet}
          className="flex-1 py-2.5 rounded-xl bg-slate-50 text-blue-600 text-[13px] font-bold border border-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors shadow-sm"
        >
          <Plus size={16} strokeWidth={3} /> Añadir Serie
        </button>
        {totalSets > 1 && (
          <button
            type="button"
            onClick={handleRemoveSet}
            className="w-14 py-2.5 rounded-xl bg-white text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
          >
            <Minus size={16} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SetLogger(props) {
  return (
    <ErrorBoundary>
      <SetLoggerContent {...props} />
    </ErrorBoundary>
  );
}
