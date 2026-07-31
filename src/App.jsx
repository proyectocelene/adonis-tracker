import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import WorkoutDay from './components/WorkoutDay';
import NutritionTracker from './components/NutritionTracker';
import HistoryView from './components/HistoryView';
import { ModalProvider, PwaInstallBanner } from './components/common/UIComponents';
import { autoSyncWithOfflineBuffer } from './services/deepseek';

function App() {
  // Motor de Sincronización Automática Resiliente & Rescate Offline para prevenir pérdida de datos al actualizar la PWA
  useEffect(() => {
    // 1. Ejecutar sincronización silenciosa al abrir o recargar la aplicación
    autoSyncWithOfflineBuffer();

    // 2. Escuchar recuperación de red (cuando el usuario vuelve a tener señal Wi-Fi / Datos móviles)
    const handleOnline = () => {
      console.log('⚡️ Conexión restaurada. Sincronizando cola de seguridad en Google Sheets...');
      autoSyncWithOfflineBuffer();
    };

    window.addEventListener('online', handleOnline);

    // 3. Verificación periódica y sincronización en segundo plano cada 30 segundos en vivo
    const interval = setInterval(() => {
      autoSyncWithOfflineBuffer();
    }, 30 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, []);

  return (
    <ModalProvider>
      <Router>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 4px' }}>
          <PwaInstallBanner />
        </div>
        <Routes>
          <Route path="/" element={<WorkoutDay />} />
          <Route path="/nutrition" element={<NutritionTracker />} />
          <Route path="/history" element={<HistoryView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </Router>
    </ModalProvider>
  );
}

export default App;
