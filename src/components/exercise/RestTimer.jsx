import React from 'react';
import { Clock, RotateCcw, Square, Play } from 'lucide-react';
import { useGlobalTimer } from '../../contexts/GlobalTimerContext';

export default function RestTimer({
  exercise,
  effectiveRestSeconds,
  totalSets,
  onUpdateExerciseMeta
}) {
  const { restTimerSeconds, isTimerActive, startTimer, stopTimer, setTimerDuration } = useGlobalTimer();

  return (
    <div style={{
      background: isTimerActive ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#f8fafc',
      color: isTimerActive ? '#ffffff' : '#0f172a',
      padding: '8px 10px',
      borderRadius: '14px',
      marginBottom: '10px',
      border: isTimerActive ? '1.5px solid #38bdf8' : '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      width: '100%',
      boxShadow: isTimerActive ? '0 4px 14px rgba(56, 189, 248, 0.2)' : 'none'
    }}>
      {/* Lado Izquierdo: Estado del Temporizador */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexShrink: 0 }}>
        <Clock size={15} color={isTimerActive ? '#38bdf8' : '#0066ff'} />
        <span style={{ fontSize: '12px', fontWeight: '900', color: isTimerActive ? '#38bdf8' : '#334155' }}>
          {isTimerActive ? `${restTimerSeconds}s` : `Descanso`}
        </span>
      </div>

      {/* Selector Rápido de Presets (90s / 120s) */}
      {!isTimerActive && (
        <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' }}>
          {[90, 120].map((secs) => {
            const isSelected = effectiveRestSeconds === secs;
            return (
              <button
                key={secs}
                type="button"
                onClick={() => {
                  if (onUpdateExerciseMeta) {
                    onUpdateExerciseMeta({
                      name: exercise.name,
                      muscleGroup: exercise.muscleGroup || 'General',
                      customSetsCount: totalSets,
                      customRestSeconds: secs
                    });
                  }
                  setTimerDuration(secs);
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid #0066ff' : '1px solid #cbd5e1',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  color: isSelected ? '#0066ff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: isSelected ? '900' : '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {secs}s
              </button>
            );
          })}
        </div>
      )}

      {/* Lado Derecho: Controles Activos / Botón Iniciar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {isTimerActive ? (
          <>
            <button
              type="button"
              onClick={() => { stopTimer(); setTimerDuration(effectiveRestSeconds); startTimer(effectiveRestSeconds, exercise.name); }}
              title="Reiniciar temporizador"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '8px', padding: '5px 8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RotateCcw size={12} />
            </button>
            <button
              type="button"
              onClick={stopTimer}
              title="Parar temporizador"
              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <Square size={11} fill="#fff" /> Parar
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => startTimer(effectiveRestSeconds, exercise.name)}
            style={{ background: '#0066ff', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(0, 102, 255, 0.25)' }}
          >
            <Play size={11} fill="#fff" /> Iniciar ({effectiveRestSeconds}s)
          </button>
        )}
      </div>
    </div>
  );
}
