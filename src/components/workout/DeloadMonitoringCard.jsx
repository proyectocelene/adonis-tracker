import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Heart, BatteryCharging, Sparkles, X } from 'lucide-react';

export default function DeloadMonitoringCard({
  deloadProgress,
  onDeactivateDeload
}) {
  if (!deloadProgress || !deloadProgress.isActive) return null;

  const { elapsedDays, totalDays, remainingDays, progressPercent, completedDeloadWorkouts, endDate, reason } = deloadProgress;

  const formattedEnd = endDate ? new Date(endDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) : '7 días';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #064e3b 0%, #0f766e 100%)',
      border: '1.5px solid #34d399',
      borderRadius: '24px',
      padding: '16px 18px',
      marginBottom: '16px',
      color: '#ffffff',
      boxShadow: '0 8px 24px rgba(6, 78, 59, 0.25)'
    }}>
      {/* CABECERA */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(52, 211, 153, 0.2)',
            border: '1px solid #34d399',
            padding: '8px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🧘
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: '900', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Protocolo Clínico • Microciclo Completo (7 Días)
              </span>
              <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.15)', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                Día {elapsedDays} de {totalDays}
              </span>
            </div>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '16.5px', fontWeight: '900', color: '#ffffff' }}>
              Semana de Descarga Activa & Supercompensación
            </h3>
          </div>
        </div>

        {onDeactivateDeload && (
          <button
            type="button"
            onClick={onDeactivateDeload}
            title="Finalizar modo descarga"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Salir
          </button>
        )}
      </div>

      {/* BARRA DE PROGRESO DE LOS 7 DÍAS */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', color: '#a7f3d0', marginBottom: '6px' }}>
          <span>Progreso del ciclo: {elapsedDays} de {totalDays} días ({progressPercent}%)</span>
          <span>Finaliza: {formattedEnd} ({remainingDays} días restantes)</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.25)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #34d399 0%, #a7f3d0 100%)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* LOS 4 PILARES DEL DELOAD (GARANTÍA CLÍNICA EN TIEMPO REAL) */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.18)',
        borderRadius: '16px',
        padding: '12px 14px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="#34d399" />
          <span style={{ fontSize: '11.5px', color: '#ffffff', fontWeight: '700' }}>
            <strong>Cargas al 80%:</strong> Carga previa multiplicada por 0.8.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="#34d399" />
          <span style={{ fontSize: '11.5px', color: '#ffffff', fontWeight: '700' }}>
            <strong>Volumen al 50%:</strong> 2 series efectivas (S3 y S4 omitidas).
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="#34d399" />
          <span style={{ fontSize: '11.5px', color: '#ffffff', fontWeight: '700' }}>
            <strong>Intensidad RIR 3-4:</strong> Cero fallos para disipar fatiga del SNC.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#38bdf8" />
          <span style={{ fontSize: '11.5px', color: '#a5f3fc', fontWeight: '700' }}>
            <strong>Gamificación Blindada:</strong> 100% de crédito en tu racha.
          </span>
        </div>
      </div>

      {/* NOTA DE MOTIVO */}
      {reason && (
        <span style={{ display: 'block', fontSize: '10.5px', color: '#a7f3d0', marginTop: '10px', fontStyle: 'italic' }}>
          💡 Diagnóstico del Coach: {reason}
        </span>
      )}
    </div>
  );
}
