import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { scientificProtocol } from '../data/scientificProtocol';
import ConsistencyHeatmap from './ConsistencyHeatmap';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp, Award, Clock, ChevronDown, ChevronUp, Trash2, ShieldCheck, Zap, HeartPulse, Dumbbell, Calendar } from 'lucide-react';

export default function HistoryView() {
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('coachv2_history', []);
  const [selectedExId, setSelectedExId] = useState('d1_e1'); // Press Inclinado por defecto
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  // Obtener lista completa de todos los ejercicios posibles de la rutina para el selector
  const allAvailableExercises = [];
  scientificProtocol.forEach(day => {
    if (day.exercises) {
      day.exercises.forEach(ex => {
        if (!ex.isCardio && !ex.isTime) {
          allAvailableExercises.push({ id: ex.id, name: ex.name, day: day.name.split(':')[0] });
        }
      });
    }
  });

  // Datos simulados en caso de que aún no haya historial
  const simulatedGlobalHistory = [
    { name: 'Sem 1', volumen: 9200, rpe: 7.8, f1rm: 96 },
    { name: 'Sem 2', volumen: 10400, rpe: 8.2, f1rm: 102 },
    { name: 'Sem 3', volumen: 11100, rpe: 8.5, f1rm: 108 },
    { name: 'Sem 4', volumen: 12200, rpe: 9.0, f1rm: 115 },
  ];

  const simulatedExProgression = [
    { date: 'Sem 1', maxWeight: 80, est1RM: 96, reps: 9 },
    { date: 'Sem 2', maxWeight: 85, est1RM: 102, reps: 9 },
    { date: 'Sem 3', maxWeight: 85, est1RM: 107, reps: 10 },
    { date: 'Sem 4', maxWeight: 90, est1RM: 114, reps: 9 },
  ];

  const totalSessions = workoutHistory.length;
  const totalVolumeLifted = workoutHistory.reduce((acc, ses) => acc + (ses.volume || 0), 0);
  
  const calculateGlobalAverageRPE = () => {
    let rpeSum = 0;
    let rpeCount = 0;
    workoutHistory.forEach(ses => {
      if (ses.exercises) {
        Object.values(ses.exercises).forEach(exData => {
          if (!exData.machine) {
            Object.values(exData).forEach(set => {
              if (set && set.rpe && !isNaN(parseFloat(set.rpe))) {
                rpeSum += parseFloat(set.rpe);
                rpeCount++;
              }
            });
          }
        });
      }
    });
    return rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : '8.3';
  };

  const getChartData = () => {
    if (workoutHistory.length === 0) return simulatedGlobalHistory;
    
    return workoutHistory.slice(-10).map(ses => {
      let max1RM = 0;
      let sessionRpeSum = 0;
      let sessionRpeCount = 0;

      if (ses.exercises) {
        Object.values(ses.exercises).forEach(exData => {
          if (!exData.machine) {
            Object.values(exData).forEach(set => {
              if (set && set.weight && set.reps) {
                let w = parseFloat(set.weight) || 0;
                if (set.unit === 'kg') w = w * 2.20462;
                const r = parseFloat(set.reps) || 0;
                if (w > 0 && r > 0) {
                  const est1RM = Math.round(w * (1 + r / 30));
                  if (est1RM > max1RM) max1RM = est1RM;
                }
              }
              if (set && set.rpe && !isNaN(parseFloat(set.rpe))) {
                sessionRpeSum += parseFloat(set.rpe);
                sessionRpeCount++;
              }
            });
          }
        });
      }

      return {
        name: ses.dateString ? ses.dateString.split(',')[0] : 'Sesión',
        volumen: ses.volume || 0,
        rpe: sessionRpeCount > 0 ? parseFloat((sessionRpeSum / sessionRpeCount).toFixed(1)) : 8,
        f1rm: max1RM
      };
    });
  };

  // Curva de progresión específica para el ejercicio seleccionado en el menú
  const getExerciseProgressionData = () => {
    if (workoutHistory.length === 0) return simulatedExProgression;

    const progData = [];
    workoutHistory.forEach(ses => {
      if (ses.exercises && ses.exercises[selectedExId]) {
        const exSets = ses.exercises[selectedExId];
        let maxW = 0;
        let bestReps = 0;
        let unit = 'lbs';

        Object.keys(exSets).forEach(setNum => {
          const s = exSets[setNum];
          if (s && s.completed && s.weight && !isNaN(parseFloat(s.weight))) {
            const w = parseFloat(s.weight);
            if (w >= maxW) {
              maxW = w;
              bestReps = parseFloat(s.reps) || bestReps;
              unit = s.unit || 'lbs';
            }
          }
        });

        if (maxW > 0) {
          const est1RM = Math.round(maxW * (1 + bestReps / 30));
          progData.push({
            date: ses.dateString ? ses.dateString.split(',')[0] : 'Fecha',
            maxWeight: maxW,
            est1RM,
            reps: bestReps,
            unit
          });
        }
      }
    });

    return progData.length > 0 ? progData : simulatedExProgression;
  };

  const chartData = getChartData();
  const exerciseProgData = getExerciseProgressionData();
  const selectedExDef = allAvailableExercises.find(x => x.id === selectedExId) || allAvailableExercises[0] || { name: 'Ejercicio Seleccionado' };

  const handleDeleteSession = (id) => {
    if (confirm("¿Estás seguro de eliminar este registro del historial científico?")) {
      setWorkoutHistory(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleClearAll = () => {
    if(confirm("⚠️ ¿Deseas formatear el laboratorio analítico y borrar el historial guardado?")) {
      setWorkoutHistory([]);
    }
  };

  const findExerciseDefinition = (dayId, exId) => {
    const day = scientificProtocol.find(d => d.id === dayId);
    return day?.exercises?.find(e => e.id === exId) || { name: 'Ejercicio', sets: '-', reps: '-' };
  };

  return (
    <div className="container" style={{ paddingBottom: '35px' }}>
      <div className="flex-between" style={{ marginBottom: '18px' }}>
        <div>
          <span className="badge badge-blue">Analítica y Fisiología</span>
          <h1 style={{ marginTop: '4px' }}>Laboratorio de Progreso</h1>
        </div>
        {workoutHistory.length > 0 && (
          <button className="btn btn-outline" style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', color: '#e11d48', borderColor: '#fecdd3' }} onClick={handleClearAll}>
            <Trash2 size={14} /> Limpiar Datos
          </button>
        )}
      </div>

      {/* KPIs Clínicos */}
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ padding: '12px 6px', textAlign: 'center', margin: 0 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Sesiones</span>
          <strong style={{ fontSize: '20px', color: '#0f172a', display: 'block', margin: '2px 0' }}>{totalSessions}</strong>
          <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: '600' }}>Archivadas</span>
        </div>
        
        <div className="card" style={{ padding: '12px 6px', textAlign: 'center', margin: 0, borderTop: '3px solid var(--accent-blue)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Volumen Global</span>
          <strong style={{ fontSize: '17px', color: 'var(--accent-blue)', display: 'block', margin: '2px 0' }}>{totalVolumeLifted.toLocaleString()}</strong>
          <span style={{ fontSize: '10px', color: '#64748b' }}>Lbs-Reps</span>
        </div>
        
        <div className="card" style={{ padding: '12px 6px', textAlign: 'center', margin: 0 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Intensidad</span>
          <strong style={{ fontSize: '20px', color: '#d97706', display: 'block', margin: '2px 0' }}>RPE {calculateGlobalAverageRPE()}</strong>
          <span style={{ fontSize: '10px', color: '#64748b' }}>Esfuerzo Medio</span>
        </div>
      </div>

      {/* Heatmap de Consistencia Estilo GitHub */}
      <ConsistencyHeatmap workoutHistory={workoutHistory} />

      {/* Sección de Análisis por Ejercicio Individual */}
      <div className="card card-highlight" style={{ padding: '18px', marginBottom: '22px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
            <Dumbbell size={20} color="var(--accent-blue)" />
            <h2 style={{ margin: 0, fontSize: '16px' }}>Curva Evolutiva por Ejercicio</h2>
          </div>
          <p style={{ fontSize: '12px' }}>Selecciona cualquier ejercicio del programa para rastrear su ganancia de fuerza e hipertrofia:</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <select 
            value={selectedExId}
            onChange={(e) => setSelectedExId(e.target.value)}
            style={{ width: '100%', padding: '10px', fontWeight: '700', fontSize: '14px', background: '#f8fafc', border: '2px solid #cbd5e1' }}
          >
            {allAvailableExercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.day} - {ex.name}</option>
            ))}
          </select>
        </div>

        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={exerciseProgData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--accent-blue)" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(val, name) => [val + ' lbs/kg', name === 'maxWeight' ? 'Carga Máxima' : '1RM Est. Epley']}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="maxWeight" name="Carga Máxima Levantada" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent-blue)' }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="est1RM" name="1RM Teórico (Epley)" stroke="var(--accent-green)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: 'var(--accent-green)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Sobrecarga Progresiva Global */}
      <div className="card" style={{ padding: '18px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={18} color="#0e7490" />
              <h2 style={{ margin: 0, fontSize: '16px' }}>Sobrecarga Progresiva de Volumen</h2>
            </div>
            <p style={{ fontSize: '12px', marginTop: '2px' }}>Carga mecánica total por sesión</p>
          </div>
          <span className="badge badge-green">Hipertrofia</span>
        </div>
        
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
              <Bar dataKey="volumen" name="Volumen (lbs)" fill="#0e7490" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bitácora del Atleta (Historial por Sesión) */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '12px' }}>
        <Clock size={18} color="#475569" />
        <h2 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>Bitácora de Sesiones Pasadas</h2>
      </div>
      
      {workoutHistory.length === 0 ? (
        <div className="card" style={{ padding: '26px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
          <Calendar size={32} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
          <h3 style={{ color: '#475569', margin: 0, fontSize: '15px' }}>Bitácora limpia</h3>
          <p style={{ marginTop: '8px', fontSize: '13px' }}>
            Al terminar un entrenamiento y pulsar el botón azul de Guardar en la pestaña Rutina, tus datos y métricas RPE quedarán registrados de forma indefinida en este laboratorio.
          </p>
        </div>
      ) : (
        [...workoutHistory].reverse().map((ses) => {
          const isExpanded = expandedSessionId === ses.id;
          
          return (
            <div key={ses.id} className="card" style={{ marginBottom: '14px', overflow: 'hidden' }}>
              <div 
                onClick={() => setExpandedSessionId(isExpanded ? null : ses.id)}
                style={{ 
                  padding: '14px 16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? '#f8fafc' : '#ffffff',
                  transition: 'background 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <strong style={{ fontSize: '15px', color: '#0f172a' }}>{ses.dayName}</strong>
                    {ses.completedSets > 0 && <span className="badge badge-green" style={{ fontSize: '10px' }}>{ses.completedSets} series</span>}
                    {ses.cardioCompleted > 0 && <span className="badge" style={{ background: '#ecfeff', color: '#0e7490', fontSize: '10px' }}>Cardio</span>}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    📅 {ses.dateString} • Carga: <strong>{ses.volume?.toLocaleString()} lbs</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(ses.id); }} 
                    style={{ background: 'transparent', border: 'none', color: '#e11d48', padding: '4px', cursor: 'pointer' }}
                    title="Borrar registro"
                  >
                    <Trash2 size={16} />
                  </button>
                  {isExpanded ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>
              </div>

              {/* Detalle Desplegado en Tarjetas por Ejercicio */}
              {isExpanded && ses.exercises && (
                <div style={{ padding: '4px 14px 16px 14px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  {Object.keys(ses.exercises).map((exId) => {
                    const exData = ses.exercises[exId];
                    if (!exData) return null;

                    // Si es registro de Cardio
                    if (exData.machine) {
                      return (
                        <div key={exId} style={{ marginTop: '10px', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', borderLeft: '4px solid #06b6d4' }}>
                          <div className="flex-between" style={{ marginBottom: '6px' }}>
                            <strong style={{ fontSize: '14px', color: '#0e7490' }}><HeartPulse size={14} style={{ display: 'inline' }} /> {exData.machine}</strong>
                            <span className="badge" style={{ background: '#ecfeff', color: '#0e7490' }}>{exData.duration} min</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#475569', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {exData.speed && <span>Velocidad: <strong>{exData.speed}</strong></span>}
                            {exData.incline && <span>Inclinación/Nivel: <strong>{exData.incline}</strong></span>}
                            {exData.heartRate && <span>Pulsaciones: <strong>{exData.heartRate} BPM</strong></span>}
                          </div>
                          {exData.notes && <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontStyle: 'italic', background: '#f8fafc', padding: '6px', borderRadius: '6px' }}>"{exData.notes}"</p>}
                        </div>
                      );
                    }

                    // Ejercicio de fuerza
                    const exDef = findExerciseDefinition(ses.dayId, exId);
                    const setNums = Object.keys(exData).filter(k => exData[k] && exData[k].completed && !isNaN(parseInt(k)));
                    if (setNums.length === 0) return null;

                    return (
                      <div key={exId} style={{ marginTop: '10px', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                        <div className="flex-between" style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '14px', color: '#0f172a' }}>{exDef.name || 'Ejercicio Personalizado'}</strong>
                          <span className="badge badge-blue">Meta: {exDef.reps || '-'}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {setNums.map(setNum => {
                            const s = exData[setNum];
                            return (
                              <div key={setNum} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px', background: '#f8fafc', borderRadius: '6px', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700', color: '#334155' }}>Serie #{setNum}</span>
                                <span style={{ color: '#64748b' }}>Carga: <strong style={{ color: '#2563eb' }}>{s.weight || '0'} {s.unit || 'lbs'}</strong></span>
                                <span>Logrado: <strong style={{ color: '#0f172a' }}>{s.reps || '-'} reps</strong></span>
                                <span className="badge badge-warning" style={{ margin: 0 }}>RPE {s.rpe || '8'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
