import { describe, it, expect } from 'vitest';
import {
  computeRemainingSeconds,
  parseRestSecondsFromPrescribed,
  formatTimerMMSS
} from '../../contexts/GlobalTimerContext.jsx';
import { calculateMuscleGroupProgression } from '../../utils/sessionDataHelper.js';
import { validateDatasetChange } from '../../services/dataGuardian.js';

describe('Step 4: Temporizador real, filtro de warmups en grupo muscular y DataGuardian v4.4', () => {
  describe('a) GlobalTimerContext (lógica de timestamps endTime, +30s y stop)', () => {
    it('extrae límite inferior de prescripciones de descanso (180-240 s -> 180s, 90-120 s -> 90s)', () => {
      expect(parseRestSecondsFromPrescribed('180-240 s')).toBe(180);
      expect(parseRestSecondsFromPrescribed('90-120 s')).toBe(90);
      expect(parseRestSecondsFromPrescribed('60 s')).toBe(60);
      expect(parseRestSecondsFromPrescribed(null)).toBe(90);
    });

    it('calcula segundos restantes desde endTime aunque la pestaña haya estado suspendida', () => {
      const startMs = 1_700_000_000_000;
      const endTime = startMs + 180 * 1000;

      // 65 segundos después (ej. pantalla bloqueada)
      expect(computeRemainingSeconds(endTime, startMs + 65_000)).toBe(115);

      // +30s añadidos
      const extendedEndTime = endTime + 30_000;
      expect(computeRemainingSeconds(extendedEndTime, startMs + 65_000)).toBe(145);
      expect(formatTimerMMSS(145)).toBe('02:25');

      // stopTimer (endTime = null) o expirado
      expect(computeRemainingSeconds(null, startMs)).toBe(0);
      expect(computeRemainingSeconds(endTime, endTime + 5_000)).toBe(0);
    });
  });

  describe('b) Exclusión de warmups (0, -1) en cálculo de volumen por grupo muscular', () => {
    it('ignora C1 (0), C2 (-1) y series con isWarmup: true en totalGroupVolume y maxGroupWeight', () => {
      const workoutHistory = [
        {
          id: 'ses_1',
          date: '2026-10-12',
          exercises: {
            d1_e1: {
              name: 'Press Inclinado',
              muscleGroup: 'Pecho',
              '0': { weight: 100, reps: 10, completed: true },
              '-1': { weight: 150, reps: 4, completed: true },
              '1': { weight: 200, reps: 8, completed: true },
              '2': { weight: 180, reps: 10, completed: true, isWarmup: true } // marcado como warmup explícito
            }
          }
        }
      ];

      const res = calculateMuscleGroupProgression(workoutHistory, 'Pecho', []);
      expect(res).toHaveLength(1);
      expect(res[0].maxWeight).toBe(200);
      expect(res[0].est1RM).toBe(200 * 8); // Solo serie efectiva S1 (1600), excluyendo 0, -1 e isWarmup
    });
  });

  describe('c) DataGuardian permite migración segura de coachv2_custom_routine a v4.4', () => {
    it('NO bloquea limpiar coachv2_custom_routine hacia null o __cleared', () => {
      const oldRoutine = [{ id: 'd1', exercises: [] }, { id: 'd2', exercises: [] }, { id: 'd3', exercises: [] }];
      expect(validateDatasetChange('coachv2_custom_routine', oldRoutine, null).allowed).toBe(true);
      expect(validateDatasetChange('coachv2_custom_routine', oldRoutine, { __cleared: true, __approvedDrop: true }).allowed).toBe(true);

      // Verifica que datasets críticos como history sigan protegidos
      const bigHistory = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      expect(validateDatasetChange('coachv2_history', bigHistory, []).allowed).toBe(false);
    });
  });
});
