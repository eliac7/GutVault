import Dexie, { type EntityTable } from "dexie";
import type { LogEntry, AppSetting, CachedFood } from "./types";

class GutVaultDB extends Dexie {
  logs!: EntityTable<LogEntry, "id">;
  settings!: EntityTable<AppSetting, "id">;
  cachedFoods!: EntityTable<CachedFood, "name">;

  constructor() {
    super("GutVaultDB");
    this.version(1).stores({
      logs: "++id, type, timestamp, bristolType, painLevel, createdAt",
    });
    this.version(2).stores({
      settings: "id",
    });
    this.version(3).stores({
      cachedFoods: "name",
    });
  }
}

export const db = new GutVaultDB();

export const isClient = typeof window !== "undefined";
