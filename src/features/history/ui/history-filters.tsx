"use client";

import { format } from "date-fns";
import { el, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { BristolImage } from "@/shared/ui/bristol-image";
import { Calendar, type SupportedLocale } from "@/shared/ui/calendar";
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
  const t = useTranslations();
  const locale = useLocale() as SupportedLocale;
  const dfLocale = locale === "el" ? el : enUS;

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
    !!filters.search || filters.bristolType !== null || !!filters.dateRange;

  return (
    <div className={cn("grid gap-3", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder={t("history.searchPlaceholder")}
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <Select
          value={filters.bristolType?.toString() || "all"}
          onValueChange={(value) => {
            updateFilters({
              bristolType:
                value === "all" ? null : (Number(value) as BristolType),
            });
          }}
        >
          <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <SelectValue placeholder={t("history.bristolTypeLabel")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("history.allTypes")}</SelectItem>
            {(
              Object.keys(BRISTOL_DESCRIPTIONS) as unknown as BristolType[]
            ).map((type) => (
              <SelectItem key={type} value={type.toString()}>
                <span className="flex items-center gap-2">
                  <BristolImage type={type} className="w-8 h-8" />
                  <div className="flex flex-col text-left">
                    <span className="font-medium">
                      {t(`logging.bristol.type${type}.label`)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t(`logging.bristol.type${type}.description`)}
                    </span>
                  </div>
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
                "w-full justify-start text-left font-normal bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-3",
                !filters.dateRange && "text-slate-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd", {
                        locale: dfLocale,
                      })}{" "}
                      -{" "}
                      {format(filters.dateRange.to, "LLL dd", {
                        locale: dfLocale,
                      })}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, yyyy", {
                      locale: dfLocale,
                    })
                  )
                ) : (
                  <span>{t("history.pickADate")}</span>
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange?.from}
              selected={filters.dateRange}
              onSelect={(range) => updateFilters({ dateRange: range })}
              numberOfMonths={1}
              lang={locale}
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <X className="mr-2 h-4 w-4" />
          {t("history.clearFilters")}
        </Button>
      )}
    </div>
  );
}
