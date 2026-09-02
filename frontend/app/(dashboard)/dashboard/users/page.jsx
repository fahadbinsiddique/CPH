'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, User, UserCheck, Shield, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import AuthGuard from '@/components/shared/AuthGuard';
import api from '@/lib/api';
import { containerVariants, itemVariants } from '@/lib/motion';
import { getRoleStyle, ROLE_LABEL } from '@/lib/roles';

const ROLE_CONFIG = {
  client: { icon: User, style: 'client' },
  consultant: { icon: UserCheck, style: 'consultant' },
  admin: { icon: ShieldCheck, style: 'admin' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get('/api/admin/users/')
      .then((res) => setUsers(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const byRole = (role) => filtered.filter((u) => u.role === role);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl space-y-6"
      >
        <PageHeader
          badge="User Management"
          badgeIcon={Users}
          title="Users"
          subtitle={`${users.length} total users`}
        />

        {/* Search */}
        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
          />
        </motion.div>

        {loading ? (
          <LoadingState label="Loading users..." />
        ) : (
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="all">
              <TabsList className="mb-5 flex flex-wrap bg-white/80 border border-slate-200/60 shadow-sm backdrop-blur-sm">
                <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
                <TabsTrigger value="client">Clients ({byRole('client').length})</TabsTrigger>
                <TabsTrigger value="consultant">Consultants ({byRole('consultant').length})</TabsTrigger>
              </TabsList>

              {['all', 'client', 'consultant'].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  {(tab === 'all' ? filtered : byRole(tab)).length > 0 ? (
                    <div className="space-y-3">
                      {(tab === 'all' ? filtered : byRole(tab)).map((u) => {
                        const cfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.client;
                        const Icon = cfg.icon;
                        const style = getRoleStyle(cfg.style);
                        return (
                          <Card
                            key={u.id}
                            className="group dash-card dash-card-hover relative overflow-hidden"
                          >
                            <div className="dash-accent" />
                            <CardContent className="flex items-center gap-4 p-4">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-bold text-white shadow-sm ${style.gradient}`}
                              >
                                {u.full_name?.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-slate-800">{u.full_name}</p>
                                <p className="text-xs text-slate-400">{u.email}</p>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${style.chip}`}
                                >
                                  <Icon className="h-3 w-3" />
                                  {ROLE_LABEL[u.role] || u.role}
                                </span>
                                <span className="hidden text-xs text-slate-400 md:inline">
                                  {new Date(u.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Shield}
                      title="No users found"
                      description={
                        search ? `No results match "${search}"` : 'There are no users in this category.'
                      }
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        )}
      </motion.div>
    </AuthGuard>
  );
}