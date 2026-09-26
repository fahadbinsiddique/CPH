'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef(null);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const role = user?.role || 'client';
  const roleStyle = getRoleStyle(role);
  const pageLabel = getPageLabel(pathname, role);

  // Account menu is click-driven so it works with touch and keyboard
  // (hover-only menus are unreachable on phones).
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handlePointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

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
        'sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-all duration-300 sm:gap-3 sm:px-6 lg:px-8',
        scrolled
          ? 'border-border bg-background/90 shadow-sm backdrop-blur-md'
          : 'border-border bg-background/70 backdrop-blur-sm'
      )}
    >
      {/* Mobile sidebar toggle */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 h-11 w-11 shrink-0 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(19rem,85vw)] gap-0 p-0">
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar instanceId="mobile" onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Breadcrumbs */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="hidden shrink-0 text-sm font-bold tracking-tight text-foreground sm:inline lg:text-[11px] lg:font-semibold lg:tracking-wider lg:text-muted-foreground lg:uppercase">
          Dashboard
        </span>
        <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/60 sm:block" />
        <span className="truncate text-sm font-bold text-foreground">{pageLabel}</span>
      </div>

      {/* Right side actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 lg:h-9 lg:w-9"
          onClick={handleBell}
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        <Badge variant="outline" className="hidden border-border px-2.5 py-1 text-muted-foreground sm:inline-flex">
          {today}
        </Badge>

        {/* User account menu */}
        <div className="relative" ref={accountRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="account-menu"
            aria-label="Account menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-background/70 px-2 py-1.5 transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none lg:min-h-0"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback
                className={`bg-gradient-to-br text-[10px] font-bold text-on-primary ${roleStyle.gradient}`}
              >
                {getInitials(user?.full_name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[8rem] truncate text-xs font-semibold text-foreground md:inline">
              {user?.full_name?.split(' ')[0]}
            </span>
            <ChevronDown
              size={12}
              className={cn(
                'shrink-0 text-muted-foreground/60 transition-transform duration-200',
                menuOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown */}
          <div
            id="account-menu"
            role="menu"
            aria-label="Account"
            className={cn(
              'absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-card py-1.5 shadow-xl transition-all duration-200',
              menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
            )}
          >
            <Link
              href="/"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Home className="h-4 w-4 text-muted-foreground/60" />
              Back to Home
            </Link>
            <Link
              href="/dashboard/profile"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <User className="h-4 w-4 text-muted-foreground/60" />
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Settings className="h-4 w-4 text-muted-foreground/60" />
              Settings
            </Link>
            <div className="my-1 border-t border-border" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
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
