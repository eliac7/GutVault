"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { checkAndCacheFood } from "../hooks/use-food-status";
import { FodmapChip } from "./fodmap-chip";
import { FodmapSearchInput } from "./fodmap-search-input";

interface FodmapPickerProps {
  selectedFoods: string[];
  onChange: (foods: string[]) => void;
}

export function FodmapPicker({ selectedFoods, onChange }: FodmapPickerProps) {
  const t = useTranslations("logging.fodmapPicker");

  const addFood = (foodName: string) => {
    onChange([...selectedFoods, foodName]);

    // Trigger AI check in background
    const userLanguage =
      typeof navigator !== "undefined" ? navigator.language : undefined;
    checkAndCacheFood(foodName, userLanguage);
  };

  const removeFood = (foodName: string) => {
    onChange(selectedFoods.filter((f) => f !== foodName));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {t("label")}
      </label>

      <FodmapSearchInput selectedFoods={selectedFoods} onSelect={addFood} />

      <div className="flex flex-wrap gap-2">
        {selectedFoods.map((food) => (
          <FodmapChip
            key={food}
            food={food}
            onRemove={() => removeFood(food)}
          />
        ))}
      </div>
    </div>
  );
}
