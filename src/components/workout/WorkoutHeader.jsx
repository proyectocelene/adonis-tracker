import React from 'react';
import { RefreshCw, CheckCircle, Moon, Sun } from 'lucide-react';
import TimelineSelector from './TimelineSelector';
import { formatSessionDate } from '../../utils/exerciseMatcher';
import { useTheme } from '../../contexts/ThemeContext';

export default function WorkoutHeader({
  isViewingHistory,
  historySession,
  selectedDateKey,
  setSelectedDateKey,
  currentWeek,
  todayStr,
  currentDay,
  currentDayIndex,
  baseDay,
  previousSession,
  modal,
  setMesocycleStartDate,
  handleClonePreviousWeek,
  handleResetToOfficialRoutine,
  handleSaveSpecialDay,
  isHistoryLoading,
  completedSets,
  volume,
  workoutHistory = [],
  isDeloadMode = false,
  onToggleDeload = null,
  fatigueStatus = null,
  activeOverride = null,
  onOpenRescheduleModal = null
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <TimelineSelector
        selectedDateKey={selectedDateKey}
        setSelectedDateKey={setSelectedDateKey}
        currentWeek={isViewingHistory && historySession ? historySession.weekNumber : currentWeek}
        onResetMesocycle={() => {
          modal.showConfirm({
            title: "⚠️ ¿Reiniciar Mesociclo?",
            message: "Esto establecerá HOY como el inicio de la Semana 1. Todo tu historial pasado seguirá guardado, pero el conteo de semanas se reiniciará.",
            confirmText: "Sí, Reiniciar",
            variant: "danger",
            onConfirm: () => {
              setMesocycleStartDate(new Date().toISOString());
              setSelectedDateKey(todayStr);
            }
          });
        }}
        onClonePreviousWeek={
          (!isViewingHistory && currentWeek > 1) ? handleClonePreviousWeek : null
        }
        isHistoryLoading={isHistoryLoading}
        workoutHistory={workoutHistory}
        isDeloadMode={isDeloadMode}
        onToggleDeload={onToggleDeload}
        fatigueStatus={fatigueStatus}
        activeOverride={activeOverride}
      />

      {/* CABECERA COMPACTA DEL DÍA + CONMUTADOR DE TEMA */}
      <div 
        className="card" 
        style={{ 
          padding: '10px 12px', 
          marginBottom: '10px',
          borderLeft: '4px solid var(--accent-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: '10.5px', 
              color: 'var(--accent-blue)', 
              fontWeight: '900', 
              textTransform: 'uppercase', 
              letterSpacing: '0.4px' 
            }}>
              Día {currentDay.dayNumber || (currentDayIndex + 1)} de 7 • {(((historySession && historySession.dayName) || currentDay.name || '').split(':')[0]) || 'Rutina'}
            </span>
            {(previousSession?.dateString || previousSession?.date) && !isViewingHistory && (
              <span style={{ 
                fontSize: '9.5px', 
                color: 'var(--text-muted)', 
                fontWeight: '700', 
                background: 'var(--bg-surface-secondary)', 
                border: '1px solid var(--border-subtle)',
                padding: '1px 6px', 
                borderRadius: '6px' 
              }}>
                Último: {formatSessionDate(previousSession)}
              </span>
            )}
          </div>
          <h2 style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.25' }}>
            {((historySession && historySession.dayName) || currentDay.name || '').includes(':') 
              ? ((historySession && historySession.dayName) || currentDay.name || '').split(':')[1] 
              : ((historySession && historySession.dayName) || currentDay.name || '')}
          </h2>
        </div>

        {/* CONTROLES SUPERIORES: BOTÓN OFICIAL Y TOGGLE TEMA OLED */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          {!isViewingHistory && (
            <button
              type="button"
              onClick={handleResetToOfficialRoutine}
              title="Restablecer día a la rutina oficial"
              style={{
                background: 'var(--bg-surface-secondary)',
                color: 'var(--accent-blue)',
                border: '1px solid var(--border-strong)',
                padding: '5px 8px',
                borderRadius: '8px',
                fontSize: '10.5px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={11} /> ↺ Oficial
            </button>
          )}

          {/* TOGGLE TEMA: 🌙 OLED / ☀️ CLARO */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Cambiar a modo Claro Clínico' : 'Cambiar a modo OLED Cyber-Clinical'}
            style={{
              background: isDark ? '#11151c' : '#ffffff',
              color: isDark ? '#ffb300' : '#0284c7',
              border: '1px solid var(--border-strong)',
              padding: '6px 8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDark ? '0 0 8px rgba(255, 179, 0, 0.15)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {historySession && (
        <div style={{ 
          background: 'var(--bg-surface-secondary)', 
          border: '1px solid var(--accent-emerald)', 
          padding: '10px 12px', 
          borderRadius: '12px', 
          marginBottom: '10px', 
          color: 'var(--accent-emerald)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} color="var(--accent-emerald)" />
            <div>
              <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-main)' }}>
                💾 Sesión Guardada del {selectedDateKey} ({historySession.dayName || baseDay.name})
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {historySession.completedSets || completedSets} series registradas • {historySession.volume || volume} lbs-reps.
              </span>
            </div>
          </div>
        </div>
      )}
      
      {isViewingHistory && !historySession && (
        <div style={{ 
          background: 'var(--accent-red-subtle)', 
          border: '1px solid var(--accent-red)', 
          padding: '10px 12px', 
          borderRadius: '12px', 
          marginBottom: '10px', 
          color: 'var(--accent-red)' 
        }}>
          <strong style={{ display: 'block', fontSize: '12px' }}>Fecha sin registro</strong>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>No hay entrenamiento guardado para el {selectedDateKey}.</span>
        </div>
      )}

      {!isViewingHistory && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {onOpenRescheduleModal && (
            <button 
              type="button"
              onClick={onOpenRescheduleModal} 
              style={{ 
                flex: '1 1 100%', 
                padding: '9px 12px', 
                background: activeOverride ? 'var(--accent-blue)' : 'var(--bg-surface-secondary)', 
                border: activeOverride ? '1px solid var(--accent-blue)' : '1px solid var(--border-strong)', 
                borderRadius: '10px', 
                fontSize: '11.5px', 
                fontWeight: '800', 
                color: activeOverride ? '#000000' : 'var(--accent-blue)', 
                cursor: 'pointer', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '5px'
              }}
            >
              <span>⚡ {activeOverride ? `Split Activo: ${activeOverride.splitType?.replace('_', ' ').toUpperCase()}` : '¿No puedes entrenar hoy? Ajustar Semana'}</span>
            </button>
          )}
          <button 
            type="button" 
            onClick={() => handleSaveSpecialDay('rest')} 
            style={{ 
              flex: 1, 
              padding: '8px', 
              background: 'var(--bg-surface-secondary)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '10px', 
              fontSize: '11.5px', 
              fontWeight: '700', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '4px' 
            }}
          >
            💤 Descanso
          </button>
          <button 
            type="button" 
            onClick={() => handleSaveSpecialDay('miss')} 
            style={{ 
              flex: 1, 
              padding: '8px', 
              background: 'var(--accent-red-subtle)', 
              border: '1px solid var(--accent-red)', 
              borderRadius: '10px', 
              fontSize: '11.5px', 
              fontWeight: '700', 
              color: 'var(--accent-red)', 
              cursor: 'pointer', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '4px' 
            }}
          >
            ❌ Falta
          </button>
        </div>
      )}
    </>
  );
}
