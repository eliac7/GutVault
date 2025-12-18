"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, isClient } from "./database";
import type { LogType } from "./types";

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
