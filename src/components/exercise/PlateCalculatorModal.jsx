import React, { useState } from 'react';
import { X, Check, Layers, Disc } from 'lucide-react';

export default function PlateCalculatorModal({
  isOpen,
  onClose,
  initialWeight = 0,
  exerciseName = '',
  machineConfig = null,
  onApplyWeight
}) {
  if (!isOpen) return null;

  const numericInitial = parseFloat(initialWeight) || 0;
  
  // Detectar automáticamente el tipo de ejercicio considerando machineConfig
  const lowerName = (exerciseName || '').toLowerCase();
  const isLegPress = lowerName.includes('prensa') || lowerName.includes('leg press');
  const isHack = lowerName.includes('hack') || lowerName.includes('v-squat');
  const isSmith = lowerName.includes('smith') || lowerName.includes('multipower');

  // Modo inicial: respetando machineConfig.type si existe
  const defaultMode = machineConfig?.type 
    ? (machineConfig.type === 'plates' ? 'plates' : 'stack')
    : ((isLegPress || isHack || isSmith || lowerName.includes('barra') || lowerName.includes('rumano') || lowerName.includes('deadlift')) ? 'plates' : 'stack');
  const [activeTab, setActiveTab] = useState(defaultMode);

  // Selector de Unidad: 'lbs' o 'kg'
  const [unit, setUnit] = useState('lbs');

  // === MODO DISCOS POR LADO ===
  const defaultBaseWeight = machineConfig?.baseWeight !== undefined
    ? machineConfig.baseWeight
    : (unit === 'kg'
        ? (isLegPress ? 45 : (isHack ? 35 : (isSmith ? 10 : (lowerName.includes('barra') ? 20 : 0))))
        : (isLegPress ? 100 : (isHack ? 75 : (isSmith ? 20 : (lowerName.includes('barra') ? 45 : 0)))));

  const [baseWeight, setBaseWeight] = useState(defaultBaseWeight);
  const [targetWeight, setTargetWeight] = useState(numericInitial > 0 ? numericInitial : (defaultBaseWeight + (unit === 'kg' ? 40 : 90)));

  const AVAILABLE_PLATES_LBS = (machineConfig?.availablePlates && machineConfig.availablePlates.length > 0)
    ? machineConfig.availablePlates
    : [45, 35, 25, 10, 5, 2.5];
  const AVAILABLE_PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];
  const availablePlates = unit === 'kg' ? AVAILABLE_PLATES_KG : AVAILABLE_PLATES_LBS;

  const calculatePlatesPerSide = (total, base) => {
    const netWeight = Math.max(0, total - base);
    const perSideWeight = netWeight / 2;
    let remaining = perSideWeight;
    const breakdown = {};

    availablePlates.forEach(p => {
      if (remaining >= p) {
        const count = Math.floor(remaining / p);
        breakdown[p] = count;
        remaining = Math.round((remaining - (count * p)) * 100) / 100;
      } else {
        breakdown[p] = 0;
      }
    });

    return { perSideWeight, breakdown, remainder: remaining };
  };

  const plateCalc = calculatePlatesPerSide(targetWeight, baseWeight);

  // === MODO TORRE DE PLACAS SKEUOMÓRFICA ===
  const configFirst = machineConfig?.firstPlate !== undefined ? machineConfig.firstPlate : (unit === 'kg' ? 5 : 10);
  const configStep = machineConfig?.plateStep !== undefined ? machineConfig.plateStep : (unit === 'kg' ? 5 : 10);
  const [topPlateWeight, setTopPlateWeight] = useState(configFirst);
  const [stackIncrement, setStackIncrement] = useState(configStep);
  const [addOnWeight, setAddOnWeight] = useState(machineConfig?.microWeight || 0);

  const totalStackPlates = 20;

  // Cálculo exacto para cada placa n (1 a 20) según machineConfig o preset
  const getPlateWeight = (plateNum) => {
    if (machineConfig?.availableWeights && machineConfig.availableWeights.length >= plateNum) {
      return machineConfig.availableWeights[plateNum - 1];
    }
    if (machineConfig?.stackPreset === 'two_tens_then_twenty') {
      const w = [10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380];
      return w[plateNum - 1] || (380 + ((plateNum - 20) * 20));
    }
    if (plateNum === 1) return topPlateWeight;
    return topPlateWeight + ((plateNum - 1) * stackIncrement);
  };

  const [selectedPlateIndex, setSelectedPlateIndex] = useState(() => {
    if (numericInitial > 0) {
      let closestIdx = 1;
      let minDiff = Infinity;
      for (let i = 1; i <= totalStackPlates; i++) {
        const pw = getPlateWeight(i);
        const diff = Math.abs(pw - numericInitial);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
      return closestIdx;
    }
    return 6;
  });

  const currentStackWeight = getPlateWeight(selectedPlateIndex) + addOnWeight;
  const convertedToLbs = unit === 'kg' ? Math.round(currentStackWeight * 2.20462) : currentStackWeight;

  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    if (newUnit === 'kg') {
      setTopPlateWeight(5);
      setStackIncrement(5);
      setAddOnWeight(0);
      setBaseWeight(isLegPress ? 45 : (isHack ? 35 : (isSmith ? 10 : (lowerName.includes('barra') ? 20 : 0))));
    } else {
      setTopPlateWeight(10);
      setStackIncrement(10);
      setAddOnWeight(0);
      setBaseWeight(isLegPress ? 100 : (isHack ? 75 : (isSmith ? 20 : (lowerName.includes('barra') ? 45 : 0))));
    }
  };

  const handleApply = (weightToApply) => {
    if (onApplyWeight) {
      onApplyWeight(String(weightToApply));
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-start', overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 9999
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '460px',
        margin: 'auto 0',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏋️ Calculadora de Carga
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
              {exerciseName || 'Ajuste de peso rápido'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* TOGGLE LBS / KG */}
            <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '10px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => handleUnitToggle('lbs')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: unit === 'lbs' ? '#0066ff' : 'transparent',
                  color: unit === 'lbs' ? '#ffffff' : '#475569',
                  fontSize: '11px',
                  fontWeight: '900',
                  cursor: 'pointer'
                }}
              >
                LBS
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('kg')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: unit === 'kg' ? '#0066ff' : 'transparent',
                  color: unit === 'kg' ? '#ffffff' : '#475569',
                  fontSize: '11px',
                  fontWeight: '900',
                  cursor: 'pointer'
                }}
              >
                KG
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TABS SELECTOR DE MODO */}
        <div style={{ display: 'flex', padding: '12px 16px 0 16px', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('plates')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: activeTab === 'plates' ? '2px solid #0066ff' : '1px solid #e2e8f0',
              background: activeTab === 'plates' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'plates' ? '#0066ff' : '#64748b',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Disc size={16} /> Discos por Lado
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: activeTab === 'stack' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
              background: activeTab === 'stack' ? '#f5f3ff' : '#ffffff',
              color: activeTab === 'stack' ? '#7c3aed' : '#64748b',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Layers size={16} /> Torre de Placas
          </button>
        </div>

        {/* CONTENIDO SEGÚN TAB */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'plates' ? (
            <>
              {/* PESO OBJETIVO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569' }}>PESO TOTAL OBJETIVO</label>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#0066ff' }}>{targetWeight} {unit}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={targetWeight || ''}
                    onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      border: '2px solid #0066ff',
                      fontSize: '20px',
                      fontWeight: '900',
                      textAlign: 'center',
                      color: '#0f172a'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(unit === 'kg' ? [-10, -5, +5, +10] : [-20, -10, +10, +20]).map(delta => (
                      <button
                        key={delta}
                        type="button"
                        onClick={() => setTargetWeight(Math.max(baseWeight, targetWeight + delta))}
                        style={{
                          padding: '8px 8px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          fontSize: '11px',
                          fontWeight: '800',
                          color: delta > 0 ? '#16a34a' : '#dc2626',
                          cursor: 'pointer'
                        }}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PESO BASE DE BARRA / TRINEO */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>PESO BASE (BARRA / TRINEO)</span>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>{baseWeight} {unit}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(unit === 'kg' ? [
                    { label: 'Prensa (45 kg)', val: 45 },
                    { label: 'Hack (35 kg)', val: 35 },
                    { label: 'Barra (20 kg)', val: 20 },
                    { label: 'Smith (10 kg)', val: 10 },
                    { label: 'Cero (0)', val: 0 }
                  ] : [
                    { label: 'Prensa (100 lbs)', val: 100 },
                    { label: 'Hack (75 lbs)', val: 75 },
                    { label: 'Barra (45 lbs)', val: 45 },
                    { label: 'Smith (20 lbs)', val: 20 },
                    { label: 'Cero (0)', val: 0 }
                  ]).map(b => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => setBaseWeight(b.val)}
                      style={{
                        flex: '1 1 auto',
                        padding: '5px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: baseWeight === b.val ? '1.5px solid #0066ff' : '1px solid #cbd5e1',
                        background: baseWeight === b.val ? '#eff6ff' : '#ffffff',
                        color: baseWeight === b.val ? '#0066ff' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DESGLOSE VISUAL DE DISCOS POR LADO */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '14px', borderRadius: '16px', color: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Cargar por cada lado:</span>
                  <strong style={{ fontSize: '17px', fontWeight: '900', color: '#38bdf8' }}>{plateCalc.perSideWeight} {unit} / lado</strong>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {availablePlates.map(p => {
                    const count = plateCalc.breakdown[p] || 0;
                    if (count === 0) return null;
                    return (
                      <div
                        key={p}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1.5px solid rgba(56, 189, 248, 0.4)',
                          borderRadius: '12px',
                          padding: '6px 10px'
                        }}
                      >
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: p >= (unit === 'kg' ? 20 : 45) ? '#2563eb' : (p >= (unit === 'kg' ? 15 : 35) ? '#d97706' : (p >= (unit === 'kg' ? 10 : 25) ? '#16a34a' : '#475569')),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '900',
                          color: '#fff'
                        }}>
                          {p}
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }}>x {count}</span>
                      </div>
                    );
                  })}
                  {Object.values(plateCalc.breakdown).every(c => c === 0) && (
                    <span style={{ fontSize: '13px', color: '#94a3b8', padding: '6px' }}>Solo peso base ({baseWeight} {unit})</span>
                  )}
                </div>

                {plateCalc.remainder > 0 && (
                  <p style={{ fontSize: '11px', color: '#f59e0b', margin: '8px 0 0 0', textAlign: 'center', fontWeight: '700' }}>
                    ⚠️ Diferencia no divisible en discos: +{plateCalc.remainder * 2} {unit} total
                  </p>
                )}
              </div>

              {/* BOTÓN APLICAR */}
              <button
                type="button"
                onClick={() => handleApply(targetWeight)}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 102, 255, 0.3)'
                }}
              >
                <Check size={18} strokeWidth={3} /> Aplicar {targetWeight} {unit} a la serie
              </button>
            </>
          ) : (
            <>
              {/* MODO TORRE DE PLACAS SKEUOMÓRFICA */}

              {/* 1. PLACA #1 (CABEZAL / PRIMERA PESA) */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>
                    PLACA #1 (CABEZAL / INICIAL)
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#7c3aed' }}>
                    {topPlateWeight} {unit}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(unit === 'kg' ? [2.5, 5, 7.5, 10, 12.5] : [7.5, 10, 12.5, 15, 20]).map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTopPlateWeight(val)}
                      style={{
                        flex: '1 1 auto',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        border: topPlateWeight === val ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                        background: topPlateWeight === val ? '#f5f3ff' : '#ffffff',
                        color: topPlateWeight === val ? '#7c3aed' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {val} {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. INCREMENTO POR PLACA (#2 EN ADELANTE) */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>
                    INCREMENTO PLACAS (#2 EN ADELANTE)
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#7c3aed' }}>
                    +{stackIncrement} {unit}/placa
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(unit === 'kg' ? [2.5, 5, 7.5, 10] : [5, 10, 12.5, 15, 20]).map(inc => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setStackIncrement(inc)}
                      style={{
                        flex: '1 1 auto',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        border: stackIncrement === inc ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                        background: stackIncrement === inc ? '#f5f3ff' : '#ffffff',
                        color: stackIncrement === inc ? '#7c3aed' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      +{inc} {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. PESAS AUXILIARES / ADD-ONS (+2.5, +5, +7.5, +10 LBS) */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>
                    PESA AUXILIAR (PIN EXTRA / DIAL)
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#16a34a' }}>
                    {addOnWeight > 0 ? `+${addOnWeight} ${unit}` : 'Ninguna'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(unit === 'kg' ? [0, 1.25, 2.5, 3.75, 5] : [0, 2.5, 5, 7.5, 10]).map(extra => (
                    <button
                      key={extra}
                      type="button"
                      onClick={() => setAddOnWeight(extra)}
                      style={{
                        flex: '1 1 auto',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        border: addOnWeight === extra ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                        background: addOnWeight === extra ? '#dcfce7' : '#ffffff',
                        color: addOnWeight === extra ? '#15803d' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {extra === 0 ? 'Sin extra' : `+${extra}`}
                    </button>
                  ))}
                </div>
              </div>

              {machineConfig && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: '800' }}>
                    ⚙️ {machineConfig.stackPreset === 'two_tens_then_twenty' ? 'Torre Calibrada: 2 de 10 lb, luego +20 lb' : `Torre Calibrada (+${machineConfig.plateStep || 10} ${unit})`}
                  </span>
                  {machineConfig.station && (
                    <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: '700' }}>{machineConfig.station}</span>
                  )}
                </div>
              )}

              {/* 4. VISUALIZADOR SKEUOMÓRFICO DE LA TORRE DE PLACAS */}
              <div style={{
                maxHeight: '230px',
                overflowY: 'auto',
                background: '#0f172a',
                borderRadius: '16px',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                border: '2px solid #334155'
              }}>
                {Array.from({ length: totalStackPlates }).map((_, idx) => {
                  const plateNum = idx + 1;
                  const weightForPlate = getPlateWeight(plateNum);
                  const isSelected = selectedPlateIndex === plateNum;
                  const isTopPlate = plateNum === 1;

                  return (
                    <div
                      key={plateNum}
                      onClick={() => setSelectedPlateIndex(plateNum)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: isSelected 
                          ? 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)' 
                          : (idx < selectedPlateIndex ? '#1e293b' : '#334155'),
                        color: isSelected ? '#ffffff' : (idx < selectedPlateIndex ? '#e2e8f0' : '#94a3b8'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 0 12px rgba(168, 85, 247, 0.6)' : 'none',
                        borderLeft: isSelected ? '6px solid #fbbf24' : (isTopPlate ? '3px solid #38bdf8' : '3px solid transparent')
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', opacity: 0.7, width: '22px' }}>#{plateNum}</span>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSelected ? '#fbbf24' : (isTopPlate ? '#38bdf8' : '#64748b') }} />
                        <strong style={{ fontSize: '13px', fontWeight: '900' }}>
                          {weightForPlate} {unit}
                        </strong>
                        {isTopPlate && (
                          <span style={{ fontSize: '9px', background: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                            Cabezal
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span style={{ fontSize: '11px', fontWeight: '900', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          PIN AQUÍ ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* TOTAL SELECCIONADO */}
              <div style={{ textAlign: 'center', padding: '4px 0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>Peso efectivo seleccionado:</span>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#7c3aed' }}>
                  {currentStackWeight} {unit}
                  {addOnWeight > 0 && <span style={{ fontSize: '13px', color: '#16a34a', marginLeft: '6px' }}>(+{addOnWeight} {unit} extra)</span>}
                </div>
                {unit === 'kg' && (
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#0066ff', marginTop: '2px' }}>
                    ≈ {convertedToLbs} lbs equivalentes
                  </div>
                )}
              </div>

              {/* BOTONES APLICAR */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleApply(unit === 'kg' ? convertedToLbs : currentStackWeight)}
                  style={{
                    padding: '12px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  <Check size={18} strokeWidth={3} />
                  {unit === 'kg' 
                    ? `Aplicar ${convertedToLbs} lbs (de ${currentStackWeight} kg)` 
                    : `Aplicar ${currentStackWeight} lbs a la serie`}
                </button>

                {unit === 'kg' && (
                  <button
                    type="button"
                    onClick={() => handleApply(currentStackWeight)}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    O aplicar directo como valor {currentStackWeight} (sin convertir)
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
