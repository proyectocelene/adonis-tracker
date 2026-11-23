import React from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function CardioHeader({
  completed,
  machineType,
  exercise,
  rowOption,
  calculatedDuration,
  metrics,
  isExpanded,
  onToggle,
  onToggleCompleted
}) {
  return (
    <div 
      onClick={onToggle}
      style={{ 
        padding: '14px 16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        background: completed 
          ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
          : machineType === 'rower'
          ? 'linear-gradient(135deg, #0f766e 0%, #0284c7 100%)'
          : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>{machineType === 'rower' ? '🚣‍♂️' : '🫀'}</span>
          <strong style={{ fontSize: '16px', fontWeight: '900', color: '#ffffff', lineHeight: '1.3' }}>
            {exercise?.name || (machineType === 'rower' ? 'Protocolo Matutino: Remo (Cardio vs. NEAT)' : 'Cardio Aeróbico en Zona 2')}
          </strong>
          {machineType === 'rower' && (
            <span style={{ fontSize: '10px', background: 'rgba(254, 243, 199, 0.95)', color: '#92400e', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
              ☀️ Matutino (≥ 6h antes de pesas)
            </span>
          )}
          {completed && (
            <span style={{ fontSize: '10px', background: '#ffffff', color: '#047857', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
              ✓ Completado
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {machineType === 'rower' ? (
            <>
              <span style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                {rowOption === 'A' ? '⚡ Opción A: Híbrida (HIIT+NEAT)' : '🌿 Opción B: Pura NEAT'}
              </span>
              <span style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '900' }}>
                ⏱️ {calculatedDuration} min
              </span>
              <span style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '900' }}>
                🔥 {metrics.cardioKcal} kcal
              </span>
              {metrics.distanceKm > 0 && (
                <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                  📍 {metrics.distanceKm} km
                </span>
              )}
            </>
          ) : (
            <>
              <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                🫀 Zona 2 (120-135 BPM)
              </span>
              <span style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '900' }}>
                🔥 {metrics.cardioKcal} kcal
              </span>
              {metrics.distanceKm > 0 && (
                <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                  📍 {metrics.distanceKm} km
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <button 
          type="button"
          onClick={onToggleCompleted}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
          title={completed ? "Desmarcar completado" : "Marcar completado"}
        >
          <CheckCircle2 size={32} color={completed ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />
        </button>

        <div 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '12px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            color: '#ffffff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
    </div>
  );
}
