'use client';

import { useState, useEffect, useRef } from 'react';
import useAuthStore from '@/store/authStore';
import AuthGuard from '@/components/shared/AuthGuard';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';

export default function DashboardLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const user = useAuthStore((s) => s.user);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const handleScroll = () => setScrolled(el.scrollTop > 10);
    handleScroll();
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AuthGuard>
      <div className="dash-shell">
        <div className="mx-auto flex h-full max-w-[1700px]">
          {/* Desktop Sidebar */}
          <aside className="hidden h-full w-[280px] shrink-0 flex-col border-r border-border lg:flex">
            <DashboardSidebar instanceId="desktop" />
          </aside>

          {/* Main Column */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* Top Header */}
            <DashboardTopbar scrolled={scrolled} />

            {/* Main Content Area */}
            <main
              ref={scrollRef}
              className="cph-scroll dash-main flex-1 overflow-y-auto px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8"
            >
              <div className="mx-auto w-full max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
