import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Dumbbell, Info } from 'lucide-react';
import ConsistencyHeatmap from '../ConsistencyHeatmap';
import { LiquidDropdown } from '../common/UIComponents';
import { ErrorBoundary } from '../common/ErrorBoundary';

export default function HistoryChartsView({
  totalSessions = 0,
  totalVolumeLifted = 0,
  globalAverageRPE = '0.0',
  workoutHistory = [],
  analysisMode,
  setAnalysisMode,
  selectedExId,
  setSelectedExId,
  selectedMuscleGroup,
  setSelectedMuscleGroup,
  exerciseOptions = [],
  muscleGroupOptions = [],
  progData = []
}) {
  return (
    <div className="animate-fade">
      {/* KPIs Clínicos */}
      <div className="grid-3" style={{ marginBottom: '18px' }}>
        <div className="card" style={{ padding: '14px 6px', textAlign: 'center', margin: 0 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Sesiones</span>
          <strong style={{ fontSize: '22px', color: '#0f172a', display: 'block', margin: '3px 0', fontWeight: '800' }}>{totalSessions}</strong>
          <span style={{ fontSize: '11px', color: '#00b464', fontWeight: '800' }}>Archivadas</span>
        </div>
        
        <div className="card" style={{ padding: '14px 6px', textAlign: 'center', margin: 0, borderTop: '4px solid #0066ff' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Volumen Global</span>
          <strong style={{ fontSize: '18px', color: '#0066ff', display: 'block', margin: '3px 0', fontWeight: '800' }}>{totalVolumeLifted.toLocaleString()}</strong>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>Lbs-Reps</span>
        </div>
        
        <div className="card" style={{ padding: '14px 6px', textAlign: 'center', margin: 0 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Intensidad</span>
          <strong style={{ fontSize: '20px', color: '#f59e0b', display: 'block', margin: '3px 0', fontWeight: '800' }}>RPE {globalAverageRPE}</strong>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>Esfuerzo Medio</span>
        </div>
      </div>

      {/* Heatmap de Consistencia */}
      <ConsistencyHeatmap workoutHistory={workoutHistory} />

      {/* Curva Evolutiva por Ejercicio o Grupo Muscular */}
      <div className="card card-highlight" style={{ padding: '18px', marginBottom: '22px', borderRadius: '26px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Dumbbell size={20} color="#0066ff" />
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '900' }}>Analítica de Sobrecarga Progresiva</h2>
            </div>
            <span className="badge badge-blue">1RM & Volumen</span>
          </div>

          <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '16px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setAnalysisMode('exercise')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px', background: analysisMode === 'exercise' ? '#ffffff' : 'transparent', color: analysisMode === 'exercise' ? '#0066ff' : '#64748b', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}
            >
              Por Ejercicio Individual
            </button>
            <button
              type="button"
              onClick={() => setAnalysisMode('muscleGroup')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px', background: analysisMode === 'muscleGroup' ? '#ffffff' : 'transparent', color: analysisMode === 'muscleGroup' ? '#0066ff' : '#64748b', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}
            >
              Por Grupo Muscular
            </button>
          </div>

          {analysisMode === 'exercise' ? (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '800', color: '#475569' }}>
                Selecciona Ejercicio para Auditar Sobrecarga:
              </label>
              <LiquidDropdown
                options={exerciseOptions}
                value={selectedExId}
                onChange={val => setSelectedExId(val)}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '800', color: '#475569' }}>
                Selecciona Grupo Muscular Objetivo:
              </label>
              <LiquidDropdown
                options={muscleGroupOptions}
                value={selectedMuscleGroup}
                onChange={val => setSelectedMuscleGroup(val)}
              />
            </div>
          )}

          {/* Gráfica de Progreso */}
          {progData.length > 0 ? (
            <ErrorBoundary inline>
              <div style={{ height: '260px', width: '100%', marginTop: '14px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: '700', fill: '#64748b' }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fontWeight: '700', fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="maxWeight" name="Carga Máxima" stroke="#0066ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="est1RM" name="1RM Estimado" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ErrorBoundary>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
              Sin registros suficientes para este ejercicio en el historial.
            </div>
          )}

          {/* GUÍA CIENTÍFICA: CÓMO INTERPRETAR LA GRÁFICA DE SOBRECARGA */}
          <div style={{
            marginTop: '16px',
            background: '#ffffff',
            border: '1.5px solid #bfdbfe',
            borderRadius: '16px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={15} color="#0066ff" />
              <strong style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: '900' }}>
                Guía Científica: ¿Cómo interpretar tu curva de sobrecarga?
              </strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', lineHeight: '1.4', color: '#334155' }}>
              <div style={{ background: '#eff6ff', padding: '8px 10px', borderRadius: '10px' }}>
                <strong style={{ color: '#0066ff' }}>🔵 Línea Azul (Carga Máxima):</strong> Peso pico absoluto utilizado en la sesión. Refleja la tensión mecánica sobre las fibras musculares.
              </div>
              <div style={{ background: '#ecfdf5', padding: '8px 10px', borderRadius: '10px' }}>
                <strong style={{ color: '#059669' }}>🟢 Línea Punteada Verde (1RM Estimado - Epley):</strong> Tu potencial de fuerza máxima normalizado a 1 repetición (W × [1 + Reps/30]). Permite saber si una sesión de 100 lbs × 12 reps fue fisiológicamente superior a 110 lbs × 8 reps.
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong>🧠 Lectura de Rendimiento:</strong> Si la línea punteada verde asciende sesión tras sesión, existe <strong>sobrecarga progresiva real</strong> e hipertrofia miofibrilar, incluso si el peso absoluto se mantuvo igual y solo sumaste repeticiones.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
