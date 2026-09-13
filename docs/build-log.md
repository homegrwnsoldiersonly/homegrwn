# Build log

Decisions and state, newest first. This is the documentation Nathan asked for.

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

**Domain:** homegrwnagency.com was on Framer (cancelled). Registered at Hover, expires
2026-10-17. Renewal is mandatory — `connect@homegrwnagency.com` is the HOMEGRWN Google
account. Snapshot of the last Framer build is in `public/brand/legacy/`.

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
