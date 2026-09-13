/**
 * Changes — the negatives change-set for every account in the active tenant
 * (or one account via ?account=). Two tiers from src/lib/changesets; the
 * safe tier downloads as Google Ads Editor CSV through the export route.
 * Human applies it — no API write path exists (docs/control-architecture.md).
 */

import Link from "next/link";
import type { Metadata } from "next";
import { PACKS, resolvePack } from "@/lib/knowledge";
import { buildNegativeChangeSet } from "@/lib/changesets/negatives";
import { ChangeSetPanel, EmptyState, PageFrame, PageHeader, Pill } from "@/components/app";
import { requireSession } from "../_lib/auth";
import { getActiveTenant, loadTenantAccounts } from "../_lib/tenants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Changes" };

export default async function ChangesPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireSession();
  const sp = await props.searchParams;
  const only = typeof sp.account === "string" && sp.account.trim() !== "" ? sp.account.trim() : undefined;

  const { active } = await getActiveTenant();
  const accounts = active ? await loadTenantAccounts(active) : [];
  const shown = only ? accounts.filter((a) => a.accountId === only) : accounts;

  const changeSets = shown.map((a) => ({
    account: a,
    changeSet: buildNegativeChangeSet(a.snapshot, resolvePack(a.packId, PACKS)),
  }));
  const totalTerms = changeSets.reduce((s, c) => s + c.changeSet.termNegatives.length, 0);
  const totalSignals = changeSets.reduce((s, c) => s + c.changeSet.signalNegatives.length, 0);

  return (
    <PageFrame>
      <PageHeader
        eyebrow="Changes"
        title={active ? active.name : "No tenants"}
        meta={
          active && (
            <span className="flex flex-wrap items-center gap-2">
              <Pill mono>{active.kind}</Pill>
              <span className="numerals">
                {totalTerms} exact negatives · {totalSignals} phrase signals
              </span>
              {only && (
                <Link href="/changes" className="text-xs text-white/55 hover:text-lime-500">
                  Show all accounts
                </Link>
              )}
            </span>
          )
        }
      />

      <p className="max-w-prose text-sm text-white/60">
        Tier 1 blocks exactly the search terms that already spent money on junk-lead signals — apply
        as-is. Tier 2 blocks the signal words themselves: much wider reach, can overblock good
        queries, so it is a review list, never an import artifact.
      </p>

      {shown.length === 0 ? (
        <EmptyState
          title={only ? "That account is not in this tenant." : "No accounts in this tenant."}
          body={only ? "Switch tenant, or clear the account filter." : active?.note}
          action={
            only && (
              <Link href="/changes" className="text-sm text-lime-500">
                Show all accounts
              </Link>
            )
          }
        />
      ) : (
        changeSets.map(({ account, changeSet }) => (
          <ChangeSetPanel
            key={account.accountId}
            accountId={account.accountId}
            accountName={account.snapshot.accountName}
            currency={account.snapshot.currency}
            changeSet={changeSet}
            exportHref={`/changes/${encodeURIComponent(account.accountId)}/export?pack=${encodeURIComponent(account.packId)}`}
          />
        ))
      )}
    </PageFrame>
  );
}
