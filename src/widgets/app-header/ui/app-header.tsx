"use client";

import { ArrowLeft, Settings, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/features/theme-toggle";
import { Button } from "@/shared/ui/button";
import { useFlareMode } from "@/features/flare";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function AppHeader({
  title = "GutVault",
  showBack = false,
}: AppHeaderProps) {
  const router = useRouter();
  const { isFlareMode, toggleFlareMode } = useFlareMode();

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
            {title}
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
            title={isFlareMode ? "Exit flare mode" : "I'm having a flare"}
          >
            <AlertCircle
              className={`w-5 h-5 ${isFlareMode ? "animate-pulse" : ""}`}
            />
          </Button>
          <ThemeToggle />
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
