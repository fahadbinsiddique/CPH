'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';

const DEFAULT_ROLES = [];

/**
 * AuthGuard instances nest — dashboard/layout.jsx wraps every page, and most
 * pages render a second guard of their own. Awaiting fetchMe() independently
 * in each one stacked two ~315ms round trips in front of every dashboard
 * render. Sharing a single promise at module scope makes the whole tree pay
 * for exactly one call; every guard still evaluates its own allowedRoles.
 *
 * The TTL keeps a guard mounted later by a client-side navigation from going
 * stale while still collapsing guards that mount together into one request.
 */
const VALIDATION_TTL_MS = 15_000;
let validationPromise = null;
let validationStartedAt = 0;

function ensureSessionValidated() {
  const startedAt = Date.now();
  if (!validationPromise || startedAt - validationStartedAt > VALIDATION_TTL_MS) {
    validationStartedAt = startedAt;
    validationPromise = (async () => {
      try {
        const { fetchMe } = useAuthStore.getState();
        await fetchMe();
      } catch {
        // fetchMe already clears the session on failure.
      }
      return useAuthStore.getState();
    })();
  }
  return validationPromise;
}

/**
 * Renders children as soon as the request is allowed to render, and validates
 * the session in the background instead of gating on it.
 *
 * That is safe because middleware.ts verifies the access token's signature and
 * the route's required role on every request, and redirects unauthenticated or
 * wrongly-roled visitors, all BEFORE this HTML is produced. What is rendered
 * below is therefore a defence-in-depth re-check, not the primary gate — the
 * role check in particular still runs both synchronously (against the
 * persisted store) and after validation, so allowedRoles keeps blocking.
 */
export default function AuthGuard({ children, allowedRoles = DEFAULT_ROLES }) {
  const openLoginModal = useUiStore((s) => s.openLoginModal);
  const [isHydrated, setIsHydrated] = useState(false);
  const [validated, setValidated] = useState(false);
  const [denied, setDenied] = useState(false);
  const ranRef = useRef(false);

  // Reactive so a post-hydration role mismatch blocks without a network call.
  const storedUser = useAuthStore((s) => s.user);
  const storedAuthenticated = useAuthStore((s) => s.isAuthenticated);

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

  // Validate against a live API call — never trust localStorage alone, since
  // the access_token cookie may have expired while the persisted store still
  // says isAuthenticated: true. Deliberately NOT awaited by the render path:
  // fetchMe() goes through the Axios interceptor, which handles 401 → refresh
  // → retry, so a slow or failed refresh can no longer hold up first paint.
  useEffect(() => {
    if (!isHydrated || ranRef.current) return;
    ranRef.current = true;

    let cancelled = false;

    (async () => {
      await ensureSessionValidated();
      if (cancelled) return;

      const { isAuthenticated, user } = useAuthStore.getState();

      if (!isAuthenticated || !user) {
        toast.error('Please log in to proceed', { id: 'auth-toast' });
        openLoginModal();
        setValidated(true);
        return;
      }

      // Role check — a failed check must BLOCK rendering, not just toast.
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        toast.error("You don't have permission to view this page!", {
          id: 'auth-toast',
        });
        setDenied(true);
        setValidated(true);
        return;
      }

      setValidated(true);
    })();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  // Synchronous role gate from the already-persisted store. Runs as soon as
  // hydration lands, so a wrong-role visitor is blocked on the next frame
  // rather than after a network round trip.
  const roleBlocked =
    isHydrated &&
    allowedRoles.length > 0 &&
    !!storedUser?.role &&
    !allowedRoles.includes(storedUser.role);

  if (denied || roleBlocked) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 p-8 text-center">
        <p className="text-lg font-semibold text-slate-700">Access denied</p>
        <p className="text-sm text-slate-500">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    );
  }

  // Only blank out once validation has actually come back negative; a store
  // that has not hydrated yet (or a login completing mid-flight) keeps showing
  // children rather than flashing an empty screen.
  if (validated && (!storedAuthenticated || !storedUser)) return null;

  return <>{children}</>;
}
