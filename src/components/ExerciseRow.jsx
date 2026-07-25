import React from 'react';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ExerciseRow({ exercise, exerciseData = {}, previousData = {}, onUpdateSet }) {
  const numSets = parseInt(exercise.sets) || 1;
  const setsArray = Array.from({ length: numSets }, (_, i) => i + 1);

  const isCardioOrTime = typeof exercise.reps === 'string' && (exercise.reps.includes('s') || exercise.reps.includes('m'));

  const handleSetChange = (setNumber, field, value) => {
    const currentSetData = exerciseData[setNumber] || {};
    onUpdateSet(setNumber, {
      ...currentSetData,
      [field]: value
    });
  };

  // Verifica si todas las series del ejercicio están terminadas
  const isAllCompleted = setsArray.every(s => exerciseData[s]?.completed);

  return (
    <div className={`card ${isAllCompleted ? 'card-success' : ''}`} style={{ padding: '16px', marginBottom: '18px' }}>
      {/* Cabecera del Ejercicio */}
      <div className="flex-between" style={{ marginBottom: '8px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, paddingRight: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span className="badge badge-blue">
              {exercise.sets} series x {exercise.reps} {isCardioOrTime ? '' : 'reps'}
            </span>
            {isAllCompleted && <CheckCircle2 size={18} color="var(--accent-green)" />}
          </div>
          <h3 style={{ fontSize: '16px', color: '#0f172a' }}>{exercise.name}</h3>
        </div>
      </div>
      
      {/* Notas y Prescripción Científica del Coach */}
      {exercise.notes && (
        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '8px 12px', 
          marginBottom: '14px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '12px',
          color: '#475569'
        }}>
          <Info size={16} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
          <span><strong>Prescrito por el Coach:</strong> {exercise.notes}</span>
        </div>
      )}
      
      {/* Tabla Científica por Serie */}
      <div style={{ overflowX: 'auto' }}>
        <table className="table-responsive">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Serie</th>
              <th style={{ width: '70px' }}>Prescrito</th>
              <th style={{ width: '95px' }}>{isCardioOrTime ? 'Resistencia' : 'Peso (lbs)'}</th>
              <th style={{ width: '85px' }}>{isCardioOrTime ? 'Tiempo' : 'Reps Real'}</th>
              <th style={{ width: '130px' }}>Esfuerzo (RPE)</th>
              <th style={{ width: '45px' }}>Listo</th>
            </tr>
          </thead>
          <tbody>
            {setsArray.map((setNum) => {
              const currentSet = exerciseData[setNum] || {};
              const prevSet = previousData[setNum] || {};
              
              // Si no hay peso registrado aún en este set, mostrar como placeholder o valor sugerido el peso previo
              const defaultWeight = prevSet.weight !== undefined ? prevSet.weight : '';

              return (
                <tr key={setNum} style={{ background: currentSet.completed ? 'rgba(5, 150, 105, 0.04)' : 'transparent' }}>
                  {/* Número de Serie */}
                  <td style={{ fontWeight: '700', color: '#334155' }}>
                    #{setNum}
                  </td>
                  
                  {/* Prescrito por el programa */}
                  <td>
                    <span className="badge" style={{ background: '#e2e8f0', color: '#475569', fontSize: '11px' }}>
                      {exercise.reps}
                    </span>
                  </td>
                  
                  {/* Peso real levantado (lbs) */}
                  <td>
                    <input 
                      type="number" 
                      placeholder={defaultWeight !== '' ? `Ej. ${defaultWeight}` : '0'} 
                      value={currentSet.weight !== undefined ? currentSet.weight : (defaultWeight || '')}
                      onChange={(e) => handleSetChange(setNum, 'weight', e.target.value)}
                      style={{ padding: '6px', fontSize: '14px' }}
                    />
                  </td>
                  
                  {/* Repeticiones Reales Completadas */}
                  <td>
                    <input 
                      type={isCardioOrTime ? "text" : "number"}
                      placeholder={exercise.reps} 
                      value={currentSet.reps !== undefined ? currentSet.reps : ''}
                      onChange={(e) => handleSetChange(setNum, 'reps', e.target.value)}
                      style={{ padding: '6px', fontSize: '14px', fontWeight: currentSet.reps ? '700' : '400', color: '#0f172a' }}
                    />
                  </td>
                  
                  {/* RPE (Rate of Perceived Exertion) */}
                  <td>
                    <select
                      value={currentSet.rpe || '8'}
                      onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                      style={{ padding: '6px', fontSize: '13px', background: 'white', borderColor: '#cbd5e1' }}
                    >
                      <option value="10">RPE 10 (Fallo)</option>
                      <option value="9.5">RPE 9.5 (0.5 RIR)</option>
                      <option value="9">RPE 9 (1 RIR)</option>
                      <option value="8.5">RPE 8.5 (1-2 RIR)</option>
                      <option value="8">RPE 8 (2 RIR)</option>
                      <option value="7">RPE 7 (3 RIR)</option>
                      <option value="6">RPE 6 (Ligero)</option>
                    </select>
                  </td>
                  
                  {/* Checkbox de terminado */}
                  <td>
                    <input 
                      type="checkbox" 
                      className="set-checkbox"
                      checked={!!currentSet.completed}
                      onChange={(e) => handleSetChange(setNum, 'completed', e.target.checked)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isAllCompleted && (
        <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '12px', color: 'var(--accent-green)', fontWeight: '600' }}>
          ✓ Todas las series registradas y verificadas
        </div>
      )}
    </div>
  );
}
