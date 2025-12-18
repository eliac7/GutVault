import type { LogEntry } from "@/shared/db";

export interface GroupedLogs {
  date: string;
  dateLabel: string;
  logs: LogEntry[];
}

export interface LogItemProps {
  log: LogEntry;
  onDelete: () => void;
  onEdit: () => void;
}

export interface UseGroupedLogsResult {
  paginatedGroups: GroupedLogs[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isEmpty: boolean;
}

