import React from 'react';
import PlateCalculatorModal from '../PlateCalculatorModal';
import OverloadScienceModal from '../OverloadScienceModal';
import MachineConfigModal from '../MachineConfigModal';
import ExerciseFeedbackModal from '../ExerciseFeedbackModal';
import { getApparatusType } from '../../../utils/setLoggerHelpers';

export default function SetLoggerModals({
  plateModal,
  setPlateModal,
  exercise,
  machineConfig,
  handleSaveMachineConfig,
  isMachineConfigOpen,
  setIsMachineConfigOpen,
  handleSanitizedChange,
  isScienceModalOpen,
  setIsScienceModalOpen,
  loadRecommendation,
  prescribedReps,
  previousData = {},
  exerciseData = {},
  exerciseProfiles = [],
  isFeedbackModalOpen,
  setIsFeedbackModalOpen,
  currentFeedback,
  handleSaveFeedback
}) {
  return (
    <>
      {/* MODAL CALCULADORA DE DISCOS Y PLACAS */}
      <PlateCalculatorModal
        isOpen={plateModal.isOpen}
        onClose={() => setPlateModal({ isOpen: false, setNum: null, currentWeight: 0 })}
        initialWeight={plateModal.currentWeight}
        initialExerciseType={getApparatusType(exercise?.name || '', machineConfig)}
        exerciseName={exercise?.name}
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
        exerciseName={exercise?.name}
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
        exerciseName={exercise?.name}
        exerciseId={exercise?.id}
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
        exerciseName={exercise?.name}
        currentFeedback={currentFeedback || {}}
        onSaveFeedback={handleSaveFeedback}
      />
    </>
  );
}
