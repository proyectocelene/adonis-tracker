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
  onOpenRoutineModal,
  bodyWeight = 180
}) {

  const todayDayNumber = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const todayId = `d${todayDayNumber}`;

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Cabecera del Gestor de Rutina con botón rápido para actualizar / pegar */}
      <div className="card" style={{ padding: '14px 16px', background: 'var(--accent-blue-light)', border: '1px solid var(--accent-blue)', borderRadius: '20px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <strong style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: '900', display: 'block' }}>
              🎯 Progresión Estructurada por Día
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
              Auditoría histórica de sobrecarga progresiva y marcas máximas (PR).
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenRoutineModal}
            style={{
              background: 'var(--accent-blue)',
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
                border: isSelected ? '1px solid var(--accent-blue)' : (isToday ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)'),
                background: isSelected ? 'var(--accent-blue)' : (isToday ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)'),
                color: isSelected ? '#ffffff' : (isToday ? 'var(--accent-blue)' : 'var(--text-main)'),
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
                  background: isSelected ? '#ffffff' : 'var(--accent-blue)',
                  color: isSelected ? 'var(--accent-blue)' : '#ffffff',
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
      <div className="card" style={{ padding: '12px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: 'var(--text-main)' }}>
          {activeProgDayObj?.name}
        </h3>
        {activeProgDayObj?.focus && (
          <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
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
        currentProgDayExercises.map(({ exercise, sessionOccurrences, startWeight, currentWeight, prWeight, best1RM, delta, deltaPercent, unit, matchedSources, hasHistory }) => {
          const isExpanded = expandedExerciseProgId === exercise.id;
          const refRm = best1RM > 0 ? best1RM : (prWeight > 0 ? prWeight : 0);
          const relRatio = (refRm > 0 && bodyWeight > 0) ? (refRm / bodyWeight).toFixed(2) : null;

          return (
            <div 
              key={exercise.id}
              className="card animate-fade"
              style={{
                padding: '14px',
                borderRadius: '18px',
                border: hasHistory ? (delta > 0 ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)') : '1px dashed var(--border-subtle)',
                background: 'var(--bg-card)',
                marginBottom: '4px',
                boxShadow: 'var(--shadow-ios-sm)'
              }}
            >
              {/* Encabezado del Ejercicio */}
              <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '900', display: 'block' }}>
                    {exercise.name}
                  </strong>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', fontSize: '10px', fontWeight: '800' }}>
                      💪 {exercise.muscleGroup || 'General'}
                    </span>
                    {exercise.loadFamily && (
                      <span className="badge" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '10px', fontWeight: '800' }}>
                        🏛️ {exercise.loadFamily.replace('Familia ', '')}
                      </span>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '700' }}>
                      Prescripción: {exercise.sets}x{exercise.reps} ({exercise.restTime || '90s'})
                    </span>
                  </div>

                  {matchedSources && matchedSources.length > 0 && matchedSources.some(s => s.toLowerCase() !== exercise.name.toLowerCase()) && (
                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#c084fc', background: 'rgba(124, 58, 237, 0.15)', padding: '3px 8px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.3)', fontWeight: '700', display: 'inline-block' }}>
                      ⚡️ Historial vinculado con: {matchedSources.join(' • ')}
                    </div>
                  )}
                </div>

                {/* Indicador de Delta */}
                {hasHistory ? (
                  <span 
                    className="badge" 
                    style={{ 
                      background: delta > 0 ? 'var(--accent-emerald-subtle)' : (delta === 0 ? 'var(--accent-blue-light)' : 'var(--accent-red-subtle)'),
                      color: delta > 0 ? 'var(--accent-emerald)' : (delta === 0 ? 'var(--accent-blue)' : 'var(--accent-red)'),
                      fontSize: '11px',
                      fontWeight: '900',
                      border: delta > 0 ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {delta > 0 ? `🚀 +${delta} ${unit} (+${deltaPercent}%)` : (delta === 0 ? `⚖️ Estable` : `⚠️ ${delta} ${unit}`)}
                  </span>
                ) : (
                  <span className="badge" style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-muted)', fontSize: '10px' }}>
                    Sin registros
                  </span>
                )}
              </div>

              {/* Fila de Métricas (Inicial vs Actual vs Récord PR vs Fuerza Relativa) con tarjetas limpias */}
              {hasHistory ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
                  <div style={{ textAlign: 'center', background: 'var(--bg-surface-secondary)', padding: '8px 2px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Inicial</span>
                    <strong style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '900' }}>
                      {startWeight} {unit}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'center', background: 'var(--accent-blue-light)', padding: '8px 2px', borderRadius: '12px', border: '1px solid var(--accent-blue)' }}>
                    <span style={{ fontSize: '9px', color: 'var(--accent-blue)', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Actual</span>
                    <strong style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: '900' }}>
                      {currentWeight} {unit}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'center', background: 'var(--accent-amber-subtle)', padding: '8px 2px', borderRadius: '12px', border: '1px solid var(--accent-amber)' }}>
                    <span style={{ fontSize: '9px', color: 'var(--accent-amber)', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Récord 🏆</span>
                    <strong style={{ fontSize: '12px', color: 'var(--accent-amber)', fontWeight: '900' }}>
                      {prWeight} {unit}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(124, 58, 237, 0.12)', padding: '8px 2px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    <span style={{ fontSize: '9px', color: '#c084fc', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Fuerza Rel.</span>
                    <strong style={{ fontSize: '12px', color: '#a855f7', fontWeight: '900' }}>
                      {relRatio ? `${relRatio}x` : '—'}
                    </strong>
                    <span style={{ fontSize: '8px', color: '#c084fc', display: 'block', fontWeight: '700' }}>1RM/PC</span>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--accent-amber-subtle)', border: '1px solid var(--accent-amber)', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', color: 'var(--accent-amber)', marginBottom: '10px' }}>
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
                          background: occ.maxWeight === prWeight ? 'var(--accent-amber-subtle)' : 'var(--bg-surface-secondary)',
                          border: occ.maxWeight === prWeight ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '800',
                          color: occ.maxWeight === prWeight ? 'var(--accent-amber)' : 'var(--text-main)',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{occ.dateStr}</div>
                        <div>{occ.maxWeight}{occ.unit} × {occ.bestReps}r</div>
                        {occ.minWeight && occ.minWeight < occ.maxWeight && (
                          <div style={{ fontSize: '8px', color: 'var(--accent-blue)', fontWeight: '700' }}>
                            Base: {occ.minWeight}{occ.unit}
                          </div>
                        )}
                        {occ.rpeStart && (
                          <div style={{ fontSize: '7.5px', color: 'var(--text-muted)' }}>
                            RPE {occ.rpeStart}{occ.rpeEnd && occ.rpeEnd !== occ.rpeStart ? `➔${occ.rpeEnd}` : ''}
                          </div>
                        )}
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
                    <div className="animate-fade" style={{ marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {sessionOccurrences.map((occ, sIdx) => (
                        <div key={sIdx} style={{ background: 'var(--bg-surface-secondary)', padding: '8px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                          <div className="flex-between" style={{ marginBottom: '4px' }}>
                            <strong style={{ fontSize: '11px', color: 'var(--text-main)' }}>📅 {occ.dateStr} (Semana {occ.weekNumber})</strong>
                            <span style={{ fontSize: '10px', color: 'var(--accent-blue)', fontWeight: '800' }}>Pico: {occ.maxWeight} {occ.unit}</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {occ.detailedSets.map(st => (
                              <span key={st.setNum} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
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
