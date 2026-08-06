/**
 * SERVICIO DE SINCRONIZACIÓN CON GOOGLE SHEETS & GOOGLE APPS SCRIPT
 * Adonis Gym Tracker PWA
 */

export const syncWorkoutToGoogleSheets = async (webhookUrl, sessionData) => {
  if (!webhookUrl) return { success: false, error: 'URL de Webhook no configurada' };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Google Apps Script prefiere text/plain en CORS
      },
      body: JSON.stringify(sessionData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sincronizando con Google Sheets:", error);
    return { success: false, error: error.message || 'Error de red al conectar con Google Sheets' };
  }
};

export const fetchRoutineFromGoogleSheets = async (webhookUrl) => {
  if (!webhookUrl) return null;

  try {
    const url = `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}action=getRoutine`;
    const response = await fetch(url);
    const result = await response.json();
    if (result && result.success && result.routine) {
      return result.routine;
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo rutina desde Google Sheets:", error);
    return null;
  }
};
