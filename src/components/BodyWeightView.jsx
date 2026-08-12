import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useIndexedDB as useLocalStorage } from '../hooks/useIndexedDB';
import { Scale, Plus, Trash2, Calendar, Activity } from 'lucide-react';
import { useModal } from './common/UIComponents';

const BodyWeightView = () => {
  const [bodyMetrics, setBodyMetrics] = useLocalStorage('coachv2_body_metrics_history', []);
  const [newWeight, setNewWeight] = useState('');
  const modal = useModal();

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (!newWeight || isNaN(newWeight)) return;

    const dateStr = new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });
    const newEntry = {
      id: Date.now(),
      weight: parseFloat(newWeight),
      date: new Date().toISOString(),
      dateString: dateStr
    };

    setBodyMetrics(prev => {
      const filtered = (prev || []).filter(item => item.dateString !== dateStr);
      return [newEntry, ...filtered].sort((a, b) => b.id - a.id);
    });
    setNewWeight('');
    
    modal.showAlert({
      title: "✅ Peso Registrado",
      message: `Has registrado ${newEntry.weight} kg exitosamente.`,
      variant: "success"
    });
  };

  const handleDelete = (id) => {
    modal.showConfirm({
      title: "¿Eliminar Registro?",
      message: "Este registro de peso se eliminará permanentemente.",
      onConfirm: () => {
        setBodyMetrics(prev => prev.filter(item => item.id !== id));
      }
    });
  };

  // Prepare data for chart (reverse to chronological order)
  const chartData = [...(bodyMetrics || [])].sort((a, b) => a.id - b.id).map(item => ({
    date: item.dateString,
    peso: item.weight
  }));

  const currentWeight = bodyMetrics?.length > 0 ? bodyMetrics[0].weight : '--';
  const startWeight = bodyMetrics?.length > 0 ? bodyMetrics[bodyMetrics.length - 1].weight : '--';
  const diff = bodyMetrics?.length > 1 ? (currentWeight - startWeight).toFixed(1) : 0;

  return (
    <div className="container animate-fade" style={{ paddingBottom: '100px' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={28} color="#0066ff" /> Composición Corporal
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Tu peso actual: <strong style={{ color: '#0f172a' }}>{currentWeight} kg</strong></p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
          <span style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Cambio Total</span>
          <div style={{ fontSize: '24px', fontWeight: '900' }}>
            {diff > 0 ? '+' : ''}{diff} <span style={{ fontSize: '14px', fontWeight: '500' }}>kg</span>
          </div>
        </div>
        <div className="card" style={{ padding: '16px', background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Total Registros</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>
            {bodyMetrics?.length || 0}
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleAddWeight} className="card" style={{ padding: '16px', marginBottom: '24px', background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e3a8a', marginBottom: '10px' }}>
          Registrar Peso de Hoy (kg)
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="number"
            step="0.1"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            placeholder="Ej. 75.5"
            style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid #93c5fd', fontSize: '18px', fontWeight: '800', outline: 'none', textAlign: 'center' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
            <Plus size={20} /> Guardar Registro
          </button>
        </div>
      </form>

      {/* Gráfica */}
      {chartData.length > 1 && (
        <div className="card" style={{ padding: '16px', marginBottom: '24px', height: '250px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 16px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} color="#0066ff" /> Tendencia de Peso
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: '700', color: '#64748b' }}
                itemStyle={{ fontWeight: '900', color: '#0066ff' }}
              />
              <Line type="monotone" dataKey="peso" stroke="#0066ff" strokeWidth={4} dot={{ r: 4, fill: '#0066ff', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Historial */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 16px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={18} color="#64748b" /> Historial de Registros
        </h3>
        {bodyMetrics && bodyMetrics.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bodyMetrics.map((item) => (
              <div key={item.id} className="card flex-between" style={{ padding: '16px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>{item.weight} <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>kg</span></div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{item.dateString}</div>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '8px', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            No hay registros de peso.
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyWeightView;
