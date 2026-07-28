/**
 * Presentational pieces for the internal agent cockpit. All Server-Component-
 * safe (no state, no handlers) — nothing in /agent ships client JS.
 */

import type { Finding, Severity } from "@/lib/knowledge/types";

export const SEVERITY_STYLES: Record<
  Severity,
  { badge: string; border: string; label: string }
> = {
  critical: {
    badge: "bg-red-500/15 text-red-400 ring-red-500/30",
    border: "border-red-500/40",
    label: "Critical",
  },
  high: {
    badge: "bg-orange-500/15 text-orange-400 ring-orange-500/30",
    border: "border-orange-500/40",
    label: "High",
  },
  medium: {
    badge: "bg-yellow-500/15 text-yellow-400 ring-yellow-500/30",
    border: "border-yellow-500/30",
    label: "Medium",
  },
  low: {
    badge: "bg-gray-500/15 text-gray-400 ring-gray-500/30",
    border: "border-gray-700",
    label: "Low",
  },
};

export function formatMoney(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const s = SEVERITY_STYLES[severity];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${s.badge}`}
    >
      {s.label}
    </span>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
      <div className="text-xs uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

export function FindingCard({
  finding,
  index,
  currency,
}: {
  finding: Finding;
  index: number;
  currency: string;
}) {
  const s = SEVERITY_STYLES[finding.severity];
  return (
    <article
      className={`rounded-2xl border ${s.border} bg-gray-900 p-6`}
      aria-label={finding.title}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-mono text-gray-600">#{index + 1}</span>
        <SeverityBadge severity={finding.severity} />
        <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400">
          {finding.category}
        </span>
        {finding.estimatedMonthlyWaste ? (
          <span className="ml-auto text-sm font-semibold text-red-400">
            ~{formatMoney(finding.estimatedMonthlyWaste, currency)}/mo at risk
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-lg font-bold text-white">{finding.title}</h3>
      <p className="mt-1 text-sm text-gray-400">{finding.summary}</p>

      {finding.evidence.length > 0 && (
        <ul className="mt-4 space-y-1 border-l-2 border-gray-800 pl-4">
          {finding.evidence.map((e, i) => (
            <li key={i} className="text-sm text-gray-500">
              {e}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-xl bg-gray-950 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">
          Recommendation
        </div>
        <p className="mt-1 text-sm text-gray-300">{finding.recommendation}</p>
      </div>

      <p className="mt-3 text-sm italic text-gray-500">
        <span className="font-semibold not-italic text-gray-400">
          Why it matters in this niche:{" "}
        </span>
        {finding.nicheRationale}
      </p>
    </article>
  );
}
