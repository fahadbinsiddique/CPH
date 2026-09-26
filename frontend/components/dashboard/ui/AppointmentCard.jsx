'use client';

import { Calendar, Clock, Video, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import UserAvatar from '@/components/ui/user-avatar';
import { getStatusConfig } from '@/lib/status';
import { cardVariants } from '@/lib/motion';
import StatusBadge from './StatusBadge';

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AppointmentCard({
  appointment,
  personKey = 'consultant',
  actions,
  statusConfig,
  showSessionType = true,
  footerClassName,
}) {
  const config = getStatusConfig(appointment.status, statusConfig);
  const person = appointment[personKey] || {};
  const displayName =
    person?.user?.full_name || person?.full_name || person?.user?.email || 'Unknown';
  const date = new Date(appointment.appointment_date);

  // Accent green for video sessions, primary violet for in-person (design system tokens)
  const sessionIcon = appointment.session_type === 'online' ? Video : MapPin;
  const sessionColor = appointment.session_type === 'online' ? 'text-accent' : 'text-primary';
  const sessionLabel = appointment.session_type === 'online' ? 'Video Session' : 'In-Person';

  return (
    <motion.div variants={cardVariants} layout>
      <Card variant="raised" className="group relative overflow-hidden">
        <div className="dash-accent" />
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <UserAvatar
                  name={displayName}
                  size="lg"
                  className="h-12 w-12 shrink-0 rounded-xl transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
                />
                <span
                  className={cn(
                    'absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm',
                    config.dot
                  )}
                />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {displayName}
                </h4>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1 rounded-lg bg-muted px-2 py-0.5">
                    <Calendar className="h-3 w-3 text-primary" />
                    {formatDate(date)}
                  </span>
                  <span className="hidden text-border sm:inline">•</span>
                  <span className="flex items-center gap-1 rounded-lg bg-muted px-2 py-0.5">
                    <Clock className="h-3 w-3 text-primary" />
                    {appointment.appointment_time}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
              <StatusBadge status={appointment.status} config={statusConfig} />
            </div>
          </div>

          <div
            className={cn(
              'mt-3 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2',
              footerClassName
            )}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {showSessionType && (
                <span className="flex items-center gap-1">
                  <sessionIcon className={`h-3.5 w-3.5 ${sessionColor}`} />
                  {sessionLabel}
                </span>
              )}
            </div>
            {actions && <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">{actions}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}