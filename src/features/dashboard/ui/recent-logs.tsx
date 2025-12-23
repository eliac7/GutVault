"use client";

import { Link } from "@/i18n/navigation";
import { useLogs, type LogEntry } from "@/shared/db";
import { BristolImage } from "@/shared/ui/bristol-image";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

function LogEntryItem({ log }: { log: LogEntry }) {
  const time = new Date(log.timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const tLog = useTranslations("logging");
  const tSymptoms = useTranslations("logging.symptoms");
  const tCommon = useTranslations("common");

  const getIcon = () => {
    switch (log.type) {
      case "bowel_movement":
        return log.bristolType ? (
          <BristolImage type={log.bristolType} className="size-6 lg:size-8" />
        ) : (
          "💩"
        );
      case "meal":
        return "🍽️";
      case "symptom":
        return "🤕";
      case "medication":
        return "💊";
      default:
        return "📝";
    }
  };

  const getTitle = () => {
    switch (log.type) {
      case "bowel_movement":
        return log.bristolType
          ? tLog("logTitles.bristolType", { type: log.bristolType })
          : tLog("logTitles.bowelMovement");
      case "meal":
        return log.foods?.join(", ") || tLog("logTitles.meal");
      case "symptom":
        return (
          log.symptoms?.map((s) => tSymptoms(s)).join(", ") ||
          tLog("logTitles.symptoms")
        );
      case "medication":
        return log.medication || tCommon("labels.medication");
      default:
        return tLog("logTitles.logEntry");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-col sm:flex-row flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white dark:bg-slate-700 shadow-sm">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 dark:text-slate-100 truncate whitespace-normal ">
          {getTitle()}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {time}
          {log.painLevel &&
            ` · ${tLog("logDetails.pain")}: ${log.painLevel}/10`}
          {log.stressLevel &&
            ` · ${tLog("logDetails.stress")}: ${log.stressLevel}/10`}
        </p>
      </div>
    </motion.div>
  );
}

export function RecentLogs() {
  const logs = useLogs(3);
  const t = useTranslations("dashboard.recentLogs");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="p-4 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex-col sm:flex-row flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t("title")}
          </h2>
          <Link href="/history">
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 dark:text-emerald-400 rounded-xl"
            >
              {t("viewAll")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {logs && logs.length > 0 ? (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <LogEntryItem key={log.id ?? index} log={log} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              {t("noLogs")}. {t("startTracking")}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
