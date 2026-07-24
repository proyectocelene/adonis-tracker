import React, { useState, useEffect } from 'react';
import { adonisProtocol } from '../data/adonisProtocol';
import ExerciseRow from './ExerciseRow';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function WorkoutDay() {
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    // Defaul to current day of week (1=Monday, 7=Sunday)
    let day = new Date().getDay();
    if (day === 0) day = 7; // Make Sunday 7 instead of 0
    return day - 1;
  });
  
  const currentDay = adonisProtocol[currentDayIndex];
  const [workoutData, setWorkoutData] = useLocalStorage('adonis_workout_data', {});

  const handleExerciseUpdate = (exerciseId, updates) => {
    setWorkoutData(prev => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        ...updates,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  return (
    <div className="container">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <button 
          className="btn-primary" 
          style={{ width: 'auto', padding: '8px 12px', background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}
          onClick={() => setCurrentDayIndex(prev => prev > 0 ? prev - 1 : 6)}
        >
          &larr;
        </button>
        <h1 style={{ margin: 0, fontSize: '22px', textAlign: 'center' }}>{currentDay.name}</h1>
        <button 
          className="btn-primary" 
          style={{ width: 'auto', padding: '8px 12px', background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}
          onClick={() => setCurrentDayIndex(prev => prev < 6 ? prev + 1 : 0)}
        >
          &rarr;
        </button>
      </div>

      <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--accent-gold)' }}>
        {currentDay.focus}
      </p>

      {currentDay.type === 'rest' ? (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-cyan)' }}>Día de Descanso</h2>
          <p style={{ marginTop: '16px' }}>{currentDay.exercises[0]?.notes || 'Recuperación absoluta.'}</p>
        </div>
      ) : (
        <div>
          {currentDay.exercises.map((exercise) => (
            <ExerciseRow 
              key={exercise.id} 
              exercise={exercise} 
              history={workoutData[exercise.id]}
              onUpdate={(updates) => handleExerciseUpdate(exercise.id, updates)}
            />
          ))}
          
          <button className="btn-primary" style={{ marginTop: '24px' }}>
            Finalizar Entrenamiento
          </button>
        </div>
      )}
    </div>
  );
}
