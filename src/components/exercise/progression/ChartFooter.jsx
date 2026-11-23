import React from 'react';
import { PROGRESSION_COLORS } from '../../../utils/charts/chartConstants.js';

export default function ChartFooter({
  currentWeight = 0,
  peakWeight = 0,
  currentAvgWeight = 0
}) {
  return (
    <div style={{
      marginTop: '8px',
      paddingTop: '8px',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '6px',
      fontSize: '10px',
      color: 'var(--text-muted)'
    }}>
      <div>
        <span>
          Último Pico: <strong style={{ color: PROGRESSION_COLORS.peakWeight }}>{currentWeight} lbs</strong> (Récord: <strong style={{ color: '#15803d' }}>{peakWeight}#</strong>)
        </span>
        {currentAvgWeight > 0 && (
          <span style={{ marginLeft: '6px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '6px' }}>
            Último Prom: <strong style={{ color: PROGRESSION_COLORS.avgWeight }}>{currentAvgWeight} lbs</strong>
          </span>
        )}
      </div>
      <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
        Toca o pasa el cursor para auditar cada punto
      </span>
    </div>
  );
}
