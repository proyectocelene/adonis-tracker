import { useState, useEffect, useCallback, useRef } from 'react';
import { db, sanitizeForFirestore } from '../services/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { get, set } from 'idb-keyval';
import { useAuth } from '../contexts/AuthContext';
import { mergeStoreValues, enqueueStoreOutbox, flushStoreOutbox, stripInternalMetadata, extractMetadataFromDoc } from '../services/storeSyncHelper';
import { validateDatasetChange } from '../services/dataGuardian';

export function useIndexedDB(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const storedValueRef = useRef(storedValue);
  storedValueRef.current = storedValue;
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const isLoadedRef = useRef(false);
  const pendingQueueRef = useRef([]);
  const pendingSyncValRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const isSensitiveKey = key.includes('deepseek') || key.includes('api_key') || key.includes('apikey');

  // Función para vaciar escrituras pendientes de la nube
  const flushCloudSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    // Claves sensibles (como DeepSeek API key) nunca se suben a Firestore
    if (isSensitiveKey) return;

    if (currentUser && pendingSyncValRef.current !== null) {
      const valToSync = pendingSyncValRef.current;
      pendingSyncValRef.current = null;
      const docRef = doc(db, 'users', currentUser.uid, 'store', key);
      const cleanVal = sanitizeForFirestore(stripInternalMetadata(valToSync));
      setDoc(docRef, { value: cleanVal, updatedAt: new Date().toISOString(), __cleared: false }, { merge: true }).catch(err => {
        console.warn(`[useIndexedDB] Falló envío Firestore (${key}), encolando en Outbox:`, err.message);
        enqueueStoreOutbox(currentUser.uid, key, cleanVal);
      });
    }
  }, [currentUser, key, isSensitiveKey]);

  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;
    isLoadedRef.current = false;
    setIsLoading(true);

    if (!currentUser) {
      // Usuario no autenticado: cargar únicamente de IndexedDB local
      get(key).then(localVal => {
        if (!isMounted) return;
        const resolvedVal = localVal !== undefined ? stripInternalMetadata(localVal) : initialValueRef.current;
        storedValueRef.current = resolvedVal;
        setStoredValue(resolvedVal);
        isLoadedRef.current = true;
        setIsLoading(false);

        // Procesar posibles escrituras encoladas antes de terminar get(key)
        if (pendingQueueRef.current.length > 0) {
          let updatedVal = resolvedVal;
          for (const item of pendingQueueRef.current) {
            updatedVal = typeof item === 'function' ? item(updatedVal) : item;
          }
          pendingQueueRef.current = [];
          const check = validateDatasetChange(key, resolvedVal, updatedVal);
          if (check.allowed) {
            const cleanUpdated = stripInternalMetadata(updatedVal);
            storedValueRef.current = cleanUpdated;
            setStoredValue(cleanUpdated);
            set(key, cleanUpdated).catch(() => {});
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

    // 1. Carga preliminar ultra rápida desde IndexedDB local
    get(key).then(localVal => {
      if (isMounted && localVal !== undefined) {
        const cleanLocal = stripInternalMetadata(localVal);
        storedValueRef.current = cleanLocal;
        setStoredValue(cleanLocal);
      }
    }).catch(() => {});

    // Escuchar eventos de sincronización maestra de la nube
    const handleCloudSynced = (e) => {
      if (isMounted && e?.detail?.storeSyncPayload && e.detail.storeSyncPayload[key] !== undefined) {
        const payloadVal = stripInternalMetadata(e.detail.storeSyncPayload[key]);
        storedValueRef.current = payloadVal;
        setStoredValue(payloadVal);
        isLoadedRef.current = true;
        setIsLoading(false);
      }
    };
    window.addEventListener('adonis_cloud_synced', handleCloudSynced);

    const docRef = doc(db, 'users', currentUser.uid, 'store', key);

    const initialize = async () => {
      try {
        const localVal = await get(key);
        let resolvedVal;

        if (isSensitiveKey) {
          // Las claves sensibles solo residen en IndexedDB local
          resolvedVal = localVal !== undefined ? stripInternalMetadata(localVal) : initialValueRef.current;
        } else {
          const snapshot = await getDoc(docRef);

          if (!snapshot.exists()) {
            // Si no existe en la nube, rescatar del almacenamiento local (idb-keyval)
            if (localVal !== undefined) {
              resolvedVal = stripInternalMetadata(localVal);
              const cleanVal = sanitizeForFirestore(resolvedVal);
              await setDoc(docRef, { value: cleanVal, updatedAt: new Date().toISOString(), __cleared: false }, { merge: true }).catch(err => {
                console.warn(`[useIndexedDB] Firestore offline/permisos para ${key}:`, err.message);
                enqueueStoreOutbox(currentUser.uid, key, cleanVal);
              });
            } else {
              // NUNCA persistir initialValue a Firestore si no había datos reales
              resolvedVal = initialValueRef.current;
            }
          } else {
            // Si existe en la nube, hacer merge no destructivo pasando metadatos del documento
            const rawCloud = snapshot.data();
            const cloudVal = rawCloud.value !== undefined ? rawCloud.value : rawCloud;
            const cloudMeta = extractMetadataFromDoc(rawCloud);
            const merged = mergeStoreValues(key, localVal, cloudVal, cloudMeta);
            resolvedVal = merged !== undefined ? stripInternalMetadata(merged) : initialValueRef.current;

            if (isMounted && resolvedVal !== undefined) {
              await set(key, resolvedVal).catch(() => {});
            }

            // Si el valor local aportó datos que la nube no tenía, subir la versión fusionada
            const cloudStr = JSON.stringify(stripInternalMetadata(cloudVal) ?? null);
            const resolvedStr = JSON.stringify(resolvedVal ?? null);
            if (resolvedVal !== undefined && resolvedStr !== cloudStr) {
              setDoc(docRef, { value: sanitizeForFirestore(resolvedVal), updatedAt: new Date().toISOString(), __cleared: false }, { merge: true }).catch(() => {
                enqueueStoreOutbox(currentUser.uid, key, resolvedVal);
              });
            }
          }
        }

        // Procesar cualquier setValue que haya sido encolado mientras cargaba
        let finalVal = resolvedVal;
        if (pendingQueueRef.current.length > 0) {
          for (const item of pendingQueueRef.current) {
            finalVal = typeof item === 'function' ? item(finalVal) : item;
          }
          pendingQueueRef.current = [];

          const check = validateDatasetChange(key, resolvedVal, finalVal);
          if (check.allowed) {
            finalVal = stripInternalMetadata(finalVal);
            await set(key, finalVal).catch(() => {});
            if (currentUser && !isSensitiveKey) {
              pendingSyncValRef.current = finalVal;
              if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
              debounceTimerRef.current = setTimeout(flushCloudSync, 800);
            }
          } else {
            finalVal = resolvedVal; // Descartar reducción inválida
          }
        }

        isLoadedRef.current = true;
        if (isMounted) {
          storedValueRef.current = finalVal;
          setStoredValue(finalVal);
          setIsLoading(false);
        }

        // Suscribirse a cambios en tiempo real si no es clave sensible
        if (!isSensitiveKey) {
          unsubscribe = onSnapshot(
            docRef, 
            async (snap) => {
              if (snap.metadata?.hasPendingWrites || pendingSyncValRef.current !== null) {
                if (isMounted) setIsLoading(false);
                return;
              }

              if (snap.exists() && isMounted) {
                const rawCloud = snap.data();
                const cloudVal = rawCloud.value !== undefined ? rawCloud.value : rawCloud;
                const cloudMeta = extractMetadataFromDoc(rawCloud);
                
                const currentLocal = storedValueRef.current ?? (await get(key));
                const merged = mergeStoreValues(key, currentLocal, cloudVal, cloudMeta);
                const cleanMerged = stripInternalMetadata(merged);

                storedValueRef.current = cleanMerged;
                setStoredValue(cleanMerged);
                await set(key, cleanMerged).catch(() => {});
              }
              if (isMounted) setIsLoading(false);
            },
            (err) => {
              console.warn(`[useIndexedDB] Snapshot offline/permisos para ${key}:`, err.message);
              if (isMounted) setIsLoading(false);
            }
          );
        }

      } catch (err) {
        console.warn(`[useIndexedDB] Error inicializando Firestore para ${key}:`, err.message);
        if (isMounted) {
          isLoadedRef.current = true;
          setIsLoading(false);
        }
      }
    };

    initialize();

    const handleOnline = () => {
      flushCloudSync();
      flushStoreOutbox(currentUser);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushCloudSync();
      }
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', flushCloudSync);

    return () => {
      isMounted = false;
      flushCloudSync();
      if (unsubscribe) unsubscribe();
      window.removeEventListener('adonis_cloud_synced', handleCloudSynced);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', flushCloudSync);
    };
  }, [key, currentUser, flushCloudSync, isSensitiveKey]);

  const setValue = useCallback((value) => {
    try {
      // Si aún no ha completado la carga inicial, ENCOLAR para no persistir initialValue
      if (!isLoadedRef.current) {
        console.warn(`[useIndexedDB] setValue para "${key}" encolado: la carga inicial aún está en progreso.`);
        pendingQueueRef.current.push(value);
        return;
      }

      const prev = storedValueRef.current;
      const valueToStoreRaw = value instanceof Function ? value(prev) : value;

      // Validación con DataGuardian: verificar que no haya una reducción no autorizada >50%
      const guardianCheck = validateDatasetChange(key, prev, valueToStoreRaw);
      if (!guardianCheck.allowed) {
        console.error(`[DataGuardian] Escritura cancelada en useIndexedDB("${key}"): ${guardianCheck.reason}`);
        return; // Retorno seguro sin lanzar excepción
      }

      const valueToStore = stripInternalMetadata(valueToStoreRaw);

      // 1. Actualización síncrona en memoria y estado React
      storedValueRef.current = valueToStore;
      setStoredValue(valueToStore);

      // 2. Persistencia síncrona/inmediata en IndexedDB local
      set(key, valueToStore).catch(err => console.error(`Error guardando local (${key}):`, err));

      // 3. Sincronización debounced hacia Firestore (si no es sensible)
      if (currentUser && !isSensitiveKey) {
        pendingSyncValRef.current = valueToStore;
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          flushCloudSync();
        }, 800);
      }
    } catch (error) {
      console.error(`Error en setValue para ${key}:`, error);
    }
  }, [key, currentUser, flushCloudSync, isSensitiveKey]);

  return [storedValue, setValue, isLoading];
}
