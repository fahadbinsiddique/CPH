'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Loader2,
  BookOpen,
  Shield,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  Heart,
  ChevronRight,
  BarChart3,
  Activity,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import api from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
};

function StatCard({ icon: Icon, label, value, gradient, iconColor, href, description, trend }) {
  const content = (
    <Card className="group border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl h-full transition-all duration-500 relative overflow-hidden">
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${iconColor} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`} />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} ${iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-end gap-1">
            {trend && (
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  trend > 0
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </Badge>
            )}
            {description && (
              <Badge variant="outline" className="text-[10px] bg-white/50">
                {description}
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value ?? '—'}</p>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {label}
          </p>
        </div>
        <div className="mt-3 h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${iconColor} rounded-full transition-all duration-1000 group-hover:w-full w-1/3`}
          />
        </div>
        {href && (
          <div className="mt-3 flex justify-end">
            <Link href={href}>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-teal-600 hover:bg-teal-50/80 rounded-xl h-7 px-2 text-[10px] font-medium group/btn"
              >
                View Details
                <ChevronRight className="w-3 h-3 ml-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return href ? (
    <motion.div variants={statVariants} whileHover={{ y: -4 }} className="h-full">
      {content}
    </motion.div>
  ) : (
    <motion.div variants={statVariants} className="h-full">
      {content}
    </motion.div>
  );
}

function QuickActionCard({ href, label, icon: Icon, color, description }) {
  return (
    <Link href={href} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        className={`relative p-5 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-${color}-500/20 transition-all duration-500 overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br from-${color}-50/0 to-${color}-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
        />
        <div className="relative flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-${color}-100 to-${color}-50 text-${color}-600 shadow-sm group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-sm group-hover:text-${color}-600 transition-colors">
              {label}
            </p>
            {description && (
              <p className="text-xs text-slate-400 truncate">{description}</p>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-${color}-600 transition-colors" />
          </div>
        </div>
      </motion.div>
    </Link>
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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-teal-100 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-sm font-medium text-slate-400 tracking-wide">
          Loading system insights...
        </p>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <Card className="border-red-100 bg-red-50/50 max-w-md mx-auto rounded-2xl shadow-sm">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto border border-red-200">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Connection Error</h3>
              <p className="text-sm text-slate-500 mt-1">{error}</p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-600/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
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
      gradient: 'from-blue-50/20 to-cyan-50/20',
      iconColor: 'text-blue-600',
      href: '/dashboard/users',
      description: 'Active accounts',
      trend: 12,
    },
    {
      icon: Shield,
      label: 'Consultants',
      value: stats?.total_consultants,
      gradient: 'from-purple-50/20 to-indigo-50/20',
      iconColor: 'text-purple-600',
      href: '/dashboard/consultants',
      description: 'Total experts',
      trend: 8,
    },
    {
      icon: UserCheck,
      label: 'Verified Experts',
      value: stats?.verified_consultants,
      gradient: 'from-emerald-50/20 to-teal-50/20',
      iconColor: 'text-emerald-600',
      href: '/dashboard/consultants',
      description: 'Approved',
      trend: 5,
    },
    {
      icon: Calendar,
      label: 'Total Bookings',
      value: stats?.total_appointments,
      gradient: 'from-indigo-50/20 to-violet-50/20',
      iconColor: 'text-indigo-600',
      href: '/dashboard/appointments',
      description: 'All time',
      trend: -3,
    },
    {
      icon: Clock,
      label: 'Pending Slots',
      value: stats?.pending_appointments,
      gradient: 'from-amber-50/20 to-orange-50/20',
      iconColor: 'text-amber-600',
      href: '/dashboard/appointments?filter=pending',
      description: 'Action needed',
      trend: 15,
    },
    {
      icon: CheckCircle2,
      label: 'Completed Sessions',
      value: stats?.completed_appointments,
      gradient: 'from-teal-50/20 to-emerald-50/20',
      iconColor: 'text-teal-600',
      href: '/dashboard/appointments?filter=completed',
      description: 'Done',
      trend: 22,
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
      href: '/dashboard/consultants',
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-teal-50 text-teal-700 border-teal-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Admin Dashboard
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Platform Overview
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Real-time statistics and administrative controls at your fingertips.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-slate-200 text-slate-500">
                <Activity className="w-3 h-3 mr-1 text-emerald-500 animate-pulse" />
                Live
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-500">
                <Zap className="w-3 h-3 mr-1 text-amber-500" />
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {statCards.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Quick Actions
            <Badge variant="outline" className="text-[10px] font-normal">
              {quickActions.length} modules
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Direct access to frequently used administrative modules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <QuickActionCard key={idx} {...action} />
          ))}
        </div>
      </motion.div>

      {/* System Health & Tips */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-4 border border-teal-200/60 flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Heart className="w-5 h-5 text-teal-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">System Health</p>
            <p className="text-xs text-slate-500">
              All systems operational. {stats?.total_users || 0} active users,{' '}
              {stats?.total_consultants || 0} consultants, and{' '}
              {stats?.total_appointments || 0} total bookings.
            </p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Healthy
          </Badge>
        </div>
      </motion.div>
    </motion.div>
  );
}