import React, { useState, useEffect } from 'react';
import { Search, Info, CheckCircle2, Circle, RotateCcw, TrendingUp, Flame, AlertCircle, Sparkles, ChevronDown, ChevronUp, Settings2, Plus, Minus, RefreshCw, Layers, ArrowRight, Zap, Check } from 'lucide-react';
import { useModal, UnitToggle, LiquidDropdown } from './common/UIComponents';
import { unifyExerciseWithAI } from '../services/deepseek';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ExerciseRow({ 
  exercise, 
  exerciseData = {}, 
  previousData = {},
  onUpdateSet,
  onUpdateExerciseMeta,
  onSwapExercise,
  initiallyExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand
}) {
  const modal = useModal();
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const [activeTab, setActiveTab] = useState('logger'); // 'logger' or 'technique' or 'swap'
  const [machineSetupInput, setMachineSetupInput] = useState(exerciseData.machineSetup || '');
  const [customSwapInput, setCustomSwapInput] = useState('');
  const [isUnifying, setIsUnifying] = useState(false);
  const [apiKey] = useLocalStorage('coachv2_deepseek_apikey', '');

  useEffect(() => {
    if (exerciseData.machineSetup !== undefined) {
      setMachineSetupInput(exerciseData.machineSetup);
    }
  }, [exerciseData.machineSetup]);

  // Número dinámico de series (por defecto las de la rutina, pero el usuario puede agregar o quitar)
  const totalSets = exerciseData.customSetsCount ? parseInt(exerciseData.customSetsCount) : (parseInt(exercise.sets) || 3);
  const targetReps = exercise.reps || '10-12';

  // Guardar siempre meta información básica al cambiar algo
  const ensureMeta = () => {
    if (!exerciseData.name || !exerciseData.muscleGroup) {
      if (onUpdateExerciseMeta) {
        onUpdateExerciseMeta({
          name: exercise.name,
          muscleGroup: exercise.muscleGroup || 'General',
          customSetsCount: totalSets
        });
      }
    }
  };

  const handleSetChange = (setIndex, field, value) => {
    ensureMeta();
    const currentSet = exerciseData[setIndex] || { 
      weight: previousData[setIndex]?.weight || '', 
      reps: previousData[setIndex]?.reps || '', 
      rpe: previousData[setIndex]?.rpe || '8', 
      completed: false,
      unit: previousData[setIndex]?.unit || exercise.defaultUnit || 'lbs'
    };

    onUpdateSet(setIndex, {
      ...currentSet,
      [field]: value
    });
  };

  const handleSaveMachineSetup = () => {
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ machineSetup: machineSetupInput });
      modal.showAlert({
        title: "✅ Calibración del Equipo Guardada",
        message: `Los ajustes mecánicos ("${machineSetupInput || 'Sin anotación'}") se preservarán automáticamente para tus sesiones futuras de este ejercicio en el Protocolo Adonis.`,
        variant: "success"
      });
    }
  };

  const toggleSetComplete = (setIndex) => {
    ensureMeta();
    const currentSet = exerciseData[setIndex] || { 
      weight: previousData[setIndex]?.weight || '', 
      reps: previousData[setIndex]?.reps || '', 
      rpe: previousData[setIndex]?.rpe || '8', 
      completed: false,
      unit: previousData[setIndex]?.unit || exercise.defaultUnit || 'lbs'
    };

    onUpdateSet(setIndex, {
      ...currentSet,
      completed: !currentSet.completed
    });
  };

  // AGREGAR SERIE DINÁMICA (+1) CON AUTO-COMPLETADO INTELIGENTE
  const handleAddSet = () => {
    const nextSetNumber = totalSets + 1;
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ customSetsCount: nextSetNumber });
    }
    // Intuición de peso: clona exactamente el peso, unidad y reps de la última serie ejecutada
    const lastSet = exerciseData[totalSets] || previousData[totalSets] || {};
    const clonedSet = {
      weight: lastSet.weight || exerciseData[1]?.weight || '',
      reps: lastSet.reps || targetReps.split('-')[0] || '10',
      rpe: lastSet.rpe || '8.5',
      completed: false,
      unit: lastSet.unit || exercise.defaultUnit || 'lbs'
    };
    if (onUpdateSet) {
      onUpdateSet(nextSetNumber, clonedSet);
    }
    modal.showAlert({
      title: `➕ Serie #${nextSetNumber} Añadida`,
      message: `Se añadió una nueva serie al ejercicio y se intuyó automáticamente tu peso (${clonedSet.weight || '0'} ${clonedSet.unit}) de tu serie anterior.`,
      variant: 'info'
    });
  };

  // QUITAR ÚLTIMA SERIE (-1)
  const handleRemoveSet = () => {
    if (totalSets <= 1) {
      modal.showAlert({ title: "Mínimo 1 Serie", message: "Un ejercicio debe tener al menos una serie de trabajo.", variant: "warning" });
      return;
    }
    const targetSetToRemove = totalSets;
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ customSetsCount: targetSetToRemove - 1 });
    }
  };

  // REPETIR PESO INTELIGENTE DE SERIE 1 EN TODAS LAS SERIES (1 CLIC)
  const handleRepeatWeightToAllSets = () => {
    const firstSetWeight = exerciseData[1]?.weight || previousData[1]?.weight;
    const firstSetUnit = exerciseData[1]?.unit || previousData[1]?.unit || exercise.defaultUnit || 'lbs';
    const firstSetReps = exerciseData[1]?.reps || previousData[1]?.reps || targetReps.split('-')[0] || '10';
    
    if (!firstSetWeight) {
      modal.showAlert({ title: "Escribe Peso en Serie #1", message: "Primero introduce el peso de tu Serie #1 para poder replicarlo automáticamente en las demás series.", variant: "warning" });
      return;
    }

    for (let i = 2; i <= totalSets; i++) {
      const current = exerciseData[i] || {};
      onUpdateSet(i, {
        ...current,
        weight: current.weight || firstSetWeight,
        unit: firstSetUnit,
        reps: current.reps || firstSetReps,
        rpe: current.rpe || '8'
      });
    }

    modal.showAlert({
      title: "✨ Intuición Inteligente de Peso Aplicada",
      message: `Se autocompletó tu carga (${firstSetWeight} ${firstSetUnit} x ${firstSetReps} reps) en tus ${totalSets} series del ejercicio sin tener que teclearlo una por una.`,
      variant: "success"
    });
  };

  // TOGGLE CALENTAMIENTO ESPECÍFICO
  const toggleWarmup = () => {
    if (onUpdateExerciseMeta) {
      const newVal = !exerciseData.warmupCompleted;
      onUpdateExerciseMeta({ warmupCompleted: newVal });
      if (newVal) {
        modal.showAlert({
          title: "🔥 Calentamiento Articular Listó",
          message: "Aproximación neuromuscular terminada. ¡Articulaciones lubricadas al 100% para levantar tu peso efectivo con máxima seguridad!",
          variant: "success"
        });
      }
    }
  };

  let completedSetsCount = 0;
  for (let i = 1; i <= totalSets; i++) {
    if (exerciseData[i]?.completed) completedSetsCount++;
  }
  const isAllCompleted = completedSetsCount === totalSets;

  const handleSearchExercise = (e, query) => {
    e.stopPropagation();
    const url = `https://www.google.com/search?q=${encodeURIComponent(query + ' exercise biomechanics posture')}&tbm=isch`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSearchAI = (e, query) => {
    e.stopPropagation();
    const url = `https://www.google.com/search?q=${encodeURIComponent(query + ' execution guide')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleHeaderClick = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Opciones de Intercambio (Equivalencies)
  const swapOptions = (exercise.equivalents || []).map(eq => ({
    value: eq.id,
    label: `${eq.name} (${eq.desc})`,
    obj: eq
  }));

  const handleSelectEquivalent = (selectedVal) => {
    const eqObj = (exercise.equivalents || []).find(x => x.id === selectedVal);
    if (!eqObj) return;

    // Calcular relación inteligente del peso (Ej. Mancuernas 30 lbs * ratio 1.5 -> 45 lbs en máquina)
    const baseWeight = parseFloat(exerciseData[1]?.weight || previousData[1]?.weight || '0');
    const unit = exerciseData[1]?.unit || previousData[1]?.unit || exercise.defaultUnit || 'lbs';
    let predictedWeight = baseWeight > 0 && eqObj.ratio ? Math.round(baseWeight * eqObj.ratio) : null;

    modal.showConfirm({
      title: `🔄 ¿Intercambiar por "${eqObj.name}"?`,
      message: `Este ejercicio equivale biomecánicamente para trabajar el grupo muscular: "${exercise.muscleGroup || 'Principal'}".\n\n🎯 Ventaja Técnica: ${eqObj.desc}\n\n${predictedWeight ? `⚡️ Relación Inteligente de Peso: Como levantabas ${baseWeight} ${unit}, para este nuevo ejercicio sugerimos comenzar con aprox. ${predictedWeight} ${unit} (Ratio x${eqObj.ratio}).` : 'El sistema conservará el mismo grupo muscular para el seguimiento estadístico de sobrecarga progresiva.'}\n\n¿Deseas aplicar el intercambio para el día de hoy?`,
      confirmText: "✨ Sí, Intercambiar Ejercicio",
      cancelText: "Mantener Actual",
      variant: "info",
      onConfirm: () => {
        if (onSwapExercise) {
          onSwapExercise(exercise.id, {
            ...exercise,
            id: exercise.id, // mantenemos id original para slot en rutina o creamos swap
            name: eqObj.name,
            originalName: exercise.name,
            biomechanics: eqObj.desc || exercise.biomechanics,
            swapped: true,
            predictedWeight,
            muscleGroup: exercise.muscleGroup || "General"
          });
        }
      }
    });
  };

  const handleUnifyCustomExercise = async () => {
    if (!customSwapInput || !customSwapInput.trim()) {
      modal.showAlert({ title: "Atención", message: "Escribe o especifica el nombre del ejercicio que deseas realizar en lugar de este.", variant: "warning" });
      return;
    }
    const baseWeight = parseFloat(exerciseData[1]?.weight || previousData[1]?.weight || '0') || 80;
    const unit = exerciseData[1]?.unit || previousData[1]?.unit || exercise.defaultUnit || 'lbs';
    
    setIsUnifying(true);
    try {
      const res = await unifyExerciseWithAI({
        apiKey,
        originalExerciseName: exercise.name,
        candidateName: customSwapInput.trim(),
        muscleGroup: exercise.muscleGroup || "Principal",
        currentWeight: baseWeight
      });
      setIsUnifying(false);

      const predictedVal = Math.round(baseWeight * (res.ratioCargaRecomendada || 1));

      modal.showConfirm({
        title: `🧠 Unificación AI: "${customSwapInput.trim()}"`,
        message: `Evaluación de Inteligencia Artificial para ${exercise.muscleGroup || 'Grupo Principal'}:\n\n✨ ${res.equivalenciaPorcentaje}\n🧬 ID Unificado Cloud: ${res.codigoFuncionUnificada}\n\n💡 Justificación Científica: ${res.justificacionCientifica}\n\n⚡️ Carga Predicha Inteligente: Como levantabas ${baseWeight} ${unit}, la carga recomendada para hoy es de ${res.pesoPredicho} (Ratio x${res.ratioCargaRecomendada}).\n\n¿Deseas aplicar esta unificación biomecánica a tu sesión de hoy?`,
        confirmText: "🚀 Aplicar y Unificar",
        cancelText: "Cancelar",
        variant: "info",
        onConfirm: () => {
          if (onSwapExercise) {
            onSwapExercise(exercise.id, {
              ...exercise,
              id: exercise.id,
              name: customSwapInput.trim(),
              originalName: exercise.name,
              biomechanics: res.justificacionCientifica || exercise.biomechanics,
              swapped: true,
              unifiedFunctionCode: res.codigoFuncionUnificada,
              predictedWeight: predictedVal,
              muscleGroup: exercise.muscleGroup || "General"
            });
          }
          setCustomSwapInput('');
        }
      });
    } catch (err) {
      setIsUnifying(false);
      modal.showAlert({ title: "Error en AI Unificado", message: err.message, variant: "danger" });
    }
  };

  const firstSetWeightKnown = exerciseData[1]?.weight || previousData[1]?.weight;
  const firstSetUnitKnown = exerciseData[1]?.unit || previousData[1]?.unit || exercise.defaultUnit || 'lbs';

  return (
    <div 
      className="card transition-all" 
      style={{ 
        marginBottom: '16px',
        borderLeft: isAllCompleted ? '6px solid #10b981' : (completedSetsCount > 0 ? '6px solid #f59e0b' : '6px solid #0066ff'),
        background: isAllCompleted ? '#f0fdf4' : '#ffffff',
        overflow: 'hidden',
        boxShadow: isExpanded ? '0 14px 35px rgba(0, 102, 255, 0.12)' : '0 4px 15px rgba(0, 0, 0, 0.04)',
        borderRadius: '22px'
      }}
    >
      {/* Cabecera iOS Liquid Glass (Sin textos cortados, con chip del grupo muscular) */}
      <div 
        onClick={handleHeaderClick}
        style={{ 
          padding: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          background: isExpanded ? 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' : 'transparent',
          transition: 'all 0.25s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {exercise.muscleGroup && (
              <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                💪 {exercise.muscleGroup}
              </span>
            )}
            {exercise.swapped && (
              <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px', fontWeight: '800' }}>
                🔄 Intercambiado
              </span>
            )}
          </div>

          <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '17px', 
            fontWeight: '800', 
            color: isAllCompleted ? '#065f46' : '#0f172a',
            whiteSpace: 'normal',
            lineBreak: 'strict',
            lineHeight: '1.35'
          }}>
            {exercise.name}
          </h4>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#eff6ff', color: '#0066ff', fontSize: '12px', padding: '4px 9px', fontWeight: '800' }}>
              {totalSets} series × {targetReps} reps
            </span>
            {exercise.restTime && (
              <span className="badge" style={{ background: '#f8fafc', color: '#475569', fontSize: '11px', border: '1px solid #cbd5e1', padding: '4px 8px', fontWeight: '700' }}>
                ⏱️ {exercise.restTime}
              </span>
            )}
            <span 
              className={`badge ${isAllCompleted ? 'badge-green' : 'badge-warning'}`}
              style={{ fontSize: '11px', padding: '4px 9px', fontWeight: '800' }}
            >
              {isAllCompleted ? '✅ ¡Completado!' : `${completedSetsCount}/${totalSets} listos`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div 
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '19px', 
              background: isExpanded ? '#0066ff' : '#e2e8f0', 
              color: isExpanded ? '#ffffff' : '#475569', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.25s ease'
            }}
            title={isExpanded ? "Colapsar tarjeta" : "Expandir para registrar"}
          >
            {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </div>
        </div>
      </div>

      {/* Contenedor Desplegable (Acordeón) */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '16px', borderTop: '1.5px solid #cbd5e1', background: '#ffffff' }}>
          
          {/* MÓDULO DE CALENTAMIENTO ESPECÍFICO DEL EJERCICIO */}
          {exercise.warmup && (
            <div 
              onClick={toggleWarmup}
              style={{
                background: exerciseData.warmupCompleted ? '#ecfdf5' : '#fffbeb',
                border: exerciseData.warmupCompleted ? '1.5px solid #86efac' : '1.5px solid #fde047',
                borderRadius: '16px',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {exerciseData.warmupCompleted ? <CheckCircle2 size={24} color="#10b981" /> : <Flame size={24} color="#f59e0b" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: exerciseData.warmupCompleted ? '#065f46' : '#92400e', fontWeight: '900', textTransform: 'uppercase' }}>
                    {exerciseData.warmupCompleted ? '🔥 Calentamiento de Aproximado Listo ✓' : '🔥 Calentamiento & Prevención IAP (Tocar para marcar):'}
                  </strong>
                </div>
                <span style={{ fontSize: '12px', color: exerciseData.warmupCompleted ? '#047857' : '#78350f', lineHeight: '1.4', display: 'block', fontWeight: '600' }}>
                  {exercise.warmup}
                </span>
              </div>
            </div>
          )}

          {/* Alerta de Ajuste Biomecánico Anterior */}
          {previousData.machineSetup && (
            <div style={{
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: '14px',
              padding: '10px 14px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '12px',
              color: '#5b21b6',
              fontWeight: '700'
            }}>
              <Settings2 size={18} color="#7c3aed" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ textTransform: 'uppercase', fontSize: '10px', color: '#7c3aed', display: 'block', fontWeight: '800' }}>⏮️ Tu Ajuste Anterior del Equipo:</span>
                "{previousData.machineSetup}"
              </div>
            </div>
          )}

          {/* Sub-Navegación de Pestañas */}
          <div style={{ 
            display: 'flex', 
            background: '#f1f5f9', 
            borderRadius: '16px', 
            padding: '4px', 
            marginBottom: '16px',
            gap: '4px' 
          }}>
            <button 
              type="button"
              onClick={() => setActiveTab('logger')}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: 'none',
                borderRadius: '12px',
                background: activeTab === 'logger' ? '#ffffff' : 'transparent',
                color: activeTab === 'logger' ? '#0f172a' : '#64748b',
                fontWeight: '800',
                fontSize: '12px',
                boxShadow: activeTab === 'logger' ? '0 2px 10px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              📊 Series & Pesos
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('technique')}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: 'none',
                borderRadius: '12px',
                background: activeTab === 'technique' ? '#0066ff' : 'transparent',
                color: activeTab === 'technique' ? '#ffffff' : '#64748b',
                fontWeight: '800',
                fontSize: '12px',
                boxShadow: activeTab === 'technique' ? '0 2px 10px rgba(0, 102, 255, 0.25)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={14} /> Técnica & AI
            </button>

            {swapOptions.length > 0 && (
              <button 
                type="button"
                onClick={() => setActiveTab('swap')}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  border: 'none',
                  borderRadius: '12px',
                  background: activeTab === 'swap' ? '#d97706' : 'transparent',
                  color: activeTab === 'swap' ? '#ffffff' : '#64748b',
                  fontWeight: '800',
                  fontSize: '12px',
                  boxShadow: activeTab === 'swap' ? '0 2px 10px rgba(217, 119, 6, 0.3)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                🔄 Intercambiar
              </button>
            )}
          </div>

          {activeTab === 'swap' ? (
            /* ================= SUB-MÓDULO: INTERCAMBIAR EJERCICIO EQUIVALENTE ================= */
            <div className="animate-fade" style={{ background: '#fffbeb', border: '1.5px solid #fde047', borderRadius: '18px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <RefreshCw size={20} color="#b45309" />
                <strong style={{ fontSize: '15px', color: '#78350f', fontWeight: '900' }}>
                  Intercambio Equivalente • {exercise.muscleGroup || 'Grupo Principal'}
                </strong>
              </div>
              <p style={{ fontSize: '12px', color: '#92400e', margin: '0 0 14px 0', lineHeight: '1.5', fontWeight: '600' }}>
                Si la máquina de tu gimnasio está ocupada o prefieres polea/mancuernas, selecciona un ejercicio con la misma biomecánica. El sistema ajustará la relación inteligente del peso y mantendrá el seguimiento estadístico para tu grupo muscular:
              </p>
              
              <div style={{ marginBottom: '14px' }}>
                <LiquidDropdown
                  label="Seleccionar alternativa equivalente oficial:"
                  value={""}
                  options={[{ value: "", label: "👆 Elige una alternativa del gimnasio..." }, ...swapOptions]}
                  onChange={handleSelectEquivalent}
                />
              </div>

              <div style={{ background: '#f5f3ff', border: '1.5px solid #a78bfa', borderRadius: '16px', padding: '14px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Sparkles size={16} color="#7c3aed" />
                  <strong style={{ fontSize: '13px', color: '#5b21b6', fontWeight: '900' }}>¿Otra alternativa libre o variante de gimnasio?</strong>
                </div>
                <p style={{ fontSize: '11px', color: '#6d28d9', margin: '0 0 10px 0', lineHeight: '1.4', fontWeight: '600' }}>
                  Escribe el ejercicio de reemplazo. La IA evaluará su equivalencia biomecánica, estimará tu ratio de carga (lbs) y lo sincronizará unificadamente en tu Google Sheet:
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={customSwapInput}
                    onChange={(e) => setCustomSwapInput(e.target.value)}
                    placeholder="Ej: Sentadilla en Prensa 45° o Polea..."
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1.5px solid #c4b5fd',
                      background: '#ffffff',
                      color: '#1e1b4b',
                      fontSize: '13px',
                      fontWeight: '700',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleUnifyCustomExercise}
                    disabled={isUnifying}
                    className="btn"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: isUnifying ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isUnifying ? '⏳ Unificando...' : '✨ Unificar con IA'}
                  </button>
                </div>
              </div>

              {exercise.swapped && (
                <div style={{ background: '#dcfce7', color: '#15803d', padding: '10px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                  ✅ Actualmente ejercitando con alternativa: "{exercise.name}". (Original: {exercise.originalName || 'Protocolo base'} • {exercise.unifiedFunctionCode || 'Unificado Cloud'}).
                </div>
              )}
            </div>
          ) : activeTab === 'technique' ? (
            /* ================= SUB-MÓDULO TÉCNICA, AI & EQUIPO ================= */
            <div className="animate-fade">
              <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Info size={18} color="#0066ff" />
                  <strong style={{ color: '#0f172a', fontSize: '14px', fontWeight: '800' }}>Indicación Biomecánica & IAP:</strong>
                </div>
                <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 16px 0', lineHeight: '1.6', fontWeight: '600' }}>
                  {exercise.biomechanics || 'Mantener estabilidad en columna, controlar fase excéntrica en 3 segundos y exhalar en el máximo esfuerzo mecánico.'}
                </p>

                <div className="grid-2" style={{ gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={(e) => handleSearchExercise(e, exercise.searchQuery || exercise.name)}
                    className="btn btn-outline"
                    style={{ fontSize: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '800' }}
                  >
                    <Search size={14} color="#0066ff" /> Ver en Google Imágenes
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => handleSearchAI(e, exercise.searchQuery || exercise.name)}
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '10px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '800' }}
                  >
                    <Sparkles size={14} /> Guía Google AI
                  </button>
                </div>
              </div>

              {/* Ajuste Biometrico del Equipo */}
              <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Settings2 size={18} color="#6d28d9" />
                  <strong style={{ color: '#4c1d95', fontSize: '14px', fontWeight: '800' }}>Preconfiguración de Máquina / Asiento:</strong>
                </div>
                <p style={{ fontSize: '12px', color: '#5b21b6', margin: '0 0 10px 0', fontWeight: '600' }}>
                  Anota aquí el número de asiento, agujero de polea o ángulo de respaldo para mantener la misma tensión mecánica en cada sesión:
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text"
                    placeholder="Ej. Asiento Nivel 4, Respaldo B, Agarre Neutro..."
                    value={machineSetupInput}
                    onChange={(e) => setMachineSetupInput(e.target.value)}
                    style={{ flex: 1, fontSize: '13px', padding: '10px 12px', textAlign: 'left', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700' }}
                  />
                  <button 
                    type="button"
                    onClick={handleSaveMachineSetup}
                    className="btn btn-primary"
                    style={{ background: '#6d28d9', padding: '10px 16px', fontWeight: '800', width: 'auto', borderRadius: '12px' }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= SUB-MÓDULO PRINCIPAL: BITÁCORA DE SERIES, AUTO-FILL & TECLADO NUMÉRICO ================= */
            <div className="animate-fade">
              
              {/* Botón Mágico de Repetición Inteligente de Carga (1 Clic) */}
              {firstSetWeightKnown && totalSets > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={handleRepeatWeightToAllSets}
                    className="btn btn-outline"
                    style={{ background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', gap: '6px', alignItems: 'center', width: 'auto', cursor: 'pointer' }}
                    title="Copia el peso de tu primera serie en las series restantes"
                  >
                    ⚡️ Repetir Peso de Serie #1 ({firstSetWeightKnown} {firstSetUnitKnown}) en Todas
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {Array.from({ length: totalSets }, (_, index) => {
                  const setNum = index + 1;
                  const currentSet = exerciseData[setNum] || { 
                    weight: previousData[setNum]?.weight || (setNum > 1 ? (exerciseData[setNum - 1]?.weight || '') : ''), 
                    reps: previousData[setNum]?.reps || (setNum > 1 ? (exerciseData[setNum - 1]?.reps || '') : ''), 
                    rpe: previousData[setNum]?.rpe || '8.5', 
                    completed: false,
                    unit: previousData[setNum]?.unit || exercise.defaultUnit || 'lbs'
                  };

                  const prevSet = previousData[setNum];
                  // Intuición inteligente: si el campo está vacío al teclear, sugerimos la serie anterior
                  const predictedPlaceholder = prevSet?.weight ? prevSet.weight : (index > 0 ? (exerciseData[index]?.weight || '0') : '0');

                  return (
                    <div 
                      key={setNum}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        background: currentSet.completed ? '#f0fdf4' : '#f8fafc',
                        border: currentSet.completed ? '1.5px solid #22c55e' : '1.5px solid #e2e8f0',
                        borderRadius: '18px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Check de Completado */}
                      <button 
                        type="button"
                        onClick={() => toggleSetComplete(setNum)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                      >
                        {currentSet.completed ? (
                          <CheckCircle2 size={32} color="#10b981" />
                        ) : (
                          <Circle size={32} color="#cbd5e1" />
                        )}
                      </button>

                      {/* Inputs de Peso, Reps y RPE con TECLADO NUMÉRICO NATVO EN MÓVIL */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                          <strong style={{ fontSize: '13px', color: '#0f172a', fontWeight: '900' }}>Serie #{setNum}</strong>
                          {prevSet?.weight ? (
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', background: '#e2e8f0', padding: '2px 8px', borderRadius: '8px' }}>
                              ⏮ Anterior: <strong>{prevSet.weight} {prevSet.unit} x {prevSet.reps || targetReps} reps</strong>
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', background: '#e2e8f0', padding: '2px 8px', borderRadius: '8px' }}>
                              🎯 Meta: {targetReps} reps
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* Peso con Teclado Numérico Decimal Nativa iOS/Android */}
                          <div style={{ flex: '1 1 85px', minWidth: '85px' }}>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>Carga</span>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '2px 8px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                              <input 
                                type="number"
                                inputMode="decimal"
                                pattern="[0-9.,]*"
                                placeholder={predictedPlaceholder}
                                value={currentSet.weight}
                                onChange={(e) => handleSetChange(setNum, 'weight', e.target.value)}
                                style={{ width: '100%', border: 'none', padding: '6px 4px', textAlign: 'center', fontWeight: '800', fontSize: '16px', background: 'transparent', color: '#0066ff' }}
                              />
                            </div>
                          </div>

                          {/* Selector Lbs/Kg */}
                          <div style={{ paddingTop: '16px', flexShrink: 0 }}>
                            <UnitToggle 
                              value={currentSet.unit || 'lbs'} 
                              onChange={(newUnit) => handleSetChange(setNum, 'unit', newUnit)} 
                            />
                          </div>

                          {/* Reps con Teclado Numérico Nativo iOS/Android */}
                          <div style={{ flex: '1 1 75px', minWidth: '70px' }}>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>Reps</span>
                            <div style={{ background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '2px 8px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                              <input 
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder={targetReps.split('-')[0] || '10'}
                                value={currentSet.reps}
                                onChange={(e) => handleSetChange(setNum, 'reps', e.target.value)}
                                style={{ width: '100%', border: 'none', padding: '6px 4px', textAlign: 'center', fontWeight: '800', fontSize: '16px', background: 'transparent', color: '#0f172a' }}
                              />
                            </div>
                          </div>

                          {/* RPE con Teclado Numérico Decimal Nativo iOS/Android */}
                          <div style={{ flex: '1 1 70px', minWidth: '65px' }}>
                            <span style={{ fontSize: '10px', color: '#d97706', fontWeight: '800', display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>RPE</span>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '2px 8px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                              <input 
                                type="number"
                                inputMode="decimal"
                                step="0.5"
                                min="6"
                                max="10"
                                placeholder="8"
                                value={currentSet.rpe}
                                onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                                style={{ width: '100%', border: 'none', padding: '6px 4px', textAlign: 'center', fontWeight: '800', fontSize: '16px', background: 'transparent', color: '#d97706' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BOTONES PARA AGREGAR (+) O QUITAR (-) SERIES AL EJERCICIO */}
              <div className="grid-2" style={{ gap: '10px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                <button
                  type="button"
                  onClick={handleAddSet}
                  className="btn btn-outline"
                  style={{ background: '#eff6ff', color: '#0066ff', border: '1.5px solid #bfdbfe', padding: '10px', borderRadius: '14px', fontWeight: '800', fontSize: '12px', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center', cursor: 'pointer' }}
                >
                  <Plus size={16} /> + Agregar Serie (#{totalSets + 1})
                </button>

                <button
                  type="button"
                  onClick={handleRemoveSet}
                  disabled={totalSets <= 1}
                  className="btn btn-outline"
                  style={{ background: totalSets <= 1 ? '#f1f5f9' : '#fef2f2', color: totalSets <= 1 ? '#94a3b8' : '#dc2626', border: totalSets <= 1 ? '1.5px solid #e2e8f0' : '1.5px solid #fca5a5', padding: '10px', borderRadius: '14px', fontWeight: '800', fontSize: '12px', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center', cursor: totalSets <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  <Minus size={16} /> Quitar Serie (#{totalSets})
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
