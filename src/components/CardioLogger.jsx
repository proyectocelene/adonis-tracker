import React, { useState } from 'react';
import { HeartPulse, Search, CheckCircle2, Info, Timer, Gauge, Activity } from 'lucide-react';

export default function CardioLogger({ exercise, exerciseData = {}, onUpdateCardio }) {
  const [machine, setMachine] = useState(exerciseData.machine || 'Caminadora Inclinación (Zona 2)');
  const [speed, setSpeed] = useState(exerciseData.speed || '');
  const [incline, setIncline] = useState(exerciseData.incline || '');
  const [duration, setDuration] = useState(exerciseData.duration || parseInt(exercise.reps) || 30);
  const [heartRate, setHeartRate] = useState(exerciseData.heartRate || '');
  const [notes, setNotes] = useState(exerciseData.notes || '');
  const [completed, setCompleted] = useState(!!exerciseData.completed);

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

  const openSearch = () => {
    const query = exercise.searchQuery || 'zone 2 ergonomic cardio technique';
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, '_blank');
  };

  return (
    <div className={`card ${completed ? 'card-success' : ''}`} style={{ padding: '16px', borderLeft: '4px solid #06b6d4' }}>
      <div className="flex-between" style={{ marginBottom: '10px' }}>
        <div>
          <span className="badge" style={{ background: '#ecfeff', color: '#0e7490', border: '1px solid #a5f3fc', marginBottom: '4px' }}>
            <HeartPulse size={14} /> Módulo Cardiovascular - Zona 2
          </span>
          <h3 style={{ fontSize: '17px', color: '#0f172a' }}>{exercise.name}</h3>
        </div>
        {completed && <CheckCircle2 size={22} color="var(--accent-green)" />}
      </div>

      {/* Instrucciones biomecánicas y clínicas de la Zona 2 */}
      {exercise.biomechanics && (
        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid #cbd5e1', 
          borderRadius: '8px', 
          padding: '10px 12px', 
          marginBottom: '14px',
          fontSize: '12px',
          color: '#334155'
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', fontWeight: '600', color: '#0e7490' }}>
            <Info size={16} /> Indicación Técnica Aeróbica:
          </div>
          <span>{exercise.biomechanics}</span>
        </div>
      )}

      {/* Botón para buscar técnica y postura en Google */}
      <div style={{ marginBottom: '16px' }}>
        <button className="btn-search" onClick={openSearch}>
          <Search size={14} /> Ver Postura y Técnica Ergonomic (Google AI / Images)
        </button>
      </div>

      {/* Selector de Máquina */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
          Seleccionar Máquina o Modalidad Aeróbica:
        </label>
        <select 
          value={machine} 
          onChange={(e) => handleUpdate({ machine: e.target.value })}
          style={{ width: '100%', padding: '10px', fontSize: '15px', fontWeight: '600' }}
        >
          <option value="Caminadora con Inclinación (Zona 2)">🚶‍♂️ Caminadora con Inclinación (Treadmill Incline)</option>
          <option value="Bicicleta Estática (Stationary Bike)">🚴‍♂️ Bicicleta Estática (Stationary Bike)</option>
          <option value="Elíptica Ergonomic (Elliptical)">🏃‍♂️ Elíptica Ergonomic (Elliptical Trainer)</option>
          <option value="Remo Ergómetro (Rowing Machine)">🚣‍♂️ Remo Ergómetro (Rowing Machine)</option>
          <option value="Caminata al Aire Libre">🌳 Caminata a Ritmo Moderado al Aire Libre</option>
        </select>
      </div>

      {/* Especificaciones Técnicas (Grid de 3 columnas en móvil/desktop) */}
      <div className="grid-3" style={{ marginBottom: '12px' }}>
        <div>
          <label className="input-label" style={{ display: 'block' }}>Velocidad / Ritmo</label>
          <input 
            type="text" 
            placeholder="Ej. 4.8 km/h" 
            value={speed}
            onChange={(e) => handleUpdate({ speed: e.target.value })}
            style={{ width: '100%', textAlign: 'center', padding: '8px 6px' }}
          />
        </div>
        <div>
          <label className="input-label" style={{ display: 'block' }}>Inclinación / Nivel</label>
          <input 
            type="text" 
            placeholder="Ej. Incl. 12%" 
            value={incline}
            onChange={(e) => handleUpdate({ incline: e.target.value })}
            style={{ width: '100%', textAlign: 'center', padding: '8px 6px' }}
          />
        </div>
        <div>
          <label className="input-label" style={{ display: 'block' }}>Pulsaciones (BPM)</label>
          <input 
            type="number" 
            placeholder="Ej. 125" 
            value={heartRate}
            onChange={(e) => handleUpdate({ heartRate: e.target.value })}
            style={{ width: '100%', textAlign: 'center', padding: '8px 6px' }}
          />
        </div>
      </div>

      {/* Tiempo y Comentarios */}
      <div className="grid-2" style={{ marginBottom: '14px', alignItems: 'center' }}>
        <div>
          <label className="input-label" style={{ display: 'block', color: '#0e7490' }}>⏱️ Tiempo Prescrito vs Real</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input 
              type="number" 
              value={duration} 
              onChange={(e) => handleUpdate({ duration: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontWeight: '700', fontSize: '18px', color: '#0e7490' }}
            />
            <span style={{ fontWeight: '600', fontSize: '13px', color: '#64748b' }}>min</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label className="input-label" style={{ display: 'block', marginBottom: '6px' }}>Estado de Sesión</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            <input 
              type="checkbox" 
              className="set-checkbox" 
              checked={completed}
              onChange={(e) => handleUpdate({ completed: e.target.checked })}
              style={{ width: '32px', height: '32px' }}
            />
            <span>{completed ? '¡Completado!' : 'Marcar listo'}</span>
          </label>
        </div>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
          📝 Comentarios y Sensación Clínica (Respiración, esfuerzo):
        </label>
        <textarea 
          rows={2}
          placeholder="Ej: Mantuve respiración nasal y conversación sin dificultad. Sin dolor articular en rodillas."
          value={notes}
          onChange={(e) => handleUpdate({ notes: e.target.value })}
          style={{ width: '100%', resize: 'vertical', fontSize: '13px', padding: '8px' }}
        />
      </div>
    </div>
  );
}
