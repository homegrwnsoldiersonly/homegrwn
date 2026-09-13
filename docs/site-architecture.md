# Site architecture — one app, three surfaces

Decided 2026-09-13. One Next.js 16 app (this repo), three route groups, host-based
routing. Chosen over a monorepo because all three surfaces share brand tokens,
the knowledge engine, and one deploy; splitting them buys nothing yet.

```
src/app/
  (agency)/          homegrwnagency.com          — HOMEGRWN agency site
    page.tsx                                     home
    niches/[slug]/page.tsx                       one template, data-driven
    legal/[slug]/page.tsx                        PI parent + sub-niches
    case-studies/…                               septic Google Ads study first
    free-training/page.tsx                       legacy "A–Z training" page, kept as lead magnet
    book/page.tsx                                strategy-call CTA target
  (ads-driver)/      adsdriver.homegrwnagency.com (or homegrwn.io) — product site
    page.tsx · how-it-works · pricing · faq · apply
  (app)/             app.homegrwnagency.com       — multi-tenant reporting dashboard
    layout.tsx (tenant shell) · page.tsx · accounts/[id] · findings · changes · history
  api/…
src/proxy.ts         host → route-group rewrite (Next 16: middleware is `proxy`)
src/content/         niche + legal content files (typed), claims-gated copy
src/lib/brand/       tokens.ts (mirrors docs/brand.md), fonts
src/components/      shared primitives + per-surface components
```

## Host routing
Vercel serves all three domains from one project. `src/proxy.ts` reads the
host and rewrites to the matching route group. Locally, `?surface=agency|ads|app`
or `*.localhost` subdomains select the surface. Every surface also works on the
`*.vercel.app` preview URL via the query switch so previews are reviewable.

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

## Domains (pending Nathan)
- homegrwnagency.com — **renew at Hover before 2026-10-17** (the connect@ Google
  account lives on it). Apex → agency; `app.` → dashboard; `adsdriver.` → product.
- Optional product domain: homegrwn.io ($30) / homegrwn.co ($29.99); homegrwn.com
  is taken. adsdriver.ai/.com taken.
