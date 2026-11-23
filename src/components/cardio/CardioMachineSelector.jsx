import React from 'react';

export default function CardioMachineSelector({
  machineType,
  onSelectMachine
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
        Aparato Aeróbico Utilizado:
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
        <button
          type="button"
          onClick={() => onSelectMachine('rower')}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: machineType === 'rower' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
            background: machineType === 'rower' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
            color: machineType === 'rower' ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontWeight: '900',
            fontSize: '11.5px',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: machineType === 'rower' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none'
          }}
        >
          🚣‍♂️ Máquina de Remo
        </button>

        <button
          type="button"
          onClick={() => onSelectMachine('treadmill')}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: machineType === 'treadmill' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
            background: machineType === 'treadmill' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
            color: machineType === 'treadmill' ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontWeight: '900',
            fontSize: '11.5px',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          🏃‍♀️ Caminadora Inclinada
        </button>

        <button
          type="button"
          onClick={() => onSelectMachine('bike')}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: machineType === 'bike' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
            background: machineType === 'bike' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
            color: machineType === 'bike' ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontWeight: '900',
            fontSize: '11.5px',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          🚴‍♂️ Bici Ergómetro
        </button>

        <button
          type="button"
          onClick={() => onSelectMachine('elliptical')}
          style={{
            padding: '10px 8px',
            borderRadius: '12px',
            border: machineType === 'elliptical' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
            background: machineType === 'elliptical' ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
            color: machineType === 'elliptical' ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontWeight: '900',
            fontSize: '11.5px',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          🚶‍♀️ Elíptica (Sólo Piernas)
        </button>
      </div>
    </div>
  );
}
