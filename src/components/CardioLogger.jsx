import React, { useState } from 'react';
import { Monitor } from 'lucide-react';
import { useCardioState, EMPTY_EXERCISE_DATA } from '../hooks/cardio/useCardioState';
import { useCardioTimer } from '../hooks/cardio/useCardioTimer';
import CardioHeader from './cardio/CardioHeader';
import CardioMachineSelector from './cardio/CardioMachineSelector';
import RowerSection from './cardio/RowerSection';
import TreadmillSection from './cardio/TreadmillSection';
import BikeSection from './cardio/BikeSection';
import EllipticalSection from './cardio/EllipticalSection';
import WatchCalibrationSection from './cardio/WatchCalibrationSection';
import CardioTimerTab from './cardio/CardioTimerTab';
import CardioScienceTab from './cardio/CardioScienceTab';

export default function CardioLogger({ 
  exercise, 
  exerciseData = EMPTY_EXERCISE_DATA, 
  onUpdateCardio,
  initiallyExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand,
  userWeightKg = 78.55,
  onOpenStrengthWatchModal: _onOpenStrengthWatchModal
}) {
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const handleToggle = onToggleExpand ? onToggleExpand : () => setInternalExpanded(prev => !prev);

  const [activeSubTab, setActiveSubTab] = useState('logger'); // 'logger' | 'timer' | 'science'

  const {
    machineType,
    setMachineType,
    machineLabel,
    calculatedDuration,
    metrics,
    currentCardioState,
    notifyChange,
    completed,
    toggleCompleted,
    duration,
    setDuration,
    rowOption,
    setRowOption,
    rowPhase1Mins,
    setRowPhase1Mins,
    rowPhase2Mins,
    setRowPhase2Mins,
    rowSprintsCount,
    setRowSprintsCount,
    rowLissMins,
    setRowLissMins,
    rowDamper,
    setRowDamper,
    rowSpm,
    setRowSpm,
    rowDistanceMeters,
    setRowDistanceMeters,
    rowSplit500m,
    setRowSplit500m,
    isDualPhase,
    setIsDualPhase,
    phaseMinutesA,
    setPhaseMinutesA,
    phaseInclineA,
    setPhaseInclineA,
    phaseSpeedA,
    setPhaseSpeedA,
    phaseMinutesB,
    setPhaseMinutesB,
    phaseInclineB,
    setPhaseInclineB,
    phaseSpeedB,
    setPhaseSpeedB,
    treadmillIncline,
    setTreadmillIncline,
    treadmillSpeed,
    setTreadmillSpeed,
    treadmillDistance,
    setTreadmillDistance,
    bikeResistance,
    setBikeResistance,
    bikeSpeed,
    setBikeSpeed,
    bikeDistance,
    setBikeDistance,
    bikeCadence,
    setBikeCadence,
    ellipticalResistance,
    setEllipticalResistance,
    ellipticalSpm,
    setEllipticalSpm,
    ellipticalDistance,
    setEllipticalDistance,
    watchHrAvg,
    setWatchHrAvg,
    watchHrMax,
    setWatchHrMax,
    watchKcal,
    setWatchKcal,
    machineKcal,
    setMachineKcal,
    calibrationMode,
    setCalibrationMode,
    machineSetup,
    setMachineSetup,
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
    const val = mins > 0 ? String(mins) : '30';
    setDuration(val);
    resetTimer();
    notifyChange({ duration: parseFloat(val) });
  };

  return (
    <div 
      className="card animate-fade" 
      style={{ 
        marginBottom: '16px', 
        borderRadius: '24px',
        background: 'var(--bg-surface)',
        border: completed ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
        boxShadow: completed 
          ? '0 8px 24px rgba(16, 185, 129, 0.18)' 
          : 'var(--shadow-ios)',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
      }}
    >
      {/* CABECERA VIBRANTE DE CARDIO */}
      <CardioHeader
        completed={completed}
        machineType={machineType}
        exercise={exercise}
        rowOption={rowOption}
        calculatedDuration={calculatedDuration}
        metrics={metrics}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        onToggleCompleted={toggleCompleted}
      />

      {/* CONTENIDO EXPANDIDO */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '14px', background: 'var(--bg-surface)', width: '100%' }}>
          
          {/* NAVEGACIÓN DE SUBPESTAÑAS */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', padding: '4px', borderRadius: '16px', marginBottom: '14px', gap: '4px', width: '100%' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('logger')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'logger' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeSubTab === 'logger' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'logger' ? '0 4px 10px rgba(2, 132, 199, 0.3)' : 'none'
              }}
            >
              📊 Registro de Máquina & Reloj
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('timer')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'timer' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'transparent',
                color: activeSubTab === 'timer' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'timer' ? '0 4px 10px rgba(5, 150, 105, 0.3)' : 'none'
              }}
            >
              ⏱️ Cronómetro ({formatTimer(timerSeconds)})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('science')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'science' ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'transparent',
                color: activeSubTab === 'science' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'science' ? '0 4px 10px rgba(124, 58, 237, 0.3)' : 'none'
              }}
            >
              💡 Fisiología & Guía
            </button>
          </div>

          {/* SUBPESTAÑA 1: REGISTRO COMPLETO DE MÁQUINA Y RELOJ */}
          {activeSubTab === 'logger' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* SELECTOR SEGMENTADO DE MÁQUINA DE CARDIO */}
              <CardioMachineSelector
                machineType={machineType}
                onSelectMachine={(type) => {
                  setMachineType(type);
                  notifyChange({ machineType: type });
                }}
              />

              {/* BLOQUE DINÁMICO: TELEMETRÍA ESPECÍFICA DE LA MÁQUINA SELECCIONADA */}
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '14px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Monitor size={16} color="var(--accent-blue)" />
                    <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-main)' }}>
                      Datos de la Máquina ({machineLabel})
                    </span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    Ecuación Oficial ACSM
                  </span>
                </div>

                {machineType === 'rower' && (
                  <RowerSection
                    rowOption={rowOption}
                    setRowOption={setRowOption}
                    rowPhase1Mins={rowPhase1Mins}
                    setRowPhase1Mins={setRowPhase1Mins}
                    rowPhase2Mins={rowPhase2Mins}
                    setRowPhase2Mins={setRowPhase2Mins}
                    rowSprintsCount={rowSprintsCount}
                    setRowSprintsCount={setRowSprintsCount}
                    rowLissMins={rowLissMins}
                    setRowLissMins={setRowLissMins}
                    rowDamper={rowDamper}
                    setRowDamper={setRowDamper}
                    rowSpm={rowSpm}
                    setRowSpm={setRowSpm}
                    rowDistanceMeters={rowDistanceMeters}
                    setRowDistanceMeters={setRowDistanceMeters}
                    rowSplit500m={rowSplit500m}
                    setRowSplit500m={setRowSplit500m}
                    metrics={metrics}
                    notifyChange={notifyChange}
                  />
                )}

                {machineType === 'treadmill' && (
                  <TreadmillSection
                    isDualPhase={isDualPhase}
                    setIsDualPhase={setIsDualPhase}
                    phaseMinutesA={phaseMinutesA}
                    setPhaseMinutesA={setPhaseMinutesA}
                    phaseInclineA={phaseInclineA}
                    setPhaseInclineA={setPhaseInclineA}
                    phaseSpeedA={phaseSpeedA}
                    setPhaseSpeedA={setPhaseSpeedA}
                    phaseMinutesB={phaseMinutesB}
                    setPhaseMinutesB={setPhaseMinutesB}
                    phaseInclineB={phaseInclineB}
                    setPhaseInclineB={setPhaseInclineB}
                    phaseSpeedB={phaseSpeedB}
                    setPhaseSpeedB={setPhaseSpeedB}
                    duration={duration}
                    setDuration={setDuration}
                    treadmillIncline={treadmillIncline}
                    setTreadmillIncline={setTreadmillIncline}
                    treadmillSpeed={treadmillSpeed}
                    setTreadmillSpeed={setTreadmillSpeed}
                    treadmillDistance={treadmillDistance}
                    setTreadmillDistance={setTreadmillDistance}
                    metrics={metrics}
                    notifyChange={notifyChange}
                  />
                )}

                {machineType === 'bike' && (
                  <BikeSection
                    duration={duration}
                    setDuration={setDuration}
                    bikeResistance={bikeResistance}
                    setBikeResistance={setBikeResistance}
                    bikeSpeed={bikeSpeed}
                    setBikeSpeed={setBikeSpeed}
                    bikeDistance={bikeDistance}
                    setBikeDistance={setBikeDistance}
                    bikeCadence={bikeCadence}
                    setBikeCadence={setBikeCadence}
                    metrics={metrics}
                    notifyChange={notifyChange}
                  />
                )}

                {machineType === 'elliptical' && (
                  <EllipticalSection
                    duration={duration}
                    setDuration={setDuration}
                    ellipticalResistance={ellipticalResistance}
                    setEllipticalResistance={setEllipticalResistance}
                    ellipticalSpm={ellipticalSpm}
                    setEllipticalSpm={setEllipticalSpm}
                    ellipticalDistance={ellipticalDistance}
                    setEllipticalDistance={setEllipticalDistance}
                    metrics={metrics}
                    notifyChange={notifyChange}
                  />
                )}
              </div>

              {/* BLOQUE SEPARADO: SESIÓN ESPECÍFICA DE CARDIO EN TU RELOJ & CONSOLA */}
              <WatchCalibrationSection
                watchHrAvg={watchHrAvg}
                setWatchHrAvg={setWatchHrAvg}
                watchHrMax={watchHrMax}
                setWatchHrMax={setWatchHrMax}
                watchKcal={watchKcal}
                setWatchKcal={setWatchKcal}
                machineKcal={machineKcal}
                setMachineKcal={setMachineKcal}
                calibrationMode={calibrationMode}
                setCalibrationMode={setCalibrationMode}
                machineSetup={machineSetup}
                setMachineSetup={setMachineSetup}
                cardioNotesInput={cardioNotesInput}
                setCardioNotesInput={setCardioNotesInput}
                metrics={metrics}
                currentCardioState={currentCardioState}
                notifyChange={notifyChange}
              />

            </div>
          )}

          {/* SUBPESTAÑA 2: CRONÓMETRO INTEGRADO EN VIVO */}
          {activeSubTab === 'timer' && (
            <CardioTimerTab
              timerRunning={timerRunning}
              timerSeconds={timerSeconds}
              onToggleTimer={toggleTimer}
              onResetTimer={resetTimer}
              onApplyTimer={handleApplyTimer}
              formatTimer={formatTimer}
            />
          )}

          {/* SUBPESTAÑA 3: FISIOLOGÍA & GUÍA */}
          {activeSubTab === 'science' && (
            <CardioScienceTab machineType={machineType} />
          )}

        </div>
      )}
    </div>
  );
}
