"use server";

import { redis } from "@/shared/lib/redis";
import {
  RATE_LIMIT_CONFIG,
  type RateLimitResult,
  type RateLimitType,
} from "./rate-limit-config";

function getDeviceId(deviceId: string): string {
  return deviceId.replace(/[^a-zA-Z0-9-]/g, "").substring(0, 64);
}

export async function checkRateLimit(
  deviceId: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIG[type];
  const sanitizedDeviceId = getDeviceId(deviceId);
  const key = `${config.KEY_PREFIX}:${sanitizedDeviceId}`;

  try {
    const [currentCount, ttl] = await Promise.all([
      redis.get<number>(key),
      redis.ttl(key),
    ]);

    const count = currentCount ?? 0;
    const remaining = Math.max(0, config.MAX_REQUESTS - count);
    const allowed = count < config.MAX_REQUESTS;

    const now = Math.floor(Date.now() / 1000);
    const resetAt = ttl > 0 ? now + ttl : now + config.WINDOW_SECONDS;

    if (allowed) {
      if (count === 0) {
        await redis.setex(key, config.WINDOW_SECONDS, 1);
      } else {
        await redis.incr(key);
      }
    }

    return {
      allowed,
      remaining,
      resetAt,
      limit: config.MAX_REQUESTS,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return {
      allowed: true,
      remaining: config.MAX_REQUESTS,
      resetAt: Math.floor(Date.now() / 1000) + config.WINDOW_SECONDS,
      limit: config.MAX_REQUESTS,
    };
  }
}

export async function getRateLimitStatus(
  deviceId: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIG[type];
  const sanitizedDeviceId = getDeviceId(deviceId);
  const key = `${config.KEY_PREFIX}:${sanitizedDeviceId}`;

  try {
    const [currentCount, ttl] = await Promise.all([
      redis.get<number>(key),
      redis.ttl(key),
    ]);

    const count = currentCount ?? 0;
    const remaining = Math.max(0, config.MAX_REQUESTS - count);
    const allowed = count < config.MAX_REQUESTS;

    const now = Math.floor(Date.now() / 1000);
    const resetAt = ttl > 0 ? now + ttl : now + config.WINDOW_SECONDS;

    return {
      allowed,
      remaining,
      resetAt,
      limit: config.MAX_REQUESTS,
    };
  } catch (error) {
    console.error("Rate limit status check failed:", error);
    return {
      allowed: true,
      remaining: config.MAX_REQUESTS,
      resetAt: Math.floor(Date.now() / 1000) + config.WINDOW_SECONDS,
      limit: config.MAX_REQUESTS,
    };
  }
}
