'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';

export default function AuthGuard({ children, allowedRoles = [] }) {
  const openLoginModal = useUiStore((s) => s.openLoginModal);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

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
    if (!isHydrated) return;

    const verify = async () => {
      const latest = useAuthStore.getState();

      // Fast path: user is already in the persisted store.
      // Trust it — the 401 interceptor handles expired sessions on the next API call.
      if (latest.isAuthenticated && latest.user) {
        // If roles are required, check against the stored user.
        if (allowedRoles.length > 0 && !allowedRoles.includes(latest.user.role)) {
          toast.error("You don't have permission to view this page!", {
            id: 'auth-toast',
          });
        }
        setHasFetched(true);
        return;
      }

      // Slow path: no user in store — verify with the backend.
      try {
        const { fetchMe } = useAuthStore.getState();
        await fetchMe();
        const refreshed = useAuthStore.getState();

        if (!refreshed.isAuthenticated) {
          toast.error('Please log in to proceed', { id: 'auth-toast' });
          openLoginModal();
          return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(refreshed.user?.role)) {
          toast.error("You don't have permission to view this page!", {
            id: 'auth-toast',
          });
        }
      } catch {
        toast.error('Please log in to proceed', { id: 'auth-toast' });
        openLoginModal();
      } finally {
        setHasFetched(true);
      }
    };

    verify();
  }, [isHydrated, openLoginModal, allowedRoles]);

  // Lock the screen with a loading spinner until the auth state is fully ready.
  if (!isHydrated || !hasFetched) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-[11px] font-bold text-slate-400 mt-3 tracking-wider uppercase">
          Restoring secure session...
        </p>
      </div>
    );
  }

  const { isAuthenticated, user } = useAuthStore.getState();

  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
}
