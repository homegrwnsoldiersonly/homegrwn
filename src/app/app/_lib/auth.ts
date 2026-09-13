/**
 * Password gate glue (Next `cookies()` + redirect). Pure token logic lives in
 * ./session.ts.
 *
 * Fail closed: with APP_PASSWORD unset the gate is open ONLY on a local dev
 * machine (not `NODE_ENV=production`, not on Vercel). A deployed build or any
 * *.vercel.app preview without the variable renders the "not configured"
 * state instead of every tenant's data — matching the cron route, which also
 * refuses unauthenticated runs in production.
 *
 * Every gated page calls `requireSession()` at the top — not only the layout.
 * Layouts and pages render in parallel, so a layout-only check would still
 * let a page's server-rendered payload be produced; checking at the page keeps
 * account data off the wire for anonymous requests.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/** Anything that is not a local `next dev` / local `next start`-in-dev run. */
function isDeployed(): boolean {
  return process.env.NODE_ENV === "production" || !!process.env.VERCEL_ENV;
}

export function passwordGateEnabled(): boolean {
  return !!process.env.APP_PASSWORD;
}

/**
 * True when the gate is off somewhere it must not be: a deployed environment
 * without APP_PASSWORD. `hasSession()` is false in that state; /login renders
 * the explanation rather than a form.
 */
export function passwordGateMisconfigured(): boolean {
  return !passwordGateEnabled() && isDeployed();
}

export async function hasSession(): Promise<boolean> {
  const secret = process.env.APP_PASSWORD;
  if (!secret) return !isDeployed();
  const store = await cookies();
  return verifySessionToken(secret, store.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<void> {
  if (!(await hasSession())) redirect("/login");
}
