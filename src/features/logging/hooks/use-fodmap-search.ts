import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/shared/db";
import { FODMAP_DATA, type FodmapFood } from "../lib/fodmap-data";
import { useMemo } from "react";

export function useFodmapSearch(query: string, selectedFoods: string[]) {
  // Search static data
  const staticResults = useMemo(() => {
    if (!query) return [];
    return FODMAP_DATA.filter((food) =>
      food.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Search cached data
  const cachedResults = useLiveQuery(async () => {
    if (!query) return [];
    return await db.cachedFoods
      .filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
      .limit(5)
      .toArray();
  }, [query]);

  // Combine and deduplicate
  const filteredData = useMemo(() => {
    if (!query) return [];

    const combined: FodmapFood[] = [...staticResults];

    if (cachedResults) {
      cachedResults.forEach((cached) => {
        // Only add if not already in static list (by name)
        if (
          !combined.some(
            (s) => s.name.toLowerCase() === cached.name.toLowerCase()
          )
        ) {
          combined.push({
            name: cached.name,
            status: cached.status,
            category: cached.category ?? "",
            notes: cached.notes,
          });
        }
      });
    }

    // Filter out already selected foods and limit to 5
    return combined
      .filter((food) => !selectedFoods.includes(food.name))
      .slice(0, 5);
  }, [query, selectedFoods, staticResults, cachedResults]);

  return filteredData;
}
