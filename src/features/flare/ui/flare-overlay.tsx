"use client";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFlareMode } from "../context/flare-context";
import { BreathingExercise } from "./breathing-exercise";
import { CopingActions } from "./coping-actions";
import { QuickLog } from "./quick-log";
import { ReassuranceCard } from "./reassurance-card";

export function FlareOverlay() {
  const { isFlareMode, setFlareMode } = useFlareMode();
  const [showLog, setShowLog] = useState(false);
  const t = useTranslations("flare");

  return (
    <AnimatePresence>
      {isFlareMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {t("flareSupport")}
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => setFlareMode(false)}
              className="hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
            >
              {t("exitMode")}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
            {/* 1. Calm Down (Breathing) */}
            <section>
              <BreathingExercise />
            </section>

            {/* 2. Reassurance */}
            <section>
              <ReassuranceCard />
            </section>

            {/* 3. Coping Actions */}
            <section>
              <CopingActions />
            </section>

            {/* 4. Logging */}
            <section>
              {!showLog ? (
                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-dashed border-2"
                  onClick={() => setShowLog(true)}
                >
                  {t("logSymptoms")}
                </Button>
              ) : (
                <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Quick Log
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLog(false)}
                      className="h-8 text-xs"
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                  <QuickLog onComplete={() => setShowLog(false)} />
                </Card>
              )}
            </section>

            {/* Bottom Exit Button */}
            <section className="pt-4">
              <Button
                variant="outline"
                className="w-full py-6 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800"
                onClick={() => setFlareMode(false)}
              >
                {t("exitFlareMode")}
              </Button>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
