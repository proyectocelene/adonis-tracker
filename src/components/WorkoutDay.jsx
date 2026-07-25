import React, { useState } from 'react';
import { adonisProtocol } from '../data/adonisProtocol';
import ExerciseRow from './ExerciseRow';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ShieldAlert, CheckCircle, Calendar, ArrowLeft, ArrowRight, Play, Save, Flame, RefreshCcw } from 'lucide-react';

export default function WorkoutDay() {
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    let day = new Date().getDay();
    if (day === 0) day = 7; 
    return day - 1;
  });
  
  const currentDay = adonisProtocol[currentDayIndex];
  
  // Almacenamiento local del estado actual del entrenamiento en curso
  const [currentSessions, setCurrentSessions] = useLocalStorage('coachv2_active_workouts', {});
  // Almacenamiento local del historial general de todas las sesiones pasadas
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('coachv2_history', []);

  // Datos del día actual en ejecución
  const todayWorkoutData = currentSessions[currentDay.id] || {};

  // Busca la última vez que el usuario completó y guardó ESTE día específico en el historial para mostrarle los pesos previos
  const previousSession = [...workoutHistory].reverse().find(s => s.dayId === currentDay.id) || {};
  const previousExercisesData = previousSession.exercises || {};

  // Función para actualizar una serie específica de un ejercicio
  const handleUpdateSet = (exerciseId, setNumber, setData) => {
    setCurrentSessions(prev => {
      const dayData = prev[currentDay.id] || {};
      const exData = dayData[exerciseId] || {};
      return {
        ...prev,
        [currentDay.id]: {
          ...dayData,
          [exerciseId]: {
            ...exData,
            [setNumber]: setData
          }
        }
      };
    });
  };

  // Función para calcular volumen de la sesión en tiempo real (Peso x Reps)
  const calculateTotalVolume = () => {
    let volume = 0;
    let completedSets = 0;
    
    Object.keys(todayWorkoutData).forEach(exId => {
      const exData = todayWorkoutData[exId];
      Object.keys(exData).forEach(setNum => {
        const set = exData[setNum];
        if (set.completed && set.weight && set.reps) {
          const w = parseFloat(set.weight) || 0;
          const r = parseFloat(set.reps) || 0;
          volume += (w * r);
          completedSets++;
        }
      });
    });
    return { volume: Math.round(volume), completedSets };
  };

  const { volume, completedSets } = calculateTotalVolume();

  const handleFinishWorkout = () => {
    if (completedSets === 0) {
      alert("No has marcado ninguna serie como completada (✓). Registra tu esfuerzo para poder guardar el análisis estadístico.");
      return;
    }

    if (!confirm(`¿Deseas finalizar el entrenamiento y guardar la sesión en el registro estadístico?\n\nSeries terminadas: ${completedSets}\nVolumen Total: ${volume.toLocaleString()} lbs`)) {
      return;
    }

    // Crear objeto de registro científico
    const newSessionLog = {
      id: `ses_${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateString: new Date().toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      dayId: currentDay.id,
      dayName: currentDay.name,
      focus: currentDay.focus,
      volume,
      completedSets,
      exercises: todayWorkoutData
    };

    // Guardar en el historial
    setWorkoutHistory(prev => [...prev, newSessionLog]);

    // Reiniciar los casilleros del día actual para la siguiente semana, pero dejando los pesos y reps para la siguiente
    // O limpiamos el estado actual. Al limpiar, la siguiente semana leerá "previousExercisesData" para precargar o mostrar referencia!
    setCurrentSessions(prev => ({
      ...prev,
      [currentDay.id]: {}
    }));

    alert("¡Entrenamiento registrado con éxito! Consulta la pestaña 'Análisis' para ver tus gráficas y evolución.");
  };

  const handleResetCurrent = () => {
    if(confirm("¿Seguro que deseas reiniciar los checks y casilleros sin guardar este entrenamiento?")) {
      setCurrentSessions(prev => ({
        ...prev,
        [currentDay.id]: {}
      }));
    }
  };

  return (
    <div className="container">
      {/* Navegación entre días del calendario */}
      <div className="flex-between card" style={{ padding: '12px 16px', marginBottom: '16px', background: '#f8fafc' }}>
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '6px 12px' }}
          onClick={() => setCurrentDayIndex(prev => prev > 0 ? prev - 1 : 6)}
        >
          <ArrowLeft size={18} />
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <span className="badge badge-blue" style={{ marginBottom: '4px' }}>Día {currentDay.dayNumber} de 7</span>
          <h1 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{currentDay.name}</h1>
        </div>
        
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '6px 12px' }}
          onClick={() => setCurrentDayIndex(prev => prev < 6 ? prev + 1 : 0)}
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Tarjeta de Enfoque y Reglas Inquebrantables del Protocolo Adonis */}
      <div className="card card-highlight" style={{ padding: '14px 16px', marginBottom: '20px', background: '#ffffff' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="var(--accent-warning)" />
            <h3 style={{ margin: 0 }}>Enfoque Científico</h3>
          </div>
          {previousSession.dateString && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Última vez: {previousSession.dateString}
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', marginTop: '6px', color: '#334155', fontWeight: '500' }}>
          {currentDay.focus}
        </p>
      </div>

      {/* Indicador en vivo de Volumen y Series */}
      {currentDay.type === 'workout' && (
        <div className="flex-between" style={{ background: '#0f172a', color: '#fff', padding: '12px 18px', borderRadius: '12px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Volumen de Sesión</span>
            <strong style={{ fontSize: '18px', color: '#ffffff' }}>{volume.toLocaleString()} <span style={{ fontSize: '12px', color: '#94a3b8' }}>lbs-reps</span></strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Series Completadas</span>
            <strong style={{ fontSize: '18px', color: '#059669' }}>{completedSets} <span style={{ fontSize: '12px', color: '#94a3b8' }}>listas</span></strong>
          </div>
          <button 
            onClick={handleResetCurrent} 
            title="Reiniciar casilleros del día" 
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      )}

      {/* Lista de Ejercicios o Día de Descanso */}
      {currentDay.type === 'rest' ? (
        <div className="card card-success" style={{ padding: '32px 20px', textAlign: 'center', my: '40px' }}>
          <CheckCircle size={48} color="var(--accent-green)" style={{ margin: '0 auto 12px auto' }} />
          <h2 style={{ color: '#0f172a' }}>Día de Descanso / Recuperación Absoluta</h2>
          <p style={{ marginTop: '12px', color: '#475569' }}>
            {currentDay.exercises[0]?.notes || 'Recuperación absoluta. Dedícate a tu trabajo y prepara tus comidas (Meal Prep) para maximizar la síntesis proteica.'}
          </p>
          <div style={{ marginTop: '20px', padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-blue)' }}>💡 Regla del Coach:</span>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Hoy no se levanta hierro ni se hace cardio extenuante (cero HIIT/correr). Guarda tus energías para que la pared abdominal y el sistema nervioso se recuperen del daño fibrilar.
            </p>
          </div>
        </div>
      ) : (
        <div>
          {currentDay.exercises.map((exercise) => (
            <ExerciseRow 
              key={exercise.id} 
              exercise={exercise} 
              exerciseData={todayWorkoutData[exercise.id]}
              previousData={previousExercisesData[exercise.id]}
              onUpdateSet={(setNum, setData) => handleUpdateSet(exercise.id, setNum, setData)}
            />
          ))}

          {/* Botones de Finalizar Sesión */}
          <div style={{ marginTop: '28px', marginBottom: '16px' }}>
            <button className="btn btn-primary" onClick={handleFinishWorkout} style={{ padding: '16px', fontSize: '16px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}>
              <Save size={20} /> Guardar Registro Científico
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
