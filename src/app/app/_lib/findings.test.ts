import { describe, it, expect } from "vitest";
import { audit } from "../../../lib/knowledge";
import { hvacSnapshot, piFirmSnapshot } from "../../../lib/knowledge/fixtures";
import {
  applyFindingFilter,
  flattenFindings,
  isFilterActive,
  parseFindingFilter,
  sortFindings,
  summarizeAccounts,
  type AccountLike,
} from "./findings";

const accounts: AccountLike[] = [
  { accountId: "pi-001", snapshot: piFirmSnapshot, packId: "legal-pi-car-accident", report: audit(piFirmSnapshot, "legal-pi-car-accident") },
  { accountId: "hs-001", snapshot: hvacSnapshot, packId: "hs-hvac", report: audit(hvacSnapshot, "hs-hvac") },
];

describe("findings helpers", () => {
  it("flattens across accounts and sorts by severity then waste", () => {
    const refs = sortFindings(flattenFindings(accounts));
    expect(refs.length).toBe(
      accounts[0].report.findings.length + accounts[1].report.findings.length,
    );
    expect(refs.length).toBeGreaterThan(0);
    for (let i = 1; i < refs.length; i++) {
      const prev = refs[i - 1].finding;
      const cur = refs[i].finding;
      const rank = (s: string) => ({ critical: 3, high: 2, medium: 1, low: 0 })[s]!;
      expect(rank(prev.severity)).toBeGreaterThanOrEqual(rank(cur.severity));
      if (prev.severity === cur.severity) {
        expect(prev.estimatedMonthlyWaste ?? 0).toBeGreaterThanOrEqual(cur.estimatedMonthlyWaste ?? 0);
      }
    }
  });

  it("parses and applies the URL filter", () => {
    const filter = parseFindingFilter({
      severity: "critical,high,bogus,high",
      pack: "hs-hvac",
      category: ["wasted-spend"],
      account: " ",
    });
    expect(filter).toEqual({ severities: ["critical", "high"], pack: "hs-hvac", category: "wasted-spend" });
    expect(isFilterActive(filter)).toBe(true);
    expect(isFilterActive(parseFindingFilter({}))).toBe(false);

    const refs = flattenFindings(accounts);
    const filtered = applyFindingFilter(refs, filter);
    for (const r of filtered) {
      expect(["critical", "high"]).toContain(r.finding.severity);
      expect(r.packId).toBe("hs-hvac");
      expect(r.finding.category).toBe("wasted-spend");
    }
    expect(applyFindingFilter(refs, { severities: [], account: "pi-001" }).every((r) => r.accountId === "pi-001")).toBe(true);
    expect(applyFindingFilter(refs, { severities: [] })).toHaveLength(refs.length);
  });

  it("summarizes a tenant", () => {
    const s = summarizeAccounts(accounts);
    expect(s.accounts).toBe(2);
    expect(s.currency).toBe("USD");
    expect(s.monthlySpend).toBe(piFirmSnapshot.monthlySpend + hvacSnapshot.monthlySpend);
    expect(s.findings).toBe(flattenFindings(accounts).length);
    expect(s.bySeverity.critical + s.bySeverity.high + s.bySeverity.medium + s.bySeverity.low).toBe(s.findings);
    expect(s.packs).toEqual(["hs-hvac", "legal-pi-car-accident"]);
    expect(s.categories.length).toBeGreaterThan(0);
    expect(summarizeAccounts([])).toMatchObject({ accounts: 0, currency: "USD", findings: 0, packs: [], categories: [] });
  });
});
