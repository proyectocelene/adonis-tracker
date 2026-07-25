import React, { useState, useEffect } from 'react';
import { HeartPulse, Search, Info, Timer, Gauge, Activity, ChevronDown, ChevronUp, Sparkles, Settings2 } from 'lucide-react';

export default function CardioLogger({ exercise, exerciseData = {}, onUpdateCardio, initiallyExpanded = false }) {
  const [machine, setMachine] = useState(exerciseData.machine || 'Caminadora con Inclinación (Zona 2)');
  const [speed, setSpeed] = useState(exerciseData.speed || '');
  const [incline, setIncline] = useState(exerciseData.incline || '');
  const [duration, setDuration] = useState(exerciseData.duration || parseInt(exercise.reps) || 30);
  const [heartRate, setHeartRate] = useState(exerciseData.heartRate || '');
  const [machineSetup, setMachineSetup] = useState(exerciseData.machineSetup || '');
  const [notes, setNotes] = useState(exerciseData.notes || '');
  const [completed, setCompleted] = useState(!!exerciseData.completed);

  const [isExpanded, setIsExpanded] = useState(initiallyExpanded || !completed);
  const [showBiomech, setShowBiomech] = useState(false);
  const [showSetup, setShowSetup] = useState(!!exerciseData.machineSetup);

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
      machineSetup,
      notes,
      completed,
      ...newFields
    };
    if (newFields.machine !== undefined) setMachine(newFields.machine);
    if (newFields.speed !== undefined) setSpeed(newFields.speed);
    if (newFields.incline !== undefined) setIncline(newFields.incline);
    if (newFields.duration !== undefined) setDuration(newFields.duration);
    if (newFields.heartRate !== undefined) setHeartRate(newFields.heartRate);
    if (newFields.machineSetup !== undefined) setMachineSetup(newFields.machineSetup);
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
    <div className={`card-chip ${completed ? 'completed' : ''}`} style={{ borderLeft: completed ? '6px solid var(--accent-green)' : '6px solid #06b6d4' }}>
      {/* CABECERA LIQUID GLASS SIN CORTES NI PUNTOS SUSPENSIVOS */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: '14px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer',
          background: isExpanded ? 'rgba(236, 254, 255, 0.7)' : 'transparent',
          borderBottom: isExpanded ? '1px solid #a5f3fc' : 'none',
          userSelect: 'none',
          transition: 'all 0.25s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#ecfeff', color: '#0e7490', border: '1px solid #a5f3fc', fontWeight: '800' }}>
              <HeartPulse size={13} style={{ marginRight: '3px' }} /> Aeróbico Zona 2
            </span>
            {completed ? (
              <span className="badge badge-green">✓ Completado</span>
            ) : (
              <span className="badge badge-neutral">{duration} min meta</span>
            )}
            {machineSetup && (
              <span className="badge" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                ⚙️ Equipo Ajustado
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0, whiteSpace: 'normal', lineHeight: '1.3' }}>
            {exercise.name}
          </h3>
        </div>
        
        <div style={{ color: '#0e7490', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* CONTENIDO DESPLEGADO CON ANIMACIÓN FLUIDA */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '16px' }}>
          
          {/* Aviso si no existe sesión anterior / Línea base */}
          {isFirstTime && (
            <div style={{
              background: '#ecfeff',
              border: '1.5px solid #67e8f9',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              color: '#0e7490',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.1)'
            }}>
              <Sparkles size={20} color="#0e7490" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontWeight: '800', color: '#0e7490', marginBottom: '2px' }}>✨ PRIMERA VEZ EN ESTE MÓDULO CARDIO:</strong>
                <span>Anota la velocidad, resistencia y pulsaciones en Zona 2 hoy para guardar tu referencia cardiovascular en el historial.</span>
              </div>
            </div>
          )}

          {/* Sub-Chip de Ajustes y Calibración de Máquina Aeróbica */}
          <div style={{ marginBottom: '12px' }}>
            <div 
              onClick={() => setShowSetup(!showSetup)} 
              className="sub-chip-toggle"
              style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#5b21b6' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings2 size={16} color="#7c3aed" /> ⚙️ Ajuste de Máquina / Asiento y Resistencia
              </span>
              <span>{showSetup ? '▲ Ocultar' : '▼ Mostrar'}</span>
            </div>

            {showSetup && (
              <div className="animate-fade" style={{ 
                background: '#ffffff', 
                border: '1.5px solid #ddd6fe', 
                borderRadius: '16px', 
                padding: '14px', 
                marginBottom: '8px',
                fontSize: '13px'
              }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Anota la calibración y postura en este equipo (Ej: Asiento en nivel 5, Modo colinas Nivel 8):
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Bici asiento Nivel 5, resistencia 8, correa ajustada"
                  value={machineSetup}
                  onChange={(e) => handleUpdate({ machineSetup: e.target.value })}
                  style={{ textAlign: 'left', fontWeight: '600', background: '#f8fafc' }}
                />
              </div>
            )}
          </div>

          {/* Sub-Chip Biomecánico y Técnica Aeróbica */}
          {exercise.biomechanics && (
            <div style={{ marginBottom: '14px' }}>
              <div 
                onClick={() => setShowBiomech(!showBiomech)} 
                className="sub-chip-toggle"
                style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#047857' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={16} color="#059669" /> Indicación Técnica Aeróbica y Respiración
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
                  color: '#334155'
                }}>
                  <p style={{ margin: '0 0 12px 0', lineHeight: '1.5' }}>{exercise.biomechanics}</p>
                  <button className="btn-search" onClick={openSearch} style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '13px' }}>
                    <Search size={15} /> Consultar Postura en Google AI / Images
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Selector de Máquina */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Seleccionar Máquina o Modalidad Aeróbica:
            </label>
            <select 
              value={machine} 
              onChange={(e) => handleUpdate({ machine: e.target.value })}
              style={{ width: '100%', padding: '11px 12px', fontWeight: '700', fontSize: '15px', borderRadius: '12px' }}
            >
              <option value="Caminadora con Inclinación (Zona 2)">🚶‍♂️ Caminadora con Inclinación (Treadmill Incline)</option>
              <option value="Bicicleta Estática (Stationary Bike)">🚴‍♂️ Bicicleta Estática (Stationary Bike)</option>
              <option value="Elíptica Ergometrika (Elliptical)">🏃‍♂️ Elíptica Ergonométrica</option>
              <option value="Remo Ergómetro (Rowing Machine)">🚣‍♂️ Remo Ergómetro</option>
              <option value="Caminata al Aire Libre">🌳 Caminata Moderada al Aire Libre</option>
            </select>
          </div>

          {/* Grid Móvil de Especificaciones */}
          <div className="grid-3" style={{ marginBottom: '14px' }}>
            <div className="input-group">
              <label className="input-label">Velocidad / Ritmo</label>
              <input 
                type="text" 
                placeholder="Ej. 4.8 km/h" 
                value={speed}
                onChange={(e) => handleUpdate({ speed: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Inclinación / Res</label>
              <input 
                type="text" 
                placeholder="Incl. 12%" 
                value={incline}
                onChange={(e) => handleUpdate({ incline: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Pulsaciones (BPM)</label>
              <input 
                type="number" 
                placeholder="Ej. 125" 
                value={heartRate}
                onChange={(e) => handleUpdate({ heartRate: e.target.value })}
              />
            </div>
          </div>

          {/* Duración y Estado de Sesión */}
          <div className="grid-2" style={{ marginBottom: '16px', alignItems: 'center', background: '#f8fafc', padding: '12px 14px', borderRadius: '16px', border: '1.5px solid #cbd5e1' }}>
            <div>
              <label className="input-label" style={{ display: 'block', color: '#0e7490', textAlign: 'left', marginBottom: '6px', fontSize: '11px' }}>⏱️ Tiempo Ejecutado (min)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => handleUpdate({ duration: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', fontWeight: '800', fontSize: '18px', color: '#0e7490', background: '#ffffff' }}
                />
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#64748b' }}>min</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>Confirmar Sesión</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '14px', color: completed ? '#00b464' : '#334155' }}>
                <input 
                  type="checkbox" 
                  className="set-checkbox" 
                  checked={completed}
                  onChange={(e) => handleUpdate({ completed: e.target.checked })}
                />
                <span>{completed ? '¡Listo!' : 'Check'}</span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              📝 Comentarios Clínicos y Sensación (Respiración nasal, fatiga, articulaciones):
            </label>
            <textarea 
              rows={2}
              placeholder="Ej: Mantuve respiración nasal y conversación sin dificultad."
              value={notes}
              onChange={(e) => handleUpdate({ notes: e.target.value })}
              style={{ width: '100%', resize: 'vertical', fontSize: '15px', padding: '12px', borderRadius: '12px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
