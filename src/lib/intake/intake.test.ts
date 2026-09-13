import { describe, expect, it, vi } from "vitest";
import { clientKey, createRateLimiter, deliverIntake, fingerprint } from "./index";

describe("createRateLimiter", () => {
  it("allows a burst up to capacity, then refuses with a retry hint", () => {
    const rl = createRateLimiter({ capacity: 3, refillPerMs: 1 / 1000, now: () => 0 });
    expect(rl.take("a").allowed).toBe(true);
    expect(rl.take("a").allowed).toBe(true);
    expect(rl.take("a").allowed).toBe(true);
    const fourth = rl.take("a");
    expect(fourth.allowed).toBe(false);
    expect(fourth.retryAfterMs).toBe(1000);
  });

  it("refills with the clock", () => {
    let t = 0;
    const rl = createRateLimiter({ capacity: 1, refillPerMs: 1 / 1000, now: () => t });
    expect(rl.take("a").allowed).toBe(true);
    expect(rl.take("a").allowed).toBe(false);
    t = 999;
    expect(rl.take("a").allowed).toBe(false);
    t = 1000;
    expect(rl.take("a").allowed).toBe(true);
  });

  it("keeps keys independent", () => {
    const rl = createRateLimiter({ capacity: 1, refillPerMs: 1 / 1000, now: () => 0 });
    expect(rl.take("a").allowed).toBe(true);
    expect(rl.take("a").allowed).toBe(false);
    expect(rl.take("b").allowed).toBe(true);
  });

  it("evicts the least recently seen key past maxKeys", () => {
    const rl = createRateLimiter({
      capacity: 1,
      refillPerMs: 1 / 1000,
      now: () => 0,
      maxKeys: 2,
    });
    rl.take("a");
    rl.take("b");
    rl.take("a"); // touch a → b is now the oldest
    rl.take("c");
    expect(rl.size()).toBe(2);
    // a survived the eviction and is still exhausted; b was evicted, so it
    // gets a fresh bucket (which in turn evicts the now-oldest key, c).
    expect(rl.take("a").allowed).toBe(false);
    expect(rl.take("b").allowed).toBe(true);
    expect(rl.size()).toBe(2);
  });

  it("rejects nonsense configuration", () => {
    expect(() => createRateLimiter({ capacity: 0, refillPerMs: 1 })).toThrow();
    expect(() => createRateLimiter({ capacity: 1, refillPerMs: 0 })).toThrow();
  });
});

describe("clientKey", () => {
  it("uses the first hop of x-forwarded-for", () => {
    const h = new Headers({ "x-forwarded-for": " 203.0.113.9 , 10.0.0.1" });
    expect(clientKey(h)).toBe("203.0.113.9");
  });
  it("falls back to x-real-ip, then a shared unknown bucket", () => {
    expect(clientKey(new Headers({ "x-real-ip": "198.51.100.4" }))).toBe("198.51.100.4");
    expect(clientKey(new Headers())).toBe("unknown");
    expect(clientKey(new Headers({ "x-forwarded-for": " , " }))).toBe("unknown");
  });
});

describe("deliverIntake", () => {
  const payload = {
    kind: "ads-driver-apply" as const,
    receivedAt: "2026-09-13T00:00:00.000Z",
    fields: { business: "Acme Septic", email: "a@example.com" },
  };

  it("reports not-configured without touching the network", async () => {
    const fetchImpl = vi.fn();
    const r = await deliverIntake(payload, { url: undefined, fetchImpl });
    expect(r).toEqual({ ok: false, reason: "not-configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("POSTs JSON and succeeds on a 2xx", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }));
    const r = await deliverIntake(payload, { url: "https://hooks.example/x", fetchImpl });
    expect(r).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://hooks.example/x");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual(payload);
    expect(new Headers(init.headers).get("content-type")).toBe("application/json");
  });

  it("fails loud on a non-2xx and on a thrown fetch", async () => {
    const http = vi.fn(async () => new Response(null, { status: 500 }));
    expect(await deliverIntake(payload, { url: "https://h", fetchImpl: http })).toEqual({
      ok: false,
      reason: "http",
    });
    const net = vi.fn(async () => {
      throw new Error("ECONNRESET");
    });
    expect(await deliverIntake(payload, { url: "https://h", fetchImpl: net })).toEqual({
      ok: false,
      reason: "network",
    });
  });
});

describe("fingerprint", () => {
  it("is short, stable, case/space-insensitive, and not the input", () => {
    const a = fingerprint("Nathan@Example.com ");
    expect(a).toBe(fingerprint("nathan@example.com"));
    expect(a).toMatch(/^[0-9a-f]{12}$/);
    expect(a).not.toContain("example");
    expect(fingerprint("other@example.com")).not.toBe(a);
  });
});
