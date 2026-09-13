import { createHash } from "node:crypto";

/**
 * Delivery of a public-form submission to the intake path.
 *
 * v1 is a JSON POST to a webhook URL (an n8n workflow that files the lead and
 * notifies the inbox). The function is pure — URL and fetch are injected — so
 * an action can be unit-tested without the network, and so the same helper
 * serves every form: ads-driver /apply today, agency /book when it is wired.
 *
 * Contract: the result is explicit. A caller must return an error state to the
 * visitor on `ok: false`; it must never report success for a lead that was not
 * delivered somewhere a human will read.
 */

export type IntakeKind = "ads-driver-apply" | "agency-book";

export interface IntakePayload {
  kind: IntakeKind;
  /** ISO timestamp set by the action. */
  receivedAt: string;
  /** Validated form fields, as the visitor typed them. */
  fields: Record<string, string>;
}

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "http" | "network" };

export interface DeliverOptions {
  /** Webhook URL from the environment; `undefined` means not configured. */
  url: string | undefined;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export async function deliverIntake(
  payload: IntakePayload,
  { url, fetchImpl = fetch, timeoutMs = 8_000 }: DeliverOptions,
): Promise<DeliveryResult> {
  if (!url) return { ok: false, reason: "not-configured" };
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });
    return res.ok ? { ok: true } : { ok: false, reason: "http" };
  } catch {
    return { ok: false, reason: "network" };
  }
}

/**
 * Non-reversible, log-safe marker for a personal value (an email): a short
 * prefix of its SHA-256. Enough to correlate a retry across log lines, not
 * enough to recover the address. Never log the value itself.
 */
export function fingerprint(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex")
    .slice(0, 12);
}
