'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, Shield, User, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthGuard from '@/components/shared/AuthGuard';
import api from '@/lib/api';

const ROLE_CONFIG = {
  client:     { label: 'Client',     color: 'bg-blue-100 text-blue-700',   icon: User },
  consultant: { label: 'Consultant', color: 'bg-purple-100 text-purple-700', icon: UserCheck },
  admin:      { label: 'Admin',      color: 'bg-red-100 text-red-700',     icon: Shield },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/auth/users/')
      .then(res => setUsers(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const byRole = (role) => filtered.filter(u => u.role === role);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Users</h1>
        <p className="text-slate-400 text-sm mb-6">{users.length} total users</p>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-5">
              <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="client">Clients ({byRole('client').length})</TabsTrigger>
              <TabsTrigger value="consultant">Consultants ({byRole('consultant').length})</TabsTrigger>
            </TabsList>

            {['all', 'client', 'consultant'].map(tab => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-2">
                  {(tab === 'all' ? filtered : byRole(tab)).map(u => {
                    const config = ROLE_CONFIG[u.role] || ROLE_CONFIG.client;
                    const Icon = config.icon;
                    return (
                      <Card key={u.id} className="border border-slate-100 shadow-sm rounded-xl">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold flex-shrink-0">
                            {u.full_name?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 truncate">{u.full_name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${config.color}`}>
                              <Icon className="w-3 h-3" />
                              {config.label}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(u.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AuthGuard>
  );
}