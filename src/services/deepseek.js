/* ============================================================================
   DEEPSEEK AI NUTRITION & RECIPE SERVICE (Coach V2 - Atleta: Carlos Donato)
   Conecta con la API de DeepSeek para análisis nutricional y recetas prácticas
============================================================================ */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const MODEL_NAME = 'deepseek-chat';

export async function callDeepSeek({ apiKey, systemPrompt, userPrompt, temperature = 0.3 }) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Falta tu Clave de API de DeepSeek. Agrégala en la configuración del Coach AI.');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en servidor DeepSeek (${response.status}): ${errorText || 'Revisa tu clave API o conexión.'}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('La IA de DeepSeek no devolvió una respuesta válida.');
  }

  try {
    return JSON.parse(content);
  } catch (err) {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('El formato de análisis no pudo procesarse como JSON.');
  }
}

/**
 * 1. Analizar Comida Ingresada en Texto ("Hoy comí un sándwich..." o excesos "Me comí 8 pizzas y 4 cervezas")
 */
export async function analyzeMealWithAI({ apiKey, mealName, assignedEquivalents, userTextInput }) {
  const systemPrompt = `Eres NutriCoach AI, un nutriólogo deportivo y clínico experto en el Protocolo Adonis para Carlos Donato (meta: déficit calórico estricto de 2,201 kcal/día y 150g proteína para recomposición y retención de masa muscular).
Tu tarea es analizar con REALISMO CLÍNICO CRUEL Y EXACTO el texto de lo que comió el usuario para la comida "${mealName}".
MUY IMPORTANTE: Si Carlos menciona que comió de MÁS, alimentos fuera de plan (cheat meals), alcohol, o porciones exorbitantes (ej. "me comí 8 rebanadas de pizza", "4 cervezas", "hamburguesas con papas", "pastel"), DEBES CALCULAR Y SUMAR ESAS CALORías Y MACROS REALES al total estimado del platillo para que su registro calórico sea honesto y fidedigno. No ocultes ni subestimes las calorías de los excesos.
DEBES responder STRICTAMENTE en formato JSON con las siguientes claves:
{
  "resumen": "Resumen amigable pero clínico y objetivo de cómo estuvo su ingesta y el impacto en su déficit o sobrepaso calórico del día.",
  "caloriasEstimadas": número (estimado real TOTAL en kcal de todo lo consumido, incluyendo pizzas, alcohol o excesos si los hubo),
  "proteinaEstimada": número (g de proteína magra real total),
  "carbsEstimados": número (g de carbohidratos totales, incluyendo azúcar/harinas refinadas o cervezas),
  "grasasEstimadas": número (g de lípidos totales, incluyendo aceites, quesos de pizza o frituras),
  "cumplimientoPorGrupo": [
    { "grupo": "nombre del grupo asignado", "metaRaciones": número, "consumidas": número, "estado": "cumplido" | "excedido" | "faltante", "comentario": "breve explicación" }
  ],
  "excesosDetectados": [
    { "alimento": "Nombre y cantidad del exceso (ej. 8 Rebanadas de Pizza)", "calorias": número (kcal estimadas solo de este exceso), "macros": "Gramos aprox de Prot/Carbs/Grasas/Alcohol", "impacto": "Explicación breve de cómo compensar en cardio o agua" }
  ],
  "racionesPendientes": [
    { "grupo": "nombre del grupo faltante de la meta", "cantidadFaltante": número, "ejemplo": "alimento recomendado para consumir en la siguiente comida" }
  ],
  "recomendacion": "Consejo técnico sobre cómo manejar el balance, compensar excesos si los hubo o qué hacer en el resto del día."
}`;

  const userPrompt = `Comida programada: ${mealName}
Raciones oficiales asignadas en su dieta:
${JSON.stringify(assignedEquivalents, null, 2)}

Texto escrito por Carlos sobre lo que comió o bebío realmente:
"${userTextInput}"

Analiza los macros reales totales (incluyendo excesos o alcohol si los mencionó), dime cuántas calorías reales ingirió y el estado de sus raciones.`;

  return callDeepSeek({ apiKey, systemPrompt, userPrompt, temperature: 0.3 });
}

/**
 * 2. Sugerir Receta Práctica y Deliciosa basada en la Alacena del usuario
 */
export async function suggestRecipeFromAlacena({ apiKey, mealTitle, assignedEquivalents, alacenaItems, shoppingItems }) {
  const systemPrompt = `Eres un Experto Nutricionista y Chef Deportivo en Recomposición Corporal para Carlos Donato.
Tu misión es recomendar una receta PRÁCTICA, RÁPIDA, CASERA, DELICIOSA y científicamente calibrada para "${mealTitle}" utilizando ÚNICAMENTE o principalmente los ingredientes que el usuario tiene disponibles en su Alacena, respetando las raciones oficiales de su plan. NO TIENE QUE SER UNA RECETA GOURMET COMPLICADA, prioriza la practicidad, rapidez de preparación, excelente sabor y cumplimiento de sus macros en el gimnasio.
Si hace falta algún ingrediente básico para completar las calorías o mejorar el sabor, recomiéndalo para su Lista de Compras.
DEBES responder STRICTAMENTE en formato JSON con la siguiente estructura:
{
  "nombreReceta": "Nombre apetitoso y práctico del platillo (con emojis)",
  "tiempoPrep": "minutos (ej. 10 min)",
  "dificultad": "Muy Fácil | Fácil | Medio",
  "porcionesEquivalentes": "Resumen de raciones que cubre (ej. 3 AOA + 2 Cereal + 1 Verdura)",
  "ingredientesUtilizados": ["ingrediente 1 con cantidad", "ingrediente 2..."],
  "ingredientesFaltantes": ["ingrediente para lista de compras si falta alguno, o vacío si tiene todo"],
  "instruccionesPasoAPaso": ["1. Paso uno...", "2. Paso dos...", "3. Paso tres..."],
  "tipNutricional": "Consejo de por qué esta comida rápida nutre su músculo sin quitarle tiempo."
}`;

  const userPrompt = `Comida objetivo: ${mealTitle}
Raciones/Equivalentes que DEBE CUBRIR:
${JSON.stringify(assignedEquivalents, null, 2)}

Ingredientes actualmente en su ALACENA:
${alacenaItems && alacenaItems.length > 0 ? alacenaItems.map(i => typeof i === 'string' ? i : `${i.name} (${i.quantity})`).join(', ') : 'Ninguno registrado, sugiere ingredientes frescos esenciales'}

Lista de compras actual:
${shoppingItems && shoppingItems.length > 0 ? shoppingItems.map(i => typeof i === 'string' ? i : `${i.name} (${i.quantity})`).join(', ') : 'Vacía'}

Genera una receta muy práctica, sabrosa y rápida para lograr sus macros sin complicaciones.`;

  return callDeepSeek({ apiKey, systemPrompt, userPrompt, temperature: 0.5 });
}
