"use client";

import { motion } from "motion/react";
import { Clock, Activity, TrendingUp } from "lucide-react";
import { useLastBowelMovement, useLogsLastDays } from "@/shared/db";
import { Card } from "@/shared/ui/card";

export function AtAGlance() {
  const lastBM = useLastBowelMovement();
  const recentLogs = useLogsLastDays(1);

  // Calculate time since last bowel movement
  const getTimeSince = () => {
    if (!lastBM?.timestamp) return "No data yet";

    const now = new Date();
    const lastTime = new Date(lastBM.timestamp);
    const diffMs = now.getTime() - lastTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours >= 24) {
      const days = Math.floor(diffHours / 24);
      return `${days}d ${diffHours % 24}h ago`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  };

  // Get today's log count
  const todayCount = recentLogs?.length ?? 0;

  // Get last pain level
  const lastPainLevel = recentLogs?.find((log) => log.painLevel)?.painLevel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-4 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          At a Glance
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {/* Time Since Last BM */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {getTimeSince().split(" ")[0]}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {getTimeSince().includes("No data")
                ? "Start logging"
                : getTimeSince().split(" ").slice(1).join(" ")}
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
              logs today
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
              last pain
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
