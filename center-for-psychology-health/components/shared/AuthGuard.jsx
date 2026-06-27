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

  // ১. Zustand লোকাল স্টোরেজ রিড করা শেষ করেছে কি না তা নিশ্চিত করা
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

  // ২. সিকিউরড সেশন ভেরিফিকেশন লজিক
  useEffect(() => {
    if (!isHydrated) return; // স্টোরেজ রিড শেষ না হওয়া পর্যন্ত ব্যাকএন্ড কল হবে না

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
          // 🚀 ফিক্স: রোল না মিললে হোমপেজে পাঠিয়ে unauthorized টোস্ট দেখানো হবে
          window.location.href = '/?message=unauthorized';
        }
        } catch {
          // 🚀 ফিক্স: এপিআই ফেল করলে বা সেশন আউট হলে লগইন করার মেসেজ যাবে
          router.replace('/?message=login_required');
        }
    };

    verify();
  }, [isHydrated, fetchMe, router, allowedRoles]);

  // ৩. ডাটা পুরোপুরি রেডি হওয়ার আগ পর্যন্ত স্ক্রিন লক (লোডিং স্পিনার)
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