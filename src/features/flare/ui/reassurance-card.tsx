"use client";

import { Card } from "@/shared/ui/card";
import { Sparkles } from "lucide-react";

export function ReassuranceCard() {
  return (
    <Card className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900/50">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
          <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
            This will pass
          </h3>
          <p className="text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed">
            You&apos;ve handled this before, and you can handle it now. Your
            body knows how to heal. Take it one moment at a time.
          </p>
        </div>
      </div>
    </Card>
  );
}
