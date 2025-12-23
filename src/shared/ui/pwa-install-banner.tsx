"use client";

import { motion, AnimatePresence } from "motion/react";
import { Download, X, Share, Plus } from "lucide-react";
import { usePwaInstall } from "@/shared/hooks/use-pwa-install";
import Image from "next/image";

export function PwaInstallBanner() {
  const { canShowPrompt, isIOS, isInstalling, promptInstall, dismiss } =
    usePwaInstall();

  if (!canShowPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="absolute right-2 top-2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-4 pt-5">
            <div className="flex items-start gap-3">
              {/* App icon */}
              <div className="shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                  <Image
                    src="/logo.png"
                    alt="GutVault"
                    width={32}
                    height={32}
                    className="rounded-md"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Install GutVault
                </h3>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {isIOS
                    ? "Add to your home screen for the best experience"
                    : "Install for quick access & offline use"}
                </p>
              </div>
            </div>

            {isIOS ? (
              // iOS instructions
              <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  To install:
                </p>
                <ol className="mt-2 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                      1
                    </span>
                    <span className="flex items-center gap-1">
                      Tap the share button{" "}
                      <Share className="h-3.5 w-3.5 text-blue-500" />
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                      2
                    </span>
                    <span className="flex items-center gap-1">
                      Tap &quot;Add to Home Screen&quot;{" "}
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </li>
                </ol>
                <button
                  onClick={dismiss}
                  className="mt-3 w-full rounded-lg bg-slate-200 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
                >
                  Got it
                </button>
              </div>
            ) : (
              // Android/Desktop install button
              <div className="mt-4 flex gap-2">
                <button
                  onClick={dismiss}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Not now
                </button>
                <button
                  onClick={promptInstall}
                  disabled={isInstalling}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-70"
                >
                  <Download className="h-4 w-4" />
                  {isInstalling ? "Installing..." : "Install"}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
