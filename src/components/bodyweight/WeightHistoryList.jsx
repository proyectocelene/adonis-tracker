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
    <div className="card" style={{ padding: '16px', borderRadius: '22px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-ios)' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Calendar size={18} color="var(--accent-blue)" /> Bitácora de Pesajes ({bodyMetrics.length})
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
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>
                      {entry.weight} {entry.unit || preferredUnit}
                    </strong>
                    <span style={{ fontSize: '10px', background: entry.moment === 'ayunas' ? 'var(--accent-amber-subtle)' : 'var(--accent-blue-light)', color: entry.moment === 'ayunas' ? 'var(--accent-amber)' : 'var(--accent-blue)', border: entry.moment === 'ayunas' ? '1px solid var(--accent-amber)' : '1px solid var(--accent-blue)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                      {momentObj.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    📅 {entry.dateString || entry.date} {entry.time ? `• ⏰ ${entry.time}` : ''}
                  </div>
                  {/* CHIPS DE BÁSCULA INTELIGENTE / BIOIMPEDANCIA */}
                  {(entry.bodyFatPct || entry.skeletalMusclePct || entry.waistCm || entry.shouldersCm) && (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {entry.bodyFatPct && (
                        <span style={{ fontSize: '10px', background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)', border: '1px solid var(--accent-amber)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                          🔥 {entry.bodyFatPct}% Grasa
                        </span>
                      )}
                      {entry.skeletalMusclePct && (
                        <span style={{ fontSize: '10px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                          💪 {entry.skeletalMusclePct}% Músculo
                        </span>
                      )}
                      {entry.waistCm && (
                        <span style={{ fontSize: '10px', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                          📏 Cintura: {entry.waistCm}cm
                        </span>
                      )}
                      {entry.shouldersCm && (
                        <span style={{ fontSize: '10px', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                          📐 Hombros: {entry.shouldersCm}cm
                        </span>
                      )}
                    </div>
                  )}
                  {entry.comment && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
                      💬 {entry.comment}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(entry)}
                    title="Editar registro"
                    style={{ background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    title="Eliminar registro"
                    style={{ background: 'var(--accent-red-subtle)', color: 'var(--accent-red)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
          Aún no has registrado ningún pesaje. ¡Haz clic en "Registrar Nuevo Pesaje" para comenzar!
        </div>
      )}
    </div>
  );
}
