"use client";

import { type BristolType, BRISTOL_DESCRIPTIONS } from "@/shared/db";
import { useTranslations } from "next-intl";
import { BristolImage } from "@/shared/ui/bristol-image";

interface BristolSelectorProps {
  value: BristolType | null;
  onChange: (value: BristolType) => void;
}

export function BristolSelector({ value, onChange }: BristolSelectorProps) {
  const t = useTranslations();
  const bristolTypes: BristolType[] = Object.keys(BRISTOL_DESCRIPTIONS).map(
    Number
  ) as BristolType[];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {t("logging.bristol.title")}
      </label>
      <div className="grid grid-cols-7 gap-2">
        {bristolTypes.map((type) => {
          const isSelected = value === type;

          const getColor = () => {
            if (type === 3 || type === 4) return "emerald";
            if (type === 2 || type === 5) return "amber";
            return "red";
          };

          const color = getColor();

          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? `bg-${color}-100 dark:bg-${color}-900/30 border-2 border-${color}-500 ring-2 ring-${color}-500/20`
                  : "bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              style={{
                backgroundColor: isSelected
                  ? color === "emerald"
                    ? "rgb(209 250 229 / 0.5)"
                    : color === "amber"
                    ? "rgb(254 243 199 / 0.5)"
                    : "rgb(254 226 226 / 0.5)"
                  : undefined,
                borderColor: isSelected
                  ? color === "emerald"
                    ? "rgb(16 185 129)"
                    : color === "amber"
                    ? "rgb(245 158 11)"
                    : "rgb(239 68 68)"
                  : undefined,
              }}
            >
              <BristolImage
                type={type}
                className="size-10 md:size-20 lg:size-40"
              />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                {type}
              </span>
            </button>
          );
        })}
      </div>

      {value && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          {t(`logging.bristol.type${value}.description`)}
        </p>
      )}
    </div>
  );
}
