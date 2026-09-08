import React, { useState } from 'react';
import { Calendar, Award, CheckCircle2, Flame, Info } from 'lucide-react';
import { useModal } from '../common/UIComponents';

export default function GamifiedHeatmap({ workoutHistory = [] }) {
  const modal = useModal();
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'week'

  // Crear mapa estricto y científico de fechas reales del historial ('YYYY-MM-DD')
  const historyMap = {};
  (workoutHistory || []).forEach(ses => {
    if (!ses) return;
    let dateKey = null;
    if (ses.timestamp || ses.date) {
      const d = new Date(ses.timestamp || ses.date);
      if (!isNaN(d.getTime())) {
        dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }
    }
    if (!dateKey && ses.id && ses.id.startsWith('ses_')) {
      const parts = ses.id.split('_');
      if (parts.length >= 2 && parts[1].includes('-')) {
        dateKey = parts[1];
      }
    }
    if (!dateKey) return;

    // Calcular volumen y series reales de pesas
    let accurateVolume = parseFloat(ses.volume) || 0;
    let accurateSets = parseInt(ses.completedSets, 10) || 0;
    if (ses.exercises && typeof ses.exercises === 'object') {
      let recVol = 0;
      let recSets = 0;
      Object.values(ses.exercises).forEach(exLogs => {
        if (exLogs && typeof exLogs === 'object') {
          Object.keys(exLogs).forEach(k => {
            if (!isNaN(parseInt(k, 10))) {
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

    const isRest = Boolean(ses.isRestDay);
    const isMissed = Boolean(ses.isMissedDay);
    // Un día es entrenado SOLAMENTE si NO fue descanso, NO fue falta, y tuvo volumen/series efectivas
    const isTrained = !isRest && !isMissed && (accurateVolume > 0 || accurateSets > 0 || ses.isCompleted);

    const prev = historyMap[dateKey] || { volume: 0, sets: 0, isTrained: false, isRest: false, isMissed: false };
    const newIsTrained = prev.isTrained || isTrained;

    historyMap[dateKey] = {
      volume: prev.volume + (isTrained ? accurateVolume : 0),
      sets: prev.sets + (isTrained ? accurateSets : 0),
      isTrained: newIsTrained,
      isRest: !newIsTrained ? (prev.isRest || isRest) : false,
      isMissed: (!newIsTrained && !prev.isRest && !isRest) ? (prev.isMissed || isMissed) : false
    };
  });

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Lunes de la semana actual
  const getMondayOfCurrentWeek = () => {
    const d = new Date(today);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const mondayThisWeek = getMondayOfCurrentWeek();
  const dayAbbreviations = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Generar las 8 semanas anteriores
  const weeksMatrix = [];
  const startMatrixMonday = new Date(mondayThisWeek);
  startMatrixMonday.setDate(mondayThisWeek.getDate() - (7 * 7));

  for (let w = 0; w < 8; w++) {
    const weekCol = [];
    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(startMatrixMonday);
      dayDate.setDate(startMatrixMonday.getDate() + (w * 7) + d);
      const dateKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
      const isToday = dateKey === todayKey;
      const isFuture = dayDate > today && !isToday;
      const entry = historyMap[dateKey];

      const hasWorkout = Boolean(entry && entry.isTrained && (entry.volume > 0 || entry.sets > 0));
      const isRestDay = Boolean(entry && !hasWorkout && entry.isRest);
      const isMissedDay = Boolean(entry && !hasWorkout && entry.isMissed);

      weekCol.push({
        date: dayDate,
        dateKey,
        abbr: dayAbbreviations[d],
        dayName: dayNames[d],
        dateNumber: dayDate.getDate(),
        monthShort: dayDate.toLocaleDateString('es-ES', { month: 'short' }),
        isToday,
        isFuture,
        hasWorkout,
        isRestDay,
        isMissedDay,
        volume: hasWorkout ? entry.volume : 0,
        sets: hasWorkout ? entry.sets : 0
      });
    }
    weeksMatrix.push(weekCol);
  }

  // Días de la semana actual
  const currentWeekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayThisWeek);
    d.setDate(mondayThisWeek.getDate() + i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isToday = dateKey === todayKey;
    const isFuture = d > today && !isToday;
    const entry = historyMap[dateKey];

    const hasWorkout = Boolean(entry && entry.isTrained && (entry.volume > 0 || entry.sets > 0));
    const isRestDay = Boolean(entry && !hasWorkout && entry.isRest);
    const isMissedDay = Boolean(entry && !hasWorkout && entry.isMissed);

    currentWeekDays.push({
      date: d,
      dateKey,
      dayName: dayNames[i],
      abbr: dayAbbreviations[i],
      dateNumber: d.getDate(),
      isToday,
      isFuture,
      hasWorkout,
      isRestDay,
      isMissedDay,
      volume: hasWorkout ? entry.volume : 0,
      sets: hasWorkout ? entry.sets : 0
    });
  }

  const handleCellClick = (cell) => {
    if (cell.hasWorkout) {
      modal.showAlert({
        title: `✅ Sesión Completada (${cell.dayName} ${cell.dateNumber} de ${cell.date.toLocaleDateString('es-ES', { month: 'long' })})`,
        message: `¡Gran disciplina! En esta fecha cumpliste con el Protocolo Adonis:\n\n🔥 Volumen Total: ${cell.volume.toLocaleString()} lbs\n📊 Series Efectivas: ${cell.sets}\n\nTu constancia en este día impulsó tu progresión hacia el cuerpo ideal.`,
        variant: 'success'
      });
    } else if (cell.isRestDay) {
      modal.showAlert({
        title: `💤 Día de Descanso Programado (${cell.dayName} ${cell.dateNumber})`,
        message: `En esta fecha descansaste para permitir la recuperación muscular, síntesis de glucógeno y adaptación del SNC.\n\nEl descanso programado es obligatorio para no estancar la sobrecarga progresiva.`,
        variant: 'info'
      });
    } else if (cell.isMissedDay) {
      modal.showAlert({
        title: `⚠️ Sesión No Realizada / Falta (${cell.dayName} ${cell.dateNumber})`,
        message: `En este día no se completó el entrenamiento programado.\n\nNo te preocupes: retoma tu ritmo en la siguiente sesión con disciplina para mantener tu V-Taper en marcha.`,
        variant: 'warning'
      });
    } else if (cell.isToday) {
      modal.showAlert({
        title: `⭐️ Hoy (${cell.dayName} ${cell.dateNumber})`,
        message: `¡Hoy es tu oportunidad de sumar XP! Ve a la pestaña "Rutina del Día", registra tus series de entrenamiento y guarda tu sesión para iluminar esta casilla en verde.`,
        variant: 'info'
      });
    } else if (cell.isFuture) {
      modal.showAlert({
        title: `⏳ Fecha Futura`,
        message: `Esta fecha está programada para las próximas sesiones. ¡Concéntrate en ganar el día de hoy!`,
        variant: 'info'
      });
    } else {
      modal.showAlert({
        title: `⚪️ Sin Registro (${cell.dayName} ${cell.dateNumber})`,
        message: `No hay sesión de pesas ni descanso explícito registrado en esta fecha.`,
        variant: 'info'
      });
    }
  };

  const getCellBg = (cell) => {
    if (cell.isFuture) return '#f8fafc';
    if (cell.hasWorkout) {
      if (cell.volume >= 15000) return '#059669'; // Muy alto
      if (cell.volume >= 8000) return '#10b981'; // Alto
      return '#34d399'; // Regular
    }
    if (cell.isRestDay) return '#cbd5e1'; // Gris azulado de descanso
    if (cell.isMissedDay) return '#fca5a5'; // Rojo tenue de falta
    if (cell.isToday) return '#eff6ff'; // Azul tenue de hoy
    return '#f1f5f9'; // Sin registro pasado
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #dcfce7',
      borderRadius: '20px',
      padding: '16px',
      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.05)',
      marginBottom: '14px'
    }}>
      {/* CABECERA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669'
          }}>
            <Flame size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#064e3b' }}>
              Heatmap de Constancia
            </h3>
            <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: '700' }}>
              Historial real • Verde: Entreno • Gris: Descanso • Rojo: Falta
            </span>
          </div>
        </div>

        {/* TOGGLE VISTA */}
        <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '2px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'matrix' ? '#10b981' : 'transparent',
              color: activeTab === 'matrix' ? '#ffffff' : '#64748b',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            8 Semanas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('week')}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'week' ? '#10b981' : 'transparent',
              color: activeTab === 'week' ? '#ffffff' : '#64748b',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Esta Semana
          </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        /* VISTA MATRIZ DE 8 SEMANAS */
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '4px',
            background: '#f8fafc',
            padding: '10px 8px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            overflowX: 'auto'
          }}>
            {/* Etiquetas de días de la semana */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'space-between', paddingRight: '4px' }}>
              {dayAbbreviations.map((abbr, i) => (
                <span key={i} style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', height: '18px', display: 'flex', alignItems: 'center' }}>
                  {abbr}
                </span>
              ))}
            </div>

            {/* Columnas de Semanas */}
            {weeksMatrix.map((weekCol, wIdx) => (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '18px' }}>
                {weekCol.map((cell) => {
                  let cellTitle = `${cell.dayName} ${cell.dateNumber}: Sin sesión`;
                  if (cell.hasWorkout) cellTitle = `${cell.dayName} ${cell.dateNumber}: ${cell.volume.toLocaleString()} lbs (${cell.sets} series)`;
                  else if (cell.isRestDay) cellTitle = `${cell.dayName} ${cell.dateNumber}: Descanso programado 💤`;
                  else if (cell.isMissedDay) cellTitle = `${cell.dayName} ${cell.dateNumber}: Falta / No entrenó ⚠️`;

                  return (
                    <div
                      key={cell.dateKey}
                      onClick={() => handleCellClick(cell)}
                      title={cellTitle}
                      style={{
                        height: '18px',
                        borderRadius: '4px',
                        background: getCellBg(cell),
                        border: cell.isToday ? '2px solid #0066ff' : (cell.isRestDay ? '1px dashed #94a3b8' : (cell.isMissedDay ? '1px solid #ef4444' : '1px solid rgba(0,0,0,0.04)')),
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                        boxShadow: cell.hasWorkout ? '0 1px 3px rgba(16,185,129,0.2)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px'
                      }}
                    >
                      {cell.isRestDay && '💤'}
                      {cell.isMissedDay && '✕'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* LEYENDA CLARA DEL HEATMAP */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', fontSize: '10px', color: '#64748b', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#34d399' }} />
              <span>Entreno</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#cbd5e1', border: '1px dashed #94a3b8' }} />
              <span>Descanso 💤</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#fca5a5', border: '1px solid #ef4444' }} />
              <span>Faltó ✕</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#eff6ff', border: '1.5px solid #0066ff' }} />
              <span>Hoy</span>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA ESTA SEMANA */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          textAlign: 'center'
        }}>
          {currentWeekDays.map((d) => {
            let bg = '#ffffff';
            let border = '1px solid #e2e8f0';
            let statusIcon = '⚪️';
            let statusText = 'Sin sesión';

            if (d.hasWorkout) {
              bg = '#ecfdf5';
              border = '1.5px solid #10b981';
              statusIcon = '✅';
              statusText = `${Math.round(d.volume / 1000)}k lbs`;
            } else if (d.isRestDay) {
              bg = '#f1f5f9';
              border = '1.5px dashed #94a3b8';
              statusIcon = '💤';
              statusText = 'Descanso';
            } else if (d.isMissedDay) {
              bg = '#fef2f2';
              border = '1.5px solid #f87171';
              statusIcon = '❌';
              statusText = 'Faltó';
            } else if (d.isToday) {
              bg = '#eff6ff';
              border = '2px solid #0066ff';
              statusIcon = '⭐️';
              statusText = 'Hoy';
            }

            return (
              <div
                key={d.dateKey}
                onClick={() => handleCellClick(d)}
                style={{
                  background: bg,
                  border: border,
                  borderRadius: '12px',
                  padding: '8px 2px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: '800', color: d.isToday ? '#0066ff' : '#64748b', display: 'block' }}>
                  {d.abbr}
                </span>
                <strong style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', display: 'block' }}>
                  {d.dateNumber}
                </strong>
                <span style={{ fontSize: '11px', display: 'block', marginTop: '2px' }}>
                  {statusIcon}
                </span>
                <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: '700', display: 'block', marginTop: '1px' }}>
                  {statusText}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
