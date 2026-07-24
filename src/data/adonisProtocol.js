export const adonisProtocol = [
  {
    id: 'day1',
    dayNumber: 1,
    name: 'Lunes: Empuje',
    focus: 'Pecho superior (clavicular) y hombros anchos.',
    type: 'workout',
    exercises: [
      { id: 'd1_e1', name: 'Press Inclinado con Mancuernas (DB Incline Press)', sets: 4, reps: '8-10', notes: 'Inicia con mancuernas de 30 o 35 lbs por mano, controla la bajada en 3 segundos.' },
      { id: 'd1_e2', name: 'Nitro Incline Press Machine', sets: 3, reps: '8-10', notes: 'Inicia con tus 80 lbs.' },
      { id: 'd1_e3', name: 'Pec Deck (Cristos en máquina)', sets: 3, reps: '12-15', notes: 'Enfócate en apretar el pecho al centro.' },
      { id: 'd1_e4', name: 'Elevaciones Laterales con Mancuernas', sets: 4, reps: '12-15', notes: 'Inicia con mancuernas de 15 o 20 lbs. Codos ligeramente flexionados.' },
      { id: 'd1_e5', name: 'Extensión de Tríceps en Polea (con Cuerda)', sets: 4, reps: '10-12', notes: '' },
      { id: 'd1_e6', name: 'Vacuum Abdominal', sets: 4, reps: '15s', notes: 'Aguantando 15 segundos sin aire.' },
      { id: 'd1_e7', name: 'Cardio', sets: 1, reps: '30m', notes: 'Caminadora con inclinación o Elíptica.' }
    ]
  },
  {
    id: 'day2',
    dayNumber: 2,
    name: 'Martes: Piernas y Glúteos 1',
    focus: 'Cuádriceps y Glúteo Medio.',
    type: 'workout',
    exercises: [
      { id: 'd2_e1', name: 'Hack Squat (Máquina de sentadilla acostado)', sets: 4, reps: '8-10', notes: 'Inicia solo con la plataforma sin discos o con 1 disco de 25 lbs por lado para probar. Exhala fuerte al subir.' },
      { id: 'd2_e2', name: 'Leg Press', sets: 3, reps: '10-12', notes: 'Baja SOLO hasta 90 grados, no pegues las rodillas a tu pecho.' },
      { id: 'd2_e3', name: 'Leg Extension', sets: 3, reps: '12-15', notes: 'Inicia con 90 - 110 lbs.' },
      { id: 'd2_e4', name: 'Patada de Glúteo en Polea o Máquina (Kickbacks)', sets: 3, reps: '12-15', notes: 'Por pierna.' },
      { id: 'd2_e5', name: 'Plancha Abdominal (Plank)', sets: 3, reps: '45s', notes: 'Mete el ombligo hacia tu espalda todo el tiempo.' }
    ]
  },
  {
    id: 'day3',
    dayNumber: 3,
    name: 'Miércoles: Jalón',
    focus: 'Amplitud de espalda (V-Taper) y Bíceps.',
    type: 'workout',
    exercises: [
      { id: 'd3_e1', name: 'Jalón al Pecho en Polea (Lat Pulldown)', sets: 4, reps: '8-10', notes: 'Saca el pecho, la barra va a la clavícula, no detrás del cuello.' },
      { id: 'd3_e2', name: 'Remo Compuesto (Compound Row)', sets: 3, reps: '10-12', notes: 'Inicia con tus 110 lbs.' },
      { id: 'd3_e3', name: 'Pull-Over en Polea Alta (con cuerda)', sets: 3, reps: '12-15', notes: 'Brazos casi rectos, jala hacia tu cadera. Excelente para dar el aspecto de V.' },
      { id: 'd3_e4', name: 'Face Pulls en Polea', sets: 3, reps: '12-15', notes: 'Jala la cuerda hacia tus ojos, codos altos.' },
      { id: 'd3_e5', name: 'Curl de Bíceps con Mancuernas (Alternado)', sets: 4, reps: '10-12', notes: 'Inicia con 25-30 lbs.' },
      { id: 'd3_e6', name: 'Vacuum Abdominal', sets: 4, reps: '15s', notes: '' },
      { id: 'd3_e7', name: 'Cardio', sets: 1, reps: '30m', notes: 'Bicicleta o Caminadora.' }
    ]
  },
  {
    id: 'day4',
    dayNumber: 4,
    name: 'Jueves: Descanso Activo',
    focus: 'Recuperación',
    type: 'rest',
    exercises: [
      { id: 'd4_e1', name: 'Cardio Zona 2 (Opcional)', sets: 1, reps: '40m', notes: 'Caminadora inclinada o bicicleta viendo tu celular. Estiramientos. Cero pesas.' }
    ]
  },
  {
    id: 'day5',
    dayNumber: 5,
    name: 'Viernes: Piernas y Glúteos 2',
    focus: 'Isquiotibiales (femorales), Glúteos y Pantorrillas.',
    type: 'workout',
    exercises: [
      { id: 'd5_e1', name: 'Sentadilla Búlgara (con mancuernas ligeras)', sets: 3, reps: '8-10', notes: 'Por pierna. Inicia con mancuernas de 15 o 20 lbs. Paso largo para enfocar en el glúteo.' },
      { id: 'd5_e2', name: 'Seated Leg Curl', sets: 4, reps: '10-12', notes: 'Inicia con tus 70 lbs.' },
      { id: 'd5_e3', name: 'Hip Abductor Machine (Abrir)', sets: 4, reps: '12-15', notes: 'Inicia con tus 125 lbs.' },
      { id: 'd5_e4', name: 'Hip Adductor Machine (Cerrar)', sets: 3, reps: '12-15', notes: 'Inicia con tus 80-95 lbs.' },
      { id: 'd5_e5', name: 'Rotary Calf Machine (Pantorrillas)', sets: 4, reps: '15-20', notes: 'Inicia con 170 lbs. Pausa de 1 seg arriba y 1 seg abajo.' },
      { id: 'd5_e6', name: 'Pallof Press en Polea', sets: 3, reps: '12', notes: 'Por lado. Abdomen lateral seguro.' }
    ]
  },
  {
    id: 'day6',
    dayNumber: 6,
    name: 'Sábado: Torso Adonis',
    focus: 'Simetría, detalle y bombeo general.',
    type: 'workout',
    exercises: [
      { id: 'd6_e1', name: 'Nitro Vertical Chest', sets: 3, reps: '10-12', notes: 'Inicia con tus 80 lbs.' },
      { id: 'd6_e2', name: 'Jalón al Pecho (Agarre Neutro)', sets: 3, reps: '10-12', notes: 'Palmas mirándose.' },
      { id: 'd6_e3', name: 'Elevaciones Laterales en Polea', sets: 4, reps: '12-15', notes: 'Un brazo a la vez. El cable mantiene tensión constante en el hombro.' },
      { id: 'd6_e4', name: 'Curl de Bíceps en Polea (Barra recta)', sets: 3, reps: '12', notes: '' },
      { id: 'd6_e5', name: 'Extensión de Tríceps Copa', sets: 3, reps: '12', notes: 'Sobre la cabeza con cuerda o mancuerna.' },
      { id: 'd6_e6', name: 'Cardio', sets: 1, reps: '40m', notes: 'El que prefieras de Zona 2.' }
    ]
  },
  {
    id: 'day7',
    dayNumber: 7,
    name: 'Domingo: Descanso Total',
    focus: 'Recuperación absoluta. Meal Prep.',
    type: 'rest',
    exercises: []
  }
];
