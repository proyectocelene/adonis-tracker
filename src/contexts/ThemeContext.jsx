import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('coachv2_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // LocalStorage fallback
    }
    return 'dark'; // Predeterminado OLED Cyber-Clinical
  });

  useEffect(() => {
    try {
      const isDark = theme === 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      document.body.style.colorScheme = isDark ? 'dark' : 'light';
      localStorage.setItem('coachv2_theme', theme);

      // Sincronizar theme-color de la PWA para status bar y navigation bar de iOS y Android
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', isDark ? '#000000' : '#ffffff');
      }
      let metaColorScheme = document.querySelector('meta[name="color-scheme"]');
      if (!metaColorScheme) {
        metaColorScheme = document.createElement('meta');
        metaColorScheme.setAttribute('name', 'color-scheme');
        document.head.appendChild(metaColorScheme);
      }
      metaColorScheme.setAttribute('content', isDark ? 'dark' : 'light');
    } catch {
      // Sincronización fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    if (navigator.vibrate) {
      try { navigator.vibrate(25); } catch {}
    }
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: true
    };
  }
  return context;
};
