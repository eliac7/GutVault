"use client";

import * as React from "react";
import { Card } from "@/shared/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const DEFAULT_ACTIONS = [
  { id: "heat", label: "Use a heating pad on your abdomen" },
  { id: "breathe", label: "Practice box breathing (4-4-4-4)" },
  { id: "ground", label: "5-4-3-2-1 grounding technique" },
  { id: "position", label: "Lie down in a comfortable position" },
  { id: "sip", label: "Sip water slowly" },
  { id: "massage", label: "Gentle self-massage on stomach" },
  { id: "tea", label: "Drink warm herbal tea (peppermint/ginger)" },
  { id: "music", label: "Listen to calming music or white noise" },
  { id: "screens", label: "Disconnect from screens for 10 minutes" },
];

export function CopingActions() {
  const [done, setDone] = React.useState<Set<string>>(new Set());

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="grid gap-3">
      {DEFAULT_ACTIONS.map((action) => {
        const isDone = done.has(action.id);

        return (
          <button
            key={action.id}
            type="button"
            onClick={() => toggle(action.id)}
            className="text-left w-full outline-none group"
          >
            <Card
              className={cn(
                "p-4 flex flex-row items-center gap-3 border transition-all duration-200",
                "bg-white/50 dark:bg-slate-900/50",
                "border-slate-200/50 dark:border-slate-800/50",
                "active:scale-[0.98]",
                isDone
                  ? "ring-1 ring-emerald-500/30 dark:ring-emerald-400/20 border-emerald-500/30"
                  : "hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  isDone
                    ? "bg-emerald-600"
                    : "bg-emerald-100 dark:bg-emerald-900/30"
                )}
              >
                <Check
                  className={cn(
                    "w-4 h-4 transition-opacity",
                    isDone
                      ? "text-white opacity-100"
                      : "text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100"
                  )}
                />
              </div>

              <span
                className={cn(
                  "font-medium transition-colors",
                  isDone
                    ? "text-slate-500 dark:text-slate-400 line-through"
                    : "text-slate-800 dark:text-slate-200"
                )}
              >
                {action.label}
              </span>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
