import { Clock, CheckCircle2, XCircle } from 'lucide-react';

// Status colours follow design-system/mentalhealthapp/MASTER.md:
// palette hues carry the states (violet = confirmed, wellness green =
// completed, muted = cancelled), amber stays as the "waiting" signal.
// Every chip text clears 4.5:1 on its tint.
export const APPOINTMENT_STATUS = {
  pending: {
    label: 'Pending',
    chip: 'border-amber-200 bg-amber-50 text-amber-800',
    icon: Clock,
    gradient: 'from-amber-50 to-amber-100/40',
    dot: 'bg-amber-500',
    ring: 'bg-amber-400',
  },
  confirmed: {
    label: 'Confirmed',
    chip: 'border-primary/25 bg-primary/10 text-foreground',
    icon: CheckCircle2,
    gradient: 'from-primary/10 to-primary/5',
    dot: 'bg-primary',
    ring: 'bg-primary/50',
  },
  completed: {
    label: 'Completed',
    chip: 'border-accent/30 bg-accent/10 text-accent-soft-foreground',
    icon: CheckCircle2,
    gradient: 'from-accent/10 to-accent/5',
    dot: 'bg-accent',
    ring: 'bg-accent/50',
  },
  cancelled: {
    label: 'Cancelled',
    chip: 'border-border bg-muted text-muted-foreground',
    icon: XCircle,
    gradient: 'from-muted to-muted/50',
    dot: 'bg-muted-foreground',
    ring: 'bg-muted-foreground/40',
  },
};

export const BLOG_STATUS = {
  published: { label: 'Published', chip: 'border-accent/30 bg-accent/10 text-accent-soft-foreground' },
  draft: { label: 'Draft', chip: 'border-amber-200 bg-amber-50 text-amber-800' },
};

export function getStatusConfig(key, config = APPOINTMENT_STATUS) {
  return config[key] || config.pending;
}
