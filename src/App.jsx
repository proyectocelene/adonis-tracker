import React, { useEffect, useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import { ModalProvider, PwaInstallBanner } from './components/common/UIComponents';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { Loader2 } from 'lucide-react';
import { setMany } from 'idb-keyval';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';

async function migrateLocalStorageToIndexedDB() {
  const hasMigrated = localStorage.getItem('coachv2_migrated_to_idb');
  if (hasMigrated === 'true') return;

  const entriesToMigrate = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('coachv2_') && key !== 'coachv2_migrated_to_idb') {
      try {
        const valueStr = localStorage.getItem(key);
        if (valueStr === 'undefined') continue;
        entriesToMigrate.push([key, JSON.parse(valueStr)]);
      } catch (e) {
        entriesToMigrate.push([key, localStorage.getItem(key)]);
      }
    }
  }
  
  if (entriesToMigrate.length > 0) {
    try {
      await setMany(entriesToMigrate);
    } catch (e) {}
  }
  localStorage.setItem('coachv2_migrated_to_idb', 'true');
}

// Code Splitting por pestañas para velocidad de carga instantánea (~200KB por chunk)
const WorkoutDay = lazy(() => import('./components/WorkoutDay'));
const HistoryView = lazy(() => import('./components/HistoryView'));
const BodyWeightView = lazy(() => import('./components/BodyWeightView'));

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
  const [isMigrating, setIsMigrating] = useState(true);

  // Motor de Sincronización Automática Resiliente & Rescate Offline
  useEffect(() => {
    async function runCentralizedMigration() {
      if (!currentUser) {
        setIsMigrating(false);
        return;
      }
      const migrationFlag = `coachv2_migrated_to_firebase_${currentUser.uid}`;
      if (localStorage.getItem(migrationFlag) === 'true') {
        setIsMigrating(false);
        return;
      }

      setIsMigrating(true);
      try {
        // 1. Asegurar que los datos locales pasaron a IndexedDB
        await migrateLocalStorageToIndexedDB();

        // 2. Extraer de IndexedDB e Inyectar en Firebase (solo las llaves vitales)
        const { get } = await import('idb-keyval');
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('./services/firebase');

        const keysToMigrate = [
          'coachv2_active_workouts', 
          'coachv2_custom_day_exercises',
          'coachv2_swapped_exercises'
        ];

        // Migrar primero el historial (como documentos individuales en subcolección)
        const localHistory = await get('coachv2_history');
        if (localHistory && Array.isArray(localHistory)) {
          for (const session of localHistory) {
            if (session && session.id) {
              const sessionRef = doc(db, 'users', currentUser.uid, 'history', session.id);
              await setDoc(sessionRef, session, { merge: true });
            }
          }
        }

        // Luego migrar el resto (como documentos simples)
        for (const key of keysToMigrate) {
          const localVal = await get(key);
          if (localVal !== undefined) {
             const docRef = doc(db, 'users', currentUser.uid, 'store', key);
             await setDoc(docRef, { value: localVal }, { merge: true });
          }
        }

        // 3. Limpiar TODO el localStorage antiguo obsoleto (excepto Auth de Firebase que no usa 'coachv2_')
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith('coachv2_') && k !== migrationFlag) {
             localStorage.removeItem(k);
          }
        }
        
        localStorage.setItem(migrationFlag, 'true');
        console.log('✅ Migración Maestra a Firebase completada y Memoria Limpiada.');
      } catch (err) {
        console.error("Error en migración maestra:", err);
      } finally {
        setIsMigrating(false);
      }
    }
    
    runCentralizedMigration();
  }, [currentUser]);

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
      <AuthProvider>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
