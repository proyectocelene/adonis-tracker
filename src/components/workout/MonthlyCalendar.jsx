import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon 
} from 'lucide-react';
import { useIndexedDB as useLocalStorage } from '../../hooks/useIndexedDB';
import CalendarAdherenceStats from './CalendarAdherenceStats';
import CalendarGrid from './CalendarGrid';
import CalendarDayDetailModal from './CalendarDayDetailModal';

export default function MonthlyCalendar({ 
  workoutHistory = [], 
  onSelectDate, 
  onSelectDayId,
  onSaveSession,
  onDeleteSession,
  currentSessions = {},
  setCurrentSessions
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCellModal, setSelectedCellModal] = useState(null);

  const [membershipSettings] = useLocalStorage('coachv2_gym_membership_settings', {
    paymentDay: 21,
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

  const dayIconsMap = {
    d1: "🏋️‍♂️",
    d2: "🦵",
    d3: "🚣",
    d4: "🏋️‍♂️",
    d5: "🦵",
    d6: "⚡️",
    d7: "💤"
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

  const currentMonthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const paymentDay = (membershipSettings.paymentDay === 28 || !membershipSettings.paymentDay) ? 21 : membershipSettings.paymentDay;
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

      {/* ADHERENCIA Y MÉTRICAS */}
      <CalendarAdherenceStats
        totalWorkoutsThisMonth={totalWorkoutsThisMonth}
        totalMonthlyVolume={totalMonthlyVolume}
        isMonthPaid={isMonthPaid}
        paymentDay={paymentDay}
        monthNames={monthNames}
        month={month}
      />

      {/* CUADRÍCULA */}
      <CalendarGrid
        daysOfWeek={daysOfWeek}
        calendarCells={calendarCells}
        isMonthPaid={isMonthPaid}
        paymentDay={paymentDay}
        monthNames={monthNames}
        month={month}
        onSelectCell={(cell) => setSelectedCellModal(cell)}
      />

      {/* MODAL DETALLE DEL DÍA */}
      <CalendarDayDetailModal
        selectedCellModal={selectedCellModal}
        onClose={() => setSelectedCellModal(null)}
        monthNames={monthNames}
        month={month}
        year={year}
        handleMarkTrainedDay={handleMarkTrainedDay}
        handleMarkRestDay={handleMarkRestDay}
        handleMarkMissedDay={handleMarkMissedDay}
        handleDeleteDayLog={handleDeleteDayLog}
        onSelectDayId={onSelectDayId}
        onSelectDate={onSelectDate}
      />
    </div>
  );
}
