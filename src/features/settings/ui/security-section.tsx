"use client";

import { motion } from "motion/react";
import { Shield, AlertTriangle } from "lucide-react";
import { Card } from "@/shared/ui/card";

export function SecuritySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          Privacy & Security
        </h2>

        <div className="space-y-3">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
            <p className="text-sm text-emerald-800 dark:text-emerald-300">
              <strong>🔒 100% Local Storage</strong>
              <br />
              All your health data is stored locally on your device using
              IndexedDB. We never send your logs to any server.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>🤖 AI Processing</strong>
              <br />
              Voice transcripts are sent to OpenRouter AI models only for
              parsing, then immediately discarded. Your raw audio never leaves
              your device.
            </p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
            <p className="text-sm text-amber-800 dark:text-amber-300 flex gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                <strong>Backup Your Data</strong>
                <br />
                Since everything is local, clearing browser data will delete
                your logs. Export regularly!
              </span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
