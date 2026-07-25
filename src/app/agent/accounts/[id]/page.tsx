/**
 * Internal cockpit: one account's audit report, rendered through a chosen
 * niche pack. Server Component; `params`/`searchParams` are Promises in
 * Next 16 and are awaited via the generated PageProps helper.
 *
 * Recommend-only: this page renders findings for a human to act on. It has no
 * mutating actions by design.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDataSource } from "@/lib/ads";
import {
  audit,
  PACKS,
  resolvePack,
  selectablePacks,
  suggestPackId,
} from "@/lib/knowledge";
import { FindingCard, formatMoney, SeverityBadge, Stat } from "../../ui";

export const metadata: Metadata = {
  title: "Account Audit — HOMEGRWN Agent",
  robots: { index: false, follow: false },
};

export default async function AccountAuditPage(
  props: PageProps<"/agent/accounts/[id]">,
) {
  const { id } = await props.params;
  const { pack: packParam } = await props.searchParams;

  const source = await getDataSource();
  let snapshot;
  try {
    snapshot = await source.fetchAccountSnapshot(id);
  } catch {
    notFound();
  }

  const packs = selectablePacks();
  const requested = typeof packParam === "string" ? packParam : undefined;
  const packId =
    requested && PACKS[requested] && PACKS[requested].category !== "base"
      ? requested
      : (suggestPackId(snapshot) ?? packs[0].id);

  const report = audit(snapshot, packId);
  const resolved = resolvePack(packId, PACKS);
  const { bySeverity, estimatedMonthlyWaste } = report.summary;

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/agent" className="text-gray-500 hover:text-orange-400">
          ← All accounts
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-3xl font-extrabold text-white">
            {report.accountName}
          </h1>
          <span className="font-mono text-xs text-gray-500">
            {report.accountId}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Pack lineage:{" "}
          <span className="font-mono text-gray-300">
            {report.packLineage.join(" → ")}
          </span>
        </p>

        {/* Pack switcher — plain links, no client JS. */}
        <div className="mt-4 flex flex-wrap gap-2">
          {packs.map((p) => (
            <Link
              key={p.id}
              href={`/agent/accounts/${id}?pack=${p.id}`}
              className={
                p.id === packId
                  ? "rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white"
                  : "rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400 hover:border-orange-500 hover:text-orange-400"
              }
            >
              {p.label}
            </Link>
          ))}
        </div>
      </header>

      <section className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Monthly spend"
          value={formatMoney(report.generatedFor.monthlySpend, snapshot.currency)}
        />
        <Stat label="Window" value={`${report.generatedFor.windowDays} days`} />
        <Stat label="Findings" value={String(report.findings.length)} />
        <Stat
          label="Est. monthly waste"
          value={
            estimatedMonthlyWaste > 0
              ? `~${formatMoney(estimatedMonthlyWaste, snapshot.currency)}`
              : "—"
          }
        />
      </section>

      <section className="mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-white">Findings</h2>
          <span className="flex gap-2 text-xs text-gray-500">
            {bySeverity.critical > 0 && <span>{bySeverity.critical} critical</span>}
            {bySeverity.high > 0 && <span>{bySeverity.high} high</span>}
            {bySeverity.medium > 0 && <span>{bySeverity.medium} medium</span>}
            {bySeverity.low > 0 && <span>{bySeverity.low} low</span>}
          </span>
        </div>

        {report.findings.length === 0 ? (
          <p className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-sm text-gray-400">
            No findings — this account passes every rule in the{" "}
            <span className="font-mono">{packId}</span> pack.
          </p>
        ) : (
          <div className="space-y-4">
            {report.findings.map((f, i) => (
              <FindingCard
                key={`${f.ruleId}-${i}`}
                finding={f}
                index={i}
                currency={snapshot.currency}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-white">
          Guardrails in force
        </h2>
        <ul className="space-y-3">
          {resolved.guardrails.map((g) => (
            <li
              key={g.id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-4"
            >
              <p className="text-sm font-semibold text-gray-200">
                {g.principle}
              </p>
              <p className="mt-1 text-xs text-gray-500">{g.rationale}</p>
            </li>
          ))}
        </ul>
      </section>

      {resolved.redFlags.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-white">
            Red flags to watch (operator judgment)
          </h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-gray-400">
            {resolved.redFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </section>
      )}

      <footer className="border-t border-gray-800 pt-6 text-xs text-gray-600">
        Recommend-only: nothing on this page is auto-applied. A human decides.{" "}
        <SeverityBadge severity="low" /> severity findings are informational.
      </footer>
    </main>
  );
}
