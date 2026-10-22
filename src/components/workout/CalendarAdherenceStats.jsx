import React from 'react';
import { Trophy, Flame, CreditCard } from 'lucide-react';

export default function CalendarAdherenceStats({
  totalWorkoutsThisMonth = 0,
  totalMonthlyVolume = 0,
  isMonthPaid = false,
  paymentDay = 21,
  monthName = '',
  monthNames = [],
  month = 0
}) {
  return (
    <>
      {/* TARJETAS DE MÉTRICAS MENSUALES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <div style={{ background: 'var(--accent-blue-light)', padding: '10px 12px', borderRadius: '16px', border: '1px solid var(--accent-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Trophy size={14} color="var(--accent-blue)" />
            <span style={{ fontSize: '10px', color: 'var(--accent-blue)', fontWeight: '800', textTransform: 'uppercase' }}>Sesiones Mes</span>
          </div>
          <strong style={{ fontSize: '17px', color: 'var(--text-main)', fontWeight: '900' }}>
            {totalWorkoutsThisMonth} <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '700' }}>días</span>
          </strong>
        </div>

        <div style={{ background: 'var(--accent-emerald-subtle)', padding: '10px 12px', borderRadius: '16px', border: '1px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Flame size={14} color="var(--accent-emerald)" />
            <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '800', textTransform: 'uppercase' }}>Carga Acumulada</span>
          </div>
          <strong style={{ fontSize: '17px', color: 'var(--text-main)', fontWeight: '900' }}>
            {Math.round(totalMonthlyVolume / 1000).toLocaleString()}k <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: '700' }}>lbs-reps</span>
          </strong>
        </div>
      </div>

      {/* TARJETA INFORMATIVA DE PAGO DE MEMBRESÍA EN ESTE MES */}
      <div 
        style={{
          background: isMonthPaid ? 'var(--accent-emerald-subtle)' : 'var(--accent-amber-subtle)',
          border: isMonthPaid ? '1px solid var(--accent-emerald)' : '1px solid var(--accent-amber)',
          padding: '10px 14px',
          borderRadius: '16px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={18} color={isMonthPaid ? 'var(--accent-emerald)' : 'var(--accent-amber)'} />
          <div>
            <strong style={{ fontSize: '12px', color: isMonthPaid ? 'var(--accent-emerald)' : 'var(--accent-amber)', display: 'block' }}>
              Día de Pago de Membresía: {paymentDay} de {monthName || monthNames[month]}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {isMonthPaid ? `Membresía de ${monthName || monthNames[month]} pagada` : `Recordatorio activo en el calendario`}
            </span>
          </div>
        </div>

        <span 
          style={{
            fontSize: '10px',
            fontWeight: '900',
            background: isMonthPaid ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            color: '#000000',
            padding: '3px 8px',
            borderRadius: '8px'
          }}
        >
          {isMonthPaid ? 'PAGADO' : `DÍA ${paymentDay}`}
        </span>
      </div>
    </>
  );
}
