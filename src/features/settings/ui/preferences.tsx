"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Palette, Globe } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { useTheme } from "next-themes";
import {
  SPEECH_LANGUAGES,
  type SpeechLanguageCode,
} from "@/features/logging/hooks/use-speech-recognition";
import ReactCountryFlag from "react-country-flag";

export function Preferences() {
  const { theme, setTheme } = useTheme();
  const [defaultLanguage, setDefaultLanguage] =
    useState<SpeechLanguageCode>("en-US");

  useEffect(() => {
    const stored = localStorage.getItem(
      "gutvault-voice-language"
    ) as SpeechLanguageCode;
    if (stored) {
      setDefaultLanguage(stored);
    }
  }, []);

  const handleLanguageChange = (code: SpeechLanguageCode) => {
    setDefaultLanguage(code);
    localStorage.setItem("gutvault-voice-language", code);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-500" />
          Preferences
        </h2>

        <div className="space-y-4">
          {/* Theme */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2" suppressHydrationWarning>
              {["light", "dark", "system"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-3 rounded-xl text-sm font-medium capitalize transition-all ${
                    theme === t
                      ? "bg-purple-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                  suppressHydrationWarning
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Default Voice Language */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Default Voice Language
            </label>
            <select
              value={defaultLanguage}
              onChange={(e) =>
                handleLanguageChange(e.target.value as SpeechLanguageCode)
              }
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100"
            >
              {SPEECH_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  <ReactCountryFlag countryCode={lang.code} svg />
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
