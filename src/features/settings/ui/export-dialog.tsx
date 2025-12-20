"use client";

import { useState } from "react";
import {
  CalendarIcon,
  Download,
  FileJson,
  FileText,
  Check,
  Stethoscope,
  UserCog,
} from "lucide-react";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
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

import type { DoctorReportOptions } from "@/shared/lib/pdf-generator";

interface ExportDialogProps {
  onExport: (
    format: "json" | "pdf",
    range: DateRange | undefined,
    doctorOptions?: DoctorReportOptions
  ) => void;
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

  // Doctor Mode
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [doctorRange, setDoctorRange] = useState<"30" | "60" | "90">("30");
  const [anonymize, setAnonymize] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(true);

  const handleExport = () => {
    if (isDoctorMode) {
      onExport("pdf", undefined, {
        dateRange: doctorRange,
        anonymize,
        includeCharts,
      });
    } else {
      onExport(exportFormat, rangeType === "custom" ? date : undefined);
    }
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

        {/* Mode Selection Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4">
          <button
            onClick={() => setIsDoctorMode(false)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
              !isDoctorMode
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Download className="w-4 h-4" />
            Standard Export
          </button>
          <button
            onClick={() => setIsDoctorMode(true)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
              isDoctorMode
                ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Stethoscope className="w-4 h-4" />
            Prepare for Doctor
          </button>
        </div>

        <div className="space-y-6">
          {!isDoctorMode ? (
            <>
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
                      rangeType === "all" &&
                        "bg-white dark:bg-slate-700 shadow-sm"
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
            </>
          ) : (
            /* Doctor Mode UI */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                    <UserCog className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                      Doctor Report
                    </h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                      Generates a concise PDF summary optimized for medical
                      consultations. Includes symptom trends and Bristol scale
                      charts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Time Period</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["30", "60", "90"] as const).map((days) => (
                    <button
                      key={days}
                      onClick={() => setDoctorRange(days)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all",
                        doctorRange === days
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                      )}
                    >
                      Last {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Hide Personal Notes</Label>
                    <p className="text-xs text-slate-500">
                      Exclude your notes from the report table
                    </p>
                  </div>
                  <Switch checked={anonymize} onCheckedChange={setAnonymize} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Include Charts</Label>
                    <p className="text-xs text-slate-500">
                      Visual trends for symptoms & stool type
                    </p>
                  </div>
                  <Switch
                    checked={includeCharts}
                    onCheckedChange={setIncludeCharts}
                  />
                </div>
              </div>
            </div>
          )}
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
            {isExporting
              ? "Exporting..."
              : isDoctorMode
              ? "Generate Report"
              : "Download Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
