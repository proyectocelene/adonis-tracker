/* ============================================================================
   BASE DE DATOS UNIFICADA DE EJERCICIOS Y MÁQUINAS (COACH V2 ADONIS)
   Catálogo clínico y deportivo con Biomecánica e IAP y Conexión Mente-Músculo individual
   ============================================================================ */

export const UNIFIED_EXERCISE_LIBRARY = [
  {
    "id": "lib_pecho_1",
    "name": "Press de Pecho en Máquina Convergente (Chest Press)",
    "muscleGroup": "Pecho",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-PECH-MÁQ-01]",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1.15,
    "biomechanics": "Mecánica guiada que aisla las fibras medias yesternales del pectoral mayor, reduciendo fatiga estabilizadora en hombros.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    }
  },
  {
    "id": "lib_pecho_2",
    "name": "Aperturas en Máquina Pec Deck (Peacock / Flyes)",
    "muscleGroup": "Pecho",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-PECH-FLY-02]",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.85,
    "biomechanics": "Tensión constante en la aducción horizontal del húmero con máxima flexo-extensión excéntrica.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    }
  },
  {
    "id": "lib_pecho_3",
    "name": "Cruce de Poleas Altas y Medias (Cable Crossover)",
    "muscleGroup": "Pecho",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-PECH-CAB-03]",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.75,
    "biomechanics": "Tensión continua a lo largo de todo el rango angular con contracción isométrica voluntaria al centro.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    }
  },
  {
    "id": "lib_pecho_4",
    "name": "Press Inclinado en Máquina o Multipower (Smith Machine)",
    "muscleGroup": "Pecho",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-PECH-INC-04]",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 1.2,
    "biomechanics": "Enfoque prioritario al haz clavicular anterior del pectoral mayor con seguridad máxima para llegar al fallo mecánico.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Haz Clavicular / Pecho Superior)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    }
  },
  {
    "id": "lib_esp_1",
    "name": "Jalón en Polea al Pecho con Agarre Ancho (Lat Pulldown)",
    "muscleGroup": "Espalda",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-ESPA-PULL-01]",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "Tracción vertical pura enfocada en la expansión latitudinal del dorsal ancho y redondo mayor.",
    "mindMuscle": {
      "title": "Dorsal Ancho & Espalda Superior",
      "internalCue": "Usa las manos como ganchos y tracciona llevando los codos verticalmente hacia tus bolsillos traseros.",
      "externalCue": "Imagina doblar la barra sobre tus hombros expandiendo el pecho hacia el cielo.",
      "eccentricCue": "Deja que el peso te estire hacia arriba en 3 segundos sintiendo la tracción desde la axila a la cadera."
    }
  },
  {
    "id": "lib_esp_2",
    "name": "Remo Gironda en Polea Baja con Triángulo (Seated Cable Row)",
    "muscleGroup": "Espalda",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-ESPA-ROW-02]",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1.1,
    "biomechanics": "Tracción horizontal con retracción escapular estricta para densidad del romboides, trapecio medio y dorsal.",
    "mindMuscle": {
      "title": "Espalda Media, Romboides & Densidad Escapular",
      "internalCue": "Inicia la tracción retrayendo escápulas y aprieta el centro de la espalda al final con pausa de 1s.",
      "externalCue": "Clava los codos hacia atrás contra la pared detrás de ti.",
      "eccentricCue": "Frena el retorno en 3 segundos dejando que las escápulas se abran suavemente con control."
    }
  },
  {
    "id": "lib_esp_3",
    "name": "Remo en Máquina Convergente con Apoyo Pectoral (Machine Row)",
    "muscleGroup": "Espalda",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-ESPA-MÁQ-03]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1.25,
    "biomechanics": "El apoyo torácico neutraliza la presión en zona lumbar permitiendo sobrecarga focalizada en la musculatura de espalda.",
    "mindMuscle": {
      "title": "Espalda Media, Romboides & Densidad Escapular",
      "internalCue": "Inicia la tracción retrayendo escápulas y aprieta el centro de la espalda al final con pausa de 1s.",
      "externalCue": "Clava los codos hacia atrás contra la pared detrás de ti.",
      "eccentricCue": "Frena el retorno en 3 segundos dejando que las escápulas se abran suavemente con control."
    }
  },
  {
    "id": "lib_esp_4",
    "name": "Pullover en Polea Alta con Cuerda (Straight Arm Pulldown)",
    "muscleGroup": "Espalda",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-ESPA-PULOV-04]",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.6,
    "biomechanics": "Aislamiento monoarticular de extensión de hombro con activación constante del dorsal sin fatigar bíceps.",
    "mindMuscle": {
      "title": "Dorsal Ancho & Espalda Superior",
      "internalCue": "Usa las manos como ganchos y tracciona llevando los codos verticalmente hacia tus bolsillos traseros.",
      "externalCue": "Imagina doblar la barra sobre tus hombros expandiendo el pecho hacia el cielo.",
      "eccentricCue": "Deja que el peso te estire hacia arriba en 3 segundos sintiendo la tracción desde la axila a la cadera."
    }
  },
  {
    "id": "lib_homb_1",
    "name": "Elevaciones Laterales en Máquina o Polea Baja (Lateral Raises)",
    "muscleGroup": "Hombros",
    "equipment": "Máquina / Polea",
    "unifiedCode": "[HIPER-HOMB-LAT-01]",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.8,
    "biomechanics": "Aislamiento estricto de la cabeza lateral del deltoides para amplitud del contorno acromial (V-Taper).",
    "mindMuscle": {
      "title": "Deltoides Lateral (V-Taper & Amplitud)",
      "internalCue": "Lidera desde los codos con trapecios y cuello completamente relajados.",
      "externalCue": "Lanza los codos o mancuernas hacia las esquinas más alejadas de la habitación.",
      "eccentricCue": "Desciende en 2 a 3 segundos conteniendo la gravedad."
    }
  },
  {
    "id": "lib_homb_2",
    "name": "Press Militar en Máquina Convergente o Smith (Shoulder Press)",
    "muscleGroup": "Hombros",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-HOMB-PRESS-02]",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 1.15,
    "biomechanics": "Empuje vertical con reclutamiento intensivo del deltoides anterior, medio y porción superior del trapecio.",
    "mindMuscle": {
      "title": "Deltoides Anterior y Cabeza Lateral",
      "internalCue": "Codos a 30° adelantados en el plano escapular; empuja sin hiperextender la columna baja.",
      "externalCue": "Empuja hacia el techo en línea vertical firme.",
      "eccentricCue": "Baja en 2 a 3 segundos hasta la altura de las orejas."
    }
  },
  {
    "id": "lib_homb_3",
    "name": "Pájaro en Máquina Pec Deck Inverso (Reverse Flyes)",
    "muscleGroup": "Hombros",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-HOMB-POST-03]",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.75,
    "biomechanics": "Abducción horizontal enfocada en la porción posterior del deltoides y estabilizadores escapulares posteriores.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Aislamiento y Aducción Horizontal)",
      "internalCue": "Mantén los codos con una ligera flexión fija y piensa en juntar la cara interna de ambos codos frente a ti.",
      "externalCue": "Abraza un cilindro ancho manteniendo los hombros firmemente pegados atrás.",
      "eccentricCue": "Abre los brazos en 3 segundos sintiendo la máxima tensión en estiramiento."
    }
  },
  {
    "id": "lib_piern_1",
    "name": "Prensa de Pierna Inclinada 45° (Leg Press 45°)",
    "muscleGroup": "Cuádriceps",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-CUAD-PRENS-01]",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "150 s",
    "ratio": 2.2,
    "biomechanics": "Estudio de máxima compresión mecánica en cuádriceps y glúteo sin comprometer compresión axial en columna vertebral.",
    "mindMuscle": {
      "title": "Cuádriceps & Cadena Anterior",
      "internalCue": "Hunde las rodillas con flexión profunda cargando la tensión en los vastos sin redondear la zona lumbar.",
      "externalCue": "Empuja el piso o la plataforma a través de los talones y tercio medio del pie sin bloquear bruscamente.",
      "eccentricCue": "Desciende en 3 segundos lentos y continuos sintiendo cómo los muslos se estiran como resortes."
    }
  },
  {
    "id": "lib_piern_2",
    "name": "Sentadilla en Máquina Hack (Hack Squat)",
    "muscleGroup": "Cuádriceps",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-CUAD-HACK-02]",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "150 s",
    "ratio": 1.4,
    "biomechanics": "Tensión mecánica extrema en vasto externo e interno con flexión profunda de rodilla guiada por riel de alta estabilidad.",
    "mindMuscle": {
      "title": "Cuádriceps & Cadena Anterior",
      "internalCue": "Hunde las rodillas con flexión profunda cargando la tensión en los vastos sin redondear la zona lumbar.",
      "externalCue": "Empuja el piso o la plataforma a través de los talones y tercio medio del pie sin bloquear bruscamente.",
      "eccentricCue": "Desciende en 3 segundos lentos y continuos sintiendo cómo los muslos se estiran como resortes."
    }
  },
  {
    "id": "lib_piern_3",
    "name": "Extensiones de Cuádriceps en Máquina Sentado (Leg Extension)",
    "muscleGroup": "Cuádriceps",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-CUAD-EXT-03]",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Ejercicio monoarticular para aislar el recto femoral yvastos con contracción isométrica terminal de 1-2 segundos.",
    "mindMuscle": {
      "title": "Cuádriceps (Recto Femoral en Acortamiento)",
      "internalCue": "Aprieta la parte superior del muslo con fuerza brutal arriba; mantén los tobillos en ángulo neutro.",
      "externalCue": "Patea la almohadilla hacia el techo estirando la pierna en línea recta.",
      "eccentricCue": "Frena la caída en 3 segundos sintiendo la resistencia continua del cuádriceps."
    }
  },
  {
    "id": "lib_isq_1",
    "name": "Curl de Pechuga / Isquiotibiales en Máquina Tumbado o Sentado (Leg Curl)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-ISQU-CURL-01]",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.95,
    "biomechanics": "Flexión de rodilla estricta para estimular bíceps femoral, semitendinoso y semimembranoso.",
    "mindMuscle": {
      "title": "Isquiotibiales (Bíceps Femoral y Semitendinoso)",
      "internalCue": "Mantén los pies en flexión neutra y flexiona con potencia llevando los talones hacia el asiento/glúteos.",
      "externalCue": "Hala el rodillo hacia la base de la máquina con un tirón continuo y firme.",
      "eccentricCue": "Frena el retorno en 3 segundos lentos sintiendo cómo los femorales se alargan bajo carga."
    }
  },
  {
    "id": "lib_isq_2",
    "name": "Empuje de Cadera en Máquina Guiada o Barra (Hip Thrust Machine)",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-GLUT-HIP-02]",
    "defaultSets": 4,
    "defaultReps": "8-12",
    "defaultRest": "120 s",
    "ratio": 1.8,
    "biomechanics": "Extensión horizontal de cadera con activación en pico electromiográfico para hipertrofia del glúteo mayor.",
    "mindMuscle": {
      "title": "Glúteo Mayor & Cadera",
      "internalCue": "Inicia el movimiento activando el glúteo y aprieta con fuerza máxima en el punto de extensión completa.",
      "externalCue": "Empuja la plataforma o barra hacia arriba/atrás con la fuerza pura de la cadera.",
      "eccentricCue": "Regresa en 2 a 3 segundos controlados conteniendo la resistencia."
    }
  },
  {
    "id": "lib_isq_3",
    "name": "Peso Muerto Rumano con Mancuernas o Máquina Smith (RDL)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Máquina / Pesas",
    "unifiedCode": "[HIPER-ISQU-RDL-03]",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 1.1,
    "biomechanics": "Elongación bajo carga del tren posterior (cadena cinética de isquiotibiales y glúteo) con cadencia excéntrica de 3 segundos.",
    "mindMuscle": {
      "title": "Isquiotibiales & Glúteo Mayor (Cadena Posterior)",
      "internalCue": "Bisagra pura de cadera: siente los femorales tensarse mientras la pelvis viaja hacia atrás.",
      "externalCue": "Imagina empujar una puerta con los glúteos manteniendo las espinillas verticales.",
      "eccentricCue": "Baja las pesas rozando las piernas en 3 segundos sin arquear la espalda baja."
    }
  },
  {
    "id": "lib_arm_1",
    "name": "Curl de Bíceps en Banco Scott o Máquina Predicador (Preacher Curl)",
    "muscleGroup": "Bíceps",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-BICEP-PRED-01]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.8,
    "biomechanics": "Inmovilización del húmero contra el cojín para evitar impulso por balanceo y concentrar la flexión del codo en bíceps y braquial.",
    "mindMuscle": {
      "title": "Bíceps Braquial & Braquiorradial",
      "internalCue": "Fija los codos como bisagras a los costados y supina la muñeca activamente al subir.",
      "externalCue": "Lleva la carga hacia los hombros apretando el pico del bíceps.",
      "eccentricCue": "Extiende los brazos en 3 segundos lentos hasta estiramiento completo."
    }
  },
  {
    "id": "lib_arm_2",
    "name": "Extensión de Tríceps en Polea Alta con Cuerda o Barra (Triceps Pushdown)",
    "muscleGroup": "Tríceps",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-TRIC-PUSH-02]",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.9,
    "biomechanics": "Extensión de codo con tensión continua por cable y separación terminal para activación de la cabeza lateral e interna del tríceps.",
    "mindMuscle": {
      "title": "Tríceps Braquial",
      "internalCue": "Extiende el codo por completo apretando la parte posterior del brazo durante 1 segundo.",
      "externalCue": "Empuja la resistencia hacia el suelo o hacia atrás con los codos fijos.",
      "eccentricCue": "Retorna en 2 a 3 segundos permitiendo que el tríceps se estire bajo carga."
    }
  },
  {
    "id": "lib_arm_3",
    "name": "Fondos en Máquina Asistida o Paralelas (Dips Machine)",
    "muscleGroup": "Tríceps / Pecho",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-TRIC-DIPS-03]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1.3,
    "biomechanics": "Ejercicio compuesto de empuje para hipertrofia de masa masiva en la cabeza larga y lateral del tríceps braquial.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    }
  },
  {
    "id": "lib_core_1",
    "name": "Elevación de Talones en Máquina Sentado o Pie (Calf Raise Machine)",
    "muscleGroup": "Pantorrillas",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-PANT-MÁQ-01]",
    "defaultSets": 4,
    "defaultReps": "15-20",
    "defaultRest": "60 s",
    "ratio": 1.5,
    "biomechanics": "Extensión plantígrada completa con pausa de 2 segundos en el máximo estiramiento inferior para estimular soleo y gastrocnemio.",
    "mindMuscle": {
      "title": "Tríceps Sural (Gastrocnemio y Sóleo)",
      "internalCue": "Pausa obligatoria de 2s en máximo estiramiento abajo; elévate sobre los metatarsos y dedo gordo.",
      "externalCue": "Toca el techo con la cabeza impulsándote exclusivamente con los dedos de los pies.",
      "eccentricCue": "Baja los talones en 3 segundos profundos hasta sentir el estiramiento del tendón de Aquiles."
    }
  },
  {
    "id": "lib_core_2",
    "name": "Crunch Abdominal en Máquina con Carga o Polea Alta (Cable Crunch)",
    "muscleGroup": "Abdomen",
    "equipment": "Máquina / Polea",
    "unifiedCode": "[HIPER-ABDO-CRUN-02]",
    "defaultSets": 4,
    "defaultReps": "15-20",
    "defaultRest": "60 s",
    "ratio": 0.9,
    "biomechanics": "Flexión espinal activa contra resistencia graduada que engrosa los bloques del recto abdominal profunda y controladamente.",
    "mindMuscle": {
      "title": "Crunch Abdominal en Máquina con Carga o Polea Alta (Cable Crunch)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    }
  },
  {
    "id": "lib_cad_1",
    "name": "Aductores en Máquina (Hip Adduction / Cerrar Cadera)",
    "muscleGroup": "Aductores",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-ADUC-MÁQ-01]",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Rango amplio de apertura excéntrica. Cierra con fuerza de aducción y sostiene 1 segundo de pico de contracción al centro.",
    "mindMuscle": {
      "title": "Aductor Mayor y Cara Interna del Muslo",
      "internalCue": "Contrae con fuerza la cara interna del muslo cerrando las piernas con pausa de 1s al centro.",
      "externalCue": "Imagina aplastar un objeto firme entre ambas rodillas.",
      "eccentricCue": "Abre las piernas en 3 segundos sintiendo el estiramiento profundo del aductor."
    }
  },
  {
    "id": "lib_cad_2",
    "name": "Abductores en Máquina (Hip Abduction / Abrir Cadera)",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-ABDU-MÁQ-02]",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Torso inclinado hacia el frente a 30° para enfocar el glúteo medio y superior. Empuja abriendo con las rodillas contra las almohadillas.",
    "mindMuscle": {
      "title": "Glúteo Medio y Menor (Estabilidad de Cadera)",
      "internalCue": "Siente el costado del glúteo activarse para empujar hacia los lados sin balancear la espalda.",
      "externalCue": "Separa las almohadillas hacia las paredes laterales de la sala.",
      "eccentricCue": "Regresa en 3 segundos sin dejar que las placas se golpeen."
    }
  },
  {
    "id": "lib_cad_3",
    "name": "Glute Butt Blaster en Máquina",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-GLUT-BLAST-03]",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Empuje directo hacia atrás contra la plataforma activando el glúteo mayor sin hiperextender la zona lumbar.",
    "mindMuscle": {
      "title": "Glúteo Mayor & Cadera",
      "internalCue": "Inicia el movimiento activando el glúteo y aprieta con fuerza máxima en el punto de extensión completa.",
      "externalCue": "Empuja la plataforma o barra hacia arriba/atrás con la fuerza pura de la cadera.",
      "eccentricCue": "Regresa en 2 a 3 segundos controlados conteniendo la resistencia."
    }
  },
  {
    "id": "lib_cad_4",
    "name": "Extensiones de Glúteo a 45° en Banco Romano",
    "muscleGroup": "Glúteos",
    "equipment": "Banco / Peso Corporal",
    "unifiedCode": "[HIPER-GLUT-ROMAN-04]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Puntas de pies a 45° hacia afuera, espalda redondeada deliberadamente (chin to chest) para anular erectores y aislar glúteos.",
    "mindMuscle": {
      "title": "Extensiones de Glúteo a 45° en Banco Romano",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    }
  },
  {
    "id": "lib_piern_4",
    "name": "Prensa Unilateral a 1 Pierna (Pie Alto)",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-CUAD-UNILAT-04]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.6,
    "isUnilateral": true,
    "biomechanics": "1 pie en la esquina superior de la plataforma. Descenso profundo para máxima flexión de cadera y activación de glúteo e isquios.",
    "mindMuscle": {
      "title": "Cuádriceps & Cadena Anterior",
      "internalCue": "Hunde las rodillas con flexión profunda cargando la tensión en los vastos sin redondear la zona lumbar.",
      "externalCue": "Empuja el piso o la plataforma a través de los talones y tercio medio del pie sin bloquear bruscamente.",
      "eccentricCue": "Desciende en 3 segundos lentos y continuos sintiendo cómo los muslos se estiran como resortes."
    }
  },
  {
    "id": "lib_piern_5",
    "name": "Sentadilla Búlgara con Mancuernas o Smith",
    "muscleGroup": "Cuádriceps",
    "equipment": "Mancuernas / Smith",
    "unifiedCode": "[HIPER-CUAD-BULGAR-05]",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "90 s",
    "ratio": 0.7,
    "isUnilateral": true,
    "biomechanics": "Paso largo e inclinación ligera hacia adelante. Trabajo unilateral profundo con sobrecarga en cuádriceps y glúteo.",
    "mindMuscle": {
      "title": "Cuádriceps & Cadena Anterior",
      "internalCue": "Hunde las rodillas con flexión profunda cargando la tensión en los vastos sin redondear la zona lumbar.",
      "externalCue": "Empuja el piso o la plataforma a través de los talones y tercio medio del pie sin bloquear bruscamente.",
      "eccentricCue": "Desciende en 3 segundos lentos y continuos sintiendo cómo los muslos se estiran como resortes."
    }
  },
  {
    "id": "lib_pierna_rdl",
    "name": "Peso Muerto Rumano con Mancuernas o Smith (RDL)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Mancuernas / Smith",
    "unifiedCode": "[HIPER-ISQU-RDL-06]",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "150-180 s",
    "ratio": 0.9,
    "biomechanics": "Bisagra de cadera pura con rodillas flexionadas a 20° fijas. Máximo estiramiento de isquios y glúteos con columna neutra e IAP.",
    "mindMuscle": {
      "title": "Isquiotibiales & Glúteo Mayor (Cadena Posterior)",
      "internalCue": "Bisagra pura de cadera: siente los femorales tensarse mientras la pelvis viaja hacia atrás.",
      "externalCue": "Imagina empujar una puerta con los glúteos manteniendo las espinillas verticales.",
      "eccentricCue": "Baja las pesas rozando las piernas en 3 segundos sin arquear la espalda baja."
    }
  },
  {
    "id": "lib_pierna_uni",
    "name": "Prensa Unilateral a 1 Pierna (Pie Alto)",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-GLUT-UNIPR-07]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.5,
    "isUnilateral": true,
    "biomechanics": "Pie colocado en la parte alta de la plataforma para sobrecargar el glúteo en flexión profunda de cadera.",
    "mindMuscle": {
      "title": "Cuádriceps & Cadena Anterior",
      "internalCue": "Hunde las rodillas con flexión profunda cargando la tensión en los vastos sin redondear la zona lumbar.",
      "externalCue": "Empuja el piso o la plataforma a través de los talones y tercio medio del pie sin bloquear bruscamente.",
      "eccentricCue": "Desciende en 3 segundos lentos y continuos sintiendo cómo los muslos se estiran como resortes."
    }
  },
  {
    "id": "lib_pierna_butt",
    "name": "Glute Butt Blaster en Máquina",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-GLUT-BLAST-08]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1,
    "isUnilateral": true,
    "biomechanics": "Extensión de cadera guiada empujando la plataforma hacia atrás con la planta del pie. Pausa de 1s en la contracción.",
    "mindMuscle": {
      "title": "Glúteo Mayor & Cadera",
      "internalCue": "Inicia el movimiento activando el glúteo y aprieta con fuerza máxima en el punto de extensión completa.",
      "externalCue": "Empuja la plataforma o barra hacia arriba/atrás con la fuerza pura de la cadera.",
      "eccentricCue": "Regresa en 2 a 3 segundos controlados conteniendo la resistencia."
    }
  },
  {
    "id": "lib_esp_5",
    "name": "Jalón al Pecho Agarre Estrecho Neutro (V-Grip)",
    "muscleGroup": "Espalda",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-ESPA-NEUT-05]",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "Maneral estrecho con palmas enfrentadas. Codos hacia abajo y adelante pegados a las costillas para el dorsal inferior.",
    "mindMuscle": {
      "title": "Dorsal Ancho & Espalda Superior",
      "internalCue": "Usa las manos como ganchos y tracciona llevando los codos verticalmente hacia tus bolsillos traseros.",
      "externalCue": "Imagina doblar la barra sobre tus hombros expandiendo el pecho hacia el cielo.",
      "eccentricCue": "Deja que el peso te estire hacia arriba en 3 segundos sintiendo la tracción desde la axila a la cadera."
    }
  },
  {
    "id": "lib_homb_4",
    "name": "Face Pulls en Polea Alta (con Cuerda)",
    "muscleGroup": "Hombros",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-HOMB-FACE-04]",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.9,
    "biomechanics": "Jala la cuerda hacia la frente separando las manos y rotando externamente los hombros con codos altos.",
    "mindMuscle": {
      "title": "Face Pulls en Polea Alta (con Cuerda)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    }
  },
  {
    "id": "lib_homb_5",
    "name": "Elevaciones Laterales con Mancuernas",
    "muscleGroup": "Hombros",
    "equipment": "Mancuernas",
    "unifiedCode": "[HIPER-HOMB-DUMB-05]",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.7,
    "biomechanics": "Elevación en el plano escapular (30° al frente) con parciales elongadas al fallar en el tercio inferior.",
    "mindMuscle": {
      "title": "Deltoides Lateral (V-Taper & Amplitud)",
      "internalCue": "Lidera desde los codos con trapecios y cuello completamente relajados.",
      "externalCue": "Lanza los codos o mancuernas hacia las esquinas más alejadas de la habitación.",
      "eccentricCue": "Desciende en 2 a 3 segundos conteniendo la gravedad."
    }
  },
  {
    "id": "lib_pecho_5",
    "name": "Press Inclinado con Mancuernas (Banco a 30°)",
    "muscleGroup": "Pecho",
    "equipment": "Mancuernas / Banco",
    "unifiedCode": "[HIPER-PECH-DUMB-05]",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 0.45,
    "biomechanics": "Banco ajustado a 30° exactos. Excéntrica controlada en 3 segundos con IAP firme para enfocar el haz clavicular.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Haz Clavicular / Pecho Superior)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    }
  },
  {
    "id": "lib_pecho_6",
    "name": "Press Plano con Mancuernas o Barra",
    "muscleGroup": "Pecho",
    "equipment": "Mancuernas / Barra",
    "unifiedCode": "[HIPER-PECH-FLAT-06]",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 0.9,
    "biomechanics": "Escápulas retraídas y deprimidas con pies plantados en el piso. Empuje perpendicular al esternón.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    }
  },
  {
    "id": "lib_arm_4",
    "name": "Curl de Bíceps en Polea Baja (Barra Recta o Cuerda)",
    "muscleGroup": "Bíceps",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-BICEP-POLE-04]",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Polea baja con tensión uniforme continua. Codos estables a los costados sin balancear el torso.",
    "mindMuscle": {
      "title": "Bíceps Braquial & Braquiorradial",
      "internalCue": "Fija los codos como bisagras a los costados y supina la muñeca activamente al subir.",
      "externalCue": "Lleva la carga hacia los hombros apretando el pico del bíceps.",
      "eccentricCue": "Extiende los brazos en 3 segundos lentos hasta estiramiento completo."
    }
  },
  {
    "id": "lib_arm_5",
    "name": "Curl de Bíceps con Mancuernas (Supinado al subir)",
    "muscleGroup": "Bíceps",
    "equipment": "Mancuernas",
    "unifiedCode": "[HIPER-BICEP-DUMB-05]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.5,
    "biomechanics": "De pie o sentado. Rota la palma hacia arriba y afuera en la subida concentrando la tensión en el pico del bíceps.",
    "mindMuscle": {
      "title": "Bíceps Braquial & Braquiorradial",
      "internalCue": "Fija los codos como bisagras a los costados y supina la muñeca activamente al subir.",
      "externalCue": "Lleva la carga hacia los hombros apretando el pico del bíceps.",
      "eccentricCue": "Extiende los brazos en 3 segundos lentos hasta estiramiento completo."
    }
  },
  {
    "id": "lib_arm_bayes",
    "name": "Bayesian Cable Curl (Bíceps en Estiramiento Humeral)",
    "muscleGroup": "Bíceps",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-BICEP-BAYES-06]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.5,
    "isUnilateral": true,
    "biomechanics": "De espaldas a la polea baja con el codo en hiperextensión humeral detrás del torso para sobrecarga en elongación.",
    "mindMuscle": {
      "title": "Bíceps Braquial & Braquiorradial",
      "internalCue": "Fija los codos como bisagras a los costados y supina la muñeca activamente al subir.",
      "externalCue": "Lleva la carga hacia los hombros apretando el pico del bíceps.",
      "eccentricCue": "Extiende los brazos en 3 segundos lentos hasta estiramiento completo."
    }
  },
  {
    "id": "lib_arm_6",
    "name": "Extensión de Tríceps en Máquina Sentado",
    "muscleGroup": "Tríceps",
    "equipment": "Máquina",
    "unifiedCode": "[HIPER-TRIC-MÁQ-06]",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1.1,
    "biomechanics": "Codos alineados con el eje de rotación de la máquina. Descenso pausado con flexión completa.",
    "mindMuscle": {
      "title": "Tríceps Braquial",
      "internalCue": "Extiende el codo por completo apretando la parte posterior del brazo durante 1 segundo.",
      "externalCue": "Empuja la resistencia hacia el suelo o hacia atrás con los codos fijos.",
      "eccentricCue": "Retorna en 2 a 3 segundos permitiendo que el tríceps se estire bajo carga."
    }
  },
  {
    "id": "lib_arm_7",
    "name": "Extensión de Tríceps Copa Sobre la Cabeza",
    "muscleGroup": "Tríceps",
    "equipment": "Mancuerna / Polea",
    "unifiedCode": "[HIPER-TRIC-OVER-07]",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.6,
    "biomechanics": "Brazos elevados verticalmente para poner la cabeza larga del tríceps en estiramiento fascial profundo.",
    "mindMuscle": {
      "title": "Tríceps Braquial",
      "internalCue": "Extiende el codo por completo apretando la parte posterior del brazo durante 1 segundo.",
      "externalCue": "Empuja la resistencia hacia el suelo o hacia atrás con los codos fijos.",
      "eccentricCue": "Retorna en 2 a 3 segundos permitiendo que el tríceps se estire bajo carga."
    }
  },
  {
    "id": "lib_cardio_1",
    "name": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
    "muscleGroup": "Cardio",
    "equipment": "Caminadora",
    "unifiedCode": "[CARD-ZONA2-CAM-01]",
    "defaultSets": 1,
    "defaultReps": "30 min",
    "defaultRest": "0 s",
    "ratio": 1,
    "biomechanics": "Inclinación 8-12%, velocidad 4.5-5.2 km/h. Mantener FC en Zona 2 (120-135 BPM) sin impacto articular.",
    "mindMuscle": {
      "title": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    }
  },
  {
    "id": "lib_cardio_2",
    "name": "Bicicleta Estática (Zona 2 / Bajo Impacto)",
    "muscleGroup": "Cardio",
    "equipment": "Bicicleta",
    "unifiedCode": "[CARD-ZONA2-BIC-02]",
    "defaultSets": 1,
    "defaultReps": "35 min",
    "defaultRest": "0 s",
    "ratio": 1,
    "biomechanics": "Cadencia fluida constante con resistencia moderada. Cero impacto rotuliano ni fatiga espinal.",
    "mindMuscle": {
      "title": "Bicicleta Estática (Zona 2 / Bajo Impacto)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    }
  },
  {
    "id": "lib_core_3",
    "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
    "muscleGroup": "Abdomen",
    "equipment": "Peso Corporal",
    "unifiedCode": "[HIPER-ABDO-VACU-03]",
    "defaultSets": 4,
    "defaultReps": "15 s",
    "defaultRest": "60 s",
    "ratio": 1,
    "biomechanics": "Exhala el 100% del aire y succiona el ombligo hacia adentro y arriba contra la columna. Activa el corsé anatómico.",
    "mindMuscle": {
      "title": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    }
  },
  {
    "id": "lib_core_4",
    "name": "Pallof Press en Polea (Anti-Rotación)",
    "muscleGroup": "Abdomen",
    "equipment": "Polea",
    "unifiedCode": "[HIPER-ABDO-PALL-04]",
    "defaultSets": 3,
    "defaultReps": "12",
    "defaultRest": "60 s",
    "ratio": 1,
    "biomechanics": "Empuje perpendicular al frente resistiendo con fuerza isométrica el torque giratorio del cable.",
    "mindMuscle": {
      "title": "Pallof Press en Polea (Anti-Rotación)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    }
  }
];

export const MUSCLE_GROUPS_LIST = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Cuádriceps",
  "Isquiotibiales",
  "Glúteos",
  "Bíceps",
  "Tríceps",
  "Pantorrillas",
  "Abdomen",
  "Cardio"
];
