import React from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function CardioHeader({
  completed,
  machineType,
  isDualPhase = false,
  exercise,
  calculatedDuration,
  inclinePct = 10,
  speedKmh = 4.0,
  metrics = {},
  isExpanded,
  onToggle,
  onToggleCompleted
}) {
  const isLegacyMachine = machineType !== 'treadmill' || isDualPhase;
  const kcal = metrics.acsmNetKcal ?? metrics.cardioKcal ?? 0;
  const steps = metrics.effectiveSteps || 0;
  const hrAvg = metrics.watchHrAvg || null;

  return (
    <div
      onClick={onToggle}
      style={{
        padding: '12px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        background: completed
          ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
          : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>{machineType === 'rower' ? '🚣‍♂️' : '🫀'}</span>
          <strong style={{ fontSize: '15px', fontWeight: '900', color: '#ffffff', lineHeight: '1.25' }}>
            {exercise?.name || 'Caminadora Inclinada Zona 2 Post-Pesas'}
          </strong>
          {completed && (
            <span style={{ fontSize: '10px', background: '#ffffff', color: '#047857', padding: '1px 7px', borderRadius: '8px', fontWeight: '900' }}>
              ✓ Completado
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {!isLegacyMachine ? (
            <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.95)', fontWeight: '800' }}>
              Caminadora Z2 · {calculatedDuration}m · {inclinePct}% · {speedKmh} km/h · ~{kcal} kcal
            </span>
          ) : (
            <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.95)', fontWeight: '800' }}>
              {machineType === 'rower' ? 'Remo (Histórico)' : machineType === 'bike' ? 'Bicicleta (Histórico)' : machineType === 'elliptical' ? 'Elíptica (Histórico)' : 'Caminadora Bifásico (Histórico)'} · {calculatedDuration}m · ~{kcal} kcal
            </span>
          )}

          {hrAvg > 0 && (
            <span style={{ background: 'rgba(255, 255, 255, 0.22)', color: '#ffffff', fontSize: '10.5px', padding: '1px 7px', borderRadius: '8px', fontWeight: '900' }}>
              ⌚ {hrAvg} lpm
            </span>
          )}

          {steps > 0 && (
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '10.5px', padding: '1px 7px', borderRadius: '8px', fontWeight: '800' }}>
              👟 {steps.toLocaleString()} pasos
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={onToggleCompleted}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
          title={completed ? 'Desmarcar completado' : 'Marcar completado'}
        >
          <CheckCircle2 size={28} color={completed ? '#ffffff' : 'rgba(255, 255, 255, 0.65)'} />
        </button>

        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
    </div>
  );
}
