import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import WorkoutDay from './components/WorkoutDay';
import NutritionTracker from './components/NutritionTracker';
import HistoryView from './components/HistoryView';
import { ModalProvider, PwaInstallBanner } from './components/common/UIComponents';

function App() {
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
