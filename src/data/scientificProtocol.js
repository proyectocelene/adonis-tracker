export const scientificProtocol = [
  {
    id: "d1",
    dayNumber: 1,
    name: "Lunes: Empuje (Pecho, Hombro y Tríceps)",
    type: "workout",
    focus: "Hipertrofia en haz clavicular y amplitud bi-acromial. Protección estricta de la pared abdominal (IAP) mediante respiración exhalatoria.",
    exercises: [
      {
        id: "d1_e1",
        name: "Press Inclinado con Mancuernas (DB Incline Press)",
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con mancuernas de 30 o 35 lbs por mano. Controla la fase excéntrica (bajada) en 3 segundos. REGLA DE LA HERNIA (IAP): Exhala con fuerza por la boca al empujar en el punto de mayor esfuerzo. NUNCA aguantes la respiración.",
        searchQuery: "dumbbell incline chest press proper execution biomechanics"
      },
      {
        id: "d1_e2",
        name: "Nitro Incline Press Machine",
        sets: 3,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 80 lbs. Ajusta el asiento de modo que los manerales queden alineados con las clavículas y el pectoral superior. Exhala en la extensión de codos.",
        searchQuery: "incline chest press machine exercise setup"
      },
      {
        id: "d1_e3",
        name: "Pec Deck (Cristos en máquina para Pectoral)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Aislamiento pectoral. Enfócate en apretar el pecho al centro durante 1 segundo en máxima contracción. Mantén el esternón elevado y codos al nivel del hombro.",
        searchQuery: "pec deck fly machine proper posture"
      },
      {
        id: "d1_e4",
        name: "Elevaciones Laterales con Mancuernas (Dumbbell Lateral Raise)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con mancuernas de 15 o 20 lbs. Codos ligeramente flexionados, abducción del húmero en el plano escapular (30° hacia adelante del plano lateral).",
        searchQuery: "standing dumbbell lateral raise scapular plane"
      },
      {
        id: "d1_e5",
        name: "Extensión de Tríceps en Polea Alta (con Cuerda)",
        sets: 4,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Extensión completa de codos abriendo la cuerda en la parte inferior. Codos firmes pegados al costado del torso sin oscilar los hombros.",
        searchQuery: "tricep pushdown rope proper form"
      },
      {
        id: "d1_e6",
        name: "Vacuum Abdominal (Control Transverso del Abdomen)",
        sets: 4,
        reps: "15 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "Bota todo el aire pulmonar y mete el ombligo hacia tu espalda o columna vertebral. Aguanta 15 segundos en este vacío abdominal para fortalecer el cinturón estabilizador y proteger contra hernias.",
        searchQuery: "stomach vacuum exercise abdominal core preservation"
      },
      {
        id: "d1_e7",
        name: "Cardio Aeróbico en Zona 2 (Sin Impacto Abdominal)",
        isCardio: true,
        sets: 1,
        reps: "30 min",
        restTime: "-",
        defaultUnit: "min",
        biomechanics: "Caminadora con inclinación (velocidad 4-5 km/h, inclinación 10-12%) o Elíptica. NO USAR STAIRMASTER (Escaleras). Intensidad moderada donde puedas mantener una conversación sin fatiga respiratoria.",
        searchQuery: "treadmill walking 12 incline 3 speed posture"
      }
    ]
  },
  {
    id: "d2",
    dayNumber: 2,
    name: "Martes: Piernas y Glúteos 1 (Enfoque Cuádriceps)",
    type: "workout",
    focus: "Estimulación mecánica del cuádriceps femoral y glúteo medio con estabilización de presión intraabdominal. Hoy NO HAY CARDIO para maximizar la preservación y recuperación del Sistema Nervioso.",
    exercises: [
      {
        id: "d2_e1",
        name: "Hack Squat (Sentadilla en Máquina Hack)",
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia solo con la plataforma sin discos o con 1 disco de 25 lbs por lado para calibrar. REGLA ANTI-HERNIA (IAP): Exhala con potencia al subir desde el fondo. Espalda y lumbares pegados firmemente al respaldo.",
        searchQuery: "hack squat machine depth breath technique"
      },
      {
        id: "d2_e2",
        name: "Leg Press (Prensa de Piernas)",
        sets: 3,
        reps: "10-12",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Baja SOLO hasta el ángulo de 90 grados en rodillas. NUNCA pegues las rodillas a tu pecho ni permitas que tu cadera o lumbares se separen del respaldo (riesgo abdominal/lumbar). Exhala al empujar.",
        searchQuery: "leg press 90 degrees posture core safety"
      },
      {
        id: "d2_e3",
        name: "Leg Extension (Extensión de Cuádriceps)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con 90 - 110 lbs. Contracción isométrica estricta de 1 segundo en el tope superior. Bajada controlada en 2 segundos.",
        searchQuery: "leg extension machine quad contraction"
      },
      {
        id: "d2_e4",
        name: "Patada de Glúteo en Polea o Máquina (Glute Kickbacks)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "3 series de 12-15 reps por cada pierna. Extensión pura de cadera para activar glúteo mayor y medio sin arquear el área lumbar ni rotar la pelvis.",
        searchQuery: "cable glute kickback standing posture"
      },
      {
        id: "d2_e5",
        name: "Plancha Abdominal Isométrica (Plank)",
        sets: 3,
        reps: "45 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "Aguanta 45 segundos por serie manteniendo el ombligo fuertemente metido hacia tu espalda todo el tiempo. Respiración superficial controlada sin aumentar la presión intraabdominal.",
        searchQuery: "forearm plank strict anterior trunk stabilization"
      }
    ]
  },
  {
    id: "d3",
    dayNumber: 3,
    name: "Miércoles: Jalón (Espalda y Bíceps)",
    type: "workout",
    focus: "Desarrollo de amplitud dorsal (morfología V-Taper) y flexores del codo. Control postural y liberación de carga lumbar.",
    exercises: [
      {
        id: "d3_e1",
        name: "Jalón al Pecho en Polea (Lat Pulldown - Agarre Ancho)",
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Saca el pecho hacia arriba y tracciona la barra directamente a la clavícula (NUNCA jalar detrás del cuello/nuca). Inicia el movimiento deponiendo y retrallendo las escápulas antes de doblar los codos.",
        searchQuery: "wide grip lat pulldown sternum focus"
      },
      {
        id: "d3_e2",
        name: "Remo Compuesto en Máquina (Compound Row)",
        sets: 3,
        reps: "10-12",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con tus 110 lbs de referencia. Apoya el tórax firmemente contra el cojín frontal de la máquina para neutralizar la carga lumbar y abdominal. Exhala al llevar los codos atrás.",
        searchQuery: "seated compound row machine chest pad supported"
      },
      {
        id: "d3_e3",
        name: "Pull-Over en Polea Alta (con Cuerda - Straight Arm)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Brazos casi rectos con ligera flexión fija en los codos. Jala la cuerda en un arco amplio desde la cabeza hacia la cadera. Excelente activación del dorsal ancho para potenciar el aspecto de V.",
        searchQuery: "cable straight arm pulldown lat extension"
      },
      {
        id: "d3_e4",
        name: "Face Pulls en Polea Alta (con Cuerda)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Jala la cuerda hacia la altura de tus ojos y frente, manteniendo los codos altos e imprimiendo rotación externa al final del empuje para deltoides posterior y rotadores.",
        searchQuery: "cable face pull external shoulder rotation"
      },
      {
        id: "d3_e5",
        name: "Curl de Bíceps con Mancuernas (Alternado con Supinación)",
        sets: 4,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con mancuernas de 25-30 lbs. Rota la muñeca hacia afuera al subir (supinación) para máxima contracción del bíceps braquial. Sin impulso del torso.",
        searchQuery: "alternating dumbbell supinator bicep curl"
      },
      {
        id: "d3_e6",
        name: "Vacuum Abdominal (Control Transverso del Abdomen)",
        sets: 4,
        reps: "15 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "4 series aguantando 15 segundos con exhalación completa, pegando el ombligo hacia tu espalda o columna vertebral.",
        searchQuery: "abdominal vacuum breathing drill"
      },
      {
        id: "d3_e7",
        name: "Cardio Aeróbico en Zona 2",
        isCardio: true,
        sets: 1,
        reps: "30 min",
        restTime: "-",
        defaultUnit: "min",
        biomechanics: "30 minutos en Bicicleta Estática o Caminadora con inclinación. Respiración controlada naso-bucal, sin ahogo del habla para proteger pared abdominal.",
        searchQuery: "stationary ergometer cycling posture"
      }
    ]
  },
  {
    id: "d4",
    dayNumber: 4,
    name: "Jueves: Descanso Activo & Oxigenación Vascular",
    type: "rest",
    focus: "Regeneración del Sistema Nervioso Central y oxigenación tisular para eliminación de metabolitos. Cero cargas pesadas ni impacto intraabdominal.",
    exercises: [
      {
        id: "d4_e1",
        name: "Cardio Opcional Aeróbico de Recuperación (Zona 2)",
        isCardio: true,
        sets: 1,
        reps: "40 min",
        restTime: "-",
        defaultUnit: "min",
        biomechanics: "Opcional si decides asistir al gimnasio: 40 minutos de Caminadora Inclinada o Bicicleta Estática (puedes escuchar un podcast o revisar tu móvil). CERO PESAS ni esfuerzos mecánicos. Estiramientos suaves.",
        searchQuery: "zone 2 low intensity cardiovascular health"
      }
    ]
  },
  {
    id: "d5",
    dayNumber: 5,
    name: "Viernes: Piernas y Glúteos 2 (Enfoque Femorales y Pantorrilla)",
    type: "workout",
    focus: "Estimulación mecánica de los isquiotibiales (femorales), glúteo mayor y tríceps sural (pantorrillas). Estabilización lateral del core sin presión lumbar.",
    exercises: [
      {
        id: "d5_e1",
        name: "Sentadilla Búlgara con Mancuernas (Bulgarian Split Squat)",
        sets: 3,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "3 series x 8-10 reps por pierna. Inicia con mancuernas ligeras de 15 o 20 lbs por mano. Paso largo hacia atrás y ligera inclinación del torso al frente para enfocar la carga en la cadena posterior y el glúteo mayor. Exhala al subir.",
        searchQuery: "bulgarian split squat glute dominant stance"
      },
      {
        id: "d5_e2",
        name: "Seated Leg Curl (Flexión de Femorales Sentado)",
        sets: 4,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 70 lbs. Ajusta el rodillo superior contra tus muslos y apoya firmemente la espalda en el respaldo para estirar los isquiotibiales en el retorno excéntrico.",
        searchQuery: "seated leg curl machine hamstring tension"
      },
      {
        id: "d5_e3",
        name: "Hip Abductor Machine (Máquina de Abductor - Abrir Cadera)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 125 lbs. Apertura controlada de cadera con pausa de 1 segundo en el tope de contracción para abductores y glúteo medio.",
        searchQuery: "hip abductor machine outer thigh form"
      },
      {
        id: "d5_e4",
        name: "Hip Adductor Machine (Máquina de Adductor - Cerrar Cadera)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 80 a 95 lbs. Cierre concentrado y controlado para fortalecer muslo interno (adductores) y dar estabilidad a la rodilla.",
        searchQuery: "hip adductor inner thigh exercise machine"
      },
      {
        id: "d5_e5",
        name: "Rotary Calf Machine (Elevación de Pantorrillas en Máquina)",
        sets: 4,
        reps: "15-20",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con 170 lbs. REGLA ESTRICTA DE EJECUCIÓN: Pausa obligada de 1 segundo arriba en máxima contracción y 1 segundo abajo en máximo estiramiento. Cero rebotes ni impulsos del tobillo.",
        searchQuery: "rotary calf machine slow strict tempo"
      },
      {
        id: "d5_e6",
        name: "Pallof Press en Polea (Estabilidad Core Anti-Rotación)",
        sets: 3,
        reps: "12",
        restTime: "60 s",
        defaultUnit: "reps",
        biomechanics: "3 series de 12 reps por cada lado. Empuja el maneral directo en frente de tu esternón y resiste la fuerza giratoria del cable por 2 segundos en cada repetición. Abdomen lateral seguro sin compresión.",
        searchQuery: "standing cable pallof press core antirotation"
      }
    ]
  },
  {
    id: "d6",
    dayNumber: 6,
    name: "Sábado: Torso Completo (Simetría, Detalle y Bombeo General)",
    type: "workout",
    focus: "Hipertrofia de refinamiento arquitectónico, simetría muscular del tren superior, y vascularización metabólica profunda ('bombeo general') con tensión constante.",
    exercises: [
      {
        id: "d6_e1",
        name: "Nitro Vertical Chest Machine (Press Vertical en Máquina)",
        sets: 3,
        reps: "10-12",
        restTime: "120 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 80 lbs. Asiento ajustado al nivel del pectoral medio. Empuje fluido manteniendo el tórax en alto y exhalando sin bloquear agresivamente los codos al frente.",
        searchQuery: "vertical chest press machine posture"
      },
      {
        id: "d6_e2",
        name: "Jalón al Pecho Agarre Neutro (Neutral Grip Pulldown)",
        sets: 3,
        reps: "10-12",
        restTime: "120 s",
        defaultUnit: "lbs",
        biomechanics: "Palmas mirándose entre sí (usando maneral V-grip o triángulo). Tracción de la barra o maneral al esternón llevando los codos en línea paralela a las costillas para densidad del dorsal inferior y medio.",
        searchQuery: "close neutral grip cable lat pulldown"
      },
      {
        id: "d6_e3",
        name: "Elevaciones Laterales en Polea Baja (Cable Lateral Raise - Un brazo)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "4 series de 12-15 reps por brazo. El cable proporciona tensión continua desde el estiramiento inicial, a diferencia de las mancuernas. Elevación fluida sin encoger el músculo trapecio.",
        searchQuery: "single arm cable lateral raise proper tension"
      },
      {
        id: "d6_e4",
        name: "Curl de Bíceps en Polea Baja (con Barra Recta)",
        sets: 3,
        reps: "12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Tensión mecánica uniforme en todo el recorrido. Codos pegados a los flancos, máxima contracción de 1 segundo arriba.",
        searchQuery: "low pulley standing straight bar bicep curl"
      },
      {
        id: "d6_e5",
        name: "Extensión de Tríceps Copa Sobre la Cabeza (Overhead Extension)",
        sets: 3,
        reps: "12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Ejecución en polea o con mancuerna sobre la cabeza para elongar la cabeza larga del tríceps al máximo. Codos estables apuntando adelante o ligeramente en V.",
        searchQuery: "cable overhead rope tricep extension"
      },
      {
        id: "d6_e6",
        name: "Cardio Aeróbico en Zona 2",
        isCardio: true,
        sets: 1,
        reps: "40 min",
        restTime: "-",
        defaultUnit: "min",
        biomechanics: "40 minutos en el equipo de tu preferencia en Zona 2 (Caminadora inclinada, Bicicleta o Elíptica). Oxigenación fluida y relajada.",
        searchQuery: "cardiovascular exercise zone 2 conversation test"
      }
    ]
  },
  {
    id: "d7",
    dayNumber: 7,
    name: "Domingo: Descanso Total & Síntesis de Tejidos",
    type: "rest",
    focus: "Recuperación absoluta del Sistema Nervioso Central. Dedícate al descanso, tus responsabilidades laborales y preparar tus comidas (Meal Prep) para garantizar los carbohidratos y 160g de proteína diarios.",
    exercises: []
  }
];
