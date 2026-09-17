import React, { useState, useEffect } from 'react';
import { 
  X, Settings2, Check, RotateCcw, Disc, Cable, Dumbbell, 
  MapPin, Building2, Plus, Trash2, Star, Sliders 
} from 'lucide-react';

export default function MachineConfigModal({
  isOpen,
  onClose,
  exerciseName = '',
  exerciseId = '',
  currentConfig = null,
  profiles = [],
  onSaveConfig,
  onOpenCalculator
}) {
  const lowerName = (exerciseName || '').toLowerCase();
  const isPlateDefault = lowerName.includes('prensa') || lowerName.includes('leg press') || lowerName.includes('hack') || lowerName.includes('smith') || lowerName.includes('barra');
  const isDumbbellDefault = lowerName.includes('mancuerna') || lowerName.includes('dumbbell');
  const defaultType = isPlateDefault ? 'plates' : (isDumbbellDefault ? 'dumbbells' : 'stack');
  const defaultSled = lowerName.includes('prensa') ? 100 : (lowerName.includes('hack') ? 75 : (lowerName.includes('smith') ? 20 : 45));

  // Lista de perfiles de máquina guardados
  const [profileList, setProfileList] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);

  // Campos del perfil activo
  const [name, setName] = useState('');
  const [floor, setFloor] = useState('');
  const [station, setStation] = useState('');
  const [seat, setSeat] = useState('');
  const [backrest, setBackrest] = useState('');
  const [notch, setNotch] = useState('');
  const [pad, setPad] = useState('');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Tipo de Resistencia
  const [type, setType] = useState(defaultType);

  // Stack / Placas
  const [stackPreset, setStackPreset] = useState('linear');
  const [plateStep, setPlateStep] = useState(10);
  const [firstPlate, setFirstPlate] = useState(10);
  const [microWeight, setMicroWeight] = useState(0);

  // Prensa / Discos
  const [baseWeight, setBaseWeight] = useState(defaultSled);
  const [availablePlates, setAvailablePlates] = useState([45, 35, 25, 10, 5, 2.5]);

  // Mancuernas
  const [dumbbellStep, setDumbbellStep] = useState(5);

  // Cargar estado inicial al abrir modal
  useEffect(() => {
    if (!isOpen) return;

    let initProfiles = Array.isArray(profiles) && profiles.length > 0 ? [...profiles] : [];

    // Si no hay perfiles en props, buscar si currentConfig existe
    if (initProfiles.length === 0) {
      if (currentConfig && (currentConfig.name || currentConfig.floor || currentConfig.station || currentConfig.seat)) {
        initProfiles = [{
          id: currentConfig.id || 'prof_1',
          name: currentConfig.name || `${currentConfig.station || 'Máquina 1'} (${currentConfig.floor || 'PB'})`,
          floor: currentConfig.floor || 'Planta Baja',
          station: currentConfig.station || '',
          seat: currentConfig.seat || '',
          backrest: currentConfig.backrest || '',
          notch: currentConfig.notch || '',
          pad: currentConfig.pad || '',
          notes: currentConfig.notes || '',
          isDefault: true,
          type: currentConfig.type || defaultType,
          stackPreset: currentConfig.stackPreset || 'linear',
          plateStep: currentConfig.plateStep !== undefined ? currentConfig.plateStep : 10,
          firstPlate: currentConfig.firstPlate !== undefined ? currentConfig.firstPlate : 10,
          microWeight: currentConfig.microWeight || 0,
          baseWeight: currentConfig.baseWeight !== undefined ? currentConfig.baseWeight : defaultSled,
          availablePlates: currentConfig.availablePlates || [45, 35, 25, 10, 5, 2.5],
          dumbbellStep: currentConfig.dumbbellStep || 5
        }];
      } else {
        // Perfil por defecto inicial
        initProfiles = [{
          id: 'prof_default',
          name: `${exerciseName} (Principal)`,
          floor: 'Planta Baja',
          station: 'Máquina #1',
          seat: '',
          backrest: '',
          notch: '',
          pad: '',
          notes: '',
          isDefault: true,
          type: defaultType,
          stackPreset: lowerName.includes('extension') ? 'two_tens_then_twenty' : 'linear',
          plateStep: 10,
          firstPlate: 10,
          microWeight: 0,
          baseWeight: defaultSled,
          availablePlates: [45, 35, 25, 10, 5, 2.5],
          dumbbellStep: 5
        }];
      }
    }

    setProfileList(initProfiles);

    // Seleccionar perfil activo (priorizar el coincidente con currentConfig o el marcado como default)
    let selected = initProfiles.find(p => p.id === currentConfig?.id) 
      || initProfiles.find(p => p.isDefault) 
      || initProfiles[0];

    loadProfileIntoForm(selected);
  }, [isOpen, currentConfig, profiles]);

  const loadProfileIntoForm = (prof) => {
    if (!prof) return;
    setActiveProfileId(prof.id);
    setName(prof.name || '');
    setFloor(prof.floor || '');
    setStation(prof.station || '');
    setSeat(prof.seat || '');
    setBackrest(prof.backrest || '');
    setNotch(prof.notch || '');
    setPad(prof.pad || '');
    setNotes(prof.notes || '');
    setIsDefault(!!prof.isDefault);
    setType(prof.type || defaultType);
    setStackPreset(prof.stackPreset || (lowerName.includes('extension') ? 'two_tens_then_twenty' : 'linear'));
    setPlateStep(prof.plateStep !== undefined ? prof.plateStep : 10);
    setFirstPlate(prof.firstPlate !== undefined ? prof.firstPlate : 10);
    setMicroWeight(prof.microWeight || 0);
    setBaseWeight(prof.baseWeight !== undefined ? prof.baseWeight : defaultSled);
    setAvailablePlates(prof.availablePlates || [45, 35, 25, 10, 5, 2.5]);
    setDumbbellStep(prof.dumbbellStep || 5);
  };

  const getCurrentFormSnapshot = () => {
    const fp = parseFloat(firstPlate) || 10;
    const st = parseFloat(plateStep) || (stackPreset === 'two_tens_then_twenty' ? 20 : 10);
    return {
      id: activeProfileId,
      name: (name || station || `Máquina (${floor || 'Gym'})`).trim(),
      floor: (floor || '').trim(),
      station: (station || '').trim(),
      seat: (seat || '').toString().trim(),
      backrest: (backrest || '').toString().trim(),
      notch: (notch || '').toString().trim(),
      pad: (pad || '').toString().trim(),
      notes: (notes || '').trim(),
      isDefault: !!isDefault,
      type,
      stackPreset,
      plateStep: st,
      firstPlate: fp,
      microWeight: parseFloat(microWeight) || 0,
      baseWeight: parseFloat(baseWeight) || 0,
      availablePlates,
      smallestPlate,
      dumbbellStep: parseFloat(dumbbellStep) || 5,
      updatedAt: new Date().toISOString()
    };
  };

  const handleSelectProfile = (targetProf) => {
    if (!targetProf || targetProf.id === activeProfileId) return;
    const currentSnap = getCurrentFormSnapshot();
    setProfileList(prev => prev.map(p => p.id === activeProfileId ? { ...p, ...currentSnap } : p));
    loadProfileIntoForm(targetProf);
  };

  const handleCreateNewProfile = () => {
    const currentSnap = getCurrentFormSnapshot();
    const newId = `prof_${Date.now()}`;
    const newNum = profileList.length + 1;
    const targetFloor = floor === 'Planta Baja' ? 'Planta Alta' : (floor === 'Planta Alta' ? 'Planta Baja' : 'Planta Alta');
    const newProf = {
      id: newId,
      name: `Máquina #${newNum} (${targetFloor})`,
      floor: targetFloor,
      station: `Máquina #${newNum}`,
      seat: '',
      backrest: '',
      notch: '',
      pad: '',
      notes: '',
      isDefault: false,
      type: defaultType,
      stackPreset: 'linear',
      plateStep: 10,
      firstPlate: 10,
      microWeight: 0,
      baseWeight: defaultSled,
      availablePlates: [45, 35, 25, 10, 5, 2.5],
      dumbbellStep: 5
    };
    setProfileList(prev => [
      ...prev.map(p => p.id === activeProfileId ? { ...p, ...currentSnap } : p),
      newProf
    ]);
    loadProfileIntoForm(newProf);
  };

  const handleDeleteProfile = (profId) => {
    if (profileList.length <= 1) return;
    const remaining = profileList.filter(p => p.id !== profId);
    setProfileList(remaining);
    loadProfileIntoForm(remaining[0]);
  };

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

  const handleSave = () => {
    const currentProfileData = getCurrentFormSnapshot();
    let calculatedAvailableWeights = [];
    const fp = currentProfileData.firstPlate;
    const st = currentProfileData.plateStep;

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

    currentProfileData.availableWeights = calculatedAvailableWeights;
    currentProfileData.minIncrement = type === 'plates' 
      ? minPlateIncrement 
      : (type === 'stack' ? (currentProfileData.microWeight > 0 ? currentProfileData.microWeight : (stackPreset === 'two_tens_then_twenty' ? Math.min(fp, st) : st)) : currentProfileData.dumbbellStep);

    // Actualizar lista de perfiles
    let updatedProfiles = profileList.map(p => {
      if (p.id === currentProfileData.id) {
        return currentProfileData;
      }
      // Si el actual se marcó como default, desmarcar los demás
      if (isDefault) {
        return { ...p, isDefault: false };
      }
      return p;
    });

    if (!updatedProfiles.some(p => p.id === currentProfileData.id)) {
      updatedProfiles.push(currentProfileData);
    }

    onSaveConfig(currentProfileData, updatedProfiles);
    onClose();
  };

  const handleReset = () => {
    onSaveConfig(null, []);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '16px',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '22px',
          maxWidth: '480px',
          width: '100%',
          margin: 'auto 0',
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
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#0066ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Settings2 size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
                Gestor de Máquinas & Calibración
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

        {/* 1. SELECTOR Y GESTOR DE MÁQUINAS (MULTI-PERFILES) */}
        <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sliders size={13} color="#0066ff" /> Mis Máquinas Guardadas:
            </label>
            <button
              type="button"
              onClick={handleCreateNewProfile}
              style={{
                padding: '3px 8px',
                borderRadius: '8px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#0066ff',
                fontSize: '10.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Plus size={12} /> Nueva Máquina
            </button>
          </div>

          {/* LISTA DE PESTAÑAS / MÁQUINAS DISPONIBLES */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '8px' }}>
            {profileList.map((prof) => {
              const isSelected = prof.id === activeProfileId;
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => handleSelectProfile(prof)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #0066ff' : '1px solid #cbd5e1',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#0066ff' : '#475569',
                    fontWeight: isSelected ? '900' : '700',
                    fontSize: '11px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: isSelected ? '0 2px 6px rgba(0,102,255,0.15)' : 'none'
                  }}
                >
                  {prof.isDefault && <Star size={11} fill="#f59e0b" color="#f59e0b" />}
                  <span>{prof.name || 'Máquina'}</span>
                </button>
              );
            })}
          </div>

          {/* NOMBRE DEL PERFIL ACTIVO */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Nombre descriptivo (ej. Nautilus Nitro PB o Cybex PA)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '11.5px',
                fontWeight: '800',
                background: '#ffffff'
              }}
            />
            {profileList.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteProfile(activeProfileId)}
                style={{
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  cursor: 'pointer'
                }}
                title="Eliminar este perfil de máquina"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 2. CALIBRACIÓN BIOMECÁNICA (ASIENTO, RESPALDO, MUESCA, RODILLO) */}
        <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '14px', padding: '12px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#166534', textTransform: 'uppercase', marginBottom: '8px' }}>
            📐 Calibración de Posición Biomecánica:
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* ASIENTO */}
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#14532d', display: 'block', marginBottom: '3px' }}>
                🪑 Asiento / Sillín:
              </span>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {['1', '2', '3', '4', '5', '6', '7'].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSeat(seat === num ? '' : num)}
                    style={{
                      padding: '3px 6px',
                      borderRadius: '6px',
                      border: seat === num ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                      background: seat === num ? '#dcfce7' : '#ffffff',
                      color: seat === num ? '#166534' : '#475569',
                      fontSize: '10px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ej. 4 o Medio"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                  fontWeight: '700',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* RESPALDO */}
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#14532d', display: 'block', marginBottom: '3px' }}>
                📐 Respaldo / Inclinación:
              </span>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {['1', '2', '3', '30°', '45°', 'Plano'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBackrest(backrest === opt ? '' : opt)}
                    style={{
                      padding: '3px 6px',
                      borderRadius: '6px',
                      border: backrest === opt ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                      background: backrest === opt ? '#dcfce7' : '#ffffff',
                      color: backrest === opt ? '#166534' : '#475569',
                      fontSize: '10px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ej. 2 o 30°"
                value={backrest}
                onChange={(e) => setBackrest(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                  fontWeight: '700',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* MUESCA / PIN POLEA */}
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#14532d', display: 'block', marginBottom: '3px' }}>
                📍 Muesca / Pin de Polea:
              </span>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {['Baja', 'Media', 'Alta', '8', '12', '16'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setNotch(notch === opt ? '' : opt)}
                    style={{
                      padding: '3px 6px',
                      borderRadius: '6px',
                      border: notch === opt ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                      background: notch === opt ? '#dcfce7' : '#ffffff',
                      color: notch === opt ? '#166534' : '#475569',
                      fontSize: '10px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ej. Muesca 10"
                value={notch}
                onChange={(e) => setNotch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                  fontWeight: '700',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* RODILLO / SOPORTE MUSLOS */}
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#14532d', display: 'block', marginBottom: '3px' }}>
                🦵 Rodillo / Soporte Muslos:
              </span>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {['1', '2', '3', '4', 'Apretado'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPad(pad === opt ? '' : opt)}
                    style={{
                      padding: '3px 6px',
                      borderRadius: '6px',
                      border: pad === opt ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                      background: pad === opt ? '#dcfce7' : '#ffffff',
                      color: pad === opt ? '#166534' : '#475569',
                      fontSize: '10px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ej. Posición 3"
                value={pad}
                onChange={(e) => setPad(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                  fontWeight: '700',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. UBICACIÓN Y ESTACIÓN EN EL GIMNASIO */}
        <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Building2 size={15} color="#7c3aed" />
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase' }}>
              Piso / Estación:
            </label>
          </div>
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
                  padding: '7px 6px',
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

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {['Máquina #1', 'Máquina #2', 'Torre 1', 'Torre 2', 'Polea Alta', 'Polea Baja'].map(st => (
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
            placeholder="Detalle de estación (ej. Al lado de mancuernas)"
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

        {/* 4. TIPO DE RESISTENCIA Y CARGAS */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            Tipo de Resistencia / Cargas:
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

        {/* PARÁMETROS SEGÚN TIPO */}
        {type === 'stack' && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                  Placa #1 (Cabezal inicial):
                </span>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#0066ff' }}>
                  {firstPlate} lbs
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
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
                    {fp}#
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                  Salto por placa:
                </span>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#0066ff' }}>
                  +{plateStep} lbs
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {[5, 7.5, 10, 12.5, 15, 20].map(step => (
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
                    +{step}#
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                  Micro-cargas extra:
                </span>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>
                  {microWeight > 0 ? `+${microWeight} lbs` : 'Ninguna'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
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
            </div>
          </div>
        )}

        {type === 'plates' && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                  Peso base trineo / máquina vacía:
                </span>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#0066ff' }}>
                  {baseWeight} lbs
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
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
                    {bw}#
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                Discos disponibles:
              </span>
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
            </div>
          </div>
        )}

        {type === 'dumbbells' && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
              Salto disponible de mancuernas:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { val: 2.5, label: 'De 2.5 en 2.5 lbs (17.5, 20, 22.5...)' },
                { val: 5, label: 'De 5 en 5 lbs (20, 25, 30...)' }
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
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NOTAS Y DEFAULT */}
        <div>
          <input
            type="text"
            placeholder="Notas de esta máquina (ej. Poner toalla, fricción en cable...)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '11px',
              fontWeight: '700',
              boxSizing: 'border-box',
              background: '#ffffff',
              marginBottom: '8px'
            }}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '800', color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#0066ff' }}
            />
            ⭐ Usar siempre como máquina predeterminada para este ejercicio
          </label>
        </div>

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
                title="Restablecer calibración"
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
              <Check size={16} strokeWidth={3} /> Guardar y Usar Máquina
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
