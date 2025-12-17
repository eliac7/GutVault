"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, isClient } from "./database";
import type { LogEntry, NewLogEntry, LogType } from "./types";

// Get all logs, sorted by timestamp (newest first)
export function useLogs(limit?: number) {
  return useLiveQuery(
    async () => {
      if (!isClient) return [];

      let query = db.logs.orderBy("timestamp").reverse();

      if (limit) {
        query = query.limit(limit);
      }

      return await query.toArray();
    },
    [limit],
    []
  );
}

// Get logs filtered by type
export function useLogsByType(type: LogType, limit?: number) {
  return useLiveQuery(
    async () => {
      if (!isClient) return [];

      const query = db.logs.where("type").equals(type).reverse();

      if (limit) {
        return await query.limit(limit).sortBy("timestamp");
      }

      return await query.sortBy("timestamp");
    },
    [type, limit],
    []
  );
}

// Get logs within a date range
export function useLogsInRange(startDate: Date, endDate: Date) {
  return useLiveQuery(
    async () => {
      if (!isClient) return [];

      return await db.logs
        .where("timestamp")
        .between(startDate, endDate)
        .reverse()
        .toArray();
    },
    [startDate.getTime(), endDate.getTime()],
    []
  );
}

// Get the most recent bowel movement
export function useLastBowelMovement() {
  return useLiveQuery(
    async () => {
      if (!isClient) return null;

      return await db.logs
        .where("type")
        .equals("bowel_movement")
        .reverse()
        .first();
    },
    [],
    null
  );
}

// Get logs from the last N days
export function useLogsLastDays(days: number) {
  return useLiveQuery(
    async () => {
      if (!isClient) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      return await db.logs
        .where("timestamp")
        .above(startDate)
        .reverse()
        .toArray();
    },
    [days],
    []
  );
}

// Get count of logs by type
export function useLogCount(type?: LogType) {
  return useLiveQuery(
    async () => {
      if (!isClient) return 0;

      if (type) {
        return await db.logs.where("type").equals(type).count();
      }

      return await db.logs.count();
    },
    [type],
    0
  );
}

// Add a new log entry
export async function addLog(entry: NewLogEntry): Promise<number> {
  if (!isClient) throw new Error("Cannot add log on server");

  const now = new Date();

  const logEntry: Omit<LogEntry, "id"> = {
    ...entry,
    createdAt: now,
    updatedAt: now,
  };

  const id = await db.logs.add(logEntry as LogEntry);
  return id as number;
}

// Update an existing log entry
export async function updateLog(
  id: number,
  updates: Partial<LogEntry>
): Promise<number> {
  if (!isClient) throw new Error("Cannot update log on server");

  return await db.logs.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

// Delete a log entry
export async function deleteLog(id: number): Promise<void> {
  if (!isClient) throw new Error("Cannot delete log on server");

  await db.logs.delete(id);
}

// Clear all logs
export async function clearAllLogs(): Promise<void> {
  if (!isClient) throw new Error("Cannot clear logs on server");

  await db.logs.clear();
}

// Export all logs as JSON
export async function exportLogs(): Promise<LogEntry[]> {
  if (!isClient) throw new Error("Cannot export logs on server");

  return await db.logs.toArray();
}

// Import logs from JSON
export async function importLogs(logs: LogEntry[]): Promise<void> {
  if (!isClient) throw new Error("Cannot import logs on server");

  // Strip IDs to allow Dexie to assign new ones
  const logsWithoutIds = logs.map((log) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = log;
    return rest;
  });
  await db.logs.bulkAdd(logsWithoutIds as LogEntry[]);
}
