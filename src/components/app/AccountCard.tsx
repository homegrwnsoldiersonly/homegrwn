import Link from "next/link";
import type { AuditReport, AccountSnapshot } from "@/lib/knowledge/types";
import type { CsvIngestMeta } from "@/lib/ads/csv-datasource";
import { Pill } from "./chrome";
import { formatMoney } from "./format";
import { SEVERITY_STYLES } from "./severity";

/** One account inside a tenant — links to its full report. */
export function AccountCard({
  accountId,
  snapshot,
  packId,
  report,
  ingest,
}: {
  accountId: string;
  snapshot: AccountSnapshot;
  packId: string;
  report: AuditReport;
  ingest?: CsvIngestMeta;
}) {
  const { critical, high } = report.summary.bySeverity;
  return (
    <li>
      <Link
        href={`/accounts/${encodeURIComponent(accountId)}?pack=${encodeURIComponent(packId)}`}
        className="glass block rounded-2xl p-5 transition-[border-color,background-color] duration-150 ease-brand hover:border-lime-500/60 hover:bg-white/[0.07]"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="min-w-0 truncate text-md font-bold tracking-tight">{snapshot.accountName}</h3>
          <span className="font-mono text-xs text-white/45">{accountId}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
          <span className="numerals">{formatMoney(snapshot.monthlySpend, snapshot.currency)}/mo</span>
          <Pill mono>{packId}</Pill>
          {ingest?.partial && <Pill tone="warn">Partial data</Pill>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {critical > 0 && (
            <span className={`rounded-full px-2 py-0.5 font-semibold ring-1 ${SEVERITY_STYLES.critical.badge}`}>
              {critical} critical
            </span>
          )}
          {high > 0 && (
            <span className={`rounded-full px-2 py-0.5 font-semibold ring-1 ${SEVERITY_STYLES.high.badge}`}>
              {high} high
            </span>
          )}
          <span className="numerals text-white/50">{report.findings.length} findings</span>
          {report.summary.estimatedMonthlyWaste > 0 && (
            <span className="numerals ml-auto text-red-300">
              ~{formatMoney(report.summary.estimatedMonthlyWaste, snapshot.currency)}/mo at risk
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}
