/**
 * Pure mappers: raw Google Ads rows -> our normalized AccountSnapshot.
 *
 * This is the valuable, testable core of ingestion. Everything with a real
 * chance of being wrong lives here (micros conversion, enum translation,
 * Google's sprawling conversion taxonomy -> our small one), and all of it is
 * exercised by mapper.test.ts with zero live API.
 *
 * Documented approximations (Google exposes less than you'd hope):
 *   - conversionAction.verifiedValue is a heuristic (offline-import / purchase
 *     / qualified-lead types are treated as verified).
 *   - callDurationThresholdSec is not on the conversion_action resource; left
 *     undefined here and surfaced by the home-services rule as a gap.
 *   - campaign.isBrandCampaign is inferred from the name; operators can/should
 *     override via a label convention later.
 *   - campaign.schedule.runsWhenIntakeClosed is business context, not API data;
 *     left undefined (rules treat undefined as "not flagged").
 */

import type {
  AccountSnapshot,
  BidStrategy,
  Campaign,
  CampaignType,
  ConversionAction,
  ConversionCounting,
  GeoTargeting,
  Keyword,
  MatchType,
  SearchTerm,
} from "../../knowledge/types";
import type {
  EnumValue,
  RawCampaignRow,
  RawConversionActionRow,
  RawCustomerRow,
  RawGeoCriterionRow,
  RawGeoTargetConstantRow,
  RawKeywordRow,
  RawMetrics,
  RawSearchTermRow,
} from "./raw-types";

/** Google returns money in micros: 1,000,000 micros = 1 currency unit. */
export function fromMicros(micros: number | null | undefined): number {
  return (micros ?? 0) / 1_000_000;
}

/** Normalize an enum field (string name or numeric) to an UPPER_SNAKE string. */
export function enumName(
  value: EnumValue,
  numericMap: Record<number, string> = {},
): string {
  if (value == null) return "UNSPECIFIED";
  if (typeof value === "number") return numericMap[value] ?? "UNKNOWN";
  return value.toUpperCase();
}

const CHANNEL_NUMERIC: Record<number, string> = {
  2: "SEARCH",
  3: "DISPLAY",
  4: "SHOPPING",
  6: "VIDEO",
  10: "PERFORMANCE_MAX",
  11: "LOCAL_SERVICES",
  14: "DEMAND_GEN",
};

export function mapCampaignType(raw: EnumValue): CampaignType {
  switch (enumName(raw, CHANNEL_NUMERIC)) {
    case "SEARCH":
      return "search";
    case "PERFORMANCE_MAX":
      return "performance-max";
    case "DISPLAY":
      return "display";
    case "VIDEO":
      return "video";
    case "SHOPPING":
      return "shopping";
    case "LOCAL_SERVICES":
      return "local-services";
    case "DEMAND_GEN":
      return "demand-gen";
    default:
      return "unknown";
  }
}

const BIDDING_NUMERIC: Record<number, string> = {
  3: "MANUAL_CPC",
  6: "TARGET_CPA",
  8: "TARGET_ROAS",
  9: "TARGET_SPEND",
  10: "MAXIMIZE_CONVERSIONS",
  11: "MAXIMIZE_CONVERSION_VALUE",
  12: "TARGET_IMPRESSION_SHARE",
};

export function mapBidStrategy(raw: EnumValue): BidStrategy {
  switch (enumName(raw, BIDDING_NUMERIC)) {
    case "MANUAL_CPC":
    case "ENHANCED_CPC":
      return "manual-cpc";
    case "MAXIMIZE_CONVERSIONS":
      return "maximize-conversions";
    case "MAXIMIZE_CONVERSION_VALUE":
      return "maximize-conversion-value";
    case "TARGET_CPA":
      return "target-cpa";
    case "TARGET_ROAS":
      return "target-roas";
    case "TARGET_SPEND":
    case "TARGET_SPEND_OPTIMIZE_CLICKS":
      return "maximize-clicks";
    case "TARGET_IMPRESSION_SHARE":
      return "target-impression-share";
    default:
      return "unknown";
  }
}

const MATCH_NUMERIC: Record<number, string> = { 2: "EXACT", 3: "PHRASE", 4: "BROAD" };

export function mapMatchType(raw: EnumValue): MatchType {
  switch (enumName(raw, MATCH_NUMERIC)) {
    case "EXACT":
      return "exact";
    case "PHRASE":
      return "phrase";
    case "BROAD":
      return "broad";
    default:
      return "unknown";
  }
}

export function mapCounting(raw: EnumValue): ConversionCounting {
  // ONE_PER_CLICK -> one, MANY_PER_CLICK -> every. Default to the riskier
  // "every" so an unknown value doesn't silently hide an inflation problem.
  return enumName(raw) === "ONE_PER_CLICK" ? "one" : "every";
}

/**
 * Collapse Google's conversion type + category into our small category string,
 * which the knowledge rules test with substring checks ("call", "form",
 * "offline", "purchase").
 */
export function mapConversionCategory(type: EnumValue, category: EnumValue): string {
  const t = enumName(type);
  const c = enumName(category);
  if (t.includes("UPLOAD") || t.includes("STORE_SALE")) return "imported-offline";
  if (t.includes("CALL") || c === "PHONE_CALL_LEAD") return "phone-call";
  if (c === "PURCHASE") return "purchase";
  if (
    c === "SUBMIT_LEAD_FORM" ||
    c === "LEAD" ||
    c === "CONTACT" ||
    c === "REQUEST_QUOTE" ||
    c === "BOOK_APPOINTMENT" ||
    t === "WEBSITE"
  ) {
    return "website-form";
  }
  return c === "UNSPECIFIED" ? "other" : c.toLowerCase().replace(/_/g, "-");
}

/** Heuristic: is this action a verified business outcome (not a raw proxy)? */
export function isVerifiedValue(type: EnumValue, category: EnumValue): boolean {
  const t = enumName(type);
  const c = enumName(category);
  return (
    t.includes("UPLOAD") ||
    t.includes("STORE_SALE") ||
    c === "PURCHASE" ||
    c === "QUALIFIED_LEAD" ||
    c === "CONVERTED_LEAD"
  );
}

const KM_TO_MILES = 0.621371;

function radiusToMiles(radius: number, units: EnumValue): number {
  return enumName(units) === "KILOMETERS"
    ? Math.round(radius * KM_TO_MILES)
    : Math.round(radius);
}

export function mapCustomer(row: RawCustomerRow): {
  accountId: string;
  accountName: string;
  currency: string;
} {
  const c = row.customer ?? {};
  return {
    accountId: String(c.id ?? "unknown"),
    accountName: c.descriptive_name?.trim() || `Account ${c.id ?? "unknown"}`,
    currency: c.currency_code ?? "USD",
  };
}

export function mapConversionAction(row: RawConversionActionRow): ConversionAction {
  const a = row.conversion_action ?? {};
  return {
    name: a.name ?? "Unnamed action",
    category: mapConversionCategory(a.type, a.category),
    counting: mapCounting(a.counting_type),
    primaryForBidding: !!a.primary_for_goal,
    verifiedValue: isVerifiedValue(a.type, a.category),
    count: 0, // per-action volume needs a segmented metrics query; layered later.
    value: 0,
    // callDurationThresholdSec intentionally omitted (not on this resource).
  };
}

function metricsOf(m: RawMetrics | undefined) {
  return {
    clicks: m?.clicks ?? 0,
    impressions: m?.impressions ?? 0,
    cost: fromMicros(m?.cost_micros),
    conversions: m?.conversions ?? 0,
    conversionValue: m?.conversions_value ?? 0,
  };
}

function looksLikeBrand(name: string): boolean {
  return /\bbrand\b/i.test(name);
}

/** Build one campaign's geo targeting from its criteria + resolved labels. */
export function buildGeo(
  criteria: RawGeoCriterionRow[],
  geoLabels: Map<string, NonNullable<RawGeoTargetConstantRow["geo_target_constant"]>>,
): GeoTargeting {
  const locations: string[] = [];
  const radiiMiles: number[] = [];
  let national = false;

  for (const row of criteria) {
    const cc = row.campaign_criterion;
    if (!cc || cc.negative) continue;
    if (cc.location?.geo_target_constant) {
      const label = geoLabels.get(cc.location.geo_target_constant);
      const name = label?.canonical_name ?? cc.location.geo_target_constant;
      locations.push(name);
      if ((label?.target_type ?? "").toLowerCase() === "country") national = true;
    }
    if (cc.proximity?.radius != null) {
      radiiMiles.push(radiusToMiles(cc.proximity.radius, cc.proximity.radius_units));
    }
  }

  const geo: GeoTargeting = { locations };
  if (radiiMiles.length > 0) geo.radiiMiles = radiiMiles;
  if (national) geo.national = true;
  return geo;
}

export interface SnapshotInputs {
  customer: RawCustomerRow;
  campaigns: RawCampaignRow[];
  searchTerms: RawSearchTermRow[];
  keywords: RawKeywordRow[];
  conversionActions: RawConversionActionRow[];
  geoCriteria: RawGeoCriterionRow[];
  geoLabels: Map<string, NonNullable<RawGeoTargetConstantRow["geo_target_constant"]>>;
  context?: AccountSnapshot["context"];
}

function groupBy<T>(rows: T[], key: (row: T) => string): Map<string, T[]> {
  const out = new Map<string, T[]>();
  for (const row of rows) {
    const k = key(row);
    const list = out.get(k);
    if (list) list.push(row);
    else out.set(k, [row]);
  }
  return out;
}

/** Assemble the full normalized snapshot from all query results. */
export function buildSnapshot(input: SnapshotInputs): AccountSnapshot {
  const { accountId, accountName, currency } = mapCustomer(input.customer);

  const termsByCampaign = groupBy(input.searchTerms, (r) =>
    String(r.campaign?.id ?? ""),
  );
  const keywordsByCampaign = groupBy(input.keywords, (r) =>
    String(r.campaign?.id ?? ""),
  );
  const geoByCampaign = groupBy(input.geoCriteria, (r) =>
    String(r.campaign?.id ?? ""),
  );

  const campaigns: Campaign[] = input.campaigns.map((row) => {
    const c = row.campaign ?? {};
    const id = String(c.id ?? "");
    const m = metricsOf(row.metrics);
    const name = c.name ?? `Campaign ${id}`;

    const searchTerms: SearchTerm[] = (termsByCampaign.get(id) ?? []).map((t) => {
      const tm = metricsOf(t.metrics);
      return {
        text: t.search_term_view?.search_term ?? "",
        clicks: tm.clicks,
        cost: tm.cost,
        conversions: tm.conversions,
      };
    });

    const keywords: Keyword[] = (keywordsByCampaign.get(id) ?? []).map((k) => {
      const km = metricsOf(k.metrics);
      const kw = k.ad_group_criterion?.keyword;
      const kwd: Keyword = {
        text: kw?.text ?? "",
        matchType: mapMatchType(kw?.match_type),
        clicks: km.clicks,
        cost: km.cost,
        conversions: km.conversions,
      };
      const qs = k.ad_group_criterion?.quality_info?.quality_score;
      if (qs != null) kwd.qualityScore = qs;
      return kwd;
    });

    const campaign: Campaign = {
      id,
      name,
      type: mapCampaignType(c.advertising_channel_type),
      enabled: enumName(c.status) === "ENABLED",
      bidStrategy: mapBidStrategy(c.bidding_strategy_type),
      dailyBudget: fromMicros(row.campaign_budget?.amount_micros),
      geo: buildGeo(geoByCampaign.get(id) ?? [], input.geoLabels),
      clicks: m.clicks,
      impressions: m.impressions,
      cost: m.cost,
      conversions: m.conversions,
      conversionValue: m.conversionValue,
      keywords,
      searchTerms,
    };
    if (looksLikeBrand(name)) campaign.isBrandCampaign = true;
    return campaign;
  });

  const monthlySpend = campaigns.reduce((sum, c) => sum + c.cost, 0);

  const snapshot: AccountSnapshot = {
    accountId,
    accountName,
    currency,
    windowDays: 30,
    monthlySpend,
    conversionActions: input.conversionActions.map(mapConversionAction),
    campaigns,
  };
  if (input.context) snapshot.context = input.context;
  return snapshot;
}
