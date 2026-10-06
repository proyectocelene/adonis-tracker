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
  onDeleteCustomExercise = null
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
                    margin: '18px 0 14px 0',
                    padding: '14px 16px',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
                    border: '1.5px solid #0284c7',
                    borderRadius: '20px',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '20px'
                        }}>
                          🚣‍♂️
                        </div>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>Protocolo Matutino: Cardio vs. NEAT en Máquina de Remo</span>
                            <span style={{ fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
                              ☀️ Separado ≥ 6h de Pesas
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>
                            Realízalo por la mañana para anular la interferencia AMPK vs. mTOR con tu hipertrofia vespertina.
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onOpenStrengthWatchModal}
                        style={{
                          background: userSmartwatchKcal 
                            ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                          border: userSmartwatchKcal ? '1.5px solid #10b981' : 'none',
                          color: userSmartwatchKcal ? '#047857' : '#ffffff',
                          padding: '7px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                      >
                        <Watch size={14} />
                        {userSmartwatchKcal 
                          ? `✓ Reloj Pesas (${userSmartwatchKcal.hrAvg ? `${userSmartwatchKcal.hrAvg} BPM` : ''})` 
                          : '⌚ Sincronizar Reloj Pesas'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    margin: '18px 0 14px 0',
                    padding: '14px 16px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '20px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          background: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Dumbbell size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
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
                            ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                          border: userSmartwatchKcal ? '1.5px solid #10b981' : 'none',
                          color: userSmartwatchKcal ? '#047857' : '#ffffff',
                          padding: '8px 14px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: '900',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
          />
        );
      })}
    </>

  );
}
