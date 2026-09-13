/**
 * CSV data source — the "case study" tenant kind.
 *
 * Nathan exports tables from the Google Ads UI (or Editor) and drops them into
 *
 *   data/case-studies/<tenant>/
 *     campaigns.csv       one row per campaign            (the only one that matters)
 *     keywords.csv        one row per keyword             (optional)
 *     search_terms.csv    one row per search term         (optional — junk-traffic rules need it)
 *     conversions.csv     one row per conversion action   (optional — tracking rules need it)
 *     tenant.json         optional: name, currency, windowDays, subNiche, servesLocations
 *
 * and the folder becomes a tenant the dashboard can audit through the same
 * knowledge engine as a live account. Column names and aliases are defined in
 * `COLUMNS` below and mirrored in data/case-studies/TEMPLATE.csv (the test
 * suite keeps the two in sync).
 *
 * Design rules:
 *   - Missing files never crash. They produce a PARTIAL snapshot plus an
 *     `ingest` record (present / missing / warnings) the UI renders as a
 *     visible "partial data" badge.
 *   - The mapper (`buildCsvSnapshot`) is pure — CSV text in, snapshot out —
 *     so it is unit-tested without touching the filesystem.
 *   - Google UI exports are tolerated as-is: title/date preamble rows before
 *     the header, a trailing "Total" row, "$1,234.56"-style money, " --" for
 *     empty cells, a UTF-8 BOM. Header matching is by normalized name with
 *     aliases for Google's labels ("Impr.", "Conv. value", "Bid strategy type").
 *   - Enum text ("Performance Max", "Exact match", "Submit lead form") is
 *     folded onto the same mappers the live Google Ads adapter uses, so a CSV
 *     tenant and a live tenant produce the same category vocabulary.
 *
 * This file must stay free of `@/` path aliases: vitest runs it without the
 * Next.js alias config.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type {
  AccountSnapshot,
  BidStrategy,
  Campaign,
  CampaignType,
  ConversionAction,
  ConversionCounting,
  Keyword,
  MatchType,
  SearchTerm,
} from "../knowledge/types";
import { parseCsv } from "../conversions/csv";
import type { AccountRef, AdsDataSource } from "./datasource";
import {
  isVerifiedValue,
  mapCampaignType,
  mapConversionCategory,
} from "./google-ads/mapper";

// ---------------------------------------------------------------------------
// Tables + columns
// ---------------------------------------------------------------------------

export const CSV_TABLES = [
  "campaigns",
  "keywords",
  "search_terms",
  "conversions",
] as const;
export type CsvTable = (typeof CSV_TABLES)[number];

export const DEFAULT_CASE_STUDIES_DIR = "data/case-studies";
export const TENANT_META_FILE = "tenant.json";

export type ColumnKind = "text" | "number" | "money" | "list" | "bool";

export interface ColumnSpec {
  /** Canonical normalized header (what TEMPLATE.csv documents). */
  key: string;
  /** Other normalized headers accepted — Google Ads UI export labels mostly. */
  aliases: readonly string[];
  kind: ColumnKind;
  required?: boolean;
  description: string;
}

const METRIC_COLUMNS: readonly ColumnSpec[] = [
  { key: "clicks", aliases: [], kind: "number", description: "Clicks in the window." },
  { key: "cost", aliases: ["spend", "cost_usd"], kind: "money", description: "Spend in the window. Currency symbols and thousands separators are stripped." },
  { key: "conversions", aliases: ["conv", "all_conv"], kind: "number", description: "Conversions in the window." },
];

export const COLUMNS: Record<CsvTable, readonly ColumnSpec[]> = {
  campaigns: [
    { key: "campaign", aliases: ["campaign_name", "name"], kind: "text", required: true, description: "Campaign name. Joins keywords.csv and search_terms.csv." },
    { key: "campaign_id", aliases: ["id"], kind: "text", description: "Optional stable id. Defaults to a slug of the name." },
    { key: "campaign_state", aliases: ["campaign_status", "status", "state"], kind: "text", description: "Enabled / Paused / Removed. Anything not paused/removed/ended counts as enabled." },
    { key: "campaign_type", aliases: ["type", "channel", "advertising_channel_type"], kind: "text", description: "Search, Performance Max, Display, Video, Shopping, Local Services, Demand Gen." },
    { key: "bid_strategy_type", aliases: ["bid_strategy", "bidding_strategy", "bidding_strategy_type"], kind: "text", description: "Manual CPC, Maximize clicks, Maximize conversions, Target CPA, Target ROAS, Target impression share." },
    { key: "budget", aliases: ["daily_budget", "budget_amount", "avg_daily_budget"], kind: "money", description: "Average daily budget." },
    ...METRIC_COLUMNS,
    { key: "impressions", aliases: ["impr", "impressions_count"], kind: "number", description: "Impressions in the window." },
    { key: "conv_value", aliases: ["conversion_value", "conversions_value", "all_conv_value", "total_conv_value"], kind: "money", description: "Conversion value in the window." },
    { key: "locations", aliases: ["location", "geo", "targeted_locations"], kind: "list", description: "Targeted locations, separated by ; or |. e.g. \"Phoenix, AZ; Mesa, AZ\"." },
    { key: "radius_mi", aliases: ["radius", "radius_miles", "radii_mi"], kind: "list", description: "Radius targets in miles, separated by ; or |." },
    { key: "national", aliases: ["is_national"], kind: "bool", description: "yes/true when the campaign targets a whole country." },
    { key: "brand", aliases: ["is_brand", "brand_campaign"], kind: "bool", description: "yes/true for a dedicated brand campaign. Defaults to name contains \"brand\"." },
  ],
  keywords: [
    { key: "campaign", aliases: ["campaign_name"], kind: "text", required: true, description: "Campaign name — must match campaigns.csv." },
    { key: "campaign_id", aliases: [], kind: "text", description: "Optional; used for the join when present in both files." },
    { key: "keyword", aliases: ["keyword_text", "search_keyword", "text"], kind: "text", required: true, description: "Keyword text." },
    { key: "match_type", aliases: ["match", "keyword_match_type"], kind: "text", description: "Exact / Phrase / Broad (\"Exact match\" also accepted)." },
    ...METRIC_COLUMNS,
    { key: "quality_score", aliases: ["qs", "qual_score"], kind: "number", description: "Optional 1–10 quality score." },
  ],
  search_terms: [
    { key: "campaign", aliases: ["campaign_name"], kind: "text", required: true, description: "Campaign name — must match campaigns.csv." },
    { key: "campaign_id", aliases: [], kind: "text", description: "Optional; used for the join when present in both files." },
    { key: "search_term", aliases: ["query", "search_query", "term"], kind: "text", required: true, description: "The matched search term." },
    ...METRIC_COLUMNS,
  ],
  conversions: [
    { key: "conversion_action", aliases: ["conversion_action_name", "action", "name"], kind: "text", required: true, description: "Conversion action name." },
    { key: "category", aliases: ["conversion_category", "conversion_action_category"], kind: "text", description: "Submit lead form, Phone call lead, Purchase, Qualified lead, Converted lead, Book appointment…" },
    { key: "source", aliases: ["conversion_source", "type", "conversion_action_type"], kind: "text", description: "Website, Calls from ads, Import from clicks, Offline…" },
    { key: "counting", aliases: ["count", "counting_type"], kind: "text", description: "One / Every. Defaults to Every (the riskier assumption) when blank." },
    { key: "primary", aliases: ["primary_for_bidding", "include_in_conversions", "primary_for_goal"], kind: "bool", description: "yes/no — feeds the bid strategy. Defaults to yes when the column is absent." },
    { key: "call_duration_sec", aliases: ["call_length", "min_call_duration"], kind: "number", description: "Optional minimum call length counted, in seconds." },
    { key: "verified", aliases: ["verified_value", "is_verified"], kind: "bool", description: "Optional override: yes when the value is a real business outcome." },
    { key: "conversions", aliases: ["conv", "count_in_window", "all_conv"], kind: "number", description: "Conversions in the window for this action." },
    { key: "conv_value", aliases: ["conversion_value", "value", "all_conv_value"], kind: "money", description: "Conversion value in the window for this action." },
  ],
};

/** The column whose presence identifies the header row of each table. */
const PRIMARY_COLUMN: Record<CsvTable, string> = {
  campaigns: "campaign",
  keywords: "keyword",
  search_terms: "search_term",
  conversions: "conversion_action",
};

// ---------------------------------------------------------------------------
// Cell + header parsing (pure)
// ---------------------------------------------------------------------------

/** "Conv. value" → "conv_value", "Impr." → "impr", "Campaign state" → "campaign_state". */
export function normalizeHeader(raw: string): string {
  return raw
    .replace(/^﻿/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** "$1,234.56" → 1234.56; " --" / "" → 0; "12.5%" → 12.5. */
export function parseNumber(raw: string | undefined): number {
  if (raw == null) return 0;
  const s = raw.trim();
  if (s === "" || s === "--" || s === "-" || s === "—") return 0;
  const negative = /^\(.*\)$/.test(s) || s.startsWith("-");
  const digits = s.replace(/[^0-9.]/g, "");
  if (digits === "" || digits === ".") return 0;
  const n = Number.parseFloat(digits);
  if (!Number.isFinite(n)) return 0;
  return negative ? -n : n;
}

export function parseBool(raw: string | undefined): boolean {
  if (raw == null) return false;
  const s = raw.trim().toLowerCase();
  return s === "yes" || s === "true" || s === "1" || s === "y" || s === "on";
}

/** "Phoenix, AZ; Mesa, AZ" or "a | b" → ["Phoenix, AZ", "Mesa, AZ"]. */
export function parseList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[;|]/)
    .map((s) => s.trim())
    .filter((s) => s !== "" && s !== "--" && s !== "-" && s !== "—");
}

function upperSnake(raw: string | undefined): string {
  return (raw ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function slugify(raw: string): string {
  return (
    raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "unnamed"
  );
}

// ---------------------------------------------------------------------------
// Enum text → our vocabulary (pure)
// ---------------------------------------------------------------------------

export function campaignTypeFromText(raw: string | undefined): CampaignType {
  const t = upperSnake(raw);
  if (t === "") return "unknown";
  if (t.includes("PERFORMANCE") || t === "PMAX") return "performance-max";
  if (t.includes("LOCAL")) return "local-services";
  if (t.includes("DEMAND") || t.includes("DISCOVERY")) return "demand-gen";
  if (t.includes("VIDEO") || t.includes("YOUTUBE")) return "video";
  if (t.includes("SHOPPING")) return "shopping";
  if (t.includes("DISPLAY")) return "display";
  if (t.includes("SEARCH")) return "search";
  return mapCampaignType(t);
}

export function bidStrategyFromText(raw: string | undefined): BidStrategy {
  const t = upperSnake(raw);
  if (t === "") return "unknown";
  // Order matters: "Maximize conversions (Target CPA)" means a target is set.
  if (t.includes("TARGET_CPA") || t.includes("TCPA")) return "target-cpa";
  if (t.includes("TARGET_ROAS") || t.includes("TROAS")) return "target-roas";
  if (t.includes("CONVERSION_VALUE")) return "maximize-conversion-value";
  if (t.includes("CONVERSION")) return "maximize-conversions";
  if (t.includes("IMPRESSION_SHARE")) return "target-impression-share";
  if (t.includes("CLICK") && !t.includes("CPC")) return "maximize-clicks";
  if (t.includes("MANUAL") || t.includes("ENHANCED") || t.includes("CPC")) return "manual-cpc";
  return "unknown";
}

export function matchTypeFromText(raw: string | undefined): MatchType {
  const t = upperSnake(raw);
  if (t.includes("EXACT")) return "exact";
  if (t.includes("PHRASE")) return "phrase";
  if (t.includes("BROAD")) return "broad";
  return "unknown";
}

/** Google's status vocabulary: only paused/removed/ended/off means "not serving". */
export function enabledFromText(raw: string | undefined): boolean {
  const t = upperSnake(raw);
  if (t === "") return true;
  return !(
    t.includes("PAUSED") ||
    t.includes("REMOVED") ||
    t.includes("ENDED") ||
    t.includes("DISABLED") ||
    t === "OFF"
  );
}

export function countingFromText(raw: string | undefined): ConversionCounting {
  const t = upperSnake(raw);
  if (t.startsWith("ONE")) return "one";
  // "Every", "Many", blank → the riskier assumption, same as the live mapper.
  return "every";
}

/**
 * Fold the UI's conversion "Source" + "Category" labels onto the enum names
 * the live mapper understands, then reuse its taxonomy collapse.
 */
export function conversionTaxonomyFromText(
  source: string | undefined,
  category: string | undefined,
): { category: string; verified: boolean } {
  const src = upperSnake(source);
  const cat = upperSnake(category);
  const joined = `${src} ${cat}`;

  let type = src === "" ? "UNSPECIFIED" : src;
  let normalizedCategory = cat === "" ? "UNSPECIFIED" : cat;

  if (/IMPORT|OFFLINE|UPLOAD|STORE_SALE/.test(joined)) {
    type = "UPLOAD_CLICKS";
  } else if (/CALL/.test(joined)) {
    type = "WEBSITE_CALL";
    normalizedCategory = "PHONE_CALL_LEAD";
  } else if (src.includes("WEBSITE") || src.includes("WEB")) {
    type = "WEBSITE";
  }

  return {
    category: mapConversionCategory(type, normalizedCategory),
    verified: isVerifiedValue(type, normalizedCategory),
  };
}

// ---------------------------------------------------------------------------
// Table parsing (pure)
// ---------------------------------------------------------------------------

export interface ParsedTable {
  rows: Array<Record<string, string>>;
  warnings: string[];
  /** Normalized headers seen in the file (for diagnostics). */
  headers: string[];
}

function lookupFor(table: CsvTable): Map<string, string> {
  const map = new Map<string, string>();
  for (const spec of COLUMNS[table]) {
    map.set(spec.key, spec.key);
    for (const alias of spec.aliases) map.set(alias, spec.key);
  }
  return map;
}

/**
 * Parse one exported table. Tolerates preamble rows (Google prepends a title
 * and a date range), a trailing "Total" row, and a BOM. Unknown columns are
 * kept under their normalized header so nothing is silently dropped.
 */
export function parseTable(text: string, table: CsvTable): ParsedTable {
  const warnings: string[] = [];
  const rows = parseCsv(text.replace(/^﻿/, ""));
  const lookup = lookupFor(table);
  const primary = PRIMARY_COLUMN[table];

  const headerIndex = rows.findIndex((cells) =>
    cells.some((c) => lookup.get(normalizeHeader(c)) === primary),
  );
  if (headerIndex === -1) {
    warnings.push(
      `${table}.csv: no header row with a "${primary}" column — file ignored.`,
    );
    return { rows: [], warnings, headers: [] };
  }
  if (headerIndex > 0) {
    warnings.push(
      `${table}.csv: skipped ${headerIndex} preamble row${headerIndex === 1 ? "" : "s"} before the header.`,
    );
  }

  const headerCells = rows[headerIndex].map(normalizeHeader);
  const keys = headerCells.map((h) => lookup.get(h) ?? h);
  const missingRequired = COLUMNS[table]
    .filter((c) => c.required && !keys.includes(c.key))
    .map((c) => c.key);
  if (missingRequired.length > 0) {
    warnings.push(
      `${table}.csv: missing required column${missingRequired.length === 1 ? "" : "s"} ${missingRequired.join(", ")}.`,
    );
  }

  const out: Array<Record<string, string>> = [];
  let totalRows = 0;
  for (const cells of rows.slice(headerIndex + 1)) {
    const firstNonEmpty = cells.find((c) => c.trim() !== "") ?? "";
    if (firstNonEmpty === "") continue;
    if (/^total/i.test(firstNonEmpty.trim())) {
      totalRows++;
      continue;
    }
    const record: Record<string, string> = {};
    keys.forEach((k, i) => {
      if (!k) return;
      record[k] = (cells[i] ?? "").trim();
    });
    out.push(record);
  }
  if (totalRows > 0) {
    warnings.push(`${table}.csv: dropped ${totalRows} "Total" row${totalRows === 1 ? "" : "s"}.`);
  }
  return { rows: out, warnings, headers: headerCells };
}

// ---------------------------------------------------------------------------
// Snapshot assembly (pure)
// ---------------------------------------------------------------------------

export interface TenantMeta {
  /** Display name. Defaults to the folder slug. */
  name?: string;
  currency?: string;
  /** Days the exported tables cover. Spend is normalized to 30 days. */
  windowDays?: number;
  /** Feeds pack suggestion, e.g. "hvac", "car-accident". */
  subNiche?: string;
  servesLocations?: string[];
}

export interface CsvIngestMeta {
  tenant: string;
  present: CsvTable[];
  missing: CsvTable[];
  /** True when any table is missing or unreadable. */
  partial: boolean;
  warnings: string[];
  rowCounts: Partial<Record<CsvTable, number>>;
}

export interface CsvSnapshotInput {
  /** Folder slug — becomes the account id. */
  tenant: string;
  meta?: TenantMeta;
  /** Raw CSV text per table; `undefined` = file missing. */
  tables: Partial<Record<CsvTable, string>>;
}

function emptyCampaign(id: string, name: string): Campaign {
  return {
    id,
    name,
    type: "unknown",
    enabled: true,
    bidStrategy: "unknown",
    dailyBudget: 0,
    geo: { locations: [] },
    clicks: 0,
    impressions: 0,
    cost: 0,
    conversions: 0,
    conversionValue: 0,
    keywords: [],
    searchTerms: [],
  };
}

function campaignFromRow(row: Record<string, string>): Campaign {
  const name = row.campaign || "Unnamed campaign";
  const id = row.campaign_id?.trim() || slugify(name);
  const campaign: Campaign = {
    id,
    name,
    type: campaignTypeFromText(row.campaign_type),
    enabled: enabledFromText(row.campaign_state),
    bidStrategy: bidStrategyFromText(row.bid_strategy_type),
    dailyBudget: parseNumber(row.budget),
    geo: { locations: parseList(row.locations) },
    clicks: parseNumber(row.clicks),
    impressions: parseNumber(row.impressions),
    cost: parseNumber(row.cost),
    conversions: parseNumber(row.conversions),
    conversionValue: parseNumber(row.conv_value),
    keywords: [],
    searchTerms: [],
  };
  const radii = parseList(row.radius_mi).map(parseNumber).filter((n) => n > 0);
  if (radii.length > 0) campaign.geo.radiiMiles = radii;
  if (parseBool(row.national)) campaign.geo.national = true;
  const brand =
    row.brand != null && row.brand !== "" ? parseBool(row.brand) : /\bbrand\b/i.test(name);
  if (brand) campaign.isBrandCampaign = true;
  return campaign;
}

function conversionFromRow(
  row: Record<string, string>,
  hasPrimaryColumn: boolean,
): ConversionAction {
  const taxonomy = conversionTaxonomyFromText(row.source, row.category);
  const action: ConversionAction = {
    name: row.conversion_action || "Unnamed action",
    category: taxonomy.category,
    counting: countingFromText(row.counting),
    primaryForBidding: hasPrimaryColumn ? parseBool(row.primary) : true,
    verifiedValue:
      row.verified != null && row.verified !== "" ? parseBool(row.verified) : taxonomy.verified,
    count: parseNumber(row.conversions),
    value: parseNumber(row.conv_value),
  };
  const threshold = parseNumber(row.call_duration_sec);
  if (threshold > 0) action.callDurationThresholdSec = threshold;
  return action;
}

/**
 * Pure mapper: raw CSV texts → AccountSnapshot + ingest record. Never throws
 * on a missing or malformed table; it degrades to a partial snapshot and
 * explains itself in `ingest.warnings`.
 */
export function buildCsvSnapshot(input: CsvSnapshotInput): {
  snapshot: AccountSnapshot;
  ingest: CsvIngestMeta;
} {
  const { tenant, meta = {}, tables } = input;
  const warnings: string[] = [];
  const present: CsvTable[] = [];
  const missing: CsvTable[] = [];
  const rowCounts: Partial<Record<CsvTable, number>> = {};

  const parsed: Partial<Record<CsvTable, ParsedTable>> = {};
  for (const table of CSV_TABLES) {
    const text = tables[table];
    if (text == null) {
      missing.push(table);
      continue;
    }
    const p = parseTable(text, table);
    parsed[table] = p;
    warnings.push(...p.warnings);
    rowCounts[table] = p.rows.length;
    if (p.headers.length === 0) missing.push(table);
    else present.push(table);
  }

  // Campaigns, keyed by lowercase name and by id for the joins.
  const byName = new Map<string, Campaign>();
  const byId = new Map<string, Campaign>();
  const campaigns: Campaign[] = [];
  const register = (c: Campaign) => {
    campaigns.push(c);
    byName.set(c.name.trim().toLowerCase(), c);
    byId.set(c.id, c);
  };
  for (const row of parsed.campaigns?.rows ?? []) register(campaignFromRow(row));

  const stubbed = new Set<string>();
  const resolveCampaign = (row: Record<string, string>, table: CsvTable): Campaign | null => {
    const id = row.campaign_id?.trim();
    if (id && byId.has(id)) return byId.get(id)!;
    const name = (row.campaign ?? "").trim();
    if (!name) return null;
    const key = name.toLowerCase();
    const found = byName.get(key);
    if (found) return found;
    const stub = emptyCampaign(id || slugify(name), name);
    register(stub);
    if (!stubbed.has(key)) {
      stubbed.add(key);
      warnings.push(
        parsed.campaigns
          ? `${table}.csv references campaign "${name}" that is not in campaigns.csv — added as a stub with no campaign-level metrics.`
          : `campaign "${name}" inferred from ${table}.csv (campaigns.csv missing).`,
      );
    }
    return stub;
  };

  let droppedChildRows = 0;
  for (const row of parsed.keywords?.rows ?? []) {
    const campaign = resolveCampaign(row, "keywords");
    if (!campaign || !row.keyword) {
      droppedChildRows++;
      continue;
    }
    const kw: Keyword = {
      text: row.keyword,
      matchType: matchTypeFromText(row.match_type),
      clicks: parseNumber(row.clicks),
      cost: parseNumber(row.cost),
      conversions: parseNumber(row.conversions),
    };
    const qs = parseNumber(row.quality_score);
    if (qs > 0) kw.qualityScore = qs;
    campaign.keywords.push(kw);
  }
  for (const row of parsed.search_terms?.rows ?? []) {
    const campaign = resolveCampaign(row, "search_terms");
    if (!campaign || !row.search_term) {
      droppedChildRows++;
      continue;
    }
    const term: SearchTerm = {
      text: row.search_term,
      clicks: parseNumber(row.clicks),
      cost: parseNumber(row.cost),
      conversions: parseNumber(row.conversions),
    };
    campaign.searchTerms.push(term);
  }
  if (droppedChildRows > 0) {
    warnings.push(`${droppedChildRows} keyword/search-term row${droppedChildRows === 1 ? "" : "s"} had no campaign or text and were skipped.`);
  }

  // Stub campaigns carry no campaign-level metrics; roll up what their rows
  // show so the engine has something to reason about. Flagged in warnings.
  let rolledUp = 0;
  for (const c of campaigns) {
    if (!stubbed.has(c.name.trim().toLowerCase())) continue;
    const source = c.keywords.length > 0 ? c.keywords : c.searchTerms;
    if (source.length === 0) continue;
    c.clicks = source.reduce((s, r) => s + r.clicks, 0);
    c.cost = source.reduce((s, r) => s + r.cost, 0);
    c.conversions = source.reduce((s, r) => s + r.conversions, 0);
    rolledUp++;
  }
  if (rolledUp > 0) {
    warnings.push(
      `${rolledUp} campaign${rolledUp === 1 ? "" : "s"} without a campaigns.csv row: clicks/cost/conversions rolled up from keyword or search-term rows.`,
    );
  }

  const primaryColumnPresent = parsed.conversions?.headers.some((h) =>
    lookupFor("conversions").get(h) === "primary",
  ) ?? false;
  const conversionActions = (parsed.conversions?.rows ?? [])
    .filter((r) => r.conversion_action)
    .map((r) => conversionFromRow(r, primaryColumnPresent));

  const windowDays =
    meta.windowDays && meta.windowDays > 0 ? Math.round(meta.windowDays) : 30;
  const windowCost = campaigns.reduce((s, c) => s + c.cost, 0);
  const monthlySpend = Math.round((windowCost * 30) / windowDays * 100) / 100;

  const snapshot: AccountSnapshot = {
    accountId: tenant,
    accountName: meta.name?.trim() || tenant,
    currency: meta.currency?.trim().toUpperCase() || "USD",
    windowDays,
    monthlySpend,
    conversionActions,
    campaigns,
  };
  const context: NonNullable<AccountSnapshot["context"]> = {};
  if (meta.subNiche) context.subNiche = meta.subNiche;
  if (meta.servesLocations && meta.servesLocations.length > 0) {
    context.servesLocations = meta.servesLocations;
  }
  if (Object.keys(context).length > 0) snapshot.context = context;

  const uniqueMissing = [...new Set(missing)];
  return {
    snapshot,
    ingest: {
      tenant,
      present,
      missing: uniqueMissing,
      partial: uniqueMissing.length > 0,
      warnings,
      rowCounts,
    },
  };
}

// ---------------------------------------------------------------------------
// Filesystem adapter
// ---------------------------------------------------------------------------

const SAFE_SLUG = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/** Folder names that are never tenants (docs, templates, dotfiles). */
export function isTenantSlug(name: string): boolean {
  return SAFE_SLUG.test(name) && !name.startsWith("_") && !name.startsWith(".") && !name.includes("..");
}

async function readOptional(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return undefined;
  }
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Serves every folder under `data/case-studies/` as an account. The folder
 * slug is the account id (and the tenant id in the dashboard).
 */
export class CsvDataSource implements AdsDataSource {
  readonly kind = "csv" as const;
  readonly root: string;

  constructor(root: string = process.env.CASE_STUDIES_DIR ?? DEFAULT_CASE_STUDIES_DIR) {
    this.root = root;
  }

  private dirFor(tenant: string): string {
    if (!isTenantSlug(tenant)) {
      throw new Error(`No CSV tenant "${tenant}" (invalid folder name).`);
    }
    return join(this.root, tenant);
  }

  async listAccounts(): Promise<AccountRef[]> {
    let entries: string[];
    try {
      entries = (await readdir(this.root, { withFileTypes: true }))
        .filter((e) => e.isDirectory() && isTenantSlug(e.name))
        .map((e) => e.name);
    } catch {
      return [];
    }
    const refs: AccountRef[] = [];
    for (const name of entries.sort()) {
      const { present } = await this.inspect(name);
      const hasMeta = (await readOptional(join(this.root, name, TENANT_META_FILE))) != null;
      if (present.length > 0 || hasMeta) refs.push({ customerId: name });
    }
    return refs;
  }

  /** Cheap file-presence check — no parsing. Used for the partial-data badge. */
  async inspect(tenant: string): Promise<{ present: CsvTable[]; missing: CsvTable[] }> {
    const dir = this.dirFor(tenant);
    const present: CsvTable[] = [];
    const missing: CsvTable[] = [];
    for (const table of CSV_TABLES) {
      try {
        await stat(join(dir, `${table}.csv`));
        present.push(table);
      } catch {
        missing.push(table);
      }
    }
    return { present, missing };
  }

  async fetchCsvAccount(tenant: string): Promise<{ snapshot: AccountSnapshot; ingest: CsvIngestMeta }> {
    const dir = this.dirFor(tenant);
    if (!(await isDirectory(dir))) {
      throw new Error(`No CSV tenant "${tenant}" under ${this.root}.`);
    }

    const tables: Partial<Record<CsvTable, string>> = {};
    for (const table of CSV_TABLES) {
      const text = await readOptional(join(dir, `${table}.csv`));
      if (text != null) tables[table] = text;
    }

    let meta: TenantMeta | undefined;
    const metaWarnings: string[] = [];
    const metaText = await readOptional(join(dir, TENANT_META_FILE));
    if (metaText != null) {
      try {
        meta = JSON.parse(metaText) as TenantMeta;
      } catch {
        metaWarnings.push(`${TENANT_META_FILE} is not valid JSON — ignored.`);
      }
    }

    const built = buildCsvSnapshot({ tenant, meta, tables });
    built.ingest.warnings.unshift(...metaWarnings);
    return built;
  }

  async fetchAccountSnapshot(tenant: string): Promise<AccountSnapshot> {
    return (await this.fetchCsvAccount(tenant)).snapshot;
  }
}
