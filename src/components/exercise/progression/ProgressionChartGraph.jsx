import React, { useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea
} from 'recharts';
import { PROGRESSION_COLORS } from '../../../utils/charts/chartConstants.js';
import StationDot from './StationDot.jsx';

function CustomTooltipReceiver({ active, payload, setHoveredPoint }) {
  useEffect(() => {
    if (active && payload && payload.length > 0) {
      setHoveredPoint(payload[0].payload);
    }
  }, [active, payload, setHoveredPoint]);

  return null;
}

export default function ProgressionChartGraph({
  height = 220,
  chartData = [],
  dynamicXInterval = 0,
  metricMode = 'weights',
  showWeight = true,
  weightMode = 'band',
  showReps = true,
  repsMode = 'both',
  show1RM = false,
  showRPE = false,
  showProjections = true,
  weightYDomain,
  tonnageYDomain,
  targetRange,
  transitionDate,
  lastProjectedDate,
  deloadWindows = [],
  isFamilyView = false,
  isDense = false,
  setHoveredPoint,
  setPinnedPoint
}) {
  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: showRPE ? 36 : 8, left: -16, bottom: 0 }}
          onMouseMove={(e) => {
            if (e && e.activePayload && e.activePayload.length > 0) {
              setHoveredPoint(e.activePayload[0].payload);
            }
          }}
          onMouseLeave={() => setHoveredPoint(null)}
          onClick={(e) => {
            if (e && e.activePayload && e.activePayload.length > 0) {
              const p = e.activePayload[0].payload;
              setPinnedPoint(prev => (prev?.date === p.date ? null : p));
            }
          }}
        >
          {/* GRADIENTES TRANSLÚCIDOS */}
          <defs>
            <linearGradient id="gradientWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PROGRESSION_COLORS.peakWeight} stopOpacity={0.35} />
              <stop offset="95%" stopColor={PROGRESSION_COLORS.peakWeight} stopOpacity={0.02} />
            </linearGradient>

            <linearGradient id="gradientWeightRange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PROGRESSION_COLORS.rangeFillStart} stopOpacity={0.25} />
              <stop offset="95%" stopColor={PROGRESSION_COLORS.rangeFillEnd} stopOpacity={0.08} />
            </linearGradient>

            <linearGradient id="gradientAvgWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PROGRESSION_COLORS.avgWeight} stopOpacity={0.25} />
              <stop offset="95%" stopColor={PROGRESSION_COLORS.avgWeight} stopOpacity={0.02} />
            </linearGradient>

            <linearGradient id="gradientTonnage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PROGRESSION_COLORS.tonnage} stopOpacity={0.35} />
              <stop offset="95%" stopColor={PROGRESSION_COLORS.tonnage} stopOpacity={0.02} />
            </linearGradient>

            <linearGradient id="gradientReps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PROGRESSION_COLORS.repsTop} stopOpacity={0.30} />
              <stop offset="95%" stopColor={PROGRESSION_COLORS.repsTop} stopOpacity={0.02} />
            </linearGradient>

            <linearGradient id="gradient1RM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PROGRESSION_COLORS.est1RM} stopOpacity={0.30} />
              <stop offset="95%" stopColor={PROGRESSION_COLORS.est1RM} stopOpacity={0.02} />
            </linearGradient>

            <linearGradient id="gradientProj" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PROGRESSION_COLORS.projection} stopOpacity={0.30} />
              <stop offset="95%" stopColor={PROGRESSION_COLORS.projection} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />

          <XAxis
            dataKey="date"
            interval={dynamicXInterval}
            tick={{ fontSize: 9.5, fontWeight: '700', fill: 'var(--text-muted)' }}
            axisLine={{ stroke: 'var(--border-subtle)' }}
            tickLine={false}
            tickFormatter={(val) => (typeof val === 'string' ? val.replace(/\s*\(\s*#?\d+\s*\)$/, '') : val)}
          />

          {metricMode === 'weights' ? (
            <>
              {/* Eje Y Izquierdo: Carga en lbs */}
              <YAxis
                yAxisId="weight"
                domain={weightYDomain}
                tick={{ fontSize: 10, fontWeight: '800', fill: PROGRESSION_COLORS.peakWeight }}
                axisLine={{ stroke: PROGRESSION_COLORS.peakWeight }}
                tickLine={false}
              />

              {/* Eje Y Derecho: Repeticiones */}
              <YAxis
                yAxisId="reps"
                orientation="right"
                domain={[0, Math.max(20, targetRange.max + 4)]}
                tick={{ fontSize: 10, fontWeight: '800', fill: PROGRESSION_COLORS.repsTop }}
                axisLine={{ stroke: PROGRESSION_COLORS.repsTop }}
                tickLine={false}
              />

              {/* Eje Y Derecho Secundario: RPE */}
              {showRPE && (
                <YAxis
                  yAxisId="rpe"
                  orientation="right"
                  domain={[5, 10]}
                  ticks={[6, 7, 8, 9, 10]}
                  tick={{ fontSize: 9.5, fontWeight: '800', fill: PROGRESSION_COLORS.rpe }}
                  axisLine={{ stroke: PROGRESSION_COLORS.rpe }}
                  tickLine={false}
                  tickFormatter={(v) => `R${v}`}
                />
              )}

              {/* 🟩 BANDA VERDE SOMBREADA DE HIPERTROFIA DINÁMICA POR EJERCICIO */}
              {showReps && (
                <ReferenceArea
                  yAxisId="reps"
                  y1={targetRange.min}
                  y2={targetRange.max}
                  fill={PROGRESSION_COLORS.repsBand}
                  fillOpacity={0.12}
                  stroke={PROGRESSION_COLORS.repsBand}
                  strokeDasharray="3 3"
                />
              )}
            </>
          ) : (
            /* Eje Y para Tonelaje */
            <YAxis
              yAxisId="tonnage"
              domain={tonnageYDomain}
              tick={{ fontSize: 10, fontWeight: '800', fill: PROGRESSION_COLORS.tonnage }}
              axisLine={{ stroke: PROGRESSION_COLORS.tonnage }}
              tickLine={false}
              tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
            />
          )}

          {/* 🔮 ZONA SOMBREADA DE PROYECCIONES FUTURAS */}
          {showProjections && transitionDate && lastProjectedDate && (
            <ReferenceArea
              yAxisId={metricMode === 'weights' ? 'weight' : 'tonnage'}
              x1={transitionDate}
              x2={lastProjectedDate}
              fill={PROGRESSION_COLORS.projection}
              fillOpacity={0.07}
              stroke={PROGRESSION_COLORS.projection}
              strokeDasharray="4 4"
            />
          )}

          {/* 🧘 FRANJAS CLÍNICAS SOMBREADAS DE SEMANA DE DESCARGA (DELOAD) */}
          {deloadWindows && deloadWindows.map((win, wIdx) => (
            <ReferenceArea
              key={`deload-win-${wIdx}`}
              yAxisId={metricMode === 'weights' ? 'weight' : 'tonnage'}
              x1={win.start}
              x2={win.end}
              fill={PROGRESSION_COLORS.deload}
              fillOpacity={0.16}
              stroke={PROGRESSION_COLORS.deloadBorder}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          ))}

          {/* Guía vertical de cursor sin popup flotante molesto que tape la gráfica */}
          <Tooltip
            cursor={{ stroke: PROGRESSION_COLORS.peakWeight, strokeWidth: 1.5, strokeDasharray: '3 3' }}
            content={<CustomTooltipReceiver setHoveredPoint={setHoveredPoint} />}
          />

          {/* CURVAS SEGÚN EL MODO SELECCIONADO */}
          {metricMode === 'tonnage' ? (
            /* 📦 CURVA DE TONELAJE */
            <>
              <Area
                yAxisId="tonnage"
                type="monotone"
                dataKey="tonnage"
                name="Tonelaje Efectivo"
                stroke={PROGRESSION_COLORS.tonnage}
                strokeWidth={2.5}
                fill="url(#gradientTonnage)"
                dot={isDense ? { r: 1.8, fill: PROGRESSION_COLORS.tonnage } : { r: 3.5, fill: PROGRESSION_COLORS.tonnage, stroke: '#ffffff', strokeWidth: 1.5 }}
                activeDot={{ r: isDense ? 4 : 5.5, fill: PROGRESSION_COLORS.tonnage }}
                connectNulls={false}
              />
              {showProjections && (
                <Area
                  yAxisId="tonnage"
                  type="monotone"
                  dataKey="projectedTonnage"
                  name="Meta de Tonelaje"
                  stroke={PROGRESSION_COLORS.projection}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#gradientProj)"
                  dot={isDense ? { r: 1.8, fill: PROGRESSION_COLORS.projection } : { r: 3.5, fill: PROGRESSION_COLORS.projection, stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: isDense ? 4 : 5.5, fill: PROGRESSION_COLORS.projection }}
                  connectNulls
                />
              )}
            </>
          ) : (
            /* 🏋️ CURVAS DE PESO Y REPETICIONES */
            <>
              {/* 🌊 BANDA SOMBREADA MIN-MAX (RANGE RIBBON) */}
              {showWeight && (weightMode === 'band' || weightMode === 'both') && (
                <Area
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weightRange"
                  name="Rango Min-Max (Dispersión)"
                  fill="url(#gradientWeightRange)"
                  stroke="none"
                  dot={false}
                  activeDot={false}
                  connectNulls={false}
                />
              )}

              {/* 🌊 CURVA DE CARGA PICO (TOP SET) */}
              {showWeight && (weightMode === 'band' || weightMode === 'peak' || weightMode === 'both') && (
                <Area
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weight"
                  name="Carga Pico (Top Set)"
                  stroke={PROGRESSION_COLORS.peakWeight}
                  strokeWidth={2.5}
                  fill={weightMode === 'peak' ? 'url(#gradientWeight)' : 'none'}
                  dot={(dotProps) => <StationDot {...dotProps} baseColor={PROGRESSION_COLORS.peakWeight} isFamilyView={isFamilyView} isDense={isDense} />}
                  activeDot={{ r: isDense ? 4 : 5.5, fill: PROGRESSION_COLORS.peakWeight }}
                  connectNulls={false}
                />
              )}

              {/* 🌊 LÍNEA CENTRAL: CARGA PROMEDIO PONDERADA EFECTIVA */}
              {showWeight && (weightMode === 'band' || weightMode === 'avg' || weightMode === 'both') && (
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weightedAvgWeight"
                  name="Promedio Ponderado Efectivo"
                  stroke={PROGRESSION_COLORS.avgWeight}
                  strokeWidth={2.5}
                  strokeDasharray={weightMode === 'band' ? 'none' : '4 3'}
                  dot={(dotProps) => <StationDot {...dotProps} baseColor={PROGRESSION_COLORS.avgWeight} isFamilyView={isFamilyView} isDense={isDense} />}
                  activeDot={{ r: isDense ? 4 : 5.5, fill: PROGRESSION_COLORS.avgWeight }}
                  connectNulls={false}
                />
              )}

              {/* 🌊 LÍNEA SUTIL: CARGA MÍNIMA DE TRABAJO (BASE / BACK-OFF) */}
              {showWeight && (weightMode === 'band' || weightMode === 'both') && (
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="minWeight"
                  name="Carga Base / Back-off"
                  stroke={PROGRESSION_COLORS.minWeight}
                  strokeWidth={1.8}
                  strokeDasharray="3 3"
                  dot={(dotProps) => <StationDot {...dotProps} baseColor={PROGRESSION_COLORS.minWeight} isFamilyView={isFamilyView} isDense={isDense} />}
                  activeDot={{ r: isDense ? 3.5 : 4.5, fill: PROGRESSION_COLORS.minWeight }}
                  connectNulls={false}
                />
              )}

              {/* 🌊 CURVAS DE REPETICIONES: TOP SET Y PROMEDIO SIMULTÁNEAS */}
              {showReps && (repsMode === 'topSet' || repsMode === 'both') && (
                <Area
                  yAxisId="reps"
                  type="monotone"
                  dataKey="reps"
                  name="Reps (Top Set)"
                  stroke={PROGRESSION_COLORS.repsTop}
                  strokeWidth={2.5}
                  fill="url(#gradientReps)"
                  dot={isDense ? { r: 1.8, fill: PROGRESSION_COLORS.repsTop } : { r: 3.5, fill: PROGRESSION_COLORS.repsTop, stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: isDense ? 4 : 5.5, fill: PROGRESSION_COLORS.repsTop }}
                  connectNulls={false}
                />
              )}

              {showReps && (repsMode === 'avg' || repsMode === 'both') && (
                <Line
                  yAxisId="reps"
                  type="monotone"
                  dataKey="avgReps"
                  name="Reps (Promedio)"
                  stroke={PROGRESSION_COLORS.repsAvg}
                  strokeWidth={2.2}
                  strokeDasharray={repsMode === 'both' ? '4 3' : 'none'}
                  dot={isDense ? { r: 1.8, fill: PROGRESSION_COLORS.repsAvg } : { r: 3.5, fill: PROGRESSION_COLORS.repsAvg, stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: isDense ? 4 : 5.5, fill: PROGRESSION_COLORS.repsAvg }}
                  connectNulls={false}
                />
              )}

              {/* 🌊 CURVA DE 1RM ESTIMADO (CYAN OPCIONAL) */}
              {show1RM && (
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="est1RM"
                  name="1RM Estimado"
                  stroke={PROGRESSION_COLORS.est1RM}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={isDense ? { r: 1.5, fill: PROGRESSION_COLORS.est1RM } : { r: 2.5, fill: PROGRESSION_COLORS.est1RM }}
                  activeDot={{ r: 4 }}
                  connectNulls={false}
                />
              )}

              {/* 🔥 CURVA DE RPE (ESFUERZO PERCIBIDO / RIR) */}
              {showRPE && (
                <Line
                  yAxisId="rpe"
                  type="monotone"
                  dataKey="rpe"
                  name="RPE Promedio"
                  stroke={PROGRESSION_COLORS.rpe}
                  strokeWidth={2.5}
                  dot={(dotProps) => <StationDot {...dotProps} baseColor={PROGRESSION_COLORS.rpe} isFamilyView={isFamilyView} isDense={isDense} />}
                  activeDot={{ r: isDense ? 4 : 5.5, fill: PROGRESSION_COLORS.rpe }}
                  connectNulls
                />
              )}

              {/* 🔮 CURVA DE PROYECCIÓN FUTURA (PÚRPURA DISCONTINUA) */}
              {showProjections && (
                <Area
                  yAxisId="weight"
                  type="monotone"
                  dataKey={weightMode === 'avg' ? 'projectedAvgWeight' : 'projectedWeight'}
                  name="Meta Proyectada"
                  stroke={PROGRESSION_COLORS.projection}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#gradientProj)"
                  dot={isDense ? { r: 2, fill: PROGRESSION_COLORS.projection } : { r: 3.5, fill: PROGRESSION_COLORS.projection, stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: isDense ? 4 : 5.5, fill: PROGRESSION_COLORS.projection }}
                  connectNulls
                />
              )}
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
