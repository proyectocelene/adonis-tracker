import React from 'react';
import { X, CheckCircle2, Dumbbell, Coffee, XCircle, Trash2 } from 'lucide-react';

export default function CalendarDayDetailModal({
  selectedCellModal,
  onClose,
  monthNames = [],
  month = 0,
  year = 2026,
  handleMarkTrainedDay,
  handleMarkRestDay,
  handleMarkMissedDay,
  handleDeleteDayLog,
  onSelectDayId,
  onSelectDate
}) {
  if (!selectedCellModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 2000
    }}>
      <div className="card animate-fade" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '20px', width: '100%', maxWidth: '380px', boxShadow: 'var(--shadow-ios-lg)' }}>
        <div className="flex-between" style={{ marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '900', textTransform: 'uppercase' }}>
              Gestión del Calendario
            </span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '17px', fontWeight: '900', color: 'var(--text-main)' }}>
              {selectedCellModal.dayNumber} de {monthNames[month]} {year}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* ESTADO ACTUAL */}
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '12px', borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', marginBottom: '4px' }}>
            ESTADO ACTUAL:
          </div>
          {selectedCellModal.session && !selectedCellModal.session.isRestDay && !selectedCellModal.session.isMissedDay && (selectedCellModal.session.volume > 0 || selectedCellModal.session.isCompleted) ? (
            <div style={{ color: '#047857', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              Entrenado: {selectedCellModal.session.volume > 1000 ? `${selectedCellModal.session.volume.toLocaleString()} lbs-reps` : 'Asistí al gym'} ({selectedCellModal.session.completedSets || 1} series)
            </div>
          ) : selectedCellModal.session?.isRestDay ? (
            <div style={{ color: '#4b5563', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💤 Marcado como Día de Descanso
            </div>
          ) : selectedCellModal.session?.isMissedDay ? (
            <div style={{ color: '#b91c1c', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ❌ Marcado como Falta / No Entrené
            </div>
          ) : (
            <div style={{ color: '#64748b', fontWeight: '700', fontSize: '13px' }}>
              ⚪ Sin registro oficial de entrenamiento
            </div>
          )}
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* ACCIÓN RÁPIDA 1: MARCAR COMO ENTRENADO (FUI AL GYM) */}
          <button
            type="button"
            onClick={() => handleMarkTrainedDay(selectedCellModal)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            <CheckCircle2 size={16} /> ✅ Marcar como Entrenado (Fui al Gym)
          </button>

          {/* ACCIÓN RÁPIDA 2: VER O EDITAR RUTINA DE ESTA FECHA */}
          <button
            type="button"
            onClick={() => {
              if (onSelectDayId) onSelectDayId(selectedCellModal.dayId);
              if (onSelectDate) onSelectDate(selectedCellModal.dateKey);
              onClose();
            }}
            style={{
              background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
              border: '1px solid var(--accent-blue)',
              padding: '11px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Dumbbell size={16} /> 🏋️ Registrar / Editar Pesos de la Rutina
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleMarkRestDay(selectedCellModal)}
              style={{
                background: 'var(--bg-surface-secondary)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                padding: '10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Coffee size={14} /> 💤 Descanso
            </button>

            <button
              type="button"
              onClick={() => handleMarkMissedDay(selectedCellModal)}
              style={{
                background: 'var(--accent-red-subtle)',
                color: 'var(--accent-red)',
                border: '1px solid var(--accent-red)',
                padding: '10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <XCircle size={14} /> ❌ Falta
            </button>
          </div>

          {selectedCellModal.session && (
            <button
              type="button"
              onClick={() => handleDeleteDayLog(selectedCellModal)}
              style={{
                background: 'var(--accent-red-subtle)',
                color: 'var(--accent-red)',
                border: '1px solid var(--accent-red)',
                padding: '10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px'
              }}
            >
              <Trash2 size={14} /> Eliminar Registro / Limpiar Día
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
