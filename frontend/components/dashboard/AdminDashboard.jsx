'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  BookOpen,
  Shield,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  Heart,
  ChevronRight,
  BarChart3,
  Activity,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/dashboard/ui/StatCard';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import WellnessTip from '@/components/dashboard/ui/WellnessTip';
import { containerVariants, itemVariants, statVariants } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function QuickActionCard({ href, label, icon: Icon, iconClassName, description }) {
  const reduceMotion = useReducedMotion();
  
  return (
    <Link href={href} className="group block cursor-pointer" aria-label={label}>
      <motion.div
        whileHover={reduceMotion ? {} : { y: -4 }}
        className="dash-card dash-card-hover relative overflow-hidden p-4 sm:p-5"
      >
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-neu-inset transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12',
              iconClassName
            )}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{label}</p>
            {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="flex h-8 w-8 translate-x-2 items-center justify-center rounded-full border border-border bg-muted opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">
            <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function StatusBreakdown({ stats }) {
  const reduceMotion = useReducedMotion();
  const total = stats?.total_appointments || 0;
  const rows = [
    { label: 'Pending', value: stats?.pending_appointments || 0, bar: 'bg-secondary' },
    { label: 'Confirmed', value: stats?.confirmed_appointments || 0, bar: 'bg-primary' },
    { label: 'Completed', value: stats?.completed_appointments || 0, bar: 'bg-accent' },
    { label: 'Cancelled', value: stats?.cancelled_appointments || 0, bar: 'bg-muted-foreground/40' },
  ];

  const itemProps = reduceMotion ? {} : { variants: itemVariants };

  return (
    <motion.div {...itemProps}>
      <Card className="dash-card relative h-full overflow-hidden p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Session Status</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Live breakdown of all bookings</p>
        </div>
        <div className="space-y-4" role="list" aria-label="Appointment status breakdown">
          {rows.map((row) => {
            const pct = total > 0 ? Math.round((row.value / total) * 100) : 0;
            return (
              <div key={row.label} role="listitem">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{row.label}</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {row.value} · {pct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${row.label}: ${pct}%`}>
                  <div
                    className={cn('h-full rounded-full transition-all duration-1000', row.bar)}
                    style={{ width: `${pct}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 rounded-xl border border-border bg-muted p-3 text-center">
          <p className="font-heading text-2xl font-semibold tracking-tight text-foreground" aria-live="polite">{total}</p>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Total bookings</p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard({ stats }) {
  const reduceMotion = useReducedMotion();
  
  if (!stats) {
    return (
      <motion.div
        initial={reduceMotion ? {} : { opacity: 0, scale: 0.95 }}
        animate={reduceMotion ? {} : { opacity: 1, scale: 1 }}
        className="flex min-h-[200px] items-center justify-center sm:min-h-[300px] lg:min-h-[400px]"
        role="alert"
        aria-live="assertive"
      >
        <Card className="max-w-md rounded-xl border-destructive/20 bg-destructive/5 shadow-neu">
          <CardContent className="space-y-4 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10" aria-hidden="true">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Connection Error</h3>
              <p className="mt-1 text-sm text-muted-foreground">Failed to load dashboard data</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.total_users,
      iconClassName: 'bg-primary/10 text-primary',
      href: '/dashboard/users',
      description: 'Active accounts',
    },
    {
      icon: Shield,
      label: 'Consultants',
      value: stats?.total_consultants,
      iconClassName: 'bg-secondary/50 text-foreground',
      href: '/dashboard/consultants',
      description: 'Total experts',
    },
    {
      icon: UserCheck,
      label: 'Verified Experts',
      value: stats?.verified_consultants,
      iconClassName: 'bg-accent/10 text-accent',
      href: '/dashboard/consultants',
      description: 'Approved',
    },
    {
      icon: Calendar,
      label: 'Total Bookings',
      value: stats?.total_appointments,
      iconClassName: 'bg-muted text-muted-foreground',
      href: '/dashboard/appointments',
      description: 'All time',
    },
    {
      icon: Clock,
      label: 'Pending Slots',
      value: stats?.pending_appointments,
      iconClassName: 'bg-primary/15 text-primary',
      href: '/dashboard/appointments?tab=pending',
      description: 'Action needed',
    },
    {
      icon: CheckCircle2,
      label: 'Completed Sessions',
      value: stats?.completed_appointments,
      iconClassName: 'bg-accent/10 text-accent',
      href: '/dashboard/appointments?tab=completed',
      description: 'Done',
    },
  ];

  const quickActions = [
    {
      href: '/dashboard/users',
      label: 'User Management',
      icon: Users,
      iconClassName: 'bg-primary/10 text-primary',
      description: 'View & manage all users',
    },
    {
      href: '/dashboard/consultants?tab=pending',
      label: 'Verify Experts',
      icon: Shield,
      iconClassName: 'bg-secondary/50 text-foreground',
      description: 'Approve consultants',
    },
    {
      href: '/dashboard/blogs',
      label: 'Blog Management',
      icon: BookOpen,
      iconClassName: 'bg-muted text-muted-foreground',
      description: 'Create & edit articles',
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytics',
      icon: BarChart3,
      iconClassName: 'bg-accent/10 text-accent',
      description: 'View platform insights',
    },
  ];

  const motionProps = reduceMotion ? {} : { variants: containerVariants, initial: "hidden", animate: "show" };
  const itemProps = reduceMotion ? {} : { variants: itemVariants };

  return (
    <motion.div {...motionProps} className="space-y-6 sm:space-y-8" role="region" aria-label="Admin dashboard">
      {/* Stats Grid */}
      <section aria-labelledby="admin-stats-heading" className="space-y-4">
        <h2 id="admin-stats-heading" className="sr-only">Platform Statistics</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3" role="list">
          {statCards.map((card, idx) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      {/* Status breakdown + Quick actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <StatusBreakdown stats={stats} />
        </div>

        <div className="space-y-4 xl:col-span-3">
          <section {...itemProps} aria-labelledby="quick-actions-heading" className="space-y-4">
            <div>
              <h2 id="quick-actions-heading" className="font-heading flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
                Quick Actions
                <Badge variant="outline" className="border-border text-[10px] font-normal text-muted-foreground" aria-label={`${quickActions.length} modules`}>
                  {quickActions.length} modules
                </Badge>
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Direct access to frequently used administrative modules.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" role="list" aria-label="Quick action modules">
              {quickActions.map((action, idx) => (
                <QuickActionCard key={action.label} {...action} />
              ))}
            </div>
          </section>

          <motion.div {...itemProps}>
            <WellnessTip
              icon={Heart}
              title="System Health"
              message={`All systems operational. ${stats?.total_users || 0} active users, ${stats?.total_consultants || 0} consultants, and ${stats?.total_appointments || 0} total bookings.`}
              badgeLabel={
                <span className="inline-flex items-center gap-1 text-accent-soft-foreground" aria-label="System healthy">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  Healthy
                </span>
              }
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}