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
    "name": "Lunes: Empuje 1 (Haz Clavicular & Deltoides Lateral 3D)",
    "type": "workout",
    "focus": "Prioridad en haz clavicular y deltoides lateral 3D con parciales en estiramiento (0°-45°). Tríceps en elongación profunda tras nuca (cabeza larga = 65% del brazo). Pre-entreno óptimo: 40-50g carbos + sal y agua 1.5-2h antes para turgencia celular máxima.",
    "exercises": [
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
        "id": "d1_e5",
        "unifiedCode": "[HOMB-LAT_RAISE-MAQ_01]",
        "name": "Elevaciones Laterales en Máquina",
        "muscleGroup": "Hombro (Deltoides Lateral 3D)",
        "sets": 4,
        "reps": "12-15",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "Se adelantan al puesto #2 con el SNC fresco. Eje de la máquina alineado con el hombro (articulación glenohumeral). Almohadillas apoyadas en el tercio distal del brazo (justo arriba del codo). Torso ligeramente inclinado 10° adelante para alinear el deltoides lateral en el plano escapular. Haz 12-15 reps estrictas hasta que ya no puedas subir el peso a la horizontal; ¡NO sueltes el peso al fallar! Inmediatamente saca 4 a 6 repeticiones parciales en el tercio inferior (0° a 45° de abducción, Pedrosa 2022 / Kassiano 2023) controlando la bajada para inducir tensión mecánica descomunal en estiramiento sin riesgo articular.",
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
        "id": "d1_e2",
        "unifiedCode": "[PECH-INC_PRESS-NITRO_01]",
        "name": "Press Inclinado en Máquina (Nitro Incline)",
        "muscleGroup": "Pecho (Pectoral Superior Clavicular)",
        "loadFamily": "Familia Press Superior Inclinado",
        "sets": 3,
        "reps": "8-10",
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Estabilidad guiada para exprimir las fibras claviculares sin fatiga de estabilizadores. Lleva la 3ª serie a RIR 0. Asiento ajustado para que los mangos queden a nivel de las clavículas. Respaldo inclinado con apoyo lumbar firme. IAP: Presiona la espalda alta y glúteos contra el respaldo, llena el abdomen de aire para blindar el torso y empuja en trayectoria convergente sin despegar los hombros. En la última serie añade 2-3 repeticiones parciales en el fondo estirado.",
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
        "unifiedCode": "[PECH-PEC_DECK-STACK_01]",
        "name": "Aperturas en Máquina Pec Deck (Peacock / Flyes)",
        "muscleGroup": "Pecho (Aislamiento Pectoral)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Estiramiento horizontal puro. Abre el pecho, mantén microflexión de codos (15°) y aprieta 1s al centro. Retrae y deprime escápulas pegándolas al cojín. Pausa de 1s en estiramiento y 1s en contracción al centro. Al fallar concéntrico, sostén 5 segundos en estiramiento bajo tensión continua.",
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
        "unifiedCode": "[TRIC-OVERHEAD_EXT-CABLE_01]",
        "name": "Extensión de Tríceps Copa en Polea (Cuerda)",
        "muscleGroup": "Tríceps (Cabeza Larga en Estiramiento)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "El tríceps compone el 60-65% del volumen total del brazo; la cabeza larga otorga la masa y grosor visto de perfil. De espaldas a la polea, torso inclinado a 45°. Asegura una flexión profunda del codo por detrás de la cabeza para estirar al 100% la cabeza larga desde su origen en el tubérculo infraglenoideo de la escápula. Fija los codos como bisagras inmóviles, extiende separando los cabos de la cuerda bloqueando 1s al frente y resiste la fase excéntrica en 3 segundos sintiendo el estiramiento profundo bajo carga.",
        "warmup": "🔥 No ocupa.",
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
        "id": "d1_e8",
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
        "id": "d1_e9",
        "unifiedCode": "[CARD-TREADMILL-ZONA2_01]",
        "name": "Cardio Zona 2 en Caminadora",
        "muscleGroup": "Cardiovascular (Zona 2)",
        "sets": 1,
        "reps": "35-45 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Inclinación 11-12% a 3.8-4.2 km/h (120-135 BPM). Directo a oxidar ácidos grasos libres tras depletar glucógeno en el pecho. Cero impacto articular en rodillas, activación sostenida de gemelos y glúteos.",
        "warmup": "🔥 3 minutos progresivos a ritmo suave.",
        "searchQuery": "zone 2 cardio fat oxidation incline walk",
        "equivalents": [
          {
            "id": "d1_e9_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora en Inclinación (Zona 2)",
            "desc": "Bajo impacto articular y alto gasto calórico.",
            "ratio": 1,
            "biomechanics": "Caminadora a 3.8-4.2 km/h con inclinación del 11-12%.",
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
            "unifiedCode": "[CARD-BIKE-STATIONARY_01]",
            "name": "Bicicleta Estática (Zona 2)",
            "desc": "Cadencia fluida sin estrés plantar.",
            "ratio": 1,
            "biomechanics": "Bicicleta estática con resistencia moderada a 80-90 RPM. Cadencia constante con frecuencia cardíaca estable.",
            "mindMuscle": {
              "title": "Ciclismo Zona 2",
              "internalCue": "Pedaleo circular fluido empujando y halando suavemente los pedales.",
              "externalCue": "Mantén la cadencia continua.",
              "eccentricCue": "Respiración uniforme."
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
    "name": "Martes: Piernas 1 (Enfoque Cuádriceps & Vasto Medial)",
    "type": "workout",
    "focus": "Desarrollo masivo del tren inferior y cuádriceps mediante flexión profunda de rodilla con máxima estabilidad articular.",
    "exercises": [
      {
        "id": "d2_e3",
        "unifiedCode": "[CUAD-LEG_EXT-STACK_01]",
        "name": "Extensión de Cuádriceps en Máquina (Torre de Placas)",
        "muscleGroup": "Cuádriceps (Aislamiento Recto Femoral & Vasto Medial)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Lubrica el líquido sinovial rotuliano e inunda los cuádriceps de sangre antes de cargar las máquinas pesadas. El eje de giro de la máquina debe quedar alineado milimétricamente con el centro de la articulación de la rodilla. Almohadilla apoyada en el empeine/tobillo bajo. Sujeta con fuerza los mangos laterales para evitar que los glúteos se levanten del asiento al patear. Extensión completa arriba con pausa de 1 segundo; al fallar concéntrico, ejecuta 3 a 5 parciales en el fondo estirado.",
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
        "id": "d2_e1",
        "unifiedCode": "[CUAD-HACK_SQUAT-DISC_01]",
        "name": "Sentadilla en Máquina Hack (Hack Squat)",
        "muscleGroup": "Cuádriceps & Glúteo",
        "loadFamily": "Familia Sentadilla Hack",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180-240 s",
        "defaultUnit": "lbs",
        "biomechanics": "El rey de las piernas. Pies en la parte media-baja. Descenso profundo (flexión máxima de rodilla) con 3 segundos de bajada. RIR 1-2. Pies al ancho de caderas con ligera rotación externa (15°). Espalda lumbar y pelvis firmemente pegadas al respaldo. Permite que las rodillas viajen hacia adelante sobre las puntas de los pies para maximizar la flexión de rodilla y elongación de cuádriceps. IAP: Inhala profundo expandiendo la faja abdominal antes de descender, mantén la presión intra-abdominal conteniendo el aire durante la bajada (3s) y no rebotes en el fondo. Exhala superando la mitad de la subida.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de carga x 8 reps fluidas.\n• Serie 2: 75% de carga x 3 reps con cadencia controlada.",
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
        "name": "Prensa de Piernas Inclinada 45° (Discos)",
        "muscleGroup": "Cuádriceps & Tren Inferior",
        "loadFamily": "Familia Prensa de Piernas",
        "sets": 4,
        "reps": "10-12",
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Pies al ancho de hombros. Descenso profundo sin que el sacro despegue del respaldo. Enorme sobrecarga de cuádriceps y glúteo. Pies colocados en el centro de la plataforma al ancho de hombros. Espalda y sacro completamente pegados al asiento; NUNCA permitas retroversión pélvica ('butt wink') al fondo. Baja hasta que los muslos queden a unos 80-90° respecto al torso. IAP: Respira hondo antes de liberar la carga, mantén el torso inflado y las manos sujetando firmemente los mangos laterales para anclar la pelvis.",
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
        "id": "d2_e6",
        "unifiedCode": "[ABDU-ABDUCTOR-STACK_01]",
        "name": "Abductores en Máquina (Hip Abduction / Abrir Cadera)",
        "muscleGroup": "Glúteo Medio & Superior",
        "sets": 3,
        "reps": "12-15",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Torso inclinado 15° hacia adelante. Estimula el glúteo medio y superior, dando soporte a la cadera y forma a la pelvis. Sentado en máquina con la pelvis bien anclada al respaldo. Almohadillas en la cara externa de las rodillas. Abre las piernas al máximo rango posible y sostén 1 segundo la contracción.",
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
        "id": "d2_e7",
        "unifiedCode": "[PANT-CALF_RAISE-MAQ_01]",
        "name": "Elevación de Pantorrillas en Máquina (Rotary o de Pie)",
        "muscleGroup": "Pantorrillas (Gastrocnemio & Sóleo)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Regla de oro: 2 segundos de pausa completa en el punto más bajo (estiramiento) para anular el rebote elástico del tendón de Aquiles y obligar al sóleo/gastrocnemio a trabajar. Apoyo exclusivo en las almohadillas metatarsianas de los pies sobre el borde de la plataforma. Elevación concéntrica potente con 1s de contracción en piedra arriba.",
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
        "id": "d2_e9",
        "unifiedCode": "[CARD-TREADMILL-ZONA2_01]",
        "name": "Cardio Zona 2 en Caminadora",
        "muscleGroup": "Cardiovascular (Zona 2)",
        "sets": 1,
        "reps": "35-45 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Inclinación 10-11% a 3.5-3.8 km/h. Ritmo cardíaco sostenido en Zona 2 (120-135 BPM). Optimización del flujo sanguíneo, reciclaje de lactato y depuración metabólica sin fatiga periférica muscular.",
        "warmup": "🔥 3 minutos progresivos a ritmo suave.",
        "searchQuery": "zone 2 cardio incline treadmill fat burning",
        "equivalents": [
          {
            "id": "d2_e9_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora en Inclinación (Zona 2)",
            "desc": "Bajo impacto articular.",
            "ratio": 1,
            "biomechanics": "Caminadora a 3.5-3.8 km/h con inclinación del 10-11%.",
            "mindMuscle": {
              "title": "Caminata Inclinada Zona 2",
              "internalCue": "Camina erguido sin sujetar las barandillas.",
              "externalCue": "Empuja la cinta con cada zancada uniforme.",
              "eccentricCue": "Control del ritmo respiratorio."
            },
            "searchQuery": "Caminadora en Inclinación tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos."
          },
          {
            "id": "d2_e9_eq2",
            "unifiedCode": "[CARD-BIKE-STATIONARY_01]",
            "name": "Bicicleta Estática (Zona 2)",
            "desc": "Cadencia sin impacto articular.",
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
    "id": "d3",
    "dayNumber": 3,
    "name": "Miércoles: Jalón 1 (Amplitud V-Taper & Picos de Bíceps)",
    "type": "workout",
    "focus": "Amplitud dorsal V-Taper y sobrecarga en estiramiento humeral para bíceps (Bayesian Curl). Supinación activa llevando el meñique afuera/arriba y control excéntrico de 3s para reclutar el 100% de unidades motoras.",
    "exercises": [
      {
        "id": "d3_e1",
        "unifiedCode": "[ESPA-PULLDOWN-WIDE_01]",
        "name": "Jalón al Pecho en Polea (Agarre Ancho Pronado)",
        "muscleGroup": "Espalda (Amplitud Dorsal V-Taper)",
        "loadFamily": "Familia Jalón Vertical Dorsal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "El constructor del V-Taper. Agarre 1.5 anchos de hombro con agarre thumbless (pulgar montado). Tracciona llevando los codos hacia las costillas y clavando las escápulas. Barra a la parte superior del esternón. IAP: Inhala al estirar los brazos arriba, contén el aire mientras desciendes los codos y exhala al rozar la clavícula.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps (lubricación escapulohumeral).\n• Serie 2: 75% de la carga x 4 reps técnicas.",
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
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Cero estrés lumbar. Apoyo firme del esternón. Tracción horizontal enfocada en retraer escápulas y densificar la espalda media. Tira con los codos hacia atrás juntando las escápulas al final con pausa de 1 segundo.",
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
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Torso a 45°, brazos con microflexión fija (15°). Aísla el dorsal ancho en rango elongado sin fatigar los bíceps. Conduce las manos en un arco descendente amplio hacia los muslos sin doblar los codos.",
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
        "unifiedCode": "[HOMB-FACE_PULL-HIGH_CABLE_01]",
        "name": "Face Pulls en Polea Alta con Cuerda",
        "muscleGroup": "Hombro Posterior & Manguito Rotador",
        "sets": 4,
        "reps": "12-15",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Cuerda hacia el tabique nasal separando extremos con rotación externa. Construye el deltoides posterior (hombro 3D) y endereza la postura. Polea ajustada a la altura de los ojos o frente con cuerda doble. Sujeta la cuerda con agarre neutro o pulgares hacia atrás. Retrocede un paso. Pausa de 1 segundo atrás.",
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
        "id": "d3_e5",
        "unifiedCode": "[BICEP-CABLE_CURL-BAYESIAN_01]",
        "name": "Bayesian Cable Curl (Estiramiento Humeral en Polea)",
        "muscleGroup": "Bíceps (Estiramiento Humeral)",
        "isUnilateral": true,
        "sets": 3,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "De espaldas a la polea baja, codo por detrás del cuerpo para colocar la cabeza larga del bíceps en tensión máxima elongada. Deja que el brazo se estire completamente hacia atrás antes de iniciar la contracción. Al flexionar, supina activamente llevando el dedo meñique hacia afuera y arriba (recluta el 100% de las unidades motoras del bíceps distal). Fija el codo como una bisagra inmóvil detrás de la cadera y frena la fase excéntrica en 3 segundos sintiendo la tracción elongada.",
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
        "id": "d3_e6",
        "unifiedCode": "[BICEP-CABLE_CURL-LOW_STRAIGHT_01]",
        "name": "Curl de Bíceps en Polea Baja (Barra Recta)",
        "muscleGroup": "Bíceps (Tensión Continua)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Codos clavados como bisagras en las costillas sin balanceo de torso. Pico concéntrico apretando 1 segundo arriba con muñeca supinada activamente. Polea baja con barra recta. Controla la fase excéntrica en 3 segundos continuos sintiendo la tracción constante del cable desde el grado cero sin soltar la tensión en el fondo.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable straight bar bicep curl proper form",
        "equivalents": [
          {
            "id": "d3_e6_eq_bayes",
            "unifiedCode": "[BICEP-CABLE_CURL-BAYESIAN_01]",
            "name": "Bayesian Cable Curl (Estiramiento Humeral en Polea)",
            "desc": "De espaldas a la polea baja, máxima tensión en estiramiento.",
            "ratio": 0.8,
            "biomechanics": "De espaldas a la polea baja, codo por detrás del cuerpo. Pone la cabeza larga del bíceps en tensión máxima elongada. Pausa de 1s arriba.",
            "mindMuscle": {
              "title": "Bíceps Braquial (Cabeza Larga en Estiramiento Humeral)",
              "internalCue": "Siente cómo el tendón del bíceps se alarga al máximo detrás de tu cuerpo.",
              "externalCue": "Curl hacia adelante y arriba manteniendo el codo anclado.",
              "eccentricCue": "Deja que el cable jale tu brazo hacia atrás en 3 segundos completos."
            },
            "searchQuery": "bayesian cable curl behind back bicep stretch",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d3_e6_eq_incline",
            "unifiedCode": "[BICEP-INCLINE_CURL-MANC_60_01]",
            "name": "Curl de Bíceps con Mancuernas (Sentado en Banco a 60°)",
            "desc": "La inclinación hacia atrás elonga la cabeza larga del bíceps.",
            "ratio": 0.5,
            "biomechanics": "Banco inclinado a 60°, brazos colgando detrás del torso con máxima elongación. Supinación activa en el ascenso.",
            "mindMuscle": {
              "title": "Curl Inclinado con Mancuernas a 60°",
              "internalCue": "Inicia la contracción desde el estiramiento completo del bíceps.",
              "externalCue": "Curl hacia arriba y afuera con supinación activa.",
              "eccentricCue": "Desciende en 3 segundos lentos."
            },
            "searchQuery": "incline dumbbell bicep curl 60 degrees",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d3_e6_eq1",
            "unifiedCode": "[BICEP-BARBELL_CURL-EZ_BAR_01]",
            "name": "Curl con Barra Z de Pie",
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
            "unifiedCode": "[BICEP-PREACHER_CURL-SCOTT_MAQ_01]",
            "name": "Curl de Bíceps en Banco Scott o Máquina Predicador",
            "desc": "Aislamiento estricto de pico.",
            "ratio": 0.9,
            "biomechanics": "Tríceps apoyados en almohadilla a 45°. Aislamiento puro de cabeza corta.",
            "mindMuscle": {
              "title": "Bíceps Braquial en Banco Scott",
              "internalCue": "Siente la tensión directa en la bola del bíceps.",
              "externalCue": "Lleva la barra hacia la frente con codos inmóviles.",
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
        "id": "d3_e8",
        "unifiedCode": "[CARD-TREADMILL-ZONA2_01]",
        "name": "Cardio Zona 2 en Caminadora",
        "muscleGroup": "Cardiovascular (Zona 2)",
        "sets": 1,
        "reps": "35-45 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Inclinación 11-12% a 3.8-4.2 km/h. Ritmo cardíaco sostenido entre 60% y 70% de la frecuencia cardíaca máxima (120-135 BPM). Optimización del flujo sanguíneo, reciclaje de lactato y depuración metabólica sin fatiga periférica muscular.",
        "warmup": "🔥 3 minutos progresivos a ritmo suave.",
        "searchQuery": "zone 2 stationary bike endurance fat burning",
        "equivalents": [
          {
            "id": "d3_e8_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora en Inclinación (Zona 2)",
            "desc": "Bajo impacto articular.",
            "ratio": 1,
            "biomechanics": "Caminadora a 3.8-4.2 km/h con inclinación del 11-12%.",
            "mindMuscle": {
              "title": "Caminata Inclinada Zona 2",
              "internalCue": "Camina erguido sin sujetar las barandillas.",
              "externalCue": "Empuja la cinta con cada zancada uniforme.",
              "eccentricCue": "Control del ritmo respiratorio."
            },
            "searchQuery": "Caminadora en Inclinación tecnica biomecanica",
            "warmup": "🔥 3 minutos progresivos."
          },
          {
            "id": "d3_e8_eq2",
            "unifiedCode": "[CARD-ELLIPTICAL-ZONA2_01]",
            "name": "Elíptica (Zona 2)",
            "desc": "Cadencia sin impacto articular.",
            "ratio": 1,
            "biomechanics": "Elíptica con resistencia moderada. Cero impacto.",
            "mindMuscle": {
              "title": "Elíptica Zona 2",
              "internalCue": "Movimiento fluido sin golpear los pedales.",
              "externalCue": "Mantén la cadencia continua.",
              "eccentricCue": "Respiración diafragmática nasal constante."
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
    "name": "Jueves: Empuje 2 (Pectoral Esternal & Deltoides en Polea)",
    "type": "workout",
    "focus": "Pectoral esternal pesado (PR 140 lbs), deltoides lateral en polea tras espalda con parciales elongadas (0°-45°), frecuencia 2 en pecho alto (Nitro) y tríceps pushdown apretando 1s abajo (65% del brazo).",
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
        "biomechanics": "Tu ejercicio estrella de fuerza (PR 140 lbs). Escápulas pegadas y deprimidas. Mantén 2-3 segundos de bajada excéntrica. 3-4 minutos de descanso entre series te permitirán no perder repeticiones en las series posteriores. Asiento calibrado para que los manerales queden exactamente a la altura de la parte media del esternón (fibras esternocostales). IAP: Toma aire profundo al diafragma antes de empujar, mantén el torso inflado en la bajada (3s) y exhala al superar la mitad concéntrica.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps.",
        "searchQuery": "machine chest press flat hammer strength form",
        "equivalents": [
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
        "id": "d4_e4",
        "unifiedCode": "[HOMB-LAT_RAISE-BEHIND_CABLE_01]",
        "name": "Elevaciones Laterales en Polea Baja (Tras Espalda)",
        "muscleGroup": "Hombro (Deltoides Lateral)",
        "isUnilateral": true,
        "sets": 4,
        "reps": "12-15",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "El cable pasa por detrás de los glúteos proporcionando tensión mecánica continua desde los 0° de abducción (zona de máxima respuesta hipertrófica según Pedrosa 2022 / Kassiano 2023). Sostén el poste con la mano libre e inclina el torso 10-15° hacia afuera. Eleva el brazo en el plano escapular (30° adelantado) hasta la horizontal; al fallar en la última serie, ¡NO sueltes el maneral! Inmediatamente saca de 4 a 6 repeticiones parciales en el tercio inferior (0° a 45°) controlando la bajada para exprimir la tensión mecánica en estiramiento.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable lateral raise behind back deltoid isolation",
        "equivalents": [
          {
            "id": "d4_e4_eq1",
            "unifiedCode": "[HOMB-LAT_RAISE-MAQ_01]",
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
            "unifiedCode": "[HOMB-LAT_RAISE-MANC_01]",
            "name": "Elevaciones Laterales con Mancuernas",
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
          "title": "Deltoides Lateral (Tensión Continua tras Espalda & Parciales)",
          "internalCue": "Lidera con el codo manteniendo el hombro deprimido. Al fallar en la horizontal, saca 4 a 6 parciales en el tercio inferior.",
          "externalCue": "Lanza la mano hacia la esquina del techo más alejada de tu cuerpo.",
          "eccentricCue": "Resiste el tirón del cable en 3 segundos sintiendo la tracción constante detrás de la espalda."
        }
      },
      {
        "id": "d4_e2",
        "unifiedCode": "[PECH-INC_PRESS-NITRO_01]",
        "name": "Press Inclinado en Máquina (Nitro Incline)",
        "muscleGroup": "Pecho (Pectoral Superior Clavicular)",
        "loadFamily": "Familia Press Superior Inclinado",
        "sets": 3,
        "reps": "8-10",
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Frecuencia 2 para asegurar que el haz clavicular crezca a la par del esternal. Asiento calibrado a nivel clavicular. Trayectoria convergente con máxima carga en el tercio superior del pecho. Escápulas pegadas al respaldo. Realiza 2 a 3 repeticiones parciales en estiramiento al llegar al fallo.",
        "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
        "searchQuery": "incline chest press machine form",
        "equivalents": [
          {
            "id": "d4_e2_eq1",
            "unifiedCode": "[PECH-INC_PRESS-MANC_30]",
            "name": "Press Inclinado con Mancuernas (Banco a 30°)",
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
            "unifiedCode": "[PECH-INC_PRESS-SMITH_01]",
            "name": "Press Inclinado en Multipower (Smith) a 30°",
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
        "unifiedCode": "[PECH-PEC_DECK-STACK_01]",
        "name": "Aperturas en Máquina Pec Deck (Peacock / Flyes)",
        "muscleGroup": "Pecho (Aislamiento Pectoral)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Bombeo y estiramiento transversal. Abraza el barril imaginario. Codos a la altura media del pecho con 15° de flexión constante. Retracción y depresión escapular completa. Pausa de 1s en contracción.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "pec deck flyes chest isolation technique",
        "equivalents": [
          {
            "id": "d4_e3_eq1",
            "unifiedCode": "[PECH-CABLE_CROSS-MID_01]",
            "name": "Cruce de Poleas a Media Altura (Cable Crossover)",
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
            "unifiedCode": "[PECH-CABLE_CROSS-LOW_01]",
            "name": "Cruce de Poleas Bajas (Cable Crossover)",
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
        "id": "d4_e6",
        "unifiedCode": "[TRIC-PUSHDOWN-CABLE_01]",
        "name": "Extensión de Tríceps en Polea (Pushdown con Cuerda o Barra)",
        "muscleGroup": "Tríceps (Cabeza Lateral)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "El tríceps compone el 60-65% del volumen total del brazo; el grosor y amplitud frontal dependen directamente de la cabeza lateral. Barra recta o V. Codos bloqueados y anclados al torso como bisagras inmóviles. Tronco ligeramente inclinado 10° adelante. Al descender, bloquea por completo los codos y aprieta 1 segundo entero con contracción isométrica máxima. Controla la fase excéntrica en 3 segundos continuos sin separar los codos de las costillas.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "triceps pushdown straight v bar cable form",
        "equivalents": [
          {
            "id": "d4_e5",
            "unifiedCode": "[TRIC-SEATED_EXT-MAQ_01]",
            "name": "Extensión de Tríceps en Máquina Sentado",
            "desc": "Aislamiento guiado con apoyo de codos.",
            "ratio": 1.2,
            "biomechanics": "Sentado con codos fijados sobre el rodillo de apoyo alineados con el eje de rotación. Empuja hacia abajo con contracción estricta de 1s.",
            "mindMuscle": {
              "title": "Tríceps en Máquina de Aislamiento",
              "internalCue": "Aprieta la cara posterior del brazo contra las almohadillas al bloquear los codos.",
              "externalCue": "Empuja las palancas hacia el suelo con fuerza constante.",
              "eccentricCue": "Permite que los mangos suban en 3 segundos sin despegar los codos."
            },
            "searchQuery": "triceps extension machine seated proper form",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d4_e6_eq1",
            "unifiedCode": "[TRIC-KATANA_EXT-CABLE_01]",
            "name": "Extensión Cruzada Katana en Poleas (Katana Extension)",
            "desc": "Alineación perfecta con la cabeza larga.",
            "ratio": 0.8,
            "biomechanics": "Polea alta con barra en V o cuerdas cruzadas. Agarre firme con empuje continuo.",
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
          "title": "Tríceps (Cabeza Lateral - 65% del Brazo)",
          "internalCue": "Clava los codos a los costados, extiende bloqueando y aprieta 1 segundo entero sintiendo la cabeza lateral arder.",
          "externalCue": "Empuja la barra directo hacia abajo hacia los muslos como doblando el metal.",
          "eccentricCue": "Sube en 3 segundos continuos hasta la altura del esternón sin mover los codos de su eje."
        }
      },
      {
        "id": "d4_e7",
        "unifiedCode": "[ABDO-VACUUM-ISOM_01]",
        "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 4,
        "reps": "20-25 s",
        "isTime": true,
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "Compactación de cintura. Apnea espiratoria completa. Ombligo succionado hacia la columna para cerrar el perímetro de la cintura. Mantén 20-25 segundos continuos.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "stomach vacuum exercise waist tightening",
        "equivalents": [
          {
            "id": "d4_e7_eq1",
            "unifiedCode": "[ABDO-PLANK-ISOM_01]",
            "name": "Plancha Abdominal Isométrica Convencional",
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
      },
      {
        "id": "d4_e9",
        "unifiedCode": "[CARD-TREADMILL-ZONA2_01]",
        "name": "Cardio Zona 2 en Caminadora",
        "muscleGroup": "Cardiovascular (Zona 2)",
        "sets": 1,
        "reps": "35-45 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Inclinación 11-12% a 3.8-4.2 km/h (120-135 BPM). Directo a oxidar ácidos grasos libres tras depletar glucógeno en el pecho. Cero impacto articular en rodillas, activación sostenida de gemelos y glúteos.",
        "warmup": "🔥 3 minutos progresivos a ritmo suave.",
        "searchQuery": "zone 2 cardio fat oxidation incline walk",
        "equivalents": [
          {
            "id": "d4_e9_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora en Inclinación (Zona 2)",
            "desc": "Bajo impacto articular y alto gasto calórico.",
            "ratio": 1,
            "biomechanics": "Caminadora a 3.8-4.2 km/h con inclinación del 11-12%.",
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
            "id": "d4_e9_eq2",
            "unifiedCode": "[CARD-BIKE-STATIONARY_01]",
            "name": "Bicicleta Estática (Zona 2)",
            "desc": "Cadencia fluida sin estrés plantar.",
            "ratio": 1,
            "biomechanics": "Bicicleta estática con resistencia moderada a 80-90 RPM. Cadencia constante con frecuencia cardíaca estable.",
            "mindMuscle": {
              "title": "Ciclismo Zona 2",
              "internalCue": "Pedaleo circular fluido empujando y halando suavemente los pedales.",
              "externalCue": "Mantén la cadencia continua.",
              "eccentricCue": "Respiración uniforme."
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
    "id": "d5",
    "dayNumber": 5,
    "name": "Viernes: Piernas 2 (Cadena Posterior, Isquios & Glúteos)",
    "type": "workout",
    "focus": "Cadena posterior con flexión en rango elongado (Maeo 2021: cadera a 90°), sobrecarga en Prensa 45° pies altos, RDL con mancuernas, Butt Blaster, abductores y pantorrillas con pausa de 2s.",
    "exercises": [
      {
        "id": "d5_e2",
        "unifiedCode": "[ISQU-LEG_CURL-SEATED_01]",
        "name": "Flexión de Femorales Sentado (Seated Leg Curl)",
        "muscleGroup": "Isquiotibiales (Flexores de Rodilla)",
        "loadFamily": "Familia Flexión de Femorales (Isquiotibiales)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "120-150 s",
        "defaultUnit": "lbs",
        "biomechanics": "Preactivación y elongación de isquiotibiales (Maeo 2021: los isquios crecen más cuando la cadera está a 90° flexionada). Respaldo ajustado para que la rodilla coincida con el eje de rotación. Ajusta bien la almohadilla superior sobre los muslos para anclar la pelvis firmemente. Tobillos en dorsiflexión activa. Flexión controlada hacia abajo, pausa de 1s en la contracción abajo, y retorno lento (3s excéntrica) sintiendo cómo los isquios se estiran bajo tensión.",
        "warmup": "🔥 Aproximación:\n• 1 serie × 10 reps ligeras (~60 lbs) para lubricar la rodilla sin fatiga.",
        "searchQuery": "seated leg curl hamstring hypertrophy stretch",
        "equivalents": [
          {
            "id": "d5_e2_eq1",
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
            "id": "d5_e2_eq2",
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
        "id": "d5_e3",
        "unifiedCode": "[GLUT-LEG_PRESS-HIGH_FEET_45]",
        "name": "Prensa 45° (Pies Altos y Abiertos para Glúteo)",
        "muscleGroup": "Glúteos & Isquiotibiales (Cadena Posterior)",
        "loadFamily": "Familia Prensa de Piernas",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180-240 s",
        "defaultUnit": "lbs",
        "biomechanics": "Pies en el tercio superior de la plataforma con puntas a 30° afuera. Transfiere la sobrecarga directamente a glúteo mayor y femorales con cero carga axial sobre la columna. Rango de movimiento: Descenso profundo hasta que los muslos rocen los costados del torso, pero ¡el sacro/coxis JAMÁS debe despegarse del respaldo!.",
        "warmup": "🔥 Feeder Sets de aproximación:\n• Feeder 1: 180 lbs × 8 reps\n• Feeder 2: 270 lbs × 6 reps (sin fatiga).",
        "searchQuery": "leg press feet high wide glute focus",
        "equivalents": [
          {
            "id": "d5_e3_eq1",
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
        "id": "d5_e1",
        "unifiedCode": "[ISQU-RDL-MANC_01]",
        "name": "Peso Muerto Rumano (RDL) con Mancuernas",
        "muscleGroup": "Isquiotibiales & Glúteos (Cadena Posterior Elongada)",
        "loadFamily": "Familia Peso Muerto Rumano / Bisagra Cadera",
        "sets": 3,
        "reps": "8-10",
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Bisagra pura de cadera. Empuja las caderas hacia la pared de atrás, microflexión fija de rodillas (15°). Siente el estiramiento salvaje en isquios y glúteos. Mancuernas rozando espinillas hasta justo debajo de rodillas. Subida potente empujando con talones y contrayendo glúteos al frente.",
        "warmup": "🔥 Opcional: 1 serie técnica ligera con 30-35 lbs x 6 reps.",
        "searchQuery": "romanian deadlift rdl dumbell smith machine technique",
        "equivalents": [
          {
            "id": "d5_e1_eq1",
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
            "id": "d5_e1_eq2",
            "unifiedCode": "[ISQU-DEADLIFT-TRAP_BAR_01]",
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
        "unifiedCode": "[GLUT-BUTT_BLASTER-MAQ_01]",
        "name": "Glute Butt Blaster en Máquina",
        "muscleGroup": "Glúteo Mayor (Extensión de Cadera)",
        "isUnilateral": true,
        "loadFamily": "Familia Extensión de Cadera / Glúteo",
        "sets": 3,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Extensión terminal de cadera con contracción de 1 segundo arriba. Da redondez y altura al glúteo. Mantén la columna recta sin arquear la zona lumbar. Empuja el pedal con el talón y regresa en 3 segundos controlados.",
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
        "unifiedCode": "[ABDU-ABDUCTOR-STACK_01]",
        "name": "Abductores en Máquina (Hip Abduction / Abrir Cadera)",
        "muscleGroup": "Glúteo Medio & Cadena Lateral",
        "sets": 3,
        "reps": "12-15",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Torso inclinado 15° adelante apoyando las manos en el frente para alinear las fibras del glúteo medio y superior con la línea de fuerza. Almohadillas en la cara externa de las rodillas. Abre con potencia y mantén 1s de isometría afuera. Regresa en 3 segundos.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "hip abductor machine glute burn form",
        "equivalents": [
          {
            "id": "d5_e6",
            "unifiedCode": "[ADUC-ADUCTOR-STACK_01]",
            "name": "Aductores en Máquina (Hip Adduction / Cerrar Cadera)",
            "desc": "Trabajo de la cara interna del muslo (aductor mayor).",
            "ratio": 1,
            "biomechanics": "Sentado con espalda erguida. Junta con fuerza contrayendo los muslos internos y aguanta 1-2s apretando al centro.",
            "mindMuscle": {
              "title": "Aductor Mayor y Muslo Interno",
              "internalCue": "Contracción potente de la cara interna del muslo.",
              "externalCue": "Junta las rodillas como si aplastaras un balón.",
              "eccentricCue": "Abre en 3 segundos sintiendo el estiramiento."
            },
            "searchQuery": "hip adductor machine inner thigh isolation",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d5_e5_eq1",
            "unifiedCode": "[ABDU-CABLE_KICK-ANKLE_01]",
            "name": "Abducción con Tobillera en Polea",
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
        "unifiedCode": "[PANT-CALF_RAISE-MAQ_01]",
        "name": "Elevación de Pantorrillas en Máquina (Rotary o de Pie)",
        "muscleGroup": "Pantorrillas (Gastrocnemio & Sóleo)",
        "sets": 4,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "2 segundos de pausa en el fondo. Esto anula por completo el rebote elástico del tendón de Aquiles, obligando al sóleo y gastrocnemio a mover la carga al 100%. Subida explosiva sobre los metatarsos apretando 1s arriba.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "calf raises stretch pause high reps",
        "equivalents": [
          {
            "id": "d5_e7_eq1",
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
        "id": "d5_e8",
        "unifiedCode": "[ABDO-VACUUM-ISOM_01]",
        "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
        "muscleGroup": "Core (Transverso & Cintura Estrecha)",
        "sets": 3,
        "reps": "15-20 s",
        "restTime": "60 s",
        "defaultUnit": "s",
        "biomechanics": "Exhala todo el aire vaciando completamente los pulmones. Sin volver a inhalar, mete el ombligo lo más adentro posible por 15-20 segundos.",
        "mindMuscle": {
          "title": "Transverso Abdominal (Vacuum)",
          "internalCue": "Succiona el abdomen hacia adentro y arriba.",
          "externalCue": "Pega el ombligo a la columna vaciando todo el aire.",
          "eccentricCue": "Inhala pausado al terminar la apnea."
        },
        "warmup": "🔥 No ocupa.",
        "searchQuery": "stomach vacuum transverse abdominis form",
        "equivalents": [
          {
            "id": "d5_e8_eq1",
            "unifiedCode": "[ABDO-PLANK-ISOM_01]",
            "name": "Plancha Abdominal Isométrica Convencional",
            "desc": "Resistencia isométrica del núcleo abdominal.",
            "ratio": 1,
            "biomechanics": "Apoyo en antebrazos y puntas de pies manteniendo columna neutral.",
            "mindMuscle": {
              "title": "Plancha Abdominal",
              "internalCue": "Aprieta glúteos y abdomen como si recibieras un golpe.",
              "externalCue": "Mantén el cuerpo como una tabla rígida.",
              "eccentricCue": "Respira de forma controlada."
            },
            "searchQuery": "Plancha isométrica tecnica",
            "warmup": "🔥 No ocupa."
          }
        ]
      },
      {
        "id": "d5_e9",
        "unifiedCode": "[CARD-TREADMILL-ZONA2_01]",
        "name": "Cardio Zona 2 en Caminadora",
        "muscleGroup": "Cardiovascular (Zona 2 & Recuperación)",
        "sets": 1,
        "reps": "35-45 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Inclinación 10-11% a 3.5-3.8 km/h (120-135 BPM). Acelera la remoción de subproductos metabólicos en las piernas, maximiza la oxidación lipídica mitocondrial y previene la rigidez muscular al día siguiente.",
        "warmup": "🔥 3 minutos progresivos a ritmo suave.",
        "searchQuery": "zone 2 cardio fat oxidation incline walk",
        "equivalents": [
          {
            "id": "d5_e9_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora en Inclinación (Zona 2)",
            "desc": "Bajo impacto articular y alto gasto calórico.",
            "ratio": 1,
            "biomechanics": "Caminadora a 3.5-3.8 km/h con inclinación del 10-11%. Cero impacto articular en rodillas, activación sostenida de gemelos y glúteos.",
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
            "unifiedCode": "[CARD-BIKE-STATIONARY_01]",
            "name": "Bicicleta Estática (Zona 2)",
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
    "name": "Sábado: Jalón 2 (Fibras Bajas del Dorsal & Brazos)",
    "type": "workout",
    "focus": "Tracción neutra para dorsales bajos, Frecuencia 3 de hombro lateral con parciales elongadas, Face Pulls y pico de bíceps en banco a 60° (supinación con meñique para 100% de unidades motoras) y aislamiento en Scott.",
    "exercises": [
      {
        "id": "d6_e1",
        "unifiedCode": "[ESPA-PULLDOWN-V_GRIP_01]",
        "name": "Jalón con Agarre Estrecho Neutro (V-Grip)",
        "muscleGroup": "Espalda (Dorsal Inferior & V-Taper)",
        "loadFamily": "Familia Jalón Vertical Dorsal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "El agarre neutro cerrado alinea perfectamente la tracción con las fibras ilíacas e inferiores del dorsal ancho, haciendo que el músculo nazca visualmente más abajo (cerca de la cintura). Maneral en V o agarre neutro cerrado en polea alta. Torso ligeramente reclinado (15°). Tira llevando los codos pegados al cuerpo hasta que el maneral toque el esternón bajo.",
        "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps.",
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
        "name": "Remo Gironda en Polea Baja (Agarre Neutro)",
        "muscleGroup": "Espalda (Densidad Dorsal Media & Trapecio)",
        "loadFamily": "Familia Remo Horizontal",
        "sets": 4,
        "reps": "8-10",
        "restTime": "180 s",
        "defaultUnit": "lbs",
        "biomechanics": "Tracción hacia el ombligo manteniendo el pecho erguido. Densidad dorsal media y baja. Sentado en polea baja con agarre estrecho o máquina de apoyo al pecho. Inicia retrayendo las escápulas y tira del maneral hacia el ombligo sin balancear la espalda hacia atrás.",
        "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
        "searchQuery": "machine row compound back thickness seated cable row",
        "equivalents": [
          {
            "id": "d6_e2_eq_comp",
            "unifiedCode": "[ESPA-MACHINE_ROW-CHEST_SUPP_01]",
            "name": "Remo Compuesto en Máquina (Apoyo al Pecho)",
            "desc": "Cero estrés lumbar, tracción horizontal retrayendo escápulas.",
            "ratio": 1,
            "biomechanics": "Apoyo firme del esternón. Tracción horizontal enfocada en retraer escápulas y densificar la espalda media.",
            "mindMuscle": {
              "title": "Remo con Apoyo al Pecho",
              "internalCue": "Clava las escápulas atrás y siente los romboides activarse.",
              "externalCue": "Hala los manerales hacia las costillas.",
              "eccentricCue": "Controla el regreso en 3 segundos."
            },
            "searchQuery": "chest supported machine row proper form",
            "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps."
          },
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
        "id": "d6_e4",
        "unifiedCode": "[HOMB-LAT_RAISE-MANC_01]",
        "name": "Elevaciones Laterales con Mancuernas",
        "muscleGroup": "Hombro (Deltoides Lateral)",
        "sets": 4,
        "reps": "12-15",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Tercera sesión semanal de deltoides lateral (Frecuencia 3 para V-Taper 3D óptimo). Torso inclinado 10° adelante con codos a 30-45° en el plano escapular. Haz tus 12-15 reps estrictas hasta la horizontal; al fallar, ¡NO sueltes el peso! Saca de 4 a 6 repeticiones parciales en el tercio inferior (0° a 45°, Pedrosa 2022 / Kassiano 2023) controlando la bajada para inducir hipertrofia superior en rango elongado.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "machine lateral raise deltoid cap metabolic burn",
        "equivalents": [
          {
            "id": "d6_e4_eq_mach",
            "unifiedCode": "[HOMB-LAT_RAISE-MAQ_01]",
            "name": "Elevaciones Laterales en Máquina",
            "desc": "Guía fija para aislar el húmero sin fatiga de trapecios.",
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
            "id": "d6_e4_eq_cable_back",
            "unifiedCode": "[HOMB-LAT_RAISE-BEHIND_CABLE_01]",
            "name": "Elevaciones Laterales en Polea Baja (Tras Espalda)",
            "desc": "Tensión continua ininterrumpida desde los 0° de abducción.",
            "ratio": 0.6,
            "biomechanics": "Polea baja ajustada a la altura de la cadera o rodilla con cable pasando tras los glúteos.",
            "mindMuscle": {
              "title": "Deltoides en Polea Tras Espalda",
              "internalCue": "Lidera con el codo con hombro deprimido.",
              "externalCue": "Lanza la mano hacia la esquina del techo.",
              "eccentricCue": "Resiste la bajada en 3 segundos completos."
            },
            "searchQuery": "cable lateral raise behind back deltoid isolation",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e4_eq1",
            "unifiedCode": "[HOMB-LAT_RAISE-CABLE_01]",
            "name": "Elevaciones Laterales en Polea Baja a una Mano",
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
          "title": "Deltoides Lateral (Frecuencia 3 & Parciales Elongadas)",
          "internalCue": "Lidera desde los codos. Al fallar en la horizontal, no pares: saca 4 a 6 parciales en el tercio inferior.",
          "externalCue": "Empuja las mancuernas hacia las esquinas lejanas de la sala.",
          "eccentricCue": "Frena la bajada en 2 a 3 segundos controlando el descenso en la zona de estiramiento."
        }
      },
      {
        "id": "d6_e3",
        "unifiedCode": "[HOMB-FACE_PULL-HIGH_CABLE_01]",
        "name": "Face Pulls en Polea Alta con Cuerda",
        "muscleGroup": "Hombro (Deltoides Posterior & Manguito)",
        "sets": 3,
        "reps": "12-15",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Rotación externa y deltoides posterior. Polea a nivel de los ojos con cuerda doble. Tira hacia la frente/tabique nasal separando las manos hacia las orejas en rotación externa. Pausa de 1s atrás.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "cable face pull external rotation rear delt",
        "equivalents": [
          {
            "id": "d6_e3_eq1",
            "unifiedCode": "[HOMB-REAR_DELT-PEC_DECK_01]",
            "name": "Pájaros en Pec Deck Inverso (Reverse Flyes)",
            "desc": "Aislamiento directo en máquina deltoides posterior.",
            "ratio": 1,
            "biomechanics": "Torso inclinado o sentado de frente en Pec Deck abriendo los brazos con codos a la altura de los hombros.",
            "mindMuscle": {
              "title": "Deltoides Posterior en Pec Deck Inverso",
              "internalCue": "Aísla la cara trasera del deltoides sin encoger hombros.",
              "externalCue": "Abre los brazos como alas hacia las paredes.",
              "eccentricCue": "Baja en 3 segundos sintiendo el control excéntrico."
            },
            "searchQuery": "Pájaros en Pec Deck Inverso tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e3_eq_db",
            "unifiedCode": "[HOMB-REAR_DELT-MANC_INC_01]",
            "name": "Pájaros con Mancuernas en Banco Inclinado",
            "desc": "Aislamiento libre para deltoides posterior.",
            "ratio": 0.5,
            "biomechanics": "Torso inclinado a 45° apoyado en banco con mancuernas ligeras abriendo en arco lateral.",
            "mindMuscle": {
              "title": "Pájaros con Mancuernas",
              "internalCue": "Abre los brazos con codos ligeramente flexionados.",
              "externalCue": "Lanza las mancuernas hacia las paredes.",
              "eccentricCue": "Frena el descenso en 3 segundos."
            },
            "searchQuery": "rear delt dumbbell flyes incline bench form",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e3_eq2",
            "unifiedCode": "[HOMB-UPRIGHT_ROW-CABLE_01]",
            "name": "Remo al Mentón Amplio en Polea",
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
        "id": "d6_e5",
        "unifiedCode": "[BICEP-INCLINE_CURL-MANC_60_01]",
        "name": "Curl de Bíceps con Mancuernas (Sentado en Banco a 60°)",
        "muscleGroup": "Bíceps (Cabeza Larga & Pico)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "El banco inclinado a 60° posiciona el húmero por detrás del torso, elongando la cabeza larga del bíceps (responsable del 'pico' y altura del bíceps). Deja que los brazos cuelguen completamente extendidos atrás antes de iniciar la contracción. Al subir, supina activamente girando la muñeca con el dedo meñique hacia afuera y arriba; ese último grado de rotación recluta el 100% de las unidades motoras del bíceps distal. Frena el descenso en 3 segundos continuos sintiendo el estiramiento profundo.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "incline dumbbell bicep curl 60 degrees",
        "equivalents": [
          {
            "id": "d6_e5_eq_bayes",
            "unifiedCode": "[BICEP-CABLE_CURL-BAYESIAN_01]",
            "name": "Bayesian Cable Curl (Estiramiento Humeral en Polea)",
            "desc": "De espaldas a la polea baja, máxima tensión en estiramiento.",
            "ratio": 0.8,
            "biomechanics": "De espaldas a la polea baja, codo por detrás del cuerpo. Pone la cabeza larga del bíceps en tensión máxima elongada. Da un paso al frente de modo que el brazo quede extendido detrás del torso. Con el codo bloqueado detrás de la cadera, flexiona el antebrazo sin adelantar el codo. Pausa de 1s arriba.",
            "mindMuscle": {
              "title": "Bíceps Braquial (Cabeza Larga en Estiramiento Humeral)",
              "internalCue": "Siente cómo el tendón del bíceps se alarga al máximo detrás de tu cuerpo antes de iniciar cada repetición.",
              "externalCue": "Curl hacia adelante y arriba manteniendo el codo anclado firmemente detrás del torso.",
              "eccentricCue": "Deja que el cable jale tu brazo hacia atrás en 3 segundos completos sintiendo el estiramiento profundo del bíceps."
            },
            "searchQuery": "bayesian cable curl behind back bicep stretch",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e5_eq_cable",
            "unifiedCode": "[BICEP-CABLE_CURL-LOW_STRAIGHT_01]",
            "name": "Curl de Bíceps en Polea Baja (Barra Recta)",
            "desc": "Tensión mecánica continua con codos pegados al torso.",
            "ratio": 1,
            "biomechanics": "Codos clavados como bisagras en las costillas. Pico concéntrico de 1 segundo arriba. Polea baja con barra recta o corta. De pie con rodillas suaves y torso erguido. Flexión completa con muñecas neutras para no sobrecargar los flexores del antebrazo.",
            "mindMuscle": {
              "title": "Bíceps Braquial & Braquial Anterior",
              "internalCue": "Aprieta los bíceps con fuerza en la cima imaginando comprimir una nuez en la flexura del codo.",
              "externalCue": "Lleva la barra hacia tu barbilla manteniendo los codos inmóviles pegados a las costillas.",
              "eccentricCue": "Desciende la barra en 2 a 3 segundos hasta que los brazos queden completamente extendidos."
            },
            "searchQuery": "cable straight bar bicep curl proper form",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e5_eq_scott",
            "unifiedCode": "[BICEP-PREACHER_CURL-SCOTT_MAQ_01]",
            "name": "Curl de Bíceps en Banco Scott o Máquina Predicador",
            "desc": "Aislamiento estricto de cabeza corta y pico.",
            "ratio": 0.9,
            "biomechanics": "Tríceps y axilas firmemente apoyados sobre la almohadilla inclinada a 45°. Asiento ajustado para no encorvar la espalda. El apoyo del brazo elimina cualquier impulso del hombro o balanceo del torso.",
            "mindMuscle": {
              "title": "Bíceps Braquial en Aislamiento Puro (Banco Scott)",
              "internalCue": "Siente cómo el bíceps hace todo el trabajo sin ayuda de ningún otro músculo.",
              "externalCue": "Tracciona el maneral hacia tu frente manteniendo los brazos pegados al cojín.",
              "eccentricCue": "Desciende en 3 segundos muy controlados, deteniéndote 2 cm antes del bloqueo articular para proteger los tendones."
            },
            "searchQuery": "preacher curl machine scott arm curl isolation",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e5_eq1",
            "unifiedCode": "[BICEP-HAMMER_CURL-MANC_01]",
            "name": "Curl Martillo con Mancuernas (Braquial)",
            "desc": "Desarrollo del braquial anterior y antebrazo.",
            "ratio": 1,
            "biomechanics": "Banco inclinado a 60°, brazos colgando detrás del torso con agarre neutro estricto.",
            "mindMuscle": {
              "title": "Curl Martillo con Mancuernas",
              "internalCue": "Siente la activación profunda en la cara lateral del brazo y el antebrazo.",
              "externalCue": "Eleva las mancuernas manteniendo los pulgares apuntando al techo.",
              "eccentricCue": "Desciende en 3 segundos lentos."
            },
            "searchQuery": "Curl martillo con mancuernas (enfoque en braquial y braquiorradial) tecnica biomecanica",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e5_eq_barbell",
            "unifiedCode": "[BICEP-BARBELL_CURL-EZ_BAR_01]",
            "name": "Curl con Barra Z de Pie",
            "desc": "Sobrecarga con barra libre para bíceps.",
            "ratio": 1,
            "biomechanics": "Agarre en las curvas de la barra Z para comodidad de muñecas. Cero balanceo de espalda lumbar.",
            "mindMuscle": {
              "title": "Bíceps con Barra Z Libre",
              "internalCue": "Aísla los brazos sin balancear la pelvis.",
              "externalCue": "Sube la barra Z en arco firme hacia el cuello.",
              "eccentricCue": "Frena la caída en 3 segundos completos."
            },
            "searchQuery": "ez bar bicep curl proper form",
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
        "unifiedCode": "[BICEP-PREACHER_CURL-SCOTT_MAQ_01]",
        "name": "Curl de Bíceps en Banco Scott o Máquina Predicador",
        "muscleGroup": "Bíceps (Cabeza Corta & Grosor Interno)",
        "sets": 3,
        "reps": "10-12",
        "restTime": "120 s",
        "defaultUnit": "lbs",
        "biomechanics": "Aislamiento puro de la cabeza corta (grosor, densidad y masa interna del brazo). Tríceps y axilas firmemente apoyados sobre la almohadilla inclinada a 45°. El soporte rígido anula cualquier impulso o compensación del hombro. Aprieta 1 segundo arriba en contracción isométrica máxima y desciende en 3 segundos muy controlados, deteniéndote 2 cm antes de la hiperextensión articular para proteger tendones distales.",
        "warmup": "🔥 No ocupa.",
        "searchQuery": "preacher curl machine scott arm curl isolation",
        "equivalents": [
          {
            "id": "d6_e6_eq_bayes",
            "unifiedCode": "[BICEP-CABLE_CURL-BAYESIAN_01]",
            "name": "Bayesian Cable Curl (Estiramiento Humeral en Polea)",
            "desc": "De espaldas a la polea baja, máxima tensión en estiramiento.",
            "ratio": 0.8,
            "biomechanics": "De espaldas a la polea baja, codo por detrás del cuerpo. Pone la cabeza larga del bíceps en tensión máxima elongada. Da un paso al frente de modo que el brazo quede extendido detrás del torso. Con el codo bloqueado detrás de la cadera, flexiona el antebrazo sin adelantar el codo. Pausa de 1s arriba.",
            "mindMuscle": {
              "title": "Bíceps Braquial (Cabeza Larga en Estiramiento Humeral)",
              "internalCue": "Siente cómo el tendón del bíceps se alarga al máximo detrás de tu cuerpo antes de iniciar cada repetición.",
              "externalCue": "Curl hacia adelante y arriba manteniendo el codo anclado firmemente detrás del torso.",
              "eccentricCue": "Deja que el cable jale tu brazo hacia atrás en 3 segundos completos sintiendo el estiramiento profundo del bíceps."
            },
            "searchQuery": "bayesian cable curl behind back bicep stretch",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e6_eq_cable",
            "unifiedCode": "[BICEP-CABLE_CURL-LOW_STRAIGHT_01]",
            "name": "Curl de Bíceps en Polea Baja (Barra Recta)",
            "desc": "Tensión mecánica continua con codos pegados al torso.",
            "ratio": 1,
            "biomechanics": "Codos clavados como bisagras en las costillas. Pico concéntrico de 1 segundo arriba. Polea baja con barra recta o corta. De pie con rodillas suaves y torso erguido. Flexión completa con muñecas neutras para no sobrecargar los flexores del antebrazo.",
            "mindMuscle": {
              "title": "Bíceps Braquial & Braquial Anterior",
              "internalCue": "Aprieta los bíceps con fuerza en la cima imaginando comprimir una nuez en la flexura del codo.",
              "externalCue": "Lleva la barra hacia tu barbilla manteniendo los codos inmóviles pegados a las costillas.",
              "eccentricCue": "Desciende la barra en 2 a 3 segundos hasta que los brazos queden completamente extendidos."
            },
            "searchQuery": "cable straight bar bicep curl proper form",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e6_eq_incline",
            "unifiedCode": "[BICEP-INCLINE_CURL-MANC_60_01]",
            "name": "Curl de Bíceps con Mancuernas (Sentado en Banco a 60°)",
            "desc": "La inclinación hacia atrás elonga la cabeza larga del bíceps.",
            "ratio": 0.5,
            "biomechanics": "Banco inclinado a 60°, brazos colgando detrás del torso con máxima elongación. Supinación activa en el ascenso.",
            "mindMuscle": {
              "title": "Curl Inclinado con Mancuernas a 60°",
              "internalCue": "Inicia la contracción desde el estiramiento completo del bíceps.",
              "externalCue": "Curl hacia arriba y afuera con supinación activa.",
              "eccentricCue": "Desciende en 3 segundos lentos."
            },
            "searchQuery": "incline dumbbell bicep curl 60 degrees",
            "warmup": "🔥 No ocupa."
          },
          {
            "id": "d6_e6_eq1",
            "unifiedCode": "[BICEP-PREACHER_CURL-EZ_BAR_01]",
            "name": "Curl en Banco Scott con Barra Z",
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
            "unifiedCode": "[BICEP-CONCENTRATION_CURL-MANC_01]",
            "name": "Curl Concentrado con Mancuerna",
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
        "id": "d6_e8",
        "unifiedCode": "[CARD-TREADMILL-ZONA2_01]",
        "name": "Cardio Zona 2 en Caminadora",
        "muscleGroup": "Cardiovascular (Zona 2)",
        "sets": 1,
        "reps": "35-45 min",
        "isCardio": true,
        "restTime": "0 s",
        "defaultUnit": "min",
        "biomechanics": "Caminadora o elíptica. 35 a 45 minutos continuos a 120-135 BPM para consolidar el gasto energético y recuperación sin estrés articular.",
        "warmup": "🔥 3 minutos progresivos.",
        "searchQuery": "zone 2 cardio fat oxidation stationary bike",
        "equivalents": [
          {
            "id": "d6_e8_eq1",
            "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
            "name": "Caminadora en Inclinación (Zona 2)",
            "desc": "Bajo impacto articular y alto gasto calórico.",
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
            "unifiedCode": "[CARD-BIKE-STATIONARY_01]",
            "name": "Bicicleta Estática (Zona 2)",
            "desc": "Cadencia continua fluida sin impacto.",
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
          },
          {
            "id": "d6_e8_eq3",
            "unifiedCode": "[CARD-ELLIPTICAL-ZONA2_01]",
            "name": "Elíptica (Zona 2)",
            "desc": "Cero impacto articular con activación de cuerpo completo.",
            "ratio": 1,
            "biomechanics": "Elíptica a ritmo moderado constante manteniendo 120-135 BPM.",
            "mindMuscle": {
              "title": "Elíptica Zona 2",
              "internalCue": "Ritmo fluido sin tirones en las articulaciones.",
              "externalCue": "Mantén la cadencia sostenida.",
              "eccentricCue": "Respiración relajada."
            },
            "searchQuery": "elliptical zone 2 cardio fat burn",
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
