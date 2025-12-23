"use client";

import { Activity, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const Analytics = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const symptomData = [
    { day: "1", severity: 20 },
    { day: "2", severity: 35 },
    { day: "3", severity: 25 },
    { day: "4", severity: 55 },
    { day: "5", severity: 40 },
    { day: "6", severity: 70 },
    { day: "7", severity: 45 },
    { day: "8", severity: 30 },
    { day: "9", severity: 25 },
    { day: "10", severity: 15 },
    { day: "11", severity: 30 },
    { day: "12", severity: 20 },
    { day: "13", severity: 15 },
    { day: "14", severity: 10 },
  ];

  const correlationData = [
    { name: "Dairy", value: 85, color: "#ef4444" },
    { name: "Gluten", value: 45, color: "#f97316" },
    { name: "Garlic", value: 30, color: "#eab308" },
    { name: "Rice", value: 10, color: "#10b981" },
  ];

  if (!isMounted) {
    return (
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Computed on-device.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Charts generated instantly in your browser using Recharts.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 relative h-96 flex items-center justify-center">
              <span className="text-slate-400">Loading charts...</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 h-96 flex items-center justify-center">
              <span className="text-slate-400">Loading charts...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Computed on-device.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Charts generated instantly in your browser using Recharts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/*Symptom Trends */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 relative h-96">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Symptom Severity Trend
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={256} minWidth={0}>
                <AreaChart data={symptomData}>
                  <defs>
                    <linearGradient
                      id="colorSeverity"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-700"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                    labelStyle={{
                      color: "var(--foreground)",
                    }}
                    itemStyle={{
                      color: "var(--foreground)",
                    }}
                    cursor={{ stroke: "#cbd5e1", strokeOpacity: 0.3 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="severity"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSeverity)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/*Correlations */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 h-96">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Food vs. Symptoms
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={256} minWidth={0}>
                <BarChart
                  layout="vertical"
                  data={correlationData}
                  margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-700"
                  />
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={60}
                    tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                    labelStyle={{
                      color: "var(--foreground)",
                    }}
                    itemStyle={{
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {correlationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
