import React from 'react';
import { safeVibrate } from '../../../utils/setLoggerHelpers';

export default function SetRowHeader({
  setNum,
  isDone,
  prevVal = {},
  isUnilateral,
  prevLocation,
  overloadTarget,
  completedBadge,
  handleSanitizedChange
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '3px',
      gap: '5px'
    }}>
      {/* GUÍA PASADA (CLICKABLE AUTO-FILL TÁCTIL) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
        <span className="font-mono-tech" style={{
          background: isDone ? 'var(--accent-emerald)' : 'var(--bg-surface-elevated)',
          color: isDone ? '#000000' : 'var(--text-main)',
          borderRadius: '5px',
          padding: '1px 5px',
          fontSize: '9.5px',
          fontWeight: '900'
        }}>
          S{setNum}
        </span>
        <button
          type="button"
          onClick={() => {
            if (!prevVal.weight && !prevVal.reps && !prevVal.repsL && !prevVal.repsR) return;
            safeVibrate(15);
            const updates = {};
            if (prevVal.weight) updates.weight = String(prevVal.weight);
            if (isUnilateral) {
              if (prevVal.repsL) updates.repsL = String(prevVal.repsL);
              if (prevVal.repsR) updates.repsR = String(prevVal.repsR);
              updates.reps = String(prevVal.reps || prevVal.repsR || prevVal.repsL || '10');
            } else {
              if (prevVal.reps) updates.reps = String(prevVal.reps);
            }
            if (prevVal.rpe) updates.rpe = String(prevVal.rpe);
            handleSanitizedChange(setNum, updates);
          }}
          className="font-mono-tech tactile-btn"
          title={prevVal.weight ? "Toca para autollenar con la carga y reps de la sesión anterior" : "Sin registro anterior"}
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '5px',
            padding: '1px 6px',
            color: 'var(--text-muted)',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            cursor: prevVal.weight ? 'pointer' : 'default',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ fontSize: '9px', opacity: 0.8 }}>Prev:</span>
          <strong style={{ color: 'var(--text-main)', fontWeight: '700' }}>
            {prevVal.weight 
              ? `${prevVal.weight}# × ${
                  isUnilateral && ((prevVal.repsL && prevVal.repsL !== 'null') || (prevVal.repsR && prevVal.repsR !== 'null'))
                    ? `I:${prevVal.repsL || prevVal.reps} D:${prevVal.repsR || prevVal.reps}`
                    : `${prevVal.reps || prevVal.repsR || prevVal.repsL || '—'}r`
                }` 
              : '—'}
          </strong>
          {prevVal.weight && <span style={{ fontSize: '8.5px', color: 'var(--accent-blue)', opacity: 0.9 }}>⚡</span>}
          {prevLocation && (
            <span style={{
              fontSize: '8.5px',
              background: 'var(--bg-surface)',
              color: 'var(--accent-cyan)',
              padding: '0 3px',
              borderRadius: '3px',
              fontWeight: '700'
            }} title={`Sesión pasada hecha en: ${prevLocation}`}>
              ({prevLocation.includes('Planta') ? prevLocation.replace('Planta ', 'P.') : prevLocation})
            </span>
          )}
        </button>
      </div>

      {/* META O PR (CLICKABLE AUTO-FILL TÁCTIL) */}
      {overloadTarget && !isDone && (
        <button
          type="button"
          onClick={() => {
            safeVibrate(15);
            const updates = {};
            if (overloadTarget.targetWeight) updates.weight = String(overloadTarget.targetWeight);
            if (overloadTarget.targetReps) {
              updates.reps = String(overloadTarget.targetReps);
              if (isUnilateral) {
                updates.repsL = String(overloadTarget.targetReps);
                updates.repsR = String(overloadTarget.targetReps);
              }
            }
            handleSanitizedChange(setNum, updates);
          }}
          className="font-mono-tech tactile-btn"
          title="Toca para aplicar la meta científica de sobrecarga"
          style={{ 
            color: overloadTarget.isLoadAdjustment ? 'var(--accent-amber)' : 'var(--accent-cyan)', 
            fontSize: '9.5px', 
            fontWeight: '800', 
            whiteSpace: 'nowrap',
            background: overloadTarget.isLoadAdjustment ? 'var(--accent-amber-subtle)' : 'var(--accent-cyan-subtle)',
            padding: '1px 6px',
            borderRadius: '5px',
            border: `1px solid ${overloadTarget.isLoadAdjustment ? 'var(--accent-amber)' : 'var(--accent-cyan)'}`,
            flexShrink: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <span>🎯 {overloadTarget.shortText}</span>
          <span style={{ fontSize: '8px', opacity: 0.8 }}>⚡</span>
        </button>
      )}
      {isDone && completedBadge && (
        <span className="font-mono-tech" style={{ 
          color: completedBadge.color,
          background: 'var(--bg-surface)',
          border: `1px solid ${completedBadge.border}`,
          fontSize: '9.5px', 
          fontWeight: '800', 
          whiteSpace: 'nowrap', 
          padding: '1px 5px',
          borderRadius: '5px',
          flexShrink: 0 
        }}>
          {completedBadge.text}
        </span>
      )}
    </div>
  );
}
