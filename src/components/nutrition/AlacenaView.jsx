import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Sparkles, Plus, Trash2, CheckCircle2, Circle, ShoppingCart, Package, Utensils, ArrowRight, X, AlertTriangle, ChefHat, RefreshCw, BookmarkCheck, ChevronDown, Check, Flame, Search, Edit2, Zap, BookOpen } from 'lucide-react';
import { suggestRecipeFromAlacena } from '../../services/deepseek';
import { useModal, LiquidDropdown } from '../common/UIComponents';

export default function AlacenaView({ mealsList = [], apiKey }) {
  const modal = useModal();
  const [alacenaItems, setAlacenaItems] = useLocalStorage('coachv2_alacena_items', []);
  const [shoppingItems, setShoppingItems] = useLocalStorage('coachv2_shopping_items', []);

  const [newInput, setNewInput] = useState('');
  const [newQuantity, setNewQuantity] = useState('1 pz/pack');
  const [targetList, setTargetList] = useState('alacena'); // 'alacena' | 'shopping'

  const [selectedMealForRecipe, setSelectedMealForRecipe] = useState('desayuno');
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [suggestedRecipe, setSuggestedRecipe] = useState(null);

  // Categorías Rápida para seleccionar sin escribir uno por uno
  const quickDatabase = [
    {
      category: "🥩 Proteínas Magras (AOA)",
      items: [
        { name: "Huevos Enteros", defaultQty: "12 piezas", emoji: "🥚" },
        { name: "Claras en Cartón", defaultQty: "1 litro", emoji: "🥚" },
        { name: "Pechuga de Pollo", defaultQty: "1 kg", emoji: "🍗" },
        { name: "Carne de Res Magra", defaultQty: "500g", emoji: "🥩" },
        { name: "Atún en Agua", defaultQty: "4 latas", emoji: "🐟" },
        { name: "Filete de Pescado / Salmón", defaultQty: "500g", emoji: "🐟" },
        { name: "Proteína Whey Scoop", defaultQty: "1 bote (2 lbs)", emoji: "🥤" }
      ]
    },
    {
      category: "🍚 Carbohidratos & Cereales",
      items: [
        { name: "Pan Integral", defaultQty: "1 paquete", emoji: "🍞" },
        { name: "Tortillas de Maíz", defaultQty: "1 kilo", emoji: "🌽" },
        { name: "Avena en Hojuelas", defaultQty: "1 kg", emoji: "🥣" },
        { name: "Arroz Blanco / Integral", defaultQty: "1 kg", emoji: "🍚" },
        { name: "Papa / Camote", defaultQty: "1 kg", emoji: "🥔" },
        { name: "Pasta Integral / Quinoa", defaultQty: "500g", emoji: "🍝" }
      ]
    },
    {
      category: "🥦 Verduras & Frutas (Fibra / Carbs)",
      items: [
        { name: "Brócoli / Espinacas", defaultQty: "2 ramos", emoji: "🥦" },
        { name: "Pepino / Calabacita", defaultQty: "1 kg", emoji: "🥒" },
        { name: "Nopales Limpios", defaultQty: "1 kg", emoji: "🌵" },
        { name: "Lechuga y Jitomate", defaultQty: "2 piezas", emoji: "🥗" },
        { name: "Manzanas Verdes", defaultQty: "1 kg", emoji: "🍏" },
        { name: "Plátanos Maduros", defaultQty: "1 kg", emoji: "🍌" },
        { name: "Fresas / Berries", defaultQty: "1 domo", emoji: "🍓" }
      ]
    },
    {
      category: "🥛 Lácteos Descremados & Grasas",
      items: [
        { name: "Leche Descremada", defaultQty: "2 litros", emoji: "🥛" },
        { name: "Yogur Griego Light", defaultQty: "1 bote (900g)", emoji: "🥣" },
        { name: "Queso Panela Fresco", defaultQty: "400g", emoji: "🧀" },
        { name: "Aguacate Hass", defaultQty: "1 kg", emoji: "🥑" },
        { name: "Aceite de Oliva Extra Virgen", defaultQty: "1 botella", emoji: "🫒" },
        { name: "Almendras / Nueces", defaultQty: "250g", emoji: "🥜" }
      ]
    }
  ];

  // Emojis automáticos inteligentes para entradas personalizadas
  const getSmartEmoji = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('huevo') || lower.includes('clara')) return '🥚';
    if (lower.includes('pollo') || lower.includes('pechuga')) return '🍗';
    if (lower.includes('carne') || lower.includes('res') || lower.includes('steak')) return '🥩';
    if (lower.includes('pesc') || lower.includes('atun') || lower.includes('salmon')) return '🐟';
    if (lower.includes('pan') || lower.includes('tortilla') || lower.includes('tosta')) return '🍞';
    if (lower.includes('avena') || lower.includes('arroz') || lower.includes('quinoa')) return '🍚';
    if (lower.includes('aguac')) return '🥑';
    if (lower.includes('manzana') || lower.includes('plata') || lower.includes('frut') || lower.includes('fres')) return '🍏';
    if (lower.includes('leche') || lower.includes('yogur') || lower.includes('queso') || lower.includes('whey')) return '🥛';
    if (lower.includes('lechuga') || lower.includes('espinaca') || lower.includes('nopal') || lower.includes('broc') || lower.includes('pepino')) return '🥦';
    if (lower.includes('frijol') || lower.includes('lenteja')) return '🍲';
    return '📦';
  };

  // Agregar rápido desde el catálogo genérico a Alacena o Súper
  const handleQuickAdd = (itemObj, dest = 'alacena') => {
    const formatItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: itemObj.name,
      quantity: itemObj.defaultQty || '1 unidad',
      emoji: itemObj.emoji || getSmartEmoji(itemObj.name)
    };

    if (dest === 'alacena') {
      setAlacenaItems(prev => [formatItem, ...prev]);
      modal.showAlert({
        title: `📦 ${formatItem.emoji} ${formatItem.name} en Alacena`,
        message: `Agregado rápido con cantidad base: ${formatItem.quantity}. Puedes editar la cantidad cuando gustes.`,
        variant: "success"
      });
    } else {
      setShoppingItems(prev => [...prev, formatItem]);
      modal.showAlert({
        title: `🛒 ${formatItem.emoji} ${formatItem.name} en Lista de Compras`,
        message: `Anotado en tus compras con cantidad: ${formatItem.quantity}. Al comprar en el súper pulsa ✓ para pasarlo a tu alacena.`,
        variant: "success"
      });
    }
  };

  // Agregar manual desde el formulario
  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newInput.trim()) return;
    
    const cleanName = newInput.trim();
    const formatItem = {
      id: `item_${Date.now()}`,
      name: cleanName,
      quantity: newQuantity.trim() || '1 unidad',
      emoji: getSmartEmoji(cleanName)
    };
    
    if (targetList === 'alacena') {
      setAlacenaItems(prev => [formatItem, ...prev]);
    } else {
      setShoppingItems(prev => [...prev, formatItem]);
    }
    setNewInput('');
  };

  // Editar cantidad al vuelo (Prompt de LiquidModal o rápido)
  const handleEditQuantity = (item, isAlacena) => {
    const newQty = window.prompt(`✍️ Editar cantidad de "${item.emoji} ${item.name}":`, item.quantity || "1 kg/pz");
    if (newQty && newQty.trim() !== '') {
      if (isAlacena) {
        setAlacenaItems(prev => prev.map(x => x.id === item.id ? { ...x, quantity: newQty.trim() } : x));
      } else {
        setShoppingItems(prev => prev.map(x => x.id === item.id ? { ...x, quantity: newQty.trim() } : x));
      }
    }
  };

  const handleRemoveAlacena = (id) => {
    setAlacenaItems(prev => prev.filter(x => x.id !== id));
  };

  const handleRemoveShopping = (id) => {
    setShoppingItems(prev => prev.filter(x => x.id !== id));
  };

  // Pasar de lista de compras a alacena instantáneamente
  const handleTransferToAlacena = (item) => {
    if (item) {
      setAlacenaItems(prev => [item, ...prev]);
      handleRemoveShopping(item.id);
      modal.showAlert({
        title: "🛒 Artículo Comprado y Transferido",
        message: `"${item.emoji} ${item.name} (${item.quantity})" ha sido transferido a tu Alacena e integrado al cálculo de recetas del día.`,
        variant: "success"
      });
    }
  };

  // 1. Búsqueda de Receta en Google AI Search (Sin Clave ni complicaciones)
  const handleGoogleSearchRecipe = () => {
    const mealObj = mealsList.find(m => m.id === selectedMealForRecipe) || mealsList[0] || { title: 'Comida', equivalents: [] };
    const itemsText = alacenaItems.length > 0 ? alacenaItems.map(i => i.name).join(' ') : 'pollo avena pan integral huevos';
    
    const query = `Receta rapida practica fitness con ${itemsText} para atleta en deficit calorica para comida ${mealObj.title.split(' ')[1] || 'deportiva'}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 2. Sugerencia de Receta con DeepSeek AI (Práctica, Rápida y Casera)
  const handleGenerateRecipeAI = async () => {
    if (!apiKey) {
      modal.showAlert({
        title: "🔑 Clave de API de DeepSeek Requerida",
        message: "Para usar el Asistente AI de DeepSeek, introduce tu API Key en la barra de configuración superior de Nutrición. ¿Prefieres sin clave? ¡Pulsa el botón azul 'Buscar en Google AI Search' que no requiere configuración!",
        variant: "warning"
      });
      return;
    }

    if (alacenaItems.length === 0 && shoppingItems.length === 0) {
      modal.showConfirm({
        title: "⭕️ Alacena actualmente en Blanco",
        message: "Aún no has seleccionado o anotado ingredientes de la Base de Datos Rápida. ¿Deseas que la IA de DeepSeek sugiera una receta base práctica y te cree tu lista de compras inicial automáticamente?",
        confirmText: "✨ Sí, Generar Receta y Lista",
        cancelText: "Elegiré mis ingredientes primero",
        variant: "info",
        onConfirm: () => triggerDeepSeekCall()
      });
    } else {
      triggerDeepSeekCall();
    }
  };

  const triggerDeepSeekCall = async () => {
    const mealObj = mealsList.find(m => m.id === selectedMealForRecipe) || mealsList[0] || { title: 'Comida', equivalents: [] };
    
    setIsLoadingRecipe(true);
    setSuggestedRecipe(null);

    try {
      const recipeResult = await suggestRecipeFromAlacena({
        apiKey,
        mealTitle: mealObj.title,
        assignedEquivalents: mealObj.equivalents,
        alacenaItems,
        shoppingItems
      });

      setSuggestedRecipe(recipeResult);
      modal.showAlert({
        title: `🍳 Receta Lista: "${recipeResult.nombreReceta}"`,
        message: `¡Tu platillo práctico ha sido generado con los ingredientes exactos de tu casa! Revisa la presentación al final de la tarjeta.`,
        variant: "success"
      });
    } catch (err) {
      modal.showAlert({
        title: "❌ Error al Consultar Receta AI",
        message: err.message || "No pudimos conectar con DeepSeek. Verificando red o clave API.",
        variant: "danger"
      });
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  // Añadir ingredientes faltantes a compras de golpe
  const handleAddMissingToShopping = (missingList) => {
    if (!missingList || missingList.length === 0) return;
    let addedCount = 0;
    const currentNew = [...shoppingItems];

    missingList.forEach(itemText => {
      const cleaned = typeof itemText === 'string' ? itemText.trim() : itemText.name;
      const alreadyInShop = currentNew.some(x => x.name.toLowerCase().includes(cleaned.toLowerCase()));
      const alreadyInAla = alacenaItems.some(x => x.name.toLowerCase().includes(cleaned.toLowerCase()));

      if (!alreadyInShop && !alreadyInAla) {
        currentNew.push({
          id: `missing_${Date.now()}_${addedCount}`,
          name: cleaned,
          quantity: "Cantidad necesaria",
          emoji: getSmartEmoji(cleaned)
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setShoppingItems(currentNew);
      modal.showAlert({
        title: `📝 +${addedCount} Productos Faltantes Anotados`,
        message: "Los ingredientes faltantes recomendados se agregaron en tu Lista de Compras listos para ir al supermercado.",
        variant: "success"
      });
    } else {
      modal.showAlert({
        title: "📦 Todo Listo",
        message: "¡Ya tienes todo lo necesario cubierto en tu Alacena o en tu Lista de Compras!",
        variant: "info"
      });
    }
  };

  const mealDropdownOptions = mealsList.map(m => ({ value: m.id, label: `${m.title.split(' ')[0]} • ${m.title}` }));

  return (
    <div className="animate-fade">
      
      {/* 1. CATÁLOGO RÁPIDO Y BASE DE DATOS GENÉRICA DE COMPRAS/ALACENA */}
      <div className="card" style={{ padding: '18px', marginBottom: '18px', borderTop: '4px solid #7c3aed', background: '#f5f3ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <Zap size={22} color="#7c3aed" />
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#4c1d95' }}>
              Base de Datos Rápida (Selección sin Teclear)
            </h3>
            <span style={{ fontSize: '11px', color: '#6d28d9', fontWeight: '700' }}>
              Toca un ingrediente genérico para enviarlo a tu Alacena o a tu Lista de Compras
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {quickDatabase.map((cat, cIdx) => (
            <div key={cIdx} style={{ background: '#ffffff', border: '1px solid #ddd6fe', borderRadius: '16px', padding: '12px' }}>
              <strong style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px', textTransform: 'uppercase' }}>
                {cat.category}
              </strong>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cat.items.map((item, iIdx) => (
                  <div key={iIdx} style={{ display: 'inline-flex', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden' }}>
                    <span style={{ padding: '6px 10px', fontSize: '12px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {item.emoji} {item.name}
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>({item.defaultQty})</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(item, 'alacena')}
                      style={{ background: '#dcfce7', color: '#15803d', border: 'none', borderLeft: '1px solid #86efac', padding: '6px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                      title="Agregar directo a mi Alacena"
                    >
                      + Alacena
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(item, 'shopping')}
                      style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', borderLeft: '1px solid #7dd3fc', padding: '6px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                      title="Anotar para mi Lista de Compras del Súper"
                    >
                      + Súper
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MÓDULO ALACENA INTELIGENTE Y FRIGORÍFICO */}
      <div className="card" style={{ padding: '18px', marginBottom: '18px', borderTop: '4px solid #0066ff' }}>
        <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
              Mi Alacena & Despensa Actual
            </h3>
          </div>
          <span className="badge badge-blue">{alacenaItems.length} En Casa</span>
        </div>

        <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 14px 0', lineHeight: '1.5' }}>
          Estos son los ingredientes listos para tus menús y recetas. Pulsa la cantidad para modificar o editar en segundos:
        </p>

        {/* Chips de Alacena con cantidad editable al vuelo */}
        {alacenaItems.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #cbd5e1', color: '#64748b' }}>
            <Package size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
            <span style={{ fontSize: '14px', fontWeight: '800', display: 'block', color: '#1e293b' }}>Tu Alacena está limpia y lista</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Selecciona del catálogo arriba o anota tus alimentos y porciones al ir al súper.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {alacenaItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '16px',
                  padding: '8px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#1e40af',
                  boxShadow: '0 2px 6px rgba(0, 102, 255, 0.08)'
                }}
              >
                <span>{item.emoji} {item.name}</span>
                <button
                  type="button"
                  onClick={() => handleEditQuantity(item, true)}
                  style={{ background: '#ffffff', color: '#0369a1', border: '1px solid #93c5fd', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center' }}
                  title="Toca para editar cantidad"
                >
                  ✏️ {item.quantity}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveAlacena(item.id)}
                  style={{ background: '#ffffff', width: '22px', height: '22px', borderRadius: '11px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', padding: 0 }}
                  title="Eliminar si se te acabó"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Ingreso Manual si buscas algo raro fuera del catálogo */}
        <form onSubmit={handleManualAdd} style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: '#f8fafc', padding: '10px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <input
            type="text"
            placeholder="Ingrediente personalizado..."
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            style={{ flex: 2, padding: '10px 12px', fontSize: '13px', borderRadius: '12px', border: '1.5px solid #cbd5e1', minWidth: '150px', fontWeight: '700' }}
          />
          <input
            type="text"
            placeholder="Cantidad (1 kg/pz)..."
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            style={{ flex: 1, padding: '10px 10px', fontSize: '13px', borderRadius: '12px', border: '1.5px solid #cbd5e1', minWidth: '90px', textAlign: 'center', fontWeight: '700' }}
          />
          <select
            value={targetList}
            onChange={(e) => setTargetList(e.target.value)}
            style={{ padding: '10px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#fff', fontWeight: '800', fontSize: '12px' }}
          >
            <option value="alacena">➔ Alacena</option>
            <option value="shopping">➔ Lista Compras</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '10px 16px', borderRadius: '12px', background: '#0066ff', fontWeight: '800', fontSize: '13px' }}>
            + Anotar
          </button>
        </form>
      </div>

      {/* 3. SUGERENCIA DE RECETAS (PRÁCTICAS Y RÁPIDAS: DEEPSEEK AI o GOOGLE AI SEARCH) */}
      <div className="card" style={{ padding: '20px', marginBottom: '18px', background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChefHat size={26} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>Chef Práctico & Rápido</span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#ffffff', whiteSpace: 'normal' }}>
              🍳 Ideas de Recetas Fáciles con tu Alacena
            </h3>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 16px 0', lineHeight: '1.5' }}>
          Elige tu comida y genera una receta rápida (cero complicaciones gourmet), ya sea consultando a tu <strong>Inteligencia DeepSeek AI</strong> o con búsqueda directa en <strong>Google AI Search</strong>:
        </p>

        <div style={{ marginBottom: '16px' }}>
          <LiquidDropdown
            label="COMIDA O TURNO OBJETIVO PARA LA RECETA:"
            icon={Utensils}
            options={mealDropdownOptions}
            value={selectedMealForRecipe}
            onChange={(val) => setSelectedMealForRecipe(val)}
          />
        </div>

        <div className="grid-2" style={{ gap: '10px' }}>
          <button
            type="button"
            onClick={handleGenerateRecipeAI}
            disabled={isLoadingRecipe}
            style={{
              padding: '14px',
              background: isLoadingRecipe ? '#475569' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: isLoadingRecipe ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: isLoadingRecipe ? 'none' : '0 6px 20px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoadingRecipe ? (
              <>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                ✨ Pensando...
              </>
            ) : (
              <>
                <Sparkles size={18} /> ✨ Receta Práctica AI (DeepSeek)
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleGoogleSearchRecipe}
            style={{
              padding: '14px',
              background: '#0284c7',
              color: '#ffffff',
              border: '1px solid #38bdf8',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 6px 20px rgba(2, 132, 199, 0.3)'
            }}
            title="Abre Google con tu lista de alacena armada automáticamente"
          >
            <Search size={18} /> 🔍 Buscar en Google AI Search
          </button>
        </div>

        {/* TARJETA PRESENTACIÓN PREMIUM DE RESULTADOS DEEPSEEK AI */}
        {suggestedRecipe && (
          <div className="animate-fade" style={{ marginTop: '22px', background: '#ffffff', color: '#0f172a', borderRadius: '22px', padding: '20px', border: '2px solid #10b981', boxShadow: '0 12px 35px rgba(0,0,0,0.1)' }}>
            <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '8px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>🍳</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a', whiteSpace: 'normal', lineBreak: 'strict' }}>
                    {suggestedRecipe.nombreReceta || 'Platillo Adonis Práctico'}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Receta Rápida & Calibrada en Déficit</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">⏱️ {suggestedRecipe.tiempoPrep || '10 min'}</span>
                <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontWeight: '800' }}>⚡️ {suggestedRecipe.dificultad || 'Fácil'}</span>
                <span className="badge badge-green">💪 {suggestedRecipe.porcionesEquivalentes || 'Metas Cubiertas'}</span>
              </div>
            </div>

            {suggestedRecipe.tipNutricional && (
              <div style={{ background: '#f0f9ff', borderLeft: '4px solid #0066ff', padding: '12px 14px', borderRadius: '14px', marginBottom: '16px', fontSize: '13px', color: '#1e3a8a', fontWeight: '600', lineHeight: '1.5' }}>
                💡 <strong style={{ color: '#0066ff' }}>Por qué es ideal para el gym:</strong> {suggestedRecipe.tipNutricional}
              </div>
            )}

            {/* Ingredientes en Casa Utilizados */}
            <div style={{ marginBottom: '18px' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', fontWeight: '800', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>
                🥗 Ingredientes de tu Alacena que ocuparás:
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestedRecipe.ingredientesUtilizados?.map((ing, i) => (
                  <span key={i} style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #86efac', borderRadius: '12px', padding: '8px 12px', fontSize: '13px', fontWeight: '800' }}>
                    ✓ {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Ingredientes Faltantes si los hubiera */}
            {suggestedRecipe.ingredientesFaltantes && suggestedRecipe.ingredientesFaltantes.length > 0 && suggestedRecipe.ingredientesFaltantes[0] !== '' && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '18px', padding: '16px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} color="#dc2626" />
                  <strong style={{ fontSize: '14px', color: '#991b1b', fontWeight: '800' }}>Ingredientes por Comprar en el Súper:</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {suggestedRecipe.ingredientesFaltantes.map((miss, j) => (
                    <span key={j} style={{ background: '#ffffff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '12px', padding: '6px 12px', fontSize: '13px', fontWeight: '800' }}>
                      🛒 {miss}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddMissingToShopping(suggestedRecipe.ingredientesFaltantes)}
                  style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)' }}
                >
                  <ShoppingCart size={16} /> + Agregar Todos a Mi Lista de Compras
                </button>
              </div>
            )}

            {/* Paso a Paso Práctico */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '800', display: 'block', marginBottom: '10px', textTransform: 'uppercase' }}>
                📝 Paso a Paso Rápido:
              </strong>
              <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                {suggestedRecipe.instruccionesPasoAPaso?.map((paso, pIdx) => (
                  <li key={pIdx} style={{ fontWeight: '600' }}>
                    {paso.replace(/^\d+[\)\.]\s*/, '')}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* 4. LISTA DE COMPRAS (SUPERMERCADO INTELIGENTE) */}
      <div className="card" style={{ padding: '18px', borderTop: '4px solid #10b981', marginBottom: '20px' }}>
        <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
              Mi Lista de Compras (Súper)
            </h3>
          </div>
          <span className="badge badge-green">{shoppingItems.length} Por Comprar</span>
        </div>

        <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 14px 0', lineHeight: '1.5' }}>
          Los productos que selecciones del catálogo o que sugiera tu chef AI figurarán aquí. Al estar en la tienda y comprarlos, pulsa el botón verde para cargarlos a tu Alacena en tiempo real.
        </p>

        {/* Tarjetas Táctiles de Compras */}
        {shoppingItems.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #cbd5e1', color: '#64748b' }}>
            <ShoppingCart size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
            <span style={{ fontSize: '14px', fontWeight: '800', display: 'block', color: '#1e293b' }}>Sin pendientes de compra en este momento</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Añade tus abarrotes o insumos fitness con los botones "+ Súper" arriba.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {shoppingItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                    {item.emoji} {item.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEditQuantity(item, false)}
                    style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                    title="Editar cantidad"
                  >
                    ✏️ {item.quantity}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleTransferToAlacena(item)}
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #86efac',
                      padding: '8px 14px',
                      borderRadius: '14px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <CheckCircle2 size={16} color="#15803d" /> Comprado ➔ Alacena
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveShopping(item.id)}
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Quitar de la lista de compras"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
