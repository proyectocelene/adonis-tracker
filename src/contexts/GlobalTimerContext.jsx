import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const GlobalTimerContext = createContext();

export function useGlobalTimer() {
  return useContext(GlobalTimerContext);
}

export function GlobalTimerProvider({ children }) {
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  
  const timerIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const endTimeRef = useRef(0);
  const totalSecondsRef = useRef(90);
  const isTimerActiveRef = useRef(false);
  const currentExerciseNameRef = useRef('');
  const audioKeepAliveRef = useRef(null);
  const wakeLockRef = useRef(null);
  const originalTitleRef = useRef(document.title || 'Adonis Tracker');

  // Screen WakeLock para mantener pantalla despierta durante el descanso
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      }
    } catch (e) {}
  };

  const releaseWakeLock = () => {
    try {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    } catch (e) {}
  };

  // Iniciar audio silencioso para evitar que el navegador suspenda el video PiP en segundo plano
  const startAudioKeepAlive = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!audioKeepAliveRef.current || audioKeepAliveRef.current.state === 'closed') {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          gain.gain.value = 0.00001; // Inaudible pero mantiene el hilo multimedia activo
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          audioKeepAliveRef.current = ctx;
        } else if (audioKeepAliveRef.current.state === 'suspended') {
          audioKeepAliveRef.current.resume();
        }
      }
    } catch (e) {
      console.warn("Audio keepalive error:", e);
    }
  };

  const stopAudioKeepAlive = () => {
    try {
      if (audioKeepAliveRef.current && audioKeepAliveRef.current.state !== 'closed') {
        audioKeepAliveRef.current.close().catch(() => {});
        audioKeepAliveRef.current = null;
      }
    } catch (e) {}
  };

  // Notificación de sistema
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

  // Función para dibujar en el Canvas con máximo aprovechamiento de espacio y nombre completo
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const active = isTimerActiveRef.current;
    let secondsLeft = 0;
    if (active && endTimeRef.current > 0) {
      secondsLeft = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    }
    const total = totalSecondsRef.current || 1;
    const isFinished = active && secondsLeft === 0;

    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Fondo Minimalista Oscuro
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // 2. Anillo de Fondo
    const radius = 175;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 14;
    ctx.stroke();

    // 3. Anillo de Progreso de Alta Visibilidad
    if (active && secondsLeft > 0) {
      const progress = secondsLeft / total;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * progress));
      
      const neonGradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
      neonGradient.addColorStop(0, '#00f2fe');
      neonGradient.addColorStop(1, '#38bdf8');
      
      ctx.strokeStyle = neonGradient;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    } else if (isFinished) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 14;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 4. Etiqueta Superior
    ctx.fillStyle = isFinished ? '#34d399' : '#38bdf8';
    ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isFinished ? '✓ ¡LISTO!' : 'DESCANSO', centerX, centerY - 95);

    // 5. Contador Digital Gigante Central
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    const timeStr = `${m}:${s.toString().padStart(2, '0')}`;

    ctx.fillStyle = isFinished ? '#10b981' : '#ffffff';
    ctx.font = '900 90px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(timeStr, centerX, centerY - 15);

    // 6. Nombre Completo del Ejercicio con Ajuste de Líneas
    if (currentExerciseNameRef.current) {
      const rawName = currentExerciseNameRef.current;
      ctx.fillStyle = isFinished ? '#34d399' : '#f8fafc';
      ctx.font = '800 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Ajuste automático en 1 o 2 líneas
      const maxWidth = 310;
      const words = rawName.split(' ');
      let line = '';
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      const displayLines = lines.slice(0, 2);
      const startY = displayLines.length === 1 ? centerY + 65 : centerY + 56;
      displayLines.forEach((l, idx) => {
        ctx.fillText(l, centerX, startY + (idx * 22));
      });
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isFinished ? '¡A dar la siguiente serie!' : 'Respira y prepárate', centerX, centerY + 65);
    }

    // Actualizar MediaSession si está soportado
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: isFinished ? '¡Tiempo Listo!' : `Descanso: ${timeStr}`,
          artist: currentExerciseNameRef.current || 'Temporizador Adonis',
          album: 'Descanso'
        });
        navigator.mediaSession.playbackState = active && secondsLeft > 0 ? 'playing' : 'paused';
      } catch (e) {}
    }
  }, []);

  const enterPiP = useCallback(async () => {
    const video = videoRef.current;
    if (video) {
      try {
        await video.play().catch(() => {});
        if (document.pictureInPictureElement !== video && video.requestPictureInPicture) {
          await video.requestPictureInPicture().catch((err) => {
            console.log("PiP request failed:", err);
          });
        }
      } catch (err) {
        console.log("PiP request error:", err);
      }
    }
  }, []);

  const exitPiP = useCallback(async () => {
    if (document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
      } catch (err) {}
    }
  }, []);

  // Inicializar Canvas y Video para PiP
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    canvasRef.current = canvas;

    const video = document.createElement('video');
    if (canvas.captureStream) {
      try {
        video.srcObject = canvas.captureStream(25);
      } catch (e) {}
    }
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autopictureinpicture', '');
    try {
      video.autoPictureInPicture = true;
    } catch (e) {}
    
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
    
    const handleVideoPause = () => {
      if (isTimerActiveRef.current) {
        video.play().catch(() => {});
      }
    };
    video.addEventListener('pause', handleVideoPause);

    videoRef.current = video;

    const handleVisibilityChange = () => {
      if (isTimerActiveRef.current) {
        const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setRestTimerSeconds(remaining);
        drawCanvas();
        if (video) video.play().catch(() => {});

        // Al salir de la app (ocultar), intentar abrir PiP automáticamente
        if (document.hidden) {
          if (document.pictureInPictureElement !== video && video.requestPictureInPicture) {
            video.requestPictureInPicture().catch(() => {});
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      video.removeEventListener('pause', handleVideoPause);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      if (video && video.parentNode) {
        video.parentNode.removeChild(video);
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [drawCanvas]);

  // Tick del temporizador basado en timestamps absolutos
  useEffect(() => {
    if (isTimerActive) {
      const tick = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
        setRestTimerSeconds(remaining);
        drawCanvas();

        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        document.title = `⏱️ [${m}:${s.toString().padStart(2, '0')}] Descanso - Adonis`;

        if (remaining <= 0) {
          setIsTimerActive(false);
          isTimerActiveRef.current = false;
          clearInterval(timerIntervalRef.current);
          stopAudioKeepAlive();
          releaseWakeLock();
          drawCanvas();
          document.title = '⏱️ ¡TIEMPO LISTO! - Adonis Tracker';
          triggerNotification(currentExerciseNameRef.current, totalSecondsRef.current);
          setTimeout(() => {
            document.title = originalTitleRef.current;
          }, 6000);
        }
      };

      timerIntervalRef.current = setInterval(tick, 200);
      tick();
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      stopAudioKeepAlive();
      releaseWakeLock();
      document.title = originalTitleRef.current;
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerActive, drawCanvas, triggerNotification]);

  const startTimer = useCallback((seconds, exerciseName = '') => {
    const duration = (typeof seconds === 'number' && seconds > 0) 
      ? seconds 
      : (selectedDuration > 0 ? selectedDuration : 90);
    
    setSelectedDuration(duration);
    totalSecondsRef.current = duration;
    currentExerciseNameRef.current = exerciseName;
    setCurrentExerciseName(exerciseName);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    
    startAudioKeepAlive();
    requestWakeLock();

    const targetEnd = Date.now() + (duration * 1000);
    endTimeRef.current = targetEnd;
    isTimerActiveRef.current = true;
    
    setRestTimerSeconds(duration);
    setIsTimerActive(true);
    
    drawCanvas();
    enterPiP();
  }, [selectedDuration, drawCanvas, enterPiP]);

  const stopTimer = useCallback(() => {
    setIsTimerActive(false);
    isTimerActiveRef.current = false;
    endTimeRef.current = 0;
    setRestTimerSeconds(0);
    stopAudioKeepAlive();
    releaseWakeLock();
    drawCanvas();
    exitPiP();
  }, [drawCanvas, exitPiP]);

  const setTimerDuration = useCallback((seconds) => {
    const num = parseInt(seconds) || 90;
    setSelectedDuration(num);
    totalSecondsRef.current = num;
    if (isTimerActiveRef.current) {
      endTimeRef.current = Date.now() + (num * 1000);
    }
    setRestTimerSeconds(num);
    drawCanvas();
  }, [drawCanvas]);

  const addSeconds = useCallback((delta) => {
    if (isTimerActiveRef.current) {
      endTimeRef.current = Math.max(Date.now(), endTimeRef.current + (delta * 1000));
      totalSecondsRef.current = Math.max(1, totalSecondsRef.current + delta);
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setRestTimerSeconds(remaining);
      drawCanvas();
    }
  }, [drawCanvas]);

  return (
    <GlobalTimerContext.Provider value={{ 
      restTimerSeconds, 
      selectedDuration,
      isTimerActive, 
      currentExerciseName,
      startTimer, 
      stopTimer, 
      setTimerDuration,
      addSeconds,
      enterPiP
    }}>
      {children}
      
      {/* Botón Flotante Permanente con Soporte PiP y Controles Rápidos */}
      {isTimerActive && (
        <div 
          className="animate-fade"
          style={{
            position: 'fixed',
            bottom: '82px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 24px)',
            maxWidth: '520px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 100%)',
            color: '#38bdf8',
            padding: '10px 14px',
            borderRadius: '24px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45), 0 0 0 1.5px rgba(56, 189, 248, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            zIndex: 1000,
            cursor: 'pointer',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          onClick={enterPiP}
          title="Toca para abrir la ventana flotante (Picture-in-Picture) sobre cualquier app"
        >
          {/* Conteo y Nombre Ejercicio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 auto' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: restTimerSeconds <= 5 ? '#f43f5e' : '#38bdf8',
              boxShadow: restTimerSeconds <= 5 ? '0 0 10px #f43f5e' : '0 0 10px #38bdf8',
              flexShrink: 0
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ 
                fontSize: '10px', 
                color: '#94a3b8', 
                textTransform: 'uppercase', 
                fontWeight: '800', 
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentExerciseName ? currentExerciseName : 'Descanso en progreso'}
              </span>
              <strong style={{ 
                fontSize: '18px', 
                fontWeight: '900', 
                color: restTimerSeconds <= 5 ? '#f43f5e' : '#ffffff', 
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                {Math.floor(restTimerSeconds / 60)}:{String(restTimerSeconds % 60).padStart(2, '0')}
              </strong>
            </div>
          </div>

          {/* Botones de Control Rápido */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Botón -15s */}
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); addSeconds(-15); }}
              title="Restar 15 segundos"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                border: '1px solid rgba(255, 255, 255, 0.15)', 
                borderRadius: '10px', 
                padding: '6px 8px',
                color: '#cbd5e1', 
                fontSize: '11px', 
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              -15s
            </button>

            {/* Botón +30s */}
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); addSeconds(30); }}
              title="Añadir 30 segundos"
              style={{ 
                background: 'rgba(56, 189, 248, 0.2)', 
                border: '1px solid rgba(56, 189, 248, 0.4)', 
                borderRadius: '10px', 
                padding: '6px 9px',
                color: '#38bdf8', 
                fontSize: '11px', 
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              +30s
            </button>

            {/* Botón PiP (Ventana Flotante al salir de la app) */}
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); enterPiP(); }}
              title="📺 Abrir Ventana Flotante (PiP) para ver el temporizador fuera de la app"
              style={{ 
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', 
                border: '1px solid rgba(56, 189, 248, 0.6)', 
                borderRadius: '10px', 
                padding: '6px 10px',
                color: '#ffffff', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                fontSize: '11px', 
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
              }}
            >
              📺 Flotante
            </button>

            {/* Botón Parar */}
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); stopTimer(); }}
              title="Detener temporizador"
              style={{ 
                background: '#ef4444', 
                border: 'none', 
                borderRadius: '50%', 
                width: '30px', 
                height: '30px', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                flexShrink: 0
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
            </button>
          </div>
        </div>
      )}
    </GlobalTimerContext.Provider>
  );
}
