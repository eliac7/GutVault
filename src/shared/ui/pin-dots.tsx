"use client";

import { cn } from "@/shared/lib/utils";

interface PinDotsProps {
  length: number;
  maxLength?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
}

export function PinDots({
  length,
  maxLength = 4,
  activeColor = "bg-blue-500",
  inactiveColor = "bg-slate-200 dark:bg-slate-700",
  className,
}: PinDotsProps) {
  return (
    <div className={cn("flex justify-center gap-3", className)}>
      {Array.from({ length: maxLength }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-4 h-4 rounded-full transition-all duration-200",
            length > i ? activeColor : inactiveColor
          )}
        />
      ))}
    </div>
  );
}

