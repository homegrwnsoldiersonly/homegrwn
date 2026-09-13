/**
 * History — persisted audit runs per account (src/lib/history). The store
 * is the filesystem adapter under .data/audit-history (AUDIT_HISTORY_DIR);
 * on serverless hosts it is ephemeral, so an empty state here is honest,
 * not a bug. Runs are written by /api/cron/audit and scripts/audit-all.ts.
 */

import type { Metadata } from "next";
import { FsHistoryStore } from "@/lib/history/fs-store";
import type { StoredAuditRun } from "@/lib/history/types";
import { EmptyState, PageFrame, PageHeader, Pill, RunList } from "@/components/app";
import { requireSession } from "../_lib/auth";
import { getActiveTenant, loadTenantAccounts } from "../_lib/tenants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "History" };

const RUNS_PER_ACCOUNT = 20;

export default async function HistoryPage() {
  await requireSession();
  const { active } = await getActiveTenant();
  const accounts = active ? await loadTenantAccounts(active) : [];

  const store = new FsHistoryStore();
  const histories: Array<{ accountId: string; accountName: string; currency: string; runs: StoredAuditRun[] }> = [];
  let storeError: string | undefined;
  for (const a of accounts) {
    try {
      const runs = await store.list(a.accountId, RUNS_PER_ACCOUNT);
      histories.push({
        accountId: a.accountId,
        accountName: a.snapshot.accountName,
        currency: a.snapshot.currency,
        runs,
      });
    } catch (err) {
      storeError = err instanceof Error ? err.message : String(err);
    }
  }
  const withRuns = histories.filter((h) => h.runs.length > 0);
  const totalRuns = withRuns.reduce((s, h) => s + h.runs.length, 0);

  return (
    <PageFrame>
      <PageHeader
        eyebrow="History"
        title={active ? active.name : "No tenants"}
        meta={
          active && (
            <span className="flex flex-wrap items-center gap-2">
              <Pill mono>{active.kind}</Pill>
              <span className="numerals">
                {totalRuns} run{totalRuns === 1 ? "" : "s"} across {withRuns.length} of {accounts.length}{" "}
                account{accounts.length === 1 ? "" : "s"}
              </span>
            </span>
          )
        }
      />

      {storeError && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          History store error: {storeError}
        </p>
      )}

      {withRuns.length === 0 ? (
        <EmptyState
          title="No audit runs recorded for this tenant."
          body={
            <>
              <p>
                Runs are written to <span className="font-mono">.data/audit-history/</span> (
                <span className="font-mono">AUDIT_HISTORY_DIR</span>) by the scheduled endpoint{" "}
                <span className="font-mono">GET /api/cron/audit</span> or locally with{" "}
                <span className="font-mono">npx tsx scripts/audit-all.ts</span>. Run it twice to see a
                diff.
              </p>
              <p className="mt-2">
                On serverless hosts the filesystem store is ephemeral, so this view stays empty until a
                KV/Postgres <span className="font-mono">HistoryStore</span> adapter is dropped in.
              </p>
            </>
          }
        />
      ) : (
        withRuns.map((h) => <RunList key={h.accountId} {...h} />)
      )}

      {withRuns.length > 0 && withRuns.length < accounts.length && (
        <p className="text-xs text-white/50">
          {accounts.length - withRuns.length} account{accounts.length - withRuns.length === 1 ? " has" : "s have"} no
          recorded runs yet.
        </p>
      )}
    </PageFrame>
  );
}
