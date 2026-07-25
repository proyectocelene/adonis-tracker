import React, { useState, useEffect } from 'react';
import { HeartPulse, Search, CheckCircle2, Info, Timer, Gauge, Activity, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function CardioLogger({ exercise, exerciseData = {}, onUpdateCardio, initiallyExpanded = false }) {
  const [machine, setMachine] = useState(exerciseData.machine || 'Caminadora con Inclinación (Zona 2)');
  const [speed, setSpeed] = useState(exerciseData.speed || '');
  const [incline, setIncline] = useState(exerciseData.incline || '');
  const [duration, setDuration] = useState(exerciseData.duration || parseInt(exercise.reps) || 30);
  const [heartRate, setHeartRate] = useState(exerciseData.heartRate || '');
  const [notes, setNotes] = useState(exerciseData.notes || '');
  const [completed, setCompleted] = useState(!!exerciseData.completed);

  const [isExpanded, setIsExpanded] = useState(initiallyExpanded || !completed);
  const [showBiomech, setShowBiomech] = useState(false);

  useEffect(() => {
    if (initiallyExpanded !== undefined) {
      setIsExpanded(initiallyExpanded);
    }
  }, [initiallyExpanded]);

  const handleUpdate = (newFields) => {
    const updated = {
      machine,
      speed,
      incline,
      duration,
      heartRate,
      notes,
      completed,
      ...newFields
    };
    if (newFields.machine !== undefined) setMachine(newFields.machine);
    if (newFields.speed !== undefined) setSpeed(newFields.speed);
    if (newFields.incline !== undefined) setIncline(newFields.incline);
    if (newFields.duration !== undefined) setDuration(newFields.duration);
    if (newFields.heartRate !== undefined) setHeartRate(newFields.heartRate);
    if (newFields.notes !== undefined) setNotes(newFields.notes);
    if (newFields.completed !== undefined) setCompleted(newFields.completed);

    onUpdateCardio(updated);
  };

  const openSearch = (e) => {
    if (e) e.stopPropagation();
    const query = exercise.searchQuery || 'zone 2 ergonomic cardio technique';
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, '_blank');
  };

  const isFirstTime = !exerciseData.machine;

  return (
    <div className={`card-chip ${completed ? 'completed' : ''}`} style={{ borderLeft: completed ? '5px solid var(--accent-green)' : '5px solid #06b6d4' }}>
      {/* CABECERA CHIP DESPLEGABLE (Siempre visible en pantalla) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: '14px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer',
          background: isExpanded ? 'rgba(236, 254, 255, 0.6)' : 'transparent',
          borderBottom: isExpanded ? '1px solid #a5f3fc' : 'none',
          userSelect: 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#ecfeff', color: '#0e7490', border: '1px solid #a5f3fc' }}>
              <HeartPulse size={12} /> Aerobico Zona 2
            </span>
            {completed ? (
              <span className="badge badge-green">✓ Completada</span>
            ) : (
              <span className="badge badge-neutral">{duration} min meta</span>
            )}
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0, whiteSpace: isExpanded ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {exercise.name}
          </h3>
        </div>
        
        <div style={{ color: '#0e7490', display: 'flex', alignItems: 'center' }}>
          {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </div>
      </div>

      {/* CONTENIDO DESPLEGADO DEL MÓDULO AERÓBICO */}
      {isExpanded && (
        <div style={{ padding: '14px' }}>
          
          {/* Aviso si no existe sesión anterior / Línea base */}
          {isFirstTime && (
            <div style={{
              background: '#ecfeff',
              border: '1px solid #67e8f9',
              borderRadius: '12px',
              padding: '10px 12px',
              marginBottom: '12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              color: '#0e7490',
              fontSize: '12px'
            }}>
              <Sparkles size={18} color="#0e7490" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontWeight: '700', color: '#0e7490' }}>✨ PRIMERA VEZ EN ESTE MÓDULO CARDIO:</strong>
                <span>Anota la velocidad e inclinación tolerable en Zona 2 para guardar tu referencia cardiaca en la bitácora.</span>
              </div>
            </div>
          )}

          {/* Sub-Chip Biomecánico y de Técnica Aeróbica */}
          {exercise.biomechanics && (
            <div>
              <div 
                onClick={() => setShowBiomech(!showBiomech)} 
                className="sub-chip-toggle"
                style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#047857' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={15} color="#059669" /> Indicación Técnica Aeróbica y Respiración
                </span>
                <span>{showBiomech ? '▲ Ocultar' : '▼ Mostrar'}</span>
              </div>

              {showBiomech && (
                <div style={{ 
                  background: '#ffffff', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '14px', 
                  padding: '12px', 
                  marginBottom: '14px',
                  fontSize: '12px',
                  color: '#334155'
                }}>
                  <p style={{ margin: '0 0 10px 0', lineHeight: '1.4' }}>{exercise.biomechanics}</p>
                  <button className="btn-search" onClick={openSearch} style={{ width: '100%', justifyContent: 'center' }}>
                    <Search size={14} /> Consultar Postures en Google AI / Images
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Selector de Máquina */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
              Seleccionar Máquina o Modalidad:
            </label>
            <select 
              value={machine} 
              onChange={(e) => handleUpdate({ machine: e.target.value })}
              style={{ width: '100%', padding: '10px', fontWeight: '700', fontSize: '15px', borderRadius: '10px' }}
            >
              <option value="Caminadora con Inclinación (Zona 2)">🚶‍♂️ Caminadora con Inclinación</option>
              <option value="Bicicleta Estática (Stationary Bike)">🚴‍♂️ Bicicleta Estática (Stationary Bike)</option>
              <option value="Elíptica Ergometrica (Elliptical)">🏃‍♂️ Elíptica Ergonométrica</option>
              <option value="Remo Ergómetro (Rowing Machine)">🚣‍♂️ Remo Ergómetro</option>
              <option value="Caminata al Aire Libre">🌳 Caminata Moderada al Aire Libre</option>
            </select>
          </div>

          {/* Grid Móvil de Especificaciones */}
          <div className="grid-3" style={{ marginBottom: '12px' }}>
            <div className="input-group">
              <label className="input-label" style={{ textAlign: 'left' }}>Velocidad</label>
              <input 
                type="text" 
                placeholder="Ej. 4.8" 
                value={speed}
                onChange={(e) => handleUpdate({ speed: e.target.value })}
                style={{ width: '100%', textAlign: 'center' }}
              />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ textAlign: 'left' }}>Inclinación</label>
              <input 
                type="text" 
                placeholder="Incl. 12%" 
                value={incline}
                onChange={(e) => handleUpdate({ incline: e.target.value })}
                style={{ width: '100%', textAlign: 'center' }}
              />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ textAlign: 'left' }}>Pulsaciones (BPM)</label>
              <input 
                type="number" 
                placeholder="Ej. 125" 
                value={heartRate}
                onChange={(e) => handleUpdate({ heartRate: e.target.value })}
                style={{ width: '100%', textAlign: 'center' }}
              />
            </div>
          </div>

          {/* Duración y Estado de Sesión */}
          <div className="grid-2" style={{ marginBottom: '14px', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <div>
              <label className="input-label" style={{ display: 'block', color: '#0e7490', textAlign: 'left', marginBottom: '4px' }}>⏱️ Tiempo Ejecutado</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => handleUpdate({ duration: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', fontWeight: '700', fontSize: '18px', color: '#0e7490' }}
                />
                <span style={{ fontWeight: '700', fontSize: '13px', color: '#64748b' }}>min</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Confirmar Listo</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', color: completed ? '#00b464' : '#334155' }}>
                <input 
                  type="checkbox" 
                  className="set-checkbox" 
                  checked={completed}
                  onChange={(e) => handleUpdate({ completed: e.target.checked })}
                  style={{ width: '34px', height: '34px' }}
                />
                <span>{completed ? '¡Listo!' : 'Check'}</span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
              📝 Sensación Clínica (Respiración, esfuerzo, articulaciones):
            </label>
            <textarea 
              rows={2}
              placeholder="Ej: Mantuve respiración nasal y conversación sin dificultad."
              value={notes}
              onChange={(e) => handleUpdate({ notes: e.target.value })}
              style={{ width: '100%', resize: 'vertical', fontSize: '14px', padding: '10px', borderRadius: '10px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
