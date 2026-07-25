import React from 'react';
import { Calendar, Award, CheckCircle, Flame } from 'lucide-react';

export default function ConsistencyHeatmap({ workoutHistory = [] }) {
  const totalDays = 84;
  const today = new Date();
  const daysArray = [];

  const activeDatesMap = {};
  workoutHistory.forEach(ses => {
    if (ses.timestamp) {
      const dateKey = new Date(ses.timestamp).toISOString().split('T')[0];
      activeDatesMap[dateKey] = (activeDatesMap[dateKey] || 0) + (ses.volume || 1);
    }
  });

  let activeDaysCount = 0;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const volume = activeDatesMap[dateKey] || 0;
    
    if (volume > 0) activeDaysCount++;

    daysArray.push({
      date: d,
      dateString: d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      dayOfWeek: d.getDay(),
      volume
    });
  }

  const hasRealHistory = workoutHistory.length > 0;
  const adherencePercent = hasRealHistory ? Math.round((activeDaysCount / totalDays) * 100) : 0;
  
  const getCellColor = (vol) => {
    if (vol === 0) return '#e2e8f0';
    if (vol < 8000) return '#34d399';
    if (vol < 15000) return '#10b981';
    return '#047857';
  };

  return (
    <div className="card" style={{ padding: '18px', marginBottom: '20px', borderTop: '4px solid #00b464' }}>
      <div className="flex-between" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Calendar size={20} color="#00b464" />
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', whiteSpace: 'normal' }}>Heatmap de Consistencia (12 Semanas)</h2>
        </div>
        <span className="badge badge-green" style={{ fontWeight: '800' }}>
          {hasRealHistory ? `Adherencia: ${adherencePercent}%` : `0% (Sin registros archivados)`}
        </span>
      </div>

      <p style={{ fontSize: '13px', marginBottom: '16px', color: '#475569', lineHeight: '1.5' }}>
        Cada celda representa un día del calendario. La intensidad del color verde aumentará exclusivamente según el volumen mecánico real (Lbs × Reps) alcanzado en tus sesiones archivadas. Sin datos predeterminados.
      </p>

      <div style={{ overflowX: 'auto', paddingBottom: '6px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateRows: 'repeat(7, 1fr)', 
          gridAutoFlow: 'column', 
          gap: '5px',
          minWidth: '280px'
        }}>
          {daysArray.map((item, idx) => {
            const color = getCellColor(item.volume);
            return (
              <div 
                key={idx} 
                title={`${item.dateString}: ${item.volume > 0 ? `${item.volume.toLocaleString()} lbs-reps` : 'Sin actividad registrada'}`}
                style={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: color,
                  borderRadius: '4px',
                  boxShadow: item.volume > 0 ? '0 2px 4px rgba(0, 180, 100, 0.2)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
              />
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
        <span>0 Carga / Inactivo</span>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <div style={{ width: '13px', height: '13px', background: '#e2e8f0', borderRadius: '3px' }} />
          <div style={{ width: '13px', height: '13px', background: '#34d399', borderRadius: '3px' }} />
          <div style={{ width: '13px', height: '13px', background: '#10b981', borderRadius: '3px' }} />
          <div style={{ width: '13px', height: '13px', background: '#047857', borderRadius: '3px' }} />
        </div>
        <span>Récord de volumen</span>
      </div>
    </div>
  );
}
