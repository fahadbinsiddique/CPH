import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const APPOINTMENT_STATUS = {
  pending: {
    label: 'Pending',
    chip: 'bg-amber-50 text-amber-700 border-amber-200/60',
    icon: Clock,
    gradient: 'from-amber-50 to-amber-100/40',
    dot: 'bg-amber-500',
    ring: 'bg-amber-400',
  },
  confirmed: {
    label: 'Confirmed',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: CheckCircle2,
    gradient: 'from-emerald-50 to-emerald-100/40',
    dot: 'bg-emerald-500',
    ring: 'bg-emerald-400',
  },
  completed: {
    label: 'Completed',
    chip: 'bg-blue-50 text-blue-700 border-blue-200/60',
    icon: CheckCircle2,
    gradient: 'from-blue-50 to-blue-100/40',
    dot: 'bg-blue-500',
    ring: 'bg-blue-400',
  },
  cancelled: {
    label: 'Cancelled',
    chip: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: XCircle,
    gradient: 'from-slate-50 to-slate-100/40',
    dot: 'bg-slate-300',
    ring: 'bg-slate-200',
  },
};

export const BLOG_STATUS = {
  published: { label: 'Published', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  draft: { label: 'Draft', chip: 'bg-amber-50 text-amber-700 border-amber-200/60' },
};

export function getStatusConfig(key, config = APPOINTMENT_STATUS) {
  return config[key] || config.pending;
}
