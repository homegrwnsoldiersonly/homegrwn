# Build log

Decisions and state, newest first. This is the documentation Nathan asked for.

## 2026-09-14 — Canonical-host 301 + Ads Driver domain analysis

- **Gap closed:** legacy/`www`/alias hosts were *served*, never redirected. `canonicalRedirect()`
  in `src/lib/surface.ts` now 301s any non-canonical production host to `SURFACE_URLS[surface]`
  (path + query preserved); neutral hosts (localhost, `*.vercel.app`) untouched. Tested.
- **Ads Driver domain — recommendation: keep `adsdriver.homegrwndigital.com` for now.**
  Facts: `adsdriver.ai` is a LIVE early-access product ("AdsDriver.AI — Your Meta ads, on
  autopilot", © 2026) in the same category; `adsdriver.com` is registered but dead. Every
  standalone "adsdriver" domain (`ads-driver.com` $11.25, `adsdriver.io` $30, `.co`, `.app`,
  `getadsdriver.com`…) is available but collides verbally with adsdriver.ai, and a hyphenated
  `.com` leaks spoken referrals to the unhyphenated owner. The cross-referral goal is served
  by the "by HOMEGRWN" / "Ads Driver" nav + footer links, not by the domain. A standalone
  product domain is the right move only when the product carries its own ad spend — and
  then the *name* should be checked first (USPTO + live-competitor sweep), with the domain
  following the name. Because aliases 301 to `SURFACE_URLS`, cutting over later is a
  one-line change plus DNS.

## 2026-09-13 — Domain cutover: homegrwnagency.com → homegrwndigital.com

The brand domain moved. `homegrwndigital.com` was purchased on IONOS today
($10/yr year 1, then $20/yr); the connect@ Google Workspace account is renamed
to `connect@homegrwndigital.com`. MX (`smtp.google.com`) + Google SPF are live
at IONOS; site DNS to Vercel is still pending. The old `homegrwnagency.com`
(Framer-built; registrar Tucows) is **abandoned** — it expires 2026-10-17 and
will not be renewed; a transfer-out hedge attempt is in progress.

- Swapped every `homegrwnagency.com` / `connect@homegrwnagency.com` reference in
  `src/` and `docs/` to the new domain (canonicals, structured-data email,
  privacy-policy contact, OG footer, header comments, tests).
- `SURFACE_HOSTS` in `src/lib/surface.ts` keeps the old hosts mapped to the same
  surfaces as legacy entries so a 301 window is possible while the old domain
  still resolves; drop them after 2026-10-17.
- robots now disallows `/brand/legacy/` (the archived Framer snapshot).
- Deliberately untouched archives: `docs/content/legacy-homegrwnagency-copy.md`
  and `public/brand/legacy/` (incl. the Framer HTML snapshot).

## 2026-09-13 — Integration pass (cross-surface nav, SEO, consistency, build)

Owner of the build for this phase; every builder's work now coheres as one app.

- **Cross-surface links:** `src/lib/surfaces.ts` — `surfaceHref(surface, path)` /
  `crossSurfaceLinks(current)`. Mode is decided from env at render time (never
  from request headers, so marketing pages stay static): `VERCEL_ENV=production`
  → absolute canonical host (`https://adsdriver.homegrwndigital.com/pricing`);
  anything else → the `?surface=` switch (`/pricing?surface=ads`);
  `NEXT_PUBLIC_SURFACE_LINKS=host|query` overrides. Cross-surface links render as
  plain `<a>` (`NavLink.external`), never `<Link>`, so the proxy sees the request
  and sets the cookie. `SiteFooter` cross-links now go through the helper too.
- **Nav:** agency — Niches → `/niches` (index), Legal → `/legal`, Case studies,
  Free training, Ads Driver (cross-surface), CTA "Book a call". Ads Driver — How it
  works, Pricing, FAQ, Apply, `brandLink` "by HOMEGRWN" back to the agency, footer
  "HOMEGRWN" column. Both footers link **Privacy**.
- **Privacy:** `src/components/policy/PrivacyPolicy.tsx` rendered at `/privacy` on
  both public surfaces (`src/app/{agency,ads}/privacy/page.tsx`). Honest generic
  stub describing what the site actually does today (two forms, no pixels, one
  functional cookie), visibly badged "Draft — pending review by counsel".
  `TODO(counsel)` in the component.
- **`/book?trade=<slug>`:** every niche CTA already linked it; the page now reads
  `searchParams` (dynamic route, fine for a form) and preselects the trade via
  `StrategyCallForm.defaultTrade`.
- **SEO:**
  - `src/app/sitemap.ts` + `src/app/robots.ts` are host-aware (they read the Host
    header, so they render on demand): each production host lists only its own
    URLs; the dashboard host is `Disallow: /`; a neutral host (localhost,
    *.vercel.app) lists both public surfaces. Route lists are derived from the
    content registries in `src/lib/seo.ts` (pure, unit-tested) — a new niche or
    legal slug appears in the sitemap automatically. Case studies have no
    registry yet; `CASE_STUDY_SLUGS` there must be kept in step.
  - Open Graph images: `src/lib/brand/og.tsx` (tokens only) renders
    `src/app/{agency,ads}/opengraph-image.tsx`. Next emits their URLs with the
    internal prefix (`/agency/opengraph-image`), so `src/proxy.ts` passes
    metadata-image paths through (`isMetadataImagePath`) instead of redirecting.
    Font: Inter 800 is fetched from Google Fonts at build time with a silent
    fallback to next/og's bundled Geist Regular — the build never depends on the
    network. Commit an Inter TTF under `src/assets/` for a deterministic result.
  - **Metadata merge trap (read this before adding `openGraph` to a page):** Next
    merges `openGraph` shallowly per segment, so a page that defines its own
    `openGraph` object drops the layout-level image. Every page that sets it now
    goes through `openGraphFor(surface, overrides)` in `src/lib/seo.ts`, which
    carries the surface image. Pages that set no `openGraph` inherit it for free.
  - `metadataBase` is overridden in the ads and app layouts so canonicals /
    `og:url` resolve to the right host. Canonicals added to every ads page and
    `/free-training`; catch-all pages carry `noindex` metadata.
  - JSON-LD (Organization + Service + WebSite graph) on the agency home via
    `src/components/seo/JsonLd.tsx` / `agencyJsonLd()`; no ratings, dates,
    counts or client names (claims gate).
- **Consistency pass:** grep for blue / raw hex in TSX / lorem / builder markers /
  digits+% / "clients" — clean (the only "%" is a CSS mask in Marquee; "client(s)"
  hits are comments or generic prose). Fixed the foundation ordering bug where a
  caller's text colour on `CheckerFlag` lost to its lime default (it now applies
  the default only when no text colour is passed; `HowItWorks` dropped its inline
  style). `gray/orange/yellow/amber` reset in `globals.css` now that the cockpit
  is restyled. Removed the unused import in `conversions.test.ts`. Added
  `vitest.config.ts` (`@/` alias) so modules that import through the alias test.
- **Verified:** `next typegen && tsc --noEmit` clean; `eslint .` 0 errors / 0
  warnings; 128/128 tests (+17: surfaces, seo, metadata-image paths); `next build`
  32 static pages + 2 OG images; `next start -p 3117` sweep — every agency route
  (home, /niches + 6, /legal + 4, case studies ×2, free-training, book, privacy),
  every Ads Driver route (home, how-it-works, pricing, faq, apply, privacy), every
  dashboard route (overview, accounts, accounts/pi-001, findings, changes,
  changes/pi-001/export CSV, history; login → 307 home with the gate off) returns
  200 with no "Application error"; per-surface 404s render inside their chrome;
  `/agency/…` 307s to the clean path; `ads.localhost` / `app.localhost` host
  routing works; robots.txt differs per host as designed; sitemap lists 24 URLs.
- **TODO (next phases):** CRM/n8n wiring for `book/actions.ts` and
  `ads-driver/applyAction.ts` (both only log today; add rate limiting); YouTube
  embed (`YOUTUBE_EMBED_URL` in the septic case study); vector logo to replace
  the raster lockup; auth provider for the dashboard (password gate is v1);
  TypeUI re-skin once the MCP is authorized; counsel-reviewed privacy policy;
  Inter TTF asset for the OG renderer; a case-study registry; a real 375px
  browser pass (mobile verified structurally + via the build, not visually).

## 2026-09-13 — Foundation build (tokens, surfaces, proxy, primitives)

- **Routing:** surfaces are top-level folders `src/app/{agency,ads,app}`, not route
  groups — Next 16 route groups cannot be rewrite targets and three `/` pages would
  collide. `src/proxy.ts` rewrites clean paths onto them; `/agency`, `/ads`, `/app`
  are reserved prefixes. Rationale + resolution order in `docs/site-architecture.md`.
- **Tokens:** `src/app/globals.css` `@theme` carries every `docs/brand.md` token. All
  default Tailwind hues that could leak a blue/purple/green are reset (`bg-blue-500`
  does not exist); `gray/orange/yellow/amber` survive only for the un-restyled cockpit.
  Type scale is the brand's 12→88 with fluid `clamp()` display sizes. Grain is CSS-only
  (`.bg-grain`, SVG feTurbulence) — the 700 KB PNG is not shipped.
- **Fonts:** Inter (UI/display) + Geist Mono (data) via `next/font/google`, exposed as
  `--font-inter` / `--font-geist-mono` → `font-sans` / `font-mono`.
- **Moves:** the orange training page → `agency/free-training` (copy verbatim, brand
  tokens); `/agent` cockpit → `app/` root, paths only (restyle is a later phase).
- **Claims gate:** `<ProofPlaceholder/>` is the only proof block; Ads Driver pricing
  renders "Pricing announced at early access."
- **Verified:** `next typegen && tsc --noEmit` clean, eslint 0 errors, 79/79 tests
  (72 prior + 7 surface-resolver), `next build` passing.

## 2026-09-13 — Site rebuild kicked off

**Identities (consolidated):**
- GitHub: `homegrwnsoldiersonly/homegrwn` is the single repo. `nathantunger-art/HOMEGRWN`
  is unreachable from every authed account and is retired; the Vercel project
  `homegrwn` in the `nathantunger-2326` team that pointed at it 404s.
- Vercel: HOMEGRWN lives in the `nathantunger-2326's projects` team (hobby — must
  move to Pro before serving paying clients). The Vercel CLI on this Mac is logged
  into ECF's account (`nathan-3028s-projects`) and is NOT used for HOMEGRWN.
- `homegrwn-eta.vercel.app` (the orange "Stop paying for leads" training page)
  deploys from an unreachable scope; its source is this repo's original
  `src/app/page.tsx`, preserved at `(agency)/free-training`.
- Google Ads: the only dev token available is under ECF's MCC (950-693-7547). HOMEGRWN
  needs its own MCC + token; **do not apply for Basic access until a client is
  manager-linked and the dashboard is demo-able** (see `docs/google-ads-credentials.md`).

**Domain:** homegrwnagency.com was on Framer (cancelled); registrar is Tucows, expires
2026-10-17. ~~Renewal is mandatory~~ **Superseded 2026-09-13:** the brand moved to
homegrwndigital.com (purchased on IONOS; MX + Google SPF live there, site DNS to
Vercel pending) and the Google account is renamed `connect@homegrwndigital.com`;
the old domain is abandoned (a transfer-out hedge attempt is in progress). Snapshot
of the last Framer build is in `public/brand/legacy/`.

**Brand:** extracted to `docs/brand.md`. Logo raster recovered; vector pending.

**TypeUI:** Nathan wants TypeUI themes (Forest/Mars for agency, Mars×Perspective for
Ads Driver, Glassmorphism for the dashboard). TypeUI is an MCP server that requires a
TypeUI account sign-in (Creative plan, $30/mo). The server entry is in `.mcp.json`;
authorization is a human step: open an interactive `claude` session in this repo,
run `/mcp`, select `typeui`, sign in. Until then the theme directions are implemented
natively per `docs/brand.md`; once connected, publish a HOMEGRWN design system in
TypeUI seeded from `docs/brand.md` and re-skin from it.

**Copy compliance:** legacy stats and testimonials were unsubstantiated and are not
carried forward. See `docs/content/claims.md`.

**Prior codebase verified:** 72/72 tests pass; `next typegen && tsc --noEmit` clean.

**Google Ads MCP isolation (2026-09-13):** `.mcp.json` now overrides the user-scoped
`google-ads` server with a HOMEGRWN-only instance: same open-source binary (copied to
`~/.local/bin/mcp-google-ads`), separate credential/token/audit paths under
`~/.mcp-google-ads-homegrwn/`, and env vars prefixed `HOMEGRWN_GOOGLE_ADS_*` so ECF's
token can never be picked up inside this repo. It will show as failed in `/mcp` until
the HOMEGRWN MCC + token exist and `HOMEGRWN_GOOGLE_ADS_*` are exported in the shell.
Guardrails start tighter than ECF's (dry-run required, $250/day budget cap, +25% bid cap).

## 2026-09-13 — QA close-out (final verification, build owner)

QA totals: **56 findings** across the three surfaces; 32 fixed in the fix
phase, **24 low-severity items deferred** (listed under *Deferred* below).
One non-low item surfaced during this verification pass and was fixed here:

- **`/book` reported success for undelivered leads.** `src/app/agency/book/actions.ts`
  validated, returned `status: "success"`, and sent the lead nowhere — the
  exact failure `src/lib/intake/deliver.ts` forbids. It now mirrors
  `applyAction.ts`: honeypot → per-client rate limit (5 burst, 1/min) →
  validation → `deliverIntake({ kind: "agency-book" })` to `BOOK_WEBHOOK_URL`;
  delivery failure or an unset URL returns the error state with the visitor's
  values intact and the direct email. `StrategyCallState.error` gained an
  optional `message`, `StrategyCallForm` renders it, `.env.example` lists
  `BOOK_WEBHOOK_URL`. **Set `BOOK_WEBHOOK_URL` and `APPLY_WEBHOOK_URL` before
  either surface takes traffic** — until then both forms show the honest
  "couldn't send" state, never a fake confirmation.

Verified (this pass, in order): `next typegen && tsc --noEmit` clean;
`eslint .` 0 errors / 0 warnings; `vitest run` 14 files, 162/162; `next build`
32 static pages + 4 SSG legal + 6 SSG niche + 2 OG images (Turbopack, no
warnings). `next start -p 3123` sweep with `APP_PASSWORD` + `CRON_SECRET` set:
all 38 routes 200 (`?surface=` per surface; dashboard with a minted
`hg_app_session` cookie), zero "Application error" / "BUILDER REPLACES" /
"lorem"; OG images 1200×630 `image/png` (61 KB / 61 KB) served through the
proxy pass-through; `/changes/pi-001/export` is `text/csv`; `/login` with a
session → 307 `/`, without → 200 form; gated routes without a session → 307
`/login`; `/api/cron/audit` 401 without bearer, 200 JSON with it; `/agency/…`
and `/app/…` typed directly → 307 to the clean path; per-surface 404s render
in their own chrome; robots.txt and sitemap.xml are host-aware (agency host
18 URLs, ads host 6, app host `Disallow: /` + empty sitemap, neutral host
both = 24). Playwright pass at 375 and 1440 on 15 representative routes: no
horizontal scroll, no element past the viewport edge, no broken images, no
console errors, only Inter + Geist Mono. Server killed; the `.data/` audit
history the cron smoke run wrote (gitignored) was removed.

Gate behaviour to know: under `next start` (`NODE_ENV=production`) the
dashboard and cron route **fail closed** — without `APP_PASSWORD` `/login`
renders "Dashboard locked" and gated routes 307 there; without `CRON_SECRET`
the cron route returns 503. The "gate off → 307 home" convenience exists only
under `next dev`. Deliberate; the docblocks that imply otherwise are deferred
item 12.

### Deferred (low severity, 24)

Tap targets (WCAG 2.5.8 minimum is 24 px; brand target is 44 px on touch):
1. Nav wordmark link (`Logo` → `SiteNav`) hit area is text height only: 190×19 at 375, 109×14 / 207×17 in the dashboard rail. Pad the `<Link>` to a ≥44 px row.
2. Footer bottom-bar cross-surface links ("Ads Driver", "Dashboard", "HOMEGRWN Agency") are 16 px-tall `text-xs` targets (`SiteFooter.tsx` bottom row; the column links were fixed to 44 px rows).
3. Breadcrumb / back links are 17 px tall: "Part of Personal injury" (`LegalHero.tsx:30`), "Case studies" on the septic study, "← Accounts" (`app/accounts/[id]/page.tsx:56`).
4. Dashboard `TenantSwitcher` "Switch" button measures 22×14 (progressive-enhancement control at `TenantSwitcher.tsx:143`); give it the select's height or hide it once JS owns `change`.
5. Dashboard "All accounts →", "All findings →", "Review change-set →" and every `FindingRow` title link are 20 px tall; make the row the target.
6. Dashboard pack/category `<select>`s are 34 px tall (`FindingsFilters.tsx:72`); the severity chips already sit in 44 px wrappers.
7. The closed mobile `<details>` menu's links report non-zero boxes (4×59) to the scanner — a `<details>` measurement artifact; confirm in a real Safari pass that they are not Tab-reachable while closed.

Performance / hygiene:
8. Dashboard rail `<Link>`s prefetch every dynamic route twice per page load (two `_rsc` keys) and `/accounts/[id]` prefetches all 7 pack variants — 11–28 RSC requests per visit; Playwright `networkidle` never settles. Add `prefetch={false}` to `NavLinks` and the pack switcher.
9. Footer lockup `<Image sizes="Npx">` emits a full-width srcset, so browsers may request `w=3840` for a 468 px raster (the optimizer returns the original; no upscale, but the URL is misleading). Use `unoptimized` or drop `sizes` (`Logo.tsx`).
10. Honeypot wrappers use `absolute -left-[9999px]` (`StrategyCallForm.tsx:203`, `ApplyForm.tsx:245`); overflow scanners flag them. The clip-rect pattern has no layout footprint.
11. `sitemap.ts` stamps `lastModified = new Date()` on every request, so every URL claims "modified now". Drop it or derive from content.
12. Docblocks in `app/_lib/auth.ts` and `api/cron/audit/route.ts` say local `next start` runs are allowed with the secrets unset; only `next dev` is. Correct the comments (behaviour is right).
13. `CASE_STUDY_SLUGS` in `src/lib/seo.ts` is hand-maintained — a new case study needs two edits until a registry exists.
14. `SURFACE_HOSTS` still carries the four legacy `homegrwnagency.com` hosts; drop after 2026-10-17.
15. 404 pages emit a browser console error ("Failed to load resource: 404") — inherent to a correct 404 status; noise only.
16. `/book` is a dynamic route because it reads `searchParams` for `?trade=`; a client-side preselect would let it prerender.

Brand / content:
17. Ads Driver home uses `lime-300` on the four `NichePacks` "you handle" lines (`NichePacks.tsx:70`) alongside `lime-500` — within brand (soft accent) but two lime tints in one viewport; consider one.
18. Dashboard severity styling uses two reds (`red-300` text on `red-500`/`red-400` chrome, `severity.tsx:15-25`); brand allows "a restrained red" — consolidate to one.
19. The word "testimonials" appears in `ProofPlaceholder` / `LegalProof` copy on every agency page ("no stock-name testimonials") — a literal-scanner false positive; reword if compliance greps keep tripping on it.
20. Septic case study: `YOUTUBE_EMBED_URL` is `undefined` (`septic-google-ads/page.tsx:43`) → poster only until the embed URL is supplied.
21. Vector logo still pending; the raster lockup ships in the footer (documented in `docs/brand.md`).
22. Privacy policy remains the counsel-pending draft (`PrivacyPolicy.tsx`, `TODO(counsel)`), badged as such on both public surfaces.

Operational:
23. `BOOK_WEBHOOK_URL` / `APPLY_WEBHOOK_URL` are set in no environment yet; both forms render the honest "couldn't send" state until the n8n intake workflows exist.
24. Dashboard auth is a single shared `APP_PASSWORD` with per-instance rate limiting; per-user auth and a KV-backed limiter arrive with the first manager-linked client (`docs/site-architecture.md` → Tenant model).
