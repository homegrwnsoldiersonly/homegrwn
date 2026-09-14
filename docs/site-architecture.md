# Site architecture — one app, three surfaces

Decided 2026-09-13. One Next.js 16 app (this repo), three surface folders, host-based
routing. Chosen over a monorepo because all three surfaces share brand tokens,
the knowledge engine, and one deploy; splitting them buys nothing yet.

```
src/app/
  layout.tsx         root: html/body, fonts (Inter + Geist Mono), metadataBase
  agency/            homegrwndigital.com          — HOMEGRWN agency site
    layout.tsx                                   nav + footer (Forest direction)
    page.tsx                                     home
    niches/[slug]/page.tsx                       one template, data-driven
    legal/[slug]/page.tsx                        PI parent + sub-niches
    case-studies/…                               septic Google Ads study first
    free-training/page.tsx                       legacy "A–Z training" page, kept as lead magnet
    book/page.tsx                                strategy-call CTA target (reads ?trade=)
    privacy/page.tsx                             policy stub (TODO counsel)
    opengraph-image.tsx                          generated OG image for the whole surface
    not-found.tsx · [...rest]/page.tsx           per-surface 404 (catch-all → notFound())
  ads/               adsdriver.homegrwndigital.com (or homegrwn.io) — product site
    layout.tsx · page.tsx · how-it-works · pricing · faq · apply · privacy · opengraph-image · not-found
  app/               app.homegrwndigital.com       — multi-tenant reporting dashboard
    layout.tsx (tenant shell) · page.tsx · accounts/[id] · findings · changes · history
  api/…
  sitemap.ts · robots.ts   host-aware (per production host; dashboard disallowed)
src/proxy.ts         host → surface-folder rewrite (Next 16: middleware is `proxy`)
src/lib/surface.ts   pure host/query/cookie → surface resolution (unit-tested)
src/lib/surfaces.ts  cross-surface hrefs: canonical host in production, ?surface= elsewhere
src/lib/seo.ts       public route lists, robots rules, openGraphFor(), JSON-LD (unit-tested)
src/content/         niche + legal content files (typed via src/content/types.ts), claims-gated copy
src/lib/brand/       tokens.ts (mirrors docs/brand.md), fonts.ts
src/components/ui/   shared primitives (Container, Section, Heading, Button, Card, GlassPanel, Stat, Logo, CheckerFlag, FAQ, Marquee, ProofPlaceholder, CTAStrip)
src/components/layout/ SiteNav + SiteFooter primitives each surface layout composes
```

### Why top-level folders, not route groups (decided 2026-09-13, foundation build)
The original plan named the surfaces `(agency)`, `(ads-driver)`, `(app)`. Next 16's
route-group convention omits the group from the URL, and routes in different groups
"should not resolve to the same URL path" — so three `page.tsx` files at `/` would
collide, and a proxy rewrite has no path it can target a group by. Each surface is
therefore a real folder (`agency/`, `ads/`, `app/`) and `src/proxy.ts` rewrites the
clean public path onto it: `/niches/septic` on the agency host → `/agency/niches/septic`
internally. Consequences:

- **Reserved prefixes:** no public route may start with `/agency`, `/ads` or `/app`.
  A direct hit on one (typed by hand) is 307-redirected to the clean path with the
  surface cookie set, so the folder names never become canonical URLs.
- **Links stay clean.** Write `href="/accounts/123"`, never `/app/accounts/123`.
  Generated `PageProps<…>` types use the internal path (`"/app/accounts/[id]"`).
- **404s per surface:** each folder has `not-found.tsx` plus a `[...rest]/page.tsx`
  that calls `notFound()`, so unmatched URLs render inside that surface's chrome.
  The root `src/app/not-found.tsx` only serves paths the proxy skips.
- `src/app/page.tsx` no longer exists; `/` always resolves through the proxy.
- **Generated metadata images** (`opengraph-image`, `twitter-image`, `icon`) are
  emitted by Next with the internal prefix (`/agency/opengraph-image`); the proxy
  serves those directly (`isMetadataImagePath`) instead of redirecting them.
- **Cross-surface links** must be full-document `<a>` links built with
  `surfaceHref()` from `src/lib/surfaces.ts` — never `<Link>` to a hardcoded host.
- **`openGraph` merge trap:** Next merges `openGraph` shallowly per segment. A
  page that defines its own `openGraph` must build it with `openGraphFor(surface,
  …)` from `src/lib/seo.ts` or it ships without the surface's OG image.

## Host routing
Vercel serves all three domains from one project. `src/proxy.ts` reads the host and
rewrites to the matching surface folder. Resolution order (first match wins):

1. **Host names a surface** — production hosts (`homegrwndigital.com`/`www` → agency,
   `app.homegrwndigital.com` → app, `adsdriver.homegrwndigital.com` / `homegrwn.io` →
   ads) or a `<surface>.localhost` subdomain (`app.localhost:3000`, `ads.localhost:3000`).
   The old `homegrwnagency.com` hosts stay mapped to the same surfaces as legacy
   entries and — like `www.` and alias domains such as `homegrwn.io` — are
   **301'd to the canonical host** in `SURFACE_URLS` by `canonicalRedirect()`
   (path + query preserved). Changing `SURFACE_URLS` re-points every alias.
   Drop the legacy entries after 2026-10-17.
2. **`?surface=agency|ads|app`** query (aliases: `ads-driver`, `adsdriver`, `dashboard`).
   Persisted in the `hg_surface` cookie (30 days) so subsequent clean-URL navigations
   stay on that surface. This is how every surface is reviewable on `*.vercel.app`.
3. **`hg_surface` cookie.**
4. **Default → agency.**

The proxy also sets an `x-hg-surface` request header (readable via `headers()` in
server code — note that makes the route dynamic) and skips `/api/*`, `/_next/*` and
any path with a file extension (`public/` assets).

## Niche content model
`src/content/niches/<slug>.ts` exports a typed `NicheContent`: hero, pains,
offer blocks, proof (claims-gated), FAQ, CTA. Home-services v1: septic, hvac,
roofing, plumbing, solar, electrical. Legal v1: personal-injury (parent) with
car-accident, truck-accident, mass-tort. The knowledge packs in
`src/lib/knowledge/packs/` are the *engine's* judgment for the same niches; the
content files are the *marketing* voice. Keep them separate; link them by slug.

## Tenant model (dashboard v1)
No auth provider is chosen yet (that's an account decision for Nathan). v1 is a
tenant switcher over the existing `AdsDataSource` — fixtures + a CSV-ingested
"case study" tenant kind — behind an env-gated basic password, `noindex`. Auth
lands when the first real client is manager-linked.

## Domains
- **homegrwndigital.com** — the brand domain, purchased on IONOS 2026-09-13
  ($10/yr year 1, then $20/yr). DNS: MX `smtp.google.com` + Google SPF are live at
  IONOS (the connect@ Google Workspace account is renamed to
  `connect@homegrwndigital.com`); site DNS to Vercel is still pending. Apex →
  agency; `app.` → dashboard; `adsdriver.` → product.
- **homegrwnagency.com** — abandoned (was Framer-built; registered via Tucows).
  Expires 2026-10-17; a transfer-out hedge attempt is in progress. Not renewed.
  Its hosts stay in `SURFACE_HOSTS` as legacy entries until 2026-10-17.
- Optional product domain: homegrwn.io ($30) / homegrwn.co ($29.99); homegrwn.com
  is taken. adsdriver.ai/.com taken.
