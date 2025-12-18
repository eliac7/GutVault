"use client";

import { motion } from "motion/react";
import { Trash2, Pencil } from "lucide-react";
import { SYMPTOM_LABELS, type LogEntry } from "@/shared/db";
import { BristolImage } from "@/shared/ui/bristol-image";
import { Button } from "@/shared/ui/button";
import type { LogItemProps } from "../types";

const EDITABLE_LOG_TYPES = ["bowel_movement", "meal", "symptom"] as const;

function getLogIcon(log: LogEntry): React.ReactNode {
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
}

function getLogTitle(log: LogEntry): string {
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
}

function getLogDetails(log: LogEntry): string {
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
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function canEditLog(log: LogEntry): boolean {
  return EDITABLE_LOG_TYPES.includes(
    log.type as (typeof EDITABLE_LOG_TYPES)[number]
  );
}

export function LogItem({ log, onDelete, onEdit }: LogItemProps) {
  const isEditable = canEditLog(log);
  const details = getLogDetails(log);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
      className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
    >
      <LogIcon log={log} />
      <div className="flex-1 min-w-0">
        <LogHeader
          title={getLogTitle(log)}
          time={formatTime(log.timestamp.toISOString())}
          isEditable={isEditable}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        {details && <LogDetails details={details} />}
      </div>
    </motion.div>
  );
}

function LogIcon({ log }: { log: LogEntry }) {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-100 dark:bg-slate-700 shrink-0">
      {getLogIcon(log)}
    </div>
  );
}

interface LogHeaderProps {
  title: string;
  time: string;
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function LogHeader({
  title,
  time,
  isEditable,
  onEdit,
  onDelete,
}: LogHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {time}
        </p>
      </div>
      <LogActions isEditable={isEditable} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

interface LogActionsProps {
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function LogActions({ isEditable, onEdit, onDelete }: LogActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {isEditable && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 shrink-0"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

function LogDetails({ details }: { details: string }) {
  return (
    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
      {details}
    </p>
  );
}
