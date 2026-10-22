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
      padding: '20px',
      background: 'var(--bg-app)'
    }}>
      <div 
        className="card"
        style={{
          background: 'var(--bg-surface)',
          padding: '28px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
          maxWidth: '380px',
          width: '100%'
        }}
      >
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'var(--accent-blue-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <ShieldCheck size={28} color="var(--accent-blue)" />
        </div>
        
        <h1 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
          COACH V2 • ADONIS
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.45' }}>
          Protocolo clínico de hipertrofia y sobrecarga progresiva. Inicia sesión para sincronizar tus marcas en la nube.
        </p>

        <button 
          type="button"
          onClick={login}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--accent-blue)',
            color: '#000000',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <LogIn size={18} />
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}
