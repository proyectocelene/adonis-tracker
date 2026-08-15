import React, { useState, useMemo } from 'react';
import { useIndexedDB as useLocalStorage } from '../hooks/useIndexedDB';
import { Scale } from 'lucide-react';
import { useModal } from './common/UIComponents';
import GymMembershipReminder from './common/GymMembershipReminder';
import { TIME_FRAMES } from './bodyweight/constants';
import WeightMetricsSummary from './bodyweight/WeightMetricsSummary';
import WeightEntryModal from './bodyweight/WeightEntryModal';
import WeightChartSection from './bodyweight/WeightChartSection';
import WeightHistoryList from './bodyweight/WeightHistoryList';

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

    const firstTime = filteredData[0]?.timestampNum || Date.now();
    const lastTime = filteredData[filteredData.length - 1]?.timestampNum || Date.now();
    const elapsedDays = Math.max(1, (lastTime - firstTime) / (1000 * 60 * 60 * 24));
    const elapsedWeeks = Math.max(0.2, elapsedDays / 7);
    const weeklyRate = parseFloat((diff / elapsedWeeks).toFixed(2));
    const weeklyRatePercent = start > 0 ? parseFloat(((weeklyRate / start) * 100).toFixed(2)) : 0;

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

      {/* 2. DIAGNÓSTICO Y KPIS */}
      <WeightMetricsSummary
        stats={stats}
        preferredUnit={preferredUnit}
        selectedTimeframe={selectedTimeframe}
      />

      {/* 4. GRÁFICA INTERACTIVA */}
      <WeightChartSection
        chartData={chartData}
        stats={stats}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
      />

      {/* 5. FORMULARIO MODAL DE NUEVO PESAJE / EDICIÓN */}
      <WeightEntryModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        editingEntryId={editingEntryId}
        formWeight={formWeight}
        setFormWeight={setFormWeight}
        formUnit={formUnit}
        setFormUnit={setFormUnit}
        formDate={formDate}
        setFormDate={setFormDate}
        formTime={formTime}
        setFormTime={setFormTime}
        formMoment={formMoment}
        setFormMoment={setFormMoment}
        formComment={formComment}
        setFormComment={setFormComment}
        handleSaveWeight={handleSaveWeight}
        resetForm={resetForm}
      />

      {/* 6. HISTORIAL Y BITÁCORA */}
      <WeightHistoryList
        bodyMetrics={bodyMetrics}
        preferredUnit={preferredUnit}
        handleStartEdit={handleStartEdit}
        handleDelete={handleDelete}
      />

    </div>
  );
}
