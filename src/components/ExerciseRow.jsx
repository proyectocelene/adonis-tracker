import React, { useState, useEffect } from 'react';
import { Info, CheckCircle2, Search, Timer, TrendingUp, Plus, ShieldAlert, Zap, Dumbbell, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function ExerciseRow({ exercise, exerciseData = {}, previousData = {}, onUpdateSet, initiallyExpanded = false }) {
  const defaultSetsCount = parseInt(exercise.sets) || 3;
  
  const [customTotalSets, setCustomTotalSets] = useState(() => {
    const recordedKeys = Object.keys(exerciseData).map(Number).filter(n => !isNaN(n));
    const maxRecorded = recordedKeys.length > 0 ? Math.max(...recordedKeys) : defaultSetsCount;
    return Math.max(defaultSetsCount, maxRecorded);
  });

  const [unit, setUnit] = useState(exerciseData.unit || exercise.defaultUnit || 'lbs');
  
  // Acordeón Principal del Ejercicio (Chip Desplegable iOS)
  const setsArray = Array.from({ length: customTotalSets }, (_, i) => i + 1);
  const completedSetsCount = setsArray.filter(s => exerciseData[s]?.completed).length;
  const isAllCompleted = completedSetsCount === customTotalSets && customTotalSets > 0;

  const [isExpanded, setIsExpanded] = useState(initiallyExpanded || !isAllCompleted);
  // Sub-acordeón para Análisis Biomecánico y Descanso (ahorro extremo de espacio en pantalla)
  const [showBiomech, setShowBiomech] = useState(false);

  // Responde si el componente cambia externamente por enrutado
  useEffect(() => {
    if (initiallyExpanded !== undefined) {
      setIsExpanded(initiallyExpanded);
    }
  }, [initiallyExpanded]);

  const isTime = !!exercise.isTime || (typeof exercise.reps === 'string' && (exercise.reps.includes('s') || exercise.reps.includes('m')));
  const hasPreviousHistory = Object.keys(previousData).some(k => previousData[k]?.completed && !isNaN(parseInt(k)));

  const handleSetChange = (setNumber, field, value) => {
    const currentSetData = exerciseData[setNumber] || {};
    onUpdateSet(setNumber, {
      ...currentSetData,
      unit,
      [field]: value
    });
  };

  const handleUnitToggle = (newUnit, e) => {
    e.stopPropagation();
    setUnit(newUnit);
    setsArray.forEach(setNum => {
      if (exerciseData[setNum]) {
        onUpdateSet(setNum, { ...exerciseData[setNum], unit: newUnit });
      }
    });
  };

  const addExtraSet = () => {
    setCustomTotalSets(prev => prev + 1);
  };

  const openSearch = (e) => {
    if (e) e.stopPropagation();
    const query = exercise.searchQuery || `${exercise.name} proper biomechanical exercise execution`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, '_blank');
  };

  // Algoritmo de Alertas Inteligentes (Cuando hay historial previo)
  const evaluateIntelligentAlert = () => {
    if (!hasPreviousHistory || isTime) return null;

    const prevSetKeys = Object.keys(previousData).filter(k => previousData[k]?.completed && !isNaN(parseInt(k)));
    const repsStr = String(exercise.reps || '');
    const numbers = repsStr.match(/\d+/g)?.map(Number) || [10];
    const targetMax = Math.max(...numbers);
    const targetMin = Math.min(...numbers);

    let allHitTop = true;
    let anyEarlyFail = false;

    prevSetKeys.forEach(key => {
      const pSet = previousData[key];
      const pReps = parseInt(pSet.reps) || 0;
      const pRpe = parseFloat(pSet.rpe) || 8;

      if (pReps < targetMax || pRpe > 9.5) {
        allHitTop = false;
      }
      if (pReps < targetMin && pRpe >= 9.5) {
        anyEarlyFail = true;
      }
    });

    if (allHitTop && prevSetKeys.length >= defaultSetsCount) {
      return {
        type: 'overload',
        bg: '#e6faf1', border: '#10b981', textCol: '#065f46',
        icon: <Zap size={18} style={{ flexShrink: 0, color: '#00b464' }} />,
        title: '⚡ ALERTA INTELIGENTE DE SOBRECARGA:',
        text: `En tu sesión anterior dominaste el tope de reps (${targetMax} reps) con técnica controlada. ¡Indicación de sobrecarga! Sube peso de 2.5% a 5% hoy.`
      };
    }

    if (anyEarlyFail) {
      return {
        type: 'deload',
        bg: '#ffebe9', border: '#ff3b30', textCol: '#991b1b',
        icon: <ShieldAlert size={18} style={{ flexShrink: 0, color: '#ff3b30' }} />,
        title: '⚠️ INDICACIÓN DE REGULACIÓN (DELOAD):',
        text: `Fallo prematuro (@ RPE 10 antes de las ${targetMin} reps) en la sesión anterior. Sugerencia técnica: reducir la carga 5% para resguardar tu Sistema Nervioso Central.`
      };
    }

    return {
      type: 'reference',
      bg: '#f8fafc', border: '#cbd5e1', textCol: '#334155',
      icon: <TrendingUp size={16} style={{ flexShrink: 0, color: 'var(--accent-blue)' }} />,
      title: '📊 Referencia de Carga Previa:',
      text: `Busca superar hoy al menos 1 repetición tu registro anterior o mejorar tu control de RIR al mismo peso.`
    };
  };

  const intelligentAlert = evaluateIntelligentAlert();

  return (
    <div className={`card-chip ${isAllCompleted ? 'completed' : ''}`}>
      {/* CABECERA CHIP DESPLEGABLE (Visible siempre) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: '14px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer',
          background: isExpanded ? 'rgba(241, 245, 249, 0.7)' : 'transparent',
          borderBottom: isExpanded ? '1px solid #cbd5e1' : 'none',
          userSelect: 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
            <span className="badge badge-blue">
              {customTotalSets}x{exercise.reps}
            </span>
            {isAllCompleted ? (
              <span className="badge badge-green">✓ {completedSetsCount}/{customTotalSets} Listo</span>
            ) : (
              <span className="badge badge-neutral">{completedSetsCount}/{customTotalSets} series</span>
            )}
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', whiteSpace: isExpanded ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
            {exercise.name}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isTime && isExpanded && (
            <div style={{ display: 'inline-flex', background: '#e2e8f0', borderRadius: '999px', padding: '2px' }} onClick={e => e.stopPropagation()}>
              <button 
                onClick={(e) => handleUnitToggle('lbs', e)}
                style={{
                  border: 'none',
                  background: unit === 'lbs' ? '#0066ff' : 'transparent',
                  color: unit === 'lbs' ? '#ffffff' : '#64748b',
                  fontSize: '11px', fontWeight: '700', padding: '2px 7px', borderRadius: '999px', cursor: 'pointer'
                }}
              >
                LBS
              </button>
              <button 
                onClick={(e) => handleUnitToggle('kg', e)}
                style={{
                  border: 'none',
                  background: unit === 'kg' ? '#0066ff' : 'transparent',
                  color: unit === 'kg' ? '#ffffff' : '#64748b',
                  fontSize: '11px', fontWeight: '700', padding: '2px 7px', borderRadius: '999px', cursor: 'pointer'
                }}
              >
                KG
              </button>
            </div>
          )}
          <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
            {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </div>
        </div>
      </div>

      {/* CONTENIDO DESPLEGADO DEL EJERCICIO */}
      {isExpanded && (
        <div style={{ padding: '14px' }}>
          
          {/* BANNER AVISO SI ES PRIMERA VEZ / PENDIENTE LÍNEA BASE */}
          {!hasPreviousHistory && (
            <div style={{
              background: '#e6f0ff',
              border: '1px solid #93c5fd',
              borderRadius: '12px',
              padding: '10px 12px',
              marginBottom: '12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              color: '#0369a1',
              fontSize: '12px'
            }}>
              <Sparkles size={18} color="#0066ff" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontWeight: '700', color: '#0066ff' }}>✨ PRIMERA VEZ EN ESTE EJERCICIO:</strong>
                <span>No hay registros históricos previos. Registra tus cargas hoy para establecer tu <strong>Línea Base (Baseline)</strong> de fuerza para tus curvas Epley 1RM.</span>
              </div>
            </div>
          )}

          {/* BANNER DE ALERTAS INTELIGENTES ALGORYTMICAS (Cuando existe historial) */}
          {intelligentAlert && (
            <div style={{
              background: intelligentAlert.bg,
              border: `1px solid ${intelligentAlert.border}`,
              borderLeft: `5px solid ${intelligentAlert.type === 'overload' ? '#00b464' : (intelligentAlert.type === 'deload' ? '#ff3b30' : '#0066ff')}`,
              borderRadius: '12px',
              padding: '10px 12px',
              marginBottom: '12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              fontSize: '12px',
              color: intelligentAlert.textCol
            }}>
              {intelligentAlert.icon}
              <div>
                <strong style={{ fontWeight: '700' }}>{intelligentAlert.title} </strong>
                <span>{intelligentAlert.text}</span>
              </div>
            </div>
          )}

          {/* SUB-CHIP DESPLEGABLE PARA ANÁLISIS BIOMECÁNICO Y DESCANSO */}
          {(exercise.biomechanics || exercise.restTime) && (
            <div>
              <div 
                onClick={() => setShowBiomech(!showBiomech)} 
                className="sub-chip-toggle"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={15} color="#0066ff" /> Ver Análisis Biomecánico y Descanso
                </span>
                <span>{showBiomech ? '▲ Ocultar' : '▼ Mostrar'}</span>
              </div>

              {showBiomech && (
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '14px', 
                  padding: '12px', 
                  marginBottom: '14px',
                  fontSize: '13px',
                  color: '#334155'
                }}>
                  {exercise.restTime && (
                    <div style={{ marginBottom: '8px', display: 'flex', gap: '6px', alignItems: 'center', fontWeight: '700', color: '#0f172a' }}>
                      <Timer size={16} color="#00b464" />
                      <span>Descanso Prescrito: <strong style={{ color: '#00b464' }}>{exercise.restTime}</strong></span>
                    </div>
                  )}
                  {exercise.biomechanics && (
                    <p style={{ fontSize: '12px', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                      <strong>Mecánica & Respiración: </strong>{exercise.biomechanics}
                    </p>
                  )}
                  <button className="btn-search" onClick={openSearch} style={{ width: '100%', justifyContent: 'center' }}>
                    <Search size={14} /> Consultar Postures en Google AI / Images
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LISTA DE SERIES 100% MOBILE-FIRST (Diseño compacto en rejilla táctil) */}
          <div className="sets-grid">
            {setsArray.map((setNum) => {
              const currentSet = exerciseData[setNum] || {};
              const prevSet = previousData[setNum] || {};
              const hasPrevSet = prevSet.weight !== undefined && prevSet.reps !== undefined;
              
              return (
                <div 
                  key={setNum} 
                  className={`set-item-card ${currentSet.completed ? 'completed' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', marginBottom: '2px', width: '100%' }}>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>
                      Serie #{setNum} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>({exercise.reps})</span>
                    </span>
                    {hasPrevSet && (
                      <span style={{ fontSize: '11px', color: '#334155', background: '#e2e8f0', padding: '2px 6px', borderRadius: '6px' }}>
                        ⏮️ Ant: <strong>{prevSet.weight || 0} {prevSet.unit || 'lbs'}</strong> × <strong>{prevSet.reps} reps</strong>
                      </span>
                    )}
                  </div>

                  <div className="input-row-mobile">
                    {!isTime && (
                      <div className="input-group">
                        <span className="input-label">Carga ({unit.toUpperCase()})</span>
                        <input 
                          type="number" 
                          placeholder={hasPrevSet && prevSet.weight ? String(prevSet.weight) : '0'} 
                          value={currentSet.weight !== undefined ? currentSet.weight : (hasPrevSet ? (prevSet.weight || '') : '')}
                          onChange={(e) => handleSetChange(setNum, 'weight', e.target.value)}
                        />
                      </div>
                    )}
                    
                    <div className="input-group">
                      <span className="input-label">{isTime ? 'Tiempo (s)' : 'Reps Real'}</span>
                      <input 
                        type={isTime ? "text" : "number"}
                        placeholder={exercise.reps} 
                        value={currentSet.reps !== undefined ? currentSet.reps : ''}
                        onChange={(e) => handleSetChange(setNum, 'reps', e.target.value)}
                        style={{ fontWeight: currentSet.reps ? '700' : '500' }}
                      />
                    </div>
                    
                    <div className="input-group rpe-select-mobile">
                      <span className="input-label">Esfuerzo (RPE)</span>
                      <select
                        value={currentSet.rpe || '8'}
                        onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                        style={{ padding: '8px 4px', fontSize: '13px' }}
                      >
                        <option value="10">RPE 10 (Fallo)</option>
                        <option value="9.5">RPE 9.5 (0.5 RIR)</option>
                        <option value="9">RPE 9 (1 RIR)</option>
                        <option value="8.5">RPE 8.5 (1-2 RIR)</option>
                        <option value="8">RPE 8 (2 RIR)</option>
                        <option value="7">RPE 7 (3 RIR)</option>
                        <option value="6">RPE 6 (Calentam.)</option>
                      </select>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="input-label" style={{ visibility: 'hidden' }}>OK</span>
                      <input 
                        type="checkbox" 
                        className="set-checkbox"
                        checked={!!currentSet.completed}
                        onChange={(e) => handleSetChange(setNum, 'completed', e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <button 
              onClick={addExtraSet}
              style={{
                background: '#ffffff',
                border: '1px dashed #0066ff',
                color: '#0066ff',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} color="#0066ff" /> + Agregar Serie Adicional
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
