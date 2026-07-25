import React, { useState, useEffect } from 'react';
import { HeartPulse, Search, CheckCircle2, Info, Timer, Gauge, Activity, ChevronDown, ChevronUp, Sparkles, Settings2 } from 'lucide-react';

export default function CardioLogger({ 
  exercise, 
  exerciseData = {}, 
  onUpdateCardio,
  initiallyExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand
}) {
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const [machine, setMachine] = useState(exerciseData.machine || 'Caminadora Inclinada (Zona 2)');
  const [duration, setDuration] = useState(exerciseData.duration || '30');
  const [speed, setSpeed] = useState(exerciseData.speed || '4.8 km/h');
  const [incline, setIncline] = useState(exerciseData.incline || '12%');
  const [heartRate, setHeartRate] = useState(exerciseData.heartRate || '125');
  const [machineSetup, setMachineSetup] = useState(exerciseData.machineSetup || '');
  const [completed, setCompleted] = useState(exerciseData.completed || false);

  useEffect(() => {
    onUpdateCardio({
      machine,
      duration: parseFloat(duration) || 0,
      speed,
      incline,
      heartRate: parseInt(heartRate) || 0,
      machineSetup,
      completed
    });
  }, [machine, duration, speed, incline, heartRate, machineSetup, completed]);

  const toggleCompleted = (e) => {
    e.stopPropagation();
    setCompleted(!completed);
  };

  const handleSearchAI = (e) => {
    e.stopPropagation();
    const url = `https://www.google.com/search?q=${encodeURIComponent(machine + ' zone 2 cardio posture safety')}`;
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
        borderLeft: completed ? '6px solid #00b464' : '6px solid #06b6d4',
        background: completed ? '#ecfdf5' : '#ffffff',
        overflow: 'hidden',
        boxShadow: isExpanded ? '0 12px 30px rgba(6, 182, 212, 0.15)' : '0 4px 15px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Cabecera del Chip Cardio (Visible siempre, sin textos cortados) */}
      <div 
        onClick={handleHeaderClick}
        style={{ 
          padding: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          background: isExpanded ? 'rgba(236, 254, 255, 0.6)' : 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <HeartPulse size={18} color="#06b6d4" style={{ flexShrink: 0 }} />
            <h4 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '800', 
              color: completed ? '#047857' : '#0f172a',
              whiteSpace: 'normal',
              lineBreak: 'strict',
              lineHeight: '1.35'
            }}>
              {exercise.name}
            </h4>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#ecfeff', color: '#0e7490', fontSize: '11px', padding: '4px 8px' }}>
              🎯 {machine}
            </span>
            <span className={`badge ${completed ? 'badge-green' : 'badge-warning'}`} style={{ fontSize: '11px', padding: '4px 8px' }}>
              {completed ? '¡Módulo Terminado!' : `${duration} min • Pendiente`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button 
            onClick={toggleCompleted}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
            title={completed ? "Desmarcar" : "Marcar completado"}
          >
            <CheckCircle2 size={28} color={completed ? '#00b464' : '#cbd5e1'} />
          </button>

          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '18px', 
              background: isExpanded ? '#06b6d4' : '#f1f5f9', 
              color: isExpanded ? '#ffffff' : '#64748b', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.25s ease'
            }}
            title={isExpanded ? "Colapsar módulo" : "Expandir y editar Parámetros"}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Contenedor Desplegable (Parámetros y Preconfiguración de Equipo) */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '16px', borderTop: '1px solid #cbd5e1', background: '#ffffff' }}>
          
          {/* Indicación Biocare / Regla de Oro */}
          <div style={{ background: '#ecfeff', border: '1.5px solid #a5f3fc', borderRadius: '16px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Info size={18} color="#0e7490" />
              <strong style={{ color: '#0e7490', fontSize: '14px', fontWeight: '800' }}>Protocolo Zona 2 & Anti-Interferencia:</strong>
            </div>
            <p style={{ fontSize: '12px', color: '#164e63', margin: '0 0 10px 0', lineHeight: '1.5' }}>
              {exercise.biomechanics || 'Evitar el impacto violento (correr) y el esfuerzo extremo (HIIT/Stairmaster) para no disparar la presión intraabdominal ni comprometer el desarrollo muscular.'}
            </p>
            <button 
              onClick={handleSearchAI} 
              className="btn btn-outline"
              style={{ fontSize: '11px', padding: '6px 12px', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', borderColor: '#06b6d4', color: '#0e7490', fontWeight: '800' }}
            >
              <Sparkles size={14} color="#06b6d4" /> Guía AI sobre Respiración en Zona 2
            </button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px', color: '#0e7490', fontWeight: '800' }}>
              Equipo Aeróbico Seleccionado:
            </label>
            <select
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', fontSize: '14px', fontWeight: '800', border: '1.5px solid #cbd5e1', borderRadius: '14px', background: '#fff' }}
            >
              <option value="Caminadora Inclinada (Zona 2)">Caminadora Inclinada (10-12% incl / 4.8 km/h)</option>
              <option value="Bicicleta Estática (Ergómetro)">Bicicleta Estática (Ergómetro de Bajo Impacto)</option>
              <option value="Elíptica de Bajo Impacto">Elíptica de Bajo Impacto Articular</option>
              <option value="Remo Ergómetro Suave">Remo Ergómetro Suave</option>
            </select>
          </div>

          <div className="grid-3" style={{ marginBottom: '14px', gap: '10px' }}>
            <div>
              <label className="input-label" style={{ textAlign: 'left', display: 'block', marginBottom: '4px', fontSize: '11px' }}>Tiempo (min):</label>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                style={{ textAlign: 'center', fontWeight: '800' }} 
              />
            </div>

            <div>
              <label className="input-label" style={{ textAlign: 'left', display: 'block', marginBottom: '4px', fontSize: '11px' }}>Vel / Inclinación:</label>
              <input 
                type="text" 
                placeholder="4.8km/h / 12%" 
                value={speed} 
                onChange={(e) => setSpeed(e.target.value)}
                style={{ textAlign: 'center', fontWeight: '700' }} 
              />
            </div>

            <div>
              <label className="input-label" style={{ textAlign: 'left', display: 'block', marginBottom: '4px', fontSize: '11px' }}>Pulsos (BPM):</label>
              <input 
                type="number" 
                placeholder="125" 
                value={heartRate} 
                onChange={(e) => setHeartRate(e.target.value)}
                style={{ textAlign: 'center', fontWeight: '800', color: '#ff3b30' }} 
              />
            </div>
          </div>

          {/* Ajustes del Equipo de Cardio */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Settings2 size={16} color="#475569" />
              <strong style={{ fontSize: '12px', color: '#334155' }}>Ajustes del Equipo (Altura de asiento de bici, perfil, etc.):</strong>
            </div>
            <input 
              type="text"
              placeholder="Ej. Asiento de bicicleta en número 7, resistencia nivel 4..."
              value={machineSetup}
              onChange={(e) => setMachineSetup(e.target.value)}
              style={{ width: '100%', fontSize: '12px', padding: '10px', textAlign: 'left', border: '1px solid #cbd5e1', background: '#ffffff' }}
            >
            </input>
          </div>

        </div>
      )}
    </div>
  );
}
