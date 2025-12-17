"use client";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      onClick={() =>
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
      }
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{
          rotate: theme === "dark" ? -90 : 0,
          scale: theme === "dark" ? 0 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="h-4 w-4" />
      </motion.div>
      <motion.div
        animate={{
          rotate: theme === "dark" ? 0 : 90,
          scale: theme === "dark" ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="h-4 w-4" />
      </motion.div>
    </motion.button>
  );
};
