import React from 'react';
import { Clock, RotateCcw, Square, Play } from 'lucide-react';
import { useGlobalTimer } from '../../contexts/GlobalTimerContext';
import { ErrorBoundary } from '../common/ErrorBoundary';

function RestTimerContent({ exerciseName, parsedRestSeconds }) {
  const { restTimerSeconds, isTimerActive, startTimer, stopTimer, setTimerDuration } = useGlobalTimer();

  return (
    <div className={`p-3 rounded-xl mb-4 border transition-all ${
      isTimerActive 
        ? 'bg-slate-900 text-white border-slate-800 shadow-md' 
        : 'bg-slate-50 text-slate-800 border-slate-200'
    }`}>
      <div className="flex items-center justify-between w-full">
        {/* Etiqueta del temporizador */}
        <div className="flex items-center gap-2">
          <Clock size={18} className={isTimerActive ? 'text-sky-400' : 'text-slate-500'} />
          <span className="text-sm font-semibold">
            {isTimerActive ? `${restTimerSeconds}s Restantes` : `Descanso`}
          </span>
        </div>

        {/* Controles del temporizador */}
        <div className="flex items-center gap-2">
          {!isTimerActive && (
            <div className="flex items-center gap-1.5">
              {[90, 120].map((secs) => {
                const isSelected = restTimerSeconds === secs;
                return (
                  <button
                    key={secs}
                    type="button"
                    onClick={() => setTimerDuration(secs)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {secs}s
                  </button>
                );
              })}
            </div>
          )}

          {isTimerActive ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { stopTimer(); setTimerDuration(parsedRestSeconds); }}
                title="Reiniciar"
                className="bg-slate-700 text-slate-200 border-none rounded-lg p-2 cursor-pointer hover:bg-slate-600 transition-colors"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={stopTimer}
                title="Parar"
                className="bg-red-500 text-white border-none rounded-lg py-1.5 px-3 text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-red-600 transition-colors"
              >
                <Square size={12} fill="#fff" /> Parar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => startTimer(parsedRestSeconds, exerciseName)}
              className="bg-slate-800 text-white border-none rounded-lg py-1.5 px-3.5 text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Play size={12} fill="#fff" /> Iniciar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RestTimer(props) {
  return (
    <ErrorBoundary>
      <RestTimerContent {...props} />
    </ErrorBoundary>
  );
}
