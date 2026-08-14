'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnsavedChangesDialog({
  onCancel,
  onConfirm,
  message = 'You have unsaved changes that will be lost if you leave this page.',
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-dialog-title"
        className="relative w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="space-y-1">
            <h2 id="unsaved-dialog-title" className="text-lg font-bold text-slate-900">
              Discard unsaved changes?
            </h2>
            <p className="text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Keep Editing
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Discard Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
