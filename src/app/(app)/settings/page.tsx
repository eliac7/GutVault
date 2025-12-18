"use client";

import { SettingsContent } from "@/features/settings/ui/settings-content";
import { AppHeader } from "@/widgets/app-header/ui/app-header";

export default function SettingsPage() {
  return (
    <>
      <AppHeader title="Settings" showBack />
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <SettingsContent />
      </div>
    </>
  );
}
