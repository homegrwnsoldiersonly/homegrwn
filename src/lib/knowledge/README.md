# Domain-knowledge system

This module is the **moat**. Wiring the Google Ads API is commodity work; the
durable edge is *encoded judgment* — niche benchmarks, a model of the value the
ad platform can't see, and guardrails that stop the agent from doing the
platform-default dumb thing.

## Why generalists regress to the mean

Tools that optimize toward platform-visible proxy metrics ("maximize
conversions", raw form-fills) inherit Google's defaults, which are tuned for the
_median_ advertiser. In high-value, low-volume verticals that median is wrong:

- **Personal injury:** a click is \$50–\$400, a form-fill is nearly worthless,
  and a signed case is worth \$10k–\$1M+. The platform sees the form-fill, not
  the signed case. Optimizing to what it sees actively destroys value.
- **Local services:** cheap clicks, small budgets, call-driven intent, and a
  hard dependency on LSA and a profitable drive radius — all mis-weighted by a
  generalist.

The gap between _platform-visible metric_ and _real business outcome_ is the
entire game. This module encodes how to close it, per vertical.

## Shape

```
types.ts       Schema: AccountSnapshot (normalized API data) + NichePack
engine.ts      resolvePack() flattens inheritance; evaluateAccount() runs rules
helpers.ts     Small pure helpers shared by rules
packs/
  base.ts                  Universal anti-regression guardrails (all packs extend this)
  legal-personal-injury.ts PI economics: signed-case value, negatives, PMax caution
  home-services.ts         LSA-first, call tracking, service radius, seasonality
index.ts       Registry + audit(snapshot, packId)
fixtures.ts    Demo snapshots (messy PI, HVAC, and a clean control account)
```

A **pack** carries `benchmarks`, a `conversionModel` (the invisible-value fix),
`rules` (pure functions that emit prioritized, explainable `Finding`s),
`guardrails` (principles; hard gates once the agent can write), and `redFlags`.
Packs inherit via `extends` — every niche builds on `base`.

## Posture

**Recommend-only.** The engine never mutates an account. Every `Finding` has a
`recommendation` and a `nicheRationale`; a human decides what to apply. When the
agent later earns write access, `guardrails` become the hard constraints.

## Extending it

Add a vertical by writing one `packs/<niche>.ts` and registering it in
`index.ts`. Keep rules pure and covered by a fixture in `fixtures.ts`.

## Try it

```bash
npm run audit:demo        # messy PI demo account
npm run audit:demo hvac   # HVAC demo account
npm run audit:demo clean  # disciplined PI account (control — few findings)
npm test                  # rule + well-formedness tests
```
