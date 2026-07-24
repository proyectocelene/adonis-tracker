import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function NutritionTracker() {
  const [nutrition, setNutrition] = useLocalStorage('adonis_nutrition_data', {
    protein: 0,
    water: 0
  });

  const [tempProtein, setTempProtein] = useState('');

  const addProtein = (amount) => {
    setNutrition(prev => ({ ...prev, protein: Math.min(160, prev.protein + amount) }));
  };

  const addWater = () => {
    setNutrition(prev => ({ ...prev, water: prev.water + 1 }));
  };

  const resetDaily = () => {
    if(confirm("¿Estás seguro de reiniciar tu progreso de hoy?")) {
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

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Nutrición & Recuperación</h1>
      
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--accent-gold)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Proteína</span>
          <span>{nutrition.protein} / 160g</span>
        </h2>
        
        <div style={{ background: 'rgba(0,0,0,0.3)', height: '12px', borderRadius: '6px', margin: '16px 0', overflow: 'hidden' }}>
          <div 
            style={{ 
              background: 'var(--accent-gold)', 
              height: '100%', 
              width: `${(nutrition.protein / 160) * 100}%`,
              transition: 'width 0.3s ease'
            }} 
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <button className="btn-primary" style={{ background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }} onClick={() => addProtein(25)}>
            +25g (Scoop)
          </button>
          <button className="btn-primary" style={{ background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }} onClick={() => addProtein(40)}>
            +40g (Comida)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="number" 
            placeholder="Otro (ej. 15g)" 
            value={tempProtein}
            onChange={(e) => setTempProtein(e.target.value)}
          />
          <button className="btn-primary" style={{ width: 'auto' }} onClick={handleCustomProteinAdd}>Añadir</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--accent-cyan)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Agua</span>
          <span>{nutrition.water} Vasos</span>
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', marginBottom: '24px' }}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              onClick={() => i === nutrition.water ? addWater() : null}
              style={{ 
                width: '32px', height: '40px', 
                borderRadius: '4px',
                border: '2px solid var(--accent-cyan)',
                background: i < nutrition.water ? 'var(--accent-cyan)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }} 
            />
          ))}
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>*Meta recomendada: 8 vasos al día.</p>
      </div>

      <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }} onClick={resetDaily}>
        Reiniciar Día
      </button>

    </div>
  );
}
