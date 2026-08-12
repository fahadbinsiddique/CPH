'use client';

import { useEffect, useState } from 'react';
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
import api from '@/lib/api';
import { containerVariants, itemVariants, statVariants } from '@/lib/motion';
import { cn } from '@/lib/utils';

function QuickActionCard({ href, label, icon: Icon, color, description }) {
  return (
    <Link href={href} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        className="dash-card dash-card-hover relative overflow-hidden p-5"
      >
        <div className="relative flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110',
              `bg-gradient-to-br from-${color}-100 to-${color}-50 text-${color}-600`
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-teal-600">{label}</p>
            {description && <p className="truncate text-xs text-slate-400">{description}</p>}
          </div>
          <div className="flex h-8 w-8 translate-x-2 items-center justify-center rounded-full border border-slate-100 bg-slate-50 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRight className="h-3.5 w-3.5 text-teal-600" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function StatusBreakdown({ stats }) {
  const total = stats?.total_appointments || 0;
  const rows = [
    { label: 'Pending', value: stats?.pending_appointments || 0, bar: 'bg-amber-400' },
    { label: 'Confirmed', value: stats?.confirmed_appointments || 0, bar: 'bg-emerald-500' },
    { label: 'Completed', value: stats?.completed_appointments || 0, bar: 'bg-blue-500' },
    { label: 'Cancelled', value: stats?.cancelled_appointments || 0, bar: 'bg-slate-300' },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card className="dash-card relative h-full overflow-hidden p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Session Status</h2>
          <p className="mt-0.5 text-sm text-slate-500">Live breakdown of all bookings</p>
        </div>
        <div className="space-y-4">
          {rows.map((row) => {
            const pct = total > 0 ? Math.round((row.value / total) * 100) : 0;
            return (
              <div key={row.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{row.label}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {row.value} · {pct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn('h-full rounded-full transition-all duration-1000', row.bar)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 text-center">
          <p className="text-2xl font-bold tracking-tight text-slate-900">{total}</p>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total bookings</p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/api/appointments/admin/stats/')
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch dashboard data. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading system insights..." />;

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[400px] items-center justify-center"
      >
        <Card className="max-w-md rounded-2xl border-red-100 bg-red-50/50 shadow-sm">
          <CardContent className="space-y-4 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Connection Error</h3>
              <p className="mt-1 text-sm text-slate-500">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} className="dash-cta mx-auto">
              <Sparkles className="h-4 w-4" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.total_users,
      iconClassName: 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600',
      gradient: 'from-blue-50/20 to-cyan-50/20',
      href: '/dashboard/users',
      description: 'Active accounts',
    },
    {
      icon: Shield,
      label: 'Consultants',
      value: stats?.total_consultants,
      iconClassName: 'bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600',
      gradient: 'from-purple-50/20 to-indigo-50/20',
      href: '/dashboard/consultants',
      description: 'Total experts',
    },
    {
      icon: UserCheck,
      label: 'Verified Experts',
      value: stats?.verified_consultants,
      iconClassName: 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600',
      gradient: 'from-emerald-50/20 to-teal-50/20',
      href: '/dashboard/consultants',
      description: 'Approved',
    },
    {
      icon: Calendar,
      label: 'Total Bookings',
      value: stats?.total_appointments,
      iconClassName: 'bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600',
      gradient: 'from-indigo-50/20 to-violet-50/20',
      href: '/dashboard/appointments',
      description: 'All time',
    },
    {
      icon: Clock,
      label: 'Pending Slots',
      value: stats?.pending_appointments,
      iconClassName: 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600',
      gradient: 'from-amber-50/20 to-orange-50/20',
      href: '/dashboard/appointments?tab=pending',
      description: 'Action needed',
    },
    {
      icon: CheckCircle2,
      label: 'Completed Sessions',
      value: stats?.completed_appointments,
      iconClassName: 'bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-600',
      gradient: 'from-teal-50/20 to-emerald-50/20',
      href: '/dashboard/appointments?tab=completed',
      description: 'Done',
    },
  ];

  const quickActions = [
    {
      href: '/dashboard/users',
      label: 'User Management',
      icon: Users,
      color: 'blue',
      description: 'View & manage all users',
    },
    {
      href: '/dashboard/consultants?tab=pending',
      label: 'Verify Experts',
      icon: Shield,
      color: 'purple',
      description: 'Approve consultants',
    },
    {
      href: '/dashboard/blogs',
      label: 'Blog Management',
      icon: BookOpen,
      color: 'orange',
      description: 'Create & edit articles',
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'emerald',
      description: 'View platform insights',
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3">
        {statCards.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>

      {/* Status breakdown + Quick actions */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <StatusBreakdown stats={stats} />
        </div>

        <div className="space-y-4 xl:col-span-3">
          <motion.div variants={itemVariants} className="space-y-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
                Quick Actions
                <Badge variant="outline" className="text-[10px] font-normal">
                  {quickActions.length} modules
                </Badge>
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Direct access to frequently used administrative modules.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action, idx) => (
                <QuickActionCard key={idx} {...action} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <WellnessTip
              icon={Heart}
              title="System Health"
              message={`All systems operational. ${stats?.total_users || 0} active users, ${stats?.total_consultants || 0} consultants, and ${stats?.total_appointments || 0} total bookings.`}
              badgeLabel={
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
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