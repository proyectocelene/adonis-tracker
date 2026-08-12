import React from 'react';
import { BookOpen, X, ShieldAlert, Activity, Flame, Dumbbell, Award, HelpCircle } from 'lucide-react';

export default function GlosarioModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="card animate-scale" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '22px',
        overflowY: 'auto',
        border: '1.5px solid #cbd5e1',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)'
      }}>
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: '#eff6ff', color: '#0066ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
                📖 Glosario & Guía Técnica
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
                Explicación de términos del Protocolo Adonis
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENIDO EXPLICATIVO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* RPE */}
          <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', padding: '14px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Award size={18} color="#0066ff" />
              <strong style={{ fontSize: '14px', color: '#1e3a8a', fontWeight: '900' }}>
                RPE (Rating of Perceived Exertion / Esfuerzo Percibido)
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#1e40af', lineHeight: '1.5', fontWeight: '600' }}>
              Escala de esfuerzo del 1 al 10 para medir qué tan cerca estuviste del fallo muscular:
            </p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#1e3a8a', display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: '600' }}>
              <li><strong>RPE 7:</strong> Pudiste haber hecho 3 repeticiones más.</li>
              <li><strong>RPE 8 (Recomendado):</strong> Te quedaron 2 repeticiones en la recámara. Estímulo de hipertrofia óptimo.</li>
              <li><strong>RPE 9:</strong> Solo podrías haber hecho 1 repetición más con buena técnica.</li>
              <li><strong>RPE 10:</strong> Fallo muscular total. No podrías hacer ninguna repetición adicional.</li>
            </ul>
          </div>

          {/* IAP Y HERNIA */}
          <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', padding: '14px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldAlert size={18} color="#dc2626" />
              <strong style={{ fontSize: '14px', color: '#991b1b', fontWeight: '900' }}>
                Regla Anti-Hernia (IAP / Presión Intraabdominal)
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#991b1b', lineHeight: '1.5', fontWeight: '600' }}>
              Técnica de respiración obligatoria para proteger la pared abdominal:
            </p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#7f1d1d', display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: '600' }}>
              <li><strong>EXHALA CON FUERZA</strong> por la boca en la fase concéntrica (al levantar el peso).</li>
              <li>NUNCA aguantes el aire (Valsalva cerrado) bajo cargas pesadas para evitar picos de presión abdominal.</li>
            </ul>
          </div>

          {/* SOBRECARGA PROGRESIVA & DOBLE PROGRESIÓN */}
          <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', padding: '14px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Dumbbell size={18} color="#16a34a" />
              <strong style={{ fontSize: '14px', color: '#14532d', fontWeight: '900' }}>
                Sobrecarga Progresiva & Doble Progresión
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#166534', lineHeight: '1.5', fontWeight: '600' }}>
              Método científico para aumentar fuerza y volumen muscular gradualmente:
            </p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: '600' }}>
              <li><strong>Pasos:</strong> Si un ejercicio indica "8 a 10 reps" con 80 lbs, inicia con 8 reps.</li>
              <li>La semana siguiente intenta hacer 9 reps, y luego 10 reps con el mismo peso.</li>
              <li>Cuando logres hacer 10 reps en TODAS tus series con excelente forma, ese es el indicador exacto para subir +5 lbs.</li>
            </ul>
          </div>

          {/* ZONA 2 CARDIO */}
          <div style={{ background: '#fffbeb', border: '1.5px solid #fde047', padding: '14px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Flame size={18} color="#d97706" />
              <strong style={{ fontSize: '14px', color: '#78350f', fontWeight: '900' }}>
                Cardio Diario en Zona 2 & Nutrición
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#92400e', lineHeight: '1.5', fontWeight: '600' }}>
              Puedes realizar 30-40 minutos diarios de bicicleta estática, elíptica o caminadora inclinada en Zona 2 (esfuerzo conversacional que utiliza ácidos grasos sin acumular lactato ni fatigar el SNC).
            </p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#78350f', display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: '600' }}>
              <li><strong>Bajo Impacto:</strong> Evita correr en asfalto para prevenir microtraumatismos excéntricos en las piernas.</li>
              <li><strong>Nutrición:</strong> Mantén un déficit calórico moderado (200-500 kcal/día) con 1.6 g/kg de proteína para retener músculo.</li>
              <li><strong>Monitoreo:</strong> Si tu fuerza en pesas cae, reduce el cardio a 3-4 días por semana.</li>
            </ul>
          </div>

          {/* TONELAJE / 1RM */}
          <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', padding: '14px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Activity size={18} color="#7c3aed" />
              <strong style={{ fontSize: '14px', color: '#4c1d95', fontWeight: '900' }}>
                Tonelaje Acumulado (lbs-reps)
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#5b21b6', lineHeight: '1.5', fontWeight: '600' }}>
              Métrica de volumen de trabajo total en la sesión (`Peso × Repeticiones × Series`). Sirve para medir el trabajo biomecánico efectivo producido en el mesociclo.
            </p>
          </div>
        </div>

        {/* BOTÓN CERRAR */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '900',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Entendido, Volver a la App
        </button>
      </div>
    </div>
  );
}
