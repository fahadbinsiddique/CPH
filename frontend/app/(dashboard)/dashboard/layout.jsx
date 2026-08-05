'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Brain,
  Users,
  BookOpen,
  BarChart3,
  ChevronRight,
  Clock,
  Shield,
  Sparkles,
  Heart,
  ChevronLeft,
  ClipboardList
  
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/authStore';
import AuthGuard from '@/components/shared/AuthGuard';
import { toast } from 'sonner';

const NAV_ITEMS = {
  client: [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
    { href: '/dashboard/bookings', label: 'Appointments', icon: Calendar, color: 'from-blue-400 to-indigo-500' },
    { href: '/dashboard/profile', label: 'Profile', icon: User, color: 'from-purple-400 to-pink-500' },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-slate-400 to-slate-500' },
    { href: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList , color: 'from-blue-400 to-indigo-500'},
  ],
  consultant: [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
    { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar, color: 'from-blue-400 to-indigo-500' },
    { href: '/dashboard/availability', label: 'Availability', icon: Clock, color: 'from-amber-400 to-orange-500' },
    { href: '/dashboard/patients', label: 'My Patients', icon: Users, color: 'from-rose-400 to-pink-500' },
    { href: '/dashboard/profile', label: 'Profile', icon: User, color: 'from-purple-400 to-pink-500' },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-slate-400 to-slate-500' },
  ],
  admin: [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-teal-400 to-emerald-500' },
    { href: '/dashboard/users', label: 'Manage Users', icon: Users, color: 'from-blue-400 to-indigo-500' },
    { href: '/dashboard/consultants', label: 'Consultants', icon: Shield, color: 'from-violet-400 to-purple-500' },
    { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar, color: 'from-amber-400 to-orange-500' },
    { href: '/dashboard/blogs', label: 'Blog & Articles', icon: BookOpen, color: 'from-rose-400 to-pink-500' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, color: 'from-indigo-400 to-blue-500' },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, color: 'from-slate-400 to-slate-500' },
  ],
};

const ROLE_BADGE_STYLE = {
  admin: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200/60',
  consultant: 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200/60',
  client: 'bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 border-teal-200/60',
};

const ROLE_COLORS = {
  admin: 'from-purple-600 to-violet-600',
  consultant: 'from-indigo-600 to-blue-600',
  client: 'from-teal-600 to-emerald-600',
};

function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const role = user?.role || 'client';
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.client;
  const roleColor = ROLE_COLORS[role] || ROLE_COLORS.client;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful")
    } catch (error) {
      console.error("Component logout error:", error);
    }
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-white/90 backdrop-blur-xl border-r border-slate-200/60 z-50
          flex flex-col transition-all duration-300 ease-in-out shadow-2xl shadow-slate-200/30
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:shadow-none lg:bg-white/70
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between  px-6 h-20 border-b border-slate-200/60 shrink-0">
          <div className="flex items-center gap-3">
            
            <div className="flex flex-col">
              
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Dashboard</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="px-4 py-5 border-b border-slate-200/60 shrink-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60 rounded-2xl p-4 shadow-sm overflow-hidden"
          >
            {/* Decorative glow */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${roleColor} rounded-full blur-2xl opacity-10`} />
            
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-white shadow-md">
                  <AvatarFallback className={`bg-gradient-to-br ${roleColor} text-white font-bold text-lg`}>
                    {getInitials(user?.full_name || 'User' )}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name || 'User'}</p>
                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 mt-0.5 border capitalize ${ROLE_BADGE_STYLE[role]}`}>
                  {role}
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(({ href, label, icon: Icon, color }) => {
            const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
            
            return (
              <Link key={href} href={href} onClick={onClose} className="block">
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium
                    transition-all duration-300 relative cursor-pointer
                    ${isActive
                      ? `bg-gradient-to-r ${color} text-white shadow-lg shadow-teal-500/20`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }
                  `}
                >
                  <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="tracking-wide">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto"
                    >
                      <ChevronRight className="w-4 h-4 text-white/80" />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="px-3 py-4 border-t border-slate-200/60 shrink-0 space-y-2">
          {/* Quick action badge */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3 border border-teal-200/60 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-medium text-slate-600">
              Need help? <Link href="/support" className="text-teal-600 font-semibold hover:underline">Contact support</Link>
            </span>
          </motion.div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50/80 w-full transition-all duration-200 group border border-transparent hover:border-rose-200/40"
          >
            <LogOut className="w-4.5 h-4.5 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AuthGuard>
      <div className="flex mt-30 h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden font-sans">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <header
            className={`
              lg:hidden h-16 px-5 flex items-center justify-between flex-shrink-0 z-30
              transition-all duration-300
              ${scrolled 
                ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/60' 
                : 'bg-white/70 backdrop-blur-sm border-b border-slate-200/40'
              }
            `}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/20">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">Dashboard</span>
            </div>
            <div className="w-8" />
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>

           
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}