import { useEffect, useMemo } from 'react';
import { useSyncedStore } from '../useSyncedStore';
import { detectFatigueStatus, createDeloadCycle, calculateDeloadProgress } from '../../utils/adaptiveRoutineEngine';

export function useDeloadManager({ workoutHistory, currentWeek, modal }) {
  const [isDeloadMode, setIsDeloadMode] = useSyncedStore('coachv2_deload_active', false);
  const [deloadCycleConfig, setDeloadCycleConfig] = useSyncedStore('coachv2_deload_cycle_config', null);

  // Análisis clínico de fatiga y recomendación de descarga
  const fatigueStatus = useMemo(() => {
    return detectFatigueStatus(workoutHistory, currentWeek, deloadCycleConfig);
  }, [workoutHistory, currentWeek, deloadCycleConfig]);

  // Progreso y cálculo exacto del ciclo de descarga (7 días completos)
  const deloadProgress = useMemo(() => {
    if (!isDeloadMode && !deloadCycleConfig?.isActive) return null;
    return calculateDeloadProgress(deloadCycleConfig, workoutHistory);
  }, [isDeloadMode, deloadCycleConfig, workoutHistory]);

  // Si el ciclo de 7 días se completó y expiró, finalizar descarga automáticamente
  useEffect(() => {
    if (isDeloadMode && deloadProgress?.isCompleted) {
      const completedConfig = {
        ...(deloadCycleConfig || {}),
        isActive: false,
        manuallyExited: false,
        exitedWeek: currentWeek,
        completedAt: new Date().toISOString()
      };
      setIsDeloadMode(false);
      setDeloadCycleConfig(completedConfig);

      if (modal?.showAlert) {
        modal.showAlert({
          title: "⚡ ¡Semana de Descarga Completada!",
          message: "Has completado exitosamente el microciclo de 7 días de recuperación activa y supercompensación. Tu sistema nervioso y articulaciones están al 100%. ¡Iniciando nueva fase de sobrecarga progresiva pesada!",
          variant: "success"
        });
      }
    }
  }, [isDeloadMode, deloadProgress?.isCompleted, currentWeek, deloadCycleConfig, setIsDeloadMode, setDeloadCycleConfig, modal]);

  const handleToggleDeload = () => {
    if (!isDeloadMode) {
      // Activar ciclo de 7 días
      const newCycle = createDeloadCycle(currentWeek, fatigueStatus?.reason);
      setDeloadCycleConfig(newCycle);
      setIsDeloadMode(true);
      if (modal?.showAlert) {
        modal.showAlert({
          title: "🧘 Modo Descarga Activado (7 Días)",
          message: `Iniciado microciclo de descarga científica de 7 días naturales.\n\n• Cargas ajustadas al 80%\n• Volumen reducido al 50% (2 series)\n• Intensidad RIR 3-4\n• Duración: hasta el ${new Date(newCycle.endDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}.`,
          variant: "info"
        });
      }
    } else {
      // Desactivar manualmente
      if (modal?.showConfirm) {
        modal.showConfirm({
          title: "⚠️ ¿Finalizar Semana de Descarga?",
          message: "Si desactivas el modo Deload antes de concluir los 7 días naturales, regresarás inmediatamente a las series completas (3-4 series) y pesos máximos de sobrecarga progresiva.",
          confirmText: "Sí, Volver a Pesado",
          cancelText: "Mantener Descarga",
          variant: "warning",
          onConfirm: async () => {
            const exitedConfig = {
              isActive: false,
              manuallyExited: true,
              exitedWeek: currentWeek,
              exitedAt: new Date().toISOString(),
              completedAt: new Date().toISOString()
            };
            setIsDeloadMode(false);
            setDeloadCycleConfig(exitedConfig);

            modal.showAlert({
              title: "💪 Modo Deload Finalizado",
              message: "Se ha registrado la salida del microciclo de descarga. El modo pesado queda restablecido y no se reactivará durante esta semana.",
              variant: "success"
            });
          }
        });
      }
    }
  };

  return {
    isDeloadMode,
    setIsDeloadMode,
    deloadCycleConfig,
    setDeloadCycleConfig,
    fatigueStatus,
    deloadProgress,
    handleToggleDeload
  };
}
