/**
 * The scheduled-audit loop: for every account the datasource can see, pull a
 * fresh snapshot, audit it through its (suggested) pack, persist the run, and
 * diff against the previous one. The product is the list of diffs — an
 * operator (or a notifier) only needs to look at `actionable` ones.
 */

import type { AdsDataSource } from "../ads/datasource";
import { audit, selectablePacks, suggestPackId } from "../knowledge";
import { diffRuns } from "./diff";
import type { AuditDiff, HistoryStore, StoredAuditRun } from "./types";

export interface ScheduledAuditResult {
  accountId: string;
  accountName: string;
  packId: string;
  findings: number;
  estimatedMonthlyWaste: number;
  diff: AuditDiff;
  /** Set when persisting the run failed (audit itself still succeeded). */
  storeError?: string;
}

export interface ScheduledAuditSummary {
  at: string;
  datasource: string;
  accounts: ScheduledAuditResult[];
  /** Accounts whose diff needs operator attention. */
  actionable: string[];
  errors: Array<{ accountId: string; error: string }>;
}

function runIdFrom(date: Date): string {
  return date.toISOString().replace(/[:.]/g, "-");
}

export async function runScheduledAudit(
  source: AdsDataSource,
  store: HistoryStore,
  now: Date = new Date(),
): Promise<ScheduledAuditSummary> {
  const refs = await source.listAccounts();
  const results: ScheduledAuditResult[] = [];
  const errors: Array<{ accountId: string; error: string }> = [];

  for (const { customerId } of refs) {
    try {
      const snapshot = await source.fetchAccountSnapshot(customerId);
      const packId = suggestPackId(snapshot) ?? selectablePacks()[0].id;
      const report = audit(snapshot, packId);

      const run: StoredAuditRun = {
        runId: runIdFrom(now),
        at: now.toISOString(),
        accountId: report.accountId,
        accountName: report.accountName,
        packId,
        packLineage: report.packLineage,
        monthlySpend: snapshot.monthlySpend,
        findings: report.findings,
        summary: report.summary,
      };

      let previous: StoredAuditRun | null = null;
      let storeError: string | undefined;
      try {
        previous = await store.latest(run.accountId);
        await store.append(run);
      } catch (err) {
        storeError = err instanceof Error ? err.message : String(err);
      }

      results.push({
        accountId: run.accountId,
        accountName: run.accountName,
        packId,
        findings: report.findings.length,
        estimatedMonthlyWaste: report.summary.estimatedMonthlyWaste,
        diff: diffRuns(previous, run),
        ...(storeError ? { storeError } : {}),
      });
    } catch (err) {
      errors.push({
        accountId: customerId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    at: now.toISOString(),
    datasource: source.kind,
    accounts: results,
    actionable: results.filter((r) => r.diff.actionable).map((r) => r.accountId),
    errors,
  };
}
