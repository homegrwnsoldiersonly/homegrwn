/**
 * Overview — the active tenant at a glance: KPI tiles (mono), severity
 * distribution, the accounts in the tenant, and the top findings across
 * them. Server Component; force-dynamic so a credential or CSV drop shows up
 * on the next request, never after a redeploy.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Stat } from "@/components/ui/Stat";
import {
  AccountCard,
  EmptyState,
  FindingRow,
  PageFrame,
  PageHeader,
  PartialDataNotice,
  Pill,
  SectionTitle,
  SeverityBar,
  formatInt,
  formatMoney,
} from "@/components/app";
import { requireSession } from "./_lib/auth";
import { flattenFindings, sortFindings, summarizeAccounts } from "./_lib/findings";
import { getActiveTenant, loadTenantAccounts } from "./_lib/tenants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Overview" };

const TOP_FINDINGS = 6;

export default async function OverviewPage() {
  await requireSession();
  const { active } = await getActiveTenant();

  if (!active) {
    return (
      <PageFrame>
        <PageHeader eyebrow="Overview" title="No tenants yet" />
        <EmptyState
          title="Nothing to report."
          body="Add Google Ads credentials (.env.local) or drop a CSV export into data/case-studies/<tenant>/ — see data/case-studies/README.md."
        />
      </PageFrame>
    );
  }

  const accounts = await loadTenantAccounts(active);
  const summary = summarizeAccounts(accounts);
  const top = sortFindings(flattenFindings(accounts)).slice(0, TOP_FINDINGS);
  const partialIngests = accounts.filter((a) => a.ingest?.partial || (a.ingest?.warnings.length ?? 0) > 0);

  return (
    <PageFrame>
      <PageHeader
        eyebrow="Overview"
        title={active.name}
        meta={
          <span className="flex flex-wrap items-center gap-2">
            <Pill mono>{active.kind}</Pill>
            <span className="numerals">
              {summary.accounts} account{summary.accounts === 1 ? "" : "s"}
            </span>
            {summary.packs.length > 0 && (
              <span className="font-mono text-xs text-white/45">{summary.packs.join(" · ")}</span>
            )}
          </span>
        }
      />

      {partialIngests.map((a) => (
        <PartialDataNotice key={a.accountId} ingest={a.ingest!} />
      ))}

      {accounts.length === 0 ? (
        <EmptyState
          title="This tenant has no loadable accounts."
          body={
            active.note ??
            "The source listed no accounts, or every account failed to load. Check the data source and try again."
          }
        />
      ) : (
        <>
          <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat
              tone="glass"
              size="md"
              label="Monthly spend"
              value={formatMoney(summary.monthlySpend, summary.currency)}
              hint="normalized to 30 days"
            />
            <Stat
              tone="glass"
              size="md"
              label="Findings"
              value={formatInt(summary.findings)}
              hint={`${summary.bySeverity.critical} critical · ${summary.bySeverity.high} high`}
            />
            <Stat
              tone="glass"
              size="md"
              label="Est. monthly waste"
              value={
                summary.estimatedMonthlyWaste > 0
                  ? `~${formatMoney(summary.estimatedMonthlyWaste, summary.currency)}`
                  : "—"
              }
              hint={
                summary.monthlySpend > 0 && summary.estimatedMonthlyWaste > 0
                  ? `${Math.round((summary.estimatedMonthlyWaste / summary.monthlySpend) * 100)}% of spend`
                  : "rule estimates, not measured"
              }
            />
            <Stat tone="glass" size="md" label="Accounts" value={formatInt(summary.accounts)} />
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <GlassPanel as="section" aria-labelledby="sev-title">
              <SectionTitle>
                <span id="sev-title">Severity distribution</span>
              </SectionTitle>
              <SeverityBar counts={summary.bySeverity} />
            </GlassPanel>

            <section aria-labelledby="acct-title">
              <SectionTitle
                count={accounts.length}
                action={
                  <Link href="/accounts" className="text-sm text-white/60 hover:text-lime-500">
                    All accounts →
                  </Link>
                }
              >
                <span id="acct-title">Accounts</span>
              </SectionTitle>
              <ul className="grid gap-3 sm:grid-cols-2">
                {accounts.map((a) => (
                  <AccountCard key={a.accountId} {...a} />
                ))}
              </ul>
            </section>
          </div>

          <GlassPanel as="section" aria-labelledby="top-title">
            <SectionTitle
              count={summary.findings}
              action={
                <Link href="/findings" className="text-sm text-white/60 hover:text-lime-500">
                  All findings →
                </Link>
              }
            >
              <span id="top-title">Top findings</span>
            </SectionTitle>
            {top.length === 0 ? (
              <p className="text-sm text-white/60">
                No findings — every account in this tenant passes its pack&apos;s rules.
              </p>
            ) : (
              <ol className="divide-y divide-white/10">
                {top.map((r) => (
                  <FindingRow
                    key={`${r.accountId}-${r.finding.ruleId}-${r.finding.title}`}
                    finding={r.finding}
                    accountId={r.accountId}
                    accountName={r.accountName}
                    currency={r.currency}
                    packId={r.packId}
                    showAccount={accounts.length > 1}
                  />
                ))}
              </ol>
            )}
          </GlassPanel>
        </>
      )}
    </PageFrame>
  );
}
