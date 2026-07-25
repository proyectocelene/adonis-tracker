import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Droplet, Award, RefreshCw, Plus, Heart, Scale, TrendingDown, TrendingUp, UserCheck, Trash2, Calendar, Sparkles, Activity, ShieldCheck, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function NutritionTracker() {
  // Estado de Nutrición Diaria
  const [nutrition, setNutrition] = useLocalStorage('coachv2_nutrition_data', {
    protein: 0,
    water: 0
  });

  // Estado del Historial Biométrica (Peso, Altura, Medidas)
  const [bodyMetrics, setBodyMetrics] = useLocalStorage('coachv2_body_metrics_history', []);

  // Formulario para Nueva Medición Biométrica
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [height, setHeight] = useState(''); // cm
  const [waist, setWaist] = useState(''); // cm o pulg
  const [chest, setChest] = useState(''); 
  const [arm, setArm] = useState(''); 
  const [notes, setNotes] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('fuel'); // 'fuel' | 'metrics'

  const targetProtein = 160; 
  const targetWater = 3500; 

  const addProtein = (amount) => {
    setNutrition(prev => ({
      ...prev,
      protein: Math.max(0, prev.protein + amount)
    }));
  };

  const addWater = (amount) => {
    setNutrition(prev => ({
      ...prev,
      water: Math.max(0, prev.water + amount)
    }));
  };

  const handleResetNutrition = () => {
    if (confirm("¿Estás seguro de reiniciar tus contadores de proteína y agua de hoy a cero?")) {
      setNutrition({ protein: 0, water: 0 });
    }
  };

  const handleSaveMetric = (e) => {
    e.preventDefault();
    if (!weight) {
      alert("Por favor ingresa tu peso corporal para poder registrar la medición biométrica.");
      return;
    }

    const newEntry = {
      id: `bio_${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateString: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }),
      weight: parseFloat(weight),
      unit: weightUnit,
      height: parseFloat(height) || (bodyMetrics[0]?.height || null),
      waist: parseFloat(waist) || null,
      chest: parseFloat(chest) || null,
      arm: parseFloat(arm) || null,
      notes: notes.trim()
    };

    setBodyMetrics(prev => [...prev, newEntry]);
    setIsAddingMetric(false);
    setWeight('');
    setWaist('');
    setChest('');
    setArm('');
    setNotes('');
    alert("✅ ¡Medición corporal registrada y graficada en tu historial!");
  };

  const handleDeleteMetric = (id) => {
    if(confirm("¿Seguro que deseas borrar este registro corporal del historial?")) {
      setBodyMetrics(prev => prev.filter(item => item.id !== id));
    }
  };

  const proteinProgress = Math.min(100, Math.round((nutrition.protein / targetProtein) * 100));
  const waterProgress = Math.min(100, Math.round((nutrition.water / targetWater) * 100));

  // Preparar datos para gráfica de peso
  const getWeightChartData = () => {
    if (bodyMetrics.length === 0) return [];
    return bodyMetrics.slice(-15).map(m => ({
      date: m.dateString.split(',')[0],
      peso: m.weight,
      cintura: m.waist || null,
      unit: m.unit
    }));
  };

  const chartData = getWeightChartData();
  const latestMetric = bodyMetrics[bodyMetrics.length - 1];

  // Cálculo de IMC si hay altura en cm y peso en kg/lbs
  const calculateBMI = (w, u, h) => {
    if (!w || !h) return null;
    let kg = u === 'lbs' ? w * 0.453592 : w;
    let meters = h / 100;
    return (kg / (meters * meters)).toFixed(1);
  };

  const currentBMI = latestMetric ? calculateBMI(latestMetric.weight, latestMetric.unit, latestMetric.height) : null;

  return (
    <div className="container" style={{ paddingBottom: '45px' }}>
      
      {/* Cabecera Principal */}
      <div className="card" style={{ padding: '16px', marginBottom: '16px', borderTop: '4px solid #10b981' }}>
        <div className="flex-between">
          <div>
            <span className="badge badge-green">Nutrición & Biometría</span>
            <h1 style={{ marginTop: '6px', fontSize: '22px', fontWeight: '800', whiteSpace: 'normal', color: '#0f172a' }}>
              Centro Nutricional & Composición Corporal
            </h1>
          </div>
          <button 
            onClick={handleResetNutrition}
            className="btn btn-outline" 
            style={{ width: '42px', height: '42px', padding: 0, borderRadius: '14px', flexShrink: 0 }}
            title="Reiniciar contadores del día"
          >
            <RefreshCw size={18} color="#64748b" />
          </button>
        </div>
      </div>

      {/* Sub-Navegación de Pestañas (Combustible Diario vs Historial de Peso) */}
      <div style={{ 
        display: 'flex', 
        background: '#e2e8f0', 
        borderRadius: '18px', 
        padding: '5px', 
        marginBottom: '20px' 
      }}>
        <button 
          onClick={() => setActiveSubTab('fuel')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            borderRadius: '14px',
            background: activeSubTab === 'fuel' ? '#ffffff' : 'transparent',
            color: activeSubTab === 'fuel' ? '#047857' : '#475569',
            fontWeight: '800',
            fontSize: '14px',
            boxShadow: activeSubTab === 'fuel' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Award size={18} /> Combustible (160g Proteína)
        </button>
        <button 
          onClick={() => setActiveSubTab('metrics')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            borderRadius: '14px',
            background: activeSubTab === 'metrics' ? '#10b981' : 'transparent',
            color: activeSubTab === 'metrics' ? '#ffffff' : '#475569',
            fontWeight: '800',
            fontSize: '14px',
            boxShadow: activeSubTab === 'metrics' ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Scale size={18} /> Bitácora de Peso & Medidas
        </button>
      </div>

      {activeSubTab === 'fuel' ? (
        /* ================= PESTAÑA NUTRICION & AGUA ================= */
        <div className="animate-fade">
          
          <div className="card card-highlight" style={{ padding: '16px', marginBottom: '20px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#065f46', lineHeight: '1.6' }}>
              <strong>🥩 Combustible de Reparación:</strong> Este protocolo exige <strong>160 gramos de proteína diarios</strong> y carbohidratos complejos (arroz, papa, avena) para reparar el tejido miofibrilar estimulado en tu entrenamiento y formar masa muscular magra.
            </p>
          </div>

          {/* TARJETA PROTEINA */}
          <div className="card" style={{ marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0e7490' }}>
                <Award size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex-between">
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Proteína Sintetizada</h2>
                  <span className="badge badge-green" style={{ fontSize: '14px', padding: '4px 10px', fontWeight: '800' }}>
                    {nutrition.protein}g / {targetProtein}g
                  </span>
                </div>
                <div style={{ marginTop: '10px', background: '#f1f5f9', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${proteinProgress}%`, 
                    height: '100%', 
                    background: proteinProgress >= 100 ? '#10b981' : 'linear-gradient(90deg, #34d399, #10b981)', 
                    transition: 'width 0.4s ease',
                    borderRadius: '7px'
                  }} />
                </div>
              </div>
            </div>

            <div className="grid-3" style={{ marginTop: '16px' }}>
              <button className="btn btn-outline" style={{ background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0', fontWeight: '800' }} onClick={() => addProtein(15)}>
                +15g <span style={{ fontSize: '10px', display: 'block', fontWeight: '600' }}>Snack / Huevo</span>
              </button>
              <button className="btn btn-outline" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#86efac', fontWeight: '800' }} onClick={() => addProtein(30)}>
                +30g <span style={{ fontSize: '10px', display: 'block', fontWeight: '600' }}>Scoop Whey</span>
              </button>
              <button className="btn btn-primary" style={{ background: '#047857', fontWeight: '800' }} onClick={() => addProtein(45)}>
                +45g <span style={{ fontSize: '10px', display: 'block', fontWeight: '600' }}>Pollo / Carne</span>
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button onClick={() => addProtein(-10)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: '4px 8px' }}>
                -10g Corregir
              </button>
            </div>
          </div>

          {/* TARJETA AGUA / HIDRATACION */}
          <div className="card" style={{ marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0066ff' }}>
                <Droplet size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex-between">
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Hidratación Celular</h2>
                  <span className="badge badge-blue" style={{ fontSize: '14px', padding: '4px 10px', fontWeight: '800' }}>
                    {(nutrition.water / 1000).toFixed(1)}L / {(targetWater / 1000).toFixed(1)}L
                  </span>
                </div>
                <div style={{ marginTop: '10px', background: '#f1f5f9', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${waterProgress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #38bdf8, #0066ff)', 
                    transition: 'width 0.4s ease',
                    borderRadius: '7px'
                  }} />
                </div>
              </div>
            </div>

            <div className="grid-3" style={{ marginTop: '16px' }}>
              <button className="btn btn-outline" style={{ background: '#f0f9ff', color: '#0284c7', borderColor: '#bae6fd', fontWeight: '800' }} onClick={() => addWater(250)}>
                +250ml <span style={{ fontSize: '10px', display: 'block', fontWeight: '600' }}>Vaso</span>
              </button>
              <button className="btn btn-outline" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#7dd3fc', fontWeight: '800' }} onClick={() => addWater(500)}>
                +500ml <span style={{ fontSize: '10px', display: 'block', fontWeight: '600' }}>Botella</span>
              </button>
              <button className="btn btn-primary" style={{ background: '#0066ff', fontWeight: '800' }} onClick={() => addWater(1000)}>
                +1.0 L <span style={{ fontSize: '10px', display: 'block', fontWeight: '600' }}>Termo Gym</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button onClick={() => addWater(-250)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: '4px 8px' }}>
                -250ml Corregir
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= PESTAÑA HISTORICAL BIOMETRICS (PESO & MEDIDAS) ================= */
        <div className="animate-fade">
          
          {/* Tarjeta de Resumen Biométrica Actual */}
          <div className="card card-highlight" style={{ padding: '16px', marginBottom: '18px' }}>
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <UserCheck size={20} color="#0066ff" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Resumen Antropométrico Actual</h3>
              </div>
              {latestMetric && <span className="badge badge-green">Último: {latestMetric.dateString}</span>}
            </div>

            {latestMetric ? (
              <div className="grid-3" style={{ marginTop: '12px' }}>
                <div style={{ background: '#ffffff', padding: '12px 8px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Peso Actual</span>
                  <strong style={{ fontSize: '20px', color: '#0f172a', display: 'block', margin: '3px 0', fontWeight: '800' }}>{latestMetric.weight} {latestMetric.unit}</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '12px 8px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Altura / Talla</span>
                  <strong style={{ fontSize: '18px', color: '#0e7490', display: 'block', margin: '3px 0', fontWeight: '800' }}>{latestMetric.height ? `${latestMetric.height} cm` : '-'}</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '12px 8px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>IMC Estimado</span>
                  <strong style={{ fontSize: '20px', color: '#7c3aed', display: 'block', margin: '3px 0', fontWeight: '800' }}>{currentBMI || '-'}</strong>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: '#475569', margin: '6px 0 0 0', lineHeight: '1.5' }}>
                📏 Aún no has registrado tu peso ni tus medidas. Añade tus datos corporales a continuación para supervisar tu recomposición muscular mes a mes.
              </p>
            )}
          </div>

          {/* Gráfica de Tendencia de Peso */}
          <div className="card" style={{ padding: '18px', marginBottom: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Curva de Peso Corporal</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Evolución real sin datos simulados</span>
              </div>
              {!isAddingMetric && (
                <button 
                  onClick={() => setIsAddingMetric(true)} 
                  className="btn btn-primary" 
                  style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '14px', fontWeight: '800', background: '#10b981', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}
                >
                  <Plus size={16} /> + Nuevo Registro
                </button>
              )}
            </div>

            {chartData.length === 0 ? (
              <div style={{ padding: '32px 18px', textAlign: 'center', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', margin: '12px 0' }}>
                <Scale size={34} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b', fontWeight: '800' }}>Sin registros en la bitácora corporal</h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                  Al guardar tu primer pesaje, el sistema diagramará aquí tu tendencia en vivo.
                </p>
              </div>
            ) : (
              <div style={{ width: '100%', height: '220px', marginTop: '14px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#10b981" fontSize={11} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #cbd5e1' }} />
                    <Legend verticalAlign="top" height={30} />
                    <Line type="monotone" dataKey="peso" name="Peso Corporal (lbs/kg)" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Módulo de Formulario para Registrar Nuevo Pesaje / Medidas */}
          {isAddingMetric && (
            <div className="card animate-fade" style={{ padding: '18px', borderTop: '5px solid #10b981', marginBottom: '22px', background: '#ffffff', boxShadow: '0 12px 35px rgba(16, 185, 129, 0.15)' }}>
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Sparkles size={20} color="#10b981" />
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>Nueva Medición Antropométrica</h3>
                </div>
                <button onClick={() => setIsAddingMetric(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <Trash2 size={20} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleSaveMetric}>
                <div className="grid-2" style={{ marginBottom: '14px', gap: '12px' }}>
                  <div>
                    <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Peso Corporal (*):</label>
                    <div style={{ display: 'flex', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden' }}>
                      <input 
                        type="number" 
                        step="0.1" 
                        required 
                        placeholder="Ej. 176.5" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)}
                        style={{ flex: 1, border: 'none', padding: '10px', fontWeight: '800', textAlign: 'center' }} 
                      />
                      <select 
                        value={weightUnit} 
                        onChange={(e) => setWeightUnit(e.target.value)}
                        style={{ border: 'none', background: '#f1f5f9', padding: '0 10px', fontWeight: '800' }}
                      >
                        <option value="lbs">lbs</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Altura (cm) - Para IMC:</label>
                    <input 
                      type="number" 
                      placeholder="Ej. 178" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                      style={{ padding: '10px', fontWeight: '800', textAlign: 'center', width: '100%', border: '1.5px solid #cbd5e1', borderRadius: '12px' }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '6px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px', color: '#475569' }}>Medidas Corporales con Cinta (Opcional - en cm/in):</label>
                </div>

                <div className="grid-3" style={{ marginBottom: '14px', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Cintura (Ombligo):</span>
                    <input type="number" step="0.5" placeholder="82 cm" value={waist} onChange={e => setWaist(e.target.value)} style={{ width: '100%', textAlign: 'center' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Pecho / Tórax:</span>
                    <input type="number" step="0.5" placeholder="104 cm" value={chest} onChange={e => setChest(e.target.value)} style={{ width: '100%', textAlign: 'center' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Brazo (Flexionado):</span>
                    <input type="number" step="0.5" placeholder="41 cm" value={arm} onChange={e => setArm(e.target.value)} style={{ width: '100%', textAlign: 'center' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '4px' }}>Notas o Estado (Ayuno, hora, hidratación):</label>
                  <input 
                    type="text" 
                    placeholder="Ej. En ayunas el lunes AM antes del primer empuje" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 12px' }} 
                  />
                </div>

                <div className="grid-2" style={{ gap: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddingMetric(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#10b981' }}>💾 Guardar Registro</button>
                </div>
              </form>
            </div>
          )}

          {/* Historial en Tabla/Lista */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <Calendar size={18} color="#475569" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>Bitácora de Mediciones Anteriores</h3>
          </div>

          {bodyMetrics.length === 0 ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                Sin registros guardados. Todos tus pesajes futuros aparecerán en orden cronológico en esta tabla de control biométrico.
              </p>
            </div>
          ) : (
            [...bodyMetrics].reverse().map((item) => (
              <div key={item.id} className="card" style={{ padding: '14px 16px', marginBottom: '12px', borderLeft: '5px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>{item.weight} {item.unit}</strong>
                    <span className="badge" style={{ background: '#ecfdf5', color: '#047857', fontSize: '11px', fontWeight: '800' }}>📅 {item.dateString}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px', fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                    {item.waist && <span>Cintura: <strong style={{ color: '#0f172a' }}>{item.waist}</strong></span>}
                    {item.chest && <span>Pecho: <strong style={{ color: '#0f172a' }}>{item.chest}</strong></span>}
                    {item.arm && <span>Brazo: <strong style={{ color: '#0f172a' }}>{item.arm}</strong></span>}
                  </div>

                  {item.notes && (
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px', fontStyle: 'italic' }}>
                      💬 "{item.notes}"
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => handleDeleteMetric(item.id)} 
                  style={{ background: '#fef2f2', border: 'none', padding: '8px', borderRadius: '12px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Borrar medición"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}
