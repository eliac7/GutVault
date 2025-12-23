import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format, isToday, isYesterday, formatISO } from "date-fns";
import { el } from "date-fns/locale";
import { useLogs, type LogEntry } from "@/shared/db";
import type {
  GroupedLogs,
  UseGroupedLogsResult,
  HistoryLogFilters,
} from "../types";

const ITEMS_PER_PAGE = 7;

function getDateLabel(
  date: Date,
  locale: string,
  t: (key: string) => string
): string {
  if (isToday(date)) {
    return t("history.today");
  }

  if (isYesterday(date)) {
    return t("history.yesterday");
  }

  return format(date, "EEEE, MMM d", {
    locale: locale === "el" ? el : undefined,
  });
}

function groupLogsByDate(
  logs: LogEntry[],
  locale: string,
  t: (key: string) => string
): GroupedLogs[] {
  const groups: Record<string, LogEntry[]> = {};

  logs.forEach((log) => {
    const date = new Date(log.timestamp);
    const key = formatISO(date, { representation: "date" });

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(log);
  });

  return Object.entries(groups).map(([dateString, logs]) => ({
    date: dateString,
    dateLabel: getDateLabel(new Date(dateString + "T00:00:00.000Z"), locale, t),
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

function filterLogs(logs: LogEntry[], filters: HistoryLogFilters): LogEntry[] {
  return logs.filter((log) => {
    // Date Range
    if (filters.dateRange?.from) {
      const logDate = new Date(log.timestamp);
      const checkDate = new Date(
        logDate.getFullYear(),
        logDate.getMonth(),
        logDate.getDate()
      );
      const fromDate = new Date(
        filters.dateRange.from.getFullYear(),
        filters.dateRange.from.getMonth(),
        filters.dateRange.from.getDate()
      );

      if (checkDate < fromDate) return false;

      if (filters.dateRange.to) {
        const toDate = new Date(
          filters.dateRange.to.getFullYear(),
          filters.dateRange.to.getMonth(),
          filters.dateRange.to.getDate()
        );
        if (checkDate > toDate) return false;
      }
    }

    // Bristol Type
    if (filters.bristolType !== null) {
      if (log.bristolType !== filters.bristolType) return false;
    }

    // Search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const notes = log.notes?.toLowerCase() || "";
      const symptoms = log.symptoms?.join(" ").toLowerCase() || "";
      const foods = log.foods?.join(" ").toLowerCase() || "";

      const searchContent = `${notes} ${symptoms} ${foods}`;
      if (!searchContent.includes(searchTerm)) return false;
    }

    return true;
  });
}

export function useGroupedLogs(
  filters?: HistoryLogFilters
): UseGroupedLogsResult {
  const logs = useLogs();
  const [currentPage, setCurrentPage] = useState(1);
  const locale = useLocale();
  const t = useTranslations();

  const { paginatedGroups, totalPages, isEmpty, totalFilteredLogs } =
    useMemo(() => {
      if (!logs || logs.length === 0) {
        return {
          paginatedGroups: [],
          totalPages: 0,
          isEmpty: true,
          totalFilteredLogs: 0,
        };
      }

      let processedLogs = logs;

      if (filters) {
        processedLogs = filterLogs(logs, filters);
      }

      const totalFilteredLogs = processedLogs.length;

      if (processedLogs.length === 0) {
        return {
          paginatedGroups: [],
          totalPages: 0,
          isEmpty: logs.length === 0,
          totalFilteredLogs: 0,
        };
      }

      const allGroups = groupLogsByDate(processedLogs, locale, t);
      const totalPages = Math.ceil(allGroups.length / ITEMS_PER_PAGE);
      const safePage = Math.min(
        Math.max(1, currentPage),
        Math.max(1, totalPages)
      );

      const paginatedGroups = paginateGroups(allGroups, safePage);

      return { paginatedGroups, totalPages, isEmpty: false, totalFilteredLogs };
    }, [logs, currentPage, filters, locale, t]);

  return {
    paginatedGroups,
    totalPages,
    currentPage,
    setCurrentPage,
    isEmpty,
    totalFilteredLogs,
  };
}
