"use client";

import { LogFAB } from "@/features/logging/ui";
import { FlareOverlay } from "@/features/flare";
import { RouteGuard } from "@/shared/components/route-guard";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
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
          <div className="mt-10 px-4 pb-10 text-center text-xs text-slate-500 dark:text-slate-600">
            {t("builtBy")}{" "}
            <a
              href="https://ilias.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              {t("name")}
            </a>
          </div>
          <LogFAB />
        </motion.main>
      </RouteGuard>
    </div>
  );
}
