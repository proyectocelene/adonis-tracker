import React from 'react';
import { Dumbbell, Utensils, LineChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bottom-nav glass-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <Dumbbell size={24} />
        <span>Rutina</span>
      </Link>
      
      <Link to="/nutrition" className={`nav-item ${path === '/nutrition' ? 'active' : ''}`}>
        <Utensils size={24} />
        <span>Nutrición</span>
      </Link>
      
      <Link to="/history" className={`nav-item ${path === '/history' ? 'active' : ''}`}>
        <LineChart size={24} />
        <span>Progreso</span>
      </Link>
    </div>
  );
}
