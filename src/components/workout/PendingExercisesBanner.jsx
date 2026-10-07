import React from 'react';
import { Clock, Plus, ArrowRight, X, AlertCircle, Dumbbell } from 'lucide-react';

export default function PendingExercisesBanner({
  pendingData,
  onImportToToday,
  onOpenRescheduleModal,
  onDismiss
}) {
  if (!pendingData || !pendingData.pendingExercises || pendingData.pendingExercises.length === 0) {
    return null;
  }

  const { sourceDayName, sourceDate, pendingExercises } = pendingData;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      border: '1.5px solid #fde68a',
      borderRadius: '20px',
      padding: '14px 16px',
      marginBottom: '16px',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.08)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#fef08a', color: '#b45309', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={18} />
          </div>
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: '900', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Balance de Volumen Semanal
            </span>
            <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '900', color: '#78350f' }}>
              Quedaron {pendingExercises.length} ejercicio{pendingExercises.length > 1 ? 's' : ''} pendiente{pendingExercises.length > 1 ? 's' : ''} de {sourceDayName.split(':')[0]} ({sourceDate})
            </h4>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          title="Descartar aviso para hoy"
          style={{ background: 'transparent', border: 'none', color: '#92400e', cursor: 'pointer', padding: '4px' }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {pendingExercises.map(ex => (
          <span
            key={ex.id}
            style={{
              background: '#ffffff',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: '800',
              color: '#92400e',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Dumbbell size={11} color="#b45309" />
            {ex.name} ({ex.muscleGroup || 'General'})
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onImportToToday(pendingExercises)}
          style={{
            flex: '1 1 auto',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '9px 12px',
            fontSize: '11.5px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)'
          }}
        >
          <Plus size={14} />
          <span>Sumar a la rutina de hoy (remate)</span>
        </button>

        {onOpenRescheduleModal && (
          <button
            type="button"
            onClick={onOpenRescheduleModal}
            style={{
              flex: '1 1 auto',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#334155',
              borderRadius: '12px',
              padding: '9px 12px',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Mover o equilibrar en la semana</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
