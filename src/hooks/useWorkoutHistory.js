import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export function useWorkoutHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    if (!currentUser) {
      if (isMounted) setIsLoading(false);
      return;
    }

    const historyRef = collection(db, 'users', currentUser.uid, 'history');
    const q = query(historyRef, orderBy('timestamp', 'asc'));

    setIsLoading(true);

    unsubscribe = onSnapshot(q, (snapshot) => {
      if (isMounted) {
        const data = snapshot.docs.map(doc => doc.data());
        setHistory(data);
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error sincronizando historial:", error);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Actualiza o Añade una sesión a la colección de Firebase
  const saveSession = useCallback(async (session) => {
    if (!currentUser || !session || !session.id) return;
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'history', session.id);
      await setDoc(docRef, session);
    } catch (error) {
      console.error("Error guardando sesión:", error);
    }
  }, [currentUser]);

  // Elimina una sesión de la colección de Firebase
  const deleteSession = useCallback(async (sessionId) => {
    if (!currentUser || !sessionId) return;
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'history', sessionId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error eliminando sesión:", error);
    }
  }, [currentUser]);

  // Update history completely (for restore operations, wait until saveSession loop)
  const setWorkoutHistory = useCallback(async (newHistoryArray) => {
     if (!currentUser) return;
     // Note: Direct array setting isn't recommended for collections, 
     // but if needed, we'll write them one by one.
     try {
       for (const session of newHistoryArray) {
         if (session.id) {
           const docRef = doc(db, 'users', currentUser.uid, 'history', session.id);
           await setDoc(docRef, session);
         }
       }
     } catch (e) {
       console.error("Error sobrescribiendo historial", e);
     }
  }, [currentUser]);

  return [history, setWorkoutHistory, isLoading, saveSession, deleteSession];
}
