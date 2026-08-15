import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';
import GymMembershipReminder from '../common/GymMembershipReminder';
import TimelineSelector from './TimelineSelector';

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
  workoutHistory = []
}) {
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
      />

      {/* ENFOQUE FISIOLÓGICO */}
      <div className="card card-highlight" style={{ padding: '16px', marginBottom: '14px' }}>
        <div className="flex-between">
          <div>
            <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Día {currentDay.dayNumber || (currentDayIndex + 1)} de 7 • {(((historySession && historySession.dayName) || currentDay.name || '').split(':')[0]) || 'Rutina'}
            </span>
            <h2 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
              {((historySession && historySession.dayName) || currentDay.name || '').includes(':') 
                ? ((historySession && historySession.dayName) || currentDay.name || '').split(':')[1] 
                : ((historySession && historySession.dayName) || currentDay.name || '')}
            </h2>
          </div>
          {previousSession?.dateString && !isViewingHistory && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', background: '#f1f5f9', padding: '4px 8px', borderRadius: '10px' }}>
              Último: {previousSession.dateString.split(',')[0]}
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', marginTop: '8px', color: '#475569', fontWeight: '500', lineHeight: '1.5', margin: '8px 0 0 0' }}>
          {historySession?.focus || currentDay.focus || 'Enfoque biomecánico e hipertrofia.'}
        </p>
        {!isViewingHistory && (
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleResetToOfficialRoutine}
              style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                padding: '5px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} /> ↺ Restablecer Día a Oficial
            </button>
          </div>
        )}
      </div>

      {historySession && (
        <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', padding: '12px 14px', borderRadius: '16px', marginBottom: '16px', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} color="#059669" />
            <div>
              <strong style={{ display: 'block', fontSize: '13px', color: '#047857' }}>
                💾 Sesión Guardada del {selectedDateKey} ({historySession.dayName || baseDay.name})
              </strong>
              <span style={{ fontSize: '12px', color: '#059669' }}>
                {historySession.completedSets || completedSets} series registradas • {historySession.volume || volume} lbs-reps. Puedes editar tus pesos o series en cualquier momento.
              </span>
            </div>
          </div>
        </div>
      )}
      
      {isViewingHistory && !historySession && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', padding: '12px', borderRadius: '16px', marginBottom: '16px', color: '#b91c1c' }}>
          <strong style={{ display: 'block', fontSize: '13px' }}>Fecha sin registro</strong>
          <span style={{ fontSize: '12px' }}>No hay entrenamiento guardado para el {selectedDateKey}.</span>
        </div>
      )}

      {!isViewingHistory && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => handleSaveSpecialDay('rest')} style={{ flex: 1, padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#475569', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
            💤 Día de Descanso
          </button>
          <button onClick={() => handleSaveSpecialDay('miss')} style={{ flex: 1, padding: '10px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#dc2626', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
            ❌ Falta / Ausencia
          </button>
        </div>
      )}
    </>
  );
}
