import React from 'react';
import { PROGRESSION_COLORS } from '../../../utils/charts/chartConstants.js';

export default function SessionAuditCard({
  activeData,
  pinnedPoint,
  setPinnedPoint,
  hoveredPoint,
  targetRange
}) {
  if (!activeData) return null;

  const isPinned = Boolean(pinnedPoint);
  const isHovered = !pinnedPoint && Boolean(hoveredPoint);
  const isProj = Boolean(activeData.isProjected);

  return (
    <div style={{
      marginTop: '10px',
      background: isProj ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)' : '#0f172a',
      borderRadius: '14px',
      padding: '12px 14px',
      color: '#ffffff',
      border: isPinned ? '1.5px solid #f59e0b' : (isProj ? '1.5px solid #8b5cf6' : (isHovered ? '1.5px solid #3b82f6' : '1px solid #1e293b')),
      boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
      transition: 'all 0.15s ease'
    }}>
      {/* Cabecera con fecha, estado y botón de desfijar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '900', color: isProj ? '#c084fc' : '#93c5fd' }}>
            📅 {activeData.dateFull || activeData.displayDate || activeData.date}
          </span>
          {!isProj && activeData.sessionIndex && (
            <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: '700' }}>
              • Sesión #{activeData.sessionIndex}
            </span>
          )}
          {!isProj && activeData.sourceName && (
            <span style={{
              fontSize: '9.5px',
              color: '#c084fc',
              fontWeight: '800',
              background: 'rgba(192, 132, 252, 0.15)',
              border: '1px solid rgba(192, 132, 252, 0.3)',
              padding: '1px 6px',
              borderRadius: '6px'
            }}>
              🏷️ {activeData.sourceName}
            </span>
          )}
          {!isProj && activeData.stationLabel && (
            <span style={{
              fontSize: '9.5px',
              color: '#67e8f9',
              fontWeight: '800',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              padding: '1px 6px',
              borderRadius: '6px'
            }}>
              {activeData.stationIcon} {activeData.stationLabel}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {!isProj && activeData.isDeloadSession && (
            <span style={{
              fontSize: '9.5px',
              fontWeight: '900',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              border: '1px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              🧘 SEMANA DE DESCARGA (DELOAD)
            </span>
          )}
          <span style={{
            fontSize: '9.5px',
            fontWeight: '900',
            padding: '2px 7px',
            borderRadius: '6px',
            background: isPinned ? 'rgba(245, 158, 11, 0.25)' : (isProj ? 'rgba(139, 92, 246, 0.25)' : (isHovered ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.2)')),
            color: isPinned ? '#fcd34d' : (isProj ? '#d8b4fe' : (isHovered ? '#93c5fd' : '#4ade80')),
            border: isPinned ? '1px solid #f59e0b' : 'none'
          }}>
            {isPinned ? '📌 FIJADO' : (isProj ? '🔮 PROYECCIÓN' : (isHovered ? '🔍 INSPECCIONANDO' : '✓ ÚLTIMA SESIÓN'))}
          </span>
          {isPinned && (
            <button
              type="button"
              onClick={() => setPinnedPoint(null)}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: 'none',
                borderRadius: '50%',
                color: '#ffffff',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                padding: 0
              }}
              title="Desfijar y volver a la última sesión"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid de Métricas Clave */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '8px' }}>
        {/* 1. Carga Pico */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '9px', color: '#93c5fd', display: 'block', fontWeight: '800' }}>🔵 Carga Pico (Top Set)</span>
          <strong style={{ fontSize: '15px', color: isProj ? '#f472b6' : '#60a5fa' }}>
            {(isProj ? activeData.projectedWeight : activeData.weight) || '--'} <span style={{ fontSize: '10px', color: '#94a3b8' }}>lbs</span>
          </strong>
          {!isProj && activeData.weightSpread > 0 && (
            <span style={{ fontSize: '8.5px', color: '#93c5fd', display: 'block', marginTop: '2px' }}>
              Rango: {activeData.minWeight} - {activeData.weight}# (Δ {activeData.weightSpread}#)
            </span>
          )}
        </div>

        {/* 2. Carga Promedio Ponderada Efectiva */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '9px', color: '#d8b4fe', display: 'block', fontWeight: '800' }}>🟣 Promedio Ponderado</span>
          <strong style={{ fontSize: '15px', color: isProj ? '#f472b6' : '#c084fc' }}>
            {(isProj ? activeData.projectedAvgWeight : (activeData.weightedAvgWeight || activeData.avgWeight)) || '--'} <span style={{ fontSize: '10px', color: '#94a3b8' }}>lbs</span>
          </strong>
          {!isProj && (activeData.rpe || activeData.rpeStart) && (
            <span style={{ fontSize: '8.5px', color: '#f87171', display: 'block', marginTop: '2px', fontWeight: '800' }}>
              🔥 RPE {activeData.rpe || activeData.rpeStart} {activeData.rpe ? `• RIR ${Math.max(0, Math.round(10 - activeData.rpe))}` : ''}{activeData.rpeEnd && activeData.rpeEnd !== activeData.rpeStart ? ` (➔ ${activeData.rpeEnd})` : ''} {activeData.deltaRPE ? `(Δ ${activeData.deltaRPE > 0 ? `+${activeData.deltaRPE}` : activeData.deltaRPE})` : ''}
            </span>
          )}
        </div>

        {/* 3. Repeticiones (Top Set y Promedio simultáneas con colores diferenciados) */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '9px', color: '#86efac', display: 'block', fontWeight: '800' }}>⚡ Reps (Top • Prom)</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <strong style={{ fontSize: '15px', color: '#4ade80' }}>
              {(isProj ? activeData.projectedReps : activeData.reps) || '--'}
            </strong>
            {!isProj && activeData.avgReps > 0 && activeData.avgReps !== activeData.reps && (
              <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '800' }}>
                • Prom: {activeData.avgReps}
              </span>
            )}
            {activeData.reps >= targetRange.min && activeData.reps <= targetRange.max && (
              <span style={{ fontSize: '8.5px', color: '#86efac', background: 'rgba(16,185,129,0.2)', padding: '1px 4px', borderRadius: '4px', marginLeft: 'auto' }}>
                ✓ {targetRange.label}
              </span>
            )}
          </div>
          {!isProj && activeData.repDropOffPct > 0 && (
            <span style={{ fontSize: '8.5px', color: '#fca5a5', display: 'block', marginTop: '2px' }}>
              Fatiga: {activeData.repDropOffPct}% caída reps
            </span>
          )}
        </div>

        {/* 4. Tonelaje Efectivo & 1RM */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '7px 9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>📦 Tonelaje</span>
              <strong style={{ fontSize: '12px', color: '#fb923c' }}>
                {(isProj ? activeData.projectedTonnage : activeData.tonnage)?.toLocaleString() || '--'}#
              </strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>🏆 1RM Teórico</span>
              <strong style={{ fontSize: '12px', color: '#22d3ee' }}>
                {(isProj ? activeData.projected1RM : activeData.est1RM) || '--'}#
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de series efectivas */}
      {!isProj && Array.isArray(activeData.detailedSets) && activeData.detailedSets.length > 0 && (
        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: '800' }}>
              📋 Series ({activeData.setsCount} efectivas{activeData.warmupCount > 0 ? ` + ${activeData.warmupCount} aprox` : ''}):
            </span>
            {activeData.setsCount > 1 && (
              <span style={{ fontSize: '9px', color: '#cbd5e1' }}>
                Mín {activeData.minReps} — Máx {activeData.maxReps} reps
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {activeData.detailedSets.map((s, sIdx) => {
              const isTop = s.weight === activeData.weight && s.reps === activeData.reps;
              const isWarm = s.isWarmup;
              const isDeload = Boolean(activeData.isDeloadSession);
              return (
                <span
                  key={sIdx}
                  style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    borderRadius: '5px',
                    background: isDeload
                      ? (isTop ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.15)')
                      : (isTop
                        ? 'rgba(29, 78, 216, 0.4)'
                        : (isWarm ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.08)')),
                    color: isDeload ? '#a7f3d0' : (isTop ? '#93c5fd' : (isWarm ? '#fcd34d' : '#cbd5e1')),
                    border: isDeload
                      ? (isTop ? '1.5px solid #10b981' : '1px solid rgba(16, 185, 129, 0.4)')
                      : (isTop
                        ? `1.5px solid ${PROGRESSION_COLORS.peakWeight}`
                        : (isWarm ? '1px dashed #f59e0b' : '1px solid transparent')),
                    fontWeight: isTop ? '900' : '600'
                  }}
                  title={isDeload ? 'Serie en semana de descarga (volumen 50% / RIR 3-4)' : (isWarm ? 'Serie de aproximación/calentamiento' : 'Serie efectiva')}
                >
                  {s.label || (s.setNum <= 0 ? 'C1' : `S${s.setNum || sIdx + 1}`)}: {s.weight}#×{s.reps}{isDeload ? ' 🧘' : (isTop ? ' 🔥' : '')}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {isProj && activeData.projectionNote && (
        <div style={{ fontSize: '10px', color: '#f472b6', fontStyle: 'italic', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '4px' }}>
          💡 Meta: {activeData.projectionNote}
        </div>
      )}

      {/* Hint sutil */}
      <div style={{ marginTop: '6px', fontSize: '8.5px', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
        👆 Toca o pasa el cursor por cualquier punto de la curva para auditar esa sesión aquí sin tapar la gráfica.
      </div>
    </div>
  );
}
