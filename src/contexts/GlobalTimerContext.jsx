import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const GlobalTimerContext = createContext();

export function useGlobalTimer() {
  return useContext(GlobalTimerContext);
}

export function GlobalTimerProvider({ children }) {
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const secondsLeftRef = useRef(0);
  const totalSecondsRef = useRef(0);
  const isTimerActiveRef = useRef(false);
  const currentExerciseNameRef = useRef('');

  // Notificación de sistema (migrada desde ExerciseRow)
  const triggerNotification = useCallback((exerciseName, durationSeconds) => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    if (navigator.vibrate) {
      navigator.vibrate([600, 200, 600, 200, 1000, 200, 1000, 200, 1200]);
    }
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        [0, 0.25, 0.5, 0.75, 1.0].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(987.77, ctx.currentTime + delay);
          osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + delay + 0.18);
          gain.gain.setValueAtTime(1.0, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.24);
        });
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = '⏱️ ¡TIEMPO DE DESCANSO CONCLUIDO!';
      const options = {
        body: `Tu descanso de ${durationSeconds}s${exerciseName ? ` para "${exerciseName}"` : ''} ha concluido. ¡A dar la siguiente serie!`,
        icon: './pwa-192x192.png',
        badge: './pwa-192x192.png',
        tag: `timer-${Date.now()}`,
        renotify: true,
        requireInteraction: true,
        vibrate: [600, 200, 600, 200, 1000]
      };
      try {
        new Notification(title, options);
      } catch (e) {
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, options);
          });
        }
      }
    }
  }, []);

  // Inicializar Canvas y Video para PiP
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    canvasRef.current = canvas;

    const video = document.createElement('video');
    if (canvas.captureStream) {
      try {
        video.srcObject = canvas.captureStream(10); // 10 fps es suficiente
      } catch (e) {}
    }
    video.muted = true;
    video.playsInline = true;
    // Ocultar video completamente pero debe estar en el DOM para que algunos navegadores móviles permitan PiP
    video.style.position = 'fixed';
    video.style.bottom = '0';
    video.style.right = '0';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    
    if (document.body && !video.parentNode) {
      document.body.appendChild(video);
    }
    
    video.play().catch(e => {
      if (e?.name !== 'AbortError') {
        console.warn('PiP video autoplay prevented:', e?.message || e);
      }
    });
    videoRef.current = video;

    return () => {
      if (video && video.parentNode) {
        video.parentNode.removeChild(video);
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Función para dibujar en el Canvas que luego se emite en el PiP
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Fondo
    ctx.fillStyle = '#0f172a'; // dark background slate-900
    ctx.fillRect(0, 0, width, height);

    const secondsLeft = secondsLeftRef.current;
    const total = totalSecondsRef.current || 1;
    const active = isTimerActiveRef.current;

    // Círculo de progreso
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#334155'; // background track
    ctx.lineWidth = 15;
    ctx.stroke();

    if (active && secondsLeft > 0) {
      const progress = secondsLeft / total;
      ctx.beginPath();
      // Empezar desde arriba (-90 grados)
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * progress));
      ctx.strokeStyle = '#38bdf8'; // sky-400
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Texto de tiempo
    ctx.fillStyle = active && secondsLeft > 0 ? '#ffffff' : (secondsLeft === 0 ? '#22c55e' : '#94a3b8');
    ctx.font = 'bold 70px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    const timeStr = `${m}:${s.toString().padStart(2, '0')}`;
    ctx.fillText(timeStr, centerX, centerY);
    
    // Texto de estado
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText(active && secondsLeft > 0 ? 'DESCANSO' : 'LISTO', centerX, centerY + 60);

    if (active) {
      animationRef.current = requestAnimationFrame(drawCanvas);
    }
  }, []);

  // Tick del temporizador
  useEffect(() => {
    if (isTimerActive && restTimerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRestTimerSeconds(prev => {
          const next = prev - 1;
          secondsLeftRef.current = next;
          if (next <= 0) {
            clearInterval(timerRef.current);
            setIsTimerActive(false);
            isTimerActiveRef.current = false;
            // Dibujar última vez el estado 0
            drawCanvas();
            triggerNotification(currentExerciseNameRef.current, totalSecondsRef.current);
            return 0;
          }
          return next;
        });
      }, 1000);
    } else if (isTimerActive && restTimerSeconds === 0) {
      setIsTimerActive(false);
      isTimerActiveRef.current = false;
      drawCanvas();
      triggerNotification(currentExerciseNameRef.current, totalSecondsRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, drawCanvas, triggerNotification]);

  const enterPiP = async () => {
    const video = videoRef.current;
    if (video && document.pictureInPictureElement !== video) {
      try {
        await video.play();
        if (video.requestPictureInPicture) {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.warn("PiP falló o no está soportado en este dispositivo/navegador.", err);
      }
    }
  };

  const exitPiP = async () => {
    if (document.pictureInPictureElement) {
       try {
         await document.exitPictureInPicture();
       } catch (err) {
         console.warn("Error exiting PiP", err);
       }
    }
  }

  const startTimer = useCallback((seconds, exerciseName = '') => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    setRestTimerSeconds(seconds);
    setIsTimerActive(true);
    
    secondsLeftRef.current = seconds;
    totalSecondsRef.current = seconds;
    isTimerActiveRef.current = true;
    currentExerciseNameRef.current = exerciseName;
    
    drawCanvas();
    enterPiP();
  }, [drawCanvas]);

  const stopTimer = useCallback(() => {
    setIsTimerActive(false);
    isTimerActiveRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    drawCanvas();
    exitPiP();
  }, [drawCanvas]);

  const setTimerDuration = useCallback((seconds) => {
    setRestTimerSeconds(seconds);
    secondsLeftRef.current = seconds;
    totalSecondsRef.current = seconds;
    drawCanvas();
  }, [drawCanvas]);

  return (
    <GlobalTimerContext.Provider value={{ 
      restTimerSeconds, 
      isTimerActive, 
      startTimer, 
      stopTimer, 
      setTimerDuration,
      enterPiP
    }}>
      {children}
      
      {/* Botón Flotante en la UI de la App (además del PiP) */}
      {isTimerActive && (
        <div style={{
          position: 'fixed',
          bottom: '80px', // Por encima de la navegación inferior
          right: '20px',
          background: '#0f172a',
          color: '#38bdf8',
          padding: '12px 18px',
          borderRadius: '24px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.4)',
          border: '1.5px solid #38bdf8',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={enterPiP}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>Descanso</span>
            <strong style={{ fontSize: '16px', fontWeight: '900' }}>
              {Math.floor(restTimerSeconds / 60)}:{String(restTimerSeconds % 60).padStart(2, '0')}
            </strong>
          </div>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); stopTimer(); }}
            style={{ 
              background: '#ef4444', 
              border: 'none', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
          </button>
        </div>
      )}
    </GlobalTimerContext.Provider>
  );
}
