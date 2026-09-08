import React from 'react';
import { 
  Save, Trash2, Settings2, ChevronUp, ChevronDown, 
  Loader2, Cpu, BookOpen, Copy, Layers, RefreshCw, Sparkles, Flame, Share2, Download
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
  setShowRoutineBuilder,
  handleResetToOfficialRoutine,
  handleResetAllDaysToOfficial,
  baseDay = {},
  calories = null,
  onExportTCX = null
}) {
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
            <div style={{ textAlign: 'right' }}>
              <span className="badge" style={{ background: '#ea580c', color: '#ffffff', fontSize: '13px', fontWeight: '900', padding: '4px 10px', borderRadius: '12px' }}>
                🔥 {calories.totalKcal} kcal
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
    </>
  );
}
