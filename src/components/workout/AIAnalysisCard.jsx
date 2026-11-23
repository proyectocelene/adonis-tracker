import React from 'react';
import { Sparkles, X } from 'lucide-react';

export default function AIAnalysisCard({
  aiAnalysisResult,
  onClose,
  isDeloadMode,
  fatigueStatus,
  onToggleDeload
}) {
  if (!aiAnalysisResult) return null;

  return (
    <div
      className="card animate-fade"
      style={{
        padding: '16px 18px',
        marginBottom: '16px',
        background: aiAnalysisResult.isDeloadMode ? 'var(--accent-emerald-subtle)' : 'rgba(168, 85, 247, 0.12)',
        border: aiAnalysisResult.isDeloadMode ? '1px solid var(--accent-emerald)' : '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-ios)'
      }}
    >
      <div className="flex-between" style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {aiAnalysisResult.isDeloadMode ? (
            <Sparkles size={20} color="var(--accent-emerald)" />
          ) : (
            <Sparkles size={20} color="#c084fc" />
          )}
          <strong
            style={{
              fontSize: '15px',
              color: aiAnalysisResult.isDeloadMode ? 'var(--accent-emerald)' : '#c084fc',
              fontWeight: '900'
            }}
          >
            {aiAnalysisResult.isDeloadMode ? '🧘 Auditoría de Descarga del Coach' : 'Reporte de Sobrecarga AI'}
          </strong>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          aria-label="Cerrar reporte"
        >
          <X size={18} color="var(--text-muted)" />
        </button>
      </div>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-main)',
          margin: 0,
          lineHeight: '1.6',
          fontWeight: '600',
          whiteSpace: 'pre-line'
        }}
      >
        {aiAnalysisResult.resumenSobrecarga}
      </p>
      {!isDeloadMode && fatigueStatus?.shouldHighlightDeload && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              if (onToggleDeload) onToggleDeload();
            }}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
            }}
          >
            🧘 Activar Modo Descarga (7 Días)
          </button>
        </div>
      )}
    </div>
  );
}
