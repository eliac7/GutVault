export const SEVERITY_COLORS = {
  low: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    darkBg: "dark:bg-emerald-900/30",
    darkText: "dark:text-emerald-400",
    base: "emerald",
    hex: "#10b981", // emerald-500
    rgb: "16 185 129",
    lightRgb: "209 250 229", // emerald-100
  },
  medium: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    darkBg: "dark:bg-amber-900/30",
    darkText: "dark:text-amber-400",
    base: "amber",
    hex: "#f59e0b", // amber-500
    rgb: "245 158 11",
    lightRgb: "254 243 199", // amber-100
  },
  high: {
    bg: "bg-red-100",
    text: "text-red-700",
    darkBg: "dark:bg-red-900/30",
    darkText: "dark:text-red-400",
    base: "red",
    hex: "#ef4444", // red-500
    rgb: "239 68 68",
    lightRgb: "254 226 226", // red-100
  },
} as const;

export const getPainLevelColor = (level: number) => {
  if (level <= 3) return SEVERITY_COLORS.low;
  if (level <= 6) return SEVERITY_COLORS.medium;
  return SEVERITY_COLORS.high;
};
