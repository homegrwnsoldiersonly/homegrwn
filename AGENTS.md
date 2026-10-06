<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HOMEGRWN identity rules — read before any git, Vercel, or DNS action

This repo belongs to **HOMEGRWN**, Nathan's own venture. It is **not** Express Capital
(ECF). The machine is signed in to both, and the ECF identities are the *active*
defaults in several tools — so the wrong account is the easy mistake, not the rare one.

## GitHub
- Correct account: **`homegrwnsoldiersonly`** — repo `homegrwnsoldiersonly/homegrwn`.
- `ExpressCapitalGit` is ECF-only and is usually the **active** `gh` account. Pushing
  with it fails: `remote: Permission to homegrwnsoldiersonly/homegrwn.git denied`.
- Push without switching the global account:
  ```sh
  TOK=$(gh auth token -u homegrwnsoldiersonly)
  git push "https://x-access-token:${TOK}@github.com/homegrwnsoldiersonly/homegrwn.git" <branch>
  ```
- `nathantunger-art` is retired and unreachable. Ignore it.
- Commit identity is already pinned repo-locally to `nathan.t.unger@gmail.com`.

## Vercel
- **Never deploy this repo with the `vercel` CLI.** The CLI on this Mac is logged in as
  `nathan-3028` (ECF) and can only reach `nathan-3028s-projects`. A CLI deploy would put
  HOMEGRWN inside Express Capital's account.
- Deploy through the claude.ai Vercel connector instead. Measured scope: it **can**
  `create_deployment` (including `gitSource` for a repo the project isn't linked to), but
  it **cannot** update a project — `add_project_domain`, settings, and git-link changes
  all return `403 no permission to update the project`. Those are dashboard actions.
- The project's git link does **not** point at this repo, so pushing does not
  auto-deploy. Ship explicitly with `create_deployment`, `gitSource`
  `{org: homegrwnsoldiersonly, repo: homegrwn, ref: <branch>}`, `target: production`.
- Hobby plan is non-commercial; this is a commercial agency site, so it needs Pro.

## Domains
- Canonical: **`homegrwndigital.com`** (agency), `app.` (dashboard),
  `adsdriver.` (Ads Driver). Registrar is **IONOS**.
- `homegrwnagency.com` is **legacy** — registrar Tucows via Framer, access lost,
  **expires 2026-10-17**. It is kept only as a 301 source in `src/lib/surface.ts`;
  drop those entries after it lapses.
- DNS lives at IONOS. When pointing the site at Vercel, **keep the `MX smtp.google.com`
  record and the Google SPF TXT** — they carry `connect@` mail. Removing them kills mail.

## Browser automation
- chrome-devtools MCP is broken on this Chrome (136+ blocks debugging on the default
  profile). Use the **Playwright MCP**; it has its own persistent profile that needs a
  one-time login per service. If it reports "Browser is already in use", a stale session
  holds the profile lock — find it with `ps aux | grep mcp-chrome`.
