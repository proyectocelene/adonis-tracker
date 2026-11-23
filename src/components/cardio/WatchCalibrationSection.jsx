import React from 'react';
import { Watch, Flame } from 'lucide-react';
import { cleanInputVal } from '../../hooks/cardio/useCardioState';

export default function WatchCalibrationSection({
  watchHrAvg,
  setWatchHrAvg,
  watchHrMax,
  setWatchHrMax,
  watchKcal,
  setWatchKcal,
  machineKcal,
  setMachineKcal,
  calibrationMode,
  setCalibrationMode,
  machineSetup,
  setMachineSetup,
  cardioNotesInput,
  setCardioNotesInput,
  metrics,
  currentCardioState,
  notifyChange
}) {
  return (
    <>
      {/* BLOQUE SEPARADO: SESIÓN ESPECÍFICA DE CARDIO EN TU RELOJ & CONSOLA */}
      <div style={{
        background: 'var(--bg-surface-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Watch size={18} color="var(--accent-purple)" />
            <span style={{ fontSize: '12.5px', fontWeight: '900', color: 'var(--text-main)' }}>
              Sesión Independiente de Cardio en tu Reloj & Máquina
            </span>
          </div>
          <span style={{ fontSize: '10px', background: 'rgba(124, 58, 237, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
            Actividad separada de pesas
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--accent-red)', marginBottom: '4px' }}>
              ❤️ FC Promedio (BPM):
            </label>
            <input
              type="number"
              placeholder="125"
              value={cleanInputVal(watchHrAvg, '125')}
              onChange={e => {
                setWatchHrAvg(e.target.value);
                notifyChange({ heartRate: parseInt(e.target.value, 10) || 0 });
              }}
              style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--accent-red)', background: 'var(--bg-card)', fontWeight: '900', fontSize: '14px', color: 'var(--accent-red)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--accent-red)', marginBottom: '4px' }}>
              ⚡ FC Máxima (BPM):
            </label>
            <input
              type="number"
              placeholder="138"
              value={cleanInputVal(watchHrMax, '')}
              onChange={e => {
                setWatchHrMax(e.target.value);
                notifyChange({ watch: { ...currentCardioState.watch, maxHeartRate: parseInt(e.target.value, 10) || 0 } });
              }}
              style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--accent-purple)', marginBottom: '4px' }}>
              ⌚ Kcal Reloj (Cardio):
            </label>
            <input
              type="number"
              placeholder="Ej. 240"
              value={cleanInputVal(watchKcal, '')}
              onChange={e => {
                setWatchKcal(e.target.value);
                notifyChange({ watchCalories: parseFloat(e.target.value) || null });
              }}
              style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.4)', background: 'var(--bg-card)', fontWeight: '900', fontSize: '14px', color: '#c084fc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '4px' }}>
              🖥️ Kcal Máquina:
            </label>
            <input
              type="number"
              placeholder="Ej. 260"
              value={cleanInputVal(machineKcal, '')}
              onChange={e => {
                setMachineKcal(e.target.value);
                notifyChange({ machineCalories: parseFloat(e.target.value) || null });
              }}
              style={{ width: '100%', padding: '8px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '900', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* DIAGNÓSTICO DE ZONA 2 (FATmax) */}
        <div style={{
          padding: '8px 12px',
          borderRadius: '10px',
          background: metrics.zone2Status === 'optimal' ? 'var(--accent-emerald-subtle)' : metrics.zone2Status === 'high' ? 'var(--accent-amber-subtle)' : 'var(--bg-card)',
          border: metrics.zone2Status === 'optimal' ? '1px solid var(--accent-emerald)' : metrics.zone2Status === 'high' ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={15} color={metrics.zone2Status === 'optimal' ? 'var(--accent-emerald)' : 'var(--accent-amber)'} />
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: metrics.zone2Status === 'optimal' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
              {metrics.zone2Status === 'optimal' && '🟢 Zona 2 Óptima (118-138 BPM): Máxima oxidación de ácidos grasos (FATmax) sin fatiga muscular.'}
              {metrics.zone2Status === 'high' && '🟡 Alerta Zona 3 (>138 BPM): Intensidad elevada. Podría restar recuperación a las piernas para las pesas.'}
              {metrics.zone2Status === 'low' && '🔵 Zona 1 (<118 BPM): Recuperación activa, desinflamación y retorno venoso.'}
              {metrics.zone2Status === 'unknown' && 'Introduce tus pulsaciones para auditar si estuviste en Zona 2.'}
            </span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)' }}>
            {metrics.met} METs
          </span>
        </div>
      </div>

      {/* BLOQUE DE CALIBRACIÓN Y CONSENSO TRIPARTITO */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '14px',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>
              Calibración Científica del Cardio
            </span>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#ffffff' }}>
              Gasto Seleccionado: <span style={{ color: '#38bdf8' }}>{metrics.cardioKcal} kcal</span>
            </div>
          </div>

          <span style={{
            fontSize: '11px',
            fontWeight: '900',
            background: '#0284c7',
            color: '#ffffff',
            padding: '3px 9px',
            borderRadius: '8px'
          }}>
            Modo: {calibrationMode === 'consensus' ? 'Consenso Científico' : calibrationMode === 'watch' ? 'Reloj Cardio' : calibrationMode === 'acsm' ? 'Física ACSM' : 'Consola'}
          </span>
        </div>

        {/* Grid comparativo tripartito */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>🔬 FÍSICA ACSM</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#38bdf8' }}>{metrics.acsmKcal} kcal</div>
            <div style={{ fontSize: '9.5px', color: '#cbd5e1' }}>78.55 kg + pendiente</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>⌚ RELOJ CARDIO</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#c084fc' }}>
              {metrics.watchKcal ? `${metrics.watchKcal} kcal` : '--'}
            </div>
            <div style={{ fontSize: '9.5px', color: '#cbd5e1' }}>
              {watchHrAvg ? `${watchHrAvg} BPM` : 'Sin pulso'}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>🖥️ MÁQUINA</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#fde047' }}>
              {metrics.machineKcal ? `${metrics.machineKcal} kcal` : '--'}
            </div>
            <div style={{ fontSize: '9.5px', color: '#cbd5e1' }}>Consola gym</div>
          </div>
        </div>

        {/* Pastillas selectoras de modo de calibración */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setCalibrationMode('consensus');
              notifyChange({ calibrationMode: 'consensus' });
            }}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '8px',
              border: calibrationMode === 'consensus' ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
              background: calibrationMode === 'consensus' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.05)',
              color: calibrationMode === 'consensus' ? '#38bdf8' : '#ffffff',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Consenso ({metrics.consensusKcal} kcal)
          </button>

          <button
            type="button"
            onClick={() => {
              setCalibrationMode('acsm');
              notifyChange({ calibrationMode: 'acsm' });
            }}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '8px',
              border: calibrationMode === 'acsm' ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
              background: calibrationMode === 'acsm' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.05)',
              color: calibrationMode === 'acsm' ? '#38bdf8' : '#ffffff',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Física ACSM ({metrics.acsmKcal} kcal)
          </button>

          {metrics.watchKcal && (
            <button
              type="button"
              onClick={() => {
                setCalibrationMode('watch');
                notifyChange({ calibrationMode: 'watch' });
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '8px',
                border: calibrationMode === 'watch' ? '1.5px solid #c084fc' : '1px solid rgba(255,255,255,0.2)',
                background: calibrationMode === 'watch' ? 'rgba(192, 132, 252, 0.25)' : 'rgba(255,255,255,0.05)',
                color: calibrationMode === 'watch' ? '#c084fc' : '#ffffff',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Reloj ({metrics.watchKcal} kcal)
            </button>
          )}

          {metrics.machineKcal && (
            <button
              type="button"
              onClick={() => {
                setCalibrationMode('machine');
                notifyChange({ calibrationMode: 'machine' });
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '8px',
                border: calibrationMode === 'machine' ? '1.5px solid #fde047' : '1px solid rgba(255,255,255,0.2)',
                background: calibrationMode === 'machine' ? 'rgba(253, 224, 71, 0.25)' : 'rgba(255,255,255,0.05)',
                color: calibrationMode === 'machine' ? '#fde047' : '#ffffff',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Máquina ({metrics.machineKcal} kcal)
            </button>
          )}
        </div>
      </div>

      {/* CALIBRACIÓN DEL ASIENTO/MÁQUINA Y NOTAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '14px', border: '1.5px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#334155', fontWeight: '900', marginBottom: '4px' }}>
            ⚙️ Ajuste de Máquina / Asiento:
          </label>
          <input
            type="text"
            placeholder="Ej. Asiento altura #6, pedal medio..."
            value={machineSetup}
            onChange={e => {
              setMachineSetup(e.target.value);
              notifyChange({ machineSetup: e.target.value });
            }}
            style={{ width: '100%', fontSize: '12px', padding: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff', borderRadius: '10px', fontWeight: '600' }}
          />
        </div>

        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '14px', border: '1.5px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#334155', fontWeight: '900', marginBottom: '4px' }}>
            📝 Sensaciones de Cardio:
          </label>
          <input
            type="text"
            placeholder="Pulsos controlados, buena sudoración..."
            value={cardioNotesInput}
            onChange={e => {
              setCardioNotesInput(e.target.value);
              notifyChange({ notes: e.target.value });
            }}
            style={{ width: '100%', fontSize: '12px', padding: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff', borderRadius: '10px', fontWeight: '600' }}
          />
        </div>
      </div>
    </>
  );
}
