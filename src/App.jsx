import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import { ModalProvider, PwaInstallBanner } from './components/common/UIComponents';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { autoSyncWithOfflineBuffer } from './services/deepseek';
import { Loader2 } from 'lucide-react';

// Code Splitting por pestañas para velocidad de carga instantánea (~200KB por chunk)
const WorkoutDay = lazy(() => import('./components/WorkoutDay'));
const HistoryView = lazy(() => import('./components/HistoryView'));

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

function App() {
  // Motor de Sincronización Automática Resiliente & Rescate Offline
  useEffect(() => {
    autoSyncWithOfflineBuffer();

    const handleOnline = () => {
      console.log('⚡️ Conexión restaurada. Sincronizando en segundo plano...');
      autoSyncWithOfflineBuffer();
    };

    window.addEventListener('online', handleOnline);

    const interval = setInterval(() => {
      autoSyncWithOfflineBuffer();
    }, 30 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ModalProvider>
        <Router>
          <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 4px' }}>
            <PwaInstallBanner />
          </div>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<WorkoutDay />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <BottomNav />
        </Router>
      </ModalProvider>
    </ErrorBoundary>
  );
}

export default App;
