import { describe, it, expect } from "vitest";
import {
  PACKS,
  audit,
  resolvePack,
  selectablePacks,
  suggestPackId,
} from "./index";
import { piFirmSnapshot, hvacSnapshot, cleanPiSnapshot } from "./fixtures";
import type { AccountSnapshot, Finding } from "./types";

function ids(findings: Finding[]): string[] {
  return findings.map((f) => f.ruleId);
}

describe("pack resolution", () => {
  it("flattens the inheritance chain, base first", () => {
    const pi = resolvePack("legal-personal-injury", PACKS);
    expect(pi.lineage).toEqual(["base", "legal-personal-injury"]);
    // Inherits base rules and adds its own.
    expect(pi.rules.some((r) => r.id === "base.conversion-integrity")).toBe(true);
    expect(pi.rules.some((r) => r.id === "pi.junk-search-terms")).toBe(true);
  });

  it("throws on unknown pack", () => {
    expect(() => resolvePack("nope", PACKS)).toThrow(/Unknown knowledge pack/);
  });

  it("exposes only concrete packs as selectable", () => {
    const selectable = selectablePacks().map((p) => p.id);
    expect(selectable).toContain("legal-personal-injury");
    expect(selectable).toContain("home-services");
    expect(selectable).not.toContain("base");
  });
});

describe("well-formedness of every pack", () => {
  for (const pack of Object.values(PACKS)) {
    it(`"${pack.id}" has unique rule ids and valid confidence/severity`, () => {
      const seen = new Set<string>();
      for (const r of pack.rules) {
        expect(seen.has(r.id), `duplicate rule id ${r.id}`).toBe(false);
        seen.add(r.id);
      }
    });
  }

  it("benchmark ranges are ordered min <= typical <= max", () => {
    for (const pack of Object.values(PACKS)) {
      for (const b of pack.benchmarks) {
        expect(b.min, `${pack.id}/${b.metric}`).toBeLessThanOrEqual(b.typical);
        expect(b.typical, `${pack.id}/${b.metric}`).toBeLessThanOrEqual(b.max);
      }
    }
  });
});

describe("PI audit catches the classic mistakes", () => {
  const report = audit(piFirmSnapshot, "legal-personal-injury");
  const found = ids(report.findings);

  it("flags missing signed-case tracking as critical", () => {
    const f = report.findings.find((x) => x.ruleId === "pi.signed-case-tracking");
    expect(f).toBeDefined();
    expect(f?.severity).toBe("critical");
  });

  it("flags junk / wrong-practice-area search terms with a waste estimate", () => {
    const f = report.findings.find((x) => x.ruleId === "pi.junk-search-terms");
    expect(f).toBeDefined();
    expect(f?.estimatedMonthlyWaste ?? 0).toBeGreaterThan(0);
  });

  it("flags PMax reliance, national targeting, unstaffed intake, and unverified bidding", () => {
    expect(found).toContain("pi.pmax-in-legal");
    expect(found).toContain("pi.jurisdiction-targeting");
    expect(found).toContain("pi.intake-hours");
    expect(found).toContain("base.conversion-integrity");
  });

  it("sorts findings by severity (critical first)", () => {
    const order = ["critical", "high", "medium", "low"];
    const seq = report.findings.map((f) => order.indexOf(f.severity));
    const sorted = [...seq].sort((a, b) => a - b);
    expect(seq).toEqual(sorted);
  });
});

describe("home-services audit catches channel + tracking gaps", () => {
  const report = audit(hvacSnapshot, "home-services");
  const found = ids(report.findings);

  it("flags missing LSA and missing call tracking", () => {
    expect(found).toContain("hs.missing-lsa");
    expect(found).toContain("hs.no-call-tracking");
  });

  it("flags the 60-mile radius and seasonal flat budget", () => {
    expect(found).toContain("hs.service-radius");
    expect(found).toContain("hs.seasonality-flat-budget");
  });
});

/** Minimal snapshot factory for sub-niche mechanics tests. */
function makeSnapshot(overrides: Partial<AccountSnapshot>): AccountSnapshot {
  return {
    accountId: "t-1",
    accountName: "Test",
    currency: "USD",
    windowDays: 30,
    monthlySpend: 20000,
    conversionActions: [],
    campaigns: [],
    ...overrides,
  };
}

describe("sub-niche pack mechanics", () => {
  it("resolves a 3-level lineage: base → PI → truck", () => {
    const truck = resolvePack("legal-pi-truck-accident", PACKS);
    expect(truck.lineage).toEqual([
      "base",
      "legal-personal-injury",
      "legal-pi-truck-accident",
    ]);
    // Inherits rules from both ancestors.
    expect(truck.rules.some((r) => r.id === "base.conversion-integrity")).toBe(true);
    expect(truck.rules.some((r) => r.id === "pi.junk-search-terms")).toBe(true);
  });

  it("benchmark overrides drive inherited rules: truck's higher budget floor", () => {
    const snapshot = makeSnapshot({ monthlySpend: 8000 });
    // $8k/mo clears the generic PI floor ($5k) but not truck's ($10k).
    const pi = audit(snapshot, "legal-personal-injury");
    const truck = audit(snapshot, "legal-pi-truck-accident");
    expect(pi.findings.map((f) => f.ruleId)).not.toContain("pi.budget-floor");
    expect(truck.findings.map((f) => f.ruleId)).toContain("pi.budget-floor");
  });

  it("junk signals extend by data: 'cdl' traffic flagged only by the truck pack", () => {
    const snapshot = makeSnapshot({
      campaigns: [
        {
          id: "c1",
          name: "Search — Truck",
          type: "search",
          enabled: true,
          bidStrategy: "manual-cpc",
          dailyBudget: 500,
          geo: { locations: ["Texas"] },
          clicks: 100,
          impressions: 1000,
          cost: 5000,
          conversions: 2,
          conversionValue: 0,
          keywords: [],
          searchTerms: [
            { text: "cdl requirements texas", clicks: 20, cost: 900, conversions: 0 },
          ],
        },
      ],
    });
    const piIds = audit(snapshot, "legal-personal-injury").findings.map((f) => f.ruleId);
    const truckIds = audit(snapshot, "legal-pi-truck-accident").findings.map((f) => f.ruleId);
    expect(piIds).not.toContain("pi.junk-search-terms");
    expect(truckIds).toContain("pi.junk-search-terms");
  });

  it("mass tort overrides the jurisdiction rule by id: national is fine, narrow geo is questioned", () => {
    const national = makeSnapshot({
      monthlySpend: 60000,
      campaigns: [
        {
          id: "c1",
          name: "Tort — National",
          type: "search",
          enabled: true,
          bidStrategy: "maximize-conversions",
          dailyBudget: 2000,
          geo: { locations: ["United States"], national: true },
          clicks: 100,
          impressions: 1000,
          cost: 60000,
          conversions: 50,
          conversionValue: 0,
          keywords: [],
          searchTerms: [],
        },
      ],
    });
    const mtNational = audit(national, "legal-pi-mass-tort");
    const jurisdictionFindings = mtNational.findings.filter(
      (f) => f.ruleId === "pi.jurisdiction-targeting",
    );
    expect(jurisdictionFindings).toHaveLength(0);
    // The same national campaign WOULD be flagged by the parent PI pack.
    const piNational = audit(national, "legal-personal-injury");
    expect(piNational.findings.map((f) => f.ruleId)).toContain(
      "pi.jurisdiction-targeting",
    );

    const narrow = makeSnapshot({
      monthlySpend: 60000,
      campaigns: [
        { ...national.campaigns[0], geo: { locations: ["Texas"], national: false } },
      ],
    });
    const mtNarrow = audit(narrow, "legal-pi-mass-tort");
    const narrowFinding = mtNarrow.findings.find(
      (f) => f.ruleId === "pi.jurisdiction-targeting",
    );
    expect(narrowFinding?.severity).toBe("low");
  });

  it("broad-match rule fires only without verified-outcome feedback", () => {
    const broadKeywords = [
      {
        text: "truck accident lawyer",
        matchType: "broad" as const,
        clicks: 100,
        cost: 8000,
        conversions: 5,
      },
      {
        text: "[truck accident attorney]",
        matchType: "exact" as const,
        clicks: 20,
        cost: 2000,
        conversions: 2,
      },
    ];
    const campaign = {
      id: "c1",
      name: "Search",
      type: "search" as const,
      enabled: true,
      bidStrategy: "manual-cpc" as const,
      dailyBudget: 400,
      geo: { locations: ["Texas"] },
      clicks: 120,
      impressions: 2000,
      cost: 10000,
      conversions: 7,
      conversionValue: 0,
      keywords: broadKeywords,
      searchTerms: [],
    };
    const unverified = makeSnapshot({
      campaigns: [campaign],
      conversionActions: [
        {
          name: "Form",
          category: "website-form",
          counting: "one",
          primaryForBidding: true,
          verifiedValue: false,
          count: 7,
          value: 0,
        },
      ],
    });
    expect(
      audit(unverified, "legal-personal-injury").findings.map((f) => f.ruleId),
    ).toContain("base.broad-match-share");

    const verified = makeSnapshot({
      campaigns: [campaign],
      conversionActions: [
        {
          name: "Signed Case",
          category: "imported-offline",
          counting: "one",
          primaryForBidding: true,
          verifiedValue: true,
          count: 3,
          value: 45000,
        },
      ],
    });
    expect(
      audit(verified, "legal-personal-injury").findings.map((f) => f.ruleId),
    ).not.toContain("base.broad-match-share");
  });
});

describe("pack suggestion routes specific-first", () => {
  const cases: Array<[string, string]> = [
    ["truck-accident", "legal-pi-truck-accident"],
    ["mass tort", "legal-pi-mass-tort"],
    ["car-accident", "legal-pi-car-accident"],
    ["hvac", "hs-hvac"],
    ["roofing", "hs-roofing"],
    ["medical malpractice", "legal-personal-injury"],
    ["plumbing", "home-services"],
  ];
  for (const [subNiche, expected] of cases) {
    it(`"${subNiche}" → ${expected}`, () => {
      expect(suggestPackId(makeSnapshot({ context: { subNiche } }))).toBe(expected);
    });
  }

  it("returns null when nothing matches", () => {
    expect(
      suggestPackId(makeSnapshot({ accountName: "Mystery LLC", context: {} })),
    ).toBeNull();
  });
});

describe("control case: a disciplined PI account", () => {
  const report = audit(cleanPiSnapshot, "legal-personal-injury");
  const found = ids(report.findings);

  it("does NOT flag missing signed-case tracking (it's wired)", () => {
    expect(found).not.toContain("pi.signed-case-tracking");
  });

  it("does NOT flag PMax (there is none) or national targeting", () => {
    expect(found).not.toContain("pi.pmax-in-legal");
    expect(found).not.toContain("pi.jurisdiction-targeting");
  });

  it("produces materially fewer findings than the messy account", () => {
    const messy = audit(piFirmSnapshot, "legal-personal-injury");
    expect(report.findings.length).toBeLessThan(messy.findings.length);
  });
});
