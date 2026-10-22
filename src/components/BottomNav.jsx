import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Activity, Scale } from 'lucide-react';

export default function BottomNav() {
  const handleNavClick = () => {
    if (navigator.vibrate) {
      try { navigator.vibrate(15); } catch (e) {}
    }
  };

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <NavLink 
        to="/" 
        onClick={handleNavClick}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Calendar size={20} />
        <span>Rutina</span>
      </NavLink>
      <NavLink 
        to="/history" 
        onClick={handleNavClick}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Activity size={20} />
        <span>Laboratorio</span>
      </NavLink>
      <NavLink 
        to="/weight" 
        onClick={handleNavClick}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Scale size={20} />
        <span>Peso</span>
      </NavLink>
    </nav>
  );
}
