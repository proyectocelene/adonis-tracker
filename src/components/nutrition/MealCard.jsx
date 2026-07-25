import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Search, Sparkles, Send, AlertCircle, ArrowRight, Check, AlertTriangle, RefreshCw, Bookmark, Utensils, MoveRight, Layers, Flame, Dumbbell, Plus, X, AlertOctagon, Wine, Slice } from 'lucide-react';
import { analyzeMealWithAI } from '../../services/deepseek';
import { useModal } from '../common/UIComponents';

export default function MealCard({
  meal,
  allMealOptions = [],
  isExpanded,
  onToggleExpand,
  isCompleted,
  onToggleComplete,
  completedRationIndices = [],
  onToggleRationIndex,
  onMigrateRations,
  onApplyCalculatedMacros,
  onAddExcessItem,
  onRemoveExcessItem,
  apiKey,
  nextMealName = "siguiente turno"
}) {
  const modal = useModal();
  const [selectedChipIndex, setSelectedChipIndex] = useState(null);
  const [mealTextInput, setMealTextInput] = useState(meal.savedText || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(meal.savedAnalysis || null);
  const [migrateTargetId, setMigrateTargetId] = useState(meal.nextMealId || 'comida');

  // Estado para desplegar panel manual de Excesos / Cheat Meals
  const [showExcessPanel, setShowExcessPanel] = useState(false);
  const [excessPresetQty, setExcessPresetQty] = useState('1');
  const [customExcessName, setCustomExcessName] = useState('');
  const [customExcessKcal, setCustomExcessKcal] = useState('');

  useEffect(() => {
    if (meal.savedText !== undefined) setMealTextInput(meal.savedText || '');
    if (meal.savedAnalysis !== undefined) setAiAnalysis(meal.savedAnalysis || null);
  }, [meal.savedText, meal.savedAnalysis]);

  const getGroupEmoji = (groupName) => {
    const lower = groupName.toLowerCase();
    if (lower.includes('proteína') || lower.includes('aoa') || lower.includes('animal')) return '🥩';
    if (lower.includes('cereal') || lower.includes('carbohidrato') || lower.includes('arroz') || lower.includes('avena')) return '🍚';
    if (lower.includes('verdura') || lower.includes('fibra')) return '🥦';
    if (lower.includes('fruta') || lower.includes('azúcar')) return '🍎';
    if (lower.includes('lácteo') || lower.includes('leche') || lower.includes('yogur')) return '🥛';
    if (lower.includes('grasa') || lower.includes('aguacate') || lower.includes('aceite')) return '🥑';
    if (lower.includes('legum') || lower.includes('frijol') || lower.includes('lenteja')) return '🍲';
    return '🥗';
  };

  const handleChipClick = (index) => {
    setSelectedChipIndex(selectedChipIndex === index ? null : index);
  };

  const handleGoogleSearchExamples = (groupName, desc) => {
    const query = `Alimentos equivalentes dieta fitness mexicanos para ${groupName} ${desc}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleToggleSingleRation = (index, e) => {
    e.stopPropagation();
    const isCurrentlyChecked = completedRationIndices.includes(index);
    const updatedIndices = isCurrentlyChecked
      ? completedRationIndices.filter(i => i !== index)
      : [...completedRationIndices, index];

    onToggleRationIndex(meal.id, updatedIndices);

    if (!isCurrentlyChecked && updatedIndices.length === meal.equivalents.length) {
      if (!isCompleted) {
        onToggleComplete(true);
        modal.showAlert({
          title: `🏆 Todas las raciones individuales de "${meal.title.split(' ')[1]}" cubiertas`,
          message: "¡Al completar una por una cada ración de tu plan, la comida completa se ha sincronizado y marcado como 100% lograda sumando todos sus macros al combustible del día!",
          variant: "success"
        });
      }
    } else if (isCurrentlyChecked && isCompleted) {
      onToggleComplete(false);
    }
  };

  const handleToggleFullMeal = () => {
    if (isCompleted) {
      onToggleComplete(false);
      onToggleRationIndex(meal.id, []);
    } else {
      onToggleComplete(true);
      const allIndices = meal.equivalents.map((_, i) => i);
      onToggleRationIndex(meal.id, allIndices);
    }
  };

  const handleMigrateUncheckedRations = () => {
    const uncheckedIndices = meal.equivalents
      .map((item, idx) => ({ item, idx }))
      .filter(x => !completedRationIndices.includes(x.idx));

    if (uncheckedIndices.length === 0) {
      modal.showAlert({ title: "✅ Sin raciones pendientes", message: "¡Ya habías marcado y cubierto todas las raciones de esta comida!", variant: "info" });
      return;
    }

    const targetMealObj = allMealOptions.find(m => m.id === migrateTargetId) || { title: 'tu siguiente turno' };
    const itemsToMigrate = uncheckedIndices.map(x => x.item);

    onMigrateRations(meal.id, migrateTargetId, uncheckedIndices.map(x => x.idx), itemsToMigrate);
    modal.showAlert({
      title: "🚀 Raciones Migradas con Éxito",
      message: `Las ${uncheckedIndices.length} raciones no consumidas en "${meal.title.split(' ')[1]}" se han traspasado a "${targetMealObj.title}".\n\n¡Así resguardas un balance absoluto de tus 2,201 kcal para no sacrificar músculo en el déficit!`,
      variant: "success"
    });
  };

  // Presets rápidos para excesos / cheat meals
  const excessPresets = [
    { name: "Rebanada(s) de Pizza", kcal: 240, carbs: 30, fats: 10, prot: 9, emoji: "🍕" },
    { name: "Cerveza(s) (Lata 355ml)", kcal: 150, carbs: 13, fats: 0, prot: 1, emoji: "🍺" },
    { name: "Taco(s) al Pastor/Asada", kcal: 180, carbs: 18, fats: 8, prot: 9, emoji: "🌮" },
    { name: "Hamburguesa Sencilla/Combo", kcal: 650, carbs: 55, fats: 32, prot: 32, emoji: "🍔" },
    { name: "Porción Papas Fritas", kcal: 350, carbs: 42, fats: 18, prot: 4, emoji: "🍟" },
    { name: "Pan Dulce / Donas", kcal: 320, carbs: 48, fats: 12, prot: 4, emoji: "🍩" }
  ];

  // Agregar un exceso rápido preset (ej. 8 rebanadas de pizza)
  const handleAddPresetExcess = (preset) => {
    const qty = parseInt(excessPresetQty) || 1;
    const totalKcal = preset.kcal * qty;
    const totalCarbs = (preset.carbs || 0) * qty;
    const totalFats = (preset.fats || 0) * qty;
    const totalProt = (preset.prot || 0) * qty;

    const newExcess = {
      id: `exc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: `${qty}x ${preset.name}`,
      calories: totalKcal,
      carbs: totalCarbs,
      fats: totalFats,
      protein: totalProt,
      emoji: preset.emoji
    };

    if (onAddExcessItem) onAddExcessItem(meal.id, newExcess);
    modal.showAlert({
      title: `${preset.emoji} Exceso Registrado: +${totalKcal} kcal`,
      message: `Se agregaron ${qty}x "${preset.name}" al conteo de tus calorías de hoy (+${totalKcal} kcal). ¡Un registro honesto de tus macros es el secreto de la verdadera adherencia y progreso deportivo!`,
      variant: "warning"
    });
  };

  // Agregar exceso personalizado
  const handleAddCustomExcess = (e) => {
    e.preventDefault();
    if (!customExcessName || !customExcessKcal) return;
    const kcal = parseFloat(customExcessKcal) || 0;

    const newExcess = {
      id: `exc_${Date.now()}`,
      name: customExcessName.trim(),
      calories: kcal,
      carbs: Math.round(kcal * 0.5 / 4),
      fats: Math.round(kcal * 0.35 / 9),
      protein: Math.round(kcal * 0.15 / 4),
      emoji: "⚠️"
    };

    if (onAddExcessItem) onAddExcessItem(meal.id, newExcess);
    setCustomExcessName('');
    setCustomExcessKcal('');
    modal.showAlert({ title: "⚠️ Consumo Extra Anotado", message: `Sumado +${kcal} kcal a tu conteo diario en esta comida.`, variant: "warning" });
  };

  // Analizar con Inteligencia DeepSeek AI
  const handleAnalyzeWithAI = async (e) => {
    e.preventDefault();
    if (!mealTextInput.trim()) {
      modal.showAlert({ title: "✍️ Caja de Texto Vacía", message: "Describe tus alimentos o si consumiste de más (ej. 'Hoy me comí 8 rebanadas de pizza y 4 cervezas').", variant: "warning" });
      return;
    }
    if (!apiKey) {
      modal.showAlert({ title: "🔑 Clave API DeepSeek Requerida", message: "Introduce tu Clave en la configuración superior o utiliza el registro manual de excesos con el botón ⚠️.", variant: "warning" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeMealWithAI({
        apiKey,
        mealName: meal.title,
        assignedEquivalents: meal.equivalents,
        userTextInput: mealTextInput.trim()
      });

      setAiAnalysis(result);

      // Si la IA detecta excesos calóricos ("8 rebanadas de pizza"), los sumamos al total de la tarjeta y del día
      if (result.excesosDetectados && result.excesosDetectados.length > 0 && onAddExcessItem) {
        result.excesosDetectados.forEach((exc, idx) => {
          if (exc && exc.calorias > 0) {
            const autoExcess = {
              id: `exc_ai_${Date.now()}_${idx}`,
              name: `[AI Detectado] ${exc.alimento}`,
              calories: exc.calorias,
              carbs: Math.round((exc.calorias * 0.4) / 4),
              fats: Math.round((exc.calorias * 0.4) / 9),
              protein: Math.round((exc.calorias * 0.2) / 4),
              emoji: "🍕"
            };
            onAddExcessItem(meal.id, autoExcess);
          }
        });
      }

      const autoCheckedIndices = [...completedRationIndices];
      result.cumplimientoPorGrupo?.forEach(comp => {
        if (comp.estado === 'cumplido' || comp.estado === 'excedido') {
          meal.equivalents.forEach((eq, eqIdx) => {
            if (eq.group.toLowerCase().includes(comp.grupo.split(' ')[0].toLowerCase()) && !autoCheckedIndices.includes(eqIdx)) {
              autoCheckedIndices.push(eqIdx);
            }
          });
        }
      });

      onToggleRationIndex(meal.id, autoCheckedIndices);

      if (onApplyCalculatedMacros) {
        onApplyCalculatedMacros(meal.id, {
          text: mealTextInput.trim(),
          analysis: result,
          calories: result.caloriasEstimadas || meal.calories,
          protein: result.proteinaEstimada || meal.protein,
          carbs: result.carbsEstimados || meal.carbs,
          fats: result.grasasEstimadas || meal.fats
        });
      }

      modal.showAlert({
        title: "🧠 Análisis Clínico DeepSeek Concluido",
        message: `Evaluamos con total objetividad tu ingesta:\n\n🔥 Calorías Reales: ~${result.caloriasEstimadas} kcal\n💪 Proteína: ~${result.proteinaEstimada}g\n\n${result.excesosDetectados?.length > 0 ? `⚠️ ¡Detectamos y sumamos tus consumos extras/excesos en pantalla para preservar un registro honesto del déficit!` : ''}`,
        variant: "success"
      });
    } catch (err) {
      modal.showAlert({ title: "❌ Error de Conexión AI", message: err.message || "Revisa tu conexión o saldo API DeepSeek.", variant: "danger" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedEquivalent = selectedChipIndex !== null ? meal.equivalents[selectedChipIndex] : null;
  const pendingCount = meal.equivalents.length - completedRationIndices.length;
  const destinationOptions = allMealOptions.filter(m => m.id !== meal.id);
  const excessItems = meal.excessItems || [];
  const excessKcalTotal = excessItems.reduce((sum, item) => sum + (item.calories || 0), 0);

  return (
    <div 
      className="card transition-all"
      style={{
        margin: 0,
        borderLeft: isCompleted ? '6px solid #10b981' : (excessItems.length > 0 ? '6px solid #f59e0b' : (completedRationIndices.length > 0 ? '6px solid #38bdf8' : '6px solid #0066ff')),
        background: isCompleted ? '#f0fdf4' : '#ffffff',
        boxShadow: isExpanded ? '0 15px 30px rgba(0,0,0,0.08)' : '0 4px 12px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}
    >
      {/* Cabecera Táctil de la Comida */}
      <div
        onClick={onToggleExpand}
        style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none', gap: '12px', background: isExpanded ? 'rgba(241, 245, 249, 0.7)' : 'transparent' }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: isCompleted ? '#15803d' : '#0f172a', whiteSpace: 'normal', lineBreak: 'strict' }}>
              {meal.title}
            </h3>
            {isCompleted && <span className="badge badge-green" style={{ fontSize: '11px', padding: '2px 8px', fontWeight: '800' }}>¡Logrado!</span>}
            {!isCompleted && completedRationIndices.length > 0 && (
              <span className="badge badge-blue" style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', fontWeight: '800' }}>
                ✓ {completedRationIndices.length}/{meal.equivalents.length} raciones
              </span>
            )}
            {excessItems.length > 0 && (
              <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '800' }}>
                ⚠️ +{excessKcalTotal} kcal (Excesos)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: '#475569', fontWeight: '700' }}>
            <span style={{ color: '#047857', fontWeight: '800' }}>🔥 ~{(meal.savedAnalysis?.caloriasEstimadas || meal.calories) + excessKcalTotal} kcal</span>
            <span>• 💪 {meal.savedAnalysis?.proteinaEstimada || meal.protein}g Prot</span>
            <span>• 🍚 {meal.savedAnalysis?.carbsEstimados || meal.carbs}g Carbs</span>
            <span>• 🥑 {meal.savedAnalysis?.grasasEstimadas || meal.fats}g Grasas</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleToggleFullMeal(); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            title="Marcar comida como terminada"
          >
            {isCompleted ? <CheckCircle2 size={34} color="#10b981" /> : <Circle size={34} color="#cbd5e1" />}
            <span style={{ fontSize: '9px', color: isCompleted ? '#10b981' : '#64748b', fontWeight: '800', marginTop: '2px' }}>{isCompleted ? 'Logrado' : 'Todo ✓'}</span>
          </button>
          <div style={{ width: '34px', height: '34px', borderRadius: '17px', background: isExpanded ? '#0066ff' : '#f1f5f9', color: isExpanded ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Contenido Desplegado */}
      {isExpanded && (
        <div className="animate-fade" style={{ padding: '16px', borderTop: '1px solid #cbd5e1', background: '#f8fafc' }}>
          
          {/* 1. CHIPS INDIVIDUALES CON CHECKBOX (✓) */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#1e293b', fontWeight: '800', textTransform: 'uppercase', display: 'block' }}>
                  🎯 Raciones del Plan (Marca ✓ en cada chip):
                </strong>
                <span style={{ fontSize: '11px', color: '#047857', fontWeight: '700' }}>Toca un chip para ver ejemplos en vivo de tu dieta.</span>
              </div>
              <span className="badge" style={{ background: '#eff6ff', color: '#0066ff', fontWeight: '800' }}>{completedRationIndices.length}/{meal.equivalents.length} listas</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {meal.equivalents.map((item, idx) => {
                const isSelectedForInfo = selectedChipIndex === idx;
                const isRationChecked = completedRationIndices.includes(idx);
                const emoji = getGroupEmoji(item.group);
                const isMigratedItem = !!item.isMigrated;

                return (
                  <div
                    key={idx}
                    onClick={() => handleChipClick(idx)}
                    style={{
                      background: isRationChecked ? '#ecfdf5' : (isSelectedForInfo ? '#eff6ff' : '#ffffff'),
                      border: isRationChecked ? '1.5px solid #10b981' : (isSelectedForInfo ? '1.5px solid #0066ff' : '1.5px solid #cbd5e1'),
                      borderRadius: '16px', padding: '6px 12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '8px', color: isRationChecked ? '#065f46' : '#1e293b'
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleToggleSingleRation(idx, e)}
                      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {isRationChecked ? <CheckCircle2 size={20} color="#10b981" /> : <Circle size={20} color="#94a3b8" />}
                    </button>
                    <span>{emoji} <strong style={{ textDecoration: isRationChecked ? 'line-through' : 'none' }}>{item.rations}</strong> {item.group.split('(')[0]}</span>
                    {isMigratedItem && <span style={{ fontSize: '10px', background: '#ede9fe', color: '#6d28d9', padding: '2px 6px', borderRadius: '10px', fontWeight: '800' }}>Migrada</span>}
                  </div>
                );
              })}
            </div>

            {selectedEquivalent && (
              <div className="animate-fade" style={{ marginTop: '12px', background: '#ffffff', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '14px' }}>
                <div className="flex-between" style={{ marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <strong style={{ color: '#1e40af', fontSize: '14px', fontWeight: '800' }}>{getGroupEmoji(selectedEquivalent.group)} {selectedEquivalent.group}</strong>
                  <span className="badge badge-blue">{selectedEquivalent.rations} meta</span>
                </div>
                <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 12px 0', lineHeight: '1.5' }}>💡 <strong>Ejemplos Prácticos:</strong> {selectedEquivalent.desc}.</p>
                <button
                  type="button"
                  onClick={() => handleGoogleSearchExamples(selectedEquivalent.group, selectedEquivalent.desc)}
                  style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #7dd3fc', borderRadius: '12px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Search size={14} color="#0284c7" /> 🔍 Ver fotos y ejemplos en Google
                </button>
              </div>
            )}
          </div>

          {/* 2. SISTEMA DE EXCESOS CALÓRICOS / CHEAT MEAL (8 PIZZAS, 4 CERVEZAS...) */}
          <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: '20px', padding: '16px', marginBottom: '18px' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '8px', marginBottom: showExcessPanel ? '14px' : '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertOctagon size={22} color="#d97706" />
                <div>
                  <strong style={{ fontSize: '14px', color: '#92400e', fontWeight: '800', display: 'block' }}>
                    🍕 Excesos Calóricos o Consumo Extra (Pizza, Cerveza, Snacks)
                  </strong>
                  <span style={{ fontSize: '11px', color: '#b45309', fontWeight: '600', display: 'block' }}>
                    {excessItems.length > 0 ? `Anotaste +${excessKcalTotal} kcal extra reales al combustible de hoy.` : `Si comiste más del plan, anótalo aquí para mantener tu bitácora honesta.`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowExcessPanel(!showExcessPanel)}
                style={{ background: '#d97706', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' }}
              >
                {showExcessPanel ? <X size={16} /> : <Plus size={16} />}
                {showExcessPanel ? 'Cerrar Excesos' : '⚠️ + Registrar Exceso'}
              </button>
            </div>

            {/* Chips de excesos ya registrados */}
            {excessItems.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', marginBottom: showExcessPanel ? '14px' : '0' }}>
                {excessItems.map(item => (
                  <div key={item.id} style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', padding: '6px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>{item.emoji || '⚠️'} {item.name}: <strong style={{ color: '#dc2626' }}>+{item.calories} kcal</strong></span>
                    <button
                      type="button"
                      onClick={() => onRemoveExcessItem && onRemoveExcessItem(meal.id, item)}
                      style={{ background: '#ffffff', border: 'none', color: '#dc2626', width: '20px', height: '20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                      title="Quitar exceso"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Panel para añadir exceso con presets inmediatos */}
            {showExcessPanel && (
              <div className="animate-fade" style={{ paddingTop: '14px', borderTop: '1px dashed #fcd34d' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#78350f' }}>Cantidad o Piezas:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['1', '2', '4', '6', '8'].map(num => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setExcessPresetQty(num)}
                        style={{ padding: '6px 12px', borderRadius: '10px', background: excessPresetQty === num ? '#d97706' : '#ffffff', color: excessPresetQty === num ? '#ffffff' : '#78350f', border: '1px solid #fcd34d', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {num}x
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={excessPresetQty}
                    onChange={(e) => setExcessPresetQty(e.target.value)}
                    style={{ width: '60px', padding: '6px', textAlign: 'center', borderRadius: '10px', border: '1px solid #d97706', fontWeight: '800', fontSize: '13px' }}
                    title="Cantidad manual"
                  />
                  <span style={{ fontSize: '11px', color: '#92400e', fontWeight: '700' }}>Toca un alimento para sumarlo con esta cantidad:</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {excessPresets.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleAddPresetExcess(preset)}
                      style={{ background: '#ffffff', border: '1.5px solid #f59e0b', color: '#92400e', padding: '8px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.15s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
                    >
                      {preset.emoji} {preset.name} (+{preset.kcal * (parseInt(excessPresetQty) || 1)} kcal)
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAddCustomExcess} style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: '#ffffff', padding: '10px', borderRadius: '14px', border: '1px solid #fde68a' }}>
                  <input
                    type="text"
                    placeholder="Otro exceso manual (ej. Pastel)..."
                    value={customExcessName}
                    onChange={e => setCustomExcessName(e.target.value)}
                    style={{ flex: 2, padding: '8px 12px', fontSize: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '700', minWidth: '150px' }}
                  />
                  <input
                    type="number"
                    placeholder="Kcal extras (ej. 450)..."
                    value={customExcessKcal}
                    onChange={e => setCustomExcessKcal(e.target.value)}
                    style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '700', minWidth: '90px', textAlign: 'center' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: 'auto', background: '#d97706', padding: '8px 16px', fontSize: '12px', fontWeight: '800', borderRadius: '10px' }}>
                    + Sumar al Día
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* 3. SISTEMA DE MIGRACIÓN DE RACIONES NO CONSUMIDAS */}
          {!isCompleted && pendingCount > 0 && completedRationIndices.length > 0 && (
            <div className="card animate-fade" style={{ padding: '16px', marginBottom: '18px', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1.5px solid #fbbf24', borderRadius: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                <Layers size={24} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '15px', color: '#92400e', fontWeight: '800', display: 'block' }}>
                    ⚖️ ¿Dejarás {pendingCount} ración(es) pendientes sin comer hoy aquí?
                  </strong>
                  <span style={{ fontSize: '12px', color: '#78350f', lineHeight: '1.4', display: 'block', marginTop: '2px', fontWeight: '600' }}>
                    Selecciona hacia qué comida quieres <strong>Migrar estas porciones faltantes</strong>:
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={migrateTargetId}
                  onChange={(e) => setMigrateTargetId(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '14px', border: '1.5px solid #d97706', background: '#ffffff', color: '#0f172a', fontWeight: '800', fontSize: '13px', minWidth: '180px' }}
                >
                  {destinationOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>➔ Migrar pendientes a: {opt.title.split(' ')[1] || opt.title}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleMigrateUncheckedRations}
                  style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <MoveRight size={16} /> 🚀 Mover y Cerrar Turno
                </button>
              </div>
            </div>
          )}

          {/* 4. CAJA DE TEXTO LIBRE: "¿QUÉ COMISTE O BEBISTE?" & DEEPSEEK AI */}
          <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)', border: '1.5px solid #bfdbfe', borderRadius: '22px', padding: '18px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} color="#0066ff" />
              <strong style={{ fontSize: '15px', color: '#1e3a8a', fontWeight: '800' }}>✍️ Registro Libre (Comidas, Pizzas o Alcohol) & Análisis AI</strong>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0', lineHeight: '1.5' }}>
              Escribe libremente con tus palabras: <em>"Hoy me comí 8 rebanadas de pizza de pepperoni y 4 cervezas frías"</em> o <em>"Un sándwich y ensalada"</em>. DeepSeek calculará la realidad:
            </p>

            <form onSubmit={handleAnalyzeWithAI}>
              <textarea
                placeholder="Describe aquí tus alimentos, cantidades o si tuviste algún exceso..."
                value={mealTextInput}
                onChange={(e) => setMealTextInput(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '16px', border: '1.5px solid #cbd5e1', background: '#ffffff', fontSize: '14px', fontFamily: 'inherit', color: '#0f172a', fontWeight: '600', resize: 'vertical', lineHeight: '1.5', marginBottom: '10px' }}
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', background: isAnalyzing ? '#64748b' : 'linear-gradient(135deg, #0066ff 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: '800', fontSize: '14px', cursor: isAnalyzing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: isAnalyzing ? 'none' : '0 6px 20px rgba(0, 102, 255, 0.35)' }}
              >
                {isAnalyzing ? <><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> 🧠 Analizando Excesos y Macros AI...</> : <><Sparkles size={18} /> ✨ Analizar Ingesta Reales y Excesos (DeepSeek AI)</>}
              </button>
            </form>

            {/* RESULTADO AI */}
            {aiAnalysis && (
              <div className="animate-fade" style={{ marginTop: '18px', background: '#ffffff', border: '2px solid #0066ff', borderRadius: '20px', padding: '18px', boxShadow: '0 10px 30px rgba(0, 102, 255, 0.1)' }}>
                <div className="flex-between" style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px' }}>🤖</span>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#0f172a', fontWeight: '800', display: 'block' }}>Evaluación Clínica del AI</strong>
                      <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: '700' }}>Cálculo Realista sin Ocultar Calorías</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-green" style={{ fontSize: '12px', padding: '4px 10px' }}>🔥 ~{aiAnalysis.caloriasEstimadas} kcal</span>
                    <span className="badge badge-blue" style={{ fontSize: '12px', padding: '4px 10px' }}>💪 {aiAnalysis.proteinaEstimada}g Prot</span>
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.5', margin: '0 0 16px 0', background: '#f8fafc', padding: '12px 14px', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: '600' }}>
                  💬 <strong>Reporte AI:</strong> {aiAnalysis.resumen}
                </div>

                {/* Si la IA detectó excesos, mostrar tarjeta especial roja */}
                {aiAnalysis.excesosDetectados && aiAnalysis.excesosDetectados.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '16px', padding: '14px', marginBottom: '16px' }}>
                    <strong style={{ color: '#991b1b', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      ⚠️ Excesos Calóricos Detectados & Sumados:
                    </strong>
                    {aiAnalysis.excesosDetectados.map((ex, i) => (
                      <div key={i} style={{ fontSize: '13px', color: '#7f1d1d', fontWeight: '700', borderBottom: i < aiAnalysis.excesosDetectados.length - 1 ? '1px dashed #fca5a5' : 'none', paddingBottom: '6px', marginBottom: '6px' }}>
                        • <strong>{ex.alimento}</strong>: <span style={{ color: '#dc2626', fontWeight: '900' }}>+{ex.calorias} kcal</span> ({ex.macros}).
                        <span style={{ display: 'block', fontSize: '11px', color: '#991b1b', fontStyle: 'italic', marginTop: '2px' }}>💡 {ex.impacto}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ fontSize: '12px', color: '#475569', fontWeight: '800', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>📊 Estado de Raciones del Menú:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {aiAnalysis.cumplimientoPorGrupo?.map((item, idx) => {
                      let bg = '#ecfdf5'; let border = '#86efac'; let textColor = '#065f46'; let icon = '✅';
                      if (item.estado === 'excedido') { bg = '#fef2f2'; border = '#fca5a5'; textColor = '#991b1b'; icon = '⚠️'; }
                      else if (item.estado === 'faltante') { bg = '#fef3c7'; border = '#fde047'; textColor = '#92400e'; icon = '⭕️'; }

                      return (
                        <div key={idx} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: '14px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '700', color: textColor, gap: '10px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '150px' }}>
                            <span style={{ fontSize: '14px', display: 'block', fontWeight: '800' }}>{icon} {item.grupo}</span>
                            <span style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginTop: '2px', opacity: 0.9 }}>{item.comentario}</span>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontWeight: '900', fontSize: '13px', background: '#ffffff', padding: '4px 10px', borderRadius: '12px', border: `1px solid ${border}` }}>{item.consumidas} / {item.metaRaciones} raciones</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón Maestro para Cerrar Turno */}
          <button
            type="button"
            onClick={handleToggleFullMeal}
            style={{ width: '100%', padding: '16px', borderRadius: '18px', border: isCompleted ? '1.5px solid #cbd5e1' : 'none', background: isCompleted ? '#f1f5f9' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: isCompleted ? '#475569' : '#ffffff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: isCompleted ? 'none' : '0 8px 25px rgba(16, 185, 129, 0.4)' }}
          >
            {isCompleted ? <>↩️ Comida Terminada • Desmarcar Todo</> : <><CheckCircle2 size={22} /> ✓ Marcar Toda la Comida y sus {meal.equivalents.length} Raciones como Logradas</>}
          </button>
        </div>
      )}
    </div>
  );
}
