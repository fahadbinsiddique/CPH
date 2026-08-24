'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  LogOut,
  Menu,
  Brain,
  Users,
  BookOpen,
  BarChart3,
  ChevronRight,
  Clock,
  Shield,
  Sparkles,
  Heart,
  ClipboardList,
  Tag,
  Bell,
  Presentation,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useAuthStore from '@/store/authStore';
import AuthGuard from '@/components/shared/AuthGuard';
import { toast } from 'sonner';
import { getRoleStyle, getInitials, ROLE_LABEL } from '@/lib/roles';
import { cn } from '@/lib/utils';

const NAV_SECTIONS = {
  client: [
    {
      label: 'General',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
        { href: '/dashboard/bookings', label: 'Appointments', icon: Calendar, color: 'from-blue-400 to-indigo-500' },
        { href: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList, color: 'from-indigo-400 to-blue-500' },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: User, color: 'from-purple-400 to-pink-500' },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-slate-400 to-slate-500' },
      ],
    },
  ],
  consultant: [
    {
      label: 'General',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
        { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar, color: 'from-blue-400 to-indigo-500' },
        { href: '/dashboard/availability', label: 'Availability', icon: Clock, color: 'from-amber-400 to-orange-500' },
        { href: '/dashboard/patients', label: 'My Patients', icon: Users, color: 'from-rose-400 to-pink-500' },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: User, color: 'from-purple-400 to-pink-500' },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-slate-400 to-slate-500' },
      ],
    },
  ],
  admin: [
    {
      label: 'General',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, color: 'from-indigo-400 to-blue-500' },
      ],
    },
    {
      label: 'Management',
      items: [
        { href: '/dashboard/users', label: 'Manage Users', icon: Users, color: 'from-blue-400 to-indigo-500' },
        { href: '/dashboard/consultants', label: 'Consultants', icon: Shield, color: 'from-violet-400 to-purple-500' },
        { href: '/dashboard/specializations', label: 'Specializations', icon: Tag, color: 'from-indigo-400 to-blue-500' },
        { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar, color: 'from-amber-400 to-orange-500' },
        { href: '/dashboard/blogs', label: 'Blog & Articles', icon: BookOpen, color: 'from-rose-400 to-pink-500' },
      ],
    },
    {
      label: 'Tools',
      items: [
        { href: '/dashboard/product-tour', label: 'Product Tour', icon: Presentation, color: 'from-teal-400 to-emerald-500' },
      ],
    },
    {
      label: 'Account',
      items: [{ href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-slate-400 to-slate-500' }],
    },
  ],
};

function allNavItems(role) {
  return (NAV_SECTIONS[role] || NAV_SECTIONS.client).flatMap((s) => s.items);
}

function getPageLabel(pathname, role) {
  const items = allNavItems(role);
  const match = items.find((item) =>
    item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
  );
  return match?.label || 'Dashboard';
}

function SidebarContent({ instanceId, onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const role = user?.role || 'client';
  const sections = NAV_SECTIONS[role] || NAV_SECTIONS.client;
  const roleStyle = getRoleStyle(role);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout successful');
    } catch (error) {
      console.error('Component logout error:', error);
    }
  };

  const isActive = (href) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
     

      {/* User card */}
      <div className="shrink-0 border-b border-slate-200/60 px-4 py-5">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50/80 to-white p-4 shadow-sm">
          <div
            className={`absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-br ${roleStyle.gradient} opacity-10 blur-2xl`}
          />
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                <AvatarFallback
                  className={`bg-gradient-to-br ${roleStyle.gradient} text-lg font-bold text-white`}
                >
                  {getInitials(user?.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{user?.full_name || 'User'}</p>
              <Badge className={`mt-0.5 border text-[10px] font-semibold capitalize ${roleStyle.badge}`}>
                {ROLE_LABEL[role] || role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="cph-scroll flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-3.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={onNavigate} className="relative block">
                    <span
                      className={cn(
                        'relative flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-300',
                        active ? 'text-slate-900' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId={`${instanceId}-active`}
                          className="absolute inset-0 rounded-xl border border-teal-200/60 bg-gradient-to-r from-teal-50 to-emerald-50"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          'relative z-10 h-[18px] w-[18px] shrink-0 transition-all duration-300',
                          active ? 'scale-110 text-teal-600' : 'text-slate-400'
                        )}
                      />
                      <span className="relative z-10 tracking-wide">{item.label}</span>
                      {active && <ChevronRight className="relative z-10 ml-auto h-4 w-4 text-teal-600" />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 space-y-2 border-t border-slate-200/60 px-3 py-4">
      
        <button
          onClick={handleLogout}
          className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-sm font-semibold text-rose-600 transition-all duration-200 hover:border-rose-200/40 hover:bg-rose-50/80"
        >
          <LogOut className="h-[18px] w-[18px] text-rose-500 transition-transform group-hover:translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuthStore();
  const pathname = usePathname();
  const role = user?.role || 'client';
  const roleStyle = getRoleStyle(role);
  const pageLabel = getPageLabel(pathname, role);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleBell = () => toast('No new notifications', { description: "You're all caught up." });

  return (
    <AuthGuard>
      <div className="dash-shell">
        <div className="mx-auto flex max-w-[1700px] pt-20 lg:pt-30">
          {/* Desktop Sidebar */}
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-[280px] shrink-0 flex-col border-r border-slate-200/60 lg:top-30 lg:h-[calc(100vh-7.5rem)] lg:flex">
            <SidebarContent instanceId="desktop" />
          </aside>

          {/* Main Column */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Top Header */}
            <header
              className={cn(
                'sticky top-20 z-30 flex h-16 shrink-0 items-center gap-3 border-b px-4 transition-all duration-300 sm:px-6 lg:top-28 sm:mt-0 mt-7 top-27 lg:px-8',
                scrolled
                  ? 'border-slate-200/60 bg-white/90 shadow-sm backdrop-blur-md'
                  : 'border-slate-200/40 bg-white/70 backdrop-blur-sm'
              )}
            >
              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" onClick={() => setMobileOpen(true)}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[290px] p-0">
                  <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
                  <SidebarContent instanceId="mobile" onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>

              {/* Mobile brand */}
              <div className="flex  items-center gap-2 lg:hidden">
                
                <span className="text-sm font-bold tracking-tight text-slate-900">Dashboard</span>
                 <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="text-sm font-bold text-slate-800">{pageLabel}</span>
              </div>

              {/* Desktop breadcrumb */}
              <div className="hidden items-center gap-2 lg:flex lg:flex-1">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Dashboard</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="text-sm font-bold text-slate-800">{pageLabel}</span>
              </div>

              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button variant="ghost" size="icon" onClick={handleBell} aria-label="Notifications">
                  <Bell className="h-[18px] w-[18px]" />
                </Button>
                <Badge variant="outline" className="hidden border-slate-200 px-2.5 py-1 text-slate-500 sm:inline-flex">
                  {today}
                </Badge>
                <Link href="/dashboard/profile">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-2 py-1.5 transition-colors hover:bg-white">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback
                        className={`bg-gradient-to-br text-[10px] font-bold text-white ${roleStyle.gradient}`}
                      >
                        {getInitials(user?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-xs font-semibold text-slate-700 md:inline">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                  </div>
                </Link>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
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