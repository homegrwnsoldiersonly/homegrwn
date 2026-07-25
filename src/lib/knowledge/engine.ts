/**
 * The reasoning engine. Pure and deterministic: it resolves a pack's
 * inheritance chain and runs every rule against an account snapshot, then
 * returns a prioritized, fully-explainable report.
 *
 * Recommend-only: nothing here mutates a Google Ads account. Findings carry a
 * recommendation string and a niche rationale; a human decides what to apply.
 */

import type {
  AccountSnapshot,
  AuditReport,
  Benchmark,
  Finding,
  Guardrail,
  NichePack,
  ResolvedPack,
  Rule,
  Severity,
} from "./types";

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

/** Dedupe a list of keyed items, keeping the last occurrence (child wins). */
function mergeById<T extends { id?: string; metric?: string }>(
  items: T[],
  key: (item: T) => string,
): T[] {
  const byKey = new Map<string, T>();
  for (const item of items) byKey.set(key(item), item);
  return [...byKey.values()];
}

/**
 * Flatten a pack's `extends` chain into a single resolved pack. Parents are
 * applied first, children override by id (rules/guardrails) or metric
 * (benchmarks). Conversion model and description fall through to the nearest
 * ancestor that defines them.
 */
export function resolvePack(
  packId: string,
  registry: Record<string, NichePack>,
): ResolvedPack {
  const chain: NichePack[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined = packId;

  while (cursor) {
    const pack: NichePack | undefined = registry[cursor];
    if (!pack) throw new Error(`Unknown knowledge pack: "${cursor}"`);
    if (seen.has(cursor)) {
      throw new Error(`Circular pack inheritance at "${cursor}"`);
    }
    seen.add(cursor);
    chain.unshift(pack); // root ancestor ends up first
    cursor = pack.extends;
  }

  const leaf = chain[chain.length - 1];
  const benchmarks: Benchmark[] = mergeById(
    chain.flatMap((p) => p.benchmarks),
    (b) => b.metric,
  );
  const rules: Rule[] = mergeById(
    chain.flatMap((p) => p.rules),
    (r) => r.id,
  );
  const guardrails: Guardrail[] = mergeById(
    chain.flatMap((p) => p.guardrails),
    (g) => g.id,
  );
  const redFlags = [...new Set(chain.flatMap((p) => p.redFlags))];
  const conversionModel = [...chain]
    .reverse()
    .find((p) => p.conversionModel)?.conversionModel;

  return {
    id: leaf.id,
    label: leaf.label,
    category: leaf.category,
    description: leaf.description,
    lineage: chain.map((p) => p.id),
    benchmarks,
    conversionModel,
    rules,
    guardrails,
    redFlags,
  };
}

function compareFindings(a: Finding, b: Finding): number {
  const sev = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
  if (sev !== 0) return sev;
  const waste = (b.estimatedMonthlyWaste ?? 0) - (a.estimatedMonthlyWaste ?? 0);
  if (waste !== 0) return waste;
  return b.confidence - a.confidence;
}

/** Run a resolved pack's rules against a snapshot and build the report. */
export function evaluateAccount(
  snapshot: AccountSnapshot,
  pack: ResolvedPack,
): AuditReport {
  const findings: Finding[] = [];
  for (const rule of pack.rules) {
    try {
      findings.push(...rule.evaluate({ snapshot, pack }));
    } catch (err) {
      // A misbehaving rule must never sink the whole audit.
      findings.push({
        ruleId: rule.id,
        title: `Rule error: ${rule.title}`,
        severity: "low",
        category: rule.category,
        confidence: 0,
        summary: `Rule "${rule.id}" threw during evaluation and was skipped.`,
        evidence: [String(err instanceof Error ? err.message : err)],
        recommendation: "Review the rule implementation.",
        nicheRationale: "Internal engine diagnostic.",
      });
    }
  }

  findings.sort(compareFindings);

  const bySeverity: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  let estimatedMonthlyWaste = 0;
  for (const f of findings) {
    bySeverity[f.severity] += 1;
    estimatedMonthlyWaste += f.estimatedMonthlyWaste ?? 0;
  }

  return {
    accountId: snapshot.accountId,
    accountName: snapshot.accountName,
    packId: pack.id,
    packLineage: pack.lineage,
    generatedFor: {
      monthlySpend: snapshot.monthlySpend,
      windowDays: snapshot.windowDays,
    },
    findings,
    summary: { bySeverity, estimatedMonthlyWaste },
  };
}

/** Convenience: resolve + evaluate in one call. */
export function auditAccount(
  snapshot: AccountSnapshot,
  packId: string,
  registry: Record<string, NichePack>,
): AuditReport {
  return evaluateAccount(snapshot, resolvePack(packId, registry));
}
