import React from 'react';
import { Dumbbell, Watch } from 'lucide-react';
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
  handleSkipExercise,
  userWeightKg = 78.55,
  userSmartwatchKcal = null,
  onOpenStrengthWatchModal = null,
  onDeleteCustomExercise = null,
  isDeloadMode = false
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
          const isFirstCardio = idx === 0 || !exercises.slice(0, idx).some(e => e.isCardio);
          return (
            <React.Fragment key={exercise.id}>
              {isFirstCardio && (
                exercise.machineType === 'rower' || exercise.unifiedCode === '[CARD-ROW_HIIT_NEAT_01]' ? (
                  <div style={{
                    margin: '12px 0 10px 0',
                    padding: '10px 12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--accent-blue)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: 'var(--accent-blue-light)',
                          color: 'var(--accent-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '18px'
                        }}>
                          🚣‍♂️
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                            <span>Protocolo Matutino: Remo (Cardio vs. NEAT)</span>
                            <span style={{ fontSize: '9px', background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                              ☀️ Separado ≥ 6h de Pesas
                            </span>
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Realízalo por la mañana para anular interferencia AMPK vs. mTOR.
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onOpenStrengthWatchModal}
                        style={{
                          background: userSmartwatchKcal 
                            ? 'var(--accent-emerald-subtle)' 
                            : 'var(--bg-surface-secondary)',
                          border: userSmartwatchKcal ? '1px solid var(--accent-emerald)' : '1px solid var(--border-strong)',
                          color: userSmartwatchKcal ? 'var(--accent-emerald)' : 'var(--text-main)',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '10.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Watch size={13} />
                        {userSmartwatchKcal 
                          ? `✓ Reloj (${userSmartwatchKcal.hrAvg ? `${userSmartwatchKcal.hrAvg} BPM` : ''})` 
                          : '⌚ Sincronizar Reloj'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    margin: '12px 0 10px 0',
                    padding: '10px 12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'var(--bg-surface-secondary)',
                          color: 'var(--accent-emerald)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Dumbbell size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-main)' }}>
                            🏁 Fin de Sesión de Fuerza & Pesas
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                            Sincroniza tus pulsaciones y calorías de fuerza antes de iniciar tu sesión de cardio.
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onOpenStrengthWatchModal}
                        style={{
                          background: userSmartwatchKcal 
                            ? 'var(--accent-emerald-subtle)' 
                            : 'var(--bg-surface-secondary)',
                          border: userSmartwatchKcal ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                          color: userSmartwatchKcal ? 'var(--accent-emerald)' : 'var(--text-main)',
                          padding: '8px 14px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: '900',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: 'var(--shadow-ios)'
                        }}
                      >
                        <Watch size={15} />
                        {userSmartwatchKcal 
                          ? `✓ Pesas Sincronizadas (${userSmartwatchKcal.hrAvg ? `${userSmartwatchKcal.hrAvg} BPM` : ''} ${userSmartwatchKcal.watchKcal ? `• ${userSmartwatchKcal.watchKcal} kcal` : ''})` 
                          : '⌚ Sincronizar Sesión de Pesas del Reloj'}
                      </button>
                    </div>
                  </div>
                )
              )}

              <div id={`exercise-${exercise.id}`} style={{ width: '100%' }}>
                <CardioLogger
                  exercise={exercise}
                  exerciseData={todayWorkoutData[exercise.id]}
                  onUpdateCardio={(data) => handleUpdateCardio(exercise.id, data)}
                  initiallyExpanded={false}
                  isExpanded={isCurrentlyExpanded}
                  onToggleExpand={handleToggle}
                  userWeightKg={userWeightKg}
                  onOpenStrengthWatchModal={onOpenStrengthWatchModal}
                />
              </div>
            </React.Fragment>
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
            onDeleteCustomExercise={onDeleteCustomExercise ? () => onDeleteCustomExercise(exercise.id) : undefined}
            workoutHistory={workoutHistory}
            todayWorkoutData={todayWorkoutData}
            isDeloadMode={isDeloadMode}
          />
        );
      })}
    </>

  );
}
