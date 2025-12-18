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
import type { GroupedLogs } from "../types";

export function HistoryList() {
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<number | null>(null);
  const { paginatedGroups, totalPages, currentPage, setCurrentPage, isEmpty } =
    useGroupedLogs();

  const handleConfirmDelete = async () => {
    if (deletingLogId !== null) {
      await deleteLog(deletingLogId);
      setDeletingLogId(null);
    }
  };

  if (isEmpty) {
    return <HistoryEmptyState />;
  }

  return (
    <div className="space-y-6">
      <LogGroups
        groups={paginatedGroups}
        onDelete={setDeletingLogId}
        onEdit={setEditingLog}
      />

      {totalPages > 1 && (
        <HistoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ManualLogDialog
        open={!!editingLog}
        onOpenChange={(open) => !open && setEditingLog(null)}
        initialLog={editingLog}
      />

      <ConfirmDialog
        open={deletingLogId !== null}
        onOpenChange={(open) => !open && setDeletingLogId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete log"
        description="Are you sure you want to delete this log? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}

interface LogGroupsProps {
  groups: GroupedLogs[];
  onDelete: (id: number) => void;
  onEdit: (log: LogEntry) => void;
}

function LogGroups({ groups, onDelete, onEdit }: LogGroupsProps) {
  return (
    <>
      {groups.map((group) => (
        <LogGroup
          key={group.date}
          group={group}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}

interface LogGroupProps {
  group: GroupedLogs;
  onDelete: (id: number) => void;
  onEdit: (log: LogEntry) => void;
}

function LogGroup({ group, onDelete, onEdit }: LogGroupProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
        {group.dateLabel}
      </h3>
      <div className="space-y-3">
        {group.logs.map((log) => (
          <LogItem
            key={log.id}
            log={log}
            onDelete={() => log.id && onDelete(log.id)}
            onEdit={() => onEdit(log)}
          />
        ))}
      </div>
    </div>
  );
}

interface HistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function HistoryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: HistoryPaginationProps) {
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => handlePageClick(e, page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            className={cn(
              currentPage >= totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
