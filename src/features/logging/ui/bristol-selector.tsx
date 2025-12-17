"use client";

import { type BristolType, BRISTOL_DESCRIPTIONS } from "@/shared/db";

interface BristolSelectorProps {
  value: BristolType | null;
  onChange: (value: BristolType) => void;
}

export function BristolSelector({ value, onChange }: BristolSelectorProps) {
  const bristolTypes: BristolType[] = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Bristol Stool Type
      </label>
      <div className="grid grid-cols-7 gap-2">
        {bristolTypes.map((type) => {
          const info = BRISTOL_DESCRIPTIONS[type];
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
              <span className="text-lg">{info.emoji}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                {type}
              </span>
            </button>
          );
        })}
      </div>

      {value && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          {BRISTOL_DESCRIPTIONS[value].description}
        </p>
      )}
    </div>
  );
}
