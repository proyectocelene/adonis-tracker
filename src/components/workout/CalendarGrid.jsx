import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CalendarGrid({
  daysOfWeek = [],
  calendarCells = [],
  isMonthPaid = false,
  paymentDay = 21,
  monthNames = [],
  month = 0,
  onSelectCell
}) {
  return (
    <>
      {/* DÍAS DE LA SEMANA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
        {daysOfWeek.map((d, i) => (
          <span key={i} style={{ fontSize: '11px', fontWeight: '800', color: i >= 5 ? '#94a3b8' : '#64748b' }}>
            {d}
          </span>
        ))}
      </div>

      {/* CUADRÍCULA DEL CALENDARIO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {calendarCells.map(cell => {
          if (cell.isPadding) {
            return <div key={cell.key} style={{ minHeight: '58px' }} />;
          }

          const hasTrained = !!cell.session && (cell.session.volume > 0 || cell.session.completedSets > 0 || cell.session.isCompleted);
          const isRestDay = cell.session && cell.session.isRestDay;
          const isMissedDay = cell.session && cell.session.isMissedDay;
          const isNormalWorkout = hasTrained && !isRestDay && !isMissedDay;
          const isToday = cell.isToday;
          const isPaymentDay = cell.isPaymentDay;

          let bg = isToday ? '#eff6ff' : '#f8fafc';
          let border = isToday ? '2px solid #0066ff' : '1px solid #f1f5f9';
          let colorNum = isToday ? '#0066ff' : '#334155';

          if (isPaymentDay) {
            border = isMonthPaid ? '2px solid #10b981' : '2px solid #f59e0b';
            if (!isToday && !hasTrained) {
              bg = isMonthPaid ? '#f0fdf4' : '#fffbeb';
            }
          }

          if (isNormalWorkout) {
             bg = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
             border = isPaymentDay ? '2.5px solid #f59e0b' : '1.5px solid #6ee7b7';
             colorNum = '#065f46';
          } else if (isRestDay) {
             bg = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
             border = isPaymentDay ? '2.5px solid #f59e0b' : '1.5px solid #d1d5db';
             colorNum = '#4b5563';
          } else if (isMissedDay) {
             bg = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
             border = isPaymentDay ? '2.5px solid #f59e0b' : '1.5px solid #fca5a5';
             colorNum = '#b91c1c';
          }

          return (
            <div
              key={cell.key}
              onClick={() => onSelectCell(cell)}
              style={{
                minHeight: '62px',
                padding: '4px 2px',
                borderRadius: '14px',
                background: bg,
                border: border,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isToday ? '0 4px 12px rgba(0, 102, 255, 0.2)' : (isPaymentDay ? '0 4px 10px rgba(245, 158, 11, 0.2)' : 'none')
              }}
            >
              {/* Insignia de Pago de Membresía */}
              {isPaymentDay && (
                <div 
                  title={`Día de Pago de Membresía (${paymentDay} de ${monthNames[month]})`}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-4px',
                    background: isMonthPaid ? '#059669' : '#d97706',
                    color: '#ffffff',
                    fontSize: '8px',
                    fontWeight: '900',
                    padding: '1px 4px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1px'
                  }}
                >
                  💳{isMonthPaid ? '✓' : ''}
                </div>
              )}

              <span style={{ 
                fontSize: '12px', 
                fontWeight: isToday || hasTrained || isPaymentDay ? '900' : '700', 
                color: colorNum 
              }}>
                {cell.dayNumber}
              </span>

              {isNormalWorkout ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                  <CheckCircle2 size={12} color="#059669" />
                  <span style={{ fontSize: '9px', fontWeight: '800', color: '#047857' }}>
                    {cell.session.volume && cell.session.volume > 1000 ? `${Math.round(cell.session.volume / 1000)}k` : '✓'}
                  </span>
                </div>
              ) : isRestDay ? (
                <span style={{ fontSize: '14px', lineHeight: '1' }} title="Día de Descanso">💤</span>
              ) : isMissedDay ? (
                <span style={{ fontSize: '14px', lineHeight: '1' }} title="Falta">❌</span>
              ) : (
                <span style={{ fontSize: '12px', lineHeight: '1' }} title={`Día ${cell.dayId.toUpperCase()}`}>
                  {cell.iconSymbol}
                </span>
              )}

              {isPaymentDay && (
                <span style={{ fontSize: '8px', fontWeight: '900', color: isMonthPaid ? '#059669' : '#b45309' }}>
                  {isMonthPaid ? 'PAGADO' : 'PAGO'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
