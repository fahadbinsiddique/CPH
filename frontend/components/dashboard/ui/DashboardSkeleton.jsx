'use client';

import { Calendar, Users, Shield, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function StatCardSkeleton() {
  return (
    <Card variant="raised" className="h-full">
      <div className="dash-accent" />
      <CardContent className="relative z-10 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted animate-pulse sm:h-14 sm:w-14" aria-hidden="true" />
          <div className="flex flex-col items-end gap-1">
            <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-12 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
        <div className="mt-4">
          <div className="h-7 w-16 rounded bg-muted animate-pulse sm:h-8 sm:w-20" />
          <div className="mt-0.5 h-3 w-16 rounded bg-muted animate-pulse" />
        </div>
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary/15 animate-pulse" style={{ width: '60%' }} />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionSkeleton({ title = true, items = 3 }) {
  return (
    <div className="space-y-4 animate-pulse">
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="h-5 w-40 max-w-full bg-muted rounded sm:w-48" />
          <div className="h-8 w-24 bg-muted rounded-xl" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-3 w-1/3 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WellnessTipSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-accent/20 bg-accent-soft p-4 animate-pulse">
      <div className="rounded-xl bg-card/50 p-2">
        <div className="h-5 w-5 rounded bg-primary/15" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="h-4 w-32 max-w-full bg-primary/15 rounded" />
        <div className="mt-1 h-3 w-48 max-w-full bg-primary/15 rounded" />
      </div>
      <div className="h-6 w-20 shrink-0 bg-primary/15 rounded-full" />
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
        <div className="h-4 w-32 max-w-full bg-muted rounded-full" />
        <div className="h-8 w-40 max-w-full bg-muted rounded sm:w-64" />
        <div className="h-4 w-48 max-w-full bg-muted rounded sm:w-80" />
        <div className="h-8 w-24 bg-muted rounded-full" />
      </div>

      {/* Stats Grid */}
      <section aria-labelledby="stats-heading" className="space-y-4">
        <h2 id="stats-heading" className="sr-only">Statistics</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4" role="list">
          {Array.from({ length: isAdmin ? adminStatCount : userStatCount }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Role-specific content */}
      {isAdmin ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5 animate-pulse">
          {/* Status Breakdown */}
          <div className="xl:col-span-2">
            <SectionSkeleton items={4} />
            <div className="mt-6 rounded-xl border border-border bg-muted p-3 text-center">
              <div className="h-10 w-24 mx-auto bg-muted rounded animate-pulse" />
              <div className="mt-1 h-3 w-20 mx-auto bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 xl:col-span-3">
            <SectionSkeleton title items={0} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="dash-card p-4 animate-pulse sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted sm:h-12 sm:w-12" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="mt-1 h-3 w-24 bg-muted rounded" />
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
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3 animate-pulse">
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