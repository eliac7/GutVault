"use client";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8 items-center justify-center rounded-md" />;
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <motion.button
      onClick={cycleTheme}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <Icon className="h-4 w-4" />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};
