import { describe, it, expect } from 'vitest';
import {
  getUnifiedCodeForExercise,
  getHistoricalRecordsForExercise
} from '../src/utils/exerciseMatcher.js';

describe('exerciseMatcher', () => {
  describe('getUnifiedCodeForExercise', () => {
    it('debe devolver null para ejercicios nulos o indefinidos', () => {
      expect(getUnifiedCodeForExercise(null)).toBeNull();
      expect(getUnifiedCodeForExercise(undefined)).toBeNull();
    });

    it('debe respetar el unifiedCode ya establecido en formato canónico de 3 segmentos', () => {
      const ex = { unifiedCode: '[PECH-INC_PRESS-NITRO_01]', name: 'Press Inclinado' };
      const parsed = getUnifiedCodeForExercise(ex);
      expect(parsed?.canonical).toBe('[PECH-INC_PRESS-NITRO_01]');
      expect(parsed?.group).toBe('PECH');
      expect(parsed?.machine).toBe('INC_PRESS');
      expect(parsed?.spec).toBe('NITRO_01');
    });

    it('debe mapear códigos legados de versiones anteriores al código canónico actual', () => {
      expect(getUnifiedCodeForExercise({ unifiedCode: '[PECH-MAQ-01]' })?.canonical).toBe('[PECH-CHEST_PRESS-CONV_01]');
      expect(getUnifiedCodeForExercise({ unifiedCode: '[CUAD-PRENS-01]' })?.canonical).toBe('[CUAD-LEG_PRESS-DISC_45_PB]');
      expect(getUnifiedCodeForExercise({ unifiedCode: '[ESPA-PULL-01]' })?.canonical).toBe('[ESPA-PULLDOWN-WIDE_01]');
      expect(getUnifiedCodeForExercise({ unifiedCode: '[HOMB-LAT-01]' })?.canonical).toBe('[HOMB-LAT_RAISE-MAQ_01]');
      expect(getUnifiedCodeForExercise({ unifiedCode: '[ISQU-CURL-01]' })?.canonical).toBe('[ISQU-LEG_CURL-SEATED_01]');
    });

    it('debe resolver códigos canónicos a partir del id histórico de rutina (d1_e1, etc.)', () => {
      const exD1 = { id: 'd1_e1' };
      const parsedD1 = getUnifiedCodeForExercise(exD1);
      expect(parsedD1?.canonical).toBe('[PECH-INC_PRESS-MANC_30]');
      expect(parsedD1?.canonical).toMatch(/^\[[A-Z]{4}-[A-Z0-9_]+-[A-Z0-9_]+\]$/);
    });

    it('debe resolver variantes a partir de nombres de la base de datos real', () => {
      const ex = { name: 'Press Inclinado en Máquina (Nitro Incline)' };
      const parsed = getUnifiedCodeForExercise(ex);
      expect(parsed?.canonical).toBe('[PECH-INC_PRESS-NITRO_01]');
    });

    it('AISLAMIENTO BIOMECÁNICO ESTRICTO: Diferentes variantes biomecánicas NUNCA comparten el mismo código', () => {
      // Inclinado con mancuernas vs máquina convergente
      const mancIncline = getUnifiedCodeForExercise({ name: 'Press Inclinado con Mancuernas (Banco a 30°)' })?.canonical;
      const machineIncline = getUnifiedCodeForExercise({ name: 'Press Inclinado en Máquina (Nitro Incline)' })?.canonical;
      expect(mancIncline).not.toBe(machineIncline);
      expect(mancIncline).toBe('[PECH-INC_PRESS-MANC_30]');
      expect(machineIncline).toBe('[PECH-INC_PRESS-NITRO_01]');

      // Prensa 45° cuádriceps vs Prensa pies altos glúteo
      const quadPress = getUnifiedCodeForExercise({ unifiedCode: '[CUAD-LEG_PRESS-DISC_45_PB]' })?.canonical;
      const glutePress = getUnifiedCodeForExercise({ unifiedCode: '[GLUT-LEG_PRESS-HIGH_FEET_45]' })?.canonical;
      expect(quadPress).not.toBe(glutePress);
      expect(quadPress).toBe('[CUAD-LEG_PRESS-DISC_45_PB]');
      expect(glutePress).toBe('[GLUT-LEG_PRESS-HIGH_FEET_45]');
    });
  });

  describe('getHistoricalRecordsForExercise', () => {
    const targetExercise = {
      id: 'd1_e1',
      name: 'Press Inclinado en Máquina (Nitro Incline)',
      unifiedCode: '[PECH-INC_PRESS-NITRO_01]'
    };

    const mockHistory = [
      {
        id: 'ses_1',
        date: '2026-08-15',
        exercises: {
          exA: {
            name: 'Press Inclinado en Máquina (Nitro Incline)',
            unifiedCode: '[PECH-INC_PRESS-NITRO_01]',
            sets: [
              { weight: 100, reps: 10, completed: true },
              { weight: 120, reps: 8, completed: true },
              { weight: 140, reps: 0, completed: false } // No completada -> Debe ser ignorada
            ]
          },
          exB: {
            name: 'Pec Deck',
            unifiedCode: '[PECH-PEC_DECK-STACK_01]',
            sets: [{ weight: 80, reps: 12, completed: true }]
          }
        }
      },
      {
        id: 'ses_2',
        date: '2026-08-22',
        exercises: {
          exA: {
            name: 'Press Inclinado en Máquina (Nitro Incline)',
            unifiedCode: '[PECH-INC_PRESS-NITRO_01]',
            sets: [
              { weight: 130, reps: 8, completed: true }
            ]
          }
        }
      }
    ];

    it('debe devolver estructura vacía si no hay historial o ejercicio', () => {
      const res = getHistoricalRecordsForExercise(null, mockHistory);
      expect(res.sessionOccurrences).toEqual([]);
      expect(res.hasHistory).toBe(false);

      const resEmpty = getHistoricalRecordsForExercise(targetExercise, []);
      expect(resEmpty.sessionOccurrences).toEqual([]);
      expect(resEmpty.hasHistory).toBe(false);
    });

    it('debe extraer únicamente sesiones y series completadas para el ejercicio coincidente', () => {
      const result = getHistoricalRecordsForExercise(targetExercise, mockHistory);
      expect(result.sessionOccurrences).toHaveLength(2);
      expect(result.hasHistory).toBe(true);

      // Primera sesión
      const occ1 = result.sessionOccurrences[0];
      expect(occ1.sessionId).toBe('ses_1');
      expect(occ1.maxWeight).toBe(120);

      // Segunda sesión
      const occ2 = result.sessionOccurrences[1];
      expect(occ2.sessionId).toBe('ses_2');
      expect(occ2.maxWeight).toBe(130);

      // PR Weight de todo el historial
      expect(result.prWeight).toBe(130);
    });
  });
});
