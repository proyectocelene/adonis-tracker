import { describe, it, expect } from 'vitest';
import {
  stripInternalMetadata,
  extractMetadataFromDoc,
  mergeStoreValues
} from '../src/services/storeSyncHelper.js';

describe('storeSyncHelper', () => {
  describe('stripInternalMetadata', () => {
    it('debe devolver valores primitivos, null y undefined sin alterarlos', () => {
      expect(stripInternalMetadata(null)).toBeNull();
      expect(stripInternalMetadata(undefined)).toBeUndefined();
      expect(stripInternalMetadata(42)).toBe(42);
      expect(stripInternalMetadata('texto')).toBe('texto');
      expect(stripInternalMetadata(true)).toBe(true);
    });

    it('debe eliminar claves internas (__cleared, clearedAt, cleanSlateAt, _updatedAt, __approvedDrop)', () => {
      const dataWithMeta = {
        name: 'Press de Pecho',
        weight: 120,
        __cleared: true,
        clearedAt: '2026-11-22T12:00:00Z',
        cleanSlateAt: '2026-11-22T12:00:00Z',
        _updatedAt: '2026-11-22T12:30:00Z',
        __approvedDrop: true,
        nested: {
          setting: 'Seat 4',
          __cleared: false,
          _updatedAt: '2026-11-22T12:00:00Z'
        }
      };

      const cleaned = stripInternalMetadata(dataWithMeta);
      expect(cleaned).toEqual({
        name: 'Press de Pecho',
        weight: 120,
        nested: {
          setting: 'Seat 4'
        }
      });
      expect(cleaned.__cleared).toBeUndefined();
      expect(cleaned.clearedAt).toBeUndefined();
      expect(cleaned.cleanSlateAt).toBeUndefined();
      expect(cleaned._updatedAt).toBeUndefined();
      expect(cleaned.__approvedDrop).toBeUndefined();
      expect(cleaned.nested.__cleared).toBeUndefined();
    });

    it('debe limpiar metadatos dentro de arrays', () => {
      const arr = [
        { id: '1', __cleared: false, val: 'A' },
        { id: '2', _updatedAt: '2026-11-22', val: 'B' }
      ];
      const cleaned = stripInternalMetadata(arr);
      expect(cleaned).toEqual([
        { id: '1', val: 'A' },
        { id: '2', val: 'B' }
      ]);
    });
  });

  describe('extractMetadataFromDoc', () => {
    it('debe devolver valores por defecto cuando el documento es null o inválido', () => {
      expect(extractMetadataFromDoc(null)).toEqual({
        isCleared: false,
        clearedAt: 0,
        updatedAt: 0
      });
      expect(extractMetadataFromDoc(undefined)).toEqual({
        isCleared: false,
        clearedAt: 0,
        updatedAt: 0
      });
      expect(extractMetadataFromDoc('invalido')).toEqual({
        isCleared: false,
        clearedAt: 0,
        updatedAt: 0
      });
    });

    it('debe extraer metadatos de borrado y actualización desde campos raíz', () => {
      const doc = {
        __cleared: true,
        clearedAt: '2026-11-22T10:00:00Z',
        updatedAt: '2026-11-22T10:05:00Z'
      };
      const meta = extractMetadataFromDoc(doc);
      expect(meta.isCleared).toBe(true);
      expect(meta.clearedAt).toBe(new Date('2026-11-22T10:00:00Z').getTime());
      expect(meta.updatedAt).toBe(new Date('2026-11-22T10:05:00Z').getTime());
    });

    it('debe extraer metadatos anidados en .value si existen', () => {
      const doc = {
        value: {
          __cleared: true,
          cleanSlateAt: '2026-11-22T08:00:00Z',
          _updatedAt: '2026-11-22T08:30:00Z'
        }
      };
      const meta = extractMetadataFromDoc(doc);
      expect(meta.isCleared).toBe(true);
      expect(meta.clearedAt).toBe(new Date('2026-11-22T08:00:00Z').getTime());
      expect(meta.updatedAt).toBe(new Date('2026-11-22T08:30:00Z').getTime());
    });
  });

  describe('mergeStoreValues (Reglas de Seguridad Absolutas)', () => {
    const key = 'coachv2_machine_configs';

    it('Regla 1: Un valor vacío en la nube NUNCA borra datos locales poblados', () => {
      const localPopulated = {
        m1: { seat: 3, pin: 5 },
        m2: { seat: 1, pin: 8 }
      };

      // Nube vacía con objeto {}
      expect(mergeStoreValues(key, localPopulated, {})).toEqual(localPopulated);
      // Nube vacía con null
      expect(mergeStoreValues(key, localPopulated, null)).toEqual(localPopulated);
      // Nube vacía con undefined
      expect(mergeStoreValues(key, localPopulated, undefined)).toEqual(localPopulated);
    });

    it('Regla 1 (Inversa): Un valor local vacío NUNCA borra datos poblados de la nube', () => {
      const cloudPopulated = {
        m1: { seat: 3, pin: 5 }
      };

      expect(mergeStoreValues(key, {}, cloudPopulated)).toEqual(cloudPopulated);
      expect(mergeStoreValues(key, null, cloudPopulated)).toEqual(cloudPopulated);
      expect(mergeStoreValues(key, undefined, cloudPopulated)).toEqual(cloudPopulated);
    });

    it('Regla 2: Un borrado explícito local (__cleared: true) posterior a la nube vacía el dataset', () => {
      const localCleared = {
        __cleared: true,
        clearedAt: '2026-11-22T15:00:00Z'
      };
      const cloudOld = {
        m1: { seat: 3 },
        _updatedAt: '2026-11-22T14:00:00Z'
      };

      const result = mergeStoreValues(key, localCleared, cloudOld);
      expect(result).toEqual({});
      expect(result.__cleared).toBeUndefined();
    });

    it('Regla 2 (Arrays): Un borrado explícito local para una colección tipo array devuelve []', () => {
      const localCleared = {
        __cleared: true,
        clearedAt: '2026-11-22T15:00:00Z'
      };
      const cloudOld = [
        { id: 'item1', weight: 80 }
      ];
      // Pasamos cloudMeta con updatedAt anterior
      const cloudMeta = { isCleared: false, clearedAt: 0, updatedAt: new Date('2026-11-22T14:00:00Z').getTime() };

      const result = mergeStoreValues('coachv2_custom_day_exercises', localCleared, cloudOld, cloudMeta);
      expect(result).toEqual([]);
    });

    it('Regla 3: Si la nube tiene datos con updatedAt POSTERIOR al borrado local, la nube gana', () => {
      const localCleared = {
        __cleared: true,
        clearedAt: '2026-11-22T10:00:00Z'
      };
      const cloudNewer = {
        m1: { seat: 4, pin: 6 },
        _updatedAt: '2026-11-22T11:00:00Z'
      };

      const result = mergeStoreValues(key, localCleared, cloudNewer);
      expect(result).toEqual({
        m1: { seat: 4, pin: 6 }
      });
      expect(result._updatedAt).toBeUndefined();
    });

    it('Regla 4: Borrado explícito en la nube posterior al local gana sobre datos locales viejos', () => {
      const localOld = {
        m1: { seat: 2 },
        _updatedAt: '2026-11-22T09:00:00Z'
      };
      const cloudCleared = {
        __cleared: true,
        clearedAt: '2026-11-22T10:00:00Z'
      };

      const result = mergeStoreValues(key, localOld, cloudCleared);
      expect(result).toEqual({});
    });

    it('Regla 5: Fusión no destructiva de objetos cuando ambos tienen cambios legítimos', () => {
      const localData = {
        machineA: { seat: 1, pin: 2 },
        machineB: { seat: 2, pin: 3, _updatedAt: '2026-11-22T14:00:00Z' }
      };
      const cloudData = {
        machineB: { seat: 5, pin: 5, _updatedAt: '2026-11-22T13:00:00Z' },
        machineC: { seat: 4, pin: 1 }
      };

      const result = mergeStoreValues(key, localData, cloudData);
      expect(result.machineA).toEqual({ seat: 1, pin: 2 });
      expect(result.machineC).toEqual({ seat: 4, pin: 1 });
      // machineB local es más reciente (14:00 vs 13:00), debe prevalecer la local
      expect(result.machineB.seat).toBe(2);
      expect(result.machineB._updatedAt).toBeUndefined();
    });
  });
});
