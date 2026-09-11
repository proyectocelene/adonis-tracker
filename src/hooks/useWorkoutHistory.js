import { useState, useEffect, useCallback, useRef } from 'react';
import { db, sanitizeForFirestore } from '../services/firebase';
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
        let cached = await get(cacheKey);
        if (!Array.isArray(cached) || cached.length === 0) {
          cached = await get('coachv2_history');
        }
        if (!Array.isArray(cached) || cached.length === 0) {
          cached = await get('coachv2_history_cache_anon');
        }

        if (isMounted && Array.isArray(cached) && cached.length > 0) {
          setHistory(cached);
          setIsLoading(false);
        }
      } catch (e) {
        console.warn("No se pudo leer caché local de historial:", e);
      }
    }

    loadCachedHistory();

    const handleCloudSynced = (e) => {
      if (isMounted && e?.detail?.allSessions && Array.isArray(e.detail.allSessions)) {
        setHistory(e.detail.allSessions);
        setIsLoading(false);
      } else {
        loadCachedHistory();
      }
    };

    window.addEventListener('adonis_cloud_synced', handleCloudSynced);

    return () => {
      isMounted = false;
      window.removeEventListener('adonis_cloud_synced', handleCloudSynced);
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

    // Consulta directa a la colección completa sin orderBy('timestamp') para que Firestore
    // NO excluya documentos antiguos o importados que carezcan de esa propiedad específica.
    const historyCollectionRef = collection(db, 'users', currentUser.uid, 'history');

    unsubscribe = onSnapshot(historyCollectionRef, (snapshot) => {
      if (isMounted) {
        const firestoreSessions = snapshot.docs.map(docSnap => docSnap.data());

        // Fusión inteligente: preservar sesiones locales que aún no hayan terminado de subir
        const sessionMap = new Map();
        firestoreSessions.forEach(s => {
          const key = s.id || s.timestamp || s.date;
          if (key) sessionMap.set(key, s);
        });

        const currentLocal = historyRefState.current || [];
        currentLocal.forEach(s => {
          const key = s.id || s.timestamp || s.date;
          if (key && !sessionMap.has(key)) {
            sessionMap.set(key, s);
          }
        });

        const allSessions = Array.from(sessionMap.values()).sort((a, b) => {
          const timeA = new Date(a.timestamp || a.date || a.startTime || a.id || 0).getTime() || 0;
          const timeB = new Date(b.timestamp || b.date || b.startTime || b.id || 0).getTime() || 0;
          return timeA - timeB;
        });

        setHistory(allSessions);
        setIsLoading(false);
        // Persistir en caché local IndexedDB
        set(cacheKey, allSessions).catch(err => console.warn("Error guardando en caché IndexedDB:", err));
        set('coachv2_history', allSessions).catch(() => {});
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

  const outboxKey = currentUser ? `coachv2_outbox_${currentUser.uid}` : 'coachv2_outbox_anon';

  // Sincronizar cola de pendientes (Outbox Pattern) al recuperar conexión
  const flushOutbox = useCallback(async () => {
    if (!currentUser || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
    try {
      const outbox = (await get(outboxKey)) || [];
      if (Array.isArray(outbox) && outbox.length > 0) {
        const remaining = [];
        for (const item of outbox) {
          try {
            if (item.action === 'delete') {
              const docRef = doc(db, 'users', currentUser.uid, 'history', item.sessionId);
              await deleteDoc(docRef);
            } else if (item.session && item.session.id) {
              const docRef = doc(db, 'users', currentUser.uid, 'history', item.session.id);
              await setDoc(docRef, sanitizeForFirestore(item.session));
            }
          } catch (e) {
            console.warn(`[Outbox] Error sincronizando ${item.sessionId || item.session?.id}, reintentando luego:`, e);
            remaining.push(item);
          }
        }
        await set(outboxKey, remaining);
      }
    } catch (e) {
      console.warn("[Outbox] Error procesando cola de salida:", e);
    }
  }, [currentUser, outboxKey]);

  useEffect(() => {
    flushOutbox();
    const handleOnline = () => {
      flushOutbox();
    };
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [flushOutbox]);

  // 3. GUARDADO RESILIENTE (OPTIMISTA EN INDEXEDDB + COLA OUTBOX OFFLINE)
  const saveSession = useCallback(async (session) => {
    if (!session || !session.id) return;

    // Actualización optimista local en memoria e IndexedDB
    const updatedHistory = [...historyRefState.current.filter(s => s.id !== session.id), session].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date || a.id).getTime();
      const timeB = new Date(b.timestamp || b.date || b.id).getTime();
      return timeA - timeB;
    });

    setHistory(updatedHistory);
    await set(cacheKey, updatedHistory).catch(e => console.warn("Error guardando en caché IndexedDB:", e));

    if (currentUser) {
      const isOnline = typeof navigator === 'undefined' || navigator.onLine;
      if (isOnline) {
        try {
          const docRef = doc(db, 'users', currentUser.uid, 'history', session.id);
          await setDoc(docRef, sanitizeForFirestore(session));
          return;
        } catch (error) {
          console.warn("[Outbox] Fallo envío a Firebase, encolando en Outbox:", error);
        }
      }
      // Si está offline o falló setDoc, encolar en Outbox para cuando vuelva el internet en el gym
      try {
        const outbox = (await get(outboxKey)) || [];
        const filtered = outbox.filter(item => (item.session?.id || item.sessionId) !== session.id);
        filtered.push({ action: 'save', session });
        await set(outboxKey, filtered);
      } catch (err) {
        console.warn("[Outbox] Error encolando sesión:", err);
      }
    }
  }, [currentUser, cacheKey, outboxKey]);

  // 4. ELIMINACIÓN RESILIENTE
  const deleteSession = useCallback(async (sessionId) => {
    if (!sessionId) return;

    const updatedHistory = historyRefState.current.filter(s => s.id !== sessionId);
    setHistory(updatedHistory);
    await set(cacheKey, updatedHistory).catch(e => console.warn("Error guardando en caché IndexedDB:", e));

    if (currentUser) {
      const isOnline = typeof navigator === 'undefined' || navigator.onLine;
      if (isOnline) {
        try {
          const docRef = doc(db, 'users', currentUser.uid, 'history', sessionId);
          await deleteDoc(docRef);
          return;
        } catch (error) {
          console.warn("[Outbox] Fallo eliminación en Firebase, encolando en Outbox:", error);
        }
      }
      try {
        const outbox = (await get(outboxKey)) || [];
        const filtered = outbox.filter(item => (item.session?.id || item.sessionId) !== sessionId);
        filtered.push({ action: 'delete', sessionId });
        await set(outboxKey, filtered);
      } catch (err) {
        console.warn("[Outbox] Error encolando eliminación:", err);
      }
    }
  }, [currentUser, cacheKey, outboxKey]);


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
