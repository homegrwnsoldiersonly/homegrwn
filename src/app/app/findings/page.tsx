/**
 * Findings — every finding across the active tenant's accounts, filterable
 * by severity / pack / category / account via the URL. Filtering happens
 * here on the server; the FindingsFilters client component only writes the
 * query string.
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { PACKS } from "@/lib/knowledge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
  EmptyState,
  FindingRow,
  FindingsFilters,
  PageFrame,
  PageHeader,
  Pill,
  SectionTitle,
} from "@/components/app";
import { requireSession } from "../_lib/auth";
import {
  applyFindingFilter,
  flattenFindings,
  isFilterActive,
  parseFindingFilter,
  sortFindings,
  summarizeAccounts,
} from "../_lib/findings";
import { getActiveTenant, loadTenantAccounts } from "../_lib/tenants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Findings" };

export default async function FindingsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireSession();
  const filter = parseFindingFilter(await props.searchParams);
  const { active } = await getActiveTenant();
  const accounts = active ? await loadTenantAccounts(active) : [];
  const summary = summarizeAccounts(accounts);

  const all = sortFindings(flattenFindings(accounts));
  const shown = applyFindingFilter(all, filter);
  const filtering = isFilterActive(filter);

  const packOptions = summary.packs.map((id) => ({ value: id, label: PACKS[id]?.label ?? id }));
  const categoryOptions = summary.categories.map((c) => ({ value: c, label: c }));
  const accountOptions = accounts.map((a) => ({ value: a.accountId, label: a.snapshot.accountName }));

  return (
    <PageFrame>
      <PageHeader
        eyebrow="Findings"
        title={active ? active.name : "No tenants"}
        meta={
          active && (
            <span className="flex flex-wrap items-center gap-2">
              <Pill mono>{active.kind}</Pill>
              <span className="numerals">
                {shown.length}
                {filtering ? ` of ${all.length}` : ""} finding{all.length === 1 ? "" : "s"} across{" "}
                {accounts.length} account{accounts.length === 1 ? "" : "s"}
              </span>
            </span>
          )
        }
      />

      <GlassPanel padding="sm">
        <Suspense fallback={<div className="h-20" aria-hidden />}>
          <FindingsFilters packs={packOptions} categories={categoryOptions} accounts={accountOptions} />
        </Suspense>
      </GlassPanel>

      {all.length === 0 ? (
        <EmptyState
          title="No findings in this tenant."
          body={
            accounts.length === 0
              ? "The tenant has no loadable accounts."
              : "Every account passes its pack's rules."
          }
        />
      ) : shown.length === 0 ? (
        <EmptyState title="Nothing matches these filters." body="Clear a filter to widen the list." />
      ) : (
        <GlassPanel as="section" aria-labelledby="list-title">
          <SectionTitle count={shown.length}>
            <span id="list-title">{filtering ? "Filtered findings" : "All findings"}</span>
          </SectionTitle>
          <ol className="divide-y divide-white/10">
            {shown.map((r) => (
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
        </GlassPanel>
      )}
    </PageFrame>
  );
}
