import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/shared/db";
import { FODMAP_DATA, type FodmapStatus } from "../lib/fodmap-data";
import { analyzeFood } from "../actions/analyze-food";
import { getDeviceId } from "../lib/device-id";

export function useFoodStatus(foodName: string) {
  const normalizedName = foodName.trim();

  //Check static list first
  const staticData = FODMAP_DATA.find(
    (f) => f.name.toLowerCase() === normalizedName.toLowerCase()
  );

  //Check local DB cache
  const cachedData = useLiveQuery(
    () => db.cachedFoods.get(normalizedName.toLowerCase()),
    [normalizedName]
  );

  // Combine result
  const status: FodmapStatus | null =
    staticData?.status || cachedData?.status || null;

  const isLoading = !staticData && cachedData === undefined; // querying DB

  return {
    status,
    source: staticData ? "static" : cachedData ? "cache" : "unknown",
    isLoading,
    details: staticData || cachedData,
  };
}

// Function to trigger analysis if unknown
export async function checkAndCacheFood(foodName: string, language?: string) {
  const normalizedName = foodName.trim();
  const lowerName = normalizedName.toLowerCase();

  // Check if we already know it
  const staticData = FODMAP_DATA.find(
    (f) => f.name.toLowerCase() === lowerName
  );
  const cachedData = await db.cachedFoods.get(lowerName);

  if (staticData || cachedData) return;

  // If not, ask AI
  try {
    const deviceId = getDeviceId();
    const result = await analyzeFood(normalizedName, deviceId, language);

    if (result.success) {
      await db.cachedFoods.put({
        name: lowerName,
        status: result.data.status,
        category: result.data.category,
        notes: result.data.notes,
        createdAt: new Date(),
      });
      console.log(`Cached analysis for ${foodName}:`, result.data);
    }
  } catch (error) {
    console.error(`Failed to analyze ${foodName}:`, error);
  }
}
