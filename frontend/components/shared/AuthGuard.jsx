'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';

export default function AuthGuard({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, fetchMe } = useAuthStore();
  const openLoginModal = useUiStore((s) => s.openLoginModal);
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
          // Stay on the current page and prompt the user to log in in-place.
          toast.error('Please log in to proceed', { id: 'auth-toast' });
          openLoginModal();
          return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(latest.user?.role)) {
          toast.error("You don't have permission to view this page!", {
            id: 'auth-toast',
          });
        }
        } catch {
          // Prompt the user to log back in when the session check fails or expired.
          toast.error('Please log in to proceed', { id: 'auth-toast' });
          openLoginModal();
        }
    };

    verify();
  }, [isHydrated, fetchMe, openLoginModal, allowedRoles]);

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