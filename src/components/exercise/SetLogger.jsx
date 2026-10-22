import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Check, Plus, Minus, Trophy, Sparkles, Settings2 } from 'lucide-react';
import PlateCalculatorModal from './PlateCalculatorModal';
import OverloadScienceModal from './OverloadScienceModal';
import ExerciseFeedbackModal from './ExerciseFeedbackModal';
import MachineConfigModal from './MachineConfigModal';
import { 
  calculate1RM, 
  getOverloadTarget, 
  analyzeExercisePerformance, 
  getMachineStorageKey, 
  getUnifiedExerciseTarget, 
  isExerciseUnilateral,
  loadMachineProfilesForExercise,
  getActiveMachineConfig,
  saveMachineConfigAndProfiles,
  roundToAttainableWeight
} from '../../hooks/useWorkoutCalculations';
import { useIndexedDB as useLocalStorage } from '../../hooks/useIndexedDB';

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

  // 2. Fallback a series previas si hoy está vacío
  if (!workingWeight || workingWeight <= 0) {
    const prevSets = Object.keys(previousData || {})
      .map(k => parseInt(k, 10))
      .filter(n => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);
    if (prevSets.length > 0) {
      workingWeight = parseFloat(previousData[prevSets[0]]?.weight || 0);
    }
  }

  if (warmupStr.includes('no ocupa')) {
    return { requiresWarmup: false, series: [] };
  }

  if (!workingWeight || workingWeight <= 0) {
    return { requiresWarmup: false, series: [] };
  }

  const hasSerie2 = warmupStr.includes('serie 2');
  if (hasSerie2) {
    const p1 = warmupStr.includes('40%') ? 0.40 : 0.50;
    const p2 = warmupStr.includes('70%') ? 0.70 : 0.75;
    const r1 = 10;
    const r2 = warmupStr.includes('3 reps') ? 3 : 4;

    const w1 = workingWeight > 0 ? roundToAttainableWeight(workingWeight * p1, machineConfig) : 0;
    const w2 = workingWeight > 0 ? roundToAttainableWeight(workingWeight * p2, machineConfig) : 0;

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
  const w = workingWeight > 0 ? roundToAttainableWeight(workingWeight * p, machineConfig) : 0;

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
  onUpdateExerciseMeta,
  workoutHistory = [],
  isDeloadMode = false
}) {
  const [unlockedDeloadSets, setUnlockedDeloadSets] = useState({});
  // Clasificación biomecánica inteligente (unilateral vs bilateral)
  const isUnilateral = useMemo(() => {
    return isExerciseUnilateral(exercise, exerciseData);
  }, [exercise, exerciseData?.isUnilateral]);

  // Biomecánicamente bilateral rígido (barra recta, barra Z, smith, prensa, etc.)
  const isStrictlyBilateral = useMemo(() => {
    const name = (exercise?.name || '').toLowerCase();
    return /barra|smith|prensa|leg press|squat con barra|bench press con barra|press militar con barra/i.test(name);
  }, [exercise?.name]);
  const prescribedReps = exercise?.reps || exercise?.targetReps || '10-12';
  
  const slugKey = useMemo(() => getMachineStorageKey(exercise), [exercise]);
  const [globalMachineConfigs, setGlobalMachineConfigs] = useLocalStorage('coachv2_machine_configs', {});
  const [globalMachineProfiles, setGlobalMachineProfiles] = useLocalStorage('coachv2_machine_profiles', {});

  // Extraer de forma exhaustiva todos los perfiles de máquina guardados (Planta Alta / Planta Baja / etc.)
  const exerciseProfiles = useMemo(() => {
    return loadMachineProfilesForExercise(exercise, {
      globalMachineProfiles,
      globalMachineConfigs,
      previousData,
      exerciseData,
      workoutHistory
    });
  }, [exercise, globalMachineProfiles, globalMachineConfigs, previousData, exerciseData?.machineConfig, workoutHistory]);

  // Resuelve la máquina activa (hoy > default > match de piso previo > primer perfil)
  const activeResolvedConfig = useMemo(() => {
    return getActiveMachineConfig(exerciseProfiles, exerciseData, previousData);
  }, [exerciseProfiles, exerciseData?.machineConfig, previousData]);

  const [machineConfig, setMachineConfig] = useState(() => activeResolvedConfig);

  // Mantener sincronizado y propagar a todayWorkoutData para que NUNCA se guarde la sesión sin máquina
  useEffect(() => {
    if (exerciseData?.machineConfig) {
      setMachineConfig(exerciseData.machineConfig);
    } else if (activeResolvedConfig) {
      setMachineConfig(activeResolvedConfig);
      if (onUpdateExerciseMeta && !exerciseData?.machineConfig) {
        onUpdateExerciseMeta({ machineConfig: activeResolvedConfig });
      }
    }
  }, [activeResolvedConfig, exerciseData?.machineConfig]);

  const [plateModal, setPlateModal] = useState({ isOpen: false, setNum: null, currentWeight: 0 });
  const [isScienceModalOpen, setIsScienceModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMachineConfigOpen, setIsMachineConfigOpen] = useState(false);
  const [manualWarmupOpen, setManualWarmupOpen] = useState(false);

  const coachAnalysis = analyzeExercisePerformance(previousData, prescribedReps, machineConfig);

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

  const handleSaveMachineConfig = (configData, updatedProfiles) => {
    setMachineConfig(configData);
    saveMachineConfigAndProfiles({
      exercise,
      configData,
      updatedProfiles: updatedProfiles || (configData ? [configData] : []),
      setGlobalMachineProfiles,
      setGlobalMachineConfigs,
      onUpdateExerciseMeta
    });
  };

  const handleSelectMachineProfile = (profId) => {
    if (profId === '__NEW__') {
      setIsMachineConfigOpen(true);
      return;
    }
    const target = exerciseProfiles.find(p => p.id === profId);
    if (target) {
      const updatedList = exerciseProfiles.map(p => ({
        ...p,
        isDefault: p.id === profId
      }));
      handleSaveMachineConfig({ ...target, isDefault: true }, updatedList);
    }
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
            background: 'var(--bg-surface-secondary)',
            padding: '4px 8px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '10.5px',
            fontWeight: '800',
            color: 'var(--text-secondary)',
            flexShrink: 0
          }}>
            🔗 Barra Bilateral
          </div>
        ) : (
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-surface-secondary)',
            padding: '2px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            flexShrink: 0
          }}>
            <button
              type="button"
              onClick={() => isUnilateral && onUpdateExerciseMeta && onUpdateExerciseMeta({ isUnilateral: false })}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: 'none',
                background: !isUnilateral ? 'var(--bg-card)' : 'transparent',
                color: !isUnilateral ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: !isUnilateral ? '900' : '700',
                fontSize: '10.5px',
                cursor: 'pointer',
                boxShadow: !isUnilateral ? 'var(--shadow-ios-sm)' : 'none',
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
                color: isUnilateral ? '#ffffff' : 'var(--text-muted)',
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

        {/* SELECTOR DE MÁQUINA CON PERFILES Y CALIBRACIÓN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={() => setIsMachineConfigOpen(true)}
            style={{
              background: machineConfig ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
              border: machineConfig ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            title="Calibrar máquina, asiento, respaldo, muesca o saltos de peso"
          >
            <Settings2 size={13} color={machineConfig ? 'var(--accent-blue)' : 'var(--text-muted)'} />
          </button>

          <select
            value={machineConfig?.id || (exerciseProfiles[0]?.id) || ''}
            onChange={(e) => handleSelectMachineProfile(e.target.value)}
            style={{
              background: machineConfig ? 'rgba(124, 58, 237, 0.15)' : 'var(--bg-card)',
              border: machineConfig ? '1.5px solid #a855f7' : '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '4px 5px',
              fontSize: '10px',
              fontWeight: '800',
              color: machineConfig ? '#c084fc' : 'var(--text-main)',
              maxWidth: '145px',
              cursor: 'pointer',
              outline: 'none',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
            title="Selecciona qué máquina estás usando (Planta Alta o Planta Baja) o añade una nueva"
          >
            {exerciseProfiles.length === 0 && !machineConfig && (
              <option value="">⚙️ Sin calibrar</option>
            )}
            {exerciseProfiles.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.floor === 'Planta Alta' ? '🏢 P. Alta: ' : (prof.floor === 'Planta Baja' ? '🏢 P. Baja: ' : '⚙️ ')}{prof.name || prof.station || 'Máquina'}{prof.seat ? ` (As. ${prof.seat})` : ''}
              </option>
            ))}
            {(!exerciseProfiles.some(p => p.id === machineConfig?.id) && (machineConfig?.name || machineConfig?.station)) && (
              <option value={machineConfig.id || 'curr'}>
                {machineConfig.floor ? `🏢 ${machineConfig.floor}: ` : '⚙️ '}{machineConfig.name || machineConfig.station}
              </option>
            )}
            <option value="__NEW__">➕ Añadir máquina (P. Alta / P. Baja)...</option>
          </select>

          {/* Chip de calibración biomecánica activa si existe asiento/respaldo/muesca */}
          {(machineConfig?.seat || machineConfig?.backrest || machineConfig?.notch) && (
            <button
              type="button"
              onClick={() => setIsMachineConfigOpen(true)}
              style={{
                background: 'var(--accent-emerald-subtle)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: '8px',
                padding: '3px 5px',
                fontSize: '9px',
                fontWeight: '800',
                color: 'var(--accent-emerald)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '110px'
              }}
              title="Calibración activa: clic para editar"
            >
              <span>
                {[
                  machineConfig.seat ? `Asiento: ${machineConfig.seat}` : '',
                  machineConfig.backrest ? `Resp: ${machineConfig.backrest}` : '',
                  machineConfig.notch ? `Muesca: ${machineConfig.notch}` : ''
                ].filter(Boolean).join(' • ')}
              </span>
            </button>
          )}
        </div>

        {/* CHIP DE SOBRECARGA CIENTÍFICA (ABRE MODAL) */}
        <button
          type="button"
          onClick={() => setIsScienceModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            background: coachAnalysis.isSpreadHigh ? 'var(--accent-amber-subtle)' : (coachAnalysis.canProgressWeight ? 'var(--accent-emerald-subtle)' : 'var(--accent-blue-light)'),
            border: `1.5px solid ${coachAnalysis.isSpreadHigh ? 'var(--accent-amber)' : (coachAnalysis.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-blue)')}`,
            color: coachAnalysis.isSpreadHigh ? 'var(--accent-amber)' : (coachAnalysis.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-blue)'),
            borderRadius: '9px',
            padding: '4px 8px',
            fontSize: '10.5px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-ios-sm)',
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
          background: 'var(--accent-amber-subtle)',
          border: '1px solid var(--accent-amber)',
          borderRadius: '10px',
          padding: '6px 10px',
          marginBottom: '8px',
          fontSize: '10px',
          fontWeight: '700',
          color: 'var(--accent-amber)',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px', width: '100%' }}>
          {(warmupPlan.series.length > 0 ? warmupPlan.series : [{ id: 0, label: 'C1', pct: '60%', defaultWeight: suggestedWarmupWeight || 0, defaultReps: 10, desc: 'Aproximación' }]).map((wSet) => {
            const wVal = exerciseData[wSet.id] || {};
            const isWDone = !!wVal.completed;

            return (
              <div
                key={wSet.id}
                style={{
                  background: isWDone ? 'var(--accent-amber-subtle)' : 'var(--bg-surface-secondary)',
                  borderRadius: '10px',
                  border: isWDone ? '1px solid var(--accent-amber)' : '1px dashed var(--accent-amber)',
                  padding: '5px 8px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px'
                }}
              >
                {/* IDENTIFICADOR CALENTAMIENTO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '65px' }}>
                  <Flame size={13} color="var(--accent-amber)" />
                  <div>
                    <strong className="font-mono-tech" style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: '900' }}>
                      {wSet.label}
                    </strong>
                    <span className="font-mono-tech" style={{ fontSize: '8.5px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>
                      {wSet.pct} (~{wSet.defaultWeight || 0}#)
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
                    className="font-mono-tech"
                    style={{
                      width: '48px',
                      height: '32px',
                      padding: '0 2px',
                      borderRadius: '6px',
                      border: '1px solid var(--accent-amber)',
                      fontSize: '13px',
                      fontWeight: '800',
                      textAlign: 'center',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPlateModal({ isOpen: true, setNum: wSet.id, currentWeight: wVal.weight || wSet.defaultWeight || 0 })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', fontSize: '12px', lineHeight: 1 }}
                    title="Calculadora de discos y placas"
                  >
                    🏋️
                  </button>
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700' }}>lbs</span>
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
                    className="font-mono-tech"
                    style={{
                      width: '40px',
                      height: '32px',
                      padding: '0 2px',
                      borderRadius: '6px',
                      border: '1px solid var(--accent-amber)',
                      fontSize: '13px',
                      fontWeight: '800',
                      textAlign: 'center',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700' }}>reps</span>
                </div>

                {/* BOTÓN CHECK CALENTAMIENTO */}
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.vibrate) {
                      try { navigator.vibrate(20); } catch (e) {}
                    }
                    toggleSetComplete(wSet.id);
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isWDone ? 'var(--accent-amber)' : 'var(--bg-surface-elevated)',
                    color: isWDone ? '#000000' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
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
              color: 'var(--text-muted)',
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
            background: 'var(--bg-surface-secondary)',
            border: `1px solid ${
              coachAnalysis.unifiedTarget.isExcessiveLoad 
                ? 'var(--accent-amber)' 
                : (coachAnalysis.unifiedTarget.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-cyan)')
            }`,
            borderRadius: '10px',
            padding: '6px 10px',
            marginBottom: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px' }}>
              {coachAnalysis.unifiedTarget.isExcessiveLoad ? '🔬' : (coachAnalysis.unifiedTarget.canProgressWeight ? '🚀' : '🎯')}
            </span>
            <div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '900', 
                color: coachAnalysis.unifiedTarget.isExcessiveLoad 
                  ? 'var(--accent-amber)' 
                  : (coachAnalysis.unifiedTarget.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-cyan)') 
              }}>
                {coachAnalysis.unifiedTarget.headline}
              </div>
              <div style={{ 
                fontSize: '9.5px', 
                color: 'var(--text-muted)', 
                fontWeight: '600'
              }}>
                {coachAnalysis.unifiedTarget.note}
              </div>
            </div>
          </div>
          <span style={{ 
            fontSize: '9px', 
            color: coachAnalysis.unifiedTarget.isExcessiveLoad 
              ? 'var(--accent-amber)' 
              : (coachAnalysis.unifiedTarget.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-cyan)'), 
            fontWeight: '900',
            flexShrink: 0,
            background: 'var(--bg-surface)',
            padding: '2px 6px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            Coach ➔
          </span>
        </div>
      )}

      {/* BANNER INFORMATIVO MODO DELOAD */}
      {isDeloadMode && (
        <div style={{
          background: 'var(--accent-emerald-subtle)',
          border: '1px solid var(--accent-emerald)',
          borderRadius: '10px',
          padding: '6px 10px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '14px' }}>🧘</span>
          <div style={{ fontSize: '10.5px', color: 'var(--accent-emerald)', fontWeight: '800', lineHeight: '1.3' }}>
            <strong>Modo Deload Activo:</strong> Cargas al 80%, 2 series y RIR 3-4 (sin fallo) para regeneración del SNC.
          </div>
        </div>
      )}

      {/* TABLA DE SERIES DE TRABAJO EFECTIVAS (DISEÑO TÁCTICO CYBER-CLINICAL) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px', width: '100%' }}>
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

          const prevRepsNum = isUnilateral
            ? ((prevVal.repsL !== undefined || prevVal.repsR !== undefined)
                ? Math.max(Number(prevVal.repsL) || 0, Number(prevVal.repsR) || 0, Number(prevVal.reps) || 0)
                : Number(prevVal.reps) || 0)
            : Number(prevVal.reps || prevVal.repsR || prevVal.repsL || 0);
          const deltaWeight = (prevWeightNum > 0 && weightNum > 0) ? (weightNum - prevWeightNum) : 0;
          const deltaReps = (prevRepsNum > 0 && repsNum > 0) ? (repsNum - prevRepsNum) : 0;
          const isExtraSet = !prevWeightNum && !prevRepsNum;

          // Pasa machineConfig y lo realizado hoy (exerciseData) para cálculo con incrementos reales y estabilidad
          const overloadTarget = getOverloadTarget(setNum, previousData, prescribedReps, machineConfig, prevVal.weight, prevVal.reps, exerciseData, isDeloadMode);
          const current1RM = calculate1RM(setVal.weight, setVal.reps);
          const prev1RM = calculate1RM(prevVal.weight, prevVal.reps);
          const isPr = isDone && current1RM > 0 && prev1RM > 0 && current1RM > prev1RM;

          // Si estamos en Deload y es la serie 3 o posterior (y no está completada ni desbloqueada manualmente)
          if (isDeloadMode && sIdx >= 2 && !unlockedDeloadSets[setNum] && !isDone) {
            return (
              <div
                key={setNum}
                style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '7px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  opacity: 0.8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="font-mono-tech" style={{
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--text-muted)',
                    borderRadius: '5px',
                    padding: '1px 5px',
                    fontSize: '9.5px',
                    fontWeight: '900'
                  }}>
                    S{setNum}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    🧘 Serie Omitida por Deload (Descarga)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setUnlockedDeloadSets(prev => ({ ...prev, [setNum]: true }))}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '6px',
                    padding: '3px 7px',
                    fontSize: '9.5px',
                    fontWeight: '800',
                    color: 'var(--accent-cyan)',
                    cursor: 'pointer'
                  }}
                  title="Desbloquear si deseas realizar esta serie extra"
                >
                  🔓 Desbloquear
                </button>
              </div>
            );
          }

          // Insignia inteligente delta-aware al completar la serie
          let completedBadge = null;
          if (isDone) {
            if (isExtraSet) {
              completedBadge = {
                text: '➕ Extra (+Vol)',
                color: 'var(--accent-blue)',
                border: 'var(--accent-blue)'
              };
            } else if (deltaWeight > 0) {
              completedBadge = {
                text: `${isPr ? '🏆 PR! ' : ''}🚀 +${deltaWeight}#`,
                color: 'var(--accent-emerald)',
                border: 'var(--accent-emerald)'
              };
            } else if (deltaWeight === 0 && deltaReps > 0) {
              completedBadge = {
                text: `${isPr ? '🏆 PR! ' : ''}⚡ +${deltaReps}r`,
                color: 'var(--accent-cyan)',
                border: 'var(--accent-cyan)'
              };
            } else if (deltaWeight === 0 && deltaReps === 0) {
              completedBadge = {
                text: `✓ ${weightNum}# Consolidado`,
                color: 'var(--accent-emerald)',
                border: 'var(--accent-emerald)'
              };
            } else if (deltaWeight < 0) {
              completedBadge = {
                text: `⚖️ Back-off (${deltaWeight}#)`,
                color: 'var(--accent-amber)',
                border: 'var(--accent-amber)'
              };
            } else if (deltaReps < 0) {
              completedBadge = {
                text: rpeNum >= 9.5 ? `⚠️ Fatiga (${repsNum} vs ${prevRepsNum}r)` : `✓ ${weightNum}# × ${repsNum}r`,
                color: 'var(--text-muted)',
                border: 'var(--border-strong)'
              };
            } else {
              completedBadge = {
                text: current1RM > 0 ? `1RM: ${current1RM}#` : '✓ Listo',
                color: 'var(--accent-emerald)',
                border: 'var(--accent-emerald)'
              };
            }
          }

          return (
            <div
              key={setNum}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                background: isDone ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
                border: isDone ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '6px 8px',
                boxShadow: isDone ? '0 0 10px var(--accent-emerald-subtle)' : 'none',
                position: 'relative',
                transition: 'border-color 0.15s ease, background 0.15s ease'
              }}
            >
              {/* LÍNEA SUPERIOR: NÚMERO DE SERIE, HISTORIAL ANTERIOR Y META */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '3px',
                gap: '5px'
              }}>
                {/* GUÍA PASADA (NUNCA TRUNCADA) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  <span className="font-mono-tech" style={{
                    background: isDone ? 'var(--accent-emerald)' : 'var(--bg-surface-elevated)',
                    color: isDone ? '#000000' : 'var(--text-main)',
                    borderRadius: '5px',
                    padding: '1px 5px',
                    fontSize: '9.5px',
                    fontWeight: '900'
                  }}>
                    S{setNum}
                  </span>
                  <span className="font-mono-tech" style={{ color: 'var(--text-muted)', fontSize: '10px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: '9px', opacity: 0.8 }}>Prev:</span>
                    <strong style={{ color: 'var(--text-main)', fontWeight: '700' }}>
                      {prevVal.weight 
                        ? `${prevVal.weight}# × ${
                            isUnilateral && ((prevVal.repsL && prevVal.repsL !== 'null') || (prevVal.repsR && prevVal.repsR !== 'null'))
                              ? `I:${prevVal.repsL || prevVal.reps} D:${prevVal.repsR || prevVal.reps}`
                              : `${prevVal.reps || prevVal.repsR || prevVal.repsL || '—'}r`
                          }` 
                        : '—'}
                    </strong>
                    {prevLocation && (
                      <span style={{
                        fontSize: '8.5px',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--accent-cyan)',
                        padding: '0 3px',
                        borderRadius: '3px',
                        fontWeight: '700'
                      }} title={`Sesión pasada hecha en: ${prevLocation}`}>
                        ({prevLocation.includes('Planta') ? prevLocation.replace('Planta ', 'P.') : prevLocation})
                      </span>
                    )}
                  </span>
                </div>

                {/* META O PR */}
                {overloadTarget && !isDone && (
                  <span className="font-mono-tech" style={{ 
                    color: overloadTarget.isLoadAdjustment ? 'var(--accent-amber)' : 'var(--accent-cyan)', 
                    fontSize: '9.5px', 
                    fontWeight: '800', 
                    whiteSpace: 'nowrap',
                    background: overloadTarget.isLoadAdjustment ? 'var(--accent-amber-subtle)' : 'var(--accent-cyan-subtle)',
                    padding: '1px 5px',
                    borderRadius: '5px',
                    border: `1px solid ${overloadTarget.isLoadAdjustment ? 'var(--accent-amber)' : 'var(--accent-cyan)'}`,
                    flexShrink: 0
                  }}>
                    🎯 {overloadTarget.shortText}
                  </span>
                )}
                {isDone && completedBadge && (
                  <span className="font-mono-tech" style={{ 
                    color: completedBadge.color,
                    background: 'var(--bg-surface)',
                    border: `1px solid ${completedBadge.border}`,
                    fontSize: '9.5px', 
                    fontWeight: '800', 
                    whiteSpace: 'nowrap', 
                    padding: '1px 5px',
                    borderRadius: '5px',
                    flexShrink: 0 
                  }}>
                    {completedBadge.text}
                  </span>
                )}
              </div>

              {/* LÍNEA DE ENTRADA DE DATOS (HIGH DENSITY COCKPIT ROW) */}
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
                    value={setVal.weight === null || setVal.weight === undefined || setVal.weight === 'null' ? '' : setVal.weight}
                    onChange={(e) => {
                      const raw = e.target.value.replace(',', '.');
                      if (raw === '' || /^[0-9]*\.?[0-9]*$/.test(raw)) {
                        handleSanitizedChange(setNum, 'weight', raw);
                      }
                    }}
                    className="font-mono-tech"
                    style={{
                      width: isUnilateral ? '48px' : '52px',
                      height: '34px',
                      padding: '0 2px',
                      borderRadius: '6px',
                      border: isWeightJumpAlert ? '1.5px solid var(--accent-amber)' : '1px solid var(--border-strong)',
                      fontSize: '14px',
                      fontWeight: '800',
                      textAlign: 'center',
                      background: 'var(--bg-surface-secondary)',
                      color: 'var(--text-main)'
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
                      fontSize: '12px',
                      lineHeight: 1
                    }}
                  >
                    🏋️
                  </button>
                  <span className="font-mono-tech" style={{ fontSize: isUnilateral ? '9px' : '9.5px', color: 'var(--text-muted)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    {isUnilateral ? `${exercise.defaultUnit || 'lbs'}/l` : (exercise.defaultUnit || 'lbs')}
                  </span>
                </div>

                {/* REPETICIONES: MODO BILATERAL O POR LADO */}
                {isUnilateral ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface-secondary)', borderRadius: '6px', border: '1px solid var(--border-strong)', padding: '0 2px', height: '34px' }}>
                      <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--accent-cyan)', fontWeight: '800', marginRight: '1px' }}>I:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Izq"
                        value={setVal.repsL !== undefined && setVal.repsL !== null && setVal.repsL !== 'null' ? setVal.repsL : ''}
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
                        className="font-mono-tech"
                        style={{
                          width: '24px',
                          padding: '0',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: '800',
                          textAlign: 'center',
                          background: 'transparent',
                          color: 'var(--text-main)',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface-secondary)', borderRadius: '6px', border: '1px solid var(--border-strong)', padding: '0 2px', height: '34px' }}>
                      <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--accent-emerald)', fontWeight: '800', marginRight: '1px' }}>D:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Der"
                        value={setVal.repsR !== undefined && setVal.repsR !== null && setVal.repsR !== 'null' ? setVal.repsR : ''}
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
                            } else if (rL !== '') {
                              avgR = String(rR);
                            }
                            handleSanitizedChange(setNum, {
                              repsR: val,
                              reps: avgR
                            });
                          }
                        }}
                        className="font-mono-tech"
                        style={{
                          width: '24px',
                          padding: '0',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: '800',
                          textAlign: 'center',
                          background: 'transparent',
                          color: 'var(--text-main)',
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
                      value={setVal.reps === null || setVal.reps === undefined || setVal.reps === 'null' ? '' : setVal.reps}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^[0-9]+$/.test(val)) {
                          handleSanitizedChange(setNum, 'reps', val);
                        }
                      }}
                      className="font-mono-tech"
                      style={{
                        width: '44px',
                        height: '34px',
                        padding: '0 2px',
                        borderRadius: '6px',
                        border: isRepsHighAlert ? '1.5px solid var(--accent-red)' : '1px solid var(--border-strong)',
                        fontSize: '14px',
                        fontWeight: '800',
                        textAlign: 'center',
                        background: 'var(--bg-surface-secondary)',
                        color: 'var(--text-main)'
                      }}
                    />
                    <span className="font-mono-tech" style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '700' }}>r</span>
                  </div>
                )}

                {/* SELECTOR RPE SEMÁNTICO RIR */}
                {(() => {
                  const rpeVal = parseFloat(setVal.rpe || '8');
                  let rpeBorder = 'var(--border-strong)';
                  let rpeColor = 'var(--text-main)';
                  let rpeBg = 'var(--bg-surface-secondary)';

                  if (rpeVal <= 8) {
                    // RIR 2-4: Esmeralda
                    rpeBorder = 'var(--accent-emerald)';
                    rpeColor = 'var(--accent-emerald)';
                    rpeBg = 'var(--accent-emerald-subtle)';
                  } else if (rpeVal <= 9) {
                    // RIR 1-1.5: Ámbar
                    rpeBorder = 'var(--accent-amber)';
                    rpeColor = 'var(--accent-amber)';
                    rpeBg = 'var(--accent-amber-subtle)';
                  } else {
                    // RIR 0 / Fallo: Rojo
                    rpeBorder = 'var(--accent-red)';
                    rpeColor = 'var(--accent-red)';
                    rpeBg = 'var(--accent-red-subtle)';
                  }

                  return (
                    <select
                      value={setVal.rpe || '8'}
                      onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                      className="font-mono-tech"
                      style={{
                        width: '54px',
                        height: '34px',
                        padding: '0 2px',
                        borderRadius: '6px',
                        border: `1px solid ${rpeBorder}`,
                        fontSize: '10.5px',
                        fontWeight: '800',
                        textAlign: 'center',
                        background: rpeBg,
                        color: rpeColor,
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
                  );
                })()}

                {/* BOTÓN CHECK SERIE EFECTIVA */}
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.vibrate) {
                      try { navigator.vibrate(30); } catch (e) {}
                    }
                    toggleSetComplete(setNum);
                  }}
                  title={isDone ? 'Serie completada (Toca para desmarcar)' : 'Marcar serie como completada'}
                  style={{
                    width: '36px',
                    height: '34px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isDone ? 'var(--accent-emerald)' : 'var(--bg-surface-elevated)',
                    color: isDone ? '#000000' : 'var(--text-muted)',
                    boxShadow: isDone ? '0 0 10px var(--accent-emerald-subtle)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Check size={18} strokeWidth={3.5} />
                </button>
              </div>

              {/* ALERTAS ANTI-TYPO */}
              {isRepsHighAlert && (
                <div style={{ fontSize: '9.5px', fontWeight: '800', color: 'var(--accent-red)', background: 'var(--accent-red-subtle)', border: '1px solid var(--accent-red)', padding: '2px 5px', borderRadius: '5px' }}>
                  ⚠️ ¿{repsNum} reps? Verifica posible error tipográfico.
                </div>
              )}
              {isWeightJumpAlert && (
                <div style={{ fontSize: '9.5px', fontWeight: '800', color: 'var(--accent-amber)', background: 'var(--accent-amber-subtle)', border: '1px solid var(--accent-amber)', padding: '2px 5px', borderRadius: '5px' }}>
                  ⚠️ Salto brusco detectado ({prevWeightNum} ➔ {weightNum} lbs).
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CONTROLES INFERIORES: AGREGAR SERIE, QUITAR SERIE Y REGISTRAR SENSACIONES */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '6px', width: '100%' }}>
        <button
          type="button"
          onClick={handleAddSet}
          style={{
            flex: 1,
            background: 'var(--bg-surface-secondary)',
            color: 'var(--accent-blue)',
            border: '1px solid var(--border-strong)',
            padding: '7px 4px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Plus size={12} /> + Serie
        </button>

        {totalSets > 1 && (
          <button
            type="button"
            onClick={handleRemoveSet}
            style={{
              background: 'var(--accent-red-subtle)',
              color: 'var(--accent-red)',
              border: '1px solid var(--accent-red)',
              padding: '7px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Minus size={12} /> Quitar
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsFeedbackModalOpen(true)}
          style={{
            flex: 1.2,
            background: hasFeedback ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-secondary)',
            color: hasFeedback ? '#a855f7' : 'var(--text-secondary)',
            border: hasFeedback ? '1px solid #a855f7' : '1px solid var(--border-strong)',
            padding: '7px 6px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          title="Registrar biofeedback medible de sensaciones y congestión"
        >
          <Sparkles size={12} color={hasFeedback ? '#a855f7' : 'var(--text-muted)'} />
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
        targetReps={prescribedReps}
        previousData={previousData}
        todayWorkoutData={exerciseData}
        machineConfig={machineConfig}
      />

      {/* MODAL DE CALIBRACIÓN DE MÁQUINA Y DISCOS */}
      <MachineConfigModal
        isOpen={isMachineConfigOpen}
        onClose={() => setIsMachineConfigOpen(false)}
        exerciseName={exercise.name}
        exerciseId={exercise.id}
        currentConfig={machineConfig}
        profiles={exerciseProfiles}
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
