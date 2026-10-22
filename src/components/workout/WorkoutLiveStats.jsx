import React from 'react';
import { RefreshCcw, Flame, Clock } from 'lucide-react';

export default function WorkoutLiveStats({
  currentDay,
  volume = 0,
  completedSets = 0,
  warmupSets = 0,
  handleResetCurrent,
  calories = null,
  elapsedMinutes = 0
}) {
  if (currentDay.type !== 'workout') return null;

  const formatTime = (mins) => {
    if (!mins || mins <= 0) return '--';
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div 
      className="card"
      style={{ 
        background: 'var(--bg-surface)', 
        color: 'var(--text-main)', 
        padding: '8px 12px', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: '10px', 
        border: '1px solid var(--border-subtle)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr) auto',
        alignItems: 'center',
        gap: '6px',
        textAlign: 'left'
      }}
    >
      <div>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.4px' }}>Carga</span>
        <strong className="font-mono-tech" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '800' }}>
          {volume.toLocaleString()} <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '600' }}>lbs</span>
        </strong>
      </div>
      <div>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.4px' }}>Series</span>
        <strong className="font-mono-tech" style={{ fontSize: '14px', color: 'var(--accent-emerald)', fontWeight: '800' }}>
          {completedSets}
          {warmupSets > 0 && <span style={{ fontSize: '9px', color: 'var(--accent-amber)', fontWeight: '700' }}> +{warmupSets}</span>}
        </strong>
      </div>
      <div>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.4px' }}>Tiempo</span>
        <strong className="font-mono-tech" style={{ fontSize: '14px', color: 'var(--accent-cyan)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Clock size={11} color="var(--accent-cyan)" />
          {formatTime(elapsedMinutes)}
        </strong>
      </div>
      <div>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.4px' }}>Gasto</span>
        <strong className="font-mono-tech" style={{ fontSize: '14px', color: 'var(--accent-amber)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Flame size={11} color="var(--accent-amber)" />
          {calories?.totalKcal || 0} <span style={{ fontSize: '9px', color: 'var(--accent-amber)', opacity: 0.8 }}>kcal</span>
        </strong>
      </div>
      <button 
        type="button"
        onClick={() => {
          if (navigator.vibrate) {
            try { navigator.vibrate(20); } catch (e) {}
          }
          handleResetCurrent();
        }} 
        title="Reiniciar casillas hoy" 
        style={{ 
          background: 'var(--bg-surface-secondary)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '8px', 
          padding: '6px', 
          color: 'var(--text-muted)', 
          cursor: 'pointer', 
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease'
        }}
      >
        <RefreshCcw size={13} />
      </button>
    </div>
  );
}
