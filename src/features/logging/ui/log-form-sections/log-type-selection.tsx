import { LogType } from "@/shared/db";
import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";

interface LogTypeSelectionProps {
  selectedType: LogType;
  onSelect: (type: LogType) => void;
}

export function LogTypeSelection({ selectedType, onSelect }: LogTypeSelectionProps) {
  const t = useTranslations("logging");
  const tCommon = useTranslations("common");

  const types = [
    {
      id: "bowel_movement",
      icon: "💩",
      label: t("logTitles.bowelMovement"),
    },
    {
      id: "meal",
      icon: "🍽️",
      label: t("logTitles.mealLogged"),
    },
    {
      id: "symptom",
      icon: "🤕",
      label: t("logTitles.symptomsLogged"),
    },
    {
      id: "medication",
      icon: "💊",
      label: tCommon("labels.medication"),
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
        {t("manualDialog.typeQuestion")}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id as LogType)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3",
              selectedType === type.id
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
            )}
          >
            <span className="text-4xl">{type.icon}</span>
            <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
              {type.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
