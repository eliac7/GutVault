import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/shared/db";
import { startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { CloudCog } from "lucide-react";

export interface DailyStat {
  date: Date;
  avgPain: number | null;
  maxPain: number | null;
  logCount: number;
  hasSymptoms: boolean;
}

export function useMonthlyStats(currentMonth: Date) {
  return useLiveQuery(
    async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);

      // Get all logs for this month
      const logs = await db.logs
        .where("timestamp")
        .between(start, end)
        .toArray();

      const stats: Record<string, DailyStat> = {};

      logs.forEach((log) => {
        const dayKey = log.timestamp.toDateString(); // Group by day

        if (!stats[dayKey]) {
          stats[dayKey] = {
            date: log.timestamp,
            avgPain: 0,
            maxPain: 0,
            logCount: 0,
            hasSymptoms: false,
          };
        }

        const dayStat = stats[dayKey];

        // Track pain
        if (log.painLevel) {
          dayStat.avgPain = (dayStat.avgPain || 0) + log.painLevel;
          dayStat.maxPain = Math.max(dayStat.maxPain || 0, log.painLevel);
        }

        // Track symptoms
        if (log.symptoms && log.symptoms.length > 0) {
          dayStat.hasSymptoms = true;
        }

        dayStat.logCount += 1;
      });

      Object.values(stats).forEach((stat) => {
        if (stat.avgPain !== null && stat.logCount > 0) {
          const logsWithPain = logs.filter(
            (l) => isSameDay(l.timestamp, stat.date) && l.painLevel
          ).length;
          stat.avgPain =
            logsWithPain > 0
              ? Math.round((stat.avgPain as number) / logsWithPain)
              : null;
        }
      });

      return stats;
    },
    [currentMonth],
    {} as Record<string, DailyStat>
  );
}
