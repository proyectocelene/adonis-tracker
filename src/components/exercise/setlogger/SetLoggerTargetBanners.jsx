import React from 'react';

export default function SetLoggerTargetBanners({
  coachAnalysis,
  setIsScienceModalOpen,
  isDeloadMode
}) {
  return (
    <>
      {/* BANNER PERMANENTE: META GLOBAL DEL EJERCICIO PARA HOY */}
      {coachAnalysis?.unifiedTarget && (
        <div 
          onClick={() => setIsScienceModalOpen(true)}
          style={{
            background: 'var(--bg-surface-secondary)',
            border: `1px solid ${
              coachAnalysis.unifiedTarget.isExcessiveLoad 
                ? 'var(--accent-amber)' 
                : (coachAnalysis.unifiedTarget.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-cyan)')
            }`,
            borderRadius: '10px',
            padding: '6px 10px',
            marginBottom: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px' }}>
              {coachAnalysis.unifiedTarget.isExcessiveLoad ? '🔬' : (coachAnalysis.unifiedTarget.canProgressWeight ? '🚀' : '🎯')}
            </span>
            <div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '900', 
                color: coachAnalysis.unifiedTarget.isExcessiveLoad 
                  ? 'var(--accent-amber)' 
                  : (coachAnalysis.unifiedTarget.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-cyan)') 
              }}>
                {coachAnalysis.unifiedTarget.headline}
              </div>
              <div style={{ 
                fontSize: '9.5px', 
                color: 'var(--text-muted)', 
                fontWeight: '600'
              }}>
                {coachAnalysis.unifiedTarget.note}
              </div>
            </div>
          </div>
          <span style={{ 
            fontSize: '9px', 
            color: coachAnalysis.unifiedTarget.isExcessiveLoad 
              ? 'var(--accent-amber)' 
              : (coachAnalysis.unifiedTarget.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-cyan)'), 
            fontWeight: '900',
            flexShrink: 0,
            background: 'var(--bg-surface)',
            padding: '2px 6px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            Coach ➔
          </span>
        </div>
      )}

      {/* BANNER INFORMATIVO MODO DELOAD */}
      {isDeloadMode && (
        <div style={{
          background: 'var(--accent-emerald-subtle)',
          border: '1px solid var(--accent-emerald)',
          borderRadius: '10px',
          padding: '6px 10px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '14px' }}>🧘</span>
          <div style={{ fontSize: '10.5px', color: 'var(--accent-emerald)', fontWeight: '800', lineHeight: '1.3' }}>
            <strong>Modo Deload Activo:</strong> Cargas al 80%, 2 series y RIR 3-4 (sin fallo) para regeneración del SNC.
          </div>
        </div>
      )}
    </>
  );
}
