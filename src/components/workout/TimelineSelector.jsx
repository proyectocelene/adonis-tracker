import React, { useRef, useEffect } from 'react';
import { Calendar, RotateCcw, Copy } from 'lucide-react';

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
    <div 
      className="card" 
      style={{ 
        padding: '10px 12px', 
        marginBottom: '10px', 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-lg)', 
        color: 'var(--text-main)'
      }}
    >
      {/* Cabecera del Mesociclo Compacta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Calendar size={15} color="var(--accent-blue)" />
            <span style={{ fontSize: '10.5px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--accent-blue)' }}>
              Mesociclo • S{currentWeek}
            </span>
            {activeOverride && (
              <span style={{ fontSize: '9.5px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', padding: '1px 6px', borderRadius: '6px', fontWeight: '900', border: '1px solid var(--border-strong)' }}>
                ⚡ {activeOverride.splitType?.replace('_', ' ').toUpperCase()}
              </span>
            )}
            {isDeloadMode && (
              <span style={{ fontSize: '9.5px', background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                🧘 Deload
              </span>
            )}
          </div>
          <div style={{ fontSize: '10px', color: isDeloadMode ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: '600', marginTop: '1px' }}>
            {isDeloadMode 
              ? 'Descarga: Vol 50%, Cargas 80%, RIR 3-4' 
              : (currentWeek === 1 ? 'Calibración & Línea Base' : `Sobrecarga Progresiva (Semana ${currentWeek})`)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
          {onToggleDeload && (
            <button
              type="button"
              onClick={onToggleDeload}
              title={isDeloadMode ? "Desactivar descarga" : (fatigueStatus?.reason || "Activar Deload")}
              style={{
                background: isDeloadMode 
                  ? 'var(--accent-emerald-subtle)' 
                  : (isDeloadGlow ? 'var(--accent-amber-subtle)' : 'var(--bg-surface-secondary)'),
                border: isDeloadMode 
                  ? '1px solid var(--accent-emerald)' 
                  : (isDeloadGlow ? '1px solid var(--accent-amber)' : '1px solid var(--border-strong)'),
                color: isDeloadMode 
                  ? 'var(--accent-emerald)' 
                  : (isDeloadGlow ? 'var(--accent-amber)' : 'var(--text-secondary)'),
                padding: '5px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '10.5px',
                fontWeight: '800',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{isDeloadMode ? '🧘 Salir Deload' : (isDeloadGlow ? '⚠️ Deload' : '🧘 Deload')}</span>
            </button>
          )}

          {currentWeek > 1 && onClonePreviousWeek && (
            <button 
              type="button"
              onClick={onClonePreviousWeek}
              title="Clonar pesos de semana anterior"
              style={{ 
                background: 'var(--accent-emerald-subtle)', 
                border: '1px solid var(--accent-emerald)', 
                color: 'var(--accent-emerald)', 
                padding: '5px 8px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '3px', 
                fontSize: '10.5px', 
                fontWeight: '800' 
              }}
            >
              <Copy size={12} /> S{currentWeek - 1}
            </button>
          )}
          <button 
            type="button"
            onClick={onResetMesocycle}
            title="Reiniciar Mesociclo a Semana 1"
            style={{ 
              background: 'var(--bg-surface-secondary)', 
              border: '1px solid var(--border-subtle)', 
              color: 'var(--text-muted)', 
              padding: '5px 8px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3px', 
              fontSize: '10.5px', 
              fontWeight: '700' 
            }}
          >
            <RotateCcw size={12} /> Reiniciar
          </button>
        </div>
      </div>

      {/* Timeline Scrollable Compacto (OLED Anti-Reflejo) */}
      <div 
        ref={scrollRef}
        style={{ 
          display: 'flex', 
          gap: '6px', 
          overflowX: 'auto', 
          padding: '2px 1px 4px 1px', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {dates.map((item) => {
          const isActive = item.key === selectedDateKey;
          let borderStyle = isActive ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-subtle)';
          let bgStyle = isActive ? 'var(--accent-blue)' : 'var(--bg-surface-secondary)';
          let textColor = isActive ? '#000000' : 'var(--text-secondary)';
          
          if (item.isCompleted && !isActive) {
            borderStyle = '1.5px solid var(--accent-emerald)';
            bgStyle = 'var(--accent-emerald-subtle)';
            textColor = 'var(--accent-emerald)';
          }

          return (
            <button
              key={item.key}
              type="button"
              data-is-active={isActive}
              onClick={() => {
                if (navigator.vibrate) {
                  try { navigator.vibrate(15); } catch (e) {}
                }
                setSelectedDateKey(item.key);
              }}
              style={{
                flex: '0 0 auto',
                minWidth: isActive ? '58px' : '50px',
                padding: isActive ? '7px 6px' : '6px 4px',
                borderRadius: '10px',
                border: borderStyle,
                background: bgStyle,
                color: textColor,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1px',
                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              {/* Indicador de Estado en la esquina */}
              {item.isCompleted ? (
                <div 
                  title="Completado"
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'var(--accent-emerald)',
                    color: '#000000',
                    fontSize: '7.5px',
                    fontWeight: '900',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✓
                </div>
              ) : item.isRestDay ? (
                <div style={{ position: 'absolute', top: '1px', right: '2px', fontSize: '8px' }}>💤</div>
              ) : item.isMissedDay ? (
                <div style={{ position: 'absolute', top: '1px', right: '2px', fontSize: '8px' }}>❌</div>
              ) : item.isToday ? (
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: isActive ? '#000000' : 'var(--accent-cyan)'
                }} />
              ) : null}

              <span style={{ fontSize: '9.5px', textTransform: 'capitalize', fontWeight: '800', opacity: 0.9 }}>
                {item.dayName}
              </span>
              <span className="font-mono-tech" style={{ fontSize: '15px', fontWeight: '800', lineHeight: 1.1 }}>
                {item.dayNumber}
              </span>
              <span style={{ fontSize: '11px', lineHeight: 1, marginTop: '1px' }} title={item.meta.label}>
                {item.meta.icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
