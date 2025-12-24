"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceStrict } from "date-fns";
import { el, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import {
  checkRateLimitStatus,
  consumeRateLimit,
} from "../actions/check-rate-limit";
import { getDeviceId } from "../lib/device-id";
import type { RateLimitType, RateLimitResult } from "../lib/rate-limit-config";

interface UseRateLimitOptions {
  type: RateLimitType;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseRateLimitReturn {
  status: RateLimitResult | null;
  isAllowed: boolean;
  remaining: number;
  resetAt: number | null;
  isLoading: boolean;
  error: string | null;
  checkStatus: () => Promise<void>;
  consume: () => Promise<boolean>;
  getTimeUntilReset: () => string | null;
}

export function useRateLimit({
  type,
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute
}: UseRateLimitOptions): UseRateLimitReturn {
  const t = useTranslations("logging.voiceDialog");
  const [status, setStatus] = useState<RateLimitResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  const deviceId = getDeviceId();

  const checkStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await checkRateLimitStatus(deviceId, type);
      setStatus(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check rate limit";
      setError(errorMessage);
      console.error("Rate limit check failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, type]);

  const consume = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await consumeRateLimit(deviceId, type);
      setStatus(result);
      return result.allowed;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to consume rate limit";
      setError(errorMessage);
      console.error("Rate limit consumption failed:", err);
      // Allow request if check fails
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, type]);

  const getTimeUntilReset = useCallback((): string | null => {
    if (!status?.resetAt) return null;

    const now = Math.floor(Date.now() / 1000);
    const secondsUntilReset = status.resetAt - now;

    if (secondsUntilReset <= 0) return null;

    if (secondsUntilReset < 60) {
      return t("lessThanAMinute");
    }

    const resetDate = new Date(status.resetAt * 1000);
    const currentDate = new Date(now * 1000);

    return formatDistanceStrict(resetDate, currentDate, {
      addSuffix: false,
      locale: locale === "el" ? el : enUS,
    });
  }, [status, locale, t]);

  // Initial load
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !status) return;

    const interval = setInterval(() => {
      checkStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, checkStatus, status]);

  return {
    status,
    isAllowed: status?.allowed ?? true,
    remaining: status?.remaining ?? 0,
    resetAt: status?.resetAt ?? null,
    isLoading,
    error,
    checkStatus,
    consume,
    getTimeUntilReset,
  };
}
