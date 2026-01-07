"use client";

import * as React from "react";
import { Card } from "@/shared/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type IBSType } from "@/shared/db";

export function CopingActions() {
  const t = useTranslations("flare");
  const [done, setDone] = React.useState<Set<string>>(new Set());

  // Get IBS Type setting
  const settings = useLiveQuery(() => db.settings.toArray());
  const ibsType = (settings?.find((s) => s.id === "ibsType")?.value as IBSType) ?? "unsure";

  const DEFAULT_ACTIONS = React.useMemo(() => {
    const actions = [
      { id: "heat", label: t("copingActions.0") },
      { id: "breathe", label: t("copingActions.1") },
      { id: "ground", label: t("copingActions.2") },
      { id: "position", label: t("copingActions.3") },
      { id: "sip", label: t("copingActions.4") },
      { id: "massage", label: t("copingActions.5") },
      { id: "tea", label: t("copingActions.6") },
      { id: "music", label: t("copingActions.7") },
      { id: "screens", label: t("copingActions.8") },
    ];

    if (ibsType === "ibs-c") {
      // Prioritize: Massage, Heat, Tea, Position
      const priorities = ["massage", "heat", "tea", "position"];
      return [
        ...actions.filter((a) => priorities.includes(a.id)).sort((a, b) => priorities.indexOf(a.id) - priorities.indexOf(b.id)),
        ...actions.filter((a) => !priorities.includes(a.id)),
      ];
    }

    if (ibsType === "ibs-d") {
      // Prioritize: Sip, Breathe, Ground, Rest/Position
      const priorities = ["sip", "breathe", "ground", "position"];
      return [
        ...actions.filter((a) => priorities.includes(a.id)).sort((a, b) => priorities.indexOf(a.id) - priorities.indexOf(b.id)),
        ...actions.filter((a) => !priorities.includes(a.id)),
      ];
    }

    return actions;
  }, [ibsType, t]);

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
