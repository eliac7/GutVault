import { HistoryContent } from "@/features/history/ui/history-content";
import { AppHeader } from "@/widgets/app-header/ui/app-header";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "History",
};

export default async function HistoryPage() {
  const t = await getTranslations("history");

  return (
    <>
      <AppHeader titleKey="history.title" showBack />

      <div className="px-4 py-6 max-w-7xl mx-auto w-full">
        <HistoryContent />
      </div>
    </>
  );
}
