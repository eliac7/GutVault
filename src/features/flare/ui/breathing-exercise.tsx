"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function BreathingExercise() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const t = useTranslations("flare.breathing");
  const [text, setText] = useState(t("breatheIn"));

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const cycle = () => {
      setPhase("inhale");
      setText(t("breatheIn"));

      timeout = setTimeout(() => {
        setPhase("hold");
        setText(t("hold"));

        timeout = setTimeout(() => {
          setPhase("exhale");
          setText(t("breatheOut"));

          timeout = setTimeout(() => {
            cycle(); // Loop
          }, 4000); // Exhale duration
        }, 4000); // Hold duration
      }, 4000); // Inhale duration
    };

    cycle();

    return () => clearTimeout(timeout);
  }, [t]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative flex items-center justify-center w-64 h-64">
        <motion.div
          className="absolute rounded-full bg-emerald-100/20 dark:bg-emerald-500/10"
          animate={{
            scale: phase === "inhale" ? 1.5 : phase === "exhale" ? 1 : 1.5,
            opacity: phase === "inhale" ? 0.5 : phase === "exhale" ? 0.2 : 0.5,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          style={{ width: "100%", height: "100%" }}
        />

        <motion.div
          className="relative z-10 w-40 h-40 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border-4 border-emerald-200 dark:border-emerald-500/30"
          animate={{
            scale: phase === "inhale" ? 1.2 : phase === "exhale" ? 1 : 1.2,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          <motion.span
            className="text-xl font-medium text-emerald-800 dark:text-emerald-200 text-center"
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {text}
          </motion.span>
        </motion.div>
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
        {t("instruction")}
      </p>
    </div>
  );
}
