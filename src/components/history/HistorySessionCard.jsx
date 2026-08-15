import React from 'react';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function HistorySessionCard({
  ses,
  isExpanded,
  onToggleExpand,
  onDeleteSession,
  findExerciseDefinition
}) {
  const wkNum = ses.weekNumber || 1;

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
          <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>
            📅 {ses.dateString} • Volumen: <strong style={{ color: '#0066ff' }}>{ses.volume?.toLocaleString()} lbs</strong>
          </span>
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
