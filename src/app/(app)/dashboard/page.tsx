"use client";

import { AtAGlance } from "@/features/dashboard/ui/at-a-glance";
import { PainChart } from "@/features/dashboard/ui/pain-chart";
import { RecentLogs } from "@/features/dashboard/ui/recent-logs";
import { LogFAB } from "@/features/logging/ui/log-fab";
import { AppHeader } from "@/widgets/app-header/ui/app-header";

export default function DashboardPage() {
  return (
    <>
      <AppHeader />
      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        <AtAGlance />
        <PainChart />
        <RecentLogs />
      </div>

      <LogFAB />
    </>
  );
}
