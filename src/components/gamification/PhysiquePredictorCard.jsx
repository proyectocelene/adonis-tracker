import React, { useState } from 'react';
import { Target, Sparkles, Clock, ArrowRight, Settings2, Scale, Flame, Ruler, TrendingDown, TrendingUp, Award } from 'lucide-react';
import BodyCompositionModal from './BodyCompositionModal';

export default function PhysiquePredictorCard({
  trueProjection,
  currentWeekWorkouts,
  bodyComposition,
  physiqueGoal,
  setBodyComposition,
  setPhysiqueGoal
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!trueProjection) return null;

  const {
    current,
    targetFatPct,
    muscleGainTargetKg,
    goalType,
    idealWeightKg,
    fatToLoseKg,
    muscleToGainKg,
    weeksForFatLoss,
    weeksForMuscleGain,
    totalEstimatedWeeks,
    optimalWeeks,
    savedWeeks,
    progressPercent,
    weeklyFatLossRateKg,
    weeklyMuscleGainRateKg
  } = trueProjection;

  const handleSaveComposition = (newComp, newGoals) => {
    setBodyComposition(newComp);
    setPhysiqueGoal(newGoals);
  };

  const getGoalTypeBadge = (type) => {
    switch (type) {
      case 'cut': return { label: 'Definición & V-Taper', color: '#ea580c', bg: '#fff7ed' };
      case 'bulk': return { label: 'Volumen Limpio', color: '#0284c7', bg: '#f0f9ff' };
      default: return { label: 'Recomposición Adonis', color: '#4f46e5', bg: '#e0e7ff' };
    }
  };

  const goalBadge = getGoalTypeBadge(goalType);

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #e0e7ff',
      borderRadius: '22px',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.08)',
      marginBottom: '14px',
      position: 'relative'
    }}>
      {/* CABECERA CON BOTÓN PARA ABRIR BÁSCULA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
          }}>
            <Target size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#1e1b4b' }}>
                Predictor del Cuerpo Ideal
              </h3>
              <span style={{
                fontSize: '9px',
                fontWeight: '900',
                background: goalBadge.bg,
                color: goalBadge.color,
                padding: '1px 6px',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                {goalBadge.label}
              </span>
            </div>
            <span style={{ fontSize: '10.5px', color: '#6366f1', fontWeight: '700' }}>
              Tiempos verdaderos con tu báscula y medidas de cinta
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1.5px solid #93c5fd',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: '900',
            color: '#1d4ed8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 1px 3px rgba(0,102,255,0.1)'
          }}
        >
          <Scale size={14} color="#1d4ed8" /> Mi Báscula & Medidas ⚙️
        </button>
      </div>

      {/* BLOQUE 1: PESO ACTUAL VS PESO IDEAL CALCULADO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: '#f8fafc',
        borderRadius: '16px',
        padding: '12px 14px',
        marginBottom: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>
            Peso Actual
          </span>
          <strong style={{ fontSize: '20px', color: '#0f172a', fontWeight: '900', display: 'block', lineHeight: 1.1 }}>
            {current.weightKg} kg
          </strong>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>
            IMC: {current.bmi} • {current.bodyFatPct}% Grasa
          </span>
        </div>

        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4f46e5',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <ArrowRight size={16} />
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px', color: '#4f46e5', fontWeight: '800', textTransform: 'uppercase' }}>
            Peso Ideal Adonis
          </span>
          <strong style={{ fontSize: '20px', color: '#4338ca', fontWeight: '900', display: 'block', lineHeight: 1.1 }}>
            {idealWeightKg} kg
          </strong>
          <span style={{ fontSize: '10px', color: '#4f46e5', fontWeight: '700' }}>
            Meta: {targetFatPct}% Grasa
          </span>
        </div>
      </div>

      {/* BLOQUE 2: PROYECCIÓN PRINCIPAL EN SEMANAS VERDADERAS */}
      <div style={{
        background: 'linear-gradient(135deg, #3730a3 0%, #1e1b4b 100%)',
        borderRadius: '18px',
        padding: '16px',
        color: '#ffffff',
        marginBottom: '12px',
        boxShadow: '0 6px 18px rgba(55, 48, 163, 0.25)',
        border: '1px solid #4338ca'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="#a5b4fc" />
            <span style={{ fontSize: '11px', color: '#c7d2fe', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tiempo Fisiológico Verdadero
            </span>
          </div>
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            fontSize: '10px',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '8px',
            color: '#e0e7ff'
          }}>
            {currentWeekWorkouts} días/sem entrenados
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <strong style={{ fontSize: '30px', fontWeight: '900', lineHeight: 1, color: '#ffffff' }}>
            ~{totalEstimatedWeeks} semanas
          </strong>
          <span style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: '800' }}>
            ({Math.round((totalEstimatedWeeks / 4.3) * 10) / 10} meses reales)
          </span>
        </div>

        {/* DESGLOSE CIENTÍFICO EN 2 VECTORES (GRASA VS MÚSCULO) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255,255,255,0.12)'
        }}>
          {/* Vector Grasa */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '8px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <TrendingDown size={13} color="#f87171" />
              <span style={{ fontSize: '10px', color: '#fca5a5', fontWeight: '800' }}>Grasa a Oxidar</span>
            </div>
            <strong style={{ fontSize: '14px', color: '#ffffff', fontWeight: '900', display: 'block' }}>
              {fatToLoseKg > 0 ? `-${fatToLoseKg} kg` : '0 kg (En rango)'}
            </strong>
            <span style={{ fontSize: '9.5px', color: '#cbd5e1' }}>
              ~{weeksForFatLoss} semanas ({weeklyFatLossRateKg} kg/sem)
            </span>
          </div>

          {/* Vector Músculo */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '8px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <TrendingUp size={13} color="#34d399" />
              <span style={{ fontSize: '10px', color: '#86efac', fontWeight: '800' }}>Músculo Magro</span>
            </div>
            <strong style={{ fontSize: '14px', color: '#ffffff', fontWeight: '900', display: 'block' }}>
              +{muscleToGainKg} kg
            </strong>
            <span style={{ fontSize: '9.5px', color: '#cbd5e1' }}>
              ~{weeksForMuscleGain} semanas ({Math.round(weeklyMuscleGainRateKg * 4.3 * 100) / 100} kg/mes)
            </span>
          </div>
        </div>

        {/* IMPACTO DE ASISTENCIA */}
        {savedWeeks > 0 && currentWeekWorkouts < 5 && (
          <div style={{
            marginTop: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '10.5px',
            color: '#e0f2fe',
            fontWeight: '700'
          }}>
            ⚡ <strong>Acelerador:</strong> Si mantienes <strong>5 días consistentes</strong> en el gimnasio, reduces tu tiempo a <strong>~{optimalWeeks} semanas</strong> (¡ahorras ~{savedWeeks} semanas!).
          </div>
        )}
      </div>

      {/* BLOQUE 3: MÉTRICAS DE BÁSCULA & RATIO DE ADONIS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        marginBottom: '12px'
      }}>
        {/* Ratio Adonis V-Taper */}
        <div style={{
          background: '#f5f3ff',
          border: '1px solid #ddd6fe',
          borderRadius: '12px',
          padding: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '9px', color: '#6d28d9', fontWeight: '800', display: 'block', textTransform: 'uppercase' }}>
            Ratio Adonis (H/C)
          </span>
          <strong style={{ fontSize: '15px', color: '#4c1d95', fontWeight: '900' }}>
            {current.hasTapeMeasurements && current.adonisRatio ? current.adonisRatio : '--'}
          </strong>
          <span style={{ fontSize: '8.5px', color: '#7c3aed', display: 'block', fontWeight: '700' }}>
            {current.hasTapeMeasurements ? 'Meta: 1.618' : 'Sin cinta métrica'}
          </span>
        </div>

        {/* Grasa Visceral */}
        <div style={{
          background: current.visceralFat >= 10 ? '#fef2f2' : (current.visceralFat > 8 ? '#fffbeb' : '#ecfdf5'),
          border: `1px solid ${current.visceralFat >= 10 ? '#fecaca' : (current.visceralFat > 8 ? '#fde68a' : '#a7f3d0')}`,
          borderRadius: '12px',
          padding: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '9px', color: current.visceralFat >= 10 ? '#dc2626' : (current.visceralFat > 8 ? '#d97706' : '#047857'), fontWeight: '800', display: 'block', textTransform: 'uppercase' }}>
            Grasa Visceral
          </span>
          <strong style={{ fontSize: '15px', color: current.visceralFat >= 10 ? '#991b1b' : (current.visceralFat > 8 ? '#92400e' : '#065f46'), fontWeight: '900' }}>
            Nivel {current.visceralFat}
          </strong>
          <span style={{ fontSize: '8.5px', color: current.visceralFat >= 10 ? '#dc2626' : (current.visceralFat > 8 ? '#d97706' : '#059669'), display: 'block', fontWeight: '700' }}>
            {current.visceralFat >= 10 ? '🔴 Alerta Salud' : (current.visceralFat > 8 ? '🟡 Alerta Moderada' : '🟢 Saludable')}
          </span>
        </div>

        {/* Edad Metabólica */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '9px', color: '#1d4ed8', fontWeight: '800', display: 'block', textTransform: 'uppercase' }}>
            Edad Metabólica
          </span>
          <strong style={{ fontSize: '15px', color: '#1e40af', fontWeight: '900' }}>
            {current.metabolicAge} años
          </strong>
          <span style={{ fontSize: '8.5px', color: '#2563eb', display: 'block', fontWeight: '700' }}>
            Real: {current.realAge} años {current.metabolicAge <= current.realAge ? '✨' : `(+${current.metabolicAge - current.realAge})`}
          </span>
        </div>
      </div>

      {/* BLOQUE 4: BARRA DE PROGRESO Y PRÓXIMO HITO */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
          <span style={{ color: '#64748b', fontWeight: '800' }}>Composición Física Completada</span>
          <strong style={{ color: '#4f46e5', fontWeight: '900' }}>{progressPercent}%</strong>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: '10px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* PRÓXIMO HITO CONCRETO */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Sparkles size={16} color="#4f46e5" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: '#334155', fontWeight: '700', lineHeight: 1.35 }}>
          {current.hasTapeMeasurements && current.waistCm ? (
            <><strong>Próximo Hito:</strong> Reducir cintura a {Math.max(76, current.waistCm - 1)} cm y consolidar sobrecarga en hombros para elevar tu Ratio Adonis hacia 1.618.</>
          ) : (
            <><strong>Próximo Hito (Fase 1):</strong> Reducir la grasa visceral de 11.5 a &lt; 6 mediante déficit calórico moderado (~500 kcal) y sobrecarga en el gimnasio para normalizar tu edad metabólica.</>
          )}
        </span>
      </div>

      {/* MODAL DE BÁSCULA & MEDIDAS */}
      <BodyCompositionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={current}
        initialGoals={{ targetFatPct, muscleGainTargetKg, goalType }}
        onSave={handleSaveComposition}
      />
    </div>
  );
}
