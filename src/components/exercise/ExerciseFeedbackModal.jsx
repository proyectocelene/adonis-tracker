import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ThumbsUp, Activity, ShieldCheck, HeartCrack, Trash2 } from 'lucide-react';

export default function ExerciseFeedbackModal({
  isOpen,
  onClose,
  exerciseName = '',
  currentFeedback = {},
  onSaveFeedback
}) {
  const [rpe, setRpe] = useState(currentFeedback?.rpe || '');
  const [pump, setPump] = useState(currentFeedback?.pump || '');
  const [jointPain, setJointPain] = useState(currentFeedback?.jointPain || 'none');
  const [technique, setTechnique] = useState(currentFeedback?.technique || 'great');
  const [actionNext, setActionNext] = useState(currentFeedback?.actionNext || '');

  useEffect(() => {
    if (isOpen) {
      setRpe(currentFeedback?.rpe || '');
      setPump(currentFeedback?.pump || '');
      setJointPain(currentFeedback?.jointPain || 'none');
      setTechnique(currentFeedback?.technique || 'great');
      setActionNext(currentFeedback?.actionNext || '');
    }
  }, [isOpen, currentFeedback]);

  if (!isOpen) return null;

  const handleSave = () => {
    const feedbackData = {
      rpe,
      pump,
      jointPain,
      technique,
      actionNext,
      recordedAt: new Date().toISOString()
    };
    onSaveFeedback(feedbackData);
    onClose();
  };

  const handleClear = () => {
    onSaveFeedback(null);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '20px', maxWidth: '440px', width: '100%', margin: 'auto 0',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          padding: '20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f3e8ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
                Sensaciones & Biofeedback
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
                {exerciseName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. ESFUERZO / RPE REAL PERCIBIDO */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            🔥 Esfuerzo Real Percibido (RPE):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {[
              { val: '7', label: 'RPE ≤7', sub: 'Fácil (+3 RIR)' },
              { val: '8', label: 'RPE 8', sub: 'Óptimo (2 RIR)' },
              { val: '9', label: 'RPE 9', sub: 'Duro (1 RIR)' },
              { val: '10', label: 'RPE 10', sub: 'Fallo Total' }
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => setRpe(item.val)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '10px',
                  border: rpe === item.val ? '2px solid #0066ff' : '1px solid #cbd5e1',
                  background: rpe === item.val ? '#eff6ff' : '#f8fafc',
                  color: rpe === item.val ? '#0066ff' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <strong style={{ fontSize: '11px', fontWeight: '900' }}>{item.label}</strong>
                <span style={{ fontSize: '8.5px', color: '#64748b', marginTop: '1px' }}>{item.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. BOMBEO / CONGESTIÓN MUSCULAR (PUMP) */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            💪 Congestión / Bombeo (Pump):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {[
              { val: 'low', label: 'Bajo', icon: '⭐' },
              { val: 'mid', label: 'Medio', icon: '⭐⭐' },
              { val: 'high', label: 'Alto', icon: '⭐⭐⭐' },
              { val: 'max', label: 'Máximo', icon: '🔥' }
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => setPump(item.val)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '10px',
                  border: pump === item.val ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                  background: pump === item.val ? '#faf5ff' : '#f8fafc',
                  color: pump === item.val ? '#7c3aed' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '12px' }}>{item.icon}</div>
                <strong style={{ fontSize: '10.5px' }}>{item.label}</strong>
              </button>
            ))}
          </div>
        </div>

        {/* 3. CONFORT / DOLOR ARTICULAR */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            🛡️ Confort Articular:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {[
              { val: 'none', label: '🟢 Cero dolor', sub: 'Articulación limpia' },
              { val: 'mild', label: '🟡 Leve aviso', sub: 'Vigilar agarre/ángulo' },
              { val: 'pain', label: '🔴 Molestia/Dolor', sub: 'Cambiar ejercicio' }
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => setJointPain(item.val)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '10px',
                  border: jointPain === item.val ? '2px solid #10b981' : '1px solid #cbd5e1',
                  background: jointPain === item.val ? '#ecfdf5' : '#f8fafc',
                  color: jointPain === item.val ? '#065f46' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <strong style={{ fontSize: '10.5px', fontWeight: '900' }}>{item.label}</strong>
                <span style={{ fontSize: '8px', color: '#64748b', marginTop: '1px' }}>{item.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. CALIDAD TÉCNICA */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            📐 Calidad Técnica:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {[
              { val: 'great', label: '✨ Impecable', sub: 'Control total' },
              { val: 'good', label: '👌 Buena', sub: '1 rep desfasada' },
              { val: 'sloppy', label: '⚠️ Compensé', sub: 'Reducir peso' }
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => setTechnique(item.val)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '10px',
                  border: technique === item.val ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                  background: technique === item.val ? '#fffbeb' : '#f8fafc',
                  color: technique === item.val ? '#b45309' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <strong style={{ fontSize: '10.5px', fontWeight: '900' }}>{item.label}</strong>
                <span style={{ fontSize: '8px', color: '#64748b', marginTop: '1px' }}>{item.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. ACCIÓN SUGERIDA PARA PRÓXIMA SESIÓN */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            🎯 Acción para Próxima Sesión:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {[
              { val: 'up_weight', label: '⚡ Subir peso (+5 lbs)' },
              { val: 'keep_weight', label: '⏸️ Mantener peso y afinar' },
              { val: 'swap_machine', label: '🔄 Sustituir ejercicio' },
              { val: 'adjust_seat', label: '⚙️ Ajustar máquina/asiento' }
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => setActionNext(actionNext === item.val ? '' : item.val)}
                style={{
                  padding: '7px 6px',
                  borderRadius: '10px',
                  border: actionNext === item.val ? '2px solid #0066ff' : '1px solid #cbd5e1',
                  background: actionNext === item.val ? '#eff6ff' : '#f8fafc',
                  color: actionNext === item.val ? '#0066ff' : '#334155',
                  fontSize: '10.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ACCIONES DEL MODAL */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          {currentFeedback && Object.keys(currentFeedback).length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: '#fef2f2',
                color: '#ef4444',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Borrar sensaciones de hoy"
            >
              <Trash2 size={15} /> Limpiar
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '11px',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
            }}
          >
            <Check size={16} strokeWidth={3} /> Guardar Sensaciones
          </button>
        </div>
      </div>
    </div>
  );
}
