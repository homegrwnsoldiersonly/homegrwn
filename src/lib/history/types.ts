/**
 * Audit history: persisted runs and run-over-run diffs.
 *
 * The scheduled-audit loop only creates operator value if it can answer
 * "what CHANGED since yesterday?" — a daily dump of the same 8 findings is
 * noise. So runs are stored and diffed, and the surfaced product is the diff:
 * new findings, resolved findings, severity shifts, waste delta.
 */

import type { AuditReport, Finding, Severity } from "../knowledge/types";

/** One persisted audit run for one account. */
export interface StoredAuditRun {
  /** Monotonic id, e.g. "2026-07-28T05-30-00-000Z". */
  runId: string;
  /** ISO timestamp of the run. */
  at: string;
  accountId: string;
  accountName: string;
  packId: string;
  packLineage: string[];
  monthlySpend: number;
  findings: Finding[];
  summary: AuditReport["summary"];
}

/** A severity change for a finding present in both runs. */
export interface SeverityShift {
  key: string;
  title: string;
  from: Severity;
  to: Severity;
  /** True when `to` is more severe than `from`. */
  worsened: boolean;
}

/** What changed between two runs (or against nothing, for a first run). */
export interface AuditDiff {
  accountId: string;
  /** Absent when this is the first recorded run. */
  fromRunId?: string;
  toRunId: string;
  firstRun: boolean;
  newFindings: Finding[];
  resolvedFindings: Finding[];
  severityShifts: SeverityShift[];
  /** Estimated monthly waste: current minus previous. */
  wasteDelta: number;
  unchangedCount: number;
  /** True when the diff contains anything an operator should look at. */
  actionable: boolean;
}

/** Storage port. Filesystem adapter today; KV/Postgres later, same interface. */
export interface HistoryStore {
  append(run: StoredAuditRun): Promise<void>;
  latest(accountId: string): Promise<StoredAuditRun | null>;
  list(accountId: string, limit?: number): Promise<StoredAuditRun[]>;
}
