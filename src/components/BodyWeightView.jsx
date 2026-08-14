import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, ReferenceArea 
} from 'recharts';
import { useIndexedDB as useLocalStorage } from '../hooks/useIndexedDB';
import { 
  Scale, Plus, Trash2, Calendar, Activity, Clock, MessageSquare, 
  TrendingDown, TrendingUp, Sparkles, Filter, ChevronDown, ChevronUp, 
  Sun, Moon, Dumbbell, Coffee, Edit3, X, Check, ArrowRight, ShieldCheck, Zap, Info 
} from 'lucide-react';
import { useModal } from './common/UIComponents';
import GymMembershipReminder from './common/GymMembershipReminder';

const TIME_FRAMES = [
  { id: 'day', label: 'Hoy (Día)', days: 1 },
  { id: '1w', label: '1 Sem', days: 7 },
  { id: '2w', label: '2 Sem', days: 14 },
  { id: '1m', label: '1 Mes', days: 30 },
  { id: '3m', label: '3 Meses', days: 90 },
  { id: '1y', label: '1 Año', days: 365 },
  { id: 'all', label: 'Todo', days: 9999 }
];

const MOMENTS = [
  { id: 'ayunas', label: '🌅 Ayunas (Mañana)', icon: Sun, color: '#f59e0b', isStandard: true },
  { id: 'pre_entreno', label: '⚡ Pre-Entreno', icon: Coffee, color: '#3b82f6', isStandard: false },
  { id: 'post_entreno', label: '🏋️ Post-Entreno', icon: Dumbbell, color: '#10b981', isStandard: false },
  { id: 'noche', label: '🌙 Noche', icon: Moon, color: '#6366f1', isStandard: false },
  { id: 'general', label: '📌 General', icon: Scale, color: '#64748b', isStandard: false }
];

export default function BodyWeightView() {
  const [bodyMetrics, setBodyMetrics] = useLocalStorage('coachv2_body_metrics_history', []);
  const [preferredUnit, setPreferredUnit] = useLocalStorage('coachv2_weight_preferred_unit', 'kg');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);

  // Form State
  const now = new Date();
  const defaultDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const defaultTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [formWeight, setFormWeight] = useState('');
  const [formDate, setFormDate] = useState(defaultDateStr);
  const [formTime, setFormTime] = useState(defaultTimeStr);
  const [formMoment, setFormMoment] = useState('ayunas');
  const [formComment, setFormComment] = useState('');
  const [formUnit, setFormUnit] = useState(preferredUnit);

  const modal = useModal();

  // Reset Form
  const resetForm = () => {
    const freshDate = new Date();
    setFormWeight('');
    setFormDate(`${freshDate.getFullYear()}-${String(freshDate.getMonth() + 1).padStart(2, '0')}-${String(freshDate.getDate()).padStart(2, '0')}`);
    setFormTime(`${String(freshDate.getHours()).padStart(2, '0')}:${String(freshDate.getMinutes()).padStart(2, '0')}`);
    setFormMoment('ayunas');
    setFormComment('');
    setFormUnit(preferredUnit);
    setEditingEntryId(null);
    setShowAddForm(false);
  };

  // Open Edit Form
  const handleStartEdit = (entry) => {
    setEditingEntryId(entry.id);
    setFormWeight(entry.weight.toString());
    setFormDate(entry.date || entry.dateString || defaultDateStr);
    setFormTime(entry.time || '12:00');
    setFormMoment(entry.moment || 'general');
    setFormComment(entry.comment || '');
    setFormUnit(entry.unit || preferredUnit);
    setShowAddForm(true);
  };

  // Handle Submit Form
  const handleSaveWeight = (e) => {
    e.preventDefault();
    const parsedWeight = parseFloat(formWeight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      modal.showAlert({ title: "Peso inválido", message: "Por favor ingresa un peso numérico válido.", variant: "warning" });
      return;
    }

    const timestamp = new Date(`${formDate}T${formTime}:00`).toISOString();
    const dateFormatted = new Date(`${formDate}T${formTime}:00`).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    const entryData = {
      id: editingEntryId || Date.now(),
      weight: parsedWeight,
      unit: formUnit,
      date: formDate,
      time: formTime,
      dateString: dateFormatted,
      timestamp,
      moment: formMoment,
      comment: formComment.trim()
    };

    setBodyMetrics(prev => {
      const currentList = Array.isArray(prev) ? prev : [];
      let updated;
      if (editingEntryId) {
        updated = currentList.map(item => item.id === editingEntryId ? entryData : item);
      } else {
        updated = [entryData, ...currentList];
      }
      // Ordenar cronológicamente descendente
      return updated.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.date || a.id).getTime();
        const timeB = new Date(b.timestamp || b.date || b.id).getTime();
        return timeB - timeA;
      });
    });

    modal.showAlert({
      title: editingEntryId ? "✅ Registro Actualizado" : "✅ Peso Registrado",
      message: `${entryData.weight} ${entryData.unit} guardado (${entryData.date} a las ${entryData.time}).`,
      variant: "success"
    });

    resetForm();
  };

  const handleDelete = (id) => {
    modal.showConfirm({
      title: "¿Eliminar Registro?",
      message: "Este pesaje se borrará permanentemente de tu historial.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "warning",
      onConfirm: () => {
        setBodyMetrics(prev => prev.filter(item => item.id !== id));
      }
    });
  };

  // Normalizar y ordenar todos los registros cronológicamente ascendente para análisis
  const normalizedHistoryAsc = useMemo(() => {
    if (!bodyMetrics || !Array.isArray(bodyMetrics)) return [];
    return [...bodyMetrics]
      .map(item => {
        let weightInPreferred = item.weight;
        // Convertir si la unidad no coincide
        if (item.unit && item.unit !== preferredUnit) {
          if (preferredUnit === 'kg' && item.unit === 'lbs') weightInPreferred = (item.weight / 2.20462);
          if (preferredUnit === 'lbs' && item.unit === 'kg') weightInPreferred = (item.weight * 2.20462);
        }
        const timeObj = new Date(item.timestamp || `${item.date || '2026-01-01'}T${item.time || '12:00'}:00`);
        return {
          ...item,
          convertedWeight: parseFloat(weightInPreferred.toFixed(2)),
          timestampNum: timeObj.getTime(),
          timeLabel: item.time || timeObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          displayDate: item.dateString || item.date
        };
      })
      .sort((a, b) => a.timestampNum - b.timestampNum);
  }, [bodyMetrics, preferredUnit]);

  // Filtrar según el Timeframe seleccionado
  const filteredData = useMemo(() => {
    if (normalizedHistoryAsc.length === 0) return [];
    if (selectedTimeframe === 'all') return normalizedHistoryAsc;

    const nowTime = new Date().getTime();
    const timeframeObj = TIME_FRAMES.find(tf => tf.id === selectedTimeframe) || TIME_FRAMES[3];

    if (selectedTimeframe === 'day') {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayData = normalizedHistoryAsc.filter(item => (item.date === todayStr) || (item.timestamp && item.timestamp.startsWith(todayStr)));
      if (todayData.length > 0) return todayData;
      const twentyFourHoursAgo = nowTime - (24 * 60 * 60 * 1000);
      return normalizedHistoryAsc.filter(item => item.timestampNum >= twentyFourHoursAgo);
    }

    const cutoffTime = nowTime - (timeframeObj.days * 24 * 60 * 60 * 1000);
    const result = normalizedHistoryAsc.filter(item => item.timestampNum >= cutoffTime);
    return result.length > 0 ? result : normalizedHistoryAsc.slice(-10);
  }, [normalizedHistoryAsc, selectedTimeframe]);

  // Métricas analíticas científicas avanzadas
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        current: '--',
        start: '--',
        min: '--',
        max: '--',
        diff: 0,
        diffPercent: 0,
        average: 0,
        weeklyRate: 0,
        weeklyRatePercent: 0,
        diagnostic: 'Sin datos suficientes',
        diagColor: '#64748b',
        count: 0
      };
    }

    const weights = filteredData.map(d => d.convertedWeight);
    const current = weights[weights.length - 1];
    const start = weights[0];
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const sum = weights.reduce((acc, w) => acc + w, 0);
    const average = parseFloat((sum / weights.length).toFixed(2));
    const diff = parseFloat((current - start).toFixed(2));
    const diffPercent = start > 0 ? parseFloat(((diff / start) * 100).toFixed(1)) : 0;

    // Calcular velocidad de cambio semanal real (Tasa Semanal)
    const firstTime = filteredData[0]?.timestampNum || Date.now();
    const lastTime = filteredData[filteredData.length - 1]?.timestampNum || Date.now();
    const elapsedDays = Math.max(1, (lastTime - firstTime) / (1000 * 60 * 60 * 24));
    const elapsedWeeks = Math.max(0.2, elapsedDays / 7);
    const weeklyRate = parseFloat((diff / elapsedWeeks).toFixed(2));
    const weeklyRatePercent = start > 0 ? parseFloat(((weeklyRate / start) * 100).toFixed(2)) : 0;

    // Diagnóstico científico de tendencia
    let diagnostic = "⚖️ Mantenimiento / Estabilidad Fisiológica";
    let diagColor = "#0284c7";
    if (weeklyRatePercent > 0.5) {
      diagnostic = "⚡ Superávit Energético Rápido (Posible ganancia de agua/glucógeno)";
      diagColor = "#d97706";
    } else if (weeklyRatePercent > 0.15) {
      diagnostic = "💪 Hipertrofia / Volumen Limpio Óptimo (+0.25% a +0.50% peso/sem)";
      diagColor = "#059669";
    } else if (weeklyRatePercent < -1.0) {
      diagnostic = "⚠️ Déficit Muy Agresivo (Riesgo de catabolismo muscular)";
      diagColor = "#dc2626";
    } else if (weeklyRatePercent < -0.2) {
      diagnostic = "🔥 Definición / Pérdida de Grasa Óptima (-0.5% a -1.0% peso/sem)";
      diagColor = "#16a34a";
    }

    return {
      current,
      start,
      min,
      max,
      diff,
      diffPercent,
      average,
      weeklyRate,
      weeklyRatePercent,
      diagnostic,
      diagColor,
      count: filteredData.length
    };
  }, [filteredData]);

  // Datos para Recharts con Media Móvil Científica (SMA-5/7)
  const chartData = useMemo(() => {
    return filteredData.map((item, idx, arr) => {
      const windowSlice = arr.slice(Math.max(0, idx - 4), idx + 1);
      const movingAvg = parseFloat((windowSlice.reduce((s, x) => s + x.convertedWeight, 0) / windowSlice.length).toFixed(2));

      return {
        id: item.id,
        peso: item.convertedWeight,
        promedioMovil: movingAvg,
        label: selectedTimeframe === 'day' ? item.timeLabel : `${item.displayDate.split(',')[0]} ${item.timeLabel || ''}`,
        date: item.displayDate,
        time: item.timeLabel,
        moment: item.moment,
        isFasting: item.moment === 'ayunas',
        comment: item.comment,
        unit: preferredUnit
      };
    });
  }, [filteredData, selectedTimeframe, preferredUnit]);

  // Tooltip personalizado para Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const momentObj = MOMENTS.find(m => m.id === data.moment) || MOMENTS[4];
      return (
        <div style={{ background: '#0f172a', color: '#fff', padding: '12px 14px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '1.5px solid rgba(56,189,248,0.3)', minWidth: '190px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>📅 {data.date}</span>
            <span>⏰ {data.time}</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', margin: '4px 0' }}>
            {data.peso} <span style={{ fontSize: '13px', color: '#94a3b8' }}>{data.unit}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', background: data.isFasting ? '#f59e0b' : 'rgba(255,255,255,0.15)', color: data.isFasting ? '#000' : '#fff', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
              {momentObj.label}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#a78bfa', fontWeight: '700' }}>
            Tendencia (Media Móvil): <strong>{data.promedioMovil} {data.unit}</strong>
          </div>
          {data.comment && (
            <div style={{ fontSize: '11px', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px', marginTop: '6px', fontStyle: 'italic' }}>
              💬 "{data.comment}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container animate-fade" style={{ paddingBottom: '110px' }}>
      
      {/* 1. ENCABEZADO Y SELECTOR DE UNIDAD */}
      <div className="flex-between" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 2px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={28} color="#0066ff" /> Composición Corporal
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '13px', fontWeight: '600' }}>
            Monitoreo científico de peso, retención hídrica y velocidad de cambio.
          </p>
        </div>

        {/* Toggle de Unidad (kg vs lbs) */}
        <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '12px', padding: '3px' }}>
          <button
            type="button"
            onClick={() => setPreferredUnit('kg')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '9px',
              background: preferredUnit === 'kg' ? '#ffffff' : 'transparent',
              color: preferredUnit === 'kg' ? '#0066ff' : '#64748b',
              fontWeight: '900',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: preferredUnit === 'kg' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            kg
          </button>
          <button
            type="button"
            onClick={() => setPreferredUnit('lbs')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '9px',
              background: preferredUnit === 'lbs' ? '#ffffff' : 'transparent',
              color: preferredUnit === 'lbs' ? '#0066ff' : '#64748b',
              fontWeight: '900',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: preferredUnit === 'lbs' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            lbs
          </button>
        </div>
      </div>

      {/* 2. RECORDATORIO INTELIGENTE DE MEMBRESÍA DEL GYM (DÍA 28) */}
      <GymMembershipReminder />

      {/* 3. TARJETA DE DIAGNÓSTICO CIENTÍFICO DE TASA DE CAMBIO */}
      {stats.count > 1 && (
        <div 
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
            border: '1.5px solid #bfdbfe',
            padding: '12px 14px',
            borderRadius: '18px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#0066ff" />
            <div>
              <span style={{ fontSize: '10px', color: '#1e40af', fontWeight: '900', textTransform: 'uppercase', display: 'block' }}>
                Velocidad de Progreso Semanal
              </span>
              <strong style={{ fontSize: '13px', color: '#0f172a', fontWeight: '900' }}>
                {stats.weeklyRate > 0 ? `+${stats.weeklyRate}` : stats.weeklyRate} {preferredUnit}/sem ({stats.weeklyRatePercent > 0 ? `+${stats.weeklyRatePercent}` : stats.weeklyRatePercent}%)
              </strong>
              <span style={{ fontSize: '11px', color: stats.diagColor, fontWeight: '800', display: 'block', marginTop: '2px' }}>
                {stats.diagnostic}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. TARJETAS KPI DE ANÁLISIS EN EL PERIODO SELECCIONADO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div className="card" style={{ padding: '14px 12px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Actual</span>
          <div style={{ fontSize: '20px', fontWeight: '900', marginTop: '2px', color: '#38bdf8' }}>
            {stats.current} <span style={{ fontSize: '11px', color: '#94a3b8' }}>{preferredUnit}</span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Cambio ({selectedTimeframe})</span>
          <div style={{ fontSize: '18px', fontWeight: '900', marginTop: '2px', color: stats.diff < 0 ? '#059669' : (stats.diff > 0 ? '#d97706' : '#64748b') }}>
            {stats.diff > 0 ? '+' : ''}{stats.diff} <span style={{ fontSize: '10px', fontWeight: '700' }}>{preferredUnit}</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '800', color: stats.diff < 0 ? '#059669' : '#d97706' }}>
            ({stats.diffPercent}%)
          </span>
        </div>

        <div className="card" style={{ padding: '14px 12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>Rango (Min - Max)</span>
          <div style={{ fontSize: '14px', fontWeight: '900', marginTop: '4px', color: '#334155' }}>
            {stats.min} - {stats.max}
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>
            Prom: {stats.average}
          </span>
        </div>
      </div>

      {/* 5. SELECTOR DE RANGO TEMPORAL */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px', scrollbarWidth: 'none' }}>
        {TIME_FRAMES.map(tf => {
          const isSelected = selectedTimeframe === tf.id;
          return (
            <button
              key={tf.id}
              type="button"
              onClick={() => setSelectedTimeframe(tf.id)}
              style={{
                flex: '0 0 auto',
                padding: '8px 14px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #0066ff' : '1px solid #cbd5e1',
                background: isSelected ? '#0066ff' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 4px 10px rgba(0,102,255,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tf.label}
            </button>
          );
        })}
      </div>

      {/* 6. GRÁFICA CIENTÍFICA RECHARTS CON TENDENCIA Y PUNTOS DE AYUNAS */}
      <div className="card" style={{ padding: '16px', borderRadius: '22px', background: '#ffffff', border: '1.5px solid #e2e8f0', marginBottom: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
        <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={18} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>
              Curva de Peso & Tendencia ({chartData.length} registros)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: '800', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0066ff' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0066ff' }}></span> Peso Real
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9333ea' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9333ea' }}></span> Tendencia (Media Móvil)
            </span>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {stats.average > 0 && (
                  <ReferenceLine y={stats.average} stroke="#cbd5e1" strokeDasharray="3 3" />
                )}
                {/* Línea de Peso Real */}
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#0066ff" 
                  strokeWidth={2.5} 
                  dot={({ cx, cy, payload }) => {
                    const isFasting = payload.isFasting;
                    return (
                      <circle
                        key={payload.id}
                        cx={cx}
                        cy={cy}
                        r={isFasting ? 5 : 3.5}
                        fill={isFasting ? '#f59e0b' : '#0066ff'}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{ r: 7 }} 
                />
                {/* Línea de Tendencia / Media Móvil Suavizada */}
                <Line 
                  type="monotone" 
                  dataKey="promedioMovil" 
                  stroke="#9333ea" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8', fontSize: '13px' }}>
            No hay registros de peso en el periodo seleccionado ({selectedTimeframe}).
          </div>
        )}
      </div>

      {/* 7. BOTÓN PARA ABRIR FORMULARIO DE NUEVO PESAJE / EDICIÓN */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '14px',
            borderRadius: '18px',
            fontSize: '14px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px rgba(0, 102, 255, 0.3)',
            marginBottom: '20px'
          }}
        >
          <Plus size={18} /> Registrar Nuevo Pesaje
        </button>
      ) : (
        /* FORMULARIO DE PESAJE ENRIQUECIDO */
        <div className="card animate-fade" style={{ padding: '18px', borderRadius: '22px', background: '#ffffff', border: '2px solid #0066ff', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0, 102, 255, 0.1)' }}>
          <div className="flex-between" style={{ marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={18} color="#0066ff" /> {editingEntryId ? 'Editar Pesaje' : 'Nuevo Pesaje'}
            </h3>
            <button type="button" onClick={resetForm} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} color="#64748b" />
            </button>
          </div>

          <form onSubmit={handleSaveWeight}>
            {/* INPUT DE PESO Y UNIDAD */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Peso Corporal
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="ej. 78.5"
                  value={formWeight}
                  onChange={(e) => setFormWeight(e.target.value)}
                  autoFocus
                  required
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '18px',
                    fontWeight: '900',
                    color: '#0f172a',
                    background: '#f8fafc'
                  }}
                />
                <select
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  style={{
                    width: '80px',
                    padding: '12px 8px',
                    borderRadius: '14px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: '900',
                    color: '#0f172a',
                    background: '#f8fafc',
                    cursor: 'pointer'
                  }}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            {/* FECHA Y HORA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Fecha
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '800',
                    background: '#f8fafc'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Hora
                </label>
                <input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '800',
                    background: '#f8fafc'
                  }}
                />
              </div>
            </div>

            {/* CHIPS DE MOMENTO DEL DÍA */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Momento del Día
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {MOMENTS.map(m => {
                  const isSelected = formMoment === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormMoment(m.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #0066ff' : '1px solid #cbd5e1',
                        background: isSelected ? '#eff6ff' : '#f8fafc',
                        color: isSelected ? '#0066ff' : '#475569',
                        fontSize: '11px',
                        fontWeight: '900',
                        cursor: 'pointer'
                      }}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMENTARIO / ESTADO */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Nota / Estado Fisiológico (Opcional)
              </label>
              <input
                type="text"
                placeholder="ej. Ayuno 14h, post sauna, alta ingesta de sodio anoche..."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: '#f8fafc'
                }}
              />
            </div>

            {/* BOTONES DE GUARDAR Y CANCELAR */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)'
                }}
              >
                {editingEntryId ? 'Guardar Cambios' : 'Guardar Pesaje'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8. HISTORIAL / BITÁCORA DETALLADA */}
      <div className="card" style={{ padding: '16px', borderRadius: '22px', background: '#ffffff', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={18} color="#0066ff" /> Bitácora de Pesajes ({bodyMetrics.length})
        </h3>

        {bodyMetrics.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {bodyMetrics.map(entry => {
              const momentObj = MOMENTS.find(m => m.id === entry.moment) || MOMENTS[4];
              return (
                <div 
                  key={entry.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
                        {entry.weight} {entry.unit || preferredUnit}
                      </strong>
                      <span style={{ fontSize: '10px', background: entry.moment === 'ayunas' ? '#fef3c7' : '#eff6ff', color: entry.moment === 'ayunas' ? '#b45309' : '#1d4ed8', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                        {momentObj.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      📅 {entry.dateString || entry.date} {entry.time ? `• ⏰ ${entry.time}` : ''}
                    </div>
                    {entry.comment && (
                      <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic', marginTop: '2px' }}>
                        💬 {entry.comment}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(entry)}
                      title="Editar registro"
                      style={{ background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      title="Eliminar registro"
                      style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: '13px' }}>
            Aún no has registrado ningún pesaje. ¡Haz clic en "Registrar Nuevo Pesaje" para comenzar!
          </div>
        )}
      </div>

    </div>
  );
}
