export const RATE_LIMIT_CONFIG = {
  VOICE_LOG: {
    MAX_REQUESTS: 10,
    WINDOW_SECONDS: 60 * 60,
    KEY_PREFIX: "rate_limit:voice_log",
  },

  FOOD_ANALYSIS: {
    MAX_REQUESTS: 20,
    WINDOW_SECONDS: 60 * 60,
    KEY_PREFIX: "rate_limit:food_analysis",
  },
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export interface RateLimitError {
  success: false;
  error: string;
  rateLimit: RateLimitResult;
}
