import React from 'react';
import { Info } from 'lucide-react';
import { cleanInputVal } from '../../hooks/cardio/useCardioState';

export default function RowerSection({
  rowOption,
  setRowOption,
  rowPhase1Mins,
  setRowPhase1Mins,
  rowPhase2Mins,
  setRowPhase2Mins,
  rowSprintsCount,
  setRowSprintsCount,
  rowLissMins,
  setRowLissMins,
  rowDamper,
  setRowDamper,
  rowSpm,
  setRowSpm,
  rowDistanceMeters,
  setRowDistanceMeters,
  rowSplit500m,
  setRowSplit500m,
  metrics,
  notifyChange
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Alerta Médica: Regla de las 6 Horas para anular efecto de interferencia */}
      <div style={{
        padding: '12px 14px',
        background: 'var(--accent-blue-light)',
        border: '1px solid var(--accent-blue)',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <Info size={18} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '11.5px', color: 'var(--accent-blue)', lineHeight: '1.4' }}>
          <strong>Ventana Matutina (Anular Efecto de Interferencia):</strong> Realizar esta sesión por la mañana, separada por al menos <strong>6 horas</strong> de tu entrenamiento de fuerza para evitar que la vía AMPK bloquee la síntesis proteica de mTORC1.
        </div>
      </div>

      {/* Selector de Opción A vs Opción B */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
          Selecciona el Protocolo del Día:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              setRowOption('A');
              const total = (parseFloat(rowPhase1Mins) || 15) + (parseFloat(rowPhase2Mins) || 20);
              notifyChange({ 
                rowOption: 'A',
                duration: total,
                rpe: 17
              });
            }}
            style={{
              padding: '12px 10px',
              borderRadius: '14px',
              border: rowOption === 'A' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
              background: rowOption === 'A' ? 'var(--accent-blue-light)' : 'var(--bg-card)',
              color: rowOption === 'A' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: '900',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: rowOption === 'A' ? '0 4px 12px rgba(56, 189, 248, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '900' }}>⚡ Opción A: Híbrida</span>
              <span style={{ fontSize: '10px', background: rowOption === 'A' ? 'var(--accent-blue)' : 'var(--bg-surface-secondary)', color: rowOption === 'A' ? '#000000' : 'var(--text-muted)', padding: '2px 6px', borderRadius: '6px', fontWeight: '900' }}>
                Máx 1-2x/sem
              </span>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: rowOption === 'A' ? 'var(--accent-blue)' : 'var(--text-main)' }}>
              "Cardio de verdad" + NEAT
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              35-40 min (HIIT 10-15m + LISS 20-25m)
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setRowOption('B');
              notifyChange({ 
                rowOption: 'B',
                duration: parseFloat(rowLissMins) || 35,
                rpe: 13
              });
            }}
            style={{
              padding: '12px 10px',
              borderRadius: '14px',
              border: rowOption === 'B' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
              background: rowOption === 'B' ? 'var(--accent-emerald-subtle)' : 'var(--bg-card)',
              color: rowOption === 'B' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
              fontWeight: '900',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: rowOption === 'B' ? '0 4px 12px rgba(0, 230, 118, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '900' }}>🚶 Opción B: NEAT Puro</span>
              <span style={{ fontSize: '10px', background: rowOption === 'B' ? 'var(--accent-emerald)' : 'var(--bg-surface-secondary)', color: rowOption === 'B' ? '#000000' : 'var(--text-muted)', padding: '2px 6px', borderRadius: '6px', fontWeight: '900' }}>
                2-3x/sem
              </span>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: rowOption === 'B' ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
              LISS Continuo (Talk Test)
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              30-45 min (RPE 12-13, sin fatiga)
            </div>
          </button>
        </div>
      </div>

      {/* DETALLE OPCIÓN A: SESIÓN HÍBRIDA */}
      {rowOption === 'A' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Fase 1: HIIT */}
          <div style={{ padding: '12px', background: 'var(--accent-red-subtle)', border: '1px solid var(--accent-red)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ fontSize: '12px', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔥 Fase 1: Cardio HIIT / Vigoroso ({rowPhase1Mins} min)
              </strong>
              <span style={{ fontSize: '10px', background: 'var(--accent-red)', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                RPE 16-18 / 20
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
              Realiza de <strong>4 a 6 sprints de 20 segundos</strong> a máxima velocidad, seguidos de <strong>40 a 60 segundos</strong> de remo muy suave para recuperar.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--accent-red)', marginBottom: '3px' }}>
                  ⏱️ Minutos Fase 1:
                </label>
                <input
                  type="number"
                  value={cleanInputVal(rowPhase1Mins, '15')}
                  onChange={e => {
                    setRowPhase1Mins(e.target.value);
                    const total = (parseFloat(e.target.value) || 0) + (parseFloat(rowPhase2Mins) || 0);
                    notifyChange({ rowPhase1Mins: parseFloat(e.target.value) || 0, duration: total });
                  }}
                  style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--accent-red)', fontWeight: '900', fontSize: '12.5px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--accent-red)', marginBottom: '3px' }}>
                  ⚡ Sprints Realizados:
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.max(1, (parseInt(rowSprintsCount, 10) || 5) - 1);
                      setRowSprintsCount(String(next));
                      notifyChange({ rowSprintsCount: next });
                    }}
                    style={{ width: '28px', height: '30px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', borderRadius: '6px 0 0 6px', fontWeight: '900', cursor: 'pointer' }}
                  >-</button>
                  <input
                    type="number"
                    value={cleanInputVal(rowSprintsCount, '5')}
                    onChange={e => {
                      setRowSprintsCount(e.target.value);
                      notifyChange({ rowSprintsCount: parseInt(e.target.value, 10) || 5 });
                    }}
                    style={{ width: '100%', padding: '6px', textAlign: 'center', border: '1px solid var(--accent-red)', borderLeft: 'none', borderRight: 'none', fontWeight: '900', fontSize: '12px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.min(10, (parseInt(rowSprintsCount, 10) || 5) + 1);
                      setRowSprintsCount(String(next));
                      notifyChange({ rowSprintsCount: next });
                    }}
                    style={{ width: '28px', height: '30px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', borderRadius: '0 6px 6px 0', fontWeight: '900', cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--accent-red)', marginBottom: '3px' }}>
                  🎯 Intervalo Sprint:
                </label>
                <div style={{ padding: '6px', textAlign: 'center', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontWeight: '900', fontSize: '11px', color: 'var(--accent-red)' }}>
                  20s Max / 40s Suave
                </div>
              </div>
            </div>
          </div>

          {/* Fase 2: NEAT / LISS */}
          <div style={{ padding: '12px', background: 'var(--accent-emerald-subtle)', border: '1px solid var(--accent-emerald)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ fontSize: '12px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🌊 Fase 2: NEAT / LISS Continuo ({rowPhase2Mins} min)
              </strong>
              <span style={{ fontSize: '10px', background: 'var(--accent-emerald)', color: '#000000', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                Enfriamiento Activo
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
              20 a 25 minutos continuos a intensidad muy baja. Funciona como enfriamiento activo y suma gasto calórico sin fatiga metabólica.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--accent-emerald)', marginBottom: '3px' }}>
                  ⏱️ Minutos Fase 2:
                </label>
                <input
                  type="number"
                  value={cleanInputVal(rowPhase2Mins, '20')}
                  onChange={e => {
                    setRowPhase2Mins(e.target.value);
                    const total = (parseFloat(rowPhase1Mins) || 0) + (parseFloat(e.target.value) || 0);
                    notifyChange({ rowPhase2Mins: parseFloat(e.target.value) || 0, duration: total });
                  }}
                  style={{ width: '100%', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--accent-emerald)', fontWeight: '900', fontSize: '12.5px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--accent-emerald)', marginBottom: '3px' }}>
                  ⏱️ Duración Total Sesión:
                </label>
                <div style={{ padding: '6px', textAlign: 'center', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontWeight: '900', fontSize: '12px', color: 'var(--accent-emerald)' }}>
                  {(parseFloat(rowPhase1Mins) || 0) + (parseFloat(rowPhase2Mins) || 0)} min en total
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETALLE OPCIÓN B: SESIÓN PURA NEAT */}
      {rowOption === 'B' && (
        <div style={{ padding: '14px', background: 'var(--accent-emerald-subtle)', border: '1px solid var(--accent-emerald)', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ fontSize: '13px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🚶‍♂️ Sesión Pura de NEAT (LISS en Máquina de Remo)
            </strong>
            <span style={{ fontSize: '10.5px', background: 'var(--accent-emerald)', color: '#000000', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
              Talk Test: RPE 12-13 / 20
            </span>
          </div>

          <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
            <strong>Talk Test:</strong> Debes poder mantener una conversación fluida o respirar cómodamente por la nariz sin jadear.<br />
            <strong>Objetivo:</strong> Simular los pasos y la actividad que no realizas por tu trabajo sedentario. No debes terminar exhausto ni con los músculos ardiendo.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--accent-emerald)', marginBottom: '3px' }}>
                ⏱️ Minutos de Sesión:
              </label>
              <input
                type="number"
                value={cleanInputVal(rowLissMins, '35')}
                onChange={e => {
                  setRowLissMins(e.target.value);
                  notifyChange({ rowLissMins: parseFloat(e.target.value) || 0, duration: parseFloat(e.target.value) || 0 });
                }}
                style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--accent-emerald)', fontWeight: '900', fontSize: '13.5px', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--accent-emerald)', marginBottom: '3px' }}>
                🗣️ Esfuerzo Percibido:
              </label>
              <div style={{ padding: '8px', textAlign: 'center', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontWeight: '900', fontSize: '12px', color: 'var(--accent-emerald)' }}>
                RPE 12-13 (Conversación fluida)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TELEMETRÍA DEL ERGÓMETRO DE REMO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '8px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⚙️ Damper (Palanca):
          </label>
          <input
            type="number"
            step="1"
            min="1"
            max="10"
            value={cleanInputVal(rowDamper, '5')}
            onChange={e => {
              setRowDamper(e.target.value);
              notifyChange({ damperLevel: parseFloat(e.target.value) || 5 });
            }}
            style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            🔄 SPM (Paladas/min):
          </label>
          <input
            type="number"
            value={cleanInputVal(rowSpm, '24')}
            onChange={e => {
              setRowSpm(e.target.value);
              notifyChange({ strokesPerMin: parseFloat(e.target.value) || 24 });
            }}
            style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            📍 Metros Recorridos:
          </label>
          <input
            type="number"
            value={cleanInputVal(rowDistanceMeters, '')}
            placeholder={metrics.distanceKm ? String(Math.round(metrics.distanceKm * 1000)) : '6500'}
            onChange={e => {
              setRowDistanceMeters(e.target.value);
              notifyChange({ distanceMeters: parseFloat(e.target.value) || 0, distanceKm: (parseFloat(e.target.value) || 0) / 1000 });
            }}
            style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
            ⏱️ Split /500m:
          </label>
          <input
            type="text"
            value={cleanInputVal(rowSplit500m, '2:15')}
            onChange={e => {
              setRowSplit500m(e.target.value);
              notifyChange({ split500m: e.target.value });
            }}
            placeholder="2:15"
            style={{ width: '100%', padding: '7px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', fontWeight: '900', fontSize: '13px' }}
          />
        </div>
      </div>
    </div>
  );
}
