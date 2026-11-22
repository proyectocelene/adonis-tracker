import { describe, it, expect } from 'vitest';
import {
  stripSensitiveBackupKeys,
  sanitizeWorkoutHistory
} from '../src/services/backupService.js';

describe('backupService', () => {
  describe('stripSensitiveBackupKeys', () => {
    it('debe devolver null, undefined o valores primitivos sin cambios', () => {
      expect(stripSensitiveBackupKeys(null)).toBeNull();
      expect(stripSensitiveBackupKeys(undefined)).toBeUndefined();
      expect(stripSensitiveBackupKeys('string')).toBe('string');
      expect(stripSensitiveBackupKeys(123)).toBe(123);
    });

    it('debe eliminar claves de API y credenciales de DeepSeek en cualquier nivel', () => {
      const backupData = {
        exportDate: '2026-11-22',
        coachv2_deepseek_api_key: 'sk-deepseek-secret-123',
        coachv2_6TZZ3E_deepseek_api_key: 'sk-user-secret-456',
        apiKey: 'secret-key-789',
        nested: {
          deepseek_token: 'secret-token',
          regularData: 'Keep this',
          deepSeekApiKey: 'secret-nested'
        },
        workoutHistory: [
          { id: 'ses_1', date: '2026-11-22' }
        ],
        machineConfigs: {
          m1: { seat: 2 }
        }
      };

      const cleaned = stripSensitiveBackupKeys(backupData);
      expect(cleaned.coachv2_deepseek_api_key).toBeUndefined();
      expect(cleaned.coachv2_6TZZ3E_deepseek_api_key).toBeUndefined();
      expect(cleaned.apiKey).toBeUndefined();
      expect(cleaned.nested.deepseek_token).toBeUndefined();
      expect(cleaned.nested.deepSeekApiKey).toBeUndefined();

      // Debe preservar datos legítimos del usuario
      expect(cleaned.exportDate).toBe('2026-11-22');
      expect(cleaned.nested.regularData).toBe('Keep this');
      expect(cleaned.workoutHistory).toHaveLength(1);
      expect(cleaned.machineConfigs.m1.seat).toBe(2);
    });

    it('debe limpiar arrays de objetos de forma recursiva', () => {
      const arr = [
        { id: 1, apiKey: 'abc', name: 'Safe' },
        { id: 2, deepseek_key: 'xyz', name: 'Also Safe' }
      ];
      const cleaned = stripSensitiveBackupKeys(arr);
      expect(cleaned).toEqual([
        { id: 1, name: 'Safe' },
        { id: 2, name: 'Also Safe' }
      ]);
    });
  });

  describe('sanitizeWorkoutHistory', () => {
    it('debe devolver un array vacío para entradas inválidas', () => {
      expect(sanitizeWorkoutHistory(null)).toEqual([]);
      expect(sanitizeWorkoutHistory(undefined)).toEqual([]);
      expect(sanitizeWorkoutHistory('not-an-array')).toEqual([]);
    });

    it('debe reparar la fecha ISO a partir de dateString en español cuando date falta', () => {
      const rawSessions = [
        {
          id: 'ses_1',
          dateString: '15 de agosto de 2026',
          exercises: {
            ex1: { name: 'Press', sets: [{ reps: 10, weight: 100 }] }
          }
        },
        {
          id: 'ses_2',
          dateString: '20 de septiembre',
          exercises: {
            ex1: { name: 'Prensa', sets: [{ reps: 12, weight: 200 }] }
          }
        }
      ];

      const sanitized = sanitizeWorkoutHistory(rawSessions);
      expect(sanitized[0].date).toBe('2026-08-15');
      expect(sanitized[1].date).toBe('2026-09-20');
    });

    it('debe reparar la fecha ISO a partir de timestamp si date no existe', () => {
      const rawSessions = [
        {
          id: 'ses_ts',
          timestamp: '2026-10-05T14:30:00.000Z',
          exercises: {
            ex1: { name: 'Curl', sets: [{ reps: 10, weight: 40 }] }
          }
        }
      ];

      const sanitized = sanitizeWorkoutHistory(rawSessions);
      expect(sanitized[0].date).toBe('2026-10-05');
    });

    it('debe eliminar la bandera isWarmupDone y nodos corruptos de ejercicios sin series ni nombres', () => {
      const rawSessions = [
        {
          id: 'ses_clean',
          date: '2026-11-20',
          exercises: {
            isWarmupDone: true,
            corruptExercise: {
              machineConfig: { seat: 4 }
              // Sin sets, sin reps, sin nombre -> Debe ser purgado
            },
            validExercise: {
              name: 'Jalón al pecho',
              sets: [{ weight: 120, reps: 10 }]
            }
          }
        }
      ];

      const sanitized = sanitizeWorkoutHistory(rawSessions);
      const exercises = sanitized[0].exercises;
      expect(exercises.isWarmupDone).toBeUndefined();
      expect(exercises.corruptExercise).toBeUndefined();
      expect(exercises.validExercise).toBeDefined();
      expect(exercises.validExercise.name).toBe('Jalón al pecho');
    });

    it('debe ordenar las sesiones en orden cronológico ascendente estricto', () => {
      const unsorted = [
        { id: 'ses_nov', date: '2026-11-01' },
        { id: 'ses_ago', date: '2026-08-15' },
        { id: 'ses_sep', date: '2026-09-10' }
      ];

      const sanitized = sanitizeWorkoutHistory(unsorted);
      expect(sanitized.map(s => s.id)).toEqual(['ses_ago', 'ses_sep', 'ses_nov']);
    });
  });
});
