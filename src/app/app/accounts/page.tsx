/** Accounts — every account in the active tenant. Server Component. */

import type { Metadata } from "next";
import { AccountCard, EmptyState, PageFrame, PageHeader, Pill } from "@/components/app";
import { requireSession } from "../_lib/auth";
import { getActiveTenant, loadTenantAccounts } from "../_lib/tenants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Accounts" };

export default async function AccountsPage() {
  await requireSession();
  const { active } = await getActiveTenant();
  const accounts = active ? await loadTenantAccounts(active) : [];

  return (
    <PageFrame>
      <PageHeader
        eyebrow="Accounts"
        title={active ? active.name : "No tenants"}
        meta={
          active && (
            <span className="flex flex-wrap items-center gap-2">
              <Pill mono>{active.kind}</Pill>
              <span className="numerals">
                {accounts.length} account{accounts.length === 1 ? "" : "s"}
              </span>
            </span>
          )
        }
      />
      {accounts.length === 0 ? (
        <EmptyState
          title="No accounts in this tenant."
          body={active?.note ?? "Switch tenant, add credentials, or drop a CSV export into data/case-studies/."}
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((a) => (
            <AccountCard key={a.accountId} {...a} />
          ))}
        </ul>
      )}
    </PageFrame>
  );
}
