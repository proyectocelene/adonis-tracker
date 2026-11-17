import React, { useState } from 'react';
import { Plus, ArrowRight, X, AlertCircle, Dumbbell, Zap, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export default function PendingExercisesBanner({
  pendingData,
  todayDayName = 'Hoy',
  onDistributeAcrossWeek,
  onImportToToday,
  onRollingShift,
  onOpenRescheduleModal,
  onDismiss
}) {
  const [showDetails, setShowDetails] = useState(false);

  if (!pendingData || !pendingData.pendingExercises || pendingData.pendingExercises.length === 0) {
    return null;
  }

  const { sourceDayName, sourceDate, pendingExercises, isFullDayMissed, missedDayNames } = pendingData;
  const missedLabel = (missedDayNames && missedDayNames.length > 0)
    ? missedDayNames.join(', ')
    : sourceDayName.split(':')[0];

  return (
    <div 
      className="card tactile-btn"
      style={{
        background: 'var(--bg-surface-secondary)',
        border: '1px solid var(--accent-amber)',
        borderRadius: '12px',
        padding: '10px 12px',
        marginBottom: '10px',
        boxShadow: '0 2px 12px rgba(245, 158, 11, 0.08)'
      }}
    >
      {/* HEADER DE ALERTA COMPACTO */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{ 
            background: 'var(--accent-amber-subtle)', 
            color: 'var(--accent-amber)', 
            padding: '5px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid var(--accent-amber)',
            flexShrink: 0
          }}>
            <AlertCircle size={15} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '9.5px', fontWeight: '900', color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'monospace' }}>
                {isFullDayMissed ? 'Inasistencia Detectada' : 'Recuperación de Volumen'}
              </span>
              <span style={{ fontSize: '9px', background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                {pendingExercises.length} ej.
              </span>
            </div>
            <h4 style={{ margin: '1px 0 0 0', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isFullDayMissed 
                ? `Falta: ${missedLabel} (${sourceDate})`
                : `Pendientes de ${missedLabel} (${sourceDate})`}
            </h4>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setShowDetails(prev => !prev)}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            {showDetails ? (
              <>Ocultar <ChevronUp size={12} /></>
            ) : (
              <>Ver ({pendingExercises.length}) <ChevronDown size={12} /></>
            )}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            title="Descartar aviso para hoy"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* DETALLES EXPANDIBLES */}
      {showDetails && (
        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
            {pendingExercises.map((ex, idx) => (
              <span
                key={ex.id || `${ex.unifiedCode}_${idx}`}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '2px 7px',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  color: 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Dumbbell size={10} color="var(--accent-amber)" />
                <span>{ex.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '9px', fontWeight: '600' }}>
                  • {ex.muscleGroup || 'General'}
                </span>
              </span>
            ))}
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            {isFullDayMissed
              ? 'Para no perder las adaptaciones hipertróficas semanales, reparte estos ejercicios o súmalos a tu sesión.'
              : 'Ejercicios sin registrar listos para equilibrar tus series semanales.'}
          </p>
        </div>
      )}

      {/* BOTONES DE ACCIÓN INTELIGENTES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px', marginTop: '8px' }}>
        {onDistributeAcrossWeek && (
          <button
            type="button"
            onClick={() => onDistributeAcrossWeek(pendingExercises)}
            className="tactile-btn"
            style={{
              background: 'var(--accent-emerald)',
              color: '#000000',
              border: 'none',
              borderRadius: '7px',
              padding: '7px 10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <Zap size={13} fill="#000000" />
            <span>Distribuir semana</span>
          </button>
        )}

        {onImportToToday && (
          <button
            type="button"
            onClick={() => onImportToToday(pendingExercises)}
            className="tactile-btn"
            style={{
              background: 'var(--accent-blue)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '7px',
              padding: '7px 10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <Plus size={13} />
            <span>Sumar a Hoy</span>
          </button>
        )}

        {showDetails && onRollingShift && (
          <button
            type="button"
            onClick={onRollingShift}
            className="tactile-btn"
            style={{
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-strong)',
              borderRadius: '7px',
              padding: '7px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <RefreshCw size={12} />
            <span>Desplazar a mañana</span>
          </button>
        )}

        {showDetails && onOpenRescheduleModal && (
          <button
            type="button"
            onClick={onOpenRescheduleModal}
            className="tactile-btn"
            style={{
              background: 'var(--bg-surface-elevated)',
              color: 'var(--accent-cyan)',
              border: '1px solid var(--border-strong)',
              borderRadius: '7px',
              padding: '7px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <span>Mover manual</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
