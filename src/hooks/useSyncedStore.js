import { useState, useEffect, useCallback, useRef } from 'react';
import { db, sanitizeForFirestore } from '../services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { get, set } from 'idb-keyval';
import { useAuth } from '../contexts/AuthContext';
import { stripInternalMetadata, extractMetadataFromDoc } from '../services/storeSyncHelper';
import { validateDatasetChange } from '../services/dataGuardian';

/**
 * Hook unificado useSyncedStore (Fase 2: Fuente Única de Verdad)
 * - Gestiona estados y configuraciones directamente a través de Firestore con persistentLocalCache.
 * - Soporta claves sensibles locales (DeepSeek API key) en idb-keyval con namespace por usuario (coachv2_${uid}_...).
 * - Aplica DataGuardian, desacoplamiento con initialValueRef, cola de carga y manejo transparente de Clean Slate (__cleared).
 */
export function useSyncedStore(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  const storedValueRef = useRef(storedValue);
  storedValueRef.current = storedValue;
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const isLoadedRef = useRef(false);
  const pendingQueueRef = useRef([]);
  const pendingCloudWriteRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const isSensitiveKey = key.includes('deepseek') || key.includes('api_key') || key.includes('apikey');
  const cleanKeySuffix = key.replace(/^coachv2_/, '');
  const localNamespacedKey = isSensitiveKey 
    ? `coachv2_${currentUser?.uid || 'anon'}_${cleanKeySuffix}`
    : key;

  // Vaciar escrituras pendientes hacia Firestore
  const flushCloudSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (isSensitiveKey || !currentUser || !currentUser.uid) return;

    if (pendingCloudWriteRef.current !== null) {
      const payload = pendingCloudWriteRef.current;
      pendingCloudWriteRef.current = null;

      const docRef = doc(db, 'users', currentUser.uid, 'store', key);
      setDoc(docRef, payload, { merge: true }).catch(err => {
        // En Firestore con persistentLocalCache, el SDK ya guarda offline en caso de fallo de red
        console.warn(`[useSyncedStore] Aviso escribiendo en Firestore (${key}):`, err.message);
      });
    }
  }, [currentUser, key, isSensitiveKey]);

  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;
    isLoadedRef.current = false;
    setIsLoading(true);

    // 1. Manejo de claves sensibles (estrictamente locales en idb-keyval con namespace)
    if (isSensitiveKey) {
      get(localNamespacedKey).then(localVal => {
        if (!isMounted) return;
        const resolved = localVal !== undefined ? stripInternalMetadata(localVal) : initialValueRef.current;
        storedValueRef.current = resolved;
        setStoredValue(resolved);
        isLoadedRef.current = true;
        setIsLoading(false);

        // Procesar posibles mutaciones encoladas antes de terminar la carga
        if (pendingQueueRef.current.length > 0) {
          let updatedVal = resolved;
          for (const item of pendingQueueRef.current) {
            updatedVal = typeof item === 'function' ? item(updatedVal) : item;
          }
          pendingQueueRef.current = [];
          const check = validateDatasetChange(key, resolved, updatedVal);
          if (check.allowed) {
            const cleanUpdated = stripInternalMetadata(updatedVal);
            storedValueRef.current = cleanUpdated;
            setStoredValue(cleanUpdated);
            set(localNamespacedKey, cleanUpdated).catch(() => {});
          }
        }
      }).catch(() => {
        if (isMounted) {
          isLoadedRef.current = true;
          setIsLoading(false);
        }
      });
      return;
    }

    // 2. Si no hay usuario autenticado, operar en memoria con initialValue sin persistir
    if (!currentUser || !currentUser.uid) {
      storedValueRef.current = initialValueRef.current;
      setStoredValue(initialValueRef.current);
      isLoadedRef.current = true;
      setIsLoading(false);
      return;
    }

    // 3. Claves sincronizadas con Firestore (persistentLocalCache como única capa)
    const docRef = doc(db, 'users', currentUser.uid, 'store', key);

    // Escuchar directamente onSnapshot (persistentLocalCache emite inmediatamente desde caché)
    unsubscribe = onSnapshot(
      docRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        if (!isMounted) return;

        // Si el snapshot no existe en la caché local pero estamos online,
        // esperar a que responda el servidor para no tomar initialValue en dispositivos nuevos
        if (!snapshot.exists() && snapshot.metadata?.fromCache && (typeof navigator === 'undefined' || navigator.onLine)) {
          return;
        }

        // Si tenemos escrituras locales aún pendientes de vaciado, no sobreescribir el estado en memoria
        if (pendingCloudWriteRef.current !== null) {
          setIsLoading(false);
          return;
        }

        let resolvedVal;
        if (snapshot.exists()) {
          const rawDoc = snapshot.data();
          const meta = extractMetadataFromDoc(rawDoc);
          const rawVal = rawDoc.value !== undefined ? rawDoc.value : rawDoc;

          if (meta.isCleared) {
            resolvedVal = Array.isArray(initialValueRef.current) 
              ? [] 
              : (initialValueRef.current === null ? null : {});
          } else {
            resolvedVal = rawVal !== undefined ? stripInternalMetadata(rawVal) : initialValueRef.current;
          }
        } else {
          resolvedVal = initialValueRef.current;
        }

        // Si es la primera vez que carga, procesar cualquier setValue encolado
        if (!isLoadedRef.current && pendingQueueRef.current.length > 0) {
          let finalVal = resolvedVal;
          for (const item of pendingQueueRef.current) {
            finalVal = typeof item === 'function' ? item(finalVal) : item;
          }
          pendingQueueRef.current = [];

          const check = validateDatasetChange(key, resolvedVal, finalVal);
          if (check.allowed) {
            resolvedVal = stripInternalMetadata(finalVal);
            // Programar escritura a Firestore
            const writePayload = {
              value: sanitizeForFirestore(resolvedVal),
              updatedAt: new Date().toISOString(),
              __cleared: false
            };
            pendingCloudWriteRef.current = writePayload;
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(flushCloudSync, 400);
          }
        }

        storedValueRef.current = resolvedVal;
        setStoredValue(resolvedVal);
        isLoadedRef.current = true;
        setIsLoading(false);
      },
      (err) => {
        console.warn(`[useSyncedStore] Snapshot warning para ${key}:`, err.message);
        if (isMounted) {
          isLoadedRef.current = true;
          setIsLoading(false);
        }
      }
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushCloudSync();
      }
    };

    window.addEventListener('beforeunload', flushCloudSync);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      flushCloudSync();
      if (unsubscribe) unsubscribe();
      window.removeEventListener('beforeunload', flushCloudSync);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [key, currentUser, flushCloudSync, isSensitiveKey, localNamespacedKey]);

  const setValue = useCallback((value) => {
    try {
      // Si la carga inicial aún no ha terminado, ENCOLAR para no persistir initialValue
      if (!isLoadedRef.current) {
        console.warn(`[useSyncedStore] setValue para "${key}" encolado: la carga inicial aún está en progreso.`);
        pendingQueueRef.current.push(value);
        return;
      }

      const prev = storedValueRef.current;
      const valueToStoreRaw = value instanceof Function ? value(prev) : value;

      // Validación con DataGuardian: verificar que no haya una reducción no autorizada >50%
      const guardianCheck = validateDatasetChange(key, prev, valueToStoreRaw);
      if (!guardianCheck.allowed) {
        console.error(`[DataGuardian] Escritura cancelada en useSyncedStore("${key}"): ${guardianCheck.reason}`);
        return; // Retorno seguro sin lanzar excepción
      }

      // Comprobar si se trata de una acción explícita de Clean Slate / Borrado
      const isExplicitClear = Boolean(
        valueToStoreRaw && 
        typeof valueToStoreRaw === 'object' && 
        (valueToStoreRaw.__cleared || valueToStoreRaw.cleanSlateAt)
      );

      const clearedAt = isExplicitClear 
        ? (valueToStoreRaw.clearedAt || valueToStoreRaw.cleanSlateAt || new Date().toISOString())
        : null;

      const cleanVal = stripInternalMetadata(valueToStoreRaw);

      // 1. Actualización inmediata en memoria y React state (0ms)
      storedValueRef.current = cleanVal;
      setStoredValue(cleanVal);

      // 2. Persistencia
      if (isSensitiveKey) {
        // Clave sensible: solo guardar en idb-keyval con namespace
        set(localNamespacedKey, cleanVal).catch(err => console.error(`Error guardando local (${key}):`, err));
      } else if (currentUser && currentUser.uid) {
        // Clave sincronizada: preparar payload para Firestore
        const nowIso = new Date().toISOString();
        const writePayload = isExplicitClear
          ? {
              value: sanitizeForFirestore(cleanVal),
              updatedAt: nowIso,
              __cleared: true,
              clearedAt: clearedAt,
              cleanSlateAt: valueToStoreRaw.cleanSlateAt || null
            }
          : {
              value: sanitizeForFirestore(cleanVal),
              updatedAt: nowIso,
              __cleared: false
            };

        pendingCloudWriteRef.current = writePayload;

        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Si fue un borrado explícito (Clean Slate), vaciar de inmediato sin debounce
        if (isExplicitClear) {
          flushCloudSync();
        } else {
          debounceTimerRef.current = setTimeout(flushCloudSync, 400);
        }
      }
    } catch (error) {
      console.error(`Error en setValue para ${key}:`, error);
    }
  }, [key, currentUser, flushCloudSync, isSensitiveKey, localNamespacedKey]);

  return [storedValue, setValue, isLoading];
}
