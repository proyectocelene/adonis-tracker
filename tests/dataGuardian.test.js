import { describe, it, expect, vi } from 'vitest';
import {
  getDatasetCount,
  validateDatasetChange,
  notifyGuardianAlert
} from '../src/services/dataGuardian.js';

describe('dataGuardian', () => {
  describe('getDatasetCount', () => {
    it('debe devolver 0 para null y undefined', () => {
      expect(getDatasetCount(null)).toBe(0);
      expect(getDatasetCount(undefined)).toBe(0);
    });

    it('debe devolver la longitud exacta para arrays', () => {
      expect(getDatasetCount([])).toBe(0);
      expect(getDatasetCount([1, 2, 3, 4, 5])).toBe(5);
    });

    it('debe contar claves en objetos excluyendo metadatos internos', () => {
      const obj = {
        key1: 'val1',
        key2: 'val2',
        __cleared: false,
        clearedAt: '2026-11-22',
        _updatedAt: '2026-11-22',
        __approvedDrop: true
      };
      // Solo key1 y key2 deben contarse
      expect(getDatasetCount(obj)).toBe(2);
    });
  });

  describe('validateDatasetChange', () => {
    const protectedKey = 'coachv2_history';

    it('debe BLOQUEAR reducciones > 50% en datasets protegidos con 4 o más elementos', () => {
      const prevHistory = [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }
      ];
      // Intento de reducir de 10 a 4 elementos (caída del 60%)
      const newHistory = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const validation = validateDatasetChange(protectedKey, prevHistory, newHistory);
      expect(validation.allowed).toBe(false);
      expect(validation.reason).toContain('50%');
      expect(validation.prevCount).toBe(10);
      expect(validation.newCount).toBe(4);
    });

    it('debe BLOQUEAR el vaciado total (prev >= 2 a new = 0)', () => {
      const prevMachines = {
        m1: { seat: 1 },
        m2: { seat: 2 },
        m3: { seat: 3 }
      };
      const newMachines = {};

      const validation = validateDatasetChange('coachv2_machine_configs', prevMachines, newMachines);
      expect(validation.allowed).toBe(false);
      expect(validation.reason).toContain('Vaciado total');
      expect(validation.prevCount).toBe(3);
      expect(validation.newCount).toBe(0);
    });

    it('debe PERMITIR reducciones normales no anómalas (menores al 50%)', () => {
      const prevHistory = [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }
      ];
      // Reducción legítima de 10 a 9 (un entrenamiento borrado por el usuario)
      const newHistory = prevHistory.slice(0, 9);

      const validation = validateDatasetChange(protectedKey, prevHistory, newHistory);
      expect(validation.allowed).toBe(true);
      expect(validation.prevCount).toBe(10);
      expect(validation.newCount).toBe(9);
    });

    it('debe PERMITIR incrementos en el dataset', () => {
      const prev = [1, 2, 3];
      const next = [1, 2, 3, 4, 5];
      const validation = validateDatasetChange(protectedKey, prev, next);
      expect(validation.allowed).toBe(true);
      expect(validation.newCount).toBe(5);
    });

    it('debe PERMITIR el bypass explícito si viene marcado con __approvedDrop', () => {
      const prev = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const nextWithApproval = {
        a: 1,
        __approvedDrop: true
      };

      const validation = validateDatasetChange('coachv2_machine_profiles', prev, nextWithApproval);
      expect(validation.allowed).toBe(true);
    });

    it('debe PERMITIR el bypass explícito si viene marcado con __cleared (Clean Slate)', () => {
      const prev = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const nextWithCleared = {
        __cleared: true,
        clearedAt: '2026-11-22T15:00:00Z'
      };

      const validation = validateDatasetChange('coachv2_machine_profiles', prev, nextWithCleared);
      expect(validation.allowed).toBe(true);
    });

    it('debe PERMITIR cambios en datasets iniciales con menos de 2 elementos', () => {
      const prev = [{ id: 1 }];
      const next = [];
      const validation = validateDatasetChange(protectedKey, prev, next);
      expect(validation.allowed).toBe(true);
    });

    it('debe PERMITIR cualquier cambio en datasets no protegidos', () => {
      const validation = validateDatasetChange('coachv2_active_day_index', [1, 2, 3, 4, 5], []);
      expect(validation.allowed).toBe(true);
    });
  });

  describe('notifyGuardianAlert', () => {
    it('debe despachar un CustomEvent en window si window está disponible', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
      notifyGuardianAlert('coachv2_history', 20, 0, 'Test alert');
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
