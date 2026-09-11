import { useState, useEffect, useCallback } from 'react';
import { db, sanitizeForFirestore } from '../services/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { get, set } from 'idb-keyval';
import { useAuth } from '../contexts/AuthContext';

export function useIndexedDB(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

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

    const docRef = doc(db, 'users', currentUser.uid, 'store', key);

    const initialize = async () => {
      try {
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) {
          // Si no existe en la nube, rescatar del almacenamiento local viejo (idb-keyval)
          const localVal = await get(key);
          if (localVal !== undefined) {
            const cleanVal = sanitizeForFirestore(localVal);
            await setDoc(docRef, { value: cleanVal }).catch(err => {
              console.warn(`[useIndexedDB] Firestore offline/permisos para ${key}:`, err.message);
            });
            if (isMounted) setStoredValue(localVal);
          }
        }
        
        // Suscribirse a cambios en tiempo real desde la nube/caché offline de Firebase
        unsubscribe = onSnapshot(
          docRef, 
          (snap) => {
            if (snap.exists() && isMounted) {
              const val = snap.data().value !== undefined ? snap.data().value : snap.data();
              setStoredValue(val);
              // Guardar en la base de datos local IndexedDB para acceso offline y análisis
              set(key, val).catch(() => {});
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

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [key, currentUser]);

  const setValue = useCallback((value) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'store', key);
          const cleanVal = sanitizeForFirestore(valueToStore);
          setDoc(docRef, { value: cleanVal }).catch(err => console.warn(`Error guardando en Firestore (${key}):`, err.message));
        }
        
        // Mantener también en idb-keyval como respaldo heredado
        set(key, valueToStore).catch(err => console.error("Error local", err));
        
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error en setValue para ${key}:`, error);
    }
  }, [key, currentUser]);

  return [storedValue, setValue, isLoading];
}
