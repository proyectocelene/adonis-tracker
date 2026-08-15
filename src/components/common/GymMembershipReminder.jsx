import React, { useState } from 'react';
import { useIndexedDB as useLocalStorage } from '../../hooks/useIndexedDB';
import { Calendar, AlertCircle, CheckCircle2, Clock, DollarSign, Settings2, Bell, Check, ChevronRight } from 'lucide-react';
import { useModal } from './UIComponents';

export default function GymMembershipReminder({ compact = false }) {
  const modal = useModal();
  const [membershipSettings, setMembershipSettings] = useLocalStorage('coachv2_gym_membership_settings', {
    paymentDay: 21,
    gymName: 'Gimnasio',
    amount: '',
    currency: '$',
    reminderDaysBefore: 5,
    paidMonths: [] // Array de "YYYY-MM"
  });

  // Si tiene el valor predeterminado anterior (28), actualizar a 21 (21 de agosto)
  const paymentDay = (membershipSettings.paymentDay === 28 || !membershipSettings.paymentDay) 
    ? 21 
    : membershipSettings.paymentDay;

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempDay, setTempDay] = useState(paymentDay);
  const [tempGymName, setTempGymName] = useState(membershipSettings.gymName || 'Gimnasio');
  const [tempAmount, setTempAmount] = useState(membershipSettings.amount || '');

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0 a 11
  const currentDay = today.getDate();

  const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  
  // Calcular próximo día de pago
  let targetPaymentDate = new Date(currentYear, currentMonth, paymentDay);
  let isOverdue = false;

  if (currentDay > paymentDay) {
    const isCurrentPaid = (membershipSettings.paidMonths || []).includes(currentMonthKey);
    if (isCurrentPaid) {
      // Siguiente mes
      targetPaymentDate = new Date(currentYear, currentMonth + 1, paymentDay);
    } else {
      isOverdue = true;
    }
  }

  const targetMonthKey = `${targetPaymentDate.getFullYear()}-${String(targetPaymentDate.getMonth() + 1).padStart(2, '0')}`;
  const isTargetPaid = (membershipSettings.paidMonths || []).includes(isOverdue ? currentMonthKey : targetMonthKey);

  // Diferencia en días
  const diffTime = targetPaymentDate.getTime() - today.setHours(0,0,0,0);
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const targetDateFormatted = `${paymentDay} de ${monthNames[targetPaymentDate.getMonth()]}`;

  const handleTogglePaid = () => {
    const keyToToggle = isOverdue ? currentMonthKey : targetMonthKey;
    const paidList = membershipSettings.paidMonths || [];
    const isPaid = paidList.includes(keyToToggle);

    let updatedList;
    if (isPaid) {
      updatedList = paidList.filter(k => k !== keyToToggle);
    } else {
      updatedList = [...paidList, keyToToggle];
    }

    setMembershipSettings(prev => ({
      ...prev,
      paidMonths: updatedList
    }));

    modal.showAlert({
      title: isPaid ? "Pago Desmarcado" : "✅ Membresía Registrada",
      message: isPaid 
        ? `Se desmarcó el pago del ciclo ${keyToToggle}.` 
        : `¡Listo! Membresía de ${monthNames[targetPaymentDate.getMonth()]} registrada como pagada.`,
      variant: isPaid ? "warning" : "success"
    });
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const day = parseInt(tempDay);
    if (isNaN(day) || day < 1 || day > 31) {
      modal.showAlert({ title: "Día inválido", message: "Ingresa un día entre 1 y 31.", variant: "warning" });
      return;
    }

    setMembershipSettings(prev => ({
      ...prev,
      paymentDay: day,
      gymName: tempGymName.trim() || 'Gimnasio',
      amount: tempAmount
    }));

    setShowConfigModal(false);
    modal.showAlert({ title: "✅ Configuración Guardada", message: `Recordatorio ajustado para el día ${day} de cada mes.`, variant: "success" });
  };

  // Determinar tema visual y mensaje
  let statusBadge = {
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#1d4ed8',
    icon: <Calendar size={18} color="#0066ff" />,
    title: `Próximo Pago: ${targetDateFormatted}`,
    subtitle: isTargetPaid ? `✅ Ciclo pagado` : `Faltan ${daysRemaining} días para tu corte`
  };

  if (isTargetPaid) {
    statusBadge = {
      bg: '#ecfdf5',
      border: '#a7f3d0',
      color: '#047857',
      icon: <CheckCircle2 size={18} color="#059669" />,
      title: `Membresía al Día (${targetDateFormatted})`,
      subtitle: `✅ Ya pagaste este ciclo. Próximo recordatorio el siguiente mes.`
    };
  } else if (isOverdue) {
    statusBadge = {
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#b91c1c',
      icon: <AlertCircle size={18} color="#dc2626" />,
      title: `🚨 Pago Pendiente (${paymentDay} de ${monthNames[currentMonth]})`,
      subtitle: `Pasó el día ${paymentDay} y no has marcado el pago de este mes.`
    };
  } else if (daysRemaining === 0) {
    statusBadge = {
      bg: '#fff1f2',
      border: '#f43f5e',
      color: '#e11d48',
      icon: <Bell size={18} color="#e11d48" />,
      title: `🚨 ¡HOY ES DÍA ${paymentDay}! Toca pagar el Gym`,
      subtitle: `Recuerda realizar tu pago de membresía hoy para no perder acceso.`
    };
  } else if (daysRemaining <= (membershipSettings.reminderDaysBefore || 5)) {
    statusBadge = {
      bg: '#fffbeb',
      border: '#fde68a',
      color: '#b45309',
      icon: <Clock size={18} color="#d97706" />,
      title: `⚠️ Pago Próximo en ${daysRemaining} días (${targetDateFormatted})`,
      subtitle: `Prepara tu pago de membresía para el día ${paymentDay}.`
    };
  }

  // Versión compacta para headers o banners
  if (compact) {
    return (
      <div 
        className="animate-fade"
        style={{
          background: statusBadge.bg,
          border: `1.5px solid ${statusBadge.border}`,
          padding: '10px 14px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {statusBadge.icon}
          <div>
            <strong style={{ fontSize: '12px', color: statusBadge.color, display: 'block' }}>
              {statusBadge.title}
            </strong>
            <span style={{ fontSize: '11px', color: statusBadge.color, opacity: 0.85, fontWeight: '600' }}>
              {statusBadge.subtitle}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleTogglePaid}
            style={{
              background: isTargetPaid ? '#059669' : '#0066ff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isTargetPaid ? <Check size={14} /> : <DollarSign size={14} />}
            {isTargetPaid ? 'Pagado' : 'Marcar Pago'}
          </button>
        </div>
      </div>
    );
  }

  // Versión completa en tarjeta
  return (
    <div 
      className="card animate-fade"
      style={{
        padding: '18px',
        borderRadius: '22px',
        background: statusBadge.bg,
        border: `1.5px solid ${statusBadge.border}`,
        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        marginBottom: '20px'
      }}
    >
      <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {statusBadge.icon}
          </div>
          <div>
            <span style={{ fontSize: '11px', color: statusBadge.color, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              💳 Recordatorio de Membresía • {membershipSettings.gymName || 'Gym'}
            </span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>
              {statusBadge.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowConfigModal(true)}
          title="Ajustar fecha de pago"
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: `1px solid ${statusBadge.border}`,
            borderRadius: '10px',
            padding: '6px',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <Settings2 size={16} />
        </button>
      </div>

      <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: statusBadge.color, fontWeight: '600', lineHeight: '1.4' }}>
        {statusBadge.subtitle}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleTogglePaid}
          style={{
            flex: 1,
            background: isTargetPaid ? '#059669' : '#0066ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '12px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: isTargetPaid ? '0 4px 12px rgba(5,150,105,0.25)' : '0 4px 12px rgba(0,102,255,0.25)'
          }}
        >
          {isTargetPaid ? <CheckCircle2 size={16} /> : <DollarSign size={16} />}
          {isTargetPaid ? `✅ Pago de ${monthNames[targetPaymentDate.getMonth()]} Confirmado` : `Marcar como Pagado (${targetDateFormatted})`}
        </button>
      </div>

      {/* MODAL DE CONFIGURACIÓN DE MEMBRESÍA */}
      {showConfigModal && (
        <div 
          className="animate-fade"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 9999
          }}
        >
          <div className="card animate-scale-up" style={{ width: '100%', maxWidth: '400px', padding: '22px', background: '#ffffff', borderRadius: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="#0066ff" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
                  Configurar Membresía
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowConfigModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                  Día de cobro del mes (1 al 31)
                </label>
                <input 
                  type="number"
                  min="1"
                  max="31"
                  value={tempDay}
                  onChange={e => setTempDay(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '15px', fontWeight: '800' }}
                  required
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Configurado actualmente para el día {paymentDay} de cada mes.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                  Nombre del Gimnasio
                </label>
                <input 
                  type="text"
                  value={tempGymName}
                  onChange={e => setTempGymName(e.target.value)}
                  placeholder="Ej. Smart Fit / Gimnasio Local"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: '700' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                  Monto mensual (opcional)
                </label>
                <input 
                  type="text"
                  value={tempAmount}
                  onChange={e => setTempAmount(e.target.value)}
                  placeholder="Ej. $600"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: '700' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '12px', borderRadius: '14px' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', borderRadius: '14px', fontWeight: '900' }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
