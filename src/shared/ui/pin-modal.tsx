"use client";

import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";

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
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className={cn("sm:max-w-sm rounded-3xl", className)}>
        <DialogHeader className="text-center items-center">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
              iconBg
            )}
          >
            <Icon className={cn("w-8 h-8", iconColor)} />
          </div>
          <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </DialogTitle>
          {subtitle && (
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}