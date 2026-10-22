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
      background: 'var(--bg-surface)',
      borderRadius: '20px',
      padding: '16px',
      color: 'var(--text-main)',
      boxShadow: 'var(--shadow-ios)',
      marginBottom: '14px',
      border: '1px solid var(--border-subtle)',
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
        background: 'radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* CABECERA: NIVEL, TÍTULO Y RANGO */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'var(--accent-blue-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
            border: '1px solid var(--border-subtle)',
            flexShrink: 0
          }}>
            {rank?.badge || '🏆'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', fontWeight: '800' }}>
                Rango Adonis
              </span>
              {streakMultiplier > 1 && (
                <span style={{
                  background: 'var(--accent-amber-subtle)',
                  color: 'var(--accent-amber)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
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
            <h3 style={{ margin: '1px 0 0 0', fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>
              {rank?.title || 'Iniciado'}
            </h3>
          </div>
        </div>

        {/* BADGE NIVEL */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '4px 10px',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>NIVEL</span>
            <strong className="font-mono-tech" style={{ fontSize: '17px', color: 'var(--accent-blue)', fontWeight: '900', display: 'block', lineHeight: 1 }}>
              {level}
            </strong>
          </div>
        </div>
      </div>

      {/* BARRA DE PROGRESO XP */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} color="var(--accent-amber)" fill="var(--accent-amber)" /> {totalXp.toLocaleString()} XP Totales
          </span>
          <span className="font-mono-tech" style={{ fontSize: '10.5px', color: 'var(--accent-blue)', fontWeight: '800' }}>
            {xpInCurrentLevel} / {xpNeededForLevel} XP ({levelProgressPercent}%)
          </span>
        </div>

        {/* CONTENEDOR DE BARRA */}
        <div style={{
          width: '100%',
          height: '10px',
          background: 'var(--bg-surface-secondary)',
          borderRadius: '10px',
          overflow: 'hidden',
          padding: '2px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: `${levelProgressPercent}%`,
            height: '100%',
            borderRadius: '8px',
            background: 'var(--accent-blue)',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 10px rgba(0, 102, 255, 0.4)'
          }} />
        </div>
      </div>

      {/* CONTADORES RÁPIDOS DE GANANCIAS XP */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '6px 8px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>Sesiones (+100)</span>
          <strong className="font-mono-tech" style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '900' }}>{completedSessionsCount}</strong>
        </div>
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '6px 8px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>Sobrecargas (+25)</span>
          <strong className="font-mono-tech" style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: '900' }}>{overloadCount}</strong>
        </div>
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '6px 8px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>Próx. Nivel</span>
          <strong className="font-mono-tech" style={{ fontSize: '13px', color: 'var(--accent-amber)', fontWeight: '900' }}>{xpNeededForLevel - xpInCurrentLevel} XP</strong>
        </div>
      </div>
    </div>
  );
}
