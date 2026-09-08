import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Activity, Scale } from 'lucide-react';

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
        <span>Laboratorio</span>
      </NavLink>
      <NavLink 
        to="/weight" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Scale size={22} />
        <span>Peso</span>
      </NavLink>
    </nav>
  );
}
