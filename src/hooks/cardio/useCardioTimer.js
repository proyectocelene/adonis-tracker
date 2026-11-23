import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para el cronómetro integrado de la sesión de cardio.
 */
export function useCardioTimer() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (!timerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = useCallback((sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerSeconds(0);
  }, []);

  const toggleTimer = useCallback(() => {
    setTimerRunning(prev => !prev);
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
