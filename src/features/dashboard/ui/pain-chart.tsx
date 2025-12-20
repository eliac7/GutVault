"use client";

import { motion } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useLogsLastDays } from "@/shared/db";
import { Card } from "@/shared/ui/card";

export function PainChart() {
  const logs = useLogsLastDays(7);

  // Process logs into daily averages for the chart
  const getChartData = () => {
    const dailyData: Record<string, { total: number; count: number }> = {};
    const days = [];

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString("en-US", { weekday: "short" });
      days.push(key);
      dailyData[key] = { total: 0, count: 0 };
    }

    // Aggregate pain levels by day
    logs?.forEach((log) => {
      if (log.painLevel) {
        const date = new Date(log.timestamp);
        const key = date.toLocaleDateString("en-US", { weekday: "short" });
        if (dailyData[key]) {
          dailyData[key].total += log.painLevel;
          dailyData[key].count += 1;
        }
      }
    });

    // Calculate averages
    return days.map((day) => ({
      day,
      pain:
        dailyData[day].count > 0
          ? Math.round(dailyData[day].total / dailyData[day].count)
          : null,
    }));
  };

  const chartData = getChartData();
  const hasData = chartData.some((d) => d.pain !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="p-4 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Pain Levels — Last 7 Days
        </h2>

        {hasData ? (
          <div className="h-48 min-w-0 min-h-48">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="text-slate-500 dark:text-slate-400"
                />
                <YAxis
                  domain={[0, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="text-slate-500 dark:text-slate-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    color: "var(--color-foreground)",
                    fontWeight: 600,
                  }}
                  formatter={(value: number | undefined) => [
                    value !== undefined ? value : 0,
                    "Pain Level",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="pain"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#painGradient)"
                  connectNulls
                  dot={{
                    fill: "#f59e0b",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "var(--color-card)",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              No pain data logged yet. Start tracking to see trends!
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
