import { useState, useEffect, useCallback, useRef } from 'react';
import { db, sanitizeForFirestore } from '../services/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { get, set } from 'idb-keyval';
import { useAuth } from '../contexts/AuthContext';
import { mergeStoreValues, enqueueStoreOutbox, flushStoreOutbox } from '../services/storeSyncHelper';

export function useIndexedDB(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const storedValueRef = useRef(storedValue);
  storedValueRef.current = storedValue;

  const pendingSyncValRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Función para vaciar escrituras pendientes de la nube
  const flushCloudSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (currentUser && pendingSyncValRef.current !== null) {
      const valToSync = pendingSyncValRef.current;
      pendingSyncValRef.current = null;
      const docRef = doc(db, 'users', currentUser.uid, 'store', key);
      const cleanVal = sanitizeForFirestore(valToSync);
      setDoc(docRef, { value: cleanVal }, { merge: true }).catch(err => {
        console.warn(`[useIndexedDB] Falló envío Firestore (${key}), encolando en Outbox:`, err.message);
        enqueueStoreOutbox(currentUser.uid, key, cleanVal);
      });
    }
  }, [currentUser, key]);

  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    if (!currentUser) {
      if (isMounted) setIsLoading(false);
      return;
    }

    // 1. Carga instantánea (0ms) desde IndexedDB local
    get(key).then(localVal => {
      if (isMounted && localVal !== undefined) {
        storedValueRef.current = localVal;
        setStoredValue(localVal);
        setIsLoading(false);
      }
    }).catch(() => {});

    // Escuchar eventos de sincronización maestra de la nube
    const handleCloudSynced = (e) => {
      if (isMounted && e?.detail?.storeSyncPayload && e.detail.storeSyncPayload[key] !== undefined) {
        const payloadVal = e.detail.storeSyncPayload[key];
        storedValueRef.current = payloadVal;
        setStoredValue(payloadVal);
        setIsLoading(false);
      }
    };
    window.addEventListener('adonis_cloud_synced', handleCloudSynced);

    const docRef = doc(db, 'users', currentUser.uid, 'store', key);

    const initialize = async () => {
      try {
        const localVal = await get(key);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          // Si no existe en la nube, rescatar del almacenamiento local (idb-keyval)
          if (localVal !== undefined) {
            const cleanVal = sanitizeForFirestore(localVal);
            await setDoc(docRef, { value: cleanVal }, { merge: true }).catch(err => {
              console.warn(`[useIndexedDB] Firestore offline/permisos para ${key}:`, err.message);
              enqueueStoreOutbox(currentUser.uid, key, cleanVal);
            });
            if (isMounted) {
              storedValueRef.current = localVal;
              setStoredValue(localVal);
            }
          }
        } else {
          // Si existe en la nube, hacer merge no destructivo
          const rawCloud = snapshot.data();
          const cloudVal = rawCloud.value !== undefined ? rawCloud.value : rawCloud;
          const merged = mergeStoreValues(key, localVal, cloudVal);

          if (isMounted && merged !== undefined) {
            storedValueRef.current = merged;
            setStoredValue(merged);
            await set(key, merged).catch(() => {});
          }

          // Si el local tenía datos que la nube no tenía, subir la versión fusionada
          const cloudStr = JSON.stringify(cloudVal ?? null);
          const mergedStr = JSON.stringify(merged ?? null);
          if (merged !== undefined && mergedStr !== cloudStr) {
            setDoc(docRef, { value: sanitizeForFirestore(merged) }, { merge: true }).catch(() => {
              enqueueStoreOutbox(currentUser.uid, key, merged);
            });
          }
        }
        
        // Suscribirse a cambios en tiempo real desde la nube/caché offline de Firebase
        unsubscribe = onSnapshot(
          docRef, 
          async (snap) => {
            // CRÍTICO: Si el snapshot proviene de escrituras locales pendientes o hay escritura pendiente debounced,
            // NUNCA sobreescribir el estado reactivo con un snapshot intermedio!
            if (snap.metadata?.hasPendingWrites || pendingSyncValRef.current !== null) {
              if (isMounted) setIsLoading(false);
              return;
            }

            if (snap.exists() && isMounted) {
              const rawCloud = snap.data();
              const cloudVal = rawCloud.value !== undefined ? rawCloud.value : rawCloud;
              
              // Fusión segura con el valor en memoria activa más reciente
              const currentLocal = storedValueRef.current ?? (await get(key));
              const merged = mergeStoreValues(key, currentLocal, cloudVal);

              storedValueRef.current = merged;
              setStoredValue(merged);
              await set(key, merged).catch(() => {});
            }
            if (isMounted) setIsLoading(false);
          },
          (err) => {
            console.warn(`[useIndexedDB] Snapshot offline/permisos para ${key}:`, err.message);
            if (isMounted) setIsLoading(false);
          }
        );

      } catch (err) {
        console.warn(`[useIndexedDB] Error inicializando Firestore para ${key}:`, err.message);
        if (isMounted) setIsLoading(false);
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
  }, [key, currentUser, flushCloudSync]);

  const setValue = useCallback((value) => {
    try {
      const prev = storedValueRef.current;
      const valueToStore = value instanceof Function ? value(prev) : value;
      
      // 1. Actualización síncrona en memoria y estado React (0ms)
      storedValueRef.current = valueToStore;
      setStoredValue(valueToStore);

      // 2. Persistencia síncrona/inmediata en IndexedDB local
      set(key, valueToStore).catch(err => console.error(`Error guardando local (${key}):`, err));

      // 3. Sincronización debounced hacia Firestore (800ms) para no saturar la red ni crear bucles de snapshot
      if (currentUser) {
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
  }, [key, currentUser, flushCloudSync]);

  return [storedValue, setValue, isLoading];
}
