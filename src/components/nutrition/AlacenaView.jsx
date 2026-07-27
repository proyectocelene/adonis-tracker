import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Sparkles, Plus, Trash2, CheckCircle2, Circle, ShoppingCart, Package, Utensils, ArrowRight, X, AlertTriangle, ChefHat, RefreshCw, BookmarkCheck, ChevronDown, Check, Flame, Search, Edit2, Zap, BookOpen, Share2, Copy, Mail, DollarSign, TrendingDown, Award, Store, AlertOctagon, Minus, Send } from 'lucide-react';
import { suggestRecipeFromAlacena, analyzeGroceryPricesWithAI } from '../../services/deepseek';
import { useModal, LiquidDropdown } from '../common/UIComponents';

export default function AlacenaView({ mealsList = [], apiKey }) {
  const modal = useModal();
  
  // Inventario en Alacena y Súper (con flag isLowStock y cantidades editables)
  const [alacenaItems, setAlacenaItems] = useLocalStorage('coachv2_alacena_items', []);
  const [shoppingItems, setShoppingItems] = useLocalStorage('coachv2_shopping_items', []);
  
  // Bitácora Inteligente de Precios y Tiendas en el Súper
  const [groceryPrices, setGroceryPrices] = useLocalStorage('coachv2_grocery_prices', [
    { id: 'p_1', store: 'Costco / Sam\'s', product: 'Pechuga de Pollo Limpia', cost: 135, unit: '1 kg', category: 'Proteína (AOA)', note: 'Mayor calidad por volumen para prep semanal.' },
    { id: 'p_2', store: 'Mercado de Abastos', product: 'Manzanas & Berries (Temporada)', cost: 35, unit: '1 kg', category: 'Frutas / Fibra', note: 'Fruta de temporada 40% más económica y jugosa.' },
    { id: 'p_3', store: 'Walmart / Supermercado', product: 'Leche Descremada Light', cost: 28, unit: '1 litro', category: 'Lácteos Descremados', note: 'Precio estándar de repisa.' }
  ]);

  // Subpestañas en Alacena: 'inventario' | 'super' | 'precios' | 'chef'
  const [subTab, setSubTab] = useState('inventario');

  // Estado para nuevo ítem en Alacena/Súper
  const [newInput, setNewInput] = useState('');
  const [newQuantity, setNewQuantity] = useState('1 pz/pack');
  const [targetList, setTargetList] = useState('alacena');

  // Estado para nueva compra/costo en Bitácora de Precios
  const [showAddPrice, setShowAddPrice] = useState(false);
  const [pStore, setPStore] = useState('Mercado / Tienda Local');
  const [pProduct, setPProduct] = useState('');
  const [pCost, setPCost] = useState('');
  const [pUnit, setPUnit] = useState('1 kg / litro');
  const [pCat, setPCat] = useState('Proteínas (AOA)');
  const [pNote, setPNote] = useState('');

  // Análisis AI de conveniencia en precios
  const [isAnalyzingPrices, setIsAnalyzingPrices] = useState(false);
  const [aiPriceResult, setAiPriceResult] = useState(null);

  // Recetas AI
  const [selectedMealForRecipe, setSelectedMealForRecipe] = useState('desayuno');
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [suggestedRecipe, setSuggestedRecipe] = useState(null);

  // Categorías Rápidas para seleccionar sin escribir uno por uno
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
        { name: "Fresas / Berries (Temporada)", defaultQty: "1 domo", emoji: "🍓" }
      ]
    },
    {
      category: "🥛 Lácteos Descremados & Grasas",
      items: [
        { name: "Leche Descremada Light", defaultQty: "2 litros", emoji: "🥛" },
        { name: "Yogur Griego Light", defaultQty: "1 bote (900g)", emoji: "🥣" },
        { name: "Queso Panela Fresco", defaultQty: "400g", emoji: "🧀" },
        { name: "Aguacate Hass", defaultQty: "1 kg", emoji: "🥑" },
        { name: "Aceite de Oliva Extra Virgen", defaultQty: "1 botella", emoji: "🫒" },
        { name: "Almendras / Nueces", defaultQty: "250g", emoji: "🥜" }
      ]
    }
  ];

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
    return '📦';
  };

  // Agregar rápido al inventario o súpes
  const handleQuickAdd = (itemObj, dest = 'alacena') => {
    const formatItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: itemObj.name,
      quantity: itemObj.defaultQty || '1 unidad',
      emoji: itemObj.emoji || getSmartEmoji(itemObj.name),
      isLowStock: false
    };

    if (dest === 'alacena') {
      setAlacenaItems(prev => [formatItem, ...prev]);
      modal.showAlert({
        title: `📦 ${formatItem.emoji} ${formatItem.name} en Alacena`,
        message: `Agregado al inventario de cocina (${formatItem.quantity}).`,
        variant: 'success'
      });
    } else {
      setShoppingItems(prev => [formatItem, ...prev]);
      modal.showAlert({
        title: `🛒 ${formatItem.emoji} ${formatItem.name} en Lista de Compras`,
        message: `Anotado en el carrito (${formatItem.quantity}).`,
        variant: 'info'
      });
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newInput.trim()) return;

    const newItem = {
      id: `item_${Date.now()}`,
      name: newInput.trim(),
      quantity: newQuantity.trim() || '1 pz/pack',
      emoji: getSmartEmoji(newInput.trim()),
      isLowStock: false
    };

    if (targetList === 'alacena') {
      setAlacenaItems(prev => [newItem, ...prev]);
    } else {
      setShoppingItems(prev => [newItem, ...prev]);
    }

    setNewInput('');
    setNewQuantity('1 pz/pack');
  };

  const removeItem = (id, fromList = 'alacena') => {
    if (fromList === 'alacena') {
      setAlacenaItems(prev => prev.filter(item => typeof item === 'string' ? item !== id : item.id !== id));
    } else {
      setShoppingItems(prev => prev.filter(item => typeof item === 'string' ? item !== id : item.id !== id));
    }
  };

  // ================= 1. AJUSTES RÁPIDOS DE INVENTARIO (+ / - & AGOTADO) =================
  const adjustItemQuantity = (itemObj, delta) => {
    setAlacenaItems(prev => prev.map(i => {
      if (typeof i === 'string' || i.id !== itemObj.id) return i;
      
      // Parsear número si está en la cadena (ej: "12 piezas" -> 12, "piezas")
      const str = i.quantity || '1 unidad';
      const match = str.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
      if (match) {
        let val = parseFloat(match[1]) + delta;
        val = Math.max(0, val);
        const unit = match[2] || 'unidad';
        const isNowLow = val <= 1;
        return { ...i, quantity: `${val} ${unit}`, isLowStock: isNowLow };
      } else {
        return i;
      }
    }));
  };

  const toggleLowStock = (id) => {
    setAlacenaItems(prev => prev.map(i => {
      if (typeof i === 'string' || i.id !== id) return i;
      return { ...i, isLowStock: !i.isLowStock };
    }));
  };

  // Alerta de Escasez Inteligente: detectar qué alimentos se están acabando
  const lowStockItems = alacenaItems.filter(item => {
    if (typeof item === 'string') return false;
    if (item.isLowStock) return true;
    const qtyLower = (item.quantity || '').toLowerCase();
    return qtyLower.includes('0 ') || qtyLower.startsWith('1 ') || qtyLower.includes('poco') || qtyLower.includes('acabar') || qtyLower.includes('250g') || qtyLower.includes('medio');
  });

  // Mover todo lo que se va a acabar a la Lista de Compras con 1 toque
  const handleMoveAllLowStockToShopping = () => {
    if (lowStockItems.length === 0) return;
    const newShopping = [...shoppingItems];
    let count = 0;

    lowStockItems.forEach(low => {
      const exists = newShopping.some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === (typeof low === 'string' ? low : low.name).toLowerCase());
      if (!exists) {
        newShopping.push({
          id: `shop_low_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: typeof low === 'string' ? low : low.name,
          quantity: `Surtir (${typeof low === 'string' ? '1 pz' : low.quantity})`,
          emoji: typeof low === 'string' ? '⚠️' : (low.emoji || '⚠️')
        });
        count++;
      }
    });

    setShoppingItems(newShopping);
    modal.showAlert({
      title: "🛒 Alimentos Agotados Transferidos al Súper",
      message: `Se añadieron ${count} producto(s) a tu Lista de Compras para que tu refrigerador y alacena jamás se queden sin combustible para tus rutinas.`,
      variant: "success"
    });
  };

  // Mover individual al súper
  const handleTransferToShopping = (itemObj) => {
    const item = typeof itemObj === 'string' ? { name: itemObj, quantity: '1 pz', emoji: '📦', id: `item_${Date.now()}` } : itemObj;
    setShoppingItems(prev => [{ ...item, id: `shop_${Date.now()}` }, ...prev]);
    removeItem(itemObj.id || itemObj, 'alacena');
    modal.showAlert({ title: "🛒 Moviendo a Lista del Súper", message: `"${item.name}" se movió al carrito.`, variant: "info" });
  };

  const handleTransferToAlacena = (itemObj) => {
    const item = typeof itemObj === 'string' ? { name: itemObj, quantity: '1 pz', emoji: '📦', id: `item_${Date.now()}` } : itemObj;
    setAlacenaItems(prev => [{ ...item, id: `item_${Date.now()}`, isLowStock: false }, ...prev]);
    removeItem(itemObj.id || itemObj, 'shopping');
    modal.showAlert({ title: "📦 Moviendo a Alacena", message: `"${item.name}" guardado como surtido en tu cocina.`, variant: "success" });
  };

  // ================= 2. ENVIAR Y COPIAR LISTA POR WHATSAPP / CORREO =================
  const getFormattedShoppingText = () => {
    if (shoppingItems.length === 0) return "Tu lista de compras de COACH V2 está actualmente vacía.";
    let text = `🛒 *LISTA DE COMPRAS SÚPER - ATLETA CARLOS DONATO*\n`;
    text += `_Protocolo Adonis & NutriConsult_\n\n`;
    shoppingItems.forEach(item => {
      const name = typeof item === 'string' ? item : item.name;
      const qty = typeof item === 'string' ? '1 pz' : item.quantity;
      const emoji = typeof item === 'string' ? '📦' : (item.emoji || '📦');
      text += `[ ] ${emoji} *${name}* (${qty})\n`;
    });
    text += `\n✨ _Enviado desde COACH V2 (App de Entrenamiento y Nutrición)_`;
    return text;
  };

  const handleSendWhatsApp = () => {
    const text = getFormattedShoppingText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    modal.showAlert({
      title: "📲 Abriendo WhatsApp",
      message: "Tu Lista de Compras con casillas y porciones está lista para compartirse por WhatsApp a tu mamá, familiares o a tu propio chat.",
      variant: "success"
    });
  };

  const handleCopyList = () => {
    const text = getFormattedShoppingText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      modal.showAlert({ title: "📋 Lista Copiada con Éxito", message: "Tu lista del súper está copiada al portapapeles en formato limpio. Puedes pegarla en mensajes o notas.", variant: "success" });
    }
  };

  const handleSendEmail = () => {
    const text = getFormattedShoppingText();
    const url = `mailto:?subject=${encodeURIComponent("🛒 Lista de Compras del Súper - NutriConsult")}&body=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ================= 3. BITÁCORA INTELIGENTE DE TIENDAS & PRECIOS =================
  const handleSavePriceEntry = (e) => {
    e.preventDefault();
    if (!pProduct.trim() || !pCost) return;

    const newPrice = {
      id: `price_${Date.now()}`,
      store: pStore || 'Tienda / Mercado',
      product: pProduct.trim(),
      cost: parseFloat(pCost),
      unit: pUnit || '1 kg',
      category: pCat,
      note: pNote.trim()
    };

    setGroceryPrices(prev => [newPrice, ...prev]);
    setShowAddPrice(false);
    setPProduct(''); setPCost(''); setPNote('');

    modal.showAlert({
      title: "💰 Costo Anotado en Bitácora",
      message: `Registrado: "${newPrice.product}" a $${newPrice.cost} (${newPrice.store}).\n\nTu base de datos acumula precios para detectar dónde te conviene comprar.`,
      variant: "success"
    });
  };

  const handleDeletePrice = (id) => {
    setGroceryPrices(prev => prev.filter(p => p.id !== id));
  };

  const handleAnalyzePricesAI = async () => {
    if (!apiKey) {
      modal.showAlert({ title: "🔑 Clave API Requerida", message: "Para que DeepSeek AI analice y costee tus compras en lenguaje natural y te diga dónde ahorrar y qué frutas de temporada comprar, introduce tu Clave API en la configuración superior.", variant: "warning" });
      return;
    }
    if (groceryPrices.length === 0) {
      modal.showAlert({ title: "📊 Sin Precios Anotados", message: "Agrega primero algunos costos en tu bitácora de supermercado.", variant: "info" });
      return;
    }

    setIsAnalyzingPrices(true);
    try {
      const res = await analyzeGroceryPricesWithAI({ apiKey, groceryHistory: groceryPrices, alacenaItems });
      setAiPriceResult(res);
      modal.showAlert({ title: "🧠 Evaluación de Precios y Súper AI Lista", message: "DeepSeek ha evaluado la conveniencia de tus tiendas, volumen y alimentos de temporada.", variant: "success" });
    } catch (err) {
      modal.showAlert({ title: "❌ Error al consultar AI", message: err.message || "Revisa tu clave u conexión.", variant: "danger" });
    } finally {
      setIsAnalyzingPrices(false);
    }
  };

  // ================= 4. CHEF AI & GOOGLE RECETAS =================
  const handleGenerateRecipeAI = async () => {
    if (!apiKey) {
      modal.showAlert({ title: "🔑 Clave API Requerida para Chef AI", message: "Introduce tu Clave en la cabecera del Coach o usa el botón de Google AI Search para ideas prácticas instantáneas.", variant: "warning" });
      return;
    }
    setIsLoadingRecipe(true);
    try {
      const mealObj = mealsList.find(m => m.id === selectedMealForRecipe) || mealsList[0] || {};
      const res = await suggestRecipeFromAlacena({
        apiKey,
        mealTitle: mealObj.title || selectedMealForRecipe,
        assignedEquivalents: mealObj.equivalents || [],
        alacenaItems,
        shoppingItems
      });
      setSuggestedRecipe(res);
    } catch (error) {
      modal.showAlert({ title: "❌ Error del Chef AI", message: error.message || "Error al conectar.", variant: "danger" });
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleGoogleAISearchRecipes = () => {
    const mealObj = mealsList.find(m => m.id === selectedMealForRecipe) || { title: 'Desayuno o Comida' };
    const itemsStr = alacenaItems.slice(0, 6).map(i => typeof i === 'string' ? i : i.name).join(', ');
    const query = `Receta fitness muy facil rapida para ${mealObj.title} usando ${itemsStr || 'pollo huevo avena'} sin ingredientes gourmet complicados`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  const handleEditQuantity = (itemObj, listType = 'alacena') => {
    const currentQty = typeof itemObj === 'string' ? '1 unidad' : itemObj.quantity;
    modal.showPrompt({
      title: `✏️ Modificar Cantidad / Peso:`,
      message: `Introduce el inventario exacto en tu cocina o súper para "${typeof itemObj === 'string' ? itemObj : itemObj.name}" (ej: "500g", "6 piezas", "2 botellas"):`,
      defaultValue: currentQty,
      confirmText: "💾 Guardar Cantidad",
      onConfirm: (newQty) => {
        if (!newQty || !newQty.trim()) return;
        if (listType === 'alacena') {
          setAlacenaItems(prev => prev.map(item => {
            if (typeof item === 'string' && item === itemObj) return { id: `item_${Date.now()}`, name: item, quantity: newQty.trim(), emoji: getSmartEmoji(item) };
            if (item.id === itemObj.id) return { ...item, quantity: newQty.trim() };
            return item;
          }));
        } else {
          setShoppingItems(prev => prev.map(item => {
            if (typeof item === 'string' && item === itemObj) return { id: `shop_${Date.now()}`, name: item, quantity: newQty.trim(), emoji: getSmartEmoji(item) };
            if (item.id === itemObj.id) return { ...item, quantity: newQty.trim() };
            return item;
          }));
        }
      }
    });
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* 🚨 ALERTA DE ESCASEZ Y ALIMENTOS POR ACABARSE EN ALACENA */}
      {lowStockItems.length > 0 && (
        <div className="card animate-fade" style={{ padding: '16px', margin: 0, background: 'linear-gradient(135deg, #fffbeb 0%, #fef2f2 100%)', border: '2px solid #ef4444', borderRadius: '22px', boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)' }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }}>
              <AlertTriangle size={28} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '15px', color: '#991b1b', fontWeight: '900', display: 'block' }}>
                  🚨 Alertas de Inventario: {lowStockItems.length} alimento(s) por agotarse
                </strong>
                <span style={{ fontSize: '12px', color: '#7f1d1d', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                  Se va a acabar o te queda poco de: <strong>{lowStockItems.slice(0, 4).map(i => typeof i === 'string' ? i : i.name).join(', ')}</strong>. ¡Que tu refrigerador no frene tu síntesis muscular!
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMoveAllLowStockToShopping}
              className="btn btn-primary"
              style={{ background: '#dc2626', padding: '10px 16px', fontSize: '13px', fontWeight: '800', borderRadius: '14px', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              <ShoppingCart size={16} /> 🛒 + Mover Todos al Súper
            </button>
          </div>
        </div>
      )}

      {/* SUB-PESTAÑAS DE LA ALACENA INTELIGENTE */}
      <div style={{ display: 'flex', background: '#f1f5f9', padding: '5px', borderRadius: '18px', gap: '6px', flexWrap: 'wrap', border: '1px solid #cbd5e1' }}>
        <button
          type="button"
          onClick={() => setSubTab('inventario')}
          style={{ flex: '1 1 120px', padding: '10px 8px', borderRadius: '14px', border: 'none', background: subTab === 'inventario' ? '#0066ff' : 'transparent', color: subTab === 'inventario' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Package size={16} /> 📦 Alacena ({alacenaItems.length})
        </button>

        <button
          type="button"
          onClick={() => setSubTab('super')}
          style={{ flex: '1 1 120px', padding: '10px 8px', borderRadius: '14px', border: 'none', background: subTab === 'super' ? '#10b981' : 'transparent', color: subTab === 'super' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <ShoppingCart size={16} /> 🛒 Lista Súper ({shoppingItems.length})
        </button>

        <button
          type="button"
          onClick={() => setSubTab('precios')}
          style={{ flex: '1 1 120px', padding: '10px 8px', borderRadius: '14px', border: 'none', background: subTab === 'precios' ? '#d97706' : 'transparent', color: subTab === 'precios' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <DollarSign size={16} /> 💵 Costos & Tiendas
        </button>

        <button
          type="button"
          onClick={() => setSubTab('chef')}
          style={{ flex: '1 1 120px', padding: '10px 8px', borderRadius: '14px', border: 'none', background: subTab === 'chef' ? '#7c3aed' : 'transparent', color: subTab === 'chef' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <ChefHat size={16} /> 🍳 Chef AI & Recetas
        </button>
      </div>

      {/* SUB-VISTA 1 & 2: INVENTARIO DE ALACENA / LISTA SÚPER & CATÁLOGO RÁPIDO */}
      {(subTab === 'inventario' || subTab === 'super') && (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* BARRA DE BOTONES PARA COMPARTIR POR WHATSAPP / CORREO (EN LISTA DEL SÚPER) */}
          {subTab === 'super' && (
            <div className="card" style={{ padding: '14px 16px', margin: 0, background: 'linear-gradient(135deg, #ecfdf5 0%, #dcfce7 100%)', border: '1.5px solid #10b981', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#065f46', fontWeight: '900', display: 'block' }}>
                  📲 Compartir Lista de Compras al Instante
                </strong>
                <span style={{ fontSize: '11px', color: '#047857', fontWeight: '700' }}>
                  Copia y envía tu lista ordenada por WhatsApp o correo con casillas verificables.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  style={{ padding: '10px 14px', background: '#25d366', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)' }}
                >
                  <Send size={15} /> Enviar por WhatsApp
                </button>
                
                <button
                  type="button"
                  onClick={handleCopyList}
                  style={{ padding: '10px 14px', background: '#ffffff', color: '#065f46', border: '1.5px solid #10b981', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Copy size={15} /> Copiar Texto
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  style={{ padding: '10px 12px', background: '#e0f2fe', color: '#0369a1', border: '1.5px solid #38bdf8', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Enviar por Correo"
                >
                  <Mail size={15} />
                </button>
              </div>
            </div>
          )}

          {/* TARJETA: CATÁLOGO DE INGREDIENTES RAPIDOS (SIN TECLEAR UNO POR UNO) */}
          <div className="card" style={{ padding: '18px', background: '#ffffff', borderTop: subTab === 'inventario' ? '4px solid #0066ff' : '4px solid #10b981', margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} color={subTab === 'inventario' ? '#0066ff' : '#10b981'} />
              <strong style={{ fontSize: '16px', color: '#0f172a', fontWeight: '900' }}>
                ⚡️ Catálogo Rápido: Selecciona y agrega en 1 Tap sin teclear
              </strong>
            </div>
            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 14px 0', lineHeight: '1.4', fontWeight: '600' }}>
              Base de datos precargada con los alimentos del atleta. Elige tu destino:
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setTargetList('alacena')}
                style={{ flex: 1, padding: '10px', borderRadius: '14px', border: targetList === 'alacena' ? '2px solid #0066ff' : '1px solid #cbd5e1', background: targetList === 'alacena' ? '#eff6ff' : '#f8fafc', color: targetList === 'alacena' ? '#0066ff' : '#64748b', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
              >
                📦 Añadir a Alacena (Cocina)
              </button>
              <button
                type="button"
                onClick={() => setTargetList('shopping')}
                style={{ flex: 1, padding: '10px', borderRadius: '14px', border: targetList === 'shopping' ? '2px solid #10b981' : '1px solid #cbd5e1', background: targetList === 'shopping' ? '#ecfdf5' : '#f8fafc', color: targetList === 'shopping' ? '#047857' : '#64748b', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
              >
                🛒 Añadir a Lista del Súper
              </button>
            </div>

            {/* Chips por categoría del catálogo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickDatabase.map((cat, catIdx) => (
                <div key={catIdx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#1e293b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {cat.category}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {cat.items.map((itemObj, idx) => (
                      <div
                        key={idx}
                        style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#334155' }}
                      >
                        <span>{itemObj.emoji} <strong>{itemObj.name}</strong> ({itemObj.defaultQty})</span>
                        <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(itemObj, 'alacena')}
                            style={{ background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '4px 8px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}
                            title="Añadir a Alacena"
                          >
                            + Alacena
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(itemObj, 'shopping')}
                            style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #86efac', borderRadius: '10px', padding: '4px 8px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}
                            title="Añadir a Lista de Compras"
                          >
                            + Súper
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario para agregar alimento personalizado que no esté en la lista */}
            <form onSubmit={handleAddItem} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="¿No está en la lista? Escribir aquí..."
                value={newInput}
                onChange={e => setNewInput(e.target.value)}
                style={{ flex: 2, padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px', minWidth: '180px' }}
              />
              <input
                type="text"
                placeholder="Cantidad (ej. 2 kg / botes)"
                value={newQuantity}
                onChange={e => setNewQuantity(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontWeight: '700', fontSize: '13px', minWidth: '140px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '10px 18px', background: targetList === 'alacena' ? '#0066ff' : '#10b981', fontWeight: '800', fontSize: '13px', borderRadius: '12px' }}>
                + Agregar
              </button>
            </form>
          </div>

          {/* TABLA O GRID CON LOS ÍTEMS GUARDADOS E INVENTARIO RÁPIDO (+ / -) */}
          <div className="card" style={{ padding: '18px', background: '#ffffff', margin: 0 }}>
            <div className="flex-between" style={{ marginBottom: '14px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {subTab === 'inventario' ? <Package size={22} color="#0066ff" /> : <ShoppingCart size={22} color="#10b981" />}
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                  {subTab === 'inventario' ? `Mi Inventario en Cocina (${alacenaItems.length})` : `Mi Carrito y Lista del Súper (${shoppingItems.length})`}
                </h3>
              </div>
              <span className="badge" style={{ background: '#f8fafc', color: '#64748b', fontWeight: '800', fontSize: '11px' }}>
                Toca [+/-] para ajustar inventario o ✏️ para editar peso
              </span>
            </div>

            {(subTab === 'inventario' ? alacenaItems : shoppingItems).length === 0 ? (
              <div style={{ padding: '30px 16px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>{subTab === 'inventario' ? '📭' : '🛒'}</span>
                <strong style={{ fontSize: '15px', color: '#334155', display: 'block', fontWeight: '800' }}>
                  {subTab === 'inventario' ? 'Tu Alacena está vacía hoy' : 'Tu Lista de Compras está limpia'}
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Utiliza los botones rápidos del catálogo arriba para llenarla en segundos.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(subTab === 'inventario' ? alacenaItems : shoppingItems).map(itemObj => {
                  const id = typeof itemObj === 'string' ? itemObj : itemObj.id;
                  const name = typeof itemObj === 'string' ? itemObj : itemObj.name;
                  const qty = typeof itemObj === 'string' ? '1 pz/pack' : itemObj.quantity;
                  const emoji = typeof itemObj === 'string' ? '📦' : (itemObj.emoji || '📦');
                  const isLow = typeof itemObj === 'string' ? false : !!itemObj.isLowStock;

                  return (
                    <div
                      key={id}
                      style={{
                        background: isLow ? '#fef2f2' : '#f8fafc',
                        border: isLow ? '1.5px solid #fca5a5' : '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '180px' }}>
                        <span style={{ fontSize: '24px' }}>{emoji}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '15px', color: isLow ? '#991b1b' : '#0f172a', fontWeight: '800' }}>{name}</strong>
                            {isLow && <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', fontSize: '10px', fontWeight: '900' }}>⚠️ Queda poco / Por acabar</span>}
                          </div>
                          
                          {/* Pastilla con cantidad editable y botones rápidos +/- */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => handleEditQuantity(itemObj, subTab === 'inventario' ? 'alacena' : 'shopping')}
                              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '3px 8px', fontSize: '12px', fontWeight: '800', color: '#0066ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Modificar peso / cantidad"
                            >
                              ✏️ {qty}
                            </button>

                            {subTab === 'inventario' && typeof itemObj !== 'string' && (
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => adjustItemQuantity(itemObj, -1)}
                                  style={{ width: '24px', height: '24px', borderRadius: '8px', background: '#e2e8f0', color: '#0f172a', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}
                                  title="Restar 1 al inventario"
                                >
                                  <Minus size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adjustItemQuantity(itemObj, 1)}
                                  style={{ width: '24px', height: '24px', borderRadius: '8px', background: '#e2e8f0', color: '#0f172a', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}
                                  title="Sumar 1 al inventario"
                                >
                                  <Plus size={13} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleLowStock(id)}
                                  style={{ padding: '3px 8px', borderRadius: '10px', background: isLow ? '#fef3c7' : '#ffffff', border: isLow ? '1px solid #d97706' : '1px solid #cbd5e1', color: isLow ? '#92400e' : '#64748b', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                                  title="Alternar alerta de que queda poco alimento"
                                >
                                  ⚠️ {isLow ? 'Agotándose' : 'Marcar escaso'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                        {subTab === 'inventario' ? (
                          <button
                            type="button"
                            onClick={() => handleTransferToShopping(itemObj)}
                            style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #86efac', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <ShoppingCart size={15} /> Al Súper
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTransferToAlacena(itemObj)}
                            style={{ background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Package size={15} /> Surtido (A Alacena)
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeItem(id, subTab === 'inventario' ? 'alacena' : 'shopping')}
                          style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Eliminar de la lista"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VISTA 3: COSTOS, TIENDAS & CONVENIENCIA EN PRECIOS (ANÁLISIS ESTADÍSTICO) */}
      {subTab === 'precios' && (
        <div className="card animate-fade" style={{ padding: '20px', background: '#ffffff', borderTop: '5px solid #d97706', margin: 0 }}>
          <div className="flex-between" style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Store size={24} color="#d97706" />
              <div>
                <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>
                  Bitácora Inteligente de Súper & Precios
                </h2>
                <span style={{ fontSize: '12px', color: '#d97706', fontWeight: '700' }}>Audita dónde te conviene más surtir tu proteína y frutas de temporada</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowAddPrice(!showAddPrice)}
                className="btn btn-primary"
                style={{ background: '#d97706', padding: '10px 14px', fontSize: '12px', borderRadius: '14px', fontWeight: '800', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}
              >
                {showAddPrice ? <X size={16} /> : <Plus size={16} />}
                {showAddPrice ? 'Cerrar Panel' : '+ Registrar Costo / Compra'}
              </button>
            </div>
          </div>

          {/* Formulario para agregar compra y costo */}
          {showAddPrice && (
            <div className="animate-fade" style={{ background: '#fef3c7', padding: '16px', borderRadius: '18px', border: '1px solid #fde047', marginBottom: '20px' }}>
              <strong style={{ fontSize: '14px', color: '#78350f', fontWeight: '800', display: 'block', marginBottom: '10px' }}>
                🛒 Registrar Precio de Alimento & Tienda:
              </strong>
              <form onSubmit={handleSavePriceEntry} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="grid-3" style={{ gap: '10px' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px', fontWeight: '800', color: '#92400e' }}>Tienda / Súper:</label>
                    <select value={pStore} onChange={e => setPStore(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontWeight: '800', fontSize: '13px' }}>
                      <option value="Costco / Sam's Club">Costco / Sam's Club (Volumen)</option>
                      <option value="Walmart / Soriana / HEB">Walmart / Soriana / HEB</option>
                      <option value="Mercado de Abastos / Local">Mercado de Abastos / Local (Temporada)</option>
                      <option value="Carnicería / Pescadería Especial">Carnicería / Pescadería Especializada</option>
                      <option value="Tienda de Suplementos / Online">Tienda de Suplementos / Online</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label" style={{ fontSize: '11px', fontWeight: '800', color: '#92400e' }}>Producto (*):</label>
                    <input type="text" placeholder="ej. Pechuga de Pollo / Manzana Verde" required value={pProduct} onChange={e => setPProduct(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontWeight: '700', fontSize: '13px' }} />
                  </div>

                  <div>
                    <label className="input-label" style={{ fontSize: '11px', fontWeight: '800', color: '#92400e' }}>Costo Pagado ($ MXN/USD):</label>
                    <input type="number" step="0.5" placeholder="ej. 135" required value={pCost} onChange={e => setPCost(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontWeight: '800', fontSize: '14px', textAlign: 'center' }} />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '10px', alignItems: 'center' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px', fontWeight: '800', color: '#92400e' }}>Cantidad / Unidad y Grupo:</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input type="text" placeholder="ej. 1 kg / 2 litros" value={pUnit} onChange={e => setPUnit(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontWeight: '700', fontSize: '13px' }} />
                      <select value={pCat} onChange={e => setPCat(e.target.value)} style={{ flex: 1.2, padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontWeight: '800', fontSize: '12px' }}>
                        <option value="Proteína (AOA)">Proteína (AOA)</option>
                        <option value="Frutas / Temporada">Frutas / Temporada</option>
                        <option value="Carbs / Cereales">Carbs / Cereales</option>
                        <option value="Lácteos / Grasas">Lácteos / Grasas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="input-label" style={{ fontSize: '11px', fontWeight: '800', color: '#92400e' }}>Notas de conveniencia o calidad:</label>
                    <input type="text" placeholder="ej. Muy jugosa, rinde más, fruta de temporada..." value={pNote} onChange={e => setPNote(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #d97706', fontWeight: '600', fontSize: '12px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button type="button" onClick={() => setShowAddPrice(false)} className="btn btn-outline" style={{ width: 'auto' }}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#d97706', width: 'auto' }}>💾 Guardar Precio en Bitácora</button>
                </div>
              </form>
            </div>
          )}

          {/* Tarjetas de Estadísticas de Conveniencia */}
          <div className="grid-3" style={{ gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '16px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: '800', textTransform: 'uppercase' }}>Mejor Ahorro Volumen</span>
              <strong style={{ fontSize: '16px', color: '#0066ff', display: 'block', margin: '4px 0', fontWeight: '900' }}>Costco / Sam's Club</strong>
              <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700' }}>Ideal para Pollo y Huevos en pack</span>
            </div>

            <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '16px', border: '1px solid #86efac', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#065f46', fontWeight: '800', textTransform: 'uppercase' }}>Frutas de Temporada</span>
              <strong style={{ fontSize: '16px', color: '#10b981', display: 'block', margin: '4px 0', fontWeight: '900' }}>Mercados Locales (-40%)</strong>
              <span style={{ fontSize: '11px', color: '#047857', fontWeight: '700' }}>Manzanas, Berries & Nopales frescos</span>
            </div>

            <div style={{ background: '#f5f3ff', padding: '14px', borderRadius: '16px', border: '1px solid #ddd6fe', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', color: '#5b21b6', fontWeight: '800', textTransform: 'uppercase' }}>Asistente Inteligente</span>
              <button
                type="button"
                onClick={handleAnalyzePricesAI}
                disabled={isAnalyzingPrices}
                style={{ marginTop: '6px', padding: '8px', borderRadius: '12px', background: '#7c3aed', color: '#ffffff', border: 'none', fontWeight: '800', fontSize: '12px', cursor: isAnalyzingPrices ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {isAnalyzingPrices ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={14} />}
                🧠 Evaluar Ahorros con AI
              </button>
            </div>
          </div>

          {/* Resultado del análisis AI sobre precios */}
          {aiPriceResult && (
            <div className="animate-fade" style={{ background: '#f8fafc', border: '2px solid #7c3aed', borderRadius: '18px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', borderBottom: '1px dashed #ddd6fe', paddingBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>🤖</span>
                <strong style={{ fontSize: '15px', color: '#6d28d9', fontWeight: '900' }}>Análisis Inteligente de Conveniencia y Presupuesto:</strong>
              </div>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', margin: '0 0 12px 0', fontWeight: '600' }}>
                {aiPriceResult.analisisGeneral}
              </p>

              {aiPriceResult.mejoresTiendas?.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '12px', color: '#1e40af', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>🏆 Dónde te conviene más comprar por tienda:</strong>
                  {aiPriceResult.mejoresTiendas.map((t, idx) => (
                    <div key={idx} style={{ background: '#eff6ff', padding: '10px 12px', borderRadius: '12px', marginBottom: '6px', border: '1px solid #bfdbfe', fontSize: '12px', fontWeight: '700', color: '#1e3a8a' }}>
                      • <strong>{t.tienda}</strong>: {t.ventaja} <span style={{ color: '#047857', fontWeight: '900', background: '#dcfce7', padding: '2px 6px', borderRadius: '8px' }}>Ahorro: {t.ahorroEstimado}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiPriceResult.recomendacionesDeTemporada?.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '12px', color: '#047857', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>🍎 Frutas y Vegetales de Temporada Recomendados:</strong>
                  {aiPriceResult.recomendacionesDeTemporada.map((r, idx) => (
                    <div key={idx} style={{ background: '#ecfdf5', padding: '10px 12px', borderRadius: '12px', marginBottom: '6px', border: '1px solid #86efac', fontSize: '12px', fontWeight: '700', color: '#065f46' }}>
                      • <strong>{r.alimento}</strong>: {r.consejo}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ background: '#7c3aed', color: '#ffffff', padding: '12px', borderRadius: '14px', fontSize: '13px', fontWeight: '800' }}>
                💡 <strong>Veredicto AI:</strong> {aiPriceResult.veredictoFinal}
              </div>
            </div>
          )}

          {/* Tabla de Historial de Precios */}
          <strong style={{ fontSize: '14px', color: '#1e293b', fontWeight: '800', display: 'block', marginBottom: '10px' }}>
            📋 Registros Recientes en Bitácora de Súper ({groceryPrices.length}):
          </strong>
          
          {groceryPrices.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '14px', border: '2px dashed #cbd5e1' }}>
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>💵</span>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>Aún no hay precios registrados. Añade tus tickets de compra para comparar en qué tienda ahorras más.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {groceryPrices.map(item => (
                <div key={item.id} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '15px', color: '#0f172a', fontWeight: '800' }}>{item.product}</strong>
                      <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9', fontSize: '11px', fontWeight: '800' }}>{item.store}</span>
                      <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '700' }}>{item.category || 'Alimento'}</span>
                    </div>
                    {item.note && <span style={{ display: 'block', fontSize: '12px', color: '#475569', marginTop: '4px', fontWeight: '600' }}>💡 {item.note}</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '18px', color: '#047857', fontWeight: '900', display: 'block' }}>${item.cost} MXN</strong>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>por {item.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePrice(item.id)}
                      style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
                      title="Eliminar registro de precio"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VISTA 4: CHEF AI & RECETAS PRÁCTICAS SIN GOURMET COMPLICADO */}
      {subTab === 'chef' && (
        <div className="card animate-fade" style={{ padding: '20px', background: '#ffffff', borderTop: '5px solid #7c3aed', margin: 0 }}>
          <div className="flex-between" style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChefHat size={26} color="#7c3aed" />
              <div>
                <strong style={{ fontSize: '18px', color: '#0f172a', fontWeight: '900', display: 'block' }}>
                  Chef Fitness Casero & Práctico AI
                </strong>
                <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '700' }}>Cero exigencias gourmet de horas: cocina fácil, delicioso y 100% calibrado</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#475569' }}>Comida a cocinar:</span>
              <select
                value={selectedMealForRecipe}
                onChange={e => setSelectedMealForRecipe(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '12px', border: '1.5px solid #7c3aed', fontWeight: '800', fontSize: '13px', background: '#ffffff' }}
              >
                {mealsList.map(m => (
                  <option key={m.id} value={m.id}>{m.title.split(' ')[1] || m.title} (~{m.protein}g Prot)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleGenerateRecipeAI}
              disabled={isLoadingRecipe}
              style={{ padding: '14px', borderRadius: '16px', background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', color: '#ffffff', border: 'none', fontWeight: '800', fontSize: '14px', cursor: isLoadingRecipe ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)' }}
            >
              {isLoadingRecipe ? <><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> 👨‍🍳 Cocinando Receta Práctica AI...</> : <><Sparkles size={18} /> ✨ Sugerir Receta con Mi Inventario (DeepSeek AI)</>}
            </button>

            <button
              type="button"
              onClick={handleGoogleAISearchRecipes}
              style={{ padding: '14px', borderRadius: '16px', background: '#f0f9ff', color: '#0284c7', border: '1.5px solid #38bdf8', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Search size={18} color="#0284c7" /> 🔍 Ver Ideas y Fotos Rápidas en Google AI Search
            </button>
          </div>

          {/* Resultado de Receta Sugerida AI */}
          {suggestedRecipe && (
            <div className="animate-fade" style={{ background: '#f8fafc', border: '2px solid #7c3aed', borderRadius: '20px', padding: '20px' }}>
              <div className="flex-between" style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#5b21b6', fontWeight: '900' }}>{suggestedRecipe.nombreReceta}</h3>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: '#ecfdf5', color: '#047857', fontSize: '12px', fontWeight: '800' }}>⏱️ {suggestedRecipe.tiempoPrep}</span>
                  <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: '800' }}>🔥 {suggestedRecipe.dificultad}</span>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '13px', color: '#334155', fontWeight: '700' }}>
                🎯 <strong>Cubre tus raciones asignadas:</strong> {suggestedRecipe.porcionesEquivalentes}
              </div>

              <div className="grid-2" style={{ gap: '14px', marginBottom: '16px' }}>
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ fontSize: '13px', color: '#047857', fontWeight: '800', display: 'block', marginBottom: '8px' }}>✅ Ingredientes en tu Cocina:</strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                    {suggestedRecipe.ingredientesUtilizados?.map((ing, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{ing}</li>)}
                  </ul>
                </div>

                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ fontSize: '13px', color: '#d97706', fontWeight: '800', display: 'block', marginBottom: '8px' }}>🛒 Faltantes / Sugeridos para Súper:</strong>
                  {suggestedRecipe.ingredientesFaltantes?.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#92400e', fontWeight: '700' }}>
                      {suggestedRecipe.ingredientesFaltantes.map((f, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{f}</li>)}
                    </ul>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '800' }}>¡Tienes todo lo necesario en tu alacena, sin salir de casa! 🎉</span>
                  )}
                </div>
              </div>

              <strong style={{ fontSize: '14px', color: '#1e293b', fontWeight: '800', display: 'block', marginBottom: '8px' }}>👩‍🍳 Instrucciones Rápidas Paso a Paso:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {suggestedRecipe.instruccionesPasoAPaso?.map((paso, idx) => (
                  <div key={idx} style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>
                    {paso}
                  </div>
                ))}
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px', color: '#1e40af', fontSize: '13px', fontWeight: '700' }}>
                💪 <strong>Tip Nutricional & Muscular:</strong> {suggestedRecipe.tipNutricional}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
