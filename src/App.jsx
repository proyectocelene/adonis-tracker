import React, { useEffect, useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import { ModalProvider, PwaInstallBanner, useModal } from './components/common/UIComponents';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GlobalTimerProvider } from './contexts/GlobalTimerContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginScreen from './components/LoginScreen';

import WorkoutDay from './components/WorkoutDay';

function lazyWithRetry(factory) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      console.warn('Error al cargar módulo dinámico (posible nueva versión desplegada):', error);
      const isChunkError = error && (
        (error.message && (
          error.message.includes('Failed to fetch dynamically imported module') ||
          error.message.includes('Loading chunk') ||
          error.message.includes('preload')
        )) ||
        error.name === 'ChunkLoadError'
      );

      const hasRefreshed = sessionStorage.getItem('chunk_retry_' + factory.toString());
      if (isChunkError && !hasRefreshed) {
        sessionStorage.setItem('chunk_retry_' + factory.toString(), 'true');
        if ('serviceWorker' in navigator) {
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (let r of regs) await r.update();
          } catch (e) {}
        }
        window.location.reload();
        return new Promise(() => {});
      }
      sessionStorage.removeItem('chunk_retry_' + factory.toString());
      throw error;
    }
  });
}

const HistoryView = lazyWithRetry(() => import('./components/HistoryView'));
const BodyWeightView = lazyWithRetry(() => import('./components/BodyWeightView'));

function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      color: '#0066ff'
    }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Cargando rutina...</span>
    </div>
  );
}

function AppContent() {
  const { currentUser } = useAuth();
  const { showAlert } = useModal();
  const [isMigrating, setIsMigrating] = useState(true);

  // Escuchar alertas del Guardián de Datos (bloqueo preventivo de caídas masivas)
  useEffect(() => {
    function handleGuardianBlocked(e) {
      const { datasetKey, prevCount, newCount, reason } = e?.detail || {};
      console.error(`[DataGuardian] 🛑 Escritura bloqueada en "${datasetKey}": ${reason} (${prevCount} ➔ ${newCount} elementos).`);
      if (showAlert) {
        showAlert({
          title: "Protección de Datos Activada",
          message: `El Guardián de Adonis bloqueó un intento anómalo de reducir tus datos en "${datasetKey}" (${prevCount} ➔ ${newCount} elementos). Tus datos existentes han sido preservados intactos.`,
          variant: "danger",
          buttonText: "Entendido"
        });
      }
    }

    window.addEventListener('adonis_guardian_blocked', handleGuardianBlocked);
    return () => window.removeEventListener('adonis_guardian_blocked', handleGuardianBlocked);
  }, [showAlert]);

  // Migración y Sincronización Centralizada (Fase 2: users/{uid}/meta/migrations)
  useEffect(() => {
    if (!currentUser) {
      setIsMigrating(false);
      return;
    }

    // Ejecutar migración segura, drenado de outboxes y limpieza de espejos
    import('./services/migrationService').then(({ runV2FirestoreMigration }) => {
      runV2FirestoreMigration(currentUser).then(() => {
        setIsMigrating(false);
      }).catch(err => {
        console.warn("[App] Aviso durante migración v2:", err);
        setIsMigrating(false);
      });
    }).catch(() => {
      setIsMigrating(false);
    });
  }, [currentUser]);

  // Garantizar persistencia de almacenamiento contra desalojos del navegador
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(persisted => {
        if (persisted) {
          console.log("🔒 [Storage] Persistencia de almacenamiento concedida por el navegador.");
        }
      }).catch(e => console.warn("[Storage] Error solicitando persistencia:", e));
    }
  }, []);

  if (isMigrating) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#0066ff' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Migrando a la Nube Segura...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <Router>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 4px' }}>
        <PwaInstallBanner />
      </div>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<WorkoutDay />} />
          <Route path="/history" element={<HistoryView />} />
          <Route path="/weight" element={<BodyWeightView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <BottomNav />
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <GlobalTimerProvider>
            <ModalProvider>
              <AppContent />
            </ModalProvider>
          </GlobalTimerProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
