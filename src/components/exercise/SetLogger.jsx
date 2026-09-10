import React, { useState, useEffect } from 'react';
import { Flame, Check, Plus, Minus, Trophy, Sparkles, Settings2 } from 'lucide-react';
import PlateCalculatorModal from './PlateCalculatorModal';
import OverloadScienceModal from './OverloadScienceModal';
import ExerciseFeedbackModal from './ExerciseFeedbackModal';
import MachineConfigModal from './MachineConfigModal';
import { calculate1RM, getOverloadTarget, analyzeExercisePerformance, getMachineStorageKey, getUnifiedExerciseTarget } from '../../hooks/useWorkoutCalculations';

// Analizador fisiológico de calentamiento según prescripción oficial
function getWarmupPlan(exercise, previousData, exerciseData, machineConfig, coachAnalysis) {
  const warmupStr = (exercise?.warmup || '').toLowerCase();

  // 1. Determinar la carga de trabajo real (priorizando peso ingresado hoy, carga ancla o carga ajustada del coach)
  let workingWeight = parseFloat(exerciseData?.[1]?.weight || 0);

  if (!workingWeight || workingWeight <= 0) {
    if (coachAnalysis) {
      if (coachAnalysis.isExcessiveLoad && coachAnalysis.adjustedLoad > 0) {
        workingWeight = coachAnalysis.adjustedLoad;
      } else if (coachAnalysis.isS1RampUp && coachAnalysis.anchorWeight > 0) {
        workingWeight = coachAnalysis.anchorWeight;
      } else if (coachAnalysis.anchorWeight > 0) {
        workingWeight = coachAnalysis.anchorWeight;
      } else if (coachAnalysis.maxWeight > 0) {
        workingWeight = coachAnalysis.maxWeight;
      }
    }
  }

  // Si aún no se determina, extraer el máximo peso real de las series previas
  if (!workingWeight || workingWeight <= 0) {
    const prevValidWeights = Object.keys(previousData || {})
      .filter(k => !isNaN(parseInt(k, 10)) && parseInt(k, 10) > 0)
      .map(k => parseFloat(previousData[k]?.weight))
      .filter(w => !isNaN(w) && w > 0);
    if (prevValidWeights.length > 0) {
      workingWeight = Math.max(...prevValidWeights);
    }
  }

  if (warmupStr.includes('no ocupa')) {
    return { requiresWarmup: false, series: [] };
  }

  // Base de incremento y peso mínimo de máquina (ej. trineo de prensa 100 lbs o barra 45 lbs)
  const roundBase = machineConfig?.plateStep 
    ? parseFloat(machineConfig.plateStep) 
    : (machineConfig?.smallestPlate ? machineConfig.smallestPlate * 2 : 5);
  const minMachineWeight = machineConfig?.sledWeight ? parseFloat(machineConfig.sledWeight) : 0;

  const hasSerie2 = warmupStr.includes('serie 2');
  if (hasSerie2) {
    const p1 = warmupStr.includes('40%') ? 0.40 : 0.50;
    const p2 = warmupStr.includes('70%') ? 0.70 : 0.75;
    const r1 = 10;
    const r2 = warmupStr.includes('3 reps') ? 3 : 4;

    let w1 = workingWeight > 0 ? Math.round((workingWeight * p1) / roundBase) * roundBase : 0;
    let w2 = workingWeight > 0 ? Math.round((workingWeight * p2) / roundBase) * roundBase : 0;

    if (minMachineWeight > 0) {
      w1 = Math.max(minMachineWeight, w1);
      w2 = Math.max(minMachineWeight + roundBase, w2);
    } else {
      w1 = Math.max(roundBase, w1);
      w2 = Math.max(roundBase * 2, w2);
    }

    return {
      requiresWarmup: true,
      workingWeightUsed: workingWeight,
      series: [
        { id: 0, label: 'C1', pct: `${Math.round(p1 * 100)}%`, defaultWeight: w1, defaultReps: r1, desc: 'Control articular y calibración' },
        { id: -1, label: 'C2', pct: `${Math.round(p2 * 100)}%`, defaultWeight: w2, defaultReps: r2, desc: 'Activación neural' }
      ]
    };
  }

  const p = warmupStr.includes('60%') ? 0.60 : 0.70;
  const r = warmupStr.includes('5 reps') ? 5 : (warmupStr.includes('6 reps') ? 6 : 4);
  let w = workingWeight > 0 ? Math.round((workingWeight * p) / roundBase) * roundBase : 0;

  if (minMachineWeight > 0) {
    w = Math.max(minMachineWeight, w);
  } else {
    w = Math.max(roundBase, w);
  }

  return {
    requiresWarmup: true,
    workingWeightUsed: workingWeight,
    series: [
      { id: 0, label: 'C1', pct: `${Math.round(p * 100)}%`, defaultWeight: w, defaultReps: r, desc: 'Aproximación' }
    ]
  };
}

export default function SetLogger({
  exercise,
  exerciseData = {},
  previousData = {},
  totalSets,
  suggestedWarmupWeight,
  isWarmupSetDone,
  loadRecommendation,
  handleSetChange,
  toggleSetComplete,
  handleAddSet,
  handleRemoveSet,
  onUpdateExerciseMeta
}) {
  // Biomecánicamente bilateral rígido (barra recta, barra Z, smith, prensa, etc.)
  const isStrictlyBilateral = useMemo(() => {
    const name = (exercise?.name || '').toLowerCase();
    return /barra|smith|prensa|leg press|squat con barra|bench press con barra|press militar con barra/i.test(name);
  }, [exercise?.name]);

  const isUnilateral = !isStrictlyBilateral && (exerciseData.isUnilateral !== undefined ? !!exerciseData.isUnilateral : !!exercise.isUnilateral);
  
  // Machine Config: Prioridad a exerciseData, con persistencia normalizada en localStorage
  const [machineConfig, setMachineConfig] = useState(() => {
    if (exerciseData.machineConfig) return exerciseData.machineConfig;
    try {
      const slugKey = getMachineStorageKey(exercise);
      const saved = localStorage.getItem(slugKey) || localStorage.getItem(`adonis_machine_${exercise.id}`);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (exerciseData.machineConfig) {
      setMachineConfig(exerciseData.machineConfig);
    }
  }, [exerciseData.machineConfig]);

  const [plateModal, setPlateModal] = useState({ isOpen: false, setNum: null, currentWeight: 0 });
  const [isScienceModalOpen, setIsScienceModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMachineConfigOpen, setIsMachineConfigOpen] = useState(false);
  const [manualWarmupOpen, setManualWarmupOpen] = useState(false);

  const coachAnalysis = analyzeExercisePerformance(previousData, exercise.targetReps || '10-12', machineConfig);

  const warmupPlan = getWarmupPlan(exercise, previousData, exerciseData, machineConfig, coachAnalysis);

  const shouldRenderWarmup = warmupPlan.requiresWarmup || manualWarmupOpen;

  const currentFeedback = exerciseData.feedback || null;
  const hasFeedback = !!currentFeedback && Object.keys(currentFeedback).length > 0;

  
  const prevLocation = previousData.machineConfig?.floor || previousData.machineConfig?.station || previousData.machineLocation || '';
  const currentLocation = machineConfig?.floor || machineConfig?.station || '';
  const isFloorMismatch = prevLocation && currentLocation && prevLocation.toLowerCase() !== currentLocation.toLowerCase();

  const getApparatusType = (name = '') => {
    if (machineConfig?.type) {
      if (machineConfig.type === 'plates') return 'prensa';
      if (machineConfig.type === 'stack') return 'polea';
      if (machineConfig.type === 'dumbbells') return 'mancuerna';
    }
    const n = name.toLowerCase();
    if (n.includes('prensa') || n.includes('leg press')) return 'prensa';
    if (n.includes('hack')) return 'hack';
    if (n.includes('smith')) return 'smith';
    if (n.includes('mancuerna') || n.includes('dumbbell')) return 'mancuerna';
    if (n.includes('polea') || n.includes('cable') || n.includes('jalon') || n.includes('jalón') || n.includes('extension') || n.includes('curl')) return 'polea';
    return 'barra';
  };

  const handleSanitizedChange = (setIndex, fieldOrObj, value) => {
    if (typeof fieldOrObj === 'object') {
      handleSetChange(setIndex, fieldOrObj);
      return;
    }
    handleSetChange(setIndex, fieldOrObj, value);
  };

  const handleSaveFeedback = (feedbackData) => {
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ feedback: feedbackData });
    }
  };

  const handleSaveMachineConfig = (configData) => {
    setMachineConfig(configData);
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ machineConfig: configData });
    }
    try {
      const slugKey = getMachineStorageKey(exercise);
      if (configData) {
        const serialized = JSON.stringify(configData);
        localStorage.setItem(slugKey, serialized);
        localStorage.setItem(`adonis_machine_${exercise.id}`, serialized);
      } else {
        localStorage.removeItem(slugKey);
        localStorage.removeItem(`adonis_machine_${exercise.id}`);
      }
    } catch (e) {}
  };

  return (
    <>
      {/* BARRA SUPERIOR COMPACTA: TOGGLE BILATERAL, CHIP SOBRECARGA Y ENGRANE DE MÁQUINA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        marginBottom: '10px',
        width: '100%',
        flexWrap: 'nowrap'
      }}>
        {/* SELECTOR SEGMENTADO BILATERAL / POR LADO O BADGE BILATERAL RÍGIDO */}
        {isStrictlyBilateral ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#f1f5f9',
            padding: '4px 8px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '10.5px',
            fontWeight: '800',
            color: '#475569',
            flexShrink: 0
          }}>
            🔗 Barra Bilateral
          </div>
        ) : (
          <div style={{
            display: 'inline-flex',
            background: '#f1f5f9',
            padding: '2px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            flexShrink: 0
          }}>
            <button
              type="button"
              onClick={() => isUnilateral && onUpdateExerciseMeta && onUpdateExerciseMeta({ isUnilateral: false })}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: 'none',
                background: !isUnilateral ? '#ffffff' : 'transparent',
                color: !isUnilateral ? '#0f172a' : '#64748b',
                fontWeight: !isUnilateral ? '900' : '700',
                fontSize: '10.5px',
                cursor: 'pointer',
                boxShadow: !isUnilateral ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Bilateral
            </button>
            <button
              type="button"
              onClick={() => !isUnilateral && onUpdateExerciseMeta && onUpdateExerciseMeta({ isUnilateral: true })}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: 'none',
                background: isUnilateral ? '#7c3aed' : 'transparent',
                color: isUnilateral ? '#ffffff' : '#64748b',
                fontWeight: isUnilateral ? '900' : '700',
                fontSize: '10.5px',
                cursor: 'pointer',
                boxShadow: isUnilateral ? '0 1px 4px rgba(124,58,237,0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Por Lado
            </button>
          </div>
        )}

        {/* SELECTOR RÁPIDO DE PLANTA / MÁQUINA + BOTÓN ENGRANE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={() => setIsMachineConfigOpen(true)}
            style={{
              background: machineConfig ? '#eff6ff' : '#f8fafc',
              border: machineConfig ? '1.5px solid #93c5fd' : '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            title="Calibrar discos, trineo o saltos de peso de esta máquina"
          >
            <Settings2 size={13} color={machineConfig ? '#0066ff' : '#64748b'} />
          </button>

          <select
            value={currentLocation}
            onChange={(e) => {
              const val = e.target.value;
              const updated = { ...(machineConfig || {}), floor: val, station: val };
              handleSaveMachineConfig(updated);
            }}
            style={{
              background: currentLocation ? '#f5f3ff' : '#ffffff',
              border: currentLocation ? '1.5px solid #c084fc' : '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '4px 4px',
              fontSize: '10px',
              fontWeight: '800',
              color: currentLocation ? '#7c3aed' : '#475569',
              maxWidth: '115px',
              cursor: 'pointer',
              outline: 'none'
            }}
            title="Selecciona en qué piso o máquina estás entrenando hoy"
          >
            <option value="">🏢 Ubicación...</option>
            <option value="Planta Baja">🏢 Planta Baja</option>
            <option value="Planta Alta">🏢 Planta Alta</option>
            {currentLocation && !['Planta Baja', 'Planta Alta'].includes(currentLocation) && (
              <option value={currentLocation}>{currentLocation}</option>
            )}
          </select>
        </div>

        {/* CHIP DE SOBRECARGA CIENTÍFICA (ABRE MODAL) */}
        <button
          type="button"
          onClick={() => setIsScienceModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            background: coachAnalysis.isSpreadHigh ? '#fffbeb' : (coachAnalysis.canProgressWeight ? '#dcfce7' : '#eff6ff'),
            border: `1.5px solid ${coachAnalysis.isSpreadHigh ? '#fde68a' : (coachAnalysis.canProgressWeight ? '#86efac' : '#bfdbfe')}`,
            color: coachAnalysis.isSpreadHigh ? '#b45309' : (coachAnalysis.canProgressWeight ? '#15803d' : '#1d4ed8'),
            borderRadius: '9px',
            padding: '4px 8px',
            fontSize: '10.5px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            flexShrink: 0
          }}
          title="Ver análisis estadístico y estrategia inteligente de este ejercicio"
        >
          <span>{coachAnalysis.isSpreadHigh ? '🎯 Unificar' : (coachAnalysis.canProgressWeight ? '⚡ Subir' : '💡 Coach')}</span>
          <span style={{ fontSize: '8.5px', opacity: 0.8 }}>ⓘ</span>
        </button>
      </div>

      
      {/* ALERTA VISUAL SI LA MÁQUINA DE HOY ESTÁ EN OTRO PISO QUE LA GUÍA ANTERIOR */}
      {isFloorMismatch && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '10px',
          padding: '6px 10px',
          marginBottom: '8px',
          fontSize: '10px',
          fontWeight: '700',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '14px' }}>📍</span>
          <span>
            Hoy en <strong>{currentLocation}</strong> (tu registro anterior fue en <strong>{prevLocation}</strong>). El calentamiento está calculado con tu carga previa real; usa C1 y C2 para calibrar la fricción y resistencia de esta máquina antes de tus series efectivas.
          </span>
        </div>
      )}

      {/* SERIES DE CALENTAMIENTO ORGANIZADAS */}
      {shouldRenderWarmup ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px', width: '100%' }}>
          {(warmupPlan.series.length > 0 ? warmupPlan.series : [{ id: 0, label: 'C1', pct: '60%', defaultWeight: suggestedWarmupWeight || 0, defaultReps: 10, desc: 'Aproximación' }]).map((wSet) => {
            const wVal = exerciseData[wSet.id] || {};
            const isWDone = !!wVal.completed;

            return (
              <div
                key={wSet.id}
                style={{
                  background: isWDone ? '#fef3c7' : '#fffbeb',
                  borderRadius: '12px',
                  border: isWDone ? '1.5px solid #f59e0b' : '1.5px dashed #f59e0b',
                  padding: '6px 8px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px'
                }}
              >
                {/* IDENTIFICADOR CALENTAMIENTO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '70px' }}>
                  <Flame size={14} color="#d97706" />
                  <div>
                    <strong style={{ fontSize: '11px', color: '#b45309', fontWeight: '900' }}>
                      {wSet.label}
                    </strong>
                    <span style={{ fontSize: '8.5px', color: '#78350f', display: 'block', fontWeight: '700' }}>
                      {wSet.pct} (~{wSet.defaultWeight || 0} lbs)
                    </span>
                  </div>
                </div>

                {/* INPUT PESO CON CALCULADORA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder={wSet.defaultWeight ? String(wSet.defaultWeight) : "Peso"}
                    value={wVal.weight ?? ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(',', '.');
                      if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                        handleSanitizedChange(wSet.id, 'weight', val);
                      }
                    }}
                    style={{
                      width: '50px',
                      padding: '5px 2px',
                      borderRadius: '8px',
                      border: '1.5px solid #f59e0b',
                      fontSize: '13px',
                      fontWeight: '900',
                      textAlign: 'center',
                      background: '#ffffff',
                      color: '#78350f'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPlateModal({ isOpen: true, setNum: wSet.id, currentWeight: wVal.weight || wSet.defaultWeight || 0 })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', fontSize: '12px' }}
                    title="Calculadora de discos y placas"
                  >
                    🏋️
                  </button>
                  <span style={{ fontSize: '9.5px', color: '#b45309', fontWeight: '800' }}>lbs</span>
                </div>

                {/* INPUT REPS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={wSet.defaultReps ? String(wSet.defaultReps) : "Reps"}
                    value={wVal.reps ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^[0-9]+$/.test(val)) {
                        handleSanitizedChange(wSet.id, 'reps', val);
                      }
                    }}
                    style={{
                      width: '42px',
                      padding: '5px 2px',
                      borderRadius: '8px',
                      border: '1.5px solid #f59e0b',
                      fontSize: '13px',
                      fontWeight: '900',
                      textAlign: 'center',
                      background: '#ffffff',
                      color: '#78350f'
                    }}
                  />
                  <span style={{ fontSize: '9.5px', color: '#b45309', fontWeight: '800' }}>reps</span>
                </div>

                {/* BOTÓN CHECK CALENTAMIENTO */}
                <button
                  type="button"
                  onClick={() => toggleSetComplete(wSet.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isWDone ? '#f59e0b' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Check size={16} strokeWidth={3.5} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ marginBottom: '6px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => setManualWarmupOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            + Añadir Calentamiento (Opcional)
          </button>
        </div>
      )}

      {/* BANNER PERMANENTE: META GLOBAL DEL EJERCICIO PARA HOY */}
      {coachAnalysis?.unifiedTarget && (
        <div 
          onClick={() => setIsScienceModalOpen(true)}
          style={{
            background: coachAnalysis.unifiedTarget.isExcessiveLoad 
              ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' 
              : (coachAnalysis.unifiedTarget.canProgressWeight 
                  ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
                  : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'),
            border: `1.5px solid ${
              coachAnalysis.unifiedTarget.isExcessiveLoad 
                ? '#fde68a' 
                : (coachAnalysis.unifiedTarget.canProgressWeight ? '#86efac' : '#bae6fd')
            }`,
            borderRadius: '14px',
            padding: '8px 12px',
            marginBottom: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>
              {coachAnalysis.unifiedTarget.isExcessiveLoad ? '🔬' : (coachAnalysis.unifiedTarget.canProgressWeight ? '🚀' : '🎯')}
            </span>
            <div>
              <div style={{ 
                fontSize: '11.5px', 
                fontWeight: '900', 
                color: coachAnalysis.unifiedTarget.isExcessiveLoad 
                  ? '#92400e' 
                  : (coachAnalysis.unifiedTarget.canProgressWeight ? '#14532d' : '#0369a1') 
              }}>
                {coachAnalysis.unifiedTarget.headline}
              </div>
              <div style={{ 
                fontSize: '9.5px', 
                color: coachAnalysis.unifiedTarget.isExcessiveLoad 
                  ? '#b45309' 
                  : (coachAnalysis.unifiedTarget.canProgressWeight ? '#166534' : '#0284c7'), 
                fontWeight: '600',
                marginTop: '1px'
              }}>
                {coachAnalysis.unifiedTarget.note}
              </div>
            </div>
          </div>
          <span style={{ 
            fontSize: '9.5px', 
            color: coachAnalysis.unifiedTarget.isExcessiveLoad 
              ? '#d97706' 
              : (coachAnalysis.unifiedTarget.canProgressWeight ? '#16a34a' : '#0284c7'), 
            fontWeight: '900',
            flexShrink: 0,
            background: '#ffffff',
            padding: '2px 7px',
            borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.06)'
          }}>
            Coach ➔
          </span>
        </div>
      )}

      {/* TABLA DE SERIES DE TRABAJO EFECTIVAS (DISEÑO ANTI-DESBORDE Y SIN TRUNCAMIENTO) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', width: '100%' }}>
        {Array.from({ length: totalSets }).map((_, sIdx) => {
          const setNum = sIdx + 1;
          const setVal = exerciseData[setNum] || {};
          const prevVal = previousData[setNum] || {};
          const isDone = !!setVal.completed;

          const repsNum = Number(setVal.reps) || 0;
          const isRepsHighAlert = repsNum > 35 && !exercise.isTime;
          const weightNum = Number(setVal.weight) || 0;
          const prevWeightNum = Number(prevVal.weight) || 0;
          const rpeNum = Number(setVal.rpe) || 0;

          // Solo alertar si el salto es abrupto (>60%) Y no se registró RPE o el RPE fue fallo excesivo (>=9.5)
          const isWeightJumpAlert = prevWeightNum > 0 && weightNum > 0 && 
            (weightNum > prevWeightNum * 1.6 || weightNum < prevWeightNum * 0.5) &&
            (!setVal.rpe || rpeNum >= 9.5);

          // Si el usuario subió peso o mantuvo con RPE solvente (<= 8), es una consolidación exitosa
          const isWeightSolidified = isDone && prevWeightNum > 0 && weightNum >= prevWeightNum && rpeNum > 0 && rpeNum <= 8;

          // Pasa machineConfig y lo realizado hoy (exerciseData) para cálculo con incrementos reales y estabilidad
          const overloadTarget = getOverloadTarget(setNum, previousData, exercise.targetReps || '10-12', machineConfig, prevVal.weight, prevVal.reps, exerciseData);
          const current1RM = calculate1RM(setVal.weight, setVal.reps);
          const prev1RM = calculate1RM(prevVal.weight, prevVal.reps);
          const isPr = isDone && current1RM > 0 && prev1RM > 0 && current1RM > prev1RM;

          return (
            <div
              key={setNum}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                background: isDone ? '#f0fdf4' : '#ffffff',
                padding: '8px 10px',
                borderRadius: '14px',
                border: isDone 
                  ? '2px solid #22c55e' 
                  : (isRepsHighAlert ? '2px solid #ef4444' : (isWeightJumpAlert ? '2px solid #f59e0b' : '1.5px solid #cbd5e1')),
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* LÍNEA SUPERIOR COMPACTA: GUÍA PASADA Y META DE HOY (NUNCA SE CORTA) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px dashed #e2e8f0',
                paddingBottom: '4px',
                gap: '6px'
              }}>
                {/* GUÍA PASADA (NUNCA TRUNCADA) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  <span style={{
                    background: isDone ? '#15803d' : '#0f172a',
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '1px 5px',
                    fontSize: '10px',
                    fontWeight: '900'
                  }}>
                    S{setNum}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '10.5px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span>Anterior:</span>
                    <strong style={{ color: '#1e293b' }}>
                      {prevVal.weight 
                        ? `${prevVal.weight} lbs × ${prevVal.repsL !== undefined || prevVal.repsR !== undefined ? `I:${prevVal.repsL || prevVal.reps} D:${prevVal.repsR || prevVal.reps}` : `${prevVal.reps} reps`}` 
                        : '—'}
                    </strong>
                    {prevLocation && (
                      <span style={{
                        fontSize: '9px',
                        background: '#f5f3ff',
                        color: '#7c3aed',
                        padding: '0 4px',
                        borderRadius: '4px',
                        fontWeight: '800'
                      }} title={`Sesión pasada hecha en: ${prevLocation}`}>
                        ({prevLocation.includes('Planta') ? prevLocation.replace('Planta ', 'P.') : prevLocation})
                      </span>
                    )}
                  </span>
                </div>

                {/* META O PR (COMPACTA, SIN REPETICIÓN DE EMOJIS) */}
                {overloadTarget && !isDone && (
                  <span style={{ 
                    color: overloadTarget.isLoadAdjustment ? '#b45309' : '#0284c7', 
                    fontSize: '10.5px', 
                    fontWeight: '800', 
                    whiteSpace: 'nowrap',
                    background: overloadTarget.isLoadAdjustment ? '#fffbeb' : '#f0f9ff',
                    padding: '1px 6px',
                    borderRadius: '6px',
                    border: `1px solid ${overloadTarget.isLoadAdjustment ? '#fde68a' : '#bae6fd'}`,
                    flexShrink: 0
                  }}>
                    🎯 {overloadTarget.shortText}
                  </span>
                )}
                {isDone && (
                  <span style={{ 
                    color: isWeightSolidified ? '#15803d' : (isPr ? '#b45309' : '#64748b'), 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    whiteSpace: 'nowrap', 
                    flexShrink: 0 
                  }}>
                    {isWeightSolidified
                      ? `🔥 ${weightNum}# consolidado (RPE ${rpeNum})`
                      : (isPr && current1RM > 0 ? `🏆 PR! 1RM: ${current1RM} lbs` : (current1RM > 0 ? `1RM: ${current1RM} lbs` : '✓ Listo'))}
                  </span>
                )}
              </div>

              {/* LÍNEA DE ENTRADA DE DATOS (ROBUSTA Y SIN DESBORDAMIENTOS) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '4px',
                width: '100%',
                flexWrap: 'nowrap'
              }}>
                {/* PESO CON CALCULADORA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Peso"
                    value={setVal.weight ?? ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(',', '.');
                      if (raw === '' || /^[0-9]*\.?[0-9]*$/.test(raw)) {
                        handleSanitizedChange(setNum, 'weight', raw);
                      }
                    }}
                    style={{
                      width: isUnilateral ? '48px' : '52px',
                      padding: '6px 2px',
                      borderRadius: '8px',
                      border: isWeightJumpAlert ? '2px solid #f59e0b' : '1.5px solid #94a3b8',
                      fontSize: '13px',
                      fontWeight: '900',
                      textAlign: 'center',
                      background: isWeightJumpAlert ? '#fffbeb' : '#ffffff',
                      color: '#0f172a'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPlateModal({ isOpen: true, setNum, currentWeight: setVal.weight || 0 })}
                    title="Calculadora de discos y placas"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '1px',
                      fontSize: '13px',
                      lineHeight: 1
                    }}
                  >
                    🏋️
                  </button>
                  <span style={{ fontSize: isUnilateral ? '9.5px' : '10px', color: isUnilateral ? '#7c3aed' : '#64748b', fontWeight: '800', whiteSpace: 'nowrap' }}>
                    {isUnilateral ? `${exercise.defaultUnit || 'lbs'}/ld` : (exercise.defaultUnit || 'lbs')}
                  </span>
                </div>

                {/* REPETICIONES: MODO BILATERAL O POR LADO */}
                {isUnilateral ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f5f3ff', borderRadius: '8px', border: '1.5px solid #c4b5fd', padding: '1px 3px' }}>
                      <span style={{ fontSize: '9.5px', color: '#7c3aed', fontWeight: '900', marginRight: '1px' }}>I:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Izq"
                        value={setVal.repsL !== undefined ? setVal.repsL : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]+$/.test(val)) {
                            const rL = val !== '' ? Number(val) : '';
                            const rR = setVal.repsR !== undefined && setVal.repsR !== '' ? Number(setVal.repsR) : rL;
                            let avgR = '';
                            if (rL !== '' && rR !== '') {
                              if (rL === 1 && rR >= 5) avgR = String(rR);
                              else if (rR === 1 && rL >= 5) avgR = String(rL);
                              else avgR = String(Math.round((Number(rL) + Number(rR)) / 2));
                            } else if (rL !== '') {
                              avgR = String(rL);
                            }
                            handleSanitizedChange(setNum, {
                              repsL: val,
                              reps: avgR
                            });
                          }
                        }}
                        style={{
                          width: '28px',
                          padding: '5px 1px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '900',
                          textAlign: 'center',
                          background: 'transparent',
                          color: '#4c1d95',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#ecfdf5', borderRadius: '8px', border: '1.5px solid #a7f3d0', padding: '1px 3px' }}>
                      <span style={{ fontSize: '9.5px', color: '#059669', fontWeight: '900', marginRight: '1px' }}>D:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Der"
                        value={setVal.repsR !== undefined ? setVal.repsR : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]+$/.test(val)) {
                            const rR = val !== '' ? Number(val) : '';
                            const rL = setVal.repsL !== undefined && setVal.repsL !== '' ? Number(setVal.repsL) : rR;
                            let avgR = '';
                            if (rL !== '' && rR !== '') {
                              if (rL === 1 && rR >= 5) avgR = String(rR);
                              else if (rR === 1 && rL >= 5) avgR = String(rL);
                              else avgR = String(Math.round((Number(rL) + Number(rR)) / 2));
                            } else if (rR !== '') {
                              avgR = String(rR);
                            }
                            handleSanitizedChange(setNum, {
                              repsR: val,
                              reps: avgR
                            });
                          }
                        }}
                        style={{
                          width: '28px',
                          padding: '5px 1px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '900',
                          textAlign: 'center',
                          background: 'transparent',
                          color: '#065f46',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Reps"
                      value={setVal.reps ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^[0-9]+$/.test(val)) {
                          handleSanitizedChange(setNum, 'reps', val);
                        }
                      }}
                      style={{
                        width: '46px',
                        padding: '6px 2px',
                        borderRadius: '8px',
                        border: isRepsHighAlert ? '2px solid #ef4444' : '1.5px solid #94a3b8',
                        fontSize: '13px',
                        fontWeight: '900',
                        textAlign: 'center',
                        background: isRepsHighAlert ? '#fef2f2' : '#ffffff',
                        color: '#0f172a'
                      }}
                    />
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>r</span>
                  </div>
                )}

                {/* SELECTOR RPE */}
                <select
                  value={setVal.rpe || '8'}
                  onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                  style={{
                    width: '56px',
                    padding: '6px 2px',
                    borderRadius: '8px',
                    border: setVal.rpe === '8' ? '1.5px solid #3b82f6' : '1.5px solid #cbd5e1',
                    fontSize: '11px',
                    fontWeight: '900',
                    textAlign: 'center',
                    background: setVal.rpe === '8' ? '#eff6ff' : '#ffffff',
                    color: setVal.rpe === '8' ? '#1d4ed8' : '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  <option value="6">RPE 6</option>
                  <option value="7">RPE 7</option>
                  <option value="8">RPE 8</option>
                  <option value="8.5">RPE 8.5</option>
                  <option value="9">RPE 9</option>
                  <option value="9.5">RPE 9.5</option>
                  <option value="10">RPE 10</option>
                </select>

                {/* BOTÓN CHECK SERIE EFECTIVA */}
                <button
                  type="button"
                  onClick={() => toggleSetComplete(setNum)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isDone ? '#10b981' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Check size={18} strokeWidth={3.5} />
                </button>
              </div>

              {/* ALERTAS ANTI-TYPO */}
              {isRepsHighAlert && (
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '2px 6px', borderRadius: '6px' }}>
                  ⚠️ ¿{repsNum} reps? Verifica posible error tipográfico.
                </div>
              )}
              {isWeightJumpAlert && (
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#d97706', background: '#fffbeb', border: '1px solid #fed7aa', padding: '2px 6px', borderRadius: '6px' }}>
                  ⚠️ Salto brusco detectado ({prevWeightNum} ➔ {weightNum} lbs).
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CONTROLES INFERIORES: AGREGAR SERIE, QUITAR SERIE Y REGISTRAR SENSACIONES */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', width: '100%' }}>
        <button
          type="button"
          onClick={handleAddSet}
          style={{
            flex: 1,
            background: '#eff6ff',
            color: '#0066ff',
            border: '1.5px solid #bfdbfe',
            padding: '9px 4px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Plus size={13} /> + Serie
        </button>

        {totalSets > 1 && (
          <button
            type="button"
            onClick={handleRemoveSet}
            style={{
              background: '#fef2f2',
              color: '#ef4444',
              border: '1.5px solid #fecaca',
              padding: '9px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Minus size={13} /> Quitar
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsFeedbackModalOpen(true)}
          style={{
            flex: 1.2,
            background: hasFeedback ? '#f3e8ff' : '#f8fafc',
            color: hasFeedback ? '#7c3aed' : '#475569',
            border: hasFeedback ? '1.5px solid #c084fc' : '1.5px solid #cbd5e1',
            padding: '9px 6px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          title="Registrar biofeedback medible de sensaciones y congestión"
        >
          <Sparkles size={13} color={hasFeedback ? '#7c3aed' : '#64748b'} />
          {hasFeedback ? 'Sensaciones ✓' : 'Sensaciones'}
        </button>
      </div>

      {/* MODAL CALCULADORA DE DISCOS Y PLACAS */}
      <PlateCalculatorModal
        isOpen={plateModal.isOpen}
        onClose={() => setPlateModal({ isOpen: false, setNum: null, currentWeight: 0 })}
        initialWeight={plateModal.currentWeight}
        initialExerciseType={getApparatusType(exercise.name || '')}
        exerciseName={exercise.name}
        machineConfig={machineConfig}
        onSaveMachineConfig={handleSaveMachineConfig}
        onOpenMachineConfig={() => {
          setPlateModal({ isOpen: false, setNum: null, currentWeight: 0 });
          setIsMachineConfigOpen(true);
        }}
        onApplyWeight={(appliedWeight) => {
          if (plateModal.setNum !== null) {
            handleSanitizedChange(plateModal.setNum, 'weight', appliedWeight);
          }
          setPlateModal({ isOpen: false, setNum: null, currentWeight: 0 });
        }}
      />

      {/* MODAL CIENTÍFICO DE SOBRECARGA PROGRESIVA */}
      <OverloadScienceModal
        isOpen={isScienceModalOpen}
        onClose={() => setIsScienceModalOpen(false)}
        exerciseName={exercise.name}
        loadRecommendation={loadRecommendation}
        targetReps={exercise.targetReps || '8-10'}
        previousData={previousData}
        machineConfig={machineConfig}
      />

      {/* MODAL DE CALIBRACIÓN DE MÁQUINA Y DISCOS */}
      <MachineConfigModal
        isOpen={isMachineConfigOpen}
        onClose={() => setIsMachineConfigOpen(false)}
        exerciseName={exercise.name}
        exerciseId={exercise.id}
        currentConfig={machineConfig}
        onSaveConfig={handleSaveMachineConfig}
        onOpenCalculator={() => {
          setIsMachineConfigOpen(false);
          setPlateModal({ isOpen: true, setNum: 1, currentWeight: machineConfig?.firstPlate || 0 });
        }}
      />

      {/* MODAL DE SENSACIONES Y RETROALIMENTACIÓN MEDIBLE */}
      <ExerciseFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        exerciseName={exercise.name}
        currentFeedback={currentFeedback || {}}
        onSaveFeedback={handleSaveFeedback}
      />
    </>
  );
}
