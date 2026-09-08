import React from 'react';
import { Zap, X, Brain, Target, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { analyzeExercisePerformance } from '../../hooks/useWorkoutCalculations';

export default function OverloadScienceModal({
  isOpen,
  onClose,
  exerciseName = '',
  loadRecommendation = null,
  targetReps = '10-12',
  previousData = {},
  machineConfig = null
}) {
  if (!isOpen) return null;

  const analysis = analyzeExercisePerformance(previousData, targetReps, machineConfig);
  const type = loadRecommendation?.type || (analysis.canProgressWeight ? 'increase' : 'maintain');

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '16px',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '22px',
          maxWidth: '450px',
          width: '100%',
          margin: 'auto 0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          padding: '20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA CON BOTÓN X */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0066ff 0%, #0284c7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
              flexShrink: 0
            }}>
              <Brain size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>
                Entrenador Inteligente
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#475569', fontWeight: '800' }}>
                  {exerciseName}
                </span>
                {machineConfig?.station && (
                  <span style={{ fontSize: '9.5px', background: '#f5f3ff', color: '#7c3aed', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                    🏢 {machineConfig.station}
                  </span>
                )}
              </div>
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
              color: '#64748b',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. DIAGNÓSTICO INTELIGENTE DE TU SESIÓN PREVIA */}
        <div style={{
          background: analysis.isExcessiveLoad ? '#fffbeb' : (analysis.isSpreadHigh ? '#fffbeb' : '#f0f9ff'),
          border: `1.5px solid ${analysis.isExcessiveLoad ? '#fde68a' : (analysis.isSpreadHigh ? '#fde68a' : '#bae6fd')}`,
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {analysis.isExcessiveLoad ? (
              <AlertTriangle size={16} color="#b45309" />
            ) : analysis.isSpreadHigh ? (
              <AlertTriangle size={16} color="#b45309" />
            ) : (
              <Target size={16} color="#0284c7" />
            )}
            <strong style={{ fontSize: '12.5px', color: (analysis.isExcessiveLoad || analysis.isSpreadHigh) ? '#92400e' : '#0369a1', fontWeight: '900' }}>
              {analysis.isExcessiveLoad 
                ? '⚠️ Diagnóstico: Carga Excesiva (Fuera de Rango de Hipertrofia)' 
                : (analysis.isSpreadHigh ? 'Diagnóstico: Variación de Cargas Detectada' : 'Diagnóstico de Hipertrofia')}
            </strong>
          </div>

          <p style={{ margin: 0, fontSize: '11.5px', color: '#334155', lineHeight: '1.45', fontWeight: '600' }}>
            {analysis.isExcessiveLoad ? (
              <>
                En tu sesión anterior caíste a repeticiones muy bajas (<strong>{analysis.sets.map(s => `${s.weight}#×${s.reps}r`).join(', ')}</strong>), muy por debajo de tu rango prescrito (<strong>{analysis.minReps}-{analysis.maxReps} reps</strong>). Entrenar a 3-4 reps agota el sistema nervioso central y las articulaciones sin acumular el volumen de tensión necesario para hipertrofia.
                <br /><br />
                🔬 <strong>Solución científica:</strong> Reducimos la carga a <strong>{analysis.adjustedLoad} lbs</strong> para que acumules repeticiones efectivas y descanses de <strong>2 a 3 minutos</strong> entre series.
              </>
            ) : analysis.isS1RampUp ? (
              <>
                En tu sesión anterior, la Serie 1 fue de <strong>{analysis.minWeight} lbs</strong> pero de la Serie 2 en adelante hiciste <strong>{analysis.anchorWeight} lbs</strong>. Tu capacidad real demostrada es de <strong>{analysis.anchorWeight} lbs</strong>. No entrenes con números dispersos: hoy fija tu carga de trabajo en <strong>{analysis.anchorWeight} lbs</strong>.
              </>
            ) : analysis.isSpreadHigh ? (
              <>
                Registraste una diferencia amplia entre series ({analysis.minWeight}# a {analysis.maxWeight}#). Para estimular hipertrofia con máxima tensión mecánica, unifica tus series en tu peso ancla de <strong>{analysis.anchorWeight} lbs</strong>.
              </>
            ) : (
              <>
                Tu peso ancla de trabajo se mantiene estable en <strong>{analysis.anchorWeight || analysis.maxWeight} lbs</strong> dentro del rango prescrito ({targetReps} reps).
              </>
            )}
          </p>

          {analysis.isFatigueDrop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#b45309', fontWeight: '700', marginTop: '2px' }}>
              <Clock size={12} />
              <span>En la serie final tus repeticiones cayeron por fatiga. Hoy añade +30 a 45s de descanso para sostener el rango.</span>
            </div>
          )}
        </div>

        {/* 2. ESTRATEGIA RECOMENDADA PARA HOY (SERIE POR SERIE) */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            🎯 Plan Táctico para la Sesión de Hoy:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {analysis.sets.map(s => {
              const rec = analysis.setRecommendations[s.setNum];
              if (!rec) return null;

              return (
                <div 
                  key={s.setNum}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: '#0f172a', color: '#ffffff', fontSize: '10px', fontWeight: '900', padding: '1px 5px', borderRadius: '5px' }}>
                      S{s.setNum}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Anterior: <strong>{s.weight} lbs × {s.reps} reps</strong>
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '11px', color: rec.isLoadAdjustment ? '#d97706' : '#0066ff', display: 'block' }}>
                      {rec.shortText}
                    </strong>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>
                      {rec.isLoadAdjustment ? 'Ajuste hipertrofia' : (rec.isAnchorFix ? 'Unificar carga' : (rec.isProgression ? 'Subir peso' : (rec.isFatigueRest ? 'Descansar +30s' : 'Consolidar')))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. REGLAS DE DECISIÓN INTRA-ENTRENO */}
        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '14px', padding: '10px 12px' }}>
          <strong style={{ fontSize: '11.5px', color: '#7c3aed', display: 'block', marginBottom: '4px' }}>
            💡 Si sientes la carga fácil o pesada:
          </strong>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#475569', lineHeight: '1.45' }}>
            {analysis.isExcessiveLoad ? (
              <>
                <li><strong>Descanso obligatorio:</strong> Espera entre <strong>2 y 3 minutos completos</strong> entre series. La caída de reps anterior se debió a fatiga acumulada excesiva.</li>
                <li><strong>Si S1 se siente demasiado accesible (RPE ≤ 7):</strong> Puedes subir +{analysis.increment || 5} lbs en S2, manteniendo siempre un mínimo de {analysis.minReps} repeticiones.</li>
              </>
            ) : (
              <>
                <li><strong>Si S1 o S2 se sienten fáciles (RPE ≤ 7):</strong> Sube de inmediato <strong>+{analysis.increment || 5} lbs</strong> (el siguiente salto disponible en tu máquina).</li>
                <li><strong>Si en S3 o S4 sientes fallo prematuro:</strong> No bajes el peso; simplemente descansa 45 segundos adicionales antes de iniciar.</li>
              </>
            )}
          </ul>
        </div>

        {/* BOTÓN ENTENDIDO */}
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '11px',
            fontSize: '13px',
            fontWeight: '900',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
            marginTop: '2px'
          }}
        >
          ¡Entendido, aplicar estrategia!
        </button>
      </div>
    </div>
  );
}
