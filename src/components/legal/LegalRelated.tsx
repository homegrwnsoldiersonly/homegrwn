import Link from "next/link";
import { Card, Container, Eyebrow, Heading, Section } from "@/components/ui";
import type { LegalContent } from "@/content/types";
import { LegalIcon } from "./LegalIcon";

export interface LegalRelatedProps {
  eyebrow: string;
  heading: string;
  items: readonly LegalContent[];
  /** Slug rendered without a link (the current page), if present. */
  currentSlug?: string;
  /** Section ground. Light by default so it separates from the dark FAQ. */
  variant?: "light" | "dark";
}

/** Cross-link cards to the parent / sibling legal niches. */
export function LegalRelated({
  eyebrow,
  heading,
  items,
  currentSlug,
  variant = "light",
}: LegalRelatedProps) {
  const isLight = variant === "light";
  return (
    <Section variant={variant} id="related">
      <Container>
        <Eyebrow tone={isLight ? "dark" : "muted"}>{eyebrow}</Eyebrow>
        <Heading as="h2" size="display-sm" className="mt-4 max-w-3xl text-balance">
          {heading}
        </Heading>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isCurrent = item.slug === currentSlug;
            const inner = (
              <>
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={
                      isLight
                        ? "text-xs font-semibold uppercase tracking-eyebrow text-charcoal-700"
                        : "text-xs font-semibold uppercase tracking-eyebrow text-white/60"
                    }
                  >
                    {item.name}
                  </span>
                  <LegalIcon
                    name="Scale"
                    size={18}
                    className={isLight ? "text-charcoal-900" : "text-lime-500"}
                  />
                </span>
                <Heading as="h3" size="subtitle" className="mt-3">
                  {item.headline}
                </Heading>
                <span
                  className={
                    isLight
                      ? "mt-3 block text-sm text-charcoal-700"
                      : "mt-3 block text-sm text-white/70"
                  }
                >
                  {item.eyebrow}
                </span>
              </>
            );
            return (
              <Card
                key={item.slug}
                as="li"
                tone={isLight ? "light" : "dark"}
                padding="md"
                interactive={!isCurrent}
                className={isCurrent ? "opacity-60" : undefined}
              >
                {isCurrent ? (
                  <div aria-current="page">{inner}</div>
                ) : (
                  <Link href={`/legal/${item.slug}`} className="block">
                    {inner}
                  </Link>
                )}
              </Card>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
