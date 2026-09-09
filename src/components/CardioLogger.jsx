import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, CheckCircle2, Info, Timer, Activity, 
  ChevronDown, ChevronUp, Flame, ShieldAlert, Bike, MessageSquare, 
  BookOpen, Search, Video, Watch, Monitor, Play, Pause, RotateCcw, 
  Sparkles, Check, ArrowRight, Compass, Gauge, Zap
} from 'lucide-react';
import { calculateCardioCalories } from '../utils/calorieCalculations';

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
  const [duration, setDuration] = useState(exerciseData.duration !== undefined ? String(exerciseData.duration) : '35');
  const [completed, setCompleted] = useState(!!exerciseData.completed);

  // Parámetros específicos Caminadora Inclinada
  const [treadmillIncline, setTreadmillIncline] = useState(exerciseData.inclinePct !== undefined ? String(exerciseData.inclinePct) : (exerciseData.incline || '10'));
  const [treadmillSpeed, setTreadmillSpeed] = useState(exerciseData.speedKmh !== undefined ? String(exerciseData.speedKmh) : (exerciseData.speed || '4.5'));
  const [treadmillDistance, setTreadmillDistance] = useState(exerciseData.distanceKm !== undefined ? String(exerciseData.distanceKm) : '');

  // Parámetros específicos Bicicleta Estática Ergómetro
  const [bikeResistance, setBikeResistance] = useState(exerciseData.resistanceLevel !== undefined ? String(exerciseData.resistanceLevel) : '6');
  const [bikeSpeed, setBikeSpeed] = useState(exerciseData.avgSpeedKmh !== undefined ? String(exerciseData.avgSpeedKmh) : '22');
  const [bikeDistance, setBikeDistance] = useState(exerciseData.distanceKm !== undefined ? String(exerciseData.distanceKm) : '');
  const [bikeCadence, setBikeCadence] = useState(exerciseData.cadenceRpm !== undefined ? String(exerciseData.cadenceRpm) : '75');
  const [bikeWatts, setBikeWatts] = useState(exerciseData.watts !== undefined ? String(exerciseData.watts) : '');

  // Parámetros específicos Elíptica Sólo Piernas
  const [ellipticalResistance, setEllipticalResistance] = useState(exerciseData.resistanceLevel !== undefined ? String(exerciseData.resistanceLevel) : '5');
  const [ellipticalSpm, setEllipticalSpm] = useState(exerciseData.stridesPerMin !== undefined ? String(exerciseData.stridesPerMin) : '60');
  const [ellipticalDistance, setEllipticalDistance] = useState(exerciseData.distanceKm !== undefined ? String(exerciseData.distanceKm) : '');

  // Sesión de Cardio del Smartwatch
  const [watchHrAvg, setWatchHrAvg] = useState(exerciseData.heartRate !== undefined ? String(exerciseData.heartRate) : (exerciseData.watch?.avgHeartRate || '125'));
  const [watchHrMax, setWatchHrMax] = useState(exerciseData.watch?.maxHeartRate ? String(exerciseData.watch.maxHeartRate) : '');
  const [watchKcal, setWatchKcal] = useState(exerciseData.watchCalories !== undefined ? String(exerciseData.watchCalories) : (exerciseData.watch?.watchCalories || ''));

  // Consola de la Máquina
  const [machineKcal, setMachineKcal] = useState(exerciseData.machineCalories !== undefined ? String(exerciseData.machineCalories) : '');
  const [calibrationMode, setCalibrationMode] = useState(exerciseData.calibrationMode || 'consensus');

  // Ajustes de máquina y notas
  const [machineSetup, setMachineSetup] = useState(exerciseData.machineSetup || '');
  const [cardioNotesInput, setCardioNotesInput] = useState(exerciseData.notes || '');

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
    setDuration(exerciseData.duration !== undefined ? String(exerciseData.duration) : '35');
    setCompleted(!!exerciseData.completed);
    if (exerciseData.inclinePct !== undefined) setTreadmillIncline(String(exerciseData.inclinePct));
    if (exerciseData.speedKmh !== undefined) setTreadmillSpeed(String(exerciseData.speedKmh));
    if (exerciseData.resistanceLevel !== undefined) {
      setBikeResistance(String(exerciseData.resistanceLevel));
      setEllipticalResistance(String(exerciseData.resistanceLevel));
    }
    if (exerciseData.heartRate !== undefined) setWatchHrAvg(String(exerciseData.heartRate));
    if (exerciseData.watchCalories !== undefined) setWatchKcal(String(exerciseData.watchCalories));
    if (exerciseData.machineCalories !== undefined) setMachineKcal(String(exerciseData.machineCalories));
    if (exerciseData.calibrationMode) setCalibrationMode(exerciseData.calibrationMode);
    if (exerciseData.machineSetup !== undefined) setMachineSetup(exerciseData.machineSetup);
    if (exerciseData.notes !== undefined) setCardioNotesInput(exerciseData.notes);
  }, [exerciseData]);

  // Nombre legible de la máquina
  const machineLabel = machineType === 'treadmill' 
    ? '🏃‍♀️ Caminadora Inclinada' 
    : machineType === 'bike' 
    ? '🚴‍♂️ Bicicleta Estática Ergómetro' 
    : '🚶‍♀️ Elíptica de Bajo Impacto (Solo Piernas)';

  // Empaquetar estado actual para calcular calorías reactivas
  const currentCardioState = {
    machineType,
    machine: machineLabel,
    duration: parseFloat(duration) || 0,
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
    onUpdateCardio({
      machineType: merged.machineType,
      machine: merged.machineType === 'treadmill' ? 'Caminadora Inclinada (Zona 2)' : merged.machineType === 'bike' ? 'Bicicleta Estática Ergómetro' : 'Elíptica de Bajo Impacto',
      duration: merged.duration,
      inclinePct: merged.inclinePct,
      speedKmh: merged.speedKmh,
      resistanceLevel: merged.resistanceLevel,
      avgSpeedKmh: merged.avgSpeedKmh,
      distanceKm: merged.distanceKm,
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
      calculatedKcal: metrics.cardioKcal,
      acsmKcal: metrics.acsmKcal
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                          ⏱️ Minutos:
                        </label>
                        <input
                          type="number"
                          value={duration}
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
                          value={treadmillIncline}
                          onChange={e => {
                            setTreadmillIncline(e.target.value);
                            notifyChange({ inclinePct: parseFloat(e.target.value) || 0 });
                          }}
                          placeholder="10"
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
                          value={treadmillSpeed}
                          onChange={e => {
                            setTreadmillSpeed(e.target.value);
                            notifyChange({ speedKmh: parseFloat(e.target.value) || 0 });
                          }}
                          placeholder="4.5"
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
                          value={treadmillDistance}
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
                      {[0, 5, 8, 10, 12, 15].map(inc => (
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
                          value={duration}
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
                          value={bikeResistance}
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
                          value={bikeSpeed}
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
                          value={bikeDistance}
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
                          value={bikeCadence}
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
                          value={duration}
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
                          value={ellipticalResistance}
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
                          value={ellipticalSpm}
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
                          value={ellipticalDistance}
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
                      value={watchHrAvg}
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
                      value={watchHrMax}
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
                      value={watchKcal}
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
                      value={machineKcal}
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
                  <strong style={{ color: '#0369a1', fontSize: '13px', fontWeight: '900' }}>
                    Fundamentos Fisiológicos del Cardio Zona 2:
                  </strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#0c4a6e', lineHeight: '1.4' }}>
                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                    <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px' }}>1. Zona 2 Pura (RER 0.80 - 0.85):</strong>
                    Intensidad donde la tasa de oxidación de ácidos grasos (FATmax) es máxima. Se recicla lactato sin acumularlo y sin fatigar el Sistema Nervioso Central (SNC).
                  </div>

                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                    <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px' }}>2. Bajo Impacto Articular:</strong>
                    Caminadora inclinada (cero rebote), bicicleta ergómetro o elíptica sin brazos protegen las articulaciones de rodilla y tobillo, permitiendo entrenar pierna pesada al día siguiente sin agujetas.
                  </div>

                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                    <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px' }}>3. Ecuaciones Metabólicas ACSM:</strong>
                    La app calcula el costo mecánico exacto por segundo según la física de la pendiente, potencia en Watts y peso corporal, evitando las sobreestimaciones de las pantallas de gimnasio.
                  </div>
                </div>

                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '8px 10px', borderRadius: '10px', color: '#be123c', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11px' }}>
                  <ShieldAlert size={16} color="#be123c" style={{ flexShrink: 0 }} />
                  <span>Control de Fatiga: Si notas que tu fuerza en sentadilla o prensa se estanca, mantén el cardio en un máximo de 30-35 min a pulsos estables.</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
