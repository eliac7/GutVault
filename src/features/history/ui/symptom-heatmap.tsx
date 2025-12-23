"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { el, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { getPainLevelColor } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { useMonthlyStats, type DailyStat } from "../hooks/use-monthly-stats";

export function SymptomHeatmap() {
  const t = useTranslations();
  const locale = useLocale();
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

  const dfLocale = locale === "el" ? el : enUS;

  const weekStart = startOfWeek(new Date(), { locale: dfLocale });
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(addDays(weekStart, i), "EEEEE", { locale: dfLocale })
  );
  const getDayColor = (stat: DailyStat | undefined) => {
    if (!stat || stat.logCount === 0)
      return "bg-slate-100 dark:bg-slate-800/50";
    if (stat.avgPain === null || stat.avgPain === 0)
      return "bg-slate-200 dark:bg-slate-700";

    const colors = getPainLevelColor(stat.avgPain);
    switch (colors.base) {
      case "emerald":
        return "bg-emerald-400 dark:bg-emerald-600";
      case "amber":
        return "bg-amber-400 dark:bg-amber-600";
      case "red":
        return "bg-red-400 dark:bg-red-600";
      default:
        return "bg-slate-200 dark:bg-slate-700";
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
          {t("history.heatmap.title")}
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
            {format(currentMonth, locale === "el" ? "LLLL yyyy" : "MMMM yyyy", {
              locale: dfLocale,
            })}
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
          {weekDays.map((day, idx) => (
            <div
              key={`${day}-${idx}`}
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
                          {format(
                            day,
                            locale === "el" ? "EEEE d MMM " : "EEEE, MMMM d",
                            { locale: dfLocale }
                          )}
                        </p>
                        <div className="space-y-1">
                          <p>
                            {t("history.heatmap.tooltip.averagePain")}:{" "}
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
                          <p>
                            {t("history.heatmap.tooltip.logsRecorded")}:{" "}
                            {stat.logCount}
                          </p>
                          {stat.hasSymptoms && (
                            <p className="text-amber-400">
                              {t("history.heatmap.tooltip.symptomsReported")}
                            </p>
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
            {t("history.heatmap.legend.lowPain")}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-400 dark:bg-amber-600"></div>
            {t("history.heatmap.legend.medium")}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-400 dark:bg-red-600"></div>
            {t("history.heatmap.legend.severe")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
