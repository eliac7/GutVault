"use client";

import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/features/theme-toggle";
import { Button } from "@/shared/ui/button";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function AppHeader({
  title = "GutVault",
  showBack = false,
}: AppHeaderProps) {
  const router = useRouter();

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
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
