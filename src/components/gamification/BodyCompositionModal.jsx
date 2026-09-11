import React, { useState, useEffect } from 'react';
import { Scale, X, Check, Activity, Target, Sparkles, Ruler, Flame } from 'lucide-react';

export default function BodyCompositionModal({
  isOpen,
  onClose,
  initialData = {},
  initialGoals = {},
  onSave
}) {
  const [activeTab, setActiveTab] = useState('scale'); // 'scale' | 'tape' | 'goals'

  // Estado de Datos de Báscula (Sin datos falsos prellenados)
  const [formData, setFormData] = useState({
    weightKg: initialData.weightKg || initialData.weight || '',
    heightCm: initialData.heightCm || initialData.height || '',
    bodyFatPct: initialData.bodyFatPct || '',
    fatMassKg: initialData.fatMassKg || '',
    skeletalMusclePct: initialData.skeletalMusclePct || '',
    skeletalMuscleKg: initialData.skeletalMuscleKg || '',
    fatFreeMassKg: initialData.fatFreeMassKg || '',
    waterPct: initialData.waterPct || '',
    waterKg: initialData.waterKg || '',
    visceralFat: initialData.visceralFat || '',
    boneMassKg: initialData.boneMassKg || '',
    bmr: initialData.bmr || '',
    proteinPct: initialData.proteinPct || '',
    obesityDegreePct: initialData.obesityDegreePct || '',
    metabolicAge: initialData.metabolicAge || '',
    realAge: initialData.realAge || '',
    // Medidas con cinta métrica (Opcionales, vacías si el usuario no las midió)
    waistCm: initialData.waistCm || '',
    shouldersCm: initialData.shouldersCm || '',
    chestCm: initialData.chestCm || '',
    armsCm: initialData.armsCm || ''
  });

  // Estado de Metas
  const [goalData, setGoalData] = useState({
    targetWeightKg: initialGoals.targetWeightKg || '72.0',
    targetFatPct: initialGoals.targetFatPct || '12.0',
    muscleGainTargetKg: initialGoals.muscleGainTargetKg || '2.0',
    goalType: initialGoals.goalType || 'recomposition'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (field, value) => {
    setGoalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, goalData);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setFormData({
        weightKg: initialData.weightKg || initialData.weight || '',
        heightCm: initialData.heightCm || initialData.height || '',
        bodyFatPct: initialData.bodyFatPct || '',
        fatMassKg: initialData.fatMassKg || '',
        skeletalMusclePct: initialData.skeletalMusclePct || '',
        skeletalMuscleKg: initialData.skeletalMuscleKg || '',
        fatFreeMassKg: initialData.fatFreeMassKg || '',
        waterPct: initialData.waterPct || '',
        waterKg: initialData.waterKg || '',
        visceralFat: initialData.visceralFat || '',
        boneMassKg: initialData.boneMassKg || '',
        bmr: initialData.bmr || '',
        proteinPct: initialData.proteinPct || '',
        obesityDegreePct: initialData.obesityDegreePct || '',
        metabolicAge: initialData.metabolicAge || '',
        realAge: initialData.realAge || '',
        waistCm: initialData.waistCm || '',
        shouldersCm: initialData.shouldersCm || '',
        chestCm: initialData.chestCm || '',
        armsCm: initialData.armsCm || ''
      });
      setGoalData({
        targetWeightKg: initialGoals.targetWeightKg || '72.0',
        targetFatPct: initialGoals.targetFatPct || '12.0',
        muscleGainTargetKg: initialGoals.muscleGainTargetKg || '2.0',
        goalType: initialGoals.goalType || 'recomposition'
      });
    }
  }, [isOpen, initialData, initialGoals]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        margin: '20px auto',
        padding: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        border: '1.5px solid #cbd5e1'
      }}>
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0066ff'
            }}>
              <Scale size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
                Composición Corporal & Báscula
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
                Datos bioimpedancia y medidas para tiempos verdaderos
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* SELECTOR DE PESTAÑAS DEL FORMULARIO */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '14px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('scale')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'scale' ? '#ffffff' : 'transparent',
              color: activeTab === 'scale' ? '#0066ff' : '#64748b',
              fontWeight: '900',
              fontSize: '11.5px',
              cursor: 'pointer',
              boxShadow: activeTab === 'scale' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            ⚖️ Báscula
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tape')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'tape' ? '#ffffff' : 'transparent',
              color: activeTab === 'tape' ? '#0066ff' : '#64748b',
              fontWeight: '900',
              fontSize: '11.5px',
              cursor: 'pointer',
              boxShadow: activeTab === 'tape' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            📏 Medidas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('goals')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'goals' ? '#ffffff' : 'transparent',
              color: activeTab === 'goals' ? '#0066ff' : '#64748b',
              fontWeight: '900',
              fontSize: '11.5px',
              cursor: 'pointer',
              boxShadow: activeTab === 'goals' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            🎯 Metas
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PESTAÑA 1: DATOS DE LA BÁSCULA */}
          {activeTab === 'scale' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Peso Total (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 78.5"
                    value={formData.weightKg}
                    onChange={(e) => handleChange('weightKg', e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Estatura / Altura (cm):
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="Ej. 175"
                    value={formData.heightCm}
                    onChange={(e) => handleChange('heightCm', e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    % Grasa Corporal:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 18.2"
                    value={formData.bodyFatPct}
                    onChange={(e) => handleChange('bodyFatPct', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Peso Grasa (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Opcional (se calcula)"
                    value={formData.fatMassKg}
                    onChange={(e) => handleChange('fatMassKg', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    % Músculo Esquelético:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 42.5"
                    value={formData.skeletalMusclePct}
                    onChange={(e) => handleChange('skeletalMusclePct', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Músculo Esquelético (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 33.4"
                    value={formData.skeletalMuscleKg}
                    onChange={(e) => handleChange('skeletalMuscleKg', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Masa sin grasa / Magra (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 64.2"
                    value={formData.fatFreeMassKg}
                    onChange={(e) => handleChange('fatFreeMassKg', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    % Agua Corporal:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 56.5"
                    value={formData.waterPct}
                    onChange={(e) => handleChange('waterPct', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Grasa Visceral (Nivel 1-15):
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="Ej. 6"
                    value={formData.visceralFat}
                    onChange={(e) => handleChange('visceralFat', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Metabolismo Basal BMR (kcal):
                  </label>
                  <input
                    type="number"
                    step="10"
                    placeholder="Ej. 1750"
                    value={formData.bmr}
                    onChange={(e) => handleChange('bmr', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Edad Real (Años):
                  </label>
                  <input
                    type="number"
                    value={formData.realAge}
                    onChange={(e) => handleChange('realAge', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Edad Metabólica (Años):
                  </label>
                  <input
                    type="number"
                    value={formData.metabolicAge}
                    onChange={(e) => handleChange('metabolicAge', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Masa Ósea / Hueso (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 3.2"
                    value={formData.boneMassKg}
                    onChange={(e) => handleChange('boneMassKg', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    % Proteína:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 18.0"
                    value={formData.proteinPct}
                    onChange={(e) => handleChange('proteinPct', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: MEDIDAS CORPORALES (V-TAPER DE ADONIS) */}
          {activeTab === 'tape' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '10px',
                fontSize: '11px',
                color: '#1e40af',
                lineHeight: 1.4
              }}>
                📐 <strong>Proporción Áurea Adonis (1.618):</strong> Mide tu circunferencia de hombros en el punto más ancho y cintura en el ombligo.
                <div style={{ marginTop: '4px', fontSize: '10.5px', color: '#64748b' }}>
                  💡 <em>Opcional: Si no tienes cinta métrica a la mano, déjalos en blanco. La app NO inventará medidas genéricas.</em>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Cintura Umbilical (cm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Opcional (Ej. 82)"
                    value={formData.waistCm}
                    onChange={(e) => handleChange('waistCm', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Hombros Clavicular (cm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Opcional (Ej. 122)"
                    value={formData.shouldersCm}
                    onChange={(e) => handleChange('shouldersCm', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Pecho / Pectoral (cm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Opcional (Ej. 102)"
                    value={formData.chestCm}
                    onChange={(e) => handleChange('chestCm', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '3px' }}>
                    Brazo Flexionado (cm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Opcional (Ej. 37.5)"
                    value={formData.armsCm}
                    onChange={(e) => handleChange('armsCm', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: OBJETIVOS FISIOLÓGICOS */}
          {activeTab === 'goals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* PRESETS BASADOS EN CIENCIA DEPORTIVA */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  🎯 Presets Científicos para tu Estatura ({formData.heightCm || 174} cm):
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleGoalChange('targetWeightKg', '72.0');
                      handleGoalChange('targetFatPct', '12.0');
                      handleGoalChange('goalType', 'recomposition');
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      border: goalData.targetWeightKg === '72.0' ? '2px solid #0066ff' : '1px solid #cbd5e1',
                      background: goalData.targetWeightKg === '72.0' ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: '900', color: '#0066ff' }}>
                      ⭐ 72.0 kg al 12% Grasa (Recomendado Adonis)
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      Equilibrio perfecto de V-Taper, hombros anchos, cintura estrecha y salud visceral óptima.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleGoalChange('targetWeightKg', '70.0');
                      handleGoalChange('targetFatPct', '10.5');
                      handleGoalChange('goalType', 'cut');
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      border: goalData.targetWeightKg === '70.0' ? '2px solid #0066ff' : '1px solid #cbd5e1',
                      background: goalData.targetWeightKg === '70.0' ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: '900', color: '#d97706' }}>
                      ⚡ 70.0 kg al 10.5% Grasa (Definición Máxima / Six-Pack)
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      Máxima vascularidad y separación muscular profunda, grasa visceral mínima.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleGoalChange('targetWeightKg', '74.5');
                      handleGoalChange('targetFatPct', '13.5');
                      handleGoalChange('goalType', 'recomposition');
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      border: goalData.targetWeightKg === '74.5' ? '2px solid #0066ff' : '1px solid #cbd5e1',
                      background: goalData.targetWeightKg === '74.5' ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: '900', color: '#059669' }}>
                      💪 74.5 kg al 13.5% Grasa (Volumen Atlético Denso)
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      Mayor porte y fuerza bruta manteniendo un abdomen firme y controlado.
                    </div>
                  </button>
                </div>
              </div>

              {/* INPUTS DE PESO Y % GRASA META */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '4px' }}>
                    Peso Meta Deseado (kg):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ej. 72.0"
                    value={goalData.targetWeightKg || ''}
                    onChange={(e) => handleGoalChange('targetWeightKg', e.target.value)}
                    style={inputStyle}
                    required
                  />
                  <span style={{ fontSize: '9.5px', color: '#64748b' }}>Rango sugerido: 70 - 75 kg</span>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '4px' }}>
                    % Grasa Meta (%):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ej. 12.0"
                    value={goalData.targetFatPct}
                    onChange={(e) => handleGoalChange('targetFatPct', e.target.value)}
                    style={inputStyle}
                    required
                  />
                  <span style={{ fontSize: '9.5px', color: '#64748b' }}>Recomendado: 10% a 13%</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '4px' }}>
                  Fase Estratégica:
                </label>
                <select
                  value={goalData.goalType}
                  onChange={(e) => handleGoalChange('goalType', e.target.value)}
                  style={inputStyle}
                >
                  <option value="recomposition">Recomposición Corporal (Priorizar Pérdida de Grasa y Preservar Músculo)</option>
                  <option value="cut">Definición Estricta (Déficit directo para quemar grasa visceral)</option>
                  <option value="bulk">Volumen Limpio Hipertrófico (Ganar masa magra controlada)</option>
                </select>
              </div>

              {/* ANÁLISIS EN VIVO DE LA META */}
              {formData.weightKg && (
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  fontSize: '11.5px',
                  lineHeight: 1.4
                }}>
                  <div style={{ fontWeight: '900', color: '#0f172a', marginBottom: '2px' }}>
                    📊 Resumen Fisiológico de tu Meta:
                  </div>
                  <div style={{ color: '#475569' }}>
                    • Peso Actual: <strong>{formData.weightKg} kg</strong> ({formData.bodyFatPct || 24.5}% grasa) ➔ Meta: <strong>{goalData.targetWeightKg || 72} kg</strong> ({goalData.targetFatPct}% grasa)
                  </div>
                  <div style={{ color: '#059669', fontWeight: '800', marginTop: '2px' }}>
                    • Fase 1 (Reducción Visceral): ~14 a 18 semanas de déficit moderado para normalizar tu grasa visceral (de 11.5 a &lt; 6) y recuperar tu edad metabólica real.
                  </div>
                </div>
              )}

            </div>
          )}

          {/* BOTÓN DE GUARDADO */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#64748b',
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
                flex: 2,
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                color: '#ffffff',
                fontWeight: '900',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,102,255,0.3)'
              }}
            >
              <Check size={16} strokeWidth={3} /> Guardar & Calcular Tiempos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '10px',
  border: '1.5px solid #cbd5e1',
  fontSize: '13px',
  fontWeight: '800',
  color: '#0f172a',
  background: '#ffffff'
};
