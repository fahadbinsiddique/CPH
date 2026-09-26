import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
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

/**
 * Read the role straight off the session cookie.
 *
 * RoleAccessToken.for_user() (backend/cph_app/authentication.py) puts a
 * `role` claim in the access token, and middleware.ts has already verified
 * that token's signature before this render — so the role that decides which
 * payload to load is available for free, instead of costing a blocking
 * /api/auth/me/ round trip (~315ms against the remote database).
 *
 * This is only a fetch *selector*. Authorization stays with the backend
 * (IsRoleAdmin etc.), so a cookie claiming a role it does not have can at
 * most trigger a 403, never a data leak.
 *
 * Returns null when the cookie is missing or unparseable, in which case the
 * caller falls back to the role on the freshly fetched user.
 */
async function getSessionRole() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get('access_token')?.value;
    if (!raw) return null;
    const parts = raw.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return typeof payload.role === 'string' && payload.role ? payload.role : null;
  } catch {
    return null;
  }
}

// Only fetch what each role actually needs.
async function getDashboardData(role) {
  if (role === 'admin') {
    const stats = await fetchAdminStats();
    return { stats, appointments: [] };
  }

  const appointments = await fetchAppointments();
  return { appointments, stats: null };
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

/**
 * Awaits a payload promise that was started back in the page render — NOT one
 * created here. That is what makes the fetch overlap getUser() instead of
 * queueing behind it, and it is why this component can sit inside Suspense:
 * the shell and PageHeader stream as soon as the user resolves (~315ms) while
 * the (slower) role payload streams in behind the skeleton.
 */
async function DashboardData({ payloadPromise, role }) {
  const { appointments, stats } = await payloadPromise;
  const filtered = filterAppointments(appointments, role);

  return (
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
  );
}

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // Start the /api/auth/me/ round trip first so it overlaps everything below.
  const userPromise = getUser();

  // The role only needs the already-verified cookie, so the slower payload
  // fetch can launch without waiting for getUser() to come back.
  const sessionRole = await getSessionRole();
  const earlyPayload = sessionRole ? getDashboardData(sessionRole) : null;

  const user = await userPromise;

  if (!user) {
    redirect('/');
  }

  const firstName = user.full_name?.split(' ')[0] || 'User';
  const role = sessionRole || user.role || 'client';
  const payloadPromise = earlyPayload || getDashboardData(role);

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
            <Badge variant="outline" className="border-border text-muted-foreground" aria-label="Secure session">
              <Shield className="mr-1 h-3 w-3" aria-hidden="true" />
              Secure
            </Badge>
          }
        />

        {/* Streams: the skeleton only covers the payload region, and the
            promise it awaits was already kicked off above. */}
        <Suspense fallback={<DashboardSkeleton role={role} />}>
          <DashboardData payloadPromise={payloadPromise} role={role} />
        </Suspense>
      </div>
    </DashboardErrorBoundary>
  );
}
