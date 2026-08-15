import React, { useState } from 'react';
import { X, Layers, BookOpen, Sparkles } from 'lucide-react';
import { scientificProtocol } from '../../data/scientificProtocol';
import { useModal } from '../common/UIComponents';
import { parseRoutineInput } from '../../utils/routineParser';
import RoutineActiveView from './RoutineActiveView';
import RoutineTextParserView from './RoutineTextParserView';

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

    currentDays.forEach((day) => {
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
          <RoutineActiveView
            currentDays={currentDays}
            customExercisesMap={customExercisesMap}
            copied={copied}
            handleCopyText={handleCopyText}
            handleResetToDefault={handleResetToDefault}
          />
        )}

        {/* CONTENIDO PESTAÑA 2: PEGAR Y ACTUALIZAR RUTINA */}
        {activeTab === 'paste' && (
          <RoutineTextParserView
            pastedText={pastedText}
            setPastedText={setPastedText}
            parseError={parseError}
            setParseError={setParseError}
            parsedPreview={parsedPreview}
            handleParsePasted={handleParsePasted}
            handleApplyNewRoutine={handleApplyNewRoutine}
          />
        )}
      </div>
    </div>
  );
}
