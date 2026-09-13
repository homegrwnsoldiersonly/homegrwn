"use server";

import { headers } from "next/headers";
import {
  clientKey,
  createRateLimiter,
  deliverIntake,
  fingerprint,
} from "@/lib/intake";
import {
  APPLY_FIELDS,
  isSpendValue,
  isTradeValue,
  type ApplyField,
  type ApplyState,
  type ApplyValues,
} from "./applyTypes";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SITE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

const CONTACT = "connect@homegrwndigital.com";

/** Five submissions per client, then one a minute. Per instance — see src/lib/intake. */
const limiter = createRateLimiter({ capacity: 5, refillPerMs: 1 / 60_000 });

/**
 * Early-access application.
 *
 * Delivery: the validated fields are POSTed as JSON to `APPLY_WEBHOOK_URL`
 * (an n8n intake workflow that files the lead and notifies the inbox). If the
 * variable is unset or the POST fails, the action returns an error state with
 * the visitor's values intact and the direct email — it never reports success
 * for a lead nobody received.
 *
 * Security: Server Functions are reachable by direct POST, so the honeypot,
 * the per-client rate limit, and validation all run here, not in the form.
 * Nothing personally identifying is written to stdout: the log line carries
 * the trade, the spend band, and a truncated hash of the email.
 *
 * TODO(ads-driver/apply): once the dashboard picks its database, also write
 * the row to the tenant/intake store (docs/site-architecture.md → "Tenant
 * model") so the webhook becomes a notification, not the system of record.
 */
export async function submitEarlyAccess(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const values = Object.fromEntries(
    APPLY_FIELDS.map((f) => [f, String(formData.get(f) ?? "").trim()]),
  ) as ApplyValues;

  // Honeypot: real users never see or fill this field. Bots get a quiet "ok"
  // so they stop retrying; nothing is delivered.
  if (String(formData.get("company_fax") ?? "").length > 0) {
    return { status: "ok" };
  }

  const gate = limiter.take(clientKey(await headers()));
  if (!gate.allowed) {
    return {
      status: "error",
      message: `Too many submissions from this connection. Wait a minute and try again, or email ${CONTACT}.`,
      errors: {},
      values,
    };
  }

  const errors: Partial<Record<ApplyField, string>> = {};
  if (values.business.length < 2) errors.business = "Tell us the business name.";
  if (!isTradeValue(values.practice))
    errors.practice = "Pick the closest trade or practice area.";
  if (!isSpendValue(values.spend)) errors.spend = "Pick a spend band.";
  if (values.site && !SITE.test(values.site))
    errors.site = "Enter a site like yourcompany.com.";
  if (!EMAIL.test(values.email)) errors.email = "Enter a working email.";
  if (values.notes.length > 2000)
    errors.notes = "Keep the note under 2,000 characters.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "A couple of fields need attention.",
      errors,
      values,
    };
  }

  const delivered = await deliverIntake(
    {
      kind: "ads-driver-apply",
      receivedAt: new Date().toISOString(),
      fields: values,
    },
    { url: process.env.APPLY_WEBHOOK_URL },
  );

  // Non-PII marker only: enumerated bands + a hash prefix. Never `values`.
  const marker = {
    practice: values.practice,
    spend: values.spend,
    email: fingerprint(values.email),
  };

  if (!delivered.ok) {
    console.error("[ads-driver/apply] delivery failed", {
      ...marker,
      reason: delivered.reason,
    });
    return {
      status: "error",
      message: `We couldn't send your application just now. Your answers are still here — try again in a moment, or email ${CONTACT} directly.`,
      errors: {},
      values,
    };
  }

  console.info("[ads-driver/apply] application delivered", marker);
  return { status: "ok" };
}
