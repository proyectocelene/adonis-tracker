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
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '22px',
      padding: '16px',
      boxShadow: 'var(--shadow-ios)',
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
            background: 'var(--accent-blue-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-blue)',
            border: '1px solid var(--border-subtle)'
          }}>
            <Target size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-main)' }}>
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
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>
              Tiempos verdaderos con tu báscula y medidas de cinta
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--accent-blue-light)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: '900',
            color: 'var(--accent-blue)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Scale size={14} color="var(--accent-blue)" /> Mi Báscula & Medidas ⚙️
        </button>
      </div>

      {/* BLOQUE 1: PESO ACTUAL VS PESO IDEAL CALCULADO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: 'var(--bg-surface-secondary)',
        borderRadius: '16px',
        padding: '12px 14px',
        marginBottom: '12px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>
            Peso Actual
          </span>
          <strong className="font-mono-tech" style={{ fontSize: '20px', color: 'var(--text-main)', fontWeight: '900', display: 'block', lineHeight: 1.1 }}>
            {current.weightKg} kg
          </strong>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>
            IMC: {current.bmi} • {current.bodyFatPct}% Grasa
          </span>
        </div>

        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-blue)',
          border: '1px solid var(--border-subtle)'
        }}>
          <ArrowRight size={16} />
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px', color: 'var(--accent-blue)', fontWeight: '800', textTransform: 'uppercase' }}>
            Peso Ideal Adonis
          </span>
          <strong className="font-mono-tech" style={{ fontSize: '20px', color: 'var(--accent-blue)', fontWeight: '900', display: 'block', lineHeight: 1.1 }}>
            {idealWeightKg} kg
          </strong>
          <span style={{ fontSize: '10px', color: 'var(--accent-blue)', fontWeight: '700' }}>
            Meta: {targetFatPct}% Grasa
          </span>
        </div>
      </div>

      {/* BLOQUE 2: PROYECCIÓN PRINCIPAL EN SEMANAS VERDADERAS */}
      <div style={{
        background: 'var(--bg-surface-secondary)',
        borderRadius: '18px',
        padding: '16px',
        color: 'var(--text-main)',
        marginBottom: '12px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="var(--accent-blue)" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tiempo Fisiológico Verdadero
            </span>
          </div>
          <span style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            fontSize: '10px',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '8px',
            color: 'var(--text-main)'
          }}>
            {currentWeekWorkouts} días/sem entrenados
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <strong className="font-mono-tech" style={{ fontSize: '30px', fontWeight: '900', lineHeight: 1, color: 'var(--accent-blue)' }}>
            ~{totalEstimatedWeeks} semanas
          </strong>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800' }}>
            ({Math.round((totalEstimatedWeeks / 4.3) * 10) / 10} meses reales)
          </span>
        </div>

        {/* DESGLOSE CIENTÍFICO EN 2 VECTORES (GRASA VS MÚSCULO) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {/* Vector Grasa */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '8px 10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <TrendingDown size={13} color="var(--accent-red)" />
              <span style={{ fontSize: '10px', color: 'var(--accent-red)', fontWeight: '800' }}>Grasa a Oxidar</span>
            </div>
            <strong className="font-mono-tech" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '900', display: 'block' }}>
              {fatToLoseKg > 0 ? `-${fatToLoseKg} kg` : '0 kg (En rango)'}
            </strong>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
              ~{weeksForFatLoss} semanas ({weeklyFatLossRateKg} kg/sem)
            </span>
          </div>

          {/* Vector Músculo */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '8px 10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <TrendingUp size={13} color="var(--accent-emerald)" />
              <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '800' }}>Músculo Magro</span>
            </div>
            <strong className="font-mono-tech" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '900', display: 'block' }}>
              +{muscleToGainKg} kg
            </strong>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
              ~{weeksForMuscleGain} semanas ({Math.round(weeklyMuscleGainRateKg * 4.3 * 100) / 100} kg/mes)
            </span>
          </div>
        </div>

        {/* IMPACTO DE ASISTENCIA */}
        {savedWeeks > 0 && currentWeekWorkouts < 5 && (
          <div style={{
            marginTop: '10px',
            background: 'var(--accent-blue-light)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '10.5px',
            color: 'var(--text-main)',
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
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '12px',
          padding: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '9px', color: '#c084fc', fontWeight: '800', display: 'block', textTransform: 'uppercase' }}>
            Ratio Adonis (H/C)
          </span>
          <strong className="font-mono-tech" style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '900' }}>
            {current.hasTapeMeasurements && current.adonisRatio ? current.adonisRatio : '--'}
          </strong>
          <span style={{ fontSize: '8.5px', color: '#c084fc', display: 'block', fontWeight: '700' }}>
            {current.hasTapeMeasurements ? 'Meta: 1.618' : 'Sin cinta métrica'}
          </span>
        </div>

        {/* Grasa Visceral */}
        <div style={{
          background: current.visceralFat >= 10 ? 'var(--accent-red-subtle)' : (current.visceralFat > 8 ? 'var(--accent-amber-subtle)' : 'var(--accent-emerald-subtle)'),
          border: `1px solid ${current.visceralFat >= 10 ? 'rgba(239, 68, 68, 0.3)' : (current.visceralFat > 8 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)')}`,
          borderRadius: '12px',
          padding: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '9px', color: current.visceralFat >= 10 ? 'var(--accent-red)' : (current.visceralFat > 8 ? 'var(--accent-amber)' : 'var(--accent-emerald)'), fontWeight: '800', display: 'block', textTransform: 'uppercase' }}>
            Grasa Visceral
          </span>
          <strong className="font-mono-tech" style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '900' }}>
            Nivel {current.visceralFat}
          </strong>
          <span style={{ fontSize: '8.5px', color: current.visceralFat >= 10 ? 'var(--accent-red)' : (current.visceralFat > 8 ? 'var(--accent-amber)' : 'var(--accent-emerald)'), display: 'block', fontWeight: '700' }}>
            {current.visceralFat >= 10 ? '🔴 Alerta Salud' : (current.visceralFat > 8 ? '🟡 Alerta Moderada' : '🟢 Saludable')}
          </span>
        </div>

        {/* Edad Metabólica */}
        <div style={{
          background: 'var(--accent-blue-light)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '9px', color: 'var(--accent-blue)', fontWeight: '800', display: 'block', textTransform: 'uppercase' }}>
            Edad Metabólica
          </span>
          <strong className="font-mono-tech" style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '900' }}>
            {current.metabolicAge} años
          </strong>
          <span style={{ fontSize: '8.5px', color: 'var(--accent-blue)', display: 'block', fontWeight: '700' }}>
            Real: {current.realAge} años {current.metabolicAge <= current.realAge ? '✨' : `(+${current.metabolicAge - current.realAge})`}
          </span>
        </div>
      </div>

      {/* BLOQUE 4: BARRA DE PROGRESO Y PRÓXIMO HITO */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: '800' }}>Composición Física Completada</span>
          <strong className="font-mono-tech" style={{ color: 'var(--accent-blue)', fontWeight: '900' }}>{progressPercent}%</strong>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--bg-surface-secondary)',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'var(--accent-blue)',
            borderRadius: '10px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* PRÓXIMO HITO CONCRETO */}
      <div style={{
        background: 'var(--bg-surface-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Sparkles size={16} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', lineHeight: 1.35 }}>
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
