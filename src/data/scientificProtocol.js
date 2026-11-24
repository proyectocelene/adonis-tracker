// PROTOCOLO ADONIS v4.5 - RUTINA DEFINITIVA Y UNIFICADA (96 SERIES DE FUERZA + CARDIO ZONA 2)
// Actualizada con Familias de Carga, Equivalencias Directas, Motor de Matching, Biomecánica con IAP y Caminadora Inclinada Zona 2 Post-Pesas

export const PROTOCOL_VERSION = '4.5';

export const LOAD_FAMILIES = {
  "INCLINE_PRESS": "Familia Press Superior Inclinado",
  "CHEST_PRESS": "Familia Press Plano de Pecho",
  "OVERHEAD_PRESS": "Familia Press Vertical Hombros",
  "VERTICAL_PULL": "Familia Jalón Vertical Dorsal",
  "HORIZONTAL_ROW": "Familia Remo Horizontal",
  "HACK_SQUAT": "Familia Sentadilla Hack",
  "LEG_PRESS": "Familia Prensa de Piernas",
  "ROMANIAN_DEADLIFT": "Familia Peso Muerto Rumano / Bisagra Cadera",
  "HAMSTRING_CURL": "Familia Flexión de Femorales (Isquiotibiales)",
  "GLUTE_EXTENSION": "Familia Extensión de Cadera / Glúteo",
  "LATERAL_RAISE": "Familia Abducción Lateral de Hombros",
  "TRICEPS_EXT": "Familia Extensión de Tríceps",
  "BICEPS_CURL": "Familia Flexión de Bíceps",
  "CORE_FLEXION": "Familia Flexión Espinal / Abdomen",
  "CALVES": "Familia Extensión de Pantorrillas"
};

const TREADMILL_ZONA2_CARDIO = (dayId) => ({
  id: `${dayId}_cardio`,
  unifiedCode: "[CARD-TREADMILL-INCLINE_01]",
  name: "Caminadora Inclinada Zona 2 Post-Pesas",
  muscleGroup: "Cardio",
  loadFamily: "Cardio Zona 2 Post-Pesas",
  isCardio: true,
  machineType: "treadmill",
  machine: "Caminadora Inclinada (Zona 2)",
  sets: 1,
  reps: "35-45 min",
  restTime: "0 s",
  defaultUnit: "min",
  biomechanics: "Caminadora inclinada post-pesas en Zona 2 aeróbica. FC objetivo: 120-135 lpm / prueba del habla (respiración nasal fluida sin jadear). Inclinación: 8-12% a velocidad de 3.5-4.2 km/h. Camina erguido sin sujetarte de las barandillas.",
  warmup: "🔥 3 minutos progresivos a ritmo suave hasta alcanzar la inclinación objetivo.",
  searchQuery: "incline treadmill zone 2 cardio form",
  equivalents: [
    {
      id: `${dayId}_cardio_eq1`,
      unifiedCode: "[CARD-BIKE-STATIONARY_01]",
      name: "Bicicleta Estática (Zona 2)",
      desc: "Alternativa sin impacto articular manteniendo 120-135 lpm.",
      ratio: 1,
      biomechanics: "Cadencia estable 70-85 RPM en Zona 2 aeróbica (prueba del habla).",
      searchQuery: "stationary bike zone 2 cardio"
    }
  ]
});

export const scientificProtocol = [
  {
    id: "d1",
    dayNumber: 1,
    name: "Lunes: Empuje 1 (Pecho Clavicular, Hombro Lateral, Tríceps Largo & Core)",
    type: "workout",
    focus: "Protocolo Adonis v4.5 (16 series fuerza + Zona 2): Press Inclinado con Mancuernas #1 para haz clavicular, Elevaciones Laterales en Máquina #2 para anchura deltoidea, Pec Deck #3, Copa en Polea #4 y Crunch Declinado con Disco #5.",
    exercises: [
      {
        id: "d1_e1",
        unifiedCode: "[PECH-INC_PRESS-MANC_30]",
        name: "Press Inclinado con Mancuernas (Banco a 30°)",
        muscleGroup: "Pecho (Pectoral Superior Clavicular)",
        loadFamily: LOAD_FAMILIES.INCLINE_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Banco a 30° exactos para alinear las fibras claviculares. Codos a ~45° respecto al torso, bajada excéntrica controlada de 3 segundos hasta estiramiento profundo y empuje convergente sin chocar las mancuernas.",
        warmup: "🔥 Sí ocupa (2 series feeder):\n• Serie 1: 50% del peso de trabajo x 10 reps.\n• Serie 2: 75% del peso de trabajo x 4 reps.",
        searchQuery: "dumbbell incline chest press 30 degree bench proper form",
        equivalents: [
          {
            id: "d1_e1_eq1",
            unifiedCode: "[PECH-INC_PRESS-NITRO_01]",
            name: "Press Inclinado en Máquina (Nitro Incline)",
            desc: "Trayectoria guiada convergente si los bancos inclinados están ocupados.",
            ratio: 1,
            biomechanics: "Asiento ajustado para iniciar a la altura clavicular. Escápulas retraídas contra el respaldo.",
            warmup: "🔥 Sí ocupa (2 series feeder):\n• Serie 1: 50% x 10 reps.\n• Serie 2: 75% x 4 reps.",
            searchQuery: "nitro incline chest press machine form"
          }
        ]
      },
      {
        id: "d1_e2",
        unifiedCode: "[HOMB-LAT_RAISE-MAQ_01]",
        name: "Elevaciones Laterales en Máquina",
        muscleGroup: "Hombros (Deltoides Lateral)",
        loadFamily: LOAD_FAMILIES.LATERAL_RAISE,
        sets: 4,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Asiento ajustado para alinear el eje de la máquina con la articulación del hombro. Empuja desde los codos hacia los lados hasta la horizontal sin encoger trapecios; controla el descenso en 2-3 segundos.",
        warmup: "🔥 No ocupa",
        searchQuery: "lateral raise machine shoulder form",
        equivalents: [
          {
            id: "d1_e2_eq1",
            unifiedCode: "[HOMB-LAT_RAISE-CABLE_01]",
            name: "Elevaciones Laterales en Polea Baja a una Mano",
            desc: "Alternativa unilateral con tensión constante en estiramiento.",
            ratio: 1,
            biomechanics: "Polea a la altura de la muñeca, torso firme y elevación en el plano escapular.",
            warmup: "🔥 No ocupa",
            searchQuery: "single arm cable lateral raise form"
          }
        ]
      },
      {
        id: "d1_e3",
        unifiedCode: "[PECH-PEC_DECK-STACK_01]",
        name: "Cristos en Máquina (Pec Deck)",
        muscleGroup: "Pecho (Aducción Horizontal)",
        loadFamily: LOAD_FAMILIES.CHEST_PRESS,
        sets: 3,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Escápulas pegadas al respaldo y microflexión constante de codos (15°). Abre hasta sentir estiramiento pectoral controlado y junta pensando en acercar los bíceps al esternón con pausa de 1s.",
        warmup: "🔥 No ocupa",
        searchQuery: "pec deck machine chest fly form",
        equivalents: [
          {
            id: "d1_e3_eq1",
            unifiedCode: "[PECH-CABLE_CROSS-MID_01]",
            name: "Cruce de Poleas a Media Altura (Cable Crossover)",
            desc: "Aducción horizontal en poleas si Pec Deck está ocupado.",
            ratio: 1,
            biomechanics: "Paso al frente, torso estable a 10° y codos fijos en arco amplio.",
            warmup: "🔥 No ocupa",
            searchQuery: "cable crossover chest fly form"
          }
        ]
      },
      {
        id: "d1_e4",
        unifiedCode: "[TRIC-OVERHEAD_EXT-CABLE_01]",
        name: "Extensión de Tríceps Copa en Polea (Cuerda)",
        muscleGroup: "Tríceps (Cabeza Larga en Elongación)",
        loadFamily: LOAD_FAMILIES.TRICEPS_EXT,
        sets: 4,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "De espaldas a la polea con cuerda sobre la cabeza. Codos apuntando adelante y arriba; deja que los antebrazos flexionen al máximo detrás de la nuca para estirar la cabeza larga y extiende por completo.",
        warmup: "🔥 No ocupa",
        searchQuery: "overhead cable rope triceps extension form",
        equivalents: [
          {
            id: "d1_e4_eq1",
            unifiedCode: "[TRIC-PUSHDOWN-CABLE_01]",
            name: "Extensión de Tríceps en Polea (Pushdown)",
            desc: "Alternativa en polea alta manteniendo codos fijos a los costados.",
            ratio: 1,
            biomechanics: "Codos pegados al torso, extensión completa abajo sin balancear hombros.",
            warmup: "🔥 No ocupa",
            searchQuery: "cable triceps pushdown form"
          }
        ]
      },
      {
        id: "d1_e5",
        unifiedCode: "[ABDO-DECLINE_CRUNCH-DISC_01]",
        name: "Crunch Declinado con Disco (Decline Plate-Weighted Crunch)",
        muscleGroup: "Abdomen (Recto Abdominal)",
        loadFamily: LOAD_FAMILIES.CORE_FLEXION,
        sets: 2,
        reps: "10-15",
        restTime: "60-90 s",
        defaultUnit: "lbs",
        biomechanics: "Sostén un disco o mancuerna contra el pecho y flexiona la columna redondeando la espalda alta al subir para aislar el recto abdominal sin jalar el cuello ni dominar con el psoas.",
        warmup: "🔥 No ocupa",
        searchQuery: "decline weighted crunch proper form hypertrophy",
        equivalents: []
      },
      TREADMILL_ZONA2_CARDIO("d1")
    ]
  },
  {
    id: "d2",
    dayNumber: 2,
    name: "Martes: Pierna 1 (Enfoque Cuádriceps, Femorales, Glúteo F2 & Pantorrilla)",
    type: "workout",
    focus: "Protocolo Adonis v4.5 (16 series fuerza + Zona 2): Hack Squat pesada #1 con pre-activación sinovial en Extensión, Prensa 45° #2, Extensión de Cuádriceps #3, Curl Femoral Sentado #4, Glute Butt Blaster #5 y Pantorrillas #6.",
    exercises: [
      {
        id: "d2_e1",
        unifiedCode: "[CUAD-HACK_SQUAT-DISC_01]",
        name: "Sentadilla en Máquina Hack (Hack Squat)",
        muscleGroup: "Cuádriceps (Máxima Flexión de Rodilla)",
        loadFamily: LOAD_FAMILIES.HACK_SQUAT,
        sets: 3,
        reps: "6-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Pies en zona media-baja de la plataforma manteniendo talones pegados. Desciende en 3 segundos hasta romper el paralelo y empuja sin despegar lumbares del respaldo.",
        warmup: "🔥 Sí ocupa:\n• Pre-activación: 2 series ligeras de Extensión de Cuádriceps (RPE 5-6) para líquido sinovial.\n• Serie 1 (Hack): 50% del peso de trabajo x 8 reps.\n• Serie 2 (Hack): 75% del peso de trabajo x 4 reps.",
        searchQuery: "hack squat machine quad bias form",
        equivalents: [
          {
            id: "d2_e1_eq1",
            unifiedCode: "[CUAD-LEG_PRESS-DISC_45_PB]",
            name: "Prensa de Piernas 45° (Posición Central)",
            desc: "Alternativa guiada si la Hack Squat está ocupada.",
            ratio: 1,
            biomechanics: "Rango completo sin despegar el sacro del respaldo.",
            warmup: "🔥 Sí ocupa:\n• Serie 1: 50% x 8 reps.\n• Serie 2: 75% x 4 reps.",
            searchQuery: "45 degree leg press form"
          }
        ]
      },
      {
        id: "d2_e2",
        unifiedCode: "[CUAD-LEG_PRESS-DISC_45_PB]",
        name: "Prensa de Piernas 45° (Posición Central)",
        muscleGroup: "Cuádriceps & Pierna Completa",
        loadFamily: LOAD_FAMILIES.LEG_PRESS,
        sets: 2,
        reps: "10-12",
        restTime: "180 s",
        defaultUnit: "lbs",
        biomechanics: "Pies al ancho de hombros en posición media-baja. Baja en 3 segundos hasta máxima flexión sin retroversión pélvica y empuja fuerte dejando microflexión en rodillas.",
        warmup: "🔥 Sí ocupa (1 serie de aproximación):\n• Serie 1: 60% del peso de trabajo x 6 reps.",
        searchQuery: "45 degree leg press quad placement form",
        equivalents: []
      },
      {
        id: "d2_e3",
        unifiedCode: "[CUAD-LEG_EXT-STACK_01]",
        name: "Extensión de Cuádriceps en Máquina (Leg Extension)",
        muscleGroup: "Cuádriceps (Recto Femoral)",
        loadFamily: LOAD_FAMILIES.HACK_SQUAT,
        sets: 3,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Eje de la máquina alineado con la rodilla, respaldo inclinado atrás para estirar el recto femoral. Sujeta las asas con fuerza, pausa 1s arriba y baja en 2-3 segundos.",
        warmup: "🔥 No ocupa",
        searchQuery: "seated leg extension machine form",
        equivalents: []
      },
      {
        id: "d2_e4",
        unifiedCode: "[ISQU-LEG_CURL-SEATED_01]",
        name: "Flexión de Femorales Sentado (Seated Leg Curl)",
        muscleGroup: "Isquiotibiales (Estiramiento en Cadera Flexionada)",
        loadFamily: LOAD_FAMILIES.HAMSTRING_CURL,
        sets: 2,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Almohadilla superior firme sobre los muslos para fijar la cadera flexionada y maximizar el estiramiento del femoral. Flexión explosiva y excéntrica de 3 segundos.",
        warmup: "🔥 No ocupa",
        searchQuery: "seated leg curl machine form",
        equivalents: []
      },
      {
        id: "d2_e5",
        unifiedCode: "[GLUT-BUTT_BLASTER-MAQ_01]",
        name: "Glute Butt Blaster en Máquina",
        muscleGroup: "Glúteo Mayor (Extensión de Cadera)",
        loadFamily: LOAD_FAMILIES.GLUTE_EXTENSION,
        sets: 3,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Abdomen contraído para evitar hiperextensión lumbar. Empuja con el talón hacia atrás y arriba apretando el glúteo 1s en extensión completa.",
        warmup: "🔥 No ocupa",
        searchQuery: "glute butt blaster machine kickback form",
        equivalents: []
      },
      {
        id: "d2_e6",
        unifiedCode: "[PANT-CALF_RAISE-MAQ_01]",
        name: "Elevación de Pantorrillas en Máquina (Pausa 2s Estiramiento)",
        muscleGroup: "Pantorrillas (Gastrocnemio & Sóleo)",
        loadFamily: LOAD_FAMILIES.CALVES,
        sets: 3,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Pausa obligatoria de 2 segundos completos abajo en máximo estiramiento para eliminar el rebote del tendón de Aquiles; sube explosivo y aprieta 1s arriba.",
        warmup: "🔥 No ocupa",
        searchQuery: "standing calf raise machine 2 second pause form",
        equivalents: []
      },
      TREADMILL_ZONA2_CARDIO("d2")
    ]
  },
  {
    id: "d3",
    dayNumber: 3,
    name: "Miércoles: Tirón 1 (Amplitud Dorsal, Densidad Alta, Posterior & Bíceps)",
    type: "workout",
    focus: "Protocolo Adonis v4.4 (16 series fuerza + Zona 2): Jalón Ancho #1, Remo Apoyo al Pecho #2, Pull-Over Polea #3, Face Pulls #4, Bayesian Curl #5 y Martillo Cruzado #6.",
    exercises: [
      {
        id: "d3_e1",
        unifiedCode: "[ESPA-PULLDOWN-WIDE_01]",
        name: "Jalón al Pecho en Polea (Agarre Ancho Pronado)",
        muscleGroup: "Espalda (Dorsal Ancho - Amplitud)",
        loadFamily: LOAD_FAMILIES.VERTICAL_PULL,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Agarre prono a 1.5x ancho de hombros. Inicia deprimiendo escápulas y dirige los codos hacia las caderas sin balancear excesivamente el torso; estira arriba sin soltar tensión.",
        warmup: "🔥 Sí ocupa (2 series feeder):\n• Serie 1: 50% del peso de trabajo x 10 reps.\n• Serie 2: 75% del peso de trabajo x 4 reps.",
        searchQuery: "wide grip lat pulldown proper form",
        equivalents: [
          {
            id: "d3_e1_eq1",
            unifiedCode: "[ESPA-PULLDOWN-V_GRIP_01]",
            name: "Jalón al Pecho Agarre Estrecho Neutro (V-Grip)",
            desc: "Alternativa neutra si la barra ancha no está disponible.",
            ratio: 1,
            biomechanics: "Codos pegados a los costados jalando hacia la parte baja del esternón.",
            warmup: "🔥 Sí ocupa (2 series feeder):\n• Serie 1: 50% x 10 reps.\n• Serie 2: 75% x 4 reps.",
            searchQuery: "v grip lat pulldown form"
          }
        ]
      },
      {
        id: "d3_e2",
        unifiedCode: "[ESPA-MACHINE_ROW-CHEST_SUPP_01]",
        name: "Remo Compuesto en Máquina (Apoyo al Pecho)",
        muscleGroup: "Espalda Media (Trapecio Medio & Romboides)",
        loadFamily: LOAD_FAMILIES.HORIZONTAL_ROW,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Pecho fijo al cojín para aislar la espalda sin fatiga lumbar. Permite protracción escapular adelante y retrae fuerte atrás conduciendo los codos hacia atrás.",
        warmup: "🔥 Sí ocupa (1 serie feeder):\n• Serie 1: 70% del peso de trabajo x 4 reps.",
        searchQuery: "chest supported machine row form",
        equivalents: [
          {
            id: "d3_e2_eq1",
            unifiedCode: "[ESPA-SEATED_ROW-GIRONDA_01]",
            name: "Remo Sentado en Polea Baja (Gironda)",
            desc: "Alternativa en polea si la máquina con apoyo al pecho está ocupada.",
            ratio: 1,
            biomechanics: "Torso vertical, jala hacia el ombligo retrayendo escápulas.",
            warmup: "🔥 Sí ocupa (1 serie feeder):\n• Serie 1: 70% x 4 reps.",
            searchQuery: "seated cable row gironda form"
          }
        ]
      },
      {
        id: "d3_e3",
        unifiedCode: "[ESPA-PULLOVER-HIGH_CABLE_01]",
        name: "Pull-Over en Polea Alta con Cuerda",
        muscleGroup: "Espalda (Aislamiento Dorsal Puro)",
        loadFamily: LOAD_FAMILIES.VERTICAL_PULL,
        sets: 2,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Torso inclinado 30-45° con brazos casi extendidos. Lleva la cuerda en arco hasta los muslos deprimiendo dorsales y sube controlando el estiramiento sobre la cabeza.",
        warmup: "🔥 No ocupa",
        searchQuery: "cable rope straight arm pulldown pullover form",
        equivalents: []
      },
      {
        id: "d3_e4",
        unifiedCode: "[HOMB-FACE_PULL-HIGH_CABLE_01]",
        name: "Face Pulls en Polea Alta con Cuerda",
        muscleGroup: "Hombro Posterior & Manguito Rotador",
        loadFamily: LOAD_FAMILIES.HORIZONTAL_ROW,
        sets: 3,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Polea a la altura de la frente. Jala separando la cuerda hacia las orejas con rotación externa de hombros (doble bíceps al final) y pausa de 1s.",
        warmup: "🔥 No ocupa",
        searchQuery: "high cable rope face pull external rotation form",
        equivalents: []
      },
      {
        id: "d3_e5",
        unifiedCode: "[BICEP-CABLE_CURL-BAYESIAN_01]",
        name: "Bayesian Cable Curl (Estiramiento Humeral en Polea)",
        muscleGroup: "Bíceps (Cabeza Larga en Hiperextensión)",
        loadFamily: LOAD_FAMILIES.BICEPS_CURL,
        sets: 3,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "De espaldas a la polea baja dando un paso adelante para llevar el codo detrás del torso. Mantén el húmero fijo atrás mientras flexionas el codo en supinación.",
        warmup: "🔥 No ocupa",
        searchQuery: "bayesian cable curl form",
        equivalents: []
      },
      {
        id: "d3_e6",
        unifiedCode: "[BICEP-HAMMER_CURL-MANC_01]",
        name: "Curl Martillo Cruzado (Cross-Body Hammer)",
        muscleGroup: "Braquial & Braquiorradial",
        loadFamily: LOAD_FAMILIES.BICEPS_CURL,
        sets: 2,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Agarre neutro (pulgar arriba) elevando la mancuerna en diagonal hacia el pectoral opuesto para maximizar la activación del braquial sin balanceo de codos.",
        warmup: "🔥 No ocupa",
        searchQuery: "cross body hammer curl dumbbell form",
        equivalents: []
      },
      TREADMILL_ZONA2_CARDIO("d3")
    ]
  },
  {
    id: "d4",
    dayNumber: 4,
    name: "Jueves: Empuje 2 (Pecho Esternal, Polea Lateral, Nitro, Pushdown & Core)",
    type: "workout",
    focus: "Protocolo Adonis v4.4 (16 series fuerza + Zona 2): Chest Press Convergente #1, Laterales Polea Tras Espalda #2, Nitro Incline #3, Pec Deck #4, Pushdown #5 y Cable Crunch #6.",
    exercises: [
      {
        id: "d4_e1",
        unifiedCode: "[PECH-CHEST_PRESS-CONV_01]",
        name: "Press de Pecho en Máquina Convergente (Chest Press)",
        muscleGroup: "Pecho (Pectoral Mayor & Esternal)",
        loadFamily: LOAD_FAMILIES.CHEST_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Asiento ajustado para alinear manerales con el esternón medio. Escápulas pegadas y deprimidas; excéntrica de 3 segundos y empuje potente convergente.",
        warmup: "🔥 Sí ocupa (2 series feeder):\n• Serie 1: 50% del peso de trabajo x 10 reps.\n• Serie 2: 75% del peso de trabajo x 4 reps.",
        searchQuery: "converging machine chest press form",
        equivalents: []
      },
      {
        id: "d4_e2",
        unifiedCode: "[HOMB-LAT_RAISE-BEHIND_CABLE_01]",
        name: "Elevaciones Laterales en Polea Baja (Tras Espalda)",
        muscleGroup: "Hombros (Deltoides Lateral)",
        loadFamily: LOAD_FAMILIES.LATERAL_RAISE,
        sets: 3,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Polea a la altura de la muñeca pasando el cable por detrás de los glúteos para máxima tensión desde el inicio del rango. Eleva en el plano escapular (30° adelante).",
        warmup: "🔥 No ocupa",
        searchQuery: "behind the back cable lateral raise form",
        equivalents: [
          {
            id: "d4_e2_eq1",
            unifiedCode: "[HOMB-LAT_RAISE-CABLE_01]",
            name: "Elevaciones Laterales en Polea Baja a una Mano",
            desc: "Alternativa pasando el cable por delante si prefieres alineación frontal.",
            ratio: 1,
            biomechanics: "Elevación continua sin encoger el trapecio superior.",
            warmup: "🔥 No ocupa",
            searchQuery: "cable lateral raise form"
          }
        ]
      },
      {
        id: "d4_e3",
        unifiedCode: "[PECH-INC_PRESS-NITRO_01]",
        name: "Press Inclinado en Máquina (Nitro Incline)",
        muscleGroup: "Pecho (Pectoral Superior Clavicular)",
        loadFamily: LOAD_FAMILIES.INCLINE_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Asiento calibrado para iniciar a la altura de las clavículas. Mantén la caja torácica elevada, bajada controlada en 3s y empuje convergente.",
        warmup: "🔥 Sí ocupa (1 serie feeder):\n• Serie 1: 70% del peso de trabajo x 4 reps.",
        searchQuery: "nautilus nitro incline chest press form",
        equivalents: []
      },
      {
        id: "d4_e4",
        unifiedCode: "[PECH-PEC_DECK-STACK_01]",
        name: "Cristos en Máquina (Pec Deck)",
        muscleGroup: "Pecho (Aducción Horizontal)",
        loadFamily: LOAD_FAMILIES.CHEST_PRESS,
        sets: 2,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Pecho abierto y codos en microflexión de 15°. Pausa de 1s en estiramiento y 1s al centro contrayendo el pectoral sin adelantar hombros.",
        warmup: "🔥 No ocupa",
        searchQuery: "pec deck machine fly form",
        equivalents: []
      },
      {
        id: "d4_e5",
        unifiedCode: "[TRIC-PUSHDOWN-CABLE_01]",
        name: "Extensión de Tríceps en Polea (Pushdown)",
        muscleGroup: "Tríceps (Cabeza Lateral & Medial)",
        loadFamily: LOAD_FAMILIES.TRICEPS_EXT,
        sets: 3,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Codos bloqueados a los costados del torso, ligera inclinación de 10° adelante. Extiende por completo abajo sin despegar los codos ni usar impulso del hombro.",
        warmup: "🔥 No ocupa",
        searchQuery: "cable triceps pushdown form",
        equivalents: []
      },
      {
        id: "d4_e6",
        unifiedCode: "[ABDO-DECLINE_CRUNCH-DISC_01]",
        name: "Crunch Declinado con Disco (Decline Plate-Weighted Crunch)",
        muscleGroup: "Abdomen (Recto Abdominal)",
        loadFamily: LOAD_FAMILIES.CORE_FLEXION,
        sets: 2,
        reps: "10-15",
        restTime: "60-90 s",
        defaultUnit: "lbs",
        biomechanics: "Sostén un disco o mancuerna contra el pecho y flexiona la columna redondeando la espalda alta al subir para aislar el recto abdominal sin jalar el cuello ni dominar con el psoas.",
        warmup: "🔥 No ocupa",
        searchQuery: "decline weighted crunch proper form hypertrophy",
        equivalents: []
      },
      TREADMILL_ZONA2_CARDIO("d4")
    ]
  },
  {
    id: "d5",
    dayNumber: 5,
    name: "Viernes: Pierna 2 (Cadena Posterior, Glúteo, Abductores & Pantorrilla)",
    type: "workout",
    focus: "Protocolo Adonis v4.4 (16 series fuerza + Zona 2): Curl Femoral Sentado #1, RDL Mancuernas #2, Prensa Pies Altos #3, Butt Blaster #4, Abductores #5 y Pantorrillas #6.",
    exercises: [
      {
        id: "d5_e1",
        unifiedCode: "[ISQU-LEG_CURL-SEATED_01]",
        name: "Flexión de Femorales Sentado (Seated Leg Curl)",
        muscleGroup: "Isquiotibiales (Máximo Estiramiento)",
        loadFamily: LOAD_FAMILIES.HAMSTRING_CURL,
        sets: 3,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Rodillo superior bien ajustado sobre los cuádriceps. Flexiona con potencia y controla la vuelta en 3 segundos hasta estirar por completo.",
        warmup: "🔥 Sí ocupa (1 serie feeder):\n• Serie 1: 60% del peso de trabajo x 10 reps.",
        searchQuery: "seated leg curl machine form",
        equivalents: []
      },
      {
        id: "d5_e2",
        unifiedCode: "[ISQU-RDL-MANC_01]",
        name: "Peso Muerto Rumano (RDL) con Mancuernas",
        muscleGroup: "Isquiotibiales & Glúteo Mayor (Bisagra)",
        loadFamily: LOAD_FAMILIES.ROMANIAN_DEADLIFT,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Rodillas semiflexionadas y fijas (~15°). Empuja la cadera horizontalmente hacia atrás rozando los muslos con las mancuernas y espalda neutra hasta mitad de espinilla; sube extendiendo cadera.",
        warmup: "🔥 Sí ocupa (1 serie feeder):\n• Serie 1: 70% del peso de trabajo x 6 reps.",
        searchQuery: "dumbbell romanian deadlift rdl form",
        equivalents: [
          {
            id: "d5_e2_eq1",
            unifiedCode: "[ISQU-RDL-SMITH_01]",
            name: "Peso Muerto Rumano en Máquina Smith (RDL)",
            desc: "Alternativa guiada en Smith manteniendo barra pegada a los muslos.",
            ratio: 1,
            biomechanics: "Pies al ancho de cadera bajo la barra Smith, bisagra pura hacia atrás manteniendo columna neutra.",
            warmup: "🔥 Sí ocupa (1 serie feeder):\n• Serie 1: 70% x 6 reps.",
            searchQuery: "smith machine romanian deadlift form"
          }
        ]
      },
      {
        id: "d5_e3",
        unifiedCode: "[GLUT-LEG_PRESS-HIGH_FEET_45]",
        name: "Prensa de Piernas 45° (Pies Altos y Abiertos)",
        muscleGroup: "Glúteo Mayor & Aductores/Femorales",
        loadFamily: LOAD_FAMILIES.LEG_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Pies en la parte superior de la plataforma con puntas abiertas a 30°. Baja profundo manteniendo la espalda baja pegada al asiento para reclutar glúteo en estiramiento.",
        warmup: "🔥 Sí ocupa (2 series feeder):\n• Serie 1: 50% del peso de trabajo x 8 reps.\n• Serie 2: 75% del peso de trabajo x 6 reps.",
        searchQuery: "high foot placement leg press glutes form",
        equivalents: []
      },
      {
        id: "d5_e4",
        unifiedCode: "[GLUT-BUTT_BLASTER-MAQ_01]",
        name: "Glute Butt Blaster en Máquina",
        muscleGroup: "Glúteo Mayor (Extensión de Cadera)",
        loadFamily: LOAD_FAMILIES.GLUTE_EXTENSION,
        sets: 3,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Abdomen contraído para evitar hiperextensión lumbar. Empuja con el talón hacia atrás y arriba apretando el glúteo 1s en extensión completa.",
        warmup: "🔥 No ocupa",
        searchQuery: "glute butt blaster machine kickback form",
        equivalents: []
      },
      {
        id: "d5_e5",
        unifiedCode: "[ABDU-ABDUCTOR-STACK_01]",
        name: "Abductores en Máquina (Abrir Cadera)",
        muscleGroup: "Glúteo Medio & Superior",
        loadFamily: LOAD_FAMILIES.GLUTE_EXTENSION,
        sets: 2,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Torso ligeramente inclinado hacia adelante sosteniendo las asas o pegado al respaldo. Abre las rodillas con pausa de 1s afuera y regresa en 2-3s controlados.",
        warmup: "🔥 No ocupa",
        searchQuery: "seated hip abductor machine form",
        equivalents: []
      },
      {
        id: "d5_e6",
        unifiedCode: "[PANT-CALF_RAISE-MAQ_01]",
        name: "Elevación de Pantorrillas en Máquina (Pausa 2s Estiramiento)",
        muscleGroup: "Pantorrillas (Gastrocnemio & Sóleo)",
        loadFamily: LOAD_FAMILIES.CALVES,
        sets: 2,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Pausa completa de 2 segundos en el punto más profundo abajo y extensión total arriba en cada repetición.",
        warmup: "🔥 No ocupa",
        searchQuery: "calf raise machine 2 second pause form",
        equivalents: []
      },
      TREADMILL_ZONA2_CARDIO("d5")
    ]
  },
  {
    id: "d6",
    dayNumber: 6,
    name: "Sábado: Tirón 2 & Hombros/Brazos (Dorsal Bajo, Espesor, Lateral & Bíceps)",
    type: "workout",
    focus: "Protocolo Adonis v4.4 (16 series fuerza + Zona 2): Jalón V-Grip #1, Remo Apoyo al Pecho #2, Elevaciones Laterales Máquina #3, Face Pulls #4, Curl Predicador #5 y Curl Polea Recta #6.",
    exercises: [
      {
        id: "d6_e1",
        unifiedCode: "[ESPA-PULLDOWN-V_GRIP_01]",
        name: "Jalón al Pecho Agarre Estrecho Neutro (V-Grip)",
        muscleGroup: "Espalda (Dorsal Inferior & Redondo Mayor)",
        loadFamily: LOAD_FAMILIES.VERTICAL_PULL,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Agarre neutro estrecho (triángulo V). Pega los codos a los costados tirando hacia el esternón bajo con pecho erguido y extensión completa arriba.",
        warmup: "🔥 Sí ocupa (2 series feeder):\n• Serie 1: 50% del peso de trabajo x 10 reps.\n• Serie 2: 75% del peso de trabajo x 4 reps.",
        searchQuery: "close neutral v grip lat pulldown form",
        equivalents: []
      },
      {
        id: "d6_e2",
        unifiedCode: "[ESPA-MACHINE_ROW-CHEST_SUPP_01]",
        name: "Remo Compuesto en Máquina (Apoyo al Pecho)",
        muscleGroup: "Espalda Media (Espesor Escapular)",
        loadFamily: LOAD_FAMILIES.HORIZONTAL_ROW,
        sets: 3,
        reps: "8-10",
        restTime: "180-240 s",
        defaultUnit: "lbs",
        biomechanics: "Pecho apoyado al cojín para estabilidad total. Tracciona llevando codos atrás con retracción escapular marcada y bajada controlada.",
        warmup: "🔥 Sí ocupa (1 serie feeder):\n• Serie 1: 70% del peso de trabajo x 4 reps.",
        searchQuery: "chest supported machine row form",
        equivalents: [
          {
            id: "d6_e2_eq1",
            unifiedCode: "[ESPA-SEATED_ROW-GIRONDA_01]",
            name: "Remo Sentado en Polea Baja (Gironda)",
            desc: "Alternativa en polea baja manteniendo torso erguido.",
            ratio: 1,
            biomechanics: "Jala hacia el abdomen bajo juntando escápulas atrás sin balancear la espalda.",
            warmup: "🔥 Sí ocupa (1 serie feeder):\n• Serie 1: 70% x 4 reps.",
            searchQuery: "seated cable row gironda form"
          }
        ]
      },
      {
        id: "d6_e3",
        unifiedCode: "[HOMB-LAT_RAISE-MAQ_01]",
        name: "Elevaciones Laterales en Máquina",
        muscleGroup: "Hombros (Deltoides Lateral)",
        loadFamily: LOAD_FAMILIES.LATERAL_RAISE,
        sets: 3,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Empuja desde los codos manteniendo trapecios relajados. Controla la fase excéntrica en 2-3 segundos.",
        warmup: "🔥 No ocupa",
        searchQuery: "machine lateral raise shoulder form",
        equivalents: []
      },
      {
        id: "d6_e4",
        unifiedCode: "[HOMB-FACE_PULL-HIGH_CABLE_01]",
        name: "Face Pulls en Polea Alta con Cuerda",
        muscleGroup: "Hombro Posterior & Salud Escapular",
        loadFamily: LOAD_FAMILIES.HORIZONTAL_ROW,
        sets: 2,
        reps: "12-15",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Tira hacia las orejas separando la cuerda con rotación externa de hombros y control de 2s en retorno.",
        warmup: "🔥 No ocupa",
        searchQuery: "cable face pull form",
        equivalents: []
      },
      {
        id: "d6_e5",
        unifiedCode: "[BICEP-PREACHER_CURL-SCOTT_MAQ_01]",
        name: "Curl en Máquina Predicador (Scott / Arm Curl)",
        muscleGroup: "Bíceps (Pico & Cabeza Corta)",
        loadFamily: LOAD_FAMILIES.BICEPS_CURL,
        sets: 3,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Tríceps apoyados firmemente en el cojín inclinado. Baja hasta casi extender sin hiperextender el codo y sube contrayendo fuerte arriba.",
        warmup: "🔥 No ocupa",
        searchQuery: "preacher curl machine scott curl form",
        equivalents: []
      },
      {
        id: "d6_e6",
        unifiedCode: "[BICEP-CABLE_CURL-LOW_STRAIGHT_01]",
        name: "Curl de Bíceps en Polea Baja (Barra Recta)",
        muscleGroup: "Bíceps Braquial (Tensión Continua)",
        loadFamily: LOAD_FAMILIES.BICEPS_CURL,
        sets: 2,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Polea baja con barra recta. Codos fijos a los costados, contracción máxima arriba y descenso controlado manteniendo tensión continua.",
        warmup: "🔥 No ocupa",
        searchQuery: "low cable straight bar bicep curl form",
        equivalents: []
      },
      TREADMILL_ZONA2_CARDIO("d6")
    ]
  }
];
