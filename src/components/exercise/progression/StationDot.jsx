import React from 'react';
import { PROGRESSION_COLORS } from '../../../utils/charts/chartConstants.js';

/**
 * Renderizador de puntos personalizados para Recharts según la estación mecánica y sesiones de Deload.
 */
export default function StationDot(props) {
  const { cx, cy, payload, baseColor = PROGRESSION_COLORS.peakWeight, isFamilyView = false, isDense = false } = props;
  if (!cx || !cy || !payload || payload.isProjected) return null;
  const sType = payload.stationType || 'machine';
  const isDeload = Boolean(payload.isDeloadSession);

  // Si es sesión de Deload, dibujar un indicador visual prominente de recuperación activa
  if (isDeload) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={isDense ? 4.5 : 6.5} fill="#ecfdf5" stroke={PROGRESSION_COLORS.deloadBorder} strokeWidth={isDense ? 1.5 : 2.2} />
        <circle cx={cx} cy={cy} r={isDense ? 2 : 3} fill={PROGRESSION_COLORS.deload} />
      </g>
    );
  }

  // En modo denso (muchos puntos históricos), usar radio reducido sin saturar el eje
  if (isDense) {
    return <circle cx={cx} cy={cy} r={2} fill={baseColor} stroke="#ffffff" strokeWidth={1} />;
  }

  if (!isFamilyView) {
    return <circle cx={cx} cy={cy} r={3.5} fill={baseColor} stroke="#ffffff" strokeWidth={1.5} />;
  }

  // En vista focalizada de familia, distinguir estaciones por forma geométrica
  if (sType === 'dumbbell') {
    return (
      <rect
        x={cx - 3.5}
        y={cy - 3.5}
        width={7}
        height={7}
        fill={baseColor}
        stroke="#ffffff"
        strokeWidth={1.5}
        rx={1}
      />
    );
  }
  if (sType === 'cable') {
    return (
      <polygon
        points={`${cx},${cy - 4.5} ${cx + 4.5},${cy} ${cx},${cy + 4.5} ${cx - 4.5},${cy}`}
        fill={baseColor}
        stroke="#ffffff"
        strokeWidth={1.5}
      />
    );
  }
  if (sType === 'smith') {
    return (
      <polygon
        points={`${cx},${cy - 4.5} ${cx + 4.5},${cy + 3.5} ${cx - 4.5},${cy + 3.5}`}
        fill={baseColor}
        stroke="#ffffff"
        strokeWidth={1.5}
      />
    );
  }

  if (sType === 'plate') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={baseColor} stroke="#ffffff" strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={1.5} fill="#ffffff" />
      </g>
    );
  }

  return <circle cx={cx} cy={cy} r={3.5} fill={baseColor} stroke="#ffffff" strokeWidth={1.5} />;
}
