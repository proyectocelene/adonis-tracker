import React from 'react';
import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

export default function HistoryProgressionView({
  activeDays = [],
  customExercisesMap = {},
  selectedProgDayId,
  setSelectedProgDayId,
  activeProgDayObj,
  currentProgDayExercises = [],
  expandedExerciseProgId,
  setExpandedExerciseProgId,
  onOpenRoutineModal
}) {
  const todayDayNumber = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const todayId = `d${todayDayNumber}`;

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Cabecera del Gestor de Rutina con botón rápido para actualizar / pegar */}
      <div className="card" style={{ padding: '14px 16px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '20px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <strong style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: '900', display: 'block' }}>
              🎯 Progresión Estructurada por Día
            </strong>
            <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600' }}>
              Auditoría histórica de sobrecarga progresiva y marcas máximas (PR).
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenRoutineModal}
            style={{
              background: '#0066ff',
              color: '#ffffff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0, 102, 255, 0.25)'
            }}
          >
            <Layers size={14} /> Actualizar Rutina
          </button>
        </div>
      </div>

      {/* Selector Horizontal de Días Elegante y Ergonómico */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '2px 2px 6px 2px', scrollbarWidth: 'none' }}>
        {activeDays.map(day => {
          const isSelected = selectedProgDayId === day.id;
          const isToday = day.id === todayId;
          const dayShort = day.name.split(':')[0];
          const exCount = (day.exercises?.length || 0) + (customExercisesMap[day.id]?.length || 0);

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedProgDayId(day.id)}
              style={{
                flex: '0 0 auto',
                minWidth: '78px',
                padding: '8px 10px',
                borderRadius: '14px',
                border: isSelected ? '2px solid #0066ff' : (isToday ? '1.5px solid #38bdf8' : '1px solid #cbd5e1'),
                background: isSelected ? '#0066ff' : (isToday ? '#f0f9ff' : '#ffffff'),
                color: isSelected ? '#ffffff' : '#1e293b',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                boxShadow: isSelected ? '0 4px 12px rgba(0, 102, 255, 0.3)' : 'none',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              {isToday && (
                <span style={{
                  fontSize: '8px',
                  fontWeight: '900',
                  background: isSelected ? '#ffffff' : '#0066ff',
                  color: isSelected ? '#0066ff' : '#ffffff',
                  padding: '1px 5px',
                  borderRadius: '6px',
                  lineHeight: '1.2',
                  marginBottom: '2px'
                }}>
                  HOY
                </span>
              )}
              <span>{dayShort}</span>
              <span style={{ fontSize: '10px', opacity: isSelected ? 0.9 : 0.6, fontWeight: '700' }}>
                {exCount} ejercicios
              </span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta Informativa del Día Activo */}
      <div className="card" style={{ padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>
          {activeProgDayObj?.name}
        </h3>
        {activeProgDayObj?.focus && (
          <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            🎯 {activeProgDayObj.focus}
          </p>
        )}
      </div>

      {/* Lista de Ejercicios con su Progresión */}
      {currentProgDayExercises.length === 0 ? (
        <div className="card" style={{ padding: '30px', textAlign: 'center', color: '#64748b', borderRadius: '16px' }}>
          Día de descanso sin ejercicios programados.
        </div>
      ) : (
        currentProgDayExercises.map(({ exercise, sessionOccurrences, startWeight, currentWeight, prWeight, delta, deltaPercent, unit, matchedSources, hasHistory }) => {
          const isExpanded = expandedExerciseProgId === exercise.id;

          return (
            <div 
              key={exercise.id}
              className="card animate-fade"
              style={{
                padding: '14px',
                borderRadius: '18px',
                border: hasHistory ? (delta > 0 ? '1.5px solid #86efac' : '1.5px solid #cbd5e1') : '1.5px dashed #cbd5e1',
                background: '#ffffff',
                marginBottom: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              {/* Encabezado del Ejercicio */}
              <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '900', display: 'block' }}>
                    {exercise.name}
                  </strong>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '10px', fontWeight: '800' }}>
                      💪 {exercise.muscleGroup || 'General'}
                    </span>
                    {exercise.loadFamily && (
                      <span className="badge" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', fontSize: '10px', fontWeight: '800' }}>
                        🏛️ {exercise.loadFamily.replace('Familia ', '')}
                      </span>
                    )}
                    <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: '700' }}>
                      Prescripción: {exercise.sets}x{exercise.reps} ({exercise.restTime || '90s'})
                    </span>
                  </div>

                  {matchedSources && matchedSources.length > 0 && matchedSources.some(s => s.toLowerCase() !== exercise.name.toLowerCase()) && (
                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#6d28d9', background: '#f5f3ff', padding: '3px 8px', borderRadius: '8px', border: '1px solid #ddd6fe', fontWeight: '700', display: 'inline-block' }}>
                      ⚡️ Historial vinculado con: {matchedSources.join(' • ')}
                    </div>
                  )}
                </div>

                {/* Indicador de Delta */}
                {hasHistory ? (
                  <span 
                    className="badge" 
                    style={{ 
                      background: delta > 0 ? '#dcfce7' : (delta === 0 ? '#eff6ff' : '#fee2e2'),
                      color: delta > 0 ? '#15803d' : (delta === 0 ? '#1d4ed8' : '#b91c1c'),
                      fontSize: '11px',
                      fontWeight: '900',
                      border: delta > 0 ? '1px solid #86efac' : '1px solid #bfdbfe'
                    }}
                  >
                    {delta > 0 ? `🚀 +${delta} ${unit} (+${deltaPercent}%)` : (delta === 0 ? `⚖️ Estable` : `⚠️ ${delta} ${unit}`)}
                  </span>
                ) : (
                  <span className="badge" style={{ background: '#f1f5f9', color: '#94a3b8', fontSize: '10px' }}>
                    Sin registros
                  </span>
                )}
              </div>

              {/* Fila de Métricas (Inicial vs Actual vs Récord PR) con tarjetas limpias */}
              {hasHistory ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ textAlign: 'center', background: '#f8fafc', padding: '8px 4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Inicial</span>
                    <strong style={{ fontSize: '13px', color: '#334155', fontWeight: '900' }}>
                      {startWeight} {unit}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'center', background: '#eff6ff', padding: '8px 4px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <span style={{ fontSize: '9px', color: '#1e40af', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Actual</span>
                    <strong style={{ fontSize: '14px', color: '#0066ff', fontWeight: '900' }}>
                      {currentWeight} {unit}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'center', background: '#fffbeb', padding: '8px 4px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                    <span style={{ fontSize: '9px', color: '#92400e', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Récord (PR) 🏆</span>
                    <strong style={{ fontSize: '13px', color: '#b45309', fontWeight: '900' }}>
                      {prWeight} {unit}
                    </strong>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', color: '#92400e', marginBottom: '10px' }}>
                  📌 Registra tus cargas hoy para comenzar a trazar la sobrecarga progresiva de este ejercicio.
                </div>
              )}

              {/* Secuencia Temporal de Evolución (Badges por Sesión) */}
              {hasHistory && sessionOccurrences.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                    Historial de Sobrecarga por Sesión:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                    {sessionOccurrences.map((occ, idx) => (
                      <div 
                        key={idx}
                        style={{
                          flex: '0 0 auto',
                          background: occ.maxWeight === prWeight ? '#fef3c7' : '#f1f5f9',
                          border: occ.maxWeight === prWeight ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '800',
                          color: occ.maxWeight === prWeight ? '#78350f' : '#1e293b',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '9px', color: '#64748b' }}>{occ.dateStr}</div>
                        <div>{occ.maxWeight}{occ.unit} × {occ.bestReps}r</div>
                        {occ.sourceName && occ.sourceName.toLowerCase() !== exercise.name.toLowerCase() && (
                          <div style={{ fontSize: '8px', color: '#7c3aed', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {occ.sourceName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón para Desplegar Detalle Completo de Series */}
              {hasHistory && (
                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedExerciseProgId(isExpanded ? null : exercise.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#0066ff',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 0'
                    }}
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {isExpanded ? 'Ocultar detalle de series' : `Ver desglose de series (${sessionOccurrences.length} sesiones)`}
                  </button>

                  {isExpanded && (
                    <div className="animate-fade" style={{ marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {sessionOccurrences.map((occ, sIdx) => (
                        <div key={sIdx} style={{ background: '#f8fafc', padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          <div className="flex-between" style={{ marginBottom: '4px' }}>
                            <strong style={{ fontSize: '11px', color: '#1e293b' }}>📅 {occ.dateStr} (Semana {occ.weekNumber})</strong>
                            <span style={{ fontSize: '10px', color: '#0066ff', fontWeight: '800' }}>Pico: {occ.maxWeight} {occ.unit}</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {occ.detailedSets.map(st => (
                              <span key={st.setNum} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                                S{st.setNum}: {st.weight}{st.unit} × {st.reps}r (RPE {st.rpe})
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
