import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DeloadMonitoringCard({
  deloadProgress,
  onDeactivateDeload
}) {
  if (!deloadProgress || !deloadProgress.isActive) return null;

  const { elapsedDays, totalDays, remainingDays, progressPercent, endDate, reason } = deloadProgress;
  const formattedEnd = endDate ? new Date(endDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) : '7 días';

  return (
    <div 
      className="card"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--accent-emerald)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px',
        marginBottom: '10px',
        color: 'var(--text-main)'
      }}
    >
      {/* CABECERA */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'var(--accent-emerald-subtle)',
            border: '1px solid var(--accent-emerald)',
            padding: '5px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            🧘
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Protocolo Deload • 7 Días
              </span>
              <span className="font-mono-tech" style={{ fontSize: '9.5px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                Día {elapsedDays}/{totalDays}
              </span>
            </div>
            <h3 style={{ margin: '1px 0 0 0', fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
              Descarga Activa & Supercompensación
            </h3>
          </div>
        </div>

        {onDeactivateDeload && (
          <button
            type="button"
            onClick={onDeactivateDeload}
            title="Finalizar modo descarga"
            style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Salir
          </button>
        )}
      </div>

      {/* BARRA DE PROGRESO */}
      <div style={{ marginBottom: '8px' }}>
        <div className="font-mono-tech" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: 'var(--accent-emerald)', marginBottom: '4px' }}>
          <span>Progreso: {elapsedDays}/{totalDays}d ({progressPercent}%)</span>
          <span>Fin: {formattedEnd} ({remainingDays}d)</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'var(--accent-emerald)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* LOS 4 PILARES DEL DELOAD */}
      <div style={{
        background: 'var(--bg-surface-secondary)',
        borderRadius: '8px',
        padding: '8px 10px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '6px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <CheckCircle2 size={13} color="var(--accent-emerald)" />
          <span style={{ fontSize: '10.5px', color: 'var(--text-main)', fontWeight: '600' }}>
            <strong>Cargas al 80%:</strong> × 0.8 de la previa.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <CheckCircle2 size={13} color="var(--accent-emerald)" />
          <span style={{ fontSize: '10.5px', color: 'var(--text-main)', fontWeight: '600' }}>
            <strong>Volumen 50%:</strong> 2 series efectivas.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <CheckCircle2 size={13} color="var(--accent-emerald)" />
          <span style={{ fontSize: '10.5px', color: 'var(--text-main)', fontWeight: '600' }}>
            <strong>RIR 3-4:</strong> Cero fallos concéntricos.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ShieldCheck size={13} color="var(--accent-cyan)" />
          <span style={{ fontSize: '10.5px', color: 'var(--accent-cyan)', fontWeight: '600' }}>
            <strong>Racha protegida:</strong> 100% de crédito.
          </span>
        </div>
      </div>

      {/* NOTA DE MOTIVO */}
      {reason && (
        <span style={{ display: 'block', fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
          💡 Diagnóstico: {reason}
        </span>
      )}
    </div>
  );
}
