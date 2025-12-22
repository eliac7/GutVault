"use client";

import { getPainLevelColor } from "@/shared/lib/constants";

interface LevelSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: "pain" | "stress";
}

export function LevelSlider({
  label,
  value,
  onChange,
  type = "pain",
}: LevelSliderProps) {
  const colorConfig = getPainLevelColor(value);
  const color = {
    bg: `rgb(${colorConfig.rgb})`,
    light: `rgb(${colorConfig.lightRgb})`,
  };

  const getEmoji = (level: number) => {
    if (type === "pain") {
      if (level <= 2) return "😊";
      if (level <= 4) return "😐";
      if (level <= 6) return "😣";
      if (level <= 8) return "😖";
      return "😭";
    } else {
      // Stress emojis
      if (level <= 2) return "😌";
      if (level <= 4) return "😐";
      if (level <= 6) return "😰";
      if (level <= 8) return "🤯";
      return "😵";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getEmoji(value)}</span>
          <span className="text-2xl font-bold" style={{ color: color.bg }}>
            {value}
          </span>
          <span className="text-slate-400">/10</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color.bg} 0%, ${
              color.bg
            } ${(value - 1) * 11.11}%, rgb(226 232 240) ${
              (value - 1) * 11.11
            }%, rgb(226 232 240) 100%)`,
          }}
        />

        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: white;
            border: 4px solid ${color.bg};
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            transition: transform 0.15s ease;
          }
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
          }
          input[type="range"]::-moz-range-thumb {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: white;
            border: 4px solid ${color.bg};
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            cursor: pointer;
          }
        `}</style>
      </div>

      <div className="flex justify-between text-xs text-slate-400">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
    </div>
  );
}
