import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, ChevronUp, ArrowUp, ArrowDown, GripVertical, Target 
} from 'lucide-react';
import { useModal } from './common/UIComponents';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';
import RestTimer from './exercise/RestTimer';
import SetLogger from './exercise/SetLogger';
import SwapExercise from './exercise/SwapExercise';
import ExerciseBiomechanics from './exercise/ExerciseBiomechanics';
import ExerciseNotes from './exercise/ExerciseNotes';

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

  const [isReorderMode, setIsReorderMode] = useState(false);
  const longPressTimerRef = useRef(null);

  const startLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      setIsReorderMode(true);
      if (navigator.vibrate) navigator.vibrate(60);
    }, 400);
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

    if (newCompleted) {
      stopTimer();
      startTimer(parsedRestSeconds, exercise.name);
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
    if (onUpdateSet) onUpdateSet(nextSetNumber, clonedSet);
    modal.showAlert({ title: `➕ Serie #${nextSetNumber} Añadida`, message: `Se añadió la serie #${nextSetNumber}.`, variant: 'info' });
  };

  const handleRemoveSet = () => {
    if (totalSets <= 1) return;
    if (onUpdateExerciseMeta) onUpdateExerciseMeta({ customSetsCount: totalSets - 1 });
  };

  const handleSaveMachineSetup = () => {
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ machineSetup: machineSetupInput });
      modal.showAlert({ title: "✅ Calibración Guardada", message: `Ajustes mecánicos guardados.`, variant: "success" });
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
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ 
        notes: exerciseNotesInput.trim(),
        notesHistory: [newNoteObj, ...existingHistory]
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

  const handleExecuteSwap = async (candidateName) => {
    if (!candidateName) return;
    if (onSwapExercise) {
      onSwapExercise(exercise.id, {
        name: candidateName,
        originalName: exercise.name,
        biomechanics: exercise.biomechanics
      });
    }
    modal.showAlert({ title: "🔄 Ejercicio Sustituido", message: `Se cambió a "${candidateName}".`, variant: "success" });
  };

  const legacyNoteList = exerciseData.notes && (!exerciseData.notesHistory || exerciseData.notesHistory.length === 0)
    ? [{ id: 'legacy', date: 'Sesión Actual', text: exerciseData.notes }]
    : [];
  const allNotesList = [...(exerciseData.notesHistory || []), ...legacyNoteList];

  const completedSetsCount = (() => {
    let c = 0;
    for (let s = 1; s <= totalSets; s++) { if (exerciseData[s]?.completed) c++; }
    return c;
  })();

  const isFullyCompleted = completedSetsCount === totalSets && totalSets > 0;
  const warmupSetVal = exerciseData[0] || {};
  const isWarmupSetDone = !!warmupSetVal.completed;
  const suggestedWarmupWeight = Math.round((parseFloat(previousData[1]?.weight || 60) * 0.5) / 5) * 5 || 30;

  return (
    <div 
      className={`mb-3 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 ${
        isReorderMode ? 'border-indigo-500 ring-2 ring-indigo-500/30' : ''
      }`}
    >
      {/* 1. CABECERA DEL EJERCICIO */}
      <div 
        onTouchStart={startLongPress} onTouchEnd={cancelLongPress} onTouchMove={cancelLongPress}
        onMouseDown={startLongPress} onMouseUp={cancelLongPress} onMouseLeave={cancelLongPress}
        className="p-3 flex items-center justify-between gap-2.5 bg-white border-b border-slate-100 select-none"
      >
        <button
          type="button"
          onClick={() => { setIsReorderMode(!isReorderMode); if (navigator.vibrate) navigator.vibrate(40); }}
          className={`shrink-0 p-1.5 rounded-lg border-none cursor-pointer flex items-center justify-center ${
            isReorderMode ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
          }`}
        >
          <GripVertical size={18} />
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <strong className="text-base text-slate-800 font-bold leading-tight">
              {exercise.name}
            </strong>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] bg-slate-100 text-slate-600 py-0.5 px-2 rounded-md font-medium">
              {exercise.muscleGroup || 'General'}
            </span>
            {exercise.loadFamily && (
              <span className="text-[11px] bg-slate-100 text-slate-600 py-0.5 px-2 rounded-md font-medium">
                {exercise.loadFamily.replace('Familia ', '')}
              </span>
            )}
            <span className="text-[11px] border border-slate-200 text-slate-700 py-0.5 px-2 rounded-md font-semibold">
              {totalSets}x{targetReps}
            </span>
            <span className={`text-[11px] py-0.5 px-2 rounded-md font-semibold ${isFullyCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>
              {completedSetsCount}/{totalSets} {isFullyCompleted ? '✓' : ''}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleExpand}
          className={`w-9 h-9 shrink-0 rounded-full border-none flex items-center justify-center cursor-pointer transition-colors ${
            isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
          }`}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* BARRA FLOTANTE DE REORDENAMIENTO */}
      {isReorderMode && (
        <div className="bg-indigo-500 text-white p-2.5 flex items-center justify-between gap-2 animate-fade">
          <span className="text-xs font-black">🔀 Reordenar:</span>
          <div className="flex gap-1.5">
            <button
              disabled={isFirst} onClick={() => { onMoveUp(); if (navigator.vibrate) navigator.vibrate(30); }}
              className={`border-none rounded-lg py-1.5 px-3 text-xs font-black cursor-pointer flex items-center gap-1 ${isFirst ? 'bg-white/30 text-slate-300' : 'bg-white text-indigo-700'}`}
            >
              <ArrowUp size={14} /> Arriba
            </button>
            <button
              disabled={isLast} onClick={() => { onMoveDown(); if (navigator.vibrate) navigator.vibrate(30); }}
              className={`border-none rounded-lg py-1.5 px-3 text-xs font-black cursor-pointer flex items-center gap-1 ${isLast ? 'bg-white/30 text-slate-300' : 'bg-white text-indigo-700'}`}
            >
              <ArrowDown size={14} /> Abajo
            </button>
            <button
              onClick={() => setIsReorderMode(false)}
              className="bg-green-500 text-white border-none rounded-lg py-1.5 px-3 text-xs font-black cursor-pointer"
            >
              ✓ Listo
            </button>
          </div>
        </div>
      )}

      {/* 2. CONTENIDO EXPANDIDO */}
      {isExpanded && (
        <div className="p-3.5 w-full animate-fade">
          {/* NAVEGACIÓN DE PESTAÑAS */}
          <div className="flex border-b border-slate-200 mb-4 w-full">
            <button
              onClick={() => setActiveSubTab('logger')}
              className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-colors ${activeSubTab === 'logger' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Series
            </button>
            <button
              onClick={() => setActiveSubTab('technique')}
              className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-colors ${activeSubTab === 'technique' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Bioméc.
            </button>
            <button
              onClick={() => setActiveSubTab('swap')}
              className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-colors ${activeSubTab === 'swap' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Sustituir
            </button>
          </div>

          {activeSubTab === 'logger' && (
            <div className="w-full">
              <RestTimer exerciseName={exercise.name} parsedRestSeconds={parsedRestSeconds} />
              
              <SetLogger 
                exerciseData={exerciseData} previousData={previousData} exercise={exercise} 
                totalSets={totalSets} targetReps={targetReps} suggestedWarmupWeight={suggestedWarmupWeight} 
                warmupSetVal={warmupSetVal} isWarmupSetDone={isWarmupSetDone} handleSetChange={handleSetChange} 
                toggleSetComplete={toggleSetComplete} handleAddSet={handleAddSet} handleRemoveSet={handleRemoveSet} 
              />
              
              <ExerciseNotes 
                exerciseNotesInput={exerciseNotesInput} setExerciseNotesInput={setExerciseNotesInput} 
                handleSaveNotes={handleSaveNotes} allNotesList={allNotesList} handleDeleteNote={handleDeleteNote} 
              />
            </div>
          )}

          {activeSubTab === 'technique' && (
            <ExerciseBiomechanics 
              exercise={exercise} totalSets={totalSets} targetReps={targetReps} restPrescribed={restPrescribed} 
              machineSetupInput={machineSetupInput} setMachineSetupInput={setMachineSetupInput} 
              handleSaveMachineSetup={handleSaveMachineSetup} 
            />
          )}

          {activeSubTab === 'swap' && (
            <SwapExercise 
              exercise={exercise} onSwapExercise={onSwapExercise} handleExecuteSwap={handleExecuteSwap} modal={modal} 
            />
          )}
        </div>
      )}
    </div>
  );
}
