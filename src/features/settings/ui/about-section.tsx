"use client";

import { motion } from "motion/react";
import { Info } from "lucide-react";
import { Card } from "@/shared/ui/card";
import packageJson from "../../../../package.json";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function AboutSection() {
  const t = useTranslations("settings.about");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6 bg-white dark:bg-slate-900/80 rounded-3xl border-slate-200/50 dark:border-teal-500/30 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          {t("title")}
        </h2>

        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>{t("version")}</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {packageJson.version}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("database")}</span>
            <span className="font-medium text-teal-600 dark:text-cyan-400">
              {t("databaseValue")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("aiModel")}</span>
            <span className="font-medium text-teal-600 dark:text-cyan-400">
              {t("aiModelValue")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>{t("privacy")}</span>
            <Link
              href="/privacy"
              className="font-medium text-teal-600 dark:text-cyan-400 hover:underline"
              target="_blank"
            >
              {t("privacyDescription")}
            </Link>
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-center">
              {t("madeWith")}
              <br />
              <span className="text-slate-400">{t("features")}</span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
