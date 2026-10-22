import React, { useState } from 'react';
import { X, Calendar, Zap, RotateCcw, Clock, ShieldCheck, CheckCircle2, ArrowRight, Trash2, Dumbbell, Layers, RefreshCw, Sparkles, Scale } from 'lucide-react';
import { generateAdaptiveSplit, getEndOfWeekExpirationDate } from '../../utils/adaptiveRoutineEngine';
import { scientificProtocol } from '../../data/scientificProtocol';

export default function SmartRescheduleModal({
  isOpen,
  onClose,
  activeOverride,
  onApplyOverride,
  onClearOverride,
  onRollingShift,
  onCleanSlate,
  onMoveExerciseBetweenDays,
  currentDayName = '',
  baseRoutine = scientificProtocol,
  activeDays = scientificProtocol
}) {
  const [activeTab, setActiveTab] = useState('split'); // 'split' | 'rebalance'
  const [selectedType, setSelectedType] = useState('5_days'); // '5_days' | '4_days' | '3_days' | 'rolling'

  // Estados para rebalanceo manual de ejercicios entre días
  const [selectedSourceDayId, setSelectedSourceDayId] = useState(activeDays[0]?.id || 'd1');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [selectedTargetDayId, setSelectedTargetDayId] = useState(activeDays[1]?.id || 'd2');

  if (!isOpen) return null;

  const preview5 = generateAdaptiveSplit('5_days', baseRoutine);
  const preview4 = generateAdaptiveSplit('4_days', baseRoutine);
  const preview3 = generateAdaptiveSplit('3_days', baseRoutine);

  const getPreviewList = (type) => {
    if (type === '5_days') return preview5;
    if (type === '4_days') return preview4;
    if (type === '3_days') return preview3;
    return [];
  };

  const handleApplySplit = () => {
    if (selectedType === 'rolling') {
      if (onRollingShift) onRollingShift();
      onClose();
      return;
    }

    const newRoutine = generateAdaptiveSplit(selectedType, baseRoutine);
    const expiresAt = getEndOfWeekExpirationDate();

    const overrideObj = {
      splitType: selectedType,
      expiresAt,
      createdAt: new Date().toISOString(),
      routine: newRoutine
    };

    if (onApplyOverride) {
      onApplyOverride(overrideObj);
    }
    onClose();
  };

  const handleExecuteMove = () => {
    if (!selectedExerciseId) return;
    if (onMoveExerciseBetweenDays) {
      onMoveExerciseBetweenDays(selectedSourceDayId, selectedTargetDayId, selectedExerciseId);
    }
    onClose();
  };

  const currentPreview = getPreviewList(selectedType);
  const sourceDayObj = activeDays.find(d => d.id === selectedSourceDayId) || activeDays[0];
  const sourceExercises = (sourceDayObj?.exercises || []).filter(e => !e.isCardio);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-ios-lg)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        
        {/* CABECERA */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
          color: 'var(--text-main)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="var(--accent-blue)" />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>
                Reestructuración & Balance de Semana
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Ajusta días ante inasistencias o equilibra ejercicios pendientes
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', borderRadius: '12px', padding: '6px', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div style={{ display: 'flex', background: 'var(--bg-surface-secondary)', padding: '6px', gap: '4px', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            style={{
              flex: 1,
              padding: '9px 12px',
              border: 'none',
              borderRadius: '12px',
              background: activeTab === 'split' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'split' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '900',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: activeTab === 'split' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Zap size={14} /> Flex-Split (Días de Semana)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rebalance')}
            style={{
              flex: 1,
              padding: '9px 12px',
              border: 'none',
              borderRadius: '12px',
              background: activeTab === 'rebalance' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'rebalance' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '900',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: activeTab === 'rebalance' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Scale size={14} /> Equilibrar Ejercicios
          </button>
        </div>

        {/* CONTENIDO SEGÚN PESTAÑA */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* PESTAÑA 1: FLEX-SPLIT */}
          {activeTab === 'split' && (
            <>
              {activeOverride && (
                <div style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #86efac',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#166534', display: 'block' }}>
                      ⚡ Split Adaptativo Activo ({activeOverride.splitType?.replace('_', ' ')?.toUpperCase()})
                    </strong>
                    <span style={{ fontSize: '11px', color: '#15803d' }}>
                      Expira automáticamente el domingo a las 23:59.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onClearOverride) onClearOverride();
                      onClose();
                    }}
                    style={{
                      background: 'var(--accent-emerald-subtle)',
                      border: '1px solid var(--accent-emerald)',
                      color: 'var(--accent-emerald)',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Restaurar 6 Días
                  </button>
                </div>
              )}

              <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                Si hoy no puedes ir o esta semana tendrás menos días disponibles, adapta el microciclo sin perder los grupos prioritarios:
              </p>

              {/* OPCIONES DE SPLIT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* ROLLING SHIFT */}
                <div 
                  onClick={() => setSelectedType('rolling')}
                  style={{
                    border: selectedType === 'rolling' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    background: selectedType === 'rolling' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>🔄</span>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                          Mover Sesión a Mañana (Rolling Split)
                        </strong>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Hoy descansas. Tu sesión ({currentDayName || 'de hoy'}) rueda a mañana sin perderla.
                        </span>
                      </div>
                    </div>
                    <input type="radio" name="splitOption" checked={selectedType === 'rolling'} onChange={() => setSelectedType('rolling')} />
                  </div>
                </div>

                {/* 5 DIAS */}
                <div 
                  onClick={() => setSelectedType('5_days')}
                  style={{
                    border: selectedType === '5_days' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    background: selectedType === '5_days' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>⚡</span>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                          Reestructurar a 5 Días (PPL + Upper/Lower)
                        </strong>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Empuje, Pierna, Jalón + Torso y Pierna híbridos. Frecuencia 2x garantizada.
                        </span>
                      </div>
                    </div>
                    <input type="radio" name="splitOption" checked={selectedType === '5_days'} onChange={() => setSelectedType('5_days')} />
                  </div>
                </div>

                {/* 4 DIAS */}
                <div 
                  onClick={() => setSelectedType('4_days')}
                  style={{
                    border: selectedType === '4_days' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    background: selectedType === '4_days' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>🏋️</span>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                          Reestructurar a 4 Días (Torso / Pierna x 2)
                        </strong>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Torso A, Pierna A, Torso B, Pierna B. Máxima sobrecarga en 4 sesiones.
                        </span>
                      </div>
                    </div>
                    <input type="radio" name="splitOption" checked={selectedType === '4_days'} onChange={() => setSelectedType('4_days')} />
                  </div>
                </div>

                {/* 3 DIAS */}
                <div 
                  onClick={() => setSelectedType('3_days')}
                  style={{
                    border: selectedType === '3_days' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    background: selectedType === '3_days' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>🎯</span>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                          Reestructurar a 3 Días (Full Body x 3)
                        </strong>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Estímulo completo cuerpo entero con los movimientos compuestos de mayor rendimiento.
                        </span>
                      </div>
                    </div>
                    <input type="radio" name="splitOption" checked={selectedType === '3_days'} onChange={() => setSelectedType('3_days')} />
                  </div>
                </div>

              </div>

              {/* VISTA PREVIA */}
              {selectedType !== 'rolling' && currentPreview.length > 0 && (
                <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                    📋 Vista Previa del Cronograma Semanal
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {currentPreview.map(day => (
                      <div key={day.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '800', color: day.type === 'rest' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                          {day.name.split(':')[0]}: {day.name.split(':')[1] || day.name}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: day.type === 'rest' ? 'var(--bg-card)' : 'var(--accent-blue-light)',
                          color: day.type === 'rest' ? 'var(--text-muted)' : 'var(--accent-blue)',
                          border: day.type === 'rest' ? '1px solid var(--border-subtle)' : '1px solid var(--accent-blue)',
                          fontWeight: '800'
                        }}>
                          {day.type === 'rest' ? '💤 Descanso' : `${(day.exercises || []).length} ej.`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* PESTAÑA 2: EQUILIBRAR EJERCICIOS ENTRE DÍAS */}
          {activeTab === 'rebalance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--accent-blue-light)', border: '1px solid var(--accent-blue)', borderRadius: '16px', padding: '12px 14px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--accent-blue)', display: 'block' }}>
                  ⚖️ Mover Ejercicio Pendiente a Otro Día
                </strong>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4', display: 'block', marginTop: '2px' }}>
                  Si no completaste un ejercicio ayer o quieres redistribuir tu volumen semanal, selecciona el ejercicio y el día destino para equilibrar tu hipertrofia.
                </span>
              </div>

              {/* PASO 1: SELECCIONAR DÍA ORIGEN */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  1. Día donde estaba el ejercicio:
                </label>
                <select
                  value={selectedSourceDayId}
                  onChange={(e) => {
                    setSelectedSourceDayId(e.target.value);
                    setSelectedExerciseId('');
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '13px', fontWeight: '800', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
                >
                  {activeDays.filter(d => d.type !== 'rest').map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name.split(':')[0]}: {d.name.split(':')[1] || d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PASO 2: SELECCIONAR EJERCICIO */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  2. Ejercicio a transferir:
                </label>
                <select
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '13px', fontWeight: '800', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
                >
                  <option value="">-- Seleccionar Ejercicio --</option>
                  {sourceExercises.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.muscleGroup || 'General'}) • {ex.sets}s × {ex.reps}r
                    </option>
                  ))}
                </select>
              </div>

              {/* PASO 3: SELECCIONAR DÍA DESTINO */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  3. Mover hacia este día (se añadirá al final):
                </label>
                <select
                  value={selectedTargetDayId}
                  onChange={(e) => setSelectedTargetDayId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '13px', fontWeight: '800', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
                >
                  {activeDays.filter(d => d.id !== selectedSourceDayId).map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name.split(':')[0]}: {d.name.split(':')[1] || d.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={!selectedExerciseId}
                onClick={handleExecuteMove}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: selectedExerciseId ? 'var(--accent-blue)' : 'var(--bg-surface-secondary)',
                  color: selectedExerciseId ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: selectedExerciseId ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                <Scale size={16} />
                <span>Transferir y Equilibrar Volumen</span>
              </button>
            </div>
          )}

          {/* SECCIÓN CLEAN SLATE PURGA DEFINITIVA */}
          <div style={{
            marginTop: '8px',
            padding: '12px 14px',
            borderRadius: '16px',
            background: '#fef2f2',
            border: '1.5px solid #fca5a5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div>
              <strong style={{ fontSize: '12.5px', color: '#991b1b', display: 'block' }}>
                🧹 Clean Slate: Purgar Órdenes & Rutinas Viejas
              </strong>
              <span style={{ fontSize: '11px', color: '#b91c1c' }}>
                Elimina órdenes desfasados en móvil/PC y fuerza el Protocolo Oficial limpio. (Tu historial de marcas y 1RM no se tocan).
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onCleanSlate) onCleanSlate();
                onClose();
              }}
              style={{
                background: 'var(--accent-red-subtle)',
                border: '1px solid var(--accent-red)',
                color: 'var(--accent-red)',
                borderRadius: '10px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '900',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🧹 Purgar Caché
            </button>
          </div>

        </div>

        {/* PIE DEL MODAL */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          background: 'var(--bg-surface-secondary)',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
          {activeTab === 'split' && (
            <button
              type="button"
              onClick={handleApplySplit}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              <span>Aplicar Flex-Split</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
