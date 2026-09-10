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

  const [watchInput, setWatchInput] = useState(() => {
    if (typeof userSmartwatchKcal === 'object') return userSmartwatchKcal?.watchKcal ? String(userSmartwatchKcal.watchKcal) : '';
    return userSmartwatchKcal ? String(userSmartwatchKcal) : '';
  });
  const [watchHrAvgInput, setWatchHrAvgInput] = useState(() => {
    return typeof userSmartwatchKcal === 'object' && userSmartwatchKcal?.hrAvg ? String(userSmartwatchKcal.hrAvg) : '';
  });
  const [watchHrMaxInput, setWatchHrMaxInput] = useState(() => {
    return typeof userSmartwatchKcal === 'object' && userSmartwatchKcal?.hrMax ? String(userSmartwatchKcal.hrMax) : '';
  });
  const [watchHrRestInput, setWatchHrRestInput] = useState(() => {
    return typeof userSmartwatchKcal === 'object' && userSmartwatchKcal?.hrRest ? String(userSmartwatchKcal.hrRest) : '';
  });

  useEffect(() => {
    if (showWatchModal) {
      if (typeof userSmartwatchKcal === 'object') {
        setWatchInput(userSmartwatchKcal?.watchKcal ? String(userSmartwatchKcal.watchKcal) : '');
        setWatchHrAvgInput(userSmartwatchKcal?.hrAvg ? String(userSmartwatchKcal.hrAvg) : '');
        setWatchHrMaxInput(userSmartwatchKcal?.hrMax ? String(userSmartwatchKcal.hrMax) : '');
        setWatchHrRestInput(userSmartwatchKcal?.hrRest ? String(userSmartwatchKcal.hrRest) : '');
      } else {
        setWatchInput(userSmartwatchKcal ? String(userSmartwatchKcal) : '');
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
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          border: '1.5px solid #fdba74',
          boxShadow: '0 4px 14px rgba(234, 88, 12, 0.12)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Flame size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#9a3412', fontWeight: '900', display: 'block' }}>
                  Gasto Calórico Estimado
                </strong>
                <span style={{ fontSize: '10.5px', color: '#c2410c', fontWeight: '600' }}>
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
                  background: userSmartwatchKcal ? '#ffedd5' : '#ffffff',
                  border: '1.5px solid #fdba74',
                  borderRadius: '10px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#c2410c',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Watch size={13} /> {calories.isHeartRateCalibrated ? `❤️ ${calories.watchHrAvg} bpm` : (userSmartwatchKcal ? '⌚ Calibrado' : 'Calibrar Reloj')}
              </button>
              <span className="badge" style={{ background: '#ea580c', color: '#ffffff', fontSize: '13px', fontWeight: '900', padding: '4px 10px', borderRadius: '12px' }}>
                🔥 {calories.displayKcal || calories.totalKcal} kcal
              </span>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: calories.cardioKcal > 0 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', 
            gap: '8px', 
            background: 'rgba(255, 255, 255, 0.7)', 
            padding: '8px 10px', 
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#7c2d12',
            fontWeight: '700'
          }}>
            <div>
              <span style={{ display: 'block', fontSize: '10px', color: '#9a3412' }}>🏋️ Fuerza</span>
              <strong>{calories.strengthKcal} kcal</strong>
            </div>
            {calories.cardioKcal > 0 && (
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: '#9a3412' }}>🚴 Cardio Z2</span>
                <strong>{calories.cardioKcal} kcal</strong>
              </div>
            )}
            <div>
              <span style={{ display: 'block', fontSize: '10px', color: '#9a3412' }}>⚡ EPOC Post</span>
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
              background: '#f0fdf4',
              color: '#15803d',
              border: '1.5px solid #86efac',
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
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1.5px solid #93c5fd',
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
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
              color: '#6d28d9',
              border: '1.5px solid #c4b5fd',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(109, 40, 217, 0.12)',
              transition: 'all 0.2s ease'
            }}
          >
            <Bot size={18} color="#7c3aed" /> 🤖 Copiar Prompt para IA (ChatGPT / Gemini / Claude)
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
                  background: '#f0f9ff',
                  color: '#0284c7',
                  border: '1.5px solid #bae6fd',
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
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1.5px solid #a7f3d0',
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
            style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '14px', fontWeight: '800', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Trash2 size={14} /> Descartar / Limpiar Casillas Marcadas ({isViewingHistory ? selectedDateKey : 'Hoy'})
          </button>
        )}
      </div>


      {/* MENÚ SECUNDARIO DE HERRAMIENTAS */}
      <div className="card" style={{ padding: '14px', marginBottom: '20px', background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
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
            <Settings2 size={18} color="#64748b" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#334155' }}>🛠️ Herramientas Secundarias & Ajustes</span>
          </div>
          {showSecondaryTools ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
        </button>

        {showSecondaryTools && (
          <div className="animate-fade" style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              style={{ width: '100%', background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <BookOpen size={16} /> 📖 Ver Glosario & Guía Técnica
            </button>

            <button 
              type="button"
              onClick={handleCopyRoutineForCoach}
              style={{ width: '100%', background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Copy size={16} /> 📋 Copiar Rutina en Texto
            </button>

            <button
              type="button"
              onClick={() => setShowRoutineBuilder(true)}
              style={{ width: '100%', background: '#1e293b', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Layers size={16} color="#38bdf8" /> 🛠️ Gestor Maestro de Rutinas (Actualizar / Pegar)
            </button>

            <button
              type="button"
              onClick={handleResetToOfficialRoutine}
              style={{ width: '100%', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <RefreshCw size={16} /> ↺ Restablecer {(baseDay.name || '').split(':')[0]} a Rutina Oficial
            </button>

            <button
              type="button"
              onClick={handleResetAllDaysToOfficial}
              style={{ width: '100%', background: '#ecfdf5', color: '#047857', border: '1.5px solid #6ee7b7', padding: '12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Sparkles size={16} color="#059669" /> ✨ Activar Protocolo Adonis Oficial en Toda la Semana
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
            background: '#ffffff',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Watch size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>
                    Calibrar con Smartwatch
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                    Apple Watch, Garmin, Galaxy, Fitbit
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowWatchModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', marginBottom: '14px' }}>
              Calibra con tus sensores cardíacos reales (Apple Watch, Garmin, Galaxy, Polar). Adonis aplicará la <strong>Ecuación de Keytel modificada para pesas</strong> con <strong>Reserva Cardíaca (%HRR de Karvonen)</strong> y trabajo mecánico.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                  ❤️ FC Promedio (BPM):
                </label>
                <input
                  type="number"
                  value={watchHrAvgInput}
                  onChange={e => setWatchHrAvgInput(e.target.value)}
                  placeholder="Ej. 125"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                  ⚡ FC Máxima (BPM):
                </label>
                <input
                  type="number"
                  value={watchHrMaxInput}
                  onChange={e => setWatchHrMaxInput(e.target.value)}
                  placeholder="Ej. 165"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                  💤 FC Reposo / Mín (BPM):
                </label>
                <input
                  type="number"
                  value={watchHrRestInput}
                  onChange={e => setWatchHrRestInput(e.target.value)}
                  placeholder="Ej. 60"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                  ⌚ Kcal del Reloj (Opcional):
                </label>
                <input
                  type="number"
                  value={watchInput}
                  onChange={e => setWatchInput(e.target.value)}
                  placeholder="Ej. 320"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {calories && (
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '14px', fontSize: '11px', color: '#475569', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                  🧪 Desglose del Algoritmo Híbrido:
                </div>
                <div>• Trabajo Mecánico Puro (Músculo): <strong>{calories.breakdown?.mechanicalKcal + calories.breakdown?.activeKcal || calories.strengthKcal} kcal</strong></div>
                {calories.cardiacKcal > 0 && (
                  <div style={{ color: '#dc2626' }}>
                    • Costo Hemodinámico (Keytel Atenuado): <strong>{calories.cardiacKcal} kcal</strong>
                  </div>
                )}
                {calories.hrrPct && (
                  <div style={{ color: '#7c3aed' }}>
                    • Intensidad Reserva Cardíaca (%HRR Karvonen): <strong>{calories.hrrPct}%</strong>
                  </div>
                )}
                <div>• Deuda de Oxígeno (EPOC): <strong>+{calories.epocKcal} kcal</strong></div>
                <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #cbd5e1', color: '#ea580c', fontWeight: '900', fontSize: '12px' }}>
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
