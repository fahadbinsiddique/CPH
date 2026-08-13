"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      const onLoad = () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            // Reload once the updated SW takes control (after SKIP_WAITING).
            navigator.serviceWorker.addEventListener("controllerchange", () => {
              window.location.reload();
            });

            // New version available — offer to refresh.
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              newWorker?.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  toast("New version available", {
                    description: "Reload to get the latest update.",
                    duration: 15000,
                    action: {
                      label: "Refresh",
                      onClick: () => {
                        if (newWorker.state === "waiting") {
                          newWorker.postMessage({ type: "SKIP_WAITING" });
                        } else {
                          registration.update();
                        }
                      },
                    },
                  });
                }
              });
            });
          })
          .catch((err) => console.error("SW registration failed:", err));
      };

      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return null;
}