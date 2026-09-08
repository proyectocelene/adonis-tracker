import React, { createContext, useContext, useCallback } from 'react';

const GlobalTimerContext = createContext();

export function useGlobalTimer() {
  return useContext(GlobalTimerContext);
}

export function GlobalTimerProvider({ children }) {
  const startTimer = useCallback(() => {}, []);
  const stopTimer = useCallback(() => {}, []);
  const setTimerDuration = useCallback(() => {}, []);
  const addSeconds = useCallback(() => {}, []);
  const enterPiP = useCallback(() => {}, []);

  return (
    <GlobalTimerContext.Provider value={{ 
      restTimerSeconds: 0, 
      selectedDuration: 90,
      isTimerActive: false, 
      currentExerciseName: '',
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
