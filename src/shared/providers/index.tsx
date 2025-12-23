"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useReminders } from "@/features/settings/hooks/use-reminders";
import { LockProvider } from "./lock-provider";
import { FlareProvider } from "@/features/flare";
import { PwaInstallBanner } from "@/shared/ui/pwa-install-banner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useReminders();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered callback", registration);
        })
        .catch((error) => {
          console.error("SW registration failed", error);
        });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LockProvider>
        <FlareProvider>{children}</FlareProvider>
      </LockProvider>
      <Toaster richColors position="top-center" />
      <PwaInstallBanner />
    </ThemeProvider>
  );
}
