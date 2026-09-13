/**
 * One account's audit report through a chosen niche pack. Server Component;
 * `params`/`searchParams` are Promises (Next 16) via the generated PageProps.
 *
 * Recommend-only: findings for a human to act on; no mutating actions.
 * The account id resolves across every source (fixture → csv → live), so
 * the page works regardless of which tenant is active.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PACKS, resolvePack, selectablePacks } from "@/lib/knowledge";
import { buildNegativeChangeSet } from "@/lib/changesets/negatives";
import { buttonClasses } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Stat } from "@/components/ui/Stat";
import {
  FindingCard,
  PageFrame,
  PageHeader,
  PartialDataNotice,
  Pill,
  SectionTitle,
  SeverityBadge,
  formatInt,
  formatMoney,
} from "@/components/app";
import { requireSession } from "../../_lib/auth";
import { loadAccount } from "../../_lib/tenants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Account audit" };

export default async function AccountAuditPage(props: PageProps<"/app/accounts/[id]">) {
  await requireSession();
  const { id } = await props.params;
  const { pack: packParam } = await props.searchParams;
  const requested = typeof packParam === "string" ? packParam : undefined;

  const account = await loadAccount(id, requested);
  if (!account) notFound();

  const { snapshot, packId, report, ingest } = account;
  const resolved = resolvePack(packId, PACKS);
  const packs = selectablePacks();
  const { bySeverity, estimatedMonthlyWaste } = report.summary;
  const changeSet = buildNegativeChangeSet(snapshot, resolved);
  const exportHref = `/changes/${encodeURIComponent(id)}/export?pack=${encodeURIComponent(packId)}`;

  return (
    <PageFrame>
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/accounts" className="text-white/55 transition-colors duration-150 ease-brand hover:text-lime-500">
          ← Accounts
        </Link>
      </nav>

      <PageHeader
        eyebrow="Account audit"
        title={report.accountName}
        meta={
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono">{report.accountId}</span>
            <Pill mono>{account.kind}</Pill>
            <span className="font-mono text-xs text-white/45">{report.packLineage.join(" → ")}</span>
          </span>
        }
      />

      {ingest && <PartialDataNotice ingest={ingest} />}

      {/* Pack switcher — plain links, no client JS. */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Niche pack">
        {packs.map((p) => (
          <Link
            key={p.id}
            href={`/accounts/${encodeURIComponent(id)}?pack=${encodeURIComponent(p.id)}`}
            aria-current={p.id === packId ? "true" : undefined}
            className={
              p.id === packId
                ? "rounded-full bg-lime-500 px-3 py-1 text-xs font-semibold text-ink-950"
                : "rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition-colors duration-150 ease-brand hover:border-lime-500 hover:text-lime-500"
            }
          >
            {p.label}
          </Link>
        ))}
      </div>

      <section aria-label="Account metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          tone="glass"
          label="Monthly spend"
          value={formatMoney(report.generatedFor.monthlySpend, snapshot.currency)}
        />
        <Stat tone="glass" label="Window" value={formatInt(report.generatedFor.windowDays)} unit="days" />
        <Stat
          tone="glass"
          label="Findings"
          value={formatInt(report.findings.length)}
          hint={`${bySeverity.critical} critical · ${bySeverity.high} high · ${bySeverity.medium} med · ${bySeverity.low} low`}
        />
        <Stat
          tone="glass"
          label="Est. monthly waste"
          value={estimatedMonthlyWaste > 0 ? `~${formatMoney(estimatedMonthlyWaste, snapshot.currency)}` : "—"}
        />
      </section>

      <section aria-labelledby="findings-title">
        <SectionTitle count={report.findings.length}>
          <span id="findings-title">Findings</span>
        </SectionTitle>
        {report.findings.length === 0 ? (
          <GlassPanel>
            <p className="text-sm text-white/70">
              No findings — this account passes every rule in the{" "}
              <span className="font-mono">{packId}</span> pack.
            </p>
          </GlassPanel>
        ) : (
          <div className="space-y-4">
            {report.findings.map((f, i) => (
              <FindingCard key={`${f.ruleId}-${i}`} finding={f} index={i} currency={snapshot.currency} />
            ))}
          </div>
        )}
      </section>

      <GlassPanel as="section" aria-labelledby="changes-title">
        <SectionTitle
          action={
            <Link href={`/changes?account=${encodeURIComponent(id)}`} className="text-sm text-white/60 hover:text-lime-500">
              Review change-set →
            </Link>
          }
        >
          <span id="changes-title">Proposed changes</span>
        </SectionTitle>
        {changeSet.termNegatives.length === 0 && changeSet.signalNegatives.length === 0 ? (
          <p className="text-sm text-white/60">
            No negative-keyword change-set: no search term matched this pack&apos;s junk signals.
          </p>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/75">
              <span className="numerals font-semibold">{changeSet.termNegatives.length}</span> exact term
              negatives (safe) ·{" "}
              <span className="numerals font-semibold">{changeSet.signalNegatives.length}</span> phrase
              signals (review) ·{" "}
              <span className="numerals text-red-300">
                {formatMoney(changeSet.totalWasteInWindow, snapshot.currency)}
              </span>{" "}
              matched in {changeSet.windowDays}d
            </p>
            {changeSet.termNegatives.length > 0 && (
              <a href={exportHref} download className={buttonClasses({ variant: "secondary", size: "sm" })}>
                Download Editor CSV
              </a>
            )}
          </div>
        )}
      </GlassPanel>

      <GlassPanel as="section" aria-labelledby="guardrails-title">
        <SectionTitle count={resolved.guardrails.length}>
          <span id="guardrails-title">Guardrails in force</span>
        </SectionTitle>
        <ul className="divide-y divide-white/10">
          {resolved.guardrails.map((g) => (
            <li key={g.id} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold text-white/90">{g.principle}</p>
              <p className="mt-1 text-xs text-white/55">{g.rationale}</p>
            </li>
          ))}
        </ul>
      </GlassPanel>

      {resolved.redFlags.length > 0 && (
        <GlassPanel as="section" aria-labelledby="redflags-title">
          <SectionTitle count={resolved.redFlags.length}>
            <span id="redflags-title">Red flags to watch</span>{" "}
            <span className="text-sm font-normal text-white/50">(operator judgment)</span>
          </SectionTitle>
          <ul className="list-inside list-disc space-y-2 text-sm text-white/70">
            {resolved.redFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </GlassPanel>
      )}

      <footer className="border-t border-white/10 pt-6 text-xs text-white/50">
        Recommend-only: nothing on this page is auto-applied. A human decides.{" "}
        <SeverityBadge severity="low" className="align-middle" /> findings are informational.
      </footer>
    </PageFrame>
  );
}
