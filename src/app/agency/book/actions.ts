"use server";

import { headers } from "next/headers";
import {
  clientKey,
  createRateLimiter,
  deliverIntake,
  fingerprint,
} from "@/lib/intake";
import {
  readStrategyCallValues,
  validateStrategyCall,
  type StrategyCallState,
} from "@/components/agency/strategy-call";

const CONTACT = "connect@homegrwndigital.com";

/** Five submissions per client, then one a minute. Per instance — see src/lib/intake. */
const limiter = createRateLimiter({ capacity: 5, refillPerMs: 1 / 60_000 });

/**
 * /book form handler — the single entry point for strategy-call requests.
 *
 * Delivery: the validated fields are POSTed as JSON to `BOOK_WEBHOOK_URL`
 * (an n8n intake workflow that files the lead and notifies the inbox) via the
 * shared `deliverIntake` helper the Ads Driver /apply form already uses. If
 * the variable is unset or the POST fails, the action returns an error state
 * with the visitor's values intact and the direct email — it never reports
 * success for a lead nobody received (that was the pre-2026-09-13 behaviour
 * of this stub and is exactly what src/lib/intake/deliver.ts forbids).
 *
 * Security: Server Functions are reachable by direct POST, so the honeypot,
 * the per-client rate limit, and validation all run here, not in the form.
 * Nothing personally identifying is written to stdout: the log line carries
 * the trade, the budget band, and a truncated hash of the email.
 *
 * TODO(crm): once the dashboard picks its database, also write the row to
 * the intake store so the webhook becomes a notification, not the record.
 */
export async function submitStrategyCall(
  _prev: StrategyCallState,
  formData: FormData,
): Promise<StrategyCallState> {
  // Honeypot: a filled "website" field means a bot. Pretend success so it
  // stops retrying; a human never sees this field. Nothing is delivered.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { status: "success", firstName: "" };
  }

  const values = readStrategyCallValues(formData);

  const gate = limiter.take(clientKey(await headers()));
  if (!gate.allowed) {
    return {
      status: "error",
      message: `Too many requests from this connection. Wait a minute and try again, or email ${CONTACT}.`,
      errors: {},
      values,
    };
  }

  const errors = validateStrategyCall(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  const delivered = await deliverIntake(
    {
      kind: "agency-book",
      receivedAt: new Date().toISOString(),
      fields: values,
    },
    { url: process.env.BOOK_WEBHOOK_URL },
  );

  // Non-PII marker only: enumerated bands + a hash prefix. Never `values`.
  const marker = {
    trade: values.trade,
    budget: values.budget,
    email: fingerprint(values.email),
  };

  if (!delivered.ok) {
    console.error("[agency/book] delivery failed", {
      ...marker,
      reason: delivered.reason,
    });
    return {
      status: "error",
      message: `We couldn't send your request just now. Your answers are still here — try again in a moment, or email ${CONTACT} directly.`,
      errors: {},
      values,
    };
  }

  console.info("[agency/book] strategy call delivered", marker);
  return { status: "success", firstName: values.name.split(/\s+/)[0] ?? "" };
}
