/* ============================================================================
   BASE DE DATOS UNIFICADA DE EJERCICIOS Y MÁQUINAS (COACH V2 ADONIS)
   Catálogo clínico y deportivo con Biomecánica e IAP y Conexión Mente-Músculo individual
   ============================================================================ */

export const UNIFIED_EXERCISE_LIBRARY = [
  {
    "id": "lib_pech_chest_press_conv_01",
    "name": "Press de Pecho en Máquina Convergente (Chest Press)",
    "muscleGroup": "Pecho",
    "equipment": "Máquina",
    "unifiedCode": "[PECH-CHEST_PRESS-CONV_01]",
    "machineKey": "PECH-CHEST_PRESS",
    "muscleGroupCode": "PECH",
    "machineCode": "CHEST_PRESS",
    "specCode": "CONV_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1.15,
    "biomechanics": "Tu ejercicio estrella de fuerza (PR 140 lbs). Escápulas pegadas y deprimidas. Mantén 2-3 segundos de bajada excéntrica. 3-4 minutos de descanso entre series te permitirán no perder repeticiones en las series posteriores. Asiento calibrado para que los manerales queden exactamente a la altura de la parte media del esternón (fibras esternocostales). IAP: Toma aire profundo al diafragma antes de empujar, mantén el torso inflado en la bajada (3s) y exhala al superar la mitad concéntrica.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Press de Pecho en Máquina Convergente (Chest Press)",
      "Machine Chest Press (Prensa Pecho Plano)"
    ]
  },
  {
    "id": "lib_pech_pec_deck_stack_01",
    "name": "Aperturas en Máquina Pec Deck (Peacock / Flyes)",
    "muscleGroup": "Pecho",
    "equipment": "Máquina",
    "unifiedCode": "[PECH-PEC_DECK-STACK_01]",
    "machineKey": "PECH-PEC_DECK",
    "muscleGroupCode": "PECH",
    "machineCode": "PEC_DECK",
    "specCode": "STACK_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.85,
    "biomechanics": "Estiramiento horizontal puro. Abre el pecho, mantén microflexión de codos (15°) y aprieta 1s al centro. Retrae y deprime escápulas pegándolas al cojín. Pausa de 1s en estiramiento y 1s en contracción al centro. Al fallar concéntrico, sostén 5 segundos en estiramiento bajo tensión continua.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Aperturas en Máquina Pec Deck (Peacock / Flyes)",
      "Cristos en Máquina (Pec Deck)"
    ]
  },
  {
    "id": "lib_pech_cable_cross_mid_01",
    "name": "Cruce de Poleas a Media Altura (Cable Crossover)",
    "muscleGroup": "Pecho",
    "equipment": "Polea",
    "unifiedCode": "[PECH-CABLE_CROSS-MID_01]",
    "machineKey": "PECH-CABLE_CROSS",
    "muscleGroupCode": "PECH",
    "machineCode": "CABLE_CROSS",
    "specCode": "MID_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.75,
    "biomechanics": "Poleas a la altura del pecho medio. Paso al frente con torso ligeramente inclinado a 10° y abdomen firme.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Cruce de Poleas Altas y Medias (Cable Crossover)",
      "Cruce de poleas a media altura (Cable Crossover)",
      "Aperturas en polea media"
    ]
  },
  {
    "id": "lib_pech_inc_press_nitro_01",
    "name": "Press Inclinado en Máquina (Nitro Incline)",
    "muscleGroup": "Pecho",
    "equipment": "Máquina",
    "unifiedCode": "[PECH-INC_PRESS-NITRO_01]",
    "machineKey": "PECH-INC_PRESS",
    "muscleGroupCode": "PECH",
    "machineCode": "INC_PRESS",
    "specCode": "NITRO_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 1.2,
    "biomechanics": "Asiento calibrado para que los manerales comiencen a la altura de la clavícula. Apoyo lumbar y dorsal firme. Trayectoria convergente que concentra la máxima tensión al final de la contracción.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Haz Clavicular / Pecho Superior)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Press Inclinado en Máquina o Multipower (Smith Machine)",
      "Press Inclinado en Máquina (Nitro Incline)"
    ]
  },
  {
    "id": "lib_espa_pulldown_wide_01",
    "name": "Jalón al Pecho en Polea (Agarre Ancho Pronado)",
    "muscleGroup": "Espalda",
    "equipment": "Polea",
    "unifiedCode": "[ESPA-PULLDOWN-WIDE_01]",
    "machineKey": "ESPA-PULLDOWN",
    "muscleGroupCode": "ESPA",
    "machineCode": "PULLDOWN",
    "specCode": "WIDE_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "El constructor del V-Taper. Agarre 1.5 anchos de hombro con agarre thumbless (pulgar montado). Tracciona llevando los codos hacia las costillas y clavando las escápulas. Barra a la parte superior del esternón. IAP: Inhala al estirar los brazos arriba, contén el aire mientras desciendes los codos y exhala al rozar la clavícula.",
    "mindMuscle": {
      "title": "Dorsal Ancho & Espalda Superior",
      "internalCue": "Usa las manos como ganchos y tracciona llevando los codos verticalmente hacia tus bolsillos traseros.",
      "externalCue": "Imagina doblar la barra sobre tus hombros expandiendo el pecho hacia el cielo.",
      "eccentricCue": "Deja que el peso te estire hacia arriba en 3 segundos sintiendo la tracción desde la axila a la cadera."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Jalón en Polea al Pecho con Agarre Ancho (Lat Pulldown)",
      "Jalón al Pecho en Polea (Agarre Ancho Pronado)"
    ]
  },
  {
    "id": "lib_espa_seated_row_gironda_01",
    "name": "Remo Gironda en Polea Baja (Agarre Neutro)",
    "muscleGroup": "Espalda",
    "equipment": "Polea",
    "unifiedCode": "[ESPA-SEATED_ROW-GIRONDA_01]",
    "machineKey": "ESPA-SEATED_ROW",
    "muscleGroupCode": "ESPA",
    "machineCode": "SEATED_ROW",
    "specCode": "GIRONDA_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1.1,
    "biomechanics": "Tracción hacia el ombligo manteniendo el pecho erguido. Densidad dorsal media y baja. Sentado en polea baja con agarre estrecho o máquina de apoyo al pecho. Inicia retrayendo las escápulas y tira del maneral hacia el ombligo sin balancear la espalda hacia atrás.",
    "mindMuscle": {
      "title": "Espalda Media, Romboides & Densidad Escapular",
      "internalCue": "Inicia la tracción retrayendo escápulas y aprieta el centro de la espalda al final con pausa de 1s.",
      "externalCue": "Clava los codos hacia atrás contra la pared detrás de ti.",
      "eccentricCue": "Frena el retorno en 3 segundos dejando que las escápulas se abran suavemente con control."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Remo Gironda en Polea Baja con Triángulo (Seated Cable Row)",
      "Remo Gironda agarre neutro",
      "Remo en Máquina o Gironda (Agarre Neutro)"
    ]
  },
  {
    "id": "lib_espa_machine_row_chest_supp_01",
    "name": "Remo Compuesto en Máquina (Apoyo al Pecho)",
    "muscleGroup": "Espalda",
    "equipment": "Máquina",
    "unifiedCode": "[ESPA-MACHINE_ROW-CHEST_SUPP_01]",
    "machineKey": "ESPA-MACHINE_ROW",
    "muscleGroupCode": "ESPA",
    "machineCode": "MACHINE_ROW",
    "specCode": "CHEST_SUPP_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1.25,
    "biomechanics": "Cero estrés lumbar. Apoyo firme del esternón. Tracción horizontal enfocada en retraer escápulas y densificar la espalda media. Tira con los codos hacia atrás juntando las escápulas al final con pausa de 1 segundo.",
    "mindMuscle": {
      "title": "Espalda Media, Romboides & Densidad Escapular",
      "internalCue": "Inicia la tracción retrayendo escápulas y aprieta el centro de la espalda al final con pausa de 1s.",
      "externalCue": "Clava los codos hacia atrás contra la pared detrás de ti.",
      "eccentricCue": "Frena el retorno en 3 segundos dejando que las escápulas se abran suavemente con control."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Remo en Máquina Convergente con Apoyo Pectoral (Machine Row)",
      "Remo Compuesto en Máquina (Apoyo al Pecho)"
    ]
  },
  {
    "id": "lib_espa_pullover_high_cable_01",
    "name": "Pull-Over en Polea Alta con Cuerda",
    "muscleGroup": "Espalda",
    "equipment": "Polea",
    "unifiedCode": "[ESPA-PULLOVER-HIGH_CABLE_01]",
    "machineKey": "ESPA-PULLOVER",
    "muscleGroupCode": "ESPA",
    "machineCode": "PULLOVER",
    "specCode": "HIGH_CABLE_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.6,
    "biomechanics": "Torso a 45°, brazos con microflexión fija (15°). Aísla el dorsal ancho en rango elongado sin fatigar los bíceps. Conduce las manos en un arco descendente amplio hacia los muslos sin doblar los codos.",
    "mindMuscle": {
      "title": "Dorsal Ancho & Espalda Superior",
      "internalCue": "Usa las manos como ganchos y tracciona llevando los codos verticalmente hacia tus bolsillos traseros.",
      "externalCue": "Imagina doblar la barra sobre tus hombros expandiendo el pecho hacia el cielo.",
      "eccentricCue": "Deja que el peso te estire hacia arriba en 3 segundos sintiendo la tracción desde la axila a la cadera."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Pullover en Polea Alta con Cuerda (Straight Arm Pulldown)",
      "Pull-Over en Polea Alta con Cuerda"
    ]
  },
  {
    "id": "lib_homb_lat_raise_maq_01",
    "name": "Elevaciones Laterales en Máquina",
    "muscleGroup": "Hombros",
    "equipment": "Máquina / Polea",
    "unifiedCode": "[HOMB-LAT_RAISE-MAQ_01]",
    "machineKey": "HOMB-LAT_RAISE",
    "muscleGroupCode": "HOMB",
    "machineCode": "LAT_RAISE",
    "specCode": "MAQ_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.8,
    "biomechanics": "Se adelantan al puesto #2 con el SNC fresco. Eje de la máquina alineado con el hombro (articulación glenohumeral). Almohadillas apoyadas en el tercio distal del brazo (justo arriba del codo). Torso ligeramente inclinado 10° adelante para alinear el deltoides lateral en el plano escapular. Haz 12-15 reps estrictas hasta que ya no puedas subir el peso a la horizontal; ¡NO sueltes el peso al fallar! Inmediatamente saca 4 a 6 repeticiones parciales en el tercio inferior (0° a 45° de abducción, Pedrosa 2022 / Kassiano 2023) controlando la bajada para inducir tensión mecánica descomunal en estiramiento sin riesgo articular.",
    "mindMuscle": {
      "title": "Deltoides Lateral (V-Taper & Amplitud)",
      "internalCue": "Lidera desde los codos con trapecios y cuello completamente relajados.",
      "externalCue": "Lanza los codos o mancuernas hacia las esquinas más alejadas de la habitación.",
      "eccentricCue": "Desciende en 2 a 3 segundos conteniendo la gravedad."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Elevaciones Laterales en Máquina o Polea Baja (Lateral Raises)",
      "Elevaciones Laterales en Máquina (¡Prioridad!)",
      "Elevaciones Laterales en Máquina"
    ]
  },
  {
    "id": "lib_homb_shoulder_press_conv_01",
    "name": "Press Militar en Máquina Convergente (Shoulder Press)",
    "muscleGroup": "Hombros",
    "equipment": "Máquina",
    "unifiedCode": "[HOMB-SHOULDER_PRESS-CONV_01]",
    "machineKey": "HOMB-SHOULDER_PRESS",
    "muscleGroupCode": "HOMB",
    "machineCode": "SHOULDER_PRESS",
    "specCode": "CONV_01",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Press Militar en Máquina Convergente o Smith (Shoulder Press)"
    ]
  },
  {
    "id": "lib_homb_rear_delt_pec_deck_01",
    "name": "Pájaros en Pec Deck Inverso (Reverse Flyes)",
    "muscleGroup": "Hombros",
    "equipment": "Máquina",
    "unifiedCode": "[HOMB-REAR_DELT-PEC_DECK_01]",
    "machineKey": "HOMB-REAR_DELT",
    "muscleGroupCode": "HOMB",
    "machineCode": "REAR_DELT",
    "specCode": "PEC_DECK_01",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Pájaro en Máquina Pec Deck Inverso (Reverse Flyes)",
      "Pájaros en Pec Deck Inverso"
    ]
  },
  {
    "id": "lib_cuad_leg_press_disc_45_pb",
    "name": "Prensa de Piernas Inclinada 45° (Discos)",
    "muscleGroup": "Cuádriceps",
    "equipment": "Máquina",
    "unifiedCode": "[CUAD-LEG_PRESS-DISC_45_PB]",
    "machineKey": "CUAD-LEG_PRESS",
    "muscleGroupCode": "CUAD",
    "machineCode": "LEG_PRESS",
    "specCode": "DISC_45_PB",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "150 s",
    "ratio": 2.2,
    "biomechanics": "Pies al ancho de hombros. Descenso profundo sin que el sacro despegue del respaldo. Enorme sobrecarga de cuádriceps y glúteo. Pies colocados en el centro de la plataforma al ancho de hombros. Espalda y sacro completamente pegados al asiento; NUNCA permitas retroversión pélvica ('butt wink') al fondo. Baja hasta que los muslos queden a unos 80-90° respecto al torso. IAP: Respira hondo antes de liberar la carga, mantén el torso inflado y las manos sujetando firmemente los mangos laterales para anclar la pelvis.",
    "mindMuscle": {
      "title": "Cuádriceps & Cadena Anterior",
      "internalCue": "Hunde las rodillas con flexión profunda cargando la tensión en los vastos sin redondear la zona lumbar.",
      "externalCue": "Empuja el piso o la plataforma a través de los talones y tercio medio del pie sin bloquear bruscamente.",
      "eccentricCue": "Desciende en 3 segundos lentos y continuos sintiendo cómo los muslos se estiran como resortes."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Prensa de Pierna Inclinada 45° (Leg Press 45°)",
      "Prensa de Piernas 45° (Posición Central)"
    ]
  },
  {
    "id": "lib_cuad_hack_squat_disc_01",
    "name": "Sentadilla en Máquina Hack (Hack Squat)",
    "muscleGroup": "Cuádriceps",
    "equipment": "Máquina",
    "unifiedCode": "[CUAD-HACK_SQUAT-DISC_01]",
    "machineKey": "CUAD-HACK_SQUAT",
    "muscleGroupCode": "CUAD",
    "machineCode": "HACK_SQUAT",
    "specCode": "DISC_01",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Sentadilla en Máquina Hack (Hack Squat)"
    ]
  },
  {
    "id": "lib_cuad_leg_ext_stack_01",
    "name": "Extensión de Cuádriceps en Máquina (Torre de Placas)",
    "muscleGroup": "Cuádriceps",
    "equipment": "Máquina",
    "unifiedCode": "[CUAD-LEG_EXT-STACK_01]",
    "machineKey": "CUAD-LEG_EXT",
    "muscleGroupCode": "CUAD",
    "machineCode": "LEG_EXT",
    "specCode": "STACK_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Lubrica el líquido sinovial rotuliano e inunda los cuádriceps de sangre antes de cargar las máquinas pesadas. El eje de giro de la máquina debe quedar alineado milimétricamente con el centro de la articulación de la rodilla. Almohadilla apoyada en el empeine/tobillo bajo. Sujeta con fuerza los mangos laterales para evitar que los glúteos se levanten del asiento al patear. Extensión completa arriba con pausa de 1 segundo; al fallar concéntrico, ejecuta 3 a 5 parciales en el fondo estirado.",
    "mindMuscle": {
      "title": "Cuádriceps (Recto Femoral en Acortamiento)",
      "internalCue": "Aprieta la parte superior del muslo con fuerza brutal arriba; mantén los tobillos en ángulo neutro.",
      "externalCue": "Patea la almohadilla hacia el techo estirando la pierna en línea recta.",
      "eccentricCue": "Frena la caída en 3 segundos sintiendo la resistencia continua del cuádriceps."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Extensiones de Cuádriceps en Máquina Sentado (Leg Extension)",
      "Extensión de Cuádriceps (Pre-activación)"
    ]
  },
  {
    "id": "lib_isqu_leg_curl_seated_01",
    "name": "Flexión de Femorales Sentado (Seated Leg Curl)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Máquina",
    "unifiedCode": "[ISQU-LEG_CURL-SEATED_01]",
    "machineKey": "ISQU-LEG_CURL",
    "muscleGroupCode": "ISQU",
    "machineCode": "LEG_CURL",
    "specCode": "SEATED_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.95,
    "biomechanics": "Preactivación y elongación de isquiotibiales (Maeo 2021: los isquios crecen más cuando la cadera está a 90° flexionada). Respaldo ajustado para que la rodilla coincida con el eje de rotación. Ajusta bien la almohadilla superior sobre los muslos para anclar la pelvis firmemente. Tobillos en dorsiflexión activa. Flexión controlada hacia abajo, pausa de 1s en la contracción abajo, y retorno lento (3s excéntrica) sintiendo cómo los isquios se estiran bajo tensión.",
    "mindMuscle": {
      "title": "Isquiotibiales (Bíceps Femoral y Semitendinoso)",
      "internalCue": "Mantén los pies en flexión neutra y flexiona con potencia llevando los talones hacia el asiento/glúteos.",
      "externalCue": "Hala el rodillo hacia la base de la máquina con un tirón continuo y firme.",
      "eccentricCue": "Frena el retorno en 3 segundos lentos sintiendo cómo los femorales se alargan bajo carga."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Curl de Pechuga / Isquiotibiales en Máquina Tumbado o Sentado (Leg Curl)",
      "Flexión de Femorales Sentado (Seated Leg Curl)"
    ]
  },
  {
    "id": "lib_glut_hip_thrust_maq_01",
    "name": "Empuje de Cadera en Máquina Guiada o Barra (Hip Thrust)",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[GLUT-HIP_THRUST-MAQ_01]",
    "machineKey": "GLUT-HIP_THRUST",
    "muscleGroupCode": "GLUT",
    "machineCode": "HIP_THRUST",
    "specCode": "MAQ_01",
    "defaultSets": 4,
    "defaultReps": "8-12",
    "defaultRest": "120 s",
    "ratio": 1.8,
    "biomechanics": "Espalda apoyada en banco a la altura de escápulas o en máquina específica. Empuje pélvico con retroversión en la cima.",
    "mindMuscle": {
      "title": "Glúteo Mayor & Cadera",
      "internalCue": "Inicia el movimiento activando el glúteo y aprieta con fuerza máxima en el punto de extensión completa.",
      "externalCue": "Empuja la plataforma o barra hacia arriba/atrás con la fuerza pura de la cadera.",
      "eccentricCue": "Regresa en 2 a 3 segundos controlados conteniendo la resistencia."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Empuje de Cadera en Máquina Guiada o Barra (Hip Thrust Machine)",
      "Hip Thrust en máquina o con barra libre (3x8-10)"
    ]
  },
  {
    "id": "lib_isqu_rdl_manc_01",
    "name": "Peso Muerto Rumano (RDL) con Mancuernas",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Máquina / Pesas",
    "unifiedCode": "[ISQU-RDL-MANC_01]",
    "machineKey": "ISQU-RDL",
    "muscleGroupCode": "ISQU",
    "machineCode": "RDL",
    "specCode": "MANC_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 1.1,
    "biomechanics": "Bisagra pura de cadera. Empuja las caderas hacia la pared de atrás, microflexión fija de rodillas (15°). Siente el estiramiento salvaje en isquios y glúteos. Mancuernas rozando espinillas hasta justo debajo de rodillas. Subida potente empujando con talones y contrayendo glúteos al frente.",
    "mindMuscle": {
      "title": "Isquiotibiales & Glúteo Mayor (Cadena Posterior)",
      "internalCue": "Bisagra pura de cadera: siente los femorales tensarse mientras la pelvis viaja hacia atrás.",
      "externalCue": "Imagina empujar una puerta con los glúteos manteniendo las espinillas verticales.",
      "eccentricCue": "Baja las pesas rozando las piernas en 3 segundos sin arquear la espalda baja."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Peso Muerto Rumano con Mancuernas o Máquina Smith (RDL)",
      "Peso Muerto Rumano con Mancuernas (RDL)",
      "Peso Muerto Rumano (RDL) con Mancuernas"
    ]
  },
  {
    "id": "lib_bicep_preacher_curl_scott_maq_01",
    "name": "Curl de Bíceps en Banco Scott o Máquina Predicador",
    "muscleGroup": "Bíceps",
    "equipment": "Máquina",
    "unifiedCode": "[BICEP-PREACHER_CURL-SCOTT_MAQ_01]",
    "machineKey": "BICEP-PREACHER_CURL",
    "muscleGroupCode": "BICEP",
    "machineCode": "PREACHER_CURL",
    "specCode": "SCOTT_MAQ_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.8,
    "biomechanics": "Aislamiento puro de la cabeza corta (grosor interno del brazo). Tríceps y axilas firmemente apoyados sobre la almohadilla inclinada a 45°.",
    "mindMuscle": {
      "title": "Bíceps Braquial & Braquiorradial",
      "internalCue": "Fija los codos como bisagras a los costados y supina la muñeca activamente al subir.",
      "externalCue": "Lleva la carga hacia los hombros apretando el pico del bíceps.",
      "eccentricCue": "Extiende los brazos en 3 segundos lentos hasta estiramiento completo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Curl de Bíceps en Banco Scott o Máquina Predicador (Preacher Curl)",
      "Curl en Banco Predicador (Scott) o Máquina"
    ]
  },
  {
    "id": "lib_tric_pushdown_cable_01",
    "name": "Extensión de Tríceps en Polea (Pushdown con Cuerda o Barra)",
    "muscleGroup": "Tríceps",
    "equipment": "Polea",
    "unifiedCode": "[TRIC-PUSHDOWN-CABLE_01]",
    "machineKey": "TRIC-PUSHDOWN",
    "muscleGroupCode": "TRIC",
    "machineCode": "PUSHDOWN",
    "specCode": "CABLE_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.9,
    "biomechanics": "El tríceps compone el 60-65% del volumen total del brazo; el grosor y amplitud frontal dependen directamente de la cabeza lateral. Barra recta o V. Codos bloqueados y anclados al torso como bisagras inmóviles. Tronco ligeramente inclinado 10° adelante. Al descender, bloquea por completo los codos y aprieta 1 segundo entero con contracción isométrica máxima. Controla la fase excéntrica en 3 segundos continuos sin separar los codos de las costillas.",
    "mindMuscle": {
      "title": "Tríceps Braquial",
      "internalCue": "Extiende el codo por completo apretando la parte posterior del brazo durante 1 segundo.",
      "externalCue": "Empuja la resistencia hacia el suelo o hacia atrás con los codos fijos.",
      "eccentricCue": "Retorna en 2 a 3 segundos permitiendo que el tríceps se estire bajo carga."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Extensión de Tríceps en Polea Alta con Cuerda o Barra (Triceps Pushdown)",
      "Extensión de Tríceps en Polea (Pushdown)"
    ]
  },
  {
    "id": "lib_tric_dips_assist_01",
    "name": "Fondos en Máquina Asistida o Paralelas (Dips Machine)",
    "muscleGroup": "Tríceps",
    "equipment": "Máquina",
    "unifiedCode": "[TRIC-DIPS-ASSIST_01]",
    "machineKey": "TRIC-DIPS",
    "muscleGroupCode": "TRIC",
    "machineCode": "DIPS",
    "specCode": "ASSIST_01",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Fondos en Máquina Asistida o Paralelas (Dips Machine)"
    ]
  },
  {
    "id": "lib_pant_calf_raise_maq_01",
    "name": "Elevación de Pantorrillas en Máquina (Rotary o de Pie)",
    "muscleGroup": "Pantorrillas",
    "equipment": "Máquina",
    "unifiedCode": "[PANT-CALF_RAISE-MAQ_01]",
    "machineKey": "PANT-CALF_RAISE",
    "muscleGroupCode": "PANT",
    "machineCode": "CALF_RAISE",
    "specCode": "MAQ_01",
    "defaultSets": 4,
    "defaultReps": "15-20",
    "defaultRest": "60 s",
    "ratio": 1.5,
    "biomechanics": "Regla de oro: 2 segundos de pausa completa en el punto más bajo (estiramiento) para anular el rebote elástico del tendón de Aquiles y obligar al sóleo/gastrocnemio a trabajar. Apoyo exclusivo en las almohadillas metatarsianas de los pies sobre el borde de la plataforma. Elevación concéntrica potente con 1s de contracción en piedra arriba.",
    "mindMuscle": {
      "title": "Tríceps Sural (Gastrocnemio y Sóleo)",
      "internalCue": "Pausa obligatoria de 2s en máximo estiramiento abajo; elévate sobre los metatarsos y dedo gordo.",
      "externalCue": "Toca el techo con la cabeza impulsándote exclusivamente con los dedos de los pies.",
      "eccentricCue": "Baja los talones en 3 segundos profundos hasta sentir el estiramiento del tendón de Aquiles."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Elevación de Talones en Máquina Sentado o Pie (Calf Raise Machine)",
      "Elevación de Pantorrillas (Rotary o de Pie)",
      "Elevación de Pantorrillas"
    ]
  },
  {
    "id": "lib_abdo_crunch_cable_01",
    "name": "Crunch Abdominal en Polea Alta o Máquina (Cable Crunch)",
    "muscleGroup": "Abdomen",
    "equipment": "Máquina / Polea",
    "unifiedCode": "[ABDO-CRUNCH-CABLE_01]",
    "machineKey": "ABDO-CRUNCH",
    "muscleGroupCode": "ABDO",
    "machineCode": "CRUNCH",
    "specCode": "CABLE_01",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Crunch Abdominal en Máquina con Carga o Polea Alta (Cable Crunch)"
    ]
  },
  {
    "id": "lib_aduc_aductor_stack_01",
    "name": "Aductores en Máquina (Hip Adduction / Cerrar Cadera)",
    "muscleGroup": "Aductores",
    "equipment": "Máquina",
    "unifiedCode": "[ADUC-ADUCTOR-STACK_01]",
    "machineKey": "ADUC-ADUCTOR",
    "muscleGroupCode": "ADUC",
    "machineCode": "ADUCTOR",
    "specCode": "STACK_01",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Aductores en Máquina (Hip Adduction / Cerrar Cadera)",
      "Aductores en Máquina (Cerrar Cadera)",
      "Aductores en Máquina (Hip Adduction)"
    ]
  },
  {
    "id": "lib_abdu_abductor_stack_01",
    "name": "Abductores en Máquina (Hip Abduction / Abrir Cadera)",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[ABDU-ABDUCTOR-STACK_01]",
    "machineKey": "ABDU-ABDUCTOR",
    "muscleGroupCode": "ABDU",
    "machineCode": "ABDUCTOR",
    "specCode": "STACK_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Torso inclinado 15° hacia adelante. Estimula el glúteo medio y superior, dando soporte a la cadera y forma a la pelvis. Sentado en máquina con la pelvis bien anclada al respaldo. Almohadillas en la cara externa de las rodillas. Abre las piernas al máximo rango posible y sostén 1 segundo la contracción.",
    "mindMuscle": {
      "title": "Glúteo Medio y Menor (Estabilidad de Cadera)",
      "internalCue": "Siente el costado del glúteo activarse para empujar hacia los lados sin balancear la espalda.",
      "externalCue": "Separa las almohadillas hacia las paredes laterales de la sala.",
      "eccentricCue": "Regresa en 3 segundos sin dejar que las placas se golpeen."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Abductores en Máquina (Hip Abduction / Abrir Cadera)",
      "Abductores en Máquina (Abrir Cadera)"
    ]
  },
  {
    "id": "lib_glut_butt_blaster_maq_01",
    "name": "Glute Butt Blaster en Máquina",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[GLUT-BUTT_BLASTER-MAQ_01]",
    "machineKey": "GLUT-BUTT_BLASTER",
    "muscleGroupCode": "GLUT",
    "machineCode": "BUTT_BLASTER",
    "specCode": "MAQ_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Extensión de cadera guiada empujando la plataforma hacia atrás con la planta del pie. Pausa de 1s en la contracción.",
    "mindMuscle": {
      "title": "Glúteo Mayor & Cadera",
      "internalCue": "Inicia el movimiento activando el glúteo y aprieta con fuerza máxima en el punto de extensión completa.",
      "externalCue": "Empuja la plataforma o barra hacia arriba/atrás con la fuerza pura de la cadera.",
      "eccentricCue": "Regresa en 2 a 3 segundos controlados conteniendo la resistencia."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Glute Butt Blaster en Máquina"
    ]
  },
  {
    "id": "lib_glut_roman_chair_45_01",
    "name": "Extensiones a 45° en Banco Romano para Glúteo",
    "muscleGroup": "Glúteos",
    "equipment": "Banco / Peso Corporal",
    "unifiedCode": "[GLUT-ROMAN_CHAIR-45_01]",
    "machineKey": "GLUT-ROMAN_CHAIR",
    "muscleGroupCode": "GLUT",
    "machineCode": "ROMAN_CHAIR",
    "specCode": "45_01",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Extensiones de Glúteo a 45° en Banco Romano",
      "Extensiones a 45° en Banco Romano (espalda alta redondeada)"
    ]
  },
  {
    "id": "lib_cuad_leg_press_uni_01",
    "name": "Prensa Unilateral a 1 Pierna (Pie Alto)",
    "muscleGroup": "Glúteos",
    "equipment": "Máquina",
    "unifiedCode": "[CUAD-LEG_PRESS-UNI_01]",
    "machineKey": "CUAD-LEG_PRESS",
    "muscleGroupCode": "CUAD",
    "machineCode": "LEG_PRESS",
    "specCode": "UNI_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.6,
    "biomechanics": "1 pie en la esquina superior de la plataforma. Descenso profundo para máxima flexión de cadera y activación de glúteo e isquios.",
    "mindMuscle": {
      "title": "Cuádriceps & Cadena Anterior",
      "internalCue": "Hunde las rodillas con flexión profunda cargando la tensión en los vastos sin redondear la zona lumbar.",
      "externalCue": "Empuja el piso o la plataforma a través de los talones y tercio medio del pie sin bloquear bruscamente.",
      "eccentricCue": "Desciende en 3 segundos lentos y continuos sintiendo cómo los muslos se estiran como resortes."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Prensa Unilateral a 1 Pierna (Pie Alto)"
    ]
  },
  {
    "id": "lib_cuad_bulgarian_manc_01",
    "name": "Sentadilla Búlgara con Mancuernas",
    "muscleGroup": "Cuádriceps",
    "equipment": "Mancuernas",
    "unifiedCode": "[CUAD-BULGARIAN-MANC_01]",
    "machineKey": "CUAD-BULGARIAN",
    "muscleGroupCode": "CUAD",
    "machineCode": "BULGARIAN",
    "specCode": "MANC_01",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "90 s",
    "ratio": 0.65,
    "biomechanics": "Paso largo e inclinación del torso a 30°. Mancuernas colgando a los lados. Trabajo unilateral con foco en estabilidad y cuádriceps/glúteo.",
    "mindMuscle": {
      "title": "Cuádriceps & Cadena Anterior (Mancuernas)",
      "internalCue": "Hunde la rodilla delantera con flexión profunda cargando la tensión en el vasto externo y glúteo.",
      "externalCue": "Empuja el piso a través del talón y tercio medio del pie.",
      "eccentricCue": "Desciende en 3 segundos lentos sintiendo el estiramiento profundo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Sentadilla Búlgara con Mancuernas"
    ]
  },
  {
    "id": "lib_cuad_bulgarian_smith_01",
    "name": "Sentadilla Búlgara en Máquina Smith",
    "muscleGroup": "Cuádriceps",
    "equipment": "Smith",
    "unifiedCode": "[CUAD-BULGARIAN-SMITH_01]",
    "machineKey": "CUAD-BULGARIAN",
    "muscleGroupCode": "CUAD",
    "machineCode": "BULGARIAN",
    "specCode": "SMITH_01",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "90-120 s",
    "ratio": 0.85,
    "biomechanics": "Barra guiada apoyada en trapecios. Permite eliminar la demanda de equilibrio lateral y sobrecargar con mayor peso efectivo el cuádriceps.",
    "mindMuscle": {
      "title": "Cuádriceps en Smith Guiada",
      "internalCue": "Aprovecha los rieles para enfocar 100% de la energía en la flexión y empuje del muslo.",
      "externalCue": "Empuja los rieles hacia arriba manteniendo la cadera alineada.",
      "eccentricCue": "Baja en 3 segundos frenando el trineo con control muscular absoluto."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Sentadilla Búlgara en Máquina Smith"
    ]
  },
  {
    "id": "lib_isqu_rdl_smith_01",
    "name": "Peso Muerto Rumano en Máquina Smith (RDL)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Smith",
    "unifiedCode": "[ISQU-RDL-SMITH_01]",
    "machineKey": "ISQU-RDL",
    "muscleGroupCode": "ISQU",
    "machineCode": "RDL",
    "specCode": "SMITH_01",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "150-180 s",
    "ratio": 0.9,
    "biomechanics": "Trayectoria fija vertical. Permite apoyar el peso en los talones y maximizar la elongación de isquiotibiales con mayor sobrecarga mecánica.",
    "mindMuscle": {
      "title": "Isquiotibiales en Smith",
      "internalCue": "Bisagra estricta: empuja los isquiones hacia atrás mientras la barra baja en línea recta.",
      "externalCue": "Clava los talones contra el suelo al subir sin hiperextender la zona lumbar.",
      "eccentricCue": "Resiste la bajada guiada en 3 segundos."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Peso Muerto Rumano en Máquina Smith (RDL)"
    ]
  },
  {
    "id": "lib_isqu_rdl_barbell_01",
    "name": "Peso Muerto Rumano con Barra Libre (RDL)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Barra",
    "unifiedCode": "[ISQU-RDL-BARBELL_01]",
    "machineKey": "ISQU-RDL",
    "muscleGroupCode": "ISQU",
    "machineCode": "RDL",
    "specCode": "BARBELL_01",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 1,
    "biomechanics": "Ejercicio básico compuesto de cadena posterior. Barra olímpica con discos sobre el suelo. Demanda máxima estabilización de erectores espinales e IAP.",
    "mindMuscle": {
      "title": "Cadena Posterior con Barra Libre",
      "internalCue": "Aprieta dorsales para fijar la barra contra las tibias y mantén abdomen presurizado.",
      "externalCue": "Empuja el suelo con fuerza al extender la cadera.",
      "eccentricCue": "Controla el descenso en 3 segundos con rodillas semiflexionadas a 20°."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Peso Muerto Rumano con Barra Libre (RDL)",
      "Peso Muerto Rumano con Barra"
    ]
  },
  {
    "id": "lib_espa_pulldown_v_grip_01",
    "name": "Jalón con Agarre Estrecho Neutro (V-Grip)",
    "muscleGroup": "Espalda",
    "equipment": "Polea",
    "unifiedCode": "[ESPA-PULLDOWN-V_GRIP_01]",
    "machineKey": "ESPA-PULLDOWN",
    "muscleGroupCode": "ESPA",
    "machineCode": "PULLDOWN",
    "specCode": "V_GRIP_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "El agarre neutro cerrado alinea perfectamente la tracción con las fibras ilíacas e inferiores del dorsal ancho, haciendo que el músculo nazca visualmente más abajo (cerca de la cintura). Maneral en V o agarre neutro cerrado en polea alta. Torso ligeramente reclinado (15°). Tira llevando los codos pegados al cuerpo hasta que el maneral toque el esternón bajo.",
    "mindMuscle": {
      "title": "Dorsal Ancho & Espalda Superior",
      "internalCue": "Usa las manos como ganchos y tracciona llevando los codos verticalmente hacia tus bolsillos traseros.",
      "externalCue": "Imagina doblar la barra sobre tus hombros expandiendo el pecho hacia el cielo.",
      "eccentricCue": "Deja que el peso te estire hacia arriba en 3 segundos sintiendo la tracción desde la axila a la cadera."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Jalón al Pecho Agarre Estrecho Neutro (V-Grip)",
      "Jalón con Agarre Estrecho Neutro (V-Grip)"
    ]
  },
  {
    "id": "lib_homb_face_pull_high_cable_01",
    "name": "Face Pulls en Polea Alta con Cuerda",
    "muscleGroup": "Hombros",
    "equipment": "Polea",
    "unifiedCode": "[HOMB-FACE_PULL-HIGH_CABLE_01]",
    "machineKey": "HOMB-FACE_PULL",
    "muscleGroupCode": "HOMB",
    "machineCode": "FACE_PULL",
    "specCode": "HIGH_CABLE_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.9,
    "biomechanics": "Cuerda hacia el tabique nasal separando extremos con rotación externa. Construye el deltoides posterior (hombro 3D) y endereza la postura. Polea ajustada a la altura de los ojos o frente con cuerda doble. Sujeta la cuerda con agarre neutro o pulgares hacia atrás. Retrocede un paso. Pausa de 1 segundo atrás.",
    "mindMuscle": {
      "title": "Face Pulls en Polea Alta (con Cuerda)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Face Pulls en Polea Alta (con Cuerda)",
      "Face Pulls en Polea Alta"
    ]
  },
  {
    "id": "lib_homb_lat_raise_manc_01",
    "name": "Elevaciones Laterales con Mancuernas",
    "muscleGroup": "Hombros",
    "equipment": "Mancuernas",
    "unifiedCode": "[HOMB-LAT_RAISE-MANC_01]",
    "machineKey": "HOMB-LAT_RAISE",
    "muscleGroupCode": "HOMB",
    "machineCode": "LAT_RAISE",
    "specCode": "MANC_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "90 s",
    "ratio": 0.7,
    "biomechanics": "Tercera sesión semanal de deltoides lateral (Frecuencia 3 para V-Taper 3D óptimo). Torso inclinado 10° adelante con codos a 30-45° en el plano escapular. Haz tus 12-15 reps estrictas hasta la horizontal; al fallar, ¡NO sueltes el peso! Saca de 4 a 6 repeticiones parciales en el tercio inferior (0° a 45°, Pedrosa 2022 / Kassiano 2023) controlando la bajada para inducir hipertrofia superior en rango elongado.",
    "mindMuscle": {
      "title": "Deltoides Lateral (V-Taper & Amplitud)",
      "internalCue": "Lidera desde los codos con trapecios y cuello completamente relajados.",
      "externalCue": "Lanza los codos o mancuernas hacia las esquinas más alejadas de la habitación.",
      "eccentricCue": "Desciende en 2 a 3 segundos conteniendo la gravedad."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Elevaciones Laterales con Mancuernas",
      "Elevaciones con mancuernas de pie",
      "Elevaciones Laterales con Mancuernas (o Máquina)"
    ]
  },
  {
    "id": "lib_pech_inc_press_manc_30",
    "name": "Press Inclinado con Mancuernas (Banco a 30°)",
    "muscleGroup": "Pecho",
    "equipment": "Mancuernas / Banco",
    "unifiedCode": "[PECH-INC_PRESS-MANC_30]",
    "machineKey": "PECH-INC_PRESS",
    "muscleGroupCode": "PECH",
    "machineCode": "INC_PRESS",
    "specCode": "MANC_30",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Press Inclinado con Mancuernas (Banco a 30°)",
      "Press Inclinado con mancuernas a 30°"
    ]
  },
  {
    "id": "lib_pech_chest_press_manc_flat_01",
    "name": "Press Plano con Mancuernas",
    "muscleGroup": "Pecho",
    "equipment": "Mancuernas / Barra",
    "unifiedCode": "[PECH-CHEST_PRESS-MANC_FLAT_01]",
    "machineKey": "PECH-CHEST_PRESS",
    "muscleGroupCode": "PECH",
    "machineCode": "CHEST_PRESS",
    "specCode": "MANC_FLAT_01",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "120 s",
    "ratio": 0.9,
    "biomechanics": "Banco plano, ojos bajo la barra, pies plantados con leg drive. Agarre a 1.5 anchos de hombros. Barra toca el esternón medio.",
    "mindMuscle": {
      "title": "Pectoral Mayor (Fibras Esternales)",
      "internalCue": "Siente el pecho abrirse y estirarse abajo; al empujar piensa en juntar tus bíceps hacia el esternón.",
      "externalCue": "Empuja la resistencia alejándola de tu pecho sin adelantar los hombros al bloquear.",
      "eccentricCue": "Desciende en 3 segundos lentos con la caja torácica elevada y escápulas fijas al respaldo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Press Plano con Mancuernas o Barra",
      "Press Plano con Mancuernas"
    ]
  },
  {
    "id": "lib_bicep_cable_curl_low_straight_01",
    "name": "Curl de Bíceps en Polea Baja (Barra Recta)",
    "muscleGroup": "Bíceps",
    "equipment": "Polea",
    "unifiedCode": "[BICEP-CABLE_CURL-LOW_STRAIGHT_01]",
    "machineKey": "BICEP-CABLE_CURL",
    "muscleGroupCode": "BICEP",
    "machineCode": "CABLE_CURL",
    "specCode": "LOW_STRAIGHT_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1,
    "biomechanics": "Codos clavados como bisagras en las costillas. Pico concéntrico de 1 segundo arriba. Polea baja con barra recta o corta.",
    "mindMuscle": {
      "title": "Bíceps Braquial & Braquiorradial",
      "internalCue": "Fija los codos como bisagras a los costados y supina la muñeca activamente al subir.",
      "externalCue": "Lleva la carga hacia los hombros apretando el pico del bíceps.",
      "eccentricCue": "Extiende los brazos en 3 segundos lentos hasta estiramiento completo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Curl de Bíceps en Polea Baja (Barra Recta o Cuerda)",
      "Curl de Bíceps en Polea Baja (Barra Recta)"
    ]
  },
  {
    "id": "lib_bicep_incline_curl_manc_60_01",
    "name": "Curl de Bíceps con Mancuernas (Sentado en Banco a 60°)",
    "muscleGroup": "Bíceps",
    "equipment": "Mancuernas",
    "unifiedCode": "[BICEP-INCLINE_CURL-MANC_60_01]",
    "machineKey": "BICEP-INCLINE_CURL",
    "muscleGroupCode": "BICEP",
    "machineCode": "INCLINE_CURL",
    "specCode": "MANC_60_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 0.5,
    "biomechanics": "La inclinación hacia atrás elonga la cabeza larga del bíceps antes de iniciar la contracción, favoreciendo la formación del 'pico' del bíceps.",
    "mindMuscle": {
      "title": "Bíceps Braquial & Braquiorradial",
      "internalCue": "Fija los codos como bisagras a los costados y supina la muñeca activamente al subir.",
      "externalCue": "Lleva la carga hacia los hombros apretando el pico del bíceps.",
      "eccentricCue": "Extiende los brazos en 3 segundos lentos hasta estiramiento completo."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Curl de Bíceps con Mancuernas (Supinado al subir)",
      "Curl de Bíceps con Mancuernas (Sentado en Banco a 60°)"
    ]
  },
  {
    "id": "lib_bicep_cable_curl_bayesian_01",
    "name": "Bayesian Cable Curl (Estiramiento Humeral en Polea)",
    "muscleGroup": "Bíceps",
    "equipment": "Polea",
    "unifiedCode": "[BICEP-CABLE_CURL-BAYESIAN_01]",
    "machineKey": "BICEP-CABLE_CURL",
    "muscleGroupCode": "BICEP",
    "machineCode": "CABLE_CURL",
    "specCode": "BAYESIAN_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 0.8,
    "biomechanics": "De espaldas a la polea baja con el codo en hiperextensión humeral detrás del torso para sobrecarga en elongación. Pausa de 1s arriba.",
    "mindMuscle": {
      "title": "Bíceps Braquial (Cabeza Larga en Estiramiento)",
      "internalCue": "Siente el tendón del bíceps estirarse al máximo detrás del cuerpo y mantén el codo inmóvil.",
      "externalCue": "Lleva la carga hacia adelante y arriba sin adelantar el codo.",
      "eccentricCue": "Extiende los brazos en 3 segundos lentos hasta estiramiento completo detrás de la cadera."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Bayesian Cable Curl (Estiramiento Humeral)"
    ]
  },
  {
    "id": "lib_tric_katana_ext_cable_01",
    "name": "Extensión Cruzada Katana en Poleas (Katana Extension)",
    "muscleGroup": "Tríceps",
    "equipment": "Máquina",
    "unifiedCode": "[TRIC-KATANA_EXT-CABLE_01]",
    "machineKey": "TRIC-KATANA_EXT",
    "muscleGroupCode": "TRIC",
    "machineCode": "KATANA_EXT",
    "specCode": "CABLE_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "90 s",
    "ratio": 1.1,
    "biomechanics": "Polea alta a la altura del hombro opuesto. Brazo cruzando por detrás de la cabeza en la línea escapular.",
    "mindMuscle": {
      "title": "Tríceps Braquial",
      "internalCue": "Extiende el codo por completo apretando la parte posterior del brazo durante 1 segundo.",
      "externalCue": "Empuja la resistencia hacia el suelo o hacia atrás con los codos fijos.",
      "eccentricCue": "Retorna en 2 a 3 segundos permitiendo que el tríceps se estire bajo carga."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Extensión de Tríceps en Máquina Sentado",
      "Extensión cruzada de tríceps en poleas (Katana extension)"
    ]
  },
  {
    "id": "lib_tric_overhead_ext_manc_01",
    "name": "Extensión Unilateral de Tríceps con Mancuerna tras Nuca (Copa)",
    "muscleGroup": "Tríceps",
    "equipment": "Mancuerna / Polea",
    "unifiedCode": "[TRIC-OVERHEAD_EXT-MANC_01]",
    "machineKey": "TRIC-OVERHEAD_EXT",
    "muscleGroupCode": "TRIC",
    "machineCode": "OVERHEAD_EXT",
    "specCode": "MANC_01",
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
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Extensión de Tríceps Copa Sobre la Cabeza"
    ]
  },
  {
    "id": "lib_card_treadmill_zona2_01",
    "name": "Cardio Zona 2 en Caminadora",
    "muscleGroup": "Cardio",
    "equipment": "Caminadora",
    "unifiedCode": "[CARD-TREADMILL-ZONA2_01]",
    "machineKey": "CARD-TREADMILL",
    "muscleGroupCode": "CARD",
    "machineCode": "TREADMILL",
    "specCode": "ZONA2_01",
    "defaultSets": 1,
    "defaultReps": "30 min",
    "defaultRest": "0 s",
    "ratio": 1,
    "biomechanics": "Inclinación 11-12% a 3.8-4.2 km/h (120-135 BPM). Directo a oxidar ácidos grasos libres tras depletar glucógeno en el pecho. Cero impacto articular en rodillas, activación sostenida de gemelos y glúteos.",
    "mindMuscle": {
      "title": "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Caminadora Inclinada (Zona 2 / Quema de Grasa)",
      "Cardio Zona 2 en Caminadora",
      "Cardio Zona 2"
    ]
  },
  {
    "id": "lib_card_bike_stationary_01",
    "name": "Bicicleta Estática (Zona 2)",
    "muscleGroup": "Cardio",
    "equipment": "Bicicleta",
    "unifiedCode": "[CARD-BIKE-STATIONARY_01]",
    "machineKey": "CARD-BIKE",
    "muscleGroupCode": "CARD",
    "machineCode": "BIKE",
    "specCode": "STATIONARY_01",
    "defaultSets": 1,
    "defaultReps": "35 min",
    "defaultRest": "0 s",
    "ratio": 1,
    "biomechanics": "Bicicleta estática con resistencia moderada a 80-90 RPM. Cadencia constante con frecuencia cardíaca estable.",
    "mindMuscle": {
      "title": "Bicicleta Estática (Zona 2 / Bajo Impacto)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Bicicleta Estática (Zona 2 / Bajo Impacto)",
      "Bicicleta Estática"
    ]
  },
  {
    "id": "lib_abdo_vacuum_isom_01",
    "name": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
    "muscleGroup": "Abdomen",
    "equipment": "Peso Corporal",
    "unifiedCode": "[ABDO-VACUUM-ISOM_01]",
    "machineKey": "ABDO-VACUUM",
    "muscleGroupCode": "ABDO",
    "machineCode": "VACUUM",
    "specCode": "ISOM_01",
    "defaultSets": 4,
    "defaultReps": "15 s",
    "defaultRest": "60 s",
    "ratio": 1,
    "biomechanics": "Apnea espiratoria completa. Ombligo succionado hacia la columna para cerrar el perímetro de la cintura. De pie o apoyado en rodillas. Exhala todo el aire residual de los pulmones. Sin inhalar, expande la caja torácica aspirando el ombligo hacia la columna vertebral y hacia arriba bajo las costillas. Mantén 20 a 25 segundos en apnea espiratoria.",
    "mindMuscle": {
      "title": "Vacuum Abdominal (Transverso / Cintura Estrecha)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Vacuum Abdominal (Transverso / Cintura Estrecha)",
      "Vacuum Abdominal (Transverso)",
      "Vacuum Abdominal",
      "Vacuum Abdominal (Transverso) o Pallof Press"
    ]
  },
  {
    "id": "lib_abdo_pallof_press_cable_01",
    "name": "Pallof Press en Polea (Anti-Rotación)",
    "muscleGroup": "Abdomen",
    "equipment": "Polea",
    "unifiedCode": "[ABDO-PALLOF_PRESS-CABLE_01]",
    "machineKey": "ABDO-PALLOF_PRESS",
    "muscleGroupCode": "ABDO",
    "machineCode": "PALLOF_PRESS",
    "specCode": "CABLE_01",
    "defaultSets": 3,
    "defaultReps": "12",
    "defaultRest": "60 s",
    "ratio": 1,
    "biomechanics": "Polea a la altura del esternón. De pie perpendicular a la polea con agarre doble frente al pecho. Extiende los brazos al frente en línea recta resistiendo el torque rotacional del cable.",
    "mindMuscle": {
      "title": "Pallof Press en Polea (Anti-Rotación)",
      "internalCue": "Concéntrate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos.",
      "externalCue": "Empuja o tracciona contra la resistencia con aceleración uniforme y trayectoria controlada.",
      "eccentricCue": "Desciende o retorna en 2 a 3 segundos sintiendo el estiramiento bajo tensión antes de la siguiente repetición."
    },
    "warmup": "",
    "searchQuery": "",
    "aliases": [
      "Pallof Press en Polea (Anti-Rotación)",
      "Pallof Press en Polea"
    ]
  },
  {
    "id": "lib_pech_inc_press_smith_01",
    "name": "Press Inclinado en Multipower (Smith) a 30°",
    "muscleGroup": "Pecho",
    "equipment": "Máquina Smith",
    "unifiedCode": "[PECH-INC_PRESS-SMITH_01]",
    "machineKey": "PECH-INC_PRESS",
    "muscleGroupCode": "PECH",
    "machineCode": "INC_PRESS",
    "specCode": "SMITH_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180-240 s",
    "ratio": 1.1,
    "biomechanics": "Banco a 30° ubicado para que la barra Smith descienda justo 2-3 cm debajo de las clavículas. Pies firmes generando fuerza contra el suelo. La guía rígida elimina la necesidad de estabilización, permitiendo ir al fallo concéntrico con seguridad y realizar parciales forzadas abajo.",
    "mindMuscle": {
      "title": "Pectoral Superior en Guía Rígida (Smith)",
      "internalCue": "Concéntrate en aplastar el pecho contra sí mismo al subir, sin adelantar los hombros en el punto más alto.",
      "externalCue": "Imagina que intentas doblar la barra Smith hacia adentro como si quisieras doblarla en 'V'.",
      "eccentricCue": "Frena la barra en 3 segundos hasta rozar suavemente las clavículas con pausa isométrica de 1 segundo."
    },
    "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% del peso efectivo x 10 reps (control articular).\n• Serie 2: 75% del peso efectivo x 4 reps (activación neural sin fatiga).",
    "searchQuery": "Press Inclinado en Multipower (Smith) a 30° tecnica biomecanica",
    "aliases": [
      "Press Inclinado en Multipower (Smith) a 30°",
      "Smith Inclinado a 30°"
    ]
  },
  {
    "id": "lib_homb_lat_raise_cable_01",
    "name": "Elevaciones Laterales en Polea Baja a una Mano",
    "muscleGroup": "Hombros",
    "equipment": "Polea",
    "unifiedCode": "[HOMB-LAT_RAISE-CABLE_01]",
    "machineKey": "HOMB-LAT_RAISE",
    "muscleGroupCode": "HOMB",
    "machineCode": "LAT_RAISE",
    "specCode": "CABLE_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "120-150 s",
    "ratio": 0.6,
    "biomechanics": "Polea a la altura de la rodilla o muñeca. Cable pasando por detrás del torso. Agarre con una mano mientras la otra sostiene el poste para estabilidad total.",
    "mindMuscle": {
      "title": "Deltoides Lateral Unilateral en Polea",
      "internalCue": "Siente cómo el deltoides se activa desde el grado cero gracias a la tensión oblicua del cable.",
      "externalCue": "Lanza la mano hacia la esquina lejana de la sala manteniendo el meñique ligeramente arriba.",
      "eccentricCue": "Desciende en 3 segundos controlados sintiendo la resistencia continua del cable."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Elevaciones Laterales en Polea Baja a una mano tecnica biomecanica",
    "aliases": [
      "Elevaciones Laterales en Polea Baja a una mano",
      "Elevaciones laterales en polea"
    ]
  },
  {
    "id": "lib_homb_lat_raise_manc_side_30",
    "name": "Elevaciones con Mancuernas recostado de lado en Banco a 30°",
    "muscleGroup": "Hombros",
    "equipment": "Varios",
    "unifiedCode": "[HOMB-LAT_RAISE-MANC_SIDE_30]",
    "machineKey": "HOMB-LAT_RAISE",
    "muscleGroupCode": "HOMB",
    "machineCode": "LAT_RAISE",
    "specCode": "MANC_SIDE_30",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "120-150 s",
    "ratio": 0.7,
    "biomechanics": "Acostado de costado sobre un banco inclinado a 30-45°. El brazo libre sostiene la mancuerna. Esta inclinación sobrecarga el tercio inicial del recorrido (fase elongada).",
    "mindMuscle": {
      "title": "Deltoides Lateral en Fase Elongada",
      "internalCue": "Inicia la contracción desde el fondo sintiendo el deltoides en tensión máxima.",
      "externalCue": "Eleva la mancuerna en un semicírculo perfecto hasta la línea perpendicular al suelo.",
      "eccentricCue": "Baja muy lento (3s) sintiendo cómo el músculo frena la gravedad."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Elevaciones con mancuernas recostado de lado en banco a 30° tecnica biomecanica",
    "aliases": [
      "Elevaciones con mancuernas recostado de lado en banco a 30°"
    ]
  },
  {
    "id": "lib_pech_inc_press_bar_30",
    "name": "Press Inclinado con Barra a 30°",
    "muscleGroup": "Pecho",
    "equipment": "Varios",
    "unifiedCode": "[PECH-INC_PRESS-BAR_30]",
    "machineKey": "PECH-INC_PRESS",
    "muscleGroupCode": "PECH",
    "machineCode": "INC_PRESS",
    "specCode": "BAR_30",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 1.15,
    "biomechanics": "Banco inclinado a 30°, agarre a 1.5 anchos de hombros con muñecas neutras sobre el antebrazo. La barra desciende controlada hacia la parte media-alta del esternón. Retracción escapular firme.",
    "mindMuscle": {
      "title": "Pectoral Superior con Barra Libre",
      "internalCue": "Siente la tensión acumulada en las fibras claviculares mientras la barra se acerca al pecho.",
      "externalCue": "Imagina empujar el suelo con los pies y alejar la barra con un empuje explosivo y controlado.",
      "eccentricCue": "Desciende en 3 segundos sin rebotar la barra en el esternón."
    },
    "warmup": "🔥 Sí (1 serie feeder): 70% de la carga x 4 reps para calibrar el recorrido de la máquina.",
    "searchQuery": "Press Inclinado con Barra tecnica biomecanica",
    "aliases": [
      "Press Inclinado con Barra"
    ]
  },
  {
    "id": "lib_pech_inc_press_disc_hammer",
    "name": "Press Inclinado Hammer Strength (Plate-Loaded)",
    "muscleGroup": "Pecho",
    "equipment": "Varios",
    "unifiedCode": "[PECH-INC_PRESS-DISC_HAMMER]",
    "machineKey": "PECH-INC_PRESS",
    "muscleGroupCode": "PECH",
    "machineCode": "INC_PRESS",
    "specCode": "DISC_HAMMER",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 1,
    "biomechanics": "Máquina con brazos independientes y carga por discos. Asiento colocado de modo que las manijas queden a nivel de las clavículas al iniciar.",
    "mindMuscle": {
      "title": "Pectoral Superior Unilateral Hammer",
      "internalCue": "Enfócate en la inserción esternal del pectoral mientras contraes al máximo al frente.",
      "externalCue": "Conduce los codos hacia adentro como si intentaras cerrar una pinza gigante.",
      "eccentricCue": "Permite que los brazos de la máquina abran tu caja torácica durante 3 segundos completos."
    },
    "warmup": "🔥 Sí (1 serie feeder): 70% de la carga x 4 reps para calibrar el recorrido de la máquina.",
    "searchQuery": "Hammer Strength Incline tecnica biomecanica",
    "aliases": [
      "Hammer Strength Incline"
    ]
  },
  {
    "id": "lib_pech_fly_manc_flat_01",
    "name": "Aperturas con Mancuernas en Banco Plano",
    "muscleGroup": "Pecho",
    "equipment": "Varios",
    "unifiedCode": "[PECH-FLY-MANC_FLAT_01]",
    "machineKey": "PECH-FLY",
    "muscleGroupCode": "PECH",
    "machineCode": "FLY",
    "specCode": "MANC_FLAT_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 0.4,
    "biomechanics": "Banco horizontal, mancuernas neutras. Codos flexionados a 15-20°. Descenso controlado hasta que los codos alcancen la altura del torso.",
    "mindMuscle": {
      "title": "Pectoral Libre en Estiramiento",
      "internalCue": "Siente cómo las fibras del pecho se alargan en el fondo del banco.",
      "externalCue": "Abre los brazos como alas y luego condúcelos al centro contrayendo el pecho.",
      "eccentricCue": "Baja en 3 segundos completos con caja torácica inflada y orgullosa."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Aperturas con mancuernas en banco plano tecnica biomecanica",
    "aliases": [
      "Aperturas con mancuernas en banco plano"
    ]
  },
  {
    "id": "lib_tric_overhead_ext_cable_01",
    "name": "Extensión de Tríceps Copa en Polea (Cuerda)",
    "muscleGroup": "Tríceps",
    "equipment": "Polea",
    "unifiedCode": "[TRIC-OVERHEAD_EXT-CABLE_01]",
    "machineKey": "TRIC-OVERHEAD_EXT",
    "muscleGroupCode": "TRIC",
    "machineCode": "OVERHEAD_EXT",
    "specCode": "CABLE_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "El tríceps compone el 60-65% del volumen total del brazo; la cabeza larga otorga la masa y grosor visto de perfil. De espaldas a la polea, torso inclinado a 45°. Asegura una flexión profunda del codo por detrás de la cabeza para estirar al 100% la cabeza larga desde su origen en el tubérculo infraglenoideo de la escápula. Fija los codos como bisagras inmóviles, extiende separando los cabos de la cuerda bloqueando 1s al frente y resiste la fase excéntrica en 3 segundos sintiendo el estiramiento profundo bajo carga.",
    "mindMuscle": {
      "title": "Tríceps (Cabeza Larga en Estiramiento Máximo - 65% del Brazo)",
      "internalCue": "Flexión profunda de codo detrás de la cabeza. Siente la tracción extrema en el tubérculo infraglenoideo antes de extender.",
      "externalCue": "Separa los extremos de la cuerda al frente y bloquea los codos con fuerza durante 1 segundo.",
      "eccentricCue": "Regresa en 3 segundos continuos sin permitir que los codos se abran hacia los lados."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "overhead cable rope tricep extension long head stretch",
    "aliases": [
      "Extensión de Tríceps Copa en Polea (Cuerda)"
    ]
  },
  {
    "id": "lib_tric_french_press_manc_01",
    "name": "French Press con Mancuerna a dos Manos",
    "muscleGroup": "Tríceps",
    "equipment": "Varios",
    "unifiedCode": "[TRIC-FRENCH_PRESS-MANC_01]",
    "machineKey": "TRIC-FRENCH_PRESS",
    "muscleGroupCode": "TRIC",
    "machineCode": "FRENCH_PRESS",
    "specCode": "MANC_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 0.5,
    "biomechanics": "Banco a 30-45°. Dos mancuernas neutras o una pesada a dos manos. Codos inclinados hacia atrás para mantener tensión continua.",
    "mindMuscle": {
      "title": "Press Francés Inclinado Libre",
      "internalCue": "Siente la cabeza larga del tríceps alargarse hacia atrás en cada bajada.",
      "externalCue": "Extiende los antebrazos hacia arriba y atrás en arco.",
      "eccentricCue": "Baja las mancuernas a los lados de la cabeza en 3 segundos sin abrir los codos."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "French Press con mancuerna a dos manos tecnica biomecanica",
    "aliases": [
      "French Press con mancuerna a dos manos"
    ]
  },
  {
    "id": "lib_abdo_plank_isom_01",
    "name": "Plancha Abdominal Isométrica Convencional",
    "muscleGroup": "Abdomen",
    "equipment": "Varios",
    "unifiedCode": "[ABDO-PLANK-ISOM_01]",
    "machineKey": "ABDO-PLANK",
    "muscleGroupCode": "ABDO",
    "machineCode": "PLANK",
    "specCode": "ISOM_01",
    "defaultSets": 4,
    "defaultReps": "20-25 s",
    "defaultRest": "60 s",
    "ratio": 1,
    "biomechanics": "Posición de cuatro apoyos en colchoneta. Exhalación completa y aspiración abdominal manteniendo la columna neutra por 15 segundos.",
    "mindMuscle": {
      "title": "Hollow Body Isométrico",
      "internalCue": "Aplasta el suelo con la espalda baja sin dejar pasar ni una hoja de papel.",
      "externalCue": "Extiende las puntas de los pies y dedos de las manos en direcciones opuestas.",
      "eccentricCue": "Mantén la tensión continua durante todo el tiempo prescrito."
    },
    "warmup": "🔥 No ocupa (solo 2 exhalaciones profundas previas).",
    "searchQuery": "Plancha abdominal isométrica convencional (45 s) tecnica biomecanica",
    "aliases": [
      "Plancha abdominal isométrica convencional (45 s)",
      "Plancha Isométrica",
      "Plancha Abdominal Isométrica"
    ]
  },
  {
    "id": "lib_card_treadmill_incline_01",
    "name": "Caminadora en Inclinación (Zona 2)",
    "muscleGroup": "Cardio",
    "equipment": "Varios",
    "unifiedCode": "[CARD-TREADMILL-INCLINE_01]",
    "machineKey": "CARD-TREADMILL",
    "muscleGroupCode": "CARD",
    "machineCode": "TREADMILL",
    "specCode": "INCLINE_01",
    "defaultSets": 1,
    "defaultReps": "35-45 min",
    "defaultRest": "0 s",
    "ratio": 1,
    "biomechanics": "Caminadora a 3.8-4.2 km/h con inclinación del 11-12%.",
    "mindMuscle": {
      "title": "Caminata Inclinada Zona 2",
      "internalCue": "Camina erguido sin sujetar las barandillas para activar la musculatura estabilizadora.",
      "externalCue": "Empuja la cinta con cada zancada manteniendo cadencia uniforme.",
      "eccentricCue": "Controla el ritmo respiratorio continuo."
    },
    "warmup": "🔥 3 minutos progresivos a ritmo suave.",
    "searchQuery": "Caminadora en Inclinación tecnica biomecanica",
    "aliases": [
      "Caminadora en Inclinación"
    ]
  },
  {
    "id": "lib_cuad_sissy_squat_bench_01",
    "name": "Sissy Squat en Soporte",
    "muscleGroup": "Cuádriceps",
    "equipment": "Varios",
    "unifiedCode": "[CUAD-SISSY_SQUAT-BENCH_01]",
    "machineKey": "CUAD-SISSY_SQUAT",
    "muscleGroupCode": "CUAD",
    "machineCode": "SISSY_SQUAT",
    "specCode": "BENCH_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 0.4,
    "biomechanics": "Pies fijados en banco sissy, torso y muslos formando una línea recta. Descenso echando el cuerpo hacia atrás mediante flexión pura de rodilla.",
    "mindMuscle": {
      "title": "Recto Femoral en Sissy Squat",
      "internalCue": "Siente el estiramiento violento y controlado en toda la longitud del muslo.",
      "externalCue": "Empuja los empeines contra los rodillos para volver a la vertical.",
      "eccentricCue": "Baja en 3 segundos manteniendo la cadera bloqueada en extensión."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Sissy Squat en soporte tecnica biomecanica",
    "aliases": [
      "Sissy Squat en soporte"
    ]
  },
  {
    "id": "lib_cuad_leg_ext_uni_01",
    "name": "Extensiones de Cuádriceps Unilaterales en Máquina",
    "muscleGroup": "Cuádriceps",
    "equipment": "Varios",
    "unifiedCode": "[CUAD-LEG_EXT-UNI_01]",
    "machineKey": "CUAD-LEG_EXT",
    "muscleGroupCode": "CUAD",
    "machineCode": "LEG_EXT",
    "specCode": "UNI_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 0.45,
    "biomechanics": "Sentado en banco alto con tobillera conectada a polea baja. Tensión constante durante todo el arco de extensión.",
    "mindMuscle": {
      "title": "Extensión en Polea con Tensión Continua",
      "internalCue": "Aísla el vasto interno apretando en el pico concéntrico.",
      "externalCue": "Extiende la pierna hacia adelante contra el cable.",
      "eccentricCue": "Resiste el tirón del cable en 3 segundos."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Extensiones unilaterales en máquina tecnica biomecanica",
    "aliases": [
      "Extensiones unilaterales en máquina"
    ]
  },
  {
    "id": "lib_cuad_v_squat_maq_01",
    "name": "Sentadilla en Máquina V-Squat",
    "muscleGroup": "Cuádriceps",
    "equipment": "Varios",
    "unifiedCode": "[CUAD-V_SQUAT-MAQ_01]",
    "machineKey": "CUAD-V_SQUAT",
    "muscleGroupCode": "CUAD",
    "machineCode": "V_SQUAT",
    "specCode": "MAQ_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180-240 s",
    "ratio": 1,
    "biomechanics": "V-Squat mirando hacia afuera con respaldo acolchado. Curva de resistencia más suave en el fondo. Mayor profundidad de flexión de rodilla con menor compresión en la rótula.",
    "mindMuscle": {
      "title": "Cuádriceps en V-Squat Guiada",
      "internalCue": "Mantén el torso erguido apoyado al respaldo y flexiona las rodillas profundamente.",
      "externalCue": "Empuja la máquina hacia arriba con los muslos ardiendo.",
      "eccentricCue": "Baja en 3 segundos hasta que los femorales toquen las pantorrillas."
    },
    "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de carga x 8 reps fluidas.\n• Serie 2: 75% de carga x 3 reps con cadencia controlada.",
    "searchQuery": "V-Squat Machine tecnica biomecanica",
    "aliases": [
      "V-Squat Machine"
    ]
  },
  {
    "id": "lib_cuad_squat_smith_01",
    "name": "Sentadilla en Smith con Talones sobre Disco",
    "muscleGroup": "Cuádriceps",
    "equipment": "Máquina Smith",
    "unifiedCode": "[CUAD-SQUAT-SMITH_01]",
    "machineKey": "CUAD-SQUAT",
    "muscleGroupCode": "CUAD",
    "machineCode": "SQUAT",
    "specCode": "SMITH_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180-240 s",
    "ratio": 0.9,
    "biomechanics": "Pies sobre cuña o disco elevador de talón para eliminar la restricción de dorsiflexión de tobillo. Mancuerna sostenida contra el pecho. Torso vertical.",
    "mindMuscle": {
      "title": "Sentadilla Goblet con Talones Elevados",
      "internalCue": "Siente la activación pura de la gota del cuádriceps (vasto medial).",
      "externalCue": "Baja la pelvis como un pistón entre los talones.",
      "eccentricCue": "Desciende en 3 segundos manteniendo el torso perpendicular al suelo."
    },
    "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de carga x 8 reps fluidas.\n• Serie 2: 75% de carga x 3 reps con cadencia controlada.",
    "searchQuery": "Sentadilla en Smith con talones sobre disco tecnica biomecanica",
    "aliases": [
      "Sentadilla en Smith con talones sobre disco"
    ]
  },
  {
    "id": "lib_cuad_leg_press_horiz_01",
    "name": "Prensa Horizontal en Cable / Placas",
    "muscleGroup": "Cuádriceps",
    "equipment": "Varios",
    "unifiedCode": "[CUAD-LEG_PRESS-HORIZ_01]",
    "machineKey": "CUAD-LEG_PRESS",
    "muscleGroupCode": "CUAD",
    "machineCode": "LEG_PRESS",
    "specCode": "HORIZ_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "180 s",
    "ratio": 0.8,
    "biomechanics": "Prensa de discos a 45°. El vector de carga tiene componente vertical y horizontal. Máxima capacidad de sobrecarga en masa.",
    "mindMuscle": {
      "title": "Cuádriceps en Prensa Inclinada 45°",
      "internalCue": "Concéntrate en la tensión continua en los vastos sin descansar en el punto alto.",
      "externalCue": "Lanza la plataforma hacia arriba de forma suave y controlada.",
      "eccentricCue": "Baja en 3 segundos sintiendo la compresión muscular controlada."
    },
    "warmup": "🔥 Sí (1 serie): 70% de la carga x 5 reps para ajustar posición de pies.",
    "searchQuery": "Prensa Horizontal en cable tecnica biomecanica",
    "aliases": [
      "Prensa Horizontal en cable"
    ]
  },
  {
    "id": "lib_cuad_hack_squat_reverse_01",
    "name": "Hack Invertida en Máquina",
    "muscleGroup": "Cuádriceps",
    "equipment": "Varios",
    "unifiedCode": "[CUAD-HACK_SQUAT-REVERSE_01]",
    "machineKey": "CUAD-HACK_SQUAT",
    "muscleGroupCode": "CUAD",
    "machineCode": "HACK_SQUAT",
    "specCode": "REVERSE_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "180 s",
    "ratio": 1,
    "biomechanics": "Prensa horizontal con torre de placas. Menor carga compresiva espinal, ideal para altas repeticiones al fallo metabólico.",
    "mindMuscle": {
      "title": "Prensa Horizontal de Tensión Continua",
      "internalCue": "Siente el ardor en la parte frontal del muslo repetición tras repetición.",
      "externalCue": "Empuja el carro alejándote del reposapiés.",
      "eccentricCue": "Regresa en 2 a 3 segundos antes de que las placas toquen el soporte."
    },
    "warmup": "🔥 Sí (1 serie): 70% de la carga x 5 reps para ajustar posición de pies.",
    "searchQuery": "Hack invertida tecnica biomecanica",
    "aliases": [
      "Hack invertida"
    ]
  },
  {
    "id": "lib_abdu_cable_ankle_01",
    "name": "Abducción de Cadera en Polea Baja con Tobillera",
    "muscleGroup": "Glúteos",
    "equipment": "Varios",
    "unifiedCode": "[ABDU-CABLE-ANKLE_01]",
    "machineKey": "ABDU-CABLE",
    "muscleGroupCode": "ABDU",
    "machineCode": "CABLE",
    "specCode": "ANKLE_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 0.5,
    "biomechanics": "De pie con tobillera en polea baja. Abducción lateral de cadera manteniendo el torso estable y la pelvis neutra.",
    "mindMuscle": {
      "title": "Glúteo Medio en Polea Unilateral",
      "internalCue": "Eleva la pierna sintiendo el costado del glúteo arder.",
      "externalCue": "Patea en diagonal hacia atrás y afuera.",
      "eccentricCue": "Baja la pierna en 3 segundos conteniendo la tracción del cable."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Abducción de cadera en polea baja con tobillera tecnica biomecanica",
    "aliases": [
      "Abducción de cadera en polea baja con tobillera"
    ]
  },
  {
    "id": "lib_pant_calf_raise_leg_press_01",
    "name": "Elevación de Pantorrillas en la Prensa de Piernas",
    "muscleGroup": "Pantorrillas",
    "equipment": "Varios",
    "unifiedCode": "[PANT-CALF_RAISE-LEG_PRESS_01]",
    "machineKey": "PANT-CALF_RAISE",
    "muscleGroupCode": "PANT",
    "machineCode": "CALF_RAISE",
    "specCode": "LEG_PRESS_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1.2,
    "biomechanics": "Puntas de los pies en el borde inferior de la prensa de piernas. Empuje de flexión plantar.",
    "mindMuscle": {
      "title": "Pantorrilla en Prensa de Piernas",
      "internalCue": "Control estricto de los tobillos.",
      "externalCue": "Empuja la plataforma con los dedos de los pies.",
      "eccentricCue": "Deja que el peso baje los talones en 3 segundos sin soltar la tensión."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Elevación de pantorrillas en la Prensa de piernas tecnica biomecanica",
    "aliases": [
      "Elevación de pantorrillas en la Prensa de piernas"
    ]
  },
  {
    "id": "lib_pant_calf_raise_smith_01",
    "name": "Elevación de Pantorrillas en Smith sobre Escalón",
    "muscleGroup": "Pantorrillas",
    "equipment": "Máquina Smith",
    "unifiedCode": "[PANT-CALF_RAISE-SMITH_01]",
    "machineKey": "PANT-CALF_RAISE",
    "muscleGroupCode": "PANT",
    "machineCode": "CALF_RAISE",
    "specCode": "SMITH_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "Máquina de gemelo de pie con hombreras acolchadas. Rodillas con microflexión fija.",
    "mindMuscle": {
      "title": "Gastrocnemio de Pie en Smith",
      "internalCue": "Siente las dos cabezas de la pantorrilla compactarse como piedras arriba.",
      "externalCue": "Elévate sobre las puntas empujando el suelo con los metatarsos.",
      "eccentricCue": "Baja los talones 3 segundos hasta el máximo estiramiento con pausa de 2s abajo."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Elevación en Smith de pie sobre plataforma tecnica biomecanica",
    "aliases": [
      "Elevación en Smith de pie sobre plataforma",
      "Elevación en Smith sobre escalón o en Prensa"
    ]
  },
  {
    "id": "lib_espa_chinup_wide_01",
    "name": "Dominadas Pronadas Asistidas / Lastradas",
    "muscleGroup": "Espalda",
    "equipment": "Varios",
    "unifiedCode": "[ESPA-CHINUP-WIDE_01]",
    "machineKey": "ESPA-CHINUP",
    "muscleGroupCode": "ESPA",
    "machineCode": "CHINUP",
    "specCode": "WIDE_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 0.9,
    "biomechanics": "Barra fija con agarre algo más amplio que los hombros. Depresión escapular antes de flexionar los brazos. Pecho erguido buscando la barra.",
    "mindMuscle": {
      "title": "Dorsal Ancho en Cadena Cinética Cerrada",
      "internalCue": "Piensa en clavar los codos contra las costillas.",
      "externalCue": "Tracciona el suelo hacia tu cuerpo para elevar tu centro de masa.",
      "eccentricCue": "Desciende en 3 segundos completos hasta estiramiento escapular total."
    },
    "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps (lubricación escapulohumeral).\n• Serie 2: 75% de la carga x 4 reps técnicas.",
    "searchQuery": "Dominadas pronadas asistidas/lastradas tecnica biomecanica",
    "aliases": [
      "Dominadas pronadas asistidas/lastradas"
    ]
  },
  {
    "id": "lib_espa_pulldown_uni_cable_01",
    "name": "Jalón Unilateral en Polea",
    "muscleGroup": "Espalda",
    "equipment": "Varios",
    "unifiedCode": "[ESPA-PULLDOWN-UNI_CABLE_01]",
    "machineKey": "ESPA-PULLDOWN",
    "muscleGroupCode": "ESPA",
    "machineCode": "PULLDOWN",
    "specCode": "UNI_CABLE_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 0.5,
    "biomechanics": "Brazos convergentes o divergentes independientes. Trayectoria natural que respeta la articulación del hombro sin forzar rotación interna.",
    "mindMuscle": {
      "title": "Dorsal Ancho Unilateral Guiado",
      "internalCue": "Siente el dorsal de cada lado contraerse independientemente sin compensaciones.",
      "externalCue": "Hala los manerales hacia los laterales del torso.",
      "eccentricCue": "Controla la subida en 3 segundos sintiendo el estiramiento escapular."
    },
    "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps (lubricación escapulohumeral).\n• Serie 2: 75% de la carga x 4 reps técnicas.",
    "searchQuery": "Jalón unilateral en polea tecnica biomecanica",
    "aliases": [
      "Jalón unilateral en polea"
    ]
  },
  {
    "id": "lib_espa_tbar_row_chest_01",
    "name": "Remo con Barra T con Apoyo Torácico",
    "muscleGroup": "Espalda",
    "equipment": "Varios",
    "unifiedCode": "[ESPA-TBAR_ROW-CHEST_01]",
    "machineKey": "ESPA-TBAR_ROW",
    "muscleGroupCode": "ESPA",
    "machineCode": "TBAR_ROW",
    "specCode": "CHEST_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 1,
    "biomechanics": "Banco inclinado con barra T. Pies firmes. Tracción horizontal sin usar impulso de piernas ni de cadera.",
    "mindMuscle": {
      "title": "Densidad de Espalda en Barra T",
      "internalCue": "Aprieta la musculatura periescapular al rozar el pecho con el maneral.",
      "externalCue": "Tira de los codos hacia el techo.",
      "eccentricCue": "Baja el peso en 3 segundos sintiendo el estiramiento de romboides."
    },
    "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
    "searchQuery": "Remo con Barra T con apoyo torácico tecnica biomecanica",
    "aliases": [
      "Remo con Barra T con apoyo torácico"
    ]
  },
  {
    "id": "lib_espa_pullover_manc_01",
    "name": "Pull-Over con Mancuerna sobre Banco",
    "muscleGroup": "Espalda",
    "equipment": "Varios",
    "unifiedCode": "[ESPA-PULLOVER-MANC_01]",
    "machineKey": "ESPA-PULLOVER",
    "muscleGroupCode": "ESPA",
    "machineCode": "PULLOVER",
    "specCode": "MANC_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 0.5,
    "biomechanics": "Agarre a la anchura de los hombros con barra recta en polea alta. Mantiene la trayectoria rígida en un solo plano.",
    "mindMuscle": {
      "title": "Extensión Humeral con Barra en Polea",
      "internalCue": "Presiona la barra hacia abajo usando exclusivamente los dorsales.",
      "externalCue": "Dibuja un arco amplio desde arriba hasta tocar los muslos.",
      "eccentricCue": "Frena la subida en 3 segundos con la caja torácica firme."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Pull-over con mancuerna sobre banco tecnica biomecanica",
    "aliases": [
      "Pull-over con mancuerna sobre banco"
    ]
  },
  {
    "id": "lib_espa_pullover_maq_01",
    "name": "Máquina de Pullover Guiada",
    "muscleGroup": "Espalda",
    "equipment": "Máquina",
    "unifiedCode": "[ESPA-PULLOVER-MAQ_01]",
    "machineKey": "ESPA-PULLOVER",
    "muscleGroupCode": "ESPA",
    "machineCode": "PULLOVER",
    "specCode": "MAQ_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 1.1,
    "biomechanics": "Apoyado transversalmente sobre un banco con escápulas en el cojín y cadera ligeramente baja. Mancuerna sostenida con ambas palmas bajo el plato superior.",
    "mindMuscle": {
      "title": "Pull-Over Libre en Estiramiento",
      "internalCue": "Siente cómo las costillas y el dorsal se abren en el fondo del arco.",
      "externalCue": "Lleva la mancuerna detrás de la cabeza y recupérala sobre el pecho.",
      "eccentricCue": "Desciende en 3 segundos lentos con codos semiflexionados."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Máquina de Pullover guiada tecnica biomecanica",
    "aliases": [
      "Máquina de Pullover guiada"
    ]
  },
  {
    "id": "lib_homb_rear_delt_cable_01",
    "name": "Reverse Cable Flyes en Poleas",
    "muscleGroup": "Hombros",
    "equipment": "Varios",
    "unifiedCode": "[HOMB-REAR_DELT-CABLE_01]",
    "machineKey": "HOMB-REAR_DELT",
    "muscleGroupCode": "HOMB",
    "machineCode": "REAR_DELT",
    "specCode": "CABLE_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 0.8,
    "biomechanics": "Suspensión corporal con pies adelantados. Tracción hacia la frente abriendo los codos en rotación externa.",
    "mindMuscle": {
      "title": "Face Pulls en Peso Corporal",
      "internalCue": "Mantén el cuerpo en línea recta activando glúteos y deltoides posterior.",
      "externalCue": "Hala las anillas hacia tus sienes separando las manos.",
      "eccentricCue": "Desciende en 3 segundos manteniendo la tensión en el core."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Reverse Cable Flyes tecnica biomecanica",
    "aliases": [
      "Reverse Cable Flyes"
    ]
  },
  {
    "id": "lib_bicep_barbell_curl_ez_bar_01",
    "name": "Curl con Barra Z de Pie",
    "muscleGroup": "Bíceps",
    "equipment": "Varios",
    "unifiedCode": "[BICEP-BARBELL_CURL-EZ_BAR_01]",
    "machineKey": "BICEP-BARBELL_CURL",
    "muscleGroupCode": "BICEP",
    "machineCode": "BARBELL_CURL",
    "specCode": "EZ_BAR_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "Agarre en las curvas de la barra Z para comodidad de muñecas. Cero balanceo de espalda lumbar.",
    "mindMuscle": {
      "title": "Bíceps con Barra Z Libre",
      "internalCue": "Aísla los brazos sin balancear la pelvis.",
      "externalCue": "Sube la barra Z en arco firme hacia el cuello.",
      "eccentricCue": "Frena la caída en 3 segundos completos."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Curl con barra Z de pie tecnica biomecanica",
    "aliases": [
      "Curl con barra Z de pie"
    ]
  },
  {
    "id": "lib_card_elliptical_zona2_01",
    "name": "Elíptica (Zona 2)",
    "muscleGroup": "Cardio",
    "equipment": "Varios",
    "unifiedCode": "[CARD-ELLIPTICAL-ZONA2_01]",
    "machineKey": "CARD-ELLIPTICAL",
    "muscleGroupCode": "CARD",
    "machineCode": "ELLIPTICAL",
    "specCode": "ZONA2_01",
    "defaultSets": 1,
    "defaultReps": "35-45 min",
    "defaultRest": "0 s",
    "ratio": 1,
    "biomechanics": "Elíptica a ritmo moderado constante manteniendo 120-135 BPM.",
    "mindMuscle": {
      "title": "Elíptica Zona 2",
      "internalCue": "Movimiento fluido sin golpear los pedales.",
      "externalCue": "Mantén la cadencia continua.",
      "eccentricCue": "Respiración diafragmática nasal constante."
    },
    "warmup": "🔥 3 minutos progresivos.",
    "searchQuery": "Elíptica tecnica biomecanica",
    "aliases": [
      "Elíptica",
      "Elíptica en Zona 2"
    ]
  },
  {
    "id": "lib_pech_chest_press_smith_01",
    "name": "Press de Pecho Plano en Smith",
    "muscleGroup": "Pecho",
    "equipment": "Máquina Smith",
    "unifiedCode": "[PECH-CHEST_PRESS-SMITH_01]",
    "machineKey": "PECH-CHEST_PRESS",
    "muscleGroupCode": "PECH",
    "machineCode": "CHEST_PRESS",
    "specCode": "SMITH_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180-240 s",
    "ratio": 0.9,
    "biomechanics": "Banco plano, mancuernas en ángulo de 45° (agarre semi-pronado). Máximo rango de estiramiento al fondo del banco.",
    "mindMuscle": {
      "title": "Press Plano con Mancuernas",
      "internalCue": "Siente cómo las mancuernas bajan más allá del nivel del torso estirando el pecho.",
      "externalCue": "Empuja las mancuernas en arco hacia el centro sin chocarlas.",
      "eccentricCue": "Baja en 3 segundos lentos y controlados."
    },
    "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps.",
    "searchQuery": "Press de Pecho Plano en Smith tecnica biomecanica",
    "aliases": [
      "Press de Pecho Plano en Smith"
    ]
  },
  {
    "id": "lib_homb_lat_raise_behind_cable_01",
    "name": "Elevaciones Laterales en Polea Baja (Tras Espalda)",
    "muscleGroup": "Hombros",
    "equipment": "Polea",
    "unifiedCode": "[HOMB-LAT_RAISE-BEHIND_CABLE_01]",
    "machineKey": "HOMB-LAT_RAISE",
    "muscleGroupCode": "HOMB",
    "machineCode": "LAT_RAISE",
    "specCode": "BEHIND_CABLE_01",
    "defaultSets": 4,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "El cable pasa por detrás de los glúteos proporcionando tensión mecánica continua desde los 0° de abducción (zona de máxima respuesta hipertrófica según Pedrosa 2022 / Kassiano 2023). Sostén el poste con la mano libre e inclina el torso 10-15° hacia afuera. Eleva el brazo en el plano escapular (30° adelantado) hasta la horizontal; al fallar en la última serie, ¡NO sueltes el maneral! Inmediatamente saca de 4 a 6 repeticiones parciales en el tercio inferior (0° a 45°) controlando la bajada para exprimir la tensión mecánica en estiramiento.",
    "mindMuscle": {
      "title": "Deltoides Lateral (Tensión Continua tras Espalda & Parciales)",
      "internalCue": "Lidera con el codo manteniendo el hombro deprimido. Al fallar en la horizontal, saca 4 a 6 parciales en el tercio inferior.",
      "externalCue": "Lanza la mano hacia la esquina del techo más alejada de tu cuerpo.",
      "eccentricCue": "Resiste el tirón del cable en 3 segundos sintiendo la tracción constante detrás de la espalda."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "cable lateral raise behind back deltoid isolation",
    "aliases": [
      "Elevaciones Laterales en Polea Baja (Tras Espalda)"
    ]
  },
  {
    "id": "lib_pech_cable_cross_low_01",
    "name": "Cruce de Poleas Bajas (Cable Crossover)",
    "muscleGroup": "Pecho",
    "equipment": "Varios",
    "unifiedCode": "[PECH-CABLE_CROSS-LOW_01]",
    "machineKey": "PECH-CABLE_CROSS",
    "muscleGroupCode": "PECH",
    "machineCode": "CABLE_CROSS",
    "specCode": "LOW_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 0.8,
    "biomechanics": "Poleas a la altura media de los hombros con un paso al frente.",
    "mindMuscle": {
      "title": "Aperturas en Polea a Altura Media",
      "internalCue": "Tensión constante en la aducción horizontal.",
      "externalCue": "Junta las manos frente al corazón.",
      "eccentricCue": "Abre los brazos en 3 segundos controlados."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Cruces de polea tecnica biomecanica",
    "aliases": [
      "Cruces de polea"
    ]
  },
  {
    "id": "lib_tric_seated_ext_maq_01",
    "name": "Extensión de Tríceps en Máquina Sentado",
    "muscleGroup": "Tríceps",
    "equipment": "Máquina",
    "unifiedCode": "[TRIC-SEATED_EXT-MAQ_01]",
    "machineKey": "TRIC-SEATED_EXT",
    "muscleGroupCode": "TRIC",
    "machineCode": "SEATED_EXT",
    "specCode": "MAQ_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1.2,
    "biomechanics": "Sentado con codos fijados sobre el rodillo de apoyo alineados con el eje de rotación. Empuja hacia abajo con contracción estricta de 1s.",
    "mindMuscle": {
      "title": "Tríceps en Máquina de Aislamiento",
      "internalCue": "Aprieta la cara posterior del brazo contra las almohadillas al bloquear los codos.",
      "externalCue": "Empuja las palancas hacia el suelo con fuerza constante.",
      "eccentricCue": "Permite que los mangos suban en 3 segundos sin despegar los codos."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "triceps extension machine seated proper form",
    "aliases": [
      "Extensión de Tríceps en Máquina (Sentado)"
    ]
  },
  {
    "id": "lib_isqu_leg_curl_lying_01",
    "name": "Flexión de Femorales Tumbado (Lying Leg Curl)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Varios",
    "unifiedCode": "[ISQU-LEG_CURL-LYING_01]",
    "machineKey": "ISQU-LEG_CURL",
    "muscleGroupCode": "ISQU",
    "machineCode": "LEG_CURL",
    "specCode": "LYING_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120-150 s",
    "ratio": 0.9,
    "biomechanics": "Tumbado prono con almohadilla en tobillos. Aprieta la pelvis contra el banco para no arquear la zona lumbar.",
    "mindMuscle": {
      "title": "Isquiotibiales en Banco Tumbado",
      "internalCue": "Pega el pubis al cojín y lleva los talones a los glúteos.",
      "externalCue": "Dobla las rodillas con fuerza pura de femorales.",
      "eccentricCue": "Baja el rodillo en 3 segundos controlados."
    },
    "warmup": "🔥 Sí (1 serie): 60% de la carga x 6 reps.",
    "searchQuery": "Flexión de femorales tumbado (Lying Leg Curl) tecnica biomecanica",
    "aliases": [
      "Flexión de femorales tumbado (Lying Leg Curl)"
    ]
  },
  {
    "id": "lib_isqu_nordic_curl_assist_01",
    "name": "Curl Nórdico Asistido",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Varios",
    "unifiedCode": "[ISQU-NORDIC_CURL-ASSIST_01]",
    "machineKey": "ISQU-NORDIC_CURL",
    "muscleGroupCode": "ISQU",
    "machineCode": "NORDIC_CURL",
    "specCode": "ASSIST_01",
    "defaultSets": 4,
    "defaultReps": "10-12",
    "defaultRest": "120-150 s",
    "ratio": 1,
    "biomechanics": "Tobillos anclados, cuerpo recto como una tabla. Descenso excéntrico resistiendo la gravedad con los isquiotibiales.",
    "mindMuscle": {
      "title": "Excéntrico Nórdico de Alta Tensión",
      "internalCue": "Siente los femorales quemar resistiendo la caída del cuerpo.",
      "externalCue": "Frena la caída hacia el suelo con las rodillas como pivote.",
      "eccentricCue": "Desciende en 4 segundos tan lento como sea humanamente posible."
    },
    "warmup": "🔥 Sí (1 serie): 60% de la carga x 6 reps.",
    "searchQuery": "Curl nórdico asistido tecnica biomecanica",
    "aliases": [
      "Curl nórdico asistido"
    ]
  },
  {
    "id": "lib_glut_leg_press_high_feet_45",
    "name": "Prensa 45° (Pies Altos y Abiertos para Glúteo)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Varios",
    "unifiedCode": "[GLUT-LEG_PRESS-HIGH_FEET_45]",
    "machineKey": "GLUT-LEG_PRESS",
    "muscleGroupCode": "GLUT",
    "machineCode": "LEG_PRESS",
    "specCode": "HIGH_FEET_45",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180-240 s",
    "ratio": 1,
    "biomechanics": "Pies en el tercio superior de la plataforma con puntas a 30° afuera. Transfiere la sobrecarga directamente a glúteo mayor y femorales con cero carga axial sobre la columna. Rango de movimiento: Descenso profundo hasta que los muslos rocen los costados del torso, pero ¡el sacro/coxis JAMÁS debe despegarse del respaldo!.",
    "mindMuscle": {
      "title": "Glúteo Mayor & Cadena Posterior en Prensa",
      "internalCue": "Siente cómo los glúteos y la cara interna absorben la carga en la bajada.",
      "externalCue": "Empuja la plataforma a través de los talones abriendo las rodillas en la misma dirección de las puntas.",
      "eccentricCue": "Baja en 3 segundos lentos y profundos con la pelvis completamente anclada."
    },
    "warmup": "🔥 Feeder Sets de aproximación:\n• Feeder 1: 180 lbs × 8 reps\n• Feeder 2: 270 lbs × 6 reps (sin fatiga).",
    "searchQuery": "leg press feet high wide glute focus",
    "aliases": [
      "Prensa 45° (Pies Altos y Abiertos)"
    ]
  },
  {
    "id": "lib_isqu_deadlift_trap_bar_01",
    "name": "Peso Muerto con Barra Hexagonal (Trap Bar)",
    "muscleGroup": "Isquiotibiales",
    "equipment": "Varios",
    "unifiedCode": "[ISQU-DEADLIFT-TRAP_BAR_01]",
    "machineKey": "ISQU-DEADLIFT",
    "muscleGroupCode": "ISQU",
    "machineCode": "DEADLIFT",
    "specCode": "TRAP_BAR_01",
    "defaultSets": 3,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 1.1,
    "biomechanics": "Espalda neutra, agarre neutro en manijas. Bisagra pura de cadera con microflexión de rodillas.",
    "mindMuscle": {
      "title": "Glúteo Mayor e Isquios con Trap Bar",
      "internalCue": "Aprieta los dorsales y empuja la pelvis hacia atrás.",
      "externalCue": "Clava los talones en el suelo al extender la cadera.",
      "eccentricCue": "Baja en 3 segundos rozando la vertical de las espinillas."
    },
    "warmup": "🔥 1 serie técnica ligera.",
    "searchQuery": "Peso Muerto con Barra Hexagonal (Trap Bar) tecnica biomecanica",
    "aliases": [
      "Peso Muerto con Barra Hexagonal (Trap Bar)"
    ]
  },
  {
    "id": "lib_glut_cable_kick_ankle_01",
    "name": "Patada de Glúteo en Polea con Tobillera",
    "muscleGroup": "Glúteos",
    "equipment": "Varios",
    "unifiedCode": "[GLUT-CABLE_KICK-ANKLE_01]",
    "machineKey": "GLUT-CABLE_KICK",
    "muscleGroupCode": "GLUT",
    "machineCode": "CABLE_KICK",
    "specCode": "ANKLE_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 0.5,
    "biomechanics": "Máquina de Hip Thrust o polea baja. Elevación de pelvis o patada con pausa isométrica arriba.",
    "mindMuscle": {
      "title": "Aislamiento de Glúteo",
      "internalCue": "Aplasta el glúteo en la cima de la contracción.",
      "externalCue": "Empuja la carga hacia atrás.",
      "eccentricCue": "Baja en 3 segundos controlados."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Patada de glúteo en polea tecnica biomecanica",
    "aliases": [
      "Patada de glúteo en polea"
    ]
  },
  {
    "id": "lib_abdu_cable_kick_ankle_01",
    "name": "Abducción con Tobillera en Polea",
    "muscleGroup": "Glúteos",
    "equipment": "Varios",
    "unifiedCode": "[ABDU-CABLE_KICK-ANKLE_01]",
    "machineKey": "ABDU-CABLE_KICK",
    "muscleGroupCode": "ABDU",
    "machineCode": "CABLE_KICK",
    "specCode": "ANKLE_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 0.5,
    "biomechanics": "De pie de costado a polea baja con tobillera en pierna externa. Abducción controlada.",
    "mindMuscle": {
      "title": "Abducción en Polea con Tobillera",
      "internalCue": "Aísla el glúteo medio sin girar la pelvis.",
      "externalCue": "Eleva la pierna en diagonal hacia afuera.",
      "eccentricCue": "Baja en 3 segundos conteniendo el cable."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Abducción con tobillera en polea tecnica biomecanica",
    "aliases": [
      "Abducción con tobillera en polea"
    ]
  },
  {
    "id": "lib_espa_pulldown_supine_01",
    "name": "Jalón con Agarre Supino (al Ancho de Hombros)",
    "muscleGroup": "Espalda",
    "equipment": "Varios",
    "unifiedCode": "[ESPA-PULLDOWN-SUPINE_01]",
    "machineKey": "ESPA-PULLDOWN",
    "muscleGroupCode": "ESPA",
    "machineCode": "PULLDOWN",
    "specCode": "SUPINE_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 1,
    "biomechanics": "Polea alta con agarre supino o maneral individual. Tracción unilateral pegando el codo a la cadera con ligera flexión lateral de torso.",
    "mindMuscle": {
      "title": "Jalón Supino Dorsal en Polea",
      "internalCue": "Aísla el dorsal llevando el codo al costado del cuerpo.",
      "externalCue": "Tracciona la barra hacia el esternón bajo.",
      "eccentricCue": "Permite que el cable estire el dorsal hacia arriba en 3 segundos."
    },
    "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps.",
    "searchQuery": "Jalón con agarre supino (al ancho de hombros) tecnica biomecanica",
    "aliases": [
      "Jalón con agarre supino (al ancho de hombros)"
    ]
  },
  {
    "id": "lib_espa_chinup_close_neutral_01",
    "name": "Dominadas Neutras Cerradas",
    "muscleGroup": "Espalda",
    "equipment": "Varios",
    "unifiedCode": "[ESPA-CHINUP-CLOSE_NEUTRAL_01]",
    "machineKey": "ESPA-CHINUP",
    "muscleGroupCode": "ESPA",
    "machineCode": "CHINUP",
    "specCode": "CLOSE_NEUTRAL_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 0.9,
    "biomechanics": "Dominadas con agarre neutro cerrado en barra con paralelas. Elevación con pecho al frente.",
    "mindMuscle": {
      "title": "Dominadas Neutras Compuestas",
      "internalCue": "Clava los codos hacia el suelo pegados a las costillas.",
      "externalCue": "Eleva el torso hasta que el mentón supere las manos.",
      "eccentricCue": "Baja en 3 segundos lentos hasta extensión completa."
    },
    "warmup": "🔥 Sí ocupa:\n• Serie 1: 50% de la carga x 10 reps.\n• Serie 2: 75% de la carga x 4 reps.",
    "searchQuery": "Dominadas neutras cerradas tecnica biomecanica",
    "aliases": [
      "Dominadas neutras cerradas"
    ]
  },
  {
    "id": "lib_espa_one_arm_row_manc_01",
    "name": "Remo con Mancuerna a una Mano apoyado en Banco",
    "muscleGroup": "Espalda",
    "equipment": "Varios",
    "unifiedCode": "[ESPA-ONE_ARM_ROW-MANC_01]",
    "machineKey": "ESPA-ONE_ARM_ROW",
    "muscleGroupCode": "ESPA",
    "machineCode": "ONE_ARM_ROW",
    "specCode": "MANC_01",
    "defaultSets": 4,
    "defaultReps": "8-10",
    "defaultRest": "180 s",
    "ratio": 0.5,
    "biomechanics": "Mano y rodilla apoyadas en banco plano. Torso paralelo al suelo. Tracción de la mancuerna hacia la cadera en arco.",
    "mindMuscle": {
      "title": "Remo Unilateral con Mancuerna",
      "internalCue": "Tira con el codo hacia el techo y la cadera sin rotar el torso.",
      "externalCue": "Lleva la mancuerna al bolsillo del pantalón.",
      "eccentricCue": "Desciende en 3 segundos sintiendo el estiramiento dorsal completo."
    },
    "warmup": "🔥 Sí (1 serie): 70% de la carga x 4 reps.",
    "searchQuery": "Remo con mancuerna a una mano apoyado en banco tecnica biomecanica",
    "aliases": [
      "Remo con mancuerna a una mano apoyado en banco"
    ]
  },
  {
    "id": "lib_homb_rear_delt_manc_inc_01",
    "name": "Pájaros con Mancuernas en Banco Inclinado",
    "muscleGroup": "Hombros",
    "equipment": "Mancuernas",
    "unifiedCode": "[HOMB-REAR_DELT-MANC_INC_01]",
    "machineKey": "HOMB-REAR_DELT",
    "muscleGroupCode": "HOMB",
    "machineCode": "REAR_DELT",
    "specCode": "MANC_INC_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 0.5,
    "biomechanics": "Torso inclinado a 45° apoyado en banco con mancuernas ligeras abriendo en arco lateral.",
    "mindMuscle": {
      "title": "Pájaros con Mancuernas",
      "internalCue": "Abre los brazos con codos ligeramente flexionados.",
      "externalCue": "Lanza las mancuernas hacia las paredes.",
      "eccentricCue": "Frena el descenso en 3 segundos."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "rear delt dumbbell flyes incline bench form",
    "aliases": [
      "Pájaros con Mancuernas en Banco Inclinado"
    ]
  },
  {
    "id": "lib_homb_upright_row_cable_01",
    "name": "Remo al Mentón Amplio en Polea",
    "muscleGroup": "Hombros",
    "equipment": "Varios",
    "unifiedCode": "[HOMB-UPRIGHT_ROW-CABLE_01]",
    "machineKey": "HOMB-UPRIGHT_ROW",
    "muscleGroupCode": "HOMB",
    "machineCode": "UPRIGHT_ROW",
    "specCode": "CABLE_01",
    "defaultSets": 3,
    "defaultReps": "12-15",
    "defaultRest": "120 s",
    "ratio": 0.9,
    "biomechanics": "Poleas cruzadas bajas elevando los brazos en 'Y' a 45° de abducción.",
    "mindMuscle": {
      "title": "Y-Raises en Polea Baja",
      "internalCue": "Contrae el trapecio inferior y deltoides posterior.",
      "externalCue": "Eleva las manos formando una 'Y' hacia el techo.",
      "eccentricCue": "Baja en 3 segundos controlados."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Remo al mentón amplio en polea tecnica biomecanica",
    "aliases": [
      "Remo al mentón amplio en polea"
    ]
  },
  {
    "id": "lib_bicep_hammer_curl_manc_01",
    "name": "Curl Martillo con Mancuernas (Braquial)",
    "muscleGroup": "Bíceps",
    "equipment": "Varios",
    "unifiedCode": "[BICEP-HAMMER_CURL-MANC_01]",
    "machineKey": "BICEP-HAMMER_CURL",
    "muscleGroupCode": "BICEP",
    "machineCode": "HAMMER_CURL",
    "specCode": "MANC_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 1,
    "biomechanics": "Banco inclinado a 60°, brazos colgando detrás del torso con agarre neutro estricto.",
    "mindMuscle": {
      "title": "Curl Martillo con Mancuernas",
      "internalCue": "Siente la activación profunda en la cara lateral del brazo y el antebrazo.",
      "externalCue": "Eleva las mancuernas manteniendo los pulgares apuntando al techo.",
      "eccentricCue": "Desciende en 3 segundos lentos."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Curl martillo con mancuernas (enfoque en braquial y braquiorradial) tecnica biomecanica",
    "aliases": [
      "Curl martillo con mancuernas (enfoque en braquial y braquiorradial)"
    ]
  },
  {
    "id": "lib_bicep_preacher_curl_ez_bar_01",
    "name": "Curl en Banco Scott con Barra Z",
    "muscleGroup": "Bíceps",
    "equipment": "Varios",
    "unifiedCode": "[BICEP-PREACHER_CURL-EZ_BAR_01]",
    "machineKey": "BICEP-PREACHER_CURL",
    "muscleGroupCode": "BICEP",
    "machineCode": "PREACHER_CURL",
    "specCode": "EZ_BAR_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 0.9,
    "biomechanics": "Pecho apoyado en banco inclinado a 45°, brazos colgando verticalmente con barra Z. Gran sobrecarga en contracción pico.",
    "mindMuscle": {
      "title": "Spider Curl con Barra Z",
      "internalCue": "Aísla el bíceps en la fase de acortamiento superior.",
      "externalCue": "Lleva la barra hacia la frente con codos inmóviles.",
      "eccentricCue": "Baja en 3 segundos hasta extensión vertical."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Curl en banco Scott con barra Z tecnica biomecanica",
    "aliases": [
      "Curl en banco Scott con barra Z"
    ]
  },
  {
    "id": "lib_bicep_concentration_curl_manc_01",
    "name": "Curl Concentrado con Mancuerna",
    "muscleGroup": "Bíceps",
    "equipment": "Varios",
    "unifiedCode": "[BICEP-CONCENTRATION_CURL-MANC_01]",
    "machineKey": "BICEP-CONCENTRATION_CURL",
    "muscleGroupCode": "BICEP",
    "machineCode": "CONCENTRATION_CURL",
    "specCode": "MANC_01",
    "defaultSets": 3,
    "defaultReps": "10-12",
    "defaultRest": "120 s",
    "ratio": 0.45,
    "biomechanics": "Sentado con codo apoyado en la cara interna del muslo. Curl estricto a una mano con mancuerna.",
    "mindMuscle": {
      "title": "Curl Concentrado con Mancuerna",
      "internalCue": "Aprieta la bola del bíceps en la cima.",
      "externalCue": "Eleva la mancuerna hacia la nariz.",
      "eccentricCue": "Desciende en 3 segundos lentos."
    },
    "warmup": "🔥 No ocupa.",
    "searchQuery": "Curl concentrado con mancuerna tecnica biomecanica",
    "aliases": [
      "Curl concentrado con mancuerna"
    ]
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
  "Aductores",
  "Cardio"
];
