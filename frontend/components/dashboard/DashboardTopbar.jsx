'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Bell,
  ChevronRight,
  ChevronDown,
  LogOut,
  Home,
  User,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import { getRoleStyle, getInitials } from '@/lib/roles';
import { cn } from '@/lib/utils';
import { getPageLabel } from '@/components/dashboard/DashboardSidebar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function DashboardTopbar({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const role = user?.role || 'client';
  const roleStyle = getRoleStyle(role);
  const pageLabel = getPageLabel(pathname, role);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout successful');
    } catch (error) {
      console.error('Component logout error:', error);
    }
  };

  const handleBell = () => toast('No new notifications', { description: "You're all caught up." });

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b px-4 transition-all duration-300 sm:px-6 lg:px-8',
        scrolled
          ? 'border-slate-200/60 bg-white/90 shadow-sm backdrop-blur-md'
          : 'border-slate-200/40 bg-white/70 backdrop-blur-sm'
      )}
    >
      {/* Mobile sidebar toggle */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[290px] p-0">
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar instanceId="mobile" onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 lg:flex-1">
        <span className="text-sm font-bold tracking-tight text-slate-900 lg:text-[11px] lg:font-semibold lg:tracking-wider lg:text-slate-400 lg:uppercase">
          Dashboard
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="text-sm font-bold text-slate-800">{pageLabel}</span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleBell} aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        <Badge variant="outline" className="hidden border-slate-200 px-2.5 py-1 text-slate-500 sm:inline-flex">
          {today}
        </Badge>

        {/* User profile dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-2 py-1.5 transition-colors hover:bg-white">
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
            <ChevronDown size={12} className="hidden text-slate-400 md:block" />
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200/60 bg-white py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Home className="h-4 w-4 text-slate-400" />
              Back to Home
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User className="h-4 w-4 text-slate-400" />
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              Settings
            </Link>
            <div className="my-1 border-t border-slate-100" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
