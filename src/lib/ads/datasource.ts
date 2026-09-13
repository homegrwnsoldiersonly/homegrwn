/**
 * The port/adapter seam between "where account data comes from" and the rest of
 * the app. Everything downstream (the knowledge engine, later the dashboard)
 * depends only on this interface, never on the Google Ads library directly.
 *
 * Three adapters implement it:
 *   - FixtureDataSource   — demo snapshots, zero credentials (this file)
 *   - GoogleAdsDataSource — the live API (./google-ads/client)
 *   - CsvDataSource       — exported Google Ads tables dropped into
 *                           data/case-studies/<tenant>/ (./csv-datasource)
 *
 * `getDataSource()` (./index.ts) still picks between the first two; the CSV
 * adapter is composed alongside them by the dashboard's tenant registry
 * (src/app/app/_lib/tenants.ts), because a CSV tenant is additive — it never
 * replaces the live or fixture source.
 */

import type { AccountSnapshot } from "../knowledge/types";
import {
  piFirmSnapshot,
  hvacSnapshot,
  cleanPiSnapshot,
} from "../knowledge/fixtures";

export interface AccountRef {
  /** Google Ads customer id (digits only). For fixtures, the fixture id. */
  customerId: string;
}

/** Where an account's data came from. Surfaced as a badge on the dashboard. */
export type DataSourceKind = "fixture" | "google-ads" | "csv";

export interface AdsDataSource {
  readonly kind: DataSourceKind;
  /** List the accounts this source can pull. */
  listAccounts(): Promise<AccountRef[]>;
  /** Pull a normalized 30-day snapshot for one account. */
  fetchAccountSnapshot(customerId: string): Promise<AccountSnapshot>;
}

const FIXTURES: Record<string, AccountSnapshot> = {
  [piFirmSnapshot.accountId]: piFirmSnapshot,
  [hvacSnapshot.accountId]: hvacSnapshot,
  [cleanPiSnapshot.accountId]: cleanPiSnapshot,
};

/** Serves the built-in demo snapshots. Used until live credentials exist. */
export class FixtureDataSource implements AdsDataSource {
  readonly kind = "fixture" as const;

  async listAccounts(): Promise<AccountRef[]> {
    return Object.keys(FIXTURES).map((customerId) => ({ customerId }));
  }

  async fetchAccountSnapshot(customerId: string): Promise<AccountSnapshot> {
    const snapshot = FIXTURES[customerId];
    if (!snapshot) {
      throw new Error(
        `No fixture account "${customerId}". Available: ${Object.keys(FIXTURES).join(", ")}.`,
      );
    }
    return snapshot;
  }
}
