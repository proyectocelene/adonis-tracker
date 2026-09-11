// PROTOCOLO ADONIS - RUTINA DEFINITIVA Y UNIFICADA
// Actualizada con Familias de Carga, Equivalencias Directas, Motor de Matching, Biomecánica con IAP y Conexión Mente-Músculo

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
  "GLUTE_EXTENSION": "Familia Extensión de Cadera / Glúteo"
};

export const scientificProtocol = [
  {
    "id": "d1",
    "dayNumber": 1,
    "name": "Lunes: Empuje 1 (Pecho Clavicular, Deltoides Lateral y Tríceps)",
    "type": "workout",
    "focus": "Prioridad neurológica en haz clavicular y deltoides lateral para maximizar el V-Taper y el Índice de Adonis. Pausas y parciales elongadas al fallar.",
    "exercises": [
      {
        "id": "d1_e1",
        "name": "Press Inclinado con Mancuernas (Banco a 30°)",
        "muscleGroup": "Pecho (Pectoral Superior Clavicular)",
        "loadFamily": "Familia Press Superior Inclinado",
        "sets": 3,
        "reps": "8-10",
        "restTime": "150-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Banco inclinado a 30° exactos para alinear las fibras del haz clavicular del pectoral con la línea de empuje. Escápulas deprimidas y retraídas contra el banco. Descenso en arco convergente natural donde las mancuernas inician a la altura del pecho alto y suben en diagonal sin chocar arriba. IAP: Inhala diafragmáticamente expandiendo el abdomen en 360° antes de bajar; contén el aire durante la excéntrica (3 segundos) para estabilizar la articulación glenohumeral. Exhala al superar el punto de estancamiento.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% del peso efectivo x 10 reps (control articular).\n• Serie 2: 75% del peso efectivo x 4 reps (activación neural sin fatiga).",
        "searchQuery": "dumbbell incline chest press 30 degree bench proper form",
        "equivalents": [
          {
            "id": "d1_e1_eq1",
            "name": "Press Inclinado en Multipower (Smith) a 30°",
            "desc": "Estabilidad guiada para ir al fallo con seguridad.",
            "ratio": 1.1,
            "biomechanics": "Banco a 30° ubicado para que la barra Smith descienda justo 2-3 cm debajo de las clavículas. Pies firmes generando fuerza contra el suelo. La guía rígida elimina la necesidad de estabilización, permitiendo ir al fallo concéntrico con seguridad y realizar parciales forzadas abajo.",
            "mindMuscle": {
              "title": "Pectoral Superior en Guía Rígida (Smith)",
              "internalCue": "Concéntrate en aplastar el pecho contra sí mismo al subir, sin adelantar los hombros en el punto más alto.",
              "externalCue": "Imagina que intentas doblar la barra Smith hacia adentro como si quisieras doblarla en 'V'.",
              "eccentricCue": "Frena la barra en 3 segundos hasta rozar suavemente las clavículas con pausa isométrica de 1 segundo."
            },
            "searchQuery": "Press Inclinado en Multipower (Smith) a 30° tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% del peso efectivo x 10 reps (control articular).\n• Serie 2: 75% del peso efectivo x 4 reps (activación neural sin fatiga)."
          },
          {
            "id": "d1_e1_eq2",
            "name": "Press Inclinado en Máquina (Nitro Incline)",
            "desc": "Tensión constante en recorrido convergente.",
            "ratio": 2.2,
            "biomechanics": "Asiento calibrado para que los manerales comiencen a la altura de la clavícula. Apoyo lumbar y dorsal firme. Trayectoria convergente que concentra la máxima tensión al final de la contracción. Al fallar concéntrico, ejecuta 2-3 repeticiones parciales en el tercio inferior estirado.",
            "mindMuscle": {
              "title": "Pectoral Clavicular en Trayectoria Convergente",
              "internalCue": "Siente cómo las fibras del pecho alto se compactan contra el centro del esternón al juntar los manerales.",
              "externalCue": "Empuja los manerales hacia el vértice de un triángulo imaginario frente a tus ojos.",
              "eccentricCue": "Resiste el retroceso de la máquina en 2 a 3 segundos sintiendo la tracción directa en el tendón pectoral."
            },
            "searchQuery": "Press Inclinado en Máquina (Nitro Incline) tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% del peso efectivo x 10 reps (control articular).\n• Serie 2: 75% del peso efectivo x 4 reps (activación neural sin fatiga)."
          }
        ],
        "mindMuscle": {
          "title": "Pectoral Mayor (Haz Clavicular / Pecho Superior)",
          "internalCue": "En el fondo del movimiento, siente cómo las fibras superiores del pecho se abren y estiran bajo las clavículas. Al subir, piensa en juntar tus bíceps hacia tu garganta.",
          "externalCue": "Empuja el techo alejándolo de tu esternón en una diagonal suave de 75°, manteniendo los codos a unos 45-60° respecto a las costillas.",
          "eccentricCue": "Baja las mancuernas en 3 segundos sintiendo el estiramiento profundo a los lados del torso sin perder tensión."
        }
      },
      {
        "id": "d1_e2",
        "name": "Press Inclinado en Máquina (Nitro Incline)",
        "muscleGroup": "Pecho (Pectoral Superior & Medio)",
        "loadFamily": "Familia Press Superior Inclinado",
        "sets": 3,
        "reps": "8-10",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "Asiento ajustado para que los mangos queden a nivel de las clavículas. Respaldo inclinado con apoyo lumbar firme. IAP: Presiona la espalda alta y glúteos contra el respaldo, llena el abdomen de aire para blindar el torso y empuja en trayectoria convergente sin despegar los hombros. En la última serie añade 2-3 repeticiones parciales en el fondo estirado.",
        "warmup": "🔥 Sí (1 serie feeder): 70% de la carga x 4 reps para calibrar el recorrido de la máquina.",
        "searchQuery": "nitro incline chest press machine setup",
        "equivalents": [
          {
            "id": "d1_e2_eq1",
            "name": "Press Inclinado con Barra",
            "desc": "Sobrecarga axial máxima.",
            "ratio": 1.15,
            "biomechanics": "Banco inclinado a 30°, agarre a 1.5 anchos de hombros con muñecas neutras sobre el antebrazo. La barra desciende controlada hacia la parte media-alta del esternón. Retracción escapular firme. IAP: Toma aire al diafragma arriba, bloquea el núcleo y baja conteniendo el aire para crear un bloque sólido que proteja la cintura escapular.",
            "mindMuscle": {
              "title": "Pectoral Superior con Barra Libre",
              "internalCue": "Siente la tensión acumulada en las fibras claviculares mientras la barra se acerca al pecho.",
              "externalCue": "Imagina empujar el suelo con los pies y alejar la barra con un empuje explosivo y controlado.",
              "eccentricCue": "Desciende en 3 segundos sin rebotar la barra en el esternón."
            },
            "searchQuery": "Press Inclinado con Barra tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie feeder): 70% de la carga x 4 reps para calibrar el recorrido de la máquina."
          },
          {
            "id": "d1_e2_eq2",
            "name": "Hammer Strength Incline",
            "desc": "Carga unilateral convergente.",
            "ratio": 1,
            "biomechanics": "Máquina con brazos independientes y carga por discos. Asiento colocado de modo que las manijas queden a nivel de las tetillas/clavículas al iniciar. Permite generar máxima fuerza unilateral compensando desbalances bilaterales.",
            "mindMuscle": {
              "title": "Pectoral Superior Unilateral Hammer",
              "internalCue": "Enfócate en la inserción esternal del pectoral mientras contraes al máximo al frente.",
              "externalCue": "Conduce los codos hacia adentro como si intentaras cerrar una pinza gigante.",
              "eccentricCue": "Permite que los brazos de la máquina abran tu caja torácica durante 3 segundos completos."
            },
            "searchQuery": "Hammer Strength Incline tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie feeder): 70% de la carga x 4 reps para calibrar el recorrido de la máquina."
          }
        ],
        "mindMuscle": {
          "title": "Pectoral Superior & Medio Convergente",
          "internalCue": "Al empujar, enfócate en deslizar los codos hacia el centro del pecho sin permitir que los hombros se adelanten.",
          "externalCue": "Piensa en empujar las agarraderas lejos de tu cuerpo juntando las manos al frente.",
          "eccentricCue": "Frena el retorno en 3 segundos sintiendo el estiramiento en la caja torácica antes del tope."
        }
      },
      {
        "id": "d1_e3",
        "name": "Press Militar en Máquina (Dual Axis)",
        "muscleGroup": "Hombro (Deltoides Anterior y Medio)",
        "loadFamily": "Familia Press Vertical Hombros",
        "sets": 3,
        "reps": "8-10",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Ajusta el asiento para que los mangos queden a la altura de la mandíbula o lóbulos de las orejas. Codos a 30° adelantados en el plano escapular (no abiertos a 90° para evitar pinzamiento subacromial). IAP: Bloquea el abdomen contra el respaldo lumbar antes del empuje para evitar arquear la columna baja.",
        "warmup": "🔥 No ocupa (el deltoides anterior ya viene pre-activado de los presses inclinados). Pasa directo a series efectivas.",
        "searchQuery": "dual axis overhead shoulder press machine",
        "equivalents": [
          {
            "id": "d1_e3_eq1",
            "name": "Press Militar con Mancuernas sentado",
            "desc": "Trabajo estabilizador de deltoides.",
            "ratio": 0.45,
            "biomechanics": "Banco vertical ajustado a 75-80° (un punto por debajo de 90° para respetar la movilidad escapular). Mancuernas sostenidas en agarre semi-pronado. Subida en arco natural sin chocar las pesas arriba.",
            "mindMuscle": {
              "title": "Deltoides Libre con Mancuernas",
              "internalCue": "Siente cómo las cabezas anteriores y laterales del deltoides sostienen y elevan la carga.",
              "externalCue": "Empuja las mancuernas hacia arriba buscando formar una 'A' en el aire.",
              "eccentricCue": "Baja en 3 segundos manteniendo los antebrazos completamente verticales respecto al suelo."
            },
            "searchQuery": "Press Militar con Mancuernas sentado tecnica biomecanica",
            "warmup": "🔥 No ocupa (el deltoides anterior ya viene pre-activado de los presses inclinados). Pasa directo a series efectivas."
          },
          {
            "id": "d1_e3_eq2",
            "name": "Shoulder Press en Smith",
            "desc": "Estabilidad en guía vertical.",
            "ratio": 0.9,
            "biomechanics": "Banco a 80° colocado bajo la guía Smith de modo que la barra baje frente a la nariz/mentón. Máxima estabilidad para reclutar unidades motoras de alto umbral en el deltoides sin balanceos.",
            "mindMuscle": {
              "title": "Deltoides Anterior en Guía Smith",
              "internalCue": "Aísla el empuje empujando con los codos debajo de la barra.",
              "externalCue": "Imagina empujar la barra a través del techo con fuerza pura de hombros.",
              "eccentricCue": "Frena la barra en 2 a 3 segundos antes de rozar la barbilla."
            },
            "searchQuery": "Shoulder Press en Smith tecnica biomecanica",
            "warmup": "🔥 No ocupa (el deltoides anterior ya viene pre-activado de los presses inclinados). Pasa directo a series efectivas."
          }
        ],
        "mindMuscle": {
          "title": "Deltoides Anterior y Cabeza Lateral",
          "internalCue": "Inicia el empuje desde los deltoides sin encoger los trapecios ni levantar el cuello del respaldo.",
          "externalCue": "Empuja los manerales hacia el techo en línea vertical suave, extendiendo los brazos sin hiperextender la columna.",
          "eccentricCue": "Baja la máquina en 2 a 3 segundos hasta que los codos queden justo a 90° sintiendo la carga en los hombros."
        }
      },
      {
        "id": "d1_e4",
        "name": "Cristos en Máquina (Pec Deck)",
        "muscleGroup": "Pecho (Aislamiento Pectoral)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Codos a la altura media del esternón con una ligera flexión constante de 15°. Retrae y deprime escápulas pegándolas al cojín. Pausa de 1s en estiramiento y 1s en contracción al centro. Al fallar concéntrico, sostén 5 segundos en estiramiento bajo tensión continua.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "pec deck fly machine lengthened partials chest",
        "equivalents": [
          {
            "id": "d1_e4_eq1",
            "name": "Cruce de poleas a media altura (Cable Crossover)",
            "desc": "Tensión continua en todo el rango.",
            "ratio": 0.8,
            "biomechanics": "Poleas a la altura del pecho medio. Paso al frente con torso ligeramente inclinado a 10° y abdomen firme. Los cables ofrecen tensión constante sin punto muerto al centro.",
            "mindMuscle": {
              "title": "Pectoral en Polea Continua (Crossover)",
              "internalCue": "Cruza ligeramente las muñecas al frente para maximizar el acortamiento pectoral.",
              "externalCue": "Dibuja un círculo amplio con las manos hacia el centro de tu pecho.",
              "eccentricCue": "Deja que los cables jalen tus brazos hacia afuera en 3 segundos sintiendo el estiramiento pectoral."
            },
            "searchQuery": "Cruce de poleas a media altura (Cable Crossover) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d1_e4_eq2",
            "name": "Aperturas con mancuernas en banco plano",
            "desc": "Gran tensión en máximo estiramiento.",
            "ratio": 0.4,
            "biomechanics": "Banco horizontal, mancuernas neutras. Codos flexionados a 15-20°. Descenso controlado hasta que los codos alcancen la altura del torso sin sobreestirar la articulación anterior del hombro.",
            "mindMuscle": {
              "title": "Pectoral Libre en Estiramiento",
              "internalCue": "Siente cómo las fibras del pecho se alargan en el fondo del banco.",
              "externalCue": "Abre los brazos como alas y luego condúcelos al centro contrayendo el pecho.",
              "eccentricCue": "Baja en 3 segundos completos con caja torácica inflada y orgullosa."
            },
            "searchQuery": "Aperturas con mancuernas en banco plano tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Pectoral Mayor (Aislamiento y Aducción Horizontal)",
          "internalCue": "No pienses en juntar las manos: piensa en intentar tocar la cara interna de ambos codos frente a tu corazón.",
          "externalCue": "Imagina que abrazas el tronco de una secoya gigante manteniendo los hombros pegados atrás.",
          "eccentricCue": "Abre los brazos en 3 segundos sintiendo el estiramiento máximo de las fibras pectorales hasta la horizontal."
        }
      },
      {
        "id": "d1_e5",
        "name": "Elevaciones Laterales en Máquina",
        "muscleGroup": "Hombro (Deltoides Lateral)",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "El eje de rotación de la máquina debe coincidir con la articulación glenohumeral (hombro). Almohadillas apoyadas en el tercio distal del brazo (justo arriba del codo). Torso ligeramente adelantado (10°) para alinear el deltoides lateral en el plano escapular. Pausa de 1s arriba; parciales abajo al fallar.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "machine lateral raise deltoid isolation",
        "equivalents": [
          {
            "id": "d1_e5_eq1",
            "name": "Elevaciones Laterales en Polea Baja a una mano",
            "desc": "Tensión continua desde el inicio.",
            "ratio": 0.6,
            "biomechanics": "Polea a la altura de la rodilla o muñeca. Cable pasando por detrás del torso. Agarre con una mano mientras la otra sostiene el poste para estabilidad total.",
            "mindMuscle": {
              "title": "Deltoides Lateral Unilateral en Polea",
              "internalCue": "Siente cómo el deltoides se activa desde el grado cero gracias a la tensión oblicua del cable.",
              "externalCue": "Lanza la mano hacia la esquina lejana de la sala manteniendo el meñique ligeramente arriba.",
              "eccentricCue": "Desciende en 3 segundos controlados sintiendo la resistencia continua del cable."
            },
            "searchQuery": "Elevaciones Laterales en Polea Baja a una mano tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d1_e5_eq2",
            "name": "Elevaciones con mancuernas recostado de lado en banco a 30°",
            "desc": "Sobrecarga en ángulo estirado.",
            "ratio": 0.7,
            "biomechanics": "Acostado de costado sobre un banco inclinado a 30-45°. El brazo libre sostiene la mancuerna. Esta inclinación sobrecarga el tercio inicial del recorrido (fase elongada), donde la mancuerna de pie no tiene palanca.",
            "mindMuscle": {
              "title": "Deltoides Lateral en Fase Elongada",
              "internalCue": "Inicia la contracción desde el fondo sintiendo el deltoides en tensión máxima.",
              "externalCue": "Eleva la mancuerna en un semicírculo perfecto hasta la línea perpendicular al suelo.",
              "eccentricCue": "Baja muy lento (3s) sintiendo cómo el músculo frena la gravedad."
            },
            "searchQuery": "Elevaciones con mancuernas recostado de lado en banco a 30° tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Deltoides Lateral (Amplitud V-Taper)",
          "internalCue": "Lidera la elevación empujando desde los codos, no desde las manos. Mantén el cuello relajado y los trapecios deprimidos.",
          "externalCue": "Imagina que empujas las almohadillas hacia las paredes laterales de la habitación, lo más lejos posible de tu cuerpo.",
          "eccentricCue": "Frena la bajada en 2 a 3 segundos resistiendo el peso antes de que las placas toquen el tope."
        }
      },
      {
        "id": "d1_e6",
        "name": "Extensión de Tríceps Copa Sobre la Cabeza en Polea (Cuerda)",
        "muscleGroup": "Tríceps (Cabeza Larga en Estiramiento)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea fijada a media altura o alta. Colócate de espaldas con un paso al frente para estabilidad en zancada. Torso a 45°. Codos flexionados y apuntando hacia adelante/arriba junto a las sienes. La posición con el brazo sobre la cabeza coloca la cabeza larga del tríceps en estiramiento máximo (insuficiencia activa disminuida).",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "overhead cable rope tricep extension long head stretch",
        "equivalents": [
          {
            "id": "d1_e6_eq1",
            "name": "Extensión de Tríceps en Máquina sentado",
            "desc": "Recorrido guiado con apoyo de codos.",
            "ratio": 1,
            "biomechanics": "Polea a la altura del hombro opuesto. Agarre del cable sin maneral o con tope de bola cruzando el brazo detrás de la cabeza como desenfundando una espada katana.",
            "mindMuscle": {
              "title": "Cabeza Larga Unilateral Katana",
              "internalCue": "Aísla la cabeza larga sin ninguna compensación de hombro.",
              "externalCue": "Extiende el codo en diagonal siguiendo la línea natural de la escápula.",
              "eccentricCue": "Baja en 3 segundos hasta máxima flexión detrás del cuello."
            },
            "searchQuery": "Extensión de Tríceps en Máquina sentado tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d1_e6_eq2",
            "name": "French Press con mancuerna a dos manos",
            "desc": "Variante clásica con mancuerna sobre cabeza.",
            "ratio": 0.5,
            "biomechanics": "Banco a 30-45°. Dos mancuernas neutras. Los codos se mantienen inclinados hacia atrás a 60° (no verticales a 90°) para mantener tensión continua en el punto de bloqueo.",
            "mindMuscle": {
              "title": "Press Francés Inclinado Libre",
              "internalCue": "Siente la cabeza larga del tríceps alargarse hacia atrás en cada bajada.",
              "externalCue": "Extiende los antebrazos hacia arriba y atrás en arco.",
              "eccentricCue": "Baja las mancuernas a los lados de la cabeza en 3 segundos sin abrir los codos."
            },
            "searchQuery": "French Press con mancuerna a dos manos tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Tríceps (Cabeza Larga en Estiramiento Máximo)",
          "internalCue": "Fija los codos como bisagras inmóviles. Extiende los antebrazos separando los cabos de la cuerda y apretando la parte posterior del brazo.",
          "externalCue": "Imagina empujar los extremos de la cuerda hacia las esquinas superiores frente a ti.",
          "eccentricCue": "Permite que la cuerda viaje detrás de tu cabeza en 3 segundos sintiendo el estiramiento profundo en la axila."
        }
      },
      {
        "id": "d1_e7",
        "name": "Extensión de Tríceps en Polea (Pushdown con barra recta o V)",
        "muscleGroup": "Tríceps (Cabeza Lateral y Medial)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea alta con barra recta o en V. Codos pegados a los costados del torso y ligeramente adelantados. Hombros deprimidos y caja torácica firme. Extensión completa del codo con bloqueo articular controlado sin balancear el torso.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable triceps pushdown straight bar technique",
        "equivalents": [
          {
            "id": "d1_e7_eq1",
            "name": "Pushdown con cuerda",
            "desc": "Separación lateral en contracción final.",
            "ratio": 0.9,
            "biomechanics": "Polea alta con cuerda doble. Al extender, separa activamente los cabos hacia los costados de las caderas con pronación de muñeca.",
            "mindMuscle": {
              "title": "Cabeza Lateral en Pronación Forzada",
              "internalCue": "Abre las manos al fondo sintiendo la cabeza lateral del tríceps arder.",
              "externalCue": "Separa los extremos de la cuerda hacia las paredes laterales.",
              "eccentricCue": "Controla el retorno de la cuerda hasta el esternón en 2 a 3 segundos."
            },
            "searchQuery": "Pushdown con cuerda tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d1_e7_eq2",
            "name": "Fondos en máquina asistida (Dips)",
            "desc": "Gran sobrecarga en empuje de tríceps.",
            "ratio": 1.2,
            "biomechanics": "Barras paralelas estrechas. Torso completamente vertical (no inclinado adelante para no activar pecho). Codos pegados al cuerpo bajando hasta 90°.",
            "mindMuscle": {
              "title": "Tríceps Compuesto en Paralelas",
              "internalCue": "Empuja con la base de la palma extendiendo los brazos con potencia pura de tríceps.",
              "externalCue": "Imagina hundir las barras en el suelo para elevar tu cuerpo.",
              "eccentricCue": "Baja en 3 segundos sintiendo el estiramiento del tríceps sin dejar caer los hombros."
            },
            "searchQuery": "Fondos en máquina asistida (Dips) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Tríceps (Cabezas Lateral y Medial)",
          "internalCue": "Contrae al máximo la cara externa del brazo durante 1 segundo completo en la posición baja.",
          "externalCue": "Imagina empujar la barra contra tus muslos como si quisieras romper una tabla debajo de ti.",
          "eccentricCue": "Sube la barra solo hasta la altura de los pezones en 2 a 3 segundos sin despegar los codos del costado."
        }
      },
      {
        "id": "d1_e8",
        "name": "Vacuum Abdominal (Transverso)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "15-20 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "De pie, manos apoyadas en rodillas o barra. Exhala todo el aire residual de los pulmones. Sin inhalar, expande la caja torácica aspirando el ombligo hacia la columna vertebral y hacia arriba bajo las costillas. Mantén 15 a 20 segundos en apnea espiratoria.",
        "warmup": "🔥 No ocupa (solo 2 exhalaciones profundas previas).",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d1_e8_eq1",
            "name": "Plancha abdominal isométrica convencional (45 s)",
            "desc": "Estabilidad y tensión global del core.",
            "ratio": 1,
            "biomechanics": "Tumbado supino, retroversión pélvica pegando la zona lumbar al suelo, piernas y brazos extendidos flotando a 15 cm.",
            "mindMuscle": {
              "title": "Hollow Body Isométrico",
              "internalCue": "Aplasta el suelo con la espalda baja sin dejar pasar ni una hoja de papel.",
              "externalCue": "Extiende las puntas de los pies y dedos de las manos en direcciones opuestas.",
              "eccentricCue": "Mantén la tensión continua durante todo el tiempo prescrito."
            },
            "searchQuery": "Plancha abdominal isométrica convencional (45 s) tecnica biomecanica",
            "warmup": "🔥 No ocupa (solo 2 exhalaciones profundas previas)."
          }
        ],
        "mindMuscle": {
          "title": "Músculo Transverso Abdominal & Cinturón Natural",
          "internalCue": "Imagina que abrochas un corsé interno extremadamente ajustado alrededor de tus órganos.",
          "externalCue": "Pega el ombligo directamente contra la cara interna de tu columna vertebral.",
          "eccentricCue": "Al terminar los segundos de retención, relaja lentamente tomando aire nasal controlado."
        }
      },
      {
        "id": "d1_e9",
        "name": "Cardio Aeróbico en Zona 2",
        "muscleGroup": "Cardiovascular (Zona 2)",
        "sets": 1,
        "reps": "30 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Ritmo cardíaco sostenido entre 60% y 70% de la frecuencia cardíaca máxima (esfuerzo donde puedes mantener una conversación hablada sin jadear). Optimización del flujo sanguíneo, reciclaje de lactato y depuración metabólica sin fatiga periférica muscular.",
        "warmup": "🔥 3 minutos progresivos a ritmo suave.",
        "searchQuery": "zone 2 cardio fat oxidation incline walk",
        "equivalents": [
          {
            "id": "d1_e9_eq1",
            "name": "Caminadora en Inclinación",
            "desc": "Bajo impacto articular y alto gasto calórico.",
            "ratio": 1,
            "biomechanics": "Caminadora a 3-4.5 km/h con inclinación del 8-12%. Cero impacto articular en rodillas, activación sostenida de gemelos y glúteos.",
            "mindMuscle": {
              "title": "Caminata Inclinada Zona 2",
              "internalCue": "Camina erguido sin sujetar las barandillas para activar la musculatura estabilizadora.",
              "externalCue": "Empuja la cinta con cada zancada manteniendo cadencia uniforme.",
              "eccentricCue": "Controla el ritmo respiratorio continuo."
            },
            "searchQuery": "Caminadora en Inclinación tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos a ritmo suave."
          },
          {
            "id": "d1_e9_eq2",
            "name": "Bicicleta Estática",
            "desc": "Cadencia fluida sin estrés plantar.",
            "ratio": 1,
            "biomechanics": "Bicicleta estática con resistencia moderada a 80-90 RPM. Cadencia constante con frecuencia cardíaca estable.",
            "mindMuscle": {
              "title": "Ciclismo Zona 2",
              "internalCue": "Pedaleo circular fluido empujando y halando suavemente los pedales.",
              "externalCue": "Mantén las revoluciones fijas en la pantalla.",
              "eccentricCue": "Respiración rítmica y controlada."
            },
            "searchQuery": "Bicicleta Estática tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos a ritmo suave."
          }
        ],
        "mindMuscle": {
          "title": "Capacidad Mitocondrial y Zona 2",
          "internalCue": "Mantén una zancada o pedaleo suave y rítmico con respiración nasal relajada.",
          "externalCue": "Mantén el ritmo del cronómetro sin aceleraciones bruscas.",
          "eccentricCue": "Disfruta de la oxigenación muscular para acelerar la recuperación del entrenamiento de pesas."
        }
      }
    ]
  },
  {
    "id": "d2",
    "dayNumber": 2,
    "name": "Martes: Piernas 1 (Enfoque Cuádriceps y Glúteo)",
    "type": "workout",
    "focus": "Desarrollo masivo del tren inferior y cuádriceps mediante flexión profunda de rodilla con máxima estabilidad articular.",
    "exercises": [
      {
        "id": "d2_e1",
        "name": "Sentadilla en Máquina Hack (Hack Squat)",
        "muscleGroup": "Cuádriceps & Glúteo",
        "loadFamily": "Familia Sentadilla Hack",
        "sets": 3,
        "reps": "8-10",
        "restTime": "150-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Pies en la parte media-baja de la plataforma, separados al ancho de caderas con ligera rotación externa (15°). Espalda lumbar y pelvis firmemente pegadas al respaldo. Permite que las rodillas viajen hacia adelante sobre las puntas de los pies para maximizar la flexión de rodilla y elongación de cuádriceps. IAP: Inhala profundo expandiendo la faja abdominal antes de descender, mantén la presión intra-abdominal conteniendo el aire durante la bajada (3s) y no rebotes en el fondo. Exhala superando la mitad de la subida.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de carga x 8 reps fluidas.\n• Serie 2: 75% de carga x 3 reps con cadencia controlada.",
        "searchQuery": "hack squat machine quad focus deep knee flexion",
        "equivalents": [
          {
            "id": "d2_e1_eq1",
            "name": "V-Squat Machine",
            "desc": "Excelente distribución de carga lumbar.",
            "ratio": 1,
            "biomechanics": "V-Squat mirando hacia afuera con respaldo acolchado. Curva de resistencia más suave en el fondo. Mayor profundidad de flexión de rodilla con menor compresión en la rótula.",
            "mindMuscle": {
              "title": "Cuádriceps en V-Squat Guiada",
              "internalCue": "Mantén el torso erguido apoyado al respaldo y flexiona las rodillas profundamente.",
              "externalCue": "Empuja la máquina hacia arriba con los muslos ardiendo.",
              "eccentricCue": "Baja en 3 segundos hasta que los femorales toquen las pantorrillas."
            },
            "searchQuery": "V-Squat Machine tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de carga x 8 reps fluidas.\n• Serie 2: 75% de carga x 3 reps con cadencia controlada."
          },
          {
            "id": "d2_e1_eq2",
            "name": "Sentadilla en Smith con talones sobre disco",
            "desc": "Estabilidad guiada con cuádriceps aislado.",
            "ratio": 0.9,
            "biomechanics": "Pies sobre cuña o disco elevador de talón para eliminar la restricción de dorsiflexión de tobillo. Mancuerna sostenida contra el pecho. Torso vertical.",
            "mindMuscle": {
              "title": "Sentadilla Goblet con Talones Elevados",
              "internalCue": "Siente la activación pura de la gota del cuádriceps (vasto medial).",
              "externalCue": "Baja la pelvis como un pistón entre los talones.",
              "eccentricCue": "Desciende en 3 segundos manteniendo el torso perpendicular al suelo."
            },
            "searchQuery": "Sentadilla en Smith con talones sobre disco tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de carga x 8 reps fluidas.\n• Serie 2: 75% de carga x 3 reps con cadencia controlada."
          }
        ],
        "mindMuscle": {
          "title": "Cuádriceps (Vasto Externo, Medial y Recto Femoral)",
          "internalCue": "Siente cómo las rodillas se flexionan completamente cargando todo el peso sobre los cuádriceps, no sobre la zona lumbar.",
          "externalCue": "Imagina empujar la plataforma lejos de ti a través de los talones y el tercio medio del pie sin bloquear las rodillas arriba.",
          "eccentricCue": "Desciende en 3 segundos lentos sintiendo cómo los muslos se estiran como resortes comprimidos."
        }
      },
      {
        "id": "d2_e2",
        "name": "Prensa de Piernas (Posición Central)",
        "muscleGroup": "Cuádriceps & Tren Inferior",
        "loadFamily": "Familia Prensa de Piernas",
        "sets": 3,
        "reps": "10-12",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "Pies colocados en el centro de la plataforma al ancho de hombros. Espalda y sacro completamente pegados al asiento; NUNCA permitas retroversión pélvica ('butt wink') al fondo. Baja hasta que los muslos queden a unos 80-90° respecto al torso. IAP: Respira hondo antes de liberar la carga, mantén el torso inflado y las manos sujetando firmemente los mangos laterales para anclar la pelvis.",
        "warmup": "🔥 Sí (1 serie): 70% de la carga x 5 reps para ajustar posición de pies.",
        "searchQuery": "leg press 45 degree proper feet placement quad focus",
        "equivalents": [
          {
            "id": "d2_e2_eq1",
            "name": "Prensa Horizontal en cable",
            "desc": "Tensión lineal continua.",
            "ratio": 0.8,
            "biomechanics": "Prensa de discos a 45°. El vector de carga tiene componente vertical y horizontal. Máxima capacidad de sobrecarga en masa.",
            "mindMuscle": {
              "title": "Cuádriceps en Prensa Inclinada 45°",
              "internalCue": "Concéntrate en la tensión continua en los vastos sin descansar en el punto alto.",
              "externalCue": "Lanza la plataforma hacia arriba de forma suave y controlada.",
              "eccentricCue": "Baja en 3 segundos sintiendo la compresión muscular controlada."
            },
            "searchQuery": "Prensa Horizontal en cable tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 70% de la carga x 5 reps para ajustar posición de pies."
          },
          {
            "id": "d2_e2_eq2",
            "name": "Hack invertida",
            "desc": "Gran demanda de extensión de cadera y rodilla.",
            "ratio": 1,
            "biomechanics": "Prensa horizontal con torre de placas. Menor carga compresiva espinal, ideal para altas repeticiones al fallo metabólico.",
            "mindMuscle": {
              "title": "Prensa Horizontal de Tensión Continua",
              "internalCue": "Siente el ardor en la parte frontal del muslo repetición tras repetición.",
              "externalCue": "Empuja el carro alejándote del reposapiés.",
              "eccentricCue": "Regresa en 2 a 3 segundos antes de que las placas toquen el soporte."
            },
            "searchQuery": "Hack invertida tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 70% de la carga x 5 reps para ajustar posición de pies."
          }
        ],
        "mindMuscle": {
          "title": "Cuádriceps & Glúteo Mayor en Prensa Central",
          "internalCue": "Siente la fuerza distribuida en todo el pie. Al subir, piensa en extender las rodillas usando la musculatura anterior del muslo.",
          "externalCue": "Empuja el trineo como si intentaras mover una pared pesada, parando 2 cm antes del bloqueo articular.",
          "eccentricCue": "Resiste el peso en 3 segundos sintiendo el estiramiento profundo del cuádriceps sin levantar los glúteos del asiento."
        }
      },
      {
        "id": "d2_e3",
        "name": "Extensión de Cuádriceps (Leg Extension)",
        "muscleGroup": "Cuádriceps (Aislamiento Recto Femoral)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "El eje de giro de la máquina debe quedar alineado milimétricamente con el centro de la articulación de la rodilla. Almohadilla apoyada en el empeine/tobillo bajo. Sujeta con fuerza los mangos laterales para evitar que los glúteos se levanten del asiento al patear. Extensión completa arriba con pausa de 1 segundo; al fallar concéntrico, ejecuta 3 a 5 parciales en el fondo estirado.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "leg extension machine lengthened partials quad hypertrophy",
        "equivalents": [
          {
            "id": "d2_e3_eq1",
            "name": "Sissy Squat en soporte",
            "desc": "Tensión extrema en máxima elongación del recto femoral.",
            "ratio": 0.4,
            "biomechanics": "Pies fijados en banco sissy, torso y muslos formando una línea recta. Descenso echando el cuerpo hacia atrás mediante flexión pura de rodilla. Estiramiento extremo del recto femoral.",
            "mindMuscle": {
              "title": "Recto Femoral en Sissy Squat",
              "internalCue": "Siente el estiramiento violento y controlado en toda la longitud del muslo.",
              "externalCue": "Empuja los empeines contra los rodillos para volver a la vertical.",
              "eccentricCue": "Baja en 3 segundos manteniendo la cadera bloqueada en extensión."
            },
            "searchQuery": "Sissy Squat en soporte tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d2_e3_eq2",
            "name": "Extensiones unilaterales en máquina",
            "desc": "Equilibrio bilateral de cuádriceps.",
            "ratio": 0.45,
            "biomechanics": "Sentado en banco alto con tobillera conectada a polea baja. Tensión constante durante todo el arco de extensión.",
            "mindMuscle": {
              "title": "Extensión en Polea con Tensión Continua",
              "internalCue": "Aísla el vasto interno apretando en el pico concéntrico.",
              "externalCue": "Extiende la pierna hacia adelante contra el cable.",
              "eccentricCue": "Resiste el tirón del cable en 3 segundos."
            },
            "searchQuery": "Extensiones unilaterales en máquina tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Cuádriceps Aislado (Recto Femoral en Acortamiento)",
          "internalCue": "Aprieta la parte superior del muslo con fuerza brutal al llegar arriba. Mantén los tobillos en flexión neutra.",
          "externalCue": "Patea la almohadilla hacia el techo como si quisieras estirar la pierna en una línea recta perfecta.",
          "eccentricCue": "Frena la caída en 3 segundos sintiendo cómo el cuádriceps resiste toda la bajada."
        }
      },
      {
        "id": "d2_e4",
        "name": "Prensa Unilateral a 1 Pierna (Pie Alto)",
        "muscleGroup": "Glúteo Mayor & Isquios",
        "isUnilateral": true,
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Un pie colocado en la esquina superior de la plataforma. La pierna contraria relajada fuera de la máquina. La posición de pie alto maximiza la flexión de cadera y el reclutamiento del glúteo mayor y vasto externo. Desciende profundo hasta que la rodilla pase rozando el torso lateral sin rotar la pelvis.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "single leg press foot high glute focus",
        "equivalents": [
          {
            "id": "d2_e4_eq1",
            "name": "Sentadilla Búlgara en Multipower (Smith)",
            "desc": "Estabilidad vertical y máxima sobrecarga de glúteo.",
            "ratio": 0.6,
            "biomechanics": "Pie trasero apoyado sobre banco a la altura de la rodilla. Mancuerna en la mano contraria a la pierna delantera. Torso inclinado a 20° para mayor activación de glúteo.",
            "mindMuscle": {
              "title": "Sentadilla Búlgara para Glúteo",
              "internalCue": "Hunde la cadera hacia abajo y atrás sintiendo el glúteo estirarse.",
              "externalCue": "Empuja el suelo con el talón delantero para reincorporarte.",
              "eccentricCue": "Desciende en 3 segundos sin dejar caer el torso sobre el muslo."
            },
            "searchQuery": "Sentadilla Búlgara en Multipower (Smith) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d2_e4_eq2",
            "name": "Zancadas estáticas con mancuernas",
            "desc": "Trabajo dinámico unilateral.",
            "ratio": 0.5,
            "biomechanics": "Cajón a la altura de la rótula. Pie de trabajo apoyado arriba. Sube impulsándote exclusivamente con la pierna del cajón sin dar salto con la pierna del suelo.",
            "mindMuscle": {
              "title": "Step-Up Estricto en Cajón",
              "internalCue": "Aísla la pierna alta contrayendo el glúteo al llegar a la cima.",
              "externalCue": "Pisa con fuerza el cajón elevando tu centro de gravedad.",
              "eccentricCue": "Baja en 3 segundos como si pisaras una superficie frágil."
            },
            "searchQuery": "Zancadas estáticas con mancuernas tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Glúteo Mayor y Cuádriceps Unilateral",
          "internalCue": "Siente el glúteo de la pierna activa estirarse profundamente en el fondo del asiento.",
          "externalCue": "Empuja la plataforma desde el talón como si quisieras traspasar el metal.",
          "eccentricCue": "Baja en 3 segundos controlando que la rodilla viaje alineada con el segundo dedo del pie."
        }
      },
      {
        "id": "d2_e5",
        "name": "Aductores en Máquina (Cerrar Cadera)",
        "muscleGroup": "Aductores (Muslo Interno & Estabilidad)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Sentado en máquina con la espalda erguida apoyada al cojín. Ajusta los brazos de la máquina en máxima apertura inicial para estirar los aductores. Cierra las piernas con fuerza uniforme y mantén 1 segundo de contracción isométrica al centro. IAP: Respira con normalidad apretando el transverso.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "hip adductor machine inner thigh growth",
        "equivalents": [
          {
            "id": "d2_e5_eq1",
            "name": "Aducción de cadera en polea baja con tobillera",
            "desc": "Tensión dinámica con cable.",
            "ratio": 0.5,
            "biomechanics": "De pie de costado a la polea baja con tobillera en la pierna interna. Cruza la pierna por delante del cuerpo en aducción controlada.",
            "mindMuscle": {
              "title": "Aductores en Polea Baja",
              "internalCue": "Conduce el movimiento desde la ingle y muslo interno.",
              "externalCue": "Barre el suelo con el pie hacia el lado opuesto.",
              "eccentricCue": "Resiste el regreso del cable en 3 segundos."
            },
            "searchQuery": "Aducción de cadera en polea baja con tobillera tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Aductor Mayor, Medio y Corto (Muslo Interno)",
          "internalCue": "Siente cómo la cara interna de los muslos se activa para juntar las rodillas contra la resistencia.",
          "externalCue": "Imagina que intentas aplastar un balón de fútbol entre tus rodillas.",
          "eccentricCue": "Abre las piernas de forma lenta en 3 segundos sintiendo el estiramiento profundo del aductor."
        }
      },
      {
        "id": "d2_e6",
        "name": "Abductores en Máquina (Abrir Cadera)",
        "muscleGroup": "Glúteo Medio & Superior",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Sentado en máquina con la pelvis bien anclada al respaldo. Almohadillas en la cara externa de las rodillas. Abre las piernas al máximo rango posible y sostén 1 segundo la contracción. Para mayor activación de glúteo medio, inclina el torso 15° hacia adelante.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "hip abductor machine glute medius lean forward",
        "equivalents": [
          {
            "id": "d2_e6_eq1",
            "name": "Abducción de cadera en polea baja con tobillera",
            "desc": "Aislamiento libre con cable.",
            "ratio": 0.5,
            "biomechanics": "De pie con tobillera en polea baja. Abducción lateral de cadera manteniendo el torso estable y la pelvis neutra.",
            "mindMuscle": {
              "title": "Glúteo Medio en Polea Unilateral",
              "internalCue": "Eleva la pierna sintiendo el costado del glúteo arder.",
              "externalCue": "Patea en diagonal hacia atrás y afuera.",
              "eccentricCue": "Baja la pierna en 3 segundos conteniendo la tracción del cable."
            },
            "searchQuery": "Abducción de cadera en polea baja con tobillera tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Glúteo Medio y Menor (Estabilidad Pélvica)",
          "internalCue": "Siente la contracción en la parte lateral y superior de los glúteos.",
          "externalCue": "Empuja las rodillas hacia afuera como si quisieras abrir una compuerta pesada.",
          "eccentricCue": "Regresa en 3 segundos sin dejar que las placas de peso se golpeen al centro."
        }
      },
      {
        "id": "d2_e7",
        "name": "Elevación de Pantorrillas (Rotary Calf o Sentado)",
        "muscleGroup": "Pantorrillas (Gastrocnemio & Sóleo)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Apoyo exclusivo en las almohadillas metatarsianas de los pies sobre el borde de la plataforma. Rodillas con microflexión fija (si es sentado, rodillas a 90° enfatizando sóleo; si es de pie, rodillas extendidas enfatizando gastrocnemio). Pausa obligatoria de 2 segundos en máximo estiramiento abajo (elimina el rebote del tendón de Aquiles) y elevación concéntrica potente con 1s de contracción arriba.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "rotary calf machine stretch pause calf growth",
        "equivalents": [
          {
            "id": "d2_e7_eq1",
            "name": "Elevación de pantorrillas en la Prensa de piernas",
            "desc": "Apoyo lumbar cómodo y sobrecarga.",
            "ratio": 1.2,
            "biomechanics": "De pie con hombreras de Smith o máquina de gemelos de pie. Rodillas bloqueadas pero no hiperextendidas. Mayor énfasis en gastrocnemio.",
            "mindMuscle": {
              "title": "Gastrocnemio de Pie en Smith",
              "internalCue": "Siente las dos cabezas de la pantorrilla compactarse como piedras arriba.",
              "externalCue": "Elévate sobre las puntas empujando el suelo con los metatarsos.",
              "eccentricCue": "Baja los talones 3 segundos hasta el máximo estiramiento con pausa de 2s abajo."
            },
            "searchQuery": "Elevación de pantorrillas en la Prensa de piernas tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d2_e7_eq2",
            "name": "Elevación en Smith de pie sobre plataforma",
            "desc": "Carga axial vertical completa.",
            "ratio": 1,
            "biomechanics": "Puntas de los pies en el borde inferior de la prensa de piernas. Seguro quitado con rodillas ligeramente flexionadas. Empuje de flexión plantar.",
            "mindMuscle": {
              "title": "Pantorrilla en Prensa de Piernas",
              "internalCue": "Control estricto de los tobillos evitando que se tuerzan hacia adentro o afuera.",
              "externalCue": "Empuja la plataforma con los dedos de los pies.",
              "eccentricCue": "Deja que el peso baje los talones en 3 segundos sin soltar la tensión."
            },
            "searchQuery": "Elevación en Smith de pie sobre plataforma tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Tríceps Sural (Sóleo y Gastrocnemio)",
          "internalCue": "En el fondo, siente cómo el tendón de Aquiles se estira y la pantorrilla se alarga. Al subir, elévate sobre el dedo gordo del pie.",
          "externalCue": "Imagina que intentas tocar el techo con la cabeza impulsándote solo con las puntas de los pies.",
          "eccentricCue": "Desciende en 3 segundos muy lentos hasta sentir el estiramiento máximo del talón hacia el suelo."
        }
      },
      {
        "id": "d2_e8",
        "name": "Plancha Abdominal Isométrica (Hardstyle Plank)",
        "muscleGroup": "Core (Anti-Extensión & IAP)",
        "sets": 3,
        "reps": "45-60 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "Posición de plancha sobre antebrazos y puntas de los pies. Codos justo debajo de los hombros. Tensión 'Hardstyle': aprieta cuádriceps, glúteos y puños simultáneamente, y tracciona isométricamente los codos hacia los pies y los pies hacia los codos sin moverlos del suelo. Respiración superficial rápida manteniendo el abdomen de acero.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "hardstyle plank isometric core bracing",
        "equivalents": [
          {
            "id": "d2_e8_eq1",
            "name": "Ab Wheel (Rueda abdominal) controlada",
            "desc": "Anti-extensión dinámica avanzada.",
            "ratio": 1,
            "biomechanics": "De rodillas con rueda abdominal. Rueda hacia adelante manteniendo ligera curvatura dorsal y pelvis en retroversión. Regresa tirando desde el abdomen, no desde los dorsales.",
            "mindMuscle": {
              "title": "Rueda Abdominal (Ab Wheel Rollout)",
              "internalCue": "Siente la pared abdominal alargarse bajo carga y contraerse para iniciar la vuelta.",
              "externalCue": "Rueda hacia adelante lo más lejos posible sin que la zona lumbar se arquee.",
              "eccentricCue": "Extiende el cuerpo en 3 segundos controlados."
            },
            "searchQuery": "Ab Wheel (Rueda abdominal) controlada tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Pared Abdominal Anterior y Estabilidad de Core",
          "internalCue": "Pega las costillas inferiores hacia la pelvis contrayendo el recto abdominal.",
          "externalCue": "Imagina que alguien intentará empujarte y tu cuerpo debe ser un bloque de concreto sólido.",
          "eccentricCue": "Sostén la tensión máxima en cada segundo sin que caiga la cadera."
        }
      }
    ]
  },
  {
    "id": "d3",
    "dayNumber": 3,
    "name": "Miércoles: Jalón 1 (Amplitud Dorsal V-Taper y Bíceps)",
    "type": "workout",
    "focus": "Construcción de amplitud dorsal V-Taper y sobrecarga en estiramiento humeral para bíceps.",
    "exercises": [
      {
        "id": "d3_e1",
        "name": "Jalón al Pecho en Polea (Agarre Ancho Pronado)",
        "muscleGroup": "Espalda (Amplitud Dorsal V-Taper)",
        "loadFamily": "Familia Jalón Vertical Dorsal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "Agarre a 1.5 anchos de hombros con pulgares montados (agarre en gancho o thumbless para reducir la activación de antebrazos). Muslos firmemente asegurados bajo los rodillos. Torso con ligera inclinación posterior (10-15°). Inicia la tracción deprimiendo las escápulas y tirando de los codos verticalmente hacia abajo y hacia adentro, llevando la barra a la parte superior del esternón. IAP: Inhala al estirar los brazos arriba, contén el aire mientras desciendes los codos y exhala al rozar la clavícula.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps (lubricación escapulohumeral).\n• Serie 2: 75% de la carga x 4 reps técnicas.",
        "searchQuery": "lat pulldown wide grip lats focus elbow drive",
        "equivalents": [
          {
            "id": "d3_e1_eq1",
            "name": "Dominadas pronadas asistidas/lastradas",
            "desc": "Fuerza calisténica vertical.",
            "ratio": 0.9,
            "biomechanics": "Barra fija con agarre algo más amplio que los hombros. Depresión escapular antes de flexionar los brazos. Pecho erguido buscando la barra.",
            "mindMuscle": {
              "title": "Dorsal Ancho en Cadena Cinética Cerrada",
              "internalCue": "Piensa en clavar los codos contra las costillas.",
              "externalCue": "Tracciona el suelo hacia tu cuerpo para elevar tu centro de masa.",
              "eccentricCue": "Desciende en 3 segundos completos hasta estiramiento escapular total."
            },
            "searchQuery": "Dominadas pronadas asistidas/lastradas tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps (lubricación escapulohumeral).\n• Serie 2: 75% de la carga x 4 reps técnicas."
          },
          {
            "id": "d3_e1_eq2",
            "name": "Jalón unilateral en polea",
            "desc": "Alineación en el plano sagital del dorsal.",
            "ratio": 0.5,
            "biomechanics": "Brazos convergentes o divergentes independientes. Trayectoria natural que respeta la articulación del hombro sin forzar rotación interna.",
            "mindMuscle": {
              "title": "Dorsal Ancho Unilateral Guiado",
              "internalCue": "Siente el dorsal de cada lado contraerse independientemente sin compensaciones.",
              "externalCue": "Hala los manerales hacia los laterales del torso.",
              "eccentricCue": "Controla la subida en 3 segundos sintiendo el estiramiento escapular."
            },
            "searchQuery": "Jalón unilateral en polea tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps (lubricación escapulohumeral).\n• Serie 2: 75% de la carga x 4 reps técnicas."
          }
        ],
        "mindMuscle": {
          "title": "Dorsal Ancho & Redondo Mayor (Amplitud V-Taper)",
          "internalCue": "Visualiza tus manos como meros ganchos pasivos. Inicia el movimiento llevando los codos directamente hacia tus bolsillos traseros.",
          "externalCue": "Imagina que intentas doblar la barra sobre tu cabeza expandiendo el pecho hacia el cielo.",
          "eccentricCue": "Deja que el peso te estire hacia arriba en 3 segundos lentos sintiendo la tracción desde la axila hasta la cadera."
        }
      },
      {
        "id": "d3_e2",
        "name": "Remo Compuesto en Máquina (Apoyo al Pecho)",
        "muscleGroup": "Espalda (Densidad Dorsal & Romboides)",
        "loadFamily": "Familia Remo Horizontal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "Asiento ajustado de modo que el cojín de pecho quede a nivel del esternón, permitiendo extender los brazos sin perder el apoyo torácico. El apoyo elimina la compresión en la zona lumbar, permitiendo aislar la musculatura media de la espalda. Agarre neutro o semi-pronado a 45°. Tira con los codos hacia atrás juntando las escápulas al final con pausa de 1 segundo.",
        "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
        "searchQuery": "chest supported row machine mid back density",
        "equivalents": [
          {
            "id": "d3_e2_eq1",
            "name": "Remo con Barra T con apoyo torácico",
            "desc": "Carga pesada con seguridad lumbar total.",
            "ratio": 1,
            "biomechanics": "Banco inclinado con barra T. Pies firmes. Tracción horizontal sin usar impulso de piernas ni de cadera.",
            "mindMuscle": {
              "title": "Densidad de Espalda en Barra T",
              "internalCue": "Aprieta la musculatura periescapular al rozar el pecho con el maneral.",
              "externalCue": "Tira de los codos hacia el techo.",
              "eccentricCue": "Baja el peso en 3 segundos sintiendo el estiramiento de romboides."
            },
            "searchQuery": "Remo con Barra T con apoyo torácico tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps."
          },
          {
            "id": "d3_e2_eq2",
            "name": "Remo Gironda agarre neutro",
            "desc": "Tensión horizontal con cable.",
            "ratio": 1,
            "biomechanics": "Sentado en polea baja con barra de agarre neutro ancho. Torso erguido a 90°. Tracción al ombligo sin balanceo.",
            "mindMuscle": {
              "title": "Espalda Media en Polea Baja",
              "internalCue": "Mantén los hombros lejos de las orejas y contrae la espalda media.",
              "externalCue": "Tira del maneral hacia la boca del estómago.",
              "eccentricCue": "Extiende los brazos en 3 segundos manteniendo el torso inmóvil."
            },
            "searchQuery": "Remo Gironda agarre neutro tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps."
          }
        ],
        "mindMuscle": {
          "title": "Espalda Media, Romboides & Dorsal",
          "internalCue": "Pega el pecho contra el cojín y piensa en juntar las escápulas atrás como si quisieras apretar un lápiz entre ellas.",
          "externalCue": "Clava los codos contra la pared que está detrás de ti.",
          "eccentricCue": "Deja que las placas te lleven hacia adelante en 3 segundos permitiendo que las escápulas se separen suavemente."
        }
      },
      {
        "id": "d3_e3",
        "name": "Pull-Over en Polea Alta con Cuerda",
        "muscleGroup": "Espalda (Aislamiento Dorsal Ancho)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea alta con cuerda o barra recta. Da dos pasos atrás e inclina el torso hacia adelante a 45-60° con rodillas semiflexionadas y cadera en bisagra. Brazos casi extendidos con una microflexión fija en los codos (15°). Conduce las manos en un arco descendente amplio hacia los muslos sin doblar los codos.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable straight arm pullover lat isolation rope",
        "equivalents": [
          {
            "id": "d3_e3_eq1",
            "name": "Pull-over con mancuerna sobre banco",
            "desc": "Estiramiento torácico en banco plano.",
            "ratio": 0.5,
            "biomechanics": "Agarre a la anchura de los hombros con barra recta en polea alta. Mantiene la trayectoria rígida en un solo plano.",
            "mindMuscle": {
              "title": "Extensión Humeral con Barra en Polea",
              "internalCue": "Presiona la barra hacia abajo usando exclusivamente los dorsales.",
              "externalCue": "Dibuja un arco amplio desde arriba hasta tocar los muslos.",
              "eccentricCue": "Frena la subida en 3 segundos con la caja torácica firme."
            },
            "searchQuery": "Pull-over con mancuerna sobre banco tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d3_e3_eq2",
            "name": "Máquina de Pullover guiada",
            "desc": "Tensión uniforme guiada en todo el arco.",
            "ratio": 1.1,
            "biomechanics": "Apoyado transversalmente sobre un banco con escápulas en el cojín y cadera ligeramente baja. Mancuerna sostenida con ambas palmas bajo el plato superior.",
            "mindMuscle": {
              "title": "Pull-Over Libre en Estiramiento",
              "internalCue": "Siente cómo las costillas y el dorsal se abren en el fondo del arco.",
              "externalCue": "Lleva la mancuerna detrás de la cabeza y recupérala sobre el pecho.",
              "eccentricCue": "Desciende en 3 segundos lentos con codos semiflexionados."
            },
            "searchQuery": "Máquina de Pullover guiada tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Dorsal Ancho Aislado (Extensión Humeral Pura)",
          "internalCue": "Siente cómo los dorsales se tensan desde las axilas para barrer los brazos hacia abajo.",
          "externalCue": "Empuja la cuerda hacia abajo y hacia tus caderas como si barrieras el suelo con los nudillos.",
          "eccentricCue": "Deja que los brazos suban por encima de tu cabeza en 3 segundos sintiendo un estiramiento dorsal extremo."
        }
      },
      {
        "id": "d3_e4",
        "name": "Face Pulls en Polea Alta",
        "muscleGroup": "Hombro Posterior & Manguito Rotador",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea ajustada a la altura de los ojos o frente con cuerda doble. Sujeta la cuerda con agarre neutro o pulgares hacia atrás. Retrocede un paso. Tira de la cuerda hacia el puente de la nariz separando los cabos hacia las orejas con rotación externa de hombro simultánea. Pausa de 1 segundo atrás.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable face pull external rotation rear delt",
        "equivalents": [
          {
            "id": "d3_e4_eq1",
            "name": "Pájaros en Pec Deck Inverso",
            "desc": "Aislamiento guiado de deltoides posterior.",
            "ratio": 1,
            "biomechanics": "Sentado de frente a la máquina Pec Deck con pecho apoyado. Brazos casi rectos abriendo en cruz horizontal.",
            "mindMuscle": {
              "title": "Deltoides Posterior en Pec Deck Invertido",
              "internalCue": "Aísla la cara trasera del hombro sin apretar trapecios.",
              "externalCue": "Abre los brazos como alas hacia las paredes laterales.",
              "eccentricCue": "Controla el retorno en 3 segundos sin golpear las placas."
            },
            "searchQuery": "Pájaros en Pec Deck Inverso tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d3_e4_eq2",
            "name": "Reverse Cable Flyes",
            "desc": "Cruce posterior con cables a media altura.",
            "ratio": 0.8,
            "biomechanics": "Suspensión corporal con pies adelantados. Tracción hacia la frente abriendo los codos en rotación externa.",
            "mindMuscle": {
              "title": "Face Pulls en Peso Corporal",
              "internalCue": "Mantén el cuerpo en línea recta activando glúteos y deltoides posterior.",
              "externalCue": "Hala las anillas hacia tus sienes separando las manos.",
              "eccentricCue": "Desciende en 3 segundos manteniendo la tensión en el core."
            },
            "searchQuery": "Reverse Cable Flyes tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Deltoides Posterior & Rotadores Externos (Salud Escapular)",
          "internalCue": "Siente cómo la parte posterior de los hombros y los manguitos rotadores queman al rotar los antebrazos hacia atrás.",
          "externalCue": "Imagina hacer una doble pose de bíceps llevando los nudillos detrás de las orejas.",
          "eccentricCue": "Regresa la cuerda en 2 a 3 segundos controlados sin dejar que los hombros se encorven adelante."
        }
      },
      {
        "id": "d3_e5",
        "name": "Bayesian Cable Curl (Bíceps en Estiramiento Humeral)",
        "muscleGroup": "Bíceps (Estiramiento Humeral)",
        "isUnilateral": true,
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea baja a tu espalda con maneral individual. Da un paso al frente de modo que el brazo quede extendido detrás del torso (en hiperextensión de hombro, estirando la cabeza larga del bíceps). Con el codo bloqueado detrás de la cadera, flexiona el antebrazo sin adelantar el codo. Pausa de 1s arriba.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "bayesian cable curl behind back bicep stretch",
        "equivalents": [
          {
            "id": "d3_e5_eq1",
            "name": "Curl en banco inclinado a 60° con mancuernas (Incline DB Curl)",
            "desc": "Estiramiento humeral clásico con mancuernas.",
            "ratio": 0.5,
            "biomechanics": "Banco a 60°, espalda apoyada, brazos colgando perpendicularmente al suelo por detrás del torso. Supinación estricta de muñeca.",
            "mindMuscle": {
              "title": "Cabeza Larga en Banco Inclinado",
              "internalCue": "Inicia la contracción con el brazo completamente estirado y supina el meñique.",
              "externalCue": "Eleva las mancuernas hacia los hombros sin despegar la espalda del banco.",
              "eccentricCue": "Baja en 3 segundos hasta extensión completa del codo."
            },
            "searchQuery": "Curl en banco inclinado a 60° con mancuernas (Incline DB Curl) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Bíceps Braquial (Cabeza Larga en Estiramiento Humeral)",
          "internalCue": "Siente cómo el tendón del bíceps se alarga al máximo detrás de tu cuerpo antes de iniciar cada repetición.",
          "externalCue": "Curl hacia adelante y arriba manteniendo el codo anclado firmemente detrás del torso.",
          "eccentricCue": "Deja que el cable jale tu brazo hacia atrás en 3 segundos completos sintiendo el estiramiento profundo del bíceps."
        }
      },
      {
        "id": "d3_e6",
        "name": "Curl de Bíceps en Polea Baja (Barra Recta)",
        "muscleGroup": "Bíceps (Tensión Continua)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea baja con barra recta o barra corta. De pie con rodillas suaves y torso erguido. Codos fijados como bisagras a los costados del abdomen. Flexión completa con muñecas neutras para no sobrecargar los flexores del antebrazo.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable straight bar bicep curl proper form",
        "equivalents": [
          {
            "id": "d3_e6_eq1",
            "name": "Curl con barra Z de pie",
            "desc": "Sobrecarga con barra libre.",
            "ratio": 1,
            "biomechanics": "Agarre en las curvas de la barra Z para comodidad de muñecas. Cero balanceo de espalda lumbar.",
            "mindMuscle": {
              "title": "Bíceps con Barra Z Libre",
              "internalCue": "Aísla los brazos sin balancear la pelvis.",
              "externalCue": "Sube la barra Z en arco firme hacia el cuello.",
              "eccentricCue": "Frena la caída en 3 segundos completos."
            },
            "searchQuery": "Curl con barra Z de pie tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d3_e6_eq2",
            "name": "Curl en máquina Predicador (Scott)",
            "desc": "Aislamiento estricto de pico.",
            "ratio": 0.9,
            "biomechanics": "Agarre neutro con los pulgares arriba en cuerda doble. Gran énfasis en el músculo braquiorradial y braquial para dar grosor al brazo.",
            "mindMuscle": {
              "title": "Braquial & Braquiorradial (Grosor de Brazo)",
              "internalCue": "Siente la tensión en la cara lateral del brazo y el antebrazo.",
              "externalCue": "Hala los extremos de la cuerda hacia los hombros con los pulgares apuntando al techo.",
              "eccentricCue": "Baja en 3 segundos controlando el retorno."
            },
            "searchQuery": "Curl en máquina Predicador (Scott) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Bíceps Braquial & Braquial Anterior",
          "internalCue": "Aprieta los bíceps con fuerza en la cima imaginando comprimir una nuez en la flexura del codo.",
          "externalCue": "Lleva la barra hacia tu barbilla manteniendo los codos inmóviles pegados a las costillas.",
          "eccentricCue": "Desciende la barra en 2 a 3 segundos hasta que los brazos queden completamente extendidos."
        }
      },
      {
        "id": "d3_e7",
        "name": "Vacuum Abdominal (Transverso)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "15-20 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "De pie, manos apoyadas en rodillas o barra. Exhala todo el aire residual de los pulmones. Sin inhalar, expande la caja torácica aspirando el ombligo hacia la columna vertebral y hacia arriba bajo las costillas. Mantén 15 a 20 segundos en apnea espiratoria.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d3_e7_eq1",
            "name": "Plancha Isométrica",
            "desc": "Tensión estabilizadora.",
            "ratio": 1,
            "biomechanics": "Posición de cuatro apoyos en colchoneta. Exhalación completa y aspiración abdominal manteniendo la columna neutra por 15 segundos.",
            "mindMuscle": {
              "title": "Plancha Vacío Abdominal en Cuadrupedia",
              "internalCue": "Aspira el abdomen desafiando la gravedad hacia el techo.",
              "externalCue": "Pega el ombligo contra la espalda sin arquear la zona lumbar.",
              "eccentricCue": "Control respiratorio pausado al finalizar."
            },
            "searchQuery": "Plancha Isométrica tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Músculo Transverso Abdominal & Cinturón Natural",
          "internalCue": "Imagina que abrochas un corsé interno extremadamente ajustado alrededor de tus órganos.",
          "externalCue": "Pega el ombligo directamente contra la cara interna de tu columna vertebral.",
          "eccentricCue": "Al terminar los segundos de retención, relaja lentamente tomando aire nasal controlado."
        }
      },
      {
        "id": "d3_e8",
        "name": "Cardio Aeróbico en Zona 2",
        "muscleGroup": "Cardiovascular (Zona 2)",
        "sets": 1,
        "reps": "30-35 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Ritmo cardíaco sostenido entre 60% y 70% de la frecuencia cardíaca máxima (esfuerzo donde puedes mantener una conversación hablada sin jadear). Optimización del flujo sanguíneo, reciclaje de lactato y depuración metabólica sin fatiga periférica muscular.",
        "warmup": "🔥 3 minutos progresivos.",
        "searchQuery": "zone 2 stationary bike endurance fat burning",
        "equivalents": [
          {
            "id": "d3_e8_eq1",
            "name": "Caminadora en Inclinación",
            "desc": "Bajo impacto articular.",
            "ratio": 1,
            "biomechanics": "Elíptica con resistencia moderada. Cero impacto, involucra brazos y piernas en sincronía suave.",
            "mindMuscle": {
              "title": "Elíptica Zona 2",
              "internalCue": "Movimiento fluido sin golpear los pedales.",
              "externalCue": "Mantén la cadencia continua.",
              "eccentricCue": "Respiración diafragmática nasal constante."
            },
            "searchQuery": "Caminadora en Inclinación tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos."
          },
          {
            "id": "d3_e8_eq2",
            "name": "Elíptica",
            "desc": "Cadencia sin impacto articular.",
            "ratio": 1,
            "biomechanics": "Caminadora a 3-4.5 km/h con inclinación del 8-12%.",
            "mindMuscle": {
              "title": "Caminata Inclinada Zona 2",
              "internalCue": "Camina erguido sin sujetar las barandillas.",
              "externalCue": "Empuja la cinta con cada zancada uniforme.",
              "eccentricCue": "Control del ritmo respiratorio."
            },
            "searchQuery": "Elíptica tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos."
          }
        ],
        "mindMuscle": {
          "title": "Capacidad Mitocondrial y Zona 2",
          "internalCue": "Mantén una zancada o pedaleo suave y rítmico con respiración nasal relajada.",
          "externalCue": "Mantén el ritmo del cronómetro sin aceleraciones bruscas.",
          "eccentricCue": "Disfruta de la oxigenación muscular para acelerar la recuperación del entrenamiento de pesas."
        }
      }
    ]
  },
  {
    "id": "d4",
    "dayNumber": 4,
    "name": "Jueves: Empuje 2 (Pectoral Esternal, Estabilidad y Tríceps)",
    "type": "workout",
    "focus": "Segunda sesión semanal de empuje con foco en pectoral esternal medio, deltoides lateral continuo y tríceps.",
    "exercises": [
      {
        "id": "d4_e1",
        "name": "Machine Chest Press (Prensa de Pecho Plano)",
        "muscleGroup": "Pecho (Pectoral Mayor & Medio)",
        "loadFamily": "Familia Press Plano de Pecho",
        "sets": 3,
        "reps": "8-10",
        "restTime": "150-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Asiento calibrado para que los manerales queden exactamente a la altura de la parte media del esternón (fibras esternocostales). Escápulas retraídas y clavadas firmemente al respaldo. Empuje horizontal potente sin permitir que los hombros se adelanten al final del recorrido. IAP: Toma aire profundo al diafragma antes de empujar, mantén el torso inflado en la bajada (3s) y exhala al superar la mitad concéntrica.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps.",
        "searchQuery": "machine chest press flat hammer strength form",
        "equivalents": [
          {
            "id": "d4_e1_eq1",
            "name": "Press Plano con Mancuernas",
            "desc": "Gran rango de estiramiento esternal.",
            "ratio": 0.45,
            "biomechanics": "Banco plano, ojos bajo la barra, pies plantados con leg drive. Agarre a 1.5 anchos de hombros. Barra toca el esternón medio.",
            "mindMuscle": {
              "title": "Press de Banca Plano con Barra",
              "internalCue": "Tensa los pectorales y dorsales creando una plataforma estable.",
              "externalCue": "Empuja el suelo con los pies y lanza la barra hacia arriba.",
              "eccentricCue": "Desciende en 3 segundos controlados rozando la camiseta."
            },
            "searchQuery": "Press Plano con Mancuernas tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps."
          },
          {
            "id": "d4_e1_eq2",
            "name": "Press de Pecho Plano en Smith",
            "desc": "Estabilidad guiada con barra fija.",
            "ratio": 0.9,
            "biomechanics": "Banco plano, mancuernas en ángulo de 45° (agarre semi-pronado). Máximo rango de estiramiento al fondo del banco.",
            "mindMuscle": {
              "title": "Press Plano con Mancuernas",
              "internalCue": "Siente cómo las mancuernas bajan más allá del nivel del torso estirando el pecho.",
              "externalCue": "Empuja las mancuernas en arco hacia el centro sin chocarlas.",
              "eccentricCue": "Baja en 3 segundos lentos y controlados."
            },
            "searchQuery": "Press de Pecho Plano en Smith tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps."
          }
        ],
        "mindMuscle": {
          "title": "Pectoral Mayor (Fibras Esternales / Pecho Medio)",
          "internalCue": "Piensa en juntar ambos bíceps contra el centro del pecho en el bloqueo concéntrico.",
          "externalCue": "Empuja la máquina lejos de tu cuerpo con una aceleración uniforme sin bloquear bruscamente los codos.",
          "eccentricCue": "Resiste el retroceso de los manerales en 3 segundos sintiendo cómo las fibras medias del pecho se abren."
        }
      },
      {
        "id": "d4_e2",
        "name": "Press Inclinado en Máquina (Nitro Incline)",
        "muscleGroup": "Pecho (Pectoral Superior Clavicular)",
        "loadFamily": "Familia Press Superior Inclinado",
        "sets": 3,
        "reps": "8-10",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "Asiento calibrado a nivel clavicular. Trayectoria convergente con máxima carga en el tercio superior del pecho. Escápulas pegadas al respaldo. Realiza 2 a 3 repeticiones parciales en estiramiento al llegar al fallo.",
        "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
        "searchQuery": "incline chest press machine form",
        "equivalents": [
          {
            "id": "d4_e2_eq1",
            "name": "Press Inclinado con mancuernas a 30°",
            "desc": "Libertad de rotación con peso libre.",
            "ratio": 0.45,
            "biomechanics": "Banco a 30° con mancuernas pesadas en agarre semi-neutro. Libertad rotacional de hombro.",
            "mindMuscle": {
              "title": "Press Inclinado Libre a 30°",
              "internalCue": "Junta los bíceps hacia el cuello en la subida.",
              "externalCue": "Lanza las mancuernas hacia el techo sin chocarlas.",
              "eccentricCue": "Baja en 3 segundos profundos."
            },
            "searchQuery": "Press Inclinado con mancuernas a 30° tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps."
          },
          {
            "id": "d4_e2_eq2",
            "name": "Smith Inclinado a 30°",
            "desc": "Estabilidad axial para sobrecarga.",
            "ratio": 1,
            "biomechanics": "Guía vertical Smith con banco a 30°. Permite forzar el fallo muscular con los seguros listos.",
            "mindMuscle": {
              "title": "Press Inclinado Smith Seguro",
              "internalCue": "Aísla el pectoral sin gastar energía en equilibrar la barra.",
              "externalCue": "Empuja la barra a través de la guía.",
              "eccentricCue": "Baja en 3 segundos hasta rozar el esternón alto."
            },
            "searchQuery": "Smith Inclinado a 30° tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps."
          }
        ],
        "mindMuscle": {
          "title": "Pectoral Superior en Máquina Nitro",
          "internalCue": "Siente la contracción acumulada en la parte alta del tórax.",
          "externalCue": "Empuja los mangos hacia adelante y arriba en diagonal convergente.",
          "eccentricCue": "Frena la vuelta en 3 segundos completos sintiendo el estiramiento clavicular."
        }
      },
      {
        "id": "d4_e3",
        "name": "Cristos en Máquina (Pec Deck)",
        "muscleGroup": "Pecho (Aislamiento Pectoral)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Codos a la altura media del pecho con 15° de flexión constante. Retracción y depresión escapular completa. Pausa de 1s en contracción.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "pec deck flyes chest isolation technique",
        "equivalents": [
          {
            "id": "d4_e3_eq1",
            "name": "Aperturas en polea media",
            "desc": "Tensión constante en línea de fibras.",
            "ratio": 0.8,
            "biomechanics": "Banco inclinado a 30° colocado entre dos poleas bajas. Cruce en diagonal ascendente.",
            "mindMuscle": {
              "title": "Cruce Inclinado en Poleas",
              "internalCue": "Contrae el haz superior al cruzar las manos sobre la cara.",
              "externalCue": "Dibuja un arco hacia arriba y adelante.",
              "eccentricCue": "Resiste la tracción en 3 segundos."
            },
            "searchQuery": "Aperturas en polea media tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d4_e3_eq2",
            "name": "Cruces de polea",
            "desc": "Cruce al frente para máxima contracción esternal.",
            "ratio": 0.8,
            "biomechanics": "Poleas a la altura media de los hombros con un paso al frente.",
            "mindMuscle": {
              "title": "Aperturas en Polea a Altura Media",
              "internalCue": "Tensión constante en la aducción horizontal.",
              "externalCue": "Junta las manos frente al corazón.",
              "eccentricCue": "Abre los brazos en 3 segundos controlados."
            },
            "searchQuery": "Cruces de polea tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Pectoral Aislamiento en Pec Deck",
          "internalCue": "Junta la cara interna de los codos al centro.",
          "externalCue": "Abraza un barril gigante frente a ti.",
          "eccentricCue": "Abre los brazos en 3 segundos estirando las fibras pectorales."
        }
      },
      {
        "id": "d4_e4",
        "name": "Elevaciones Laterales en Polea Baja (Cable tras la espalda)",
        "muscleGroup": "Hombro (Deltoides Lateral)",
        "isUnilateral": true,
        "sets": 4,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea ajustada a la altura de la cadera o rodilla. Colócate de pie de lado con el cable pasando por detrás del glúteo/espalda. Sostén el poste con la mano libre para estabilizar el torso con inclinación de 10-15° hacia afuera. Eleva el brazo en el plano escapular (30° adelantado) hasta la horizontal.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable lateral raise behind back deltoid isolation",
        "equivalents": [
          {
            "id": "d4_e4_eq1",
            "name": "Elevaciones Laterales en Máquina",
            "desc": "Guía fija para aislar el húmero.",
            "ratio": 1.5,
            "biomechanics": "Máquina de elevaciones laterales con almohadillas en codos.",
            "mindMuscle": {
              "title": "Deltoides Lateral en Máquina",
              "internalCue": "Empuja desde el húmero sin implicar las manos.",
              "externalCue": "Abre las almohadillas hacia las paredes.",
              "eccentricCue": "Baja en 3 segundos sin tocar los topes."
            },
            "searchQuery": "Elevaciones Laterales en Máquina tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d4_e4_eq2",
            "name": "Elevaciones con mancuernas de pie",
            "desc": "Variante clásica con mancuernas.",
            "ratio": 0.7,
            "biomechanics": "Torso apoyado de lado sobre banco inclinado a 60° con mancuerna en mano externa.",
            "mindMuscle": {
              "title": "Deltoides en Banco Inclinado con Mancuerna",
              "internalCue": "Aísla el tercio inicial del recorrido.",
              "externalCue": "Eleva la mancuerna en semicírculo perfecto.",
              "eccentricCue": "Frena la bajada en 3 segundos."
            },
            "searchQuery": "Elevaciones con mancuernas de pie tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Deltoides Lateral (Tensión Continua tras la Espalda)",
          "internalCue": "Lidera con el codo manteniendo el hombro deprimido. Siente el deltoides arder desde el grado cero del movimiento.",
          "externalCue": "Lanza la mano hacia la esquina del techo más alejada de tu cuerpo.",
          "eccentricCue": "Resiste el tirón del cable en 3 segundos sintiendo la tracción constante detrás de la espalda."
        }
      },
      {
        "id": "d4_e5",
        "name": "Extensión de Tríceps en Máquina (Sentado)",
        "muscleGroup": "Tríceps (Cabeza Larga y Lateral)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Sentado con pecho o espalda apoyada en máquina de tríceps. Codos fijados sobre el rodillo de apoyo alineados con el eje de rotación. Empuja los manerales hacia abajo hasta la extensión completa de codo con 1s de contracción estricta.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "triceps extension machine seated proper form",
        "equivalents": [
          {
            "id": "d4_e5_eq1",
            "name": "Fondos en máquina asistida",
            "desc": "Gran sobrecarga con asistencia de peso.",
            "ratio": 1.2,
            "biomechanics": "Barras paralelas con torso vertical y codos pegados al costado.",
            "mindMuscle": {
              "title": "Fondos en Paralelas para Tríceps",
              "internalCue": "Empuja con las palmas extendiendo los codos con fuerza de tríceps.",
              "externalCue": "Hunde las barras hacia abajo para elevar tu cuerpo.",
              "eccentricCue": "Baja en 3 segundos hasta 90° de flexión."
            },
            "searchQuery": "Fondos en máquina asistida tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d4_e5_eq2",
            "name": "Paralelas para tríceps",
            "desc": "Fuerza calisténica para tríceps.",
            "ratio": 1,
            "biomechanics": "Polea alta con agarre unilateral de barra corta.",
            "mindMuscle": {
              "title": "Extensión en Polea con Codo Bloqueado",
              "internalCue": "Aísla la cabeza medial y lateral.",
              "externalCue": "Empuja el cable hacia el muslo.",
              "eccentricCue": "Regresa en 3 segundos sin mover el codo."
            },
            "searchQuery": "Paralelas para tríceps tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Tríceps en Máquina de Aislamiento",
          "internalCue": "Aprieta la cara posterior del brazo contra las almohadillas al bloquear los codos.",
          "externalCue": "Empuja las palancas hacia el suelo con fuerza constante.",
          "eccentricCue": "Permite que los mangos suban en 3 segundos sin despegar los codos del soporte."
        }
      },
      {
        "id": "d4_e6",
        "name": "Extensión de Tríceps en Polea (Pushdown con Cuerda)",
        "muscleGroup": "Tríceps (Cabeza Lateral)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea alta con cuerda doble. Al extender, separa activamente los cabos hacia los costados de las caderas con pronación de muñeca. Pausa de 1s abajo.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "triceps rope pushdown form terminal spread",
        "equivalents": [
          {
            "id": "d4_e6_eq1",
            "name": "Extensión cruzada de tríceps en poleas (Katana extension)",
            "desc": "Alineación perfecta con la cabeza larga.",
            "ratio": 0.8,
            "biomechanics": "Polea alta con barra en V. Agarre firme con empuje continuo.",
            "mindMuscle": {
              "title": "Pushdown con Barra V",
              "internalCue": "Extensión total con codos pegados.",
              "externalCue": "Presiona la barra hacia los muslos.",
              "eccentricCue": "Frena la vuelta en 2 a 3 segundos."
            },
            "searchQuery": "Extensión cruzada de tríceps en poleas (Katana extension) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Tríceps (Cabeza Lateral con Cuerda)",
          "internalCue": "Abre las muñecas al fondo sintiendo la cara externa del tríceps quemar.",
          "externalCue": "Separa los extremos de la cuerda hacia los lados.",
          "eccentricCue": "Sube la cuerda en 2 a 3 segundos hasta el pecho."
        }
      },
      {
        "id": "d4_e7",
        "name": "Vacuum Abdominal (Transverso)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "15-20 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "De pie o apoyado en rodillas. Exhalación total del aire. Expande la caja torácica y aspira el ombligo hacia adentro por 15-20 segundos continuos.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d4_e7_eq1",
            "name": "Plancha Abdominal Isométrica",
            "desc": "Estabilidad del core.",
            "ratio": 1,
            "biomechanics": "Tumbado supino, retroversión pélvica pegando la zona lumbar al suelo.",
            "mindMuscle": {
              "title": "Hollow Body Isométrico",
              "internalCue": "Zona lumbar clavada al suelo sin arquear.",
              "externalCue": "Extiende extremidades flotando a 15 cm.",
              "eccentricCue": "Mantén tensión continua."
            },
            "searchQuery": "Plancha Abdominal Isométrica tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Vacuum Abdominal (Transverso)",
          "internalCue": "Aprieta el transverso como un corsé de acero.",
          "externalCue": "Pega el ombligo contra la columna vertebral.",
          "eccentricCue": "Relaja de forma lenta al finalizar."
        }
      }
    ]
  },
  {
    "id": "d5",
    "dayNumber": 5,
    "name": "Viernes: Piernas 2 (Cadena Posterior, Bisagra y Femorales)",
    "type": "workout",
    "focus": "🧬 PLAN DE BATALLA COMPLETO — Enfoque Biomecánico: Isquiotibiales (Flexión + Bisagra), Glúteo Mayor, Aductores y Pantorrilla (~70 min pesas + 30 min cardio = ~100 min sesión de élite).\n\n🔥 FASE 0: Calentamiento & Activación Articular (5 a 7 min):\n• Movilidad de tobillo: Estiramiento contra la pared con rodilla flexionada (30s por lado).\n• Puentes de glúteo en suelo: 2 series × 15 reps con pausa de 2s apretando arriba (despierta el glúteo antes de cargar peso).\n• Péndulo de pierna dinámico: 10 balanceos frontales y 10 laterales por pierna.",
    "exercises": [
      {
        "id": "d5_e2",
        "name": "Flexión de Femorales Sentado (Seated Leg Curl)",
        "muscleGroup": "Isquiotibiales (Flexores de Rodilla)",
        "loadFamily": "Familia Flexión de Femorales (Isquiotibiales)",
        "sets": 4,
        "reps": "8-12",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "BLOQUE 1: Isquios en Flexión de Rodilla (Preactivación en Rango Elongado). Respaldo ajustado para que la rodilla coincida exactamente con el eje de rotación de la máquina. El rodillo de muslos debe quedar muy apretado contra tus cuádriceps para que tu pelvis no se mueva ni un milímetro. Tobillos en dorsiflexión activa (puntas hacia las espinillas). Flexión explosiva pero controlada hacia abajo, pausa de 1s apretando abajo, y retorno lento (3s excéntrica) sintiendo cómo los isquios se estiran bajo tensión.",
        "warmup": "🔥 Aproximación:\n• 1 serie × 10 reps ligeras (~60 lbs) para lubricar la rodilla sin fatiga.\n\n🎯 Prescripción de Series & Cargas:\n• Serie 1 (Efectiva): 90 lbs × 12 reps (RPE 8)\n• Serie 2 (Top Set Pesada): 95 lbs × 10 reps (RPE 8.5)\n• Serie 3 (Efectiva): 95 lbs × 8-10 reps (RPE 9)\n• Serie 4 (Back-off + Parciales): 85 lbs × 12 reps completas + inmediatamente 3-4 parciales desde el estiramiento hasta el fallo.",
        "searchQuery": "seated leg curl hamstring hypertrophy stretch",
        "equivalents": [
          {
            "id": "d5_e2_eq1",
            "name": "Flexión de femorales tumbado (Lying Leg Curl)",
            "desc": "Aislamiento en posición prona.",
            "ratio": 0.9,
            "biomechanics": "Tumbado prono con almohadilla en tobillos. Aprieta la pelvis contra el banco para no arquear la zona lumbar.",
            "mindMuscle": {
              "title": "Isquiotibiales en Banco Tumbado",
              "internalCue": "Pega el pubis al cojín y lleva los talones a los glúteos.",
              "externalCue": "Dobla las rodillas con fuerza pura de femorales.",
              "eccentricCue": "Baja el rodillo en 3 segundos controlados."
            },
            "searchQuery": "Flexión de femorales tumbado (Lying Leg Curl) tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 60% de la carga x 6 reps."
          },
          {
            "id": "d5_e2_eq2",
            "name": "Curl nórdico asistido",
            "desc": "Fuerza excéntrica pura.",
            "ratio": 1,
            "biomechanics": "Tobillos anclados, cuerpo recto como una tabla. Descenso excéntrico resistiendo la gravedad con los isquiotibiales.",
            "mindMuscle": {
              "title": "Excéntrico Nórdico de Alta Tensión",
              "internalCue": "Siente los femorales quemar resistiendo la caída del cuerpo.",
              "externalCue": "Frena la caída hacia el suelo con las rodillas como pivote.",
              "eccentricCue": "Desciende en 4 segundos tan lento como sea humanamente posible."
            },
            "searchQuery": "Curl nórdico asistido tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 60% de la carga x 6 reps."
          }
        ],
        "mindMuscle": {
          "title": "Isquiotibiales (Bíceps Femoral, Semitendinoso y Semimembranoso)",
          "internalCue": "Mantén los tobillos en dorsiflexión activa y clava los talones contra el asiento.",
          "externalCue": "Hala el rodillo hacia abajo y atrás con pausa de 1 segundo.",
          "eccentricCue": "Frena el retorno en 3 segundos sintiendo cómo los femorales se alargan bajo carga."
        }
      },
      {
        "id": "d5_e3",
        "name": "Prensa de Piernas 45° (Pies Altos y Separados)",
        "muscleGroup": "Glúteos & Isquiotibiales (Cadena Posterior)",
        "loadFamily": "Familia Prensa de Piernas",
        "sets": 3,
        "reps": "8-12",
        "restTime": "120-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "BLOQUE 2: Multiarticular Cadena Posterior (Fuerza e Hipertrofia). Colocación de pies en el tercio superior de la plataforma, separados ligeramente más que el ancho de hombros y con las puntas apuntando a 30° hacia afuera. Transfiere la tensión mecánica a glúteos, aductores e isquios proximales. Rango de movimiento: Baja todo lo profundo que puedas hasta que tus muslos casi toquen tus costillas, pero ¡ALERTA!: el sacro/coxis JAMÁS debe despegarse del respaldo (cero retroversión pélvica).",
        "warmup": "🔥 Feeder Sets de aproximación:\n• Feeder 1: 180 lbs (2 platos por lado) × 8 reps\n• Feeder 2: 270 lbs (3 platos por lado) × 6 reps (aclimatación neurológica sin fatiga).\n\n🎯 Prescripción de Series & Cargas:\n• Serie 1 (Top Set Pesada): 360 lbs (4 platos por lado) × 8-10 reps (RPE 8.5)\n• Serie 2 (Efectiva): 360 lbs × 8 reps (RPE 9)\n• Serie 3 (Back-off Tensión Mecánica): 315 lbs (3.5 platos por lado) × 10-12 reps lentas (3s bajada).",
        "searchQuery": "leg press feet high wide glute focus",
        "equivalents": [
          {
            "id": "d5_e3_eq1",
            "name": "Hip Thrust en máquina o con barra libre (3x8-10)",
            "desc": "Máxima tensión en acortamiento de glúteo.",
            "ratio": 0.9,
            "biomechanics": "Espalda apoyada en banco a la altura de escápulas o en máquina específica. Empuje pélvico con retroversión en la cima.",
            "mindMuscle": {
              "title": "Glúteo Elongado & Empuje",
              "internalCue": "Hunde la cadera sintiendo el glúteo tensarse y empuja con los talones.",
              "externalCue": "Empuja la plataforma / almohadilla alejando la carga.",
              "eccentricCue": "Desciende en 3 segundos profundos y controlados."
            },
            "searchQuery": "Hip Thrust en máquina o con barra libre (3x8-10) tecnica biomecanica",
            "warmup": "🔥 2 series progresivas de aproximación."
          }
        ],
        "mindMuscle": {
          "title": "Glúteo Mayor & Cadena Posterior en Prensa",
          "internalCue": "Siente cómo los glúteos y la cara interna absorben la carga en la bajada.",
          "externalCue": "Empuja la plataforma a través de los talones abriendo las rodillas en la misma dirección de las puntas.",
          "eccentricCue": "Baja en 3 segundos lentos y profundos con la pelvis completamente anclada."
        }
      },
      {
        "id": "d5_e1",
        "name": "Peso Muerto Rumano (RDL) con Mancuernas",
        "muscleGroup": "Isquiotibiales & Glúteos (Cadena Posterior Elongada)",
        "loadFamily": "Familia Peso Muerto Rumano / Bisagra Cadera",
        "sets": 3,
        "reps": "8-10",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "BLOQUE 3: Bisagra de Cadera en Rango Elongado (Isquios + Glúteo). Mancuernas pesadas rozando las espinillas con trayectoria vertical óptima. Pies al ancho de caderas, puntas ligeramente abiertas. Rodillas 'suaves' con microflexión fija de 15° a 20° que NO cambia en todo el ejercicio. Movimiento 100% horizontal: empuja tu cadera hacia atrás como si quisieras cerrar una puerta con los glúteos. Baja las mancuernas rozando tus espinillas hasta justo debajo de las rodillas (máximo estiramiento anatómico de isquiotibiales). Si bajas más redondeando la espalda, usas lumbares, no isquios. Subida: Empuja el piso con los talones y lleva la pelvis al frente contrayendo glúteos arriba.",
        "warmup": "🔥 No requiere series pesadas de aproximación (isquios y glúteos vienen hiperirrigados de la prensa y el curl). Opcional: 1 serie técnica de 6 reps con mancuernas de 30 lbs.\n\n🎯 Prescripción de Series & Cargas (3 series efectivas):\n• Serie 1: Mancuernas de 40 lbs c/u × 10 reps\n• Serie 2: Mancuernas de 45-50 lbs c/u × 8-10 reps\n• Serie 3: Mancuernas de 50 lbs c/u × 8-10 reps (RPE 8.5-9).",
        "searchQuery": "romanian deadlift rdl dumbell smith machine technique",
        "equivalents": [
          {
            "id": "d5_e1_eq1",
            "name": "Peso Muerto Rumano con Barra",
            "desc": "Sobrecarga pesada con barra libre.",
            "ratio": 1.1,
            "biomechanics": "Agarre a la anchura de hombros sobre barra olímpica. Barra rozando muslos y espinillas. Bisagra profunda con espalda neutra.",
            "mindMuscle": {
              "title": "RDL Clásico con Barra",
              "internalCue": "Mantén los dorsales activos cerrando las axilas para pegar la barra a las piernas.",
              "externalCue": "Lleva las caderas hacia atrás como si cerraras una puerta.",
              "eccentricCue": "Desciende en 3 segundos hasta media espinilla."
            },
            "searchQuery": "Peso Muerto Rumano con Barra tecnica biomecanica",
            "warmup": "🔥 1 serie técnica ligera con barra vacía o 40%."
          },
          {
            "id": "d5_e1_eq2",
            "name": "Peso Muerto con Barra Hexagonal (Trap Bar)",
            "desc": "Distribución neutral de la carga axial.",
            "ratio": 1.1,
            "biomechanics": "Espalda neutra, agarre neutro en manijas. Bisagra pura de cadera con microflexión de rodillas.",
            "mindMuscle": {
              "title": "Glúteo Mayor e Isquios con Trap Bar",
              "internalCue": "Aprieta los dorsales y empuja la pelvis hacia atrás.",
              "externalCue": "Clava los talones en el suelo al extender la cadera.",
              "eccentricCue": "Baja en 3 segundos rozando la vertical de las espinillas."
            },
            "searchQuery": "Peso Muerto con Barra Hexagonal (Trap Bar) tecnica biomecanica",
            "warmup": "🔥 1 serie técnica ligera."
          }
        ],
        "mindMuscle": {
          "title": "Isquiotibiales & Glúteo Mayor (Fase Elongada)",
          "internalCue": "Siente cómo los femorales y glúteos se tensan como una cuerda de arco tensada mientras la cadera viaja hacia atrás.",
          "externalCue": "Imagina que intentas tocar una pared detrás de ti con los glúteos, manteniendo las espinillas completamente verticales.",
          "eccentricCue": "Baja las pesas pegadas a las piernas en 3 segundos sintiendo el estiramiento extremo en la parte posterior del muslo."
        }
      },
      {
        "id": "d5_e4",
        "name": "Glute Butt Blaster en Máquina",
        "muscleGroup": "Glúteo Mayor (Extensión de Cadera)",
        "isUnilateral": true,
        "loadFamily": "Familia Extensión de Cadera / Glúteo",
        "sets": 3,
        "reps": "10-12",
        "restTime": "60-90 s",
        "defaultUnit": "lbs",
        "biomechanics": "BLOQUE 4: Trabajo de Aislamiento de Glúteos y Aductores. Objetivo: Extensión pura de cadera con máxima contracción en el glúteo mayor acortado. Mantén la columna recta sin arquear la zona lumbar. Empuja el pedal o rodillo hacia atrás con el talón, aguanta 1 segundo la contracción arriba en el punto más alto y regresa en 3 segundos.",
        "warmup": "🔥 No ocupa (cadena posterior caliente).\n\n🎯 Prescripción (por pierna):\n• Serie 1: 100 lbs × 12 reps por pierna\n• Serie 2: 105 lbs × 10-12 reps por pierna\n• Serie 3: 105 lbs × 10 reps por pierna.",
        "searchQuery": "butt blaster glute kick machine form",
        "equivalents": [
          {
            "id": "d5_e4_eq1",
            "name": "Extensiones a 45° en Banco Romano (espalda alta redondeada)",
            "desc": "Estiramiento y contracción de glúteo mayor.",
            "ratio": 0.8,
            "biomechanics": "De pie frente a polea baja con tobillera o en banco romano 45°. Extensión focalizada en glúteos.",
            "mindMuscle": {
              "title": "Patada de Glúteo en Polea",
              "internalCue": "Contracción máxima del glúteo arriba sin balanceo lumbar.",
              "externalCue": "Patea hacia atrás en diagonal.",
              "eccentricCue": "Controla la vuelta en 3 segundos."
            },
            "searchQuery": "Extensiones a 45° en Banco Romano (espalda alta redondeada) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d5_e4_eq2",
            "name": "Patada de glúteo en polea",
            "desc": "Tensión continua con cable y tobillera.",
            "ratio": 0.5,
            "biomechanics": "Máquina de Hip Thrust o polea baja. Elevación de pelvis o patada con pausa isométrica arriba.",
            "mindMuscle": {
              "title": "Aislamiento de Glúteo",
              "internalCue": "Aplasta el glúteo en la cima de la contracción.",
              "externalCue": "Empuja la carga hacia atrás.",
              "eccentricCue": "Baja en 3 segundos controlados."
            },
            "searchQuery": "Patada de glúteo en polea tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Glúteo Mayor (Aislamiento en Extensión de Cadera)",
          "internalCue": "Inicia la patada contrayendo el glúteo antes de mover la pierna. Aprieta la nalga en la cima durante 1 segundo.",
          "externalCue": "Empuja el pedal hacia la pared de atrás como si quisieras patear un obstáculo pesado.",
          "eccentricCue": "Regresa la rodilla al pecho en 3 segundos conteniendo la resistencia."
        }
      },
      {
        "id": "d5_e6",
        "name": "Aductores en Máquina (Hip Adduction)",
        "muscleGroup": "Aductores (Muslo Interno y Cadena Posterior)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "BLOQUE 4: Muslo Interno y Densidad. El aductor mayor es el segundo músculo más grande del muslo y da densidad y grosor profundo a la pierna. Sentado con espalda bien erguida. Abre las piernas al máximo rango cómodo, junta con fuerza contrayendo los muslos internos y aguanta 1-2s apretando al centro. Regresa en 3s controlando el estiramiento.",
        "warmup": "🔥 No ocupa.\n\n🎯 Prescripción:\n• 3 series × 12-15 reps (Carga objetivo: 100 a 110 lbs con 1-2s de contracción al centro).",
        "searchQuery": "hip adductor machine inner thigh isolation",
        "equivalents": [
          {
            "id": "d5_e6_eq1",
            "name": "Aducción con tobillera en polea",
            "desc": "Trabajo libre con polea baja.",
            "ratio": 0.5,
            "biomechanics": "De pie de costado a polea baja con tobillera en pierna interna. Cruce por delante.",
            "mindMuscle": {
              "title": "Aducción en Polea con Tobillera",
              "internalCue": "Tracciona desde la ingle y aductor.",
              "externalCue": "Barre el suelo con el pie hacia el lado opuesto.",
              "eccentricCue": "Regresa en 3 segundos controlados."
            },
            "searchQuery": "Aducción con tobillera en polea tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Aductor Mayor y Muslo Interno",
          "internalCue": "Contracción potente de la cara interna del muslo.",
          "externalCue": "Junta las rodillas como si aplastaras un balón medicinal.",
          "eccentricCue": "Abre en 3 segundos sintiendo el estiramiento profundo."
        }
      },
      {
        "id": "d5_e5",
        "name": "Abductores en Máquina (Hip Abduction)",
        "muscleGroup": "Glúteo Medio & Cadena Lateral",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "BLOQUE 4: Glúteo Medio y Menor (forma redondeada y estabilidad de cadera). Sentado en máquina, inclina el torso ligeramente hacia adelante apoyando las manos en el frente para alinear las fibras del glúteo medio con la línea de fuerza. Almohadillas en la cara externa de las rodillas. Abre con potencia y mantén 1s de isometría afuera. Regresa en 3 segundos sin golpear las placas.",
        "warmup": "🔥 No ocupa.\n\n🎯 Prescripción:\n• 3 series × 12-15 reps (Carga objetivo: 100 a 115 lbs con pausa de 1s afuera).",
        "searchQuery": "hip abductor machine glute burn form",
        "equivalents": [
          {
            "id": "d5_e5_eq1",
            "name": "Abducción con tobillera en polea",
            "desc": "Tensión constante en recorrido libre.",
            "ratio": 0.5,
            "biomechanics": "De pie de costado a polea baja con tobillera en pierna externa. Abducción controlada.",
            "mindMuscle": {
              "title": "Abducción en Polea con Tobillera",
              "internalCue": "Aísla el glúteo medio sin girar la pelvis.",
              "externalCue": "Eleva la pierna en diagonal hacia afuera.",
              "eccentricCue": "Baja en 3 segundos conteniendo el cable."
            },
            "searchQuery": "Abducción con tobillera en polea tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Glúteo Medio y Menor (Abducción de Cadera)",
          "internalCue": "Siente el costado del glúteo arder al separar las piernas.",
          "externalCue": "Empuja las rodillas hacia las paredes laterales.",
          "eccentricCue": "Regresa en 3 segundos sin tocar las placas."
        }
      },
      {
        "id": "d5_e7",
        "name": "Elevación de Pantorrillas (Rotary Calf o en Máquina de Pie)",
        "muscleGroup": "Pantorrillas (Gastrocnemio & Sóleo)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "75-90 s",
        "defaultUnit": "lbs",
        "biomechanics": "BLOQUE 5: Pantorrilla Pesada (Gastrocnemio y Sóleo). Biomecánica Científica: Pausa OBLIGATORIA de 2 segundos en el fondo del estiramiento. Esto disipa por completo el reflejo elástico del tendón de Aquiles, obligando al músculo puro a levantar la carga. Subida explosiva sobre la bola del pie (metatarsos), apretando 1s arriba.",
        "warmup": "🔥 No ocupa.\n\n🎯 Prescripción:\n• 4 series × 10-12 reps pesadas (Carga objetivo: 110 a 130 lbs con pausa de 2s abajo).",
        "searchQuery": "calf raises stretch pause high reps",
        "equivalents": [
          {
            "id": "d5_e7_eq1",
            "name": "Elevación en Smith sobre escalón o en Prensa",
            "desc": "Carga axial de pie o en trineo.",
            "ratio": 1,
            "biomechanics": "Máquina de gemelo de pie con hombreras acolchadas. Rodillas con microflexión fija.",
            "mindMuscle": {
              "title": "Gastrocnemio en Máquina de Pie",
              "internalCue": "Compacta las dos cabezas de la pantorrilla arriba.",
              "externalCue": "Empuja las almohadillas hacia el techo con los pies.",
              "eccentricCue": "Baja los talones al máximo en 3 segundos con 2s de pausa obligatoria abajo."
            },
            "searchQuery": "Elevación en Smith sobre escalón o en Prensa tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Tríceps Sural (Pantorrilla de Pie)",
          "internalCue": "Siente el estiramiento completo del talón hacia abajo y la contracción en piedra arriba.",
          "externalCue": "Elévate sobre las puntas tocando el techo con la cabeza.",
          "eccentricCue": "Baja en 3 segundos lentos con pausa obligatoria de 2s abajo."
        }
      },
      {
        "id": "d5_e8",
        "name": "Vacuum Abdominal (Transverso) o Pallof Press",
        "muscleGroup": "Core Profundo (Transverso & Estabilidad)",
        "sets": 4,
        "reps": "15-20 s",
        "restTime": "45 s",
        "defaultUnit": "seg",
        "biomechanics": "BLOQUE 6: Core Profundo. Postura: En cuadrupedia (4 apoyos en el suelo) o de pie inclinado apoyando las manos sobre las rodillas. Exhala todo el aire vaciando completamente los pulmones. Sin volver a inhalar, mete el ombligo lo más adentro y arriba posible, como si quisieras pegarlo a tu columna torácica. Mantén 15 a 20 segundos de retención isométrica (apnea).",
        "warmup": "🔥 1 serie de ensayo de 10s.\n\n🎯 Prescripción:\n• 4 series de 15 a 20 segundos de retención isométrica (apnea).",
        "searchQuery": "stomach vacuum transverse abdominis form",
        "equivalents": [
          {
            "id": "d5_e8_eq1",
            "name": "Pallof Press en Polea (Anti-Rotación)",
            "desc": "Fuerza y control anti-rotacional de core.",
            "ratio": 1,
            "biomechanics": "Polea a la altura del esternón. De pie perpendicular a la polea con agarre doble frente al pecho. Extiende los brazos al frente en línea recta resistiendo el torque rotacional del cable sin mover los hombros ni la pelvis. Sostén 2 segundos extendido.",
            "mindMuscle": {
              "title": "Core Funcional Anti-Rotación",
              "internalCue": "Contrae los oblicuos y el abdomen profundo para impedir que el cable gire tu torso hacia la polea.",
              "externalCue": "Extiende las manos al frente formando una línea perpendicular perfecta con tu esternón.",
              "eccentricCue": "Regresa las manos al pecho en 2 segundos controlando la fuerza lateral."
            },
            "searchQuery": "pallof press cable anti rotation core stability",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Transverso Abdominal (Vacuum)",
          "internalCue": "Succiona el abdomen hacia adentro y hacia arriba por detrás del esternón.",
          "externalCue": "Pega el ombligo a la columna vaciando todo el aire.",
          "eccentricCue": "Inhala de forma pausada y controlada al terminar los segundos de apnea."
        }
      },
      {
        "id": "d5_e9",
        "name": "Cardio Aeróbico en Zona 2 (Caminadora Inclinada)",
        "muscleGroup": "Cardiovascular (Zona 2 & Recuperación)",
        "sets": 1,
        "reps": "30 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "BLOQUE 6: Finalizador Metabólico. 30 minutos continuos en Caminadora Inclinada: 8% a 10% de inclinación, velocidad de 4.5 a 5.0 km/h (caminata rápida continua). Frecuencia Cardíaca: 120 a 135 BPM (Zona 2). Acelera la remoción de subproductos metabólicos en las piernas, maximiza la oxidación lipídica mitocondrial y previene la rigidez muscular al día siguiente.",
        "warmup": "🔥 3 minutos progresivos a ritmo suave.",
        "searchQuery": "zone 2 cardio fat oxidation incline walk",
        "equivalents": [
          {
            "id": "d5_e9_eq1",
            "name": "Caminadora en Inclinación",
            "desc": "Bajo impacto articular y alto gasto calórico.",
            "ratio": 1,
            "biomechanics": "Caminadora a 4.5-5.0 km/h con inclinación del 8-10%. Cero impacto articular en rodillas, activación sostenida de gemelos y glúteos.",
            "mindMuscle": {
              "title": "Caminata Inclinada Zona 2",
              "internalCue": "Camina erguido sin sujetar las barandillas para activar la musculatura estabilizadora.",
              "externalCue": "Empuja la cinta con cada zancada manteniendo cadencia uniforme.",
              "eccentricCue": "Controla el ritmo respiratorio continuo."
            },
            "searchQuery": "Caminadora en Inclinación tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos a ritmo suave."
          },
          {
            "id": "d5_e9_eq2",
            "name": "Bicicleta Estática",
            "desc": "Alternativa de nulo impacto articular.",
            "ratio": 1,
            "biomechanics": "Cadencia sostenida de 75-85 RPM con resistencia moderada manteniendo FC en 120-135 BPM.",
            "mindMuscle": {
              "title": "Pedaleo Continuo Zona 2",
              "internalCue": "Fluidez en el pedaleo circular constante.",
              "externalCue": "Mantén la cadencia sin frenar.",
              "eccentricCue": "Respiración rítmica y relajada."
            },
            "searchQuery": "Bicicleta Estática Zona 2",
            "warmup": "🔥 3 minutos progresivos a ritmo suave."
          }
        ]
      }
    ]
  },
  {
    "id": "d6",
    "dayNumber": 6,
    "name": "Sábado: Jalón 2 (Densidad Dorsal Media, Trapecio y Brazos)",
    "type": "workout",
    "focus": "Segunda sesión de tirón con agarres neutros para dorsal inferior, retracción escapular y aislamiento de bíceps.",
    "exercises": [
      {
        "id": "d6_e1",
        "name": "Jalón al Pecho con Agarre Estrecho Neutro (V-Grip)",
        "muscleGroup": "Espalda (Dorsal Inferior & V-Taper)",
        "loadFamily": "Familia Jalón Vertical Dorsal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "Maneral en V o agarre neutro cerrado en polea alta. Torso ligeramente reclinado (15°). La posición de agarre neutro permite una trayectoria con los codos pegados al cuerpo, alineando la tracción con las fibras lumbares e iliocostales del dorsal ancho. Tira hasta que el maneral toque el esternón bajo.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps.",
        "searchQuery": "close grip neutral lat pulldown lower lats v grip",
        "equivalents": [
          {
            "id": "d6_e1_eq1",
            "name": "Jalón con agarre supino (al ancho de hombros)",
            "desc": "Mayor ayuda de flexores para sobrecarga dorsal.",
            "ratio": 1,
            "biomechanics": "Polea alta con maneral individual. Tracción unilateral pegando el codo a la cadera con ligera flexión lateral de torso.",
            "mindMuscle": {
              "title": "Jalón Unilateral Dorsal en Polea",
              "internalCue": "Aísla el dorsal de un solo lado llevando el codo al bolsillo.",
              "externalCue": "Tracciona el maneral hacia la cadera.",
              "eccentricCue": "Permite que el cable estire el dorsal hacia arriba en 3 segundos."
            },
            "searchQuery": "Jalón con agarre supino (al ancho de hombros) tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps."
          },
          {
            "id": "d6_e1_eq2",
            "name": "Dominadas neutras cerradas",
            "desc": "Fuerza calisténica en barra cerrada.",
            "ratio": 0.9,
            "biomechanics": "Dominadas con agarre neutro cerrado en barra con paralelas. Elevación con pecho al frente.",
            "mindMuscle": {
              "title": "Dominadas Neutras Compuestas",
              "internalCue": "Clava los codos hacia el suelo pegados a las costillas.",
              "externalCue": "Eleva el torso hasta que el mentón supere las manos.",
              "eccentricCue": "Baja en 3 segundos lentos hasta extensión completa."
            },
            "searchQuery": "Dominadas neutras cerradas tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps."
          }
        ],
        "mindMuscle": {
          "title": "Dorsal Ancho (Fibras Inferiores y Lumbares)",
          "internalCue": "Mantén los codos pegados a las costillas y llévalos hacia tus caderas.",
          "externalCue": "Tira del triángulo hacia el esternón bajo expandiendo el pecho.",
          "eccentricCue": "Deja que el cable estire los dorsales hacia arriba en 3 segundos sin descolgar los hombros de golpe."
        }
      },
      {
        "id": "d6_e2",
        "name": "Remo Compuesto en Máquina (o Remo Gironda en Polea Baja)",
        "muscleGroup": "Espalda (Densidad Dorsal Media & Trapecio)",
        "loadFamily": "Familia Remo Horizontal",
        "sets": 4,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Sentado en polea baja con pies en los soportes y rodillas ligeramente flexionadas. Agarre estrecho o neutro. Torso erguido perpendicular al suelo. Inicia retrayendo las escápulas y tira del maneral hacia el ombligo sin balancear la espalda hacia atrás.",
        "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
        "searchQuery": "machine row compound back thickness seated cable row",
        "equivalents": [
          {
            "id": "d6_e2_eq1",
            "name": "Remo con mancuerna a una mano apoyado en banco",
            "desc": "Independencia unilateral de brazos.",
            "ratio": 0.5,
            "biomechanics": "Mano y rodilla apoyadas en banco plano. Torso paralelo al suelo. Tracción de la mancuerna hacia la cadera en arco.",
            "mindMuscle": {
              "title": "Remo Unilateral con Mancuerna",
              "internalCue": "Tira con el codo hacia el techo y la cadera sin rotar el torso.",
              "externalCue": "Lleva la mancuerna al bolsillo del pantalón.",
              "eccentricCue": "Desciende en 3 segundos sintiendo el estiramiento dorsal completo."
            },
            "searchQuery": "Remo con mancuerna a una mano apoyado en banco tecnica biomecanica",
            "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps."
          }
        ],
        "mindMuscle": {
          "title": "Densidad de Espalda (Romboides, Trapecio Medio y Dorsal)",
          "internalCue": "Pega los codos a los costados y aprieta el centro de la espalda como si juntaras dos placas de acero.",
          "externalCue": "Lleva el maneral hacia la cintura manteniendo los hombros abajo.",
          "eccentricCue": "Permite que los brazos se extiendan en 3 segundos dejando que las escápulas se abran con control."
        }
      },
      {
        "id": "d6_e3",
        "name": "Face Pulls en Polea Alta",
        "muscleGroup": "Hombro (Deltoides Posterior & Manguito)",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Polea a nivel de los ojos con cuerda doble. Tira hacia la frente separando las manos hacia las orejas en rotación externa. Pausa de 1s atrás.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable face pull external rotation rear delt",
        "equivalents": [
          {
            "id": "d6_e3_eq1",
            "name": "Pájaros en Pec Deck Inverso",
            "desc": "Aislamiento directo en máquina deltoides posterior.",
            "ratio": 1,
            "biomechanics": "Torso inclinado a 45° apoyado en banco con mancuernas ligeras abriendo en arco lateral.",
            "mindMuscle": {
              "title": "Pájaros con Mancuernas en Banco Inclinado",
              "internalCue": "Aísla la cara trasera del deltoides sin encoger hombros.",
              "externalCue": "Abre los brazos como alas hacia las paredes.",
              "eccentricCue": "Baja en 3 segundos sintiendo el control excéntrico."
            },
            "searchQuery": "Pájaros en Pec Deck Inverso tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e3_eq2",
            "name": "Remo al mentón amplio en polea",
            "desc": "Énfasis en deltoides lateral y posterior.",
            "ratio": 0.9,
            "biomechanics": "Poleas cruzadas bajas elevando los brazos en 'Y' a 45° de abducción.",
            "mindMuscle": {
              "title": "Y-Raises en Polea Baja",
              "internalCue": "Contrae el trapecio inferior y deltoides posterior.",
              "externalCue": "Eleva las manos formando una 'Y' hacia el techo.",
              "eccentricCue": "Baja en 3 segundos controlados."
            },
            "searchQuery": "Remo al mentón amplio en polea tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Deltoides Posterior y Manguito Rotador",
          "internalCue": "Gira los antebrazos hacia atrás al final de la tracción.",
          "externalCue": "Lleva los nudillos detrás de las sienes.",
          "eccentricCue": "Regresa la cuerda en 2 a 3 segundos controlados."
        }
      },
      {
        "id": "d6_e4",
        "name": "Elevaciones Laterales en Máquina o Mancuernas",
        "muscleGroup": "Hombro (Deltoides Lateral)",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "El eje de rotación de la máquina debe coincidir con la articulación del hombro. Almohadillas apoyadas justo arriba del codo para empujar directamente desde el húmero sin sobrecargar el trapecio. Pausa de 1s arriba; parciales abajo al fallar.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "machine lateral raise deltoid cap metabolic burn",
        "equivalents": [
          {
            "id": "d6_e4_eq1",
            "name": "Elevaciones laterales en polea",
            "desc": "Tensión uniforme en todo el arco articular.",
            "ratio": 0.6,
            "biomechanics": "Polea baja a la altura de la rodilla con un paso lateral. Tensión continua.",
            "mindMuscle": {
              "title": "Elevación Lateral en Polea Unilateral",
              "internalCue": "Siente el deltoides activado desde el inicio.",
              "externalCue": "Lanza la mano hacia la esquina del techo.",
              "eccentricCue": "Baja en 3 segundos controlando el cable."
            },
            "searchQuery": "Elevaciones laterales en polea tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Deltoides Lateral (Amplitud V-Taper)",
          "internalCue": "Lidera la elevación empujando desde los codos con trapecios deprimidos.",
          "externalCue": "Empuja las almohadillas hacia las paredes laterales.",
          "eccentricCue": "Frena la bajada en 2 a 3 segundos."
        }
      },
      {
        "id": "d6_e5",
        "name": "Curl de Bíceps con Mancuernas (Supinado sentado)",
        "muscleGroup": "Bíceps (Cabeza Corta y Larga)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Sentado en banco a 90° con dos mancuernas colgando a los lados. Inicia con agarre neutro. Al subir, supina activamente la muñeca (gira el dedo meñique hacia arriba y afuera para activar la función supinadora del bíceps braquial). Codos fijos a los lados del torso.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "seated supinating dumbbell bicep curl proper technique",
        "equivalents": [
          {
            "id": "d6_e5_eq1",
            "name": "Curl martillo con mancuernas (enfoque en braquial y braquiorradial)",
            "desc": "Desarrollo del braquial anterior y antebrazo.",
            "ratio": 1,
            "biomechanics": "Banco inclinado a 60°, brazos colgando detrás del torso con máxima elongación.",
            "mindMuscle": {
              "title": "Curl Inclinado con Mancuernas a 60°",
              "internalCue": "Inicia la contracción desde el estiramiento completo del bíceps.",
              "externalCue": "Curl hacia arriba y afuera con supinación activa.",
              "eccentricCue": "Desciende en 3 segundos lentos."
            },
            "searchQuery": "Curl martillo con mancuernas (enfoque en braquial y braquiorradial) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Bíceps Braquial (Función Flexora y Supinadora)",
          "internalCue": "Gira la muñeca al máximo en la segunda mitad del recorrido apretando el pico del bíceps.",
          "externalCue": "Lleva el dedo meñique hacia el hombro exterior.",
          "eccentricCue": "Baja las mancuernas en 3 segundos rotando de vuelta a posición neutra al llegar abajo."
        }
      },
      {
        "id": "d6_e6",
        "name": "Curl en Máquina Predicador (Scott / Arm Curl)",
        "muscleGroup": "Bíceps (Aislamiento Estricto de Pico)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Tríceps y axilas firmemente apoyados sobre la almohadilla inclinada a 45°. Asiento ajustado para no encorvar la espalda. El apoyo del brazo elimina cualquier impulso del hombro o balanceo del torso, aislando el bíceps en el tercio medio e inferior del movimiento. Flexiona hasta la vertical y frena la bajada antes de hiperextender el codo.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "preacher curl machine scott arm curl isolation",
        "equivalents": [
          {
            "id": "d6_e6_eq1",
            "name": "Curl en banco Scott con barra Z",
            "desc": "Variante con barra libre y apoyo predicador.",
            "ratio": 0.9,
            "biomechanics": "Pecho apoyado en banco inclinado a 45°, brazos colgando verticalmente con barra Z. Gran sobrecarga en contracción pico.",
            "mindMuscle": {
              "title": "Spider Curl con Barra Z",
              "internalCue": "Aísla el bíceps en la fase de acortamiento superior.",
              "externalCue": "Lleva la barra hacia la frente con codos inmóviles.",
              "eccentricCue": "Baja en 3 segundos hasta extensión vertical."
            },
            "searchQuery": "Curl en banco Scott con barra Z tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e6_eq2",
            "name": "Curl concentrado con mancuerna",
            "desc": "Aislamiento individual apoyado en muslo.",
            "ratio": 0.45,
            "biomechanics": "Sentado con codo apoyado en la cara interna del muslo. Curl estricto a una mano con mancuerna.",
            "mindMuscle": {
              "title": "Curl Concentrado con Mancuerna",
              "internalCue": "Aprieta la bola del bíceps en la cima.",
              "externalCue": "Eleva la mancuerna hacia la nariz.",
              "eccentricCue": "Desciende en 3 segundos lentos."
            },
            "searchQuery": "Curl concentrado con mancuerna tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Bíceps Braquial en Aislamiento Puro (Banco Scott)",
          "internalCue": "Siente cómo el bíceps hace todo el trabajo sin ayuda de ningún otro músculo.",
          "externalCue": "Tracciona el maneral hacia tu frente manteniendo los brazos pegados al cojín.",
          "eccentricCue": "Desciende en 3 segundos muy controlados, deteniéndote 2 cm antes del bloqueo articular para proteger los tendones."
        }
      },
      {
        "id": "d6_e7",
        "name": "Vacuum Abdominal (Transverso)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "15-20 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "De pie o apoyado en rodillas. Exhalación total del aire. Expande la caja torácica y aspira el ombligo hacia adentro por 15-20 segundos continuos.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d6_e7_eq1",
            "name": "Plancha Isométrica",
            "desc": "Estabilidad del core.",
            "ratio": 1,
            "biomechanics": "Posición de cuatro apoyos en colchoneta. Aspiración diafragmática de 15 segundos.",
            "mindMuscle": {
              "title": "Plancha Vacío Abdominal en Cuadrupedia",
              "internalCue": "Aspira el abdomen hacia el techo.",
              "externalCue": "Pega el ombligo a la columna.",
              "eccentricCue": "Control respiratorio pausado."
            },
            "searchQuery": "Plancha Isométrica tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Vacuum Abdominal (Transverso)",
          "internalCue": "Aprieta el transverso como un corsé de acero.",
          "externalCue": "Pega el ombligo contra la columna vertebral.",
          "eccentricCue": "Relaja de forma lenta al finalizar."
        }
      },
      {
        "id": "d6_e8",
        "name": "Cardio Aeróbico en Zona 2",
        "muscleGroup": "Cardiovascular (Zona 2)",
        "sets": 1,
        "reps": "35-40 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "35 a 40 minutos continuos (Bicicleta estática o Caminadora) a 120-135 BPM para consolidar el gasto energético y recuperación sin estrés articular.",
        "warmup": "🔥 3 minutos progresivos.",
        "searchQuery": "zone 2 cardio fat oxidation stationary bike",
        "equivalents": [
          {
            "id": "d6_e8_eq1",
            "name": "Caminadora en Inclinación",
            "desc": "Bajo impacto articular.",
            "ratio": 1,
            "biomechanics": "Caminadora en inclinación de 8-10% a ritmo moderado continuo.",
            "mindMuscle": {
              "title": "Caminata Inclinada Zona 2",
              "internalCue": "Zancada regular y postura erguida.",
              "externalCue": "Mantén el paso constante.",
              "eccentricCue": "Respiración nasal controlada."
            },
            "searchQuery": "Caminadora en Inclinación tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos."
          },
          {
            "id": "d6_e8_eq2",
            "name": "Bicicleta Estática",
            "desc": "Cadencia continua.",
            "ratio": 1,
            "biomechanics": "Bicicleta estática a 80 RPM continua.",
            "mindMuscle": {
              "title": "Bicicleta Estática Zona 2",
              "internalCue": "Pedaleo circular suave sin tirones.",
              "externalCue": "Mantén la cadencia fija.",
              "eccentricCue": "Respiración uniforme."
            },
            "searchQuery": "Bicicleta Estática tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos."
          }
        ],
        "mindMuscle": {
          "title": "Capacidad Mitocondrial y Zona 2",
          "internalCue": "Mantén una zancada o pedaleo suave y rítmico con respiración nasal relajada.",
          "externalCue": "Mantén el ritmo del cronómetro sin aceleraciones bruscas.",
          "eccentricCue": "Disfruta de la oxigenación muscular para acelerar la recuperación del entrenamiento de pesas."
        }
      }
    ]
  },
  {
    "id": "d7",
    "dayNumber": 7,
    "name": "Domingo: Descanso Total",
    "type": "rest",
    "focus": "Cero entrenamiento de fuerza o actividades de alta demanda neurológica. Dedicado exclusivamente a la resíntesis proteica, reposición de glucógeno y recuperación del sistema nervioso central.",
    "exercises": []
  }
];
