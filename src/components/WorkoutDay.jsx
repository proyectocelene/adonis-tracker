import React, { useState, useEffect } from 'react';
import { scientificProtocol } from '../data/scientificProtocol';
import MonthlyCalendar from './workout/MonthlyCalendar';
import GamificationDashboard from './gamification/GamificationDashboard';
import WorkoutHeader from './workout/WorkoutHeader';
import WorkoutLiveStats from './workout/WorkoutLiveStats';
import WorkoutExerciseList from './workout/WorkoutExerciseList';
import WorkoutFooterControls from './workout/WorkoutFooterControls';
import SundayRecoveryDashboard from './workout/SundayRecoveryDashboard';
import PendingExercisesBanner from './workout/PendingExercisesBanner';
import DeloadMonitoringCard from './workout/DeloadMonitoringCard';
import MorningCardioBanner from './workout/MorningCardioBanner';
import GeneralWarmupBanner from './workout/GeneralWarmupBanner';
import AIAnalysisCard from './workout/AIAnalysisCard';
import WorkoutModals from './workout/WorkoutModals';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from './common/UIComponents';
import { useWorkoutDayState } from '../hooks/workout/useWorkoutDayState';
import { Calendar as CalendarIcon, Dumbbell, BookOpen, CheckCircle, Loader2 } from 'lucide-react';

export default function WorkoutDay() {
  const { currentUser } = useAuth();
  const modal = useModal();
  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  // 1. Estados locales de navegación y visibilidad de vistas/modales
  const [selectedDateKey, setSelectedDateKey] = useState(todayStr);
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    let day = new Date().getDay();
    if (day === 0) day = 7;
    return day - 1;
  });

  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(true);
  const [showGlosarioModal, setShowGlosarioModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRoutineBuilder, setShowRoutineBuilder] = useState(false);
  const [showSecondaryTools, setShowSecondaryTools] = useState(false);
  const [showStrengthWatchModal, setShowStrengthWatchModal] = useState(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

  const isViewingHistory = selectedDateKey !== todayStr;

  // 2. Coordinador unificado de estado (Hooks especializados)
  const state = useWorkoutDayState({
    currentUser,
    modal,
    selectedDateKey,
    currentDayIndex,
    isViewingHistory
  });

  // 3. Sincronizar currentDayIndex con fecha o sesión archivada
  useEffect(() => {
    if (state.historySession && state.historySession.dayId) {
      const histIndex = state.activeDays.findIndex(d => d.id === state.historySession.dayId);
      if (histIndex !== -1) {
        setCurrentDayIndex(histIndex);
        return;
      }
    }
    const d = new Date(selectedDateKey + 'T12:00:00');
    if (!isNaN(d.getTime())) {
      let day = d.getDay();
      if (day === 0) day = 7;
      setCurrentDayIndex(day - 1);
    }
  }, [selectedDateKey, state.historySession, state.activeDays]);

  if (state.isLoadingDb) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#0066ff' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Leyendo Base de Datos...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '90px' }}>
      {/* BARRA SUPERIOR DE SELECTOR DE MODO */}
      <div style={{ display: 'flex', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', padding: '4px', borderRadius: '18px', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => setShowMonthlyCalendar(true)}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '14px',
            background: showMonthlyCalendar ? 'var(--accent-blue)' : 'transparent',
            color: showMonthlyCalendar ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: '900',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: showMonthlyCalendar ? '0 2px 10px rgba(56, 189, 248, 0.25)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <CalendarIcon size={16} /> Calendario Mensual
        </button>
        <button
          type="button"
          onClick={() => setShowMonthlyCalendar(false)}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '14px',
            background: !showMonthlyCalendar ? 'var(--accent-blue)' : 'transparent',
            color: !showMonthlyCalendar ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: '900',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: !showMonthlyCalendar ? '0 2px 10px rgba(56, 189, 248, 0.25)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Dumbbell size={16} /> Rutina del Día
        </button>
      </div>

      {/* MODO 1: VISTA DE CALENDARIO MENSUAL */}
      {showMonthlyCalendar ? (
        <div>
          <MonthlyCalendar
            workoutHistory={state.workoutHistory}
            onSelectDate={(dateKey) => {
              setSelectedDateKey(dateKey);
              setShowMonthlyCalendar(false);
            }}
            onSelectDayId={(dayId) => {
              const idx = scientificProtocol.findIndex(d => d.id === dayId);
              if (idx >= 0) {
                setCurrentDayIndex(idx);
                setShowMonthlyCalendar(false);
              }
            }}
            onSaveSession={state.saveSession}
            onDeleteSession={state.deleteSession}
            currentSessions={state.currentSessions}
            setCurrentSessions={state.setCurrentSessions}
          />

          <button
            type="button"
            onClick={() => setShowGlosarioModal(true)}
            style={{
              width: '100%',
              background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
              border: '1px solid var(--border-subtle)',
              padding: '14px',
              borderRadius: '18px',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}
          >
            <BookOpen size={18} /> Ver Glosario & Guía Explicativa
          </button>

          <GamificationDashboard
            workoutHistory={state.workoutHistory}
            bodyMetrics={state.bodyMetrics}
          />
        </div>
      ) : (
        /* MODO 2: VISTA DE RUTINA DEL DÍA */
        <div>
          <WorkoutHeader
            isViewingHistory={isViewingHistory}
            historySession={state.historySession}
            selectedDateKey={selectedDateKey}
            setSelectedDateKey={setSelectedDateKey}
            currentWeek={state.currentWeek}
            todayStr={todayStr}
            currentDay={state.currentDay}
            currentDayIndex={currentDayIndex}
            baseDay={state.baseDay}
            previousSession={state.previousSession}
            modal={modal}
            setMesocycleStartDate={state.setMesocycleStartDate}
            handleClonePreviousWeek={state.handleClonePreviousWeek}
            handleResetToOfficialRoutine={state.handleResetToOfficialRoutine}
            handleSaveSpecialDay={state.handleSaveSpecialDay}
            isHistoryLoading={state.isHistoryLoading}
            completedSets={state.completedSets}
            volume={state.volume}
            workoutHistory={state.workoutHistory}
            isDeloadMode={state.isDeloadMode}
            onToggleDeload={state.handleToggleDeload}
            fatigueStatus={state.fatigueStatus}
            activeOverride={state.isOverrideActive ? state.weekSplitOverride : null}
            onOpenRescheduleModal={() => setShowRescheduleModal(true)}
          />

          <WorkoutLiveStats
            currentDay={state.currentDay}
            volume={state.volume}
            completedSets={state.completedSets}
            warmupSets={state.warmupSets}
            handleResetCurrent={state.handleResetCurrent}
            calories={state.todayCalories}
            elapsedMinutes={state.liveElapsedMinutes}
          />

          {/* DÍA DE DESCANSO / RECUPERACIÓN O RUTINA DE ENTRENAMIENTO */}
          {state.currentDay.id === 'd7' || (state.currentDay.type === 'rest' && state.currentDay.exercises.length === 0) ? (
            state.currentDay.id === 'd7' ? (
              <SundayRecoveryDashboard
                selectedDateKey={selectedDateKey}
                currentWeek={state.currentWeek}
                onSaveSundayLog={state.handleSaveSundayLog}
                historySession={state.historySession}
                isViewingHistory={isViewingHistory}
              />
            ) : (
              <div className="card" style={{ padding: '32px 20px', textAlign: 'center', margin: '16px 0', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderTop: '3px solid var(--accent-emerald)' }}>
                <CheckCircle size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 12px auto' }} />
                <h2 style={{ color: 'var(--text-main)', fontSize: '19px', fontWeight: '800' }}>Día de Síntesis Muscular & Descanso</h2>
                <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                  Descanso absoluto programado. La reparación de fibras musculares ocurre fuera del gimnasio.
                </p>
              </div>
            )
          ) : (
            <div>
              {/* MONITOR CLÍNICO DE DESCARGA ACTIVA */}
              {state.isDeloadMode && state.deloadProgress && (
                <DeloadMonitoringCard
                  deloadProgress={state.deloadProgress}
                  onDeactivateDeload={state.handleToggleDeload}
                />
              )}

              {/* BANNER INTELIGENTE DE EJERCICIOS PENDIENTES */}
              {state.pendingPreviousData && (
                <PendingExercisesBanner
                  pendingData={state.pendingPreviousData}
                  todayDayName={state.baseDay.name}
                  onDistributeAcrossWeek={state.handleDistributePendingAcrossWeek}
                  onImportToToday={state.handleImportPendingToToday}
                  onRollingShift={state.handleRollingShift}
                  onOpenRescheduleModal={() => setShowRescheduleModal(true)}
                  onDismiss={() => {
                    state.setDismissedPendingAlerts(prev => ({
                      ...prev,
                      [selectedDateKey]: true
                    }));
                  }}
                />
              )}

              {/* ACCESO RÁPIDO PROTOCOLO MATUTINO (CARDIO / REMO) */}
              <MorningCardioBanner
                currentDay={state.currentDay}
                todayWorkoutData={state.todayWorkoutData}
                onOpenCardio={(exId) => {
                  setExpandedExerciseId(exId);
                  setTimeout(() => {
                    const el = document.getElementById(`exercise-${exId}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 50);
                }}
              />

              {/* PASO 0: CALENTAMIENTO GENERAL */}
              <GeneralWarmupBanner
                isVisible={state.currentDay.type === 'workout'}
                isWarmupDone={state.isWarmupDone}
                onToggleWarmup={state.handleToggleWarmup}
              />

              {/* LISTA DE EJERCICIOS */}
              <WorkoutExerciseList
                exercises={state.currentDay.exercises}
                currentDayId={state.currentDay.id}
                currentWeek={state.currentWeek}
                workoutHistory={state.workoutHistory}
                currentSessions={state.currentSessions}
                todayWorkoutData={state.todayWorkoutData}
                expandedExerciseId={expandedExerciseId}
                setExpandedExerciseId={setExpandedExerciseId}
                firstUncompletedIdx={state.firstUncompletedIdx}
                handleUpdateCardio={state.handleUpdateCardio}
                handleUpdateSet={state.handleUpdateSet}
                handleUpdateExerciseMeta={state.handleUpdateExerciseMeta}
                handleSwapExercise={state.handleSwapExercise}
                handleMoveExercise={(id, dir) => state.handleMoveExercise(id, dir, state.currentDay.exercises)}
                deferredExIds={state.deferredExIds}
                handleDeferExercise={state.handleDeferExercise}
                skippedExercisesMap={state.skippedExercisesMap[state.baseDay.id] || {}}
                handleSkipExercise={state.handleSkipExercise}
                userWeightKg={state.latestWeight}
                userSmartwatchKcal={state.smartwatchKcalMap?.[selectedDateKey] || null}
                onOpenStrengthWatchModal={() => setShowStrengthWatchModal(true)}
                onDeleteCustomExercise={state.handleDeleteCustomExercise}
                isDeloadMode={state.isDeloadMode}
              />

              <WorkoutFooterControls
                handleFinishWorkout={state.handleFinishWorkout}
                completedSets={state.completedSets}
                isViewingHistory={isViewingHistory}
                handleClearCurrentDraft={state.handleClearCurrentDraft}
                todayWorkoutData={state.todayWorkoutData}
                selectedDateKey={selectedDateKey}
                showSecondaryTools={showSecondaryTools}
                setShowSecondaryTools={setShowSecondaryTools}
                handleOptimizeWithMath={state.handleOptimizeWithMath}
                isAnalyzingAI={state.isAnalyzingAI}
                setShowGlosarioModal={setShowGlosarioModal}
                handleCopyRoutineForCoach={state.handleCopyRoutineForCoach}
                handleCopyWorkoutCard={state.handleCopyWorkoutCard}
                handleCopySessionForAI={state.handleCopySessionForAI}
                setShowRoutineBuilder={setShowRoutineBuilder}
                handleResetToOfficialRoutine={state.handleResetToOfficialRoutine}
                handleResetAllDaysToOfficial={state.handleResetAllDaysToOfficial}
                baseDay={state.baseDay}
                calories={state.todayCalories}
                onExportTCX={state.handleExportTCX}
                onExportJSON={state.handleExportJSON}
                userSmartwatchKcal={state.smartwatchKcalMap?.[selectedDateKey] || null}
                onSetSmartwatchKcal={state.handleSetSmartwatchKcal}
                isWatchModalOpen={showStrengthWatchModal}
                setIsWatchModalOpen={setShowStrengthWatchModal}
              />
            </div>
          )}
        </div>
      )}

      {/* REPORTE AI / DELOAD */}
      <AIAnalysisCard
        aiAnalysisResult={state.aiAnalysisResult}
        onClose={() => state.setAiAnalysisResult(null)}
        isDeloadMode={state.isDeloadMode}
        fatigueStatus={state.fatigueStatus}
        onToggleDeload={state.handleToggleDeload}
      />

      {/* MODALES AUXILIARES REAGRUPADOS */}
      <WorkoutModals
        showRescheduleModal={showRescheduleModal}
        setShowRescheduleModal={setShowRescheduleModal}
        isOverrideActive={state.isOverrideActive}
        weekSplitOverride={state.weekSplitOverride}
        setWeekSplitOverride={state.setWeekSplitOverride}
        handleRollingShift={state.handleRollingShift}
        handleExecuteCleanSlate={state.handleExecuteCleanSlate}
        handleMoveExerciseBetweenDays={state.handleMoveExerciseBetweenDays}
        baseDay={state.baseDay}
        customRoutine={state.customRoutine}
        activeDays={state.activeDays}
        isAddingExercise={state.isAddingExercise}
        setIsAddingExercise={state.setIsAddingExercise}
        newExScope={state.newExScope}
        setNewExScope={state.setNewExScope}
        newExName={state.newExName}
        setNewExName={state.setNewExName}
        newExSets={state.newExSets}
        setNewExSets={state.setNewExSets}
        newExReps={state.newExReps}
        setNewExReps={state.setNewExReps}
        handleAddCustomExercise={state.handleAddCustomExercise}
        handlePickFromLibrary={state.handlePickFromLibrary}
        newExTargetDay={state.newExTargetDay}
        setNewExTargetDay={state.setNewExTargetDay}
        showGlosarioModal={showGlosarioModal}
        setShowGlosarioModal={setShowGlosarioModal}
        showRoutineBuilder={showRoutineBuilder}
        setShowRoutineBuilder={setShowRoutineBuilder}
        customExercisesMap={state.customExercisesMap}
        setCustomRoutine={state.setCustomRoutine}
        modal={modal}
      />
    </div>
  );
}
