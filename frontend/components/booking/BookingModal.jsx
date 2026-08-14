'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { consultantService } from '@/services/consultantService';
import BookingFlow from './BookingFlow';

/**
 * Modal wrapper for the 4-step booking flow.
 *
 * Opens instantly with a consultant object (recommended — the list serializer
 * already returns everything the flow needs). If only a slug is available the
 * consultant is fetched on open and a skeleton is shown.
 *
 * Responsive: full-width bottom sheet on small screens, centered `max-w-2xl`
 * dialog on `sm` and up. Dismissal (overlay / Escape) is blocked while the
 * booking request is in flight.
 */
export default function BookingModal({ open, onOpenChange, consultant: propConsultant, slug }) {
  const [submitting, setSubmitting] = useState(false);

  const handleOpenChange = (next) => {
    if (!next && submitting) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => submitting && e.preventDefault()}
        onEscapeKeyDown={(e) => submitting && e.preventDefault()}
        className="bottom-0 left-0 top-auto flex max-h-[92dvh] max-w-full translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-b-none rounded-t-2xl border border-slate-200/80 bg-white p-0 shadow-2xl sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
      >
        <DialogTitle className="sr-only">Book an appointment</DialogTitle>
        <DialogDescription className="sr-only">
          Book a consultation with {propConsultant?.user?.full_name || 'a consultant'}
        </DialogDescription>

        {propConsultant?.id ? (
          <BookingFlow
            consultant={propConsultant}
            onClose={() => onOpenChange(false)}
            onSubmittingChange={setSubmitting}
          />
        ) : (
          <ConsultantLoader slug={slug} onClose={() => onOpenChange(false)} onSubmittingChange={setSubmitting} />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Fetches a consultant by slug inside the modal. Its state is scoped to this
// component, which remounts every time the dialog opens, so the skeleton /
// error view is always fresh.
function ConsultantLoader({ slug, onClose, onSubmittingChange }) {
  const [fetched, setFetched] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    consultantService
      .getBySlug(slug)
      .then((res) => {
        if (active) setFetched(res.data);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (error) return <BookingError onClose={onClose} />;
  if (!fetched) return <BookingSkeleton />;
  return (
    <BookingFlow consultant={fetched} onClose={onClose} onSubmittingChange={onSubmittingChange} />
  );
}

function BookingSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 flex-1 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

function BookingError({ onClose }) {
  return (
    <div className="flex flex-col items-center gap-4 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
        <AlertCircle className="h-6 w-6 text-rose-400" />
      </div>
      <div>
        <p className="text-base font-bold text-slate-900">Booking unavailable</p>
        <p className="mt-1 text-sm text-slate-500">
          We couldn&apos;t load this consultant. Please try again.
        </p>
      </div>
      <Button variant="outline" onClick={onClose} className="rounded-xl text-slate-600">
        Close
      </Button>
    </div>
  );
}
