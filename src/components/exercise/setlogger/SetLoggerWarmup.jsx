import React from 'react';
import { Flame, Check, Calculator } from 'lucide-react';
import { safeVibrate } from '../../../utils/setLoggerHelpers';

export default function SetLoggerWarmup({
  isFloorMismatch,
  currentLocation,
  prevLocation,
  shouldRenderWarmup,
  warmupPlan,
  suggestedWarmupWeight,
  exerciseData = {},
  exercise,
  handleSanitizedChange,
  setPlateModal,
  toggleSetComplete,
  setManualWarmupOpen
}) {
  return (
    <>
      {/* ALERTA VISUAL SI LA MÁQUINA DE HOY ESTÁ EN OTRO PISO QUE LA GUÍA ANTERIOR */}
      {isFloorMismatch && (
        <div style={{
          background: 'var(--accent-amber-subtle)',
          border: '1px solid var(--accent-amber)',
          borderRadius: '10px',
          padding: '6px 10px',
          marginBottom: '8px',
          fontSize: '10px',
          fontWeight: '700',
          color: 'var(--accent-amber)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '14px' }}>📍</span>
          <span>
            Hoy en <strong>{currentLocation}</strong> (tu registro anterior fue en <strong>{prevLocation}</strong>). El calentamiento está calculado con tu carga previa real; usa C1 y C2 para calibrar la fricción y resistencia de esta máquina antes de tus series efectivas.
          </span>
        </div>
      )}

      {/* SERIES DE CALENTAMIENTO ORGANIZADAS */}
      {shouldRenderWarmup ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px', width: '100%' }}>
          {(warmupPlan?.series?.length > 0 ? warmupPlan.series : [{ id: 0, label: 'C1', pct: '60%', defaultWeight: suggestedWarmupWeight || 0, defaultReps: 10, desc: 'Aproximación' }]).map((wSet) => {
            const wVal = exerciseData[wSet.id] || {};
            const isWDone = !!wVal.completed;

            return (
              <div
                key={wSet.id}
                style={{
                  background: isWDone ? 'var(--accent-amber-subtle)' : 'var(--bg-surface-secondary)',
                  borderRadius: '10px',
                  border: isWDone ? '1px solid var(--accent-amber)' : '1px dashed var(--accent-amber)',
                  padding: '5px 8px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px'
                }}
              >
                {/* IDENTIFICADOR CALENTAMIENTO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '65px' }}>
                  <Flame size={13} color="var(--accent-amber)" />
                  <div>
                    <strong className="font-mono-tech" style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: '900' }}>
                      {wSet.label}
                    </strong>
                    <span className="font-mono-tech" style={{ fontSize: '8.5px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>
                      {wSet.pct} (~{wSet.defaultWeight || 0}#)
                    </span>
                  </div>
                </div>

                {/* INPUT PESO CON CALCULADORA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    id={`warmup-weight-${exercise?.id || 'ex'}-${wSet.id}`}
                    name={`warmup_weight_${exercise?.id || 'ex'}_${wSet.id}`}
                    aria-label={`Peso de aproximación ${wSet.label} para ${exercise?.name || 'ejercicio'}`}
                    placeholder={wSet.defaultWeight ? String(wSet.defaultWeight) : "Peso"}
                    value={wVal.weight ?? ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(',', '.');
                      if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                        handleSanitizedChange(wSet.id, 'weight', val);
                      }
                    }}
                    className="font-mono-tech"
                    style={{
                      width: '48px',
                      height: '32px',
                      padding: '0 2px',
                      borderRadius: '6px',
                      border: '1px solid var(--accent-amber)',
                      fontSize: '13px',
                      fontWeight: '800',
                      textAlign: 'center',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPlateModal({ isOpen: true, setNum: wSet.id, currentWeight: wVal.weight || wSet.defaultWeight || 0 })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Calculadora de discos y placas"
                  >
                    <Calculator size={13} color="var(--text-muted)" />
                  </button>
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700' }}>lbs</span>
                </div>

                {/* INPUT REPS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    id={`warmup-reps-${exercise?.id || 'ex'}-${wSet.id}`}
                    name={`warmup_reps_${exercise?.id || 'ex'}_${wSet.id}`}
                    aria-label={`Repeticiones de aproximación ${wSet.label} para ${exercise?.name || 'ejercicio'}`}
                    placeholder={wSet.defaultReps ? String(wSet.defaultReps) : "Reps"}
                    value={wVal.reps ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^[0-9]+$/.test(val)) {
                        handleSanitizedChange(wSet.id, 'reps', val);
                      }
                    }}
                    className="font-mono-tech"
                    style={{
                      width: '40px',
                      height: '32px',
                      padding: '0 2px',
                      borderRadius: '6px',
                      border: '1px solid var(--accent-amber)',
                      fontSize: '13px',
                      fontWeight: '800',
                      textAlign: 'center',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700' }}>reps</span>
                </div>

                {/* BOTÓN CHECK CALENTAMIENTO */}
                <button
                  type="button"
                  onClick={() => {
                    safeVibrate(20);
                    toggleSetComplete(wSet.id);
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isWDone ? 'var(--accent-amber)' : 'var(--bg-surface-elevated)',
                    color: isWDone ? '#000000' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Check size={16} strokeWidth={3.5} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ marginBottom: '6px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => setManualWarmupOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            + Añadir Calentamiento (Opcional)
          </button>
        </div>
      )}
    </>
  );
}
