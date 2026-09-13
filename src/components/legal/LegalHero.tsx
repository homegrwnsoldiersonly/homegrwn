import Link from "next/link";
import {
  Button,
  CheckerFlag,
  Container,
  Eyebrow,
  Heading,
  Section,
} from "@/components/ui";
import type { LegalContent } from "@/content/types";

export interface LegalHeroProps {
  content: LegalContent;
  /** When rendering a sub-niche, the parent niche for the "part of" link. */
  parent?: Pick<LegalContent, "slug" | "name"> | null;
}

/** Legal niche hero: eyebrow, headline, subhead, owner line, CTAs. */
export function LegalHero({ content, parent }: LegalHeroProps) {
  return (
    <Section variant="grain" padding="lg" as="div">
      <Container>
        {parent && (
          <p className="mb-5 text-sm text-white/60">
            <Link
              href={`/legal/${parent.slug}`}
              className="transition-colors duration-150 ease-brand hover:text-lime-500"
            >
              <span aria-hidden>&larr; </span>
              Part of {parent.name}
            </Link>
          </p>
        )}
        <Eyebrow flag>{content.eyebrow}</Eyebrow>
        <Heading as="h1" size="display-lg" className="mt-5 max-w-4xl text-balance">
          {content.headline}
        </Heading>
        <p className="mt-6 max-w-2xl text-md text-white/70">{content.subhead}</p>
        <p className="mt-6 text-lg font-semibold text-white">
          {content.youHandleLine}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={content.cta.href}>{content.cta.label}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
        <CheckerFlag size={18} cols={14} rows={3} className="mt-14" />
      </Container>
    </Section>
  );
}
