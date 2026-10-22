import React from 'react';
import { 
  Database, X, Cloud, Download, FileText, Dumbbell, Calendar, 
  Scale, Upload, Loader2, Sparkles, Layers, AlertOctagon 
} from 'lucide-react';

export default function DataBackupModal({
  isOpen,
  onClose,
  currentUser,
  logout,
  activeDays = [],
  customExercisesMap = {},
  handleExportFullFirebase,
  exportRoutineStructure,
  exportExerciseLibrary,
  exportWorkoutHistory,
  exportBodyMetrics,
  fileInputRef,
  handleImportDatabase,
  isRestoring,
  restoreStatus,
  handleSmartCleanup,
  handleSanitizeHistory,
  onOpenRoutineModal,
  handleWipeAllData
}) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          width: '100%',
          maxWidth: '520px',
          borderRadius: '24px',
          padding: '22px',
          boxShadow: 'var(--shadow-ios)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        <div className="flex-between" style={{ marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Database size={22} color="var(--accent-blue)" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-main)' }}>Centro de Datos & Nube</h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', width: '32px', height: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* SECCIÓN FIREBASE Y CUENTA */}
        <div style={{ background: 'var(--accent-emerald-subtle)', border: '1.5px solid var(--accent-emerald-border)', borderRadius: '18px', padding: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Cloud size={20} color="var(--accent-emerald)" />
            <strong style={{ fontSize: '14px', color: 'var(--accent-emerald)', fontWeight: '900' }}>Firebase Cloud Sincronizado</strong>
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: '1.45', fontWeight: '600' }}>
            Tus bitácoras de entrenamiento, historial de peso y rutinas están protegidas en tiempo real en la nube.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '9px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span className="font-mono-tech" style={{ fontSize: '11.5px', color: 'var(--text-main)', fontWeight: '800' }}>{currentUser?.email || 'Conectado'}</span>
            <button
              type="button"
              onClick={logout}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* BOTÓN MAESTRO DE EXPORTACIÓN TOTAL FIREBASE */}
        <div style={{ marginBottom: '16px' }}>
          <strong style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: '900', display: 'block', marginBottom: '6px' }}>
            💾 Respaldo Maestro de Firebase
          </strong>
          <button 
            type="button"
            onClick={handleExportFullFirebase} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '13px', fontSize: '13.5px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-blue) 0%, #004ecc 100%)', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 16px rgba(0,102,255,0.25)' }}
          >
            <Download size={18} /> Exportar Base de Datos Total (JSON)
          </button>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px', textAlign: 'center' }}>
            Incluye 100% de registros en Firestore: historial, rutinas, ejercicios, peso y configuraciones.
          </span>
        </div>

        {/* SECCIÓN DE DESCARGAS MODULARES ESPECÍFICAS */}
        <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '12px', marginBottom: '16px' }}>
          <strong style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '900', display: 'block', marginBottom: '8px' }}>
            📦 Descargas Modulares Específicas:
          </strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => exportRoutineStructure(activeDays, customExercisesMap)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '9px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={14} color="var(--accent-blue)" /> Rutinas (TXT/JSON)
            </button>

            <button
              type="button"
              onClick={() => exportExerciseLibrary()}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '9px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Dumbbell size={14} color="#a78bfa" /> Catálogo Ejercicios
            </button>

            <button
              type="button"
              onClick={() => exportWorkoutHistory(currentUser)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '9px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Calendar size={14} color="var(--accent-emerald)" /> Historial Sesiones
            </button>

            <button
              type="button"
              onClick={() => exportBodyMetrics(currentUser)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '9px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Scale size={14} color="var(--accent-amber)" /> Historial de Peso
            </button>
          </div>
        </div>

        {/* RESTAURACIÓN DE RESPALDO */}
        <div style={{ marginBottom: '16px' }}>
          <input type="file" ref={fileInputRef} onChange={handleImportDatabase} style={{ display: 'none' }} accept=".json" />
          <button 
            type="button"
            disabled={isRestoring}
            onClick={() => fileInputRef.current?.click()} 
            style={{ width: '100%', padding: '13px', fontSize: '12.5px', borderRadius: '14px', fontWeight: '800', background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
          >
            {isRestoring ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} color="var(--accent-blue)" />}
            {isRestoring ? (restoreStatus || 'Restaurando en Firebase...') : 'Restaurar Respaldo Maestro JSON'}
          </button>
        </div>

        {/* Mantenimiento */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={handleSmartCleanup}
            style={{ flex: 1, padding: '9px', fontSize: '11px', borderRadius: '10px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            <Sparkles size={13} /> Limpieza Borradores
          </button>
          <button
            type="button"
            onClick={onOpenRoutineModal}
            style={{ flex: 1, padding: '9px', fontSize: '11px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', border: '1px solid #8b5cf6', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            <Layers size={13} /> Gestor Rutina
          </button>
        </div>

        {/* Sanitizar Registros Atípicos de Firebase */}
        <div style={{ marginBottom: '14px' }}>
          <button
            type="button"
            onClick={handleSanitizeHistory}
            style={{ width: '100%', padding: '9px', fontSize: '10.5px', borderRadius: '10px', background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald-border)', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            🩺 Sanitizar Historial (Corregir anomalías y pruebas)
          </button>
        </div>

        {/* Zona de Peligro */}
        <div style={{ background: 'var(--accent-danger-light)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={handleWipeAllData} 
            style={{ background: 'var(--accent-red)', color: '#ffffff', border: 'none', padding: '9px 12px', borderRadius: '10px', fontSize: '11.5px', fontWeight: '800', width: '100%', cursor: 'pointer' }}
          >
            <AlertOctagon size={13} style={{ display: 'inline', marginRight: '4px' }} /> Resetear Laboratorio a Cero
          </button>
        </div>

        <button type="button" onClick={onClose} style={{ width: '100%', padding: '11px', marginTop: '14px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontWeight: '800', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12.5px' }}>
          Volver al Laboratorio
        </button>
      </div>
    </div>
  );
}
