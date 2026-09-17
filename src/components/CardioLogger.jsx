import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, CheckCircle2, Info, Timer, Activity, 
  ChevronDown, ChevronUp, Flame, ShieldAlert, Bike, MessageSquare, 
  BookOpen, Search, Video, Watch, Monitor, Play, Pause, RotateCcw, 
  Sparkles, Check, ArrowRight, Compass, Gauge, Zap
} from 'lucide-react';
import { calculateCardioCalories } from '../utils/calorieCalculations';

const cleanInputVal = (val, fallback = '') => {
  if (val === null || val === undefined || val === 'null' || val === 'undefined') return fallback;
  return String(val);
};

export default function CardioLogger({ 
  exercise, 
  exerciseData = {}, 
  onUpdateCardio,
  initiallyExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand,
  userWeightKg = 78.55,
  onOpenStrengthWatchModal
}) {
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const [activeSubTab, setActiveSubTab] = useState('logger'); // 'logger' | 'timer' | 'science'
  
  // Tipo de máquina
  const initialMachineType = exerciseData.machineType || 
    (exerciseData.machine?.toLowerCase().includes('caminadora') ? 'treadmill' :
     exerciseData.machine?.toLowerCase().includes('elíptica') || exerciseData.machine?.toLowerCase().includes('eliptica') ? 'elliptical' : 'bike');
  
  const [machineType, setMachineType] = useState(initialMachineType);
  
  // Parámetros específicos Protocolo Bifásico Adonis (Fase A Inclinada + Fase B Plana)
  const [isDualPhase, setIsDualPhase] = useState(exerciseData.isDualPhase !== undefined ? !!exerciseData.isDualPhase : true);
  const [phaseMinutesA, setPhaseMinutesA] = useState(cleanInputVal(exerciseData.phaseMinutesA, '30'));
  const [phaseInclineA, setPhaseInclineA] = useState(cleanInputVal(exerciseData.phaseInclineA, '11.5'));
  const [phaseSpeedA, setPhaseSpeedA] = useState(cleanInputVal(exerciseData.phaseSpeedA, '4.0'));

  const [phaseMinutesB, setPhaseMinutesB] = useState(cleanInputVal(exerciseData.phaseMinutesB, '30'));
  const [phaseInclineB, setPhaseInclineB] = useState(cleanInputVal(exerciseData.phaseInclineB, '0'));
  const [phaseSpeedB, setPhaseSpeedB] = useState(cleanInputVal(exerciseData.phaseSpeedB, '4.8'));

  const initialDuration = exerciseData.duration !== undefined && exerciseData.duration !== null && exerciseData.duration !== 'null'
    ? String(exerciseData.duration) 
    : (exerciseData.isDualPhase !== false ? '60' : '35');
  const [duration, setDuration] = useState(initialDuration);
  const [completed, setCompleted] = useState(!!exerciseData.completed);

  // Parámetros específicos Caminadora Inclinada (Modo Simple)
  const [treadmillIncline, setTreadmillIncline] = useState(cleanInputVal(exerciseData.inclinePct ?? exerciseData.incline, '11.5'));
  const [treadmillSpeed, setTreadmillSpeed] = useState(cleanInputVal(exerciseData.speedKmh ?? exerciseData.speed, '4.0'));
  const [treadmillDistance, setTreadmillDistance] = useState(cleanInputVal(exerciseData.distanceKm, ''));

  // Parámetros específicos Bicicleta Estática Ergómetro
  const [bikeResistance, setBikeResistance] = useState(cleanInputVal(exerciseData.resistanceLevel, '6'));
  const [bikeSpeed, setBikeSpeed] = useState(cleanInputVal(exerciseData.avgSpeedKmh, '22'));
  const [bikeDistance, setBikeDistance] = useState(cleanInputVal(exerciseData.distanceKm, ''));
  const [bikeCadence, setBikeCadence] = useState(cleanInputVal(exerciseData.cadenceRpm, '75'));
  const [bikeWatts, setBikeWatts] = useState(cleanInputVal(exerciseData.watts, ''));

  // Parámetros específicos Elíptica Sólo Piernas
  const [ellipticalResistance, setEllipticalResistance] = useState(cleanInputVal(exerciseData.resistanceLevel, '5'));
  const [ellipticalSpm, setEllipticalSpm] = useState(cleanInputVal(exerciseData.stridesPerMin, '60'));
  const [ellipticalDistance, setEllipticalDistance] = useState(cleanInputVal(exerciseData.distanceKm, ''));

  // Sesión de Cardio del Smartwatch
  const [watchHrAvg, setWatchHrAvg] = useState(cleanInputVal(exerciseData.heartRate ?? exerciseData.watch?.avgHeartRate, '125'));
  const [watchHrMax, setWatchHrMax] = useState(cleanInputVal(exerciseData.watch?.maxHeartRate, ''));
  const [watchKcal, setWatchKcal] = useState(cleanInputVal(exerciseData.watchCalories ?? exerciseData.watch?.watchCalories, ''));

  // Consola de la Máquina
  const [machineKcal, setMachineKcal] = useState(cleanInputVal(exerciseData.machineCalories, ''));
  const [calibrationMode, setCalibrationMode] = useState(exerciseData.calibrationMode || 'consensus');

  // Ajustes de máquina y notas
  const [machineSetup, setMachineSetup] = useState(cleanInputVal(exerciseData.machineSetup, ''));
  const [cardioNotesInput, setCardioNotesInput] = useState(cleanInputVal(exerciseData.notes, ''));

  // Cronómetro Integrado
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (!timerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Sincronizar estado local cuando cambie exerciseData desde el exterior
  useEffect(() => {
    const rawMType = exerciseData.machineType || 
      (exerciseData.machine?.toLowerCase().includes('caminadora') ? 'treadmill' :
       exerciseData.machine?.toLowerCase().includes('elíptica') || exerciseData.machine?.toLowerCase().includes('eliptica') ? 'elliptical' : 'bike');
    setMachineType(rawMType);
    if (exerciseData.isDualPhase !== undefined) setIsDualPhase(!!exerciseData.isDualPhase);
    setPhaseMinutesA(cleanInputVal(exerciseData.phaseMinutesA, '30'));
    setPhaseInclineA(cleanInputVal(exerciseData.phaseInclineA, '11.5'));
    setPhaseSpeedA(cleanInputVal(exerciseData.phaseSpeedA, '4.0'));
    setPhaseMinutesB(cleanInputVal(exerciseData.phaseMinutesB, '30'));
    setPhaseInclineB(cleanInputVal(exerciseData.phaseInclineB, '0'));
    setPhaseSpeedB(cleanInputVal(exerciseData.phaseSpeedB, '4.8'));

    setDuration(cleanInputVal(exerciseData.duration, exerciseData.isDualPhase !== false ? '60' : '35'));
    setCompleted(!!exerciseData.completed);
    setTreadmillIncline(cleanInputVal(exerciseData.inclinePct ?? exerciseData.incline, '11.5'));
    setTreadmillSpeed(cleanInputVal(exerciseData.speedKmh ?? exerciseData.speed, '4.0'));
    setTreadmillDistance(cleanInputVal(exerciseData.distanceKm, ''));
    
    if (exerciseData.resistanceLevel !== undefined) {
      setBikeResistance(cleanInputVal(exerciseData.resistanceLevel, '6'));
      setEllipticalResistance(cleanInputVal(exerciseData.resistanceLevel, '5'));
    }
    if (exerciseData.avgSpeedKmh !== undefined) setBikeSpeed(cleanInputVal(exerciseData.avgSpeedKmh, '22'));
    if (exerciseData.cadenceRpm !== undefined) setBikeCadence(cleanInputVal(exerciseData.cadenceRpm, '75'));
    if (exerciseData.watts !== undefined) setBikeWatts(cleanInputVal(exerciseData.watts, ''));
    if (exerciseData.stridesPerMin !== undefined) setEllipticalSpm(cleanInputVal(exerciseData.stridesPerMin, '60'));
    if (exerciseData.distanceKm !== undefined) {
      setBikeDistance(cleanInputVal(exerciseData.distanceKm, ''));
      setEllipticalDistance(cleanInputVal(exerciseData.distanceKm, ''));
    }

    setWatchHrAvg(cleanInputVal(exerciseData.heartRate ?? exerciseData.watch?.avgHeartRate, '125'));
    setWatchHrMax(cleanInputVal(exerciseData.watch?.maxHeartRate, ''));
    setWatchKcal(cleanInputVal(exerciseData.watchCalories ?? exerciseData.watch?.watchCalories, ''));
    setMachineKcal(cleanInputVal(exerciseData.machineCalories, ''));
    if (exerciseData.calibrationMode) setCalibrationMode(exerciseData.calibrationMode);
    setMachineSetup(cleanInputVal(exerciseData.machineSetup, ''));
    setCardioNotesInput(cleanInputVal(exerciseData.notes, ''));
  }, [exerciseData]);

  // Nombre legible de la máquina
  const machineLabel = machineType === 'treadmill' 
    ? (isDualPhase ? '🏃‍♀️ Caminadora Inclinada (Bifásico 60m)' : '🏃‍♀️ Caminadora Inclinada')
    : machineType === 'bike' 
    ? '🚴‍♂️ Bicicleta Estática Ergómetro' 
    : '🚶‍♀️ Elíptica de Bajo Impacto (Solo Piernas)';

  const calculatedDuration = machineType === 'treadmill' && isDualPhase
    ? (parseFloat(phaseMinutesA) || 0) + (parseFloat(phaseMinutesB) || 0)
    : (parseFloat(duration) || 0);

  // Empaquetar estado actual para calcular calorías reactivas
  const currentCardioState = {
    machineType,
    machine: machineLabel,
    duration: calculatedDuration,
    isDualPhase: machineType === 'treadmill' ? isDualPhase : false,
    phaseMinutesA: parseFloat(phaseMinutesA) || 0,
    phaseInclineA: parseFloat(phaseInclineA) || 0,
    phaseSpeedA: parseFloat(phaseSpeedA) || 0,
    phaseMinutesB: parseFloat(phaseMinutesB) || 0,
    phaseInclineB: parseFloat(phaseInclineB) || 0,
    phaseSpeedB: parseFloat(phaseSpeedB) || 0,
    speedKmh: parseFloat(treadmillSpeed) || 0,
    inclinePct: parseFloat(treadmillIncline) || 0,
    distanceKm: parseFloat(machineType === 'treadmill' ? treadmillDistance : machineType === 'bike' ? bikeDistance : ellipticalDistance) || 0,
    resistanceLevel: parseFloat(machineType === 'bike' ? bikeResistance : ellipticalResistance) || 0,
    avgSpeedKmh: parseFloat(bikeSpeed) || 0,
    cadenceRpm: parseFloat(bikeCadence) || 0,
    watts: parseFloat(bikeWatts) || 0,
    stridesPerMin: parseFloat(ellipticalSpm) || 0,
    heartRate: parseInt(watchHrAvg, 10) || 0,
    watch: {
      avgHeartRate: parseInt(watchHrAvg, 10) || 0,
      maxHeartRate: parseInt(watchHrMax, 10) || 0,
      watchCalories: parseFloat(watchKcal) || null
    },
    watchCalories: parseFloat(watchKcal) || null,
    machineCalories: parseFloat(machineKcal) || null,
    calibrationMode,
    completed
  };

  // Cálculo en vivo
  const metrics = calculateCardioCalories(currentCardioState, userWeightKg);

  const notifyChange = (patch = {}) => {
    if (!onUpdateCardio) return;
    const merged = {
      ...currentCardioState,
      ...patch
    };
    const liveMetrics = calculateCardioCalories(merged, userWeightKg);

    onUpdateCardio({
      machineType: merged.machineType,
      machine: merged.machineType === 'treadmill' 
        ? (merged.isDualPhase ? 'Caminadora Inclinada (Bifásico 60 min)' : 'Caminadora Inclinada (Zona 2)')
        : merged.machineType === 'bike' ? 'Bicicleta Estática Ergómetro' : 'Elíptica de Bajo Impacto',
      duration: merged.duration,
      isDualPhase: merged.isDualPhase,
      phaseMinutesA: merged.phaseMinutesA,
      phaseInclineA: merged.phaseInclineA,
      phaseSpeedA: merged.phaseSpeedA,
      phaseMinutesB: merged.phaseMinutesB,
      phaseInclineB: merged.phaseInclineB,
      phaseSpeedB: merged.phaseSpeedB,
      inclinePct: merged.inclinePct,
      speedKmh: merged.speedKmh,
      resistanceLevel: merged.resistanceLevel,
      avgSpeedKmh: merged.avgSpeedKmh,
      distanceKm: merged.distanceKm || liveMetrics.distanceKm,
      cadenceRpm: merged.cadenceRpm,
      watts: merged.watts,
      stridesPerMin: merged.stridesPerMin,
      heartRate: merged.heartRate,
      watch: merged.watch,
      watchCalories: merged.watchCalories,
      machineCalories: merged.machineCalories,
      calibrationMode: merged.calibrationMode,
      machineSetup: patch.machineSetup !== undefined ? patch.machineSetup : machineSetup,
      notes: patch.notes !== undefined ? patch.notes : cardioNotesInput,
      completed: patch.completed !== undefined ? patch.completed : completed,
      calculatedKcal: liveMetrics.cardioKcal,
      acsmKcal: liveMetrics.acsmKcal,
      elevationMeters: liveMetrics.elevationMeters
    });
  };

  const toggleCompleted = (e) => {
    e.stopPropagation();
    const next = !completed;
    setCompleted(next);
    notifyChange({ completed: next });
  };

  const handleApplyTimer = () => {
    const mins = Math.round((timerSeconds / 60) * 10) / 10;
    const val = mins > 0 ? String(mins) : '30';
    setDuration(val);
    setTimerRunning(false);
    notifyChange({ duration: parseFloat(val) });
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div 
      className="card animate-fade" 
      style={{ 
        marginBottom: '16px', 
        borderRadius: '24px',
        background: completed 
          ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
          : 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
        border: completed ? '2.5px solid #10b981' : '2px solid #0284c7',
        boxShadow: completed 
          ? '0 8px 24px rgba(16, 185, 129, 0.18)' 
          : '0 8px 24px rgba(2, 132, 199, 0.15)',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
      }}
    >
      {/* CABECERA VIBRANTE DE CARDIO ZONA 2 */}
      <div 
        onClick={onToggleExpand ? onToggleExpand : () => setInternalExpanded(!internalExpanded)}
        style={{ 
          padding: '14px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          background: completed 
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
            : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <HeartPulse size={22} color="#ffffff" style={{ flexShrink: 0 }} />
            <strong style={{ fontSize: '16px', fontWeight: '900', color: '#ffffff', lineHeight: '1.3' }}>
              {exercise?.name || 'Cardio Aeróbico en Zona 2'}
            </strong>
            {completed && (
              <span style={{ fontSize: '10px', background: '#ffffff', color: '#047857', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
                ✓ Completado
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
              🫀 Zona 2 (120-135 BPM)
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '900' }}>
              🔥 {metrics.cardioKcal} kcal
            </span>
            {metrics.distanceKm > 0 && (
              <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                📍 {metrics.distanceKm} km
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button 
            type="button"
            onClick={toggleCompleted}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
            title={completed ? "Desmarcar completado" : "Marcar completado"}
          >
            <CheckCircle2 size={32} color={completed ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />
          </button>

          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '12px', 
              background: 'rgba(255, 255, 255, 0.2)', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* CONTENIDO EXPANDIDO */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '14px', background: '#ffffff', width: '100%' }}>
          
          {/* NAVEGACIÓN DE SUBPESTAÑAS */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '16px', marginBottom: '14px', gap: '4px', width: '100%' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('logger')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'logger' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeSubTab === 'logger' ? '#ffffff' : '#64748b',
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
                color: activeSubTab === 'timer' ? '#ffffff' : '#64748b',
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
                color: activeSubTab === 'science' ? '#ffffff' : '#64748b',
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
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Aparato Aeróbico Utilizado:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMachineType('treadmill');
                      notifyChange({ machineType: 'treadmill' });
                    }}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: machineType === 'treadmill' ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                      background: machineType === 'treadmill' ? '#f0f9ff' : '#ffffff',
                      color: machineType === 'treadmill' ? '#0369a1' : '#475569',
                      fontWeight: '900',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🏃‍♀️ Caminadora Inclinada
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMachineType('bike');
                      notifyChange({ machineType: 'bike' });
                    }}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: machineType === 'bike' ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                      background: machineType === 'bike' ? '#f0f9ff' : '#ffffff',
                      color: machineType === 'bike' ? '#0369a1' : '#475569',
                      fontWeight: '900',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🚴‍♂️ Bici Ergómetro
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMachineType('elliptical');
                      notifyChange({ machineType: 'elliptical' });
                    }}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: machineType === 'elliptical' ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                      background: machineType === 'elliptical' ? '#f0f9ff' : '#ffffff',
                      color: machineType === 'elliptical' ? '#0369a1' : '#475569',
                      fontWeight: '900',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🚶‍♀️ Elíptica (Sólo Piernas)
                  </button>
                </div>
              </div>

              {/* BLOQUE DINÁMICO: TELEMETRÍA ESPECÍFICA DE LA MÁQUINA SELECCIONADA */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Monitor size={16} color="#0284c7" />
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>
                      Datos de la Máquina ({machineLabel})
                    </span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>
                    Ecuación Oficial ACSM
                  </span>
                </div>

                {/* 1. CAMPOS PARA CAMINADORA INCLINADA */}
                {machineType === 'treadmill' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Selector de Modo: Bifásico (Oficial Adonis) vs Simple */}
                    <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '3px', borderRadius: '12px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDualPhase(true);
                          notifyChange({ 
                            isDualPhase: true,
                            duration: (parseFloat(phaseMinutesA) || 30) + (parseFloat(phaseMinutesB) || 30)
                          });
                        }}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: '10px',
                          border: 'none',
                          background: isDualPhase ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                          color: isDualPhase ? '#ffffff' : '#475569',
                          fontWeight: '900',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          boxShadow: isDualPhase ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
                        }}
                      >
                        ⚡ Protocolo Bifásico Oficial (60 min)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDualPhase(false);
                          notifyChange({ 
                            isDualPhase: false,
                            duration: parseFloat(duration) || 35
                          });
                        }}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: '10px',
                          border: 'none',
                          background: !isDualPhase ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                          color: !isDualPhase ? '#ffffff' : '#475569',
                          fontWeight: '900',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          boxShadow: !isDualPhase ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
                        }}
                      >
                        ⏱️ Modo Simple (1 Inclinación)
                      </button>
                    </div>

                    {/* MODO BIFÁSICO: FASE A + FASE B */}
                    {isDualPhase ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* FASE A: 30 MIN INCLINADA */}
                        <div style={{ background: '#f0f9ff', border: '1.5px solid #7dd3fc', borderRadius: '14px', padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '12px' }}>🟢</span>
                              <strong style={{ fontSize: '12px', fontWeight: '900', color: '#0369a1' }}>
                                Fase A: Rampa Inclinada ({phaseMinutesA} min)
                              </strong>
                            </div>
                            <span style={{ fontSize: '10px', background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
                              Zona 2 Lipolítica & Cero Impacto
                            </span>
                          </div>
                          <p style={{ fontSize: '10.5px', color: '#0369a1', margin: '0 0 8px 0', lineHeight: '1.3' }}>
                            A 120-135 BPM, las mitocondrias oxidan ácidos grasos libres sin vaciar reservas glucolíticas requeridas para el estudio. La pendiente reduce drásticamente el impacto articular.
                          </p>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '2px' }}>
                                ⏱️ Minutos:
                              </label>
                              <input
                                type="number"
                                value={cleanInputVal(phaseMinutesA, '30')}
                                onChange={e => {
                                  setPhaseMinutesA(e.target.value);
                                  const totalM = (parseFloat(e.target.value) || 0) + (parseFloat(phaseMinutesB) || 0);
                                  notifyChange({ 
                                    phaseMinutesA: parseFloat(e.target.value) || 0,
                                    duration: totalM
                                  });
                                }}
                                style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1.5px solid #0284c7', fontWeight: '900', fontSize: '12px', background: '#ffffff' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '2px' }}>
                                📐 Inclinación %:
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                value={cleanInputVal(phaseInclineA, '11.5')}
                                onChange={e => {
                                  setPhaseInclineA(e.target.value);
                                  notifyChange({ phaseInclineA: parseFloat(e.target.value) || 0 });
                                }}
                                style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1.5px solid #0284c7', fontWeight: '900', fontSize: '12px', background: '#ffffff' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '2px' }}>
                                ⚡ Vel km/h:
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={cleanInputVal(phaseSpeedA, '4.0')}
                                onChange={e => {
                                  setPhaseSpeedA(e.target.value);
                                  notifyChange({ phaseSpeedA: parseFloat(e.target.value) || 0 });
                                }}
                                style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1.5px solid #0284c7', fontWeight: '900', fontSize: '12px', background: '#ffffff' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800' }}>Inclinación Rápida:</span>
                            {['10', '11', '11.5', '12'].map(inc => (
                              <button
                                key={inc}
                                type="button"
                                onClick={() => {
                                  setPhaseInclineA(inc);
                                  notifyChange({ phaseInclineA: parseFloat(inc) });
                                }}
                                style={{
                                  padding: '2px 7px',
                                  borderRadius: '6px',
                                  border: phaseInclineA === inc ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                                  background: phaseInclineA === inc ? '#e0f2fe' : '#ffffff',
                                  color: phaseInclineA === inc ? '#0284c7' : '#475569',
                                  fontSize: '10px',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                {inc}%
                              </button>
                            ))}
                            <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800', marginLeft: '6px' }}>Vel:</span>
                            {['3.8', '4.0', '4.2'].map(spd => (
                              <button
                                key={spd}
                                type="button"
                                onClick={() => {
                                  setPhaseSpeedA(spd);
                                  notifyChange({ phaseSpeedA: parseFloat(spd) });
                                }}
                                style={{
                                  padding: '2px 7px',
                                  borderRadius: '6px',
                                  border: phaseSpeedA === spd ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                                  background: phaseSpeedA === spd ? '#e0f2fe' : '#ffffff',
                                  color: phaseSpeedA === spd ? '#0284c7' : '#475569',
                                  fontSize: '10px',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                {spd}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* FASE B: 30 MIN PLANOS */}
                        <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderRadius: '14px', padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '12px' }}>🔵</span>
                              <strong style={{ fontSize: '12px', fontWeight: '900', color: '#047857' }}>
                                Fase B: Terreno Plano ({phaseMinutesB} min)
                              </strong>
                            </div>
                            <span style={{ fontSize: '10px', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
                              Descarga Aquiles & Sóleo
                            </span>
                          </div>
                          <p style={{ fontSize: '10.5px', color: '#047857', margin: '0 0 8px 0', lineHeight: '1.3' }}>
                            Evita sobrecarga excéntrica en tendón de Aquiles tras 30 min continuos en pendiente, normaliza el ángulo tibio-tarsiano y promueve el retorno venoso y aclaramiento de lactato.
                          </p>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '2px' }}>
                                ⏱️ Minutos:
                              </label>
                              <input
                                type="number"
                                value={cleanInputVal(phaseMinutesB, '30')}
                                onChange={e => {
                                  setPhaseMinutesB(e.target.value);
                                  const totalM = (parseFloat(phaseMinutesA) || 0) + (parseFloat(e.target.value) || 0);
                                  notifyChange({ 
                                    phaseMinutesB: parseFloat(e.target.value) || 0,
                                    duration: totalM
                                  });
                                }}
                                style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1.5px solid #059669', fontWeight: '900', fontSize: '12px', background: '#ffffff' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '2px' }}>
                                📐 Inclinación %:
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                value={cleanInputVal(phaseInclineB, '0')}
                                onChange={e => {
                                  setPhaseInclineB(e.target.value);
                                  notifyChange({ phaseInclineB: parseFloat(e.target.value) || 0 });
                                }}
                                style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1.5px solid #059669', fontWeight: '900', fontSize: '12px', background: '#ffffff' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '2px' }}>
                                ⚡ Vel km/h:
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={cleanInputVal(phaseSpeedB, '4.8')}
                                onChange={e => {
                                  setPhaseSpeedB(e.target.value);
                                  notifyChange({ phaseSpeedB: parseFloat(e.target.value) || 0 });
                                }}
                                style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1.5px solid #059669', fontWeight: '900', fontSize: '12px', background: '#ffffff' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800' }}>Inclinación:</span>
                            <button
                              type="button"
                              onClick={() => {
                                setPhaseInclineB('0');
                                notifyChange({ phaseInclineB: 0 });
                              }}
                              style={{
                                padding: '2px 7px',
                                borderRadius: '6px',
                                border: phaseInclineB === '0' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                                background: phaseInclineB === '0' ? '#d1fae5' : '#ffffff',
                                color: phaseInclineB === '0' ? '#047857' : '#475569',
                                fontSize: '10px',
                                fontWeight: '800',
                                cursor: 'pointer'
                              }}
                            >
                              0% Plano (Oficial)
                            </button>
                            <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800', marginLeft: '6px' }}>Vel:</span>
                            {['4.5', '4.8', '5.0', '5.2'].map(spd => (
                              <button
                                key={spd}
                                type="button"
                                onClick={() => {
                                  setPhaseSpeedB(spd);
                                  notifyChange({ phaseSpeedB: parseFloat(spd) });
                                }}
                                style={{
                                  padding: '2px 7px',
                                  borderRadius: '6px',
                                  border: phaseSpeedB === spd ? '1.5px solid #059669' : '1px solid #cbd5e1',
                                  background: phaseSpeedB === spd ? '#d1fae5' : '#ffffff',
                                  color: phaseSpeedB === spd ? '#047857' : '#475569',
                                  fontSize: '10px',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                {spd}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* RESUMEN CONSOLIDADO BIFÁSICO */}
                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '11px', fontWeight: '900', color: '#0f172a' }}>
                                ⏱️ Total: {(parseFloat(phaseMinutesA) || 0) + (parseFloat(phaseMinutesB) || 0)} min
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#0369a1' }}>
                                📍 ~{metrics.distanceKm} km
                              </span>
                              {metrics.elevationMeters > 0 && (
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669' }}>
                                  ⛰️ +{metrics.elevationMeters}m desnivel
                                </span>
                              )}
                              <span style={{ fontSize: '11px', fontWeight: '900', color: '#b45309' }}>
                                🔥 {metrics.acsmKcal} kcal ACSM
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label style={{ fontSize: '10.5px', color: '#475569', fontWeight: '800', whiteSpace: 'nowrap' }}>
                              📍 Distancia Pantalla Gym:
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder={metrics.distanceKm ? String(metrics.distanceKm) : '3.8'}
                              value={cleanInputVal(treadmillDistance, '')}
                              onChange={e => {
                                setTreadmillDistance(e.target.value);
                                notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
                              }}
                              style={{ width: '100px', padding: '5px 8px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '11px', fontWeight: '800', textAlign: 'center' }}
                            />
                            <span style={{ fontSize: '10px', color: '#64748b' }}>(Opcional, si difiere de la estimación)</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* MODO SIMPLE: 1 INCLINACIÓN CONTINUA */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                              ⏱️ Minutos:
                            </label>
                            <input
                              type="number"
                              value={cleanInputVal(duration, '35')}
                              onChange={e => {
                                setDuration(e.target.value);
                                notifyChange({ duration: parseFloat(e.target.value) || 0 });
                              }}
                              style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #0284c7', fontWeight: '900', fontSize: '13px' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                              📐 Inclinación %:
                            </label>
                            <input
                              type="number"
                              value={cleanInputVal(treadmillIncline, '11.5')}
                              onChange={e => {
                                setTreadmillIncline(e.target.value);
                                notifyChange({ inclinePct: parseFloat(e.target.value) || 0 });
                              }}
                              placeholder="11.5"
                              style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '13px' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                              ⚡ Velocidad km/h:
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={cleanInputVal(treadmillSpeed, '4.0')}
                              onChange={e => {
                                setTreadmillSpeed(e.target.value);
                                notifyChange({ speedKmh: parseFloat(e.target.value) || 0 });
                              }}
                              placeholder="4.0"
                              style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '13px' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                              📍 Distancia (km):
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={cleanInputVal(treadmillDistance, '')}
                              placeholder={metrics.distanceKm ? String(metrics.distanceKm) : '2.25'}
                              onChange={e => {
                                setTreadmillDistance(e.target.value);
                                notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
                              }}
                              style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '13px' }}
                            />
                          </div>
                        </div>

                        {/* Accesos rápidos de inclinación */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>Inclinación:</span>
                          {[0, 5, 8, 10, 11.5, 12, 15].map(inc => (
                            <button
                              key={inc}
                              type="button"
                              onClick={() => {
                                setTreadmillIncline(String(inc));
                                notifyChange({ inclinePct: inc });
                              }}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '8px',
                                border: treadmillIncline === String(inc) ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                                background: treadmillIncline === String(inc) ? '#e0f2fe' : '#ffffff',
                                color: treadmillIncline === String(inc) ? '#0284c7' : '#475569',
                                fontSize: '10.5px',
                                fontWeight: '800',
                                cursor: 'pointer'
                              }}
                            >
                              {inc}%
                            </button>
                          ))}
                          {metrics.elevationMeters > 0 && (
                            <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: '800', marginLeft: 'auto' }}>
                              ⛰️ +{metrics.elevationMeters}m elevación ganada
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. CAMPOS PARA BICICLETA ESTÁTICA ERGÓMETRO */}
                {machineType === 'bike' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '6px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          ⏱️ Minutos:
                        </label>
                        <input
                          type="number"
                          value={cleanInputVal(duration, '35')}
                          onChange={e => {
                            setDuration(e.target.value);
                            notifyChange({ duration: parseFloat(e.target.value) || 0 });
                          }}
                          style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #0284c7', fontWeight: '900', fontSize: '12.5px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          ⚙️ Nivel Res.:
                        </label>
                        <input
                          type="number"
                          value={cleanInputVal(bikeResistance, '6')}
                          onChange={e => {
                            setBikeResistance(e.target.value);
                            notifyChange({ resistanceLevel: parseFloat(e.target.value) || 0 });
                          }}
                          placeholder="6"
                          style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '12.5px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          ⚡ Vel km/h:
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={cleanInputVal(bikeSpeed, '22')}
                          onChange={e => {
                            setBikeSpeed(e.target.value);
                            notifyChange({ avgSpeedKmh: parseFloat(e.target.value) || 0 });
                          }}
                          placeholder="22"
                          style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '12.5px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          📍 Dist (km):
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={cleanInputVal(bikeDistance, '')}
                          placeholder={metrics.distanceKm ? String(metrics.distanceKm) : '12.5'}
                          onChange={e => {
                            setBikeDistance(e.target.value);
                            notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
                          }}
                          style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '12.5px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          🔄 RPM:
                        </label>
                        <input
                          type="number"
                          value={cleanInputVal(bikeCadence, '75')}
                          onChange={e => {
                            setBikeCadence(e.target.value);
                            notifyChange({ cadenceRpm: parseFloat(e.target.value) || 0 });
                          }}
                          placeholder="75"
                          style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '12.5px' }}
                        />
                      </div>
                    </div>

                    {/* Presets de resistencia */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>Resistencia:</span>
                      {[3, 4, 5, 6, 7, 8, 10].map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => {
                            setBikeResistance(String(lvl));
                            notifyChange({ resistanceLevel: lvl });
                          }}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '8px',
                            border: bikeResistance === String(lvl) ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                            background: bikeResistance === String(lvl) ? '#e0f2fe' : '#ffffff',
                            color: bikeResistance === String(lvl) ? '#0284c7' : '#475569',
                            fontSize: '10.5px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          Niv {lvl}
                        </button>
                      ))}
                      <span style={{ fontSize: '10.5px', color: '#d97706', fontWeight: '800', marginLeft: 'auto' }}>
                        ⚡ ~{Math.round((parseFloat(bikeResistance || 6) * 14) + ((parseFloat(bikeCadence || 75) - 50) * 1.5))} Watts estimados
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. CAMPOS PARA ELÍPTICA SÓLO PIERNAS */}
                {machineType === 'elliptical' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: '#1e40af',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Info size={14} color="#1d4ed8" />
                      Modalidad Sólo Piernas: Brazos fijos en manillar. Aislamiento articular inferior puro (sin impulso de tren superior).
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          ⏱️ Minutos:
                        </label>
                        <input
                          type="number"
                          value={cleanInputVal(duration, '35')}
                          onChange={e => {
                            setDuration(e.target.value);
                            notifyChange({ duration: parseFloat(e.target.value) || 0 });
                          }}
                          style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #0284c7', fontWeight: '900', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          ⚙️ Nivel Res.:
                        </label>
                        <input
                          type="number"
                          value={cleanInputVal(ellipticalResistance, '5')}
                          onChange={e => {
                            setEllipticalResistance(e.target.value);
                            notifyChange({ resistanceLevel: parseFloat(e.target.value) || 0 });
                          }}
                          placeholder="5"
                          style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          🚶 Zancadas (SPM):
                        </label>
                        <input
                          type="number"
                          value={cleanInputVal(ellipticalSpm, '60')}
                          onChange={e => {
                            setEllipticalSpm(e.target.value);
                            notifyChange({ stridesPerMin: parseFloat(e.target.value) || 0 });
                          }}
                          placeholder="60"
                          style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          📍 Distancia (km):
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={cleanInputVal(ellipticalDistance, '')}
                          placeholder={metrics.distanceKm ? String(metrics.distanceKm) : '2.0'}
                          onChange={e => {
                            setEllipticalDistance(e.target.value);
                            notifyChange({ distanceKm: parseFloat(e.target.value) || 0 });
                          }}
                          style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BLOQUE SEPARADO: SESIÓN ESPECÍFICA DE CARDIO EN TU RELOJ & CONSOLA */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '16px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Watch size={18} color="#7c3aed" />
                    <span style={{ fontSize: '12.5px', fontWeight: '900', color: '#1e1b4b' }}>
                      Sesión Independiente de Cardio en tu Reloj & Máquina
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', background: '#f5f3ff', color: '#6d28d9', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
                    Actividad separada de pesas
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#ef4444', marginBottom: '4px' }}>
                      ❤️ FC Promedio (BPM):
                    </label>
                    <input
                      type="number"
                      placeholder="125"
                      value={cleanInputVal(watchHrAvg, '125')}
                      onChange={e => {
                        setWatchHrAvg(e.target.value);
                        notifyChange({ heartRate: parseInt(e.target.value, 10) || 0 });
                      }}
                      style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #fca5a5', fontWeight: '900', fontSize: '14px', color: '#dc2626' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#b91c1c', marginBottom: '4px' }}>
                      ⚡ FC Máxima (BPM):
                    </label>
                    <input
                      type="number"
                      placeholder="138"
                      value={cleanInputVal(watchHrMax, '')}
                      onChange={e => {
                        setWatchHrMax(e.target.value);
                        notifyChange({ watch: { ...currentCardioState.watch, maxHeartRate: parseInt(e.target.value, 10) || 0 } });
                      }}
                      style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#7c3aed', marginBottom: '4px' }}>
                      ⌚ Kcal Reloj (Cardio):
                    </label>
                    <input
                      type="number"
                      placeholder="Ej. 240"
                      value={cleanInputVal(watchKcal, '')}
                      onChange={e => {
                        setWatchKcal(e.target.value);
                        notifyChange({ watchCalories: parseFloat(e.target.value) || null });
                      }}
                      style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #ddd6fe', fontWeight: '900', fontSize: '14px', color: '#6d28d9' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>
                      🖥️ Kcal Máquina:
                    </label>
                    <input
                      type="number"
                      placeholder="Ej. 260"
                      value={cleanInputVal(machineKcal, '')}
                      onChange={e => {
                        setMachineKcal(e.target.value);
                        notifyChange({ machineCalories: parseFloat(e.target.value) || null });
                      }}
                      style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: '900', fontSize: '14px' }}
                    />
                  </div>
                </div>

                {/* DIAGNÓSTICO DE ZONA 2 (FATmax) */}
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: metrics.zone2Status === 'optimal' ? '#ecfdf5' : metrics.zone2Status === 'high' ? '#fffbeb' : '#f8fafc',
                  border: metrics.zone2Status === 'optimal' ? '1px solid #a7f3d0' : metrics.zone2Status === 'high' ? '1px solid #fde68a' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Flame size={15} color={metrics.zone2Status === 'optimal' ? '#059669' : '#d97706'} />
                    <span style={{ fontSize: '11.5px', fontWeight: '800', color: metrics.zone2Status === 'optimal' ? '#047857' : '#92400e' }}>
                      {metrics.zone2Status === 'optimal' && '🟢 Zona 2 Óptima (118-138 BPM): Máxima oxidación de ácidos grasos (FATmax) sin fatiga muscular.'}
                      {metrics.zone2Status === 'high' && '🟡 Alerta Zona 3 (>138 BPM): Intensidad elevada. Podría restar recuperación a las piernas para las pesas.'}
                      {metrics.zone2Status === 'low' && '🔵 Zona 1 (<118 BPM): Recuperación activa, desinflamación y retorno venoso.'}
                      {metrics.zone2Status === 'unknown' && 'Introduce tus pulsaciones para auditar si estuviste en Zona 2.'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: '#475569' }}>
                    {metrics.met} METs
                  </span>
                </div>
              </div>

              {/* BLOQUE DE CALIBRACIÓN Y CONSENSO TRIPARTITO */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '16px',
                padding: '14px',
                color: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>
                      Calibración Científica del Cardio
                    </span>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#ffffff' }}>
                      Gasto Seleccionado: <span style={{ color: '#38bdf8' }}>{metrics.cardioKcal} kcal</span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '900',
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '3px 9px',
                    borderRadius: '8px'
                  }}>
                    Modo: {calibrationMode === 'consensus' ? 'Consenso Científico' : calibrationMode === 'watch' ? 'Reloj Cardio' : calibrationMode === 'acsm' ? 'Física ACSM' : 'Consola'}
                  </span>
                </div>

                {/* Grid comparativo tripartito */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>🔬 FÍSICA ACSM</div>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#38bdf8' }}>{metrics.acsmKcal} kcal</div>
                    <div style={{ fontSize: '9.5px', color: '#cbd5e1' }}>78.55 kg + pendiente</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>⌚ RELOJ CARDIO</div>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#c084fc' }}>
                      {metrics.watchKcal ? `${metrics.watchKcal} kcal` : '--'}
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#cbd5e1' }}>
                      {watchHrAvg ? `${watchHrAvg} BPM` : 'Sin pulso'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>🖥️ MÁQUINA</div>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#fde047' }}>
                      {metrics.machineKcal ? `${metrics.machineKcal} kcal` : '--'}
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#cbd5e1' }}>Consola gym</div>
                  </div>
                </div>

                {/* Pastillas selectoras de modo de calibración */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCalibrationMode('consensus');
                      notifyChange({ calibrationMode: 'consensus' });
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: calibrationMode === 'consensus' ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
                      background: calibrationMode === 'consensus' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.05)',
                      color: calibrationMode === 'consensus' ? '#38bdf8' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Consenso ({metrics.consensusKcal} kcal)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCalibrationMode('acsm');
                      notifyChange({ calibrationMode: 'acsm' });
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: calibrationMode === 'acsm' ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
                      background: calibrationMode === 'acsm' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.05)',
                      color: calibrationMode === 'acsm' ? '#38bdf8' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Física ACSM ({metrics.acsmKcal} kcal)
                  </button>

                  {metrics.watchKcal && (
                    <button
                      type="button"
                      onClick={() => {
                        setCalibrationMode('watch');
                        notifyChange({ calibrationMode: 'watch' });
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: calibrationMode === 'watch' ? '1.5px solid #c084fc' : '1px solid rgba(255,255,255,0.2)',
                        background: calibrationMode === 'watch' ? 'rgba(192, 132, 252, 0.25)' : 'rgba(255,255,255,0.05)',
                        color: calibrationMode === 'watch' ? '#c084fc' : '#ffffff',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      Reloj ({metrics.watchKcal} kcal)
                    </button>
                  )}

                  {metrics.machineKcal && (
                    <button
                      type="button"
                      onClick={() => {
                        setCalibrationMode('machine');
                        notifyChange({ calibrationMode: 'machine' });
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: calibrationMode === 'machine' ? '1.5px solid #fde047' : '1px solid rgba(255,255,255,0.2)',
                        background: calibrationMode === 'machine' ? 'rgba(253, 224, 71, 0.25)' : 'rgba(255,255,255,0.05)',
                        color: calibrationMode === 'machine' ? '#fde047' : '#ffffff',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      Máquina ({metrics.machineKcal} kcal)
                    </button>
                  )}
                </div>
              </div>

              {/* CALIBRACIÓN DEL ASIENTO/MÁQUINA Y NOTAS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '14px', border: '1.5px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#334155', fontWeight: '900', marginBottom: '4px' }}>
                    ⚙️ Ajuste de Máquina / Asiento:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Asiento altura #6, pedal medio..."
                    value={machineSetup}
                    onChange={e => {
                      setMachineSetup(e.target.value);
                      notifyChange({ machineSetup: e.target.value });
                    }}
                    style={{ width: '100%', fontSize: '12px', padding: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff', borderRadius: '10px', fontWeight: '600' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '14px', border: '1.5px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#334155', fontWeight: '900', marginBottom: '4px' }}>
                    📝 Sensaciones de Cardio:
                  </label>
                  <input
                    type="text"
                    placeholder="Pulsos controlados, buena sudoración..."
                    value={cardioNotesInput}
                    onChange={e => {
                      setCardioNotesInput(e.target.value);
                      notifyChange({ notes: e.target.value });
                    }}
                    style={{ width: '100%', fontSize: '12px', padding: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff', borderRadius: '10px', fontWeight: '600' }}
                  />
                </div>
              </div>

            </div>
          )}

          {/* SUBPESTAÑA 2: CRONÓMETRO INTEGRADO EN VIVO */}
          {activeSubTab === 'timer' && (
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1.5px solid #cbd5e1', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Cronómetro de Sesión de Cardio
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', fontFamily: 'monospace', marginBottom: '16px' }}>
                {formatTimer(timerSeconds)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '14px',
                    background: timerRunning ? '#dc2626' : '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {timerRunning ? <Pause size={18} /> : <Play size={18} />}
                  {timerRunning ? 'Pausar Cardio' : 'Iniciar Cardio'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '14px',
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1.5px solid #cbd5e1',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={16} /> Reiniciar
                </button>
              </div>

              {timerSeconds > 0 && (
                <button
                  type="button"
                  onClick={handleApplyTimer}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                  }}
                >
                  ✓ Aplicar {Math.round((timerSeconds / 60) * 10) / 10} min al Registro Oficial
                </button>
              )}
            </div>
          )}

          {/* SUBPESTAÑA 3: FISIOLOGÍA & GUÍA */}
          {activeSubTab === 'science' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Flame size={18} color="#0284c7" />
                  <strong style={{ color: '#0369a1', fontSize: '13.5px', fontWeight: '900' }}>
                    Prescripción Médica de Cardio Diario Adonis (Protocolo Bifásico de 60 Minutos):
                  </strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#0c4a6e', lineHeight: '1.4' }}>
                  {/* FASE A */}
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #7dd3fc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px' }}>🟢</span>
                      <strong style={{ color: '#0369a1', fontSize: '12.5px', fontWeight: '900' }}>
                        1. Fase A (30 min al 11-12% de Inclinación):
                      </strong>
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>
                        <strong style={{ color: '#0284c7' }}>Zona 2 Lipolítica Pura:</strong> A 120-135 BPM, las mitocondrias oxidan ácidos grasos libres sin agotar las reservas glucolíticas requeridas para el estudio.
                      </li>
                      <li>
                        <strong style={{ color: '#0284c7' }}>Cero Impacto Articular:</strong> La pendiente reduce drásticamente las fuerzas de impacto sobre los meniscos y cartílago rotuliano en comparación con correr o trotar.
                      </li>
                    </ul>
                  </div>

                  {/* FASE B */}
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #6ee7b7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px' }}>🔵</span>
                      <strong style={{ color: '#047857', fontSize: '12.5px', fontWeight: '900' }}>
                        2. Fase B (30 min Planos a 0% de Inclinación):
                      </strong>
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>
                        <strong style={{ color: '#059669' }}>Descarga del Tendón de Aquiles & Sóleo:</strong> Caminar inclinado más de 30-40 min continuos produce sobrecarga excéntrica en el tendón de Aquiles y la fascia plantar.
                      </li>
                      <li>
                        <strong style={{ color: '#059669' }}>Retorno Venoso & Aclaramiento:</strong> Pasar a plano descarga la musculatura de la pantorrilla, normaliza el ángulo tibio-tarsiano y promueve el retorno venoso y aclaramiento de lactato.
                      </li>
                    </ul>
                  </div>

                  {/* ECUACIONES ACSM */}
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                    <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px', fontWeight: '900' }}>
                      3. Ecuaciones Metabólicas ACSM Bi-Fásicas:
                    </strong>
                    El costo energético se computa independientemente para cada fase: VO₂ con pendiente fraccional en Fase A + VO₂ plano a mayor velocidad en Fase B, sumando kcal mecánicas reales y elevación ganada exacta.
                  </div>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '8px 10px', borderRadius: '10px', color: '#166534', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11.5px' }}>
                  <Check size={16} color="#166534" style={{ flexShrink: 0 }} />
                  <span>Sin interferencia hipertrófica: Este formato bifásico de 60 minutos maximiza el déficit calórico diario protegiendo tus piernas pesadas y la energía cerebral de estudio.</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
