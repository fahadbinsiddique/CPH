'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Dynamic imports with no SSR - only load the variant needed on client
const UserDashboard = dynamic(() => import('@/components/dashboard/UserDashboard').then(m => m.default), { 
  ssr: false,
  loading: () => null,
});
const ConsultantDashboard = dynamic(() => import('@/components/dashboard/ConsultantDashboard').then(m => m.default), { 
  ssr: false,
  loading: () => null,
});
const AdminDashboard = dynamic(() => import('@/components/dashboard/AdminDashboard').then(m => m.default), { 
  ssr: false,
  loading: () => null,
});

/**
 * Client-side dashboard variant selector
 * Renders the appropriate dashboard based on role
 * Uses dynamic imports for code splitting
 */
export default function DashboardVariants({ role, ...props }) {
  const reduceMotion = useReducedMotion();

  if (role === 'admin') {
    return <AdminDashboard {...props} />;
  }
  
  if (role === 'consultant') {
    return <ConsultantDashboard {...props} />;
  }
  
  return <UserDashboard {...props} />;
}