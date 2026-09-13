import type { LegalContent } from "@/content/types";
import { personalInjury } from "./personal-injury";
import { carAccident } from "./car-accident";
import { truckAccident } from "./truck-accident";
import { massTort } from "./mass-tort";

/**
 * Legal vertical content registry. `personal-injury` is the parent; the
 * others are sub-niches rendered as siblings under /legal/<slug>.
 * Order here is the display order on the /legal index.
 */
export const LEGAL_PARENT_SLUG = "personal-injury" as const;

const ALL: readonly LegalContent[] = [
  personalInjury,
  carAccident,
  truckAccident,
  massTort,
];

export const LEGAL_CONTENT: Readonly<Record<string, LegalContent>> =
  Object.fromEntries(ALL.map((c) => [c.slug, c]));

export const LEGAL_SLUGS: readonly string[] = ALL.map((c) => c.slug);

export function getLegalContent(slug: string): LegalContent | undefined {
  return LEGAL_CONTENT[slug];
}

export function isLegalSlug(slug: string): boolean {
  return Object.hasOwn(LEGAL_CONTENT, slug);
}

/** The parent niche (personal injury). */
export function getLegalParent(): LegalContent {
  return LEGAL_CONTENT[LEGAL_PARENT_SLUG];
}

/** Every legal niche in display order. */
export function listLegalContent(): readonly LegalContent[] {
  return ALL;
}

export { personalInjury, carAccident, truckAccident, massTort };
