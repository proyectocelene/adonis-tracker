import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, ChevronUp, ArrowUp, ArrowDown, Check, Clock, Info, 
  Plus, Minus, RotateCcw, Search, Video, Play, Square, Flame, MessageSquare, GripVertical 
} from 'lucide-react';
import { useModal } from './common/UIComponents';
import { unifyExerciseWithAI } from '../services/deepseek';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary';

const playLoudFinishBeep = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    [0, 0.25, 0.5].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + delay + 0.15);
      gain.gain.setValueAtTime(0.6, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.22);
    });
  } catch (e) {
    console.warn("Audio Context error:", e);
  }
};

export default function ExerciseRow({
  exercise,
  exerciseData = {},
  previousData = {},
  onUpdateSet,
  onUpdateExerciseMeta,
  onSwapExercise,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  initiallyExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand
}) {
  const modal = useModal();
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const [activeSubTab, setActiveSubTab] = useState('logger');
  const [machineSetupInput, setMachineSetupInput] = useState(exerciseData.machineSetup || '');
  const [exerciseNotesInput, setExerciseNotesInput] = useState(exerciseData.notes || '');
  const [isUnifying, setIsUnifying] = useState(false);
  const [apiKey] = useLocalStorage('coachv2_deepseek_apikey', '');

  // Estado del Gesto "Dejar Presionado" (Long Press Reorder Mode)
  const [isReorderMode, setIsReorderMode] = useState(false);
  const longPressTimerRef = useRef(null);

  const startLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      setIsReorderMode(true);
      if (navigator.vibrate) navigator.vibrate(60);
    }, 400); // 400ms para activar como launcher móvil
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
  };

  useEffect(() => {
    if (exerciseData.machineSetup !== undefined) {
      setMachineSetupInput(exerciseData.machineSetup);
    }
    if (exerciseData.notes !== undefined) {
      setExerciseNotesInput(exerciseData.notes);
    }
  }, [exerciseData.machineSetup, exerciseData.notes]);

  const totalSets = exerciseData.customSetsCount ? parseInt(exerciseData.customSetsCount) : (parseInt(exercise.sets) || 3);
  const targetReps = exercise.reps || '10-12';
  const restPrescribed = exercise.restTime || '90 s';
  const parsedRestSeconds = parseInt(restPrescribed) || 90;

  const [restTimerSeconds, setRestTimerSeconds] = useState(parsedRestSeconds);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (restTimerSeconds === 0 && isTimerActive) {
      setIsTimerActive(false);
      playLoudFinishBeep();
      if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 400]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTimerSeconds]);

  const handleStartTimer = () => {
    if (restTimerSeconds <= 0) setRestTimerSeconds(parsedRestSeconds);
    setIsTimerActive(true);
  };

  const handleStopTimer = () => {
    setIsTimerActive(false);
  };

  const handleResetTimer = () => {
    setRestTimerSeconds(parsedRestSeconds);
    setIsTimerActive(false);
  };

  const ensureMeta = () => {
    if (!exerciseData.name || !exerciseData.muscleGroup) {
      if (onUpdateExerciseMeta) {
        onUpdateExerciseMeta({
          name: exercise.name,
          muscleGroup: exercise.muscleGroup || 'General',
          customSetsCount: totalSets
        });
      }
    }
  };

  const handleSetChange = (setIndex, field, value) => {
    ensureMeta();
    const currentSet = exerciseData[setIndex] || { 
      weight: previousData[setIndex]?.weight || '', 
      reps: previousData[setIndex]?.reps || '', 
      rpe: previousData[setIndex]?.rpe || '8', 
      completed: false,
      unit: previousData[setIndex]?.unit || exercise.defaultUnit || 'lbs'
    };

    onUpdateSet(setIndex, {
      ...currentSet,
      [field]: value
    });
  };

  const toggleSetComplete = (setIndex) => {
    ensureMeta();
    const currentSet = exerciseData[setIndex] || { 
      weight: previousData[setIndex]?.weight || '', 
      reps: previousData[setIndex]?.reps || '', 
      rpe: previousData[setIndex]?.rpe || '8', 
      completed: false,
      unit: previousData[setIndex]?.unit || exercise.defaultUnit || 'lbs'
    };

    const newCompleted = !currentSet.completed;

    onUpdateSet(setIndex, {
      ...currentSet,
      completed: newCompleted,
      weight: currentSet.weight || previousData[setIndex]?.weight || '',
      reps: currentSet.reps || previousData[setIndex]?.reps || targetReps.split('-')[0] || '10'
    });

    if (newCompleted && !isTimerActive) {
      handleResetTimer();
      handleStartTimer();
    }
  };

  const handleAddSet = () => {
    const nextSetNumber = totalSets + 1;
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ customSetsCount: nextSetNumber });
    }
    const lastSet = exerciseData[totalSets] || previousData[totalSets] || {};
    const clonedSet = {
      weight: lastSet.weight || exerciseData[1]?.weight || '',
      reps: lastSet.reps || targetReps.split('-')[0] || '10',
      rpe: lastSet.rpe || '8',
      completed: false,
      unit: lastSet.unit || exercise.defaultUnit || 'lbs'
    };
    if (onUpdateSet) {
      onUpdateSet(nextSetNumber, clonedSet);
    }
    modal.showAlert({
      title: `➕ Serie #${nextSetNumber} Añadida`,
      message: `Se añadió la serie #${nextSetNumber} al ejercicio.`,
      variant: 'info'
    });
  };

  const handleRemoveSet = () => {
    if (totalSets <= 1) return;
    const newTotal = totalSets - 1;
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ customSetsCount: newTotal });
    }
  };

  const handleSaveMachineSetup = () => {
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ machineSetup: machineSetupInput });
      modal.showAlert({
        title: "✅ Calibración Guardada",
        message: `Los ajustes mecánicos ("${machineSetupInput || 'Sin anotación'}") se guardaron para sesiones futuras.`,
        variant: "success"
      });
    }
  };

  const handleSaveNotes = () => {
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ notes: exerciseNotesInput });
      modal.showAlert({
        title: "📝 Nota de Sensación Guardada",
        message: "Tu comentario fue registrado en el historial de la sesión.",
        variant: "success"
      });
    }
  };

  const handleExecuteSwap = async (candidateName) => {
    if (!candidateName) return;
    try {
      setIsUnifying(true);
      const unifiedRes = await unifyExerciseWithAI({
        apiKey,
        originalExerciseName: exercise.name,
        candidateName,
        muscleGroup: exercise.muscleGroup,
        currentWeight: previousData[1]?.weight || 80
      });

      if (onSwapExercise) {
        onSwapExercise(exercise.id, {
          name: candidateName,
          unifiedFunctionCode: unifiedRes.codigoFuncionUnificada,
          ratio: unifiedRes.ratioCargaRecomendada,
          originalName: exercise.name,
          biomechanics: unifiedRes.justificacionCientifica || exercise.biomechanics
        });
      }

      modal.showAlert({
        title: "🔄 Ejercicio Sustituido",
        message: `Se cambió a "${candidateName}". Peso predicho: ${unifiedRes.pesoPredicho || 'N/A'}.`,
        variant: "success"
      });
    } catch (err) {
      if (onSwapExercise) {
        onSwapExercise(exercise.id, { name: candidateName, originalName: exercise.name });
      }
    } finally {
      setIsUnifying(false);
    }
  };

  const completedSetsCount = (() => {
    let c = 0;
    for (let s = 1; s <= totalSets; s++) {
      if (exerciseData[s]?.completed) c++;
    }
    return c;
  })();

  const isFullyCompleted = completedSetsCount === totalSets && totalSets > 0;

  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(exercise.name + " ejecucion tecnica biomecanica")}`;
  const youtubeTutorialUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " como hacer tecnica correcta")}`;

  const warmupSetVal = exerciseData[0] || {};
  const isWarmupSetDone = !!warmupSetVal.completed;
  const suggestedWarmupWeight = Math.round((parseFloat(previousData[1]?.weight || 60) * 0.5) / 5) * 5 || 30;

  return (
    <div 
      className="card animate-fade"
      style={{
        padding: '0px',
        marginBottom: '14px',
        borderRadius: '24px',
        background: isFullyCompleted 
          ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: isReorderMode 
          ? '2.5px solid #6366f1' 
          : (isFullyCompleted ? '2.5px solid #10b981' : '2px solid #cbd5e1'),
        boxShadow: isReorderMode 
          ? '0 10px 30px rgba(99, 102, 241, 0.3)' 
          : (isFullyCompleted ? '0 8px 24px rgba(16, 185, 129, 0.18)' : '0 8px 24px rgba(15, 23, 42, 0.08)'),
        transition: 'all 0.25s ease'
      }}
    >
      {/* 1. CABECERA STICKY EN EL CELULAR: TITULO COMPLETO 100% ANCHO + GESTO DEJAR PRESIONADO */}
      <div 
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        style={{ 
          position: 'sticky', 
          top: '0px', 
          zIndex: 50, 
          background: isFullyCompleted ? '#f0fdf4' : '#ffffff', 
          padding: '12px 14px', 
          borderRadius: isExpanded ? '22px 22px 0 0' : '22px', 
          borderBottom: isExpanded ? '2px solid #cbd5e1' : 'none',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          userSelect: 'none'
        }}
      >
        {/* ICONO DE AGARRE O BOTÓN DE REORDENAR AL DEJAR PRESIONADO */}
        <button
          type="button"
          onClick={() => {
            setIsReorderMode(!isReorderMode);
            if (navigator.vibrate) navigator.vibrate(40);
          }}
          title="Mantén presionado para reordenar"
          style={{
            background: isReorderMode ? '#6366f1' : '#f1f5f9',
            color: isReorderMode ? '#ffffff' : '#64748b',
            border: 'none',
            borderRadius: '10px',
            padding: '6px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <GripVertical size={20} />
        </button>

        {/* NOMBRE DEL EJERCICIO A TODO EL ANCHO */}
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={onToggleExpand}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
            <strong style={{ fontSize: '15px', color: '#0f172a', fontWeight: '900', lineHeight: '1.3' }}>
              {exercise.name}
            </strong>
            {isFullyCompleted && (
              <span style={{ fontSize: '10px', background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
                ✓ Completo
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
              {exercise.muscleGroup || 'General'}
            </span>
            <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
              {completedSetsCount}/{totalSets} Series
            </span>
          </div>
        </div>

        {/* CHEVRON COMPACTO PARA EXPANDIR */}
        <button
          type="button"
          onClick={onToggleExpand}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            border: 'none',
            background: isExpanded ? '#0066ff' : '#f1f5f9',
            color: isExpanded ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s'
          }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* BARRA FLOTANTE DE REORDENAMIENTO (APARECE AL DEJAR PRESIONADO O TOCAR EL ICONO DE AGARRE) */}
      {isReorderMode && (
        <div className="animate-fade" style={{ background: '#6366f1', color: '#ffffff', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '900' }}>
            🔀 Reordenar Ejercicio:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              disabled={isFirst}
              onClick={() => {
                onMoveUp();
                if (navigator.vibrate) navigator.vibrate(30);
              }}
              style={{ background: isFirst ? 'rgba(255,255,255,0.3)' : '#ffffff', color: isFirst ? '#94a3b8' : '#4338ca', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowUp size={14} /> Mover Arriba
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => {
                onMoveDown();
                if (navigator.vibrate) navigator.vibrate(30);
              }}
              style={{ background: isLast ? 'rgba(255,255,255,0.3)' : '#ffffff', color: isLast ? '#94a3b8' : '#4338ca', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowDown size={14} /> Mover Abajo
            </button>
            <button
              type="button"
              onClick={() => setIsReorderMode(false)}
              style={{ background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}
            >
              ✓ Listo
            </button>
          </div>
        </div>
      )}

      {/* 2. CONTENIDO EXPANDIDO A 100% FULL-WIDTH SIN MARGENES MALGASTADOS */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '14px', width: '100%' }}>
          {/* NAVEGACIÓN DE MINI-PESTAÑAS INTERNAS A TODO EL ANCHO */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '16px', marginBottom: '12px', gap: '4px', width: '100%' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('logger')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'logger' ? 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)' : 'transparent',
                color: activeSubTab === 'logger' ? '#ffffff' : '#64748b',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'logger' ? '0 4px 10px rgba(0, 102, 255, 0.3)' : 'none'
              }}
            >
              📊 Series & Cargas
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('technique')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'technique' ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'transparent',
                color: activeSubTab === 'technique' ? '#ffffff' : '#64748b',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'technique' ? '0 4px 10px rgba(124, 58, 237, 0.3)' : 'none'
              }}
            >
              💡 Biomecánica
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('swap')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'swap' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'transparent',
                color: activeSubTab === 'swap' ? '#ffffff' : '#64748b',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'swap' ? '0 4px 10px rgba(5, 150, 105, 0.3)' : 'none'
              }}
            >
              🔄 Sustituir
            </button>
          </div>

          {/* SUBPESTAÑA 1: SERIES & CARGAS */}
          {activeSubTab === 'logger' && (
            <div style={{ width: '100%' }}>
              {/* TEMPORIZADOR DE DESCANSO CON ALARMA */}
              <div style={{
                background: isTimerActive ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#ffffff',
                color: isTimerActive ? '#ffffff' : '#0f172a',
                padding: '8px 12px',
                borderRadius: '14px',
                marginBottom: '10px',
                border: isTimerActive ? '1.5px solid #38bdf8' : '1.5px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                width: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color={isTimerActive ? '#38bdf8' : '#0066ff'} />
                  <span style={{ fontSize: '12px', fontWeight: '900' }}>
                    {isTimerActive ? `⏱️ ${restTimerSeconds}s Restantes` : `Descanso: ${restPrescribed}`}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isTimerActive ? (
                    <>
                      <button
                        type="button"
                        onClick={handleResetTimer}
                        title="Reiniciar temporizador"
                        style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '8px', padding: '5px 8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                      >
                        <RotateCcw size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={handleStopTimer}
                        title="Parar temporizador"
                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <Square size={12} fill="#fff" /> Parar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartTimer}
                      style={{ background: '#0066ff', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Play size={12} fill="#fff" /> Iniciar
                    </button>
                  )}
                </div>
              </div>

              {/* TABLA DE SERIES DE TRABAJO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', width: '100%' }}>
                
                {/* SERIE S0 (CALENTAMIENTO / APROXIMACIÓN) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '4px',
                  background: isWarmupSetDone ? '#fef3c7' : '#fffbeb',
                  padding: '8px',
                  borderRadius: '14px',
                  border: isWarmupSetDone ? '2px solid #f59e0b' : '1.5px dashed #f59e0b',
                  width: '100%'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', width: '32px', flexShrink: 0 }}>
                    <Flame size={13} color="#d97706" />
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#b45309' }}>S0</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', width: '65px', textAlign: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '8px', color: '#b45309', textTransform: 'uppercase', fontWeight: '800' }}>Calentamiento</span>
                    <strong style={{ fontSize: '11px', color: '#78350f', fontWeight: '800' }}>
                      ~{suggestedWarmupWeight}lbs
                    </strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <input
                      type="number"
                      placeholder="Peso"
                      value={warmupSetVal.weight ?? ''}
                      onChange={(e) => handleSetChange(0, 'weight', e.target.value)}
                      style={{
                        width: '56px',
                        padding: '6px 4px',
                        borderRadius: '8px',
                        border: '1.5px solid #f59e0b',
                        fontSize: '13px',
                        fontWeight: '900',
                        textAlign: 'center',
                        background: '#ffffff',
                        color: '#78350f'
                      }}
                    />
                    <span style={{ fontSize: '10px', color: '#b45309', fontWeight: '800' }}>lbs</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <input
                      type="number"
                      placeholder="Reps"
                      value={warmupSetVal.reps ?? ''}
                      onChange={(e) => handleSetChange(0, 'reps', e.target.value)}
                      style={{
                        width: '46px',
                        padding: '6px 4px',
                        borderRadius: '8px',
                        border: '1.5px solid #f59e0b',
                        fontSize: '13px',
                        fontWeight: '900',
                        textAlign: 'center',
                        background: '#ffffff',
                        color: '#78350f'
                      }}
                    />
                    <span style={{ fontSize: '10px', color: '#b45309', fontWeight: '800' }}>r</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSetComplete(0)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isWarmupSetDone ? '#f59e0b' : '#cbd5e1',
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

                {/* SERIES EFECTIVAS (S1, S2, S3...) */}
                {Array.from({ length: totalSets }).map((_, sIdx) => {
                  const setNum = sIdx + 1;
                  const setVal = exerciseData[setNum] || {};
                  const prevVal = previousData[setNum] || {};
                  const isDone = !!setVal.completed;

                  return (
                    <div
                      key={setNum}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '4px',
                        background: isDone ? '#dcfce7' : '#ffffff',
                        padding: '8px',
                        borderRadius: '14px',
                        border: isDone ? '2px solid #22c55e' : '1.5px solid #cbd5e1',
                        width: '100%'
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '900', color: isDone ? '#15803d' : '#0f172a', width: '32px', flexShrink: 0 }}>
                        S{setNum}
                      </span>

                      <div style={{ display: 'flex', flexDirection: 'column', width: '65px', textAlign: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>Previo</span>
                        <strong style={{ fontSize: '11px', color: '#475569', fontWeight: '800' }}>
                          {prevVal.weight ? `${prevVal.weight}${prevVal.unit || 'lbs'}` : `—`}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <input
                          type="number"
                          placeholder="Peso"
                          value={setVal.weight ?? ''}
                          onChange={(e) => handleSetChange(setNum, 'weight', e.target.value)}
                          style={{
                            width: '56px',
                            padding: '6px 4px',
                            borderRadius: '8px',
                            border: '1.5px solid #94a3b8',
                            fontSize: '13px',
                            fontWeight: '900',
                            textAlign: 'center',
                            background: '#ffffff',
                            color: '#0f172a'
                          }}
                        />
                        <span style={{ fontSize: '10px', color: '#475569', fontWeight: '800' }}>lbs</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <input
                          type="number"
                          placeholder="Reps"
                          value={setVal.reps ?? ''}
                          onChange={(e) => handleSetChange(setNum, 'reps', e.target.value)}
                          style={{
                            width: '46px',
                            padding: '6px 4px',
                            borderRadius: '8px',
                            border: '1.5px solid #94a3b8',
                            fontSize: '13px',
                            fontWeight: '900',
                            textAlign: 'center',
                            background: '#ffffff',
                            color: '#0f172a'
                          }}
                        />
                        <span style={{ fontSize: '10px', color: '#475569', fontWeight: '800' }}>r</span>
                      </div>

                      <select
                        value={setVal.rpe || '8'}
                        onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                        style={{
                          width: '64px',
                          flexShrink: 0,
                          padding: '6px 2px',
                          borderRadius: '8px',
                          border: setVal.rpe === '8' ? '1.5px solid #3b82f6' : '1.5px solid #cbd5e1',
                          fontSize: '11px',
                          fontWeight: '900',
                          textAlign: 'center',
                          background: setVal.rpe === '8' ? '#eff6ff' : '#ffffff',
                          color: setVal.rpe === '8' ? '#1d4ed8' : '#0f172a',
                          outline: 'none',
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

                      <button
                        type="button"
                        onClick={() => toggleSetComplete(setNum)}
                        style={{
                          width: '34px',
                          height: '34px',
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
                  );
                })}
              </div>

              {/* CONTROLES DE SERIES */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', width: '100%' }}>
                <button
                  type="button"
                  onClick={handleAddSet}
                  style={{
                    flex: 1,
                    background: '#eff6ff',
                    color: '#0066ff',
                    border: '1.5px solid #bfdbfe',
                    padding: '9px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={14} /> + Agregar Serie Extra
                </button>
                {totalSets > 1 && (
                  <button
                    type="button"
                    onClick={handleRemoveSet}
                    style={{
                      background: '#fef2f2',
                      color: '#ef4444',
                      border: '1.5px solid #fecaca',
                      padding: '9px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Minus size={14} /> Quitar
                  </button>
                )}
              </div>

              {/* CAJA DE NOTAS DEL EJERCICIO */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '14px', border: '1.5px solid #e2e8f0', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <MessageSquare size={15} color="#7c3aed" />
                  <label style={{ fontSize: '11px', color: '#4c1d95', fontWeight: '900' }}>
                    📝 Notas & Sensaciones de la Sesión:
                  </label>
                </div>
                <textarea
                  rows={2}
                  placeholder="Registra cómo te sentiste (ej. Buena fuerza en rep 8, la serie 3 cerca del fallo...)"
                  value={exerciseNotesInput}
                  onChange={(e) => setExerciseNotesInput(e.target.value)}
                  onBlur={handleSaveNotes}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: '#ffffff',
                    color: '#0f172a',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    style={{ background: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Guardar Comentario
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBPESTAÑA 2: BIOMECÁNICA & BUSCADORES */}
          {activeSubTab === 'technique' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
                <a
                  href={googleImagesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#f8fafc',
                    color: '#1e293b',
                    border: '1.5px solid #cbd5e1',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Search size={14} color="#0066ff" /> Buscar en Google Imágenes
                </a>
                <a
                  href={youtubeTutorialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#fef2f2',
                    color: '#991b1b',
                    border: '1.5px solid #fecaca',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Video size={14} color="#dc2626" /> Tutorial en YouTube
                </a>
              </div>

              {exercise.warmup && (
                <div style={{ background: '#fffbeb', border: '1.5px solid #f59e0b', padding: '10px 12px', borderRadius: '14px', fontSize: '12px', color: '#78350f', fontWeight: '600', width: '100%' }}>
                  <strong style={{ color: '#b45309', display: 'block', marginBottom: '2px', fontWeight: '900' }}>
                    Guía de Calentamiento:
                  </strong>
                  {exercise.warmup}
                </div>
              )}

              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '14px', border: '1.5px solid #e2e8f0', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Info size={14} color="#7c3aed" />
                  <strong style={{ fontSize: '12px', color: '#4c1d95', fontWeight: '900' }}>Biomecánica & IAP:</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.5', fontWeight: '600' }}>
                  {exercise.biomechanics || 'Control de la fase excéntrica con respiración rítmica anti-hernia.'}
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '14px', border: '1.5px solid #cbd5e1', width: '100%' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#0f172a', fontWeight: '900' }}>
                  ⚙️ Calibración de Máquina:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Ej. Asiento en hoyo 4, polea baja..."
                    value={machineSetupInput}
                    onChange={(e) => setMachineSetupInput(e.target.value)}
                    style={{ flex: 1, padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '12px', fontWeight: '700' }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveMachineSetup}
                    style={{ background: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBPESTAÑA 3: SUSTITUIR EJERCICIO */}
          {activeSubTab === 'swap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <span style={{ fontSize: '11px', color: '#334155', fontWeight: '800' }}>
                Sustitutos equivalentes de la base de datos oficial:
              </span>

              {exercise.equivalents && exercise.equivalents.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  {exercise.equivalents.map(eq => (
                    <button
                      key={eq.id}
                      type="button"
                      disabled={isUnifying}
                      onClick={() => handleExecuteSwap(eq.name)}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #10b981',
                        borderRadius: '12px',
                        padding: '8px 10px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%'
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '12px', color: '#065f46', fontWeight: '900' }}>{eq.name}</strong>
                        <span style={{ fontSize: '10px', color: '#475569' }}>{eq.desc}</span>
                      </div>
                      <span className="badge badge-green" style={{ fontSize: '10px', flexShrink: 0, fontWeight: '900' }}>Sustituir</span>
                    </button>
                  ))}
                </div>
              )}

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '14px', border: '1.5px solid #e2e8f0', width: '100%' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#0f172a', fontWeight: '900' }}>
                  O elige cualquier máquina del catálogo unificado:
                </label>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      const item = UNIFIED_EXERCISE_LIBRARY.find(x => x.id === e.target.value);
                      if (item) handleExecuteSwap(item.name);
                    }
                  }}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '12px', fontWeight: '800', background: '#ffffff' }}
                >
                  <option value="">👆 Seleccionar máquina oficial...</option>
                  {UNIFIED_EXERCISE_LIBRARY.map(item => (
                    <option key={item.id} value={item.id}>
                      [{item.muscleGroup}] • {item.name} ({item.equipment})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
