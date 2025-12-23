import { Card } from "@/shared/ui/card";
import { useTranslations } from "next-intl";
export function HistoryEmptyState() {
  const t = useTranslations("dashboard.recentLogs");
  return (
    <Card className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50">
      <div className="text-4xl mb-4">📝</div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {t("noLogs")}
      </h3>
      <p className="text-slate-500 dark:text-slate-400">{t("startTracking")}</p>
    </Card>
  );
}
