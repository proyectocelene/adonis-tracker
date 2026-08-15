import React, { useState, useRef } from 'react';
import { useIndexedDB as useLocalStorage } from '../hooks/useIndexedDB';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { clear } from 'idb-keyval';
import { scientificProtocol } from '../data/scientificProtocol';
import { useAuth } from '../contexts/AuthContext';
import RoutineManagerModal from './workout/RoutineManagerModal';
import HistorySessionCard from './history/HistorySessionCard';
import DataBackupModal from './history/DataBackupModal';
import HistoryProgressionView from './history/HistoryProgressionView';
import HistoryChartsView from './history/HistoryChartsView';
import { getHistoricalRecordsForExercise } from '../utils/exerciseMatcher';
import { calculate1RM } from '../hooks/useWorkoutCalculations';
import { 
  exportFullDatabase, 
  exportRoutineStructure, 
  exportExerciseLibrary, 
  exportWorkoutHistory, 
  exportBodyMetrics, 
  restoreFullDatabase 
} from '../services/backupService';
import { 
  Settings, Dumbbell, Activity, Calendar, Loader2 
} from 'lucide-react';
import { useModal } from './common/UIComponents';

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
  const getTodayDayId = () => {
    let day = new Date().getDay(); // 0 = Domingo, 1 = Lunes ... 6 = Sábado
    if (day === 0) day = 7;
    return `d${day}`;
  };

  const [mainViewMode, setMainViewMode] = useState('routine_progression'); // 'routine_progression' | 'charts' | 'sessions'
  const [selectedProgDayId, setSelectedProgDayId] = useState(getTodayDayId);
  const [expandedExerciseProgId, setExpandedExerciseProgId] = useState(null);

  const [analysisMode, setAnalysisMode] = useState('exercise'); // 'exercise' or 'muscleGroup'
  const [selectedExId, setSelectedExId] = useState(() => {
    const todayId = getTodayDayId();
    const dayObj = activeDays.find(d => d.id === todayId) || activeDays[0];
    return (dayObj && dayObj.exercises && dayObj.exercises[0]) ? dayObj.exercises[0].id : 'd1_e1';
  });
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Pecho');
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  
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
            const est1RM = calculate1RM(maxW, bestReps);
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

  const progData = getProgressionData();

  // =========================================================================
  // MOTOR DE PROGRESIÓN DE LA RUTINA DÍA A DÍA
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
          <Dumbbell size={14} /> Progresión Rutina
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
          <Activity size={14} /> Gráficas & 1RM
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
          <Calendar size={14} /> Bitácora ({totalSessions})
        </button>
      </div>

      {/* 1. MODO: VISTA DE PROGRESIÓN DE RUTINA */}
      {mainViewMode === 'routine_progression' && (
        <HistoryProgressionView
          activeDays={activeDays}
          customExercisesMap={customExercisesMap}
          selectedProgDayId={selectedProgDayId}
          setSelectedProgDayId={setSelectedProgDayId}
          activeProgDayObj={activeProgDayObj}
          currentProgDayExercises={currentProgDayExercises}
          expandedExerciseProgId={expandedExerciseProgId}
          setExpandedExerciseProgId={setExpandedExerciseProgId}
          onOpenRoutineModal={() => setShowRoutineModal(true)}
        />
      )}

      {/* 2. MODO: GRÁFICAS Y ANALÍTICA DE SOBRECARGA */}
      {mainViewMode === 'charts' && (
        <HistoryChartsView
          totalSessions={totalSessions}
          totalVolumeLifted={totalVolumeLifted}
          globalAverageRPE={calculateGlobalAverageRPE()}
          workoutHistory={workoutHistory}
          analysisMode={analysisMode}
          setAnalysisMode={setAnalysisMode}
          selectedExId={selectedExId}
          setSelectedExId={setSelectedExId}
          selectedMuscleGroup={selectedMuscleGroup}
          setSelectedMuscleGroup={setSelectedMuscleGroup}
          exerciseOptions={exerciseOptions}
          muscleGroupOptions={muscleGroupOptions}
          progData={progData}
        />
      )}

      {/* 3. MODO: BITÁCORA DE SESIONES CRONOLÓGICA */}
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
            [...workoutHistory].reverse().map((ses) => (
              <HistorySessionCard
                key={ses.id}
                ses={ses}
                isExpanded={expandedSessionId === ses.id}
                onToggleExpand={() => setExpandedSessionId(expandedSessionId === ses.id ? null : ses.id)}
                onDeleteSession={handleDeleteSession}
                findExerciseDefinition={findExerciseDefinition}
              />
            ))
          )}
        </div>
      )}

      {/* MODAL CONFIGURACIÓN, EXPORTACIÓN TOTAL FIREBASE Y RESTAURACIÓN */}
      <DataBackupModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        currentUser={currentUser}
        logout={logout}
        activeDays={activeDays}
        customExercisesMap={customExercisesMap}
        handleExportFullFirebase={handleExportFullFirebase}
        exportRoutineStructure={exportRoutineStructure}
        exportExerciseLibrary={exportExerciseLibrary}
        exportWorkoutHistory={exportWorkoutHistory}
        exportBodyMetrics={exportBodyMetrics}
        fileInputRef={fileInputRef}
        handleImportDatabase={handleImportDatabase}
        isRestoring={isRestoring}
        restoreStatus={restoreStatus}
        handleSmartCleanup={handleSmartCleanup}
        onOpenRoutineModal={() => {
          setShowConfigModal(false);
          setShowRoutineModal(true);
        }}
        handleWipeAllData={handleWipeAllData}
      />

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
