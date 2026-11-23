import React from 'react';
import { Sparkles } from 'lucide-react';
import { PROGRESSION_COLORS } from '../../../utils/charts/chartConstants.js';

export default function ChartLegendAndBanners({
  isFamilyView,
  isAutoFamily,
  machineKey,
  totalRealPointsCount = 0,
  metricMode,
  targetRange,
  weightMode,
  showReps,
  repsMode,
  show1RM,
  showRPE,
  deloadWindows = [],
  showProjections
}) {
  return (
    <>
      {/* AVISO INTELIGENTE DE MOTOR CANÓNICO / FAMILIA BIOMECÁNICA */}
      {isFamilyView && (
        <div style={{
          background: 'rgba(124, 58, 237, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '10px',
          padding: '5px 10px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#c084fc',
          fontWeight: '700'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={12} color="#a855f7" />
            {isAutoFamily 
              ? `Motor Inteligente: Sin registros en esta estación física. Graficando historial de la familia ${machineKey || 'biomecánica'}`
              : `Modo Familia Activo: Historial consolidado de la estación ${machineKey || ''}`}
          </span>
          <span style={{ fontSize: '9px', background: 'rgba(124, 58, 237, 0.2)', padding: '1px 6px', borderRadius: '5px', color: '#e9d5ff', fontWeight: '800' }}>
            {totalRealPointsCount} sesiones
          </span>
        </div>
      )}

      {/* GUÍAS VISUALES: BANDA VERDE HIPERTROFIA Y ZONA PROYECTADA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '8px',
        fontSize: '9.5px',
        color: '#64748b',
        fontWeight: '700'
      }}>
        {metricMode === 'weights' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px dashed #10b981', borderRadius: '3px' }} />
              🟩 Rango Hipertrofia Prescrito: <strong style={{ color: '#047857' }}>{targetRange.label} reps</strong>
            </span>

            {(weightMode === 'band' || weightMode === 'both') && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '8px', background: 'rgba(29, 78, 216, 0.2)', border: `1.5px solid ${PROGRESSION_COLORS.peakWeight}`, borderRadius: '2px' }} />
                <span style={{ color: PROGRESSION_COLORS.peakWeight, fontWeight: '800' }}>Banda Min-Max</span>
                <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.avgWeight, borderRadius: '2px' }} />
                <span style={{ color: PROGRESSION_COLORS.avgWeight, fontWeight: '800' }}>Prom Ponderado</span>
              </span>
            )}
            {weightMode === 'peak' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.peakWeight, fontWeight: '800' }}>
                <span style={{ width: '12px', height: '2.5px', background: PROGRESSION_COLORS.peakWeight, borderRadius: '2px' }} /> Carga Pico
              </span>
            )}
            {weightMode === 'avg' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.avgWeight, fontWeight: '800' }}>
                <span style={{ width: '12px', height: '2.5px', background: PROGRESSION_COLORS.avgWeight, borderRadius: '2px' }} /> Promedio Ponderado
              </span>
            )}

            {showReps && repsMode === 'both' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: PROGRESSION_COLORS.repsTop, fontWeight: '800' }}>
                  <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.repsTop, borderRadius: '2px' }} /> Reps Top
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: PROGRESSION_COLORS.repsAvg, fontWeight: '800' }}>
                  <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.repsAvg, borderRadius: '2px' }} /> Reps Prom
                </span>
              </span>
            )}
            {showReps && repsMode === 'topSet' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: PROGRESSION_COLORS.repsTop, fontWeight: '800' }}>
                <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.repsTop, borderRadius: '2px' }} /> Reps Top
              </span>
            )}
            {showReps && repsMode === 'avg' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: PROGRESSION_COLORS.repsAvg, fontWeight: '800' }}>
                <span style={{ width: '10px', height: '2.5px', background: PROGRESSION_COLORS.repsAvg, borderRadius: '2px' }} /> Reps Prom
              </span>
            )}

            {show1RM && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.est1RM, fontWeight: '800' }}>
                <span style={{ width: '12px', height: '2px', background: PROGRESSION_COLORS.est1RM, borderTop: `1px dashed ${PROGRESSION_COLORS.est1RM}` }} /> 1RM
              </span>
            )}

            {showRPE && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.rpe, fontWeight: '800' }}>
                <span style={{ width: '12px', height: '2.5px', background: PROGRESSION_COLORS.rpe, borderRadius: '2px' }} /> 🔥 RPE (6-10)
              </span>
            )}

            {isFamilyView && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '9px', background: 'var(--bg-surface-secondary)', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '800' }}>Estación:</span>
                <span>■ Mancuerna</span>
                <span>◆ Polea</span>
                <span>▲ Smith</span>
                <span>● Máquina</span>
              </span>
            )}

            {deloadWindows && deloadWindows.length > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontWeight: '800', background: 'var(--accent-emerald-subtle)', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--accent-emerald)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PROGRESSION_COLORS.deload, border: '1.5px solid var(--accent-emerald)' }} /> 🧘 Deload (80% / RIR 3-4)
              </span>
            )}
          </div>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.tonnage, fontWeight: '800' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(234, 88, 12, 0.25)', border: `1px solid ${PROGRESSION_COLORS.tonnage}`, borderRadius: '3px' }} />
            Tonelaje de Sesión = suma de (peso × reps) de series efectivas
          </span>
        )}

        {showProjections && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: PROGRESSION_COLORS.projection, fontWeight: '800' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(219, 39, 119, 0.15)', border: `1px dashed ${PROGRESSION_COLORS.projection}`, borderRadius: '3px' }} />
            🔮 Proyecciones (+1m a +6m)
          </span>
        )}
      </div>
    </>
  );
}
