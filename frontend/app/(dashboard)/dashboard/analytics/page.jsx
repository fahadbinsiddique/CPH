'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  CalendarClock,
  Wallet,
  Activity,
  Award,
  BarChart3,
  Video,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import StatCard from '@/components/dashboard/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { containerVariants, itemVariants } from '@/lib/motion';

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  completed: '#3b82f6',
  cancelled: '#94a3b8',
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      {label && <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.dataKey ?? entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color || entry.payload?.fill }}
          />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-bold text-slate-800">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get('/api/appointments/admin/analytics/', { params: { days } })
      .then((res) => {
        if (active) setData(res.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [days]);

  const changeDays = (d) => {
    setDays(d);
    setLoading(true);
    setError(false);
  };

  const statusPie = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.status_breakdown).map(([key, value]) => ({
      name: STATUS_LABELS[key] || key,
      value,
      fill: STATUS_COLORS[key],
    }));
  }, [data]);

  const sessionPie = useMemo(() => {
    if (!data?.session_types) return [];
    return data.session_types.map((s) => ({
      name: s.session_type === 'online' ? 'Online' : 'In-Person',
      value: s.count,
      fill: s.session_type === 'online' ? '#0d9488' : '#8b5cf6',
    }));
  }, [data]);

  const totals = useMemo(() => {
    if (!data?.series?.length) return { appointments: 0, registrations: 0, assessments: 0 };
    return data.series.reduce(
      (acc, d) => ({
        appointments: acc.appointments + (d.appointments || 0),
        registrations: acc.registrations + (d.registrations || 0),
        assessments: acc.assessments + (d.assessments || 0),
      }),
      { appointments: 0, registrations: 0, assessments: 0 }
    );
  }, [data]);

  const completionRate = useMemo(() => {
    if (!data) return 0;
    const { pending, confirmed, completed, cancelled } = data.status_breakdown;
    const total = pending + confirmed + completed + cancelled;
    if (!total) return 0;
    return Math.round(((completed + confirmed) / total) * 100);
  }, [data]);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <PageHeader
          badge="Insights & Trends"
          badgeIcon={BarChart3}
          title="Analytics"
          subtitle="Track bookings, engagement and platform growth over time."
          actions={
            <div className="flex gap-1 rounded-xl border border-slate-200/60 bg-white/80 p-1 shadow-sm backdrop-blur-sm">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => changeDays(d)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    days === d
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          }
        />

        {loading ? (
          <LoadingState label="Crunching the numbers..." />
        ) : error ? (
          <Card className="dash-card">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">{`Couldn't load analytics`}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Something went wrong while fetching the data. Please try again.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={CalendarClock}
                label="Appointments"
                value={totals.appointments}
                iconClassName="bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700"
                description={`last ${days} days`}
              />
              <StatCard
                icon={Users}
                label="New Registrations"
                value={totals.registrations}
                iconClassName="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700"
                gradient="from-blue-50/20 to-indigo-50/20"
                description={`last ${days} days`}
              />
              <StatCard
                icon={Activity}
                label="Assessments Taken"
                value={totals.assessments}
                iconClassName="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700"
                gradient="from-amber-50/20 to-orange-50/20"
                description={`last ${days} days`}
              />
              <StatCard
                icon={Wallet}
                label="Revenue (৳)"
                value={data.revenue_estimate.toLocaleString()}
                iconClassName="bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700"
                description="confirmed + completed"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="dash-card relative h-full overflow-hidden">
                  <div className="dash-accent" />
                  <CardHeader className="flex flex-row items-center justify-between pb-0">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                        <TrendingUp className="h-4 w-4 text-teal-600" />
                        Engagement Trend
                      </CardTitle>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Appointments, registrations and assessments per day
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.series} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gradAppt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradUser" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradQuiz" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(d) => {
                              const parts = d.split('-');
                              return `${parts[1]}/${parts[2]}`;
                            }}
                            tickLine={false}
                            axisLine={{ stroke: '#e2e8f0' }}
                            minTickGap={24}
                          />
                          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip content={<ChartTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="appointments"
                            name="Appointments"
                            stroke="#0d9488"
                            strokeWidth={2}
                            fill="url(#gradAppt)"
                          />
                          <Area
                            type="monotone"
                            dataKey="registrations"
                            name="Registrations"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#gradUser)"
                          />
                          <Area
                            type="monotone"
                            dataKey="assessments"
                            name="Assessments"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fill="url(#gradQuiz)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="dash-card relative h-full overflow-hidden">
                  <div className="dash-accent" />
                  <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                      <Activity className="h-4 w-4 text-teal-600" />
                      Completion Rate
                    </CardTitle>
                    <p className="text-xs text-slate-400">Completed + confirmed sessions</p>
                  </CardHeader>
                  <CardContent className="flex h-72 flex-col items-center justify-center">
                    <div className="relative">
                      <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/25">
                        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                          <span className="text-3xl font-extrabold text-slate-900">{completionRate}%</span>
                          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                            Success
                          </span>
                        </div>
                      </div>
                      <span className="absolute inset-0 -z-10 h-36 w-36 animate-ping rounded-full border-2 border-teal-100 opacity-20" />
                    </div>
                    <div className="mt-5 grid w-full grid-cols-2 gap-2">
                      {Object.entries(data.status_breakdown).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1.5 rounded-lg bg-slate-50/80 px-2.5 py-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[key] }} />
                          <span className="flex-1 text-[11px] capitalize text-slate-500">{STATUS_LABELS[key]}</span>
                          <span className="text-xs font-bold text-slate-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <motion.div variants={itemVariants}>
                <Card className="dash-card relative h-full overflow-hidden">
                  <div className="dash-accent" />
                  <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                      <BarChart3 className="h-4 w-4 text-teal-600" />
                      Status Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex h-64 items-center justify-center pt-4">
                    {statusPie.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusPie}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={48}
                            outerRadius={70}
                            paddingAngle={3}
                            strokeWidth={0}
                          >
                            {statusPie.map((entry) => (
                              <Cell key={entry.name} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltip />} />
                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 11, color: '#64748b' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-slate-400">No data yet</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="dash-card relative h-full overflow-hidden">
                  <div className="dash-accent" />
                  <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                      <Video className="h-4 w-4 text-teal-600" />
                      Session Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex h-64 items-center justify-center pt-4">
                    {sessionPie.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sessionPie}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={48}
                            outerRadius={70}
                            paddingAngle={3}
                            strokeWidth={0}
                          >
                            {sessionPie.map((entry) => (
                              <Cell key={entry.name} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltip />} />
                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 11, color: '#64748b' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-slate-400">No data yet</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="dash-card relative h-full overflow-hidden">
                  <div className="dash-accent" />
                  <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                      <Award className="h-4 w-4 text-teal-600" />
                      Top Consultants
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {data.top_consultants.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.top_consultants} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={70}
                              tick={{ fontSize: 10, fill: '#475569' }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="sessions" name="Sessions" radius={[0, 6, 6, 0]} barSize={16}>
                              {data.top_consultants.map((_, i) => (
                                <Cell key={i} fill={['#0d9488', '#14b8a6', '#10b981', '#34d399', '#2dd4bf'][i % 5]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="py-16 text-center text-sm text-slate-400">No consultant activity yet</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </AuthGuard>
  );
}