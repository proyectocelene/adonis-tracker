import React from 'react';
import { UNIFIED_EXERCISE_LIBRARY } from '../../data/unifiedExerciseLibrary';
import { ErrorBoundary } from '../common/ErrorBoundary';

function SwapExerciseContent({ exercise, onSwapExercise, handleExecuteSwap, modal }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {exercise.originalName && (
        <div className="bg-amber-50 border-[1.5px] border-amber-500 rounded-xl p-2.5 flex justify-between items-center">
          <div>
            <span className="text-[11px] text-amber-800 font-extrabold block">🔄 Ejercicio Sustituido</span>
            <strong className="text-xs text-amber-900">Original: {exercise.originalName}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onSwapExercise) onSwapExercise(exercise.id, null);
              modal.showAlert({ title: "↺ Ejercicio Restaurado", message: `Se restableció a "${exercise.originalName}".`, variant: "info" });
            }}
            className="bg-amber-600 text-white border-none rounded-lg py-1.5 px-2.5 text-[11px] font-extrabold cursor-pointer hover:bg-amber-700 transition-colors"
          >
            ↺ Restaurar
          </button>
        </div>
      )}

      <span className="text-[11px] text-slate-700 font-extrabold">
        Sustitutos equivalentes de la base de datos oficial:
      </span>

      {exercise.equivalents && exercise.equivalents.length > 0 ? (
        <div className="flex flex-col gap-1.5 w-full">
          {exercise.equivalents.map(eq => (
            <button
              key={eq.id}
              type="button"
              onClick={() => handleExecuteSwap(eq.name)}
              className="bg-white border-[1.5px] border-emerald-500 rounded-xl p-2 text-left cursor-pointer flex justify-between items-center w-full hover:bg-emerald-50 transition-colors"
            >
              <div>
                <strong className="block text-xs text-emerald-900 font-black">{eq.name}</strong>
                <span className="text-[10px] text-slate-600">{eq.desc}</span>
              </div>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 py-1 px-2 rounded-lg shrink-0 border border-emerald-200">
                Sustituir
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-slate-500 italic py-1">
          No hay sustitutos automáticos preconfigurados para este ejercicio. Puedes elegir una máquina del catálogo a continuación:
        </div>
      )}

      <div className="bg-slate-50 p-2.5 rounded-xl border-[1.5px] border-slate-200 w-full mt-1">
        <label className="block mb-1 text-[11px] text-slate-900 font-black">
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
          className="w-full p-2 rounded-lg border-[1.5px] border-slate-300 text-xs font-extrabold bg-white outline-none focus:border-blue-500"
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

export default function SwapExercise(props) {
  return (
    <ErrorBoundary>
      <SwapExerciseContent {...props} />
    </ErrorBoundary>
  );
}
