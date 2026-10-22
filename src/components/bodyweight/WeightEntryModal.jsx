import React from 'react';
import { Scale, Plus, X, Sparkles, ChevronDown, ChevronUp, Flame, Dumbbell } from 'lucide-react';
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
  formFatPct = '',
  setFormFatPct,
  formMusclePct = '',
  setFormMusclePct,
  formWaistCm = '',
  setFormWaistCm,
  formShouldersCm = '',
  setFormShouldersCm,
  onOpenScaleModal,
  handleSaveWeight,
  resetForm
}) {
  const [showScaleFields, setShowScaleFields] = React.useState(false);
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
    <div className="card animate-fade" style={{ padding: '16px', borderRadius: '22px', background: 'var(--bg-surface)', border: '1.5px solid var(--accent-blue)', marginBottom: '16px', boxShadow: 'var(--shadow-ios)' }}>
      <div className="flex-between" style={{ marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Scale size={18} color="var(--accent-blue)" /> {editingEntryId ? 'Editar Pesaje' : 'Nuevo Pesaje'}
        </h3>
        <button type="button" onClick={resetForm} style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={16} color="var(--text-secondary)" />
        </button>
      </div>

      <form onSubmit={handleSaveWeight}>
        {/* INPUT DE PESO Y UNIDAD */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
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
              className="font-mono-tech"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid var(--accent-blue)',
                fontSize: '18px',
                fontWeight: '900',
                color: 'var(--text-main)',
                background: 'var(--bg-card)'
              }}
            />
            <select
              value={formUnit}
              onChange={(e) => setFormUnit(e.target.value)}
              className="font-mono-tech"
              style={{
                width: '80px',
                padding: '10px 8px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-subtle)',
                fontSize: '13px',
                fontWeight: '900',
                color: 'var(--text-main)',
                background: 'var(--bg-card)',
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
            <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Fecha
            </label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
              className="font-mono-tech"
              style={{
                width: '100%',
                padding: '9px 10px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-subtle)',
                fontSize: '12.5px',
                fontWeight: '800',
                color: 'var(--text-main)',
                background: 'var(--bg-card)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Hora
            </label>
            <input
              type="time"
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              required
              className="font-mono-tech"
              style={{
                width: '100%',
                padding: '9px 10px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-subtle)',
                fontSize: '12.5px',
                fontWeight: '800',
                color: 'var(--text-main)',
                background: 'var(--bg-card)'
              }}
            />
          </div>
        </div>

        {/* CHIPS DE MOMENTO DEL DÍA */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
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
                    padding: '7px 11px',
                    borderRadius: '10px',
                    border: isSelected ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--accent-blue-light)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN DESPLEGABLE DE BIOIMPEDANCIA & MEDIDAS (OPCIONAL) */}
        <div style={{ marginBottom: '14px', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-surface-secondary)' }}>
          <button
            type="button"
            onClick={() => setShowScaleFields(prev => !prev)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '11.5px',
              color: 'var(--text-main)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--accent-blue)" />
              <span>Datos de Báscula (% Grasa, % Músculo, Medidas)</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'normal' }}>[Opcional]</span>
            </span>
            {showScaleFields || formFatPct || formMusclePct ? (
              <ChevronUp size={15} color="var(--text-muted)" />
            ) : (
              <ChevronDown size={15} color="var(--text-muted)" />
            )}
          </button>

          {(showScaleFields || formFatPct || formMusclePct || formWaistCm || formShouldersCm) && (
            <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <Flame size={12} color="#f97316" /> % Grasa Corporal
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 18.2"
                    value={formFatPct}
                    onChange={(e) => setFormFatPct && setFormFatPct(e.target.value)}
                    className="font-mono-tech"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      color: 'var(--text-main)',
                      background: 'var(--bg-surface)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <Dumbbell size={12} color="var(--accent-blue)" /> % Músculo Esquelético
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 42.5"
                    value={formMusclePct}
                    onChange={(e) => setFormMusclePct && setFormMusclePct(e.target.value)}
                    className="font-mono-tech"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      color: 'var(--text-main)',
                      background: 'var(--bg-surface)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    📏 Cintura (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ej. 82"
                    value={formWaistCm}
                    onChange={(e) => setFormWaistCm && setFormWaistCm(e.target.value)}
                    className="font-mono-tech"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      color: 'var(--text-main)',
                      background: 'var(--bg-surface)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    📐 Hombros (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ej. 122"
                    value={formShouldersCm}
                    onChange={(e) => setFormShouldersCm && setFormShouldersCm(e.target.value)}
                    className="font-mono-tech"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      color: 'var(--text-main)',
                      background: 'var(--bg-surface)'
                    }}
                  />
                </div>
              </div>

              {onOpenScaleModal && (
                <button
                  type="button"
                  onClick={onOpenScaleModal}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px dashed var(--accent-blue)',
                    background: 'var(--accent-blue-light)',
                    color: 'var(--accent-blue)',
                    fontSize: '11px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Scale size={13} /> Abrir Báscula Completa (18 Parámetros)
                </button>
              )}
            </div>
          )}
        </div>

        {/* COMENTARIO / ESTADO */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Nota / Estado Fisiológico (Opcional)
          </label>
          <input
            type="text"
            placeholder="ej. Ayuno 14h, post sauna, alta ingesta de sodio anoche..."
            value={formComment}
            onChange={(e) => setFormComment(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              border: '1.5px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '600',
              color: 'var(--text-main)',
              background: 'var(--bg-card)'
            }}
          />
        </div>

        {/* BOTONES DE GUARDAR Y CANCELAR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: '11px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-secondary)',
              color: 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: '11px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--accent-blue) 0%, #0052cc 100%)',
              color: '#ffffff',
              fontWeight: '900',
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)'
            }}
          >
            {editingEntryId ? 'Guardar Cambios' : 'Guardar Pesaje'}
          </button>
        </div>
      </form>
    </div>
  );
}
