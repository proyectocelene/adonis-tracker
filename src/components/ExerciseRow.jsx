import React, { useState } from 'react';
import { Info, AlertCircle, CheckCircle2, Search, Timer, TrendingUp, Plus, ShieldAlert, Zap, Dumbbell } from 'lucide-react';

export default function ExerciseRow({ exercise, exerciseData = {}, previousData = {}, onUpdateSet }) {
  const defaultSetsCount = parseInt(exercise.sets) || 3;
  
  // Soporte para añadir series adicionales dinámicamente
  const [customTotalSets, setCustomTotalSets] = useState(() => {
    const recordedKeys = Object.keys(exerciseData).map(Number).filter(n => !isNaN(n));
    const maxRecorded = recordedKeys.length > 0 ? Math.max(...recordedKeys) : defaultSetsCount;
    return Math.max(defaultSetsCount, maxRecorded);
  });

  // Unidad de peso de este ejercicio (lbs o kg)
  const [unit, setUnit] = useState(exerciseData.unit || exercise.defaultUnit || 'lbs');

  const setsArray = Array.from({ length: customTotalSets }, (_, i) => i + 1);
  const isTime = !!exercise.isTime || (typeof exercise.reps === 'string' && (exercise.reps.includes('s') || exercise.reps.includes('m')));

  const handleSetChange = (setNumber, field, value) => {
    const currentSetData = exerciseData[setNumber] || {};
    onUpdateSet(setNumber, {
      ...currentSetData,
      unit,
      [field]: value
    });
  };

  const handleUnitToggle = (newUnit) => {
    setUnit(newUnit);
    // Propagar unidad al estado
    setsArray.forEach(setNum => {
      if (exerciseData[setNum]) {
        onUpdateSet(setNum, { ...exerciseData[setNum], unit: newUnit });
      }
    });
  };

  const addExtraSet = () => {
    setCustomTotalSets(prev => prev + 1);
  };

  const openSearch = () => {
    const query = exercise.searchQuery || `${exercise.name} proper form technique biomechanics`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, '_blank');
  };

  // Verificación de series terminadas
  const isAllCompleted = setsArray.every(s => exerciseData[s]?.completed);

  // Algoritmo Científico de Alertas Inteligentes (Overload / Deload)
  const evaluateIntelligentAlert = () => {
    const prevSetKeys = Object.keys(previousData).filter(k => previousData[k]?.completed && !isNaN(parseInt(k)));
    if (prevSetKeys.length === 0 || isTime) return null;

    // Extraer el tope máximo y mínimo de repeticiones prescriptas
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
        icon: <Zap size={18} style={{ flexShrink: 0 }} />,
        title: '⚡ ALERTA INTELIGENTE DE SOBRECARGA:',
        text: `En tu sesión anterior alcanzaste el tope (${targetMax} reps) en todas las series con buena técnica. ¡Es indicación rigurosa de progresar! Aumenta la carga un 2.5% a 5% hoy.`
      };
    }

    if (anyEarlyFail) {
      return {
        type: 'deload',
        icon: <ShieldAlert size={18} style={{ flexShrink: 0, color: '#e11d48' }} />,
        title: '⚠️ INDICACIÓN DE REGULACIÓN (DELOAD):',
        text: `En la sesión anterior hubo fallo prematuro (@ RPE 10 por debajo de ${targetMin} reps). Sugerencia técnica: reducir la carga en un 5% hoy para recuperar el RIR y proteger el Sistema Nervioso Central.`
      };
    }

    return {
      type: 'reference',
      icon: <TrendingUp size={16} style={{ flexShrink: 0, color: 'var(--accent-blue)' }} />,
      title: '📊 Referencia de Sesión Anterior:',
      text: `Busca superar en al menos 1 repetición tu registro pasado o mejorar el control de tu RPE con el mismo peso.`
    };
  };

  const intelligentAlert = evaluateIntelligentAlert();

  return (
    <div className={`card ${isAllCompleted ? 'card-success' : ''}`} style={{ padding: '16px', marginBottom: '20px' }}>
      {/* Cabecera y Badges */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
          <span className="badge badge-blue">
            <Dumbbell size={12} /> {customTotalSets} series x {exercise.reps}
          </span>
          
          {exercise.restTime && (
            <span className="badge badge-neutral">
              <Timer size={12} /> Descanso: {exercise.restTime}
            </span>
          )}

          {/* Toggle de Unidad (Lbs / Kg) */}
          {!isTime && (
            <div style={{ display: 'inline-flex', background: '#e2e8f0', borderRadius: '999px', padding: '2px', marginLeft: 'auto' }}>
              <button 
                onClick={() => handleUnitToggle('lbs')}
                style={{
                  border: 'none',
                  background: unit === 'lbs' ? '#2563eb' : 'transparent',
                  color: unit === 'lbs' ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  cursor: 'pointer'
                }}
              >
                LBS
              </button>
              <button 
                onClick={() => handleUnitToggle('kg')}
                style={{
                  border: 'none',
                  background: unit === 'kg' ? '#2563eb' : 'transparent',
                  color: unit === 'kg' ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  cursor: 'pointer'
                }}
              >
                KG
              </button>
            </div>
          )}

          {isAllCompleted && <CheckCircle2 size={20} color="var(--accent-green)" style={{ marginLeft: isTime ? 'auto' : 0 }} />}
        </div>
        
        <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: '700' }}>{exercise.name}</h3>
      </div>

      {/* Alertas Inteligentes Algorítmicas */}
      {intelligentAlert && (
        <div 
          className={intelligentAlert.type === 'overload' ? 'card-alert-overload' : ''} 
          style={
            intelligentAlert.type !== 'overload' ? {
              background: intelligentAlert.type === 'deload' ? '#fff1f2' : '#f8fafc',
              border: '1px solid ' + (intelligentAlert.type === 'deload' ? '#fecdd3' : '#cbd5e1'),
              borderLeft: '4px solid ' + (intelligentAlert.type === 'deload' ? '#e11d48' : '#2563eb'),
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              fontSize: '12px',
              color: intelligentAlert.type === 'deload' ? '#9f1239' : '#334155'
            } : {}
          }
        >
          {intelligentAlert.icon}
          <div>
            <strong>{intelligentAlert.title} </strong>
            <span>{intelligentAlert.text}</span>
          </div>
        </div>
      )}
      
      {/* Indicaciones Biomecánicas Clínicas */}
      {exercise.biomechanics && (
        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid #cbd5e1', 
          borderRadius: '8px', 
          padding: '10px 12px', 
          marginBottom: '12px',
          fontSize: '12px',
          color: '#334155'
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', fontWeight: '700', color: '#2563eb' }}>
            <Info size={15} /> Análisis Biomecánico y Ejecución:
          </div>
          <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.4' }}>{exercise.biomechanics}</p>
        </div>
      )}

      {/* Botón de Consulta Visual en Google AI / Images */}
      <div style={{ marginBottom: '14px' }}>
        <button className="btn-search" onClick={openSearch}>
          <Search size={13} /> Consultar Técnica Visual en Google AI / Images
        </button>
      </div>
      
      {/* Lista Mobile-First de Series (Diseño Tarjetas por Serie) */}
      <div className="sets-grid">
        {setsArray.map((setNum) => {
          const currentSet = exerciseData[setNum] || {};
          const prevSet = previousData[setNum] || {};
          const hasPrevious = prevSet.weight !== undefined && prevSet.reps !== undefined;
          
          return (
            <div 
              key={setNum} 
              className={`set-item-card ${currentSet.completed ? 'completed' : ''}`}
            >
              {/* Cabecera del Set con comparación con Sesión Anterior */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                  Serie #{setNum} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>({exercise.reps} meta)</span>
                </span>
                {hasPrevious && (
                  <span style={{ fontSize: '11px', color: '#475569', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                    ⏮️ Ant: <strong>{prevSet.weight || 0} {prevSet.unit || 'lbs'}</strong> × <strong>{prevSet.reps} reps</strong> (@ RPE {prevSet.rpe || '8'})
                  </span>
                )}
              </div>

              {/* Contenedores de inputs adaptados a tacto en móvil */}
              <div style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'flex-end' }}>
                {/* Input Peso */}
                {!isTime && (
                  <div className="input-group">
                    <span className="input-label">Carga ({unit.toUpperCase()})</span>
                    <input 
                      type="number" 
                      placeholder={hasPrevious && prevSet.weight ? String(prevSet.weight) : '0'} 
                      value={currentSet.weight !== undefined ? currentSet.weight : (hasPrevious ? (prevSet.weight || '') : '')}
                      onChange={(e) => handleSetChange(setNum, 'weight', e.target.value)}
                    />
                  </div>
                )}
                
                {/* Input Reps / Tiempo */}
                <div className="input-group">
                  <span className="input-label">{isTime ? 'Duración (s)' : 'Reps Reales'}</span>
                  <input 
                    type={isTime ? "text" : "number"}
                    placeholder={exercise.reps} 
                    value={currentSet.reps !== undefined ? currentSet.reps : ''}
                    onChange={(e) => handleSetChange(setNum, 'reps', e.target.value)}
                    style={{ fontWeight: currentSet.reps ? '700' : '500' }}
                  />
                </div>
                
                {/* Selector RPE */}
                <div className="input-group" style={{ flex: '1.4' }}>
                  <span className="input-label">Esfuerzo (RPE)</span>
                  <select
                    value={currentSet.rpe || '8'}
                    onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                    style={{ background: 'white', padding: '8px 4px', fontSize: '13px' }}
                  >
                    <option value="10">RPE 10 (Fallo absoluto)</option>
                    <option value="9.5">RPE 9.5 (0.5 RIR)</option>
                    <option value="9">RPE 9 (1 rep en recámara)</option>
                    <option value="8.5">RPE 8.5 (1-2 RIR)</option>
                    <option value="8">RPE 8 (2 reps en recámara)</option>
                    <option value="7">RPE 7 (3 reps / Suave)</option>
                    <option value="6">RPE 6 (Calentamiento)</option>
                  </select>
                </div>
                
                {/* Checkbox */}
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

      {/* Botón para añadir series adicionales dinámicamente */}
      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        <button 
          onClick={addExtraSet}
          style={{
            background: 'transparent',
            border: '1px dashed #94a3b8',
            color: '#475569',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Plus size={16} color="var(--accent-blue)" /> + Agregar Serie Adicional a este Ejercicio
        </button>
      </div>

      {isAllCompleted && (
        <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '12px', color: 'var(--accent-green)', fontWeight: '700' }}>
          ✓ Todas las series del ejercicio verificadas
        </div>
      )}
    </div>
  );
}
