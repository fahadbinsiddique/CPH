'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export default function AuthGuard({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { isAuthenticated, user, fetchMe } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const hasFetched = useRef(false);

  // Ensure the Zustand persisted state has finished hydrating.
  useEffect(() => {
    const unsub = useAuthStore.persist.onHydrate(() => setIsHydrated(false));
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));

    if (useAuthStore.persist.hasHydrated()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsHydrated(true);
    }

    return () => {
      unsub();
      unsubFinish();
    };
  }, []);

  // Secure session verification logic.
  useEffect(() => {
    if (!isHydrated) return; // Wait until the persisted store is ready before calling the backend.

    const verify = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        await fetchMe();
        const latest = useAuthStore.getState();
        
        if (!latest.isAuthenticated) {
          window.location.href = '/?message=login_required';
          return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(latest.user?.role)) {
          // Redirect to the home page when the role does not match the allowed set.
          window.location.href = '/?message=unauthorized';
        }
        } catch {
          // Redirect to login when the request fails or the session has expired.
          router.replace('/?message=login_required');
        }
    };

    verify();
  }, [isHydrated, fetchMe, router, allowedRoles]);

  // Lock the screen with a loading spinner until the auth state is fully ready.
  // eslint-disable-next-line react-hooks/refs
  if (!isHydrated || (!isAuthenticated && hasFetched.current === false)) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-[11px] font-bold text-slate-400 mt-3 tracking-wider uppercase">
          Restoring secure session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
}