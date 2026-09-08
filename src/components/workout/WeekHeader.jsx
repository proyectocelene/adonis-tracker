import React from 'react';
import { Calendar, Plus, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

export default function WeekHeader({
  currentWeek,
  setCurrentWeek,
  totalWeeks,
  setTotalWeeks,
  setExpandedExerciseId,
  handleClonePreviousWeek,
  modal,
  isReadOnly = false
}) {
  return (
    <div className="card animate-fade" style={{ padding: '16px', marginBottom: '14px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1.5px solid #334155', borderRadius: '24px', color: '#ffffff', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#38bdf8" />
          <span style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8' }}>
            Mesociclo Científico
          </span>
        </div>
        {!isReadOnly && (
          <button 
            type="button"
            onClick={() => {
              const newTotal = totalWeeks + 1;
              setTotalWeeks(newTotal);
              setCurrentWeek(newTotal);
              modal.showAlert({
                title: "🗓️ ¡Nueva Semana Agregada!",
                message: `Has ampliado tu ciclo de entrenamiento a la Semana ${newTotal}. Todo tu historial y programa anterior permanecen guardados e inalterables.`,
                variant: "success"
              });
            }}
            style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', padding: '6px 14px', borderRadius: '14px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}
          >
            <Plus size={14} /> + Nueva Semana
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'rgba(15, 23, 42, 0.7)', padding: '8px', borderRadius: '20px', border: '1px solid #334155' }}>
        <button 
          type="button"
          disabled={currentWeek <= 1 || isReadOnly}
          onClick={() => {
            if (currentWeek > 1) {
              setCurrentWeek(currentWeek - 1);
              setExpandedExerciseId(null);
            }
          }}
          style={{ width: '44px', height: '44px', background: currentWeek <= 1 || isReadOnly ? 'rgba(51, 65, 85, 0.3)' : '#0066ff', color: '#ffffff', border: 'none', borderRadius: '16px', cursor: currentWeek <= 1 || isReadOnly ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentWeek <= 1 || isReadOnly ? 0.4 : 1, transition: 'all 0.2s', flexShrink: 0 }}
        >
          <ArrowLeft size={22} />
        </button>

        <div style={{ textAlign: 'center', flex: 1, minWidth: 0, padding: '0 4px' }}>
          <div style={{ fontSize: '19px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span>🗓️ Semana {currentWeek}</span>
            {!isReadOnly && <span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '10px' }}>de {totalWeeks}</span>}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginTop: '4px' }}>
            {currentWeek === 1 ? '🌱 Semana de Calibración & Línea Base' : `🔥 Fase de Sobrecarga Progresiva (S${currentWeek})`}
          </div>
        </div>

        <button 
          type="button"
          disabled={currentWeek >= totalWeeks || isReadOnly}
          onClick={() => {
            if (currentWeek < totalWeeks) {
              setCurrentWeek(currentWeek + 1);
              setExpandedExerciseId(null);
            }
          }}
          style={{ width: '44px', height: '44px', background: currentWeek >= totalWeeks || isReadOnly ? 'rgba(51, 65, 85, 0.3)' : '#0066ff', color: '#ffffff', border: 'none', borderRadius: '16px', cursor: currentWeek >= totalWeeks || isReadOnly ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentWeek >= totalWeeks || isReadOnly ? 0.4 : 1, transition: 'all 0.2s', flexShrink: 0 }}
        >
          <ArrowRight size={22} />
        </button>
      </div>

      {currentWeek > 1 && (
        <div style={{ marginTop: '12px' }}>
          <button 
            type="button"
            onClick={handleClonePreviousWeek}
            style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s' }}
          >
            <Zap size={18} fill="#ffffff" />
            ⚡️ Clonar Pesos de Semana {currentWeek - 1} (Autocompletar)
          </button>
        </div>
      )}
    </div>
  );
}
