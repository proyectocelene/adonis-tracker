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
      case 'success': return { bg: 'var(--accent-emerald-subtle)', text: 'var(--accent-emerald)', border: 'var(--accent-emerald)' };
      case 'warning': return { bg: 'var(--accent-amber-subtle)', text: 'var(--accent-amber)', border: 'var(--accent-amber)' };
      case 'danger':  return { bg: 'var(--accent-red-subtle)', text: 'var(--accent-red)', border: 'var(--accent-red)' };
      default:        return { bg: 'var(--accent-blue-light)', text: 'var(--accent-blue)', border: 'var(--accent-blue)' };
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
            background: 'var(--bg-surface)',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '20px',
            padding: '22px 18px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)',
            transform: 'scale(1)',
            transition: 'all 0.25s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              background: getBadgeColor().bg,
              border: `2px solid ${getBadgeColor().border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto'
            }}>
              {getIcon()}
            </div>

            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '17px',
              fontWeight: '800',
              color: 'var(--text-main)',
              lineBreak: 'strict',
              whiteSpace: 'normal'
            }}>
              {modalState.title}
            </h3>

            <div style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '20px',
              textAlign: 'left',
              background: 'var(--bg-surface-secondary)',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'pre-line'
            }}>
              {modalState.message}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: modalState.type === 'confirm' ? '1fr 1.3fr' : '1fr', 
              gap: '10px' 
            }}>
              {modalState.type === 'confirm' && (
                <button
                  type="button"
                  onClick={modalState.onCancel}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-surface-secondary)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
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
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: modalState.variant === 'danger' ? 'var(--accent-red)' : (modalState.variant === 'success' ? 'var(--accent-emerald)' : 'var(--accent-blue)'),
                  color: modalState.variant === 'success' ? '#000000' : '#ffffff',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
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
          padding: '11px 14px',
          background: 'var(--bg-surface)',
          border: isOpen ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-strong)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {CustomIcon && <CustomIcon size={16} color="var(--accent-blue)" style={{ flexShrink: 0 }} />}
          <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'normal', lineBreak: 'strict' }}>
            {selectedOption.label}
          </span>
        </div>
        <ChevronDown size={18} color={isOpen ? 'var(--accent-blue)' : 'var(--text-muted)'} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
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
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
              background: 'var(--bg-surface)',
              width: '100%',
              maxWidth: '520px',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '18px 16px',
              borderTop: '1px solid var(--border-subtle)',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
              maxHeight: '75vh',
              overflowY: 'auto',
              animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <strong style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Selecciona una opción</strong>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--accent-blue-light)' : 'var(--bg-surface-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: isSelected ? '800' : '600', color: isSelected ? 'var(--accent-blue)' : 'var(--text-main)' }}>
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
      background: 'var(--bg-surface-secondary)', 
      border: '1px solid var(--border-subtle)', 
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
          background: value === 'lbs' ? 'var(--accent-blue)' : 'transparent',
          color: value === 'lbs' ? '#ffffff' : 'var(--text-muted)',
          fontWeight: '900',
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
          background: value === 'kg' ? 'var(--accent-blue)' : 'transparent',
          color: value === 'kg' ? '#ffffff' : 'var(--text-muted)',
          fontWeight: '900',
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
            background: 'var(--bg-surface)',
            maxWidth: '400px',
            width: '100%',
            borderRadius: '28px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-ios-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--accent-blue-light)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share size={28} color="var(--accent-blue)" />
            </div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
              🍏 Instalar en iPhone / iPad
            </h3>

            <div style={{ textAlign: 'left', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', background: 'var(--bg-surface-secondary)', padding: '16px', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
              <p style={{ margin: '0 0 10px 0' }}>Sigue estos 2 simples pasos en Safari:</p>
              <p style={{ margin: '0 0 10px 0' }}>
                1️⃣ Toca el botón <strong style={{ color: 'var(--text-main)' }}>Compartir (Share ⎋)</strong> en la barra inferior de Safari.
              </p>
              <p style={{ margin: 0 }}>
                2️⃣ Desliza el menú hacia arriba y selecciona <strong style={{ color: 'var(--text-main)' }}>"Añadir a pantalla de inicio" (+)</strong>.
              </p>
            </div>

            <button
              onClick={() => { setShowIosGuide(false); handleDismiss(); }}
              style={{
                width: '100%',
                padding: '14px',
                background: 'var(--accent-blue)',
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
