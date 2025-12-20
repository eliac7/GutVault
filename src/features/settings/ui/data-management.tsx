"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Database, Download, Upload, Trash2 } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import {
  exportLogs,
  importLogs,
  clearAllLogs,
  useLogCount,
  getLogs,
} from "@/shared/db";
import { ExportDialog } from "./export-dialog";
import {
  generatePDF,
  type DoctorReportOptions,
} from "@/shared/lib/pdf-generator";
import type { DateRange } from "react-day-picker";

type DeleteStep = "idle" | "first" | "final";

export function DataManagement() {
  const totalLogs = useLogCount();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("idle");
  const [storageInfo, setStorageInfo] = useState<{
    used?: number;
    quota?: number;
  }>({});

  const runExport = async (
    format: "json" | "pdf",
    range: DateRange | undefined,
    doctorOptions?: DoctorReportOptions
  ) => {
    setIsExporting(true);
    try {
      if (format === "json") {
        const dataToExport = range
          ? await getLogs(range.from, range.to)
          : await exportLogs();

        const dataStr = JSON.stringify(
          {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            logs: dataToExport,
          },
          null,
          2
        );

        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `gutvault-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // PDF Export
        const logs = await getLogs(range?.from, range?.to);
        await generatePDF(
          logs,
          range ? { start: range.from, end: range.to } : undefined,
          doctorOptions
        );
      }

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.logs || !Array.isArray(data.logs)) {
        throw new Error("Invalid backup file format");
      }

      const logs = data.logs.map((log: Record<string, unknown>) => ({
        ...log,
        timestamp: new Date(log.timestamp as string),
        createdAt: new Date(log.createdAt as string),
        updatedAt: new Date(log.updatedAt as string),
      }));

      await importLogs(logs);
      toast.success(`Successfully imported ${logs.length} logs!`);
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(
        "Failed to import data. Please check the file and try again."
      );
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const handleFirstConfirm = () => {
    setDeleteStep("final");
  };

  const handleFinalConfirm = async () => {
    try {
      await clearAllLogs();
      toast.success("All data has been deleted.");
    } catch (error) {
      console.error("Failed to clear data:", error);
      toast.error("Failed to delete data. Please try again.");
    } finally {
      setDeleteStep("idle");
    }
  };

  const checkStorage = async () => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      setStorageInfo({
        used: estimate.usage,
        quota: estimate.quota,
      });
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-500" />
          Data Management
        </h2>

        <div className="space-y-3">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Total Logs
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {totalLogs}
              </span>
            </div>
            {storageInfo.used !== undefined && (
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Storage Used</span>
                <span>
                  {formatBytes(storageInfo.used)} /{" "}
                  {formatBytes(storageInfo.quota)}
                </span>
              </div>
            )}
            {storageInfo.used === undefined && (
              <Button
                variant="ghost"
                size="sm"
                onClick={checkStorage}
                className="text-xs"
              >
                Check Storage
              </Button>
            )}
          </div>

          <ExportDialog
            onExport={runExport}
            isExporting={isExporting}
            trigger={
              <Button
                variant="outline"
                disabled={isExporting || totalLogs === 0}
                className="w-full justify-start h-12 rounded-xl"
              >
                <Download className="w-5 h-5 mr-3 text-emerald-500" />
                <div className="text-left">
                  <div className="font-medium">Export Data</div>
                  <div className="text-xs text-slate-500">
                    Download as PDF or JSON
                  </div>
                </div>
              </Button>
            }
          />

          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <div
                className={`flex items-center w-full justify-start h-12 rounded-xl cursor-pointer px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  isImporting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="w-5 h-5 mr-3 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    Import Data
                  </div>
                  <div className="text-xs text-slate-500">
                    Restore from backup
                  </div>
                </div>
              </div>
            </label>
          </div>

          <Button
            onClick={() => setDeleteStep("first")}
            disabled={totalLogs === 0}
            variant="outline"
            className="w-full justify-start h-12 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Clear All Data</div>
              <div className="text-xs text-red-500">
                Permanently delete all logs
              </div>
            </div>
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={deleteStep === "first"}
        onOpenChange={(open) => !open && setDeleteStep("idle")}
        onConfirm={handleFirstConfirm}
        title="Delete all data?"
        description={`Are you sure you want to delete ALL ${totalLogs} logs? This action CANNOT be undone! Make sure you've exported your data first.`}
        confirmText="Continue"
        variant="destructive"
      />

      <ConfirmDialog
        open={deleteStep === "final"}
        onOpenChange={(open) => !open && setDeleteStep("idle")}
        onConfirm={handleFinalConfirm}
        title="Final warning"
        description="This will permanently delete all your health data. Are you ABSOLUTELY sure?"
        confirmText="Delete Everything"
        variant="destructive"
      />
    </motion.div>
  );
}
