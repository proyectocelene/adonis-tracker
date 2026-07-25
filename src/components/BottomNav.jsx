import React from 'react';
import { Dumbbell, Utensils, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <Dumbbell size={22} />
        <span>Rutina</span>
      </Link>
      
      <Link to="/nutrition" className={`nav-item ${path === '/nutrition' ? 'active' : ''}`}>
        <Utensils size={22} />
        <span>Nutrición</span>
      </Link>
      
      <Link to="/history" className={`nav-item ${path === '/history' ? 'active' : ''}`}>
        <Activity size={22} />
        <span>Análisis</span>
      </Link>
    </div>
  );
}
