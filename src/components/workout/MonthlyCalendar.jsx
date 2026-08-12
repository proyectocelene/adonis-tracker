import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trophy, Flame, Dumbbell, CheckCircle2 } from 'lucide-react';

export default function MonthlyCalendar({ workoutHistory = [], onSelectDate, onSelectDayId }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // Mapeo de iconos/símbolos limpios por tipo de día
  const dayIconsMap = {
    d1: "🏋️‍♂️", // Empuje
    d2: "🦵",   // Pierna 1
    d3: "🚣",   // Jalón
    d4: "🏋️‍♂️", // Empuje 2
    d5: "🦵",   // Pierna 2
    d6: "⚡️",   // Torso
    d7: "💤"    // Descanso
  };

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();

  let startingDayOfWeek = firstDayOfMonth.getDay();
  if (startingDayOfWeek === 0) startingDayOfWeek = 7;
  const paddingDays = startingDayOfWeek - 1;

  const historyByDateMap = {};
  workoutHistory.forEach(session => {
    if (session.timestamp || session.dateString) {
      const d = new Date(session.timestamp || session.date);
      if (!isNaN(d.getTime())) {
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        historyByDateMap[dateKey] = session;
      }
    }
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  let totalMonthlyVolume = 0;
  let totalWorkoutsThisMonth = 0;

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const session = historyByDateMap[dateKey];
    if (session) {
      totalWorkoutsThisMonth++;
      totalMonthlyVolume += (session.volume || 0);
    }
  }

  const calendarCells = [];
  for (let i = 0; i < paddingDays; i++) {
    calendarCells.push({ isPadding: true, key: `pad_${i}` });
  }

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const session = historyByDateMap[dateKey];
    const isToday = dateKey === todayStr;

    const dayOfWeekIndex = new Date(year, month, day).getDay();
    let protocolDayIndex = dayOfWeekIndex === 0 ? 6 : dayOfWeekIndex - 1;
    const dayId = `d${protocolDayIndex + 1}`;

    calendarCells.push({
      isPadding: false,
      dayNumber: day,
      dateKey,
      session,
      isToday,
      dayId,
      iconSymbol: dayIconsMap[dayId] || '🏋️',
      key: `day_${day}`
    });
  }

  return (
    <div className="card animate-fade" style={{ padding: '16px', marginBottom: '16px', borderRadius: '24px', background: '#ffffff', border: '1.5px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
      {/* CABECERA DEL MES Y NAVEGACIÓN */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={20} color="#0066ff" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
            {monthNames[month]} {year}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={handlePrevMonth}
            style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS MENSUALES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
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

      {/* DÍAS DE LA SEMANA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
        {daysOfWeek.map((d, i) => (
          <span key={i} style={{ fontSize: '11px', fontWeight: '800', color: i >= 5 ? '#94a3b8' : '#64748b' }}>
            {d}
          </span>
        ))}
      </div>

      {/* CUADRÍCULA DEL CALENDARIO CON ICONOS CLAROS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {calendarCells.map(cell => {
          if (cell.isPadding) {
            return <div key={cell.key} style={{ minHeight: '52px' }} />;
          }

          const hasTrained = !!cell.session;
          const isRestDay = hasTrained && cell.session.isRestDay;
          const isMissedDay = hasTrained && cell.session.isMissedDay;
          const isNormalWorkout = hasTrained && !isRestDay && !isMissedDay;
          const isToday = cell.isToday;

          let bg = isToday ? '#eff6ff' : '#f8fafc';
          let border = isToday ? '2px solid #0066ff' : '1px solid #f1f5f9';
          let colorNum = isToday ? '#0066ff' : '#334155';

          if (isNormalWorkout) {
             bg = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
             border = '1.5px solid #6ee7b7';
             colorNum = '#065f46';
          } else if (isRestDay) {
             bg = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
             border = '1.5px solid #d1d5db';
             colorNum = '#4b5563';
          } else if (isMissedDay) {
             bg = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
             border = '1.5px solid #fca5a5';
             colorNum = '#b91c1c';
          }

          return (
            <div
              key={cell.key}
              onClick={() => {
                if (onSelectDayId) onSelectDayId(cell.dayId);
                if (onSelectDate) onSelectDate(cell.dateKey);
              }}
              style={{
                minHeight: '58px',
                padding: '6px 2px',
                borderRadius: '14px',
                background: bg,
                border: border,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isToday ? '0 4px 12px rgba(0, 102, 255, 0.2)' : 'none'
              }}
            >
              <span style={{ 
                fontSize: '12px', 
                fontWeight: isToday || hasTrained ? '900' : '700', 
                color: colorNum 
              }}>
                {cell.dayNumber}
              </span>

              {isNormalWorkout ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                  <CheckCircle2 size={12} color="#059669" />
                  <span style={{ fontSize: '9px', fontWeight: '800', color: '#047857' }}>
                    {cell.session.volume ? `${Math.round(cell.session.volume / 1000)}k` : '✓'}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
