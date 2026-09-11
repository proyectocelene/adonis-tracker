import React from 'react';
import { Zap, X, Brain, Target, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, Clock, Layers, Sparkles } from 'lucide-react';
import { analyzeExercisePerformance, calculate1RM } from '../../hooks/useWorkoutCalculations';

export default function OverloadScienceModal({
  isOpen,
  onClose,
  exerciseName = '',
  loadRecommendation = null,
  targetReps = '10-12',
  previousData = {},
  todayWorkoutData = {},
  machineConfig = null
}) {
  if (!isOpen) return null;

  const analysis = analyzeExercisePerformance(previousData, targetReps, machineConfig);
  const unified = analysis.unifiedTarget;

  // Extraer el conjunto completo de números de series (unión de sesión previa y hoy)
  const prevSetKeys = Object.keys(previousData || {}).map(k => parseInt(k, 10)).filter(n => !isNaN(n) && n > 0);
  const todaySetKeys = Object.keys(todayWorkoutData || {}).map(k => parseInt(k, 10)).filter(n => !isNaN(n) && n > 0);
  const maxSetNum = Math.max(3, ...prevSetKeys, ...todaySetKeys);
  const setNumbers = Array.from({ length: maxSetNum }, (_, i) => i + 1);

  // Determinar especificación física del aparato
  const machineTypeLabel = machineConfig?.type === 'plates' 
    ? 'Prensa / Discos por Lado' 
    : (machineConfig?.type === 'stack' ? 'Torre de Placas' : (machineConfig?.type === 'dumbbells' ? 'Mancuernas' : 'Máquina Guiada'));
  const machineLocation = machineConfig?.station || machineConfig?.floor || '';
  const minIncrement = analysis.increment || (machineConfig?.firstPlate ? 10 : 2.5);

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
          maxWidth: '460px',
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
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0066ff 0%, #0284c7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
              flexShrink: 0
            }}>
              <Brain size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>
                Entrenador Inteligente
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#475569', fontWeight: '800' }}>
                  {exerciseName}
                </span>
                {machineLocation && (
                  <span style={{ fontSize: '9.5px', background: '#f5f3ff', color: '#7c3aed', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                    🏢 {machineLocation}
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

        {/* 1. FICHA TÉCNICA DEL APARATO Y CALIBRACIÓN FÍSICA */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontWeight: '700' }}>
            <Layers size={14} color="#0066ff" />
            <span>{machineTypeLabel}</span>
          </div>
          <div style={{ color: '#0369a1', fontWeight: '800' }}>
            Incrementos: ±{minIncrement} lbs
          </div>
        </div>

        {/* 2. DIAGNÓSTICO CIENTÍFICO GLOBAL DEL EJERCICIO */}
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
                ? '⚠️ Diagnóstico: Carga Excesiva (Fuera de Hipertrofia)' 
                : (analysis.canProgressWeight ? '🚀 ¡Sobrecarga Progresiva Alcanzada!' : 'Diagnóstico y Meta de Hipertrofia')}
            </strong>
          </div>

          <p style={{ margin: 0, fontSize: '11.5px', color: '#334155', lineHeight: '1.45', fontWeight: '600' }}>
            {analysis.isExcessiveLoad ? (
              <>
                En la sesión previa la carga fue excesiva para el rango prescrito ({analysis.minReps}-{analysis.maxReps} reps). Ajustamos el peso de trabajo a <strong>{analysis.adjustedLoad} lbs</strong> para acumular tensión mecánica limpia y efectiva.
              </>
            ) : analysis.canProgressWeight ? (
              <>
                ¡Completaste con solvencia el techo de repeticiones en la sesión anterior! Tu nueva meta de sobrecarga progresiva es subir a <strong>{unified.targetWeight} lbs</strong> buscando entre <strong>{unified.minReps} y {unified.maxReps} reps</strong>.
              </>
            ) : analysis.isS1RampUp ? (
              <>
                En tu sesión previa la Serie 1 fue ligera pero luego demostraste fuerza a <strong>{analysis.anchorWeight} lbs</strong>. Hoy unificamos todas las series a tu peso ancla de <strong>{analysis.anchorWeight} lbs</strong>.
              </>
            ) : (
              <>
                Tu peso ancla de trabajo se mantiene sólido en <strong>{analysis.anchorWeight || analysis.maxWeight || 100} lbs</strong>. El objetivo de hoy es consolidar en rango de <strong>{unified.targetReps || `${analysis.minReps}-${analysis.maxReps}`} reps</strong> buscando RPE 8.
              </>
            )}
          </p>

          {analysis.isFatigueDrop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#b45309', fontWeight: '700', marginTop: '2px' }}>
              <Clock size={12} />
              <span>Fatiga detectada en series finales previas. Añade +30 a 45s de descanso entre series.</span>
            </div>
          )}
        </div>

        {/* 3. DESGLOSE SERIE POR SERIE EN VIVO (ANTERIOR VS HOY) */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            🎯 Comparativa Serie por Serie (Historial vs Hoy):
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {setNumbers.map(sNum => {
              const prev = previousData?.[sNum];
              const today = todayWorkoutData?.[sNum];
              const rec = analysis.setRecommendations?.[sNum];

              const prevWeight = prev ? parseFloat(prev.weight) || 0 : 0;
              const prevReps = prev ? parseFloat(prev.reps) || 0 : 0;

              const todayWeight = today ? parseFloat(today.weight) || 0 : 0;
              const todayReps = today ? parseFloat(today.reps) || 0 : 0;
              const todayRpe = today ? parseFloat(today.rpe) || 8 : null;
              const isTodayDone = today && today.completed;

              // Calcular delta real
              const deltaW = prevWeight > 0 ? (todayWeight - prevWeight) : 0;
              const deltaR = prevReps > 0 ? (todayReps - prevReps) : 0;
              const isExtraSet = !prevWeight && !prevReps;

              let statusBadge = null;
              if (isTodayDone) {
                if (deltaW > 0) {
                  statusBadge = { text: `🚀 +${deltaW} lbs!`, color: '#15803d', bg: '#dcfce7' };
                } else if (deltaW === 0 && deltaR > 0) {
                  statusBadge = { text: `⚡ +${deltaR} reps!`, color: '#0369a1', bg: '#e0f2fe' };
                } else if (deltaW === 0 && deltaR === 0) {
                  statusBadge = { text: `✓ Consolidado`, color: '#15803d', bg: '#f0fdf4' };
                } else if (isExtraSet) {
                  statusBadge = { text: `➕ Extra`, color: '#7c3aed', bg: '#f5f3ff' };
                } else {
                  statusBadge = { text: `⚖️ Fatiga`, color: '#b45309', bg: '#fef3c7' };
                }
              }

              return (
                <div 
                  key={sNum}
                  style={{
                    background: isTodayDone ? '#f0fdf4' : '#f8fafc',
                    border: `1.5px solid ${isTodayDone ? '#86efac' : '#cbd5e1'}`,
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      background: isTodayDone ? '#15803d' : '#0f172a', 
                      color: '#ffffff', 
                      fontSize: '10px', 
                      fontWeight: '900', 
                      padding: '2px 6px', 
                      borderRadius: '6px' 
                    }}>
                      S{sNum}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Previo: {prevWeight > 0 ? <strong>{prevWeight}# × {prevReps}r</strong> : '— (Primera vez)'}
                      </span>
                      {isTodayDone ? (
                        <span style={{ fontSize: '11.5px', color: '#0f172a', fontWeight: '800' }}>
                          Hoy: {todayWeight}# × {todayReps}r {todayRpe ? `(RPE ${todayRpe})` : ''}
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700' }}>
                          Meta: {rec?.suggestedWeight || unified.targetWeight || 100}# × {unified.targetReps || `${analysis.minReps}-${analysis.maxReps}`} reps
                        </span>
                      )}
                    </div>
                  </div>

                  {statusBadge && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '900',
                      color: statusBadge.color,
                      background: statusBadge.bg,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      whiteSpace: 'nowrap'
                    }}>
                      {statusBadge.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. REGLAS DE AUTORREGULACIÓN INTRA-ENTRENO */}
        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '14px', padding: '10px 12px' }}>
          <strong style={{ fontSize: '11.5px', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            <Sparkles size={14} /> Pautas de Acción Inmediata en el Gym:
          </strong>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#475569', lineHeight: '1.45' }}>
            <li><strong>Si superas el rango máximo (ej: 13-15 reps con RPE ≤ 8):</strong> Tienes dominio neuromuscular pleno. Sube en la siguiente serie <strong>+{minIncrement} lbs</strong> (el siguiente salto físico de la máquina).</li>
            <li><strong>Si sientes fatiga prematura en S3/S4:</strong> No sacrifiques el peso ancla de golpe. Añade <strong>60 segundos adicionales de descanso</strong> antes de comenzar para resintetizar fosfocreatina muscular.</li>
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
          ¡Entendido, a romper marcas!
        </button>
      </div>
    </div>
  );
}
