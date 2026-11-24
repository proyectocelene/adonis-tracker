import { describe, it, expect } from 'vitest';
import {
  calculateTreadmillMetrics,
  classifyHeartRateZone,
  resolveInitialMachineType
} from '../cardio/cardioStateHelper.js';

describe('Cardio Caminadora Inclinada Zona 2 (v4.5)', () => {
  it('a) calcula ACSM netas/brutas y elevación exactas para 35 min y 45 min a 10% y 12%, 4.0 km/h en 75.55 kg', () => {
    const m35_10 = calculateTreadmillMetrics({
      duration: 35,
      inclinePct: 10,
      speedKmh: 4.0,
      userWeightKg: 75.55
    });
    // VO2 = 3.5 + 0.1*66.6667 + 1.8*66.6667*0.10 = 22.1667; net = 18.6667 * 75.55 / 200 * 35 = 247 kcal
    expect(m35_10.acsmNetKcal).toBeGreaterThanOrEqual(240);
    expect(m35_10.acsmNetKcal).toBeLessThanOrEqual(260);
    expect(m35_10.acsmGrossKcal).toBeGreaterThan(m35_10.acsmNetKcal);
    expect(m35_10.elevationMeters).toBe(233);

    const m45_12 = calculateTreadmillMetrics({
      duration: 45,
      inclinePct: 12,
      speedKmh: 4.0,
      userWeightKg: 75.55
    });
    expect(m45_12.acsmNetKcal).toBeGreaterThanOrEqual(340);
    expect(m45_12.acsmNetKcal).toBeLessThanOrEqual(370);
    expect(m45_12.elevationMeters).toBe(360);
  });

  it('b) modo treadmill_only: sin datos de reloj guarda dataSource="treadmill_only", campos reloj en null y pasos estimados realistas', () => {
    const res35 = calculateTreadmillMetrics({
      duration: 35,
      inclinePct: 10,
      speedKmh: 4.0,
      userWeightKg: 75.55
    });
    expect(res35.dataSource).toBe('treadmill_only');
    expect(res35.watchHrAvg).toBeNull();
    expect(res35.watchHrMax).toBeNull();
    expect(res35.watchSteps).toBeNull();
    expect(res35.watchKcal).toBeNull();
    expect(res35.stepsSource).toBe('estimated');
    expect(res35.effectiveSteps).toBeGreaterThanOrEqual(3300);
    expect(res35.effectiveSteps).toBeLessThanOrEqual(4700);

    const res45 = calculateTreadmillMetrics({
      duration: 45,
      inclinePct: 11,
      speedKmh: 4.0,
      userWeightKg: 75.55
    });
    expect(res45.effectiveSteps).toBeGreaterThanOrEqual(3300);
    expect(res45.effectiveSteps).toBeLessThanOrEqual(4700);
  });

  it('c) modo treadmill_and_watch: con solo FC y pasos clasifica Z1/Z2/Z3+, usa pasos reales y mantiene acsmNetKcal como calculatedKcal', () => {
    const z1 = calculateTreadmillMetrics({
      duration: 40,
      inclinePct: 10,
      speedKmh: 4.0,
      watchHrAvg: 114,
      watchSteps: 4050
    });
    expect(z1.dataSource).toBe('treadmill_and_watch');
    expect(z1.stepsSource).toBe('watch');
    expect(z1.effectiveSteps).toBe(4050);
    expect(z1.calculatedKcal).toBe(z1.acsmNetKcal);
    expect(z1.zoneInfo?.zone).toBe('Z1');

    expect(classifyHeartRateZone(128)?.zone).toBe('Z2');
    expect(classifyHeartRateZone(142)?.zone).toBe('Z3+');
  });

  it('d) compatibilidad: una sesión previa de rower conserva su machineType al leerse sin errores', () => {
    const resolved = resolveInitialMachineType(
      { id: 'd1_cardio', unifiedCode: '[CARD-TREADMILL-INCLINE_01]', name: 'Caminadora Inclinada Zona 2 Post-Pesas' },
      { machineType: 'rower', duration: 35, rowOption: 'B' }
    );
    expect(resolved).toBe('rower');
  });
});
