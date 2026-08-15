import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

export default function ExerciseNotes({
  allNotesList = [],
  exerciseNotesInput,
  setExerciseNotesInput,
  handleSaveNotes,
  handleDeleteNote
}) {
  return (
    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '14px', border: '1.5px solid #e2e8f0', width: '100%', marginTop: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MessageSquare size={16} color="#7c3aed" />
          <span style={{ fontSize: '12px', color: '#4c1d95', fontWeight: '900' }}>
            📜 Historial de Notas & Sensaciones:
          </span>
        </div>
        <span style={{ fontSize: '10px', background: '#f3e8ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
          {allNotesList.length} {allNotesList.length === 1 ? 'nota' : 'notas'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <textarea
          rows={2}
          placeholder="Escribe una nota sobre este ejercicio (ej. Rep 8 cerca del fallo, ajustar asiento a 4...)"
          value={exerciseNotesInput}
          onChange={(e) => setExerciseNotesInput(e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            fontSize: '12px',
            fontWeight: '600',
            background: '#ffffff',
            color: '#0f172a',
            resize: 'none'
          }}
        />
        <button
          type="button"
          onClick={handleSaveNotes}
          style={{
            background: '#7c3aed',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: '900',
            cursor: 'pointer',
            alignSelf: 'flex-end',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Plus size={14} /> Guardar
        </button>
      </div>

      {allNotesList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
          {allNotesList.map((item) => (
            <div 
              key={item.id}
              style={{
                background: '#ffffff',
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', marginBottom: '2px' }}>
                  🕒 {item.date}
                </div>
                <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600', whiteSpace: 'pre-wrap' }}>
                  {item.text}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteNote(item.id)}
                title="Borrar nota"
                style={{
                  background: '#fef2f2',
                  color: '#ef4444',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  padding: '4px 6px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <Trash2 size={12} /> Borrar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '6px 0' }}>
          No hay notas guardadas para este ejercicio.
        </div>
      )}
    </div>
  );
}
