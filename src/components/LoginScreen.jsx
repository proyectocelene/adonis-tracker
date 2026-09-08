import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, ShieldCheck } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '32px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '32px',
          background: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <ShieldCheck size={32} color="#0066ff" />
        </div>
        
        <h1 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>
          COACH V2
        </h1>
        <p style={{ fontSize: '14px', color: '#475569', marginBottom: '24px', lineHeight: '1.5' }}>
          Inicia sesión para sincronizar tu progreso en tiempo real y guardar tus fotos de entrenamiento en la nube segura.
        </p>

        <button 
          onClick={login}
          style={{
            width: '100%',
            padding: '14px',
            background: '#0066ff',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            fontSize: '15px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 20px rgba(0,102,255,0.3)'
          }}
        >
          <LogIn size={20} />
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}
