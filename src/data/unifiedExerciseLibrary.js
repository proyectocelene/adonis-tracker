/* ============================================================================
   BASE DE DATOS UNIFICADA DE EJERCICIOS Y MÁQUINAS (COACH V2 ADONIS)
   Catálogo clínico y deportivo para unificación inteligente de máquinas, pesas libres,
   poleas y modalidades cardiovasculares en Google Sheets e Inteligencia Artificial.
   ============================================================================ */

export const UNIFIED_EXERCISE_LIBRARY = [
  // PECHO (CHEST)
  {
    id: "lib_pecho_1",
    name: "Press de Pecho en Máquina Convergente (Chest Press)",
    muscleGroup: "Pecho",
    equipment: "Máquina",
    unifiedCode: "[HIPER-PECH-MÁQ-01]",
    defaultSets: 4,
    defaultReps: "10-12",
    defaultRest: "120 s",
    ratio: 1.15,
    biomechanics: "Mecánica guiada que aisla las fibras medias yesternales del pectoral mayor, reduciendo fatiga estabilizadora en hombros."
  },
  {
    id: "lib_pecho_2",
    name: "Aperturas en Máquina Pec Deck (Peacock / Flyes)",
    muscleGroup: "Pecho",
    equipment: "Máquina",
    unifiedCode: "[HIPER-PECH-FLY-02]",
    defaultSets: 3,
    defaultReps: "12-15",
    defaultRest: "90 s",
    ratio: 0.85,
    biomechanics: "Tensión constante en la aducción horizontal del húmero con máxima flexo-extensión excéntrica."
  },
  {
    id: "lib_pecho_3",
    name: "Cruce de Poleas Altas y Medias (Cable Crossover)",
    muscleGroup: "Pecho",
    equipment: "Polea",
    unifiedCode: "[HIPER-PECH-CAB-03]",
    defaultSets: 3,
    defaultReps: "12-15",
    defaultRest: "90 s",
    ratio: 0.75,
    biomechanics: "Tensión continua a lo largo de todo el rango angular con contracción isométrica voluntaria al centro."
  },
  {
    id: "lib_pecho_4",
    name: "Press Inclinado en Máquina o Multipower (Smith Machine)",
    muscleGroup: "Pecho",
    equipment: "Máquina",
    unifiedCode: "[HIPER-PECH-INC-04]",
    defaultSets: 4,
    defaultReps: "8-10",
    defaultRest: "120 s",
    ratio: 1.2,
    biomechanics: "Enfoque prioritario al haz clavicular anterior del pectoral mayor con seguridad máxima para llegar al fallo mecánico."
  },

  // ESPALDA (BACK / DORSAL)
  {
    id: "lib_esp_1",
    name: "Jalón en Polea al Pecho con Agarre Ancho (Lat Pulldown)",
    muscleGroup: "Espalda",
    equipment: "Polea",
    unifiedCode: "[HIPER-ESPA-PULL-01]",
    defaultSets: 4,
    defaultReps: "10-12",
    defaultRest: "120 s",
    ratio: 1.0,
    biomechanics: "Tracción vertical pura enfocada en la expansión latitudinal del dorsal ancho y redondo mayor."
  },
  {
    id: "lib_esp_2",
    name: "Remo Gironda en Polea Baja con Triángulo (Seated Cable Row)",
    muscleGroup: "Espalda",
    equipment: "Polea",
    unifiedCode: "[HIPER-ESPA-ROW-02]",
    defaultSets: 4,
    defaultReps: "10-12",
    defaultRest: "120 s",
    ratio: 1.1,
    biomechanics: "Tracción horizontal con retracción escapular estricta para densidad del romboides, trapecio medio y dorsal."
  },
  {
    id: "lib_esp_3",
    name: "Remo en Máquina Convergente con Apoyo Pectoral (Machine Row)",
    muscleGroup: "Espalda",
    equipment: "Máquina",
    unifiedCode: "[HIPER-ESPA-MÁQ-03]",
    defaultSets: 3,
    defaultReps: "10-12",
    defaultRest: "90 s",
    ratio: 1.25,
    biomechanics: "El apoyo torácico neutraliza la presión en zona lumbar permitiendo sobrecarga focalizada en la musculatura de espalda."
  },
  {
    id: "lib_esp_4",
    name: "Pullover en Polea Alta con Cuerda (Straight Arm Pulldown)",
    muscleGroup: "Espalda",
    equipment: "Polea",
    unifiedCode: "[HIPER-ESPA-PULOV-04]",
    defaultSets: 3,
    defaultReps: "12-15",
    defaultRest: "90 s",
    ratio: 0.6,
    biomechanics: "Aislamiento monoarticular de extensión de hombro con activación constante del dorsal sin fatigar bíceps."
  },

  // HOMBROS (DELTOIDES)
  {
    id: "lib_homb_1",
    name: "Elevaciones Laterales en Máquina o Polea Baja (Lateral Raises)",
    muscleGroup: "Hombros",
    equipment: "Máquina / Polea",
    unifiedCode: "[HIPER-HOMB-LAT-01]",
    defaultSets: 4,
    defaultReps: "12-15",
    defaultRest: "90 s",
    ratio: 0.8,
    biomechanics: "Aislamiento estricto de la cabeza lateral del deltoides para amplitud del contorno acromial (V-Taper)."
  },
  {
    id: "lib_homb_2",
    name: "Press Militar en Máquina Convergente o Smith (Shoulder Press)",
    muscleGroup: "Hombros",
    equipment: "Máquina",
    unifiedCode: "[HIPER-HOMB-PRESS-02]",
    defaultSets: 4,
    defaultReps: "8-10",
    defaultRest: "120 s",
    ratio: 1.15,
    biomechanics: "Empuje vertical con reclutamiento intensivo del deltoides anterior, medio y porción superior del trapecio."
  },
  {
    id: "lib_homb_3",
    name: "Pájaro en Máquina Pec Deck Inverso (Reverse Flyes)",
    muscleGroup: "Hombros",
    equipment: "Máquina",
    unifiedCode: "[HIPER-HOMB-POST-03]",
    defaultSets: 3,
    defaultReps: "12-15",
    defaultRest: "90 s",
    ratio: 0.75,
    biomechanics: "Abducción horizontal enfocada en la porción posterior del deltoides y estabilizadores escapulares posteriores."
  },

  // PIERNA - CUÁDRICEPS & HACK
  {
    id: "lib_piern_1",
    name: "Prensa de Pierna Inclinada 45° (Leg Press 45°)",
    muscleGroup: "Cuádriceps",
    equipment: "Máquina",
    unifiedCode: "[HIPER-CUAD-PRENS-01]",
    defaultSets: 4,
    defaultReps: "10-12",
    defaultRest: "150 s",
    ratio: 2.2,
    biomechanics: "Estudio de máxima compresión mecánica en cuádriceps y glúteo sin comprometer compresión axial en columna vertebral."
  },
  {
    id: "lib_piern_2",
    name: "Sentadilla en Máquina Hack (Hack Squat)",
    muscleGroup: "Cuádriceps",
    equipment: "Máquina",
    unifiedCode: "[HIPER-CUAD-HACK-02]",
    defaultSets: 4,
    defaultReps: "8-10",
    defaultRest: "150 s",
    ratio: 1.4,
    biomechanics: "Tensión mecánica extrema en vasto externo e interno con flexión profunda de rodilla guiada por riel de alta estabilidad."
  },
  {
    id: "lib_piern_3",
    name: "Extensiones de Cuádriceps en Máquina Sentado (Leg Extension)",
    muscleGroup: "Cuádriceps",
    equipment: "Máquina",
    unifiedCode: "[HIPER-CUAD-EXT-03]",
    defaultSets: 4,
    defaultReps: "12-15",
    defaultRest: "90 s",
    ratio: 1.0,
    biomechanics: "Ejercicio monoarticular para aislar el recto femoral yvastos con contracción isométrica terminal de 1-2 segundos."
  },

  // PIERNA - ISQUIOTIBIALES & GLÚTEO
  {
    id: "lib_isq_1",
    name: "Curl de Pechuga / Isquiotibiales en Máquina Tumbado o Sentado (Leg Curl)",
    muscleGroup: "Isquiotibiales",
    equipment: "Máquina",
    unifiedCode: "[HIPER-ISQU-CURL-01]",
    defaultSets: 4,
    defaultReps: "10-12",
    defaultRest: "90 s",
    ratio: 0.95,
    biomechanics: "Flexión de rodilla estricta para estimular bíceps femoral, semitendinoso y semimembranoso."
  },
  {
    id: "lib_isq_2",
    name: "Empuje de Cadera en Máquina Guiada o Barra (Hip Thrust Machine)",
    muscleGroup: "Glúteos",
    equipment: "Máquina",
    unifiedCode: "[HIPER-GLUT-HIP-02]",
    defaultSets: 4,
    defaultReps: "8-12",
    defaultRest: "120 s",
    ratio: 1.8,
    biomechanics: "Extensión horizontal de cadera con activación en pico electromiográfico para hipertrofia del glúteo mayor."
  },
  {
    id: "lib_isq_3",
    name: "Peso Muerto Rumano con Mancuernas o Máquina Smith (RDL)",
    muscleGroup: "Isquiotibiales",
    equipment: "Máquina / Pesas",
    unifiedCode: "[HIPER-ISQU-RDL-03]",
    defaultSets: 4,
    defaultReps: "8-10",
    defaultRest: "120 s",
    ratio: 1.1,
    biomechanics: "Elongación bajo carga del tren posterior (cadena cinética de isquiotibiales y glúteo) con cadencia excéntrica de 3 segundos."
  },

  // BÍCEPS & TRÍCEPS (BRAZOS)
  {
    id: "lib_arm_1",
    name: "Curl de Bíceps en Banco Scott o Máquina Predicador (Preacher Curl)",
    muscleGroup: "Bíceps",
    equipment: "Máquina",
    unifiedCode: "[HIPER-BICEP-PRED-01]",
    defaultSets: 3,
    defaultReps: "10-12",
    defaultRest: "90 s",
    ratio: 0.8,
    biomechanics: "Inmovilización del húmero contra el cojín para evitar impulso por balanceo y concentrar la flexión del codo en bíceps y braquial."
  },
  {
    id: "lib_arm_2",
    name: "Extensión de Tríceps en Polea Alta con Cuerda o Barra (Triceps Pushdown)",
    muscleGroup: "Tríceps",
    equipment: "Polea",
    unifiedCode: "[HIPER-TRIC-PUSH-02]",
    defaultSets: 4,
    defaultReps: "12-15",
    defaultRest: "90 s",
    ratio: 0.9,
    biomechanics: "Extensión de codo con tensión continua por cable y separación terminal para activación de la cabeza lateral e interna del tríceps."
  },
  {
    id: "lib_arm_3",
    name: "Fondos en Máquina Asistida o Paralelas (Dips Machine)",
    muscleGroup: "Tríceps / Pecho",
    equipment: "Máquina",
    unifiedCode: "[HIPER-TRIC-DIPS-03]",
    defaultSets: 3,
    defaultReps: "10-12",
    defaultRest: "120 s",
    ratio: 1.3,
    biomechanics: "Ejercicio compuesto de empuje para hipertrofia de masa masiva en la cabeza larga y lateral del tríceps braquial."
  },

  // PANTORRILLA & ABDOMEN
  {
    id: "lib_core_1",
    name: "Elevación de Talones en Máquina Sentado o Pie (Calf Raise Machine)",
    muscleGroup: "Pantorrillas",
    equipment: "Máquina",
    unifiedCode: "[HIPER-PANT-MÁQ-01]",
    defaultSets: 4,
    defaultReps: "15-20",
    defaultRest: "60 s",
    ratio: 1.5,
    biomechanics: "Extensión plantígrada completa con pausa de 2 segundos en el máximo estiramiento inferior para estimular soleo y gastrocnemio."
  },
  {
    id: "lib_core_2",
    name: "Crunch Abdominal en Máquina con Carga o Polea Alta (Cable Crunch)",
    muscleGroup: "Abdomen",
    equipment: "Máquina / Polea",
    unifiedCode: "[HIPER-ABDO-CRUN-02]",
    defaultSets: 4,
    defaultReps: "15-20",
    defaultRest: "60 s",
    ratio: 0.9,
    biomechanics: "Flexión espinal activa contra resistencia graduada que engrosa los bloques del recto abdominal profunda y controladamente."
  }
];

export const MUSCLE_GROUPS_LIST = [
  "Pecho", "Espalda", "Hombros", "Cuádriceps", "Isquiotibiales", 
  "Glúteos", "Bíceps", "Tríceps", "Pantorrillas", "Abdomen", "Cardio"
];
