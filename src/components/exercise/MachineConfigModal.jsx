import React, { useState } from 'react';
import { X, Settings2, Check, RotateCcw, Disc, Cable, Dumbbell, MapPin, Building2 } from 'lucide-react';

export default function MachineConfigModal({
  isOpen,
  onClose,
  exerciseName = '',
  exerciseId = '',
  currentConfig = null,
  onSaveConfig,
  onOpenCalculator
}) {
  if (!isOpen) return null;

  const lowerName = (exerciseName || '').toLowerCase();
  const isPlateDefault = lowerName.includes('prensa') || lowerName.includes('leg press') || lowerName.includes('hack') || lowerName.includes('smith') || lowerName.includes('barra');
  const isDumbbellDefault = lowerName.includes('mancuerna') || lowerName.includes('dumbbell');
  
  const defaultType = isPlateDefault ? 'plates' : (isDumbbellDefault ? 'dumbbells' : 'stack');

  const [type, setType] = useState(currentConfig?.type || defaultType);
  const [floor, setFloor] = useState(currentConfig?.floor || '');
  const [station, setStation] = useState(currentConfig?.station || '');
  
  // Placas / Torre
  const defaultStackPreset = currentConfig?.stackPreset || (lowerName.includes('extension') ? 'two_tens_then_twenty' : 'linear');
  const [stackPreset, setStackPreset] = useState(defaultStackPreset);
  const [plateStep, setPlateStep] = useState(currentConfig?.plateStep !== undefined ? currentConfig.plateStep : 10);
  const [firstPlate, setFirstPlate] = useState(currentConfig?.firstPlate !== undefined ? currentConfig.firstPlate : 10);
  const [microWeight, setMicroWeight] = useState(currentConfig?.microWeight !== undefined ? currentConfig.microWeight : 0);

  // Prensa / Discos
  const defaultSled = lowerName.includes('prensa') ? 100 : (lowerName.includes('hack') ? 75 : (lowerName.includes('smith') ? 20 : 45));
  const [baseWeight, setBaseWeight] = useState(currentConfig?.baseWeight !== undefined ? currentConfig.baseWeight : defaultSled);
  const [availablePlates, setAvailablePlates] = useState(currentConfig?.availablePlates || [45, 35, 25, 10, 5, 2.5]);

  // Mancuernas
  const [dumbbellStep, setDumbbellStep] = useState(currentConfig?.dumbbellStep || 5);

  const togglePlate = (p) => {
    if (availablePlates.includes(p)) {
      if (availablePlates.length <= 1) return;
      setAvailablePlates(availablePlates.filter(x => x !== p));
    } else {
      setAvailablePlates([...availablePlates, p].sort((a, b) => b - a));
    }
  };

  const smallestPlate = availablePlates.length > 0 ? Math.min(...availablePlates) : 5;
  const minPlateIncrement = smallestPlate * 2;

  // Combinación de ubicación y estación
  const fullStationName = [floor, station].filter(Boolean).join(' • ');

  const handleSave = () => {
    // Generar lista física de pesos disponibles en la máquina
    let calculatedAvailableWeights = [];
    const fp = parseFloat(firstPlate) || 10;
    const st = parseFloat(plateStep) || (stackPreset === 'two_tens_then_twenty' ? 20 : 10);

    if (type === 'stack') {
      if (stackPreset === 'two_tens_then_twenty') {
        calculatedAvailableWeights = [fp, fp * 2];
        for (let i = 1; i <= 18; i++) {
          calculatedAvailableWeights.push((fp * 2) + (i * st));
        }
      } else {
        calculatedAvailableWeights = Array.from({ length: 20 }, (_, i) => fp + (i * st));
      }
    }

    const configData = {
      type,
      floor: floor.trim(),
      station: (fullStationName || station).trim(),
      // Stack
      stackPreset,
      plateStep: st,
      firstPlate: fp,
      microWeight: parseFloat(microWeight) || 0,
      availableWeights: calculatedAvailableWeights,
      // Plates
      baseWeight: parseFloat(baseWeight) || 0,
      availablePlates,
      smallestPlate,
      // Dumbbells
      dumbbellStep: parseFloat(dumbbellStep) || 5,
      // General
      minIncrement: type === 'plates' 
        ? minPlateIncrement 
        : (type === 'stack' ? (microWeight > 0 ? microWeight : (stackPreset === 'two_tens_then_twenty' ? Math.min(fp, st) : st)) : parseFloat(dumbbellStep) || 5),
      updatedAt: new Date().toISOString()
    };

    onSaveConfig(configData);
    onClose();
  };

  const handleReset = () => {
    onSaveConfig(null);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '20px', maxWidth: '460px', width: '100%', margin: 'auto 0',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          padding: '20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: '#0066ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Settings2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
                Calibrar Máquina & Ubicación
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
                {exerciseName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. SELECCIÓN DE PLANTA / PISO DEL GIMNASIO (DIFERENCIADOR CLAVE) */}
        <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Building2 size={15} color="#7c3aed" />
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase' }}>
              Piso / Ubicación en el Gimnasio:
            </label>
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: '10.5px', color: '#64748b', lineHeight: '1.3' }}>
            Si la misma máquina existe en dos pisos, los cables o poleas se sienten distintos. Selecciona dónde estás entrenando:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
            {[
              { id: 'Planta Baja', label: '🏢 Planta Baja' },
              { id: 'Planta Alta', label: '🏢 Planta Alta' }
            ].map(fl => (
              <button
                key={fl.id}
                type="button"
                onClick={() => setFloor(floor === fl.id ? '' : fl.id)}
                style={{
                  padding: '8px 6px',
                  borderRadius: '10px',
                  border: floor === fl.id ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                  background: floor === fl.id ? '#f5f3ff' : '#ffffff',
                  color: floor === fl.id ? '#7c3aed' : '#334155',
                  fontWeight: floor === fl.id ? '900' : '700',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {fl.label}
              </button>
            ))}
          </div>

          {/* MÁQUINA / POLEA ESPECÍFICA */}
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>
            Estación o Polea:
          </label>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {[
              '🔼 Polea Alta (Superior)',
              '🔽 Polea Baja (Inferior)',
              '↔️ Polea Media',
              'Torre 1',
              'Torre 2',
              'Máquina #1',
              'Máquina #2'
            ].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStation(station === st ? '' : st)}
                style={{
                  padding: '3px 7px',
                  borderRadius: '7px',
                  border: station === st ? '1.5px solid #0066ff' : '1px solid #cbd5e1',
                  background: station === st ? '#eff6ff' : '#ffffff',
                  color: station === st ? '#0066ff' : '#64748b',
                  fontSize: '9.5px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="O escribe detalle (ej. Planta baja junto a mancuernas)"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '11px',
              fontWeight: '700',
              boxSizing: 'border-box',
              background: '#ffffff'
            }}
          />
        </div>

        {/* 2. TIPO DE RESISTENCIA */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            Tipo de Resistencia / Aparato:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {[
              { id: 'stack', label: 'Torre / Polea', icon: <Cable size={14} /> },
              { id: 'plates', label: 'Prensa / Discos', icon: <Disc size={14} /> },
              { id: 'dumbbells', label: 'Mancuernas', icon: <Dumbbell size={14} /> }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setType(m.id)}
                style={{
                  padding: '8px 4px',
                  borderRadius: '10px',
                  border: type === m.id ? '2px solid #0066ff' : '1px solid #cbd5e1',
                  background: type === m.id ? '#eff6ff' : '#f8fafc',
                  color: type === m.id ? '#0066ff' : '#475569',
                  fontWeight: type === m.id ? '900' : '700',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. PARÁMETROS SEGÚN TIPO */}
        {type === 'stack' && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                Progresión de la Torre de Placas:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '6px' }}>
                <button
                  type="button"
                  onClick={() => setStackPreset('two_tens_then_twenty')}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '10px',
                    border: stackPreset === 'two_tens_then_twenty' ? '2px solid #0066ff' : '1px solid #cbd5e1',
                    background: stackPreset === 'two_tens_then_twenty' ? '#eff6ff' : '#ffffff',
                    color: stackPreset === 'two_tens_then_twenty' ? '#0066ff' : '#334155',
                    fontSize: '10.5px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  ⚡ 2 de 10 lb, luego +20 lb
                  <span style={{ display: 'block', fontSize: '9px', color: '#64748b', fontWeight: '600' }}>(10, 20, 40, 60... lbs)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStackPreset('linear')}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '10px',
                    border: stackPreset === 'linear' ? '2px solid #0066ff' : '1px solid #cbd5e1',
                    background: stackPreset === 'linear' ? '#eff6ff' : '#ffffff',
                    color: stackPreset === 'linear' ? '#0066ff' : '#334155',
                    fontSize: '10.5px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  📏 Incremento Fijo / Manual
                  <span style={{ display: 'block', fontSize: '9px', color: '#64748b', fontWeight: '600' }}>(Personalizable por placa)</span>
                </button>
              </div>
            </div>

            {/* CABEZAL INICIAL (PLACA #1) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                  Placa #1 (Cabezal inicial / Peso mínimo):
                </label>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#0066ff' }}>
                  {firstPlate} lbs/kg
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                {[5, 7.5, 10, 12.5, 15, 20].map(fp => (
                  <button
                    key={fp}
                    type="button"
                    onClick={() => setFirstPlate(fp)}
                    style={{
                      flex: '1 1 auto',
                      padding: '5px 8px',
                      borderRadius: '8px',
                      border: firstPlate === fp ? '2px solid #0066ff' : '1px solid #cbd5e1',
                      background: firstPlate === fp ? '#eff6ff' : '#ffffff',
                      color: firstPlate === fp ? '#0066ff' : '#334155',
                      fontWeight: '800',
                      fontSize: '10.5px',
                      cursor: 'pointer'
                    }}
                  >
                    {fp}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>✏️ O cabezal manual:</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  placeholder="Ej. 15"
                  value={firstPlate}
                  onChange={(e) => setFirstPlate(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '75px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1.5px solid #0066ff',
                    fontSize: '12px',
                    fontWeight: '900',
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#0f172a'
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>lbs / kg</span>
              </div>
            </div>

            {/* SALTOS DE PESO POR PLACA */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                  {stackPreset === 'two_tens_then_twenty' 
                    ? 'Salto a partir de Placa #3 (tras 2 iniciales):' 
                    : 'Salto de peso por placa en esta torre:'}
                </label>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#0066ff' }}>
                  +{plateStep} lbs/kg
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                {(stackPreset === 'two_tens_then_twenty' ? [15, 20, 25, 30] : [5, 7.5, 10, 12.5, 15, 20]).map(step => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setPlateStep(step)}
                    style={{
                      flex: '1 1 auto',
                      padding: '5px 8px',
                      borderRadius: '8px',
                      border: plateStep === step ? '2px solid #0066ff' : '1px solid #cbd5e1',
                      background: plateStep === step ? '#eff6ff' : '#ffffff',
                      color: plateStep === step ? '#0066ff' : '#334155',
                      fontWeight: '800',
                      fontSize: '10.5px',
                      cursor: 'pointer'
                    }}
                  >
                    +{step}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>✏️ O salto manual:</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  placeholder="Ej. 12.5"
                  value={plateStep}
                  onChange={(e) => setPlateStep(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '75px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1.5px solid #0066ff',
                    fontSize: '12px',
                    fontWeight: '900',
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#0f172a'
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>lbs / kg por placa</span>
              </div>
            </div>

            {/* MICRO-CARGAS EXTRA */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                  Micro-cargas o pesitas selectoras extra:
                </label>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>
                  {microWeight > 0 ? `+${microWeight}` : 'Ninguna'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                {[
                  { val: 0, label: 'Ninguna' },
                  { val: 2.5, label: '+2.5 lbs' },
                  { val: 5, label: '+5 lbs' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setMicroWeight(item.val)}
                    style={{
                      flex: 1,
                      padding: '6px 2px',
                      borderRadius: '8px',
                      border: microWeight === item.val ? '2px solid #10b981' : '1px solid #cbd5e1',
                      background: microWeight === item.val ? '#ecfdf5' : '#ffffff',
                      color: microWeight === item.val ? '#065f46' : '#334155',
                      fontWeight: '900',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>✏️ O valor manual:</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  placeholder="0"
                  value={microWeight}
                  onChange={(e) => setMicroWeight(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '75px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1.5px solid #10b981',
                    fontSize: '12px',
                    fontWeight: '900',
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#065f46'
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>lbs / kg</span>
              </div>
            </div>
          </div>
        )}

        {type === 'plates' && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                  Peso base del trineo / máquina vacía:
                </label>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#0066ff' }}>
                  {baseWeight} lbs/kg
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                {[0, 20, 45, 75, 100, 118].map(bw => (
                  <button
                    key={bw}
                    type="button"
                    onClick={() => setBaseWeight(bw)}
                    style={{
                      flex: '1 1 auto',
                      padding: '5px 8px',
                      borderRadius: '8px',
                      border: baseWeight === bw ? '2px solid #0066ff' : '1px solid #cbd5e1',
                      background: baseWeight === bw ? '#eff6ff' : '#ffffff',
                      color: baseWeight === bw ? '#0066ff' : '#334155',
                      fontWeight: '800',
                      fontSize: '10.5px',
                      cursor: 'pointer'
                    }}
                  >
                    {bw}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>✏️ O peso base manual:</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  placeholder="Ej. 105"
                  value={baseWeight}
                  onChange={(e) => setBaseWeight(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '75px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1.5px solid #0066ff',
                    fontSize: '12px',
                    fontWeight: '900',
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#0f172a'
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>lbs / kg</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                Discos disponibles en tu gym:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                {[45, 35, 25, 10, 5, 2.5].map(p => {
                  const isChecked = availablePlates.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlate(p)}
                      style={{
                        padding: '6px 2px',
                        borderRadius: '8px',
                        border: isChecked ? '2px solid #10b981' : '1px solid #cbd5e1',
                        background: isChecked ? '#ecfdf5' : '#ffffff',
                        color: isChecked ? '#065f46' : '#94a3b8',
                        fontWeight: '900',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {isChecked ? '✓' : ''} {p}#
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: '6px', fontSize: '10.5px', color: '#0369a1', fontWeight: '700' }}>
                💡 Disco menor disponible: <strong>{smallestPlate} lbs</strong> ➔ Progresión mínima: <strong>+{minPlateIncrement} lbs</strong> (por lado).
              </div>
            </div>
          </div>
        )}

        {type === 'dumbbells' && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
              Salto disponible de mancuernas:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { val: 2.5, label: 'De 2.5 en 2.5 lbs (ej. 17.5, 20, 22.5...)' },
                { val: 5, label: 'De 5 en 5 lbs (ej. 20, 25, 30...)' }
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setDumbbellStep(item.val)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: dumbbellStep === item.val ? '2px solid #0066ff' : '1px solid #cbd5e1',
                    background: dumbbellStep === item.val ? '#eff6ff' : '#ffffff',
                    color: dumbbellStep === item.val ? '#0066ff' : '#334155',
                    fontWeight: '900',
                    fontSize: '10.5px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACCIONES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentConfig && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '11px 14px',
                  fontSize: '11.5px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Restablecer a valores por defecto"
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '11px',
                fontSize: '13px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)'
              }}
            >
              <Check size={16} strokeWidth={3} /> Guardar Calibración
            </button>
          </div>

          {onOpenCalculator && (
            <button
              type="button"
              onClick={() => {
                handleSave();
                onOpenCalculator();
              }}
              style={{
                width: '100%',
                background: '#f5f3ff',
                color: '#7c3aed',
                border: '1.5px solid #c4b5fd',
                borderRadius: '12px',
                padding: '10px 12px',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              🏋️ Guardar & Abrir Calculadora de Carga
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
