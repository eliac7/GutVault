import { SettingsContent } from "@/features/settings/ui/settings-content";
import { AppHeader } from "@/widgets/app-header/ui/app-header";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "navigation" });

  return {
    title: t("settings"),
  };
}
export default async function SettingsPage() {
  return (
    <>
      <AppHeader titleKey="navigation.settings" showBack />
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <SettingsContent />
      </div>
    </>
  );
}
