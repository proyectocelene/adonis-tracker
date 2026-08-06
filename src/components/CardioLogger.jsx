import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, CheckCircle2, Info, Timer, Activity, 
  ChevronDown, ChevronUp, Flame, ShieldAlert, Bike, MessageSquare, BookOpen, Search, Video 
} from 'lucide-react';
import { LiquidDropdown } from './common/UIComponents';

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

  const [activeSubTab, setActiveSubTab] = useState('logger'); // 'logger' | 'science'
  const [machine, setMachine] = useState(exerciseData.machine || 'Bicicleta Estática (Bajo Impacto)');
  const [duration, setDuration] = useState(exerciseData.duration || '35');
  const [speed, setSpeed] = useState(exerciseData.speed || 'Resistencia Nivel 5');
  const [incline, setIncline] = useState(exerciseData.incline || 'Sin impacto');
  const [heartRate, setHeartRate] = useState(exerciseData.heartRate || '125');
  const [machineSetup, setMachineSetup] = useState(exerciseData.machineSetup || '');
  const [cardioNotesInput, setCardioNotesInput] = useState(exerciseData.notes || '');
  const [completed, setCompleted] = useState(exerciseData.completed || false);

  const cardioMachines = [
    { value: 'Bicicleta Estática (Bajo Impacto)', label: '🚴‍♂️ Bicicleta Estática Ergómetro (Recomendado 30-40 min)' },
    { value: 'Caminadora Inclinada (Zona 2)', label: '🏃‍♀️ Caminadora Inclinada (10-12% incl / 4.5 km/h)' },
    { value: 'Elíptica de Bajo Impacto', label: '🚶‍♀️ Elíptica de Bajo Impacto Articular' }
  ];

  useEffect(() => {
    onUpdateCardio({
      machine,
      duration: parseFloat(duration) || 0,
      speed,
      incline,
      heartRate: parseInt(heartRate) || 0,
      machineSetup,
      notes: cardioNotesInput,
      completed
    });
  }, [machine, duration, speed, incline, heartRate, machineSetup, cardioNotesInput, completed]);

  const toggleCompleted = (e) => {
    e.stopPropagation();
    setCompleted(!completed);
  };

  const handleHeaderClick = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent("bicicleta estatica zona 2 postura tecnica")}`;
  const youtubeTutorialUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent("como hacer cardio en zona 2 bicicleta estatica explicacion")}`;

  return (
    <div 
      className="card animate-fade" 
      style={{ 
        marginBottom: '16px', 
        borderRadius: '24px',
        background: completed 
          ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
          : 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
        border: completed ? '2.5px solid #10b981' : '2px solid #0284c7',
        boxShadow: completed 
          ? '0 8px 24px rgba(16, 185, 129, 0.18)' 
          : '0 8px 24px rgba(2, 132, 199, 0.15)',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
      }}
    >
      {/* CABECERA VIBRANTE DE CARDIO ZONA 2 */}
      <div 
        onClick={handleHeaderClick}
        style={{ 
          padding: '14px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          background: completed 
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
            : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <HeartPulse size={20} color="#ffffff" style={{ flexShrink: 0 }} />
            <strong style={{ 
              fontSize: '16px', 
              fontWeight: '900', 
              color: '#ffffff',
              lineHeight: '1.3'
            }}>
              {exercise.name || 'Cardio Diario Zona 2 (30-40 min)'}
            </strong>
            {completed && (
              <span style={{ fontSize: '10px', background: '#ffffff', color: '#047857', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
                ✓ Completado
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
              🫀 Zona 2 (120-135 BPM)
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
              🚴 Bajo Impacto
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button 
            type="button"
            onClick={toggleCompleted}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
            title={completed ? "Desmarcar completado" : "Marcar completado"}
          >
            <CheckCircle2 size={32} color={completed ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />
          </button>

          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '12px', 
              background: 'rgba(255, 255, 255, 0.2)', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* CONTENIDO EXPANDIDO ORGANIZADO EN SUBPESTAÑAS */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '14px', background: '#ffffff', width: '100%' }}>
          
          {/* NAVEGACIÓN DE SUBPESTAÑAS INTERNAS DE CARDIO */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '16px', marginBottom: '14px', gap: '4px', width: '100%' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('logger')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'logger' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeSubTab === 'logger' ? '#ffffff' : '#64748b',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'logger' ? '0 4px 10px rgba(2, 132, 199, 0.3)' : 'none'
              }}
            >
              📊 Registro & Tiempos
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('science')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '12px',
                background: activeSubTab === 'science' ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'transparent',
                color: activeSubTab === 'science' ? '#ffffff' : '#64748b',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'science' ? '0 4px 10px rgba(124, 58, 237, 0.3)' : 'none'
              }}
            >
              💡 Ciencia & Directrices
            </button>
          </div>

          {/* SUBPESTAÑA 1: REGISTRO, TIEMPOS Y CAJA DE NOTAS DE CARDIO */}
          {activeSubTab === 'logger' && (
            <div style={{ width: '100%' }}>
              {/* SELECTOR DE MAQUINA AEROBICA */}
              <div style={{ marginBottom: '14px' }}>
                <LiquidDropdown
                  label="MÁQUINA DE BAJO IMPACTO SELECCIONADA:"
                  icon={Bike}
                  options={cardioMachines}
                  value={machine}
                  onChange={(newVal) => setMachine(newVal)}
                />
              </div>

              {/* PARÁMETROS DE TRABAJO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#0f172a', fontWeight: '900' }}>
                    ⏱️ Tiempo (min):
                  </label>
                  <input 
                    type="number" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ width: '100%', textAlign: 'center', fontWeight: '900', padding: '8px 4px', borderRadius: '10px', border: '1.5px solid #0284c7', fontSize: '13px', background: '#ffffff' }} 
                  />
                </div>

                <div>
                  <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#0f172a', fontWeight: '900' }}>
                    ⚙️ Nivel / Incl:
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nivel 5" 
                    value={speed} 
                    onChange={(e) => setSpeed(e.target.value)}
                    style={{ width: '100%', textAlign: 'center', fontWeight: '800', padding: '8px 4px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '12px', background: '#ffffff' }} 
                  />
                </div>

                <div>
                  <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#0f172a', fontWeight: '900' }}>
                    ❤️ Pulsos (BPM):
                  </label>
                  <input 
                    type="number" 
                    placeholder="125" 
                    value={heartRate} 
                    onChange={(e) => setHeartRate(e.target.value)}
                    style={{ width: '100%', textAlign: 'center', fontWeight: '900', color: '#ef4444', padding: '8px 4px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }} 
                  />
                </div>
              </div>

              {/* CALIBRACIÓN Y AJUSTES DE EQUIPO */}
              <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '10px', marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#334155', fontWeight: '900', marginBottom: '4px' }}>
                  ⚙️ Calibración del Equipo Aeróbico:
                </label>
                <input 
                  type="text"
                  placeholder="Ej. Asiento altura #6, resistencia nivel 4..."
                  value={machineSetup}
                  onChange={(e) => setMachineSetup(e.target.value)}
                  style={{ width: '100%', fontSize: '12px', padding: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff', borderRadius: '10px', fontWeight: '600' }}
                />
              </div>

              {/* CAJA DE NOTAS & SENSIBLIDAD DE CARDIO */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '14px', border: '1.5px solid #e2e8f0', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <MessageSquare size={15} color="#7c3aed" />
                  <label style={{ fontSize: '11px', color: '#4c1d95', fontWeight: '900' }}>
                    📝 Comentario & Sensación de Cardio:
                  </label>
                </div>
                <textarea
                  rows={2}
                  placeholder="Registra cómo te sentiste en el cardio (ej. Pulsos estables en 125 BPM, buena sudoración sin fatiga en piernas...)"
                  value={cardioNotesInput}
                  onChange={(e) => setCardioNotesInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: '#ffffff',
                    color: '#0f172a',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          )}

          {/* SUBPESTAÑA 2: CIENCIA & DIRECTRICES FISIOLÓGICAS COMPLETAS */}
          {activeSubTab === 'science' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* BOTONES DE BÚSQUEDA TÉCNICA */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
                <a
                  href={googleImagesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#f8fafc',
                    color: '#1e293b',
                    border: '1.5px solid #cbd5e1',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Search size={14} color="#0284c7" /> Buscar en Google Imágenes
                </a>
                <a
                  href={youtubeTutorialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#fef2f2',
                    color: '#991b1b',
                    border: '1.5px solid #fecaca',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Video size={14} color="#dc2626" /> Tutorial en YouTube
                </a>
              </div>

              {/* DIRECTRICES CIENTÍFICAS */}
              <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Flame size={18} color="#0284c7" />
                  <strong style={{ color: '#0369a1', fontSize: '13px', fontWeight: '900' }}>
                    Directrices Fisiológicas del Cardio Diario:
                  </strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#0c4a6e', lineHeight: '1.4' }}>
                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                    <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px' }}>1. Zona 2 Pura (RER 0.80-0.85):</strong>
                    Esfuerzo moderado conversacional. Quemas ácidos grasos casi exclusivamente sin acumular lactato ni fatigar el Sistema Nervioso Central (SNC).
                  </div>

                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                    <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px' }}>2. Máquinas de Bajo Impacto:</strong>
                    Bicicleta estática, elíptica o caminadora inclinada. Evita correr en asfalto para prevenir microtraumatismos excéntricos en las piernas.
                  </div>

                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                    <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px' }}>3. Déficit Calórico & Proteína:</strong>
                    Déficit moderado (200-500 kcal/día) con 1.6 g/kg de proteína corporal para quemar grasa conservando masa muscular.
                  </div>
                </div>

                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '8px 10px', borderRadius: '10px', color: '#be123c', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11px' }}>
                  <ShieldAlert size={16} color="#be123c" style={{ flexShrink: 0 }} />
                  <span>Control de Fatiga: Si notas que tu fuerza en pesas disminuye, reduce el cardio a 3 o 4 días por semana.</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
