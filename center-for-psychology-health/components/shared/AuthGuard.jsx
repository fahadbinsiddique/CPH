'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function AuthGuard({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { isAuthenticated, user, fetchMe } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      fetchMe().then(() => {
        const { isAuthenticated: auth, user: u } = useAuthStore.getState();
        if (!auth) {
          router.push('/auth/login');
          return;
        }
        if (allowedRoles.length > 0 && !allowedRoles.includes(u?.role)) {
          router.push('/dashboard');
        }
      });
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, allowedRoles, fetchMe, router, user?.role]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}