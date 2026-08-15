import React from 'react';
import { Scale, Plus, X } from 'lucide-react';
import { MOMENTS } from './constants';

export default function WeightEntryModal({
  showAddForm,
  setShowAddForm,
  editingEntryId,
  formWeight,
  setFormWeight,
  formUnit,
  setFormUnit,
  formDate,
  setFormDate,
  formTime,
  setFormTime,
  formMoment,
  setFormMoment,
  formComment,
  setFormComment,
  handleSaveWeight,
  resetForm
}) {
  if (!showAddForm) {
    return (
      <button
        type="button"
        onClick={() => setShowAddForm(true)}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '14px',
          borderRadius: '18px',
          fontSize: '14px',
          fontWeight: '900',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 8px 20px rgba(0, 102, 255, 0.3)',
          marginBottom: '20px'
        }}
      >
        <Plus size={18} /> Registrar Nuevo Pesaje
      </button>
    );
  }

  return (
    <div className="card animate-fade" style={{ padding: '18px', borderRadius: '22px', background: '#ffffff', border: '2px solid #0066ff', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0, 102, 255, 0.1)' }}>
      <div className="flex-between" style={{ marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Scale size={18} color="#0066ff" /> {editingEntryId ? 'Editar Pesaje' : 'Nuevo Pesaje'}
        </h3>
        <button type="button" onClick={resetForm} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={16} color="#64748b" />
        </button>
      </div>

      <form onSubmit={handleSaveWeight}>
        {/* INPUT DE PESO Y UNIDAD */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Peso Corporal
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              step="0.01"
              placeholder="ej. 78.5"
              value={formWeight}
              onChange={(e) => setFormWeight(e.target.value)}
              autoFocus
              required
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: '14px',
                border: '1.5px solid #cbd5e1',
                fontSize: '18px',
                fontWeight: '900',
                color: '#0f172a',
                background: '#f8fafc'
              }}
            />
            <select
              value={formUnit}
              onChange={(e) => setFormUnit(e.target.value)}
              style={{
                width: '80px',
                padding: '12px 8px',
                borderRadius: '14px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '900',
                color: '#0f172a',
                background: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        {/* FECHA Y HORA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Fecha
            </label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: '800',
                background: '#f8fafc'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Hora
            </label>
            <input
              type="time"
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: '800',
                background: '#f8fafc'
              }}
            />
          </div>
        </div>

        {/* CHIPS DE MOMENTO DEL DÍA */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Momento del Día
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {MOMENTS.map(m => {
              const isSelected = formMoment === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFormMoment(m.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #0066ff' : '1px solid #cbd5e1',
                    background: isSelected ? '#eff6ff' : '#f8fafc',
                    color: isSelected ? '#0066ff' : '#475569',
                    fontSize: '11px',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* COMENTARIO / ESTADO */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Nota / Estado Fisiológico (Opcional)
          </label>
          <input
            type="text"
            placeholder="ej. Ayuno 14h, post sauna, alta ingesta de sodio anoche..."
            value={formComment}
            onChange={(e) => setFormComment(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: '600',
              background: '#f8fafc'
            }}
          />
        </div>

        {/* BOTONES DE GUARDAR Y CANCELAR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: '12px',
              borderRadius: '14px',
              border: '1.5px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
              color: '#ffffff',
              fontWeight: '900',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)'
            }}
          >
            {editingEntryId ? 'Guardar Cambios' : 'Guardar Pesaje'}
          </button>
        </div>
      </form>
    </div>
  );
}
