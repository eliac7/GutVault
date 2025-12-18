import { useState, useMemo } from "react";
import { useLogs, type LogEntry } from "@/shared/db";
import type { GroupedLogs, UseGroupedLogsResult } from "../types";

const ITEMS_PER_PAGE = 7;

function getDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function groupLogsByDate(logs: LogEntry[]): GroupedLogs[] {
  const groups: Record<string, LogEntry[]> = {};

  logs.forEach((log) => {
    const date = new Date(log.timestamp);
    const key = date.toDateString();

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(log);
  });

  return Object.entries(groups).map(([dateString, logs]) => ({
    date: dateString,
    dateLabel: getDateLabel(new Date(dateString)),
    logs,
  }));
}

function paginateGroups(
  groups: GroupedLogs[],
  currentPage: number
): GroupedLogs[] {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return groups.slice(startIndex, endIndex);
}

export function useGroupedLogs(): UseGroupedLogsResult {
  const logs = useLogs();
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedGroups, totalPages, isEmpty } = useMemo(() => {
    if (!logs || logs.length === 0) {
      return { paginatedGroups: [], totalPages: 0, isEmpty: true };
    }

    const allGroups = groupLogsByDate(logs);
    const totalPages = Math.ceil(allGroups.length / ITEMS_PER_PAGE);
    const paginatedGroups = paginateGroups(allGroups, currentPage);

    return { paginatedGroups, totalPages, isEmpty: false };
  }, [logs, currentPage]);

  return {
    paginatedGroups,
    totalPages,
    currentPage,
    setCurrentPage,
    isEmpty,
  };
}

