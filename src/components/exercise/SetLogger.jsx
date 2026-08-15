import React from 'react';
import { Flame, Check, Plus, Minus } from 'lucide-react';

export default function SetLogger({
  exercise,
  exerciseData = {},
  previousData = {},
  totalSets,
  suggestedWarmupWeight,
  isWarmupSetDone,
  loadRecommendation,
  handleSetChange,
  toggleSetComplete,
  handleAddSet,
  handleRemoveSet
}) {
  const warmupSetVal = exerciseData[0] || {};

  const handleSanitizedChange = (setIndex, field, value) => {
    if (field === 'weight' || field === 'reps') {
      const cleanValue = value === '' ? '' : String(Number(value));
      handleSetChange(setIndex, field, isNaN(Number(value)) ? value : cleanValue);
    } else {
      handleSetChange(setIndex, field, value);
    }
  };

  return (
    <>
      {/* BADGE DE RECOMENDACIÓN INTELIGENTE DE SOBRECARGA */}
      {loadRecommendation && (
        <div style={{
          background: loadRecommendation.badgeBg || '#eff6ff',
          border: `1px solid ${loadRecommendation.badgeColor || '#bfdbfe'}`,
          borderRadius: '12px',
          padding: '8px 10px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: '800',
          color: loadRecommendation.badgeColor || '#1e40af'
        }}>
          <span>{loadRecommendation.icon || '💡'}</span>
          <span style={{ flex: 1 }}>{loadRecommendation.suggestionText}</span>
        </div>
      )}

      {/* TABLA DE SERIES DE TRABAJO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', width: '100%' }}>
        
        {/* SERIE S0 (CALENTAMIENTO / APROXIMACIÓN) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4px',
          background: isWarmupSetDone ? '#fef3c7' : '#fffbeb',
          padding: '8px',
          borderRadius: '14px',
          border: isWarmupSetDone ? '2px solid #f59e0b' : '1.5px dashed #f59e0b',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', width: '32px', flexShrink: 0 }}>
            <Flame size={13} color="#d97706" />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#b45309' }}>S0</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '65px', textAlign: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '8px', color: '#b45309', textTransform: 'uppercase', fontWeight: '800' }}>Calentamiento</span>
            <strong style={{ fontSize: '11px', color: '#78350f', fontWeight: '800' }}>
              ~{suggestedWarmupWeight}lbs
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <input
              type="number"
              placeholder="Peso"
              value={warmupSetVal.weight ?? ''}
              onChange={(e) => handleSanitizedChange(0, 'weight', e.target.value)}
              style={{
                width: '56px',
                padding: '6px 4px',
                borderRadius: '8px',
                border: '1.5px solid #f59e0b',
                fontSize: '13px',
                fontWeight: '900',
                textAlign: 'center',
                background: '#ffffff',
                color: '#78350f'
              }}
            />
            <span style={{ fontSize: '10px', color: '#b45309', fontWeight: '800' }}>lbs</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <input
              type="number"
              placeholder="Reps"
              value={warmupSetVal.reps ?? ''}
              onChange={(e) => handleSanitizedChange(0, 'reps', e.target.value)}
              style={{
                width: '46px',
                padding: '6px 4px',
                borderRadius: '8px',
                border: '1.5px solid #f59e0b',
                fontSize: '13px',
                fontWeight: '900',
                textAlign: 'center',
                background: '#ffffff',
                color: '#78350f'
              }}
            />
            <span style={{ fontSize: '10px', color: '#b45309', fontWeight: '800' }}>r</span>
          </div>

          <button
            type="button"
            onClick={() => toggleSetComplete(0)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: 'none',
              background: isWarmupSetDone ? '#f59e0b' : '#cbd5e1',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Check size={18} strokeWidth={3.5} />
          </button>
        </div>

        {/* SERIES EFECTIVAS (S1, S2, S3...) */}
        {Array.from({ length: totalSets }).map((_, sIdx) => {
          const setNum = sIdx + 1;
          const setVal = exerciseData[setNum] || {};
          const prevVal = previousData[setNum] || {};
          const isDone = !!setVal.completed;

          return (
            <div
              key={setNum}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '4px',
                background: isDone ? '#dcfce7' : '#ffffff',
                padding: '8px',
                borderRadius: '14px',
                border: isDone ? '2px solid #22c55e' : '1.5px solid #cbd5e1',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '900', color: isDone ? '#15803d' : '#0f172a', width: '32px', flexShrink: 0 }}>
                S{setNum}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', width: '65px', textAlign: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>Previo</span>
                {prevVal.weight ? (
                  <>
                    <strong style={{ fontSize: '11px', color: '#475569', fontWeight: '800', lineHeight: '1.1' }}>
                      {Number(prevVal.weight)} {prevVal.unit || 'lbs'}
                    </strong>
                    <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '700' }}>
                      x {Number(prevVal.reps)} reps
                    </span>
                  </>
                ) : (
                  <strong style={{ fontSize: '11px', color: '#475569', fontWeight: '800' }}>—</strong>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <input
                  type="number"
                  placeholder="Peso"
                  value={setVal.weight ?? ''}
                  onChange={(e) => handleSanitizedChange(setNum, 'weight', e.target.value)}
                  style={{
                    width: '56px',
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: '1.5px solid #94a3b8',
                    fontSize: '13px',
                    fontWeight: '900',
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#0f172a'
                  }}
                />
                <span style={{ fontSize: '10px', color: '#475569', fontWeight: '800' }}>lbs</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <input
                  type="number"
                  placeholder="Reps"
                  value={setVal.reps ?? ''}
                  onChange={(e) => handleSanitizedChange(setNum, 'reps', e.target.value)}
                  style={{
                    width: '46px',
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: '1.5px solid #94a3b8',
                    fontSize: '13px',
                    fontWeight: '900',
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#0f172a'
                  }}
                />
                <span style={{ fontSize: '10px', color: '#475569', fontWeight: '800' }}>r</span>
              </div>

              <select
                value={setVal.rpe || '8'}
                onChange={(e) => handleSetChange(setNum, 'rpe', e.target.value)}
                style={{
                  width: '64px',
                  flexShrink: 0,
                  padding: '6px 2px',
                  borderRadius: '8px',
                  border: setVal.rpe === '8' ? '1.5px solid #3b82f6' : '1.5px solid #cbd5e1',
                  fontSize: '11px',
                  fontWeight: '900',
                  textAlign: 'center',
                  background: setVal.rpe === '8' ? '#eff6ff' : '#ffffff',
                  color: setVal.rpe === '8' ? '#1d4ed8' : '#0f172a',
                  outline: 'none',
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

              <button
                type="button"
                onClick={() => toggleSetComplete(setNum)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isDone ? '#10b981' : '#cbd5e1',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Check size={18} strokeWidth={3.5} />
              </button>
            </div>
          );
        })}
      </div>

      {/* CONTROLES DE SERIES */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', width: '100%' }}>
        <button
          type="button"
          onClick={handleAddSet}
          style={{
            flex: 1,
            background: '#eff6ff',
            color: '#0066ff',
            border: '1.5px solid #bfdbfe',
            padding: '9px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Plus size={14} /> + Agregar Serie Extra
        </button>
        {totalSets > 1 && (
          <button
            type="button"
            onClick={handleRemoveSet}
            style={{
              background: '#fef2f2',
              color: '#ef4444',
              border: '1.5px solid #fecaca',
              padding: '9px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Minus size={14} /> Quitar
          </button>
        )}
      </div>
    </>
  );
}
