import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { useCardioState, EMPTY_EXERCISE_DATA, DEFAULT_USER_WEIGHT_KG } from '../hooks/cardio/useCardioState';
import { useCardioTimer } from '../hooks/cardio/useCardioTimer';
import CardioHeader from './cardio/CardioHeader';
import TreadmillSection from './cardio/TreadmillSection';
import WatchCalibrationSection from './cardio/WatchCalibrationSection';

export default function CardioLogger({
  exercise,
  exerciseData = EMPTY_EXERCISE_DATA,
  onUpdateCardio,
  initiallyExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand,
  userWeightKg = DEFAULT_USER_WEIGHT_KG
}) {
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const handleToggle = onToggleExpand ? onToggleExpand : () => setInternalExpanded(prev => !prev);

  const {
    machineType,
    setMachineType,
    machineLabel,
    calculatedDuration,
    metrics,
    notifyChange,
    completed,
    toggleCompleted,
    duration,
    setDuration,
    isDualPhase,
    setIsDualPhase,
    treadmillIncline,
    setTreadmillIncline,
    treadmillSpeed,
    setTreadmillSpeed,
    treadmillDistance,
    setTreadmillDistance,
    watchHrAvg,
    setWatchHrAvg,
    watchHrMax,
    setWatchHrMax,
    watchSteps,
    setWatchSteps,
    watchKcal,
    setWatchKcal,
    machineKcal,
    setMachineKcal,
    cardioNotesInput,
    setCardioNotesInput
  } = useCardioState({
    exercise,
    exerciseData,
    onUpdateCardio,
    userWeightKg
  });

  const {
    timerRunning,
    timerSeconds,
    formatTimer,
    resetTimer,
    toggleTimer
  } = useCardioTimer();

  const handleApplyTimer = () => {
    const mins = Math.round((timerSeconds / 60) * 10) / 10;
    const val = mins > 0 ? String(mins) : '40';
    setDuration(val);
    resetTimer();
    notifyChange({ duration: parseFloat(val) });
  };

  const isLegacySession = machineType !== 'treadmill' || isDualPhase;

  return (
    <div
      className="card animate-fade"
      style={{
        marginBottom: '16px',
        borderRadius: '20px',
        background: 'var(--bg-surface)',
        border: completed ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
        boxShadow: completed
          ? '0 8px 24px rgba(16, 185, 129, 0.18)'
          : 'var(--shadow-ios)',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
      }}
    >
      <CardioHeader
        completed={completed}
        machineType={machineType}
        isDualPhase={isDualPhase}
        exercise={exercise}
        calculatedDuration={calculatedDuration}
        inclinePct={parseFloat(treadmillIncline) || 10}
        speedKmh={parseFloat(treadmillSpeed) || 4.0}
        metrics={metrics}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        onToggleCompleted={toggleCompleted}
      />

      {isExpanded && (
        <div className="animate-fade" style={{ padding: '14px', background: 'var(--bg-surface)', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isLegacySession ? (
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '12px', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
                  📜 Sesión histórica ({machineLabel})
                </strong>
                <button
                  type="button"
                  onClick={() => {
                    setMachineType('treadmill');
                    setIsDualPhase(false);
                    notifyChange({ machineType: 'treadmill', isDualPhase: false });
                  }}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--accent-blue)',
                    background: 'var(--accent-blue-light)',
                    color: 'var(--accent-blue)',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Cambiar a Caminadora Z2
                </button>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                Duración: {calculatedDuration} min · Gasto estimado: {metrics.cardioKcal || 0} kcal
                {metrics.distanceKm > 0 ? ` · Distancia: ${metrics.distanceKm} km` : ''}
                {exerciseData?.heartRate > 0 ? ` · FC: ${exerciseData.heartRate} lpm` : ''}
              </div>
              {exerciseData?.notes && (
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Notas: {exerciseData.notes}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Guía compacta (1 línea) + Cronómetro inline */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flexWrap: 'wrap',
                padding: '8px 10px',
                borderRadius: '12px',
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>
                  Meta: 35–45 min · FC 120–135 lpm o prueba del habla · 8–12% · 3.5–4.2 km/h
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '900', color: 'var(--text-main)' }}>
                    ⏱️ {formatTimer(timerSeconds)}
                  </span>
                  <button
                    type="button"
                    onClick={toggleTimer}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: timerRunning ? '#d97706' : '#059669',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {timerRunning ? <><Pause size={12} /> Pausar</> : <><Play size={12} /> Iniciar</>}
                  </button>
                  {timerSeconds > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={handleApplyTimer}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#0284c7',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        <Check size={12} /> Aplicar min
                      </button>
                      <button
                        type="button"
                        onClick={resetTimer}
                        title="Reiniciar cronómetro"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 6px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-card)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        <RotateCcw size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bloque 1: Datos de la Caminadora */}
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '12px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <TreadmillSection
                  duration={duration}
                  setDuration={setDuration}
                  treadmillIncline={treadmillIncline}
                  setTreadmillIncline={setTreadmillIncline}
                  treadmillSpeed={treadmillSpeed}
                  setTreadmillSpeed={setTreadmillSpeed}
                  treadmillDistance={treadmillDistance}
                  setTreadmillDistance={setTreadmillDistance}
                  machineKcal={machineKcal}
                  setMachineKcal={setMachineKcal}
                  metrics={metrics}
                  notifyChange={notifyChange}
                />
              </div>

              {/* Bloque 2: Datos del Reloj (opcional) */}
              <WatchCalibrationSection
                watchHrAvg={watchHrAvg}
                setWatchHrAvg={setWatchHrAvg}
                watchHrMax={watchHrMax}
                setWatchHrMax={setWatchHrMax}
                watchSteps={watchSteps}
                setWatchSteps={setWatchSteps}
                watchKcal={watchKcal}
                setWatchKcal={setWatchKcal}
                cardioNotesInput={cardioNotesInput}
                setCardioNotesInput={setCardioNotesInput}
                metrics={metrics}
                notifyChange={notifyChange}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
