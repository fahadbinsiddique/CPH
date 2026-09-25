import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { Suspense } from 'react';
import serverApi from '@/lib/serverApi';
import { fetchAppointments } from './actions/appointmentActions';
import { fetchAdminStats } from './actions/adminActions';
import StoreInitializer from '@/components/shared/StoreInitializer';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import { UserCheck, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DashboardSkeleton from '@/components/dashboard/ui/DashboardSkeleton';
import DashboardErrorBoundary from '@/components/dashboard/DashboardErrorBoundary';
import DashboardVariants from '@/components/dashboard/DashboardVariants';

// Server-side data fetching with proper cache control
async function getUser() {
  noStore(); // Opt-out of fetch cache entirely for auth
  try {
    const data = await serverApi.get('/api/auth/me/', { 
      next: { 
        cache: 'no-store',
        tags: ['user-session'] // Tag for targeted revalidation
      } 
    });
    return data.user || data;
  } catch {
    return null;
  }
}

// Server-side filtering - compute derived data on server, pass minimal props
async function getDashboardData(user) {
  const role = user.role || 'client';
  
  // Only fetch what each role actually needs
  if (role === 'admin') {
    const stats = await fetchAdminStats();
    return { role, stats, appointments: [] };
  }
  
  const appointments = await fetchAppointments();
  return { role, appointments, stats: null };
}

// Pre-filter appointments on server to avoid sending unnecessary data
function filterAppointments(appointments, role) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  const upcoming = appointments.filter(a => 
    ['pending', 'confirmed'].includes(a.status) && a.appointment_date >= todayStr
  );
  const completed = appointments.filter(a => a.status === 'completed');
  const cancelled = appointments.filter(a => a.status === 'cancelled');
  const pending = appointments.filter(a => a.status === 'pending');
  const todayAppts = appointments.filter(a => a.appointment_date === todayStr);
  
  return { upcoming, completed, cancelled, pending, todayAppts };
}

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/');
  }

  const firstName = user.full_name?.split(' ')[0] || 'User';
  const { role, appointments, stats } = await getDashboardData(user);
  
  // Server-side filtering - send only what each dashboard needs
  const filtered = filterAppointments(appointments, role);

  return (
    <DashboardErrorBoundary>
      <div className="space-y-6" data-dashboard-role={role}>
        <StoreInitializer user={user} />
        
        {/* Welcome Hero - Static, streams immediately */}
        <PageHeader
          badge={`${role} Workspace`}
          badgeIcon={<UserCheck className="h-3.5 w-3.5" aria-hidden="true" />}
          title={`Welcome back, ${firstName}!`}
          subtitle="Here is a summary of your account activity and upcoming sessions."
          actions={
            <Badge variant="outline" className="border-stone-200 text-stone-500" aria-label="Secure session">
              <Shield className="mr-1 h-3 w-3" aria-hidden="true" />
              Secure
            </Badge>
          }
        />

        {/* Role-based dashboard - Each wrapped in Suspense for streaming */}
        <Suspense fallback={<DashboardSkeleton role={role} />}>
          <DashboardVariants 
            role={role}
            stats={stats}
            todayAppointments={filtered.todayAppts}
            pendingAppointments={filtered.pending}
            completedAppointments={filtered.completed}
            allAppointments={appointments}
            upcomingAppointments={filtered.upcoming}
            cancelledAppointments={filtered.cancelled}
          />
        </Suspense>
      </div>
    </DashboardErrorBoundary>
  );
}