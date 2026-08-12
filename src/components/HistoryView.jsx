import React, { useState, useRef } from 'react';
import { useIndexedDB as useLocalStorage } from '../hooks/useIndexedDB';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { entries, setMany, clear } from 'idb-keyval';
import { scientificProtocol } from '../data/scientificProtocol';
import ConsistencyHeatmap from './ConsistencyHeatmap';
import { useAuth } from '../contexts/AuthContext';
import { UNIFIED_EXERCISE_LIBRARY, MUSCLE_GROUPS_LIST } from '../data/unifiedExerciseLibrary';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp, Award, Clock, ChevronDown, ChevronUp, Trash2, ShieldCheck, Zap, HeartPulse, Dumbbell, Calendar, Sparkles, Settings2, Download, Upload, AlertOctagon, Settings, X, ShieldAlert, Database, Cloud, Copy, Check, Cpu, Loader2, Sparkles as SparklesIcon, Layers, RefreshCw } from 'lucide-react';
import { useModal, LiquidDropdown } from './common/UIComponents';

export default function HistoryView() {
  const modal = useModal();
  const { logout, currentUser } = useAuth();
  const [workoutHistory, setWorkoutHistory, isHistoryLoading, saveSession, deleteSession] = useWorkoutHistory();
  const [currentSessions, setCurrentSessions, isSessionsLoading] = useLocalStorage('coachv2_active_workouts', {});
  const [customExercisesMap, setCustomExercisesMap, isCustomLoading] = useLocalStorage('coachv2_custom_day_exercises', {});

  const isLoadingDb = isHistoryLoading || isSessionsLoading || isCustomLoading;

  // Explorador de Base de Datos y Unificación AI
  const [selectedDbFilter, setSelectedDbFilter] = useState('Todos');
  const [dbSearchTerm, setDbSearchTerm] = useState('');

  const [analysisMode, setAnalysisMode] = useState('exercise'); // 'exercise' or 'muscleGroup'
  const [selectedExId, setSelectedExId] = useState('d1_e1');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Pecho');
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState('ALL');
  const [showConfigModal, setShowConfigModal] = useState(false);

  const fileInputRef = useRef(null);

  const allAvailableExercises = [];
  const exerciseOptions = [];
  const muscleGroupOptions = [
    { value: 'Pecho', label: '💪 Pecho (Pectoral Superior, Medio & Aislamiento)' },
    { value: 'Hombro', label: '🚀 Hombro (Deltoides Lateral, Medio & Anterior)' },
    { value: 'Espalda', label: '🦅 Espalda (Amplitud V-Taper, Dorsales & Remos)' },
    { value: 'Cuádriceps', label: '🦵 Cuádriceps (Prensa, Hack & Extensión)' },
    { value: 'Glúteos', label: '🍑 Glúteo Mayor & Cadena Posterior' },
    { value: 'Isquios', label: '🦵 Isquiotibiales (Femorales)' },
    { value: 'Bíceps', label: '💪 Bíceps & Braquial (Flexores)' },
    { value: 'Tríceps', label: '💥 Tríceps (Poleas & Extensiones de Copa)' },
    { value: 'Pantorrillas', label: '🔥 Pantorrillas (Tríceps Sural & Sóleo)' },
    { value: 'Core', label: '🛡️ Core, Vacuum & Prevención de Hernias (IAP)' }
  ];

  scientificProtocol.forEach(day => {
    const dayPrefix = day.name.split(':')[0];
    const baseEx = day.exercises || [];
    const customEx = customExercisesMap[day.id] || [];
    [...baseEx, ...customEx].forEach(ex => {
      if (!ex.isCardio && !ex.isTime && !allAvailableExercises.some(a => a.id === ex.id)) {
        allAvailableExercises.push({ id: ex.id, name: ex.name, day: dayPrefix, muscleGroup: ex.muscleGroup, biomechanics: ex.biomechanics });
        exerciseOptions.push({ value: ex.id, label: `${dayPrefix} • ${ex.name}` });
      }
    });
  });

  // Asegurar que cualquier ejercicio personalizado adicional creado en la app aparezca en la lista de análisis
  Object.values(customExercisesMap).flat().forEach(ex => {
    if (ex && ex.id && !ex.isCardio && !allAvailableExercises.some(a => a.id === ex.id)) {
      allAvailableExercises.push({ id: ex.id, name: ex.name, day: '⚡️ Creado', muscleGroup: ex.muscleGroup, biomechanics: ex.biomechanics });
      exerciseOptions.push({ value: ex.id, label: `⚡️ Creado • ${ex.name}` });
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
        name: ses.weekNumber ? `S${ses.weekNumber}: ${ses.dayName ? ses.dayName.split(':')[0] : 'Sesión'}` : (ses.dateString ? ses.dateString.split(',')[0] : 'Sesión'),
        volumen: ses.volume || 0,
        rpe: sessionRpeCount > 0 ? parseFloat((sessionRpeSum / sessionRpeCount).toFixed(1)) : 8,
        f1rm: max1RM
      };
    });
  };

  // DATOS DE PROGRESIÓN POR EJERCICIO O POR GRUPO MUSCULAR
  const getProgressionData = () => {
    const progData = [];

    if (analysisMode === 'exercise') {
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
    } else {
      // ANÁLISIS POR GRUPO MUSCULAR COMPLETO
      workoutHistory.forEach(ses => {
        if (ses.exercises) {
          let totalGroupVolume = 0;
          let maxGroupWeight = 0;
          let matches = false;

          Object.keys(ses.exercises).forEach(exId => {
            const exData = ses.exercises[exId];
            const muscleTag = exData.muscleGroup || findExerciseDefinition(ses.dayId, exId).muscleGroup || 'General';
            
            if (muscleTag.toLowerCase().includes(selectedMuscleGroup.toLowerCase()) || (selectedMuscleGroup === 'Isquios' && muscleTag.toLowerCase().includes('femora'))) {
              if (!exData.machine) {
                Object.keys(exData).forEach(setNum => {
                  if (!isNaN(parseInt(setNum))) {
                    const s = exData[setNum];
                    if (s && s.completed && s.weight && s.reps) {
                      matches = true;
                      let w = parseFloat(s.weight) || 0;
                      if (s.unit === 'kg') w *= 2.20462;
                      const r = parseFloat(s.reps) || 0;
                      totalGroupVolume += (w * r);
                      if (w > maxGroupWeight) maxGroupWeight = w;
                    }
                  }
                });
              }
            }
          });

          if (matches) {
            progData.push({
              date: ses.dateString ? ses.dateString.split(',')[0] : 'Fecha',
              maxWeight: Math.round(maxGroupWeight),
              est1RM: Math.round(totalGroupVolume), // en grupo muscular, usamos volumen total como indicador de sobrecarga
              reps: '-',
              unit: 'lbs-reps'
            });
          }
        }
      });
    }

    return progData;
  };

  const chartData = getChartData();
  const progData = getProgressionData();
  const selectedExDef = allAvailableExercises.find(x => x.id === selectedExId) || allAvailableExercises[0] || { name: 'Ejercicio Seleccionado' };

  // Métrica y Diagnóstico Inteligente para el Ejercicio Seleccionado
  const latestLog = progData.length > 0 ? progData[progData.length - 1] : null;
  const previousLog = progData.length > 1 ? progData[progData.length - 2] : null;
  const personalRecord = progData.length > 0 ? Math.max(...progData.map(p => p.maxWeight || 0)) : 0;
  
  let deltaWeight = 0;
  let deltaReps = 0;
  let smartDiagnosis = "Sin datos suficientes para evaluar tendencia de sobrecarga.";
  let smartSuggestion = "Inicia con una carga controlada que te permita completar el rango prescrito con RPE 8.";

  if (latestLog) {
    if (previousLog) {
      deltaWeight = latestLog.maxWeight - previousLog.maxWeight;
      deltaReps = (parseInt(latestLog.reps) || 0) - (parseInt(previousLog.reps) || 0);
      if (deltaWeight > 0) {
        smartDiagnosis = `🚀 ¡Sobrecarga mecánica lograda! Aumentaste +${deltaWeight} ${latestLog.unit} vs tu sesión anterior.`;
        smartSuggestion = `Mantén este peso (${latestLog.maxWeight} ${latestLog.unit}) hasta lograr el tope superior del rango de repeticiones antes de volver a incrementar.`;
      } else if (deltaWeight === 0 && deltaReps > 0) {
        smartDiagnosis = `🔥 ¡Progresión en volumen muscular! Mantuviste la carga y lograste +${deltaReps} repeticiones adicionales.`;
        smartSuggestion = `Estás consolidando fuerza. Si ya alcanzaste el tope de reps prescritas (ej. 12-15), sube +5 lbs/kg en tu próxima sesión.`;
      } else if (deltaWeight < 0 || deltaReps < 0) {
        smartDiagnosis = `⚠️ Ligero descenso temporal en carga o reps vs sesión anterior.`;
        smartSuggestion = `Fisiológicamente normal en semanas de fatiga del SNC. Prioriza calidad técnica, exhalación IAP y descanso completo entre series.`;
      } else {
        smartDiagnosis = `⚖️ Estabilidad mecánica: Mantienes exactamente la misma carga y repeticiones.`;
        smartSuggestion = `Hoy intenta sacar al menos +1 repetición extra en tu última serie para reactivar la señal de hipertrofia.`;
      }
    } else {
      smartDiagnosis = `📌 Línea base oficial establecida con ${latestLog.maxWeight} ${latestLog.unit} x ${latestLog.reps} reps.`;
      smartSuggestion = `Tu siguiente entrenamiento comparará automáticamente tu rendimiento contra este pico para trazar tu curva de progresión.`;
    }
  }

  const handleDeleteSession = (id) => {
    modal.showConfirm({
      title: "🗑️ ¿Eliminar Bitácora de Sesión?",
      message: "Este registro se borrará permanentemente de tu gráfico de sobrecarga progresiva y de tu historial científico.",
      confirmText: "Eliminar Registro",
      cancelText: "Mantener",
      variant: "danger",
      onConfirm: async () => {
        await deleteSession(id);
        modal.showAlert({ title: "🗑️ Registro Eliminado", message: "La sesión fue removida de tu bitácora satisfactoriamente.", variant: "info" });
      }
    });
  };

  // LIMPIEZA Y MANTENIMIENTO AUTOMÁTICO DE LA BASE DE DATOS
  const handleSmartCleanup = () => {
    modal.showConfirm({
      title: "🧹 ¿Ejecutar Limpieza Inteligente de Base de Datos?",
      message: "Esta rutina automatizada del sistema realizará:\n\n1. Eliminación de sesiones borrador abandonadas o sin completar.\n2. Depuración de entradas vacías sin peso logradas.\n3. Compactación y desfragmentación del almacenamiento local para máxima velocidad PWA.\n\nTus sesiones archivadas y récords reales se preservarán intactos al 100%.",
      confirmText: "✨ Sí, Limpiar y Optimizar",
      cancelText: "Cancelar",
      variant: "info",
      onConfirm: () => {
        let cleanSessions = { ...currentSessions };
        let removedDrafts = 0;
        Object.keys(cleanSessions).forEach(key => {
          if (!cleanSessions[key] || Object.keys(cleanSessions[key]).length === 0) {
            delete cleanSessions[key];
            removedDrafts++;
          }
        });

        setCurrentSessions(cleanSessions);
        modal.showAlert({
          title: "🚀 Base de Datos Optimizada al 100%",
          message: `Mantenimiento clínico concluido con éxito. Se depuraron ${removedDrafts} borradores vacíos y se liberó memoria para un rendimiento fluido.`,
          variant: "success"
        });
      }
    });
  };

  // AUDITORÍA AI INTEGRAL SOBRE TODA LA BASE DE DATOS (ELIMINADO)

  // UNIFICACIÓN INTELIGENTE AI DE LA BASE DE DATOS Y MÁQUINAS (ELIMINADO)

  // EXPORTAR BASE DE DATOS TOTAL (RUTINAS, HISTORIAL, ALACENA, MEDIDAS Y CONFIGURACIONES)
  const handleExportDatabase = async () => {
    try {
      const allEntries = await entries();
      const dbDump = {};
      allEntries.forEach(([key, val]) => {
        dbDump[key] = val;
      });

      const fullDatabase = {
        appVersion: "COACH V2 - Protocolo Adonis Científico (Backup Maestro 100%)",
        exportTimestamp: new Date().toISOString(),
        atleta: "Carlos Donato",
        workoutHistory,
        currentActiveSessions: currentSessions,
        customExercises: customExercisesMap,
        rawIndexedDBDump: dbDump,
      };

      const blob = new Blob([JSON.stringify(fullDatabase, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", `COACH_V2_Backup_Total_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      modal.showAlert({
        title: "💾 Respaldo Maestro Exportado con Éxito",
        message: "Se descargó el archivo JSON con el 100% de tu Rutina Maestra Adonis estructurada por días, tus ejercicios creados, historial completo de cargas, alacena y registros.",
        variant: "success"
      });
    } catch (err) {
      modal.showAlert({ title: "Error de Exportación", message: err.message, variant: "danger" });
    }
  };

  // IMPORTAR BASE DE DATOS
  const handleImportDatabase = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        modal.showConfirm({
          title: "📥 ¿Restaurar Base de Datos?",
          message: `El archivo seleccionado fue verificado con éxito. ¿Estás seguro de sobrescribir tu memoria actual y cargar este respaldo completo?`,
          confirmText: "Restaurar Ahora",
          cancelText: "Cancelar",
          variant: "warning",
          onConfirm: async () => {
            if (data.rawIndexedDBDump && typeof data.rawIndexedDBDump === 'object') {
              const entriesToSet = Object.entries(data.rawIndexedDBDump);
              await setMany(entriesToSet);
            } else if (data.rawLocalStorageDump && typeof data.rawLocalStorageDump === 'object') {
              // Legacy localStorage format
              const entriesToSet = Object.entries(data.rawLocalStorageDump);
              await setMany(entriesToSet);
            }
            
            setShowConfigModal(false);
            modal.showAlert({
              title: "🎉 Base de Datos Restaurada",
              message: "Tus datos históricos, rutinas y alacena se han cargado con éxito. La aplicación se recargará para aplicar los cambios.",
              variant: "success",
              onConfirm: () => {
                window.location.reload();
              }
            });
          }
        });
      } catch (err) {
        modal.showAlert({
          title: "❌ Archivo Inválido",
          message: "El documento seleccionado no cumple con la estructura JSON de COACH V2.",
          variant: "danger"
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };


  const handleWipeAllData = () => {
    modal.showConfirm({
      title: "🚨 ZONA ROJA: Reset Total",
      message: "¿ADVERTENCIA CRÍTICA: Estás verdaderamente seguro de BORRAR TODOS LOS DATOS de tu aplicación COACH V2?\n\nEsta acción eliminará por completo tus marcas, bitácoras y calibraciones para empezar desde cero.",
      confirmText: "⚠️ SÍ, BORRAR TODO A CERO",
      cancelText: "Mantener mis datos",
      variant: "danger",
      onConfirm: async () => {
        await clear();
        localStorage.clear();
        setShowConfigModal(false);
        modal.showAlert({ 
          title: "✅ Reset Total Terminado", 
          message: "La memoria del laboratorio ha quedado impecable a cero.", 
          variant: "info",
          onConfirm: () => {
            window.location.reload();
          }
        });
      }
    });
  };



  const findExerciseDefinition = (dayId, exId) => {
    const day = scientificProtocol.find(d => d.id === dayId);
    return day?.exercises?.find(e => e.id === exId) || { name: 'Ejercicio Personalizado', sets: '-', reps: '-', muscleGroup: 'General' };
  };

  if (isLoadingDb) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#0066ff' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Leyendo Base de Datos...</span>
      </div>
    );
  }

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
            type="button"
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
          >
            <Settings size={16} /> Configuración & Cloud
          </button>
        </div>
      </div>

      {/* MODAL CONFIGURACION & GOOGLE SHEETS CLOUD CENTER */}
      {showConfigModal && (
        <div 
          onClick={() => setShowConfigModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              width: '100%',
              maxWidth: '520px',
              borderRadius: '26px',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '18px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Database size={24} color="#0066ff" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>Centro de Datos & Nube</h3>
              </div>
              <button type="button" onClick={() => setShowConfigModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={20} color="#475569" />
              </button>
            </div>

            {/* SECCIÓN FIREBASE Y CUENTA */}
            <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderRadius: '20px', padding: '16px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Cloud size={22} color="#059669" />
                <strong style={{ fontSize: '15px', color: '#065f46', fontWeight: '900' }}>Sincronización en la Nube</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#047857', margin: '0 0 12px 0', lineHeight: '1.5', fontWeight: '600' }}>
                Tus rutinas, historial y fotos están respaldadas en tiempo real en los servidores seguros de Google (Firebase).
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '10px 14px', borderRadius: '14px', border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: '12px', color: '#065f46', fontWeight: '800' }}>{currentUser?.email || 'Conectado'}</span>
                <button
                  type="button"
                  onClick={logout}
                  style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', lineHeight: '1.5', fontWeight: '600' }}>
              Operaciones de mantenimiento local, limpieza de memoria y respaldo en archivo JSON:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Opción Limpieza Inteligente */}
              <button
                type="button"
                onClick={handleSmartCleanup}
                className="btn btn-outline"
                style={{ padding: '14px', fontSize: '13px', borderRadius: '16px', background: '#eff6ff', color: '#0066ff', border: '1.5px solid #bfdbfe', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <SparklesIcon size={18} /> 🧹 Limpieza & Depuración Inteligente del Sistema
              </button>

              {/* Opción Exportar JSON */}
              <button 
                type="button"
                onClick={handleExportDatabase} 
                className="btn btn-primary" 
                style={{ padding: '14px', fontSize: '13px', borderRadius: '16px', background: '#0e7490', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={18} /> Descargar Respaldo JSON Completo
              </button>

              {/* Opción Importar */}
              <div>
                <input type="file" ref={fileInputRef} onChange={handleImportDatabase} style={{ display: 'none' }} accept=".json" />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '14px', fontSize: '13px', borderRadius: '16px', fontWeight: '800', background: '#f8fafc', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Upload size={18} color="#0066ff" /> Restaurar Respaldo Antiguo
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
                  Elimina todos tus entrenamientos y nutrición para comenzar desde cero:
                </p>
                <button 
                  type="button"
                  onClick={handleWipeAllData} 
                  style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '12px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', width: '100%', cursor: 'pointer', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}
                >
                  <AlertOctagon size={16} style={{ display: 'inline', marginRight: '6px' }} /> Borrar Todos los Datos a Cero
                </button>
              </div>
            </div>

            <button type="button" onClick={() => setShowConfigModal(false)} style={{ width: '100%', padding: '14px', marginTop: '18px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '16px', fontWeight: '800', color: '#64748b', cursor: 'pointer' }}>
              Volver al Laboratorio
            </button>
          </div>
        </div>
      )}

      {/* MÓDULO DE BASE DE DATOS UNIFICADA & MÁQUINAS */}
      <div className="card" style={{ padding: '22px', marginBottom: '22px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={22} color="#0066ff" />
            <strong style={{ fontSize: '16px', color: '#0f172a', fontWeight: '900' }}>
              Base de Datos Unificada de Ejercicios & Máquinas
            </strong>
          </div>
          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
            {UNIFIED_EXERCISE_LIBRARY.length} Registros Oficiales
          </span>
        </div>

        <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0', lineHeight: '1.5', fontWeight: '600', textAlign: 'left' }}>
          Catálogo maestro para estandarización y sincronización en Google Sheets. Utiliza el botón de abajo para que la Inteligencia Artificial analice tus ejercicios creados e historial y los unifique automáticamente:
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar máquina o ejercicio (ej: Prensa, Polea, Hack...)"
            value={dbSearchTerm}
            onChange={e => setDbSearchTerm(e.target.value)}
            style={{ flex: '1 1 220px', padding: '10px 14px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '700', background: '#fff' }}
          />
          <select
            value={selectedDbFilter}
            onChange={e => setSelectedDbFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '800', background: '#fff', color: '#0f172a' }}
          >
            <option value="Todos">All Grupos Musculares</option>
            {MUSCLE_GROUPS_LIST.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Lista Scroll de Máquinas */}
        <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#ffffff', marginBottom: '18px', padding: '8px' }}>
          {UNIFIED_EXERCISE_LIBRARY
            .filter(ex => selectedDbFilter === 'Todos' || ex.muscleGroup === selectedDbFilter)
            .filter(ex => !dbSearchTerm || ex.name.toLowerCase().includes(dbSearchTerm.toLowerCase()) || ex.equipment.toLowerCase().includes(dbSearchTerm.toLowerCase()))
            .map(ex => (
              <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #f1f5f9', gap: '10px', textAlign: 'left' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: '800' }}>
                    {ex.name} <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700' }}>({ex.equipment})</span>
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{ex.biomechanics}</span>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <code style={{ background: '#eff6ff', color: '#1e40af', padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', border: '1px solid #bfdbfe' }}>
                    {ex.unifiedCode}
                  </code>
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginTop: '2px', fontWeight: '700' }}>
                    {ex.defaultSets} series × {ex.defaultReps}
                  </span>
                </div>
              </div>
            ))}
        </div>

      </div>

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

      {/* Heatmap de Consistencia */}
      <ConsistencyHeatmap workoutHistory={workoutHistory} />

      {/* ================= CURVA EVOLUTIVA POR EJERCICIO O POR GRUPO MUSCULAR ================= */}
      <div className="card card-highlight" style={{ padding: '18px', marginBottom: '22px', borderRadius: '26px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Dumbbell size={20} color="#0066ff" />
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '900', whiteSpace: 'normal' }}>Analítica de Sobrecarga Progresiva</h2>
            </div>
            <span className="badge badge-blue">1RM & Volumen</span>
          </div>
          <p style={{ fontSize: '13px', margin: '0 0 14px 0', color: '#334155', fontWeight: '600' }}>Audita tu progreso muscular eligiendo entre vista por ejercicio individual o por grupo muscular completo:</p>

          {/* Selector de Modo de Análisis (Ejercicio vs Grupo Muscular) */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '16px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setAnalysisMode('exercise')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px', background: analysisMode === 'exercise' ? '#ffffff' : 'transparent', color: analysisMode === 'exercise' ? '#0066ff' : '#64748b', fontWeight: '900', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: analysisMode === 'exercise' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}
            >
              🎯 Por Ejercicio Individual
            </button>
            <button
              type="button"
              onClick={() => setAnalysisMode('muscleGroup')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px', background: analysisMode === 'muscleGroup' ? '#0066ff' : 'transparent', color: analysisMode === 'muscleGroup' ? '#ffffff' : '#64748b', fontWeight: '900', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: analysisMode === 'muscleGroup' ? '0 4px 12px rgba(0, 102, 255, 0.3)' : 'none' }}
            >
              💪 Por Grupo Muscular
            </button>
          </div>
        </div>

        {analysisMode === 'exercise' ? (
          <div style={{ marginBottom: '16px' }}>
            <LiquidDropdown
              label="SELECCIONA EJERCICIO INDIVIDUAL:"
              icon={Dumbbell}
              options={exerciseOptions}
              value={selectedExId}
              onChange={(newVal) => setSelectedExId(newVal)}
            />
          </div>
        ) : (
          <div style={{ marginBottom: '16px' }}>
            <LiquidDropdown
              label="SELECCIONA GRUPO MUSCULAR A AUDITAR:"
              icon={Layers}
              options={muscleGroupOptions}
              value={selectedMuscleGroup}
              onChange={(newVal) => setSelectedMuscleGroup(newVal)}
            />
          </div>
        )}

        {progData.length === 0 ? (
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
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5', fontWeight: '600' }}>
              Sin datos ficticios. Aún no has archivado una sesión oficial que trabaje <strong>{analysisMode === 'exercise' ? selectedExDef.name : selectedMuscleGroup}</strong>.  
              Al guardar tu primer entrenamiento, tus series trazarán aquí la curva real de fuerza y sobrecarga progresiva.
            </p>
          </div>
        ) : (
          <div>
            {analysisMode === 'exercise' && (
              <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', border: '1.5px solid #bfdbfe', borderRadius: '22px', padding: '16px', marginBottom: '18px', boxShadow: '0 8px 25px rgba(0, 102, 255, 0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#0066ff" />
                    <strong style={{ fontSize: '15px', color: '#1e3a8a', fontWeight: '900' }}>Análisis Biomecánico y Avance: {selectedExDef.name}</strong>
                  </div>
                  <span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8', fontWeight: '800', fontSize: '11px' }}>
                    🏆 Récord Personal (PR): {personalRecord} {latestLog?.unit || 'lbs'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', display: 'block', marginBottom: '4px' }}>🏋️ Último Peso Utilizado</span>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
                      {latestLog ? `${latestLog.maxWeight} ${latestLog.unit}` : '-'} <span style={{ fontSize: '13px', color: '#475569', fontWeight: '700' }}>({latestLog?.reps || 0} reps)</span>
                    </div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', display: 'block', marginBottom: '4px' }}>📈 Tendencia vs Anterior</span>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: deltaWeight >= 0 ? '#059669' : '#dc2626', lineBreak: 'strict' }}>
                      {deltaWeight > 0 ? `▲ +${deltaWeight} ${latestLog?.unit}` : (deltaWeight === 0 ? (deltaReps > 0 ? `▲ +${deltaReps} reps` : '• Carga Constante') : `▼ ${deltaWeight} ${latestLog?.unit}`)}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: '800', marginBottom: '4px' }}>
                    {smartDiagnosis}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600', lineHeight: '1.4' }}>
                    💡 <strong>Recomendación Inteligente:</strong> {smartSuggestion}
                  </div>
                </div>
              </div>
            )}

            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#0066ff" fontSize={11} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '14px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', fontFamily: 'Plus Jakarta Sans', fontWeight: '800' }}
                    formatter={(val, name, props) => {
                      if (name === 'Pico de Carga') return [val + ' ' + (props.payload.unit || 'lbs') + ` (${props.payload.reps} reps)`, '🏋️ Peso Máximo Utilizado'];
                      if (name === '1RM Teórico (Epley)') return [val + ' ' + (props.payload.unit || 'lbs'), '⚡ 1RM Teórico Estimado'];
                      return [val, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="maxWeight" name="Pico de Carga" stroke="#0066ff" strokeWidth={3.5} dot={{ r: 5, fill: '#0066ff' }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="est1RM" name={analysisMode === 'exercise' ? "1RM Teórico (Epley)" : "Volumen Grupo Muscular"} stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Gráfico de Sobrecarga Progresiva Global */}
      <div className="card" style={{ padding: '18px', marginBottom: '22px', borderRadius: '26px' }}>
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
          <div style={{ width: '100%', height: '220px' }}>
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
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a', whiteSpace: 'normal' }}>Bitácora y Mesociclo de Sesiones</h2>
      </div>

      {workoutHistory.length > 0 && (() => {
        const availableWeeks = Array.from(new Set(workoutHistory.map(s => s.weekNumber || 1))).sort((a, b) => a - b);
        return (
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            <button
              type="button"
              onClick={() => setSelectedWeekFilter('ALL')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedWeekFilter === 'ALL' ? '2px solid #0066ff' : '1.5px solid #cbd5e1',
                background: selectedWeekFilter === 'ALL' ? '#0066ff' : '#ffffff',
                color: selectedWeekFilter === 'ALL' ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: selectedWeekFilter === 'ALL' ? '0 4px 12px rgba(0,102,255,0.25)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              🌟 Todas ({workoutHistory.length})
            </button>
            {availableWeeks.map(wk => {
              const count = workoutHistory.filter(s => (s.weekNumber || 1) === wk).length;
              return (
                <button
                  key={wk}
                  type="button"
                  onClick={() => setSelectedWeekFilter(wk)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: selectedWeekFilter === wk ? '2px solid #0066ff' : '1.5px solid #cbd5e1',
                    background: selectedWeekFilter === wk ? '#0066ff' : '#ffffff',
                    color: selectedWeekFilter === wk ? '#ffffff' : '#475569',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: selectedWeekFilter === wk ? '0 4px 12px rgba(0,102,255,0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  🗓️ Semana {wk} ({count})
                </button>
              );
            })}
          </div>
        );
      })()}
      
      {workoutHistory.length === 0 ? (
        <div className="card" style={{ padding: '28px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '24px' }}>
          <Calendar size={34} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#334155', margin: 0, fontSize: '16px', fontWeight: '800', whiteSpace: 'normal' }}>Bitácora limpia sin registros predeterminados</h3>
          <p style={{ marginTop: '8px', fontSize: '13px', lineHeight: '1.5', fontWeight: '600' }}>
            Al pulsar el botón de Guardar Sesión al final de tus entrenamientos en la pestaña Rutina, tu análisis, cargas y calibración de máquinas quedarán inmortalizados en este laboratorio.
          </p>
        </div>
      ) : (
        (selectedWeekFilter === 'ALL' 
          ? [...workoutHistory]
          : [...workoutHistory].filter(s => (s.weekNumber || 1) === selectedWeekFilter)
        ).reverse().map((ses) => {
          const isExpanded = expandedSessionId === ses.id;
          const wkNum = ses.weekNumber || 1;
          
          return (
            <div key={ses.id} className="card" style={{ marginBottom: '14px', overflow: 'hidden', borderRadius: '22px', border: '1px solid #cbd5e1' }}>
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
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '900', border: '1px solid #7dd3fc' }}>
                      🗓️ {ses.weekName || `Semana ${wkNum}`}
                    </span>
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
                    type="button"
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
                          <strong style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', whiteSpace: 'normal', lineBreak: 'strict' }}>{exData.name || exDef.name || 'Ejercicio Personalizado'}</strong>
                          <span className="badge badge-blue">Meta: {exDef.reps || '-'}</span>
                        </div>

                        {exData.muscleGroup && (
                          <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '10px', marginBottom: '8px', display: 'inline-block', fontWeight: '800' }}>
                            💪 {exData.muscleGroup}
                          </span>
                        )}

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

                        {/* NOTAS Y SENSA CIONES REGISTRADAS EN LA SESIÓN */}
                        {((exData.notesHistory && exData.notesHistory.length > 0) || exData.notes) && (
                          <div style={{ marginTop: '10px', background: '#f5f3ff', padding: '10px', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
                            <div style={{ fontSize: '11px', fontWeight: '900', color: '#6d28d9', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MessageSquare size={13} color="#7c3aed" /> Notas del Ejercicio:
                            </div>
                            {(exData.notesHistory || [{ id: 'legacy', date: 'Nota', text: exData.notes }]).map(n => (
                              <div key={n.id || n.text} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#334155', background: '#ffffff', padding: '6px 8px', borderRadius: '8px', marginBottom: '4px' }}>
                                <div>
                                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', display: 'block' }}>🕒 {n.date || 'Nota'}</span>
                                  <span>{n.text}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    modal.showConfirm({
                                      title: "🗑️ ¿Eliminar esta nota?",
                                      message: `"${n.text}"`,
                                      confirmText: "Borrar",
                                      cancelText: "Cancelar",
                                      variant: "danger",
                                      onConfirm: () => {
                                        const newHistory = workoutHistory.map(session => {
                                          if (session.id === ses.id) {
                                            const newExData = { ...session.exercises[exId] };
                                            if (newExData.notesHistory) {
                                              newExData.notesHistory = newExData.notesHistory.filter(item => item.id !== n.id);
                                            }
                                            if (newExData.notes === n.text) {
                                              newExData.notes = '';
                                            }
                                            return {
                                              ...session,
                                              exercises: {
                                                ...session.exercises,
                                                [exId]: newExData
                                              }
                                            };
                                          }
                                          return session;
                                        });
                                        setWorkoutHistory(newHistory);
                                        modal.showAlert({ title: "🗑️ Nota eliminada", message: "La nota fue eliminada del historial.", variant: "info" });
                                      }
                                    });
                                  }}
                                  style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', padding: '2px 6px', fontSize: '10px', fontWeight: '800', cursor: 'pointer', flexShrink: 0 }}
                                >
                                  Borrar
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
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
