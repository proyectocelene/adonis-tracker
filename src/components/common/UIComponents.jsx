import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, X, ChevronDown, Check, Sparkles, Smartphone, Share, ArrowRight, Layers } from 'lucide-react';

/* ============================================================================
   1. SISTEMA DE MODALES Y ALERTAS LIQUID GLASS (Reemplazo de alert & confirm)
============================================================================ */
const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'alert', // 'alert' | 'confirm'
    variant: 'info', // 'success' | 'warning' | 'danger' | 'info'
    title: '',
    message: '',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    onConfirm: null,
    onCancel: null
  });

  const showAlert = ({ title, message, variant = 'info', buttonText = 'Entendido' }) => {
    setModalState({
      isOpen: true,
      type: 'alert',
      variant,
      title: title || 'Notificación del Coach',
      message,
      confirmText: buttonText,
      onConfirm: () => setModalState(prev => ({ ...prev, isOpen: false }))
    });
  };

  const showConfirm = ({ title, message, variant = 'warning', confirmText = 'Aceptar', cancelText = 'Cancelar', onConfirm, onCancel }) => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      variant,
      title: title || 'Confirmación requerida',
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        if (onCancel) onCancel();
      }
    });
  };

  const getIcon = () => {
    switch(modalState.variant) {
      case 'success': return <CheckCircle2 size={36} color="#00b464" />;
      case 'warning': return <AlertTriangle size={36} color="#f59e0b" />;
      case 'danger':  return <ShieldAlert size={36} color="#dc2626" />;
      default:        return <Info size={36} color="#0066ff" />;
    }
  };

  const getBadgeColor = () => {
    switch(modalState.variant) {
      case 'success': return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
      case 'warning': return { bg: '#fef3c7', text: '#b45309', border: '#fde047' };
      case 'danger':  return { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' };
      default:        return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' };
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modalState.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '420px',
            borderRadius: '28px',
            padding: '26px 22px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            transform: 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '34px',
              background: getBadgeColor().bg,
              border: `2px solid ${getBadgeColor().border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
            }}>
              {getIcon()}
            </div>

            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '19px',
              fontWeight: '800',
              color: '#0f172a',
              lineBreak: 'strict',
              whiteSpace: 'normal'
            }}>
              {modalState.title}
            </h3>

            <div style={{
              fontSize: '14px',
              color: '#475569',
              lineHeight: '1.55',
              marginBottom: '24px',
              textAlign: 'left',
              background: '#f8fafc',
              padding: '14px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              whiteSpace: 'pre-line'
            }}>
              {modalState.message}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: modalState.type === 'confirm' ? '1fr 1.3fr' : '1fr', 
              gap: '12px' 
            }}>
              {modalState.type === 'confirm' && (
                <button
                  type="button"
                  onClick={modalState.onCancel}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '18px',
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {modalState.cancelText || 'Cancelar'}
                </button>
              )}

              <button
                type="button"
                onClick={modalState.onConfirm}
                style={{
                  padding: '14px 16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: modalState.variant === 'danger' ? '#dc2626' : (modalState.variant === 'success' ? '#00b464' : '#0066ff'),
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: modalState.variant === 'danger' ? '0 6px 18px rgba(220, 38, 38, 0.35)' : '0 6px 18px rgba(0, 102, 255, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                {modalState.confirmText || 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};


/* ============================================================================
   2. LIQUID DROPDOWN (Menú Desplegable Elegante al Estilo iOS Glass)
============================================================================ */
export function LiquidDropdown({ options, value, onChange, label, icon: CustomIcon }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0] || { label: 'Seleccionar...' };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: '6px', fontWeight: '800', fontSize: '12px', color: '#334155' }}>
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: isOpen ? '2px solid #0066ff' : '1.5px solid #cbd5e1',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 8px 20px rgba(0, 102, 255, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
          transition: 'all 0.25s ease',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {CustomIcon && <CustomIcon size={18} color="#0066ff" style={{ flexShrink: 0 }} />}
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', whiteSpace: 'normal', lineBreak: 'strict' }}>
            {selectedOption.label}
          </span>
        </div>
        <ChevronDown size={20} color={isOpen ? '#0066ff' : '#64748b'} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease', flexShrink: 0 }} />
      </button>

      {/* Modal / Drawer para lista de opciones en móvil */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              width: '100%',
              maxWidth: '520px',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '24px 20px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              maxHeight: '75vh',
              overflowY: 'auto',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <strong style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Selecciona una opción</strong>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: isSelected ? '1.5px solid #0066ff' : '1px solid #e2e8f0',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: isSelected ? '800' : '600', color: isSelected ? '#0066ff' : '#1e293b' }}>
                      {opt.label}
                    </span>
                    {isSelected && <Check size={20} color="#0066ff" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ============================================================================
   3. SEGMENTED TOGGLE (Selector Rápido Lbs vs Kg sin menucitos)
============================================================================ */
export function UnitToggle({ value, onChange }) {
  return (
    <div style={{ 
      display: 'inline-flex', 
      background: '#f1f5f9', 
      border: '1.5px solid #cbd5e1', 
      borderRadius: '12px', 
      padding: '2px',
      overflow: 'hidden'
    }}>
      <button
        type="button"
        onClick={() => onChange('lbs')}
        style={{
          padding: '6px 10px',
          border: 'none',
          background: value === 'lbs' ? '#0066ff' : 'transparent',
          color: value === 'lbs' ? '#ffffff' : '#64748b',
          fontWeight: '800',
          fontSize: '11px',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        Lbs
      </button>
      <button
        type="button"
        onClick={() => onChange('kg')}
        style={{
          padding: '6px 10px',
          border: 'none',
          background: value === 'kg' ? '#0066ff' : 'transparent',
          color: value === 'kg' ? '#ffffff' : '#64748b',
          fontWeight: '800',
          fontSize: '11px',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        Kg
      </button>
    </div>
  );
}


/* ============================================================================
   4. PWA INSTALL BANNER (Banner Inteligente para Instalar App Natively)
============================================================================ */
export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Comprobar si ya está instalada o en pantalla completa
    const inStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(inStandalone);

    if (inStandalone) {
      setShowBanner(false);
      return;
    }

    // Detectar iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios|opios/.test(userAgent);
    
    if (isIOSDevice && isSafari && !inStandalone) {
      setIsIOS(true);
      // Solo mostrar si no la cerró hoy
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) setShowBanner(true);
    }

    // Detectar Android Chrome / Edge
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner || isStandalone) return null;

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #0066ff 0%, #1e40af 100%)',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '20px',
        margin: '12px 0 16px 0',
        boxShadow: '0 10px 25px rgba(0, 102, 255, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Smartphone size={24} color="#fff" />
          </div>
          <div>
            <strong style={{ fontSize: '13px', display: 'block', fontWeight: '800' }}>
              📱 Instalar App Oficial
            </strong>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', display: 'block', lineHeight: '1.4' }}>
              Añade COACH V2 a tu inicio para pantalla completa sin marcos del navegador.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              background: '#ffffff',
              color: '#0066ff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '14px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {isIOS ? 'Instalar' : 'Instalar Ya'}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Guía de instalación rápida iOS Safari */}
      {showIosGuide && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            maxWidth: '400px',
            width: '100%',
            borderRadius: '28px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#eff6ff', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share size={28} color="#0066ff" />
            </div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              🍏 Instalar en iPhone / iPad
            </h3>

            <div style={{ textAlign: 'left', fontSize: '14px', color: '#334155', lineHeight: '1.6', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 10px 0' }}>Sigue estos 2 simples pasos en Safari:</p>
              <p style={{ margin: '0 0 10px 0' }}>
                1️⃣ Toca el botón <strong>Compartir (Share ⎋)</strong> en la barra inferior de Safari.
              </p>
              <p style={{ margin: 0 }}>
                2️⃣ Desliza el menú hacia arriba y selecciona <strong>"Añadir a pantalla de inicio" (+)</strong>.
              </p>
            </div>

            <button
              onClick={() => { setShowIosGuide(false); handleDismiss(); }}
              style={{
                width: '100%',
                padding: '14px',
                background: '#0066ff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              ¡Comprendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
