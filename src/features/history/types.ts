import type { LogEntry } from "@/shared/db";
import type { DateRange } from "react-day-picker";
import type { BristolType } from "@/shared/db";

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

export interface HistoryLogFilters {
  search: string;
  bristolType: BristolType | null;
  dateRange: DateRange | undefined;
}

export interface UseGroupedLogsResult {
  paginatedGroups: GroupedLogs[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isEmpty: boolean;
  totalFilteredLogs: number;
}
