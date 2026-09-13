/**
 * The negatives change-set, two tiers (src/lib/changesets/negatives.ts):
 *   Tier 1 — exact term negatives: safe, downloadable as Editor CSV.
 *   Tier 2 — phrase signal negatives: review list, cautions inline.
 * Server-safe. Wide tables scroll inside their own container.
 */

import Link from "next/link";
import type { NegativeChangeSet } from "@/lib/changesets/negatives";
import { buttonClasses } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill, SectionTitle } from "./chrome";
import { formatInt, formatMoney } from "./format";

export function ChangeSetPanel({
  accountId,
  accountName,
  currency,
  changeSet,
  exportHref,
}: {
  accountId: string;
  accountName: string;
  currency: string;
  changeSet: NegativeChangeSet;
  exportHref: string;
}) {
  const { termNegatives, signalNegatives, totalWasteInWindow, windowDays } = changeSet;
  const empty = termNegatives.length === 0 && signalNegatives.length === 0;

  return (
    <GlassPanel as="section" padding="md" aria-labelledby={`cs-${accountId}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 id={`cs-${accountId}`} className="text-lg font-bold tracking-tight">
            <Link
              href={`/accounts/${encodeURIComponent(accountId)}?pack=${encodeURIComponent(changeSet.packId)}`}
              className="transition-colors duration-150 ease-brand hover:text-lime-500"
            >
              {accountName}
            </Link>
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/55">
            <span className="font-mono">{accountId}</span>
            <Pill mono>{changeSet.packId}</Pill>
            <span className="numerals">
              {formatMoney(totalWasteInWindow, currency)} matched junk in {windowDays}d
            </span>
          </p>
        </div>
        {termNegatives.length > 0 && (
          <a
            href={exportHref}
            download
            className={buttonClasses({ variant: "primary", size: "sm", className: "sm:shrink-0" })}
          >
            Download Editor CSV ({termNegatives.length})
          </a>
        )}
      </div>

      {empty ? (
        <p className="mt-5 text-sm text-white/60">
          No search terms matched this pack&apos;s junk-lead signals in the window. Either the account
          is clean or <span className="font-mono">search_terms</span> data is missing.
        </p>
      ) : (
        <>
          <SectionTitle className="mt-6" count={termNegatives.length}>
            Tier 1 — exact term negatives <span className="text-sm font-normal text-white/50">(safe to apply)</span>
          </SectionTitle>
          {termNegatives.length === 0 ? (
            <p className="text-sm text-white/60">None.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-eyebrow text-white/55">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold">Campaign</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Keyword</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Match</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Signal</th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">Clicks</th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {termNegatives.map((n, i) => (
                    <tr key={`${n.campaignName}-${n.keyword}-${i}`}>
                      <td className="max-w-[14rem] truncate px-3 py-2 text-white/75">{n.campaignName}</td>
                      <td className="px-3 py-2 font-medium">{n.keyword}</td>
                      <td className="px-3 py-2 font-mono text-xs text-white/60">{n.matchType}</td>
                      <td className="px-3 py-2 font-mono text-xs text-white/60">{n.matchedSignal}</td>
                      <td className="numerals px-3 py-2 text-right">{formatInt(n.clicks)}</td>
                      <td className="numerals px-3 py-2 text-right text-red-300">
                        {formatMoney(n.cost, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <SectionTitle className="mt-8" count={signalNegatives.length}>
            Tier 2 — phrase signal negatives{" "}
            <span className="text-sm font-normal text-white/50">(review required — can overblock)</span>
          </SectionTitle>
          {signalNegatives.length === 0 ? (
            <p className="text-sm text-white/60">None.</p>
          ) : (
            <ul className="space-y-3">
              {signalNegatives.map((s) => (
                <li key={s.keyword} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold">&quot;{s.keyword}&quot;</span>
                    <Pill mono>{s.matchType}</Pill>
                    <span className="numerals ml-auto text-sm text-red-300">
                      {formatMoney(s.totalCost, currency)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">
                    Matched: {s.matchedTerms.join(" · ")}
                  </p>
                  {s.caution && (
                    <p className="mt-2 rounded-lg border border-red-400/30 bg-red-500/5 px-3 py-2 text-xs text-red-300">
                      Caution: {s.caution}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </GlassPanel>
  );
}
