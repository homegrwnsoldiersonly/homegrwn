# Google Ads API credentials — setup runbook

Goal: produce the five values in `.env.example` so `getDataSource()` returns the
live `GoogleAdsDataSource` instead of fixtures. Written to be executable by a
headless agent; steps that REQUIRE A HUMAN (browser consent, Google approvals)
are marked **[HUMAN]**. Everything else an agent can do via CLI/API.

Verification at the end takes one command, so an agent can confirm success
without guessing.

## The five values

| Env var | What it is | Where it comes from |
| --- | --- | --- |
| `GOOGLE_ADS_CLIENT_ID` | OAuth 2.0 client id | Google Cloud project |
| `GOOGLE_ADS_CLIENT_SECRET` | OAuth 2.0 client secret | Google Cloud project |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | API access token | Google Ads **manager (MCC)** account |
| `GOOGLE_ADS_REFRESH_TOKEN` | Long-lived OAuth grant | One-time consent flow (step 4) |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | MCC id (digits only) | The MCC account |
| `GOOGLE_ADS_CUSTOMER_ID` | Default account to pull | Any account linked under the MCC |

## Step 1 — Manager (MCC) account **[HUMAN, once ever]**

1. Create (or reuse) a Google Ads manager account: https://ads.google.com/home/tools/manager-accounts/
2. Note its customer id from the top-right (e.g. `123-456-7890`). Digits-only
   form (`1234567890`) is `GOOGLE_ADS_LOGIN_CUSTOMER_ID`.
3. Link every client account you manage under this MCC (Accounts → Sub-account
   settings → Link existing account; the client must accept the invite).

## Step 2 — Developer token **[HUMAN, once ever; has a waiting period]**

1. In the MCC: **Admin → API Center** (must be signed in as the MCC).
2. Apply for API access. You get a developer token immediately, but it starts
   in **test-account-only** mode.
3. Apply for **Basic access** in the same screen (fill the form; use-case:
   "internal reporting and audit tooling for accounts under our manager
   account"). Approval usually takes 1–5 business days.
   - Basic access is enough: it allows full read/write on accounts linked under
     the MCC. "Standard" is only needed at very high request volume.
4. The token string is `GOOGLE_ADS_DEVELOPER_TOKEN`.

> While waiting for Basic approval, everything below can still be completed and
> verified against a Google Ads **test account** (API Center lets you create
> one) — the token works on test accounts immediately.

## Step 3 — OAuth client in Google Cloud

Can be done by an agent with `gcloud` authenticated, except the consent-screen
publish click.

1. Create/pick a Google Cloud project:
   `gcloud projects create homegrwn-ads --name="homegrwn ads"` (or reuse).
2. Enable the API:
   `gcloud services enable googleads.googleapis.com --project homegrwn-ads`
3. **[HUMAN]** Configure the OAuth consent screen (Cloud Console → APIs &
   Services → OAuth consent screen): User type **External**, add the Google
   account that owns the MCC as a **test user**. Publishing status can stay
   "Testing" — refresh tokens for test users keep working; they are just capped
   at 100 users, which is irrelevant for an internal tool.
4. Create an OAuth client (Cloud Console → Credentials → Create credentials →
   OAuth client ID): Application type **Web application**, authorized redirect
   URI `http://localhost:9004/oauth2callback` (must match step 4's listener).
5. Save the client id/secret as `GOOGLE_ADS_CLIENT_ID` / `GOOGLE_ADS_CLIENT_SECRET`.

## Step 4 — Mint the refresh token (one-time consent)

Run the helper in this repo — it starts a localhost listener, prints the
consent URL, and captures the token:

```bash
GOOGLE_ADS_CLIENT_ID=... GOOGLE_ADS_CLIENT_SECRET=... \
  npx tsx scripts/mint-refresh-token.ts
```

1. The script prints a `https://accounts.google.com/o/oauth2/v2/auth?...` URL.
2. **[HUMAN]** Open the URL in a browser, sign in as the Google account that
   owns the MCC, and approve the `https://www.googleapis.com/auth/adwords`
   scope. (This is the one browser step an agent cannot do; paste the URL to
   the human and wait.)
3. The script receives the callback, exchanges the code, and prints the
   `GOOGLE_ADS_REFRESH_TOKEN`. It never stores or transmits it anywhere else.

Notes for agents:
- The refresh token does not expire on a schedule, but is revoked if the user
  changes their Google password with certain account types, or explicitly
  revokes access at https://myaccount.google.com/permissions.
- If the consent screen is in "Testing" mode, only listed test users can
  complete the flow.

## Step 5 — Fill `.env.local` and verify

```bash
cp .env.example .env.local   # then fill in the five values
```

`GOOGLE_ADS_CUSTOMER_ID` is the digits-only id of whichever linked account to
pull by default (per-call override is supported).

**Verification (agent-runnable, read-only):**

```bash
npx tsx scripts/audit.ts live legal-personal-injury
```

- Success: output begins `[datasource: google-ads]` and prints an audit report
  for the real account.
- `[datasource: fixture]` means at least one required env var is missing —
  `src/lib/ads/config.ts` lists which are required; the error from
  `loadGoogleAdsConfig()` names the missing ones.
- `PERMISSION_DENIED` / `DEVELOPER_TOKEN_NOT_APPROVED`: step 2's Basic access
  is not approved yet — verify against a test account instead.
- `USER_PERMISSION_DENIED`: the account is not linked under the MCC in
  `GOOGLE_ADS_LOGIN_CUSTOMER_ID`, or the consenting user lacks access to it.
- `invalid_grant` on startup: the refresh token was revoked — re-run step 4.

## Security rules (for humans and agents alike)

- `.env.local` is gitignored; never commit any of these values, never echo them
  into logs, PRs, or issue comments.
- The refresh token grants read/write over every linked account. Treat it like
  a password. This app is currently **read-only by design** (recommend-only
  posture), but the token itself is not scoped down — Google Ads has no
  read-only OAuth scope.
- If a value leaks: revoke the OAuth grant (myaccount.google.com/permissions),
  rotate the client secret in Cloud Console, and regenerate the developer token
  in API Center.
