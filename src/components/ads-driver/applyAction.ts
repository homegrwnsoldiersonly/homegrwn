"use server";

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

/**
 * Early-access application — PLACEHOLDER server action.
 *
 * TODO(ads-driver/apply): this validates and returns. It does not persist.
 * Wire it to a real intake before launch — options, in order of preference:
 *   1. a row in the tenant/intake store once the dashboard picks its DB
 *      (docs/site-architecture.md → "Tenant model"), plus a notification to
 *      connect@homegrwndigital.com;
 *   2. until then, an email-only path (Resend / SES) so nothing is dropped.
 * Also add rate limiting + a real spam check; the honeypot below is the bare
 * minimum. Server Actions are reachable by direct POST.
 */
export async function submitEarlyAccess(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const values = Object.fromEntries(
    APPLY_FIELDS.map((f) => [f, String(formData.get(f) ?? "").trim()]),
  ) as ApplyValues;

  // Honeypot: real users never see or fill this field.
  if (String(formData.get("company_fax") ?? "").length > 0) {
    return { status: "ok" };
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

  // TODO(ads-driver/apply): persist + notify (see header). Logging is the
  // only trace for now so an early tester's submission is not lost silently.
  console.info("[ads-driver/apply] early-access application", values);

  return { status: "ok" };
}
