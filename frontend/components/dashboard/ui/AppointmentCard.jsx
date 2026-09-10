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

  // Use teal for online, teal-700 for in-person (consistent accent)
  const sessionIcon = appointment.session_type === 'online' ? Video : MapPin;
  const sessionColor = appointment.session_type === 'online' ? 'text-teal-500' : 'text-teal-700';
  const sessionLabel = appointment.session_type === 'online' ? 'Video Session' : 'In-Person';

  return (
    <motion.div variants={cardVariants} layout>
      <Card variant="raised" className="group relative overflow-hidden">
        <div className="dash-accent" />
        <CardContent className="p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <UserAvatar
                  name={displayName}
                  size="lg"
                  className="h-14 w-14 rounded-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  className={cn(
                    'absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm',
                    config.dot
                  )}
                />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-stone-800 transition-colors group-hover:text-teal-600">
                  {displayName}
                </h4>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-medium text-stone-400">
                  <span className="flex items-center gap-1 rounded-lg bg-stone-50/80 px-2 py-0.5">
                    <Calendar className="h-3 w-3 text-teal-500" />
                    {formatDate(date)}
                  </span>
                  <span className="hidden text-stone-200 sm:inline">•</span>
                  <span className="flex items-center gap-1 rounded-lg bg-stone-50/80 px-2 py-0.5">
                    <Clock className="h-3 w-3 text-teal-500" />
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
              'mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100/80 pt-3',
              footerClassName
            )}
          >
            <div className="flex items-center gap-3 text-xs text-stone-500">
              {showSessionType && (
                <span className="flex items-center gap-1">
                  <sessionIcon className={`h-3.5 w-3.5 ${sessionColor}`} />
                  {sessionLabel}
                </span>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}