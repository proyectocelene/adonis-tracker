import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Droplet, Award, RefreshCw, Plus, Heart, Scale, TrendingDown, TrendingUp, UserCheck, Trash2, Calendar, Sparkles, Activity, ShieldCheck, FileText, CheckCircle2, Circle, ChevronDown, ChevronUp, AlertCircle, Flame, Apple, Zap, BookOpen, Info, Check, ShieldAlert, Package, ShoppingCart, Key, Lock, CheckCheck, BarChart2, PieChart, TrendingUp as TrendUpIcon, Layers, MoveRight, Bookmark, BookmarkCheck, Download, Database, FileSpreadsheet, Settings, Send, Share2, Copy } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useModal, UnitToggle } from './common/UIComponents';
import { analyzeFullDatabaseWithAI } from '../services/deepseek';

import MealCard from './nutrition/MealCard';
import AlacenaView from './nutrition/AlacenaView';

export default function NutritionTracker() {
  const modal = useModal();

  // Estado de Nutrición Diaria (Con índices de raciones marcadas y excesos calóricos)
  const [nutrition, setNutrition] = useLocalStorage('coachv2_nutrition_data', {
    protein: 0,
    calories: 0,
    carbs: 0,
    fats: 0,
    water: 0,
    completedMeals: {},
    completedRationIndices: {},
    savedMealTexts: {},
    savedMealAnalysis: {},
    migratedItems: {},
    mealExcesses: {}
  });

  // Historial y estadística nutricional diaria preservada para análisis
  const [nutritionHistory, setNutritionHistory] = useLocalStorage('coachv2_nutrition_history', []);
  
  // Clave de API de DeepSeek
  const [deepSeekApiKey, setDeepSeekApiKey] = useLocalStorage('coachv2_deepseek_api_key', '');
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiInputVal, setApiInputVal] = useState('');

  // Auditoría AI sobre toda la base de datos
  const [isAuditingDb, setIsAuditingDb] = useState(false);
  const [aiDbAuditResult, setAiDbAuditResult] = useState(null);

  useEffect(() => {
    if (deepSeekApiKey) {
      setApiInputVal(deepSeekApiKey);
    }
  }, [deepSeekApiKey]);

  // Estado del Historial Biométrico
  const [bodyMetrics, setBodyMetrics] = useLocalStorage('coachv2_body_metrics_history', []);
  const [calorieDayType, setCalorieDayType] = useLocalStorage('coachv2_calorie_day_type', 'standard'); 

  // Tabs de navegación principal de Nutrición: 'menu' | 'alacena' | 'stats' | 'settings' | 'report' | 'metrics'
  const [activeTab, setActiveTab] = useState('menu');
  const [expandedMealId, setExpandedMealId] = useState('desayuno');

  // Formulario para Nueva Medición Biométrica
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [height, setHeight] = useState('174');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [arm, setArm] = useState('');
  const [notes, setNotes] = useState('');

  // Metas Clínicas de CARLOS DONATO
  const targetCalories = calorieDayType === 'low' ? 2001 : (calorieDayType === 'high' ? 2451 : 2201);
  const targetProtein = 150; 
  const targetCarbs = 259;
  const targetFats = 64;
  const targetWater = 2700; 

  // Estructura oficial del Menú Base (5 Comidas)
  const baseMealsList = [
    {
      id: 'desayuno',
      title: '🌅 Desayuno Principal',
      calories: 580,
      protein: 38,
      carbs: 65,
      fats: 18,
      nextMealId: 'comida',
      nextMealTitle: 'Comida Principal',
      equivalents: [
        { group: 'Proteína Baja en Grasa (AOA)', rations: '3 raciones', desc: '90g de pollo/carne magra o 1 huevo entero + 2 claras de huevo' },
        { group: 'Carbohidratos sin grasa (Cereal)', rations: '2 raciones', desc: '2 tortillas de maíz, 2 rebanadas de pan integral o 0.7 taza de avena/arroz cocido' },
        { group: 'Verduras frescas (Fibra)', rations: '1 ración', desc: '1 taza de nopales asados, calabacita cocida, o ensalada de lechuga y pepino' },
        { group: 'Fruta fresca', rations: '1 ración', desc: '1 manzana mediana o 0.5 pieza de plátano' },
        { group: 'Lácteo Descremado', rations: '1 ración', desc: '1 taza (240 ml) de leche descremada o yogur griego natural sin azúcar' },
        { group: 'Grasas saludables', rations: '1 ración', desc: '0.3 pieza de aguacate (1/3) o 1 cucharadita de aceite de oliva' }
      ]
    },
    {
      id: 'colacion_m',
      title: '🌞 Colación Matutina',
      calories: 290,
      protein: 15,
      carbs: 42,
      fats: 7,
      nextMealId: 'comida',
      nextMealTitle: 'Comida Principal',
      equivalents: [
        { group: 'Carbohidrato con grasa', rations: '1 ración', desc: '3 cucharadas de granola natural o 0.5 barra integral de avena' },
        { group: 'Fruta fresca', rations: '1 ración', desc: '1 manzana o 0.5 pieza de plátano' },
        { group: 'Lácteo Descremado', rations: '1 ración', desc: '1 taza de leche descremada o 1 porción de yogur griego light sin azúcar' }
      ]
    },
    {
      id: 'comida',
      title: '☀️ Comida Principal',
      calories: 780,
      protein: 56,
      carbs: 95,
      fats: 22,
      nextMealId: 'cena',
      nextMealTitle: 'Cena de Reparación',
      equivalents: [
        { group: 'Proteína Baja en Grasa (AOA)', rations: '5 raciones', desc: '150g de pechuga de pollo, pescado o carne magra pesada cocida' },
        { group: 'Carbohidratos sin grasa (Cereal)', rations: '3 raciones', desc: '3 tortillas de maíz, 3 rebanadas de pan integral o 1 taza de avena/arroz' },
        { group: 'Leguminosas (Energía sostenida)', rations: '1.5 raciones', desc: '0.8 taza de frijoles de la olla enteros o lentejas cocidas' },
        { group: 'Verduras frescas (Siedad)', rations: '4 raciones', desc: '4 tazas de nopales asados, brócoli, calabazas cocidas, o mega ensalada' },
        { group: 'Grasas saludables', rations: '2 raciones', desc: '0.7 pieza de aguacate maduro o 2 cucharaditas de aceite de oliva' }
      ]
    },
    {
      id: 'colacion_v',
      title: '🌆 Colación Vespertina',
      calories: 85,
      protein: 2,
      carbs: 21,
      fats: 0,
      nextMealId: 'cena',
      nextMealTitle: 'Cena de Reparación',
      equivalents: [
        { group: 'Fruta fresca rápida', rations: '1 ración', desc: '1 manzana mediana fresca o 0.5 pieza de plátano como pre o post-entreno ligero' }
      ]
    },
    {
      id: 'cena',
      title: '🌙 Cena de Reparación Nocturna',
      calories: 466,
      protein: 35,
      carbs: 52,
      fats: 15,
      nextMealId: 'desayuno',
      nextMealTitle: 'Desayuno de Mañana',
      equivalents: [
        { group: 'Proteína Baja en Grasa (AOA)', rations: '3 raciones', desc: '90g de pollo, filete de pescado, atún en agua o claras cocidas' },
        { group: 'Carbohidratos sin grasa (Cereal)', rations: '2.5 raciones', desc: '2.5 tortillas de maíz, pan integral tostado o 0.8 taza de arroz/quinoa cocidos' },
        { group: 'Verduras verdes', rations: '3 raciones', desc: '3 tazas de ensalada mixta de lechuga, jitomate, espinacas o calabaza' },
        { group: 'Grasas saludables', rations: '1 ración', desc: '0.3 pieza de aguacate o 1 cucharadita de aceite de oliva en frío para aliñar' }
      ]
    }
  ];

  // Combinar equivalentes base con ítems MIGRADOS y EXCESOS calóricos registrados
  const mealsList = baseMealsList.map(meal => {
    const migrated = nutrition.migratedItems?.[meal.id] || [];
    const excesses = nutrition.mealExcesses?.[meal.id] || [];
    const combinedEquivalents = [...meal.equivalents, ...migrated];
    return {
      ...meal,
      equivalents: combinedEquivalents,
      hasRolledOver: migrated.length > 0,
      savedText: nutrition.savedMealTexts?.[meal.id] || '',
      savedAnalysis: nutrition.savedMealAnalysis?.[meal.id] || null,
      excessItems: excesses
    };
  });

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setDeepSeekApiKey(apiInputVal.trim());
    setShowApiInput(false);
    modal.showAlert({
      title: "🔑 Clave DeepSeek Almacenada",
      message: "Tu API Key se guardó cifrada y privada en tu dispositivo local. Habilitando Inteligencia Artificial en toda tu app.",
      variant: "success"
    });
  };

  // ===================== EXPORTACIÓN INTELIGENTE DE LA BASE DE DATOS =====================
  const getCompleteDatabaseObject = () => {
    const db = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('coachv2_')) {
        try {
          db[key] = JSON.parse(localStorage.getItem(key));
        } catch (err) {
          db[key] = localStorage.getItem(key);
        }
      }
    }
    return {
      meta: {
        app: "COACH V2 • Control Científico & Protocolo Adonis",
        atleta: "CARLOS DONATO",
        fechaExportacion: new Date().toISOString(),
        version: "3.0 Liquid Glass iOS AI"
      },
      database: db
    };
  };

  const handleExportAllData = (format = 'json') => {
    try {
      const dbObj = getCompleteDatabaseObject();

      if (format === 'ai-prompt') {
        // Generar un Prompt estructurado en lenguaje natural listo para pegar en DeepSeek / ChatGPT / Google AI
        let aiText = `🤖 *PROMPT ESTRUCTURADO PARA AUDITORÍA AI (DEEPSEEK / CHATGPT / GOOGLE AI)*\n`;
        aiText += `Rol: Nutriólogo Clínico y Científico Deportivo Jefe de NutriConsult.\n`;
        aiText += `Atleta: CARLOS DONATO (26 años, 174 cm, Objetivo: Déficit Calórico de 2,201 kcal/día & 150g proteína para recomposicion).\n\n`;
        aiText += `*DATOS REALES ALMACENADOS EN BITÁCORA LOCAL:*\n`;
        aiText += `1. **Nutrición Hoy**: ${Math.round(nutrition.calories || 0)} kcal, ${Math.round(nutrition.protein || 0)}g proteína magras.\n`;
        aiText += `2. **Excesos / Cheat Meals Detectados**: ${JSON.stringify(nutrition.mealExcesses || {})}\n`;
        aiText += `3. **Historial de Jornadas pasadas**: ${JSON.stringify(nutritionHistory, null, 2)}\n`;
        aiText += `4. **Evolución de Peso Corporal**: ${JSON.stringify(bodyMetrics, null, 2)}\n`;
        aiText += `5. **Inventario en Alacena y Compras**: ${JSON.stringify(dbObj.database['coachv2_alacena_items'] || [], null, 2)}\n`;
        aiText += `6. **Bitácora de Costos en el Súper**: ${JSON.stringify(dbObj.database['coachv2_grocery_prices'] || [], null, 2)}\n\n`;
        aiText += `INSTRUCCIÓN PARA EL AI: Analiza estadísticamente mis patrones de adherencia calórica, evalúa si los excesos o cheat meals están ralentizando el progreso hacia los 68.0 kg (meta Lorentz), y dame 3 consejos prácticos sobre compras e inventario en mi cocina sin desperdiciar dinero en tiendas caras.`;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(aiText);
          modal.showAlert({
            title: "🤖 Base de Datos AI Copiada al Portapapeles",
            message: "¡Toda tu base de datos y bitácora clínica fue convertida en un prompt ultra limpio y copiada a tu portapapeles! Ahora puedes pegarla directamente en DeepSeek AI, ChatGPT o Google Gemini para una auditoría instantánea.",
            variant: "success"
          });
        }
        return;
      }

      if (format === 'csv') {
        let csvContent = "Fecha,Calorias_Reales,Meta_Calorica,Proteina_Reales_g,Meta_Proteina,Carbohidratos_g,Grasas_g,Agua_ml,Tipo_Jornada\n";
        
        const history = dbObj.database['coachv2_nutrition_history'] || [];
        history.forEach(item => {
          csvContent += `"${item.date || ''}",${item.calories || 0},${item.targetCalories || 2201},${item.protein || 0},${item.targetProtein || 150},${item.carbs || 0},${item.fats || 0},${item.water || 0},"${item.calorieType || 'standard'}"\n`;
        });
        
        csvContent += `"Hoy (En Vivo)",${Math.round(nutrition.calories || 0)},${targetCalories},${Math.round(nutrition.protein || 0)},${targetProtein},${Math.round(nutrition.carbs || 0)},${Math.round(nutrition.fats || 0)},${nutrition.water || 0},"${calorieDayType}"\n`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `COACH_V2_Estadisticas_CarlosDonato_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        modal.showAlert({
          title: "📊 Tabla CSV Analítica Descargada",
          message: "Archivo CSV generado. Contiene tus calorías reales (con excesos sumados) y proteínas para analizar en Excel o software estadístico.",
          variant: "success"
        });
        return;
      }

      // Respaldo JSON Integral
      const blob = new Blob([JSON.stringify(dbObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `COACH_V2_BaseDatos_Total_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      modal.showAlert({
        title: "💾 Respaldo JSON de Base de Datos Exportada",
        message: "¡Toda tu base de datos de COACH V2 fue guardada localmente en tu dispositivo!",
        variant: "success"
      });
    } catch (error) {
      modal.showAlert({ title: "❌ Error al Exportar", message: error.message, variant: "danger" });
    }
  };

  // Auditoría AI in-app con DeepSeek
  const handleRunAiAuditInApp = async () => {
    if (!deepSeekApiKey) {
      modal.showAlert({
        title: "🔑 Clave API Requerida",
        message: "Para que DeepSeek realice la auditoría clínica sobre tu base de datos en vivo dentro de la aplicación, configura primero tu clave en el botón de arriba.",
        variant: "warning"
      });
      return;
    }
    setIsAuditingDb(true);
    try {
      const dbObj = getCompleteDatabaseObject();
      const res = await analyzeFullDatabaseWithAI({ apiKey: deepSeekApiKey, dbBackup: dbObj });
      setAiDbAuditResult(res);
      modal.showAlert({ title: "🏆 Auditoría Clínica DeepSeek Terminada", message: `Tu puntuación de adherencia general fue evaluada por la IA: ${res.puntajeAdherencia}`, variant: "success" });
    } catch (error) {
      modal.showAlert({ title: "❌ Error al Consultar AI", message: error.message, variant: "danger" });
    } finally {
      setIsAuditingDb(false);
    }
  };

  // Borrar todos los datos de fábrica (Asegurado en Ajustes)
  const handleClearDatabase = () => {
    modal.showConfirm({
      title: "🗑️ ¿Borrar Toda la Base de Datos de COACH V2?",
      message: "ADVERTENCIA: Esta acción limpiará todo tu historial de peso, inventario de alacena, tickets del súper y rutinas en tu dispositivo actual para comenzar desde cero. ¿Estás absolutamente seguro?",
      confirmText: "⚠️ Sí, Borrar Todo",
      cancelText: "No, Preservar Datos",
      variant: "danger",
      onConfirm: () => {
        localStorage.clear();
        modal.showAlert({
          title: "✨ Base de Datos Reiniciada",
          message: "Tu aplicación se limpió y restableció las fórmulas clínicas de NutriConsult.",
          variant: "info",
          onClose: () => window.location.reload()
        });
      }
    });
  };

  const toggleMealCompleted = (mealObj, forceState = null) => {
    const currentlyCompleted = !!nutrition.completedMeals?.[mealObj.id];
    const newStatus = forceState !== null ? forceState : !currentlyCompleted;
    if (newStatus === currentlyCompleted) return;

    const sign = newStatus ? 1 : -1;
    const cal = mealObj.savedAnalysis?.caloriasEstimadas || mealObj.calories;
    const prot = mealObj.savedAnalysis?.proteinaEstimada || mealObj.protein;
    const carb = mealObj.savedAnalysis?.carbsEstimados || mealObj.carbs;
    const fat = mealObj.savedAnalysis?.grasasEstimadas || mealObj.fats;

    const newCompletedMeals = {
      ...(nutrition.completedMeals || {}),
      [mealObj.id]: newStatus
    };

    setNutrition(prev => ({
      ...prev,
      calories: Math.max(0, (prev.calories || 0) + (cal * sign)),
      protein: Math.max(0, (prev.protein || 0) + (prot * sign)),
      carbs: Math.max(0, (prev.carbs || 0) + (carb * sign)),
      fats: Math.max(0, (prev.fats || 0) + (fat * sign)),
      completedMeals: newCompletedMeals
    }));

    if (newStatus && forceState === null) {
      modal.showAlert({
        title: `✅ ${mealObj.title} Registrado`,
        message: `Sumado al combustible diario:\n\n🔥 +${cal} kcal • 💪 +${prot}g Proteína Magra`,
        variant: 'success'
      });
    }
  };

  const handleToggleRationIndex = (mealId, indicesArray) => {
    setNutrition(prev => ({
      ...prev,
      completedRationIndices: {
        ...(prev.completedRationIndices || {}),
        [mealId]: indicesArray
      }
    }));
  };

  const handleMigrateRations = (fromMealId, targetMealId, uncheckedIndices, itemsToMigrate) => {
    const fromMeal = baseMealsList.find(m => m.id === fromMealId);
    
    const convertedItems = itemsToMigrate.map(item => ({
      group: `[Migrado] ${item.group.split('(')[0].trim()}`,
      rations: `${item.rations}`,
      desc: `Porción pendiente en ${fromMeal?.title.split(' ')[1] || 'comida previa'}. ${item.desc}`,
      isMigrated: true
    }));

    const allIndicesOfOrig = fromMeal ? fromMeal.equivalents.map((_, i) => i) : [];
    
    setNutrition(prev => {
      const existingMigrated = prev.migratedItems?.[targetMealId] || [];
      return {
        ...prev,
        migratedItems: {
          ...(prev.migratedItems || {}),
          [targetMealId]: [...existingMigrated, ...convertedItems]
        },
        completedRationIndices: {
          ...(prev.completedRationIndices || {}),
          [fromMealId]: allIndicesOfOrig
        }
      };
    });

    const origMealObj = mealsList.find(m => m.id === fromMealId);
    if (origMealObj && !nutrition.completedMeals?.[fromMealId]) {
      toggleMealCompleted(origMealObj, true);
    }
  };

  const handleAddExcessItem = (mealId, excessItem) => {
    setNutrition(prev => {
      const currentExcesses = prev.mealExcesses?.[mealId] || [];
      return {
        ...prev,
        calories: (prev.calories || 0) + (excessItem.calories || 0),
        carbs: (prev.carbs || 0) + (excessItem.carbs || 0),
        fats: (prev.fats || 0) + (excessItem.fats || 0),
        protein: (prev.protein || 0) + (excessItem.protein || 0),
        mealExcesses: {
          ...(prev.mealExcesses || {}),
          [mealId]: [...currentExcesses, excessItem]
        }
      };
    });
  };

  const handleRemoveExcessItem = (mealId, excessItem) => {
    setNutrition(prev => {
      const currentExcesses = prev.mealExcesses?.[mealId] || [];
      const updated = currentExcesses.filter(x => x.id !== excessItem.id);
      return {
        ...prev,
        calories: Math.max(0, (prev.calories || 0) - (excessItem.calories || 0)),
        carbs: Math.max(0, (prev.carbs || 0) - (excessItem.carbs || 0)),
        fats: Math.max(0, (prev.fats || 0) - (excessItem.fats || 0)),
        protein: Math.max(0, (prev.protein || 0) - (excessItem.protein || 0)),
        mealExcesses: {
          ...(prev.mealExcesses || {}),
          [mealId]: updated
        }
      };
    });
    modal.showAlert({ title: "🗑️ Exceso Eliminado", message: `Se restaron las ${excessItem.calories} kcal de ese consumo extra.`, variant: "info" });
  };

  const handleApplyCalculatedMacros = (mealId, data) => {
    setNutrition(prev => ({
      ...prev,
      savedMealTexts: {
        ...(prev.savedMealTexts || {}),
        [mealId]: data.text
      },
      savedMealAnalysis: {
        ...(prev.savedMealAnalysis || {}),
        [mealId]: data.analysis
      }
    }));
  };

  const addWater = (amount) => {
    setNutrition(prev => ({ ...prev, water: Math.max(0, (prev.water || 0) + amount) }));
  };

  const addProteinExtra = (amount) => {
    setNutrition(prev => ({
      ...prev,
      protein: Math.max(0, (prev.protein || 0) + amount),
      calories: Math.max(0, (prev.calories || 0) + (amount * 4))
    }));
  };

  const handleArchiveDayToStats = () => {
    modal.showConfirm({
      title: "💾 ¿Guardar Jornada en Historial Estadístico?",
      message: `Guardarás tus totales de hoy (${Math.round(nutrition.calories || 0)} kcal reales y ${Math.round(nutrition.protein || 0)}g proteína) y se reiniciarán tus contadores limpios para mañana.`,
      confirmText: "✨ Guardar y Reiniciar Día",
      cancelText: "Mantener Actual",
      variant: "success",
      onConfirm: () => {
        const todayStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
        const newArchive = {
          id: `stat_${Date.now()}`,
          date: todayStr,
          timestamp: new Date().toISOString(),
          calories: Math.round(nutrition.calories || 0),
          targetCalories,
          protein: Math.round(nutrition.protein || 0),
          targetProtein,
          carbs: Math.round(nutrition.carbs || 0),
          fats: Math.round(nutrition.fats || 0),
          water: nutrition.water || 0,
          calorieType: calorieDayType
        };

        setNutritionHistory(prev => [...prev, newArchive]);
        setNutrition({ protein: 0, calories: 0, carbs: 0, fats: 0, water: 0, completedMeals: {}, completedRationIndices: {}, savedMealTexts: {}, savedMealAnalysis: {}, migratedItems: {}, mealExcesses: {} });
        
        modal.showAlert({ title: "📊 Jornada Archivada con Éxito", message: "Progreso sumado a la sección de Análisis & Estadística.", variant: "info" });
      }
    });
  };

  const handleResetNutrition = () => {
    modal.showConfirm({
      title: "🔄 ¿Reiniciar Contadores a Cero?",
      message: "¿Deseas limpiar tus checks y excesos de hoy a estado base?",
      confirmText: "Sí, Limpiar a Cero",
      cancelText: "Cancelar",
      variant: "warning",
      onConfirm: () => {
        setNutrition({ protein: 0, calories: 0, carbs: 0, fats: 0, water: 0, completedMeals: {}, completedRationIndices: {}, savedMealTexts: {}, savedMealAnalysis: {}, migratedItems: {}, mealExcesses: {} });
        modal.showAlert({ title: "💧 Contadores Limpios", message: "Menú devuelto a estado base.", variant: "info" });
      }
    });
  };

  const handleSaveMetric = (e) => {
    e.preventDefault();
    if (!weight) return;

    const newEntry = {
      id: `bio_${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateString: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }),
      weight: parseFloat(weight),
      unit: weightUnit,
      height: parseFloat(height) || 174,
      waist: parseFloat(waist) || null,
      chest: parseFloat(chest) || null,
      arm: parseFloat(arm) || null,
      notes: notes.trim()
    };

    setBodyMetrics(prev => [...prev, newEntry]);
    setIsAddingMetric(false);
    setWeight(''); setWaist(''); setChest(''); setArm(''); setNotes('');

    modal.showAlert({ title: "📈 Pesaje Guardado", message: `Registro incorporado: ${newEntry.weight} ${newEntry.unit}.`, variant: "success" });
  };

  const handleDeleteMetric = (id) => {
    setBodyMetrics(prev => prev.filter(item => item.id !== id));
  };

  const calPercentage = Math.round(((nutrition.calories || 0) / targetCalories) * 100);
  const protPercentage = Math.round(((nutrition.protein || 0) / targetProtein) * 100);
  const waterPercentage = Math.round(((nutrition.water || 0) / targetWater) * 100);
  const isCalorieExceeded = calPercentage > 105;

  const getWeightChartData = () => {
    if (bodyMetrics.length === 0) return [];
    return bodyMetrics.slice(-15).map(m => {
      let w = m.unit === 'lbs' ? parseFloat((m.weight * 0.453592).toFixed(1)) : m.weight;
      return { date: m.dateString.split(',')[0], kg: w, metaKg: 68.0 };
    });
  };

  const getStatsChartData = () => {
    const historical = nutritionHistory.slice(-10).map(h => ({
      dia: h.date ? h.date.split(',')[0] : 'Ant',
      Proteina: h.protein,
      MetaProt: targetProtein,
      Calorias: h.calories,
      MetaCal: h.targetCalories || targetCalories
    }));

    const currentDay = {
      dia: 'Hoy (En Vivo)',
      Proteina: Math.round(nutrition.protein || 0),
      MetaProt: targetProtein,
      Calorias: Math.round(nutrition.calories || 0),
      MetaCal: targetCalories
    };

    return [...historical, currentDay];
  };

  const statsChartData = getStatsChartData();
  const avgProtein = statsChartData.length > 0 ? Math.round(statsChartData.reduce((acc, curr) => acc + curr.Proteina, 0) / statsChartData.length) : 0;
  const avgCalories = statsChartData.length > 0 ? Math.round(statsChartData.reduce((acc, curr) => acc + curr.Calorias, 0) / statsChartData.length) : 0;

  const chartData = getWeightChartData();
  const latestMetric = bodyMetrics[bodyMetrics.length - 1];

  const calculateBMI = (w, u, h) => {
    if (!w || !h) return "25.8";
    let kg = u === 'lbs' ? w * 0.453592 : w;
    let meters = h / 100;
    return (kg / (meters * meters)).toFixed(1);
  };
  const currentBMI = latestMetric ? calculateBMI(latestMetric.weight, latestMetric.unit, latestMetric.height) : "25.8";

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* CABECERA PRINCIPAL DEL ATLETA */}
      <div className="card" style={{ padding: '18px', marginBottom: '14px', borderTop: isCalorieExceeded ? '4px solid #ef4444' : '4px solid #10b981', background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' }}>
        <div className="flex-between" style={{ gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ textTransform: 'uppercase', letterSpacing: '0.4px' }}>NutriConsult • Plan Clínico</span>
              <span className="badge" style={{ background: '#ecfeff', color: '#0e7490', fontWeight: '800' }}>Atleta: Carlos Donato</span>
              
              {deepSeekApiKey ? (
                <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  🟢 DeepSeek AI Activo
                </span>
              ) : (
                <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  🟡 Sin Clave AI (Opción Google Activa)
                </span>
              )}
            </div>

            <h1 style={{ marginTop: '8px', marginBottom: '4px', fontSize: '22px', fontWeight: '800', whiteSpace: 'normal', color: '#0f172a' }}>
              Nutrición, Alacena & Control de Excesos
            </h1>
            <span style={{ fontSize: '12px', color: isCalorieExceeded ? '#dc2626' : '#047857', fontWeight: '700', display: 'block' }}>
              {isCalorieExceeded ? '⚠️ Alerta: Superaste la meta calórica del día (Refleja consumos extra / pizza / cerveza)' : 'Déficit Calórico con Protección Muscular • 2,201 kcal & 150g Proteína'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={() => setActiveTab('settings')}
              className="btn btn-outline"
              style={{ width: 'auto', height: '42px', padding: '0 12px', borderRadius: '14px', background: '#e0f2fe', border: '1px solid #7dd3fc', color: '#0369a1', fontWeight: '800', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}
              title="Ir a Ajustes, Exportar DB y Prompts AI"
            >
              <Settings size={17} color="#0284c7" /> Ajustes & Exportar DB
            </button>

            <button 
              type="button"
              onClick={() => setShowApiInput(!showApiInput)}
              className="btn btn-outline"
              style={{ width: '42px', height: '42px', padding: 0, borderRadius: '14px', background: deepSeekApiKey ? '#eff6ff' : '#fffbeb', border: deepSeekApiKey ? '1px solid #bfdbfe' : '1px solid #fde047' }}
              title="Configurar Clave API de DeepSeek AI"
            >
              <Key size={18} color={deepSeekApiKey ? '#0066ff' : '#d97706'} />
            </button>

            <button 
              type="button"
              onClick={handleResetNutrition}
              className="btn btn-outline" 
              style={{ width: '42px', height: '42px', padding: 0, borderRadius: '14px', background: '#ffffff' }}
              title="Reiniciar contadores del día"
            >
              <RefreshCw size={18} color="#047857" />
            </button>
          </div>
        </div>

        {/* Panel Desplegable de Configuración API DeepSeek */}
        {showApiInput && (
          <div className="animate-fade" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px dashed #cbd5e1', background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <Key size={18} color="#0066ff" />
              <strong style={{ fontSize: '14px', color: '#1e293b', fontWeight: '800' }}>Configuración de Inteligencia DeepSeek AI:</strong>
            </div>
            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px 0', lineHeight: '1.4', fontWeight: '600' }}>
              Tu clave habilita el análisis inteligente de Alacena, evaluación de precios y costos en el súper, recetas prácticas rápidas y registro automático de excesos en lenguaje natural. Se almacena 100% privada de forma local.
            </p>
            <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="password"
                placeholder="Pegar aquí tu clave (sk-............)"
                value={apiInputVal}
                onChange={(e) => setApiInputVal(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px', borderRadius: '12px', border: '1.5px solid #cbd5e1', minWidth: '220px', textAlign: 'left', fontWeight: '700' }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '10px 18px', borderRadius: '12px', background: '#0066ff', fontWeight: '800', fontSize: '13px' }}>
                💾 Guardar Clave AI
              </button>
            </form>
          </div>
        )}
      </div>

      {/* SELECTOR DE CICLO CALÓRICO (ZIGZAG SEMANAL) */}
      <div className="card" style={{ padding: '14px', marginBottom: '16px', background: '#0f172a', color: '#fff', borderRadius: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={18} color="#f59e0b" />
            <strong style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Ciclo Calórico Semanal (Zigzag):
            </strong>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Ajusta al entreno de tu jornada</span>
        </div>

        <div className="grid-3" style={{ gap: '8px' }}>
          <button
            type="button"
            onClick={() => setCalorieDayType('low')}
            style={{
              padding: '10px 6px',
              borderRadius: '14px',
              border: calorieDayType === 'low' ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)',
              background: calorieDayType === 'low' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
              color: '#ffffff', fontWeight: calorieDayType === 'low' ? '800' : '600', fontSize: '12px', cursor: 'pointer', textAlign: 'center'
            }}
          >
            <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Días Bajos</span>
            2,001 kcal
          </button>

          <button
            type="button"
            onClick={() => setCalorieDayType('standard')}
            style={{
              padding: '10px 6px',
              borderRadius: '14px',
              border: calorieDayType === 'standard' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
              background: calorieDayType === 'standard' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.05)',
              color: '#ffffff', fontWeight: calorieDayType === 'standard' ? '800' : '600', fontSize: '12px', cursor: 'pointer', textAlign: 'center'
            }}
          >
            <span style={{ display: 'block', fontSize: '10px', color: '#34d399', textTransform: 'uppercase' }}>⭐️ Estándar</span>
            2,201 kcal
          </button>

          <button
            type="button"
            onClick={() => setCalorieDayType('high')}
            style={{
              padding: '10px 6px',
              borderRadius: '14px',
              border: calorieDayType === 'high' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.15)',
              background: calorieDayType === 'high' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
              color: '#ffffff', fontWeight: calorieDayType === 'high' ? '800' : '600', fontSize: '12px', cursor: 'pointer', textAlign: 'center'
            }}
          >
            <span style={{ display: 'block', fontSize: '10px', color: '#fbbf24', textTransform: 'uppercase' }}>Días Altos</span>
            2,451 kcal
          </button>
        </div>
      </div>

      {/* CONTADORES CLÍNICOS EN VIVO (COMBUSTIBLE Y EXCESOS) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
        <div className="card" style={{ padding: '14px', margin: 0, borderTop: isCalorieExceeded ? '3px solid #ef4444' : '3px solid #10b981', background: isCalorieExceeded ? '#fef2f2' : '#ffffff' }}>
          <div className="flex-between">
            <span style={{ fontSize: '11px', color: isCalorieExceeded ? '#991b1b' : '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>
              {isCalorieExceeded ? '⚠️ Calorías Excedidas' : '🔥 Calorías'}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: isCalorieExceeded ? '#991b1b' : '#047857', background: isCalorieExceeded ? '#fecaca' : '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
              {calPercentage}%
            </span>
          </div>
          <div style={{ marginTop: '8px', marginBottom: '6px' }}>
            <strong style={{ fontSize: '20px', color: isCalorieExceeded ? '#dc2626' : '#0f172a', fontWeight: '800' }}>{Math.round(nutrition.calories || 0)}</strong>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}> / {targetCalories} kcal</span>
          </div>
          <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, calPercentage)}%`, height: '100%', background: isCalorieExceeded ? '#ef4444' : '#10b981', transition: 'width 0.3s ease', borderRadius: '4px' }} />
          </div>
        </div>

        <div className="card" style={{ padding: '14px', margin: 0, borderTop: '3px solid #0066ff' }}>
          <div className="flex-between">
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>🥩 Proteína Magra</span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#0066ff', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>{protPercentage}%</span>
          </div>
          <div style={{ marginTop: '8px', marginBottom: '6px' }}>
            <strong style={{ fontSize: '20px', color: '#0066ff', fontWeight: '800' }}>{Math.round(nutrition.protein || 0)}g</strong>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}> / {targetProtein}g</span>
          </div>
          <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, protPercentage)}%`, height: '100%', background: '#0066ff', transition: 'width 0.3s ease', borderRadius: '4px' }} />
          </div>
        </div>

        <div className="card" style={{ padding: '14px', margin: 0, borderTop: '3px solid #0284c7' }}>
          <div className="flex-between">
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>💧 Agua (35ml/kg)</span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '10px' }}>{waterPercentage}%</span>
          </div>
          <div style={{ marginTop: '8px', marginBottom: '6px' }}>
            <strong style={{ fontSize: '20px', color: '#0284c7', fontWeight: '800' }}>{((nutrition.water || 0)/1000).toFixed(1)}L</strong>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}> / {(targetWater/1000).toFixed(1)}L</span>
          </div>
          <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, waterPercentage)}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #0284c7)', transition: 'width 0.3s ease', borderRadius: '4px' }} />
          </div>
        </div>

        <div className="card" style={{ padding: '14px', margin: 0, borderTop: '3px solid #8b5cf6', background: '#f5f3ff' }}>
          <div className="flex-between">
            <span style={{ fontSize: '11px', color: '#6d28d9', fontWeight: '800', textTransform: 'uppercase' }}>🥑 Carbs & Grasas</span>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#7c3aed', background: '#ede9fe', padding: '2px 6px', borderRadius: '8px' }}>En Balance</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '16px', color: '#6d28d9', display: 'block', fontWeight: '800' }}>{Math.round(nutrition.carbs || 0)}g</strong>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>Carbs ({targetCarbs}g)</span>
            </div>
            <div style={{ borderLeft: '1px solid #ddd6fe', height: '30px' }} />
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '16px', color: '#7c3aed', display: 'block', fontWeight: '800' }}>{Math.round(nutrition.fats || 0)}g</strong>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>Grasas ({targetFats}g)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones Rápidos de Snacks & Agua */}
      <div className="card" style={{ padding: '12px 14px', marginBottom: '22px', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '800', color: '#334155' }}>
          <span>⚡️ Añadir Extra Rápido:</span>
          <span style={{ color: '#0066ff' }}>1 Clic</span>
        </div>
        <div className="grid-3" style={{ gap: '8px' }}>
          <button type="button" onClick={() => addWater(500)} style={{ padding: '8px 4px', background: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc', borderRadius: '12px', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>💧 +500ml Agua</button>
          <button type="button" onClick={() => addWater(1000)} style={{ padding: '8px 4px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>🍶 +1.0L Termo</button>
          <button type="button" onClick={() => addProteinExtra(30)} style={{ padding: '8px 4px', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', borderRadius: '12px', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>🥤 +30g Scoop Whey</button>
        </div>
      </div>

      {/* MENÚ DE NAVEGACIÓN INTELIGENTE CON 6 MÓDULOS DE ORO */}
      <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '20px', padding: '5px', marginBottom: '22px', gap: '5px', flexWrap: 'wrap', border: '1px solid #cbd5e1' }}>
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          style={{
            flex: '1 1 calc(33% - 6px)', padding: '11px 4px', border: 'none', borderRadius: '15px',
            background: activeTab === 'menu' ? '#10b981' : 'transparent',
            color: activeTab === 'menu' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '11px', cursor: 'pointer',
            boxShadow: activeTab === 'menu' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
          }}
        >
          🥗 Dieta & Excesos
        </button>
        
        <button
          type="button"
          onClick={() => setActiveTab('alacena')}
          style={{
            flex: '1 1 calc(33% - 6px)', padding: '11px 4px', border: 'none', borderRadius: '15px',
            background: activeTab === 'alacena' ? '#0066ff' : 'transparent',
            color: activeTab === 'alacena' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '11px', cursor: 'pointer',
            boxShadow: activeTab === 'alacena' ? '0 4px 12px rgba(0, 102, 255, 0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
          }}
        >
          📦 Alacena & Súper
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          style={{
            flex: '1 1 calc(33% - 6px)', padding: '11px 4px', border: 'none', borderRadius: '15px',
            background: activeTab === 'stats' ? '#d97706' : 'transparent',
            color: activeTab === 'stats' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '11px', cursor: 'pointer',
            boxShadow: activeTab === 'stats' ? '0 4px 12px rgba(217, 119, 6, 0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
          }}
        >
          📈 Estadística & Precios
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          style={{
            flex: '1 1 calc(33% - 6px)', padding: '11px 4px', border: 'none', borderRadius: '15px',
            background: activeTab === 'settings' ? '#0284c7' : 'transparent',
            color: activeTab === 'settings' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '11px', cursor: 'pointer',
            boxShadow: activeTab === 'settings' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '3px'
          }}
        >
          ⚙️ Ajustes & Exportar AI
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('report')}
          style={{
            flex: '1 1 calc(33% - 6px)', padding: '11px 4px', border: 'none', borderRadius: '15px',
            background: activeTab === 'report' ? '#7c3aed' : 'transparent',
            color: activeTab === 'report' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '11px', cursor: 'pointer',
            boxShadow: activeTab === 'report' ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '3px'
          }}
        >
          📋 Reporte Nutricional
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          style={{
            flex: '1 1 calc(33% - 6px)', padding: '11px 4px', border: 'none', borderRadius: '15px',
            background: activeTab === 'metrics' ? '#0e7490' : 'transparent',
            color: activeTab === 'metrics' ? '#ffffff' : '#334155', fontWeight: '800', fontSize: '11px', cursor: 'pointer',
            boxShadow: activeTab === 'metrics' ? '0 4px 12px rgba(14, 116, 144, 0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '3px'
          }}
        >
          ⚖️ Pesaje & IMC
        </button>
      </div>

      {activeTab === 'menu' && (
        /* ================= VISTA 1: MENÚ CON MARCAJE, MIGRACIÓN & EXCESOS CALÓRICOS ================= */
        <div className="animate-fade">
          <div className="card" style={{ padding: '14px', marginBottom: '16px', background: '#ecfdf5', border: '1px solid #86efac', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Apple size={22} color="#10b981" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '13px', color: '#065f46', display: 'block', fontWeight: '800' }}>Marcaje de Raciones, Excesos & Migración ✅</strong>
              <span style={{ fontSize: '11px', color: '#047857', lineHeight: '1.4', display: 'block', fontWeight: '600' }}>
                Marca con ✓ tus raciones. Si consumes algo extra (*pizzas, cervezas, hamburguesa*), toca <strong>⚠️ + Registrar Exceso</strong> o descríbelo al AI para proteger tu balance calórico real.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mealsList.map((mealObj) => {
              const isExpanded = expandedMealId === mealObj.id;
              const isCompleted = !!nutrition.completedMeals?.[mealObj.id];
              const completedIndices = nutrition.completedRationIndices?.[mealObj.id] || [];

              return (
                <MealCard
                  key={mealObj.id}
                  meal={mealObj}
                  allMealOptions={mealsList}
                  isExpanded={isExpanded}
                  onToggleExpand={() => setExpandedMealId(isExpanded ? null : mealObj.id)}
                  isCompleted={isCompleted}
                  onToggleComplete={(val) => toggleMealCompleted(mealObj, val)}
                  completedRationIndices={completedIndices}
                  onToggleRationIndex={(mId, indices) => handleToggleRationIndex(mId, indices)}
                  onMigrateRations={(fromId, targetId, uIndices, items) => handleMigrateRations(fromId, targetId, uIndices, items)}
                  onApplyCalculatedMacros={(id, data) => handleApplyCalculatedMacros(id, data)}
                  onAddExcessItem={(id, item) => handleAddExcessItem(id, item)}
                  onRemoveExcessItem={(id, item) => handleRemoveExcessItem(id, item)}
                  apiKey={deepSeekApiKey}
                  nextMealName={mealObj.nextMealTitle}
                />
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'alacena' && (
        /* ================= VISTA 2: ALACENA INTELIGENTE, SÚPER, WHATSAPP & PRECIOS ================= */
        <AlacenaView
          mealsList={mealsList}
          apiKey={deepSeekApiKey}
        />
      )}

      {activeTab === 'stats' && (
        /* ================= VISTA 3: ANÁLISIS ESTADÍSTICO & CURVAS DE ADHERENCIA ================= */
        <div className="animate-fade">
          <div className="card" style={{ padding: '20px', background: '#ffffff', borderTop: '5px solid #d97706', marginBottom: '18px' }}>
            <div className="flex-between" style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <BarChart2 size={24} color="#d97706" />
                <div>
                  <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>
                    Análisis Estadístico & Rendimiento
                  </h2>
                  <span style={{ fontSize: '12px', color: '#d97706', fontWeight: '700' }}>Evaluación de Consistencia, Excesos & Retención Muscular</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => handleExportAllData('csv')}
                  className="btn btn-outline"
                  style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde047', padding: '8px 12px', fontSize: '12px', borderRadius: '12px', fontWeight: '800', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}
                >
                  <FileSpreadsheet size={16} /> Exportar Tabla CSV
                </button>

                <button 
                  type="button" 
                  onClick={handleArchiveDayToStats}
                  className="btn btn-primary"
                  style={{ background: '#d97706', padding: '8px 14px', fontSize: '12px', borderRadius: '12px', fontWeight: '800', width: 'auto' }}
                >
                  💾 Archivar Hoy al Historial
                </button>
              </div>
            </div>

            {/* Tarjetas Promedio de Rendimiento */}
            <div className="grid-3" style={{ gap: '12px', marginBottom: '22px' }}>
              <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '16px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: '800', textTransform: 'uppercase' }}>Promedio Proteínas</span>
                <strong style={{ fontSize: '22px', color: '#0066ff', display: 'block', margin: '4px 0', fontWeight: '900' }}>{avgProtein}g</strong>
                <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700' }}>Meta: 150g diarios</span>
              </div>

              <div style={{ background: isCalorieExceeded ? '#fef2f2' : '#ecfdf5', padding: '14px', borderRadius: '16px', border: isCalorieExceeded ? '1px solid #fca5a5' : '1px solid #86efac', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: isCalorieExceeded ? '#991b1b' : '#065f46', fontWeight: '800', textTransform: 'uppercase' }}>Consist. Calórica</span>
                <strong style={{ fontSize: '22px', color: isCalorieExceeded ? '#dc2626' : '#10b981', display: 'block', margin: '4px 0', fontWeight: '900' }}>{avgCalories} kcal</strong>
                <span style={{ fontSize: '11px', color: isCalorieExceeded ? '#ef4444' : '#047857', fontWeight: '700' }}>
                  {isCalorieExceeded ? 'Refleja consumos extra / pizza' : 'Déficit óptimo activo'}
                </span>
              </div>

              <div style={{ background: '#f5f3ff', padding: '14px', borderRadius: '16px', border: '1px solid #ddd6fe', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#5b21b6', fontWeight: '800', textTransform: 'uppercase' }}>Jornadas Archivadas</span>
                <strong style={{ fontSize: '22px', color: '#7c3aed', display: 'block', margin: '4px 0', fontWeight: '900' }}>{nutritionHistory.length} días</strong>
                <span style={{ fontSize: '11px', color: '#6d28d9', fontWeight: '700' }}>Memoria Limpia del Atleta</span>
              </div>
            </div>

            {/* Gráficas de Rendimiento */}
            <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: '800', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <TrendUpIcon size={18} color="#0066ff" /> Curva de Consumo de Proteínas vs Meta (150g)
            </h3>
            
            <div style={{ width: '100%', height: '220px', background: '#f8fafc', padding: '14px 6px', borderRadius: '18px', border: '1px solid #cbd5e1', marginBottom: '22px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statsChartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="dia" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#0066ff" fontSize={11} domain={[0, 200]} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #cbd5e1', fontWeight: '800' }} />
                  <Legend verticalAlign="top" height={28} />
                  <Line type="monotone" dataKey="Proteina" name="Proteína Real (g)" stroke="#0066ff" strokeWidth={3} dot={{ r: 5, fill: '#0066ff' }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="MetaProt" name="Meta Protección Muscular (150g)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: '800', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Flame size={18} color="#d97706" /> Adherencia Calórica Diaria (Refleja Cheat Meals y Excesos)
            </h3>
            
            <div style={{ width: '100%', height: '220px', background: '#f8fafc', padding: '14px 6px', borderRadius: '18px', border: '1px solid #cbd5e1', marginBottom: '22px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsChartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="dia" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#d97706" fontSize={11} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #cbd5e1', fontWeight: '800' }} />
                  <Legend verticalAlign="top" height={28} />
                  <Bar dataKey="Calorias" name="Calorías Reales Registradas (kcal)" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="MetaCal" name="Prescripción (2,201 kcal)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribución Ideal NutriConsult */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b', fontWeight: '800' }}>
                ⚖️ Distribución Macro NutriConsult (2,201 kcal):
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0', lineHeight: '1.5', fontWeight: '600' }}>
                En déficit calórico para hipertrofia, esta proporción asegura que quemarás tejido graso preservando el 100% del tejido magro en brazos y tórax:
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: '#eff6ff', color: '#0066ff', padding: '8px 14px', fontSize: '13px', fontWeight: '800', flex: 1, textAlign: 'center', minWidth: '100px' }}>
                  🥩 Proteínas: 26% (140-150g)
                </span>
                <span className="badge" style={{ background: '#ecfdf5', color: '#047857', padding: '8px 14px', fontSize: '13px', fontWeight: '800', flex: 1, textAlign: 'center', minWidth: '100px' }}>
                  🍚 Hidratos: 48% (259g)
                </span>
                <span className="badge" style={{ background: '#f5f3ff', color: '#6d28d9', padding: '8px 14px', fontSize: '13px', fontWeight: '800', flex: 1, textAlign: 'center', minWidth: '100px' }}>
                  🥑 Grasas: 26% (64g)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        /* ================= VISTA 4: AJUSTES, RESPALDOS & EXPORTAR BASE DE DATOS LISTA PARA IA ================= */
        <div className="animate-fade">
          <div className="card" style={{ padding: '22px', background: '#ffffff', borderTop: '5px solid #0284c7', marginBottom: '18px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px', marginBottom: '18px' }}>
              <Settings size={28} color="#0284c7" />
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>
                  Ajustes, Respaldos & Exportación Inteligente AI
                </h2>
                <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: '700' }}>Control absoluto de tu base de datos y auditoría en Inteligencia Artificial</span>
              </div>
            </div>

            {/* Tarjeta de Exportación de Prompt para AI (DeepSeek / ChatGPT / Gemini) */}
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', border: '2px solid #8b5cf6', borderRadius: '22px', padding: '20px', marginBottom: '22px', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.12)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span style={{ fontSize: '32px' }}>🤖</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '17px', color: '#5b21b6', fontWeight: '900', display: 'block' }}>
                    Exportar Base de Datos Estructurada para Prompt AI
                  </strong>
                  <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600', lineHeight: '1.4', display: 'block', marginTop: '4px' }}>
                    Este botón compila 100% de tus rutinas, calorías diarias, excesos marcados (pizza/cerveza), pesajes, inventarios y precios en un prompt ultra limpio. ¡Listo para pegar directamente en DeepSeek AI, ChatGPT o Google AI para un análisis médico al instante!
                  </span>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleExportAllData('ai-prompt')}
                  style={{ padding: '14px', borderRadius: '16px', background: '#7c3aed', color: '#ffffff', border: 'none', fontWeight: '900', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px rgba(124, 58, 237, 0.3)' }}
                >
                  <Copy size={18} /> 🤖 Copiar Prompt AI de DB al Portapapeles
                </button>

                <button
                  type="button"
                  onClick={handleRunAiAuditInApp}
                  disabled={isAuditingDb}
                  style={{ padding: '14px', borderRadius: '16px', background: '#0066ff', color: '#ffffff', border: 'none', fontWeight: '900', fontSize: '14px', cursor: isAuditingDb ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isAuditingDb ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={18} />}
                  🧠 Auditar Mi Base de Datos Ahora (AI In-App)
                </button>
              </div>

              {/* Resultado de auditoría In-App */}
              {aiDbAuditResult && (
                <div className="animate-fade" style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed #c4b5fd', background: '#ffffff', padding: '16px', borderRadius: '16px' }}>
                  <div className="flex-between" style={{ marginBottom: '10px' }}>
                    <strong style={{ fontSize: '16px', color: '#5b21b6', fontWeight: '900' }}>🏆 Auditoría Clínica DeepSeek AI:</strong>
                    <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '14px', fontWeight: '900', padding: '4px 10px' }}>
                      Adherencia: {aiDbAuditResult.puntajeAdherencia}
                    </span>
                  </div>
                  
                  {aiDbAuditResult.hallazgosClave?.map((h, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', fontWeight: '800' }}>• {h.titulo}</strong>
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>{h.detalle}</span>
                    </div>
                  ))}

                  <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', color: '#1e40af', fontSize: '12px', fontWeight: '700', marginTop: '10px' }}>
                    🎯 <strong>Predicción Fisiológica:</strong> {aiDbAuditResult.predicciónFisiologica}
                  </div>
                </div>
              )}
            </div>

            {/* Respaldos Tradicionales en Archivos */}
            <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: '900', marginBottom: '12px' }}>
              📁 Respaldo Físico & Descarga de Archivos de Base de Datos:
            </h3>
            
            <div className="grid-2" style={{ gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '18px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <Database size={20} color="#0066ff" />
                    <strong style={{ fontSize: '15px', color: '#0f172a', fontWeight: '800' }}>Respaldo JSON Completo</strong>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '12px' }}>
                    Descarga el archivo maestro `.json` que almacena 100% de tus tablas, dietas, alacena y rutinas en tu teléfono o PC.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportAllData('json')}
                  className="btn btn-primary"
                  style={{ background: '#0066ff', padding: '12px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                >
                  <Download size={17} /> Descargar Base de Datos (.json)
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '18px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <FileSpreadsheet size={20} color="#10b981" />
                    <strong style={{ fontSize: '15px', color: '#0f172a', fontWeight: '800' }}>Tabla CSV Analítica</strong>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '12px' }}>
                    Descarga una hoja de cálculo `.csv` limpia con tu historial diario de calorías y proteínas para analizar en Excel o software estadístico.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportAllData('csv')}
                  className="btn btn-primary"
                  style={{ background: '#10b981', padding: '12px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                >
                  <FileSpreadsheet size={17} /> Descargar Tabla Analítica (.csv)
                </button>
              </div>
            </div>

            {/* Zona de Reinicio y Mantenimiento */}
            <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '18px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: '15px', color: '#991b1b', fontWeight: '900', display: 'block' }}>
                  🗑️ Limpiar & Restablecer Todos los Datos de Fábrica
                </strong>
                <span style={{ fontSize: '12px', color: '#7f1d1d', fontWeight: '600' }}>
                  Asegurado aquí para evitar toques accidentales. Borrará tus bitácoras locales devolviendo COACH V2 a su estado inicial.
                </span>
              </div>

              <button
                type="button"
                onClick={handleClearDatabase}
                style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '12px 18px', borderRadius: '14px', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}
              >
                Resetear Todos los Datos
              </button>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'report' && (
        /* ================= VISTA 5: REPORTE CLÍNICO NUTRICONSULT ================= */
        <div className="animate-fade">
          <div className="card" style={{ padding: '20px', background: '#ffffff', borderTop: '5px solid #7c3aed' }}>
            <div className="flex-between" style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge badge-blue">Diagnóstico Médico & Deportivo</span>
                <h2 style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Reporte Clínico - NutriConsult</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '14px', color: '#0066ff', display: 'block' }}>CARLOS DONATO</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>26 años • 174 cm • Déficit -500 kcal</span>
              </div>
            </div>
            <div className="grid-2" style={{ gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Metabolismo Basal / TDEE</span>
                <strong style={{ fontSize: '18px', color: '#0f172a', display: 'block', marginTop: '4px' }}>2,701 kcal (TDEE)</strong>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Basal Mifflin: 1,743 kcal / día</span>
              </div>
              <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: '800', textTransform: 'uppercase' }}>Objetivo con Prescripción</span>
                <strong style={{ fontSize: '18px', color: '#1e40af', display: 'block', marginTop: '4px' }}>2,201 kcal (-500 kcal)</strong>
                <span style={{ fontSize: '11px', color: '#3b82f6', display: 'block', fontWeight: '700' }}>Meta: 68.0 kg (Fórmula Lorentz)</span>
              </div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '16px', color: '#065f46', fontSize: '13px', fontWeight: '600' }}>
              🎯 <strong>Indicación para Retención Muscular:</strong> Mantener de 140g a 160g de proteína animal o vegetal de alto valor biológico cada 24 horas, hidratando con 2.7 Litros de agua y sobrecargar pesos en el gimnasio con el Protocolo Adonis.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        /* ================= VISTA 6: BITÁCORA DE PESAJES Y MEDIDAS ================= */
        <div className="animate-fade">
          <div className="card card-highlight" style={{ padding: '16px', marginBottom: '18px', borderLeft: '6px solid #0e7490', background: '#ecfeff' }}>
            <div className="flex-between" style={{ marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Scale size={20} color="#0e7490" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#164e63' }}>Control Antropométrico en Vivo</h3>
              </div>
            </div>
            <div className="grid-3" style={{ gap: '10px', marginTop: '10px' }}>
              <div style={{ background: '#ffffff', padding: '12px 6px', borderRadius: '14px', textAlign: 'center', border: '1px solid #a5f3fc' }}>
                <span style={{ fontSize: '11px', color: '#0e7490', fontWeight: '800', textTransform: 'uppercase' }}>Peso Registrado</span>
                <strong style={{ fontSize: '18px', color: '#083344', display: 'block', margin: '4px 0', fontWeight: '800' }}>{latestMetric ? `${latestMetric.weight} ${latestMetric.unit}` : '78 kg (Base)'}</strong>
              </div>
              <div style={{ background: '#ffffff', padding: '12px 6px', borderRadius: '14px', textAlign: 'center', border: '1px solid #a5f3fc' }}>
                <span style={{ fontSize: '11px', color: '#0e7490', fontWeight: '800', textTransform: 'uppercase' }}>Meta Lorentz</span>
                <strong style={{ fontSize: '18px', color: '#047857', display: 'block', margin: '4px 0', fontWeight: '800' }}>68.0 kg</strong>
              </div>
              <div style={{ background: '#ffffff', padding: '12px 6px', borderRadius: '14px', textAlign: 'center', border: '1px solid #a5f3fc' }}>
                <span style={{ fontSize: '11px', color: '#0e7490', fontWeight: '800', textTransform: 'uppercase' }}>IMC en Vivo</span>
                <strong style={{ fontSize: '18px', color: '#0e7490', display: 'block', margin: '4px 0', fontWeight: '800' }}>{currentBMI}</strong>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '18px', marginBottom: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Curva de Descenso Ponderal (kg)</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Comparativa de peso real vs Meta Ideal (68.0 kg)</span>
              </div>
              {!isAddingMetric && (
                <button type="button" onClick={() => setIsAddingMetric(true)} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '14px', fontWeight: '800', background: '#0e7490', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Plus size={16} /> + Nuevo Pesaje
                </button>
              )}
            </div>

            {chartData.length === 0 ? (
              <div style={{ padding: '28px 18px', textAlign: 'center', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', margin: '12px 0' }}>
                <Scale size={32} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b', fontWeight: '800' }}>Sin pesajes en la bitácora aún</h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Introduce tus pesajes para auditar tu descenso hacia los 68.0 kg prescritos.</p>
              </div>
            ) : (
              <div style={{ width: '100%', height: '220px', marginTop: '14px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#0e7490" fontSize={11} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #cbd5e1' }} />
                    <Legend verticalAlign="top" height={30} />
                    <Line type="monotone" dataKey="kg" name="Peso Actual (kg)" stroke="#0e7490" strokeWidth={3} dot={{ r: 5, fill: '#0e7490' }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="metaKg" name="Meta Ideal (68 kg)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {isAddingMetric && (
            <div className="card animate-fade" style={{ padding: '18px', borderTop: '5px solid #0e7490', marginBottom: '22px', background: '#ffffff', boxShadow: '0 12px 35px rgba(14, 116, 144, 0.15)' }}>
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <strong style={{ fontSize: '16px', color: '#0f172a' }}>Registrar Nuevo Pesaje & Medidas</strong>
                <button type="button" onClick={() => setIsAddingMetric(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><Trash2 size={20} color="#64748b" /></button>
              </div>
              <form onSubmit={handleSaveMetric}>
                <div className="grid-2" style={{ marginBottom: '14px', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Peso (*):</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="number" step="0.1" required placeholder="77.4" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ flex: 1, padding: '10px', fontWeight: '800', textAlign: 'center', border: '1.5px solid #cbd5e1', borderRadius: '12px', color: '#0e7490', fontSize: '16px' }} />
                      <UnitToggle value={weightUnit} onChange={(val) => setWeightUnit(val)} />
                    </div>
                  </div>
                  <div>
                    <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Estatura (cm):</label>
                    <input type="number" placeholder="174" value={height} onChange={(e) => setHeight(e.target.value)} style={{ padding: '10px', fontWeight: '800', textAlign: 'center', width: '100%', border: '1.5px solid #cbd5e1', borderRadius: '12px', fontSize: '16px' }} />
                  </div>
                </div>
                <div className="grid-2" style={{ gap: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddingMetric(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#0e7490' }}>💾 Guardar Pesaje</button>
                </div>
              </form>
            </div>
          )}

          {bodyMetrics.map(item => (
            <div key={item.id} className="card" style={{ padding: '14px 16px', marginBottom: '12px', borderLeft: '5px solid #0e7490', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '17px', color: '#0f172a' }}>{item.weight} {item.unit}</strong>
                <span className="badge" style={{ marginLeft: '8px', background: '#ecfeff', color: '#0e7490' }}>📅 {item.dateString}</span>
              </div>
              <button type="button" onClick={() => handleDeleteMetric(item.id)} style={{ background: '#fef2f2', border: 'none', padding: '8px', borderRadius: '12px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
