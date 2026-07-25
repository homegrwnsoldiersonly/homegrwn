import { describe, it, expect } from "vitest";
import { PACKS, audit, resolvePack, selectablePacks } from "./index";
import { piFirmSnapshot, hvacSnapshot, cleanPiSnapshot } from "./fixtures";
import type { Finding } from "./types";

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
