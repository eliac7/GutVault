import { AtAGlance } from "@/features/dashboard/ui/at-a-glance";
import { CorrelationAnalysis } from "@/features/dashboard/ui/correlation-analysis";
import { PainChart } from "@/features/dashboard/ui/pain-chart";
import { RecentLogs } from "@/features/dashboard/ui/recent-logs";
import { LogFAB } from "@/features/logging/ui/log-fab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { AppHeader } from "@/widgets/app-header/ui/app-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <AppHeader />
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 outline-none">
            <AtAGlance />
            <PainChart />
            <RecentLogs />
          </TabsContent>

          <TabsContent value="correlations" className="outline-none">
            <CorrelationAnalysis />
          </TabsContent>
        </Tabs>
      </div>

      <LogFAB />
    </>
  );
}
