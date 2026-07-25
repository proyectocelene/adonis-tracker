export const scientificProtocol = [
  {
    id: 'day1',
    dayNumber: 1,
    name: 'Lunes: Empuje (Tren Superior)',
    focus: 'Hipertrofia Clavicular, Deltoidea Posterior/Anterior y Extensión de Codo.',
    type: 'workout',
    exercises: [
      {
        id: 'd1_e1',
        name: 'Press Inclinado con Mancuernas (Incline DB Press)',
        sets: 4,
        reps: '8-10',
        restTime: '120 - 180 s (Ejercicio Compuesto)',
        biomechanics: 'Retracción y depresión escapular constante. Banco a 30-45°. Codos alineados a 45° del torso para proteger la cápsula articular. Fase excéntrica controlada en 3 segundos. Exhalar al superar el punto de máxima fricción (concéntrica) para reducir la presión intra-abdominal (IAP).',
        searchQuery: 'incline dumbbell bench press anatomical form technique',
        defaultUnit: 'lbs'
      },
      {
        id: 'd1_e2',
        name: 'Press Inclinado en Máquina (Machine Incline Press)',
        sets: 3,
        reps: '8-10',
        restTime: '120 - 180 s (Ejercicio Compuesto)',
        biomechanics: 'Ajustar la altura del asiento para que las empuñaduras alineen con las fibras claviculares (pectoral superior). Evitar el bloqueo de extensión violento en el codo al finalizar el empuje.',
        searchQuery: 'incline chest press machine technique execution',
        defaultUnit: 'lbs'
      },
      {
        id: 'd1_e3',
        name: 'Aperturas en Máquina (Pec Deck Flye)',
        sets: 3,
        reps: '12-15',
        restTime: '90 s (Aislamiento Pectoral)',
        biomechanics: 'Mantener codos en ligera flexión concéntrica (~15°) para mitigar el torque en el bíceps proximal. Enfocar la contracción en la aducción horizontal del húmero sobre el tórax con una pausa isométrica de 1s al centro.',
        searchQuery: 'pec deck machine chest fly anatomical execution',
        defaultUnit: 'lbs'
      },
      {
        id: 'd1_e4',
        name: 'Abducción de Hombro con Mancuernas (Elevaciones Laterales)',
        sets: 4,
        reps: '12-15',
        restTime: '90 s (Aislamiento Deltoideo)',
        biomechanics: 'Elevación en el plano escapular (~30° hacia delante del plano frontal) con codos mínimamente flexionados. No exceder los 90° de abducción articular para prevenir pinzamiento subacromial.',
        searchQuery: 'dumbbell lateral raise scapular plane proper mechanics',
        defaultUnit: 'lbs'
      },
      {
        id: 'd1_e5',
        name: 'Extensión de Tríceps en Polea Alta con Cuerda',
        sets: 4,
        reps: '10-12',
        restTime: '90 s (Aislamiento Tríceps Brachii)',
        biomechanics: 'Fijar el húmero perpendicular al suelo junto a los flancos de la caja torácica. Realizar una pronación de las muñecas en la extensión completa para contraer la cabeza lateral y medial del tríceps.',
        searchQuery: 'cable rope triceps pushdown biomechanics form',
        defaultUnit: 'lbs'
      },
      {
        id: 'd1_e6',
        name: 'Vacío Abdominal (Transverso Abdominal Isométrico)',
        sets: 4,
        reps: '15s',
        restTime: '60 s (Control Core)',
        biomechanics: 'Exhalar el 100% del volumen torácico y deprimir el diafragma halando el ombligo hacia la columna vertebral (activación selectiva del músculo transverso del abdomen para contención de la pared y mitigación del riesgo protuberacional).',
        searchQuery: 'stomach vacuum transverse abdominis proper biomechanics',
        isTime: true,
        defaultUnit: 'N/A'
      },
      {
        id: 'd1_e7',
        name: 'Acondicionamiento Aeróbico (Cardio Zona 2)',
        sets: 1,
        reps: '30m',
        restTime: 'N/A',
        biomechanics: 'Estricto control de intensidad aeróbica en Zona 2 (60-70% FC máx o umbral ventilatorio donde la conversación oral es continua y sin deuda de oxígeno). Evitar impacto osteoarticular de carrera o HIIT para prevenir interferencia en hipertrofia y elevación de presión intra-abdominal.',
        searchQuery: 'zone 2 steady state incline treadmill form',
        isCardio: true
      }
    ]
  },
  {
    id: 'day2',
    dayNumber: 2,
    name: 'Martes: Miembro Inferior 1 (Énfasis Cuádriceps)',
    focus: 'Desarrollo de Cuádriceps Femoral, Glúteo Medio y Contención Abdominal.',
    type: 'workout',
    exercises: [
      {
        id: 'd2_e1',
        name: 'Sentadilla en Máquina Hack (Hack Squat)',
        sets: 4,
        reps: '8-10',
        restTime: '180 s (Ejercicio Compuesto Mínimo)',
        biomechanics: 'Apoyo lumbar y sacro total contra el respaldo. Pies alineados al ancho de las caderas. Descenso con rodillas apuntando en dirección al segundo y tercer metatarso. Exhalación rigurosa durante toda la fase de empuje (concéntrica).',
        searchQuery: 'hack squat machine proper quadriceps deep form',
        defaultUnit: 'lbs'
      },
      {
        id: 'd2_e2',
        name: 'Prensa de Piernas a 45° (Leg Press)',
        sets: 3,
        reps: '10-12',
        restTime: '120 - 180 s (Ejercicio Compuesto)',
        biomechanics: 'Detener el descenso exactamente a los 90° de flexión de rodilla o antes de perder el contacto sacral con el asiento. La retroversión pélvica (despegar la cadera al final de la bajada) genera compresión discal y aumenta la presión abdominal de forma perjudicial.',
        searchQuery: 'leg press 45 degree lower back pelvic placement form',
        defaultUnit: 'lbs'
      },
      {
        id: 'd2_e3',
        name: 'Extensión de Rodilla en Máquina (Leg Extension)',
        sets: 3,
        reps: '12-15',
        restTime: '90 s (Aislamiento Cuádriceps / Vasto Medial)',
        biomechanics: 'Alinear el eje anatómico de la rodilla exactamente con el fulcro (pivote de giro) de la máquina. Realizar extensión completa sin golpear y controlar el retorno excéntrico durante 2 segundos para maximizar tensión estática.',
        searchQuery: 'leg extension machine fulcrum joint rotation setup',
        defaultUnit: 'lbs'
      },
      {
        id: 'd2_e4',
        name: 'Extensión de Cadera en Polea o Máquina (Glute Kickbacks)',
        sets: 3,
        reps: '12-15',
        restTime: '90 s (Aislamiento Glúteo Mayor)',
        biomechanics: 'Por pierna. Bloquear la espina dorsal en posición neutra. El movimiento debe ocurrir exclusivamente a través de la extensión articular del rafe caderal (coxofemoral), sin compensar con lordosis o curvatura lumbar.',
        searchQuery: 'cable glute kickback lower back neutral spinal mechanics',
        defaultUnit: 'lbs'
      },
      {
        id: 'd2_e5',
        name: 'Estabilización Isométrica Horizontal (Plancha / Plank)',
        sets: 3,
        reps: '45s',
        restTime: '60 s (Core Isométrico)',
        biomechanics: 'Alineación craneocervical y dorsolumbar neutra en línea recta. Mantener contracción isométrica voluntaria glútea y abdominal (retener el ombligo en dirección a la columna) para proteger la fascia ventral.',
        searchQuery: 'plank proper anatomical core neutral spine stability',
        isTime: true,
        defaultUnit: 'N/A'
      }
    ]
  },
  {
    id: 'day3',
    dayNumber: 3,
    name: 'Miércoles: Jalón (Dorsales y Flexores del Codo)',
    focus: 'Amplitud Dorsal, Retracción Escapular y Flexión del Codo (Bíceps Brachii).',
    type: 'workout',
    exercises: [
      {
        id: 'd3_e1',
        name: 'Tracción al Pecho en Polea Alta (Lat Pulldown)',
        sets: 4,
        reps: '8-10',
        restTime: '120 - 180 s (Ejercicio Compuesto)',
        biomechanics: 'Asegurar los rodillos firmemente sobre el muslo parano compensar con impulso. Tracción frontal llevando la barra hacia el estrato superior del esternón (clavícula), jamás por detrás del cuello. Mantener extensión torácica en la bajada.',
        searchQuery: 'lat pulldown proper form thoracic extension technique',
        defaultUnit: 'lbs'
      },
      {
        id: 'd3_e2',
        name: 'Remo Horizontal Compuesto en Máquina (Compound Row)',
        sets: 3,
        reps: '10-12',
        restTime: '120 - 180 s (Ejercicio Compuesto)',
        biomechanics: 'Mantener el tórax fijo y apoyado en el soporte torácico si es en máquina o sentada para liberar estrés del erector espinal. Traccionado llevando los húmeros paralelos a la parrilla costal, contrayendo la musculatura romboidea y trapecio medial.',
        searchQuery: 'seated cable compound row biomechanics form',
        defaultUnit: 'lbs'
      },
      {
        id: 'd3_e3',
        name: 'Extensión de Cadera y Húmero en Polea Alta (Pullover con Cuerda)',
        sets: 3,
        reps: '12-15',
        restTime: '90 s (Aislamiento Dorsal Ancho / Redondo Mayor)',
        biomechanics: 'Con codos fijados en ligera flexión constante (~15°), traccionar desde arriba hacia la cadera concentrando el torque en la inserción del dorsal ancho sobre el húmero. Exhalar al aproximar la cuerda hacia la cadera.',
        searchQuery: 'straight arm cable pully pullover lats biomechanics',
        defaultUnit: 'lbs'
      },
      {
        id: 'd3_e4',
        name: 'Tracción Facial en Polea (Face Pulls)',
        sets: 3,
        reps: '12-15',
        restTime: '90 s (Rotadores Externos / Deltoides Posterior)',
        biomechanics: 'Ajustar la polea a la altura facial o superciliar. Traccionar la cuerda hacia el rostro separando los cabos y elevando los codos por encima del eje humeral (combinando abducción horizontal y rotación externa para estabilidad del manguito rotador).',
        searchQuery: 'face pull correct rotator cuff rear delt execution',
        defaultUnit: 'lbs'
      },
      {
        id: 'd3_e5',
        name: 'Flexión de Codo con Mancuernas Alternada (DB Curl)',
        sets: 4,
        reps: '10-12',
        restTime: '90 s (Aislamiento Bíceps Brachii)',
        biomechanics: 'Ejecución supinatoria controlada. Mantener los codos inamovibles contra los flancos para suprimir el balanceo (flexión del hombro) inducido por el deltoides anterior. Contraer isométricamente 1 segundo al ápice del recorrido.',
        searchQuery: 'alternating dumbbell supinated curl form adherence',
        defaultUnit: 'lbs'
      },
      {
        id: 'd3_e6',
        name: 'Vacío Abdominal (Transverso Abdominal Isométrico)',
        sets: 4,
        reps: '15s',
        restTime: '60 s (Control Core)',
        biomechanics: 'Exhalar totalmente el volumen residual, meter el ombligo en contracción estática voluntaria sostenida durante 15 segundos continuos por cada serie.',
        searchQuery: 'stomach vacuum transverse abdominis proper biomechanics',
        isTime: true,
        defaultUnit: 'N/A'
      },
      {
        id: 'd3_e7',
        name: 'Acondicionamiento Aeróbico (Cardio Zona 2)',
        sets: 1,
        reps: '30m',
        restTime: 'N/A',
        biomechanics: 'Intensidad en Zona 2 metabólica pura (respiración conversacional posible en todo momento, evitando la deuda aeróbica y fatiga sistémica innecesaria).',
        searchQuery: 'stationary exercise bike proper Ergonomic ergonomics posture',
        isCardio: true
      }
    ]
  },
  {
    id: 'day4',
    dayNumber: 4,
    name: 'Jueves: Descanso Activo / Regulación Fisiológica',
    focus: 'Recuperación Sistémica y del Sistema Nervioso Central (SNC).',
    type: 'rest',
    exercises: [
      {
        id: 'd4_e1',
        name: 'Acondicionamiento Aeróbico Opcional (Cardio Zona 2)',
        sets: 1,
        reps: '40m',
        restTime: 'N/A',
        biomechanics: 'Sesión puramente regenerativa y circulatoria. Caminada suave con inclinación o bicicleta en Zona 2 estricta, complementado con movilidad articular libre y elongaciones sin sobrecarga mecánica (Cero pesas).',
        searchQuery: 'active recovery stretching guidelines zone 2 cardio',
        isCardio: true
      }
    ]
  },
  {
    id: 'day5',
    dayNumber: 5,
    name: 'Viernes: Miembro Inferior 2 (Cadena Posterior y Glúteo)',
    focus: 'Hipertrofia de Isquiosurales, Glúteo Mayor, Aducción/Abducción y Gastrocnemio.',
    type: 'workout',
    exercises: [
      {
        id: 'd5_e1',
        name: 'Sentadilla Búlgara Unilateral con Mancuernas',
        sets: 3,
        reps: '8-10',
        restTime: '120 - 180 s (Ejercicio Compuesto Unilateral)',
        biomechanics: 'Por pierna. Zancada posterior prolongada e inclinación del tronco ~30° hacia adelante en línea recta para desplazar el torque mecánico sobre el glúteo mayor e isquios en lugar del ligamento patelar anterior.',
        searchQuery: 'bulgarian split squat glute vs quads stance biomechanics',
        defaultUnit: 'lbs'
      },
      {
        id: 'd5_e2',
        name: 'Flexión de Rodilla Sentado en Máquina (Seated Leg Curl)',
        sets: 4,
        reps: '10-12',
        restTime: '90 - 120 s (Aislamiento Isquiosurales)',
        biomechanics: 'Mantener la almohadilla superior firmemente presionada contra la cara distal de los muslos e inclinar el tronco ligeramente al frente para mantener longitud y tensión óptimas en la cabeza larga del bíceps femoral y semitendinoso.',
        searchQuery: 'seated leg curl machine hip flexion technique advantage',
        defaultUnit: 'lbs'
      },
      {
        id: 'd5_e3',
        name: 'Abducción de Cadera en Máquina (Hip Abductor)',
        sets: 4,
        reps: '12-15',
        restTime: '90 s (Aislamiento Glúteo Medio / Menor)',
        biomechanics: 'Apertura lateral controlada contrayendo el complejo glúteo lateral y tensor de la fascia lata. Retorno controlado de 2 segundos a posición inicial evitando golpear el bloque de peso.',
        searchQuery: 'hip abductor machine lateral gluteus medius setup',
        defaultUnit: 'lbs'
      },
      {
        id: 'd5_e4',
        name: 'Aducción de Cadera en Máquina (Hip Adductor)',
        sets: 3,
        reps: '12-15',
        restTime: '90 s (Aislamiento Aductores Musculares)',
        biomechanics: 'Cierre progresivo con contracción en la musculatura medial del muslo (adductor magno, longus y brevis). Evitar movimientos balísticos bruscos que comprometan la sínfisis púbica.',
        searchQuery: 'hip adductor machine groin medial muscle form',
        defaultUnit: 'lbs'
      },
      {
        id: 'd5_e5',
        name: 'Flexión Plantar en Máquina (Calf Raise)',
        sets: 4,
        reps: '15-20',
        restTime: '90 s (Aislamiento Gastrocnemio y Sóleo)',
        biomechanics: 'Recorrido articular de máxima amplitud: estiramiento completo en dorsiflexión plantar inferior con pausa obligatoria de 1 segundo (eliminar el reflejo elástico del tendón de Aquiles) seguido de contracción concéntrica superior de 1 segundo.',
        searchQuery: 'standing vs seated calf raise stretch pause protocol',
        defaultUnit: 'lbs'
      },
      {
        id: 'd5_e6',
        name: 'Press de Pallof Antirotacional en Polea',
        sets: 3,
        reps: '12',
        restTime: '60 s (Core Estabilizador Antirotación)',
        biomechanics: 'Por lado. De pie, con pies al ancho del hombro perpendiculares a la polea. Extender las manos hacia el frente resistiendo en contracción isométrica la fuerza rotatoria torácica del cable. Blindaje lateral de la pared abdominal seguro y sin fricción espinal.',
        searchQuery: 'pallof press core anti rotation proper stance biomechanics',
        defaultUnit: 'lbs'
      }
    ]
  },
  {
    id: 'day6',
    dayNumber: 6,
    name: 'Sábado: Hipertrofia General del Torso (Tren Superior 2)',
    focus: 'Desarrollo Equilibrado del Tórax, Dorsal, Deltoides Lateral y Flexores/Extensores del Codo.',
    type: 'workout',
    exercises: [
      {
        id: 'd6_e1',
        name: 'Press Vertical en Máquina (Vertical Chest Press)',
        sets: 3,
        reps: '10-12',
        restTime: '120 - 180 s (Ejercicio Compuesto)',
        biomechanics: 'Ajuste del asiento para alinear empuñaduras al centro medial del esternón. Mantener retracción escapular estricta para concentrar el estímulo mecánico en el haz costal y clavicular pectoral sin comprometer la articulación glenohumeral.',
        searchQuery: 'machine vertical bench chest press proper setup height',
        defaultUnit: 'lbs'
      },
      {
        id: 'd6_e2',
        name: 'Tracción al Pecho Agarre Neutro (Neutral Grip Lat Pulldown)',
        sets: 3,
        reps: '10-12',
        restTime: '120 - 180 s (Ejercicio Compuesto)',
        biomechanics: 'Con palmas mirándose entre sí (agarre neutro paralelo), traccionar hacia la parte alta del tórax maximizando la aducción y extensión del hombro con fuerte implicación de fibras inferiores del dorsal ancho.',
        searchQuery: 'neutral grip lat pulldown parallel handle back mechanics',
        defaultUnit: 'lbs'
      },
      {
        id: 'd6_e3',
        name: 'Abducción de Hombro Unilateral en Polea Baja',
        sets: 4,
        reps: '12-15',
        restTime: '90 s (Aislamiento Deltoides Lateral)',
        biomechanics: 'Un brazo a la vez cruzando ligeramente el cable por delante de la cadera. El uso de la polea confiere un perfil de resistencia mecánico con tensión isométrica en la posición inicial del estiramiento donde las mancuernas carecen de carga gravitacional.',
        searchQuery: 'single arm low cable lateral raise constant tension biomechanics',
        defaultUnit: 'lbs'
      },
      {
        id: 'd6_e4',
        name: 'Flexión de Codo en Polea con Barra Recta o Z',
        sets: 3,
        reps: '12',
        restTime: '90 s (Aislamiento Bíceps Brachii / Braquiorradial)',
        biomechanics: 'Mantener la verticalidad humeral fija en el espacio. El cable otorga una tensión concéntrica fluida sin puntos muertos en el arco de flexión del codo.',
        searchQuery: 'straight bar cable bicep curl proper postural technique',
        defaultUnit: 'lbs'
      },
      {
        id: 'd6_e5',
        name: 'Extensión de Tríceps sobre la Cabeza en Polea o Mancuernas',
        sets: 3,
        reps: '12',
        restTime: '90 s (Aislamiento Tríceps Cabeza Larga)',
        biomechanics: 'La elevación humeral sobre la cabeza coloca la cabeza larga del bíceps femoral/tríceps en máxima longitud anatómica (elongación muscular), produciendo una hipertrofia por estiramiento mecánico sumamente potente en la porción posterior del brazo.',
        searchQuery: 'overhead triceps cable rope extension long head stretch biomechanics',
        defaultUnit: 'lbs'
      },
      {
        id: 'd6_e6',
        name: 'Acondicionamiento Aeróbico (Cardio Zona 2)',
        sets: 1,
        reps: '40m',
        restTime: 'N/A',
        biomechanics: 'Cardio aeróbico estandarizado en Zona 2 metabólica continua. Protección osteoarticular y abstención total de esprints o intervalos de alta intensidad que eludan la síntesis proteica.',
        searchQuery: 'elliptical trainer ergonomic hand zone 2 cardio posture',
        isCardio: true
      }
    ]
  },
  {
    id: 'day7',
    dayNumber: 7,
    name: 'Domingo: Descanso Total / Síntesis Fibrilar',
    focus: 'Recuperación Sistémica Absoluta, Sueño Anabólico y Preparación Nutricional (Meal Prep).',
    type: 'rest',
    exercises: []
  }
];
