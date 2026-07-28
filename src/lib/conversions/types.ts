/**
 * Offline conversion import — the wiring that closes the loop the PI pack
 * keeps flagging as critical: real business outcomes (signed cases, booked
 * jobs) flowing back into Google Ads as the signal bidding optimizes toward.
 *
 * Recommend-first discipline applies to writes too: the pipeline always
 * produces a reviewable ImportPlan (valid payloads + per-row issues) and
 * nothing is uploaded without an explicit apply step.
 */

/** One outcome row as it arrives from an intake sheet / CRM export. */
export interface OutcomeRow {
  /** Google click id captured at lead time. Exactly one click id required. */
  gclid?: string;
  /** iOS app / web-to-app click ids — alternatives to gclid. */
  gbraid?: string;
  wbraid?: string;
  /** When the outcome happened (signing, booking). ISO 8601 or Google format. */
  conversionTime: string;
  /** Value of the outcome in account currency (e.g. estimated case fee). */
  value: number;
  /** ISO 4217, e.g. "USD". */
  currency: string;
  /** Stable business id (case number, job id) — enables dedupe on re-upload. */
  orderId?: string;
  /** Source line number for error reporting (1-based, excluding header). */
  line: number;
}

/** The exact payload shape we send to UploadClickConversions. */
export interface ClickConversionPayload {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  conversion_action: string; // customers/{cid}/conversionActions/{id}
  conversion_date_time: string; // "yyyy-mm-dd hh:mm:ss±hh:mm"
  conversion_value: number;
  currency_code: string;
  order_id?: string;
}

export type IssueLevel = "error" | "warning";

export interface RowIssue {
  line: number;
  level: IssueLevel;
  field: string;
  message: string;
}

/** The reviewable output of the pure pipeline. Nothing here touches the API. */
export interface ImportPlan {
  /** Payloads that passed validation, ready to upload. */
  conversions: ClickConversionPayload[];
  /** Every problem found, in input order. Rows with errors are excluded. */
  issues: RowIssue[];
  summary: {
    inputRows: number;
    valid: number;
    rejected: number;
    /** Duplicates removed (same click id + order id + timestamp). */
    deduped: number;
    totalValue: number;
    currency: string | null;
  };
}

export interface BuildPlanOptions {
  /** Numeric customer id (digits only) the conversions belong to. */
  customerId: string;
  /** Numeric conversion action id (the "Signed Case" action in Google Ads). */
  conversionActionId: string;
  /**
   * UTC offset applied to timestamps that arrive without one, e.g. "-07:00".
   * Google requires an explicit offset on every conversion timestamp.
   */
  defaultUtcOffset: string;
  /** "Now" for future/stale checks — injectable for tests. */
  now?: Date;
  /**
   * Max age in days for a conversion we'll attempt to upload. Google's click
   * conversion window is 90 days from the click; the conversion itself must
   * be younger than that, so this is a conservative pre-filter.
   */
  maxAgeDays?: number;
}
