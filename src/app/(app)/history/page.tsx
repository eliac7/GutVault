import { HistoryContent } from "@/features/history/ui/history-content";
import { AppHeader } from "@/widgets/app-header/ui/app-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History",
};

export default function HistoryPage() {
  return (
    <>
      <AppHeader title="History" showBack />

      <div className="px-4 py-6 max-w-7xl mx-auto w-full">
        <HistoryContent />
      </div>
    </>
  );
}
