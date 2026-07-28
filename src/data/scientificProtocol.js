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
        muscleGroup: "Pecho (Pectoral Superior)",
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con mancuernas de 30 o 35 lbs por mano. Controla la fase excéntrica (bajada) en 3 segundos. REGLA DE LA HERNIA (IAP): Exhala con fuerza por la boca al empujar en el punto de mayor esfuerzo. NUNCA aguantes la respiración.",
        warmup: "🔥 Calentamiento de aproximación: 1 serie al 50% de tu peso efectivo x 15 reps rápidas y fluidas para lubricar hombros y codos.",
        searchQuery: "dumbbell incline chest press proper execution biomechanics",
        equivalents: [
          { id: "d1_e1_eq1", name: "Nitro Incline Press Machine (Máquina)", desc: "Tensión continua sin necesidad de estabilizar mancuernas, ideal para fatiga final.", ratio: 2.2 },
          { id: "d1_e1_eq2", name: "Press Inclinado en Máquina Smith", desc: "Seguro al fallo con recorrido guiado 30-45 grados.", ratio: 2.0 }
        ]
      },
      {
        id: "d1_e2",
        name: "Nitro Incline Press Machine",
        muscleGroup: "Pecho (Pectoral Superior & Medio)",
        sets: 3,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 80 lbs. Ajusta el asiento de modo que los manerales queden alineados con las clavículas y el pectoral superior. Exhala en la extensión de codos.",
        warmup: "🔥 1 serie ligera de 10 reps con 50 lbs para calibrar altura de asiento y recorrido.",
        searchQuery: "incline chest press machine exercise setup",
        equivalents: [
          { id: "d1_e2_eq1", name: "Press Plano o Inclinado con Mancuernas", desc: "Mayor reclutamiento de fibras estabilizadoras pectorales.", ratio: 0.45 },
          { id: "d1_e2_eq2", name: "Press de Pecho en Polea Dobre (Cable Press)", desc: "Tensión convergente al centro de los pectorales.", ratio: 0.6 }
        ]
      },
      {
        id: "d1_e3",
        name: "Pec Deck (Cristos en máquina para Pectoral)",
        muscleGroup: "Pecho (Aislamiento Pectoral)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Aislamiento pectoral. Enfócate en apretar el pecho al centro durante 1 segundo en máxima contracción. Mantén el esternón elevado y codos al nivel del hombro.",
        warmup: "🔥 Serie de activación de 12 reps ligeras para estiramiento escapular sin dolor articular.",
        searchQuery: "pec deck fly machine proper posture",
        equivalents: [
          { id: "d1_e3_eq1", name: "Aperturas con Mancuernas en Banco Inclinado (Dumbbell Flys)", desc: "Máximo estiramiento de fibras en la fase inferior.", ratio: 0.4 },
          { id: "d1_e3_eq2", name: "Cruce de Poleas Medias / Altas (Cable Crossover)", desc: "Tensión constante con pico de contracción al cruzar manos.", ratio: 0.8 }
        ]
      },
      {
        id: "d1_e4",
        name: "Elevaciones Laterales con Mancuernas (Dumbbell Lateral Raise)",
        muscleGroup: "Hombro (Deltoides Medio)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con mancuernas de 15 o 20 lbs. Codos ligeramente flexionados, abducción del húmero en el plano escapular (30° hacia adelante del plano lateral).",
        warmup: "🔥 1 serie ligera con mancuernas de 10 lbs x 15 reps con rotación escapular suave.",
        searchQuery: "standing dumbbell lateral raise scapular plane",
        equivalents: [
          { id: "d1_e4_eq1", name: "Elevaciones Laterales en Máquina (Machine Lateral Raise)", desc: "El rodillo aplica tensión directa en el húmero aislando deltoides sin encoger trapecio.", ratio: 1.5 },
          { id: "d1_e4_eq2", name: "Elevaciones Laterales en Polea Baja (Cable Lateral Raise)", desc: "Resistencia constante desde el inicio del recorrido sin puntos muertos.", ratio: 0.8 }
        ]
      },
      {
        id: "d1_e5",
        name: "Extensión de Tríceps en Polea Alta (con Cuerda)",
        muscleGroup: "Tríceps (Cabeza Lateral & Larga)",
        sets: 4,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Extensión completa de codos abriendo la cuerda en la parte inferior. Codos firmes pegados al costado del torso sin oscilar los hombros.",
        warmup: "🔥 1 serie con peso medio x 15 reps con extensión pausada de codos.",
        searchQuery: "tricep pushdown rope proper form",
        equivalents: [
          { id: "d1_e5_eq1", name: "Extensión de Tríceps con Barra V o Recta (Pushdown)", desc: "Permite movilizar cargas un 15% más pesadas que con cuerda.", ratio: 1.15 },
          { id: "d1_e5_eq2", name: "Press Francés con Mancuernas o Barra Z (Skull Crushers)", desc: "Elongación extrema de la cabeza larga en banco plano.", ratio: 0.9 }
        ]
      },
      {
        id: "d1_e6",
        name: "Vacuum Abdominal (Control Transverso del Abdomen)",
        muscleGroup: "Core (Transverso & Prevención IAP)",
        sets: 4,
        reps: "15 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "Bota todo el aire pulmonar y mete el ombligo hacia tu espalda o columna vertebral. Aguanta 15 segundos en este vacío abdominal para fortalecer el cinturón estabilizador y proteger contra hernias.",
        warmup: "🔥 2 respiraciones profundas diafragmáticas expulsando 100% del aire antes de iniciar.",
        searchQuery: "stomach vacuum exercise abdominal core preservation",
        equivalents: [
          { id: "d1_e6_eq1", name: "Plancha Isométrica con Abdomen Sometido (Plank)", desc: "Activación isométrica profunda del cinturón abdominal.", ratio: 2.5 },
          { id: "d1_e6_eq2", name: "Pallof Press Anti-Rotación en Polea", desc: "Fortalecimiento lateral del core sin flexión lumbar peligrosa.", ratio: 1.0 }
        ]
      },
      {
        id: "d1_e7",
        name: "Cardio Aeróbico en Zona 2 (Sin Impacto Abdominal)",
        muscleGroup: "Cardiovascular & Metabolismo",
        isCardio: true,
        sets: 1,
        reps: "30 min",
        restTime: "-",
        defaultUnit: "min",
        biomechanics: "Caminadora con inclinación (velocidad 4-5 km/h, inclinación 10-12%) o Elíptica. NO USAR STAIRMASTER (Escaleras). Intensidad moderada donde puedas mantener una conversación sin fatiga respiratoria.",
        warmup: "🔥 Inicia los primeros 3 minutos a velocidad 3 km/h antes de subir la inclinación al 10%.",
        searchQuery: "treadmill walking 12 incline 3 speed posture",
        equivalents: [
          { id: "d1_e7_eq1", name: "Bicicleta Estática Ergométrica (Zona 2)", desc: "Cero impacto articular en rodillas y espalda baja.", ratio: 1.0 },
          { id: "d1_e7_eq2", name: "Elíptica de Bajo Impacto (Elliptical Trainer)", desc: "Movimiento fluido sincronizado de brazos y piernas.", ratio: 1.0 }
        ]
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
        muscleGroup: "Cuádriceps & Glúteo Mayor",
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia solo con la plataforma sin discos o con 1 disco de 25 lbs por lado para calibrar. REGLA ANTI-HERNIA (IAP): Exhala con potencia al subir desde el fondo. Espalda y lumbares pegados firmemente al respaldo.",
        warmup: "🔥 2 series de aproximación: 1 x 12 reps sólo con el trineo (0 lbs extra) y 1 x 8 reps al 60% para activar rodillas y cuádriceps.",
        searchQuery: "hack squat machine depth breath technique",
        equivalents: [
          { id: "d2_e1_eq1", name: "Prensa de Piernas a 90° (Leg Press)", desc: "Excelente para cuádriceps con menor presión en rodilla si hay molestia.", ratio: 1.8 },
          { id: "d2_e1_eq2", name: "Sentadilla Búlgara en Smith o Mancuernas", desc: "Aislamiento unilateral profundo que corrige desequilibrios entre piernas.", ratio: 0.35 }
        ]
      },
      {
        id: "d2_e2",
        name: "Leg Press (Prensa de Piernas)",
        muscleGroup: "Cuádriceps & Cadena Posterior",
        sets: 3,
        reps: "10-12",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Baja SOLO hasta el ángulo de 90 grados en rodillas. NUNCA pegues las rodillas a tu pecho ni permitas que tu cadera o lumbares se separen del respaldo (riesgo abdominal/lumbar). Exhala al empujar.",
        warmup: "🔥 1 serie de 12 reps controladas para fijar el ángulo de 90° sin flexionar lumbares.",
        searchQuery: "leg press 90 degrees posture core safety",
        equivalents: [
          { id: "d2_e2_eq1", name: "Sentadilla en Máquina Hack o Pendulum Squat", desc: "Enfocado 100% en vasto externo del cuádriceps.", ratio: 0.6 },
          { id: "d2_e2_eq2", name: "Zancadas / Desplantes Caminando con Mancuernas", desc: "Activación dinámica funcional de piernas y glúteo.", ratio: 0.25 }
        ]
      },
      {
        id: "d2_e3",
        name: "Leg Extension (Extensión de Cuádriceps)",
        muscleGroup: "Cuádriceps (Vasto Interno & Externo)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con 90 - 110 lbs. Contracción isométrica estricta de 1 segundo en el tope superior. Bajada controlada en 2 segundos.",
        warmup: "🔥 1 serie ligera de 15 reps con 60 lbs sintiendo el bombeo sanguíneo en el cuádriceps.",
        searchQuery: "leg extension machine quad contraction",
        equivalents: [
          { id: "d2_e3_eq1", name: "Sentadilla Sissy o Sissy Squat en Máquina", desc: "Tensión extrema al tendón rotuliano y recto femoral sin carga espinal.", ratio: 0.4 },
          { id: "d2_e3_eq2", name: "Extensión Unilateral con Polea o Máquina", desc: "Trabajo concentrado a una pierna para simetría muscular.", ratio: 0.5 }
        ]
      },
      {
        id: "d2_e4",
        name: "Patada de Glúteo en Polea o Máquina (Glute Kickbacks)",
        muscleGroup: "Glúteos (Mayor & Medio)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "3 series de 12-15 reps por cada pierna. Extensión pura de cadera para activar glúteo mayor y medio sin arquear el área lumbar ni rotar la pelvis.",
        warmup: "🔥 Serie de activación de 10 reps sin peso o en polea mínima para despertar el glúteo.",
        searchQuery: "cable glute kickback standing posture",
        equivalents: [
          { id: "d2_e4_eq1", name: "Hip Thrust en Máquina o con Barra (Puente de Glúteo)", desc: "El rey de los ejercicios para máximo empuje e hipertrofia glútea.", ratio: 2.5 },
          { id: "d2_e4_eq2", name: "Abductor Machine (Apertura en Máquina)", desc: "Trabaja directamente el glúteo medio y estabilizadores de cadera.", ratio: 1.5 }
        ]
      },
      {
        id: "d2_e5",
        name: "Plancha Abdominal Isométrica (Plank)",
        muscleGroup: "Core (Estabilización Anterior)",
        sets: 3,
        reps: "45 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "Aguanta 45 segundos por serie manteniendo el ombligo fuertemente metido hacia tu espalda todo el tiempo. Respiración superficial controlada sin aumentar la presión intraabdominal.",
        warmup: "🔥 Activación postural previa de 15 segundos enfocándose en retroversión pélvica.",
        searchQuery: "forearm plank strict anterior trunk stabilization",
        equivalents: [
          { id: "d2_e5_eq1", name: "Vacuum Abdominal en De pie o Cuatro Puntos", desc: "Control del transverso sin tensión en hombros.", ratio: 0.6 },
          { id: "d2_e5_eq2", name: "Dead Bug con Tensión Constante", desc: "Coordinación core-extremidades manteniendo lumbares planas.", ratio: 1.0 }
        ]
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
        muscleGroup: "Espalda (Dorsal Ancho & Amplitud)",
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Saca el pecho hacia arriba y tracciona la barra directamente a la clavícula (NUNCA jalar detrás del cuello/nuca). Inicia el movimiento deponiendo y retrallendo las escápulas antes de doblar los codos.",
        warmup: "🔥 2 series ligeras: 1 x 15 reps de tracción suave y depresión escapular. 1 x 8 reps con 70% carga.",
        searchQuery: "wide grip lat pulldown sternum focus",
        equivalents: [
          { id: "d3_e1_eq1", name: "Jalón Agarre Neutro o Triángulo (Close Neutral Grip)", desc: "Permite un estiramiento dorsal más profundo con menor estrés en hombro.", ratio: 1.05 },
          { id: "d3_e1_eq2", name: "Dominadas en Máquina Asistida (Assisted Pull-up)", desc: "Movimiento corporal natural guidado al fallo.", ratio: 1.0 }
        ]
      },
      {
        id: "d3_e2",
        name: "Remo Compuesto en Máquina (Compound Row)",
        muscleGroup: "Espalda (Densidad Dorsal & Trapecio Medio)",
        sets: 3,
        reps: "10-12",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con tus 110 lbs de referencia. Apoya el tórax firmemente contra el cojín frontal de la máquina para neutralizar la carga lumbar y abdominal. Exhala al llevar los codos atrás.",
        warmup: "🔥 1 serie ligera con 70 lbs x 12 reps enfocándote en apretar escápulas atrás.",
        searchQuery: "seated compound row machine chest pad supported",
        equivalents: [
          { id: "d3_e2_eq1", name: "Remo en Polea Baja Sentado (Seated Cable Row)", desc: "Excelente contracción en la espalda media manteniendo torso firme.", ratio: 0.95 },
          { id: "d3_e2_eq2", name: "Remo con Mancuernas Apoyado en Banco Inclinado (Seal Row)", desc: "Aislamiento de espalda pura con cero compresión lumbar ni hernia.", ratio: 0.5 }
        ]
      },
      {
        id: "d3_e3",
        name: "Pull-Over en Polea Alta (con Cuerda - Straight Arm)",
        muscleGroup: "Espalda (Aislamiento Dorsal V-Taper)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Brazos casi rectos con ligera flexión fija en los codos. Jala la cuerda en un arco amplio desde la cabeza hacia la cadera. Excelente activación del dorsal ancho para potenciar el aspecto de V.",
        warmup: "🔥 1 serie ligera para sentir cómo se estiran los dorsales sin involucrar el tríceps.",
        searchQuery: "cable straight arm pulldown lat extension",
        equivalents: [
          { id: "d3_e3_eq1", name: "Pull-Over con Mancuerna en Banco Plano (Dumbbell Pullover)", desc: "Clásico para expansión torácica y estiramiento del dorsal y serrato.", ratio: 0.8 },
          { id: "d3_e3_eq2", name: "Jalón Unilateral en Polea Alta con Maneral (Single Arm Lat Pull)", desc: "Rango de recorrido máximo para acortar cada dorsal independientemente.", ratio: 0.5 }
        ]
      },
      {
        id: "d3_e4",
        name: "Face Pulls en Polea Alta (con Cuerda)",
        muscleGroup: "Hombro (Deltoides Posterior & Rotadores)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Jala la cuerda hacia la altura de tus ojos y frente, manteniendo los codos altos e imprimiendo rotación externa al final del empuje para deltoides posterior y rotadores.",
        warmup: "🔥 Serie de 15 reps con peso ultra ligero para calentar el manguito rotador y deltoides posterior.",
        searchQuery: "cable face pull external shoulder rotation",
        equivalents: [
          { id: "d3_e4_eq1", name: "Pec Deck Inverso / Pájaros en Máquina (Reverse Pec Deck)", desc: "Aislamiento perfecto de deltoides posterior sin desestabilizarse en polea.", ratio: 1.3 },
          { id: "d3_e4_eq2", name: "Pájaros con Mancuernas en Banco Inclinado (Rear Delt Flys)", desc: "Trabajo concentrado apoyando el tórax sin arquear lumbares.", ratio: 0.4 }
        ]
      },
      {
        id: "d3_e5",
        name: "Curl de Bíceps con Mancuernas (Alternado con Supinación)",
        muscleGroup: "Bíceps (Flexor del Codo & Supinador)",
        sets: 4,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con mancuernas de 25-30 lbs. Rota la muñeca hacia afuera al subir (supinación) para máxima contracción del bíceps braquial. Sin impulso del torso.",
        warmup: "🔥 1 serie de 12 reps con mancuernas de 15 lbs sintiendo el giro del antebrazo (supinación).",
        searchQuery: "alternating dumbbell supinator bicep curl",
        equivalents: [
          { id: "d3_e5_eq1", name: "Curl de Bíceps en Polea Baja con Barra o Cuerda", desc: "Tensión mecánica constante en todo el ángulo de flexión.", ratio: 1.3 },
          { id: "d3_e5_eq2", name: "Curl Martillo con Mancuernas (Hammer Curl)", desc: "Aumenta densidad del braquial anterior y braquiorradial (grosor de brazo).", ratio: 1.1 }
        ]
      },
      {
        id: "d3_e6",
        name: "Vacuum Abdominal (Control Transverso del Abdomen)",
        muscleGroup: "Core (Transverso & Prevención IAP)",
        sets: 4,
        reps: "15 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "4 series aguantando 15 segundos con exhalación completa, pegando el ombligo hacia tu espalda o columna vertebral.",
        warmup: "🔥 2 exhalaciones lentas liberando toda la tensión diafragmática.",
        searchQuery: "abdominal vacuum breathing drill",
        equivalents: [
          { id: "d3_e6_eq1", name: "Plancha Abdominal Isométrica", desc: "Resistencia isométrica del cinturón lumbopélvico.", ratio: 2.5 },
          { id: "d3_e6_eq2", name: "Pallof Press en Polea Baja / Media", desc: "Estabilidad lateral firme sin compresión del core.", ratio: 1.0 }
        ]
      },
      {
        id: "d3_e7",
        name: "Cardio Aeróbico en Zona 2",
        muscleGroup: "Cardiovascular & Metabolismo",
        isCardio: true,
        sets: 1,
        reps: "30 min",
        restTime: "-",
        defaultUnit: "min",
        biomechanics: "30 minutos en Bicicleta Estática o Caminadora con inclinación. Respiración controlada naso-bucal, sin ahogo del habla para proteger pared abdominal.",
        warmup: "🔥 Pedalea suave a 50 RPM durante los primeros 3 minutos antes de entrar a Zona 2.",
        searchQuery: "stationary ergometer cycling posture",
        equivalents: [
          { id: "d3_e7_eq1", name: "Caminadora Inclinada (Treadmill Walking 10-12%)", desc: "Quema de grasa suave preservando musculatura inferior.", ratio: 1.0 },
          { id: "d3_e7_eq2", name: "Elíptica Ergométrica", desc: "Cero fricción ni impacto vertebral.", ratio: 1.0 }
        ]
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
        muscleGroup: "Cardiovascular (Recuperación Activa)",
        isCardio: true,
        sets: 1,
        reps: "40 min",
        restTime: "-",
        defaultUnit: "min",
        biomechanics: "Opcional si decides asistir al gimnasio: 40 minutos de Caminadora Inclinada o Bicicleta Estática (puedes escuchar un podcast o revisar tu móvil). CERO PESAS ni esfuerzos mecánicos. Estiramientos suaves.",
        warmup: "🔥 Caminata relajada inicial para desentumecer articulaciones del tren inferior.",
        searchQuery: "zone 2 low intensity cardiovascular health",
        equivalents: [
          { id: "d4_e1_eq1", name: "Caminata al Aire Libre a Ritmo Moderado", desc: "Oxigena la mente y relaja el sistema nervioso en el exterior.", ratio: 1.0 },
          { id: "d4_e1_eq2", name: "Bicicleta Estática de Baja Resistencia", desc: "Movilidad fluida y lavado de ácido lácteo muscular.", ratio: 1.0 }
        ]
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
        muscleGroup: "Glúteo Mayor & Femorales",
        sets: 3,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "3 series x 8-10 reps por pierna. Inicia con mancuernas ligeras de 15 o 20 lbs por mano. Paso largo hacia atrás y ligera inclinación del torso al frente para enfocar la carga en la cadena posterior y el glúteo mayor. Exhala al subir.",
        warmup: "🔥 1 serie por pierna sin peso corporal x 12 reps para activar la estabilidad del glúteo y tobillo.",
        searchQuery: "bulgarian split squat glute dominant stance",
        equivalents: [
          { id: "d5_e1_eq1", name: "Zancadas / Desplantes Hacia Atrás en Máquina Smith", desc: "Eliminación del problema de equilibrio concentrando fuerza al 100% en el glúteo.", ratio: 2.2 },
          { id: "d5_e1_eq2", name: "Prensa de Piernas con Pies Altos y Anchos (High Stance Leg Press)", desc: "Enfocado en glúteos y femorales empujando con los talones.", ratio: 3.5 }
        ]
      },
      {
        id: "d5_e2",
        name: "Seated Leg Curl (Flexión de Femorales Sentado)",
        muscleGroup: "Isquiotibiales (Femorales)",
        sets: 4,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 70 lbs. Ajusta el rodillo superior contra tus muslos y apoya firmemente la espalda en el respaldo para estirar los isquiotibiales en el retorno excéntrico.",
        warmup: "🔥 1 serie ligera con 50 lbs x 15 reps bombeando sangre al tendón del bíceps femoral.",
        searchQuery: "seated leg curl machine hamstring tension",
        equivalents: [
          { id: "d5_e2_eq1", name: "Lying Leg Curl (Flexión de Femorales Acostado en Máquina)", desc: "Variedad de ángulo biomecánico para hipertrofia femoral.", ratio: 0.95 },
          { id: "d5_e2_eq2", name: "Peso Muerto Rumano con Mancuernas o Trap Bar (RDL)", desc: "Estiramiento máximo de isquiotibiales y glúteos preservando neutralidad lumbar.", ratio: 1.5 }
        ]
      },
      {
        id: "d5_e3",
        name: "Hip Abductor Machine (Máquina de Abductor - Abrir Cadera)",
        muscleGroup: "Glúteo Medio & Abductores",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 125 lbs. Apertura controlada de cadera con pausa de 1 segundo en el tope de contracción para abductores y glúteo medio.",
        warmup: "🔥 1 serie rápida de 15 reps con 80 lbs para lubricación de la cadera.",
        searchQuery: "hip abductor machine outer thigh form",
        equivalents: [
          { id: "d5_e3_eq1", name: "Aperturas Laterales con Banda de Resistencia de Pie", desc: "Activación glútea constante en bipedestación.", ratio: 0.3 },
          { id: "d5_e3_eq2", name: "Patada Lateral en Polea Baja (Cable Abduction)", desc: "Tensión uniforme al deltoides glúteo (glúteo medio).", ratio: 0.35 }
        ]
      },
      {
        id: "d5_e4",
        name: "Hip Adductor Machine (Máquina de Adductor - Cerrar Cadera)",
        muscleGroup: "Muslo Interno (Adductores)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 80 a 95 lbs. Cierre concentrado y controlado para fortalecer muslo interno (adductores) y dar estabilidad a la rodilla.",
        warmup: "🔥 1 serie de 12 reps ligeras evitando tirones agresivos en la ingle.",
        searchQuery: "hip adductor inner thigh exercise machine",
        equivalents: [
          { id: "d5_e4_eq1", name: "Sentadilla Sumo en Polea o Mancterna (Sumo Squat)", desc: "Apertura amplia que recluta aductores e interior del muslo.", ratio: 0.7 },
          { id: "d5_e4_eq2", name: "Aducción con Polea Baja de Pie", desc: "Tensión enfocada en aductor mayor y gracilis.", ratio: 0.4 }
        ]
      },
      {
        id: "d5_e5",
        name: "Rotary Calf Machine (Elevación de Pantorrillas en Máquina)",
        muscleGroup: "Pantorrillas (Tríceps Sural)",
        sets: 4,
        reps: "15-20",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con 170 lbs. REGLA ESTRICTA DE EJECUCIÓN: Pausa obligada de 1 segundo arriba en máxima contracción y 1 segundo abajo en máximo estiramiento. Cero rebotes ni impulsos del tobillo.",
        warmup: "🔥 1 serie rápida de 20 reps con peso medio para lubricar el tendón de Aquiles.",
        searchQuery: "rotary calf machine slow strict tempo",
        equivalents: [
          { id: "d5_e5_eq1", name: "Elevación de Pantorrilla en Prensa de Piernas (Leg Press Calf Raise)", desc: "Permite usar grandes cargas empujando desde el rodaje con seguridad total.", ratio: 1.4 },
          { id: "d5_e5_eq2", name: "Elevación de Pantorrilla Sentado en Máquina (Seated Calf Raise)", desc: "Aísla el músculo sóleo en profundidad.", ratio: 0.7 }
        ]
      },
      {
        id: "d5_e6",
        name: "Pallof Press en Polea (Estabilidad Core Anti-Rotación)",
        muscleGroup: "Core (Anti-Rotación y Oblicuos)",
        sets: 3,
        reps: "12",
        restTime: "60 s",
        defaultUnit: "reps",
        biomechanics: "3 series de 12 reps por cada lado. Empuja el maneral directo en frente de tu esternón y resiste la fuerza giratoria del cable por 2 segundos en cada repetición. Abdomen lateral seguro sin compresión.",
        warmup: "🔥 1 serie por lado con resistencia suave sentándose firme en la planta de los pies.",
        searchQuery: "standing cable pallof press core antirotation",
        equivalents: [
          { id: "d5_e6_eq1", name: "Plancha Abdominal Lateral (Side Plank)", desc: "Estabilidad oblicua isométrica en el suelo sin cargar vértebras.", ratio: 2.0 },
          { id: "d5_e6_eq2", name: "Vacuum Abdominal (Control Transverso)", desc: "Fortalecimiento del cinturón protector intraabdominal.", ratio: 1.2 }
        ]
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
        muscleGroup: "Pecho (Pectoral Medio & General)",
        sets: 3,
        reps: "10-12",
        restTime: "120 s",
        defaultUnit: "lbs",
        biomechanics: "Inicia con referencia de 80 lbs. Asiento ajustado al nivel del pectoral medio. Empuje fluido manteniendo el tórax en alto y exhalando sin bloquear agresivamente los codos al frente.",
        warmup: "🔥 1 serie ligera con 50 lbs x 12 reps para alinear asiento con el centro de tu pecho.",
        searchQuery: "vertical chest press machine posture",
        equivalents: [
          { id: "d6_e1_eq1", name: "Press Inclinado o Plano con Mancuernas", desc: "Estimulación de fibras pectorales completas en rango libre.", ratio: 0.7 },
          { id: "d6_e1_eq2", name: "Pec Deck / Cristos en Máquina", desc: "Tensión de aislamiento al 100% en el tórax.", ratio: 0.9 }
        ]
      },
      {
        id: "d6_e2",
        name: "Jalón al Pecho Agarre Neutro (Neutral Grip Pulldown)",
        muscleGroup: "Espalda (Dorsi / V-Taper Inferior)",
        sets: 3,
        reps: "10-12",
        restTime: "120 s",
        defaultUnit: "lbs",
        biomechanics: "Palmas mirándose entre sí (usando maneral V-grip o triángulo). Tracción de la barra o maneral al esternón llevando los codos en línea paralela a las costillas para densidad del dorsal inferior y medio.",
        warmup: "🔥 1 serie x 12 reps de tracción con 60% para activar el dorsal inferior.",
        searchQuery: "close neutral grip cable lat pulldown",
        equivalents: [
          { id: "d6_e2_eq1", name: "Remo Compuesto en Máquina o Polea Baja", desc: "Enfocado en densidad y trapecio medio.", ratio: 1.0 },
          { id: "d6_e2_eq2", name: "Jalón al Pecho con Agarre Ancho (Wide Grip)", desc: "Énfasis en amplitud bi-dorsal superior.", ratio: 0.95 }
        ]
      },
      {
        id: "d6_e3",
        name: "Elevaciones Laterales en Polea Baja (Cable Lateral Raise - Un brazo)",
        muscleGroup: "Hombro (Deltoides Medio)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "4 series de 12-15 reps por brazo. El cable proporciona tensión continua desde el estiramiento inicial, a diferencia de las mancuernas. Elevación fluida sin encoger el músculo trapecio.",
        warmup: "🔥 1 serie por brazo de 15 reps ligeras sentiendo cómo la polea estira el deltoides al inicio.",
        searchQuery: "single arm cable lateral raise proper tension",
        equivalents: [
          { id: "d6_e3_eq1", name: "Elevaciones Laterales con Mancuernas", desc: "Movimiento simétrico bilateral clásico.", ratio: 1.25 },
          { id: "d6_e3_eq2", name: "Elevaciones Laterales en Máquina", desc: "Tensión mecánica guiada sin fatigar el agarre.", ratio: 1.6 }
        ]
      },
      {
        id: "d6_e4",
        name: "Curl de Bíceps en Polea Baja (con Barra Recta)",
        muscleGroup: "Bíceps (Flexores del Codo)",
        sets: 3,
        reps: "12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Tensión mecánica uniforme en todo el recorrido. Codos pegados a los flancos, máxima contracción de 1 segundo arriba.",
        warmup: "🔥 1 serie x 12 reps con peso suave para calentar tendones flexores de muñeca y codo.",
        searchQuery: "low pulley standing straight bar bicep curl",
        equivalents: [
          { id: "d6_e4_eq1", name: "Curl de Bíceps Alternado con Mancuernas", desc: "Permite supinación individual por brazo.", ratio: 0.8 },
          { id: "d6_e4_eq2", name: "Curl en Banco Scott / Predicador con Máquina o Barra Z", desc: "Bloquea por completo el hombro para aislar bíceps y braquial.", ratio: 0.9 }
        ]
      },
      {
        id: "d6_e5",
        name: "Extensión de Tríceps Copa Sobre la Cabeza (Overhead Extension)",
        muscleGroup: "Tríceps (Cabeza Larga)",
        sets: 3,
        reps: "12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Ejecución en polea o con mancuerna sobre la cabeza para elongar la cabeza larga del tríceps al máximo. Codos estables apuntando adelante o ligeramente en V.",
        warmup: "🔥 1 serie con cuerda en polea o mancuerna ligera para calentar el codo en posición elevada.",
        searchQuery: "cable overhead rope tricep extension",
        equivalents: [
          { id: "d6_e5_eq1", name: "Extensión de Tríceps en Polea Alta con Cuerda o Barra", desc: "Empuje vertical con máxima estabilidad torsional.", ratio: 1.2 },
          { id: "d6_e5_eq2", name: "Fondos en Máquina o en Paralelas Asistidas (Tricep Dips)", desc: "Movimiento compuesto que activa la totalidad del tríceps braquial.", ratio: 1.8 }
        ]
      },
      {
        id: "d6_e6",
        name: "Cardio Aeróbico en Zona 2",
        muscleGroup: "Cardiovascular & Metabolismo",
        isCardio: true,
        sets: 1,
        reps: "40 min",
        restTime: "-",
        defaultUnit: "min",
        biomechanics: "40 minutos en el equipo de tu preferencia en Zona 2 (Caminadora inclinada, Bicicleta o Elíptica). Oxigenación fluida y relajada.",
        warmup: "🔥 3 minutos iniciales de caminata lenta para entrar progresivamente en calor.",
        searchQuery: "cardiovascular exercise zone 2 conversation test",
        equivalents: [
          { id: "d6_e6_eq1", name: "Bicicleta Ergométrica Horizontal o Vertical", desc: "Pedaleo suave preservando articulaciones y abdomen.", ratio: 1.0 },
          { id: "d6_e6_eq2", name: "Elíptica de Bajo Impacto", desc: "Movilidad aeróbica sincronizada de cuerpo entero.", ratio: 1.0 }
        ]
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
