"use client";

import { LogFAB } from "@/features/logging/ui";
import { FlareOverlay } from "@/features/flare";
import { RouteGuard } from "@/shared/components/route-guard";
import { motion } from "motion/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <RouteGuard>
        <FlareOverlay />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="pb-24 pt-safe"
        >
          {children}
          <LogFAB />
        </motion.main>
      </RouteGuard>
    </div>
  );
}

