import { BUDGET_OPTIONS, TRADE_OPTIONS } from "./content";

/**
 * Shared contract between the /book form (client) and its server action.
 * Pure — no React, no "use server" — so both sides can import it.
 */

export const STRATEGY_CALL_FIELDS = [
  "name",
  "business",
  "trade",
  "phone",
  "email",
  "budget",
] as const;

export type StrategyCallField = (typeof STRATEGY_CALL_FIELDS)[number];

export type StrategyCallValues = Record<StrategyCallField, string>;

export type StrategyCallState =
  | { status: "idle" }
  | {
      status: "error";
      /**
       * Form-level message (delivery failure, rate limit). Rendered above the
       * submit button when present; field errors take precedence.
       */
      message?: string;
      /** Field → message. Only fields that failed are present. */
      errors: Partial<Record<StrategyCallField, string>>;
      /** Echoed back so the form can re-fill without JS. */
      values: StrategyCallValues;
    }
  | {
      status: "success";
      /** First name, for the confirmation copy. */
      firstName: string;
    };

export type StrategyCallAction = (
  prev: StrategyCallState,
  formData: FormData,
) => Promise<StrategyCallState>;

const TRADE_VALUES = new Set<string>(TRADE_OPTIONS.map((t) => t.value));
const BUDGET_VALUES = new Set<string>(BUDGET_OPTIONS.map((b) => b.value));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Loose: digits, spaces, punctuation; at least 10 digits. */
const PHONE_DIGITS_MIN = 10;

function str(formData: FormData, key: StrategyCallField): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function readStrategyCallValues(formData: FormData): StrategyCallValues {
  return {
    name: str(formData, "name"),
    business: str(formData, "business"),
    trade: str(formData, "trade"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    budget: str(formData, "budget"),
  };
}

export function validateStrategyCall(
  values: StrategyCallValues,
): Partial<Record<StrategyCallField, string>> {
  const errors: Partial<Record<StrategyCallField, string>> = {};

  if (values.name.length < 2) errors.name = "Tell us who to ask for.";
  if (values.business.length < 2) errors.business = "What's the business called?";
  if (!TRADE_VALUES.has(values.trade)) errors.trade = "Pick the closest trade.";

  const digits = values.phone.replace(/\D/g, "");
  if (digits.length < PHONE_DIGITS_MIN || digits.length > 15) {
    errors.phone = "Enter a phone number we can reach you on.";
  }

  if (!EMAIL_RE.test(values.email) || values.email.length > 254) {
    errors.email = "Enter a working email address.";
  }

  if (!BUDGET_VALUES.has(values.budget)) errors.budget = "Pick a range — a guess is fine.";

  return errors;
}
