"use client";

import { useState } from "react";
import { deleteLog, type LogEntry } from "@/shared/db";
import { cn } from "@/shared/lib/utils";
import { ManualLogDialog } from "@/features/logging/ui/manual-log-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";

import { useGroupedLogs } from "../hooks";
import { LogItem } from "./log-item";
import { HistoryEmptyState } from "./empty-state";
import { HistoryLogFilters } from "../types";

export function HistoryList({ filters }: { filters?: HistoryLogFilters }) {
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<number | null>(null);
  const {
    paginatedGroups,
    totalPages,
    currentPage,
    setCurrentPage,
    isEmpty,
    totalFilteredLogs,
  } = useGroupedLogs(filters);

  if (isEmpty) return <HistoryEmptyState />;

  if (totalFilteredLogs === 0 && filters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No logs found
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Log groups by date */}
      {paginatedGroups.map((group) => (
        <div key={group.date}>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
            {group.dateLabel}
          </h3>
          <div className="space-y-3">
            {group.logs.map((log) => (
              <LogItem
                key={log.id}
                log={log}
                onDelete={() => log.id && setDeletingLogId(log.id)}
                onEdit={() => setEditingLog(log)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={cn(
                  currentPage <= 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={cn(
                  currentPage >= totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Dialogs */}
      <ManualLogDialog
        open={!!editingLog}
        onOpenChange={(open) => !open && setEditingLog(null)}
        initialLog={editingLog}
      />

      <ConfirmDialog
        open={deletingLogId !== null}
        onOpenChange={(open) => !open && setDeletingLogId(null)}
        onConfirm={async () => {
          if (deletingLogId !== null) {
            await deleteLog(deletingLogId);
            setDeletingLogId(null);
          }
        }}
        title="Delete log"
        description="Are you sure you want to delete this log? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
