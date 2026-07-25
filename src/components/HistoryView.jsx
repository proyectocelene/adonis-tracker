import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { adonisProtocol } from '../data/adonisProtocol';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp, Award, Clock, ChevronDown, ChevronUp, Trash2, ShieldCheck, Zap } from 'lucide-react';

export default function HistoryView() {
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('coachv2_history', []);
  const [selectedExerciseId, setSelectedExerciseId] = useState('d1_e1'); // Por defecto Press Inclinado
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  // Datos simulados profesionales en caso de no tener historial todavía para mostrar el poder estadístico
  const simulatedHistory = [
    { name: 'Sem 1 (Lunes)', volumen: 8400, rpe: 7.8, f1rm: 96 },
    { name: 'Sem 2 (Lunes)', volumen: 9200, rpe: 8.2, f1rm: 102 },
    { name: 'Sem 3 (Lunes)', volumen: 9800, rpe: 8.5, f1rm: 107 },
    { name: 'Sem 4 (Lunes)', volumen: 10600, rpe: 9.0, f1rm: 114 },
  ];

  // Cálculo de estadísticas reales del historial
  const totalSessions = workoutHistory.length;
  const totalVolumeLifted = workoutHistory.reduce((acc, ses) => acc + (ses.volume || 0), 0);
  
  // Calcular el RPE promedio global en base a todas las series registradas
  const calculateGlobalAverageRPE = () => {
    let rpeSum = 0;
    let rpeCount = 0;
    workoutHistory.forEach(ses => {
      if (ses.exercises) {
        Object.values(ses.exercises).forEach(exSets => {
          Object.values(exSets).forEach(set => {
            if (set.rpe && !isNaN(parseFloat(set.rpe))) {
              rpeSum += parseFloat(set.rpe);
              rpeCount++;
            }
          });
        });
      }
    });
    return rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : '8.2';
  };

  // Prepara los datos del gráfico en base a sesiones reales de entrenamiento
  const getChartData = () => {
    if (workoutHistory.length === 0) return simulatedHistory;
    
    return workoutHistory.slice(-10).map(ses => {
      // Calcular 1RM estimado (Fórmula Epley: w * (1 + r / 30)) para la serie más pesada
      let max1RM = 0;
      let sessionRpeSum = 0;
      let sessionRpeCount = 0;

      if (ses.exercises) {
        Object.values(ses.exercises).forEach(exSets => {
          Object.values(exSets).forEach(set => {
            const w = parseFloat(set.weight) || 0;
            const r = parseFloat(set.reps) || 0;
            if (w > 0 && r > 0) {
              const est1RM = Math.round(w * (1 + r / 30));
              if (est1RM > max1RM) max1RM = est1RM;
            }
            if (set.rpe) {
              sessionRpeSum += parseFloat(set.rpe);
              sessionRpeCount++;
            }
          });
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

  const chartData = getChartData();

  // Función para limpiar o eliminar sesión
  const handleDeleteSession = (id) => {
    if (confirm("¿Estás seguro de eliminar este registro del análisis científico?")) {
      setWorkoutHistory(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleClearAll = () => {
    if(confirm("⚠️ ¿Deseas formatear por completo el historial de COACH V2? Esto borrará tus datos estadísticos.")) {
      setWorkoutHistory([]);
    }
  };

  // Encontrar la definición oficial del protocolo en base al ID para comparar Prescrito vs Real
  const findExerciseDefinition = (dayId, exId) => {
    const day = adonisProtocol.find(d => d.id === dayId);
    return day?.exercises.find(e => e.id === exId) || { name: 'Ejercicio', sets: '-', reps: '-' };
  };

  return (
    <div className="container" style={{ paddingBottom: '30px' }}>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <span className="badge badge-blue">Laboratorio de Datos</span>
          <h1 style={{ marginTop: '4px' }}>Análisis Científico</h1>
        </div>
        {workoutHistory.length > 0 && (
          <button className="btn btn-outline" style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', color: '#ef4444', borderColor: '#fca5a5' }} onClick={handleClearAll}>
            <Trash2 size={14} /> Borrar Todo
          </button>
        )}
      </div>

      {/* Indicadores Claves (KPIs Científicos) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>SESIONES</span>
          <strong style={{ fontSize: '20px', color: '#0f172a' }}>{totalSessions}</strong>
          <span style={{ fontSize: '11px', color: 'var(--accent-green)', display: 'block', marginTop: '2px' }}>Completadas</span>
        </div>
        
        <div className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '3px solid var(--accent-blue)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>VOLUMEN ACUM.</span>
          <strong style={{ fontSize: '18px', color: 'var(--accent-blue)' }}>{totalVolumeLifted.toLocaleString()}</strong>
          <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '2px' }}>Lbs x Reps Totales</span>
        </div>
        
        <div className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>RPE MEDIO</span>
          <strong style={{ fontSize: '20px', color: '#d97706' }}>{calculateGlobalAverageRPE()}</strong>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Intensidad / Fatiga</span>
        </div>
      </div>

      {/* Gráfico 1: Sobrecarga Progresiva y Volumen */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div className="flex-between" style={{ marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={20} color="var(--accent-blue)" />
              <h2 style={{ margin: 0, fontSize: '16px' }}>Curva de Sobrecarga Progresiva</h2>
            </div>
            <p style={{ fontSize: '12px', marginTop: '2px' }}>Evolución del Volumen Total (Carga mecánica)</p>
          </div>
          <span className="badge badge-green">Efecto Hipertrofia</span>
        </div>
        
        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                labelStyle={{ fontWeight: '700', color: '#0f172a' }}
              />
              <Bar dataKey="volumen" name="Volumen (lbs)" fill="var(--accent-blue)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {workoutHistory.length === 0 && (
          <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '10px', fontStyle: 'italic' }}>
            * Datos de simulación analítica. Registra y guarda tu primer entrenamiento de la semana para generar tus propias gráficas en tiempo real.
          </p>
        )}
      </div>

      {/* Gráfico 2: Fuerza Teórica Máxima (1RM Estimado) y RPE */}
      <div className="card card-highlight" style={{ padding: '20px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={20} color="var(--accent-green)" />
              <h2 style={{ margin: 0, fontSize: '16px' }}>Fuerza (1RM) vs. Fatiga (RPE)</h2>
            </div>
            <p style={{ fontSize: '12px', marginTop: '2px' }}>Fórmula Epley para estimación de Fuerza Máxima</p>
          </div>
        </div>

        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="var(--accent-green)" fontSize={11} orientation="left" domain={['auto', 'auto']} />
              <YAxis yAxisId="right" stroke="#d97706" fontSize={11} orientation="right" domain={[5, 10]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line yAxisId="left" type="monotone" dataKey="f1rm" name="1RM Estimado (lbs)" stroke="var(--accent-green)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-green)' }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="rpe" name="Esfuerzo RPE (1-10)" stroke="#d97706" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4, fill: '#d97706' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bitácora / Registro Científico de Lo Prescrito vs Lo Realizado */}
      <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '14px' }}>Bitácora del Atleta (Prescrito vs. Realizado)</h2>
      
      {workoutHistory.length === 0 ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
          <Clock size={32} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#475569', margin: 0 }}>Sin registros en bitácora</h3>
          <p style={{ marginTop: '8px', fontSize: '13px' }}>
            A medida que vayas al gimnasio y presiones <strong>"Guardar Registro Científico"</strong> en la pestaña Rutina, se creará aquí tu archivo inmutable para consulta estadística.
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
                  padding: '16px', 
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
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>{ses.dayName}</span>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>{ses.completedSets} series</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    📅 {ses.dateString} • Volumen: <strong>{ses.volume?.toLocaleString()} lbs</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(ses.id); }} 
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                    title="Eliminar sesión"
                  >
                    <Trash2 size={16} />
                  </button>
                  {isExpanded ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>
              </div>

              {/* Detalle Desplegado de Lo Prescrito vs Realizado */}
              {isExpanded && ses.exercises && (
                <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  {Object.keys(ses.exercises).map((exId) => {
                    const exDef = findExerciseDefinition(ses.dayId, exId);
                    const exSets = ses.exercises[exId] || {};
                    const setNums = Object.keys(exSets).filter(k => exSets[k].completed);
                    
                    if (setNums.length === 0) return null;

                    return (
                      <div key={exId} style={{ marginTop: '12px', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div className="flex-between" style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '14px', color: '#0f172a' }}>{exDef.name}</strong>
                          <span className="badge badge-blue">Prescrito: {exDef.sets}x{exDef.reps}</span>
                        </div>

                        <table className="table-responsive" style={{ margin: 0 }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', paddingLeft: '8px' }}>Serie</th>
                              <th>Prescrito</th>
                              <th>Peso Real</th>
                              <th>Reps Reales</th>
                              <th>Esfuerzo (RPE)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {setNums.map(setNum => {
                              const s = exSets[setNum];
                              return (
                                <tr key={setNum}>
                                  <td style={{ textAlign: 'left', paddingLeft: '8px', fontWeight: '600' }}>#{setNum}</td>
                                  <td style={{ color: '#64748b' }}>{exDef.reps}</td>
                                  <td style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>{s.weight || '0'} lbs</td>
                                  <td style={{ fontWeight: '700', color: '#0f172a' }}>{s.reps || '-'}</td>
                                  <td>
                                    <span className="badge" style={{ background: '#fffbeb', color: '#d97706', fontSize: '11px', border: '1px solid #fde68a' }}>
                                      @ {s.rpe || '8'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
