import React, { useState } from 'react';
import { scientificProtocol } from '../data/scientificProtocol';
import ExerciseRow from './ExerciseRow';
import CardioLogger from './CardioLogger';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CheckCircle, Calendar, ArrowLeft, ArrowRight, Save, Flame, RefreshCcw, Plus, X, Dumbbell } from 'lucide-react';

export default function WorkoutDay() {
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    let day = new Date().getDay();
    if (day === 0) day = 7; 
    return day - 1;
  });
  
  const baseDay = scientificProtocol[currentDayIndex];
  
  // Ejercicios personalizados agregados por el usuario a cada día
  const [customExercisesMap, setCustomExercisesMap] = useLocalStorage('coachv2_custom_day_exercises', {});
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('3');
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExRest, setNewExRest] = useState('90 s');
  const [newExBiomech, setNewExBiomech] = useState('');

  // Almacenamiento del entrenamiento activo e historial global
  const [currentSessions, setCurrentSessions] = useLocalStorage('coachv2_active_workouts', {});
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('coachv2_history', []);

  // Combinar ejercicios base del protocolo con los agregados por el usuario para este día
  const userCustomForDay = customExercisesMap[baseDay.id] || [];
  const currentDay = {
    ...baseDay,
    exercises: [...(baseDay.exercises || []), ...userCustomForDay]
  };

  const todayWorkoutData = currentSessions[currentDay.id] || {};
  const previousSession = [...workoutHistory].reverse().find(s => s.dayId === currentDay.id) || {};
  const previousExercisesData = previousSession.exercises || {};

  // Actualizar sets de un ejercicio
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

  // Actualizar datos del módulo de cardio
  const handleUpdateCardio = (exerciseId, cardioData) => {
    setCurrentSessions(prev => {
      const dayData = prev[currentDay.id] || {};
      return {
        ...prev,
        [currentDay.id]: {
          ...dayData,
          [exerciseId]: cardioData
        }
      };
    });
  };

  // Agregar ejercicio nuevo a este día
  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx = {
      id: `custom_${Date.now()}`,
      name: newExName.trim(),
      sets: parseInt(newExSets) || 3,
      reps: newExReps.trim() || '10-12',
      restTime: newExRest.trim() || '90 s',
      biomechanics: newExBiomech.trim() || 'Ejecución técnica estricta con control del rango articular y exhalación en el esfuerzo.',
      searchQuery: `${newExName} proper form anatomical exercise`,
      defaultUnit: 'lbs'
    };

    setCustomExercisesMap(prev => ({
      ...prev,
      [baseDay.id]: [...(prev[baseDay.id] || []), newEx]
    }));

    setIsAddingExercise(false);
    setNewExName('');
    setNewExBiomech('');
  };

  // Cálculo de volumen en vivo y series terminadas
  const calculateTotalVolume = () => {
    let volume = 0;
    let completedSets = 0;
    let cardioCompleted = 0;

    Object.keys(todayWorkoutData).forEach(exId => {
      const exData = todayWorkoutData[exId];
      // Si es cardio (tiene machine y duration)
      if (exData && exData.machine) {
        if (exData.completed) cardioCompleted++;
      } else if (exData) {
        // Es un ejercicio normal con series
        Object.keys(exData).forEach(setNum => {
          const set = exData[setNum];
          if (set && set.completed && set.weight && set.reps) {
            let w = parseFloat(set.weight) || 0;
            // Si el set está en KG, convertir a libras para el volumen global estándar (~2.2 lbs por kg)
            if (set.unit === 'kg') w = w * 2.20462;
            const r = parseFloat(set.reps) || 0;
            volume += (w * r);
            completedSets++;
          } else if (set && set.completed) {
            completedSets++;
          }
        });
      }
    });
    return { volume: Math.round(volume), completedSets, cardioCompleted };
  };

  const { volume, completedSets, cardioCompleted } = calculateTotalVolume();

  const handleFinishWorkout = () => {
    if (completedSets === 0 && cardioCompleted === 0) {
      alert("No has marcado ninguna serie o sesión aeróbica como completada (✓). Registra al menos un ejercicio terminado para archivar tu análisis.");
      return;
    }

    if (!confirm(`¿Deseas finalizar el entrenamiento y guardar el registro científico?\n\nSeries de fuerza listadas: ${completedSets}\nMódulos aeróbicos completados: ${cardioCompleted}\nVolumen Total (Carga x Reps): ${volume.toLocaleString()} lbs`)) {
      return;
    }

    const newSessionLog = {
      id: `ses_${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateString: new Date().toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      dayId: currentDay.id,
      dayName: currentDay.name,
      focus: currentDay.focus,
      volume,
      completedSets,
      cardioCompleted,
      exercises: todayWorkoutData
    };

    setWorkoutHistory(prev => [...prev, newSessionLog]);

    setCurrentSessions(prev => ({
      ...prev,
      [currentDay.id]: {}
    }));

    alert("¡Sesión archivada con éxito al 100%! Consulta la pestaña 'Análisis' para ver tu Heatmap de consistencia y curvas de fuerza.");
  };

  const handleResetCurrent = () => {
    if(confirm("¿Seguro que deseas reiniciar los casilleros de hoy sin guardar en la bitácora estadística?")) {
      setCurrentSessions(prev => ({
        ...prev,
        [currentDay.id]: {}
      }));
    }
  };

  return (
    <div className="container">
      {/* Navegación del Calendario */}
      <div className="flex-between card" style={{ padding: '10px 14px', marginBottom: '16px', background: '#ffffff' }}>
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '8px 12px' }}
          onClick={() => setCurrentDayIndex(prev => prev > 0 ? prev - 1 : 6)}
        >
          <ArrowLeft size={20} />
        </button>
        
        <div style={{ textAlign: 'center', flex: 1, padding: '0 8px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '4px' }}>Día {currentDay.dayNumber} de 7</span>
          <h1 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>{currentDay.name}</h1>
        </div>
        
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '8px 12px' }}
          onClick={() => setCurrentDayIndex(prev => prev < 6 ? prev + 1 : 0)}
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Enfoque Anatómico y Biomecánico del Día */}
      <div className="card card-highlight" style={{ padding: '14px 16px', marginBottom: '18px', background: '#ffffff' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="var(--accent-blue)" />
            <h3 style={{ margin: 0, fontSize: '15px' }}>Objetivo Fisiológico & Enfoque</h3>
          </div>
          {previousSession.dateString && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
              Último: {previousSession.dateString.split(',')[0]}
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', marginTop: '6px', color: '#334155', fontWeight: '500' }}>
          {currentDay.focus}
        </p>
      </div>

      {/* Indicadores Clínicos en Vivo de la Sesión */}
      {currentDay.type === 'workout' && (
        <div className="flex-between" style={{ background: '#0f172a', color: '#fff', padding: '12px 16px', borderRadius: '14px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Carga Acumulada</span>
            <strong style={{ fontSize: '18px', color: '#ffffff' }}>{volume.toLocaleString()} <span style={{ fontSize: '12px', color: '#94a3b8' }}>lbs-reps</span></strong>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Series Listo</span>
            <strong style={{ fontSize: '18px', color: '#10b981' }}>{completedSets} <span style={{ fontSize: '12px', color: '#94a3b8' }}>Fuerza</span></strong>
          </div>
          <button 
            onClick={handleResetCurrent} 
            title="Reiniciar checks del día" 
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: '#94a3b8', cursor: 'pointer' }}
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      )}

      {/* Contenido del Día (Ejercicios o Descanso) */}
      {currentDay.type === 'rest' && currentDay.exercises.length === 0 ? (
        <div className="card card-success" style={{ padding: '30px 20px', textAlign: 'center', margin: '20px 0' }}>
          <CheckCircle size={48} color="var(--accent-green)" style={{ margin: '0 auto 12px auto' }} />
          <h2 style={{ color: '#0f172a' }}>Día de Síntesis Fibrilar & Recuperación</h2>
          <p style={{ marginTop: '10px', color: '#334155', fontSize: '14px' }}>
            Descanso absoluto para permitir la reparación del daño muscular y regulación del sistema nervioso central.
          </p>
        </div>
      ) : (
        <div>
          {currentDay.exercises.map((exercise) => {
            if (exercise.isCardio) {
              return (
                <CardioLogger
                  key={exercise.id}
                  exercise={exercise}
                  exerciseData={todayWorkoutData[exercise.id]}
                  onUpdateCardio={(data) => handleUpdateCardio(exercise.id, data)}
                />
              );
            }

            return (
              <ExerciseRow 
                key={exercise.id} 
                exercise={exercise} 
                exerciseData={todayWorkoutData[exercise.id]}
                previousData={previousExercisesData[exercise.id]}
                onUpdateSet={(setNum, setData) => handleUpdateSet(exercise.id, setNum, setData)}
              />
            );
          })}

          {/* Modal / Panel Integrado de Agregar Ejercicio al Día */}
          {isAddingExercise ? (
            <div className="card" style={{ padding: '18px', borderTop: '4px solid var(--accent-blue)', background: '#f8fafc', marginBottom: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Dumbbell size={18} color="var(--accent-blue)" />
                  <h3 style={{ margin: 0 }}>Nuevo Ejercicio en {currentDay.name.split(':')[0]}</h3>
                </div>
                <button onClick={() => setIsAddingExercise(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={20} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleAddCustomExercise}>
                <div style={{ marginBottom: '10px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px', fontSize: '12px' }}>Nombre Científico o Comercial del Ejercicio:</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Curl de Bíceps en Banco Scott con Barra Z" 
                    value={newExName} 
                    onChange={e => setNewExName(e.target.value)} 
                    style={{ width: '100%', textAlign: 'left' }}
                  />
                </div>

                <div className="grid-2" style={{ marginBottom: '10px' }}>
                  <div>
                    <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px', fontSize: '12px' }}>Series Meta:</label>
                    <input 
                      type="number" 
                      placeholder="3" 
                      value={newExSets} 
                      onChange={e => setNewExSets(e.target.value)} 
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px', fontSize: '12px' }}>Rango de Reps:</label>
                    <input 
                      type="text" 
                      placeholder="10-12" 
                      value={newExReps} 
                      onChange={e => setNewExReps(e.target.value)} 
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px', fontSize: '12px' }}>Descanso Prescrito (Segundos / Minutos):</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 90 s (Aislamiento)" 
                    value={newExRest} 
                    onChange={e => setNewExRest(e.target.value)} 
                    style={{ width: '100%', textAlign: 'left' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px', fontSize: '12px' }}>Indicación Biomecánica / Técnica:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Mantener codos firmes contra el banco sin contraer hombros." 
                    value={newExBiomech} 
                    onChange={e => setNewExBiomech(e.target.value)} 
                    style={{ width: '100%', textAlign: 'left' }}
                  />
                </div>

                <div className="grid-2">
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddingExercise(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar en Rutina</button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ marginBottom: '24px' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setIsAddingExercise(true)}
                style={{ background: '#ffffff', border: '2px dashed #94a3b8', color: '#334155', fontWeight: '700' }}
              >
                <Plus size={18} color="var(--accent-blue)" /> + Agregar Ejercicio a este Día
              </button>
            </div>
          )}

          {/* Botón Principal de Finalizar y Guardar Sesión */}
          <div style={{ marginTop: '32px', marginBottom: '20px' }}>
            <button className="btn btn-primary" onClick={handleFinishWorkout} style={{ padding: '16px', fontSize: '16px', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)' }}>
              <Save size={22} /> Guardar Sesión en Bitácora Científica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
