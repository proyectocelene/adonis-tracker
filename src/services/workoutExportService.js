/**
 * Servicio de Exportación y Sincronización de Entrenamientos
 * Soporta:
 * 1. Formato estándar TCX (Training Center XML) compatible con Google Fit, Garmin, Strava y Health Connect.
 * 2. Web Share API para compartir o enviar directamente a apps de salud instaladas en el dispositivo móvil.
 */

/**
 * Genera el documento XML en estándar TCX para una sesión de entrenamiento
 */
/**
 * Genera el documento XML en estándar TCX para una sesión de entrenamiento
 */
export function generateWorkoutTCX(session = {}, calories = {}) {
  const startTime = session.startTime ? new Date(session.startTime) : (session.timestamp ? new Date(session.timestamp) : new Date());
  const isoTime = startTime.toISOString();
  
  const totalKcal = calories.totalKcal || session.calories?.totalKcal || 350;
  const strengthKcal = calories.strengthKcal || session.calories?.strengthKcal || totalKcal;
  const cardioKcal = calories.cardioKcal || session.calories?.cardioKcal || 0;
  
  // Duración real de la sesión según reloj interno o cálculo
  let totalDurationSeconds = 0;
  if (session.startTime && session.endTime) {
    totalDurationSeconds = Math.round((new Date(session.endTime) - new Date(session.startTime)) / 1000);
  } else if (session.durationMinutes) {
    totalDurationSeconds = Math.round(session.durationMinutes * 60);
  } else if (calories.durationMinutes) {
    totalDurationSeconds = Math.round(calories.durationMinutes * 60);
  }

  const setsCount = session.completedSets || 15;
  if (!totalDurationSeconds || totalDurationSeconds < 300) {
    const cardioMinutes = calories.breakdown?.cardioMinutes || (session.cardioCompleted ? 35 : 0);
    totalDurationSeconds = Math.max(600, Math.round((setsCount * 150) + (cardioMinutes * 60)));
  }

  const sessionName = session.dayName || 'Entrenamiento de Fuerza - Protocolo Adonis';
  const volumeLbs = session.volume ? session.volume.toLocaleString() : '0';
  const athleteWeightNote = session.userWeightKg ? ` Atleta: ${session.userWeightKg} kg.` : '';
  const detailNote = session.exercisesSummary ? ` Detalle: ${session.exercisesSummary}` : '';

  const tcxXml = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase
  xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
  <Activities>
    <Activity Sport="Other">
      <Id>${isoTime}</Id>
      <Lap StartTime="${isoTime}">
        <TotalTimeSeconds>${totalDurationSeconds}</TotalTimeSeconds>
        <DistanceMeters>0.0</DistanceMeters>
        <MaximumSpeed>0.0</MaximumSpeed>
        <Calories>${totalKcal}</Calories>
        <Intensity>Active</Intensity>
        <TriggerMethod>Manual</TriggerMethod>
        <Notes><![CDATA[Protocolo Adonis: ${sessionName}.${athleteWeightNote} Volumen: ${volumeLbs} lbs en ${setsCount} series efectivas. Gasto: ${strengthKcal} kcal pesas + ${cardioKcal} kcal cardio.${detailNote}]]></Notes>
      </Lap>
      <Creator xsi:type="Device_t">
        <Name>Adonis Tracker - Coach V2</Name>
        <UnitId>202609</UnitId>
        <ProductID>1</ProductID>
        <Version>
          <VersionMajor>2</VersionMajor>
          <VersionMinor>0</VersionMinor>
        </Version>
      </Creator>
    </Activity>
  </Activities>
</TrainingCenterDatabase>`;

  return tcxXml.trim();
}

/**
 * Descarga directamente el archivo .tcx al dispositivo del usuario
 */
export function downloadWorkoutTCX(session = {}, calories = {}) {
  try {
    const xmlContent = generateWorkoutTCX(session, calories);
    const dateStr = session.date || new Date().toISOString().split('T')[0];
    const fileName = `entrenamiento_adonis_${dateStr}.tcx`;

    const blob = new Blob([xmlContent], { type: 'application/vnd.garmin.tcx+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Error al descargar archivo TCX:', err);
    return false;
  }
}

/**
 * Genera y descarga un archivo JSON completo con absolutamente toda la información
 * de la sesión: series, repeticiones, máquinas, RPE, 1RMs, gasto calórico y medidas corporales.
 */
export function downloadWorkoutJSON(session = {}, calories = {}, bodyMetrics = [], bodyComposition = {}) {
  try {
    const dateStr = session.date || new Date().toISOString().split('T')[0];
    const latestMetric = Array.isArray(bodyMetrics) && bodyMetrics.length > 0 ? bodyMetrics[bodyMetrics.length - 1] : null;

    const exportPayload = {
      version: "2.0.0",
      app: "Adonis Tracker - Coach V2",
      exportTimestamp: new Date().toISOString(),
      sessionOverview: {
        date: dateStr,
        week: session.week || 1,
        dayName: session.dayName || 'Entrenamiento',
        focus: session.focus || 'Hipertrofia & Fuerza',
        durationMinutes: session.durationMinutes || 0,
        volumeLbs: session.volume || 0,
        effectiveSets: session.completedSets || 0,
        warmupSets: session.warmupSets || 0,
        cardioCompleted: !!session.cardioCompleted
      },
      bodyAnthropometrics: {
        currentWeightKg: session.userWeightKg || latestMetric?.weightKg || parseFloat(bodyComposition?.weightKg) || 78.55,
        currentWeightLbs: Math.round(((session.userWeightKg || latestMetric?.weightKg || parseFloat(bodyComposition?.weightKg) || 78.55) * 2.20462) * 10) / 10,
        bodyFatPct: latestMetric?.bodyFatPct || bodyComposition?.bodyFatPct || null,
        skeletalMusclePct: latestMetric?.skeletalMusclePct || bodyComposition?.skeletalMusclePct || null,
        skeletalMuscleKg: bodyComposition?.skeletalMuscleKg || null,
        circumferencesCm: {
          waist: latestMetric?.waistCm || bodyComposition?.waistCm || null,
          shoulders: latestMetric?.shouldersCm || bodyComposition?.shouldersCm || null,
          chest: latestMetric?.chestCm || bodyComposition?.chestCm || null,
          arms: latestMetric?.armsCm || bodyComposition?.armsCm || null
        },
        adonisRatio: (bodyComposition?.shouldersCm && bodyComposition?.waistCm) 
          ? (parseFloat(bodyComposition.shouldersCm) / parseFloat(bodyComposition.waistCm)).toFixed(3) 
          : ((latestMetric?.shouldersCm && latestMetric?.waistCm) 
            ? (parseFloat(latestMetric.shouldersCm) / parseFloat(latestMetric.waistCm)).toFixed(3) 
            : null),
        metabolicAge: bodyComposition?.metabolicAge || null,
        visceralFat: bodyComposition?.visceralFat || null,
        bmrKcal: bodyComposition?.bmr || null
      },
      energyExpenditure: {
        totalKcal: calories?.displayKcal || calories?.totalKcal || 0,
        strengthMechanicalKcal: calories?.strengthKcal || 0,
        epocKcal: calories?.epocKcal || 0,
        cardioKcal: calories?.cardioKcal || 0,
        smartwatchCalibrated: !!calories?.isHeartRateCalibrated || !!calories?.isBlended,
        heartRateData: calories?.isHeartRateCalibrated ? {
          hrAvgBpm: calories.watchHrAvg,
          hrMaxBpm: calories.watchHrMax,
          hrRestBpm: calories.watchHrRest,
          karvonenHrrPct: calories.hrrPct
        } : null
      },
      exercises: session.exercisesDetailed || session.exercises || {},
      cardioSession: session.cardioDetailed || null,
      rawWorkoutData: session.rawWorkoutData || session.exercises || null
    };

    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const fileName = `bitacora_completa_adonis_${dateStr}.json`;
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Error al exportar JSON de sesión:', err);
    return false;
  }
}

/**
 * Comparte o exporta la sesión usando Web Share API en dispositivos móviles,
 * con fallback a descarga de archivo TCX.
 */
export async function shareOrExportWorkout(session = {}, calories = {}) {
  const totalKcal = calories.totalKcal || session.calories?.totalKcal || 0;
  const sessionName = session.dayName || 'Protocolo Adonis';
  const volumeLbs = session.volume ? session.volume.toLocaleString() : '0';
  const dateStr = session.date || new Date().toLocaleDateString('es-ES');

  const shareText = `🏋️‍♂️ Entrenamiento Archivado: ${sessionName}\n📅 Fecha: ${dateStr}\n🔥 Gasto Calórico: ${totalKcal} kcal\n💪 Volumen: ${volumeLbs} lbs (${session.completedSets || 0} series)\n⚡ Protocolo Adonis V2`;

  if (navigator.share) {
    try {
      const xmlContent = generateWorkoutTCX(session, calories);
      const file = new File([xmlContent], `entrenamiento_${dateStr}.tcx`, { type: 'application/vnd.garmin.tcx+xml' });

      // Intentar compartir con el archivo TCX adjunto si el sistema lo soporta
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Entrenamiento Adonis - ${sessionName}`,
          text: shareText,
          files: [file]
        });
        return { success: true, method: 'share_file' };
      } else {
        await navigator.share({
          title: `Entrenamiento Adonis - ${sessionName}`,
          text: shareText
        });
        return { success: true, method: 'share_text' };
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        downloadWorkoutTCX(session, calories);
        return { success: true, method: 'download_fallback' };
      }
      return { success: false, method: 'aborted' };
    }
  }

  // En navegadores de escritorio sin Web Share, descargar archivo TCX
  downloadWorkoutTCX(session, calories);
  return { success: true, method: 'download' };
}
