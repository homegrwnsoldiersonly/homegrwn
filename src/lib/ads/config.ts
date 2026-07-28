/**
 * Google Ads credential configuration.
 *
 * None of these values are ever committed. They come from environment
 * variables (see `.env.example`). Getting them is a real-world process:
 *   - developer_token: from a Google Ads **manager (MCC)** account, requires
 *     Google approval (basic access is enough to read your own linked accounts).
 *   - client_id / client_secret: an OAuth 2.0 client in a Google Cloud project.
 *   - refresh_token: minted once per user via the OAuth consent flow.
 *   - login_customer_id: the MCC id that has access to the account you query.
 *   - customer_id: the specific account to pull (can be overridden per call).
 */

export interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  developerToken: string;
  refreshToken: string;
  /** MCC / manager account id (digits only, no dashes). */
  loginCustomerId?: string;
  /** Default account to pull if a call doesn't specify one. */
  defaultCustomerId?: string;
}

const REQUIRED_KEYS = [
  "GOOGLE_ADS_CLIENT_ID",
  "GOOGLE_ADS_CLIENT_SECRET",
  "GOOGLE_ADS_DEVELOPER_TOKEN",
  "GOOGLE_ADS_REFRESH_TOKEN",
] as const;

/** Strip dashes/spaces from a customer id (Google shows 123-456-7890). */
export function normalizeCustomerId(id: string): string {
  return id.replace(/[^0-9]/g, "");
}

/** True if the minimum credentials to talk to Google Ads are present. */
export function hasGoogleAdsCredentials(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return REQUIRED_KEYS.every((k) => !!env[k]);
}

/**
 * Read + validate credentials from the environment. Throws a single, actionable
 * error listing every missing variable rather than failing one at a time.
 */
export function loadGoogleAdsConfig(
  env: NodeJS.ProcessEnv = process.env,
): GoogleAdsConfig {
  const missing = REQUIRED_KEYS.filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing Google Ads credentials: ${missing.join(", ")}. ` +
        `Copy .env.example to .env.local and fill them in.`,
    );
  }
  return {
    clientId: env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: env.GOOGLE_ADS_CLIENT_SECRET!,
    developerToken: env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    refreshToken: env.GOOGLE_ADS_REFRESH_TOKEN!,
    loginCustomerId: env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
      ? normalizeCustomerId(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID)
      : undefined,
    defaultCustomerId: env.GOOGLE_ADS_CUSTOMER_ID
      ? normalizeCustomerId(env.GOOGLE_ADS_CUSTOMER_ID)
      : undefined,
  };
}
