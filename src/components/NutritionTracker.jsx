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
    setNutrition(prev => ({ ...prev, protein: Math.min(250, prev.protein + amount) }));
  };

  const addWater = () => {
    setNutrition(prev => ({ ...prev, water: prev.water + 1 }));
  };

  const resetDaily = () => {
    if(confirm("¿Estás seguro de reiniciar los registros nutricionales de hoy?")) {
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
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <span className="badge badge-blue">Módulo Combustible</span>
          <h1 style={{ marginTop: '4px' }}>Nutrición & Hidratación</h1>
        </div>
        <button 
          className="btn btn-outline" 
          style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }} 
          onClick={resetDaily}
        >
          <RefreshCw size={14} /> Reiniciar Día
        </button>
      </div>
      
      {/* Tarjeta de Proteínas */}
      <div className="card card-highlight" style={{ padding: '20px', marginBottom: '20px' }}>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="var(--accent-blue)" />
            <h2 style={{ margin: 0 }}>Síntesis Proteica</h2>
          </div>
          <span className="badge badge-green">{nutrition.protein}g / 160g meta</span>
        </div>

        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Combustible indispensable para reparar tejido e inducir hipertrofia del Protocolo Adonis.
        </p>
        
        {/* Barra de Progreso */}
        <div style={{ background: 'var(--border-color)', height: '14px', borderRadius: '7px', marginBottom: '20px', overflow: 'hidden' }}>
          <div 
            style={{ 
              background: 'var(--accent-blue)', 
              height: '100%', 
              width: `${proteinPercentage}%`,
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} 
          />
        </div>
        
        <div className="grid-2" style={{ marginBottom: '14px' }}>
          <button className="btn btn-outline" onClick={() => addProtein(25)}>
            <Plus size={16} /> 25g (Scoop Whey)
          </button>
          <button className="btn btn-outline" onClick={() => addProtein(40)}>
            <Plus size={16} /> 40g (Comida Principal)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            placeholder="Gramos personalizados (ej. 15)" 
            value={tempProtein}
            onChange={(e) => setTempProtein(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" style={{ width: 'auto', padding: '8px 18px' }} onClick={handleCustomProteinAdd}>
            Añadir
          </button>
        </div>
      </div>

      {/* Tarjeta de Agua / Hidratación */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid #06b6d4' }}>
        <div className="flex-between" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={22} color="#06b6d4" />
            <h2 style={{ margin: 0 }}>Hidratación Óptima</h2>
          </div>
          <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px' }}>{nutrition.water} Vasos</span>
        </div>

        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          La hidratación celular previene lesiones y optimiza la contracción y volumen muscular.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px', marginBottom: '12px' }}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              onClick={() => addWater()}
              title={`Vasos: ${i + 1}`}
              style={{ 
                height: '48px', 
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
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>* Toca cualquier casillero para sumar un vaso más (250ml aprox).</p>
      </div>

    </div>
  );
}
