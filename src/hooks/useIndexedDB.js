import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
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

    const docRef = doc(db, 'users', currentUser.uid, 'store', key);

    const initialize = async () => {
      try {
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) {
          // Si no existe en la nube, rescatar del almacenamiento local viejo (idb-keyval)
          const localVal = await get(key);
          if (localVal !== undefined) {
            await setDoc(docRef, { value: localVal });
            if (isMounted) setStoredValue(localVal);
          }
        }
        
        // Suscribirse a cambios en tiempo real desde la nube/caché offline de Firebase
        unsubscribe = onSnapshot(docRef, (snap) => {
          if (snap.exists() && isMounted) {
            setStoredValue(snap.data().value);
          }
          if (isMounted) setIsLoading(false);
        });

      } catch (err) {
        console.error(`Error inicializando Firestore para ${key}:`, err);
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
          setDoc(docRef, { value: valueToStore }).catch(err => console.error("Error guardando en Firestore", err));
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
