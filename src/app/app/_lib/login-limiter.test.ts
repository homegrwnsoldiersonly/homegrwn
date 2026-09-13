import { describe, expect, it } from "vitest";
import {
  clientKeyFromHeaders,
  LoginLimiter,
  type LoginLimiterOptions,
} from "./login-limiter";

const OPTS: LoginLimiterOptions = {
  freeAttempts: 2,
  baseLockMs: 100,
  maxLockMs: 800,
  windowMs: 10_000,
  maxKeys: 3,
};

describe("LoginLimiter", () => {
  it("allows the free attempts, then backs off exponentially to the cap", () => {
    const l = new LoginLimiter(OPTS);
    const t = 1_000;
    expect(l.recordFailure("a", t)).toBe(0);
    expect(l.recordFailure("a", t)).toBe(0);
    expect(l.retryAfterMs("a", t)).toBe(0);
    expect(l.recordFailure("a", t)).toBe(100);
    expect(l.retryAfterMs("a", t + 40)).toBe(60);
    expect(l.recordFailure("a", t + 100)).toBe(200);
    expect(l.recordFailure("a", t + 300)).toBe(400);
    expect(l.recordFailure("a", t + 700)).toBe(800);
    expect(l.recordFailure("a", t + 1_500)).toBe(800); // capped
  });

  it("keys are independent and reset() clears one", () => {
    const l = new LoginLimiter(OPTS);
    for (let i = 0; i < 4; i++) l.recordFailure("a", 0);
    expect(l.retryAfterMs("a", 0)).toBeGreaterThan(0);
    expect(l.retryAfterMs("b", 0)).toBe(0);
    l.reset("a");
    expect(l.retryAfterMs("a", 0)).toBe(0);
  });

  it("forgets failures after the idle window", () => {
    const l = new LoginLimiter(OPTS);
    for (let i = 0; i < 3; i++) l.recordFailure("a", 0);
    expect(l.retryAfterMs("a", 50)).toBe(50);
    // Past the window and past the lock: a fresh start, so no lock yet.
    expect(l.recordFailure("a", 20_000)).toBe(0);
  });

  it("bounds memory by pruning the least recently updated keys", () => {
    const l = new LoginLimiter(OPTS);
    l.recordFailure("a", 0);
    l.recordFailure("b", 1);
    l.recordFailure("c", 2);
    l.recordFailure("d", 3);
    expect(l.size).toBe(3);
    expect(l.retryAfterMs("d", 3)).toBe(0);
  });
});

describe("clientKeyFromHeaders", () => {
  const mk = (h: Record<string, string>) => (n: string) => h[n] ?? null;
  it("prefers the first x-forwarded-for hop", () => {
    expect(clientKeyFromHeaders(mk({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4");
  });
  it("falls back to x-real-ip, then a shared bucket", () => {
    expect(clientKeyFromHeaders(mk({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8");
    expect(clientKeyFromHeaders(mk({}))).toBe("unknown");
  });
});
