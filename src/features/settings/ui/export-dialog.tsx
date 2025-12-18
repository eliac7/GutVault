"use client";

import { useState } from "react";
import {
  CalendarIcon,
  Download,
  FileJson,
  FileText,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils"; // Ensure this exists
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { DateRange } from "react-day-picker";

interface ExportDialogProps {
  onExport: (format: "json" | "pdf", range: DateRange | undefined) => void;
  isExporting: boolean;
  trigger?: React.ReactNode;
}

export function ExportDialog({
  onExport,
  isExporting,
  trigger,
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "pdf">("pdf");
  const [rangeType, setRangeType] = useState<"all" | "custom">("all");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const handleExport = () => {
    onExport(exportFormat, rangeType === "custom" ? date : undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setExportFormat("pdf")}
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all",
                  exportFormat === "pdf"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10"
                    : "border-slate-200 dark:border-slate-800"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText
                    className={cn(
                      "h-6 w-6",
                      exportFormat === "pdf"
                        ? "text-emerald-600"
                        : "text-slate-500"
                    )}
                  />
                  {exportFormat === "pdf" && (
                    <Check className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
                <p className="font-semibold text-sm">PDF Document</p>
                <p className="text-xs text-slate-500">Readable report</p>
              </div>

              <div
                onClick={() => setExportFormat("json")}
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all",
                  exportFormat === "json"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10"
                    : "border-slate-200 dark:border-slate-800"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <FileJson
                    className={cn(
                      "h-6 w-6",
                      exportFormat === "json"
                        ? "text-emerald-600"
                        : "text-slate-500"
                    )}
                  />
                  {exportFormat === "json" && (
                    <Check className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
                <p className="font-semibold text-sm">JSON Data</p>
                <p className="text-xs text-slate-500">Raw backup</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Date Range
            </label>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Button
                variant="ghost"
                onClick={() => setRangeType("all")}
                className={cn(
                  "flex-1 rounded-md h-8 text-xs",
                  rangeType === "all" && "bg-white dark:bg-slate-700 shadow-sm"
                )}
              >
                All Time
              </Button>
              <Button
                variant="ghost"
                onClick={() => setRangeType("custom")}
                className={cn(
                  "flex-1 rounded-md h-8 text-xs",
                  rangeType === "custom" &&
                    "bg-white dark:bg-slate-700 shadow-sm"
                )}
              >
                Custom Range
              </Button>
            </div>

            {rangeType === "custom" && (
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
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
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {isExporting ? "Exporting..." : "Download Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
