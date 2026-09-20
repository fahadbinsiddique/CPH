'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';

const DEFAULT_ROLES = [];
const STORE_SEED_TIMEOUT = 100;

export default function AuthGuard({ children, allowedRoles = DEFAULT_ROLES }) {
  const openLoginModal = useUiStore((s) => s.openLoginModal);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const resolvedRef = useRef(false);

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

    const latest = useAuthStore.getState();

    // Fast path: user is already in the persisted store.
    if (latest.isAuthenticated && latest.user) {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        setHasFetched(true);
      }
      return;
    }

    // Subscribe to store changes — StoreInitializer may seed the store
    // after AuthGuard mounts (race between page render and hydration).
    let settled = false;
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (settled) return;
      if (state.isAuthenticated && state.user) {
        settled = true;
        clearTimeout(fallbackTimer);
        resolveAuth(state.user);
      }
    });

    // Re-check immediately in case the store was seeded between our
    // getState() call and the subscription setup.
    const current = useAuthStore.getState();
    if (current.isAuthenticated && current.user) {
      settled = true;
      clearTimeout(fallbackTimer);
      resolveAuth(current.user);
      return;
    }

    // Fallback: if the store is still empty after the timeout, fetch from API.
    // This covers the case where there is no StoreInitializer (other routes).
    const fallbackTimer = setTimeout(async () => {
      if (settled || resolvedRef.current) return;
      settled = true;
      unsubscribe();

      try {
        const { fetchMe } = useAuthStore.getState();
        await fetchMe();
        const refreshed = useAuthStore.getState();

        if (!refreshed.isAuthenticated) {
          toast.error('Please log in to proceed', { id: 'auth-toast' });
          openLoginModal();
          return;
        }

        resolveAuth(refreshed.user);
      } catch {
        toast.error('Please log in to proceed', { id: 'auth-toast' });
        openLoginModal();
      } finally {
        setHasFetched(true);
      }
    }, STORE_SEED_TIMEOUT);

    function resolveAuth(user) {
      if (resolvedRef.current) return;
      resolvedRef.current = true;

      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        toast.error("You don't have permission to view this page!", {
          id: 'auth-toast',
        });
      }
      setHasFetched(true);
    }

    return () => {
      settled = true;
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  // Lightweight inline skeleton instead of a full-viewport overlay.
  if (!isHydrated || !hasFetched) {
    return <div className="animate-pulse min-h-[60vh] rounded-2xl bg-slate-100" />;
  }

  const { isAuthenticated, user } = useAuthStore.getState();

  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
}
