"use client";

import { X, Delete } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export type KeypadVariant = "light" | "dark";

interface PinKeypadProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  variant?: KeypadVariant;
  className?: string;
}

export function PinKeypad({
  onKeyPress,
  disabled,
  variant = "light",
  className,
}: PinKeypadProps) {
  const styles = {
    light: {
      button:
        "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700",
      backspace:
        "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700",
    },
    dark: {
      button: "bg-slate-800/50 text-white hover:bg-slate-700/50",
      backspace: "bg-slate-800 text-slate-300 hover:bg-slate-700",
    },
  };

  const Icon = variant === "dark" ? Delete : X;

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {KEYPAD_KEYS.map((key, index) => {
        if (key === "") return <div key={`key-${index}`} />;

        const isBackspace = key === "⌫";
        const buttonStyle = isBackspace
          ? styles[variant].backspace
          : styles[variant].button;

        return (
          <button
            key={`key-${index}`}
            onClick={() => onKeyPress(key)}
            disabled={disabled}
            className={cn(
              "h-14 rounded-xl font-semibold text-xl transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
              buttonStyle
            )}
          >
            {isBackspace ? <Icon className="w-5 h-5" /> : key}
          </button>
        );
      })}
    </div>
  );
}

export { KEYPAD_KEYS };
