// lib/rate-limiter.ts
class RateLimiter {
  private limits = new Map<string, { count: number; resetTime: number }>();
  private maxRequests = 10;
  private windowMs = 60000; // 1 minute

  async consume(key: string): Promise<{ remainingPoints: number; msBeforeNext: number }> {
    const now = Date.now();
    const limit = this.limits.get(key);

    if (!limit || now > limit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + this.windowMs });
      return { remainingPoints: this.maxRequests - 1, msBeforeNext: this.windowMs };
    }

    limit.count++;
    const remaining = this.maxRequests - limit.count;
    const msBeforeNext = limit.resetTime - now;

    return { remainingPoints: remaining, msBeforeNext };
  }
}

export const rateLimiter = new RateLimiter();
