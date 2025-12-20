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
      <Card className="p-6 bg-white dark:bg-slate-900/80 rounded-3xl border-slate-200/50 dark:border-teal-500/30 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-500 dark:text-slate-400" />
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
            <span className="font-medium text-teal-600 dark:text-cyan-400">
              Dexie.js + IndexedDB
            </span>
          </div>
          <div className="flex justify-between">
            <span>AI Model</span>
            <span className="font-medium text-teal-600 dark:text-cyan-400">
              OpenRouter AI models
            </span>
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-center">
              Made with <span className="text-red-500">❤️</span> for people
              managing IBS
              <br />
              <span className="text-slate-400">
                Local-First •{" "}
                <span className="text-teal-600 dark:text-cyan-400">
                  Privacy-Focused
                </span>{" "}
                • Open Source
              </span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
