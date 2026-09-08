import React, { useState } from 'react';
import { Calendar, Flame, CheckCircle2, Circle, Trophy, Info, Sparkles, Award } from 'lucide-react';
import { useModal } from './common/UIComponents';

export default function ConsistencyHeatmap({ workoutHistory = [] }) {
  const modal = useModal();
  const [activeTab, setActiveTab] = useState('week'); // 'week' | 'matrix'

  // Crear mapa estricto de fechas reales del historial ('YYYY-MM-DD')
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

  // Obtener el Lunes de esta semana actual (para centrar y anclar al usuario)
  const getMondayOfCurrentWeek = () => {
    const d = new Date(today);
    const day = d.getDay(); // 0 Dom, 1 Lun...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const mondayThisWeek = getMondayOfCurrentWeek();

  // Generar los 7 días de la semana actual (Lunes a Domingo)
  const weekDays = [];
  const dayNames = ['Lunes', 'Martes', 'Miércol.', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const dayAbbreviations = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

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

    weekDays.push({
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
      volume: hasWorkout ? entry.volume : 0
    });
  }

  // Generar las últimas 8 semanas (8 columnas x 7 días = 56 celdas) para la matriz
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
        dateNumber: dayDate.getDate(),
        monthName: dayDate.toLocaleDateString('es-ES', { month: 'short' }),
        isToday,
        isFuture,
        hasWorkout,
        isRestDay,
        isMissedDay,
        volume: hasWorkout ? entry.volume : 0
      });
    }
    weeksMatrix.push(weekCol);
  }

  // Cálculo de Racha de Consistencia real
  let workoutsThisWeek = weekDays.filter(d => d.hasWorkout).length;
  let totalWorkoutsEver = (workoutHistory || []).filter(s => !s.isRestDay && !s.isMissedDay && (s.volume > 0 || s.completedSets > 0 || s.isCompleted)).length;

  const handleCellClick = (cell) => {
    if (cell.hasWorkout) {
      modal.showAlert({
        title: `✅ Sesión Registrada (${cell.abbr} ${cell.dateNumber} de ${cell.date.toLocaleDateString('es-ES', { month: 'long' })})`,
        message: `¡Increíble disciplina! En esta fecha cumpliste con el Protocolo Adonis archivando un total de:\n\n🔥 Carga Acumulada: ${cell.volume.toLocaleString()} lbs\n\nTu constancia en el gimnasio consolida tus resultados mecánicos.`,
        variant: 'success'
      });
    } else if (cell.isRestDay) {
      modal.showAlert({
        title: `💤 Día de Descanso Programado (${cell.abbr} ${cell.dateNumber})`,
        message: `En esta fecha descansaste para permitir la recuperación muscular, síntesis de glucógeno y adaptación del SNC.\n\nEl descanso programado es obligatorio para no estancar la sobrecarga progresiva.`,
        variant: 'info'
      });
    } else if (cell.isMissedDay) {
      modal.showAlert({
        title: `⚠️ Sesión No Realizada / Falta (${cell.abbr} ${cell.dateNumber})`,
        message: `En este día no se completó el entrenamiento programado.\n\nNo te preocupes: retoma tu ritmo en la siguiente sesión con disciplina.`,
        variant: 'warning'
      });
    } else if (cell.isToday) {
      modal.showAlert({
        title: `⭐️ Día Actual (Hoy, ${cell.dayName || ''})`,
        message: `¡Hoy es el momento! Aún no has archivado el entrenamiento de este día en el sistema.\n\nVe a la pestaña "Rutina", completa tus series y presiona "Guardar Sesión" para iluminar esta casilla en verde.`,
        variant: 'info'
      });
    } else if (cell.isFuture) {
      modal.showAlert({
        title: `⏳ Fecha Futura`,
        message: `Esta casilla pertenece a las próximas semanas de tu ciclo de 8 semanas. Concentrémonos en ganar el día de hoy.`,
        variant: 'info'
      });
    } else {
      modal.showAlert({
        title: `⚪️ Sin Registro (${cell.abbr} ${cell.dateNumber})`,
        message: `En esta fecha no figura una sesión de pesas ni descanso explícito archivado en memoria.`,
        variant: 'info'
      });
    }
  };

  return (
    <div className="card" style={{ padding: '18px', marginBottom: '22px', borderTop: '4px solid #00b464' }}>
      
      {/* Cabecera del Heatmap Centrada e Intuitiva */}
      <div className="flex-between" style={{ marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <Award size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
              Consistencia & Disciplina
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block' }}>
              Sin simulaciones • Toca un día para ver detalles
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('week')}
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'week' ? '#10b981' : '#f1f5f9',
              color: activeTab === 'week' ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'matrix' ? '#0066ff' : '#f1f5f9',
              color: activeTab === 'matrix' ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Matriz 8 Semanas
          </button>
        </div>
      </div>

      {activeTab === 'week' ? (
        /* ================= VISTA INTUITIVA: ESTA SEMANA CENTRADA EN HOY ================= */
        <div className="animate-fade">
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '20px',
            padding: '14px',
            marginBottom: '16px',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', fontWeight: '800' }}>
                🗓️ Semana en curso (Lunes a Domingo)
              </strong>
              <span className="badge" style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '800' }}>
                {workoutsThisWeek} de 5 sesiones logradas
              </span>
            </div>

            {/* Tarjetas de los 7 Días con HOY altamente visible y distinguido */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '6px',
              textAlign: 'center' 
            }}>
              {weekDays.map((d) => {
                let cardBg = '#ffffff';
                let cardBorder = '1px solid #e2e8f0';
                let statusBadge = null;

                if (d.hasWorkout) {
                  cardBg = '#ecfdf5';
                  cardBorder = '1.5px solid #10b981';
                  statusBadge = <CheckCircle2 size={20} color="#10b981" />;
                } else if (d.isRestDay) {
                  cardBg = '#f1f5f9';
                  cardBorder = '1.5px dashed #94a3b8';
                  statusBadge = <span style={{ fontSize: '14px', lineHeight: 1 }}>💤</span>;
                } else if (d.isMissedDay) {
                  cardBg = '#fef2f2';
                  cardBorder = '1.5px solid #f87171';
                  statusBadge = <span style={{ fontSize: '14px', lineHeight: 1, color: '#ef4444', fontWeight: '900' }}>✕</span>;
                } else if (d.isToday) {
                  cardBg = '#eff6ff';
                  cardBorder = '2.5px solid #0066ff';
                  statusBadge = <div style={{ width: '10px', height: '10px', borderRadius: '5px', background: '#0066ff', animation: 'pulse 1.5s infinite' }} />;
                } else {
                  statusBadge = <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#cbd5e1' }} />;
                }

                return (
                  <div
                    key={d.dateKey}
                    onClick={() => handleCellClick(d)}
                    style={{
                      background: cardBg,
                      border: cardBorder,
                      borderRadius: '16px',
                      padding: '10px 4px',
                      cursor: 'pointer',
                      boxShadow: d.isToday ? '0 6px 16px rgba(0, 102, 255, 0.2)' : 'none',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      transform: d.isToday ? 'scale(1.05)' : 'none',
                      zIndex: d.isToday ? 2 : 1
                    }}
                  >
                    {/* Etiqueta de HOY */}
                    {d.isToday && (
                      <span style={{
                        position: 'absolute',
                        top: '-9px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#0066ff',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: '900',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                        boxShadow: '0 2px 6px rgba(0, 102, 255, 0.4)'
                      }}>
                        HOY
                      </span>
                    )}

                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      color: d.isToday ? '#0066ff' : (d.isRestDay ? '#64748b' : (d.isMissedDay ? '#ef4444' : '#64748b')), 
                      display: 'block', 
                      marginTop: d.isToday ? '4px' : '0' 
                    }}>
                      {d.abbr}
                    </span>

                    <strong style={{ 
                      fontSize: '16px', 
                      fontWeight: '800', 
                      color: '#0f172a', 
                      display: 'block', 
                      margin: '4px 0' 
                    }}>
                      {d.dateNumber}
                    </strong>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '22px', marginTop: '4px' }}>
                      {statusBadge}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#475569', margin: '0', lineHeight: '1.5', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            💡 <strong>Sugerencia de Lectura:</strong> Las casillas en verde (✓) corresponden únicamente a sesiones completadas. Los días de descanso programado (💤) se respetan y no se confunden con entrenamientos. La tarjeta azul destaca el día de <strong>Hoy</strong>.
          </p>
        </div>
      ) : (
        /* ================= VISTA MATRIZ DE 8 SEMANAS CON ANCLAJE CLARO ================= */
        <div className="animate-fade">
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            
            {/* Nombres de filas LUN - DOM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '20px', flexShrink: 0 }}>
              {dayAbbreviations.map((name, i) => (
                <div key={i} style={{ height: '24px', display: 'flex', alignItems: 'center', fontSize: '10px', fontWeight: '800', color: '#64748b', paddingRight: '4px' }}>
                  {name}
                </div>
              ))}
            </div>

            {/* Columnas de 8 Semanas */}
            <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
              {weeksMatrix.map((col, colIdx) => {
                const isCurrentWeek = colIdx === weeksMatrix.length - 1;
                return (
                  <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: isCurrentWeek ? '#0066ff' : '#64748b', textAlign: 'center', height: '14px' }}>
                      {isCurrentWeek ? 'ESTA' : `S${colIdx + 1}`}
                    </div>
                    {col.map((cell) => {
                      let cellBg = '#f1f5f9';
                      let cellBorder = '1px solid #e2e8f0';
                      let cellIcon = null;

                      if (cell.hasWorkout) {
                        cellBg = '#10b981';
                        cellBorder = '1px solid #059669';
                      } else if (cell.isRestDay) {
                        cellBg = '#cbd5e1';
                        cellBorder = '1px dashed #94a3b8';
                        cellIcon = <span style={{ fontSize: '9px', lineHeight: 1 }}>💤</span>;
                      } else if (cell.isMissedDay) {
                        cellBg = '#fca5a5';
                        cellBorder = '1px solid #ef4444';
                        cellIcon = <span style={{ fontSize: '9px', lineHeight: 1, color: '#991b1b', fontWeight: '900' }}>✕</span>;
                      } else if (cell.isToday) {
                        cellBg = '#eff6ff';
                        cellBorder = '2px solid #0066ff';
                        cellIcon = <div style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#0066ff' }} />;
                      } else if (cell.isFuture) {
                        cellBg = '#f8fafc';
                      }

                      return (
                        <div
                          key={cell.dateKey}
                          onClick={() => handleCellClick(cell)}
                          title={`${cell.abbr} ${cell.dateNumber} ${cell.monthName}: ${cell.hasWorkout ? 'Completado' : (cell.isRestDay ? 'Descanso' : (cell.isMissedDay ? 'Faltó' : (cell.isToday ? 'Día de HOY' : 'Pendiente')))}`}
                          style={{
                            height: '24px',
                            borderRadius: '6px',
                            background: cellBg,
                            border: cellBorder,
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'transform 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: cell.isToday ? '0 0 8px rgba(0,102,255,0.4)' : 'none'
                          }}
                        >
                          {cellIcon}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leyenda Visual */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '14px', flexWrap: 'wrap', fontSize: '11px', color: '#475569', fontWeight: '700' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#10b981' }} />
              <span>Entrenado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#cbd5e1', border: '1px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>💤</div>
              <span>Descanso</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#991b1b', fontWeight: 'bold' }}>✕</div>
              <span>Faltó</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#eff6ff', border: '2px solid #0066ff' }} />
              <span style={{ color: '#0066ff', fontWeight: '800' }}>Hoy</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
