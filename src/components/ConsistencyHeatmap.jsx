import React from 'react';
import { Calendar, Award, CheckCircle, Flame } from 'lucide-react';

export default function ConsistencyHeatmap({ workoutHistory = [] }) {
  // Genera los últimos 84 días (12 semanas exactamente para ver la adherencia al tratamiento en un celular sin cortar)
  const totalDays = 84;
  const today = new Date();
  const daysArray = [];

  // Crear mapa de fechas con entrenamiento guardado
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

  // Calcular adherencia (considerando que el protocolo tiene 5 días activos por semana sobre 7 días = ~71% máximo de días activos)
  // Si no hay historial real aún, colorearemos algunas celdas de simulación para que el heatmap se aprecie espectacularmente en vivo
  const isSimulated = workoutHistory.length === 0;
  
  const getCellColor = (index, vol) => {
    if (!isSimulated) {
      if (vol === 0) return '#e2e8f0'; // gris inactivo
      if (vol < 8000) return '#34d399'; // verde claro
      if (vol < 15000) return '#10b981'; // verde medio
      return '#047857'; // verde intenso intenso
    } else {
      // Simulación de consistencia impecable (5 días a la semana)
      const dayMod = index % 7;
      if (dayMod === 3 || dayMod === 6) return '#e2e8f0'; // Jueves y Domingo de descanso
      return index % 3 === 0 ? '#047857' : '#10b981';
    }
  };

  return (
    <div className="card" style={{ padding: '18px', marginBottom: '22px', borderTop: '3px solid var(--accent-green)' }}>
      <div className="flex-between" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--accent-green)" />
          <h2 style={{ margin: 0, fontSize: '16px' }}>Heatmap de Consistencia (Últimas 12 Semanas)</h2>
        </div>
        <span className="badge badge-green">
          {isSimulated ? 'Simulación de Adherencia' : `Adherencia: ${Math.round((activeDaysCount / totalDays) * 100)}%`}
        </span>
      </div>

      <p style={{ fontSize: '12px', marginBottom: '14px', color: '#475569' }}>
        Cada celda representa un día del calendario. La densidad del color verde aumenta según el volumen mecánico ($\text{Lbs} \times \text{Reps}$) levantado en ese día.
      </p>

      {/* Grid de Calor Estilo GitHub */}
      <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateRows: 'repeat(7, 1fr)', 
          gridAutoFlow: 'column', 
          gap: '4px',
          minWidth: '280px'
        }}>
          {daysArray.map((item, idx) => {
            const color = getCellColor(idx, item.volume);
            return (
              <div 
                key={idx} 
                title={`${item.dateString}: ${isSimulated ? (idx % 7 === 3 || idx % 7 === 6 ? 'Descanso' : 'Entrenamiento Completado') : (item.volume > 0 ? `${item.volume.toLocaleString()} lbs-reps` : 'Sin actividad')}`}
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: color,
                  borderRadius: '3px',
                  border: item.volume > 0 || isSimulated && (idx % 7 !== 3 && idx % 7 !== 6) ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  transition: 'transform 0.1s ease'
                }}
              />
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
        <span>Menor intensidad / Descanso</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', background: '#e2e8f0', borderRadius: '2px' }} />
          <div style={{ width: '12px', height: '12px', background: '#34d399', borderRadius: '2px' }} />
          <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }} />
          <div style={{ width: '12px', height: '12px', background: '#047857', borderRadius: '2px' }} />
        </div>
        <span>Mayor volumen</span>
      </div>
    </div>
  );
}
