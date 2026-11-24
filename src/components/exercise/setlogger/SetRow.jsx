import React from 'react';
import { calculate1RM, getOverloadTarget, isEpleyReliable } from '../../../hooks/useWorkoutCalculations';
import { getSetCompletedBadge, getRpeColorStyle } from '../../../utils/setLoggerHelpers';
import SetRowHeader from './SetRowHeader';
import SetRowInputs from './SetRowInputs';

export default function SetRow({
  setNum,
  sIdx,
  exercise,
  setVal = {},
  prevVal = {},
  isUnilateral,
  isDeloadMode,
  unlockedDeloadSets = {},
  setUnlockedDeloadSets,
  prescribedReps,
  machineConfig,
  exerciseData = {},
  previousData = {},
  prevLocation,
  historicalBest1RM = 0,
  handleSanitizedChange,
  handleSetChange,
  toggleSetComplete,
  setPlateModal
}) {
  const isDone = !!setVal.completed;

  const repsNum = Number(setVal.reps) || 0;
  const isRepsHighAlert = repsNum > 35 && !exercise?.isTime;
  const weightNum = Number(setVal.weight) || 0;
  const prevWeightNum = Number(prevVal.weight) || 0;
  const rpeNum = Number(setVal.rpe) || 0;

  // Solo alertar si el salto es abrupto (>60%) Y no se registró RPE o el RPE fue fallo excesivo (>=9.5)
  const isWeightJumpAlert = prevWeightNum > 0 && weightNum > 0 && 
    (weightNum > prevWeightNum * 1.6 || weightNum < prevWeightNum * 0.5) &&
    (!setVal.rpe || rpeNum >= 9.5);

  const prevRepsNum = isUnilateral
    ? ((prevVal.repsL !== undefined || prevVal.repsR !== undefined)
        ? Math.max(Number(prevVal.repsL) || 0, Number(prevVal.repsR) || 0, Number(prevVal.reps) || 0)
        : Number(prevVal.reps) || 0)
    : Number(prevVal.reps || prevVal.repsR || prevVal.repsL || 0);

  const deltaWeight = (prevWeightNum > 0 && weightNum > 0) ? (weightNum - prevWeightNum) : 0;
  const deltaReps = (prevRepsNum > 0 && repsNum > 0) ? (repsNum - prevRepsNum) : 0;
  const isExtraSet = !prevWeightNum && !prevRepsNum;

  // Pasa machineConfig y lo realizado hoy (exerciseData) para cálculo con incrementos reales y estabilidad
  const overloadTarget = getOverloadTarget(setNum, previousData, prescribedReps, machineConfig, prevVal.weight, prevVal.reps, exerciseData, isDeloadMode, { exercise });
  const current1RM = calculate1RM(setVal.weight, setVal.reps);
  const isPr = isDone && isEpleyReliable(setVal.reps) && current1RM > 0 && historicalBest1RM > 0 && current1RM > historicalBest1RM;

  // Si estamos en Deload y es la serie 3 o posterior (y no está completada ni desbloqueada manualmente)
  if (isDeloadMode && sIdx >= 2 && !unlockedDeloadSets[setNum] && !isDone) {
    return (
      <div
        key={setNum}
        style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '10px',
          padding: '7px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          opacity: 0.8
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="font-mono-tech" style={{
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-muted)',
            borderRadius: '5px',
            padding: '1px 5px',
            fontSize: '9.5px',
            fontWeight: '900'
          }}>
            S{setNum}
          </span>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>
            🧘 Serie Omitida por Deload (Descarga)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setUnlockedDeloadSets(prev => ({ ...prev, [setNum]: true }))}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: '6px',
            padding: '3px 7px',
            fontSize: '9.5px',
            fontWeight: '800',
            color: 'var(--accent-cyan)',
            cursor: 'pointer'
          }}
          title="Desbloquear si deseas realizar esta serie extra"
        >
          🔓 Desbloquear
        </button>
      </div>
    );
  }

  const completedBadge = getSetCompletedBadge({
    isDone,
    isExtraSet,
    deltaWeight,
    deltaReps,
    isPr,
    weightNum,
    repsNum,
    prevRepsNum,
    rpeNum,
    current1RM
  });

  const { rpeBorder, rpeColor, rpeBg } = getRpeColorStyle(setVal.rpe || '8');

  return (
    <div
      key={setNum}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        background: isDone ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
        border: isDone ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '6px 8px',
        boxShadow: isDone ? '0 0 10px var(--accent-emerald-subtle)' : 'none',
        position: 'relative',
        transition: 'border-color 0.15s ease, background 0.15s ease'
      }}
    >
      {/* 1. LÍNEA SUPERIOR: NÚMERO DE SERIE, HISTORIAL ANTERIOR Y META */}
      <SetRowHeader
        setNum={setNum}
        isDone={isDone}
        prevVal={prevVal}
        isUnilateral={isUnilateral}
        prevLocation={prevLocation}
        overloadTarget={overloadTarget}
        completedBadge={completedBadge}
        handleSanitizedChange={handleSanitizedChange}
      />

      {/* 2. LÍNEA DE ENTRADA DE DATOS (HIGH DENSITY COCKPIT ROW) */}
      <SetRowInputs
        setNum={setNum}
        exercise={exercise}
        setVal={setVal}
        prevVal={prevVal}
        overloadTarget={overloadTarget}
        isUnilateral={isUnilateral}
        machineConfig={machineConfig}
        isDone={isDone}
        isRepsHighAlert={isRepsHighAlert}
        isWeightJumpAlert={isWeightJumpAlert}
        repsNum={repsNum}
        prevWeightNum={prevWeightNum}
        weightNum={weightNum}
        rpeBorder={rpeBorder}
        rpeColor={rpeColor}
        rpeBg={rpeBg}
        handleSanitizedChange={handleSanitizedChange}
        handleSetChange={handleSetChange}
        toggleSetComplete={toggleSetComplete}
        setPlateModal={setPlateModal}
      />
    </div>
  );
}
