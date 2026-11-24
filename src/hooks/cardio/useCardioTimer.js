import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook para el cronómetro integrado basado en timestamps reales (resiste pantalla bloqueada).
 */
export function useCardioTimer() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const startTimestampRef = useRef(null);
  const accumulatedSecondsRef = useRef(0);

  const syncElapsed = useCallback(() => {
    if (startTimestampRef.current !== null) {
      const elapsed = Math.max(0, Math.floor((Date.now() - startTimestampRef.current) / 1000));
      setTimerSeconds(elapsed);
    }
  }, []);

  useEffect(() => {
    if (!timerRunning) return undefined;

    if (startTimestampRef.current === null) {
      startTimestampRef.current = Date.now() - accumulatedSecondsRef.current * 1000;
    }

    syncElapsed();
    const interval = setInterval(syncElapsed, 1000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncElapsed();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      clearInterval(interval);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibility);
      }
    };
  }, [timerRunning, syncElapsed]);

  const formatTimer = useCallback((sec) => {
    const safeSec = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(safeSec / 60);
    const s = safeSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    startTimestampRef.current = null;
    accumulatedSecondsRef.current = 0;
    setTimerSeconds(0);
  }, []);

  const toggleTimer = useCallback(() => {
    setTimerRunning(prev => {
      if (prev) {
        if (startTimestampRef.current !== null) {
          const elapsed = Math.max(0, Math.floor((Date.now() - startTimestampRef.current) / 1000));
          accumulatedSecondsRef.current = elapsed;
          setTimerSeconds(elapsed);
        }
        startTimestampRef.current = null;
        return false;
      }
      startTimestampRef.current = Date.now() - accumulatedSecondsRef.current * 1000;
      return true;
    });
  }, []);

  return {
    timerRunning,
    setTimerRunning,
    timerSeconds,
    setTimerSeconds,
    formatTimer,
    resetTimer,
    toggleTimer
  };
}
