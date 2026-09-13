/**
 * Shared shapes for the early-access form. Kept out of applyAction.ts because
 * a "use server" module may only export async functions.
 */

export const APPLY_FIELDS = [
  "business",
  "practice",
  "spend",
  "site",
  "email",
  "notes",
] as const;
export type ApplyField = (typeof APPLY_FIELDS)[number];

export type ApplyValues = Record<ApplyField, string>;

export type ApplyState =
  | { status: "idle" }
  | { status: "ok" }
  | {
      status: "error";
      message: string;
      errors: Partial<Record<ApplyField, string>>;
      values: ApplyValues;
    };

export const INITIAL_APPLY_STATE: ApplyState = { status: "idle" };

export interface Option {
  value: string;
  label: string;
}

/** Trade / practice options. Values map to knowledge-pack routing hints. */
export const TRADE_OPTIONS: ReadonlyArray<{ group: string; options: Option[] }> = [
  {
    group: "Home services",
    options: [
      { value: "hvac", label: "HVAC" },
      { value: "roofing", label: "Roofing" },
      { value: "plumbing", label: "Plumbing" },
      { value: "electrical", label: "Electrical" },
      { value: "septic", label: "Septic" },
      { value: "solar", label: "Solar" },
      { value: "home-services-other", label: "Another home service" },
    ],
  },
  {
    group: "Personal-injury law",
    options: [
      { value: "pi-car-accident", label: "PI — car accident" },
      { value: "pi-truck-accident", label: "PI — truck accident" },
      { value: "pi-mass-tort", label: "PI — mass tort" },
      { value: "pi-other", label: "PI — general / other" },
    ],
  },
  {
    group: "Other",
    options: [{ value: "other", label: "Something else (may not be a fit yet)" }],
  },
];

/** Monthly Google Ads spend bands — form inputs, not claims. */
export const SPEND_BANDS: ReadonlyArray<Option> = [
  { value: "none", label: "Not running Google Ads yet" },
  { value: "lt-2500", label: "Under $2,500 / month" },
  { value: "2500-10000", label: "$2,500 – $10,000 / month" },
  { value: "10000-50000", label: "$10,000 – $50,000 / month" },
  { value: "gt-50000", label: "Over $50,000 / month" },
];

export function isTradeValue(v: string): boolean {
  return TRADE_OPTIONS.some((g) => g.options.some((o) => o.value === v));
}

export function isSpendValue(v: string): boolean {
  return SPEND_BANDS.some((o) => o.value === v);
}
