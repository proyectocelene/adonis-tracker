import React, { useState, useMemo, useCallback } from 'react';
import { 
  analyzeExercisePerformance, 
  isExerciseUnilateral 
} from '../../hooks/useWorkoutCalculations';
import { 
  getWarmupPlan, 
  isStrictlyBilateralExercise, 
  EMPTY_OBJECT, 
  EMPTY_ARRAY 
} from '../../utils/setLoggerHelpers';
import { useSetLoggerMachineConfig } from '../../hooks/exercise/useSetLoggerMachineConfig';
import SetLoggerHeader from './setlogger/SetLoggerHeader';
import SetLoggerWarmup from './setlogger/SetLoggerWarmup';
import SetLoggerTargetBanners from './setlogger/SetLoggerTargetBanners';
import SetRow from './setlogger/SetRow';
import SetLoggerFooter from './setlogger/SetLoggerFooter';
import SetLoggerModals from './setlogger/SetLoggerModals';

export default function SetLogger({
  exercise,
  exerciseData = EMPTY_OBJECT,
  previousData = EMPTY_OBJECT,
  totalSets,
  suggestedWarmupWeight,
  _isWarmupSetDone,
  loadRecommendation,
  handleSetChange,
  toggleSetComplete,
  handleAddSet,
  handleRemoveSet,
  onUpdateExerciseMeta,
  workoutHistory = EMPTY_ARRAY,
  isDeloadMode = false
}) {
  const [unlockedDeloadSets, setUnlockedDeloadSets] = useState(EMPTY_OBJECT);

  // Clasificación biomecánica inteligente (unilateral vs bilateral)
  const explicitUnilateral = exerciseData?.isUnilateral;
  const isUnilateral = useMemo(() => {
    return isExerciseUnilateral(exercise, { isUnilateral: explicitUnilateral });
  }, [exercise, explicitUnilateral]);

  // Biomecánicamente bilateral rígido (barra recta, barra Z, smith, prensa, etc.)
  const isStrictlyBilateral = useMemo(() => {
    return isStrictlyBilateralExercise(exercise);
  }, [exercise]);

  const prescribedReps = exercise?.reps || exercise?.targetReps || '10-12';

  const [isMachineConfigOpen, setIsMachineConfigOpen] = useState(false);

  // Hook desacoplado de máquina y perfiles (sin duplicar listeners useSyncedStore)
  const {
    machineConfig,
    exerciseProfiles,
    handleSaveMachineConfig,
    handleSelectMachineProfile
  } = useSetLoggerMachineConfig({
    exercise,
    exerciseData,
    previousData,
    workoutHistory,
    onUpdateExerciseMeta,
    onOpenNewMachineConfig: () => setIsMachineConfigOpen(true)
  });

  const [plateModal, setPlateModal] = useState({ isOpen: false, setNum: null, currentWeight: 0 });
  const [isScienceModalOpen, setIsScienceModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [manualWarmupOpen, setManualWarmupOpen] = useState(false);

  const coachAnalysis = analyzeExercisePerformance(previousData, prescribedReps, machineConfig);
  const warmupPlan = getWarmupPlan(exercise, previousData, exerciseData, machineConfig, coachAnalysis);
  const shouldRenderWarmup = warmupPlan.requiresWarmup || manualWarmupOpen;

  const currentFeedback = exerciseData.feedback || null;
  const hasFeedback = !!currentFeedback && Object.keys(currentFeedback).length > 0;

  const prevLocation = previousData.machineConfig?.floor || previousData.machineConfig?.station || previousData.machineLocation || '';
  const currentLocation = machineConfig?.floor || machineConfig?.station || '';
  const isFloorMismatch = Boolean(prevLocation && currentLocation && prevLocation.toLowerCase() !== currentLocation.toLowerCase());

  const handleSanitizedChange = useCallback((setIndex, fieldOrObj, value) => {
    if (typeof fieldOrObj === 'object') {
      handleSetChange(setIndex, fieldOrObj);
      return;
    }
    handleSetChange(setIndex, fieldOrObj, value);
  }, [handleSetChange]);

  const handleSaveFeedback = useCallback((feedbackData) => {
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ feedback: feedbackData });
    }
  }, [onUpdateExerciseMeta]);

  return (
    <>
      {/* 1. BARRA SUPERIOR: TOGGLE BILATERAL/UNILATERAL, PERFILES DE MÁQUINA Y CHIP DE COACH */}
      <SetLoggerHeader
        isStrictlyBilateral={isStrictlyBilateral}
        isUnilateral={isUnilateral}
        onUpdateExerciseMeta={onUpdateExerciseMeta}
        machineConfig={machineConfig}
        exerciseProfiles={exerciseProfiles}
        exercise={exercise}
        handleSelectMachineProfile={handleSelectMachineProfile}
        setIsMachineConfigOpen={setIsMachineConfigOpen}
        coachAnalysis={coachAnalysis}
        setIsScienceModalOpen={setIsScienceModalOpen}
      />

      {/* 2. SERIES DE CALENTAMIENTO ORGANIZADAS */}
      <SetLoggerWarmup
        isFloorMismatch={isFloorMismatch}
        currentLocation={currentLocation}
        prevLocation={prevLocation}
        shouldRenderWarmup={shouldRenderWarmup}
        warmupPlan={warmupPlan}
        suggestedWarmupWeight={suggestedWarmupWeight}
        exerciseData={exerciseData}
        exercise={exercise}
        handleSanitizedChange={handleSanitizedChange}
        setPlateModal={setPlateModal}
        toggleSetComplete={toggleSetComplete}
        setManualWarmupOpen={setManualWarmupOpen}
      />

      {/* 3. BANNERS: META DEL COACH Y MODO DELOAD */}
      <SetLoggerTargetBanners
        coachAnalysis={coachAnalysis}
        setIsScienceModalOpen={setIsScienceModalOpen}
        isDeloadMode={isDeloadMode}
      />

      {/* 4. TABLA DE SERIES DE TRABAJO EFECTIVAS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px', width: '100%' }}>
        {Array.from({ length: totalSets }).map((_, sIdx) => {
          const setNum = sIdx + 1;
          const setVal = exerciseData[setNum] || {};
          const prevVal = previousData[setNum] || {};

          return (
            <SetRow
              key={setNum}
              setNum={setNum}
              sIdx={sIdx}
              exercise={exercise}
              setVal={setVal}
              prevVal={prevVal}
              isUnilateral={isUnilateral}
              isDeloadMode={isDeloadMode}
              unlockedDeloadSets={unlockedDeloadSets}
              setUnlockedDeloadSets={setUnlockedDeloadSets}
              prescribedReps={prescribedReps}
              machineConfig={machineConfig}
              exerciseData={exerciseData}
              previousData={previousData}
              prevLocation={prevLocation}
              handleSanitizedChange={handleSanitizedChange}
              handleSetChange={handleSetChange}
              toggleSetComplete={toggleSetComplete}
              setPlateModal={setPlateModal}
            />
          );
        })}
      </div>

      {/* 5. CONTROLES INFERIORES: AGREGAR SERIE, QUITAR SERIE Y SENSACIONES */}
      <SetLoggerFooter
        handleAddSet={handleAddSet}
        totalSets={totalSets}
        handleRemoveSet={handleRemoveSet}
        hasFeedback={hasFeedback}
        setIsFeedbackModalOpen={setIsFeedbackModalOpen}
      />

      {/* 6. MODALES: CALCULADORA, SOBRECARGA, MÁQUINA Y SENSACIONES */}
      <SetLoggerModals
        plateModal={plateModal}
        setPlateModal={setPlateModal}
        exercise={exercise}
        machineConfig={machineConfig}
        handleSaveMachineConfig={handleSaveMachineConfig}
        isMachineConfigOpen={isMachineConfigOpen}
        setIsMachineConfigOpen={setIsMachineConfigOpen}
        handleSanitizedChange={handleSanitizedChange}
        isScienceModalOpen={isScienceModalOpen}
        setIsScienceModalOpen={setIsScienceModalOpen}
        loadRecommendation={loadRecommendation}
        prescribedReps={prescribedReps}
        previousData={previousData}
        exerciseData={exerciseData}
        exerciseProfiles={exerciseProfiles}
        isFeedbackModalOpen={isFeedbackModalOpen}
        setIsFeedbackModalOpen={setIsFeedbackModalOpen}
        currentFeedback={currentFeedback}
        handleSaveFeedback={handleSaveFeedback}
      />
    </>
  );
}
