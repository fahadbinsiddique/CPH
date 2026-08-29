// components/shared/ConnectionStatusBanner.jsx — global online/offline UX.
// Shows a persistent banner while offline and flushes the sync queue on reconnect.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { flushQueue, getPendingCount, isOnline } from "@/lib/offlineStore";

export default function ConnectionStatusBanner() {
  const online = useOnlineStatus();
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  // Refresh the pending count when the banner appears.
  useEffect(() => {
    if (!online) {
      getPendingCount().then(setPending);
    }
  }, [online]);

  useEffect(() => {
    if (online) {
      const runFlush = async () => {
        const count = await getPendingCount();
        if (!count) return;

        setSyncing(true);
        try {
          const { flushed } = await flushQueue();
          if (flushed > 0) {
            toast.success(`Back online — ${flushed} item${flushed === 1 ? "" : "s"} synced.`);
          }
        } finally {
          setSyncing(false);
          setPending(0);
        }
      };
      runFlush();
    }
  }, [online]);

  if (online) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed top-0 inset-x-0 z-[60] flex justify-center px-4 pt-3"
        role="status"
        aria-live="assertive"
      >
        <div className="flex items-center gap-3 rounded-full bg-slate-900/95 text-white shadow-xl border border-slate-700 px-4 py-2.5 text-sm">
          <WifiOff className="h-4 w-4 text-teal-300 shrink-0" />
          <span className="font-medium">
            You&apos;re offline — showing saved data.
          </span>
          {pending > 0 && (
            <span className="text-slate-300 text-xs">
              {pending} pending item{pending === 1 ? "" : "s"}
            </span>
          )}
          {syncing && <RefreshCw className="h-4 w-4 animate-spin text-teal-300" />}
          <button
            onClick={async () => {
              setSyncing(true);
              try {
                const { flushed } = await flushQueue();
                if (flushed > 0) {
                  toast.success(`${flushed} item${flushed === 1 ? "" : "s"} synced.`);
                }
              } finally {
                setSyncing(false);
                setPending(0);
              }
            }}
            disabled={syncing || isOnline()}
            className="ml-1 flex items-center gap-1 cursor-pointer rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className="h-3 w-3" />
            Sync now
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}