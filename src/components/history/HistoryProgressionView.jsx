import React from 'react';
import { Layers, ChevronUp, ChevronDown, Dumbbell, Trophy, Calendar, ArrowUpRight } from 'lucide-react';

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
      <div className="card" style={{ padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '18px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', fontWeight: '700' }}>
              Sobrecarga Progresiva por Día
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Historial de cargas, repeticiones y marcas máximas (PR)
            </span>
          </div>
          <button
            type="button"
            className="tactile-btn"
            onClick={onOpenRoutineModal}
            style={{
              background: 'var(--accent-blue)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '11.5px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={13} /> Actualizar Rutina
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
              className="tactile-btn"
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
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                boxShadow: isSelected ? '0 4px 12px rgba(0, 102, 255, 0.25)' : 'none',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              {isToday && (
                <span style={{
                  fontSize: '8px',
                  fontWeight: '700',
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
              <span style={{ fontSize: '10px', opacity: isSelected ? 0.9 : 0.6, fontWeight: '600' }}>
                {exCount} ejercicios
              </span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta Informativa del Día Activo */}
      <div className="card" style={{ padding: '12px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
          {activeProgDayObj?.name}
        </h3>
        {activeProgDayObj?.focus && (
          <p style={{ margin: '3px 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '500' }}>
            {activeProgDayObj.focus}
          </p>
        )}
      </div>

      {/* Lista de Ejercicios con su Progresión */}
      {currentProgDayExercises.length === 0 ? (
        <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>
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
                border: hasHistory ? (delta > 0 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)') : '1px dashed var(--border-subtle)',
                background: 'var(--bg-card)',
                marginBottom: '4px',
                boxShadow: 'var(--shadow-ios-sm)'
              }}
            >
              {/* Encabezado del Ejercicio */}
              <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '700', display: 'block' }}>
                    {exercise.name}
                  </strong>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', fontSize: '10px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Dumbbell size={10} /> {exercise.muscleGroup || 'General'}
                    </span>
                    {exercise.loadFamily && (
                      <span className="badge" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.25)', fontSize: '10px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Layers size={10} /> {exercise.loadFamily.replace('Familia ', '')}
                      </span>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                      Prescripción: {exercise.sets}x{exercise.reps} ({exercise.restTime || '90s'})
                    </span>
                  </div>

                  {matchedSources && matchedSources.length > 0 && matchedSources.some(s => s.toLowerCase() !== exercise.name.toLowerCase()) && (
                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#a855f7', background: 'rgba(124, 58, 237, 0.1)', padding: '3px 8px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)', fontWeight: '600', display: 'inline-block' }}>
                      Historial vinculado con: {matchedSources.join(' • ')}
                    </div>
                  )}
                </div>

                {/* Indicador de Delta */}
                {hasHistory ? (
                  <span 
                    className="badge font-mono-tech" 
                    style={{ 
                      background: delta > 0 ? 'var(--accent-emerald-subtle)' : (delta === 0 ? 'var(--accent-blue-light)' : 'var(--accent-red-subtle)'),
                      color: delta > 0 ? 'var(--accent-emerald)' : (delta === 0 ? 'var(--accent-blue)' : 'var(--accent-red)'),
                      fontSize: '11px',
                      fontWeight: '700',
                      border: delta > 0 ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    {delta > 0 ? (
                      <>
                        <ArrowUpRight size={12} />
                        +{delta} {unit} (+{deltaPercent}%)
                      </>
                    ) : (delta === 0 ? `Estable` : `${delta} ${unit}`)}
                  </span>
                ) : (
                  <span className="badge" style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-muted)', fontSize: '10px', fontWeight: '500' }}>
                    Sin registros
                  </span>
                )}
              </div>

              {/* Fila de Métricas (Inicial vs Actual vs Récord PR vs Fuerza Relativa) con tarjetas limpias */}
              {hasHistory ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
                  <div style={{ textAlign: 'center', background: 'var(--bg-surface-secondary)', padding: '8px 2px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Inicial</span>
                    <strong className="font-mono-tech" style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                      {startWeight} {unit}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'center', background: 'var(--accent-blue-light)', padding: '8px 2px', borderRadius: '12px', border: '1px solid var(--accent-blue)' }}>
                    <span style={{ fontSize: '9px', color: 'var(--accent-blue)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Actual</span>
                    <strong className="font-mono-tech" style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: '700' }}>
                      {currentWeight} {unit}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'center', background: 'var(--accent-amber-subtle)', padding: '8px 2px', borderRadius: '12px', border: '1px solid var(--accent-amber)' }}>
                    <span style={{ fontSize: '9px', color: 'var(--accent-amber)', textTransform: 'uppercase', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      Récord <Trophy size={9} />
                    </span>
                    <strong className="font-mono-tech" style={{ fontSize: '12px', color: 'var(--accent-amber)', fontWeight: '700', display: 'block' }}>
                      {prWeight} {unit}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(124, 58, 237, 0.1)', padding: '8px 2px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                    <span style={{ fontSize: '9px', color: '#a855f7', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Fuerza Rel.</span>
                    <strong className="font-mono-tech" style={{ fontSize: '12px', color: '#a855f7', fontWeight: '700' }}>
                      {relRatio ? `${relRatio}x` : '—'}
                    </strong>
                    <span style={{ fontSize: '8px', color: '#a855f7', display: 'block', fontWeight: '600' }}>1RM/PC</span>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--accent-amber-subtle)', border: '1px solid var(--accent-amber)', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', color: 'var(--accent-amber)', marginBottom: '10px' }}>
                  Registra tus cargas hoy para comenzar a trazar la sobrecarga progresiva de este ejercicio.
                </div>
              )}

              {/* Secuencia Temporal de Evolución (Badges por Sesión) */}
              {hasHistory && sessionOccurrences.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
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
                          fontWeight: '700',
                          color: occ.maxWeight === prWeight ? 'var(--accent-amber)' : 'var(--text-main)',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{occ.dateStr}</div>
                        <div className="font-mono-tech">{occ.maxWeight}{occ.unit} × {occ.bestReps}r</div>
                        {occ.minWeight && occ.minWeight < occ.maxWeight && (
                          <div style={{ fontSize: '8px', color: 'var(--accent-blue)', fontWeight: '600' }}>
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
                    className="tactile-btn"
                    onClick={() => setExpandedExerciseProgId(isExpanded ? null : exercise.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-blue)',
                      fontSize: '11px',
                      fontWeight: '700',
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
                            <strong style={{ fontSize: '11px', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={11} /> {occ.dateStr} (Semana {occ.weekNumber})
                            </strong>
                            <span className="font-mono-tech" style={{ fontSize: '10px', color: 'var(--accent-blue)', fontWeight: '700' }}>Pico: {occ.maxWeight} {occ.unit}</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {occ.detailedSets.map(st => (
                              <span key={st.setNum} className="font-mono-tech" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '600' }}>
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
