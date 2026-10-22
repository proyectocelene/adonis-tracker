import React, { useState, useEffect } from 'react';
import { 
  Save, Trash2, Settings2, ChevronUp, ChevronDown, 
  Loader2, Cpu, BookOpen, Copy, Layers, RefreshCw, Sparkles, Flame, Share2, Download,
  Bot, Watch, Check, X
} from 'lucide-react';

export default function WorkoutFooterControls({
  handleFinishWorkout,
  completedSets = 0,
  isViewingHistory,
  handleClearCurrentDraft,
  todayWorkoutData = {},
  selectedDateKey = '',
  showSecondaryTools,
  setShowSecondaryTools,
  handleOptimizeWithMath,
  isAnalyzingAI,
  setShowGlosarioModal,
  handleCopyRoutineForCoach,
  handleCopyWorkoutCard,
  handleCopySessionForAI,
  setShowRoutineBuilder,
  handleResetToOfficialRoutine,
  handleResetAllDaysToOfficial,
  baseDay = {},
  calories = null,
  onExportTCX = null,
  onExportJSON = null,
  userSmartwatchKcal = null,
  onSetSmartwatchKcal = null,
  isWatchModalOpen = undefined,
  setIsWatchModalOpen = null
}) {
  const [internalWatchModal, setInternalWatchModal] = useState(false);
  const showWatchModal = isWatchModalOpen !== undefined ? isWatchModalOpen : internalWatchModal;
  const setShowWatchModal = setIsWatchModalOpen || setInternalWatchModal;

  const cleanStr = (val) => {
    if (val === null || val === undefined || val === 'null' || val === 'undefined') return '';
    return String(val);
  };

  const [watchInput, setWatchInput] = useState(() => {
    if (typeof userSmartwatchKcal === 'object') return cleanStr(userSmartwatchKcal?.watchKcal);
    return cleanStr(userSmartwatchKcal);
  });
  const [watchHrAvgInput, setWatchHrAvgInput] = useState(() => {
    return typeof userSmartwatchKcal === 'object' ? cleanStr(userSmartwatchKcal?.hrAvg) : '';
  });
  const [watchHrMaxInput, setWatchHrMaxInput] = useState(() => {
    return typeof userSmartwatchKcal === 'object' ? cleanStr(userSmartwatchKcal?.hrMax) : '';
  });
  const [watchHrRestInput, setWatchHrRestInput] = useState(() => {
    return typeof userSmartwatchKcal === 'object' ? cleanStr(userSmartwatchKcal?.hrRest) : '';
  });

  useEffect(() => {
    if (showWatchModal) {
      if (typeof userSmartwatchKcal === 'object') {
        setWatchInput(cleanStr(userSmartwatchKcal?.watchKcal));
        setWatchHrAvgInput(cleanStr(userSmartwatchKcal?.hrAvg));
        setWatchHrMaxInput(cleanStr(userSmartwatchKcal?.hrMax));
        setWatchHrRestInput(cleanStr(userSmartwatchKcal?.hrRest));
      } else {
        setWatchInput(cleanStr(userSmartwatchKcal));
      }
    }
  }, [showWatchModal, userSmartwatchKcal]);
  const hasAnyDraftData = completedSets > 0 || Object.values(todayWorkoutData || {}).some(ex => {
    if (!ex) return false;
    return Object.keys(ex).some(k => !isNaN(parseInt(k)) && (ex[k]?.weight || ex[k]?.reps || ex[k]?.completed));
  });

  return (
    <>
      {/* TARJETA DE GASTO ENERGÉTICO CIENTÍFICO EN TIEMPO REAL */}
      {calories && (calories.totalKcal > 0 || completedSets > 0) && (
        <div style={{
          marginTop: '12px',
          marginBottom: '10px',
          padding: '14px 16px',
          borderRadius: '20px',
          background: 'var(--accent-amber-subtle)',
          border: '1px solid var(--accent-amber)',
          boxShadow: 'var(--shadow-ios-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Flame size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--accent-amber)', fontWeight: '900', display: 'block' }}>
                  Gasto Calórico Estimado
                </strong>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Trabajo mecánico • Pausas ATP • EPOC
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {calories.isBlended && (
                <span className="badge" style={{ background: '#7c3aed', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px' }}>
                  ⌚ Integrado
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  if (typeof userSmartwatchKcal === 'object') {
                    setWatchInput(userSmartwatchKcal?.watchKcal ? String(userSmartwatchKcal.watchKcal) : '');
                    setWatchHrAvgInput(userSmartwatchKcal?.hrAvg ? String(userSmartwatchKcal.hrAvg) : '');
                    setWatchHrMaxInput(userSmartwatchKcal?.hrMax ? String(userSmartwatchKcal.hrMax) : '');
                    setWatchHrRestInput(userSmartwatchKcal?.hrRest ? String(userSmartwatchKcal.hrRest) : '');
                  } else {
                    setWatchInput(userSmartwatchKcal ? String(userSmartwatchKcal) : '');
                  }
                  setShowWatchModal(true);
                }}
                style={{
                  background: userSmartwatchKcal ? 'var(--accent-amber-subtle)' : 'var(--bg-surface-secondary)',
                  border: '1px solid var(--accent-amber)',
                  borderRadius: '10px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: 'var(--accent-amber)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Watch size={13} /> {calories.isHeartRateCalibrated ? `❤️ ${calories.watchHrAvg} bpm` : (userSmartwatchKcal ? '⌚ Calibrado' : 'Calibrar Reloj')}
              </button>
              <span className="badge" style={{ background: 'var(--accent-amber)', color: '#000000', fontSize: '13px', fontWeight: '900', padding: '4px 10px', borderRadius: '12px' }}>
                🔥 {calories.displayKcal || calories.totalKcal} kcal
              </span>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: calories.cardioKcal > 0 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', 
            gap: '8px', 
            background: 'var(--bg-card)', 
            padding: '8px 10px', 
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--text-main)',
            fontWeight: '700'
          }}>
            <div>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>🏋️ Fuerza</span>
              <strong>{calories.strengthKcal} kcal</strong>
            </div>
            {calories.cardioKcal > 0 && (
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>🚴 Cardio Z2</span>
                <strong>{calories.cardioKcal} kcal</strong>
              </div>
            )}
            <div>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>⚡ EPOC Post</span>
              <strong>+{calories.epocKcal} kcal</strong>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN PRINCIPAL DE GUARDAR ENTRENAMIENTO Y LIMPIAR */}
      <div style={{ marginTop: '4px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleFinishWorkout} 
          style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '20px', fontWeight: '900', boxShadow: '0 8px 24px rgba(0, 102, 255, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Save size={22} /> Guardar Sesión en Bitácora
        </button>

        {completedSets > 0 && onExportTCX && (
          <button 
            type="button" 
            onClick={onExportTCX}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '13px',
              borderRadius: '16px',
              fontWeight: '900',
              background: 'var(--accent-emerald-subtle)',
              color: 'var(--accent-emerald)',
              border: '1px solid var(--accent-emerald)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Share2 size={16} /> 📤 Sincronizar / Exportar a Google Fit / Salud (.TCX)
          </button>
        )}

        {completedSets > 0 && handleCopyWorkoutCard && (
          <button 
            type="button" 
            onClick={handleCopyWorkoutCard}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '13px',
              borderRadius: '16px',
              fontWeight: '900',
              background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
              border: '1px solid var(--accent-blue)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Copy size={16} /> 📋 Copiar Workout Card (Resumen para Notas / Chat)
          </button>
        )}

        {completedSets > 0 && handleCopySessionForAI && (
          <button 
            type="button" 
            onClick={handleCopySessionForAI}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '13px',
              borderRadius: '16px',
              fontWeight: '900',
              background: 'rgba(124, 58, 237, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(109, 40, 217, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            <Bot size={18} color="#c084fc" /> 🤖 Copiar Prompt para IA (ChatGPT / Gemini / Claude)
          </button>
        )}

        {(completedSets > 0 || hasAnyDraftData) && (onExportTCX || onExportJSON) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {onExportTCX && (
              <button
                type="button"
                onClick={onExportTCX}
                style={{
                  padding: '11px 8px',
                  fontSize: '11.5px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  background: 'var(--accent-blue-light)',
                  color: 'var(--accent-blue)',
                  border: '1px solid var(--accent-blue)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Share2 size={14} /> 📥 Exportar TCX
              </button>
            )}
            {onExportJSON && (
              <button
                type="button"
                onClick={onExportJSON}
                style={{
                  padding: '11px 8px',
                  fontSize: '11.5px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  background: 'var(--accent-emerald-subtle)',
                  color: 'var(--accent-emerald)',
                  border: '1px solid var(--accent-emerald)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} /> 💾 Exportar JSON
              </button>
            )}
          </div>
        )}

        {hasAnyDraftData && (
          <button 
            type="button" 
            onClick={handleClearCurrentDraft}
            style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '14px', fontWeight: '800', background: 'var(--accent-red-subtle)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Trash2 size={14} /> Descartar / Limpiar Casillas Marcadas ({isViewingHistory ? selectedDateKey : 'Hoy'})
          </button>
        )}
      </div>


      {/* MENÚ SECUNDARIO DE HERRAMIENTAS */}
      <div className="card" style={{ padding: '14px', marginBottom: '20px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          onClick={() => setShowSecondaryTools(!showSecondaryTools)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '4px 0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings2 size={18} color="var(--accent-blue)" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>🛠️ Herramientas Secundarias & Ajustes</span>
          </div>
          {showSecondaryTools ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </button>

        {showSecondaryTools && (
          <div className="animate-fade" style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              type="button"
              onClick={handleOptimizeWithMath}
              disabled={isAnalyzingAI}
              className="btn btn-primary"
              style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {isAnalyzingAI ? <Loader2 size={16} className="animate-spin" /> : <Cpu size={16} />}
              {isAnalyzingAI ? 'Calculando...' : '🧠 Optimizar (Epley Math)'}
            </button>

            <button
              type="button"
              onClick={() => setShowGlosarioModal(true)}
              style={{ width: '100%', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <BookOpen size={16} /> 📖 Ver Glosario & Guía Técnica
            </button>

            <button 
              type="button"
              onClick={handleCopyRoutineForCoach}
              style={{ width: '100%', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Copy size={16} /> 📋 Copiar Rutina en Texto
            </button>

            <button
              type="button"
              onClick={() => setShowRoutineBuilder(true)}
              style={{ width: '100%', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Layers size={16} color="var(--accent-blue)" /> 🛠️ Gestor Maestro de Rutinas (Actualizar / Pegar)
            </button>

            <button
              type="button"
              onClick={handleResetToOfficialRoutine}
              style={{ width: '100%', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <RefreshCw size={16} /> ↺ Restablecer {(baseDay.name || '').split(':')[0]} a Rutina Oficial
            </button>

            <button
              type="button"
              onClick={handleResetAllDaysToOfficial}
              style={{ width: '100%', background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)', border: '1.5px solid var(--accent-emerald)', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Sparkles size={16} color="var(--accent-emerald)" /> ✨ Activar Protocolo Adonis Oficial en Toda la Semana
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE CALIBRACIÓN DE SMARTWATCH */}
      {showWatchModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="card animate-fade" style={{
            maxWidth: '380px',
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: 'var(--shadow-ios-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Watch size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-main)' }}>
                    Calibrar con Smartwatch
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Apple Watch, Garmin, Galaxy, Fitbit
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowWatchModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px' }}>
              Calibra con tus sensores cardíacos reales (Apple Watch, Garmin, Galaxy, Polar). Adonis aplicará la <strong>Ecuación de Keytel modificada para pesas</strong> con <strong>Reserva Cardíaca (%HRR de Karvonen)</strong> y trabajo mecánico.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  ❤️ FC Promedio (BPM):
                </label>
                <input
                  type="number"
                  value={cleanStr(watchHrAvgInput)}
                  onChange={e => setWatchHrAvgInput(e.target.value)}
                  placeholder="Ej. 125"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  ⚡ FC Máxima (BPM):
                </label>
                <input
                  type="number"
                  value={cleanStr(watchHrMaxInput)}
                  onChange={e => setWatchHrMaxInput(e.target.value)}
                  placeholder="Ej. 165"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  💤 FC Reposo / Mín (BPM):
                </label>
                <input
                  type="number"
                  value={cleanStr(watchHrRestInput)}
                  onChange={e => setWatchHrRestInput(e.target.value)}
                  placeholder="Ej. 60"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  ⌚ Kcal del Reloj (Opcional):
                </label>
                <input
                  type="number"
                  value={cleanStr(watchInput)}
                  onChange={e => setWatchInput(e.target.value)}
                  placeholder="Ej. 320"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {calories && (
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '14px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  🧪 Desglose del Algoritmo Híbrido:
                </div>
                <div>• Trabajo Mecánico Puro (Músculo): <strong>{calories.breakdown?.mechanicalKcal + calories.breakdown?.activeKcal || calories.strengthKcal} kcal</strong></div>
                {calories.cardiacKcal > 0 && (
                  <div style={{ color: 'var(--accent-red)' }}>
                    • Costo Hemodinámico (Keytel Atenuado): <strong>{calories.cardiacKcal} kcal</strong>
                  </div>
                )}
                {calories.hrrPct && (
                  <div style={{ color: '#a855f7' }}>
                    • Intensidad Reserva Cardíaca (%HRR Karvonen): <strong>{calories.hrrPct}%</strong>
                  </div>
                )}
                <div>• Deuda de Oxígeno (EPOC): <strong>+{calories.epocKcal} kcal</strong></div>
                <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed var(--border-subtle)', color: 'var(--accent-amber)', fontWeight: '900', fontSize: '12px' }}>
                  🔥 Gasto Fisiológico Total: {calories.displayKcal || calories.totalKcal} kcal
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  const hrAvg = parseFloat(watchHrAvgInput);
                  const hrMax = parseFloat(watchHrMaxInput);
                  const hrRest = parseFloat(watchHrRestInput);
                  const wKcal = parseFloat(watchInput);

                  if (onSetSmartwatchKcal) {
                    if ((!isNaN(hrAvg) && hrAvg > 0) || (!isNaN(wKcal) && wKcal > 0)) {
                      onSetSmartwatchKcal({
                        hrAvg: !isNaN(hrAvg) && hrAvg > 0 ? hrAvg : null,
                        hrMax: !isNaN(hrMax) && hrMax > 0 ? hrMax : null,
                        hrRest: !isNaN(hrRest) && hrRest > 0 ? hrRest : null,
                        watchKcal: !isNaN(wKcal) && wKcal > 0 ? wKcal : null
                      });
                    } else {
                      onSetSmartwatchKcal(null);
                    }
                  }
                  setShowWatchModal(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '900',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
                }}
              >
                💾 Guardar Calibración Fisiológica
              </button>

              {userSmartwatchKcal && (
                <button
                  type="button"
                  onClick={() => {
                    if (onSetSmartwatchKcal) onSetSmartwatchKcal(null);
                    setWatchInput('');
                    setWatchHrAvgInput('');
                    setWatchHrMaxInput('');
                    setWatchHrRestInput('');
                    setShowWatchModal(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    fontWeight: '800',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Restablecer a Cálculo Biomecánico Estándar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
