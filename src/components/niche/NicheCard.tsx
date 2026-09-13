import Link from "next/link";
import type { NicheContent } from "@/content/types";
import { Card, Eyebrow, Heading } from "@/components/ui";

export interface NicheCardProps {
  niche: NicheContent;
  /** compact = eyebrow + name + youHandleLine (related row); full adds the subhead. */
  variant?: "compact" | "full";
  /** Heading level for the card title. */
  headingLevel?: "h2" | "h3";
}

/** Link card to /niches/[slug]. Whole card is the link target. */
export function NicheCard({
  niche,
  variant = "full",
  headingLevel = "h3",
}: NicheCardProps) {
  return (
    <Card
      as="li"
      interactive
      padding="none"
      className="border-white/10 bg-white/[0.03]"
    >
      <Link
        href={`/niches/${niche.slug}`}
        className="flex h-full flex-col rounded-2xl p-6 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Eyebrow as="span" tone="muted">
          {niche.eyebrow}
        </Eyebrow>
        <Heading as={headingLevel} size="title" className="mt-3">
          {niche.name}
        </Heading>
        <p className="mt-2 text-base font-semibold text-lime-500">
          {niche.youHandleLine}
        </p>
        {variant === "full" && (
          <p className="mt-3 text-base text-white/70">{niche.headline}</p>
        )}
        <span
          aria-hidden
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-white/80"
        >
          See the {niche.name.toLowerCase()} playbook
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </Link>
    </Card>
  );
}
