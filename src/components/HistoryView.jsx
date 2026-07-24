import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { adonisProtocol } from '../data/adonisProtocol';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HistoryView() {
  const [workoutData] = useLocalStorage('adonis_workout_data', {});

  // Mock data for the chart to show the concept (since we need multiple sessions to build a real chart)
  const mockChartData = [
    { name: 'Semana 1', peso: 75 },
    { name: 'Semana 2', peso: 80 },
    { name: 'Semana 3', peso: 80 },
    { name: 'Semana 4', peso: 85 },
  ];

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Progreso y Pesos</h1>

      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--accent-cyan)', marginBottom: '16px' }}>Tendencia de Sobrecarga</h2>
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--accent-gold)' }}
              />
              <Line type="monotone" dataKey="peso" stroke="var(--accent-gold)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-gold)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
          *El gráfico real se generará conforme completes semanas de entrenamiento.
        </p>
      </div>

      <h2 style={{ marginBottom: '16px' }}>Pesos Actuales (Última Sesión)</h2>
      
      {adonisProtocol.filter(day => day.type === 'workout').map(day => (
        <div key={day.id} className="glass-panel" style={{ padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}>{day.name}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {day.exercises.map(ex => {
              const weight = workoutData[ex.id]?.weight;
              return (
                <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-main)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>
                    {ex.name}
                  </span>
                  <span style={{ fontWeight: '600', color: weight ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    {weight ? `${weight} lbs` : '--'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
