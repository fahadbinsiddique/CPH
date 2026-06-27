'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthGuard from '@/components/shared/AuthGuard';
import api from '@/lib/api';

export default function AdminConsultantsPage() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetch = () => {
    api.get('/api/consultants/admin/list/')
      .then(res => setConsultants(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleVerify = async (id, value) => {
    setUpdatingId(id);
    try {
      await api.patch(`/api/consultants/admin/${id}/verify/`, { is_verified: value });
      fetch();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = consultants.filter(c =>
    c.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const verified = filtered.filter(c => c.is_verified);
  const unverified = filtered.filter(c => !c.is_verified);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Consultants</h1>
        <p className="text-slate-400 text-sm mb-6">
          {verified.length} verified · {unverified.length} pending
        </p>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search consultants..."
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
          <Tabs defaultValue="pending">
            <TabsList className="mb-5">
              <TabsTrigger value="pending">Pending ({unverified.length})</TabsTrigger>
              <TabsTrigger value="verified">Verified ({verified.length})</TabsTrigger>
              <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
            </TabsList>

            {[
              { key: 'pending', data: unverified },
              { key: 'verified', data: verified },
              { key: 'all', data: filtered },
            ].map(({ key, data }) => (
              <TabsContent key={key} value={key}>
                <div className="space-y-3">
                  {data.length > 0 ? data.map(c => (
                    <Card key={c.id} className="border border-slate-100 shadow-sm rounded-2xl">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                          {c.user?.full_name?.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-800">{c.user?.full_name}</p>
                            {c.is_verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{c.user?.email}</p>
                          <div className="flex gap-2 mt-1.5 flex-wrap">
                            {c.specializations?.slice(0, 3).map(s => (
                              <Badge key={s.id} variant="secondary" className="text-xs">
                                {s.name}
                              </Badge>
                            ))}
                            <span className="text-xs text-slate-400">
                              {c.experience_years}y exp · ৳{c.consultation_fee}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {updatingId === c.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          ) : c.is_verified ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 border-red-200 hover:bg-red-50 text-xs h-8"
                              onClick={() => handleVerify(c.id, false)}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Revoke
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                              onClick={() => handleVerify(c.id, true)}
                            >
                              <Shield className="w-3.5 h-3.5 mr-1" /> Verify
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="text-center py-12 text-slate-400 text-sm">
                      No consultants found
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AuthGuard>
  );
}