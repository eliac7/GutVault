import { SettingsContent } from "@/features/settings/ui/settings-content";
import { AppHeader } from "@/widgets/app-header/ui/app-header";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const t = await getTranslations("settings");

  return (
    <>
      <AppHeader titleKey="settings.title" showBack />
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <SettingsContent />
      </div>
    </>
  );
}

