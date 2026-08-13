import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Layers, RefreshCw, Plus, Trash2, ArrowRight, BookOpen, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { scientificProtocol } from '../../data/scientificProtocol';
import { UNIFIED_EXERCISE_LIBRARY } from '../../data/unifiedExerciseLibrary';
import { useModal } from '../common/UIComponents';

/**
 * Parser inteligente de texto libre o JSON para rutinas de entrenamiento.
 */
export function parseRoutineInput(inputText) {
  if (!inputText || !inputText.trim()) {
    throw new Error("El texto ingresado está vacío.");
  }

  const trimmed = inputText.trim();

  // 1. Intento de parseo como JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return normalizeParsedDays(parsed);
      }
      if (parsed.days && Array.isArray(parsed.days)) {
        return normalizeParsedDays(parsed.days);
      }
    } catch (e) {
      // Continuar al parser de texto si falla JSON
    }
  }

  // 2. Parser de Texto Libre Inteligente
  const lines = trimmed.split('\n');
  const days = [];
  let currentDay = null;

  const dayRegex = /(?:d[ií]a\s*(\d+)|lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|day\s*(\d+)|push|pull|legs|torso|pierna)/i;
  const dayNameMapping = {
    lunes: 'd1', martes: 'd2', miercoles: 'd3', miércoles: 'd3',
    jueves: 'd4', viernes: 'd5', sabado: 'd6', sábado: 'd6', domingo: 'd7'
  };

  lines.forEach((line) => {
    const rawLine = line.trim();
    if (!rawLine || rawLine.startsWith('===') || rawLine.startsWith('---')) return;

    // Detectar encabezado de día
    const lowerLine = rawLine.toLowerCase();
    const isDayHeader = (
      rawLine.startsWith('#') ||
      rawLine.startsWith('📌') ||
      rawLine.startsWith('Día') ||
      rawLine.startsWith('Dia') ||
      rawLine.startsWith('DAY') ||
      lowerLine.startsWith('lunes') ||
      lowerLine.startsWith('martes') ||
      lowerLine.startsWith('miércoles') ||
      lowerLine.startsWith('miercoles') ||
      lowerLine.startsWith('jueves') ||
      lowerLine.startsWith('viernes') ||
      lowerLine.startsWith('sábado') ||
      lowerLine.startsWith('sabado') ||
      lowerLine.startsWith('domingo')
    );

    if (isDayHeader && (rawLine.includes(':') || rawLine.length < 60)) {
      const dayIndex = days.length + 1;
      let matchedDayId = `d${dayIndex}`;
      for (const [key, id] of Object.entries(dayNameMapping)) {
        if (lowerLine.includes(key)) {
          matchedDayId = id;
          break;
        }
      }

      let cleanDayName = rawLine.replace(/^[#📌\-\*\s\d\.\:\)]+/, '').trim();
      if (!cleanDayName) cleanDayName = `Día ${dayIndex}`;

      const isRest = lowerLine.includes('descanso') || lowerLine.includes('rest');

      currentDay = {
        id: matchedDayId,
        dayNumber: dayIndex,
        name: cleanDayName,
        type: isRest ? 'rest' : 'workout',
        focus: '',
        exercises: []
      };
      days.push(currentDay);
      return;
    }

    // Si aún no hay día creado, crear el primero
    if (!currentDay) {
      currentDay = {
        id: 'd1',
        dayNumber: 1,
        name: 'Día 1: Rutina Principal',
        type: 'workout',
        focus: '',
        exercises: []
      };
      days.push(currentDay);
    }

    // Detectar Enfoque
    if (lowerLine.startsWith('enfoque:') || lowerLine.startsWith('🎯 enfoque:')) {
      currentDay.focus = rawLine.replace(/^[^:]+:/, '').trim();
      return;
    }

    // Detectar Ejercicio
    // Ejemplos: "1. Press Inclinado: 4 series x 8-10 reps | 120s"
    //           "- Sentadilla Hack (4x8-10)"
    //           "Press de Pecho 4x10-12"
    if (rawLine.length > 2 && !rawLine.toLowerCase().includes('descanso programado')) {
      const exercise = parseExerciseLine(rawLine, currentDay.exercises.length + 1, currentDay.id);
      if (exercise) {
        currentDay.exercises.push(exercise);
      }
    }
  });

  if (days.length === 0) {
    throw new Error("No se pudieron identificar días ni ejercicios en el texto ingresado.");
  }

  return normalizeParsedDays(days);
}

function parseExerciseLine(line, index, dayId) {
  // Limpiar viñetas o numeración inicial
  let cleanLine = line.replace(/^[\d\.\-\*\•\s\)\>]+/, '').trim();
  if (!cleanLine) return null;

  let sets = 3;
  let reps = '10-12';
  let restTime = '90 s';
  let muscleGroup = 'General';
  let biomechanics = 'Control técnico estricto e IAP.';

  // Extraer descanso si viene con | o Descanso:
  const restMatch = cleanLine.match(/\|\s*(?:descanso:?)?\s*([\d\-]+(?:\s*s|\s*seg|\s*min)?)/i) || cleanLine.match(/descanso:\s*([\d\-]+(?:\s*s|\s*seg)?)/i);
  if (restMatch) {
    restTime = restMatch[1].trim();
    if (!restTime.endsWith('s') && !restTime.endsWith('min')) restTime += ' s';
    cleanLine = cleanLine.replace(restMatch[0], '').trim();
  }

  // Extraer series y reps: formato "4 series x 8-10 reps" o "4x8-10" o "4 x 10"
  const setsRepsMatch = cleanLine.match(/(\d+)\s*(?:series|sets)?\s*[xX*]\s*([\d\-]+)\s*(?:reps|repeticiones|min|s)?/i);
  if (setsRepsMatch) {
    sets = parseInt(setsRepsMatch[1]) || 3;
    reps = setsRepsMatch[2].trim();
    cleanLine = cleanLine.replace(setsRepsMatch[0], '').trim();
  }

  // Limpiar dos puntos o separadores restantes en el nombre
  let name = cleanLine.replace(/[:\-–—|]+$/, '').replace(/^[:\-–—|]+/, '').trim();
  if (!name) name = `Ejercicio ${index}`;

  // Inferir grupo muscular a partir del nombre
  const lowerName = name.toLowerCase();
  if (lowerName.includes('press') || lowerName.includes('pecho') || lowerName.includes('pec') || lowerName.includes('apertura') || lowerName.includes('cristo')) {
    muscleGroup = 'Pecho';
  } else if (lowerName.includes('jalon') || lowerName.includes('jalón') || lowerName.includes('remo') || lowerName.includes('dorsal') || lowerName.includes('dominada') || lowerName.includes('pullover')) {
    muscleGroup = 'Espalda';
  } else if (lowerName.includes('lateral') || lowerName.includes('hombro') || lowerName.includes('deltoides') || lowerName.includes('militar') || lowerName.includes('pájaro') || lowerName.includes('face pull')) {
    muscleGroup = 'Hombro';
  } else if (lowerName.includes('sentadilla') || lowerName.includes('prensa') || lowerName.includes('leg press') || lowerName.includes('hack') || lowerName.includes('cuadriceps') || lowerName.includes('extensión de pierna')) {
    muscleGroup = 'Cuádriceps';
  } else if (lowerName.includes('femoral') || lowerName.includes('isquio') || lowerName.includes('leg curl') || lowerName.includes('peso muerto')) {
    muscleGroup = 'Isquios';
  } else if (lowerName.includes('gluteo') || lowerName.includes('glúteo') || lowerName.includes('hip thrust') || lowerName.includes('abductor') || lowerName.includes('patada')) {
    muscleGroup = 'Glúteos';
  } else if (lowerName.includes('biceps') || lowerName.includes('bíceps') || lowerName.includes('curl')) {
    muscleGroup = 'Bíceps';
  } else if (lowerName.includes('triceps') || lowerName.includes('tríceps') || lowerName.includes('copa') || lowerName.includes('frances') || lowerName.includes('francés') || lowerName.includes('fondos')) {
    muscleGroup = 'Tríceps';
  } else if (lowerName.includes('pantorrilla') || lowerName.includes('gemelo') || lowerName.includes('calf') || lowerName.includes('sóleo')) {
    muscleGroup = 'Pantorrillas';
  } else if (lowerName.includes('vacuum') || lowerName.includes('plancha') || lowerName.includes('plank') || lowerName.includes('abdomen') || lowerName.includes('core') || lowerName.includes('pallof')) {
    muscleGroup = 'Core';
  } else if (lowerName.includes('cardio') || lowerName.includes('caminadora') || lowerName.includes('elíptica') || lowerName.includes('bici')) {
    muscleGroup = 'Cardio';
  }

  // Buscar si existe un equivalente en el catálogo unificado
  const libraryMatch = UNIFIED_EXERCISE_LIBRARY.find(item => item.name.toLowerCase().includes(lowerName) || lowerName.includes(item.name.toLowerCase()));
  let equivalents = [];
  if (libraryMatch) {
    biomechanics = libraryMatch.biomechanics || biomechanics;
  }

  return {
    id: `${dayId}_ex_${index}_${Date.now().toString(36).substring(4)}`,
    name,
    muscleGroup,
    sets,
    reps,
    restTime,
    defaultUnit: lowerName.includes('vacuum') || lowerName.includes('plank') ? 's' : (lowerName.includes('cardio') ? 'min' : 'lbs'),
    isTime: lowerName.includes('vacuum') || lowerName.includes('plank') || lowerName.includes('cardio'),
    isCardio: lowerName.includes('cardio'),
    biomechanics,
    equivalents
  };
}

function normalizeParsedDays(days) {
  return days.map((day, index) => ({
    id: day.id || `d${index + 1}`,
    dayNumber: day.dayNumber || index + 1,
    name: day.name || `Día ${index + 1}`,
    type: day.type || (day.exercises && day.exercises.length > 0 ? 'workout' : 'rest'),
    focus: day.focus || 'Enfoque biomecánico de hipertrofia y simetría muscular.',
    exercises: (day.exercises || []).map((ex, exIdx) => ({
      id: ex.id || `d${index + 1}_e${exIdx + 1}`,
      name: ex.name || `Ejercicio ${exIdx + 1}`,
      muscleGroup: ex.muscleGroup || 'General',
      sets: parseInt(ex.sets) || 3,
      reps: String(ex.reps || '10-12'),
      restTime: String(ex.restTime || '90 s'),
      defaultUnit: ex.defaultUnit || 'lbs',
      isTime: !!ex.isTime,
      isCardio: !!ex.isCardio,
      biomechanics: ex.biomechanics || 'Control de fase excéntrica e IAP.',
      equivalents: ex.equivalents || []
    }))
  }));
}

export default function RoutineManagerModal({
  isOpen,
  onClose,
  activeRoutine,
  onSaveRoutine,
  onResetToBaseProtocol,
  customExercisesMap = {}
}) {
  const modal = useModal();
  const [activeTab, setActiveTab] = useState('view'); // 'view' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentDays = activeRoutine || scientificProtocol;

  const generateFormattedText = () => {
    let text = `=====================================================\n`;
    text += ` PROTOCOLO ADONIS - RUTINA ACTIVA DE ENTRENAMIENTO\n`;
    text += `=====================================================\n\n`;

    currentDays.forEach((day, dIdx) => {
      const customs = customExercisesMap[day.id] || [];
      const allEx = [...(day.exercises || []), ...customs];

      text += `📌 ${day.name.toUpperCase()}\n`;
      if (day.focus) text += `Enfoque: ${day.focus}\n`;
      if (allEx.length === 0) {
        text += `(Día de descanso programado)\n\n`;
      } else {
        allEx.forEach((ex, exIdx) => {
          text += `${exIdx + 1}. ${ex.name}: ${ex.sets} series x ${ex.reps} reps | Descanso: ${ex.restTime}\n`;
        });
        text += `\n`;
      }
    });
    return text;
  };

  const handleCopyText = async () => {
    try {
      const text = generateFormattedText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      modal.showAlert({
        title: "📋 Formato Copiado",
        message: "La rutina completa fue copiada al portapapeles en formato texto estructurado.",
        variant: "success"
      });
    } catch (e) {
      modal.showAlert({ title: "Error", message: "No se pudo copiar al portapapeles.", variant: "danger" });
    }
  };

  const handleParsePasted = () => {
    setParseError(null);
    try {
      const parsed = parseRoutineInput(pastedText);
      setParsedPreview(parsed);
    } catch (err) {
      setParseError(err.message || "Error analizando el formato ingresado.");
      setParsedPreview(null);
    }
  };

  const handleApplyNewRoutine = () => {
    if (!parsedPreview || parsedPreview.length === 0) return;

    modal.showConfirm({
      title: "🔄 ¿Aplicar Nueva Rutina?",
      message: `Se detectaron ${parsedPreview.length} días de entrenamiento con sus ejercicios. Tu historial previo de entrenamientos NO se alterará ni borrará. ¿Confirmar cambio de rutina activa?`,
      confirmText: "✨ Sí, Aplicar Rutina",
      cancelText: "Revisar",
      variant: "info",
      onConfirm: async () => {
        if (onSaveRoutine) {
          await onSaveRoutine(parsedPreview);
        }
        onClose();
        modal.showAlert({
          title: "🎉 Rutina Actualizada",
          message: "La nueva estructura de rutina ha sido guardada en la nube y ya está activa.",
          variant: "success"
        });
      }
    });
  };

  const handleResetToDefault = () => {
    modal.showConfirm({
      title: "↺ ¿Restaurar Protocolo Original?",
      message: "¿Deseas volver a la plantilla base original del Protocolo Adonis Científico? Tus registros pasados se mantendrán intactos.",
      confirmText: "Restaurar Base",
      cancelText: "Cancelar",
      variant: "warning",
      onConfirm: async () => {
        if (onResetToBaseProtocol) {
          await onResetToBaseProtocol();
        }
        onClose();
        modal.showAlert({
          title: "✅ Protocolo Base Restaurado",
          message: "Se ha restaurado la rutina base de 6 días del Protocolo Adonis.",
          variant: "info"
        });
      }
    });
  };

  return (
    <div 
      className="modal-backdrop animate-fade"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px'
      }}
    >
      <div 
        className="modal-content"
        style={{
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}
      >
        {/* Cabecera */}
        <div className="flex-between" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '12px', color: '#0066ff' }}>
              <Layers size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                Gestor Maestro de Rutinas
              </h2>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                Ver, copiar, editar o pegar nuevas rutinas sin corromper tu historial
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#475569' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#f8fafc', padding: '4px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setActiveTab('view')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'view' ? '#0066ff' : 'transparent',
              color: activeTab === 'view' ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={14} /> Rutina Activa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'paste' ? '#0066ff' : 'transparent',
              color: activeTab === 'paste' ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> ⚡️ Actualizar / Pegar Formato
          </button>
        </div>

        {/* CONTENIDO PESTAÑA 1: VER Y COPIAR RUTINA */}
        {activeTab === 'view' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopyText}
                style={{
                  flex: 1,
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1.5px solid #cbd5e1',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} color="#0066ff" />}
                {copied ? '¡Copiado al Portapapeles!' : '📋 Copiar Formato de Texto'}
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                style={{
                  background: '#fff1f2',
                  color: '#e11d48',
                  border: '1.5px solid #fecdd3',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Restaurar Protocolo Científico Original"
              >
                <RefreshCw size={14} /> Restaurar Base
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
              {currentDays.map((day, dIdx) => {
                const customs = customExercisesMap[day.id] || [];
                const allEx = [...(day.exercises || []), ...customs];

                return (
                  <div key={day.id || dIdx} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '14px' }}>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a', fontWeight: '900' }}>
                        {day.name}
                      </strong>
                      <span className="badge badge-blue" style={{ fontSize: '10px', fontWeight: '800' }}>
                        {allEx.length} {allEx.length === 1 ? 'ejercicio' : 'ejercicios'}
                      </span>
                    </div>

                    {allEx.length === 0 ? (
                      <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                        Día de descanso muscular programado.
                      </span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {allEx.map((ex, eIdx) => (
                          <div key={ex.id || eIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px' }}>
                            <span style={{ fontWeight: '700', color: '#1e293b' }}>
                              {eIdx + 1}. {ex.name}
                            </span>
                            <span style={{ color: '#0066ff', fontWeight: '800' }}>
                              {ex.sets}x{ex.reps} ({ex.restTime || '90s'})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA 2: PEGAR Y ACTUALIZAR RUTINA */}
        {activeTab === 'paste' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '14px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={16} color="#0066ff" />
                <strong style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: '900' }}>
                  Pegar Nueva Rutina (Texto Libre o JSON)
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#3b82f6', lineHeight: '1.4' }}>
                Pega el texto de tu coach o plan de entrenamiento. El motor inteligente detectará los días (Lunes, Martes...), nombres de ejercicios, series, repeticiones y descansos automáticamente.
              </p>
            </div>

            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value);
                setParseError(null);
              }}
              placeholder={`Ejemplo de formato aceptado:\n\nLunes: Empuje y Pecho Superior\n1. Press Inclinado con Mancuernas: 4 series x 8-10 reps | Descanso: 120s\n2. Elevaciones Laterales: 4 series x 12-15 reps | 90s\n3. Pec Deck: 3 series x 12 reps\n\nMartes: Piernas y Cuádriceps\n1. Sentadilla Hack: 4 series x 8-10 reps\n2. Prensa 90: 3 series x 10-12 reps`}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                border: '1.5px solid #cbd5e1',
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: '600',
                background: '#f8fafc',
                color: '#0f172a',
                resize: 'vertical'
              }}
            />

            <button
              type="button"
              onClick={handleParsePasted}
              disabled={!pastedText.trim()}
              style={{
                background: '#0066ff',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '900',
                cursor: pastedText.trim() ? 'pointer' : 'not-allowed',
                opacity: pastedText.trim() ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={16} /> 🔍 Analizar y Previsualizar Formato
            </button>

            {parseError && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '12px', padding: '10px', color: '#b91c1c', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} /> {parseError}
              </div>
            )}

            {parsedPreview && (
              <div className="animate-fade" style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '14px', marginTop: '4px' }}>
                <div className="flex-between" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} color="#16a34a" />
                    <strong style={{ fontSize: '13px', color: '#166534', fontWeight: '900' }}>
                      Vista Previa: {parsedPreview.length} Días Detectados
                    </strong>
                  </div>
                  <span style={{ fontSize: '11px', color: '#15803d', fontWeight: '800' }}>
                    {parsedPreview.reduce((acc, d) => acc + (d.exercises ? d.exercises.length : 0), 0)} ejercicios en total
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '30vh', overflowY: 'auto', marginBottom: '12px' }}>
                  {parsedPreview.map((day, idx) => (
                    <div key={idx} style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                      <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                        {day.name} ({day.exercises.length} ex)
                      </strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {day.exercises.map((ex, eIdx) => (
                          <span key={eIdx} style={{ background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                            {ex.name} ({ex.sets}x{ex.reps})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleApplyNewRoutine}
                  style={{
                    width: '100%',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '14px',
                    fontSize: '14px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  <Check size={18} /> Confirmar y Guardar Nueva Rutina Activa
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
