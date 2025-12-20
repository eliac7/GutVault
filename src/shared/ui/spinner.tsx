"use client";

import { cn } from "@/shared/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const sizes = {
  sm: "w-4 h-4 border",
  md: "w-5 h-5 border-2",
  lg: "w-8 h-8 border-2",
};

export function Spinner({
  size = "md",
  color = "border-white border-t-transparent",
  className,
}: SpinnerProps) {
  return (
    <div
      className={cn("rounded-full animate-spin", sizes[size], color, className)}
    />
  );
}
