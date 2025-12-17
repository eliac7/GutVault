"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Mic, PenLine } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ManualLogDialog } from "./manual-log-dialog";

export function LogFAB() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showManualLog, setShowManualLog] = useState(false);

  const handleManualLog = () => {
    setIsExpanded(false);
    setShowManualLog(true);
  };

  const handleVoiceLog = () => {
    setIsExpanded(false);
    // TODO: Implement voice logging
    alert("Voice logging coming soon!");
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isExpanded && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: 0.05 }}
              >
                <Button
                  onClick={handleVoiceLog}
                  className="h-14 px-5 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Voice Log
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
              >
                <Button
                  onClick={handleManualLog}
                  className="h-14 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                >
                  <PenLine className="w-5 h-5 mr-2" />
                  Manual Log
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Plus className="w-7 h-7" />
        </motion.button>
      </div>

      <ManualLogDialog open={showManualLog} onOpenChange={setShowManualLog} />
    </>
  );
}
