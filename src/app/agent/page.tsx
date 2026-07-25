/**
 * Internal cockpit: account list. Server Component, no client JS.
 *
 * force-dynamic (still supported with Cache Components off): the account list
 * must reflect the live datasource at request time, never a build-time
 * snapshot — otherwise adding credentials on Vercel would keep serving the
 * fixture list until the next deploy.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { getDataSource } from "@/lib/ads";
import { audit, selectablePacks, suggestPackId } from "@/lib/knowledge";
import { formatMoney, SEVERITY_STYLES } from "./ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agent Cockpit — HOMEGRWN",
  description: "Internal Google Ads audit agent. Recommend-only.",
  robots: { index: false, follow: false },
};

export default async function AgentHome() {
  const source = await getDataSource();
  const refs = await source.listAccounts();
  const packs = selectablePacks();

  const accounts = await Promise.all(
    refs.map(async ({ customerId }) => {
      const snapshot = await source.fetchAccountSnapshot(customerId);
      const packId = suggestPackId(snapshot) ?? packs[0].id;
      const report = audit(snapshot, packId);
      return { customerId, snapshot, packId, report };
    }),
  );

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
          Internal · Recommend-only
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">
          Agent Cockpit
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Data source:{" "}
          <span className="font-mono text-gray-300">{source.kind}</span>
          {source.kind === "fixture" && (
            <>
              {" "}
              — no Google Ads credentials configured. See{" "}
              <span className="font-mono">docs/google-ads-credentials.md</span>.
            </>
          )}
        </p>
      </header>

      <ul className="space-y-4">
        {accounts.map(({ customerId, snapshot, packId, report }) => {
          const { critical, high } = report.summary.bySeverity;
          return (
            <li key={customerId}>
              <Link
                href={`/agent/accounts/${customerId}?pack=${packId}`}
                className="block rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-orange-500"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {snapshot.accountName}
                  </h2>
                  <span className="font-mono text-xs text-gray-500">
                    {customerId}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span>
                    {formatMoney(snapshot.monthlySpend, snapshot.currency)}/mo
                  </span>
                  <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs">
                    {packId}
                  </span>
                  <span className="ml-auto flex items-center gap-3">
                    {critical > 0 && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${SEVERITY_STYLES.critical.badge}`}>
                        {critical} critical
                      </span>
                    )}
                    {high > 0 && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${SEVERITY_STYLES.high.badge}`}>
                        {high} high
                      </span>
                    )}
                    <span className="text-gray-500">
                      {report.findings.length} findings
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
