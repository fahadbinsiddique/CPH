'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  LogOut,
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
  Presentation,
  ExternalLink,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import { getRoleStyle, getInitials, ROLE_LABEL } from '@/lib/roles';
import { cn } from '@/lib/utils';

export const NAV_SECTIONS = {
  client: [
    {
      label: 'General',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
        { href: '/dashboard/bookings', label: 'Appointments', icon: Calendar, color: 'from-teal-500 to-teal-600' },
        { href: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList, color: 'from-emerald-400 to-emerald-500' },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: User, color: 'from-teal-400 to-emerald-400' },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-stone-400 to-stone-500' },
      ],
    },
  ],
  consultant: [
    {
      label: 'General',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
        { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar, color: 'from-teal-500 to-teal-600' },
        { href: '/dashboard/availability', label: 'Availability', icon: Clock, color: 'from-emerald-400 to-emerald-500' },
        { href: '/dashboard/patients', label: 'My Patients', icon: Users, color: 'from-teal-400 to-emerald-400' },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: User, color: 'from-teal-400 to-emerald-400' },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-stone-400 to-stone-500' },
      ],
    },
  ],
  admin: [
    {
      label: 'General',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, color: 'from-teal-500 to-emerald-500' },
      ],
    },
    {
      label: 'Management',
      items: [
        { href: '/dashboard/users', label: 'Manage Users', icon: Users, color: 'from-teal-500 to-teal-600' },
        { href: '/dashboard/consultants', label: 'Consultants', icon: Shield, color: 'from-emerald-400 to-emerald-500' },
        { href: '/dashboard/specializations', label: 'Specializations', icon: Tag, color: 'from-teal-500 to-emerald-500' },
        { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar, color: 'from-emerald-400 to-emerald-500' },
        { href: '/dashboard/blogs', label: 'Blog & Articles', icon: BookOpen, color: 'from-teal-400 to-emerald-400' },
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
      items: [{ href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-stone-400 to-stone-500' }],
    },
  ],
};

export function allNavItems(role) {
  return (NAV_SECTIONS[role] || NAV_SECTIONS.client).flatMap((s) => s.items);
}

export function getPageLabel(pathname, role) {
  const items = allNavItems(role);
  const match = items.find((item) =>
    item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
  );
  return match?.label || 'Dashboard';
}

export default function DashboardSidebar({ instanceId = 'desktop', onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
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
    <div className="flex h-full min-h-0 flex-col bg-card">
      {/* Brand Logo */}
      <div className="shrink-0 border-b border-border px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Image
            src="/logo1.png"
            alt="CPH"
            width={210}
            height={100}
            className="h-11 w-auto max-w-full rounded-lg object-contain lg:h-14"
            priority
          />
          
        </Link>
      </div>

      {/* User card */}
      <div className="shrink-0 border-b border-border px-4 py-5">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/80 to-card p-4 shadow-sm">
          <div
            className={`absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-br ${roleStyle.gradient} opacity-10 blur-2xl`}
          />
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                <AvatarFallback
                  className={`bg-gradient-to-br ${roleStyle.gradient} text-lg font-bold text-on-primary`}
                >
                  {getInitials(user?.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-accent shadow-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{user?.full_name || 'User'}</p>
              <Badge className={`mt-0.5 border text-[10px] font-semibold capitalize ${roleStyle.badge}`}>
                {ROLE_LABEL[role] || role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="cph-scroll min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-3 py-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-3.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
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
                        active ? 'text-foreground' : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId={`${instanceId}-active`}
                          className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          'relative z-10 h-[18px] w-[18px] shrink-0 transition-all duration-300',
                          active ? 'scale-110 text-primary' : 'text-muted-foreground/60'
                        )}
                      />
                      <span className="relative z-10 tracking-wide">{item.label}</span>
                      {active && <ChevronRight className="relative z-10 ml-auto h-4 w-4 text-primary" />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 space-y-1 border-t border-border px-3 py-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-[18px] w-[18px] text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
          <span>Go to Main Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-sm font-semibold text-destructive transition-all duration-200 hover:border-destructive/30 hover:bg-destructive/10"
        >
          <LogOut className="h-[18px] w-[18px] text-destructive transition-transform group-hover:translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
