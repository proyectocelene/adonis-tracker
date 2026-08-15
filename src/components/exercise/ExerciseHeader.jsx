import React from 'react';
import { GripVertical, ChevronUp, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

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
  isLast
}) {
  return (
    <>
      {/* 1. CABECERA STICKY EN EL CELULAR: TITULO COMPLETO 100% ANCHO + GESTO DEJAR PRESIONADO */}
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
          zIndex: 50, 
          background: isFullyCompleted ? '#f0fdf4' : '#ffffff', 
          padding: '12px 14px', 
          borderRadius: isExpanded ? '22px 22px 0 0' : '22px', 
          borderBottom: isExpanded ? '2px solid #cbd5e1' : 'none',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          userSelect: 'none'
        }}
      >
        {/* ICONO DE AGARRE O BOTÓN DE REORDENAR AL DEJAR PRESIONADO */}
        <button
          type="button"
          onClick={() => {
            setIsReorderMode(!isReorderMode);
            if (navigator.vibrate) navigator.vibrate(40);
          }}
          title="Mantén presionado para reordenar"
          style={{
            background: isReorderMode ? '#6366f1' : '#f1f5f9',
            color: isReorderMode ? '#ffffff' : '#64748b',
            border: 'none',
            borderRadius: '10px',
            padding: '6px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <GripVertical size={20} />
        </button>

        {/* NOMBRE DEL EJERCICIO A TODO EL ANCHO */}
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={onToggleExpand}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
            <strong style={{ fontSize: '15px', color: '#0f172a', fontWeight: '900', lineHeight: '1.3' }}>
              {exercise.name}
            </strong>
            {isFullyCompleted && (
              <span style={{ fontSize: '10px', background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
                ✓ Completo
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
              {exercise.muscleGroup || 'General'}
            </span>
            {exercise.loadFamily && (
              <span style={{ fontSize: '10px', background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', padding: '2px 6px', borderRadius: '8px', fontWeight: '800' }}>
                🏛️ {exercise.loadFamily.replace('Familia ', '')}
              </span>
            )}
            <span style={{ fontSize: '11px', background: '#0066ff', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', boxShadow: '0 2px 6px rgba(0,102,255,0.25)' }}>
              🎯 {totalSets} Series x {targetReps} reps ({completedSetsCount}/{totalSets})
            </span>
          </div>
        </div>

        {/* CHEVRON COMPACTO PARA EXPANDIR */}
        <button
          type="button"
          onClick={onToggleExpand}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            border: 'none',
            background: isExpanded ? '#0066ff' : '#f1f5f9',
            color: isExpanded ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s'
          }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* BARRA FLOTANTE DE REORDENAMIENTO (APARECE AL DEJAR PRESIONADO O TOCAR EL ICONO DE AGARRE) */}
      {isReorderMode && (
        <div className="animate-fade" style={{ background: '#6366f1', color: '#ffffff', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '900' }}>
            🔀 Reordenar Ejercicio:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              disabled={isFirst}
              onClick={() => {
                onMoveUp();
                if (navigator.vibrate) navigator.vibrate(30);
              }}
              style={{ background: isFirst ? 'rgba(255,255,255,0.3)' : '#ffffff', color: isFirst ? '#94a3b8' : '#4338ca', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowUp size={14} /> Mover Arriba
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => {
                onMoveDown();
                if (navigator.vibrate) navigator.vibrate(30);
              }}
              style={{ background: isLast ? 'rgba(255,255,255,0.3)' : '#ffffff', color: isLast ? '#94a3b8' : '#4338ca', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowDown size={14} /> Mover Abajo
            </button>
            <button
              type="button"
              onClick={() => setIsReorderMode(false)}
              style={{ background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}
            >
              ✓ Listo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
