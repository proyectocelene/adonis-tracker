import { useState, useEffect, useCallback, useRef } from 'react';
import { db, sanitizeForFirestore } from '../services/firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { validateDatasetChange } from '../services/dataGuardian';

/**
 * Hook useWorkoutHistory (Fase 2: Fuente Única de Verdad)
 * - Firestore con persistentLocalCache como ÚNICA capa offline y online (0ms de latencia).
 * - Soft-delete universal: las sesiones eliminadas reciben { deletedAt, updatedAt } previniendo resurrección.
 * - Sin espejos manuales en idb-keyval ni colas outbox paralelas.
 * - Cierre de sesión (logout) limpio sin alertas falsas de DataGuardian.
 */
export function useWorkoutHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const historyRefState = useRef(history);
  historyRefState.current = history;

  const setWorkoutHistory = useCallback((value) => {
    const prev = historyRefState.current || [];
    const nextVal = typeof value === 'function' ? value(prev) : value;

    // Solo validar con DataGuardian si hay un usuario autenticado activo
    if (currentUser) {
      const check = validateDatasetChange('coachv2_history', prev, nextVal);
      if (!check.allowed) {
        console.error(`[DataGuardian] Actualización de historial bloqueada en useWorkoutHistory: ${check.reason}`);
        return;
      }
    }

    historyRefState.current = nextVal;
    setHistory(nextVal);
  }, [currentUser]);

  // Sincronización en tiempo real y offline con Firestore
  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    // Ajuste 5: Logout limpio cuando currentUser es null (sin disparar DataGuardian)
    if (!currentUser || !currentUser.uid) {
      historyRefState.current = [];
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const historyColRef = collection(db, 'users', currentUser.uid, 'history');

    unsubscribe = onSnapshot(
      historyColRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        if (!isMounted) return;

        // Mapear documentos y filtrar estrictamente aquellos con soft-delete (deletedAt)
        const activeSessions = snapshot.docs
          .map(docSnap => ({ ...docSnap.data(), id: docSnap.id }))
          .filter(s => !s.deletedAt);

        // Ordenar cronológicamente ascendente
        const sortedSessions = activeSessions.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.date || a.startTime || a.id || 0).getTime() || 0;
          const timeB = new Date(b.timestamp || b.date || b.startTime || b.id || 0).getTime() || 0;
          return timeA - timeB;
        });

        // Verificación con DataGuardian: bloquear si un snapshot vacío intenta pisar datos existentes
        const prevHistory = historyRefState.current || [];
        const check = validateDatasetChange('coachv2_history', prevHistory, sortedSessions);
        if (!check.allowed) {
          console.error(`[DataGuardian] Snapshot de Firestore bloqueado por reducción anómala: ${check.reason}`);
          setIsLoading(false);
          return;
        }

        historyRefState.current = sortedSessions;
        setHistory(sortedSessions);
        setIsLoading(false);
      },
      (error) => {
        console.warn("[useWorkoutHistory] Aviso snapshot Firestore:", error.message);
        if (isMounted) setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Guardado de sesión: optimista en memoria + Firestore con updatedAt y deletedAt: null
  const saveSession = useCallback(async (session) => {
    if (!session || !session.id) return;

    const enrichedSession = {
      ...session,
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };

    // Actualización optimista en memoria (0ms)
    const currentList = historyRefState.current || [];
    const updatedHistory = [...currentList.filter(s => s.id !== enrichedSession.id), enrichedSession].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date || a.id || 0).getTime();
      const timeB = new Date(b.timestamp || b.date || b.id || 0).getTime();
      return timeA - timeB;
    });

    historyRefState.current = updatedHistory;
    setHistory(updatedHistory);

    // Persistencia directa en Firestore (persistentLocalCache lo persiste offline de inmediato)
    if (currentUser && currentUser.uid) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'history', enrichedSession.id);
        await setDoc(docRef, sanitizeForFirestore(enrichedSession), { merge: true });
      } catch (error) {
        console.warn("[useWorkoutHistory] Error guardando sesión en Firestore:", error.message);
      }
    }
  }, [currentUser]);

  // Eliminación de sesión: Soft-delete con deletedAt para propagación multi-dispositivo
  const deleteSession = useCallback(async (sessionId) => {
    if (!sessionId) return;

    // Actualización optimista en memoria
    const updatedHistory = (historyRefState.current || []).filter(s => s.id !== sessionId);
    historyRefState.current = updatedHistory;
    setHistory(updatedHistory);

    // Soft-delete en Firestore: el documento permanece con deletedAt para que ningún otro
    // dispositivo lo vuelva a resucitar al sincronizar
    if (currentUser && currentUser.uid) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'history', sessionId);
        const nowIso = new Date().toISOString();
        await setDoc(docRef, {
          deletedAt: nowIso,
          updatedAt: nowIso
        }, { merge: true });
      } catch (error) {
        console.warn("[useWorkoutHistory] Error aplicando soft-delete en Firestore:", error.message);
      }
    }
  }, [currentUser]);

  return [history, setWorkoutHistory, isLoading, saveSession, deleteSession];
}
