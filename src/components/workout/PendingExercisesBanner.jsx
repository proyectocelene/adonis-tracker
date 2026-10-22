import React from 'react';
import { Plus, ArrowRight, X, AlertCircle, Dumbbell, Zap, RefreshCw } from 'lucide-react';

export default function PendingExercisesBanner({
  pendingData,
  todayDayName = 'Hoy',
  onDistributeAcrossWeek,
  onImportToToday,
  onRollingShift,
  onOpenRescheduleModal,
  onDismiss
}) {
  if (!pendingData || !pendingData.pendingExercises || pendingData.pendingExercises.length === 0) {
    return null;
  }

  const { sourceDayName, sourceDate, pendingExercises, isFullDayMissed, missedDayNames } = pendingData;
  const missedLabel = (missedDayNames && missedDayNames.length > 0)
    ? missedDayNames.join(', ')
    : sourceDayName.split(':')[0];

  return (
    <div 
      className="card"
      style={{
        background: '#0a0d14',
        border: '1px solid #f59e0b',
        borderRadius: '12px',
        padding: '12px 14px',
        marginBottom: '12px',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.12)'
      }}
    >
      {/* HEADER DE ALERTA */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.15)', 
            color: '#fbbf24', 
            padding: '6px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <AlertCircle size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'monospace' }}>
                {isFullDayMissed ? '⚠️ INASISTENCIA DETECTADA' : '⚖️ RECUPERACIÓN DE VOLUMEN'}
              </span>
              <span style={{ fontSize: '9px', background: 'rgba(245, 158, 11, 0.2)', color: '#fef3c7', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
                {pendingExercises.length} ejercicio{pendingExercises.length > 1 ? 's' : ''}
              </span>
            </div>
            <h4 style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '800', color: '#f8fafc' }}>
              {isFullDayMissed 
                ? `Falta registrada: ${missedLabel} (${sourceDate})`
                : `Pendientes de ${missedLabel} (${sourceDate})`}
            </h4>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          title="Descartar aviso para hoy"
          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* CHIPS DE EJERCICIOS PENDIENTES */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
        {pendingExercises.map((ex, idx) => (
          <span
            key={ex.id || `${ex.unifiedCode}_${idx}`}
            style={{
              background: '#131822',
              border: '1px solid #1e293b',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#e2e8f0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Dumbbell size={11} color="#f59e0b" />
            <span>{ex.name}</span>
            <span style={{ color: '#94a3b8', fontSize: '9.5px', fontWeight: '600' }}>
              • {ex.muscleGroup || 'General'}
            </span>
          </span>
        ))}
      </div>

      <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
        {isFullDayMissed
          ? 'Para no perder las adaptaciones hipertróficas semanales, puedes repartir estos ejercicios en los días restantes o sumarlos hoy.'
          : 'Ejercicios sin registrar en la sesión previa listos para equilibrar tus series semanales.'}
      </p>

      {/* BOTONES DE ACCIÓN INTELIGENTES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
        {/* ACCIÓN RECOMENDADA: DISTRIBUCIÓN INTELIGENTE */}
        {onDistributeAcrossWeek && (
          <button
            type="button"
            onClick={() => onDistributeAcrossWeek(pendingExercises)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Zap size={14} fill="#ffffff" />
            <span>⚡ Distribuir en la semana</span>
          </button>
        )}

        {/* SUMAR TODO A HOY */}
        {onImportToToday && (
          <button
            type="button"
            onClick={() => onImportToToday(pendingExercises)}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={13} />
            <span>➕ Sumar a {todayDayName.split(':')[0]}</span>
          </button>
        )}

        {/* DESPLAZAR EN CASCADA (ROLLING SHIFT) */}
        {onRollingShift && (
          <button
            type="button"
            onClick={onRollingShift}
            style={{
              background: '#1e293b',
              color: '#cbd5e1',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 10px',
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
            <span>🔄 Desplazar a mañana</span>
          </button>
        )}

        {/* MOVER MANUALMENTE */}
        {onOpenRescheduleModal && (
          <button
            type="button"
            onClick={onOpenRescheduleModal}
            style={{
              background: '#131822',
              color: '#94a3b8',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '8px 10px',
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
            <ArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
