import { describe, it, expect } from "vitest";
import { buildNegativeChangeSet, toEditorCsv } from "./negatives";
import { PACKS, resolvePack } from "../knowledge";
import { piFirmSnapshot } from "../knowledge/fixtures";

const piPack = resolvePack("legal-personal-injury", PACKS);

describe("buildNegativeChangeSet", () => {
  const cs = buildNegativeChangeSet(piFirmSnapshot, piPack);

  it("captures the wrong-practice-area terms as exact negatives, cost-sorted", () => {
    const keywords = cs.termNegatives.map((n) => n.keyword);
    expect(keywords).toContain("divorce attorney");
    expect(keywords).toContain("dui lawyer near me");
    expect(keywords).toContain("personal injury attorney jobs");
    // Sorted by cost descending.
    const costs = cs.termNegatives.map((n) => n.cost);
    expect(costs).toEqual([...costs].sort((a, b) => b - a));
    expect(cs.totalWasteInWindow).toBeGreaterThan(0);
  });

  it("aggregates signal candidates with evidence and flags overblock risks", () => {
    const free = cs.signalNegatives.find((s) => s.keyword === "free");
    expect(free).toBeDefined();
    expect(free?.caution).toMatch(/free consultation/i);
    expect(free?.matchedTerms.length).toBeGreaterThan(0);
  });

  it("only scans enabled campaigns", () => {
    const disabled = {
      ...piFirmSnapshot,
      campaigns: piFirmSnapshot.campaigns.map((c) => ({ ...c, enabled: false })),
    };
    const empty = buildNegativeChangeSet(disabled, piPack);
    expect(empty.termNegatives).toHaveLength(0);
    expect(empty.totalWasteInWindow).toBe(0);
  });
});

describe("toEditorCsv", () => {
  it("emits the Editor header and only Tier-1 exact negatives, quoting as needed", () => {
    const cs = buildNegativeChangeSet(piFirmSnapshot, piPack);
    const csv = toEditorCsv(cs);
    const lines = csv.trim().split("\n");
    expect(lines[0]).toBe("Campaign,Keyword,Criterion Type");
    expect(lines.length).toBe(cs.termNegatives.length + 1);
    expect(lines.every((l, i) => i === 0 || l.endsWith("Negative Exact"))).toBe(true);
  });

  it("escapes embedded commas and quotes", () => {
    const csv = toEditorCsv({
      accountId: "a",
      packId: "p",
      windowDays: 30,
      totalWasteInWindow: 1,
      signalNegatives: [],
      termNegatives: [
        {
          campaignName: 'Search, "Core"',
          keyword: "cheap, free lawyer",
          matchType: "exact",
          cost: 1,
          clicks: 1,
          matchedSignal: "free",
        },
      ],
    });
    expect(csv).toContain('"Search, ""Core""","cheap, free lawyer",Negative Exact');
  });
});
