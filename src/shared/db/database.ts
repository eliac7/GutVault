import Dexie, { type EntityTable } from "dexie";
import type { LogEntry, AppSetting } from "./types";

class GutVaultDB extends Dexie {
  logs!: EntityTable<LogEntry, "id">;
  settings!: EntityTable<AppSetting, "id">;

  constructor() {
    super("GutVaultDB");
    this.version(1).stores({
      logs: "++id, type, timestamp, bristolType, painLevel, createdAt",
    });
    this.version(2).stores({
      settings: "id",
    });
  }
}

export const db = new GutVaultDB();

export const isClient = typeof window !== "undefined";
