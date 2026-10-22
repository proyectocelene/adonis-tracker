import React, { useState, useMemo } from 'react';
import { Scale, Target, Activity, Flame, Ruler, Sparkles, Dumbbell, Heart, ChevronRight, ChevronDown, ChevronUp, Calendar, Zap, Award, Utensils, TrendingDown } from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine 
} from 'recharts';
import { normalizeBodyComposition, calculateTruePhysiqueProjection } from '../../utils/gamificationCalculations';

export default function BodyCompositionCard({
  bodyComposition,
  physiqueGoal,
  workoutHistory = [],
  bodyMetrics = [],
  preferredUnit = 'kg',
  onOpenScaleModal
}) {
  // Sincronizar el peso más reciente registrado en la bitácora si existe
  const validMetrics = Array.isArray(bodyMetrics) ? bodyMetrics.filter(m => m && (m.weight || m.peso)) : [];
  let dynamicComp = { ...bodyComposition };
  if (validMetrics.length > 0) {
    const sortedMetrics = [...validMetrics].sort((a, b) => new Date(a.date || a.timestamp || 0) - new Date(b.date || b.timestamp || 0));
    const lastMetric = sortedMetrics[sortedMetrics.length - 1];
    const rawW = parseFloat(lastMetric.weight || lastMetric.peso);
    if (!isNaN(rawW) && rawW > 0) {
      const unit = (lastMetric.unit || 'kg').toLowerCase();
      const metricKg = unit === 'lbs' ? rawW * 0.453592 : rawW;
      dynamicComp.weightKg = Math.round(metricKg * 100) / 100;
      if (lastMetric.bodyFatPct) {
        dynamicComp.bodyFatPct = parseFloat(lastMetric.bodyFatPct);
        dynamicComp.fatMassKg = Math.round((dynamicComp.weightKg * (dynamicComp.bodyFatPct / 100)) * 10) / 10;
        dynamicComp.fatFreeMassKg = Math.round((dynamicComp.weightKg - dynamicComp.fatMassKg) * 10) / 10;
      } else if (dynamicComp.fatFreeMassKg && dynamicComp.fatFreeMassKg > 0) {
        dynamicComp.fatMassKg = Math.max(0, Math.round((dynamicComp.weightKg - dynamicComp.fatFreeMassKg) * 10) / 10);
        dynamicComp.bodyFatPct = Math.round((dynamicComp.fatMassKg / dynamicComp.weightKg) * 1000) / 10;
      }
    }
  }

  // Normalizar datos bioimpedancia
  const comp = normalizeBodyComposition(dynamicComp);

  // Calcular entrenamientos de la última semana y sobrecargas para la proyección real
  const today = new Date();
  const recentWorkouts = (workoutHistory || []).filter(ses => {
    if (!ses?.timestamp || ses.isRestDay || ses.isMissedDay) return false;
    const vol = parseFloat(ses.volume) || 0;
    const setsCount = parseInt(ses.completedSets, 10) || 0;
    if (!ses.isCompleted && vol <= 0 && setsCount <= 0 && !ses.exercises) return false;
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
    recentWorkouts || 4,
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

  // Estado para desplegar hoja de ruta y prescripción nutricional
  const [showTimeline, setShowTimeline] = useState(false);
  const remainingWeeks = projection.phase1Weeks || projection.projectedWeeks || 22;
  const targetDate = new Date(Date.now() + remainingWeeks * 7 * 86400000).toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const currentW = comp.weightKg || 78.5;
  const finalTargetW = projection.targetWeightKg || 70.0;
  const totalDelta = Math.max(0.5, currentW - finalTargetW);
  const hito1W = Math.round((currentW - totalDelta * 0.38) * 10) / 10;
  const hito2W = Math.round((currentW - totalDelta * 0.72) * 10) / 10;
  const hito1Weeks = Math.max(4, Math.round(remainingWeeks * 0.36));
  const hito2Weeks = Math.max(hito1Weeks + 3, Math.round(remainingWeeks * 0.72));

  // Prescripción nutricional basada en bioimpedancia real (Katch-McArdle)
  const estimatedTdee = Math.round((comp.bmr || 1650) * 1.45);
  const targetCalories = Math.max(1650, estimatedTdee - 450);
  const targetProteinG = Math.round((comp.fatFreeMassKg || 60) * 2.2);
  const targetFatG = Math.round((targetCalories * 0.25) / 9);
  const targetCarbsG = Math.round((targetCalories - (targetProteinG * 4 + targetFatG * 9)) / 4);

  // Construir puntos de la curva de proyección hacia el cuerpo ideal
  const projectionChartData = useMemo(() => {
    const data = [];
    const totalWeeks = Math.max(8, remainingWeeks);
    const startW = currentW;
    const endW = finalTargetW;
    const weeklyRate = (startW - endW) / totalWeeks;

    for (let w = 0; w <= totalWeeks; w += (totalWeeks > 16 ? 2 : 1)) {
      const projW = Math.round((startW - weeklyRate * w) * 10) / 10;
      let label = w === 0 ? 'Hoy' : `S${w}`;
      let phase = '';
      if (w === 0) phase = 'Inicio / Hoy';
      else if (w <= hito1Weeks) phase = 'Desinflamación';
      else if (w <= hito2Weeks) phase = 'Recomposición';
      else phase = 'Definición Adonis';

      data.push({
        week: w,
        label,
        peso: projW,
        phase,
        meta: endW
      });
    }

    if (!data.some(d => d.week === totalWeeks)) {
      data.push({
        week: totalWeeks,
        label: `S${totalWeeks}`,
        peso: endW,
        phase: 'Meta Adonis',
        meta: endW
      });
    }
    return data;
  }, [currentW, finalTargetW, remainingWeeks, hito1Weeks, hito2Weeks]);

  const ProjectionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const dropFromStart = Math.round((currentW - d.peso) * 10) / 10;
      return (
        <div style={{
          background: 'var(--bg-surface)',
          color: 'var(--text-main)',
          padding: '10px 14px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-ios-lg)',
          border: '1px solid var(--border-subtle)',
          fontSize: '11px'
        }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: '800', marginBottom: '2px' }}>
            📅 {d.week === 0 ? 'Punto de Partida (Hoy)' : `Semana ${d.week}`} • {d.phase}
          </div>
          <div className="font-mono-tech" style={{ fontSize: '18px', fontWeight: '900', color: 'var(--accent-blue)' }}>
            {d.peso} kg
          </div>
          {dropFromStart > 0 && (
            <div style={{ color: 'var(--accent-emerald)', fontWeight: '800', marginTop: '2px' }}>
              🔥 -{dropFromStart} kg grasa pura acumulada
            </div>
          )}
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '4px' }}>
            Meta final: {finalTargetW} kg
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="card" 
      style={{
        borderRadius: '24px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        padding: '18px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-ios)'
      }}
    >
      {/* CABECERA CON BOTÓN PARA ABRIR BÁSCULA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'var(--accent-blue-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-blue)'
          }}>
            <Scale size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>
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
        <div style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Grasa Corporal
            </span>
            <Flame size={14} color="#f97316" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>
            {comp.bodyFatPct}%
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {comp.fatMassKg} kg grasa • Meta: {physiqueGoal?.targetFatPct || 12}%
          </div>
        </div>

        {/* MÚSCULO ESQUELÉTICO */}
        <div style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Músculo Esquelético
            </span>
            <Dumbbell size={14} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>
            {comp.skeletalMusclePct}%
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {comp.skeletalMuscleKg} kg (Magra: {comp.fatFreeMassKg} kg)
          </div>
        </div>

        {/* PROPORCIÓN ADONIS V-TAPER */}
        {comp.hasTapeMeasurements ? (
          <div style={{ background: 'var(--accent-blue-light)', padding: '10px 12px', borderRadius: '16px', border: '1px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                V-Taper Adonis
              </span>
              <Ruler size={14} color="var(--accent-blue)" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>
              {comp.adonisRatio} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 1.618</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--accent-blue)', fontWeight: '800' }}>
              Hombro {comp.shouldersCm}cm • Cintura {comp.waistCm}cm
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                V-Taper Adonis
              </span>
              <Ruler size={14} color="var(--text-muted)" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-muted)' }}>
              Sin cinta métrica
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Mide hombros y cintura para calcular tu ratio
            </div>
          </div>
        )}

        {/* GRASA VISCERAL */}
        <div style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Grasa Visceral
            </span>
            <Heart size={14} color="#ef4444" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>
            Nivel {comp.visceralFat}
          </div>
          <div style={{ fontSize: '10.5px', color: visceralInfo.color, fontWeight: '800' }}>
            {visceralInfo.label} (Salud Órganos)
          </div>
        </div>

        {/* EDAD METABÓLICA */}
        <div style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Edad Metabólica
            </span>
            <Activity size={14} color="#a855f7" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>
            {comp.metabolicAge} años
          </div>
          <div style={{ fontSize: '10.5px', color: comp.metabolicAge <= comp.realAge ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: '800' }}>
            {comp.metabolicAge <= comp.realAge ? `🔥 ${comp.realAge - comp.metabolicAge} años más joven` : `Real: ${comp.realAge} años (+${comp.metabolicAge - comp.realAge})`}
          </div>
        </div>

        {/* METABOLISMO BASAL (BMR) */}
        <div style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Metabolismo Basal
            </span>
            <Flame size={14} color="#eab308" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>
            {comp.bmr} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            Katch-McArdle • Agua: {comp.waterPct}%
          </div>
        </div>

      </div>

      {/* MINI BANNER DE PROYECCIÓN CIENTÍFICA VERDADERA */}
      <div 
        style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '12px 14px',
          color: 'var(--text-main)',
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
            background: 'var(--accent-blue-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-blue)'
          }}>
            <Target size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>
              Fase 1: Reducción Visceral & Definición Prioritaria
            </div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-main)', marginTop: '1px' }}>
              🎯 Meta: {projection.targetWeightKg} kg al {projection.targetFatPct}% grasa • Faltan: <span style={{ color: 'var(--accent-blue)' }}>~{projection.phase1Weeks || projection.projectedWeeks} semanas</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {projection.fatToLoseKg > 0 ? `🔥 -${projection.fatToLoseKg} kg grasa ` : ''}
              {comp.visceralFat >= 9 ? `• ⚠️ Reducción visceral (de nivel ${comp.visceralFat} a < 6) ` : ''}
              • Ritmo seguro (~{projection.weeklyFatLossRateKg} kg/sem)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setShowTimeline(!showTimeline)}
            style={{
              background: showTimeline ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.12)',
              border: '1px solid ' + (showTimeline ? '#38bdf8' : 'rgba(255,255,255,0.2)'),
              color: showTimeline ? '#38bdf8' : '#ffffff',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
          >
            <Calendar size={13} />
            {showTimeline ? 'Ocultar Hoja de Ruta' : '📅 Ver Hoja de Ruta & Hitos'}
            {showTimeline ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

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

      {/* PANEL EXPANDIBLE DE HOJA DE RUTA CIENTÍFICA & HITOS */}
      {showTimeline && (
        <div style={{
          marginTop: '12px',
          padding: '16px',
          background: 'var(--bg-surface-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          animation: 'fadeIn 0.25s ease'
        }}>
          {/* FECHA ESTIMADA DE ALCANCE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'var(--accent-blue-light)',
            borderRadius: '12px',
            border: '1px solid var(--accent-blue)',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--accent-blue)" />
              <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--accent-blue)' }}>
                Fecha Estimada de Alcance Adonis: {targetDate}
              </span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              background: 'var(--accent-blue)',
              color: '#ffffff',
              padding: '3px 9px',
              borderRadius: '20px'
            }}>
              ~{remainingWeeks} semanas restantes ({projection.adherenceRateDays || 4} entrenamientos/sem)
            </span>
          </div>

          {/* GRÁFICA DE PROYECCIÓN SEMANA A SEMANA HACIA EL CUERPO ADONIS */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '14px 16px',
            marginBottom: '14px',
            boxShadow: 'var(--shadow-ios-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingDown size={16} color="var(--accent-blue)" />
                  <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-main)' }}>
                    Curva de Proyección Fisiológica ({currentW} kg ➔ {finalTargetW} kg)
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Descenso progresivo estimado a ~0.4 kg/semana protegiendo masa muscular
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: '800', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0066ff' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0066ff' }}></span> Proyección
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                  <span style={{ width: '8px', height: '2px', background: '#10b981' }}></span> Meta {finalTargetW} kg
                </span>
              </div>
            </div>

            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionChartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" opacity={0.6} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 700 }}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[Math.floor(finalTargetW - 1), Math.ceil(currentW + 1)]}
                    tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    unit="kg"
                  />
                  <Tooltip content={<ProjectionTooltip />} />
                  <ReferenceLine 
                    y={finalTargetW} 
                    stroke="#10b981" 
                    strokeDasharray="4 4" 
                    strokeWidth={2}
                    label={{
                      value: `🎯 Adonis: ${finalTargetW}kg`,
                      position: 'insideBottomRight',
                      fill: '#059669',
                      fontSize: 10,
                      fontWeight: 800
                    }}
                  />
                  <ReferenceLine 
                    y={hito1W} 
                    stroke="#0284c7" 
                    strokeDasharray="2 2" 
                    strokeWidth={1}
                    label={{
                      value: `H1: ${hito1W}kg`,
                      position: 'insideTopLeft',
                      fill: '#0284c7',
                      fontSize: 9,
                      fontWeight: 700
                    }}
                  />
                  <ReferenceLine 
                    y={hito2W} 
                    stroke="#059669" 
                    strokeDasharray="2 2" 
                    strokeWidth={1}
                    label={{
                      value: `H2: ${hito2W}kg`,
                      position: 'insideTopLeft',
                      fill: '#059669',
                      fontSize: 9,
                      fontWeight: 700
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="#0066ff" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#0066ff', stroke: '#ffffff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#0066ff', stroke: '#ffffff', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRID DE HITOS FISIOLÓGICOS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            
            {/* HITO 1 */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '12px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '900',
                  color: 'var(--accent-blue)',
                  background: 'var(--accent-blue-light)',
                  padding: '2px 7px',
                  borderRadius: '6px'
                }}>
                  HITO 1 • SEMANAS 1 - {hito1Weeks}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-main)' }}>
                  {hito1W} kg
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                Desinflamación & Reducción Visceral
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Pérdida de ~{Math.round((currentW - hito1W) * 10) / 10} kg de grasa pura. Bajada de grasa visceral a nivel &le; 8 y optimización de sensibilidad a la insulina.
              </p>
            </div>

            {/* HITO 2 */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '12px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '900',
                  color: 'var(--accent-emerald)',
                  background: 'var(--accent-emerald-subtle)',
                  padding: '2px 7px',
                  borderRadius: '6px'
                }}>
                  HITO 2 • SEMANAS {hito1Weeks + 1} - {hito2Weeks}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-main)' }}>
                  {hito2W} kg
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                Recomposición Atlética
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Grasa visceral en rango saludable (&lt; 6). Grasa corporal cayendo a ~17%. Mayor tono y separación visible en deltoides, pecho y cuádriceps.
              </p>
            </div>

            {/* HITO 3 */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1.5px solid var(--accent-amber)',
              borderRadius: '14px',
              padding: '12px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '900',
                  color: 'var(--accent-amber)',
                  background: 'var(--accent-amber-subtle)',
                  padding: '2px 7px',
                  borderRadius: '6px'
                }}>
                  HITO 3 • SEMANAS {hito2Weeks + 1} - {remainingWeeks}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--accent-amber)' }}>
                  {finalTargetW} kg
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={14} color="var(--accent-amber)" /> Definición Adonis 13-14%
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Grasa visceral de nivel atleta (&le; 4). V-Taper estético consolidado, cintura comprimida y definición muscular nítida con fuerza preservada.
              </p>
            </div>

          </div>

          {/* PRESCRIPCIÓN NUTRICIONAL CIENTÍFICA */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Utensils size={15} color="var(--accent-blue)" />
              <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-main)' }}>
                Prescripción Nutricional Recomposición (Katch-McArdle)
              </span>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b' }}>
              Ajustada a tu masa magra ({comp.fatFreeMassKg || 60} kg) y TDEE estimado ({estimatedTdee} kcal/día) con un déficit moderado seguro (-450 kcal):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>CALORÍAS DIARIAS</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#38bdf8' }}>~{targetCalories} <span style={{ fontSize: '10px' }}>kcal</span></div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Déficit sostenible</div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>PROTEÍNA MAGRA</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#10b981' }}>~{targetProteinG} <span style={{ fontSize: '10px' }}>g</span></div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>2.2g / kg masa magra</div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>GRASAS SALUDABLES</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#f59e0b' }}>~{targetFatG} <span style={{ fontSize: '10px' }}>g</span></div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>25% VCT (hormonal)</div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>CARBOHIDRATOS</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#a855f7' }}>~{targetCarbsG} <span style={{ fontSize: '10px' }}>g</span></div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Glucógeno peri-entreno</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
