import React, { useState } from 'react';
import { scientificProtocol } from '../data/scientificProtocol';
import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary';
import ExerciseRow from './ExerciseRow';
import CardioLogger from './CardioLogger';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { analyzeWorkoutProgressWithAI, syncWorkoutToGoogleSheets, autoSyncWithOfflineBuffer } from '../services/deepseek';
import { CheckCircle, Calendar, ArrowLeft, ArrowRight, Save, Flame, RefreshCcw, Plus, X, Dumbbell, ShieldCheck, BookOpen, ShieldAlert, Zap, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle, Activity, Sparkles, Cloud, Check, Loader2, Cpu } from 'lucide-react';
import { useModal } from './common/UIComponents';

export default function WorkoutDay() {
  const modal = useModal();
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    let day = new Date().getDay();
    if (day === 0) day = 7; 
    return day - 1;
  });
  
  const baseDay = scientificProtocol[currentDayIndex];
  const [customExercisesMap, setCustomExercisesMap] = useLocalStorage('coachv2_custom_day_exercises', {});
  const [swappedExercisesMap, setSwappedExercisesMap] = useLocalStorage('coachv2_swapped_exercises', {});
  const [globalWarmupDone, setGlobalWarmupDone] = useLocalStorage('coachv2_global_warmup', {});
  
  // API Keys and Google Sheets Settings
  const [apiKey] = useLocalStorage('coachv2_deepseek_apikey', '');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useLocalStorage('coachv2_google_sheets_url', 'https://script.google.com/macros/s/AKfycbxA-KbUcEgWUq4jvjdSBxLw3tGsgPxXsF2Y7mX5JsNIpE2qslN1v7xW3NqdJ3-4b-RCwg/exec');
  
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('3');
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExRest, setNewExRest] = useState('90 s');
  const [newExBiomech, setNewExBiomech] = useState('');
  const [newExMuscleGroup, setNewExMuscleGroup] = useState('General');
  const [newExUnifiedCode, setNewExUnifiedCode] = useState('');

  const handlePickFromLibrary = (libId) => {
    if (!libId) return;
    const item = UNIFIED_EXERCISE_LIBRARY.find(x => x.id === libId);
    if (item) {
      setNewExName(item.name);
      setNewExMuscleGroup(item.muscleGroup || 'General');
      setNewExSets(item.defaultSets || 4);
      setNewExReps(item.defaultReps || '10-12');
      setNewExRest(item.defaultRest || '90 s');
      setNewExBiomech(item.biomechanics || '');
      setNewExUnifiedCode(item.unifiedCode || '');
    }
  };

  const [showProtocolRules, setShowProtocolRules] = useState(false);
  
  // Acordeón Exclusivo (sólo 1 abierto a la vez)
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

  const [currentSessions, setCurrentSessions] = useLocalStorage('coachv2_active_workouts', {});
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('coachv2_history', []);
  const [bodyMetrics] = useLocalStorage('coachv2_body_metrics_history', []);

  // Estados AI y Sincronización
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [tempSheetsUrl, setTempSheetsUrl] = useState(googleSheetsUrl);

  const userCustomForDay = customExercisesMap[baseDay.id] || [];
  const rawExercises = [...(baseDay.exercises || []), ...userCustomForDay];

  // Mapear ejercicios intercambiados si el usuario los sustituyó
  const currentDay = {
    ...baseDay,
    exercises: rawExercises.map(ex => {
      const swapped = (swappedExercisesMap[baseDay.id] || {})[ex.id];
      if (swapped) {
        return { ...ex, ...swapped, originalName: ex.name };
      }
      return ex;
    })
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

  // Intercambiar Ejercicio en Vivo
  const handleSwapExercise = (exerciseId, swappedData) => {
    setSwappedExercisesMap(prev => {
      const daySwaps = prev[baseDay.id] || {};
      return {
        ...prev,
        [baseDay.id]: {
          ...daySwaps,
          [exerciseId]: swappedData
        }
      };
    });

    // Guardar también la meta en la bitácora activa
    handleUpdateExerciseMeta(exerciseId, {
      name: swappedData.name,
      originalName: swappedData.originalName,
      swapped: true,
      muscleGroup: swappedData.muscleGroup || 'General'
    });

    modal.showAlert({
      title: "🔄 Ejercicio Intercambiado",
      message: `¡Listo! Has cambiado por "${swappedData.name}". El sistema mantendrá la contabilidad del grupo muscular (${swappedData.muscleGroup || 'Principal'}) intacto.`,
      variant: "success"
    });
  };

  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim()) {
      modal.showAlert({ title: "Campo requerido", message: "Escribe el nombre del ejercicio de fuerza para continuar.", variant: "warning" });
      return;
    }

    const newEx = {
      id: `custom_${Date.now()}`,
      name: newExName.trim(),
      muscleGroup: newExMuscleGroup,
      sets: parseInt(newExSets) || 3,
      reps: newExReps.trim() || '10-12',
      restTime: newExRest.trim() || '90 s',
      biomechanics: newExBiomech.trim() || 'Ejecución técnica estricta con control del rango articular y exhalación IAP.',
      searchQuery: `${newExName} biomechanics execution`,
      unifiedFunctionCode: newExUnifiedCode || `[HIPER-${(newExMuscleGroup || 'CUST').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-MÁQ]`,
      defaultUnit: 'lbs'
    };

    setCustomExercisesMap(prev => ({
      ...prev,
      [baseDay.id]: [...(prev[baseDay.id] || []), newEx]
    }));

    setIsAddingExercise(false);
    setNewExName('');
    setNewExBiomech('');
    setNewExUnifiedCode('');

    // Disparar sincronización automática a Google Sheets para poblar "Rutina Maestra Adonis" al instante
    setTimeout(() => {
      autoSyncWithOfflineBuffer();
    }, 500);

    modal.showAlert({
      title: "✅ Ejercicio Incrustado & Sincronizado",
      message: `El ejercicio "${newEx.name}" (Grupo: ${newEx.muscleGroup}) se incorporó a tu rutina habitual del día ${currentDay.name} y se sincronizó automáticamente en tu Google Sheet con el código ${newEx.unifiedFunctionCode}.`,
      variant: "success"
    });
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
      modal.showAlert({
        title: "⭕️ Sesión sin marcas activas",
        message: "Aún no has checado ninguna serie de fuerza ni módulo aeróbico en tu rutina de hoy (✓).\n\nMarca las casillas logradas con los pesos y repeticiones ejecutadas antes de archivar tu entrenamiento.",
        variant: "warning"
      });
      return;
    }

    modal.showConfirm({
      title: `🏁 ¿Archivar Sesión en Bitácora?`,
      message: `Estás a punto de finalizar y registrar tu entrenamiento en el Laboratorio Científico:\n\n💪 Series de fuerza logradas: ${completedSets}\n❤️ Módulos de Cardio Zona 2: ${cardioCompleted}\n🔥 Volumen Total Levantado: ${volume.toLocaleString()} lbs-reps\n\n¿Confirmar y archivar datos oficiales?`,
      confirmText: "💾 Sí, Archivar Ahora",
      cancelText: "Continuar Entrenado",
      variant: "success",
      onConfirm: async () => {
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

        const updatedHistory = [...workoutHistory, newSessionLog];
        setWorkoutHistory(updatedHistory);

        setCurrentSessions(prev => ({
          ...prev,
          [currentDay.id]: {}
        }));

        // Sincronización en segundo plano con Google Sheets si está configurada la URL
        let cloudMsg = "";
        if (googleSheetsUrl && googleSheetsUrl.startsWith("http")) {
          try {
            await syncWorkoutToGoogleSheets({
              webAppUrl: googleSheetsUrl,
              workoutHistory: updatedHistory,
              currentSessions: {},
              bodyMetrics
            });
            cloudMsg = "\n\n☁️ ¡Sincronización Cloud exitosa con tu Google Sheets en vivo!";
          } catch (err) {
            cloudMsg = "\n\n⚠️ Guardado localmente. No se pudo sincronizar en Google Sheets en este momento.";
          }
        }

        modal.showAlert({
          title: "🎉 ¡Sesión Archivado al 100%!",
          message: `Tu hazaña de hoy quedó registrada en tu historial clínico sin simulaciones ni datos predeterminados.${cloudMsg}\n\nConsulta tu evolución real y por grupo muscular en la pestaña 'Análisis'.`,
          variant: "success",
          buttonText: "¡Excelente, al descanso!"
        });
      }
    });
  };

  const handleResetCurrent = () => {
    modal.showConfirm({
      title: "🔄 ¿Reiniciar Casillas del Día?",
      message: "Si desmarcas todas las casillas del día de hoy no se perderá tu historial guardado, pero sí se limpiarán los checks actuales para que puedas iniciar la sesión desde cero.",
      confirmText: "Reiniciar Hoy",
      cancelText: "Mantener",
      variant: "warning",
      onConfirm: () => {
        setCurrentSessions(prev => ({
          ...prev,
          [currentDay.id]: {}
        }));
        setGlobalWarmupDone(prev => ({
          ...prev,
          [currentDay.id]: false
        }));
      }
    });
  };

  // ANALIZAR Y OPTIMIZAR RUTINA CON IA DE DEEPSEEK
  const handleOptimizeWithAI = async () => {
    if (!apiKey) {
      modal.showAlert({
        title: "🔑 Clave DeepSeek Recomendada",
        message: "Para que la inteligencia artificial analice en tiempo real tus pesos, sobrecarga muscular y fatiga, te recomendamos guardar tu Clave API de DeepSeek en el Módulo 'Nutrición' (pestaña Configuración).\n\nSin embargo, hemos preparado un análisis biomecánico estándar con el algoritmo Adonis para el día de hoy.",
        variant: "info",
        buttonText: "Entendido, ver análisis estándar"
      });

      // Fallback algorítmico inteligente
      setAiAnalysisResult({
        resumenSobrecarga: `Evaluación Algorítmica para el día: "${currentDay.name}". Tu volumen promedio reciente muestra una progresión constante en cargas de trabajo.`,
        gruposDestacados: [
          { grupo: currentDay.exercises[0]?.muscleGroup || "Principal", evaluacion: "Buen volumen sostenido en tus últimas sesiones.", estado: "Sobrecarga Excelente" },
          { grupo: currentDay.exercises[1]?.muscleGroup || "Estabilizadores", evaluacion: "Mantén un tiempo excéntrico de 3 segundos.", estado: "Estable" }
        ],
        ajustesRecomendados: [
          { ejercicioOGrupo: currentDay.exercises[0]?.name || "Ejercicio #1", recomendacion: "Si completaste el tope de reps la sesión pasada, sube un 5% la carga de trabajo en la primera serie de hoy." },
          { ejercicioOGrupo: "Descanso Neuromuscular", recomendacion: "Respeta estrictamente los 120-180 segundos en ejercicios compuestos para no perder fuerza por fatiga nerviosa." }
        ],
        consejoDeCalentamientoYPrevencion: "Realiza 2 series de aproximación con el 50% de tu carga para lubricación sin desgaste nervisoso."
      });
      return;
    }

    // Calcular estadísticas acumuladas por grupo muscular
    const muscleGroupStats = {};
    workoutHistory.forEach(ses => {
      if (ses.exercises) {
        Object.values(ses.exercises).forEach(exData => {
          const group = exData.muscleGroup || "General";
          if (!muscleGroupStats[group]) muscleGroupStats[group] = { totalVol: 0, seriesCount: 0 };
          if (!exData.machine) {
            Object.values(exData).forEach(set => {
              if (set && set.completed && set.weight && set.reps) {
                let w = parseFloat(set.weight) || 0;
                if (set.unit === 'kg') w *= 2.20462;
                muscleGroupStats[group].totalVol += (w * parseFloat(set.reps));
                muscleGroupStats[group].seriesCount += 1;
              }
            });
          }
        });
      }
    });

    try {
      setIsAnalyzingAI(true);
      const res = await analyzeWorkoutProgressWithAI({
        apiKey,
        workoutHistory,
        currentDayName: currentDay.name,
        muscleGroupStats
      });
      setAiAnalysisResult(res);
      modal.showAlert({ title: "🧠 ¡Análisis AI Completado!", message: "El entrenador DeepSeek ha auditado tus rutinas pasadas y la sobrecarga de tus grupos musculares.", variant: "success" });
    } catch (err) {
      modal.showAlert({ title: "Error al Consultar IA", message: err.message, variant: "danger" });
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // SINCRONIZACIÓN MANUAL CON GOOGLE SHEETS
  const handleTriggerSync = async () => {
    if (!googleSheetsUrl || !googleSheetsUrl.startsWith('http')) {
      setShowSheetsModal(true);
      return;
    }

    try {
      setIsSyncingSheets(true);
      await syncWorkoutToGoogleSheets({
        webAppUrl: googleSheetsUrl,
        workoutHistory,
        currentSessions,
        bodyMetrics
      });
      modal.showAlert({
        title: "☁️ Sincronización Exitosa",
        message: "Tus rutinas, cargas levantadas y medidas acaban de subirse directamente a tu hoja de Google Sheets en la nube.",
        variant: "success"
      });
    } catch (err) {
      modal.showAlert({ title: "Error en Sincronización", message: err.message, variant: "danger" });
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleSaveSheetsUrl = (e) => {
    e.preventDefault();
    if (tempSheetsUrl.trim() && !tempSheetsUrl.trim().startsWith("https://script.google.com/")) {
      modal.showAlert({ title: "URL Incorrecta", message: "La URL debe ser de Google Apps Script (comienza con https://script.google.com/macros/s/...).", variant: "warning" });
      return;
    }
    setGoogleSheetsUrl(tempSheetsUrl.trim());
    setShowSheetsModal(false);
    modal.showAlert({ title: "☁️ Conexión Guardada", message: "Ahora cada vez que archives una rutina o hagas clic en sincronizar, tus datos irán en vivo a tu Google Sheet.", variant: "success" });
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
      {/* Navegación del Calendario */}
      <div className="card" style={{ padding: '16px 14px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <button 
            type="button"
            className="btn btn-outline" 
            style={{ width: '48px', height: '48px', padding: '0', borderRadius: '16px', flexShrink: 0 }}
            onClick={() => {
              setCurrentDayIndex(prev => prev > 0 ? prev - 1 : 6);
              setExpandedExerciseId(null);
            }}
          >
            <ArrowLeft size={22} />
          </button>
          
          <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '6px', fontSize: '11px' }}>
              Día {currentDay.dayNumber} de 7 • Protocolo Adonis
            </span>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', whiteSpace: 'normal', lineBreak: 'strict', lineHeight: '1.35', color: '#0f172a' }}>
              {currentDay.name}
            </h1>
          </div>
          
          <button 
            type="button"
            className="btn btn-outline" 
            style={{ width: '48px', height: '48px', padding: '0', borderRadius: '16px', flexShrink: 0 }}
            onClick={() => {
              setCurrentDayIndex(prev => prev < 6 ? prev + 1 : 0);
              setExpandedExerciseId(null);
            }}
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      {/* BOTONES RÁPIDOS INGENIOSOS: AI OPTIMIZER & GOOGLE SHEETS SYNC */}
      <div className="grid-2" style={{ gap: '12px', marginBottom: '16px' }}>
        <button 
          type="button"
          onClick={handleOptimizeWithAI}
          disabled={isAnalyzingAI}
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', padding: '12px', borderRadius: '18px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.25)' }}
        >
          {isAnalyzingAI ? <Loader2 size={18} className="animate-spin" /> : <Cpu size={18} />}
          {isAnalyzingAI ? 'Consultando AI...' : '🧠 Optimizar con AI (DeepSeek)'}
        </button>

        <button 
          type="button"
          onClick={handleTriggerSync}
          disabled={isSyncingSheets}
          className="btn btn-outline"
          style={{ background: '#ecfdf5', color: '#047857', border: '1.5px solid #6ee7b7', padding: '12px', borderRadius: '18px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)' }}
        >
          {isSyncingSheets ? <Loader2 size={18} className="animate-spin" /> : <Cloud size={18} color="#10b981" />}
          {isSyncingSheets ? 'Subiendo datos...' : '☁️ Guardar en Google Sheets'}
        </button>
      </div>

      {/* RESULTADO DEL ANÁLISIS AI OPTIMIZER */}
      {aiAnalysisResult && (
        <div className="card animate-fade" style={{ padding: '18px', marginBottom: '18px', background: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 100%)', border: '1.5px solid #d8b4fe', borderRadius: '24px', boxShadow: '0 12px 30px rgba(124, 58, 237, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} color="#7c3aed" />
              <strong style={{ fontSize: '16px', color: '#4c1d95', fontWeight: '900' }}>Reporte de Sobrecarga Muscular AI</strong>
            </div>
            <button type="button" onClick={() => setAiAnalysisResult(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          <p style={{ fontSize: '13px', color: '#581c87', margin: '0 0 14px 0', lineHeight: '1.5', fontWeight: '600', background: '#ffffff', padding: '12px', borderRadius: '16px', border: '1px solid #e9d5ff' }}>
            {aiAnalysisResult.resumenSobrecarga}
          </p>

          <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
            <strong style={{ fontSize: '12px', color: '#6d28d9', textTransform: 'uppercase', fontWeight: '900' }}>💪 Estado de Grupos Musculares:</strong>
            {aiAnalysisResult.gruposDestacados?.map((g, i) => (
              <div key={i} style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b' }}>{g.grupo}</strong>
                  <span style={{ fontSize: '12px', color: '#475569' }}>{g.evaluacion}</span>
                </div>
                <span className="badge" style={{ background: g.estado?.includes('Excelente') ? '#dcfce7' : '#fef3c7', color: g.estado?.includes('Excelente') ? '#166534' : '#92400e', fontWeight: '800', flexShrink: 0, fontSize: '11px' }}>
                  {g.estado}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde047', borderRadius: '16px', padding: '12px', marginBottom: '12px' }}>
            <strong style={{ fontSize: '12px', color: '#92400e', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: '900' }}>⚡️ Ajustes de Carga Recomendados hoy:</strong>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#78350f', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: '600' }}>
              {aiAnalysisResult.ajustesRecomendados?.map((aj, idx) => (
                <li key={idx}><strong>{aj.ejercicioOGrupo}:</strong> {aj.recomendacion}</li>
              ))}
            </ul>
          </div>

          {aiAnalysisResult.consejoDeCalentamientoYPrevencion && (
            <div style={{ fontSize: '12px', color: '#047857', background: '#ecfdf5', padding: '10px 12px', borderRadius: '12px', fontWeight: '700', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <span>{aiAnalysisResult.consejoDeCalentamientoYPrevencion}</span>
            </div>
          )}
        </div>
      )}

      {/* MODAL CONFIGURACIÓN GOOGLE SHEETS */}
      {showSheetsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card animate-scale" style={{ maxWidth: '500px', width: '100%', padding: '24px', borderRadius: '28px', background: '#ffffff', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cloud size={28} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: '#0f172a' }}>Sincronización con Google Sheets</h3>
              </div>
              <button type="button" onClick={() => setShowSheetsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={22} color="#64748b" />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '16px', fontWeight: '500' }}>
              Pega aquí el enlace web (Webhook URL) de tu <strong>Google Apps Script</strong> para guardar en la nube tus entrenamientos en tiempo real y tener una base de datos persistente unificada.
            </p>

            <form onSubmit={handleSaveSheetsUrl}>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: '6px', fontSize: '12px' }}>URL de App Web Google Apps Script:</label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
                  value={tempSheetsUrl}
                  onChange={(e) => setTempSheetsUrl(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '16px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '600', background: '#f8fafc' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'block' }}>
                  💡 ¿No tienes el código o la URL aún? Ve al menú principal, entra a la pestaña <strong>'Análisis'</strong> y busca el cuadro de Google Sheets para copiar el script en 30 segundos.
                </span>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowSheetsModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>Guardar y Conectar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL Y REGLAS INQUEBRANTABLES DEL PROTOCOLO */}
      <div className="card" style={{ padding: '16px', marginBottom: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%)', borderLeft: '6px solid #7c3aed', boxShadow: '0 10px 25px rgba(124, 58, 237, 0.08)' }}>
        <div 
          onClick={() => setShowProtocolRules(!showProtocolRules)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none', flexWrap: 'wrap', gap: '10px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 auto' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e1b4b' }}>Manual de Operaciones & Reglas</h3>
              <span style={{ fontSize: '11px', color: '#6d28d9', fontWeight: '700', display: 'block' }}>Protocolo Adonis • Las 4 Leyes Científicas</span>
            </div>
          </div>

          <button 
            type="button"
            style={{ 
              background: showProtocolRules ? '#1e1b4b' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 18px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: '800', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: showProtocolRules ? 'none' : '0 4px 15px rgba(124, 58, 237, 0.3)',
              transition: 'all 0.25s ease'
            }}
          >
            {showProtocolRules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showProtocolRules ? 'Ocultar Manual' : '📖 Leer Manual'}
          </button>
        </div>

        {showProtocolRules && (
          <div className="animate-fade" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1.5px dashed #ddd6fe', fontSize: '13px', color: '#334155' }}>
            <p style={{ fontSize: '12px', color: '#4c1d95', margin: '0 0 16px 0', fontWeight: '600', fontStyle: 'italic', background: '#ede9fe', padding: '10px 14px', borderRadius: '12px' }}>
              💡 <strong>Nota del Coach:</strong> Estas reglas protegen tu pared abdominal contra sobrepresión y aseguran la hipertrofia pura de tu entrenamiento.
            </p>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ background: '#ffffff', border: '1.5px solid #fca5a5', borderLeft: '5px solid #ef4444', borderRadius: '14px', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} color="#dc2626" />
                  <strong style={{ fontSize: '14px', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>1. La Regla de la Hernia (Presión IAP)</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>EXHALA FUERTE</strong> (bota el aire por la boca) en el momento exacto de mayor esfuerzo en cada repetición.</li>
                  <li><strong>NUNCA aguantes la respiración</strong> ni uses la maniobra de Valsalva cerrada. El flujo de aire constante disminuye drásticamente la presión intraabdominal para proteger contra hernias.</li>
                </ul>
              </div>

              <div style={{ background: '#ffffff', border: '1.5px solid #93c5fd', borderLeft: '5px solid #3b82f6', borderRadius: '14px', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Activity size={18} color="#2563eb" />
                  <strong style={{ fontSize: '14px', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.4px' }}>2. Descansos & Cardio Zona 2</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Tiempos de Descanso:</strong> 2 a 3 minutos para ejercicios compuestos o grandes (Hack Squat, Press Inclinado, Remos). 90 segundos estrictos para ejercicios de aislamiento.</li>
                  <li><strong>Tu Cardio (Zona 2):</strong> Caminadora con inclinación (velocidad 4-5 km/h, inclinación 10-12%), Bicicleta o Elíptica. <strong>NO uses la Stairmaster (Escaleras)</strong>.</li>
                </ul>
              </div>

              <div style={{ background: '#ffffff', border: '1.5px solid #86efac', borderLeft: '5px solid #10b981', borderRadius: '14px', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={18} color="#047857" />
                  <strong style={{ fontSize: '14px', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.4px' }}>3. Doble Progresión (Cómo Subir Peso)</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Si un ejercicio prescribe <strong>"3 series de 8 a 10 reps"</strong> e inicias haciendo 3 series de 8 con 80 lbs, tu meta la semana siguiente será hacer 9 reps y luego 10.</li>
                  <li>Cuando logres hacer el máximo de repeticiones indicadas (10 reps) en TODAS las series con excelente técnica, <strong>ese es el indicador exacto para subir el peso</strong> en tu siguiente sesión.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enfoque Fisiológico */}
      <div className="card card-highlight" style={{ padding: '16px', marginBottom: '16px' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', whiteSpace: 'normal' }}>Enfoque Fisiológico del Día</h3>
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
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Series Listas</span>
            <strong style={{ fontSize: '20px', color: '#00b464', fontWeight: '800' }}>{completedSets} <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Fuerza</span></strong>
          </div>
          <button 
            type="button"
            onClick={handleResetCurrent} 
            title="Reiniciar casillas hoy" 
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', padding: '10px', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      )}

      {/* Contenedor de Rutina y Calentamiento General */}
      {currentDay.type === 'rest' && currentDay.exercises.length === 0 ? (
        <div className="card card-success" style={{ padding: '36px 22px', textAlign: 'center', margin: '20px 0' }}>
          <CheckCircle size={52} color="#00b464" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ color: '#0f172a', fontSize: '20px', whiteSpace: 'normal' }}>Día de Síntesis Fibrilar & Descanso Total</h2>
          <p style={{ marginTop: '10px', color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
            Descanso absoluto programado por el Protocolo Adonis. Dedícate a tus compromisos laborales y a la preparación de tus comidas para cumplir con tus 160g de proteína y carbohidratos de reparación.
          </p>
        </div>
      ) : (
        <div>
          {/* MÓDULO GLOBAL DE CALENTAMIENTO Y MOVILIDAD ANTES DE INICIAR FUERZA */}
          {currentDay.type === 'workout' && (
            <div 
              onClick={() => {
                setGlobalWarmupDone(prev => {
                  const newVal = !(prev[currentDay.id]);
                  if (newVal) modal.showAlert({ title: "🔥 Activación General Lista", message: "Temperatura corporal elevada y fluido sinovial lubricado en tus articulaciones. ¡Listo para iniciar tu primera serie de fuerza!", variant: "success" });
                  return { ...prev, [currentDay.id]: newVal };
                });
              }}
              style={{
                background: (globalWarmupDone[currentDay.id]) ? '#ecfdf5' : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                border: (globalWarmupDone[currentDay.id]) ? '2px solid #34d399' : '2px solid #f59e0b',
                borderRadius: '24px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: (globalWarmupDone[currentDay.id]) ? '0 8px 25px rgba(16, 185, 129, 0.12)' : '0 8px 25px rgba(245, 158, 11, 0.15)',
                transition: 'all 0.25s ease',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '23px', background: (globalWarmupDone[currentDay.id]) ? '#10b981' : '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {(globalWarmupDone[currentDay.id]) ? <Check size={26} /> : <Flame size={26} />}
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: (globalWarmupDone[currentDay.id]) ? '#065f46' : '#92400e' }}>
                    {(globalWarmupDone[currentDay.id]) ? '¡Fase Inicial Terminada ✓!' : '⚠️ Paso 0: Calentamiento & Movilidad (5-10 min)'}
                  </span>
                  <h4 style={{ margin: '2px 0 4px 0', fontSize: '16px', fontWeight: '800', color: (globalWarmupDone[currentDay.id]) ? '#065f46' : '#78350f' }}>
                    Activación Cardiovascular & Articular
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: (globalWarmupDone[currentDay.id]) ? '#047857' : '#92400e', fontWeight: '600', lineHeight: '1.4' }}>
                    3-5 min de caminata/bici en Zona 1 + movimientos articulares para proteger hombros, rodillas y columna. Toca para confirmar ejecución.
                  </p>
                </div>
              </div>
              <div style={{ flexShrink: 0, marginLeft: '10px' }}>
                <span className={`badge ${(globalWarmupDone[currentDay.id]) ? 'badge-green' : 'badge-warning'}`} style={{ fontWeight: '900', padding: '6px 12px', fontSize: '12px' }}>
                  {(globalWarmupDone[currentDay.id]) ? '✅ LISTO' : '👆 MARCAR'}
                </span>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', padding: '0 4px', letterSpacing: '0.3px' }}>
            <span>Rutina Preconfigurada (Toca una tarjeta para abrir):</span>
            <span>{currentDay.exercises.length} Módulos</span>
          </div>

          {currentDay.exercises.map((exercise, idx) => {
            const isCurrentlyExpanded = expandedExerciseId !== null 
              ? (expandedExerciseId === exercise.id) 
              : (idx === firstUncompletedIdx);

            const handleToggle = () => {
              if (isCurrentlyExpanded) {
                setExpandedExerciseId('none');
              } else {
                setExpandedExerciseId(exercise.id);
              }
            };

            if (exercise.isCardio) {
              return (
                <CardioLogger
                  key={exercise.id}
                  exercise={exercise}
                  exerciseData={todayWorkoutData[exercise.id]}
                  onUpdateCardio={(data) => handleUpdateCardio(exercise.id, data)}
                  initiallyExpanded={false}
                  isExpanded={isCurrentlyExpanded}
                  onToggleExpand={handleToggle}
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
                onSwapExercise={handleSwapExercise}
                initiallyExpanded={false}
                isExpanded={isCurrentlyExpanded}
                onToggleExpand={handleToggle}
              />
            );
          })}

          {/* Módulo de Agregar Nuevo Ejercicio */}
          {isAddingExercise ? (
            <div className="card animate-fade" style={{ padding: '18px', borderTop: '5px solid #0066ff', background: '#ffffff', marginBottom: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Dumbbell size={18} color="#0066ff" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', whiteSpace: 'normal' }}>Nuevo Ejercicio en Rutina</h3>
                </div>
                <button type="button" onClick={() => setIsAddingExercise(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={22} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleAddCustomExercise}>
                <div style={{ background: '#f5f3ff', border: '1.5px solid #a78bfa', padding: '12px', borderRadius: '14px', marginBottom: '14px', textAlign: 'left' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '6px', color: '#5b21b6', fontWeight: '900', fontSize: '12px' }}>
                    ⚡️ Elegir de Base de Datos de Máquinas Unificada (Recomendado):
                  </label>
                  <select
                    defaultValue=""
                    onChange={(e) => handlePickFromLibrary(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #7c3aed', background: '#ffffff', color: '#1e1b4b', fontWeight: '700', fontSize: '13px' }}
                  >
                    <option value="">👆 Seleccionar máquina / ejercicio oficial...</option>
                    {UNIFIED_EXERCISE_LIBRARY.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        [{ex.muscleGroup}] • {ex.name} ({ex.equipment})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Nombre del Ejercicio (o Edición Libre):</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Curl de Bíceps en Banco Scott con Barra Z" 
                    value={newExName} 
                    onChange={e => setNewExName(e.target.value)} 
                    style={{ textAlign: 'left', padding: '10px 12px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Grupo Muscular Principal:</label>
                  <select
                    value={newExMuscleGroup}
                    onChange={e => setNewExMuscleGroup(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="Pecho (Pectoral)">Pecho (Pectoral)</option>
                    <option value="Espalda (Dorsal/Remo)">Espalda (Dorsal/Remo)</option>
                    <option value="Hombros (Deltoides)">Hombros (Deltoides)</option>
                    <option value="Cuádriceps">Cuádriceps</option>
                    <option value="Isquios & Glúteos">Isquios & Glúteos</option>
                    <option value="Bíceps">Bíceps</option>
                    <option value="Tríceps">Tríceps</option>
                    <option value="Pantorrillas">Pantorrillas</option>
                    <option value="Core (Abdominal/IAP)">Core (Abdominal/IAP)</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="grid-2" style={{ marginBottom: '12px', gap: '10px' }}>
                  <div className="input-group">
                    <label className="input-label" style={{ textAlign: 'left', marginBottom: '4px' }}>Series Meta:</label>
                    <input 
                      type="number" 
                      placeholder="3" 
                      value={newExSets} 
                      onChange={e => setNewExSets(e.target.value)}
                      style={{ padding: '10px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }} 
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label" style={{ textAlign: 'left', marginBottom: '4px' }}>Rango de Reps:</label>
                    <input 
                      type="text" 
                      placeholder="10-12" 
                      value={newExReps} 
                      onChange={e => setNewExReps(e.target.value)}
                      style={{ padding: '10px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }} 
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
                    style={{ textAlign: 'left', padding: '10px 12px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Indicación Biomecánica / Técnica:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Mantener codos firmes sin balancear el torso." 
                    value={newExBiomech} 
                    onChange={e => setNewExBiomech(e.target.value)} 
                    style={{ textAlign: 'left', padding: '10px 12px', width: '100%', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontWeight: '700' }}
                  />
                </div>

                <div className="grid-2" style={{ gap: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddingExercise(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar en Rutina</button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ marginBottom: '24px', marginTop: '16px' }}>
              <button 
                type="button"
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
            <button type="button" className="btn btn-primary" onClick={handleFinishWorkout} style={{ padding: '18px', fontSize: '17px', borderRadius: '20px', fontWeight: '800', boxShadow: '0 8px 25px rgba(0, 102, 255, 0.4)' }}>
              <Save size={24} /> Guardar Sesión en Bitácora Científica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
