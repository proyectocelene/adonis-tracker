import React, { useState } from 'react';
import { scientificProtocol } from '../data/scientificProtocol';
import ExerciseRow from './ExerciseRow';
import CardioLogger from './CardioLogger';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CheckCircle, Calendar, ArrowLeft, ArrowRight, Save, Flame, RefreshCcw, Plus, X, Dumbbell, ShieldCheck } from 'lucide-react';

export default function WorkoutDay() {
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    let day = new Date().getDay();
    if (day === 0) day = 7; 
    return day - 1;
  });
  
  const baseDay = scientificProtocol[currentDayIndex];
  const [customExercisesMap, setCustomExercisesMap] = useLocalStorage('coachv2_custom_day_exercises', {});
  
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('3');
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExRest, setNewExRest] = useState('90 s');
  const [newExBiomech, setNewExBiomech] = useState('');

  const [currentSessions, setCurrentSessions] = useLocalStorage('coachv2_active_workouts', {});
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('coachv2_history', []);

  const userCustomForDay = customExercisesMap[baseDay.id] || [];
  const currentDay = {
    ...baseDay,
    exercises: [...(baseDay.exercises || []), ...userCustomForDay]
  };

  const todayWorkoutData = currentSessions[currentDay.id] || {};
  const previousSession = [...workoutHistory].reverse().find(s => s.dayId === currentDay.id) || {};
  const previousExercisesData = previousSession.exercises || {};

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

  const handleUpdateExerciseMeta = (exerciseId, metaData) => {
    setCurrentSessions(prev => {
      const dayData = prev[currentDay.id] || {};
      const exData = dayData[exerciseId] || {};
      return {
        ...prev,
        [currentDay.id]: {
          ...dayData,
          [exerciseId]: {
            ...exData,
            ...metaData
          }
        }
      };
    });
  };

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

  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx = {
      id: `custom_${Date.now()}`,
      name: newExName.trim(),
      sets: parseInt(newExSets) || 3,
      reps: newExReps.trim() || '10-12',
      restTime: newExRest.trim() || '90 s',
      biomechanics: newExBiomech.trim() || 'Ejecución técnica estricta con control del rango articular.',
      searchQuery: `${newExName} biomechanics execution`,
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

  const calculateTotalVolume = () => {
    let volume = 0;
    let completedSets = 0;
    let cardioCompleted = 0;

    Object.keys(todayWorkoutData).forEach(exId => {
      const exData = todayWorkoutData[exId];
      if (exData && exData.machine) {
        if (exData.completed) cardioCompleted++;
      } else if (exData) {
        Object.keys(exData).forEach(setNum => {
          if (!isNaN(parseInt(setNum))) {
            const set = exData[setNum];
            if (set && set.completed && set.weight && set.reps) {
              let w = parseFloat(set.weight) || 0;
              if (set.unit === 'kg') w = w * 2.20462;
              const r = parseFloat(set.reps) || 0;
              volume += (w * r);
              completedSets++;
            } else if (set && set.completed) {
              completedSets++;
            }
          }
        });
      }
    });
    return { volume: Math.round(volume), completedSets, cardioCompleted };
  };

  const { volume, completedSets, cardioCompleted } = calculateTotalVolume();

  const handleFinishWorkout = () => {
    if (completedSets === 0 && cardioCompleted === 0) {
      alert("No has marcado ninguna serie o sesión de cardio como completada (✓). Registra al menos una casilla checada para archivar la sesión en tu laboratorio analítico.");
      return;
    }

    if (!confirm(`¿Deseas finalizar el entrenamiento y guardar tu bitácora científica?\n\nSeries de fuerza listas: ${completedSets}\nMódulos aeróbicos listos: ${cardioCompleted}\nVolumen total levantado: ${volume.toLocaleString()} lbs`)) {
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

    alert("¡Sesión archivada al 100%! Consulta la pestaña 'Análisis' para ver tu curva Epley 1RM y tu nuevo Heatmap verde.");
  };

  const handleResetCurrent = () => {
    if(confirm("¿Seguro que deseas reiniciar y desmarcar las casillas de hoy sin archivar los datos?")) {
      setCurrentSessions(prev => ({
        ...prev,
        [currentDay.id]: {}
      }));
    }
  };

  const getFirstUncompletedIdx = () => {
    for (let idx = 0; idx < currentDay.exercises.length; idx++) {
      const ex = currentDay.exercises[idx];
      const data = todayWorkoutData[ex.id];
      if (ex.isCardio) {
        if (!data?.completed) return idx;
      } else {
        const totalSets = parseInt(ex.sets) || 3;
        let completed = 0;
        if (data) {
          for (let s = 1; s <= totalSets; s++) {
            if (data[s]?.completed) completed++;
          }
        }
        if (completed < totalSets) return idx;
      }
    }
    return 0;
  };

  const firstUncompletedIdx = getFirstUncompletedIdx();

  return (
    <div className="container">
      {/* Navegación del Calendario (Texto completamente visible sin recortes o puntos suspensivos) */}
      <div className="card" style={{ padding: '16px 14px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <button 
            className="btn btn-outline" 
            style={{ width: '48px', height: '48px', padding: '0', borderRadius: '16px', flexShrink: 0 }}
            onClick={() => setCurrentDayIndex(prev => prev > 0 ? prev - 1 : 6)}
          >
            <ArrowLeft size={22} />
          </button>
          
          <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '6px', fontSize: '11px' }}>
              Día {currentDay.dayNumber} de 7
            </span>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', whiteSpace: 'normal', lineBreak: 'strict', lineHeight: '1.35', color: '#0f172a' }}>
              {currentDay.name}
            </h1>
          </div>
          
          <button 
            className="btn btn-outline" 
            style={{ width: '48px', height: '48px', padding: '0', borderRadius: '16px', flexShrink: 0 }}
            onClick={() => setCurrentDayIndex(prev => prev < 6 ? prev + 1 : 0)}
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      {/* Enfoque Fisiológico */}
      <div className="card card-highlight" style={{ padding: '16px', marginBottom: '16px' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Enfoque Fisiológico</h3>
          </div>
          {previousSession.dateString && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
              Última sesión: {previousSession.dateString.split(',')[0]}
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', marginTop: '8px', color: '#334155', fontWeight: '500', lineHeight: '1.5' }}>
          {currentDay.focus}
        </p>
      </div>

      {/* Barritas KPI en vivo (Apple Glass Black Pill) */}
      {currentDay.type === 'workout' && (
        <div style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
          color: '#fff', 
          padding: '16px 18px', 
          borderRadius: '24px', 
          marginBottom: '20px', 
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Carga Acumulada</span>
            <strong style={{ fontSize: '20px', color: '#ffffff', fontWeight: '800' }}>{volume.toLocaleString()} <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>lbs-reps</span></strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Series Listo</span>
            <strong style={{ fontSize: '20px', color: '#00b464', fontWeight: '800' }}>{completedSets} <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Fuerza</span></strong>
          </div>
          <button 
            onClick={handleResetCurrent} 
            title="Reiniciar casillas hoy" 
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', padding: '10px', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      )}

      {/* Contenedor de Rutina */}
      {currentDay.type === 'rest' && currentDay.exercises.length === 0 ? (
        <div className="card card-success" style={{ padding: '36px 22px', textAlign: 'center', margin: '20px 0' }}>
          <CheckCircle size={52} color="#00b464" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ color: '#0f172a', fontSize: '20px' }}>Día de Síntesis Fibrilar & Descanso</h2>
          <p style={{ marginTop: '10px', color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
            Descanso programado para permitir la remodelación miofibrilar, reposición de glucógeno y recuperación óptima del sistema nervioso central.
          </p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', padding: '0 4px', letterSpacing: '0.3px' }}>
            <span>Rutina Preconfigurada (Toca para Desplegar ▼):</span>
            <span>{currentDay.exercises.length} Módulos</span>
          </div>

          {currentDay.exercises.map((exercise, idx) => {
            const isTargetExpanded = (idx === firstUncompletedIdx);

            if (exercise.isCardio) {
              return (
                <CardioLogger
                  key={exercise.id}
                  exercise={exercise}
                  exerciseData={todayWorkoutData[exercise.id]}
                  onUpdateCardio={(data) => handleUpdateCardio(exercise.id, data)}
                  initiallyExpanded={isTargetExpanded}
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
                onUpdateExerciseMeta={(meta) => handleUpdateExerciseMeta(exercise.id, meta)}
                initiallyExpanded={isTargetExpanded}
              />
            );
          })}

          {/* Módulo de Agregar Nuevo Ejercicio */}
          {isAddingExercise ? (
            <div className="card animate-fade" style={{ padding: '18px', borderTop: '5px solid #0066ff', background: '#ffffff', marginBottom: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Dumbbell size={18} color="#0066ff" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Nuevo Ejercicio en Rutina</h3>
                </div>
                <button onClick={() => setIsAddingExercise(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={22} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleAddCustomExercise}>
                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Nombre del Ejercicio:</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Curl de Bíceps en Banco Scott con Barra Z" 
                    value={newExName} 
                    onChange={e => setNewExName(e.target.value)} 
                    style={{ textAlign: 'left' }}
                  />
                </div>

                <div className="grid-2" style={{ marginBottom: '12px' }}>
                  <div className="input-group">
                    <label className="input-label" style={{ textAlign: 'left', marginBottom: '4px' }}>Series Meta:</label>
                    <input 
                      type="number" 
                      placeholder="3" 
                      value={newExSets} 
                      onChange={e => setNewExSets(e.target.value)} 
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label" style={{ textAlign: 'left', marginBottom: '4px' }}>Rango de Reps:</label>
                    <input 
                      type="text" 
                      placeholder="10-12" 
                      value={newExReps} 
                      onChange={e => setNewExReps(e.target.value)} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Descanso Prescrito:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 90 s" 
                    value={newExRest} 
                    onChange={e => setNewExRest(e.target.value)} 
                    style={{ textAlign: 'left' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Indicación Biomecánica / Técnica:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Mantener codos firmes sin balancear el torso." 
                    value={newExBiomech} 
                    onChange={e => setNewExBiomech(e.target.value)} 
                    style={{ textAlign: 'left' }}
                  />
                </div>

                <div className="grid-2">
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddingExercise(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar en Rutina</button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ marginBottom: '24px', marginTop: '16px' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setIsAddingExercise(true)}
                style={{ background: 'rgba(255, 255, 255, 0.9)', border: '2px dashed #94a3b8', color: '#334155', fontWeight: '800', padding: '15px' }}
              >
                <Plus size={18} color="#0066ff" /> + Agregar Ejercicio a este Día
              </button>
            </div>
          )}

          {/* Botón Principal de Finalizar */}
          <div style={{ marginTop: '28px', marginBottom: '20px' }}>
            <button className="btn btn-primary" onClick={handleFinishWorkout} style={{ padding: '18px', fontSize: '17px', borderRadius: '20px', fontWeight: '800', boxShadow: '0 8px 25px rgba(0, 102, 255, 0.4)' }}>
              <Save size={24} /> Guardar Sesión en Bitácora Científica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
