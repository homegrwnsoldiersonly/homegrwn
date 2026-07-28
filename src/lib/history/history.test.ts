import { describe, it, expect } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { diffRuns } from "./diff";
import { FsHistoryStore } from "./fs-store";
import { runScheduledAudit } from "./runner";
import { FixtureDataSource } from "../ads/datasource";
import type { StoredAuditRun } from "./types";
import type { Finding } from "../knowledge/types";

function finding(overrides: Partial<Finding>): Finding {
  return {
    ruleId: "r1",
    title: "T",
    severity: "high",
    category: "wasted-spend",
    confidence: 0.8,
    summary: "s",
    evidence: [],
    recommendation: "r",
    nicheRationale: "n",
    ...overrides,
  };
}

function run(overrides: Partial<StoredAuditRun>): StoredAuditRun {
  return {
    runId: "2026-07-28T00-00-00-000Z",
    at: "2026-07-28T00:00:00.000Z",
    accountId: "a1",
    accountName: "A",
    packId: "legal-personal-injury",
    packLineage: ["base", "legal-personal-injury"],
    monthlySpend: 10000,
    findings: [],
    summary: {
      bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
      estimatedMonthlyWaste: 0,
    },
    ...overrides,
  };
}

describe("diffRuns", () => {
  it("first run: everything is new, actionable iff findings exist", () => {
    const d = diffRuns(null, run({ findings: [finding({})] }));
    expect(d.firstRun).toBe(true);
    expect(d.newFindings).toHaveLength(1);
    expect(d.actionable).toBe(true);
    expect(diffRuns(null, run({})).actionable).toBe(false);
  });

  it("detects new, resolved, severity shifts, and waste delta", () => {
    const prev = run({
      runId: "r-prev",
      findings: [
        finding({ ruleId: "a", title: "stays" }),
        finding({ ruleId: "b", title: "resolves" }),
        finding({ ruleId: "c", title: "worsens", severity: "medium" }),
      ],
      summary: {
        bySeverity: { critical: 0, high: 2, medium: 1, low: 0 },
        estimatedMonthlyWaste: 1000,
      },
    });
    const next = run({
      runId: "r-next",
      findings: [
        finding({ ruleId: "a", title: "stays" }),
        finding({ ruleId: "c", title: "worsens", severity: "critical" }),
        finding({ ruleId: "d", title: "brand new" }),
      ],
      summary: {
        bySeverity: { critical: 1, high: 2, medium: 0, low: 0 },
        estimatedMonthlyWaste: 1600,
      },
    });
    const d = diffRuns(prev, next);
    expect(d.firstRun).toBe(false);
    expect(d.newFindings.map((f) => f.title)).toEqual(["brand new"]);
    expect(d.resolvedFindings.map((f) => f.title)).toEqual(["resolves"]);
    expect(d.severityShifts).toEqual([
      expect.objectContaining({ title: "worsens", from: "medium", to: "critical", worsened: true }),
    ]);
    expect(d.wasteDelta).toBe(600);
    expect(d.unchangedCount).toBe(1);
    expect(d.actionable).toBe(true);
  });

  it("identical runs are not actionable", () => {
    const a = run({ runId: "r1", findings: [finding({})] });
    const b = run({ runId: "r2", findings: [finding({})] });
    const d = diffRuns(a, b);
    expect(d.actionable).toBe(false);
    expect(d.unchangedCount).toBe(1);
  });

  it("same rule, different campaign titles tracked independently", () => {
    const prev = run({
      runId: "r1",
      findings: [finding({ ruleId: "x", title: "Campaign A capped" })],
    });
    const next = run({
      runId: "r2",
      findings: [finding({ ruleId: "x", title: "Campaign B capped" })],
    });
    const d = diffRuns(prev, next);
    expect(d.newFindings[0].title).toBe("Campaign B capped");
    expect(d.resolvedFindings[0].title).toBe("Campaign A capped");
  });
});

describe("FsHistoryStore", () => {
  it("appends and reads back runs in order, isolated per account", async () => {
    const dir = mkdtempSync(join(tmpdir(), "audit-history-"));
    const store = new FsHistoryStore(dir);
    await store.append(run({ runId: "r1" }));
    await store.append(run({ runId: "r2" }));
    await store.append(run({ runId: "other", accountId: "a2" }));

    const runs = await store.list("a1");
    expect(runs.map((r) => r.runId)).toEqual(["r1", "r2"]);
    expect((await store.latest("a1"))?.runId).toBe("r2");
    expect((await store.latest("a2"))?.runId).toBe("other");
    expect(await store.latest("missing")).toBeNull();
  });

  it("sanitizes hostile account ids out of paths", async () => {
    const dir = mkdtempSync(join(tmpdir(), "audit-history-"));
    const store = new FsHistoryStore(dir);
    await store.append(run({ runId: "r1", accountId: "../../etc/passwd" }));
    expect((await store.latest("../../etc/passwd"))?.runId).toBe("r1");
  });
});

describe("runScheduledAudit end-to-end (fixtures)", () => {
  it("first run baselines all accounts; second run reports no changes", async () => {
    const dir = mkdtempSync(join(tmpdir(), "audit-history-"));
    const store = new FsHistoryStore(dir);
    const source = new FixtureDataSource();

    const first = await runScheduledAudit(source, store, new Date("2026-07-28T00:00:00Z"));
    expect(first.accounts.length).toBeGreaterThanOrEqual(3);
    expect(first.errors).toHaveLength(0);
    for (const a of first.accounts) expect(a.diff.firstRun).toBe(true);
    // The messy fixtures have findings -> actionable; verify at least one.
    expect(first.actionable.length).toBeGreaterThan(0);

    const second = await runScheduledAudit(source, store, new Date("2026-07-29T00:00:00Z"));
    for (const a of second.accounts) {
      expect(a.diff.firstRun).toBe(false);
      expect(a.diff.actionable).toBe(false);
    }
    expect(second.actionable).toHaveLength(0);
  });
});
