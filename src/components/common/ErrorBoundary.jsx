import React from 'react';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("⚡️ ErrorBoundary atrapó una excepción:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    if (window.confirm("¿Deseas intentar reiniciar la memoria caché local para solucionar el fallo? Tu historial principal guardado no se perderá.")) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '32px 24px',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
            border: '1.5px solid #e2e8f0',
            maxWidth: '440px',
            width: '100%'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>
              ¡Ups! Algo inesperado ocurrió
            </h2>

            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
              La PWA detectó una interrupción en el renderizado. No te preocupes, tus datos en el celular están a salvo.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#0066ff',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)'
                }}
              >
                <RefreshCw size={18} /> Recargar Aplicación
              </button>

              <button
                type="button"
                onClick={this.handleResetStorage}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#f1f5f9',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Database size={16} /> Reintentar Carga Limpia
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
