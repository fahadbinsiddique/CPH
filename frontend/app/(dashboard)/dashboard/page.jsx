import { cookies } from 'next/headers';
import api from '@/lib/api';
import { fetchAppointments } from './actions/appointmentActions';
import { fetchAdminStats } from './actions/adminActions';
import UserDashboard from '@/components/dashboard/UserDashboard';
import ConsultantDashboard from '@/components/dashboard/ConsultantDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import { UserCheck, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const response = await api.get('/api/auth/me/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch {
    return null;
  }
}

async function getAppointments(user) {
  if (user?.role === 'admin') return [];
  return fetchAppointments();
}

export default async function DashboardPage() {
  const user = await getUser();
  const appointments = await getAppointments(user);
  const stats = user?.role === 'admin' ? await fetchAdminStats() : null;
  const role = user?.role || 'client';
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <PageHeader
        badge={`${role} Workspace`}
        badgeIcon={UserCheck}
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