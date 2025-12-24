"use client";

import { ArrowLeft, Settings, AlertCircle, Globe } from "lucide-react";
import { ThemeToggle } from "@/features/theme-toggle";
import { Button } from "@/shared/ui/button";
import { useFlareMode } from "@/features/flare";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { localeNames, type Locale } from "@/i18n/config";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface AppHeaderProps {
  title?: string;
  titleKey?: string;
  showBack?: boolean;
}

export function AppHeader({
  title,
  titleKey,
  showBack = false,
}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const { isFlareMode, toggleFlareMode } = useFlareMode();

  const displayTitle = titleKey ? t(titleKey) : title ?? t("common.appName");

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
            </Link>
          )}
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {displayTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFlareMode}
            className={`rounded-xl transition-all ${
              isFlareMode
                ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 ring-2 ring-rose-500/20"
                : "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
            }`}
            title={
              isFlareMode ? t("header.exitFlareMode") : t("header.flareMode")
            }
          >
            <AlertCircle
              className={`w-5 h-5 ${isFlareMode ? "animate-pulse" : ""}`}
            />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                title={t("settings.preferences.language")}
              >
                <Globe className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
              {(Object.entries(localeNames) as [Locale, string][]).map(
                ([code, name]) => (
                  <button
                    key={code}
                    onClick={() => switchLocale(code)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      locale === code
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {name}
                  </button>
                )
              )}
            </PopoverContent>
          </Popover>

          <ThemeToggle />
          <Link href="/dashboard/settings" prefetch>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
