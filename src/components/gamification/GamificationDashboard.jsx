import React from 'react';
import { Trophy, Flame, Target, Sparkles } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';
import XPLevelCard from './XPLevelCard';
import StreakAndMetricsCard from './StreakAndMetricsCard';
import GamifiedHeatmap from './GamifiedHeatmap';
import PhysiquePredictorCard from './PhysiquePredictorCard';

export default function GamificationDashboard({ workoutHistory = [], bodyMetrics = [] }) {
  const gamification = useGamification(workoutHistory, bodyMetrics);

  return (
    <div style={{
      marginTop: '20px',
      paddingTop: '18px',
      borderTop: '2px dashed #cbd5e1'
    }}>
      {/* CABECERA PRINCIPAL DEL HUB DE GAMIFICACIÓN */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)'
          }}>
            <Trophy size={18} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
              Gamificación & Progreso Adonis
            </h2>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
              Puntos XP, racha, constancia y proyección hacia tu cuerpo ideal
            </span>
          </div>
        </div>
      </div>

      {/* 1. TARJETA DE NIVEL Y PUNTOS XP */}
      <XPLevelCard
        level={gamification.level}
        rank={gamification.rank}
        totalXp={gamification.totalXp}
        xpInCurrentLevel={gamification.xpInCurrentLevel}
        xpNeededForLevel={gamification.xpNeededForLevel}
        levelProgressPercent={gamification.levelProgressPercent}
        streakMultiplier={gamification.streakMultiplier}
        completedSessionsCount={gamification.completedSessionsCount}
        overloadCount={gamification.overloadCount}
      />

      {/* 2. CONTADORES DE DÍAS Y RACHA ACTIVA */}
      <StreakAndMetricsCard
        completedSessionsCount={gamification.completedSessionsCount}
        currentStreakDays={gamification.currentStreakDays}
        adherencePercent={gamification.adherencePercent}
        totalVolumeAccumulated={gamification.totalVolumeAccumulated}
      />

      {/* 3. HEATMAP DE CONSTANCIA (8 SEMANAS) */}
      <GamifiedHeatmap workoutHistory={workoutHistory} />

      {/* 4. PREDICTOR INTELIGENTE: TIEMPO HACIA TU CUERPO IDEAL */}
      <PhysiquePredictorCard
        trueProjection={gamification.trueProjection}
        currentWeekWorkouts={gamification.currentWeekWorkouts}
        bodyComposition={gamification.bodyComposition}
        physiqueGoal={gamification.physiqueGoal}
        setBodyComposition={gamification.setBodyComposition}
        setPhysiqueGoal={gamification.setPhysiqueGoal}
      />
    </div>
  );
}
