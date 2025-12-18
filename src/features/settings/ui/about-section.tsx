"use client";

import { motion } from "motion/react";
import { Info } from "lucide-react";
import { Card } from "@/shared/ui/card";
import packageJson from "../../../../package.json";

export function AboutSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <Info className="w-5 h-5 text-slate-500" />
          </span>
          About
        </h2>

        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {packageJson.version}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Database</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              Dexie.js + IndexedDB
            </span>
          </div>
          <div className="flex justify-between">
            <span>AI Model</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              OpenRouter AI models
            </span>
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-center">
              Made with ❤️ for people managing IBS
              <br />
              <span className="text-slate-400">
                Local-First • Privacy-Focused • Open Source
              </span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
