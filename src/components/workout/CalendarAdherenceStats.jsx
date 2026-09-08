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
        <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '10px 12px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Trophy size={14} color="#1d4ed8" />
            <span style={{ fontSize: '10px', color: '#1e40af', fontWeight: '800', textTransform: 'uppercase' }}>Sesiones Mes</span>
          </div>
          <strong style={{ fontSize: '17px', color: '#1e3a8a', fontWeight: '900' }}>
            {totalWorkoutsThisMonth} <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700' }}>días</span>
          </strong>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '10px 12px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Flame size={14} color="#15803d" />
            <span style={{ fontSize: '10px', color: '#166534', fontWeight: '800', textTransform: 'uppercase' }}>Carga Acumulada</span>
          </div>
          <strong style={{ fontSize: '17px', color: '#14532d', fontWeight: '900' }}>
            {Math.round(totalMonthlyVolume / 1000).toLocaleString()}k <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>lbs-reps</span>
          </strong>
        </div>
      </div>

      {/* TARJETA INFORMATIVA DE PAGO DE MEMBRESÍA EN ESTE MES */}
      <div 
        style={{
          background: isMonthPaid ? '#ecfdf5' : '#fffbeb',
          border: isMonthPaid ? '1.5px solid #a7f3d0' : '1.5px solid #fde68a',
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
          <CreditCard size={18} color={isMonthPaid ? '#059669' : '#d97706'} />
          <div>
            <strong style={{ fontSize: '12px', color: isMonthPaid ? '#047857' : '#92400e', display: 'block' }}>
              Día de Pago de Membresía: {paymentDay} de {monthName || monthNames[month]}
            </strong>
            <span style={{ fontSize: '11px', color: isMonthPaid ? '#059669' : '#b45309', fontWeight: '600' }}>
              {isMonthPaid ? `Membresía de ${monthName || monthNames[month]} pagada` : `Recordatorio activo en el calendario`}
            </span>
          </div>
        </div>

        <span 
          style={{
            fontSize: '10px',
            fontWeight: '900',
            background: isMonthPaid ? '#059669' : '#d97706',
            color: '#ffffff',
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
