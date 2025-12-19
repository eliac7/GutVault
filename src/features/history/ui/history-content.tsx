"use client";

import { useState } from "react";
import { HistoryList } from "./history-list";
import { HistoryFilters } from "./history-filters";
import { HistoryLogFilters } from "../types";

export function HistoryContent() {
  const [filters, setFilters] = useState<HistoryLogFilters>({
    search: "",
    bristolType: null,
    dateRange: undefined,
  });

  return (
    <div className="space-y-6">
      <HistoryFilters filters={filters} onFilterChange={setFilters} />
      <HistoryList filters={filters} />
    </div>
  );
}
