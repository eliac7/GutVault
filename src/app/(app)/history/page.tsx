"use client";

import { HistoryList } from "@/features/history/ui/history-list";
import { AppHeader } from "@/widgets/app-header/ui/app-header";

export default function HistoryPage() {
  return (
    <>
      <AppHeader title="History" showBack />

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <HistoryList />
      </div>
    </>
  );
}
