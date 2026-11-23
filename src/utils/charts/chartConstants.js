// PALETA DE ALTO CONTRASTE CON TONOS TOTALMENTE DIFERENCIADOS (SIN VARIANTES CLARAS/OSCURAS CONFUSAS)
export const PROGRESSION_COLORS = {
  peakWeight: '#1d4ed8',     // Azul Real Intenso (Carga Pico / Top Set)
  avgWeight: '#9333ea',      // Púrpura / Violeta Eléctrico (Promedio Ponderado)
  minWeight: '#64748b',      // Gris Pizarra / Slate (Carga Base / Back-off)
  rangeFillStart: '#2563eb', // Azul medio
  rangeFillEnd: '#9333ea',   // Púrpura medio
  
  repsTop: '#059669',        // Verde Esmeralda Vivo (Reps Top Set)
  repsAvg: '#d97706',        // Ámbar Dorado Oscuro (Reps Promedio) - ¡Diferente al verde!
  repsBand: '#10b981',       // Verde hipertrofia prescrito

  rpe: '#dc2626',            // Rojo Carmesí Fuego (Esfuerzo Percibido RPE / Fatiga)
  est1RM: '#0891b2',         // Cian / Turquesa Profundo (1RM Estimado)
  projection: '#db2777',     // Rosa Fucsia Magenta Neón (Metas Futuras)
  tonnage: '#ea580c',        // Naranja Óxido / Fuego (Tonelaje de Volumen)
  deload: '#10b981',         // Verde Menta Clínico (Semana de Descarga / Deload)
  deloadBorder: '#059669'    // Borde esmeralda para Deload
};

export const WEIGHT_MODES = [
  { id: 'band', label: 'Banda', bg: 'var(--accent-blue)', color: '#000000', title: 'Ver área sombreada entre Carga Mínima y Pico con Promedio Ponderado en medio' },
  { id: 'peak', label: 'Pico', bg: 'var(--accent-blue)', color: '#000000', title: 'Ver solo la Carga Máxima (Top Set)' },
  { id: 'avg', label: 'Prom', bg: 'var(--accent-blue)', color: '#000000', title: 'Ver la Carga Promedio Efectiva' },
  { id: 'both', label: 'Líneas', bg: 'var(--accent-blue)', color: '#000000', title: 'Ver curvas de Pico y Promedio' }
];

export const TIMEFRAME_OPTIONS = [
  { id: 'all', label: '🌐 Desde Siempre', title: 'Ver historial completo desde la primera sesión registrada' },
  { id: '6m', label: '6M', title: 'Últimos 6 meses' },
  { id: '3m', label: '3M', title: 'Últimos 3 meses (Trimestre)' },
  { id: '1m', label: '1M', title: 'Último mes (4 semanas)' },
  { id: '10ses', label: '⚡ 10 Ses', title: 'Últimas 10 sesiones (Resolución nítida sin amontonamiento)' },
  { id: '5ses', label: '🎯 5 Ses', title: 'Últimas 5 sesiones (Enfoque microciclo ultra focalizado)' }
];

export const EMPTY_ARRAY = Object.freeze([]);
export const EMPTY_OBJECT = Object.freeze({});
