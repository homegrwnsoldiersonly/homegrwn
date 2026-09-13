# Dashboard — app.homegrwndigital.com

The multi-tenant reporting surface (`src/app/app/`). Glassmorphism direction
per `docs/brand.md`: translucent panels over the charcoal→forest gradient with
CSS grain, mono numerals, lime for accent/positive, a restrained red for
severity and negative deltas. Recommend-only end to end — nothing on this
surface writes to an account. `noindex` on every route.

Built 2026-09-13 (dashboard phase). Replaces the `/agent` cockpit that was
moved here path-only in the foundation phase; `src/app/app/ui.tsx` and its
gray/orange/yellow/amber classes are gone, so the foundation owner can now
drop those hues from `src/app/globals.css` (they were kept only for it).

## What exists

| Public path | File | What it shows |
|---|---|---|
| `/` | `src/app/app/page.tsx` | Overview: KPI tiles (spend, findings, est. waste, accounts), severity distribution bar, account cards, top findings across the tenant |
| `/accounts` | `src/app/app/accounts/page.tsx` | Every account in the tenant |
| `/accounts/[id]?pack=` | `src/app/app/accounts/[id]/page.tsx` | The audit report: pack switcher (links), stats, finding cards, change-set summary + CSV download, guardrails, red flags. `id` resolves across all sources (fixture → csv → live) |
| `/findings` | `src/app/app/findings/page.tsx` | All findings in the tenant, sorted severity→waste→confidence, filtered by `?severity=critical,high&pack=&category=&account=` |
| `/changes?account=` | `src/app/app/changes/page.tsx` | The negatives change-set per account: Tier 1 exact terms (safe) + Tier 2 phrase signals (review, with overblock cautions) |
| `/changes/[id]/export?pack=` | `src/app/app/changes/[id]/export/route.ts` | Route handler streaming the Tier-1 list as Google Ads Editor CSV (`Content-Disposition: attachment`). No `.csv` in the URL — `src/proxy.ts` skips extension-bearing paths |
| `/history` | `src/app/app/history/page.tsx` | Persisted runs per account from `FsHistoryStore`, each diffed against the previous run (new / resolved / worsened / improved, waste delta). Honest empty state when no runs exist |
| `/login` | `src/app/app/login/page.tsx` | Password form (only when `APP_PASSWORD` is set) |
| anything else | `src/app/app/[...rest]/page.tsx` → `not-found.tsx` | 404 inside the shell |

Shell: `src/app/app/layout.tsx` → `AppShell` (`src/components/app/AppShell.tsx`).
Left rail (desktop): wordmark, tenant switcher, nav (Overview / Accounts /
Findings / Changes / History), posture note. Top bar: active tenant name,
data-source badge (`fixture` | `google-ads` | `csv`), **Partial data** flag for
CSV tenants missing tables, **Recommend-only** label, sign-out when gated. On
mobile (375px verified by construction: no fixed widths, nav strip scrolls
inside `overflow-x-auto`) the rail collapses into the top bar: logo row →
switcher row → nav strip.

Client Components, and why (everything else is a Server Component):

- `TenantSwitcher` — `<select onChange>` auto-submits a form whose action is
  the `selectTenant` server action; `useFormStatus` for the pending state.
  Works without JS via the sr-only "Switch" button.
- `FindingsFilters` — writes `?severity=…&pack=…&category=…&account=…` with
  `router.replace`; the page filters on the server.
- `NavLinks` — `usePathname()` for the active state (layouts cannot know the
  path on the server).

Component kit: `src/components/app/` (`index.ts` barrel) — `AppShell`,
`BareShell`, `ChangeSetPanel`, `RunList`, `FindingCard`, `FindingRow`,
`AccountCard`, `SeverityBadge`, `SeverityBar`, `Pill`, `DataSourceBadge`,
`PageHeader`, `PageFrame`, `SectionTitle`, `EmptyState`, `PartialDataNotice`,
`format.ts` (`formatMoney`, `formatInt`, `formatDateTime`, `formatSignedMoney`).
Primitives come from `src/components/ui` (`GlassPanel`, `Stat tone="glass"`,
`Button`, `Logo`, `Heading`, `Eyebrow`, `Container`). Severity palette lives in
`src/components/app/severity.tsx`: critical/high = red steps, medium/low =
white steps — lime stays the single saturated accent.

## Tenant model (v1)

A **tenant is a named group of accounts served by one data source**.
Registry: `src/app/app/_lib/tenants.ts`.

| Tenant id | Kind | Accounts |
|---|---|---|
| `fixture/pi-001`, `fixture/hs-001`, `fixture/pi-clean` | `fixture` | one each — the demo snapshots in `src/lib/knowledge/fixtures.ts` |
| `csv/<folder>` | `csv` | one per folder under `data/case-studies/` (see below) |
| `google-ads/live` | `google-ads` | every account the MCC lists — appears only when `GOOGLE_ADS_*` credentials are set; a listing failure shows the tenant with the error as a banner |

- The active tenant is the `hg_tenant` cookie (30 days, httpOnly), set by the
  switcher's server action (`src/app/app/_lib/actions.ts`). Invalid/missing →
  first tenant.
- `listTenants`, `getActiveTenant`, `loadTenantAccounts` are wrapped in React
  `cache()` so the layout (badges) and the page (data) share one load per
  request.
- Each account is audited through `choosePackId(snapshot, ?pack)`: an
  explicit valid `?pack=` wins, else `suggestPackId` (sub-niche / name
  sniffing), else the first selectable pack.
- Account ids resolve across sources in order fixture → csv → live, so a CSV
  folder must not reuse a fixture id.
- `DataSourceKind` (`src/lib/ads/datasource.ts`) now includes `"csv"`.
  `getDataSource()` is unchanged — it still picks live vs fixture; the CSV
  source is *additive* and composed only here. `FixtureDataSource` is intact.

Auth is deliberately not a provider yet (account decision for Nathan); real
per-user auth lands with the first manager-linked client.

## Adding a CSV tenant

1. `mkdir data/case-studies/<slug>` (letters, digits, `-`, `_`, `.`; not
   starting with `_` or `.`).
2. Export from the Google Ads UI as CSV and save as `campaigns.csv`,
   `keywords.csv`, `search_terms.csv`, `conversions.csv`. Google's preamble
   rows, "Total" row, `$1,234.56`, ` --` and BOM are all tolerated. Column
   names + aliases: `data/case-studies/TEMPLATE.csv` (machine-checked against
   the mapper in `csv-datasource.test.ts`); step-by-step in
   `data/case-studies/README.md`.
3. Optional `tenant.json`: `{ "name", "currency", "windowDays", "subNiche",
   "servesLocations" }`. `windowDays` normalizes spend to 30 days; `subNiche`
   drives pack suggestion.
4. Reload the dashboard — the folder appears in the switcher as
   `<name> · csv`. Nothing to register.

Missing files never crash: the snapshot is partial, the top bar shows
**Partial data**, and the Overview/account pages render a `PartialDataNotice`
listing the missing tables and every inference the mapper made (stub
campaigns, rolled-up metrics, dropped rows). Implementation:
`src/lib/ads/csv-datasource.ts` — pure `buildCsvSnapshot` (CSV text →
`AccountSnapshot` + `CsvIngestMeta`), enum text folded onto the live
mapper's vocabulary (`mapCampaignType`, `mapConversionCategory`,
`isVerifiedValue`), and the `CsvDataSource` adapter (`listAccounts`,
`inspect`, `fetchCsvAccount`, `fetchAccountSnapshot`). Root override:
`CASE_STUDIES_DIR`.

## Password gate

- `APP_PASSWORD` unset → open (local dev).
- `APP_PASSWORD` set → every page calls `requireSession()`
  (`src/app/app/_lib/auth.ts`) and redirects to `/login`; the layout renders
  the bare shell (no rail, no tenant names) for anonymous requests; the CSV
  export route returns 401. Pages check too — layouts and pages render in
  parallel, so a layout-only check would still produce page payload.
- Session = `hg_app_session` cookie, `<expiresAtMs>.<HMAC-SHA256(APP_PASSWORD,
  "hg-app:<expiresAtMs>")>`, 14 days, httpOnly, sameSite=lax, `secure` in
  production (`src/app/app/_lib/session.ts`, unit-tested). Rotating the
  password signs everyone out. Password comparison is constant-time.
- Actions: `login`, `logout`, `selectTenant` in `src/app/app/_lib/actions.ts`
  ("use server"). All three only set cookies and redirect; `next` targets
  are restricted to same-origin paths.
- No rate limiting yet; the password is a shared operator secret behind
  Vercel's edge — add a limiter before the first client sees the URL.

## History

`/history` reads `FsHistoryStore` (`.data/audit-history/<account>.jsonl`,
`AUDIT_HISTORY_DIR`). Runs are written by `GET /api/cron/audit` (needs
`CRON_SECRET` in production) or `npx tsx scripts/audit-all.ts`. On Vercel the
filesystem is ephemeral, so the page's empty state says so instead of
pretending — a KV/Postgres `HistoryStore` adapter slots in without touching
the page.

## Verification (2026-09-13)

- `npx tsc --noEmit` clean; `npx eslint src/app/app src/components/app src/lib/ads` clean.
- `npm test`: 111/111 (79 prior + 25 CSV mapper/adapter + 4 session + 3
  findings helpers).
- `next build`/`next dev` were not run in this phase (shared `.next`); the
  `PageProps<"/app/accounts/[id]">` helper is used only where the route
  already exists in `.next/types/routes.d.ts`. New routes type their props
  inline; the next `next typegen` picks them up.

## Open items

- Drop `gray/orange/yellow/amber` from `src/app/globals.css` (foundation
  owner) — the cockpit that used them is gone.
- Rate limiting on `/login`; per-user auth when the first client is
  manager-linked.
- `History` needs a persistent `HistoryStore` on serverless.
- Live-tenant grouping: today all MCC accounts land in one `google-ads/live`
  tenant; per-client grouping arrives with the client model.
- Mobile was verified by construction (relative units, `overflow-x-auto`
  tables/nav, no fixed widths), not in a browser — do a 375px pass once a
  dev server is available to this surface.
