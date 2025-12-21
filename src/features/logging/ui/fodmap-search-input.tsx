"use client";

import * as React from "react";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useFodmapSearch } from "../hooks/use-fodmap-search";
import { FODMAP_STATUS_COLORS } from "../lib/fodmap-data";

interface FodmapSearchInputProps {
  selectedFoods: string[];
  onSelect: (foodName: string) => void;
}

export function FodmapSearchInput({ selectedFoods, onSelect }: FodmapSearchInputProps) {
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const filteredData = useFodmapSearch(query, selectedFoods);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (foodName: string) => {
    onSelect(foodName);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a food..."
          className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      {isOpen && filteredData.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredData.map((food) => (
            <button
              key={food.name}
              onClick={() => handleSelect(food.name)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b last:border-0 border-slate-100 dark:border-slate-800"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {food.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {food.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    FODMAP_STATUS_COLORS[food.status]
                  )}
                >
                  {food.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {query && filteredData.length === 0 && isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 text-center animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-slate-500 mb-2">
            No results for &quot;{query}&quot;
          </p>
          <button
            onClick={() => handleSelect(query)}
            className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 flex items-center justify-center gap-1 mx-auto"
          >
            <Sparkles className="w-3 h-3" />
            Add & Analyze &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}
