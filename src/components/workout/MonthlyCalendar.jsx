import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trophy, 
  Flame, Dumbbell, CheckCircle2, CreditCard, AlertCircle, Check, 
  Trash2, X, Play, Coffee, XCircle, Edit3 
} from 'lucide-react';
import { useIndexedDB as useLocalStorage } from '../../hooks/useIndexedDB';
import { useModal } from '../common/UIComponents';

export default function MonthlyCalendar({ 
  workoutHistory = [], 
  onSelectDate, 
  onSelectDayId,
  onSaveSession,
  onDeleteSession,
  currentSessions = {},
  setCurrentSessions
}) {
  const modal = useModal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCellModal, setSelectedCellModal] = useState(null);

  const [membershipSettings] = useLocalStorage('coachv2_gym_membership_settings', {
    paymentDay: 28,
    gymName: 'Gimnasio',
    amount: '',
    paidMonths: []
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // Mapeo de iconos limpios por tipo de día
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

  // Mapa robusto de historial indexado por fecha exacta (YYYY-MM-DD)
  const historyByDateMap = {};
  workoutHistory.forEach(session => {
    if (session) {
      let dateKey = null;
      if (session.timestamp || session.date) {
        const d = new Date(session.timestamp || session.date);
        if (!isNaN(d.getTime())) {
          dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }
      }
      if (!dateKey && session.id && session.id.startsWith('ses_')) {
        const parts = session.id.split('_');
        if (parts.length >= 2 && parts[1].includes('-')) {
          dateKey = parts[1];
        }
      }

      if (dateKey) {
        // Recalcular volumen exacto a partir de ejercicios completados para evitar desajustes
        let accurateVolume = session.volume || 0;
        let accurateSets = session.completedSets || 0;

        if (session.exercises && typeof session.exercises === 'object') {
          let recVol = 0;
          let recSets = 0;
          Object.values(session.exercises).forEach(exLogs => {
            if (exLogs && typeof exLogs === 'object') {
              Object.keys(exLogs).forEach(k => {
                if (!isNaN(parseInt(k))) {
                  const s = exLogs[k];
                  if (s && s.completed) {
                    recSets++;
                    let w = parseFloat(s.weight) || 0;
                    if (s.unit === 'kg') w *= 2.20462;
                    const r = parseFloat(s.reps) || 0;
                    recVol += (w * r);
                  }
                }
              });
            }
          });
          if (recVol > 0) accurateVolume = Math.round(recVol);
          if (recSets > 0) accurateSets = recSets;
        }

        historyByDateMap[dateKey] = {
          ...session,
          volume: accurateVolume,
          completedSets: accurateSets
        };
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
    if (session && !session.isRestDay && !session.isMissedDay && (session.volume > 0 || session.completedSets > 0 || session.isCompleted)) {
      totalWorkoutsThisMonth++;
      totalMonthlyVolume += (session.volume || 0);
    }
  }

  // Estado del pago de membresía para el mes actual visible en el calendario
  const currentMonthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const paymentDay = membershipSettings.paymentDay || 28;
  const isMonthPaid = (membershipSettings.paidMonths || []).includes(currentMonthKey);

  const calendarCells = [];
  for (let i = 0; i < paddingDays; i++) {
    calendarCells.push({ isPadding: true, key: `pad_${i}` });
  }

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const session = historyByDateMap[dateKey];
    const isToday = dateKey === todayStr;
    const isPaymentDay = day === paymentDay;

    const dayOfWeekIndex = new Date(year, month, day).getDay();
    let protocolDayIndex = dayOfWeekIndex === 0 ? 6 : dayOfWeekIndex - 1;
    const dayId = `d${protocolDayIndex + 1}`;

    calendarCells.push({
      isPadding: false,
      dayNumber: day,
      dateKey,
      session,
      isToday,
      isPaymentDay,
      dayId,
      iconSymbol: dayIconsMap[dayId] || '🏋️',
      key: `day_${day}`
    });
  }

  // Acciones sobre un día en el modal de gestión
  const handleMarkTrainedDay = async (cell) => {
    const sessionId = cell.session?.id || `ses_${cell.dateKey}_${cell.dayId}`;
    const trainedLog = {
      id: sessionId,
      dayId: cell.dayId,
      date: cell.dateKey,
      dateString: new Date(`${cell.dateKey}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      timestamp: new Date(`${cell.dateKey}T12:00:00`).toISOString(),
      isRestDay: false,
      isMissedDay: false,
      isCompleted: true,
      completedSets: cell.session?.completedSets > 0 ? cell.session.completedSets : 1,
      volume: cell.session?.volume > 0 ? cell.session.volume : 1000
    };
    if (onSaveSession) await onSaveSession(trainedLog);
    setSelectedCellModal(null);
  };

  const handleMarkRestDay = async (cell) => {
    const sessionId = cell.session?.id || `ses_${cell.dateKey}_${cell.dayId}`;
    const restLog = {
      id: sessionId,
      dayId: cell.dayId,
      date: cell.dateKey,
      dateString: new Date(`${cell.dateKey}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      timestamp: new Date(`${cell.dateKey}T12:00:00`).toISOString(),
      isRestDay: true,
      isMissedDay: false,
      isCompleted: false,
      volume: 0,
      completedSets: 0
    };
    if (onSaveSession) await onSaveSession(restLog);
    setSelectedCellModal(null);
  };

  const handleMarkMissedDay = async (cell) => {
    const sessionId = cell.session?.id || `ses_${cell.dateKey}_${cell.dayId}`;
    const missedLog = {
      id: sessionId,
      dayId: cell.dayId,
      date: cell.dateKey,
      dateString: new Date(`${cell.dateKey}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      timestamp: new Date(`${cell.dateKey}T12:00:00`).toISOString(),
      isRestDay: false,
      isMissedDay: true,
      isCompleted: false,
      volume: 0,
      completedSets: 0
    };
    if (onSaveSession) await onSaveSession(missedLog);
    setSelectedCellModal(null);
  };

  const handleDeleteDayLog = async (cell) => {
    const sessionId = cell.session?.id || `ses_${cell.dateKey}_${cell.dayId}`;
    if (onDeleteSession) await onDeleteSession(sessionId);

    // Limpiar también cualquier borrador en currentSessions para esa fecha
    if (setCurrentSessions) {
      const sessionKey = `${cell.dateKey}_${cell.dayId}`;
      setCurrentSessions(prev => {
        const next = { ...(prev || {}) };
        delete next[sessionKey];
        return next;
      });
    }

    setSelectedCellModal(null);
  };

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
              💳 Día de Pago de Membresía: {paymentDay} de {monthNames[month]}
            </strong>
            <span style={{ fontSize: '11px', color: isMonthPaid ? '#059669' : '#b45309', fontWeight: '600' }}>
              {isMonthPaid ? `✅ Membresía de ${monthNames[month]} pagada` : `Recordatorio activo en el calendario`}
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
              onClick={() => {
                setSelectedCellModal(cell);
              }}
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

      {/* MODAL INTERACTIVO DE GESTIÓN DEL DÍA */}
      {selectedCellModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 2000
        }}>
          <div className="card animate-fade" style={{ background: '#ffffff', borderRadius: '24px', padding: '20px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div className="flex-between" style={{ marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: '900', textTransform: 'uppercase' }}>
                  Gestión del Calendario
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
                  {selectedCellModal.dayNumber} de {monthNames[month]} {year}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCellModal(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            {/* ESTADO ACTUAL */}
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', border: '1.5px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', marginBottom: '4px' }}>
                ESTADO ACTUAL:
              </div>
              {selectedCellModal.session && !selectedCellModal.session.isRestDay && !selectedCellModal.session.isMissedDay && (selectedCellModal.session.volume > 0 || selectedCellModal.session.isCompleted) ? (
                <div style={{ color: '#047857', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  Entrenado: {selectedCellModal.session.volume > 1000 ? `${selectedCellModal.session.volume.toLocaleString()} lbs-reps` : 'Asistí al gym'} ({selectedCellModal.session.completedSets || 1} series)
                </div>
              ) : selectedCellModal.session?.isRestDay ? (
                <div style={{ color: '#4b5563', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  💤 Marcado como Día de Descanso
                </div>
              ) : selectedCellModal.session?.isMissedDay ? (
                <div style={{ color: '#b91c1c', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ❌ Marcado como Falta / No Entrené
                </div>
              ) : (
                <div style={{ color: '#64748b', fontWeight: '700', fontSize: '13px' }}>
                  ⚪ Sin registro oficial de entrenamiento
                </div>
              )}
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* ACCIÓN RÁPIDA 1: MARCAR COMO ENTRENADO (FUI AL GYM) */}
              <button
                type="button"
                onClick={() => handleMarkTrainedDay(selectedCellModal)}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                <CheckCircle2 size={16} /> ✅ Marcar como Entrenado (Fui al Gym)
              </button>

              {/* ACCIÓN RÁPIDA 2: VER O EDITAR RUTINA DE ESTA FECHA */}
              <button
                type="button"
                onClick={() => {
                  if (onSelectDayId) onSelectDayId(selectedCellModal.dayId);
                  if (onSelectDate) onSelectDate(selectedCellModal.dateKey);
                  setSelectedCellModal(null);
                }}
                style={{
                  background: '#eff6ff',
                  color: '#0066ff',
                  border: '1.5px solid #bfdbfe',
                  padding: '11px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Dumbbell size={16} /> 🏋️ Registrar / Editar Pesos de la Rutina
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleMarkRestDay(selectedCellModal)}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1.5px solid #d1d5db',
                    padding: '10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Coffee size={14} /> 💤 Descanso
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkMissedDay(selectedCellModal)}
                  style={{
                    background: '#fef2f2',
                    color: '#991b1b',
                    border: '1.5px solid #fecaca',
                    padding: '10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <XCircle size={14} /> ❌ Falta
                </button>
              </div>

              {selectedCellModal.session && (
                <button
                  type="button"
                  onClick={() => handleDeleteDayLog(selectedCellModal)}
                  style={{
                    background: '#fff1f2',
                    color: '#e11d48',
                    border: '1.5px solid #fecdd3',
                    padding: '10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '4px'
                  }}
                >
                  <Trash2 size={14} /> Eliminar Registro / Limpiar Día
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
