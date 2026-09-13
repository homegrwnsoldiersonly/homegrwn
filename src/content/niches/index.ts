import type { NicheContent } from "@/content/types";
import { electrical } from "./electrical";
import { hvac } from "./hvac";
import { plumbing } from "./plumbing";
import { roofing } from "./roofing";
import { septic } from "./septic";
import { solar } from "./solar";

/**
 * Home-services niche registry. Order here is display order on /niches and in
 * generateStaticParams. Add a trade by exporting a NicheContent from a sibling
 * file and appending it below.
 */
export const NICHES: readonly NicheContent[] = [
  septic,
  hvac,
  roofing,
  plumbing,
  solar,
  electrical,
];

export const NICHE_SLUGS = NICHES.map((n) => n.slug);
export type NicheSlug = (typeof NICHES)[number]["slug"];

const BY_SLUG: ReadonlyMap<string, NicheContent> = new Map(
  NICHES.map((n) => [n.slug, n]),
);

/** Look up a niche by URL slug. Returns undefined for unknown slugs. */
export function getNiche(slug: string): NicheContent | undefined {
  return BY_SLUG.get(slug);
}

/** All niches in display order. */
export function listNiches(): NicheContent[] {
  return [...NICHES];
}

/** Resolve a niche's `related` slugs to content, skipping unknown ones. */
export function relatedNiches(niche: NicheContent): NicheContent[] {
  return niche.related
    .map((slug) => BY_SLUG.get(slug))
    .filter((n): n is NicheContent => n !== undefined && n.slug !== niche.slug);
}

export { septic, hvac, roofing, plumbing, solar, electrical };
