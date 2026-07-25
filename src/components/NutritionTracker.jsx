import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Droplet, Award, RefreshCw, Plus } from 'lucide-react';

export default function NutritionTracker() {
  const [nutrition, setNutrition] = useLocalStorage('coachv2_nutrition_data', {
    protein: 0,
    water: 0
  });

  const [tempProtein, setTempProtein] = useState('');

  const addProtein = (amount) => {
    setNutrition(prev => ({ ...prev, protein: Math.min(300, prev.protein + amount) }));
  };

  const addWater = () => {
    setNutrition(prev => ({ ...prev, water: prev.water + 1 }));
  };

  const resetDaily = () => {
    if(confirm("¿Estás seguro de reiniciar los contadores proteicos y de hidratación de hoy?")) {
      setNutrition({ protein: 0, water: 0 });
    }
  };

  const handleCustomProteinAdd = () => {
    const val = parseInt(tempProtein);
    if (!isNaN(val) && val > 0) {
      addProtein(val);
      setTempProtein('');
    }
  };

  const proteinPercentage = Math.min(100, Math.round((nutrition.protein / 160) * 100));

  return (
    <div className="container">
      <div className="flex-between card" style={{ padding: '14px', marginBottom: '14px' }}>
        <div>
          <span className="badge badge-blue">Nutrición & Síntesis</span>
          <h1 style={{ marginTop: '3px', fontSize: '18px' }}>Módulo Combustible</h1>
        </div>
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '8px 12px', fontSize: '12px', borderRadius: '12px' }} 
          onClick={resetDaily}
        >
          <RefreshCw size={14} /> Reiniciar Día
        </button>
      </div>
      
      {/* Tarjeta de Proteínas */}
      <div className="card card-highlight" style={{ padding: '16px', marginBottom: '16px' }}>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={18} color="#0066ff" />
            <h2 style={{ margin: 0, fontSize: '16px' }}>Síntesis Proteica Miofibrilar</h2>
          </div>
          <span className="badge badge-green">{nutrition.protein}g / 160g meta</span>
        </div>

        <p style={{ fontSize: '12px', marginBottom: '14px' }}>
          Macronutriente esencial para compensar la degradación muscular post-entrenamiento e inducir hipertrofia miofibrilar por la vía mTOR.
        </p>
        
        {/* Barra de Progreso Apple */}
        <div style={{ background: '#e2e8f0', height: '14px', borderRadius: '999px', marginBottom: '16px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <div 
            style={{ 
              background: '#0066ff', 
              height: '100%', 
              width: `${proteinPercentage}%`,
              transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              borderRadius: '999px'
            }} 
          />
        </div>
        
        <div className="grid-2" style={{ marginBottom: '10px' }}>
          <button className="btn btn-outline" onClick={() => addProtein(25)} style={{ padding: '10px', fontSize: '12px', borderRadius: '12px' }}>
            <Plus size={15} color="#0066ff" /> 25g (Scoop Whey)
          </button>
          <button className="btn btn-outline" onClick={() => addProtein(40)} style={{ padding: '10px', fontSize: '12px', borderRadius: '12px' }}>
            <Plus size={15} color="#0066ff" /> 40g (Comida Fuerte)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <input 
            type="number" 
            placeholder="Gramos personalizados (ej. 15)" 
            value={tempProtein}
            onChange={(e) => setTempProtein(e.target.value)}
            style={{ flex: 1, minWidth: 0 }}
          />
          <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 18px', borderRadius: '12px' }} onClick={handleCustomProteinAdd}>
            Sumar
          </button>
        </div>
      </div>

      {/* Tarjeta de Hidratación Celular */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', borderLeft: '5px solid #06b6d4' }}>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplet size={18} color="#06b6d4" />
            <h2 style={{ margin: 0, fontSize: '16px' }}>Hidratación Celular & Electrolitos</h2>
          </div>
          <strong style={{ color: '#0f172a', fontSize: '16px' }}>{nutrition.water} Vasos</strong>
        </div>

        <p style={{ fontSize: '12px', marginBottom: '14px' }}>
          Un sarcoplasma bien hidratado preserva la fuerza prensil, la conductividad nerviosa y el volumen intracelular durante el esfuerzo mecánico.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px', marginBottom: '10px' }}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              onClick={() => addWater()}
              title={`Vasos: ${i + 1}`}
              style={{ 
                height: '42px', 
                borderRadius: '10px',
                border: '1.5px solid #06b6d4',
                background: i < nutrition.water ? '#06b6d4' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i < nutrition.water ? '#ffffff' : '#06b6d4',
                fontSize: '11px',
                fontWeight: '700'
              }} 
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>* Toca cada cuadro para registrar 250ml adicionales al sistema.</p>
      </div>
    </div>
  );
}
