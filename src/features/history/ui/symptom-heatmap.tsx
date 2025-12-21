"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useMonthlyStats, type DailyStat } from "../hooks/use-monthly-stats";
import { cn } from "@/shared/lib/utils";
import { getPainLevelColor, SEVERITY_COLORS } from "@/shared/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function SymptomHeatmap() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const stats = useMonthlyStats(currentMonth);

  const handleMonthChange = (dir: number) => {
    setDirection(dir);
    setCurrentMonth((prev) =>
      dir > 0 ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDayColor = (stat: DailyStat | undefined) => {
    if (!stat || stat.logCount === 0)
      return "bg-slate-100 dark:bg-slate-800/50";
    if (stat.avgPain === null || stat.avgPain === 0)
      return "bg-slate-200 dark:bg-slate-700";
    
    const colors = getPainLevelColor(stat.avgPain);
    // Use the tailwind classes from the config, mapping base to specific shades if needed, 
    // or using the exact strings if they match.
    // The heatmap used:
    // <=3: bg-emerald-400 dark:bg-emerald-600
    // <=6: bg-amber-400 dark:bg-amber-600
    // >6: bg-red-400 dark:bg-red-600
    
    // The constant uses 100/700 and 900/400. 
    // I should probably respect the Heatmap's specific needs or update the constant to include these 'chart' colors?
    // Or just map the base color to the classes used here.
    
    switch (colors.base) {
      case "emerald": return "bg-emerald-400 dark:bg-emerald-600";
      case "amber": return "bg-amber-400 dark:bg-amber-600";
      case "red": return "bg-red-400 dark:bg-red-600";
      default: return "bg-slate-200 dark:bg-slate-700";
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -20 : 20, opacity: 0 }),
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-300">
          Symptom Calendar
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleMonthChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium w-32 text-center tabular-nums">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleMonthChange(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] uppercase tracking-wider text-slate-400 font-bold py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <TooltipProvider delayDuration={100}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={currentMonth.toISOString()}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="grid grid-cols-7 gap-1 sm:gap-2"
            >
              {calendarDays.map((day) => {
                const dateKey = day.toDateString();
                const stat = stats?.[dateKey];
                const isCurrentMonth = isSameMonth(day, monthStart);

                return (
                  <Tooltip key={day.toString()}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "aspect-square relative group cursor-default",
                          !isCurrentMonth && "opacity-20 grayscale"
                        )}
                      >
                        <div
                          className={cn(
                            "w-full h-full rounded-lg sm:rounded-xl flex items-center justify-center text-xs transition-colors relative overflow-hidden",
                            getDayColor(stat),
                            isToday(day) &&
                              "ring-2 ring-slate-900 dark:ring-slate-100 ring-offset-2 ring-offset-white dark:ring-offset-slate-950"
                          )}
                        >
                          <span
                            className={cn(
                              "z-10 font-medium select-none",
                              stat?.avgPain && stat.avgPain >= 4
                                ? "text-white"
                                : "text-slate-700 dark:text-slate-300"
                            )}
                          >
                            {format(day, "d")}
                          </span>
                          {stat?.hasSymptoms && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-60" />
                          )}
                        </div>
                      </motion.div>
                    </TooltipTrigger>

                    {stat && (
                      <TooltipContent
                        side="top"
                        className="text-xs bg-slate-900 text-white border-slate-800"
                      >
                        <p className="font-bold mb-1">
                          {format(day, "EEEE, MMM d")}
                        </p>
                        <div className="space-y-1">
                          <p>
                            Average Pain:{" "}
                            <span
                              className={cn(
                                "font-bold",
                                stat.avgPain && stat.avgPain > 5
                                  ? "text-red-400"
                                  : "text-emerald-400"
                              )}
                            >
                              {stat.avgPain ?? 0}/10
                            </span>
                          </p>
                          <p>Logs recorded: {stat.logCount}</p>
                          {stat.hasSymptoms && (
                            <p className="text-amber-400">Symptoms reported</p>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </TooltipProvider>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-400 dark:bg-emerald-600"></div>
            Low Pain
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-400 dark:bg-amber-600"></div>
            Medium
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-400 dark:bg-red-600"></div>
            Severe
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
