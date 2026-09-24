import { redirect } from 'next/navigation';
import serverApi from '@/lib/serverApi';
import dynamic from 'next/dynamic';
import { fetchAppointments } from './actions/appointmentActions';
import { fetchAdminStats } from './actions/adminActions';
import StoreInitializer from '@/components/shared/StoreInitializer';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import { UserCheck, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UserDashboard = dynamic(() => import('@/components/dashboard/UserDashboard'));
const ConsultantDashboard = dynamic(() => import('@/components/dashboard/ConsultantDashboard'));
const AdminDashboard = dynamic(() => import('@/components/dashboard/AdminDashboard'));

async function getUser() {
  try {
    // Auth data must never come from the fetch cache — a60-second-stale /me
    // (or one reused across a logout) is exactly what masked dead sessions.
    const data = await serverApi.get('/api/auth/me/', { next: { cache: 'no-store' } });
    return data.user || data;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUser();

  // If server-side auth failed (no valid token even after refresh attempt),
  // redirect to login. AuthGuard will also catch this on the client, but
  // failing here prevents rendering sensitive layout with no user context.
  if (!user) {
    redirect('/');
  }

  const role = user.role || 'client';
  const firstName = user.full_name?.split(' ')[0] || 'User';

  const [appointments, stats] = await Promise.all([
    role === 'admin' ? [] : fetchAppointments(),
    role === 'admin' ? fetchAdminStats() : null,
  ]);

  return (
    <div className="space-y-6">
      <StoreInitializer user={user} />
      {/* Welcome Hero */}
      <PageHeader
        badge={`${role} Workspace`}
        badgeIcon={<UserCheck className="h-3.5 w-3.5" />}
        title={`Welcome back, ${firstName}!`}
        subtitle="Here is a summary of your account activity and upcoming sessions."
        actions={
          <Badge variant="outline" className="border-stone-200 text-stone-500">
            <Shield className="mr-1 h-3 w-3" />
            Secure
          </Badge>
        }
      />

      {/* Role-based dashboard */}
      {role === 'admin' ? (
        <AdminDashboard stats={stats} />
      ) : role === 'consultant' ? (
        <ConsultantDashboard appointments={appointments} />
      ) : (
        <UserDashboard appointments={appointments} />
      )}
    </div>
  );
}