import { useState, useEffect, useCallback, useRef } from 'react';
import { db, sanitizeForFirestore } from '../services/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { get, set } from 'idb-keyval';
import { validateDatasetChange } from '../services/dataGuardian';

export function useWorkoutHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const historyRefState = useRef(history);
  historyRefState.current = history;

  const cacheKey = currentUser ? `coachv2_history_cache_${currentUser.uid}` : 'coachv2_history_cache_anon';
  const outboxKey = currentUser ? `coachv2_outbox_${currentUser.uid}` : 'coachv2_outbox_anon';

  const setWorkoutHistory = useCallback((value) => {
    const prev = historyRefState.current || [];
    const nextVal = typeof value === 'function' ? value(prev) : value;
    const check = validateDatasetChange('coachv2_history', prev, nextVal);
    if (!check.allowed) {
      console.error(`[DataGuardian] Actualización de historial bloqueada en useWorkoutHistory: ${check.reason}`);
      return;
    }
    historyRefState.current = nextVal;
    setHistory(nextVal);
    set(cacheKey, nextVal).catch(err => console.warn("Error guardando en caché IndexedDB:", err));
    set('coachv2_history', nextVal).catch(() => {});
  }, [cacheKey]);

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
          historyRefState.current = cached;
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
        historyRefState.current = e.detail.allSessions;
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

  // 2. SINCRONIZACIÓN EN TIEMPO REAL CON FIRESTORE (INMUNE A SOBREESCRITURAS DE DATOS LOCALES)
  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    if (!currentUser) {
      if (isMounted) setIsLoading(false);
      return;
    }

    const historyCollectionRef = collection(db, 'users', currentUser.uid, 'history');

    unsubscribe = onSnapshot(historyCollectionRef, (snapshot) => {
      if (isMounted) {
        // Si el snapshot contiene escrituras locales pendientes en vuelo, no sobreescribir la memoria local
        if (snapshot.metadata?.hasPendingWrites) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const firestoreSessions = snapshot.docs.map(docSnap => docSnap.data());

        // Fusión inteligente: las sesiones locales con cambios recientes o más series NUNCA son pisadas
        const sessionMap = new Map();
        firestoreSessions.forEach(s => {
          const key = s.id || s.timestamp || s.date;
          if (key) sessionMap.set(key, s);
        });

        const currentLocal = historyRefState.current || [];
        currentLocal.forEach(localS => {
          const key = localS.id || localS.timestamp || localS.date;
          if (!key) return;

          if (!sessionMap.has(key)) {
            sessionMap.set(key, localS);
          } else {
            const cloudS = sessionMap.get(key);
            const localSets = localS.completedSets || 0;
            const cloudSets = cloudS.completedSets || 0;
            const localVol = localS.volume || 0;
            const cloudVol = cloudS.volume || 0;
            const localTime = new Date(localS.lastModified || localS.updatedAt || localS.timestamp || 0).getTime();
            const cloudTime = new Date(cloudS.lastModified || cloudS.updatedAt || cloudS.timestamp || 0).getTime();

            // Si la versión local tiene más series, más volumen o modificación más reciente: LOCAL GANA
            if (localSets > cloudSets || (localSets === cloudSets && localVol >= cloudVol) || localTime >= cloudTime) {
              sessionMap.set(key, { ...cloudS, ...localS });
            }
          }
        });

        const allSessions = Array.from(sessionMap.values()).sort((a, b) => {
          const timeA = new Date(a.timestamp || a.date || a.startTime || a.id || 0).getTime() || 0;
          const timeB = new Date(b.timestamp || b.date || b.startTime || b.id || 0).getTime() || 0;
          return timeA - timeB;
        });

        // Verificación con DataGuardian: bloquear si un snapshot vacío o anómalo intenta pisar el historial
        const prevHistory = historyRefState.current || [];
        const guardianCheck = validateDatasetChange('coachv2_history', prevHistory, allSessions);
        if (!guardianCheck.allowed) {
          console.error(`[DataGuardian] Snapshot de Firestore bloqueado por reducción anómala: ${guardianCheck.reason}`);
          if (isMounted) setIsLoading(false);
          return;
        }

        historyRefState.current = allSessions;
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
              await setDoc(docRef, sanitizeForFirestore(item.session), { merge: true });
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
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushOutbox();
      }
    };
    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [flushOutbox]);

  // 3. GUARDADO RESILIENTE (OPTIMISTA EN MEMORIA E INDEXEDDB + ENRIQUECIMIENTO CON TIMESTAMP)
  const saveSession = useCallback(async (session) => {
    if (!session || !session.id) return;

    const enrichedSession = {
      ...session,
      lastModified: Date.now()
    };

    // Actualización optimista instantánea en memoria (0ms)
    const updatedHistory = [...historyRefState.current.filter(s => s.id !== enrichedSession.id), enrichedSession].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date || a.id).getTime();
      const timeB = new Date(b.timestamp || b.date || b.id).getTime();
      return timeA - timeB;
    });

    historyRefState.current = updatedHistory;
    setHistory(updatedHistory);

    // Guardado inmediato en IndexedDB
    await set(cacheKey, updatedHistory).catch(e => console.warn("Error guardando en caché IndexedDB:", e));
    await set('coachv2_history', updatedHistory).catch(() => {});

    // Sincronización con Firestore / Outbox
    if (currentUser) {
      const isOnline = typeof navigator === 'undefined' || navigator.onLine;
      if (isOnline) {
        try {
          const docRef = doc(db, 'users', currentUser.uid, 'history', enrichedSession.id);
          await setDoc(docRef, sanitizeForFirestore(enrichedSession), { merge: true });
          return;
        } catch (error) {
          console.warn("[Outbox] Fallo envío a Firebase, encolando en Outbox:", error);
        }
      }
      try {
        const outbox = (await get(outboxKey)) || [];
        const filtered = outbox.filter(item => (item.session?.id || item.sessionId) !== enrichedSession.id);
        filtered.push({ action: 'save', session: enrichedSession });
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
    historyRefState.current = updatedHistory;
    setHistory(updatedHistory);
    await set(cacheKey, updatedHistory).catch(e => console.warn("Error guardando en caché IndexedDB:", e));
    await set('coachv2_history', updatedHistory).catch(() => {});

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

  return [history, setWorkoutHistory, isLoading, saveSession, deleteSession];
}
