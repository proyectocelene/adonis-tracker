import React from 'react';
import { Calendar } from 'lucide-react';
import { TIMEFRAME_OPTIONS } from '../../../utils/charts/chartConstants.js';

export default function TimeframeSelector({
  timeframe,
  setTimeframe,
  visibleRealPointsCount = 0,
  totalRealPointsCount = 0
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '6px',
      marginBottom: '10px',
      background: '#0a0d14',
      padding: '5px 8px',
      borderRadius: '12px',
      border: '1px solid #1e293b',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Calendar size={13} color="var(--accent-blue)" />
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
          Eje Temporal:
        </span>
        <span style={{ fontSize: '9px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
          {visibleRealPointsCount} de {totalRealPointsCount} ses
        </span>
      </div>

      <div style={{ display: 'inline-flex', gap: '2px', background: '#000000', padding: '2px', borderRadius: '8px', border: '1px solid #1e293b', flexWrap: 'wrap' }}>
        {TIMEFRAME_OPTIONS.map(tf => {
          const isSel = timeframe === tf.id;
          return (
            <button
              key={tf.id}
              type="button"
              onClick={() => setTimeframe(tf.id)}
              style={{
                padding: '3px 7px',
                borderRadius: '6px',
                border: 'none',
                background: isSel ? 'var(--accent-blue)' : 'transparent',
                color: isSel ? '#000000' : '#94a3b8',
                fontWeight: isSel ? '900' : '700',
                fontSize: '9.5px',
                cursor: 'pointer',
                boxShadow: isSel ? '0 1px 6px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title={tf.title}
            >
              {tf.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
