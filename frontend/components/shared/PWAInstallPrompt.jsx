
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(display-mode: standalone)").matches;
    }
    return false;
  });

  
  const [isIOS] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
        !window.MSStream
      );
    }
    return false;
  });

  useEffect(() => {
    if (isInstalled) return;

    if (isIOS) {
      const dismissed = localStorage.getItem("cph-pwa-ios-dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setShowPrompt(true), 4000);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Android / Desktop
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      const dismissCount = parseInt(
        localStorage.getItem("cph-pwa-dismiss-count") || "0"
      );
      const lastShown = localStorage.getItem("cph-pwa-last-shown");
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;

      if (
        dismissCount < 3 &&
        (!lastShown || parseInt(lastShown) < threeDaysAgo)
      ) {
        setTimeout(() => setShowPrompt(true), 4000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.removeItem("cph-pwa-dismiss-count");
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [isInstalled, isIOS]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
    if (outcome === "accepted") setIsInstalled(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("cph-pwa-last-shown", Date.now().toString());

    const count =
      parseInt(localStorage.getItem("cph-pwa-dismiss-count") || "0") + 1;
    localStorage.setItem("cph-pwa-dismiss-count", count.toString());

    if (isIOS) localStorage.setItem("cph-pwa-ios-dismissed", "true");
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm">
                Install CPH App
              </p>
              {isIOS ? (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Tap{" "}
                  <span className="font-medium text-blue-600">
                    Share ⎋
                  </span>{" "}
                  then{" "}
                  <span className="font-medium text-blue-600">
                    Add to Home Screen
                  </span>
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-0.5">
                  Quick access · Works offline
                </p>
              )}
            </div>

            <button
              onClick={handleDismiss}
              className="text-slate-300 hover:text-slate-500 flex-shrink-0 mt-0.5 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isIOS && (
            <div className="flex gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-slate-400 text-xs"
                onClick={handleDismiss}
              >
                Not now
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                onClick={handleInstall}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Install
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}