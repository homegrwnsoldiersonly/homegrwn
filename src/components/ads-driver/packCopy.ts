/**
 * Marketing-owned, claims-gated copy for the niche packs the Ads Driver home
 * lists (NichePacks.tsx).
 *
 * Keyed by engine pack id (src/lib/knowledge/packs) so the site can only
 * describe a pack that exists — but the words are ours. Engine `description`
 * strings are operator notes and may legitimately carry benchmarks that are
 * not VERIFIED in docs/content/claims.md, so they never render raw on a
 * public surface (docs/site-architecture.md: packs are the engine's judgment,
 * content is the marketing voice; keep them separate, link by slug).
 *
 * Rules for every entry: no digits, no percent signs, no outcome or value
 * promises. packCopy.test.ts enforces the first two and that every selectable
 * pack has an entry, so a new pack cannot ship without copy — or with a
 * silent fallback to the engine string.
 */

export interface PackCopy {
  /** One or two plain sentences: what the pack is for, no numbers. */
  description: string;
}

export const PACK_COPY: Readonly<Record<string, PackCopy>> = {
  "home-services": {
    description:
      "Call-driven local trades, where Local Services allocation, service-area geometry, seasonality, and job value decide whether the spend pays.",
  },
  "hs-hvac": {
    description:
      "Weather-cyclical trade with a job-value split between service calls and installs wide enough to break value-blind bidding. Value tracking and seasonal pacing decide profitability.",
  },
  "hs-roofing": {
    description:
      "Storm-driven, insurance-funded, high-ticket trade. Surge readiness and homeowner-versus-shopper filtering decide the year.",
  },
  "legal-personal-injury": {
    description:
      "High-CPC, high-case-value advertising where signed-case economics, not form-fill volume, govern every decision.",
  },
  "legal-pi-car-accident": {
    description:
      "High-volume, commoditized PI. Negative-keyword discipline and intake speed matter more than clever targeting.",
  },
  "legal-pi-truck-accident": {
    description:
      "Low-volume, very-high-value PI. Precision targeting and patience beat volume plays; the signal is too sparse to react to month by month.",
  },
  "legal-pi-mass-tort": {
    description:
      "National-scale claimant acquisition for specific torts. Geography rules invert; eligibility screening and cost per qualified claimant govern everything.",
  },
};
