"use client";

import { motion } from "motion/react";
import { Clock, Activity, TrendingUp } from "lucide-react";
import { useLastBowelMovement, useLogsLastDays } from "@/shared/db";
import { Card } from "@/shared/ui/card";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

export function AtAGlance() {
  const t = useTranslations("dashboard.atAGlance");
  const locale = useLocale();
  const lastBM = useLastBowelMovement();
  const recentLogs = useLogsLastDays(1);

  // Calculate time since last bowel movement
  const getTimeSince = () => {
    if (!lastBM?.timestamp) return "-";

    const lastTime = new Date(lastBM.timestamp);
    return formatDistanceToNow(lastTime, {
      addSuffix: false,
      locale: locale === "el" ? el : undefined,
    });
  };

  // Get today's log count
  const todayCount = recentLogs?.length ?? 0;

  // Get last pain level
  const lastPainLevel = recentLogs?.find((log) => log.painLevel)?.painLevel;

  const timeSince = getTimeSince();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-4 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Time Since Last BM */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {timeSince}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("ago")}
            </span>
          </div>

          {/* Today's Logs */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {todayCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("logsToday")}
            </span>
          </div>

          {/* Last Pain Level */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {lastPainLevel ?? "-"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("lastPain")}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
