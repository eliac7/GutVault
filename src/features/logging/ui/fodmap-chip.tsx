"use client";

import { cn } from "@/shared/lib/utils";
import { X } from "lucide-react";
import { useFoodStatus } from "../hooks/use-food-status";
import { FODMAP_STATUS_COLORS } from "../lib/fodmap-data";

interface FodmapChipProps {
  food: string;
  onRemove: () => void;
}

export function FodmapChip({ food, onRemove }: FodmapChipProps) {
  const { status, isLoading } = useFoodStatus(food);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all animate-in zoom-in-95 duration-200",
        status
          ? `${FODMAP_STATUS_COLORS[status]} border-transparent`
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
      )}
    >
      {food}
      {isLoading ? (
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
      ) : status ? (
        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
      ) : null}
      <button
        onClick={onRemove}
        className="hover:opacity-60 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
