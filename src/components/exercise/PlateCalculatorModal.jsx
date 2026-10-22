import React, { useState, useEffect } from 'react';
import { X, Check, Layers, Disc, Settings2 } from 'lucide-react';

export default function PlateCalculatorModal({
  isOpen,
  onClose,
  initialWeight = 0,
  exerciseName = '',
  machineConfig = null,
  onApplyWeight,
  onSaveMachineConfig,
  onOpenMachineConfig
}) {
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
  const defaultStackPreset = machineConfig?.stackPreset || (lowerName.includes('extension') ? 'two_tens_then_twenty' : 'linear');
  const [stackPreset, setStackPreset] = useState(defaultStackPreset);
  const [saveAsCalibration, setSaveAsCalibration] = useState(true);

  const configFirst = machineConfig?.firstPlate !== undefined ? machineConfig.firstPlate : (unit === 'kg' ? 5 : 10);
  const configStep = machineConfig?.plateStep !== undefined ? machineConfig.plateStep : (unit === 'kg' ? 5 : 10);
  const [topPlateWeight, setTopPlateWeight] = useState(configFirst);
  const [stackIncrement, setStackIncrement] = useState(configStep);
  const [addOnWeight, setAddOnWeight] = useState(machineConfig?.microWeight || 0);

  const totalStackPlates = 20;

  // Cálculo exacto para cada placa n (1 a 20) según machineConfig o preset
  const getPlateWeight = (plateNum) => {
    const fp = parseFloat(topPlateWeight) || (unit === 'kg' ? 5 : 10);
    const inc = parseFloat(stackIncrement) || (unit === 'kg' ? 5 : (stackPreset === 'two_tens_then_twenty' ? 20 : 10));
    if (stackPreset === 'two_tens_then_twenty') {
      if (plateNum === 1) return fp;
      if (plateNum === 2) return fp * 2;
      return Math.round(((fp * 2) + ((plateNum - 2) * inc)) * 10) / 10;
    }
    if (plateNum === 1) return fp;
    return Math.round((fp + ((plateNum - 1) * inc)) * 10) / 10;
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
    if (saveAsCalibration && onSaveMachineConfig) {
      let calculatedAvailableWeights = [];
      if (activeTab === 'stack') {
        calculatedAvailableWeights = Array.from({ length: totalStackPlates }, (_, i) => getPlateWeight(i + 1));
      }
      const updatedConfig = {
        ...(machineConfig || {}),
        type: activeTab,
        stackPreset,
        firstPlate: parseFloat(topPlateWeight) || (unit === 'kg' ? 5 : 10),
        plateStep: stackPreset === 'two_tens_then_twenty' ? 20 : (parseFloat(stackIncrement) || (unit === 'kg' ? 5 : 10)),
        microWeight: parseFloat(addOnWeight) || 0,
        baseWeight: parseFloat(baseWeight) || 0,
        availableWeights: calculatedAvailableWeights,
        unit,
        updatedAt: new Date().toISOString()
      };
      onSaveMachineConfig(updatedConfig);
    }
    if (onApplyWeight) {
      onApplyWeight(String(weightToApply));
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const mode = machineConfig?.type 
        ? (machineConfig.type === 'plates' ? 'plates' : 'stack')
        : ((isLegPress || isHack || isSmith || lowerName.includes('barra') || lowerName.includes('rumano') || lowerName.includes('deadlift')) ? 'plates' : 'stack');
      setActiveTab(mode);
      const defBase = machineConfig?.baseWeight !== undefined
        ? machineConfig.baseWeight
        : (unit === 'kg'
            ? (isLegPress ? 45 : (isHack ? 35 : (isSmith ? 10 : (lowerName.includes('barra') ? 20 : 0))))
            : (isLegPress ? 100 : (isHack ? 75 : (isSmith ? 20 : (lowerName.includes('barra') ? 45 : 0)))));
      setBaseWeight(defBase);
      setTargetWeight(numericInitial > 0 ? numericInitial : (defBase + (unit === 'kg' ? 40 : 90)));
      setStackPreset(machineConfig?.stackPreset || (lowerName.includes('extension') ? 'two_tens_then_twenty' : 'linear'));
      setTopPlateWeight(machineConfig?.firstPlate !== undefined ? machineConfig.firstPlate : (unit === 'kg' ? 5 : 10));
      setStackIncrement(machineConfig?.plateStep !== undefined ? machineConfig.plateStep : (unit === 'kg' ? 5 : 10));
      setAddOnWeight(machineConfig?.microWeight || 0);
    }
  }, [isOpen, machineConfig, initialWeight]);

  if (!isOpen) return null;

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
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '460px',
        margin: 'auto 0',
        overflowY: 'auto',
        maxHeight: '92vh',
        boxShadow: 'var(--shadow-ios)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🏋️ Calculadora de Carga
              </h3>
              {onOpenMachineConfig && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMachineConfig();
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'var(--accent-blue-light)',
                    border: '1px solid var(--accent-blue)',
                    color: 'var(--accent-blue)',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                  title="Calibrar máquina, piso y estación"
                >
                  <Settings2 size={11} /> Calibrar
                </button>
              )}
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
              {exerciseName || 'Ajuste de peso'}
              {machineConfig?.floor && (
                <span style={{ color: '#a78bfa', fontWeight: '800', marginLeft: '6px' }}>
                  • {machineConfig.floor}
                </span>
              )}
              {machineConfig?.station && (
                <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginLeft: '4px' }}>
                  ({machineConfig.station})
                </span>
              )}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* TOGGLE LBS / KG */}
            <div style={{ display: 'flex', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => handleUnitToggle('lbs')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: unit === 'lbs' ? 'var(--accent-blue)' : 'transparent',
                  color: unit === 'lbs' ? '#ffffff' : 'var(--text-muted)',
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
                  background: unit === 'kg' ? 'var(--accent-blue)' : 'transparent',
                  color: unit === 'kg' ? '#ffffff' : 'var(--text-muted)',
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
              style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={16} />
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
              padding: '9px',
              borderRadius: '12px',
              border: activeTab === 'plates' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
              background: activeTab === 'plates' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
              color: activeTab === 'plates' ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: '800',
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Disc size={15} /> Discos por Lado
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '12px',
              border: activeTab === 'stack' ? '2px solid #8b5cf6' : '1px solid var(--border-subtle)',
              background: activeTab === 'stack' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-surface-secondary)',
              color: activeTab === 'stack' ? '#a78bfa' : 'var(--text-muted)',
              fontWeight: '800',
              fontSize: '12.5px',
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
                  <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PESO TOTAL OBJETIVO</label>
                  <span className="font-mono-tech" style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--accent-blue)' }}>{targetWeight} {unit}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={targetWeight || ''}
                    onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                    className="font-mono-tech"
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      border: '2px solid var(--accent-blue)',
                      fontSize: '20px',
                      fontWeight: '900',
                      textAlign: 'center',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(unit === 'kg' ? [-10, -5, +5, +10] : [-20, -10, +10, +20]).map(delta => (
                      <button
                        key={delta}
                        type="button"
                        onClick={() => setTargetWeight(Math.max(baseWeight, targetWeight + delta))}
                        className="font-mono-tech"
                        style={{
                          padding: '8px 8px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-card)',
                          fontSize: '11px',
                          fontWeight: '800',
                          color: delta > 0 ? 'var(--accent-emerald)' : 'var(--accent-red)',
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
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>PESO BASE (BARRA / TRINEO)</span>
                  <span className="font-mono-tech" style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-main)' }}>{baseWeight} {unit}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
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
                        border: baseWeight === b.val ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                        background: baseWeight === b.val ? 'var(--accent-blue-light)' : 'var(--bg-card)',
                        color: baseWeight === b.val ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>✏️ O peso base manual:</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="Ej. 105"
                    value={baseWeight}
                    onChange={(e) => setBaseWeight(parseFloat(e.target.value) || 0)}
                    className="font-mono-tech"
                    style={{
                      width: '70px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--accent-blue)',
                      fontSize: '12px',
                      fontWeight: '900',
                      textAlign: 'center',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>{unit}</span>
                </div>
              </div>

              {/* DESGLOSE VISUAL DE DISCOS POR LADO */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '16px', color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cargar por cada lado:</span>
                  <strong className="font-mono-tech" style={{ fontSize: '17px', fontWeight: '900', color: 'var(--accent-cyan)' }}>{plateCalc.perSideWeight} {unit} / lado</strong>
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

              {/* CHECKBOX GUARDAR CALIBRACIÓN DISCOS */}
              <div 
                onClick={() => setSaveAsCalibration(!saveAsCalibration)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: saveAsCalibration ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                  border: `1.5px solid ${saveAsCalibration ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                  borderRadius: '12px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <input 
                  type="checkbox"
                  checked={saveAsCalibration}
                  onChange={(e) => setSaveAsCalibration(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-blue)' }}
                />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '900', color: saveAsCalibration ? 'var(--accent-blue)' : 'var(--text-main)' }}>
                    💾 Recordar peso base ({baseWeight} {unit}) para esta máquina
                  </div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                    Sincroniza el peso inicial del trineo/barra para próximas series y sesiones.
                  </div>
                </div>
              </div>

              {/* BOTÓN APLICAR */}
              <button
                type="button"
                onClick={() => handleApply(targetWeight)}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 230, 118, 0.25)'
                }}
              >
                <Check size={18} strokeWidth={3} /> Aplicar {targetWeight} {unit} a la serie
              </button>
            </>
          ) : (
            <>
              {/* MODO TORRE DE PLACAS SKEUOMÓRFICA */}

              {/* TIPO DE PROGRESIÓN DE LA TORRE */}
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>
                    TIPO DE TORRE DE PLACAS
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: '#a78bfa' }}>
                    {stackPreset === 'two_tens_then_twenty' ? '2 de 10 lb, luego +20' : 'Incremento Constante'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setStackPreset('two_tens_then_twenty')}
                    style={{
                      padding: '7px 6px',
                      borderRadius: '8px',
                      border: stackPreset === 'two_tens_then_twenty' ? '2px solid #8b5cf6' : '1px solid var(--border-subtle)',
                      background: stackPreset === 'two_tens_then_twenty' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                      color: stackPreset === 'two_tens_then_twenty' ? '#a78bfa' : 'var(--text-secondary)',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    ⚡ 2 de 10 lb, luego +20
                    <span style={{ display: 'block', fontSize: '8.5px', color: 'var(--text-muted)' }}>(10, 20, 40, 60...)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStackPreset('linear')}
                    style={{
                      padding: '7px 6px',
                      borderRadius: '8px',
                      border: stackPreset === 'linear' ? '2px solid #8b5cf6' : '1px solid var(--border-subtle)',
                      background: stackPreset === 'linear' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                      color: stackPreset === 'linear' ? '#a78bfa' : 'var(--text-secondary)',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    📏 Incremento Fijo / Manual
                    <span style={{ display: 'block', fontSize: '8.5px', color: 'var(--text-muted)' }}>(Personalizable)</span>
                  </button>
                </div>
              </div>

              {/* 1. PLACA #1 (CABEZAL / PRIMERA PESA) */}
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>
                    PLACA #1 (CABEZAL / INICIAL)
                  </span>
                  <span className="font-mono-tech" style={{ fontSize: '12px', fontWeight: '900', color: '#a78bfa' }}>
                    {topPlateWeight} {unit}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  {(unit === 'kg' ? [2.5, 5, 7.5, 10, 12.5] : [5, 7.5, 10, 12.5, 15, 20]).map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTopPlateWeight(val)}
                      className="font-mono-tech"
                      style={{
                        flex: '1 1 auto',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        border: topPlateWeight === val ? '1.5px solid #8b5cf6' : '1px solid var(--border-subtle)',
                        background: topPlateWeight === val ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                        color: topPlateWeight === val ? '#a78bfa' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {val} {unit}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>✏️ O cabezal manual:</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="Ej. 15"
                    value={topPlateWeight}
                    onChange={(e) => setTopPlateWeight(parseFloat(e.target.value) || 0)}
                    className="font-mono-tech"
                    style={{
                      width: '70px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1.5px solid #8b5cf6',
                      fontSize: '12px',
                      fontWeight: '900',
                      textAlign: 'center',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>{unit}</span>
                </div>
              </div>

              {/* 2. INCREMENTO POR PLACA */}
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>
                    {stackPreset === 'two_tens_then_twenty' 
                      ? 'INCREMENTO PLACAS (A PARTIR DE #3)' 
                      : 'INCREMENTO PLACAS (#2 EN ADELANTE)'}
                  </span>
                  <span className="font-mono-tech" style={{ fontSize: '12px', fontWeight: '900', color: '#a78bfa' }}>
                    +{stackIncrement} {unit}/placa
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  {(stackPreset === 'two_tens_then_twenty' 
                    ? (unit === 'kg' ? [10, 15, 20] : [15, 20, 25, 30])
                    : (unit === 'kg' ? [2.5, 5, 7.5, 10] : [5, 7.5, 10, 12.5, 15, 20])
                  ).map(inc => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setStackIncrement(inc)}
                      className="font-mono-tech"
                      style={{
                        flex: '1 1 auto',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        border: stackIncrement === inc ? '1.5px solid #8b5cf6' : '1px solid var(--border-subtle)',
                        background: stackIncrement === inc ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                        color: stackIncrement === inc ? '#a78bfa' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      +{inc} {unit}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>✏️ O salto manual:</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="Ej. 12.5"
                    value={stackIncrement}
                    onChange={(e) => setStackIncrement(parseFloat(e.target.value) || 0)}
                    className="font-mono-tech"
                    style={{
                      width: '70px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1.5px solid #8b5cf6',
                      fontSize: '12px',
                      fontWeight: '900',
                      textAlign: 'center',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>{unit}/placa</span>
                </div>
              </div>

              {/* 3. PESAS AUXILIARES / ADD-ONS (+2.5, +5, +7.5, +10 LBS) */}
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>
                    PESA AUXILIAR (PIN EXTRA / DIAL)
                  </span>
                  <span className="font-mono-tech" style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent-emerald)' }}>
                    {addOnWeight > 0 ? `+${addOnWeight} ${unit}` : 'Ninguna'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  {(unit === 'kg' ? [0, 1.25, 2.5, 3.75, 5] : [0, 2.5, 5, 7.5, 10]).map(extra => (
                    <button
                      key={extra}
                      type="button"
                      onClick={() => setAddOnWeight(extra)}
                      className="font-mono-tech"
                      style={{
                        flex: '1 1 auto',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        border: addOnWeight === extra ? '1.5px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                        background: addOnWeight === extra ? 'var(--accent-emerald-subtle)' : 'var(--bg-card)',
                        color: addOnWeight === extra ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {extra === 0 ? 'Sin extra' : `+${extra}`}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>✏️ O valor manual:</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="0"
                    value={addOnWeight}
                    onChange={(e) => setAddOnWeight(parseFloat(e.target.value) || 0)}
                    className="font-mono-tech"
                    style={{
                      width: '70px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--accent-emerald)',
                      fontSize: '12px',
                      fontWeight: '900',
                      textAlign: 'center',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)'
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>{unit}</span>
                </div>
              </div>

              {machineConfig && (
                <div style={{ background: 'var(--accent-blue-light)', border: '1px solid var(--accent-blue)', borderRadius: '10px', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '800' }}>
                    ⚙️ {stackPreset === 'two_tens_then_twenty' ? 'Torre: 2 de 10 lb, luego +20 lb' : `Torre (+${stackIncrement} ${unit}/placa)`}
                  </span>
                  {machineConfig.station && (
                    <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '700' }}>{machineConfig.station}</span>
                  )}
                </div>
              )}

              {/* 4. VISUALIZADOR SKEUOMÓRFICO DE LA TORRE DE PLACAS */}
              <div style={{
                maxHeight: '230px',
                overflowY: 'auto',
                background: 'var(--bg-app)',
                borderRadius: '16px',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                border: '1px solid var(--border-subtle)'
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
                          : (idx < selectedPlateIndex ? 'var(--bg-card)' : 'var(--bg-surface-secondary)'),
                        color: isSelected ? '#ffffff' : (idx < selectedPlateIndex ? 'var(--text-main)' : 'var(--text-muted)'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 0 12px rgba(168, 85, 247, 0.6)' : 'none',
                        borderLeft: isSelected ? '6px solid #fbbf24' : (isTopPlate ? '3px solid var(--accent-cyan)' : '3px solid transparent'),
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="font-mono-tech" style={{ fontSize: '10px', fontWeight: '800', opacity: 0.7, width: '22px' }}>#{plateNum}</span>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSelected ? '#fbbf24' : (isTopPlate ? 'var(--accent-cyan)' : 'var(--border-strong)') }} />
                        <strong className="font-mono-tech" style={{ fontSize: '13px', fontWeight: '900' }}>
                          {weightForPlate} {unit}
                        </strong>
                        {isTopPlate && (
                          <span style={{ fontSize: '9px', background: 'var(--accent-cyan)', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
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
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Peso efectivo seleccionado:</span>
                <div className="font-mono-tech" style={{ fontSize: '24px', fontWeight: '900', color: '#a78bfa' }}>
                  {currentStackWeight} {unit}
                  {addOnWeight > 0 && <span style={{ fontSize: '13px', color: 'var(--accent-emerald)', marginLeft: '6px' }}>(+{addOnWeight} {unit} extra)</span>}
                </div>
                {unit === 'kg' && (
                  <div className="font-mono-tech" style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-blue)', marginTop: '2px' }}>
                    ≈ {convertedToLbs} lbs equivalentes
                  </div>
                )}
              </div>

              {/* CHECKBOX GUARDAR CALIBRACIÓN TORRE */}
              <div 
                onClick={() => setSaveAsCalibration(!saveAsCalibration)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: saveAsCalibration ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-surface-secondary)',
                  border: `1.5px solid ${saveAsCalibration ? '#8b5cf6' : 'var(--border-subtle)'}`,
                  borderRadius: '12px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <input 
                  type="checkbox"
                  checked={saveAsCalibration}
                  onChange={(e) => setSaveAsCalibration(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#8b5cf6' }}
                />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '900', color: saveAsCalibration ? '#a78bfa' : 'var(--text-main)' }}>
                    💾 Recordar como calibración oficial de esta máquina
                  </div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                    Guarda el cabezal ({topPlateWeight} {unit}) y saltos ({stackPreset === 'two_tens_then_twenty' ? '2 de 10 lb, luego +20' : `+${stackIncrement} ${unit}`}) para próximas series y sesiones.
                  </div>
                </div>
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
                    fontSize: '13.5px',
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
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-secondary)',
                      color: 'var(--text-secondary)',
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
