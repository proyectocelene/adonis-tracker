import { describe, it, expect } from 'vitest';
import {
  calculate1RM,
  calculateVolume,
  isExerciseUnilateral,
  calculateAverageRPE
} from '../src/hooks/useWorkoutCalculations.js';

describe('workoutCalculations', () => {
  describe('calculate1RM (Fórmula de Epley)', () => {
    it('debe devolver 0 si el peso o las repeticiones son <= 0 o nulos', () => {
      expect(calculate1RM(0, 10)).toBe(0);
      expect(calculate1RM(100, 0)).toBe(0);
      expect(calculate1RM(null, 5)).toBe(0);
      expect(calculate1RM(100, null)).toBe(0);
      expect(calculate1RM(-50, 10)).toBe(0);
    });

    it('debe devolver el peso exacto si reps === 1', () => {
      expect(calculate1RM(200, 1)).toBe(200);
      expect(calculate1RM(135.5, 1)).toBe(136); // Redondeado
    });

    it('debe calcular correctamente con la fórmula Epley: peso * (1 + reps / 30)', () => {
      // 100 lbs a 10 reps: 100 * (1 + 10/30) = 100 * 1.3333 = 133.33 -> 133
      expect(calculate1RM(100, 10)).toBe(133);

      // 225 lbs a 5 reps: 225 * (1 + 5/30) = 225 * 1.1666 = 262.5 -> 263
      expect(calculate1RM(225, 5)).toBe(263);

      // 80 lbs a 15 reps: 80 * (1 + 15/30) = 80 * 1.5 = 120
      expect(calculate1RM(80, 15)).toBe(120);
    });
  });

  describe('calculateVolume', () => {
    it('debe devolver 0 para entradas vacías o inválidas', () => {
      expect(calculateVolume([])).toBe(0);
      expect(calculateVolume(null)).toBe(0);
      expect(calculateVolume(undefined)).toBe(0);
    });

    it('debe calcular el volumen acumulado (peso * reps) en series bilaterales', () => {
      const sets = [
        { weight: 100, reps: 10, completed: true },
        { weight: 120, reps: 8, completed: true }
      ];
      // 100 * 10 = 1000, 120 * 8 = 960 -> Total: 1960
      expect(calculateVolume(sets)).toBe(1960);
    });

    it('debe ignorar series no completadas (completed: false)', () => {
      const sets = [
        { weight: 100, reps: 10, completed: true },
        { weight: 150, reps: 5, completed: false }
      ];
      expect(calculateVolume(sets)).toBe(1000);
    });

    it('debe convertir unidades en kg multiplicando por 2.20462', () => {
      const sets = [
        { weight: 100, reps: 10, completed: true, unit: 'kg' }
      ];
      // 100 kg * 2.20462 = 220.462 lbs * 10 reps = 2204.62
      expect(calculateVolume(sets)).toBeCloseTo(2204.62, 1);
    });

    it('debe soportar series unilaterales con repeticiones por lado', () => {
      const sets = [
        {
          weight: 40,
          repsL: 10,
          repsR: 12,
          isUnilateral: true,
          completed: true
        }
      ];
      // 40 * 10 + 40 * 12 = 400 + 480 = 880
      expect(calculateVolume(sets)).toBe(880);
    });
  });

  describe('isExerciseUnilateral', () => {
    it('debe respetar el toggle explícito del usuario en exerciseLogs', () => {
      expect(isExerciseUnilateral({ name: 'Press Banca' }, { isUnilateral: true })).toBe(true);
      expect(isExerciseUnilateral({ name: 'Curl Concentrado Unilateral' }, { isUnilateral: false })).toBe(false);
    });

    it('debe detectar patrones de nombres unilaterales', () => {
      expect(isExerciseUnilateral({ name: 'Elevación Lateral Unilateral en Polea' })).toBe(true);
      expect(isExerciseUnilateral({ name: 'Bayesian Curl en Polea' })).toBe(true);
      expect(isExerciseUnilateral({ name: 'Sentadilla Búlgara con Mancuerna' })).toBe(true);
      expect(isExerciseUnilateral({ name: 'Remo a un brazo con mancuerna' })).toBe(true);
    });

    it('debe clasificar como bilateral los ejercicios clásicos de masa', () => {
      expect(isExerciseUnilateral({ name: 'Bench Press con Barra' })).toBe(false);
      expect(isExerciseUnilateral({ name: 'Prensa Inclinada 45°' })).toBe(false);
      expect(isExerciseUnilateral({ name: 'Sentadilla Hack con Discos' })).toBe(false);
      expect(isExerciseUnilateral({ name: 'Jalón al Pecho Agarre Ancho' })).toBe(false);
    });
  });

  describe('calculateAverageRPE', () => {
    it('debe devolver "0.0" para listas vacías o inválidas', () => {
      expect(calculateAverageRPE([])).toBe('0.0');
      expect(calculateAverageRPE(null)).toBe('0.0');
    });

    it('debe calcular el promedio con un decimal formateado', () => {
      const sets = [
        { rpe: 8 },
        { rpe: 9 },
        { rpe: 8.5 }
      ];
      // (8 + 9 + 8.5) / 3 = 25.5 / 3 = 8.5
      expect(calculateAverageRPE(sets)).toBe('8.5');
    });
  });
});
