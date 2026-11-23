import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSyncedStore } from '../useSyncedStore';
import {
  loadMachineProfilesForExercise,
  getActiveMachineConfig,
  saveMachineConfigAndProfiles
} from '../useWorkoutCalculations';

const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);

/**
 * Hook enfocado en la resolución, selección y sincronización de perfiles de maquinaria.
 * Gestiona useSyncedStore sin duplicar listeners y evita bucles o re-renders innecesarios.
 */
export function useSetLoggerMachineConfig({
  exercise,
  exerciseData = EMPTY_OBJ,
  previousData = EMPTY_OBJ,
  workoutHistory = EMPTY_ARR,
  onUpdateExerciseMeta,
  onOpenNewMachineConfig
}) {
  const [globalMachineConfigs, setGlobalMachineConfigs] = useSyncedStore('coachv2_machine_configs', EMPTY_OBJ);
  const [globalMachineProfiles, setGlobalMachineProfiles] = useSyncedStore('coachv2_machine_profiles', EMPTY_OBJ);

  const currentMachineConfig = exerciseData?.machineConfig;

  // Extraer perfiles de máquina guardados (Planta Alta / Planta Baja / etc.)
  const exerciseProfiles = useMemo(() => {
    return loadMachineProfilesForExercise(exercise, {
      globalMachineProfiles,
      globalMachineConfigs,
      previousData,
      exerciseData: { machineConfig: currentMachineConfig },
      workoutHistory
    });
  }, [exercise, globalMachineProfiles, globalMachineConfigs, previousData, currentMachineConfig, workoutHistory]);

  // Resuelve la máquina activa (hoy > default > match de piso previo > primer perfil)
  const activeResolvedConfig = useMemo(() => {
    return getActiveMachineConfig(exerciseProfiles, { machineConfig: currentMachineConfig }, previousData);
  }, [exerciseProfiles, currentMachineConfig, previousData]);

  const [machineConfig, setMachineConfig] = useState(() => activeResolvedConfig);

  const onUpdateMetaRef = useRef(onUpdateExerciseMeta);
  useEffect(() => {
    onUpdateMetaRef.current = onUpdateExerciseMeta;
  });

  // Mantener sincronizado y propagar a todayWorkoutData para que NUNCA se guarde la sesión sin máquina
  useEffect(() => {
    if (currentMachineConfig) {
      setMachineConfig(currentMachineConfig);
    } else if (activeResolvedConfig) {
      setMachineConfig(activeResolvedConfig);
      if (!currentMachineConfig) {
        onUpdateMetaRef.current?.({ machineConfig: activeResolvedConfig });
      }
    }
  }, [activeResolvedConfig, currentMachineConfig]);

  const handleSaveMachineConfig = useCallback((configData, updatedProfiles) => {
    setMachineConfig(configData);
    saveMachineConfigAndProfiles({
      exercise,
      configData,
      updatedProfiles: updatedProfiles || (configData ? [configData] : []),
      setGlobalMachineProfiles,
      setGlobalMachineConfigs,
      onUpdateExerciseMeta: onUpdateMetaRef.current
    });
  }, [exercise, setGlobalMachineProfiles, setGlobalMachineConfigs]);

  const handleSelectMachineProfile = useCallback((profId) => {
    if (profId === '__NEW__') {
      if (onOpenNewMachineConfig) {
        onOpenNewMachineConfig();
      }
      return;
    }
    const target = exerciseProfiles.find(p => p.id === profId);
    if (target) {
      const updatedList = exerciseProfiles.map(p => ({
        ...p,
        isDefault: p.id === profId
      }));
      handleSaveMachineConfig({ ...target, isDefault: true }, updatedList);
    }
  }, [exerciseProfiles, handleSaveMachineConfig, onOpenNewMachineConfig]);

  return {
    machineConfig,
    setMachineConfig,
    exerciseProfiles,
    activeResolvedConfig,
    handleSaveMachineConfig,
    handleSelectMachineProfile
  };
}
