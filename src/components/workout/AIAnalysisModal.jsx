import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { ErrorBoundary } from '../common/ErrorBoundary';

function AIAnalysisModalContent({ aiAnalysisResult, setAiAnalysisResult }) {
  if (!aiAnalysisResult) return null;

  return (
    <div className="card animate-fade p-4 mb-4 bg-purple-50 border-[1.5px] border-purple-300 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-purple-600" />
          <strong className="text-[15px] text-purple-900 font-black">
            Reporte de Sobrecarga AI
          </strong>
        </div>
        <button
          type="button"
          onClick={() => setAiAnalysisResult(null)}
          className="bg-transparent border-none cursor-pointer p-1 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <X size={18} className="text-slate-500" />
        </button>
      </div>
      <p className="text-[13px] text-purple-900 m-0 leading-relaxed font-bold whitespace-pre-wrap">
        {aiAnalysisResult.resumenSobrecarga}
      </p>
    </div>
  );
}

export default function AIAnalysisModal(props) {
  return (
    <ErrorBoundary>
      <AIAnalysisModalContent {...props} />
    </ErrorBoundary>
  );
}
