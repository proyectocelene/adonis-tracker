import React, { useRef, useEffect } from 'react';
import { Calendar, RotateCcw, Copy } from 'lucide-react';

export default function TimelineSelector({
  selectedDateKey,
  setSelectedDateKey,
  currentWeek,
  onResetMesocycle,
  onClonePreviousWeek,
  isHistoryLoading
}) {
  const scrollRef = useRef(null);

  // Mapeo de rutina para cada día de la semana
  const getDayMeta = (dateObj) => {
    const day = dateObj.getDay();
    switch (day) {
      case 1: return { icon: "🔥", label: "Empuje" }; // Lunes
      case 2: return { icon: "🦵", label: "Piernas" }; // Martes
      case 3: return { icon: "🦍", label: "Jalón" };  // Miércoles
      case 4: return { icon: "🔥", label: "Empuje" }; // Jueves
      case 5: return { icon: "🦵", label: "Piernas" }; // Viernes
      case 6: return { icon: "💪", label: "Torso" };  // Sábado
      case 0: return { icon: "💤", label: "Descanso" };// Domingo
      default: return { icon: "", label: "" };
    }
  };

  // Generar fechas: -14 días hasta +7 días desde hoy
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = -14; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNumber = d.getDate();
      const isToday = i === 0;
      const meta = getDayMeta(d);

      dates.push({ key, dayName, dayNumber, isToday, d, meta });
    }
    return dates;
  };

  const dates = generateDates();

  // Scroll inicial al día actual
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-is-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, []); // Solo en el montaje inicial

  return (
    <div className="card" style={{ padding: '16px', marginBottom: '14px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1.5px solid #334155', borderRadius: '24px', color: '#ffffff', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)' }}>
      
      {/* Cabecera del Mesociclo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#38bdf8" />
            <span style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8' }}>
              Mesociclo Científico
            </span>
          </div>
          <div style={{ fontSize: '19px', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
            🗓️ Semana {currentWeek}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>
            {currentWeek === 1 ? '🌱 Semana de Calibración' : `🔥 Fase de Sobrecarga`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {currentWeek > 1 && onClonePreviousWeek && (
            <button 
              type="button"
              onClick={onClonePreviousWeek}
              title="Clonar pesos de semana anterior"
              style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Copy size={16} />
            </button>
          )}
          <button 
            type="button"
            onClick={onResetMesocycle}
            title="Reiniciar Mesociclo a Semana 1"
            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Timeline Scrollable */}
      <div 
        ref={scrollRef}
        style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto', 
          paddingBottom: '8px', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {dates.map((item) => {
          const isActive = item.key === selectedDateKey;
          return (
            <button
              key={item.key}
              type="button"
              data-is-active={isActive}
              onClick={() => setSelectedDateKey(item.key)}
              style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 14px',
                borderRadius: '16px',
                minWidth: '60px',
                border: isActive ? '1.5px solid #38bdf8' : '1.5px solid transparent',
                background: isActive ? '#0066ff' : (item.isToday ? 'rgba(56, 189, 248, 0.1)' : 'rgba(15, 23, 42, 0.6)'),
                color: isActive ? '#ffffff' : (item.isToday ? '#38bdf8' : '#94a3b8'),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '11px', textTransform: 'capitalize', fontWeight: '800' }}>{item.dayName}</span>
              <span style={{ fontSize: '18px', fontWeight: '900', marginTop: '2px' }}>{item.dayNumber}</span>
              <span style={{ fontSize: '12px', marginTop: '2px', opacity: isActive ? 1 : 0.8 }} title={item.meta.label}>{item.meta.icon}</span>
              {item.isToday && !isActive && (
                <div style={{ width: '4px', height: '4px', background: '#38bdf8', borderRadius: '50%', marginTop: '4px', position: 'absolute', bottom: '4px' }} />
              )}
            </button>
          );
        })}
      </div>
      
    </div>
  );
}
