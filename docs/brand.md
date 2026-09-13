# HOMEGRWN brand system

Source of truth for every HOMEGRWN surface (agency site, Ads Driver product site,
multi-tenant dashboard). Extracted 2026-09-13 from the last live Framer build of
homegrwnagency.com (snapshot in `public/brand/legacy/`) and the legacy logo.

## Identity

- **Wordmark:** HOMEGRWN — always uppercase, heavy geometric sans, wide tracking.
- **Lockup:** `HOMEGRWN` over a warped checkered flag over `GROWTH PARTNERS`
  (`public/brand/homegrwn-wordmark-flag.png`, 468×282 raster; vector pending —
  Nathan has the source file on another device). Treat the raster as a placeholder
  that the vector will replace 1:1; do not redraw it.
- **Motif:** the checkered flag = finish line / speed / winning the race for
  attention. Use it sparingly: hero accent, section dividers, loading states.
  Never as a full-bleed background.
- **Tagline (legacy, keep):** "Growth Partners." Secondary line for the agency:
  "You handle the work. We handle the tech."

## Color tokens (canonical)

Sampled from the legacy CSS. Names are the ones every surface must use.

| Token | Hex | Role |
|---|---|---|
| `ink-950` | `#0d0d0d` | True black. Page background on dark surfaces. |
| `charcoal-900` | `#1d1f13` | **The "dark green charcoal."** Primary dark surface, cards, nav. Green-cast, not neutral. |
| `charcoal-700` | `#404245` | Secondary surface, borders on dark, muted text on light. |
| `slate-800` | `#262c37` | Tertiary dark, used for depth steps behind glass. |
| `forest-800` | `#14281b` | *Derived.* Deep green for gradients/Forest-theme depth. Not in legacy CSS — added for range. |
| `lime-500` | `#a9ed42` | **Neon green.** Primary accent, CTAs, active states, data highlights. |
| `lime-300` | `#dbff94` | Hover/soft accent, chart secondary. |
| `lime-100` | `#f0ffd1` | Tinted backgrounds on light surfaces, subtle highlights. |
| `sage-100` | `#eaf0dd` | Light-surface background (legacy body bg on light sections). |
| `paper-50` | `#f7f8f5` | Off-white. Light page background. |
| `white` | `#ffffff` | Text on dark, card surfaces on light. |
| `grey-200` | `#d6d6d6` | Dividers on light. |

Rules:
- Dark-first. Default page ground is `ink-950` → `charcoal-900` gradient with
  the grain texture (`public/brand/legacy/hero-grain-charcoal.png` as reference —
  reproduce with CSS noise, don't ship the 700 KB PNG).
- `lime-500` is the only saturated color. One accent per viewport. Never use it
  for body text on light backgrounds (contrast fails); use `charcoal-900`.
- The legacy `rgb(0,153,255)` blue was Framer's default link color, **not brand**.
  No blue anywhere.
- Light sections use `sage-100`/`paper-50`, never pure white pages.

## Typography

- Legacy face: **Inter**. Keep Inter for body/UI (`next/font/google`).
- Display: Inter at 800–900 weight, tight leading (0.95–1.0), tracking -0.02em
  for headlines; +0.14em uppercase for eyebrows/labels. The wordmark's geometric
  feel comes from weight + tracking, not a second family.
- Mono for data (dashboard, IDs, money): Geist Mono (already in the repo).
- Scale: 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 88. Fluid with `clamp()`.

## Per-surface theme mapping

The user chose TypeUI theme *directions*. Until TypeUI MCP is authorized (see
`docs/build-log.md`), these are implemented natively with the tokens above:

| Surface | Route group | TypeUI direction | Native interpretation |
|---|---|---|---|
| Agency site (homegrwnagency.com) | `(agency)` | **Forest** (or Mars) | Organic dark: `charcoal-900`/`forest-800` grounds, grain texture, generous whitespace, editorial serif *not used* — stays sans. Lime as growth accent. Rounded-2xl cards, soft 1px `charcoal-700` borders. |
| Ads Driver product site | `(ads-driver)` | **Mars × Perspective** | Bolder, more "product": `ink-950` ground, large numerals, isometric/3D depth cues (layered translucent planes, subtle perspective transforms on hero art), sharper radii (xl), stronger contrast, lime data-glow. |
| Dashboard / reporting | `(app)` | **Glassmorphism** (over Material) | Translucent panels (`bg-white/5`, `backdrop-blur-xl`, 1px `white/10` border, inner highlight), layered over the charcoal→forest gradient. Dense data, mono numerals, lime for positive deltas, a restrained red for negative. Motion: 150–200ms ease-out only. |

## Imagery

- Legacy assets worth reusing: septic case-study video thumbnail
  (`public/brand/legacy/case-study-septic-google-ads-thumb.png`), the three
  "experience with household brands" badges (Clarins, Nordstrom, Hyundai — these
  are *experience* claims, not client logos; label them accordingly).
- New imagery direction: real trade photography (trucks, crews, job sites) in
  monochrome with a lime duotone, or abstract data/terrain renders. No stock
  handshake photos, no generic "AI" glow-brain art.
- Icons: Lucide, 1.5px stroke, `lime-500` on dark.

## Voice

- Direct, operator-to-operator. Short sentences. Numbers over adjectives.
- Legacy lines to keep: "You handle the tanks. We handle the tech." (generalize
  per niche: "You handle the roofs / the cases / the calls…"), "No contracts.
  No commitments. Earn your trust through results."
- **Compliance:** no fabricated social proof. The legacy site carried
  "55,000+ trusted businesses", "92% of clients", "3x ROI in 60 days",
  "10,000+ leads" and three stock-name testimonials — none substantiated.
  Ship only claims Nathan can back: see `CLAIMS_TO_VERIFY` in
  `docs/content/claims.md`. Placeholders must be visibly marked, never plausible.
