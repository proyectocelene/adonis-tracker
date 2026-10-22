import React from 'react';
import { GripVertical, ChevronUp, ChevronDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

export default function ExerciseHeader({
  exercise,
  isExpanded,
  onToggleExpand,
  isFullyCompleted,
  totalSets,
  targetReps,
  completedSetsCount,
  isReorderMode,
  setIsReorderMode,
  startLongPress,
  cancelLongPress,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isDeferred = false,
  onDeferExercise,
  onDeleteCustomExercise
}) {
  return (
    <>
      {/* CABECERA COMPACTA CYBER-CLINICAL (STICKY ANTI-REFLEJO) */}
      <div 
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        style={{ 
          position: 'sticky', 
          top: '0px', 
          zIndex: 40, 
          background: 'var(--bg-surface)', 
          padding: '8px 10px', 
          borderRadius: isExpanded ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)', 
          borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
          borderLeft: isFullyCompleted ? '3.5px solid var(--accent-emerald)' : '3.5px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          userSelect: 'none',
          transition: 'border-color 0.2s ease, background 0.2s ease'
        }}
      >
        {/* ICONO DE AGARRE O REORDENAR */}
        <button
          type="button"
          onClick={() => {
            setIsReorderMode(!isReorderMode);
            if (navigator.vibrate) {
              try { navigator.vibrate(30); } catch (e) {}
            }
          }}
          title="Mantén presionado para reordenar"
          style={{
            background: isReorderMode ? 'var(--accent-blue)' : 'var(--bg-surface-secondary)',
            color: isReorderMode ? '#000000' : 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '4px 3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <GripVertical size={16} />
        </button>

        {/* NOMBRE DEL EJERCICIO Y METAS COMPACTAS */}
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={onToggleExpand}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '1px' }}>
            <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', fontWeight: '800', lineHeight: '1.25' }}>
              {exercise.name}
            </strong>
            {isFullyCompleted && (
              <span className="font-mono-tech" style={{ 
                fontSize: '9px', 
                background: 'var(--accent-emerald-subtle)', 
                color: 'var(--accent-emerald)', 
                border: '1px solid var(--accent-emerald)', 
                padding: '1px 5px', 
                borderRadius: '5px', 
                fontWeight: '800' 
              }}>
                ✓ LISTO
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
            <span className="font-mono-tech" style={{ 
              fontSize: '10px', 
              background: isFullyCompleted ? 'var(--accent-emerald-subtle)' : 'var(--bg-surface-secondary)', 
              color: isFullyCompleted ? 'var(--accent-emerald)' : 'var(--text-secondary)', 
              border: '1px solid var(--border-subtle)',
              padding: '1px 6px', 
              borderRadius: '5px', 
              fontWeight: '700'
            }}>
              {totalSets}×{targetReps} {completedSetsCount > 0 && `(${completedSetsCount}/${totalSets})`}
            </span>
            {exercise.restTime && (
              <span className="font-mono-tech" style={{ 
                fontSize: '10px', 
                background: 'var(--bg-surface-secondary)', 
                color: 'var(--accent-cyan)', 
                border: '1px solid var(--border-subtle)',
                padding: '1px 6px', 
                borderRadius: '5px', 
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                ⏱️ {exercise.restTime}
              </span>
            )}
            {isDeferred && (
              <span style={{ fontSize: '9.5px', background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)', border: '1px solid var(--accent-amber)', padding: '1px 5px', borderRadius: '5px', fontWeight: '800' }}>
                ⏱️ Pospuesto
              </span>
            )}
            {(exercise.isCustom || exercise.isTemporaryToday || exercise.id?.startsWith('custom_') || exercise.id?.startsWith('temp_today_')) && (
              <span style={{ fontSize: '9.5px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', border: '1px solid var(--border-strong)', padding: '1px 5px', borderRadius: '5px', fontWeight: '800' }}>
                {exercise.isTemporaryToday ? '📌 Solo Hoy' : '🔄 Extra'}
              </span>
            )}
          </div>
        </div>

        {/* BOTÓN ELIMINAR SI ES PERSONALIZADO */}
        {onDeleteCustomExercise && (exercise.isCustom || exercise.isTemporaryToday || exercise.id?.startsWith('custom_') || exercise.id?.startsWith('temp_today_')) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCustomExercise();
            }}
            title="Eliminar este ejercicio"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--accent-red-subtle)',
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Trash2 size={13} />
          </button>
        )}

        {/* CHEVRON COMPACTO */}
        <button
          type="button"
          onClick={onToggleExpand}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: 'none',
            background: isExpanded ? 'var(--accent-blue)' : 'var(--bg-surface-secondary)',
            color: isExpanded ? '#000000' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* BARRA FLOTANTE DE REORDENAMIENTO */}
      {isReorderMode && (
        <div className="animate-fade" style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--accent-blue)', 
          color: 'var(--text-main)', 
          padding: '8px 10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '6px' 
        }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)' }}>
            🔀 Reordenar:
          </span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              type="button"
              disabled={isFirst}
              onClick={() => {
                onMoveUp();
                if (navigator.vibrate) {
                  try { navigator.vibrate(20); } catch (e) {}
                }
              }}
              style={{ 
                background: isFirst ? 'var(--bg-surface-secondary)' : 'var(--accent-blue)', 
                color: isFirst ? 'var(--text-muted)' : '#000000', 
                border: 'none', 
                borderRadius: '6px', 
                padding: '4px 8px', 
                fontSize: '11px', 
                fontWeight: '800', 
                cursor: isFirst ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2px' 
              }}
            >
              <ArrowUp size={12} /> Arriba
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => {
                onMoveDown();
                if (navigator.vibrate) {
                  try { navigator.vibrate(20); } catch (e) {}
                }
              }}
              style={{ 
                background: isLast ? 'var(--bg-surface-secondary)' : 'var(--accent-blue)', 
                color: isLast ? 'var(--text-muted)' : '#000000', 
                border: 'none', 
                borderRadius: '6px', 
                padding: '4px 8px', 
                fontSize: '11px', 
                fontWeight: '800', 
                cursor: isLast ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2px' 
              }}
            >
              <ArrowDown size={12} /> Abajo
            </button>
            <button
              type="button"
              onClick={() => setIsReorderMode(false)}
              style={{ 
                background: 'var(--accent-emerald)', 
                color: '#000000', 
                border: 'none', 
                borderRadius: '6px', 
                padding: '4px 10px', 
                fontSize: '11px', 
                fontWeight: '900', 
                cursor: 'pointer' 
              }}
            >
              ✓ Listo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
