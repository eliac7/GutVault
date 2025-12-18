"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import { useLogs, deleteLog, type LogEntry, SYMPTOM_LABELS } from "@/shared/db";
import { BristolImage } from "@/shared/ui/bristol-image";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

interface GroupedLogs {
  date: string;
  dateLabel: string;
  logs: LogEntry[];
}

function LogItem({ log, onDelete }: { log: LogEntry; onDelete: () => void }) {
  const time = new Date(log.timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const getIcon = () => {
    switch (log.type) {
      case "bowel_movement":
        return log.bristolType ? (
          <BristolImage
            type={log.bristolType}
            className="size-12 md:size-16 lg:size-18"
          />
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
          ? `Bristol Type ${log.bristolType}`
          : "Bowel Movement";
      case "meal":
        return log.foods?.join(", ") || "Meal";
      case "symptom":
        return "Symptoms Logged";
      case "medication":
        return log.medication || "Medication";
      default:
        return "Log Entry";
    }
  };

  const getDetails = () => {
    const details: string[] = [];

    if (log.painLevel) {
      details.push(`Pain: ${log.painLevel}/10`);
    }

    if (log.symptoms && log.symptoms.length > 0) {
      details.push(log.symptoms.map((s) => SYMPTOM_LABELS[s]).join(", "));
    }

    if (log.notes) {
      details.push(log.notes);
    }

    return details.join(" · ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
      className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-100 dark:bg-slate-700 shrink-0">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {getTitle()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {time}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {getDetails() && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
            {getDetails()}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function HistoryList() {
  const logs = useLogs();

  // Group logs by date
  const groupedLogs = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    const groups: Record<string, LogEntry[]> = {};

    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const key = date.toDateString();

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(log);
    });

    return Object.entries(groups).map(([dateString, logs]) => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateLabel: string;
      if (date.toDateString() === today.toDateString()) {
        dateLabel = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
      }

      return {
        date: dateString,
        dateLabel,
        logs,
      } as GroupedLogs;
    });
  }, [logs]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this log?")) {
      await deleteLog(id);
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <Card className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No logs yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Start tracking your gut health by tapping the + button on the
          dashboard.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {groupedLogs.map((group) => (
        <div key={group.date}>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
            {group.dateLabel}
          </h3>
          <div className="space-y-3">
            {group.logs.map((log) => (
              <LogItem
                key={log.id}
                log={log}
                onDelete={() => log.id && handleDelete(log.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
