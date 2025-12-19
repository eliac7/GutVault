"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { BRISTOL_DESCRIPTIONS, BristolType } from "@/shared/db";
import { HistoryLogFilters } from "../types";

interface HistoryFiltersProps {
  filters: HistoryLogFilters;
  onFilterChange: (filters: HistoryLogFilters) => void;
  className?: string;
}

export function HistoryFilters({
  filters,
  onFilterChange,
  className,
}: HistoryFiltersProps) {
  const updateFilters = (updates: Partial<HistoryLogFilters>) => {
    onFilterChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      bristolType: null,
      dateRange: undefined,
    });
  };

  const hasActiveFilters =
    filters.search || filters.bristolType || filters.dateRange;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes, symptoms..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-9 bg-background/50"
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <Select
          value={filters.bristolType?.toString() || "all"}
          onValueChange={(value) => {
            updateFilters({
              bristolType:
                value === "all" ? null : (Number(value) as BristolType),
            });
          }}
        >
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Bristol Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(
              Object.keys(BRISTOL_DESCRIPTIONS) as unknown as BristolType[]
            ).map((type) => (
              <SelectItem key={type} value={type.toString()}>
                <span className="flex items-center gap-2">
                  <span>{BRISTOL_DESCRIPTIONS[type].emoji}</span>
                  <span>Type {type}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal bg-background/50",
                !filters.dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                    {format(filters.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange?.from}
              selected={filters.dateRange}
              onSelect={(range) => updateFilters({ dateRange: range })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="shrink-0"
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
