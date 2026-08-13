// PROTOCOLO ADONIS - RUTINA DEFINITIVA Y UNIFICADA
// Actualizada con Familias de Carga, Equivalencias Directas, Motor de Matching y Biomecánica con IAP (Intra-Abdominal Pressure)

export const LOAD_FAMILIES = {
  INCLINE_PRESS: "Familia Press Superior Inclinado",
  OVERHEAD_PRESS: "Familia Press Vertical Hombros",
  VERTICAL_PULL: "Familia Jalón Vertical Dorsal",
  HORIZONTAL_ROW: "Familia Remo Horizontal",
  QUAD_DOMINANT: "Familia Dominante Cuádriceps",
  HAMSTRING_GLUTE: "Familia Flexión de Cadera / Femorales"
};

export const scientificProtocol = [
  // =========================================================================
  // 📌 LUNES: EMPUJE 1 (PECHO SUPERIOR, HOMBRO Y TRÍCEPS)
  // =========================================================================
  {
    id: "d1",
    dayNumber: 1,
    name: "Lunes: Empuje 1 (Pecho Superior, Hombro y Tríceps)",
    type: "workout",
    focus: "Prioridad neurológica en haz clavicular y deltoides lateral para maximizar el V-Taper y el Índice de Adonis. Pausas y parciales elongadas al fallar.",
    exercises: [
      {
        id: "d1_e1",
        name: "Press Inclinado con Mancuernas (Banco a 30°)",
        muscleGroup: "Pecho (Pectoral Superior Clavicular)",
        loadFamily: LOAD_FAMILIES.INCLINE_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Banco ajustado a 30° exactos para alinear las fibras del haz clavicular con la dirección de empuje. IAP / Valsalva: Inhala profundo expandiendo el diafragma en 360° antes de bajar; mantén el aire y la caja torácica erguida en la excéntrica (3 segundos) para proteger hombros y maximizar tensión. Exhala pasando el punto de estancamiento en la subida.",
        warmup: "🔥 Calentamiento de aproximación: 1 serie al 50% de tu peso efectivo x 15 reps fluidas para lubricar la articulación glenohumeral.",
        searchQuery: "dumbbell incline chest press 30 degree bench proper form",
        equivalents: [
          { id: "d1_e1_eq1", name: "Press Inclinado con Barra", desc: "Sobrecarga axial máxima.", ratio: 1.15 },
          { id: "d1_e1_eq2", name: "Smith Inclinada", desc: "Estabilidad guiada para ir al fallo con seguridad.", ratio: 1.1 },
          { id: "d1_e1_eq3", name: "Nitro Incline Press Machine", desc: "Tensión constante en recorrido convergente.", ratio: 2.2 }
        ]
      },
      {
        id: "d1_e2",
        name: "Press Inclinado en Máquina (Nitro Incline)",
        muscleGroup: "Pecho (Pectoral Superior & Medio)",
        loadFamily: LOAD_FAMILIES.INCLINE_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Asiento calibrado para que los manerales comiencen a la altura de la clavícula. IAP: Presiona la espalda alta y glúteos contra el respaldo, llena el abdomen de aire para blindar el torso y empuja en trayectoria convergente sin despegar los hombros. Al llegar al fallo concéntrico, ejecuta 2-3 repeticiones parciales en el fondo estirado.",
        warmup: "🔥 1 serie ligera de 10 reps para calibrar el recorrido mecánico y la altura del asiento.",
        searchQuery: "nitro incline chest press machine setup",
        equivalents: [
          { id: "d1_e2_eq1", name: "Incline Chest Press Convergente", desc: "Alineación articular óptima.", ratio: 1.0 },
          { id: "d1_e2_eq2", name: "Hammer Strength Incline", desc: "Carga unilateral en placas de peso.", ratio: 1.0 },
          { id: "d1_e2_eq3", name: "Press Inclinado con Mancuernas", desc: "Variante con peso libre.", ratio: 0.45 }
        ]
      },
      {
        id: "d1_e3",
        name: "Press Militar en Máquina (Dual Axis)",
        muscleGroup: "Hombro (Deltoides Anterior y Medio)",
        loadFamily: LOAD_FAMILIES.OVERHEAD_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "120 s",
        defaultUnit: "lbs",
        biomechanics: "Ajusta el asiento para que los mangos queden a la altura de la mandíbula. Codos a 30° adelantados en el plano escapular (no abiertos a 90°). IAP: Bloquea el abdomen contra el respaldo lumbar antes del empuje para evitar hiperextensión de la columna baja.",
        warmup: "🔥 1 serie con 30% de carga x 12 reps de calentamiento articular.",
        searchQuery: "dual axis overhead shoulder press machine",
        equivalents: [
          { id: "d1_e3_eq1", name: "Shoulder Press Smith", desc: "Estabilidad en guía vertical.", ratio: 0.9 },
          { id: "d1_e3_eq2", name: "Press Militar con Mancuernas Sentado", desc: "Trabajo estabilizador de deltoides.", ratio: 0.45 }
        ]
      },
      {
        id: "d1_e4",
        name: "Cristos en Máquina (Pec Deck)",
        muscleGroup: "Pecho (Aislamiento Pectoral)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Codos a la altura media del esternón con una ligera flexión constante de 15°. Retrae y deprime escápulas. Inhala en la apertura sintiendo el estiramiento miofascial máximo del pectoral; exhala al cerrar juntando los bíceps hacia el esternón. Al fallar concéntrico, sostén 5 segundos en estiramiento.",
        warmup: "🔥 1 serie de 12 reps livianas enfocada en estiramiento y bombeo.",
        searchQuery: "pec deck fly machine lengthened partials chest",
        equivalents: [
          { id: "d1_e4_eq1", name: "Aperturas en Polea", desc: "Tensión continua en todo el rango.", ratio: 0.8 },
          { id: "d1_e4_eq2", name: "Cristos con Mancuerna Inclinado", desc: "Gran tensión en máximo estiramiento.", ratio: 0.4 }
        ]
      },
      {
        id: "d1_e5",
        name: "Elevaciones Laterales en Máquina",
        muscleGroup: "Hombro (Deltoides Lateral)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "El eje de rotación de la máquina debe coincidir con la articulación del hombro. Almohadillas apoyadas justo arriba del codo para empujar directamente desde el húmero sin sobrecargar el trapecio superior. Mantén el cuello relajado y pausa de 1s en la parte alta.",
        warmup: "🔥 1 serie con almohadillas ligeras x 15 reps.",
        searchQuery: "machine lateral raise deltoid isolation",
        equivalents: [
          { id: "d1_e5_eq1", name: "Elevaciones Laterales con Mancuerna", desc: "Clásico con plano escapular a 30°.", ratio: 0.7 },
          { id: "d1_e5_eq2", name: "Elevaciones Laterales en Polea Baja", desc: "Tensión constante sin punto muerto abajo.", ratio: 0.6 }
        ]
      },
      {
        id: "d1_e6",
        name: "Extensión de Tríceps en Máquina",
        muscleGroup: "Tríceps (Cabeza Larga y Lateral)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Apoya los codos firmemente contra las almohadillas alineados con el pivote. Extiende los brazos sin despegar el torso. Controla la fase excéntrica en 2 segundos permitiendo que los antebrazos flexionen por completo para reclutar la cabeza larga.",
        warmup: "🔥 1 serie ligera x 12 reps controladas.",
        searchQuery: "triceps extension machine proper form",
        equivalents: [
          { id: "d1_e6_eq1", name: "Extensión Copa con Mancuerna a dos manos", desc: "Estiramiento profundo sobre la cabeza.", ratio: 0.5 },
          { id: "d1_e6_eq2", name: "French Press en Banco", desc: "Tensión media en haz largo.", ratio: 0.6 }
        ]
      },
      {
        id: "d1_e7",
        name: "Extensión de Tríceps en Polea (Pushdown)",
        muscleGroup: "Tríceps (Cabeza Lateral y Medial)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Codos pegados a los costados y tronco con inclinación anterior de 10-15°. IAP ligero para fijar la postura. Empuja hacia abajo bloqueando los codos durante 1 segundo completo. Controla la subida hasta formar un ángulo de 90° sin mover los brazos hacia adelante.",
        warmup: "🔥 1 serie con polea ligera x 15 reps.",
        searchQuery: "triceps cable pushdown technique",
        equivalents: [
          { id: "d1_e7_eq1", name: "Pushdown con Cuerda", desc: "Separación al final para mayor contracción.", ratio: 0.9 },
          { id: "d1_e7_eq2", name: "Pushdown con Barra Recta o V", desc: "Mayor capacidad de sobrecarga de peso.", ratio: 1.0 }
        ]
      },
      {
        id: "d1_e8",
        name: "Vacuum Abdominal (Transverso)",
        muscleGroup: "Core (Transverso & Cintura Estrecha)",
        sets: 4,
        reps: "15 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "De pie o inclinado con manos en las rodillas. Exhala el 100% del aire de los pulmones. Sin inhalar, expande la caja torácica y 'succiona' el ombligo hacia adentro y hacia arriba contra la columna vertebral. Sostén 15 segundos activando el corsé anatómico del transverso abdominal para afinar la cintura.",
        warmup: "🔥 2 respiraciones diafragmáticas profundas de preparación.",
        searchQuery: "stomach vacuum exercise waist tightening",
        equivalents: [
          { id: "d1_e8_eq1", name: "Plancha Abdominal Isométrica", desc: "Estabilidad y tensión global del core.", ratio: 1.0 }
        ]
      },
      {
        id: "d1_e9",
        name: "Cardio Aeróbico en Zona 2",
        muscleGroup: "Cardiovascular (Zona 2)",
        sets: 1,
        reps: "30 min",
        isCardio: true,
        restTime: "0 s",
        defaultUnit: "min",
        biomechanics: "Mantén una frecuencia cardíaca continua en Zona 2 (60-70% FCM / 120-135 BPM). Caminata con inclinación del 6-10% a 4.5-5.5 km/h. Optimiza la biogénesis mitocondrial y la oxidación de ácidos grasos sin degradar masa muscular ni interferir con la recuperación.",
        warmup: "🔥 3 minutos progresivos a ritmo suave.",
        searchQuery: "zone 2 cardio fat oxidation incline walk",
        equivalents: [
          { id: "d1_e9_eq1", name: "Caminadora en Inclinación", desc: "Bajo impacto articular y alto gasto calórico.", ratio: 1.0 },
          { id: "d1_e9_eq2", name: "Remo Indoor", desc: "Gasto metabólico con involucramiento de espalda.", ratio: 1.0 },
          { id: "d1_e9_eq3", name: "Elíptica", desc: "Cero impacto en rodillas.", ratio: 1.0 }
        ]
      }
    ]
  },

  // =========================================================================
  // 📌 MARTES: PIERNAS 1 (ENFOQUE CUÁDRICEPS Y GLÚTEO)
  // =========================================================================
  {
    id: "d2",
    dayNumber: 2,
    name: "Martes: Piernas 1 (Enfoque Cuádriceps y Glúteo)",
    type: "workout",
    focus: "Desarrollo masivo del tren inferior y cuádriceps mediante flexión profunda de rodilla con máxima estabilidad articular.",
    exercises: [
      {
        id: "d2_e1",
        name: "Sentadilla en Máquina Hack",
        muscleGroup: "Cuádriceps & Glúteo",
        loadFamily: LOAD_FAMILIES.QUAD_DOMINANT,
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Pies en el tercio medio-bajo de la plataforma al ancho de hombros. IAP Crítico: Inhala expandiendo el abdomen en 360° y bloquea la presión intra-abdominal antes de iniciar la bajada. Desciende en 3 segundos permitiendo que las rodillas viajen hacia adelante sobre las puntas de los pies con flexión profunda. Empuja desde el mediopié sin perder el IAP hasta terminar la concéntrica.",
        warmup: "🔥 2 series de aproximación progresivas: sin peso x 10 reps, luego 50% de carga efectiva x 6 reps.",
        searchQuery: "hack squat machine quad focus deep knee flexion",
        equivalents: [
          { id: "d2_e1_eq1", name: "V-Squat Machine", desc: "Excelente distribución de carga lumbar.", ratio: 1.0 },
          { id: "d2_e1_eq2", name: "Sentadilla Smith Profunda", desc: "Estabilidad guiada para empuje puro de cuádriceps.", ratio: 0.9 },
          { id: "d2_e1_eq3", name: "Prensa de Piernas (Posición Central)", desc: "Empuje masivo con respaldo completo.", ratio: 1.4 }
        ]
      },
      {
        id: "d2_e2",
        name: "Prensa de Piernas (Posición Central)",
        muscleGroup: "Cuádriceps & Tren Inferior",
        loadFamily: LOAD_FAMILIES.QUAD_DOMINANT,
        sets: 3,
        reps: "10-12",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Pies al ancho de caderas en el centro de la plataforma. Sujétate con fuerza de los manerales para 'jalar' tus glúteos contra el asiento. IAP: Llena el core de aire antes de liberar el trineo. Desciende hasta 90° de rodilla asegurando que el coxis nunca se despegue del respaldo (cero retroversión pélvica / butt wink).",
        warmup: "🔥 1 serie con 50% de peso x 10 reps controladas.",
        searchQuery: "leg press 45 degree proper feet placement quad focus",
        equivalents: [
          { id: "d2_e2_eq1", name: "Leg Press a 45°", desc: "Misma biomecánica de carga en trineo.", ratio: 1.0 },
          { id: "d2_e2_eq2", name: "Prensa Horizontal en CABLE", desc: "Tensión lineal continua.", ratio: 0.8 }
        ]
      },
      {
        id: "d2_e3",
        name: "Extensión de Cuádriceps (Leg Extension)",
        muscleGroup: "Cuádriceps (Aislamiento Recto Femoral)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Ajusta el respaldo para que el eje de rotación de la rodilla coincida exactamente con el pivote de la máquina. Agárrate fuerte de las asas laterales para fijar la pelvis. Extiende las piernas y aguanta 1 segundo arriba. Al fallar en extensión completa, ejecuta 3-4 parciales en el tercio inferior estirado.",
        warmup: "🔥 1 serie ligera x 15 reps de lubricación articular sin fatiga.",
        searchQuery: "leg extension machine lengthened partials quad hypertrophy",
        equivalents: [
          { id: "d2_e3_eq1", name: "Extensiones Unilaterales en Máquina", desc: "Corrección de desbalances entre piernas.", ratio: 0.45 }
        ]
      },
      {
        id: "d2_e4",
        name: "Prensa Unilateral a 1 Pierna (Pie Alto)",
        muscleGroup: "Glúteo Mayor & Isquios",
        sets: 3,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "Coloca 1 pie en la esquina superior de la plataforma. La otra pierna descansa fuera. Desciende en 3 segundos permitiendo que la rodilla se flexione hacia el hombro exterior para lograr máxima flexión de cadera y estiramiento del glúteo. Empuja con el talón.",
        warmup: "🔥 1 serie con peso liviano x 8 reps por pierna.",
        searchQuery: "single leg press foot high glute focus",
        equivalents: [
          { id: "d2_e4_eq1", name: "Sentadilla Búlgara en Smith", desc: "Estabilidad vertical y máxima sobrecarga de glúteo.", ratio: 0.6 },
          { id: "d2_e4_eq2", name: "Desplantes Atrás en Smith", desc: "Menor estrés sobre la rótula.", ratio: 0.6 }
        ]
      },
      {
        id: "d2_e5",
        name: "Aductores en Máquina (Hip Adduction)",
        muscleGroup: "Aductores (Muslo Interno & Estabilidad)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Abre amplio en la fase excéntrica hasta sentir estiramiento profundo en los aductores (2-3s). Junta las piernas con fuerza explosiva controlada y aprieta en el centro durante 1 segundo. Clave para estabilidad pélvica y densidad interna del muslo.",
        warmup: "🔥 1 serie ligera x 12 reps.",
        searchQuery: "hip adductor machine inner thigh growth",
        equivalents: [
          { id: "d2_e5_eq1", name: "Aductores en Polea Baja con Tobillera", desc: "Tensión libre y dinámica.", ratio: 0.5 }
        ]
      },
      {
        id: "d2_e6",
        name: "Abductores en Máquina (Hip Abduction)",
        muscleGroup: "Glúteo Medio & Superior",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Inclina el torso 20-30° hacia adelante despegando la espalda alta del respaldo; esto orienta las fibras del glúteo medio y minimiza el piriforme. Empuja hacia afuera con las rodillas y frena la vuelta en 2 segundos.",
        warmup: "🔥 1 serie ligera x 15 reps.",
        searchQuery: "hip abductor machine glute medius lean forward",
        equivalents: [
          { id: "d2_e6_eq1", name: "Abductores en Polea con Tobillera", desc: "Aislamiento libre con cable.", ratio: 0.5 },
          { id: "d2_e6_eq2", name: "Patada Lateral en Polea", desc: "Pico de contracción en glúteo superior.", ratio: 0.5 }
        ]
      },
      {
        id: "d2_e7",
        name: "Elevación de Pantorrillas (Rotary Calf)",
        muscleGroup: "Pantorrillas (Gastrocnemio & Sóleo)",
        sets: 4,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Puntas de los pies en el borde de la plataforma. Desciende al máximo estiramiento inferior y mantén una pausa estricta de 2 segundos para anular el reflejo miotático del tendón de Aquiles. Empuja verticalmente hasta la contracción máxima.",
        warmup: "🔥 1 serie ligera x 15 reps.",
        searchQuery: "rotary calf machine stretch pause calf growth",
        equivalents: [
          { id: "d2_e7_eq1", name: "Gemelos de Pie en Máquina", desc: "Máxima carga sobre gastrocnemio.", ratio: 1.0 },
          { id: "d2_e7_eq2", name: "Gemelos en Prensa de Piernas", desc: "Comodidad de apoyo lumbar.", ratio: 1.2 }
        ]
      },
      {
        id: "d2_e8",
        name: "Plancha Abdominal Isométrica (Plank)",
        muscleGroup: "Core (Anti-Extensión & IAP)",
        sets: 3,
        reps: "45 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "Apoya antebrazos y puntas de los pies en el suelo. Cierra las costillas hacia la pelvis, contrae glúteos y aplica IAP como si fueras a recibir un impacto en el estómago. La pelvis debe estar en retroversión neutra, nunca arqueada hacia abajo.",
        warmup: "🔥 1 serie de 20 segundos de activación.",
        searchQuery: "hardstyle plank isometric core bracing",
        equivalents: [
          { id: "d2_e8_eq1", name: "Rueda Abdominal (Ab Wheel)", desc: "Anti-extensión dinámica avanzada.", ratio: 1.0 },
          { id: "d2_e8_eq2", name: "Deadbug con Presión Isométrica", desc: "Cero impacto en espalda baja.", ratio: 1.0 }
        ]
      }
    ]
  },

  // =========================================================================
  // 📌 MIÉRCOLES: JALÓN 1 (ESPALDA, HOMBRO POSTERIOR Y BÍCEPS)
  // =========================================================================
  {
    id: "d3",
    dayNumber: 3,
    name: "Miércoles: Jalón 1 (Espalda, Hombro Posterior y Bíceps)",
    type: "workout",
    focus: "Construcción de amplitud dorsal V-Taper y densidad con jalones verticales y remos apoyados al pecho.",
    exercises: [
      {
        id: "d3_e1",
        name: "Jalón al Pecho (Agarre Ancho Pronado)",
        muscleGroup: "Espalda (Amplitud Dorsal V-Taper)",
        loadFamily: LOAD_FAMILIES.VERTICAL_PULL,
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Agarre 1.5 veces el ancho de hombros. Pecho proyectado hacia arriba y ligera inclinación posterior (10-15°). IAP: Inhala profundo para fijar el tórax. Inicia deprimiendo las escápulas y tracciona llevando los codos hacia tus bolsillos traseros, no hacia atrás. Toca la clavícula y sube controlando 3 segundos.",
        warmup: "🔥 2 series de aproximación al 40% y 60% de peso x 10 y 6 reps.",
        searchQuery: "lat pulldown wide grip lats focus elbow drive",
        equivalents: [
          { id: "d3_e1_eq1", name: "Dominadas con Peso (Weighted Pull-ups)", desc: "Fuerza calisténica compuesta.", ratio: 0.9 },
          { id: "d3_e1_eq2", name: "Lat Pulldown con Barra V", desc: "Agarre neutro cerrado con gran recorrido.", ratio: 1.0 }
        ]
      },
      {
        id: "d3_e2",
        name: "Remo Compuesto en Máquina (Apoyo al Pecho)",
        muscleGroup: "Espalda (Densidad Dorsal & Romboides)",
        loadFamily: LOAD_FAMILIES.HORIZONTAL_ROW,
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Esterno apoyado firmemente contra la almohadilla para neutralizar la carga axial sobre la columna lumbar. Tracciona manteniendo los codos a 45° del torso. Aprieta la musculatura periescapular 1 segundo en máxima contracción y permite que las escápulas se protraigan al estirar.",
        warmup: "🔥 1 serie ligera x 10 reps de calibración.",
        searchQuery: "chest supported row machine mid back density",
        equivalents: [
          { id: "d3_e2_eq1", name: "Remo con Barra T con Apoyo", desc: "Carga pesada con total seguridad lumbar.", ratio: 1.0 },
          { id: "d3_e2_eq2", name: "Remo con Mancuerna en Banco", desc: "Recorrido libre e independiente.", ratio: 0.5 }
        ]
      },
      {
        id: "d3_e3",
        name: "Pull-Over en Polea Alta con Cuerda",
        muscleGroup: "Espalda (Aislamiento Dorsal Ancho)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Tronco inclinado a 45°, codos semirrígidos con una ligera flexión de 15° fija. Inicia jalando la cuerda hacia los muslos exclusivamente mediante aducción y extensión humeral del dorsal ancho. En el fondo, abre la cuerda hacia los lados del cuerpo y contrae 1 segundo.",
        warmup: "🔥 1 serie ligera x 12 reps.",
        searchQuery: "cable straight arm pullover lat isolation rope",
        equivalents: [
          { id: "d3_e3_eq1", name: "Pull-Over en Máquina", desc: "Tensión constante en recorrido guiado.", ratio: 1.1 },
          { id: "d3_e3_eq2", name: "Pull-Over con Mancuerna en Banco", desc: "Estiramiento torácico profundo.", ratio: 0.5 }
        ]
      },
      {
        id: "d3_e4",
        name: "Face Pulls en Polea Alta",
        muscleGroup: "Hombro Posterior & Manguito Rotador",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Polea fijada a la altura de los ojos. Agarre neutro con los pulgares apuntando hacia atrás. Jala hacia la frente separando las manos y rotando externamente los hombros (codos altos y atrás). Vital para contrarrestar la rotación interna del trabajo de empuje y blindar los hombros.",
        warmup: "🔥 1 serie liviana x 15 reps.",
        searchQuery: "cable face pull external rotation rear delt",
        equivalents: [
          { id: "d3_e4_eq1", name: "Pájaros en Pec Deck Inverso", desc: "Aislamiento directo de deltoides posterior.", ratio: 1.0 },
          { id: "d3_e4_eq2", name: "Rear Delt Flyes en Polea Cruzada", desc: "Tensión continua con cables.", ratio: 0.8 }
        ]
      },
      {
        id: "d3_e5",
        name: "Curl de Bíceps con Mancuernas (Supinado)",
        muscleGroup: "Bíceps (Cabeza Corta & Larga)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "De pie o sentado con el pecho erguido. Inicia con las mancuernas en posición neutra. Al flexionar el codo, realiza una supinación completa rotando la palma hacia arriba y hacia afuera. Aprieta el bíceps en la cima sin permitir que los codos se desplacen hacia adelante.",
        warmup: "🔥 1 serie con 15 lbs x 12 reps.",
        searchQuery: "supinating dumbbell bicep curl proper form",
        equivalents: [
          { id: "d3_e5_eq1", name: "Curl de Bíceps con Barra Z", desc: "Mayor sobrecarga de peso libre.", ratio: 1.0 },
          { id: "d3_e5_eq2", name: "Curl Alterno de Pie", desc: "Foco unilateral por repetición.", ratio: 1.0 }
        ]
      },
      {
        id: "d3_e6",
        name: "Curl en Máquina (Arm Curl Machine)",
        muscleGroup: "Bíceps (Aislamiento y Pico)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Brazos apoyados sobre la almohadilla predicador (Scott) con el pecho firme contra el soporte. Flexiona concentrando toda la carga en el braquial y bíceps. Controla el descenso en 3 segundos sin llegar a hiperextender el codo al final.",
        warmup: "🔥 1 serie ligera x 10 reps.",
        searchQuery: "machine preacher curl bicep isolation",
        equivalents: [
          { id: "d3_e6_eq1", name: "Curl en Banco Predicador (Scott) con Barra", desc: "Aislamiento estricto de flexores.", ratio: 0.9 },
          { id: "d3_e6_eq2", name: "Curl en Polea Baja", desc: "Tensión constante en la parte final.", ratio: 0.8 }
        ]
      },
      {
        id: "d3_e7",
        name: "Vacuum Abdominal (Transverso)",
        muscleGroup: "Core (Transverso & Cintura Estrecha)",
        sets: 4,
        reps: "15 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "Expulsa todo el aire por la boca y contrae el ombligo hacia adentro y hacia arriba contra la columna por 15 segundos para estrechar la cintura y aumentar el control neuromuscular del core.",
        warmup: "🔥 2 respiraciones diafragmáticas.",
        searchQuery: "stomach vacuum exercise waist tightening",
        equivalents: [
          { id: "d3_e7_eq1", name: "Plancha Isométrica", desc: "Tensión estabilizadora.", ratio: 1.0 }
        ]
      },
      {
        id: "d3_e8",
        name: "Cardio Aeróbico en Zona 2",
        muscleGroup: "Cardiovascular (Zona 2)",
        sets: 1,
        reps: "30 min",
        isCardio: true,
        restTime: "0 s",
        defaultUnit: "min",
        biomechanics: "30 minutos continuos a ritmo constante en Zona 2 (60-70% FCM / 120-135 BPM) para optimizar la quema de grasa y la recuperación mitocondrial.",
        warmup: "🔥 3 minutos progresivos.",
        searchQuery: "zone 2 cardio fat oxidation incline walk",
        equivalents: [
          { id: "d3_e8_eq1", name: "Caminadora en Inclinación", desc: "Bajo impacto articular.", ratio: 1.0 },
          { id: "d3_e8_eq2", name: "Bici Fija", desc: "Cadencia fluida.", ratio: 1.0 }
        ]
      }
    ]
  },

  // =========================================================================
  // 📌 JUEVES: EMPUJE 2 (ENFOQUE ESTÉTICO Y ESTABILIDAD)
  // =========================================================================
  {
    id: "d4",
    dayNumber: 4,
    name: "Jueves: Empuje 2 (Enfoque Estético y Estabilidad)",
    type: "workout",
    focus: "Segunda sesión semanal de empuje con foco en pectoral medio/plano, hombros y tríceps para consolidar frecuencia 2 óptima.",
    exercises: [
      {
        id: "d4_e1",
        name: "Machine Chest Press (Prensa de Pecho Plano)",
        muscleGroup: "Pecho (Pectoral Mayor & Medio)",
        sets: 3,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Asiento ajustado para que las agarraderas queden a la altura media de los pezones. IAP: Inhala diafragmáticamente, retrae escápulas y empuja con potencia sin que los hombros se deslicen hacia adelante en el punto final. Descenso en 3 segundos.",
        warmup: "🔥 2 series de aproximación con carga liviana a media.",
        searchQuery: "machine chest press flat hammer strength form",
        equivalents: [
          { id: "d4_e1_eq1", name: "Press Plano con Barra", desc: "Potencia y fuerza básica.", ratio: 0.9 },
          { id: "d4_e1_eq2", name: "Press Plano en Smith", desc: "Estabilidad fija para ir al fallo.", ratio: 0.9 },
          { id: "d4_e1_eq3", name: "Press con Mancuernas en Banco Plano", desc: "Rango de estiramiento profundo.", ratio: 0.45 }
        ]
      },
      {
        id: "d4_e2",
        name: "Press Inclinado en Máquina (Nitro Incline)",
        muscleGroup: "Pecho (Pectoral Superior)",
        loadFamily: LOAD_FAMILIES.INCLINE_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Asiento regulado a 30°. Empuje convergente enfocado en el haz clavicular. IAP firme durante todo el recorrido excéntrico (3s) para maximizar la tensión mecánica sobre el pecho superior.",
        warmup: "🔥 1 serie de 8 reps moderadas.",
        searchQuery: "incline chest press machine form",
        equivalents: [
          { id: "d4_e2_eq1", name: "Press Inclinado con Mancuernas", desc: "Libertad de rotación articular.", ratio: 0.45 },
          { id: "d4_e2_eq2", name: "Smith Inclinado a 30°", desc: "Estabilidad axial.", ratio: 1.0 }
        ]
      },
      {
        id: "d4_e3",
        name: "Press Militar en Máquina (Dual Axis)",
        muscleGroup: "Hombro (Deltoides Anterior y Medio)",
        loadFamily: LOAD_FAMILIES.OVERHEAD_PRESS,
        sets: 3,
        reps: "8-10",
        restTime: "120 s",
        defaultUnit: "lbs",
        biomechanics: "Empuje vertical guiado. Codos adelantados a 30° respecto a la línea lateral. IAP: Abdomen activo y pelvis neutra contra el respaldo para no crear arco en la columna lumbar.",
        warmup: "🔥 1 serie ligera x 10 reps.",
        searchQuery: "overhead press machine dual axis deltoid",
        equivalents: [
          { id: "d4_e3_eq1", name: "Press Militar con Mancuernas Sentado", desc: "Activación del deltoides con peso libre.", ratio: 0.45 },
          { id: "d4_e3_eq2", name: "Press Militar en Smith", desc: "Seguridad y control en sobrecarga.", ratio: 0.9 }
        ]
      },
      {
        id: "d4_e4",
        name: "Cristos en Máquina (Pec Deck)",
        muscleGroup: "Pecho (Aislamiento Pectoral)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Apertura amplia con codos a 15° de flexión constante. Siente el estiramiento profundo de la fascia pectoral; al juntar, aprieta 1 segundo al centro.",
        warmup: "🔥 1 serie ligera x 12 reps.",
        searchQuery: "pec deck flyes chest isolation technique",
        equivalents: [
          { id: "d4_e4_eq1", name: "Cristos en Polea Alta a Media", desc: "Tensión constante en línea de fibras.", ratio: 0.8 },
          { id: "d4_e4_eq2", name: "Crossover en Poleas", desc: "Cruce al frente para máxima contracción.", ratio: 0.8 }
        ]
      },
      {
        id: "d4_e5",
        name: "Elevaciones Laterales en Polea Baja",
        muscleGroup: "Hombro (Deltoides Lateral)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Polea posicionada a la altura de la rodilla. Pasa el cable por detrás del cuerpo o por delante elevando en el plano escapular a 30°. La polea proporciona tensión continua desde el punto más bajo sin descanso articular.",
        warmup: "🔥 1 serie de 15 reps livianas.",
        searchQuery: "cable lateral raise behind back deltoid isolation",
        equivalents: [
          { id: "d4_e5_eq1", name: "Elevaciones Laterales en Máquina", desc: "Guía fija para aislar el húmero.", ratio: 1.5 },
          { id: "d4_e5_eq2", name: "Elevaciones Laterales con Mancuerna", desc: "Variante clásica con mancuernas.", ratio: 0.7 }
        ]
      },
      {
        id: "d4_e6",
        name: "Extensión de Tríceps en Máquina",
        muscleGroup: "Tríceps (Cabeza Larga)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Codos alineados con el eje de giro. Descenso pausado permitiendo flexión total del codo para reclutar la cabeza larga del tríceps en estiramiento. Extiende bloqueando 1 segundo.",
        warmup: "🔥 1 serie ligera x 12 reps.",
        searchQuery: "triceps extension machine long head stretch",
        equivalents: [
          { id: "d4_e6_eq1", name: "Extensión Copa con Mancuerna", desc: "Estiramiento vertical sobre la cabeza.", ratio: 0.5 },
          { id: "d4_e6_eq2", name: "French Press en Banco", desc: "Sobrecarga en banco declinado o plano.", ratio: 0.6 }
        ]
      },
      {
        id: "d4_e7",
        name: "Extensión de Tríceps en Polea (Pushdown)",
        muscleGroup: "Tríceps (Cabeza Lateral)",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Barra o maneral en V. Empuja hacia el suelo bloqueando los codos. Controla la fase excéntrica hasta la altura del pecho sin balancear el cuerpo.",
        warmup: "🔥 1 serie de 12 reps livianas.",
        searchQuery: "cable tricep pushdown straight bar form",
        equivalents: [
          { id: "d4_e7_eq1", name: "Pushdown con Cuerda", desc: "Mayor libertad de pronación al final.", ratio: 0.9 },
          { id: "d4_e7_eq2", name: "Pushdown con Barra V", desc: "Menor estrés sobre muñecas.", ratio: 1.0 }
        ]
      }
    ]
  },

  // =========================================================================
  // 📌 VIERNES: PIERNAS 2 (CADENA POSTERIOR Y GLÚTEOS)
  // =========================================================================
  {
    id: "d5",
    dayNumber: 5,
    name: "Viernes: Piernas 2 (Cadena Posterior y Glúteos)",
    type: "workout",
    focus: "Enfoque en isquiotibiales, glúteos y aductores/abductores para balance muscular simétrico y fuerza de bisagra de cadera.",
    exercises: [
      {
        id: "d5_e1",
        name: "Prensa de Piernas (Pies Altos y Abiertos)",
        muscleGroup: "Glúteos & Isquiotibiales",
        loadFamily: LOAD_FAMILIES.HAMSTRING_GLUTE,
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Pies colocados en el tercio superior de la plataforma con separación superior al ancho de hombros y puntas ligeramente hacia afuera. IAP: Inhala hondo bloqueando la pared abdominal antes de bajar. Desciende profundo sintiendo la apertura y flexión de cadera que carga directamente el glúteo mayor y los isquios.",
        warmup: "🔥 2 series de aproximación progresivas.",
        searchQuery: "leg press feet high wide glute ham focus",
        equivalents: [
          { id: "d5_e1_eq1", name: "Peso Muerto Rumano con Mancuernas", desc: "Bisagra de cadera pura con gran estiramiento.", ratio: 0.4 },
          { id: "d5_e1_eq2", name: "Peso Muerto Rumano con Barra", desc: "Sobrecarga pesada en cadena posterior.", ratio: 0.8 }
        ]
      },
      {
        id: "d5_e2",
        name: "Flexión de Femorales Sentado (Seated Leg Curl)",
        muscleGroup: "Isquiotibiales (Flexores de Rodilla)",
        loadFamily: LOAD_FAMILIES.HAMSTRING_GLUTE,
        sets: 4,
        reps: "10-12",
        restTime: "90-120 s",
        defaultUnit: "lbs",
        biomechanics: "La posición sentada mantiene la cadera flexionada a 90°, lo cual estira los isquiotibiales en su origen isquiático y maximiza la tensión mecánica respecto a la variante tumbada. Ajusta el soporte de muslos bien firme. Flexiona con potencia y aguanta 1 segundo en el punto de máxima contracción.",
        warmup: "🔥 1 serie liviana x 12 reps de calibración.",
        searchQuery: "seated leg curl hamstring hypertrophy stretch",
        equivalents: [
          { id: "d5_e2_eq1", name: "Flexión de Femorales Tumbado (Lying Leg Curl)", desc: "Aislamiento en posición prona.", ratio: 0.9 },
          { id: "d5_e2_eq2", name: "Leg Curl de Pie Unilateral", desc: "Alineación independiente por pierna.", ratio: 0.45 }
        ]
      },
      {
        id: "d5_e3",
        name: "Extensiones de Glúteo a 45° en Banco Romano",
        muscleGroup: "Glúteo Mayor & Erectores Espinales",
        sets: 3,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Almohadilla colocada justo por debajo del pliegue de la cadera. Rota las puntas de los pies 45° hacia afuera y redondea deliberadamente la columna dorsal y cervical (chin to chest). Sube apretando exclusivamente los glúteos contra la almohadilla sin hiperextender la zona lumbar.",
        warmup: "🔥 1 serie con peso corporal x 12 reps.",
        searchQuery: "45 degree back extension glute focus rounded back",
        equivalents: [
          { id: "d5_e3_eq1", name: "Glute Butt Blaster en Máquina", desc: "Empuje directo contra resistencia.", ratio: 1.0 },
          { id: "d5_e3_eq2", name: "Patada de Glúteo Pesada en Polea", desc: "Tensión continua en extensión.", ratio: 0.5 }
        ]
      },
      {
        id: "d5_e4",
        name: "Abductores en Máquina (Hip Abduction)",
        muscleGroup: "Glúteo Medio & Cadena Lateral",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Torso inclinado hacia el frente a 30°. Empuja abriendo con las rodillas contra las almohadillas. Pausa de 1s en la apertura y retorno controlado en 2s.",
        warmup: "🔥 1 serie ligera x 15 reps.",
        searchQuery: "hip abductor machine high reps glute burn",
        equivalents: [
          { id: "d5_e4_eq1", name: "Abducción en Polea con Tobillera", desc: "Aislamiento dinámico libre.", ratio: 0.5 }
        ]
      },
      {
        id: "d5_e5",
        name: "Aductores en Máquina (Hip Adduction)",
        muscleGroup: "Aductores (Muslo Interno)",
        sets: 3,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Rango completo de apertura excéntrica. Cierra con fuerza de aducción y sostiene 1 segundo de pico de contracción al centro.",
        warmup: "🔥 1 serie ligera x 15 reps.",
        searchQuery: "hip adductor machine inner thigh isolation",
        equivalents: [
          { id: "d5_e5_eq1", name: "Aducción en Polea con Tobillera", desc: "Trabajo dinámico con cable.", ratio: 0.5 }
        ]
      },
      {
        id: "d5_e6",
        name: "Elevación de Pantorrillas (Rotary Calf)",
        muscleGroup: "Pantorrillas (Sóleo & Gastrocnemio)",
        sets: 4,
        reps: "15-20",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Rango amplio con pausa estricta de 2 segundos en el fondo del estiramiento. Eleva hasta la punta de los dedos apretando en la cima.",
        warmup: "🔥 1 serie liviana x 15 reps.",
        searchQuery: "rotary calf machine stretch focus high reps",
        equivalents: [
          { id: "d5_e6_eq1", name: "Pantorrilla Sentado (Sóleo)", desc: "Aislamiento del músculo sóleo.", ratio: 0.8 },
          { id: "d5_e6_eq2", name: "Pantorrilla en Smith", desc: "Carga axial de pie.", ratio: 1.0 }
        ]
      },
      {
        id: "d5_e7",
        name: "Pallof Press en Polea",
        muscleGroup: "Core (Anti-Rotación & IAP)",
        sets: 3,
        reps: "12",
        restTime: "60 s",
        defaultUnit: "lbs",
        biomechanics: "De pie perpendicular a la polea a la altura del pecho. IAP: Inhala y contrae el abdomen y glúteos. Extiende los brazos al frente bloqueando los codos y resiste con fuerza isométrica el torque de rotación de la polea durante 2 segundos antes de retraer los brazos.",
        warmup: "🔥 1 serie ligera x 10 reps por lado.",
        searchQuery: "pallof press cable anti rotation core stability",
        equivalents: [
          { id: "d5_e7_eq1", name: "Press Pallof con Banda Elástica", desc: "Variante portátil con tensión progresiva.", ratio: 1.0 },
          { id: "d5_e7_eq2", name: "Abdominales en Polea Alta (Cable Crunch)", desc: "Flexión espinal con sobrecarga.", ratio: 1.2 }
        ]
      }
    ]
  },

  // =========================================================================
  // 📌 SÁBADO: JALÓN 2 (ESPALDA V-TAPER Y HOMBRO)
  // =========================================================================
  {
    id: "d6",
    dayNumber: 6,
    name: "Sábado: Jalón 2 (Espalda V-Taper y Hombro)",
    type: "workout",
    focus: "Segunda sesión de tirón semanal con agarres neutros para dorsales, deltoides posterior y flexores de brazo.",
    exercises: [
      {
        id: "d6_e1",
        name: "Jalón al Pecho Agarre Estrecho Neutro",
        muscleGroup: "Espalda (Dorsal Inferior & V-Taper)",
        loadFamily: LOAD_FAMILIES.VERTICAL_PULL,
        sets: 4,
        reps: "8-10",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Maneral estrecho con palmas enfrentadas (agarre neutro). IAP: Infla el abdomen y pecho antes de traccionar. Lleva los codos hacia abajo y ligeramente hacia adelante pegados a las costillas para aislar la inserción inferior del dorsal ancho. Regresa estirando completamente los brazos.",
        warmup: "🔥 2 series de aproximación progresivas.",
        searchQuery: "close grip neutral lat pulldown lower lats focus",
        equivalents: [
          { id: "d6_e1_eq1", name: "Jalón con Agarre Supinado", desc: "Mayor ayuda del bíceps para sobrecargar dorsales.", ratio: 1.0 },
          { id: "d6_e1_eq2", name: "Dominadas Agarre Neutro", desc: "Fuerza calisténica en barra cerrada.", ratio: 0.9 }
        ]
      },
      {
        id: "d6_e2",
        name: "Remo Compuesto en Máquina",
        muscleGroup: "Espalda (Densidad Dorsal Media)",
        loadFamily: LOAD_FAMILIES.HORIZONTAL_ROW,
        sets: 3,
        reps: "10-12",
        restTime: "120-180 s",
        defaultUnit: "lbs",
        biomechanics: "Pecho firme contra la almohadilla. Tracciona en plano horizontal hasta tocar las costillas con los codos. Sostén 1 segundo la contracción en la espalda media y controla la fase excéntrica en 3 segundos.",
        warmup: "🔥 1 serie ligera x 10 reps.",
        searchQuery: "machine row compound back thickness",
        equivalents: [
          { id: "d6_e2_eq1", name: "Remo Gironda Sentado en Polea", desc: "Gran recorrido horizontal con cable.", ratio: 1.0 },
          { id: "d6_e2_eq2", name: "Remo con Mancuerna Apoyado en Banco", desc: "Independencia de brazos.", ratio: 0.5 }
        ]
      },
      {
        id: "d6_e3",
        name: "Pájaros en Pec Deck Inverso",
        muscleGroup: "Hombro (Deltoides Posterior)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Manerales regulados a la altura de los hombros con pecho apoyado al frente. Abre empujando con el dorso de las manos y el codo ligeramente flexionado. Mantén los trapecios deprimidos para aislar el deltoides posterior.",
        warmup: "🔥 1 serie liviana x 15 reps.",
        searchQuery: "reverse pec deck rear delt fly form",
        equivalents: [
          { id: "d6_e3_eq1", name: "Face Pulls en Polea Alta", desc: "Trabajo combinado con manguito rotador.", ratio: 1.0 },
          { id: "d6_e3_eq2", name: "Pájaros con Mancuerna Tumbado", desc: "Gravedad directa en el punto medio.", ratio: 0.4 }
        ]
      },
      {
        id: "d6_e4",
        name: "Elevaciones Laterales en Polea o Máquina",
        muscleGroup: "Hombro (Deltoides Lateral)",
        sets: 4,
        reps: "12-15",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Tensión mecánica continua sobre el deltoides lateral. Eleva en el plano escapular a 30° hacia adelante. Al fallar concéntrico, ejecuta repeticiones parciales inferiores para fatigar las fibras de contracción rápida.",
        warmup: "🔥 1 serie ligera x 15 reps.",
        searchQuery: "cable lateral raise deltoid cap growth",
        equivalents: [
          { id: "d6_e4_eq1", name: "Elevaciones Laterales con Mancuerna", desc: "Variante clásica con mancuernas.", ratio: 0.7 }
        ]
      },
      {
        id: "d6_e5",
        name: "Curl de Bíceps en Polea (Barra Recta)",
        muscleGroup: "Bíceps (Tensión Continua)",
        sets: 4,
        reps: "10-12",
        restTime: "90 s",
        defaultUnit: "lbs",
        biomechanics: "Polea baja con barra recta. La polea mantiene una resistencia vectorial uniforme tanto en el estiramiento como en el pico. Codos fijos a los lados del torso; flexiona sin balancear la espalda.",
        warmup: "🔥 1 serie ligera x 12 reps.",
        searchQuery: "straight bar cable bicep curl form",
        equivalents: [
          { id: "d6_e5_eq1", name: "Curl de Bíceps con Barra Z de Pie", desc: "Fuerza básica con barra libre.", ratio: 1.0 },
          { id: "d6_e5_eq2", name: "Curl Concentrado con Mancuerna", desc: "Aislamiento estricto de pico de bíceps.", ratio: 0.45 }
        ]
      },
      {
        id: "d6_e6",
        name: "Vacuum Abdominal (Transverso)",
        muscleGroup: "Core (Transverso & Cintura Estrecha)",
        sets: 4,
        reps: "15 s",
        isTime: true,
        restTime: "60 s",
        defaultUnit: "s",
        biomechanics: "Exhalación total del aire. Expande las costillas y aspira el ombligo hacia adentro por 15 segundos continuos.",
        warmup: "🔥 2 respiraciones diafragmáticas.",
        searchQuery: "stomach vacuum exercise waist tightening",
        equivalents: [
          { id: "d6_e6_eq1", name: "Plancha Isométrica", desc: "Estabilidad abdominal.", ratio: 1.0 }
        ]
      },
      {
        id: "d6_e7",
        name: "Cardio Aeróbico en Zona 2",
        muscleGroup: "Cardiovascular (Zona 2)",
        sets: 1,
        reps: "40 min",
        isCardio: true,
        restTime: "0 s",
        defaultUnit: "min",
        biomechanics: "40 minutos continuos de caminata en inclinación o elíptica en Zona 2 (60-70% FCM / 120-135 BPM) para cerrar el gasto calórico y lipólisis semanal.",
        warmup: "🔥 3 minutos progresivos.",
        searchQuery: "zone 2 cardio fat oxidation incline walk",
        equivalents: [
          { id: "d6_e7_eq1", name: "Caminadora en Inclinación", desc: "Bajo impacto articular.", ratio: 1.0 },
          { id: "d6_e7_eq2", name: "Bici", desc: "Cadencia continua.", ratio: 1.0 },
          { id: "d6_e7_eq3", name: "Remo", desc: "Gasto de cuerpo completo.", ratio: 1.0 }
        ]
      }
    ]
  },

  // =========================================================================
  // 📌 DOMINGO: DESCANSO TOTAL
  // =========================================================================
  {
    id: "d7",
    dayNumber: 7,
    name: "Domingo: Descanso Total",
    type: "rest",
    focus: "Recuperación del Sistema Nervioso Central, síntesis proteica muscular, hidratación y recarga de glucógeno.",
    exercises: []
  }
];
