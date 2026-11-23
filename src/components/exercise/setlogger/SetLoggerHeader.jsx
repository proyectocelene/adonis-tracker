import React from 'react';
import { Settings2 } from 'lucide-react';

export default function SetLoggerHeader({
  isStrictlyBilateral,
  isUnilateral,
  onUpdateExerciseMeta,
  machineConfig,
  exerciseProfiles = [],
  exercise,
  handleSelectMachineProfile,
  setIsMachineConfigOpen,
  coachAnalysis,
  setIsScienceModalOpen
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '6px',
      marginBottom: '10px',
      width: '100%',
      flexWrap: 'nowrap'
    }}>
      {/* SELECTOR SEGMENTADO BILATERAL / POR LADO O BADGE BILATERAL RÍGIDO */}
      {isStrictlyBilateral ? (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'var(--bg-surface-secondary)',
          padding: '4px 8px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          fontSize: '10.5px',
          fontWeight: '800',
          color: 'var(--text-secondary)',
          flexShrink: 0
        }}>
          🔗 Barra Bilateral
        </div>
      ) : (
        <div style={{
          display: 'inline-flex',
          background: 'var(--bg-surface-secondary)',
          padding: '2px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          <button
            type="button"
            onClick={() => isUnilateral && onUpdateExerciseMeta && onUpdateExerciseMeta({ isUnilateral: false })}
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              border: 'none',
              background: !isUnilateral ? 'var(--bg-card)' : 'transparent',
              color: !isUnilateral ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: !isUnilateral ? '900' : '700',
              fontSize: '10.5px',
              cursor: 'pointer',
              boxShadow: !isUnilateral ? 'var(--shadow-ios-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Bilateral
          </button>
          <button
            type="button"
            onClick={() => !isUnilateral && onUpdateExerciseMeta && onUpdateExerciseMeta({ isUnilateral: true })}
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              border: 'none',
              background: isUnilateral ? '#7c3aed' : 'transparent',
              color: isUnilateral ? '#ffffff' : 'var(--text-muted)',
              fontWeight: isUnilateral ? '900' : '700',
              fontSize: '10.5px',
              cursor: 'pointer',
              boxShadow: isUnilateral ? '0 1px 4px rgba(124,58,237,0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Por Lado
          </button>
        </div>
      )}

      {/* SELECTOR DE MÁQUINA CON PERFILES Y CALIBRACIÓN */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 1, minWidth: 0 }}>
        <button
          type="button"
          onClick={() => setIsMachineConfigOpen(true)}
          style={{
            background: machineConfig ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
            border: machineConfig ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          title="Calibrar máquina, asiento, respaldo, muesca o saltos de peso"
        >
          <Settings2 size={13} color={machineConfig ? 'var(--accent-blue)' : 'var(--text-muted)'} />
        </button>

        <select
          id={`machine-profile-${exercise?.id || 'ex'}`}
          name={`machine_profile_${exercise?.id || 'ex'}`}
          aria-label={`Perfil de máquina para ${exercise?.name || 'ejercicio'}`}
          value={machineConfig?.id || (exerciseProfiles[0]?.id) || ''}
          onChange={(e) => handleSelectMachineProfile(e.target.value)}
          style={{
            background: machineConfig ? 'rgba(124, 58, 237, 0.15)' : 'var(--bg-card)',
            border: machineConfig ? '1.5px solid #a855f7' : '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '4px 5px',
            fontSize: '10px',
            fontWeight: '800',
            color: machineConfig ? '#c084fc' : 'var(--text-main)',
            maxWidth: '145px',
            cursor: 'pointer',
            outline: 'none',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
          title="Selecciona qué máquina estás usando (Planta Alta o Planta Baja) o añade una nueva"
        >
          {exerciseProfiles.length === 0 && !machineConfig && (
            <option value="">⚙️ Sin calibrar</option>
          )}
          {exerciseProfiles.map(prof => (
            <option key={prof.id} value={prof.id}>
              {prof.floor === 'Planta Alta' ? '🏢 P. Alta: ' : (prof.floor === 'Planta Baja' ? '🏢 P. Baja: ' : '⚙️ ')}{prof.name || prof.station || 'Máquina'}{prof.seat ? ` (As. ${prof.seat})` : ''}
            </option>
          ))}
          {(!exerciseProfiles.some(p => p.id === machineConfig?.id) && (machineConfig?.name || machineConfig?.station)) && (
            <option value={machineConfig.id || 'curr'}>
              {machineConfig.floor ? `🏢 ${machineConfig.floor}: ` : '⚙️ '}{machineConfig.name || machineConfig.station}
            </option>
          )}
          <option value="__NEW__">➕ Añadir máquina (P. Alta / P. Baja)...</option>
        </select>

        {/* Chip de calibración biomecánica activa si existe asiento/respaldo/muesca */}
        {(machineConfig?.seat || machineConfig?.backrest || machineConfig?.notch) && (
          <button
            type="button"
            onClick={() => setIsMachineConfigOpen(true)}
            style={{
              background: 'var(--accent-emerald-subtle)',
              border: '1px solid var(--accent-emerald)',
              borderRadius: '8px',
              padding: '3px 5px',
              fontSize: '9px',
              fontWeight: '800',
              color: 'var(--accent-emerald)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '110px'
            }}
            title="Calibración activa: clic para editar"
          >
            <span>
              {[
                machineConfig.seat ? `Asiento: ${machineConfig.seat}` : '',
                machineConfig.backrest ? `Resp: ${machineConfig.backrest}` : '',
                machineConfig.notch ? `Muesca: ${machineConfig.notch}` : ''
              ].filter(Boolean).join(' • ')}
            </span>
          </button>
        )}
      </div>

      {/* CHIP DE SOBRECARGA CIENTÍFICA (ABRE MODAL) */}
      <button
        type="button"
        onClick={() => setIsScienceModalOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          background: coachAnalysis?.isSpreadHigh ? 'var(--accent-amber-subtle)' : (coachAnalysis?.canProgressWeight ? 'var(--accent-emerald-subtle)' : 'var(--accent-blue-light)'),
          border: `1.5px solid ${coachAnalysis?.isSpreadHigh ? 'var(--accent-amber)' : (coachAnalysis?.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-blue)')}`,
          color: coachAnalysis?.isSpreadHigh ? 'var(--accent-amber)' : (coachAnalysis?.canProgressWeight ? 'var(--accent-emerald)' : 'var(--accent-blue)'),
          borderRadius: '9px',
          padding: '4px 8px',
          fontSize: '10.5px',
          fontWeight: '900',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-ios-sm)',
          flexShrink: 0
        }}
        title="Ver análisis estadístico y estrategia inteligente de este ejercicio"
      >
        <span>{coachAnalysis?.isSpreadHigh ? '🎯 Unificar' : (coachAnalysis?.canProgressWeight ? '⚡ Subir' : '💡 Coach')}</span>
        <span style={{ fontSize: '8.5px', opacity: 0.8 }}>ⓘ</span>
      </button>
    </div>
  );
}
