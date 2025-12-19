"use client";

import { useState } from "react";
import { HistoryList } from "./history-list";
import { HistoryFilters } from "./history-filters";
import { HistoryLogFilters } from "../types";
import { SymptomHeatmap } from "./symptom-heatmap";
import { motion } from "motion/react";

export function HistoryContent() {
  const [filters, setFilters] = useState<HistoryLogFilters>({
    search: "",
    bristolType: null,
    dateRange: undefined,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[320px] xl:w-[360px] shrink-0 space-y-6 lg:sticky lg:top-20"
      >
        <SymptomHeatmap />

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Filters
            </span>
          </div>

          <HistoryFilters filters={filters} onFilterChange={setFilters} />
        </div>
      </motion.aside>

      <main className="flex-1 w-full min-w-0">
        <HistoryList filters={filters} />
      </main>
    </div>
  );
}
