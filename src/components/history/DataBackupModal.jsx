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
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
          background: '#ffffff',
          width: '100%',
          maxWidth: '520px',
          borderRadius: '26px',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        <div className="flex-between" style={{ marginBottom: '18px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Database size={24} color="#0066ff" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>Centro de Datos & Nube</h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} color="#475569" />
          </button>
        </div>

        {/* SECCIÓN FIREBASE Y CUENTA */}
        <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderRadius: '20px', padding: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Cloud size={22} color="#059669" />
            <strong style={{ fontSize: '15px', color: '#065f46', fontWeight: '900' }}>Firebase Cloud Sincronizado</strong>
          </div>
          <p style={{ fontSize: '12px', color: '#047857', margin: '0 0 12px 0', lineHeight: '1.5', fontWeight: '600' }}>
            Tus bitácoras de entrenamiento, historial de peso y rutinas están protegidas en tiempo real en la nube.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '10px 14px', borderRadius: '14px', border: '1px solid #a7f3d0' }}>
            <span style={{ fontSize: '12px', color: '#065f46', fontWeight: '800' }}>{currentUser?.email || 'Conectado'}</span>
            <button
              type="button"
              onClick={logout}
              style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* BOTÓN MAESTRO DE EXPORTACIÓN TOTAL FIREBASE */}
        <div style={{ marginBottom: '18px' }}>
          <strong style={{ fontSize: '13px', color: '#0f172a', fontWeight: '900', display: 'block', marginBottom: '6px' }}>
            💾 Respaldo Maestro de Firebase
          </strong>
          <button 
            type="button"
            onClick={handleExportFullFirebase} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '14px', borderRadius: '16px', background: 'linear-gradient(135deg, #0066ff 0%, #004ecc 100%)', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 16px rgba(0,102,255,0.3)' }}
          >
            <Download size={18} /> Exportar Base de Datos Total (JSON)
          </button>
          <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '4px', textAlign: 'center' }}>
            Incluye 100% de registros en Firestore: historial, rutinas, ejercicios, peso y configuraciones.
          </span>
        </div>

        {/* SECCIÓN DE DESCARGAS MODULARES ESPECÍFICAS */}
        <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '14px', marginBottom: '18px' }}>
          <strong style={{ fontSize: '12px', color: '#334155', fontWeight: '900', display: 'block', marginBottom: '10px' }}>
            📦 Descargas Modulares Específicas:
          </strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => exportRoutineStructure(activeDays, customExercisesMap)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={14} color="#0066ff" /> Rutinas (TXT & JSON)
            </button>

            <button
              type="button"
              onClick={() => exportExerciseLibrary()}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Dumbbell size={14} color="#7c3aed" /> Catálogo Ejercicios
            </button>

            <button
              type="button"
              onClick={() => exportWorkoutHistory(currentUser)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Calendar size={14} color="#059669" /> Historial Sesiones
            </button>

            <button
              type="button"
              onClick={() => exportBodyMetrics(currentUser)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Scale size={14} color="#d97706" /> Historial de Peso
            </button>
          </div>
        </div>

        {/* RESTAURACIÓN DE RESPALDO */}
        <div style={{ marginBottom: '18px' }}>
          <input type="file" ref={fileInputRef} onChange={handleImportDatabase} style={{ display: 'none' }} accept=".json" />
          <button 
            type="button"
            disabled={isRestoring}
            onClick={() => fileInputRef.current?.click()} 
            style={{ width: '100%', padding: '14px', fontSize: '13px', borderRadius: '16px', fontWeight: '800', background: '#f1f5f9', color: '#0f172a', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
          >
            {isRestoring ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} color="#0066ff" />}
            {isRestoring ? (restoreStatus || 'Restaurando en Firebase...') : 'Restaurar Respaldo Maestro JSON'}
          </button>
        </div>

        {/* Mantenimiento */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={handleSmartCleanup}
            style={{ flex: 1, padding: '10px', fontSize: '11px', borderRadius: '12px', background: '#eff6ff', color: '#0066ff', border: '1px solid #bfdbfe', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            <Sparkles size={14} /> Limpieza
          </button>
          <button
            type="button"
            onClick={onOpenRoutineModal}
            style={{ flex: 1, padding: '10px', fontSize: '11px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            <Layers size={14} /> Gestor Rutina
          </button>
        </div>

        {/* Zona de Peligro */}
        <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={handleWipeAllData} 
            style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', width: '100%', cursor: 'pointer' }}
          >
            <AlertOctagon size={14} style={{ display: 'inline', marginRight: '4px' }} /> Resetear Laboratorio a Cero
          </button>
        </div>

        <button type="button" onClick={onClose} style={{ width: '100%', padding: '12px', marginTop: '16px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '14px', fontWeight: '800', color: '#64748b', cursor: 'pointer' }}>
          Volver al Laboratorio
        </button>
      </div>
    </div>
  );
}
