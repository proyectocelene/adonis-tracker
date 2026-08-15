import React from 'react';
import { RefreshCcw } from 'lucide-react';

export default function WorkoutLiveStats({
  currentDay,
  volume = 0,
  completedSets = 0,
  handleResetCurrent
}) {
  if (currentDay.type !== 'workout') return null;

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
      color: '#fff', 
      padding: '14px 18px', 
      borderRadius: '20px', 
      marginBottom: '16px', 
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div>
        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Carga Levantada</span>
        <strong style={{ fontSize: '18px', color: '#ffffff', fontWeight: '800' }}>{volume.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8' }}>lbs-reps</span></strong>
      </div>
      <div>
        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Series Listas</span>
        <strong style={{ fontSize: '18px', color: '#00b464', fontWeight: '800' }}>{completedSets} <span style={{ fontSize: '11px', color: '#94a3b8' }}>Fuerza</span></strong>
      </div>
      <button 
        type="button"
        onClick={handleResetCurrent} 
        title="Reiniciar casillas hoy" 
        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', padding: '8px', color: '#ffffff', cursor: 'pointer' }}
      >
        <RefreshCcw size={16} />
      </button>
    </div>
  );
}
