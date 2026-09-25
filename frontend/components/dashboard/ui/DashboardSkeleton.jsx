'use client';

import { Calendar, Users, Shield, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function StatCardSkeleton() {
  return (
    <Card variant="raised" className="h-full">
      <div className="dash-accent" />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 animate-pulse" aria-hidden="true" />
          <div className="flex flex-col items-end gap-1">
            <div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse" />
            <div className="h-4 w-12 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>
        <div className="mt-4">
          <div className="h-8 w-20 rounded bg-slate-100 animate-pulse" />
          <div className="mt-0.5 h-3 w-16 rounded bg-slate-100 animate-pulse" />
        </div>
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-slate-200 animate-pulse" style={{ width: '60%' }} />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionSkeleton({ title = true, items = 3 }) {
  return (
    <div className="space-y-4 animate-pulse">
      {title && (
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-slate-100 rounded" />
          <div className="h-8 w-24 bg-slate-100 rounded-xl" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-100" />
              <div className="h-3 w-1/3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WellnessTipSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-teal-200/60 bg-gradient-to-r from-teal-50/80 to-emerald-50/80 p-4 animate-pulse">
      <div className="rounded-xl bg-white/50 p-2">
        <div className="h-5 w-5 rounded bg-slate-200" />
      </div>
      <div className="flex-1">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="mt-1 h-3 w-48 bg-slate-200 rounded" />
      </div>
      <div className="h-6 w-20 bg-slate-200 rounded-full" />
    </div>
  );
}

export default function DashboardSkeleton({ role = 'client' }) {
  const isAdmin = role === 'admin';
  const isConsultant = role === 'consultant';
  
  const adminStatCount = 6;
  const userStatCount = 4;

  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard" data-testid="dashboard-skeleton">
      {/* Welcome Hero Skeleton */}
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-32 bg-slate-100 rounded-full" />
        <div className="h-8 w-64 bg-slate-100 rounded" />
        <div className="h-4 w-80 bg-slate-100 rounded" />
        <div className="h-8 w-24 bg-slate-100 rounded-full" />
      </div>

      {/* Stats Grid */}
      <section aria-labelledby="stats-heading" className="space-y-4">
        <h2 id="stats-heading" className="sr-only">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4" role="list">
          {Array.from({ length: isAdmin ? adminStatCount : userStatCount }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Role-specific content */}
      {isAdmin ? (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-5 animate-pulse">
          {/* Status Breakdown */}
          <div className="xl:col-span-2">
            <SectionSkeleton items={4} />
            <div className="mt-6 rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 text-center">
              <div className="h-10 w-24 mx-auto bg-slate-100 rounded animate-pulse" />
              <div className="mt-1 h-3 w-20 mx-auto bg-slate-100 rounded animate-pulse" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 xl:col-span-3">
            <SectionSkeleton title items={0} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="dash-card p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-slate-100 rounded" />
                      <div className="mt-1 h-3 w-24 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Wellness Tip */}
            <WellnessTipSkeleton />
          </div>
        </div>
      ) : isConsultant ? (
        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-3 animate-pulse">
          {/* Today's Appointments */}
          <div className="space-y-4 xl:col-span-2">
            <SectionSkeleton items={3} />
          </div>

          {/* Pending Actions */}
          <div className="space-y-4">
            <SectionSkeleton items={4} />
          </div>
          
          {/* Wellness Tip */}
          <WellnessTipSkeleton />
        </div>
      ) : (
        <>
          {/* Upcoming Consultations */}
          <SectionSkeleton items={4} />
          
          {/* Wellness Tip */}
          <WellnessTipSkeleton />
        </>
      )}
    </div>
  );
}