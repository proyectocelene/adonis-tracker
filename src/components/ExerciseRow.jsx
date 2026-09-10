import React, { useState, useEffect, useRef } from 'react';
import { useModal } from './common/UIComponents';
import ExerciseHeader from './exercise/ExerciseHeader';
import RestTimer from './exercise/RestTimer';
import SetLogger from './exercise/SetLogger';
import ExerciseNotes from './exercise/ExerciseNotes';
import ExerciseBiomechanics from './exercise/ExerciseBiomechanics';
import ExerciseSwap from './exercise/ExerciseSwap';
import { calculateSmartWarmup, getLoadRecommendation } from '../hooks/useWorkoutCalculations';
import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary';

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
  isDeferred = false,
  onDeferExercise,
  isSkipped = false,
  skipReason = '',
  onSkipExercise,
  workoutHistory = [],
  todayWorkoutData = {},
  initiallyExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand
}) {

  const modal = useModal();
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  if (isSkipped) {
    return (
      <div style={{
        background: '#f8fafc',
        border: '1.5px dashed #cbd5e1',
        borderRadius: '20px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '10px',
        opacity: 0.85
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10.5px', background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: '6px', fontWeight: '900' }}>
              ⏭️ Omitido
            </span>
            <strong style={{ fontSize: '13px', color: '#475569', textDecoration: 'line-through' }}>
              {exercise.name}
            </strong>
          </div>
          <span style={{ fontSize: '10px', color: '#d97706', fontWeight: '700' }}>
            Motivo: {skipReason || 'Máquina no disponible o descompuesta'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSkipExercise && onSkipExercise(exercise.id, null)}
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '10px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: '800',
            color: '#0f172a',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          ↺ Deshacer
        </button>
      </div>
    );
  }

  const [activeSubTab, setActiveSubTab] = useState('logger');
  const [machineSetupInput, setMachineSetupInput] = useState(exerciseData.machineSetup || '');
  const [exerciseNotesInput, setExerciseNotesInput] = useState('');

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
  }, [exerciseData.machineSetup]);

  const totalSets = exerciseData.customSetsCount ? parseInt(exerciseData.customSetsCount) : (parseInt(exercise.sets) || 3);
  const targetReps = exercise.reps || '10-12';
  const restPrescribed = exercise.restTime || '90 s';
  const parsedRestSeconds = parseInt(restPrescribed) || 90;
  
  const effectiveRestSeconds = exerciseData.customRestSeconds ? parseInt(exerciseData.customRestSeconds) : parsedRestSeconds;

  const ensureMeta = () => {
    if (!exerciseData.name || !exerciseData.muscleGroup) {
      if (onUpdateExerciseMeta) {
        onUpdateExerciseMeta({
          name: exercise.name,
          muscleGroup: exercise.muscleGroup || 'General',
          customSetsCount: totalSets,
          customRestSeconds: effectiveRestSeconds
        });
      }
    }
  };

  const handleSetChange = (setIndex, fieldOrObj, value) => {
    ensureMeta();
    const currentSet = exerciseData[setIndex] || { 
      weight: '', 
      reps: '', 
      repsL: '',
      repsR: '',
      weightL: '',
      weightR: '',
      rpe: '8', 
      completed: false,
      unit: exercise.defaultUnit || 'lbs'
    };

    if (typeof fieldOrObj === 'object') {
      onUpdateSet(setIndex, {
        ...currentSet,
        ...fieldOrObj
      });
    } else {
      onUpdateSet(setIndex, {
        ...currentSet,
        [fieldOrObj]: value
      });
    }
  };

  const toggleSetComplete = (setIndex) => {
    ensureMeta();
    const isStrictlyBilateral = /barra|smith|prensa|leg press|squat con barra|bench press con barra/i.test(exercise?.name || '');
    const isUnilateral = !isStrictlyBilateral && (!!exerciseData.isUnilateral || !!exercise.isUnilateral);
    const currentSet = exerciseData[setIndex] || { 
      weight: previousData[setIndex]?.weight || '', 
      reps: previousData[setIndex]?.reps || '', 
      repsL: isUnilateral ? (previousData[setIndex]?.repsL || '') : undefined,
      repsR: isUnilateral ? (previousData[setIndex]?.repsR || '') : undefined,
      weightL: previousData[setIndex]?.weightL || '',
      weightR: previousData[setIndex]?.weightR || '',
      rpe: previousData[setIndex]?.rpe || '8', 
      completed: false,
      unit: previousData[setIndex]?.unit || exercise.defaultUnit || 'lbs'
    };

    const newCompleted = !currentSet.completed;

    let finalReps = currentSet.reps || previousData[setIndex]?.reps || targetReps.split('-')[0] || '10';
    if (isUnilateral && (currentSet.repsL || currentSet.repsR)) {
      finalReps = Math.max(parseFloat(currentSet.repsL) || 0, parseFloat(currentSet.repsR) || 0) || finalReps;
    }
    const finalWeight = currentSet.weight || previousData[setIndex]?.weight || '';

    onUpdateSet(setIndex, {
      ...currentSet,
      completed: newCompleted,
      weight: finalWeight,
      reps: String(finalReps)
    });

    // AUTOCOMPLETADO INTELIGENTE:
    // Al completar la serie N (para N >= 1), si la serie N+1 está vacía, prellenarla con la misma carga y repeticiones.
    if (newCompleted && setIndex >= 1 && setIndex < totalSets) {
      const nextIndex = setIndex + 1;
      const nextSet = exerciseData[nextIndex];
      const isNextEmpty = !nextSet || (!nextSet.weight && !nextSet.reps && !nextSet.completed);
      if (isNextEmpty && onUpdateSet) {
        onUpdateSet(nextIndex, {
          weight: finalWeight,
          reps: String(finalReps),
          ...(isUnilateral ? { repsL: currentSet.repsL || '', repsR: currentSet.repsR || '' } : {}),
          rpe: currentSet.rpe || '8',
          completed: false,
          unit: currentSet.unit || exercise.defaultUnit || 'lbs'
        });
      }
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
    }
  };

  const handleSaveNotes = () => {
    if (!exerciseNotesInput || !exerciseNotesInput.trim()) return;
    ensureMeta();
    const existingHistory = exerciseData.notesHistory || [];
    const newNoteObj = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      text: exerciseNotesInput.trim()
    };
    const updatedHistory = [newNoteObj, ...existingHistory];

    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ 
        notes: exerciseNotesInput.trim(),
        notesHistory: updatedHistory
      });
      setExerciseNotesInput('');
    }
  };

  const handleDeleteNote = (noteId) => {
    const existingHistory = exerciseData.notesHistory || [];
    const updatedHistory = existingHistory.filter(n => n.id !== noteId);
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({
        notesHistory: updatedHistory,
        notes: updatedHistory.length > 0 ? updatedHistory[0].text : ''
      });
    }
  };

  const legacyNoteList = exerciseData.notes && (!exerciseData.notesHistory || exerciseData.notesHistory.length === 0)
    ? [{ id: 'legacy', date: 'Sesión Actual', text: exerciseData.notes }]
    : [];
  const allNotesList = [...(exerciseData.notesHistory || []), ...legacyNoteList];

  const handleExecuteSwap = async (candidate) => {
    if (!candidate) return;
    const candidateObj = typeof candidate === 'object' ? candidate : { name: candidate };
    
    // Buscar la metadata completa del sustituto en equivalentes o en la biblioteca oficial
    let fullCandidate = { ...candidateObj };
    const matchEq = (exercise.equivalents || []).find(eq => eq.name === fullCandidate.name || eq.id === fullCandidate.id);
    if (matchEq) {
      fullCandidate = { ...matchEq, ...fullCandidate };
    } else {
      const matchLib = UNIFIED_EXERCISE_LIBRARY.find(x => x.name === fullCandidate.name || x.id === fullCandidate.id);
      if (matchLib) {
        fullCandidate = { ...matchLib, ...fullCandidate };
      }
    }

    try {
      if (onSwapExercise) {
        onSwapExercise(exercise.id, {
          name: fullCandidate.name,
          originalName: exercise.originalName || exercise.name,
          biomechanics: fullCandidate.biomechanics || '',
          mindMuscle: fullCandidate.mindMuscle || null,
          warmup: fullCandidate.warmup || '',
          muscleGroup: fullCandidate.muscleGroup || exercise.muscleGroup,
          equipment: fullCandidate.equipment || exercise.equipment,
          sets: fullCandidate.defaultSets || exercise.sets || 3,
          reps: fullCandidate.defaultReps || exercise.reps || '10-12',
          restTime: fullCandidate.defaultRest || exercise.restTime || '90 s',
          searchQuery: fullCandidate.searchQuery || `${fullCandidate.name} tecnica biomecanica`,
          loadFamily: fullCandidate.loadFamily || exercise.loadFamily,
          equivalents: fullCandidate.equivalents || exercise.equivalents || []
        });
      }
      setActiveSubTab('logger');
    } catch (err) {
      console.error('Error swapping exercise:', err);
      if (onSwapExercise) {
        onSwapExercise(exercise.id, { name: fullCandidate.name, originalName: exercise.name });
      }
      setActiveSubTab('logger');
    }
  };

  const handlePromptSkip = () => {
    modal.showConfirm({
      title: "¿Omitir este ejercicio hoy?",
      message: `Puedes omitir "${exercise.name}" si todas las máquinas están descompuestas, ocupadas o por molestia articular.\n\nNo penalizará tu consistencia ni racha del heatmap.\n\n¿Marcar como omitido por hoy?`,
      confirmText: "Sí, Omitir",
      cancelText: "Volver",
      variant: "warning",
      onConfirm: () => {
        if (onSkipExercise) {
          onSkipExercise(exercise.id, 'Máquina no disponible o descompuesta');
        }
      }
    });
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
  const suggestedWarmupWeight = calculateSmartWarmup(previousData, exerciseData, 60);
  const loadRecommendation = getLoadRecommendation(targetReps, previousData);

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
      <ExerciseHeader
        exercise={exercise}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        isFullyCompleted={isFullyCompleted}
        totalSets={totalSets}
        targetReps={targetReps}
        completedSetsCount={completedSetsCount}
        isReorderMode={isReorderMode}
        setIsReorderMode={setIsReorderMode}
        startLongPress={startLongPress}
        cancelLongPress={cancelLongPress}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}
        isDeferred={isDeferred}
        onDeferExercise={onDeferExercise}
      />


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
              💡 Info
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
            <button
              type="button"
              onClick={handlePromptSkip}
              style={{
                padding: '8px 10px',
                border: 'none',
                borderRadius: '12px',
                background: '#f8fafc',
                color: '#64748b',
                fontWeight: '900',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
              title="Marcar si no hiciste el ejercicio o la máquina está ocupada/descompuesta"
            >
              ⏭️ Omitir
            </button>
          </div>

          {/* SUBPESTAÑA 1: SERIES & CARGAS (OPTIMIZADA) */}
          {activeSubTab === 'logger' && (
            <div style={{ width: '100%' }}>
              {/* TABLA DE SERIES DE TRABAJO */}
              <SetLogger
                exercise={exercise}
                exerciseData={exerciseData}
                previousData={previousData}
                totalSets={totalSets}
                suggestedWarmupWeight={suggestedWarmupWeight}
                isWarmupSetDone={isWarmupSetDone}
                loadRecommendation={loadRecommendation}
                handleSetChange={handleSetChange}
                toggleSetComplete={toggleSetComplete}
                handleAddSet={handleAddSet}
                handleRemoveSet={handleRemoveSet}
                onUpdateExerciseMeta={onUpdateExerciseMeta}
              />
            </div>
          )}

          {/* SUBPESTAÑA 2: INFO, BIOMECÁNICA & NOTAS */}
          {activeSubTab === 'technique' && (
            <ExerciseBiomechanics
              exercise={exercise}
              totalSets={totalSets}
              targetReps={targetReps}
              restPrescribed={restPrescribed}
              googleImagesUrl={googleImagesUrl}
              youtubeTutorialUrl={youtubeTutorialUrl}
              machineSetupInput={machineSetupInput}
              setMachineSetupInput={setMachineSetupInput}
              handleSaveMachineSetup={handleSaveMachineSetup}
              allNotesList={allNotesList}
              exerciseNotesInput={exerciseNotesInput}
              setExerciseNotesInput={setExerciseNotesInput}
              handleSaveNotes={handleSaveNotes}
              handleDeleteNote={handleDeleteNote}
              workoutHistory={workoutHistory}
              todayWorkoutData={todayWorkoutData}
              machineConfig={exerciseData.machineConfig}
            />
          )}

          {/* SUBPESTAÑA 3: SUSTITUIR EJERCICIO */}
          {activeSubTab === 'swap' && (
            <ExerciseSwap
              exercise={exercise}
              onSwapExercise={onSwapExercise}
              handleExecuteSwap={handleExecuteSwap}
              modal={modal}
            />
          )}
        </div>
      )}
    </div>
  );
}
