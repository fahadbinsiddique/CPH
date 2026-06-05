// src/app/consultants/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Sparkles, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ConsultantCard from '@/components/shared/ConsultantCard';
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

  // Fetch Consultants based on filters
  const fetchConsultants = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedSpec) params['specializations__slug'] = selectedSpec;
      if (availableOnly) params.is_available = true;

      const res = await consultantService.getAll(params);
      setConsultants(res.data.results || res.data);
    } catch (err) {
      console.error('Error fetching consultants:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedSpec, availableOnly]);

  // Trigger search/filter effect
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConsultants();
  }, [fetchConsultants]);

  // Fetch initial specializations with a clean-up tracker
  useEffect(() => {
    let isMounted = true;
    consultantService.getSpecializations()
      .then(res => {
        if (isMounted) setSpecializations(res.data);
      })
      .catch(err => console.error('Error fetching specializations:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const clearFilters = () => {
    setSearch('');
    setSelectedSpec('');
    setAvailableOnly(false);
  };

  const hasFilters = !!(search || selectedSpec || availableOnly);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 selection:bg-teal-100 selection:text-teal-900">
      
      {/* Premium Hero Header */}
      <div className="relative bg-white border-b border-slate-200/60 overflow-hidden">
        {/* Decorative subtle ambient glows */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-xs font-semibold mb-4 shadow-sm shadow-teal-700/5"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Verified Experts Only
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3"
          >
            Our Professional <span className="text-teal-600 font-black relative bg-clip-text">Consultants</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base text-slate-500 max-w-xl mx-auto font-medium"
          >
            Connect with premium, certified mental health experts dedicated to your holistic well-being and growth.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Luxury Search & Filter Control Panel */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm p-5 mb-8">
          <div className="flex gap-4 flex-wrap items-center">
            
            {/* Search Input Box */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, specialization, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl bg-slate-50/50 shadow-inner text-sm placeholder:text-slate-400"
              />
            </div>

            {/* Premium Available Toggle Button */}
            <Button
              variant={availableOnly ? 'default' : 'outline'}
              size="default"
              onClick={() => setAvailableOnly((v) => !v)}
              className={`h-11 rounded-xl px-5 font-semibold text-sm transition-all duration-200 active:scale-95 shadow-sm gap-2 border-slate-200 ${
                availableOnly 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white border-transparent ring-2 ring-teal-600/10' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Available Today
            </Button>

            {/* Minimalist Clear All Trigger */}
            {hasFilters && (
              <Button 
                variant="ghost" 
                size="default" 
                onClick={clearFilters}
                className="h-11 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50/50 px-4 transition-colors font-medium gap-1.5"
              >
                <X className="w-4 h-4" /> Clear All
              </Button>
            )}
          </div>

          {/* Specialization Filter Badges Segment */}
          {specializations.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Filter className="w-3 h-3" /> Filter by Specialization
              </div>
              
              <div className="flex flex-wrap gap-2">
                <motion.div whileTap={{ scale: 0.96 }}>
                  <Badge
                    variant={!selectedSpec ? 'default' : 'outline'}
                    className={`cursor-pointer px-3.5 py-1.5 text-xs font-semibold rounded-xl tracking-wide transition-all select-none shadow-sm ${
                      !selectedSpec 
                        ? 'bg-slate-900 text-white border-transparent' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedSpec('')}
                  >
                    All Specialties
                  </Badge>
                </motion.div>

                {specializations.map((spec) => {
                  const isSelected = selectedSpec === spec.slug;
                  return (
                    <motion.div whileTap={{ scale: 0.96 }} key={spec.slug}>
                      <Badge
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer px-3.5 py-1.5 text-xs font-semibold rounded-xl tracking-wide transition-all select-none shadow-sm ${
                          isSelected 
                            ? 'bg-teal-600 text-white border-transparent ring-2 ring-teal-600/10' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedSpec(isSelected ? '' : spec.slug)}
                      >
                        {spec.name}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Results Count Status Line */}
        {!loading && (
          <div className="flex items-center justify-between mb-5 px-1 animate-fadeIn">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-800 font-bold">{consultants.length}</span> {consultants.length === 1 ? 'expert' : 'experts'}
            </p>
          </div>
        )}

        {/* Core Consultant Grid Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full bg-slate-100" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-2/3 bg-slate-100" />
                      <Skeleton className="h-3 w-1/2 bg-slate-100" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-5/6 bg-slate-100 mt-2" />
                  <Skeleton className="h-10 w-full rounded-xl bg-slate-100 mt-4" />
                </div>
              ))
            : (
              <AnimatePresence mode="popLayout">
                {consultants.length > 0
                  ? consultants.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ delay: i * 0.03, duration: 0.25, ease: 'easeOut' }}
                      >
                        <ConsultantCard consultant={c} />
                      </motion.div>
                    ))
                  : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-20 bg-white border border-slate-200/80 rounded-2xl shadow-sm max-w-md mx-auto px-6"
                    >
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Search className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-slate-800 font-bold text-base">No Consultants Found</p>
                      <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">We could not find any experts matching your active filters. Try resetting them.</p>
                      <Button 
                        variant="default" 
                        onClick={clearFilters} 
                        className="bg-teal-600 hover:bg-teal-700 text-white mt-5 h-10 rounded-xl px-5 shadow-sm font-semibold text-xs active:scale-95 transition-transform"
                      >
                        Reset All Filters
                      </Button>
                    </motion.div>
                  )
                }
              </AnimatePresence>
            )
          }
        </div>
      </div>
    </div>
  );
}