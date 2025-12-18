"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Palette, Globe, Bell, Clock } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { useTheme } from "next-themes";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/shared/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  SPEECH_LANGUAGES,
  type SpeechLanguageCode,
} from "@/features/logging/hooks/use-speech-recognition";
import ReactCountryFlag from "react-country-flag";

export function Preferences() {
  const { theme, setTheme } = useTheme();
  const [defaultLanguage, setDefaultLanguage] = useState<SpeechLanguageCode>(
    () =>
      (typeof window !== "undefined"
        ? (localStorage.getItem(
            "gutvault-voice-language"
          ) as SpeechLanguageCode)
        : null) || "en-US"
  );

  const handleLanguageChange = (code: SpeechLanguageCode) => {
    setDefaultLanguage(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("gutvault-voice-language", code);
    }
  };

  // Reminders Logic
  const settings = useLiveQuery(() => db.settings.toArray());
  const remindersEnabled =
    settings?.find((s) => s.id === "remindersEnabled")?.value ?? false;
  const reminderTime =
    settings?.find((s) => s.id === "reminderTime")?.value ?? "09:00";

  const handleToggleReminders = async () => {
    if (!remindersEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await db.settings.put({ id: "remindersEnabled", value: true });
        new Notification("Reminders enabled!", {
          body: "You'll be reminded to log daily.",
          icon: "/favicon-96x96.png",
        });
        // Set default time if not set
        if (!reminderTime) {
          await db.settings.put({ id: "reminderTime", value: "09:00" });
        }
      }
    } else {
      await db.settings.put({ id: "remindersEnabled", value: false });
    }
  };

  const handleTimeChange = async (newTime: string) => {
    await db.settings.put({ id: "reminderTime", value: newTime });
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
            <Select
              value={defaultLanguage}
              onValueChange={(value) =>
                handleLanguageChange(value as SpeechLanguageCode)
              }
            >
              <SelectTrigger className="w-full p-3 h-auto rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SPEECH_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag
                        countryCode={lang.flag}
                        svg
                        className="w-4 h-4"
                      />
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Daily Reminders */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Daily Reminders
            </label>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  Enable Reminders
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Get notified to log your symptoms
                </div>
              </div>
              <button
                onClick={handleToggleReminders}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  remindersEnabled
                    ? "bg-purple-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`${
                    remindersEnabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
            {remindersEnabled && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Remind me at:
                </span>
                <input
                  type="time"
                  value={reminderTime as string}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="bg-transparent border-0 p-0 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
