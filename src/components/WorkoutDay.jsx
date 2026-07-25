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
      biomechanics: newExBiomech.trim() || 'Ejecución técnica estricta con control articular.',
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
        });
      }
    });
    return { volume: Math.round(volume), completedSets, cardioCompleted };
  };

  const { volume, completedSets, cardioCompleted } = calculateTotalVolume();

  const handleFinishWorkout = () => {
    if (completedSets === 0 && cardioCompleted === 0) {
      alert("No has marcado ninguna serie o sesión de cardio como completada (✓). Registra al menos un check antes de archivar la sesión en tu laboratorio de análisis.");
      return;
    }

    if (!confirm(`¿Deseas finalizar la sesión de hoy y archivar el análisis científico?\n\nSeries completadas: ${completedSets}\nMódulos aeróbicos listos: ${cardioCompleted}\nVolumen levantado: ${volume.toLocaleString()} lbs`)) {
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

    alert("¡Sesión archivada al 100%! Revisa la pestaña 'Análisis' para admirar tu nueva curva Epley y Heatmap.");
  };

  const handleResetCurrent = () => {
    if(confirm("¿Seguro que deseas limpiar las casillas chequeadas de hoy sin guardar en el historial?")) {
      setCurrentSessions(prev => ({
        ...prev,
        [currentDay.id]: {}
      }));
    }
  };

  // Determinar el índice del primer ejercicio incompleto para expandirlo en automático y cerrar los demás
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
    return 0; // Si todo está completado o es nuevo, desplegar el primero por defecto
  };

  const firstUncompletedIdx = getFirstUncompletedIdx();

  return (
    <div className="container">
      {/* Navegación del Calendario de la Semana (Liquid Glass iOS) */}
      <div className="card flex-between" style={{ padding: '12px 14px', marginBottom: '12px' }}>
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '8px 12px', borderRadius: '12px' }}
          onClick={() => setCurrentDayIndex(prev => prev > 0 ? prev - 1 : 6)}
        >
          <ArrowLeft size={18} />
        </button>
        
        <div style={{ textAlign: 'center', flex: 1, minWidth: 0, padding: '0 4px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '3px', fontSize: '10px' }}>Día {currentDay.dayNumber} de 7</span>
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentDay.name}
          </h1>
        </div>
        
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '8px 12px', borderRadius: '12px' }}
          onClick={() => setCurrentDayIndex(prev => prev < 6 ? prev + 1 : 0)}
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Enfoque Biomecánico */}
      <div className="card card-highlight" style={{ padding: '14px', marginBottom: '12px' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={18} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>Enfoque Fisiológico</h3>
          </div>
          {previousSession.dateString && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
              Último: {previousSession.dateString.split(',')[0]}
            </span>
          )}
        </div>
        <p style={{ fontSize: '12px', marginTop: '6px', color: '#334155', fontWeight: '500', lineHeight: '1.4' }}>
          {currentDay.focus}
        </p>
      </div>

      {/* Barritas KPI en vivo (Totalmente contenidas en móvil sin desbordar) */}
      {currentDay.type === 'workout' && (
        <div style={{ 
          background: '#0f172a', 
          color: '#fff', 
          padding: '12px 16px', 
          borderRadius: '20px', 
          marginBottom: '16px', 
          boxShadow: '0 8px 24px rgba(15,23,42,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Carga Acumulada</span>
            <strong style={{ fontSize: '17px', color: '#ffffff' }}>{volume.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8' }}>lbs-reps</span></strong>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Series Listo</span>
            <strong style={{ fontSize: '17px', color: '#00b464' }}>{completedSets} <span style={{ fontSize: '11px', color: '#94a3b8' }}>Fuerza</span></strong>
          </div>
          <button 
            onClick={handleResetCurrent} 
            title="Reiniciar casillas hoy" 
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '8px', color: '#94a3b8', cursor: 'pointer' }}
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      )}

      {/* Contenedor de Chips Desplegables por Ejercicio */}
      {currentDay.type === 'rest' && currentDay.exercises.length === 0 ? (
        <div className="card card-success" style={{ padding: '30px 18px', textAlign: 'center', margin: '16px 0' }}>
          <CheckCircle size={44} color="#00b464" style={{ margin: '0 auto 12px auto' }} />
          <h2 style={{ color: '#0f172a', fontSize: '18px' }}>Día de Síntesis Fibrilar & Descanso</h2>
          <p style={{ marginTop: '8px', color: '#334155', fontSize: '13px' }}>
            Descanso programado para optimizar la reparación miofibrilar, reposición celular y regulación del sistema nervioso central.
          </p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
            <span>Rutina Preconfigurada (Toca para Desplegar ▼):</span>
            <span>{currentDay.exercises.length} módulos</span>
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
                initiallyExpanded={isTargetExpanded}
              />
            );
          })}

          {/* Módulo de Agregar Nuevo Ejercicio */}
          {isAddingExercise ? (
            <div className="card" style={{ padding: '16px', borderTop: '4px solid #0066ff', background: '#ffffff', marginBottom: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Dumbbell size={16} color="#0066ff" />
                  <h3 style={{ margin: 0, fontSize: '15px' }}>Nuevo Ejercicio Personalizado</h3>
                </div>
                <button onClick={() => setIsAddingExercise(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={20} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleAddCustomExercise}>
                <div style={{ marginBottom: '10px' }}>
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

                <div className="grid-2" style={{ marginBottom: '10px' }}>
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

                <div style={{ marginBottom: '10px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Descanso Prescrito:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 90 s" 
                    value={newExRest} 
                    onChange={e => setNewExRest(e.target.value)} 
                    style={{ textAlign: 'left' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Indicación Biomecánica / Técnica:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Mantener codos firmes y postura estricta." 
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
            <div style={{ marginBottom: '20px', marginTop: '14px' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setIsAddingExercise(true)}
                style={{ background: 'rgba(255, 255, 255, 0.85)', border: '2px dashed #94a3b8', color: '#334155', fontWeight: '700' }}
              >
                <Plus size={18} color="#0066ff" /> + Agregar Ejercicio a este Día
              </button>
            </div>
          )}

          {/* Botón Principal de Finalizar */}
          <div style={{ marginTop: '24px', marginBottom: '16px' }}>
            <button className="btn btn-primary" onClick={handleFinishWorkout} style={{ padding: '16px', fontSize: '16px', borderRadius: '18px' }}>
              <Save size={22} /> Guardar Sesión en Bitácora Científica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
