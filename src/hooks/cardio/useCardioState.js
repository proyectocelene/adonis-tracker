import { useState, useEffect, useCallback, useMemo } from 'react';
import { calculateCardioCalories } from '../../utils/calorieCalculations';
import {
  EMPTY_EXERCISE_DATA,
  cleanInputVal,
  resolveInitialMachineType,
  resolveMachineLabel,
  calculateEffectiveDuration
} from './cardioStateHelper';

export { EMPTY_EXERCISE_DATA, cleanInputVal, resolveInitialMachineType };

export function useCardioState({
  exercise,
  exerciseData = EMPTY_EXERCISE_DATA,
  onUpdateCardio,
  userWeightKg = 78.55
}) {
  const initialMachineType = useMemo(
    () => resolveInitialMachineType(exercise, exerciseData),
    [exercise, exerciseData]
  );

  const [machineType, setMachineType] = useState(initialMachineType);

  // Parámetros específicos Protocolo Matutino de Remo
  const [rowOption, setRowOption] = useState(exerciseData.rowOption || (exerciseData.isRowOptionA ? 'A' : 'B'));
  const [rowPhase1Mins, setRowPhase1Mins] = useState(cleanInputVal(exerciseData.rowPhase1Mins ?? exerciseData.phaseMinutesA, '15'));
  const [rowPhase2Mins, setRowPhase2Mins] = useState(cleanInputVal(exerciseData.rowPhase2Mins ?? exerciseData.phaseMinutesB, '20'));
  const [rowSprintsCount, setRowSprintsCount] = useState(cleanInputVal(exerciseData.rowSprintsCount, '5'));
  const [rowSprintSec, setRowSprintSec] = useState(cleanInputVal(exerciseData.rowSprintSec, '20'));
  const [rowRecoverySec, setRowRecoverySec] = useState(cleanInputVal(exerciseData.rowRecoverySec, '40'));
  const [rowLissMins, setRowLissMins] = useState(cleanInputVal(exerciseData.rowLissMins, '35'));
  const [rowDamper, setRowDamper] = useState(cleanInputVal(exerciseData.damperLevel ?? exerciseData.resistanceLevel, '5'));
  const [rowSpm, setRowSpm] = useState(cleanInputVal(exerciseData.strokesPerMin ?? exerciseData.cadenceRpm, '24'));
  const [rowDistanceMeters, setRowDistanceMeters] = useState(cleanInputVal(exerciseData.distanceMeters, ''));
  const [rowSplit500m, setRowSplit500m] = useState(cleanInputVal(exerciseData.split500m, '2:15'));
  const [rowRpe, setRowRpe] = useState(cleanInputVal(exerciseData.rpe, exerciseData.rowOption === 'A' ? '17' : '13'));

  // Parámetros específicos Protocolo Bifásico Adonis
  const [isDualPhase, setIsDualPhase] = useState(exerciseData.isDualPhase !== undefined ? !!exerciseData.isDualPhase : true);
  const [phaseMinutesA, setPhaseMinutesA] = useState(cleanInputVal(exerciseData.phaseMinutesA, '30'));
  const [phaseInclineA, setPhaseInclineA] = useState(cleanInputVal(exerciseData.phaseInclineA, '11.5'));
  const [phaseSpeedA, setPhaseSpeedA] = useState(cleanInputVal(exerciseData.phaseSpeedA, '4.0'));

  const [phaseMinutesB, setPhaseMinutesB] = useState(cleanInputVal(exerciseData.phaseMinutesB, '30'));
  const [phaseInclineB, setPhaseInclineB] = useState(cleanInputVal(exerciseData.phaseInclineB, '0'));
  const [phaseSpeedB, setPhaseSpeedB] = useState(cleanInputVal(exerciseData.phaseSpeedB, '4.8'));

  const initialDuration = exerciseData.duration !== undefined && exerciseData.duration !== null && exerciseData.duration !== 'null'
    ? String(exerciseData.duration) 
    : (exerciseData.isDualPhase !== false ? '60' : '35');
  const [duration, setDuration] = useState(initialDuration);
  const [completed, setCompleted] = useState(!!exerciseData.completed);

  // Parámetros específicos Caminadora Inclinada (Modo Simple)
  const [treadmillIncline, setTreadmillIncline] = useState(cleanInputVal(exerciseData.inclinePct ?? exerciseData.incline, '11.5'));
  const [treadmillSpeed, setTreadmillSpeed] = useState(cleanInputVal(exerciseData.speedKmh ?? exerciseData.speed, '4.0'));
  const [treadmillDistance, setTreadmillDistance] = useState(cleanInputVal(exerciseData.distanceKm, ''));

  // Parámetros específicos Bicicleta Estática Ergómetro
  const [bikeResistance, setBikeResistance] = useState(cleanInputVal(exerciseData.resistanceLevel, '6'));
  const [bikeSpeed, setBikeSpeed] = useState(cleanInputVal(exerciseData.avgSpeedKmh, '22'));
  const [bikeDistance, setBikeDistance] = useState(cleanInputVal(exerciseData.distanceKm, ''));
  const [bikeCadence, setBikeCadence] = useState(cleanInputVal(exerciseData.cadenceRpm, '75'));
  const [bikeWatts, setBikeWatts] = useState(cleanInputVal(exerciseData.watts, ''));

  // Parámetros específicos Elíptica Sólo Piernas
  const [ellipticalResistance, setEllipticalResistance] = useState(cleanInputVal(exerciseData.resistanceLevel, '5'));
  const [ellipticalSpm, setEllipticalSpm] = useState(cleanInputVal(exerciseData.stridesPerMin, '60'));
  const [ellipticalDistance, setEllipticalDistance] = useState(cleanInputVal(exerciseData.distanceKm, ''));

  // Sesión de Cardio del Smartwatch
  const [watchHrAvg, setWatchHrAvg] = useState(cleanInputVal(exerciseData.heartRate ?? exerciseData.watch?.avgHeartRate, '125'));
  const [watchHrMax, setWatchHrMax] = useState(cleanInputVal(exerciseData.watch?.maxHeartRate, ''));
  const [watchKcal, setWatchKcal] = useState(cleanInputVal(exerciseData.watchCalories ?? exerciseData.watch?.watchCalories, ''));

  // Consola de la Máquina
  const [machineKcal, setMachineKcal] = useState(cleanInputVal(exerciseData.machineCalories, ''));
  const [calibrationMode, setCalibrationMode] = useState(exerciseData.calibrationMode || 'consensus');

  // Ajustes de máquina y notas
  const [machineSetup, setMachineSetup] = useState(cleanInputVal(exerciseData.machineSetup, ''));
  const [cardioNotesInput, setCardioNotesInput] = useState(cleanInputVal(exerciseData.notes, ''));

  // Sincronizar estado local cuando cambie exerciseData desde el exterior
  useEffect(() => {
    const rawMType = resolveInitialMachineType(exercise, exerciseData);
    setMachineType(rawMType);

    if (exerciseData.rowOption) setRowOption(exerciseData.rowOption);
    if (exerciseData.rowPhase1Mins !== undefined || exerciseData.phaseMinutesA !== undefined) {
      setRowPhase1Mins(cleanInputVal(exerciseData.rowPhase1Mins ?? exerciseData.phaseMinutesA, '15'));
    }
    if (exerciseData.rowPhase2Mins !== undefined || exerciseData.phaseMinutesB !== undefined) {
      setRowPhase2Mins(cleanInputVal(exerciseData.rowPhase2Mins ?? exerciseData.phaseMinutesB, '20'));
    }
    if (exerciseData.rowSprintsCount !== undefined) setRowSprintsCount(cleanInputVal(exerciseData.rowSprintsCount, '5'));
    if (exerciseData.rowSprintSec !== undefined) setRowSprintSec(cleanInputVal(exerciseData.rowSprintSec, '20'));
    if (exerciseData.rowRecoverySec !== undefined) setRowRecoverySec(cleanInputVal(exerciseData.rowRecoverySec, '40'));
    if (exerciseData.rowLissMins !== undefined) setRowLissMins(cleanInputVal(exerciseData.rowLissMins, '35'));
    if (exerciseData.damperLevel !== undefined || exerciseData.resistanceLevel !== undefined) {
      setRowDamper(cleanInputVal(exerciseData.damperLevel ?? exerciseData.resistanceLevel, '5'));
    }
    if (exerciseData.strokesPerMin !== undefined || exerciseData.cadenceRpm !== undefined) {
      setRowSpm(cleanInputVal(exerciseData.strokesPerMin ?? exerciseData.cadenceRpm, '24'));
    }
    if (exerciseData.distanceMeters !== undefined) setRowDistanceMeters(cleanInputVal(exerciseData.distanceMeters, ''));
    if (exerciseData.split500m !== undefined) setRowSplit500m(cleanInputVal(exerciseData.split500m, '2:15'));
    if (exerciseData.rpe !== undefined) setRowRpe(cleanInputVal(exerciseData.rpe, '13'));

    if (exerciseData.isDualPhase !== undefined) setIsDualPhase(!!exerciseData.isDualPhase);
    setPhaseMinutesA(cleanInputVal(exerciseData.phaseMinutesA, '30'));
    setPhaseInclineA(cleanInputVal(exerciseData.phaseInclineA, '11.5'));
    setPhaseSpeedA(cleanInputVal(exerciseData.phaseSpeedA, '4.0'));
    setPhaseMinutesB(cleanInputVal(exerciseData.phaseMinutesB, '30'));
    setPhaseInclineB(cleanInputVal(exerciseData.phaseInclineB, '0'));
    setPhaseSpeedB(cleanInputVal(exerciseData.phaseSpeedB, '4.8'));

    setDuration(cleanInputVal(exerciseData.duration, exerciseData.isDualPhase !== false ? '60' : '35'));
    setCompleted(!!exerciseData.completed);
    setTreadmillIncline(cleanInputVal(exerciseData.inclinePct ?? exerciseData.incline, '11.5'));
    setTreadmillSpeed(cleanInputVal(exerciseData.speedKmh ?? exerciseData.speed, '4.0'));
    setTreadmillDistance(cleanInputVal(exerciseData.distanceKm, ''));
    
    if (exerciseData.resistanceLevel !== undefined) {
      setBikeResistance(cleanInputVal(exerciseData.resistanceLevel, '6'));
      setEllipticalResistance(cleanInputVal(exerciseData.resistanceLevel, '5'));
    }
    if (exerciseData.avgSpeedKmh !== undefined) setBikeSpeed(cleanInputVal(exerciseData.avgSpeedKmh, '22'));
    if (exerciseData.cadenceRpm !== undefined) setBikeCadence(cleanInputVal(exerciseData.cadenceRpm, '75'));
    if (exerciseData.watts !== undefined) setBikeWatts(cleanInputVal(exerciseData.watts, ''));
    if (exerciseData.stridesPerMin !== undefined) setEllipticalSpm(cleanInputVal(exerciseData.stridesPerMin, '60'));
    if (exerciseData.distanceKm !== undefined) {
      setBikeDistance(cleanInputVal(exerciseData.distanceKm, ''));
      setEllipticalDistance(cleanInputVal(exerciseData.distanceKm, ''));
    }

    setWatchHrAvg(cleanInputVal(exerciseData.heartRate ?? exerciseData.watch?.avgHeartRate, '125'));
    setWatchHrMax(cleanInputVal(exerciseData.watch?.maxHeartRate, ''));
    setWatchKcal(cleanInputVal(exerciseData.watchCalories ?? exerciseData.watch?.watchCalories, ''));
    setMachineKcal(cleanInputVal(exerciseData.machineCalories, ''));
    if (exerciseData.calibrationMode) setCalibrationMode(exerciseData.calibrationMode);
    setMachineSetup(cleanInputVal(exerciseData.machineSetup, ''));
    setCardioNotesInput(cleanInputVal(exerciseData.notes, ''));
  }, [exercise, exerciseData]);

  // Nombre legible de la máquina
  const machineLabel = useMemo(
    () => resolveMachineLabel(machineType, rowOption, isDualPhase),
    [machineType, rowOption, isDualPhase]
  );

  const calculatedDuration = useMemo(
    () => calculateEffectiveDuration({
      machineType, rowOption, rowPhase1Mins, rowPhase2Mins, rowLissMins,
      isDualPhase, phaseMinutesA, phaseMinutesB, duration
    }),
    [machineType, rowOption, rowPhase1Mins, rowPhase2Mins, rowLissMins, isDualPhase, phaseMinutesA, phaseMinutesB, duration]
  );

  // Empaquetar estado actual para calcular calorías reactivas
  const currentCardioState = useMemo(() => ({
    machineType,
    machine: machineLabel,
    duration: calculatedDuration,
    rowOption,
    rowPhase1Mins: parseFloat(rowPhase1Mins) || 15,
    rowPhase2Mins: parseFloat(rowPhase2Mins) || 20,
    rowSprintsCount: parseInt(rowSprintsCount, 10) || 5,
    rowSprintSec: parseInt(rowSprintSec, 10) || 20,
    rowRecoverySec: parseInt(rowRecoverySec, 10) || 40,
    rowLissMins: parseFloat(rowLissMins) || 35,
    damperLevel: parseFloat(rowDamper) || 5,
    strokesPerMin: parseFloat(rowSpm) || 24,
    distanceMeters: parseFloat(rowDistanceMeters) || 0,
    split500m: rowSplit500m,
    isDualPhase: machineType === 'treadmill' ? isDualPhase : false,
    phaseMinutesA: parseFloat(phaseMinutesA) || 0,
    phaseInclineA: parseFloat(phaseInclineA) || 0,
    phaseSpeedA: parseFloat(phaseSpeedA) || 0,
    phaseMinutesB: parseFloat(phaseMinutesB) || 0,
    phaseInclineB: parseFloat(phaseInclineB) || 0,
    phaseSpeedB: parseFloat(phaseSpeedB) || 0,
    speedKmh: parseFloat(treadmillSpeed) || 0,
    inclinePct: parseFloat(treadmillIncline) || 0,
    distanceKm: parseFloat(machineType === 'treadmill' ? treadmillDistance : machineType === 'bike' ? bikeDistance : machineType === 'rower' ? (parseFloat(rowDistanceMeters) / 1000 || '') : ellipticalDistance) || 0,
    resistanceLevel: parseFloat(machineType === 'bike' ? bikeResistance : machineType === 'rower' ? rowDamper : ellipticalResistance) || 0,
    avgSpeedKmh: parseFloat(bikeSpeed) || 0,
    cadenceRpm: parseFloat(machineType === 'rower' ? rowSpm : bikeCadence) || 0,
    watts: parseFloat(bikeWatts) || 0,
    stridesPerMin: parseFloat(ellipticalSpm) || 0,
    heartRate: parseInt(watchHrAvg, 10) || 0,
    watch: {
      avgHeartRate: parseInt(watchHrAvg, 10) || 0,
      maxHeartRate: parseInt(watchHrMax, 10) || 0,
      watchCalories: parseFloat(watchKcal) || null
    },
    watchCalories: parseFloat(watchKcal) || null,
    machineCalories: parseFloat(machineKcal) || null,
    calibrationMode,
    completed,
    rpe: rowRpe
  }), [
    machineType, machineLabel, calculatedDuration, rowOption, rowPhase1Mins, rowPhase2Mins,
    rowSprintsCount, rowSprintSec, rowRecoverySec, rowLissMins, rowDamper, rowSpm, rowDistanceMeters,
    rowSplit500m, isDualPhase, phaseMinutesA, phaseInclineA, phaseSpeedA, phaseMinutesB,
    phaseInclineB, phaseSpeedB, treadmillSpeed, treadmillIncline, treadmillDistance,
    bikeDistance, rowRpe, ellipticalDistance, ellipticalResistance, bikeResistance, bikeSpeed,
    bikeCadence, bikeWatts, ellipticalSpm, watchHrAvg, watchHrMax, watchKcal, machineKcal,
    calibrationMode, completed
  ]);

  // Cálculo en vivo
  const metrics = useMemo(
    () => calculateCardioCalories(currentCardioState, userWeightKg),
    [currentCardioState, userWeightKg]
  );

  const notifyChange = useCallback((patch = {}) => {
    if (!onUpdateCardio) return;
    const merged = {
      ...currentCardioState,
      ...patch
    };
    const liveMetrics = calculateCardioCalories(merged, userWeightKg);

    if (patch.rpe !== undefined) {
      setRowRpe(cleanInputVal(patch.rpe, '13'));
    }

    onUpdateCardio({
      machineType: merged.machineType,
      machine: merged.machineType === 'rower'
        ? (merged.rowOption === 'A' ? 'Máquina de Remo (Opción A Híbrida 35-40 min)' : 'Máquina de Remo (Opción B NEAT LISS 35 min)')
        : merged.machineType === 'treadmill' 
          ? (merged.isDualPhase ? 'Caminadora Inclinada (Bifásico 60 min)' : 'Caminadora Inclinada (Zona 2)')
          : merged.machineType === 'bike' ? 'Bicicleta Estática Ergómetro' : 'Elíptica de Bajo Impacto',
      duration: merged.duration,
      rowOption: merged.rowOption,
      rowPhase1Mins: merged.rowPhase1Mins,
      rowPhase2Mins: merged.rowPhase2Mins,
      rowSprintsCount: merged.rowSprintsCount,
      rowSprintSec: merged.rowSprintSec,
      rowRecoverySec: merged.rowRecoverySec,
      rowLissMins: merged.rowLissMins,
      damperLevel: merged.damperLevel,
      strokesPerMin: merged.strokesPerMin,
      distanceMeters: merged.distanceMeters,
      split500m: merged.split500m,
      isDualPhase: merged.isDualPhase,
      phaseMinutesA: merged.phaseMinutesA,
      phaseInclineA: merged.phaseInclineA,
      phaseSpeedA: merged.phaseSpeedA,
      phaseMinutesB: merged.phaseMinutesB,
      phaseInclineB: merged.phaseInclineB,
      phaseSpeedB: merged.phaseSpeedB,
      inclinePct: merged.inclinePct,
      speedKmh: merged.speedKmh,
      resistanceLevel: merged.resistanceLevel,
      avgSpeedKmh: merged.avgSpeedKmh,
      distanceKm: merged.distanceKm || liveMetrics.distanceKm,
      cadenceRpm: merged.cadenceRpm,
      watts: merged.watts,
      stridesPerMin: merged.stridesPerMin,
      heartRate: merged.heartRate,
      watch: merged.watch,
      watchCalories: merged.watchCalories,
      machineCalories: merged.machineCalories,
      calibrationMode: merged.calibrationMode,
      machineSetup: patch.machineSetup !== undefined ? patch.machineSetup : machineSetup,
      notes: patch.notes !== undefined ? patch.notes : cardioNotesInput,
      completed: patch.completed !== undefined ? patch.completed : completed,
      calculatedKcal: liveMetrics.cardioKcal,
      acsmKcal: liveMetrics.acsmKcal,
      elevationMeters: liveMetrics.elevationMeters,
      rpe: patch.rpe !== undefined ? patch.rpe : (rowRpe || exerciseData.rpe || (merged.rowOption === 'A' ? '17' : '13'))
    });
  }, [
    currentCardioState,
    onUpdateCardio,
    userWeightKg,
    machineSetup,
    cardioNotesInput,
    completed,
    rowRpe,
    exerciseData.rpe
  ]);

  const toggleCompleted = useCallback((e) => {
    e.stopPropagation();
    setCompleted(prev => {
      const next = !prev;
      notifyChange({ completed: next });
      return next;
    });
  }, [notifyChange]);

  return {
    machineType,
    setMachineType,
    machineLabel,
    calculatedDuration,
    metrics,
    currentCardioState,
    notifyChange,
    completed,
    setCompleted,
    toggleCompleted,
    duration,
    setDuration,
    rowOption,
    setRowOption,
    rowPhase1Mins,
    setRowPhase1Mins,
    rowPhase2Mins,
    setRowPhase2Mins,
    rowSprintsCount,
    setRowSprintsCount,
    rowSprintSec,
    setRowSprintSec,
    rowRecoverySec,
    setRowRecoverySec,
    rowLissMins,
    setRowLissMins,
    rowDamper,
    setRowDamper,
    rowSpm,
    setRowSpm,
    rowDistanceMeters,
    setRowDistanceMeters,
    rowSplit500m,
    setRowSplit500m,
    rowRpe,
    setRowRpe,
    isDualPhase,
    setIsDualPhase,
    phaseMinutesA,
    setPhaseMinutesA,
    phaseInclineA,
    setPhaseInclineA,
    phaseSpeedA,
    setPhaseSpeedA,
    phaseMinutesB,
    setPhaseMinutesB,
    phaseInclineB,
    setPhaseInclineB,
    phaseSpeedB,
    setPhaseSpeedB,
    treadmillIncline,
    setTreadmillIncline,
    treadmillSpeed,
    setTreadmillSpeed,
    treadmillDistance,
    setTreadmillDistance,
    bikeResistance,
    setBikeResistance,
    bikeSpeed,
    setBikeSpeed,
    bikeDistance,
    setBikeDistance,
    bikeCadence,
    setBikeCadence,
    bikeWatts,
    setBikeWatts,
    ellipticalResistance,
    setEllipticalResistance,
    ellipticalSpm,
    setEllipticalSpm,
    ellipticalDistance,
    setEllipticalDistance,
    watchHrAvg,
    setWatchHrAvg,
    watchHrMax,
    setWatchHrMax,
    watchKcal,
    setWatchKcal,
    machineKcal,
    setMachineKcal,
    calibrationMode,
    setCalibrationMode,
    machineSetup,
    setMachineSetup,
    cardioNotesInput,
    setCardioNotesInput
  };
}
