import React from 'react';
import { Dumbbell, X, Plus } from 'lucide-react';
import { UNIFIED_EXERCISE_LIBRARY } from '../../data/unifiedExerciseLibrary';

export default function AddCustomExerciseModal({
  isAddingExercise,
  setIsAddingExercise,
  newExScope,
  setNewExScope,
  newExName,
  setNewExName,
  newExSets,
  setNewExSets,
  newExReps,
  setNewExReps,
  handleAddCustomExercise,
  handlePickFromLibrary
}) {
  if (!isAddingExercise) {
    return (
      <button 
        type="button"
        className="btn btn-outline" 
        onClick={() => setIsAddingExercise(true)}
        style={{ width: '100%', background: '#ffffff', border: '2px dashed #cbd5e1', color: '#475569', fontWeight: '800', padding: '14px', marginBottom: '16px', borderRadius: '18px' }}
      >
        <Plus size={18} color="#0066ff" style={{ display: 'inline', marginRight: '6px' }} /> + Agregar Ejercicio a este Día
      </button>
    );
  }

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = React.useState('ALL');

  const filteredLibrary = UNIFIED_EXERCISE_LIBRARY.filter(ex => {
    const matchesSearch = !searchTerm || ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMuscle = selectedMuscleFilter === 'ALL' || ex.muscleGroup === selectedMuscleFilter;
    return matchesSearch && matchesMuscle;
  });

  const muscleGroups = ['ALL', ...new Set(UNIFIED_EXERCISE_LIBRARY.map(ex => ex.muscleGroup))];

  return (
    <div className="card animate-fade" style={{ padding: '18px', borderTop: '4px solid #0066ff', background: '#ffffff', marginBottom: '20px' }}>
      <div className="flex-between" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Dumbbell size={18} color="#0066ff" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Nuevo Ejercicio / Máquina</h3>
        </div>
        <button type="button" onClick={() => setIsAddingExercise(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="#64748b" />
        </button>
      </div>

      <form onSubmit={handleAddCustomExercise}>
        {/* SELECTOR DE ÁMBITO (HOY VS PERMANENTE) */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setNewExScope('today')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '10px',
              border: 'none',
              background: newExScope === 'today' ? '#0066ff' : 'transparent',
              color: newExScope === 'today' ? '#ffffff' : '#64748b',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            📌 Solo para HOY
          </button>
          <button
            type="button"
            onClick={() => setNewExScope('permanent')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '10px',
              border: 'none',
              background: newExScope === 'permanent' ? '#7c3aed' : 'transparent',
              color: newExScope === 'permanent' ? '#ffffff' : '#64748b',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            🔄 Permanente en Rutina
          </button>
        </div>

        {/* CATÁLOGO DE MÁQUINAS CON BÚSQUEDA Y FILTRO */}
        <div style={{ background: '#f5f3ff', border: '1px solid #a78bfa', padding: '12px', borderRadius: '14px', marginBottom: '14px' }}>
          <label className="input-label" style={{ display: 'block', marginBottom: '6px', color: '#5b21b6', fontWeight: '800', fontSize: '12px' }}>
            ⚡️ Elegir de Catálogo Completo de Gimnasio ({filteredLibrary.length} disponibles):
          </label>
          
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o máquina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #c4b5fd',
                fontSize: '12px',
                fontWeight: '700',
                background: '#ffffff',
                color: '#1e1b4b'
              }}
            />
            <select
              value={selectedMuscleFilter}
              onChange={(e) => setSelectedMuscleFilter(e.target.value)}
              style={{
                width: '110px',
                padding: '8px 4px',
                borderRadius: '8px',
                border: '1px solid #c4b5fd',
                fontSize: '11px',
                fontWeight: '800',
                background: '#ffffff',
                color: '#5b21b6'
              }}
            >
              {muscleGroups.map(mg => (
                <option key={mg} value={mg}>{mg === 'ALL' ? 'Todos' : mg}</option>
              ))}
            </select>
          </div>

          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) handlePickFromLibrary(e.target.value);
            }}
            style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: '1.5px solid #7c3aed', background: '#ffffff', color: '#1e1b4b', fontWeight: '800', fontSize: '12px' }}
          >
            <option value="">👆 Toca para seleccionar un ejercicio preconfigurado...</option>
            {filteredLibrary.map(ex => (
              <option key={ex.id} value={ex.id}>
                [{ex.muscleGroup}] {ex.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            required 
            placeholder="Nombre del Ejercicio" 
            value={newExName} 
            onChange={e => setNewExName(e.target.value)} 
            style={{ padding: '10px 12px', width: '100%', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px' }}
          />
        </div>

        <div className="grid-2" style={{ marginBottom: '10px', gap: '8px' }}>
          <input 
            type="number" 
            placeholder="Series (ej. 3)" 
            value={newExSets} 
            onChange={e => setNewExSets(e.target.value)} 
            style={{ padding: '10px', width: '100%', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px' }} 
          />
          <input 
            type="text" 
            placeholder="Reps (ej. 10-12)" 
            value={newExReps} 
            onChange={e => setNewExReps(e.target.value)} 
            style={{ padding: '10px', width: '100%', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px' }} 
          />
        </div>

        <div className="grid-2" style={{ gap: '10px' }}>
          <button type="button" className="btn btn-outline" onClick={() => setIsAddingExercise(false)}>Cancelar</button>
          <button type="submit" className="btn btn-primary">
            {newExScope === 'today' ? '📌 Añadir a Hoy' : '🔄 Guardar en Rutina'}
          </button>
        </div>
      </form>
    </div>
  );
}
