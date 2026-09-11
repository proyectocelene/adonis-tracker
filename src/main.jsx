import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Manejador global para recargas limpias automáticas ante nuevos despliegues de chunks
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite detectó una nueva versión desplegada en el servidor. Recargando con la última versión...');
  event.preventDefault();
  const lastReload = sessionStorage.getItem('last_vite_preload_reload');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 5000) {
    sessionStorage.setItem('last_vite_preload_reload', String(now));
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let reg of registrations) reg.update();
      });
    }
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
