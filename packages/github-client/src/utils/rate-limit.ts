export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: Date;
}

export function extractRateLimit(data: any): RateLimitInfo | null {
  if (data?.rateLimit) {
    return {
      limit: data.rateLimit.limit,
      remaining: data.rateLimit.remaining,
      resetAt: new Date(data.rateLimit.resetAt),
    };
  }
  return null;
}
