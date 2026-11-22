import { useState } from 'react';

/**
 * Hook de conveniencia para almacenamiento local síncrono en window.localStorage.
 * Nota: Para estados clínicos o sincronizados con la nube/Firestore, usar useSyncedStore.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error leyendo ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`[useLocalStorage] Error escribiendo ${key}:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
