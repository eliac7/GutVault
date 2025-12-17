import Dexie, { type EntityTable } from "dexie";
import type { LogEntry } from "./types";

class GutVaultDB extends Dexie {
  logs!: EntityTable<LogEntry, "id">;

  constructor() {
    super("GutVaultDB");
    this.version(1).stores({
      logs: "++id, type, timestamp, bristolType, painLevel, createdAt",
    });
  }
}

export const db = new GutVaultDB();

export const isClient = typeof window !== "undefined";
