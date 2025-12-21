"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useFlareMode } from "../context/flare-context";

export function FlareButton() {
  const { setFlareMode } = useFlareMode();

  return (
    <Button
      className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 h-14 text-lg font-semibold shadow-sm mb-4"
      onClick={() => setFlareMode(true)}
    >
      <AlertCircle className="w-5 h-5 mr-2" />
      I&apos;m having a flare
    </Button>
  );
}
