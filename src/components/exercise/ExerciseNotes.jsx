import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { ErrorBoundary } from '../common/ErrorBoundary';

function ExerciseNotesContent({
  exerciseNotesInput,
  setExerciseNotesInput,
  handleSaveNotes,
  allNotesList,
  handleDeleteNote
}) {
  return (
    <div className="mt-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <MessageSquare size={16} className="text-slate-500" />
          <span className="text-sm text-slate-700 font-semibold">
            Notas del Ejercicio
          </span>
        </div>
        {allNotesList.length > 0 && (
          <span className="text-xs text-slate-500">
            {allNotesList.length} {allNotesList.length === 1 ? 'nota' : 'notas'}
          </span>
        )}
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
        <textarea
          rows={2}
          placeholder="Añade observaciones sobre técnica, peso..."
          value={exerciseNotesInput}
          onChange={(e) => setExerciseNotesInput(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 resize-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            type="button"
            onClick={handleSaveNotes}
            className="bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>

      {allNotesList.length > 0 && (
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {allNotesList.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start justify-between gap-2"
            >
              <div className="flex-1">
                <div className="text-[11px] text-slate-400 font-medium mb-1">
                  {item.date}
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap">
                  {item.text}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteNote(item.id)}
                title="Borrar nota"
                className="text-slate-400 hover:text-red-500 bg-transparent border-none p-1 cursor-pointer transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExerciseNotes(props) {
  return (
    <ErrorBoundary>
      <ExerciseNotesContent {...props} />
    </ErrorBoundary>
  );
}
