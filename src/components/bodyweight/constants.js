import { Sun, Moon, Dumbbell, Coffee, Scale } from 'lucide-react';

export const TIME_FRAMES = [
  { id: 'day', label: 'Hoy (Día)', days: 1 },
  { id: '1w', label: '1 Sem', days: 7 },
  { id: '2w', label: '2 Sem', days: 14 },
  { id: '1m', label: '1 Mes', days: 30 },
  { id: '3m', label: '3 Meses', days: 90 },
  { id: '1y', label: '1 Año', days: 365 },
  { id: 'all', label: 'Todo', days: 9999 }
];

export const MOMENTS = [
  { id: 'ayunas', label: '🌅 Ayunas (Mañana)', icon: Sun, color: '#f59e0b', isStandard: true },
  { id: 'pre_entreno', label: '⚡ Pre-Entreno', icon: Coffee, color: '#3b82f6', isStandard: false },
  { id: 'post_entreno', label: '🏋️ Post-Entreno', icon: Dumbbell, color: '#10b981', isStandard: false },
  { id: 'noche', label: '🌙 Noche', icon: Moon, color: '#6366f1', isStandard: false },
  { id: 'general', label: '📌 General', icon: Scale, color: '#64748b', isStandard: false }
];
