# Design directions — TypeUI skills, reconciled with the HOMEGRWN brand

Pulled 2026-09-13 from the public TypeUI skill pages (no account needed for the
previews; the MCP needs one). Each section: what the skill actually specifies →
what HOMEGRWN adopts → what HOMEGRWN overrides and why. `docs/brand.md` remains
the token authority; this file is the re-skin brief per surface.

## Forest → Agency site (homegrwndigital.com)

**Skill spec:** sustainability-inspired; deep green surfaces, fresh lime accent,
clean minimal layouts, generous rounded cards, flat trustworthy components.
Tokens: Surface `#345401`, Deep Surface `#1F3400`, Brand `#A1DA02`, Brand Medium
`#C6ED6B`, Heading `#F4FAE8`, Body `#C9D6B0`. 8px rhythm, equal section spacing,
1152px container, generous radius, **no drop shadows anywhere** — depth from
surface steps, borders, spacing, and the lime token. Typography direct, not
decorative; the lime carries the energy.

**Adopt:** the whole component language (flat, shadow-free, rounded cards on
stepped green surfaces), 1152px container, 8px rhythm, heading/body contrast
pairing, "lime carries the energy so type stays calm."

**Override:** Forest's surfaces are a saturated mid-green (`#345401`). HOMEGRWN's
legacy identity is *charcoal with a green cast* (`#1d1f13`) over true black. So:
`ink-950` = page, `charcoal-900` = Surface, `forest-800 #14281b` = Deep Surface
step, `lime-500 #a9ed42` = Brand (Forest's `#A1DA02` is within 3% — same family),
`lime-300 #dbff94` = Brand Medium, heading `paper-50`, body `sage-100` at 80%.
Result: Forest's structure and energy, HOMEGRWN's darker, more premium ground.

## Mars × Perspective → Ads Driver product site

**Mars spec:** dark mission-control; near-black continuous surface `#050505`,
Panel `#0D0B08` one step lighter, Brand `#BD5347` mars-red, Warning `#F59E2B`,
Body `#B7A98E`; Space Grotesk; 8px rhythm, **96px symmetric section spacing**,
1152px container, **12px card radius**; cards flat with 1px borders; *one
continuous surface* — section backgrounds never alternate or tint; vertical
rails reinforce the panel feel; the signature control is a **layered pill
button with inset highlights, clipped inner layers, press feedback** — gradients
live only inside the button, never on page/card backgrounds.

**Adopt:** everything structural — single continuous `ink-950` surface, panels
one step lighter (`charcoal-900`), 1px `charcoal-700` borders, 12px radius,
96px sections, vertical rails, telemetry-style labels and mono numerals, the
layered pill CTA (built once as `Button variant="pill"`), no background
gradients. This is the "mission room" tone for a product that watches an
auction 24/7.

**Override:** red/orange → **lime**. Brand rule: lime is the only saturated
color. Mars's Warning orange maps to a *restrained* amber used only for
severity badges inside the product UI, never in marketing surfaces. Space
Grotesk → Inter (brand consistency across surfaces); we get the "technical,
compact" feel through tighter tracking and mono for numbers.

**Perspective spec:** depth-driven — angled layouts, layered elements, visual
foreshortening, high-contrast surfaces so users *see* what's interactive vs
background. Single-accent identity: Primary = Secondary = `#00BD7D` vivid green
("depth and layering do the visual heavy lifting instead of competing colors").
Three-font system: Poppins body, **Oswald condensed display** (headings punch
forward, body recedes), JetBrains Mono. 4px base spacing (4/8/12/16/24/32):
tighter = same plane, wider = elevation change. Six-step type scale
12/14/16/20/24/32. Light surface `#FFFFFF`.

**Adopt from Perspective:** the single-accent doctrine (already ours: lime),
the *spatial* spacing rule (tight groups = one plane; generous gaps = a new
layer), foreshortened/angled hero compositions, layered planes for the
autonomy-ladder and loop diagrams, a condensed display treatment for hero
numerals and section eyebrows.

**Override:** Oswald → Inter 900 with tight tracking and reduced leading (we
get the condensed punch without a third family); light surfaces → Mars's dark
continuous surface; shadows → Perspective wants elevation via shadow, Mars
forbids it — resolve as: *no shadows on chrome* (Mars wins), depth only via
transforms, layered translucency and foreshortening *inside hero art and
diagrams* (Perspective wins there). That split is the whole point of "Mars ×
Perspective": mission-control chrome, dimensional illustrations.

## Material (runner-up, not used)

Spec: elevation-based layering, purposeful motion, monochromatic deep-violet
primary `#6442D6` + lavender secondary `#C8B3FD`, Inter body + Roboto display.
Nathan preferred Glassmorphism for the dashboard. Material's shadow-elevation
model conflicts with both Mars's flat chrome and glass's translucency, so it is
excluded rather than blended. One thing worth keeping: its "meaningful motion"
principle — every dashboard transition (tenant switch, filter, drawer) gets a
150–200ms ease-out, nothing decorative.

## Glassmorphism → Dashboard (app.homegrwndigital.com)

**Skill spec:** frosted-glass panels over a rich background. Blur levels:
light 8–12px, medium 16–20px, heavy 24–32px by layer role/density; fills at
60–80% opacity; 1px borders `rgba(255,255,255,0.18)` for the edge-light;
stacked z-levels with progressively stronger blur on top layers; **requires a
visually rich background** beneath. Primary `#1856FF` electric blue, Secondary
`#3A344E` plum, Success `#07CA6B`, Warning `#E89558`, Danger `#EA2143`, Text
`#141414`, Surface `#FFFFFF`. Plus Jakarta Sans + JetBrains Mono; mobile-first
compact type scale; comfortable density.

**Adopt:** the glass mechanics verbatim as three utilities (`glass-light`,
`glass-medium`, `glass-heavy`) with those blur bands, the 0.18-alpha white
border, stacked layers with increasing blur, the mobile-first compact scale,
comfortable density, mono for timestamps/IDs/money.

**Override:** light-mode white fills → **dark glass**: fills `rgba(255,255,255,
0.04–0.10)` over the `ink-950 → forest-800` gradient with grain (that is our
"rich background"). Electric blue → lime for primary/active (no blue rule).
Semantic colors kept but desaturated to sit on dark: success = `lime-500`,
warning = amber `#E8A54F`, danger = `#E0524A`, muted = `sage-100/60`. Plus
Jakarta → Inter, JetBrains Mono → Geist Mono.
