/**
 * Content model for the data-driven niche pages.
 *
 * `src/content/niches/<slug>.ts` and `src/content/legal/<slug>.ts` export one
 * of these; `src/app/agency/niches/[slug]/page.tsx` renders it. This is the
 * MARKETING voice for a niche — the engine's judgment for the same niche lives
 * in `src/lib/knowledge/packs/` and is linked only by `slug`.
 *
 * Claims gate (docs/content/claims.md): nothing in these files may carry a
 * number, percentage, client count, testimonial, or client brand name unless
 * that claim is VERIFIED in the register. Proof sections render
 * <ProofPlaceholder /> until then.
 */

export type Vertical = "home-services" | "legal";

export interface Pain {
  title: string;
  body: string;
}

export interface OfferBlock {
  title: string;
  body: string;
  /** Lucide icon name (e.g. "PhoneCall"). Resolved by the renderer. */
  icon: string;
}

export interface Step {
  step: number;
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface Seo {
  title: string;
  description: string;
}

export interface NicheContent {
  /** URL slug, also the key that links to the knowledge pack. */
  slug: string;
  /** Display name, e.g. "Septic". */
  name: string;
  vertical: Vertical;
  eyebrow: string;
  headline: string;
  subhead: string;
  /** e.g. "You handle the tanks. We handle the tech." */
  youHandleLine: string;
  pains: Pain[];
  offer: OfferBlock[];
  howItWorks: Step[];
  faq: FaqItem[];
  cta: CtaLink;
  seo: Seo;
  /** Slugs of related niches for cross-linking. */
  related: string[];
}

/** Legal parent niche (personal-injury) with optional sub-niche slugs. */
export type LegalContent = NicheContent & { subNiches?: string[] };
