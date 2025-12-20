"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface PinModalProps {
  show: boolean;
  onClose: () => void;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function PinModal({
  show,
  onClose,
  icon: Icon,
  iconBg = "bg-blue-100 dark:bg-blue-900/30",
  iconColor = "text-blue-600 dark:text-blue-400",
  title,
  subtitle,
  children,
  className,
}: PinModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-xl",
              className
            )}
          >
            <div className="text-center mb-6">
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                  iconBg
                )}
              >
                <Icon className={cn("w-8 h-8", iconColor)} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

