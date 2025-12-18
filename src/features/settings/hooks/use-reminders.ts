import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/shared/db";

export function useReminders() {
  const settings = useLiveQuery(() => db.settings.toArray());

  // Parse settings into a map for easier access
  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.id] = setting.value;
    return acc;
  }, {} as Record<string, any>);

  const enabled = settingsMap?.["remindersEnabled"] ?? false;
  const time = settingsMap?.["reminderTime"] ?? "09:00"; // Default 9 AM
  const lastRun = settingsMap?.["lastNotificationDate"];

  useEffect(() => {
    if (!enabled || !time) return;

    const checkReminders = async () => {
      const now = new Date();
      const todayStr = now.toDateString();

      // Check if already notified today
      if (lastRun === todayStr) {
        return;
      }

      // Check time
      const [hours, minutes] = time.split(":").map(Number);
      const reminderDate = new Date();
      reminderDate.setHours(hours, minutes, 0, 0);

      // If current time is past reminder time
      if (now >= reminderDate) {
        // Send notification
        if (Notification.permission === "granted") {
          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification("Time to log!", {
              body: "Don't forget to track your gut health today.",
              icon: "/favicon-96x96.png",
              badge: "/favicon-96x96.png",
              tag: "daily-reminder", // Persist notification, replace old one
            });

            // Update last run
            await db.settings.put({
              id: "lastNotificationDate",
              value: todayStr,
            });
          } catch (error) {
            console.error("Failed to show notification:", error);
          }
        }
      }
    };

    // Check immediately and then every minute
    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [enabled, time, lastRun]);
}
