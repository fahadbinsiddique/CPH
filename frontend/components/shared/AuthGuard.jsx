'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';

const DEFAULT_ROLES = [];

export default function AuthGuard({ children, allowedRoles = DEFAULT_ROLES }) {
  const openLoginModal = useUiStore((s) => s.openLoginModal);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [denied, setDenied] = useState(false);
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

  // Always validate the session with a live API call on mount.
  // Never trust localStorage alone — the access_token cookie may have
  // expired or been deleted while the persisted store still says
  // isAuthenticated: true.  The fetchMe() call goes through the Axios
  // interceptor which handles 401 → refresh → retry transparently.
  useEffect(() => {
    if (!isHydrated || resolvedRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        const { fetchMe } = useAuthStore.getState();
        await fetchMe();
      } catch {
        // fetchMe already sets isAuthenticated: false on failure
      }

      if (cancelled) return;

      const { isAuthenticated, user } = useAuthStore.getState();

      if (!isAuthenticated || !user) {
        toast.error('Please log in to proceed', { id: 'auth-toast' });
        openLoginModal();
        // Resolve the guard so we don't spin on an infinite skeleton; the
        // render below returns null (children are never shown without a
        // verified session).
        setHasFetched(true);
        return;
      }

      // Role check — a failed check must BLOCK rendering, not just toast.
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        toast.error("You don't have permission to view this page!", {
          id: 'auth-toast',
        });
        setDenied(true);
        setHasFetched(true);
        return;
      }

      resolvedRef.current = true;
      setHasFetched(true);
    })();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  // Lightweight inline skeleton instead of a full-viewport overlay.
  if (!isHydrated || !hasFetched) {
    return <div className="animate-pulse min-h-[60vh] rounded-2xl bg-slate-100" />;
  }

  if (denied) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 p-8 text-center">
        <p className="text-lg font-semibold text-slate-700">Access denied</p>
        <p className="text-sm text-slate-500">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    );
  }

  const { isAuthenticated, user } = useAuthStore.getState();

  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
}
