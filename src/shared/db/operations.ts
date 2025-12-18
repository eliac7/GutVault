import { db, isClient } from "./database";
import type { LogEntry, NewLogEntry } from "./types";

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

// Get logs for export (non-hook)
export async function getLogs(
  startDate?: Date,
  endDate?: Date
): Promise<LogEntry[]> {
  if (!isClient) return [];

  let collection = db.logs.orderBy("timestamp");

  if (startDate && endDate) {
    collection = db.logs.where("timestamp").between(startDate, endDate);
  } else if (startDate) {
    collection = db.logs.where("timestamp").aboveOrEqual(startDate);
  } else if (endDate) {
    collection = db.logs.where("timestamp").belowOrEqual(endDate);
  }

  return await collection.reverse().toArray();
}
