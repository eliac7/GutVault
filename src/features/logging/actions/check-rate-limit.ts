"use server";

import { getRateLimitStatus, checkRateLimit } from "../lib/rate-limit";
import type { RateLimitType, RateLimitResult } from "../lib/rate-limit-config";

export async function checkRateLimitStatus(
  deviceId: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  return getRateLimitStatus(deviceId, type);
}

export async function consumeRateLimit(
  deviceId: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  return checkRateLimit(deviceId, type);
}
