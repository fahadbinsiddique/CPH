'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import AuthGuard from '@/components/shared/AuthGuard';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';

export default function DashboardLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AuthGuard>
      <div className="dash-shell">
        <div className="flex h-screen max-w-[1700px] mx-auto">
          {/* Desktop Sidebar */}
          <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-slate-200/60 lg:flex">
            <DashboardSidebar instanceId="desktop" />
          </aside>

          {/* Main Column */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* Top Header */}
            <DashboardTopbar scrolled={scrolled} />

            {/* Main Content Area */}
            <main className="cph-scroll flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto w-full max-w-7xl"
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
