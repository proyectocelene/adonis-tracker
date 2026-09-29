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
        setStoredValue(localVal);
        setIsLoading(false);
      }
    }).catch(() => {});

    // Escuchar eventos de sincronización maestra de la nube
    const handleCloudSynced = (e) => {
      if (isMounted && e?.detail?.storeSyncPayload && e.detail.storeSyncPayload[key] !== undefined) {
        setStoredValue(e.detail.storeSyncPayload[key]);
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
            if (isMounted) setStoredValue(localVal);
          }
        } else {
          // Si existe en la nube, hacer merge no destructivo
          const rawCloud = snapshot.data();
          const cloudVal = rawCloud.value !== undefined ? rawCloud.value : rawCloud;
          const merged = mergeStoreValues(key, localVal, cloudVal);

          if (isMounted && merged !== undefined) {
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
            if (snap.exists() && isMounted) {
              const rawCloud = snap.data();
              const cloudVal = rawCloud.value !== undefined ? rawCloud.value : rawCloud;
              
              // No sobrescribir a ciegas: fusionar con el valor actual
              const currentLocal = (await get(key)) ?? storedValueRef.current;
              const merged = mergeStoreValues(key, currentLocal, cloudVal);

              setStoredValue(merged);
              await set(key, merged).catch(() => {});

              // Si el estado local tiene información no presente en la nube, subirla
              const cloudStr = JSON.stringify(cloudVal ?? null);
              const mergedStr = JSON.stringify(merged ?? null);
              if (merged !== undefined && mergedStr !== cloudStr) {
                setDoc(docRef, { value: sanitizeForFirestore(merged) }, { merge: true }).catch(err => {
                  enqueueStoreOutbox(currentUser.uid, key, merged);
                });
              }
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
      flushStoreOutbox(currentUser);
    };
    window.addEventListener('online', handleOnline);

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      window.removeEventListener('adonis_cloud_synced', handleCloudSynced);
      window.removeEventListener('online', handleOnline);
    };
  }, [key, currentUser]);

  const setValue = useCallback((value) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        
        // 1. Guardar de inmediato en IndexedDB local
        set(key, valueToStore).catch(err => console.error(`Error guardando local (${key}):`, err));

        // 2. Sincronizar hacia Firestore con merge: true
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'store', key);
          const cleanVal = sanitizeForFirestore(valueToStore);
          setDoc(docRef, { value: cleanVal }, { merge: true }).catch(err => {
            console.warn(`[useIndexedDB] Falló envío Firestore (${key}), encolando en Outbox:`, err.message);
            enqueueStoreOutbox(currentUser.uid, key, cleanVal);
          });
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error en setValue para ${key}:`, error);
    }
  }, [key, currentUser]);

  return [storedValue, setValue, isLoading];
}
