/**
 * Audit-history timeline for one account: newest run first, each row diffed
 * against the run before it (src/lib/history/diff.ts). Server-safe.
 */

import Link from "next/link";
import { diffRuns } from "@/lib/history/diff";
import type { StoredAuditRun } from "@/lib/history/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill } from "./chrome";
import { formatDateTime, formatMoney, formatSignedMoney } from "./format";
import { SEVERITY_STYLES } from "./severity";

export function RunList({
  accountId,
  accountName,
  currency,
  runs,
}: {
  accountId: string;
  accountName: string;
  currency: string;
  /** Oldest → newest, as the store returns them. */
  runs: StoredAuditRun[];
}) {
  const rows = runs
    .map((run, i) => ({ run, diff: diffRuns(i > 0 ? runs[i - 1] : null, run) }))
    .reverse();

  return (
    <GlassPanel as="section" padding="md" aria-labelledby={`runs-${accountId}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`runs-${accountId}`} className="text-lg font-bold tracking-tight">
          <Link
            href={`/accounts/${encodeURIComponent(accountId)}`}
            className="transition-colors duration-150 ease-brand hover:text-lime-500"
          >
            {accountName}
          </Link>
        </h2>
        <span className="numerals text-xs text-white/50">
          {accountId} · {runs.length} run{runs.length === 1 ? "" : "s"}
        </span>
      </div>

      <ol className="mt-5 divide-y divide-white/10">
        {rows.map(({ run, diff }) => {
          const worsened = diff.severityShifts.filter((s) => s.worsened).length;
          const improved = diff.severityShifts.length - worsened;
          return (
            <li key={run.runId} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="numerals text-sm font-semibold">{formatDateTime(run.at)}</span>
                <Pill mono>{run.packId}</Pill>
                {diff.firstRun ? (
                  <Pill>baseline</Pill>
                ) : diff.actionable ? (
                  <Pill tone="warn">actionable</Pill>
                ) : (
                  <Pill>no change</Pill>
                )}
                <span className="numerals ml-auto text-xs text-white/60">
                  {run.findings.length} findings · ~{formatMoney(run.summary.estimatedMonthlyWaste, currency)}/mo
                  {!diff.firstRun && (
                    <span className={diff.wasteDelta > 0 ? "text-red-300" : diff.wasteDelta < 0 ? "text-lime-500" : "text-white/40"}>
                      {" "}({formatSignedMoney(diff.wasteDelta, currency)})
                    </span>
                  )}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {diff.firstRun ? (
                  <span className="text-white/55">First recorded run — nothing to diff against.</span>
                ) : (
                  <>
                    <Delta label="new" n={diff.newFindings.length} tone="bad" />
                    <Delta label="resolved" n={diff.resolvedFindings.length} tone="good" />
                    <Delta label="worsened" n={worsened} tone="bad" />
                    <Delta label="improved" n={improved} tone="good" />
                    <span className="text-white/45">{diff.unchangedCount} unchanged</span>
                  </>
                )}
              </div>

              {(diff.newFindings.length > 0 || diff.resolvedFindings.length > 0) && !diff.firstRun && (
                <ul className="mt-3 space-y-1 border-l-2 border-white/10 pl-3 text-xs">
                  {diff.newFindings.map((f) => (
                    <li key={`n-${f.ruleId}-${f.title}`} className="flex items-center gap-2 text-white/75">
                      <span aria-hidden className={`size-1.5 rounded-full ${SEVERITY_STYLES[f.severity].dot}`} />
                      <span className="text-red-300">new</span> {f.title}
                    </li>
                  ))}
                  {diff.resolvedFindings.map((f) => (
                    <li key={`r-${f.ruleId}-${f.title}`} className="flex items-center gap-2 text-white/60">
                      <span aria-hidden className="size-1.5 rounded-full bg-lime-500" />
                      <span className="text-lime-500">resolved</span> {f.title}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </GlassPanel>
  );
}

function Delta({ label, n, tone }: { label: string; n: number; tone: "good" | "bad" }) {
  const color = n === 0 ? "text-white/45" : tone === "good" ? "text-lime-500" : "text-red-300";
  return (
    <span className={`numerals ${color}`}>
      {n} {label}
    </span>
  );
}
