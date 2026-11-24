import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { WEIGHT_MODES } from '../../../utils/charts/chartConstants.js';

export default function ChartHeaderControls({
  metricMode,
  setMetricMode,
  targetRange,
  machineKey,
  scopeMode,
  setScopeMode,
  stationStatsCount = 0,
  weightMode,
  setWeightMode,
  setShowWeight,
  showReps,
  setShowReps,
  repsMode,
  setRepsMode,
  show1RM,
  setShow1RM,
  showRPE,
  setShowRPE,
  showProjections,
  setShowProjections,
  yAxisScale,
  setYAxisScale
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '10px',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <TrendingUp size={14} />
        </div>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: '900', color: 'var(--text-main)', display: 'block', lineHeight: '1.1' }}>
            {metricMode === 'tonnage' ? 'Tonelaje Acumulado' : 'Sobrecarga Progresiva'}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700' }}>
            Meta: {targetRange.label} reps • Calentamientos aislados
          </span>
        </div>
      </div>

      {/* CONTROLES DIRECTOS DE GRÁFICA (VISIBLES SIN OCULTAR) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', width: '100%' }}>
        {/* Selector de Alcance: Toda la Familia vs Esta Máquina */}
        {machineKey && (
          <div style={{ display: 'inline-flex', background: 'var(--bg-surface-secondary)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setScopeMode('family')}
              style={{
                padding: '3px 7px',
                borderRadius: '6px',
                border: 'none',
                background: scopeMode === 'family' ? 'var(--accent-blue)' : 'transparent',
                color: scopeMode === 'family' ? '#000000' : 'var(--text-secondary)',
                fontWeight: '900',
                fontSize: '9.5px',
                cursor: 'pointer',
                boxShadow: scopeMode === 'family' ? '0 1px 4px rgba(56,189,248,0.3)' : 'none'
              }}
              title={`Ver progreso agrupado de toda la estación biomecánica (${machineKey})`}
            >
              🌐 Toda la Familia ({machineKey})
            </button>
            <button
              type="button"
              onClick={() => setScopeMode('station')}
              style={{
                padding: '3px 7px',
                borderRadius: '6px',
                border: 'none',
                background: scopeMode === 'station' ? 'var(--accent-blue)' : 'transparent',
                color: scopeMode === 'station' ? '#000000' : 'var(--text-secondary)',
                fontWeight: '900',
                fontSize: '9.5px',
                cursor: 'pointer',
                boxShadow: scopeMode === 'station' ? '0 1px 4px rgba(56,189,248,0.3)' : 'none'
              }}
              title="Filtrar datos exclusivamente para esta máquina física específica"
            >
              🎯 Esta Máquina {stationStatsCount > 0 ? `(${stationStatsCount})` : ''}
            </button>
          </div>
        )}

        {/* Toggle Métrica: Cargas vs Tonelaje */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-surface-secondary)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setMetricMode('weights')}
            style={{
              padding: '3px 7px',
              borderRadius: '6px',
              border: 'none',
              background: metricMode === 'weights' ? 'var(--accent-blue)' : 'transparent',
              color: metricMode === 'weights' ? '#000000' : 'var(--text-secondary)',
              fontWeight: '900',
              fontSize: '9.5px',
              cursor: 'pointer',
              boxShadow: metricMode === 'weights' ? '0 1px 4px rgba(56,189,248,0.3)' : 'none'
            }}
            title="Ver curvas de peso (Top Set, Promedio y Banda) y Reps"
          >
            🏋️ Carga & Reps
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('tonnage')}
            style={{
              padding: '3px 7px',
              borderRadius: '6px',
              border: 'none',
              background: metricMode === 'tonnage' ? 'var(--accent-amber)' : 'transparent',
              color: metricMode === 'tonnage' ? '#000000' : 'var(--text-secondary)',
              fontWeight: '900',
              fontSize: '9.5px',
              cursor: 'pointer',
              boxShadow: metricMode === 'tonnage' ? '0 1px 4px rgba(255,179,0,0.3)' : 'none'
            }}
            title="Ver volumen total de trabajo (peso × reps) de series efectivas"
          >
            📦 Tonelaje
          </button>
        </div>

        {metricMode === 'weights' && (
          <>
            {/* Selector de Modo de Carga: Banda | Pico | Prom | Líneas */}
            <div style={{ display: 'inline-flex', background: 'var(--bg-surface-secondary)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
              {WEIGHT_MODES.map(wm => (
                <button
                  key={wm.id}
                  type="button"
                  onClick={() => {
                    setWeightMode(wm.id);
                    setShowWeight(true);
                  }}
                  style={{
                    padding: '3px 6px',
                    borderRadius: '6px',
                    border: 'none',
                    background: weightMode === wm.id ? wm.bg : 'transparent',
                    color: weightMode === wm.id ? wm.color : 'var(--text-secondary)',
                    fontWeight: '900',
                    fontSize: '9px',
                    cursor: 'pointer'
                  }}
                  title={wm.title}
                >
                  {wm.label}
                </button>
              ))}
            </div>

            {/* Toggle Reps */}
            <div style={{ display: 'inline-flex', borderRadius: '8px', overflow: 'hidden', border: showReps ? `1.5px solid var(--accent-emerald)` : '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setShowReps(prev => !prev)}
                style={{
                  padding: '3px 6px',
                  border: 'none',
                  background: showReps ? 'var(--accent-emerald-subtle)' : 'var(--bg-surface-secondary)',
                  color: showReps ? 'var(--accent-emerald)' : 'var(--text-muted)',
                  fontSize: '9.5px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Activar/Desactivar curva de repeticiones"
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: showReps ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
                Reps
              </button>
              {showReps && (
                <button
                  type="button"
                  onClick={() => setRepsMode(prev => prev === 'both' ? 'topSet' : prev === 'topSet' ? 'avg' : 'both')}
                  style={{
                    padding: '3px 6px',
                    border: 'none',
                    borderLeft: '1px solid var(--border-subtle)',
                    background: repsMode === 'avg' ? 'var(--accent-amber-subtle)' : 'var(--accent-emerald-subtle)',
                    color: repsMode === 'avg' ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                    fontSize: '9px',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                  title="Alternar: Ambas curvas simultáneas (Verde=Top, Dorado=Promedio), solo Top Set, o solo Promedio"
                >
                  {repsMode === 'both' ? 'Ambas' : repsMode === 'topSet' ? 'Top' : 'Prom'}
                </button>
              )}
            </div>

            {/* Toggle 1RM */}
            <button
              type="button"
              onClick={() => setShow1RM(prev => !prev)}
              style={{
                padding: '3px 7px',
                borderRadius: '8px',
                border: show1RM ? `1.5px solid var(--accent-cyan)` : '1px solid var(--border-subtle)',
                background: show1RM ? 'var(--accent-cyan-subtle)' : 'var(--bg-surface-secondary)',
                color: show1RM ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '9.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Curva de 1RM Estimado por fórmula de Epley (reps <= 15)"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: show1RM ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
              1RM
            </button>

            {/* Toggle RPE */}
            <button
              type="button"
              onClick={() => setShowRPE(prev => !prev)}
              style={{
                padding: '3px 7px',
                borderRadius: '8px',
                border: showRPE ? `1.5px solid var(--accent-red)` : '1px solid var(--border-subtle)',
                background: showRPE ? 'var(--accent-red-subtle)' : 'var(--bg-surface-secondary)',
                color: showRPE ? 'var(--accent-red)' : 'var(--text-muted)',
                fontSize: '9.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Curva de Esfuerzo Percibido (RPE 6-10 / RIR)"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: showRPE ? 'var(--accent-red)' : 'var(--text-muted)' }} />
              🔥 RPE
            </button>
          </>
        )}

        {/* Toggle Proyecciones */}
        <button
          type="button"
          onClick={() => setShowProjections(prev => !prev)}
          style={{
            padding: '3px 7px',
            borderRadius: '8px',
            border: showProjections ? `1.5px solid #ec4899` : '1px solid var(--border-subtle)',
            background: showProjections ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-surface-secondary)',
            color: showProjections ? '#f472b6' : 'var(--text-muted)',
            fontSize: '9.5px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
          title="Mostrar u ocultar proyecciones científicas (próxima sesión, 2 sesiones, 1m, 3m y 6 meses)"
        >
          <Sparkles size={11} color={showProjections ? '#f472b6' : 'var(--text-muted)'} />
          Metas
        </button>

        {/* Selector de Escala Vertical Eje Y */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-surface-secondary)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setYAxisScale('dynamic')}
            style={{
              padding: '3px 7px',
              borderRadius: '6px',
              border: 'none',
              background: yAxisScale === 'dynamic' ? 'var(--accent-blue)' : 'transparent',
              color: yAxisScale === 'dynamic' ? '#000000' : 'var(--text-secondary)',
              fontWeight: '900',
              fontSize: '9.5px',
              cursor: 'pointer',
              boxShadow: yAxisScale === 'dynamic' ? '0 1px 4px rgba(56,189,248,0.3)' : 'none'
            }}
            title="Escala Rango: Enfoca la gráfica en tus pesos de trabajo reales con holgura fisiológica"
          >
            🎯 Rango
          </button>
          <button
            type="button"
            onClick={() => setYAxisScale('zero')}
            style={{
              padding: '3px 7px',
              borderRadius: '6px',
              border: 'none',
              background: yAxisScale === 'zero' ? 'var(--accent-blue)' : 'transparent',
              color: yAxisScale === 'zero' ? '#000000' : 'var(--text-secondary)',
              fontWeight: '900',
              fontSize: '9.5px',
              cursor: 'pointer',
              boxShadow: yAxisScale === 'zero' ? '0 1px 4px rgba(56,189,248,0.3)' : 'none'
            }}
            title="Escala Desde 0: Eje Y inicia en 0 lbs"
          >
            0️⃣ Desde 0
          </button>
        </div>
      </div>
    </div>
  );
}
