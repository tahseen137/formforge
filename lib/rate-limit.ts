// Simple in-memory rate limiting
// For production, use Redis (Upstash) or similar

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.limits.entries()) {
        if (entry.resetAt < now) {
          this.limits.delete(key);
        }
      }
    }, 60000);
  }

  check(key: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || entry.resetAt < now) {
      // No entry or expired - create new one
      const resetAt = now + windowMs;
      this.limits.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: maxRequests - 1, resetAt };
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    // Increment count
    entry.count++;
    this.limits.set(key, entry);
    return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
  }

  reset(key: string): void {
    this.limits.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

export function getRateLimitKey(identifier: string, action: string): string {
  return `${action}:${identifier}`;
}

export function getClientIp(request: Request): string {
  // Check various headers that might contain the client IP
  const headers = request.headers;
  
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'unknown';
}
