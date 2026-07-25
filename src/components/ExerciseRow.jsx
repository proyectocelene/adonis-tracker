import React, { useState, useEffect } from 'react';
import { Info, Search, Timer, TrendingUp, Plus, ShieldAlert, Zap, Dumbbell, ChevronDown, ChevronUp, Sparkles, Settings2 } from 'lucide-react';

export default function ExerciseRow({ exercise, exerciseData = {}, previousData = {}, onUpdateSet, onUpdateExerciseMeta, initiallyExpanded = false }) {
  const defaultSetsCount = parseInt(exercise.sets) || 3;
  
  const [customTotalSets, setCustomTotalSets] = useState(() => {
    const recordedKeys = Object.keys(exerciseData).map(Number).filter(n => !isNaN(n));
    const maxRecorded = recordedKeys.length > 0 ? Math.max(...recordedKeys) : defaultSetsCount;
    return Math.max(defaultSetsCount, maxRecorded);
  });

  const [unit, setUnit] = useState(exerciseData.unit || exercise.defaultUnit || 'lbs');
  const [machineSetup, setMachineSetup] = useState(exerciseData.machineSetup || '');

  const setsArray = Array.from({ length: customTotalSets }, (_, i) => i + 1);
  const completedSetsCount = setsArray.filter(s => exerciseData[s]?.completed).length;
  const isAllCompleted = completedSetsCount === customTotalSets && customTotalSets > 0;

  const [isExpanded, setIsExpanded] = useState(initiallyExpanded || !isAllCompleted);
  const [showBiomech, setShowBiomech] = useState(false);
  const [showSetup, setShowSetup] = useState(!!exerciseData.machineSetup || !!previousData.machineSetup);

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
    if (e) e.stopPropagation();
    setUnit(newUnit);
    setsArray.forEach(setNum => {
      if (exerciseData[setNum]) {
        onUpdateSet(setNum, { ...exerciseData[setNum], unit: newUnit });
      }
    });
  };

  const handleSetupChange = (val) => {
    setMachineSetup(val);
    if (onUpdateExerciseMeta) {
      onUpdateExerciseMeta({ machineSetup: val, unit });
    } else {
      // Guardar también como meta en set 1 si se requiere
      handleSetChange(1, 'machineSetup', val);
    }
  };

  const addExtraSet = () => {
    setCustomTotalSets(prev => prev + 1);
  };

  const openSearch = (e) => {
    if (e) e.stopPropagation();
    const query = exercise.searchQuery || `${exercise.name} anatomical exercise biomechanics`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, '_blank');
  };

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
        bg: '#e6faf1', border: '#00b464', textCol: '#065f46',
        icon: <Zap size={18} style={{ flexShrink: 0, color: '#00b464' }} />,
        title: '⚡ ALERTA DE SOBRECARGA PROGRESIVA:',
        text: `En tu sesión anterior dominaste el tope de reps (${targetMax} reps) con RPE controlado. ¡Es indicación rigurosa de subir entre 2.5% y 5% la carga hoy!`
      };
    }

    if (anyEarlyFail) {
      return {
        type: 'deload',
        bg: '#ffebe9', border: '#ff3b30', textCol: '#991b1b',
        icon: <ShieldAlert size={18} style={{ flexShrink: 0, color: '#ff3b30' }} />,
        title: '⚠️ INDICACIÓN DE REGULACIÓN (DELOAD):',
        text: `Hubo fallo prematuro al RPE 10 antes del rango mínimo (${targetMin} reps). Sugerencia clínica: reducir 5% el peso hoy para resguardar el Sistema Nervioso Central.`
      };
    }

    return {
      type: 'reference',
      bg: '#f8fafc', border: '#cbd5e1', textCol: '#334155',
      icon: <TrendingUp size={16} style={{ flexShrink: 0, color: 'var(--accent-blue)' }} />,
      title: '📊 Referencia de Carga Previa:',
      text: `Busca superar en al menos 1 repetición tu registro anterior o mejorar tu control del RPE al mismo peso.`
    };
  };

  const intelligentAlert = evaluateIntelligentAlert();
  const prevSetupText = previousData.machineSetup || previousData[1]?.machineSetup || '';

  return (
    <div className={`card-chip ${isAllCompleted ? 'completed' : ''}`}>
      {/* CABECERA LIQUID GLASS SIN CORTES NI PUNTOS SUSPENSIVOS */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: '14px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer',
          background: isExpanded ? 'rgba(241, 245, 249, 0.75)' : 'transparent',
          borderBottom: isExpanded ? '1px solid rgba(203, 213, 225, 0.7)' : 'none',
          userSelect: 'none',
          transition: 'all 0.25s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
            <span className="badge badge-blue">
              <Dumbbell size={11} style={{ marginRight: '2px' }} /> {customTotalSets}x{exercise.reps}
            </span>
            {isAllCompleted ? (
              <span className="badge badge-green">✓ {completedSetsCount}/{customTotalSets} Listo</span>
            ) : (
              <span className="badge badge-neutral">{completedSetsCount}/{customTotalSets} series</span>
            )}
            {prevSetupText && (
              <span className="badge" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                ⚙️ Ajuste Guardado
              </span>
            )}
          </div>
          {/* AQUÍ ESTÁ EL SECRETO: whiteSpace: normal garantiza que todo el título se lea sin puntos suspensivos */}
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0, whiteSpace: 'normal', lineHeight: '1.3' }}>
            {exercise.name}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {!isTime && isExpanded && (
            <div style={{ display: 'inline-flex', background: '#e2e8f0', borderRadius: '999px', padding: '3px' }} onClick={e => e.stopPropagation()}>
              <button 
                onClick={(e) => handleUnitToggle('lbs', e)}
                style={{
                  border: 'none',
                  background: unit === 'lbs' ? '#0066ff' : 'transparent',
                  color: unit === 'lbs' ? '#ffffff' : '#64748b',
                  fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '999px', cursor: 'pointer', transition: 'all 0.2s ease'
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
                  fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '999px', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                KG
              </button>
            </div>
          )}
          <div style={{ color: '#0066ff', display: 'flex', alignItems: 'center' }}>
            {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </div>
        </div>
      </div>

      {/* CONTENIDO DESPLEGADO CON ANIMACIÓN FLUIDA */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '16px' }}>
          
          {/* BANNER PRIMERA VEZ EN ESTE EJERCICIO */}
          {!hasPreviousHistory && (
            <div style={{
              background: '#e6f0ff',
              border: '1.5px solid #93c5fd',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              color: '#0369a1',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.08)'
            }}>
              <Sparkles size={20} color="#0066ff" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontWeight: '800', color: '#0066ff', marginBottom: '2px' }}>✨ PRIMERA VEZ EN ESTE EJERCICIO:</strong>
                <span>No hay registros históricos anteriores. Anota tus pesos y repeticiones hoy para establecer tu <strong>Línea Base (Baseline)</strong> para tus gráficas Epley 1RM.</span>
              </div>
            </div>
          )}

          {/* BANNER DE ALERTAS INTELIGENTES */}
          {intelligentAlert && (
            <div style={{
              background: intelligentAlert.bg,
              border: `1.5px solid ${intelligentAlert.border}`,
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              fontSize: '12px',
              color: intelligentAlert.textCol,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
            }}>
              {intelligentAlert.icon}
              <div>
                <strong style={{ fontWeight: '800', display: 'inline-block' }}>{intelligentAlert.title} </strong>
                <span> {intelligentAlert.text}</span>
              </div>
            </div>
          )}

          {/* SUB-CHIP DE AJUSTES Y PRECONFIGURACIÓN DE MÁQUINA */}
          <div style={{ marginBottom: '12px' }}>
            <div 
              onClick={() => setShowSetup(!showSetup)} 
              className="sub-chip-toggle"
              style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#5b21b6' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings2 size={16} color="#7c3aed" /> ⚙️ Ajustes y Preconfiguración de Máquina / Equipo
              </span>
              <span>{showSetup ? '▲ Ocultar' : '▼ Mostrar'}</span>
            </div>

            {showSetup && (
              <div className="animate-fade" style={{ 
                background: '#ffffff', 
                border: '1.5px solid #ddd6fe', 
                borderRadius: '16px', 
                padding: '14px', 
                marginBottom: '6px',
                fontSize: '13px',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.06)'
              }}>
                {prevSetupText && (
                  <div style={{ marginBottom: '10px', padding: '8px 10px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', fontSize: '12px', color: '#334155' }}>
                    <strong>⏮️ Tu ajuste biomecánico en sesión anterior: </strong>
                    <span style={{ color: '#6d28d9', fontWeight: '700' }}>"{prevSetupText}"</span>
                  </div>
                )}
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Anota la calibración del equipo (Asiento, altura de polea, respaldo o agarre):
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Asiento en hoyo 4, respaldo inclinación 2, agarre neutro ancho"
                  value={machineSetup}
                  onChange={(e) => handleSetupChange(e.target.value)}
                  style={{ textAlign: 'left', fontWeight: '600', background: '#f8fafc' }}
                />
              </div>
            )}
          </div>

          {/* SUB-CHIP BIOMECÁNICO Y TIEMPO DE DESCANSO */}
          {(exercise.biomechanics || exercise.restTime) && (
            <div style={{ marginBottom: '14px' }}>
              <div 
                onClick={() => setShowBiomech(!showBiomech)} 
                className="sub-chip-toggle"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={16} color="#0066ff" /> Ver Análisis Biomecánico y Descanso Prescrito
                </span>
                <span>{showBiomech ? '▲ Ocultar' : '▼ Mostrar'}</span>
              </div>

              {showBiomech && (
                <div className="animate-fade" style={{ 
                  background: '#ffffff', 
                  border: '1.5px solid #cbd5e1', 
                  borderRadius: '16px', 
                  padding: '14px', 
                  fontSize: '13px',
                  color: '#334155',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
                }}>
                  {exercise.restTime && (
                    <div style={{ marginBottom: '10px', display: 'flex', gap: '6px', alignItems: 'center', fontWeight: '800', color: '#0f172a' }}>
                      <Timer size={18} color="#00b464" />
                      <span>Descanso Prescrito entre series: <strong style={{ color: '#00b464', fontSize: '15px' }}>{exercise.restTime}</strong></span>
                    </div>
                  )}
                  {exercise.biomechanics && (
                    <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 12px 0', color: '#334155' }}>
                      <strong>Indicaciones Biomecánicas: </strong>{exercise.biomechanics}
                    </p>
                  )}
                  <button className="btn-search" onClick={openSearch} style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '13px' }}>
                    <Search size={15} /> Consultar Postura en Google AI / Images
                  </button>
                </div>
              )}
            </div>
          )}

          {/* REJILLA DE SERIES MOBILE FIRST PRO */}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px', marginBottom: '2px', width: '100%', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>
                      Serie #{setNum} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>({exercise.reps} meta)</span>
                    </span>
                    {hasPrevSet && (
                      <span style={{ fontSize: '11px', color: '#334155', background: '#e2e8f0', padding: '3px 8px', borderRadius: '8px', fontWeight: '700' }}>
                        ⏮️ Sesión previa: <strong style={{ color: '#0066ff' }}>{prevSet.weight || 0} {prevSet.unit || 'lbs'}</strong> × <strong>{prevSet.reps} reps</strong>
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
                        style={{ fontWeight: currentSet.reps ? '800' : '600' }}
                      />
                    </div>
                    
                    <div className="input-group rpe-select-mobile">
                      <span className="input-label">Esfuerzo (RPE)</span>
                      <select
                        value={currentSet.rpe || '8'}
                        onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                        style={{ padding: '9px 4px', fontSize: '13px', fontWeight: '700' }}
                      >
                        <option value="10">RPE 10 (Fallo)</option>
                        <option value="9.5">RPE 9.5 (0.5 RIR)</option>
                        <option value="9">RPE 9 (1 RIR)</option>
                        <option value="8.5">RPE 8.5 (1-2 RIR)</option>
                        <option value="8">RPE 8 (2 RIR)</option>
                        <option value="7">RPE 7 (3 RIR)</option>
                        <option value="6">RPE 6 (Suave)</option>
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

          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <button 
              onClick={addExtraSet}
              style={{
                background: '#ffffff',
                border: '1.5px dashed #0066ff',
                color: '#0066ff',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={18} color="#0066ff" /> + Agregar Serie Adicional
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
