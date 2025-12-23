"use client";

import { useLogs } from "@/shared/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { AlertCircle, TrendingUp, Brain } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";
import { BristolType } from "@/shared/db/types";
import { useTranslations } from "next-intl";

const MINIUM_CORRELATION_THRESHOLD = 3;

export function CorrelationAnalysis() {
  const logs = useLogs();
  const t = useTranslations("dashboard.correlations");

  const { foodCorrelations, stressCorrelation } = useMemo(() => {
    if (!logs) return { foodCorrelations: [], stressCorrelation: null };

    const foodStats: Record<
      string,
      { total: number; bad: number; recent: boolean }
    > = {};
    const stressStats = { totalHigh: 0, badHigh: 0, totalLow: 0, badLow: 0 };

    const sortedLogs = [...logs].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    const badBristolTypes: BristolType[] = [1, 2, 6, 7];
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    sortedLogs.forEach((log, index) => {
      // Outcome for THIS log (if it's a symptom/bm log)
      // or check future logs for outcome
      let isBadOutcome =
        (log.painLevel && log.painLevel >= 7) ||
        (log.bristolType && badBristolTypes.includes(log.bristolType));

      if (!isBadOutcome) {
        // Look ahead
        const logTime = log.timestamp.getTime();
        for (let i = index + 1; i < sortedLogs.length; i++) {
          const nextLog = sortedLogs[i];
          const timeDiff = nextLog.timestamp.getTime() - logTime;

          if (timeDiff > ONE_DAY_MS) break; // Stop if outside 24h window

          if (
            (nextLog.painLevel && nextLog.painLevel >= 7) ||
            (nextLog.bristolType &&
              badBristolTypes.includes(nextLog.bristolType))
          ) {
            isBadOutcome = true;
            break;
          }
        }
      }

      // Food Analysis
      if (log.foods && log.foods.length > 0) {
        log.foods.forEach((food) => {
          const normalizedFood = food.trim();
          if (!foodStats[normalizedFood]) {
            foodStats[normalizedFood] = { total: 0, bad: 0, recent: false };
          }
          foodStats[normalizedFood].total += 1;
          if (isBadOutcome) {
            foodStats[normalizedFood].bad += 1;
          }
        });
      }

      // Stress Analysis
      if (log.stressLevel) {
        if (log.stressLevel >= 6) {
          stressStats.totalHigh += 1;
          if (isBadOutcome) stressStats.badHigh += 1;
        } else {
          stressStats.totalLow += 1;
          if (isBadOutcome) stressStats.badLow += 1;
        }
      }
    });

    const foodResults = Object.entries(foodStats)
      .map(([food, stats]) => ({
        name: food.charAt(0).toUpperCase() + food.slice(1),
        score: stats.total > 0 ? (stats.bad / stats.total) * 100 : 0,
        count: stats.total,
        badCount: stats.bad,
      }))
      .filter((item) => item.count >= MINIUM_CORRELATION_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const highStressScore =
      stressStats.totalHigh > 0
        ? (stressStats.badHigh / stressStats.totalHigh) * 100
        : 0;
    const lowStressScore =
      stressStats.totalLow > 0
        ? (stressStats.badLow / stressStats.totalLow) * 100
        : 0;

    return {
      foodCorrelations: foodResults,
      stressCorrelation:
        stressStats.totalHigh > 2
          ? { high: highStressScore, low: lowStressScore }
          : null,
    };
  }, [logs]);

  if (!logs || logs.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-sm mt-6">
        <CardContent className="pt-6">
          <div className="text-center text-slate-500 dark:text-slate-400">
            {t("noLogs")}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (foodCorrelations.length === 0 && !stressCorrelation) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-sm mt-6">
        <CardContent className="pt-6">
          <div className="text-center text-slate-500 dark:text-slate-400">
            {t("notEnoughData")}
            <p className="text-xs mt-2 text-slate-400">
              {t("tryLoggingMore", { threshold: MINIUM_CORRELATION_THRESHOLD })}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const topTrigger = foodCorrelations[0];

  return (
    <div className="space-y-6 mt-6">
      {/* Stress Insight Card */}
      {stressCorrelation &&
        stressCorrelation.high > stressCorrelation.low + 20 && (
          <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-800/40 p-2 rounded-full mt-0.5">
                <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 text-base">
                  {t("stressConnectionTitle")}
                </h3>
                <p className="text-indigo-700 dark:text-indigo-300/80 mt-1 text-sm leading-relaxed">
                  {t("stressConnectionDescription", {
                    multiplier: Math.round(
                      stressCorrelation.high / (stressCorrelation.low || 1)
                    ),
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Food Insight Card */}
      {topTrigger && topTrigger.score > 50 && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-800/50 shadow-sm">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="bg-amber-100 dark:bg-amber-800/40 p-2 rounded-full mt-0.5">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-base">
                {t("foodTriggerTitle")}
              </h3>
              <p className="text-amber-700 dark:text-amber-300/80 mt-1 text-sm leading-relaxed">
                {t("foodTriggerDescription", {
                  food: topTrigger.name,
                  percentage: Math.round(topTrigger.score),
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Food Chart Card */}
      {foodCorrelations.length > 0 && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-slate-100">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              {t("foodTriggerProbabilityTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={foodCorrelations}
                  margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{
                      fill: "currentColor",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "var(--color-foreground)" }}
                    formatter={(value: number | undefined) => [
                      value !== undefined ? `${Math.round(value)}%` : "0%",
                      t("probability"),
                    ]}
                  />
                  <Bar
                    dataKey="score"
                    radius={[0, 4, 4, 0]}
                    barSize={32}
                    background={{ fill: "transparent" }}
                  >
                    {foodCorrelations.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#ef4444" // Top trigger red
                            : index === 1
                            ? "#f97316" // Orange
                            : "#3b82f6" // Blue for others
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
              {t("chartDescription")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
