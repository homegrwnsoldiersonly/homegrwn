/**
 * Tenant registry (dashboard v1).
 *
 * A tenant is a named group of accounts served by one data source:
 *
 *   fixture/<id>       the three built-in demo snapshots, one tenant each
 *   csv/<slug>         every folder under data/case-studies/ (CsvDataSource)
 *   google-ads/live    all accounts the live MCC can see, when credentials exist
 *
 * The active tenant is a cookie (`hg_tenant`) set by the switcher's server
 * action. Everything here is request-scoped via React `cache()` so the layout
 * (badges) and the page (data) share one load per request.
 *
 * Account ids are resolved across sources in order fixture → csv → live, so
 * `/accounts/<id>` works for any account regardless of the active tenant.
 * A CSV folder must therefore not reuse a fixture id (documented in
 * data/case-studies/README.md).
 */

import { cache } from "react";
import { cookies } from "next/headers";
import { FixtureDataSource, getDataSource, hasGoogleAdsCredentials } from "@/lib/ads";
import type { AdsDataSource, DataSourceKind } from "@/lib/ads/datasource";
import { CsvDataSource, type CsvIngestMeta, type CsvTable } from "@/lib/ads/csv-datasource";
import { audit, PACKS, selectablePacks, suggestPackId } from "@/lib/knowledge";
import type { AccountSnapshot, AuditReport } from "@/lib/knowledge/types";

export const TENANT_COOKIE = "hg_tenant";

export interface Tenant {
  id: string;
  name: string;
  kind: DataSourceKind;
  accountIds: string[];
  /** Set when the source could not be listed (e.g. live API error). */
  note?: string;
}

export interface TenantAccount {
  accountId: string;
  kind: DataSourceKind;
  snapshot: AccountSnapshot;
  packId: string;
  report: AuditReport;
  /** CSV tenants only: what was present / missing / inferred. */
  ingest?: CsvIngestMeta;
}

export interface TenantStatus {
  partial: boolean;
  missing: CsvTable[];
}

export const KIND_LABELS: Record<DataSourceKind, string> = {
  fixture: "fixture",
  "google-ads": "google-ads",
  csv: "csv",
};

const fixture = new FixtureDataSource();
const csv = new CsvDataSource();

const liveSource = cache(async (): Promise<AdsDataSource | null> =>
  hasGoogleAdsCredentials() ? getDataSource() : null,
);

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export const listTenants = cache(async (): Promise<Tenant[]> => {
  const tenants: Tenant[] = [];

  for (const { customerId } of await fixture.listAccounts()) {
    const snapshot = await fixture.fetchAccountSnapshot(customerId);
    tenants.push({
      id: `fixture/${customerId}`,
      name: snapshot.accountName,
      kind: "fixture",
      accountIds: [customerId],
    });
  }

  for (const { customerId } of await csv.listAccounts()) {
    let name = customerId;
    try {
      name = (await csv.fetchCsvAccount(customerId)).snapshot.accountName;
    } catch {
      // Unreadable folder still shows up, by slug, so the operator sees it.
    }
    tenants.push({ id: `csv/${customerId}`, name, kind: "csv", accountIds: [customerId] });
  }

  const live = await liveSource();
  if (live) {
    const base = { id: "google-ads/live", name: "Live — Google Ads", kind: "google-ads" as const };
    try {
      const refs = await live.listAccounts();
      tenants.push({ ...base, accountIds: refs.map((r) => r.customerId) });
    } catch (err) {
      tenants.push({ ...base, accountIds: [], note: errorMessage(err) });
    }
  }

  return tenants;
});

export const getActiveTenant = cache(
  async (): Promise<{ tenants: Tenant[]; active: Tenant | null }> => {
    const tenants = await listTenants();
    const store = await cookies();
    const wanted = store.get(TENANT_COOKIE)?.value;
    const active = tenants.find((t) => t.id === wanted) ?? tenants[0] ?? null;
    return { tenants, active };
  },
);

/** Pick a pack: an explicit valid request wins, else the suggestion, else the first. */
export function choosePackId(snapshot: AccountSnapshot, requested?: string): string {
  if (requested && PACKS[requested] && PACKS[requested].category !== "base") return requested;
  return suggestPackId(snapshot) ?? selectablePacks()[0].id;
}

async function loadFrom(
  kind: DataSourceKind,
  accountId: string,
  packOverride?: string,
): Promise<TenantAccount | null> {
  try {
    if (kind === "csv") {
      const { snapshot, ingest } = await csv.fetchCsvAccount(accountId);
      const packId = choosePackId(snapshot, packOverride);
      return { accountId, kind, snapshot, packId, report: audit(snapshot, packId), ingest };
    }
    const source = kind === "fixture" ? fixture : await liveSource();
    if (!source) return null;
    const snapshot = await source.fetchAccountSnapshot(accountId);
    const packId = choosePackId(snapshot, packOverride);
    return { accountId, kind, snapshot, packId, report: audit(snapshot, packId) };
  } catch {
    return null;
  }
}

/** Every account in a tenant, audited. Accounts that fail to load are skipped. */
export const loadTenantAccounts = cache(async (tenant: Tenant): Promise<TenantAccount[]> => {
  const out: TenantAccount[] = [];
  for (const id of tenant.accountIds) {
    const account = await loadFrom(tenant.kind, id);
    if (account) out.push(account);
  }
  return out;
});

/** Resolve one account id across sources (fixture → csv → live). */
export async function loadAccount(
  accountId: string,
  packOverride?: string,
): Promise<TenantAccount | null> {
  for (const kind of ["fixture", "csv", "google-ads"] as const) {
    const account = await loadFrom(kind, accountId, packOverride);
    if (account) return account;
  }
  return null;
}

/** Cheap presence check for the top-bar "Partial data" badge. */
export async function tenantStatus(tenant: Tenant): Promise<TenantStatus> {
  if (tenant.kind !== "csv") return { partial: false, missing: [] };
  const missing = new Set<CsvTable>();
  for (const id of tenant.accountIds) {
    try {
      for (const m of (await csv.inspect(id)).missing) missing.add(m);
    } catch {
      // An unreadable folder is reported by loadTenantAccounts, not here.
    }
  }
  return { partial: missing.size > 0, missing: [...missing] };
}
