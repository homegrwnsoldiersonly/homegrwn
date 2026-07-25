/**
 * Public entry point for account-data ingestion.
 *
 * getDataSource() returns the live Google Ads adapter when credentials are
 * configured, and the fixture adapter otherwise — so the rest of the app has a
 * single call site and never branches on "do we have creds yet".
 *
 * The live client (and its heavy gRPC dependency) is imported lazily, so the
 * fixture path stays light and nothing forces the library into a bundle that
 * doesn't need it.
 */

import type { AdsDataSource } from "./datasource";
import { FixtureDataSource } from "./datasource";
import { hasGoogleAdsCredentials } from "./config";

export type { AdsDataSource, AccountRef } from "./datasource";
export { FixtureDataSource } from "./datasource";
export { hasGoogleAdsCredentials, loadGoogleAdsConfig } from "./config";

export async function getDataSource(
  env: NodeJS.ProcessEnv = process.env,
): Promise<AdsDataSource> {
  if (hasGoogleAdsCredentials(env)) {
    const { GoogleAdsDataSource } = await import("./google-ads/client");
    return new GoogleAdsDataSource();
  }
  return new FixtureDataSource();
}
