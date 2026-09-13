/**
 * Finding renderers: the full card (account page) and the compact row
 * (overview / findings list). Server-safe.
 */

import Link from "next/link";
import type { Finding } from "@/lib/knowledge/types";
import { cn } from "@/lib/cn";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill } from "./chrome";
import { formatMoney } from "./format";
import { SEVERITY_STYLES, SeverityBadge } from "./severity";

export function FindingCard({
  finding,
  index,
  currency,
  className,
}: {
  finding: Finding;
  index: number;
  currency: string;
  className?: string;
}) {
  const s = SEVERITY_STYLES[finding.severity];
  return (
    <GlassPanel
      as="article"
      padding="md"
      className={cn("border-l-2", s.border, className)}
      aria-label={finding.title}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="numerals text-xs text-white/40">#{index + 1}</span>
        <SeverityBadge severity={finding.severity} />
        <Pill mono>{finding.category}</Pill>
        <span className="numerals text-xs text-white/40">
          conf {Math.round(finding.confidence * 100)}%
        </span>
        {finding.estimatedMonthlyWaste ? (
          <span className="numerals ml-auto text-sm font-semibold text-red-300">
            ~{formatMoney(finding.estimatedMonthlyWaste, currency)}/mo at risk
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-md font-bold tracking-tight">{finding.title}</h3>
      <p className="mt-1 text-sm text-white/70">{finding.summary}</p>

      {finding.evidence.length > 0 && (
        <ul className="mt-4 space-y-1 border-l-2 border-white/10 pl-4">
          {finding.evidence.map((e, i) => (
            <li key={i} className="numerals text-xs text-white/60">
              {e}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-xl border border-lime-500/20 bg-lime-500/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-eyebrow text-lime-500">
          Recommendation
        </div>
        <p className="mt-1 text-sm text-white/85">{finding.recommendation}</p>
      </div>

      <p className="mt-3 text-sm text-white/55">
        <span className="font-semibold text-white/75">Why it matters in this niche: </span>
        {finding.nicheRationale}
      </p>
      <p className="mt-2 font-mono text-xs text-white/35">{finding.ruleId}</p>
    </GlassPanel>
  );
}

export function FindingRow({
  finding,
  accountId,
  accountName,
  currency,
  packId,
  showAccount = true,
}: {
  finding: Finding;
  accountId: string;
  accountName: string;
  currency: string;
  packId: string;
  showAccount?: boolean;
}) {
  const s = SEVERITY_STYLES[finding.severity];
  return (
    <li className={cn("border-l-2 py-3 pl-4 first:pt-0 last:pb-0", s.border)}>
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={finding.severity} />
        <Pill mono>{finding.category}</Pill>
        {finding.estimatedMonthlyWaste ? (
          <span className="numerals ml-auto text-sm font-semibold text-red-300">
            ~{formatMoney(finding.estimatedMonthlyWaste, currency)}/mo
          </span>
        ) : null}
      </div>
      <Link
        href={`/accounts/${encodeURIComponent(accountId)}?pack=${encodeURIComponent(packId)}`}
        className="mt-2 block text-sm font-semibold transition-colors duration-150 ease-brand hover:text-lime-500"
      >
        {finding.title}
      </Link>
      {showAccount && (
        <p className="mt-1 truncate text-xs text-white/50">
          {accountName} <span className="font-mono text-white/35">· {accountId}</span>
        </p>
      )}
    </li>
  );
}
