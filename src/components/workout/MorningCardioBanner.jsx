import React from 'react';
import { Activity } from 'lucide-react';

export default function MorningCardioBanner({ currentDay, todayWorkoutData, onOpenCardio }) {
  const morningCardioEx = currentDay?.exercises?.find(e => e.isCardio);
  if (!morningCardioEx) return null;

  const morningCardioData = todayWorkoutData?.[morningCardioEx.id];
  const isCardioDone = !!morningCardioData?.completed;
  const isRower = morningCardioEx.machineType === 'rower' || morningCardioEx.unifiedCode === '[CARD-ROW_HIIT_NEAT_01]';

  const handleClick = () => {
    if (onOpenCardio) {
      onOpenCardio(morningCardioEx.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: isCardioDone
          ? 'var(--accent-emerald-subtle)'
          : 'var(--bg-surface)',
        border: isCardioDone ? '1px solid var(--accent-emerald)' : '1px solid var(--accent-blue)',
        borderRadius: '12px',
        padding: '8px 12px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          background: isCardioDone ? 'var(--accent-emerald)' : 'var(--accent-blue-light)',
          color: isCardioDone ? '#000000' : 'var(--accent-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Activity size={16} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
            <h4 style={{ margin: 0, fontSize: '12.5px', fontWeight: '800', color: isCardioDone ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
              {isRower ? 'Protocolo Matutino: Remo' : 'Cardio Aeróbico en Zona 2'}
            </h4>
            <span style={{ fontSize: '9px', background: isCardioDone ? 'var(--accent-emerald-subtle)' : 'var(--accent-amber-subtle)', color: isCardioDone ? 'var(--accent-emerald)' : 'var(--accent-amber)', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
              ≥ 6h antes
            </span>
          </div>
          <span style={{ fontSize: '10.5px', color: isCardioDone ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: '600' }}>
            {isCardioDone
              ? `✓ Completado • ${morningCardioData?.cardioKcal || 0} kcal registradas`
              : 'Realizar por la mañana para anular interferencia AMPK/mTOR'}
          </span>
        </div>
      </div>
      <span style={{
        fontSize: '10.5px',
        fontWeight: '800',
        padding: '3px 8px',
        borderRadius: '8px',
        background: isCardioDone ? 'var(--accent-emerald)' : 'var(--accent-blue)',
        color: '#000000',
        flexShrink: 0
      }}>
        {isCardioDone ? '✓ LISTO' : 'ABRIR'}
      </span>
    </div>
  );
}
