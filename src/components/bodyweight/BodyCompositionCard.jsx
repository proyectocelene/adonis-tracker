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
          background: '#0f172a',
          color: '#ffffff',
          padding: '10px 14px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          border: '1.5px solid #38bdf8',
          fontSize: '11px'
        }}>
          <div style={{ color: '#94a3b8', fontWeight: '800', marginBottom: '2px' }}>
            📅 {d.week === 0 ? 'Punto de Partida (Hoy)' : `Semana ${d.week}`} • {d.phase}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#38bdf8' }}>
            {d.peso} kg
          </div>
          {dropFromStart > 0 && (
            <div style={{ color: '#34d399', fontWeight: '800', marginTop: '2px' }}>
              🔥 -{dropFromStart} kg grasa pura acumulada
            </div>
          )}
          <div style={{ color: '#cbd5e1', fontSize: '10px', marginTop: '4px' }}>
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
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1',
          animation: 'fadeIn 0.25s ease'
        }}>
          {/* FECHA ESTIMADA DE ALCANCE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            borderRadius: '12px',
            border: '1px solid #bfdbfe',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#0066ff" />
              <span style={{ fontSize: '13px', fontWeight: '900', color: '#1e3a8a' }}>
                Fecha Estimada de Alcance Adonis: {targetDate}
              </span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              background: '#0066ff',
              color: '#ffffff',
              padding: '3px 9px',
              borderRadius: '20px'
            }}>
              ~{remainingWeeks} semanas restantes ({projection.adherenceRateDays || 4} entrenamientos/sem)
            </span>
          </div>

          {/* GRÁFICA DE PROYECCIÓN SEMANA A SEMANA HACIA EL CUERPO ADONIS */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '14px 16px',
            marginBottom: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingDown size={16} color="#0066ff" />
                  <span style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
                    Curva de Proyección Fisiológica ({currentW} kg ➔ {finalTargetW} kg)
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[Math.floor(finalTargetW - 1), Math.ceil(currentW + 1)]}
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
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
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '900',
                  color: '#0284c7',
                  background: '#e0f2fe',
                  padding: '2px 7px',
                  borderRadius: '6px'
                }}>
                  HITO 1 • SEMANAS 1 - {hito1Weeks}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
                  {hito1W} kg
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                Desinflamación & Reducción Visceral
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                Pérdida de ~{Math.round((currentW - hito1W) * 10) / 10} kg de grasa pura. Bajada de grasa visceral a nivel &le; 8 y optimización de sensibilidad a la insulina.
              </p>
            </div>

            {/* HITO 2 */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '900',
                  color: '#059669',
                  background: '#dcfce7',
                  padding: '2px 7px',
                  borderRadius: '6px'
                }}>
                  HITO 2 • SEMANAS {hito1Weeks + 1} - {hito2Weeks}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
                  {hito2W} kg
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                Recomposición Atlética
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                Grasa visceral en rango saludable (&lt; 6). Grasa corporal cayendo a ~17%. Mayor tono y separación visible en deltoides, pecho y cuádriceps.
              </p>
            </div>

            {/* HITO 3 */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #fed7aa',
              borderRadius: '14px',
              padding: '12px',
              background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '900',
                  color: '#b45309',
                  background: '#fef3c7',
                  padding: '2px 7px',
                  borderRadius: '6px'
                }}>
                  HITO 3 • SEMANAS {hito2Weeks + 1} - {remainingWeeks}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: '#b45309' }}>
                  {finalTargetW} kg
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#78350f', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={14} color="#d97706" /> Definición Adonis 13-14%
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#92400e', lineHeight: '1.4' }}>
                Grasa visceral de nivel atleta (&le; 4). V-Taper estético consolidado, cintura comprimida y definición muscular nítida con fuerza preservada.
              </p>
            </div>

          </div>

          {/* PRESCRIPCIÓN NUTRICIONAL CIENTÍFICA */}
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1.5px solid #e2e8f0',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Utensils size={15} color="#0066ff" />
              <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>
                Prescripción Nutricional Recomposición (Katch-McArdle)
              </span>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b' }}>
              Ajustada a tu masa magra ({comp.fatFreeMassKg || 60} kg) y TDEE estimado ({estimatedTdee} kcal/día) con un déficit moderado seguro (-450 kcal):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>CALORÍAS DIARIAS</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#0066ff' }}>~{targetCalories} <span style={{ fontSize: '10px' }}>kcal</span></div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Déficit sostenible</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>PROTEÍNA MAGRA</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#059669' }}>~{targetProteinG} <span style={{ fontSize: '10px' }}>g</span></div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>2.2g / kg masa magra</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>GRASAS SALUDABLES</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#d97706' }}>~{targetFatG} <span style={{ fontSize: '10px' }}>g</span></div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>25% VCT (hormonal)</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>CARBOHIDRATOS</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#7c3aed' }}>~{targetCarbsG} <span style={{ fontSize: '10px' }}>g</span></div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Glucógeno peri-entreno</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
