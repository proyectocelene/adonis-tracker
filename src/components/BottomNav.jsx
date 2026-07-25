import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Activity, Droplet } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Calendar size={22} />
        <span>Rutina</span>
      </NavLink>
      <NavLink 
        to="/history" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Activity size={22} />
        <span>Análisis</span>
      </NavLink>
      <NavLink 
        to="/nutrition" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Droplet size={22} />
        <span>Nutrición</span>
      </NavLink>
    </nav>
  );
}
