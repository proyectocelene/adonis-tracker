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
    <div style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
      color: '#fff', 
      padding: '14px 18px', 
      borderRadius: '20px', 
      marginBottom: '16px', 
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr) auto',
      alignItems: 'center',
      border: '1px solid rgba(255,255,255,0.1)',
      gap: '8px',
      textAlign: 'left'
    }}>
      <div>
        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Carga</span>
        <strong style={{ fontSize: '16px', color: '#ffffff', fontWeight: '800' }}>{volume.toLocaleString()} <span style={{ fontSize: '10px', color: '#94a3b8' }}>lbs</span></strong>
      </div>
      <div>
        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Series</span>
        <strong style={{ fontSize: '16px', color: '#00b464', fontWeight: '800' }}>{completedSets} <span style={{ fontSize: '10px', color: '#94a3b8' }}>efectivas</span></strong>
        {warmupSets > 0 && (
          <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '700', marginTop: '1px' }}>
            +{warmupSets} aprox
          </div>
        )}
      </div>
      <div>
        <span style={{ fontSize: '10px', color: '#38bdf8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Tiempo</span>
        <strong style={{ fontSize: '16px', color: '#7dd3fc', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Clock size={13} color="#38bdf8" />
          {formatTime(elapsedMinutes)}
        </strong>
      </div>
      <div>
        <span style={{ fontSize: '10px', color: '#fb923c', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Gasto</span>
        <strong style={{ fontSize: '16px', color: '#fdba74', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Flame size={13} color="#ea580c" />
          {calories?.totalKcal || 0} <span style={{ fontSize: '10px', color: '#fed7aa' }}>kcal</span>
        </strong>
      </div>
      <button 
        type="button"
        onClick={handleResetCurrent} 
        title="Reiniciar casillas hoy" 
        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', padding: '8px', color: '#ffffff', cursor: 'pointer', flexShrink: 0 }}
      >
        <RefreshCcw size={16} />
      </button>
    </div>
  );
}
