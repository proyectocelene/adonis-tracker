import { describe, it, expect } from 'vitest';
import {
  parseTargetRepsRange,
  detectStationType,
  formatSessionDateLabel,
  calculateDeloadWindows,
  filterPointsByTimeframe,
  getDynamicXInterval
} from '../src/utils/charts/progressionDataHelper.js';
import { calculateScientificProjections } from '../src/utils/charts/progressionProjections.js';
import { getWeightYDomain, getTonnageYDomain } from '../src/utils/charts/progressionScales.js';

describe('progressionDataHelper', () => {
  describe('parseTargetRepsRange', () => {
    it('debe parsear un rango estándar de reps como "10-12"', () => {
      const res = parseTargetRepsRange('10-12');
      expect(res.min).toBe(10);
      expect(res.max).toBe(12);
      expect(res.label).toBe('10-12');
    });

    it('debe parsear un rango corto como "6-8"', () => {
      const res = parseTargetRepsRange('6-8');
      expect(res.min).toBe(6);
      expect(res.max).toBe(8);
    });

    it('debe interpretar un número único como valor fijo para min y max', () => {
      const res = parseTargetRepsRange('15');
      expect(res.min).toBe(15);
      expect(res.max).toBe(15);
    });

    it('debe retornar valores por defecto (10-12) si el valor es nulo o vacío', () => {
      const res = parseTargetRepsRange(null);
      expect(res.min).toBe(10);
      expect(res.max).toBe(12);
      expect(res.label).toBe('10-12');
    });
  });

  describe('detectStationType', () => {
    it('debe detectar mancuernas', () => {
      expect(detectStationType('Press Inclinado Mancuerna').stationType).toBe('dumbbell');
      expect(detectStationType('Dumbbell Bench Press').stationType).toBe('dumbbell');
    });

    it('debe detectar poleas y cables', () => {
      expect(detectStationType('Tricep Pushdown Polea').stationType).toBe('cable');
      expect(detectStationType('Cable Lateral Raise').stationType).toBe('cable');
    });

    it('debe detectar Smith / Multipower', () => {
      expect(detectStationType('Sentadilla Smith').stationType).toBe('smith');
      expect(detectStationType('Multipower Press').stationType).toBe('smith');
    });

    it('debe detectar discos / prensa 45 / hack', () => {
      expect(detectStationType('Prensa 45 Grados').stationType).toBe('plate');
      expect(detectStationType('Hack Squat Discos').stationType).toBe('plate');
    });

    it('debe retornar máquina por defecto para estaciones guiadas', () => {
      expect(detectStationType('Jalón al Pecho Selectorizado').stationType).toBe('machine');
    });
  });

  describe('formatSessionDateLabel', () => {
    it('debe formatear fecha YYYY-MM-DD a D Mes', () => {
      const dateCounts = {};
      const { baseLabel, uniqueKey } = formatSessionDateLabel('2026-03-15', null, 0, dateCounts);
      expect(baseLabel).toBe('15 Mar');
      expect(uniqueKey).toBe('15 Mar');
    });

    it('debe desambiguar colisiones de fechas agregando sufijo (#2, #3)', () => {
      const dateCounts = {};
      const first = formatSessionDateLabel('2026-03-15', null, 0, dateCounts);
      const second = formatSessionDateLabel('2026-03-15', null, 1, dateCounts);
      expect(first.uniqueKey).toBe('15 Mar');
      expect(second.uniqueKey).toBe('15 Mar (#2)');
    });
  });

  describe('calculateDeloadWindows', () => {
    it('debe agrupar sesiones continuas de Deload en ventanas', () => {
      const points = [
        { date: '1 Ene', isDeloadSession: false },
        { date: '8 Ene', isDeloadSession: true },
        { date: '15 Ene', isDeloadSession: true },
        { date: '22 Ene', isDeloadSession: false },
        { date: '29 Ene', isDeloadSession: true }
      ];
      const windows = calculateDeloadWindows(points);
      expect(windows.length).toBe(2);
      expect(windows[0]).toEqual({ start: '8 Ene', end: '15 Ene', count: 2 });
      expect(windows[1]).toEqual({ start: '29 Ene', end: '29 Ene', count: 1 });
    });

    it('debe retornar array vacío si no hay sesiones de Deload', () => {
      const points = [{ date: '1 Ene', isDeloadSession: false }];
      expect(calculateDeloadWindows(points)).toEqual([]);
    });
  });

  describe('filterPointsByTimeframe', () => {
    const mockPoints = Array.from({ length: 15 }, (_, i) => ({
      date: `S${i + 1}`,
      dateRaw: `2026-0${Math.floor(i / 4) + 1}-10`
    }));

    it('debe recortar a 5 sesiones con "5ses"', () => {
      const res = filterPointsByTimeframe(mockPoints, '5ses');
      expect(res.length).toBe(5);
      expect(res[res.length - 1].date).toBe('S15');
    });

    it('debe recortar a 10 sesiones con "10ses"', () => {
      const res = filterPointsByTimeframe(mockPoints, '10ses');
      expect(res.length).toBe(10);
    });

    it('debe retornar todos los puntos con "all"', () => {
      const res = filterPointsByTimeframe(mockPoints, 'all');
      expect(res.length).toBe(15);
    });
  });

  describe('getDynamicXInterval', () => {
    it('debe retornar 0 para 8 puntos o menos', () => {
      expect(getDynamicXInterval(5)).toBe(0);
      expect(getDynamicXInterval(8)).toBe(0);
    });

    it('debe retornar 1 para entre 9 y 15 puntos', () => {
      expect(getDynamicXInterval(12)).toBe(1);
    });

    it('debe retornar 2 para entre 16 y 25 puntos', () => {
      expect(getDynamicXInterval(20)).toBe(2);
    });

    it('debe dividir entre 6 para más de 25 puntos', () => {
      expect(getDynamicXInterval(36)).toBe(6);
    });
  });
});

describe('progressionProjections', () => {
  it('debe generar 5 proyecciones (+1 ses, +2 ses, +1m, +3m, +6m) para datos válidos', () => {
    const realPoints = [
      { date: '1 Ene', weight: 100, avgWeight: 95, reps: 10, est1RM: 133, tonnage: 2000 },
      { date: '8 Ene', weight: 105, avgWeight: 100, reps: 12, est1RM: 147, tonnage: 2400 }
    ];

    const { projectedPoints, weeklyRate, maxHistorical, lastRealPoint } = calculateScientificProjections(realPoints, null, 12);

    expect(projectedPoints.length).toBe(5);
    expect(projectedPoints.map(p => p.date)).toEqual(['+1 ses', '+2 ses', '+1m', '+3m', '+6m']);
    expect(maxHistorical).toBe(105);
    expect(weeklyRate).toBeGreaterThanOrEqual(1.0);
    expect(lastRealPoint.projectedWeight).toBe(105);

    // Cuando se dominan las reps máximas (12 reps), la siguiente sesión (+1 ses) debe proyectar sobrecarga
    expect(projectedPoints[0].projectedWeight).toBeGreaterThanOrEqual(105);
  });

  it('debe manejar array vacío de puntos sin lanzar errores', () => {
    const res = calculateScientificProjections([], null, 12);
    expect(res.projectedPoints).toEqual([]);
    expect(res.maxHistorical).toBe(0);
    expect(res.lastRealPoint).toBeNull();
  });
});

describe('progressionScales', () => {
  it('debe calcular dominios de carga iniciando en 0 cuando scale="zero"', () => {
    const [minFn, maxFn] = getWeightYDomain('zero');
    expect(minFn).toBe(0);
    expect(typeof maxFn).toBe('function');
    expect(maxFn(100)).toBe(110);
  });

  it('debe calcular dominios de carga con holgura fisiológica del 15% cuando scale="dynamic"', () => {
    const [minFn, maxFn] = getWeightYDomain('dynamic');
    expect(typeof minFn).toBe('function');
    expect(typeof maxFn).toBe('function');
    expect(minFn(100)).toBe(85);
    expect(maxFn(100)).toBe(110);
  });

  it('debe calcular dominios de tonelaje con holgura fisiológica del 20% cuando scale="dynamic"', () => {
    const [minFn, maxFn] = getTonnageYDomain('dynamic');
    expect(typeof minFn).toBe('function');
    expect(typeof maxFn).toBe('function');
    expect(minFn(1000)).toBe(800);
    expect(maxFn(1000)).toBe(1100);
  });
});
