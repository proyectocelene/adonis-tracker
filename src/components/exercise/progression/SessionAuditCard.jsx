import React from 'react';
import { PROGRESSION_COLORS } from '../../../utils/charts/chartConstants.js';

export default function SessionAuditCard({
  activeData,
  pinnedPoint,
  setPinnedPoint,
  hoveredPoint
}) {
  if (!activeData) return null;

  const isPinned = Boolean(pinnedPoint);
  const isHovered = !pinnedPoint && Boolean(hoveredPoint);
  const isProj = Boolean(activeData.isProjected);

  const wMax = (isProj ? activeData.projectedWeight : activeData.weight) || '--';
  const wAvg = (isProj ? activeData.projectedAvgWeight : (activeData.weightedAvgWeight || activeData.avgWeight)) || '--';
  const wMin = (!isProj && activeData.minWeight) ? activeData.minWeight : wMax;

  const rMax = (isProj ? activeData.projectedReps : (activeData.maxReps || activeData.reps)) || '--';
  const rAvg = (!isProj && activeData.avgReps) ? activeData.avgReps : rMax;
  const rMin = (!isProj && activeData.minReps) ? activeData.minReps : rMax;

  const reliable1RM = isProj
    ? (activeData.projected1RM || '--')
    : (activeData.isEpleyReliable && activeData.est1RM ? activeData.est1RM : '--');

  return (
    <div style={{
      marginTop: '10px',
      background: '#0f172a',
      borderRadius: '14px',
      padding: '10px 12px',
      color: '#ffffff',
      border: isPinned ? '1.5px solid #f59e0b' : (isHovered ? '1.5px solid #3b82f6' : '1px solid #1e293b')
    }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '900', color: '#93c5fd' }}>
            📅 {activeData.dateFull || activeData.displayDate || activeData.date}
          </span>
          {!isProj && activeData.isDeloadSession && (
            <span style={{ fontSize: '9.5px', fontWeight: '900', padding: '1px 6px', borderRadius: '6px', background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
              🧘 Deload
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '9.5px',
            fontWeight: '900',
            padding: '2px 7px',
            borderRadius: '6px',
            background: isPinned ? 'rgba(245, 158, 11, 0.25)' : (isHovered ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.2)'),
            color: isPinned ? '#fcd34d' : (isHovered ? '#93c5fd' : '#4ade80')
          }}>
            {isPinned ? '📌 FIJADO' : (isHovered ? '🔍 INSPECCIONANDO' : '✓ ÚLTIMA SESIÓN')}
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
                fontSize: '10px',
                padding: 0
              }}
              title="Desfijar"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Peso (Máx/Prom/Mín), Reps (Máx/Prom/Mín) y 1RM fiable */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '6px', marginBottom: '8px', fontSize: '11px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: '8px' }}>
          <span style={{ fontSize: '9px', color: '#93c5fd', display: 'block', fontWeight: '800' }}>Peso (lbs)</span>
          <strong>Máx {wMax}</strong> · Prom {wAvg} · Mín {wMin}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: '8px' }}>
          <span style={{ fontSize: '9px', color: '#86efac', display: 'block', fontWeight: '800' }}>Reps</span>
          <strong>Máx {rMax}</strong> · Prom {rAvg} · Mín {rMin}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: '8px' }}>
          <span style={{ fontSize: '9px', color: '#22d3ee', display: 'block', fontWeight: '800' }}>1RM fiable (≤15r)</span>
          <strong>{reliable1RM !== '--' ? `${reliable1RM} lbs` : '--'}</strong>
        </div>
      </div>

      {/* Pastillas de series efectivas */}
      {!isProj && Array.isArray(activeData.detailedSets) && activeData.detailedSets.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {activeData.detailedSets
            .filter(s => !s.isWarmup && (s.setNum === undefined || Number(s.setNum) > 0))
            .map((s, sIdx) => {
              const isTop = s.weight === activeData.weight && s.reps === activeData.reps;
              return (
                <span
                  key={sIdx}
                  style={{
                    fontSize: '9.5px',
                    padding: '2px 6px',
                    borderRadius: '5px',
                    background: isTop ? 'rgba(29, 78, 216, 0.4)' : 'rgba(255,255,255,0.08)',
                    color: isTop ? '#93c5fd' : '#cbd5e1',
                    border: isTop ? `1px solid ${PROGRESSION_COLORS.peakWeight}` : '1px solid transparent',
                    fontWeight: isTop ? '900' : '600'
                  }}
                >
                  {s.label || `S${s.setNum || sIdx + 1}`}: {s.weight}#×{s.reps}
                </span>
              );
            })}
        </div>
      )}
    </div>
  );
}
