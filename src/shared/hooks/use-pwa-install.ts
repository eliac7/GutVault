"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const DISMISSED_KEY = "gutvault_pwa_install_dismissed";
const DISMISSED_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // Start as true to prevent flash
  const [isInstalling, setIsInstalling] = useState(false);

  // Check if already installed or dismissed
  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    setIsInstalled(isStandalone);

    // Check iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // Check Firefox
    const isFirefoxBrowser = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    setIsFirefox(isFirefoxBrowser);

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      if (Date.now() - dismissedTime < DISMISSED_DURATION) {
        setIsDismissed(true);
        return;
      } else {
        localStorage.removeItem(DISMISSED_KEY);
      }
    }
    setIsDismissed(false);
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome's mini-infobar
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for app installed event
    const installedHandler = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;

    setIsInstalling(true);

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
        setInstallPrompt(null);
        return true;
      }
    } catch (error) {
      console.error("Error prompting install:", error);
    } finally {
      setIsInstalling(false);
    }

    return false;
  }, [installPrompt]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setIsDismissed(true);
  }, []);

  const canShowPrompt =
    !isInstalled && !isDismissed && (!!installPrompt || isIOS || isFirefox);

  return {
    canShowPrompt,
    isInstalled,
    isIOS,
    isFirefox,
    isInstalling,
    promptInstall,
    dismiss,
    installPrompt,
  };
}
