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
    setNutrition(prev => ({ ...prev, protein: Math.min(280, prev.protein + amount) }));
  };

  const addWater = () => {
    setNutrition(prev => ({ ...prev, water: prev.water + 1 }));
  };

  const resetDaily = () => {
    if(confirm("¿Estás seguro de reiniciar los registros nutricionales del día hoy?")) {
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
      <div className="flex-between" style={{ marginBottom: '18px' }}>
        <div>
          <span className="badge badge-blue">Nutrición y Síntesis</span>
          <h1 style={{ marginTop: '4px' }}>Módulo Combustible</h1>
        </div>
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '8px 12px', fontSize: '12px' }} 
          onClick={resetDaily}
        >
          <RefreshCw size={14} /> Reiniciar Día
        </button>
      </div>
      
      {/* Tarjeta de Proteínas */}
      <div className="card card-highlight" style={{ padding: '18px', marginBottom: '18px' }}>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="var(--accent-blue)" />
            <h2 style={{ margin: 0, fontSize: '16px' }}>Síntesis Proteica Miofibrilar</h2>
          </div>
          <span className="badge badge-green">{nutrition.protein}g / 160g meta</span>
        </div>

        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Macronutriente indispensable para compensar el catabolismo fibrilar post-entreno y estimular la vía mTOR para hipertrofia pura.
        </p>
        
        {/* Barra de Progreso */}
        <div style={{ background: 'var(--border-color)', height: '14px', borderRadius: '7px', marginBottom: '18px', overflow: 'hidden' }}>
          <div 
            style={{ 
              background: 'var(--accent-blue)', 
              height: '100%', 
              width: `${proteinPercentage}%`,
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} 
          />
        </div>
        
        <div className="grid-2" style={{ marginBottom: '12px' }}>
          <button className="btn btn-outline" onClick={() => addProtein(25)} style={{ padding: '10px 12px', fontSize: '13px' }}>
            <Plus size={16} color="var(--accent-blue)" /> 25g (Scoop Whey)
          </button>
          <button className="btn btn-outline" onClick={() => addProtein(40)} style={{ padding: '10px 12px', fontSize: '13px' }}>
            <Plus size={16} color="var(--accent-blue)" /> 40g (Comida Fuerte)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="number" 
            placeholder="Gramos personalizados (ej. 15)" 
            value={tempProtein}
            onChange={(e) => setTempProtein(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
          />
          <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleCustomProteinAdd}>
            Sumar
          </button>
        </div>
      </div>

      {/* Tarjeta de Hidratación Celular */}
      <div className="card" style={{ padding: '18px', marginBottom: '20px', borderLeft: '4px solid #06b6d4' }}>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={20} color="#06b6d4" />
            <h2 style={{ margin: 0, fontSize: '16px' }}>Hidratación Celular & Electrolitos</h2>
          </div>
          <strong style={{ color: '#0f172a', fontSize: '16px' }}>{nutrition.water} Vasos</strong>
        </div>

        <p style={{ fontSize: '13px', marginBottom: '14px' }}>
          La hidratación optimiza el volumen del citoplasma muscular y preserva la conductividad del sistema nervioso sobre la contracción motora.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px', marginBottom: '10px' }}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              onClick={() => addWater()}
              title={`Vasos: ${i + 1}`}
              style={{ 
                height: '45px', 
                borderRadius: '8px',
                border: '2px solid #06b6d4',
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
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>* Presiona cualquier cuadro para registrar 250ml adicionales al sistema.</p>
      </div>
    </div>
  );
}
