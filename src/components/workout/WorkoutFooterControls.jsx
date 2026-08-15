import React from 'react';
import { 
  Save, Trash2, Settings2, ChevronUp, ChevronDown, 
  Loader2, Cpu, BookOpen, Copy, Layers, RefreshCw, Sparkles 
} from 'lucide-react';

export default function WorkoutFooterControls({
  handleFinishWorkout,
  completedSets = 0,
  isViewingHistory,
  handleClearCurrentDraft,
  showSecondaryTools,
  setShowSecondaryTools,
  handleOptimizeWithMath,
  isAnalyzingAI,
  setShowGlosarioModal,
  handleCopyRoutineForCoach,
  setShowRoutineBuilder,
  handleResetToOfficialRoutine,
  handleResetAllDaysToOfficial,
  baseDay = {}
}) {
  return (
    <>
      {/* BOTÓN PRINCIPAL DE GUARDAR ENTRENAMIENTO Y LIMPIAR */}
      <div style={{ marginTop: '12px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleFinishWorkout} 
          style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '20px', fontWeight: '900', boxShadow: '0 8px 24px rgba(0, 102, 255, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Save size={22} /> Guardar Sesión en Bitácora
        </button>

        {completedSets > 0 && !isViewingHistory && (
          <button 
            type="button" 
            onClick={handleClearCurrentDraft}
            style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '14px', fontWeight: '800', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Trash2 size={14} /> Descartar / Limpiar Casillas Marcadas de Hoy
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
