/**
 * Signed-cookie session for the env-gated dashboard password.
 *
 * Pure Node crypto, no Next imports — unit-tested in session.test.ts. The
 * secret is APP_PASSWORD itself: the token is `<expiresAtMs>.<hmac>` where
 * hmac = HMAC-SHA256(APP_PASSWORD, "hg-app:<expiresAtMs>"). Rotating the
 * password invalidates every session, which is the behaviour we want for a
 * single shared internal password. Real per-user auth arrives with the first
 * manager-linked client (docs/site-architecture.md → Tenant model).
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "hg_app_session";
export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function issueSessionToken(secret: string, now: number = Date.now()): string {
  const exp = now + SESSION_TTL_MS;
  return `${exp}.${sign(secret, `hg-app:${exp}`)}`;
}

export function verifySessionToken(
  secret: string | undefined,
  token: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!secret || !token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d{1,16}$/.test(expStr) || sig === "") return false;
  if (Number(expStr) <= now) return false;
  const expected = Buffer.from(sign(secret, `hg-app:${expStr}`));
  const given = Buffer.from(sig);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Constant-time password comparison (hash both so lengths always match). */
export function passwordMatches(secret: string, candidate: string): boolean {
  const a = createHash("sha256").update(candidate, "utf8").digest();
  const b = createHash("sha256").update(secret, "utf8").digest();
  return timingSafeEqual(a, b);
}
