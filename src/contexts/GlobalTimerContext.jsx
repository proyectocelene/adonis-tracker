import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const GlobalTimerContext = createContext();

/**
 * Extrae el límite inferior en segundos desde una prescripción (ej. '180-240 s' -> 180, '90-120 s' -> 90).
 */
export function parseRestSecondsFromPrescribed(restTime, fallback = 90) {
  if (typeof restTime === 'number' && !isNaN(restTime) && restTime > 0) {
    return Math.round(restTime);
  }
  const match = String(restTime || '').match(/\d+/);
  if (match) {
    const val = parseInt(match[0], 10);
    if (!isNaN(val) && val > 0) return val;
  }
  return fallback;
}

/**
 * Calcula los segundos restantes a partir del timestamp absoluto de expiración (`endTime`).
 * Garantiza precisión aunque el teléfono bloquee la pantalla o suspenda intervalos en segundo plano.
 */
export function computeRemainingSeconds(endTimeMs, nowMs = Date.now()) {
  if (!endTimeMs || typeof endTimeMs !== 'number') return 0;
  return Math.max(0, Math.ceil((endTimeMs - nowMs) / 1000));
}

export function formatTimerMMSS(totalSeconds = 0) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function triggerRestCompleteAlert() {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([200, 100, 200]);
    }
  } catch {
    // Ignorar si la plataforma bloquea vibración
  }
}

export function useGlobalTimer() {
  return useContext(GlobalTimerContext);
}

export function GlobalTimerProvider({ children }) {
  const [endTime, setEndTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(90);
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  const endTimeRef = useRef(endTime);
  endTimeRef.current = endTime;

  const isTimerActive = endTime !== null && restTimerSeconds > 0;

  const stopTimer = useCallback(() => {
    endTimeRef.current = null;
    setEndTime(null);
    setRestTimerSeconds(0);
  }, []);

  const startTimer = useCallback((seconds = 90, exerciseName = '') => {
    const safeSeconds = Math.max(1, parseInt(seconds, 10) || 90);
    const now = Date.now();
    const nextEndTime = now + safeSeconds * 1000;
    endTimeRef.current = nextEndTime;
    setSelectedDuration(safeSeconds);
    setCurrentExerciseName(exerciseName || '');
    setEndTime(nextEndTime);
    setRestTimerSeconds(safeSeconds);
  }, []);

  const addSeconds = useCallback((delta = 30) => {
    const currentEnd = endTimeRef.current;
    const now = Date.now();
    if (!currentEnd) {
      if (delta > 0) startTimer(delta, currentExerciseName);
      return;
    }
    const nextEndTime = Math.max(now, currentEnd + delta * 1000);
    const remaining = computeRemainingSeconds(nextEndTime, now);
    if (remaining <= 0) {
      stopTimer();
      return;
    }
    endTimeRef.current = nextEndTime;
    setEndTime(nextEndTime);
    setRestTimerSeconds(remaining);
  }, [currentExerciseName, startTimer, stopTimer]);

  const setTimerDuration = useCallback((seconds) => {
    const safeSeconds = Math.max(1, parseInt(seconds, 10) || 90);
    setSelectedDuration(safeSeconds);
  }, []);

  const enterPiP = useCallback(() => {}, []);

  useEffect(() => {
    if (!endTime) return;

    const syncRemaining = () => {
      const remaining = computeRemainingSeconds(endTimeRef.current, Date.now());
      if (remaining <= 0) {
        endTimeRef.current = null;
        setEndTime(null);
        setRestTimerSeconds(0);
        triggerRestCompleteAlert();
      } else {
        setRestTimerSeconds(remaining);
      }
    };

    syncRemaining();
    const intervalId = setInterval(syncRemaining, 500);
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncRemaining();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      clearInterval(intervalId);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibility);
      }
    };
  }, [endTime]);

  return (
    <GlobalTimerContext.Provider value={{
      endTime,
      restTimerSeconds,
      selectedDuration,
      isTimerActive,
      currentExerciseName,
      startTimer,
      stopTimer,
      setTimerDuration,
      addSeconds,
      enterPiP
    }}>
      {children}
    </GlobalTimerContext.Provider>
  );
}
