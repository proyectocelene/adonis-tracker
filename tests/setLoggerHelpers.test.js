import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getWarmupPlan,
  getApparatusType,
  isStrictlyBilateralExercise,
  getSetCompletedBadge,
  getRpeColorStyle,
  safeVibrate
} from '../src/utils/setLoggerHelpers';

describe('setLoggerHelpers', () => {
  describe('getWarmupPlan', () => {
    it('retorna requiresWarmup: false cuando el protocolo indica que no ocupa', () => {
      const exercise = { warmup: 'No ocupa calentamiento específico' };
      const res = getWarmupPlan(exercise, {}, { 1: { weight: 100 } }, null, null);
      expect(res.requiresWarmup).toBe(false);
      expect(res.series).toEqual([]);
    });

    it('retorna requiresWarmup: false si no hay carga de trabajo disponible', () => {
      const exercise = { warmup: '1 serie al 60%' };
      const res = getWarmupPlan(exercise, {}, {}, null, null);
      expect(res.requiresWarmup).toBe(false);
      expect(res.series).toEqual([]);
    });

    it('prioriza el peso ingresado hoy en la serie 1', () => {
      const exercise = { warmup: '1 serie 5 reps al 60%' };
      const exerciseData = { 1: { weight: '120' } };
      const res = getWarmupPlan(exercise, {}, exerciseData, null, null);
      expect(res.requiresWarmup).toBe(true);
      expect(res.workingWeightUsed).toBe(120);
      expect(res.series.length).toBe(1);
      expect(res.series[0].label).toBe('C1');
      expect(res.series[0].defaultWeight).toBe(70); // 120 * 0.6 = 72 -> roundToAttainableWeight default 5 lb step = 70
      expect(res.series[0].defaultReps).toBe(5);
    });

    it('utiliza carga ajustada del coach si hoy está vacío y hay sobrecarga excesiva', () => {
      const exercise = { warmup: '1 serie al 60%' };
      const coachAnalysis = { isExcessiveLoad: true, adjustedLoad: 100 };
      const res = getWarmupPlan(exercise, {}, {}, null, coachAnalysis);
      expect(res.requiresWarmup).toBe(true);
      expect(res.workingWeightUsed).toBe(100);
      expect(res.series[0].defaultWeight).toBe(60);
    });

    it('utiliza series previas como fallback si hoy está vacío', () => {
      const exercise = { warmup: '1 serie al 60%' };
      const previousData = { 1: { weight: '80' } };
      const res = getWarmupPlan(exercise, previousData, {}, null, null);
      expect(res.requiresWarmup).toBe(true);
      expect(res.workingWeightUsed).toBe(80);
      expect(res.series[0].defaultWeight).toBe(50); // 80 * 0.6 = 48 -> round step 5 = 50
    });

    it('genera 2 series de calentamiento (C1 y C2) cuando el protocolo incluye "serie 2"', () => {
      const exercise = { warmup: 'Serie 1 al 40% 10 reps, Serie 2 al 70% 3 reps' };
      const exerciseData = { 1: { weight: '100' } };
      const res = getWarmupPlan(exercise, {}, exerciseData, null, null);
      expect(res.requiresWarmup).toBe(true);
      expect(res.series.length).toBe(2);
      expect(res.series[0].label).toBe('C1');
      expect(res.series[0].pct).toBe('40%');
      expect(res.series[0].defaultWeight).toBe(40);
      expect(res.series[0].defaultReps).toBe(10);
      expect(res.series[1].label).toBe('C2');
      expect(res.series[1].pct).toBe('70%');
      expect(res.series[1].defaultWeight).toBe(70);
      expect(res.series[1].defaultReps).toBe(3);
    });
  });

  describe('getApparatusType', () => {
    it('prioriza machineConfig.type cuando está definido', () => {
      expect(getApparatusType('Cualquiera', { type: 'plates' })).toBe('prensa');
      expect(getApparatusType('Cualquiera', { type: 'stack' })).toBe('polea');
      expect(getApparatusType('Cualquiera', { type: 'dumbbells' })).toBe('mancuerna');
    });

    it('resuelve tipo por palabras clave en el nombre', () => {
      expect(getApparatusType('Leg press 45')).toBe('prensa');
      expect(getApparatusType('Hack squat')).toBe('hack');
      expect(getApparatusType('Press militar en Smith')).toBe('smith');
      expect(getApparatusType('Press con Mancuerna')).toBe('mancuerna');
      expect(getApparatusType('Jalón en polea alta')).toBe('polea');
      expect(getApparatusType('Press de banca plano')).toBe('barra');
    });
  });

  describe('isStrictlyBilateralExercise', () => {
    it('detecta ejercicios estrictamente bilaterales', () => {
      expect(isStrictlyBilateralExercise({ name: 'Press con barra recta' })).toBe(true);
      expect(isStrictlyBilateralExercise({ name: 'Press inclinado en Smith' })).toBe(true);
      expect(isStrictlyBilateralExercise({ name: 'Leg press 45°' })).toBe(true);
      expect(isStrictlyBilateralExercise({ name: 'Prensa horizontal' })).toBe(true);
    });

    it('retorna false para ejercicios unilaterales o libres', () => {
      expect(isStrictlyBilateralExercise({ name: 'Curl de bíceps alterno' })).toBe(false);
      expect(isStrictlyBilateralExercise({ name: 'Elevaciones laterales con mancuerna' })).toBe(false);
      expect(isStrictlyBilateralExercise({ name: 'Bayesian cable curl' })).toBe(false);
    });
  });

  describe('getSetCompletedBadge', () => {
    it('retorna null si la serie no está completada', () => {
      expect(getSetCompletedBadge({ isDone: false })).toBeNull();
    });

    it('retorna badge Extra cuando isExtraSet es true', () => {
      const badge = getSetCompletedBadge({ isDone: true, isExtraSet: true });
      expect(badge.text).toContain('Extra');
      expect(badge.color).toBe('var(--accent-blue)');
    });

    it('retorna badge de aumento de carga cuando deltaWeight > 0', () => {
      const badge = getSetCompletedBadge({
        isDone: true,
        isExtraSet: false,
        deltaWeight: 5,
        isPr: true
      });
      expect(badge.text).toContain('PR!');
      expect(badge.text).toContain('+5#');
      expect(badge.color).toBe('var(--accent-emerald)');
    });

    it('retorna badge de aumento de repeticiones cuando deltaWeight === 0 y deltaReps > 0', () => {
      const badge = getSetCompletedBadge({
        isDone: true,
        isExtraSet: false,
        deltaWeight: 0,
        deltaReps: 2,
        isPr: false
      });
      expect(badge.text).toContain('+2r');
      expect(badge.color).toBe('var(--accent-cyan)');
    });

    it('retorna badge de consolidación cuando deltaWeight === 0 y deltaReps === 0', () => {
      const badge = getSetCompletedBadge({
        isDone: true,
        isExtraSet: false,
        deltaWeight: 0,
        deltaReps: 0,
        weightNum: 100
      });
      expect(badge.text).toContain('100# Consolidado');
    });

    it('retorna badge de back-off cuando deltaWeight < 0', () => {
      const badge = getSetCompletedBadge({
        isDone: true,
        isExtraSet: false,
        deltaWeight: -10
      });
      expect(badge.text).toContain('Back-off');
    });

    it('retorna badge de fatiga cuando deltaReps < 0 y RPE >= 9.5', () => {
      const badge = getSetCompletedBadge({
        isDone: true,
        isExtraSet: false,
        deltaWeight: 0,
        deltaReps: -3,
        repsNum: 7,
        prevRepsNum: 10,
        rpeNum: 10
      });
      expect(badge.text).toContain('Fatiga');
    });
  });

  describe('getRpeColorStyle', () => {
    it('asigna esmeralda para RPE <= 8', () => {
      const style = getRpeColorStyle('7.5');
      expect(style.rpeColor).toBe('var(--accent-emerald)');
    });

    it('asigna ámbar para RPE <= 9', () => {
      const style = getRpeColorStyle('8.5');
      expect(style.rpeColor).toBe('var(--accent-amber)');
    });

    it('asigna rojo para RPE > 9', () => {
      const style = getRpeColorStyle('9.5');
      expect(style.rpeColor).toBe('var(--accent-red)');
    });
  });

  describe('safeVibrate', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('no lanza error si navigator.vibrate no existe o no es invocable', () => {
      const originalVibrate = globalThis.navigator?.vibrate;
      try {
        Object.defineProperty(globalThis.navigator, 'vibrate', {
          value: undefined,
          configurable: true,
          writable: true
        });
        expect(() => safeVibrate(20)).not.toThrow();
      } finally {
        Object.defineProperty(globalThis.navigator, 'vibrate', {
          value: originalVibrate,
          configurable: true,
          writable: true
        });
      }
    });

    it('llama a navigator.vibrate cuando está disponible', () => {
      const vibrateMock = vi.fn();
      Object.defineProperty(globalThis.navigator, 'vibrate', {
        value: vibrateMock,
        configurable: true,
        writable: true
      });
      safeVibrate(25);
      expect(vibrateMock).toHaveBeenCalledWith(25);
    });

    it('captura excepciones de navigator.vibrate sin romper la ejecución', () => {
      const throwingVibrate = vi.fn().mockImplementation(() => {
        throw new Error('NotAllowedError');
      });
      Object.defineProperty(globalThis.navigator, 'vibrate', {
        value: throwingVibrate,
        configurable: true,
        writable: true
      });
      expect(() => safeVibrate(30)).not.toThrow();
    });
  });
});
