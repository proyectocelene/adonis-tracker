import React from 'react';
import { Trophy, Sparkles, Zap, Flame, Award } from 'lucide-react';

export default function XPLevelCard({
  level,
  rank,
  totalXp,
  xpInCurrentLevel,
  xpNeededForLevel,
  levelProgressPercent,
  streakMultiplier,
  completedSessionsCount,
  overloadCount
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '20px',
      padding: '16px',
      color: '#ffffff',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
      marginBottom: '14px',
      border: '1px solid #334155',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Luz ambiental sutil */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,102,255,0.25) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* CABECERA: NIVEL, TÍTULO Y RANGO */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            border: '2px solid rgba(255,255,255,0.15)',
            flexShrink: 0
          }}>
            {rank?.badge || '🏆'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', fontWeight: '800' }}>
                Rango Adonis
              </span>
              {streakMultiplier > 1 && (
                <span style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '900',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <Flame size={10} /> x{streakMultiplier} Boost
                </span>
              )}
            </div>
            <h3 style={{ margin: '1px 0 0 0', fontSize: '16px', fontWeight: '900', color: '#ffffff' }}>
              {rank?.title || 'Iniciado'}
            </h3>
          </div>
        </div>

        {/* BADGE NIVEL */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '4px 10px',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '9.5px', color: '#cbd5e1', fontWeight: '700', textTransform: 'uppercase' }}>NIVEL</span>
            <strong style={{ fontSize: '17px', color: '#38bdf8', fontWeight: '900', display: 'block', lineHeight: 1 }}>
              {level}
            </strong>
          </div>
        </div>
      </div>

      {/* BARRA DE PROGRESO XP */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} color="#fbbf24" fill="#fbbf24" /> {totalXp.toLocaleString()} XP Totales
          </span>
          <span style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: '800' }}>
            {xpInCurrentLevel} / {xpNeededForLevel} XP ({levelProgressPercent}%)
          </span>
        </div>

        {/* CONTENEDOR DE BARRA */}
        <div style={{
          width: '100%',
          height: '10px',
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: '10px',
          overflow: 'hidden',
          padding: '2px'
        }}>
          <div style={{
            width: `${levelProgressPercent}%`,
            height: '100%',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #0066ff 50%, #818cf8 100%)',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
          }} />
        </div>
      </div>

      {/* CONTADORES RÁPIDOS DE GANANCIAS XP */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 8px', borderRadius: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', fontWeight: '700' }}>Sesiones (+100)</span>
          <strong style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '900' }}>{completedSessionsCount}</strong>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 8px', borderRadius: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', fontWeight: '700' }}>Sobrecargas (+25)</span>
          <strong style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '900' }}>{overloadCount}</strong>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 8px', borderRadius: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', fontWeight: '700' }}>Próx. Nivel</span>
          <strong style={{ fontSize: '13px', color: '#fbbf24', fontWeight: '900' }}>{xpNeededForLevel - xpInCurrentLevel} XP</strong>
        </div>
      </div>
    </div>
  );
}
