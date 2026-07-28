/**
 * Domain-knowledge schema for the Google Ads agent.
 *
 * The thesis: generalist ads-automation tools regress to the mean because
 * they optimize toward platform-visible proxy metrics (raw "conversions",
 * "maximize conversions") that are tuned for the median advertiser. In
 * high-value, low-volume verticals like personal-injury law, the median is
 * exactly wrong. The durable edge is *encoded judgment* — niche benchmarks,
 * a model of the value the platform can't see, and guardrails that stop the
 * agent from doing the platform-default dumb thing.
 *
 * A `NichePack` is that encoded judgment for one vertical. The engine reasons
 * over it against a normalized `AccountSnapshot`.
 */

// ---------------------------------------------------------------------------
// Normalized account snapshot (what we pull from the Google Ads API, later)
// ---------------------------------------------------------------------------

export type CampaignType =
  | "search"
  | "performance-max"
  | "display"
  | "video"
  | "shopping"
  | "local-services" // LSA
  | "demand-gen"
  | "unknown";

export type BidStrategy =
  | "manual-cpc"
  | "maximize-clicks"
  | "maximize-conversions"
  | "maximize-conversion-value"
  | "target-cpa"
  | "target-roas"
  | "target-impression-share"
  | "unknown";

export type MatchType = "exact" | "phrase" | "broad" | "unknown";

/** How a conversion action is counted. "every" inflates lead-gen accounts. */
export type ConversionCounting = "one" | "every";

export interface ConversionAction {
  name: string;
  /** e.g. "website-form", "phone-call", "imported-offline", "click-to-call" */
  category: string;
  counting: ConversionCounting;
  /** Whether this action feeds the primary bid strategy ("Primary" in Google). */
  primaryForBidding: boolean;
  /** For call conversions: the minimum call duration counted, in seconds. */
  callDurationThresholdSec?: number;
  /** True when the value is a real, verified business outcome (e.g. signed case). */
  verifiedValue: boolean;
  count: number;
  value: number;
}

export interface Keyword {
  text: string;
  matchType: MatchType;
  clicks: number;
  cost: number;
  conversions: number;
  qualityScore?: number;
}

export interface SearchTerm {
  text: string;
  clicks: number;
  cost: number;
  conversions: number;
}

export interface GeoTargeting {
  /** Human-readable locations, e.g. ["California", "Los Angeles, CA"]. */
  locations: string[];
  /** Radius targets in miles, if any. */
  radiiMiles?: number[];
  /** True if the campaign targets an entire country or is effectively national. */
  national?: boolean;
}

export interface AdSchedule {
  /** True if ads run outside staffed intake hours with no answering coverage. */
  runsWhenIntakeClosed?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  enabled: boolean;
  bidStrategy: BidStrategy;
  dailyBudget: number;
  geo: GeoTargeting;
  schedule?: AdSchedule;
  /** True if this campaign is dedicated to the advertiser's own brand terms. */
  isBrandCampaign?: boolean;
  clicks: number;
  impressions: number;
  cost: number;
  conversions: number;
  conversionValue: number;
  keywords: Keyword[];
  searchTerms: SearchTerm[];
}

export interface AccountSnapshot {
  accountId: string;
  accountName: string;
  currency: string;
  /** Trailing-30-day window unless otherwise noted. */
  windowDays: number;
  monthlySpend: number;
  conversionActions: ConversionAction[];
  campaigns: Campaign[];
  /** Optional business context that sharpens the audit. */
  context?: {
    /** Jurisdictions the firm/business is licensed or able to serve. */
    servesLocations?: string[];
    /** Sub-niche within the vertical, e.g. "car-accident", "hvac". */
    subNiche?: string;
  };
}

// ---------------------------------------------------------------------------
// Knowledge pack
// ---------------------------------------------------------------------------

export type NicheCategory = "base" | "legal" | "local-service";

export type Metric =
  | "cpc" // cost per click
  | "cpl" // cost per lead
  | "cpa-signed" // cost per signed/booked case or job
  | "lead-to-signed-rate"
  | "landing-conv-rate"
  | "monthly-budget-floor";

/** A niche benchmark range. Values are in account currency or a rate 0..1. */
export interface Benchmark {
  metric: Metric;
  unit: "currency" | "rate";
  min: number;
  typical: number;
  max: number;
  note: string;
}

/**
 * Models the value the ad platform cannot see. This is the core anti-mean
 * mechanism: it lets the agent reason about signed-case economics rather than
 * raw form-fill counts.
 */
export interface ConversionValueModel {
  /** The event the agent should treat as the true north-star outcome. */
  northStar: string;
  /** Estimated value to the business of one north-star outcome. */
  valuePerOutcome: { min: number; typical: number; max: number };
  /** Fraction of raw leads that become a north-star outcome. */
  leadToOutcomeRate: { min: number; typical: number; max: number };
  /**
   * Substrings that, when found in a search term or conversion, usually
   * indicate a junk / mis-attributed lead that inflates platform metrics.
   */
  junkLeadSignals: string[];
  notes: string[];
}

export type Severity = "critical" | "high" | "medium" | "low";

export type FindingCategory =
  | "conversion-integrity"
  | "wasted-spend"
  | "targeting"
  | "bidding"
  | "structure"
  | "channel-mix"
  | "tracking"
  | "budget";

export interface Finding {
  ruleId: string;
  title: string;
  severity: Severity;
  category: FindingCategory;
  /** 0..1 — how confident the rule is that this is real and actionable. */
  confidence: number;
  /** What the agent observed, in plain language. */
  summary: string;
  /** Concrete data points backing the finding. */
  evidence: string[];
  /** The recommended action (recommend-only posture — never auto-applied). */
  recommendation: string;
  /** Why this matters *in this niche* — the encoded judgment. */
  nicheRationale: string;
  /** Optional estimate of monthly spend at risk, for prioritization. */
  estimatedMonthlyWaste?: number;
}

/** Context handed to every rule. */
export interface RuleContext {
  snapshot: AccountSnapshot;
  pack: ResolvedPack;
}

export interface Rule {
  id: string;
  title: string;
  category: FindingCategory;
  /** Pure function: inspect the account, emit zero or more findings. */
  evaluate: (ctx: RuleContext) => Finding[];
}

/**
 * A principle the agent must never violate. In recommend-only mode these are
 * surfaced as constraints; once the agent can write, they become hard gates.
 */
export interface Guardrail {
  id: string;
  principle: string;
  rationale: string;
}

export interface NichePack {
  id: string;
  label: string;
  category: NicheCategory;
  description: string;
  /** Pack id this one inherits from (benchmarks/rules/guardrails merge). */
  extends?: string;
  benchmarks: Benchmark[];
  conversionModel?: ConversionValueModel;
  rules: Rule[];
  guardrails: Guardrail[];
  /** Narrative anti-patterns a human operator should watch for. */
  redFlags: string[];
}

/** A pack with its inheritance chain flattened. */
export interface ResolvedPack extends Omit<NichePack, "extends"> {
  /** Ordered chain from root ancestor to this pack, for provenance. */
  lineage: string[];
}

export interface AuditReport {
  accountId: string;
  accountName: string;
  packId: string;
  packLineage: string[];
  generatedFor: { monthlySpend: number; windowDays: number };
  findings: Finding[];
  summary: {
    bySeverity: Record<Severity, number>;
    estimatedMonthlyWaste: number;
  };
}
