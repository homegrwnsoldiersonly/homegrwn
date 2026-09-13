import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  COLUMNS,
  CSV_TABLES,
  CsvDataSource,
  bidStrategyFromText,
  buildCsvSnapshot,
  campaignTypeFromText,
  conversionTaxonomyFromText,
  countingFromText,
  enabledFromText,
  isTenantSlug,
  matchTypeFromText,
  normalizeHeader,
  parseList,
  parseNumber,
  parseTable,
} from "./csv-datasource";
import { parseCsv } from "../conversions/csv";
import { audit, suggestPackId } from "../knowledge";

// ---------------------------------------------------------------------------
// Cell parsing
// ---------------------------------------------------------------------------

describe("cell parsing tolerates Google Ads UI export formatting", () => {
  it("normalizes headers the way Google labels them", () => {
    expect(normalizeHeader("Conv. value")).toBe("conv_value");
    expect(normalizeHeader("Impr.")).toBe("impr");
    expect(normalizeHeader("Bid strategy type")).toBe("bid_strategy_type");
    expect(normalizeHeader("﻿Campaign")).toBe("campaign");
    expect(normalizeHeader("  Search term ")).toBe("search_term");
  });

  it("parses money, blanks and dashes", () => {
    expect(parseNumber("$1,234.56")).toBe(1234.56);
    expect(parseNumber("1,234")).toBe(1234);
    expect(parseNumber(" --")).toBe(0);
    expect(parseNumber("")).toBe(0);
    expect(parseNumber(undefined)).toBe(0);
    expect(parseNumber("12.5%")).toBe(12.5);
    expect(parseNumber("-40")).toBe(-40);
    expect(parseNumber("abc")).toBe(0);
  });

  it("splits lists on ; and |", () => {
    expect(parseList("Phoenix, AZ; Mesa, AZ")).toEqual(["Phoenix, AZ", "Mesa, AZ"]);
    expect(parseList("a | b |")).toEqual(["a", "b"]);
    expect(parseList("")).toEqual([]);
    expect(parseList(" --")).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Enum text
// ---------------------------------------------------------------------------

describe("enum text folds onto the live mapper's vocabulary", () => {
  it("campaign type", () => {
    expect(campaignTypeFromText("Search")).toBe("search");
    expect(campaignTypeFromText("Performance Max")).toBe("performance-max");
    expect(campaignTypeFromText("Local Services")).toBe("local-services");
    expect(campaignTypeFromText("Demand Gen")).toBe("demand-gen");
    expect(campaignTypeFromText("Video")).toBe("video");
    expect(campaignTypeFromText("")).toBe("unknown");
    expect(campaignTypeFromText("Hotel")).toBe("unknown");
  });

  it("bid strategy — a target beats the maximize label it is wrapped in", () => {
    expect(bidStrategyFromText("Maximize conversions (Target CPA)")).toBe("target-cpa");
    expect(bidStrategyFromText("Maximize conversions")).toBe("maximize-conversions");
    expect(bidStrategyFromText("Maximize conversion value")).toBe("maximize-conversion-value");
    expect(bidStrategyFromText("Target ROAS")).toBe("target-roas");
    expect(bidStrategyFromText("Maximize clicks")).toBe("maximize-clicks");
    expect(bidStrategyFromText("Manual CPC")).toBe("manual-cpc");
    expect(bidStrategyFromText("Enhanced CPC")).toBe("manual-cpc");
    expect(bidStrategyFromText("Target impression share")).toBe("target-impression-share");
    expect(bidStrategyFromText("")).toBe("unknown");
  });

  it("match type and status", () => {
    expect(matchTypeFromText("Exact match")).toBe("exact");
    expect(matchTypeFromText("phrase")).toBe("phrase");
    expect(matchTypeFromText("Broad match")).toBe("broad");
    expect(matchTypeFromText("")).toBe("unknown");
    expect(enabledFromText("Enabled")).toBe(true);
    expect(enabledFromText("Eligible")).toBe(true);
    expect(enabledFromText("Limited by budget")).toBe(true);
    expect(enabledFromText("Paused")).toBe(false);
    expect(enabledFromText("Removed")).toBe(false);
    expect(enabledFromText("")).toBe(true);
  });

  it("counting defaults to the riskier 'every'", () => {
    expect(countingFromText("One")).toBe("one");
    expect(countingFromText("One per click")).toBe("one");
    expect(countingFromText("Every")).toBe("every");
    expect(countingFromText("")).toBe("every");
  });

  it("conversion taxonomy", () => {
    expect(conversionTaxonomyFromText("Website", "Submit lead form")).toEqual({
      category: "website-form",
      verified: false,
    });
    expect(conversionTaxonomyFromText("Calls from ads", "Phone call lead").category).toBe(
      "phone-call",
    );
    expect(conversionTaxonomyFromText("Import from clicks", "Converted lead")).toEqual({
      category: "imported-offline",
      verified: true,
    });
    expect(conversionTaxonomyFromText("Website", "Purchase")).toEqual({
      category: "purchase",
      verified: true,
    });
    expect(conversionTaxonomyFromText("", "Qualified lead").verified).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Table parsing
// ---------------------------------------------------------------------------

const CAMPAIGNS_EXPORT = [
  "Campaign report (Aug 1, 2026 - Aug 31, 2026)",
  "All time",
  "Campaign,Campaign state,Campaign type,Bid strategy type,Budget,Clicks,Impr.,Cost,Conversions,Conv. value,Locations,Radius (mi)",
  'Search — AC Repair,Enabled,Search,Maximize conversions,"$107.00",420,"15,000","$3,200.00",44.00,0.00,"Phoenix, AZ",60',
  "Brand — Comfort HVAC,Paused,Search,Manual CPC,$20.00,12,300,$18.40,2,0, --, --",
  'Total: All campaigns, , , , ,432,"15,300","$3,218.40",46,0,,',
  "",
].join("\n");

describe("parseTable", () => {
  it("skips the preamble, maps Google headers, drops the Total row", () => {
    const t = parseTable(CAMPAIGNS_EXPORT, "campaigns");
    expect(t.rows).toHaveLength(2);
    expect(t.rows[0].campaign).toBe("Search — AC Repair");
    expect(t.rows[0].impressions).toBe("15,000");
    expect(t.rows[0].conv_value).toBe("0.00");
    expect(t.rows[0].locations).toBe("Phoenix, AZ");
    expect(t.rows[0].radius_mi).toBe("60");
    expect(t.warnings.join(" ")).toMatch(/2 preamble rows/);
    expect(t.warnings.join(" ")).toMatch(/dropped 1 "Total" row/);
  });

  it("ignores a file with no recognizable header", () => {
    const t = parseTable("foo,bar\n1,2\n", "keywords");
    expect(t.rows).toHaveLength(0);
    expect(t.headers).toHaveLength(0);
    expect(t.warnings[0]).toMatch(/no header row/);
  });

  it("flags a missing required column but still returns rows", () => {
    const t = parseTable("Search term,Clicks,Cost\nac repair diy,3,20\n", "search_terms");
    expect(t.rows).toHaveLength(1);
    expect(t.warnings.join(" ")).toMatch(/missing required column campaign/);
  });

  it("handles a BOM and CRLF", () => {
    const t = parseTable("﻿Campaign,Cost\r\nA,$5\r\n", "campaigns");
    expect(t.rows).toEqual([{ campaign: "A", cost: "$5" }]);
  });
});

// ---------------------------------------------------------------------------
// Snapshot assembly
// ---------------------------------------------------------------------------

const KEYWORDS = [
  "Campaign,Keyword,Match type,Clicks,Cost,Conversions,Quality score",
  "Search — AC Repair,ac repair phoenix,Phrase match,260,$2100,30,7",
  "Search — AC Repair,ac repair,Broad match,100,$800,4, --",
].join("\n");

const SEARCH_TERMS = [
  "Campaign,Search term,Clicks,Cost,Conversions",
  "Search — AC Repair,ac repair phoenix,150,$1200,18",
  "Search — AC Repair,hvac technician jobs phoenix,24,$180,0",
  "Search — AC Repair,ac compressor parts,20,$150,0",
  "Ghost campaign,free ac repair,5,$40,0",
].join("\n");

const CONVERSIONS = [
  "Conversion action,Category,Source,Counting,Include in Conversions,Conversions,Conv. value",
  "Website Form,Submit lead form,Website,One,Yes,40,0",
  "Calls from ads,Phone call lead,Calls from ads,Every,Yes,12,0",
  "Booked jobs (offline),Converted lead,Import from clicks,One,No,6,4800",
].join("\n");

describe("buildCsvSnapshot", () => {
  it("assembles a full snapshot and joins children to campaigns by name", () => {
    const { snapshot, ingest } = buildCsvSnapshot({
      tenant: "acme-hvac",
      meta: { name: "Acme HVAC", subNiche: "hvac", windowDays: 30, currency: "usd" },
      tables: {
        campaigns: CAMPAIGNS_EXPORT,
        keywords: KEYWORDS,
        search_terms: SEARCH_TERMS,
        conversions: CONVERSIONS,
      },
    });

    expect(ingest.partial).toBe(false);
    expect(ingest.present).toEqual([...CSV_TABLES]);
    expect(ingest.rowCounts).toEqual({ campaigns: 2, keywords: 2, search_terms: 4, conversions: 3 });

    expect(snapshot.accountId).toBe("acme-hvac");
    expect(snapshot.accountName).toBe("Acme HVAC");
    expect(snapshot.currency).toBe("USD");
    expect(snapshot.context).toEqual({ subNiche: "hvac" });
    expect(snapshot.monthlySpend).toBeCloseTo(3200 + 18.4 + 40, 2);

    const search = snapshot.campaigns.find((c) => c.name === "Search — AC Repair")!;
    expect(search.id).toBe("search-ac-repair");
    expect(search.type).toBe("search");
    expect(search.enabled).toBe(true);
    expect(search.bidStrategy).toBe("maximize-conversions");
    expect(search.dailyBudget).toBe(107);
    expect(search.impressions).toBe(15000);
    expect(search.cost).toBe(3200);
    expect(search.geo).toEqual({ locations: ["Phoenix, AZ"], radiiMiles: [60] });
    expect(search.isBrandCampaign).toBeUndefined();
    expect(search.keywords).toHaveLength(2);
    expect(search.keywords[0]).toEqual({
      text: "ac repair phoenix",
      matchType: "phrase",
      clicks: 260,
      cost: 2100,
      conversions: 30,
      qualityScore: 7,
    });
    expect(search.keywords[1].qualityScore).toBeUndefined();
    expect(search.searchTerms).toHaveLength(3);

    const brand = snapshot.campaigns.find((c) => c.name.startsWith("Brand"))!;
    expect(brand.enabled).toBe(false);
    expect(brand.isBrandCampaign).toBe(true);
    expect(brand.bidStrategy).toBe("manual-cpc");
    expect(brand.geo).toEqual({ locations: [] });

    // A search-term row naming a campaign absent from campaigns.csv becomes
    // a stub with metrics rolled up from its rows — and says so.
    const ghost = snapshot.campaigns.find((c) => c.name === "Ghost campaign")!;
    expect(ghost.type).toBe("unknown");
    expect(ghost.cost).toBe(40);
    expect(ghost.searchTerms).toHaveLength(1);
    expect(ingest.warnings.join("\n")).toMatch(/"Ghost campaign" that is not in campaigns\.csv/);
    expect(ingest.warnings.join("\n")).toMatch(/rolled up/);

    expect(snapshot.conversionActions).toHaveLength(3);
    expect(snapshot.conversionActions[0]).toMatchObject({
      name: "Website Form",
      category: "website-form",
      counting: "one",
      primaryForBidding: true,
      verifiedValue: false,
      count: 40,
    });
    expect(snapshot.conversionActions[1]).toMatchObject({
      category: "phone-call",
      counting: "every",
    });
    expect(snapshot.conversionActions[2]).toMatchObject({
      category: "imported-offline",
      primaryForBidding: false,
      verifiedValue: true,
      count: 6,
      value: 4800,
    });
  });

  it("normalizes spend to 30 days when the export covers a longer window", () => {
    const { snapshot } = buildCsvSnapshot({
      tenant: "t",
      meta: { windowDays: 90 },
      tables: { campaigns: "Campaign,Cost\nA,$900\n" },
    });
    expect(snapshot.windowDays).toBe(90);
    expect(snapshot.monthlySpend).toBe(300);
    expect(snapshot.campaigns[0].cost).toBe(900);
  });

  it("missing files produce a partial snapshot, never a throw", () => {
    const { snapshot, ingest } = buildCsvSnapshot({
      tenant: "sparse",
      tables: { search_terms: SEARCH_TERMS },
    });
    expect(ingest.partial).toBe(true);
    expect(ingest.present).toEqual(["search_terms"]);
    expect(ingest.missing).toEqual(["campaigns", "keywords", "conversions"]);
    expect(snapshot.accountName).toBe("sparse");
    expect(snapshot.campaigns).toHaveLength(2);
    expect(snapshot.campaigns[0].cost).toBe(1530);
    expect(snapshot.monthlySpend).toBe(1570);
    expect(snapshot.conversionActions).toEqual([]);
    expect(ingest.warnings.join("\n")).toMatch(/campaigns\.csv missing/);
  });

  it("an unreadable table counts as missing", () => {
    const { snapshot, ingest } = buildCsvSnapshot({
      tenant: "junk",
      tables: { campaigns: "foo,bar,baz\n1,2,3\n" },
    });
    expect(ingest.partial).toBe(true);
    expect(ingest.missing).toContain("campaigns");
    expect(snapshot.campaigns).toEqual([]);
    expect(snapshot.monthlySpend).toBe(0);
  });

  it("nothing at all still yields an auditable (empty) account", () => {
    const { snapshot, ingest } = buildCsvSnapshot({ tenant: "empty", tables: {} });
    expect(ingest.missing).toEqual([...CSV_TABLES]);
    expect(() => audit(snapshot, "home-services")).not.toThrow();
  });

  it("defaults primaryForBidding to true only when the column is absent", () => {
    const withColumn = buildCsvSnapshot({
      tenant: "t",
      tables: { conversions: "Conversion action,Primary\nForm,no\n" },
    }).snapshot.conversionActions[0];
    const without = buildCsvSnapshot({
      tenant: "t",
      tables: { conversions: "Conversion action\nForm\n" },
    }).snapshot.conversionActions[0];
    expect(withColumn.primaryForBidding).toBe(false);
    expect(without.primaryForBidding).toBe(true);
  });

  it("feeds the knowledge engine end to end", () => {
    const { snapshot } = buildCsvSnapshot({
      tenant: "acme-hvac",
      meta: { subNiche: "hvac" },
      tables: {
        campaigns: CAMPAIGNS_EXPORT,
        keywords: KEYWORDS,
        search_terms: SEARCH_TERMS,
        conversions: CONVERSIONS,
      },
    });
    const packId = suggestPackId(snapshot);
    expect(packId).toBe("hs-hvac");
    const report = audit(snapshot, packId!);
    expect(report.accountId).toBe("acme-hvac");
    // The junk search terms ("jobs", "parts") must surface as wasted spend.
    expect(report.findings.some((f) => f.category === "wasted-spend")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Filesystem adapter
// ---------------------------------------------------------------------------

describe("CsvDataSource", () => {
  function scaffold(): string {
    const root = mkdtempSync(join(tmpdir(), "hg-csv-"));
    mkdirSync(join(root, "acme-hvac"));
    writeFileSync(join(root, "acme-hvac", "campaigns.csv"), CAMPAIGNS_EXPORT);
    writeFileSync(join(root, "acme-hvac", "search_terms.csv"), SEARCH_TERMS);
    writeFileSync(
      join(root, "acme-hvac", "tenant.json"),
      JSON.stringify({ name: "Acme HVAC", subNiche: "hvac" }),
    );
    mkdirSync(join(root, "_template"));
    writeFileSync(join(root, "_template", "campaigns.csv"), "Campaign\nX\n");
    mkdirSync(join(root, "empty-folder"));
    mkdirSync(join(root, "meta-only"));
    writeFileSync(join(root, "meta-only", "tenant.json"), "{ not json");
    return root;
  }

  it("lists folders that hold at least one table or a tenant.json; skips _ and empty ones", async () => {
    const source = new CsvDataSource(scaffold());
    expect(source.kind).toBe("csv");
    const refs = await source.listAccounts();
    expect(refs.map((r) => r.customerId)).toEqual(["acme-hvac", "meta-only"]);
  });

  it("returns [] for a root that does not exist", async () => {
    const source = new CsvDataSource(join(tmpdir(), "does-not-exist-" + Date.now()));
    expect(await source.listAccounts()).toEqual([]);
  });

  it("reads tables + tenant.json and reports what is missing", async () => {
    const source = new CsvDataSource(scaffold());
    const { snapshot, ingest } = await source.fetchCsvAccount("acme-hvac");
    expect(snapshot.accountName).toBe("Acme HVAC");
    expect(snapshot.context?.subNiche).toBe("hvac");
    expect(ingest.partial).toBe(true);
    expect(ingest.missing).toEqual(["keywords", "conversions"]);
    expect(await source.inspect("acme-hvac")).toEqual({
      present: ["campaigns", "search_terms"],
      missing: ["keywords", "conversions"],
    });
    const plain = await source.fetchAccountSnapshot("acme-hvac");
    expect(plain.accountId).toBe("acme-hvac");
  });

  it("tolerates a broken tenant.json", async () => {
    const source = new CsvDataSource(scaffold());
    const { snapshot, ingest } = await source.fetchCsvAccount("meta-only");
    expect(snapshot.accountName).toBe("meta-only");
    expect(ingest.warnings[0]).toMatch(/tenant\.json is not valid JSON/);
  });

  it("refuses path-shaped ids and unknown folders", async () => {
    const source = new CsvDataSource(scaffold());
    await expect(source.fetchAccountSnapshot("../etc")).rejects.toThrow(/No CSV tenant/);
    await expect(source.fetchAccountSnapshot("nope")).rejects.toThrow(/No CSV tenant/);
    expect(isTenantSlug("acme-hvac")).toBe(true);
    expect(isTenantSlug("_template")).toBe(false);
    expect(isTenantSlug(".git")).toBe(false);
    expect(isTenantSlug("a/b")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// TEMPLATE.csv stays in sync with the column registry
// ---------------------------------------------------------------------------

describe("data/case-studies/TEMPLATE.csv", () => {
  it("documents exactly the columns the mapper understands", () => {
    const text = readFileSync(join(process.cwd(), "data/case-studies/TEMPLATE.csv"), "utf8");
    const rows = parseCsv(text);
    const header = rows[0];
    expect(header.slice(0, 4)).toEqual(["file", "column", "required", "type"]);

    const documented = new Set(rows.slice(1).map((r) => `${r[0]}::${r[1]}`));
    const expected = new Set<string>();
    for (const table of CSV_TABLES) {
      for (const spec of COLUMNS[table]) expected.add(`${table}.csv::${spec.key}`);
    }
    expect([...documented].sort()).toEqual([...expected].sort());

    // Required flags and accepted headers must match too.
    for (const r of rows.slice(1)) {
      const table = r[0].replace(/\.csv$/, "") as (typeof CSV_TABLES)[number];
      const spec = COLUMNS[table].find((c) => c.key === r[1])!;
      expect(r[2]).toBe(spec.required ? "yes" : "no");
      expect(r[3]).toBe(spec.kind);
      const accepted = r[4].split(/\s*\|\s*/).filter(Boolean);
      expect(accepted).toEqual([spec.key, ...spec.aliases]);
    }
  });
});
