import React from 'react';
import { Trash2, ChevronUp, ChevronDown, Flame, Share2 } from 'lucide-react';
import { calculateWorkoutCalories } from '../../utils/calorieCalculations';
import { shareOrExportWorkout } from '../../services/workoutExportService';

export default function HistorySessionCard({
  ses,
  isExpanded,
  onToggleExpand,
  onDeleteSession,
  findExerciseDefinition
}) {
  const wkNum = ses.weekNumber || 1;
  const calories = ses.calories || (ses.exercises ? calculateWorkoutCalories(ses.exercises) : null);

  return (
    <div className="card" style={{ marginBottom: '14px', overflow: 'hidden', borderRadius: '22px', border: '1px solid #cbd5e1' }}>
      <div 
        onClick={onToggleExpand}
        style={{ 
          padding: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          background: isExpanded ? 'rgba(241, 245, 249, 0.8)' : 'transparent'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '900', border: '1px solid #7dd3fc' }}>
              🗓️ {ses.weekName || `Semana ${wkNum}`}
            </span>
            <strong style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{ses.dayName}</strong>
            {ses.completedSets > 0 && <span className="badge badge-green" style={{ fontSize: '10px' }}>{ses.completedSets} series</span>}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px', fontWeight: '600' }}>
            <span>📅 {ses.dateString}</span>
            {ses.durationMinutes > 0 && (
              <span>• ⏱️ <strong style={{ color: '#0284c7' }}>{ses.durationMinutes} min</strong></span>
            )}
            <span>• Volumen: <strong style={{ color: '#0066ff' }}>{ses.volume?.toLocaleString()} lbs</strong></span>
            {calories && calories.totalKcal > 0 && (
              <span className="badge" style={{ background: '#ffedd5', color: '#c2410c', fontSize: '11px', fontWeight: '800', border: '1px solid #fed7aa', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Flame size={12} color="#ea580c" />
                {calories.totalKcal} kcal
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); onDeleteSession(ses.id); }} 
            style={{ background: 'transparent', border: 'none', color: '#ff3b30', padding: '6px', cursor: 'pointer' }}
            title="Borrar registro"
          >
            <Trash2 size={18} />
          </button>
          {isExpanded ? <ChevronUp size={22} color="#64748b" /> : <ChevronDown size={22} color="#64748b" />}
        </div>
      </div>

      {isExpanded && ses.exercises && (
        <div className="animate-fade" style={{ padding: '10px 16px 18px 16px', borderTop: '1px solid #cbd5e1', background: '#f8fafc' }}>
          {calories && calories.totalKcal > 0 && (
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #fdba74',
              borderRadius: '16px',
              padding: '12px 14px',
              marginBottom: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={16} color="#ea580c" />
                  <strong style={{ fontSize: '13px', color: '#9a3412', fontWeight: '800' }}>
                    Gasto de la Sesión: {calories.totalKcal} kcal
                  </strong>
                </div>
                <span style={{ fontSize: '11px', color: '#7c2d12', display: 'block', marginTop: '2px' }}>
                  {ses.durationMinutes > 0 ? `⏱️ ${ses.durationMinutes} min de sesión • ` : ''}🏋️ {calories.strengthKcal} kcal fuerza {calories.cardioKcal > 0 ? `• 🚴 ${calories.cardioKcal} kcal cardio` : ''} • ⚡ +{calories.epocKcal} kcal EPOC
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  shareOrExportWorkout(ses, calories);
                }}
                style={{
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #86efac',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Share2 size={13} /> Exportar TCX / Google Fit
              </button>
            </div>
          )}
          {Object.keys(ses.exercises).map((exId) => {
            const exData = ses.exercises[exId];
            if (!exData) return null;

            const exDef = findExerciseDefinition ? findExerciseDefinition(ses.dayId, exId) : { name: 'Ejercicio Personalizado', muscleGroup: 'General' };
            const setNums = Object.keys(exData).filter(k => !isNaN(parseInt(k)) && exData[k] && exData[k].completed);
            if (setNums.length === 0 && !exData.machineSetup) return null;

            return (
              <div key={exId} style={{ marginTop: '12px', background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{exData.name || exDef?.name || 'Ejercicio Personalizado'}</strong>
                  <span className="badge badge-blue">{exData.muscleGroup || exDef?.muscleGroup}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {setNums.map(setNum => {
                    const s = exData[setNum];
                    return (
                      <div key={setNum} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 10px', background: '#f8fafc', borderRadius: '8px' }}>
                        <span style={{ fontWeight: '800', color: '#334155' }}>Serie #{setNum}</span>
                        <span style={{ color: '#0066ff', fontWeight: '800' }}>{s.weight} {s.unit || 'lbs'} × {s.reps} reps</span>
                        <span className="badge badge-warning" style={{ fontSize: '10px' }}>RPE {s.rpe || '8'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
