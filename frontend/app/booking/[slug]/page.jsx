'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { consultantService } from '@/services/consultantService';
import useAuthStore from '@/store/authStore';
import { requireLogin } from '@/lib/authGate';
import BookingFlow from '@/components/booking/BookingFlow';

/**
 * Standalone booking page — kept for direct URL access to `/booking/[slug]`.
 * It reuses the shared <BookingFlow /> so the page and the modal never drift.
 */
export default function BookingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      requireLogin();
      return;
    }
    consultantService
      .getBySlug(slug)
      .then((res) => setConsultant(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-teal-600" />
          <p className="text-sm font-medium text-slate-500">Loading your booking experience...</p>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200/60 bg-white/80 p-10 text-center shadow-xl backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <AlertCircle className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">Booking unavailable</p>
            <p className="mt-1 text-sm text-slate-500">
              This consultant could not be found or is no longer available.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/consultant')}
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Consultants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl shadow-slate-200/30">
          <BookingFlow consultant={consultant} />
        </div>
      </div>
    </div>
  );
}
