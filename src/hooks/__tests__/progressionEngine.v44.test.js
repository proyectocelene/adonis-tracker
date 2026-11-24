import { describe, it, expect } from 'vitest';
import {
  DEFAULT_ULTRAGYM_MACHINES,
  resolveEffectiveMachineConfig,
  getActiveMachineConfig,
  getUnifiedExerciseTarget,
  analyzeExercisePerformance,
  getOverloadTarget,
  getNextAttainableWeight,
  calculate1RM,
  isEpleyReliable,
  calculate1RMWithMeta
} from '../useWorkoutCalculations.js';
import { calculateSessionVolumeAndSets } from '../../utils/sessionDataHelper.js';

describe('Progression Engine v4.4 + Perfiles ULTRAGYM', () => {
  describe('a) Perfiles ULTRAGYM e incrementos exactos', () => {
    it('resuelve perfiles ULTRAGYM por unifiedCode sin sobrescribir perfiles personalizados', () => {
      const nitroEx = { unifiedCode: '[PECH-INC_PRESS-NITRO_01]', name: 'Nitro Incline' };
      const nitroCfg = getActiveMachineConfig([], {}, {}, nitroEx);
      expect(nitroCfg).toMatchObject({ type: 'stack', firstPlate: 20, plateStep: 15 });

      const userCustom = [{ id: 'custom_1', name: 'Mi Nitro', type: 'stack', firstPlate: 10, plateStep: 10, isDefault: true, v44Verified: true }];
      const preserved = getActiveMachineConfig(userCustom, {}, {}, nitroEx);
      expect(preserved.id).toBe('custom_1');
      expect(preserved.plateStep).toBe(10);
    });

    it('calcula incrementos exactos de gimnasio ULTRAGYM (Nitro, Abductores, Chest Press, Butt Blaster)', () => {
      const nitroCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[PECH-INC_PRESS-NITRO_01]' });
      expect(getNextAttainableWeight(125, nitroCfg, 'up')).toBe(140);

      const abdCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[ABDU-ABDUCTOR-STACK_01]' });
      expect(getNextAttainableWeight(185, abdCfg, 'up')).toBe(200);

      const chestCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[PECH-CHEST_PRESS-CONV_01]' });
      expect(getNextAttainableWeight(155, chestCfg, 'up')).toBe(160);

      const buttCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[GLUT-BUTT_BLASTER-MAQ_01]' });
      expect(getNextAttainableWeight(150, buttCfg, 'up')).toBe(162.5);

      expect(DEFAULT_ULTRAGYM_MACHINES['[PECH-INC_PRESS-MANC_30]'].dumbbellStep).toBe(10);
    });
  });

  describe('b) Filtrado de ghost sets y feeder sets en S1', () => {
    it('ignora ghost sets (0# o reps <= 0 o setNum <= 0) y filtra feeder S1 (70# antes de 90# en Incline DB)', () => {
      const inclineDbCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[PECH-INC_PRESS-MANC_30]' });
      const prevData = {
        '0': { weight: 50, reps: 10, completed: true, isWarmup: true },
        '1': { weight: 70, reps: 10, completed: true }, // feeder erróneo (< 85% de 90#)
        '2': { weight: 90, reps: 10, completed: true, rpe: '8' },
        '3': { weight: 90, reps: 9, completed: true, rpe: '8' },
        '4': { weight: 0, reps: 0, completed: true }    // ghost set
      };

      const target = getUnifiedExerciseTarget(prevData, '8-10', inclineDbCfg);
      expect(target.anchorWeight).toBe(90);
      expect(target.perSetTargets.length).toBe(2);
      // En S1=90x10 y S2=90x9 con jumpPct = 10/90 = 11.1% (>= 8%), S1 sube a 100x8 y S2 consolida 90x10
      expect(target.perSetTargets[0]).toEqual({ setNum: 1, weight: 100, reps: 8 });
      expect(target.perSetTargets[1]).toEqual({ setNum: 2, weight: 90, reps: 10 });
      expect(target.perSetTargets[0].weight).toBeGreaterThanOrEqual(target.perSetTargets[1].weight);
    });

    it('ordena working sets descendentemente por (weight, reps) para evitar metas invertidas', () => {
      const chestCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[PECH-CHEST_PRESS-CONV_01]' });
      const prevData = {
        '1': { weight: 140, reps: 9, completed: true },
        '2': { weight: 155, reps: 10, completed: true },
        '3': { weight: 155, reps: 8, completed: true }
      };

      const target = getUnifiedExerciseTarget(prevData, '8-10', chestCfg);
      expect(target.anchorWeight).toBe(155);
      for (let i = 1; i < target.perSetTargets.length; i++) {
        expect(target.perSetTargets[i - 1].weight).toBeGreaterThanOrEqual(target.perSetTargets[i].weight);
      }
    });
  });

  describe('c) Bifurcación Dinámica (>= 8%) vs Clásica (< 8%)', () => {
    it('usa Doble Progresión Dinámica cuando jumpPct >= 8% (ej. Nitro 125 -> 140 = 12%)', () => {
      const nitroCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[PECH-INC_PRESS-NITRO_01]' });
      const prevData = {
        '1': { weight: 125, reps: 10, completed: true, rpe: '8' },
        '2': { weight: 125, reps: 9, completed: true, rpe: '8' },
        '3': { weight: 125, reps: 8, completed: true, rpe: '8' }
      };

      const target = getUnifiedExerciseTarget(prevData, '8-10', nitroCfg);
      expect(target.progressionMode).toBe('dynamic');
      expect(target.canProgressWeight).toBe(true);
      expect(target.perSetTargets).toEqual([
        { setNum: 1, weight: 140, reps: 8 },
        { setNum: 2, weight: 125, reps: 10 },
        { setNum: 3, weight: 125, reps: 9 }
      ]);

      const s1 = getOverloadTarget(1, prevData, '8-10', nitroCfg);
      const s2 = getOverloadTarget(2, prevData, '8-10', nitroCfg);
      expect(s1.suggestedWeight).toBe(140);
      expect(s1.suggestedReps).toBe(8);
      expect(s2.suggestedWeight).toBe(125);
      expect(s2.suggestedReps).toBe(10);
    });

    it('usa Doble Progresión Clásica cuando jumpPct < 8% (ej. Chest Press 155 -> 160 = 3.2%) y bloquea si rpe >= 9.5', () => {
      const chestCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[PECH-CHEST_PRESS-CONV_01]' });
      const prevReady = {
        '1': { weight: 155, reps: 10, completed: true, rpe: '8' },
        '2': { weight: 155, reps: 10, completed: true, rpe: '8' },
        '3': { weight: 155, reps: 9, completed: true, rpe: '8' }
      };

      const targetReady = getUnifiedExerciseTarget(prevReady, '8-10', chestCfg);
      expect(targetReady.progressionMode).toBe('classic');
      expect(targetReady.canProgressWeight).toBe(true);
      expect(targetReady.targetWeight).toBe(160);
      expect(targetReady.perSetTargets).toEqual([
        { setNum: 1, weight: 160, reps: 8 },
        { setNum: 2, weight: 160, reps: 8 },
        { setNum: 3, weight: 160, reps: 8 }
      ]);

      const prevExhausted = {
        '1': { weight: 155, reps: 10, completed: true, rpe: '9.5' },
        '2': { weight: 155, reps: 10, completed: true, rpe: '10' },
        '3': { weight: 155, reps: 10, completed: true, rpe: '9.5' }
      };
      const targetBlocked = getUnifiedExerciseTarget(prevExhausted, '8-10', chestCfg);
      expect(targetBlocked.canProgressWeight).toBe(false);
      expect(targetBlocked.targetWeight).toBe(155);
    });
  });

  describe('d) Regla de Reactivación (>21 días de inactividad)', () => {
    it('mantiene anchorWeight y devuelve strategyType "reactivation" cuando han pasado >21 días', () => {
      const chestCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[PECH-CHEST_PRESS-CONV_01]' });
      const prevData = {
        date: '2026-10-01',
        '1': { weight: 155, reps: 10, completed: true, rpe: '8' },
        '2': { weight: 155, reps: 10, completed: true, rpe: '8' },
        '3': { weight: 155, reps: 10, completed: true, rpe: '8' }
      };

      const target = getUnifiedExerciseTarget(prevData, '8-10', chestCfg, { referenceDate: '2026-10-25' });
      expect(target.strategyType).toBe('reactivation');
      expect(target.canProgressWeight).toBe(false);
      expect(target.targetWeight).toBe(155);
      expect(target.daysSinceLast).toBeGreaterThan(21);
    });
  });

  describe('e) sessionDataHelper excluye C1 (0) y C2 (-1) de series efectivas y volumen', () => {
    it('cuenta C1 (0) y C2 (-1) en warmupSets y los excluye de completedSets y volume', () => {
      const todayWorkoutData = {
        d1_e1: {
          '0': { weight: 75, reps: 10, completed: true, unit: 'lbs' },
          '-1': { weight: 115, reps: 4, completed: true, unit: 'lbs' },
          '1': { weight: 155, reps: 10, completed: true, unit: 'lbs' },
          '2': { weight: 155, reps: 9, completed: true, unit: 'lbs' }
        }
      };

      const summary = calculateSessionVolumeAndSets(todayWorkoutData, [{ id: 'd1_e1', name: 'Chest Press' }]);
      expect(summary.warmupSets).toBe(2);
      expect(summary.completedSets).toBe(2);
      expect(summary.volume).toBe(155 * 10 + 155 * 9);
    });
  });

  describe('f) Bandera auxiliar isEpleyReliable en 1RM', () => {
    it('mantiene retrocompatibilidad de calculate1RM y marca reps <= 15 como confiables', () => {
      expect(calculate1RM(100, 10)).toBe(133);
      expect(isEpleyReliable(15)).toBe(true);
      expect(isEpleyReliable(16)).toBe(false);
      expect(calculate1RMWithMeta(100, 20)).toEqual({ est1RM: 167, isEpleyReliable: false });
    });
  });

  describe('g) Regla anti-alucinación, perfiles posicionales y umbral isExcessiveLoad', () => {
    it('NO muta pesos reales en consolidación ni genera .5 con perfiles viejos (ej. 95# con firstPlate 2.5)', () => {
      const weirdOldProfile = {
        type: 'stack',
        firstPlate: 2.5,
        plateStep: 5,
        availableWeights: [2.5, 7.5, 12.5, 92.5, 97.5]
      };
      const prevConsolidate = {
        '1': { weight: 95, reps: 12, completed: true, rpe: '8' },
        '2': { weight: 95, reps: 11, completed: true, rpe: '8' }
      };
      const res = getUnifiedExerciseTarget(prevConsolidate, '12-15', weirdOldProfile);
      expect(res.anchorWeight).toBe(95);
      expect(res.targetWeight).toBe(95);
      expect(res.perSetTargets[0].weight).toBe(95);

      expect(getNextAttainableWeight(95, weirdOldProfile, 'up')).toBe(100);
    });

    it('consolida 25x10, 8, 8 en rango 10-12 sin bajar carga por isExcessiveLoad', () => {
      const preacherCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]' });
      const prevData = {
        '1': { weight: 25, reps: 10, completed: true, rpe: '8' },
        '2': { weight: 25, reps: 8, completed: true, rpe: '8' },
        '3': { weight: 25, reps: 8, completed: true, rpe: '8' }
      };
      const res = getUnifiedExerciseTarget(prevData, '10-12', preacherCfg);
      expect(res.strategyType).not.toBe('hypertrophy_adjustment');
      expect(res.targetWeight).toBe(25);
    });

    it('mantiene monotonicidad de peso y reps (S1 >= S2 >= S3) en series de peso mixto como 90x12, 75x14, 75x14', () => {
      const latCfg = getActiveMachineConfig([], {}, {}, { unifiedCode: '[HOMB-LAT_RAISE-MAQ_01]' });
      const prevMixed = {
        '1': { weight: 90, reps: 12, completed: true, rpe: '8' },
        '2': { weight: 75, reps: 14, completed: true, rpe: '8' },
        '3': { weight: 75, reps: 14, completed: true, rpe: '8' }
      };
      const res = getUnifiedExerciseTarget(prevMixed, '12-15', latCfg);
      expect(res.perSetTargets[0]).toEqual({ setNum: 1, weight: 90, reps: 13 });
      expect(res.perSetTargets[1]).toEqual({ setNum: 2, weight: 75, reps: 15 });
      expect(res.perSetTargets[2]).toEqual({ setNum: 3, weight: 75, reps: 15 });

      for (let i = 1; i < res.perSetTargets.length; i++) {
        expect(res.perSetTargets[i].weight).toBeLessThanOrEqual(res.perSetTargets[i - 1].weight);
        if (res.perSetTargets[i].weight === res.perSetTargets[i - 1].weight) {
          expect(res.perSetTargets[i].reps).toBeLessThanOrEqual(res.perSetTargets[i - 1].reps);
        }
      }
    });

    it('sanitiza perfiles heredados desalineados usando DEFAULT_ULTRAGYM sin borrar notas de estación del usuario', () => {
      const legacyProfile = {
        id: 'prof_old',
        name: 'Planta Alta (Principal)',
        floor: 'Planta Alta',
        station: 'Chest Press #1',
        seat: '4',
        backrest: '2',
        notes: 'Asiento en muesca 4',
        type: 'stack',
        firstPlate: 20,
        plateStep: 15, // contradice ULTRAGYM Chest Press (plateStep: 5)
        v44Verified: false
      };
      const chestEx = { unifiedCode: '[PECH-CHEST_PRESS-CONV_01]' };
      const sanitized = resolveEffectiveMachineConfig(legacyProfile, chestEx, 155);
      expect(sanitized.plateStep).toBe(5);
      expect(sanitized.seat).toBe('4');
      expect(sanitized.notes).toBe('Asiento en muesca 4');

      // Si tiene v44Verified: true, siempre manda el perfil del usuario
      const verified = resolveEffectiveMachineConfig({ ...legacyProfile, v44Verified: true }, chestEx, 155);
      expect(verified.plateStep).toBe(15);
    });

    it('analyzeExercisePerformance alinea setRecommendations 1:1 con perSetTargets (Hack Squat 270x8,7,8,8 -> 270x9)', () => {
      const hackEx = { unifiedCode: '[CUAD-HACK_SQUAT-DISC_01]', name: 'Hack Squat', sets: 3, reps: '6-10' };
      const prevHack = {
        date: '2026-11-17',
        '1': { weight: 270, reps: 8, completed: true },
        '2': { weight: 270, reps: 7, completed: true },
        '3': { weight: 270, reps: 8, completed: true },
        '4': { weight: 270, reps: 8, completed: true }
      };
      const analysis = analyzeExercisePerformance(prevHack, '6-10', null, { exercise: hackEx });
      expect(analysis.unifiedTarget.perSetTargets[0]).toEqual({ setNum: 1, weight: 270, reps: 9 });
      expect(analysis.setRecommendations[1].suggestedWeight).toBe(270);
      expect(analysis.setRecommendations[1].suggestedReps).toBe(9);
      expect(analysis.setRecommendations[2].suggestedReps).toBe(9);
      expect(analysis.setRecommendations[3].suggestedReps).toBe(9);
    });
  });
});
