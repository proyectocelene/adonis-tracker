import React, { useState, useEffect } from 'react';
import { Footprints, Moon, ShieldAlert, Heart, CheckCircle2, BatteryCharging, Sparkles, Save } from 'lucide-react';

export default function SundayRecoveryDashboard({
  selectedDateKey,
  currentWeek,
  onSaveSundayLog,
  historySession,
  isViewingHistory
}) {
  const [steps, setSteps] = useState(() => {
    return historySession?.neatSteps || 8500;
  });
  const [sleepHours, setSleepHours] = useState(() => {
    return historySession?.sleepHours || 8;
  });
  const [energyLevel, setEnergyLevel] = useState(() => {
    return historySession?.energyLevel || 'Óptimo';
  });
  const [recoveryNotes, setRecoveryNotes] = useState(() => {
    return historySession?.recoveryNotes || '';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (historySession) {
      if (historySession.neatSteps) setSteps(historySession.neatSteps);
      if (historySession.sleepHours) setSleepHours(historySession.sleepHours);
      if (historySession.energyLevel) setEnergyLevel(historySession.energyLevel);
      if (historySession.recoveryNotes) setRecoveryNotes(historySession.recoveryNotes);
    }
  }, [historySession]);

  const targetSteps = 10000;
  const stepsProgress = Math.min(100, Math.round((steps / targetSteps) * 100));

  const handleSave = async () => {
    if (onSaveSundayLog) {
      await onSaveSundayLog({
        neatSteps: Number(steps) || 0,
        sleepHours: Number(sleepHours) || 0,
        energyLevel,
        recoveryNotes
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
      
      {/* ALERTA CLÍNICA BIOMECÁNICA */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: 'var(--shadow-ios)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            background: 'var(--accent-blue-light)',
            color: 'var(--accent-blue)',
            padding: '10px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={24} color="var(--accent-blue)" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--accent-blue)' }}>
              Directriz Clínica • Día de Adaptación
            </span>
            <h3 style={{ margin: '2px 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              Blindaje del Sistema Nervioso Central (SNC)
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--accent-amber)' }}>Sin cardio extenuante ni cargas pesadas.</strong> El músculo no crece durante el entrenamiento, sino en la fase de reposo profundo. Hoy tus miofibrillas reparan microdesgarros, los depósitos de glucógeno se supercompensan y el sistema nervioso autónomo reestablece su tono parasimpático.
            </p>
          </div>
        </div>
      </div>

      {/* TRACKER DE NEAT / PASOS */}
      <div className="card" style={{ padding: '18px', borderRadius: '20px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-ios)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)', padding: '8px', borderRadius: '12px' }}>
              <Footprints size={18} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                Tracker NEAT (Termogénesis sin Fatiga)
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Meta saludable: 8,000 – 10,000 pasos ligeros (caminar, pasear)
              </span>
            </div>
          </div>
          <span className="font-mono-tech" style={{ fontSize: '17px', fontWeight: '700', color: steps >= 8000 ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }}>
            {Number(steps).toLocaleString()} pasos
          </span>
        </div>

        {/* BARRA DE PROGRESO */}
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-secondary)', borderRadius: '6px', overflow: 'hidden', marginBottom: '14px', border: '1px solid var(--border-subtle)' }}>
          <div style={{
            width: `${stepsProgress}%`,
            height: '100%',
            background: steps >= 8000 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="range"
            min="0"
            max="20000"
            step="250"
            value={steps}
            disabled={isViewingHistory}
            onChange={(e) => setSteps(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#0284c7', cursor: 'pointer' }}
          />
          <input 
            type="number"
            min="0"
            max="50000"
            step="100"
            value={steps}
            disabled={isViewingHistory}
            onChange={(e) => setSteps(Math.max(0, Number(e.target.value)))}
            className="font-mono-tech"
            style={{
              width: '85px',
              padding: '6px 8px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-secondary)',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: '700',
              textAlign: 'center'
            }}
          />
        </div>
      </div>

      {/* MÉTRICAS DE RECUPERACIÓN BIOLÓGICA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        
        {/* SUEÑO */}
        <div className="card" style={{ padding: '14px', borderRadius: '18px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Moon size={15} color="#6366f1" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Sueño Nocturno</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="number"
              step="0.5"
              min="4"
              max="14"
              value={sleepHours}
              disabled={isViewingHistory}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="font-mono-tech"
              style={{
                width: '65px',
                padding: '6px 8px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-secondary)',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: '700',
                textAlign: 'center'
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>horas</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            {sleepHours >= 8 ? 'Pico de GH y testosterona' : 'Priorizar descanso reparador'}
          </span>
        </div>

        {/* ENERGÍA PERCIBIDA */}
        <div className="card" style={{ padding: '14px', borderRadius: '18px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <BatteryCharging size={15} color="var(--accent-emerald)" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Sensación SNC</span>
          </div>
          <select
            value={energyLevel}
            disabled={isViewingHistory}
            onChange={(e) => setEnergyLevel(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-secondary)',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            <option value="Óptimo">Óptimo / Fresco</option>
            <option value="Bueno">Bueno / Estable</option>
            <option value="Fatigado">Fatigado / Pesado</option>
            <option value="Dolor Articular">Dolor Articular</option>
          </select>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Estado de batería biológica
          </span>
        </div>
      </div>

      {/* NOTAS DE BIENESTAR */}
      <div className="card" style={{ padding: '14px', borderRadius: '18px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
          Notas de Descanso / Hidratación / Nutrición:
        </span>
        <textarea
          rows={2}
          value={recoveryNotes}
          disabled={isViewingHistory}
          placeholder="Ej: Caminata 40 min por el parque, buena hidratación, comidas ricas en carbohidratos complejos..."
          onChange={(e) => setRecoveryNotes(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-secondary)',
            color: 'var(--text-main)',
            fontSize: '12px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            resize: 'none'
          }}
        />
      </div>

      {/* BOTÓN GUARDAR RECUPERACIÓN */}
      {!isViewingHistory && (
        <button
          type="button"
          className="tactile-btn"
          onClick={handleSave}
          style={{
            background: savedSuccess ? '#10b981' : 'var(--accent-blue)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '12px 20px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 size={16} /> Registro de Recuperación Guardado
            </>
          ) : (
            <>
              <Save size={16} /> Guardar Registro de Descanso
            </>
          )}
        </button>
      )}

    </div>
  );
}
