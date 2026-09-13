/**
 * Failed-login throttle for the shared operator password.
 *
 * Pure, no Next imports — unit-tested in login-limiter.test.ts. A key (client
 * IP, or "*" for the whole instance) gets `freeAttempts` failures per window;
 * every failure past that locks the key for `baseLockMs · 2^n`, capped at
 * `maxLockMs`. Failures decay after `windowMs` without a new one.
 *
 * v1 is in-memory, so on serverless it is per warm instance — enough to turn
 * an unbounded online guess into a slow one, not a substitute for the real
 * auth provider that arrives with the first manager-linked client. Swap the
 * store for Vercel KV / Upstash when deployed at scale.
 */

export interface LoginLimiterOptions {
  /** Failures allowed inside a window before the first lock. */
  freeAttempts: number;
  /** Lock applied on the first failure past `freeAttempts`; doubles after. */
  baseLockMs: number;
  /** Ceiling for the exponential lock. */
  maxLockMs: number;
  /** Idle time after which a key's failure count resets. */
  windowMs: number;
  /** Memory bound: expired keys are pruned first, then the oldest. */
  maxKeys: number;
}

interface Entry {
  failures: number;
  lockedUntil: number;
  updatedAt: number;
}

/** Per-client-IP limits: 5 free, then 1s → 2s → 4s … → 15 min. */
export const IP_LIMITS: LoginLimiterOptions = {
  freeAttempts: 5,
  baseLockMs: 1_000,
  maxLockMs: 15 * 60_000,
  windowMs: 15 * 60_000,
  maxKeys: 10_000,
};

/**
 * Instance-wide limits: a distributed guess across many IPs still hits this.
 * Kept short (≤ 60s) so an attacker cannot lock the operator out for long.
 */
export const GLOBAL_LIMITS: LoginLimiterOptions = {
  freeAttempts: 50,
  baseLockMs: 2_000,
  maxLockMs: 60_000,
  windowMs: 15 * 60_000,
  maxKeys: 1,
};

export const GLOBAL_KEY = "*";

export class LoginLimiter {
  private readonly entries = new Map<string, Entry>();

  constructor(private readonly opts: LoginLimiterOptions) {}

  /** Milliseconds until `key` may try again; 0 when it may try now. */
  retryAfterMs(key: string, now: number = Date.now()): number {
    const entry = this.live(key, now);
    if (!entry) return 0;
    return Math.max(0, entry.lockedUntil - now);
  }

  /** Record a failed attempt; returns the lock applied (0 while still free). */
  recordFailure(key: string, now: number = Date.now()): number {
    const prev = this.live(key, now);
    const failures = (prev?.failures ?? 0) + 1;
    const over = failures - this.opts.freeAttempts;
    const lockMs =
      over <= 0
        ? 0
        : Math.min(this.opts.maxLockMs, this.opts.baseLockMs * 2 ** (over - 1));
    // Delete + set so Map insertion order stays "least recently updated first".
    this.entries.delete(key);
    this.entries.set(key, { failures, lockedUntil: now + lockMs, updatedAt: now });
    this.prune(now);
    return lockMs;
  }

  /** A successful sign-in clears the key. */
  reset(key: string): void {
    this.entries.delete(key);
  }

  /** Number of tracked keys (for tests). */
  get size(): number {
    return this.entries.size;
  }

  private live(key: string, now: number): Entry | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.updatedAt + this.opts.windowMs <= now && entry.lockedUntil <= now) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }

  private prune(now: number): void {
    if (this.entries.size <= this.opts.maxKeys) return;
    for (const [key, entry] of this.entries) {
      if (entry.updatedAt + this.opts.windowMs <= now && entry.lockedUntil <= now) {
        this.entries.delete(key);
      }
    }
    // Still over: drop the least recently updated until within bounds.
    for (const key of this.entries.keys()) {
      if (this.entries.size <= this.opts.maxKeys) break;
      this.entries.delete(key);
    }
  }
}

/** First hop of x-forwarded-for, else x-real-ip, else a shared bucket. */
export function clientKeyFromHeaders(get: (name: string) => string | null): string {
  const xff = get("x-forwarded-for");
  const first = xff?.split(",")[0]?.trim();
  if (first) return first;
  const real = get("x-real-ip")?.trim();
  return real || "unknown";
}

/** Module singletons: one per process (per warm serverless instance). */
export const loginLimiters = {
  perIp: new LoginLimiter(IP_LIMITS),
  global: new LoginLimiter(GLOBAL_LIMITS),
};
