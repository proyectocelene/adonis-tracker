import { describe, it, expect } from 'vitest';
import {
  isSyntheticSession,
  filterSyntheticSessions
} from '../scripts/cleanSyntheticSessions.js';

describe('cleanSyntheticSessions utility', () => {
  it('debe identificar sesiones sintéticas del período 13-jul a 10-ago sin ejercicios o con datos dummy', () => {
    const syntheticSessionNoEx = {
      id: 'ses_jul_1',
      date: '2026-07-20',
      exercises: {}
    };
    expect(isSyntheticSession(syntheticSessionNoEx)).toBe(true);

    const syntheticSessionDummy = {
      id: 'ses_jul_2',
      date: '2026-07-25',
      exercises: {
        dummy: {
          sets: [{ weight: 1000, reps: 0 }]
        }
      }
    };
    expect(isSyntheticSession(syntheticSessionDummy)).toBe(true);
  });

  it('NO debe clasificar como sintéticas las sesiones legítimas con ejercicios reales o fuera de rango', () => {
    const realSessionAugust = {
      id: 'ses_aug_real',
      date: '2026-08-15',
      exercises: {
        ex1: {
          name: 'Press Inclinado',
          sets: [{ weight: 120, reps: 10 }]
        }
      }
    };
    expect(isSyntheticSession(realSessionAugust)).toBe(false);

    const realSessionSeptember = {
      id: 'ses_sep_real',
      date: '2026-09-10',
      exercises: {
        ex1: {
          name: 'Prensa 45°',
          sets: [{ weight: 200, reps: 12 }]
        }
      }
    };
    expect(isSyntheticSession(realSessionSeptember)).toBe(false);
  });

  it('debe separar correctamente sesiones sintéticas de legítimas', () => {
    const mixed = [
      { id: 'syn1', date: '2026-07-15', exercises: {} },
      { id: 'leg1', date: '2026-08-20', exercises: { ex: { sets: [{ weight: 100, reps: 10 }] } } }
    ];

    const { synthetic, legitimate } = filterSyntheticSessions(mixed);
    expect(synthetic).toHaveLength(1);
    expect(synthetic[0].id).toBe('syn1');
    expect(legitimate).toHaveLength(1);
    expect(legitimate[0].id).toBe('leg1');
  });
});
