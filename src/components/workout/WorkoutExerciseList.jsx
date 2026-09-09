import React from 'react';
import ExerciseRow from '../ExerciseRow';
import CardioLogger from '../CardioLogger';
import { getPreviousDataForExercise } from '../../utils/exerciseMatcher';

export default function WorkoutExerciseList({
  exercises = [],
  currentDayId,
  currentWeek,
  workoutHistory,
  currentSessions,
  todayWorkoutData = {},
  expandedExerciseId,
  setExpandedExerciseId,
  firstUncompletedIdx = 0,
  handleUpdateCardio,
  handleUpdateSet,
  handleUpdateExerciseMeta,
  handleSwapExercise,
  handleMoveExercise,
  deferredExIds = [],
  handleDeferExercise,
  skippedExercisesMap = {},
  handleSkipExercise
}) {
  return (
    <>
      {exercises.map((exercise, idx) => {
        const isCurrentlyExpanded = expandedExerciseId !== null 
          ? (expandedExerciseId === exercise.id) 
          : (idx === firstUncompletedIdx);

        const handleToggle = () => {
          setExpandedExerciseId(isCurrentlyExpanded ? 'none' : exercise.id);
        };

        if (exercise.isCardio) {
          return (
            <CardioLogger
              key={exercise.id}
              exercise={exercise}
              exerciseData={todayWorkoutData[exercise.id]}
              onUpdateCardio={(data) => handleUpdateCardio(exercise.id, data)}
              initiallyExpanded={false}
              isExpanded={isCurrentlyExpanded}
              onToggleExpand={handleToggle}
            />
          );
        }

        const isSkipped = !!skippedExercisesMap[exercise.id];
        const skipReason = skippedExercisesMap[exercise.id]?.reason || '';

        return (
          <ExerciseRow 
            key={exercise.id} 
            exercise={exercise} 
            exerciseData={todayWorkoutData[exercise.id]}
            previousData={getPreviousDataForExercise(exercise, currentDayId, currentWeek, workoutHistory, currentSessions)}
            onUpdateSet={(setNum, setData) => handleUpdateSet(exercise.id, setNum, setData)}
            onUpdateExerciseMeta={(meta) => handleUpdateExerciseMeta(exercise.id, meta)}
            onSwapExercise={handleSwapExercise}
            onMoveUp={() => handleMoveExercise(exercise.id, 'up')}
            onMoveDown={() => handleMoveExercise(exercise.id, 'down')}
            isFirst={idx === 0}
            isLast={idx === exercises.length - 1}
            isExpanded={isCurrentlyExpanded}
            onToggleExpand={handleToggle}
            isDeferred={deferredExIds.includes(exercise.id)}
            onDeferExercise={handleDeferExercise ? () => handleDeferExercise(exercise.id) : undefined}
            isSkipped={isSkipped}
            skipReason={skipReason}
            onSkipExercise={handleSkipExercise}
          />
        );
      })}
    </>

  );
}
