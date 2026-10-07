import React, { useRef, useEffect } from 'react';
import { Calendar, RotateCcw, Copy, CheckCircle2 } from 'lucide-react';

export default function TimelineSelector({
  selectedDateKey,
  setSelectedDateKey,
  currentWeek,
  onResetMesocycle,
  onClonePreviousWeek,
  isHistoryLoading,
  workoutHistory = [],
  isDeloadMode = false,
  onToggleDeload = null,
  fatigueStatus = null,
  activeOverride = null
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

  // Mapa rápido de sesiones indexadas por fecha (YYYY-MM-DD)
  const historyByDateMap = {};
  (workoutHistory || []).forEach(session => {
    if (session) {
      let key = session.date;
      if (!key && session.timestamp) {
        const d = new Date(session.timestamp);
        if (!isNaN(d.getTime())) {
          key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }
      }
      if (key) {
        historyByDateMap[key] = session;
      }
    }
  });

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
      const session = historyByDateMap[key];
      const isCompleted = !!session && !session.isRestDay && !session.isMissedDay && (session.volume > 0 || session.completedSets > 0 || session.isCompleted);
      const isRestDay = !!session && session.isRestDay;
      const isMissedDay = !!session && session.isMissedDay;

      dates.push({ key, dayName, dayNumber, isToday, d, meta, isCompleted, isRestDay, isMissedDay, session });
    }
    return dates;
  };

  const dates = generateDates();

  // Scroll inicial al día seleccionado
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-is-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDateKey]);

  const isDeloadGlow = !isDeloadMode && fatigueStatus?.shouldHighlightDeload;

  return (
    <div className="card" style={{ padding: '16px', marginBottom: '14px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1.5px solid #334155', borderRadius: '24px', color: '#ffffff', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)' }}>
      
      {/* Cabecera del Mesociclo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Calendar size={18} color="#38bdf8" />
            <span style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8' }}>
              Mesociclo Científico
            </span>
            {activeOverride && (
              <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 7px', borderRadius: '8px', fontWeight: '900', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                ⚡ Split: {activeOverride.splitType?.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>
          <div style={{ fontSize: '19px', fontWeight: '900', color: isDeloadMode ? '#86efac' : '#ffffff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Semana {currentWeek}
            {isDeloadMode && (
              <span style={{ fontSize: '11px', background: '#065f46', color: '#86efac', border: '1px solid #10b981', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                🧘 Deload Activo
              </span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: isDeloadMode ? '#86efac' : '#94a3b8', fontWeight: '700' }}>
            {isDeloadMode 
              ? '🧘 Semana de Descarga: Volumen al 50%, cargas al 80% y RIR 3-4' 
              : (currentWeek === 1 ? '🌱 Semana de Calibración & Línea Base' : `🔥 Fase de Sobrecarga Progresiva (S${currentWeek})`)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {onToggleDeload && (
            <button
              type="button"
              onClick={onToggleDeload}
              title={isDeloadMode ? "Desactivar modo descarga" : (fatigueStatus?.reason || "Activar semana de descarga (Deload)")}
              style={{
                background: isDeloadMode 
                  ? '#065f46' 
                  : (isDeloadGlow ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)'),
                border: isDeloadMode 
                  ? '1.5px solid #10b981' 
                  : (isDeloadGlow ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.2)'),
                color: isDeloadMode 
                  ? '#86efac' 
                  : (isDeloadGlow ? '#fbbf24' : '#e2e8f0'),
                padding: '8px 11px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '900',
                boxShadow: isDeloadGlow ? '0 0 14px rgba(245, 158, 11, 0.6)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{isDeloadMode ? '🧘 Salir Deload' : (isDeloadGlow ? '⚠️ Sugerir Deload' : '🧘 Deload')}</span>
            </button>
          )}

          {currentWeek > 1 && onClonePreviousWeek && (
            <button 
              type="button"
              onClick={onClonePreviousWeek}
              title="Clonar pesos de semana anterior"
              style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '8px 10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800' }}
            >
              <Copy size={14} /> Clonar S{currentWeek - 1}
            </button>
          )}
          <button 
            type="button"
            onClick={onResetMesocycle}
            title="Reiniciar Mesociclo a Semana 1"
            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '8px 10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800' }}
          >
            <RotateCcw size={14} /> Reiniciar
          </button>
        </div>
      </div>

      {/* Timeline Scrollable con palomitas de verificación completadas */}
      <div 
        ref={scrollRef}
        style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto', 
          padding: '4px 2px 8px 2px', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {dates.map((item) => {
          const isActive = item.key === selectedDateKey;
          let borderStyle = isActive ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)';
          let bgStyle = isActive ? '#0066ff' : 'rgba(255, 255, 255, 0.07)';
          
          if (item.isCompleted && !isActive) {
            borderStyle = '1.5px solid #059669';
            bgStyle = 'rgba(16, 185, 129, 0.12)';
          }

          return (
            <button
              key={item.key}
              type="button"
              data-is-active={isActive}
              onClick={() => setSelectedDateKey(item.key)}
              style={{
                flex: '0 0 auto',
                minWidth: isActive ? '68px' : '58px',
                padding: isActive ? '10px 8px' : '8px 6px',
                borderRadius: '16px',
                border: borderStyle,
                background: bgStyle,
                color: isActive ? '#ffffff' : '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                boxShadow: isActive ? '0 6px 18px rgba(0, 102, 255, 0.45)' : 'none',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Palomita / Indicador de Estado en la esquina */}
              {item.isCompleted ? (
                <div 
                  title="Entrenamiento completado y archivado"
                  style={{
                    position: 'absolute',
                    top: '3px',
                    right: '3px',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '8px',
                    fontWeight: '900',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  ✓
                </div>
              ) : item.isRestDay ? (
                <div style={{ position: 'absolute', top: '2px', right: '3px', fontSize: '9px' }}>💤</div>
              ) : item.isMissedDay ? (
                <div style={{ position: 'absolute', top: '2px', right: '3px', fontSize: '9px' }}>❌</div>
              ) : item.isToday ? (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isActive ? '#ffffff' : '#38bdf8',
                  boxShadow: '0 0 6px #38bdf8'
                }} />
              ) : null}

              <span style={{ fontSize: '10px', textTransform: 'capitalize', fontWeight: '900', color: isActive ? '#ffffff' : '#94a3b8', letterSpacing: '0.3px' }}>
                {item.dayName}
              </span>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', lineHeight: 1 }}>
                {item.dayNumber}
              </span>
              <span style={{ fontSize: '13px', lineHeight: 1, marginTop: '2px' }} title={item.meta.label}>
                {item.meta.icon}
              </span>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}
