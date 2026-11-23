/**
 * Dominios dinámicos según la escala vertical seleccionada para el Eje Y de Cargas (lbs)
 * @param {'dynamic' | 'zero'} yAxisScale
 * @returns {[number | ((min: number) => number), number | ((max: number) => number)]}
 */
export function getWeightYDomain(yAxisScale) {
  if (yAxisScale === 'zero') {
    return [
      0,
      (dataMax) => {
        const maxVal = Number.isFinite(dataMax) && dataMax > 0 ? dataMax : 100;
        return Math.ceil((maxVal * 1.08) / 5) * 5;
      }
    ];
  }
  return [
    (dataMin) => {
      if (!Number.isFinite(dataMin) || dataMin <= 0) return 0;
      // Dar un 15% de holgura inferior para evitar que pequeñas variaciones se vean hiper-drásticas
      const pad = Math.floor((dataMin * 0.85) / 5) * 5;
      return Math.max(0, pad);
    },
    (dataMax) => {
      if (!Number.isFinite(dataMax) || dataMax <= 0) return 50;
      return Math.ceil((dataMax * 1.08) / 5) * 5;
    }
  ];
}

/**
 * Dominios dinámicos según la escala vertical seleccionada para el Eje Y de Tonelaje (lbs acumuladas)
 * @param {'dynamic' | 'zero'} yAxisScale
 * @returns {[number | ((min: number) => number), number | ((max: number) => number)]}
 */
export function getTonnageYDomain(yAxisScale) {
  if (yAxisScale === 'zero') {
    return [
      0,
      (dataMax) => {
        const maxVal = Number.isFinite(dataMax) && dataMax > 0 ? dataMax : 1000;
        return Math.ceil((maxVal * 1.1) / 100) * 100;
      }
    ];
  }
  return [
    (dataMin) => {
      if (!Number.isFinite(dataMin) || dataMin <= 0) return 0;
      const pad = Math.floor((dataMin * 0.80) / 100) * 100;
      return Math.max(0, pad);
    },
    (dataMax) => {
      if (!Number.isFinite(dataMax) || dataMax <= 0) return 1000;
      return Math.ceil((dataMax * 1.1) / 100) * 100;
    }
  ];
}
