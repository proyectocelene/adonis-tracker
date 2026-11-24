import { describe, it, expect } from 'vitest';
import {
  computeExercisePeriodStats,
  buildNextSessionCardData
} from '../progressionStatsHelper.js';

describe('Progression Stats Helper & Next Session Card (v4.5)', () => {
  it('a) computeExercisePeriodStats calcula Peso y Reps (max/avg/min), excluye warmups/proyecciones, ignora >15r en 1RM y detecta tendencia', () => {
    const progressingPoints = [
      {
        date: '2026-11-01',
        weight: 145,
        reps: 10,
        isProjected: false,
        detailedSets: [
          { setNum: 0, weight: 70, reps: 10, isWarmup: true },
          { setNum: 1, weight: 145, reps: 10, isWarmup: false },
          { setNum: 2, weight: 145, reps: 9, isWarmup: false }
        ]
      },
      {
        date: '2026-11-10',
        weight: 155,
        reps: 10,
        isProjected: false,
        detailedSets: [
          { setNum: 1, weight: 155, reps: 10, isWarmup: false },
          { setNum: 2, weight: 145, reps: 18, isWarmup: false } // >15r ignorada para bestE1RM
        ]
      },
      {
        date: '2026-11-20 (Proy)',
        weight: 165,
        reps: 10,
        isProjected: true
      }
    ];

    const statsProg = computeExercisePeriodStats(progressingPoints);
    expect(statsProg.sessionsCount).toBe(2);
    expect(statsProg.weight).toEqual({ max: 155, avg: 147.5, min: 145 });
    expect(statsProg.reps).toEqual({ max: 18, avg: 11.8, min: 9 });
    // Mejor 1RM <=15r debe venir de 155x10 (Math.round(155*(1+10/30)) = 207), NO de 145x18
    expect(statsProg.bestE1RM).toBe(207);
    expect(statsProg.trend.status).toBe('progressing');
    expect(statsProg.trend.weightDelta).toBe(10);

    const stagnantPoints = [
      {
        date: '2026-11-01',
        weight: 100,
        reps: 10,
        detailedSets: [
          { setNum: 1, weight: 100, reps: 10 },
          { setNum: 2, weight: 100, reps: 10 }
        ]
      },
      {
        date: '2026-11-08',
        weight: 100,
        reps: 10,
        detailedSets: [
          { setNum: 1, weight: 100, reps: 10 },
          { setNum: 2, weight: 100, reps: 9 }
        ]
      },
      {
        date: '2026-11-15',
        weight: 100,
        reps: 9,
        detailedSets: [
          { setNum: 1, weight: 100, reps: 9 },
          { setNum: 2, weight: 100, reps: 9 }
        ]
      }
    ];
    const statsStag = computeExercisePeriodStats(stagnantPoints);
    expect(statsStag.trend.status).toBe('stagnant');
  });

  it('b) buildNextSessionCardData resuelve Clásica (<8%), Dinámica (>=8%), Reactivación (>21d) y Calibración Inicial', () => {
    // 1. Salto pequeño (<8%): Chest Press 155x10x3 -> Clásica 160x8
    const chestEx = {
      id: 'd4_e1',
      unifiedCode: '[PECH-CHEST_PRESS-CONV_01]',
      name: 'Press de Pecho en Máquina Convergente (Chest Press)',
      sets: 3,
      reps: '8-10'
    };
    const chestHistory = [
      {
        id: 'h1',
        date: '2026-11-23',
        exercises: {
          d4_e1: {
            unifiedCode: '[PECH-CHEST_PRESS-CONV_01]',
            name: 'Press de Pecho en Máquina Convergente (Chest Press)',
            '1': { weight: 155, reps: 10, completed: true },
            '2': { weight: 155, reps: 10, completed: true },
            '3': { weight: 155, reps: 10, completed: true }
          }
        }
      }
    ];
    const chestCard = buildNextSessionCardData({
      exercise: chestEx,
      workoutHistory: chestHistory,
      referenceDate: '2026-11-24'
    });
    expect(chestCard.hasData).toBe(true);
    expect(chestCard.perSetTargets).toEqual([
      { setNum: 1, weight: 160, reps: 8 },
      { setNum: 2, weight: 160, reps: 8 },
      { setNum: 3, weight: 160, reps: 8 }
    ]);
    expect(chestCard.formulaLabel).toContain('Doble Progresión Clásica');
    expect(chestCard.lastWorkingSetsSummary).toBe('155×10, 10, 10');

    // 2. Salto grande (>=8%): Elevaciones Laterales en Máquina 90x12 / 75x14 / 75x14 -> Dinámica 90x13 / 75x15 / 75x15
    const latEx = {
      id: 'd1_e2',
      unifiedCode: '[HOMB-LAT_RAISE-MAQ_01]',
      name: 'Elevaciones Laterales en Máquina',
      sets: 3,
      reps: '12-15'
    };
    const latHistory = [
      {
        id: 'h2',
        date: '2026-11-23',
        exercises: {
          d1_e2: {
            unifiedCode: '[HOMB-LAT_RAISE-MAQ_01]',
            name: 'Elevaciones Laterales en Máquina',
            '1': { weight: 90, reps: 12, completed: true },
            '2': { weight: 75, reps: 14, completed: true },
            '3': { weight: 75, reps: 14, completed: true }
          }
        }
      }
    ];
    const latCard = buildNextSessionCardData({
      exercise: latEx,
      workoutHistory: latHistory,
      referenceDate: '2026-11-24'
    });
    expect(latCard.formulaLabel).toContain('Doble Progresión Dinámica');
    expect(latCard.perSetTargets).toEqual([
      { setNum: 1, weight: 90, reps: 13 },
      { setNum: 2, weight: 75, reps: 15 },
      { setNum: 3, weight: 75, reps: 15 }
    ]);

    // 3. Inactividad >21d -> Reactivación
    const oldCard = buildNextSessionCardData({
      exercise: chestEx,
      workoutHistory: [{ ...chestHistory[0], date: '2026-10-01' }],
      referenceDate: '2026-11-24'
    });
    expect(oldCard.strategyType).toBe('reactivation');
    expect(oldCard.formulaLabel).toContain('Reactivación');

    // 4. Sin historial -> Calibración Inicial
    const initCard = buildNextSessionCardData({
      exercise: chestEx,
      workoutHistory: [],
      referenceDate: '2026-11-24'
    });
    expect(initCard.hasData).toBe(false);
    expect(initCard.strategyType).toBe('initial');
    expect(initCard.formulaLabel).toBe('Calibración Inicial');
  });
});
