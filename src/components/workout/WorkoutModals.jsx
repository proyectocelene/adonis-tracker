import React from 'react';
import { scientificProtocol } from '../../data/scientificProtocol';
import SmartRescheduleModal from './SmartRescheduleModal';
import AddCustomExerciseModal from './AddCustomExerciseModal';
import GlosarioModal from '../common/GlosarioModal';
import RoutineManagerModal from './RoutineManagerModal';

export default function WorkoutModals({
  showRescheduleModal,
  setShowRescheduleModal,
  isOverrideActive,
  weekSplitOverride,
  setWeekSplitOverride,
  handleRollingShift,
  handleExecuteCleanSlate,
  handleMoveExerciseBetweenDays,
  baseDay,
  customRoutine,
  activeDays,
  isAddingExercise,
  setIsAddingExercise,
  newExScope,
  setNewExScope,
  newExName,
  setNewExName,
  newExSets,
  setNewExSets,
  newExReps,
  setNewExReps,
  handleAddCustomExercise,
  handlePickFromLibrary,
  newExTargetDay,
  setNewExTargetDay,
  showGlosarioModal,
  setShowGlosarioModal,
  showRoutineBuilder,
  setShowRoutineBuilder,
  customExercisesMap,
  setCustomRoutine,
  modal
}) {
  return (
    <>
      <SmartRescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        activeOverride={isOverrideActive ? weekSplitOverride : null}
        onApplyOverride={(overrideObj) => {
          setWeekSplitOverride(overrideObj);
          if (modal?.showAlert) {
            modal.showAlert({
              title: "⚡ Semana Reestructurada",
              message: `Tu microciclo ha sido adaptado inteligentemente a ${overrideObj.splitType?.replace('_', ' ').toUpperCase()}. Todos los ejercicios clave de hipertrofia fueron preservados. Vencerá automáticamente el domingo.`,
              variant: "success"
            });
          }
        }}
        onClearOverride={() => {
          setWeekSplitOverride(null);
          if (modal?.showAlert) {
            modal.showAlert({
              title: "🔄 Rutina Base Restaurada",
              message: "Has vuelto a la rutina base de 6 días.",
              variant: "info"
            });
          }
        }}
        onRollingShift={handleRollingShift}
        onCleanSlate={handleExecuteCleanSlate}
        onMoveExerciseBetweenDays={handleMoveExerciseBetweenDays}
        currentDayName={baseDay.name}
        baseRoutine={customRoutine || scientificProtocol}
        activeDays={activeDays}
      />

      <AddCustomExerciseModal
        isAddingExercise={isAddingExercise}
        setIsAddingExercise={setIsAddingExercise}
        newExScope={newExScope}
        setNewExScope={setNewExScope}
        newExName={newExName}
        setNewExName={setNewExName}
        newExSets={newExSets}
        setNewExSets={setNewExSets}
        newExReps={newExReps}
        setNewExReps={setNewExReps}
        handleAddCustomExercise={handleAddCustomExercise}
        handlePickFromLibrary={handlePickFromLibrary}
        currentDayName={baseDay.name}
        allDays={activeDays}
        newExTargetDay={newExTargetDay}
        setNewExTargetDay={setNewExTargetDay}
      />

      <GlosarioModal
        isOpen={showGlosarioModal}
        onClose={() => setShowGlosarioModal(false)}
      />

      <RoutineManagerModal
        isOpen={showRoutineBuilder}
        onClose={() => setShowRoutineBuilder(false)}
        activeRoutine={activeDays}
        customExercisesMap={customExercisesMap}
        onSaveRoutine={async (newRoutine) => {
          setCustomRoutine(newRoutine);
        }}
        onResetToBaseProtocol={async () => {
          setCustomRoutine(null);
        }}
      />
    </>
  );
}
