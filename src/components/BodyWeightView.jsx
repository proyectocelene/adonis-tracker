import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine 
} from 'recharts';
import { useIndexedDB as useLocalStorage } from '../hooks/useIndexedDB';
import { 
  Scale, Plus, Trash2, Calendar, Activity, Clock, MessageSquare, 
  TrendingDown, TrendingUp, Sparkles, Filter, ChevronDown, ChevronUp, 
  Sun, Moon, Dumbbell, Coffee, Edit3, X, Check, ArrowRight 
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
  { id: 'ayunas', label: '🌅 Ayunas (Mañana)', icon: Sun },
  { id: 'pre_entreno', label: '⚡ Pre-Entreno', icon: Coffee },
  { id: 'post_entreno', label: '🏋️ Post-Entreno', icon: Dumbbell },
  { id: 'noche', label: '🌙 Noche', icon: Moon },
  { id: 'general', label: '📌 General', icon: Scale }
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

  // Normalizar y ordenar todos los registros cronológicamente ascendente para gráficos
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
      // Si hoy no hay datos, mostrar las últimas 24 horas
      if (todayData.length > 0) return todayData;
      const twentyFourHoursAgo = nowTime - (24 * 60 * 60 * 1000);
      return normalizedHistoryAsc.filter(item => item.timestampNum >= twentyFourHoursAgo);
    }

    const cutoffTime = nowTime - (timeframeObj.days * 24 * 60 * 60 * 1000);
    const result = normalizedHistoryAsc.filter(item => item.timestampNum >= cutoffTime);
    return result.length > 0 ? result : normalizedHistoryAsc.slice(-10); // Fallback
  }, [normalizedHistoryAsc, selectedTimeframe]);

  // Calcular métricas analíticas del rango
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
    const diffPercent = start > 0 ? ((diff / start) * 100).toFixed(1) : 0;

    return {
      current,
      start,
      min,
      max,
      diff,
      diffPercent,
      average,
      count: filteredData.length
    };
  }, [filteredData]);

  // Datos para Recharts con Promedio Móvil (Rolling Average)
  const chartData = useMemo(() => {
    return filteredData.map((item, idx, arr) => {
      // Calcular promedio móvil de los últimos 3 a 7 puntos para suavizar
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
        <div style={{ background: '#0f172a', color: '#fff', padding: '12px 14px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '180px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>📅 {data.date}</span>
            <span>⏰ {data.time}</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#38bdf8', margin: '4px 0' }}>
            {data.peso} <span style={{ fontSize: '12px', color: '#94a3b8' }}>{data.unit}</span>
          </div>
          <div style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '8px', display: 'inline-block', marginBottom: '6px', fontWeight: '700' }}>
            {momentObj.label}
          </div>
          {data.comment && (
            <div style={{ fontSize: '11px', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px', marginTop: '4px', fontStyle: 'italic' }}>
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
            Monitorea fluctuaciones de peso, hidratación y tendencia de grasa/músculo.
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

      {/* 3. TARJETAS KPI DE ANÁLISIS EN EL PERIODO SELECCIONADO */}
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

      {/* 4. SELECTOR DE RANGO TEMPORAL (DÍA, SEMANA, 2 SEM, MES, 3 MESES, AÑO, TODO) */}
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

      {/* 5. GRÁFICA INTERACTIVA RECHARTS CON TENDENCIA Y PROMEDIO */}
      <div className="card" style={{ padding: '16px', borderRadius: '22px', background: '#ffffff', border: '1.5px solid #e2e8f0', marginBottom: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={18} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>
              Curva de Peso & Tendencia ({chartData.length} registros)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: '800' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0066ff' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0066ff' }}></span> Peso
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9333ea' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9333ea' }}></span> Tendencia
            </span>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: '240px' }}>
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
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#0066ff" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0066ff', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 7 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="promedioMovil" 
                  stroke="#9333ea" 
                  strokeWidth={2} 
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

      {/* 6. BOTÓN PARA ABRIR FORMULARIO DE NUEVO PESAJE / EDICIÓN */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary animate-fade"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '20px',
            fontWeight: '900',
            fontSize: '15px',
            marginBottom: '24px',
            boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Plus size={20} /> + Registrar Nuevo Peso
        </button>
      ) : (
        <form 
          onSubmit={handleSaveWeight} 
          className="card animate-fade" 
          style={{ padding: '20px', borderRadius: '24px', background: '#eff6ff', border: '2px solid #93c5fd', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0,102,255,0.12)' }}
        >
          <div className="flex-between" style={{ marginBottom: '14px' }}>
            <strong style={{ fontSize: '15px', color: '#1e3a8a', fontWeight: '900' }}>
              {editingEntryId ? '✏️ Editar Registro de Peso' : '⚖️ Registrar Nuevo Pesaje'}
            </strong>
            <button
              type="button"
              onClick={resetForm}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Fila 1: Peso y Unidad */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e3a8a', marginBottom: '4px' }}>
                Peso
              </label>
              <input 
                type="number"
                step="0.05"
                value={formWeight}
                onChange={e => setFormWeight(e.target.value)}
                placeholder="Ej. 78.5"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #93c5fd', fontSize: '20px', fontWeight: '900', color: '#0f172a', textAlign: 'center' }}
                required
                autoFocus
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e3a8a', marginBottom: '4px' }}>
                Unidad
              </label>
              <select
                value={formUnit}
                onChange={e => setFormUnit(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #93c5fd', fontSize: '16px', fontWeight: '800', color: '#0f172a', background: '#ffffff' }}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>

          {/* Fila 2: Fecha y Hora */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e3a8a', marginBottom: '4px' }}>
                Fecha
              </label>
              <input 
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '700' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e3a8a', marginBottom: '4px' }}>
                Hora
              </label>
              <input 
                type="time"
                value={formTime}
                onChange={e => setFormTime(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '700' }}
                required
              />
            </div>
          </div>

          {/* Fila 3: Momento del Día (Chips) */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e3a8a', marginBottom: '6px' }}>
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
                      padding: '6px 10px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #0066ff' : '1px solid #bfdbfe',
                      background: isSelected ? '#0066ff' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#1e3a8a',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fila 4: Comentario / Notas */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e3a8a', marginBottom: '4px' }}>
              Comentario / Estado (Opcional)
            </label>
            <input 
              type="text"
              value={formComment}
              onChange={e => setFormComment(e.target.value)}
              placeholder="Ej. Comí sushi anoche (retención), Ayuno 14h, Post-sauna..."
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '600' }}
            />
          </div>

          {/* Botones Acción */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-outline"
              style={{ flex: 1, padding: '12px', borderRadius: '14px' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, padding: '12px', borderRadius: '14px', fontWeight: '900' }}
            >
              {editingEntryId ? 'Guardar Cambios' : 'Guardar Pesaje'}
            </button>
          </div>
        </form>
      )}

      {/* 7. BITÁCORA HISTÓRICA DETALLADA DE PESAJES */}
      <div>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={18} color="#0066ff" /> Bitácora Detallada de Pesajes ({bodyMetrics?.length || 0})
          </h3>
        </div>

        {bodyMetrics && bodyMetrics.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {bodyMetrics.map((item) => {
              const momentObj = MOMENTS.find(m => m.id === item.moment) || MOMENTS[4];
              return (
                <div 
                  key={item.id} 
                  className="card flex-between animate-fade" 
                  style={{ padding: '14px 16px', borderRadius: '18px', background: '#ffffff', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
                        {item.weight} <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>{item.unit || preferredUnit}</span>
                      </strong>
                      <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '10px', fontWeight: '800', border: '1px solid #bfdbfe' }}>
                        {momentObj.label}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span>📅 {item.dateString || item.date}</span>
                      {item.time && <span>⏰ {item.time}</span>}
                    </div>

                    {item.comment && (
                      <div style={{ fontSize: '11px', color: '#334155', marginTop: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', display: 'inline-block', fontStyle: 'italic', border: '1px solid #e2e8f0' }}>
                        💬 {item.comment}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button 
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      title="Editar registro"
                      style={{ background: '#f1f5f9', border: 'none', color: '#0066ff', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      title="Eliminar registro"
                      style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', borderRadius: '20px' }}>
            <Scale size={40} color="#cbd5e1" style={{ margin: '0 auto 10px auto' }} />
            <strong style={{ fontSize: '14px', color: '#475569', display: 'block' }}>Aún no hay registros de peso</strong>
            <span style={{ fontSize: '12px' }}>Toca el botón superior para registrar tu primer pesaje con hora y momento del día.</span>
          </div>
        )}
      </div>

    </div>
  );
}
