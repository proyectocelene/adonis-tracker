import React, { useState, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { scientificProtocol } from '../data/scientificProtocol';
import ConsistencyHeatmap from './ConsistencyHeatmap';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp, Award, Clock, ChevronDown, ChevronUp, Trash2, ShieldCheck, Zap, HeartPulse, Dumbbell, Calendar, Sparkles, Settings2, Download, Upload, AlertOctagon, Settings, X, ShieldAlert, Database } from 'lucide-react';

export default function HistoryView() {
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('coachv2_history', []);
  const [currentSessions, setCurrentSessions] = useLocalStorage('coachv2_active_workouts', {});
  const [customExercisesMap, setCustomExercisesMap] = useLocalStorage('coachv2_custom_day_exercises', {});
  const [nutrition, setNutrition] = useLocalStorage('coachv2_nutrition_data', { protein: 0, water: 0 });
  const [bodyMetrics, setBodyMetrics] = useLocalStorage('coachv2_body_metrics_history', []);

  const [selectedExId, setSelectedExId] = useState('d1_e1');
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const fileInputRef = useRef(null);

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
    return rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : '0.0';
  };

  const getChartData = () => {
    if (workoutHistory.length === 0) return [];
    
    return workoutHistory.slice(-12).map(ses => {
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

  const getExerciseProgressionData = () => {
    const progData = [];
    workoutHistory.forEach(ses => {
      if (ses.exercises && ses.exercises[selectedExId]) {
        const exSets = ses.exercises[selectedExId];
        let maxW = 0;
        let bestReps = 0;
        let unit = 'lbs';

        Object.keys(exSets).forEach(setNum => {
          if (!isNaN(parseInt(setNum))) {
            const s = exSets[setNum];
            if (s && s.completed && s.weight && !isNaN(parseFloat(s.weight))) {
              const w = parseFloat(s.weight);
              if (w >= maxW) {
                maxW = w;
                bestReps = parseFloat(s.reps) || bestReps;
                unit = s.unit || 'lbs';
              }
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

    return progData;
  };

  const chartData = getChartData();
  const exerciseProgData = getExerciseProgressionData();
  const selectedExDef = allAvailableExercises.find(x => x.id === selectedExId) || allAvailableExercises[0] || { name: 'Ejercicio Seleccionado' };

  const handleDeleteSession = (id) => {
    if (confirm("¿Estás seguro de eliminar este registro del historial científico?")) {
      setWorkoutHistory(prev => prev.filter(s => s.id !== id));
    }
  };

  // EXPORTAR BASE DE DATOS
  const handleExportDatabase = () => {
    const fullDatabase = {
      appVersion: "COACH V2 - Protocolo Adonis Científico",
      exportTimestamp: new Date().toISOString(),
      workoutHistory,
      currentActiveSessions: currentSessions,
      customExercises: customExercisesMap,
      nutritionData: nutrition,
      bodyMetrics
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fullDatabase, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `COACH_V2_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // IMPORTAR BASE DE DATOS
  const handleImportDatabase = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (confirm("¿Estás seguro de restaurar el respaldo seleccionado? Esto reemplazará los datos actuales en memoria con el archivo cargado.")) {
          if (data.workoutHistory) setWorkoutHistory(data.workoutHistory);
          if (data.currentActiveSessions) setCurrentSessions(data.currentActiveSessions);
          if (data.customExercises) setCustomExercisesMap(data.customExercises);
          if (data.nutritionData) setNutrition(data.nutritionData);
          if (data.bodyMetrics) setBodyMetrics(data.bodyMetrics);
          alert("✅ ¡Base de datos restaurada con éxito desde el archivo de respaldo!");
          setShowConfigModal(false);
        }
      } catch (err) {
        alert("❌ Error: El archivo seleccionado no es un archivo JSON válido del sistema COACH V2.");
      }
    };
    reader.readAsText(file);
  };

  // BORRAR TODOS LOS DATOS (RESET TOTAL SIN PREDEFINIDOS)
  const handleWipeAllData = () => {
    if (confirm("⚠️ ¿ADVERTENCIA CRÍTICA: Estás seguro de BORRAR TODOS LOS DATOS DE LA APP?\n\nEsto eliminará permanentemente todo tu historial científico, rutinas activas, medidas corporales y contadores de nutrición para dejar la base de datos completamente limpia a cero.")) {
      setWorkoutHistory([]);
      setCurrentSessions({});
      setCustomExercisesMap({});
      setNutrition({ protein: 0, water: 0 });
      setBodyMetrics([]);
      localStorage.removeItem('coachv2_history');
      localStorage.removeItem('coachv2_active_workouts');
      localStorage.removeItem('coachv2_custom_day_exercises');
      localStorage.removeItem('coachv2_nutrition_data');
      localStorage.removeItem('coachv2_body_metrics_history');
      alert("✅ Base de datos restablecida a cero. No existen registros en memoria.");
      setShowConfigModal(false);
    }
  };

  const findExerciseDefinition = (dayId, exId) => {
    const day = scientificProtocol.find(d => d.id === dayId);
    return day?.exercises?.find(e => e.id === exId) || { name: 'Ejercicio Personalizado', sets: '-', reps: '-' };
  };

  return (
    <div className="container" style={{ paddingBottom: '45px' }}>
      
      {/* Cabecera del Laboratorio Científico */}
      <div className="card" style={{ padding: '16px', marginBottom: '18px', borderTop: '4px solid #0066ff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div>
            <span className="badge badge-blue">Analítica & Fisiología</span>
            <h1 style={{ marginTop: '6px', fontSize: '22px', fontWeight: '800', whiteSpace: 'normal', color: '#0f172a' }}>
              Laboratorio de Progreso
            </h1>
          </div>

          <button 
            onClick={() => setShowConfigModal(true)}
            style={{ 
              background: '#0f172a', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 14px', 
              borderRadius: '16px', 
              fontSize: '12px', 
              fontWeight: '800', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 6px 15px rgba(15, 23, 42, 0.25)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title="Abrir menú de configuración y exportación de base de datos"
          >
            <Settings size={16} /> Configuración & Datos
          </button>
        </div>
      </div>

      {/* MODAL / DRAWER DE CONFIGURACION DE LA APP & DATAFORCE */}
      {showConfigModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '440px',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div className="flex-between" style={{ marginBottom: '18px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Database size={22} color="#0066ff" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Gestión de Base de Datos</h3>
              </div>
              <button 
                onClick={() => setShowConfigModal(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={20} color="#475569" />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', lineHeight: '1.5' }}>
              Aquí puedes respaldar tus bitácoras de entrenamiento, importar archivos antiguos o limpiar tu memoria de laboratorio.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Opción Exportar */}
              <button 
                onClick={handleExportDatabase} 
                className="btn btn-primary" 
                style={{ padding: '15px', fontSize: '14px', borderRadius: '16px', background: '#0e7490', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px rgba(14, 116, 144, 0.25)' }}
              >
                <Download size={18} /> 1. Exportar Respaldo (Descargar JSON)
              </button>

              {/* Opción Importar */}
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImportDatabase} 
                  style={{ display: 'none' }} 
                  accept=".json" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '14px', fontSize: '14px', borderRadius: '16px', fontWeight: '800', background: '#f8fafc', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Upload size={18} color="#0066ff" /> 2. Importar Respaldo Existente
                </button>
              </div>

              <div style={{ margin: '10px 0', borderBottom: '1px dashed #cbd5e1' }} />

              {/* Opción Borrar Datos */}
              <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                  <ShieldAlert size={18} color="#dc2626" />
                  <strong style={{ fontSize: '14px', color: '#991b1b', fontWeight: '800' }}>Zona de Peligro</strong>
                </div>
                <p style={{ fontSize: '12px', color: '#7f1d1d', margin: '0 0 12px 0' }}>
                  Elimina todos tus entrenamientos, nutrición y récords para comenzar desde cero:
                </p>
                <button 
                  onClick={handleWipeAllData} 
                  style={{ 
                    background: '#dc2626', 
                    color: '#ffffff', 
                    border: 'none', 
                    padding: '12px 16px', 
                    borderRadius: '14px', 
                    fontSize: '13px', 
                    fontWeight: '800', 
                    width: '100%',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  <AlertOctagon size={16} style={{ display: 'inline', marginRight: '6px' }} /> Borrar Todos los Datos de la App
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowConfigModal(false)}
              style={{ width: '100%', padding: '14px', marginTop: '20px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '16px', fontWeight: '800', color: '#64748b', cursor: 'pointer' }}
            >
              Volver al Laboratorio
            </button>
          </div>
        </div>
      )}

      {/* KPIs Clínicos Apple Liquid Glass */}
      <div className="grid-3" style={{ marginBottom: '18px' }}>
        <div className="card" style={{ padding: '14px 6px', textAlign: 'center', margin: 0 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Sesiones</span>
          <strong style={{ fontSize: '22px', color: '#0f172a', display: 'block', margin: '3px 0', fontWeight: '800' }}>{totalSessions}</strong>
          <span style={{ fontSize: '11px', color: '#00b464', fontWeight: '800' }}>Archivadas</span>
        </div>
        
        <div className="card" style={{ padding: '14px 6px', textAlign: 'center', margin: 0, borderTop: '4px solid #0066ff' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Volumen Global</span>
          <strong style={{ fontSize: '18px', color: '#0066ff', display: 'block', margin: '3px 0', fontWeight: '800' }}>{totalVolumeLifted.toLocaleString()}</strong>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>Lbs-Reps</span>
        </div>
        
        <div className="card" style={{ padding: '14px 6px', textAlign: 'center', margin: 0 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Intensidad</span>
          <strong style={{ fontSize: '20px', color: '#f59e0b', display: 'block', margin: '3px 0', fontWeight: '800' }}>RPE {calculateGlobalAverageRPE()}</strong>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>Esfuerzo Medio</span>
        </div>
      </div>

      {/* Heatmap de Consistencia Sin Datos Ficticios */}
      <ConsistencyHeatmap workoutHistory={workoutHistory} />

      {/* Sección de Análisis por Ejercicio Individual */}
      <div className="card card-highlight" style={{ padding: '18px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <Dumbbell size={20} color="#0066ff" />
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', whiteSpace: 'normal' }}>Curva Evolutiva por Ejercicio</h2>
          </div>
          <p style={{ fontSize: '13px', margin: '0', color: '#334155' }}>Selecciona cualquier ejercicio del Protocolo Adonis para auditar tu ganancia real 1RM:</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <select 
            value={selectedExId}
            onChange={(e) => setSelectedExId(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', fontWeight: '800', fontSize: '15px', borderRadius: '14px' }}
          >
            {allAvailableExercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.day} - {ex.name}</option>
            ))}
          </select>
        </div>

        {exerciseProgData.length === 0 ? (
          <div style={{
            background: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            padding: '26px 18px',
            textAlign: 'center',
            color: '#475569'
          }}>
            <Sparkles size={32} color="#0066ff" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '16px', color: '#0f172a', margin: '0 0 8px 0', fontWeight: '800', whiteSpace: 'normal' }}>📈 Estado: Pendiente de Línea Base</h3>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
              Sin datos predeterminados ni ficticios. Aún no has archivado un entrenamiento que contenga <strong>{selectedExDef.name}</strong>.  
              Al guardar tu primera sesión en la pestaña Rutina, tus series trazarán aquí tu curva real Epley 1RM.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseProgData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#0066ff" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', fontFamily: 'Plus Jakarta Sans' }}
                  formatter={(val, name) => [val + ' lbs/kg', name === 'maxWeight' ? 'Carga Máxima' : '1RM Est. Epley']}
                />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="maxWeight" name="Carga Máxima" stroke="#0066ff" strokeWidth={3} dot={{ r: 5, fill: '#0066ff' }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="est1RM" name="1RM Teórico (Epley)" stroke="#00b464" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4, fill: '#00b464' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Gráfico de Sobrecarga Progresiva Global SIN DATOS PREDETERMINados */}
      <div className="card" style={{ padding: '18px', marginBottom: '22px' }}>
        <div className="flex-between" style={{ marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#0e7490" />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', whiteSpace: 'normal' }}>Sobrecarga Progresiva Global</h2>
            </div>
            <p style={{ fontSize: '12px', margin: '2px 0 0 0', color: '#64748b' }}>Carga mecánica total (Lbs-Reps) por sesión archivada</p>
          </div>
          <span className="badge badge-green">Hipertrofia</span>
        </div>
        
        {chartData.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
            <Activity size={28} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#334155', fontWeight: '800', whiteSpace: 'normal' }}>Sin Sesiones Registradas Aún</h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Aquí verás tus barras en azul real subiendo semana tras semana cada vez que pulses "Guardar Sesión".
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '14px' }} />
                <Bar dataKey="volumen" name="Volumen (lbs-reps)" fill="#0066ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bitácora del Atleta */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
        <Clock size={18} color="#475569" />
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a', whiteSpace: 'normal' }}>Bitácora de Sesiones Pasadas</h2>
      </div>
      
      {workoutHistory.length === 0 ? (
        <div className="card" style={{ padding: '28px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1.5px dashed #cbd5e1' }}>
          <Calendar size={34} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#334155', margin: 0, fontSize: '16px', fontWeight: '800', whiteSpace: 'normal' }}>Bitácora limpia sin registros predeterminados</h3>
          <p style={{ marginTop: '8px', fontSize: '13px', lineHeight: '1.5' }}>
            Al pulsar el botón de Guardar Sesión al final de tus entrenamientos en la pestaña Rutina, tu análisis, cargas y calibración de máquinas quedarán inmortalizados en este laboratorio.
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
                  background: isExpanded ? 'rgba(241, 245, 249, 0.8)' : 'transparent',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', whiteSpace: 'normal', lineBreak: 'strict' }}>{ses.dayName}</strong>
                    {ses.completedSets > 0 && <span className="badge badge-green" style={{ fontSize: '10px' }}>{ses.completedSets} series</span>}
                    {ses.cardioCompleted > 0 && <span className="badge" style={{ background: '#ecfeff', color: '#0e7490', fontSize: '10px' }}>Cardio</span>}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>
                    📅 {ses.dateString} • Carga Total: <strong style={{ color: '#0066ff' }}>{ses.volume?.toLocaleString()} lbs</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(ses.id); }} 
                    style={{ background: 'transparent', border: 'none', color: '#ff3b30', padding: '6px', cursor: 'pointer' }}
                    title="Borrar registro"
                  >
                    <Trash2 size={18} />
                  </button>
                  {isExpanded ? <ChevronUp size={22} color="#64748b" /> : <ChevronDown size={22} color="#64748b" />}
                </div>
              </div>

              {isExpanded && ses.exercises && (
                <div className="animate-fade" style={{ padding: '10px 16px 18px 16px', borderTop: '1px solid #cbd5e1', background: '#f8fafc' }}>
                  {Object.keys(ses.exercises).map((exId) => {
                    const exData = ses.exercises[exId];
                    if (!exData) return null;

                    if (exData.machine) {
                      return (
                        <div key={exId} style={{ marginTop: '12px', background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #cbd5e1', borderLeft: '4px solid #06b6d4' }}>
                          <div className="flex-between" style={{ marginBottom: '6px' }}>
                            <strong style={{ fontSize: '14px', fontWeight: '800', color: '#0e7490', whiteSpace: 'normal' }}><HeartPulse size={14} style={{ display: 'inline', marginRight: '4px' }} /> {exData.machine}</strong>
                            <span className="badge" style={{ background: '#ecfeff', color: '#0e7490' }}>{exData.duration} min</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#475569', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px', fontWeight: '600' }}>
                            {exData.speed && <span>Velocidad: <strong style={{ color: '#0f172a' }}>{exData.speed}</strong></span>}
                            {exData.incline && <span>Inclinación: <strong style={{ color: '#0f172a' }}>{exData.incline}</strong></span>}
                            {exData.heartRate && <span>Pulsaciones: <strong style={{ color: '#ff3b30' }}>{exData.heartRate} BPM</strong></span>}
                          </div>
                          {exData.machineSetup && (
                            <div style={{ marginTop: '6px', fontSize: '11px', color: '#6d28d9', background: '#f5f3ff', padding: '6px 10px', borderRadius: '8px', fontWeight: '700', display: 'inline-block' }}>
                              ⚙️ Ajuste de Máquina: "{exData.machineSetup}"
                            </div>
                          )}
                        </div>
                      );
                    }

                    const exDef = findExerciseDefinition(ses.dayId, exId);
                    const setNums = Object.keys(exData).filter(k => !isNaN(parseInt(k)) && exData[k] && exData[k].completed);
                    if (setNums.length === 0 && !exData.machineSetup) return null;

                    return (
                      <div key={exId} style={{ marginTop: '12px', background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
                        <div className="flex-between" style={{ marginBottom: '10px' }}>
                          <strong style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', whiteSpace: 'normal', lineBreak: 'strict' }}>{exDef.name || 'Ejercicio Personalizado'}</strong>
                          <span className="badge badge-blue">Meta: {exDef.reps || '-'}</span>
                        </div>

                        {exData.machineSetup && (
                          <div style={{ marginBottom: '10px', fontSize: '12px', color: '#5b21b6', background: '#f5f3ff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #ddd6fe', fontWeight: '700' }}>
                            <Settings2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                            Ajuste de Máquina/Equipo: "{exData.machineSetup}"
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {setNums.map(setNum => {
                            const s = exData[setNum];
                            return (
                              <div key={setNum} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '800', color: '#334155' }}>Serie #{setNum}</span>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>Carga: <strong style={{ color: '#0066ff', fontSize: '13px' }}>{s.weight || '0'} {s.unit || 'lbs'}</strong></span>
                                <span style={{ fontWeight: '600' }}>Logrado: <strong style={{ color: '#0f172a', fontSize: '13px' }}>{s.reps || '-'} reps</strong></span>
                                <span className="badge badge-warning" style={{ margin: 0, fontSize: '11px' }}>RPE {s.rpe || '8'}</span>
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
