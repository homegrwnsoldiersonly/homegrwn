# Account-data ingestion

Turns a live Google Ads account (or a fixture) into the normalized
`AccountSnapshot` the knowledge engine reasons over. Everything downstream
depends only on the `AdsDataSource` interface — never on the Google Ads library
directly.

## The seam

```
getDataSource(env)                     src/lib/ads/index.ts
  ├─ credentials present  → GoogleAdsDataSource   (live API)
  └─ credentials absent   → FixtureDataSource     (demo snapshots)
```

Both implement:

```ts
interface AdsDataSource {
  kind: "fixture" | "google-ads";
  listAccounts(): Promise<AccountRef[]>;
  fetchAccountSnapshot(customerId: string): Promise<AccountSnapshot>;
}
```

The live client and its heavy gRPC dependency are imported **lazily**, so the
fixture path stays light and the library never lands in a bundle that doesn't
use it.

## Shape

```
config.ts               Env credential parsing/validation (never committed)
datasource.ts           AdsDataSource interface + FixtureDataSource
google-ads/
  queries.ts            GAQL queries (the exact fields we depend on)
  raw-types.ts          Minimal shapes for the rows we read
  mapper.ts             PURE rows -> AccountSnapshot (the tested core)
  client.ts             GoogleAdsDataSource: run queries, call mapper
index.ts                getDataSource() factory
```

## The mapper is where correctness lives

The network client is thin; the mapper is where things can be subtly wrong, so
it is pure and unit-tested (`mapper.test.ts`) with no live API:

- **Micros** → currency (Google returns `cost_micros`; 1e6 micros = 1 unit).
- **Enums** (channel type, bid strategy, match type, counting) → our types,
  tolerating both string names and numeric values.
- **Google's sprawling conversion taxonomy** → our small category set that the
  knowledge rules test with substring checks.

### Documented approximations

Google exposes less than you'd hope; these are deliberate, commented gaps:

- `conversionAction.verifiedValue` is a heuristic (offline-import / purchase /
  qualified-lead types treated as verified).
- `callDurationThresholdSec` isn't on the `conversion_action` resource — left
  undefined and surfaced by the home-services rule as a gap to fix.
- `campaign.isBrandCampaign` is inferred from the name (label convention TBD).
- `campaign.schedule.runsWhenIntakeClosed` is business context, not API data.

## Credentials

Copy `.env.example` → `.env.local` and fill in the five values. Full runbook —
written so a headless agent can execute it, with the human-only steps marked —
lives at [`docs/google-ads-credentials.md`](../../../docs/google-ads-credentials.md).
The refresh token is minted with `npx tsx scripts/mint-refresh-token.ts`.

## Try it

```bash
npm run audit:demo hvac      # fixture path (no credentials)
# with credentials in the environment:
GOOGLE_ADS_CUSTOMER_ID=1234567890 npx tsx scripts/audit.ts live home-services
```
