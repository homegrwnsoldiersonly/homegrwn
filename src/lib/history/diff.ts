/**
 * Pure run-over-run diffing. Finding identity is (ruleId, title): a rule that
 * emits one finding per campaign produces distinct titles, so per-campaign
 * findings track independently across runs.
 */

import type { Severity } from "../knowledge/types";
import type { AuditDiff, SeverityShift, StoredAuditRun } from "./types";

const SEVERITY_RANK: Record<Severity, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

export function findingKey(f: { ruleId: string; title: string }): string {
  return `${f.ruleId}::${f.title}`;
}

export function diffRuns(
  prev: StoredAuditRun | null,
  next: StoredAuditRun,
): AuditDiff {
  if (!prev) {
    return {
      accountId: next.accountId,
      toRunId: next.runId,
      firstRun: true,
      newFindings: next.findings,
      resolvedFindings: [],
      severityShifts: [],
      wasteDelta: next.summary.estimatedMonthlyWaste,
      unchangedCount: 0,
      actionable: next.findings.length > 0,
    };
  }

  const prevByKey = new Map(prev.findings.map((f) => [findingKey(f), f]));
  const nextByKey = new Map(next.findings.map((f) => [findingKey(f), f]));

  const newFindings = next.findings.filter((f) => !prevByKey.has(findingKey(f)));
  const resolvedFindings = prev.findings.filter(
    (f) => !nextByKey.has(findingKey(f)),
  );

  const severityShifts: SeverityShift[] = [];
  let unchangedCount = 0;
  for (const [key, nextFinding] of nextByKey) {
    const prevFinding = prevByKey.get(key);
    if (!prevFinding) continue;
    if (prevFinding.severity === nextFinding.severity) {
      unchangedCount++;
      continue;
    }
    severityShifts.push({
      key,
      title: nextFinding.title,
      from: prevFinding.severity,
      to: nextFinding.severity,
      worsened:
        SEVERITY_RANK[nextFinding.severity] > SEVERITY_RANK[prevFinding.severity],
    });
  }

  const wasteDelta =
    next.summary.estimatedMonthlyWaste - prev.summary.estimatedMonthlyWaste;

  return {
    accountId: next.accountId,
    fromRunId: prev.runId,
    toRunId: next.runId,
    firstRun: false,
    newFindings,
    resolvedFindings,
    severityShifts,
    wasteDelta,
    unchangedCount,
    actionable:
      newFindings.length > 0 ||
      severityShifts.some((s) => s.worsened) ||
      // A resolved finding is good news but still worth a look — it confirms
      // an applied fix landed (or that data shifted under us).
      resolvedFindings.length > 0,
  };
}
