import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2, Check } from 'lucide-react';

export default function RoutineTextParserView({
  pastedText,
  setPastedText,
  parseError,
  setParseError,
  parsedPreview,
  handleParsePasted,
  handleApplyNewRoutine
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '14px', padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Sparkles size={16} color="#0066ff" />
          <strong style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: '900' }}>
            Pegar Nueva Rutina (Texto Libre o JSON)
          </strong>
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: '#3b82f6', lineHeight: '1.4' }}>
          Pega el texto de tu coach o plan de entrenamiento. El motor inteligente detectará los días (Lunes, Martes...), nombres de ejercicios, series, repeticiones y descansos automáticamente.
        </p>
      </div>

      <textarea
        rows={8}
        value={pastedText}
        onChange={(e) => {
          setPastedText(e.target.value);
          setParseError(null);
        }}
        placeholder={`Ejemplo de formato aceptado:\n\nLunes: Empuje y Pecho Superior\n1. Press Inclinado con Mancuernas: 4 series x 8-10 reps | Descanso: 120s\n2. Elevaciones Laterales: 4 series x 12-15 reps | 90s\n3. Pec Deck: 3 series x 12 reps\n\nMartes: Piernas y Cuádriceps\n1. Sentadilla Hack: 4 series x 8-10 reps\n2. Prensa 90: 3 series x 10-12 reps`}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '14px',
          border: '1.5px solid #cbd5e1',
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: '600',
          background: '#f8fafc',
          color: '#0f172a',
          resize: 'vertical'
        }}
      />

      <button
        type="button"
        onClick={handleParsePasted}
        disabled={!pastedText.trim()}
        style={{
          background: '#0066ff',
          color: '#ffffff',
          border: 'none',
          padding: '12px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '900',
          cursor: pastedText.trim() ? 'pointer' : 'not-allowed',
          opacity: pastedText.trim() ? 1 : 0.6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
      >
        <Sparkles size={16} /> 🔍 Analizar y Previsualizar Formato
      </button>

      {parseError && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '12px', padding: '10px', color: '#b91c1c', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={16} /> {parseError}
        </div>
      )}

      {parsedPreview && (
        <div className="animate-fade" style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '14px', marginTop: '4px' }}>
          <div className="flex-between" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} color="#16a34a" />
              <strong style={{ fontSize: '13px', color: '#166534', fontWeight: '900' }}>
                Vista Previa: {parsedPreview.length} Días Detectados
              </strong>
            </div>
            <span style={{ fontSize: '11px', color: '#15803d', fontWeight: '800' }}>
              {parsedPreview.reduce((acc, d) => acc + (d.exercises ? d.exercises.length : 0), 0)} ejercicios en total
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '30vh', overflowY: 'auto', marginBottom: '12px' }}>
            {parsedPreview.map((day, idx) => (
              <div key={idx} style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  {day.name} ({day.exercises.length} ex)
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {day.exercises.map((ex, eIdx) => (
                    <span key={eIdx} style={{ background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                      {ex.name} ({ex.sets}x{ex.reps})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleApplyNewRoutine}
            style={{
              width: '100%',
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
            }}
          >
            <Check size={18} /> Confirmar y Guardar Nueva Rutina Activa
          </button>
        </div>
      )}
    </div>
  );
}
