/**
 * In-memory token bucket keyed by client, for Server Functions that are
 * reachable by direct POST (public forms).
 *
 * Scope, honestly: buckets live in this process. On a serverless host every
 * warm instance keeps its own, so this bounds abuse per instance — enough to
 * stop a naive loop against a form action, not a substitute for a host-level
 * limiter. Swap `createRateLimiter` for a KV-backed store when the intake path
 * gets a database; the call sites do not change.
 */

export interface RateLimiterOptions {
  /** Maximum burst per key. */
  capacity: number;
  /** Tokens restored per millisecond (e.g. `1 / 60_000` = one a minute). */
  refillPerMs: number;
  /** Clock, injectable for tests. Defaults to `Date.now`. */
  now?: () => number;
  /** Tracked-key cap; the least recently seen key is evicted past it. */
  maxKeys?: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  /** 0 when allowed; otherwise how long until one token is back. */
  retryAfterMs: number;
}

export interface RateLimiter {
  /** Consume one token for `key`. */
  take(key: string): RateLimitDecision;
  /** Number of keys currently tracked (for tests / diagnostics). */
  size(): number;
}

interface Bucket {
  tokens: number;
  updatedAt: number;
}

export function createRateLimiter({
  capacity,
  refillPerMs,
  now = Date.now,
  maxKeys = 10_000,
}: RateLimiterOptions): RateLimiter {
  if (!(capacity >= 1)) throw new Error("rate limiter: capacity must be >= 1");
  if (!(refillPerMs > 0)) throw new Error("rate limiter: refillPerMs must be > 0");

  // Map keeps insertion order; re-inserting on every take makes it LRU.
  const buckets = new Map<string, Bucket>();

  return {
    take(key) {
      const t = now();
      const prev = buckets.get(key);
      const tokens = prev
        ? Math.min(capacity, prev.tokens + (t - prev.updatedAt) * refillPerMs)
        : capacity;

      buckets.delete(key);
      if (tokens >= 1) {
        buckets.set(key, { tokens: tokens - 1, updatedAt: t });
        evict();
        return { allowed: true, retryAfterMs: 0 };
      }
      buckets.set(key, { tokens, updatedAt: t });
      evict();
      return { allowed: false, retryAfterMs: Math.ceil((1 - tokens) / refillPerMs) };
    },
    size: () => buckets.size,
  };

  function evict() {
    while (buckets.size > maxKeys) {
      const oldest = buckets.keys().next().value;
      if (oldest === undefined) break;
      buckets.delete(oldest);
    }
  }
}

/** The subset of `Headers` the key derivation needs (so tests can pass a Map-like). */
export interface HeaderReader {
  get(name: string): string | null;
}

/**
 * Client key for the limiter: first hop of `x-forwarded-for` (what Vercel and
 * most proxies set), then `x-real-ip`, else a shared "unknown" bucket so an
 * unattributable flood is still bounded.
 */
export function clientKey(headers: HeaderReader): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip")?.trim();
  return real || "unknown";
}
