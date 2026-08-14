import React from 'react';
import { Search, Video, Info } from 'lucide-react';
import { ErrorBoundary } from '../common/ErrorBoundary';

function ExerciseBiomechanicsContent({
  exercise,
  totalSets,
  targetReps,
  restPrescribed,
  machineSetupInput,
  setMachineSetupInput,
  handleSaveMachineSetup
}) {
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(exercise.name + " ejecucion tecnica biomecanica")}`;
  const youtubeTutorialUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " como hacer tecnica correcta")}`;

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* TARJETA DE PRESCRIPCIÓN & OBJETIVO CIENTÍFICO ÓPTIMO */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-[1.5px] border-blue-200 rounded-2xl p-3 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] text-blue-800 uppercase font-black tracking-wide block">
              🎯 Prescripción Científica Oficial
            </span>
            <strong className="text-sm text-slate-900 font-black">
              Realizar {totalSets} Series Efectivas de Trabajo
            </strong>
          </div>
          <span className="text-[11px] bg-blue-600 text-white py-1 px-2.5 rounded-lg font-black shrink-0">
            Meta: {targetReps} reps
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 bg-white p-2 rounded-xl border border-blue-200 mb-2">
          <div className="text-[11px] text-slate-700 font-bold">
            ⏱️ Descanso: <strong className="text-blue-600">{restPrescribed}</strong>
          </div>
          <div className="text-[11px] text-slate-700 font-bold">
            🔥 Esfuerzo: <strong className="text-amber-600">RPE 8-9 (RIR 1-2)</strong>
          </div>
        </div>

        <div className="text-[11px] text-blue-900 leading-snug font-bold">
          💡 <strong>Estrategia Óptima:</strong> Completa tus {totalSets} series efectivas manteniendo técnica estricta en {targetReps} reps. Si en tu última serie logras el tope superior con RPE &le; 8, aumenta carga (+5 lbs) la próxima sesión.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <a
          href={googleImagesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-50 text-slate-800 border-[1.5px] border-slate-300 p-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 no-underline hover:bg-slate-100 transition-colors"
        >
          <Search size={14} className="text-blue-600" /> Buscar en Imágenes
        </a>
        <a
          href={youtubeTutorialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-50 text-red-800 border-[1.5px] border-red-200 p-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 no-underline hover:bg-red-100 transition-colors"
        >
          <Video size={14} className="text-red-600" /> Tutorial en YouTube
        </a>
      </div>

      {exercise.warmup && (
        <div className="bg-amber-50 border-[1.5px] border-amber-500 p-2.5 rounded-xl text-xs text-amber-900 font-bold w-full">
          <strong className="text-amber-700 block mb-0.5 font-black">
            Guía de Calentamiento:
          </strong>
          {exercise.warmup}
        </div>
      )}

      <div className="bg-slate-50 p-2.5 rounded-xl border-[1.5px] border-slate-200 w-full">
        <div className="flex items-center gap-1.5 mb-1">
          <Info size={14} className="text-purple-600" />
          <strong className="text-xs text-purple-900 font-black">Biomecánica & IAP:</strong>
        </div>
        <p className="m-0 text-xs text-slate-700 leading-relaxed font-bold">
          {exercise.biomechanics || 'Control de la fase excéntrica con respiración rítmica anti-hernia.'}
        </p>
      </div>

      <div className="bg-white p-2.5 rounded-xl border-[1.5px] border-slate-300 w-full">
        <label className="block mb-1 text-[11px] text-slate-900 font-black">
          ⚙️ Calibración de Máquina:
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="Ej. Asiento en hoyo 4..."
            value={machineSetupInput}
            onChange={(e) => setMachineSetupInput(e.target.value)}
            className="flex-1 p-2 rounded-lg border-[1.5px] border-slate-300 text-xs font-bold bg-white text-slate-900 focus:border-purple-500 outline-none"
          />
          <button
            type="button"
            onClick={handleSaveMachineSetup}
            className="bg-purple-600 text-white border-none rounded-lg py-2 px-3.5 text-xs font-black cursor-pointer hover:bg-purple-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExerciseBiomechanics(props) {
  return (
    <ErrorBoundary>
      <ExerciseBiomechanicsContent {...props} />
    </ErrorBoundary>
  );
}
