import React from 'react';
import { Flame, Check } from 'lucide-react';

export default function CardioScienceTab({ machineType }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {machineType === 'rower' ? (
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '20px' }}>🚣‍♂️</span>
            <strong style={{ color: '#166534', fontSize: '14px', fontWeight: '900' }}>
              Protocolo Matutino: Cardio vs. NEAT en Máquina de Remo
            </strong>
            <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '8px', fontWeight: '900' }}>
              ☀️ Separación ≥ 6h de Pesas
            </span>
          </div>

          <p style={{ fontSize: '12px', color: '#14532d', lineHeight: '1.45', margin: '0 0 10px 0' }}>
            <strong>Anulación del Efecto de Interferencia (AMPK vs. mTOR):</strong> Para que el cardio no bloquee la síntesis proteica miofibrilar ni desgaste tus sustratos de glucógeno para el entrenamiento de hipertrofia, estas sesiones deben realizarse por la mañana, separadas por al menos 6 horas de tu entrenamiento de fuerza.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#14532d' }}>
            {/* OPCIÓN A */}
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #fed7aa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px' }}>⚡</span>
                <strong style={{ color: '#c2410c', fontSize: '12.5px', fontWeight: '900' }}>
                  Opción A: Sesión Híbrida ("Cardio de verdad" + NEAT) — Máximo 1 a 2 veces por semana
                </strong>
              </div>
              <ul style={{ margin: '0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: '1.4' }}>
                <li>
                  <strong>Duración Total:</strong> 35-40 minutos.
                </li>
                <li>
                  <strong style={{ color: '#ea580c' }}>Fase 1 (Cardio HIIT / Vigoroso - 10-15 min):</strong> Realiza de 4 a 6 sprints de 20 segundos a máxima velocidad, seguidos de 40 a 60 segundos de remo muy suave para recuperar. Esfuerzo percibido RPE 16-18 sobre 20.
                </li>
                <li>
                  <strong style={{ color: '#ea580c' }}>Fase 2 (NEAT / LISS - 20-25 min):</strong> Ritmo continuo a muy baja intensidad. Funciona como enfriamiento activo y suma gasto calórico sin añadir fatiga metabólica.
                </li>
              </ul>
            </div>

            {/* OPCIÓN B */}
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #a7f3d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px' }}>🌿</span>
                <strong style={{ color: '#047857', fontSize: '12.5px', fontWeight: '900' }}>
                  Opción B: Sesión Pura de NEAT (LISS) — 2 a 3 veces por semana
                </strong>
              </div>
              <ul style={{ margin: '0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: '1.4' }}>
                <li>
                  <strong>Duración Total:</strong> 30-45 minutos.
                </li>
                <li>
                  <strong style={{ color: '#059669' }}>Intensidad (Talk Test - RPE 12-13 sobre 20):</strong> Debes poder mantener una conversación fluida o respirar cómodamente por la nariz sin jadear.
                </li>
                <li>
                  <strong style={{ color: '#059669' }}>Objetivo:</strong> Simular los pasos y la actividad que no realizas por el trabajo sedentario. No debes terminar exhausto ni con los músculos ardiendo.
                </li>
              </ul>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '8px 10px', borderRadius: '10px', color: '#166534', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11.5px' }}>
            <Check size={16} color="#166534" style={{ flexShrink: 0 }} />
            <span>Beneficio Mecánico: Cero impacto axial en columna o rodillas, tracción escapular suave e inducción mitocondrial sin fatiga residual en sentadillas.</span>
          </div>
        </div>
      ) : (
        <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Flame size={18} color="#0284c7" />
            <strong style={{ color: '#0369a1', fontSize: '13.5px', fontWeight: '900' }}>
              Prescripción Médica de Cardio Diario Adonis (Protocolo Bifásico de 60 Minutos):
            </strong>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#0c4a6e', lineHeight: '1.4' }}>
            {/* FASE A */}
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #7dd3fc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px' }}>🟢</span>
                <strong style={{ color: '#0369a1', fontSize: '12.5px', fontWeight: '900' }}>
                  1. Fase A (30 min al 11-12% de Inclinación):
                </strong>
              </div>
              <ul style={{ margin: '0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>
                  <strong style={{ color: '#0284c7' }}>Zona 2 Lipolítica Pura:</strong> A 120-135 BPM, las mitocondrias oxidan ácidos grasos libres sin agotar las reservas glucolíticas requeridas para el estudio.
                </li>
                <li>
                  <strong style={{ color: '#0284c7' }}>Cero Impacto Articular:</strong> La pendiente reduce drásticamente las fuerzas de impacto sobre los meniscos y cartílago rotuliano en comparación con correr o trotar.
                </li>
              </ul>
            </div>

            {/* FASE B */}
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #6ee7b7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px' }}>🔵</span>
                <strong style={{ color: '#047857', fontSize: '12.5px', fontWeight: '900' }}>
                  2. Fase B (30 min Planos a 0% de Inclinación):
                </strong>
              </div>
              <ul style={{ margin: '0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>
                  <strong style={{ color: '#059669' }}>Descarga del Tendón de Aquiles & Sóleo:</strong> Caminar inclinado más de 30-40 min continuos produce sobrecarga excéntrica en el tendón de Aquiles y la fascia plantar.
                </li>
                <li>
                  <strong style={{ color: '#059669' }}>Retorno Venoso & Aclaramiento:</strong> Pasar a plano descarga la musculatura de la pantorrilla, normaliza el ángulo tibio-tarsiano y promueve el retorno venoso y aclaramiento de lactato.
                </li>
              </ul>
            </div>

            {/* ECUACIONES ACSM */}
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
              <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px', fontWeight: '900' }}>
                3. Ecuaciones Metabólicas ACSM Bi-Fásicas:
              </strong>
              El costo energético se computa independientemente para cada fase: VO₂ con pendiente fraccional en Fase A + VO₂ plano a mayor velocidad en Fase B, sumando kcal mecánicas reales y elevación ganada exacta.
            </div>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '8px 10px', borderRadius: '10px', color: '#166534', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11.5px' }}>
            <Check size={16} color="#166534" style={{ flexShrink: 0 }} />
            <span>Sin interferencia hipertrófica: Este formato bifásico de 60 minutos maximiza el déficit calórico diario protegiendo tus piernas pesadas y la energía cerebral de estudio.</span>
          </div>
        </div>
      )}
    </div>
  );
}
