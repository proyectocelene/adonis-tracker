import { calculate1RM, isEpleyReliable } from '../../hooks/useWorkoutCalculations.js';
import { matchExercise } from '../exerciseMatcher.js';

/**
 * Parsea el rango de repeticiones objetivo de un ejercicio (ej. '10-12', '8-10', '15')
 * @param {string|number} rawReps
 * @returns {{ min: number, max: number, label: string }}
 */
export function parseTargetRepsRange(rawReps) {
  const raw = (rawReps || '10-12').toString().trim();
  const clean = raw.replace(/[^\d-]/g, '');
  const parts = clean.split('-');
  let min = 8;
  let max = 12;
  if (parts.length === 2) {
    min = parseInt(parts[0], 10) || 8;
    max = parseInt(parts[1], 10) || 12;
  } else {
    const s = parseInt(clean, 10);
    if (!isNaN(s) && s > 0) {
      min = s;
      max = s;
    }
  }
  return { min, max, label: raw };
}

/**
 * Clasifica la estación de trabajo según el nombre de la máquina o ejercicio
 * @param {string} sourceName
 * @returns {{ stationType: 'dumbbell'|'cable'|'smith'|'plate'|'machine', stationIcon: string, stationLabel: string }}
 */
export function detectStationType(sourceName = '') {
  const srcName = sourceName.toLowerCase();
  if (srcName.includes('mancuerna') || srcName.includes('dumbbell')) {
    return { stationType: 'dumbbell', stationIcon: '🏋️', stationLabel: 'Mancuerna' };
  }
  if (srcName.includes('polea') || srcName.includes('cable')) {
    return { stationType: 'cable', stationIcon: '⛓️', stationLabel: 'Polea' };
  }
  if (srcName.includes('smith') || srcName.includes('multipower')) {
    return { stationType: 'smith', stationIcon: '🏛️', stationLabel: 'Smith' };
  }
  if (srcName.includes('disco') || srcName.includes('prensa 45') || srcName.includes('hack')) {
    return { stationType: 'plate', stationIcon: '💿', stationLabel: 'Discos' };
  }
  return { stationType: 'machine', stationIcon: '⚙️', stationLabel: 'Máquina' };
}

/**
 * Formatea una fecha ISO o raw a etiqueta corta (ej. '15 Mar') y garantiza unicidad para Recharts
 * @param {string} dateRaw
 * @param {string} dateStr
 * @param {number} sessionIndex
 * @param {Record<string, number>} dateCounts
 * @returns {{ baseLabel: string, uniqueKey: string }}
 */
export function formatSessionDateLabel(dateRaw, dateStr, sessionIndex, dateCounts) {
  let baseLabel = dateStr || `S${sessionIndex + 1}`;
  if (dateRaw && /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
    const [, m, d] = dateRaw.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mIdx = parseInt(m, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      baseLabel = `${parseInt(d, 10)} ${months[mIdx]}`;
    }
  }

  let uniqueKey = baseLabel;
  if (!dateCounts[baseLabel]) {
    dateCounts[baseLabel] = 1;
  } else {
    dateCounts[baseLabel]++;
    uniqueKey = `${baseLabel} (#${dateCounts[baseLabel]})`;
  }

  return { baseLabel, uniqueKey };
}

/**
 * Transforma las ocurrencias históricas del ejercicio en puntos de datos para la gráfica
 * @param {Array<object>} rawOccurrences
 * @param {Record<string, number>} dateCounts
 * @returns {Array<object>}
 */
export function processHistoricalOccurrences(rawOccurrences, dateCounts) {
  return rawOccurrences.map((occ, idx) => {
    const { baseLabel, uniqueKey } = formatSessionDateLabel(occ.dateRaw, occ.dateStr, idx, dateCounts);

    const peakW = Math.round(occ.maxWeight || 0);
    const minW = Math.round(occ.minWeight !== undefined && occ.minWeight !== null && occ.minWeight !== Infinity ? occ.minWeight : peakW);
    const avgW = Math.round((occ.avgWeight || occ.maxWeight || 0) * 10) / 10;
    const weightedAvgW = occ.weightedAvgWeight ? Math.round(occ.weightedAvgWeight * 10) / 10 : avgW;
    const effectiveTonnage = Math.round(occ.tonnage || occ.totalVolume || (peakW * (occ.bestReps || 0)));
    const weightSpread = Math.max(0, peakW - minW);

    const validRPEs = (occ.workingSets || occ.detailedSets || [])
      .map(s => parseFloat(s.rpe))
      .filter(r => !isNaN(r) && r > 0);
    const avgRPE = validRPEs.length > 0 
      ? Math.round((validRPEs.reduce((a, b) => a + b, 0) / validRPEs.length) * 10) / 10 
      : (occ.rpeStart ? parseFloat(occ.rpeStart) : null);

    const srcName = occ.sourceName || occ.matchedName || '';
    const { stationType, stationIcon, stationLabel } = detectStationType(srcName);

    const workingList = occ.workingSets || occ.detailedSets || [];
    const reliable1RMValues = workingList
      .filter(s => !s.isWarmup && isEpleyReliable(s.reps) && (parseFloat(s.weight) || 0) > 0)
      .map(s => calculate1RM(s.weight, s.reps))
      .filter(v => v > 0);
    const reliableEst1RM = reliable1RMValues.length > 0
      ? Math.max(...reliable1RMValues)
      : (isEpleyReliable(occ.bestReps) && peakW > 0 ? calculate1RM(peakW, occ.bestReps) : null);

    return {
      date: uniqueKey,
      displayDate: baseLabel,
      sessionIndex: idx + 1,
      dateFull: occ.dateFull || occ.dateStr || `Sesión ${idx + 1}`,
      sourceName: srcName,
      stationType,
      stationIcon,
      stationLabel,
      weight: peakW,
      avgWeight: avgW,
      weightedAvgWeight: weightedAvgW,
      minWeight: minW,
      weightRange: [minW, peakW],
      weightSpread,
      rpe: avgRPE,
      rpeStart: occ.rpeStart,
      rpeEnd: occ.rpeEnd,
      deltaRPE: occ.deltaRPE || 0,
      repDropOffPct: occ.repDropOffPct || 0,
      tonnage: effectiveTonnage,
      reps: occ.bestReps || 0,
      avgReps: occ.avgReps || occ.bestReps || 0,
      minReps: occ.minRepsSession || occ.bestReps || 0,
      maxReps: occ.maxRepsSession || occ.bestReps || 0,
      setsCount: occ.effectiveSetsCount || occ.setsCount || (occ.detailedSets ? occ.detailedSets.length : 1),
      warmupCount: occ.warmupSetsCount || 0,
      detailedSets: occ.detailedSets || [],
      workingSets: occ.workingSets || occ.detailedSets || [],
      topSet: occ.topSet,
      est1RM: reliableEst1RM,
      isEpleyReliable: reliableEst1RM !== null,
      volume: effectiveTonnage,
      isDeloadSession: Boolean(occ.isDeloadSession),
      isProjected: false,
      projectedWeight: null,
      projectedAvgWeight: null,
      projectedReps: null,
      projected1RM: null,
      projectedTonnage: null
    };
  });
}

/**
 * Extrae y procesa los datos del ejercicio en la sesión de hoy si existen series completadas
 * @param {object} todayWorkoutData
 * @param {object} exercise
 * @param {Array<object>} rawOccurrences
 * @param {Record<string, number>} dateCounts
 * @param {boolean} isDeloadMode
 * @param {number} currentPointsCount
 * @returns {object|null}
 */
export function extractTodayWorkoutPoint(todayWorkoutData, exercise, rawOccurrences, dateCounts, isDeloadMode, currentPointsCount) {
  if (!exercise || !todayWorkoutData) return null;

  const exId = exercise.id;
  let todayLogs = todayWorkoutData[exId];
  if (!todayLogs) {
    for (const [candKey, candData] of Object.entries(todayWorkoutData)) {
      if (!candData || candData.machine) continue;
      const matchRes = matchExercise(exercise, candKey, candData);
      if (matchRes.isMatch) {
        todayLogs = candData;
        break;
      }
    }
  }
  todayLogs = todayLogs || {};

  const allTodaySets = [];
  Object.keys(todayLogs).forEach(k => {
    const num = parseInt(k, 10);
    if (!isNaN(num) && todayLogs[k]?.completed) {
      const w = parseFloat(todayLogs[k].weight) || 0;
      const r = parseInt(todayLogs[k].reps, 10) || 0;
      const label = (todayLogs[k].label || '').toLowerCase();
      const isWarmup = todayLogs[k].isWarmup === true || num <= 0 || label.startsWith('c') || label.includes('calentamiento') || label.includes('aprox');
      if (w > 0 && r > 0) {
        allTodaySets.push({
          setNum: num,
          weight: w,
          reps: r,
          isWarmup,
          label: todayLogs[k].label || (num <= 0 ? 'C1' : `S${num}`)
        });
      }
    }
  });

  const effectiveTodaySets = allTodaySets.filter(s => !s.isWarmup && s.setNum > 0);
  const workingTodaySets = effectiveTodaySets.length > 0 ? effectiveTodaySets : allTodaySets;

  let todayMaxW = 0;
  let todayMinW = Infinity;
  let todayMaxR = 0;
  let todayMinR = Infinity;
  let todayWSum = 0;
  let todayRSum = 0;
  let todayTonnage = 0;

  workingTodaySets.forEach(s => {
    todayTonnage += (s.weight * s.reps);
    todayWSum += s.weight;
    todayRSum += s.reps;
    if (s.weight > todayMaxW) todayMaxW = s.weight;
    if (s.weight < todayMinW) todayMinW = s.weight;
    if (s.reps > todayMaxR) todayMaxR = s.reps;
    if (s.reps < todayMinR) todayMinR = s.reps;
  });

  const todayIsoDate = new Date().toISOString().split('T')[0];
  const isTodayAlreadyLogged = rawOccurrences.some(occ => {
    const d = occ.dateRaw || '';
    return d.startsWith(todayIsoDate) || occ.sessionId === `session_${todayIsoDate}`;
  });

  if (todayMaxW <= 0 || isTodayAlreadyLogged) {
    return null;
  }

  const peakSetsToday = workingTodaySets.filter(s => s.weight === todayMaxW);
  const bestRepsAtPeakToday = peakSetsToday.length > 0 ? Math.max(...peakSetsToday.map(s => s.reps)) : 0;
  const avgRepsToday = workingTodaySets.length > 0 ? Math.round((todayRSum / workingTodaySets.length) * 10) / 10 : bestRepsAtPeakToday;
  const avgWeightToday = workingTodaySets.length > 0 ? Math.round((todayWSum / workingTodaySets.length) * 10) / 10 : todayMaxW;

  let todayKey = 'Hoy';
  if (!dateCounts['Hoy']) {
    dateCounts['Hoy'] = 1;
  } else {
    dateCounts['Hoy']++;
    todayKey = `Hoy (#${dateCounts['Hoy']})`;
  }

  const finalTodayPeak = Math.round(todayMaxW);
  const finalTodayMin = Math.round(todayMinW !== Infinity ? todayMinW : todayMaxW);
  const todayWeightedAvgW = todayRSum > 0 ? Math.round((todayTonnage / todayRSum) * 10) / 10 : avgWeightToday;

  const todayValidRPEs = workingTodaySets.map(s => parseFloat(s.rpe)).filter(v => !isNaN(v) && v > 0);
  const todayRpeStart = todayValidRPEs.length > 0 ? todayValidRPEs[0] : null;
  const todayRpeEnd = todayValidRPEs.length > 0 ? todayValidRPEs[todayValidRPEs.length - 1] : null;
  const todayDeltaRPE = (todayRpeStart !== null && todayRpeEnd !== null) ? Math.round((todayRpeEnd - todayRpeStart) * 10) / 10 : 0;
  const todayAvgRPE = todayValidRPEs.length > 0 
    ? Math.round((todayValidRPEs.reduce((a, b) => a + b, 0) / todayValidRPEs.length) * 10) / 10 
    : (todayRpeStart !== null ? todayRpeStart : null);

  const exName = exercise?.name || '';
  const { stationType, stationIcon, stationLabel } = detectStationType(exName);

  let todayDropOff = 0;
  if (workingTodaySets.length >= 2 && workingTodaySets[0].reps > 0) {
    const r1 = workingTodaySets[0].reps;
    const rL = workingTodaySets[workingTodaySets.length - 1].reps;
    if (workingTodaySets[0].weight === workingTodaySets[workingTodaySets.length - 1].weight) {
      todayDropOff = Math.max(0, Math.round(((r1 - rL) / r1) * 100));
    }
  }

  return {
    date: todayKey,
    displayDate: 'Hoy',
    sessionIndex: currentPointsCount + 1,
    dateFull: 'Sesión de Hoy (En curso)',
    sourceName: exName,
    stationType,
    stationIcon,
    stationLabel,
    weight: finalTodayPeak,
    avgWeight: avgWeightToday,
    weightedAvgWeight: todayWeightedAvgW,
    minWeight: finalTodayMin,
    weightRange: [finalTodayMin, finalTodayPeak],
    weightSpread: Math.max(0, finalTodayPeak - finalTodayMin),
    rpe: todayAvgRPE,
    rpeStart: todayRpeStart,
    rpeEnd: todayRpeEnd,
    deltaRPE: todayDeltaRPE,
    repDropOffPct: todayDropOff,
    tonnage: Math.round(todayTonnage),
    reps: bestRepsAtPeakToday,
    avgReps: avgRepsToday,
    minReps: todayMinR !== Infinity ? todayMinR : bestRepsAtPeakToday,
    maxReps: todayMaxR,
    setsCount: workingTodaySets.length,
    warmupCount: allTodaySets.length - workingTodaySets.length,
    detailedSets: allTodaySets,
    workingSets: workingTodaySets,
    est1RM: (() => {
      const reliableToday = workingTodaySets.filter(s => isEpleyReliable(s.reps) && s.weight > 0);
      return reliableToday.length > 0 ? Math.max(...reliableToday.map(s => calculate1RM(s.weight, s.reps))) : null;
    })(),
    volume: Math.round(todayTonnage),
    isDeloadSession: Boolean(isDeloadMode),
    isProjected: false,
    projectedWeight: null,
    projectedAvgWeight: null,
    projectedReps: null,
    projected1RM: null,
    projectedTonnage: null
  };
}

/**
 * Filtra los puntos de la gráfica según el rango temporal seleccionado
 * @param {Array<object>} realPoints
 * @param {string} timeframe
 * @returns {Array<object>}
 */
export function filterPointsByTimeframe(realPoints, timeframe) {
  if (!realPoints || realPoints.length === 0) return [];
  if (timeframe === '5ses') {
    return realPoints.slice(-5);
  }
  if (timeframe === '10ses') {
    return realPoints.slice(-10);
  }
  if (timeframe === '1m' || timeframe === '3m' || timeframe === '6m') {
    let daysBack = 30;
    if (timeframe === '3m') daysBack = 90;
    if (timeframe === '6m') daysBack = 180;

    let anchorTime = Date.now();
    const lastWithDate = [...realPoints].reverse().find(p => p.dateRaw);
    if (lastWithDate && lastWithDate.dateRaw) {
      const parsedAnchor = new Date(`${lastWithDate.dateRaw}T12:00:00`).getTime();
      if (!isNaN(parsedAnchor)) anchorTime = parsedAnchor;
    }

    const cutoffTime = anchorTime - (daysBack * 24 * 60 * 60 * 1000);
    const filtered = realPoints.filter(p => {
      if (!p.dateRaw) return true;
      const pTime = new Date(`${p.dateRaw}T12:00:00`).getTime();
      return isNaN(pTime) || pTime >= cutoffTime;
    });

    return filtered.length >= 3 ? filtered : realPoints.slice(-Math.min(5, realPoints.length));
  }
  return realPoints;
}

/**
 * Calcula intervalos continuos de sesiones de descarga (Deload) en los puntos visibles
 * @param {Array<object>} visibleRealPoints
 * @returns {Array<{ start: string, end: string, count: number }>}
 */
export function calculateDeloadWindows(visibleRealPoints) {
  const deloadWindows = [];
  let currentWindow = null;
  visibleRealPoints.forEach(p => {
    if (p.isDeloadSession) {
      if (!currentWindow) {
        currentWindow = { start: p.date, end: p.date, count: 1 };
      } else {
        currentWindow.end = p.date;
        currentWindow.count++;
      }
    } else {
      if (currentWindow) {
        deloadWindows.push(currentWindow);
        currentWindow = null;
      }
    }
  });
  if (currentWindow) {
    deloadWindows.push(currentWindow);
  }
  return deloadWindows;
}

/**
 * Calcula el intervalo dinámico para el Eje X de Recharts para evitar amontonamiento
 * @param {number} dataLength
 * @returns {number}
 */
export function getDynamicXInterval(dataLength) {
  if (!dataLength || dataLength <= 8) return 0;
  if (dataLength <= 15) return 1;
  if (dataLength <= 25) return 2;
  return Math.ceil(dataLength / 6);
}
