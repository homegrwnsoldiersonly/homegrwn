"use server";

/**
 * Server actions for the dashboard shell: sign in / out (password gate) and
 * tenant switching. All three only set cookies and redirect; none of them
 * touch account data — the surface stays recommend-only end to end.
 */

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { clientKeyFromHeaders, GLOBAL_KEY, loginLimiters } from "./login-limiter";
import {
  issueSessionToken,
  passwordMatches,
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "./session";
import { listTenants, TENANT_COOKIE } from "./tenants";

const TENANT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Fixed 300–500 ms on every failed or throttled attempt: no fast guessing. */
function failureDelay(): Promise<void> {
  const ms = 300 + Math.floor(Math.random() * 200);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/** Only ever bounce to a same-origin path. */
function safeNext(value: FormDataEntryValue | null): string {
  const s = typeof value === "string" ? value.trim() : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/login") ? s : "/";
}

export async function login(formData: FormData): Promise<void> {
  const secret = process.env.APP_PASSWORD;
  if (!secret) redirect("/");

  const next = safeNext(formData.get("next"));
  const back = (error: "1" | "locked"): never => {
    const params = new URLSearchParams({ error });
    if (next !== "/") params.set("next", next);
    redirect(`/login?${params.toString()}`);
  };

  // Throttle before comparing: a locked key never reaches the password check.
  const h = await headers();
  const key = clientKeyFromHeaders((name) => h.get(name));
  const { perIp, global } = loginLimiters;
  if (perIp.retryAfterMs(key) > 0 || global.retryAfterMs(GLOBAL_KEY) > 0) {
    await failureDelay();
    back("locked");
  }

  const candidate = String(formData.get("password") ?? "");
  if (!passwordMatches(secret, candidate)) {
    perIp.recordFailure(key);
    global.recordFailure(GLOBAL_KEY);
    await failureDelay();
    back("1");
  }
  perIp.reset(key);

  const store = await cookies();
  store.set(SESSION_COOKIE, issueSessionToken(secret), cookieOptions(SESSION_TTL_MS / 1000));
  redirect(next);
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function selectTenant(formData: FormData): Promise<void> {
  const id = String(formData.get("tenant") ?? "");
  const next = safeNext(formData.get("next"));
  const tenants = await listTenants();
  if (tenants.some((t) => t.id === id)) {
    const store = await cookies();
    store.set(TENANT_COOKIE, id, cookieOptions(TENANT_COOKIE_MAX_AGE));
  }
  redirect(next);
}
