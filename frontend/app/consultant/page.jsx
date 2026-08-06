'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, Filter } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ConsultantCard from '@/components/shared/ConsultantCard';
import Reveal from '@/components/ui/Reveal';

import { consultantService } from '@/services/consultantService';
import { useDebounce } from '@/hooks/useDebounce';

export default function ConsultantListPage() {
  const [consultants, setConsultants] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // Fetch consultants
  const fetchConsultants = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(selectedSpec && { specializations__slug: selectedSpec }),
        ...(availableOnly && { is_available: true }),
      };

      const res = await consultantService.getAll(params);
      setConsultants(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedSpec, availableOnly]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConsultants();
  }, [fetchConsultants]);

  useEffect(() => {
    consultantService
      .getSpecializations()
      .then((res) => setSpecializations(res.data))
      .catch(console.error);
  }, []);

  const clearFilters = () => {
    setSearch('');
    setSelectedSpec('');
    setAvailableOnly(false);
  };

  const hasFilters = search || selectedSpec || availableOnly;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 mt-28">

      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">

        {/* glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-400/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-400/5 blur-3xl rounded-full" />

        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">

          {/* Badge */}
          <Reveal y={20} duration={0.7}>
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Mental Health Experts
              </div>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal y={26} duration={0.8} delay={0.1}>
            <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Therapist
              </span>
            </h1>
          </Reveal>

          <Reveal y={22} duration={0.8} delay={0.2}>
            <p className="text-center text-sm sm:text-base text-slate-500 mt-4 max-w-2xl mx-auto">
              Search, filter, and book licensed mental health professionals instantly with confidence.
            </p>
          </Reveal>

          {/* ================= SEARCH PANEL ================= */}
          <Reveal y={30} duration={0.9} delay={0.3} className="mt-10">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-sm p-5 space-y-5">

            {/* search row */}
            <div className="flex flex-col md:flex-row gap-3">

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search therapist, specialization, location..."
                  className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-teal-400"
                />
              </div>

              <Button
                onClick={() => setAvailableOnly((p) => !p)}
                className={`h-11 px-5 rounded-full font-semibold transition-all ${
                  availableOnly
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'border border-teal-600 text-teal-700 bg-white hover:bg-teal-50'
                }`}
              >
                Available Today
              </Button>

              {hasFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-red-500 hover:bg-red-50 rounded-full"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* filters */}
            <div className="space-y-2">

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Filter className="w-3 h-3" />
                Filter by specialization
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <Badge
                  onClick={() => setSelectedSpec('')}
                  className={`cursor-pointer px-3 py-1 rounded-full whitespace-nowrap ${
                    !selectedSpec
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  All
                </Badge>

                {specializations.map((spec) => (
                  <Badge
                    key={spec.slug}
                    onClick={() =>
                      setSelectedSpec(
                        selectedSpec === spec.slug ? '' : spec.slug
                      )
                    }
                    className={`cursor-pointer px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                      selectedSpec === spec.slug
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {spec.name}
                  </Badge>
                ))}
              </div>
            </div>

          </div>
          </Reveal>
        </div>
      </div>

      {/* ================= RESULTS ================= */}
      <div className="max-w-6xl mx-auto px-4 py-12">

        {!loading && (
          <div className="mb-6 text-sm text-slate-500">
            Showing{' '}
            <span className="font-bold text-teal-800">
              {consultants.length}
            </span>{' '}
            experts
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 animate-pulse"
              >
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))
          ) : consultants.length > 0 ? (
            <AnimatePresence>
              {consultants.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ConsultantCard consultant={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full text-center py-24">
              <div className="text-slate-500 mb-3">
                No consultants found matching your filters
              </div>
              <Button
                onClick={clearFilters}
                className="bg-teal-600 text-white rounded-full px-6"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}