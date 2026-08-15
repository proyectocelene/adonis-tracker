import React, { useState, useEffect, useRef } from 'react';
import { useModal } from './common/UIComponents';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';
import ExerciseHeader from './exercise/ExerciseHeader';
import RestTimer from './exercise/RestTimer';
import SetLogger from './exercise/SetLogger';
import ExerciseNotes from './exercise/ExerciseNotes';
import ExerciseBiomechanics from './exercise/ExerciseBiomechanics';
import ExerciseSwap from './exercise/ExerciseSwap';
import { calculateSmartWarmup, getLoadRecommendation } from '../hooks/useWorkoutCalculations';

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
  const { startTimer, stopTimer } = useGlobalTimer();
  
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

    if (newCompleted) {
      stopTimer();
      startTimer(effectiveRestSeconds, exercise.name);
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
      modal.showAlert({
        title: "📝 Nota Guardada",
        message: "Tu nota fue guardada en el historial de este ejercicio sin alterar tus series.",
        variant: "success"
      });
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
      modal.showAlert({
        title: "🗑️ Nota Eliminada",
        message: "La nota fue eliminada del historial.",
        variant: "info"
      });
    }
  };

  const legacyNoteList = exerciseData.notes && (!exerciseData.notesHistory || exerciseData.notesHistory.length === 0)
    ? [{ id: 'legacy', date: 'Sesión Actual', text: exerciseData.notes }]
    : [];
  const allNotesList = [...(exerciseData.notesHistory || []), ...legacyNoteList];

  const handleExecuteSwap = async (candidateName) => {
    if (!candidateName) return;
    try {
      if (onSwapExercise) {
        onSwapExercise(exercise.id, {
          name: candidateName,
          originalName: exercise.name,
          biomechanics: exercise.biomechanics
        });
      }

      modal.showAlert({
        title: "🔄 Ejercicio Sustituido",
        message: `Se cambió a "${candidateName}".`,
        variant: "success"
      });
    } catch (err) {
      if (onSwapExercise) {
        onSwapExercise(exercise.id, { name: candidateName, originalName: exercise.name });
      }
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
              {/* TEMPORIZADOR DE DESCANSO CON ALARMA Y SELECTOR */}
              <RestTimer
                exercise={exercise}
                effectiveRestSeconds={effectiveRestSeconds}
                totalSets={totalSets}
                onUpdateExerciseMeta={onUpdateExerciseMeta}
              />

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
              />

              {/* HISTORIAL Y REGISTRO DE NOTAS TÉCNICAS */}
              <ExerciseNotes
                allNotesList={allNotesList}
                exerciseNotesInput={exerciseNotesInput}
                setExerciseNotesInput={setExerciseNotesInput}
                handleSaveNotes={handleSaveNotes}
                handleDeleteNote={handleDeleteNote}
              />
            </div>
          )}

          {/* SUBPESTAÑA 2: BIOMECÁNICA & PRESCRIPCIÓN ÓPTIMA */}
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
