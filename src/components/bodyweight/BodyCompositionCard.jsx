import React from 'react';
import { Scale, Target, Activity, Flame, Ruler, Sparkles, Dumbbell, Heart, ChevronRight } from 'lucide-react';
import { normalizeBodyComposition, calculateTruePhysiqueProjection } from '../../utils/gamificationCalculations';

export default function BodyCompositionCard({
  bodyComposition,
  physiqueGoal,
  workoutHistory = [],
  preferredUnit = 'kg',
  onOpenScaleModal
}) {
  // Normalizar datos bioimpedancia
  const comp = normalizeBodyComposition(bodyComposition);

  // Calcular entrenamientos de la última semana y sobrecargas para la proyección real
  const today = new Date();
  const recentWorkouts = (workoutHistory || []).filter(ses => {
    if (!ses?.timestamp) return false;
    const diffDays = (today.getTime() - new Date(ses.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  let overloadCount = 0;
  (workoutHistory || []).forEach(ses => {
    if (ses?.exercises) {
      Object.values(ses.exercises).forEach(ex => {
        const sets = Object.keys(ex).filter(k => !isNaN(parseInt(k, 10)) && ex[k]?.completed);
        if (sets.length >= 2) overloadCount++;
      });
    }
  });

  const projection = calculateTruePhysiqueProjection(
    comp,
    physiqueGoal,
    recentWorkouts || 3,
    overloadCount
  );

  // Clasificación IMC
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Bajo Peso', color: '#0284c7' };
    if (bmi < 25) return { label: 'Normal / Saludable', color: '#059669' };
    if (bmi < 30) return { label: 'Sobrepeso / Muscular', color: '#d97706' };
    return { label: 'Obesidad', color: '#dc2626' };
  };
  const bmiInfo = getBmiCategory(comp.bmi);

  // Clasificación Grasa Visceral
  const getVisceralCategory = (level) => {
    if (level <= 4) return { label: 'Excelente', color: '#059669' };
    if (level <= 9) return { label: 'Saludable', color: '#0284c7' };
    if (level <= 12) return { label: 'Alerta', color: '#d97706' };
    return { label: 'Alto Riesgo', color: '#dc2626' };
  };
  const visceralInfo = getVisceralCategory(comp.visceralFat);

  return (
    <div 
      className="card" 
      style={{
        borderRadius: '24px',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        padding: '18px',
        marginBottom: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}
    >
      {/* CABECERA CON BOTÓN PARA ABRIR BÁSCULA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0066ff'
          }}>
            <Scale size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
              Báscula Inteligente & Bioimpedancia
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
              Análisis completo de 18 métricas fisiológicas
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenScaleModal}
          style={{
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 10px rgba(0, 102, 255, 0.25)'
          }}
        >
          <Sparkles size={14} /> Cargar / Editar Báscula
        </button>
      </div>

      {/* GRID DE PARÁMETROS PRINCIPALES DE BIOIMPEDANCIA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '14px' }}>
        
        {/* GRASA CORPORAL */}
        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              Grasa Corporal
            </span>
            <Flame size={14} color="#f97316" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
            {comp.bodyFatPct}%
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>
            {comp.fatMassKg} kg grasa • Meta: {physiqueGoal?.targetFatPct || 12}%
          </div>
        </div>

        {/* MÚSCULO ESQUELÉTICO */}
        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              Músculo Esquelético
            </span>
            <Dumbbell size={14} color="#0066ff" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
            {comp.skeletalMusclePct}%
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>
            {comp.skeletalMuscleKg} kg (Magra: {comp.fatFreeMassKg} kg)
          </div>
        </div>

        {/* PROPORCIÓN ADONIS V-TAPER */}
        {comp.hasTapeMeasurements ? (
          <div style={{ background: '#eff6ff', padding: '10px 12px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#1e40af', textTransform: 'uppercase' }}>
                V-Taper Adonis
              </span>
              <Ruler size={14} color="#1e40af" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e3a8a' }}>
              {comp.adonisRatio} <span style={{ fontSize: '11px', color: '#64748b' }}>/ 1.618</span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#1e40af', fontWeight: '800' }}>
              Hombro {comp.shouldersCm}cm • Cintura {comp.waistCm}cm
            </div>
          </div>
        ) : (
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                V-Taper Adonis
              </span>
              <Ruler size={14} color="#94a3b8" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#64748b' }}>
              Sin cinta métrica
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
              Mide hombros y cintura para calcular tu ratio
            </div>
          </div>
        )}

        {/* GRASA VISCERAL */}
        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              Grasa Visceral
            </span>
            <Heart size={14} color="#ef4444" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
            Nivel {comp.visceralFat}
          </div>
          <div style={{ fontSize: '10.5px', color: visceralInfo.color, fontWeight: '800' }}>
            {visceralInfo.label} (Salud Órganos)
          </div>
        </div>

        {/* EDAD METABÓLICA */}
        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              Edad Metabólica
            </span>
            <Activity size={14} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
            {comp.metabolicAge} años
          </div>
          <div style={{ fontSize: '10.5px', color: comp.metabolicAge <= comp.realAge ? '#059669' : '#d97706', fontWeight: '800' }}>
            {comp.metabolicAge <= comp.realAge ? `🔥 ${comp.realAge - comp.metabolicAge} años más joven` : `Real: ${comp.realAge} años (+${comp.metabolicAge - comp.realAge})`}
          </div>
        </div>

        {/* METABOLISMO BASAL (BMR) */}
        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              Metabolismo Basal
            </span>
            <Flame size={14} color="#eab308" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
            {comp.bmr} <span style={{ fontSize: '11px', color: '#64748b' }}>kcal</span>
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>
            Katch-McArdle • Agua: {comp.waterPct}%
          </div>
        </div>

      </div>

      {/* MINI BANNER DE PROYECCIÓN CIENTÍFICA VERDADERA */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '12px 14px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <Target size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>
              Fase 1: Reducción Visceral & Definición Prioritaria
            </div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#f8fafc', marginTop: '1px' }}>
              🎯 Meta: {projection.targetWeightKg} kg al {projection.targetFatPct}% grasa • Faltan: <span style={{ color: '#38bdf8' }}>~{projection.phase1Weeks || projection.projectedWeeks} semanas</span>
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
              {projection.fatToLoseKg > 0 ? `🔥 -${projection.fatToLoseKg} kg grasa ` : ''}
              {comp.visceralFat >= 9 ? `• ⚠️ Reducción visceral (de nivel ${comp.visceralFat} a < 6) ` : ''}
              • Ritmo seguro (~{projection.weeklyFatLossRateKg} kg/sem)
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenScaleModal}
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          Ajustar Metas <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
