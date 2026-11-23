import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function ChartEmptyState({ exerciseName = '' }) {
  return (
    <div style={{
      padding: '24px 14px',
      textAlign: 'center',
      background: 'var(--bg-surface-secondary)',
      borderRadius: '16px',
      border: '1.5px dashed var(--border-subtle)',
      color: 'var(--text-muted)'
    }}>
      <TrendingUp size={32} color="var(--border-strong)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
      <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '900', color: 'var(--text-main)' }}>
        Sin Historial de Sobrecarga Aún
      </h4>
      <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.4' }}>
        Registra tus series en <strong>{exerciseName}</strong> para desbloquear la gráfica de carga pico, carga promedio, tonelaje y proyección progresiva (próxima sesión, 2 sesiones, 1m, 3m y 6 meses).
      </p>
    </div>
  );
}
