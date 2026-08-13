import React, { useState, useRef } from 'react';
import { useIndexedDB as useLocalStorage } from '../hooks/useIndexedDB';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { clear } from 'idb-keyval';
import { scientificProtocol } from '../data/scientificProtocol';
import ConsistencyHeatmap from './ConsistencyHeatmap';
import { useAuth } from '../contexts/AuthContext';
import { UNIFIED_EXERCISE_LIBRARY, MUSCLE_GROUPS_LIST } from '../data/unifiedExerciseLibrary';
import RoutineManagerModal from './workout/RoutineManagerModal';
import { getHistoricalRecordsForExercise } from '../utils/exerciseMatcher';
import { 
  exportFullDatabase, 
  exportRoutineStructure, 
  exportExerciseLibrary, 
  exportWorkoutHistory, 
  exportBodyMetrics, 
  restoreFullDatabase 
} from '../services/backupService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Activity, TrendingUp, Award, Clock, ChevronDown, ChevronUp, Trash2, 
  ShieldCheck, Zap, HeartPulse, Dumbbell, Calendar, Sparkles, Settings2, 
  Download, Upload, AlertOctagon, Settings, X, ShieldAlert, Database, Cloud, 
  Copy, Check, Cpu, Loader2, Sparkles as SparklesIcon, Layers, RefreshCw, 
  MessageSquare, ChevronRight, FileText, ArrowRight, Flame, Scale, CheckCircle2
} from 'lucide-react';
import { useModal, LiquidDropdown } from './common/UIComponents';

export default function HistoryView() {
  const modal = useModal();
  const { logout, currentUser } = useAuth();
  const [workoutHistory, setWorkoutHistory, isHistoryLoading, saveSession, deleteSession] = useWorkoutHistory();
  const [currentSessions, setCurrentSessions, isSessionsLoading] = useLocalStorage('coachv2_active_workouts', {});
  const [customExercisesMap, setCustomExercisesMap, isCustomLoading] = useLocalStorage('coachv2_custom_day_exercises', {});
  const [customRoutine, setCustomRoutine] = useLocalStorage('coachv2_custom_routine', null);

  const activeDays = (customRoutine && Array.isArray(customRoutine) && customRoutine.length > 0) ? customRoutine : scientificProtocol;

  const isLoadingDb = isHistoryLoading || isSessionsLoading || isCustomLoading;

  // 1. Selector de Modo Principal: Progresión de Rutina vs Analítica Gráfica vs Bitácora
  const [mainViewMode, setMainViewMode] = useState('routine_progression'); // 'routine_progression' | 'charts' | 'sessions'
  const [selectedProgDayId, setSelectedProgDayId] = useState('d1');
  const [expandedExerciseProgId, setExpandedExerciseProgId] = useState(null);

  // Explorador de Base de Datos y Unificación AI
  const [selectedDbFilter, setSelectedDbFilter] = useState('Todos');
  const [dbSearchTerm, setDbSearchTerm] = useState('');

  const [analysisMode, setAnalysisMode] = useState('exercise'); // 'exercise' or 'muscleGroup'
  const [selectedExId, setSelectedExId] = useState('d1_e1');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Pecho');
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState('ALL');
  
  // Modales
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState('');

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

  activeDays.forEach(day => {
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

  // Asegurar que cualquier ejercicio personalizado adicional aparezca en la lista
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
                  bestReps = parseInt(s.reps) || 0;
                  unit = s.unit || 'lbs';
                }
              }
            }
          });

          if (maxW > 0) {
            const est1RM = Math.round(maxW * (1 + bestReps / 30));
            progData.push({
              date: ses.dateString ? ses.dateString.split(',')[0] : (ses.timestamp ? ses.timestamp.split('T')[0] : 'Sesión'),
              maxWeight: maxW,
              reps: bestReps,
              est1RM,
              unit
            });
          }
        }
      });
    } else {
      workoutHistory.forEach(ses => {
        if (ses.exercises) {
          let maxGroupWeight = 0;
          let totalGroupVolume = 0;
          let matches = false;

          Object.keys(ses.exercises).forEach(exId => {
            const exData = ses.exercises[exId];
            const exDef = allAvailableExercises.find(e => e.id === exId);
            const mg = exData?.muscleGroup || exDef?.muscleGroup;

            if (mg && mg.toLowerCase().includes(selectedMuscleGroup.toLowerCase())) {
              matches = true;
              Object.keys(exData).forEach(setNum => {
                if (!isNaN(parseInt(setNum))) {
                  const s = exData[setNum];
                  if (s && s.completed && s.weight) {
                    let w = parseFloat(s.weight) || 0;
                    if (s.unit === 'kg') w *= 2.20462;
                    const r = parseFloat(s.reps) || 0;
                    if (w > maxGroupWeight) maxGroupWeight = w;
                    totalGroupVolume += (w * r);
                  }
                }
              });
            }
          });

          if (matches) {
            progData.push({
              date: ses.dateString ? ses.dateString.split(',')[0] : 'Fecha',
              maxWeight: Math.round(maxGroupWeight),
              est1RM: Math.round(totalGroupVolume),
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

  // Métrica y Diagnóstico Inteligente
  const latestLog = progData.length > 0 ? progData[progData.length - 1] : null;
  const previousLog = progData.length > 1 ? progData[progData.length - 2] : null;

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
        smartSuggestion = `Estás consolidando fuerza. Si ya alcanzaste el tope de reps prescritas, sube +5 lbs en tu próxima sesión.`;
      } else if (deltaWeight < 0 || deltaReps < 0) {
        smartDiagnosis = `⚠️ Ligero descenso temporal en carga o reps vs sesión anterior.`;
        smartSuggestion = `Normal en semanas de fatiga. Prioriza descanso completo y calidad técnica con IAP.`;
      } else {
        smartDiagnosis = `⚖️ Estabilidad mecánica: Mantienes exactamente la misma carga y repeticiones.`;
        smartSuggestion = `Hoy intenta sacar al menos +1 repetición extra en tu última serie para reactivar la señal de hipertrofia.`;
      }
    } else {
      smartDiagnosis = `📌 Línea base oficial establecida con ${latestLog.maxWeight} ${latestLog.unit} x ${latestLog.reps} reps.`;
      smartSuggestion = `Tu siguiente entrenamiento comparará automáticamente tu rendimiento contra este pico para trazar tu curva de progresión.`;
    }
  }

  // =========================================================================
  // MOTOR DE PROGRESIÓN DE LA RUTINA DÍA A DÍA (VISTA COMO SI FUERA LA RUTINA)
  // =========================================================================
  const getDayProgressionExercises = (dayId) => {
    const targetDay = activeDays.find(d => d.id === dayId) || activeDays[0];
    if (!targetDay) return [];

    const baseExercises = targetDay.exercises || [];
    const customExercises = customExercisesMap[dayId] || [];
    const allDayExercises = [...baseExercises, ...customExercises];

    return allDayExercises.map(ex => {
      const records = getHistoricalRecordsForExercise(ex, workoutHistory);
      return {
        exercise: ex,
        ...records
      };
    });
  };

  const currentProgDayExercises = getDayProgressionExercises(selectedProgDayId);
  const activeProgDayObj = activeDays.find(d => d.id === selectedProgDayId) || activeDays[0];

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
      message: "Esta rutina automatizada del sistema realizará:\n\n1. Eliminación de sesiones borrador abandonadas o sin completar.\n2. Depuración de entradas vacías sin peso logradas.\n3. Compactación y desfragmentación del almacenamiento local.\n\nTus sesiones archivadas y récords reales se preservarán intactos al 100%.",
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
          message: `Mantenimiento clínico concluido con éxito. Se depuraron ${removedDrafts} borradores vacíos.`,
          variant: "success"
        });
      }
    });
  };

  // EXPORTAR BASE DE DATOS TOTAL (FIREBASE 100%)
  const handleExportFullFirebase = async () => {
    try {
      const res = await exportFullDatabase(currentUser);
      modal.showAlert({
        title: "💾 Respaldo Maestro Firebase Descargado",
        message: `Se descargó exitosamente el archivo JSON con el 100% de tus datos (${res.countSessions} sesiones históricas, rutinas, ejercicios y peso corporal).`,
        variant: "success"
      });
    } catch (err) {
      modal.showAlert({ title: "Error de Exportación", message: err.message, variant: "danger" });
    }
  };

  // IMPORTAR / RESTAURAR BASE DE DATOS EN LA NUBE
  const handleImportDatabase = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        modal.showConfirm({
          title: "📥 ¿Restaurar Base de Datos en Firebase?",
          message: `El archivo fue verificado con éxito. ¿Estás seguro de restaurar este respaldo maestro en tu cuenta de Firebase y en la memoria de la app?`,
          confirmText: "Restaurar Ahora",
          cancelText: "Cancelar",
          variant: "warning",
          onConfirm: async () => {
            setIsRestoring(true);
            try {
              const res = await restoreFullDatabase(currentUser, data, (msg) => setRestoreStatus(msg));
              setIsRestoring(false);
              setShowConfigModal(false);
              modal.showAlert({
                title: "🎉 Base de Datos Restaurada al 100%",
                message: `Se restauraron exitosamente ${res.sessionsRestored} sesiones en Firebase Firestore y ${res.keysRestored} configuraciones. La aplicación se recargará para aplicar los cambios.`,
                variant: "success",
                onConfirm: () => {
                  window.location.reload();
                }
              });
            } catch (err) {
              setIsRestoring(false);
              modal.showAlert({ title: "Error de Restauración", message: err.message, variant: "danger" });
            }
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
    const day = activeDays.find(d => d.id === dayId) || scientificProtocol.find(d => d.id === dayId);
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
    <div className="container" style={{ paddingBottom: '70px' }}>
      
      {/* Cabecera del Laboratorio Científico */}
      <div className="card" style={{ padding: '16px', marginBottom: '14px', borderTop: '4px solid #0066ff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div>
            <span className="badge badge-blue">Analítica & Progresión</span>
            <h1 style={{ marginTop: '4px', fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>
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
              borderRadius: '14px', 
              fontSize: '12px', 
              fontWeight: '800', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              flexShrink: 0
            }}
          >
            <Settings size={15} /> Base de Datos & Nube
          </button>
        </div>
      </div>

      {/* SELECTOR DE VISTA PRINCIPAL (PROGRESIÓN DE RUTINA VS GRÁFICAS VS BITÁCORA) */}
      <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '16px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setMainViewMode('routine_progression')}
          style={{
            flex: 1,
            padding: '10px 6px',
            border: 'none',
            borderRadius: '12px',
            background: mainViewMode === 'routine_progression' ? '#ffffff' : 'transparent',
            color: mainViewMode === 'routine_progression' ? '#0066ff' : '#64748b',
            fontWeight: '900',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: mainViewMode === 'routine_progression' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Dumbbell size={14} /> 🏋️ Progresión Rutina
        </button>

        <button
          type="button"
          onClick={() => setMainViewMode('charts')}
          style={{
            flex: 1,
            padding: '10px 6px',
            border: 'none',
            borderRadius: '12px',
            background: mainViewMode === 'charts' ? '#ffffff' : 'transparent',
            color: mainViewMode === 'charts' ? '#0066ff' : '#64748b',
            fontWeight: '900',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: mainViewMode === 'charts' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Activity size={14} /> 📈 Gráficas & 1RM
        </button>

        <button
          type="button"
          onClick={() => setMainViewMode('sessions')}
          style={{
            flex: 1,
            padding: '10px 6px',
            border: 'none',
            borderRadius: '12px',
            background: mainViewMode === 'sessions' ? '#ffffff' : 'transparent',
            color: mainViewMode === 'sessions' ? '#0066ff' : '#64748b',
            fontWeight: '900',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: mainViewMode === 'sessions' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Calendar size={14} /> 📜 Bitácora ({totalSessions})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. MODO: VISTA DE PROGRESIÓN DE RUTINA (ESTRUCTURA DE DÍAS Y EJERCICIOS) */}
      {/* ========================================================================= */}
      {mainViewMode === 'routine_progression' && (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Cabecera del Gestor de Rutina con botón rápido para actualizar / pegar */}
          <div className="card" style={{ padding: '14px 16px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '20px' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: '900', display: 'block' }}>
                  🎯 Progresión Estructurada por Día
                </strong>
                <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600' }}>
                  Observa cómo han ido incrementando tus pesos en cada ejercicio de la rutina.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowRoutineModal(true)}
                style={{
                  background: '#0066ff',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Layers size={14} /> 🛠️ Actualizar Rutina
              </button>
            </div>
          </div>

          {/* Selector Horizontal de Días */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {activeDays.map(day => {
              const isSelected = selectedProgDayId === day.id;
              const dayShort = day.name.split(':')[0];
              const exCount = (day.exercises?.length || 0) + (customExercisesMap[day.id]?.length || 0);

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setSelectedProgDayId(day.id)}
                  style={{
                    flex: '0 0 auto',
                    padding: '8px 14px',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid #0066ff' : '1.5px solid #cbd5e1',
                    background: isSelected ? '#0066ff' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    fontSize: '12px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,102,255,0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{dayShort}</span>
                  <span style={{ fontSize: '10px', opacity: isSelected ? 0.9 : 0.6, fontWeight: '700' }}>
                    {exCount} ex
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tarjeta Informativa del Día Activo */}
          <div className="card" style={{ padding: '14px 16px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>
              {activeProgDayObj?.name}
            </h3>
            {activeProgDayObj?.focus && (
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                🎯 {activeProgDayObj.focus}
              </p>
            )}
          </div>

          {/* Lista de Ejercicios con su Progresión */}
          {currentProgDayExercises.length === 0 ? (
            <div className="card" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
              Día de descanso sin ejercicios programados.
            </div>
          ) : (
            currentProgDayExercises.map(({ exercise, sessionOccurrences, startWeight, currentWeight, prWeight, delta, deltaPercent, unit, matchedSources, hasHistory }) => {
              const isExpanded = expandedExerciseProgId === exercise.id;

              return (
                <div 
                  key={exercise.id}
                  className="card animate-fade"
                  style={{
                    padding: '16px',
                    borderRadius: '20px',
                    border: hasHistory ? (delta > 0 ? '1.5px solid #86efac' : '1.5px solid #cbd5e1') : '1.5px dashed #cbd5e1',
                    background: '#ffffff',
                    marginBottom: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Encabezado del Ejercicio */}
                  <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '900', display: 'block' }}>
                        {exercise.name}
                      </strong>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '10px', fontWeight: '800' }}>
                          💪 {exercise.muscleGroup || 'General'}
                        </span>
                        {exercise.loadFamily && (
                          <span className="badge" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', fontSize: '10px', fontWeight: '800' }}>
                            🏛️ {exercise.loadFamily.replace('Familia ', '')}
                          </span>
                        )}
                        <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: '700' }}>
                          Prescripción: {exercise.sets}x{exercise.reps} ({exercise.restTime || '90s'})
                        </span>
                      </div>

                      {matchedSources && matchedSources.length > 0 && matchedSources.some(s => s.toLowerCase() !== exercise.name.toLowerCase()) && (
                        <div style={{ marginTop: '6px', fontSize: '10px', color: '#6d28d9', background: '#f5f3ff', padding: '3px 8px', borderRadius: '8px', border: '1px solid #ddd6fe', fontWeight: '700', display: 'inline-block' }}>
                          ⚡️ Historial vinculado con: {matchedSources.join(' • ')}
                        </div>
                      )}
                    </div>

                    {/* Indicador de Delta */}
                    {hasHistory ? (
                      <span 
                        className="badge" 
                        style={{ 
                          background: delta > 0 ? '#dcfce7' : (delta === 0 ? '#eff6ff' : '#fee2e2'),
                          color: delta > 0 ? '#15803d' : (delta === 0 ? '#1d4ed8' : '#b91c1c'),
                          fontSize: '11px',
                          fontWeight: '900',
                          border: delta > 0 ? '1px solid #86efac' : '1px solid #bfdbfe'
                        }}
                      >
                        {delta > 0 ? `🚀 +${delta} ${unit} (+${deltaPercent}%)` : (delta === 0 ? `⚖️ Estable` : `⚠️ ${delta} ${unit}`)}
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#f1f5f9', color: '#94a3b8', fontSize: '10px' }}>
                        Sin registros
                      </span>
                    )}
                  </div>

                  {/* Fila de Métricas (Inicial vs Actual vs Récord PR) */}
                  {hasHistory ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '14px', marginBottom: '10px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Inicial</span>
                        <strong style={{ fontSize: '13px', color: '#334155', fontWeight: '900' }}>
                          {startWeight} {unit}
                        </strong>
                      </div>
                      <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '9px', color: '#0066ff', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Actual</span>
                        <strong style={{ fontSize: '14px', color: '#0066ff', fontWeight: '900' }}>
                          {currentWeight} {unit}
                        </strong>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '9px', color: '#b45309', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Récord (PR) 🏆</span>
                        <strong style={{ fontSize: '13px', color: '#b45309', fontWeight: '900' }}>
                          {prWeight} {unit}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', color: '#92400e', marginBottom: '10px' }}>
                      📌 Registra tus cargas hoy para comenzar a trazar la sobrecarga progresiva de este ejercicio.
                    </div>
                  )}

                  {/* Secuencia Temporal de Evolución (Badges por Sesión) */}
                  {hasHistory && sessionOccurrences.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                        Historial de Sobrecarga por Sesión:
                      </span>
                      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                        {sessionOccurrences.map((occ, idx) => (
                          <div 
                            key={idx}
                            style={{
                              flex: '0 0 auto',
                              background: occ.maxWeight === prWeight ? '#fef3c7' : '#f1f5f9',
                              border: occ.maxWeight === prWeight ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '10px',
                              fontWeight: '800',
                              color: occ.maxWeight === prWeight ? '#78350f' : '#1e293b',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{ fontSize: '9px', color: '#64748b' }}>{occ.dateStr}</div>
                            <div>{occ.maxWeight}{occ.unit} × {occ.bestReps}r</div>
                            {occ.sourceName && occ.sourceName.toLowerCase() !== exercise.name.toLowerCase() && (
                              <div style={{ fontSize: '8px', color: '#7c3aed', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {occ.sourceName}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botón para Desplegar Detalle Completo de Series */}
                  {hasHistory && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedExerciseProgId(isExpanded ? null : exercise.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#0066ff',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 0'
                        }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {isExpanded ? 'Ocultar detalle de series' : `Ver desglose de series (${sessionOccurrences.length} sesiones)`}
                      </button>

                      {isExpanded && (
                        <div className="animate-fade" style={{ marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {sessionOccurrences.map((occ, sIdx) => (
                            <div key={sIdx} style={{ background: '#f8fafc', padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                              <div className="flex-between" style={{ marginBottom: '4px' }}>
                                <strong style={{ fontSize: '11px', color: '#1e293b' }}>📅 {occ.dateStr} (Semana {occ.weekNumber})</strong>
                                <span style={{ fontSize: '10px', color: '#0066ff', fontWeight: '800' }}>Pico: {occ.maxWeight} {occ.unit}</span>
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {occ.detailedSets.map(st => (
                                  <span key={st.setNum} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                                    S{st.setNum}: {st.weight}{st.unit} × {st.reps}r (RPE {st.rpe})
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODO: GRÁFICAS Y ANALÍTICA DE SOBRECARGA (MODO EXISTENTE) */}
      {/* ========================================================================= */}
      {mainViewMode === 'charts' && (
        <div className="animate-fade">
          {/* KPIs Clínicos */}
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

          {/* Curva Evolutiva por Ejercicio o Grupo Muscular */}
          <div className="card card-highlight" style={{ padding: '18px', marginBottom: '22px', borderRadius: '26px' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Dumbbell size={20} color="#0066ff" />
                  <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '900' }}>Analítica de Sobrecarga Progresiva</h2>
                </div>
                <span className="badge badge-blue">1RM & Volumen</span>
              </div>

              <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '16px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => setAnalysisMode('exercise')}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px', background: analysisMode === 'exercise' ? '#ffffff' : 'transparent', color: analysisMode === 'exercise' ? '#0066ff' : '#64748b', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}
                >
                  🎯 Por Ejercicio Individual
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisMode('muscleGroup')}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px', background: analysisMode === 'muscleGroup' ? '#ffffff' : 'transparent', color: analysisMode === 'muscleGroup' ? '#0066ff' : '#64748b', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}
                >
                  🧬 Por Grupo Muscular
                </button>
              </div>

              {analysisMode === 'exercise' ? (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '800', color: '#475569' }}>
                    Selecciona Ejercicio para Auditar Sobrecarga:
                  </label>
                  <LiquidDropdown
                    options={exerciseOptions}
                    value={selectedExId}
                    onChange={val => setSelectedExId(val)}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '800', color: '#475569' }}>
                    Selecciona Grupo Muscular Objetivo:
                  </label>
                  <LiquidDropdown
                    options={muscleGroupOptions}
                    value={selectedMuscleGroup}
                    onChange={val => setSelectedMuscleGroup(val)}
                  />
                </div>
              )}

              {/* Gráfica de Progreso */}
              {progData.length > 0 ? (
                <div style={{ height: '260px', width: '100%', marginTop: '14px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: '700', fill: '#64748b' }} />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fontWeight: '700', fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="maxWeight" name="Carga Máxima" stroke="#0066ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="est1RM" name="1RM Estimado" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                  Sin registros suficientes para este ejercicio en el historial.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODO: BITÁCORA DE SESIONES CRONOLÓGICA */}
      {/* ========================================================================= */}
      {mainViewMode === 'sessions' && (
        <div className="animate-fade">
          {workoutHistory.length === 0 ? (
            <div className="card" style={{ padding: '28px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '24px' }}>
              <Calendar size={34} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ color: '#334155', margin: 0, fontSize: '16px', fontWeight: '800' }}>Bitácora limpia</h3>
              <p style={{ marginTop: '8px', fontSize: '13px', lineHeight: '1.5', fontWeight: '600' }}>
                Guarda tus sesiones de entrenamiento para ver tu historial cronológico aquí.
              </p>
            </div>
          ) : (
            [...workoutHistory].reverse().map((ses) => {
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
                      background: isExpanded ? 'rgba(241, 245, 249, 0.8)' : 'transparent'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '900', border: '1px solid #7dd3fc' }}>
                          🗓️ {ses.weekName || `Semana ${wkNum}`}
                        </span>
                        <strong style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{ses.dayName}</strong>
                        {ses.completedSets > 0 && <span className="badge badge-green" style={{ fontSize: '10px' }}>{ses.completedSets} series</span>}
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>
                        📅 {ses.dateString} • Volumen: <strong style={{ color: '#0066ff' }}>{ses.volume?.toLocaleString()} lbs</strong>
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

                        const exDef = findExerciseDefinition(ses.dayId, exId);
                        const setNums = Object.keys(exData).filter(k => !isNaN(parseInt(k)) && exData[k] && exData[k].completed);
                        if (setNums.length === 0 && !exData.machineSetup) return null;

                        return (
                          <div key={exId} style={{ marginTop: '12px', background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
                            <div className="flex-between" style={{ marginBottom: '8px' }}>
                              <strong style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{exData.name || exDef.name || 'Ejercicio Personalizado'}</strong>
                              <span className="badge badge-blue">{exData.muscleGroup || exDef.muscleGroup}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {setNums.map(setNum => {
                                const s = exData[setNum];
                                return (
                                  <div key={setNum} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 10px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <span style={{ fontWeight: '800', color: '#334155' }}>Serie #{setNum}</span>
                                    <span style={{ color: '#0066ff', fontWeight: '800' }}>{s.weight} {s.unit || 'lbs'} × {s.reps} reps</span>
                                    <span className="badge badge-warning" style={{ fontSize: '10px' }}>RPE {s.rpe || '8'}</span>
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
      )}

      {/* ========================================================================= */}
      {/* MODAL CONFIGURACIÓN, EXPORTACIÓN TOTAL FIREBASE Y RESTAURACIÓN */}
      {/* ========================================================================= */}
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
                <strong style={{ fontSize: '15px', color: '#065f46', fontWeight: '900' }}>Firebase Cloud Sincronizado</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#047857', margin: '0 0 12px 0', lineHeight: '1.5', fontWeight: '600' }}>
                Tus bitácoras de entrenamiento, historial de peso y rutinas están protegidas en tiempo real en la nube.
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

            {/* BOTÓN MAESTRO DE EXPORTACIÓN TOTAL FIREBASE */}
            <div style={{ marginBottom: '18px' }}>
              <strong style={{ fontSize: '13px', color: '#0f172a', fontWeight: '900', display: 'block', marginBottom: '6px' }}>
                💾 Respaldo Maestro de Firebase
              </strong>
              <button 
                type="button"
                onClick={handleExportFullFirebase} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px', fontSize: '14px', borderRadius: '16px', background: 'linear-gradient(135deg, #0066ff 0%, #004ecc 100%)', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 16px rgba(0,102,255,0.3)' }}
              >
                <Download size={18} /> Exportar Base de Datos Total (JSON)
              </button>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '4px', textAlign: 'center' }}>
                Incluye 100% de registros en Firestore: historial, rutinas, ejercicios, peso y configuraciones.
              </span>
            </div>

            {/* SECCIÓN DE DESCARGAS MODULARES ESPECÍFICAS */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '14px', marginBottom: '18px' }}>
              <strong style={{ fontSize: '12px', color: '#334155', fontWeight: '900', display: 'block', marginBottom: '10px' }}>
                📦 Descargas Modulares Específicas:
              </strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => exportRoutineStructure(activeDays, customExercisesMap)}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={14} color="#0066ff" /> Rutinas (TXT & JSON)
                </button>

                <button
                  type="button"
                  onClick={() => exportExerciseLibrary()}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Dumbbell size={14} color="#7c3aed" /> Catálogo Ejercicios
                </button>

                <button
                  type="button"
                  onClick={() => exportWorkoutHistory(currentUser)}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Calendar size={14} color="#059669" /> Historial Sesiones
                </button>

                <button
                  type="button"
                  onClick={() => exportBodyMetrics(currentUser)}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Scale size={14} color="#d97706" /> Historial de Peso
                </button>
              </div>
            </div>

            {/* RESTAURACIÓN DE RESPALDO */}
            <div style={{ marginBottom: '18px' }}>
              <input type="file" ref={fileInputRef} onChange={handleImportDatabase} style={{ display: 'none' }} accept=".json" />
              <button 
                type="button"
                disabled={isRestoring}
                onClick={() => fileInputRef.current?.click()} 
                style={{ width: '100%', padding: '14px', fontSize: '13px', borderRadius: '16px', fontWeight: '800', background: '#f1f5f9', color: '#0f172a', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                {isRestoring ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} color="#0066ff" />}
                {isRestoring ? (restoreStatus || 'Restaurando en Firebase...') : 'Restaurar Respaldo Maestro JSON'}
              </button>
            </div>

            {/* Mantenimiento */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={handleSmartCleanup}
                style={{ flex: 1, padding: '10px', fontSize: '11px', borderRadius: '12px', background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <SparklesIcon size={14} /> Limpieza
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfigModal(false);
                  setShowRoutineModal(true);
                }}
                style={{ flex: 1, padding: '10px', fontSize: '11px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Layers size={14} /> Gestor Rutina
              </button>
            </div>

            {/* Zona de Peligro */}
            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
              <button 
                type="button"
                onClick={handleWipeAllData} 
                style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', width: '100%', cursor: 'pointer' }}
              >
                <AlertOctagon size={14} style={{ display: 'inline', marginRight: '4px' }} /> Resetear Laboratorio a Cero
              </button>
            </div>

            <button type="button" onClick={() => setShowConfigModal(false)} style={{ width: '100%', padding: '12px', marginTop: '16px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '14px', fontWeight: '800', color: '#64748b', cursor: 'pointer' }}>
              Volver al Laboratorio
            </button>
          </div>
        </div>
      )}

      {/* MODAL GESTOR DE RUTINA */}
      <RoutineManagerModal
        isOpen={showRoutineModal}
        onClose={() => setShowRoutineModal(false)}
        activeRoutine={activeDays}
        customExercisesMap={customExercisesMap}
        onSaveRoutine={async (newRoutine) => {
          setCustomRoutine(newRoutine);
        }}
        onResetToBaseProtocol={async () => {
          setCustomRoutine(null);
        }}
      />
    </div>
  );
}
