import { Skeleton } from '@/components/ui/skeleton';
import DashboardProgress from '@/components/dashboard/ui/DashboardProgress';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <DashboardProgress />

      {/* Welcome Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-7 w-64 rounded" />
          <Skeleton className="h-4 w-80 rounded-sm" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/60 bg-white p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-3 w-32 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Content Blocks Skeleton */}
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 space-y-4"
          >
            <Skeleton className="h-5 w-32 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded-sm" />
              <Skeleton className="h-3 w-3/4 rounded-sm" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
