import React from 'react';
import { ChevronDown, ChevronUp, Settings2, Cpu, Loader2, BookOpen, Copy, Layers, RefreshCw, Sparkles } from 'lucide-react';
import { ErrorBoundary } from '../common/ErrorBoundary';

function SecondaryToolsContent({
  showSecondaryTools,
  setShowSecondaryTools,
  handleOptimizeWithMath,
  isAnalyzingAI,
  setShowGlosarioModal,
  handleCopyRoutineForCoach,
  setShowRoutineBuilder,
  handleResetToOfficialRoutine,
  handleResetAllDaysToOfficial,
  baseDayName
}) {
  return (
    <div className="card p-3.5 mb-5 bg-slate-50 border-[1.5px] border-slate-200 rounded-2xl shadow-sm">
      <button
        type="button"
        onClick={() => setShowSecondaryTools(!showSecondaryTools)}
        className="w-full bg-transparent border-none flex items-center justify-between cursor-pointer py-1"
      >
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-slate-500" />
          <span className="text-[13px] font-extrabold text-slate-700">
            🛠️ Herramientas Secundarias & Ajustes
          </span>
        </div>
        {showSecondaryTools ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
      </button>

      {showSecondaryTools && (
        <div className="animate-fade mt-3.5 pt-3.5 border-t border-dashed border-slate-300 flex flex-col gap-2.5">
          <button 
            type="button"
            onClick={handleOptimizeWithMath}
            disabled={isAnalyzingAI}
            className="w-full bg-gradient-to-br from-purple-600 to-purple-700 text-white p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 hover:from-purple-700 hover:to-purple-800 transition-colors shadow-md cursor-pointer disabled:opacity-70"
          >
            {isAnalyzingAI ? <Loader2 size={16} className="animate-spin" /> : <Cpu size={16} />}
            {isAnalyzingAI ? 'Calculando...' : '🧠 Optimizar (Epley Math)'}
          </button>

          <button
            type="button"
            onClick={() => setShowGlosarioModal(true)}
            className="w-full bg-blue-50 text-blue-600 border border-blue-200 p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <BookOpen size={16} /> 📖 Ver Glosario & Guía Técnica
          </button>

          <button 
            type="button"
            onClick={handleCopyRoutineForCoach}
            className="w-full bg-white text-slate-700 border border-slate-300 p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <Copy size={16} /> 📋 Copiar Rutina en Texto
          </button>

          <button
            type="button"
            onClick={() => setShowRoutineBuilder(true)}
            className="w-full bg-slate-800 text-white border-none p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-900 transition-colors shadow-sm"
          >
            <Layers size={16} className="text-sky-400" /> 🛠️ Gestor Maestro de Rutinas (Actualizar / Pegar)
          </button>

          <button
            type="button"
            onClick={handleResetToOfficialRoutine}
            className="w-full bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={16} /> ↺ Restablecer {baseDayName} a Oficial
          </button>

          <button
            type="button"
            onClick={handleResetAllDaysToOfficial}
            className="w-full bg-emerald-50 text-emerald-700 border-[1.5px] border-emerald-300 p-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            <Sparkles size={16} className="text-emerald-600" /> ✨ Activar Protocolo Oficial en Toda la Semana
          </button>
        </div>
      )}
    </div>
  );
}

export default function SecondaryTools(props) {
  return (
    <ErrorBoundary>
      <SecondaryToolsContent {...props} />
    </ErrorBoundary>
  );
}
