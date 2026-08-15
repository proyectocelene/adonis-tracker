import React from 'react';
import { Search, Video, Info, Zap, Sparkles, Brain } from 'lucide-react';

// Generador de claves atencionales (Internal & External Focus) basado en ciencia motora (Wulf & Schoenfeld)
function getMindMuscleCues(exercise) {
  const name = (exercise.name || '').toLowerCase();
  const mg = (exercise.muscleGroup || '').toLowerCase();

  if (name.includes('jalón') || name.includes('lat pulldown') || name.includes('dominada') || name.includes('pull down') || (mg.includes('espalda') && name.includes('vertical'))) {
    return {
      title: "Dorsal Ancho & Espalda Superior",
      internalCue: "Visualiza tus manos como meros ganchos sin apretar en exceso los antebrazos. Inicia la tracción tirando exclusivamente de los codos hacia tus bolsillos traseros.",
      externalCue: "Imagina que intentas doblar la barra sobre tus hombros y expandir el pecho hacia el techo al descender.",
      eccentricCue: "Deja que el peso estire los dorsales hacia arriba en 2 a 3 segundos sintiendo la tracción desde la axila hasta la cadera."
    };
  }

  if (name.includes('remo') || name.includes('row') || mg.includes('espalda')) {
    return {
      title: "Espalda Media, Romboides & Densidad",
      internalCue: "Guía el movimiento con los codos pegados a 45° del torso. Siente cómo se juntan las escápulas atrás sin rotar los hombros hacia adelante.",
      externalCue: "Piensa en clavar los codos contra una pared detrás de ti.",
      eccentricCue: "Frena la vuelta permitiendo que las escápulas se abran suavemente hacia adelante antes de la siguiente repetición."
    };
  }

  if (name.includes('press') && (mg.includes('pecho') || name.includes('banca') || name.includes('inclinado') || name.includes('pecho') || name.includes('mancuernas'))) {
    return {
      title: "Pectoral Mayor (Fibras Esternales & Claviculares)",
      internalCue: "En el punto más alto, no pienses en empujar hacia arriba: piensa en intentar juntar ambos bíceps contra el esternón.",
      externalCue: "Imagina comprimir la barra o las mancuernas hacia adentro mientras mantienes las escápulas retraídas y clavadas al banco.",
      eccentricCue: "Desciende en 3 segundos sintiendo cómo las fibras del pecho se abren y estiran profundamente con la caja torácica elevada."
    };
  }

  if (name.includes('pec deck') || name.includes('apertura') || name.includes('cruce') || name.includes('fly')) {
    return {
      title: "Aislamiento Pectoral & Tensión Continua",
      internalCue: "Mantén un ligero ángulo fijo en los codos e imagina que abrazas un cilindro gigante de árbol.",
      externalCue: "Junta la cara interna de los codos al cerrar, no solo las muñecas.",
      eccentricCue: "Siente el estiramiento máximo de las fibras pectorales antes de iniciar la contracción."
    };
  }

  if (name.includes('prensa') || name.includes('hack') || name.includes('sentadilla') || name.includes('squat') || name.includes('extensión') || mg.includes('cuádriceps') || mg.includes('pierna')) {
    return {
      title: "Cuádriceps & Cadena Anterior",
      internalCue: "Presiona la plataforma empujando a través del tercio medio del pie. Siente la tensión constante en el vasto externo y recto femoral.",
      externalCue: "Imagina que empujas el piso o la plataforma lejos de ti, extendiendo las rodillas con fuerza controlada.",
      eccentricCue: "Baja profundo manteniendo la pelvis neutra y los cuádriceps cargados de tensión sin rebotar al fondo."
    };
  }

  if (name.includes('femoral') || (name.includes('curl') && mg.includes('isquios')) || name.includes('peso muerto') || name.includes('rumano') || mg.includes('isquio')) {
    return {
      title: "Isquiotibiales & Cadena Posterior",
      internalCue: "Mantén los tobillos en ángulo neutro (dorsiflexión) y piensa en llevar los talones directamente hacia los glúteos.",
      externalCue: "En peso muerto o bisagras: Empuja las caderas hacia la pared de atrás como si intentaras cerrar una puerta con los glúteos.",
      eccentricCue: "Frena la bajada resistiendo con la parte posterior del muslo sin arquear la zona lumbar."
    };
  }

  if (name.includes('lateral') || name.includes('hombro') || name.includes('deltoides') || name.includes('elevación') || mg.includes('hombro')) {
    return {
      title: "Deltoides Lateral (V-Taper & Amplitud)",
      internalCue: "Lidera la elevación empujando con los codos y el dorso de la mano. Mantén los trapecios deprimidos sin encoger el cuello.",
      externalCue: "Imagina que empujas las mancuernas o poleas hacia las esquinas lejanas de la habitación (hacia afuera, no hacia arriba).",
      eccentricCue: "Desciende en 2 a 3 segundos resistiendo la gravedad antes de que el peso toque tus muslos."
    };
  }

  if (name.includes('bíceps') || name.includes('biceps') || name.includes('curl')) {
    return {
      title: "Bíceps Braquial & Braquiorradial",
      internalCue: "Fija los codos como bisagras inamovibles pegadas al costado. Supina activamente la muñeca (gira el meñique hacia arriba) al subir.",
      externalCue: "Imagina aplastar una moneda entre tu antebrazo y tu bíceps en el pico de contracción.",
      eccentricCue: "Extiende el brazo de forma lenta y controlada hasta estirar por completo la cabeza larga."
    };
  }

  if (name.includes('tríceps') || name.includes('triceps') || name.includes('copa') || name.includes('fondos') || name.includes('frances')) {
    return {
      title: "Tríceps (Cabeza Lateral, Medial y Larga)",
      internalCue: "Extiende el codo por completo apretando la contracción durante 1 segundo completo sin mover la posición del hombro.",
      externalCue: "Imagina partir la barra o separar los extremos de la cuerda hacia los lados al final del recorrido.",
      eccentricCue: "Permite que el antebrazo suba hasta que el tríceps quede bajo máximo estiramiento bajo carga."
    };
  }

  // Fallback general inteligente
  return {
    title: `Conexión Neuromuscular: ${exercise.muscleGroup || 'Grupo Muscular'}`,
    internalCue: "Enfócate en la contracción voluntaria del músculo objetivo durante cada repetición sin recurrir a balanceos o inercia.",
    externalCue: "Mantén una trayectoria suave y constante empujando o tirando contra la resistencia con aceleración uniforme.",
    eccentricCue: "Tarda de 2 a 3 segundos en la fase excéntrica (bajada) para maximizar el estímulo mecánico de hipertrofia."
  };
}

export default function ExerciseBiomechanics({
  exercise,
  totalSets,
  targetReps,
  restPrescribed,
  googleImagesUrl,
  youtubeTutorialUrl,
  machineSetupInput,
  setMachineSetupInput,
  handleSaveMachineSetup
}) {
  const mindMuscle = getMindMuscleCues(exercise);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      
      {/* 1. TARJETA DE PRESCRIPCIÓN & OBJETIVO CIENTÍFICO ÓPTIMO */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1.5px solid #bfdbfe',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: '0 2px 8px rgba(0, 102, 255, 0.06)'
      }}>
        <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#1e40af', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.5px', display: 'block' }}>
              🎯 Prescripción Científica Oficial
            </span>
            <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '900' }}>
              Realizar {totalSets} Series Efectivas de Trabajo
            </strong>
          </div>
          <span style={{ fontSize: '11px', background: '#0066ff', color: '#ffffff', padding: '3px 10px', borderRadius: '10px', fontWeight: '900' }}>
            Meta: {targetReps} reps
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: '#ffffff', padding: '8px 10px', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', color: '#334155' }}>
            ⏱️ Descanso: <strong style={{ color: '#0066ff' }}>{restPrescribed}</strong>
          </div>
          <div style={{ fontSize: '11px', color: '#334155' }}>
            🔥 Esfuerzo: <strong style={{ color: '#d97706' }}>RPE 8-9 (RIR 1-2)</strong>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#1e3a8a', lineHeight: '1.4', fontWeight: '600' }}>
          💡 <strong>Estrategia Óptima:</strong> Completa tus {totalSets} series efectivas manteniendo técnica estricta en {targetReps} reps. Si en tu última serie logras el tope superior con RPE &le; 8, aumenta carga (+5 lbs) la próxima sesión.
        </div>
      </div>

      {/* 2. NUEVA SECCIÓN: CONEXIÓN MENTE-MÚSCULO & ACTIVACIÓN NEUROMUSCULAR (WULF & SCHOENFELD) */}
      <div style={{
        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
        border: '1.5px solid #d8b4fe',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Brain size={16} color="#7e22ce" />
          <span style={{ fontSize: '11px', color: '#7e22ce', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.5px' }}>
            Conexión Mente-Músculo ({mindMuscle.title})
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Enfoque Interno */}
          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
            <div style={{ fontSize: '11px', fontWeight: '900', color: '#6b21a8', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🧠</span> Enfoque Interno (Siente el Músculo):
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#334155', lineHeight: '1.4', fontWeight: '600' }}>
              {mindMuscle.internalCue}
            </p>
          </div>

          {/* Enfoque Externo */}
          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
            <div style={{ fontSize: '11px', fontWeight: '900', color: '#6b21a8', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🎯</span> Enfoque Externo (Vector de Fuerza):
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#334155', lineHeight: '1.4', fontWeight: '600' }}>
              {mindMuscle.externalCue}
            </p>
          </div>

          {/* Control Excéntrico */}
          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
            <div style={{ fontSize: '11px', fontWeight: '900', color: '#6b21a8', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>⏳</span> Tensión Excéntrica (2-3s):
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#334155', lineHeight: '1.4', fontWeight: '600' }}>
              {mindMuscle.eccentricCue}
            </p>
          </div>
        </div>
      </div>

      {/* 3. ENLACES EXTERNOS A IMÁGENES Y YOUTUBE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
        <a
          href={googleImagesUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#f8fafc',
            color: '#1e293b',
            border: '1.5px solid #cbd5e1',
            padding: '8px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          <Search size={14} color="#0066ff" /> Buscar en Google Imágenes
        </a>
        <a
          href={youtubeTutorialUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#fef2f2',
            color: '#991b1b',
            border: '1.5px solid #fecaca',
            padding: '8px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          <Video size={14} color="#dc2626" /> Tutorial en YouTube
        </a>
      </div>

      {exercise.warmup && (
        <div style={{ background: '#fffbeb', border: '1.5px solid #f59e0b', padding: '10px 12px', borderRadius: '14px', fontSize: '12px', color: '#78350f', fontWeight: '600', width: '100%' }}>
          <strong style={{ color: '#b45309', display: 'block', marginBottom: '2px', fontWeight: '900' }}>
            Guía de Calentamiento:
          </strong>
          {exercise.warmup}
        </div>
      )}

      {/* 4. BIOMECÁNICA E IAP */}
      <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '14px', border: '1.5px solid #e2e8f0', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Info size={14} color="#7c3aed" />
          <strong style={{ fontSize: '12px', color: '#4c1d95', fontWeight: '900' }}>Biomecánica & IAP:</strong>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.5', fontWeight: '600' }}>
          {exercise.biomechanics || 'Control de la fase excéntrica con respiración rítmica anti-hernia.'}
        </p>
      </div>

      {/* 5. CALIBRACIÓN DE MÁQUINA */}
      <div style={{ background: '#ffffff', padding: '10px', borderRadius: '14px', border: '1.5px solid #cbd5e1', width: '100%' }}>
        <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#0f172a', fontWeight: '900' }}>
          ⚙️ Calibración de Máquina:
        </label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            placeholder="Ej. Asiento en hoyo 4, polea baja..."
            value={machineSetupInput}
            onChange={(e) => setMachineSetupInput(e.target.value)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '12px', fontWeight: '700' }}
          />
          <button
            type="button"
            onClick={handleSaveMachineSetup}
            style={{ background: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
