import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus, ArrowUpDown, Sparkles, Filter } from 'lucide-react';
import { UNIFIED_EXERCISE_LIBRARY } from '../../data/unifiedExerciseLibrary';

export default function ExerciseConsistencyAudit({ workoutHistory = [] }) {
  const [sortCriteria, setSortCriteria] = useState('least_adherent'); // 'least_adherent' | 'most_adherent' | 'most_progress'

  const libraryNameMap = useMemo(() => {
    const map = {};
    (UNIFIED_EXERCISE_LIBRARY || []).forEach(item => {
      map[item.id] = item.name;
    });
    return map;
  }, []);

  const consistencyData = useMemo(() => {
    const stats = {};

    (workoutHistory || []).forEach(session => {
      if (session.isRestDay || session.isMissedDay) return;

      // 1. Ejercicios completados
      const exercises = session.exercises || {};
      Object.keys(exercises).forEach(exId => {
        const exData = exercises[exId];
        if (!exData || typeof exData !== 'object') return;
        const setKeys = Object.keys(exData).filter(k => !isNaN(parseInt(k, 10)) && exData[k]?.completed);
        if (setKeys.length === 0) return;

        if (!stats[exId]) {
          stats[exId] = {
            id: exId,
            name: exData.name || libraryNameMap[exId] || exId,
            loggedCount: 0,
            skippedCount: 0,
            maxWeights: [],
            dates: []
          };
        }

        let maxW = 0;
        setKeys.forEach(s => {
          const w = parseFloat(exData[s].weight) || 0;
          if (w > maxW) maxW = w;
        });

        stats[exId].loggedCount++;
        if (maxW > 0) {
          stats[exId].maxWeights.push({ date: session.date, weight: maxW });
        }
        stats[exId].dates.push(session.date);
      });

      // 2. Ejercicios explícitamente omitidos / saltados
      const skipped = session.skippedExercises || {};
      Object.keys(skipped).forEach(exId => {
        if (!stats[exId]) {
          stats[exId] = {
            id: exId,
            name: skipped[exId]?.name || libraryNameMap[exId] || exId,
            loggedCount: 0,
            skippedCount: 0,
            maxWeights: [],
            dates: []
          };
        }
        stats[exId].skippedCount++;
      });
    });

    const list = Object.values(stats).map(item => {
      const totalAttempts = item.loggedCount + item.skippedCount;
      const adherenceRate = totalAttempts > 0 ? Math.round((item.loggedCount / totalAttempts) * 100) : 100;
      const sortedWeights = [...item.maxWeights].sort((a, b) => new Date(a.date) - new Date(b.date));
      const firstWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : 0;
      const latestWeight = sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1].weight : 0;
      const deltaWeight = latestWeight > 0 && firstWeight > 0 ? latestWeight - firstWeight : 0;

      return {
        ...item,
        totalAttempts,
        adherenceRate,
        firstWeight,
        latestWeight,
        deltaWeight,
        lastDate: item.dates.length > 0 ? item.dates[item.dates.length - 1] : null
      };
    });

    if (sortCriteria === 'least_adherent') {
      list.sort((a, b) => a.adherenceRate - b.adherenceRate || b.skippedCount - a.skippedCount);
    } else if (sortCriteria === 'most_adherent') {
      list.sort((a, b) => b.adherenceRate - a.adherenceRate || b.loggedCount - a.loggedCount);
    } else if (sortCriteria === 'most_progress') {
      list.sort((a, b) => b.deltaWeight - a.deltaWeight);
    }

    return list;
  }, [workoutHistory, libraryNameMap, sortCriteria]);

  if (consistencyData.length === 0) {
    return null;
  }

  const leastConsistent = consistencyData.find(item => item.totalAttempts >= 2 && item.adherenceRate < 80);

  return (
    <div className="card" style={{ padding: '18px', marginBottom: '22px', borderRadius: '24px', background: '#ffffff', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#7c3aed" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
            Consistencia & Adherencia por Ejercicio
          </h3>
        </div>
        <span className="badge" style={{ background: '#f5f3ff', color: '#6d28d9', fontSize: '11px', fontWeight: '800' }}>
          {consistencyData.length} Ejercicios Rastreados
        </span>
      </div>

      {leastConsistent && (
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '16px',
          padding: '12px 14px',
          marginBottom: '16px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '12.5px', color: '#92400e', display: 'block', fontWeight: '800' }}>
              ⚠️ Menor consistencia detectada: {leastConsistent.name} ({leastConsistent.adherenceRate}% completado)
            </strong>
            <span style={{ fontSize: '11.5px', color: '#b45309', lineHeight: '1.4', display: 'block', marginTop: '2px' }}>
              Este movimiento se ha omitido {leastConsistent.skippedCount} {leastConsistent.skippedCount === 1 ? 'vez' : 'veces'}. Si te genera fatiga articular o la máquina suele estar ocupada, utiliza el botón <strong>"🔄 Sustituir"</strong> o pásalo al inicio de la sesión.
            </span>
          </div>
        </div>
      )}

      {/* FILTROS DE ORDENAMIENTO */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          type="button"
          onClick={() => setSortCriteria('least_adherent')}
          style={{
            padding: '6px 12px',
            borderRadius: '12px',
            border: 'none',
            background: sortCriteria === 'least_adherent' ? '#fee2e2' : '#f1f5f9',
            color: sortCriteria === 'least_adherent' ? '#dc2626' : '#64748b',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap'
          }}
        >
          <AlertTriangle size={12} /> Menos Consistentes
        </button>

        <button
          type="button"
          onClick={() => setSortCriteria('most_adherent')}
          style={{
            padding: '6px 12px',
            borderRadius: '12px',
            border: 'none',
            background: sortCriteria === 'most_adherent' ? '#dcfce7' : '#f1f5f9',
            color: sortCriteria === 'most_adherent' ? '#16a34a' : '#64748b',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap'
          }}
        >
          <CheckCircle2 size={12} /> Más Consistentes
        </button>

        <button
          type="button"
          onClick={() => setSortCriteria('most_progress')}
          style={{
            padding: '6px 12px',
            borderRadius: '12px',
            border: 'none',
            background: sortCriteria === 'most_progress' ? '#eff6ff' : '#f1f5f9',
            color: sortCriteria === 'most_progress' ? '#2563eb' : '#64748b',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap'
          }}
        >
          <TrendingUp size={12} /> Mayor Ganancia Carga (+lbs)
        </button>
      </div>

      {/* LISTA DE EJERCICIOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {consistencyData.map(item => {
          const isLow = item.adherenceRate < 60;
          const isMedium = item.adherenceRate >= 60 && item.adherenceRate < 85;
          const barColor = isLow ? '#ef4444' : isMedium ? '#f59e0b' : '#10b981';

          return (
            <div
              key={item.id}
              style={{
                padding: '10px 12px',
                borderRadius: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px', color: '#1e293b', fontWeight: '800' }}>
                  {item.name}
                </strong>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '900',
                  color: barColor
                }}>
                  {item.adherenceRate}% Adherencia
                </span>
              </div>

              {/* BARRA DE PROGRESO DE ADHERENCIA */}
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${item.adherenceRate}%`, height: '100%', background: barColor, borderRadius: '3px', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', color: '#64748b', fontWeight: '700' }}>
                <span>
                  ✅ {item.loggedCount} realizadas {item.skippedCount > 0 && <span style={{ color: '#dc2626' }}>• ⚠️ {item.skippedCount} omitidas</span>}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {item.deltaWeight > 0 ? (
                    <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '800' }}>
                      <TrendingUp size={12} /> +{item.deltaWeight} lbs ({item.firstWeight} ➔ {item.latestWeight})
                    </span>
                  ) : item.deltaWeight < 0 ? (
                    <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '800' }}>
                      <TrendingDown size={12} /> {item.deltaWeight} lbs
                    </span>
                  ) : item.latestWeight > 0 ? (
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Minus size={12} /> {item.latestWeight} lbs
                    </span>
                  ) : (
                    <span>Sin peso</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
