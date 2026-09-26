import { Skeleton } from '@/components/ui/skeleton';
import DashboardProgress from '@/components/dashboard/ui/DashboardProgress';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <DashboardProgress />

      {/* Welcome Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 space-y-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-7 w-40 max-w-full rounded sm:w-64" />
          <Skeleton className="h-4 w-48 max-w-full rounded-sm sm:w-80" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 space-y-3 sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-14 rounded" />
            <Skeleton className="h-3 w-24 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Content Blocks Skeleton */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 space-y-4 sm:p-6"
          >
            <Skeleton className="h-5 w-32 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded-sm" />
              <Skeleton className="h-3 w-3/4 rounded-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
