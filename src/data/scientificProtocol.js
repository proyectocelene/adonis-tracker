// PROTOCOLO ADONIS - RUTINA DEFINITIVA Y UNIFICADA
// Actualizada con Familias de Carga, Equivalencias Directas, Motor de Matching, Biomecánica con IAP y Conexión Mente-Músculo
// Nueva estructura científica optimizada (Schoenfeld / ACSM): Hack Squat #1, RDL Smith #1, Tríceps Copa #2, Bayesian Cable Curl y Cardio de Remo Matutino

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
    "name": "Lunes: Empuje 1 (Pecho Esternoclavicular, Hombro Lateral y Tríceps)",
    "type": "workout",
    "focus": "Prioridad en tensión mecánica pesada y alternancia agonista inteligente. Machine Chest Press #1 para pectoral esternal, Tríceps Copa #2 para sobrecargar la cabeza larga en máxima elongación sin fatiga previa de tríceps, Press Inclinado Nitro #3 para haz clavicular (pecho recuperado de fosfágenos), Elevaciones Laterales #4 y Pec Deck #5 como remate al fallo.",
    "exercises": [
      {
        "id": "d1_e1",
        "unifiedCode": "[PECH-CHEST_PRESS-CONV_01]",
        "name": "Press de Pecho en Máquina Convergente (Chest Press)",
        "muscleGroup": "Pecho (Pectoral Mayor & Medio)",
        "loadFamily": "Familia Press Plano de Pecho",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180-240 s",
        "defaultUnit": "lbs",
        "biomechanics": "Retrae y deprime las escápulas clavándolas en el respaldo. Ajusta el asiento para que los manerales queden a la altura del esternón. Fase excéntrica controlada de 3 segundos. 3 a 4 minutos de descanso vital para recuperar la fuerza y tensión mecánica.",
        "warmup": "🔥 Sí ocupa (2 series de aproximación progresiva):\n• Serie 1: 50% del peso de trabajo x 10 reps.\n• Serie 2: 75% del peso de trabajo x 4 reps.",
        "searchQuery": "machine chest press flat hammer strength form",
        "equivalents": [
          {
            "id": "d1_e1",
            "unifiedCode": "[PECH-INC_PRESS-MANC_30]",
            "name": "Press Inclinado con Mancuernas (Banco a 30°)",
            "muscleGroup": "Pecho (Pectoral Superior Clavicular)",
            "loadFamily": "Familia Press Superior Inclinado",
            "sets": 4,
            "reps": "8-10",
            "restTime": "180-240 s",
            "defaultUnit": "lbs",
            "biomechanics": "Constructor #1 del pecho alto. 3s de bajada excéntrica controlando el estiramiento abajo. Mancuernas en ángulo de 45° (no en cruz) para proteger el manguito rotador. Banco inclinado a 30° exactos para alinear las fibras del haz clavicular del pectoral con la línea de empuje. Escápulas deprimidas y retraídas contra el banco. IAP: Inhala diafragmáticamente expandiendo el abdomen en 360° antes de bajar; contén el aire durante la excéntrica (3 segundos) para estabilizar la articulación glenohumeral. Exhala al superar el punto de estancamiento.",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% del peso efectivo x 10 reps (control articular).\n• Serie 2: 75% del peso efectivo x 4 reps (activación neural sin fatiga).",
            "searchQuery": "dumbbell incline chest press 30 degree bench proper form",
            "equivalents": [
              {
                "id": "d1_e1_eq1",
                "unifiedCode": "[PECH-INC_PRESS-SMITH_01]",
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
                "unifiedCode": "[PECH-INC_PRESS-NITRO_01]",
                "name": "Press Inclinado en Máquina (Nitro Incline)",
                "desc": "Tensión constante en recorrido convergente.",
                "ratio": 2.2,
                "biomechanics": "Asiento calibrado para que los manerales comiencen a la altura de la clavícula. Apoyo lumbar y dorsal firme. Trayectoria convergente que concentra la máxima tensión al final de la contracción.",
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
            "id": "d4_e1_eq1",
            "unifiedCode": "[PECH-CHEST_PRESS-MANC_FLAT_01]",
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
            "unifiedCode": "[PECH-CHEST_PRESS-SMITH_01]",
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
        "id": "d1_e2",
        "unifiedCode": "[TRIC-OVERHEAD_EXT-CABLE_01]",
        "name": "Extensión de Tríceps Copa en Polea (Overhead Triceps Extension)",
        "muscleGroup": "Tríceps (Cabeza Larga en Estiramiento)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "De espaldas a la polea baja. Mantener los codos apuntando hacia arriba coloca la cabeza larga del tríceps (que representa el 65% del brazo) en máximo estiramiento bajo tensión, logrando hasta 1.5x mayor hipertrofia que en ángulos neutros (Maeo 2022).",
        "warmup": "🔥 Ninguno específico (articulación glenohumeral y codo pre-calentados por el chest press).",
        "searchQuery": "overhead cable rope tricep extension long head stretch",
        "equivalents": [
          {
            "id": "d1_e6_eq1",
            "unifiedCode": "[TRIC-KATANA_EXT-CABLE_01]",
            "name": "Extensión Cruzada Katana en Poleas (Katana Extension)",
            "desc": "Recorrido guiado con apoyo de codos y estabilidad total.",
            "ratio": 1,
            "biomechanics": "Sentado con codos apoyados y alineados al eje de rotación. Empuje vertical controlado hacia abajo.",
            "mindMuscle": {
              "title": "Tríceps Guiado en Máquina",
              "internalCue": "Aísla el tríceps sin ninguna compensación de hombro.",
              "externalCue": "Empuja las almohadillas hacia el suelo bloqueando codos.",
              "eccentricCue": "Baja en 3 segundos sintiendo la tracción controlada."
            },
            "searchQuery": "Extensión de Tríceps en Máquina sentado tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d1_e6_eq2",
            "unifiedCode": "[TRIC-FRENCH_PRESS-MANC_01]",
            "name": "French Press con Mancuerna a dos Manos",
            "desc": "Variante clásica con mancuerna sobre cabeza.",
            "ratio": 0.5,
            "biomechanics": "Banco a 30-45°. Dos mancuernas neutras o una pesada a dos manos. Codos inclinados hacia atrás para mantener tensión continua.",
            "mindMuscle": {
              "title": "Press Francés Inclinado Libre",
              "internalCue": "Siente la cabeza larga del tríceps alargarse hacia atrás en cada bajada.",
              "externalCue": "Extiende los antebrazos hacia arriba y atrás en arco.",
              "eccentricCue": "Baja las mancuernas a los lados de la cabeza en 3 segundos sin abrir los codos."
            },
            "searchQuery": "French Press con mancuerna a dos manos tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d1_e6_eq3",
            "unifiedCode": "[TRIC-PUSHDOWN-STRAIGHT_01]",
            "name": "Extensión cruzada de tríceps en poleas (Katana extension)",
            "desc": "Alineación biomecánica perfecta con la cabeza larga.",
            "ratio": 0.8,
            "biomechanics": "Polea alta a la altura del hombro opuesto. Brazo cruzando por detrás de la cabeza en la línea escapular.",
            "mindMuscle": {
              "title": "Katana Triceps Extension",
              "internalCue": "Extensión diagonal pura del codo sin mover el hombro.",
              "externalCue": "Desenfundar una katana hacia el frente.",
              "eccentricCue": "Frena en 3 segundos hasta flexión profunda."
            },
            "searchQuery": "Katana cable triceps extension proper form",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Tríceps (Cabeza Larga en Estiramiento Máximo - 65% del Brazo)",
          "internalCue": "Flexión profunda de codo detrás de la cabeza. Siente la tracción extrema en el tubérculo infraglenoideo antes de extender.",
          "externalCue": "Separa los extremos de la cuerda al frente y bloquea los codos con fuerza durante 1 segundo.",
          "eccentricCue": "Regresa en 3 segundos continuos sin permitir que los codos se abran hacia los lados."
        }
      },
      {
        "id": "d1_e3",
        "unifiedCode": "[PECH-INC_PRESS-NITRO_01]",
        "name": "Press Inclinado en Máquina (Nitro Incline)",
        "muscleGroup": "Pecho (Pectoral Superior Clavicular)",
        "loadFamily": "Familia Press Superior Inclinado",
        "sets": 3,
        "reps": "8-10",
        "restTime": "120-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Ángulo de 30°-45°. Mantén el pecho alto. Si fallas antes de la repetición 8 en la última serie, haz un Rest-Pause (descansa 15s y saca 2 reps extra para mantener la velocidad de contracción y tensión).",
        "warmup": "🔥 Sí (1 serie feeder): 70% de la carga x 4 reps para calibrar el recorrido de la máquina.",
        "searchQuery": "nitro incline chest press machine setup",
        "equivalents": [
          {
            "id": "d1_e2_eq1",
            "unifiedCode": "[PECH-INC_PRESS-BAR_30]",
            "name": "Press Inclinado con Barra a 30°",
            "desc": "Sobrecarga axial máxima.",
            "ratio": 1.15,
            "biomechanics": "Banco inclinado a 30°, agarre a 1.5 anchos de hombros con muñecas neutras sobre el antebrazo. La barra desciende controlada hacia la parte media-alta del esternón. Retracción escapular firme.",
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
            "unifiedCode": "[PECH-INC_PRESS-DISC_HAMMER]",
            "name": "Press Inclinado Hammer Strength (Plate-Loaded)",
            "desc": "Carga unilateral convergente.",
            "ratio": 1,
            "biomechanics": "Máquina con brazos independientes y carga por discos. Asiento colocado de modo que las manijas queden a nivel de las clavículas al iniciar.",
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
          "title": "Pectoral Superior Clavicular Convergente",
          "internalCue": "Al empujar, enfócate en deslizar los codos hacia el centro del pecho sin permitir que los hombros se adelanten.",
          "externalCue": "Piensa en empujar las agarraderas lejos de tu cuerpo juntando las manos al frente.",
          "eccentricCue": "Frena el retorno en 3 segundos sintiendo el estiramiento en la caja torácica antes del tope."
        }
      },
      {
        "id": "d1_e4",
        "unifiedCode": "[HOMB-LAT_RAISE-MAQ_01]",
        "name": "Elevaciones Laterales en Máquina o Polea",
        "muscleGroup": "Hombro (Deltoides Lateral 3D)",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Tensión constante desde el fondo. Torso inclinado 10° al frente; empuja desde los codos hacia las paredes laterales, no hacia arriba con las manos. Al fallar en la horizontal, saca 4 a 6 repeticiones parciales en el tercio inferior (0° a 45° de abducción).",
        "warmup": "🔥 1 serie de aproximación con 50% de la carga si lo requieres.",
        "searchQuery": "machine lateral raise deltoid isolation",
        "equivalents": [
          {
            "id": "d1_e5_eq1",
            "unifiedCode": "[HOMB-LAT_RAISE-CABLE_01]",
            "name": "Elevaciones Laterales en Polea Baja a una Mano",
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
            "unifiedCode": "[HOMB-LAT_RAISE-MANC_SIDE_30]",
            "name": "Elevaciones con Mancuernas recostado de lado en Banco a 30°",
            "desc": "Sobrecarga en ángulo estirado.",
            "ratio": 0.7,
            "biomechanics": "Acostado de costado sobre un banco inclinado a 30-45°. El brazo libre sostiene la mancuerna. Esta inclinación sobrecarga el tercio inicial del recorrido (fase elongada).",
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
          "title": "Deltoides Lateral (Hombro 3D & Parciales Elongadas)",
          "internalCue": "Lidera la elevación empujando desde los codos con el torso inclinado 10° adelante. Al fallar en la horizontal, ¡NO sueltes el peso! Saca de 4 a 6 parciales en el tercio inferior (0° a 45°, Pedrosa 2022 / Kassiano 2023).",
          "externalCue": "Imagina que empujas las almohadillas hacia las paredes laterales lejanas (hacia afuera, no hacia arriba).",
          "eccentricCue": "Frena la bajada en 2 a 3 segundos resistiendo el peso; en las parciales finales, controla cada descenso en la zona elongada."
        }
      },
      {
        "id": "d1_e5",
        "unifiedCode": "[PECH-PEC_DECK-STACK_01]",
        "name": "Aperturas en Máquina Pec Deck (Pec Deck / Flyes)",
        "muscleGroup": "Pecho (Aislamiento Pectoral)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Flexión leve de codos. Piensa en juntar la parte interna de los bíceps en el centro del pecho para lograr una contracción máxima. Pausa de 1s en estiramiento y contracción.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "pec deck fly machine lengthened partials chest",
        "equivalents": [
          {
            "id": "d1_e4_eq1",
            "unifiedCode": "[PECH-CABLE_CROSS-MID_01]",
            "name": "Cruce de Poleas a Media Altura (Cable Crossover)",
            "desc": "Tensión continua en todo el rango.",
            "ratio": 0.8,
            "biomechanics": "Poleas a la altura del pecho medio. Paso al frente con torso ligeramente inclinado a 10° y abdomen firme.",
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
            "unifiedCode": "[PECH-FLY-MANC_FLAT_01]",
            "name": "Aperturas con Mancuernas en Banco Plano",
            "desc": "Gran tensión en máximo estiramiento.",
            "ratio": 0.4,
            "biomechanics": "Banco horizontal, mancuernas neutras. Codos flexionados a 15-20°. Descenso controlado hasta que los codos alcancen la altura del torso.",
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
          "internalCue": "No pienses en juntar las manos: piensa en intentar tocar la cara interna de ambos codos frente à tu corazón.",
          "externalCue": "Imagina que abrazas el tronco de una secoya gigante manteniendo los hombros pegados atrás.",
          "eccentricCue": "Abre los brazos en 3 segundos sintiendo el estiramiento máximo de las fibras pectorales hasta la horizontal."
        }
      },
      {
        "id": "d1_e6",
        "unifiedCode": "[ABDO-VACUUM-ISOM_01]",
        "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "20-25 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "Apnea espiratoria completa. Ombligo succionado hacia la columna para cerrar el perímetro de la cintura. De pie o apoyado en rodillas. Exhala todo el aire residual de los pulmones. Sin inhalar, expande la caja torácica aspirando el ombligo hacia la columna vertebral y hacia arriba bajo las costillas. Mantén 20 a 25 segundos en apnea espiratoria.",
        "warmup": "🔥 No ocupa (solo 2 exhalaciones profundas previas).",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d1_e8_eq1",
            "unifiedCode": "[ABDO-PLANK-ISOM_01]",
            "name": "Plancha Abdominal Isométrica Convencional",
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
        "id": "d1_cardio",
        "unifiedCode": "[CARD-ROW_HIIT_NEAT_01]",
        "name": "Cardio Matutino: Remo (Cardio vs. NEAT)",
        "muscleGroup": "Cardio",
        "isCardio": true,
        "machineType": "rower",
        "machine": "Máquina de Remo (Ergómetro)",
        "sets": 1,
        "reps": "35-40 min",
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Para anular el efecto de interferencia, estas sesiones deben realizarse por la mañana, separadas por al menos 6 horas de tu entrenamiento de fuerza.\n\n• Opción A: Sesión Híbrida (\"Cardio de verdad\" + NEAT) — Máximo 1 a 2 veces por semana\n- Duración Total: 35-40 minutos.\n- Fase 1 (Cardio HIIT / Vigoroso): 10-15 minutos. Realiza de 4 a 6 sprints de 20 segundos a máxima velocidad, seguidos de 40 a 60 segundos de remo muy suave para recuperar. El nivel de esfuerzo percibido (RPE) en el sprint debe ser de 16-18 sobre 20.\n- Fase 2 (NEAT / LISS): 20-25 minutos continuos a intensidad muy baja. Funciona como enfriamiento activo y suma gasto calórico sin añadir fatiga metabólica.\n\n• Opción B: Sesión Pura de NEAT (LISS) — 2 a 3 veces por semana\n- Duración Total: 30-45 minutos.\n- Intensidad (Talk Test): Nivel de esfuerzo (RPE) de 12 a 13 sobre 20. Debes poder mantener una conversación fluida o respirar cómodamente por la nariz sin jadear.\n- Objetivo: Simular los pasos y la actividad que no realizas por tu trabajo sedentario. No debes terminar exhausto ni con los músculos ardiendo.",
        "warmup": "🔥 3 minutos de remo progresivo muy suave antes de iniciar.",
        "searchQuery": "rowing machine hiit neat morning protocol",
        "equivalents": [
          {
            "id": "d1_cardio_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
            "desc": "Bajo impacto con zancada lenta.",
            "ratio": 1,
            "biomechanics": "Caminadora a 10-12% inclinación a 4.0 km/h manteniendo 120-135 BPM.",
            "searchQuery": "incline treadmill zone 2 cardio form"
          }
        ]
      }
    ]
  },
  {
    "id": "d2",
    "dayNumber": 2,
    "name": "Martes: Piernas 1 (Enfoque Cuádriceps & Vasto Medial)",
    "type": "workout",
    "focus": "Máximo reclutamiento de unidades motoras de alto umbral con SNC fresco. Sentadilla Hack #1 (sin pre-fatiga metabólica), Prensa 45° #2, Extensión de Cuádriceps #3 como finalizador metabólico en acortamiento, Abductores #4 y Pantorrillas #5 con pausa estricta de 2 segundos en estiramiento profundo.",
    "exercises": [
      {
        "id": "d2_e1",
        "unifiedCode": "[CUAD-HACK_SQUAT-DISC_01]",
        "name": "Sentadilla en Máquina Hack (Hack Squat)",
        "muscleGroup": "Cuádriceps & Glúteo",
        "loadFamily": "Familia Sentadilla Hack",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180-240 s",
        "defaultUnit": "lbs",
        "biomechanics": "Realizarlo como primer ejercicio asegura que tu sistema nervioso esté al 100% para reclutar las fibras de contracción rápida (tipo IIx). Descenso profundo en 3 segundos empujando las rodillas hacia afuera con IAP diafragmática 360°.",
        "warmup": "🔥 Calentamiento Específico Piramidal:\n• Plataforma sin peso x 10 reps.\n• 50% de la carga de trabajo x 6 reps.\n• 75% de la carga de trabajo x 3 reps.",
        "searchQuery": "hack squat machine quad focus deep knee flexion",
        "equivalents": [
          {
            "id": "d2_e1_eq1",
            "unifiedCode": "[CUAD-V_SQUAT-MAQ_01]",
            "name": "Sentadilla en Máquina V-Squat",
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
            "unifiedCode": "[CUAD-SQUAT-SMITH_01]",
            "name": "Sentadilla en Smith con Talones sobre Disco",
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
        "unifiedCode": "[CUAD-LEG_PRESS-DISC_45_PB]",
        "name": "Prensa de Piernas 45° (Posición Central)",
        "muscleGroup": "Cuádriceps & Tren Inferior",
        "loadFamily": "Familia Prensa de Piernas",
        "sets": 4,
        "reps": "10-12",
        "restTime": "120-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Coloca los pies a la anchura de los hombros en el centro de la plataforma. Rango de movimiento completo sin permitir que la cadera baja se despegue del asiento.",
        "warmup": "🔥 Sí (1 serie feeder): 70% de la carga x 5 reps para ajustar posición de pies.",
        "searchQuery": "leg press 45 degree proper feet placement quad focus",
        "equivalents": [
          {
            "id": "d2_e2_eq1",
            "unifiedCode": "[CUAD-LEG_PRESS-HORIZ_01]",
            "name": "Prensa Horizontal en Cable / Placas",
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
            "unifiedCode": "[CUAD-HACK_SQUAT-REVERSE_01]",
            "name": "Hack Invertida en Máquina",
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
          },
          {
            "id": "d2_e4",
            "unifiedCode": "[CUAD-LEG_PRESS-UNI_01]",
            "name": "Prensa Unilateral a 1 Pierna (Pie Alto)",
            "desc": "Enfoque unilateral para corregir desbalances.",
            "ratio": 0.5,
            "biomechanics": "Un pie colocado en la plataforma y el otro libre.",
            "mindMuscle": {
              "title": "Prensa Unilateral",
              "internalCue": "Aísla la pierna activa con control completo.",
              "externalCue": "Empuja la plataforma con el talón.",
              "eccentricCue": "Baja en 3 segundos controlados."
            },
            "searchQuery": "Prensa Unilateral a 1 Pierna tecnica",
            "warmup": "🔥 No ocupa."
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
        "unifiedCode": "[CUAD-LEG_EXT-STACK_01]",
        "name": "Extensión de Cuádriceps en Máquina (Leg Extension)",
        "muscleGroup": "Cuádriceps (Aislamiento Recto Femoral & Vasto Medial)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Finalizador metabólico en rango acortado (tras Hack y Prensa). Realiza una pausa estricta de 1 segundo en la máxima contracción (arriba) y desciende controladamente en 3 segundos.",
        "warmup": "🔥 1 serie ligera de aproximación si lo requieres.",
        "searchQuery": "leg extension machine lengthened partials quad hypertrophy",
        "equivalents": [
          {
            "id": "d2_e3_eq1",
            "unifiedCode": "[CUAD-SISSY_SQUAT-BENCH_01]",
            "name": "Sissy Squat en Soporte",
            "desc": "Tensión extrema en máxima elongación del recto femoral.",
            "ratio": 0.4,
            "biomechanics": "Pies fijados en banco sissy, torso y muslos formando una línea recta. Descenso echando el cuerpo hacia atrás mediante flexión pura de rodilla.",
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
            "unifiedCode": "[CUAD-LEG_EXT-UNI_01]",
            "name": "Extensiones de Cuádriceps Unilaterales en Máquina",
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
        "unifiedCode": "[ABDU-ABDUCTOR-STACK_01]",
        "name": "Abductores en Máquina (Hip Abductor - Abrir Cadera)",
        "muscleGroup": "Glúteo Medio & Superior",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Inclina el torso hacia adelante unos 15° para reclutar óptimamente el glúteo medio superior.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "hip abductor machine glute medius lean forward",
        "equivalents": [
          {
            "id": "d2_e6_eq1",
            "unifiedCode": "[ABDU-CABLE-ANKLE_01]",
            "name": "Abducción de Cadera en Polea Baja con Tobillera",
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
          },
          {
            "id": "d2_e5",
            "unifiedCode": "[ADUC-ADUCTOR-STACK_01]",
            "name": "Aductores en Máquina (Hip Adduction / Cerrar Cadera)",
            "desc": "Aislamiento de cara interna del muslo.",
            "ratio": 1,
            "biomechanics": "Sentado con espalda erguida. Cierra las piernas con fuerza uniforme y mantén 1s al centro.",
            "mindMuscle": {
              "title": "Aductores en Máquina",
              "internalCue": "Contrae la cara interna del muslo.",
              "externalCue": "Junta las rodillas con fuerza.",
              "eccentricCue": "Abre en 3 segundos sintiendo el estiramiento."
            },
            "searchQuery": "Aductores en Máquina tecnica",
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
        "id": "d2_e5",
        "unifiedCode": "[PANT-CALF_RAISE-MAQ_01]",
        "name": "Elevación de Pantorrillas en Máquina (Pausa 2s Estiramiento)",
        "muscleGroup": "Pantorrillas (Gastrocnemio & Sóleo)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Pausa obligatoria de 2 segundos en el máximo estiramiento (talones hacia el piso) para anular el reflejo elástico del tendón de Aquiles, obligando al gastrocnemio y sóleo a realizar el 100% del trabajo mecánico.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "rotary calf machine stretch pause calf growth",
        "equivalents": [
          {
            "id": "d2_e7_eq1",
            "unifiedCode": "[PANT-CALF_RAISE-LEG_PRESS_01]",
            "name": "Elevación de Pantorrillas en la Prensa de Piernas",
            "desc": "Apoyo lumbar cómodo y sobrecarga.",
            "ratio": 1.2,
            "biomechanics": "Puntas de los pies en el borde inferior de la prensa de piernas. Empuje de flexión plantar.",
            "mindMuscle": {
              "title": "Pantorrilla en Prensa de Piernas",
              "internalCue": "Control estricto de los tobillos.",
              "externalCue": "Empuja la plataforma con los dedos de los pies.",
              "eccentricCue": "Deja que el peso baje los talones en 3 segundos sin soltar la tensión."
            },
            "searchQuery": "Elevación de pantorrillas en la Prensa de piernas tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d2_e7_eq2",
            "unifiedCode": "[PANT-CALF_RAISE-SMITH_01]",
            "name": "Elevación de Pantorrillas en Smith sobre Escalón",
            "desc": "Carga axial vertical completa.",
            "ratio": 1,
            "biomechanics": "De pie sobre escalón con barra Smith sobre hombros. Pausa de 2s abajo.",
            "mindMuscle": {
              "title": "Gastrocnemio de Pie en Smith",
              "internalCue": "Siente las dos cabezas de la pantorrilla compactarse como piedras arriba.",
              "externalCue": "Elévate sobre las puntas empujando el suelo con los metatarsos.",
              "eccentricCue": "Baja los talones 3 segundos hasta el máximo estiramiento con pausa de 2s abajo."
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
        "id": "d2_cardio",
        "unifiedCode": "[CARD-ROW_HIIT_NEAT_01]",
        "name": "Cardio Matutino: Remo (Cardio vs. NEAT)",
        "muscleGroup": "Cardio",
        "isCardio": true,
        "machineType": "rower",
        "machine": "Máquina de Remo (Ergómetro)",
        "sets": 1,
        "reps": "35-40 min",
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Para anular el efecto de interferencia, estas sesiones deben realizarse por la mañana, separadas por al menos 6 horas de tu entrenamiento de fuerza.\n\n• Opción A: Sesión Híbrida (\"Cardio de verdad\" + NEAT) — Máximo 1 a 2 veces por semana\n- Duración Total: 35-40 minutos.\n- Fase 1 (Cardio HIIT / Vigoroso): 10-15 minutos. Realiza de 4 a 6 sprints de 20 segundos a máxima velocidad, seguidos de 40 a 60 segundos de remo muy suave para recuperar. El nivel de esfuerzo percibido (RPE) en el sprint debe ser de 16-18 sobre 20.\n- Fase 2 (NEAT / LISS): 20-25 minutos continuos a intensidad muy baja. Funciona como enfriamiento activo y suma gasto calórico sin añadir fatiga metabólica.\n\n• Opción B: Sesión Pura de NEAT (LISS) — 2 a 3 veces por semana\n- Duración Total: 30-45 minutos.\n- Intensidad (Talk Test): Nivel de esfuerzo (RPE) de 12 a 13 sobre 20. Debes poder mantener una conversación fluida o respirar cómodamente por la nariz sin jadear.\n- Objetivo: Simular los pasos y la actividad que no realizas por tu trabajo sedentario. No debes terminar exhausto ni con los músculos ardiendo.",
        "warmup": "🔥 3 minutos de remo progresivo muy suave antes de iniciar.",
        "searchQuery": "rowing machine hiit neat morning protocol",
        "equivalents": [
          {
            "id": "d2_cardio_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
            "desc": "Bajo impacto con zancada lenta.",
            "ratio": 1,
            "biomechanics": "Caminadora a 10-12% inclinación a 4.0 km/h manteniendo 120-135 BPM.",
            "searchQuery": "incline treadmill zone 2 cardio form"
          }
        ]
      }
    ]
  },
  {
    "id": "d3",
    "dayNumber": 3,
    "name": "Miércoles: Jalón 1 (Amplitud V-Taper y Brazos)",
    "type": "workout",
    "focus": "Desarrollo en V con tracción pronada amplia a clavículas, remo con apoyo esternal sin estrés lumbar, aislamiento dorsal en elongación con pull-over, y bíceps maestro (Bayesian Curl) en estiramiento humeral eliminando el volumen basura redundante.",
    "exercises": [
      {
        "id": "d3_e1",
        "unifiedCode": "[ESPA-PULLDOWN-WIDE_01]",
        "name": "Jalón al Pecho en Polea (Agarre Ancho Pronado)",
        "muscleGroup": "Espalda (Amplitud Dorsal V-Taper)",
        "loadFamily": "Familia Jalón Vertical Dorsal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "120-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Inicia el movimiento deprimiendo y retrayendo las escápulas (aléjalas de las orejas). Jala la barra hacia las clavículas/esternón superior manteniendo el torso estable.",
        "warmup": "🔥 1 serie de aproximación: 10 reps con 50% del peso de trabajo.",
        "searchQuery": "lat pulldown wide grip lats focus elbow drive",
        "equivalents": [
          {
            "id": "d3_e1_eq1",
            "unifiedCode": "[ESPA-CHINUP-WIDE_01]",
            "name": "Dominadas Pronadas Asistidas / Lastradas",
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
            "unifiedCode": "[ESPA-PULLDOWN-UNI_CABLE_01]",
            "name": "Jalón Unilateral en Polea",
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
        "unifiedCode": "[ESPA-MACHINE_ROW-CHEST_SUPP_01]",
        "name": "Remo Compuesto en Máquina (Apoyo al Pecho)",
        "muscleGroup": "Espalda (Densidad Dorsal & Romboides)",
        "loadFamily": "Familia Remo Horizontal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "120-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "El soporte en el pecho aísla la espalda alta y protege la zona lumbar. Permite que tus omóplatos se separen en la bajada (protracción completa) y júntalos con fuerza al jalar.",
        "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
        "searchQuery": "chest supported row machine mid back density",
        "equivalents": [
          {
            "id": "d3_e2_eq1",
            "unifiedCode": "[ESPA-TBAR_ROW-CHEST_01]",
            "name": "Remo con Barra T con Apoyo Torácico",
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
            "unifiedCode": "[ESPA-SEATED_ROW-GIRONDA_01]",
            "name": "Remo Gironda en Polea Baja (Agarre Neutro)",
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
        "unifiedCode": "[ESPA-PULLOVER-HIGH_CABLE_01]",
        "name": "Pull-Over en Polea Alta con Cuerda",
        "muscleGroup": "Espalda (Aislamiento Dorsal Ancho)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Torso inclinado a 45°. Codos con una ligera flexión bloqueada. Describe un arco amplio desde arriba de la cabeza hasta los muslos manteniendo la tensión constante en el dorsal.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable straight arm pullover lat isolation rope",
        "equivalents": [
          {
            "id": "d3_e3_eq1",
            "unifiedCode": "[ESPA-PULLOVER-MANC_01]",
            "name": "Pull-Over con Mancuerna sobre Banco",
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
            "unifiedCode": "[ESPA-PULLOVER-MAQ_01]",
            "name": "Máquina de Pullover Guiada",
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
        "unifiedCode": "[BICEP-CABLE_CURL-BAYESIAN_01]",
        "name": "Bayesian Cable Curl (Estiramiento Humeral en Polea)",
        "muscleGroup": "Bíceps (Estiramiento Humeral)",
        "isUnilateral": true,
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "De espaldas a la polea baja, da un paso al frente para que tu codo quede detrás de tu torso. Esto estira la cabeza larga del bíceps al máximo bajo tensión constante. Supina el agarre al subir. Sustituye las series redundantes y elimina el volumen basura.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "bayesian cable curl behind back bicep stretch",
        "equivalents": [
          {
            "id": "d3_e5_eq_cable",
            "unifiedCode": "[BICEP-CABLE_CURL-LOW_STRAIGHT_01]",
            "name": "Curl de Bíceps en Polea Baja (Barra Recta)",
            "desc": "Tensión mecánica continua con codos pegados al torso.",
            "ratio": 1,
            "biomechanics": "Codos clavados como bisagras en las costillas. Pico concéntrico de 1 segundo arriba. Polea baja con barra recta o corta.",
            "mindMuscle": {
              "title": "Bíceps Braquial & Braquial Anterior",
              "internalCue": "Aprieta los bíceps con fuerza en la cima.",
              "externalCue": "Lleva la barra hacia tu barbilla con codos inmóviles.",
              "eccentricCue": "Desciende la barra en 2 a 3 segundos."
            },
            "searchQuery": "cable straight bar bicep curl proper form",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d3_e5_eq1",
            "unifiedCode": "[BICEP-INCLINE_CURL-MANC_60_01]",
            "name": "Curl de Bíceps con Mancuernas (Sentado en Banco a 60°)",
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
          },
          {
            "id": "d3_e5_eq_scott",
            "unifiedCode": "[BICEP-PREACHER_CURL-SCOTT_MAQ_01]",
            "name": "Curl de Bíceps en Banco Scott o Máquina Predicador",
            "desc": "Aislamiento estricto de cabeza corta y pico.",
            "ratio": 0.9,
            "biomechanics": "Tríceps y axilas firmemente apoyados sobre la almohadilla inclinada a 45°. Aislamiento puro sin inercia.",
            "mindMuscle": {
              "title": "Bíceps Braquial en Banco Scott",
              "internalCue": "Siente cómo el bíceps hace todo el trabajo sin ayuda.",
              "externalCue": "Tracciona hacia la frente con codos inmóviles.",
              "eccentricCue": "Baja en 3 segundos muy controlados."
            },
            "searchQuery": "preacher curl machine scott arm curl isolation",
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
        "id": "d3_e5",
        "unifiedCode": "[HOMB-FACE_PULL-HIGH_CABLE_01]",
        "name": "Face Pulls en Polea Alta con Cuerda",
        "muscleGroup": "Hombro Posterior & Manguito Rotador",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Dirige el centro de la cuerda hacia el puente de la nariz mientras separas las manos hacia las orejas, rotando los hombros externamente para máxima salud del manguito rotador y trapecio inferior.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable face pull external rotation rear delt",
        "equivalents": [
          {
            "id": "d3_e4_eq1",
            "unifiedCode": "[HOMB-REAR_DELT-PEC_DECK_01]",
            "name": "Pájaros en Pec Deck Inverso (Reverse Flyes)",
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
            "unifiedCode": "[HOMB-REAR_DELT-CABLE_01]",
            "name": "Reverse Cable Flyes en Poleas",
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
        "id": "d3_e6",
        "unifiedCode": "[ABDO-VACUUM-ISOM_01]",
        "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "20-25 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "Transverso profundo. De pie, manos apoyadas en rodillas o barra. Exhala todo el aire residual de los pulmones. Sin inhalar, expande la caja torácica aspirando el ombligo hacia la columna vertebral y hacia arriba bajo las costillas. Mantén 20 a 25 segundos en apnea espiratoria.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d3_e7_eq1",
            "unifiedCode": "[ABDO-PLANK-ISOM_01]",
            "name": "Plancha Abdominal Isométrica Convencional",
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
        "id": "d3_cardio",
        "unifiedCode": "[CARD-ROW_HIIT_NEAT_01]",
        "name": "Cardio Matutino: Remo (Cardio vs. NEAT)",
        "muscleGroup": "Cardio",
        "isCardio": true,
        "machineType": "rower",
        "machine": "Máquina de Remo (Ergómetro)",
        "sets": 1,
        "reps": "35-40 min",
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Para anular el efecto de interferencia, estas sesiones deben realizarse por la mañana, separadas por al menos 6 horas de tu entrenamiento de fuerza.\n\n• Opción A: Sesión Híbrida (\"Cardio de verdad\" + NEAT) — Máximo 1 a 2 veces por semana\n- Duración Total: 35-40 minutos.\n- Fase 1 (Cardio HIIT / Vigoroso): 10-15 minutos. Realiza de 4 a 6 sprints de 20 segundos a máxima velocidad, seguidos de 40 a 60 segundos de remo muy suave para recuperar. El nivel de esfuerzo percibido (RPE) en el sprint debe ser de 16-18 sobre 20.\n- Fase 2 (NEAT / LISS): 20-25 minutos continuos a intensidad muy baja. Funciona como enfriamiento activo y suma gasto calórico sin añadir fatiga metabólica.\n\n• Opción B: Sesión Pura de NEAT (LISS) — 2 a 3 veces por semana\n- Duración Total: 30-45 minutos.\n- Intensidad (Talk Test): Nivel de esfuerzo (RPE) de 12 a 13 sobre 20. Debes poder mantener una conversación fluida o respirar cómodamente por la nariz sin jadear.\n- Objetivo: Simular los pasos y la actividad que no realizas por tu trabajo sedentario. No debes terminar exhausto ni con los músculos ardiendo.",
        "warmup": "🔥 3 minutos de remo progresivo muy suave antes de iniciar.",
        "searchQuery": "rowing machine hiit neat morning protocol",
        "equivalents": [
          {
            "id": "d3_cardio_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
            "desc": "Bajo impacto con zancada lenta.",
            "ratio": 1,
            "biomechanics": "Caminadora a 10-12% inclinación a 4.0 km/h manteniendo 120-135 BPM.",
            "searchQuery": "incline treadmill zone 2 cardio form"
          }
        ]
      }
    ]
  },
  {
    "id": "d4",
    "dayNumber": 4,
    "name": "Jueves: Empuje 2 (Pecho Esternoclavicular, Deltoides en Polea y Tríceps)",
    "type": "workout",
    "focus": "Sesión de empuje de máxima tensión mecánica. Machine Chest Press #1 para fibras medias esternales, Tríceps Copa Overhead #2 para aislar la cabeza larga en máxima elongación, Press Inclinado Nitro #3 para fibras claviculares, Elevaciones Laterales en Polea #4 y Pec Deck #5.",
    "exercises": [
      {
        "id": "d4_e1",
        "unifiedCode": "[PECH-CHEST_PRESS-CONV_01]",
        "name": "Press de Pecho en Máquina Convergente (Chest Press)",
        "muscleGroup": "Pecho (Pectoral Mayor & Medio)",
        "loadFamily": "Familia Press Plano de Pecho",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180-240 s",
        "defaultUnit": "lbs",
        "biomechanics": "Retrae y deprime las escápulas clavándolas en el respaldo. Ajusta el asiento para que los manerales queden a la altura del esternón. Fase excéntrica controlada de 3 segundos. 3 a 4 minutos de descanso vital para recuperar la fuerza y tensión mecánica.",
        "warmup": "🔥 Sí ocupa (2 series de aproximación progresiva):\n• Serie 1: 50% del peso de trabajo x 10 reps.\n• Serie 2: 75% del peso de trabajo x 4 reps.",
        "searchQuery": "machine chest press flat hammer strength form",
        "equivalents": [
          {
            "id": "d1_e1",
            "unifiedCode": "[PECH-INC_PRESS-MANC_30]",
            "name": "Press Inclinado con Mancuernas (Banco a 30°)",
            "muscleGroup": "Pecho (Pectoral Superior Clavicular)",
            "loadFamily": "Familia Press Superior Inclinado",
            "sets": 4,
            "reps": "8-10",
            "restTime": "180-240 s",
            "defaultUnit": "lbs",
            "biomechanics": "Constructor #1 del pecho alto. 3s de bajada excéntrica controlando el estiramiento abajo. Mancuernas en ángulo de 45° (no en cruz) para proteger el manguito rotador. Banco inclinado a 30° exactos para alinear las fibras del haz clavicular del pectoral con la línea de empuje. Escápulas deprimidas y retraídas contra el banco. IAP: Inhala diafragmáticamente expandiendo el abdomen en 360° antes de bajar; contén el aire durante la excéntrica (3 segundos) para estabilizar la articulación glenohumeral. Exhala al superar el punto de estancamiento.",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% del peso efectivo x 10 reps (control articular).\n• Serie 2: 75% del peso efectivo x 4 reps (activación neural sin fatiga).",
            "searchQuery": "dumbbell incline chest press 30 degree bench proper form",
            "equivalents": [
              {
                "id": "d1_e1_eq1",
                "unifiedCode": "[PECH-INC_PRESS-SMITH_01]",
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
                "unifiedCode": "[PECH-INC_PRESS-NITRO_01]",
                "name": "Press Inclinado en Máquina (Nitro Incline)",
                "desc": "Tensión constante en recorrido convergente.",
                "ratio": 2.2,
                "biomechanics": "Asiento calibrado para que los manerales comiencen a la altura de la clavícula. Apoyo lumbar y dorsal firme. Trayectoria convergente que concentra la máxima tensión al final de la contracción.",
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
            "id": "d4_e1_eq1",
            "unifiedCode": "[PECH-CHEST_PRESS-MANC_FLAT_01]",
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
            "unifiedCode": "[PECH-CHEST_PRESS-SMITH_01]",
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
        "unifiedCode": "[TRIC-OVERHEAD_EXT-CABLE_01]",
        "name": "Extensión de Tríceps Copa en Polea (Overhead Triceps Extension)",
        "muscleGroup": "Tríceps (Cabeza Larga en Estiramiento)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "De espaldas a la polea baja. Mantener los codos apuntando hacia arriba coloca la cabeza larga del tríceps (que representa el 65% del brazo) en máximo estiramiento bajo tensión, logrando hasta 1.5x mayor hipertrofia que en ángulos neutros (Maeo 2022).",
        "warmup": "🔥 Ninguno específico (articulación glenohumeral y codo pre-calentados por el chest press).",
        "searchQuery": "overhead cable rope tricep extension long head stretch",
        "equivalents": [
          {
            "id": "d1_e6_eq1",
            "unifiedCode": "[TRIC-KATANA_EXT-CABLE_01]",
            "name": "Extensión Cruzada Katana en Poleas (Katana Extension)",
            "desc": "Recorrido guiado con apoyo de codos y estabilidad total.",
            "ratio": 1,
            "biomechanics": "Sentado con codos apoyados y alineados al eje de rotación. Empuje vertical controlado hacia abajo.",
            "mindMuscle": {
              "title": "Tríceps Guiado en Máquina",
              "internalCue": "Aísla el tríceps sin ninguna compensación de hombro.",
              "externalCue": "Empuja las almohadillas hacia el suelo bloqueando codos.",
              "eccentricCue": "Baja en 3 segundos sintiendo la tracción controlada."
            },
            "searchQuery": "Extensión de Tríceps en Máquina sentado tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d1_e6_eq2",
            "unifiedCode": "[TRIC-FRENCH_PRESS-MANC_01]",
            "name": "French Press con Mancuerna a dos Manos",
            "desc": "Variante clásica con mancuerna sobre cabeza.",
            "ratio": 0.5,
            "biomechanics": "Banco a 30-45°. Dos mancuernas neutras o una pesada a dos manos. Codos inclinados hacia atrás para mantener tensión continua.",
            "mindMuscle": {
              "title": "Press Francés Inclinado Libre",
              "internalCue": "Siente la cabeza larga del tríceps alargarse hacia atrás en cada bajada.",
              "externalCue": "Extiende los antebrazos hacia arriba y atrás en arco.",
              "eccentricCue": "Baja las mancuernas a los lados de la cabeza en 3 segundos sin abrir los codos."
            },
            "searchQuery": "French Press con mancuerna a dos manos tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d1_e6_eq3",
            "unifiedCode": "[TRIC-PUSHDOWN-STRAIGHT_01]",
            "name": "Extensión cruzada de tríceps en poleas (Katana extension)",
            "desc": "Alineación biomecánica perfecta con la cabeza larga.",
            "ratio": 0.8,
            "biomechanics": "Polea alta a la altura del hombro opuesto. Brazo cruzando por detrás de la cabeza en la línea escapular.",
            "mindMuscle": {
              "title": "Katana Triceps Extension",
              "internalCue": "Extensión diagonal pura del codo sin mover el hombro.",
              "externalCue": "Desenfundar una katana hacia el frente.",
              "eccentricCue": "Frena en 3 segundos hasta flexión profunda."
            },
            "searchQuery": "Katana cable triceps extension proper form",
            "warmup": "🔥 No ocupa."
          }
        ],
        "mindMuscle": {
          "title": "Tríceps (Cabeza Larga en Estiramiento Máximo - 65% del Brazo)",
          "internalCue": "Flexión profunda de codo detrás de la cabeza. Siente la tracción extrema en el tubérculo infraglenoideo antes de extender.",
          "externalCue": "Separa los extremos de la cuerda al frente y bloquea los codos con fuerza durante 1 segundo.",
          "eccentricCue": "Regresa en 3 segundos continuos sin permitir que los codos se abran hacia los lados."
        }
      },
      {
        "id": "d4_e3",
        "unifiedCode": "[PECH-INC_PRESS-NITRO_01]",
        "name": "Press Inclinado en Máquina (Nitro Incline)",
        "muscleGroup": "Pecho (Pectoral Superior Clavicular)",
        "loadFamily": "Familia Press Superior Inclinado",
        "sets": 3,
        "reps": "8-10",
        "restTime": "120-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Ángulo de 30°-45°. Mantén el pecho alto. Si fallas antes de la repetición 8 en la última serie, haz un Rest-Pause (descansa 15s y saca 2 reps extra para mantener la velocidad de contracción y tensión).",
        "warmup": "🔥 Sí (1 serie feeder): 70% de la carga x 4 reps para calibrar el recorrido de la máquina.",
        "searchQuery": "nitro incline chest press machine setup",
        "equivalents": [
          {
            "id": "d1_e2_eq1",
            "unifiedCode": "[PECH-INC_PRESS-BAR_30]",
            "name": "Press Inclinado con Barra a 30°",
            "desc": "Sobrecarga axial máxima.",
            "ratio": 1.15,
            "biomechanics": "Banco inclinado a 30°, agarre a 1.5 anchos de hombros con muñecas neutras sobre el antebrazo. La barra desciende controlada hacia la parte media-alta del esternón. Retracción escapular firme.",
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
            "unifiedCode": "[PECH-INC_PRESS-DISC_HAMMER]",
            "name": "Press Inclinado Hammer Strength (Plate-Loaded)",
            "desc": "Carga unilateral convergente.",
            "ratio": 1,
            "biomechanics": "Máquina con brazos independientes y carga por discos. Asiento colocado de modo que las manijas queden a nivel de las clavículas al iniciar.",
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
          "title": "Pectoral Superior Clavicular Convergente",
          "internalCue": "Al empujar, enfócate en deslizar los codos hacia el centro del pecho sin permitir que los hombros se adelanten.",
          "externalCue": "Piensa en empujar las agarraderas lejos de tu cuerpo juntando las manos al frente.",
          "eccentricCue": "Frena el retorno en 3 segundos sintiendo el estiramiento en la caja torácica antes del tope."
        }
      },
      {
        "id": "d4_e4",
        "unifiedCode": "[HOMB-LAT_RAISE-CABLE_01]",
        "name": "Elevaciones Laterales en Máquina o Polea",
        "muscleGroup": "Hombro (Deltoides Lateral 3D)",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Tensión constante desde el fondo. Torso inclinado 10° al frente; empuja desde los codos hacia las paredes laterales, no hacia arriba con las manos. En polea baja pasando por detrás del cuerpo para tensión continua desde el grado cero.",
        "mindMuscle": {
          "title": "Deltoides Lateral en Tensión Continua",
          "internalCue": "Siente cómo el deltoides lateral se activa desde el grado cero.",
          "externalCue": "Lanza los codos hacia las paredes laterales como si quisieras tocar los extremos del gimnasio.",
          "eccentricCue": "Desciende en 3 segundos sintiendo la tensión continua sin dejar caer el peso."
        },
        "searchQuery": "cable lateral raise behind back proper form",
        "warmup": "🔥 No ocupa."
      },
      {
        "id": "d4_e5",
        "unifiedCode": "[PECH-PEC_DECK-STACK_01]",
        "name": "Aperturas en Máquina Pec Deck (Pec Deck / Flyes)",
        "muscleGroup": "Pecho (Aislamiento Pectoral)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Flexión leve de codos. Piensa en juntar la parte interna de los bíceps en el centro del pecho para lograr una contracción máxima. Pausa de 1s en estiramiento y contracción.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "pec deck fly machine lengthened partials chest",
        "equivalents": [
          {
            "id": "d1_e4_eq1",
            "unifiedCode": "[PECH-CABLE_CROSS-MID_01]",
            "name": "Cruce de Poleas a Media Altura (Cable Crossover)",
            "desc": "Tensión continua en todo el rango.",
            "ratio": 0.8,
            "biomechanics": "Poleas a la altura del pecho medio. Paso al frente con torso ligeramente inclinado a 10° y abdomen firme.",
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
            "unifiedCode": "[PECH-FLY-MANC_FLAT_01]",
            "name": "Aperturas con Mancuernas en Banco Plano",
            "desc": "Gran tensión en máximo estiramiento.",
            "ratio": 0.4,
            "biomechanics": "Banco horizontal, mancuernas neutras. Codos flexionados a 15-20°. Descenso controlado hasta que los codos alcancen la altura del torso.",
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
          "internalCue": "No pienses en juntar las manos: piensa en intentar tocar la cara interna de ambos codos frente à tu corazón.",
          "externalCue": "Imagina que abrazas el tronco de una secoya gigante manteniendo los hombros pegados atrás.",
          "eccentricCue": "Abre los brazos en 3 segundos sintiendo el estiramiento máximo de las fibras pectorales hasta la horizontal."
        }
      },
      {
        "id": "d4_e6",
        "unifiedCode": "[ABDO-VACUUM-ISOM_01]",
        "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "20-25 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "Apnea espiratoria completa. Ombligo succionado hacia la columna para cerrar el perímetro de la cintura. De pie o apoyado en rodillas. Exhala todo el aire residual de los pulmones. Sin inhalar, expande la caja torácica aspirando el ombligo hacia la columna vertebral y hacia arriba bajo las costillas. Mantén 20 a 25 segundos en apnea espiratoria.",
        "warmup": "🔥 No ocupa (solo 2 exhalaciones profundas previas).",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d1_e8_eq1",
            "unifiedCode": "[ABDO-PLANK-ISOM_01]",
            "name": "Plancha Abdominal Isométrica Convencional",
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
        "id": "d4_cardio",
        "unifiedCode": "[CARD-ROW_HIIT_NEAT_01]",
        "name": "Cardio Matutino: Remo (Cardio vs. NEAT)",
        "muscleGroup": "Cardio",
        "isCardio": true,
        "machineType": "rower",
        "machine": "Máquina de Remo (Ergómetro)",
        "sets": 1,
        "reps": "35-40 min",
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Para anular el efecto de interferencia, estas sesiones deben realizarse por la mañana, separadas por al menos 6 horas de tu entrenamiento de fuerza.\n\n• Opción A: Sesión Híbrida (\"Cardio de verdad\" + NEAT) — Máximo 1 a 2 veces por semana\n- Duración Total: 35-40 minutos.\n- Fase 1 (Cardio HIIT / Vigoroso): 10-15 minutos. Realiza de 4 a 6 sprints de 20 segundos a máxima velocidad, seguidos de 40 a 60 segundos de remo muy suave para recuperar. El nivel de esfuerzo percibido (RPE) en el sprint debe ser de 16-18 sobre 20.\n- Fase 2 (NEAT / LISS): 20-25 minutos continuos a intensidad muy baja. Funciona como enfriamiento activo y suma gasto calórico sin añadir fatiga metabólica.\n\n• Opción B: Sesión Pura de NEAT (LISS) — 2 a 3 veces por semana\n- Duración Total: 30-45 minutos.\n- Intensidad (Talk Test): Nivel de esfuerzo (RPE) de 12 a 13 sobre 20. Debes poder mantener una conversación fluida o respirar cómodamente por la nariz sin jadear.\n- Objetivo: Simular los pasos y la actividad que no realizas por tu trabajo sedentario. No debes terminar exhausto ni con los músculos ardiendo.",
        "warmup": "🔥 3 minutos de remo progresivo muy suave antes de iniciar.",
        "searchQuery": "rowing machine hiit neat morning protocol",
        "equivalents": [
          {
            "id": "d4_cardio_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
            "desc": "Bajo impacto con zancada lenta.",
            "ratio": 1,
            "biomechanics": "Caminadora a 10-12% inclinación a 4.0 km/h manteniendo 120-135 BPM.",
            "searchQuery": "incline treadmill zone 2 cardio form"
          }
        ]
      }
    ]
  },
  {
    "id": "d5",
    "dayNumber": 5,
    "name": "Viernes: Piernas 2 (Cadena Posterior, Isquios & Glúteos)",
    "type": "workout",
    "focus": "Tensión en elongación para isquiotibiales y glúteos. Seated Leg Curl #1 (cadera a 90°), Prensa pies altos #2, RDL en Smith/Barra #3 para sobrecarga pesada sin limitación de antebrazos, Glute Blaster #4 y Pantorrillas con pausa de 2 segundos en estiramiento.",
    "exercises": [
      {
        "id": "d5_e1",
        "unifiedCode": "[ISQU-LEG_CURL-SEATED_01]",
        "name": "Flexión de Femorales Sentado (Seated Leg Curl)",
        "muscleGroup": "Isquiotibiales (Flexores de Rodilla)",
        "loadFamily": "Familia Flexión de Femorales (Isquiotibiales)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Mantenlo como el #1 de tu rutina de viernes con SNC al 100%. Ajusta el rodillo superior firmemente contra los muslos. Entrenar los isquios con la cadera a 90° de flexión (sentado) produce un 44% más de hipertrofia que las versiones tumbadas debido al estiramiento inicial del músculo (Maeo 2021). Pausa de 1s en acortamiento y 3s en excéntrica.",
        "warmup": "🔥 1 serie de aproximación: 12-15 reps ligeras para lubricar la rodilla sin fatiga.",
        "searchQuery": "seated leg curl hamstring hypertrophy stretch",
        "equivalents": [
          {
            "id": "d5_e1_eq1",
            "unifiedCode": "[ISQU-LEG_CURL-LYING_01]",
            "name": "Flexión de Femorales Tumbado (Lying Leg Curl)",
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
            "id": "d5_e1_eq2",
            "unifiedCode": "[ISQU-NORDIC_CURL-ASSIST_01]",
            "name": "Curl Nórdico Asistido",
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
        "id": "d5_e2",
        "unifiedCode": "[GLUT-LEG_PRESS-HIGH_FEET_45]",
        "name": "Prensa 45° (Pies Altos y Abiertos para Glúteo)",
        "muscleGroup": "Glúteos & Isquiotibiales (Cadena Posterior)",
        "loadFamily": "Familia Prensa de Piernas",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Colocar los pies en el tercio superior de la plataforma minimiza la flexión de rodilla y maximiza la extensión de cadera, trasladando la carga directamente al glúteo mayor y femorales con cero carga axial sobre la columna. Rango profundo en 3 segundos; el sacro/coxis JAMÁS debe despegarse del respaldo.",
        "warmup": "🔥 Aproximación:\n• 1 serie × 8 reps con 50% de peso de trabajo.",
        "searchQuery": "leg press feet high wide glute focus",
        "equivalents": [
          {
            "id": "d5_e2_eq1",
            "unifiedCode": "[GLUT-HIP_THRUST-MAQ_01]",
            "name": "Empuje de Cadera en Máquina Guiada o Barra (Hip Thrust)",
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
        "id": "d5_e3",
        "unifiedCode": "[ISQU-RDL-SMITH_01]",
        "name": "Peso Muerto Rumano (RDL) en Máquina Smith o Barra",
        "muscleGroup": "Isquiotibiales & Glúteos (Cadena Posterior Elongada)",
        "loadFamily": "Familia Peso Muerto Rumano / Bisagra Cadera",
        "sets": 3,
        "reps": "8-10",
        "restTime": "180-240 s",
        "defaultUnit": "lbs",
        "biomechanics": "Reemplaza las mancuernas para permitir una verdadera sobrecarga progresiva pesada sin que falle el agarre de los antebrazos. Bisagra de cadera pura empujando los glúteos hacia atrás con la zona lumbar rígida hasta sentir estiramiento profundo en los isquiotibiales.",
        "warmup": "🔥 1 serie de aproximación: 8 reps con 50% de la carga de trabajo.",
        "searchQuery": "romanian deadlift rdl dumbell smith machine technique",
        "equivalents": [
          {
            "id": "d5_e3_eq1",
            "unifiedCode": "[ISQU-RDL-BARBELL_01]",
            "name": "Peso Muerto Rumano con Barra Libre (RDL)",
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
            "id": "d5_e3_eq2",
            "unifiedCode": "[ISQU-RDL-MANC_01]",
            "name": "Peso Muerto Rumano (RDL) con Mancuernas",
            "desc": "Variante clásica con mancuernas.",
            "ratio": 1,
            "biomechanics": "Bisagra de cadera pura con mancuernas rozando las tibias.",
            "mindMuscle": {
              "title": "Isquiotibiales con Mancuernas",
              "internalCue": "Empuja los isquiones hacia la pared de atrás.",
              "externalCue": "Clava los talones al suelo al extender la cadera.",
              "eccentricCue": "Baja en 3 segundos sintiendo el estiramiento profundo."
            },
            "searchQuery": "Peso Muerto Rumano con Mancuernas tecnica",
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
        "unifiedCode": "[GLUT-BUTT_BLASTER-MAQ_01]",
        "name": "Glute Butt Blaster en Máquina",
        "muscleGroup": "Glúteo Mayor (Extensión de Cadera)",
        "isUnilateral": true,
        "loadFamily": "Familia Extensión de Cadera / Glúteo",
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Empuje focalizado con el talón. Contracción estática de 1 segundo arriba para aislamiento puro del glúteo mayor.",
        "warmup": "🔥 No ocupa (cadena posterior caliente).",
        "searchQuery": "butt blaster glute kick machine form",
        "equivalents": [
          {
            "id": "d5_e4_eq1",
            "unifiedCode": "[GLUT-ROMAN_CHAIR-45_01]",
            "name": "Extensiones a 45° en Banco Romano para Glúteo",
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
            "unifiedCode": "[GLUT-CABLE_KICK-ANKLE_01]",
            "name": "Patada de Glúteo en Polea con Tobillera",
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
        "id": "d5_e5",
        "unifiedCode": "[PANT-CALF_RAISE-MAQ_01]",
        "name": "Elevación de Pantorrillas en Máquina (Pausa 2s Estiramiento)",
        "muscleGroup": "Pantorrillas (Gastrocnemio & Sóleo)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "90-120 s",
        "defaultUnit": "lbs",
        "biomechanics": "2 segundos de pausa en el fondo. Esto anula por completo el rebote elástico del tendón de Aquiles, obligando al sóleo y gastrocnemio a mover la carga al 100%. Subida explosiva sobre los metatarsos apretando 1s arriba.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "calf raises stretch pause high reps",
        "equivalents": [
          {
            "id": "d5_e5_eq1",
            "unifiedCode": "[PANT-CALF_RAISE-SMITH_01]",
            "name": "Elevación de Pantorrillas en Smith sobre Escalón",
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
        "id": "d5_e6",
        "unifiedCode": "[ABDO-VACUUM-ISOM_01]",
        "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "20-25 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "Transverso. De pie o apoyado en rodillas. Exhalación total del aire. Expande la caja torácica y aspira el ombligo hacia adentro por 20-25 segundos continuos.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d5_e6_eq1",
            "unifiedCode": "[ABDO-PLANK-ISOM_01]",
            "name": "Plancha Abdominal Isométrica Convencional",
            "desc": "Estabilidad y contracción del core.",
            "ratio": 1,
            "biomechanics": "Posición de cuatro apoyos en colchoneta. Aspiración diafragmática de 15 a 20 segundos.",
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
        "id": "d5_cardio",
        "unifiedCode": "[CARD-ROW_HIIT_NEAT_01]",
        "name": "Cardio Matutino: Remo (Cardio vs. NEAT)",
        "muscleGroup": "Cardio",
        "isCardio": true,
        "machineType": "rower",
        "machine": "Máquina de Remo (Ergómetro)",
        "sets": 1,
        "reps": "35-40 min",
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Para anular el efecto de interferencia, estas sesiones deben realizarse por la mañana, separadas por al menos 6 horas de tu entrenamiento de fuerza.\n\n• Opción A: Sesión Híbrida (\"Cardio de verdad\" + NEAT) — Máximo 1 a 2 veces por semana\n- Duración Total: 35-40 minutos.\n- Fase 1 (Cardio HIIT / Vigoroso): 10-15 minutos. Realiza de 4 a 6 sprints de 20 segundos a máxima velocidad, seguidos de 40 a 60 segundos de remo muy suave para recuperar. El nivel de esfuerzo percibido (RPE) en el sprint debe ser de 16-18 sobre 20.\n- Fase 2 (NEAT / LISS): 20-25 minutos continuos a intensidad muy baja. Funciona como enfriamiento activo y suma gasto calórico sin añadir fatiga metabólica.\n\n• Opción B: Sesión Pura de NEAT (LISS) — 2 a 3 veces por semana\n- Duración Total: 30-45 minutos.\n- Intensidad (Talk Test): Nivel de esfuerzo (RPE) de 12 a 13 sobre 20. Debes poder mantener una conversación fluida o respirar cómodamente por la nariz sin jadear.\n- Objetivo: Simular los pasos y la actividad que no realizas por tu trabajo sedentario. No debes terminar exhausto ni con los músculos ardiendo.",
        "warmup": "🔥 3 minutos de remo progresivo muy suave antes de iniciar.",
        "searchQuery": "rowing machine hiit neat morning protocol",
        "equivalents": [
          {
            "id": "d5_cardio_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
            "desc": "Bajo impacto con zancada lenta.",
            "ratio": 1,
            "biomechanics": "Caminadora a 10-12% inclinación a 4.0 km/h manteniendo 120-135 BPM.",
            "searchQuery": "incline treadmill zone 2 cardio form"
          }
        ]
      }
    ]
  },
  {
    "id": "d6",
    "dayNumber": 6,
    "name": "Sábado: Jalón 2 (Fibras Bajas del Dorsal, Amplitud & Brazos)",
    "type": "workout",
    "focus": "Enfoque en fibras bajas e ilíacas del dorsal con agarre estrecho neutro, remo con apoyo esternal, aislamiento en elongación con pull-over, y bíceps maestro en estiramiento humeral (Bayesian Curl). Cero elevaciones laterales para permitir la recuperación de hombros tras el jueves.",
    "exercises": [
      {
        "id": "d6_e1",
        "unifiedCode": "[ESPA-PULLDOWN-V_GRIP_01]",
        "name": "Jalón al Pecho Agarre Estrecho Neutro (V-Grip)",
        "muscleGroup": "Espalda (Dorsal Inferior & V-Taper)",
        "loadFamily": "Familia Jalón Vertical Dorsal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "120-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Inicia el movimiento deprimiendo las escápulas. En el agarre neutro estrecho, dirige los codos rozando las costillas hacia el esternón bajo para alinear la tracción con las fibras lumbares e ilíacas del dorsal ancho.",
        "warmup": "🔥 1 serie de 10 reps con 50% del peso de trabajo.",
        "searchQuery": "close grip neutral lat pulldown lower lats v grip",
        "equivalents": [
          {
            "id": "d6_e1_eq_wide",
            "unifiedCode": "[ESPA-PULLDOWN-WIDE_01]",
            "name": "Jalón al Pecho en Polea (Agarre Ancho Pronado)",
            "desc": "Constructor de amplitud con agarre amplio thumbless.",
            "ratio": 1,
            "biomechanics": "Agarre 1.5 anchos de hombro con agarre thumbless. Tracciona llevando los codos hacia las costillas y clavando las escápulas.",
            "mindMuscle": {
              "title": "Dorsal Ancho en Amplitud Pronada",
              "internalCue": "Piensa en clavar los codos en los bolsillos del pantalón.",
              "externalCue": "Baja la barra hacia la parte alta del esternón.",
              "eccentricCue": "Controla el retorno en 3 segundos permitiendo que las escápulas suban con control."
            },
            "searchQuery": "lat pulldown wide grip form",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps."
          },
          {
            "id": "d6_e1_eq1",
            "unifiedCode": "[ESPA-PULLDOWN-SUPINE_01]",
            "name": "Jalón con Agarre Supino (al Ancho de Hombros)",
            "desc": "Mayor ayuda de flexores para sobrecarga dorsal.",
            "ratio": 1,
            "biomechanics": "Polea alta con agarre supino o maneral individual. Tracción unilateral pegando el codo a la cadera con ligera flexión lateral de torso.",
            "mindMuscle": {
              "title": "Jalón Supino Dorsal en Polea",
              "internalCue": "Aísla el dorsal llevando el codo al costado del cuerpo.",
              "externalCue": "Tracciona la barra hacia el esternón bajo.",
              "eccentricCue": "Permite que el cable estire el dorsal hacia arriba en 3 segundos."
            },
            "searchQuery": "Jalón con agarre supino (al ancho de hombros) tecnica biomecanica",
            "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps."
          },
          {
            "id": "d6_e1_eq2",
            "unifiedCode": "[ESPA-CHINUP-CLOSE_NEUTRAL_01]",
            "name": "Dominadas Neutras Cerradas",
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
        "unifiedCode": "[ESPA-SEATED_ROW-GIRONDA_01]",
        "name": "Remo Compuesto en Máquina (Apoyo al Pecho)",
        "muscleGroup": "Espalda (Densidad Dorsal Media & Trapecio)",
        "loadFamily": "Familia Remo Horizontal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "120-180 s",
        "defaultUnit": "lbs",
        "biomechanics": "El soporte en el pecho aísla la espalda alta y protege la zona lumbar. Permite que tus omóplatos se separen en la bajada y júntalos con fuerza al jalar.",
        "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
        "searchQuery": "machine row compound back thickness seated cable row",
        "equivalents": [
          {
            "id": "d6_e2_eq1",
            "unifiedCode": "[ESPA-ONE_ARM_ROW-MANC_01]",
            "name": "Remo con Mancuerna a una Mano apoyado en Banco",
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
        "unifiedCode": "[ESPA-PULLOVER-HIGH_CABLE_01]",
        "name": "Pull-Over en Polea Alta con Cuerda",
        "muscleGroup": "Espalda (Aislamiento Dorsal Ancho)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Torso inclinado a 45°. Codos con una ligera flexión bloqueada. Describe un arco amplio desde arriba de la cabeza hasta los muslos manteniendo la tensión constante en el dorsal.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable straight arm pullover lat isolation rope",
        "equivalents": [
          {
            "id": "d3_e3_eq1",
            "unifiedCode": "[ESPA-PULLOVER-MANC_01]",
            "name": "Pull-Over con Mancuerna sobre Banco",
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
            "unifiedCode": "[ESPA-PULLOVER-MAQ_01]",
            "name": "Máquina de Pullover Guiada",
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
        "id": "d6_e4",
        "unifiedCode": "[BICEP-CABLE_CURL-BAYESIAN_01]",
        "name": "Bayesian Cable Curl (Estiramiento Humeral en Polea)",
        "muscleGroup": "Bíceps (Estiramiento Humeral)",
        "isUnilateral": true,
        "sets": 3,
        "reps": "10-12",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "De espaldas a la polea baja, da un paso al frente para que tu codo quede detrás de tu torso. Esto estira la cabeza larga del bíceps al máximo bajo tensión constante. Supina el agarre al subir. Sustituye las series redundantes y elimina el volumen basura.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "bayesian cable curl behind back bicep stretch",
        "equivalents": [
          {
            "id": "d3_e5_eq_cable",
            "unifiedCode": "[BICEP-CABLE_CURL-LOW_STRAIGHT_01]",
            "name": "Curl de Bíceps en Polea Baja (Barra Recta)",
            "desc": "Tensión mecánica continua con codos pegados al torso.",
            "ratio": 1,
            "biomechanics": "Codos clavados como bisagras en las costillas. Pico concéntrico de 1 segundo arriba. Polea baja con barra recta o corta.",
            "mindMuscle": {
              "title": "Bíceps Braquial & Braquial Anterior",
              "internalCue": "Aprieta los bíceps con fuerza en la cima.",
              "externalCue": "Lleva la barra hacia tu barbilla con codos inmóviles.",
              "eccentricCue": "Desciende la barra en 2 a 3 segundos."
            },
            "searchQuery": "cable straight bar bicep curl proper form",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d3_e5_eq1",
            "unifiedCode": "[BICEP-INCLINE_CURL-MANC_60_01]",
            "name": "Curl de Bíceps con Mancuernas (Sentado en Banco a 60°)",
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
          },
          {
            "id": "d3_e5_eq_scott",
            "unifiedCode": "[BICEP-PREACHER_CURL-SCOTT_MAQ_01]",
            "name": "Curl de Bíceps en Banco Scott o Máquina Predicador",
            "desc": "Aislamiento estricto de cabeza corta y pico.",
            "ratio": 0.9,
            "biomechanics": "Tríceps y axilas firmemente apoyados sobre la almohadilla inclinada a 45°. Aislamiento puro sin inercia.",
            "mindMuscle": {
              "title": "Bíceps Braquial en Banco Scott",
              "internalCue": "Siente cómo el bíceps hace todo el trabajo sin ayuda.",
              "externalCue": "Tracciona hacia la frente con codos inmóviles.",
              "eccentricCue": "Baja en 3 segundos muy controlados."
            },
            "searchQuery": "preacher curl machine scott arm curl isolation",
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
        "id": "d6_e5",
        "unifiedCode": "[HOMB-FACE_PULL-HIGH_CABLE_01]",
        "name": "Face Pulls en Polea Alta con Cuerda",
        "muscleGroup": "Hombro Posterior & Manguito Rotador",
        "sets": 4,
        "reps": "12-15",
        "restTime": "90 s",
        "defaultUnit": "lbs",
        "biomechanics": "Dirige el centro de la cuerda hacia el puente de la nariz mientras separas las manos hacia las orejas, rotando los hombros externamente para máxima salud del manguito rotador y trapecio inferior.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable face pull external rotation rear delt",
        "equivalents": [
          {
            "id": "d3_e4_eq1",
            "unifiedCode": "[HOMB-REAR_DELT-PEC_DECK_01]",
            "name": "Pájaros en Pec Deck Inverso (Reverse Flyes)",
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
            "unifiedCode": "[HOMB-REAR_DELT-CABLE_01]",
            "name": "Reverse Cable Flyes en Poleas",
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
        "id": "d6_e6",
        "unifiedCode": "[ABDO-VACUUM-ISOM_01]",
        "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "20-25 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "Transverso. De pie o apoyado en rodillas. Exhalación total del aire. Expande la caja torácica y aspira el ombligo hacia adentro por 20-25 segundos continuos.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d6_e7_eq1",
            "unifiedCode": "[ABDO-PLANK-ISOM_01]",
            "name": "Plancha Abdominal Isométrica Convencional",
            "desc": "Estabilidad y contracción del core.",
            "ratio": 1,
            "biomechanics": "Posición de cuatro apoyos en colchoneta. Aspiración diafragmática de 15 a 20 segundos.",
            "mindMuscle": {
              "title": "Plancha Vacío Abdominal en Cuadrupedia",
              "internalCue": "Aspira el abdomen hacia el techo.",
              "externalCue": "Pega el ombligo a la columna.",
              "eccentricCue": "Control respiratorio pausado."
            },
            "searchQuery": "Plancha Isométrica tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e7_eq_pallof",
            "unifiedCode": "[ABDO-PALLOF_PRESS-CABLE_01]",
            "name": "Pallof Press en Polea (Anti-Rotación)",
            "desc": "Fuerza y control anti-rotacional de core.",
            "ratio": 1,
            "biomechanics": "Polea a la altura del esternón. De pie perpendicular a la polea con agarre doble frente al pecho. Extiende los brazos al frente en línea recta resistiendo el torque rotacional del cable.",
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
          "title": "Vacuum Abdominal (Transverso)",
          "internalCue": "Aprieta el transverso como un corsé de acero.",
          "externalCue": "Pega el ombligo contra la columna vertebral.",
          "eccentricCue": "Relaja de forma lenta al finalizar."
        }
      },
      {
        "id": "d6_cardio",
        "unifiedCode": "[CARD-ROW_HIIT_NEAT_01]",
        "name": "Cardio Matutino: Remo (Cardio vs. NEAT)",
        "muscleGroup": "Cardio",
        "isCardio": true,
        "machineType": "rower",
        "machine": "Máquina de Remo (Ergómetro)",
        "sets": 1,
        "reps": "35-40 min",
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Para anular el efecto de interferencia, estas sesiones deben realizarse por la mañana, separadas por al menos 6 horas de tu entrenamiento de fuerza.\n\n• Opción A: Sesión Híbrida (\"Cardio de verdad\" + NEAT) — Máximo 1 a 2 veces por semana\n- Duración Total: 35-40 minutos.\n- Fase 1 (Cardio HIIT / Vigoroso): 10-15 minutos. Realiza de 4 a 6 sprints de 20 segundos a máxima velocidad, seguidos de 40 a 60 segundos de remo muy suave para recuperar. El nivel de esfuerzo percibido (RPE) en el sprint debe ser de 16-18 sobre 20.\n- Fase 2 (NEAT / LISS): 20-25 minutos continuos a intensidad muy baja. Funciona como enfriamiento activo y suma gasto calórico sin añadir fatiga metabólica.\n\n• Opción B: Sesión Pura de NEAT (LISS) — 2 a 3 veces por semana\n- Duración Total: 30-45 minutos.\n- Intensidad (Talk Test): Nivel de esfuerzo (RPE) de 12 a 13 sobre 20. Debes poder mantener una conversación fluida o respirar cómodamente por la nariz sin jadear.\n- Objetivo: Simular los pasos y la actividad que no realizas por tu trabajo sedentario. No debes terminar exhausto ni con los músculos ardiendo.",
        "warmup": "🔥 3 minutos de remo progresivo muy suave antes de iniciar.",
        "searchQuery": "rowing machine hiit neat morning protocol",
        "equivalents": [
          {
            "id": "d6_cardio_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
            "desc": "Bajo impacto con zancada lenta.",
            "ratio": 1,
            "biomechanics": "Caminadora a 10-12% inclinación a 4.0 km/h manteniendo 120-135 BPM.",
            "searchQuery": "incline treadmill zone 2 cardio form"
          }
        ]
      }
    ]
  },
  {
    "id": "d7",
    "dayNumber": 7,
    "name": "Domingo: Descanso Activo / NEAT",
    "type": "rest",
    "focus": "Paseos ligeros al aire libre (8,000 a 10,000 pasos NEAT). NO cardio formal extenuante ni pesas. Hidratación, descanso del sistema nervioso central y recarga metabólica para iniciar el ciclo semanal al 100%.",
    "exercises": []
  }
];
