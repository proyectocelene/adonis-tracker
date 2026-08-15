import React from 'react';
import { Calendar, Edit3, Trash2 } from 'lucide-react';
import { MOMENTS } from './constants';

export default function WeightHistoryList({
  bodyMetrics = [],
  preferredUnit,
  handleStartEdit,
  handleDelete
}) {
  return (
    <div className="card" style={{ padding: '16px', borderRadius: '22px', background: '#ffffff', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Calendar size={18} color="#0066ff" /> Bitácora de Pesajes ({bodyMetrics.length})
      </h3>

      {bodyMetrics.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bodyMetrics.map(entry => {
            const momentObj = MOMENTS.find(m => m.id === entry.moment) || MOMENTS[4];
            return (
              <div 
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
                      {entry.weight} {entry.unit || preferredUnit}
                    </strong>
                    <span style={{ fontSize: '10px', background: entry.moment === 'ayunas' ? '#fef3c7' : '#eff6ff', color: entry.moment === 'ayunas' ? '#b45309' : '#1d4ed8', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                      {momentObj.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    📅 {entry.dateString || entry.date} {entry.time ? `• ⏰ ${entry.time}` : ''}
                  </div>
                  {entry.comment && (
                    <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic', marginTop: '2px' }}>
                      💬 {entry.comment}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(entry)}
                    title="Editar registro"
                    style={{ background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    title="Eliminar registro"
                    style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: '13px' }}>
          Aún no has registrado ningún pesaje. ¡Haz clic en "Registrar Nuevo Pesaje" para comenzar!
        </div>
      )}
    </div>
  );
}
