/**
 * The port/adapter seam between "where account data comes from" and the rest of
 * the app. Everything downstream (the knowledge engine, later the dashboard)
 * depends only on this interface, never on the Google Ads library directly.
 *
 * Two adapters implement it:
 *   - FixtureDataSource   — demo snapshots, zero credentials (this file)
 *   - GoogleAdsDataSource — the live API (./google-ads/client)
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

export interface AdsDataSource {
  readonly kind: "fixture" | "google-ads";
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
