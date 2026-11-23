import React from 'react';
import { Plus, Minus, Sparkles } from 'lucide-react';

export default function SetLoggerFooter({
  handleAddSet,
  totalSets,
  handleRemoveSet,
  hasFeedback,
  setIsFeedbackModalOpen
}) {
  return (
    <div style={{ display: 'flex', gap: '5px', marginBottom: '6px', width: '100%' }}>
      <button
        type="button"
        onClick={handleAddSet}
        style={{
          flex: 1,
          background: 'var(--bg-surface-secondary)',
          color: 'var(--accent-blue)',
          border: '1px solid var(--border-strong)',
          padding: '7px 4px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: '800',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}
      >
        <Plus size={12} /> + Serie
      </button>

      {totalSets > 1 && (
        <button
          type="button"
          onClick={handleRemoveSet}
          style={{
            background: 'var(--accent-red-subtle)',
            color: 'var(--accent-red)',
            border: '1px solid var(--accent-red)',
            padding: '7px 8px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Minus size={12} /> Quitar
        </button>
      )}

      <button
        type="button"
        onClick={() => setIsFeedbackModalOpen(true)}
        style={{
          flex: 1.2,
          background: hasFeedback ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-secondary)',
          color: hasFeedback ? '#a855f7' : 'var(--text-secondary)',
          border: hasFeedback ? '1px solid #a855f7' : '1px solid var(--border-strong)',
          padding: '7px 6px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: '800',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}
        title="Registrar biofeedback medible de sensaciones y congestión"
      >
        <Sparkles size={12} color={hasFeedback ? '#a855f7' : 'var(--text-muted)'} />
        {hasFeedback ? 'Sensaciones ✓' : 'Sensaciones'}
      </button>
    </div>
  );
}
