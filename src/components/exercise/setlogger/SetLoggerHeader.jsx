import React from 'react';
import { Settings2, BarChart2 } from 'lucide-react';

function getMachineStepLabel(machineConfig) {
  if (!machineConfig) return '±5 lbs';
  if (machineConfig.type === 'plates' && Array.isArray(machineConfig.availablePlates) && machineConfig.availablePlates.length > 0) {
    return `±${Math.min(...machineConfig.availablePlates) * 2} lbs`;
  }
  if (machineConfig.type === 'dumbbells') {
    return `±${machineConfig.dumbbellStep || 5} lbs`;
  }
  const step = machineConfig.plateStep || machineConfig.step || machineConfig.minIncrement || 5;
  return `±${step} lbs`;
}

function getShortMachineLabel(machineConfig, exercise) {
  if (machineConfig?.station && machineConfig.station !== 'Máquina #1') return machineConfig.station;
  if (machineConfig?.name) return machineConfig.name;
  if (machineConfig?.type === 'dumbbells') return 'Mancuernas';
  if (machineConfig?.type === 'plates') return 'Discos';
  const rawName = (exercise?.name || 'Máquina').split('(')[0].trim();
  return rawName.length > 20 ? `${rawName.slice(0, 18)}…` : rawName;
}

export default function SetLoggerHeader({
  isStrictlyBilateral,
  isUnilateral,
  onUpdateExerciseMeta,
  machineConfig,
  exerciseProfiles = [],
  exercise,
  handleSelectMachineProfile,
  setIsMachineConfigOpen,
  setIsScienceModalOpen
}) {
  const machineLabel = getShortMachineLabel(machineConfig, exercise);
  const stepLabel = getMachineStepLabel(machineConfig);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '6px',
      marginBottom: '8px',
      width: '100%',
      flexWrap: 'nowrap'
    }}>
      {/* IZQUIERDA: MÁQUINA + INCREMENTO ACTIVO + CONFIG DISCRETA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flex: 1 }}>
        <button
          type="button"
          onClick={() => setIsMachineConfigOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '4px 8px',
            cursor: 'pointer',
            minWidth: 0,
            maxWidth: '100%'
          }}
          title="Configurar estación, placas, asiento o respaldo"
        >
          <Settings2 size={12} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
          <span className="font-mono-tech" style={{
            fontSize: '10.5px',
            fontWeight: '800',
            color: 'var(--text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {machineLabel} · {stepLabel}
          </span>
        </button>

        {exerciseProfiles.length > 1 && (
          <select
            id={`machine-profile-${exercise?.id || 'ex'}`}
            name={`machine_profile_${exercise?.id || 'ex'}`}
            aria-label={`Perfil de máquina para ${exercise?.name || 'ejercicio'}`}
            value={machineConfig?.id || exerciseProfiles[0]?.id || ''}
            onChange={(e) => handleSelectMachineProfile(e.target.value)}
            style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '3px 4px',
              fontSize: '9.5px',
              fontWeight: '800',
              color: 'var(--text-secondary)',
              maxWidth: '90px',
              cursor: 'pointer'
            }}
          >
            {exerciseProfiles.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.floor ? `${prof.floor}: ` : ''}{prof.station || prof.name}
              </option>
            ))}
            <option value="__NEW__">+ Nueva…</option>
          </select>
        )}
      </div>

      {/* DERECHA: TOGGLE BILATERAL/UNILATERAL DISCRETO + DETALLE COACH */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {!isStrictlyBilateral && (
          <button
            type="button"
            onClick={() => onUpdateExerciseMeta && onUpdateExerciseMeta({ isUnilateral: !isUnilateral })}
            style={{
              padding: '4px 7px',
              borderRadius: '8px',
              border: isUnilateral ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
              background: isUnilateral ? 'rgba(124, 58, 237, 0.18)' : 'var(--bg-surface-secondary)',
              color: isUnilateral ? '#c084fc' : 'var(--text-muted)',
              fontSize: '9.5px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
            title="Cambiar entre registro Bilateral o Por Lado (I/D)"
          >
            {isUnilateral ? 'Por Lado' : 'Bilateral'}
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsScienceModalOpen(true)}
          style={{
            padding: '4px 6px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-secondary)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center'
          }}
          title="Ver diagnóstico y estrategia de progresión"
        >
          <BarChart2 size={12} />
        </button>
      </div>
    </div>
  );
}
