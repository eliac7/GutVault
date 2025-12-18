"use client";

interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipSelectorProps<T extends string> {
  label: string;
  options: ChipOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

export function ChipSelector<T extends string>({
  label,
  options,
  selected,
  onChange,
}: ChipSelectorProps<T>) {
  const toggleOption = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mt-4">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
