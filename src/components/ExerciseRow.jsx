import React, { useState, useEffect } from 'react';
import { Search, Info, CheckCircle2, Circle, RotateCcw, TrendingUp, Flame, AlertCircle, Sparkles, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { useModal, UnitToggle } from './common/UIComponents';

export default function ExerciseRow({ 
  exercise, 
  exerciseData = {}, 
  previousData = {},
  onUpdateSet,
  onUpdateExerciseMeta,
  initiallyExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand
}) {
  const modal = useModal();
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const [activeTab, setActiveTab] = useState('logger'); // 'logger' or 'technique'
  const [machineSetupInput, setMachineSetupInput] = useState(exerciseData.machineSetup || '');

  useEffect(() => {
    if (exerciseData.machineSetup !== undefined) {
      setMachineSetupInput(exerciseData.machineSetup);
    }
  }, [exerciseData.machineSetup]);

  const totalSets = parseInt(exercise.sets) || 3;
  const targetReps = exercise.reps || '10-12';

  const handleSetChange = (setIndex, field, value) => {
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

  return (
    <div 
      className="card transition-all" 
      style={{ 
        marginBottom: '14px',
        borderLeft: isAllCompleted ? '6px solid #00b464' : (completedSetsCount > 0 ? '6px solid #f59e0b' : '6px solid #0066ff'),
        background: isAllCompleted ? '#f0fdf4' : '#ffffff',
        overflow: 'hidden',
        boxShadow: isExpanded ? '0 12px 30px rgba(0, 102, 255, 0.12)' : '0 4px 15px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Cabecera del Chip iOS (Visible siempre, sin textos cortados) */}
      <div 
        onClick={handleHeaderClick}
        style={{ 
          padding: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          background: isExpanded ? 'rgba(241, 245, 249, 0.6)' : 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '800', 
              color: isAllCompleted ? '#15803d' : '#0f172a',
              whiteSpace: 'normal',
              lineBreak: 'strict',
              lineHeight: '1.35'
            }}>
              {exercise.name}
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', padding: '4px 8px' }}>
              {totalSets} series × {targetReps} reps
            </span>
            {exercise.restTime && (
              <span className="badge" style={{ background: '#f8fafc', color: '#475569', fontSize: '11px', border: '1px solid #e2e8f0', padding: '4px 8px' }}>
                ⏱️ {exercise.restTime}
              </span>
            )}
            <span 
              className={`badge ${isAllCompleted ? 'badge-green' : 'badge-warning'}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isAllCompleted ? '¡Logrado!' : `${completedSetsCount}/${totalSets} listos`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '18px', 
              background: isExpanded ? '#0066ff' : '#f1f5f9', 
              color: isExpanded ? '#ffffff' : '#64748b', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.25s ease'
            }}
            title={isExpanded ? "Colapsar tarjeta" : "Expandir para registrar"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Contenedor Desplegable (Acordeón Exclusivo) */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '16px', borderTop: '1px solid #cbd5e1', background: '#ffffff' }}>
          
          {/* Alerta de Ajuste Biomecánico Anterior */}
          {previousData.machineSetup && (
            <div style={{
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: '12px',
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

          {/* Sub-Navegación de Pestañas (Registro vs Análisis Biomecánico) */}
          <div style={{ 
            display: 'flex', 
            background: '#f1f5f9', 
            borderRadius: '14px', 
            padding: '4px', 
            marginBottom: '16px' 
          }}>
            <button 
              type="button"
              onClick={() => setActiveTab('logger')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                background: activeTab === 'logger' ? '#ffffff' : 'transparent',
                color: activeTab === 'logger' ? '#0f172a' : '#64748b',
                fontWeight: '800',
                fontSize: '13px',
                boxShadow: activeTab === 'logger' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📊 Bitácora de Series
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('technique')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                background: activeTab === 'technique' ? '#0066ff' : 'transparent',
                color: activeTab === 'technique' ? '#ffffff' : '#64748b',
                fontWeight: '800',
                fontSize: '13px',
                boxShadow: activeTab === 'technique' ? '0 2px 8px rgba(0, 102, 255, 0.25)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} /> Técnica & Equipo
            </button>
          </div>

          {activeTab === 'technique' ? (
            /* Sub-Chip Técnico: Biomecánica, Búsqueda AI y Preconfiguración de Máquina */
            <div className="animate-fade">
              <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Info size={18} color="#0066ff" />
                  <strong style={{ color: '#0f172a', fontSize: '14px', fontWeight: '800' }}>Indicación Biomecánica & IAP:</strong>
                </div>
                <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                  {exercise.biomechanics || 'Mantener estabilidad en columna, controlar fase excéntrica en 3 segundos y exhalar en el máximo esfuerzo mecánico.'}
                </p>

                <div className="grid-2" style={{ gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={(e) => handleSearchExercise(e, exercise.searchQuery || exercise.name)}
                    className="btn btn-outline"
                    style={{ fontSize: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Search size={14} color="#0066ff" /> Ver en Google Imágenes
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => handleSearchAI(e, exercise.searchQuery || exercise.name)}
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '10px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Sparkles size={14} /> Guía Google AI
                  </button>
                </div>
              </div>

              {/* Ajuste Biométrico del Equipo */}
              <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Settings2 size={18} color="#6d28d9" />
                  <strong style={{ color: '#4c1d95', fontSize: '14px', fontWeight: '800' }}>Preconfiguración de Máquina / Asiento:</strong>
                </div>
                <p style={{ fontSize: '12px', color: '#5b21b6', margin: '0 0 10px 0' }}>
                  Anota aquí el número de asiento, agujero de polea o ángulo de respaldo para mantener la misma tensión mecánica exactamente en cada sesión:
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text"
                    placeholder="Ej. Asiento Nivel 4, Respaldo B, Agarre Neutro..."
                    value={machineSetupInput}
                    onChange={(e) => setMachineSetupInput(e.target.value)}
                    style={{ flex: 1, fontSize: '13px', padding: '10px 12px', textAlign: 'left', borderRadius: '12px', border: '1.5px solid #cbd5e1' }}
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
            /* Tab Principal de Bitácora de Series */
            <div className="animate-fade">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: totalSets }, (_, index) => {
                  const setNum = index + 1;
                  const currentSet = exerciseData[setNum] || { 
                    weight: previousData[setNum]?.weight || '', 
                    reps: previousData[setNum]?.reps || '', 
                    rpe: previousData[setNum]?.rpe || '8', 
                    completed: false,
                    unit: previousData[setNum]?.unit || exercise.defaultUnit || 'lbs'
                  };

                  const prevSet = previousData[setNum];

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
                          <CheckCircle2 size={30} color="#00b464" />
                        ) : (
                          <Circle size={30} color="#cbd5e1" />
                        )}
                      </button>

                      {/* Inputs de Peso, Reps y RPE */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                          <strong style={{ fontSize: '13px', color: '#0f172a' }}>Serie #{setNum}</strong>
                          {prevSet?.weight ? (
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', background: '#e2e8f0', padding: '2px 8px', borderRadius: '8px' }}>
                              ⏮ Anterior: <strong>{prevSet.weight} {prevSet.unit} x {prevSet.reps || targetReps} reps</strong>
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Meta: {targetReps} reps</span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* Peso */}
                          <div style={{ flex: '1 1 80px', minWidth: '80px' }}>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>Carga</span>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '2px 8px' }}>
                              <input 
                                type="number"
                                placeholder="0"
                                value={currentSet.weight}
                                onChange={(e) => handleSetChange(setNum, 'weight', e.target.value)}
                                style={{ width: '100%', border: 'none', padding: '6px 4px', textAlign: 'center', fontWeight: '800', fontSize: '15px', background: 'transparent', color: '#0066ff' }}
                              />
                            </div>
                          </div>

                          {/* Selector Rápido Lbs/Kg Nativamente diseñado */}
                          <div style={{ paddingTop: '16px', flexShrink: 0 }}>
                            <UnitToggle 
                              value={currentSet.unit || 'lbs'} 
                              onChange={(newUnit) => handleSetChange(setNum, 'unit', newUnit)} 
                            />
                          </div>

                          {/* Reps */}
                          <div style={{ flex: '1 1 70px', minWidth: '65px' }}>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>Reps Logradas</span>
                            <div style={{ background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '2px 8px' }}>
                              <input 
                                type="text"
                                placeholder={targetReps}
                                value={currentSet.reps}
                                onChange={(e) => handleSetChange(setNum, 'reps', e.target.value)}
                                style={{ width: '100%', border: 'none', padding: '6px 4px', textAlign: 'center', fontWeight: '800', fontSize: '15px', background: 'transparent', color: '#0f172a' }}
                              />
                            </div>
                          </div>

                          {/* RPE */}
                          <div style={{ flex: '1 1 70px', minWidth: '65px' }}>
                            <span style={{ fontSize: '10px', color: '#d97706', fontWeight: '800', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>RPE (6-10)</span>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '2px 8px' }}>
                              <input 
                                type="number"
                                step="0.5"
                                min="6"
                                max="10"
                                value={currentSet.rpe}
                                onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                                style={{ width: '100%', border: 'none', padding: '6px 4px', textAlign: 'center', fontWeight: '800', fontSize: '15px', background: 'transparent', color: '#d97706' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
