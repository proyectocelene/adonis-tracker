import React from 'react';
import { Check, Calculator } from 'lucide-react';
import { safeVibrate } from '../../../utils/setLoggerHelpers';

export default function SetRowInputs({
  setNum,
  exercise,
  setVal = {},
  prevVal = {},
  overloadTarget = null,
  isUnilateral,
  machineConfig,
  isDone,
  isRepsHighAlert,
  isWeightJumpAlert,
  repsNum,
  prevWeightNum,
  weightNum,
  rpeBorder,
  rpeColor,
  rpeBg,
  handleSanitizedChange,
  handleSetChange,
  toggleSetComplete,
  setPlateModal
}) {
  return (
    <>
      {/* LÍNEA DE ENTRADA DE DATOS (HIGH DENSITY COCKPIT ROW) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4px',
        width: '100%',
        flexWrap: 'nowrap'
      }}>
        {/* PESO CON STEPPERS RÁPIDOS Y CALCULADORA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => {
              safeVibrate(10);
              const step = machineConfig?.increment ? Number(machineConfig.increment) : 5;
              const current = parseFloat(setVal.weight) || parseFloat(prevVal.weight) || 0;
              const next = Math.max(0, current - step);
              handleSanitizedChange(setNum, 'weight', next > 0 ? String(next) : '');
            }}
            className="tactile-btn"
            title="Bajar carga (-5# o incremento)"
            style={{
              width: '18px',
              height: '34px',
              borderRadius: '5px 0 0 5px',
              border: '1px solid var(--border-strong)',
              borderRight: 'none',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            -
          </button>
          <input
            type="text"
            inputMode="decimal"
            id={`set-weight-${exercise?.id || 'ex'}-${setNum}`}
            name={`weight_${exercise?.id || 'ex'}_${setNum}`}
            aria-label={`Peso serie ${setNum} de ${exercise?.name || 'ejercicio'}`}
            placeholder={overloadTarget?.suggestedWeight > 0 ? String(overloadTarget.suggestedWeight) : 'Peso'}
            value={setVal.weight === null || setVal.weight === undefined || setVal.weight === 'null' ? '' : setVal.weight}
            onChange={(e) => {
              const raw = e.target.value.replace(',', '.');
              if (raw === '' || /^[0-9]*\.?[0-9]*$/.test(raw)) {
                handleSanitizedChange(setNum, 'weight', raw);
              }
            }}
            className="font-mono-tech"
            style={{
              width: isUnilateral ? '44px' : '48px',
              height: '34px',
              padding: '0 2px',
              borderRadius: '0',
              border: isWeightJumpAlert ? '1.5px solid var(--accent-amber)' : '1px solid var(--border-strong)',
              borderLeft: 'none',
              borderRight: 'none',
              fontSize: '14px',
              fontWeight: '800',
              textAlign: 'center',
              background: 'var(--bg-surface-secondary)',
              color: 'var(--text-main)'
            }}
          />
          <button
            type="button"
            onClick={() => {
              safeVibrate(10);
              const step = machineConfig?.increment ? Number(machineConfig.increment) : 5;
              const current = parseFloat(setVal.weight) || parseFloat(prevVal.weight) || 0;
              const next = current + step;
              handleSanitizedChange(setNum, 'weight', String(next));
            }}
            className="tactile-btn"
            title="Subir carga (+5# o incremento)"
            style={{
              width: '18px',
              height: '34px',
              borderRadius: '0 5px 5px 0',
              border: '1px solid var(--border-strong)',
              borderLeft: 'none',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--accent-emerald)',
              fontSize: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setPlateModal({ isOpen: true, setNum, currentWeight: setVal.weight || 0 })}
            title="Calculadora de discos y placas"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Calculator size={13} color="var(--text-muted)" />
          </button>
          <span className="font-mono-tech" style={{ fontSize: isUnilateral ? '9px' : '9.5px', color: 'var(--text-muted)', fontWeight: '700', whiteSpace: 'nowrap' }}>
            {isUnilateral ? `${exercise?.defaultUnit || 'lbs'}/l` : (exercise?.defaultUnit || 'lbs')}
          </span>
        </div>

        {/* REPETICIONES: MODO BILATERAL O POR LADO */}
        {isUnilateral ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface-secondary)', borderRadius: '6px', border: '1px solid var(--border-strong)', padding: '0 2px', height: '34px' }}>
              <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--accent-cyan)', fontWeight: '800', marginRight: '1px' }}>I:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id={`set-repsL-${exercise?.id || 'ex'}-${setNum}`}
                name={`repsL_${exercise?.id || 'ex'}_${setNum}`}
                aria-label={`Reps lado izquierdo serie ${setNum}`}
                placeholder="Izq"
                value={setVal.repsL !== undefined && setVal.repsL !== null && setVal.repsL !== 'null' ? setVal.repsL : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9]+$/.test(val)) {
                    const rL = val !== '' ? Number(val) : '';
                    const rR = setVal.repsR !== undefined && setVal.repsR !== '' ? Number(setVal.repsR) : rL;
                    let avgR = '';
                    if (rL !== '' && rR !== '') {
                      if (rL === 1 && rR >= 5) avgR = String(rR);
                      else if (rR === 1 && rL >= 5) avgR = String(rL);
                      else avgR = String(Math.round((Number(rL) + Number(rR)) / 2));
                    } else if (rL !== '') {
                      avgR = String(rL);
                    }
                    handleSanitizedChange(setNum, {
                      repsL: val,
                      reps: avgR
                    });
                  }
                }}
                className="font-mono-tech"
                style={{
                  width: '24px',
                  padding: '0',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  textAlign: 'center',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface-secondary)', borderRadius: '6px', border: '1px solid var(--border-strong)', padding: '0 2px', height: '34px' }}>
              <span className="font-mono-tech" style={{ fontSize: '9px', color: 'var(--accent-emerald)', fontWeight: '800', marginRight: '1px' }}>D:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id={`set-repsR-${exercise?.id || 'ex'}-${setNum}`}
                name={`repsR_${exercise?.id || 'ex'}_${setNum}`}
                aria-label={`Reps lado derecho serie ${setNum}`}
                placeholder="Der"
                value={setVal.repsR !== undefined && setVal.repsR !== null && setVal.repsR !== 'null' ? setVal.repsR : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9]+$/.test(val)) {
                    const rR = val !== '' ? Number(val) : '';
                    const rL = setVal.repsL !== undefined && setVal.repsL !== '' ? Number(setVal.repsL) : rR;
                    let avgR = '';
                    if (rL !== '' && rR !== '') {
                      if (rL === 1 && rR >= 5) avgR = String(rR);
                      else if (rR === 1 && rL >= 5) avgR = String(rL);
                      else avgR = String(Math.round((Number(rL) + Number(rR)) / 2));
                    } else if (rR !== '') {
                      avgR = String(rR);
                    }
                    handleSanitizedChange(setNum, {
                      repsR: val,
                      reps: avgR
                    });
                  }
                }}
                className="font-mono-tech"
                style={{
                  width: '24px',
                  padding: '0',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  textAlign: 'center',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id={`set-reps-${exercise?.id || 'ex'}-${setNum}`}
              name={`reps_${exercise?.id || 'ex'}_${setNum}`}
              aria-label={`Repeticiones serie ${setNum} de ${exercise?.name || 'ejercicio'}`}
              placeholder={overloadTarget?.suggestedReps > 0 ? String(overloadTarget.suggestedReps) : 'Reps'}
              value={setVal.reps === null || setVal.reps === undefined || setVal.reps === 'null' ? '' : setVal.reps}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^[0-9]+$/.test(val)) {
                  handleSanitizedChange(setNum, 'reps', val);
                }
              }}
              className="font-mono-tech"
              style={{
                width: '44px',
                height: '34px',
                padding: '0 2px',
                borderRadius: '6px',
                border: isRepsHighAlert ? '1.5px solid var(--accent-red)' : '1px solid var(--border-strong)',
                fontSize: '14px',
                fontWeight: '800',
                textAlign: 'center',
                background: 'var(--bg-surface-secondary)',
                color: 'var(--text-main)'
              }}
            />
            <span className="font-mono-tech" style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '700' }}>r</span>
          </div>
        )}

        {/* SELECTOR RPE SEMÁNTICO RIR */}
        <select
          id={`set-rpe-${exercise?.id || 'ex'}-${setNum}`}
          name={`rpe_${exercise?.id || 'ex'}_${setNum}`}
          aria-label={`RPE serie ${setNum} de ${exercise?.name || 'ejercicio'}`}
          value={setVal.rpe || '8'}
          onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
          className="font-mono-tech"
          style={{
            width: '54px',
            height: '34px',
            padding: '0 2px',
            borderRadius: '6px',
            border: `1px solid ${rpeBorder}`,
            fontSize: '10.5px',
            fontWeight: '800',
            textAlign: 'center',
            background: rpeBg,
            color: rpeColor,
            cursor: 'pointer'
          }}
        >
          <option value="6">RPE 6</option>
          <option value="7">RPE 7</option>
          <option value="8">RPE 8</option>
          <option value="8.5">RPE 8.5</option>
          <option value="9">RPE 9</option>
          <option value="9.5">RPE 9.5</option>
          <option value="10">RPE 10</option>
        </select>

        {/* BOTÓN CHECK SERIE EFECTIVA */}
        <button
          type="button"
          className="tactile-btn"
          onClick={() => {
            safeVibrate(30);
            toggleSetComplete(setNum);
          }}
          aria-label={`Serie ${setNum}: ${isDone ? 'Completada (Toca para desmarcar)' : 'Pendiente (Toca para marcar)'}`}
          title={isDone ? 'Serie completada (Toca para desmarcar)' : 'Marcar serie como completada'}
          style={{
            width: '36px',
            height: '34px',
            borderRadius: '8px',
            border: 'none',
            background: isDone ? 'var(--accent-emerald)' : 'var(--bg-surface-elevated)',
            color: isDone ? '#000000' : 'var(--text-muted)',
            boxShadow: isDone ? '0 0 10px var(--accent-emerald-subtle)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
        >
          <Check size={18} strokeWidth={3.5} />
        </button>
      </div>

      {/* ALERTAS ANTI-TYPO */}
      {isRepsHighAlert && (
        <div style={{ fontSize: '9.5px', fontWeight: '800', color: 'var(--accent-red)', background: 'var(--accent-red-subtle)', border: '1px solid var(--accent-red)', padding: '2px 5px', borderRadius: '5px' }}>
          ⚠️ ¿{repsNum} reps? Verifica posible error tipográfico.
        </div>
      )}
      {isWeightJumpAlert && (
        <div style={{ fontSize: '9.5px', fontWeight: '800', color: 'var(--accent-amber)', background: 'var(--accent-amber-subtle)', border: '1px solid var(--accent-amber)', padding: '2px 5px', borderRadius: '5px' }}>
          ⚠️ Salto brusco detectado ({prevWeightNum} ➔ {weightNum} lbs).
        </div>
      )}
    </>
  );
}
