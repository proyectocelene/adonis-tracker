import { describe, it, expect } from 'vitest';
import { scientificProtocol, PROTOCOL_VERSION } from '../scientificProtocol.js';
import { UNIFIED_EXERCISE_LIBRARY } from '../unifiedExerciseLibrary.js';
import { DEFAULT_ULTRAGYM_MACHINES, getActiveMachineConfig } from '../../utils/machineManager.js';
import { getPreviousDataForExercise } from '../../utils/exerciseMatcher.js';

describe('Protocolo Adonis v4.4 + Aislamiento entre máquinas', () => {
  it('a) suma exactamente 94 series de fuerza (d1=14, d2=16, d3=16, d4=16, d5=16, d6=16) y cardio Zona 2 en D1-D6', () => {
    expect(PROTOCOL_VERSION).toBe('4.4');
    expect(scientificProtocol).toHaveLength(6);

    const expectedStrengthByDay = {
      d1: 14,
      d2: 16,
      d3: 16,
      d4: 16,
      d5: 16,
      d6: 16
    };

    let totalStrengthSets = 0;
    for (const day of scientificProtocol) {
      const strengthExercises = day.exercises.filter(ex => !ex.isCardio);
      const cardioExercises = day.exercises.filter(ex => ex.isCardio);
      const daySum = strengthExercises.reduce((acc, ex) => acc + Number(ex.sets || 0), 0);

      expect(daySum).toBe(expectedStrengthByDay[day.id]);
      expect(cardioExercises).toHaveLength(1);
      expect(cardioExercises[0].unifiedCode).toBe('[CARD-TREADMILL-INCLINE_01]');
      totalStrengthSets += daySum;
    }

    expect(totalStrengthSets).toBe(94);
  });

  it('b) todo ejercicio de fuerza tiene su unifiedCode en UNIFIED_EXERCISE_LIBRARY y resuelve machineConfig desde DEFAULT_ULTRAGYM_MACHINES', () => {
    const libraryCodes = new Set(UNIFIED_EXERCISE_LIBRARY.map(item => item.unifiedCode));

    for (const day of scientificProtocol) {
      for (const ex of day.exercises) {
        expect(libraryCodes.has(ex.unifiedCode)).toBe(true);
        if (!ex.isCardio) {
          expect(DEFAULT_ULTRAGYM_MACHINES[ex.unifiedCode]).toBeDefined();
          const resolvedConfig = getActiveMachineConfig([], {}, {}, ex);
          expect(resolvedConfig).not.toBeNull();
          expect(resolvedConfig.unit).toBe('lbs');
        }
      }
    }
  });

  it('c) getPreviousDataForExercise NO contamina máquinas distintas (Crunch Cable vs Declinado; Polea Tras Espalda vs Máquina Lateral)', () => {
    const workoutHistory = [
      {
        id: 'ses_old_1',
        date: '2026-10-10',
        exercises: {
          d2_e6: {
            id: 'd2_e6',
            name: 'Crunch Declinado con Disco (Decline Plate-Weighted Crunch)',
            unifiedCode: '[ABDO-DECLINE_CRUNCH-DISC_01]',
            sets: [
              { setNum: 1, weight: 35, reps: 15, completed: true, unit: 'lbs' }
            ]
          },
          d1_e4: {
            id: 'd1_e4',
            name: 'Elevaciones Laterales en Máquina',
            unifiedCode: '[HOMB-LAT_RAISE-MAQ_01]',
            sets: [
              { setNum: 1, weight: 90, reps: 15, completed: true, unit: 'lbs' }
            ]
          }
        }
      }
    ];

    const cableCrunch = {
      id: 'd2_e6',
      name: 'Flexión Espinal Lastrada: Cable Crunch en Polea Alta',
      unifiedCode: '[ABDO-CRUNCH-CABLE_01]'
    };
    const prevCrunch = getPreviousDataForExercise(cableCrunch, 'd2', 1, workoutHistory, {});
    expect(prevCrunch).toEqual({});

    const behindCableLateral = {
      id: 'd4_e2',
      name: 'Elevaciones Laterales en Polea Baja (Tras Espalda)',
      unifiedCode: '[HOMB-LAT_RAISE-BEHIND_CABLE_01]'
    };
    const prevLateral = getPreviousDataForExercise(behindCableLateral, 'd4', 1, workoutHistory, {});
    expect(prevLateral).toEqual({});
  });

  it('d) Elevaciones Laterales en Máquina o Polea mapea a [HOMB-LAT_RAISE-MAQ_01] sin contaminar Polea Tras Espalda y no lee slots posicionales en machineManager', () => {
    const workoutHistory = [
      {
        id: 'ses_lat_maq',
        date: '2026-11-23',
        exercises: {
          d1_e4: {
            name: 'Elevaciones Laterales en Máquina o Polea',
            '1': { weight: 70, reps: 5, completed: true },
            '2': { weight: 90, reps: 12, completed: true },
            '3': { weight: 75, reps: 14, completed: true }
          }
        }
      }
    ];

    const maqLat = { id: 'd1_e2', name: 'Elevaciones Laterales en Máquina', unifiedCode: '[HOMB-LAT_RAISE-MAQ_01]' };
    const prevMaq = getPreviousDataForExercise(maqLat, 'd1', 1, workoutHistory, {});
    expect(prevMaq.date).toBe('2026-11-23');
    expect(prevMaq['2']?.weight).toBe('90');

    const behindLat = { id: 'd4_e2', name: 'Elevaciones Laterales en Polea Baja (Tras Espalda)', unifiedCode: '[HOMB-LAT_RAISE-BEHIND_CABLE_01]' };
    const prevBehind = getPreviousDataForExercise(behindLat, 'd4', 1, workoutHistory, {});
    expect(prevBehind).toEqual({});

    // Un perfil guardado bajo slot posicional viejo d4_e2 NO debe contaminar a behindLat
    const cfg = getActiveMachineConfig([], {}, {}, behindLat);
    expect(cfg.plateStep).toBe(5);
  });

  it('e) [HOMB-LAT_RAISE-BEHIND_CABLE_01] NO hereda registros históricos de [HOMB-LAT_RAISE-CABLE_01] (2026-08-13)', () => {
    const workoutHistory = [
      {
        id: 'ses_2026_08_13',
        date: '2026-08-13',
        exercises: {
          d4_e5: {
            name: 'Elevaciones Laterales en Polea Baja',
            '1': { weight: 80, reps: 10, completed: true },
            '2': { weight: 80, reps: 12, completed: true }
          }
        }
      }
    ];
    const behindCable = {
      id: 'd4_e2',
      name: 'Elevaciones Laterales en Polea Baja (Tras Espalda)',
      unifiedCode: '[HOMB-LAT_RAISE-BEHIND_CABLE_01]',
      equivalents: [{ unifiedCode: '[HOMB-LAT_RAISE-CABLE_01]', name: 'Elevaciones Laterales en Polea Baja a una Mano' }]
    };
    expect(getPreviousDataForExercise(behindCable, 'd4', 1, workoutHistory, {})).toEqual({});
  });
});
