import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../services/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { get, set } from 'idb-keyval';

export function useWorkoutHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const historyRefState = useRef(history);
  historyRefState.current = history;

  const cacheKey = currentUser ? `coachv2_history_cache_${currentUser.uid}` : 'coachv2_history_cache_anon';

  // 1. CARGA INSTANTÁNEA (0ms) DESDE INDEXEDDB LOCAL
  useEffect(() => {
    let isMounted = true;

    async function loadCachedHistory() {
      try {
        const cached = await get(cacheKey);
        if (isMounted && Array.isArray(cached) && cached.length > 0) {
          setHistory(cached);
          setIsLoading(false);
        }
      } catch (e) {
        console.warn("No se pudo leer caché local de historial:", e);
      }
    }

    loadCachedHistory();

    return () => {
      isMounted = false;
    };
  }, [cacheKey]);

  // 2. SINCRONIZACIÓN EN TIEMPO REAL CON FIRESTORE
  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    if (!currentUser) {
      if (isMounted) setIsLoading(false);
      return;
    }

    const historyCollectionRef = collection(db, 'users', currentUser.uid, 'history');
    const q = query(historyCollectionRef, orderBy('timestamp', 'asc'));

    unsubscribe = onSnapshot(q, (snapshot) => {
      if (isMounted) {
        const data = snapshot.docs.map(docSnap => docSnap.data());
        setHistory(data);
        setIsLoading(false);
        // Persistir en caché local IndexedDB
        set(cacheKey, data).catch(err => console.warn("Error guardando en caché IndexedDB:", err));
      }
    }, (error) => {
      console.warn("Aviso: Conexión Firestore lenta u offline. Usando datos locales:", error.message);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, cacheKey]);

  // 3. GUARDADO RESILIENTE (OPTIMISTA EN INDEXEDDB + FIRESTORE)
  const saveSession = useCallback(async (session) => {
    if (!session || !session.id) return;

    // Actualización optimista local
    const updatedHistory = [...historyRefState.current.filter(s => s.id !== session.id), session].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date || a.id).getTime();
      const timeB = new Date(b.timestamp || b.date || b.id).getTime();
      return timeA - timeB;
    });

    setHistory(updatedHistory);
    await set(cacheKey, updatedHistory).catch(e => console.warn("Error guardando en caché IndexedDB:", e));

    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'history', session.id);
        await setDoc(docRef, session);
      } catch (error) {
        console.warn("Aviso: No se pudo sincronizar sesión inmediatamente con Firebase (se preservó en IndexedDB):", error);
      }
    }
  }, [currentUser, cacheKey]);

  // 4. ELIMINACIÓN RESILIENTE
  const deleteSession = useCallback(async (sessionId) => {
    if (!sessionId) return;

    const updatedHistory = historyRefState.current.filter(s => s.id !== sessionId);
    setHistory(updatedHistory);
    await set(cacheKey, updatedHistory).catch(e => console.warn("Error guardando en caché IndexedDB:", e));

    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'history', sessionId);
        await deleteDoc(docRef);
      } catch (error) {
        console.warn("Aviso: No se pudo eliminar de Firestore inmediatamente (eliminado de caché local):", error);
      }
    }
  }, [currentUser, cacheKey]);

  const setWorkoutHistory = useCallback(async (newHistoryArray) => {
    if (!Array.isArray(newHistoryArray)) return;
    setHistory(newHistoryArray);
    await set(cacheKey, newHistoryArray).catch(e => console.warn("Error guardando en caché IndexedDB:", e));

    if (currentUser) {
      try {
        for (const session of newHistoryArray) {
          if (session.id) {
            const docRef = doc(db, 'users', currentUser.uid, 'history', session.id);
            await setDoc(docRef, session);
          }
        }
      } catch (e) {
        console.error("Error sobrescribiendo historial en Firestore:", e);
      }
    }
  }, [currentUser, cacheKey]);

  return [history, setWorkoutHistory, isLoading, saveSession, deleteSession];
}
