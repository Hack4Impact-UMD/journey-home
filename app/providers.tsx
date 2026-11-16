"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { getQueryClient } from "@/lib/queryClient";
import { CLOCK_SKEW_WARN_MS, getClockSkewMs } from "@/lib/utils/limits";
import { QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  // Every record this app writes is stamped with the device clock, and security
  // rules reject stamps that are too far from server time. Without this the user
  // would just see a failed save with no way to tell why.
  useEffect(() => {
    let cancelled = false;
    getClockSkewMs().then((skewMs) => {
      if (cancelled || skewMs === null || Math.abs(skewMs) <= CLOCK_SKEW_WARN_MS) return;
      const minutes = Math.round(Math.abs(skewMs) / 60000);
      toast.warning("Your device clock is wrong", {
        description: `It is about ${minutes} minute${minutes === 1 ? "" : "s"} ${skewMs > 0 ? "ahead of" : "behind"} the correct time. Saving may fail until you fix your date and time settings.`,
        duration: Infinity,
        closeButton: true,
      });
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
}
